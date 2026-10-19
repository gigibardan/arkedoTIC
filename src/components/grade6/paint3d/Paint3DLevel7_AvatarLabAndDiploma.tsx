import React, { useState } from 'react';
import { 
  Award, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Printer, 
  RotateCcw, 
  Star, 
  Check, 
  Box, 
  Smile, 
  Wand2, 
  Download,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns, computeGradeDetails } from '../../../utils/pedagogicalGrading';

interface Paint3DLevel7Props {
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const Paint3DLevel7_AvatarLabAndDiploma: React.FC<Paint3DLevel7Props> = ({
  onCompletePage,
  studentName = 'Elev Creator 3D',
  onRestartMission,
  onReturnToCatalog
}) => {
  const { lang } = useLanguage();

  // Practical Avatar Lab Checklist
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    step1: true
  });

  // 3D Avatar Customizer State
  const [avatarName, setAvatarName] = useState<string>('Robo-Titan 3D');
  const [headShape, setHeadShape] = useState<'cube' | 'sphere' | 'cylinder'>('cube');
  const [bodyColor, setBodyColor] = useState<string>('#06b6d4');
  const [materialFinish, setMaterialFinish] = useState<'metal_gloss' | 'metal_matte' | 'gloss' | 'matte'>('metal_gloss');
  const [chestBadge, setChestBadge] = useState<'arc_reactor' | 'cyber_shield' | 'gear' | 'atom' | 'tic_logo'>('arc_reactor');
  const [eyeStyle, setEyeStyle] = useState<'laser_visor' | 'dual_led' | 'vr_headset'>('laser_visor');
  const [isRotating, setIsRotating] = useState<boolean>(true);

  // Synthesis Quiz Answers
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const [hasCelebrated, setHasCelebrated] = useState<boolean>(false);

  const handleToggleStep = (stepId: string) => {
    sounds.playRetro('coin');
    setCompletedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const handleAnswerQ1 = (val: string) => {
    if (isLocked('q1')) return;
    setQ1Answer(val);
    if (val === 'xyz_axes') sounds.playCorrect();
    else {
      sounds.playWrong();
      triggerCooldown('q1', 5);
    }
  };

  const handleAnswerQ2 = (val: string) => {
    if (isLocked('q2')) return;
    setQ2Answer(val);
    if (val === 'make_3d') sounds.playCorrect();
    else {
      sounds.playWrong();
      triggerCooldown('q2', 5);
    }
  };

  const handleAnswerQ3 = (val: string) => {
    if (isLocked('q3')) return;
    setQ3Answer(val);
    if (val === 'left_anchor') sounds.playCorrect();
    else {
      sounds.playWrong();
      triggerCooldown('q3', 5);
    }
  };

  const isQ1Correct = q1Answer === 'xyz_axes';
  const isQ2Correct = q2Answer === 'make_3d';
  const isQ3Correct = q3Answer === 'left_anchor';

  const stepsCount = Object.values(completedSteps).filter(Boolean).length;
  const correctCount = [isQ1Correct, isQ2Correct, isQ3Correct].filter(Boolean).length;
  const allStepsDone = stepsCount >= 4;
  const allQuizzesCorrect = isQ1Correct && isQ2Correct && isQ3Correct;
  const isGraduated = allStepsDone && allQuizzesCorrect;

  const earnedScore = Math.min(100, Math.round((stepsCount / 4) * 40 + (correctCount / 3) * 60));
  const gradeDetails = computeGradeDetails(earnedScore, 100);

  // Trigger celebration confetti
  React.useEffect(() => {
    if (isGraduated && !hasCelebrated) {
      setHasCelebrated(true);
      sounds.playVictory();
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback
      }
    }
  }, [isGraduated, hasCelebrated]);

  const handleFinalizeMission = () => {
    sounds.playVictory();
    onCompletePage(earnedScore);
  };

  const handleDownloadProject = () => {
    sounds.playRetro('powerup');
    const projectData = {
      projectType: 'Paint3D_Avatar_Project',
      unit: 'Clasa a VI-a • Unitatea 2A',
      studentName,
      avatarName,
      specifications: {
        headShape,
        bodyColor,
        materialFinish,
        chestBadge,
        eyeStyle,
        coordinates: { x: 0, y: 120, z: -40 },
        dimensions: { width: 180, height: 260, depth: 150 },
      },
      exportFormat: '.GLB / Paint 3D Native',
      gradeDetails,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Proiect_3D_${avatarName.replace(/\s+/g, '_')}_${studentName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-2 border-cyan-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-3xl shadow-inner shrink-0">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-[11px] font-mono font-bold text-cyan-300 uppercase">
                  {lang === 'en' ? 'Unit 2 • Practical Lab & Final Exam (p. 33)' : 'Unitatea 2 • Atelier Practic & Marea Evaluare (pag. 33)'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {lang === 'en' ? 'Screen 7/7 • Graduation' : 'Ecranul 7/7 • Absolvire'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {lang === 'en' 
                  ? '3D Avatar Robot Lab & Unit 2A Junior 3D Creator Diploma' 
                  : 'Atelierul Practic „Avatar Robot 3D” & Marea Diplomă de Creator 3D'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-mono text-cyan-300">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>{lang === 'en' ? '3D Modeler Certified' : 'Modelator 3D Certificat'}</span>
          </div>
        </div>
      </div>

      {/* 3D Avatar Robot Studio & Customizer */}
      <div className="bg-gradient-to-br from-slate-900 via-cyan-950/30 to-slate-900 border-2 border-cyan-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xl shadow-inner font-bold">
              🎨
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white font-heading">
                {lang === 'en' ? 'Interactive 3D Avatar Modeler Studio' : 'Atelierul Interactiv de Personalizare a Robotului 3D'}
              </h2>
              <p className="text-xs text-slate-300">
                {lang === 'en'
                  ? 'Customize the robot geometry, metallic texture, chest sticker, and test 360° turntable rotation.'
                  : 'Configurează geometria 3D, finisajul metalic, stickerul de pe piept și testează rotația la 360°.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadProject}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>{lang === 'en' ? 'Download 3D Blueprint (.json)' : 'Descarcă Proiectul 3D (.json)'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsRotating(prev => !prev)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer border ${
                isRotating
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
              <span>360°</span>
            </button>
          </div>
        </div>

        {/* Studio Grid: Robot Preview + Customization Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* 3D Visual Robot Stage */}
          <div className="lg:col-span-5 bg-slate-950/90 border-2 border-cyan-500/30 rounded-3xl p-6 relative flex flex-col items-center justify-center min-h-[320px] shadow-inner overflow-hidden">
            {/* Grid Floor Perspective */}
            <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
            <div className="absolute bottom-6 w-48 h-10 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />

            {/* SVG 3D Robot Figure */}
            <div className={`relative transition-transform duration-700 ${isRotating ? 'animate-bounce' : ''}`} style={{ animationDuration: '3s' }}>
              <svg width="200" height="230" viewBox="0 0 200 230" className="drop-shadow-2xl">
                <defs>
                  {/* Body Gradient based on material finish */}
                  <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity={materialFinish.includes('gloss') ? 0.45 : 0.15} />
                    <stop offset="40%" stopColor={bodyColor} />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity={materialFinish.includes('metal') ? 0.7 : 0.9} />
                  </linearGradient>

                  <linearGradient id="metalSheen" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="white" stopOpacity={materialFinish.includes('metal') ? 0.4 : 0.15} />
                    <stop offset="100%" stopColor="white" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Soft ground shadow */}
                <ellipse cx="100" cy="220" rx="60" ry="8" fill="#000000" opacity="0.4" />

                {/* Antenna */}
                <line x1="100" y1="40" x2="100" y2="18" stroke={bodyColor} strokeWidth="3" strokeLinecap="round" />
                <circle cx="100" cy="15" r="5" fill="#f59e0b" className="animate-pulse" />

                {/* Head Shape */}
                {headShape === 'cube' && (
                  <rect x="70" y="38" width="60" height="48" rx="8" fill="url(#bodyGrad)" stroke="#38bdf8" strokeWidth="2" />
                )}
                {headShape === 'sphere' && (
                  <circle cx="100" cy="60" r="28" fill="url(#bodyGrad)" stroke="#38bdf8" strokeWidth="2" />
                )}
                {headShape === 'cylinder' && (
                  <rect x="74" y="38" width="52" height="50" rx="16" fill="url(#bodyGrad)" stroke="#38bdf8" strokeWidth="2" />
                )}

                {/* Neck connector */}
                <rect x="94" y="86" width="12" height="8" rx="2" fill="#475569" />

                {/* Torso / Body */}
                <rect x="62" y="94" width="76" height="80" rx="14" fill="url(#bodyGrad)" stroke="#0284c7" strokeWidth="2" />
                <rect x="64" y="96" width="72" height="76" rx="12" fill="url(#metalSheen)" pointerEvents="none" />

                {/* Arms */}
                <rect x="38" y="104" width="18" height="52" rx="9" fill="url(#bodyGrad)" stroke="#0284c7" strokeWidth="1.5" />
                <rect x="144" y="104" width="18" height="52" rx="9" fill="url(#bodyGrad)" stroke="#0284c7" strokeWidth="1.5" />
                {/* Hands */}
                <circle cx="47" cy="162" r="7" fill="#64748b" />
                <circle cx="153" cy="162" r="7" fill="#64748b" />

                {/* Legs */}
                <rect x="74" y="174" width="20" height="40" rx="6" fill="#334155" />
                <rect x="106" y="174" width="20" height="40" rx="6" fill="#334155" />
                {/* Feet */}
                <rect x="68" y="210" width="28" height="8" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                <rect x="104" y="210" width="28" height="8" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />

                {/* Eyes Style */}
                {eyeStyle === 'laser_visor' && (
                  <rect x="78" y="52" width="44" height="10" rx="5" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.5" className="animate-pulse" />
                )}
                {eyeStyle === 'dual_led' && (
                  <g>
                    <circle cx="88" cy="56" r="5" fill="#38bdf8" className="animate-ping" style={{ animationDuration: '2s' }} />
                    <circle cx="88" cy="56" r="4" fill="#38bdf8" />
                    <circle cx="112" cy="56" r="4" fill="#38bdf8" />
                  </g>
                )}
                {eyeStyle === 'vr_headset' && (
                  <rect x="74" y="48" width="52" height="18" rx="6" fill="#090d16" stroke="#a855f7" strokeWidth="2" />
                )}

                {/* Chest Emblem Badge */}
                <rect x="80" y="112" width="40" height="40" rx="10" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" />
                {chestBadge === 'arc_reactor' && (
                  <g transform="translate(100, 132)">
                    <circle r="12" fill="#0284c7" opacity="0.3" />
                    <circle r="8" fill="#38bdf8" className="animate-pulse" />
                    <circle r="4" fill="#ffffff" />
                  </g>
                )}
                {chestBadge === 'cyber_shield' && (
                  <path d="M100 120 L112 124 L112 134 Q100 144 100 144 Q88 134 88 134 L88 124 Z" fill="#10b981" />
                )}
                {chestBadge === 'gear' && (
                  <circle cx="100" cy="132" r="9" fill="#f59e0b" stroke="#78350f" strokeWidth="2" strokeDasharray="3,2" />
                )}
                {chestBadge === 'atom' && (
                  <g transform="translate(100, 132)">
                    <ellipse rx="10" ry="4" fill="none" stroke="#a855f7" strokeWidth="1.5" transform="rotate(30)" />
                    <ellipse rx="10" ry="4" fill="none" stroke="#a855f7" strokeWidth="1.5" transform="rotate(-30)" />
                    <circle r="3" fill="#ec4899" />
                  </g>
                )}
                {chestBadge === 'tic_logo' && (
                  <text x="100" y="136" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">TIC</text>
                )}
              </svg>
            </div>

            <div className="mt-3 text-center">
              <span className="text-sm font-black text-white font-mono">{avatarName}</span>
              <div className="flex items-center justify-center gap-2 text-[10px] text-cyan-300 font-mono mt-0.5">
                <span>Material: {materialFinish}</span>
                <span>•</span>
                <span>X:0 Y:120 Z:-40</span>
              </div>
            </div>
          </div>

          {/* Customizer Controls Panel */}
          <div className="lg:col-span-7 space-y-4">
            {/* Avatar Name */}
            <div>
              <label className="text-[11px] font-mono font-bold text-slate-300 uppercase block mb-1">
                {lang === 'en' ? 'Avatar Name / Designation:' : 'Nume Avatar / Denumire Proiect:'}
              </label>
              <input
                type="text"
                value={avatarName}
                onChange={(e) => setAvatarName(e.target.value)}
                maxLength={30}
                className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Head Geometry Selection */}
            <div>
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase block mb-1.5">
                {lang === 'en' ? 'Head 3D Shape (Axa Z):' : 'Formă Cap 3D (Forme de Bază):'}
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cube', label: 'Cub Cibernetic 🟩' },
                  { id: 'sphere', label: 'Sferă Holografică 🔵' },
                  { id: 'cylinder', label: 'Cilindru Smart 🥫' }
                ].map(h => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setHeadShape(h.id as any);
                    }}
                    className={`p-2 rounded-xl border text-xs font-semibold text-center transition cursor-pointer ${
                      headShape === h.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette & Material Finish */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase block mb-1.5">
                  {lang === 'en' ? 'Chassis Color:' : 'Culoare Carcasă:'}
                </span>
                <div className="flex items-center gap-2">
                  {[
                    { color: '#06b6d4', name: 'Cyan' },
                    { color: '#10b981', name: 'Emerald' },
                    { color: '#f59e0b', name: 'Gold' },
                    { color: '#8b5cf6', name: 'Violet' },
                    { color: '#ef4444', name: 'Crimson' }
                  ].map(c => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setBodyColor(c.color);
                      }}
                      className={`w-7 h-7 rounded-full border-2 transition cursor-pointer ${
                        bodyColor === c.color ? 'ring-2 ring-white scale-110' : 'border-slate-700'
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase block mb-1.5">
                  {lang === 'en' ? 'Material Finish (Paint 3D):' : 'Finisaj Material (Paint 3D):'}
                </span>
                <select
                  value={materialFinish}
                  onChange={(e) => {
                    sounds.playClick();
                    setMaterialFinish(e.target.value as any);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-200 font-semibold focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="metal_gloss">Metal Lucios (Polished Metal)</option>
                  <option value="metal_matte">Metal Mat (Dull Metal)</option>
                  <option value="gloss">Plastic Lucios (Gloss)</option>
                  <option value="matte">Mat Standard (Matte)</option>
                </select>
              </div>
            </div>

            {/* Chest Badge & Eyes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase block mb-1.5">
                  {lang === 'en' ? 'Chest Sticker / Emblem:' : 'Sticker / Emblemă Piept:'}
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { id: 'arc_reactor', icon: '⚡' },
                    { id: 'cyber_shield', icon: '🛡️' },
                    { id: 'gear', icon: '⚙️' },
                    { id: 'atom', icon: '⚛️' },
                    { id: 'tic_logo', icon: '💻' }
                  ].map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        setChestBadge(b.id as any);
                      }}
                      className={`p-1.5 rounded-lg border text-center text-sm transition cursor-pointer ${
                        chestBadge === b.id
                          ? 'bg-cyan-500/20 border-cyan-400 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {b.icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase block mb-1.5">
                  {lang === 'en' ? 'Eye Optics / Visor:' : 'Optică Ochi / Vizor:'}
                </span>
                <select
                  value={eyeStyle}
                  onChange={(e) => {
                    sounds.playClick();
                    setEyeStyle(e.target.value as any);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-200 font-semibold focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="laser_visor">Vizor Laser Roșu (Laser Visor)</option>
                  <option value="dual_led">LED-uri Duble Cyan (Dual LEDs)</option>
                  <option value="vr_headset">Ochelari Imersivi VR (VR Headset)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Practical Avatar Lab Checklist Section */}
      <div className="bg-slate-900/95 border-2 border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Box className="w-5 h-5 text-cyan-400" />
              <span>Ghidul Practic: Crearea unui Avatar Robot 3D (Manual pag. 33)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Bifează etapele parcurse pentru asamblarea personajului tridimensional în Paint 3D:
            </p>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
            allStepsDone
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
              : 'bg-amber-500/20 border-amber-400 text-amber-300'
          }`}>
            {allStepsDone ? '✅ Proiect 3D Validat!' : 'În lucru'}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              id: 'step1',
              title: '1. Corpul Principal & Trunchiul (Cub / Capsulă)',
              desc: 'Inserarea corpului din Forme 3D și poziționarea lui centrală pe planul pânzei.'
            },
            {
              id: 'step2',
              title: '2. Capul & Membrele Asamblate pe Axa Z',
              desc: 'Adăugarea sferei pentru cap și a cilindrilor pentru brațe, aliniate cu ancora de translație din stânga.'
            },
            {
              id: 'step3',
              title: '3. Texturare & Finisaj Metal Lucios',
              desc: 'Aplicarea materialului Glossy Metal și mularea stickerelor (ochi robotici, ecran pe piept).'
            },
            {
              id: 'step4',
              title: '4. Exportul Modelului (.GLB) & Animație Turntable',
              desc: 'Salvarea în format .glb pentru Minecraft/PowerPoint și testarea rotației automate la 360°.'
            }
          ].map(st => (
            <button
              key={st.id}
              type="button"
              onClick={() => handleToggleStep(st.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                completedSteps[st.id]
                  ? 'bg-cyan-950/60 border-cyan-400 text-cyan-100'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center border mt-0.5 shrink-0 ${
                completedSteps[st.id] ? 'bg-cyan-400 text-slate-950 border-cyan-300' : 'border-slate-600'
              }`}>
                {completedSteps[st.id] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <div>
                <div className="text-xs font-bold text-white mb-0.5">{st.title}</div>
                <div className="text-[11px] text-slate-300 leading-snug">{st.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Synthesis Evaluation Quiz (3 Questions) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Q1 */}
        <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 shadow-lg space-y-3">
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">Întrebarea 1 din 3</span>
          <h3 className="text-xs sm:text-sm font-bold text-white">
            Care sunt cele 3 coordonate spațiale ale unui obiect 3D?
          </h3>
          <div className="space-y-1.5">
            {[
              { id: 'xyz_axes', label: 'X (Lățime), Y (Înălțime) și Z (Adâncime)' },
              { id: 'abc_axes', label: 'A, B și C' },
              { id: 'xy_only', label: 'Doar X și Y ca pe foaia de hârtie' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={isLocked('q1') || isQ1Correct}
                onClick={() => handleAnswerQ1(opt.id)}
                className={`w-full p-2 rounded-lg border text-left text-xs font-medium cursor-pointer disabled:cursor-not-allowed ${
                  q1Answer === opt.id
                    ? opt.id === 'xyz_axes'
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {cooldowns.q1 && cooldowns.q1 > 0 ? (
            <PedagogicalReflectionBanner cooldown={cooldowns.q1} />
          ) : null}
        </div>

        {/* Q2 */}
        <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 shadow-lg space-y-3">
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">Întrebarea 2 din 3</span>
          <h3 className="text-xs sm:text-sm font-bold text-white">
            Ce buton detașează o formă 2D de pânză și îi conferă volum 3D?
          </h3>
          <div className="space-y-1.5">
            {[
              { id: 'make_3d', label: 'Butonul „Creare 3D” (Make 3D)' },
              { id: 'eraser', label: 'Radiera' },
              { id: 'clear_all', label: 'Ștergere completă pânză' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={isLocked('q2') || isQ2Correct}
                onClick={() => handleAnswerQ2(opt.id)}
                className={`w-full p-2 rounded-lg border text-left text-xs font-medium cursor-pointer disabled:cursor-not-allowed ${
                  q2Answer === opt.id
                    ? opt.id === 'make_3d'
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {cooldowns.q2 && cooldowns.q2 > 0 ? (
            <PedagogicalReflectionBanner cooldown={cooldowns.q2} />
          ) : null}
        </div>

        {/* Q3 */}
        <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 shadow-lg space-y-3">
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">Întrebarea 3 din 3</span>
          <h3 className="text-xs sm:text-sm font-bold text-white">
            Ce ancoră de control mută obiectul înainte și înapoi pe axa Z?
          </h3>
          <div className="space-y-1.5">
            {[
              { id: 'left_anchor', label: 'Ancora din Stânga (Translație Z-depth)' },
              { id: 'top_anchor', label: 'Ancora de Sus (Roll)' },
              { id: 'right_anchor', label: 'Ancora din Dreapta (Yaw)' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={isLocked('q3') || isQ3Correct}
                onClick={() => handleAnswerQ3(opt.id)}
                className={`w-full p-2 rounded-lg border text-left text-xs font-medium cursor-pointer disabled:cursor-not-allowed ${
                  q3Answer === opt.id
                    ? opt.id === 'left_anchor'
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {cooldowns.q3 && cooldowns.q3 > 0 ? (
            <PedagogicalReflectionBanner cooldown={cooldowns.q3} />
          ) : null}
        </div>
      </div>

      {/* Capstone Evaluation Summary Card & Finalization */}
      <div className="bg-gradient-to-br from-slate-900 via-cyan-950/30 to-slate-950 border-2 border-cyan-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto text-3xl shadow-inner">
          🏆
        </div>

        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {lang === 'en' ? 'Synthesis Evaluation Completed' : 'Evaluare Finală Modulul 2A'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            {lang === 'en'
              ? 'Your score is dynamically calculated based on your practical 3D avatar steps and final quiz.'
              : 'Punctajul și nota sunt calculate dinamic în baza atelierului de modelare 3D și a testului final.'}
          </p>
        </div>

        {/* Dynamic Score & Grade Badge */}
        <div className="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-950/90 border border-cyan-500/50 shadow-lg">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          <span className="text-base sm:text-lg font-black text-cyan-300 font-mono">
            Punctaj: {earnedScore} / 100 Puncte
          </span>
          <span className="text-slate-500 font-bold">•</span>
          <span className="text-sm sm:text-base font-bold text-emerald-300">
            {gradeDetails.calificativRo}
          </span>
        </div>

        {/* Certified 3D Project Seal */}
        <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-lg font-bold border border-cyan-500/40">
              🤖
            </div>
            <div>
              <div className="text-xs font-black text-white">{avatarName}</div>
              <div className="text-[10px] text-cyan-300/80 font-mono">Autor: {studentName} • Finisaj: {materialFinish}</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
            GLB 3D ✓
          </span>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleFinalizeMission}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 cursor-pointer transition transform active:scale-95 flex items-center gap-2.5"
          >
            <Trophy className="w-5 h-5" />
            <span>{lang === 'en' ? 'Finalize Mission 2A & Claim Official Diploma!' : 'Finalizează Misiunea 2A & Revendică Marea Diplomă!'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadProject}
            className="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-bold text-sm shadow-lg cursor-pointer transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{lang === 'en' ? 'Download Project (.json)' : 'Descarcă Fișa Proiectului'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm shadow-lg cursor-pointer transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>{lang === 'en' ? 'Print Official Certificate' : 'Tipărește Diploma'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
