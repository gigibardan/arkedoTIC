import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, RefreshCw, HelpCircle, ArrowRight, ShieldAlert, Sparkles, Terminal } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { useLanguage } from '../../../context/LanguageContext';

interface C3Level6Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface ErrorCase {
  id: string;
  errorTag: string;
  scenario: string;
  scenarioEn: string;
  buggyFormula: string;
  cellValues: { [key: string]: string };
  cellValuesEn: { [key: string]: string };
  fixOptions: string[];
  fixOptionsEn: string[];
  correctIndex: number;
  explanation: string;
  explanationEn: string;
}

const ERROR_CASES: ErrorCase[] = [
  {
    id: 'div0',
    errorTag: '#DIV/0!',
    scenario: 'La calculul prețului unitar (A1 / B1), stocul B1 este 0 sau necompletat.',
    scenarioEn: 'When calculating unit price (A1 / B1), stock cell B1 is 0 or empty.',
    buggyFormula: '=A1 / B1',
    cellValues: { 'A1': '150 lei', 'B1': '0 bucăți' },
    cellValuesEn: { 'A1': '150 USD', 'B1': '0 units' },
    fixOptions: [
      '=IF(B1=0, "Stoc zero", A1/B1)',
      '=SUM(A1, B1)',
      '=A1 * 0'
    ],
    fixOptionsEn: [
      '=IF(B1=0, "Zero stock", A1/B1)',
      '=SUM(A1, B1)',
      '=A1 * 0'
    ],
    correctIndex: 0,
    explanation: 'Împărțirea la zero este nedefinită în matematică. Folosim funcția logică IF pentru a preveni împărțirea dacă numitorul este 0.',
    explanationEn: 'Division by zero is undefined in mathematics. We use the logical IF function to guard against division whenever the denominator is 0.'
  },
  {
    id: 'value',
    errorTag: '#VALUE!',
    scenario: 'Un utilizator a introdus un text în celula C2 în loc de un număr, iar formula încearcă adunarea aritmetică.',
    scenarioEn: 'A user entered text into cell C2 instead of a number, and the formula attempts arithmetic addition.',
    buggyFormula: '=C1 + C2',
    cellValues: { 'C1': '45', 'C2': 'zece' },
    cellValuesEn: { 'C1': '45', 'C2': 'ten' },
    fixOptions: [
      '=C1 * C2',
      'Corectarea valorii din C2 cu numărul 10 (sau folosirea funcției =SUM(C1, C2) care ignoră textul)',
      '=IF(C2="zece", "zece", 0)'
    ],
    fixOptionsEn: [
      '=C1 * C2',
      'Fixing the value in C2 with number 10 (or using =SUM(C1, C2) which ignores text)',
      '=IF(C2="ten", "ten", 0)'
    ],
    correctIndex: 1,
    explanation: '#VALUE! apare când un operator matematic (+, -, *) primește un operand text neconvertibil în număr. Soluția: scriem valori numerice reale sau folosim funcția SUM ce ignoră etichetele text.',
    explanationEn: '#VALUE! occurs when a mathematical operator (+, -, *) receives an unconvertible text operand. Solution: write actual numeric values or use the SUM function which safely skips text.'
  },
  {
    id: 'name',
    errorTag: '#NAME?',
    scenario: 'Elevul vrea să facă media notelor dar scrie numele funcției în limba română sau cu greșeală de literă.',
    scenarioEn: 'The student wants to calculate the grade average but writes the function name in Romanian or with a typo.',
    buggyFormula: '=MEDIE(D1:D5)',
    cellValues: { 'D1:D5': 'Notele elevului: 8, 9, 10, 7, 9' },
    cellValuesEn: { 'D1:D5': 'Student grades: 8, 9, 10, 7, 9' },
    fixOptions: [
      '=AVERAGE(D1:D5)',
      '=MEDIA(D1:D5)',
      '=SUMA_NOTELOR(D1:D5)'
    ],
    fixOptionsEn: [
      '=AVERAGE(D1:D5)',
      '=MEDIA(D1:D5)',
      '=SUMA_NOTELOR(D1:D5)'
    ],
    correctIndex: 0,
    explanation: '#NAME? apare când Excel nu recunoaște denumirea funcției sau a unui interval denumit. În versiunea internațională standard, funcția pentru medie este =AVERAGE, nu =MEDIE.',
    explanationEn: '#NAME? appears when Excel does not recognize a function name or named range. In standard international Excel, the average function is =AVERAGE, not =MEDIE.'
  },
  {
    id: 'ref',
    errorTag: '#REF!',
    scenario: 'Formula aduna celulele =E1 + E2, însă linia 2 a foii de calcul a fost ulterior ștearsă (Delete Row).',
    scenarioEn: 'The formula summed cells =E1 + E2, but row 2 of the worksheet was subsequently deleted (Delete Row).',
    buggyFormula: '=E1 + #REF!',
    cellValues: { 'E1': '100', 'Linia 2': '[Ștearsă din foaie]' },
    cellValuesEn: { 'E1': '100', 'Row 2': '[Deleted from sheet]' },
    fixOptions: [
      'Scriem manual =E1 + 0',
      'Rescriem formula referind o celulă existentă validă, de exemplu =E1 + E2 din noul tabel',
      'Lăsăm eroarea așa cum este'
    ],
    fixOptionsEn: [
      'Manually write =E1 + 0',
      'Rewrite the formula referencing an existing valid cell, e.g. =E1 + E2 in the new table',
      'Leave the error as is'
    ],
    correctIndex: 1,
    explanation: '#REF! (Invalid Cell Reference) apare când o celulă referențiată a fost distrusă/ștearsă. Trebuie să actualizăm formula să indice noua celulă activă dorită.',
    explanationEn: '#REF! (Invalid Cell Reference) appears when a referenced cell was deleted or destroyed. We must update the formula to point to the valid cell.'
  }
];

