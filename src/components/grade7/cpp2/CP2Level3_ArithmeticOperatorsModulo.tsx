import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, Calculator, Percent, Divide, Hash, HelpCircle, Check, X } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface Props {
  onPass: (score: number) => void;
}

interface ExpressionProblem {
  id: string;
  expression: string;
  options: number[];
  correctAnswer: number;
  explanation: string;
  tip: string;
}

const PROBLEMS: ExpressionProblem[] = [
  {
    id: 'p1',
    expression: '19 / 5',
    options: [3, 4, 3.8, 14],
    correctAnswer: 3,
    explanation: 'Împărțirea între două numere întregi (int) în C++ este o împărțire întreagă și păstrează DOAR CÂTUL (19 împărțit la 5 dă câtul 3 și restul 4).',
    tip: '19 = 5 * 3 + 4 -> câtul este 3'
  },
  {
    id: 'p2',
    expression: '19 % 5',
    options: [4, 3, 1, 0],
    correctAnswer: 4,
    explanation: 'Operatorul modulo (%) returnează RESTUL împărțirii întregi. 19 împărțit la 5 dă restul 4.',
    tip: '19 - (5 * 3) = 4'
  },
  {
    id: 'p3',
    expression: '427 % 10',
    options: [7, 42, 2, 4],
    correctAnswer: 7,
    explanation: 'Operatorul n % 10 extrage întotdeauna ULTIMA CIFRĂ a unui număr în baza 10! 427 % 10 = 7.',
    tip: 'Orice număr modulo 10 dă ultima sa cifră!'
  },
  {
    id: 'p4',
    expression: '427 / 10',
    options: [42, 7, 4, 42.7],
    correctAnswer: 42,
    explanation: 'Operatorul n / 10 „taie” (elimină) ultima cifră a numărului întreg. 427 / 10 = 42.',
    tip: 'Împărțirea întreagă la 10 șterge ultima cifră a numărului.'
  },
  {
    id: 'p5',
    expression: '68 % 2',
    options: [0, 1, 34, 2],
    correctAnswer: 0,
    explanation: '68 este un număr par, deci se împarte exact la 2 fără rest. Prin urmare, 68 % 2 este 0.',
    tip: 'Dacă n % 2 este 0, numărul este PAR. Dacă este 1, numărul este IMPAR!'
  }
];

