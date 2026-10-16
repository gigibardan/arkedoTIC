import React, { useState } from 'react';
import {
  Maximize2,
  Ghost,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Sliders,
  Move,
  Eye,
  Shield
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { useQuestionCooldowns, PedagogicalReflectionBanner } from '../../../utils/pedagogicalGrading';

interface Level4Props {
  onCompletePage: (earnedScore: number) => void;
}

export const ScratchAlgo2_Level4_CoordinateBoundsAndGhost: React.FC<Level4Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  // Interactive Stage State
  const [posX, setPosX] = useState<number>(0);
  const [posY, setPosY] = useState<number>(0);
  const [scalePercent, setScalePercent] = useState<number>(100);
  const [ghostEffect, setGhostEffect] = useState<number>(0); // 0 to 100

  // Quizzes
  const [qBounds, setQBounds] = useState<string | null>(null);
  const [qGhostEffect, setQGhostEffect] = useState<string | null>(null);

  const clampX = (val: number) => Math.min(240, Math.max(-240, val));
  const clampY = (val: number) => Math.min(180, Math.max(-180, val));

  const handleMove = (dx: number, dy: number) => {
    setPosX((prev) => clampX(prev + dx));
    setPosY((prev) => clampY(prev + dy));
    sounds.playPop();
  };

  const handleGhostChange = (val: number) => {
    setGhostEffect(val);
    sounds.playLaser();
  };

  const handleScaleChange = (val: number) => {
    setScalePercent(val);
    sounds.playClick();
  };

  const resetStage = () => {
    setPosX(0);
    setPosY(0);
    setScalePercent(100);
    setGhostEffect(0);
    sounds.playClick();
  };

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const handleBoundsQuiz = (val: string) => {
    if (isLocked('qBounds') || qBounds === 'x_240_y_180') return;
    setQBounds(val);
    if (val === 'x_240_y_180') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('qBounds', 5);
    }
  };

  const handleGhostQuiz = (val: string) => {
    if (isLocked('qGhost') || qGhostEffect === 'transparency') return;
    setQGhostEffect(val);
    if (val === 'transparency') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('qGhost', 5);
    }
  };

  const isFormValid = qBounds === 'x_240_y_180' && qGhostEffect === 'transparency';

  // Convert Scratch coords (X: -240..240, Y: -180..180) to Canvas pixels (width 480, height 360)
  // In Scratch, (0,0) is center. Canvas (0,0) is top-left.
  const canvasPixelX = posX + 240;
  const canvasPixelY = 180 - posY;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                {isEn ? 'Unit 4 • Lessons 6–7 (Textbook pp. 84–86)' : 'Unitatea 4 • Lecțiile 6–7 (Manual pag. 84–86)'}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-bold">
                {isEn ? 'Page 4 of 7' : 'Pagina 4 din 7'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              {isEn ? 'Coordinate Limits, Size Scaling & Ghost Effects' : 'Limite de Coordonate, Scalare Mărime & Efectul Fantomă'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {isEn
                ? 'Master the Scratch Cartesian grid (X: -240 to 240, Y: -180 to 180). Implement screen boundary collision guards, dynamic distance scaling, and teleportation with the ghost transparency effect!'
                : 'Stăpânește caroiajul cartezian din Scratch (X: -240 la 240, Y: -180 la 180). Evită ieșirea personajului din ecran, scalează mărimea copacilor pe măsură ce se depărtează și teleportează-te prin efectul fantomă!'}
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-400/40 flex items-center justify-center text-3xl shadow-inner shrink-0">
            👻
          </div>
        </div>
      </div>

      {/* Interactive Stage & Coordinates Lab */}
      <div className="bg-slate-900/90 border-2 border-cyan-500/30 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Move className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-base sm:text-lg">
              {isEn ? 'Interactive Stage: 480 × 360 Grid & Graphic Effects' : 'Scenă Interactivă: Grila 480 × 360 & Efecte Grafice'}
            </h3>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-cyan-500/40 text-cyan-300">
              X = <span className="font-bold text-white">{posX}</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-emerald-500/40 text-emerald-300">
              Y = <span className="font-bold text-white">{posY}</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-purple-500/40 text-purple-300">
              Ghost = <span className="font-bold text-white">{ghostEffect}%</span>
            </span>
          </div>
        </div>

        {/* 480 x 360 Virtual Scratch Canvas */}
        <div className="relative w-full h-80 rounded-2xl bg-slate-950 border-2 border-slate-800 overflow-hidden select-none flex items-center justify-center">
          {/* Coordinate Axes */}
          <div className="absolute inset-x-0 top-1/2 h-0.5 bg-cyan-500/20 border-t border-dashed border-cyan-500/40 pointer-events-none" />
          <div className="absolute inset-y-0 left-1/2 w-0.5 bg-emerald-500/20 border-l border-dashed border-emerald-500/40 pointer-events-none" />

          {/* Screen limits markers */}
          <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-500">(-240, 180)</div>
          <div className="absolute top-2 right-2 text-[10px] font-mono text-slate-500">(240, 180)</div>
          <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-500">(-240, -180)</div>
          <div className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-500">(240, -180)</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-1 rounded">
            (0, 0)
          </div>

          {/* Bound Warning when at borders */}
          {(Math.abs(posX) >= 240 || Math.abs(posY) >= 180) && (
            <div className="absolute top-3 bg-rose-950/90 border border-rose-500 text-rose-300 text-xs font-mono font-bold px-3 py-1 rounded-full animate-bounce">
              ⚠️ {isEn ? 'Boundary Reached: [dacă x > 240 atunci setează x la 240]' : 'Margine Atingsă: [dacă x > 240 setează x la 240]'}
            </div>
          )}

          {/* Movable Sprite */}
          <div
            className="absolute transition-all duration-75 flex flex-col items-center pointer-events-none"
            style={{
              left: `${canvasPixelX}px`,
              top: `${canvasPixelY}px`,
              transform: `translate(-50%, -50%) scale(${scalePercent / 100})`,
              opacity: (100 - ghostEffect) / 100
            }}
          >
            <div className="text-5xl filter drop-shadow-xl">
              🧙‍♂️
            </div>
            <div className="text-[10px] font-mono font-bold bg-slate-900/90 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/40 whitespace-nowrap">
              ({posX}, {posY})
            </div>
          </div>
        </div>

        {/* Sliders and Control Pad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Movement D-Pad */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-2">
            <div className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
              {isEn ? 'D-Pad Navigator' : 'Taste Deplasare Coordonate'}
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleMove(0, 30)}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold border border-slate-700 cursor-pointer shadow"
                title="+Y (Sus)"
              >
                ▲ +Y
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleMove(-30, 0)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold border border-slate-700 cursor-pointer shadow"
                  title="-X (Stânga)"
                >
                  ◀ -X
                </button>
                <button
                  type="button"
                  onClick={resetStage}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold border border-slate-700 cursor-pointer text-xs"
                  title="Resetează la (0,0)"
                >
                  (0, 0)
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(30, 0)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold border border-slate-700 cursor-pointer shadow"
                  title="+X (Dreapta)"
                >
                  +X ▶
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleMove(0, -30)}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold border border-slate-700 cursor-pointer shadow"
                title="-Y (Jos)"
              >
                ▼ -Y
              </button>
            </div>
          </div>

          {/* Sliders for Scaling and Ghost */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-around space-y-3">
            {/* Size Scaling Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span className="flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                  {isEn ? 'Mărime Sprite:' : 'setează mărimea la:'}
                </span>
                <span className="text-cyan-400 font-bold">{scalePercent}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="180"
                value={scalePercent}
                onChange={(e) => handleScaleChange(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="text-[10px] text-slate-500">
                {isEn ? 'Used to create perspective (smaller = farther)' : 'Creează perspectivă: personajul devine mai mic pe măsură ce se depărtează'}
              </div>
            </div>

            {/* Ghost Effect Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span className="flex items-center gap-1">
                  <Ghost className="w-3.5 h-3.5 text-purple-400" />
                  {isEn ? 'Efect Fantomă (Ghost):' : 'setează efectul [fantomă] la:'}
                </span>
                <span className="text-purple-400 font-bold">{ghostEffect}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={ghostEffect}
                onChange={(e) => handleGhostChange(Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
              <div className="text-[10px] text-slate-500">
                {ghostEffect === 100
                  ? (isEn ? '100% = Completely invisible / teleported' : '100% = Invizibil complet / personajul este teleportat')
                  : ghostEffect > 0
                  ? (isEn ? 'Semi-transparent hologram' : 'Semi-transparent / efect de apariție treptată')
                  : (isEn ? '0% = Fully opaque' : '0% = Opac complet')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formative Quizzes */}
      <div className="space-y-4">
        {/* Q1 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-white text-base">
                {isEn
                  ? '1. What are the maximum coordinate boundaries of the Scratch stage?'
                  : '1. Care sunt coordonatele extreme ale scenei Scratch (lățime 480px, înălțime 360px)?'}
              </h3>
            </div>
            <QuestionHint hint={isEn ? 'Half of 480 is 240, half of 360 is 180!' : 'Jumătatea lățimii 480 este 240, iar jumătatea înălțimii 360 este 180!'} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              { id: 'x_240_y_180', label: 'X: [-240, +240], Y: [-180, +180]', isCorrect: true },
              { id: 'x_100_y_100', label: 'X: [-100, +100], Y: [-100, +100]', isCorrect: false },
              { id: 'x_500_y_500', label: 'X: [-500, +500], Y: [-500, +500]', isCorrect: false }
            ].map((opt) => {
              const isSelected = qBounds === opt.id;
              let style = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (qBounds) {
                if (opt.isCorrect) style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                else if (isSelected) style = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={opt.id}
                  disabled={Boolean(qBounds)}
                  onClick={() => handleBoundsQuiz(opt.id)}
                  className={`p-3.5 rounded-xl border font-bold text-xs sm:text-sm text-left transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-between gap-2 ${style}`}
                >
                  <span className="font-mono">{opt.label}</span>
                  {qBounds && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {qBounds && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {qBounds && (
            <AnswerExplanation
              isCorrect={qBounds === 'x_240_y_180'}
              explanation={
                isEn
                  ? 'Correct! With center (0,0), X ranges from -240 (left) to +240 (right), and Y from -180 (bottom) to +180 (top).'
                  : 'Corect! Având originea (0,0) în centru, coordonata orizontală X variază de la -240 la +240, iar verticala Y de la -180 la +180!'
              }
            />
          )}
        </div>

        {/* Q2 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-white text-base">
                {isEn
                  ? '2. What visual effect does the "ghost" (fantomă) effect block control?'
                  : '2. Ce proprietate vizuală controlează efectul „fantomă” din categoria Aspect?'}
              </h3>
            </div>
            <QuestionHint hint={isEn ? 'Think of invisibility and transparency!' : 'Gândește-te la transparență și dispariția treptată a fantomelor!'} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              { id: 'transparency', label: 'Transparența personajului (0 = opac, 100 = invizibil)', isCorrect: true },
              { id: 'rotation_speed', label: 'Viteza de rotație a personajului', isCorrect: false },
              { id: 'audio_volume', label: 'Volumul sunetelor emise', isCorrect: false }
            ].map((opt) => {
              const isSelected = qGhostEffect === opt.id;
              let style = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (qGhostEffect) {
                if (opt.isCorrect) style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                else if (isSelected) style = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={opt.id}
                  disabled={Boolean(qGhostEffect)}
                  onClick={() => handleGhostQuiz(opt.id)}
                  className={`p-3.5 rounded-xl border font-bold text-xs sm:text-sm text-left transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-between gap-2 ${style}`}
                >
                  <span>{opt.label}</span>
                  {qGhostEffect && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {qGhostEffect && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {qGhostEffect && (
            <AnswerExplanation
              isCorrect={qGhostEffect === 'transparency'}
              explanation={
                isEn
                  ? 'Correct! Setting the ghost effect to 100 makes the sprite completely transparent and invisible without actually using the "hide" block!'
                  : 'Corect! Modificând efectul fantomă între 0 și 100 reglezi transparența: la 100 personajul devine complet invizibil fără a folosi blocul „ascunde”!'
              }
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        canProceed={isFormValid}
        onNext={() => {
          sounds.playNext();
          onCompletePage(15);
        }}
        nextLabel={isEn ? 'Next: Brâncuși Album & Infinite Column (p. 87–88) →' : 'Următorul: Albumul Brâncuși & Coloana Infinitului (pag. 87–88) →'}
      />
    </div>
  );
};
