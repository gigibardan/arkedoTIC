import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  ArrowRight, 
  Check, 
  RotateCcw,
  TrafficCone,
  Compass
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface A2Level1Props {
  onCompletePage: (earnedScore: number) => void;
}

export const A2Level1_AlternativeStructure: React.FC<A2Level1Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Traffic Light Simulator State
  const [trafficColor, setTrafficColor] = useState<'RED' | 'GREEN' | 'YELLOW'>('RED');
  const [pedestrianAction, setPedestrianAction] = useState<string | null>(null);
  const [decisionValidated, setDecisionValidated] = useState<boolean>(false);
  const [decisionCooldown, setDecisionCooldown] = useState<number>(0);

  // Quiz State
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q1Cooldown, setQ1Cooldown] = useState<number>(0);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q2Cooldown, setQ2Cooldown] = useState<number>(0);

  // Timer cooldown decrement
  useEffect(() => {
    if (decisionCooldown <= 0 && q1Cooldown <= 0 && q2Cooldown <= 0) return;
    const timer = setInterval(() => {
      if (decisionCooldown > 0) setDecisionCooldown(prev => (prev <= 1 ? 0 : prev - 1));
      if (q1Cooldown > 0) setQ1Cooldown(prev => (prev <= 1 ? 0 : prev - 1));
      if (q2Cooldown > 0) setQ2Cooldown(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [decisionCooldown, q1Cooldown, q2Cooldown]);

  const handleChooseAction = (action: 'CROSS' | 'WAIT') => {
    if (decisionCooldown > 0) return;
    sounds.playClick();
    setPedestrianAction(action);
    setDecisionValidated(true);

    const isCorrectDecision = 
      (trafficColor === 'GREEN' && action === 'CROSS') ||
      (trafficColor === 'RED' && action === 'WAIT') ||
      (trafficColor === 'YELLOW' && action === 'WAIT');

    if (isCorrectDecision) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setDecisionCooldown(5);
    }
  };

  // Quiz handlers
  const isQ1Correct = q1Answer === 'branch_decision';
  const handleQ1 = (val: string) => {
    if (q1Cooldown > 0) return;
    sounds.playClick();
    setQ1Answer(val);
    if (val === 'branch_decision') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setQ1Cooldown(5);
    }
  };

  const isQ2Correct = q2Answer === 'else_branch';
  const handleQ2 = (val: string) => {
    if (q2Cooldown > 0) return;
    sounds.playClick();
    setQ2Answer(val);
    if (val === 'else_branch') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setQ2Cooldown(5);
    }
  };

  // Scoring
  let correctCount = 0;
  if (decisionValidated && (
    (trafficColor === 'GREEN' && pedestrianAction === 'CROSS') ||
    (trafficColor === 'RED' && pedestrianAction === 'WAIT') ||
    (trafficColor === 'YELLOW' && pedestrianAction === 'WAIT')
  )) correctCount += 2;
  if (isQ1Correct) correctCount++;
  if (isQ2Correct) correctCount++;

  const totalQuestions = 4;
  const earnedScore = Math.round((correctCount / totalQuestions) * 15);
  const canProceed = correctCount >= 3;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn select-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-950/60 via-slate-900 to-purple-950/60 border border-violet-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-violet-500/20 border border-violet-400/40 rounded-2xl text-violet-300 text-3xl shrink-0 shadow-inner">
            🔀
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-violet-400 uppercase tracking-widest mb-1">
              <span>{lang === 'en' ? 'Module 5B • Page 1 of 7' : 'Modulul 5B • Pagina 1 din 7'}</span>
              <span>•</span>
              <span className="text-slate-400">{lang === 'en' ? 'Textbook p. 62–63' : 'Manual pag. 62–63'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              {lang === 'en' ? '1. The Alternative (Decision) Structure: IF / ELSE' : '1. Structura Alternativă (Decizională): Dacă... Atunci... Altfel'}
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              {lang === 'en'
                ? 'When an algorithm must choose between two distinct actions depending on whether a condition is True or False, it uses the Alternative Decision Structure (IF <condition> THEN <action1> ELSE <action2>).'
                : 'Când rezolvarea unei probleme depinde de verificarea unei condiții, algoritmul alege una dintre două căi posibile: Dacă <condiție> Atunci <acțiunea 1> Altfel <acțiunea 2>.'}
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Interactive Traffic Light Decision Simulator */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <TrafficCone className="w-6 h-6 text-violet-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-heading">
                {lang === 'en' ? 'Interactive Lab: The Pedestrian Crossing Algorithm' : 'Laborator Interactiv: Algoritmul Traversării Străzii la Semafor'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'en' ? 'Textbook page 62, Example 1' : 'Manual pagina 62, Exemplul 1'}
              </p>
            </div>
          </div>
        </div>

        {decisionCooldown > 0 && (
          <PedagogicalReflectionBanner
            cooldown={decisionCooldown}
            customMessageRo="Decizie periculoasă sau greșită! Nu poți traversa pe roșu sau galben. Te rugăm să acorzi 5 secunde pentru a citi regula decizională."
            customMessageEn="Dangerous or incorrect decision! You cannot cross on red or yellow. Please take 5 seconds to review the IF/ELSE condition."
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* Traffic Light Visualizer */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center gap-4">
            <div className="w-20 bg-slate-900 p-3 rounded-3xl border-2 border-slate-700 flex flex-col items-center gap-3 shadow-2xl">
              <button
                type="button"
                onClick={() => {
                  setTrafficColor('RED');
                  setDecisionValidated(false);
                  sounds.playClick();
                }}
                className={`w-12 h-12 rounded-full transition-all cursor-pointer ${
                  trafficColor === 'RED'
                    ? 'bg-rose-500 shadow-lg shadow-rose-500/80 ring-4 ring-rose-300/40 scale-105'
                    : 'bg-rose-950 border border-rose-900 opacity-40'
                }`}
                title="Comută pe Roșu"
              />
              <button
                type="button"
                onClick={() => {
                  setTrafficColor('YELLOW');
                  setDecisionValidated(false);
                  sounds.playClick();
                }}
                className={`w-12 h-12 rounded-full transition-all cursor-pointer ${
                  trafficColor === 'YELLOW'
                    ? 'bg-amber-400 shadow-lg shadow-amber-400/80 ring-4 ring-amber-300/40 scale-105'
                    : 'bg-amber-950 border border-amber-900 opacity-40'
                }`}
                title="Comută pe Galben"
              />
              <button
                type="button"
                onClick={() => {
                  setTrafficColor('GREEN');
                  setDecisionValidated(false);
                  sounds.playClick();
                }}
                className={`w-12 h-12 rounded-full transition-all cursor-pointer ${
                  trafficColor === 'GREEN'
                    ? 'bg-emerald-500 shadow-lg shadow-emerald-500/80 ring-4 ring-emerald-300/40 scale-105'
                    : 'bg-emerald-950 border border-emerald-900 opacity-40'
                }`}
                title="Comută pe Verde"
              />
            </div>
            <div className="text-xs font-mono text-slate-400">
              {lang === 'en' ? 'Click lights to change color' : 'Apasă pe semafor pentru a schimba culoarea'}
            </div>
          </div>

          {/* Decision Tree Pseudocode */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
              <div className="text-violet-400 font-bold uppercase">
                {lang === 'en' ? 'Decision Algorithm Structure:' : 'Structura Decizională:'}
              </div>
              <div className="text-slate-300 space-y-1">
                <div><span className="text-violet-400 font-bold">Dacă</span> Culoare == Verde <span className="text-violet-400 font-bold">Atunci</span></div>
                <div className="pl-4 text-emerald-300 font-semibold">Traversează strada pe trecere</div>
                <div><span className="text-violet-400 font-bold">Altfel</span></div>
                <div className="pl-4 text-rose-300 font-semibold">Așteaptă pe trotuar</div>
                <div><span className="text-violet-400 font-bold">Sfârșit_Dacă</span></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300">
                {lang === 'en' ? 'Choose action for current light:' : 'Alege acțiunea corectă pentru semaforul curent:'}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={decisionCooldown > 0}
                  onClick={() => handleChooseAction('CROSS')}
                  className={`p-3 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    pedestrianAction === 'CROSS'
                      ? trafficColor === 'GREEN'
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg'
                        : 'bg-rose-600 border-rose-400 text-white shadow-lg'
                      : 'bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-500'
                  }`}
                >
                  <span>🚶‍♂️ Traversează</span>
                </button>
                <button
                  type="button"
                  disabled={decisionCooldown > 0}
                  onClick={() => handleChooseAction('WAIT')}
                  className={`p-3 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    pedestrianAction === 'WAIT'
                      ? trafficColor !== 'GREEN'
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg'
                        : 'bg-rose-600 border-rose-400 text-white shadow-lg'
                      : 'bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-500'
                  }`}
                >
                  <span>🛑 Așteaptă</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Knowledge Assessment Quiz */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white border-b border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-violet-400" />
          <span>{lang === 'en' ? 'Check Your Knowledge: IF / ELSE Mechanics' : 'Verifică-ți Cunoștințele: Mecanismul Dacă... Altfel'}</span>
        </div>

        {/* Q1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-violet-400 uppercase font-mono">
            {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'When is the action on the "THEN" (Atunci) branch executed in an IF statement?'
              : 'Când se execută acțiunea asociată ramurii „ATUNCI” dintr-o structură decizională?'}
          </div>

          {(q1Cooldown || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={q1Cooldown}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza când condiția este Adevărată."
                customMessageEn="Incorrect answer! Please take 5 seconds to reflect on True condition evaluation."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { id: 'branch_decision', text: lang === 'en' ? 'A) Only when the evaluated condition is TRUE (Adevărată)' : 'A) Doar atunci când condiția evaluată este ADEVĂRATĂ' },
              { id: 'only_when_false', text: lang === 'en' ? 'B) Only when the condition is FALSE (Falsă)' : 'B) Doar când condiția este Falsă' },
              { id: 'always_both', text: lang === 'en' ? 'C) Both branches always execute simultaneously' : 'C) Ambele ramuri se execută simultan întotdeauna' },
              { id: 'random_flip', text: lang === 'en' ? 'D) By flipping a coin randomly' : 'D) La întâmplare' }
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
                    ? opt.id === 'branch_decision'
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
            hintId="algo_alt_q1"
            hintRo="Dacă testul este ADEVĂRAT, mergem pe ATUNCI. Dacă este FALS, mergem pe ALTFEL."
            hintEn="If the test is TRUE, we follow THEN. If it is FALSE, we follow ELSE."
          />

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              cooldown={q1Cooldown}
              explanation={
                isQ1Correct
                  ? (lang === 'en' ? 'Spot on! The THEN branch triggers exclusively when the test evaluates to TRUE.' : 'Exact! Ramura ATUNCI se execută doar atunci când condiția este verificată și evaluată ca fiind ADEVĂRATĂ.')
                  : (lang === 'en' ? 'Incorrect. THEN is strictly tied to a TRUE condition evaluation.' : 'Incorect. Ramura ATUNCI se activează doar dacă rezultatul condiției este ADEVĂRAT.')
              }
              ruleReference="Manual TIC pag. 62"
            />
          )}
        </div>

        {/* Q2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-violet-400 uppercase font-mono">
            {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'Can the "ELSE" (Altfel) branch be omitted if no action is required when the condition is false?'
              : 'Poate lipsi ramura „ALTFEL” (forma simplificată a deciziei) dacă nu avem nimic de făcut în cazul fals?'}
          </div>

          {(q2Cooldown || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={q2Cooldown}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza forma simplificată: Dacă <condiție> Atunci <acțiune>."
                customMessageEn="Incorrect answer! Please take 5 seconds to review the simplified IF-THEN structure."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { id: 'else_branch', text: lang === 'en' ? 'A) Yes, it is called the simple alternative structure (IF <cond> THEN <action>)' : 'A) Da, se numește forma simplificată (Dacă <condiție> Atunci <acțiune>)' },
              { id: 'illegal_always', text: lang === 'en' ? 'B) No, ELSE is strictly mandatory in every programming language' : 'B) Nu, ALTFEL este obligatoriu de fiecare dată' },
              { id: 'only_numbers', text: lang === 'en' ? 'C) Only when numbers are negative' : 'C) Doar când numerele sunt negative' },
              { id: 'never_used', text: lang === 'en' ? 'D) Decisions cannot exist without 5 branches' : 'D) Nu există decizii fără 5 ramuri' }
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
                    ? opt.id === 'else_branch'
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
            hintId="algo_alt_q2"
            hintRo="Forma simplificată este: Dacă plouă Atunci ia umbrela (dacă nu plouă, nu facem nimic special)."
            hintEn="The simplified form is: IF it rains THEN take an umbrella (if not, we do nothing special)."
          />

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              cooldown={q2Cooldown}
              explanation={
                isQ2Correct
                  ? (lang === 'en' ? 'Correct! The simplified IF-THEN structure executes an action only if condition is True.' : 'Corect! Structura alternativă simplificată (Dacă... Atunci) execută acțiunea doar dacă este adevărat, fără ramură de Altfel.')
                  : (lang === 'en' ? 'Incorrect. The simplified form without ELSE is completely valid.' : 'Incorect. Ramura ALTFEL este opțională în forma simplificată.')
              }
              ruleReference="Manual TIC pag. 63"
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
