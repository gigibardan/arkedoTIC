import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Scissors,
  Divide,
  RotateCcw,
  Play,
  Lightbulb,
  Check,
  Layers,
  ArrowDown
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface Props {
  onPass: (score: number) => void;
}

interface StepLog {
  step: number;
  initialN: number;
  extractedDigit: number;
  remainingN: number;
}

const QUIZZES = [
  {
    id: 'q1',
    title: 'Prima Cifră Extrasă',
    question: 'Dacă n = 3489, care este prima cifră extrasă la intrarea în bucla while prin operația cifra = n % 10 ?',
    options: [
      '9 (cifra unităților / ultima cifră din dreapta)',
      '3 (cifra miilor)',
      '8 (cifra zecilor)',
      '0'
    ],
    correctIdx: 0,
    explanation: 'Operația modulo 10 (n % 10) extrage întotdeauna ultima cifră din dreapta numărului (cifra unităților).'
  },
  {
    id: 'q2',
    title: 'Tăierea Cifrei Unităților',
    question: 'Dacă n = 3489, care este valoarea lui n după executarea instrucțiunii n = n / 10 ?',
    options: [
      '348 (câtul împărțirii întregi la 10)',
      '348.9 (număr cu virgulă)',
      '9',
      '34'
    ],
    correctIdx: 0,
    explanation: 'Deoarece n este de tip int (întreg), împărțirea la 10 este împărțire întreagă fără rest, eliminând cifra unităților.'
  },
  {
    id: 'q3',
    title: 'Condiția de Oprire',
    question: 'De ce condiția buclei este while (n > 0) și nu while (n >= 0)?',
    options: [
      'Dacă am pune n >= 0, când n devine 0 bucla ar continua la infinit (0 / 10 = 0 mereu >= 0)!',
      'Pentru că numerele naturale nu conțin cifra zero.',
      'C++ nu permite compararea cu zero.',
      'Este doar o preferință vizuală, sunt identice.'
    ],
    correctIdx: 0,
    explanation: 'Dacă condiția ar fi n >= 0, bucla nu s-ar mai opri niciodată la 0, generând o buclă infinită cu cifre 0!'
  }
];

