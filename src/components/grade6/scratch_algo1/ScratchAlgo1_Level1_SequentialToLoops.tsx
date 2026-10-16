import React, { useState } from 'react';
import {
  Repeat,
  Play,
  RotateCcw,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Cpu,
  Layers,
  Code
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { useQuestionCooldowns, PedagogicalReflectionBanner } from '../../../utils/pedagogicalGrading';

interface Level1Props {
  onCompletePage: (earnedScore: number) => void;
}

export const ScratchAlgo1_Level1_SequentialToLoops: React.FC<Level1Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  // Interactive Lab state
  const [activeCodeMode, setActiveCodeMode] = useState<'sequential' | 'loop'>('sequential');
  const [robotPos, setRobotPos] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [stepsExecuted, setStepsExecuted] = useState<number>(0);
  const [instructionLines, setInstructionLines] = useState<number>(12);

  // Quiz state with 5s cooldown
  const [selectedLoopType, setSelectedLoopType] = useState<string | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const runSimulation = (mode: 'sequential' | 'loop') => {
    if (isRunning) return;
    setIsRunning(true);
    setRobotPos(0);
    setStepsExecuted(0);
    sounds.playClick();

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setRobotPos(step);
      setStepsExecuted(step);
      sounds.playPop();

      if (step >= 10) {
        clearInterval(interval);
        setIsRunning(false);
        sounds.playCorrect();
      }
    }, 180);
  };

  const resetSimulation = () => {
    setRobotPos(0);
    setStepsExecuted(0);
    setIsRunning(false);
    sounds.playClick();
  };

  const handleQuiz = (choice: string) => {
    if (isLocked('loopType') || selectedLoopType === 'repeat_n') return;
    setSelectedLoopType(choice);
    setQuizAnswered(true);
    if (choice === 'repeat_n') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('loopType', 5);
    }
  };

  const canProceed = selectedLoopType === 'repeat_n';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900/60 via-orange-950/40 to-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold uppercase tracking-wider">
                {isEn ? 'Grade 6 • Unit 4A • Level 1 of 7' : 'Clasa a VI-a • Unitatea 4A • Nivelul 1 din 7'}
              </span>
              <span className="text-xs text-slate-400 font-mono">Manual pag. 62–65</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight flex items-center gap-3">
              <Repeat className="w-8 h-8 text-amber-400 animate-spin-slow" />
              <span>{isEn ? 'From Sequential to Repetitive Logic' : 'De la Execuție Secvențială la Repetitivă'}</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              {isEn
                ? 'Discover why loops are the superpower of programming: replace hundreds of repetitive command lines with elegant, reusable loop blocks!'
                : 'Descoperă de ce structurile repetitive sunt super-puterea oricărui programator: comprimă zeci de instrucțiuni repetitive în blocuri compacte și eficiente!'}
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-mono text-amber-400/80">REWARD</span>
            <span className="text-xl font-black text-amber-300 font-mono">+15 XP</span>
          </div>
        </div>
      </div>

      {/* Theory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 mb-3 border border-slate-700">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base mb-1">
            {isEn ? '1. The Sequential Problem' : '1. Problema Secvențială'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isEn
              ? 'Executing 10 identical steps requires 10 distinct blocks. Code becomes huge, slow to edit, and prone to human errors.'
              : 'Pentru a face 10 pași identici, un program secvențial are nevoie de 10 blocuri separate. Codul devine kilometric și plin de greșeli.'}
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-3 border border-amber-500/30">
            <Repeat className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base mb-1">
            {isEn ? '2. Loop Optimization' : '2. Optimizarea cu Bucle'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isEn
              ? 'A loop (repetitive structure) executes a block of statements repeatedly as long as a condition holds or for a set counter.'
              : 'O structură repetitivă (buclă) execută același bloc de instrucțiuni de mai multe ori, economisind memorie și efort.'}
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 mb-3 border border-orange-500/30">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base mb-1">
            {isEn ? '3. Three Scratch Loops' : '3. Cele 3 Bucle Scratch'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isEn
              ? 'Scratch provides: "repeat (N)", "forever" (game loops), and "repeat until <condition>" (conditional loops).'
              : 'Scratch oferă: „repetă de () ori”, „la infinit” (game loop) și „repetă până când <condiție>” (buclă condiționată).'}
          </p>
        </div>
      </div>

      {/* Interactive Lab: Sequential vs Loop Arena */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">
              {isEn ? 'Interactive Lab: Code Efficiency Benchmark' : 'Laborator Interactiv: Testul de Eficiență a Codului'}
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setActiveCodeMode('sequential');
                resetSimulation();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeCodeMode === 'sequential'
                  ? 'bg-slate-700 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isEn ? 'Sequential (10 Blocks)' : 'Secvențial (10 Blocuri)'}
            </button>
            <button
              onClick={() => {
                setActiveCodeMode('loop');
                resetSimulation();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeCodeMode === 'loop'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isEn ? 'Loop Block (1 Block)' : 'Buclă Scratch (1 Bloc)'}
            </button>
          </div>
        </div>

        {/* Visual Arena */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Code comparison panel */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 font-mono text-xs space-y-2">
            <div className="text-slate-400 flex items-center justify-between text-[11px] pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-amber-400" />
                {activeCodeMode === 'sequential' ? 'script_secvential.sb3' : 'script_bucla.sb3'}
              </span>
              <span className="text-amber-400 font-bold">
                {activeCodeMode === 'sequential' ? '10 instrucțiuni' : '1 instrucțiune repetă'}
              </span>
            </div>

            {activeCodeMode === 'sequential' ? (
              <div className="max-h-52 overflow-y-auto space-y-1.5 pr-2">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg border transition ${
                      stepsExecuted > i
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                        : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300'
                    }`}
                  >
                    <span className="text-slate-500 mr-2">{i + 1}.</span>
                    mergi 10 pași
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 py-3">
                <div className="bg-amber-950/60 border border-amber-500/50 rounded-xl p-3 text-amber-200">
                  <div className="font-bold flex items-center gap-2 mb-2">
                    <Repeat className="w-4 h-4 text-amber-400" />
                    repetă de (10) ori:
                  </div>
                  <div className="ml-5 p-2 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-indigo-200">
                    mergi 10 pași
                  </div>
                </div>
                <div className="text-[11px] text-emerald-400 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/30">
                  ✨ <strong>Eficiență:</strong> 90% mai puține blocuri, memorie redusă, ușor de modificat din 10 în 100 de pași dintr-un singur click!
                </div>
              </div>
            )}
          </div>

          {/* Running track */}
          <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{isEn ? 'Virtual Track' : 'Pista Virtuală de Test'}</span>
              <span className="font-mono text-amber-400 font-bold">
                {stepsExecuted} / 10 {isEn ? 'steps' : 'pași'}
              </span>
            </div>

            {/* Track Line */}
            <div className="relative h-16 bg-slate-900 rounded-xl border border-slate-800 flex items-center px-4 overflow-hidden">
              <div
                className="absolute top-2 bottom-2 left-4 transition-all duration-150 flex items-center justify-center"
                style={{ transform: `translateX(${robotPos * 26}px)` }}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500 border-2 border-amber-300 flex items-center justify-center text-xl shadow-lg shadow-amber-500/40">
                  🤖
                </div>
              </div>
              <div className="absolute right-4 top-2 bottom-2 flex items-center">
                <span className="text-2xl">🏁</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => runSimulation(activeCodeMode)}
                disabled={isRunning}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 disabled:opacity-50 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>
                  {isRunning
                    ? isEn
                      ? 'Executing...'
                      : 'Se execută...'
                    : isEn
                    ? 'Execute Algorithm'
                    : 'Execută Algoritmul'}
                </span>
              </button>
              <button
                onClick={resetSimulation}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mini-Quiz */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-white text-base">
            {isEn
              ? 'Comprehension Check: Which loop is ideal when the number of steps is known beforehand?'
              : 'Verificare de Înțelegere: Ce buclă alegem când știm dinainte numărul exact de repetări?'}
          </h3>
        </div>

        <p className="text-xs text-slate-300">
          {isEn
            ? 'For example, drawing a regular hexagon with 6 identical sides:'
            : 'De exemplu, pentru a desena un hexagon regulat cu 6 laturi identice:'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'repeat_n',
              label: 'repetă de (6) ori',
              desc: isEn ? 'Loop with known counter' : 'Buclă cu contor fix cunoscut'
            },
            {
              id: 'forever',
              label: 'la infinit',
              desc: isEn ? 'Unstoppable loop' : 'Buclă nesfârșită (fără oprire)'
            },
            {
              id: 'repeat_until',
              label: 'repetă până când <...>',
              desc: isEn ? 'Conditional loop' : 'Buclă condiționată de un eveniment'
            }
          ].map((item) => {
            const isSelected = selectedLoopType === item.id;
            const isCorrect = item.id === 'repeat_n';

            let btnStyle = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
            if (quizAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
              } else if (isSelected) {
                btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }
            }

            return (
              <button
                key={item.id}
                onClick={() => handleQuiz(item.id)}
                disabled={isLocked('loopType') || selectedLoopType === 'repeat_n'}
                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer disabled:cursor-not-allowed ${btnStyle}`}
              >
                <div>
                  <div className="font-mono font-bold text-sm mb-1">{item.label}</div>
                  <div className="text-[11px] text-slate-400">{item.desc}</div>
                </div>
                {quizAnswered && isCorrect && (
                  <div className="mt-2 text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Corect!
                  </div>
                )}
                {quizAnswered && isSelected && !isCorrect && (
                  <div className="mt-2 text-xs font-bold text-rose-400 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Incorect
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {cooldowns.loopType && cooldowns.loopType > 0 ? (
          <PedagogicalReflectionBanner
            cooldown={cooldowns.loopType}
            totalSeconds={5}
            customMessageRo="Timp de reflecție: Hexagonul are 6 laturi egale, deci numărul de repetiții este fix (repetă de 6 ori)!"
            customMessageEn="Reflection buffer: The hexagon has 6 equal sides, requiring a fixed repeat (6) loop!"
          />
        ) : null}

        <QuestionHint
          hint={
            isEn
              ? 'A regular hexagon has exactly 6 equal sides, so the number of iterations is known before running.'
              : 'Hexagonul are exact 6 laturi egale, deci numărul de pași este fix și cunoscut dinainte (6 repetări).'
          }
        />

        {quizAnswered && (
          <AnswerExplanation
            isCorrect={selectedLoopType === 'repeat_n'}
            explanation={
              isEn
                ? 'Correct! When the exact count is predetermined (e.g. 6 sides of a hexagon), the "repeat (N)" block is optimal.'
                : 'Corect! Când numărul de iterații este fix și cunoscut de la început (cele 6 laturi ale hexagonului), blocul „repetă de (N) ori” este alegerea matematică optimă!'
            }
          />
        )}
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        canProceed={canProceed}
        onNext={() => onCompletePage(15)}
        nextLabel={isEn ? 'Level 2: While vs Repeat Until' : 'Nivelul 2: Cât timp vs Repetă până când'}
      />
    </div>
  );
};
