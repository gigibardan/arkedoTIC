import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Triangle,
  Maximize2,
  Minimize2,
  Check,
  RotateCcw,
  Sliders,
  Code
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface Props {
  onPass: (score: number) => void;
}

interface AlgQuiz {
  id: string;
  title: string;
  question: string;
  codeSnippet: string;
  options: {
    label: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

const ALG_QUIZZES: AlgQuiz[] = [
  {
    id: 'a1',
    title: 'Determinarea Maximului a 2 Numere',
    question: 'Avem două numere citite a și b. Ce cod C++ va memora în variabila max valoarea cea mai mare?',
    codeSnippet: 'int a, b, max;\ncin >> a >> b;\n// Care este structura de decizie corectă?',
    options: [
      {
        label: 'if (a > b) max = a; else max = b;',
        isCorrect: true,
        explanation: 'Corect! Dacă a este strict mai mare decât b, max devine a; în caz contrar (b este mai mare sau egal cu a), max devine b.'
      },
      {
        label: 'if (a > b) max = b; else max = a;',
        isCorrect: false,
        explanation: 'Inversat! Aceasta ar calcula minimul, nu maximul.'
      },
      {
        label: 'max = a + b;',
        isCorrect: false,
        explanation: 'Suma numerelor nu este maximul lor.'
      }
    ]
  },
  {
    id: 'a2',
    title: 'Condiția Inegalității Triunghiului',
    question: 'Trei segmente a, b, c pot forma un triunghi dacă suma oricăror două laturi este strict mai mare decât a treia. Cum formulăm condiția?',
    codeSnippet: 'if (_______) {\n    cout << "Pot forma un triunghi valid!";\n} else {\n    cout << "Imposibil geometric!";\n}',
    options: [
      {
        label: 'a + b > c && a + c > b && b + c > a',
        isCorrect: true,
        explanation: 'Excelent! Toate cele 3 inegalități trebuie să fie simultan satisfăcute, deci le legăm cu operatorul conjuncției logice &&.'
      },
      {
        label: 'a + b > c || a + c > b || b + c > a',
        isCorrect: false,
        explanation: 'Dacă folosim || (SAU), ar fi de ajuns o singură condiție satisfăcută, ceea ce permite segmente imposibile precum 1, 2, 100!'
      },
      {
        label: 'a + b + c > 0',
        isCorrect: false,
        explanation: 'Simpla pozitivitate a sumei nu garantează că laturile se pot uni la capete într-un poligon închis.'
      }
    ]
  },
  {
    id: 'a3',
    title: 'Maximul dintre 3 Numere (a, b, c)',
    question: 'Care este modalitatea cea mai eficientă de a găsi maximul a 3 numere folosind if?',
    codeSnippet: 'int max = a;\nif (b > max) max = b;\nif (c > max) max = c;',
    options: [
      {
        label: 'Presupunem inițial că a este maximul, apoi comparăm succesiv cu b și c.',
        isCorrect: true,
        explanation: 'Bravo! Aceasta este tehnica fanionului (sau a maximului curent) recomandată în manualul de clasa a 7-a.'
      },
      {
        label: 'Codul este greșit deoarece lipsește clauza else.',
        isCorrect: false,
        explanation: 'Clauza else este opțională. Aici actualizăm max doar dacă găsim o valoare strict superioară.'
      },
      {
        label: 'Codul funcționează doar pentru numere pozitive.',
        isCorrect: false,
        explanation: 'Funcționează ireproșabil pentru orice numere întregi (inclusiv negative sau zero).'
      }
    ]
  },
  {
    id: 'a4',
    title: 'Test Geometric: Segmentele 3, 4, 10',
    question: 'Pot forma segmentele cu lungimile a = 3, b = 4, c = 10 laturile unui triunghi?',
    codeSnippet: 'a = 3; b = 4; c = 10;\nif (a + b > c && a + c > b && b + c > a)',
    options: [
      {
        label: 'NU, deoarece 3 + 4 = 7, care NU este strict mai mare decât 10 (7 > 10 este fals)!',
        isCorrect: true,
        explanation: 'Corect! Segmentele de lungime 3 și 4, chiar întinse în linie dreaptă, nu pot acoperi distanța de 10 pentru a se întâlni într-un vârf.'
      },
      {
        label: 'DA, deoarece toate cele trei numere sunt pozitive.',
        isCorrect: false,
        explanation: 'Pozitivitatea nu este suficientă; inegalitatea triunghiului este obligatorie.'
      },
      {
        label: 'DA, este un triunghi obtuzunghic.',
        isCorrect: false,
        explanation: 'Nu se poate construi fizic niciun fel de triunghi cu aceste laturi.'
      }
    ]
  }
];

export const DecLevel5_MinMaxAndTriangleInequality: React.FC<Props> = ({ onPass }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptIdx, setSelectedOptIdx] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [score, setScore] = useState(0);

  // Geometric Triangle Live Playground
  const [sideA, setSideA] = useState<number>(6);
  const [sideB, setSideB] = useState<number>(8);
  const [sideC, setSideC] = useState<number>(10);

  const cond1 = sideA + sideB > sideC;
  const cond2 = sideA + sideC > sideB;
  const cond3 = sideB + sideC > sideA;
  const isTriangleValid = cond1 && cond2 && cond3;

  const currentQuiz = ALG_QUIZZES[currentIdx];
  const isFinished = currentIdx >= ALG_QUIZZES.length;

  const handleSelectOption = (idx: number) => {
    sounds.playClick();
    setSelectedOptIdx(idx);

    const opt = currentQuiz.options[idx];
    if (opt.isCorrect) {
      sounds.playSuccess();
      setScore(s => s + 25);
      setFeedback({
        isCorrect: true,
        text: `Excelent! ${opt.explanation}`
      });
    } else {
      sounds.playError();
      setFeedback({
        isCorrect: false,
        text: `Mai verifică o dată! ${opt.explanation}`
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
      {/* Level Header Banner */}
      <div className="bg-gradient-to-r from-orange-950/70 via-slate-900 to-amber-950/60 p-5 sm:p-6 rounded-3xl border-2 border-orange-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 text-[10px] font-mono font-bold tracking-wider uppercase">
              Nivelul 5 din 7 • Modulul 4C
            </span>
            <span className="text-xs text-slate-400 font-mono">Manual Art Klett pag. 79–80</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center gap-2.5">
            <Triangle className="w-6 h-6 text-orange-400" />
            <span>Probleme Clasice: Maxim, Minim &amp; Inegalitatea Triunghiului</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Află cum se combină geometria și algebra în algoritmii de clasa a 7-a! Testează segmentele geometrice și compararea valorilor numerice.
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400">Scor Nivel 5:</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-orange-400">{score} / 100 XP</span>
        </div>
      </div>

      {/* Interactive Geometric Triangle Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
              📐
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Simulatorul Geometric al Inegalității Triunghiului
              </h3>
              <p className="text-xs text-slate-400">
                Ajustează lungimile laturilor <code className="text-cyan-300">a</code>, <code className="text-teal-300">b</code> și <code className="text-amber-300">c</code> și privește construcția geometrică:
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setSideA(6);
                setSideB(8);
                setSideC(10);
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-mono transition cursor-pointer"
            >
              Triunghi Dreptunghic (6, 8, 10)
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setSideA(2);
                setSideB(3);
                setSideC(10);
              }}
              className="px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-mono transition cursor-pointer"
            >
              Segment Rupt Imposibil (2, 3, 10)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Sliders & Values */}
          <div className="lg:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col gap-3 font-mono text-xs">
            {/* Side A */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-cyan-400 font-bold">Latura a = {sideA} cm</span>
                <span className="text-slate-500">1..15 cm</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={sideA}
                onChange={(e) => setSideA(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Side B */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-teal-400 font-bold">Latura b = {sideB} cm</span>
                <span className="text-slate-500">1..15 cm</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={sideB}
                onChange={(e) => setSideB(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
            </div>

            {/* Side C */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-amber-400 font-bold">Latura c = {sideC} cm</span>
                <span className="text-slate-500">1..15 cm</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={sideC}
                onChange={(e) => setSideC(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Detailed Conditions Breakdown */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-[11px]">
              <div className="text-slate-400 font-bold">// Testarea celor 3 inegalități:</div>
              <div className={cond1 ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                1. a + b &gt; c &rarr; {sideA} + {sideB} = {sideA + sideB} &gt; {sideC} ({cond1 ? 'ADEVĂRAT' : 'FALS!'})
              </div>
              <div className={cond2 ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                2. a + c &gt; b &rarr; {sideA} + {sideC} = {sideA + sideC} &gt; {sideB} ({cond2 ? 'ADEVĂRAT' : 'FALS!'})
              </div>
              <div className={cond3 ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                3. b + c &gt; a &rarr; {sideB} + {sideC} = {sideB + sideC} &gt; {sideA} ({cond3 ? 'ADEVĂRAT' : 'FALS!'})
              </div>
            </div>
          </div>

          {/* Visual SVG Geometric Render */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 bg-slate-950/80 rounded-2xl border border-slate-800 min-h-[220px]">
            {isTriangleValid ? (
              <div className="flex flex-col items-center gap-3 animate-fadeIn">
                <svg width="220" height="150" viewBox="0 0 220 150" className="overflow-visible">
                  {/* Triangle Polygon */}
                  <polygon
                    points="110,20 20,130 200,130"
                    fill="rgba(16, 185, 129, 0.2)"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  {/* Side Labels */}
                  <text x="50" y="70" fill="#22d3ee" fontSize="12" fontWeight="bold">a={sideA}</text>
                  <text x="160" y="70" fill="#2dd4bf" fontSize="12" fontWeight="bold">b={sideB}</text>
                  <text x="110" y="145" fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="middle">c={sideC}</text>
                </svg>
                <div className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-xs font-mono font-bold flex items-center gap-1.5 shadow-md">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>TRIUNGHI GEOMETRIC VALID! Pot forma un triunghi.</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 animate-fadeIn">
                <svg width="220" height="120" viewBox="0 0 220 120" className="overflow-visible">
                  {/* Broken Line Representation */}
                  <line x1="20" y1="100" x2="80" y2="100" stroke="#f43f5e" strokeWidth="3" strokeDasharray="4,4" />
                  <line x1="140" y1="100" x2="200" y2="100" stroke="#f43f5e" strokeWidth="3" strokeDasharray="4,4" />
                  <line x1="20" y1="100" x2="200" y2="100" stroke="#64748b" strokeWidth="2" />
                  <text x="50" y="90" fill="#f43f5e" fontSize="11" fontWeight="bold">a={sideA}</text>
                  <text x="170" y="90" fill="#f43f5e" fontSize="11" fontWeight="bold">b={sideB}</text>
                  <text x="110" y="115" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">c={sideC} (prea lung!)</text>
                </svg>
                <div className="px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/50 text-xs font-mono font-bold flex items-center gap-1.5 shadow-md">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>IMPOSIBIL GEOMETRIC! Suma laturilor nu acoperă a treia latură.</span>
                </div>
              </div>
            )}

            <div className="mt-2 text-center text-[11px] font-mono text-slate-400">
              C++: <code className="text-amber-300">if (a+b&gt;c &amp;&amp; a+c&gt;b &amp;&amp; b+c&gt;a)</code> &rarr;{' '}
              <span className={isTriangleValid ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {isTriangleValid ? 'true (Adevărat)' : 'false (Fals)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Section */}
      {!isFinished ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs">
                {currentIdx + 1}
              </span>
              <h3 className="text-base font-bold text-white">
                Provocarea {currentIdx + 1}/{ALG_QUIZZES.length}: {currentQuiz.title}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Întrebarea {currentIdx + 1}/{ALG_QUIZZES.length}
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs sm:text-sm">
            <div className="text-slate-300 text-xs sm:text-sm mb-3 font-sans leading-relaxed">
              {currentQuiz.question}
            </div>
            <pre className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-orange-300 overflow-x-auto text-xs">
              {currentQuiz.codeSnippet}
            </pre>
          </div>

          <div className="text-sm font-bold text-white">
            Alege varianta corectă:
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
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md font-sans"
              >
                <span>Următoarea Problemă</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Finished Level Card */
        <div className="bg-gradient-to-br from-slate-900 to-orange-950/40 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 text-center shadow-2xl flex flex-col items-center gap-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center text-3xl shadow-lg">
            📐
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
              Maestru al Algoritmilor Clasici!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
              Ai demonstrat că stăpânești logica determinării maximului și inegalitatea triunghiului în C++, conform manualului de clasa a 7-a!
            </p>
          </div>

          <div className="bg-slate-950/80 px-6 py-2.5 rounded-2xl border border-slate-800 text-orange-400 font-mono font-bold text-sm">
            Scor obținut: +{score} XP
          </div>

          <button
            type="button"
            onClick={handleFinishLevel}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Treci la Nivelul 6: Laborator Live Code::Blocks cu if - else if - else</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
