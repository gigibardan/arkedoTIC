import React, { useState, useEffect } from 'react';
import { 
  GitCommit, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  ArrowRight, 
  Check, 
  RotateCcw,
  Coffee,
  Sun,
  Footprints
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface ALevel1Props {
  onCompletePage: (earnedScore: number) => void;
}

interface StepItem {
  id: string;
  textRo: string;
  textEn: string;
}

const INITIAL_TEA_STEPS: StepItem[] = [
  { id: 'pour_water', textRo: '3. Se toarnă apa fierbinte în cană peste pliculeț', textEn: '3. Pour boiling water into the cup over the bag' },
  { id: 'add_tea', textRo: '2. Se așază pliculețul de ceai în cană', textEn: '2. Place the tea bag inside the cup' },
  { id: 'boil_water', textRo: '1. Se pune apa la fiert în ceainic', textEn: '1. Put water in kettle to boil' },
  { id: 'sweeten', textRo: '5. Se adaugă o linguriță de miere sau lămâie (opțional)', textEn: '5. Add a teaspoon of honey or lemon (optional)' },
  { id: 'wait_infuse', textRo: '4. Se lasă la infuzat 3-5 minute și se scoate pliculețul', textEn: '4. Let infuse for 3-5 minutes and remove bag' },
];

const CORRECT_TEA_ORDER = ['boil_water', 'add_tea', 'pour_water', 'wait_infuse', 'sweeten'];

export const ALevel1_WhatIsAlgorithm: React.FC<ALevel1Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Tea Making Algorithm Step Ordering State
  const [teaSteps, setTeaSteps] = useState<StepItem[]>(INITIAL_TEA_STEPS);
  const [teaValidated, setTeaValidated] = useState<boolean>(false);
  const [teaCooldown, setTeaCooldown] = useState<number>(0);

  // Quiz State
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q1Cooldown, setQ1Cooldown] = useState<number>(0);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q2Cooldown, setQ2Cooldown] = useState<number>(0);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);
  const [q3Cooldown, setQ3Cooldown] = useState<number>(0);

  // Timer cooldown decrement
  useEffect(() => {
    if (teaCooldown <= 0 && q1Cooldown <= 0 && q2Cooldown <= 0 && q3Cooldown <= 0) return;
    const timer = setInterval(() => {
      if (teaCooldown > 0) setTeaCooldown(prev => (prev <= 1 ? 0 : prev - 1));
      if (q1Cooldown > 0) setQ1Cooldown(prev => (prev <= 1 ? 0 : prev - 1));
      if (q2Cooldown > 0) setQ2Cooldown(prev => (prev <= 1 ? 0 : prev - 1));
      if (q3Cooldown > 0) setQ3Cooldown(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [teaCooldown, q1Cooldown, q2Cooldown, q3Cooldown]);

  const moveStep = (index: number, direction: 'up' | 'down') => {
    sounds.playClick();
    const newSteps = [...teaSteps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSteps.length) return;
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIndex];
    newSteps[targetIndex] = temp;
    setTeaSteps(newSteps);
    setTeaValidated(false);
  };

  const isTeaOrderCorrect = teaSteps.every((step, idx) => step.id === CORRECT_TEA_ORDER[idx]);

  const handleValidateTea = () => {
    if (teaCooldown > 0) return;
    setTeaValidated(true);
    if (isTeaOrderCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setTeaCooldown(5);
    }
  };

  const handleResetTea = () => {
    sounds.playClick();
    setTeaSteps(INITIAL_TEA_STEPS);
    setTeaValidated(false);
  };

  // Quiz handlers
  const isQ1Correct = q1Answer === 'finite_steps';
  const handleQ1 = (val: string) => {
    if (q1Cooldown > 0) return;
    sounds.playClick();
    setQ1Answer(val);
    if (val === 'finite_steps') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setQ1Cooldown(5);
    }
  };

  const isQ2Correct = q2Answer === 'ordered_order';
  const handleQ2 = (val: string) => {
    if (q2Cooldown > 0) return;
    sounds.playClick();
    setQ2Answer(val);
    if (val === 'ordered_order') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setQ2Cooldown(5);
    }
  };

  const isQ3Correct = q3Answer === 'all_problems';
  const handleQ3 = (val: string) => {
    if (q3Cooldown > 0) return;
    sounds.playClick();
    setQ3Answer(val);
    if (val === 'all_problems') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setQ3Cooldown(5);
    }
  };

  // Scoring
  let correctCount = 0;
  if (teaValidated && isTeaOrderCorrect) correctCount++;
  if (isQ1Correct) correctCount++;
  if (isQ2Correct) correctCount++;
  if (isQ3Correct) correctCount++;

  const totalQuestions = 4;
  const earnedScore = Math.round((correctCount / totalQuestions) * 15);
  const canProceed = correctCount >= 3;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn select-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900/60 via-slate-900 to-orange-900/60 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-amber-500/20 border border-amber-400/40 rounded-2xl text-amber-300 text-3xl shrink-0 shadow-inner">
            🧩
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest mb-1">
              <span>{lang === 'en' ? 'Module 5A • Page 1 of 7' : 'Modulul 5A • Pagina 1 din 7'}</span>
              <span>•</span>
              <span className="text-slate-400">{lang === 'en' ? 'Textbook p. 54–55' : 'Manual pag. 54–55'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              {lang === 'en' ? '1. What is an Algorithm? Everyday Steps' : '1. Noțiunea de Algoritm & Pașii din Viața de Zi cu Zi'}
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              {lang === 'en'
                ? 'An algorithm is a clear, finite sequence of precise steps executed in a specific order to solve a problem or achieve a goal. Discover how we use algorithms every morning without even realizing it!'
                : 'Un algoritm este o succesiune finită și ordonată de pași preciși și clari prin care rezolvăm o problemă sau atingem un scop. În viața de zi cu zi, aplicăm algoritmi la prepararea ceaiului, la traversarea străzii sau la spălatul pe dinți!'}
            </p>
          </div>
        </div>
      </div>

      {/* Theory Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
            📜
          </div>
          <h3 className="text-sm font-bold text-white">
            {lang === 'en' ? 'Originea Numelui' : 'Originea Numelui'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'Named after the 9th-century Persian mathematician Al-Khwarizmi, who pioneered systematic step-by-step problem solving.'
              : 'Termenul provine de la matematicianul persan Al-Khwarizmi (sec. IX), care a descris regulile de calcul pas cu pas.'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-lg">
            🎯
          </div>
          <h3 className="text-sm font-bold text-white">
            {lang === 'en' ? 'Scopul Algoritmului' : 'Scopul Algoritmului'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'Transforms initial inputs (tea bag, water) into final expected outputs (a delicious warm tea) in a predictable way.'
              : 'Punctul de pornire sunt datele de intrare (apă, pliculeț), iar rezultatul final sunt datele de ieșire (ceaiul gata preparat).'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
            🤖
          </div>
          <h3 className="text-sm font-bold text-white">
            {lang === 'en' ? 'Executantul' : 'Executantul'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'An algorithm can be executed by a human, a robot, or a computer system following instructions without hesitation.'
              : 'Algoritmul este conceput de om și poate fi executat de un om, un robot sau un computer fără să devieze de la pași.'}
          </p>
        </div>
      </div>

      {/* Step 1: Interactive Tea Making Simulator */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Coffee className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-heading">
                {lang === 'en' ? 'Interactive Lab: Order the Tea-Making Algorithm' : 'Laborator Interactiv: Ordonează Algoritmul Preparării Ceaiului'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'en' ? 'Textbook page 54, Exercise 1' : 'Manual pagina 54, Exercițiul 1'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetTea}
            className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Reset Order' : 'Resetează'}</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {lang === 'en'
            ? 'Use the UP and DOWN buttons to arrange the 5 steps in the strict chronological order required to prepare a perfect tea:'
            : 'Folosește butoanele SUS (▲) și JOS (▼) pentru a așeza cei 5 pași în ordinea cronologică strictă pentru prepararea corectă a ceaiului:'}
        </p>

        {teaCooldown > 0 && (
          <PedagogicalReflectionBanner
            cooldown={teaCooldown}
            customMessageRo="Ordinea pașilor nu este corectă! Nu poți turna apa fierbinte înainte de a o fierbe. Te rugăm să acorzi 5 secunde pentru a analiza secvența logică."
            customMessageEn="The sequence of steps is incorrect! You cannot pour water before boiling it. Please take 5 seconds to reflect on the logical order."
          />
        )}

        <div className="space-y-2.5">
          {teaSteps.map((step, idx) => (
            <div
              key={step.id}
              className={`p-3.5 sm:p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                teaValidated
                  ? step.id === CORRECT_TEA_ORDER[idx]
                    ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/60 text-rose-200'
                  : 'bg-slate-950/70 border-slate-800 text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-amber-400 shrink-0">
                  {idx + 1}
                </span>
                <span className="text-xs sm:text-sm font-semibold">
                  {lang === 'en' ? step.textEn : step.textRo}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  disabled={idx === 0 || teaCooldown > 0}
                  onClick={() => moveStep(idx, 'up')}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 text-xs font-bold transition flex items-center justify-center border border-slate-700 cursor-pointer"
                  title="Mută mai sus"
                >
                  ▲
                </button>
                <button
                  type="button"
                  disabled={idx === teaSteps.length - 1 || teaCooldown > 0}
                  onClick={() => moveStep(idx, 'down')}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 text-xs font-bold transition flex items-center justify-center border border-slate-700 cursor-pointer"
                  title="Mută mai jos"
                >
                  ▼
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="text-xs font-mono text-slate-400">
            {teaValidated ? (
              isTeaOrderCorrect ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> {lang === 'en' ? 'Perfect sequence! All steps are strictly chronological.' : 'Secvență perfectă! Toți pașii sunt ordonați cronologic conform manualului.'}
                </span>
              ) : (
                <span className="text-rose-400 font-bold flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> {lang === 'en' ? 'Incorrect order. Adjust step positions.' : 'Ordinea este incorectă. Reanalizează pașii.'}
                </span>
              )
            ) : (
              <span>{lang === 'en' ? 'Position steps from first to last, then validate.' : 'Aranjează pașii de la primul la ultimul și apasă Validează.'}</span>
            )}
          </div>

          <button
            type="button"
            disabled={teaCooldown > 0}
            onClick={handleValidateTea}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer ${
              teaCooldown > 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{lang === 'en' ? 'Validate Tea Algorithm' : 'Validează Algoritmul'}</span>
          </button>
        </div>
      </div>

      {/* Step 2: Knowledge Assessment Quiz */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white border-b border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <span>{lang === 'en' ? 'Check Your Knowledge: Algorithm Fundamentals' : 'Verifică-ți Cunoștințele: Bazele Algoritmilor'}</span>
        </div>

        {/* Q1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-amber-400 uppercase font-mono">
            {lang === 'en' ? 'Question 1 of 3' : 'Întrebarea 1 din 3'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'Which statement best defines an algorithm in computer science?'
              : 'Care dintre următoarele afirmații definește cel mai corect un algoritm în informatică?'}
          </div>

          {q1Cooldown > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={q1Cooldown}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza definiția algoritmului (pași finiți și ordonați)."
                customMessageEn="Incorrect answer! Please take 5 seconds to reflect on the definition of an algorithm."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { id: 'random_draw', text: lang === 'en' ? 'A) A random artistic drawing in Paint' : 'A) Un desen artistic realizat la întâmplare în Paint' },
              { id: 'finite_steps', text: lang === 'en' ? 'B) A finite, ordered set of precise steps solving a problem' : 'B) O succesiune finită și ordonată de pași preciși ce rezolvă o problemă' },
              { id: 'infinite_loop', text: lang === 'en' ? 'C) An endless loop with no stopping point' : 'C) O serie nesfârșită de instrucțiuni care nu se opresc niciodată' },
              { id: 'hardware_cable', text: lang === 'en' ? 'D) An electrical cable inside the central unit' : 'D) Un cablu electric din interiorul unității centrale' }
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
                    ? opt.id === 'finite_steps'
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
            hintId="algo_q1_def"
            hintRo="Un algoritm trebuie să aibă un sfârșit (finitudine) și pași clari ordonați logic."
            hintEn="An algorithm must have a definite end (finiteness) and clear logically ordered steps."
          />

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              cooldown={q1Cooldown}
              explanation={
                isQ1Correct
                  ? (lang === 'en' ? 'Spot on! An algorithm is precisely a finite, well-ordered sequence of instructions leading to a result.' : 'Exact! Algoritmul este o succesiune finită și bine determinată de pași care duc la rezolvarea unei probleme.')
                  : (lang === 'en' ? 'Incorrect. An algorithm must be finite and logically ordered.' : 'Incorect. Un algoritm trebuie să fie finit, ordonat și să rezolve o problemă dată.')
              }
              ruleReference="Manual TIC pag. 54"
            />
          )}
        </div>

        {/* Q2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-amber-400 uppercase font-mono">
            {lang === 'en' ? 'Question 2 of 3' : 'Întrebarea 2 din 3'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'Why is the strict order of steps crucial in an algorithm?'
              : 'De ce este ordinea strictă a pașilor esențială într-un algoritm?'}
          </div>

          {q2Cooldown > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={q2Cooldown}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza de ce inversarea pașilor duce la eșecul algoritmului."
                customMessageEn="Incorrect answer! Please take 5 seconds to reflect on step sequencing."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { id: 'ordered_order', text: lang === 'en' ? 'A) Inverting steps causes errors (e.g. pouring water before boiling)' : 'A) Inversarea pașilor produce erori (nu poți turna apa înainte de a o fierbe)' },
              { id: 'order_doesnt_matter', text: lang === 'en' ? 'B) Steps can be executed in completely random order' : 'B) Pașii se pot executa în orice ordine la întâmplare' },
              { id: 'only_for_fun', text: lang === 'en' ? 'C) Order is only for decorative visual reasons' : 'C) Ordinea contează doar pentru aspectul vizual' },
              { id: 'only_two_steps', text: lang === 'en' ? 'D) All algorithms must have exactly 2 steps' : 'D) Orice algoritm are obligatoriu exact 2 pași' }
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
                    ? opt.id === 'ordered_order'
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
            hintId="algo_q2_order"
            hintRo="Gândește-te ce s-ar întâmpla dacă ai încălța pantofii înainte de șosete!"
            hintEn="Think about what happens if you put your shoes on before your socks!"
          />

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              cooldown={q2Cooldown}
              explanation={
                isQ2Correct
                  ? (lang === 'en' ? 'Correct! Changing the sequence of operations changes or ruins the outcome.' : 'Corect! Ordinea determinată este critică: inversarea pașilor compromite rezultatul final.')
                  : (lang === 'en' ? 'Incorrect. Execution order is mandatory for correct results.' : 'Incorect. Fiecare pas depinde de finalizarea cu succes a pasului precedent.')
              }
              ruleReference="Manual TIC pag. 54"
            />
          )}
        </div>

        {/* Q3 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-amber-400 uppercase font-mono">
            {lang === 'en' ? 'Question 3 of 3' : 'Întrebarea 3 din 3'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'Who can execute an algorithm once it has been correctly formulated?'
              : 'Cine poate fi executantul unui algoritm formulat corect și clar?'}
          </div>

          {q3Cooldown > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={q3Cooldown}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza cine poate fi executantul unui algoritm."
                customMessageEn="Incorrect answer! Please take 5 seconds to reflect on algorithm executors."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { id: 'only_human', text: lang === 'en' ? 'A) Only adult human beings' : 'A) Doar oamenii adulți' },
              { id: 'all_problems', text: lang === 'en' ? 'B) A human, a robot, or a computer following unambiguous rules' : 'B) Un om, un robot sau un calculator care înțelege instrucțiunile' },
              { id: 'only_supercomputer', text: lang === 'en' ? 'C) Exclusively military supercomputers' : 'C) Exclusiv supercomputerele militare' },
              { id: 'no_one', text: lang === 'en' ? 'D) Algorithms cannot be executed by anyone' : 'D) Algoritmii nu pot fi executați de nimeni' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={q3Cooldown > 0}
                onClick={() => handleQ3(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                  q3Cooldown > 0 ? 'opacity-60 cursor-not-allowed' : ''
                } ${
                  q3Answer === opt.id
                    ? opt.id === 'all_problems'
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
            hintId="algo_q3_executor"
            hintRo="Executantul poate fi orice entitate (om, robot, program) capabilă să urmeze comenzi precise."
            hintEn="The executor can be any entity (human, robot, software) capable of following precise instructions."
          />

          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              cooldown={q3Cooldown}
              explanation={
                isQ3Correct
                  ? (lang === 'en' ? 'Perfect! Any entity understanding the instruction set can execute the algorithm.' : 'Perfect! Oricine înțelege setul de comenzi (om, robot, computer) poate fi executantul unui algoritm.')
                  : (lang === 'en' ? 'Incorrect. An algorithm can be executed by humans, robots, or computers.' : 'Incorect. Executantul poate fi atât un om cât și un sistem automatizat/robot.')
              }
              ruleReference="Manual TIC pag. 55"
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
