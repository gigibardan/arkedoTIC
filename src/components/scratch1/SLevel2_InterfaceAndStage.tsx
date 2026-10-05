import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Play, 
  Flag, 
  Octagon, 
  RotateCcw, 
  Check, 
  Layers, 
  Crosshair, 
  ExternalLink,
  Palette,
  Briefcase
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface SLevel2Props {
  onCompletePage: (earnedScore: number) => void;
}

export const SLevel2_InterfaceAndStage: React.FC<SLevel2Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive Stage State
  // Stage coordinates in Scratch: x: -240..240, y: -180..180
  const [spriteX, setSpriteX] = useState<number>(0);
  const [spriteY, setSpriteY] = useState<number>(0);
  const [activeCostume, setActiveCostume] = useState<'costume1' | 'costume2'>('costume1');
  const [activeBackdrop, setActiveBackdrop] = useState<'grid' | 'space' | 'underwater'>('grid');
  const [targetGoalAchieved, setTargetGoalAchieved] = useState<boolean>(false);
  const [targetCoordinates] = useState<{ x: number; y: number }>({ x: 100, y: 80 });

  // Quiz State
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);
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

  // Check if sprite is close to the target coordinate
  const checkTargetCollision = (newX: number, newY: number) => {
    if (Math.abs(newX - targetCoordinates.x) <= 20 && Math.abs(newY - targetCoordinates.y) <= 20) {
      if (!targetGoalAchieved) {
        sounds.playCorrect();
        setTargetGoalAchieved(true);
      }
    }
  };

  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Map from canvas pixels (width: 360, height: 270) to Scratch coordinates (-240..240, -180..180)
    const normalizedX = Math.round(((clickX / rect.width) * 480) - 240);
    const normalizedY = Math.round(180 - ((clickY / rect.height) * 360));
    
    // Constrain to limits
    const clampedX = Math.max(-240, Math.min(240, normalizedX));
    const clampedY = Math.max(-180, Math.min(180, normalizedY));
    
    sounds.playClick();
    setSpriteX(clampedX);
    setSpriteY(clampedY);
    checkTargetCollision(clampedX, clampedY);
  };

  const handleTeleport = (x: number, y: number) => {
    sounds.playClick();
    setSpriteX(x);
    setSpriteY(y);
    checkTargetCollision(x, y);
  };

  const toggleCostume = () => {
    sounds.playClick();
    setActiveCostume(prev => (prev === 'costume1' ? 'costume2' : 'costume1'));
  };

  // Quiz Handlers
  const handleQ1 = (id: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    setQ1Answer(id);
    if (id === 'dims_480_360') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const handleQ2 = (id: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    setQ2Answer(id);
    if (id === 'center_0_0') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  const handleQ3 = (id: string) => {
    if ((cooldowns.q3 || 0) > 0) return;
    setQ3Answer(id);
    if (id === 'backpack_storage') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q3: 5 }));
    }
  };

  const isQ1Correct = q1Answer === 'dims_480_360';
  const isQ2Correct = q2Answer === 'center_0_0';
  const isQ3Correct = q3Answer === 'backpack_storage';

  let totalScore = 0;
  if (targetGoalAchieved) totalScore += 30;
  if (isQ1Correct) totalScore += 25;
  if (isQ2Correct) totalScore += 25;
  if (isQ3Correct) totalScore += 20;

  const isPageComplete = targetGoalAchieved && isQ1Correct && isQ2Correct && isQ3Correct;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600/30 via-orange-600/20 to-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/40 text-amber-300">
              <Monitor className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {lang === 'en' ? 'Unit 6 • Scratch 3.0' : 'Unitatea 6 • Scratch 3.0'}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {lang === 'en' ? 'Page 2 of 7' : 'Pagina 2 din 7'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {lang === 'en'
                  ? 'The Scratch 3.0 Interface & Coordinate Stage'
                  : 'Interfața Scratch 3.0, Scena și Sistemul de Coordonate'}
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
          <h2>{lang === 'en' ? 'Key Scratch Interface Elements (Textbook pp. 72–75)' : 'Elementele de Bază ale Interfeței Scratch (Manual pag. 72–75)'}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-300">
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="font-bold text-amber-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              {lang === 'en' ? '1. The Stage & Coordinates' : '1. Scena și Coordonatele'}
            </div>
            <p className="text-slate-400">
              {lang === 'en'
                ? 'The stage has 480px width and 360px height. The center is strictly (x=0, y=0). X goes from -240 (left) to +240 (right). Y goes from -180 (bottom) to +180 (top).'
                : 'Scena are 480px lățime și 360px înălțime. Centrul este strict (x=0, y=0). X variază de la -240 (stânga) la +240 (dreapta). Y variază de la -180 (jos) la +180 (sus).'}
            </p>
          </div>
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="font-bold text-sky-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              {lang === 'en' ? '2. Green Flag & Red Stop' : '2. Steagul Verde & Stop'}
            </div>
            <p className="text-slate-400">
              {lang === 'en'
                ? 'The Green Flag (🚩) launches scripts with "when flag clicked". The Red Octagon (🛑) immediately halts all running scripts across all sprites.'
                : 'Steagul Verde (🚩) pornește scripturile cu „când se dă clic pe steag”. Bulina Roșie (🛑) oprește imediat rularea tuturor scripturilor active.'}
            </p>
          </div>
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="font-bold text-emerald-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {lang === 'en' ? '3. Costumes & Backpack' : '3. Costume & Rucsacul'}
            </div>
            <p className="text-slate-400">
              {lang === 'en'
                ? 'Sprites have multiple costumes for animation. The Backpack (at bottom) allows copying sprites, code, and sounds between different projects.'
                : 'Personajele au mai multe costume pentru animație pas-cu-pas. Rucsacul (Backpack) permite stocarea și transferul de scripturi și sunete între proiecte.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Simulator: Scratch Coordinate Stage Lab */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <Crosshair className="w-5 h-5 text-amber-400" />
            <h3>{lang === 'en' ? 'Interactive Stage Coordinate Simulator' : 'Laborator Interactiv: Coordonatele pe Scena Scratch'}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleCostume}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? `Costume: ${activeCostume}` : `Costum: ${activeCostume}`}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveBackdrop(prev => (prev === 'grid' ? 'space' : prev === 'space' ? 'underwater' : 'grid'))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600/30 hover:bg-sky-600/50 border border-sky-500/40 text-sky-200 text-xs font-semibold cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? `Backdrop: ${activeBackdrop}` : `Fundal: ${activeBackdrop}`}</span>
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">
          {lang === 'en'
            ? 'Click anywhere on the coordinate stage to move RoboTIC. Target goal: Reach the golden target at (x: 100, y: 80)!'
            : 'Fă clic oriunde pe scenă pentru a muta personajul RoboTIC. Misiune practică: Atinge ținta aurie de la coordonatele (x: 100, y: 80)!'}
        </p>

        {/* Stage Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          <div className="lg:col-span-2">
            {/* Top Toolbar */}
            <div className="bg-slate-950 px-4 py-2 rounded-t-xl border border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  title="Green Flag (Start)"
                  className="p-1.5 rounded bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/40 transition cursor-pointer"
                >
                  <Flag className="w-4 h-4 fill-emerald-500" />
                </button>
                <button
                  type="button"
                  title="Red Octagon (Stop)"
                  className="p-1.5 rounded bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600/40 transition cursor-pointer"
                >
                  <Octagon className="w-4 h-4 fill-rose-500" />
                </button>
                <span className="text-xs text-slate-400 font-mono">Stage: 480 × 360 px</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-amber-300">x: <strong className="text-white">{spriteX}</strong></span>
                <span className="text-sky-300">y: <strong className="text-white">{spriteY}</strong></span>
              </div>
            </div>

            {/* Interactive Canvas */}
            <div
              onClick={handleStageClick}
              className={`relative w-full aspect-[4/3] rounded-b-xl border-x border-b border-slate-700 overflow-hidden cursor-crosshair transition-colors select-none ${
                activeBackdrop === 'space'
                  ? 'bg-gradient-to-b from-indigo-950 via-slate-950 to-black'
                  : activeBackdrop === 'underwater'
                  ? 'bg-gradient-to-b from-cyan-900 via-blue-950 to-slate-950'
                  : 'bg-slate-950'
              }`}
            >
              {/* Coordinate Grid Overlay */}
              {activeBackdrop === 'grid' && (
                <div className="absolute inset-0 pointer-events-none opacity-30">
                  {/* Axis lines */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-amber-500/70"></div>
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-sky-500/70"></div>
                  {/* Grid labels */}
                  <span className="absolute top-1/2 left-2 -translate-y-4 text-[10px] font-mono text-amber-400">-240</span>
                  <span className="absolute top-1/2 right-2 -translate-y-4 text-[10px] font-mono text-amber-400">+240</span>
                  <span className="absolute left-1/2 top-2 -translate-x-6 text-[10px] font-mono text-sky-400">+180</span>
                  <span className="absolute left-1/2 bottom-2 -translate-x-6 text-[10px] font-mono text-sky-400">-180</span>
                  <span className="absolute top-1/2 left-1/2 translate-x-1 translate-y-1 text-[10px] font-mono text-white/80">(0,0)</span>
                </div>
              )}

              {/* Target Location Box */}
              <div
                style={{
                  left: `${((targetCoordinates.x + 240) / 480) * 100}%`,
                  top: `${((180 - targetCoordinates.y) / 360) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className={`absolute w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center transition-all ${
                  targetGoalAchieved
                    ? 'border-emerald-400 bg-emerald-500/30 scale-110 shadow-[0_0_20px_rgba(52,211,153,0.5)]'
                    : 'border-amber-400 bg-amber-500/20 animate-pulse'
                }`}
              >
                <span className="text-sm">{targetGoalAchieved ? '⭐' : '🎯'}</span>
                <span className="absolute -bottom-4 text-[9px] font-mono text-amber-300 whitespace-nowrap bg-slate-900/90 px-1 rounded">
                  (100, 80)
                </span>
              </div>

              {/* Sprite (RoboTIC) */}
              <div
                style={{
                  left: `${((spriteX + 240) / 480) * 100}%`,
                  top: `${((180 - spriteY) / 360) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  transition: 'left 0.2s ease-out, top 0.2s ease-out'
                }}
                className="absolute flex flex-col items-center pointer-events-none drop-shadow-2xl"
              >
                <div className="text-3xl filter drop-shadow-lg">
                  {activeCostume === 'costume1' ? '🤖' : '🚀'}
                </div>
                <div className="text-[10px] font-bold text-white bg-slate-900/90 border border-slate-700 px-1.5 py-0.5 rounded-full mt-0.5 whitespace-nowrap">
                  RoboTIC ({spriteX}, {spriteY})
                </div>
              </div>
            </div>
          </div>

          {/* Controls & Quick Coordinates Pad */}
          <div className="space-y-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {lang === 'en' ? 'Quick Teleport Pad' : 'Poziționare Rapidă'}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleTeleport(0, 0)}
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-amber-300 text-center transition cursor-pointer"
              >
                Center (0, 0)
              </button>
              <button
                type="button"
                onClick={() => handleTeleport(100, 80)}
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-amber-500/50 rounded-lg text-xs font-mono text-amber-200 text-center transition cursor-pointer"
              >
                Target (100, 80)
              </button>
              <button
                type="button"
                onClick={() => handleTeleport(-200, 140)}
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-slate-300 text-center transition cursor-pointer"
              >
                Top-Left (-200, 140)
              </button>
              <button
                type="button"
                onClick={() => handleTeleport(200, -140)}
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-slate-300 text-center transition cursor-pointer"
              >
                Bot-Right (200, -140)
              </button>
            </div>

            {/* Target feedback banner */}
            <div className={`p-3 rounded-xl border text-xs ${
              targetGoalAchieved
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                {targetGoalAchieved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Sparkles className="w-4 h-4 text-amber-400" />}
                <span>{targetGoalAchieved ? (lang === 'en' ? 'Target Achieved! (+30 Pts)' : 'Țintă Atingă! (+30 Pcte)') : (lang === 'en' ? 'Move to (100, 80)' : 'Mergi la (100, 80)')}</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                {lang === 'en'
                  ? 'Click anywhere or use the teleport pad to reach the golden target coordinate.'
                  : 'Apasă pe scenă sau folosește butoanele de poziționare pentru a duce personajul la coordonatele țintă.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Assessment Quiz */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>{lang === 'en' ? 'Concept Check: Scratch 3.0 Environment' : 'Verificarea Cunoștințelor: Mediul Scratch 3.0'}</span>
        </h3>

        {/* Question 1 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {lang === 'en' ? 'Question 1 of 3' : 'Întrebarea 1 din 3'}
            </span>
            <QuestionHint
              hintRo="Lățimea este de 480 de pixeli, iar înălțimea este de 360 de pixeli."
              hintEn="The width is 480 pixels, and the height is 360 pixels."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'What are the official stage dimensions in Scratch 3.0?'
              : 'Care sunt dimensiunile oficiale ale scenei în Scratch 3.0?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'dims_480_360', ro: '480 pixeli lățime și 360 pixeli înălțime (format 4:3)', en: '480 pixels width and 360 pixels height (4:3 ratio)' },
              { id: 'dims_1920_1080', ro: '1920 pixeli lățime și 1080 pixeli înălțime (Full HD)', en: '1920 pixels width and 1080 pixels height (Full HD)' },
              { id: 'dims_100_100', ro: '100 pixeli lățime și 100 pixeli înălțime (pătrat)', en: '100 pixels width and 100 pixels height (square)' },
              { id: 'dims_800_600', ro: '800 pixeli lățime și 600 pixeli înălțime', en: '800 pixels width and 600 pixels height' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q1 || 0) > 0}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'dims_480_360'
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
              customMessageRo="Reflecție didactică: Scena Scratch are un spațiu 2D de 480 × 360 puncte grafice!"
              customMessageEn="Pedagogical reflection: Scratch stage uses a 2D space of 480 × 360 graphic points!"
            />
          ) : null}
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanationRo="Scena are 480 de pixeli pe axa X (orizontală) și 360 de pixeli pe axa Y (verticală)."
              explanationEn="The stage measures 480px along the horizontal X-axis and 360px along the vertical Y-axis."
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {lang === 'en' ? 'Question 2 of 3' : 'Întrebarea 2 din 3'}
            </span>
            <QuestionHint
              hintRo="Originea sistemului cartezian se află chiar în centrul geometric al scenei."
              hintEn="The origin of the Cartesian coordinate system lies right in the geometric center of the stage."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'Where is the point (x: 0, y: 0) located on the Scratch stage?'
              : 'Unde se află punctul cu coordonatele (x: 0, y: 0) pe scena Scratch?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'center_0_0', ro: 'Exact în centrul geometric al scenei', en: 'Exactly in the geometric center of the stage' },
              { id: 'top_left', ro: 'În colțul din stânga-sus', en: 'In the top-left corner' },
              { id: 'bottom_left', ro: 'În colțul din stânga-jos', en: 'In the bottom-left corner' },
              { id: 'top_right', ro: 'În colțul din dreapta-sus', en: 'In the top-right corner' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q2 || 0) > 0}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'center_0_0'
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
              customMessageRo="Reflecție didactică: În Scratch centrul este originea axelor (0,0), facilitând poziționarea simetrică!"
              customMessageEn="Pedagogical reflection: In Scratch the center is the axis origin (0,0), enabling symmetric positioning!"
            />
          ) : null}
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanationRo="Originea (0, 0) împarte scena simetric în jumătate: -240 la +240 pe orizontală, și -180 la +180 pe verticală."
              explanationEn="Origin (0,0) divides the stage symmetrically: -240 to +240 horizontally, -180 to +180 vertically."
            />
          )}
        </div>

        {/* Question 3 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {lang === 'en' ? 'Question 3 of 3' : 'Întrebarea 3 din 3'}
            </span>
            <QuestionHint
              hintRo="Rucsacul (Backpack) se găsește în partea de jos a ecranului Scratch și servește ca spațiu de transfer."
              hintEn="The Backpack sits at the bottom of the Scratch screen and acts as a transfer storage."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'What is the purpose of the "Backpack" (Rucsac) tool in Scratch?'
              : 'Care este rolul instrumentului „Rucsac” (Backpack) din interfața Scratch?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'backpack_storage', ro: 'Păstrează și transferă scripturi, personaje și sunete între diferite proiecte', en: 'Stores and transfers scripts, sprites, and sounds between projects' },
              { id: 'delete_tool', ro: 'Șterge automat toate personajele de pe scenă', en: 'Automatically deletes all sprites on the stage' },
              { id: 'speed_up', ro: 'Mărește viteza procesorului calculatorului', en: 'Increases computer CPU clock speed' },
              { id: 'save_pdf', ro: 'Exportă proiectul direct în format PDF pentru imprimare', en: 'Exports the project directly as PDF for printing' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q3 || 0) > 0}
                onClick={() => handleQ3(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q3Answer === opt.id
                    ? opt.id === 'backpack_storage'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-amber-400 text-slate-300'
                }`}
              >
                {lang === 'en' ? opt.en : opt.ro}
              </button>
            ))}
          </div>
          {cooldowns.q3 && cooldowns.q3 > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.q3}
              totalSeconds={5}
              customMessageRo="Reflecție didactică: Rucsacul este buzunarul tău de reciclare și reutilizare a codului în Scratch!"
              customMessageEn="Pedagogical reflection: The Backpack is your pocket for code reuse across Scratch projects!"
            />
          ) : null}
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanationRo="Rucsacul permite elevilor să refolosească scripturi complexe sau personaje desenate în alte proiecte fără a le reprograma de la zero."
              explanationEn="Backpack allows reusing complex scripts and sprites across projects without rewriting them from scratch."
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentPage={2}
        totalPages={7}
        earnedScore={totalScore}
        isCompleted={isPageComplete}
        onNextPage={() => {
          sounds.playCorrect();
          onCompletePage(totalScore);
        }}
        nextButtonLabelRo="Continuă la Pagina 3: Paleta de Blocuri Colorate"
        nextButtonLabelEn="Proceed to Page 3: The 9 Block Categories"
      />
    </div>
  );
};
