import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Play,
  RotateCcw,
  TreePine,
  Flower2,
  GitFork,
  Sliders
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { useQuestionCooldowns, PedagogicalReflectionBanner } from '../../../utils/pedagogicalGrading';

interface Level6Props {
  onCompletePage: (earnedScore: number) => void;
}

interface Branch {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  depth: number;
}

export const ScratchAlgo2_Level6_FractalsAndTreeOfLife: React.FC<Level6Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  // Fractal state
  const [recursionDepth, setRecursionDepth] = useState<number>(3); // 1 to 5
  const [branchAngle, setBranchAngle] = useState<number>(25); // degrees
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [visibleBranchesCount, setVisibleBranchesCount] = useState<number>(0);

  // Quizzes with 5-second cooldown
  const [qFractalProperty, setQFractalProperty] = useState<string | null>(null);
  const [qMyBlocks, setQMyBlocks] = useState<string | null>(null);
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  // Compute branches recursively
  const computeFractalTree = (depth: number, angleDeg: number): Branch[] => {
    const branches: Branch[] = [];
    const rad = (angleDeg * Math.PI) / 180;

    const buildBranch = (x: number, y: number, len: number, angle: number, curDepth: number) => {
      if (curDepth > depth || len < 6) return;
      const x2 = x + len * Math.sin(angle);
      const y2 = y - len * Math.cos(angle);

      branches.push({ x1: x, y1: y, x2, y2, depth: curDepth });

      // Left branch
      buildBranch(x2, y2, len * 0.72, angle - rad, curDepth + 1);
      // Right branch
      buildBranch(x2, y2, len * 0.72, angle + rad, curDepth + 1);
    };

    buildBranch(160, 260, 65, 0, 1);
    return branches;
  };

  const allBranches = computeFractalTree(recursionDepth, branchAngle);

  const startTreeGeneration = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setVisibleBranchesCount(0);
    sounds.playClick();

    let count = 0;
    const total = allBranches.length;
    const interval = setInterval(() => {
      count = Math.min(total, count + Math.max(1, Math.floor(total / 18)));
      setVisibleBranchesCount(count);
      sounds.playPop();

      if (count >= total) {
        clearInterval(interval);
        setIsGenerating(false);
        sounds.playCorrect();
      }
    }, 70);
  };

  const resetTree = () => {
    setIsGenerating(false);
    setVisibleBranchesCount(allBranches.length);
    sounds.playClick();
  };

  const handlePropertyQuiz = (val: string) => {
    if (isLocked('qProperty') || qFractalProperty === 'self_similarity') return;
    setQFractalProperty(val);
    if (val === 'self_similarity') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('qProperty', 5);
    }
  };

  const handleMyBlocksQuiz = (val: string) => {
    if (isLocked('qMyBlocks') || qMyBlocks === 'custom_procedures') return;
    setQMyBlocks(val);
    if (val === 'custom_procedures') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('qMyBlocks', 5);
    }
  };

  const isFormValid = qFractalProperty === 'self_similarity' && qMyBlocks === 'custom_procedures';

  // Render branches up to visibleBranchesCount
  const displayedBranches = isGenerating
    ? allBranches.slice(0, visibleBranchesCount)
    : allBranches;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                {isEn ? 'Unit 4 • Lessons 6–7 (Textbook pp. 89–91)' : 'Unitatea 4 • Lecțiile 6–7 (Manual pag. 89–91)'}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold">
                {isEn ? 'Page 6 of 7' : 'Pagina 6 din 7'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              {isEn ? 'Fractals in Scratch & Custom Procedures (My Blocks)' : 'Fractali în Scratch & Proceduri cu Blocuri Proprii (My Blocks)'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {isEn
                ? 'Explore the breathtaking mathematics of self-similarity and recursive branching! Build custom blocks with parameters in Scratch and generate living fractal trees, ferns, and biological flowers.'
                : 'Pătrunde în universul fascinant al fractalilor și al auto-similarității matematice! Învață să construiești blocuri proprii cu parametri numerici („My Blocks”) pentru a desena arbori recursivi și flori biologice!'}
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/40 flex items-center justify-center text-3xl shadow-inner shrink-0">
            🌿
          </div>
        </div>
      </div>

      {/* Interactive Fractal Tree Generator */}
      <div className="bg-slate-900/90 border-2 border-emerald-500/30 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <TreePine className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base sm:text-lg">
              {isEn ? 'Interactive Lab: Recursive Fractal Tree Generator' : 'Laborator Interactiv: Arbore Fractal Recursiv'}
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
            Ramuri totale: <span className="font-bold text-white">{allBranches.length}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fractal SVG Viewport */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 h-80 flex items-center justify-center relative overflow-hidden">
            <svg width="320" height="280" viewBox="0 0 320 280" className="overflow-visible">
              {/* Ground line */}
              <line x1="20" y1="260" x2="300" y2="260" stroke="#1e293b" strokeWidth="3" />
              {/* Branches */}
              {displayedBranches.map((br, idx) => {
                const strokeColor =
                  br.depth === 1
                    ? '#92400e' // trunk brown
                    : br.depth === 2
                    ? '#b45309'
                    : br.depth === 3
                    ? '#15803d' // green
                    : br.depth === 4
                    ? '#22c55e'
                    : '#86efac';
                const strokeWidth = Math.max(1.5, 6 - br.depth);

                return (
                  <line
                    key={idx}
                    x1={br.x1}
                    y1={br.y1}
                    x2={br.x2}
                    y2={br.y2}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>

            <div className="absolute bottom-3 right-3 flex gap-2">
              <button
                type="button"
                disabled={isGenerating}
                onClick={startTreeGeneration}
                className="py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1 shadow-md"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isEn ? 'Grow Tree' : 'Crește Arborele'}</span>
              </button>
              <button
                type="button"
                disabled={isGenerating}
                onClick={resetTree}
                className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Controls & My Blocks Scratch Script */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3 font-mono text-xs">
            {/* Sliders */}
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>{isEn ? 'Recursion Depth (Level):' : 'Nivel de Recursivitate (Adâncime):'}</span>
                  <span className="text-emerald-400 font-bold">{recursionDepth}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={recursionDepth}
                  onChange={(e) => {
                    setRecursionDepth(Number(e.target.value));
                    sounds.playClick();
                  }}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>{isEn ? 'Branch Angle (Degrees):' : 'Unghi Ramificație (Grade):'}</span>
                  <span className="text-emerald-400 font-bold">{branchAngle}°</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="45"
                  value={branchAngle}
                  onChange={(e) => {
                    setBranchAngle(Number(e.target.value));
                    sounds.playPop();
                  }}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            {/* My Blocks Recipe */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1 text-slate-300 font-mono text-[11px]">
              <div className="text-pink-400 font-bold">
                definește [Arbore (lungime)]
              </div>
              <div className="pl-3 border-l-2 border-pink-500 space-y-0.5">
                <div>dacă &lt; (lungime) &gt; (10) &gt; atunci:</div>
                <div className="pl-3 border-l border-slate-700">
                  <div className="text-cyan-300">mergi (lungime) pași</div>
                  <div className="text-amber-300">rotește ↺ stânga cu ({branchAngle}) grade</div>
                  <div className="text-pink-300 font-bold">Arbore ((lungime) * 0.7)</div>
                  <div className="text-amber-300">rotește ↻ dreapta cu ({branchAngle * 2}) grade</div>
                  <div className="text-pink-300 font-bold">Arbore ((lungime) * 0.7)</div>
                  <div className="text-amber-300">rotește ↺ stânga cu ({branchAngle}) grade</div>
                  <div className="text-cyan-300">mergi (-lungime) pași</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Biological Simulation Info Card: Flowers at Sunset */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
        <div className="flex items-center gap-2.5 text-pink-400">
          <Flower2 className="w-5 h-5" />
          <h3 className="font-bold text-white text-base">
            {isEn ? 'Biological Simulation: Flowers Closing at Sunset (p. 91)' : 'Simularea Biologică: Închiderea Florilor la Apus (Manual pag. 91)'}
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {isEn
            ? 'In Chapter 4 Lesson 7, students model natural plant rhythms (nyctinasty). By nesting loops that gradually decrease petal angle and clone size, the digital flower gracefully closes when the background switches from sunny sky to dusk.'
            : 'În Unitatea 4 Lecția 7, manualul propune simularea nictinastiei (mișcarea biologică a petalelor la căderea serii). Printr-o buclă care micșorează unghiul de deschidere și scade luminozitatea efectului grafic, floarea desenată procedural își strânge petalele la apusul soarelui!'}
        </p>
      </div>

      {/* Formative Quizzes */}
      <div className="space-y-4">
        {/* Q1 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">
                {isEn
                  ? '1. What is the fundamental property of a mathematical fractal?'
                  : '1. Care este proprietatea fundamentală a unui fractal matematic (descoperit de Benoit Mandelbrot)?'}
              </h3>
            </div>
            <QuestionHint hint={isEn ? 'Each small branch looks identical to the whole tree!' : 'Fiecare ramură mică seamănă perfect cu întregul arbore!'} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              { id: 'self_similarity', label: 'Auto-similaritatea (părțile sunt similare cu întregul la orice scară)', isCorrect: true },
              { id: 'perfect_circle', label: 'Are întotdeauna forma unui cerc geometric perfect', isCorrect: false },
              { id: 'no_math', label: 'Nu are nicio legătură cu matematica sau natura', isCorrect: false }
            ].map((opt) => {
              const isSelected = qFractalProperty === opt.id;
              let style = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (qFractalProperty) {
                if (opt.isCorrect) style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                else if (isSelected) style = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={opt.id}
                  disabled={isLocked('qProperty') || qFractalProperty === 'self_similarity'}
                  onClick={() => handlePropertyQuiz(opt.id)}
                  className={`p-3.5 rounded-xl border font-bold text-xs sm:text-sm text-left transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-between gap-2 ${style}`}
                >
                  <span>{opt.label}</span>
                  {qFractalProperty && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {qFractalProperty && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {cooldowns.qProperty && cooldowns.qProperty > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.qProperty}
              totalSeconds={5}
              customMessageRo="Timp de reflecție: Fractalele prezintă auto-similaritate — fiecare ramură reproduce structura întregului arbore!"
              customMessageEn="Reflection buffer: Fractals exhibit self-similarity — every branch replicates the whole tree structure!"
            />
          ) : null}

          {qFractalProperty && (
            <AnswerExplanation
              isCorrect={qFractalProperty === 'self_similarity'}
              explanation={
                isEn
                  ? 'Correct! Self-similarity means zooming into any branch reveals a replica of the full tree structure, precisely what recursion codes!'
                  : 'Corect! Auto-similaritatea înseamnă că dacă mărești o singură creangă sau frunză de ferigă, vei descoperi o copie în miniatură a întregului copac!'
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
                  ? '2. What is the role of the "My Blocks" (Blocuri Proprii) category in Scratch?'
                  : '2. Care este rolul categoriei roșii „Blocurile mele” (My Blocks) în Scratch?'}
              </h3>
            </div>
            <QuestionHint hint={isEn ? 'Allows defining reusable functions and procedures with parameters!' : 'Permite crearea propriilor proceduri și subprograme cu parametri!'} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              { id: 'custom_procedures', label: 'Crearea de proceduri și funcții proprii reutilizabile cu parametri', isCorrect: true },
              { id: 'download_games', label: 'Descărcarea de jocuri complete de pe internet', isCorrect: false },
              { id: 'delete_code', label: 'Ștergerea ireversibilă a proiectului curent', isCorrect: false }
            ].map((opt) => {
              const isSelected = qMyBlocks === opt.id;
              let style = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (qMyBlocks) {
                if (opt.isCorrect) style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                else if (isSelected) style = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={opt.id}
                  disabled={isLocked('qMyBlocks') || qMyBlocks === 'custom_procedures'}
                  onClick={() => handleMyBlocksQuiz(opt.id)}
                  className={`p-3.5 rounded-xl border font-bold text-xs sm:text-sm text-left transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-between gap-2 ${style}`}
                >
                  <span>{opt.label}</span>
                  {qMyBlocks && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {qMyBlocks && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {cooldowns.qMyBlocks && cooldowns.qMyBlocks > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.qMyBlocks}
              totalSeconds={5}
              customMessageRo="Timp de reflecție: 'Blocurile mele' permit modularizarea codului în funcții și proceduri reutilizabile!"
              customMessageEn="Reflection buffer: 'My Blocks' allow modularizing code into reusable functions and procedures!"
            />
          ) : null}

          {qMyBlocks && (
            <AnswerExplanation
              isCorrect={qMyBlocks === 'custom_procedures'}
              explanation={
                isEn
                  ? 'Correct! My Blocks encapsulates repeated algorithms into clean, named subprograms that take inputs (numbers, texts, booleans).'
                  : 'Corect! Categoria „Blocurile mele” permite modularizarea codului în subprograme și funcții clare care acceptă parametri de intrare, exact ca în limbajele de programare profesionale!'
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
        nextLabel={isEn ? 'Next: Final Middle School Exam & Diploma (p. 92–93) →' : 'Următorul: Marea Evaluare Finală & Diploma de Absolvire (pag. 92–93) →'}
      />
    </div>
  );
};
