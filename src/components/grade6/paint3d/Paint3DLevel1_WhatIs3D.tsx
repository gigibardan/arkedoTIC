import React, { useState } from 'react';
import { 
  Box, 
  Sparkles, 
  Layers, 
  RotateCw, 
  Sliders, 
  Monitor, 
  Eye, 
  Info, 
  CheckCircle2, 
  Compass,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface Paint3DLevel1Props {
  onCompletePage: (earnedScore: number) => void;
}

export const Paint3DLevel1_WhatIs3D: React.FC<Paint3DLevel1Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive 2D vs 3D Dimension Inspector State
  const [viewDimension, setViewDimension] = useState<'2D' | '3D'>('2D');
  const [rotX, setRotX] = useState<number>(20);
  const [rotY, setRotY] = useState<number>(35);
  const [depthZ, setDepthZ] = useState<number>(60);
  const [tested3DMode, setTested3DMode] = useState<boolean>(false);
  const [inspectedSoftware, setInspectedSoftware] = useState<string | null>(null);

  // Quiz states
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const handleToggleDimension = (dim: '2D' | '3D') => {
    sounds.playRetro('coin');
    setViewDimension(dim);
    if (dim === '3D') setTested3DMode(true);
  };

  const handleInspectSoftware = (name: string) => {
    sounds.playClick();
    setInspectedSoftware(name);
  };

  const handleAnswerQ1 = (val: string) => {
    if (q1Answer) return;
    setQ1Answer(val);
    if (val === 'depth_z') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
  };

  const handleAnswerQ2 = (val: string) => {
    if (q2Answer) return;
    setQ2Answer(val);
    if (val === 'paint3d_tinkercad') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
  };

  const isQ1Correct = q1Answer === 'depth_z';
  const isQ2Correct = q2Answer === 'paint3d_tinkercad';
  const isComplete = tested3DMode && !!inspectedSoftware && isQ1Correct && isQ2Correct;

  const handleFinish = () => {
    if (isComplete) {
      sounds.playVictory();
      onCompletePage(100);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-2 border-cyan-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-3xl shadow-inner shrink-0">
              🧊
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-[11px] font-mono font-bold text-cyan-300 uppercase">
                  {lang === 'en' ? 'Unit 2 • Lesson 1 (p. 26–27)' : 'Unitatea 2 • Lecția 1 (pag. 26–27)'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {lang === 'en' ? 'Screen 1/7' : 'Ecranul 1/7'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {lang === 'en' 
                  ? 'What is 3D Graphics? Dimensions & Modeling Software' 
                  : 'Ce este Grafica 3D? Dimensiuni & Aplicații de Modelare'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-mono text-cyan-300">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'en' ? 'Axes: X (Width), Y (Height), Z (Depth)' : 'Axele: X (Lățime), Y (Înălțime), Z (Adâncime)'}</span>
          </div>
        </div>
      </div>

      {/* Theory Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 2D Flat Plane */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-2.5">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <span className="text-xl">📄</span>
            <span>{lang === 'en' ? '2D: Flat 2-Axis Space' : '2D: Spațiul Bidimensional'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'Has only Width (X axis) and Height (Y axis). Examples: a sheet of paper, classic Paint drawings, photos. Objects have no volume or depth.'
              : 'Are doar Lățime (axa X) și Înălțime (axa Y). Exemple: o coală de hârtie, desenele clasice din Paint, fotografiile. Corpurile nu au adâncime sau volum real.'}
          </p>
          <div className="p-2 bg-amber-950/40 rounded-lg border border-amber-500/20 text-[11px] font-mono text-amber-300">
            Coordonate: (X, Y) • Suprafață plană
          </div>
        </div>

        {/* 3D Volumetric Space */}
        <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-4 shadow-lg space-y-2.5">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <span className="text-xl">🎲</span>
            <span>{lang === 'en' ? '3D: Volumetric 3-Axis Space' : '3D: Spațiul Tridimensional'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'Adds Depth (Z axis)! Objects have volume, cast realistic shadows, and can be viewed and rotated from any perspective (front, back, top, sides).'
              : 'Adaugă Axa Z (Adâncimea)! Corpurile au volum, umbre realiste și pot fi privite și rotite din orice unghi (față, spate, sus, lateral).'}
          </p>
          <div className="p-2 bg-cyan-950/40 rounded-lg border border-cyan-500/20 text-[11px] font-mono text-cyan-300">
            Coordonate: (X, Y, Z) • Volum & Perspectivă
          </div>
        </div>

        {/* Real-life 3D Software */}
        <div className="bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-4 shadow-lg space-y-2.5">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <span className="text-xl">💻</span>
            <span>{lang === 'en' ? '3D Environments & Software' : 'Medii & Aplicații 3D'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'Paint 3D (creative Windows app with 3D library), Tinkercad (browser CAD modeling for 3D printers), Blender (movie & games studio), Unity.'
              : 'Paint 3D (aplicație gratuită Windows cu bibliotecă 3D), Tinkercad (modelare în browser pentru imprimante 3D), Blender (studio pentru filme și jocuri).'}
          </p>
          <div className="p-2 bg-indigo-950/40 rounded-lg border border-indigo-500/20 text-[11px] font-mono text-indigo-300">
            Manual pag. 26-27 • Aplicații didactice
          </div>
        </div>
      </div>

      {/* Interactive 2D vs 3D Dimension Sandbox */}
      <div className="bg-slate-900/95 border-2 border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>{lang === 'en' ? 'Interactive 2D vs 3D Dimension Visualizer' : 'Laboratorul Vizual: De la Planul 2D la Spațiul 3D'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en' 
                ? 'Switch to 3D mode, rotate the cube on the X and Y axes, and adjust the Z-depth!' 
                : 'Comută pe modul 3D, rotește cubul pe axele X și Y și reglează adâncimea pe axa Z!'}
            </p>
          </div>

          {/* 2D / 3D Mode Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleToggleDimension('2D')}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                viewDimension === '2D'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2D (Plan: X, Y)
            </button>
            <button
              type="button"
              onClick={() => handleToggleDimension('3D')}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                viewDimension === '3D'
                  ? 'bg-cyan-400 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3D (Spațiu: X, Y, Z)
            </button>
          </div>
        </div>

        {/* Live 3D Interactive Stage Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                {lang === 'en' ? 'Spatial Controls' : 'Controale Spațiale'}
              </span>
              <span className="text-cyan-400 font-bold">{viewDimension} Mod Activ</span>
            </div>

            {viewDimension === '3D' ? (
              <div className="space-y-3">
                {/* Rot X Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Axa X (Înclinare verticală / Pitch)</span>
                    <span className="text-cyan-300">{rotX}°</span>
                  </div>
                  <input
                    type="range"
                    min="-60"
                    max="60"
                    value={rotX}
                    onChange={(e) => setRotX(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                {/* Rot Y Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Axa Y (Rotire orizontală / Yaw)</span>
                    <span className="text-cyan-300">{rotY}°</span>
                  </div>
                  <input
                    type="range"
                    min="-90"
                    max="90"
                    value={rotY}
                    onChange={(e) => setRotY(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                {/* Depth Z Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Axa Z (Adâncime corp / Volume Depth)</span>
                    <span className="text-cyan-300">{depthZ}px</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="120"
                    value={depthZ}
                    onChange={(e) => setDepthZ(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-200">
                În modul 2D, figura are adâncime 0. Corpul nu poate fi rotit în spațiu. Apasă pe <strong>„3D (Spațiu: X, Y, Z)”</strong> pentru a debloca volumul!
              </div>
            )}

            {/* Quick reset button */}
            {viewDimension === '3D' && (
              <button
                type="button"
                onClick={() => {
                  setRotX(20);
                  setRotY(35);
                  setDepthZ(60);
                  sounds.playClick();
                }}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-xs font-mono text-slate-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Resetează Unghiurile Izometrice</span>
              </button>
            )}
          </div>

          {/* Canvas Rendering Box */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 bg-slate-950 rounded-2xl border border-slate-800 min-h-[300px] relative overflow-hidden">
            {/* Background 3D Grid Guide */}
            <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#0891b2_1px,transparent_1px),linear-gradient(to_bottom,#0891b2_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            {/* Coordinate Axis Indicator */}
            <div className="absolute top-3 left-3 flex flex-col gap-1 text-[10px] font-mono p-2 rounded-lg bg-slate-900/90 border border-slate-800">
              <span className="text-rose-400 font-bold">➔ Axa X: Lățime (Orizontal)</span>
              <span className="text-emerald-400 font-bold">➔ Axa Y: Înălțime (Vertical)</span>
              <span className="text-cyan-400 font-bold">➔ Axa Z: Adâncime ({viewDimension === '3D' ? 'Activă' : 'Inactivă / 0'})</span>
            </div>

            {/* Rendered Object */}
            <div style={{ perspective: '800px' }} className="py-6">
              {viewDimension === '2D' ? (
                // 2D Flat Square
                <div className="w-36 h-36 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 border-2 border-amber-300 flex flex-col items-center justify-center text-slate-950 font-black shadow-lg">
                  <span className="text-2xl mb-1">⬛</span>
                  <span className="text-xs font-mono uppercase">Pătrat 2D</span>
                  <span className="text-[10px] font-mono text-slate-900">Doar X și Y</span>
                </div>
              ) : (
                // 3D Isometric / CSS 3D Cube with Transform
                <div
                  style={{
                    width: '120px',
                    height: '120px',
                    transformStyle: 'preserve-3d',
                    transform: `rotateX(${-rotX}deg) rotateY(${rotY}deg)`,
                    transition: 'transform 0.1s ease-out',
                  }}
                  className="relative select-none"
                >
                  {/* Front Face */}
                  <div
                    style={{ transform: `translateZ(${depthZ / 2}px)` }}
                    className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 border-2 border-cyan-300/80 rounded-lg flex flex-col items-center justify-center text-white font-mono font-bold shadow-xl opacity-90"
                  >
                    <span className="text-xl">🎲</span>
                    <span className="text-[11px]">FAȚĂ</span>
                  </div>

                  {/* Back Face */}
                  <div
                    style={{ transform: `rotateY(180deg) translateZ(${depthZ / 2}px)` }}
                    className="absolute inset-0 bg-gradient-to-br from-blue-700 to-indigo-900 border-2 border-indigo-400/60 rounded-lg flex flex-col items-center justify-center text-slate-200 font-mono font-bold opacity-80"
                  >
                    <span className="text-[11px]">SPATE</span>
                  </div>

                  {/* Right Face */}
                  <div
                    style={{ transform: `rotateY(90deg) translateZ(${60}px)`, width: `${depthZ}px`, left: `${60 - depthZ / 2}px` }}
                    className="absolute top-0 bottom-0 bg-gradient-to-br from-teal-500 to-cyan-700 border-2 border-teal-300/70 rounded-lg flex items-center justify-center text-white font-mono text-[10px] font-bold opacity-85"
                  >
                    DREAPTA
                  </div>

                  {/* Left Face */}
                  <div
                    style={{ transform: `rotateY(-90deg) translateZ(${60}px)`, width: `${depthZ}px`, left: `${60 - depthZ / 2}px` }}
                    className="absolute top-0 bottom-0 bg-gradient-to-br from-cyan-700 to-indigo-800 border-2 border-cyan-400/60 rounded-lg flex items-center justify-center text-slate-200 font-mono text-[10px] font-bold opacity-80"
                  >
                    STÂNGA
                  </div>

                  {/* Top Face */}
                  <div
                    style={{ transform: `rotateX(90deg) translateZ(${60}px)`, height: `${depthZ}px`, top: `${60 - depthZ / 2}px` }}
                    className="absolute left-0 right-0 bg-gradient-to-br from-cyan-300 to-teal-400 border-2 border-white/80 rounded-lg flex items-center justify-center text-slate-950 font-mono text-[10px] font-black opacity-95"
                  >
                    SUS (TOP)
                  </div>

                  {/* Bottom Face */}
                  <div
                    style={{ transform: `rotateX(-90deg) translateZ(${60}px)`, height: `${depthZ}px`, top: `${60 - depthZ / 2}px` }}
                    className="absolute left-0 right-0 bg-gradient-to-br from-slate-900 to-indigo-950 border-2 border-slate-700 rounded-lg flex items-center justify-center text-slate-400 font-mono text-[10px] opacity-75"
                  >
                    JOS
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3D Software Showcase Grid */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'en' ? 'Explore 3D Modeling Software (Click each to inspect):' : 'Aplicații de Modelare 3D din Manual (Apasă pe fiecare pentru detalii):'}</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'paint3d',
                name: 'Paint 3D (Microsoft)',
                badge: 'Aplicația de Bază • Gimnaziu',
                desc: 'Aplicație gratuită pe Windows. Permite desenarea doodle-urilor 3D, inserarea corpurilor geometrice, aplicarea stickerelor și exportul în formate .glb pentru Minecraft.',
                color: 'border-cyan-500/50 hover:border-cyan-400'
              },
              {
                id: 'tinkercad',
                name: 'Tinkercad (Autodesk)',
                badge: 'Browser Web • Imprimare 3D',
                desc: 'Mediu online de modelare prin îmbinarea formelor geometrice solide și a găurilor. Folosit frecvent în școli pentru crearea de obiecte fizice imprimate 3D.',
                color: 'border-amber-500/50 hover:border-amber-400'
              },
              {
                id: 'blender',
                name: 'Blender 3D & Unity',
                badge: 'Profesional • Filme & Jocuri',
                desc: 'Programe de nivel avansat pentru realizarea jocurilor video 3D, efectelor speciale cinematografice și simulărilor fizice complexe cu iluminare ray-tracing.',
                color: 'border-indigo-500/50 hover:border-indigo-400'
              }
            ].map(sw => (
              <button
                key={sw.id}
                type="button"
                onClick={() => handleInspectSoftware(sw.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  inspectedSoftware === sw.id
                    ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-400/30 shadow-lg'
                    : `bg-slate-950/70 ${sw.color}`
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-white">{sw.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-cyan-300 border border-slate-700">
                    {sw.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">{sw.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Milestone Tracker */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2">
            {tested3DMode ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Modul 3D explorat
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <Box className="w-4 h-4" /> Comută pe 3D și rotește cubul
              </span>
            )}
            <span>•</span>
            {inspectedSoftware ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Aplicație inspectată
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <Monitor className="w-4 h-4" /> Apasă pe o aplicație 3D din listă
              </span>
            )}
          </div>
          <span className="text-slate-400 text-[11px]">Manual pag. 26–27</span>
        </div>
      </div>

      {/* Quizzes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quiz 1 */}
        <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
              {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
            </span>
            <QuestionHint hint={lang === 'en' ? 'The Z-axis represents Depth, transforming a 2D surface into 3D volume.' : 'Axa Z aduce Adâncimea, transformând o coală plată într-un corp cu volum.'} />
          </div>

          <h3 className="text-sm font-bold text-white">
            {lang === 'en'
              ? 'What third axis is added in 3D computer graphics to create volume and depth?'
              : 'Ce a treia axă este adăugată în grafica 3D pentru a transforma o figură plană într-un corp cu volum?'}
          </h3>

          <div className="space-y-2">
            {[
              { id: 'depth_z', label: lang === 'en' ? 'Z axis (Depth / Adâncime)' : 'Axa Z (Adâncimea / Depărtarea față de privitor)' },
              { id: 'time_t', label: lang === 'en' ? 'T axis (Timp)' : 'Axa T (Timpul de desenare)' },
              { id: 'color_c', label: lang === 'en' ? 'C axis (Culoare)' : 'Axa C (Intensitatea culorii)' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={!!q1Answer}
                onClick={() => handleAnswerQ1(opt.id)}
                className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'depth_z'
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
                      ? 'Correct! X is width, Y is height, and Z is depth/volume.'
                      : 'Corect! X reprezintă lățimea, Y înălțimea, iar axa Z adâncimea care dă volum corpului 3D.')
                  : (lang === 'en'
                      ? 'Incorrect. Remember the 3 spatial coordinates: X, Y, and Z!'
                      : 'Incorect. Cele trei coordonate spațiale sunt X (lățime), Y (înălțime) și Z (adâncime).')
              }
            />
          )}
        </div>

        {/* Quiz 2 */}
        <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
              {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
            </span>
            <QuestionHint hint={lang === 'en' ? 'Paint 3D and Tinkercad are the main educational 3D tools presented in the curriculum.' : 'Paint 3D și Tinkercad sunt aplicațiile recomandate oficial de programa școlară.'} />
          </div>

          <h3 className="text-sm font-bold text-white">
            {lang === 'en'
              ? 'Which of the following applications is included in Windows 10/11 for beginner 3D modeling?'
              : 'Care dintre următoarele este aplicația gratuită integrată în Windows pentru modelare 3D destinată elevilor?'}
          </h3>

          <div className="space-y-2">
            {[
              { id: 'paint3d_tinkercad', label: 'Paint 3D (Microsoft)' },
              { id: 'notepad', label: 'Notepad (Bloc-notes)' },
              { id: 'calculator', label: 'Calculator Windows' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={!!q2Answer}
                onClick={() => handleAnswerQ2(opt.id)}
                className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'paint3d_tinkercad'
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
                      ? 'Spot on! Paint 3D provides a friendly canvas to create, color, and export 3D models.'
                      : 'Excelent! Paint 3D oferă o pânză intuitivă pentru modelare, aplicare de stickere și vizualizare în realitate mixtă.')
                  : (lang === 'en'
                      ? 'Not quite. Paint 3D is the dedicated modeling tool.'
                      : 'Incorect. Paint 3D este aplicația dedicată pentru desen și modelare tridimensională.')
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
