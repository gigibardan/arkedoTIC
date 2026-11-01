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

interface A3Level3Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A3Level3_ForLoopCounterLab: React.FC<A3Level3Props> = ({
  onCompletePage,
  onComplete
}) => {
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
                  Modulul 3C • Nivelul 3 din 7
                </span>
                <span className="text-xs text-emerald-300">Manual Art Klett pag. 73–74</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                Structura Repetitivă cu Număr Cunoscut de Pași: for & Suma lui Gauss
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-emerald-300 uppercase tracking-wider block">Progres Misiune</span>
            <span className="text-lg font-bold text-cyan-300">Nivelul 3: Bucla for</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-emerald-100/90 leading-relaxed max-w-3xl">
          Instrucțiunea <code className="bg-emerald-950 px-1 rounded text-cyan-300 font-mono">for (inițializare; condiție; pas)</code> concentrează într-o singură linie inițializarea contorului, testul de oprire și incrementarea. Este cea mai utilizată structură repetitivă pentru șiruri, sume parțiale și parcurgerea vectorilor!
        </p>
      </div>

      {/* Simulator: Interactive for loop & Gauss verification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration */}
        <div className="lg:col-span-5 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Calculator className="w-4 h-4 text-cyan-400" />
            Parametri de Execuție Buclă for
          </h3>

          <div className="space-y-2">
            <label className="text-xs text-slate-300 flex justify-between">
              <span>Limita superioară <code className="text-amber-300">n</code>:</span>
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
            <span className="text-xs font-semibold text-slate-300">Tipul de parcurgere:</span>
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
                i += 2 (Numere Pare)
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
                i-- (Descrescător)
              </button>
            </div>
          </div>

          <button
            onClick={runForSimulation}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-medium text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            Rulează Bucla for în CPU
          </button>

          {/* Gauss comparison */}
          {stepMode === 'all' && (
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 text-[11px] block font-semibold">Verificare Matematică: Formula lui Gauss</span>
              <div className="text-cyan-300 font-mono">
                S = n &times; (n + 1) / 2 = {targetN} &times; {targetN + 1} / 2 ={' '}
                <strong className="text-emerald-400 text-sm">{gaussFormula}</strong>
              </div>
              <p className="text-[10px] text-slate-400">
                Bucla iterativă for oferă exact același rezultat ca formula analitică!
              </p>
            </div>
          )}
        </div>

        {/* Right: Code & Execution trace */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Sintaxă C++ & Urmărire Pas-cu-Pas
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
            <div>cout &lt;&lt; <span className="text-amber-200">"Suma: "</span> &lt;&lt; sum;</div>
          </div>

          {/* Log Window */}
          <div className="bg-black/90 p-3 rounded-lg border border-slate-800 font-mono text-xs space-y-1 min-h-[120px] max-h-[180px] overflow-y-auto">
            <div className="text-slate-500 text-[11px]">// Jurnal pas-cu-pas al buclei for:</div>
            {simulationLogs.length === 0 ? (
              <span className="text-slate-600 italic">Apasă butonul „Rulează Bucla for” pentru a începe...</span>
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
          Verificare Regulamentară C++ (Manual pag. 73–74)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">Întrebarea 1:</span>
            <p className="text-xs text-slate-300">
              Care este ordinea corectă de execuție a celor 3 clauze ale instrucțiunii <code className="text-pink-400 font-mono">for (1; 2; 3) &#123; corp &#125;</code>?
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', label: '1 &rarr; 3 &rarr; corp &rarr; 2' },
                { id: 'b', label: '3 &rarr; 2 &rarr; 1 &rarr; corp' },
                { id: 'c', label: '1 (o singură dată) &rarr; 2 (condiție) &rarr; corp &rarr; 3 (pas) &rarr; 2 (condiție)...' }
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
                  <span>{opt.label}</span>
                  {q1Answer === opt.id && opt.id === 'c' && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">Întrebarea 2:</span>
            <p className="text-xs text-slate-300">
              De câte ori se va afișa mesajul în secvența: <code className="text-emerald-400 font-mono">for (int i = 1; i &lt; 5; i++) cout &lt;&lt; "*";</code>?
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', label: 'De 5 ori' },
                { id: 'b', label: 'De 4 ori (pentru i = 1, 2, 3, 4; la i = 5 condiția i < 5 devine falsă)' },
                { id: 'c', label: 'De 0 ori' }
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
              ? 'Excelent! Ai stăpânit structura buclei for și calculul sumelor parțiale.'
              : 'Rulează cel puțin o simulare for și răspunde corect la cele două întrebări.'}
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
          <span>Următorul Nivel: Bucle pe Cifrele unui Număr</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
