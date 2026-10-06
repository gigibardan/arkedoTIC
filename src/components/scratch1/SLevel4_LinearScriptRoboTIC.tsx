import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Play, 
  Flag, 
  Octagon, 
  RotateCcw, 
  Check, 
  Layers, 
  MessageSquare, 
  ExternalLink,
  Volume2,
  Sliders
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface SLevel4Props {
  onCompletePage: (earnedScore: number) => void;
}

export const SLevel4_LinearScriptRoboTIC: React.FC<SLevel4Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Execution Runner State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [robotX, setRobotX] = useState<number>(-150);
  const [robotY, setRobotY] = useState<number>(-50);
  const [speechText, setSpeechText] = useState<string | null>(null);
  const [scriptSuccess, setScriptSuccess] = useState<boolean>(false);

  // Quiz State
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  useEffect(() => {
    const hasActive = Object.values(cooldowns).some((c: number) => c > 0);
    if (!hasActive) return;
    const timer = setInterval(() => {
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
  }, [cooldowns]);

  // Run the linear script sequentially with step highlight
  const handleRunScript = () => {
    if (isRunning) return;
    sounds.playClick();
    setIsRunning(true);
    setActiveStepIndex(0);
    setRobotX(-150);
    setRobotY(-50);
    setSpeechText(null);

    // Step 0: Hat flag triggered
    setTimeout(() => {
      // Step 1: glisează 1 secunde la x: 0, y: 0
      setActiveStepIndex(1);
      setRobotX(0);
      setRobotY(0);

      setTimeout(() => {
        // Step 2: spune "Salut! Sunt RoboTIC..." pentru 2 secunde
        setActiveStepIndex(2);
        setSpeechText(lang === 'en' ? 'Hello! I am RoboTIC!' : 'Salut! Sunt RoboTIC!');
        sounds.playCorrect();

        setTimeout(() => {
          // Step 3: redă sunetul de final
          setActiveStepIndex(3);
          sounds.playStar();

          setTimeout(() => {
            // Finished
            setActiveStepIndex(-1);
            setIsRunning(false);
            setScriptSuccess(true);
          }, 1000);
        }, 2000);
      }, 1200);
    }, 400);
  };

  const handleStopScript = () => {
    sounds.playClick();
    setIsRunning(false);
    setActiveStepIndex(-1);
    setSpeechText(null);
  };

  const handleResetStage = () => {
    sounds.playClick();
    setIsRunning(false);
    setActiveStepIndex(-1);
    setRobotX(-150);
    setRobotY(-50);
    setSpeechText(null);
  };

  // Quiz Handlers
  const handleQ1 = (id: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    setQ1Answer(id);
    if (id === 'linear_top_bottom') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const handleQ2 = (id: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    setQ2Answer(id);
    if (id === 'glide_smooth') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  const isQ1Correct = q1Answer === 'linear_top_bottom';
  const isQ2Correct = q2Answer === 'glide_smooth';

  let totalScore = 0;
  if (scriptSuccess) totalScore += 40;
  if (isQ1Correct) totalScore += 30;
  if (isQ2Correct) totalScore += 30;

  const isPageComplete = scriptSuccess || (q1Answer !== null && q2Answer !== null) || totalScore >= 40;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600/30 via-indigo-600/20 to-slate-900 border border-blue-500/40 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/40 text-blue-300">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {lang === 'en' ? 'Unit 6 • Scratch 3.0' : 'Unitatea 6 • Scratch 3.0'}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {lang === 'en' ? 'Page 4 of 7' : 'Pagina 4 din 7'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {lang === 'en'
                  ? 'Project: "RoboTIC Introduces Himself" (Linear Scripts)'
                  : 'Proiectul „RoboTIC se prezintă” (Scripturi Liniare)'}
              </h1>
            </div>
          </div>
          <a
            href="https://scratch.mit.edu/projects/editor/?tutorial=getStarted"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-600/30 hover:bg-orange-600/50 border border-orange-500/40 text-orange-200 text-xs font-semibold transition cursor-pointer"
          >
            <span>{lang === 'en' ? 'Open MIT Scratch' : 'Deschide Scratch Oficial'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Educational Guide Card */}
      <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-blue-400 font-bold text-base">
          <BookOpen className="w-5 h-5" />
          <h2>{lang === 'en' ? 'Linear Sequential Scripts in Scratch (Textbook pp. 76–80)' : 'Scripturile Liniare Secvențiale în Scratch (Manual pag. 76–80)'}</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300">
          {lang === 'en'
            ? 'In a linear script, blocks execute strictly from top to bottom, one by one. Our first classic textbook project connects: (1) An Event trigger, (2) Motion glide to stage center, (3) Looks speech bubble, and (4) Sound effect playback.'
            : 'Într-un script liniar, instrucțiunile se execută strict de sus în jos, una după alta. Primul nostru proiect din manual conectează: (1) Un declanșator Eveniment, (2) Mișcarea cu glisare spre centrul scenei, (3) O bulă de dialog din categoria Aspect și (4) Redarea unui efect sonor.'}
        </p>
      </div>

      {/* Interactive Script & Stage Runner */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <Play className="w-5 h-5 text-blue-400" />
            <h3>{lang === 'en' ? 'Live Scratch Script Runner & Step Tracer' : 'Simulator de Execuție Scratch: Urmărirea Pas-cu-Pas'}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isRunning}
              onClick={handleRunScript}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md cursor-pointer disabled:opacity-50"
            >
              <Flag className="w-3.5 h-3.5 fill-white" />
              <span>{lang === 'en' ? 'Run (Green Flag)' : 'Pornește (Steag Verde)'}</span>
            </button>
            <button
              type="button"
              onClick={handleStopScript}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/40 text-rose-200 text-xs font-semibold cursor-pointer"
            >
              <Octagon className="w-3.5 h-3.5 fill-rose-500" />
              <span>{lang === 'en' ? 'Stop' : 'Stop'}</span>
            </button>
            <button
              type="button"
              onClick={handleResetStage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Reset' : 'Resetează'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Scratch Blocks Column */}
          <div className="lg:col-span-5 space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>{lang === 'en' ? 'Script Workspace (Workspace)' : 'Zona de Scripturi'}</span>
              <span className="font-mono text-[10px] text-blue-400">RoboTIC Sprite</span>
            </div>

            {/* Block 0: Event Hat */}
            <div
              className={`p-3 rounded-t-2xl rounded-b-lg border-2 font-mono text-xs font-bold flex items-center gap-2 shadow transition-all ${
                activeStepIndex === 0
                  ? 'bg-amber-400 border-white text-slate-950 ring-4 ring-amber-400/50 scale-[1.02]'
                  : 'bg-amber-500 border-amber-600 text-slate-950'
              }`}
            >
              <Flag className="w-4 h-4 fill-slate-950" />
              <span>{lang === 'en' ? 'when 🚩 clicked' : 'când se dă clic pe 🚩'}</span>
            </div>

            {/* Block 1: Motion Glide */}
            <div
              className={`p-3 rounded-lg border-2 font-mono text-xs font-bold flex items-center gap-2 shadow transition-all ${
                activeStepIndex === 1
                  ? 'bg-blue-500 border-white text-white ring-4 ring-blue-400/50 scale-[1.02]'
                  : 'bg-blue-600 border-blue-700 text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white/50"></span>
              <span>{lang === 'en' ? 'glide (1) secs to x: (0) y: (0)' : 'glisează (1) secunde la x: (0) y: (0)'}</span>
            </div>

            {/* Block 2: Looks Say */}
            <div
              className={`p-3 rounded-lg border-2 font-mono text-xs font-bold flex items-center gap-2 shadow transition-all ${
                activeStepIndex === 2
                  ? 'bg-purple-500 border-white text-white ring-4 ring-purple-400/50 scale-[1.02]'
                  : 'bg-purple-600 border-purple-700 text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{lang === 'en' ? 'say [Hello! I am RoboTIC!] for (2) secs' : 'spune [Salut! Sunt RoboTIC!] pentru (2) secunde'}</span>
            </div>

            {/* Block 3: Sound Play */}
            <div
              className={`p-3 rounded-b-2xl rounded-t-lg border-2 font-mono text-xs font-bold flex items-center gap-2 shadow transition-all ${
                activeStepIndex === 3
                  ? 'bg-pink-500 border-white text-white ring-4 ring-pink-400/50 scale-[1.02]'
                  : 'bg-pink-600 border-pink-700 text-white'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{lang === 'en' ? 'play sound [Alien Creak1] until done' : 'redă sunetul [Alien Creak1] până la final'}</span>
            </div>

            <div className="pt-2 text-[11px] text-slate-400">
              {lang === 'en'
                ? '💡 Notice how instructions snap together like jigsaw puzzle pieces.'
                : '💡 Observă cum instrucțiunile se îmbină perfect asemenea pieselor de puzzle.'}
            </div>
          </div>

          {/* Interactive Stage Canvas */}
          <div className="lg:col-span-7">
            <div className="bg-slate-950 px-4 py-2 rounded-t-xl border border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs text-slate-300 font-semibold">{lang === 'en' ? 'Live Stage (Scenă)' : 'Scenă Interactivă'}</span>
              </div>
              <div className="text-xs font-mono text-slate-400">
                <span>x: <strong className="text-white">{robotX}</strong></span>
                <span className="ml-3">y: <strong className="text-white">{robotY}</strong></span>
              </div>
            </div>

            <div className="relative w-full aspect-[4/3] rounded-b-xl border-x border-b border-slate-700 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 overflow-hidden select-none">
              {/* Center Coordinate Target Marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border border-dashed border-sky-400"></div>
                <span className="text-[9px] font-mono text-sky-300">(0, 0)</span>
              </div>

              {/* Robot Sprite */}
              <div
                style={{
                  left: `${((robotX + 240) / 480) * 100}%`,
                  top: `${((180 - robotY) / 360) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  transition: isRunning && activeStepIndex === 1 ? 'left 1s ease-in-out, top 1s ease-in-out' : 'none'
                }}
                className="absolute flex flex-col items-center pointer-events-none drop-shadow-2xl z-10"
              >
                {/* Speech Bubble */}
                {speechText && (
                  <div className="mb-2 bg-white text-slate-950 font-bold text-xs px-3 py-1.5 rounded-2xl rounded-bl-none shadow-2xl animate-bounce border-2 border-purple-500 whitespace-nowrap">
                    {speechText}
                  </div>
                )}
                <div className="text-4xl filter drop-shadow-lg animate-float">
                  🤖
                </div>
                <div className="text-[10px] font-bold text-white bg-slate-900/90 border border-slate-700 px-1.5 py-0.5 rounded-full mt-0.5 whitespace-nowrap">
                  RoboTIC
                </div>
              </div>

              {/* Success Banner */}
              {scriptSuccess && (
                <div className="absolute bottom-3 left-3 right-3 p-2 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'en' ? 'Script successfully executed! (+40 Pts)' : 'Scriptul a rulat cu succes! (+40 Pcte)'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Quiz */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <span>{lang === 'en' ? 'Understanding Linear Scripts' : 'Evaluare: Funcționarea Scripturilor Liniare'}</span>
        </h3>

        {/* Question 1 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
            </span>
            <QuestionHint
              hintRo="Într-un script fără bucle sau ramificații, blocurile se execută strict secvențial, în ordinea așezării lor."
              hintEn="In a script without loops or branches, blocks execute strictly sequentially, top-to-bottom."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'In what order do blocks execute in a basic linear Scratch script?'
              : 'În ce ordine se execută blocurile dintr-un script liniar de bază în Scratch?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'linear_top_bottom', ro: 'Strict de sus în jos, una după alta, în ordinea îmbinării lor', en: 'Strictly from top to bottom, one after another, in connection order' },
              { id: 'random_order', ro: 'În ordine complet aleatorie', en: 'In completely random order' },
              { id: 'simultaneous', ro: 'Toate blocurile în aceeași milisecundă simultan', en: 'All blocks at the exact same millisecond simultaneously' },
              { id: 'bottom_top', ro: 'Strict de jos în sus', en: 'Strictly from bottom to top' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q1 || 0) > 0}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'linear_top_bottom'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-blue-400 text-slate-300'
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
              customMessageRo="Reflecție didactică: Principiul secvențialității impune execuția ordonată de sus în jos a instrucțiunilor!"
              customMessageEn="Pedagogical reflection: The principle of sequence requires top-to-bottom orderly execution!"
            />
          ) : null}
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanationRo="Fiecare bloc își finalizează acțiunea înainte ca interpretorul Scratch să treacă la următorul bloc atașat dedesubt."
              explanationEn="Each block completes its task before the Scratch engine proceeds to the next attached block below."
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
            </span>
            <QuestionHint
              hintRo="Blocul „glisează” produce o mișcare fluidă și vizibilă în timp, spre deosebire de „mergi la” care este instantaneu."
              hintEn="The glide block creates a smooth, animated motion over a given duration, unlike 'go to' which is instant."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'What is the key difference between "glide (1) secs to x:y" and "go to x:y" in Scratch?'
              : 'Care este diferența dintre blocul „glisează (1) secunde la x:y” și blocul „mergi la x:y” în Scratch?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'glide_smooth', ro: '„Glisează” realizează o deplasare fluidă și continuă în timp, iar „mergi la” sare instantaneu la coordonate', en: 'Glide moves smoothly over time, while "go to" jumps instantly to coordinates' },
              { id: 'no_diff', ro: 'Nu există nicio diferență, fac exact același lucru', en: 'No difference, they do the exact same thing' },
              { id: 'glide_audio', ro: 'Glisează redă doar un sunet fără a mișca personajul', en: 'Glide only plays audio without moving the sprite' },
              { id: 'glide_costume', ro: 'Glisează schimbă doar costumul personajului', en: 'Glide only changes sprite costume' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q2 || 0) > 0}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'glide_smooth'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-blue-400 text-slate-300'
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
              customMessageRo="Reflecție didactică: Glisarea oferă o animație cursivă pentru ochiul utilizatorului!"
              customMessageEn="Pedagogical reflection: Gliding provides smooth visual animation for the viewer!"
            />
          ) : null}
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanationRo="Blocul „glisează” calculează pozițiile intermediare pentru fiecare cadru (frame), oferind o animație lină în intervalul de secunde specificat."
              explanationEn="The glide block calculates frame intervals to render smooth motion over the specified seconds."
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentPage={4}
        totalPages={7}
        earnedScore={totalScore}
        isCompleted={isPageComplete}
        onNextPage={() => {
          sounds.playCorrect();
          onCompletePage(totalScore);
        }}
        nextButtonLabelRo="Continuă la Pagina 5: Variabile în Scratch"
        nextButtonLabelEn="Proceed to Page 5: Variables in Scratch"
      />
    </div>
  );
};
