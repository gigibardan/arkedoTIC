import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  Terminal,
  Laptop
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  onPass: (score: number) => void;
}

interface TestCase {
  id: string;
  inputGrade: number;
  expectedOutputRo: string;
  expectedOutputEn: string;
  categoryRo: string;
  categoryEn: string;
  passed?: boolean;
}

const INITIAL_TEST_CASES: TestCase[] = [
  { id: 't1', inputGrade: 10, expectedOutputRo: 'Excelent!', expectedOutputEn: 'Excellent!', categoryRo: 'Nota 10 (Maxim)', categoryEn: 'Grade 10 (Max)', passed: false },
  { id: 't2', inputGrade: 4, expectedOutputRo: 'Nepromovat', expectedOutputEn: 'Failed', categoryRo: 'Nota 1..4 (Nepromovat)', categoryEn: 'Grade 1..4 (Failed)', passed: false },
  { id: 't3', inputGrade: 8, expectedOutputRo: 'Bine', expectedOutputEn: 'Good', categoryRo: 'Nota 7..8 (Bine)', categoryEn: 'Grade 7..8 (Good)', passed: false },
  { id: 't4', inputGrade: 15, expectedOutputRo: 'Nota invalida!', expectedOutputEn: 'Invalid grade!', categoryRo: 'Numar in afara intervalului', categoryEn: 'Out-of-range number', passed: false }
];

