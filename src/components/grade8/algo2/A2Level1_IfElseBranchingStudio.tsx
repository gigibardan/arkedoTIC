import React, { useState } from 'react';
import {
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  HelpCircle,
  Lightbulb,
  Check
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface A2Level1Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A2Level1_IfElseBranchingStudio: React.FC<A2Level1Props> = ({
  onCompletePage,
  onComplete
}) => {
  // Test value for Interactive Simulator
  const [testScore, setTestScore] = useState<number>(75);
  const [hasRunSimulation, setHasRunSimulation] = useState<boolean>(false);
  const [executionPath, setExecutionPath] = useState<'then' | 'else' | null>(null);

  // Curly braces challenge
  const [selectedFix, setSelectedFix] = useState<number | null>(null);
  const [braceFeedback, setBraceFeedback] = useState<string | null>(null);

  // Knowledge check questions
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const handleRunSimulation = () => {
    sounds.playClick();
    if (testScore >= 50) {
      setExecutionPath('then');
    } else {
      setExecutionPath('else');
    }
    setHasRunSimulation(true);
    sounds.playCorrect();
  };

  const handleFixSelect = (optionIdx: number) => {
    setSelectedFix(optionIdx);
    if (optionIdx === 2) {
      sounds.playCorrect();
      setBraceFeedback(
        'Excelent! Fără acolade { }, doar prima instrucțiune aparține ramurii if. Cu acolade, întregul bloc de instrucțiuni se execută condiționat!'
      );
    } else {
      sounds.playWrong();
      setBraceFeedback(
        'Atenție: În C++, dacă ai mai mult de o instrucțiune pe o ramură if sau else, acoladele { } sunt obligatorii. Altfel a doua instrucțiune se execută necondiționat!'
      );
    }
  };

  const isLevelCompleted =
    hasRunSimulation &&
    selectedFix === 2 &&
    q1Answer === 'b' &&
    q2Answer === 'c';

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
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-cyan-900 rounded-2xl p-6 text-white shadow-xl border border-indigo-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-400/30 text-indigo-300">
              <GitBranch className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Modulul 3B • Nivelul 1 din 7
                </span>
                <span className="text-xs text-indigo-300">Manual Art Klett pag. 65–66</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                Structura Alternativă if / else & Blocul de Instrucțiuni
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-indigo-300 uppercase tracking-wider block">Progres Misiune</span>
            <span className="text-lg font-bold text-cyan-300">Nivelul 1: Decizii Simple & Complete</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-indigo-100/90 leading-relaxed max-w-3xl">
          În algoritmi, calculatorul nu execută doar comenzi liniar pas cu pas: el trebuie să ia decizii inteligente!
          Instrucțiunea <code className="bg-indigo-950/70 px-1.5 py-0.5 rounded text-cyan-300 font-mono">if</code> evaluează o expresie logică (adevărat sau fals) și bifurcă fluxul de execuție pe ramura dorită.
        </p>
      </div>

      {/* Grid: Theory & Interactive Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Visual Syntax Guide */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-3">
              <Code2 className="w-4 h-4 text-cyan-400" />
              Sintaxa Canonică în C++
            </h3>

            {/* If Simplu */}
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 mb-3 font-mono text-xs text-slate-300 space-y-1">
              <div className="text-emerald-400 font-bold">// 1. Decizie Simplă (fără else)</div>
              <div><span className="text-pink-400 font-semibold">if</span> (conditie) &#123;</div>
              <div className="pl-4 text-slate-400">// se execută doar dacă e TRUE</div>
              <div>&#125;</div>
            </div>

            {/* If-Else Complet */}
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
              <div className="text-cyan-400 font-bold">// 2. Decizie Completă (if ... else)</div>
              <div><span className="text-pink-400 font-semibold">if</span> (conditie) &#123;</div>
              <div className="pl-4 text-emerald-400">// Ramura THEN: dacă conditie == 1</div>
              <div>&#125; <span className="text-pink-400 font-semibold">else</span> &#123;</div>
              <div className="pl-4 text-amber-400">// Ramura ELSE: dacă conditie == 0</div>
              <div>&#125;</div>
            </div>

            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-200 flex gap-2.5">
              <Lightbulb className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
              <span>
                <strong>Regula de Aur:</strong> Nu pune niciodată punct și virgulă (<code className="bg-amber-950 px-1 rounded text-amber-300 font-mono">;</code>) imediat după paranteza de la <code className="font-mono">if (cond)</code>! Punctul și virgula ar încheia instrucțiunea prematur, iar corpul condiției nu ar mai fi legat de test.
              </span>
            </div>
          </div>
        </div>

        {/* Right column: Interactive Execution Simulator */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Simulator Interactiv: Ramificare în Timp Real
            </h3>
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
              Punctaj de Trecere: 50
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 flex justify-between">
              <span>Introdu Nota Elevului (între 0 și 100):</span>
              <span className="font-mono font-bold text-cyan-400 text-sm">{testScore} puncte</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={testScore}
              onChange={(e) => {
                setTestScore(Number(e.target.value));
                setExecutionPath(null);
              }}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>0 (Repetent)</span>
              <span>49 (Picat la limită)</span>
              <span>50 (Admis)</span>
              <span>100 (Excelent)</span>
            </div>
          </div>

          {/* Virtual Code Trace */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-1.5">
            <div className="text-slate-500">// Fluxul programului la executare:</div>
            <div className="text-slate-300">
              <span className="text-indigo-400">int</span> punctaj = <span className="text-amber-300">{testScore}</span>;
            </div>
            <div className={`p-1.5 rounded transition-colors ${executionPath !== null ? 'bg-slate-800/80 font-bold' : ''}`}>
              <span className="text-pink-400">if</span> (punctaj &gt;= <span className="text-amber-300">50</span>) &#123;
              <span className="ml-2 text-xs text-slate-400 font-normal">
                // Este {testScore} &gt;= 50 ? &rarr;{' '}
                <span className={testScore >= 50 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {testScore >= 50 ? 'ADEVĂRAT (1)' : 'FALS (0)'}
                </span>
              </span>
            </div>
            <div
              className={`pl-6 py-1 rounded transition-colors ${
                executionPath === 'then'
                  ? 'bg-emerald-950/80 text-emerald-300 border-l-4 border-emerald-500'
                  : 'text-slate-500'
              }`}
            >
              cout &lt;&lt; <span className="text-emerald-200">"PROMOVAT! Felicitari!"</span> &lt;&lt; endl;
            </div>
            <div className="text-slate-300">&#125; <span className="text-pink-400">else</span> &#123;</div>
            <div
              className={`pl-6 py-1 rounded transition-colors ${
                executionPath === 'else'
                  ? 'bg-rose-950/80 text-rose-300 border-l-4 border-rose-500'
                  : 'text-slate-500'
              }`}
            >
              cout &lt;&lt; <span className="text-rose-200">"RESPINS! Necesar studiu suplimentar."</span> &lt;&lt; endl;
            </div>
            <div className="text-slate-300">&#125;</div>
          </div>

          <button
            onClick={handleRunSimulation}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            Execută Instrucțiunea if / else în CPU
          </button>

          {hasRunSimulation && executionPath && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
                executionPath === 'then'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>
                <strong>Rezultat Execuție:</strong> Ramura{' '}
                <span className="font-bold uppercase font-mono">{executionPath}</span> a fost executată, afișând mesajul:{' '}
                <em>{executionPath === 'then' ? '"PROMOVAT! Felicitari!"' : '"RESPINS! Necesar studiu suplimentar."'}</em>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Challenge: Trapa Acoladelor (Curly Braces Danger) */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center space-x-2 text-amber-400">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-bold text-sm text-slate-100">
            Capcană Frecventă de Examen: „Instrucțiunea Fantomă fără Acolade”
          </h3>
        </div>

        <p className="text-xs text-slate-300">
          Analizează fragmentul de cod de mai jos. Un elev a vrut ca mesajul „BONUS 10 PUNCTE” să se afișeze doar dacă elevul are media 10, dar a omis acoladele:
        </p>

        <div className="bg-slate-950 p-3 rounded-lg font-mono text-xs border border-slate-800 text-slate-300 space-y-0.5">
          <div><span className="text-pink-400 font-semibold">if</span> (medie == 10)</div>
          <div className="pl-4 text-emerald-300">cout &lt;&lt; "Nota maxima!" &lt;&lt; endl;</div>
          <div className="pl-4 text-rose-400 font-bold">cout &lt;&lt; "Ai primit si un BONUS 10p!" &lt;&lt; endl; // ???</div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">
            Ce se va întâmpla dacă un elev are <code className="text-amber-300">medie = 8</code>?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                id: 0,
                text: 'A. Nu se va afișa absolut nimic pe ecran'
              },
              {
                id: 1,
                text: 'B. Se va produce o eroare de compilare imediată'
              },
              {
                id: 2,
                text: 'C. Se va afișa: „Ai primit si un BONUS 10p!” deoarece fără acolade doar prima linie e condiționată'
              }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleFixSelect(opt.id)}
                className={`p-3 rounded-lg border text-left text-xs transition-all ${
                  selectedFix === opt.id
                    ? opt.id === 2
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="font-medium">{opt.text}</div>
              </button>
            ))}
          </div>
          {braceFeedback && (
            <p
              className={`text-xs p-3 rounded-lg border ${
                selectedFix === 2
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {braceFeedback}
            </p>
          )}
        </div>
      </div>

      {/* Mini Quiz */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          Verificare Rapidă a Cunoștințelor (Manual pag. 65–66)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">Întrebarea 1:</span>
            <p className="text-xs text-slate-300">
              Cum interpretează C++ expresia din <code className="text-pink-400 font-mono">if (cond)</code>?
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', label: 'Doar valoarea exactă 1 este considerată adevărată' },
                { id: 'b', label: 'Orice valoare diferită de 0 este TRUE; 0 este FALSE' },
                { id: 'c', label: 'Doar numerele pozitive sunt considerate TRUE' }
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
              Ce este greșit în secvența: <code className="text-rose-400 font-mono">if (x &gt; 0); cout &lt;&lt; "Pozitiv";</code>?
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', label: 'Cuvântul cheie if trebuia scris cu majuscule IF' },
                { id: 'b', label: 'Instrucțiunea cout nu poate fi precedată de if' },
                { id: 'c', label: 'Punctul și virgula (;) de după paranteză anulează efectul condiției' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setQ2Answer(opt.id);
                    if (opt.id === 'c') sounds.playCorrect();
                    else sounds.playWrong();
                  }}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                    q2Answer === opt.id
                      ? opt.id === 'c'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span>{opt.label}</span>
                  {q2Answer === opt.id && opt.id === 'c' && <Check className="w-4 h-4 text-emerald-400" />}
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
              ? 'Toate cerințele nivelului sunt îndeplinite! Poți continua spre Selecția Multiplă switch-case.'
              : 'Rulează simulatorul de execuție, rezolvă capcana acoladelor și răspunde corect la cele 2 întrebări pentru a finaliza.'}
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
          <span>Următorul Nivel: switch / case</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
