import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Terminal,
  Laptop,
  Check,
  Code
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface Props {
  onPass: (score: number) => void;
}

interface TestCase {
  id: string;
  inputN: number;
  expectedOutput: number;
  label: string;
  passed?: boolean;
}

const INITIAL_TESTS: TestCase[] = [
  { id: 't1', inputN: 2468, expectedOutput: 4, label: 'Toate cifrele pare (2, 4, 6, 8)', passed: false },
  { id: 't2', inputN: 1357, expectedOutput: 0, label: 'Toate cifrele impare (1, 3, 5, 7)', passed: false },
  { id: 't3', inputN: 2026, expectedOutput: 4, label: 'Conține cifra zero (2, 0, 2, 6 - zero este par!)', passed: false },
  { id: 't4', inputN: 90514, expectedOutput: 2, label: 'Număr mixt de 5 cifre (0 și 4)', passed: false }
];

export const LoopLevel6_CodeBlocksWhileLab: React.FC<Props> = ({ onPass }) => {
  // Selectable code snippets to complete the algorithm
  const [selectedWhileCond, setSelectedWhileCond] = useState<string>('n > 0');
  const [selectedExtract, setSelectedExtract] = useState<string>('n % 10');
  const [selectedCheck, setSelectedCheck] = useState<string>('c % 2 == 0');
  const [selectedChop, setSelectedChop] = useState<string>('n / 10');

  // Execution states
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [testCases, setTestCases] = useState<TestCase[]>(INITIAL_TESTS);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [customN, setCustomN] = useState<string>('2026');
  const [allPassed, setAllPassed] = useState<boolean>(false);

  // Evaluate single number using currently selected slots
  const runAlgorithm = (num: number): number => {
    let n = Math.abs(num);
    let count = 0;
    let safetyCounter = 0;

    // Simulate while
    while (
      (selectedWhileCond === 'n > 0' && n > 0) ||
      (selectedWhileCond === 'n != 0' && n !== 0)
    ) {
      safetyCounter++;
      if (safetyCounter > 50) break; // Infinite loop safety guard

      let c = 0;
      if (selectedExtract === 'n % 10') c = n % 10;
      else if (selectedExtract === 'n / 10') c = Math.floor(n / 10);
      else c = n;

      if (selectedCheck === 'c % 2 == 0' && c % 2 === 0) count++;
      else if (selectedCheck === 'c % 2 != 0' && c % 2 !== 0) count++;

      if (selectedChop === 'n / 10') n = Math.floor(n / 10);
      else if (selectedChop === 'n - 1') n = n - 1;
      else if (selectedChop === 'n % 10') n = n % 10;
    }

    return count;
  };

  const handleRunAllTests = () => {
    sounds.playClick();
    setIsRunning(true);
    setConsoleOutput([
      '=== COMPILARE PROIECT C++ (Target: mingw32-g++) ===',
      'g++.exe -Wall -fexceptions -g -c main.cpp -o obj\\main.o',
      'g++.exe -o bin\\cifre_pare.exe obj\\main.o',
      'Process terminated with status 0 (0 error(s), 0 warning(s))',
      '--------------------------------------------------',
      '=== EXECUTARE SUITĂ TESTE OFICIALE (Manual Art Klett pag. 85) ==='
    ]);

    setTimeout(() => {
      const isConfigCorrect =
        (selectedWhileCond === 'n > 0' || selectedWhileCond === 'n != 0') &&
        selectedExtract === 'n % 10' &&
        selectedCheck === 'c % 2 == 0' &&
        selectedChop === 'n / 10';

      const updated = testCases.map(tc => {
        const actual = runAlgorithm(tc.inputN);
        const pass = isConfigCorrect && actual === tc.expectedOutput;
        return { ...tc, passed: pass };
      });

      setTestCases(updated);

      const logs: string[] = [];
      updated.forEach(tc => {
        const actual = runAlgorithm(tc.inputN);
        logs.push(`Test [n = ${tc.inputN}]: Rezultat afișat: ${actual} | Așteptat: ${tc.expectedOutput} -> ${tc.passed ? 'PASSED [OK]' : 'FAILED'}`);
      });

      const ok = updated.every(t => t.passed);
      if (ok) {
        sounds.playVictory();
        logs.push('--------------------------------------------------');
        logs.push('>>> TOATE CELE 4 TESTE AU FOST TRECUTE CU SUCCES! (100% SUITE PASS) <<<');
        setAllPassed(true);
      } else {
        sounds.playError();
        logs.push('--------------------------------------------------');
        logs.push('>>> TESTE EȘUATE. VERIFICĂ EXTRAGEREA (%), VERIFICAREA PARITĂȚII ȘI TĂIEREA (/)! <<<');
      }

      setConsoleOutput(prev => [...prev, ...logs]);
      setIsRunning(false);
    }, 600);
  };

  const handleTestCustom = () => {
    sounds.playClick();
    const parsed = parseInt(customN);
    if (isNaN(parsed)) {
      setConsoleOutput(prev => [...prev, `[Eroare]: "${customN}" nu este un număr valid.`]);
      return;
    }

    const res = runAlgorithm(parsed);
    sounds.playSuccess();
    setConsoleOutput(prev => [
      ...prev,
      `cin >> n; (${parsed})`,
      `cout << "Numar cifre pare: " << ${res} << endl;`
    ]);
  };

  const handleFinish = () => {
    sounds.playLevelUp();
    onPass(100);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-950/70 via-slate-900 to-amber-950/60 p-5 sm:p-6 rounded-3xl border-2 border-orange-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 text-[10px] font-mono font-bold tracking-wider uppercase">
              Nivelul 6 din 7 • Modulul 4D
            </span>
            <span className="text-xs text-slate-400 font-mono">Manual Art Klett pag. 85</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center gap-2.5">
            <Laptop className="w-6 h-6 text-orange-400" />
            <span>Laborator Live Code::Blocks: Numărarea Cifrelor Pare</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Laboratorul practic oficial: Scrie programul C++ care citește un număr natural și calculează câte cifre pare conține. Compilează cu F9 și trece toate cazurile de testare!
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400">Status Teste:</span>
          <span className="text-lg sm:text-xl font-black font-mono text-orange-400">
            {testCases.filter(t => t.passed).length} / 4 Teste Trecute
          </span>
        </div>
      </div>

      {/* Code::Blocks Simulated IDE Window */}
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* IDE Titlebar */}
        <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-300 ml-2">
              Code::Blocks 20.03 &bull; [cifre_pare.cpp]
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isRunning}
              onClick={handleRunAllTests}
              className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-orange-600/30 active:scale-95"
              title="Compilează și Execută Toate Testele (F9)"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Build &amp; Run (F9)</span>
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="p-4 sm:p-5 bg-slate-950 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed border-b border-slate-800">
          <div className="text-slate-500 text-xs mb-1">
            // Problema din manual (pag. 85): Numărarea cifrelor pare ale unui număr
          </div>
          <div><span className="text-purple-400">#include</span> <span className="text-emerald-400">&lt;iostream&gt;</span></div>
          <div><span className="text-purple-400">using namespace</span> <span className="text-amber-300">std</span>;</div>
          <br />
          <div><span className="text-blue-400">int</span> <span className="text-yellow-400">main</span>() {'{'}</div>
          <div className="pl-6"><span className="text-blue-400">int</span> n, nr_pare = <span className="text-amber-300 font-bold">0</span>;</div>
          <div className="pl-6"><span className="text-amber-400">cin</span> &gt;&gt; n;</div>
          <br />
          {/* While condition slot */}
          <div className="pl-6 flex flex-wrap items-center gap-2 my-1">
            <span className="text-purple-400 font-bold">while</span> (
            <select
              value={selectedWhileCond}
              onChange={(e) => setSelectedWhileCond(e.target.value)}
              className="bg-slate-900 border border-orange-500 text-orange-300 rounded px-2 py-0.5 text-xs font-mono focus:outline-none"
            >
              <option value="n > 0">n &gt; 0</option>
              <option value="n >= 0">n &gt;= 0 (Pericol buclă infinită!)</option>
              <option value="n == 0">n == 0</option>
            </select>
            ) {'{'}
          </div>

          {/* Extract digit slot */}
          <div className="pl-12 flex flex-wrap items-center gap-2 my-1">
            <span className="text-blue-400">int</span> c ={' '}
            <select
              value={selectedExtract}
              onChange={(e) => setSelectedExtract(e.target.value)}
              className="bg-slate-900 border border-orange-500 text-orange-300 rounded px-2 py-0.5 text-xs font-mono focus:outline-none"
            >
              <option value="n % 10">n % 10 (Extrage ultima cifră)</option>
              <option value="n / 10">n / 10</option>
              <option value="n + 10">n + 10</option>
            </select>
            ;
          </div>

          {/* Parity check slot */}
          <div className="pl-12 flex flex-wrap items-center gap-2 my-1">
            <span className="text-purple-400 font-bold">if</span> (
            <select
              value={selectedCheck}
              onChange={(e) => setSelectedCheck(e.target.value)}
              className="bg-slate-900 border border-orange-500 text-orange-300 rounded px-2 py-0.5 text-xs font-mono focus:outline-none"
            >
              <option value="c % 2 == 0">c % 2 == 0 (Cifra este pară)</option>
              <option value="c % 2 != 0">c % 2 != 0 (Cifra este impară)</option>
              <option value="c == 2">c == 2</option>
            </select>
            ){' '}
            <span className="text-amber-300 font-bold">nr_pare++</span>;
          </div>

          {/* Chop digit slot */}
          <div className="pl-12 flex flex-wrap items-center gap-2 my-1">
            n ={' '}
            <select
              value={selectedChop}
              onChange={(e) => setSelectedChop(e.target.value)}
              className="bg-slate-900 border border-orange-500 text-orange-300 rounded px-2 py-0.5 text-xs font-mono focus:outline-none"
            >
              <option value="n / 10">n / 10 (Taie ultima cifră)</option>
              <option value="n % 10">n % 10</option>
              <option value="n - 1">n - 1</option>
            </select>
            ;
          </div>

          <div className="pl-6">{'}'}</div>
          <br />
          <div className="pl-6"><span className="text-amber-400">cout</span> &lt;&lt; <span className="text-emerald-300">&quot;Cifre pare: &quot;</span> &lt;&lt; nr_pare &lt;&lt; <span className="text-amber-400">endl</span>;</div>
          <div className="pl-6"><span className="text-purple-400">return</span> 0;</div>
          <div>{'}'}</div>
        </div>

        {/* Console Terminal */}
        <div className="bg-black p-4 font-mono text-xs flex flex-col gap-3">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-900 pb-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-orange-400" />
              <span className="font-bold text-white">Consola Terminal &bull; bin/cifre_pare.exe</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customN}
                onChange={(e) => setCustomN(e.target.value)}
                placeholder="Testează număr..."
                className="w-32 bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-orange-300 text-xs focus:outline-none focus:border-orange-500"
              />
              <button
                type="button"
                onClick={handleTestCustom}
                className="px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Introdu n
              </button>
            </div>
          </div>

          <div className="min-h-[100px] max-h-48 overflow-y-auto space-y-1 text-slate-300 text-[11px]">
            {consoleOutput.length === 0 ? (
              <div className="text-slate-600 italic">
                Apasă pe butonul portocaliu &quot;Build &amp; Run (F9)&quot; pentru a compila codul și a rula testele automate.
              </div>
            ) : (
              consoleOutput.map((line, i) => (
                <div key={i} className={line.includes('PASSED') || line.includes('SUCCES') ? 'text-emerald-400 font-bold' : line.includes('FAILED') || line.includes('EȘUATE') ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                  {line}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Test Cases Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        {testCases.map((tc, idx) => (
          <div
            key={tc.id}
            className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${
              tc.passed
                ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md'
                : 'bg-slate-950/60 border-slate-800 text-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="text-slate-400">TEST {idx + 1}</span>
                <span className={tc.passed ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {tc.passed ? '✓ PASSED' : '○ PENDING'}
                </span>
              </div>
              <div className="font-bold text-xs text-white mb-0.5 font-sans">{tc.label}</div>
              <div className="text-[11px] text-cyan-400">cin &gt;&gt; {tc.inputN}</div>
            </div>
            <div className="mt-2 text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
              Cifre pare așteptate: <span className="text-emerald-300 font-bold">{tc.expectedOutput}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Level Completion Action */}
      {allPassed && (
        <div className="bg-gradient-to-br from-slate-900 to-orange-950/40 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 text-center shadow-2xl flex flex-col items-center gap-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center text-3xl shadow-lg">
            💻
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
              Laborator C++ Finalizat cu Notă Maximă!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
              Ai configurat corect extragerea cu <code className="text-orange-300">n % 10</code>, paritatea cu <code className="text-orange-300">c % 2 == 0</code> și tăierea cu <code className="text-orange-300">n / 10</code>!
            </p>
          </div>

          <button
            type="button"
            onClick={handleFinish}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Treci la Nivelul 7: Evaluare Finală &amp; Certificat Digital</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
