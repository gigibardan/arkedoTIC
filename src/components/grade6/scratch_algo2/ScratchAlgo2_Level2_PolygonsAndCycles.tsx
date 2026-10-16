import React, { useState } from 'react';
import {
  Compass,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  Shapes,
  Palette,
  Eye
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { useQuestionCooldowns, PedagogicalReflectionBanner } from '../../../utils/pedagogicalGrading';

interface Level2Props {
  onCompletePage: (earnedScore: number) => void;
}

interface PolygonConfig {
  nameRo: string;
  nameEn: string;
  sides: number;
  angle: number;
  color: string;
}

const POLYGONS: PolygonConfig[] = [
  { nameRo: 'Triunghi Echilateral', nameEn: 'Equilateral Triangle', sides: 3, angle: 120, color: '#f59e0b' },
  { nameRo: 'Pătrat', nameEn: 'Square', sides: 4, angle: 90, color: '#3b82f6' },
  { nameRo: 'Pentagon Regulat', nameEn: 'Regular Pentagon', sides: 5, angle: 72, color: '#10b981' },
  { nameRo: 'Hexagon Regulat', nameEn: 'Regular Hexagon', sides: 6, angle: 60, color: '#8b5cf6' },
  { nameRo: 'Octogon Regulat', nameEn: 'Regular Octagon', sides: 8, angle: 45, color: '#ec4899' },
  { nameRo: 'Cerc (Poligon 360)', nameEn: 'Circle (360 Sides)', sides: 36, angle: 10, color: '#06b6d4' }
];

export const ScratchAlgo2_Level2_PolygonsAndCycles: React.FC<Level2Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [selectedPolyIndex, setSelectedPolyIndex] = useState<number>(2); // Pentagon default
  const [drawnSides, setDrawnSides] = useState<number>(0);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // Character animation lab state (Costume cycling)
  const [costumeFrame, setCostumeFrame] = useState<number>(1);
  const [isAnimatingSprite, setIsAnimatingSprite] = useState<boolean>(false);

  // Quizzes
  const [qAngleFormula, setQAngleFormula] = useState<string | null>(null);
  const [qCostumeBlock, setQCostumeBlock] = useState<string | null>(null);

  const currentPoly = POLYGONS[selectedPolyIndex];

  const startDrawing = () => {
    if (isDrawing) return;
    setIsDrawing(true);
    setDrawnSides(0);
    sounds.playClick();

    let side = 0;
    const maxSides = currentPoly.sides;
    const speed = maxSides > 20 ? 60 : 250;

    const interval = setInterval(() => {
      side++;
      setDrawnSides(side);
      sounds.playPop();

      if (side >= maxSides) {
        clearInterval(interval);
        setIsDrawing(false);
        sounds.playCorrect();
      }
    }, speed);
  };

  const resetDrawing = () => {
    setIsDrawing(false);
    setDrawnSides(0);
    sounds.playClick();
  };

  const toggleSpriteAnimation = () => {
    if (isAnimatingSprite) {
      setIsAnimatingSprite(false);
      return;
    }
    setIsAnimatingSprite(true);
    sounds.playClick();

    let frame = 1;
    const interval = setInterval(() => {
      frame = frame === 1 ? 2 : 1;
      setCostumeFrame(frame);
      sounds.playPop();
    }, 300);

    // Auto-stop after 4 seconds
    setTimeout(() => {
      clearInterval(interval);
      setIsAnimatingSprite(false);
    }, 4000);
  };

  // Generate SVG polygon points based on drawn sides
  const generateSvgPoints = () => {
    const cx = 150;
    const cy = 150;
    const radius = 95;
    const points: string[] = [];
    const total = currentPoly.sides;
    const step = (2 * Math.PI) / total;
    const startAngle = -Math.PI / 2;

    const limit = drawnSides === 0 ? 0 : drawnSides;
    for (let i = 0; i <= limit; i++) {
      const idx = i % total;
      const x = cx + radius * Math.cos(startAngle + idx * step);
      const y = cy + radius * Math.sin(startAngle + idx * step);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }

    return points.join(' ');
  };

  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const handleAngleQuiz = (val: string) => {
    if (isLocked('qAngle') || qAngleFormula === '360_div_n') return;
    setQAngleFormula(val);
    if (val === '360_div_n') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('qAngle', 5);
    }
  };

  const handleCostumeQuiz = (val: string) => {
    if (isLocked('qCostume') || qCostumeBlock === 'next_costume') return;
    setQCostumeBlock(val);
    if (val === 'next_costume') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('qCostume', 5);
    }
  };

  const isFormValid = qAngleFormula === '360_div_n' && qCostumeBlock === 'next_costume';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900/80 via-slate-900 to-indigo-950/80 border-2 border-teal-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                {isEn ? 'Unit 4 • Lessons 5–6 (Textbook pp. 78–81)' : 'Unitatea 4 • Lecțiile 5–6 (Manual pag. 78–81)'}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-bold">
                {isEn ? 'Page 2 of 7' : 'Pagina 2 din 7'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              {isEn ? 'Regular Polygons & Cyclic Animations' : 'Poligoane Regulate & Animații Ciclice în Scratch'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {isEn
                ? 'Master the golden geometry rule: Exterior Angle = 360° / n. Draw any regular polygon using the pen extension and animate sprites with cyclic costume loops!'
                : 'Stăpânește regula de aur din geometrie: Unghiul Exterior = 360° / n. Desenează orice poligon regulat cu extensia Stilou și creează animații ciclice schimbând costumele la fiecare pas!'}
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-400/40 flex items-center justify-center text-3xl shadow-inner shrink-0">
            📐
          </div>
        </div>
      </div>

      {/* Interactive Lab: Polygon Pen Drawer */}
      <div className="bg-slate-900/90 border-2 border-teal-500/30 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shapes className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-white text-base sm:text-lg">
              {isEn ? 'Virtual Pen Lab: Draw Regular Polygons' : 'Laborator Stilou Virtual: Desenarea Poligoanelor Regulate'}
            </h3>
          </div>
          <div className="text-xs font-mono text-teal-300 bg-teal-950/60 px-3 py-1 rounded-full border border-teal-500/30">
            Formula: unghi = 360° / {currentPoly.sides} = <span className="font-bold text-white">{currentPoly.angle}°</span>
          </div>
        </div>

        {/* Polygon Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {POLYGONS.map((poly, idx) => (
            <button
              key={poly.nameRo}
              disabled={isDrawing}
              onClick={() => {
                setSelectedPolyIndex(idx);
                setDrawnSides(0);
                sounds.playClick();
              }}
              className={`p-2.5 rounded-xl border text-center transition cursor-pointer text-xs font-bold ${
                selectedPolyIndex === idx
                  ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md scale-105'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>{poly.sides} {isEn ? 'sides' : 'laturi'}</div>
              <div className="text-[10px] opacity-80">{poly.angle}°</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* SVG Canvas */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center relative min-h-[300px]">
            <svg width="300" height="300" viewBox="0 0 300 300" className="overflow-visible">
              {/* Background grid */}
              <circle cx="150" cy="150" r="95" fill="none" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
              {/* Ghost full polygon */}
              {drawnSides > 0 && (
                <polygon
                  points={generateSvgPoints()}
                  fill="none"
                  stroke={currentPoly.color}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {/* Sprite Arky Pen indicator at latest point */}
              <circle cx="150" cy="55" r="5" fill="#f59e0b" />
            </svg>

            <div className="absolute bottom-3 left-3 text-xs font-mono text-slate-400">
              Laturi trasate: <span className="text-teal-400 font-bold">{drawnSides}</span> / {currentPoly.sides}
            </div>

            <div className="absolute bottom-3 right-3 flex gap-2">
              <button
                type="button"
                disabled={isDrawing}
                onClick={startDrawing}
                className="py-1.5 px-3 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1 shadow-md"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isEn ? 'Trace' : 'Desenează'}</span>
              </button>
              <button
                type="button"
                disabled={isDrawing}
                onClick={resetDrawing}
                className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Scratch Code Recipe */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3 font-mono text-xs">
            <div>
              <div className="text-slate-400 font-bold text-[11px] uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>{isEn ? 'Scratch Pen Blocks' : 'Instrucțiuni Scratch (Extensia Stilou)'}</span>
                <span className="text-teal-400 font-bold">{currentPoly.nameRo}</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5 text-slate-300">
                <div className="text-teal-400">✏️ șterge tot</div>
                <div className="text-teal-400">✏️ pune stiloul jos</div>
                <div className="text-purple-400 font-bold">
                  🔄 repetă ({currentPoly.sides})
                </div>
                <div className="pl-4 border-l-2 border-purple-500 space-y-1">
                  <div className="text-cyan-300">
                    mergi ({currentPoly.sides === 36 ? '15' : '80'}) pași
                  </div>
                  <div className="text-amber-300 font-bold">
                    rotește ↻ la dreapta cu ({currentPoly.angle}) grade
                  </div>
                </div>
                <div className="text-teal-400">✏️ ridică stiloul</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-500/30 text-xs text-teal-200">
              💡 <span className="font-bold">{isEn ? 'Rule of 360°:' : 'Regula celor 360°:'}</span> {isEn
                ? 'To return to the initial orientation, the sum of all turns must equal 360 degrees (sides × angle = 360).'
                : 'Orice poligon închis necesită ca personajul să efectueze o rotație completă de 360° pe perimetrul său!'}
            </div>
          </div>
        </div>
      </div>

      {/* Cyclic Sprite Animation Lab (Chick peck / Dino run) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-pink-400" />
            <h3 className="font-bold text-white text-base">
              {isEn ? 'Cyclic Character Animations (Textbook p. 80)' : 'Animații Ciclice de Personaje (Manual pag. 80)'}
            </h3>
          </div>
          <span className="text-xs font-mono text-pink-300 bg-pink-950/60 px-2.5 py-1 rounded-full border border-pink-500/30">
            {isEn ? 'Costumes Loop' : 'Buclă Schimbare Costume'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          {/* Animated Sprite Box */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center">
            <div className="text-6xl mb-2 transition-transform transform duration-150 scale-110">
              {costumeFrame === 1 ? '🐥' : '🐤'}
            </div>
            <div className="text-xs font-mono font-bold text-slate-300">
              {isEn ? `Costume ${costumeFrame}` : `Costumul ${costumeFrame}`}
            </div>
            <div className="text-[11px] text-slate-500">
              {costumeFrame === 1 ? (isEn ? 'Standing' : 'Stă drept') : (isEn ? 'Pecking grain' : 'Ciugulește grăunțe')}
            </div>
          </div>

          {/* Script Explanation */}
          <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
            <div className="text-purple-300 font-bold">
              🔄 repetă (10)
            </div>
            <div className="pl-4 border-l-2 border-purple-500 space-y-1">
              <div className="text-pink-400 font-bold">aspect: costumul următor</div>
              <div className="text-amber-300">așteaptă (0.3) secunde</div>
            </div>
            <p className="text-slate-400 text-xs font-sans pt-1">
              {isEn
                ? 'Cycling costumes with a small wait creates the illusion of life and movement (pecking, running, wings flapping).'
                : 'Schimbarea continuă a costumelor cu o mică pauză de timp creează iluzia naturală de mișcare (mers, alergare, ciugulit).'}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={toggleSpriteAnimation}
                className="py-2 px-4 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-pink-600/30"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isAnimatingSprite ? (isEn ? 'Animating...' : 'Animare în curs...') : (isEn ? 'Test Animation' : 'Pornește Animația')}</span>
              </button>
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
              <BookOpen className="w-5 h-5 text-teal-400" />
              <h3 className="font-bold text-white text-base">
                {isEn
                  ? '1. What angle must Scratch turn to draw a regular hexagon (6 sides)?'
                  : '1. Cu câte grade trebuie să se rotească personajul la fiecare pas pentru a desena un hexagon regulat (6 laturi)?'}
              </h3>
            </div>
            <QuestionHint hint={isEn ? 'Divide 360 degrees by 6 sides!' : 'Împarte cele 360° ale rotației complete la 6 laturi!'} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              { id: '360_div_n', label: '60° (360° / 6)', isCorrect: true },
              { id: '90_deg', label: '90° (360° / 4)', isCorrect: false },
              { id: '72_deg', label: '72° (360° / 5)', isCorrect: false }
            ].map((opt) => {
              const isSelected = qAngleFormula === opt.id;
              let style = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (qAngleFormula) {
                if (opt.isCorrect) style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                else if (isSelected) style = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={opt.id}
                  disabled={isLocked('qAngle') || qAngleFormula === '360_div_n'}
                  onClick={() => handleAngleQuiz(opt.id)}
                  className={`p-3.5 rounded-xl border font-bold text-xs sm:text-sm text-left transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-between gap-2 ${style}`}
                >
                  <span className="font-mono">{opt.label}</span>
                  {qAngleFormula && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {qAngleFormula && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {cooldowns.qAngle && cooldowns.qAngle > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.qAngle}
              totalSeconds={5}
              customMessageRo="Timp de reflecție: Unghiul de rotație pentru un poligon regulat este unghi = 360° / n!"
              customMessageEn="Reflection buffer: The rotation angle for a regular polygon is angle = 360° / n!"
            />
          ) : null}

          {qAngleFormula && (
            <AnswerExplanation
              isCorrect={qAngleFormula === '360_div_n'}
              explanation={
                isEn
                  ? 'Correct! 360° / 6 = 60°. Repeating 6 times: move steps, turn 60° yields a perfect regular hexagon!'
                  : 'Corect! 360° / 6 = 60°. Repetând de 6 ori secvența „mergi pași, rotește 60°”, se obține un hexagon regulat închis perfect!'
              }
            />
          )}
        </div>

        {/* Q2 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-pink-400" />
              <h3 className="font-bold text-white text-base">
                {isEn
                  ? '2. Which block cycles automatically to the next appearance of a sprite?'
                  : '2. Ce bloc din categoria Aspect permite trecerea automată la următorul desen al unui personaj în cadrul unei animații?'}
              </h3>
            </div>
            <QuestionHint hint={isEn ? 'Look for the purple Looks block!' : 'Caută blocul violet de Aspect!'} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              { id: 'next_costume', label: 'costumul următor', isCorrect: true },
              { id: 'next_backdrop', label: 'decorul următor', isCorrect: false },
              { id: 'show_hide', label: 'arată / ascunde', isCorrect: false }
            ].map((opt) => {
              const isSelected = qCostumeBlock === opt.id;
              let style = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (qCostumeBlock) {
                if (opt.isCorrect) style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                else if (isSelected) style = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={opt.id}
                  disabled={isLocked('qCostume') || qCostumeBlock === 'next_costume'}
                  onClick={() => handleCostumeQuiz(opt.id)}
                  className={`p-3.5 rounded-xl border font-bold text-xs sm:text-sm text-left transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-between gap-2 ${style}`}
                >
                  <span className="font-mono">{opt.label}</span>
                  {qCostumeBlock && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {qCostumeBlock && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {cooldowns.qCostume && cooldowns.qCostume > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.qCostume}
              totalSeconds={5}
              customMessageRo="Timp de reflecție: Blocul „costumul următor” din Aspect trece ciclic la următorul cadru!"
              customMessageEn="Reflection buffer: The 'next costume' Looks block cycles to the next animation frame!"
            />
          ) : null}

          {qCostumeBlock && (
            <AnswerExplanation
              isCorrect={qCostumeBlock === 'next_costume'}
              explanation={
                isEn
                  ? 'Correct! "costumul următor" advances to the next costume and automatically wraps back to costume 1 after the last one!'
                  : 'Corect! Blocul „costumul următor” trece la costumul următor din listă, iar după ultimul revine automat la primul (buclă circulară)!'
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
        nextLabel={isEn ? 'Next: Minecraft 3D & Depth Layers (p. 81–83) →' : 'Următorul: Minecraft 3D & Straturi de Adâncime (pag. 81–83) →'}
      />
    </div>
  );
};
