import React, { useState, useEffect } from 'react';
import { 
  Percent, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Divide, 
  Calculator, 
  RotateCcw,
  Check
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface A2Level4Props {
  onCompletePage: (earnedScore: number) => void;
}

export const A2Level4_OperatorsAndExpressions: React.FC<A2Level4Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // DIV / MOD Interactive Simulator State
  const [candies, setCandies] = useState<number>(17);
  const [children, setChildren] = useState<number>(5);

  const quotientDiv = Math.floor(candies / children);
  const remainderMod = candies % children;

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
  const isQ1Correct = q1Answer === 'div_3_mod_2';
  const handleQ1 = (val: string) => {
    if (q1Cooldown > 0) return;
    sounds.playClick();
    setQ1Answer(val);
    if (val === 'div_3_mod_2') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setQ1Cooldown(5);
    }
  };

  const isQ2Correct = q2Answer === 'relational_diff';
  const handleQ2 = (val: string) => {
    if (q2Cooldown > 0) return;
    sounds.playClick();
    setQ2Answer(val);
    if (val === 'relational_diff') {
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
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-sky-950/60 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-cyan-500/20 border border-cyan-400/40 rounded-2xl text-cyan-300 text-3xl shrink-0 shadow-inner">
            ➗
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-1">
              <span>{lang === 'en' ? 'Module 5B • Page 4 of 7' : 'Modulul 5B • Pagina 4 din 7'}</span>
              <span>•</span>
              <span className="text-slate-400">{lang === 'en' ? 'Textbook p. 66–67' : 'Manual pag. 66–67'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              {lang === 'en' ? '4. Arithmetic Operators, DIV & MOD, and Comparisons' : '4. Operatori Aritmetici, Câtul (DIV), Restul (MOD) & Relații'}
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              {lang === 'en'
                ? 'Discover arithmetic computation operators (+, -, *, /), the famous integer division operators DIV (quotient) and MOD (remainder), and comparison relations (=, <>, <, >, <=, >=).'
                : 'În informatică, împărțirea numerelor întregi ne oferă două rezultate valoroase: câtul întreg (DIV) și restul împărțirii (MOD sau %). Explorează operatorii aritmetici și de comparație!'}
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Interactive DIV & MOD Candy Distribution Lab */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Divide className="w-6 h-6 text-cyan-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-heading">
                {lang === 'en' ? 'DIV & MOD Explorer: The Candy Distribution Experiment' : 'Laborator Interactiv: Împărțirea Întreagă DIV & Restul MOD'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'en' ? 'Textbook page 66, Practice Box' : 'Manual pagina 66, Caseta Descoperiți'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Sliders */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>{lang === 'en' ? 'Total Candies (Deîmpărțit a):' : 'Număr total de bomboane (Deîmpărțit A):'}</span>
                <span className="font-mono text-cyan-400 text-sm">{candies} 🍬</span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                value={candies}
                onChange={(e) => {
                  setCandies(Number(e.target.value));
                  sounds.playClick();
                }}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>{lang === 'en' ? 'Children Sharing (Împărțitor b):' : 'Număr de copii (Împărțitor B):'}</span>
                <span className="font-mono text-cyan-400 text-sm">{children} 🧒</span>
              </div>
              <input
                type="range"
                min={2}
                max={8}
                value={children}
                onChange={(e) => {
                  setChildren(Number(e.target.value));
                  sounds.playClick();
                }}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Results Comparison Grid */}
          <div className="grid grid-cols-2 gap-3 font-mono">
            <div className="p-4 rounded-2xl bg-slate-950 border-2 border-emerald-500/50 space-y-1 text-center">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                DIV (Câtul Întreg)
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {quotientDiv}
              </div>
              <div className="text-[10px] text-slate-400">
                {candies} DIV {children} = {quotientDiv} bomboane / copil
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border-2 border-amber-500/50 space-y-1 text-center">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                MOD (Restul)
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {remainderMod}
              </div>
              <div className="text-[10px] text-slate-400">
                {candies} MOD {children} = {remainderMod} rămase în bol
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Knowledge Assessment Quiz */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white border-b border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <span>{lang === 'en' ? 'Check Your Knowledge: Operators, DIV and MOD' : 'Verifică-ți Cunoștințele: Operatori, DIV și MOD'}</span>
        </div>

        {/* Q1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-cyan-400 uppercase font-mono">
            {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'What are the results of the operations (23 DIV 5) and (23 MOD 5)?'
              : 'Care sunt rezultatele operațiilor (23 DIV 5) și (23 MOD 5)?'}
          </div>

          {(q1Cooldown || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={q1Cooldown}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a calcula: 23 împărțit la 5 dă câtul 4 și restul 3 (deoarece 4 * 5 + 3 = 23)."
                customMessageEn="Incorrect answer! Please take 5 seconds to calculate: 23 / 5 gives quotient 4 and remainder 3."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 font-mono">
            {[
              { id: 'div_3_mod_2', text: lang === 'en' ? 'A) 23 DIV 5 = 4  și  23 MOD 5 = 3' : 'A) 23 DIV 5 = 4  și  23 MOD 5 = 3' },
              { id: 'wrong_1', text: lang === 'en' ? 'B) 23 DIV 5 = 3  și  23 MOD 5 = 4' : 'B) 23 DIV 5 = 3  și  23 MOD 5 = 4' },
              { id: 'wrong_2', text: lang === 'en' ? 'C) 23 DIV 5 = 5  și  23 MOD 5 = 0' : 'C) 23 DIV 5 = 5  și  23 MOD 5 = 0' },
              { id: 'wrong_3', text: lang === 'en' ? 'D) 23 DIV 5 = 10  și  23 MOD 5 = 1' : 'D) 23 DIV 5 = 10  și  23 MOD 5 = 1' }
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
                    ? opt.id === 'div_3_mod_2'
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
            hintId="algo_op_q1"
            hintRo="23 = 4 × 5 + 3. Câtul întreg este 4 (DIV), iar restul este 3 (MOD)."
            hintEn="23 = 4 × 5 + 3. The quotient is 4 (DIV), and the remainder is 3 (MOD)."
          />

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              cooldown={q1Cooldown}
              explanation={
                isQ1Correct
                  ? (lang === 'en' ? 'Spot on! 23 = 4 * 5 + 3. Thus DIV = 4 and MOD = 3.' : 'Exact! 23 împărțit la 5 dă câtul 4 (DIV) și restul 3 (MOD), deoarece 4 * 5 + 3 = 23.')
                  : (lang === 'en' ? 'Incorrect. 23 DIV 5 = 4 and 23 MOD 5 = 3.' : 'Incorect. Câtul este 4 și restul este 3.')
              }
              ruleReference="Manual TIC pag. 66"
            />
          )}
        </div>

        {/* Q2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-cyan-400 uppercase font-mono">
            {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'Which comparison operator stands for "Different / Not Equal to" in algorithmic pseudocode?'
              : 'Ce simbol reprezintă operatorul relațional „Diferit de” (Not Equal) în pseudocodul informatic din manual?'}
          </div>

          {(q2Cooldown || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={q2Cooldown}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza simbolul <> (diferit de)."
                customMessageEn="Incorrect answer! Please take 5 seconds to review the <> symbol."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 font-mono">
            {[
              { id: 'relational_diff', text: lang === 'en' ? 'A) <> (sau !=)' : 'A) <> (sau != în limbaje moderne)' },
              { id: 'relational_equal', text: lang === 'en' ? 'B) = (Egal)' : 'B) = (Egal)' },
              { id: 'relational_less', text: lang === 'en' ? 'C) < (Mai mic)' : 'C) < (Mai mic)' },
              { id: 'relational_plus', text: lang === 'en' ? 'D) + (Plus)' : 'D) + (Adunare)' }
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
                    ? opt.id === 'relational_diff'
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
            hintId="algo_op_q2"
            hintRo="Semnul mai mic combinat cu mai mare (<>) înseamnă diferit."
            hintEn="Less-than combined with greater-than (<>) stands for not equal."
          />

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              cooldown={q2Cooldown}
              explanation={
                isQ2Correct
                  ? (lang === 'en' ? 'Correct! <> denotes "not equal to" across textbooks and pseudocode standards.' : 'Corect! Simbolul <> reprezintă relația de inegalitate (diferit de) în pseudocod.')
                  : (lang === 'en' ? 'Incorrect. <> is the difference relation.' : 'Incorect. Operatorul relațional pentru diferit este <>.')
              }
              ruleReference="Manual TIC pag. 67"
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
