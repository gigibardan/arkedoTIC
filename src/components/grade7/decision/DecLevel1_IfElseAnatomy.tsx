import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  GitFork,
  Lightbulb,
  Check
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  onPass: (score: number) => void;
}

interface StepQuestion {
  id: string;
  scenarioRo: string;
  scenarioEn: string;
  conditionText: string;
  variableVal: number;
  threshold: number;
  trueCodeRo: string;
  trueCodeEn: string;
  falseCodeRo: string;
  falseCodeEn: string;
  correctBranch: 'true' | 'false';
  explanationRo: string;
  explanationEn: string;
}

const STEP_QUESTIONS: StepQuestion[] = [
  {
    id: 's1',
    scenarioRo: 'Verificare bilet intrare la Muzeul Științei pentru elevi sub 14 ani.',
    scenarioEn: 'Science Museum ticket discount check for students under 14.',
    conditionText: 'varsta < 14',
    variableVal: 12,
    threshold: 14,
    trueCodeRo: 'cout << "Bilet redus elev: 10 lei";',
    trueCodeEn: 'cout << "Discount student ticket: $10";',
    falseCodeRo: 'cout << "Bilet standard: 20 lei";',
    falseCodeEn: 'cout << "Standard ticket: $20";',
    correctBranch: 'true',
    explanationRo: '12 < 14 este o propoziție ADEVĂRATĂ (true). Procesorul execută exclusiv blocul de instrucțiuni de pe ramura if și ignoră complet blocul else.',
    explanationEn: '12 < 14 is a TRUE proposition. The CPU executes only the instructions on the if branch and skips else entirely.'
  },
  {
    id: 's2',
    scenarioRo: 'Alertă senzor de îngheț seră hidroponică.',
    scenarioEn: 'Hydroponic greenhouse freeze sensor alert.',
    conditionText: 'temperatura <= 0',
    variableVal: 4,
    threshold: 0,
    trueCodeRo: 'cout << "Pornire încălzire automată!";',
    trueCodeEn: 'cout << "Engaging automatic heating!";',
    falseCodeRo: 'cout << "Temperatură optimă, stare normală.";',
    falseCodeEn: 'cout << "Optimal temperature, normal status.";',
    correctBranch: 'false',
    explanationRo: '4 <= 0 este FALS (false). Condiția nu este îndeplinită, așadar procesorul sare peste instrucțiunea din if și execută ramura else.',
    explanationEn: '4 <= 0 is FALSE. The condition is not satisfied, so the processor jumps over the if body and executes the else branch.'
  },
  {
    id: 's3',
    scenarioRo: 'Validare parolă PIN utilizator robot Arky.',
    scenarioEn: 'User PIN password validation for Arky robot.',
    conditionText: 'pin_introdus == 2026',
    variableVal: 2026,
    threshold: 2026,
    trueCodeRo: 'cout << "Acces autorizat! Sistem deblocat.";',
    trueCodeEn: 'cout << "Access granted! System unlocked.";',
    falseCodeRo: 'cout << "PIN greșit! Alarmă securitate!";',
    falseCodeEn: 'cout << "Wrong PIN! Security alarm!";',
    correctBranch: 'true',
    explanationRo: '2026 == 2026 este ADEVĂRAT. Operatorul relațional == testează egalitatea matematică. Se va executa ramura ADEVĂRAT.',
    explanationEn: '2026 == 2026 is TRUE. Relational operator == checks mathematical equality. The TRUE branch executes.'
  },
  {
    id: 's4',
    scenarioRo: 'Verificare credit joc arcade (minim 50 jetoane necesare).',
    scenarioEn: 'Arcade game token check (minimum 50 tokens required).',
    conditionText: 'credite >= 50',
    variableVal: 35,
    threshold: 50,
    trueCodeRo: 'cout << "Jocul începe! Mult succes!";',
    trueCodeEn: 'cout << "Game starts! Good luck!";',
    falseCodeRo: 'cout << "Credite insuficiente. Introdu fise!";',
    falseCodeEn: 'cout << "Insufficient credits. Insert coins!";',
    correctBranch: 'false',
    explanationRo: '35 >= 50 este FALS. Se va afișa mesajul de pe ramura else ("Credite insuficiente").',
    explanationEn: '35 >= 50 is FALSE. The else message is printed ("Insufficient credits").'
  }
];

