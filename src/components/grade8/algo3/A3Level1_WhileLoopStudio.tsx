import React, { useState, useEffect } from 'react';
import {
  Repeat,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  HelpCircle,
  Clock,
  Check,
  ShieldAlert
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface A3Level1Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A3Level1_WhileLoopStudio: React.FC<A3Level1Props> = ({
  onCompletePage,
  onComplete
}) => {
  // While loop simulator state
  const [initialN, setInitialN] = useState<number>(5);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [loopLogs, setLoopLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasCompletedRun, setHasCompletedRun] = useState<boolean>(false);

  // Infinite loop sandbox
  const [omittedIncrement, setOmittedIncrement] = useState<boolean>(false);
  const [infiniteLoopTriggered, setInfiniteLoopTriggered] = useState<boolean>(false);

  // Quiz
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const runWhileSimulation = () => {
    sounds.playClick();
    setIsRunning(true);
    setLoopLogs([]);
    setCurrentStep(0);
    setInfiniteLoopTriggered(false);

    if (omittedIncrement) {
      // Demonstrate infinite loop safeguard
      sounds.playWrong();
      setInfiniteLoopTriggered(true);
      setLoopLogs([
        'Pasul 1: i = 1, conditie 1 <= 5 (ADEVĂRAT)',
        'Pasul 2: i = 1 (uitat i++), conditie 1 <= 5 (ADEVĂRAT)',
        'Pasul 3: i = 1, conditie 1 <= 5 (ADEVĂRAT)',
        'Pasul 4: i = 1, conditie 1 <= 5 (ADEVĂRAT)...',
        '🚨 STOP DE URGENȚĂ CPU! Buclă infinită detectată (i nu se modifică în corpul buclei)!'
      ]);
      setIsRunning(false);
      return;
    }

    const logs: string[] = [];
    let count = initialN;
    let step = 1;

    logs.push(`// Început buclă: n = ${count}`);
    while (count > 0) {
      logs.push(`Pasul ${step}: Se afișează ${count}; se execută n = n - 1 (rămâne ${count - 1})`);
      count--;
      step++;
    }
    logs.push(`// Ieșire din buclă: n = 0, condiția (n > 0) este FALSĂ! Bucla se termină.`);

    setLoopLogs(logs);
    setHasCompletedRun(true);
    setIsRunning(false);
    sounds.playCorrect();
  };

  const isLevelCompleted =
    hasCompletedRun &&
    infiniteLoopTriggered &&
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
      <div className="bg-gradient-to-r from-cyan-950 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-cyan-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-400/30 text-cyan-300">
              <Repeat className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/30 text-cyan-200 border border-cyan-400/30">
                  Modulul 3C • Nivelul 1 din 7
                </span>
                <span className="text-xs text-cyan-300">Manual Art Klett pag. 71–72</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                Structura Repetitivă cu Test Inițial: while & Prevenirea Buclelor Infinite
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-cyan-300 uppercase tracking-wider block">Progres Misiune</span>
            <span className="text-lg font-bold text-cyan-300">Nivelul 1: Bucla while</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-cyan-100/90 leading-relaxed max-w-3xl">
          Când nu știm dinainte exact câți pași va rula un algoritm (de exemplu la prelucrarea cifrelor sau validarea intrărilor), folosim o <strong>structură repetitivă cu test inițial</strong> (<code className="bg-cyan-950 px-1.5 py-0.5 rounded text-cyan-300 font-mono">while</code>). Condiția se verifică <em>înainte</em> de executarea instrucțiunilor: dacă e falsă de la început, bucla nu se execută nici măcar o dată!
        </p>
      </div>

      {/* Simulator: Interactive while execution & Infinite loop sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Controls & Configuration */}
        <div className="lg:col-span-5 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Code2 className="w-4 h-4 text-cyan-400" />
            Configurare Simulator while
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 flex justify-between">
              <span>Valoare inițială <code className="text-amber-300">n</code> (Numărătoare inversă):</span>
              <span className="font-mono text-cyan-300 font-bold text-sm">n = {initialN}</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={initialN}
              onChange={(e) => {
                setInitialN(Number(e.target.value));
                setHasCompletedRun(false);
              }}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>1 pas</span>
              <span>5 pași</span>
              <span>10 pași</span>
            </div>
          </div>

          {/* Omitted step danger checkbox */}
          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-2">
            <label className="flex items-start space-x-2.5 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={omittedIncrement}
                onChange={(e) => {
                  setOmittedIncrement(e.target.checked);
                  setInfiniteLoopTriggered(false);
                }}
                className="mt-0.5 accent-rose-500 rounded"
              />
              <div>
                <span className="font-semibold text-rose-300">Simulează Omisiunea Actualizării (Bug Clasic)</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Elimină comanda <code className="text-rose-400 font-mono">n--</code> din corpul buclei pentru a declanșa o buclă infinită!
                </p>
              </div>
            </label>
          </div>

          <button
            onClick={runWhileSimulation}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white rounded-lg font-medium text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            Execută Bucla while în CPU
          </button>

          {/* Completion badges */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div
              className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                hasCompletedRun
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Execuție Normală</span>
            </div>
            <div
              className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                infiniteLoopTriggered
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Test Buclă Infinită</span>
            </div>
          </div>
        </div>

        {/* Right: Code & Execution Output */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Cod Sursă & Terminal de Execuție
            </h3>
            <span className="text-xs text-slate-400 font-mono">while (n &gt; 0)</span>
          </div>

          {/* Code Window */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
            <div><span className="text-indigo-400">int</span> n = <span className="text-amber-300">{initialN}</span>;</div>
            <div>
              <span className="text-pink-400 font-semibold">while</span> (n &gt; <span className="text-amber-300">0</span>) &#123;
            </div>
            <div className="pl-4 text-emerald-300">
              cout &lt;&lt; n &lt;&lt; <span className="text-amber-200">" "</span>;
            </div>
            <div className="pl-4">
              {omittedIncrement ? (
                <span className="text-rose-400 font-bold bg-rose-950/50 px-1 rounded">
                  // [EROARE]: Linia n--; a fost omisă!
                </span>
              ) : (
                <span className="text-cyan-300">n--; <span className="text-slate-500">// modifică condiția spre fals</span></span>
              )}
            </div>
            <div>&#125;</div>
            <div className="text-slate-400">cout &lt;&lt; <span className="text-amber-200">"Lansare!"</span>;</div>
          </div>

          {/* Output log */}
          <div className="bg-black/90 p-3 rounded-lg border border-slate-800 font-mono text-xs space-y-1 min-h-[120px] max-h-[180px] overflow-y-auto">
            <div className="text-slate-500 text-[11px]">// Jurnal de execuție CPU:</div>
            {loopLogs.length === 0 ? (
              <span className="text-slate-600 italic">Apasă „Execută Bucla while” pentru a porni urmărirea pas cu pas...</span>
            ) : (
              loopLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={
                    log.startsWith('🚨')
                      ? 'text-rose-400 font-bold animate-pulse'
                      : log.startsWith('//')
                      ? 'text-slate-400'
                      : 'text-emerald-400'
                  }
                >
                  {log}
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
          Verificare Regulamentară C++ (Manual pag. 71–72)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">Întrebarea 1:</span>
            <p className="text-xs text-slate-300">
              De câte ori se va executa instrucțiunea din corpul buclei dacă condiția inițială este falsă de la început (de ex: <code className="text-pink-400 font-mono">int n = 0; while (n &gt; 0)</code>)?
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', label: 'Exact o singură dată' },
                { id: 'b', label: 'Nici măcar o dată (0 ori), deoarece testul este efectuat înainte de prima rulare' },
                { id: 'c', label: 'La infinit' }
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
                  <span>{opt.label}</span>
                  {q1Answer === opt.id && opt.id === 'b' && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">Întrebarea 2:</span>
            <p className="text-xs text-slate-300">
              Ce este o „buclă infinită” (infinite loop) și cum poate fi prevenită în programare?
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', label: 'O buclă a cărei condiție nu devine niciodată falsă; se previne asigurându-ne că cel puțin o variabilă din condiție se modifică în corpul buclei spre atingerea valorii de oprire' },
                { id: 'b', label: 'O buclă care consumă prea mult curent electric' },
                { id: 'c', label: 'O buclă care are mai mult de 100 de linii de cod' }
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
                  <span>{opt.label}</span>
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
              ? 'Excelent! Ai înțeles structura repetitivă cu test inițial și riscurile buclelor infinite.'
              : 'Rulează o execuție normală, simulează bucla infinită și răspunde la cele două întrebări.'}
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
          <span>Următorul Nivel: Bucla do-while</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
