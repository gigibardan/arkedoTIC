import React, { useState } from 'react';
import {
  School,
  BookOpen,
  Clock,
  Star,
  Award,
  Sparkles,
  User,
  ArrowRight,
  CheckCircle2,
  Lock,
  Cpu,
  FolderTree,
  Lightbulb,
  ShieldCheck,
  RotateCcw,
  BadgeCheck,
  Gamepad2,
  Cloud,
  FileText,
  Volume2,
  Keyboard,
  MousePointer,
  Binary,
  Trophy,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useArky } from '../context/ArkyContext';
import { sounds } from '../utils/audio';
import { KnowledgePills } from './hardware/KnowledgePills';
import { MissionGuardModal } from './MissionGuardModal';
import { ARKY_IMAGES } from '../assets/arkyImages';

const AVATARS = [
  { emoji: '🎓', labelRo: 'Elev', labelEn: 'Student' },
  { emoji: '🤖', labelRo: 'Robot', labelEn: 'Robot' },
  { emoji: '🚀', labelRo: 'Astronaut', labelEn: 'Astronaut' },
  { emoji: '💻', labelRo: 'Hacker Etic', labelEn: 'Coder' },
  { emoji: '⚡', labelRo: 'Campion', labelEn: 'Champion' },
  { emoji: '🔬', labelRo: 'Cercetător', labelEn: 'Scientist' },
  { emoji: '🌟', labelRo: 'Explorator', labelEn: 'Explorer' },
  { emoji: '🎮', labelRo: 'Gamer', labelEn: 'Gamer' },
];

interface CoursesCatalogProps {
  studentName: string;
  onSetStudentName: (name: string) => void;
  onSelectMission: (missionId: 'hardware' | 'files' | 'internet1' | 'internet2') => void;
  activeMissionId: 'hardware' | 'files' | 'internet1' | 'internet2' | null;
  activeMissionLevel: number;
  activeMissionScore: number;
  elapsedSeconds: number;
  onResetActiveMission: () => void;
  onOpenTeacherPortal?: () => void;
  onOpenArcade?: () => void;
}

