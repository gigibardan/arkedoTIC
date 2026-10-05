import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Play, 
  Plus, 
  Sliders, 
  Eye, 
  EyeOff, 
  Check, 
  RotateCcw, 
  ExternalLink,
  Zap,
  Heart,
  Trophy
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface SLevel5Props {
  onCompletePage: (earnedScore: number) => void;
}

interface ScratchVar {
  id: string;
  name: string;
  value: number;
  visibleOnStage: boolean;
  color: string;
}

export const SLevel5_VariablesInScratch: React.FC<SLevel5Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Variables state
  const [variables, setVariables] = useState<ScratchVar[]>([
    { id: 'v_score', name: 'scor', value: 0, visibleOnStage: true, color: 'text-amber-400' },
    { id: 'v_lives', name: 'vieți', value: 3, visibleOnStage: true, color: 'text-rose-400' },
    { id: 'v_energy', name: 'energie', value: 100, visibleOnStage: false, color: 'text-sky-400' }
  ]);

  // Target task state: reach score >= 5 and keep lives > 0
  const [taskCompleted, setTaskCompleted] = useState<boolean>(false);

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

  const handleModifyVar = (id: string, delta: number) => {
    sounds.playClick();
    setVariables(prev =>
      prev.map(v => {
        if (v.id === id) {
          const newVal = Math.max(0, v.value + delta);
          if (id === 'v_score' && newVal >= 5 && !taskCompleted) {
            sounds.playStar();
            setTaskCompleted(true);
          }
          return { ...v, value: newVal };
        }
        return v;
      })
    );
  };

  const handleSetVar = (id: string, fixedValue: number) => {
    sounds.playClick();
    setVariables(prev =>
      prev.map(v => {
        if (v.id === id) {
          if (id === 'v_score' && fixedValue >= 5 && !taskCompleted) {
            sounds.playStar();
            setTaskCompleted(true);
          }
          return { ...v, value: fixedValue };
        }
        return v;
      })
    );
  };

  const toggleVisibility = (id: string) => {
    sounds.playClick();
    setVariables(prev =>
      prev.map(v => (v.id === id ? { ...v, visibleOnStage: !v.visibleOnStage } : v))
    );
  };

  const handleResetVars = () => {
    sounds.playClick();
    setVariables([
      { id: 'v_score', name: 'scor', value: 0, visibleOnStage: true, color: 'text-amber-400' },
      { id: 'v_lives', name: 'vieți', value: 3, visibleOnStage: true, color: 'text-rose-400' },
      { id: 'v_energy', name: 'energie', value: 100, visibleOnStage: false, color: 'text-sky-400' }
    ]);
  };

  // Quiz Handlers
  const handleQ1 = (id: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    setQ1Answer(id);
    if (id === 'set_vs_change') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const handleQ2 = (id: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    setQ2Answer(id);
    if (id === 'checkbox_stage') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  const isQ1Correct = q1Answer === 'set_vs_change';
  const isQ2Correct = q2Answer === 'checkbox_stage';

  let totalScore = 0;
  if (taskCompleted) totalScore += 40;
  if (isQ1Correct) totalScore += 30;
  if (isQ2Correct) totalScore += 30;

  const isPageComplete = taskCompleted && isQ1Correct && isQ2Correct;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600/30 via-amber-600/20 to-slate-900 border border-orange-500/40 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/20 rounded-xl border border-orange-500/40 text-orange-300">
              <Database className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  {lang === 'en' ? 'Unit 6 • Scratch 3.0' : 'Unitatea 6 • Scratch 3.0'}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {lang === 'en' ? 'Page 5 of 7' : 'Pagina 5 din 7'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {lang === 'en'
                  ? 'Variables in Scratch: Creation, Assignment & Watchers'
                  : 'Variabile în Scratch: Creare, Atribuire și Monitoare'}
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
        <div className="flex items-center gap-2 text-orange-400 font-bold text-base">
          <BookOpen className="w-5 h-5" />
          <h2>{lang === 'en' ? 'Working with Variables in Scratch (Textbook pp. 81–84)' : 'Lucrul cu Variabile în Scratch (Manual pag. 81–84)'}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-300">
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="font-bold text-orange-300 flex items-center gap-2">
              <Plus className="w-4 h-4 text-orange-400" />
              {lang === 'en' ? '1. Creating a Variable' : '1. Crearea unei Variabile'}
            </div>
            <p className="text-slate-400">
              {lang === 'en'
                ? 'Click "Make a Variable" in the orange category. Choose if it is "For all sprites" (global) or "For this sprite only" (local).'
                : 'Apasă pe „Creează o variabilă” din categoria portocalie. Poți alege dacă este vizibilă „Pentru toate personajele” sau doar local.'}
            </p>
          </div>
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="font-bold text-amber-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              {lang === 'en' ? '2. Set vs Change By' : '2. Setează vs Modifică cu'}
            </div>
            <p className="text-slate-400">
              {lang === 'en'
                ? '`set [var] to [0]` overwrites with a brand new value. `change [var] by [1]` adds (or subtracts with negative numbers) to the current value.'
                : '`setează [var] la [0]` suprascrie direct cu o nouă valoare. `modifică [var] cu [1]` adună (sau scade dacă e negativ) la valoarea existentă.'}
            </p>
          </div>
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="font-bold text-sky-300 flex items-center gap-2">
              <Eye className="w-4 h-4 text-sky-400" />
              {lang === 'en' ? '3. Stage Watcher Monitor' : '3. Monitorul de pe Scenă'}
            </div>
            <p className="text-slate-400">
              {lang === 'en'
                ? 'Ticking the checkbox next to the variable displays its live value on stage as a scoreboard or player stat monitor.'
                : 'Bifarea căsuței de lângă variabilă afișează caseta acesteia pe scenă ca un tablou de bord în timp real pentru jucător.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Variables Simulator */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <Sliders className="w-5 h-5 text-orange-400" />
            <h3>{lang === 'en' ? 'Interactive Variable Operations Lab' : 'Laborator Interactiv: Operații cu Variabile Scratch'}</h3>
          </div>
          <button
            type="button"
            onClick={handleResetVars}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Reset Variables' : 'Resetează'}</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">
          {lang === 'en'
            ? 'Task: Use the Scratch blocks below to increment "scor" to at least 5 points while keeping "vieți" positive.'
            : 'Misiune practică: Folosește blocurile Scratch de mai jos pentru a crește variabila „scor” la cel puțin 5 puncte!'}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Blocks & Modifiers */}
          <div className="lg:col-span-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {lang === 'en' ? 'Execute Scratch Variable Blocks:' : 'Execută Blocuri de Variabile:'}
            </h4>

            {/* Score Blocks */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Variable: scor' : 'Variabila: scor'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => toggleVisibility('v_score')}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {variables.find(v => v.id === 'v_score')?.visibleOnStage ? <Eye className="w-3.5 h-3.5 text-amber-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{lang === 'en' ? 'Stage View' : 'Vizibil'}</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleModifyVar('v_score', 1)}
                  className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs font-bold transition shadow cursor-pointer"
                >
                  {lang === 'en' ? 'modifică [scor] cu (1)' : 'modifică [scor] cu (1)'}
                </button>
                <button
                  type="button"
                  onClick={() => handleModifyVar('v_score', 2)}
                  className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs font-bold transition shadow cursor-pointer"
                >
                  {lang === 'en' ? 'modifică [scor] cu (2)' : 'modifică [scor] cu (2)'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSetVar('v_score', 0)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-xs border border-slate-700 cursor-pointer"
                >
                  {lang === 'en' ? 'setează [scor] la (0)' : 'setează [scor] la (0)'}
                </button>
              </div>
            </div>

            {/* Lives Blocks */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Variable: vieți' : 'Variabila: vieți'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => toggleVisibility('v_lives')}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {variables.find(v => v.id === 'v_lives')?.visibleOnStage ? <Eye className="w-3.5 h-3.5 text-rose-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{lang === 'en' ? 'Stage View' : 'Vizibil'}</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleModifyVar('v_lives', -1)}
                  className="px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-600 text-white font-mono text-xs font-bold transition shadow cursor-pointer"
                >
                  {lang === 'en' ? 'modifică [vieți] cu (-1)' : 'modifică [vieți] cu (-1)'}
                </button>
                <button
                  type="button"
                  onClick={() => handleModifyVar('v_lives', 1)}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold transition shadow cursor-pointer"
                >
                  {lang === 'en' ? 'modifică [vieți] cu (1)' : 'modifică [vieți] cu (1)'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSetVar('v_lives', 3)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 font-mono text-xs border border-slate-700 cursor-pointer"
                >
                  {lang === 'en' ? 'setează [vieți] la (3)' : 'setează [vieți] la (3)'}
                </button>
              </div>
            </div>
          </div>

          {/* Live Stage Display */}
          <div className="lg:col-span-6">
            <div className="bg-slate-950 px-4 py-2 rounded-t-xl border border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-300 font-semibold">{lang === 'en' ? 'Stage Variable Monitors' : 'Monitoare de Variabile pe Scenă'}</span>
              <span className="text-xs font-mono text-orange-400">Scratch Watchers</span>
            </div>

            <div className="relative w-full aspect-[4/3] rounded-b-xl border-x border-b border-slate-700 bg-slate-950 p-4 flex flex-col justify-between select-none">
              {/* Active Stage Watchers */}
              <div className="space-y-2">
                {variables.filter(v => v.visibleOnStage).map(v => (
                  <div
                    key={v.id}
                    className="inline-flex items-center bg-slate-900/90 border border-slate-600 px-3 py-1 rounded-lg text-xs font-mono shadow-md mr-2"
                  >
                    <span className="text-slate-300 mr-2 font-bold">{v.name}:</span>
                    <span className={`px-2 py-0.5 rounded bg-slate-950 font-bold ${v.color}`}>
                      {v.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Sprite reaction */}
              <div className="flex flex-col items-center">
                <div className="text-5xl animate-bounce">
                  {taskCompleted ? '🎉' : '🤖'}
                </div>
                <div className="mt-2 text-xs font-bold text-white bg-slate-900/90 px-3 py-1 rounded-full border border-slate-700">
                  {taskCompleted
                    ? (lang === 'en' ? 'Mission Goal Complete! (+40 Pts)' : 'Misiune Îndeplinită! Scorul este ≥ 5 (+40 Pcte)')
                    : (lang === 'en' ? 'Increase score to 5!' : 'Crește scorul la 5 puncte!')}
                </div>
              </div>

              {/* Memory values table */}
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center justify-around font-mono">
                <span>RAM[scor] = <strong className="text-amber-400">{variables.find(v => v.id === 'v_score')?.value}</strong></span>
                <span>RAM[vieți] = <strong className="text-rose-400">{variables.find(v => v.id === 'v_lives')?.value}</strong></span>
                <span>RAM[energie] = <strong className="text-sky-400">{variables.find(v => v.id === 'v_energy')?.value}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Quiz */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange-400" />
          <span>{lang === 'en' ? 'Variable Logic Assessment' : 'Evaluare: Logica Variabilelor în Scratch'}</span>
        </h3>

        {/* Question 1 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
            </span>
            <QuestionHint
              hintRo="„Setează” schimbă complet valoarea cu numărul ales, iar „modifică cu” adună o cantitate la numărul deja stocat."
              hintEn="'Set' replaces the stored number entirely, while 'change by' adds an offset to the existing value."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'If variable "scor" has value 10, what happens after executing "modifică [scor] cu (-3)"?'
              : 'Dacă variabila „scor” are valoarea 10, ce valoare va avea după executarea blocului „modifică [scor] cu (-3)”?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'set_vs_change', ro: '7 (valoarea inițială 10 scade cu 3)', en: '7 (initial value 10 decreased by 3)' },
              { id: 'val_minus_3', ro: '-3 (valoarea este suprascrisă direct)', en: '-3 (value is directly overwritten)' },
              { id: 'val_13', ro: '13 (se adună mereu indiferent de semn)', en: '13 (always adds regardless of sign)' },
              { id: 'val_0', ro: '0 (variabila se resetează automat)', en: '0 (variable resets automatically)' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q1 || 0) > 0}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'set_vs_change'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-orange-400 text-slate-300'
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
              customMessageRo="Reflecție didactică: Blocul „modifică cu” adună algebric numărul introdus la valoarea curentă!"
              customMessageEn="Pedagogical reflection: The 'change by' block adds the input offset algebraically to current value!"
            />
          ) : null}
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanationRo="10 + (-3) = 7. Pentru a suprascrie valoarea direct la -3, s-ar fi folosit blocul „setează [scor] la (-3)”."
              explanationEn="10 + (-3) = 7. To overwrite directly with -3, you would use 'set [scor] to (-3)'."
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
            </span>
            <QuestionHint
              hintRo="În paleta din stânga, lângă numele fiecărei variabile, există o căsuță de bifare (checkbox)."
              hintEn="In the left palette next to each variable name sits a small toggle checkbox."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'How can you quickly show or hide a variable monitor directly on the Scratch stage?'
              : 'Cum poți afișa sau ascunde rapid monitorul unei variabile direct pe scena din Scratch?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'checkbox_stage', ro: 'Bifând sau debifând căsuța de lângă numele variabilei din paleta Variabile', en: 'Checking/unchecking the box next to variable name in the palette' },
              { id: 'delete_sprite', ro: 'Ștergând personajul de pe scenă', en: 'Deleting the sprite from the stage' },
              { id: 'restart_pc', ro: 'Repornind calculatorul', en: 'Restarting the computer' },
              { id: 'double_click', ro: 'Dând dublu clic pe Steagul Verde', en: 'Double clicking the Green Flag' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q2 || 0) > 0}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'checkbox_stage'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-orange-400 text-slate-300'
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
              customMessageRo="Reflecție didactică: Căsuțele de bifare din paletă controlează instant vizibilitatea monitoarelor!"
              customMessageEn="Pedagogical reflection: Checkboxes in the palette instantly toggle watcher visibility on stage!"
            />
          ) : null}
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanationRo="Pe lângă căsuța din paletă, se pot folosi și blocurile de cod „arată variabila [..]” și „ascunde variabila [..]”."
              explanationEn="Besides the palette checkbox, code blocks 'show variable' and 'hide variable' can also be used."
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentPage={5}
        totalPages={7}
        earnedScore={totalScore}
        isCompleted={isPageComplete}
        onNextPage={() => {
          sounds.playCorrect();
          onCompletePage(totalScore);
        }}
        nextButtonLabelRo="Continuă la Pagina 6: Proiectul „RoboOperații”"
        nextButtonLabelEn="Proceed to Page 6: Project 'RoboOperations'"
      />
    </div>
  );
};
