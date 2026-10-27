import React, { useState } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Bug,
  HelpCircle,
  Lightbulb,
  Cpu,
  FileCode,
  Layers,
  Settings
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface Props {
  onPass: (score: number) => void;
}

type ChallengeId = 'c1' | 'c2' | 'c3';

interface Challenge {
  id: ChallengeId;
  title: string;
  bookPage: string;
  initialCode: string;
  hasBug: boolean;
  bugLine?: number;
  bugDescription?: string;
  fixedCode?: string;
  expectedConsoleOutput: string;
  goal: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    title: 'Exercițiul 1: Primul Mesaj în Consolă',
    bookPage: 'Manual Art Klett pag. 68',
    goal: 'Apasă butonul [F9: Build and Run] pentru a compila codul și a lansa consola de execuție.',
    initialCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Salut, clasa a 7-a! Am trecut la C++!";
    return 0;
}`,
    hasBug: false,
    expectedConsoleOutput: `Salut, clasa a 7-a! Am trecut la C++!

--------------------------------
Process returned 0 (0x0)   execution time : 0.003 s
Press any key to continue . . .`
  },
  {
    id: 'c2',
    title: 'Exercițiul 2: Declarare Variabile & Vârstă',
    bookPage: 'Manual Art Klett pag. 71',
    goal: 'Urmărește declararea a 3 variabile întregi (int) și calculul vârstei. Compilează cu F9!',
    initialCode: `#include <iostream>
using namespace std;

int main() {
    int an_curent = 2026;
    int an_nastere = 2012;
    int varsta = an_curent - an_nastere;

    cout << "Varsta elevului este: " << varsta << " ani.";
    return 0;
}`,
    hasBug: false,
    expectedConsoleOutput: `Varsta elevului este: 14 ani.

--------------------------------
Process returned 0 (0x0)   execution time : 0.002 s
Press any key to continue . . .`
  },
  {
    id: 'c3',
    title: 'Exercițiul 3: Depanare Eroare de Compilare',
    bookPage: 'Manual Art Klett pag. 73',
    goal: 'La linia 5 lipsește caracterul punct și virgulă (;). Apasă F9 pentru a citi eroarea în Build Log, apoi apasă [Repară Sintaxa] și re-compilează!',
    initialCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Test compilare laborator TIC"
    return 0;
}`,
    hasBug: true,
    bugLine: 5,
    bugDescription: `main.cpp:5: error: expected ';' before 'return'`,
    fixedCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Test compilare laborator TIC";
    return 0;
}`,
    expectedConsoleOutput: `Test compilare laborator TIC

