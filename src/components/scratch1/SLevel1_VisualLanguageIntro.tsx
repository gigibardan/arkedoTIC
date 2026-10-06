import React, { useState, useEffect } from 'react';
import { 
  Puzzle, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Play, 
  ExternalLink, 
  Check, 
  RotateCcw,
  Layers,
  Cat,
  Compass
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface SLevel1Props {
  onCompletePage: (earnedScore: number) => void;
}

interface PuzzleBlock {
  id: string;
  category: 'events' | 'motion' | 'looks' | 'sound';
  colorClass: string;
  labelRo: string;
  labelEn: string;
  correctSlot: number;
}

const PUZZLE_BLOCKS: PuzzleBlock[] = [
  { id: 'b_flag', category: 'events', colorClass: 'bg-amber-500 border-amber-600 text-slate-950', labelRo: 'când se dă clic pe 🚩 (Steag Verde)', labelEn: 'when 🚩 clicked', correctSlot: 1 },
  { id: 'b_move', category: 'motion', colorClass: 'bg-blue-600 border-blue-700 text-white', labelRo: 'mergi 10 pași', labelEn: 'move 10 steps', correctSlot: 2 },
  { id: 'b_say', category: 'looks', colorClass: 'bg-purple-600 border-purple-700 text-white', labelRo: 'spune [Salut! Sunt RoboTIC] pentru 2 secunde', labelEn: 'say [Hello! I am RoboTIC] for 2 secs', correctSlot: 3 },
  { id: 'b_sound', category: 'sound', colorClass: 'bg-pink-600 border-pink-700 text-white', labelRo: 'redă sunetul [Miau] până la final', labelEn: 'play sound [Meow] until done', correctSlot: 4 }
];

export const SLevel1_VisualLanguageIntro: React.FC<SLevel1Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive Puzzle Stack State: slot index (1..4) -> assigned block id
  const [slots, setSlots] = useState<Record<number, string | null>>({
    1: null,
    2: null,
    3: null,
    4: null
  });
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [stackValidated, setStackValidated] = useState<boolean>(false);
  const [stackSuccess, setStackSuccess] = useState<boolean>(false);
  const [stackCooldown, setStackCooldown] = useState<number>(0);

  // Live Scratch Sprite Simulation
  const [simRunning, setSimRunning] = useState<boolean>(false);
  const [spriteX, setSpriteX] = useState<number>(0);
  const [spriteSpeech, setSpriteSpeech] = useState<string | null>(null);

  // Quiz State
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  // Cooldown decrement timer
  useEffect(() => {
    const hasActive = Object.values(cooldowns).some((c: number) => c > 0) || stackCooldown > 0;
    if (!hasActive) return;
    const timer = setInterval(() => {
      if (stackCooldown > 0) setStackCooldown(prev => (prev <= 1 ? 0 : prev - 1));
      setCooldowns(prev => {
        const next: Record<string, number> = {};
        for (const [k, v] of Object.entries(prev)) {
          const val = v as number;
          if (val > 1) next[k] = val - 1;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldowns, stackCooldown]);

  const handlePlaceBlock = (slotNum: number) => {
    if (!selectedBlockId) return;
    sounds.playClick();
    setSlots(prev => ({
      ...prev,
      [slotNum]: selectedBlockId
    }));
    setSelectedBlockId(null);
    setStackValidated(false);
  };

  const handleRemoveFromSlot = (slotNum: number) => {
    sounds.playClick();
    setSlots(prev => ({
      ...prev,
      [slotNum]: null
    }));
    setStackValidated(false);
  };

  const handleValidateStack = () => {
    if (stackCooldown > 0) return;
    const isSlot1Correct = slots[1] === 'b_flag';
    const isSlot2Correct = slots[2] === 'b_move';
    const isSlot3Correct = slots[3] === 'b_say';
    const isSlot4Correct = slots[4] === 'b_sound';

    const isAllCorrect = isSlot1Correct && isSlot2Correct && isSlot3Correct && isSlot4Correct;
    setStackValidated(true);

    if (isAllCorrect) {
      sounds.playCorrect();
      setStackSuccess(true);
      // Run script in simulation
      setSimRunning(true);
      setSpriteX(40);
      setSpriteSpeech(lang === 'en' ? 'Hello! I am RoboTIC 🐱' : 'Salut! Sunt RoboTIC 🐱');
      setTimeout(() => {
        sounds.playClick();
      }, 1000);
      setTimeout(() => {
        setSpriteSpeech(null);
        setSimRunning(false);
      }, 3000);
    } else {
      sounds.playWrong();
      setStackSuccess(false);
      setStackCooldown(5);
    }
  };

  // Quiz Handlers
  const isQ1Correct = q1Answer === 'mit_puzzle';
  const handleQ1 = (id: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    sounds.playClick();
    setQ1Answer(id);
    if (id === 'mit_puzzle') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const isQ2Correct = q2Answer === 'script_definition';
  const handleQ2 = (id: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    sounds.playClick();
    setQ2Answer(id);
    if (id === 'script_definition') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  // Score Calculation
  let totalScore = 0;
  if (stackSuccess) totalScore += 50;
  if (isQ1Correct) totalScore += 25;
  if (isQ2Correct) totalScore += 25;

  const isPageComplete = stackSuccess || (q1Answer !== null && q2Answer !== null) || totalScore >= 40;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-950/80 via-slate-900 to-amber-950/80 border border-orange-500/30 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-3xl shadow-inner">
              🐱
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-orange-400 font-mono">
                {lang === 'en' ? 'Module 6A • Page 1 of 7 • Scratch Intro' : 'Modulul 6A • Pagina 1 din 7 • Introducere Scratch'}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
                {lang === 'en' ? 'Visual Block Programming with Scratch 3.0' : 'Limbajul Vizual de Programare Scratch 3.0'}
              </h1>
            </div>
          </div>

          <a
            href="https://scratch.mit.edu/projects/editor/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs transition shadow-lg shadow-orange-500/30 shrink-0"
          >
            <span>{lang === 'en' ? 'Open Scratch Editor' : 'Deschide Scratch Online'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed mt-3">
          {lang === 'en'
            ? 'Created at MIT Media Lab, Scratch is a revolutionary visual programming language where code is built like colorful Lego/puzzle pieces. By snapping blocks together, you create interactive animations, stories, and games without syntax errors!'
            : 'Creat la MIT Media Lab (Massachusetts Institute of Technology), Scratch este un mediu vizual revoluționar în care instrucțiunile se asamblează intuitiv ca niște piese colorate de puzzle (Lego). Prin îmbinarea blocurilor se creează scripturi pentru personaje fără riscul de a greși sintaxa scrisă!'}
        </p>
      </div>

      {/* Interactive Puzzle Stack Builder */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-orange-500/30 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Puzzle className="w-5 h-5 text-orange-400" />
            <h2 className="text-sm sm:text-base font-bold text-white">
              {lang === 'en' ? 'Interactive Lab: Assemble Your First Scratch Script' : 'Laborator Interactiv: Asamblează Primul tău Script Scratch'}
            </h2>
          </div>
          <span className="text-[11px] font-mono text-orange-300 bg-orange-950/60 px-3 py-1 rounded-full border border-orange-500/30">
            {lang === 'en' ? 'Target: Green Flag → Move → Speak → Sound' : 'Obiectiv: Steag Verde → Mișcare → Replică → Sunet'}
          </span>
        </div>

        {/* Puzzle workspace grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left: Available Blocks Palette */}
          <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider flex items-center justify-between">
              <span>{lang === 'en' ? 'Blocks Palette (Click to pick):' : 'Paleta de Blocuri (Apasă pentru a alege):'}</span>
              {selectedBlockId && <span className="text-orange-400 text-[10px] animate-pulse">{lang === 'en' ? 'Selected!' : 'Selectat!'}</span>}
            </div>

            <div className="space-y-2">
              {PUZZLE_BLOCKS.map(block => {
                const isSelected = selectedBlockId === block.id;
                const isUsed = Object.values(slots).includes(block.id);

                return (
                  <button
                    key={block.id}
                    type="button"
                    disabled={isUsed}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedBlockId(block.id);
                    }}
                    className={`w-full p-3 rounded-xl font-mono text-xs font-bold text-left transition border-2 flex items-center justify-between cursor-pointer ${
                      isUsed 
                        ? 'opacity-30 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-500'
                        : isSelected
                        ? `${block.colorClass} ring-4 ring-orange-300 scale-102 shadow-lg`
                        : `${block.colorClass} opacity-90 hover:opacity-100 hover:scale-101 shadow-md`
                    }`}
                  >
                    <span>{lang === 'en' ? block.labelEn : block.labelRo}</span>
                    <span className="text-[10px] opacity-75 uppercase">🧩</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center: Script Assembly Zone */}
          <div className="lg:col-span-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
              {lang === 'en' ? 'Script Workspace (Click slot to place):' : 'Zona de Script (Apasă pe slot pentru a plasa):'}
            </div>

            <div className="space-y-2.5">
              {[1, 2, 3, 4].map(slotNum => {
                const placedBlockId = slots[slotNum];
                const block = PUZZLE_BLOCKS.find(b => b.id === placedBlockId);

                return (
                  <div key={slotNum} className="relative">
                    {block ? (
                      <div
                        onClick={() => handleRemoveFromSlot(slotNum)}
                        className={`p-3 rounded-xl font-mono text-xs font-bold border-2 flex items-center justify-between cursor-pointer shadow-md transition hover:ring-2 hover:ring-rose-400 ${block.colorClass}`}
                        title={lang === 'en' ? 'Click to remove block' : 'Apasă pentru a scoate blocul din script'}
                      >
                        <span>{lang === 'en' ? block.labelEn : block.labelRo}</span>
                        <span className="text-xs">✕</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handlePlaceBlock(slotNum)}
                        className={`w-full p-3 rounded-xl border-2 border-dashed font-mono text-xs text-center transition cursor-pointer ${
                          selectedBlockId
                            ? 'border-orange-400 bg-orange-950/30 text-orange-200 hover:bg-orange-900/40 animate-pulse'
                            : 'border-slate-700 bg-slate-900/50 text-slate-500 hover:border-slate-600'
                        }`}
                      >
                        {lang === 'en' ? `[ Slot ${slotNum}: Click to place selected block ]` : `[ Pasul ${slotNum}: Apasă pentru a plasa blocul ]`}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Live Interactive Scratch Stage Simulator */}
          <div className="lg:col-span-3 p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col items-center justify-between min-h-[260px] relative overflow-hidden">
            <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Scratch Stage</span>
              <span>480 x 360</span>
            </div>

            {/* Stage Canvas Area */}
            <div className="relative w-full h-36 bg-gradient-to-b from-sky-900/30 to-indigo-950/40 rounded-xl flex items-center justify-center my-2 border border-slate-800">
              {/* Sprite Speech Bubble */}
              {spriteSpeech && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white text-slate-950 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-slate-300 animate-bounce">
                  {spriteSpeech}
                </div>
              )}

              {/* Sprite Robot / Cat */}
              <div 
                className="text-4xl transition-all duration-700"
                style={{ transform: `translateX(${spriteX}px)` }}
              >
                🐱
              </div>
            </div>

            <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
              <span>x: {spriteX}</span>
              <span>y: 0</span>
              <span className={simRunning ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {simRunning ? '▶ Executing' : '⏹ Idle'}
              </span>
            </div>
          </div>
        </div>

        {stackCooldown > 0 && (
          <PedagogicalReflectionBanner
            cooldown={stackCooldown}
            totalSeconds={5}
            customMessageRo="Reflecție logică: În Scratch, execuția începe întotdeauna cu un eveniment (Steag Verde), urmat de mișcare și replică!"
            customMessageEn="Logical reflection: In Scratch, execution always begins with an event block (Green Flag)!"
          />
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setSlots({ 1: null, 2: null, 3: null, 4: null });
              setSelectedBlockId(null);
              setStackValidated(false);
              setStackSuccess(false);
              setSpriteX(0);
              setSpriteSpeech(null);
              sounds.playClick();
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Reset Script' : 'Resetează Scriptul'}</span>
          </button>
          <button
            type="button"
            disabled={stackCooldown > 0 || Object.values(slots).some(s => s === null)}
            onClick={handleValidateStack}
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-slate-950 font-black text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-orange-600/30 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>{lang === 'en' ? 'Run & Validate Script (+50 pts)' : 'Rulează & Validează Scriptul (+50 pct)'}</span>
          </button>
        </div>
      </div>

      {/* Formative Evaluation Quiz (2 Questions) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-orange-500/30 space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <BookOpen className="w-5 h-5 text-orange-400" />
          <h2 className="text-base sm:text-lg font-bold text-white">
            {lang === 'en' ? 'Formative Quiz: Scratch Concepts' : 'Test Formativ: Noțiuni Scratch'}
          </h2>
        </div>

        {/* Q1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-400 uppercase font-mono">
              {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
            </span>
            <QuestionHint
              hintRo="Scratch a fost conceput la MIT pentru a elimina greșelile de tastare, folosind blocuri colorate asemănătoare pieselor Lego."
              hintEn="Scratch was created at MIT using puzzle blocks so syntax typing errors cannot occur."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'Why is Scratch called a "visual block-based programming language"?'
              : 'De ce este Scratch numit un „limbaj de programare vizual bazat pe blocuri” (block-based)?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'mit_puzzle', ro: 'Instrucțiunile sunt reprezentate ca piese grafice de puzzle care se îmbină logic', en: 'Instructions are graphical puzzle blocks that snap together logically' },
              { id: 'wrong_1', ro: 'Funcționează doar dacă desenezi cu pensula pe ecran', en: 'It only works if you paint with a brush' },
              { id: 'wrong_2', ro: 'Este un simplu joc de tip Tetris pentru căderea fișierelor', en: 'It is a simple Tetris game for falling files' },
              { id: 'wrong_3', ro: 'Cere tastarea a sute de linii de cod în limba engleză veche', en: 'It requires typing hundreds of lines in old English' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q1 || 0) > 0}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'mit_puzzle'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-orange-400 text-slate-300'
                }`}
              >
                {lang === 'en' ? opt.en : opt.ro}
              </button>
            ))}
          </div>
          {cooldowns.q1 && cooldowns.q1 > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.q1}
              totalSeconds={5}
              customMessageRo="Reflecție didactică: Scratch folosește piese tip puzzle pentru a construi algoritmi vizuali!"
              customMessageEn="Pedagogical reflection: Scratch uses puzzle blocks for visual coding!"
            />
          ) : null}
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanationRo="Scratch elimină frustrarea erorilor de sintaxă prin blocuri colorate care se conectează doar dacă sunt compatibile logic."
              explanationEn="Scratch avoids syntax typing errors using colorful puzzle blocks that only connect when logically valid."
            />
          )}
        </div>

        {/* Q2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-400 uppercase font-mono">
              {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
            </span>
            <QuestionHint
              hintRo="Un script este succesiunea de blocuri conectate care dictează comportamentul unui personaj."
              hintEn="A script is the connected sequence of blocks governing a sprite's actions."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'What is a "script" in the Scratch environment?'
              : 'Ce este un „script” (program) în mediul Scratch?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'script_definition', ro: 'O succesiune ordonată de blocuri conectate care dictează acțiunile unui personaj', en: 'An ordered sequence of connected blocks commanding a sprite' },
              { id: 'wrong_1', ro: 'Numele imaginii de fundal de pe scenă', en: 'The background image name on the stage' },
              { id: 'wrong_2', ro: 'O tastă specială de pe tastatură', en: 'A special keyboard key' },
              { id: 'wrong_3', ro: 'Viteza conexiunii la internet', en: 'The internet connection speed' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q2 || 0) > 0}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'script_definition'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-orange-400 text-slate-300'
                }`}
              >
                {lang === 'en' ? opt.en : opt.ro}
              </button>
            ))}
          </div>
          {cooldowns.q2 && cooldowns.q2 > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.q2}
              totalSeconds={5}
              customMessageRo="Reflecție didactică: Scriptul este programul propriu-zis atașat fiecărui personaj!"
              customMessageEn="Pedagogical reflection: The script is the executable program attached to a sprite!"
            />
          ) : null}
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanationRo="Fiecare personaj din Scratch poate avea unul sau mai multe scripturi care rulează la comenzi specifice (ex: clic pe Steag Verde)."
              explanationEn="Each sprite can have one or more scripts executing on triggers like Green Flag click."
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentPage={1}
        totalPages={7}
        earnedScore={totalScore}
        isCompleted={isPageComplete}
        onNextPage={() => {
          sounds.playCorrect();
          onCompletePage(totalScore);
        }}
        nextButtonLabelRo="Continuă la Pagina 2: Interfața Scratch 3.0"
        nextButtonLabelEn="Proceed to Page 2: Scratch 3.0 Interface"
      />
    </div>
  );
};
