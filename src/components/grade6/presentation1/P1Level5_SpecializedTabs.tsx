import React, { useState } from 'react';
import { 
  Palette, 
  Sparkles, 
  Play, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  MonitorPlay, 
  PenTool, 
  Video, 
  Check, 
  Star,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';

interface P1Level5Props {
  onCompletePage: (earnedScore: number) => void;
}

export const P1Level5_SpecializedTabs: React.FC<P1Level5Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive effect simulator: 'transition' vs 'animation'
  const [selectedEffectType, setSelectedEffectType] = useState<'transition' | 'animation'>('transition');
  const [activeTransitionEffect, setActiveTransitionEffect] = useState<string>('fade');
  const [activeAnimationEffect, setActiveAnimationEffect] = useState<string>('bounce');
  const [isPlayingDemo, setIsPlayingDemo] = useState<boolean>(false);
  const [hasTestedBoth, setHasTestedBoth] = useState<Record<string, boolean>>({ transition: true });

  // Quiz state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  const handlePlayDemo = () => {
    sounds.playRetro('coin');
    setIsPlayingDemo(true);
    setTimeout(() => {
      setIsPlayingDemo(false);
    }, 1200);
  };

  const handleSelectEffectType = (type: 'transition' | 'animation') => {
    sounds.playClick();
    setSelectedEffectType(type);
    setHasTestedBoth(prev => ({ ...prev, [type]: true }));
  };

  const handleQ1 = (id: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    setQ1Answer(id);
    if (id === 'transition_diff') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const handleQ2 = (id: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    setQ2Answer(id);
    if (id === 'f5_key') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  const isQ1Correct = q1Answer === 'transition_diff';
  const isQ2Correct = q2Answer === 'f5_key';

  const testedCount = Object.keys(hasTestedBoth).length;
  const explorerScore = testedCount >= 2 ? 50 : 25;
  const quizScore = (isQ1Correct ? 25 : 0) + (isQ2Correct ? 25 : 0);
  const totalScore = Math.min(100, explorerScore + quizScore);

  const isPageComplete = (q1Answer !== null && q2Answer !== null) || testedCount >= 2;

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-950/60 via-slate-900 to-slate-950 border-2 border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 font-mono text-xs font-bold border border-orange-500/40">
              {lang === 'en' ? 'Grade 6 • Unit 1 • Page 14' : 'Clasa a VI-a • Unitatea 1 • Pag. 14'}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
              {lang === 'en' ? 'Screen 5 of 7' : 'Ecranul 5 din 7'}
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 100 XP
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-heading tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-400 shrink-0">
              <Sparkles className="w-6 h-6" />
            </span>
            <span>
              {lang === 'en'
                ? 'Specialized Tabs: Design, Transitions & Animations'
                : 'Filele Specializate: Proiectare, Tranziții & Animații'}
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            {lang === 'en'
              ? 'Distinguish the golden rule: Transitions apply to entire slides, while Animations apply to individual elements inside slides! Discover also the Slide Show tab (F5).'
              : 'Descoperă regula de aur a prezentărilor: Tranziția se aplică întregului diapozitiv la trecerea dintre pagini, în timp ce Animația se aplică unui obiect din interior (text, poză). Explorează și Fila Expunere (Slide Show / F5)!'}
          </p>
        </div>
      </div>

      {/* Golden Rule Comparison Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-slate-900/90 border-2 border-teal-500/40 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center font-bold">
              🎞️
            </div>
            <h3 className="text-base font-black text-teal-300">
              {lang === 'en' ? 'Fila Tranziții (Transitions)' : 'Fila Tranziții (Transitions)'}
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            {lang === 'en'
              ? 'Controls the visual effect when passing from one slide to the next (e.g. Fade, Push, Wipe, Split).'
              : 'Controlează efectul vizual la trecerea de la un diapozitiv la următorul. Întregul ecran se transformă (Ex: Estompare, Împingere, Ștergere, Cortină).'}
          </p>
          <div className="px-3 py-1.5 rounded-lg bg-teal-950/60 border border-teal-500/30 text-[11px] font-mono text-teal-300 font-bold">
            Diapozitivul A ──[ Efect Tranziție ]──► Diapozitivul B
          </div>
        </div>

        <div className="bg-slate-900/90 border-2 border-amber-500/40 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold">
              ✨
            </div>
            <h3 className="text-base font-black text-amber-300">
              {lang === 'en' ? 'Fila Animații (Animations)' : 'Fila Animații (Animations)'}
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            {lang === 'en'
              ? 'Applies dynamic effects to individual elements INSIDE a slide (Entrance, Emphasis, Exit).'
              : 'Se aplică obiectelor INDIVIDUALE din interiorul diapozitivului: o casetă de text care zboară, o imagine care se rotește sau un titlu care apare treptat.'}
          </p>
          <div className="px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-500/30 text-[11px] font-mono text-amber-300 font-bold">
            Obiect (Poză / Text) ──[ Apariție / Mișcare / Ieșire ]
          </div>
        </div>
      </div>

      {/* Interactive Visual Playground */}
      <div className="bg-slate-900/95 border-2 border-orange-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
          <div>
            <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
              {lang === 'en' ? 'Live Interactive Stage' : 'Laboratorul de Efecte Vizuale'}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white font-heading">
              {lang === 'en' ? 'Test Transition vs Animation:' : 'Testează diferența dintre Tranziție și Animație:'}
            </h3>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => handleSelectEffectType('transition')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedEffectType === 'transition'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎞️ {lang === 'en' ? 'Slide Transition' : 'Tranziție Diapozitiv'}
            </button>
            <button
              onClick={() => handleSelectEffectType('animation')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedEffectType === 'animation'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ✨ {lang === 'en' ? 'Object Animation' : 'Animație Obiect'}
            </button>
          </div>
        </div>

        {/* Visual Stage */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden">
          {/* Simulated Slide Window */}
          <div
            className={`w-72 sm:w-96 h-48 rounded-xl border-4 p-4 flex flex-col items-center justify-center relative transition-all duration-700 shadow-2xl ${
              selectedEffectType === 'transition'
                ? isPlayingDemo
                  ? activeTransitionEffect === 'fade'
                    ? 'opacity-20 scale-95 border-teal-400 bg-slate-800'
                    : 'translate-x-full border-teal-400 bg-slate-800'
                  : 'opacity-100 scale-100 border-teal-500/60 bg-gradient-to-br from-teal-950/80 to-slate-900'
                : 'border-slate-700 bg-slate-900'
            }`}
          >
            <span className="text-[10px] font-mono text-slate-400 absolute top-2 left-3">
              Diapozitivul 1 (Format 16:9)
            </span>

            {/* Inner Animated Object */}
            <div
              className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all duration-700 ${
                selectedEffectType === 'animation'
                  ? isPlayingDemo
                    ? activeAnimationEffect === 'bounce'
                      ? 'scale-125 -translate-y-4 border-amber-400 bg-amber-500/30 text-amber-200'
                      : 'rotate-180 scale-110 border-amber-400 bg-amber-500/30 text-amber-200'
                    : 'scale-100 border-amber-500/60 bg-amber-950/60 text-white'
                  : 'border-slate-700 bg-slate-800 text-slate-300'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-white shadow">
                ★
              </div>
              <div>
                <div className="text-xs font-bold">Obiect Grafic Mascota Arky</div>
                <div className="text-[9px] text-slate-400 font-mono">Element intern diapozitiv</div>
              </div>
            </div>

            <span className="text-[10px] text-slate-400 mt-4 text-center">
              {selectedEffectType === 'transition'
                ? 'Efectul se aplică întregii foi de lucru (la schimbarea slide-ului)'
                : 'Efectul se aplică doar steluței de mai sus (la declanșare)'}
            </span>
          </div>

          {/* Trigger Play Button */}
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={handlePlayDemo}
              disabled={isPlayingDemo}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-black transition flex items-center gap-2 shadow-lg shadow-orange-600/30 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>
                {isPlayingDemo
                  ? (lang === 'en' ? 'Playing Effect...' : 'Se redă efectul...')
                  : (lang === 'en' ? 'Simulate Effect Now!' : 'Redă Efectul Didactic!')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Checkpoint Quiz */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <BookOpen className="w-5 h-5 text-orange-400" />
          <h2 className="text-lg sm:text-xl font-black text-white font-heading">
            {lang === 'en' ? 'Checkpoint Questions (Art Klett p. 14)' : 'Întrebări de Fixare (Manual Art Klett pag. 14)'}
          </h2>
        </div>

        {/* Q1 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <span className="text-sm sm:text-base font-bold text-white">
              {lang === 'en'
                ? '1. What is the fundamental difference between a Transition and an Animation?'
                : '1. Care este diferența fundamentală dintre o Tranziție și o Animație în PowerPoint?'}
            </span>
            <QuestionHint
              hintRo="Tranziția este pentru trecerea dintre pagini/slide-uri, iar animația este pentru elementele din pagină."
              hintEn="Transitions are for slide changes, while animations are for elements within the slide."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'transition_diff', ro: 'Tranziția e la trecerea dintre diapozitive, Animația e pe obiecte din interior', en: 'Transition is between slides, Animation is on internal objects' },
              { id: 'same_thing', ro: 'Sunt identice, doar au nume diferite în meniu', en: 'They are identical, just named differently' },
              { id: 'sound_diff', ro: 'Tranziția are sunet, iar animația este întotdeauna mută', en: 'Transition has sound, animation is always muted' },
              { id: 'delete_effect', ro: 'Tranziția șterge textul de pe ecran', en: 'Transition deletes text on screen' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'transition_diff'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
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
              customMessageRo="Reflecție didactică: Reține clar — Tranziție = trecere între diapozitive; Animație = mișcare pe obiecte individuale!"
              customMessageEn="Pedagogical reflection: Remember clearly — Transition = between slides; Animation = on individual objects!"
            />
          ) : null}

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanationRo="Corect! Tranziția afectează tot ecranul la schimbarea diapozitivului, în timp ce Animația se aplică unui titlu, casete text sau imagini."
              explanationEn="Correct! Transitions affect the entire screen change, while Animations apply to titles, text boxes, or photos."
            />
          )}
        </div>

        {/* Q2 */}
        <div className="flex flex-col gap-3 pt-3 border-t border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <span className="text-sm sm:text-base font-bold text-white">
              {lang === 'en'
                ? '2. What magic key on the keyboard starts the Slide Show from the first slide?'
                : '2. Ce tastă magică de pe tastatură pornește Expunerea (Slide Show) pe tot ecranul de la început?'}
            </span>
            <QuestionHint
              hintRo="Este tasta funcțională F5!"
              hintEn="It is function key F5!"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'f5_key', ro: 'Tasta F5 (sau Shift + F5 de la diapozitivul curent)', en: 'F5 key (or Shift+F5 from current slide)' },
              { id: 'space_key', ro: 'Tasta Spațiu (Space)', en: 'Spacebar' },
              { id: 'escape_key', ro: 'Tasta Esc (Escape)', en: 'Escape key' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'f5_key'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
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
              customMessageRo="Reflecție didactică: Tasta F5 este scurtătura universală care pornește proiecția prezentării pe tot ecranul!"
              customMessageEn="Pedagogical reflection: The F5 key is the universal shortcut that launches full-screen slide shows!"
            />
          ) : null}

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanationRo="Excelent! Apăsarea tastei F5 lansează prezentarea de la primul diapozitiv pe tot ecranul, iar Shift + F5 o lansează de la diapozitivul curent."
              explanationEn="Excellent! Pressing F5 starts the presentation full screen from slide 1, while Shift+F5 starts from the current slide."
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
        nextButtonLabelRo="Continuă la Pagina 6: Bara de Stare, Moduri de Vizualizare & Zoom"
        nextButtonLabelEn="Proceed to Page 6: Status Bar, View Modes & Zoom Slider"
      />
    </div>
  );
};
