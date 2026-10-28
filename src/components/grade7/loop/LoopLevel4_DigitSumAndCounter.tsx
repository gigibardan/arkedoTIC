import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Calculator,
  PlusCircle,
  Hash,
  RotateCcw,
  Check,
  Code
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface Props {
  onPass: (score: number) => void;
}

const CHALLENGES = [
  {
    id: 's1',
    title: 'Inițializarea Corectă a Sumei',
    codeSnippet: 'int suma = _______;\nwhile (n > 0) {\n    suma = suma + n % 10;\n    n = n / 10;\n}',
    question: 'Cu ce valoare trebuie inițializată variabila suma înainte de intrarea în buclă?',
    options: [
      '0 (elementul neutru la adunare)',
      '1',
      'n',
      '9'
    ],
    correctIdx: 0,
    explanation: 'Suma se inițializează întotdeauna cu 0, deoarece 0 este elementul neutru la adunare (orice valoare adăugată la 0 își păstrează mărimea).'
  },
  {
    id: 's2',
    title: 'Inițializarea Cifrei Minime (Manual pag. 84)',
    codeSnippet: 'int min = _______;\nwhile (n > 0) {\n    int c = n % 10;\n    if (c < min) min = c;\n    n = n / 10;\n}',
    question: 'De ce cifra minimă se inițializează cu 9 și NU cu 0?',
    options: [
      'Dacă am pune min = 0, nicio cifră din n nu ar fi mai mică decât 0, iar rezultatul ar fi eronat mereu 0!',
      'Pentru că 9 este un număr norocos.',
      'Pentru că bucla numără 9 pași.',
      'Nu contează, se poate inițializa cu orice număr negativ.'
    ],
    correctIdx: 0,
    explanation: 'Pentru minim căutăm cea mai mare valoare posibilă la început (9 pentru o cifră), astfel încât prima cifră întâlnită să devină automat noul minim.'
  },
  {
    id: 's3',
    title: 'Filtrarea Cifrelor Pare în Buclă',
    codeSnippet: 'int nr_pare = 0;\nwhile (n > 0) {\n    int c = n % 10;\n    if (_______) nr_pare++;\n    n = n / 10;\n}',
    question: 'Care este condiția de incrementare a contorului de cifre pare?',
    options: [
      'c % 2 == 0',
      'c % 2 != 0',
      'c > 2',
      'n % 2 == 0'
    ],
    correctIdx: 0,
    explanation: 'c % 2 == 0 testează dacă cifra curentă extrasă c are restul împărțirii la 2 egal cu 0 (adică este pară).'
  }
];

