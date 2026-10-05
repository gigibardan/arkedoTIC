import React, { useState, useEffect } from 'react';
import { 
  Footprints, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Play, 
  RotateCcw,
  RotateCw,
  Bot,
  Compass,
  ArrowUp,
  Gem,
  Check
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface ALevel4Props {
  onCompletePage: (earnedScore: number) => void;
}

type Direction = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';

export const ALevel4_SequentialAlgorithms: React.FC<ALevel4Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Robot Grid Simulation State
  // Grid size 5x5
  const [robotX, setRobotX] = useState<number>(0);
  const [robotY, setRobotY] = useState<number>(4); // bottom-left start
  const [robotDir, setRobotDir] = useState<Direction>('UP');
  const [collectedCrystals, setCollectedCrystals] = useState<number>(0);
  const [commandQueue, setCommandQueue] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [simSuccess, setSimSuccess] = useState<boolean>(false);
  const [simCooldown, setSimCooldown] = useState<number>(0);

  // Targets on grid:
  // Crystal 1: (0, 2)
  // Crystal 2: (2, 2)
  // Portal: (4, 0) (top-right)
  const portalPos = { x: 4, y: 0 };

  // Quiz State
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q1Cooldown, setQ1Cooldown] = useState<number>(0);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q2Cooldown, setQ2Cooldown] = useState<number>(0);

  // Timer cooldown decrement
  useEffect(() => {
    if (simCooldown <= 0 && q1Cooldown <= 0 && q2Cooldown <= 0) return;
    const timer = setInterval(() => {
      if (simCooldown > 0) setSimCooldown(prev => (prev <= 1 ? 0 : prev - 1));
      if (q1Cooldown > 0) setQ1Cooldown(prev => (prev <= 1 ? 0 : prev - 1));
      if (q2Cooldown > 0) setQ2Cooldown(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [simCooldown, q1Cooldown, q2Cooldown]);

  const addCommand = (cmd: string) => {
    if (isRunning || commandQueue.length >= 12) return;
    sounds.playClick();
    setCommandQueue(prev => [...prev, cmd]);
  };

  const removeLastCommand = () => {
    if (isRunning || commandQueue.length === 0) return;
    sounds.playClick();
    setCommandQueue(prev => prev.slice(0, -1));
  };

  const handleResetRobot = () => {
    sounds.playClick();
    setRobotX(0);
    setRobotY(4);
    setRobotDir('UP');
    setCollectedCrystals(0);
    setCommandQueue([]);
    setIsRunning(false);
    setSimSuccess(false);
  };

  const executeSequentialProgram = async () => {
    if (commandQueue.length === 0 || isRunning || simCooldown > 0) return;
    setIsRunning(true);
    setSimSuccess(false);

    let curX = 0;
    let curY = 4;
    let curDir: Direction = 'UP';
    let crystals = 0;

    for (let i = 0; i < commandQueue.length; i++) {
      const cmd = commandQueue[i];
      sounds.playClick();

      if (cmd === 'FORWARD') {
        if (curDir === 'UP' && curY > 0) curY--;
        else if (curDir === 'DOWN' && curY < 4) curY++;
        else if (curDir === 'LEFT' && curX > 0) curX--;
        else if (curDir === 'RIGHT' && curX < 4) curX++;
      } else if (cmd === 'TURN_LEFT') {
        if (curDir === 'UP') curDir = 'LEFT';
        else if (curDir === 'LEFT') curDir = 'DOWN';
        else if (curDir === 'DOWN') curDir = 'RIGHT';
        else if (curDir === 'RIGHT') curDir = 'UP';
      } else if (cmd === 'TURN_RIGHT') {
        if (curDir === 'UP') curDir = 'RIGHT';
        else if (curDir === 'RIGHT') curDir = 'DOWN';
        else if (curDir === 'DOWN') curDir = 'LEFT';
        else if (curDir === 'LEFT') curDir = 'UP';
      } else if (cmd === 'COLLECT') {
        if ((curX === 0 && curY === 2) || (curX === 2 && curY === 2) || (curX === 4 && curY === 2)) {
          crystals++;
          sounds.playCorrect();
        }
      }

      setRobotX(curX);
      setRobotY(curY);
      setRobotDir(curDir);
      setCollectedCrystals(crystals);

      await new Promise(resolve => setTimeout(resolve, 350));
    }

    setIsRunning(false);

    if (curX === portalPos.x && curY === portalPos.y) {
      sounds.playVictory();
      setSimSuccess(true);
    } else {
      sounds.playWrong();
      setSimCooldown(5);
    }
  };

  // Quiz handlers
  const isQ1Correct = q1Answer === 'linear_top_bottom';
  const handleQ1 = (val: string) => {
    if (q1Cooldown > 0) return;
    sounds.playClick();
    setQ1Answer(val);
    if (val === 'linear_top_bottom') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setQ1Cooldown(5);
    }
  };

  const isQ2Correct = q2Answer === 'no_branches';
  const handleQ2 = (val: string) => {
    if (q2Cooldown > 0) return;
    sounds.playClick();
    setQ2Answer(val);
    if (val === 'no_branches') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setQ2Cooldown(5);
    }
  };

  // Scoring
  let correctCount = 0;
  if (simSuccess) correctCount += 2;
  if (isQ1Correct) correctCount++;
  if (isQ2Correct) correctCount++;

  const totalQuestions = 4;
  const earnedScore = Math.round((correctCount / totalQuestions) * 15);
  const canProceed = correctCount >= 3;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn select-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-blue-500/20 border border-blue-400/40 rounded-2xl text-blue-300 text-3xl shrink-0 shadow-inner">
            👣
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400 uppercase tracking-widest mb-1">
              <span>{lang === 'en' ? 'Module 5A • Page 4 of 7' : 'Modulul 5A • Pagina 4 din 7'}</span>
              <span>•</span>
              <span className="text-slate-400">{lang === 'en' ? 'Textbook p. 59' : 'Manual pag. 59'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              {lang === 'en' ? '4. Sequential (Linear) Algorithms' : '4. Algoritmi Secvențiali (Structura Liniară)'}
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              {lang === 'en'
                ? 'In a sequential algorithm, instructions execute one after another in a linear succession from top to bottom, with no jumps or alternative branches. Control the explorer robot step-by-step!'
                : 'În structura secvențială, pașii se execută strict succesiv, de sus în jos, unul după altul. Fiecare instrucțiune se execută o singură dată, fără ocoliri sau decizii alternative!'}
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Sequential Robot Grid Simulator */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Bot className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-heading">
                {lang === 'en' ? 'Robot Navigator: Linear Sequential Command List' : 'Simulatorul Robotului: Ghidare Pas-cu-Pas'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'en' ? 'Build the sequential program to reach the charging portal at (4,0)' : 'Creează lista secvențială de comenzi pentru a duce robotul la portalul (4,0)'}
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={isRunning}
            onClick={handleResetRobot}
            className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Reset' : 'Resetează'}</span>
          </button>
        </div>

        {simCooldown > 0 && (
          <PedagogicalReflectionBanner
            cooldown={simCooldown}
            customMessageRo="Robotul nu a ajuns la portalul final! Te rugăm să acorzi 5 secunde pentru a reanaliza numărul de pași înainte și rotirile necesare."
            customMessageEn="The robot did not reach the portal! Please take 5 seconds to review the forward steps and rotations."
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Visual 5x5 Grid */}
          <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 flex flex-col items-center">
            <div className="grid grid-cols-5 gap-1.5 w-full max-w-[280px] aspect-square">
              {Array.from({ length: 25 }).map((_, i) => {
                const x = i % 5;
                const y = Math.floor(i / 5);
                const isRobot = robotX === x && robotY === y;
                const isPortal = portalPos.x === x && portalPos.y === y;
                const isCrystal = (x === 0 && y === 2) || (x === 2 && y === 2);

                return (
                  <div
                    key={i}
                    className={`rounded-xl border flex items-center justify-center text-xs font-mono font-bold transition relative ${
                      isRobot
                        ? 'bg-blue-600 border-blue-400 text-white ring-2 ring-blue-400/50 shadow-lg scale-105 z-10'
                        : isPortal
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md'
                        : isCrystal
                        ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                        : 'bg-slate-900 border-slate-800/80 text-slate-600'
                    }`}
                  >
                    {isRobot ? (
                      <span className="text-base font-black">
                        {robotDir === 'UP' ? '🤖▲' : robotDir === 'RIGHT' ? '🤖►' : robotDir === 'DOWN' ? '🤖▼' : '🤖◄'}
                      </span>
                    ) : isPortal ? (
                      <span className="text-base" title="Portal Încărcare">🌀</span>
                    ) : isCrystal ? (
                      <Gem className="w-4 h-4 text-amber-400 animate-pulse" />
                    ) : (
                      <span className="text-[9px] opacity-40">{x},{y}</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between w-full max-w-[280px] mt-3 text-[11px] font-mono text-slate-400">
              <span>Start: (0,4)</span>
              <span>Țintă Portal: (4,0)</span>
            </div>
          </div>

          {/* Sequential Program Builder */}
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
                <span>{lang === 'en' ? 'Instruction Buttons:' : 'Comenzi Disponibile:'}</span>
                <span className="text-slate-500 font-normal">{commandQueue.length}/12 comenzi</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isRunning || commandQueue.length >= 12}
                  onClick={() => addCommand('FORWARD')}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-semibold text-xs transition border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowUp className="w-4 h-4 text-blue-400" />
                  <span>{lang === 'en' ? 'Forward 1 Step' : 'Înainte 1 Pas'}</span>
                </button>
                <button
                  type="button"
                  disabled={isRunning || commandQueue.length >= 12}
                  onClick={() => addCommand('TURN_RIGHT')}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-semibold text-xs transition border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCw className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'en' ? 'Turn Right (90°)' : 'Rotește Dreapta'}</span>
                </button>
                <button
                  type="button"
                  disabled={isRunning || commandQueue.length >= 12}
                  onClick={() => addCommand('TURN_LEFT')}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-semibold text-xs transition border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-cyan-400" />
                  <span>{lang === 'en' ? 'Turn Left (90°)' : 'Rotește Stânga'}</span>
                </button>
                <button
                  type="button"
                  disabled={isRunning || commandQueue.length === 0}
                  onClick={removeLastCommand}
                  className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 disabled:opacity-40 text-rose-300 font-semibold text-xs transition border border-rose-800/40 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{lang === 'en' ? '⌫ Delete Last' : '⌫ Șterge Ultimul'}</span>
                </button>
              </div>
            </div>

            {/* Program Queue Preview */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[11px] font-mono text-blue-400 font-bold uppercase">
                {lang === 'en' ? 'Sequential Program (Top-to-Bottom Execution):' : 'Programul Secvențial (Execuție de Sus în Jos):'}
              </div>
              <div className="min-h-[70px] max-h-[120px] overflow-y-auto space-y-1 pr-1">
                {commandQueue.length === 0 ? (
                  <div className="text-xs text-slate-500 italic py-2 text-center">
                    {lang === 'en' ? 'No commands added yet. Tap buttons above.' : 'Nicio comandă adăugată. Apasă pe butoanele de mai sus.'}
                  </div>
                ) : (
                  commandQueue.map((cmd, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-mono bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                      <span className="text-slate-500">{idx + 1}.</span>
                      <span className="font-bold text-white">
                        {cmd === 'FORWARD' ? 'Pas Înainte' : cmd === 'TURN_RIGHT' ? 'Rotește Dreapta 90°' : 'Rotește Stânga 90°'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Run Button */}
            <button
              type="button"
              disabled={isRunning || commandQueue.length === 0 || simCooldown > 0}
              onClick={executeSequentialProgram}
              className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                isRunning
                  ? 'bg-blue-800 text-blue-200 cursor-wait'
                  : simCooldown > 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 active:scale-95'
              }`}
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isRunning ? (lang === 'en' ? 'Executing Step-by-Step...' : 'Se Execută Pas cu Pas...') : (lang === 'en' ? 'Run Sequential Program' : 'Rulează Programul Secvențial')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step 2: Knowledge Assessment Quiz */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white border-b border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-blue-400" />
          <span>{lang === 'en' ? 'Check Your Knowledge: Sequential Structure' : 'Verifică-ți Cunoștințele: Structura Secvențială'}</span>
        </div>

        {/* Q1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-blue-400 uppercase font-mono">
            {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'How are instructions executed in a sequential algorithmic structure?'
              : 'Cum se execută instrucțiunile într-o structură algoritmică secvențială (liniară)?'}
          </div>

          {(q1Cooldown || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={q1Cooldown}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza ordinea de execuție de sus în jos."
                customMessageEn="Incorrect answer! Please take 5 seconds to reflect on top-to-bottom linear execution."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { id: 'linear_top_bottom', text: lang === 'en' ? 'A) Linearly, from top to bottom, each instruction exactly once' : 'A) Liniar, de sus în jos, fiecare instrucțiune o singură dată' },
              { id: 'random_jump', text: lang === 'en' ? 'B) By jumping randomly between lines' : 'B) Sărind la întâmplare între linii' },
              { id: 'infinite_always', text: lang === 'en' ? 'C) By repeating step 1 for a hundred years' : 'C) Repetând pasul 1 timp de 100 de ani' },
              { id: 'only_backwards', text: lang === 'en' ? 'D) Backwards from bottom to top' : 'D) De jos în sus' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={q1Cooldown > 0}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                  q1Cooldown > 0 ? 'opacity-60 cursor-not-allowed' : ''
                } ${
                  q1Answer === opt.id
                    ? opt.id === 'linear_top_bottom'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="algo_seq_q1"
            hintRo="Structura secvențială înseamnă parcurgere pas cu pas, de la prima până la ultima comandă."
            hintEn="Sequential structure means step-by-step traversal from the first to the last command."
          />

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              cooldown={q1Cooldown}
              explanation={
                isQ1Correct
                  ? (lang === 'en' ? 'Spot on! Sequential means strict consecutive execution from beginning to end.' : 'Exact! În structura secvențială, fiecare pas se execută în ordinea scrisă, de la început la sfârșit.')
                  : (lang === 'en' ? 'Incorrect. Execution is sequential from top to bottom.' : 'Incorect. Instrucțiunile se execută strict una după alta, de sus în jos.')
              }
              ruleReference="Manual TIC pag. 59"
            />
          )}
        </div>

        {/* Q2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-blue-400 uppercase font-mono">
            {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'Does a purely sequential algorithm contain decision conditions (IF / ELSE)?'
              : 'Conține un algoritm pur secvențial ramificații de decizie (Dacă... Atunci... Altfel)?'}
          </div>

          {(q2Cooldown || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={q2Cooldown}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza diferența dintre structura liniară și cea decizională."
                customMessageEn="Incorrect answer! Please take 5 seconds to reflect on linear versus branch structures."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { id: 'no_branches', text: lang === 'en' ? 'A) No, it contains only linear straightforward actions' : 'A) Nu, conține doar acțiuni directe executate liniar' },
              { id: 'yes_always', text: lang === 'en' ? 'B) Yes, at every single step' : 'B) Da, la fiecare pas' },
              { id: 'only_drawings', text: lang === 'en' ? 'C) Only when colors are changed' : 'C) Doar când schimbăm culorile' },
              { id: 'not_applicable', text: lang === 'en' ? 'D) Decisions are mandatory in all lines' : 'D) Deciziile sunt obligatorii peste tot' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={q2Cooldown > 0}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                  q2Cooldown > 0 ? 'opacity-60 cursor-not-allowed' : ''
                } ${
                  q2Answer === opt.id
                    ? opt.id === 'no_branches'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="algo_seq_q2"
            hintRo="Structurile decizionale (Dacă... Atunci) fac parte din structura alternativă, nu din cea pur secvențială."
            hintEn="Decision branches (IF... THEN) belong to the alternative structure, not the pure sequential one."
          />

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              cooldown={q2Cooldown}
              explanation={
                isQ2Correct
                  ? (lang === 'en' ? 'Correct! Sequential algorithms execute all commands uniformly without conditional branches.' : 'Corect! Algoritmii secvențiali nu conțin decizii sau ramificații: toate comenzile se execută garantat pe rând.')
                  : (lang === 'en' ? 'Incorrect. Sequential algorithms do not branch.' : 'Incorect. Structura alternativă cu decizii este studiată separat în Misiunea 5B.')
              }
              ruleReference="Manual TIC pag. 59"
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        score={earnedScore}
        totalPoints={15}
        correctCount={correctCount}
        totalQuestions={totalQuestions}
        canProceed={canProceed}
        onProceed={() => {
          sounds.playCorrect();
          onCompletePage(earnedScore);
        }}
      />
    </div>
  );
};