export const CP2Level3_ArithmeticOperatorsModulo: React.FC<Props> = ({ onPass }) => {
  // Interactive Lab State
  const [numA, setNumA] = useState<number>(23);
  const [numB, setNumB] = useState<number>(5);

  // Quiz State
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [activeProblemIdx, setActiveProblemIdx] = useState<number>(0);
  const [tested, setTested] = useState<Record<string, boolean>>({});

  const quotient = numB !== 0 ? Math.floor(numA / numB) : 0;
  const remainder = numB !== 0 ? numA % numB : 0;
  const realDivision = numB !== 0 ? (numA / numB).toFixed(2) : 'Nedefinit';

  const handleSelectQuizAnswer = (probId: string, opt: number, correct: number) => {
    sounds.playClick();
    setAnswers(prev => ({ ...prev, [probId]: opt }));
    setTested(prev => ({ ...prev, [probId]: true }));

    if (opt === correct) {
      sounds.playSuccess();
    } else {
      sounds.playError();
    }
  };

  const solvedCount = Object.keys(answers).filter(
    id => answers[id] === PROBLEMS.find(p => p.id === id)?.correctAnswer
  ).length;

  const allPassed = solvedCount === PROBLEMS.length;

  const handleNextProblem = () => {
    sounds.playClick();
    if (activeProblemIdx + 1 < PROBLEMS.length) {
      setActiveProblemIdx(i => i + 1);
    }
  };

  const handleFinish = () => {
    sounds.playLevelUp();
    onPass(100);
  };

  const currentProb = PROBLEMS[activeProblemIdx];

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950 via-slate-900 to-orange-950 border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Nivelul 3 • Clasa a VII-a • Manual Art Klett pag. 75</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Expresii Aritmetice: Câtul <span className="text-amber-400 font-mono">/</span> și Restul Modulo <span className="text-orange-400 font-mono">%</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              În C++, împărțirea între două numere întregi <code className="text-amber-300 font-mono">int</code> dă întotdeauna câtul întreg, iar operatorul procent <code className="text-orange-400 font-mono">%</code> returnează restul. Învață secretele cifrelor și parității!
            </p>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto bg-slate-950/60 p-3 rounded-2xl border border-amber-500/20">
            <span className="text-xs text-slate-400 font-mono">Progres Exerciții</span>
            <span className="text-2xl font-black text-amber-400 font-mono">{solvedCount} <span className="text-xs text-slate-500">/ {PROBLEMS.length}</span></span>
          </div>
        </div>
      </div>

      {/* Interactive Visual Explorer: Euclidean Division Simulator */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Calculator className="w-4 h-4 text-amber-400" />
            <span>Laborator Vizual Interactiv: Împărțirea cu Rest (Teorema Împărțirii cu Rest)</span>
          </div>
          <span className="text-xs font-mono text-amber-400">A = B × Cât + Rest</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Sliders & Controls */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                <span>Deîmpărțit (A): <strong className="text-amber-300 font-bold">{numA}</strong></span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={numA}
                onChange={e => setNumA(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                <span>Împărțitor (B): <strong className="text-orange-300 font-bold">{numB}</strong></span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={numB}
                onChange={e => setNumB(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
              <div>Matematică: <span className="text-white font-bold">{numA} = {numB} × <span className="text-amber-400">{quotient}</span> + <span className="text-orange-400">{remainder}</span></span></div>
              <div>C++ Întreg (int): <span className="text-amber-300">{numA} / {numB} = {quotient}</span> | <span className="text-orange-300">{numA} % {numB} = {remainder}</span></div>
              <div>C++ Real (double): <span className="text-sky-300">(double){numA} / {numB} = {realDivision}</span></div>
            </div>
          </div>

          {/* Visual Bucket Graphic */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center min-h-[160px]">
            <span className="text-[11px] text-slate-400 font-mono mb-2">Grupuri complete de câte {numB} elemente:</span>
            <div className="flex flex-wrap gap-2 justify-center max-w-xs mb-3">
              {Array.from({ length: quotient }).map((_, qIdx) => (
                <div key={qIdx} className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/50 text-amber-300 font-mono text-xs font-bold flex items-center gap-1">
                  <span>Grup #{qIdx + 1}</span>
                  <span className="text-[10px] text-amber-400">({numB})</span>
                </div>
              ))}
            </div>

            {remainder > 0 ? (
              <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-500/50 text-orange-300 font-mono text-xs flex items-center gap-1.5 animate-pulse">
                <span>Rest rămas afară:</span>
                <span className="font-extrabold text-sm">{remainder}</span>
              </div>
            ) : (
              <div className="p-1.5 text-[11px] text-emerald-400 font-mono">
                Împărțire exactă! Restul este 0.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5-Question Challenge Arena */}
      <div className="bg-slate-900/95 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center font-bold text-white text-xs font-mono">
              #{activeProblemIdx + 1}
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Ce valoare are următoarea expresie C++?</h2>
              <p className="text-xs text-slate-400">Exercițiul {activeProblemIdx + 1} din {PROBLEMS.length}</p>
            </div>
          </div>

          <div className="flex gap-1">
            {PROBLEMS.map((p, idx) => {
              const isAns = answers[p.id] !== undefined;
              const isCorr = answers[p.id] === p.correctAnswer;
              let dotClass = 'bg-slate-800 border-slate-700';
              if (isAns) {
                dotClass = isCorr ? 'bg-emerald-500 border-emerald-400' : 'bg-rose-500 border-rose-400';
              }
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setActiveProblemIdx(idx);
                  }}
                  className={`w-3.5 h-3.5 rounded-full border cursor-pointer transition ${dotClass} ${activeProblemIdx === idx ? 'ring-2 ring-amber-400' : ''}`}
                />
              );
            })}
          </div>
        </div>

        {/* Expression Box */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center mb-6">
          <span className="text-xs text-slate-500 font-mono block mb-2">Expresie de calculat:</span>
          <span className="text-3xl sm:text-4xl font-mono font-black text-amber-300 tracking-wider">
            {currentProb.expression}
          </span>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {currentProb.options.map((opt, optIdx) => {
            const isSelected = answers[currentProb.id] === opt;
            const isCorrect = opt === currentProb.correctAnswer;
            const isTested = tested[currentProb.id];

            let btnStyle = 'bg-slate-800 hover:bg-slate-750 text-white border-slate-700';

            if (isTested && isSelected) {
              btnStyle = isCorrect
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                : 'bg-rose-950/80 border-rose-500 text-rose-300 ring-2 ring-rose-500/30';
            }

            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectQuizAnswer(currentProb.id, opt, currentProb.correctAnswer)}
                className={`p-4 rounded-xl border text-center font-mono text-lg font-bold transition cursor-pointer ${btnStyle}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Feedback Section */}
        {tested[currentProb.id] && (
          <div className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-2.5 mb-4 ${
            answers[currentProb.id] === currentProb.correctAnswer
              ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-200'
              : 'bg-rose-950/50 border-rose-500/30 text-rose-200'
          }`}>
            {answers[currentProb.id] === currentProb.correctAnswer ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <HelpCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <span className="font-bold">{answers[currentProb.id] === currentProb.correctAnswer ? 'Corect! ' : 'Nu este corect. '}</span>
              <span>{currentProb.explanation}</span>
            </div>
          </div>
        )}

        {/* Navigation between questions */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500 font-mono">
            {solvedCount} din {PROBLEMS.length} rezolvate corect
          </span>

          <div className="flex items-center gap-3">
            {activeProblemIdx + 1 < PROBLEMS.length ? (
              <button
                type="button"
                onClick={handleNextProblem}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-medium text-xs flex items-center gap-1.5 cursor-pointer border border-slate-700"
              >
                <span>Următorul Exercițiu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : allPassed ? (
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <span>Treci la Nivelul 4: Capcana Atribuirii</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
