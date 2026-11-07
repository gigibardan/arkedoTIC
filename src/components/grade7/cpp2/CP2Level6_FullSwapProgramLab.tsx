import React, { useState } from 'react';
import { Sparkles, ArrowRight, Play, Terminal, Code2, Copy, Check, Zap } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  onPass: (score: number) => void;
}

export const CP2Level6_FullSwapProgramLab: React.FC<Props> = ({ onPass }) => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<'classic' | 'mathTrick'>('classic');
  const [inputA, setInputA] = useState<number>(14);
  const [inputB, setInputB] = useState<number>(85);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [executionOutput, setExecutionOutput] = useState<string[] | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [hasRunAtLeastOnce, setHasRunAtLeastOnce] = useState<boolean>(false);

  const classicCodeRo = `#include <iostream>
using namespace std;

int main() {
    int a, b, aux;
    
    // 1. Citire de la tastatura
    cout << "Introdu valoarea lui a: ";
    cin >> a;
    cout << "Introdu valoarea lui b: ";
    cin >> b;

    cout << "\\n=== INAINTE DE SWAP ===" << endl;
    cout << "a = " << a << " | b = " << b << endl;

    // 2. Regula celor 3 Pahare (Algoritmul Clasic)
    aux = a;   // Paharul AUX primeste continutul lui a
    a = b;     // Paharul a primeste continutul lui b
    b = aux;   // Paharul b primeste continutul salvat in AUX

    cout << "\\n=== DUPA SWAP (REUSIT!) ===" << endl;
    cout << "a = " << a << " | b = " << b << endl;

    return 0;
}`;

  const classicCodeEn = `#include <iostream>
using namespace std;

int main() {
    int a, b, aux;
    
    // 1. Read input from keyboard
    cout << "Enter value for a: ";
    cin >> a;
    cout << "Enter value for b: ";
    cin >> b;

    cout << "\\n=== BEFORE SWAP ===" << endl;
    cout << "a = " << a << " | b = " << b << endl;

    // 2. The 3 Glasses Rule (Classic Algorithm)
    aux = a;   // Glass AUX receives contents of a
    a = b;     // Glass a receives contents of b
    b = aux;   // Glass b receives contents saved in AUX

    cout << "\\n=== AFTER SWAP (SUCCESS!) ===" << endl;
    cout << "a = " << a << " | b = " << b << endl;

    return 0;
}`;

  const mathTrickCodeRo = `#include <iostream>
using namespace std;

int main() {
    int a, b;
    // Citire
    cin >> a >> b;

    // Trucul Aritmetic Fara Variabila Auxiliara (Olimpiada):
    a = a + b;  // a contine suma ambelor
    b = a - b;  // b primeste vechiul a (suma - vechiul b)
    a = a - b;  // a primeste vechiul b (suma - noul b)

    cout << "Dupa swap: a = " << a << ", b = " << b << endl;
    return 0;
}`;

  const mathTrickCodeEn = `#include <iostream>
using namespace std;

int main() {
    int a, b;
    // Input
    cin >> a >> b;

    // Olympic Arithmetic Trick without Auxiliary Variable:
    a = a + b;  // a stores sum of both
    b = a - b;  // b gets old a (sum - old b)
    a = a - b;  // a gets old b (sum - new b)

    cout << "After swap: a = " << a << ", b = " << b << endl;
    return 0;
}`;

  const currentCode = activeTab === 'classic'
    ? (lang === 'ro' ? classicCodeRo : classicCodeEn)
    : (lang === 'ro' ? mathTrickCodeRo : mathTrickCodeEn);

  const handleRunProgram = () => {
    sounds.playClick();
    setIsCompiling(true);
    setExecutionOutput(null);

    setTimeout(() => {
      sounds.playSuccess();
      setIsCompiling(false);
      setHasRunAtLeastOnce(true);

      const beforeA = inputA;
      const beforeB = inputB;
      const afterA = inputB;
      const afterB = inputA;

      if (activeTab === 'classic') {
        if (lang === 'ro') {
          setExecutionOutput([
            '-------------- Build: Debug in Ark3do_IDE (compiler: GNU GCC) ---------------',
            'Target is up to date.',
            'Nothing to be done (all items are up-to-date).',
            '-------------- Run: Debug in Ark3do_IDE (compiler: GNU GCC) -----------------',
            `Introdu valoarea lui a: ${beforeA}`,
            `Introdu valoarea lui b: ${beforeB}`,
            '',
            '=== INAINTE DE SWAP ===',
            `a = ${beforeA} | b = ${beforeB}`,
            '',
            '=== DUPA SWAP (REUSIT!) ===',
            `a = ${afterA} | b = ${afterB}`,
            '',
            'Process returned 0 (0x0)   execution time : 0.042 s',
            'Press any key to continue.'
          ]);
        } else {
          setExecutionOutput([
            '-------------- Build: Debug in Ark3do_IDE (compiler: GNU GCC) ---------------',
            'Target is up to date.',
            'Nothing to be done (all items are up-to-date).',
            '-------------- Run: Debug in Ark3do_IDE (compiler: GNU GCC) -----------------',
            `Enter value for a: ${beforeA}`,
            `Enter value for b: ${beforeB}`,
            '',
            '=== BEFORE SWAP ===',
            `a = ${beforeA} | b = ${beforeB}`,
            '',
            '=== AFTER SWAP (SUCCESS!) ===',
            `a = ${afterA} | b = ${afterB}`,
            '',
            'Process returned 0 (0x0)   execution time : 0.042 s',
            'Press any key to continue.'
          ]);
        }
      } else {
        if (lang === 'ro') {
          setExecutionOutput([
            '-------------- Build: Debug in Ark3do_IDE (compiler: GNU GCC) ---------------',
            'Compiling math_swap.cpp with optimization -O2...',
            'Target is up to date.',
            '-------------- Run: Debug in Ark3do_IDE (compiler: GNU GCC) -----------------',
            `Date de intrare: a = ${beforeA}, b = ${beforeB}`,
            `Pas 1: a = a + b => a = ${beforeA + beforeB}`,
            `Pas 2: b = a - b => b = ${afterB}`,
            `Pas 3: a = a - b => a = ${afterA}`,
            '',
            `Dupa swap aritmetic: a = ${afterA}, b = ${afterB}`,
            '',
            'Process returned 0 (0x0)   execution time : 0.015 s',
            'Press any key to continue.'
          ]);
        } else {
          setExecutionOutput([
            '-------------- Build: Debug in Ark3do_IDE (compiler: GNU GCC) ---------------',
            'Compiling math_swap.cpp with optimization -O2...',
            'Target is up to date.',
            '-------------- Run: Debug in Ark3do_IDE (compiler: GNU GCC) -----------------',
            `Input values: a = ${beforeA}, b = ${beforeB}`,
            `Step 1: a = a + b => a = ${beforeA + beforeB}`,
            `Step 2: b = a - b => b = ${afterB}`,
            `Step 3: a = a - b => a = ${afterA}`,
            '',
            `After arithmetic swap: a = ${afterA}, b = ${afterB}`,
            '',
            'Process returned 0 (0x0)   execution time : 0.015 s',
            'Press any key to continue.'
          ]);
        }
      }
    }, 600);
  };

  const handleCopyCode = () => {
    sounds.playClick();
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinish = () => {
    sounds.playLevelUp();
    onPass(100);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-950 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {lang === 'ro'
                  ? 'Nivelul 6 • Clasa a VII-a • Laborator Code::Blocks'
                  : 'Level 6 • 7th Grade • Code::Blocks Lab'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {lang === 'ro' ? 'Laborator Live: ' : 'Live Lab: '}
              <span className="text-cyan-400 font-mono">
                {lang === 'ro' ? 'Programul C++ Complet de Swap' : 'Complete C++ Swap Program'}
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              {lang === 'ro' ? (
                <>
                  Asamblează și rulează programul complet în mediul virtual Code::Blocks. Testează cu valori alese de tine și descoperă și trucul matematic folosit la olimpiade!
                </>
              ) : (
                <>
                  Assemble and run the full program inside our simulated Code::Blocks environment. Experiment with custom inputs and discover the math trick used in programming olympiads!
                </>
              )}
            </p>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto bg-slate-950/60 p-3 rounded-2xl border border-cyan-500/20">
            <span className="text-xs text-slate-400 font-mono">
              {lang === 'ro' ? 'Mediu Compilare' : 'Compiler Environment'}
            </span>
            <span className="text-sm font-bold text-cyan-300 font-mono">GCC / Code::Blocks 20.03</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setActiveTab('classic');
            setExecutionOutput(null);
          }}
          className={`px-4 py-2.5 rounded-2xl font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer border ${
            activeTab === 'classic'
              ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 ring-2 ring-cyan-500/30'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>
            {lang === 'ro'
              ? 'Algoritmul Clasic (cu aux) - Manual'
              : 'Classic Algorithm (with aux) - Textbook'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setActiveTab('mathTrick');
            setExecutionOutput(null);
          }}
          className={`px-4 py-2.5 rounded-2xl font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer border ${
            activeTab === 'mathTrick'
              ? 'bg-amber-950/80 border-amber-500 text-amber-300 ring-2 ring-amber-500/30'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>
            {lang === 'ro'
              ? 'Bonus Olimpic: Swap Aritmetic (fără aux)'
              : 'Olympic Bonus: Arithmetic Swap (without aux)'}
          </span>
        </button>
      </div>

      {/* Virtual Code::Blocks Window */}
      <div className="bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
        {/* Code::Blocks Menu Bar & Toolbar */}
        <div className="bg-slate-800/90 border-b border-slate-700 p-2 sm:p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 mr-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            </div>
            <span className="font-mono text-slate-300 font-bold hidden sm:inline">Code::Blocks IDE — [swap_program.cpp]</span>
          </div>

          {/* Test Inputs */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-xl border border-slate-700 font-mono text-xs">
            <span className="text-slate-400">{lang === 'ro' ? 'Testează a:' : 'Test a:'}</span>
            <input
              type="number"
              value={inputA}
              onChange={e => setInputA(Number(e.target.value))}
              className="w-14 bg-slate-900 text-cyan-300 px-1 py-0.5 rounded text-center border border-slate-700 font-bold"
            />
            <span className="text-slate-400 ml-1">b:</span>
            <input
              type="number"
              value={inputB}
              onChange={e => setInputB(Number(e.target.value))}
              className="w-14 bg-slate-900 text-sky-300 px-1 py-0.5 rounded text-center border border-slate-700 font-bold"
            />
          </div>

          {/* Build and Run Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCode}
              className="px-2.5 py-1.5 rounded-lg bg-slate-750 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1 border border-slate-650 cursor-pointer"
              title={lang === 'ro' ? 'Copiază codul C++' : 'Copy C++ code'}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>
                {copied
                  ? (lang === 'ro' ? 'Copiat!' : 'Copied!')
                  : (lang === 'ro' ? 'Copiază' : 'Copy')}
              </span>
            </button>

            <button
              type="button"
              onClick={handleRunProgram}
              disabled={isCompiling}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-900/40"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>
                {isCompiling
                  ? (lang === 'ro' ? 'Compilare...' : 'Compiling...')
                  : 'Build & Run (F9)'}
              </span>
            </button>
          </div>
        </div>

        {/* Code View Area */}
        <div className="bg-slate-950 p-4 sm:p-6 font-mono text-xs sm:text-sm overflow-x-auto text-slate-300 leading-relaxed border-b border-slate-800">
          <pre className="text-slate-200">
            <code>{currentCode}</code>
          </pre>
        </div>

        {/* Terminal Console Output */}
        <div className="bg-black/95 p-4 sm:p-5 font-mono text-xs text-emerald-400 min-h-[160px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-900 pb-2 mb-3">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {lang === 'ro'
                    ? 'Consola C++ de Execuție (Windows Command Prompt)'
                    : 'C++ Execution Console (Windows Command Prompt)'}
                </span>
              </span>
              <span>Mod: 64-bit Target</span>
            </div>

            {isCompiling && (
              <div className="flex items-center gap-2 text-cyan-400 animate-pulse">
                <span>
                  {lang === 'ro'
                    ? 'Compilare în curs... g++ -Wall -g -c main.cpp'
                    : 'Compiling in progress... g++ -Wall -g -c main.cpp'}
                </span>
              </div>
            )}

            {!isCompiling && executionOutput && (
              <div className="space-y-1">
                {executionOutput.map((line, idx) => (
                  <div key={idx} className={line.includes('===') ? 'text-amber-400 font-bold' : ''}>
                    {line}
                  </div>
                ))}
              </div>
            )}

            {!isCompiling && !executionOutput && (
              <div className="text-slate-600 italic">
                {lang === 'ro'
                  ? 'Apasă pe butonul verde "Build & Run (F9)" pentru a compila și rula programul C++...'
                  : 'Click the green "Build & Run (F9)" button to compile and execute the C++ program...'}
              </div>
            )}
          </div>

          {hasRunAtLeastOnce && (
            <div className="mt-4 pt-3 border-t border-slate-900 flex justify-end">
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition"
              >
                <span>
                  {lang === 'ro'
                    ? 'Treci la Nivelul 7: Evaluare Finală & Certificat'
                    : 'Advance to Level 7: Final Assessment & Certificate'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
