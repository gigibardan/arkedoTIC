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

interface A5Level6Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A5Level6_CodeRefactoringDebugger: React.FC<A5Level6Props> = ({
  onCompletePage,
  onComplete
}) => {
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
      setDebuggerLog([
        '[EROARE LOGICĂ] Variabila locală "int x = 50" a mascat (shadowed) variabila globală "x".',
        'În main(), variabila globală x a rămas 10! Modificarea a fost pierdută.'
      ]);
    } else {
      setDebuggerLog([
        '[REPARAT] Variabila locală redundantă a fost eliminată sau s-a folosit referința corectă.',
        'În main(), x are valoarea corectă: 50. Test validat!'
      ]);
      setSolvedCases((prev) => ({ ...prev, 1: true }));
    }
  };

  const handleTestBug2 = () => {
    sounds.playClick();
    if (!returnFixed) {
      setDebuggerLog([
        '[AVERTISMENT COMPILATOR / UB] Funcția "int maxim(int a, int b)" nu conține o instrucțiune "return" pe ramura secundară!',
        'Când a <= b, funcția returnează o valoare reziduală (gunoi din memorie): ex. 32767. Rezultat incorect!'
      ]);
    } else {
      setDebuggerLog([
        '[REPARAT] S-a adăugat instrucțiunea "return b;" pe ramura else.',
        'maxim(15, 29) returnează acum corect 29 în toate cazurile!'
      ]);
      setSolvedCases((prev) => ({ ...prev, 2: true }));
    }
  };

  const handleTestBug3 = () => {
    sounds.playClick();
    if (!refFixed) {
      setDebuggerLog([
        '[EROARE CRITICĂ] Antetul void citire(int v[], int n) transmite n PRIN VALOARE!',
        'În interiorul funcției s-a citit n = 5, dar în main() variabila n a rămas 0!',
        'Vectorul apare ca având 0 elemente!'
      ]);
    } else {
      setDebuggerLog([
        '[REPARAT] Antetul a fost corectat: void citire(int v[], int &n).',
        'Parametrul n primește & (referință), astfel încât n = 5 este transmis cu succes în main()!'
      ]);
      setSolvedCases((prev) => ({ ...prev, 3: true }));
    }
  };

  const handleTestBug4 = () => {
    sounds.playClick();
    if (!refactorFixed) {
      setDebuggerLog([
        '[COD MONOLITIC REDUNDANT] Același algoritm de inversare a fost duplicat de două ori pentru numărul a și numărul b.',
        'Dacă apare o greșeală, trebuie modificat în 2 locuri diferite!'
      ]);
    } else {
      setDebuggerLog([
        '[REFACTORIZAT EXCELENT] S-a creat o singură funcție int oglindit(int n) refolosită:',
        'if (oglindit(a) == a && oglindit(b) == b) cout << "Ambele palindroame";',
        'Codul s-a redus de la 25 de linii la 5 linii curate!'
      ]);
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
                Nivelul 6 • Unitatea 3 (Manual pag. 88)
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Clinica de Depanare &amp; Refactorizare Funcții
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-900/40 border border-rose-700/50 rounded-lg text-rose-300 text-sm font-mono">
            <span>{totalSolved} / 4 Cazuri Rezolvate</span>
          </div>
        </div>
        <p className="mt-3 text-slate-300 text-sm leading-relaxed">
          Chiar și programatorii experimentați se lovesc de erori subtile la subprograme:
          mascarea variabilelor (shadowing), uitarea instrucțiunii <code>return</code> sau omiterea operatorului <code>&amp;</code>.
          Diagnostichează și repară fiecare din cele 4 cazuri clinice!
        </p>
      </div>

      {/* Case Navigator */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { id: 1, title: 'Cazul 1: Shadowing', solved: solvedCases[1] },
          { id: 2, title: 'Cazul 2: Missing Return', solved: solvedCases[2] },
          { id: 3, title: 'Cazul 3: Omitere &', solved: solvedCases[3] },
          { id: 4, title: 'Cazul 4: Refactorizare', solved: solvedCases[4] }
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
              <span>{c.title}</span>
              {c.solved ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {c.solved ? 'Test validat' : 'Bug activ'}
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
                    Cazul 1: Mascarea Variabilelor (Variable Shadowing)
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
                    {shadowFixed ? 'Comută la Cod Eronat' : 'Aplică Reparația'}
                  </button>
                </div>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs leading-relaxed">
                  <div className="text-slate-400">int x = 10; <span className="text-slate-500">// variabilă globală</span></div>
                  <div className="text-purple-400">void actualizare() &#123;</div>
                  {shadowFixed ? (
                    <div className="pl-4 text-emerald-400 font-bold">
                      x = 50; <span className="text-slate-500">// modifică direct variabila vizibilă</span>
                    </div>
                  ) : (
                    <div className="pl-4 text-rose-400 font-bold">
                      int x = 50; <span className="text-slate-500">// BUG: creează o variabilă locală nouă x ce maschează globala!</span>
                    </div>
                  )}
                  <div className="text-purple-400">&#125;</div>
                  <div className="text-purple-400 mt-2">int main() &#123;</div>
                  <div className="pl-4 text-slate-300">actualizare();</div>
                  <div className="pl-4 text-slate-300">cout &lt;&lt; x; <span className="text-slate-500">// Ce afișează?</span></div>
                  <div className="text-purple-400">&#125;</div>
                </div>
                <button
                  onClick={handleTestBug1}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-mono font-bold transition-colors"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Compilează &amp; Testează Cazul 1
                </button>
              </>
            )}

            {/* Case 2 */}
            {selectedCase === 2 && (
              <>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    Cazul 2: Return Lipsă pe o Ramură de Decizie
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
                    {returnFixed ? 'Comută la Cod Eronat' : 'Aplică Reparația'}
                  </button>
                </div>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs leading-relaxed">
                  <div className="text-purple-400">int maxim(int a, int b) &#123;</div>
                  <div className="pl-4 text-slate-300">if (a &gt; b) &#123;</div>
                  <div className="pl-8 text-emerald-400">return a;</div>
                  <div className="pl-4 text-slate-300">&#125;</div>
                  {returnFixed ? (
                    <div className="pl-4 text-emerald-400 font-bold">
                      else &#123; return b; &#125; <span className="text-slate-500">// REPARAT: garantează întoarcerea unei valori</span>
                    </div>
                  ) : (
                    <div className="pl-4 text-rose-400 font-bold">
                      <span className="text-slate-500">// BUG: dacă a &lt;= b, funcția iese fără nicio valoare returnată!</span>
                    </div>
                  )}
                  <div className="text-purple-400">&#125;</div>
                </div>
                <button
                  onClick={handleTestBug2}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-mono font-bold transition-colors"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Compilează &amp; Testează Cazul 2
                </button>
              </>
            )}

            {/* Case 3 */}
            {selectedCase === 3 && (
              <>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    Cazul 3: Omiterea &amp; pe Parametrul de Dimensiune
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
                    {refFixed ? 'Comută la Cod Eronat' : 'Aplică Reparația'}
                  </button>
                </div>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs leading-relaxed">
                  {refFixed ? (
                    <div className="text-emerald-400 font-bold">
                      void citire(int v[], int &amp;n) &#123; <span className="text-slate-500">// REPARAT: n este referință!</span>
                    </div>
                  ) : (
                    <div className="text-rose-400 font-bold">
                      void citire(int v[], int n) &#123; <span className="text-slate-500">// BUG: n este transmis prin valoare (copie)!</span>
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
                  Compilează &amp; Testează Cazul 3
                </button>
              </>
            )}

            {/* Case 4 */}
            {selectedCase === 4 && (
              <>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    Cazul 4: Refactorizare Cod Duplicat (DRY: Don&apos;t Repeat Yourself)
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
                    {refactorFixed ? 'Comută la Cod Eronat' : 'Aplică Reparația'}
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
                      <div className="pl-8">cout &lt;&lt; &quot;Ambele sunt palindroame!&quot;;</div>
                      <div className="text-purple-400">&#125;</div>
                    </div>
                  ) : (
                    <div className="text-rose-300 space-y-1">
                      <div className="text-slate-500">// Cod duplicat de 2 ori în main():</div>
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
                  Compilează &amp; Testează Cazul 4
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
              <span>Consolă de Diagnosticare Compilator</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs space-y-2 min-h-[140px]">
              {debuggerLog.length === 0 ? (
                <div className="text-slate-500 italic">
                  Selectează un caz, comută reparația și apasă pe butonul de compilare pentru a inspecta avertismentele.
                </div>
              ) : (
                debuggerLog.map((log, idx) => (
                  <div
                    key={idx}
                    className={
                      log.startsWith('[REPARAT]') || log.startsWith('[REFACTORIZAT')
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
              <div className="font-semibold text-slate-300">Regula de aur a depanării:</div>
              <p>
                Dacă o funcție nu modifică o variabilă transmisă din <code>main</code>, primul lucru verificat este prezența caracterului <code>&amp;</code> în antet!
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
                ? 'Clinica de Depanare Finalizată cu Succes!'
                : `Cerințe: Rezolvă toate cele 4 cazuri clinice (${totalSolved}/4 finalizate).`}
            </div>
            <div className="text-xs text-slate-400">
              Recompensă: +150 puncte XP și deblocarea Evaluării Sumative Finale a Unității 3.
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
          <span>Continuă spre Examenul Final (Nivelul 7)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