--------------------------------
Process returned 0 (0x0)   execution time : 0.004 s
Press any key to continue . . .`
  }
];

export const CPLevel6_VirtualCodeBlocksStudio: React.FC<Props> = ({ onPass }) => {
  const [activeChallengeIdx, setActiveChallengeIdx] = useState<number>(0);
  const [currentCode, setCurrentCode] = useState<string>(CHALLENGES[0].initialCode);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [consoleOpen, setConsoleOpen] = useState<boolean>(false);
  const [consoleText, setConsoleText] = useState<string>('');
  const [hasRepairedBug, setHasRepairedBug] = useState<boolean>(false);
  const [completedChallenges, setCompletedChallenges] = useState<Set<ChallengeId>>(new Set());

  const currentChallenge = CHALLENGES[activeChallengeIdx];

  const handleSelectChallenge = (idx: number) => {
    sounds.playClick();
    setActiveChallengeIdx(idx);
    setCurrentCode(CHALLENGES[idx].initialCode);
    setBuildLogs([]);
    setConsoleOpen(false);
    setConsoleText('');
    setHasRepairedBug(false);
  };

  const handleBuildAndRun = () => {
    sounds.playClick();
    setIsCompiling(true);
    setConsoleOpen(false);
    setBuildLogs(['-------------- Build: Debug in ArkyStudio (compiler: GNU GCC Compiler)---------------', 'Checking for existence: main.o']);

    setTimeout(() => {
      setIsCompiling(false);

      if (currentChallenge.hasBug && !hasRepairedBug) {
        // Compile Error
        sounds.playWrong();
        setBuildLogs([
          'Compiling: main.cpp ...',
          `main.cpp: In function 'int main()':`,
          `main.cpp:5:5: error: expected ';' before 'return'`,
          '=== Build failed: 1 error(s), 0 warning(s) ==='
        ]);
      } else {
        // Compile Success
        sounds.playCorrect();
        setBuildLogs([
          'Compiling: main.cpp ...',
          'Linking console executable: bin/Debug/Proiect1.exe',
          'Output file is bin/Debug/Proiect1.exe with size 1.25 MB',
          '=== Build finished: 0 error(s), 0 warning(s) (0 minute(s), 0 second(s)) ==='
        ]);

        // Open black console window
        setTimeout(() => {
          setConsoleOpen(true);
          setConsoleText(currentChallenge.expectedConsoleOutput);
          setCompletedChallenges(prev => new Set(prev).add(currentChallenge.id));
        }, 500);
      }
    }, 700);
  };

  const handleRepairBug = () => {
    sounds.playCorrect();
    setHasRepairedBug(true);
    if (currentChallenge.fixedCode) {
      setCurrentCode(currentChallenge.fixedCode);
    }
  };

  const allCompleted = completedChallenges.size === CHALLENGES.length;

  const handleFinish = () => {
    sounds.playVictory();
    onPass(100);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl flex flex-col gap-6">
      {/* Level Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-500 flex items-center justify-center text-white shadow-lg text-2xl font-black">
            6
          </div>
          <div>
            <div className="text-[11px] font-mono font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Unitatea 4 • Limbajul C++ (Manual Art Klett pag. 68–73)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              Simulatorul Virtual Code::Blocks Studio
            </h2>
          </div>
        </div>

        {/* Challenge selector tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          {CHALLENGES.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => handleSelectChallenge(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeChallengeIdx === idx
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Ex {idx + 1}</span>
              {completedChallenges.has(ch.id) && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Goal & Book Ref Card */}
      <div className="p-3.5 rounded-2xl bg-slate-950 border border-violet-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-violet-300 font-heading text-sm">
            {currentChallenge.title}
          </span>
          <p className="text-slate-400 mt-0.5">
            {currentChallenge.goal}
          </p>
        </div>
        <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30 whitespace-nowrap self-start sm:self-auto">
          {currentChallenge.bookPage}
        </span>
      </div>

      {/* Code::Blocks Virtual IDE Window */}
      <div className="bg-slate-950 border-2 border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden font-mono text-xs">
        {/* Title bar */}
        <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-slate-300 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span className="font-bold ml-1">Code::Blocks 20.03 — main.cpp</span>
          </div>
          <span className="text-[10px] text-slate-500">MinGW GCC C++17</span>
        </div>

        {/* Toolbar with action buttons */}
        <div className="bg-slate-900/60 px-3 py-1.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleBuildAndRun}
              disabled={isCompiling}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isCompiling ? 'Compilare...' : 'Build & Run (F9)'}</span>
            </button>

            {currentChallenge.hasBug && !hasRepairedBug && (
              <button
                onClick={handleRepairBug}
                className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <Bug className="w-3.5 h-3.5 text-rose-400" />
                <span>Repară Sintaxa (Adaugă ;)</span>
              </button>
            )}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span>Encoding: UTF-8</span>
            <span>•</span>
            <span>C++ Source File</span>
          </div>
        </div>

        {/* Code Editor body */}
        <div className="p-4 bg-slate-950 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto min-h-[160px] text-slate-200">
          <pre className="whitespace-pre">
            {currentCode.split('\n').map((line, idx) => (
              <div key={idx} className="flex">
                <span className="w-8 select-none text-slate-600 text-right pr-4 font-mono text-xs">
                  {idx + 1}
                </span>
                <span className={idx + 1 === currentChallenge.bugLine && !hasRepairedBug ? 'bg-rose-950/60 text-rose-300 px-1 rounded' : ''}>
                  {line}
                </span>
              </div>
            ))}
          </pre>
        </div>

        {/* Build Log panel */}
        <div className="bg-slate-900 border-t border-slate-800 p-3 flex flex-col gap-1 text-[11px]">
          <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
            <Terminal className="w-3 h-3 text-cyan-400" />
            <span>Build log (Consolă de Compilare):</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 font-mono text-[11px] min-h-[50px] space-y-1">
            {buildLogs.length === 0 ? (
              <span className="text-slate-600 italic">Apasă pe butonul "Build & Run (F9)" pentru a începe compilarea...</span>
            ) : (
              buildLogs.map((log, i) => (
                <div
                  key={i}
                  className={log.includes('error') ? 'text-rose-400 font-bold' : log.includes('0 error') ? 'text-emerald-400 font-bold' : 'text-slate-400'}
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Floating Realistic Windows/Linux Command Prompt Console */}
      {consoleOpen && (
        <div className="bg-black border-2 border-slate-600 rounded-2xl shadow-2xl p-4 font-mono text-xs sm:text-sm text-slate-100 flex flex-col gap-3 animate-scaleUp">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block" />
              <span>Command Prompt — C:\ArkyCode\Proiect1.exe</span>
            </div>
            <button
              onClick={() => setConsoleOpen(false)}
              className="text-slate-500 hover:text-white cursor-pointer"
            >
              ✕ Închide Consola
            </button>
          </div>

          <div className="whitespace-pre-line text-emerald-400 font-mono py-2 leading-relaxed">
            {consoleText}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[11px] text-slate-500">
            <span>Rulare încheiată cu succes (Cod 0)</span>
            <span className="text-emerald-400 font-bold">100% Executat</span>
          </div>
        </div>
      )}

      {/* Completion */}
      {allCompleted && (
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs sm:text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>
              Felicitări! Ai rulat cu succes toate cele 3 exerciții C++ în simulatorul Code::Blocks!
            </span>
          </div>

          <button
            onClick={handleFinish}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 cursor-pointer"
          >
            <span>Treci la Nivelul 7: Examenul de Calificare & Certificat</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
