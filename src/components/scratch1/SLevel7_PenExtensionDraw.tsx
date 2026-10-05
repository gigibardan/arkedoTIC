import React, { useState, useEffect, useRef } from 'react';
import { 
  PenTool, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Play, 
  RotateCcw, 
  Check, 
  ExternalLink,
  Square,
  Triangle,
  Star,
  Circle,
  Palette,
  Award
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface SLevel7Props {
  onCompletePage: (earnedScore: number) => void;
}

type DrawShape = 'square' | 'triangle' | 'star' | 'circle';

export const SLevel7_PenExtensionDraw: React.FC<SLevel7Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Pen settings
  const [selectedShape, setSelectedShape] = useState<DrawShape>('square');
  const [penColor, setPenColor] = useState<string>('#10b981');
  const [penSize, setPenSize] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawnShapesCount, setDrawnShapesCount] = useState<number>(0);

  // Quiz State
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
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

  // Canvas clear
  const handleClearCanvas = () => {
    sounds.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Draw Animated Shape
  const handleDrawShape = (shape: DrawShape) => {
    if (isDrawing) return;
    sounds.playClick();
    setIsDrawing(true);
    setSelectedShape(shape);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    if (shape === 'square') {
      const size = 100;
      const startX = centerX - size / 2;
      const startY = centerY - size / 2;
      
      let step = 0;
      ctx.beginPath();
      ctx.moveTo(startX, startY);

      const interval = setInterval(() => {
        step++;
        if (step === 1) ctx.lineTo(startX + size, startY);
        else if (step === 2) ctx.lineTo(startX + size, startY + size);
        else if (step === 3) ctx.lineTo(startX, startY + size);
        else if (step === 4) {
          ctx.lineTo(startX, startY);
          ctx.stroke();
          clearInterval(interval);
          setIsDrawing(false);
          sounds.playStar();
          setDrawnShapesCount(c => c + 1);
        }
        ctx.stroke();
      }, 150);
    } else if (shape === 'triangle') {
      const r = 70;
      let step = 0;
      ctx.beginPath();
      const p1 = { x: centerX, y: centerY - r };
      const p2 = { x: centerX + r * Math.cos(Math.PI / 6), y: centerY + r * Math.sin(Math.PI / 6) };
      const p3 = { x: centerX - r * Math.cos(Math.PI / 6), y: centerY + r * Math.sin(Math.PI / 6) };

      ctx.moveTo(p1.x, p1.y);

      const interval = setInterval(() => {
        step++;
        if (step === 1) ctx.lineTo(p2.x, p2.y);
        else if (step === 2) ctx.lineTo(p3.x, p3.y);
        else if (step === 3) {
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();
          clearInterval(interval);
          setIsDrawing(false);
          sounds.playStar();
          setDrawnShapesCount(c => c + 1);
        }
        ctx.stroke();
      }, 180);
    } else if (shape === 'star') {
      const spikes = 5;
      const outerRadius = 70;
      const innerRadius = 30;
      let rot = (Math.PI / 2) * 3;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY - outerRadius);

      let currentStep = 0;
      const totalSteps = spikes * 2;

      const interval = setInterval(() => {
        currentStep++;
        const x = centerX + Math.cos(rot + currentStep * step) * (currentStep % 2 === 0 ? outerRadius : innerRadius);
        const y = centerY + Math.sin(rot + currentStep * step) * (currentStep % 2 === 0 ? outerRadius : innerRadius);
        ctx.lineTo(x, y);
        ctx.stroke();

        if (currentStep >= totalSteps) {
          ctx.closePath();
          ctx.stroke();
          clearInterval(interval);
          setIsDrawing(false);
          sounds.playStar();
          setDrawnShapesCount(c => c + 1);
        }
      }, 80);
    } else if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
      ctx.stroke();
      setIsDrawing(false);
      sounds.playStar();
      setDrawnShapesCount(c => c + 1);
    }
  };

  // Initial draw
  useEffect(() => {
    handleDrawShape('square');
  }, []);

  // Quiz Handlers
  const handleQ1 = (id: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    setQ1Answer(id);
    if (id === 'turn_90') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const handleQ2 = (id: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    setQ2Answer(id);
    if (id === 'pen_down') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  const isQ1Correct = q1Answer === 'turn_90';
  const isQ2Correct = q2Answer === 'pen_down';

  let totalScore = 0;
  if (drawnShapesCount >= 1) totalScore += 40;
  if (isQ1Correct) totalScore += 30;
  if (isQ2Correct) totalScore += 30;

  const isPageComplete = drawnShapesCount >= 1 && isQ1Correct && isQ2Correct;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-600/30 via-emerald-600/20 to-slate-900 border border-teal-500/40 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-500/20 rounded-xl border border-teal-500/40 text-teal-300">
              <PenTool className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {lang === 'en' ? 'Unit 6 • Scratch 3.0' : 'Unitatea 6 • Scratch 3.0'}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {lang === 'en' ? 'Page 7 of 7' : 'Pagina 7 din 7'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {lang === 'en'
                  ? 'The Pen Extension: Dynamic Geometric Drawings'
                  : 'Extensia Creion: Desenarea Dinamică a Formelor Geometrice'}
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
        <div className="flex items-center gap-2 text-teal-400 font-bold text-base">
          <BookOpen className="w-5 h-5" />
          <h2>{lang === 'en' ? 'Scratch Pen Extension & Geometry (Textbook pp. 88–90)' : 'Extensia Creion și Geometria în Scratch (Manual pag. 88–90)'}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-300">
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="font-bold text-teal-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              {lang === 'en' ? '1. Adding the Pen Extension' : '1. Adăugarea Extensiei Creion'}
            </div>
            <p className="text-slate-400">
              {lang === 'en'
                ? 'Click the blue "Add Extension" icon at the bottom-left corner and choose the dark cyan "Pen" module.'
                : 'Apasă pe butonul albastru „Adaugă extensie” din colțul stânga-jos și alege modulul turcoaz „Creion” (Pen).'}
            </p>
          </div>
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="font-bold text-emerald-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {lang === 'en' ? '2. Pen Down & Pen Up' : '2. Stilou Jos & Stilou Sus'}
            </div>
            <p className="text-slate-400">
              {lang === 'en'
                ? '`pen down` lowers the drawing tip so sprite movements leave a visible line trail. `pen up` lifts the tip to move freely.'
                : '`stilou jos` coboară vârful creionului, lăsând o urmă colorată la fiecare mișcare a personajului. `stilou sus` oprește desenarea.'}
            </p>
          </div>
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="font-bold text-amber-300 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              {lang === 'en' ? '3. Exterior Angles & Loops' : '3. Unghiuri Exterioare & Bucle'}
            </div>
            <p className="text-slate-400">
              {lang === 'en'
                ? 'A square repeats 4 times: [move 100 steps, turn 90°]. An equilateral triangle repeats 3 times: [move 100, turn 120°].'
                : 'Un pătrat repetă de 4 ori: [mergi 100 pași, rotește-te 90°]. Un triunghi repetă de 3 ori: [mergi 100, rotește-te 120°].'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Pen Drawing Stage */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <Palette className="w-5 h-5 text-teal-400" />
            <h3>{lang === 'en' ? 'Interactive Pen Drawing Canvas & Scratch Script' : 'Laborator Interactiv: Canvas de Desen cu Creionul Scratch'}</h3>
          </div>
          <button
            type="button"
            onClick={handleClearCanvas}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Erase All (șterge tot)' : 'Șterge Tot'}</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">
          {lang === 'en'
            ? 'Select a geometric algorithm below to run the animated Scratch pen script!'
            : 'Alege o figură geometrică de mai jos pentru a executa scriptul de desenare Scratch!'}
        </p>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lang === 'en' ? 'Shape Algorithm:' : 'Algoritm Formă:'}</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={isDrawing}
              onClick={() => handleDrawShape('square')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedShape === 'square' ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Square className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Square (90°)' : 'Pătrat (90°)'}</span>
            </button>
            <button
              type="button"
              disabled={isDrawing}
              onClick={() => handleDrawShape('triangle')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedShape === 'triangle' ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Triangle className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Triangle (120°)' : 'Triunghi (120°)'}</span>
            </button>
            <button
              type="button"
              disabled={isDrawing}
              onClick={() => handleDrawShape('star')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedShape === 'star' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Star (144°)' : 'Stea (144°)'}</span>
            </button>
            <button
              type="button"
              disabled={isDrawing}
              onClick={() => handleDrawShape('circle')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedShape === 'circle' ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Circle className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Circle (360°)' : 'Cerc (360°)'}</span>
            </button>
          </div>

          {/* Color Picker */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-slate-400">{lang === 'en' ? 'Pen Color:' : 'Culoare:'}</span>
            {['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'].map(col => (
              <button
                key={col}
                type="button"
                onClick={() => setPenColor(col)}
                style={{ backgroundColor: col }}
                className={`w-5 h-5 rounded-full transition cursor-pointer ${
                  penColor === col ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stage & Code Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Scratch Pen Blocks script */}
          <div className="md:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block mb-1">
              {lang === 'en' ? 'Pen Algorithm Script:' : 'Scriptul de Desenare:'}
            </span>

            <div className="p-2 rounded bg-amber-500 text-slate-950 font-bold">
              când se dă clic pe 🚩
            </div>
            <div className="p-2 rounded bg-teal-700 text-white">
              șterge tot
            </div>
            <div className="p-2 rounded bg-teal-700 text-white">
              setează culoarea stiloului la [{penColor}]
            </div>
            <div className="p-2 rounded bg-teal-700 text-white">
              stilou jos
            </div>
            <div className="p-2 rounded bg-amber-600 text-white border-l-4 border-amber-400 pl-3">
              {selectedShape === 'square' && (
                <>
                  <div>repetă de (4) ori</div>
                  <div className="pl-4 text-blue-300">mergi 100 pași</div>
                  <div className="pl-4 text-blue-300">rotește-te ↻ 90 grade</div>
                </>
              )}
              {selectedShape === 'triangle' && (
                <>
                  <div>repetă de (3) ori</div>
                  <div className="pl-4 text-blue-300">mergi 100 pași</div>
                  <div className="pl-4 text-blue-300">rotește-te ↻ 120 grade</div>
                </>
              )}
              {selectedShape === 'star' && (
                <>
                  <div>repetă de (5) ori</div>
                  <div className="pl-4 text-blue-300">mergi 100 pași</div>
                  <div className="pl-4 text-blue-300">rotește-te ↻ 144 grade</div>
                </>
              )}
              {selectedShape === 'circle' && (
                <>
                  <div>repetă de (36) ori</div>
                  <div className="pl-4 text-blue-300">mergi 8 pași</div>
                  <div className="pl-4 text-blue-300">rotește-te ↻ 10 grade</div>
                </>
              )}
            </div>
            <div className="p-2 rounded bg-teal-700 text-white">
              stilou sus
            </div>
          </div>

          {/* HTML5 Canvas Stage */}
          <div className="md:col-span-7 flex flex-col items-center">
            <canvas
              ref={canvasRef}
              width={340}
              height={260}
              className="w-full max-w-[340px] aspect-[4/3] bg-slate-950 rounded-xl border border-slate-700 shadow-inner"
            />
            <div className="mt-2 text-xs text-slate-400">
              {lang === 'en' ? 'Live HTML5 Stage Renderer (Pen extension)' : 'Randare grafică în timp real (Extensia Creion)'}
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Quiz */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-400" />
          <span>{lang === 'en' ? 'Geometry & Pen Extension Quiz' : 'Evaluare: Geometrie și Extensia Creion'}</span>
        </h3>

        {/* Question 1 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
            </span>
            <QuestionHint
              hintRo="Pentru a desena un pătrat (poligon cu 4 laturi egale), unghiul exterior de rotație la fiecare colț este 360° / 4 = 90°."
              hintEn="To draw a square (4 equal sides), the turning angle at each corner is 360° / 4 = 90°."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'With what angle must a sprite turn inside the loop "repetă de 4 ori" to draw a perfect square?'
              : 'Cu câte grade trebuie să se rotească personajul în bucla „repetă de 4 ori” pentru a desena un pătrat perfect?'
            }
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'turn_90', ro: '90 de grade (360° / 4 laturi)', en: '90 degrees (360° / 4 sides)' },
              { id: 'turn_45', ro: '45 de grade', en: '45 degrees' },
              { id: 'turn_180', ro: '180 de grade', en: '180 degrees' },
              { id: 'turn_60', ro: '60 de grade', en: '60 degrees' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q1 || 0) > 0}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'turn_90'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-teal-400 text-slate-300'
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
              customMessageRo="Reflecție didactică: Suma unghiurilor exterioare ale oricărui poligon regulat este de 360 de grade!"
              customMessageEn="Pedagogical reflection: The sum of exterior angles of any regular polygon is always 360 degrees!"
            />
          ) : null}
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanationRo="Pentru orice poligon regulat cu N laturi, unghiul de rotație este calculat ca 360° / N (pentru pătrat: 360° / 4 = 90°)."
              explanationEn="For any regular N-sided polygon, the turn angle is 360° / N (for a square: 360° / 4 = 90°)."
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
            </span>
            <QuestionHint
              hintRo="Instrucțiunea care activează lăsarea urmei pe scenă este „stilou jos” (pen down)."
              hintEn="The instruction enabling trace drawing on the stage is 'pen down'."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'Which Scratch Pen block activates drawing so sprite movement leaves a trail on stage?'
              : 'Ce bloc din extensia Creion activează desenarea, astfel încât deplasarea personajului să lase o urmă pe scenă?'
            }
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'pen_down', ro: 'stilou jos (pen down)', en: 'pen down' },
              { id: 'pen_up', ro: 'stilou sus (pen up)', en: 'pen up' },
              { id: 'erase_all', ro: 'șterge tot (erase all)', en: 'erase all' },
              { id: 'stamp', ro: 'ștampilează (stamp)', en: 'stamp' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q2 || 0) > 0}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'pen_down'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-teal-400 text-slate-300'
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
              customMessageRo="Reflecție didactică: „Stilou jos” coboară instrumentul de scris pe hârtia scenei virtuale!"
              customMessageEn="Pedagogical reflection: 'Pen down' places the writing tool onto the virtual stage canvas!"
            />
          ) : null}
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanationRo="„Stilou jos” începe desenarea, în timp ce „stilou sus” permite repoziționarea personajului fără a mai lăsa nicio urmă."
              explanationEn="'Pen down' starts drawing, whereas 'pen up' allows repositioning without leaving lines."
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentPage={7}
        totalPages={7}
        earnedScore={totalScore}
        isCompleted={isPageComplete}
        onNextPage={() => {
          sounds.playStar();
          onCompletePage(totalScore);
        }}
        nextButtonLabelRo="Finalizează Misiunea 6A: Mediul Scratch & Variabile"
        nextButtonLabelEn="Complete Mission 6A: Scratch Environment & Variables"
      />
    </div>
  );
};
