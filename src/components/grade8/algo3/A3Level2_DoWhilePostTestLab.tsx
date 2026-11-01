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

interface A3Level2Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const A3Level2_DoWhilePostTestLab: React.FC<A3Level2Props> = ({
  onCompletePage,
  onComplete
}) => {
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
                  Modulul 3C • Nivelul 2 din 7
                </span>
                <span className="text-xs text-blue-300">Manual Art Klett pag. 72–73</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                Structura Repetitivă cu Test Final: do ... while & Validarea Datelor
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-blue-300 uppercase tracking-wider block">Progres Misiune</span>
            <span className="text-lg font-bold text-cyan-300">Nivelul 2: Bucla do-while</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-blue-100/90 leading-relaxed max-w-3xl">
          Spre deosebire de <code className="bg-blue-950 px-1 rounded text-cyan-300 font-mono">while</code>, bucla <code className="bg-blue-950 px-1 rounded text-cyan-300 font-mono">do ... while (condiție);</code> execută corpul de instrucțiuni <strong>cel puțin o dată garantat</strong>, verificând condiția abia la final. Este ideală pentru citirea și validarea datelor de la tastatură!
        </p>
      </div>

      {/* Part 1: Input Validation Simulator */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Aplicație Practică: Validarea Notei Școlare (Manual pag. 73)
          </h3>
          <span className="text-xs text-slate-400 font-mono">do &#123; cin &gt;&gt; nota; &#125; while (nota &lt; 1 || nota &gt; 10);</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-3">
            <div>
              <label className="text-xs text-slate-300 flex justify-between">
                <span>Introdu o notă de la tastatură:</span>
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
                  Trimite (cin &gt;&gt;)
                </button>
              </div>
            </div>

            {/* Quick buttons */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1 font-medium">Exemple rapide de testat:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setEnteredGrade(-3)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-xs border border-slate-700"
                >
                  -3 (Invalid)
                </button>
                <button
                  onClick={() => setEnteredGrade(15)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-xs border border-slate-700"
                >
                  15 (Invalid)
                </button>
                <button
                  onClick={() => setEnteredGrade(10)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-xs border border-slate-700"
                >
                  10 (Valid!)
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
                  ? 'Validare reușită! Bucla do-while s-a oprit deoarece nota este în intervalul [1, 10].'
                  : 'Introdu o notă validă între 1 și 10 pentru a opri bucla de validare.'}
              </span>
            </div>
          </div>

          {/* Right: Terminal logs */}
          <div className="lg:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
            <div className="text-slate-500 text-[11px]">// Istoric iterații buclă:</div>
            {historyAttempts.length === 0 ? (
              <span className="text-slate-600 italic">Introdu valori în stânga pentru a simula citirea repetată...</span>
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
                      Iterația #{idx + 1}: nota = {att.val}
                    </span>
                    <span className="font-sans font-bold text-[11px]">
                      {att.valid ? 'ACCEPTAT (Stop Buclă)' : 'RESPINS (Reia citirea)'}
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
            Comparație Directă: Condiție Inițial FALSĂ (<code className="text-amber-300 font-mono">int n = 0;</code>)
          </h3>
          <button
            onClick={handleRunSideComparison}
            className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            Execută ambele structuri
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* While card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
            <span className="text-cyan-400 font-sans font-bold text-xs block">1. Bucla cu Test Inițial (while)</span>
            <div className="text-slate-300 space-y-0.5">
              <div><span className="text-pink-400">int</span> n = <span className="text-amber-300">0</span>;</div>
              <div><span className="text-pink-400">while</span> (n &gt; <span className="text-amber-300">0</span>) &#123;</div>
              <div className="pl-4 text-slate-500">cout &lt;&lt; "Rulat!";</div>
              <div>&#125;</div>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <span className="text-slate-400 font-sans text-[11px] block">Rezultat execuție:</span>
              <span className="text-cyan-300 font-bold text-sm">
                {whileExecutions !== null ? `${whileExecutions} rulări (0 instrucțiuni executate)` : 'Neexecutat'}
              </span>
            </div>
          </div>

          {/* Do-While card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
            <span className="text-purple-400 font-sans font-bold text-xs block">2. Bucla cu Test Final (do ... while)</span>
            <div className="text-slate-300 space-y-0.5">
              <div><span className="text-pink-400">int</span> n = <span className="text-amber-300">0</span>;</div>
              <div><span className="text-pink-400">do</span> &#123;</div>
              <div className="pl-4 text-purple-300">cout &lt;&lt; "Rulat!";</div>
              <div>&#125; <span className="text-pink-400">while</span> (n &gt; <span className="text-amber-300">0</span>)<span className="text-amber-400 font-bold">;</span></div>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <span className="text-slate-400 font-sans text-[11px] block">Rezultat execuție:</span>
              <span className="text-purple-300 font-bold text-sm">
                {doWhileExecutions !== null ? `${doWhileExecutions} rulare (executat cel puțin o dată!)` : 'Neexecutat'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Quiz */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          Verificare Regulamentară C++ (Manual pag. 72–73)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">Întrebarea 1:</span>
            <p className="text-xs text-slate-300">
              Ce element de punctuație este <strong>strict obligatoriu</strong> la finalul structurii <code className="text-pink-400 font-mono">do &#123; ... &#125; while (condiție)</code>?
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', label: 'Punctul și virgula (;) imediat după paranteza închisă a condiției' },
                { id: 'b', label: 'Semnul întrebării (?)' },
                { id: 'c', label: 'Nu se pune nimic' }
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
                  <span>{opt.label}</span>
                  {q1Answer === opt.id && opt.id === 'a' && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2 */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-cyan-300">Întrebarea 2:</span>
            <p className="text-xs text-slate-300">
              Care este diferența esențială între <code className="text-cyan-300 font-mono">while</code> și <code className="text-purple-300 font-mono">do ... while</code>?
            </p>
            <div className="space-y-1.5">
              {[
                { id: 'a', label: 'Do-while funcționează doar cu numere negative' },
                { id: 'b', label: 'Do-while execută corpul buclei cel puțin o dată, pe când while poate să nu îl execute niciodată dacă testul inițial e fals' },
                { id: 'c', label: 'While este o instrucțiune interzisă în C++ modern' }
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
                  <span>{opt.label}</span>
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
              ? 'Excelent! Ai explorat validarea datelor cu do-while și diferențele față de while.'
              : 'Validează cel puțin o notă corectă, rulează comparația directă și rezolvă întrebările.'}
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
          <span>Următorul Nivel: Bucla for & Suma Gauss</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
