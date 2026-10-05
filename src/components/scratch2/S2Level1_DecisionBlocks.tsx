import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Play, 
  RotateCcw, 
  Check, 
  ExternalLink,
  Sliders,
  Award
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface S2Level1Props {
  onCompletePage: (earnedScore: number) => void;
}

export const S2Level1_DecisionBlocks: React.FC<S2Level1Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Decision test score variable
  const [testScore, setTestScore] = useState<number>(75);
  const [passingThreshold] = useState<number>(50);
  const [evaluatedBranch, setEvaluatedBranch] = useState<'then' | 'else'>('then');
  const [speechBubble, setSpeechBubble] = useState<string>('Felicitări! Ai promovat testul! 🎉');
  const [testedBothBranches, setTestedBothBranches] = useState<{ then: boolean; else: boolean }>({
    then: true,
    else: false
  });

  // Quiz State
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

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

  const handleScoreChange = (newScore: number) => {
    sounds.playClick();
    setTestScore(newScore);
    const isPass = newScore >= passingThreshold;
    if (isPass) {
      setEvaluatedBranch('then');
      setSpeechBubble(lang === 'en' ? 'Congratulations! You passed! 🎉' : 'Felicitări! Ai promovat testul! 🎉');
      setTestedBothBranches(prev => ({ ...prev, then: true }));
    } else {
      setEvaluatedBranch('else');
      setSpeechBubble(lang === 'en' ? 'Keep practicing! You will succeed next time! 📚' : 'Mai exersează! Vei reuși data viitoare! 📚');
      setTestedBothBranches(prev => ({ ...prev, else: true }));
    }
  };

  // Quiz Handlers
  const handleQ1 = (id: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    setQ1Answer(id);
    if (id === 'diamond_boolean') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const handleQ2 = (id: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    setQ2Answer(id);
    if (id === 'else_branch') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  const isQ1Correct = q1Answer === 'diamond_boolean';
  const isQ2Correct = q2Answer === 'else_branch';

  const isLabComplete = testedBothBranches.then && testedBothBranches.else;

  let totalScore = 0;
  if (isLabComplete) totalScore += 40;
  if (isQ1Correct) totalScore += 30;
  if (isQ2Correct) totalScore += 30;

  const isPageComplete = isLabComplete && isQ1Correct && isQ2Correct;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600/30 via-orange-600/20 to-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/40 text-amber-300">
              <GitBranch className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {lang === 'en' ? 'Unit 6 • Scratch 3.0 (Mission 2)' : 'Unitatea 6 • Scratch 3.0 (Misiunea 2)'}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {lang === 'en' ? 'Page 1 of 7' : 'Pagina 1 din 7'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {lang === 'en'
                  ? 'Decision Structures in Scratch: "if ... then ... else"'
                  : 'Structura Alternativă în Scratch: „dacă ... atunci ... altfel”'}
              </h1>
            </div>
          </div>
          <a
            href="https://scratch.mit.edu/projects/editor/?tutorial=getStarted"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-600/30 hover:bg-orange-600/50 border border-orange-500/40 text-orange-200 text-xs font-semibold transition cursor-pointer"
          >
            <span>{lang === 'en' ? 'Open MIT Scratch' : 'Deschide Scratch Oficial'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Educational Guide Card */}
      <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
          <BookOpen className="w-5 h-5" />
          <h2>{lang === 'en' ? 'Conditional Blocks in Scratch (Textbook pp. 84–86)' : 'Blocurile de Decizie în Scratch (Manual pag. 84–86)'}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="font-bold text-amber-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              {lang === 'en' ? '1. The "if ... then" (Simple) Block' : '1. Blocul „dacă ... atunci” (Simplă)'}
            </div>
            <p className="text-slate-400">
              {lang === 'en'
                ? 'Executes the internal instructions ONLY when the hexagonal condition inside tests TRUE. If FALSE, it skips them entirely.'
                : 'Execută blocurile din interior DOAR dacă condiția hexagonală este ADEVĂRATĂ. Dacă este FALSĂ, le sare direct.'}
            </p>
          </div>
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="font-bold text-orange-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400"></span>
              {lang === 'en' ? '2. The "if ... then ... else" (Complete) Block' : '2. Blocul „dacă ... atunci ... altfel” (Completă)'}
            </div>
            <p className="text-slate-400">
              {lang === 'en'
                ? 'Offers two alternative paths: branch 1 (atunci) runs if TRUE, and branch 2 (altfel) runs if FALSE. Exactly one branch is executed.'
                : 'Oferă două ramuri mutual exclusive: ramura 1 (atunci) când este ADEVĂRAT, și ramura 2 (altfel) când este FALS.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Decision Simulator */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-white font-bold">
          <Sliders className="w-5 h-5 text-amber-400" />
          <h3>{lang === 'en' ? 'Interactive Decision Flow Simulator' : 'Laborator Interactiv: Evaluarea Ramificației Scratch'}</h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">
          {lang === 'en'
            ? 'Task: Adjust the slider to test both conditions (score ≥ 50 and score < 50) to observe how Scratch switches branches dynamically!'
            : 'Misiune practică: Glisează cursorul pentru a testa ambele ramuri (scor ≥ 50 și scor < 50) și observă iluminarea codului Scratch!'}
        </p>

        {/* Score Slider */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-300 font-mono">Variabila [scor] = </span>
            <span className={`text-xl font-bold font-mono px-3 py-1 rounded-lg bg-slate-900 border ${
              testScore >= passingThreshold ? 'border-emerald-500 text-emerald-400' : 'border-rose-500 text-rose-400'
            }`}>
              {testScore}
            </span>
          </div>

          <div className="flex items-center gap-3 flex-1 max-w-md">
            <span className="text-xs text-slate-500 font-mono">0</span>
            <input
              type="range"
              min="0"
              max="100"
              value={testScore}
              onChange={e => handleScoreChange(Number(e.target.value))}
              className="flex-1 accent-amber-500 cursor-pointer"
            />
            <span className="text-xs text-slate-500 font-mono">100</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleScoreChange(85)}
              className="px-2.5 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-mono cursor-pointer"
            >
              Test ≥ 50 (85)
            </button>
            <button
              type="button"
              onClick={() => handleScoreChange(30)}
              className="px-2.5 py-1 rounded bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 text-xs font-mono cursor-pointer"
            >
              Test &lt; 50 (30)
            </button>
          </div>
        </div>

        {/* Scratch Block Tree & Character */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Scratch 'If-Else' Block Visual */}
          <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-1">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-2">
              {lang === 'en' ? 'Live Executing Scratch Block:' : 'Bloc Scratch în Execuție:'}
            </div>

            {/* Hat / Container Header */}
            <div className="p-3 bg-amber-600 rounded-t-xl border-2 border-amber-700 text-white font-bold flex flex-wrap items-center gap-2 shadow">
              <span>dacă</span>
              {/* Hexagonal Boolean Condition Slot */}
              <div className="bg-emerald-600 px-3 py-1 rounded-full border-2 border-emerald-400 text-white flex items-center gap-1.5 shadow-inner">
                <span className="bg-orange-500 text-slate-950 px-1.5 py-0.5 rounded text-[11px]">scor</span>
                <span className="font-bold">&gt;</span>
                <span className="bg-white text-slate-950 px-1.5 py-0.5 rounded text-[11px]">49</span>
              </div>
              <span>atunci</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-auto ${
                testScore >= passingThreshold ? 'bg-emerald-400 text-slate-950 animate-pulse' : 'bg-slate-900 text-slate-500'
              }`}>
                {testScore >= passingThreshold ? 'ADEVĂRAT (TRUE)' : 'FALS (FALSE)'}
              </span>
            </div>

            {/* THEN Branch */}
            <div className={`p-3 rounded-lg border-l-8 pl-4 transition-all ${
              evaluatedBranch === 'then'
                ? 'bg-emerald-950/80 border-emerald-400 text-emerald-100 ring-2 ring-emerald-500/40'
                : 'bg-slate-900/40 border-slate-700 text-slate-500 opacity-40'
            }`}>
              <div className="text-purple-300 font-bold">
                spune [Felicitări! Ai promovat!] pentru 2 secunde
              </div>
            </div>

            {/* ELSE Middle */}
            <div className="p-2 bg-amber-600 text-white font-bold border-x-2 border-amber-700">
              altfel
            </div>

            {/* ELSE Branch */}
            <div className={`p-3 rounded-b-xl border-l-8 pl-4 transition-all ${
              evaluatedBranch === 'else'
                ? 'bg-rose-950/80 border-rose-400 text-rose-100 ring-2 ring-rose-500/40'
                : 'bg-slate-900/40 border-slate-700 text-slate-500 opacity-40'
            }`}>
              <div className="text-purple-300 font-bold">
                spune [Mai exersează!] pentru 2 secunde
              </div>
            </div>
          </div>

          {/* Character Speech Reaction */}
          <div className="md:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center min-h-[200px]">
            <div className="mb-3 bg-white text-slate-950 font-bold text-xs px-4 py-2 rounded-2xl rounded-bl-none shadow-2xl border-2 border-purple-500 animate-bounce text-center">
              {speechBubble}
            </div>
            <div className="text-5xl">
              {evaluatedBranch === 'then' ? '🥳' : '🧐'}
            </div>
            <div className="mt-2 text-xs font-bold text-slate-300">
              {evaluatedBranch === 'then' ? (lang === 'en' ? 'Passed (Ramura Atunci)' : 'Admis (Ramura Atunci)') : (lang === 'en' ? 'Needs Practice (Ramura Altfel)' : 'Exersează (Ramura Altfel)')}
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Quiz */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>{lang === 'en' ? 'Decision Logic Quiz' : 'Evaluare: Blocurile de Decizie'}</span>
        </h3>

        {/* Question 1 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
            </span>
            <QuestionHint
              hintRo="Condițiile logice au formă hexagonală alungită și pot fi alimentate doar cu blocuri logice de comparație sau detectare."
              hintEn="Logical conditions have an elongated hexagonal shape and accept boolean operator blocks."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'What shape does the conditional slot inside an "if ... then" block have in Scratch?'
              : 'Ce formă are locașul pentru condiție din interiorul blocului „dacă ... atunci” în Scratch?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'diamond_boolean', ro: 'Hexagon alungit (specific expresiilor logice Adevărat / Fals)', en: 'Elongated hexagon (specific to True / False boolean expressions)' },
              { id: 'oval_slot', ro: 'Cerc perfect pentru numere', en: 'Perfect circle for numbers' },
              { id: 'square_slot', ro: 'Pătrat pentru texte lungi', en: 'Square for long texts' },
              { id: 'puzzle_slot', ro: 'Formă de steag', en: 'Flag shape' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q1 || 0) > 0}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'diamond_boolean'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-amber-400 text-slate-300'
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
              customMessageRo="Reflecție didactică: Forma hexagonală garantează că în slot pot intra doar blocuri care returnează o valoare booleană!"
              customMessageEn="Pedagogical reflection: The hexagonal shape ensures only boolean-returning blocks fit inside!"
            />
          ) : null}
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanationRo="Locașul hexagonal acceptă operatori logici (<, >, =, și, sau, non) sau blocuri de detectare (atinge culoarea etc.)."
              explanationEn="The hexagonal slot fits relational operators (<, >, =, and, or, not) and sensing blocks (touching color, etc.)."
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
            </span>
            <QuestionHint
              hintRo="Când condiția este evaluată ca FALS, execuția sare imediat la ramura „altfel” (else)."
              hintEn="When the condition evaluates to FALSE, execution transfers directly to the 'else' branch."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'When does the "altfel" (else) branch execute inside a "dacă ... atunci ... altfel" block?'
              : 'Când se execută instrucțiunile din ramura „altfel” (else) a blocului „dacă ... atunci ... altfel”?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'else_branch', ro: 'Numai atunci când condiția este FALSĂ', en: 'Only when the condition is FALSE' },
              { id: 'always_branch', ro: 'Întotdeauna, la fiecare rulare', en: 'Always, on every single run' },
              { id: 'true_branch', ro: 'Numai când condiția este ADEVĂRATĂ', en: 'Only when the condition is TRUE' },
              { id: 'never_branch', ro: 'Niciodată', en: 'Never' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q2 || 0) > 0}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'else_branch'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-amber-400 text-slate-300'
                }`}
              >
                {lang === 'en' ? opt.en : opt.ro}
              </button>
            ))}
          </div>
          {cooldowns.q2 && cooldowns.q2 > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.q2}
              totalSeconds={5}
              customMessageRo="Reflecție didactică: Ramurile sunt mutual exclusive: ori Atunci, ori Altfel!"
              customMessageEn="Pedagogical reflection: The branches are mutually exclusive: either Then or Else!"
            />
          ) : null}
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanationRo="Structura completă garantează tratarea ambelor cazuri: ADEVĂRAT (ramura Atunci) și FALS (ramura Altfel)."
              explanationEn="The full structure guarantees handling both cases: TRUE (Then branch) and FALSE (Else branch)."
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentPage={1}
        totalPages={7}
        earnedScore={totalScore}
        isCompleted={isPageComplete}
        onNextPage={() => {
          sounds.playCorrect();
          onCompletePage(totalScore);
        }}
        nextButtonLabelRo="Continuă la Pagina 2: Proiectul Labirint (Detectare Culori)"
        nextButtonLabelEn="Proceed to Page 2: Project Maze (Color Sensing)"
      />
    </div>
  );
};
