import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Video,
  Mic,
  Disc,
  Play,
  Pause,
  Sliders,
  Move,
  Smile,
  Zap
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { useQuestionCooldowns, PedagogicalReflectionBanner } from '../../../utils/pedagogicalGrading';

interface Level3Props {
  onCompletePage: (earnedScore: number) => void;
}

type CharacterAction = 'idle' | 'wave' | 'jump' | 'dance' | 'alert' | 'think';

export const AnimVRLevel3_DigitalPuppeteeringLab: React.FC<Level3Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  // Digital Puppeteering Stage State
  const [posX, setPosX] = useState<number>(50); // percentage 10 to 90
  const [posY, setPosY] = useState<number>(65); // percentage 30 to 80
  const [action, setAction] = useState<CharacterAction>('idle');
  const [character, setCharacter] = useState<'arky' | 'cybercat' | 'astroboy'>('arky');
  const [background, setBackground] = useState<'lab' | 'space' | 'cyberforest'>('lab');

  // Recording Simulation
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recTimer, setRecTimer] = useState<number>(0);
  const [hasRecordedScene, setHasRecordedScene] = useState<boolean>(false);

  // Quiz questions
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  // Record timer loop
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecTimer((prev) => {
          if (prev >= 6) {
            setIsRecording(false);
            setHasRecordedScene(true);
            sounds.playSuccess();
            return 6;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = () => {
    sounds.playRetro('coin');
    setIsRecording(true);
    setRecTimer(0);
  };

  const handleSetAction = (act: CharacterAction) => {
    setAction(act);
    sounds.playPop();
  };

  const handleMove = (dx: number, dy: number) => {
    setPosX((prev) => Math.max(10, Math.min(90, prev + dx)));
    setPosY((prev) => Math.max(30, Math.min(80, prev + dy)));
    sounds.playClick();
  };

  const handleQ1 = (val: string) => {
    if (isLocked('q1') || q1 === 'puppeteering') return;
    setQ1(val);
    if (val === 'puppeteering') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1', 5);
    }
  };

  const handleQ2 = (val: string) => {
    if (isLocked('q2') || q2 === 'sync') return;
    setQ2(val);
    if (val === 'sync') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2', 5);
    }
  };

  const allCompleted = hasRecordedScene && q1 === 'puppeteering' && q2 === 'sync';

  const handleContinue = () => {
    if (!allCompleted) return;
    sounds.playLevelUp();
    onCompletePage(15);
  };

  // Emojis and action displays
  const getCharEmoji = () => {
    if (character === 'arky') return '🤖';
    if (character === 'cybercat') return '🐱';
    return '🧑‍🚀';
  };

  const getActionEffect = () => {
    switch (action) {
      case 'wave':
        return '👋';
      case 'jump':
        return '🦘';
      case 'dance':
        return '✨';
      case 'alert':
        return '⚠️';
      case 'think':
        return '💡';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-900/40 via-blue-900/40 to-slate-900/60 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold tracking-wider uppercase">
                {isEn ? 'Unit 2B • Lesson 3 (Part III)' : 'Unitatea 2B • Lecția 3 (Partea a III-a)'}
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-mono font-bold">
                Manual pag. 38–39
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-heading tracking-tight mb-2">
              {isEn ? 'Digital Puppeteering & Live Stage Direction' : 'Păpușărie Digitală & Regie de Scenă în Timp Real'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {isEn
                ? 'No tedious frame-by-frame drawing required! In Toontastic 3D, characters are puppeteered with your hands on stage while your voice is captured simultaneously.'
                : 'Uită de desenarea obositoare a fiecărui cadru! În Toontastic 3D, personajele sunt mânuite direct pe ecran precum marionetele digitale, în timp ce vocea și dialogul sunt înregistrate în direct.'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
              <Video className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Puppeteering Stage */}
      <div className="bg-slate-900 border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xl">
              🎭
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
                {isEn ? 'Puppeteering Stage Simulator' : 'Studioul Interactiv de Marionete Digitale'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {isEn
                  ? 'Move your character, trigger expressive actions, and hit Record Scene to direct a 6-second take!'
                  : 'Deplasează personajul pe scenă, declanșează acțiuni expresive și pornește REC pentru o dublă de 6 secunde!'}
              </p>
            </div>
          </div>

          {/* Record Scene Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleStartRecording}
              disabled={isRecording}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-500/30'
                  : 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white shadow-md cursor-pointer'
              }`}
            >
              <Disc className={`w-4 h-4 ${isRecording ? 'animate-spin' : ''}`} />
              <span>
                {isRecording
                  ? `REC 🔴 (${recTimer}s / 6s)`
                  : hasRecordedScene
                  ? (isEn ? 'Re-Record Scene' : 'Trage o nouă dublă')
                  : (isEn ? 'Record Scene (REC)' : 'Înregistrează Scena (REC)')}
              </span>
            </button>
          </div>
        </div>

        {/* The Virtual Set Background */}
        <div
          className={`relative h-64 sm:h-72 rounded-3xl border-2 border-slate-700 overflow-hidden shadow-inner flex flex-col justify-between p-4 transition-all ${
            background === 'lab'
              ? 'bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950'
              : background === 'space'
              ? 'bg-gradient-to-b from-purple-950 via-slate-950 to-black'
              : 'bg-gradient-to-b from-emerald-950 via-teal-950 to-slate-950'
          }`}
        >
          {/* Top Stage Bar with Live Indicators */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-white font-bold">
                {background === 'lab' ? '🖥️ Laborator TIC' : background === 'space' ? '🚀 Stația Spațială' : '🌲 Pădurea Cibernetică'}
              </span>
            </div>

            {isRecording && (
              <div className="flex items-center gap-2 bg-rose-950/90 border border-rose-500 px-3 py-1 rounded-xl text-rose-300 text-xs font-mono font-bold animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>ÎNREGISTRARE VOCE & MIȘCARE ACTIVE ({recTimer}s)</span>
              </div>
            )}
          </div>

          {/* Virtual Character On Stage */}
          <div
            className="absolute transition-all duration-200 flex flex-col items-center pointer-events-none"
            style={{
              left: `${posX}%`,
              top: `${posY}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {/* Action emote bubble */}
            {getActionEffect() && (
              <div className="bg-white/90 text-black px-2 py-0.5 rounded-full text-xs font-bold shadow-lg mb-1 animate-bounce">
                {getActionEffect()}
              </div>
            )}

            {/* Character Sprite with animation classes */}
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 border-2 border-white shadow-2xl flex items-center justify-center text-3xl sm:text-4xl transition-transform ${
                action === 'jump'
                  ? '-translate-y-6'
                  : action === 'wave'
                  ? 'rotate-6'
                  : action === 'dance'
                  ? 'scale-110 rotate-12'
                  : action === 'alert'
                  ? 'scale-125 ring-4 ring-rose-500'
                  : ''
              }`}
            >
              {getCharEmoji()}
            </div>

            <span className="text-[10px] font-mono text-cyan-200 font-bold mt-1 bg-slate-900/80 px-2 py-0.5 rounded-full border border-cyan-500/30">
              X: {posX}% | Y: {posY}%
            </span>
          </div>

          {/* Floor ground line */}
          <div className="w-full h-2 bg-slate-800/80 rounded-full border-t border-slate-700/60 mt-auto" />
        </div>

        {/* Puppet Controls Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Movement Arrows */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-bold uppercase flex items-center gap-1.5">
                <Move className="w-4 h-4 text-cyan-400" />
                {isEn ? 'Position on Stage:' : 'Deplasare pe Scenă:'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto">
              <div />
              <button
                onClick={() => handleMove(0, -10)}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-center"
              >
                ▲
              </button>
              <div />
              <button
                onClick={() => handleMove(-10, 0)}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-center"
              >
                ◀
              </button>
              <button
                onClick={() => { setPosX(50); setPosY(65); sounds.playPop(); }}
                className="p-2.5 rounded-xl bg-cyan-900/40 hover:bg-cyan-800/40 border border-cyan-700 text-cyan-300 font-bold text-xs"
              >
                Centru
              </button>
              <button
                onClick={() => handleMove(10, 0)}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-center"
              >
                ▶
              </button>
              <div />
              <button
                onClick={() => handleMove(0, 10)}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-center"
              >
                ▼
              </button>
              <div />
            </div>
          </div>

          {/* Action Trigger Emotes */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="text-xs font-mono text-slate-400 font-bold uppercase flex items-center gap-1.5">
              <Smile className="w-4 h-4 text-amber-400" />
              {isEn ? 'Trigger Expressive Actions:' : 'Declanșează Acțiuni Expresive:'}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'wave', label: 'Salută (Wave)', emoji: '👋' },
                { id: 'jump', label: 'Sari (Jump)', emoji: '🦘' },
                { id: 'dance', label: 'Dans (Dance)', emoji: '🕺' },
                { id: 'alert', label: 'Alertă (Alarm)', emoji: '⚠️' },
                { id: 'think', label: 'Idee (Think)', emoji: '💡' },
                { id: 'idle', label: 'Relaxat (Idle)', emoji: '😌' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSetAction(item.id as CharacterAction)}
                  className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                    action === item.id
                      ? 'bg-cyan-600/30 border-cyan-400 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{item.emoji}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cast & Background Switcher */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="text-xs font-mono text-slate-400 font-bold uppercase flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-purple-400" />
              {isEn ? 'Cast & Background Set:' : 'Distribuție & Decor:'}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 w-16">Personaj:</span>
                <div className="flex gap-1.5 flex-1">
                  {[
                    { id: 'arky', label: 'Arky 🤖' },
                    { id: 'cybercat', label: 'Pisi 🐱' },
                    { id: 'astroboy', label: 'Astro 🧑‍🚀' }
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { setCharacter(c.id as any); sounds.playPop(); }}
                      className={`px-2 py-1 rounded-lg text-xs font-mono font-bold border flex-1 ${
                        character === c.id
                          ? 'bg-purple-600 border-purple-400 text-white'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 w-16">Decor:</span>
                <div className="flex gap-1.5 flex-1">
                  {[
                    { id: 'lab', label: 'TIC' },
                    { id: 'space', label: 'Cosmos' },
                    { id: 'cyberforest', label: 'Pădure' }
                  ].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => { setBackground(b.id as any); sounds.playPop(); }}
                      className={`px-2 py-1 rounded-lg text-xs font-mono font-bold border flex-1 ${
                        background === b.id
                          ? 'bg-blue-600 border-blue-400 text-white'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {hasRecordedScene && (
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-2 text-[11px] text-emerald-300 font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dubla a fost înregistrată cu succes!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Puppeteering Quiz */}
      <div className="bg-slate-900/90 border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xl">
            ✍️
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              {isEn ? 'Evaluation Questions' : 'Verificare de Regie Digitală (2 Întrebări)'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {isEn
                ? 'Test your understanding of digital puppeteering and audio sync.'
                : 'Testează-ți cunoștințele despre sincronizarea mișcării și a vocii.'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Question 1 */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs flex items-center justify-center font-mono">1</span>
                {isEn
                  ? 'What technique makes Toontastic 3D fast and accessible by letting you move characters with your finger in real time?'
                  : 'Ce tehnică inovatoare face aplicația Toontastic 3D extrem de rapidă și intuitivă, permițând mișcarea personajului pe ecran în timp real cu degetul sau mouse-ul?'}
              </h3>
              <QuestionHint
                hintRo="Se numește păpușărie digitală (puppeteering), asemănătoare mânuirii marionetelor într-un teatru de păpuși."
                hintEn="It is called digital puppeteering, similar to puppetry in puppet theater."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'framebyframe', label: 'Desenare cadru cu cadru pe hârtie milimetrică' },
                { id: 'puppeteering', label: 'Păpușărie digitală în timp real (Digital Puppeteering)' },
                { id: 'binary', label: 'Programare în cod binar de mână' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  disabled={isLocked('q1') || q1 === 'puppeteering'}
                  onClick={() => handleQ1(opt.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all disabled:cursor-not-allowed ${
                    q1 === opt.id
                      ? opt.id === 'puppeteering'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                        : 'bg-rose-500/20 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.label}</span>
                    {q1 === opt.id && (opt.id === 'puppeteering' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />)}
                  </div>
                </button>
              ))}
            </div>

            {cooldowns.q1 && cooldowns.q1 > 0 ? (
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q1}
                totalSeconds={5}
                customMessageRo="Timp de reflecție: Păpușăria digitală salvează traseul degetului tău pe ecran!"
                customMessageEn="Reflection buffer: Digital puppeteering records your finger's path on screen!"
              />
            ) : null}

            {q1 && (
              <AnswerExplanation
                isCorrect={q1 === 'puppeteering'}
                explanationRo="Corect! Păpușăria digitală elimină nevoia de a desena sute de cadre manual: calculatorul reține traseul degetului tău pe ecran și generează animația fluidă automat."
                explanationEn="Correct! Digital puppeteering eliminates drawing hundreds of frames manually: the app captures your finger trajectory and generates smooth animation automatically."
              />
            )}
          </div>

          {/* Question 2 */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs flex items-center justify-center font-mono">2</span>
                {isEn
                  ? 'What happens simultaneously while you are moving the character during REC in Toontastic?'
                  : 'Ce se întâmplă simultan în timp ce miști personajul pe scenă în timpul înregistrării (REC) în Toontastic 3D?'}
              </h3>
              <QuestionHint
                hintRo="Microfonul este pornit și înregistrează vocea ta, replicile personajelor și efectele sonore."
                hintEn="The microphone is active and records your voice, dialogue, and sound effects."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'sync', label: 'Microfonul captează vocea ta sincronizată cu mișcarea personajului' },
                { id: 'shut', label: 'Calculatorul se oprește automat pentru economisire' },
                { id: 'mute', label: 'Sunetul este interzis complet în animații' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  disabled={isLocked('q2') || q2 === 'sync'}
                  onClick={() => handleQ2(opt.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all disabled:cursor-not-allowed ${
                    q2 === opt.id
                      ? opt.id === 'sync'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                        : 'bg-rose-500/20 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.label}</span>
                    {q2 === opt.id && (opt.id === 'sync' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />)}
                  </div>
                </button>
              ))}
            </div>

            {cooldowns.q2 && cooldowns.q2 > 0 ? (
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q2}
                totalSeconds={5}
                customMessageRo="Timp de reflecție: Microfonul înregistrează vocea sincronizată exact cu mișcările tale!"
                customMessageEn="Reflection buffer: The mic records voice precisely synchronized with character actions!"
              />
            ) : null}

            {q2 && (
              <AnswerExplanation
                isCorrect={q2 === 'sync'}
                explanationRo="Exact! Aplicația realizează sincronizarea audio-video: vocea regizorului este înregistrată perfect sincron cu mișcările degetului pe scenă."
                explanationEn="Exactly! The app performs audio-video sync: the director's voice is recorded in perfect synchronicity with stage movements."
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
                {isEn ? 'Puppeteering master unlocked! You earned 15 XP.' : 'Atelierul de păpușărie a fost finalizat! Ai obținut 15 XP.'}
              </span>
            ) : (
              <span>{isEn ? 'Record a scene and answer both questions to advance.' : 'Apasă pe REC pentru a trage o dublă și răspunde la ambele întrebări.'}</span>
            )}
          </div>

          <button
            onClick={handleContinue}
            disabled={!allCompleted}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-sm font-heading flex items-center justify-center gap-2 transition-all ${
              allCompleted
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/30 cursor-pointer scale-105'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <span>{isEn ? 'Advance to Level 4: Audio Mood & Voice Direction' : 'Treci la Nivelul 4: Coloană Sonoră & Dispoziție (Mood)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