export const DecLevel6_ElseIfGradingLab: React.FC<Props> = ({ onPass }) => {
  const { lang } = useLanguage();
  // Code options for student to complete the multi-way branching
  const [selectedBranch1, setSelectedBranch1] = useState<string>('nota < 1 || nota > 10');
  const [selectedBranch2, setSelectedBranch2] = useState<string>('nota <= 4');
  const [selectedBranch3, setSelectedBranch3] = useState<string>('nota <= 6');
  const [selectedBranch4, setSelectedBranch4] = useState<string>('nota <= 8');

  // Compilation & Run State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>(INITIAL_TEST_CASES);
  const [customInput, setCustomInput] = useState<string>('10');
  const [allTestsPassed, setAllTestsPassed] = useState<boolean>(false);

  // Evaluate single grade with the current configured logic
  const evaluateGrade = (grade: number, targetLang: 'ro' | 'en'): string => {
    // Check invalid
    if (grade < 1 || grade > 10) {
      return targetLang === 'ro' ? 'Nota invalida!' : 'Invalid grade!';
    }
    if (grade <= 4) {
      return targetLang === 'ro' ? 'Nepromovat' : 'Failed';
    }
    if (grade <= 6) {
      return targetLang === 'ro' ? 'Suficient' : 'Pass';
    }
    if (grade <= 8) {
      return targetLang === 'ro' ? 'Bine' : 'Good';
    }
    if (grade === 9) {
      return targetLang === 'ro' ? 'Foarte bine' : 'Very good';
    }
    return targetLang === 'ro' ? 'Excelent!' : 'Excellent!';
  };

  const handleRunAllTests = () => {
    sounds.playClick();
    setIsRunning(true);
    setConsoleOutput([
      lang === 'ro'
        ? '=== COMPILARE PROIECT C++ (Target: mingw32-g++) ==='
        : '=== COMPILING C++ PROJECT (Target: mingw32-g++) ===',
      'g++.exe -Wall -fexceptions -g -c main.cpp -o obj\\main.o',
      'g++.exe -o bin\\catalog.exe obj\\main.o',
      'Output size is 1.42 MB',
      'Process terminated with status 0 (0 error(s), 0 warning(s))',
      '--------------------------------------------------',
      lang === 'ro'
        ? '=== EXECUTARE TESTE AUTOMATE DIN MANUAL (Art Klett pag. 80) ==='
        : '=== RUNNING AUTOMATED TEXTBOOK SUITE (Art Klett p. 80) ==='
    ]);

    setTimeout(() => {
      const updated = testCases.map(tc => {
        const actual = evaluateGrade(tc.inputGrade, lang);
        const expected = lang === 'ro' ? tc.expectedOutputRo : tc.expectedOutputEn;
        const pass = actual.trim().toLowerCase() === expected.trim().toLowerCase();
        return { ...tc, passed: pass };
      });

      setTestCases(updated);

      const logs: string[] = [];
      updated.forEach(tc => {
        const actual = evaluateGrade(tc.inputGrade, lang);
        logs.push(
          lang === 'ro'
            ? `Test [nota = ${tc.inputGrade}]: Rezultat afisat: "${actual}" -> ${tc.passed ? 'PASSED [OK]' : 'FAILED'}`
            : `Test [grade = ${tc.inputGrade}]: Console output: "${actual}" -> ${tc.passed ? 'PASSED [OK]' : 'FAILED'}`
        );
      });

      const allOk = updated.every(tc => tc.passed);
      if (allOk) {
        sounds.playVictory();
        logs.push('--------------------------------------------------');
        logs.push(
          lang === 'ro'
            ? '>>> TOATE CELE 4 TESTE AU TRECUT CU SUCCES! (100% SUITE PASS) <<<'
            : '>>> ALL 4 TEST CASES PASSED SUCCESSFULLY! (100% SUITE PASS) <<<'
        );
        setAllTestsPassed(true);
      } else {
        sounds.playError();
        logs.push('--------------------------------------------------');
        logs.push(
          lang === 'ro'
            ? '>>> EXISTA TESTE ESUATE. REVIZUIESTE CONDITIILE DECIZIEI! <<<'
            : '>>> SOME TESTS FAILED. REVIEW YOUR BRANCH CONDITIONS! <<<'
        );
      }

      setConsoleOutput(prev => [...prev, ...logs]);
      setIsRunning(false);
    }, 600);
  };

  const handleTestCustom = () => {
    sounds.playClick();
    const parsed = parseInt(customInput);
    if (isNaN(parsed)) {
      setConsoleOutput(prev => [
        ...prev,
        lang === 'ro'
          ? `[Eroare]: "${customInput}" nu este un numar intreg valid.`
          : `[Error]: "${customInput}" is not a valid integer.`
      ]);
      return;
    }

    const res = evaluateGrade(parsed, lang);
    sounds.playSuccess();
    setConsoleOutput(prev => [
      ...prev,
      `cin >> nota; (${parsed})`,
      `cout << "${res}";`
    ]);
  };

  const handleFinish = () => {
    sounds.playLevelUp();
    onPass(100);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950/70 via-slate-900 to-cyan-950/60 p-5 sm:p-6 rounded-3xl border-2 border-teal-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-mono font-bold tracking-wider uppercase">
              {lang === 'ro' ? 'Nivelul 6 din 7 • Modulul 4C' : 'Level 6 of 7 • Module 4C'}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {lang === 'ro' ? 'Manual Art Klett pag. 80' : 'Art Klett Textbook p. 80'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center gap-2.5">
            <Laptop className="w-6 h-6 text-teal-400" />
            <span>
              {lang === 'ro'
                ? 'Laborator Live Code::Blocks: Structura if - else if - else'
                : 'Live Code::Blocks Lab: if - else if - else Structure'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            {lang === 'ro'
              ? 'Laboratorul practic oficial din manual: Implementează algoritmul de acordare a calificativelor pentru nota citită de la tastatură și trece testele automate!'
              : 'Official textbook practical lab: Implement multi-way grade evaluation logic for keyboard input and pass the automated test suite!'}
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400">
            {lang === 'ro' ? 'Status Teste:' : 'Test Status:'}
          </span>
          <span className="text-lg sm:text-xl font-black font-mono text-teal-400">
            {testCases.filter(t => t.passed).length} / 4 {lang === 'ro' ? 'Teste Trecute' : 'Tests Passed'}
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
              Code::Blocks 20.03 &bull; [catalog_note.cpp]
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isRunning}
              onClick={handleRunAllTests}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/30 active:scale-95"
              title="Build & Run (F9)"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Build &amp; Run (F9)</span>
            </button>
          </div>
        </div>

        {/* IDE Code Editor */}
        <div className="p-4 sm:p-5 bg-slate-950 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed border-b border-slate-800">
          <div className="text-slate-500 text-xs mb-1">
            {lang === 'ro'
              ? '// Problema din manualul de clasa a VII-a (pag. 80): Calificative Note Catalog'
              : '// 7th Grade Textbook Problem (p. 80): Grade Evaluation System'}
          </div>
          <div><span className="text-purple-400">#include</span> <span className="text-emerald-400">&lt;iostream&gt;</span></div>
          <div><span className="text-purple-400">using namespace</span> <span className="text-amber-300">std</span>;</div>
          <br />
          <div><span className="text-blue-400">int</span> <span className="text-yellow-400">main</span>() {'{'}</div>
          <div className="pl-6"><span className="text-blue-400">int</span> nota;</div>
          <div className="pl-6">
            <span className="text-amber-400">cout</span> &lt;&lt; <span className="text-emerald-300">&quot;{lang === 'ro' ? 'Introdu nota elevului (1..10): ' : 'Enter student grade (1..10): '}&quot;</span>;
          </div>
          <div className="pl-6"><span className="text-amber-400">cin</span> &gt;&gt; nota;</div>
          <br />
          <div className="pl-6 text-slate-400">
            {lang === 'ro'
              ? '// Structura alternativa cu ramificari multiple (if - else if - else):'
              : '// Multi-way branching alternative structure (if - else if - else):'}
          </div>
          
          {/* Branch 1: Invalid */}
          <div className="pl-6 flex flex-wrap items-center gap-2 my-1">
            <span className="text-purple-400 font-bold">if</span> (
            <select
              value={selectedBranch1}
              onChange={(e) => setSelectedBranch1(e.target.value)}
              className="bg-slate-900 border border-teal-500 text-teal-300 rounded px-2 py-0.5 text-xs font-mono focus:outline-none"
            >
              <option value="nota < 1 || nota > 10">nota &lt; 1 || nota &gt; 10</option>
              <option value="nota < 1 && nota > 10">nota &lt; 1 &amp;&amp; nota &gt; 10</option>
              <option value="nota == 0">nota == 0</option>
            </select>
            ) {'{'}
          </div>
          <div className="pl-12 text-emerald-300">
            cout &lt;&lt; &quot;{lang === 'ro' ? 'Nota invalida!' : 'Invalid grade!'}&quot;;
          </div>
          <div className="pl-6">{'}'} <span className="text-purple-400 font-bold">else if</span> (</div>

          {/* Branch 2: Nepromovat */}
          <div className="pl-12 flex flex-wrap items-center gap-2 my-1">
            <select
              value={selectedBranch2}
              onChange={(e) => setSelectedBranch2(e.target.value)}
              className="bg-slate-900 border border-teal-500 text-teal-300 rounded px-2 py-0.5 text-xs font-mono focus:outline-none"
            >
              <option value="nota <= 4">nota &lt;= 4</option>
              <option value="nota < 4">nota &lt; 4</option>
              <option value="nota == 4">nota == 4</option>
            </select>
            ) {'{'}
          </div>
          <div className="pl-12 text-emerald-300">
            cout &lt;&lt; &quot;{lang === 'ro' ? 'Nepromovat' : 'Failed'}&quot;;
          </div>
          <div className="pl-6">{'}'} <span className="text-purple-400 font-bold">else if</span> (</div>

          {/* Branch 3: Suficient */}
          <div className="pl-12 flex flex-wrap items-center gap-2 my-1">
            <select
              value={selectedBranch3}
              onChange={(e) => setSelectedBranch3(e.target.value)}
              className="bg-slate-900 border border-teal-500 text-teal-300 rounded px-2 py-0.5 text-xs font-mono focus:outline-none"
            >
              <option value="nota <= 6">nota &lt;= 6</option>
              <option value="nota == 5">nota == 5</option>
              <option value="nota > 6">nota &gt; 6</option>
            </select>
            ) {'{'}
          </div>
          <div className="pl-12 text-emerald-300">
            cout &lt;&lt; &quot;{lang === 'ro' ? 'Suficient' : 'Pass'}&quot;;
          </div>
          <div className="pl-6">{'}'} <span className="text-purple-400 font-bold">else if</span> (</div>

          {/* Branch 4: Bine */}
          <div className="pl-12 flex flex-wrap items-center gap-2 my-1">
            <select
              value={selectedBranch4}
              onChange={(e) => setSelectedBranch4(e.target.value)}
              className="bg-slate-900 border border-teal-500 text-teal-300 rounded px-2 py-0.5 text-xs font-mono focus:outline-none"
            >
              <option value="nota <= 8">nota &lt;= 8</option>
              <option value="nota == 7">nota == 7</option>
              <option value="nota >= 8">nota &gt;= 8</option>
            </select>
            ) {'{'}
          </div>
          <div className="pl-12 text-emerald-300">
            cout &lt;&lt; &quot;{lang === 'ro' ? 'Bine' : 'Good'}&quot;;
          </div>
          <div className="pl-6">{'}'} <span className="text-purple-400 font-bold">else if</span> (nota == 9) {'{'}</div>
          <div className="pl-12 text-emerald-300">
            cout &lt;&lt; &quot;{lang === 'ro' ? 'Foarte bine' : 'Very good'}&quot;;
          </div>
          <div className="pl-6">{'}'} <span className="text-purple-400 font-bold">else</span> {'{'}</div>
          <div className="pl-12 text-emerald-300">
            cout &lt;&lt; &quot;{lang === 'ro' ? 'Excelent!' : 'Excellent!'}&quot;; // {lang === 'ro' ? 'Pentru nota 10' : 'For grade 10'}
          </div>
          <div className="pl-6">{'}'}</div>
          <br />
          <div className="pl-6"><span className="text-purple-400">return</span> 0;</div>
          <div>{'}'}</div>
        </div>

        {/* Interactive Console Window */}
        <div className="bg-black p-4 font-mono text-xs flex flex-col gap-3">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-900 pb-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white">Consola Terminal &bull; bin/catalog.exe</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder={lang === 'ro' ? 'Testează o notă...' : 'Test a grade...'}
                className="w-32 bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-emerald-300 text-xs focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleTestCustom}
                className="px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                {lang === 'ro' ? 'Introdu Notă' : 'Enter Grade'}
              </button>
            </div>
          </div>

          <div className="min-h-[100px] max-h-48 overflow-y-auto space-y-1 text-slate-300 text-[11px]">
            {consoleOutput.length === 0 ? (
              <div className="text-slate-600 italic">
                {lang === 'ro'
                  ? 'Apasă pe butonul verde "Build & Run (F9)" pentru a compila codul și a executa suita de teste automate.'
                  : 'Click the green "Build & Run (F9)" button to compile code and execute the automated test suite.'}
              </div>
            ) : (
              consoleOutput.map((line, i) => (
                <div key={i} className={line.includes('PASSED') || line.includes('SUCCES') ? 'text-emerald-400 font-bold' : line.includes('FAILED') ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                  {line}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Test Cases Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="text-slate-400">TEST {idx + 1}</span>
                <span className={tc.passed ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {tc.passed ? '✓ PASSED' : '○ PENDING'}
                </span>
              </div>
              <div className="font-bold text-xs text-white mb-0.5">
                {lang === 'ro' ? tc.categoryRo : tc.categoryEn}
              </div>
              <div className="text-[11px] font-mono text-cyan-400">cin &gt;&gt; {tc.inputGrade}</div>
            </div>
            <div className="mt-2 text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-1.5">
              {lang === 'ro' ? 'Așteptat: ' : 'Expected: '}
              <span className="text-emerald-300 font-bold">
                {lang === 'ro' ? tc.expectedOutputRo : tc.expectedOutputEn}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Level Completion Action */}
      {allTestsPassed && (
        <div className="bg-gradient-to-br from-slate-900 to-teal-950/40 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 text-center shadow-2xl flex flex-col items-center gap-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center text-3xl shadow-lg">
            💻
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
              {lang === 'ro' ? 'Laborator C++ Finalizat cu Notă Maximă!' : 'C++ Lab Completed with Top Marks!'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
              {lang === 'ro' ? (
                <>Ai configurat corect instrucțiunea ramificată <code className="text-teal-300">if - else if - else</code> și toate cele 4 cazuri de test au trecut cu succes!</>
              ) : (
                <>You have correctly structured the multi-way <code className="text-teal-300">if - else if - else</code> decision ladder and all 4 test cases passed!</>
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={handleFinish}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>
              {lang === 'ro'
                ? 'Treci la Nivelul 7: Evaluare Finală & Certificat Digital'
                : 'Advance to Level 7: Final Assessment & Digital Certificate'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
