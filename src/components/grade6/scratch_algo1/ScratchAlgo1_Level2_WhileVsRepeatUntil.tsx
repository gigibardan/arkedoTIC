import React, { useState } from 'react';
import {
  GitCompare,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Zap,
  RotateCcw,
  Play,
  ArrowRight,
  Code2
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { useQuestionCooldowns, PedagogicalReflectionBanner } from '../../../utils/pedagogicalGrading';

interface Level2Props {
  onCompletePage: (earnedScore: number) => void;
}

interface ConversionExercise {
  id: string;
  pseudocode: string;
  variableName: string;
  initialValue: number;
  stepChange: number;
  options: {
    id: string;
    scratchBlock: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

const EXERCISES: ConversionExercise[] = [
  {
    id: 'ex1',
    pseudocode: 'cât timp (energie > 0) execută mergi',
    variableName: 'energie',
    initialValue: 3,
    stepChange: -1,
    options: [
      {
        id: 'opt1',
        scratchBlock: 'repetă până când <energie = 0>',
        isCorrect: true,
        explanation: 'Corect! Când energia devine 0, condiția devine ADEVĂRATĂ și bucla Scratch se oprește exact ca în pseudocod.'
      },
      {
        id: 'opt2',
        scratchBlock: 'repetă până când <energie > 0>',
        isCorrect: false,
        explanation: 'Greșit! Dacă energia este 3 (> 0), condiția ar fi deja adevărată de la început și bucla Scratch NU s-ar executa deloc!'
      },
      {
        id: 'opt3',
        scratchBlock: 'la infinit',
        isCorrect: false,
        explanation: 'Greșit! Această buclă nu se oprește niciodată când se termină energia.'
      }
    ]
  },
  {
    id: 'ex2',
    pseudocode: 'cât timp (distanță > 20) execută înainte',
    variableName: 'distanță',
    initialValue: 60,
    stepChange: -20,
    options: [
      {
        id: 'opt1',
        scratchBlock: 'repetă până când <distanță > 20>',
        isCorrect: false,
        explanation: 'Greșit! La distanță 60, condiția e deja adevărată, deci bucla Scratch s-ar opri imediat fără să facă niciun pas.'
      },
      {
        id: 'opt2',
        scratchBlock: 'repetă până când <distanță < 21>',
        isCorrect: true,
        explanation: 'Excelent! Condiția de oprire este negația logică: când distanța coboară la 20 sau mai puțin, bucla se oprește!'
      },
      {
        id: 'opt3',
        scratchBlock: 'repetă de (10) ori',
        isCorrect: false,
        explanation: 'Greșit! Numărul de pași depinde de obstacol, nu de un număr fix de 10.'
      }
    ]
  },
  {
    id: 'ex3',
    pseudocode: 'cât timp (puncte < 50) execută adună_monedă',
    variableName: 'puncte',
    initialValue: 20,
    stepChange: 15,
    options: [
      {
        id: 'opt1',
        scratchBlock: 'repetă până când <puncte > 49>',
        isCorrect: true,
        explanation: 'Corect! Scratch rulează până când punctele ating sau depășesc 50, realizând exact ce cerea algoritmul.'
      },
      {
        id: 'opt2',
        scratchBlock: 'repetă până când <puncte < 50>',
        isCorrect: false,
        explanation: 'Greșit! La început punctele sunt 20 (< 50), deci condiția ar fi adevărată și bucla s-ar opri fără să adune vreo monedă.'
      }
    ]
  }
];

export const ScratchAlgo1_Level2_WhileVsRepeatUntil: React.FC<Level2Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [currentExIndex, setCurrentExIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [simulationVal, setSimulationVal] = useState<number>(EXERCISES[0].initialValue);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simLog, setSimLog] = useState<string[]>([]);
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const currentExercise = EXERCISES[currentExIndex];
  const selectedOptionId = selectedAnswers[currentExercise.id];
  const currentExSolved = currentExercise.options.find((o) => o.id === selectedOptionId)?.isCorrect;

  const handleSelectOption = (optId: string, isCorrect: boolean) => {
    if (isLocked(currentExercise.id) || currentExSolved) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentExercise.id]: optId }));
    if (isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown(currentExercise.id, 5);
    }
  };

  const runStepSimulation = () => {
    setIsSimulating(true);
    let val = currentExercise.initialValue;
    setSimulationVal(val);
    const logs: string[] = [`Start: ${currentExercise.variableName} = ${val}`];
    setSimLog([...logs]);
    sounds.playClick();

    const interval = setInterval(() => {
      val += currentExercise.stepChange;
      setSimulationVal(val);
      sounds.playPop();

      // Check exit condition based on exercise
      let shouldStop = false;
      if (currentExercise.id === 'ex1' && val <= 0) shouldStop = true;
      if (currentExercise.id === 'ex2' && val <= 20) shouldStop = true;
      if (currentExercise.id === 'ex3' && val >= 50) shouldStop = true;

      logs.push(`Pas: ${currentExercise.variableName} devine ${val} -> ${shouldStop ? '🛑 STOP (Condiție atinsă!)' : '🔄 Continuă bucla'}`);
      setSimLog([...logs]);

      if (shouldStop) {
        clearInterval(interval);
        setIsSimulating(false);
        sounds.playCorrect();
      }
    }, 450);
  };

  // Count correct answers
  const correctCount = EXERCISES.filter((ex) => {
    const sel = selectedAnswers[ex.id];
    const opt = ex.options.find((o) => o.id === sel);
    return opt?.isCorrect;
  }).length;

  const canProceed = correctCount === EXERCISES.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/60 via-indigo-950/40 to-slate-900 border-2 border-blue-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-mono font-bold uppercase tracking-wider">
                {isEn ? 'Grade 6 • Unit 4A • Level 2 of 7' : 'Clasa a VI-a • Unitatea 4A • Nivelul 2 din 7'}
              </span>
              <span className="text-xs text-slate-400 font-mono">Manual pag. 64–67</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight flex items-center gap-3">
              <GitCompare className="w-8 h-8 text-blue-400" />
              <span>{isEn ? 'While vs Repeat Until (The Logic Inversion)' : '„Cât timp” vs „Repetă până când” (Inversarea Logică)'}</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              {isEn
                ? 'Master the crucial difference between textbook Pseudocode (While loop) and Scratch (Repeat Until): how to invert conditions correctly!'
                : 'Stăpânește marea diferență dintre Pseudocod („Cât timp”) și Scratch („Repetă până când”): cum transformăm corect condițiile folosind negația logică!'}
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-mono text-blue-400/80">REWARD</span>
            <span className="text-xl font-black text-blue-300 font-mono">+15 XP</span>
          </div>
        </div>
      </div>

      {/* The Core Comparative Concept Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* While Loop in Pseudocode */}
        <div className="bg-slate-900/90 border-2 border-indigo-500/30 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold font-mono text-sm">
              WHILE
            </div>
            <h3 className="font-bold text-white text-base">Pseudocod: „Cât timp”</h3>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-indigo-300 mb-3">
            cât timp <span className="text-amber-400 font-bold">[condiție = ADEVĂRAT]</span> execută
            <div className="pl-4 text-slate-400">instrucțiuni...</div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Rulează <strong>cât timp condiția este îndeplinită</strong>. Imediat ce condiția devine falsă, bucla se oprește.
          </p>
        </div>

        {/* Repeat Until in Scratch */}
        <div className="bg-slate-900/90 border-2 border-amber-500/30 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold font-mono text-sm">
              UNTIL
            </div>
            <h3 className="font-bold text-white text-base">Scratch: „Repetă până când”</h3>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-amber-300 mb-3">
            repetă până când <span className="text-emerald-400 font-bold">&lt;condiție_oprire = ADEVĂRAT&gt;</span>
            <div className="pl-4 text-slate-400">instrucțiuni...</div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Rulează <strong>cât timp condiția este FALSĂ</strong> și se oprește când condiția din hexagon devine <strong>ADEVĂRATĂ</strong>!
          </p>
        </div>
      </div>

      {/* Interactive Translation Lab */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">
              {isEn ? 'Algorithm Translation Challenge' : 'Atelierul de Transpunere: Pseudocod ➡️ Scratch'}
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            {EXERCISES.map((ex, idx) => (
              <button
                key={ex.id}
                onClick={() => {
                  setCurrentExIndex(idx);
                  setSimulationVal(ex.initialValue);
                  setSimLog([]);
                  sounds.playClick();
                }}
                className={`w-8 h-8 rounded-xl font-mono text-xs font-bold transition cursor-pointer ${
                  currentExIndex === idx
                    ? 'bg-blue-600 text-white'
                    : selectedAnswers[ex.id]
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Current Challenge */}
        <div className="space-y-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-mono text-indigo-400 uppercase font-bold block mb-1">
              Algoritm Pseudocod Sursă:
            </span>
            <div className="text-base sm:text-lg font-mono font-black text-amber-300">
              {currentExercise.pseudocode}
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Valoare inițială: <code className="text-white font-mono">{currentExercise.variableName} = {currentExercise.initialValue}</code> (scade cu 1 la fiecare pas).
            </div>
          </div>

          <div className="text-sm font-bold text-white">
            {isEn
              ? 'Select the equivalent Scratch block that terminates at the exact same moment:'
              : 'Alege blocul Scratch echivalent care se oprește exact în același moment:'}
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3">
            {currentExercise.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const hasAnswered = !!selectedOptionId;

              let style = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (hasAnswered) {
                if (opt.isCorrect) {
                  style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                } else if (isSelected) {
                  style = 'bg-rose-950/60 border-rose-500 text-rose-200';
                }
              }

              return (
                <button
                  key={opt.id}
                  disabled={isLocked(currentExercise.id) || !!currentExSolved}
                  onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                  className={`p-4 rounded-2xl border text-left transition flex items-start justify-between gap-3 cursor-pointer disabled:cursor-not-allowed ${style}`}
                >
                  <div className="space-y-1">
                    <div className="font-mono font-bold text-sm text-amber-300">
                      {opt.scratchBlock}
                    </div>
                    {hasAnswered && isSelected && (
                      <p className="text-xs text-slate-300 mt-1">{opt.explanation}</p>
                    )}
                  </div>
                  <div>
                    {hasAnswered && opt.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {hasAnswered && isSelected && !opt.isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {cooldowns[currentExercise.id] && cooldowns[currentExercise.id] > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns[currentExercise.id]}
              totalSeconds={5}
              customMessageRo="Timp de reflecție: 'Cât timp' repetă cât timp condiția e adevărată; Scratch 'repetă până când' repetă până când devine adevărată!"
              customMessageEn="Reflection buffer: 'While' repeats while true; Scratch 'repeat until' repeats until condition turns true!"
            />
          ) : null}

          {/* Live Step-By-Step Simulation Box */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Play className="w-4 h-4 text-blue-400" />
                Simulator Execuție Pas-cu-Pas
              </span>
              <button
                onClick={runStepSimulation}
                disabled={isSimulating}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
              >
                <span>{isSimulating ? 'Rulează...' : 'Testează Execuția'}</span>
              </button>
            </div>

            {simLog.length > 0 ? (
              <div className="bg-slate-900 rounded-xl p-3 font-mono text-xs space-y-1 max-h-36 overflow-y-auto border border-slate-800">
                {simLog.map((log, i) => (
                  <div key={i} className="text-slate-300">
                    {log}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic p-2">
                Apasă „Testează Execuția” pentru a vedea cum evoluează variabila și momentul când Scratch oprește bucla.
              </div>
            )}
          </div>
        </div>

        <QuestionHint
          hint={
            isEn
              ? 'Remember: In Scratch, Repeat Until keeps going as long as the condition is FALSE. It stops the moment the condition turns TRUE.'
              : 'Reține regula de aur: Bucla Scratch rulează cât timp condiția este FALSĂ. Se oprește în momentul exact în care condiția devine ADEVĂRATĂ!'
          }
        />
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        canProceed={canProceed}
        onNext={() => onCompletePage(15)}
        nextLabel={isEn ? 'Level 3: Logic Operators & Conditions' : 'Nivelul 3: Operatori Logici & Condiții Compuse'}
      />
    </div>
  );
};