export const LoopLevel3_DigitExtractionChop: React.FC<Props> = ({ onPass }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptIdx, setSelectedOptIdx] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [score, setScore] = useState(0);

  // Interactive Live Digit Peeler State
  const [inputNumber, setInputNumber] = useState<number>(4587);
  const [currentN, setCurrentN] = useState<number>(4587);
  const [history, setHistory] = useState<StepLog[]>([]);
  const [isDonePeeling, setIsDonePeeling] = useState<boolean>(false);

  const currentQuiz = QUIZZES[currentIdx];
  const isFinished = currentIdx >= QUIZZES.length;

  const handleStepPeel = () => {
    sounds.playClick();
    if (currentN <= 0) return;

    const lastDigit = currentN % 10;
    const nextN = Math.floor(currentN / 10);
    const newStep: StepLog = {
      step: history.length + 1,
      initialN: currentN,
      extractedDigit: lastDigit,
      remainingN: nextN
    };

    setHistory(prev => [...prev, newStep]);
    setCurrentN(nextN);

    if (nextN === 0) {
      sounds.playSuccess();
      setIsDonePeeling(true);
    }
  };

  const handleResetPeel = (newVal?: number) => {
    sounds.playClick();
    const val = newVal !== undefined ? newVal : inputNumber;
    setCurrentN(val);
    setHistory([]);
    setIsDonePeeling(false);
  };

  const handleSelectOption = (idx: number) => {
    sounds.playClick();
    setSelectedOptIdx(idx);

    const isCorrect = idx === currentQuiz.correctIdx;
    if (isCorrect) {
      sounds.playSuccess();
      setScore(s => s + 35);
      setFeedback({
        isCorrect: true,
        text: `Corect! ${currentQuiz.explanation}`
      });
    } else {
      sounds.playError();
      setFeedback({
        isCorrect: false,
        text: `Incorect. ${currentQuiz.explanation}`
      });
    }
  };

  const handleNext = () => {
    sounds.playClick();
    setSelectedOptIdx(null);
    setFeedback(null);
    setCurrentIdx(i => i + 1);
  };

  const handleFinishLevel = () => {
    sounds.playLevelUp();
    onPass(Math.min(score, 100));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-orange-950/60 p-5 sm:p-6 rounded-3xl border-2 border-amber-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold tracking-wider uppercase">
              Nivelul 3 din 7 • Modulul 4D
            </span>
            <span className="text-xs text-slate-400 font-mono">Manual Art Klett pag. 82–83</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center gap-2.5">
            <Scissors className="w-6 h-6 text-amber-400" />
            <span>Mecanismul de Aur: Extragerea (n % 10) &amp; Tăierea (n / 10)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Inima algoritmilor de gimnaziu: Află cum se accesează cifrele oricărui număr natural de la dreapta la stânga, până când numărul devine 0!
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400">Scor Nivel 3:</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-amber-400">{score} / 100 XP</span>
        </div>
      </div>

      {/* Interactive Conveyor Belt Digit Peeler */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              ⚙️
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Banda Rulantă de Decojire a Cifrelor (Digit Peeler)
              </h3>
              <p className="text-xs text-slate-400">
                Alege un număr și apasă pe buton pentru a vedea extragerea și tăierea fiecărei cifre pas cu pas:
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[4587, 308, 9214, 55, 78901].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  setInputNumber(num);
                  handleResetPeel(num);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer border ${
                  inputNumber === num
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Simulation Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Controls & Current State */}
          <div className="lg:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col gap-4 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Număr inițial de test:</span>
              <input
                type="number"
                min="1"
                max="999999"
                value={inputNumber}
                onChange={(e) => {
                  const val = Math.max(1, parseInt(e.target.value) || 1);
                  setInputNumber(val);
                  handleResetPeel(val);
                }}
                className="w-28 bg-slate-900 border border-amber-500/50 rounded-xl px-2.5 py-1 text-right text-amber-300 font-bold text-sm focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Valoarea Curentă din n:</span>
                <span className="text-2xl font-black text-amber-400">{currentN}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase block">Condiție while (n &gt; 0):</span>
                <span className={`text-xs font-bold ${currentN > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {currentN > 0 ? `${currentN} > 0 (ADEVĂRAT)` : '0 > 0 (FALS &bull; STOP)'}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleResetPeel()}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer flex-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reia Pasul 1</span>
              </button>
              <button
                type="button"
                disabled={isDonePeeling}
                onClick={handleStepPeel}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer flex-1 shadow-md ${
                  isDonePeeling
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Extrage &amp; Taie (Pas)</span>
              </button>
            </div>
          </div>

          {/* Right: Collected Digits Tray */}
          <div className="lg:col-span-7 bg-slate-950/90 p-4 rounded-2xl border border-slate-800 flex flex-col gap-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                Tăvița Cifrelor Extrase (De la dreapta la stânga):
              </span>
              <span className="text-xs text-amber-400 font-bold">
                {history.length} cifre procesate
              </span>
            </div>

            {/* Collected Digits Badges */}
            <div className="min-h-[50px] flex items-center gap-2 flex-wrap">
              {history.length === 0 ? (
                <span className="text-slate-600 italic">
                  Apasă pe butonul &bdquo;Extrage &amp; Taie&rdquo; pentru a începe decuparea cifrelor.
                </span>
              ) : (
                history.map((h, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 flex items-center justify-center text-lg font-black shadow-md shadow-amber-500/20 animate-fadeIn"
                    title={`Pasul ${h.step}: Cifra ${h.extractedDigit}`}
                  >
                    {h.extractedDigit}
                  </div>
                ))
              )}
            </div>

            {/* Step-by-step Trace Table */}
            <div className="max-h-36 overflow-y-auto space-y-1 text-[11px] border-t border-slate-800 pt-2 text-slate-300">
              {history.map((h, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-900/60 px-2 py-1 rounded">
                  <span>Pas {h.step}: n = {h.initialN}</span>
                  <span className="text-amber-300 font-bold">cifra = {h.initialN} % 10 = {h.extractedDigit}</span>
                  <span className="text-cyan-300">n devine {h.initialN} / 10 = {h.remainingN}</span>
                </div>
              ))}
            </div>

            {isDonePeeling && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Toate cifrele au fost extrase! Numărul a devenit 0 și bucla s-a oprit cu succes.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Challenge Section */}
      {!isFinished ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs font-mono">
                {currentIdx + 1}
              </span>
              <h3 className="text-base font-bold text-white">
                Provocarea {currentIdx + 1}/{QUIZZES.length}: {currentQuiz.title}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Întrebarea {currentIdx + 1}/{QUIZZES.length}
            </span>
          </div>

          <div className="text-sm font-bold text-white">
            {currentQuiz.question}
          </div>

          <div className="flex flex-col gap-3">
            {currentQuiz.options.map((opt, idx) => {
              const isSelected = selectedOptIdx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={selectedOptIdx !== null}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl border-2 text-left transition flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? idx === currentQuiz.correctIdx
                        ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                        : 'bg-rose-950/80 border-rose-500 text-white'
                      : selectedOptIdx !== null && idx === currentQuiz.correctIdx
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-white opacity-90'
                      : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    isSelected
                      ? idx === currentQuiz.correctIdx
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-rose-500 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="text-xs sm:text-sm leading-relaxed font-sans">
                    {opt}
                  </div>
                </button>
              );
            })}
          </div>

          {feedback && (
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn ${
              feedback.isCorrect
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                : 'bg-rose-950/60 border-rose-500/60 text-rose-200'
            }`}>
              <div className="flex items-center gap-2.5">
                {feedback.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <span className="text-xs sm:text-sm font-medium leading-relaxed font-sans">
                  {feedback.text}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md font-sans"
              >
                <span>Următoarea Provocare</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Finished Level Card */
        <div className="bg-gradient-to-br from-slate-900 to-amber-950/40 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 text-center shadow-2xl flex flex-col items-center gap-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center text-3xl shadow-lg">
            ✂️
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
              Mecanismul de Aur Stăpânit la Perfecție!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
              Știi exact cum funcționează <code className="text-amber-400 font-bold">n % 10</code> (extragerea) și <code className="text-cyan-400 font-bold">n / 10</code> (tăierea) în orice problemă de prelucrare a cifrelor!
            </p>
          </div>

          <div className="bg-slate-950/80 px-6 py-2.5 rounded-2xl border border-slate-800 text-amber-400 font-mono font-bold text-sm">
            Scor obținut: +{score} XP
          </div>

          <button
            type="button"
            onClick={handleFinishLevel}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Treci la Nivelul 4: Suma Cifrelor &amp; Numărarea Cifrelor Pare</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