export const DecLevel1_IfElseAnatomy: React.FC<Props> = ({ onPass }) => {
  const { lang } = useLanguage();
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
        text: lang === 'ro' ? `Corect! ${currentQ.explanationRo}` : `Correct! ${currentQ.explanationEn}`
      });
    } else {
      sounds.playError();
      setFeedback({
        isCorrect: false,
        text: lang === 'ro'
          ? `Incorect. Evaluează condiția matematic: ${currentQ.conditionText.replace(/[a-zA-Z_]+/g, currentQ.variableVal.toString())}. Verifică dacă propoziția este adevărată sau falsă!`
          : `Incorrect. Evaluate the condition mathematically: ${currentQ.conditionText.replace(/[a-zA-Z_]+/g, currentQ.variableVal.toString())}. Check if it is true or false!`
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
              {lang === 'ro' ? 'Nivelul 1 din 7 • Modulul 4C' : 'Level 1 of 7 • Module 4C'}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {lang === 'ro' ? 'Manual Art Klett pag. 77–78' : 'Art Klett Textbook pp. 77–78'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center gap-2.5">
            <GitFork className="w-6 h-6 text-amber-400" />
            <span>
              {lang === 'ro'
                ? 'Anatomia Instrucțiunii if / else & Schema Logică'
                : 'Anatomy of if / else & The Flowchart'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            {lang === 'ro'
              ? 'Descoperă cum iau decizii calculatoarele! Structura de decizie permite ramificarea fluxului de execuție al algoritmului în funcție de adevărul sau falsitatea unei condiții.'
              : 'Discover how computers make decisions! The decision structure branches algorithm execution flow based on whether a condition evaluates to true or false.'}
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400">
            {lang === 'ro' ? 'Scor Nivel 1:' : 'Level 1 Score:'}
          </span>
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
                {lang === 'ro'
                  ? 'Simulator Interactiv: Schema Logică (Flowchart) în Timp Real'
                  : 'Interactive Simulator: Real-Time Decision Flowchart'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'ro'
                  ? 'Modifică valoarea variabilei varsta și urmărește traseul curentului logic!'
                  : 'Change the value of variable varsta and trace the flow of execution!'}
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
            <span>
              {showTheoryTips
                ? (lang === 'ro' ? 'Ascunde Sintaxa C++' : 'Hide C++ Syntax')
                : (lang === 'ro' ? 'Vezi Sintaxa C++' : 'View C++ Syntax')}
            </span>
          </button>
        </div>

        {/* Collapsible Theory Syntax Box */}
        {showTheoryTips && (
          <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 mb-6 font-mono text-xs text-slate-300 space-y-2 animate-fadeIn">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />{' '}
              {lang === 'ro' ? 'Sintaxa Standard în Limbajul C++:' : 'Standard C++ Syntax:'}
            </div>
            <pre className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-teal-300 overflow-x-auto text-[11px] sm:text-xs">
{lang === 'ro' ? `if (conditie) {
    // Ramura ADEVĂRAT (true): se execută când condiția este satisfăcută
    cout << "Conditie indeplinita!";
} else {
    // Ramura FALS (false): se execută când condiția NU este satisfăcută
    cout << "Conditie neindeplinita!";
}` : `if (condition) {
    // TRUE branch: executes when condition evaluates to true
    cout << "Condition met!";
} else {
    // FALSE branch: executes when condition evaluates to false
    cout << "Condition not met!";
}`}
            </pre>
            <div className="text-[11px] text-slate-400 leading-relaxed">
              {lang === 'ro' ? (
                <>💡 <strong>Regula de Aur:</strong> Blocul <code className="text-rose-400 font-bold">else</code> este opțional. Dacă nu există acțiuni de făcut în caz de fals, el se poate omite complet. Acoladele <code className="text-teal-300">{`{ }`}</code> grupează instrucțiunile unui bloc.</>
              ) : (
                <>💡 <strong>Golden Rule:</strong> The <code className="text-rose-400 font-bold">else</code> block is optional. If no actions are needed on false, it can be omitted. Curly braces <code className="text-teal-300">{`{ }`}</code> group compound statements.</>
              )}
            </div>
          </div>
        )}

        {/* Visual Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Controls & Variable Slider */}
          <div className="lg:col-span-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col gap-4">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              {lang === 'ro' ? 'Variabilă de Test:' : 'Test Variable:'}
            </span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono text-slate-400">int varsta =</span>
              <span className="text-2xl font-black font-mono text-amber-400 bg-slate-900 px-3 py-1 rounded-xl border border-amber-500/40">
                {interactiveVar} {lang === 'ro' ? 'ani' : 'yrs'}
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
              <span>5 {lang === 'ro' ? 'ani (minor)' : 'yrs (minor)'}</span>
              <span>18 {lang === 'ro' ? 'ani (prag majorat)' : 'yrs (adult threshold)'}</span>
              <span>30 {lang === 'ro' ? 'ani' : 'yrs'}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <div className="text-slate-400 text-[11px]">{lang === 'ro' ? 'Condiție evaluată:' : 'Evaluated condition:'}</div>
              <div className="font-mono font-bold text-sm text-white mt-0.5">
                varsta &gt;= 18 &rarr;{' '}
                <span className={simConditionIsTrue ? 'text-emerald-400' : 'text-rose-400'}>
                  {interactiveVar} &gt;= 18 {lang === 'ro'
                    ? (simConditionIsTrue ? 'este ADEVĂRAT (true / 1)' : 'este FALS (false / 0)')
                    : (simConditionIsTrue ? 'is TRUE (true / 1)' : 'is FALSE (false / 0)')}
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
                {lang === 'ro' ? '◆ Bloc de Decizie (Condiție)' : '◆ Decision Block (Condition)'}
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
                  {lang === 'ro' ? 'DA (Adevărat)' : 'YES (True)'}
                </div>
                <div className={`w-0.5 h-4 ${simConditionIsTrue ? 'bg-emerald-500' : 'bg-slate-800'}`}></div>
                <div className={`w-full p-3 rounded-xl border text-xs font-mono transition-all duration-300 ${
                  simConditionIsTrue
                    ? 'bg-emerald-900/50 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50 scale-105'
                    : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-40'
                }`}>
                  <div className="font-bold text-[11px] text-emerald-400 mb-0.5">
                    {lang === 'ro' ? '// Ramura if' : '// if branch'}
                  </div>
                  cout &lt;&lt; &quot;{lang === 'ro' ? 'Persoana majora!' : 'Adult person!'}&quot;;
                </div>
              </div>

              {/* False Branch */}
              <div className="flex flex-col items-center">
                <div className={`text-xs font-mono font-bold mb-1 px-2.5 py-0.5 rounded-full border transition-all ${
                  !simConditionIsTrue
                    ? 'bg-rose-500 text-slate-950 border-rose-400 shadow-md animate-pulse'
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}>
                  {lang === 'ro' ? 'NU (Fals)' : 'NO (False)'}
                </div>
                <div className={`w-0.5 h-4 ${!simConditionIsTrue ? 'bg-rose-500' : 'bg-slate-800'}`}></div>
                <div className={`w-full p-3 rounded-xl border text-xs font-mono transition-all duration-300 ${
                  !simConditionIsTrue
                    ? 'bg-rose-900/50 border-rose-500 text-rose-200 ring-2 ring-rose-500/50 scale-105'
                    : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-40'
                }`}>
                  <div className="font-bold text-[11px] text-rose-400 mb-0.5">
                    {lang === 'ro' ? '// Ramura else' : '// else branch'}
                  </div>
                  cout &lt;&lt; &quot;{lang === 'ro' ? 'Persoana minora!' : 'Minor person!'}&quot;;
                </div>
              </div>
            </div>

            {/* Junction & Continuation */}
            <div className="w-full max-w-xs mt-4 pt-3 border-t border-slate-800 text-center">
              <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                {lang === 'ro'
                  ? 'Fluxul se reunifică → instrucțiunile următoare din program'
                  : 'Flow merges → subsequent program statements'}
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
                {lang === 'ro' ? `Misiunea ${currentIdx + 1} din ${STEP_QUESTIONS.length}: ${currentQ.scenarioRo}` : `Mission ${currentIdx + 1} of ${STEP_QUESTIONS.length}: ${currentQ.scenarioEn}`}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {lang === 'ro'
                ? `Întrebarea ${currentIdx + 1}/${STEP_QUESTIONS.length}`
                : `Question ${currentIdx + 1}/${STEP_QUESTIONS.length}`}
            </span>
          </div>

          {/* C++ Code Snippet Box */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs sm:text-sm">
            <div className="text-slate-500 text-[11px] mb-2">
              {lang === 'ro' ? '// Fragment de cod C++ analizat:' : '// Analyzed C++ code snippet:'}
            </div>
            <div className="text-slate-300 leading-relaxed">
              <div className="text-cyan-400">
                {currentQ.conditionText.split(' ')[0]} = <span className="text-amber-400 font-bold">{currentQ.variableVal}</span>;
              </div>
              <div className="mt-2 text-white">
                <span className="text-rose-400 font-bold">if</span> (
                <span className="text-amber-300 font-bold">{currentQ.conditionText}</span>) {'{'}
              </div>
              <div className="pl-6 text-emerald-400 font-bold">
                {lang === 'ro' ? currentQ.trueCodeRo : currentQ.trueCodeEn}
              </div>
              <div className="text-white">
                {'}'} <span className="text-rose-400 font-bold">else</span> {'{'}
              </div>
              <div className="pl-6 text-rose-300 font-bold">
                {lang === 'ro' ? currentQ.falseCodeRo : currentQ.falseCodeEn}
              </div>
              <div className="text-white">{'}'}</div>
            </div>
          </div>

          {/* Question Prompt */}
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30">
            <h4 className="text-sm font-bold text-amber-300 mb-1">
              {lang === 'ro'
                ? 'Ce ramură va fi executată de procesor pentru valoarea curentă?'
                : 'Which branch will be executed by the CPU for the current value?'}
            </h4>
            <p className="text-xs text-slate-300">
              {lang === 'ro' ? (
                <>Calculează dacă propoziția logică <code className="text-amber-400 font-mono font-bold">({currentQ.conditionText.replace(/[a-zA-Z_]+/g, currentQ.variableVal.toString())})</code> este Adevărată sau Falsă.</>
              ) : (
                <>Determine whether logical condition <code className="text-amber-400 font-mono font-bold">({currentQ.conditionText.replace(/[a-zA-Z_]+/g, currentQ.variableVal.toString())})</code> evaluates to True or False.</>
              )}
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
                  <Check className="w-4 h-4" /> {lang === 'ro' ? 'RAMURA ADEVĂRAT (if)' : 'TRUE BRANCH (if)'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">conditie == true</span>
              </div>
              <div className="text-xs text-slate-300 mt-1">
                {lang === 'ro' ? 'Execută: ' : 'Executes: '}
                <code className="text-emerald-300">{lang === 'ro' ? currentQ.trueCodeRo : currentQ.trueCodeEn}</code>
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
                  <AlertTriangle className="w-4 h-4" /> {lang === 'ro' ? 'RAMURA FALS (else)' : 'FALSE BRANCH (else)'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">conditie == false</span>
              </div>
              <div className="text-xs text-slate-300 mt-1">
                {lang === 'ro' ? 'Execută: ' : 'Executes: '}
                <code className="text-rose-300">{lang === 'ro' ? currentQ.falseCodeRo : currentQ.falseCodeEn}</code>
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
                <span>{lang === 'ro' ? 'Următoarea Decizie' : 'Next Decision'}</span>
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
              {lang === 'ro' ? 'Nivelul 1 Finalizat cu Succes!' : 'Level 1 Completed Successfully!'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
              {lang === 'ro' ? (
                <>Ai înțeles perfect structura alternativă, cum se evaluează o condiție logică și cum se separă fluxul pe ramurile <code className="text-emerald-400">if</code> și <code className="text-rose-400">else</code>!</>
              ) : (
                <>You completely mastered the decision structure, boolean evaluation, and branch separation between <code className="text-emerald-400">if</code> and <code className="text-rose-400">else</code>!</>
              )}
            </p>
          </div>

          <div className="bg-slate-950/80 px-6 py-2.5 rounded-2xl border border-slate-800 text-amber-400 font-mono font-bold text-sm">
            {lang === 'ro' ? `Scor obținut: +${score} XP` : `Earned Score: +${score} XP`}
          </div>

          <button
            type="button"
            onClick={handleFinishLevel}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>
              {lang === 'ro'
                ? 'Treci la Nivelul 2: Capcana = vs == & Operatori Relaționali'
                : 'Advance to Level 2: The = vs == Trap & Relational Operators'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
