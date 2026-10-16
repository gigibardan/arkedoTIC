import React, { useState } from 'react';
import {
  ToggleLeft,
  ToggleRight,
  Lightbulb,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Cpu,
  Layers
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { useQuestionCooldowns, PedagogicalReflectionBanner } from '../../../utils/pedagogicalGrading';

interface Level3Props {
  onCompletePage: (earnedScore: number) => void;
}

export const ScratchAlgo1_Level3_LogicOperatorsAndConditions: React.FC<Level3Props> = ({
  onCompletePage
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  // Interactive logic circuit states
  const [condA, setCondA] = useState<boolean>(true);
  const [condB, setCondB] = useState<boolean>(false);
  const [activeGate, setActiveGate] = useState<'AND' | 'OR' | 'NOT'>('AND');

  // Interactive Quiz state with 5-second cooldown
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  // Compute logic gate result
  let gateResult = false;
  if (activeGate === 'AND') gateResult = condA && condB;
  if (activeGate === 'OR') gateResult = condA || condB;
  if (activeGate === 'NOT') gateResult = !condA;

  const handleQ1 = (choice: string) => {
    if (isLocked('q1') || q1 === 'false') return;
    setQ1(choice);
    if (choice === 'false') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1', 5);
    }
  };

  const handleQ2 = (choice: string) => {
    if (isLocked('q2') || q2 === 'or') return;
    setQ2(choice);
    if (choice === 'or') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2', 5);
    }
  };

  const isLevelCompleted = q1 === 'false' && q2 === 'or';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/60 via-teal-950/40 to-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold uppercase tracking-wider">
                {isEn ? 'Grade 6 • Unit 4A • Level 3 of 7' : 'Clasa a VI-a • Unitatea 4A • Nivelul 3 din 7'}
              </span>
              <span className="text-xs text-slate-400 font-mono">Manual pag. 68–71</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight flex items-center gap-3">
              <Cpu className="w-8 h-8 text-emerald-400" />
              <span>{isEn ? 'Logical Operators & Compound Conditions' : 'Operatori Logici & Condiții Compuse în Scratch'}</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              {isEn
                ? 'Discover relational operators (>, <, =) and Boolean operators (AND, OR, NOT) to build complex game decision trees.'
                : 'Descoperă operatorii relaționali (>, <, =) și operatorii logici booleeni (ȘI, SAU, NU) din Scratch pentru a crea decizii inteligente în jocuri!'}
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-mono text-emerald-400/80">REWARD</span>
            <span className="text-xl font-black text-emerald-300 font-mono">+15 XP</span>
          </div>
        </div>
      </div>

      {/* Operator Encyclopedia Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* AND Gate */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/40 transition">
          <div className="bg-emerald-950/80 text-emerald-400 font-mono font-bold text-xs px-2.5 py-1 rounded-lg inline-block mb-3 border border-emerald-500/30">
            &lt; [A] și [B] &gt; (AND)
          </div>
          <h3 className="font-bold text-white text-sm mb-1">
            {isEn ? 'Conjunction: Both must be true' : 'Conjuncție: Ambele Adevărate'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Rezultatul este <strong>ADEVĂRAT</strong> doar dacă ambele condiții sunt simultan îndeplinite.
            <br />
            <em className="text-emerald-300/80">Ex: scor &gt; 10 ȘI vieți &gt; 0</em>
          </p>
        </div>

        {/* OR Gate */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/40 transition">
          <div className="bg-emerald-950/80 text-emerald-400 font-mono font-bold text-xs px-2.5 py-1 rounded-lg inline-block mb-3 border border-emerald-500/30">
            &lt; [A] sau [B] &gt; (OR)
          </div>
          <h3 className="font-bold text-white text-sm mb-1">
            {isEn ? 'Disjunction: At least one true' : 'Disjuncție: Cel puțin una Adevărată'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Rezultatul este <strong>ADEVĂRAT</strong> dacă oricare dintre condiții (sau ambele) este adevărată.
            <br />
            <em className="text-emerald-300/80">Ex: tasta spațiu apăsată SAU click mouse</em>
          </p>
        </div>

        {/* NOT Gate */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/40 transition">
          <div className="bg-emerald-950/80 text-emerald-400 font-mono font-bold text-xs px-2.5 py-1 rounded-lg inline-block mb-3 border border-emerald-500/30">
            &lt; nu [A] &gt; (NOT)
          </div>
          <h3 className="font-bold text-white text-sm mb-1">
            {isEn ? 'Negation: Inverts truth value' : 'Negație: Inversează Adevărul'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Transformă ADEVĂRAT în <strong>FALS</strong> și FALS în <strong>ADEVĂRAT</strong>.
            <br />
            <em className="text-emerald-300/80">Ex: nu &lt;atinge perete&gt;</em>
          </p>
        </div>
      </div>

      {/* Interactive Circuit Lab */}
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              {isEn ? 'Interactive Logic Gate Circuit' : 'Laborator Interactiv: Circuitul Porților Logice'}
            </h2>
          </div>
          {/* Gate Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['AND', 'OR', 'NOT'] as const).map((g) => (
              <button
                key={g}
                onClick={() => {
                  setActiveGate(g);
                  sounds.playClick();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  activeGate === g
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {g === 'AND' ? 'ȘI (AND)' : g === 'OR' ? 'SAU (OR)' : 'NU (NOT)'}
              </button>
            ))}
          </div>
        </div>

        {/* The Circuit Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-950 p-6 rounded-2xl border border-slate-800">
          {/* Inputs */}
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase text-slate-400 font-bold">
              Semnale de Intrare:
            </div>

            {/* Condition A */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs">
                <span className="font-bold text-white block">Condiția A</span>
                <span className="text-[11px] text-slate-400">ex: scor &gt; 50</span>
              </div>
              <button
                onClick={() => {
                  setCondA(!condA);
                  sounds.playPop();
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  condA ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {condA ? 'ADEVĂRAT (1)' : 'FALS (0)'}
              </button>
            </div>

            {/* Condition B (if not NOT) */}
            {activeGate !== 'NOT' && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xs">
                  <span className="font-bold text-white block">Condiția B</span>
                  <span className="text-[11px] text-slate-400">ex: vieți &gt; 0</span>
                </div>
                <button
                  onClick={() => {
                    setCondB(!condB);
                    sounds.playPop();
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    condB ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {condB ? 'ADEVĂRAT (1)' : 'FALS (0)'}
                </button>
              </div>
            )}
          </div>

          {/* Gate representation */}
          <div className="flex flex-col items-center justify-center p-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 flex flex-col items-center justify-center text-white shadow-xl shadow-emerald-500/20 font-black font-mono border-2 border-emerald-400/40">
              <span className="text-lg">{activeGate}</span>
              <span className="text-[10px] opacity-80">OPERATOR</span>
            </div>
            <div className="text-center text-xs font-mono text-slate-400 mt-3">
              {activeGate === 'AND' && '< Cond A și Cond B >'}
              {activeGate === 'OR' && '< Cond A sau Cond B >'}
              {activeGate === 'NOT' && '< nu Cond A >'}
            </div>
          </div>

          {/* Output Lamp */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-xl border border-slate-800">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-2xl transition duration-300 ${
                gateResult
                  ? 'bg-emerald-500 shadow-emerald-500/60 scale-110 border-4 border-emerald-200'
                  : 'bg-rose-950/80 shadow-rose-950/40 border-4 border-rose-900/40 grayscale'
              }`}
            >
              💡
            </div>
            <div className="mt-3 text-center">
              <div
                className={`font-mono font-black text-sm uppercase ${
                  gateResult ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {gateResult ? 'ADEVĂRAT (Execută bucla)' : 'FALS (Nu se execută)'}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {gateResult ? 'Circuitul transmite semnalul!' : 'Semnalul este blocat.'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applied Quiz Questions */}
      <div className="space-y-4">
        {/* Q1: AND evaluation */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">
              {isEn
                ? 'Question 1: In Scratch, if Score = 40 and Lives = 3, what is the value of < (Score > 50) and (Lives > 0) > ?'
                : 'Întrebarea 1: În Scratch, dacă Scorul = 40 și Viețile = 3, ce valoare are expresia < (Scor > 50) și (Vieți > 0) > ?'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              { id: 'true', label: 'ADEVĂRAT (True)', isCorrect: false },
              { id: 'false', label: 'FALS (False)', isCorrect: true }
            ].map((opt) => {
              const isSelected = q1 === opt.id;
              let style = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (q1) {
                if (opt.isCorrect) style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                else if (isSelected) style = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={opt.id}
                  disabled={isLocked('q1') || q1 === 'false'}
                  onClick={() => handleQ1(opt.id)}
                  className={`p-3.5 rounded-xl border font-bold text-sm text-left transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-between ${style}`}
                >
                  <span>{opt.label}</span>
                  {q1 && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {q1 && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                </button>
              );
            })}
          </div>

          {cooldowns.q1 && cooldowns.q1 > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.q1}
              totalSeconds={5}
              customMessageRo="Timp de reflecție: La operatorul ȘI (AND), dacă o condiție e falsă, rezultatul e FALS!"
              customMessageEn="Reflection buffer: In an AND gate, if one condition is false, the result is FALSE!"
            />
          ) : null}

          {q1 && (
            <AnswerExplanation
              isCorrect={q1 === 'false'}
              explanation={
                isEn
                  ? 'Correct! Score is 40, which is NOT > 50. In an AND statement, if one condition is false, the entire expression is FALSE.'
                  : 'Corect! Scorul este 40, deci condiția Scor > 50 este FALSĂ. La operatorul ȘI (AND), dacă măcar o condiție este falsă, întregul rezultat este FALS!'
              }
            />
          )}
        </div>

        {/* Q2: OR application */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">
              {isEn
                ? 'Question 2: You want a spaceship to fire laser when either the Spacebar is pressed OR mouse is clicked. Which operator do you use?'
                : 'Întrebarea 2: Vrei ca nava spațială să tragă cu laser când este apăsată Tasta Spațiu SAU când se dă click pe mouse. Ce operator alegi?'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              { id: 'and', label: '< [ ] și [ ] > (AND)', isCorrect: false },
              { id: 'or', label: '< [ ] sau [ ] > (OR)', isCorrect: true },
              { id: 'not', label: '< nu [ ] > (NOT)', isCorrect: false }
            ].map((opt) => {
              const isSelected = q2 === opt.id;
              let style = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (q2) {
                if (opt.isCorrect) style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                else if (isSelected) style = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={opt.id}
                  disabled={isLocked('q2') || q2 === 'or'}
                  onClick={() => handleQ2(opt.id)}
                  className={`p-3.5 rounded-xl border font-bold text-xs text-left transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-between ${style}`}
                >
                  <span className="font-mono">{opt.label}</span>
                  {q2 && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {q2 && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                </button>
              );
            })}
          </div>

          {cooldowns.q2 && cooldowns.q2 > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.q2}
              totalSeconds={5}
              customMessageRo="Timp de reflecție: Operatorul SAU (OR) se activează când oricare dintre condiții e adevărată!"
              customMessageEn="Reflection buffer: The OR operator triggers when either condition is true!"
            />
          ) : null}

          {q2 && (
            <AnswerExplanation
              isCorrect={q2 === 'or'}
              explanation={
                isEn
                  ? 'Exactly! The OR operator allows either of the triggers to initiate action.'
                  : 'Exact! Operatorul SAU (OR) permite ca oricare dintre cele două evenimente (spațiu sau click) să declanșeze tragerea cu laser!'
              }
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        canProceed={isLevelCompleted}
        onNext={() => onCompletePage(15)}
        nextLabel={isEn ? 'Level 4: Infinite Loops Trap' : 'Nivelul 4: Capcana Buclelor Infinite'}
      />
    </div>
  );
};
