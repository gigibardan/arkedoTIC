import React, { useState } from 'react';
import {
  Repeat,
  Calculator,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Zap,
  Code,
  Layers
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

export const ScratchAlgo2_Level1_CounterLoopAndGauss: React.FC<Level1Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  // Interactive Lab State: Gauss Sum calculation simulator
  const [targetN, setTargetN] = useState<number>(5);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [accumulatedSum, setAccumulatedSum] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [stepHistory, setStepHistory] = useState<{ step: number; added: number; total: number }[]>([]);

  // Quiz state
  const [qGaussFormula, setQGaussFormula] = useState<string | null>(null);
  const [qBlockType, setQBlockType] = useState<string | null>(null);

  // Gauss formula: n * (n + 1) / 2
  const formulaResult = (targetN * (targetN + 1)) / 2;

  const runGaussSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setCurrentStep(0);
    setAccumulatedSum(0);
    setStepHistory([]);
    sounds.playClick();

    let step = 0;
    let sum = 0;
    const history: { step: number; added: number; total: number }[] = [];

    const interval = setInterval(() => {
      step++;
      sum += step;
      history.push({ step, added: step, total: sum });
      setCurrentStep(step);
      setAccumulatedSum(sum);
      setStepHistory([...history]);
      sounds.playPop();

      if (step >= targetN) {
        clearInterval(interval);
        setIsSimulating(false);
        sounds.playCorrect();
      }
    }, 450);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setCurrentStep(0);
    setAccumulatedSum(0);
    setStepHistory([]);
    sounds.playClick();
  };

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const handleGaussQuiz = (val: string) => {
    if (isLocked('qGauss') || qGaussFormula === 'n_times_n_plus_1_div_2') return;
    setQGaussFormula(val);
    if (val === 'n_times_n_plus_1_div_2') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('qGauss', 5);
    }
  };

  const handleBlockQuiz = (val: string) => {
    if (isLocked('qBlock') || qBlockType === 'repeat_n') return;
    setQBlockType(val);
    if (val === 'repeat_n') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('qBlock', 5);
    }
  };

  const isFormValid = qGaussFormula === 'n_times_n_plus_1_div_2' && qBlockType === 'repeat_n';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900/80 via-slate-900 to-indigo-950/80 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {isEn ? 'Unit 4 • Lessons 5–7 (Textbook pp. 76–77)' : 'Unitatea 4 • Lecțiile 5–7 (Manual pag. 76–77)'}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold">
                {isEn ? 'Page 1 of 7' : 'Pagina 1 din 7'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              {isEn ? 'Counter Loops (FOR) & The Gauss Algorithm' : 'Structura Repetitivă cu Contor (PENTRU) & Suma lui Gauss'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {isEn
                ? 'Discover how the "repeat (n)" block acts as a FOR loop with a known number of steps. Watch Carl Friedrich Gauss’s legendary sum calculation unfold in real-time Scratch code!'
                : 'Descoperă cum blocul nativ Scratch „repetă (n)” implementează structura „Pentru contor ← 1, n execută”. Vezi cum se calculează suma primelor n numere naturale și economisește sute de instrucțiuni!'}
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-400/40 flex items-center justify-center text-3xl shadow-inner shrink-0">
            🧮
          </div>
        </div>
      </div>

      {/* Theory Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 text-amber-400">
          <BookOpen className="w-5 h-5" />
          <h2 className="text-lg font-bold text-white">
            {isEn ? 'Theory: Loop with Known Number of Steps' : 'Teorie: Structura Repetitivă cu Număr Cunoscut de Pași'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="font-bold text-amber-300 flex items-center gap-1.5 font-mono">
              <Code className="w-4 h-4 text-amber-400" />
              {isEn ? 'Pseudocode: FOR Loop' : 'Pseudocod: Structura PENTRU'}
            </div>
            <pre className="p-3 bg-slate-900 rounded-xl font-mono text-[11px] sm:text-xs text-emerald-300 border border-slate-800 overflow-x-auto">
{`suma ← 0
pentru i ← 1, n execută
   suma ← suma + i
sfârșit_pentru
scrie suma`}
            </pre>
            <p className="text-slate-400 text-xs">
              {isEn
                ? 'The counter variable "i" automatically increments by 1 at each step, from 1 to n.'
                : 'Variabila contor „i” crește automat cu 1 la fiecare pas, executând corpul buclei exact de n ori.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="font-bold text-amber-300 flex items-center gap-1.5 font-mono">
              <Repeat className="w-4 h-4 text-purple-400" />
              {isEn ? 'Scratch: repeat (n) block' : 'Scratch: Blocul „repetă (n)”'}
            </div>
            <div className="p-3 bg-amber-950/30 rounded-xl border border-amber-500/30 text-xs space-y-1 font-mono text-amber-200">
              <div>🔸 setează [suma v] la (0)</div>
              <div>🔸 setează [contor v] la (1)</div>
              <div className="pl-3 border-l-2 border-amber-500">
                <div>🔄 repetă (n)</div>
                <div className="pl-3">
                  <div>modifică [suma v] cu (contor)</div>
                  <div>modifică [contor v] cu (1)</div>
                </div>
              </div>
              <div>💬 spune [suma] pentru (2) secunde</div>
            </div>
            <p className="text-slate-400 text-xs">
              {isEn
                ? 'Because Scratch repeat(n) does not auto-increment a variable, we use our own counter variable inside.'
                : 'În Scratch, blocul galben „repetă (n)” cere să mărim manual variabila contor cu blocul „modifică [contor] cu (1)”.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Simulator Card: Gauss Calculator */}
      <div className="bg-slate-900/90 border-2 border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base sm:text-lg">
              {isEn ? 'Interactive Gauss Sum Lab: 1 + 2 + 3 + ... + n' : 'Laborator Interactiv: Calculatorul Suma lui Gauss'}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">{isEn ? 'Choose n:' : 'Alege n:'}</span>
            {[3, 5, 8, 10].map((num) => (
              <button
                key={num}
                disabled={isSimulating}
                onClick={() => {
                  setTargetN(num);
                  setCurrentStep(0);
                  setAccumulatedSum(0);
                  setStepHistory([]);
                  sounds.playClick();
                }}
                className={`px-2.5 py-1 rounded-lg font-bold border transition cursor-pointer ${
                  targetN === num
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                n = {num}
              </button>
            ))}
          </div>
        </div>

        {/* Visualizer Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Scratch Code View */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
            <div className="text-slate-400 font-bold text-[11px] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>{isEn ? 'Code Execution' : 'Execuție Script'}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] ${isSimulating ? 'bg-amber-500/20 text-amber-400 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
                {isSimulating ? (isEn ? 'RUNNING...' : 'ÎN EXECUȚIE...') : (isEn ? 'IDLE' : 'ASTEPTARE')}
              </span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400">
              setează [suma v] la (0)
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400">
              setează [i v] la (1)
            </div>
            <div className={`p-2.5 rounded-xl border ${isSimulating ? 'border-amber-500 bg-amber-950/40 text-amber-300' : 'border-slate-800 bg-slate-900/60 text-slate-300'}`}>
              <div className="font-bold">🔄 repetă ({targetN})</div>
              <div className="pl-4 border-l-2 border-amber-500/60 my-1 space-y-1 text-[11px]">
                <div className={currentStep > 0 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                  modifică [suma v] cu (i)
                </div>
                <div className={currentStep > 0 ? 'text-cyan-400 font-bold' : 'text-slate-400'}>
                  modifică [i v] cu (1)
                </div>
              </div>
            </div>
          </div>

          {/* Live Variables & Gauss Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <div className="text-slate-400 font-bold text-[11px] uppercase tracking-wider mb-2">
                {isEn ? 'Memory Variables' : 'Variabile în Memorie'}
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] font-mono text-cyan-400 uppercase">{isEn ? 'Counter (i)' : 'Contor (i)'}</div>
                  <div className="text-2xl font-black text-white font-mono">{currentStep}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase">{isEn ? 'Sum (S)' : 'Suma (S)'}</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">{accumulatedSum}</div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {isEn ? 'Gauss Formula Check:' : 'Verificare Formula lui Gauss:'}
              </div>
              <div className="font-mono text-[11px]">
                S = {targetN} × ({targetN} + 1) / 2 = <span className="font-black text-white">{formulaResult}</span>
              </div>
              <div className="text-[10px] text-slate-400">
                {currentStep === targetN && accumulatedSum === formulaResult
                  ? (isEn ? '✅ Exact match! Loop verified.' : '✅ Egalitate perfectă! Bucla a calculat corect.')
                  : (isEn ? 'Press start to see the loop reach this result.' : 'Apasă butonul pentru a vedea bucla pas cu pas.')}
              </div>
            </div>
          </div>

          {/* Step History Log */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-slate-400 font-bold text-[11px] uppercase tracking-wider mb-2">
                {isEn ? 'Iteration Trace' : 'Istoric Iterații'}
              </div>
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1 font-mono text-[11px]">
                {stepHistory.length === 0 ? (
                  <div className="text-slate-600 italic text-center py-6">
                    {isEn ? 'Waiting for execution...' : 'Apasă „Calculează cu Buclă”'}
                  </div>
                ) : (
                  stepHistory.map((item) => (
                    <div key={item.step} className="p-1.5 rounded bg-slate-900/80 border border-slate-800 flex justify-between items-center text-slate-300">
                      <span>Pas #{item.step}: +{item.added}</span>
                      <span className="text-emerald-400 font-bold">Total: {item.total}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-3 flex gap-2">
              <button
                type="button"
                disabled={isSimulating}
                onClick={runGaussSimulation}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isEn ? 'Run Loop' : 'Calculează cu Buclă'}</span>
              </button>
              <button
                type="button"
                disabled={isSimulating}
                onClick={resetSimulation}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Formative Quizzes */}
      <div className="space-y-4">
        {/* Q1: Gauss Formula */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">
                {isEn
                  ? '1. What is the mathematical formula discovered by Gauss for the sum of the first n positive numbers?'
                  : '1. Care este formula matematică a lui Gauss pentru calculul sumei primelor n numere naturale consecutive?'}
              </h3>
            </div>
            <QuestionHint hint={isEn ? 'Multiply n with the next number (n+1) and halve the product!' : 'Înmulțește numărul n cu succesorul său (n+1) și împarte rezultatul la 2!'} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              { id: 'n_times_n_plus_1_div_2', label: 'S = n × (n + 1) / 2', isCorrect: true },
              { id: 'n_times_n', label: 'S = n × n', isCorrect: false },
              { id: 'n_plus_10', label: 'S = (n + 1) × 2', isCorrect: false }
            ].map((opt) => {
              const isSelected = qGaussFormula === opt.id;
              let style = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (qGaussFormula) {
                if (opt.isCorrect) style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                else if (isSelected) style = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={opt.id}
                  disabled={isLocked('qGauss') || qGaussFormula === 'n_times_n_plus_1_div_2'}
                  onClick={() => handleGaussQuiz(opt.id)}
                  className={`p-3.5 rounded-xl border font-mono font-bold text-xs sm:text-sm text-left transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-between gap-2 ${style}`}
                >
                  <span>{opt.label}</span>
                  {qGaussFormula && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {qGaussFormula && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {cooldowns.qGauss && cooldowns.qGauss > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.qGauss}
              totalSeconds={5}
              customMessageRo="Timp de reflecție: Formula sumei lui Gauss este S = n × (n + 1) / 2!"
              customMessageEn="Reflection buffer: The Gauss sum formula is S = n × (n + 1) / 2!"
            />
          ) : null}

          {qGaussFormula && (
            <AnswerExplanation
              isCorrect={qGaussFormula === 'n_times_n_plus_1_div_2'}
              explanation={
                isEn
                  ? 'Correct! Carl Friedrich Gauss discovered this formula in elementary school: S = n(n+1)/2, which gives 5050 for n=100!'
                  : 'Corect! Tânărul Gauss a descoperit că grupând primul cu ultimul număr (1+100, 2+99, etc.) se obțin perechi egale cu n+1, adică formula S = n × (n + 1) / 2!'
              }
            />
          )}
        </div>

        {/* Q2: Scratch block */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-white text-base">
                {isEn
                  ? '2. Which Scratch block implements a loop with an exact, known number of repetitions?'
                  : '2. Ce bloc din categoria „Control” folosești când știi exact de câte ori trebuie repetată o acțiune?'}
              </h3>
            </div>
            <QuestionHint hint={isEn ? 'Look for the yellow block with a circular numeric parameter!' : 'Caută blocul galben care primește direct un număr în oval!'} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              { id: 'repeat_n', label: 'repetă (n)', isCorrect: true },
              { id: 'forever', label: 'la nesfârșit', isCorrect: false },
              { id: 'repeat_until', label: 'repetă până când < >', isCorrect: false }
            ].map((opt) => {
              const isSelected = qBlockType === opt.id;
              let style = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (qBlockType) {
                if (opt.isCorrect) style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                else if (isSelected) style = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={opt.id}
                  disabled={isLocked('qBlock') || qBlockType === 'repeat_n'}
                  onClick={() => handleBlockQuiz(opt.id)}
                  className={`p-3.5 rounded-xl border font-bold text-xs sm:text-sm text-left transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-between gap-2 ${style}`}
                >
                  <span className="font-mono">{opt.label}</span>
                  {qBlockType && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {qBlockType && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {cooldowns.qBlock && cooldowns.qBlock > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.qBlock}
              totalSeconds={5}
              customMessageRo="Timp de reflecție: Blocul „repetă (n)” din Control execută codul de exact n ori!"
              customMessageEn="Reflection buffer: The 'repeat (n)' block executes code exactly n times!"
            />
          ) : null}

          {qBlockType && (
            <AnswerExplanation
              isCorrect={qBlockType === 'repeat_n'}
              explanation={
                isEn
                  ? 'Exactly! The block "repetă (n)" guarantees that its body runs precisely n times, then execution automatically continues with the next block.'
                  : 'Exact! Blocul „repetă (n)” garantează că secvența din interior se execută exact de n ori, după care programul trece la instrucțiunea următoare.'
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
        nextLabel={isEn ? 'Next: Polygons & Geometry (p. 78–81) →' : 'Următorul: Poligoane & Geometrie (pag. 78–81) →'}
      />
    </div>
  );
};
