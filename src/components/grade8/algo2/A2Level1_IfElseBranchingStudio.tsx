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
import { useLanguage } from '../../../context/LanguageContext';

interface A2Level1Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A2Level1_IfElseBranchingStudio: React.FC<A2Level1Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();

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
        lang === 'ro'
          ? 'Excelent! Fără acolade { }, doar prima instrucțiune aparține ramurii if. Cu acolade, întregul bloc de instrucțiuni se execută condiționat!'
          : 'Excellent! Without braces { }, only the immediately following statement belongs to if. With braces, the entire block executes conditionally!'
      );
    } else {
      sounds.playWrong();
      setBraceFeedback(
        lang === 'ro'
          ? 'Atenție: În C++, dacă ai mai mult de o instrucțiune pe o ramură if sau else, acoladele { } sunt obligatorii. Altfel a doua instrucțiune se execută necondiționat!'
          : 'Warning: In C++, if a branch holds more than one statement, curly braces { } are mandatory. Otherwise the subsequent statement executes unconditionally!'
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
                  {lang === 'ro' ? 'Modulul 3B • Nivelul 1 din 7' : 'Module 3B • Level 1 of 7'}
                </span>
                <span className="text-xs text-indigo-300">
                  {lang === 'ro' ? 'Manual Art Klett pag. 65–66' : 'Art Klett Textbook pp. 65–66'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                {lang === 'ro'
                  ? 'Structura Alternativă if / else & Blocul de Instrucțiuni'
                  : 'Alternative Decision Structure if / else & Block Scope'}
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-indigo-300 uppercase tracking-wider block">
              {lang === 'ro' ? 'Progres Misiune' : 'Mission Progress'}
            </span>
            <span className="text-lg font-bold text-cyan-300">
              {lang === 'ro' ? 'Nivelul 1: Decizii Simple & Complete' : 'Level 1: Simple & Complete Decisions'}
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm text-indigo-100/90 leading-relaxed max-w-3xl">
          {lang === 'ro'
            ? 'În algoritmi, calculatorul nu execută doar comenzi liniar pas cu pas: el trebuie să ia decizii inteligente! Instrucțiunea if evaluează o expresie logică (adevărat sau fals) și bifurcă fluxul de execuție pe ramura dorită.'
            : 'In algorithms, computers do not solely execute sequential instructions: they must make intelligent branching decisions! The if statement evaluates a boolean expression (true or false) and branches execution along the desired path.'}
        </p>
      </div>

      {/* Grid: Theory & Interactive Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Visual Syntax Guide */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-3">
              <Code2 className="w-4 h-4 text-cyan-400" />
              {lang === 'ro' ? 'Sintaxa Canonică în C++' : 'Canonical C++ Syntax'}
            </h3>

            {/* If Simplu */}
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 mb-3 font-mono text-xs text-slate-300 space-y-1">
              <div className="text-emerald-400 font-bold">
                {lang === 'ro' ? '// 1. Decizie Simplă (fără else)' : '// 1. Simple Decision (without else)'}
              </div>
              <div><span className="text-pink-400 font-semibold">if</span> (conditie) &#123;</div>
              <div className="pl-4 text-slate-400">
                {lang === 'ro' ? '// se execută doar dacă e TRUE' : '// executes only if TRUE'}
              </div>
              <div>&#125;</div>
            </div>

            {/* If-Else Complet */}
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
              <div className="text-cyan-400 font-bold">
                {lang === 'ro' ? '// 2. Decizie Completă (if ... else)' : '// 2. Complete Decision (if ... else)'}
              </div>
              <div><span className="text-pink-400 font-semibold">if</span> (conditie) &#123;</div>
              <div className="pl-4 text-emerald-400">
                {lang === 'ro' ? '// Ramura THEN: dacă conditie == 1' : '// THEN branch: if condition == 1'}
              </div>
              <div>&#125; <span className="text-pink-400 font-semibold">else</span> &#123;</div>
              <div className="pl-4 text-amber-400">
                {lang === 'ro' ? '// Ramura ELSE: dacă conditie == 0' : '// ELSE branch: if condition == 0'}
              </div>
              <div>&#125;</div>
            </div>

            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-200 flex gap-2.5">
              <Lightbulb className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
              <span>
                <strong>{lang === 'ro' ? 'Regula de Aur:' : 'Golden Rule:'}</strong>{' '}
                {lang === 'ro'
                  ? 'Nu pune niciodată punct și virgulă (;) imediat după paranteza de la if (cond)! Punctul și virgula ar încheia instrucțiunea prematur, iar corpul condiției nu ar mai fi legat de test.'
                  : 'Never put a semicolon (;) directly after the parentheses of if (cond)! The semicolon terminates the statement prematurely, detaching the intended block from the condition.'}
              </span>
            </div>
          </div>
        </div>

        {/* Right column: Interactive Execution Simulator */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              {lang === 'ro' ? 'Simulator Interactiv: Ramificare în Timp Real' : 'Interactive Lab: Real-Time Branching'}
            </h3>
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
              {lang === 'ro' ? 'Punctaj de Trecere: 50' : 'Passing Threshold: 50'}
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 flex justify-between">
              <span>{lang === 'ro' ? 'Introdu Nota Elevului (între 0 și 100):' : 'Enter Student Score (between 0 and 100):'}</span>
              <span className="font-mono font-bold text-cyan-400 text-sm">
                {testScore} {lang === 'ro' ? 'puncte' : 'pts'}
              </span>
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
              <span>{lang === 'ro' ? '0 (Repetent)' : '0 (Fail)'}</span>
              <span>{lang === 'ro' ? '49 (Picat la limită)' : '49 (Borderline Fail)'}</span>
              <span>{lang === 'ro' ? '50 (Admis)' : '50 (Pass)'}</span>
              <span>{lang === 'ro' ? '100 (Excelent)' : '100 (Top Score)'}</span>
            </div>
          </div>

          {/* Virtual Code Trace */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-1.5">
            <div className="text-slate-500">
              {lang === 'ro' ? '// Fluxul programului la executare:' : '// Runtime program trace:'}
            </div>
            <div className="text-slate-300">
              <span className="text-indigo-400">int</span> punctaj = <span className="text-amber-300">{testScore}</span>;
            </div>
            <div className={`p-1.5 rounded transition-colors ${executionPath !== null ? 'bg-slate-800/80 font-bold' : ''}`}>
              <span className="text-pink-400">if</span> (punctaj &gt;= <span className="text-amber-300">50</span>) &#123;
              <span className="ml-2 text-xs text-slate-400 font-normal">
                {lang === 'ro' ? `// Este ${testScore} >= 50 ? \u2192 ` : `// Is ${testScore} >= 50 ? \u2192 `}
                <span className={testScore >= 50 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {testScore >= 50
                    ? (lang === 'ro' ? 'ADEVĂRAT (1)' : 'TRUE (1)')
                    : (lang === 'ro' ? 'FALS (0)' : 'FALSE (0)')}
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
              cout &lt;&lt; <span className="text-emerald-200">"{lang === 'ro' ? 'PROMOVAT! Felicitari!' : 'PASSED! Congratulations!'}"</span> &lt;&lt; endl;
            </div>
            <div className="text-slate-300">&#125; <span className="text-pink-400">else</span> &#123;</div>
            <div
              className={`pl-6 py-1 rounded transition-colors ${
                executionPath === 'else'
                  ? 'bg-rose-950/80 text-rose-300 border-l-4 border-rose-500'
                  : 'text-slate-500'
              }`}
            >
              cout &lt;&lt; <span className="text-rose-200">"{lang === 'ro' ? 'RESPINS! Necesar studiu suplimentar.' : 'FAILED! Further study needed.'}"</span> &lt;&lt; endl;
            </div>
            <div className="text-slate-300">&#125;</div>
          </div>

          <button
            onClick={handleRunSimulation}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            {lang === 'ro' ? 'Execută Instrucțiunea if / else în CPU' : 'Execute if / else Statement in CPU'}
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
                <strong>{lang === 'ro' ? 'Rezultat Execuție:' : 'Execution Result:'}</strong>{' '}
                {lang === 'ro' ? (
                  <>
                    Ramura <span className="font-bold uppercase font-mono">{executionPath}</span> a fost executată, afișând mesajul:{' '}
                    <em>{executionPath === 'then' ? '"PROMOVAT! Felicitari!"' : '"RESPINS! Necesar studiu suplimentar."'}</em>
                  </>
                ) : (
                  <>
                    Branch <span className="font-bold uppercase font-mono">{executionPath}</span> was executed, outputting:{' '}
                    <em>{executionPath === 'then' ? '"PASSED! Congratulations!"' : '"FAILED! Further study needed."'}</em>
                  </>
                )}
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
            {lang === 'ro'
              ? 'Capcană Frecventă de Examen: „Instrucțiunea Fantomă fără Acolade”'
              : 'Frequent Exam Trap: "Phantom Statement without Curly Braces"'}
          </h3>
        </div>

        <p className="text-xs text-slate-300">
          {lang === 'ro'
            ? 'Analizează fragmentul de cod de mai jos. Un elev a vrut ca mesajul „BONUS 10 PUNCTE” să se afișeze doar dacă elevul are media 10, dar a omis acoladele:'
            : 'Analyze the code snippet below. A student intended for the message "BONUS 10 POINTS" to only print if grade is 10, but omitted curly braces:'}
        </p>

        <div className="bg-slate-950 p-3 rounded-lg font-mono text-xs border border-slate-800 text-slate-300 space-y-0.5">
          <div><span className="text-pink-400 font-semibold">if</span> (medie == 10)</div>
          <div className="pl-4 text-emerald-300">cout &lt;&lt; "Nota maxima!" &lt;&lt; endl;</div>
          <div className="pl-4 text-rose-400 font-bold">cout &lt;&lt; "Ai primit si un BONUS 10p!" &lt;&lt; endl; // ???</div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">
            {lang === 'ro' ? (
              <>Ce se va întâmpla dacă un elev are <code className="text-amber-300">medie = 8</code>?</>
            ) : (
              <>What happens if a student has <code className="text-amber-300">medie = 8</code>?</>
            )}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                id: 0,
                textRo: 'A. Nu se va afișa absolut nimic pe ecran',
                textEn: 'A. Nothing at all prints on the screen'
              },
              {
                id: 1,
                textRo: 'B. Se va produce o eroare de compilare imediată',
                textEn: 'B. An immediate compiler error is triggered'
              },
              {
                id: 2,
                textRo: 'C. Se va afișa: „Ai primit si un BONUS 10p!” deoarece fără acolade doar prima linie e condiționată',
                textEn: 'C. It prints: "Ai primit si un BONUS 10p!" because without braces only the first line is conditional'
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
                <div className="font-medium">{lang === 'ro' ? opt.textRo : opt.textEn}</div>
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
          {lang === 'ro'
            ? 'Verificare Rapidă a Cunoștințelor (Manual pag. 65–66)'
            : 'Quick Knowledge Check (Textbook pp. 65–66)'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">
              {lang === 'ro' ? 'Întrebarea 1:' : 'Question 1:'}
            </span>
            <p className="text-xs text-slate-300">
              {lang === 'ro' ? (
                <>Cum interpretează C++ expresia din <code className="text-pink-400 font-mono">if (cond)</code>?</>
              ) : (
                <>How does C++ evaluate the expression inside <code className="text-pink-400 font-mono">if (cond)</code>?</>
              )}
            </p>
            <div className="space-y-1.5">
              {[
                {
                  id: 'a',
                  labelRo: 'Doar valoarea exactă 1 este considerată adevărată',
                  labelEn: 'Only the exact numeric value 1 is treated as true'
                },
                {
                  id: 'b',
                  labelRo: 'Orice valoare diferită de 0 este TRUE; 0 este FALSE',
                  labelEn: 'Any non-zero value evaluates to TRUE; 0 evaluates to FALSE'
                },
                {
                  id: 'c',
                  labelRo: 'Doar numerele pozitive sunt considerate TRUE',
                  labelEn: 'Only positive numbers are treated as TRUE'
                }
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
                  <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                  {q1Answer === opt.id && opt.id === 'b' && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">
              {lang === 'ro' ? 'Întrebarea 2:' : 'Question 2:'}
            </span>
            <p className="text-xs text-slate-300">
              {lang === 'ro' ? (
                <>Ce este greșit în secvența: <code className="text-rose-400 font-mono">if (x &gt; 0); cout &lt;&lt; "Pozitiv";</code>?</>
              ) : (
                <>What is flawed in the snippet: <code className="text-rose-400 font-mono">if (x &gt; 0); cout &lt;&lt; "Pozitiv";</code>?</>
              )}
            </p>
            <div className="space-y-1.5">
              {[
                {
                  id: 'a',
                  labelRo: 'Cuvântul cheie if trebuia scris cu majuscule IF',
                  labelEn: 'Keyword if must be capitalized as IF'
                },
                {
                  id: 'b',
                  labelRo: 'Instrucțiunea cout nu poate fi precedată de if',
                  labelEn: 'The cout statement cannot follow if'
                },
                {
                  id: 'c',
                  labelRo: 'Punctul și virgula (;) de după paranteză anulează efectul condiției',
                  labelEn: 'The semicolon (;) immediately following parenthesis detaches the condition'
                }
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
                  <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
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
              ? (lang === 'ro'
                ? 'Toate cerințele nivelului sunt îndeplinite! Poți continua spre Selecția Multiplă switch-case.'
                : 'All level requirements fulfilled! You can proceed to switch-case multiway selection.')
              : (lang === 'ro'
                ? 'Rulează simulatorul de execuție, rezolvă capcana acoladelor și răspunde corect la cele 2 întrebări pentru a finaliza.'
                : 'Run execution simulator, solve braces trap, and answer both questions correctly to complete.')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onPrev && (
            <button
              onClick={onPrev}
              className="py-2 px-4 rounded-lg font-medium text-xs bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition"
            >
              {lang === 'ro' ? 'Înapoi' : 'Back'}
            </button>
          )}
          <button
            onClick={handleFinish}
            disabled={!isLevelCompleted}
            className={`py-2 px-5 rounded-lg font-medium text-xs flex items-center gap-2 transition-all ${
              isLevelCompleted
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <span>{lang === 'ro' ? 'Următorul Nivel: switch / case' : 'Next Level: switch / case'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
