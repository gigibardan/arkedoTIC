import React, { useState } from 'react';
import {
  Compass,
  RotateCw,
  RotateCcw,
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Eye,
  Sliders,
  Code2,
  Box,
  Layers,
  Zap,
  Target
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { useQuestionCooldowns, PedagogicalReflectionBanner } from '../../../utils/pedagogicalGrading';

interface Level6Props {
  onCompletePage: (earnedScore: number) => void;
}

export const AnimVRLevel6_CoSpaces360VirtualWorld: React.FC<Level6Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  // 360 Camera Angle State
  const [rotationAngle, setRotationAngle] = useState<number>(0); // 0 to 360 degrees
  const [cameraMode, setCameraMode] = useState<'walk' | 'fly' | 'fixed'>('walk');

  // Hotspots in the virtual world
  const [visitedHotspots, setVisitedHotspots] = useState<Set<string>>(new Set());
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  // Quiz questions
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const handleRotate = (delta: number) => {
    sounds.playPop();
    setRotationAngle((prev) => (prev + delta + 360) % 360);
  };

  const handleTriggerHotspot = (id: string, message: string) => {
    sounds.playRetro('powerup');
    setVisitedHotspots((prev) => new Set(prev).add(id));
    setActiveDialog(message);
  };

  const handleQ1 = (val: string) => {
    if (isLocked('q1') || q1 === 'coblocks') return;
    setQ1(val);
    if (val === 'coblocks') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1', 5);
    }
  };

  const handleQ2 = (val: string) => {
    if (isLocked('q2') || q2 === 'wasd') return;
    setQ2(val);
    if (val === 'wasd') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2', 5);
    }
  };

  const allHotspotsFound = visitedHotspots.size >= 3;
  const allCompleted = allHotspotsFound && q1 === 'coblocks' && q2 === 'wasd';

  const handleContinue = () => {
    if (!allCompleted) return;
    sounds.playLevelUp();
    onCompletePage(15);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900/60 border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-mono font-bold tracking-wider uppercase">
                {isEn ? 'Unit 2B • Lesson 4 (Part II)' : 'Unitatea 2B • Lecția 4 (Partea a II-a)'}
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-bold">
                Manual pag. 42–43
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-heading tracking-tight mb-2">
              {isEn ? '360° Virtual Worlds & CoSpaces Edu' : 'Lumi Virtuale 360° & Programare CoSpaces Edu'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {isEn
                ? 'Design 3D spaces that can be explored from any angle. Use CoBlocks visual code to trigger animations when the user looks or clicks in VR.'
                : 'Construiește scene 3D panoramice explorabile la 360° și programează interacțiuni inteligente prin blocuri vizuale CoBlocks asemănătoare cu Scratch.'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Compass className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Theory Pills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                🎥
              </div>
              <h3 className="font-bold text-white text-base">
                {isEn ? 'The 360° Camera' : 'Camera Virtuală 360°'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
              {isEn
                ? 'The camera acts as the student’s virtual head. In First-Person mode, looking around or moving changes the perspective continuously.'
                : 'Camera reprezintă ochii elevului în lumea digitală. În modul First-Person (Perspectiva întâi), mișcarea capului sau a tastelor WASD rotește scena la 360°.'}
            </p>
          </div>
          <div className="bg-blue-950/40 border border-blue-800/40 rounded-xl p-2 text-[11px] text-blue-300 font-mono">
            🧭 Rotație pe axele X, Y, Z
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">
                {isEn ? 'CoBlocks Visual Scripting' : 'Programare prin CoBlocks'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
              {isEn
                ? 'Similar to Scratch: blocks like "When [Object] is clicked -> say [Text]" empower students to create escape rooms, games, and VR tours.'
                : 'Asemănător cu Scratch: blocurile precum „Când dai click pe [Personaj] -> Spune [Text]” transformă o scenă statică într-un muzeu sau joc interactiv.'}
            </p>
          </div>
          <div className="bg-indigo-950/40 border border-indigo-800/40 rounded-xl p-2 text-[11px] text-indigo-300 font-mono">
            🧩 Evenimente & Acțiuni tactile
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <Box className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">
                {isEn ? 'Spatial Library & Assets' : 'Biblioteca de Obiecte 3D'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
              {isEn
                ? 'Populate the stage with buildings, animals, vehicles, and sound emitters. Each object has scale, elevation, and collision properties.'
                : 'Scena se populează cu modele tridimensionale din bibliotecă (personaje, clădiri, vehicule, surse de lumină), fiecare având proprietăți de scară și elevație.'}
            </p>
          </div>
          <div className="bg-purple-950/40 border border-purple-800/40 rounded-xl p-2 text-[11px] text-purple-300 font-mono">
            📦 Coordonate spațiale (X, Y, Z)
          </div>
        </div>
      </div>

      {/* Interactive 360 Degree Virtual Scene Simulator */}
      <div className="bg-slate-900 border-2 border-blue-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xl">
              🌐
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
                {isEn ? 'Virtual Space Station 360° Explorer' : 'Exploratorul Panoramic 360°: Stația Arky'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {isEn
                  ? 'Rotate the 360° camera and click on all 3 interactive CoBlocks hotspots hidden in the panorama.'
                  : 'Rotește camera virtuală la 360° și dă click pe cele 3 puncte fierbinți CoBlocks ascunse în scenă.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
            <Target className="w-4 h-4 text-blue-400" />
            <span>Puncte CoBlocks găsite: {visitedHotspots.size} / 3</span>
          </div>
        </div>

        {/* The 360 Viewport */}
        <div className="relative h-72 sm:h-80 rounded-3xl border-2 border-slate-700 bg-slate-950 overflow-hidden shadow-2xl flex flex-col justify-between p-4">
          {/* Panoramic Cosmic Background moving with rotation angle */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at ${50 + Math.sin((rotationAngle * Math.PI) / 180) * 40}% ${50 + Math.cos((rotationAngle * Math.PI) / 180) * 20}%, #1e1b4b 0%, #030712 100%)`
            }}
          />

          {/* Grid lines simulating VR 3D Floor plane */}
          <div
            className="absolute inset-x-0 bottom-0 h-44 opacity-25 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to top, rgba(59, 130, 246, 0.4) 1px, transparent 1px), linear-gradient(to right, rgba(59, 130, 246, 0.4) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              transform: `perspective(300px) rotateX(60deg) translateX(${((rotationAngle % 60) - 30)}px)`
            }}
          />

          {/* Top Compass Heading HUD */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs font-mono">
              <Compass className="w-4 h-4 text-cyan-400 animate-spin" />
              <span className="text-white font-bold">Direcție Vizuală: {rotationAngle}°</span>
              <span className="text-slate-500">|</span>
              <span className="text-cyan-300">{rotationAngle < 90 ? 'Nord-Est' : rotationAngle < 180 ? 'Sud-Est' : rotationAngle < 270 ? 'Sud-Vest' : 'Nord-Vest'}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-mono text-slate-300">
              <span>Mod:</span>
              <span className="text-amber-400 font-bold uppercase">{cameraMode}</span>
            </div>
          </div>

          {/* 3 Hotspots in 360 Space depending on angle range */}
          <div className="relative w-full h-full flex items-center justify-center z-10 pointer-events-auto">
            {/* Hotspot 1: Satellite (Around 0 - 60 degrees) */}
            {rotationAngle >= 330 || rotationAngle <= 70 ? (
              <div
                className="absolute transition-all duration-300 cursor-pointer flex flex-col items-center"
                style={{
                  left: `${50 + (rotationAngle > 180 ? rotationAngle - 360 : rotationAngle) * 1.5}%`,
                  top: '25%'
                }}
                onClick={() =>
                  handleTriggerHotspot(
                    'sat',
                    '🛰️ Satelit Orbital: CoBlocks a executat comanda `Când clic pe Satelit -> Începe rotația pe orbita terestră`.'
                  )
                }
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border-2 border-indigo-400 text-3xl flex items-center justify-center hover:scale-125 transition-transform shadow-xl shadow-indigo-500/30 animate-pulse">
                  🛰️
                </div>
                <span className="text-[10px] font-mono font-bold text-indigo-300 mt-1 bg-slate-900/90 px-2 py-0.5 rounded-full border border-indigo-500/40">
                  {visitedHotspots.has('sat') ? 'Satelit Activ ✅' : 'Click CoBlocks 👆'}
                </span>
              </div>
            ) : null}

            {/* Hotspot 2: Arky Explorer (Around 90 - 180 degrees) */}
            {rotationAngle >= 80 && rotationAngle <= 200 ? (
              <div
                className="absolute transition-all duration-300 cursor-pointer flex flex-col items-center"
                style={{
                  left: `${50 + (rotationAngle - 135) * 1.5}%`,
                  top: '45%'
                }}
                onClick={() =>
                  handleTriggerHotspot(
                    'arky',
                    '🤖 Arky Explorer: CoBlocks a declanșat dialogul `Când clic pe Arky -> Spune: Bun venit în lumea virtuală a clasei a VI-a!`.'
                  )
                }
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-600/30 border-2 border-blue-400 text-3xl flex items-center justify-center hover:scale-125 transition-transform shadow-xl shadow-blue-500/30">
                  🤖
                </div>
                <span className="text-[10px] font-mono font-bold text-blue-300 mt-1 bg-slate-900/90 px-2 py-0.5 rounded-full border border-blue-500/40">
                  {visitedHotspots.has('arky') ? 'Arky Vizitat ✅' : 'Click CoBlocks 👆'}
                </span>
              </div>
            ) : null}

            {/* Hotspot 3: Cyber Portal (Around 210 - 320 degrees) */}
            {rotationAngle >= 200 && rotationAngle <= 320 ? (
              <div
                className="absolute transition-all duration-300 cursor-pointer flex flex-col items-center"
                style={{
                  left: `${50 + (rotationAngle - 260) * 1.5}%`,
                  top: '35%'
                }}
                onClick={() =>
                  handleTriggerHotspot(
                    'portal',
                    '🌀 Portal Dimensional: CoBlocks a executat acțiunea `Când clic pe Portal -> Deschide ușa și emite sunetul teleportării`.'
                  )
                }
              >
                <div className="w-16 h-16 rounded-2xl bg-purple-600/30 border-2 border-purple-400 text-3xl flex items-center justify-center hover:scale-125 transition-transform shadow-xl shadow-purple-500/30 animate-spin">
                  🌀
                </div>
                <span className="text-[10px] font-mono font-bold text-purple-300 mt-1 bg-slate-900/90 px-2 py-0.5 rounded-full border border-purple-500/40">
                  {visitedHotspots.has('portal') ? 'Portal Deschis ✅' : 'Click CoBlocks 👆'}
                </span>
              </div>
            ) : null}
          </div>

          {/* Active Dialog Alert Overlay */}
          {activeDialog && (
            <div className="z-20 bg-slate-900/95 border border-cyan-500/60 p-3 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-xs text-white">
              <span className="leading-snug">{activeDialog}</span>
              <button
                onClick={() => setActiveDialog(null)}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-mono text-cyan-300"
              >
                Închide
              </button>
            </div>
          )}
        </div>

        {/* 360 Rotation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase">
              {isEn ? 'Rotate View:' : 'Rotește Privirea 360°:'}
            </span>
            <button
              onClick={() => handleRotate(-45)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-mono text-xs font-bold transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>-45° Stânga</span>
            </button>
            <button
              onClick={() => handleRotate(45)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-mono text-xs font-bold transition-colors"
            >
              <span>+45° Dreapta</span>
              <RotateCw className="w-4 h-4 text-cyan-400" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase">
              {isEn ? 'Camera Mode:' : 'Perspectivă Cameră:'}
            </span>
            {(['walk', 'fly', 'fixed'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setCameraMode(mode);
                  sounds.playPop();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-colors ${
                  cameraMode === mode
                    ? 'bg-blue-600 border-blue-400 text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {mode === 'walk' ? '🚶 Mers' : mode === 'fly' ? '🦅 Zbor' : '🔒 Fix'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Evaluation Quiz */}
      <div className="bg-slate-900/90 border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xl">
            ✍️
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              {isEn ? 'Evaluation Questions' : 'Verificare CoSpaces Edu & Scripting (2 Întrebări)'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {isEn
                ? 'Test your understanding of 3D spaces and visual block programming.'
                : 'Testează-ți cunoștințele despre spațiile 3D și programarea cu blocuri CoBlocks.'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Question 1 */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-mono">1</span>
                {isEn
                  ? 'What visual programming tool inside CoSpaces allows students to animate objects and create VR events without writing text code?'
                  : 'Ce instrument de programare vizuală din CoSpaces Edu permite elevilor să însuflețească obiectele și să creeze interactivitate fără cod textual complicat?'}
              </h3>
              <QuestionHint
                hintRo="Se numește CoBlocks și folosește blocuri colorate asemănătoare cu cele din Scratch."
                hintEn="It is called CoBlocks and uses colored blocks similar to Scratch."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'assembler', label: 'Limbajul de asamblare binar' },
                { id: 'coblocks', label: 'CoBlocks (blocuri vizuale tip Scratch integrate în CoSpaces)' },
                { id: 'paint', label: 'Guma de șters din Paint' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  disabled={isLocked('q1') || q1 === 'coblocks'}
                  onClick={() => handleQ1(opt.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all disabled:cursor-not-allowed ${
                    q1 === opt.id
                      ? opt.id === 'coblocks'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                        : 'bg-rose-500/20 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.label}</span>
                    {q1 === opt.id && (opt.id === 'coblocks' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />)}
                  </div>
                </button>
              ))}
            </div>

            {cooldowns.q1 && cooldowns.q1 > 0 ? (
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q1}
                totalSeconds={5}
                customMessageRo="Timp de reflecție: CoBlocks este limbajul vizual cu blocuri pentru medii 3D în CoSpaces!"
                customMessageEn="Reflection buffer: CoBlocks is the block-based visual language for 3D worlds in CoSpaces!"
              />
            ) : null}

            {q1 && (
              <AnswerExplanation
                isCorrect={q1 === 'coblocks'}
                explanationRo="Corect! CoBlocks oferă o punte directă între programarea vizuală Scratch și spațiile tridimensionale imersive din CoSpaces Edu."
                explanationEn="Correct! CoBlocks provides a direct bridge between Scratch visual blocks and immersive 3D VR environments."
              />
            )}
          </div>

          {/* Question 2 */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-mono">2</span>
                {isEn
                  ? 'Which standard keyboard keys are commonly used to navigate in a First-Person 3D virtual environment on a PC?'
                  : 'Ce taste standard sunt utilizate frecvent pentru deplasarea într-un mediu virtual 3D în modul First-Person pe calculator?'}
              </h3>
              <QuestionHint
                hintRo="Tastele universale pentru mișcare în jocuri și simulatoare 3D: W (înainte), A (stânga), S (înapoi), D (dreapta)."
                hintEn="Universal navigation keys: W (forward), A (left), S (backwards), D (right)."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'wasd', label: 'Tastele W, A, S, D (sau săgețile de direcție)' },
                { id: 'f1f2', label: 'Tastele funcționale F1, F2, F3' },
                { id: 'caps', label: 'Tasta Caps Lock apăsată repetat' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  disabled={isLocked('q2') || q2 === 'wasd'}
                  onClick={() => handleQ2(opt.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all disabled:cursor-not-allowed ${
                    q2 === opt.id
                      ? opt.id === 'wasd'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                        : 'bg-rose-500/20 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.label}</span>
                    {q2 === opt.id && (opt.id === 'wasd' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />)}
                  </div>
                </button>
              ))}
            </div>

            {cooldowns.q2 && cooldowns.q2 > 0 ? (
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q2}
                totalSeconds={5}
                customMessageRo="Timp de reflecție: Tastele WASD și săgețile reprezintă standardul internațional de navigație 3D!"
                customMessageEn="Reflection buffer: WASD keys and arrows are the international standard for 3D navigation!"
              />
            ) : null}

            {q2 && (
              <AnswerExplanation
                isCorrect={q2 === 'wasd'}
                explanationRo="Exact! Schema WASD este convenția mondială pentru deplasarea în spații 3D (W = înainte, A = stânga, S = înapoi, D = dreapta), combinată cu mouse-ul pentru privire 360°."
                explanationEn="Exactly! WASD is the global standard for 3D navigation (W = forward, A = left, S = backwards, D = right), paired with the mouse for 360° look."
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
                {isEn ? 'Virtual world builder mastered! You earned 15 XP.' : 'Lumea 360° a fost explorată cu succes! Ai obținut 15 XP.'}
              </span>
            ) : (
              <span>{isEn ? 'Find all 3 CoBlocks hotspots and answer both questions.' : 'Descoperă toate cele 3 puncte fierbinți CoBlocks și răspunde la întrebări.'}</span>
            )}
          </div>

          <button
            onClick={handleContinue}
            disabled={!allCompleted}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-sm font-heading flex items-center justify-center gap-2 transition-all ${
              allCompleted
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/30 cursor-pointer scale-105'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <span>{isEn ? 'Advance to Level 7: Final Exam & Director Diploma' : 'Treci la Nivelul 7: Marea Evaluare & Diploma de Regizor'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
