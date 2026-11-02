import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  HelpCircle,
  Database,
  Sliders,
  Check,
  Eye
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface A5Level3Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A5Level3_ArrayFunctionsStudio: React.FC<A5Level3Props> = ({
  onCompletePage,
  onComplete
}) => {
  // Vector data in main()
  const [vectorData, setVectorData] = useState<number[]>([4, 7, 2, 9, 5]);
  const [activeTab, setActiveTab] = useState<'double' | 'stats' | 'filter'>('double');
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [hasRunFunction, setHasRunFunction] = useState<boolean>(false);
  const [calculatedStats, setCalculatedStats] = useState<{
    sum: number;
    avg: number;
    min: number;
    max: number;
  } | null>(null);

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const handleResetVector = () => {
    sounds.playClick();
    setVectorData([4, 7, 2, 9, 5]);
    setExecutionLogs(['Vectorul din main() a fost resetat la valorile inițiale: [4, 7, 2, 9, 5]']);
    setCalculatedStats(null);
    setHasRunFunction(false);
  };

  const handleRunDoubleElements = () => {
    sounds.playClick();
    const updated = vectorData.map((val) => val * 2);
    setVectorData(updated);
    setHasRunFunction(true);
    setExecutionLogs([
      '1. Apel funcție: dublareElemente(v, n);',
      '2. În antet: void dublareElemente(int a[], int n)',
      '3. Observă: Nu s-a folosit simbolul & în fața lui a[], dar tabloul a primit adresa de start a lui v!',
      `4. Modificare in-place: Fiecare element v[i] a fost dublat direct în memoria din main().`,
      `5. Rezultat în main(): [${updated.join(', ')}]`
    ]);
  };

  const handleRunCalculateStats = () => {
    sounds.playClick();
    let sum = 0;
    let min = vectorData[0];
    let max = vectorData[0];

    for (const val of vectorData) {
      sum += val;
      if (val < min) min = val;
      if (val > max) max = val;
    }
    const avg = Number((sum / vectorData.length).toFixed(2));
    setCalculatedStats({ sum, avg, min, max });
    setHasRunFunction(true);
    setExecutionLogs([
      '1. Apel funcție: calculStatistici(v, n, s, minim, maxim);',
      '2. În antet: void calculStatistici(int a[], int n, int &s, int &mn, int &mx)',
      '3. Transmitere: v[] este transmis prin adresă, n prin valoare, iar s, mn, mx prin referință (&) ca să întoarcă 3 rezultate!',
      `4. Rezultate returnate în main(): Sumă = ${sum}, Medie = ${avg}, Min = ${min}, Max = ${max}`
    ]);
  };

  const handleRunFilterEvens = () => {
    sounds.playClick();
    const evens = vectorData.map((x) => (x % 2 === 0 ? x : 0));
    setVectorData(evens);
    setHasRunFunction(true);
    setExecutionLogs([
      '1. Apel funcție: anuleazaImpare(v, n);',
      '2. În corp: if (a[i] % 2 != 0) a[i] = 0;',
      '3. Fiecare număr impar a fost transformat în 0 direct în memoria din main().',
      `4. Noua stare a vectorului din main(): [${evens.join(', ')}]`
    ]);
  };

  const isLevelCompleted =
    hasRunFunction && q1Answer === 'ref' && q2Answer === 'size_ref';

  const handleFinish = () => {
    if (!isLevelCompleted) return;
    sounds.playLevelComplete();
    if (onCompletePage) onCompletePage(150);
    if (onComplete) onComplete();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-800/40 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-semibold">
                Nivelul 3 • Unitatea 3 (Manual pag. 86–87)
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Vectorii ca Parametri în Subprograme
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-900/40 border border-emerald-700/50 rounded-lg text-emerald-300 text-sm font-mono">
            <span>Transmitere prin adresă</span>
          </div>
        </div>
        <p className="mt-3 text-slate-300 text-sm leading-relaxed">
          În C++, <strong>tablourile unidimensionale (vectorii)</strong> sunt transmise către funcții
          în mod implicit <strong>prin adresă</strong> (adresa primului element <code>&amp;v[0]</code>). Astfel,
          orice modificare asupra lui <code>v[i]</code> în interiorul funcției afectează <em>direct</em> vectorul din <code>main()</code>,
          fără a necesita operatorul <code>&amp;</code> în fața numelui vectorului!
        </p>
      </div>

      {/* Main Grid: Code & Visual Memory Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Code & Actions */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm font-semibold">
                <Code2 className="w-4 h-4" />
                <span>Antet &amp; Cod Subprogram</span>
              </div>
              {/* Tab Selector */}
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => {
                    setActiveTab('double');
                    sounds.playClick();
                  }}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeTab === 'double'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  dublare()
                </button>
                <button
                  onClick={() => {
                    setActiveTab('stats');
                    sounds.playClick();
                  }}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeTab === 'stats'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  statistici()
                </button>
                <button
                  onClick={() => {
                    setActiveTab('filter');
                    sounds.playClick();
                  }}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeTab === 'filter'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  filtrare()
                </button>
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="mt-4 p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs leading-relaxed text-slate-300">
              {activeTab === 'double' && (
                <>
                  <div className="text-emerald-400 font-bold">
                    // Vectorul a[] este transmis prin adresă!
                  </div>
                  <div className="text-purple-400 font-semibold">
                    void <span className="text-yellow-300">dublareElemente</span>(int a[], int n) &#123;
                  </div>
                  <div className="pl-4 text-slate-400">
                    for (int i = 0; i &lt; n; i++) &#123;
                  </div>
                  <div className="pl-8 text-emerald-300">
                    a[i] = a[i] * 2; <span className="text-slate-500">// modifică direct v[i] din main!</span>
                  </div>
                  <div className="pl-4 text-slate-400">&#125;</div>
                  <div className="text-purple-400 font-semibold">&#125;</div>
                </>
              )}

              {activeTab === 'stats' && (
                <>
                  <div className="text-emerald-400 font-bold">
                    // Returnare multiplă prin parametri de referință &amp;
                  </div>
                  <div className="text-purple-400 font-semibold">
                    void <span className="text-yellow-300">calculStatistici</span>(int a[], int n, int &amp;s, int &amp;mn, int &amp;mx) &#123;
                  </div>
                  <div className="pl-4 text-slate-300">s = 0; mn = a[0]; mx = a[0];</div>
                  <div className="pl-4 text-slate-400">for (int i = 0; i &lt; n; i++) &#123;</div>
                  <div className="pl-8 text-slate-300">s += a[i];</div>
                  <div className="pl-8 text-slate-300">if (a[i] &lt; mn) mn = a[i];</div>
                  <div className="pl-8 text-slate-300">if (a[i] &gt; mx) mx = a[i];</div>
                  <div className="pl-4 text-slate-400">&#125;</div>
                  <div className="text-purple-400 font-semibold">&#125;</div>
                </>
              )}

              {activeTab === 'filter' && (
                <>
                  <div className="text-emerald-400 font-bold">
                    // Anulare numere impare in-place
                  </div>
                  <div className="text-purple-400 font-semibold">
                    void <span className="text-yellow-300">anuleazaImpare</span>(int a[], int n) &#123;
                  </div>
                  <div className="pl-4 text-slate-400">for (int i = 0; i &lt; n; i++) &#123;</div>
                  <div className="pl-8 text-emerald-300">
                    if (a[i] % 2 != 0) a[i] = 0;
                  </div>
                  <div className="pl-4 text-slate-400">&#125;</div>
                  <div className="text-purple-400 font-semibold">&#125;</div>
                </>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-4 flex flex-wrap gap-3">
              {activeTab === 'double' && (
                <button
                  onClick={handleRunDoubleElements}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow transition-colors text-sm"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Execută dublareElemente(v, 5)
                </button>
              )}

              {activeTab === 'stats' && (
                <button
                  onClick={handleRunCalculateStats}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow transition-colors text-sm"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Execută calculStatistici(v, 5, ...)
                </button>
              )}

              {activeTab === 'filter' && (
                <button
                  onClick={handleRunFilterEvens}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow transition-colors text-sm"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Execută anuleazaImpare(v, 5)
                </button>
              )}

              <button
                onClick={handleResetVector}
                className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors flex items-center gap-1.5"
                title="Resetează valorile din main"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Execution Log */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Consolă &amp; Tracing Subprogram</span>
            </div>
            <div className="bg-slate-950 p-3 rounded border border-slate-800/80 font-mono text-xs space-y-1.5 min-h-[90px]">
              {executionLogs.length === 0 ? (
                <div className="text-slate-500 italic">
                  Apasă pe butonul de execuție pentru a apela subprogramul și a trasa memoria.
                </div>
              ) : (
                executionLogs.map((log, idx) => (
                  <div key={idx} className="text-emerald-300">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Live RAM Visualization */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-semibold">
                <Database className="w-4 h-4" />
                <span>Memoria RAM în timp real: vectorul v[] din main()</span>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-mono">
                n = {vectorData.length} elemente
              </span>
            </div>

            {/* Visual Vector Array */}
            <div className="mt-5 grid grid-cols-5 gap-2 text-center">
              {vectorData.map((val, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-emerald-500/40 rounded-xl p-3 flex flex-col items-center justify-center relative shadow-inner group hover:border-emerald-400 transition-colors"
                >
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-1">
                    v[{idx}]
                  </span>
                  <span className="text-xl font-bold font-mono text-emerald-300">
                    {val}
                  </span>
                  <span className="text-[9px] text-slate-600 font-mono mt-1">
                    0x{(1000 + idx * 4).toString(16)}
                  </span>
                </div>
              ))}
            </div>

            {/* Explanation box */}
            <div className="mt-4 p-3 bg-emerald-950/30 border border-emerald-800/50 rounded-lg text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                Ce se întâmplă la apelul funcției?
              </div>
              <p>
                Când apelăm <code>dublareElemente(v, n)</code>, în stivă se transmite doar
                adresa <code>0x3e8</code> a primului element. Parametrul formal <code>int a[]</code> indică spre exact aceleași căsuțe de memorie!
              </p>
            </div>

            {/* Stats display if computed */}
            {calculatedStats && (
              <div className="mt-4 p-4 bg-slate-950 border border-cyan-800/50 rounded-lg">
                <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider block mb-2">
                  Rezultate calculate prin referință:
                </span>
                <div className="grid grid-cols-4 gap-2 text-center font-mono">
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-400">Sumă</div>
                    <div className="text-sm font-bold text-white">{calculatedStats.sum}</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-400">Medie</div>
                    <div className="text-sm font-bold text-cyan-300">{calculatedStats.avg}</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-400">Minim</div>
                    <div className="text-sm font-bold text-amber-300">{calculatedStats.min}</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-400">Maxim</div>
                    <div className="text-sm font-bold text-emerald-300">{calculatedStats.max}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Check Questions */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-400">
              <HelpCircle className="w-4 h-4" />
              <span>Verificare Înțelegere (Manual pag. 86)</span>
            </div>

            {/* Question 1 */}
            <div className="space-y-2 text-xs">
              <p className="text-slate-300 font-medium">
                1. De ce NU este necesar semnul <code>&amp;</code> în antetul <code>void f(int v[], int n)</code> pentru a modifica elementele vectorului?
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    id: 'val',
                    text: 'Elementele sunt copiate automat la ieșirea din funcție.'
                  },
                  {
                    id: 'ref',
                    text: 'Numele vectorului reprezintă deja adresa primului său element în memorie.'
                  },
                  {
                    id: 'compiler',
                    text: 'Compilatorul interzice modificarea oricărui tablou în funcții.'
                  }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      sounds.playClick();
                      setQ1Answer(opt.id);
                    }}
                    className={`text-left p-2.5 rounded-lg border transition-all text-xs ${
                      q1Answer === opt.id
                        ? opt.id === 'ref'
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                          : 'bg-rose-950/60 border-rose-500 text-rose-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2 */}
            <div className="space-y-2 text-xs pt-2 border-t border-slate-800">
              <p className="text-slate-300 font-medium">
                2. Dacă scriem un subprogram <code>void citire(int v[], int &amp;n)</code>, de ce parametrul <code>n</code> necesită <code>&amp;</code>?
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    id: 'size_ref',
                    text: 'Deoarece numărul de elemente n este o variabilă simplă citită în funcție ce trebuie transmisă înapoi în main.'
                  },
                  {
                    id: 'size_err',
                    text: 'Toți parametrii întregi din C++ au obligatoriu &amp;.'
                  }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      sounds.playClick();
                      setQ2Answer(opt.id);
                    }}
                    className={`text-left p-2.5 rounded-lg border transition-all text-xs ${
                      q2Answer === opt.id
                        ? opt.id === 'size_ref'
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                          : 'bg-rose-950/60 border-rose-500 text-rose-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isLevelCompleted
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              {isLevelCompleted
                ? 'Nivelul 3 Finalizat cu Succes!'
                : 'Cerințe: Execută cel puțin un subprogram și răspunde corect la cele 2 întrebări.'}
            </div>
            <div className="text-xs text-slate-400">
              Recompensă: +150 puncte XP și progres către Diploma de Arhitect Modular C++.
            </div>
          </div>
        </div>

        <button
          onClick={handleFinish}
          disabled={!isLevelCompleted}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            isLevelCompleted
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/20 cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Continuă spre Nivelul 4</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
