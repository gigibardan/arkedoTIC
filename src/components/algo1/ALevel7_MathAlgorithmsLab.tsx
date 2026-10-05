import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Square, 
  RectangleHorizontal,
  Award,
  Check
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface ALevel7Props {
  onCompletePage: (earnedScore: number) => void;
}

export const ALevel7_MathAlgorithmsLab: React.FC<ALevel7Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive Geometry Formula Calculator State
  const [lengthL, setLengthL] = useState<number>(8);
  const [widthW, setWidthW] = useState<number>(5);

  const rectPerimeter = 2 * (lengthL + widthW);
  const rectArea = lengthL * widthW;

  // Summative Quiz State
  const [answers, setAnswers] = useState<Record<string, number | null>>({
    q1: null,
    q2: null,
    q3: null,
    q4: null
  });
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  // Timer cooldown decrement
  useEffect(() => {
    const hasActive = Object.values(cooldowns).some((c: number) => c > 0);
    if (!hasActive) return;
    const timer = setInterval(() => {
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
  }, [cooldowns]);

  const correctAnswers: Record<string, number> = {
    q1: 0, // Succesiune finită și ordonată de operații
    q2: 1, // Generalitate
    q3: 2, // 1. AUX = A; 2. A = B; 3. B = AUX
    q4: 1  // P = 2*(L+l) și A = L*l
  };

  const handleSelectAnswer = (qKey: string, optIdx: number) => {
    if ((cooldowns[qKey] || 0) > 0) return;
    sounds.playClick();
    setAnswers(prev => ({ ...prev, [qKey]: optIdx }));
    if (optIdx === correctAnswers[qKey]) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, [qKey]: 5 }));
    }
  };

  // Scoring
  let correctCount = 0;
  Object.keys(correctAnswers).forEach(k => {
    if (answers[k] === correctAnswers[k]) correctCount++;
  });

  const totalQuestions = 4;
  const earnedScore = Math.round((correctCount / totalQuestions) * 15);
  const canProceed = correctCount >= 3;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn select-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-cyan-500/20 border border-cyan-400/40 rounded-2xl text-cyan-300 text-3xl shrink-0 shadow-inner">
            📐
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-1">
              <span>{lang === 'en' ? 'Module 5A • Page 7 of 7' : 'Modulul 5A • Pagina 7 din 7'}</span>
              <span>•</span>
              <span className="text-slate-400">{lang === 'en' ? 'Textbook p. 61' : 'Manual pag. 61'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              {lang === 'en' ? '7. Mathematical Sequential Algorithms & Final Evaluation' : '7. Algoritmi Matematici Secvențiali & Evaluare Finală'}
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              {lang === 'en'
                ? 'Discover how computers execute mathematical calculation algorithms (Area and Perimeter) sequentially, and complete the summative evaluation for Module 5A!'
                : 'Descoperă cum execută calculatorul formulele matematice (Perimetru și Arie) în pași secvențiali și susține evaluarea sumativă pentru finalizarea Misiunii 5A!'}
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Geometry Formula Simulator */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-6 h-6 text-cyan-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-heading">
                {lang === 'en' ? 'Sequential Math Engine: Rectangle Perimeter & Area' : 'Laborator: Algoritmul Calculului Ariei și Perimetrului'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'en' ? 'Textbook page 61, Exercises 4 & 5' : 'Manual pagina 61, Exercițiile 4 și 5'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Input Controls */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>{lang === 'en' ? 'Length L (Lungime):' : 'Lungimea L (cm):'}</span>
                <span className="font-mono text-cyan-400 text-sm">{lengthL} cm</span>
              </div>
              <input
                type="range"
                min={2}
                max={20}
                value={lengthL}
                onChange={(e) => {
                  setLengthL(Number(e.target.value));
                  sounds.playClick();
                }}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>{lang === 'en' ? 'Width l (Lățime):' : 'Lățimea l (cm):'}</span>
                <span className="font-mono text-cyan-400 text-sm">{widthW} cm</span>
              </div>
              <input
                type="range"
                min={1}
                max={15}
                value={widthW}
                onChange={(e) => {
                  setWidthW(Number(e.target.value));
                  sounds.playClick();
                }}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Sequential Execution Trace Card */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              {lang === 'en' ? 'Sequential Execution Pipeline:' : 'Pașii Algoritmului Secvențial:'}
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span>1. Citește date de intrare:</span>
                <span className="text-cyan-300 font-bold">L={lengthL}, l={widthW}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span>2. Calculează Perimetru P = 2*(L+l):</span>
                <span className="text-amber-300 font-bold">P = {rectPerimeter} cm</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span>3. Calculează Arie A = L*l:</span>
                <span className="text-emerald-300 font-bold">A = {rectArea} cm²</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span>4. Afișează date de ieșire:</span>
                <span className="text-purple-300 font-bold">P={rectPerimeter}, A={rectArea}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Summative Assessment Quiz */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white border-b border-slate-800 pb-3">
          <Award className="w-5 h-5 text-cyan-400" />
          <span>{lang === 'en' ? 'Summative Evaluation: Module 5A Synthesis' : 'Evaluare Sumativă: Sinteza Modulului 5A'}</span>
        </div>

        {/* Q1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-cyan-400 uppercase font-mono">
            {lang === 'en' ? 'Question 1 of 4' : 'Întrebarea 1 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'Which definition expresses the exact concept of an algorithm?'
              : 'Care este definiția completă și corectă a unui algoritm?'}
          </div>

          {(cooldowns.q1 || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q1}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a citi din nou definiția din manual (pag. 54)."
                customMessageEn="Incorrect answer! Please take 5 seconds to review the algorithm definition."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) A finite, ordered set of precise operations solving a problem' : 'A) O succesiune finită și ordonată de operații bine precizate ce rezolvă o problemă',
              lang === 'en' ? 'B) An infinite collection of numbers without any order' : 'B) O colecție infinită de numere fără nicio ordine',
              lang === 'en' ? 'C) An electronic cable connecting the monitor' : 'C) Un cablu electronic de conectare a monitorului',
              lang === 'en' ? 'D) A secret password that cannot be decoded' : 'D) O parolă secretă care nu se poate descifra'
            ].map((opt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={(cooldowns.q1 || 0) > 0}
                onClick={() => handleSelectAnswer('q1', idx)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                  (cooldowns.q1 || 0) > 0 ? 'opacity-60 cursor-not-allowed' : ''
                } ${
                  answers.q1 === idx
                    ? idx === correctAnswers.q1
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="algo_sum_q1"
            hintRo="Algoritmul este finit, ordonat și are un scop bine determinat."
            hintEn="The algorithm is finite, ordered, and serves a well-defined goal."
          />

          {answers.q1 !== null && (
            <AnswerExplanation
              isCorrect={answers.q1 === correctAnswers.q1}
              cooldown={cooldowns.q1}
              explanation={
                answers.q1 === correctAnswers.q1
                  ? (lang === 'en' ? 'Correct! Finiteness and determinism are core pillars of an algorithm.' : 'Corect! Finitudinea și ordinea determinată sunt pilonii oricărui algoritm.')
                  : (lang === 'en' ? 'Incorrect. An algorithm is a finite, ordered sequence of operations.' : 'Incorect. Algoritmul reprezintă o succesiune finită și ordonată de pași.')
              }
              ruleReference="Manual TIC pag. 54"
            />
          )}
        </div>

        {/* Q2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-cyan-400 uppercase font-mono">
            {lang === 'en' ? 'Question 2 of 4' : 'Întrebarea 2 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'Which property ensures that an algorithm works for any rectangle, not just one with sides of 5 and 3?'
              : 'Care proprietate asigură că algoritmul ariei funcționează pentru orice dreptunghi, nu doar pentru unul cu laturile de 5 și 3?'}
          </div>

          {(cooldowns.q2 || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q2}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza proprietatea de Generalitate."
                customMessageEn="Incorrect answer! Please take 5 seconds to reflect on Generality."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) Clarity (Claritate)' : 'A) Claritate',
              lang === 'en' ? 'B) Generality (Generalitate)' : 'B) Generalitate',
              lang === 'en' ? 'C) Randomness' : 'C) Întâmplare',
              lang === 'en' ? 'D) Ambiguity' : 'D) Ambiguitate'
            ].map((opt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={(cooldowns.q2 || 0) > 0}
                onClick={() => handleSelectAnswer('q2', idx)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                  (cooldowns.q2 || 0) > 0 ? 'opacity-60 cursor-not-allowed' : ''
                } ${
                  answers.q2 === idx
                    ? idx === correctAnswers.q2
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="algo_sum_q2"
            hintRo="Proprietatea care permite rezolvarea unei clase întregi de probleme este Generalitatea."
            hintEn="The property that covers an entire family of problems is Generality."
          />

          {answers.q2 !== null && (
            <AnswerExplanation
              isCorrect={answers.q2 === correctAnswers.q2}
              cooldown={cooldowns.q2}
              explanation={
                answers.q2 === correctAnswers.q2
                  ? (lang === 'en' ? 'Spot on! Generality ensures the formula applies to all possible rectangular dimensions.' : 'Exact! Generalitatea garantează aplicarea algoritmului pe orice dimensiuni de intrare.')
                  : (lang === 'en' ? 'Incorrect. The property is Generality.' : 'Incorect. Proprietatea căutată este Generalitatea.')
              }
              ruleReference="Manual TIC pag. 56"
            />
          )}
        </div>

        {/* Q3 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-cyan-400 uppercase font-mono">
            {lang === 'en' ? 'Question 3 of 4' : 'Întrebarea 3 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'In the Three Glasses swap algorithm, what is the exact 3-step assignment order to swap A and B?'
              : 'În algoritmul celor 3 pahare, care este secvența exactă de atribuiri pentru a interschimba valorile A și B?'}
          </div>

          {(cooldowns.q3 || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q3}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza cei 3 pași: AUX=A, A=B, B=AUX."
                customMessageEn="Incorrect answer! Please take 5 seconds to review the 3 steps: AUX=A, A=B, B=AUX."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) 1. A = B   2. B = AUX   3. AUX = A' : 'A) 1. A = B    2. B = AUX    3. AUX = A',
              lang === 'en' ? 'B) 1. B = A   2. A = AUX   3. AUX = B' : 'B) 1. B = A    2. A = AUX    3. AUX = B',
              lang === 'en' ? 'C) 1. AUX = A   2. A = B   3. B = AUX' : 'C) 1. AUX = A    2. A = B    3. B = AUX',
              lang === 'en' ? 'D) 1. A = A   2. B = B   3. AUX = 0' : 'D) 1. A = A    2. B = B    3. AUX = 0'
            ].map((opt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={(cooldowns.q3 || 0) > 0}
                onClick={() => handleSelectAnswer('q3', idx)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer font-mono ${
                  (cooldowns.q3 || 0) > 0 ? 'opacity-60 cursor-not-allowed' : ''
                } ${
                  answers.q3 === idx
                    ? idx === correctAnswers.q3
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="algo_sum_q3"
            hintRo="Salvez mai întâi valoarea din A în AUX, apoi copiez B în A, apoi pun AUX în B."
            hintEn="First save A into AUX, then copy B into A, then place AUX into B."
          />

          {answers.q3 !== null && (
            <AnswerExplanation
              isCorrect={answers.q3 === correctAnswers.q3}
              cooldown={cooldowns.q3}
              explanation={
                answers.q3 === correctAnswers.q3
                  ? (lang === 'en' ? 'Perfect! AUX=A, A=B, B=AUX safely swaps values without data overwriting.' : 'Perfect! Ordinea clasică AUX=A, A=B, B=AUX păstrează datele în siguranță.')
                  : (lang === 'en' ? 'Incorrect. The valid sequence is AUX=A, A=B, B=AUX.' : 'Incorect. Secvența corectă este AUX=A, A=B, B=AUX.')
              }
              ruleReference="Manual TIC pag. 60"
            />
          )}
        </div>

        {/* Q4 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-cyan-400 uppercase font-mono">
            {lang === 'en' ? 'Question 4 of 4' : 'Întrebarea 4 din 4'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'For a rectangle with Length L = 10 cm and Width l = 4 cm, what are the output values P and A?'
              : 'Pentru un dreptunghi cu Lungimea L = 10 cm și Lățimea l = 4 cm, care sunt datele de ieșire P (perimetru) și A (arie)?'}
          </div>

          {(cooldowns.q4 || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q4}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a calcula: P = 2*(10+4) = 28 și A = 10*4 = 40."
                customMessageEn="Incorrect answer! Please take 5 seconds to calculate: P = 2*(10+4) = 28 and A = 10*4 = 40."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              lang === 'en' ? 'A) P = 14 cm, A = 14 cm²' : 'A) P = 14 cm, A = 14 cm²',
              lang === 'en' ? 'B) P = 28 cm, A = 40 cm²' : 'B) P = 28 cm, A = 40 cm²',
              lang === 'en' ? 'C) P = 40 cm, A = 28 cm²' : 'C) P = 40 cm, A = 28 cm²',
              lang === 'en' ? 'D) P = 100 cm, A = 4 cm²' : 'D) P = 100 cm, A = 4 cm²'
            ].map((opt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={(cooldowns.q4 || 0) > 0}
                onClick={() => handleSelectAnswer('q4', idx)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer font-mono ${
                  (cooldowns.q4 || 0) > 0 ? 'opacity-60 cursor-not-allowed' : ''
                } ${
                  answers.q4 === idx
                    ? idx === correctAnswers.q4
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="algo_sum_q4"
            hintRo="P = 2 × (10 + 4) = 2 × 14 = 28 cm; A = 10 × 4 = 40 cm²."
            hintEn="P = 2 × (10 + 4) = 2 × 14 = 28 cm; A = 10 × 4 = 40 cm²."
          />

          {answers.q4 !== null && (
            <AnswerExplanation
              isCorrect={answers.q4 === correctAnswers.q4}
              cooldown={cooldowns.q4}
              explanation={
                answers.q4 === correctAnswers.q4
                  ? (lang === 'en' ? 'Correct! P = 2*(10+4) = 28 cm and A = 10*4 = 40 cm².' : 'Corect! P = 2 × (10 + 4) = 28 cm, iar A = 10 × 4 = 40 cm².')
                  : (lang === 'en' ? 'Incorrect. P = 2*(L+l) = 28 cm, A = L*l = 40 cm².' : 'Incorect. Calculează: P = 2*(10+4) = 28 cm și A = 10*4 = 40 cm².')
              }
              ruleReference="Manual TIC pag. 61"
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
          sounds.playVictory();
          onCompletePage(earnedScore);
        }}
      />
    </div>
  );
};
