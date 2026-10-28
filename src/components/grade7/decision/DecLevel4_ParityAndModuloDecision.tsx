import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Divide,
  Calculator,
  Check,
  RotateCcw,
  Binary,
  Code
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface Props {
  onPass: (score: number) => void;
}

interface ParityQuiz {
  id: string;
  title: string;
  problemStatement: string;
  codeSnippet: string;
  options: {
    label: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

const PARITY_QUIZZES: ParityQuiz[] = [
  {
    id: 'p1',
    title: 'Condiția Standard de Paritate',
    problemStatement: 'Care este expresia corectă în C++ pentru a testa dacă numărul întreg n este număr par?',
    codeSnippet: 'if (_______) {\n    cout << "Numar PAR";\n} else {\n    cout << "Numar IMPAR";\n}',
    options: [
      {
        label: 'n % 2 == 0 (restul împărțirii lui n la 2 este egal cu zero)',
        isCorrect: true,
        explanation: 'Corect! Un număr este par dacă se divide exact cu 2, adică n % 2 este 0.'
      },
      {
        label: 'n / 2 == 0 (câtul împărțirii lui n la 2 este zero)',
        isCorrect: false,
        explanation: 'Incorect! Operatorul / dă câtul întreg. n / 2 == 0 este adevărat doar pentru 0 și 1.'
      },
      {
        label: 'n % 2 = 0 (cu un singur semn egal)',
        isCorrect: false,
        explanation: 'Atenție la capcana de la Nivelul 2! Cu un singur egal este atribuire, ceea ce ar fi greșit într-o condiție.'
      }
    ]
  },
  {
    id: 'p2',
    title: 'Testarea Imparității',
    problemStatement: 'Cum putem testa direct dacă un număr n este impar, fără a folosi ramura else?',
    codeSnippet: 'if (_______) {\n    cout << "Numar IMPAR detectat!";\n}',
    options: [
      {
        label: 'n % 2 != 0  (sau  n % 2 == 1)',
        isCorrect: true,
        explanation: 'Excelent! Un număr este impar dacă restul împărțirii la 2 este diferit de zero (!= 0) sau egal cu 1.'
      },
      {
        label: 'n % 2 == 2',
        isCorrect: false,
        explanation: 'Imposibil! Restul împărțirii la 2 poate fi doar 0 sau 1. Restul nu poate fi niciodată 2.'
      },
      {
        label: 'n / 2 != 0',
        isCorrect: false,
        explanation: 'Operatorul / dă câtul, nu restul!'
      }
    ]
  },
  {
    id: 'p3',
    title: 'Divizibilitate cu 5 și Ultima Cifră',
    problemStatement: 'Un număr este divizibil cu 5 dacă ultima sa cifră este 0 sau 5. Cum scriem condiția în C++?',
    codeSnippet: 'if (_______) {\n    cout << "Divizibil cu 5";\n}',
    options: [
      {
        label: 'n % 5 == 0  (sau n % 10 == 0 || n % 10 == 5)',
        isCorrect: true,
        explanation: 'Foarte bine! Fie verificăm direct n % 5 == 0, fie verificăm dacă ultima cifră (obținută cu n % 10) este 0 sau 5.'
      },
      {
        label: 'n % 10 == 0 && n % 10 == 5',
        isCorrect: false,
        explanation: 'Ultima cifră nu poate fi simultan și 0 și 5 (&& ar fi mereu fals)!'
      },
      {
        label: 'n / 5 == 0',
        isCorrect: false,
        explanation: 'Divizibilitatea depinde de restul împărțirii (%), nu de cât (/).'
      }
    ]
  },
  {
    id: 'p4',
    title: 'Număr de Exact Două Cifre',
    problemStatement: 'Cum verificăm dacă un număr natural n are exact 2 cifre (adică este între 10 și 99 inclusiv)?',
    codeSnippet: 'if (_______) {\n    cout << "Numar de 2 cifre!";\n}',
    options: [
      {
        label: 'n >= 10 && n <= 99',
        isCorrect: true,
        explanation: 'Perfect! Intervalul numerelor naturale de 2 cifre începe la 10 și se termină la 99.'
      },
      {
        label: '10 <= n <= 99',
        isCorrect: false,
        explanation: 'Capcana de sintaxă C++! Scrierea înlănțuită nu funcționează corect în C++ și este evaluată greșit.'
      },
      {
        label: 'n > 9 || n < 100',
        isCorrect: false,
        explanation: 'Dacă folosim || (SAU), orice număr din univers (chiar și 5 sau 500) ar satisface condiția!'
      }
    ]
  }
];

export const DecLevel4_ParityAndModuloDecision: React.FC<Props> = ({ onPass }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptIdx, setSelectedOptIdx] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [score, setScore] = useState(0);

  // Interactive Live Number Inspector
  const [userNumberInput, setUserNumberInput] = useState<number>(42);

  const quotient = Math.floor(userNumberInput / 2);
  const remainder = userNumberInput % 2;
  const isEven = remainder === 0;

  const currentQuiz = PARITY_QUIZZES[currentIdx];
  const isFinished = currentIdx >= PARITY_QUIZZES.length;

  const handleSelectOption = (idx: number) => {
    sounds.playClick();
    setSelectedOptIdx(idx);

    const opt = currentQuiz.options[idx];
    if (opt.isCorrect) {
      sounds.playSuccess();
      setScore(s => s + 25);
      setFeedback({
        isCorrect: true,
        text: `Corect! ${opt.explanation}`
      });
    } else {
      sounds.playError();
      setFeedback({
        isCorrect: false,
        text: `Mai încearcă! ${opt.explanation}`
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
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/60 p-5 sm:p-6 rounded-3xl border-2 border-emerald-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold tracking-wider uppercase">
              Nivelul 4 din 7 • Modulul 4C
            </span>
            <span className="text-xs text-slate-400 font-mono">Manual Art Klett pag. 78</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center gap-2.5">
            <Divide className="w-6 h-6 text-emerald-400" />
            <span>Problema Parității &amp; Divizibilității (n % 2 == 0)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Algoritmul fundamental din manualul de clasa a 7-a: află cum verificăm paritatea, ultima cifră și divizibilitatea folosind operatorul modulo (<code className="text-emerald-400 font-bold">%</code>)!
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400">Scor Nivel 4:</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">{score} / 100 XP</span>
        </div>
      </div>

      {/* Interactive Live Parity Inspector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              🔢
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Laborator Vizual de Testare: Teorema Împărțirii cu Rest
              </h3>
              <p className="text-xs text-slate-400">
                Tastează orice număr natural sau alege una dintre valorile rapide de mai jos:
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[42, 17, 100, 35, 7, 88].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setUserNumberInput(num);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 transition cursor-pointer"
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* User Input & Calculation Breakdown */}
          <div className="lg:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col gap-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Introdu număr n:</span>
              <input
                type="number"
                min="0"
                max="9999"
                value={userNumberInput}
                onChange={(e) => setUserNumberInput(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-24 bg-slate-900 border border-emerald-500/50 rounded-xl px-2.5 py-1 text-right text-emerald-300 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-slate-300">
              <div className="text-[11px] text-slate-400">// Calcul matematic:</div>
              <div>Câtul împărțirii: <span className="text-cyan-400 font-bold">{userNumberInput} / 2 = {quotient}</span></div>
              <div>Restul împărțirii: <span className="text-amber-400 font-bold">{userNumberInput} % 2 = {remainder}</span></div>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                Formula Euclid: {userNumberInput} = 2 &times; {quotient} + {remainder}
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-[11px]">
              <span className="text-slate-400">// Codul C++ din manual:</span>
              <pre className="text-teal-300 mt-1">
{`if (n % 2 == 0)
    cout << "Numar par";
else
    cout << "Numar impar";`}
              </pre>
            </div>
          </div>

          {/* Decision Buckets Display */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Even Bucket */}
            <div className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center text-center justify-between ${
              isEven
                ? 'bg-emerald-950/60 border-emerald-400 shadow-xl shadow-emerald-500/20 scale-105 ring-2 ring-emerald-500/40'
                : 'bg-slate-950/40 border-slate-800 opacity-40'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mb-2">
                🟢
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">COȘUL NUMERELOR PARE</h4>
                <div className="text-xs font-mono text-emerald-300 mt-1">
                  conditie: n % 2 == 0
                </div>
              </div>
              <div className={`mt-3 px-3 py-1 rounded-full text-xs font-bold font-mono ${
                isEven ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
              }`}>
                {isEven ? `Numărul ${userNumberInput} este PAR!` : 'Inactiv'}
              </div>
            </div>

            {/* Odd Bucket */}
            <div className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center text-center justify-between ${
              !isEven
                ? 'bg-amber-950/60 border-amber-400 shadow-xl shadow-amber-500/20 scale-105 ring-2 ring-amber-500/40'
                : 'bg-slate-950/40 border-slate-800 opacity-40'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl mb-2">
                🟡
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">COȘUL NUMERELOR IMPARE</h4>
                <div className="text-xs font-mono text-amber-300 mt-1">
                  conditie: n % 2 != 0
                </div>
              </div>
              <div className={`mt-3 px-3 py-1 rounded-full text-xs font-bold font-mono ${
                !isEven ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-500'
              }`}>
                {!isEven ? `Numărul ${userNumberInput} este IMPAR!` : 'Inactiv'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Section */}
      {!isFinished ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                {currentIdx + 1}
              </span>
              <h3 className="text-base font-bold text-white">
                Provocarea {currentIdx + 1}/{PARITY_QUIZZES.length}: {currentQuiz.title}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Întrebarea {currentIdx + 1}/{PARITY_QUIZZES.length}
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs sm:text-sm">
            <div className="text-slate-300 text-xs sm:text-sm mb-3 font-sans leading-relaxed">
              {currentQuiz.problemStatement}
            </div>
            <pre className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-emerald-300 overflow-x-auto text-xs">
              {currentQuiz.codeSnippet}
            </pre>
          </div>

          <div className="text-sm font-bold text-white">
            Selectează expresia corectă:
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
                  className={`p-4 rounded-2xl border-2 text-left font-mono transition flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? opt.isCorrect
                        ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                        : 'bg-rose-950/80 border-rose-500 text-white'
                      : selectedOptIdx !== null && opt.isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-white opacity-90'
                      : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    isSelected
                      ? opt.isCorrect
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-rose-500 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="text-xs sm:text-sm leading-relaxed font-sans">
                    {opt.label}
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
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md font-sans"
              >
                <span>Următoarea Problemă</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Finished Level Card */
        <div className="bg-gradient-to-br from-slate-900 to-emerald-950/40 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 text-center shadow-2xl flex flex-col items-center gap-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center text-3xl shadow-lg">
            🏆
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
              Expert în Paritate &amp; Divizibilitate!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
              Stăpânești la perfecție utilizarea operatorului <code className="text-emerald-400 font-bold">%</code> pentru a testa paritatea, ultima cifră și apartenența la intervale numerice!
            </p>
          </div>

          <div className="bg-slate-950/80 px-6 py-2.5 rounded-2xl border border-slate-800 text-emerald-400 font-mono font-bold text-sm">
            Scor obținut: +{score} XP
          </div>

          <button
            type="button"
            onClick={handleFinishLevel}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Treci la Nivelul 5: Probleme Clasice (Maxim, Minim &amp; Triunghi)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
