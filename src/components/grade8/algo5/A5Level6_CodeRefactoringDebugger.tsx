import React, { useState } from 'react';
import {
  Bug,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  HelpCircle,
  ShieldAlert,
  Wrench,
  Check,
  Eye,
  RefreshCw
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface A5Level6Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A5Level6_CodeRefactoringDebugger: React.FC<A5Level6Props> = ({
  onCompletePage,
  onComplete
}) => {
  const { lang } = useLanguage();

  const [selectedCase, setSelectedCase] = useState<number>(1);
  const [solvedCases, setSolvedCases] = useState<{ [key: number]: boolean }>({
    1: false,
    2: false,
    3: false,
    4: false
  });

  // Bug 1: Variable Shadowing
  const [shadowFixed, setShadowFixed] = useState<boolean>(false);
  // Bug 2: Missing Return
  const [returnFixed, setReturnFixed] = useState<boolean>(false);
  // Bug 3: Missing Reference &
  const [refFixed, setRefFixed] = useState<boolean>(false);
  // Bug 4: Refactoring Monolith
  const [refactorFixed, setRefactorFixed] = useState<boolean>(false);

  // Trace logs
  const [debuggerLog, setDebuggerLog] = useState<string[]>([]);

  const handleTestBug1 = () => {
    sounds.playClick();
    if (!shadowFixed) {
      setDebuggerLog(
        lang === 'ro'
          ? [
              '[EROARE LOGICĂ] Variabila locală "int x = 50" a mascat (shadowed) variabila globală "x".',
              'În main(), variabila globală x a rămas 10! Modificarea a fost pierdută.'
            ]
          : [
              '[LOGICAL ERROR] Local variable "int x = 50" shadowed the global variable "x".',
              'In main(), global x remained 10! The modification was lost.'
            ]
      );
    } else {
      setDebuggerLog(
        lang === 'ro'
          ? [
              '[REPARAT] Variabila locală redundantă a fost eliminată sau s-a folosit referința corectă.',
              'În main(), x are valoarea corectă: 50. Test validat!'
            ]
          : [
              '[FIXED] Redundant local variable removed.',
              'In main(), x has the correct value: 50. Test passed!'
            ]
      );
      setSolvedCases((prev) => ({ ...prev, 1: true }));
    }
  };

  const handleTestBug2 = () => {
    sounds.playClick();
    if (!returnFixed) {
      setDebuggerLog(
        lang === 'ro'
          ? [
              '[AVERTISMENT COMPILATOR / UB] Funcția "int maxim(int a, int b)" nu conține o instrucțiune "return" pe ramura secundară!',
              'Când a <= b, funcția returnează o valoare reziduală (gunoi din memorie): ex. 32767. Rezultat incorect!'
            ]
          : [
              '[COMPILER WARNING / UB] Function "int maxim(int a, int b)" lacks a "return" statement on the secondary branch!',
              'When a <= b, function returns garbage stack memory: e.g. 32767. Incorrect output!'
            ]
      );
    } else {
      setDebuggerLog(
        lang === 'ro'
          ? [
              '[REPARAT] S-a adăugat instrucțiunea "return b;" pe ramura else.',
              'maxim(15, 29) returnează acum corect 29 în toate cazurile!'
            ]
          : [
              '[FIXED] Added "return b;" statement on the else branch.',
              'maxim(15, 29) now reliably returns 29 in all branches!'
            ]
      );
      setSolvedCases((prev) => ({ ...prev, 2: true }));
    }
  };

  const handleTestBug3 = () => {
    sounds.playClick();
    if (!refFixed) {
      setDebuggerLog(
        lang === 'ro'
          ? [
              '[EROARE CRITICĂ] Antetul void citire(int v[], int n) transmite n PRIN VALOARE!',
              'În interiorul funcției s-a citit n = 5, dar în main() variabila n a rămas 0!',
              'Vectorul apare ca având 0 elemente!'
            ]
          : [
              '[CRITICAL BUG] Header void read(int v[], int n) passes n BY VALUE!',
              'Inside function n = 5 was read, but in main() variable n remained 0!',
              'The array appears to contain 0 elements!'
            ]
      );
    } else {
      setDebuggerLog(
        lang === 'ro'
          ? [
              '[REPARAT] Antetul a fost corectat: void citire(int v[], int &n).',
              'Parametrul n primește & (referință), astfel încât n = 5 este transmis cu succes în main()!'
            ]
          : [
              '[FIXED] Header corrected to void read(int v[], int &n).',
              'Parameter n now has & (reference), so n = 5 is successfully passed back to main()!'
            ]
      );
      setSolvedCases((prev) => ({ ...prev, 3: true }));
    }
  };

  const handleTestBug4 = () => {
    sounds.playClick();
    if (!refactorFixed) {
      setDebuggerLog(
        lang === 'ro'
          ? [
              '[COD MONOLITIC REDUNDANT] Același algoritm de inversare a fost duplicat de două ori pentru numărul a și numărul b.',
              'Dacă apare o greșeală, trebuie modificat în 2 locuri diferite!'
            ]
          : [
              '[REDUNDANT MONOLITHIC CODE] The same reversal loop was duplicated twice for number a and number b.',
              'Any fix requires updating two separate blocks!'
            ]
      );
    } else {
      setDebuggerLog(
        lang === 'ro'
          ? [
              '[REFACTORIZAT EXCELENT] S-a creat o singură funcție int oglindit(int n) refolosită:',
              'if (oglindit(a) == a && oglindit(b) == b) cout << "Ambele palindroame";',
              'Codul s-a redus de la 25 de linii la 5 linii curate!'
            ]
          : [
              '[EXCELLENT REFACTORING] Created a single reusable function int mirrored(int n):',
              'if (mirrored(a) == a && mirrored(b) == b) cout << "Both are palindromes";',
              'Code reduced from 25 repetitive lines to 5 clean lines!'
            ]
      );
      setSolvedCases((prev) => ({ ...prev, 4: true }));
    }
  };

  const totalSolved = Object.values(solvedCases).filter(Boolean).length;
  const isCompleted = totalSolved === 4;

  const handleFinish = () => {
    if (!isCompleted) return;
    sounds.playLevelComplete();
    if (onCompletePage) onCompletePage(150);
    if (onComplete) onComplete();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-950/70 via-slate-900 to-amber-950/70 border border-rose-800/40 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300">
              <Bug className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-rose-400 font-semibold">
                {lang === 'ro' ? 'Nivelul 6 • Unitatea 3 (Manual pag. 88)' : 'Level 6 • Unit 3 (Textbook p. 88)'}
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {lang === 'ro'
                  ? 'Clinica de Depanare & Refactorizare Funcții'
                  : 'Function Debugging & Refactoring Clinic'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-900/40 border border-rose-700/50 rounded-lg text-rose-300 text-sm font-mono">
            <span>
              {totalSolved} / 4 {lang === 'ro' ? 'Cazuri Rezolvate' : 'Cases Solved'}
            </span>
          </div>
        </div>
        <p className="mt-3 text-slate-300 text-sm leading-relaxed">
          {lang === 'ro' ? (
            <>
              Chiar și programatorii experimentați se lovesc de erori subtile la subprograme:
              mascarea variabilelor (shadowing), uitarea instrucțiunii <code>return</code> sau omiterea operatorului <code>&amp;</code>.
              Diagnostichează și repară fiecare din cele 4 cazuri clinice!
            </>
          ) : (
            <>
              Even experienced developers encounter subtle bugs with functions:
              variable shadowing, missing <code>return</code> statements, or omitting the <code>&amp;</code> reference operator.
              Diagnose and repair all 4 clinical debugging cases!
            </>
          )}
        </p>
      </div>

      {/* Case Navigator */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            id: 1,
            titleRo: 'Cazul 1: Shadowing',
            titleEn: 'Case 1: Shadowing',
            solved: solvedCases[1]
          },
          {
            id: 2,
            titleRo: 'Cazul 2: Missing Return',
            titleEn: 'Case 2: Missing Return',
            solved: solvedCases[2]
          },
          {
            id: 3,
            titleRo: 'Cazul 3: Omitere &',
            titleEn: 'Case 3: Missing &',
            solved: solvedCases[3]
          },
          {
            id: 4,
            titleRo: 'Cazul 4: Refactorizare',
            titleEn: 'Case 4: Refactoring',
            solved: solvedCases[4]
          }
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setSelectedCase(c.id);
              sounds.playClick();
            }}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedCase === c.id
                ? 'bg-rose-900/40 border-rose-400 text-white shadow-lg'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono font-semibold">
              <span>{lang === 'ro' ? c.titleRo : c.titleEn}</span>
              {c.solved ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {c.solved
                ? lang === 'ro'
                  ? 'Test validat'
                  : 'Test passed'
                : lang === 'ro'
                ? 'Bug activ'
                : 'Bug active'}
            </div>
          </button>
        ))}
      </div>

      {/* Case Content Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Code Snippet & Toggle Fix */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            {/* Case 1 */}
            {selectedCase === 1 && (
              <>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {lang === 'ro'
                      ? 'Cazul 1: Mascarea Variabilelor (Variable Shadowing)'
                      : 'Case 1: Variable Shadowing'}
                  </span>
                  <button
                    onClick={() => {
                      setShadowFixed(!shadowFixed);
                      sounds.playClick();
                    }}
                    className={`px-3 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                      shadowFixed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {shadowFixed
                      ? lang === 'ro'
                        ? 'Comută la Cod Eronat'
                        : 'Switch to Buggy Code'
                      : lang === 'ro'
                      ? 'Aplică Reparația'
                      : 'Apply Fix'}
                  </button>
                </div>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs leading-relaxed">
                  <div className="text-slate-400">
                    int x = 10; <span className="text-slate-500">{lang === 'ro' ? '// variabilă globală' : '// global variable'}</span>
                  </div>
                  <div className="text-purple-400">void actualizare() &#123;</div>
                  {shadowFixed ? (
                    <div className="pl-4 text-emerald-400 font-bold">
                      x = 50; <span className="text-slate-500">{lang === 'ro' ? '// modifică direct variabila vizibilă' : '// modifies visible variable directly'}</span>
                    </div>
                  ) : (
                    <div className="pl-4 text-rose-400 font-bold">
                      int x = 50; <span className="text-slate-500">{lang === 'ro' ? '// BUG: creează o variabilă locală nouă x ce maschează globala!' : '// BUG: creates local variable x shadowing the global!'}</span>
                    </div>
                  )}
                  <div className="text-purple-400">&#125;</div>
                  <div className="text-purple-400 mt-2">int main() &#123;</div>
                  <div className="pl-4 text-slate-300">actualizare();</div>
                  <div className="pl-4 text-slate-300">cout &lt;&lt; x; <span className="text-slate-500">{lang === 'ro' ? '// Ce afișează?' : '// What does it print?'}</span></div>
                  <div className="text-purple-400">&#125;</div>
                </div>
                <button
                  onClick={handleTestBug1}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-mono font-bold transition-colors"
                >
                  <Play className="w-4 h-4 fill-white" />
                  {lang === 'ro' ? 'Compilează & Testează Cazul 1' : 'Compile & Test Case 1'}
                </button>
              </>
            )}

            {/* Case 2 */}
            {selectedCase === 2 && (
              <>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {lang === 'ro'
                      ? 'Cazul 2: Return Lipsă pe o Ramură de Decizie'
                      : 'Case 2: Missing Return on Decision Branch'}
                  </span>
                  <button
                    onClick={() => {
                      setReturnFixed(!returnFixed);
                      sounds.playClick();
                    }}
                    className={`px-3 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                      returnFixed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {returnFixed
                      ? lang === 'ro'
                        ? 'Comută la Cod Eronat'
                        : 'Switch to Buggy Code'
                      : lang === 'ro'
                      ? 'Aplică Reparația'
                      : 'Apply Fix'}
                  </button>
                </div>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs leading-relaxed">
                  <div className="text-purple-400">int maxim(int a, int b) &#123;</div>
                  <div className="pl-4 text-slate-300">if (a &gt; b) &#123;</div>
                  <div className="pl-8 text-emerald-400">return a;</div>
                  <div className="pl-4 text-slate-300">&#125;</div>
                  {returnFixed ? (
                    <div className="pl-4 text-emerald-400 font-bold">
                      else &#123; return b; &#125; <span className="text-slate-500">{lang === 'ro' ? '// REPARAT: garantează întoarcerea unei valori' : '// FIXED: guarantees returning a value'}</span>
                    </div>
                  ) : (
                    <div className="pl-4 text-rose-400 font-bold">
                      <span className="text-slate-500">{lang === 'ro' ? '// BUG: dacă a <= b, funcția iese fără nicio valoare returnată!' : '// BUG: if a <= b, function exits without any return value!'}</span>
                    </div>
                  )}
                  <div className="text-purple-400">&#125;</div>
                </div>
                <button
                  onClick={handleTestBug2}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-mono font-bold transition-colors"
                >
                  <Play className="w-4 h-4 fill-white" />
                  {lang === 'ro' ? 'Compilează & Testează Cazul 2' : 'Compile & Test Case 2'}
                </button>
              </>
            )}

            {/* Case 3 */}
            {selectedCase === 3 && (
              <>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {lang === 'ro'
                      ? 'Cazul 3: Omiterea & pe Parametrul de Dimensiune'
                      : 'Case 3: Omitting & on Array Size Parameter'}
                  </span>
                  <button
                    onClick={() => {
                      setRefFixed(!refFixed);
                      sounds.playClick();
                    }}
                    className={`px-3 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                      refFixed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {refFixed
                      ? lang === 'ro'
                        ? 'Comută la Cod Eronat'
                        : 'Switch to Buggy Code'
                      : lang === 'ro'
                      ? 'Aplică Reparația'
                      : 'Apply Fix'}
                  </button>
                </div>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs leading-relaxed">
                  {refFixed ? (
                    <div className="text-emerald-400 font-bold">
                      void citire(int v[], int &amp;n) &#123; <span className="text-slate-500">{lang === 'ro' ? '// REPARAT: n este referință!' : '// FIXED: n is reference!'}</span>
                    </div>
                  ) : (
                    <div className="text-rose-400 font-bold">
                      void citire(int v[], int n) &#123; <span className="text-slate-500">{lang === 'ro' ? '// BUG: n este transmis prin valoare (copie)!' : '// BUG: n passed by value (copy)!'}</span>
                    </div>
                  )}
                  <div className="pl-4 text-slate-300">cin &gt;&gt; n;</div>
                  <div className="pl-4 text-slate-300">for(int i = 0; i &lt; n; i++) cin &gt;&gt; v[i];</div>
                  <div className="text-purple-400">&#125;</div>
                </div>
                <button
                  onClick={handleTestBug3}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-mono font-bold transition-colors"
                >
                  <Play className="w-4 h-4 fill-white" />
                  {lang === 'ro' ? 'Compilează & Testează Cazul 3' : 'Compile & Test Case 3'}
                </button>
              </>
            )}

            {/* Case 4 */}
            {selectedCase === 4 && (
              <>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {lang === 'ro'
                      ? "Cazul 4: Refactorizare Cod Duplicat (DRY: Don't Repeat Yourself)"
                      : "Case 4: Refactoring Duplicated Code (DRY)"}
                  </span>
                  <button
                    onClick={() => {
                      setRefactorFixed(!refactorFixed);
                      sounds.playClick();
                    }}
                    className={`px-3 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                      refactorFixed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {refactorFixed
                      ? lang === 'ro'
                        ? 'Comută la Cod Eronat'
                        : 'Switch to Buggy Code'
                      : lang === 'ro'
                      ? 'Aplică Reparația'
                      : 'Apply Fix'}
                  </button>
                </div>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs leading-relaxed">
                  {refactorFixed ? (
                    <div className="text-emerald-300 space-y-1">
                      <div className="text-purple-400">int oglindit(int n) &#123; ... return inv; &#125;</div>
                      <div className="text-purple-400">int main() &#123;</div>
                      <div className="pl-4">
                        if (oglindit(a) == a &amp;&amp; oglindit(b) == b)
                      </div>
                      <div className="pl-8">
                        cout &lt;&lt; &quot;{lang === 'ro' ? 'Ambele sunt palindroame!' : 'Both are palindromes!'}&quot;;
                      </div>
                      <div className="text-purple-400">&#125;</div>
                    </div>
                  ) : (
                    <div className="text-rose-300 space-y-1">
                      <div className="text-slate-500">{lang === 'ro' ? '// Cod duplicat de 2 ori în main():' : '// Duplicated twice in main():'}</div>
                      <div>int aux1 = a, inv1 = 0; while(aux1) &#123; inv1 = inv1*10 + aux1%10; aux1 /= 10; &#125;</div>
                      <div>int aux2 = b, inv2 = 0; while(aux2) &#123; inv2 = inv2*10 + aux2%10; aux2 /= 10; &#125;</div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleTestBug4}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-mono font-bold transition-colors"
                >
                  <Play className="w-4 h-4 fill-white" />
                  {lang === 'ro' ? 'Compilează & Testează Cazul 4' : 'Compile & Test Case 4'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right: Debugger Diagnostic Console */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-rose-400 pb-2 border-b border-slate-800">
              <Terminal className="w-4 h-4" />
              <span>{lang === 'ro' ? 'Consolă de Diagnosticare Compilator' : 'Compiler Diagnostic Console'}</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs space-y-2 min-h-[140px]">
              {debuggerLog.length === 0 ? (
                <div className="text-slate-500 italic">
                  {lang === 'ro'
                    ? 'Selectează un caz, comută reparația și apasă pe butonul de compilare pentru a inspecta avertismentele.'
                    : 'Select a case, toggle the fix, and click compile to inspect compiler warnings.'}
                </div>
              ) : (
                debuggerLog.map((log, idx) => (
                  <div
                    key={idx}
                    className={
                      log.startsWith('[REPARAT]') || log.startsWith('[REFACTORIZAT') || log.startsWith('[FIXED]') || log.startsWith('[EXCELLENT')
                        ? 'text-emerald-400 font-semibold'
                        : 'text-rose-400'
                    }
                  >
                    {log}
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="font-semibold text-slate-300">
                {lang === 'ro' ? 'Regula de aur a depanării:' : 'Golden Rule of Debugging:'}
              </div>
              <p>
                {lang === 'ro'
                  ? 'Dacă o funcție nu modifică o variabilă transmisă din main, primul lucru verificat este prezența caracterului & în antet!'
                  : 'If a function does not modify a variable passed from main, the very first thing to check is the & operator in the signature!'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isCompleted
                ? 'bg-rose-500/20 text-rose-400'
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              {isCompleted
                ? lang === 'ro'
                  ? 'Clinica de Depanare Finalizată cu Succes!'
                  : 'Debugging Clinic Completed Successfully!'
                : lang === 'ro'
                ? `Cerințe: Rezolvă toate cele 4 cazuri clinice (${totalSolved}/4 finalizate).`
                : `Requirements: Solve all 4 clinical cases (${totalSolved}/4 completed).`}
            </div>
            <div className="text-xs text-slate-400">
              {lang === 'ro'
                ? 'Recompensă: +150 puncte XP și deblocarea Evaluării Sumative Finale a Unității 3.'
                : 'Reward: +150 XP points and unlock the Unit 3 Final Summative Exam.'}
            </div>
          </div>
        </div>

        <button
          onClick={handleFinish}
          disabled={!isCompleted}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            isCompleted
              ? 'bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white shadow-lg shadow-rose-500/20 cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>{lang === 'ro' ? 'Continuă spre Examenul Final (Nivelul 7)' : 'Continue to Final Exam (Level 7)'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
