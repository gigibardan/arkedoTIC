import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  GitFork,
  HelpCircle,
  Lightbulb,
  Check,
  RotateCcw,
  Play
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface Props {
  onPass: (score: number) => void;
}

interface StepQuestion {
  id: string;
  scenario: string;
  conditionText: string;
  variableVal: number;
  threshold: number;
  trueCode: string;
  falseCode: string;
  correctBranch: 'true' | 'false';
  explanation: string;
}

const STEP_QUESTIONS: StepQuestion[] = [
  {
    id: 's1',
    scenario: 'Verificare bilet intrare la Muzeul Științei pentru elevi sub 14 ani.',
    conditionText: 'varsta < 14',
    variableVal: 12,
    threshold: 14,
    trueCode: 'cout << "Bilet redus elev: 10 lei";',
    falseCode: 'cout << "Bilet standard: 20 lei";',
    correctBranch: 'true',
    explanation: '12 < 14 este o propoziție ADE VĂRATĂ (true). Procesorul execută exclusiv blocul de instrucțiuni de pe ramura if și ignoră complet blocul else.'
  },
  {
    id: 's2',
    scenario: 'Alertă senzor de îngheț seră hidroponică.',
    conditionText: 'temperatura <= 0',
    variableVal: 4,
    threshold: 0,
    trueCode: 'cout << "Pornire încălzire automată!";',
    falseCode: 'cout << "Temperatură optimă, stare normală.";',
    correctBranch: 'false',
    explanation: '4 <= 0 este FALS (false). Condiția nu este îndeplinită, așadar procesorul sare peste instrucțiunea din if și execută ramura else.'
  },
  {
    id: 's3',
    scenario: 'Validare parolă PIN utilizator robot Arky.',
    conditionText: 'pin_introdus == 2026',
    variableVal: 2026,
    threshold: 2026,
    trueCode: 'cout << "Acces autorizat! Sistem deblocat.";',
    falseCode: 'cout << "PIN greșit! Alarmă securitate!";',
    correctBranch: 'true',
    explanation: '2026 == 2026 este ADE VĂRAT. Operatorul relațional == testează egalitatea matematică. Se va executa ramura ADEVĂRAT.'
  },
  {
    id: 's4',
    scenario: 'Verificare credit joc arcade (minim 50 jetoane necesare).',
    conditionText: 'credite >= 50',
    variableVal: 35,
    threshold: 50,
    trueCode: 'cout << "Jocul începe! Mult succes!";',
    falseCode: 'cout << "Credite insuficiente. Introdu fise!";',
    correctBranch: 'false',
    explanation: '35 >= 50 este FALS. Se va afișa mesajul de pe ramura else ("Credite insuficiente").'
  }
];

