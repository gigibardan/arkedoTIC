import React, { useState } from 'react';
import { 
  RotateCcw, 
  RotateCw, 
  Move, 
  Sliders, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Compass, 
  Box, 
  Eye, 
  Layers,
  ArrowUpDown,
  ArrowLeftRight
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface Paint3DLevel3Props {
  onCompletePage: (earnedScore: number) => void;
}

export const Paint3DLevel3_FourAxesManipulation: React.FC<Paint3DLevel3Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // 4 Axes Manipulation Simulator State
  const [rotX, setRotX] = useState<number>(0); // Bottom anchor (Pitch / X-axis)
  const [rotY, setRotY] = useState<number>(0); // Right anchor (Yaw / Y-axis)
  const [rotZ, setRotZ] = useState<number>(0); // Top anchor (Roll / Z-rotation)
  const [posZ, setPosZ] = useState<number>(0); // Left anchor (Z-Depth translation relative to canvas)

  const [testedAnchors, setTestedAnchors] = useState<Record<string, boolean>>({});

  // Quiz states
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const handleAdjustRotX = (delta: number) => {
    sounds.playRetro('coin');
    setRotX(prev => prev + delta);
    setTestedAnchors(prev => ({ ...prev, rotX: true }));
  };

  const handleAdjustRotY = (delta: number) => {
    sounds.playRetro('coin');
    setRotY(prev => prev + delta);
    setTestedAnchors(prev => ({ ...prev, rotY: true }));
  };

  const handleAdjustRotZ = (delta: number) => {
    sounds.playRetro('coin');
    setRotZ(prev => prev + delta);
    setTestedAnchors(prev => ({ ...prev, rotZ: true }));
  };

  const handleAdjustPosZ = (delta: number) => {
    sounds.playRetro('powerup');
    setPosZ(prev => Math.max(-100, Math.min(100, prev + delta)));
    setTestedAnchors(prev => ({ ...prev, posZ: true }));
  };

  const handleResetPose = () => {
    sounds.playClick();
    setRotX(0);
    setRotY(0);
    setRotZ(0);
    setPosZ(0);
  };

  const handleAnswerQ1 = (val: string) => {
    if (q1Answer) return;
    setQ1Answer(val);
    if (val === 'z_translation') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
  };

  const handleAnswerQ2 = (val: string) => {
    if (q2Answer) return;
    setQ2Answer(val);
    if (val === 'right_anchor_y') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
  };

  const isQ1Correct = q1Answer === 'z_translation';
  const isQ2Correct = q2Answer === 'right_anchor_y';
  const hasTestedAllAnchors = Object.keys(testedAnchors).length >= 4;
  const isComplete = hasTestedAllAnchors && isQ1Correct && isQ2Correct;

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
              🔄
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-[11px] font-mono font-bold text-cyan-300 uppercase">
                  {lang === 'en' ? 'Unit 2 • Lesson 1 (p. 30–31)' : 'Unitatea 2 • Lecția 1 (pag. 30–31)'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {lang === 'en' ? 'Screen 3/7' : 'Ecranul 3/7'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {lang === 'en' 
                  ? 'The 4 Control Anchors: Rotation & Z-Depth Translation' 
                  : 'Cele 4 Ancore de Control: Rotire pe Axele X, Y, Z & Translație'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-mono text-cyan-300">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'en' ? '3 Rotation Axes + 1 Depth Translation' : '3 Axe de Rotație + 1 Translație Z'}</span>
          </div>
        </div>
      </div>

      {/* The 4 Anchors Theory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Anchor 1: Top (Z-Roll) */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-2">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs font-mono uppercase">
            <span className="text-lg">⬆️</span>
            <span>1. Ancora de Sus (Axa Z)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Rotește obiectul în planul ecranului (stânga/dreapta, ca un ac de ceasornic). Nume tehnic: <strong>Roll</strong>.
          </p>
          <div className="p-1.5 bg-cyan-950/40 rounded border border-cyan-500/20 text-[10px] font-mono text-cyan-300">
            Rotire în planul privitorului
          </div>
        </div>

        {/* Anchor 2: Right (Y-Yaw) */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs font-mono uppercase">
            <span className="text-lg">➡️</span>
            <span>2. Ancora din Dreapta (Axa Y)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Rotește obiectul orizontal în jurul axei verticale. Îi vezi profilul, ceafa sau spatele! Nume: <strong>Yaw</strong>.
          </p>
          <div className="p-1.5 bg-emerald-950/40 rounded border border-emerald-500/20 text-[10px] font-mono text-emerald-300">
            Rotire orizontală stânga-dreapta
          </div>
        </div>

        {/* Anchor 3: Bottom (X-Pitch) */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs font-mono uppercase">
            <span className="text-lg">⬇️</span>
            <span>3. Ancora de Jos (Axa X)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Rotește obiectul vertical pe axa orizontală (înainte-înapoi, ca un salt mortal). Îi vezi creștetul sau talpa! Nume: <strong>Pitch</strong>.
          </p>
          <div className="p-1.5 bg-amber-950/40 rounded border border-amber-500/20 text-[10px] font-mono text-amber-300">
            Înclinare verticală înainte-înapoi
          </div>
        </div>

        {/* Anchor 4: Left (Z-Translation) */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-2">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-xs font-mono uppercase">
            <span className="text-lg">⬅️</span>
            <span>4. Ancora din Stânga (Poziție Z)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Deplasează corpul 3D <strong>înainte și înapoi</strong> față de pânză (în adâncime). Permite trecerea în spatele altor obiecte!
          </p>
          <div className="p-1.5 bg-rose-950/40 rounded border border-rose-500/20 text-[10px] font-mono text-rose-300">
            Translație în adâncime (Z-depth)
          </div>
        </div>
      </div>

      {/* Interactive 4-Anchor 3D Manipulation Stage */}
      <div className="bg-slate-900/95 border-2 border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>{lang === 'en' ? 'Interactive 4-Anchor Control Gizmo' : 'Simulatorul Interactiv al celor 4 Ancore Paint 3D'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Test each anchor around the 3D model box to understand how it transforms in 3D space!'
                : 'Apasă pe butoanele ancorelor din jurul casetei de selecție pentru a roti și transla modelul 3D!'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetPose}
            className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Resetează Poziția</span>
          </button>
        </div>

        {/* 3D Gizmo Arena Layout */}
        <div className="relative p-8 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center min-h-[360px] overflow-hidden">
          {/* Virtual Canvas plane in the background */}
          <div className="absolute inset-16 border-2 border-dashed border-slate-700/60 rounded-xl pointer-events-none flex items-center justify-center">
            <span className="text-[11px] font-mono text-slate-700 select-none uppercase tracking-widest">
              Planul Pânzei Paint 3D (Z = 0)
            </span>
          </div>

          {/* Anchor: TOP (Z-Roll) */}
          <div className="absolute top-4 flex items-center gap-2 z-20">
            <span className="text-[10px] font-mono text-cyan-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              Ancora Sus (Roll Z: {rotZ}°)
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleAdjustRotZ(-15)}
                className="w-8 h-8 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center text-xs shadow-lg cursor-pointer"
                title="Rotește Z stânga"
              >
                ⟲
              </button>
              <button
                type="button"
                onClick={() => handleAdjustRotZ(15)}
                className="w-8 h-8 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center text-xs shadow-lg cursor-pointer"
                title="Rotește Z dreapta"
              >
                ⟳
              </button>
            </div>
          </div>

          {/* Anchor: RIGHT (Y-Yaw) */}
          <div className="absolute right-4 flex flex-col items-center gap-2 z-20">
            <span className="text-[10px] font-mono text-emerald-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              Ancora Dreapta (Yaw Y: {rotY}°)
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleAdjustRotY(-20)}
                className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center text-xs shadow-lg cursor-pointer"
                title="Rotește Y stânga"
              >
                ◀
              </button>
              <button
                type="button"
                onClick={() => handleAdjustRotY(20)}
                className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center text-xs shadow-lg cursor-pointer"
                title="Rotește Y dreapta"
              >
                ▶
              </button>
            </div>
          </div>

          {/* Anchor: BOTTOM (X-Pitch) */}
          <div className="absolute bottom-4 flex items-center gap-2 z-20">
            <span className="text-[10px] font-mono text-amber-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              Ancora Jos (Pitch X: {rotX}°)
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleAdjustRotX(-15)}
                className="w-8 h-8 rounded-full bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center text-xs shadow-lg cursor-pointer"
                title="Înclină X sus"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => handleAdjustRotX(15)}
                className="w-8 h-8 rounded-full bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center text-xs shadow-lg cursor-pointer"
                title="Înclină X jos"
              >
                ▼
              </button>
            </div>
          </div>

          {/* Anchor: LEFT (Z-Translation) */}
          <div className="absolute left-4 flex flex-col items-center gap-2 z-20">
            <span className="text-[10px] font-mono text-rose-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              Ancora Stânga (Poziție Z: {posZ > 0 ? `+${posZ}` : posZ}px)
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleAdjustPosZ(-20)}
                className="w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center text-xs shadow-lg cursor-pointer"
                title="Împinge în spate (în adâncime)"
              >
                ➖
              </button>
              <button
                type="button"
                onClick={() => handleAdjustPosZ(20)}
                className="w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center text-xs shadow-lg cursor-pointer"
                title="Adu în față (spre privitor)"
              >
                ➕
              </button>
            </div>
          </div>

          {/* 3D Visual Object in Perspective View */}
          <div style={{ perspective: '800px' }} className="py-12 relative z-10">
            <div
              style={{
                width: '130px',
                height: '130px',
                transformStyle: 'preserve-3d',
                transform: `translateZ(${posZ}px) rotateZ(${rotZ}deg) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
                transition: 'transform 0.15s ease-out',
              }}
              className="relative select-none"
            >
              {/* Front */}
              <div
                style={{ transform: 'translateZ(65px)' }}
                className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-indigo-600 border-2 border-cyan-300 rounded-2xl flex flex-col items-center justify-center text-white shadow-2xl"
              >
                <span className="text-3xl">🤖</span>
                <span className="text-xs font-mono font-bold mt-1">Robot 3D</span>
              </div>

              {/* Back */}
              <div
                style={{ transform: 'rotateY(180deg) translateZ(65px)' }}
                className="absolute inset-0 bg-gradient-to-br from-indigo-700 to-slate-950 border-2 border-indigo-400 rounded-2xl flex flex-col items-center justify-center text-slate-300"
              >
                <span className="text-2xl">🔋</span>
                <span className="text-[10px] font-mono">Baterie Spate</span>
              </div>

              {/* Right */}
              <div
                style={{ transform: 'rotateY(90deg) translateZ(65px)' }}
                className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-700 border-2 border-teal-300 rounded-2xl flex flex-col items-center justify-center text-white text-[11px] font-mono font-bold"
              >
                <span>Braț Drept</span>
              </div>

              {/* Left */}
              <div
                style={{ transform: 'rotateY(-90deg) translateZ(65px)' }}
                className="absolute inset-0 bg-gradient-to-br from-cyan-700 to-indigo-800 border-2 border-cyan-400 rounded-2xl flex flex-col items-center justify-center text-white text-[11px] font-mono font-bold"
              >
                <span>Braț Stâng</span>
              </div>

              {/* Top */}
              <div
                style={{ transform: 'rotateX(90deg) translateZ(65px)' }}
                className="absolute inset-0 bg-gradient-to-br from-cyan-300 to-emerald-400 border-2 border-white rounded-2xl flex flex-col items-center justify-center text-slate-950 text-[11px] font-mono font-bold"
              >
                <span>Creștet Antenă</span>
              </div>

              {/* Bottom */}
              <div
                style={{ transform: 'rotateX(-90deg) translateZ(65px)' }}
                className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-slate-700 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-[10px] font-mono"
              >
                <span>Bază Suport</span>
              </div>
            </div>
          </div>

          {/* Real-time Depth Feedback Indicator */}
          <div className="text-xs font-mono text-slate-400 flex items-center gap-2 mt-4 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
            <span>Poziție față de pânză:</span>
            <strong className={posZ > 0 ? 'text-emerald-400' : posZ < 0 ? 'text-amber-400' : 'text-slate-300'}>
              {posZ > 0 ? 'În fața pânzei (mai aproape de privitor)' : posZ < 0 ? 'În spatele pânzei (în profunzime)' : 'Exact pe planul pânzei'}
            </strong>
          </div>
        </div>

        {/* Milestone Tracker */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2">
            {hasTestedAllAnchors ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Toate cele 4 ancore au fost testate! (4/4)
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <Sliders className="w-4 h-4" /> Testează toate cele 4 ancore ({Object.keys(testedAnchors).length}/4)
              </span>
            )}
          </div>
          <span className="text-slate-400 text-[11px]">Manual pag. 30–31</span>
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
            <QuestionHint hint={lang === 'en' ? 'The left anchor moves objects back and forth in depth relative to the canvas.' : 'Ancora din stânga împinge obiectul în adâncime (mai aproape sau mai departe de pânză).'} />
          </div>

          <h3 className="text-sm font-bold text-white">
            {lang === 'en'
              ? 'What is the special role of the Left Control Anchor on a selected 3D object in Paint 3D?'
              : 'Ce rol unic are Ancora de Control din Stânga la un obiect 3D selectat în Paint 3D?'}
          </h3>

          <div className="space-y-2">
            {[
              { id: 'z_translation', label: 'Translație pe axa Z: deplasează corpul înainte și înapoi în adâncime față de pânză' },
              { id: 'color_change', label: 'Schimbă automat culoarea obiectului în roșu' },
              { id: 'delete_box', label: 'Șterge obiectul din proiect' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={!!q1Answer}
                onClick={() => handleAnswerQ1(opt.id)}
                className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'z_translation'
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
                      ? 'Correct! The left anchor moves the model closer to or further behind the canvas.'
                      : 'Corect! Ancora din stânga este singura care face translație în adâncime (axa Z), permițând așezarea corpurilor unele în spatele altora.')
                  : (lang === 'en'
                      ? 'Incorrect. The left anchor handles Z-depth position.'
                      : 'Incorect. Ancora din stânga mută obiectul mai aproape sau mai departe față de pânză pe axa Z.')
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
            <QuestionHint hint={lang === 'en' ? 'The right anchor rotates horizontally (around the Y axis) to show the back of a character.' : 'Ancora din dreapta rotește orizontal (axa Y) pentru a vedea spatele personajului.'} />
          </div>

          <h3 className="text-sm font-bold text-white">
            {lang === 'en'
              ? 'Which anchor rotates a character to see their back or profile around the vertical Y-axis?'
              : 'Ce ancoră folosești pentru a roti un personaj orizontal, astfel încât să-i vezi profilul sau spatele (în jurul axei Y)?'}
          </h3>

          <div className="space-y-2">
            {[
              { id: 'right_anchor_y', label: 'Ancora din Dreapta (Rotire pe axa verticală Y / Yaw)' },
              { id: 'top_anchor_z', label: 'Ancora de Sus (Rotire în plan Z / Roll)' },
              { id: 'bottom_anchor_x', label: 'Ancora de Jos (Înclinare înainte-înapoi X / Pitch)' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={!!q2Answer}
                onClick={() => handleAnswerQ2(opt.id)}
                className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'right_anchor_y'
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
                      ? 'Spot on! The right anchor rotates the model around the vertical axis.'
                      : 'Excelent! Ancora din dreapta rotește corpul ca pe o platformă turnantă orizontală, permițând vizualizarea spatelui.')
                  : (lang === 'en'
                      ? 'Not quite. The right anchor governs Y-axis horizontal rotation.'
                      : 'Incorect. Ancora din dreapta rotește obiectul în jurul axei verticale Y.')
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