export const C3Level6_ExcelErrorsStudio: React.FC<C3Level6Props> = ({ onCompletePage, onComplete, onPrev }) => {
  const { lang } = useLanguage();
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);
  const [selectedFix, setSelectedFix] = useState<number | null>(null);
  const [solvedCases, setSolvedCases] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; text: string } | null>(null);

  // Reflection questions with cooldown
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{ [qId: string]: boolean }>({});
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const currentCase = ERROR_CASES[activeCaseIdx];

  const handleFixSelect = (optionIdx: number) => {
    setSelectedFix(optionIdx);
    if (optionIdx === currentCase.correctIndex) {
      sounds.playCorrect();
      setFeedback({
        isSuccess: true,
        text: lang === 'en'
          ? `Excellent! Error ${currentCase.errorTag} was resolved successfully. ${currentCase.explanationEn}`
          : `Excelent! Eroarea ${currentCase.errorTag} a fost soluționată cu succes. ${currentCase.explanation}`
      });
      if (!solvedCases.includes(currentCase.id)) {
        setSolvedCases(prev => [...prev, currentCase.id]);
      }
    } else {
      sounds.playWrong();
      setFeedback({
        isSuccess: false,
        text: lang === 'en'
          ? `Incorrect solution. This formula does not eliminate error ${currentCase.errorTag}. Try again!`
          : `Soluție incorectă. Această formulă nu elimină eroarea ${currentCase.errorTag}. Reîncearcă!`
      });
    }
  };

  const handleNextCase = () => {
    sounds.playClick();
    setSelectedFix(null);
    setFeedback(null);
    if (activeCaseIdx < ERROR_CASES.length - 1) {
      setActiveCaseIdx(prev => prev + 1);
    }
  };

  const handleQuizAnswer = (qId: string, optIdx: number) => {
    if (quizSubmitted[qId] || isLocked(qId)) return;
    setQuizAnswers(prev => ({ ...prev, [qId]: optIdx }));
    setQuizSubmitted(prev => ({ ...prev, [qId]: true }));
    if (optIdx === 0) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown(qId);
    }
  };

  const allLabFixed = solvedCases.length === ERROR_CASES.length;
  const quizDone = Object.keys(quizSubmitted).length >= 2;
  const canFinish = allLabFixed && quizDone;

  const currentCellValues = lang === 'en' ? currentCase.cellValuesEn : currentCase.cellValues;
  const currentOptions = lang === 'en' ? currentCase.fixOptionsEn : currentCase.fixOptions;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-900 via-red-800 to-amber-900 text-white p-6 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-300 text-sm font-semibold tracking-wider uppercase mb-1">
              <ShieldAlert className="w-4 h-4" />
              {lang === 'en' ? 'Level 6: Excel Error Debugging Clinic' : 'Nivelul 6: Clinica de Depanare a Erorilor Excel'}
            </div>
            <h1 className="text-2xl font-black">
              {lang === 'en' ? 'Diagnosing & Resolving Error Codes' : 'Diagnosticarea & Remedierea Codurilor de Eroare'}
            </h1>
            <p className="text-rose-100 text-sm mt-1">
              {lang === 'en'
                ? '8th Grade Curriculum p. 28: Learn to instantly spot #DIV/0!, #VALUE!, #NAME?, and #REF! and resolve them like a pro.'
                : 'Manual clasa a VIII-a pag. 28: Învață să recunoști instant #DIV/0!, #VALUE!, #NAME? și #REF! și să le repari ca un profesionist.'}
            </p>
          </div>
          <div className="text-right bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
            <span className="text-xs text-rose-200 block uppercase font-bold">
              {lang === 'en' ? 'Solved Cases' : 'Cazuri Rezolvate'}
            </span>
            <span className="text-2xl font-black text-rose-100">{solvedCases.length}/{ERROR_CASES.length}</span>
          </div>
        </div>
      </div>

      {/* Case Navigator Pills */}
      <div className="grid grid-cols-4 gap-2">
        {ERROR_CASES.map((ec, idx) => {
          const isCurrent = idx === activeCaseIdx;
          const isSolved = solvedCases.includes(ec.id);
          return (
            <button
              key={ec.id}
              onClick={() => {
                sounds.playClick();
                setActiveCaseIdx(idx);
                setSelectedFix(null);
                setFeedback(null);
              }}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                isCurrent
                  ? 'border-rose-500 bg-rose-500/10 text-rose-300 shadow-md ring-2 ring-rose-500/30'
                  : isSolved
                  ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 font-mono font-bold text-sm">
                {isSolved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {ec.errorTag}
              </div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                {lang === 'en' ? `Case ${idx + 1}` : `Cazul ${idx + 1}`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Diagnostic Station */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center font-mono font-black text-rose-400 text-base">
              !
            </div>
            <div>
              <span className="text-xs text-rose-400 font-bold uppercase tracking-wider">
                {lang === 'en' ? 'Diagnostic Station' : 'Foaie de Diagnosticare'}
              </span>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {lang === 'en' ? 'Detected error:' : 'Eroarea detectată:'}{' '}
                <span className="font-mono text-rose-400 bg-rose-950/60 px-2.5 py-0.5 rounded border border-rose-800/50">{currentCase.errorTag}</span>
              </h2>
            </div>
          </div>
          <span className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
            {lang === 'en' ? `Case ${activeCaseIdx + 1} of ${ERROR_CASES.length}` : `Cazul ${activeCaseIdx + 1} din ${ERROR_CASES.length}`}
          </span>
        </div>

        {/* Scenario description */}
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-bold uppercase mb-1">
            {lang === 'en' ? 'Scenario & Context' : 'Scenariu & Context'}
          </div>
          <p className="text-slate-200 text-sm leading-relaxed">
            {lang === 'en' ? currentCase.scenarioEn : currentCase.scenario}
          </p>
        </div>

        {/* Virtual Spreadsheet Peek */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono">
            <div className="text-xs text-slate-400 uppercase mb-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-blue-400" /> {lang === 'en' ? 'Cell Data' : 'Datele din celule'}
            </div>
            <div className="space-y-1.5 text-xs">
              {Object.entries(currentCellValues).map(([cell, val]) => (
                <div key={cell} className="flex justify-between border-b border-slate-900 py-1">
                  <span className="text-blue-400 font-semibold">{cell}:</span>
                  <span className="text-slate-200">{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono">
            <div className="text-xs text-slate-400 uppercase mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> {lang === 'en' ? 'Faulty Formula in Cell' : 'Formula defectuoasă din celulă'}
            </div>
            <div className="bg-rose-950/30 border border-rose-900/50 rounded-lg p-3 text-sm text-rose-300 font-bold">
              {currentCase.buggyFormula}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              {lang === 'en' ? 'Result shown in cell:' : 'Rezultat afișat în celulă:'} <span className="text-rose-400 font-black">{currentCase.errorTag}</span>
            </div>
          </div>
        </div>

        {/* Fixing options */}
        <div>
          <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {lang === 'en' ? 'How do you fix this error in the spreadsheet?' : 'Cum repari această eroare în foaia de calcul?'}
          </h3>
          <div className="space-y-2.5">
            {currentOptions.map((opt, idx) => {
              const isSelected = selectedFix === idx;
              const isCorrect = idx === currentCase.correctIndex;
              return (
                <button
                  key={idx}
                  onClick={() => handleFixSelect(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-start gap-3 ${
                    isSelected
                      ? isCorrect
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'border-rose-500 bg-rose-500/10 text-rose-300 ring-2 ring-rose-500/20'
                      : 'border-slate-800 bg-slate-950/50 hover:bg-slate-800/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-bold shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 font-mono text-xs md:text-sm">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            feedback.isSuccess
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}>
            {feedback.isSuccess ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="text-sm leading-relaxed">{feedback.text}</div>
          </div>
        )}

        {/* Action Button inside lab */}
        {selectedFix === currentCase.correctIndex && activeCaseIdx < ERROR_CASES.length - 1 && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNextCase}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg flex items-center gap-2"
            >
              {lang === 'en' ? 'Next Error Case' : 'Următorul Caz de Eroare'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Reflection Quiz with Cooldowns */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {lang === 'en' ? 'Pedagogical Reflection: Error Audit Protocol' : 'Reflecție Pedagogică: Protocolul de Audit al Erorilor'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en' ? 'Verify your mastery of spreadsheet data integrity.' : 'Verifică-ți stăpânirea conceptelor de integritate a datelor.'}
            </p>
          </div>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-200">
            {lang === 'en' ? (
              <>1. What happens if you type the formula <code className="text-rose-300 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">=SOMME(A1:A10)</code> into an English version of Excel?</>
            ) : (
              <>1. Ce se întâmplă dacă scrii formula <code className="text-rose-300 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">=SOMME(A1:A10)</code> într-o versiune de Excel setată în limba engleză?</>
            )}
          </div>
          <QuestionHint
            hintRo="Excel în engleză caută funcții cu denumirile standard internaționale (SUM, AVERAGE, MIN, etc.)."
            hintEn="English Excel looks for standard international function names (SUM, AVERAGE, MIN, etc.)."
          />
          <div className="space-y-2">
            {(lang === 'en' ? [
              'Displays #NAME? because the English function name is SUM, not SOMME',
              'Displays #VALUE! because the values in A1:A10 cannot be converted',
              'Automatically calculates the sum correctly without any error'
            ] : [
              'Afișează #NAME? deoarece denumirea funcției în limba engleză este SUM, nu SOMME',
              'Afișează #VALUE! deoarece valorile din A1:A10 nu pot fi convertite',
              'Calculează automat suma corect fără nicio eroare'
            ]).map((opt, idx) => {
              const qId = 'c3_l6_q1';
              const isSelected = quizAnswers[qId] === idx;
              const isSub = quizSubmitted[qId];
              return (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(qId, idx)}
                  disabled={isSub || isLocked(qId)}
                  className={`w-full text-left p-3 rounded-xl border text-sm transition-all flex items-center justify-between ${
                    isSelected
                      ? idx === 0
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500 bg-rose-500/10 text-rose-300'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected && (idx === 0 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />)}
                </button>
              );
            })}
          </div>
          {isLocked('c3_l6_q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['c3_l6_q1'] || 0} />
          )}
          {quizSubmitted['c3_l6_q1'] && (
            <AnswerExplanation
              explanation={lang === 'en'
                ? 'Correct! Unrecognized function names or labels trigger the #NAME? error. In standard Excel we always use the recognized official name.'
                : 'Corect! Denumirile necunoscute de funcții sau etichete declanșează eroarea #NAME?. În Excel standard utilizăm întotdeauna denumirea oficială în limba configurată.'}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="text-sm font-semibold text-slate-200">
            {lang === 'en' ? (
              <>2. If a column displays the symbol <code className="text-amber-300 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">######</code> (successive hashtags), what does it mean?</>
            ) : (
              <>2. Dacă o coloană afișează simbolul <code className="text-amber-300 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">######</code> (diezuri succesive), ce înseamnă acest lucru?</>
            )}
          </div>
          <QuestionHint
            hintRo="Acesta nu este un cod de eroare matematică sau de referință, ci o problemă vizuală de spațiu."
            hintEn="This is not a math or reference calculation error, but a visual column spacing issue."
          />
          <div className="space-y-2">
            {(lang === 'en' ? [
              'Column width is too narrow to display the formatted number — fix it by widening the column (double-click header edge)',
              'The formula is critically corrupted and must be wiped immediately',
              'The calculated number is negative and Excel refuses to display it'
            ] : [
              'Lățimea coloanei este prea mică pentru a afișa întregul număr formatat — se rezolvă prin lărgirea coloanei (dublu-click pe antet)',
              'Formula este grav coruptă și trebuie ștearsă imediat',
              'Numărul calculat este negativ și Excel refuză să-l arate'
            ]).map((opt, idx) => {
              const qId = 'c3_l6_q2';
              const isSelected = quizAnswers[qId] === idx;
              const isSub = quizSubmitted[qId];
              return (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(qId, idx)}
                  disabled={isSub || isLocked(qId)}
                  className={`w-full text-left p-3 rounded-xl border text-sm transition-all flex items-center justify-between ${
                    isSelected
                      ? idx === 0
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500 bg-rose-500/10 text-rose-300'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected && (idx === 0 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />)}
                </button>
              );
            })}
          </div>
          {isLocked('c3_l6_q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['c3_l6_q2'] || 0} />
          )}
          {quizSubmitted['c3_l6_q2'] && (
            <AnswerExplanation
              explanation={lang === 'en'
                ? 'Excellent! ###### is merely an indicator that the formatted number or date does not fit within the cell width. Double-clicking the column header divider instantly fixes it.'
                : 'Excelent! ###### este doar un avertisment că numărul sau data calendaristică nu încap în lățimea celulei. Un simplu dublu-click pe marginea dreaptă a antetului coloanei rezolvă problema.'}
            />
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <PageNavigationFooter
        canProceed={canFinish}
        onPrev={onPrev}
        onNext={() => {
          sounds.playCorrect();
          if (onCompletePage) onCompletePage(100);
          else if (onComplete) onComplete();
        }}
        nextLabel={lang === 'en' ? 'To Summative Assessment (Level 7)' : 'Spre Evaluarea Sumativă (Nivelul 7)'}
      />
    </div>
  );
};
