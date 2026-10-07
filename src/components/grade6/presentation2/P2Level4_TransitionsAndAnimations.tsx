import React, { useState } from 'react';
import { 
  Play, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Star,
  Check,
  Zap,
  Clock,
  Layers,
  Volume2,
  MousePointer,
  RotateCw
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';

interface P2Level4Props {
  onCompletePage: (earnedScore: number) => void;
}

type AnimationCategory = 'entrance' | 'emphasis' | 'exit' | 'motion';
type TransitionType = 'fade' | 'push' | 'wipe' | 'morph' | 'zoom';

export const P2Level4_TransitionsAndAnimations: React.FC<P2Level4Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive Animation & Transition Lab State
  const [activeTab, setActiveTab] = useState<'transitions' | 'animations'>('transitions');
  const [currentTransition, setCurrentTransition] = useState<TransitionType>('morph');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [slideNumber, setSlideNumber] = useState<number>(1);

  // Animation states
  const [activeAnimCategory, setActiveAnimCategory] = useState<AnimationCategory>('entrance');
  const [activeAnimEffect, setActiveAnimEffect] = useState<string>('flyIn');
  const [isAnimatingObject, setIsAnimatingObject] = useState<boolean>(false);
  const [testedTransitions, setTestedTransitions] = useState<Record<string, boolean>>({ morph: true });
  const [testedAnimations, setTestedAnimations] = useState<Record<string, boolean>>({ flyIn: true });

  // Quiz states
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  const handleTestTransition = (t: TransitionType) => {
    sounds.playRetro('shoot');
    setCurrentTransition(t);
    setIsTransitioning(true);
    setTestedTransitions(prev => ({ ...prev, [t]: true }));
    setTimeout(() => {
      setSlideNumber(prev => (prev === 1 ? 2 : 1));
      setIsTransitioning(false);
    }, 600);
  };

  const handleTriggerObjectAnimation = (effect: string, cat: AnimationCategory) => {
    sounds.playRetro('powerup');
    setActiveAnimCategory(cat);
    setActiveAnimEffect(effect);
    setIsAnimatingObject(true);
    setTestedAnimations(prev => ({ ...prev, [effect]: true }));
    setTimeout(() => {
      setIsAnimatingObject(false);
    }, 1200);
  };

  const handleAnswerQ1 = (val: string) => {
    if (q1Answer) return;
    setQ1Answer(val);
    if (val === 'slide_vs_object') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: Date.now() + 4000 }));
    }
  };

  const handleAnswerQ2 = (val: string) => {
    if (q2Answer) return;
    setQ2Answer(val);
    if (val === 'entrance_green') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: Date.now() + 4000 }));
    }
  };

  const isQ1Correct = q1Answer === 'slide_vs_object';
  const isQ2Correct = q2Answer === 'entrance_green';
  const hasTestedBoth = Object.keys(testedTransitions).length >= 2 && Object.keys(testedAnimations).length >= 2;
  const isComplete = hasTestedBoth && isQ1Correct && isQ2Correct;

  const handleFinish = () => {
    if (isComplete) {
      sounds.playVictory();
      onCompletePage(100);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Pedagogical Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 border-2 border-teal-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400 flex items-center justify-center text-3xl shadow-inner shrink-0">
              ✨
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-400/20 border border-indigo-400/40 text-[11px] font-mono font-bold text-indigo-300 uppercase">
                  {lang === 'en' ? 'Unit 1 • Lesson 4 (p. 20)' : 'Unitatea 1 • Lecția 4 (pag. 20)'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {lang === 'en' ? 'Screen 4/7' : 'Ecranul 4/7'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {lang === 'en' 
                  ? 'Transitions & Object Animations' 
                  : 'Tranziții între Diapozitive & Animații pe Obiecte'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-mono text-indigo-300">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{lang === 'en' ? 'Slide Transitions vs Object Effects' : 'Tranziții Slide vs Animații Obiecte'}</span>
          </div>
        </div>
      </div>

      {/* Interactive Theory Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Tranziții (Transitions) */}
        <div className="bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-base">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>{lang === 'en' ? '1. Slide Transitions (Fila Tranziții)' : '1. Tranziții între Diapozitive'}</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'Transitions are visual motion effects that occur when moving from one slide to the next during the presentation.'
              : 'Tranzițiile sunt efecte vizuale de mișcare care au loc în momentul trecerii de la un diapozitiv la următorul în timpul expunerii.'}
          </p>
          <ul className="text-xs text-slate-300 space-y-1.5 pl-2">
            <li>• <strong>Exemple:</strong> Morfare (Morph), Estompare (Fade), Împingere (Push), Ștergere (Wipe).</li>
            <li>• <strong>Setări:</strong> Durată în secunde, Sunet de tranziție, Trecere la clic sau după un timp setat.</li>
          </ul>
        </div>

        {/* Card 2: Animații (Animations) */}
        <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
            <Play className="w-5 h-5 text-emerald-400" />
            <span>{lang === 'en' ? '2. Object Animations (Fila Animații)' : '2. Animații pe Obiecte Individuale'}</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'Animations apply to specific elements inside a single slide: text boxes, titles, photos, shapes, or charts.'
              : 'Animațiile se aplică elementelor individuale din interiorul unui diapozitiv: casete text, titluri, poze, forme geometrice sau grafice.'}
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <span className="p-1.5 bg-emerald-950/60 border border-emerald-500/40 rounded text-emerald-300 font-bold">🟢 Intrare (Entrance)</span>
            <span className="p-1.5 bg-amber-950/60 border border-amber-500/40 rounded text-amber-300 font-bold">🟡 Accentuare (Emphasis)</span>
            <span className="p-1.5 bg-rose-950/60 border border-rose-500/40 rounded text-rose-300 font-bold">🔴 Ieșire (Exit)</span>
            <span className="p-1.5 bg-cyan-950/60 border border-cyan-500/40 rounded text-cyan-300 font-bold">🔵 Trasee de Mișcare</span>
          </div>
        </div>
      </div>

      {/* Interactive FX Studio */}
      <div className="bg-slate-900/95 border-2 border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>{lang === 'en' ? 'Interactive Motion & Effects Lab' : 'Laboratorul Practic de Tranziții & Animații'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en' ? 'Test slide transitions and trigger object effects to see them live!' : 'Apasă pe butoane pentru a testa tranzițiile și animațiile în timp real!'}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('transitions')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'transitions'
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tranziții Diapozitiv
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('animations')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'animations'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Animații Obiecte
            </button>
          </div>
        </div>

        {/* Sub-controls based on Tab */}
        {activeTab === 'transitions' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {lang === 'en' ? 'Select Slide Transition Effect:' : 'Alege un Efect de Tranziție (Fila Tranziții):'}
              </label>
              <span className="text-[11px] font-mono text-indigo-300">
                {lang === 'en' ? 'Next Slide' : 'Diapozitivul Curent'}: #{slideNumber}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { id: 'morph', name: 'Morfare (Morph)', icon: '🌀' },
                { id: 'fade', name: 'Estompare (Fade)', icon: '🌫️' },
                { id: 'push', name: 'Împingere (Push)', icon: '⬆️' },
                { id: 'wipe', name: 'Ștergere (Wipe)', icon: '🧹' },
                { id: 'zoom', name: 'Zoom / Mărire', icon: '🔍' }
              ].map(tr => (
                <button
                  key={tr.id}
                  type="button"
                  onClick={() => handleTestTransition(tr.id as TransitionType)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    currentTransition === tr.id
                      ? 'border-indigo-400 bg-indigo-950/50 ring-2 ring-indigo-400/40 text-white shadow-lg'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="text-xl">{tr.icon}</span>
                  <span className="text-xs font-bold">{tr.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {lang === 'en' ? 'Select Object Animation Effect:' : 'Alege un Efect de Animație pe Obiect (Fila Animații):'}
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => handleTriggerObjectAnimation('flyIn', 'entrance')}
                className="p-3 rounded-xl border border-emerald-500/50 bg-emerald-950/30 hover:bg-emerald-900/40 text-left transition-all cursor-pointer"
              >
                <div className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                  <span>🟢 Zbor în interior (Fly In)</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Efect de Intrare</div>
              </button>

              <button
                type="button"
                onClick={() => handleTriggerObjectAnimation('pulse', 'emphasis')}
                className="p-3 rounded-xl border border-amber-500/50 bg-amber-950/30 hover:bg-amber-900/40 text-left transition-all cursor-pointer"
              >
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <span>🟡 Impuls / Pulsare (Pulse)</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Efect de Accentuare</div>
              </button>

              <button
                type="button"
                onClick={() => handleTriggerObjectAnimation('spin', 'emphasis')}
                className="p-3 rounded-xl border border-amber-500/50 bg-amber-950/30 hover:bg-amber-900/40 text-left transition-all cursor-pointer"
              >
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <span>🟡 Rotire 360° (Spin)</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Efect de Accentuare</div>
              </button>

              <button
                type="button"
                onClick={() => handleTriggerObjectAnimation('zoomOut', 'exit')}
                className="p-3 rounded-xl border border-rose-500/50 bg-rose-950/30 hover:bg-rose-900/40 text-left transition-all cursor-pointer"
              >
                <div className="text-xs font-bold text-rose-300 flex items-center gap-1">
                  <span>🔴 Micșorare & Dispariție</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Efect de Ieșire</div>
              </button>
            </div>
          </div>
        )}

        {/* Live Theater Display Screen */}
        <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center min-h-[260px] relative overflow-hidden">
          <div 
            className={`w-full max-w-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/40 rounded-2xl p-6 shadow-2xl transition-all duration-500 ${
              isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                {lang === 'en' ? `Slide #${slideNumber} • Live Projection Stage` : `Diapozitivul #${slideNumber} • Scenă de Proiecție`}
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold">
                Tranziție: {currentTransition.toUpperCase()}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-lg font-black text-white">
                  {slideNumber === 1 
                    ? '🌲 Rezervația Naturală Retezat' 
                    : '🌊 Delta Dunării: Paradisul Păsărilor'}
                </h3>
                <p className="text-xs text-slate-300 max-w-sm">
                  {slideNumber === 1
                    ? 'Lacurile glaciare și vârfurile spectaculoase din Carpații Meridionali.'
                    : 'Cea mai bine conservată deltă din Europa și patrimoniu mondial UNESCO.'}
                </p>
              </div>

              {/* Animated Mascot / Badge Target */}
              <div 
                className={`w-28 h-28 rounded-2xl bg-gradient-to-br from-teal-500/20 to-indigo-500/30 border-2 border-teal-400 flex flex-col items-center justify-center text-center p-2 shadow-xl transition-all ${
                  isAnimatingObject && activeAnimEffect === 'flyIn' ? 'animate-bounce' : ''
                } ${
                  isAnimatingObject && activeAnimEffect === 'pulse' ? 'scale-125 ring-4 ring-amber-400' : ''
                } ${
                  isAnimatingObject && activeAnimEffect === 'spin' ? 'rotate-180 duration-700' : ''
                } ${
                  isAnimatingObject && activeAnimEffect === 'zoomOut' ? 'scale-0 opacity-20' : ''
                }`}
              >
                <span className="text-3xl mb-1">🦅</span>
                <span className="text-[10px] font-mono font-bold text-teal-300">
                  {activeAnimEffect.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2">
            {Object.keys(testedTransitions).length >= 2 ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Tranziții testate
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <Layers className="w-4 h-4" /> Testează minimum 2 tranziții
              </span>
            )}
            <span>•</span>
            {Object.keys(testedAnimations).length >= 2 ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Animații obiecte testate
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <Play className="w-4 h-4" /> Testează minimum 2 efecte pe obiecte
              </span>
            )}
          </div>
          <span className="text-slate-400 text-[11px]">Fila Tranziții vs Fila Animații</span>
        </div>
      </div>

      {/* Evaluation Quizzes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quiz 1 */}
        <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase">
              {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
            </span>
            <QuestionHint hint={lang === 'en' ? 'Transitions happen between entire slides; animations happen on individual objects inside a slide.' : 'Tranziția se produce între slide-uri întregi, iar animația se aplică pe un obiect din interiorul slide-ului.'} />
          </div>

          <h3 className="text-sm font-bold text-white">
            {lang === 'en'
              ? 'What is the fundamental difference between a Transition and an Animation?'
              : 'Care este diferența fundamentală între o Tranziție și o Animație în PowerPoint?'}
          </h3>

          <div className="space-y-2">
            {[
              { id: 'slide_vs_object', label: lang === 'en' ? 'Transition is between full slides; Animation is applied to specific elements (text, image, shape)' : 'Tranziția are loc la trecerea dintre diapozitive; Animația se aplică pe obiecte individuale din diapozitiv' },
              { id: 'same_thing', label: lang === 'en' ? 'They are identical concepts with different names' : 'Sunt același lucru, doar că scrise cu alte cuvinte' },
              { id: 'trans_only_sound', label: lang === 'en' ? 'Transitions only play audio files' : 'Tranzițiile redau doar fișiere audio' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={!!q1Answer}
                onClick={() => handleAnswerQ1(opt.id)}
                className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'slide_vs_object'
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanation={
                isQ1Correct
                  ? (lang === 'en'
                      ? 'Perfect! Transitions handle slide-to-slide shifts, whereas animations bring life to internal items.'
                      : 'Excelent! Tranzițiile gestionează trecerea de la un slide la altul, în timp ce animațiile pun în mișcare obiectele din interiorul slide-ului.')
                  : (lang === 'en'
                      ? 'Incorrect. Remember: Slide Transition = Between slides; Animation = On objects inside a slide.'
                      : 'Incorect. Reține: Tranziție = Schimbarea slide-ului întreg; Animație = Mișcarea unui element intern.')
              }
            />
          )}
        </div>

        {/* Quiz 2 */}
        <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase">
              {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
            </span>
            <QuestionHint hint={lang === 'en' ? 'Entrance effects bring an object onto the slide (marked in green).' : 'Efectele de intrare aduc obiectul în scenă și sunt marcate cu verde.'} />
          </div>

          <h3 className="text-sm font-bold text-white">
            {lang === 'en'
              ? 'Which animation category is used to make an object appear onto the slide with motion?'
              : 'Ce categorie de animații (marcată cu pictograme verzi) se folosește pentru a introduce un obiect pe ecran?'}
          </h3>

          <div className="space-y-2">
            {[
              { id: 'entrance_green', label: lang === 'en' ? 'Entrance Animations (Verde / Intrare)' : 'Efecte de Intrare (Entrance - Verde)' },
              { id: 'exit_red', label: lang === 'en' ? 'Exit Animations (Roșu / Ieșire)' : 'Efecte de Ieșire (Exit - Roșu)' },
              { id: 'emphasis_yellow', label: lang === 'en' ? 'Emphasis Animations (Galben / Accentuare)' : 'Efecte de Accentuare (Emphasis - Galben)' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={!!q2Answer}
                onClick={() => handleAnswerQ2(opt.id)}
                className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'entrance_green'
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanation={
                isQ2Correct
                  ? (lang === 'en'
                      ? 'Correct! Green icons represent Entrance effects, yellow is for Emphasis, and red is for Exit.'
                      : 'Bravo! Pictogramele verzi simbolizează efectele de Intrare (apariție), cele galbene Accentuarea, iar cele roșii Ieșirea (dispariția).')
                  : (lang === 'en'
                      ? 'Not quite. Exit removes objects, while Entrance introduces them.'
                      : 'Nu chiar. Efectele de ieșire scot obiectul de pe ecran, în timp ce efectele de intrare îl aduc pe ecran.')
              }
            />
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <PageNavigationFooter
        canAdvance={isComplete}
        onAdvance={handleFinish}
        cooldownRemaining={0}
      />
    </div>
  );
};
