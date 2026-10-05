import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Play, 
  RotateCcw, 
  Check, 
  Layers, 
  Cpu, 
  Award,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface A2Level7Props {
  onCompletePage: (earnedScore: number) => void;
}

export const A2Level7_TraceTableAndFinalQuiz: React.FC<A2Level7Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive Trace Table Simulation State
  // Trace scenario: Calculate Maximum of two numbers: Read a, b -> If a > b then Max = a else Max = b -> Write Max
  const [activeTestCase, setActiveTestCase] = useState<1 | 2>(1);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [userStepAnswers, setUserStepAnswers] = useState<{
    condResult: 'TRUE' | 'FALSE' | null;
    maxVal: string;
  }>({
    condResult: null,
    maxVal: ''
  });
  const [simFeedback, setSimFeedback] = useState<string | null>(null);
  const [simSuccess, setSimSuccess] = useState<boolean>(false);
  const [traceCooldown, setTraceCooldown] = useState<number>(0);

  // Quiz State
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);
  const [q4Answer, setQ4Answer] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  // Timer cooldown decrement
  useEffect(() => {
    const hasActive = Object.values(cooldowns).some((c: number) => c > 0) || traceCooldown > 0;
    if (!hasActive) return;
    const timer = setInterval(() => {
      if (traceCooldown > 0) setTraceCooldown(prev => (prev <= 1 ? 0 : prev - 1));
      setCooldowns(prev => {
        const next: Record<string, number> = {};
        for (const [k, v] of Object.entries(prev)) {
          const val = v as number;
          if (val > 1) next[k] = val - 1;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldowns, traceCooldown]);

  // Test case data
  const testCases = {
    1: { a: 12, b: 25, conditionTrue: false, expectedBranch: 'Altfel (Else)', correctMax: '25' },
    2: { a: 48, b: 19, conditionTrue: true, expectedBranch: 'Atunci (Then)', correctMax: '48' }
  };

  const currentCaseData = testCases[activeTestCase];

  const handleSelectCase = (tc: 1 | 2) => {
    sounds.playClick();
    setActiveTestCase(tc);
    setCurrentStep(0);
    setUserStepAnswers({ condResult: null, maxVal: '' });
    setSimFeedback(null);
    setSimSuccess(false);
  };

  const handleNextStep = () => {
    sounds.playClick();
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleCheckTraceSim = () => {
    if (traceCooldown > 0) return;
    const isCondCorrect = (currentCaseData.conditionTrue && userStepAnswers.condResult === 'TRUE') ||
      (!currentCaseData.conditionTrue && userStepAnswers.condResult === 'FALSE');
    const isMaxCorrect = userStepAnswers.maxVal.trim() === currentCaseData.correctMax;

    if (isCondCorrect && isMaxCorrect) {
      sounds.playCorrect();
      setSimSuccess(true);
      setSimFeedback(
        lang === 'en'
          ? '🌟 Perfect! The trace table correctly shows the state of variables at each execution step!'
          : '🌟 Excelent! Tabelul de valori urmărește impecabil starea variabilelor la fiecare pas al execuției!'
      );
    } else {
      sounds.playWrong();
      setTraceCooldown(5);
      setSimFeedback(
        lang === 'en'
          ? '⚠️ Check your evaluation of (a > b) and the assigned value for Max.'
          : '⚠️ Verifică evaluarea condiției (a > b) și valoarea atribuită variabilei Max.'
      );
    }
  };

  // Quiz evaluation
  const isQ1Correct = q1Answer === 'trace_purpose';
  const handleQ1 = (id: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    sounds.playClick();
    setQ1Answer(id);
    if (id === 'trace_purpose') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const isQ2Correct = q2Answer === 'modulo_two';
  const handleQ2 = (id: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    sounds.playClick();
    setQ2Answer(id);
    if (id === 'modulo_two') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  const isQ3Correct = q3Answer === 'logic_false';
  const handleQ3 = (id: string) => {
    if ((cooldowns.q3 || 0) > 0) return;
    sounds.playClick();
    setQ3Answer(id);
    if (id === 'logic_false') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q3: 5 }));
    }
  };

  const isQ4Correct = q4Answer === 'branch_then';
  const handleQ4 = (id: string) => {
    if ((cooldowns.q4 || 0) > 0) return;
    sounds.playClick();
    setQ4Answer(id);
    if (id === 'branch_then') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q4: 5 }));
    }
  };

  // Total score calculation
  let totalScore = 0;
  if (simSuccess) totalScore += 20;
  if (isQ1Correct) totalScore += 20;
  if (isQ2Correct) totalScore += 20;
  if (isQ3Correct) totalScore += 20;
  if (isQ4Correct) totalScore += 20;

  const isPageComplete = simSuccess && isQ1Correct && isQ2Correct && isQ3Correct && isQ4Correct;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/30 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 font-mono">
              {lang === 'en' ? 'Module 5B • Page 7 of 7 • Final Review' : 'Modulul 5B • Pagina 7 din 7 • Evaluare Finală'}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
              {lang === 'en' ? 'Data Trace Table & Unit 5 Grand Master' : 'Traseul Datelor (Trace Table) & Marea Evaluare a Algoritmilor'}
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          {lang === 'en'
            ? 'A trace table (or values table) allows programmers to execute an algorithm step-by-step on paper or screen, inspecting variable values to verify logic and eliminate bugs.'
            : 'Tabelul de valori (traseul datelor) este instrumentul esențial prin care verificăm pas cu pas funcționarea unui algoritm, urmărind valorile fiecărei variabile pentru a descoperi și corecta eventualele erori (bugs).'}
        </p>
      </div>

      {/* Interactive Trace Table Simulator */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-purple-500/30 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            <h2 className="text-sm sm:text-base font-bold text-white">
              {lang === 'en' ? 'Interactive Trace Table: Algorithm "Maximum of Two Numbers"' : 'Simulator Interactiv: Tabel de Valori pentru Algoritmul „Maximul a două numere”'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSelectCase(1)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTestCase === 1
                  ? 'bg-purple-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {lang === 'en' ? 'Test 1: a=12, b=25' : 'Testul 1: a=12, b=25'}
            </button>
            <button
              type="button"
              onClick={() => handleSelectCase(2)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTestCase === 2
                  ? 'bg-purple-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {lang === 'en' ? 'Test 2: a=48, b=19' : 'Testul 2: a=48, b=19'}
            </button>
          </div>
        </div>

        {/* Algorithm Pseudocode Reference */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 space-y-1">
          <div className="text-purple-400 font-bold text-[11px] uppercase tracking-wider mb-1 font-sans">
            {lang === 'en' ? 'Pseudocode Algorithm:' : 'Algoritm în Pseudocod:'}
          </div>
          <div><span className="text-indigo-400 font-bold">Pas 1:</span> Citește a, b</div>
          <div><span className="text-indigo-400 font-bold">Pas 2:</span> Dacă a &gt; b Atunci</div>
          <div className="pl-6"><span className="text-teal-400 font-bold">Pas 3a:</span> Max &larr; a</div>
          <div><span className="text-indigo-400 font-bold">Altfel</span></div>
          <div className="pl-6"><span className="text-teal-400 font-bold">Pas 3b:</span> Max &larr; b</div>
          <div><span className="text-indigo-400 font-bold">Pas 4:</span> Scrie Max</div>
        </div>

        {/* Step-by-step Trace Table UI */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-purple-300 font-bold">
                <th className="p-2 sm:p-3">{lang === 'en' ? 'Step' : 'Pasul'}</th>
                <th className="p-2 sm:p-3">{lang === 'en' ? 'Action / Command' : 'Operație / Instrucțiune'}</th>
                <th className="p-2 sm:p-3 text-center font-mono">a</th>
                <th className="p-2 sm:p-3 text-center font-mono">b</th>
                <th className="p-2 sm:p-3 text-center font-mono">a &gt; b ?</th>
                <th className="p-2 sm:p-3 text-center font-mono">Max</th>
                <th className="p-2 sm:p-3 text-center">{lang === 'en' ? 'Output' : 'Afișaj'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {/* Step 1 */}
              <tr className="bg-slate-950/30">
                <td className="p-2 sm:p-3 font-bold text-indigo-400">1</td>
                <td className="p-2 sm:p-3 text-slate-300">Citește a, b</td>
                <td className="p-2 sm:p-3 text-center text-teal-300 font-bold">{currentCaseData.a}</td>
                <td className="p-2 sm:p-3 text-center text-teal-300 font-bold">{currentCaseData.b}</td>
                <td className="p-2 sm:p-3 text-center text-slate-600">-</td>
                <td className="p-2 sm:p-3 text-center text-slate-600">-</td>
                <td className="p-2 sm:p-3 text-center text-slate-600">-</td>
              </tr>

              {/* Step 2 */}
              <tr className="bg-slate-950/50">
                <td className="p-2 sm:p-3 font-bold text-indigo-400">2</td>
                <td className="p-2 sm:p-3 text-slate-300">Dacă a &gt; b ({currentCaseData.a} &gt; {currentCaseData.b})</td>
                <td className="p-2 sm:p-3 text-center text-teal-300">{currentCaseData.a}</td>
                <td className="p-2 sm:p-3 text-center text-teal-300">{currentCaseData.b}</td>
                <td className="p-2 sm:p-3 text-center">
                  <div className="flex items-center justify-center gap-1 font-sans">
                    <button
                      type="button"
                      onClick={() => setUserStepAnswers(p => ({ ...p, condResult: 'TRUE' }))}
                      className={`px-2 py-1 rounded text-xs font-bold transition cursor-pointer ${
                        userStepAnswers.condResult === 'TRUE'
                          ? 'bg-emerald-500 text-slate-950 shadow'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {lang === 'en' ? 'TRUE' : 'ADEVĂRAT'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserStepAnswers(p => ({ ...p, condResult: 'FALSE' }))}
                      className={`px-2 py-1 rounded text-xs font-bold transition cursor-pointer ${
                        userStepAnswers.condResult === 'FALSE'
                          ? 'bg-rose-500 text-white shadow'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {lang === 'en' ? 'FALSE' : 'FALS'}
                    </button>
                  </div>
                </td>
                <td className="p-2 sm:p-3 text-center text-slate-600">-</td>
                <td className="p-2 sm:p-3 text-center text-slate-600">-</td>
              </tr>

              {/* Step 3 */}
              <tr className="bg-slate-950/30">
                <td className="p-2 sm:p-3 font-bold text-indigo-400">3</td>
                <td className="p-2 sm:p-3 text-slate-300">
                  {userStepAnswers.condResult === 'TRUE' ? 'Max ← a' : userStepAnswers.condResult === 'FALSE' ? 'Max ← b' : 'Atribuire Max'}
                </td>
                <td className="p-2 sm:p-3 text-center text-teal-300">{currentCaseData.a}</td>
                <td className="p-2 sm:p-3 text-center text-teal-300">{currentCaseData.b}</td>
                <td className="p-2 sm:p-3 text-center text-slate-500">{userStepAnswers.condResult || '-'}</td>
                <td className="p-2 sm:p-3 text-center">
                  <input
                    type="text"
                    value={userStepAnswers.maxVal}
                    onChange={(e) => setUserStepAnswers(p => ({ ...p, maxVal: e.target.value }))}
                    placeholder="Valoare..."
                    className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-center text-white focus:outline-none focus:border-purple-400 text-xs font-bold font-mono"
                  />
                </td>
                <td className="p-2 sm:p-3 text-center text-slate-600">-</td>
              </tr>

              {/* Step 4 */}
              <tr className="bg-slate-950/60">
                <td className="p-2 sm:p-3 font-bold text-indigo-400">4</td>
                <td className="p-2 sm:p-3 text-slate-300">Scrie Max (Afișează ecran)</td>
                <td className="p-2 sm:p-3 text-center text-teal-300">{currentCaseData.a}</td>
                <td className="p-2 sm:p-3 text-center text-teal-300">{currentCaseData.b}</td>
                <td className="p-2 sm:p-3 text-center text-slate-500">{userStepAnswers.condResult || '-'}</td>
                <td className="p-2 sm:p-3 text-center text-purple-300 font-bold">{userStepAnswers.maxVal || '-'}</td>
                <td className="p-2 sm:p-3 text-center text-emerald-400 font-black">{userStepAnswers.maxVal || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {traceCooldown > 0 && (
          <PedagogicalReflectionBanner
            cooldown={traceCooldown}
            totalSeconds={5}
            customMessageRo="Reflecție logică: Compară valorile lui a și b pentru a alege ramura corectă (Atunci sau Altfel)!"
            customMessageEn="Logical reflection: Compare values of a and b to pick the right branch!"
          />
        )}

        {simFeedback && (
          <div className={`p-3 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
            simSuccess ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-200' : 'bg-rose-950/70 border border-rose-500/40 text-rose-200'
          }`}>
            {simSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            <span>{simFeedback}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setUserStepAnswers({ condResult: null, maxVal: '' });
              setSimFeedback(null);
              setSimSuccess(false);
              sounds.playClick();
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Reset Table' : 'Resetează Tabelul'}</span>
          </button>
          <button
            type="button"
            disabled={traceCooldown > 0 || !userStepAnswers.condResult || !userStepAnswers.maxVal}
            onClick={handleCheckTraceSim}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-black transition flex items-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{lang === 'en' ? 'Validate Trace Simulation (+20 pts)' : 'Validează Traseul Datelor (+20 pct)'}</span>
          </button>
        </div>
      </div>

      {/* Final Chapter Evaluation Quiz (4 Questions) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-purple-500/30 space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Award className="w-5 h-5 text-amber-400" />
          <h2 className="text-base sm:text-lg font-bold text-white">
            {lang === 'en' ? 'Grand Final Evaluation: Unit 5 Algorithms Quiz' : 'Marea Evaluare Finală: Testul Grilă al Algoritmilor'}
          </h2>
        </div>

        {/* Q1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 uppercase font-mono">
              {lang === 'en' ? 'Question 1 of 4' : 'Întrebarea 1 din 4'}
            </span>
            <QuestionHint
              hintRo="Tabelul de valori urmărește pas cu pas modificarea variabilelor pentru a detecta eventuale erori."
              hintEn="The trace table monitors step-by-step changes of variables to find bugs."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'What is the main role of a trace table (values table) in algorithm design?'
              : 'Care este rolul principal al unui tabel de valori (traseu al datelor) în algoritmizare?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'trace_purpose', ro: 'Urmărirea stării variabilelor la fiecare pas pentru verificarea corectitudinii algoritmului', en: 'Tracking variable states at every step to verify correctness' },
              { id: 'wrong_1', ro: 'Creșterea vitezei procesorului calculatorului', en: 'Increasing computer CPU clock speed' },
              { id: 'wrong_2', ro: 'Desenarea automată a ecusonului în Paint', en: 'Auto drawing badges in Paint' },
              { id: 'wrong_3', ro: 'Formatarea marginilor paginii A4 în Word', en: 'Formatting A4 margins in Word' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q1 || 0) > 0}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'trace_purpose'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-purple-400 text-slate-300'
                }`}
              >
                {lang === 'en' ? opt.en : opt.ro}
              </button>
            ))}
          </div>
          {cooldowns.q1 && cooldowns.q1 > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.q1}
              totalSeconds={5}
              customMessageRo="Reflecție didactică: Trace table este instrumentul de depanare și verificare pas cu pas!"
              customMessageEn="Pedagogical reflection: The trace table is used for debugging and step-by-step verification!"
            />
          ) : null}
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanationRo="Tabelul de valori simulează execuția algoritmului linie cu linie, ajutând elevul să vadă cum se transformă datele de intrare în date de ieșire."
              explanationEn="The trace table simulates line-by-line algorithm execution, showing how input data transforms into output."
            />
          )}
        </div>

        {/* Q2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 uppercase font-mono">
              {lang === 'en' ? 'Question 2 of 4' : 'Întrebarea 2 din 4'}
            </span>
            <QuestionHint
              hintRo="Operatorul % (modulo) calculează restul împărțirii întregi: 10 împărțit la 4 dă câtul 2 și restul 2."
              hintEn="The % operator calculates remainder: 10 / 4 is 2 with remainder 2."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'If x = 10 and y = 4, what value is assigned to z by the instruction: z = x % y (or x mod y)?'
              : 'Dacă x = 10 și y = 4, ce valoare primește variabila z prin comanda: z = x % y (sau x mod y)?'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'modulo_two', label: '2' },
              { id: 'modulo_four', label: '4' },
              { id: 'modulo_fourteen', label: '14' },
              { id: 'modulo_forty', label: '40' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q2 || 0) > 0}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-center text-xs sm:text-sm font-bold font-mono transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'modulo_two'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-purple-400 text-slate-300'
                }`}
              >
                z = {opt.label}
              </button>
            ))}
          </div>
          {cooldowns.q2 && cooldowns.q2 > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.q2}
              totalSeconds={5}
              customMessageRo="Reflecție aritmetică: % este restul împărțirii întregi (10 = 4 * 2 + 2)!"
              customMessageEn="Arithmetic reflection: % is the remainder of integer division (10 = 4 * 2 + 2)!"
            />
          ) : null}
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanationRo="10 împărțit la 4 este egal cu 2 rest 2. Operatorul mod / % returnează restul, adică 2."
              explanationEn="10 divided by 4 equals 2 with a remainder of 2. The % operator returns the remainder, which is 2."
            />
          )}
        </div>

        {/* Q3 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 uppercase font-mono">
              {lang === 'en' ? 'Question 3 of 4' : 'Întrebarea 3 din 4'}
            </span>
            <QuestionHint
              hintRo="Pentru ca operatorul ȘI (AND) să fie Adevărat, ambele propoziții trebuie să fie simultan Adevărate."
              hintEn="For AND to be true, both conditions must be true simultaneously."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'What is the logical result of the compound expression: (15 > 10) AND (8 == 9)?'
              : 'Care este valoarea de adevăr a expresiei logice: (15 > 10) ȘI (8 == 9)?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'logic_false', ro: 'FALS (pentru că 8 == 9 este Fals, iar operatorul ȘI cere ca ambele să fie Adevărate)', en: 'FALSE (because 8 == 9 is False, and AND requires both to be True)' },
              { id: 'logic_true', ro: 'ADEVĂRAT (pentru că 15 > 10 este Adevărat)', en: 'TRUE (because 15 > 10 is True)' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q3 || 0) > 0}
                onClick={() => handleQ3(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q3Answer === opt.id
                    ? opt.id === 'logic_false'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-purple-400 text-slate-300'
                }`}
              >
                {lang === 'en' ? opt.en : opt.ro}
              </button>
            ))}
          </div>
          {cooldowns.q3 && cooldowns.q3 > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.q3}
              totalSeconds={5}
              customMessageRo="Reflecție logică: Conectivul ȘI este Adevărat doar dacă ambele brațe sunt Adevărate!"
              customMessageEn="Logical reflection: AND is True only if both conditions are True!"
            />
          ) : null}
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanationRo="(15 > 10) este Adevărat, dar (8 == 9) este Fals. Expresia Adevărat ȘI Fals produce rezultatul Fals."
              explanationEn="(15 > 10) is True, but (8 == 9) is False. True AND False yields False."
            />
          )}
        </div>

        {/* Q4 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 uppercase font-mono">
              {lang === 'en' ? 'Question 4 of 4' : 'Întrebarea 4 din 4'}
            </span>
            <QuestionHint
              hintRo="În schema logică, rombul are două ramuri de ieșire: DA (ramura Atunci) și NU (ramura Altfel)."
              hintEn="In a flowchart, the decision diamond has two output paths: YES (Then branch) and NO (Else branch)."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'In a flowchart, if the condition inside the decision diamond evaluates to TRUE (YES), which branch is taken?'
              : 'Într-o schemă logică, dacă condiția din blocul de decizie (romb) este evaluată ca fiind ADEVĂRATĂ (DA), pe care ramură continuă execuția?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'branch_then', ro: 'Ramura DA / ATUNCI (acțiunile prevăzute pentru cazul favorabil)', en: 'YES / THEN branch (actions defined for favorable case)' },
              { id: 'branch_else', ro: 'Ramura NU / ALTFEL', en: 'NO / ELSE branch' },
              { id: 'branch_stop', ro: 'Algoritmul se oprește instantaneu fără acțiuni', en: 'Algorithm stops instantly without action' },
              { id: 'branch_loop', ro: 'Se reia citirea datelor de la început', en: 'Input data is re-read from the beginning' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q4 || 0) > 0}
                onClick={() => handleQ4(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q4Answer === opt.id
                    ? opt.id === 'branch_then'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-purple-400 text-slate-300'
                }`}
              >
                {lang === 'en' ? opt.en : opt.ro}
              </button>
            ))}
          </div>
          {cooldowns.q4 && cooldowns.q4 > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.q4}
              totalSeconds={5}
              customMessageRo="Reflecție logică: Condiția adevărată urmează ramura DA (Atunci)!"
              customMessageEn="Logical reflection: True condition follows the YES (Then) branch!"
            />
          ) : null}
          {q4Answer && (
            <AnswerExplanation
              isCorrect={isQ4Correct}
              explanationRo="Structura Dacă <condiție> Atunci <acțiune 1> Altfel <acțiune 2> execută <acțiune 1> (ramura DA) atunci când condiția este Adevărată."
              explanationEn="The structure If <cond> Then <action 1> Else <action 2> executes <action 1> (YES branch) when the condition evaluates to True."
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentPage={7}
        totalPages={7}
        earnedScore={totalScore}
        isCompleted={isPageComplete}
        onNextPage={() => {
          sounds.playFanfare();
          onCompletePage(totalScore);
        }}
        nextButtonLabelRo="Finalizează Misiunea 5B & Obține Diploma de Algoritmist!"
        nextButtonLabelEn="Complete Mission 5B & Claim Algorithmist Diploma!"
      />
    </div>
  );
};
