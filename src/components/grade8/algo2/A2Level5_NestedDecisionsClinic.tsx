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
import { useLanguage } from '../../../context/LanguageContext';

interface A2Level5Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A2Level5_NestedDecisionsClinic: React.FC<A2Level5Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();

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
  let tariffTier = lang === 'ro'
    ? 'Tranșa 1 (<= 100 kWh): 0.68 lei / kWh'
    : 'Tier 1 (<= 100 kWh): 0.68 lei / kWh';

  if (kwhConsumption <= 100) {
    tariffRate = 0.68;
    tariffTier = lang === 'ro'
      ? 'Tranșa 1 (<= 100 kWh): 0.68 lei / kWh'
      : 'Tier 1 (<= 100 kWh): 0.68 lei / kWh';
  } else if (kwhConsumption <= 255) {
    tariffRate = 0.80;
    tariffTier = lang === 'ro'
      ? 'Tranșa 2 (101 - 255 kWh): 0.80 lei / kWh'
      : 'Tier 2 (101 - 255 kWh): 0.80 lei / kWh';
  } else {
    tariffRate = 1.30;
    tariffTier = lang === 'ro'
      ? 'Tranșa 3 (> 255 kWh): 1.30 lei / kWh'
      : 'Tier 3 (> 255 kWh): 1.30 lei / kWh';
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
                  {lang === 'ro' ? 'Modulul 3B • Nivelul 5 din 7' : 'Module 3B • Level 5 of 7'}
                </span>
                <span className="text-xs text-blue-300">
                  {lang === 'ro' ? 'Manual Art Klett pag. 69' : 'Art Klett Textbook p. 69'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                {lang === 'ro'
                  ? 'Decizii Imbricate & Scenarii Reale: Anul Bisect & Tariful Progresiv'
                  : 'Nested Decisions & Real-World Scenarios: Leap Years & Progressive Tariffs'}
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-blue-300 uppercase tracking-wider block">
              {lang === 'ro' ? 'Progres Misiune' : 'Mission Progress'}
            </span>
            <span className="text-lg font-bold text-cyan-300">
              {lang === 'ro' ? 'Nivelul 5: Structuri Imbricate' : 'Level 5: Nested Structures'}
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm text-blue-100/90 leading-relaxed max-w-3xl">
          {lang === 'ro'
            ? 'În viața reală, condițiile nu sunt întotdeauna simple: un an este bisect conform unui set nuanțat de reguli astronomice, iar prețul energiei electrice depinde de tranșe succesive (if - else if - else).'
            : 'In real-world computing, rules are multi-layered: leap years follow subtle astronomical leap rules, and household energy billing depends on progressive tiers (if - else if - else).'}
        </p>
      </div>

      {/* Case 1: Leap Year Simulator */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            {lang === 'ro'
              ? 'Scenariul 1: Algoritmul Canonic al Anului Bisect (Leap Year)'
              : 'Scenario 1: Canonical Leap Year Decision Algorithm'}
          </h3>
          <span className="text-xs text-slate-400 font-mono">(an%4==0 &amp;&amp; an%100!=0) || (an%400==0)</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-3">
            <div>
              <label className="text-xs text-slate-300 flex justify-between">
                <span>{lang === 'ro' ? 'Introdu un an calendaristic:' : 'Enter calendar year:'}</span>
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
              <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                {lang === 'ro' ? 'Exemple Celebre de Testat:' : 'Classic Historical Test Cases:'}
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => testYear(2024)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700 text-left"
                >
                  <span className="font-mono font-bold text-cyan-300">2024</span>: {lang === 'ro' ? 'Div 4 (Bisect)' : 'Div 4 (Leap)'}
                </button>
                <button
                  onClick={() => testYear(2000)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700 text-left"
                >
                  <span className="font-mono font-bold text-cyan-300">2000</span>: {lang === 'ro' ? 'Div 400 (Bisect)' : 'Div 400 (Leap)'}
                </button>
                <button
                  onClick={() => testYear(1900)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700 text-left"
                >
                  <span className="font-mono font-bold text-cyan-300">1900</span>: {lang === 'ro' ? 'Div 100 (NE-bisect!)' : 'Div 100 (Non-leap!)'}
                </button>
                <button
                  onClick={() => testYear(2025)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700 text-left"
                >
                  <span className="font-mono font-bold text-cyan-300">2025</span>: {lang === 'ro' ? 'An Obișnuit' : 'Regular Year'}
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
                  ? (lang === 'ro'
                    ? `Ai testat ${testedYears.size} ani diferiți!`
                    : `You tested ${testedYears.size} distinct years!`)
                  : (lang === 'ro'
                    ? 'Testează cel puțin 2 ani diferiți din butoanele de mai sus.'
                    : 'Test at least 2 distinct years from buttons above.')}
              </span>
            </div>
          </div>

          {/* Right: Code Evaluation Breakdown */}
          <div className="lg:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 font-mono text-xs">
            <div className="text-slate-400 font-sans font-semibold">
              {lang === 'ro' ? 'Evaluare Expresie Logică:' : 'Boolean Logic Trace:'}
            </div>

            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
              <div className="text-slate-300">
                1. <code className="text-cyan-300 font-bold">an % 4 == 0</code> &rarr; {yearInput} % 4 ={' '}
                {yearInput % 4} ({isDiv4 ? <span className="text-emerald-400 font-bold">TRUE</span> : <span className="text-rose-400 font-bold">FALSE</span>})
              </div>
              <div className="text-slate-300">
                2. <code className="text-cyan-300 font-bold">an % 100 != 0</code> &rarr; {yearInput} % 100 ={' '}
                {yearInput % 100} ({!isDiv100
                  ? <span className="text-emerald-400 font-bold">{lang === 'ro' ? 'TRUE (nu e secol)' : 'TRUE (not century)'}</span>
                  : <span className="text-amber-400 font-bold">{lang === 'ro' ? 'FALSE (e secol)' : 'FALSE (century year)'}</span>})
              </div>
              <div className="text-slate-300">
                3. <code className="text-cyan-300 font-bold">an % 400 == 0</code> &rarr; {yearInput} % 400 ={' '}
                {yearInput % 400} ({isDiv400
                  ? <span className="text-emerald-400 font-bold">{lang === 'ro' ? 'TRUE (secol bisect)' : 'TRUE (leap century)'}</span>
                  : <span className="text-slate-400 font-bold">FALSE</span>})
              </div>
            </div>

            <div
              className={`p-3 rounded-lg border font-sans text-sm font-bold flex items-center justify-between ${
                isLeapYear
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}
            >
              <span>{lang === 'ro' ? `Anul ${yearInput} este:` : `Year ${yearInput} is:`}</span>
              <span className="uppercase font-mono">
                {isLeapYear
                  ? (lang === 'ro' ? 'AN BISECT (366 zile & 29 feb)' : 'LEAP YEAR (366 days & Feb 29)')
                  : (lang === 'ro' ? 'AN OBIȘNUIT (365 zile)' : 'REGULAR YEAR (365 days)')}
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
            {lang === 'ro'
              ? 'Scenariul 2: Calcul Factură Energie Electrică pe Tranșe (if - else if - else)'
              : 'Scenario 2: Tiered Energy Consumption Calculator (if - else if - else)'}
          </h3>
          <span className="text-xs text-amber-300 font-mono">
            {lang === 'ro' ? 'Tarif Progresiv' : 'Tiered Pricing'}
          </span>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-slate-300 flex justify-between">
            <span>{lang === 'ro' ? 'Ajustează Consumul Lunar de Energie:' : 'Adjust Monthly Electricity Consumption:'}</span>
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
            <span>100 kWh ({lang === 'ro' ? 'Plafon T1' : 'Tier 1 Cap'})</span>
            <span>255 kWh ({lang === 'ro' ? 'Plafon T2' : 'Tier 2 Cap'})</span>
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
            <strong>{lang === 'ro' ? 'Tranșă activată:' : 'Active Tier:'}</strong> {tariffTier}
          </span>
          <span className="font-mono font-bold text-sm text-amber-400">
            {lang === 'ro' ? 'Total de Plată:' : 'Total Amount Due:'} {totalCost} LEI
          </span>
        </div>
      </div>

      {/* Mini Quiz */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          {lang === 'ro'
            ? 'Test de Înțelegere a Structurilor Imbricate (Manual pag. 69)'
            : 'Nested Structures Comprehension Check (Textbook p. 69)'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">
              {lang === 'ro' ? 'Întrebarea 1:' : 'Question 1:'}
            </span>
            <p className="text-xs text-slate-300">
              {lang === 'ro' ? (
                <>De ce anul 1900 NU a fost an bisect, deși se împarte exact la 4 (<code className="text-amber-300 font-mono">1900 % 4 == 0</code>)?</>
              ) : (
                <>Why was the year 1900 NOT a leap year, despite being divisible by 4 (<code className="text-amber-300 font-mono">1900 % 4 == 0</code>)?</>
              )}
            </p>
            <div className="space-y-1.5">
              {[
                {
                  id: 'a',
                  labelRo: 'Pentru că anii de sfârșit de secol (divizibili cu 100) sunt bisecți doar dacă sunt divizibili și cu 400',
                  labelEn: 'Because century years (divisible by 100) are leap years only if also divisible by 400'
                },
                {
                  id: 'b',
                  labelRo: 'A fost o eroare de tipar în calendar',
                  labelEn: 'It was a typographic print error in historical calendars'
                },
                {
                  id: 'c',
                  labelRo: '1900 a fost bisect',
                  labelEn: '1900 was actually a leap year'
                }
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
                  <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                  {q1Answer === opt.id && opt.id === 'a' && <Check className="w-4 h-4 text-emerald-400" />}
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
                <>Într-o structură <code className="text-pink-400 font-mono">if - else if - else</code>, când se evaluează condiția din <code className="text-pink-400 font-mono">else if</code>?</>
              ) : (
                <>In an <code className="text-pink-400 font-mono">if - else if - else</code> construct, when is the <code className="text-pink-400 font-mono">else if</code> condition tested?</>
              )}
            </p>
            <div className="space-y-1.5">
              {[
                {
                  id: 'a',
                  labelRo: 'Întotdeauna, indiferent de prima condiție',
                  labelEn: 'Always, regardless of previous conditions'
                },
                {
                  id: 'b',
                  labelRo: 'Numai dacă prima condiție (din if) a fost evaluată ca FALSĂ',
                  labelEn: 'Only if the prior if condition evaluated to FALSE'
                },
                {
                  id: 'c',
                  labelRo: 'În paralel cu if, pentru viteză mai mare',
                  labelEn: 'In parallel with if, for higher performance'
                }
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
                  <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
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
              ? (lang === 'ro'
                ? 'Excelent! Ai explorat anul bisect și structurile decizionale complexe.'
                : 'Excellent! You explored leap year calculations and nested decision structures.')
              : (lang === 'ro'
                ? 'Testează cel puțin 2 ani diferiți în simulator și răspunde corect la întrebări.'
                : 'Test at least 2 distinct years in the simulator and answer quiz questions correctly.')}
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
            <span>{lang === 'ro' ? 'Următorul Nivel: Laborator de Depanare Logică' : 'Next Level: Logic Debugging Lab'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
