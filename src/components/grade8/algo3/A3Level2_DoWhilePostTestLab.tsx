import React, { useState } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Play,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  HelpCircle,
  ShieldCheck,
  Check
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface A3Level2Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A3Level2_DoWhilePostTestLab: React.FC<A3Level2Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();

  // Input Validation Simulator
  const [enteredGrade, setEnteredGrade] = useState<number>(12);
  const [historyAttempts, setHistoryAttempts] = useState<{ val: number; valid: boolean }[]>([]);
  const [hasValidatedSuccessfully, setHasValidatedSuccessfully] = useState<boolean>(false);

  // Side-by-side execution on initially false condition (n = 0)
  const [sideComparisonDone, setSideComparisonDone] = useState<boolean>(false);
  const [whileExecutions, setWhileExecutions] = useState<number | null>(null);
  const [doWhileExecutions, setDoWhileExecutions] = useState<number | null>(null);

  // Quiz
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const handleSimulateInput = () => {
    sounds.playClick();
    const isValid = enteredGrade >= 1 && enteredGrade <= 10;
    const newAttempts = [...historyAttempts, { val: enteredGrade, valid: isValid }];
    setHistoryAttempts(newAttempts);

    if (isValid) {
      sounds.playCorrect();
      setHasValidatedSuccessfully(true);
    } else {
      sounds.playWrong();
    }
  };

  const handleRunSideComparison = () => {
    sounds.playClick();
    // Simulate n = 0 with condition (n > 0)
    // In while: 0 executions
    setWhileExecutions(0);
    // In do-while: 1 execution (executes body first, then tests n > 0 -> false)
    setDoWhileExecutions(1);
    setSideComparisonDone(true);
    sounds.playCorrect();
  };

  const isLevelCompleted =
    hasValidatedSuccessfully &&
    sideComparisonDone &&
    q1Answer === 'a' &&
    q2Answer === 'b';

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
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl border border-blue-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-400/30 text-blue-300">
              <RotateCcw className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  {lang === 'ro' ? 'Modulul 3C • Nivelul 2 din 7' : 'Module 3C • Level 2 of 7'}
                </span>
                <span className="text-xs text-blue-300">
                  {lang === 'ro' ? 'Manual Art Klett pag. 72–73' : 'Art Klett Textbook pp. 72–73'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                {lang === 'ro'
                  ? 'Structura Repetitivă cu Test Final: do ... while & Validarea Datelor'
                  : 'Post-Test Repetitive Structure: do ... while & Data Validation'}
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-blue-300 uppercase tracking-wider block">
              {lang === 'ro' ? 'Progres Misiune' : 'Mission Progress'}
            </span>
            <span className="text-lg font-bold text-cyan-300">
              {lang === 'ro' ? 'Nivelul 2: Bucla do-while' : 'Level 2: The do-while Loop'}
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm text-blue-100/90 leading-relaxed max-w-3xl">
          {lang === 'ro'
            ? 'Spre deosebire de while, bucla do ... while (condiție); execută corpul de instrucțiuni cel puțin o dată garantat, verificând condiția abia la final. Este ideală pentru citirea și validarea datelor de la tastatură!'
            : 'Unlike while, the do ... while (condition); construct guarantees execution of its body at least once, evaluating the predicate only at the end. It is the premier paradigm for user input sanitation and keyboard data validation!'}
        </p>
      </div>

      {/* Part 1: Input Validation Simulator */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            {lang === 'ro'
              ? 'Aplicație Practică: Validarea Notei Școlare (Manual pag. 73)'
              : 'Practical Lab: School Grade Validation (Textbook p. 73)'}
          </h3>
          <span className="text-xs text-slate-400 font-mono">do &#123; cin &gt;&gt; nota; &#125; while (nota &lt; 1 || nota &gt; 10);</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-3">
            <div>
              <label className="text-xs text-slate-300 flex justify-between">
                <span>{lang === 'ro' ? 'Introdu o notă de la tastatură:' : 'Enter grade from keyboard:'}</span>
                <span className="font-mono text-cyan-300 font-bold">{enteredGrade}</span>
              </label>
              <div className="flex gap-2 mt-1">
                <input
                  type="number"
                  value={enteredGrade}
                  onChange={(e) => setEnteredGrade(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 font-mono text-cyan-300 text-sm"
                />
                <button
                  onClick={handleSimulateInput}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold whitespace-nowrap"
                >
                  {lang === 'ro' ? 'Trimite (cin >>)' : 'Submit (cin >>)'}
                </button>
              </div>
            </div>

            {/* Quick buttons */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1 font-medium">
                {lang === 'ro' ? 'Exemple rapide de testat:' : 'Quick test values:'}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setEnteredGrade(-3)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-xs border border-slate-700"
                >
                  -3 ({lang === 'ro' ? 'Invalid' : 'Invalid'})
                </button>
                <button
                  onClick={() => setEnteredGrade(15)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-xs border border-slate-700"
                >
                  15 ({lang === 'ro' ? 'Invalid' : 'Invalid'})
                </button>
                <button
                  onClick={() => setEnteredGrade(10)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-xs border border-slate-700"
                >
                  10 ({lang === 'ro' ? 'Valid!' : 'Valid!'})
                </button>
              </div>
            </div>

            <div
              className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                hasValidatedSuccessfully
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>
                {hasValidatedSuccessfully
                  ? (lang === 'ro'
                    ? 'Validare reușită! Bucla do-while s-a oprit deoarece nota este în intervalul [1, 10].'
                    : 'Validation successful! The do-while loop terminated because grade lies in [1, 10].')
                  : (lang === 'ro'
                    ? 'Introdu o notă validă între 1 și 10 pentru a opri bucla de validare.'
                    : 'Input a valid grade between 1 and 10 to conclude the validation loop.')}
              </span>
            </div>
          </div>

          {/* Right: Terminal logs */}
          <div className="lg:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
            <div className="text-slate-500 text-[11px]">
              {lang === 'ro' ? '// Istoric iterații buclă:' : '// Loop iteration history:'}
            </div>
            {historyAttempts.length === 0 ? (
              <span className="text-slate-600 italic">
                {lang === 'ro'
                  ? 'Introdu valori în stânga pentru a simula citirea repetată...'
                  : 'Submit values on the left to simulate repeated input parsing...'}
              </span>
            ) : (
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                {historyAttempts.map((att, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded flex items-center justify-between ${
                      att.valid
                        ? 'bg-emerald-950/70 border border-emerald-500 text-emerald-300'
                        : 'bg-rose-950/60 border border-rose-500/60 text-rose-300'
                    }`}
                  >
                    <span>
                      {lang === 'ro' ? `Iterația #${idx + 1}: nota = ${att.val}` : `Iteration #${idx + 1}: grade = ${att.val}`}
                    </span>
                    <span className="font-sans font-bold text-[11px]">
                      {att.valid
                        ? (lang === 'ro' ? 'ACCEPTAT (Stop Buclă)' : 'ACCEPTED (Loop Terminates)')
                        : (lang === 'ro' ? 'RESPINS (Reia citirea)' : 'REJECTED (Loop Repeats)')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Part 2: Head-to-Head Comparison: while vs do-while */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            {lang === 'ro' ? (
              <>Comparație Directă: Condiție Inițial FALSĂ (<code className="text-amber-300 font-mono">int n = 0;</code>)</>
            ) : (
              <>Side-by-Side Comparison: Initially FALSE Condition (<code className="text-amber-300 font-mono">int n = 0;</code>)</>
            )}
          </h3>
          <button
            onClick={handleRunSideComparison}
            className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            {lang === 'ro' ? 'Execută ambele structuri' : 'Execute both constructs'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* While card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
            <span className="text-cyan-400 font-sans font-bold text-xs block">
              {lang === 'ro' ? '1. Bucla cu Test Inițial (while)' : '1. Pre-Test Loop (while)'}
            </span>
            <div className="text-slate-300 space-y-0.5">
              <div><span className="text-pink-400">int</span> n = <span className="text-amber-300">0</span>;</div>
              <div><span className="text-pink-400">while</span> (n &gt; <span className="text-amber-300">0</span>) &#123;</div>
              <div className="pl-4 text-slate-500">cout &lt;&lt; "Rulat!";</div>
              <div>&#125;</div>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <span className="text-slate-400 font-sans text-[11px] block">
                {lang === 'ro' ? 'Rezultat execuție:' : 'Execution Outcome:'}
              </span>
              <span className="text-cyan-300 font-bold text-sm">
                {whileExecutions !== null
                  ? (lang === 'ro' ? `${whileExecutions} rulări (0 instrucțiuni executate)` : `${whileExecutions} iterations (0 body statements executed)`)
                  : (lang === 'ro' ? 'Neexecutat' : 'Not executed')}
              </span>
            </div>
          </div>

          {/* Do-While card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
            <span className="text-purple-400 font-sans font-bold text-xs block">
              {lang === 'ro' ? '2. Bucla cu Test Final (do ... while)' : '2. Post-Test Loop (do ... while)'}
            </span>
            <div className="text-slate-300 space-y-0.5">
              <div><span className="text-pink-400">int</span> n = <span className="text-amber-300">0</span>;</div>
              <div><span className="text-pink-400">do</span> &#123;</div>
              <div className="pl-4 text-purple-300">cout &lt;&lt; "Rulat!";</div>
              <div>&#125; <span className="text-pink-400">while</span> (n &gt; <span className="text-amber-300">0</span>)<span className="text-amber-400 font-bold">;</span></div>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <span className="text-slate-400 font-sans text-[11px] block">
                {lang === 'ro' ? 'Rezultat execuție:' : 'Execution Outcome:'}
              </span>
              <span className="text-purple-300 font-bold text-sm">
                {doWhileExecutions !== null
                  ? (lang === 'ro' ? `${doWhileExecutions} rulare (executat cel puțin o dată!)` : `${doWhileExecutions} iteration (guaranteed at least once!)`)
                  : (lang === 'ro' ? 'Neexecutat' : 'Not executed')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Quiz */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          {lang === 'ro' ? 'Verificare Regulamentară C++ (Manual pag. 72–73)' : 'C++ Regulatory Check (Textbook pp. 72–73)'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">
              {lang === 'ro' ? 'Întrebarea 1:' : 'Question 1:'}
            </span>
            <p className="text-xs text-slate-300">
              {lang === 'ro' ? (
                <>Ce element de punctuație este <strong>strict obligatoriu</strong> la finalul structurii <code className="text-pink-400 font-mono">do &#123; ... &#125; while (condiție)</code>?</>
              ) : (
                <>Which punctuation token is <strong>strictly mandatory</strong> at the end of a <code className="text-pink-400 font-mono">do &#123; ... &#125; while (condition)</code> construct?</>
              )}
            </p>
            <div className="space-y-1.5">
              {[
                {
                  id: 'a',
                  labelRo: 'Punctul și virgula (;) imediat după paranteza închisă a condiției',
                  labelEn: 'A semicolon (;) directly following the closing parenthesis of the condition'
                },
                {
                  id: 'b',
                  labelRo: 'Semnul întrebării (?)',
                  labelEn: 'A question mark (?)'
                },
                {
                  id: 'c',
                  labelRo: 'Nu se pune nimic',
                  labelEn: 'No punctuation token is required'
                }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setQ1Answer(opt.id);
                    if (opt.id === 'a') sounds.playCorrect();
                    else sounds.playWrong();
                  }}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                    q1Answer === opt.id
                      ? opt.id === 'a'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                  {q1Answer === opt.id && opt.id === 'a' && <Check className="w-4 h-4 text-emerald-400" />}
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
                <>Care este diferența esențială între <code className="text-cyan-300 font-mono">while</code> și <code className="text-purple-300 font-mono">do ... while</code>?</>
              ) : (
                <>What is the core distinction between <code className="text-cyan-300 font-mono">while</code> and <code className="text-purple-300 font-mono">do ... while</code>?</>
              )}
            </p>
            <div className="space-y-1.5">
              {[
                {
                  id: 'a',
                  labelRo: 'Do-while funcționează doar cu numere negative',
                  labelEn: 'Do-while only functions with negative integers'
                },
                {
                  id: 'b',
                  labelRo: 'Do-while execută corpul buclei cel puțin o dată, pe când while poate să nu îl execute niciodată dacă testul inițial e fals',
                  labelEn: 'Do-while executes the loop body at least once unconditionally, whereas while may execute zero times if the pre-test is false'
                },
                {
                  id: 'c',
                  labelRo: 'While este o instrucțiune interzisă în C++ modern',
                  labelEn: 'While is prohibited in modern C++'
                }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setQ2Answer(opt.id);
                    if (opt.id === 'b') sounds.playCorrect();
                    else sounds.playWrong();
                  }}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                    q2Answer === opt.id
                      ? opt.id === 'b'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                  {q2Answer === opt.id && opt.id === 'b' && <Check className="w-4 h-4 text-emerald-400" />}
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
                ? 'Excelent! Ai explorat validarea datelor cu do-while și diferențele față de while.'
                : 'Excellent! You explored data validation with do-while and contrasted it with while.')
              : (lang === 'ro'
                ? 'Validează cel puțin o notă corectă, rulează comparația directă și rezolvă întrebările.'
                : 'Validate at least one grade, run side-by-side comparison, and answer both questions.')}
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
            <span>{lang === 'ro' ? 'Următorul Nivel: Bucla for & Suma Gauss' : 'Next Level: The for Loop & Gauss Sum'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
