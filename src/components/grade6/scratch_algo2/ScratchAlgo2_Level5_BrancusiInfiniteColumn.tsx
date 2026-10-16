import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Play,
  RotateCcw,
  StopCircle,
  Image as ImageIcon,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { useQuestionCooldowns, PedagogicalReflectionBanner } from '../../../utils/pedagogicalGrading';

interface Level5Props {
  onCompletePage: (earnedScore: number) => void;
}

const BRANCUSI_WORKS = [
  {
    id: 'coloana',
    titleRo: 'Coloana Infinitului (Coloana fără Sfârșit)',
    titleEn: 'The Endless Column',
    year: '1938',
    height: '29.33 metri',
    modules: '15 moduli octaedrici întregi + 2 jumătăți',
    descRo: 'Simbol al sacrificiului eroilor români și al aspirației infinite către cer.',
    descEn: 'Symbol of Romanian heroes’ sacrifice and infinite upward aspiration.'
  },
  {
    id: 'poarta',
    titleRo: 'Poarta Sărutului',
    titleEn: 'The Gate of the Kiss',
    year: '1938',
    height: '5.13 metri',
    modules: 'Piatră poroasă extrasă din cariera Banpotoc',
    descRo: 'Triumful dragostei și al uniunii spirituale peste moarte și timp.',
    descEn: 'Triumph of spiritual love and unity over death and time.'
  },
  {
    id: 'masa',
    titleRo: 'Masa Tăcerii',
    titleEn: 'The Table of Silence',
    year: '1938',
    height: 'Masă rotundă înconjurată de 12 scaune clepsidră',
    modules: '12 scaune simbolizând cele 12 ore ale timpului',
    descRo: 'Meditație profundă și reculegere înainte de bătălia decisivă.',
    descEn: 'Profound meditation and reflection before the decisive battle.'
  }
];