export const LoopLevel4_DigitSumAndCounter: React.FC<Props> = ({ onPass }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptIdx, setSelectedOptIdx] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [score, setScore] = useState(0);

  // Live Calculator Demo
  const [userNum, setUserNum] = useState<number>(84352);

  const calculateBreakdown = (num: number) => {
    let temp = Math.abs(num);
    const digits: number[] = [];
    let sum = 0;
    let evens = 0;
    let minD = 9;
    let maxD = 0;

    if (temp === 0) {
      return { digits: [0], sum: 0, evens: 1, minD: 0, maxD: 0 };
    }

    while (temp > 0) {
      const d = temp % 10;
      digits.push(d);
      sum += d;
      if (d % 2 === 0) evens++;
      if (d < minD) minD = d;
      if (d > maxD) maxD = d;
      temp = Math.floor(temp / 10);
    }

    return { digits: digits.reverse(), sum, evens, minD, maxD };
  };

  const currentCalc = calculateBreakdown(userNum);
  const currentChallenge = CHALLENGES[currentIdx];
  const isFinished = currentIdx >= CHALLENGES.length;

  const handleSelectOption = (idx: number) => {
    sounds.playClick();
    setSelectedOptIdx(idx);

    const isCorrect = idx === currentChallenge.correctIdx;
    if (isCorrect) {
      sounds.playSuccess();
      setScore(s => s + 35);
      setFeedback({
        isCorrect: true,
        text: `Excelent! ${currentChallenge.explanation}`
      });
    } else {
      sounds.playError();
      setFeedback({
        isCorrect: false,
        text: `Incorect. ${currentChallenge.explanation}`
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
      <div className="bg-gradient-to-r from-teal-950/70 via-slate-900 to-emerald-950/60 p-5 sm:p-6 rounded-3xl border-2 border-teal-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-mono font-bold tracking-wider uppercase">
              Nivelul 4 din 7 • Modulul 4D
            </span>
            <span className="text-xs text-slate-400 font-mono">Manual Art Klett pag. 83–84</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center gap-2.5">
            <Calculator className="w-6 h-6 text-teal-400" />
            <span>Suma Cifrelor, Contoare &amp; Cifra Minimă / Maximă</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Învață cum se utilizează variabilele acumulatoare (sumă, contor, minim, maxim) în interiorul unei bucle while pe cifrele unui număr!
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400">Scor Nivel 4:</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-teal-400">{score} / 100 XP</span>
        </div>
      </div>

      {/* Interactive Multi-Accumulator Lab */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              🧮
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Laborator Interactiv: Acumulatoare de Cifre în Timp Real
              </h3>
              <p className="text-xs text-slate-400">
                Tastează orice număr și observă calculul paralel al celor 4 algoritmi fundamentali din manual:
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">n =</span>
            <input
              type="number"
              min="1"
              max="9999999"
              value={userNum}
              onChange={(e) => setUserNum(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-28 bg-slate-950 border border-teal-500/50 rounded-xl px-2.5 py-1 text-right text-teal-300 font-bold font-mono text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          {/* Card 1: Suma Cifrelor */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-teal-500/40 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block mb-1">
                1. Suma Cifrelor
              </span>
              <div className="text-2xl font-black text-white">{currentCalc.sum}</div>
              <div className="text-[11px] text-slate-400 mt-1">
                {currentCalc.digits.join(' + ')} = {currentCalc.sum}
              </div>
            </div>
            <div className="text-[10px] text-teal-300/80 mt-3 pt-2 border-t border-slate-800">
              suma += n % 10;
            </div>
          </div>

          {/* Card 2: Cifre Pare */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/40 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                2. Cifre Pare
              </span>
              <div className="text-2xl font-black text-cyan-300">{currentCalc.evens} cifre</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Cifre pare: [{currentCalc.digits.filter(d => d % 2 === 0).join(', ')}]
              </div>
            </div>
            <div className="text-[10px] text-cyan-300/80 mt-3 pt-2 border-t border-slate-800">
              if ((n % 10) % 2 == 0) nr++;
            </div>
          </div>

          {/* Card 3: Cifra Minimă */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/40 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block mb-1">
                3. Cifra Minimă
              </span>
              <div className="text-2xl font-black text-amber-300">{currentCalc.minD}</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Inițializat cu min = 9
              </div>
            </div>
            <div className="text-[10px] text-amber-300/80 mt-3 pt-2 border-t border-slate-800">
              if (c &lt; min) min = c;
            </div>
          </div>

          {/* Card 4: Cifra Maximă */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-purple-500/40 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block mb-1">
                4. Cifra Maximă
              </span>
              <div className="text-2xl font-black text-purple-300">{currentCalc.maxD}</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Inițializat cu max = 0
              </div>
            </div>
            <div className="text-[10px] text-purple-300/80 mt-3 pt-2 border-t border-slate-800">
              if (c &gt; max) max = c;
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Section */}
      {!isFinished ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs font-mono">
                {currentIdx + 1}
              </span>
              <h3 className="text-base font-bold text-white">
                Provocarea {currentIdx + 1}/{CHALLENGES.length}: {currentChallenge.title}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Întrebarea {currentIdx + 1}/{CHALLENGES.length}
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs sm:text-sm">
            <pre className="text-teal-300 overflow-x-auto">
              {currentChallenge.codeSnippet}
            </pre>
          </div>

          <div className="text-sm font-bold text-white">
            {currentChallenge.question}
          </div>

          <div className="flex flex-col gap-3">
            {currentChallenge.options.map((opt, idx) => {
              const isSelected = selectedOptIdx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={selectedOptIdx !== null}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl border-2 text-left transition flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? idx === currentChallenge.correctIdx
                        ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                        : 'bg-rose-950/80 border-rose-500 text-white'
                      : selectedOptIdx !== null && idx === currentChallenge.correctIdx
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-white opacity-90'
                      : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    isSelected
                      ? idx === currentChallenge.correctIdx
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
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md font-sans"
              >
                <span>Următoarea Provocare</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Finished Level Card */
        <div className="bg-gradient-to-br from-slate-900 to-teal-950/40 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 text-center shadow-2xl flex flex-col items-center gap-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center text-3xl shadow-lg">
            🧮
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
              Expert în Acumulatoare &amp; Cifre!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
              Stăpânești la perfecție calculul sumei, filtrarea cifrelor pare și inițializarea corectă pentru cifra minimă și maximă!
            </p>
          </div>

          <div className="bg-slate-950/80 px-6 py-2.5 rounded-2xl border border-slate-800 text-teal-400 font-mono font-bold text-sm">
            Scor obținut: +{score} XP
          </div>

          <button
            type="button"
            onClick={handleFinishLevel}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Treci la Nivelul 5: Oglinditul Numărului &amp; Numărul Palindrom</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
