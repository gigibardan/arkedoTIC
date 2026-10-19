import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Layers,
  ChevronRight,
  Lightbulb,
  FileText,
  Clapperboard,
  Download
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { useQuestionCooldowns, PedagogicalReflectionBanner } from '../../../utils/pedagogicalGrading';

interface Level2Props {
  onCompletePage: (earnedScore: number) => void;
}

export const AnimVRLevel2_StoryArcToontastic: React.FC<Level2Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  // Interactive Story Arc Arranger
  // We have 3 scenes that must be mapped to Act 1 (Setup), Act 2 (Conflict), Act 3 (Resolution)
  const initialCards = [
    {
      id: 'conflict',
      titleRo: 'Alarmă în Laborator: Un virus blochează conexiunea!',
      titleEn: 'Lab Alarm: A virus locks the internet connection!',
      descRo: 'Dintr-o dată, ecranul principal devine roșu, iar imprimanta 3D se oprește la jumătatea unui proiect important.',
      descEn: 'Suddenly, the main screen flashes red, and the 3D printer freezes midway through an important project.',
      correctAct: 2,
      emoji: '⚡'
    },
    {
      id: 'setup',
      titleRo: 'Dimineață liniștită: Arky prezintă laboratorul TIC',
      titleEn: 'Peaceful morning: Arky introduces the ICT lab',
      descRo: 'Elevii intră veseli în laboratorul de informatică, își deschid calculatoarele și încep să lucreze la animații.',
      descEn: 'Students happily enter the computer lab, log into their PCs, and start working on their animations.',
      correctAct: 1,
      emoji: '☀️'
    },
    {
      id: 'resolution',
      titleRo: 'Soluția de Aur: Firewall-ul este activat & proiectul salvat',
      titleEn: 'Golden Solution: Firewall restored & project saved',
      descRo: 'Arky izolează amenințarea, restabilește conexiunea sigură, iar elevii finalizează macheta cu succes, învățând morala.',
      descEn: 'Arky isolates the malware, restores safe network, and students finish their model successfully, learning the moral.',
      correctAct: 3,
      emoji: '🏆'
    }
  ];

  const [slot1, setSlot1] = useState<string | null>(null);
  const [slot2, setSlot2] = useState<string | null>(null);
  const [slot3, setSlot3] = useState<string | null>(null);

  // Quiz questions
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const handleSelectCardForSlot = (cardId: string, slotIndex: 1 | 2 | 3) => {
    sounds.playPop();
    if (slotIndex === 1) {
      if (slot2 === cardId) setSlot2(null);
      if (slot3 === cardId) setSlot3(null);
      setSlot1(cardId);
    } else if (slotIndex === 2) {
      if (slot1 === cardId) setSlot1(null);
      if (slot3 === cardId) setSlot3(null);
      setSlot2(cardId);
    } else {
      if (slot1 === cardId) setSlot1(null);
      if (slot2 === cardId) setSlot2(null);
      setSlot3(cardId);
    }
  };

  const handleResetSlots = () => {
    sounds.playClick();
    setSlot1(null);
    setSlot2(null);
    setSlot3(null);
  };

  const isArcCorrect = slot1 === 'setup' && slot2 === 'conflict' && slot3 === 'resolution';

  const handleQ1 = (val: string) => {
    if (isLocked('q1') || q1 === 'conflict') return;
    setQ1(val);
    if (val === 'conflict') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1', 5);
    }
  };

  const handleQ2 = (val: string) => {
    if (isLocked('q2') || q2 === '3parts') return;
    setQ2(val);
    if (val === '3parts') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2', 5);
    }
  };

  const allCompleted = isArcCorrect && q1 === 'conflict' && q2 === '3parts';

  const handleExportScript = () => {
    sounds.playRetro('powerup');
    const scriptData = {
      projectType: 'Toontastic_StoryArc_Script',
      unit: 'Clasa a VI-a • Unitatea 2B (Animație & VR)',
      acts: [
        { act: 1, title: 'Setup', description: 'Dimineață liniștită: Arky prezintă laboratorul TIC' },
        { act: 2, title: 'Conflict', description: 'Alarmă în Laborator: Un virus blochează conexiunea!' },
        { act: 3, title: 'Resolution', description: 'Soluția de Aur: Firewall-ul este activat & proiectul salvat' }
      ],
      guidelines: ['Arcul Narativ în 3 Acte', 'Introducere personaj & decor', 'Punct culminant dramatic', 'Rezolvare prin colaborare'],
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(scriptData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Fisa_Regizor_Storyboard_Toontastic_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleContinue = () => {
    if (!allCompleted) return;
    sounds.playLevelUp();
    onCompletePage(15);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-900/40 via-purple-900/40 to-slate-900/60 border border-pink-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 text-xs font-mono font-bold tracking-wider uppercase">
                {isEn ? 'Unit 2B • Lesson 3 (Part II)' : 'Unitatea 2B • Lecția 3 (Partea a II-a)'}
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold">
                Manual pag. 36–38
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-heading tracking-tight mb-2">
              {isEn ? 'The Story Arc & Toontastic 3D Scenography' : 'Arcul Narativ al Poveștii în Toontastic 3D'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {isEn
                ? 'Every great animated movie follows a 3-act narrative arc: Setup, Conflict, and Resolution. Learn how to structure your scenes like a pro director.'
                : 'Orice film animat de succes respectă un arc narativ în 3 acte esențiale: Începutul (Setup), Conflictul (Punctul culminant) și Rezolvarea (Resolution). Învață să gândești ca un adevărat scenarist!'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/30">
              <Clapperboard className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Story Arc Visualization Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Act 1: Setup */}
        <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">Actul I</span>
                <h3 className="font-bold text-white text-base">
                  {isEn ? 'Setup (Introduction)' : 'Setup (Începutul)'}
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
              {isEn
                ? 'Introduce the main characters, the setting (forest, classroom, spaceship), and establish the ordinary world before anything unusual happens.'
                : 'Prezintă personajul principal, decorul (sala de clasă, laboratorul, spațiul cosmic) și atmosfera calmă inițială înainte de apariția oricărei provocări.'}
            </p>
          </div>
          <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-xl p-2.5 text-[11px] text-emerald-300 font-mono">
            🎭 {isEn ? 'Question: Who & Where?' : 'Întrebare cheie: Cine și Unde?'}
          </div>
        </div>

        {/* Act 2: Conflict */}
        <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">Actul II</span>
                <h3 className="font-bold text-white text-base">
                  {isEn ? 'Conflict (The Climax)' : 'Conflictul (Punctul Culminant)'}
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
              {isEn
                ? 'A major obstacle or dilemma strikes! The tension reaches its peak. Characters must face adversity and make tough decisions.'
                : 'Apare o problemă neașteptată sau o dilemă majoră! Tensiunea atinge punctul culminant. Personajele trebuie să facă față unui pericol sau obstacol dificil.'}
            </p>
          </div>
          <div className="bg-amber-950/40 border border-amber-800/40 rounded-xl p-2.5 text-[11px] text-amber-300 font-mono">
            ⚡ {isEn ? 'Question: What goes wrong?' : 'Întrebare cheie: Ce problemă apare?'}
          </div>
        </div>

        {/* Act 3: Resolution */}
        <div className="bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">Actul III</span>
                <h3 className="font-bold text-white text-base">
                  {isEn ? 'Resolution (Ending)' : 'Deznodământul (Rezolvarea)'}
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
              {isEn
                ? 'How the heroes overcome the conflict through teamwork or ingenuity. The story concludes with a satisfying takeaway or moral.'
                : 'Cum depășesc eroii conflictul prin colaborare sau o idee ingenioasă. Povestea se încheie cu succes, desprinzându-se o morală folositoare.'}
            </p>
          </div>
          <div className="bg-indigo-950/40 border border-indigo-800/40 rounded-xl p-2.5 text-[11px] text-indigo-300 font-mono">
            🏆 {isEn ? 'Question: How is it solved?' : 'Întrebare cheie: Cum se rezolvă totul?'}
          </div>
        </div>
      </div>

      {/* Interactive Story Arc Arranger Laboratory */}
      <div className="bg-slate-900 border-2 border-pink-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center text-xl">
              🎬
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
                {isEn ? 'Workshop: Reorder Arky\'s Short Story' : 'Atelier Practic: Ordonează Scenele lui Arky'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {isEn
                  ? 'Assign each story moment to its matching Act slot (Setup, Conflict, or Resolution).'
                  : 'Trage sau alege cartonașul potrivit pentru fiecare dintre cele 3 acte ale scenariului.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleResetSlots}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {isEn ? 'Reset Order' : 'Resetează'}
          </button>
        </div>

        {/* 3 Target Slots */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Slot 1: Setup */}
          <div className={`rounded-2xl p-4 border-2 transition-all ${
            slot1 === 'setup'
              ? 'bg-emerald-950/30 border-emerald-500/80 shadow-lg shadow-emerald-500/10'
              : slot1
              ? 'bg-rose-950/30 border-rose-500/80'
              : 'bg-slate-950/60 border-dashed border-slate-700'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Slot 1: Începutul (Setup)</span>
              {slot1 === 'setup' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            {slot1 ? (
              <div className="space-y-1">
                <div className="font-bold text-sm text-white">
                  {initialCards.find((c) => c.id === slot1)?.titleRo}
                </div>
                <div className="text-xs text-slate-400">
                  {initialCards.find((c) => c.id === slot1)?.descRo}
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic py-6 text-center">
                {isEn ? 'Click a story card below to assign here' : 'Apasă pe un cartonaș de mai jos pentru a-l plasa aici'}
              </div>
            )}
          </div>

          {/* Slot 2: Conflict */}
          <div className={`rounded-2xl p-4 border-2 transition-all ${
            slot2 === 'conflict'
              ? 'bg-amber-950/30 border-amber-500/80 shadow-lg shadow-amber-500/10'
              : slot2
              ? 'bg-rose-950/30 border-rose-500/80'
              : 'bg-slate-950/60 border-dashed border-slate-700'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase">Slot 2: Conflictul (Climax)</span>
              {slot2 === 'conflict' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            {slot2 ? (
              <div className="space-y-1">
                <div className="font-bold text-sm text-white">
                  {initialCards.find((c) => c.id === slot2)?.titleRo}
                </div>
                <div className="text-xs text-slate-400">
                  {initialCards.find((c) => c.id === slot2)?.descRo}
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic py-6 text-center">
                {isEn ? 'Click a story card below to assign here' : 'Apasă pe un cartonaș de mai jos pentru a-l plasa aici'}
              </div>
            )}
          </div>

          {/* Slot 3: Resolution */}
          <div className={`rounded-2xl p-4 border-2 transition-all ${
            slot3 === 'resolution'
              ? 'bg-indigo-950/30 border-indigo-500/80 shadow-lg shadow-indigo-500/10'
              : slot3
              ? 'bg-rose-950/30 border-rose-500/80'
              : 'bg-slate-950/60 border-dashed border-slate-700'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase">Slot 3: Rezolvarea (Resolution)</span>
              {slot3 === 'resolution' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            {slot3 ? (
              <div className="space-y-1">
                <div className="font-bold text-sm text-white">
                  {initialCards.find((c) => c.id === slot3)?.titleRo}
                </div>
                <div className="text-xs text-slate-400">
                  {initialCards.find((c) => c.id === slot3)?.descRo}
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic py-6 text-center">
                {isEn ? 'Click a story card below to assign here' : 'Apasă pe un cartonaș de mai jos pentru a-l plasa aici'}
              </div>
            )}
          </div>
        </div>

        {/* Available Story Moments */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-slate-400 uppercase font-bold">
            {isEn ? 'Available Story Cards (Click a slot to place):' : 'Cartonașe Disponibile (Alege unde vrei să le trimiți):'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {initialCards.map((card) => {
              const isAssigned = slot1 === card.id || slot2 === card.id || slot3 === card.id;
              return (
                <div
                  key={card.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isAssigned
                      ? 'bg-slate-950/40 border-slate-800 opacity-60'
                      : 'bg-slate-950 border-slate-700 hover:border-pink-500/50 shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xl">{card.emoji}</span>
                    <h4 className="text-xs font-bold text-white leading-tight">{card.titleRo}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-3">{card.descRo}</p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSelectCardForSlot(card.id, 1)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-emerald-600/40 text-[10px] text-slate-300 font-mono transition-colors"
                    >
                      → Slot 1
                    </button>
                    <button
                      onClick={() => handleSelectCardForSlot(card.id, 2)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-amber-600/40 text-[10px] text-slate-300 font-mono transition-colors"
                    >
                      → Slot 2
                    </button>
                    <button
                      onClick={() => handleSelectCardForSlot(card.id, 3)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-indigo-600/40 text-[10px] text-slate-300 font-mono transition-colors"
                    >
                      → Slot 3
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {isArcCorrect && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <b>Excelent!</b> Ai asamblat perfect arcul narativ: Începutul stabil (Setup) → Apariția obstacolului neașteptat (Conflict) → Triumful ingenios al echipei (Resolution).
              </div>
            </div>

            <button
              type="button"
              onClick={handleExportScript}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1.5 shrink-0 shadow cursor-pointer text-xs"
            >
              <Download className="w-4 h-4" />
              <span>{isEn ? 'Export Director\'s Sheet' : 'Descarcă Fișa Regizorală'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Narrative Questions */}
      <div className="bg-slate-900/90 border-2 border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center text-xl">
            🧠
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              {isEn ? 'Evaluation Questions' : 'Verificare de Scenariu (2 Întrebări)'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {isEn
                ? 'Check your narrative knowledge from pages 36-38 of the textbook.'
                : 'Testează-ți cunoștințele despre scenaristică conform manualului clasei a VI-a.'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Question 1 */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 text-xs flex items-center justify-center font-mono">1</span>
                {isEn
                  ? 'Which act of the story arc represents the moment where tension is highest and an obstacle challenges the characters?'
                  : 'Care act al arcului narativ reprezintă momentul în care tensiunea este maximă și apare problema ce pune la încercare personajele?'}
              </h3>
              <QuestionHint
                hintRo="Este momentul disputei sau provocării, situat între introducere și deznodământ."
                hintEn="It is the moment of challenge, located between introduction and resolution."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'setup', label: 'Setup (Începutul)' },
                { id: 'conflict', label: 'Conflict (Punctul culminant / Provocarea)' },
                { id: 'credits', label: 'Genericul de final (Credits)' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  disabled={isLocked('q1') || q1 === 'conflict'}
                  onClick={() => handleQ1(opt.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all disabled:cursor-not-allowed ${
                    q1 === opt.id
                      ? opt.id === 'conflict'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                        : 'bg-rose-500/20 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.label}</span>
                    {q1 === opt.id && (opt.id === 'conflict' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />)}
                  </div>
                </button>
              ))}
            </div>

            {cooldowns.q1 && cooldowns.q1 > 0 ? (
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q1}
                totalSeconds={5}
                customMessageRo="Timp de reflecție: Conflictul este momentul cheie dintre introducere și deznodământ!"
                customMessageEn="Reflection buffer: The conflict is the key moment between introduction and resolution!"
              />
            ) : null}

            {q1 && (
              <AnswerExplanation
                isCorrect={q1 === 'conflict'}
                explanationRo="Corect! Conflictul este motorul dramatic al oricărei povești: fără o problemă de rezolvat, spectatorul își pierde interesul."
                explanationEn="Correct! The conflict is the engine of drama: without a problem to solve, the audience loses engagement."
              />
            )}
          </div>

          {/* Question 2 */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 text-xs flex items-center justify-center font-mono">2</span>
                {isEn
                  ? 'In Toontastic 3D, how many main parts does the Short Story preset contain?'
                  : 'În aplicația Toontastic 3D, câte părți principale are modul presetat „Short Story” (Poveste Scurtă)?'}
              </h3>
              <QuestionHint
                hintRo="Cele 3 acte de bază: Început, Conflict, Rezolvare (Setup, Conflict, Resolution)."
                hintEn="The 3 basic acts: Beginning, Conflict, Resolution."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: '1part', label: '1 singură parte fără întreruperi' },
                { id: '3parts', label: '3 părți (Setup, Conflict, Resolution)' },
                { id: '20parts', label: '20 de părți mici de câte 2 secunde' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  disabled={isLocked('q2') || q2 === '3parts'}
                  onClick={() => handleQ2(opt.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all disabled:cursor-not-allowed ${
                    q2 === opt.id
                      ? opt.id === '3parts'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                        : 'bg-rose-500/20 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.label}</span>
                    {q2 === opt.id && (opt.id === '3parts' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />)}
                  </div>
                </button>
              ))}
            </div>

            {cooldowns.q2 && cooldowns.q2 > 0 ? (
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q2}
                totalSeconds={5}
                customMessageRo="Timp de reflecție: Toontastic 3D structurează povestea scurtă în exact 3 părți!"
                customMessageEn="Reflection buffer: Toontastic 3D structures a short story into exactly 3 parts!"
              />
            ) : null}

            {q2 && (
              <AnswerExplanation
                isCorrect={q2 === '3parts'}
                explanationRo="Exact! Toontastic 3D oferă modul „Short Story” format din exact 3 acte (Setup, Conflict, Resolution), perfect adaptat proiectelor școlare."
                explanationEn="Exactly! Toontastic 3D offers the 'Short Story' mode made of 3 acts (Setup, Conflict, Resolution), ideal for classroom school projects."
              />
            )}
          </div>
        </div>

        {/* Level Complete Action */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 font-mono">
            {allCompleted ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {isEn ? 'Story arc completed! You earned 15 XP.' : 'Arcul narativ este complet și corect! Ai obținut 15 XP.'}
              </span>
            ) : (
              <span>{isEn ? 'Reorder all 3 slots and answer the questions to advance.' : 'Ordonează cele 3 sloturi și răspunde la întrebări pentru a debloca Nivelul 3.'}</span>
            )}
          </div>

          <button
            onClick={handleContinue}
            disabled={!allCompleted}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-sm font-heading flex items-center justify-center gap-2 transition-all ${
              allCompleted
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white shadow-lg shadow-pink-500/30 cursor-pointer scale-105'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <span>{isEn ? 'Advance to Level 3: Digital Puppeteering' : 'Treci la Nivelul 3: Păpușărie Digitală & Regie'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