export const ScratchAlgo2_Level5_BrancusiInfiniteColumn: React.FC<Level5Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  // Album state
  const [activeWorkIndex, setActiveWorkIndex] = useState<number>(0);

  // Procedural Infinite Column Builder
  const [targetModules, setTargetModules] = useState<number>(10);
  const [builtModules, setBuiltModules] = useState<number>(0);
  const [isBuildingColumn, setIsBuildingColumn] = useState<boolean>(false);

  // Quizzes with 5-second cooldown
  const [qStopBlock, setQStopBlock] = useState<string | null>(null);
  const [qBrancusiModules, setQBrancusiModules] = useState<string | null>(null);
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const activeWork = BRANCUSI_WORKS[activeWorkIndex];

  const handleNextWork = () => {
    setActiveWorkIndex((prev) => (prev + 1) % BRANCUSI_WORKS.length);
    sounds.playClick();
  };

  const handlePrevWork = () => {
    setActiveWorkIndex((prev) => (prev - 1 + BRANCUSI_WORKS.length) % BRANCUSI_WORKS.length);
    sounds.playClick();
  };

  const runBuildColumn = () => {
    if (isBuildingColumn) return;
    setIsBuildingColumn(true);
    setBuiltModules(0);
    sounds.playClick();

    let count = 0;
    const interval = setInterval(() => {
      count++;
      setBuiltModules(count);
      sounds.playPop();

      if (count >= targetModules) {
        clearInterval(interval);
        setIsBuildingColumn(false);
        sounds.playCorrect();
      }
    }, 280);
  };

  const resetColumn = () => {
    setIsBuildingColumn(false);
    setBuiltModules(0);
    sounds.playClick();
  };

  const handleStopQuiz = (val: string) => {
    if (isLocked('qStop') || qStopBlock === 'stop_other_scripts') return;
    setQStopBlock(val);
    if (val === 'stop_other_scripts') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('qStop', 5);
    }
  };

  const handleBrancusiQuiz = (val: string) => {
    if (isLocked('qBrancusi') || qBrancusiModules === 'repeat_15') return;
    setQBrancusiModules(val);
    if (val === 'repeat_15') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('qBrancusi', 5);
    }
  };

  const isFormValid = qStopBlock === 'stop_other_scripts' && qBrancusiModules === 'repeat_15';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-indigo-950/80 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {isEn ? 'Unit 4 • Lessons 6–7 (Textbook pp. 87–88)' : 'Unitatea 4 • Lecțiile 6–7 (Manual pag. 87–88)'}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-bold">
                {isEn ? 'Page 5 of 7' : 'Pagina 5 din 7'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              {isEn ? 'The Brâncuși Album & Infinite Column Algorithm' : 'Proiectul: Albumul Brâncuși & Algoritmul Coloanei Infinitului'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {isEn
                ? 'Create an interactive virtual museum gallery! Switch backdrops on click, manage parallel scripts with the "stop other scripts in sprite" block, and program the repetitive geometry of the Endless Column!'
                : 'Creează o galerie de artă virtuală! Comută decorurile prin butoane interactive, oprește scripturile paralele concurente și generează procedural Coloana Infinitului prin bucla repetitivă a modulilor romboidali!'}
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-400/40 flex items-center justify-center text-3xl shadow-inner shrink-0">
            🏛️
          </div>
        </div>
      </div>

      {/* Interactive Virtual Album */}
      <div className="bg-slate-900/90 border-2 border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base sm:text-lg">
              {isEn ? 'Virtual Gallery: Brâncuși Masterpieces' : 'Galeria Virtuală: Capodoperele lui Constantin Brâncuși'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevWork}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 cursor-pointer flex items-center gap-1 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isEn ? 'Prev Backdrop' : 'Decorul Anterior'}</span>
            </button>
            <span className="text-xs font-mono text-slate-400">
              {activeWorkIndex + 1} / {BRANCUSI_WORKS.length}
            </span>
            <button
              type="button"
              onClick={handleNextWork}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 cursor-pointer flex items-center gap-1 text-xs font-bold"
            >
              <span>{isEn ? 'Next Backdrop' : 'Decorul Următor'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Gallery Display Card */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center gap-6">
          <div className="w-32 h-32 rounded-2xl bg-gradient-to-tr from-amber-600/30 to-amber-400/20 border-2 border-amber-500/50 flex items-center justify-center text-6xl shadow-xl shrink-0">
            {activeWork.id === 'coloana' ? '🔶' : activeWork.id === 'poarta' ? '⛩️' : '⚪'}
          </div>

          <div className="space-y-2 flex-1 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-lg font-black text-white">
                {isEn ? activeWork.titleEn : activeWork.titleRo}
              </h4>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {activeWork.year} • Târgu Jiu
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isEn ? activeWork.descEn : activeWork.descRo}
            </p>
            <div className="text-[11px] font-mono text-amber-400">
              📐 Arhitectură: {activeWork.modules}
            </div>
          </div>
        </div>
      </div>

      {/* Procedural Column Builder Lab */}
      <div className="bg-slate-900/90 border-2 border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base sm:text-lg">
              {isEn ? 'Procedural Column Algorithm: Repeat (n) Octahedrons' : 'Algoritm Procedural: repetă (n) Moduli Romboidali'}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">{isEn ? 'Moduli:' : 'Număr Moduli:'}</span>
            {[5, 10, 15].map((num) => (
              <button
                key={num}
                disabled={isBuildingColumn}
                onClick={() => {
                  setTargetModules(num);
                  setBuiltModules(0);
                  sounds.playClick();
                }}
                className={`px-2.5 py-1 rounded-lg font-bold border transition cursor-pointer ${
                  targetModules === num
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {num} {num === 15 ? (isEn ? '(Real Column)' : '(Coloana Reală)') : ''}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vertical Stack Canvas */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 h-80 flex flex-col justify-end items-center relative overflow-hidden">
            {/* Sky Background */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-sky-950/40 to-indigo-950/30 pointer-events-none" />

            {/* Ground base */}
            <div className="w-24 h-3 bg-amber-900/80 border-t border-amber-600 rounded-t z-10" />

            {/* Stack of Rhomboids */}
            <div className="flex flex-col-reverse items-center z-10 space-y-reverse -space-y-1 overflow-hidden max-h-72">
              {Array.from({ length: builtModules }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-10 h-5 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 border border-amber-300 shadow-md transform rotate-45 shrink-0 animate-scaleIn"
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                    width: '32px',
                    height: '24px'
                  }}
                />
              ))}
            </div>

            <div className="absolute top-3 left-3 text-xs font-mono text-amber-300 bg-slate-900/80 px-2.5 py-1 rounded border border-amber-500/40">
              Moduli generați: <span className="font-bold text-white">{builtModules}</span> / {targetModules}
            </div>

            <div className="absolute bottom-3 right-3 flex gap-2 z-20">
              <button
                type="button"
                disabled={isBuildingColumn}
                onClick={runBuildColumn}
                className="py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1 shadow-md"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isEn ? 'Build Column' : 'Construiește Coloana'}</span>
              </button>
              <button
                type="button"
                disabled={isBuildingColumn}
                onClick={resetColumn}
                className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Scratch Code Architecture */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2 flex flex-col justify-between">
            <div>
              <div className="text-slate-400 font-bold text-[11px] uppercase tracking-wider mb-2">
                {isEn ? 'Scratch Column Algorithm' : 'Algoritm Scratch: Generarea Coloanei'}
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5 text-slate-300">
                <div className="text-amber-400">când se face clic pe [steag verde]</div>
                <div className="text-cyan-400">mergi la x: (0) y: (-140)</div>
                <div className="text-teal-400">✏️ șterge tot</div>
                <div className="text-purple-400 font-bold">
                  🔄 repetă ({targetModules})
                </div>
                <div className="pl-4 border-l-2 border-purple-500 space-y-1 text-emerald-300">
                  <div>creează o clonă a [modul_romb v]</div>
                  <div className="text-cyan-300">modifică y cu (18)</div>
                  <div className="text-slate-400">așteaptă (0.2) secunde</div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200">
              💎 <span className="font-bold">{isEn ? 'Brâncuși Geometry:' : 'Geometria lui Brâncuși:'}</span> {isEn
                ? 'The real Endless Column has exactly 15 full octahedral modules, each representing repetitive cycles of human ascension.'
                : 'Coloana Infinitului are 15 moduli octaedrici întregi, simbolizând succesiunea nesfârșită a ciclurilor și a generațiilor umane!'}
            </div>
          </div>
        </div>
      </div>

      {/* Formative Quizzes */}
      <div className="space-y-4">
        {/* Q1: Stop other scripts */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">
                {isEn
                  ? '1. Which block in the Control category stops parallel scripts in the same sprite when changing scenes?'
                  : '1. Ce bloc folosești pentru a opri animațiile concurente ale personajului când utilizatorul schimbă decorul albumului?'}
              </h3>
            </div>
            <QuestionHint hint={isEn ? 'Look for the Stop block with a dropdown choice!' : 'Caută blocul roșu „oprește” cu opțiunea pentru celelalte scripturi!'} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              { id: 'stop_other_scripts', label: 'oprește [alte scripturi din personaj v]', isCorrect: true },
              { id: 'stop_all', label: 'oprește [totul v] (oprește jocul complet)', isCorrect: false },
              { id: 'hide_sprite', label: 'ascunde personajul', isCorrect: false }
            ].map((opt) => {
              const isSelected = qStopBlock === opt.id;
              let style = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (qStopBlock) {
                if (opt.isCorrect) style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                else if (isSelected) style = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={opt.id}
                  disabled={isLocked('qStop') || qStopBlock === 'stop_other_scripts'}
                  onClick={() => handleStopQuiz(opt.id)}
                  className={`p-3.5 rounded-xl border font-bold text-xs sm:text-sm text-left transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-between gap-2 ${style}`}
                >
                  <span className="font-mono">{opt.label}</span>
                  {qStopBlock && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {qStopBlock && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {cooldowns.qStop && cooldowns.qStop > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.qStop}
              totalSeconds={5}
              customMessageRo="Timp de reflecție: Blocul 'oprește [alte scripturi din personaj]' previne conflictele de bucle din același personaj!"
              customMessageEn="Reflection buffer: The 'stop other scripts in sprite' block prevents conflicting loops in the same sprite!"
            />
          ) : null}

          {qStopBlock && (
            <AnswerExplanation
              isCorrect={qStopBlock === 'stop_other_scripts'}
              explanation={
                isEn
                  ? 'Correct! "oprește [alte scripturi din personaj]" halts conflicting loops in the current sprite while keeping the rest of the project active.'
                  : 'Corect! Blocul „oprește [alte scripturi din personaj]” întrerupe buclele paralele din acel personaj fără a opri întregul program, evitând suprapunerea sunetelor și a mișcărilor!'
              }
            />
          )}
        </div>

        {/* Q2: Column loop */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-base">
                {isEn
                  ? '2. How does the Endless Column algorithm generate height without writing hundreds of manual lines?'
                  : '2. Cum generează algoritmul Scratch înălțimea Coloanei Infinitului fără a scrie sute de linii repetitive de cod?'}
              </h3>
            </div>
            <QuestionHint hint={isEn ? 'Think of the loop with a known number of steps: repeat(15)!' : 'Gândește-te la bucla cu număr cunoscut de pași: repetă (15)!'} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              { id: 'repeat_15', label: 'Folosește bucla „repetă (15)” cu translație verticală pe axa Y', isCorrect: true },
              { id: 'random_jump', label: 'Teleportează personajul la coordonate aleatorii', isCorrect: false },
              { id: 'manual_draw', label: 'Cere utilizatorului să deseneze manual cu mouse-ul fiecare modul', isCorrect: false }
            ].map((opt) => {
              const isSelected = qBrancusiModules === opt.id;
              let style = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (qBrancusiModules) {
                if (opt.isCorrect) style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                else if (isSelected) style = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={opt.id}
                  disabled={isLocked('qBrancusi') || qBrancusiModules === 'repeat_15'}
                  onClick={() => handleBrancusiQuiz(opt.id)}
                  className={`p-3.5 rounded-xl border font-bold text-xs sm:text-sm text-left transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-between gap-2 ${style}`}
                >
                  <span>{opt.label}</span>
                  {qBrancusiModules && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {qBrancusiModules && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {cooldowns.qBrancusi && cooldowns.qBrancusi > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.qBrancusi}
              totalSeconds={5}
              customMessageRo="Timp de reflecție: Coloana Infinitului este generată procedural prin repetiția a 15 module pe axa Y!"
              customMessageEn="Reflection buffer: The Endless Column is generated procedurally by repeating 15 modules along the Y-axis!"
            />
          ) : null}

          {qBrancusiModules && (
            <AnswerExplanation
              isCorrect={qBrancusiModules === 'repeat_15'}
              explanation={
                isEn
                  ? 'Correct! By executing a loop with 15 iterations and shifting Y upwards by the module height, the column assembles procedurally!'
                  : 'Corect! Prin bucla repetitivă „repetă (15)” care crește la fiecare iterație coordonata verticală Y cu înălțimea modulului, sculptura se înalță procedural și elegant!'
              }
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        canProceed={isFormValid}
        onNext={() => {
          sounds.playNext();
          onCompletePage(15);
        }}
        nextLabel={isEn ? 'Next: Fractals & My Blocks Procedures (p. 89–91) →' : 'Următorul: Fractali & Proceduri cu Blocuri Proprii (pag. 89–91) →'}
      />
    </div>
  );
};