export const CoursesCatalog: React.FC<CoursesCatalogProps> = ({
  studentName,
  onSetStudentName,
  onSelectMission,
  activeMissionId,
  activeMissionLevel,
  activeMissionScore,
  elapsedSeconds,
  onResetActiveMission,
  onOpenTeacherPortal,
  onOpenArcade,
}) => {
  const { t, lang } = useLanguage();
  const arky = useArky();
  const [nameInput, setNameInput] = useState<string>(studentName);
  const [isEditingName, setIsEditingName] = useState<boolean>(!studentName);
  const [nameError, setNameError] = useState<boolean>(false);

  // Student Avatar State
  const [selectedAvatar, setSelectedAvatar] = useState<string>(() => {
    try {
      return localStorage.getItem('arkedo_student_avatar') || '🎓';
    } catch {
      return '🎓';
    }
  });

  // Guard modal state
  const [guardModalOpen, setGuardModalOpen] = useState<boolean>(false);
  const [pendingTargetMission, setPendingTargetMission] = useState<'hardware' | 'files' | 'internet1' | 'internet2' | null>(null);

  // Arky Hero Speech Bubble & Click Tips
  const [arkyTipIndex, setArkyTipIndex] = useState<number>(0);
  const arkyTips = lang === 'en' ? [
    "Tap me anytime for a secret tech fact! 🤖✨",
    "Win + E opens File Explorer in a single blink! ⚡",
    "Ctrl + A selects everything at once. Super fast! 🎯",
    "Remember: RAM is your desk, SSD is your permanent shelf! 💾",
    "The 20-20-20 rule keeps your eyes fresh during long sessions! 👀",
    "Never type ? or * in filenames—Windows reserves them for search! 🛑",
    "Shift + Click selects adjacent items; Ctrl + Click selects scattered items! 🖱️",
  ] : [
    "Apasă pe mine oricând pentru un secret tehnologic! 🤖✨",
    "Win + E deschide File Explorer într-o secundă! ⚡",
    "Ctrl + A selectează toate fișierele dintr-o mișcare! 🎯",
    "Reține: RAM este masa de lucru, SSD este dulapul permanent! 💾",
    "Regula 20-20-20 îți relaxează ochii: 20 secunde la 6 metri distanță! 👀",
    "Nu folosi niciodată ? sau * în nume de fișiere—sunt caractere rezervate! 🛑",
    "Shift + Click selectează fișiere legate; Ctrl + Click pe cele răsfirate! 🖱️",
  ];

  const handleSelectAvatar = (emoji: string) => {
    setSelectedAvatar(emoji);
    sounds.playClick();
    try {
      localStorage.setItem('arkedo_student_avatar', emoji);
    } catch {
      // Ignore
    }
  };

  const handleArkyHeroClick = () => {
    sounds.playCorrect();
    const nextIndex = (arkyTipIndex + 1) % arkyTips.length;
    setArkyTipIndex(nextIndex);
    arky.triggerSuccess(arkyTips[nextIndex]);
  };

  const handleSaveName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = nameInput.trim();
    if (trimmed.length > 0) {
      onSetStudentName(trimmed);
      setIsEditingName(false);
      setNameError(false);
      sounds.playCorrect();
      arky.triggerSuccess(
        lang === 'en'
          ? `Welcome aboard, ${trimmed}! Your digital pass is ready! 🚀`
          : `Bun venit la bord, ${trimmed}! Legitimația ta digitală este activă! 🚀`
      );
    } else {
      setNameError(true);
      arky.triggerError(
        lang === 'en'
          ? "Oops! Please enter your name so Arky can put it on your diploma! ✍️"
          : "Hopa! Scrie-ți numele pentru ca Arky să-l poată pune pe diplomă! ✍️"
      );
    }
  };

  const handleAttemptStart = (targetMission: 'hardware' | 'files' | 'internet1' | 'internet2') => {
    // If student has no name yet, prompt them first
    if (!studentName && !nameInput.trim()) {
      setNameError(true);
      setIsEditingName(true);
      sounds.playWrong();
      arky.triggerError(
        lang === 'en'
          ? "Hold on! Tell Arky your name first before starting the mission! 🤖"
          : "Stai puțin! Spune-i lui Arky numele tău înainte de a începe misiunea! 🤖"
      );
      return;
    }
    if (nameInput.trim() && !studentName) {
      onSetStudentName(nameInput.trim());
    }

    // CHECK IN-PROGRESS GUARD:
    // If user has an active mission in progress (level > 1 and level <= 6) and tries to start a DIFFERENT mission
    const hasMissionInProgress =
      activeMissionId !== null &&
      activeMissionId !== targetMission &&
      activeMissionLevel > 1 &&
      activeMissionLevel <= 6;

    if (hasMissionInProgress) {
      sounds.playWrong();
      setPendingTargetMission(targetMission);
      setGuardModalOpen(true);
      return;
    }

    // Safe to proceed
    sounds.playClick();
    onSelectMission(targetMission);
  };

  const getMissionTitle = (id: 'hardware' | 'files' | 'internet1' | 'internet2' | null) => {
    if (id === 'hardware') {
      return lang === 'en'
        ? 'Module 1: Computer Systems & Hardware (Textbook p. 10-20)'
        : 'Modulul 1: Sisteme de calcul & Hardware (Manual pag. 10-20)';
    }
    if (id === 'files') {
      return lang === 'en'
        ? 'Module 2: The Secret File Tree (Textbook p. 27-30)'
        : 'Modulul 2: Arborele Secret de Fișiere (Manual pag. 27-30)';
    }
    if (id === 'internet1') {
      return lang === 'en'
        ? 'Module 3A: Internet, Networks & World Wide Web (Textbook p. 32-36)'
        : 'Modulul 3A: Internet, Rețele & World Wide Web (Manual pag. 32-36)';
    }
    if (id === 'internet2') {
      return lang === 'en'
        ? 'Module 3B: Advanced Search, Communication & Digital Identity (Textbook p. 38-48)'
        : 'Modulul 3B: Căutare Avansată, Comunicare & Identitate Digitală (Manual pag. 38-48)';
    }
    return lang === 'en' ? 'No active mission' : 'Nicio misiune activă';
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950/60 border border-teal-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Branding, Title, and Student ID Card */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {/* School & Grade Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 text-teal-300 text-xs sm:text-sm font-bold border border-teal-500/40 shadow-sm backdrop-blur">
                <School className="w-4 h-4 text-teal-400" />
                <span>{t.catalogBadge}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'en' ? 'Curriculum 2026 Ready' : 'Conform Programei Școlare'}</span>
              </div>
            </div>

            {/* Main Title & Subtitle */}
            <div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight leading-tight">
                {t.catalogTitle}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-2.5 max-w-2xl">
                {lang === 'en'
                  ? 'Explore interactive modules with hands-on practice, teacher pro tips, sound effects, and official merit diplomas!'
                  : 'Platformă educațională digitală cu provocări practice, sfaturi de la profesor, simulatoare de sistem de operare și diplome oficiale de merit!'}
              </p>
            </div>

            {/* Student Digital ID Pass / Registration Card */}
            <div className="bg-slate-900/90 backdrop-blur border-2 border-teal-500/40 rounded-2xl p-4 sm:p-6 shadow-xl max-w-2xl relative overflow-hidden">
              {/* Pass Top Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3.5">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-teal-400">
                  <BadgeCheck className="w-4 h-4 text-teal-400" />
                  <span>{lang === 'en' ? 'ARKEDO Student Access Pass' : 'Legitimație Elev • Laborator TIC'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{studentName ? (lang === 'en' ? 'VERIFIED' : 'ACTIVAT') : (lang === 'en' ? 'PENDING' : 'NECONFIRMAT')}</span>
                </div>
              </div>

              {studentName && !isEditingName ? (
                /* Profile view when name is registered */
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    {/* Avatar Display */}
                    <div className="relative group">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500/30 via-slate-800 to-emerald-500/30 border-2 border-teal-400/50 flex items-center justify-center text-3xl shadow-lg shadow-teal-900/40">
                        {selectedAvatar}
                      </div>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-800 border border-slate-600 text-[10px] flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
                        title={lang === 'en' ? 'Change avatar' : 'Schimbă avatarul'}
                      >
                        ✏️
                      </button>
                    </div>

                    <div>
                      <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                        <span>{t.helloStudent},</span>
                        <span className="text-[11px] font-mono text-teal-400/80 bg-teal-950/50 px-1.5 py-0.5 rounded border border-teal-500/20">
                          {lang === 'en' ? 'Rank: Digital Cadet' : 'Grad: Cadet TIC'}
                        </span>
                      </div>
                      <div className="text-lg sm:text-xl font-black text-white font-heading tracking-wide">
                        {studentName}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {lang === 'en' ? 'Ready for challenges & diplomas' : 'Gata pentru rezolvarea provocărilor'}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <button
                      onClick={() => {
                        setNameInput(studentName);
                        setIsEditingName(true);
                        sounds.playClick();
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition border border-slate-700 cursor-pointer shadow-sm"
                    >
                      {t.studentNameChangeBtn}
                    </button>

                    {activeMissionId && (
                      <button
                        onClick={() => handleAttemptStart(activeMissionId)}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-teal-600/30 cursor-pointer active:scale-95 animate-pulse"
                      >
                        <span>{lang === 'en' ? 'Resume Mission' : 'Reia Misiunea'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Profile creation / editing form */
                <form onSubmit={handleSaveName} className="flex flex-col gap-3.5">
                  <div>
                    <p className="text-xs font-medium text-slate-300 mb-2">
                      {lang === 'en'
                        ? '1. Choose your explorer avatar:'
                        : '1. Alege avatarul tău de explorator:'}
                    </p>
                    {/* Horizontal Avatar Selector */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
                      {AVATARS.map((av) => {
                        const isSelected = selectedAvatar === av.emoji;
                        return (
                          <button
                            key={av.emoji}
                            type="button"
                            onClick={() => handleSelectAvatar(av.emoji)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all cursor-pointer shrink-0 ${
                              isSelected
                                ? 'bg-teal-500 text-white ring-2 ring-teal-300 shadow-md scale-110'
                                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
                            }`}
                            title={lang === 'en' ? av.labelEn : av.labelRo}
                          >
                            {av.emoji}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-300 mb-1.5">
                      {lang === 'en'
                        ? '2. Enter your student name (printed on official diplomas):'
                        : '2. Introdu numele tău de elev (va fi imprimat pe diploma de merit):'}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={nameInput}
                          onChange={(e) => {
                            setNameInput(e.target.value);
                            if (nameError) setNameError(false);
                          }}
                          placeholder={t.studentNamePlaceholder}
                          className={`w-full bg-slate-950/90 border pl-9 pr-3.5 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 font-medium ${
                            nameError
                              ? 'border-rose-500 focus:ring-rose-500/40'
                              : 'border-slate-700 focus:ring-teal-500/40'
                          }`}
                          autoFocus
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shadow-md shadow-teal-600/30 shrink-0 cursor-pointer active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t.studentNameSaveBtn}</span>
                      </button>
                    </div>
                    {nameError && (
                      <p className="text-xs text-rose-400 font-semibold mt-1.5">
                        {t.enterNameAlert}
                      </p>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* Quick Hero Highlights / Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenArcade?.();
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/40 hover:border-indigo-400 text-xs text-indigo-300 font-bold transition cursor-pointer active:scale-95 text-left"
              >
                <Gamepad2 className="w-4 h-4 text-indigo-400 shrink-0 animate-pulse" />
                <span>{lang === 'en' ? 'Arcade Games (8)' : 'Jocuri Arcade TIC (8)'}</span>
              </button>
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{lang === 'en' ? 'Merit Diplomas (PDF)' : 'Diplome Oficiale de Merit'}</span>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                <Cloud className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{lang === 'en' ? 'Live Cloud Gradebook' : 'Catalog Digital Profesor'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Mascota Arky Live Companion */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
            {/* Arky Speech Bubble */}
            <div className="relative bg-slate-900/95 border-2 border-teal-400/60 rounded-2xl p-3.5 sm:p-4 text-center shadow-xl mb-3 backdrop-blur max-w-xs transition-all">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-teal-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Arky TIC Assistant</span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-100 leading-snug">
                {!studentName
                  ? (lang === 'en'
                      ? 'Hey! I am Arky! Choose an avatar and enter your name to unlock the lab! 🤖'
                      : 'Salut! Sunt Arky! Alege-ți un avatar și scrie-ți numele pentru a debloca laboratorul! 🤖')
                  : arkyTips[arkyTipIndex]}
              </p>
              {/* Speech bubble arrow pointer */}
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-teal-400/60"></div>
            </div>

            {/* Arky Mascot with Glow & Tap Interactivity */}
            <button
              type="button"
              onClick={handleArkyHeroClick}
              className="group relative cursor-pointer focus:outline-none transition-transform active:scale-95"
              title={lang === 'en' ? 'Tap Arky for a secret tip!' : 'Apasă pe Arky pentru un sfat secret!'}
            >
              {/* Ambient Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-teal-500/25 to-emerald-500/20 rounded-full blur-2xl group-hover:from-teal-400/40 group-hover:to-emerald-400/30 transition-all"></div>

              <img
                src={studentName ? ARKY_IMAGES.success : ARKY_IMAGES.idle}
                alt="Arky Mascota"
                className="relative z-10 w-48 sm:w-56 h-auto object-contain drop-shadow-[0_15px_25px_rgba(20,184,166,0.35)] group-hover:scale-105 transition-all duration-300"
              />

              {/* Tap badge prompt */}
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-slate-900/90 border border-teal-500/50 text-[11px] font-bold text-teal-300 shadow-md whitespace-nowrap opacity-90 group-hover:opacity-100 group-hover:border-teal-300 flex items-center gap-1.5 transition-all">
                <Volume2 className="w-3 h-3 text-teal-400 animate-pulse" />
                <span>{lang === 'en' ? 'Tap Arky!' : 'Apasă pe Arky!'}</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Knowledge Pills Section */}
      <KnowledgePills />

      {/* Courses & Lessons Section */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg sm:text-2xl font-black text-white font-heading tracking-wide">
              {lang === 'en' ? 'Practical ICT Missions for 5th & 6th Grade' : 'Misiuni Practice TIC Clasa a V-a'}
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
            {lang === 'en' ? '2 Interactive Missions Available' : '2 Misiuni Interactive Disponibile'}
          </span>
        </div>

        {/* Lesson Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1 (NEW & FIRST): Modulul 1 - Sisteme de Calcul și Comunicații */}
          <div
            className={`group relative bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 rounded-3xl p-6 shadow-xl transition-all flex flex-col justify-between ${
              activeMissionId === 'hardware'
                ? 'border-teal-400 shadow-teal-500/20 ring-2 ring-teal-500/30'
                : 'border-teal-500/60 hover:border-teal-400 hover:shadow-teal-500/10'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                  💻⚡
                </div>
                <div className="flex items-center gap-2">
                  {activeMissionId === 'hardware' && activeMissionLevel > 1 && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black uppercase tracking-wider font-mono">
                      {lang === 'en' ? `In Progress (Level ${activeMissionLevel}/5)` : `În Curs (Nivel ${activeMissionLevel}/5)`}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-black uppercase tracking-wider animate-pulse">
                    <Sparkles className="w-3 h-3" /> {lang === 'en' ? 'NEW • MODULE 1' : 'NOU • MODULUL 1'}
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-teal-400 mb-1 font-mono">
                {lang === 'en' ? 'Textbook p. 10–20 • Unit 1' : 'Manual pag. 10–20 • Unitatea 1'}
              </div>

              <h3 className="text-xl font-black text-white font-heading mb-1 group-hover:text-teal-300 transition-colors">
                {lang === 'en' ? 'Computing & Communication Systems' : 'Sisteme de calcul și comunicații'}
              </h3>
              <div className="text-xs font-semibold text-slate-300 mb-3">
                {lang === 'en' ? 'PC Architecture, Ergonomics, History & Capacity Math' : 'Arhitectură PC, Ergonomie, Istorie & Calculul Capacității'}
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {lang === 'en'
                  ? 'Learn safety and ergonomics in the computer lab, explore the timeline (1642 Pascaline → 1981 IBM PC), assemble central unit components (CPU, RAM, Motherboard), sort peripherals, and solve the binary capacity math from the textbook!'
                  : 'Învață normele de protecția muncii și ergonomie în laborator, explorează axa timpului (1642 Pascalina → 1981 IBM PC), montează componentele unității centrale (CPU, RAM, Placă de bază), sortează perifericele și rezolvă problema stocării în biți din manual!'}
              </p>

              {/* Badges / Highlights */}
              <div className="flex flex-wrap gap-2 mb-4 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> 20-25 min
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-amber-300 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {lang === 'en' ? '100 Points (Grade 10)' : '100 Puncte (Nota 10)'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-teal-300 flex items-center gap-1">
                  <Award className="w-3 h-3 text-teal-400" /> {lang === 'en' ? 'Hardware Technician Certificate' : 'Diplomă Tehnician Hardware'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between">
              <div className="text-xs text-slate-400 font-mono">
                {activeMissionId === 'hardware' && activeMissionLevel > 1 ? (
                  <span className="text-teal-400 font-bold">
                    {lang === 'en' ? `Progress: Level ${activeMissionLevel}/5 (${activeMissionScore} pts)` : `Progres: Nivel ${activeMissionLevel}/5 (${activeMissionScore} pct)`}
                  </span>
                ) : (
                  <span>{lang === 'en' ? '5 Interactive Levels' : '5 Niveluri interactive'}</span>
                )}
              </div>
              <button
                onClick={() => handleAttemptStart('hardware')}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-teal-600/30 cursor-pointer active:scale-95"
              >
                <span>
                  {activeMissionId === 'hardware' && activeMissionLevel > 1
                    ? (lang === 'en' ? 'Resume Hardware Mission' : 'Continuă Misiunea Hardware')
                    : (lang === 'en' ? 'Start Mission 1' : 'Începe Misiunea 1')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Modulul 2 - Organizarea Datelor • Arborele Secret */}
          <div
            className={`group relative bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 rounded-3xl p-6 shadow-xl transition-all flex flex-col justify-between ${
              activeMissionId === 'files'
                ? 'border-emerald-400 shadow-emerald-500/20 ring-2 ring-emerald-500/30'
                : 'border-emerald-500/60 hover:border-emerald-400 hover:shadow-emerald-500/10'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                  🌳
                </div>
                <div className="flex items-center gap-2">
                  {activeMissionId === 'files' && activeMissionLevel > 1 && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black uppercase tracking-wider font-mono">
                      {lang === 'en' ? `In Progress (Level ${activeMissionLevel}/7)` : `În Curs (Nivel ${activeMissionLevel}/7)`}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> {lang === 'en' ? 'MODULE 2' : 'MODULUL 2'}
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1 font-mono">
                {lang === 'en' ? 'Textbook p. 22–30 • Unit 2' : 'Manual pag. 22–30 • Unitatea 2'}
              </div>

              <h3 className="text-xl font-black text-white font-heading mb-1 group-hover:text-emerald-300 transition-colors">
                {lang === 'en' ? 'The Secret File Tree & OS Mission' : 'Misiunea Arborele Secret de Fișiere & SO'}
              </h3>
              <div className="text-xs font-semibold text-slate-300 mb-3">
                {lang === 'en' ? 'Windows 10 Interface, Extensions, C:\\ Structure, Shortcuts & Recycle Bin' : 'Interfață Windows 10, Extensii, Structură C:\\, Comenzi Rapide & Recycle Bin'}
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {lang === 'en'
                  ? 'Explore the operating system interface (p. 22–24), learn extension rules and file paths (p. 25–26), build hierarchical directory structures (p. 27–28), find secret files using patterns (*.docx), move files with shortcuts, inspect properties, and restore items from the Recycle Bin!'
                  : 'Explorează interfața sistemului de operare (pag. 22–24), învață regula extensiilor și calea către fișiere (pag. 25–26), construiește structura ierarhică de directoare (pag. 27–28), găsește fișierele secrete cu masca (*.docx), mută documente cu taste rapide, gestionează proprietățile și restaurează datele din Recycle Bin!'}
              </p>

              {/* Badges / Highlights */}
              <div className="flex flex-wrap gap-2 mb-4 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> 20-25 min
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-amber-300 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {lang === 'en' ? '100 Points (Grade 10)' : '100 Puncte (Nota 10)'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-emerald-300 flex items-center gap-1">
                  <Award className="w-3 h-3 text-emerald-400" /> {lang === 'en' ? 'File Architect & OS Certificate' : 'Diplomă Arhitect Fișiere & SO'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between">
              <div className="text-xs text-slate-400 font-mono">
                {activeMissionId === 'files' && activeMissionLevel > 1 ? (
                  <span className="text-emerald-400 font-bold">
                    {lang === 'en' ? `Progress: Level ${activeMissionLevel}/7 (${activeMissionScore} pts)` : `Progres: Nivel ${activeMissionLevel}/7 (${activeMissionScore} pct)`}
                  </span>
                ) : (
                  <span>{lang === 'en' ? '7 Practical Challenges' : '7 Provocări practice'}</span>
                )}
              </div>
              <button
                onClick={() => handleAttemptStart('files')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
              >
                <span>
                  {activeMissionId === 'files' && activeMissionLevel > 1
                    ? (lang === 'en' ? 'Resume Files Mission' : 'Continuă Misiunea Fișiere')
                    : (lang === 'en' ? 'Start Mission 2' : 'Începe Misiunea 2')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 3: ACTIVE MISSION 3A - Internet, Rețele & World Wide Web */}
          <div className="relative group bg-slate-900/80 border border-slate-700/80 hover:border-teal-500/80 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/10 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-2xl border border-teal-500/30">
                  🌐
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> {lang === 'en' ? '6 Interactive Pages' : '6 Pagini Interactive'}
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-teal-400 mb-1 font-mono">
                {lang === 'en' ? 'Textbook p. 32–36 • Mission 3A' : 'Manual pag. 32–36 • Misiunea 3A'}
              </div>

              <h3 className="text-xl font-black text-white font-heading mb-1 group-hover:text-teal-300 transition-colors">
                {lang === 'en' ? 'Internet & World Wide Web Explorer' : 'Explorator Internet, Rețele & Web'}
              </h3>
              <div className="text-xs font-semibold text-slate-300 mb-3">
                {lang === 'en' ? 'ARPANET, TCP/IP, Services, Crossword, URL Anatomy, Browser Lab & Cyber Safety' : 'ARPANET, TCP/IP, Servicii, Rebus, Anatomie URL, Ghid Browser & Siguranță'}
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {lang === 'en'
                  ? 'Discover computer networks & protocols (p. 32), match Internet services (WWW, Email, FTP, IRC, Telnet - p. 33), solve the secret crossword (p. 34), decode URL addresses (p. 34-35), master browser navigation buttons (p. 35-36), and assemble your cybersecurity shield against digital threats!'
                  : 'Descoperă ce este o rețea și protocolul TCP/IP (pag. 32), asociază serviciile Internet (WWW, E-mail, FTP, IRC, Telnet - pag. 33), rezolvă rebusul tematic (pag. 34), descifrează adresele URL (pag. 34-35), stăpânește butoanele de navigare din browser (pag. 35-36) și activează scutul de securitate cibernetică!'}
              </p>

              {/* Badges / Highlights */}
              <div className="flex flex-wrap gap-2 mb-4 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> 15-20 min
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-amber-300 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {lang === 'en' ? '100 Points (Grade 10)' : '100 Puncte (Nota 10)'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-teal-300 flex items-center gap-1">
                  <Award className="w-3 h-3 text-teal-400" /> {lang === 'en' ? 'Web Explorer Certificate' : 'Diplomă Explorator Web'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between">
              <div className="text-xs text-slate-400 font-mono">
                {activeMissionId === 'internet1' && activeMissionLevel > 1 ? (
                  <span className="text-teal-400 font-bold">
                    {lang === 'en' ? `Progress: Page ${activeMissionLevel}/6 (${activeMissionScore} pts)` : `Progres: Pagina ${activeMissionLevel}/6 (${activeMissionScore} pct)`}
                  </span>
                ) : (
                  <span>{lang === 'en' ? 'Theory + Interactive Tasks' : 'Teorie + Exerciții interactive'}</span>
                )}
              </div>
              <button
                onClick={() => handleAttemptStart('internet1')}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-teal-600/30 cursor-pointer active:scale-95"
              >
                <span>
                  {activeMissionId === 'internet1' && activeMissionLevel > 1
                    ? (lang === 'en' ? 'Resume Internet 3A' : 'Continuă Misiunea 3A')
                    : (lang === 'en' ? 'Start Mission 3A' : 'Începe Misiunea 3A')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 4: ACTIVE MISSION 3B - Căutare Avansată, Comunicare & Identitate Digitală */}
          <div className="relative group bg-slate-900/80 border border-slate-700/80 hover:border-indigo-500/80 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl border border-indigo-500/30">
                  🔍✉️
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> {lang === 'en' ? '6 Interactive Levels' : '6 Niveluri Interactive'}
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 mb-1 font-mono">
                {lang === 'en' ? 'Textbook p. 38–48 • Mission 3B' : 'Manual pag. 38–48 • Misiunea 3B'}
              </div>

              <h3 className="text-xl font-black text-white font-heading mb-1 group-hover:text-indigo-300 transition-colors">
                {lang === 'en' ? 'Advanced Search, Communication & Digital Identity' : 'Căutare Avansată, Comunicare & Identitate Digitală'}
              </h3>
              <div className="text-xs font-semibold text-slate-300 mb-3">
                {lang === 'en' ? 'Search Operators, Source Evaluation, Email (Cc, Bcc), Netiquette, Copyright & Fortress Passwords' : 'Operatori Căutare, Evaluare Surse, E-mail (Cc, Bcc), Netichetă, Plagiat & Parole Blindate'}
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {lang === 'en'
                  ? 'Master Google search operators (AND, OR, NOT, ""), critically evaluate source credibility (CRAAP test & Fake News detection), construct professional emails (Cc, Bcc, attachments), practice netiquette ethics, respect copyright & cite sources without plagiarism, and fortress your digital identity with 2FA passwords!'
                  : 'Stăpânește căutarea avansată cu operatori booleeni (" ", site:, filetype:), evaluează critic sursele de pe net și recunoaște știrile false, compune e-mailuri profesioniste (Cc, Bcc, @), respectă normele de netichetă și combaterea cyberbullying-ului, evită plagiatul prin citare și creează parole blindate cu 2FA!'}
              </p>

              {/* Badges / Highlights */}
              <div className="flex flex-wrap gap-2 mb-4 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> 20-25 min
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-amber-300 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {lang === 'en' ? '100 Points (Grade 10)' : '100 Puncte (Nota 10)'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-indigo-300 flex items-center gap-1">
                  <Award className="w-3 h-3 text-indigo-400" /> {lang === 'en' ? 'Digital Citizenship Certificate' : 'Diplomă Cetățean Digital'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between">
              <div className="text-xs text-slate-400 font-mono">
                {activeMissionId === 'internet2' && activeMissionLevel > 1 ? (
                  <span className="text-indigo-400 font-bold">
                    {lang === 'en' ? `Progress: Level ${activeMissionLevel}/6 (${activeMissionScore} pts)` : `Progres: Nivel ${activeMissionLevel}/6 (${activeMissionScore} pct)`}
                  </span>
                ) : (
                  <span>{lang === 'en' ? 'Theory + Smart Simulator' : 'Teorie + Simulator Inteligent'}</span>
                )}
              </div>
              <button
                onClick={() => handleAttemptStart('internet2')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer active:scale-95"
              >
                <span>
                  {activeMissionId === 'internet2' && activeMissionLevel > 1
                    ? (lang === 'en' ? 'Resume Internet 3B' : 'Continuă Misiunea 3B')
                    : (lang === 'en' ? 'Start Mission 3B' : 'Începe Misiunea 3B')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 5: COMING SOON - Editare Text */}
          <div className="relative bg-slate-900/50 border border-slate-800 rounded-3xl p-6 opacity-85 hover:opacity-100 transition flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl">
                  📝
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-bold uppercase tracking-wider">
                  <Lock className="w-3 h-3" /> {t.statusComingSoon}
                </span>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                {t.lesson4Sub}
              </div>

              <h3 className="text-xl font-bold text-slate-200 font-heading mb-2">
                {t.lesson4Title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {t.lesson4Desc}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>{lang === 'en' ? 'Module 4 • 5th Grade' : 'Modulul 4 • Clasa a V-a'}</span>
              <span className="px-3 py-1 rounded-lg bg-slate-800/80 text-slate-400">
                {lang === 'en' ? 'In preparation ⏳' : 'În pregătire ⏳'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Arcade Mini-Games Banner Section (Placed below missions) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-2 border-indigo-500/30 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shrink-0 mt-1 sm:mt-0">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">
                  {lang === 'en' ? 'Digital Skills Arcade' : 'Laboratorul Arcade TIC'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold border border-indigo-500/30">
                  {lang === 'en' ? '8 Mini-Games' : '8 Mini-Jocuri'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white font-heading mt-0.5">
                {lang === 'en' ? 'Labirint Algoritmic, Firewall Defender, Cyber-Safe, Biți & Typing' : 'Labirintul Algoritmic, Scut Firewall, Detectiv Cyber-Safe, Biți 0-1 & Tastatură'}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {lang === 'en'
                  ? 'Program maze algorithms with loops, block malware packets in the firewall, encode binary bits, and investigate cyber threats!'
                  : 'Programează algoritmi cu bucle, blochează virușii în firewall, decodifică biții 0 și 1 și investighează atacurile phishing!'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onOpenArcade?.();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer shrink-0 active:scale-95"
          >
            <span>{lang === 'en' ? 'Open Arcade' : 'Deschide Jocuri Arcade'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Discreet Teacher Portal Link (for instructors only) */}
      {onOpenTeacherPortal && (
        <div className="pt-2 pb-1 border-t border-slate-800/60 flex items-center justify-center">
          <button
            onClick={() => {
              sounds.playClick();
              onOpenTeacherPortal();
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 text-[11px] font-medium transition cursor-pointer"
            title={lang === 'en' ? 'Instructor Portal (Gradebook & Scoring)' : 'Acces securizat pentru cadre didactice (catalog & notare)'}
          >
            <span className="text-slate-600 text-xs">🔒</span>
            <span>{lang === 'en' ? 'Instructor Portal (Gradebook & Scoring)' : 'Acces cadre didactice (catalog & notare)'}</span>
          </button>
        </div>
      )}

      {/* Mission In-Progress Guard Modal */}
      <MissionGuardModal
        isOpen={guardModalOpen}
        activeMissionTitle={getMissionTitle(activeMissionId)}
        activeLevel={activeMissionLevel}
        activeScore={activeScore(activeMissionLevel, activeMissionId)}
        elapsedSeconds={elapsedSeconds}
        targetMissionTitle={getMissionTitle(pendingTargetMission)}
        onResumeActive={() => {
          setGuardModalOpen(false);
          if (activeMissionId) {
            onSelectMission(activeMissionId);
          }
        }}
        onAbandonAndStartNew={() => {
          setGuardModalOpen(false);
          onResetActiveMission();
          if (pendingTargetMission) {
            onSelectMission(pendingTargetMission);
          }
        }}
        onCancel={() => {
          setGuardModalOpen(false);
          setPendingTargetMission(null);
        }}
      />
    </div>
  );
};

function activeScore(level: number, missionId?: 'hardware' | 'files' | 'internet1' | 'internet2' | null): number {
  if (level <= 1) return 0;
  if (missionId === 'hardware') {
    return Math.min((level - 1) * 20, 100);
  }
  if (missionId === 'internet1') {
    const internetScores = [0, 15, 30, 45, 60, 80, 100];
    return internetScores[Math.min(level - 1, 6)] || 0;
  }
  if (missionId === 'internet2') {
    const internet2Scores = [0, 15, 30, 45, 60, 80, 100];
    return internet2Scores[Math.min(level - 1, 6)] || 0;
  }
  const filesScores = [0, 10, 25, 40, 55, 70, 85, 100];
  return filesScores[Math.min(level - 1, 7)] || 0;
}
