import React, { useState } from 'react';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  HelpCircle,
  Zap,
  Check
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface A3Level6Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface StepLog {
  step: number;
  a: number;
  b: number;
  op: string;
}

export const A3Level6_EuclidGcdAndLcmStudio: React.FC<A3Level6Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();
  const [valA, setValA] = useState<number>(48);
  const [valB, setValB] = useState<number>(18);
  const [subtractionLogs, setSubtractionLogs] = useState<StepLog[]>([]);
  const [moduloLogs, setModuloLogs] = useState<StepLog[]>([]);
  const [cmmdcResult, setCmmdcResult] = useState<number | null>(null);
  const [cmmmcResult, setCmmmcResult] = useState<number | null>(null);
  const [hasRun, setHasRun] = useState<boolean>(false);

  // Quiz
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const runEuclid = () => {
    sounds.playClick();
    const a0 = Math.abs(valA);
    const b0 = Math.abs(valB);

    if (a0 === 0 || b0 === 0) return;

    // Subtraction method
    let aSub = a0;
    let bSub = b0;
    const subSteps: StepLog[] = [];
    let sStep = 1;

    while (aSub !== bSub) {
      if (aSub > bSub) {
        subSteps.push({
          step: sStep,
          a: aSub,
          b: bSub,
          op: `a = a - b (${aSub} - ${bSub} = ${aSub - bSub})`
        });
        aSub -= bSub;
      } else {
        subSteps.push({
          step: sStep,
          a: aSub,
          b: bSub,
          op: `b = b - a (${bSub} - ${aSub} = ${bSub - aSub})`
        });
        bSub -= aSub;
      }
      sStep++;
    }
    subSteps.push({
      step: sStep,
      a: aSub,
      b: bSub,
      op: lang === 'ro' ? `a == b == ${aSub} \u2192 Stop!` : `a == b == ${aSub} \u2192 Stop!`
    });

    // Modulo method
    let aMod = a0;
    let bMod = b0;
    const modSteps: StepLog[] = [];
    let mStep = 1;

    while (bMod !== 0) {
      const r = aMod % bMod;
      modSteps.push({
        step: mStep,
        a: aMod,
        b: bMod,
        op: lang === 'ro'
          ? `r = ${aMod} % ${bMod} = ${r}; a devine ${bMod}; b devine ${r}`
          : `r = ${aMod} % ${bMod} = ${r}; a becomes ${bMod}; b becomes ${r}`
      });
      aMod = bMod;
      bMod = r;
      mStep++;
    }
    modSteps.push({
      step: mStep,
      a: aMod,
      b: 0,
      op: lang === 'ro'
        ? `b == 0 \u2192 cmmdc este a = ${aMod}`
        : `b == 0 \u2192 gcd is a = ${aMod}`
    });

    const cmmdc = aMod;
    const cmmmc = (a0 * b0) / cmmdc;

    setSubtractionLogs(subSteps);
    setModuloLogs(modSteps);
    setCmmdcResult(cmmdc);
    setCmmmcResult(cmmmc);
    setHasRun(true);
    sounds.playCorrect();
  };

  const isLevelCompleted =
    hasRun &&
    cmmdcResult !== null &&
    q1Answer === 'b' &&
    q2Answer === 'a';

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
      <div className="bg-gradient-to-r from-blue-950 via-teal-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl border border-teal-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-teal-500/20 rounded-xl border border-teal-400/30 text-teal-300">
              <Scale className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/30 text-teal-200 border border-teal-400/30">
                  {lang === 'ro' ? 'Modulul 3C • Nivelul 6 din 7' : 'Module 3C • Level 6 of 7'}
                </span>
                <span className="text-xs text-teal-300">
                  {lang === 'ro' ? 'Manual Art Klett pag. 75–76' : 'Art Klett Textbook pp. 75–76'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                {lang === 'ro'
                  ? 'Algoritmul lui Euclid: CMMDC prin Scăderi vs Împărțiri & CMMMC'
                  : 'Euclidean Algorithm: GCD via Subtractions vs Division & LCM'}
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-teal-300 uppercase tracking-wider block">
              {lang === 'ro' ? 'Progres Misiune' : 'Mission Progress'}
            </span>
            <span className="text-lg font-bold text-cyan-300">
              {lang === 'ro' ? 'Nivelul 6: Algoritmul lui Euclid' : 'Level 6: Euclidean Algorithm'}
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm text-teal-100/90 leading-relaxed max-w-3xl">
          {lang === 'ro'
            ? 'Formulat încă din Grecia antică, Algoritmul lui Euclid rămâne metoda de bază pentru simplificarea fracțiilor și calculul celui mai mare divizor comun (CMMDC). Metoda prin împărțiri modulo (%) este mult mai rapidă decât cea prin scăderi repetate!'
            : 'Originating in classical antiquity, the Euclidean Algorithm remains the canonical method for reducing fractions and computing Greatest Common Divisors (GCD). Division with remainder (%) converges exponentially faster than repeated subtraction!'}
        </p>
      </div>

      {/* Simulator: Interactive Euclid Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input values */}
        <div className="lg:col-span-4 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Code2 className="w-4 h-4 text-cyan-400" />
            {lang === 'ro' ? 'Numere de Intrare' : 'Input Operands'}
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">
                {lang === 'ro' ? 'Numărul a:' : 'Number a:'}
              </label>
              <input
                type="number"
                min="1"
                value={valA}
                onChange={(e) => {
                  setValA(Number(e.target.value));
                  setHasRun(false);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 font-mono text-cyan-300 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">
                {lang === 'ro' ? 'Numărul b:' : 'Number b:'}
              </label>
              <input
                type="number"
                min="1"
                value={valB}
                onChange={(e) => {
                  setValB(Number(e.target.value));
                  setHasRun(false);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 font-mono text-cyan-300 text-sm"
              />
            </div>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
              {lang === 'ro' ? 'Perechi clasice:' : 'Classic benchmark pairs:'}
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  setValA(48);
                  setValB(18);
                  setHasRun(false);
                }}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700 font-mono"
              >
                48 & 18
              </button>
              <button
                onClick={() => {
                  setValA(100);
                  setValB(25);
                  setHasRun(false);
                }}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700 font-mono"
              >
                100 & 25
              </button>
              <button
                onClick={() => {
                  setValA(105);
                  setValB(45);
                  setHasRun(false);
                }}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700 font-mono"
              >
                105 & 45
              </button>
              <button
                onClick={() => {
                  setValA(1000);
                  setValB(7);
                  setHasRun(false);
                }}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700 font-mono"
              >
                1000 & 7 ({lang === 'ro' ? 'Prime' : 'Coprime'})
              </button>
            </div>
          </div>

          <button
            onClick={runEuclid}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white rounded-lg font-medium text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            {lang === 'ro' ? 'Execută Algoritmul lui Euclid' : 'Execute Euclidean Algorithm'}
          </button>

          {hasRun && cmmdcResult !== null && (
            <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg text-xs space-y-1">
              <div className="font-bold text-teal-300">
                {lang === 'ro' ? 'Rezultate Matematice:' : 'Mathematical Results:'}
              </div>
              <div className="font-mono text-slate-200">
                &bull; {lang === 'ro' ? 'CMMDC' : 'GCD'}({valA}, {valB}) = <strong className="text-emerald-400">{cmmdcResult}</strong>
              </div>
              <div className="font-mono text-slate-200">
                &bull; {lang === 'ro' ? 'CMMMC' : 'LCM'}({valA}, {valB}) = <strong className="text-cyan-400">{cmmmcResult}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Right: Side-by-side Trace */}
        <div className="lg:col-span-8 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              {lang === 'ro'
                ? 'Comparație: Scăderi Repetate vs Împărțiri Modulo'
                : 'Comparison: Repeated Subtraction vs Modulo Division'}
            </span>
            {hasRun && (
              <span className="text-xs text-slate-400 font-mono">
                {subtractionLogs.length} {lang === 'ro' ? 'pași' : 'steps'} vs {moduloLogs.length} {lang === 'ro' ? 'pași' : 'steps'}
              </span>
            )}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Subtraction method */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
              <span className="text-slate-400 font-sans font-bold text-xs block">
                {lang === 'ro' ? '1. Metoda prin Scăderi (Clasică):' : '1. Subtraction Method (Classic):'}
              </span>
              <div className="max-h-[160px] overflow-y-auto space-y-1 text-[11px]">
                {subtractionLogs.length === 0 ? (
                  <span className="text-slate-600 italic font-sans">
                    {lang === 'ro' ? 'Apasă „Execută Algoritmul lui Euclid”...' : 'Press "Execute Euclidean Algorithm"...'}
                  </span>
                ) : (
                  subtractionLogs.map((log) => (
                    <div key={log.step} className="p-1 rounded bg-slate-900/60 text-slate-300">
                      <span className="text-slate-500">#{log.step}:</span> {log.op}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Modulo method */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
              <span className="text-emerald-400 font-sans font-bold text-xs block">
                {lang === 'ro' ? '2. Metoda prin Împărțiri / Modulo (Optimizată):' : '2. Modulo Division Method (Optimized):'}
              </span>
              <div className="max-h-[160px] overflow-y-auto space-y-1 text-[11px]">
                {moduloLogs.length === 0 ? (
                  <span className="text-slate-600 italic font-sans">
                    {lang === 'ro' ? 'Apasă „Execută Algoritmul lui Euclid”...' : 'Press "Execute Euclidean Algorithm"...'}
                  </span>
                ) : (
                  moduloLogs.map((log) => (
                    <div key={log.step} className="p-1 rounded bg-slate-900/60 text-emerald-300">
                      <span className="text-emerald-500">#{log.step}:</span> {log.op}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Quiz */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          {lang === 'ro' ? 'Verificare Regulamentară C++ (Manual pag. 75–76)' : 'C++ Conceptual Check (Textbook pp. 75–76)'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">
              {lang === 'ro' ? 'Întrebarea 1:' : 'Question 1:'}
            </span>
            <p className="text-xs text-slate-300">
              {lang === 'ro' ? (
                <>Care este relația matematică fundamentală între două numere <code className="text-amber-300 font-mono">a</code> și <code className="text-amber-300 font-mono">b</code>, CMMDC și CMMMC?</>
              ) : (
                <>What is the fundamental invariant relating two integers <code className="text-amber-300 font-mono">a</code> and <code className="text-amber-300 font-mono">b</code> to their GCD and LCM?</>
              )}
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', label: 'a + b = cmmdc + cmmmc' },
                {
                  id: 'b',
                  labelRo: 'a * b = cmmdc * cmmmc (produsul numerelor este egal cu produsul dintre cmmdc și cmmmc)',
                  labelEn: 'a * b = gcd * lcm (product of numbers equals product of GCD and LCM)'
                },
                { id: 'c', label: 'cmmmc = cmmdc * 2' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setQ1Answer(opt.id);
                    if (opt.id === 'b') sounds.playCorrect();
                    else sounds.playWrong();
                  }}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                    q1Answer === opt.id
                      ? opt.id === 'b'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span>{opt.label || (lang === 'ro' ? opt.labelRo : opt.labelEn)}</span>
                  {q1Answer === opt.id && opt.id === 'b' && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">
              {lang === 'ro' ? 'Întrebarea 2:' : 'Question 2:'}
            </span>
            <p className="text-xs text-slate-300">
              {lang === 'ro' ? (
                <>De ce varianta cu modulo (<code className="text-emerald-400 font-mono">r = a % b</code>) este mult mai eficientă decât varianta prin scăderi repetate?</>
              ) : (
                <>Why is the modulo variant (<code className="text-emerald-400 font-mono">r = a % b</code>) far more efficient than repeated subtraction?</>
              )}
            </p>
            <div className="space-y-1.5">
              {[
                {
                  id: 'a',
                  labelRo: 'Dacă a este mult mai mare decât b (de ex. 1000 și 3), împărțirea modulo reduce numărul într-un singur pas, evitând sute de scăderi',
                  labelEn: 'If a is much greater than b (e.g. 1000 and 3), modulo reduces the number in a single operation, bypassing hundreds of subtractions'
                },
                {
                  id: 'b',
                  labelRo: 'Pentru că operatorul % este gratuit',
                  labelEn: 'Because the % operator has zero complexity'
                },
                {
                  id: 'c',
                  labelRo: 'Ambele variante execută mereu exact același număr de pași',
                  labelEn: 'Both variants always execute the identical number of steps'
                }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setQ2Answer(opt.id);
                    if (opt.id === 'a') sounds.playCorrect();
                    else sounds.playWrong();
                  }}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                    q2Answer === opt.id
                      ? opt.id === 'a'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                  {q2Answer === opt.id && opt.id === 'a' && <Check className="w-4 h-4 text-emerald-400" />}
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
              ? (lang === 'ro'
                ? 'Excelent! Ai explorat ambele metode ale algoritmului lui Euclid și calculul CMMMC.'
                : 'Excellent! You explored both Euclidean methods and LCM computation.')
              : (lang === 'ro'
                ? 'Rulează algoritmul lui Euclid și răspunde corect la ambele întrebări.'
                : 'Run Euclidean algorithm and answer both questions correctly.')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onPrev && (
            <button
              onClick={onPrev}
              className="py-2 px-4 rounded-lg font-medium text-xs bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition"
            >
              {lang === 'ro' ? 'Înapoi' : 'Back'}
            </button>
          )}
          <button
            onClick={handleFinish}
            disabled={!isLevelCompleted}
            className={`py-2 px-5 rounded-lg font-medium text-xs flex items-center gap-2 transition-all ${
              isLevelCompleted
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <span>{lang === 'ro' ? 'Următorul Nivel: Examenul Sumativ Modulul 3C' : 'Next Level: Module 3C Summative Exam'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
