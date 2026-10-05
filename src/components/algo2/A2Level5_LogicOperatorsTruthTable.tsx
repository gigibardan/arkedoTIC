import React, { useState, useEffect } from 'react';
import { 
  GitMerge, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  ToggleLeft, 
  ToggleRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface A2Level5Props {
  onCompletePage: (earnedScore: number) => void;
}

export const A2Level5_LogicOperatorsTruthTable: React.FC<A2Level5Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive Logic Lab State
  const [condA, setCondA] = useState<boolean>(true); // e.g. Has Ticket
  const [condB, setCondB] = useState<boolean>(false); // e.g. Has ID Card
  const [operator, setOperator] = useState<'AND' | 'OR'>('AND');

  const resultLogic = operator === 'AND' ? (condA && condB) : (condA || condB);

  // Quiz State
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q1Cooldown, setQ1Cooldown] = useState<number>(0);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q2Cooldown, setQ2Cooldown] = useState<number>(0);

  // Timer cooldown decrement
  useEffect(() => {
    if (q1Cooldown <= 0 && q2Cooldown <= 0) return;
    const timer = setInterval(() => {
      if (q1Cooldown > 0) setQ1Cooldown(prev => (prev <= 1 ? 0 : prev - 1));
      if (q2Cooldown > 0) setQ2Cooldown(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [q1Cooldown, q2Cooldown]);

  // Quiz handlers
  const isQ1Correct = q1Answer === 'and_both_true';
  const handleQ1 = (val: string) => {
    if (q1Cooldown > 0) return;
    sounds.playClick();
    setQ1Answer(val);
    if (val === 'and_both_true') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setQ1Cooldown(5);
    }
  };

  const isQ2Correct = q2Answer === 'or_at_least_one';
  const handleQ2 = (val: string) => {
    if (q2Cooldown > 0) return;
    sounds.playClick();
    setQ2Answer(val);
    if (val === 'or_at_least_one') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setQ2Cooldown(5);
    }
  };

  // Scoring
  let correctCount = 0;
  if (isQ1Correct) correctCount += 2;
  if (isQ2Correct) correctCount += 2;

  const totalQuestions = 4;
  const earnedScore = Math.round((correctCount / totalQuestions) * 15);
  const canProceed = correctCount >= 2;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn select-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-pink-950/60 border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-purple-500/20 border border-purple-400/40 rounded-2xl text-purple-300 text-3xl shrink-0 shadow-inner">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase tracking-widest mb-1">
              <span>{lang === 'en' ? 'Module 5B • Page 5 of 7' : 'Modulul 5B • Pagina 5 din 7'}</span>
              <span>•</span>
              <span className="text-slate-400">{lang === 'en' ? 'Textbook p. 68–69' : 'Manual pag. 68–69'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              {lang === 'en' ? '5. Logical Operators (AND, OR, NOT) & Truth Tables' : '5. Operatori Logici (ȘI, SAU, NU) & Tabele de Adevăr'}
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              {lang === 'en'
                ? 'Complex decision conditions are built using logical operators: AND (both must be true), OR (at least one must be true), and NOT (inverts truth value). Explore the truth table simulator!'
                : 'Condițiile compuse combină expresii simple prin operatori logici: ȘI (ambele condiții trebuie să fie adevărate), SAU (cel puțin o condiție să fie adevărată) și NU (negație).'}
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Interactive Truth Table Simulator */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <GitMerge className="w-6 h-6 text-purple-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-heading">
                {lang === 'en' ? 'Interactive Truth Engine Simulator' : 'Simulator: Evaluarea Expresiilor Logice Compuse'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'en' ? 'Toggle condition switches and operator to observe the live boolean output' : 'Comută starea condițiilor A și B și alege operatorul ȘI / SAU'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Switches */}
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Condiția A (ex: Are Bilet)</div>
                <div className="text-[11px] text-slate-400 font-mono">Stare: {condA ? 'Adevărat (True)' : 'Fals (False)'}</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCondA(!condA);
                  sounds.playClick();
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  condA ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {condA ? 'ADEVĂRAT' : 'FALS'}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Condiția B (ex: Are Vârsta &gt;= 10)</div>
                <div className="text-[11px] text-slate-400 font-mono">Stare: {condB ? 'Adevărat (True)' : 'Fals (False)'}</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCondB(!condB);
                  sounds.playClick();
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  condB ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {condB ? 'ADEVĂRAT' : 'FALS'}
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setOperator('AND');
                  sounds.playClick();
                }}
                className={`flex-1 py-2.5 rounded-xl border font-mono text-xs font-bold transition cursor-pointer ${
                  operator === 'AND'
                    ? 'bg-purple-600 border-purple-400 text-white shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Operator ȘI (AND)
              </button>
              <button
                type="button"
                onClick={() => {
                  setOperator('OR');
                  sounds.playClick();
                }}
                className={`flex-1 py-2.5 rounded-xl border font-mono text-xs font-bold transition cursor-pointer ${
                  operator === 'OR'
                    ? 'bg-purple-600 border-purple-400 text-white shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Operator SAU (OR)
              </button>
            </div>
          </div>

          {/* Logic Result Box */}
          <div className="p-6 rounded-3xl bg-slate-950 border-2 border-purple-500/40 flex flex-col items-center justify-center text-center space-y-3 font-mono">
            <div className="text-xs font-bold text-purple-400 uppercase tracking-widest">
              Expresia Evaluată:
            </div>
            <div className="text-sm sm:text-base font-bold text-white bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
              {condA ? 'Adevărat' : 'Fals'} <span className="text-purple-400 font-black">{operator === 'AND' ? 'ȘI' : 'SAU'}</span> {condB ? 'Adevărat' : 'Fals'}
            </div>
            <div className="text-xs text-slate-400">Rezultat Final:</div>
            <div className={`text-2xl sm:text-3xl font-black px-6 py-2 rounded-2xl border ${
              resultLogic
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-4 ring-emerald-500/20'
                : 'bg-rose-950/80 border-rose-500 text-rose-300 ring-4 ring-rose-500/20'
            }`}>
              {resultLogic ? '🟢 ADEVĂRAT' : '🔴 FALS'}
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Knowledge Assessment Quiz */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white border-b border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-purple-400" />
          <span>{lang === 'en' ? 'Check Your Knowledge: Logic Truth Rules' : 'Verifică-ți Cunoștințele: Regulile Operatorilor Logici'}</span>
        </div>

        {/* Q1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-purple-400 uppercase font-mono">
            {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'When is the compound expression (Condition A AND Condition B) evaluated as TRUE?'
              : 'Când este expresia compusă (Condiția A ȘI Condiția B) evaluată ca fiind ADEVĂRATĂ?'}
          </div>

          {(q1Cooldown || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={q1Cooldown}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza regula operatorului ȘI (ambele condiții trebuie să fie simultan adevărate)."
                customMessageEn="Incorrect answer! Please take 5 seconds to review the AND operator rule."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { id: 'and_both_true', text: lang === 'en' ? 'A) ONLY when BOTH conditions A and B are simultaneously TRUE' : 'A) DOAR atunci când AMBELE condiții A și B sunt simultan ADEVĂRATE' },
              { id: 'only_one', text: lang === 'en' ? 'B) If at least one is false' : 'B) Dacă cel puțin una este falsă' },
              { id: 'both_false', text: lang === 'en' ? 'C) Only when both are False' : 'C) Doar când ambele sunt false' },
              { id: 'random', text: lang === 'en' ? 'D) Depends on current time' : 'D) Depinde de ceasul calculatorului' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={q1Cooldown > 0}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                  q1Cooldown > 0 ? 'opacity-60 cursor-not-allowed' : ''
                } ${
                  q1Answer === opt.id
                    ? opt.id === 'and_both_true'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="algo_logic_q1"
            hintRo="Operatorul ȘI este strict: ambele cerințe trebuie respectate în totalitate."
            hintEn="The AND operator is strict: both requirements must be fully satisfied."
          />

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              cooldown={q1Cooldown}
              explanation={
                isQ1Correct
                  ? (lang === 'en' ? 'Spot on! (True AND True) yields True; if either operand is False, AND yields False.' : 'Exact! Operatorul logic ȘI returnează ADEVĂRAT doar dacă ambele condiții legate sunt Adevărate.')
                  : (lang === 'en' ? 'Incorrect. AND requires both conditions to be True.' : 'Incorect. Pentru operatorul ȘI, este obligatoriu ca ambele condiții să fie Adevărate.')
              }
              ruleReference="Manual TIC pag. 68"
            />
          )}
        </div>

        {/* Q2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-purple-400 uppercase font-mono">
            {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'When is the compound expression (Condition A OR Condition B) evaluated as TRUE?'
              : 'Când este expresia compusă (Condiția A SAU Condiția B) evaluată ca fiind ADEVĂRATĂ?'}
          </div>

          {(q2Cooldown || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={q2Cooldown}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza regula operatorului SAU (este suficient ca cel puțin o condiție să fie adevărată)."
                customMessageEn="Incorrect answer! Please take 5 seconds to review the OR operator rule."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { id: 'or_at_least_one', text: lang === 'en' ? 'A) When AT LEAST ONE of the conditions A or B is TRUE' : 'A) Când CEL PUȚIN UNA dintre condițiile A sau B este ADEVĂRATĂ' },
              { id: 'only_if_both_false', text: lang === 'en' ? 'B) Only when both are completely False' : 'B) Doar când ambele sunt complet False' },
              { id: 'never_true', text: lang === 'en' ? 'C) OR is never evaluated' : 'C) Operatorul SAU nu funcționează niciodată' },
              { id: 'requires_three', text: lang === 'en' ? 'D) Requires 3 conditions' : 'D) Necesită minim 3 condiții' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={q2Cooldown > 0}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                  q2Cooldown > 0 ? 'opacity-60 cursor-not-allowed' : ''
                } ${
                  q2Answer === opt.id
                    ? opt.id === 'or_at_least_one'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="algo_logic_q2"
            hintRo="Operatorul SAU este flexibil: este suficient ca măcar o singură variantă să fie adevărată."
            hintEn="The OR operator is flexible: it suffices that at least one condition is true."
          />

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              cooldown={q2Cooldown}
              explanation={
                isQ2Correct
                  ? (lang === 'en' ? 'Correct! OR requires only one condition to be True to yield a True result.' : 'Corect! Operatorul SAU returnează ADEVĂRAT dacă cel puțin una dintre expresii este Adevărată.')
                  : (lang === 'en' ? 'Incorrect. OR requires at least one True condition.' : 'Incorect. Pentru operatorul SAU, este suficient ca o singură condiție să fie Adevărată.')
              }
              ruleReference="Manual TIC pag. 69"
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        score={earnedScore}
        totalPoints={15}
        correctCount={correctCount}
        totalQuestions={totalQuestions}
        canProceed={canProceed}
        onProceed={() => {
          sounds.playCorrect();
          onCompletePage(earnedScore);
        }}
      />
    </div>
  );
};
