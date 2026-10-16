import React, { useState, useEffect } from 'react';
import {
  Film,
  Play,
  Pause,
  RotateCcw,
  Gauge,
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Zap,
  ArrowRight,
  Eye,
  Sliders,
  Layers
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { useQuestionCooldowns, PedagogicalReflectionBanner } from '../../../utils/pedagogicalGrading';

interface Level1Props {
  onCompletePage: (earnedScore: number) => void;
}

export const AnimVRLevel1_FPSAndAnimationSecrets: React.FC<Level1Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  // Interactive FPS Simulator state
  const [fps, setFps] = useState<number>(24);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [animProgress, setAnimProgress] = useState<number>(0); // 0 to 100%

  // Story duration calculator state
  const [calcSeconds, setCalcSeconds] = useState<number>(10);

  // Quiz questions state
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [q3, setQ3] = useState<string | null>(null);
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  // Interactive simulator loop
  useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = Math.round(1000 / fps);
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % 60);
      setAnimProgress((prev) => (prev >= 100 ? 0 : prev + (100 / (fps * 2)))); // 2 seconds per cycle
    }, intervalMs);

    return () => clearInterval(interval);
  }, [fps, isPlaying]);

  const frameTimeMs = (1000 / fps).toFixed(1);
  const totalCalculatedFrames = calcSeconds * fps;

  const handleFpsChange = (newFps: number) => {
    setFps(newFps);
    sounds.playPop();
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
    sounds.playClick();
  };

  const handleQ1 = (val: string) => {
    if (isLocked('q1')) return;
    setQ1(val);
    if (val === '24') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1', 5);
    }
  };

  const handleQ2 = (val: string) => {
    if (isLocked('q2')) return;
    setQ2(val);
    if (val === 'persistence') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2', 5);
    }
  };

  const handleQ3 = (val: string) => {
    if (isLocked('q3')) return;
    setQ3(val);
    if (val === '240') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3', 5);
    }
  };

  const allCorrect = q1 === '24' && q2 === 'persistence' && q3 === '240';

  const handleContinue = () => {
    if (!allCorrect) return;
    sounds.playLevelUp();
    onCompletePage(15);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900/60 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold tracking-wider uppercase">
                {isEn ? 'Unit 2B • Lesson 3' : 'Unitatea 2B • Lecția 3'}
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-bold">
                Manual pag. 34–36
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-heading tracking-tight mb-2">
              {isEn ? 'The Secrets of Animation & The FPS Principle' : 'Secretele Animației & Principiul FPS'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {isEn
                ? 'Discover how static drawings transform into fluid movement through persistence of vision and frame rates (FPS).'
                : 'Descoperă cum desenele statice prind viață prin iluzia optică a persistenței retiniene și rata de cadre pe secundă (FPS - Frames Per Second).'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
              <Film className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Theory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Ce este animația */}
        <div className="bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                🎬
              </div>
              <h3 className="font-bold text-white text-base">
                {isEn ? 'What is Animation?' : 'Ce este Animația?'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
              {isEn
                ? 'From the Latin "animare" (to give life). It is the rapid succession of individual static images (frames) showing slight position changes.'
                : 'Provine din latinescul „animare” (a da viață). Este succesiunea rapidă de imagini statice individuale (cadre), fiecare prezentând o mică deplasare sau schimbare de formă.'}
            </p>
          </div>
          <div className="bg-purple-950/40 border border-purple-800/40 rounded-xl p-2.5 text-[11px] text-purple-300 font-mono">
            💡 {isEn ? 'Stop-motion, 2D cartoon, 3D digital' : 'Stop-motion, desene 2D, animație digitală 3D'}
          </div>
        </div>

        {/* Card 2: Persistenta retiniana */}
        <div className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">
                {isEn ? 'Persistence of Vision' : 'Persistența Retiniană'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
              {isEn
                ? 'The human eye retains an image on the retina for approx. 1/16th of a second. When images alternate faster than this threshold, the brain perceives continuous motion!'
                : 'Ochiul uman păstrează o imagine pe retină timp de circa 1/16 dintr-o secundă după ce a dispărut. Dacă imaginile se succed mai rapid, creierul le contopește într-o mișcare fluidă continuă.'}
            </p>
          </div>
          <div className="bg-indigo-950/40 border border-indigo-800/40 rounded-xl p-2.5 text-[11px] text-indigo-300 font-mono">
            🧠 {isEn ? 'The biological secret of cinema' : 'Secretul biologic care face cinematografia posibilă'}
          </div>
        </div>

        {/* Card 3: Standardele FPS */}
        <div className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Gauge className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">
                {isEn ? 'FPS Standards' : 'Standardele FPS de Aur'}
              </h3>
            </div>
            <ul className="text-xs sm:text-sm text-slate-300 space-y-1.5 mb-3 leading-relaxed">
              <li>• <b className="text-amber-400">12 FPS</b>: Animație clasică („pe două cadre”).</li>
              <li>• <b className="text-emerald-400">24 FPS</b>: Standardul cinematografic de aur din 1927.</li>
              <li>• <b className="text-cyan-400">30 / 60 FPS</b>: Video digital pe internet și jocuri video.</li>
            </ul>
          </div>
          <div className="bg-amber-950/40 border border-amber-800/40 rounded-xl p-2.5 text-[11px] text-amber-300 font-mono">
            ⏱️ 24 FPS = 41.6 milisecunde / cadru
          </div>
        </div>
      </div>

      {/* Interactive FPS Motion Simulator */}
      <div className="bg-slate-900 border-2 border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center text-xl">
              🚀
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
                {isEn ? 'Interactive FPS Flight Simulator' : 'Simulatorul Interactiv de Fluiditate FPS'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {isEn
                  ? 'Switch between frame rates to observe how fluid Arky travels across the stage.'
                  : 'Schimbă numărul de cadre pe secundă și observă diferența de fluiditate a zborului lui Arky.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={handleTogglePlay}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? (isEn ? 'Pause Motion' : 'Pauză Mișcare') : (isEn ? 'Resume' : 'Continuă')}
            </button>
          </div>
        </div>

        {/* The Animated Stage */}
        <div className="relative h-44 sm:h-52 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between p-4">
          {/* Background grid representing film strip */}
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          {/* Film perforations top & bottom */}
          <div className="flex justify-between w-full opacity-30 pointer-events-none">
            {[...Array(14)].map((_, i) => (
              <div key={i} className="w-3 h-2 bg-slate-700 rounded-sm" />
            ))}
          </div>

          {/* Animated Sprite Track */}
          <div className="relative w-full h-20 my-auto flex items-center">
            {/* Guide line */}
            <div className="absolute inset-x-0 h-0.5 bg-slate-800 border-t border-dashed border-purple-500/30" />

            {/* Arky sprite position based on progress */}
            <div
              className="absolute transition-all duration-75 flex flex-col items-center"
              style={{ left: `calc(${animProgress}% - 30px)` }}
            >
              <div className="relative group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 border-2 border-white/80 shadow-xl flex items-center justify-center text-3xl transform hover:scale-110 transition-transform">
                  🤖
                </div>
                {/* Propeller or jet exhaust */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-0.5">
                  <span className="w-2 h-3 bg-amber-400 rounded-full animate-ping" />
                  <span className="w-3 h-4 bg-orange-500 rounded-full animate-pulse" />
                </div>
              </div>
              <span className="text-[10px] font-mono text-purple-300 font-bold mt-1 bg-slate-900/80 px-2 py-0.5 rounded-full border border-purple-500/30">
                Arky 3D
              </span>
            </div>
          </div>

          {/* Film perforations bottom */}
          <div className="flex justify-between w-full opacity-30 pointer-events-none">
            {[...Array(14)].map((_, i) => (
              <div key={i} className="w-3 h-2 bg-slate-700 rounded-sm" />
            ))}
          </div>
        </div>

        {/* FPS Control Buttons */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 font-bold uppercase">
              {isEn ? 'Select Frame Rate (FPS):' : 'Alege Rata de Cadre (FPS):'}
            </span>
            <span className="text-purple-300 font-bold">
              {fps} FPS ({frameTimeMs} ms {isEn ? 'per frame' : 'pe cadru'})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { val: 2, label: '2 FPS (Sacadat extrem)', desc: '500 ms/cadru' },
              { val: 8, label: '8 FPS (Stop-Motion)', desc: '125 ms/cadru' },
              { val: 12, label: '12 FPS (Desene Clasice)', desc: '83.3 ms/cadru' },
              { val: 24, label: '24 FPS (Cinema De Aur)', desc: '41.6 ms/cadru' },
              { val: 60, label: '60 FPS (Ultra Fluid)', desc: '16.6 ms/cadru' }
            ].map((item) => (
              <button
                key={item.val}
                onClick={() => handleFpsChange(item.val)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  fps === item.val
                    ? 'bg-purple-600/30 border-purple-400 text-white shadow-lg ring-2 ring-purple-500/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="text-sm font-black font-mono flex items-center justify-between">
                  <span>{item.val} FPS</span>
                  {fps === item.val && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                </div>
                <div className="text-[11px] font-semibold text-slate-400 mt-1 truncate">
                  {item.label}
                </div>
                <div className="text-[10px] font-mono text-purple-300 mt-0.5">
                  {item.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Calculation Tool */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              {isEn ? 'Animation Frame Calculator' : 'Calculator de Cadre Desenate'}
            </h4>
            <p className="text-xs text-slate-400">
              {isEn
                ? 'How many frames does a director need to draw for a scene?'
                : 'Câte desene/cadre trebuie să genereze un regizor pentru o scenă de animație?'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl">
              <span className="text-xs text-slate-400 font-mono">{isEn ? 'Duration:' : 'Durată:'}</span>
              <select
                value={calcSeconds}
                onChange={(e) => {
                  setCalcSeconds(Number(e.target.value));
                  sounds.playPop();
                }}
                className="bg-transparent text-white font-mono font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value={5} className="bg-slate-900">5 secunde</option>
                <option value={10} className="bg-slate-900">10 secunde</option>
                <option value={30} className="bg-slate-900">30 secunde</option>
                <option value={60} className="bg-slate-900">1 minut (60s)</option>
              </select>
            </div>

            <div className="text-right">
              <div className="text-xs font-mono text-slate-400">Total cadre necesare:</div>
              <div className="text-lg font-black font-mono text-amber-400">
                {totalCalculatedFrames} cadre ({calcSeconds}s × {fps} FPS)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Evaluation Quiz */}
      <div className="bg-slate-900/90 border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xl">
            ✍️
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              {isEn ? 'Laboratory Verification (3 Questions)' : 'Verificare de Laborator (3 Întrebări)'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {isEn
                ? 'Demonstrate your understanding of animation mechanics and cinema standards to unlock Level 2.'
                : 'Rezolvă cele 3 întrebări din programa clasei a VI-a pentru a obține primele 15 XP și a trece la Nivelul 2.'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Question 1 */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-mono">1</span>
                {isEn
                  ? 'What is the worldwide cinema gold standard for frame rate per second?'
                  : 'Care este standardul mondial de aur utilizat în cinematografie pentru numărul de cadre pe secundă?'}
              </h3>
              <QuestionHint
                hintRo="Gândește-te la numărul consacrat încă din anul 1927 odată cu introducerea sunetului în film. Este dublul lui 12!"
                hintEn="Think of the number established in 1927 with sound cinema. It is twice 12!"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: '12', label: '12 FPS (Numai benzi desenate)' },
                { id: '24', label: '24 FPS (Standardul cinematografic de aur)' },
                { id: '120', label: '120 FPS (Standard pentru ecrane TV vechi)' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  disabled={isLocked('q1')}
                  onClick={() => handleQ1(opt.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    q1 === opt.id
                      ? opt.id === '24'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                        : 'bg-rose-500/20 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.label}</span>
                    {q1 === opt.id && (opt.id === '24' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />)}
                  </div>
                </button>
              ))}
            </div>

            {cooldowns.q1 && cooldowns.q1 > 0 ? (
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q1}
                totalSeconds={5}
                customMessageRo="Reflecție didactică: Gândește-te la standardul clasic de 24 de cadre pe secundă al cinematografiei!"
                customMessageEn="Pedagogical reflection: Think about cinema's 24 frames per second benchmark!"
              />
            ) : null}

            {q1 && (
              <AnswerExplanation
                isCorrect={q1 === '24'}
                explanationRo="Corect! 24 FPS a devenit standardul internațional odată cu introducerea sunetului optic sincronizat pe peliculă în 1927, oferind fluiditate naturală optimă la costuri fezabile de producție."
                explanationEn="Correct! 24 FPS became the global standard with synchronized optical sound in 1927, offering ideal natural fluidity at feasible production costs."
              />
            )}
          </div>

          {/* Question 2 */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-mono">2</span>
                {isEn
                  ? 'What biological optical phenomenon allows human vision to see smooth movement instead of flashes?'
                  : 'Ce fenomen optic biologic permite ochilor și creierului uman să perceapă mișcare fluidă în loc de imagini statice sacadate?'}
              </h3>
              <QuestionHint
                hintRo="Imaginea persistă pe retină pentru aproximativ 1/16 dintr-o secundă după dispariția stimulului luminos."
                hintEn="The image persists on the retina for about 1/16th of a second after the light stimulus disappears."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'persistence', label: 'Persistența retiniană (ochiul păstrează imaginea ~1/16 secunde)' },
                { id: 'myopia', label: 'Miopia nocturnă temporară' },
                { id: 'refraction', label: 'Refracția luminii în corpul vitros' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  disabled={isLocked('q2')}
                  onClick={() => handleQ2(opt.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    q2 === opt.id
                      ? opt.id === 'persistence'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                        : 'bg-rose-500/20 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.label}</span>
                    {q2 === opt.id && (opt.id === 'persistence' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />)}
                  </div>
                </button>
              ))}
            </div>

            {cooldowns.q2 && cooldowns.q2 > 0 ? (
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q2}
                totalSeconds={5}
                customMessageRo="Reflecție didactică: Retina ochiului reține imaginea timp de o fracțiune de secundă (persistență retiniană)!"
                customMessageEn="Pedagogical reflection: The retina retains visual stimulus briefly (retinal persistence)!"
              />
            ) : null}

            {q2 && (
              <AnswerExplanation
                isCorrect={q2 === 'persistence'}
                explanationRo="Exact! Persistența retiniană face ca ochiul să nu sesizeze pauza neagră dintre cadre, creierul unificând imaginile într-o mișcare continuă."
                explanationEn="Exactly! Persistence of vision causes the eye not to notice the gap between frames, allowing the brain to merge them into continuous motion."
              />
            )}
          </div>

          {/* Question 3 */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-mono">3</span>
                {isEn
                  ? 'Calculation: An animator prepares an intro sequence of exactly 10 seconds at 24 FPS. How many total frames are rendered?'
                  : 'Calcul practic: Un animator realizează un intro animat de fix 10 secunde la standardul de 24 FPS. Câte cadre individuale trebuie să conțină fișierul video?'}
              </h3>
              <QuestionHint
                hintRo="Înmulțește durata în secunde (10) cu numărul de cadre pe fiecare secundă (24): 10 × 24 = ?"
                hintEn="Multiply the duration in seconds (10) by the number of frames each second (24): 10 × 24 = ?"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: '24', label: '24 de cadre (câte unul pe fiecare minut)' },
                { id: '240', label: '240 de cadre (10 secunde × 24 cadre/secundă)' },
                { id: '100', label: '100 de cadre (10 secunde × 10 cadre)' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  disabled={isLocked('q3')}
                  onClick={() => handleQ3(opt.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    q3 === opt.id
                      ? opt.id === '240'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                        : 'bg-rose-500/20 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.label}</span>
                    {q3 === opt.id && (opt.id === '240' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />)}
                  </div>
                </button>
              ))}
            </div>

            {cooldowns.q3 && cooldowns.q3 > 0 ? (
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q3}
                totalSeconds={5}
                customMessageRo="Reflecție didactică: Înmulțește 10 secunde cu cele 24 de cadre ale fiecărei secunde!"
                customMessageEn="Pedagogical reflection: Multiply 10 seconds by 24 frames per second!"
              />
            ) : null}

            {q3 && (
              <AnswerExplanation
                isCorrect={q3 === '240'}
                explanationRo="Excelent! 10 secunde × 24 cadre/secundă = 240 de cadre unice pe care aplicația sau animatorul le compilează în fișierul video."
                explanationEn="Excellent! 10 seconds × 24 fps = 240 unique frames compiled into the video file."
              />
            )}
          </div>
        </div>

        {/* Level Complete Action */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 font-mono">
            {allCorrect ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {isEn ? 'All answers correct! You earned 15 XP.' : 'Toate răspunsurile sunt corecte! Ai obținut 15 XP.'}
              </span>
            ) : (
              <span>{isEn ? 'Answer all 3 questions correctly to advance.' : 'Răspunde corect la toate cele 3 întrebări pentru a debloca Nivelul 2.'}</span>
            )}
          </div>

          <button
            onClick={handleContinue}
            disabled={!allCorrect}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-sm font-heading flex items-center justify-center gap-2 transition-all ${
              allCorrect
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/30 cursor-pointer scale-105'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <span>{isEn ? 'Advance to Level 2: Story Arc & Toontastic' : 'Treci la Nivelul 2: Arcul Narativ & Toontastic'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
