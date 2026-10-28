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
      question: 'Câte iterații (pași) efectuează bucla: for (int i = 1; i <= 6; i++) ?',
      code: 'for (int i = 1; i <= 6; i++) {\n    cout << i << " ";\n}',
      options: [
        { label: '5 pași (1, 2, 3, 4, 5)', correct: false },
        { label: '6 pași (1, 2, 3, 4, 5, 6)', correct: true },
        { label: '7 pași (inclusiv când se oprește la 7)', correct: false },
        { label: 'Eroare de compilare', correct: false }
      ],
      explanation: 'Variabila i pornește de la 1 și crește cu câte 1 unitate până la 6 inclusiv (1, 2, 3, 4, 5, 6), adică realizează exact 6 iterații!'
    },
    {
      question: 'Care este valoarea variabilei i IMEDIAT DUPĂ ce bucla for (int i = 1; i <= 5; i++) își termină execuția?',
      code: 'int i;\nfor (i = 1; i <= 5; i++) {\n    // instructiuni\n}\ncout << i;',
      options: [
        { label: 'i = 5', correct: false },
        { label: 'i = 6', correct: true },
        { label: 'i = 0', correct: false },
        { label: 'i = 1', correct: false }
      ],
      explanation: 'Pentru ca condiția i <= 5 să devină falsă (false) și bucla să se oprească, i trebuie să fie incrementat la 6! Deci la ieșire i este 6.'
    },
    {
      question: 'Ce va afișa pe ecran secvența: for (int i = 10; i >= 6; i -= 2) cout << i << " "; ?',
      code: 'for (int i = 10; i >= 6; i -= 2) {\n    cout << i << " ";\n}',
      options: [
        { label: '10 8 6', correct: true },
        { label: '10 9 8 7 6', correct: false },
        { label: '10 8', correct: false },
        { label: 'Buclă infinită', correct: false }
      ],
      explanation: 'Pasul este decrementare cu 2 (i -= 2): la pasul 1 i=10, pasul 2 i=8, pasul 3 i=6. La pasul următor i devine 4 <= 6 este fals, deci se oprește!'
    }
  ];

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    sounds.playClick();
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    const isCorrect = CHALLENGES[qIdx].options[optIdx].correct;

    if (isCorrect) {
      sounds.playCorrect();
      setChallengeFeedback('Corect! ' + CHALLENGES[qIdx].explanation);
    } else {
      sounds.playWrong();
      setChallengeFeedback('Incorect. Analizează cu atenție: ' + CHALLENGES[qIdx].explanation);
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
        if (picked !== undefined && c.options[picked].correct) {
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
              <span>Nivelul 1 din 7 • Modulul 4E</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Anatomia Buclei cu Contor <span className="text-cyan-400 font-mono">for</span> (Manual pag. 86–90)
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Înțelege structura repetitivă cu număr cunoscut de pași. Descoperă rolul celor 3 componente din antetul buclei: <span className="text-amber-300 font-bold font-mono">inițializare</span>, <span className="text-emerald-300 font-bold font-mono">condiție</span> și <span className="text-cyan-300 font-bold font-mono">pas de incrementare</span>.
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
          <span>Antetul Buclei `for`: Cele 3 Elemente Separate prin Punct și Virgulă (;)</span>
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
              <span className="font-bold text-amber-300 block mb-1">1. Inițializarea (se execută o singură dată)</span>
              <p className="text-slate-300 leading-relaxed">
                Setează valoarea inițială a contorului (<code className="text-amber-200">i = 1</code>). Are loc o singură dată, înainte de începerea buclei.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
              <span className="font-bold text-emerald-300 block mb-1">2. Condiția de continuare (testată la fiecare pas)</span>
              <p className="text-slate-300 leading-relaxed">
                Se verifică la fiecare iterație. Dacă este <code className="text-emerald-200">true</code>, se execută corpul buclei; dacă este <code className="text-rose-300">false</code>, bucla se oprește imediat.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
              <span className="font-bold text-cyan-300 block mb-1">3. Pasul contorului (după fiecare iterație)</span>
              <p className="text-slate-300 leading-relaxed">
                Modifică contorul la finalul fiecărui pas (<code className="text-cyan-200">i++</code> adaugă 1, <code className="text-cyan-200">i += 2</code> adaugă 2, <code className="text-cyan-200">i--</code> scade 1).
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
                <span>Simulator Interactiv: Suma lui Gauss (1 + 2 + ... + n)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Apasă pe butonul <strong className="text-cyan-300">„Următorul Pas (i++)”</strong> pentru a urmări execuția linie cu linie.
              </p>
            </div>

            {/* Target n selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Alege n:</span>
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
                title="Resetează simularea"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Code Viewer & Variable Watchers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Left: Code Snippet */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-3.5 font-mono text-xs">
              <div className="text-slate-500 mb-1">// Calculul sumei: 1 + 2 + ... + n</div>
              <div className="text-slate-300">int s = 0;</div>
              <div className={`p-1.5 rounded-lg transition-colors ${step > 0 && !isDone ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40' : 'text-slate-200'}`}>
                <span className="text-purple-400 font-bold">for</span> (int i = 1; i &lt;= {targetN}; i++) &#123;
              </div>
              <div className={`pl-4 py-1 transition-colors ${step > 0 && !isDone ? 'text-amber-300 font-bold' : 'text-slate-400'}`}>
                s = s + i;
              </div>
              <div className="text-slate-200">&#125;</div>
              <div className={`mt-1.5 pt-1.5 border-t border-slate-800 transition-colors ${isDone ? 'text-emerald-300 font-bold' : 'text-slate-500'}`}>
                cout &lt;&lt; s; <span className="text-slate-500">// Rezultat final: {isDone ? currentSum : '?'}</span>
              </div>
            </div>

            {/* Right: Live Watch Registers */}
            <div className="lg:col-span-6 flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Contor i</span>
                  <span className="text-xl font-mono font-black text-cyan-300">{step === 0 ? '-' : currentI}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Suma s</span>
                  <span className="text-xl font-mono font-black text-amber-300">{currentSum}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Condiție (i &lt;= {targetN})</span>
                  <span className={`text-xs font-mono font-bold block mt-1 ${isDone ? 'text-rose-400' : step > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {step === 0 ? 'În așteptare' : isDone ? 'FALSE (Stop)' : 'TRUE (Continuă)'}
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
                  <span>{step === 0 ? 'Start Buclă (Inițializare i = 1)' : isDone ? 'Buclă Încheiată cu Succes!' : `Execută Pasul ${step + 1} (i = ${currentI + 1})`}</span>
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
                    Suma primelor {targetN} numere naturale este <strong>{currentSum}</strong>. Verificare formula Gauss: <code>{targetN} * {targetN + 1} / 2 = {(targetN * (targetN + 1)) / 2}</code>!
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Execution Trace Table */}
          {traceHistory.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-800 overflow-x-auto">
              <span className="text-[11px] font-mono text-slate-400 block mb-2 font-bold uppercase tracking-wider">
                Tabel de Urmărire Pas-cu-Pas (Trace Table):
              </span>
              <table className="w-full text-xs font-mono text-left text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-2">Pas</th>
                    <th className="p-2">Valoare i</th>
                    <th className="p-2">Condiție (i &lt;= {targetN})</th>
                    <th className="p-2">Calcul Efectuat</th>
                    <th className="p-2 text-right">Noua Sumă s</th>
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
              <span>Verificare Înțelegere: Provocarea Contorului ({challengeStep + 1} din {CHALLENGES.length})</span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Scor obținut: <strong className="text-cyan-300">{challengeScore}/100</strong>
            </span>
          </div>

          {!completedChallenge ? (
            <div className="flex flex-col gap-4">
              <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                {CHALLENGES[challengeStep].question}
              </h4>

              {CHALLENGES[challengeStep].code && (
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl font-mono text-xs text-cyan-300 whitespace-pre">
                  {CHALLENGES[challengeStep].code}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CHALLENGES[challengeStep].options.map((opt, oIdx) => {
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
                <div className={`p-3 rounded-xl text-xs border ${challengeFeedback.startsWith('Corect') ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'}`}>
                  {challengeFeedback}
                </div>
              )}

              {selectedAnswers[challengeStep] !== undefined && (
                <button
                  type="button"
                  onClick={handleNextChallenge}
                  className="self-end py-2 px-5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>{challengeStep < CHALLENGES.length - 1 ? 'Următoarea Întrebare' : 'Calculează Scorul'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-white">Nivelul 1 Finalizat cu Succes!</h4>
              <p className="text-xs text-slate-300 max-w-md">
                Ai stăpânit antetul buclei cu contor, funcționarea pas-cu-pas și evaluarea condiției de oprire.
              </p>
              <button
                type="button"
                onClick={handleFinishLevel}
                className="mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
              >
                <span>Treci la Nivelul 2: Bucla do-while &amp; Validarea Datelor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
