import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  GitBranch,
  Award,
  Layers,
  Sliders,
  AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';

interface C3Level3Props {
  onCompletePage: (earnedScore: number) => void;
}

export const C3Level3_LogicalDecisionIf: React.FC<C3Level3Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive IF Decision Simulator (Manual pag. 27)
  const [testScore, setTestScore] = useState<number>(7.5);
  const [passThreshold, setPassThreshold] = useState<number>(5.0);

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const isPassed = testScore >= passThreshold;
  const isMeritScholarship = testScore >= 9.5;

  const handleQ1 = (id: string) => {
    if (isLocked('q1')) return;
    setQ1Answer(id);
    if (id === 'threeArgs') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1');
    }
  };

  const handleQ2 = (id: string) => {
    if (isLocked('q2')) return;
    setQ2Answer(id);
    if (id === 'quotesNeeded') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2');
    }
  };

  const handleQ3 = (id: string) => {
    if (isLocked('q3')) return;
    setQ3Answer(id);
    if (id === 'promovat') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3');
    }
  };

  const isQ1Correct = q1Answer === 'threeArgs';
  const isQ2Correct = q2Answer === 'quotesNeeded';
  const isQ3Correct = q3Answer === 'promovat';

  const correctCount = [isQ1Correct, isQ2Correct, isQ3Correct].filter(Boolean).length;
  const totalScore = Math.round((correctCount / 3) * 100);
  const canProceed = isQ1Correct && isQ2Correct && isQ3Correct;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Level Header Banner */}
      <div className="bg-gradient-to-r from-teal-950/70 via-emerald-950/40 to-slate-900 border border-teal-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Art Klett Textbook 2025 • Page 27' : 'Manual Art Klett 2025 • Pag. 27'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <GitBranch className="w-8 h-8 text-teal-400" />
              {lang === 'en'
                ? 'Level 3: Logical Decision — The =IF(test, true_val, false_val) Function'
                : 'Nivelul 3: Decizia Logică — Funcția =IF(test, dacă_adevărat, dacă_fals)'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {lang === 'en'
                ? 'How do you automate decisions based on student grades? Master the 3-argument syntax of the IF function and test whether a student has Passed or Needs Retest.'
                : 'Cum iei decizii automate în funcție de notele elevilor? Învață sintaxa cu 3 argumente a funcției IF și cum testezi dacă un elev este Promovat sau Corigent.'}
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-teal-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">{lang === 'en' ? 'Module 1C' : 'Modulul 1C'}</div>
            <div className="text-2xl font-black text-teal-400">3 / 7</div>
          </div>
        </div>
      </div>

      {/* Interactive IF Decision Lab */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {lang === 'en'
                  ? 'Decision Simulator: =IF(B2 >= 5, "Passed", "Failed")'
                  : 'Simulator Decizional: =IF(B2 >= 5, "Promovat", "Corigent")'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'en'
                  ? 'Adjust the grade in cell B2 to watch the logical decision toggle in real time'
                  : 'Ajustează nota din celula B2 pentru a vedea cum se comută decizia logică în timp real'}
              </p>
            </div>
          </div>

          {/* Quick Grade Adjuster */}
          <div className="flex items-center gap-2">
            {[4.5, 5.0, 7.5, 9.5, 10.0].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => { sounds.playClick(); setTestScore(val); }}
                className={`px-3 py-1.5 rounded-xl font-bold font-mono text-xs transition cursor-pointer border ${
                  testScore === val
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
                }`}
              >
                {lang === 'en' ? `Grade ${val}` : `Nota ${val}`}
              </button>
            ))}
          </div>
        </div>

        {/* Live Simulation Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Sheet Preview */}
          <div className="md:col-span-6 border border-slate-700 rounded-2xl overflow-hidden bg-slate-950 font-mono text-xs shadow-inner">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
                  <th className="p-2 border-r border-slate-800 w-12 bg-slate-850">◢</th>
                  <th className="p-2 border-r border-slate-800">{lang === 'en' ? 'A: Student Name' : 'A: Nume Elev'}</th>
                  <th className="p-2 border-r border-slate-800 w-24">{lang === 'en' ? 'B: Grade (B2)' : 'B: Notă (B2)'}</th>
                  <th className="p-2">{lang === 'en' ? 'C: Status (=IF)' : 'C: Situație (=IF)'}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-800 bg-slate-900/40">
                  <td className="p-3 border-r border-slate-800 bg-slate-900 text-slate-400 font-bold">2</td>
                  <td className="p-3 border-r border-slate-800 text-left pl-3 text-white font-medium">Popescu Andrei</td>
                  <td className="p-3 border-r border-slate-800 font-bold text-amber-300 text-base">
                    {testScore.toFixed(1)}
                  </td>
                  <td className={`p-3 font-black text-sm transition ${
                    isPassed ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                  }`}>
                    {isPassed
                      ? (lang === 'en' ? 'Passed ✓' : 'Promovat ✓')
                      : (lang === 'en' ? 'Failed ✗' : 'Corigent ✗')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Syntax Anatomy Breakdown */}
          <div className="md:col-span-6 space-y-3 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-sans block text-[11px]">
                {lang === 'en'
                  ? '3-argument syntax conforming to textbook:'
                  : 'Sintaxa celor 3 argumente conform manualului:'}
              </span>
              <div className="text-sm font-bold text-white bg-slate-900 p-2.5 rounded-xl border border-slate-700">
                =IF(<span className="text-amber-400">B2 &gt;= 5</span>,{' '}
                <span className="text-emerald-400">&quot;{lang === 'en' ? 'Passed' : 'Promovat'}&quot;</span>,{' '}
                <span className="text-rose-400">&quot;{lang === 'en' ? 'Failed' : 'Corigent'}&quot;</span>)
              </div>
            </div>

            <div className="space-y-1.5 font-sans text-xs">
              <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between text-amber-200">
                <span>
                  {lang === 'en' ? `1. Logical Test: ${testScore} >= 5.0` : `1. Testul Logic: ${testScore} >= 5.0`}
                </span>
                <span className="font-bold font-mono">
                  {isPassed
                    ? (lang === 'en' ? 'TRUE' : 'Adevărat (TRUE)')
                    : (lang === 'en' ? 'FALSE' : 'Fals (FALSE)')}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-slate-300">
                <span>{lang === 'en' ? '2. Value if True:' : '2. Valoare dacă Adevărat:'}</span>
                <span className="font-bold text-emerald-400 font-mono">
                  &quot;{lang === 'en' ? 'Passed' : 'Promovat'}&quot;
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-slate-300">
                <span>{lang === 'en' ? '3. Value if False:' : '3. Valoare dacă Fals:'}</span>
                <span className="font-bold text-rose-400 font-mono">
                  &quot;{lang === 'en' ? 'Failed' : 'Corigent'}&quot;
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summative Knowledge Verification with Pedagogical Cooldowns */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {lang === 'en' ? 'Pedagogical Check: The IF Function' : 'Verificare Pedagogică: Funcția IF'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Answer the 3 textbook questions correctly to unlock Level 4'
                : 'Răspunde corect la cele 3 întrebări din manual pentru a debloca Nivelul 4'}
            </p>
          </div>
        </div>

        {/* Q1 */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '1. How many arguments (parameters) does the =IF() function standardly accept in Excel?'
                : '1. Câte argumente (parametri) primește în mod standard funcția =IF() în Excel?'}
            </h3>
            {cooldowns.q1 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q1} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'threeArgs',
                textRo: '3 argumente: testul logic, valoarea dacă e adevărat și valoarea dacă e fals',
                textEn: '3 arguments: logical test, value if true, and value if false'
              },
              {
                id: 'oneArg',
                textRo: '1 singur argument: doar un număr',
                textEn: 'Only 1 argument: just a single number'
              },
              {
                id: 'infinite',
                textRo: 'Un număr nelimitat de peste 1000 de argumente',
                textEn: 'An unlimited number over 1000 arguments'
              },
              {
                id: 'zeroArgs',
                textRo: 'Niciun argument, funcționează automat fără paranteze',
                textEn: 'Zero arguments, works automatically without parentheses'
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q1')}
                onClick={() => handleQ1(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q1Answer === option.id
                    ? option.id === 'threeArgs'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {lang === 'en' ? option.textEn : option.textRo}
              </button>
            ))}
          </div>

          <QuestionHint
            hintRo="Privește structura funcției: IF(condiție, ce_faci_dacă_da, ce_faci_dacă_nu)."
            hintEn="Look at the structure: IF(condition, do_if_yes, do_if_no)."
          />
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation={
                lang === 'en'
                  ? 'Correct! The IF function takes exactly 3 arguments separated by commas or semicolons: logical_test, value_if_true, value_if_false.'
                  : 'Corect! Funcția IF are exact 3 parametri despărțiți prin virgulă sau punct și virgulă: test_logic, valoare_dacă_adevărat, valoare_dacă_fals.'
              }
            />
          )}
        </div>

        {/* Q2 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '2. Why must text literals such as "Passed" or "Failed" be enclosed in double quotation marks ("") in an IF formula?'
                : '2. De ce textele precum „Promovat” sau „Corigent” trebuie încadrate obligatoriu între ghilimele duble ("") în formula IF?'}
            </h3>
            {cooldowns.q2 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q2} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'quotesNeeded',
                textRo: 'Pentru ca Excel să le recunoască drept șiruri de caractere (text) și să nu le confunde cu numele unor funcții',
                textEn: 'So Excel recognizes them as text strings rather than confusing them with function or range names'
              },
              {
                id: 'secretKey',
                textRo: 'Pentru a ascunde textul de ochii profesorului',
                textEn: 'To conceal the text from the teacher'
              },
              {
                id: 'printA4',
                textRo: 'Pentru a mări fontul la imprimare',
                textEn: 'To enlarge the font when printing'
              },
              {
                id: 'soundBeep',
                textRo: 'Pentru a declanșa o alarmă sonoră',
                textEn: 'To sound an audible alert beep'
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q2')}
                onClick={() => handleQ2(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q2Answer === option.id
                    ? option.id === 'quotesNeeded'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {lang === 'en' ? option.textEn : option.textRo}
              </button>
            ))}
          </div>

          <QuestionHint
            hintRo="Dacă scrii cuvinte fără ghilimele într-o formulă, Excel crede că sunt alte funcții și dă eroarea #NAME?."
            hintEn="If you type text without quotes in a formula, Excel assumes it is a function name and returns #NAME?."
          />
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation={
                lang === 'en'
                  ? 'Excellent! In any Excel formula, text constants (literal strings) must be bounded by double quotes (""), otherwise the software throws the #NAME? error.'
                  : 'Excelent! În orice formulă Excel, constantele de tip text (literal strings) trebuie delimitate prin ghilimele drepte (""), altfel programul returnează eroarea #NAME?.'
              }
            />
          )}
        </div>

        {/* Q3 */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              {lang === 'en'
                ? '3. If cell B2 contains the grade 7, what will the formula =IF(B2>=5, "Passed", "Failed") display?'
                : '3. Dacă în celula B2 avem nota 7, ce va afișa formula =IF(B2>=5, "Promovat", "Corigent")?'}
            </h3>
            {cooldowns.q3 && <PedagogicalReflectionBanner secondsLeft={cooldowns.q3} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'promovat',
                textRo: 'Promovat (deoarece 7 >= 5 este Adevărat)',
                textEn: 'Passed (since 7 >= 5 evaluates to TRUE)'
              },
              {
                id: 'corigent',
                textRo: 'Corigent',
                textEn: 'Failed'
              },
              {
                id: 'errorDiv',
                textRo: 'Eroare #DIV/0!',
                textEn: 'Error #DIV/0!'
              },
              {
                id: 'blank',
                textRo: 'Celula rămâne goală',
                textEn: 'The cell remains empty'
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isLocked('q3')}
                onClick={() => handleQ3(option.id)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  q3Answer === option.id
                    ? option.id === 'promovat'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {lang === 'en' ? option.textEn : option.textRo}
              </button>
            ))}
          </div>

          <QuestionHint
            hintRo="7 este mai mare sau egal cu 5? Testul logic este TRUE."
            hintEn="Is 7 greater than or equal to 5? The logical condition is TRUE."
          />
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanation={
                lang === 'en'
                  ? 'Exactly! The test 7 >= 5 is true, so the formula evaluates and outputs the first argument ("Passed").'
                  : 'Exact! Testul 7 >= 5 fiind adevărat, funcția evaluează și afișează primul rezultat (\'Promovat\').'
              }
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        currentPage={3}
        totalPages={7}
        earnedScore={totalScore}
        canProceed={canProceed}
        onNext={() => {
          sounds.playLevelUp();
          onCompletePage(totalScore);
        }}
      />
    </div>
  );
};
