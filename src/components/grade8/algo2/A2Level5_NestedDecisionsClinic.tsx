import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Zap,
  HelpCircle,
  Activity,
  Check
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface A2Level5Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A2Level5_NestedDecisionsClinic: React.FC<A2Level5Props> = ({
  onCompletePage,
  onComplete
}) => {
  // Year state
  const [yearInput, setYearInput] = useState<number>(2024);
  const [testedYears, setTestedYears] = useState<Set<number>>(new Set());

  // Energy consumption state
  const [kwhConsumption, setKwhConsumption] = useState<number>(180);

  // Quiz
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  // Leap year calculation
  const isDiv4 = yearInput % 4 === 0;
  const isDiv100 = yearInput % 100 === 0;
  const isDiv400 = yearInput % 400 === 0;
  const isLeapYear = (isDiv4 && !isDiv100) || isDiv400;

  // Progressive tariff calculation
  let tariffRate = 0.68;
  let tariffTier = 'Tranșa 1: Consum social redus (<= 100 kWh)';
  if (kwhConsumption <= 100) {
    tariffRate = 0.68;
    tariffTier = 'Tranșa 1 (<= 100 kWh): 0.68 lei / kWh';
  } else if (kwhConsumption <= 255) {
    tariffRate = 0.80;
    tariffTier = 'Tranșa 2 (101 - 255 kWh): 0.80 lei / kWh';
  } else {
    tariffRate = 1.30;
    tariffTier = 'Tranșa 3 (> 255 kWh): 1.30 lei / kWh';
  }
  const totalCost = (kwhConsumption * tariffRate).toFixed(2);

  const testYear = (yr: number) => {
    setYearInput(yr);
    sounds.playClick();
    const updated = new Set(testedYears);
    updated.add(yr);
    setTestedYears(updated);
    sounds.playCorrect();
  };

  const isLevelCompleted =
    testedYears.size >= 2 &&
    q1Answer === 'a' &&
    q2Answer === 'b';

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
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl border border-blue-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-400/30 text-blue-300">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  Modulul 3B • Nivelul 5 din 7
                </span>
                <span className="text-xs text-blue-300">Manual Art Klett pag. 69</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                Decizii Imbricate & Scenarii Reale: Anul Bisect & Tariful Progresiv
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-blue-300 uppercase tracking-wider block">Progres Misiune</span>
            <span className="text-lg font-bold text-cyan-300">Nivelul 5: Structuri Imbricate</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-blue-100/90 leading-relaxed max-w-3xl">
          În viața reală, condițiile nu sunt întotdeauna simple: un an este bisect conform unui set nuanțat de reguli astronomice, iar prețul energiei electrice depinde de tranșe succesive (<code className="bg-blue-950 px-1 rounded text-cyan-300 font-mono">if - else if - else</code>).
        </p>
      </div>

      {/* Case 1: Leap Year Simulator */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            Scenariul 1: Algoritmul Canonic al Anului Bisect (Leap Year)
          </h3>
          <span className="text-xs text-slate-400 font-mono">(an%4==0 &amp;&amp; an%100!=0) || (an%400==0)</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-3">
            <div>
              <label className="text-xs text-slate-300 flex justify-between">
                <span>Introdu un an calendaristic:</span>
                <span className="font-mono text-cyan-300 font-bold">{yearInput}</span>
              </label>
              <input
                type="number"
                value={yearInput}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setYearInput(val);
                  const updated = new Set(testedYears);
                  updated.add(val);
                  setTestedYears(updated);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 font-mono text-cyan-300 text-sm mt-1"
              />
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">Exemple Celebre de Testat:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => testYear(2024)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700 text-left"
                >
                  <span className="font-mono font-bold text-cyan-300">2024</span>: Div 4 (Bisect)
                </button>
                <button
                  onClick={() => testYear(2000)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700 text-left"
                >
                  <span className="font-mono font-bold text-cyan-300">2000</span>: Div 400 (Bisect)
                </button>
                <button
                  onClick={() => testYear(1900)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700 text-left"
                >
                  <span className="font-mono font-bold text-cyan-300">1900</span>: Div 100 (NE-bisect!)
                </button>
                <button
                  onClick={() => testYear(2025)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700 text-left"
                >
                  <span className="font-mono font-bold text-cyan-300">2025</span>: An Obișnuit
                </button>
              </div>
            </div>

            <div
              className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                testedYears.size >= 2
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>
                {testedYears.size >= 2
                  ? `Ai testat ${testedYears.size} ani diferiți!`
                  : 'Testează cel puțin 2 ani diferiți din butoanele de mai sus.'}
              </span>
            </div>
          </div>

          {/* Right: Code Evaluation Breakdown */}
          <div className="lg:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 font-mono text-xs">
            <div className="text-slate-400 font-sans font-semibold">Evaluare Expresie Logică:</div>

            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
              <div className="text-slate-300">
                1. <code className="text-cyan-300 font-bold">an % 4 == 0</code> &rarr; {yearInput} % 4 ={' '}
                {yearInput % 4} ({isDiv4 ? <span className="text-emerald-400 font-bold">TRUE</span> : <span className="text-rose-400 font-bold">FALSE</span>})
              </div>
              <div className="text-slate-300">
                2. <code className="text-cyan-300 font-bold">an % 100 != 0</code> &rarr; {yearInput} % 100 ={' '}
                {yearInput % 100} ({!isDiv100 ? <span className="text-emerald-400 font-bold">TRUE (nu e secol)</span> : <span className="text-amber-400 font-bold">FALSE (e secol)</span>})
              </div>
              <div className="text-slate-300">
                3. <code className="text-cyan-300 font-bold">an % 400 == 0</code> &rarr; {yearInput} % 400 ={' '}
                {yearInput % 400} ({isDiv400 ? <span className="text-emerald-400 font-bold">TRUE (secol bisect)</span> : <span className="text-slate-400 font-bold">FALSE</span>})
              </div>
            </div>

            <div
              className={`p-3 rounded-lg border font-sans text-sm font-bold flex items-center justify-between ${
                isLeapYear
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}
            >
              <span>Anul {yearInput} este:</span>
              <span className="uppercase font-mono">
                {isLeapYear ? 'AN BISECT (366 zile & 29 feb)' : 'AN OBIȘNUIT (365 zile)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Case 2: Energy Tariff with if - else if - else */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Scenariul 2: Calcul Factură Energie Electrică pe Tranșe (if - else if - else)
          </h3>
          <span className="text-xs text-amber-300 font-mono">Tarif Progresiv</span>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-slate-300 flex justify-between">
            <span>Ajustează Consumul Lunar de Energie:</span>
            <span className="font-mono text-amber-400 font-bold text-sm">{kwhConsumption} kWh</span>
          </label>
          <input
            type="range"
            min="20"
            max="400"
            step="5"
            value={kwhConsumption}
            onChange={(e) => setKwhConsumption(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>20 kWh</span>
            <span>100 kWh (Plafon T1)</span>
            <span>255 kWh (Plafon T2)</span>
            <span>400 kWh</span>
          </div>
        </div>

        {/* Code representation */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-1">
          <div className={`p-1.5 rounded ${kwhConsumption <= 100 ? 'bg-amber-950/70 text-amber-300 font-bold border-l-2 border-amber-400' : 'text-slate-500'}`}>
            <span className="text-pink-400">if</span> (consum &lt;= 100) tarif = 0.68;
          </div>
          <div className={`p-1.5 rounded ${kwhConsumption > 100 && kwhConsumption <= 255 ? 'bg-amber-950/70 text-amber-300 font-bold border-l-2 border-amber-400' : 'text-slate-500'}`}>
            <span className="text-pink-400">else if</span> (consum &lt;= 255) tarif = 0.80;
          </div>
          <div className={`p-1.5 rounded ${kwhConsumption > 255 ? 'bg-amber-950/70 text-amber-300 font-bold border-l-2 border-amber-400' : 'text-slate-500'}`}>
            <span className="text-pink-400">else</span> tarif = 1.30;
          </div>
        </div>

        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-between text-xs">
          <span className="text-amber-200">
            <strong>Tranșă activată:</strong> {tariffTier}
          </span>
          <span className="font-mono font-bold text-sm text-amber-400">
            Total de Plată: {totalCost} LEI
          </span>
        </div>
      </div>

      {/* Mini Quiz */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          Test de Înțelegere a Structurilor Imbricate (Manual pag. 69)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">Întrebarea 1:</span>
            <p className="text-xs text-slate-300">
              De ce anul 1900 NU a fost an bisect, deși se împarte exact la 4 (<code className="text-amber-300 font-mono">1900 % 4 == 0</code>)?
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', label: 'Pentru că anii de sfârșit de secol (divizibili cu 100) sunt bisecți doar dacă sunt divizibili și cu 400' },
                { id: 'b', label: 'A fost o eroare de tipar în calendar' },
                { id: 'c', label: '1900 a fost bisect' }
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
              Într-o structură <code className="text-pink-400 font-mono">if - else if - else</code>, când se evaluează condiția din <code className="text-pink-400 font-mono">else if</code>?
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', label: 'Întotdeauna, indiferent de prima condiție' },
                { id: 'b', label: 'Numai dacă prima condiție (din if) a fost evaluată ca FALSĂ' },
                { id: 'c', label: 'În paralel cu if, pentru viteză mai mare' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setQ2Answer(opt.id);
                    if (opt.id === 'b') sounds.playCorrect();
                    else sounds.playWrong();
                  }}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                    q2Answer === opt.id
                      ? opt.id === 'b'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span>{opt.label}</span>
                  {q2Answer === opt.id && opt.id === 'b' && <Check className="w-4 h-4 text-emerald-400" />}
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
              ? 'Excelent! Ai explorat anul bisect și structurile decizionale complexe.'
              : 'Testează cel puțin 2 ani diferiți în simulator și răspunde corect la întrebări.'}
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
          <span>Următorul Nivel: Laborator de Depanare Logică</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
