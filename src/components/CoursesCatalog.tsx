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
  LogIn,
  LogOut,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
  AlertCircle,
  Edit3,
  Info,
  Swords,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useArky } from '../context/ArkyContext';
import { sounds } from '../utils/audio';
import { KnowledgePills } from './hardware/KnowledgePills';
import { MissionGuardModal } from './MissionGuardModal';
import { ARKY_IMAGES } from '../assets/arkyImages';
import { LeaderboardSection } from './LeaderboardSection';
import { AuthModal } from './AuthModal';
import {
  getActiveStudent,
  logoutStudent,
  loginStudent,
  registerStudent,
  updateStudentUsername,
  updateStudentAvatar,
  StudentProfile,
} from '../lib/studentAuthService';

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
  onOpenDuel?: () => void;
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
  onOpenDuel,
}) => {
  const { t, lang } = useLanguage();
  const arky = useArky();
  const [activeAccount, setActiveAccount] = useState<StudentProfile | null>(() => getActiveStudent());
  const [nameInput, setNameInput] = useState<string>(studentName || activeAccount?.username || '');
  const [isEditingName, setIsEditingName] = useState<boolean>(!studentName && !activeAccount);
  const [nameError, setNameError] = useState<boolean>(false);

  // In-card pass interaction modes: 'login' | 'register' | 'guest'
  const [passMode, setPassMode] = useState<'login' | 'register' | 'guest'>('login');

  // In-card login state
  const [loginUsername, setLoginUsername] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');

  // In-card register state
  const [registerUsername, setRegisterUsername] = useState<string>('');
  const [registerPassword, setRegisterPassword] = useState<string>('');
  const [showRegisterPassword, setShowRegisterPassword] = useState<boolean>(false);
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);
  const [registerError, setRegisterError] = useState<string>('');

  // In-card rename state (for updating student name)
  const [isRenaming, setIsRenaming] = useState<boolean>(false);
  const [renameInput, setRenameInput] = useState<string>('');
  const [renameError, setRenameError] = useState<string>('');
  const [renameLoading, setRenameLoading] = useState<boolean>(false);

  // Quick avatar selector toggle
  const [isSelectingAvatar, setIsSelectingAvatar] = useState<boolean>(false);

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

  // Student Cloud Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

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

  const handleSelectAvatar = async (emoji: string) => {
    setSelectedAvatar(emoji);
    sounds.playClick();
    if (activeAccount?.id) {
      await updateStudentAvatar(activeAccount.id, emoji);
      setActiveAccount((prev) => (prev ? { ...prev, avatar: emoji } : null));
    } else {
      try {
        localStorage.setItem('arkedo_student_avatar', emoji);
      } catch {
        // Ignore
      }
    }
  };

  const handleArkyHeroClick = () => {
    sounds.playCorrect();
    const nextIndex = (arkyTipIndex + 1) % arkyTips.length;
    setArkyTipIndex(nextIndex);
    arky.triggerSuccess(arkyTips[nextIndex]);
  };

  const handleAuthSuccess = (profile: StudentProfile) => {
    setActiveAccount(profile);
    onSetStudentName(profile.username);
    setNameInput(profile.username);
    setSelectedAvatar(profile.avatar || '🎓');
    try {
      localStorage.setItem('arkedo_student_avatar', profile.avatar || '🎓');
    } catch {
      // Ignore
    }
    setIsEditingName(false);
    setIsRenaming(false);
    sounds.playCorrect();
    arky.triggerSuccess(
      lang === 'en'
        ? `Welcome, ${profile.username}! Account synchronized across the lab!`
        : `Bun venit, ${profile.username}! Contul tău a fost sincronizat pe acest calculator!`
    );
  };

  const handleLogout = () => {
    logoutStudent();
    setActiveAccount(null);
    onSetStudentName('');
    setNameInput('');
    setIsEditingName(true);
    setIsRenaming(false);
    setIsSelectingAvatar(false);
    setPassMode('login');
    sounds.playClick();
    arky.triggerIdle(
      lang === 'en'
        ? 'Signed out successfully. Next student can sign in!'
        : 'Te-ai deconectat cu succes. Următorul elev se poate conecta!'
    );
  };

  const handleInCardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const cleanUser = loginUsername.trim();
    if (!cleanUser) {
      setLoginError(lang === 'en' ? 'Please enter your username!' : 'Introdu numele tău de elev!');
      sounds.playWrong();
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError(lang === 'en' ? 'Please enter your password!' : 'Introdu parola contului!');
      sounds.playWrong();
      return;
    }

    setLoginLoading(true);
    try {
      const res = await loginStudent(cleanUser, loginPassword.trim());
      if (!res.success || !res.profile) {
        setLoginError(res.error || (lang === 'en' ? 'Login failed!' : 'Autentificarea a eșuat!'));
        sounds.playWrong();
      } else {
        handleAuthSuccess(res.profile);
        setLoginPassword('');
        setLoginError('');
      }
    } catch {
      setLoginError(lang === 'en' ? 'Connection error. Try again!' : 'Eroare de conexiune. Încearcă din nou!');
      sounds.playWrong();
    } finally {
      setLoginLoading(false);
    }
  };

  const handleInCardRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    const cleanUser = registerUsername.trim();
    if (cleanUser.length < 2) {
      setRegisterError(lang === 'en' ? 'Name must be at least 2 characters!' : 'Numele trebuie să aibă minim 2 caractere!');
      sounds.playWrong();
      return;
    }
    if (registerPassword.trim().length < 3) {
      setRegisterError(lang === 'en' ? 'Password must be at least 3 characters!' : 'Parola trebuie să aibă minim 3 caractere!');
      sounds.playWrong();
      return;
    }

    setRegisterLoading(true);
    try {
      const res = await registerStudent(cleanUser, registerPassword.trim(), selectedAvatar);
      if (!res.success || !res.profile) {
        setRegisterError(res.error || (lang === 'en' ? 'Registration failed!' : 'Înregistrarea a eșuat!'));
        sounds.playWrong();
      } else {
        handleAuthSuccess(res.profile);
        setRegisterPassword('');
        setRegisterError('');
      }
    } catch {
      setRegisterError(lang === 'en' ? 'Connection error. Try again!' : 'Eroare de conexiune. Încearcă din nou!');
      sounds.playWrong();
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleInCardGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = nameInput.trim();
    if (clean.length > 0) {
      onSetStudentName(clean);
      setIsEditingName(false);
      setNameError(false);
      sounds.playCorrect();
      arky.triggerSuccess(
        lang === 'en'
          ? `Welcome, ${clean}! You are in Guest Mode (local storage).`
          : `Bun venit, ${clean}! Ești în Mod Vizitator (salvare locală).`
      );
    } else {
      setNameError(true);
      sounds.playWrong();
    }
  };

  const handleStartRename = () => {
    setRenameInput(studentName || activeAccount?.username || '');
    setRenameError('');
    setIsRenaming(true);
    sounds.playClick();
  };

  const handleSaveRename = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = renameInput.trim();
    if (clean.length < 2) {
      setRenameError(lang === 'en' ? 'Name must be at least 2 characters!' : 'Numele trebuie să aibă cel puțin 2 caractere!');
      sounds.playWrong();
      return;
    }

    if (activeAccount?.id) {
      setRenameLoading(true);
      setRenameError('');
      try {
        const res = await updateStudentUsername(activeAccount.id, clean);
        if (!res.success) {
          setRenameError(res.error || (lang === 'en' ? 'Name already taken or error.' : 'Numele este deja folosit de alt elev!'));
          sounds.playWrong();
          setRenameLoading(false);
          return;
        }
        setActiveAccount((prev) => (prev ? { ...prev, username: clean, usernameLower: clean.toLowerCase() } : null));
      } catch {
        setRenameError(lang === 'en' ? 'Connection error.' : 'Eroare de conexiune.');
        sounds.playWrong();
        setRenameLoading(false);
        return;
      }
      setRenameLoading(false);
    }

    onSetStudentName(clean);
    setNameInput(clean);
    setIsRenaming(false);
    sounds.playCorrect();
    arky.triggerSuccess(
      lang === 'en'
        ? `Name updated to "${clean}"!`
        : `Numele a fost actualizat la „${clean}”!`
    );
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
            <div className="bg-slate-900/95 backdrop-blur border-2 border-teal-500/40 rounded-3xl p-4 sm:p-6 shadow-xl max-w-2xl relative overflow-hidden">
              {/* Subtle tech background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

              {/* Pass Top Bar: Title UNUL SUB ALTUL + Status Badge (NO wrapping) */}
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5 mb-4">
                {/* Vertically stacked title */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shrink-0 shadow-sm">
                    <BadgeCheck className="w-5 h-5 text-teal-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-black tracking-wider text-teal-300 uppercase font-heading leading-tight">
                      {lang === 'en' ? 'Student Access Pass' : 'Legitimație Elev'}
                    </span>
                    <span className="text-[11px] font-mono font-medium text-slate-400">
                      {lang === 'en' ? 'Computer Lab Station' : 'Laborator TIC'}
                    </span>
                  </div>
                </div>

                {/* Right side: Status Badge & Exit button */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {activeAccount ? (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>{lang === 'en' ? 'CLOUD ACTIVE' : 'CONT ACTIVAT (CLOUD)'}</span>
                    </div>
                  ) : studentName ? (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/40 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      <span>{lang === 'en' ? 'GUEST (LOCAL)' : 'MOD VIZITATOR (LOCAL)'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-400 bg-slate-950/90 px-3 py-1 rounded-full border border-slate-700/80 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                      <span>{lang === 'en' ? 'NOT LOGGED IN' : 'NECONFIRMAT'}</span>
                    </div>
                  )}

                  {(activeAccount || studentName) && (
                    <button
                      onClick={handleLogout}
                      type="button"
                      className="flex items-center gap-1 text-[11px] font-mono font-bold text-rose-300 hover:text-white bg-rose-950/70 hover:bg-rose-900/90 px-2.5 py-1 rounded-full border border-rose-500/40 transition cursor-pointer shadow-sm"
                      title={lang === 'en' ? 'Sign out' : 'Deconectează contul'}
                    >
                      <LogOut className="w-3 h-3" />
                      <span>{lang === 'en' ? 'Exit' : 'Ieșire'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* CARD BODY */}
              {(activeAccount || (studentName && !isEditingName)) ? (
                /* Profile view when logged in or guest name confirmed */
                <div className="relative z-10 flex flex-col gap-4">
                  {/* Inline Renaming Panel */}
                  {isRenaming ? (
                    <form onSubmit={handleSaveRename} className="p-4 rounded-2xl bg-slate-950/90 border border-teal-500/40 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                          <Edit3 className="w-4 h-4" />
                          {lang === 'en' ? 'Change your student name:' : 'Schimbă numele tău de elev:'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsRenaming(false);
                            setRenameError('');
                          }}
                          className="text-[11px] text-slate-400 hover:text-white"
                        >
                          ✕ {lang === 'en' ? 'Cancel' : 'Anulează'}
                        </button>
                      </div>

                      {activeAccount && (
                        <p className="text-[11px] text-slate-400">
                          {lang === 'en'
                            ? 'We check in real-time that the new name is not already taken by another student.'
                            : 'Verificăm în timp real ca noul nume să nu fie deja folosit de alt elev.'}
                        </p>
                      )}

                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={renameInput}
                          onChange={(e) => {
                            setRenameInput(e.target.value);
                            if (renameError) setRenameError('');
                          }}
                          placeholder={lang === 'en' ? 'Enter new name...' : 'Scrie noul nume...'}
                          className="flex-1 bg-slate-900 border border-slate-700 focus:border-teal-400 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                          autoFocus
                        />
                        <button
                          type="submit"
                          disabled={renameLoading}
                          className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{renameLoading ? (lang === 'en' ? 'Saving...' : 'Se salvează...') : (lang === 'en' ? 'Save New Name' : 'Salvează Numele')}</span>
                        </button>
                      </div>

                      {renameError && (
                        <div className="text-xs text-rose-400 font-bold flex items-center gap-1.5 bg-rose-950/60 p-2.5 rounded-xl border border-rose-500/40">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{renameError}</span>
                        </div>
                      )}
                    </form>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        {/* Avatar Display with quick change toggle */}
                        <div className="relative group">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500/30 via-slate-800 to-emerald-500/30 border-2 border-teal-400/50 flex items-center justify-center text-3xl shadow-lg shadow-teal-900/40">
                            {selectedAvatar}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setIsSelectingAvatar(!isSelectingAvatar);
                              sounds.playClick();
                            }}
                            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-800 border border-teal-400/60 text-xs flex items-center justify-center text-teal-300 hover:text-white cursor-pointer shadow"
                            title={lang === 'en' ? 'Change avatar' : 'Schimbă avatarul'}
                          >
                            ✏️
                          </button>
                        </div>

                        <div>
                          <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5 flex-wrap">
                            <span>{t.helloStudent},</span>
                            <span className="text-[11px] font-mono text-teal-400/90 bg-teal-950/70 px-2 py-0.5 rounded-full border border-teal-500/30 font-bold">
                              {lang === 'en' ? 'Rank: Digital Cadet' : 'Grad: Cadet TIC'}
                            </span>
                            {activeAccount ? (
                              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                ☁️ Cloud Synced
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-500/20">
                                💻 Local PC Only
                              </span>
                            )}
                          </div>
                          <div className="text-lg sm:text-xl font-black text-white font-heading tracking-wide flex items-center gap-2">
                            <span>{studentName || activeAccount?.username}</span>
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {activeAccount
                              ? (lang === 'en' ? 'All scores and diplomas automatically saved.' : 'Punctajele și diplomele sunt salvate în cloud.')
                              : (lang === 'en' ? 'Guest session on this PC. Ready for challenges!' : 'Sesiune vizitator pe acest calculator.')}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        <button
                          type="button"
                          onClick={handleStartRename}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition border border-slate-700 cursor-pointer shadow-sm flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{t.studentNameChangeBtn}</span>
                        </button>

                        {activeMissionId && (
                          <button
                            type="button"
                            onClick={() => handleAttemptStart(activeMissionId)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-teal-600/30 cursor-pointer active:scale-95 animate-pulse"
                          >
                            <span>{lang === 'en' ? 'Resume Mission' : 'Reia Misiunea'}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Quick Avatar Selector Drawer if open */}
                  {isSelectingAvatar && (
                    <div className="p-3 bg-slate-950/90 rounded-2xl border border-slate-800 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                        <span>{lang === 'en' ? 'Choose an avatar:' : 'Alege un nou avatar:'}</span>
                        <button
                          type="button"
                          onClick={() => setIsSelectingAvatar(false)}
                          className="text-slate-400 hover:text-white text-xs"
                        >
                          ✕ {lang === 'en' ? 'Done' : 'Închide'}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {AVATARS.map((av) => (
                          <button
                            key={av.emoji}
                            type="button"
                            onClick={() => handleSelectAvatar(av.emoji)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition cursor-pointer shrink-0 ${
                              selectedAvatar === av.emoji
                                ? 'bg-teal-500 text-white ring-2 ring-teal-300 scale-110 shadow-md'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                            }`}
                            title={lang === 'en' ? av.labelEn : av.labelRo}
                          >
                            {av.emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Encouragement for Guests to Create an Account */}
                  {!activeAccount && (
                    <div className="mt-1 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-amber-200/90 bg-amber-950/30 -mx-1 p-2.5 rounded-xl border border-amber-500/20">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>
                          {lang === 'en'
                            ? 'Scores are saved only if you sign in. Create an account to rank on the classroom board!'
                            : 'Punctajul se salvează doar dacă ai cont. Creează cont pentru a intra în clasament!'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingName(true);
                          setPassMode('register');
                          setRegisterUsername(studentName);
                          sounds.playClick();
                        }}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-lg shadow transition cursor-pointer self-start sm:self-auto shrink-0"
                      >
                        {lang === 'en' ? 'Create Account' : 'Creează Cont'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Choice Form: Autentificare / Cont Nou / Fără Cont */
                <div className="relative z-10 flex flex-col gap-3.5">
                  {/* The 3 Prominent Option Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {/* Autentificare */}
                    <button
                      type="button"
                      onClick={() => {
                        setPassMode('login');
                        setLoginError('');
                        setRegisterError('');
                        sounds.playClick();
                      }}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                        passMode === 'login'
                          ? 'bg-gradient-to-b from-teal-500 to-teal-600 text-white border-teal-300 shadow-lg shadow-teal-500/30 scale-[1.02]'
                          : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-teal-500/50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1 ${
                        passMode === 'login' ? 'bg-white/20 text-white' : 'bg-teal-500/15 text-teal-400'
                      }`}>
                        <LogIn className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wide">
                        {lang === 'en' ? 'Sign In' : 'Autentificare'}
                      </span>
                      <span className={`text-[10px] mt-0.5 ${passMode === 'login' ? 'text-teal-100 font-medium' : 'text-slate-400'}`}>
                        {lang === 'en' ? 'I have an account' : 'Am deja cont'}
                      </span>
                    </button>

                    {/* Cont Nou */}
                    <button
                      type="button"
                      onClick={() => {
                        setPassMode('register');
                        setLoginError('');
                        setRegisterError('');
                        sounds.playClick();
                      }}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                        passMode === 'register'
                          ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/30 scale-[1.02]'
                          : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-amber-500/50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1 ${
                        passMode === 'register' ? 'bg-black/15 text-slate-950' : 'bg-amber-500/15 text-amber-400'
                      }`}>
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wide">
                        {lang === 'en' ? 'New Account' : 'Cont Nou'}
                      </span>
                      <span className={`text-[10px] mt-0.5 ${passMode === 'register' ? 'text-amber-950 font-bold' : 'text-slate-400'}`}>
                        {lang === 'en' ? 'Save scores in cloud' : 'Salvare punctaj cloud'}
                      </span>
                    </button>

                    {/* Fără Cont */}
                    <button
                      type="button"
                      onClick={() => {
                        setPassMode('guest');
                        setLoginError('');
                        setRegisterError('');
                        sounds.playClick();
                      }}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                        passMode === 'guest'
                          ? 'bg-slate-800 text-white border-slate-500 shadow-md scale-[1.02]'
                          : 'bg-slate-950/80 hover:bg-slate-800 text-slate-400 border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center mb-1 text-slate-300">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wide">
                        {lang === 'en' ? 'No Account' : 'Fără Cont'}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        {lang === 'en' ? 'Temporary guest' : 'Mod Vizitator local'}
                      </span>
                    </button>
                  </div>

                  {/* MODE 1: LOGIN FORM */}
                  {passMode === 'login' && (
                    <form onSubmit={handleInCardLogin} className="flex flex-col gap-3 p-3.5 bg-slate-950/60 rounded-2xl border border-teal-500/20">
                      <div className="flex items-start gap-2 text-xs text-teal-200/90 mb-1">
                        <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                        <span>
                          {lang === 'en'
                            ? 'Your score is saved only if you sign in with your account. Recommended: Sign in or create an account.'
                            : 'Punctajul va fi salvat doar dacă te autentifici cu contul tău. Recomandare: autentificare sau cont nou.'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <User className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            value={loginUsername}
                            onChange={(e) => {
                              setLoginUsername(e.target.value);
                              if (loginError) setLoginError('');
                            }}
                            placeholder={lang === 'en' ? 'Student username...' : 'Nume elev (ex: Andrei_Popa)...'}
                            className="w-full bg-slate-900 border border-slate-700 pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                            autoFocus
                          />
                        </div>

                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Lock className="w-4 h-4" />
                          </div>
                          <input
                            type={showLoginPassword ? 'text' : 'password'}
                            value={loginPassword}
                            onChange={(e) => {
                              setLoginPassword(e.target.value);
                              if (loginError) setLoginError('');
                            }}
                            placeholder={lang === 'en' ? 'Password...' : 'Parola contului...'}
                            className="w-full bg-slate-900 border border-slate-700 pl-9 pr-8 py-2 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                          />
                          <button
                            type="button"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-white"
                          >
                            {showLoginPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {loginError && (
                        <div className="text-xs text-rose-400 font-bold flex items-center gap-1.5 bg-rose-950/60 p-2 rounded-xl border border-rose-500/40">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{loginError}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setPassMode('register');
                            setLoginError('');
                            sounds.playClick();
                          }}
                          className="text-xs text-teal-400 hover:text-teal-300 underline underline-offset-2 cursor-pointer"
                        >
                          {lang === 'en' ? "Don't have an account? Create one!" : 'Nu ai cont? Creează cont nou!'}
                        </button>
                        <button
                          type="submit"
                          disabled={loginLoading}
                          className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs sm:text-sm transition flex items-center gap-1.5 shadow-md shadow-teal-500/30 cursor-pointer disabled:opacity-50"
                        >
                          <LogIn className="w-4 h-4" />
                          <span>{loginLoading ? (lang === 'en' ? 'Connecting...' : 'Se conectează...') : (lang === 'en' ? 'Sign In to Station' : 'Conectează-te la Calculator')}</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* MODE 2: REGISTER FORM WITH DUPLICATE USERNAME CHECK */}
                  {passMode === 'register' && (
                    <form onSubmit={handleInCardRegister} className="flex flex-col gap-3 p-3.5 bg-slate-950/60 rounded-2xl border border-amber-500/20">
                      <div className="flex items-start gap-2 text-xs text-amber-200/90 mb-1">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>
                          {lang === 'en'
                            ? 'Create your free account. Your scores at all 10 arcade games and lesson progress follow you on any PC in the lab!'
                            : 'Creează contul tău: punctajele la cele 10 jocuri și progresul la lecții se salvează automat și te urmează pe orice calculator din laborator!'}
                        </span>
                      </div>

                      {/* 1. Choose Avatar */}
                      <div>
                        <p className="text-xs font-semibold text-slate-300 mb-1.5">
                          {lang === 'en' ? '1. Choose your explorer avatar:' : '1. Alege avatarul tău de explorator:'}
                        </p>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                          {AVATARS.map((av) => (
                            <button
                              key={av.emoji}
                              type="button"
                              onClick={() => handleSelectAvatar(av.emoji)}
                              className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition cursor-pointer shrink-0 ${
                                selectedAvatar === av.emoji
                                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 scale-110 shadow-md font-bold'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                              }`}
                              title={lang === 'en' ? av.labelEn : av.labelRo}
                            >
                              {av.emoji}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 2. Choose Username & Password */}
                      <div>
                        <p className="text-xs font-semibold text-slate-300 mb-1.5">
                          {lang === 'en' ? '2. Username and simple password:' : '2. Nume de elev și parolă simplă:'}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                              <User className="w-4 h-4" />
                            </div>
                            <input
                              type="text"
                              value={registerUsername}
                              onChange={(e) => {
                                setRegisterUsername(e.target.value);
                                if (registerError) setRegisterError('');
                              }}
                              placeholder={lang === 'en' ? 'Choose unique name...' : 'Alege nume (ex: Maria_Popescu)...'}
                              className="w-full bg-slate-900 border border-slate-700 pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                              autoFocus
                            />
                          </div>

                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                              <Lock className="w-4 h-4" />
                            </div>
                            <input
                              type={showRegisterPassword ? 'text' : 'password'}
                              value={registerPassword}
                              onChange={(e) => {
                                setRegisterPassword(e.target.value);
                                if (registerError) setRegisterError('');
                              }}
                              placeholder={lang === 'en' ? 'Choose password (min 3)...' : 'Alege o parolă (ex: 1234)...'}
                              className="w-full bg-slate-900 border border-slate-700 pl-9 pr-8 py-2 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                            />
                            <button
                              type="button"
                              onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-white"
                            >
                              {showRegisterPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {registerError && (
                        <div className="text-xs text-rose-300 font-bold flex items-start gap-2 bg-rose-950/70 p-2.5 rounded-xl border border-rose-500/50">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                          <span>{registerError}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setPassMode('login');
                            setRegisterError('');
                            sounds.playClick();
                          }}
                          className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2 cursor-pointer"
                        >
                          {lang === 'en' ? 'Already have an account? Sign in!' : 'Ai deja cont? Autentifică-te!'}
                        </button>
                        <button
                          type="submit"
                          disabled={registerLoading}
                          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition flex items-center gap-1.5 shadow-md shadow-amber-500/30 cursor-pointer disabled:opacity-50"
                        >
                          <KeyRound className="w-4 h-4" />
                          <span>{registerLoading ? (lang === 'en' ? 'Creating...' : 'Se creează...') : (lang === 'en' ? 'Create My Account' : 'Creează Contul Meu')}</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* MODE 3: GUEST FORM (FĂRĂ CONT) */}
                  {passMode === 'guest' && (
                    <form onSubmit={handleInCardGuestSubmit} className="flex flex-col gap-3 p-3.5 bg-slate-950/60 rounded-2xl border border-slate-700/50">
                      {/* Notice as requested: punctajul va fi salvat doar daca te autentifici cu contul tau. recomandare autentificare */}
                      <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-2.5 text-xs text-amber-200/90">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-amber-300">
                            {lang === 'en' ? 'Guest Mode Notice:' : 'Atenție Mod Vizitator:'}
                          </span>{' '}
                          {lang === 'en'
                            ? 'Your score is only saved temporarily on this PC. For permanent saving and classroom ranking, signing in with an account is recommended!'
                            : 'Punctajul va fi salvat doar dacă te autentifici cu contul tău! În modul vizitator, progresul este temporar doar pe acest calculator.'}
                        </div>
                      </div>

                      {/* 1. Choose Avatar */}
                      <div>
                        <p className="text-xs font-semibold text-slate-300 mb-1.5">
                          {lang === 'en' ? '1. Choose your explorer avatar:' : '1. Alege avatarul tău de explorator:'}
                        </p>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                          {AVATARS.map((av) => (
                            <button
                              key={av.emoji}
                              type="button"
                              onClick={() => handleSelectAvatar(av.emoji)}
                              className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition cursor-pointer shrink-0 ${
                                selectedAvatar === av.emoji
                                  ? 'bg-teal-500 text-white ring-2 ring-teal-300 scale-110 shadow-md font-bold'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                              }`}
                              title={lang === 'en' ? av.labelEn : av.labelRo}
                            >
                              {av.emoji}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 2. Guest Name Input */}
                      <div>
                        <p className="text-xs font-semibold text-slate-300 mb-1.5">
                          {lang === 'en' ? '2. Enter your temporary student name:' : '2. Introdu numele tău temporar de elev:'}
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
                              className={`w-full bg-slate-900 border pl-9 pr-3.5 py-2 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none ${
                                nameError ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-700 focus:border-teal-400'
                              }`}
                              autoFocus
                            />
                          </div>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shadow shrink-0 cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>{lang === 'en' ? 'Confirm (Guest)' : 'Confirmă Numele (Vizitator)'}</span>
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
              )}
            </div>

            {/* Quick Hero Highlights / Feature Anchor Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              {/* 1. Misiuni Practice */}
              <button
                id="hero-badge-misiuni"
                type="button"
                onClick={() => {
                  sounds.playClick();
                  const target = document.getElementById('sectiune-misiuni-practice');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="group flex items-center justify-between gap-2 px-3 py-2.5 rounded-2xl bg-teal-950/40 hover:bg-teal-900/60 border border-teal-500/40 hover:border-teal-300 text-xs text-teal-200 hover:text-white font-bold transition-all cursor-pointer active:scale-95 text-left shadow-sm hover:shadow-teal-500/20"
                title={lang === 'en' ? 'Jump to Practical Missions' : 'Mergi la Misiuni Practice'}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shrink-0 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">{lang === 'en' ? 'Missions' : 'Misiuni'}</span>
                </div>
                <ArrowRight className="w-3 h-3 text-teal-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>

              {/* 2. Jocuri Arcade */}
              <button
                id="hero-badge-arcade"
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenArcade?.();
                }}
                className="group flex items-center justify-between gap-2 px-3 py-2.5 rounded-2xl bg-indigo-950/50 hover:bg-indigo-900/70 border border-indigo-500/50 hover:border-indigo-300 text-xs text-indigo-200 hover:text-white font-bold transition-all cursor-pointer active:scale-95 text-left shadow-sm hover:shadow-indigo-500/20"
                title={lang === 'en' ? 'Open Arcade Games (13 Mini-Games)' : 'Deschide Jocurile Arcade (13 Mini-Jocuri)'}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/25 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shrink-0 group-hover:scale-110 transition-transform">
                    <Gamepad2 className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <span className="truncate">{lang === 'en' ? 'Arcade (13)' : 'Arcade (13)'}</span>
                </div>
                <ArrowRight className="w-3 h-3 text-indigo-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>

              {/* 3. Duel 1v1 Arena */}
              <button
                id="hero-badge-duel"
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenDuel?.();
                }}
                className="group flex items-center justify-between gap-2 px-3 py-2.5 rounded-2xl bg-rose-950/50 hover:bg-rose-900/70 border border-rose-500/50 hover:border-rose-300 text-xs text-rose-200 hover:text-white font-bold transition-all cursor-pointer active:scale-95 text-left shadow-sm hover:shadow-rose-500/20"
                title={lang === 'en' ? 'ARKEDO Duel Arena 1v1' : 'Arena Duelurilor 1v1'}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-rose-500/25 border border-rose-400/40 flex items-center justify-center text-rose-300 shrink-0 group-hover:scale-110 transition-transform">
                    <Swords className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <span className="truncate">{lang === 'en' ? 'Duel 1v1' : 'Duel 1v1'}</span>
                </div>
                <ArrowRight className="w-3 h-3 text-rose-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>

              {/* 4. Clasamente */}
              <button
                id="hero-badge-clasament"
                type="button"
                onClick={() => {
                  sounds.playClick();
                  const target = document.getElementById('sectiune-clasamente');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="group flex items-center justify-between gap-2 px-3 py-2.5 rounded-2xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 hover:border-amber-300 text-xs text-amber-200 hover:text-white font-bold transition-all cursor-pointer active:scale-95 text-left shadow-sm hover:shadow-amber-500/20"
                title={lang === 'en' ? 'Jump to Leaderboard' : 'Mergi la Clasamente Elevi'}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 group-hover:scale-110 transition-transform">
                    <Trophy className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">{lang === 'en' ? 'Top Elevi' : 'Top Elevi'}</span>
                </div>
                <ArrowRight className="w-3 h-3 text-amber-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
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
      <div id="sectiune-misiuni-practice" className="scroll-mt-6">
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

      {/* Duel 1v1 Arena Banner Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-rose-950/60 to-slate-900 border-2 border-rose-500/40 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shrink-0 mt-1 sm:mt-0 ring-2 ring-amber-400/30">
              <Swords className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">
                  {lang === 'en' ? 'Live Multiplayer Duel' : 'Duel Multiplayer 1v1 în Direct'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Cloud Realtime
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white font-heading mt-0.5">
                {lang === 'en' ? 'ARKEDO Duel Arena — 1v1 Classmate Battles' : 'Arena Duelurilor TIC — Concurs 1v1 între Colegi pe Calculatoare Diferite'}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {lang === 'en'
                  ? 'Create a game room with a 4-letter code or join your classmate’s challenge! Cyber Sprint typing race and Quiz Blitz live competition.'
                  : 'Creează o cameră cu cod de 4 litere sau intră în provocarea colegului tău! Cursă de tastare rapidă Cyber Sprint și bătălia creierelor Quiz Blitz.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onOpenDuel?.();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 via-amber-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 cursor-pointer shrink-0 active:scale-95"
          >
            <Swords className="w-4 h-4" />
            <span>{lang === 'en' ? 'Enter Duel Arena' : 'Intră în Arena Duel 1v1'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
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
                  {lang === 'en' ? '13 Mini-Games' : '13 Mini-Jocuri'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white font-heading mt-0.5">
                {lang === 'en' ? 'Cyber-Safe Sweeper, File-Drop (Tetris), Byte Slider, Pixeli RGB & PC Builder' : 'Căutătorul de Viruși (Minesweeper), File-Drop (Tetris), Byte Slider & Pixeli RGB'}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {lang === 'en'
                  ? 'Master cybersecurity with Virus Sweeper, sort file extensions with Tetris drop, mix RGB pixel lights, assemble PC motherboards, and block malware in the firewall!'
                  : 'Stăpânește securitatea cibernetică cu Căutătorul de Viruși, extensiile de fișiere cu Tetris File-Drop, sinteza luminii RGB, asamblarea PC-urilor și firewall-ul!'}
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

      {/* Public Classroom Leaderboard Section */}
      <div id="sectiune-clasamente" className="scroll-mt-6">
        <LeaderboardSection
          currentStudentName={studentName}
          onOpenArcade={onOpenArcade}
          onOpenLoginModal={() => {
            setAuthModalMode('login');
            setAuthModalOpen(true);
          }}
        />
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

      {/* Student Cloud Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />

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
