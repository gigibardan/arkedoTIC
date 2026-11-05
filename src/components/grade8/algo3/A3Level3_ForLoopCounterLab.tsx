import React, { useState } from 'react';
import {
  ListOrdered,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  HelpCircle,
  Calculator,
  Check
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface A3Level3Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A3Level3_ForLoopCounterLab: React.FC<A3Level3Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();

  // For loop parameter
  const [targetN, setTargetN] = useState<number>(6);
  const [stepMode, setStepMode] = useState<'all' | 'even' | 'descending'>('all');
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [computedSum, setComputedSum] = useState<number | null>(null);
  const [hasRunLoop, setHasRunLoop] = useState<boolean>(false);

  // Quiz
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const runForSimulation = () => {
    sounds.playClick();
    const logs: string[] = [];
    let sum = 0;

    if (lang === 'ro') {
      if (stepMode === 'all') {
        logs.push(`// Calcul Suma Gauss: 1 + 2 + ... + ${targetN}`);
        for (let i = 1; i <= targetN; i++) {
          sum += i;
          logs.push(`Pasul i = ${i}: sum devine ${sum}`);
        }
      } else if (stepMode === 'even') {
        logs.push(`// Numere pare: i += 2 până la ${targetN}`);
        for (let i = 2; i <= targetN; i += 2) {
          sum += i;
          logs.push(`Pasul i = ${i} (par): sum devine ${sum}`);
        }
      } else {
        logs.push(`// Numărătoare descrescătoare de la ${targetN} la 1:`);
        for (let i = targetN; i >= 1; i--) {
          sum += i;
          logs.push(`Pasul i = ${i}: sum devine ${sum}`);
        }
      }
    } else {
      if (stepMode === 'all') {
        logs.push(`// Computing Gauss Sum: 1 + 2 + ... + ${targetN}`);
        for (let i = 1; i <= targetN; i++) {
          sum += i;
          logs.push(`Step i = ${i}: sum accumulates to ${sum}`);
        }
      } else if (stepMode === 'even') {
        logs.push(`// Even numbers: i += 2 up to ${targetN}`);
        for (let i = 2; i <= targetN; i += 2) {
          sum += i;
          logs.push(`Step i = ${i} (even): sum accumulates to ${sum}`);
        }
      } else {
        logs.push(`// Descending sequence from ${targetN} down to 1:`);
        for (let i = targetN; i >= 1; i--) {
          sum += i;
          logs.push(`Step i = ${i}: sum accumulates to ${sum}`);
        }
      }
    }

    setComputedSum(sum);
    setSimulationLogs(logs);
    setHasRunLoop(true);
    sounds.playCorrect();
  };

  const gaussFormula = (targetN * (targetN + 1)) / 2;

  const isLevelCompleted =
    hasRunLoop &&
    computedSum !== null &&
    q1Answer === 'c' &&
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
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl border border-emerald-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-400/30 text-emerald-300">
              <ListOrdered className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  {lang === 'ro' ? 'Modulul 3C • Nivelul 3 din 7' : 'Module 3C • Level 3 of 7'}
                </span>
                <span className="text-xs text-emerald-300">
                  {lang === 'ro' ? 'Manual Art Klett pag. 73–74' : 'Art Klett Textbook pp. 73–74'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                {lang === 'ro'
                  ? 'Structura Repetitivă cu Număr Cunoscut de Pași: for & Suma lui Gauss'
                  : 'Counted Loop Structure: for & The Gauss Sum Formula'}
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-emerald-300 uppercase tracking-wider block">
              {lang === 'ro' ? 'Progres Misiune' : 'Mission Progress'}
            </span>
            <span className="text-lg font-bold text-cyan-300">
              {lang === 'ro' ? 'Nivelul 3: Bucla for' : 'Level 3: The for Loop'}
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm text-emerald-100/90 leading-relaxed max-w-3xl">
          {lang === 'ro'
            ? 'Instrucțiunea for (inițializare; condiție; pas) concentrează într-o singură linie inițializarea contorului, testul de oprire și incrementarea. Este cea mai utilizată structură repetitivă pentru șiruri, sume parțiale și parcurgerea vectorilor!'
            : 'The for (init; test; step) statement bundles counter initialization, termination boundary, and increment into a concise header. It is the premier looping pattern for sequences, arithmetic partial sums, and linear array traversal!'}
        </p>
      </div>

      {/* Simulator: Interactive for loop & Gauss verification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration */}
        <div className="lg:col-span-5 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Calculator className="w-4 h-4 text-cyan-400" />
            {lang === 'ro' ? 'Parametri de Execuție Buclă for' : 'for Loop Execution Parameters'}
          </h3>

          <div className="space-y-2">
            <label className="text-xs text-slate-300 flex justify-between">
              <span>{lang === 'ro' ? 'Limita superioară n:' : 'Upper bound n:'}</span>
              <span className="font-mono text-cyan-300 font-bold text-sm">n = {targetN}</span>
            </label>
            <input
              type="range"
              min="1"
              max="15"
              value={targetN}
              onChange={(e) => {
                setTargetN(Number(e.target.value));
                setHasRunLoop(false);
              }}
              className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>1</span>
              <span>8</span>
              <span>15</span>
            </div>
          </div>

          {/* Mode selector */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-300">
              {lang === 'ro' ? 'Tipul de parcurgere:' : 'Traversal pattern:'}
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                onClick={() => {
                  setStepMode('all');
                  setHasRunLoop(false);
                }}
                className={`p-2 rounded-lg border font-mono text-[11px] transition-colors ${
                  stepMode === 'all'
                    ? 'bg-emerald-600 border-emerald-400 text-white font-bold'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                i++ (1, 2, ... n)
              </button>
              <button
                onClick={() => {
                  setStepMode('even');
                  setHasRunLoop(false);
                }}
                className={`p-2 rounded-lg border font-mono text-[11px] transition-colors ${
                  stepMode === 'even'
                    ? 'bg-emerald-600 border-emerald-400 text-white font-bold'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                {lang === 'ro' ? 'i += 2 (Pare)' : 'i += 2 (Even)'}
              </button>
              <button
                onClick={() => {
                  setStepMode('descending');
                  setHasRunLoop(false);
                }}
                className={`p-2 rounded-lg border font-mono text-[11px] transition-colors ${
                  stepMode === 'descending'
                    ? 'bg-emerald-600 border-emerald-400 text-white font-bold'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                {lang === 'ro' ? 'i-- (Descrescător)' : 'i-- (Descending)'}
              </button>
            </div>
          </div>

          <button
            onClick={runForSimulation}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-medium text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            {lang === 'ro' ? 'Rulează Bucla for în CPU' : 'Execute for Loop in CPU'}
          </button>

          {/* Gauss comparison */}
          {stepMode === 'all' && (
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 text-[11px] block font-semibold">
                {lang === 'ro' ? 'Verificare Matematică: Formula lui Gauss' : 'Mathematical Invariant: Gauss Formula'}
              </span>
              <div className="text-cyan-300 font-mono">
                S = n &times; (n + 1) / 2 = {targetN} &times; {targetN + 1} / 2 ={' '}
                <strong className="text-emerald-400 text-sm">{gaussFormula}</strong>
              </div>
              <p className="text-[10px] text-slate-400">
                {lang === 'ro'
                  ? 'Bucla iterativă for oferă exact același rezultat ca formula analitică!'
                  : 'The iterative for loop produces identical output to the closed-form algebraic formula!'}
              </p>
            </div>
          )}
        </div>

        {/* Right: Code & Execution trace */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              {lang === 'ro' ? 'Sintaxă C++ & Urmărire Pas-cu-Pas' : 'C++ Syntax & Step-by-Step Trace'}
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {stepMode === 'all'
                ? 'for (int i = 1; i <= n; i++)'
                : stepMode === 'even'
                ? 'for (int i = 2; i <= n; i += 2)'
                : 'for (int i = n; i >= 1; i--)'}
            </span>
          </div>

          {/* Code Window */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
            <div><span className="text-indigo-400">int</span> n = <span className="text-amber-300">{targetN}</span>;</div>
            <div><span className="text-indigo-400">int</span> sum = <span className="text-amber-300">0</span>;</div>
            <div>
              <span className="text-pink-400 font-semibold">for</span> (
              {stepMode === 'all' && (
                <span>
                  <span className="text-cyan-300">int i = 1</span>; <span className="text-purple-300">i &lt;= n</span>; <span className="text-amber-300">i++</span>
                </span>
              )}
              {stepMode === 'even' && (
                <span>
                  <span className="text-cyan-300">int i = 2</span>; <span className="text-purple-300">i &lt;= n</span>; <span className="text-amber-300">i += 2</span>
                </span>
              )}
              {stepMode === 'descending' && (
                <span>
                  <span className="text-cyan-300">int i = n</span>; <span className="text-purple-300">i &gt;= 1</span>; <span className="text-amber-300">i--</span>
                </span>
              )}
              ) &#123;
            </div>
            <div className="pl-4 text-emerald-300">
              sum = sum + i;
            </div>
            <div>&#125;</div>
            <div>
              cout &lt;&lt; <span className="text-amber-200">"{lang === 'ro' ? 'Suma: ' : 'Sum: '}"</span> &lt;&lt; sum;
            </div>
          </div>

          {/* Log Window */}
          <div className="bg-black/90 p-3 rounded-lg border border-slate-800 font-mono text-xs space-y-1 min-h-[120px] max-h-[180px] overflow-y-auto">
            <div className="text-slate-500 text-[11px]">
              {lang === 'ro' ? '// Jurnal pas-cu-pas al buclei for:' : '// Step-by-step for loop trace:'}
            </div>
            {simulationLogs.length === 0 ? (
              <span className="text-slate-600 italic">
                {lang === 'ro'
                  ? 'Apasă butonul „Rulează Bucla for” pentru a începe...'
                  : 'Press "Execute for Loop" to begin tracing...'}
              </span>
            ) : (
              simulationLogs.map((line, idx) => (
                <div key={idx} className={line.startsWith('//') ? 'text-slate-400' : 'text-emerald-400'}>
                  {line}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Mini Quiz */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          {lang === 'ro' ? 'Verificare Regulamentară C++ (Manual pag. 73–74)' : 'C++ Conceptual Check (Textbook pp. 73–74)'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">
              {lang === 'ro' ? 'Întrebarea 1:' : 'Question 1:'}
            </span>
            <p className="text-xs text-slate-300">
              {lang === 'ro' ? (
                <>Care este ordinea corectă de execuție a celor 3 clauze ale instrucțiunii <code className="text-pink-400 font-mono">for (1; 2; 3) &#123; corp &#125;</code>?</>
              ) : (
                <>What is the precise execution sequence of the 3 header clauses in <code className="text-pink-400 font-mono">for (1; 2; 3) &#123; body &#125;</code>?</>
              )}
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', label: '1 \u2192 3 \u2192 body \u2192 2' },
                { id: 'b', label: '3 \u2192 2 \u2192 1 \u2192 body' },
                {
                  id: 'c',
                  labelRo: '1 (o singură dată) → 2 (condiție) → corp → 3 (pas) → 2 (condiție)...',
                  labelEn: '1 (once at start) → 2 (test) → body → 3 (step) → 2 (test)...'
                }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setQ1Answer(opt.id);
                    if (opt.id === 'c') sounds.playCorrect();
                    else sounds.playWrong();
                  }}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                    q1Answer === opt.id
                      ? opt.id === 'c'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span>{opt.label || (lang === 'ro' ? opt.labelRo : opt.labelEn)}</span>
                  {q1Answer === opt.id && opt.id === 'c' && <Check className="w-4 h-4 text-emerald-400" />}
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
                <>De câte ori se va afișa mesajul în secvența: <code className="text-emerald-400 font-mono">for (int i = 1; i &lt; 5; i++) cout &lt;&lt; "*";</code>?</>
              ) : (
                <>How many times does the asterisk print in: <code className="text-emerald-400 font-mono">for (int i = 1; i &lt; 5; i++) cout &lt;&lt; "*";</code>?</>
              )}
            </p>
            <div className="space-y-1.5">
              {[
                {
                  id: 'a',
                  labelRo: 'De 5 ori',
                  labelEn: '5 times'
                },
                {
                  id: 'b',
                  labelRo: 'De 4 ori (pentru i = 1, 2, 3, 4; la i = 5 condiția i < 5 devine falsă)',
                  labelEn: '4 times (for i = 1, 2, 3, 4; at i = 5 condition i < 5 becomes false)'
                },
                {
                  id: 'c',
                  labelRo: 'De 0 ori',
                  labelEn: '0 times'
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
                ? 'Excelent! Ai stăpânit structura buclei for și calculul sumelor parțiale.'
                : 'Excellent! You mastered counted for loops and partial sum calculations.')
              : (lang === 'ro'
                ? 'Rulează cel puțin o simulare for și răspunde corect la cele două întrebări.'
                : 'Run at least one for loop simulation and answer both questions correctly.')}
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
            <span>{lang === 'ro' ? 'Următorul Nivel: Bucle pe Cifrele unui Număr' : 'Next Level: Digit Algorithms with Loops'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