export const DecLevel1_IfElseAnatomy: React.FC<Props> = ({ onPass }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState<'true' | 'false' | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [score, setScore] = useState(0);
  const [showTheoryTips, setShowTheoryTips] = useState(false);

  // Flowchart interactive custom simulator
  const [interactiveVar, setInteractiveVar] = useState<number>(15);
  const simConditionIsTrue = interactiveVar >= 18;

  const currentQ = STEP_QUESTIONS[currentIdx];
  const isFinished = currentIdx >= STEP_QUESTIONS.length;

  const handleBranchSelect = (branch: 'true' | 'false') => {
    sounds.playClick();
    setSelectedBranch(branch);

    const isCorrect = branch === currentQ.correctBranch;
    if (isCorrect) {
      sounds.playSuccess();
      setScore(s => s + 25);
      setFeedback({
        isCorrect: true,
        text: `Corect! ${currentQ.explanation}`
      });
    } else {
      sounds.playError();
      setFeedback({
        isCorrect: false,
        text: `Incorect. Evaluează condiția matematic: ${currentQ.conditionText.replace(/[a-zA-Z_]+/g, currentQ.variableVal.toString())}. Verifică dacă propoziția este adevărată sau falsă!`
      });
    }
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    setSelectedBranch(null);
    setFeedback(null);
    setCurrentIdx(i => i + 1);
  };

  const handleFinishLevel = () => {
    sounds.playLevelUp();
    onPass(Math.min(score, 100));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Level Header Banner */}
      <div className="bg-gradient-to-r from-amber-900/60 via-slate-900 to-orange-950/60 p-5 sm:p-6 rounded-3xl border-2 border-amber-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold tracking-wider uppercase">
              Nivelul 1 din 7 • Modulul 4C
            </span>
            <span className="text-xs text-slate-400 font-mono">Manual Art Klett pag. 77–78</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center gap-2.5">
            <GitFork className="w-6 h-6 text-amber-400" />
            <span>Anatomia Instrucțiunii if / else &amp; Schema Logică</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Descoperă cum iau decizii calculatoarele! Structura de decizie permite ramificarea fluxului de execuție al algoritmului în funcție de adevărul sau falsitatea unei condiții.
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400">Scor Nivel 1:</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-amber-400">{score} / 100 XP</span>
        </div>
      </div>

      {/* Interactive Visual Flowchart & Live Execution Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              ⚡
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Simulator Interactiv: Schema Logică (Flowchart) în Timp Real
              </h3>
              <p className="text-xs text-slate-400">
                Modifică valoarea variabilei <code className="text-amber-300">varsta</code> și urmărește traseul curentului logic!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setShowTheoryTips(!showTheoryTips);
            }}
            className="text-xs text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-800/60 cursor-pointer self-start sm:self-auto"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{showTheoryTips ? 'Ascunde Sintaxa C++' : 'Vezi Sintaxa C++'}</span>
          </button>
        </div>

        {/* Collapsible Theory Syntax Box */}
        {showTheoryTips && (
          <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 mb-6 font-mono text-xs text-slate-300 space-y-2 animate-fadeIn">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> Sintaxa Standard în Limbajul C++:
            </div>
            <pre className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-teal-300 overflow-x-auto text-[11px] sm:text-xs">
{`if (conditie) {
    // Ramura ADEVĂRAT (true): se execută când condiția este satisfăcută
    cout << "Conditie indeplinita!";
} else {
    // Ramura FALS (false): se execută când condiția NU este satisfăcută
    cout << "Conditie neindeplinita!";
}`}
            </pre>
            <div className="text-[11px] text-slate-400 leading-relaxed">
              💡 <strong>Regula de Aur:</strong> Blocul <code className="text-rose-400 font-bold">else</code> este opțional. Dacă nu există acțiuni de făcut în caz de fals, el se poate omite complet. Acoladele <code className="text-teal-300">{`{ }`}</code> grupează instrucțiunile unui bloc.
            </div>
          </div>
        )}

        {/* Visual Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Controls & Variable Slider */}
          <div className="lg:col-span-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col gap-4">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Variabilă de Test:
            </span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono text-slate-400">int varsta =</span>
              <span className="text-2xl font-black font-mono text-amber-400 bg-slate-900 px-3 py-1 rounded-xl border border-amber-500/40">
                {interactiveVar} ani
              </span>
            </div>

            <input
              type="range"
              min="5"
              max="30"
              value={interactiveVar}
              onChange={(e) => {
                setInteractiveVar(Number(e.target.value));
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>5 ani (minor)</span>
              <span>18 ani (prag majorat)</span>
              <span>30 ani</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <div className="text-slate-400 text-[11px]">Condiție evaluată:</div>
              <div className="font-mono font-bold text-sm text-white mt-0.5">
                varsta &gt;= 18 &rarr;{' '}
                <span className={simConditionIsTrue ? 'text-emerald-400' : 'text-rose-400'}>
                  {interactiveVar} &gt;= 18 este {simConditionIsTrue ? 'ADEVĂRAT (true / 1)' : 'FALS (false / 0)'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Flowchart Diagram */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center p-3 sm:p-5 bg-slate-950/80 rounded-2xl border border-slate-800 relative overflow-hidden">
            {/* Top: Start / Input */}
            <div className="px-4 py-1.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700 shadow">
              cin &gt;&gt; varsta; ({interactiveVar})
            </div>

            <div className="w-0.5 h-6 bg-slate-700 my-1"></div>

            {/* Decision Diamond */}
            <div className={`p-4 rounded-2xl border-2 transition-all duration-300 shadow-lg text-center max-w-xs ${
              simConditionIsTrue
                ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-rose-950/40 border-rose-500 text-white shadow-rose-500/20'
            }`}>
              <div className="text-[10px] font-mono uppercase font-bold text-slate-400 mb-0.5">
                ◆ Bloc de Decizie (Condiție)
              </div>
              <div className="text-base sm:text-lg font-black font-mono">
                varsta &gt;= 18 ?
              </div>
            </div>

            {/* Branches Left (True) and Right (False) */}
            <div className="w-full max-w-md grid grid-cols-2 gap-4 sm:gap-8 mt-3">
              {/* True Branch */}
              <div className="flex flex-col items-center">
                <div className={`text-xs font-mono font-bold mb-1 px-2.5 py-0.5 rounded-full border transition-all ${
                  simConditionIsTrue
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md animate-pulse'
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}>
                  DA (Adevărat)
                </div>
                <div className={`w-0.5 h-4 ${simConditionIsTrue ? 'bg-emerald-500' : 'bg-slate-800'}`}></div>
                <div className={`w-full p-3 rounded-xl border text-xs font-mono transition-all duration-300 ${
                  simConditionIsTrue
                    ? 'bg-emerald-900/50 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50 scale-105'
                    : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-40'
                }`}>
                  <div className="font-bold text-[11px] text-emerald-400 mb-0.5">// Ramura if</div>
                  cout &lt;&lt; &quot;Persoana majora!&quot;;
                </div>
              </div>

              {/* False Branch */}
              <div className="flex flex-col items-center">
                <div className={`text-xs font-mono font-bold mb-1 px-2.5 py-0.5 rounded-full border transition-all ${
                  !simConditionIsTrue
                    ? 'bg-rose-500 text-slate-950 border-rose-400 shadow-md animate-pulse'
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}>
                  NU (Fals)
                </div>
                <div className={`w-0.5 h-4 ${!simConditionIsTrue ? 'bg-rose-500' : 'bg-slate-800'}`}></div>
                <div className={`w-full p-3 rounded-xl border text-xs font-mono transition-all duration-300 ${
                  !simConditionIsTrue
                    ? 'bg-rose-900/50 border-rose-500 text-rose-200 ring-2 ring-rose-500/50 scale-105'
                    : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-40'
                }`}>
                  <div className="font-bold text-[11px] text-rose-400 mb-0.5">// Ramura else</div>
                  cout &lt;&lt; &quot;Persoana minora!&quot;;
                </div>
              </div>
            </div>

            {/* Junction & Continuation */}
            <div className="w-full max-w-xs mt-4 pt-3 border-t border-slate-800 text-center">
              <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                Fluxul se reunifică &rarr; instrucțiunile următoare din program
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Guided Challenge Section */}
      {!isFinished ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                {currentIdx + 1}
              </span>
              <h3 className="text-base font-bold text-white">
                Misiunea {currentIdx + 1} din {STEP_QUESTIONS.length}: {currentQ.scenario}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Întrebarea {currentIdx + 1}/{STEP_QUESTIONS.length}
            </span>
          </div>

          {/* C++ Code Snippet Box */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs sm:text-sm">
            <div className="text-slate-500 text-[11px] mb-2">// Fragment de cod C++ analizat:</div>
            <div className="text-slate-300 leading-relaxed">
              <div className="text-cyan-400">
                {currentQ.conditionText.split(' ')[0]} = <span className="text-amber-400 font-bold">{currentQ.variableVal}</span>;
              </div>
              <div className="mt-2 text-white">
                <span className="text-rose-400 font-bold">if</span> (
                <span className="text-amber-300 font-bold">{currentQ.conditionText}</span>) {'{'}
              </div>
              <div className="pl-6 text-emerald-400 font-bold">
                {currentQ.trueCode}
              </div>
              <div className="text-white">
                {'}'} <span className="text-rose-400 font-bold">else</span> {'{'}
              </div>
              <div className="pl-6 text-rose-300 font-bold">
                {currentQ.falseCode}
              </div>
              <div className="text-white">{'}'}</div>
            </div>
          </div>

          {/* Question Prompt */}
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30">
            <h4 className="text-sm font-bold text-amber-300 mb-1">
              Ce ramură va fi executată de procesor pentru valoarea curentă?
            </h4>
            <p className="text-xs text-slate-300">
              Calculează dacă propoziția logică <code className="text-amber-400 font-mono font-bold">({currentQ.conditionText.replace(/[a-zA-Z_]+/g, currentQ.variableVal.toString())})</code> este Adevărată sau Falsă.
            </p>
          </div>

          {/* Selection Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              disabled={selectedBranch !== null}
              onClick={() => handleBranchSelect('true')}
              className={`p-4 rounded-2xl border-2 text-left font-mono transition flex flex-col gap-1 cursor-pointer ${
                selectedBranch === 'true'
                  ? currentQ.correctBranch === 'true'
                    ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-rose-950/80 border-rose-500 text-white'
                  : selectedBranch !== null && currentQ.correctBranch === 'true'
                  ? 'bg-emerald-950/40 border-emerald-500/60 text-white opacity-80'
                  : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 hover:border-emerald-500/60 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> RAMURA ADE VĂRAT (if)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">conditie == true</span>
              </div>
              <div className="text-xs text-slate-300 mt-1">
                Execută: <code className="text-emerald-300">{currentQ.trueCode}</code>
              </div>
            </button>

            <button
              type="button"
              disabled={selectedBranch !== null}
              onClick={() => handleBranchSelect('false')}
              className={`p-4 rounded-2xl border-2 text-left font-mono transition flex flex-col gap-1 cursor-pointer ${
                selectedBranch === 'false'
                  ? currentQ.correctBranch === 'false'
                    ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-rose-950/80 border-rose-500 text-white'
                  : selectedBranch !== null && currentQ.correctBranch === 'false'
                  ? 'bg-emerald-950/40 border-emerald-500/60 text-white opacity-80'
                  : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 hover:border-rose-500/60 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> RAMURA FALS (else)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">conditie == false</span>
              </div>
              <div className="text-xs text-slate-300 mt-1">
                Execută: <code className="text-rose-300">{currentQ.falseCode}</code>
              </div>
            </button>
          </div>

          {/* Feedback & Next Button */}
          {feedback && (
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn ${
              feedback.isCorrect
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                : 'bg-rose-950/60 border-rose-500/60 text-rose-200'
            }`}>
              <div className="flex items-center gap-2.5">
                {feedback.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <span className="text-xs sm:text-sm font-medium leading-relaxed">
                  {feedback.text}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextQuestion}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md"
              >
                <span>Următoarea Decizie</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Finished Level Card */
        <div className="bg-gradient-to-br from-slate-900 to-amber-950/40 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 text-center shadow-2xl flex flex-col items-center gap-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center text-3xl shadow-lg">
            🎉
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
              Nivelul 1 Finalizat cu Succes!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
              Ai înțeles perfect structura alternativă, cum se evaluează o condiție logică și cum se separă fluxul pe ramurile <code className="text-emerald-400">if</code> și <code className="text-rose-400">else</code>!
            </p>
          </div>

          <div className="bg-slate-950/80 px-6 py-2.5 rounded-2xl border border-slate-800 text-amber-400 font-mono font-bold text-sm">
            Scor obținut: +{score} XP
          </div>

          <button
            type="button"
            onClick={handleFinishLevel}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Treci la Nivelul 2: Capcana = vs == &amp; Operatori Relaționali</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
