import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Cpu,
  HelpCircle,
  Award,
  Check
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface A3Level5Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A3Level5_DivisorsAndPrimesClinic: React.FC<A3Level5Props> = ({
  onCompletePage,
  onComplete
}) => {
  const [testNumber, setTestNumber] = useState<number>(28);
  const [divisors, setDivisors] = useState<number[]>([]);
  const [isPrime, setIsPrime] = useState<boolean | null>(null);
  const [isPerfect, setIsPerfect] = useState<boolean | null>(null);
  const [stepsNaiv, setStepsNaiv] = useState<number>(0);
  const [stepsOptim, setStepsOptim] = useState<number>(0);
  const [hasEvaluated, setHasEvaluated] = useState<boolean>(false);

  // Quiz
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const evaluateNumber = (n: number) => {
    sounds.playClick();
    const allDivs: number[] = [];
    let sumProper = 0;

    for (let d = 1; d <= n; d++) {
      if (n % d === 0) {
        allDivs.push(d);
        if (d < n) sumProper += d;
      }
    }

    // Prime test
    let prime = n > 1;
    let sNaiv = n > 2 ? n - 2 : 1;
    let sOptim = Math.floor(Math.sqrt(n));

    if (n <= 1) prime = false;
    else {
      for (let d = 2; d * d <= n; d++) {
        if (n % d === 0) {
          prime = false;
          break;
        }
      }
    }

    const perfect = n > 1 && sumProper === n;

    setDivisors(allDivs);
    setIsPrime(prime);
    setIsPerfect(perfect);
    setStepsNaiv(sNaiv);
    setStepsOptim(sOptim);
    setHasEvaluated(true);
    sounds.playCorrect();
  };

  const isLevelCompleted =
    hasEvaluated &&
    isPrime !== null &&
    q1Answer === 'a' &&
    q2Answer === 'c';

  const handleFinish = () => {
    if (isLevelCompleted) {
      sounds.playCorrect();
      if (onCompletePage) onCompletePage(100);
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl border border-amber-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-400/30 text-amber-300">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/30 text-amber-200 border border-amber-400/30">
                  Modulul 3C • Nivelul 5 din 7
                </span>
                <span className="text-xs text-amber-300">Manual Art Klett pag. 75</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                Laborator de Teoria Numerelor: Divizibilitate, Numere Prime & Numere Perfecte
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-amber-300 uppercase tracking-wider block">Progres Misiune</span>
            <span className="text-lg font-bold text-cyan-300">Nivelul 5: Numere Prime</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-amber-100/90 leading-relaxed max-w-3xl">
          Testul de primalitate este inima criptografiei și a securității informatice moderne. În clasa a VIII-a învățăm nu doar să găsim divizorii unui număr, ci și să optimizăm algoritmul testând divizorii doar până la radicalul numărului (<code className="bg-amber-950 px-1 rounded text-cyan-300 font-mono">d * d &lt;= n</code>).
        </p>
      </div>

      {/* Simulator: Interactive Divisor and Primality Clinic */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input & Presets */}
        <div className="lg:col-span-5 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Cpu className="w-4 h-4 text-amber-400" />
            Configurare Număr de Test
          </h3>

          <div className="space-y-2">
            <label className="text-xs text-slate-300 flex justify-between">
              <span>Introdu numărul <code className="text-amber-300">n</code>:</span>
              <span className="font-mono text-cyan-300 font-bold">{testNumber}</span>
            </label>
            <input
              type="number"
              min="2"
              max="1000"
              value={testNumber}
              onChange={(e) => {
                const val = Number(e.target.value);
                setTestNumber(val);
                setHasEvaluated(false);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 font-mono text-cyan-300 text-sm"
            />
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">Exemple reprezentative:</span>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                onClick={() => {
                  setTestNumber(28);
                  evaluateNumber(28);
                }}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700 font-mono"
              >
                28 (Perfect)
              </button>
              <button
                onClick={() => {
                  setTestNumber(29);
                  evaluateNumber(29);
                }}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700 font-mono"
              >
                29 (Prim)
              </button>
              <button
                onClick={() => {
                  setTestNumber(100);
                  evaluateNumber(100);
                }}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700 font-mono"
              >
                100 (Compus)
              </button>
            </div>
          </div>

          <button
            onClick={() => evaluateNumber(testNumber)}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg font-medium text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            Analizează Divizibilitatea & Primalitatea
          </button>

          {/* Efficiency card */}
          {hasEvaluated && (
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 text-[11px] block font-semibold">Comparație de Eficiență Algoritmică:</span>
              <div className="text-slate-300">
                &bull; Pași metodă naivă (2..n-1): <strong className="text-rose-400">{stepsNaiv} operații</strong>
              </div>
              <div className="text-slate-300">
                &bull; Pași metodă optimizată (d*d &lt;= n): <strong className="text-emerald-400">{stepsOptim} operații</strong>
              </div>
            </div>
          )}
        </div>

        {/* Right: Results Card */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Award className="w-4 h-4 text-emerald-400" />
            Rezultatele Analizei de Divizibilitate
          </h3>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <div>
              <span className="text-slate-400 font-sans text-xs block mb-1">Toți divizorii numărului {testNumber}:</span>
              <div className="flex flex-wrap gap-1.5">
                {divisors.length === 0 ? (
                  <span className="text-slate-600 italic font-sans">Apasă „Analizează” pentru a extrage divizorii...</span>
                ) : (
                  divisors.map((d) => (
                    <span
                      key={d}
                      className="px-2 py-0.5 bg-slate-800 text-cyan-300 rounded border border-slate-700 font-bold"
                    >
                      {d}
                    </span>
                  ))
                )}
              </div>
            </div>

            {hasEvaluated && (
              <div className="space-y-2 pt-2 border-t border-slate-800 font-sans">
                <div
                  className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                    isPrime
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>
                    <strong>Statut Primalitate:</strong>{' '}
                    {isPrime
                      ? `Numărul ${testNumber} este PRIM (are exact 2 divizori: 1 și ${testNumber}).`
                      : `Numărul ${testNumber} este COMPUS (are ${divisors.length} divizori).`}
                  </span>
                </div>

                <div
                  className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                    isPerfect
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300'
                  }`}
                >
                  <Sparkles className="w-4 h-4 flex-shrink-0" />
                  <span>
                    <strong>Statut Număr Perfect:</strong>{' '}
                    {isPerfect
                      ? `Numărul ${testNumber} este PERFECT! Suma divizorilor proprii este egală cu numărul!`
                      : `Nu este număr perfect.`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mini Quiz */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          Verificare Regulamentară C++ (Manual pag. 75)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">Întrebarea 1:</span>
            <p className="text-xs text-slate-300">
              De ce este suficient să testăm divizorii unui număr doar până la <code className="text-amber-300 font-mono">d * d &lt;= n</code> (adică până la radicalul lui n)?
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', label: 'Pentru că divizorii vin în perechi (d și n/d); dacă nu am găsit un divizor mai mic sau egal cu radicalul, nu poate exista niciunul mai mare' },
                { id: 'b', label: 'Pentru a economisi memorie RAM' },
                { id: 'c', label: 'Radicalul este obligatoriu prin lege' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setQ1Answer(opt.id);
                    if (opt.id === 'a') sounds.playCorrect();
                    else sounds.playWrong();
                  }}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                    q1Answer === opt.id
                      ? opt.id === 'a'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span>{opt.label}</span>
                  {q1Answer === opt.id && opt.id === 'a' && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">Întrebarea 2:</span>
            <p className="text-xs text-slate-300">
              Care este cel mai mic număr natural care este considerat <strong>număr perfect</strong> (suma divizorilor strict mai mici decât el este egală cu el însuși)?
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', label: '12' },
                { id: 'b', label: '10' },
                { id: 'c', label: '6 (deoarece divizorii proprii sunt 1, 2, 3, iar 1 + 2 + 3 = 6)' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setQ2Answer(opt.id);
                    if (opt.id === 'c') sounds.playCorrect();
                    else sounds.playWrong();
                  }}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                    q2Answer === opt.id
                      ? opt.id === 'c'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span>{opt.label}</span>
                  {q2Answer === opt.id && opt.id === 'c' && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Completion & Navigation Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-3">
          <div
            className={`w-3 h-3 rounded-full ${
              isLevelCompleted ? 'bg-emerald-400 shadow-lg shadow-emerald-500/50' : 'bg-slate-600'
            }`}
          />
          <span className="text-xs text-slate-300">
            {isLevelCompleted
              ? 'Excelent! Ai explorat divizibilitatea și testul de primalitate optimizat.'
              : 'Evaluează cel puțin un număr și răspunde corect la ambele întrebări.'}
          </span>
        </div>
        <button
          onClick={handleFinish}
          disabled={!isLevelCompleted}
          className={`py-2 px-5 rounded-lg font-medium text-xs flex items-center gap-2 transition-all ${
            isLevelCompleted
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg cursor-pointer'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
          }`}
        >
          <span>Următorul Nivel: Algoritmul lui Euclid (CMMDC & CMMMC)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
