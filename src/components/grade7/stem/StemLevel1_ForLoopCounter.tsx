import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Play,
  Lightbulb,
  Check,
  ChevronRight,
  Layers,
  HelpCircle
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  onPass: (score: number) => void;
}

interface StepTrace {
  stepIndex: number;
  i: number;
  conditionMet: boolean;
  sum: number;
  output: string;
}

export const StemLevel1_ForLoopCounter: React.FC<Props> = ({ onPass }) => {
  const { lang } = useLanguage();

  // Interactive Stepper State
  const [targetN, setTargetN] = useState<number>(5);
  const [step, setStep] = useState<number>(0);
  const [currentI, setCurrentI] = useState<number>(1);
  const [currentSum, setCurrentSum] = useState<number>(0);
  const [traceHistory, setTraceHistory] = useState<StepTrace[]>([]);
  const [isDone, setIsDone] = useState<boolean>(false);

  // Practice Challenge
  const [challengeStep, setChallengeStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [challengeFeedback, setChallengeFeedback] = useState<string | null>(null);
  const [challengeScore, setChallengeScore] = useState<number>(0);
  const [completedChallenge, setCompletedChallenge] = useState<boolean>(false);

  // Step the for loop manually
  const handleNextStep = () => {
    sounds.playClick();
    if (isDone) return;

    if (step === 0) {
      // Initialization
      const nextSum = 1;
      const firstEntry: StepTrace = {
        stepIndex: 1,
        i: 1,
        conditionMet: 1 <= targetN,
        sum: nextSum,
        output: 's += 1'
      };
      setCurrentI(1);
      setCurrentSum(nextSum);
      setTraceHistory([firstEntry]);
      setStep(1);
      if (1 >= targetN) {
        setIsDone(true);
        sounds.playCorrect();
      }
      return;
    }

    const nextI = currentI + 1;
    if (nextI <= targetN) {
      const nextSum = currentSum + nextI;
      const nextEntry: StepTrace = {
        stepIndex: step + 1,
        i: nextI,
        conditionMet: true,
        sum: nextSum,
        output: `s += ${nextI}`
      };
      setCurrentI(nextI);
      setCurrentSum(nextSum);
      setTraceHistory(prev => [...prev, nextEntry]);
      setStep(prev => prev + 1);
    } else {
      // Loop ends
      setIsDone(true);
      sounds.playCorrect();
    }
  };

  const handleResetStepper = (newN?: number) => {
    sounds.playClick();
    const val = newN !== undefined ? newN : targetN;
    if (newN !== undefined) setTargetN(newN);
    setStep(0);
    setCurrentI(1);
    setCurrentSum(0);
    setTraceHistory([]);
    setIsDone(false);
  };

  // 3 Practice Questions
  const CHALLENGES = [
    {
      questionRo: 'Câte iterații (pași) efectuează bucla: for (int i = 1; i <= 6; i++) ?',
      questionEn: 'How many iterations (steps) does the loop execute: for (int i = 1; i <= 6; i++) ?',
      code: 'for (int i = 1; i <= 6; i++) {\n    cout << i << " ";\n}',
      optionsRo: [
        { label: '5 pași (1, 2, 3, 4, 5)', correct: false },
        { label: '6 pași (1, 2, 3, 4, 5, 6)', correct: true },
        { label: '7 pași (inclusiv când se oprește la 7)', correct: false },
        { label: 'Eroare de compilare', correct: false }
      ],
      optionsEn: [
        { label: '5 steps (1, 2, 3, 4, 5)', correct: false },
        { label: '6 steps (1, 2, 3, 4, 5, 6)', correct: true },
        { label: '7 steps (including stopping step at 7)', correct: false },
        { label: 'Compilation error', correct: false }
      ],
      explanationRo: 'Variabila i pornește de la 1 și crește cu câte 1 unitate până la 6 inclusiv (1, 2, 3, 4, 5, 6), adică realizează exact 6 iterații!',
      explanationEn: 'Variable i starts at 1 and increases by 1 up to 6 inclusive (1, 2, 3, 4, 5, 6), yielding exactly 6 iterations!'
    },
    {
      questionRo: 'Care este valoarea variabilei i IMEDIAT DUPĂ ce bucla for (int i = 1; i <= 5; i++) își termină execuția?',
      questionEn: 'What is the value of variable i RIGHT AFTER the loop for (int i = 1; i <= 5; i++) finishes execution?',
      code: 'int i;\nfor (i = 1; i <= 5; i++) {\n    // instructiuni\n}\ncout << i;',
      optionsRo: [
        { label: 'i = 5', correct: false },
        { label: 'i = 6', correct: true },
        { label: 'i = 0', correct: false },
        { label: 'i = 1', correct: false }
      ],
      optionsEn: [
        { label: 'i = 5', correct: false },
        { label: 'i = 6', correct: true },
        { label: 'i = 0', correct: false },
        { label: 'i = 1', correct: false }
      ],
      explanationRo: 'Pentru ca condiția i <= 5 să devină falsă (false) și bucla să se oprească, i trebuie să fie incrementat la 6! Deci la ieșire i este 6.',
      explanationEn: 'For condition i <= 5 to become false and terminate the loop, i must increment to 6! Hence upon exit i is 6.'
    },
    {
      questionRo: 'Ce va afișa pe ecran secvența: for (int i = 10; i >= 6; i -= 2) cout << i << " "; ?',
      questionEn: 'What does the snippet display: for (int i = 10; i >= 6; i -= 2) cout << i << " "; ?',
      code: 'for (int i = 10; i >= 6; i -= 2) {\n    cout << i << " ";\n}',
      optionsRo: [
        { label: '10 8 6', correct: true },
        { label: '10 9 8 7 6', correct: false },
        { label: '10 8', correct: false },
        { label: 'Buclă infinită', correct: false }
      ],
      optionsEn: [
        { label: '10 8 6', correct: true },
        { label: '10 9 8 7 6', correct: false },
        { label: '10 8', correct: false },
        { label: 'Infinite loop', correct: false }
      ],
      explanationRo: 'Pasul este decrementare cu 2 (i -= 2): la pasul 1 i=10, pasul 2 i=8, pasul 3 i=6. La pasul următor i devine 4 <= 6 este fals, deci se oprește!',
      explanationEn: 'The step decrements by 2 (i -= 2): step 1 i=10, step 2 i=8, step 3 i=6. Next, i becomes 4, which is not >= 6, so it stops!'
    }
  ];

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    sounds.playClick();
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    const opts = lang === 'ro' ? CHALLENGES[qIdx].optionsRo : CHALLENGES[qIdx].optionsEn;
    const isCorrect = opts[optIdx].correct;
    const explanation = lang === 'ro' ? CHALLENGES[qIdx].explanationRo : CHALLENGES[qIdx].explanationEn;

    if (isCorrect) {
      sounds.playCorrect();
      setChallengeFeedback((lang === 'ro' ? 'Corect! ' : 'Correct! ') + explanation);
    } else {
      sounds.playWrong();
      setChallengeFeedback((lang === 'ro' ? 'Incorect. Analizează cu atenție: ' : 'Incorrect. Study carefully: ') + explanation);
    }
  };

  const handleNextChallenge = () => {
    sounds.playClick();
    setChallengeFeedback(null);
    if (challengeStep < CHALLENGES.length - 1) {
      setChallengeStep(prev => prev + 1);
    } else {
      // Calculate total score
      let scoreAcc = 0;
      CHALLENGES.forEach((c, idx) => {
        const picked = selectedAnswers[idx];
        const opts = lang === 'ro' ? c.optionsRo : c.optionsEn;
        if (picked !== undefined && opts[picked].correct) {
          scoreAcc += 33;
        }
      });
      scoreAcc = Math.min(100, scoreAcc + 1);
      setChallengeScore(scoreAcc);
      setCompletedChallenge(true);
      sounds.playSuccess();
    }
  };

  const handleFinishLevel = () => {
    sounds.playSuccess();
    onPass(100);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/80 via-indigo-900/80 to-slate-900 p-6 rounded-3xl border border-blue-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold border border-blue-500/30 mb-2">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>{lang === 'ro' ? 'Nivelul 1 din 7 • Modulul 4E' : 'Level 1 of 7 • Module 4E'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {lang === 'ro' ? (
                <>Anatomia Buclei cu Contor <span className="text-cyan-400 font-mono">for</span> (Manual pag. 86–90)</>
              ) : (
                <>Anatomy of the <span className="text-cyan-400 font-mono">for</span> Loop with Counter (Textbook p. 86–90)</>
              )}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              {lang === 'ro'
                ? 'Înțelege structura repetitivă cu număr cunoscut de pași. Descoperă rolul celor 3 componente din antetul buclei: inițializare, condiție și pas de incrementare.'
                : 'Understand the loop structure with a known number of steps. Discover the role of the 3 header elements: initialization, condition, and increment step.'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5 shadow-inner">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>+15 XP</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Educational Card: The Anatomy of `for` */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center gap-2.5 mb-4 text-cyan-400 font-bold text-sm uppercase tracking-wider font-mono">
          <Lightbulb className="w-4 h-4 text-cyan-400" />
          <span>
            {lang === 'ro'
              ? 'Antetul Buclei `for`: Cele 3 Elemente Separate prin Punct și Virgulă (;)'
              : 'The `for` Loop Header: 3 Elements Separated by Semicolons (;)'}
          </span>
        </div>

        {/* Syntax Visualization Graphic */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-6">
          <div className="text-center font-mono text-lg sm:text-2xl font-bold tracking-wide flex flex-wrap items-center justify-center gap-1 sm:gap-2">
            <span className="text-purple-400">for</span>
            <span className="text-slate-500">(</span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
              int i = 1
            </span>
            <span className="text-rose-400 font-black">;</span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              i &lt;= n
            </span>
            <span className="text-rose-400 font-black">;</span>
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              i++
            </span>
            <span className="text-slate-500">)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800/80 text-xs">
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30">
              <span className="font-bold text-amber-300 block mb-1">
                {lang === 'ro' ? '1. Inițializarea (se execută o singură dată)' : '1. Initialization (executes only once)'}
              </span>
              <p className="text-slate-300 leading-relaxed">
                {lang === 'ro'
                  ? 'Setează valoarea inițială a contorului (i = 1). Are loc o singură dată, înainte de începerea buclei.'
                  : 'Sets the initial value of the counter (i = 1). Happens once, before loop execution begins.'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
              <span className="font-bold text-emerald-300 block mb-1">
                {lang === 'ro' ? '2. Condiția de continuare (testată la fiecare pas)' : '2. Continuation condition (tested at each step)'}
              </span>
              <p className="text-slate-300 leading-relaxed">
                {lang === 'ro'
                  ? 'Se verifică la fiecare iterație. Dacă este true, se execută corpul buclei; dacă este false, bucla se oprește imediat.'
                  : 'Verified at each iteration. If true, the loop body executes; if false, the loop halts immediately.'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
              <span className="font-bold text-cyan-300 block mb-1">
                {lang === 'ro' ? '3. Pasul contorului (după fiecare iterație)' : '3. Counter step (after each iteration)'}
              </span>
              <p className="text-slate-300 leading-relaxed">
                {lang === 'ro'
                  ? 'Modifică contorul la finalul fiecărui pas (i++ adaugă 1, i += 2 adaugă 2, i-- scade 1).'
                  : 'Updates the counter after each step (i++ adds 1, i += 2 adds 2, i-- subtracts 1).'}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Live Stepper Lab: Gauss Sum 1 + 2 + ... + n */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-cyan-400" />
                <span>
                  {lang === 'ro'
                    ? 'Simulator Interactiv: Suma lui Gauss (1 + 2 + ... + n)'
                    : 'Interactive Simulator: Gauss Sum (1 + 2 + ... + n)'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'ro'
                  ? 'Apasă pe butonul „Următorul Pas (i++)” pentru a urmări execuția linie cu linie.'
                  : 'Click "Next Step (i++)" to follow execution line by line.'}
              </p>
            </div>

            {/* Target n selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">{lang === 'ro' ? 'Alege n:' : 'Choose n:'}</span>
              {[3, 5, 8].map((val) => (
                <button
                  key={val}
                  onClick={() => handleResetStepper(val)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    targetN === val
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  n = {val}
                </button>
              ))}
              <button
                onClick={() => handleResetStepper()}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer ml-1"
                title={lang === 'ro' ? 'Resetează simularea' : 'Reset simulation'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Code Viewer & Variable Watchers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Left: Code Snippet */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-3.5 font-mono text-xs">
              <div className="text-slate-500 mb-1">{lang === 'ro' ? '// Calculul sumei: 1 + 2 + ... + n' : '// Sum calculation: 1 + 2 + ... + n'}</div>
              <div className="text-slate-300">int s = 0;</div>
              <div className={`p-1.5 rounded-lg transition-colors ${step > 0 && !isDone ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40' : 'text-slate-200'}`}>
                <span className="text-purple-400 font-bold">for</span> (int i = 1; i &lt;= {targetN}; i++) &#123;
              </div>
              <div className={`pl-4 py-1 transition-colors ${step > 0 && !isDone ? 'text-amber-300 font-bold' : 'text-slate-400'}`}>
                s = s + i;
              </div>
              <div className="text-slate-200">&#125;</div>
              <div className={`mt-1.5 pt-1.5 border-t border-slate-800 transition-colors ${isDone ? 'text-emerald-300 font-bold' : 'text-slate-500'}`}>
                cout &lt;&lt; s; <span className="text-slate-500">// {lang === 'ro' ? 'Rezultat final:' : 'Final result:'} {isDone ? currentSum : '?'}</span>
              </div>
            </div>

            {/* Right: Live Watch Registers */}
            <div className="lg:col-span-6 flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">{lang === 'ro' ? 'Contor i' : 'Counter i'}</span>
                  <span className="text-xl font-mono font-black text-cyan-300">{step === 0 ? '-' : currentI}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">{lang === 'ro' ? 'Suma s' : 'Sum s'}</span>
                  <span className="text-xl font-mono font-black text-amber-300">{currentSum}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">{lang === 'ro' ? `Condiție (i <= ${targetN})` : `Condition (i <= ${targetN})`}</span>
                  <span className={`text-xs font-mono font-bold block mt-1 ${isDone ? 'text-rose-400' : step > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {step === 0 ? (lang === 'ro' ? 'În așteptare' : 'Waiting') : isDone ? 'FALSE (Stop)' : 'TRUE (Continue)'}
                  </span>
                </div>
              </div>

              {/* Stepper Action Control */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isDone}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold font-mono transition flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                    isDone
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-500/20 active:scale-95'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>
                    {step === 0
                      ? (lang === 'ro' ? 'Start Buclă (Inițializare i = 1)' : 'Start Loop (Init i = 1)')
                      : isDone
                      ? (lang === 'ro' ? 'Buclă Încheiată cu Succes!' : 'Loop Finished Successfully!')
                      : (lang === 'ro' ? `Execută Pasul ${step + 1} (i = ${currentI + 1})` : `Execute Step ${step + 1} (i = ${currentI + 1})`)}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleResetStepper()}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              </div>

              {isDone && (
                <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {lang === 'ro' ? (
                      <>Suma primelor {targetN} numere naturale este <strong>{currentSum}</strong>. Verificare formula Gauss: <code>{targetN} * {targetN + 1} / 2 = {(targetN * (targetN + 1)) / 2}</code>!</>
                    ) : (
                      <>The sum of the first {targetN} natural numbers is <strong>{currentSum}</strong>. Gauss formula check: <code>{targetN} * {targetN + 1} / 2 = {(targetN * (targetN + 1)) / 2}</code>!</>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Execution Trace Table */}
          {traceHistory.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-800 overflow-x-auto">
              <span className="text-[11px] font-mono text-slate-400 block mb-2 font-bold uppercase tracking-wider">
                {lang === 'ro' ? 'Tabel de Urmărire Pas-cu-Pas (Trace Table):' : 'Step-by-Step Trace Table:'}
              </span>
              <table className="w-full text-xs font-mono text-left text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-2">{lang === 'ro' ? 'Pas' : 'Step'}</th>
                    <th className="p-2">{lang === 'ro' ? 'Valoare i' : 'Value i'}</th>
                    <th className="p-2">{lang === 'ro' ? `Condiție (i <= ${targetN})` : `Condition (i <= ${targetN})`}</th>
                    <th className="p-2">{lang === 'ro' ? 'Calcul Efectuat' : 'Calculation'}</th>
                    <th className="p-2 text-right">{lang === 'ro' ? 'Noua Sumă s' : 'New Sum s'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {traceHistory.map((tr) => (
                    <tr key={tr.stepIndex} className="hover:bg-slate-900/50">
                      <td className="p-2 font-bold text-cyan-300">#{tr.stepIndex}</td>
                      <td className="p-2 text-white font-bold">{tr.i}</td>
                      <td className="p-2 text-emerald-400">TRUE</td>
                      <td className="p-2 text-amber-300">{tr.output}</td>
                      <td className="p-2 text-right font-black text-amber-300">{tr.sum}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Practice Challenge Section */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>
                {lang === 'ro'
                  ? `Verificare Înțelegere: Provocarea Contorului (${challengeStep + 1} din ${CHALLENGES.length})`
                  : `Comprehension Check: Counter Challenge (${challengeStep + 1} of ${CHALLENGES.length})`}
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {lang === 'ro' ? 'Scor obținut: ' : 'Score earned: '}
              <strong className="text-cyan-300">{challengeScore}/100</strong>
            </span>
          </div>

          {!completedChallenge ? (
            <div className="flex flex-col gap-4">
              <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                {lang === 'ro' ? CHALLENGES[challengeStep].questionRo : CHALLENGES[challengeStep].questionEn}
              </h4>

              {CHALLENGES[challengeStep].code && (
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl font-mono text-xs text-cyan-300 whitespace-pre">
                  {CHALLENGES[challengeStep].code}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(lang === 'ro' ? CHALLENGES[challengeStep].optionsRo : CHALLENGES[challengeStep].optionsEn).map((opt, oIdx) => {
                  const isSelected = selectedAnswers[challengeStep] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectOption(challengeStep, oIdx)}
                      className={`p-3 rounded-xl text-left text-xs font-medium border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? opt.correct
                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                            : 'bg-rose-950/60 border-rose-500 text-rose-200'
                          : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && (
                        opt.correct ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {challengeFeedback && (
                <div className={`p-3 rounded-xl text-xs border ${challengeFeedback.startsWith('Corect') || challengeFeedback.startsWith('Correct') ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'}`}>
                  {challengeFeedback}
                </div>
              )}

              {selectedAnswers[challengeStep] !== undefined && (
                <button
                  type="button"
                  onClick={handleNextChallenge}
                  className="self-end py-2 px-5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>
                    {challengeStep < CHALLENGES.length - 1
                      ? (lang === 'ro' ? 'Următoarea Întrebare' : 'Next Question')
                      : (lang === 'ro' ? 'Calculează Scorul' : 'Calculate Score')}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-white">
                {lang === 'ro' ? 'Nivelul 1 Finalizat cu Succes!' : 'Level 1 Successfully Completed!'}
              </h4>
              <p className="text-xs text-slate-300 max-w-md">
                {lang === 'ro'
                  ? 'Ai stăpânit antetul buclei cu contor, funcționarea pas-cu-pas și evaluarea condiției de oprire.'
                  : 'You mastered the counted loop header, step-by-step execution, and evaluating stop conditions.'}
              </p>
              <button
                type="button"
                onClick={handleFinishLevel}
                className="mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
              >
                <span>
                  {lang === 'ro'
                    ? 'Treci la Nivelul 2: Bucla do-while & Validarea Datelor'
                    : 'Proceed to Level 2: do-while Loop & Data Validation'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
