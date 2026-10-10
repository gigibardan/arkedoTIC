import React, { useState, useEffect } from 'react';
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
  ShoppingBag,
  Coins,
  Building2,
  Presentation,
  Film,
  Box,
  Mail,
  Repeat,
  Layers,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useArky } from '../context/ArkyContext';
import { sounds } from '../utils/audio';
import { KnowledgePills } from './hardware/KnowledgePills';
import { MissionGuardModal } from './MissionGuardModal';
import { CourseCurriculaModal } from './CourseCurriculaModal';
import { CURRICULA_MODULES, CurriculaModule } from '../data/curriculaData';
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
import { getCyberCityData } from '../lib/cyberCityService';
import { calculateCityMetrics } from '../lib/cyberCityCatalog';

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
  onSelectMission: (missionId: 'hardware' | 'files' | 'internet1' | 'internet2' | 'text1' | 'text2' | 'algo1' | 'algo2' | 'scratch1' | 'scratch2' | 'g6_presentation1' | 'g6_presentation2' | 'g6_paint3d') => void;
  activeMissionId: 'hardware' | 'files' | 'internet1' | 'internet2' | 'text1' | 'text2' | 'algo1' | 'algo2' | 'scratch1' | 'scratch2' | 'g6_presentation1' | 'g6_presentation2' | 'g6_paint3d' | null;
  activeMissionLevel: number;
  activeMissionScore: number;
  elapsedSeconds: number;
  completedMissions?: Record<string, boolean>;
  onResetActiveMission: () => void;
  onOpenTeacherPortal?: () => void;
  onOpenSuperAdmin?: () => void;
  onOpenArcade?: () => void;
  onOpenDuel?: () => void;
  onOpenCity?: () => void;
  onOpenShop?: () => void;
  byteCoins?: number;
}

export const CoursesCatalog: React.FC<CoursesCatalogProps> = ({
  studentName,
  onSetStudentName,
  onSelectMission,
  activeMissionId,
  activeMissionLevel,
  activeMissionScore,
  elapsedSeconds,
  completedMissions = {},
  onResetActiveMission,
  onOpenTeacherPortal,
  onOpenSuperAdmin,
  onOpenArcade,
  onOpenDuel,
  onOpenCity,
  onOpenShop,
  byteCoins,
}) => {
  const isMissionDone = (mId: string): boolean => {
    try {
      if (localStorage.getItem(`arkedo_completed_${mId}`) === 'true') return true;
      if (mId === 'hardware' && (localStorage.getItem('arkedo_hw_level') === '6' || Number(localStorage.getItem('arkedo_hw_score') || '0') >= 100)) return true;
      if (mId === 'files' && (localStorage.getItem('arkedo_files_level') === '8' || Number(localStorage.getItem('arkedo_files_score') || '0') >= 100)) return true;
      if (mId === 'internet1' && (localStorage.getItem('arkedo_internet1_level') === '7' || Number(localStorage.getItem('arkedo_internet1_score') || '0') >= 100)) return true;
      if (mId === 'internet2' && (localStorage.getItem('arkedo_internet2_level') === '7' || Number(localStorage.getItem('arkedo_internet2_score') || '0') >= 100)) return true;
      if (mId === 'text1' && (localStorage.getItem('arkedo_text1_level') === '8' || Number(localStorage.getItem('arkedo_text1_score') || '0') >= 100)) return true;
      if (mId === 'text2' && (localStorage.getItem('arkedo_text2_level') === '8' || Number(localStorage.getItem('arkedo_text2_score') || '0') >= 100)) return true;
      if (mId === 'algo1' && (localStorage.getItem('arkedo_algo1_level') === '8' || Number(localStorage.getItem('arkedo_algo1_score') || '0') >= 100)) return true;
      if (mId === 'algo2' && (localStorage.getItem('arkedo_algo2_level') === '8' || Number(localStorage.getItem('arkedo_algo2_score') || '0') >= 100)) return true;
      if (mId === 'scratch1' && (localStorage.getItem('arkedo_scratch1_level') === '8' || Number(localStorage.getItem('arkedo_scratch1_score') || '0') >= 100)) return true;
      if (mId === 'scratch2' && (localStorage.getItem('arkedo_scratch2_level') === '8' || Number(localStorage.getItem('arkedo_scratch2_score') || '0') >= 100)) return true;
      if (mId === 'g6_presentation1' && (localStorage.getItem('arkedo_g6p1_level') === '8' || Number(localStorage.getItem('arkedo_g6p1_score') || '0') >= 100)) return true;
      if (mId === 'g6_presentation2' && (localStorage.getItem('arkedo_g6p2_level') === '8' || Number(localStorage.getItem('arkedo_g6p2_score') || '0') >= 100)) return true;
      if (mId === 'g6_paint3d' && (localStorage.getItem('arkedo_g6p3_level') === '8' || Number(localStorage.getItem('arkedo_g6p3_score') || '0') >= 100)) return true;
    } catch {}
    if (completedMissions && completedMissions[mId]) return true;
    if (activeMissionId === mId && activeMissionLevel > getMaxPlayableLevels(mId)) return true;
    const activeStudent = getActiveStudent();
    if (activeStudent?.lessonsProgress) {
      const lp = activeStudent.lessonsProgress;
      const lessonKey = mId === 'g6_presentation1' ? 'presentation1' : mId === 'g6_presentation2' ? 'presentation2' : mId === 'g6_paint3d' ? 'model3d1' : mId;
      if (lp[lessonKey]?.completed || (lp[lessonKey]?.score || 0) >= 100) return true;
    }
    return false;
  };

  const getMaxPlayableLevels = (mId: string): number => {
    if (mId === 'hardware') return 5;
    if (mId === 'internet1' || mId === 'internet2') return 6;
    return 7;
  };
  const { t, lang } = useLanguage();
  const arky = useArky();
  const [activeAccount, setActiveAccount] = useState<StudentProfile | null>(() => {
    const act = getActiveStudent();
    if (act && act.username.trim().toUpperCase() === 'PRO') {
      return null;
    }
    return act;
  });
  const [nameInput, setNameInput] = useState<string>(() => {
    if (studentName?.trim().toUpperCase() === 'PRO') return '';
    return studentName || activeAccount?.username || '';
  });
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
  const [pendingTargetMission, setPendingTargetMission] = useState<'hardware' | 'files' | 'internet1' | 'internet2' | 'text1' | 'text2' | 'algo1' | 'algo2' | 'scratch1' | 'scratch2' | 'g6_presentation1' | 'g6_presentation2' | 'g6_paint3d' | null>(null);

  // Curricula Syllabus Modal state & SEO deep-linking
  const [selectedCurriculaModule, setSelectedCurriculaModule] = useState<CurriculaModule | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkCurriculaHash = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#curricula-')) {
        const rawId = hash.replace('#curricula-', '').toLowerCase();
        const found = CURRICULA_MODULES.find(
          (m) => m.id === rawId || m.missionId === rawId || m.slug === rawId || rawId.includes(m.id)
        );
        if (found) {
          setSelectedCurriculaModule(found);
        }
      }
    };
    checkCurriculaHash();
    window.addEventListener('hashchange', checkCurriculaHash);
    return () => window.removeEventListener('hashchange', checkCurriculaHash);
  }, []);

  const openCurriculaModal = (targetId: string) => {
    sounds.playClick();
    const found = CURRICULA_MODULES.find(
      (m) => m.id === targetId || m.missionId === targetId || m.slug.includes(targetId) || targetId.includes(m.id)
    );
    if (found) {
      setSelectedCurriculaModule(found);
      try {
        window.history.replaceState(null, '', `#curricula-${found.id}`);
      } catch {}
    }
  };

  // Grade Switcher state: default to 'grade5' ("default ramane deschis pe clasa a 5-a")
  const [selectedGrade, setSelectedGrade] = useState<'grade5' | 'grade6'>(() => {
    try {
      const saved = localStorage.getItem('arkedo_selected_grade');
      if (saved === 'grade6') return 'grade6';
    } catch {
      // Ignore
    }
    return 'grade5';
  });

  const handleSelectGrade = (grade: 'grade5' | 'grade6') => {
    sounds.playClick();
    setSelectedGrade(grade);
    try {
      localStorage.setItem('arkedo_selected_grade', grade);
    } catch {
      // Ignore
    }
  };

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

  const handleAttemptStart = (targetMission: 'hardware' | 'files' | 'internet1' | 'internet2' | 'text1' | 'text2' | 'algo1' | 'algo2' | 'scratch1' | 'scratch2' | 'g6_presentation1' | 'g6_presentation2' | 'g6_paint3d') => {
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
    // Only guard if user has an active mission in progress that is NOT completed, different from target, and mid-way
    const isCurrentActiveDone = activeMissionId ? isMissionDone(activeMissionId) : false;
    const maxLevels = activeMissionId ? getMaxPlayableLevels(activeMissionId) : 5;
    const hasMissionInProgress =
      activeMissionId !== null &&
      activeMissionId !== targetMission &&
      !isCurrentActiveDone &&
      activeMissionLevel > 1 &&
      activeMissionLevel <= maxLevels;

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

  const getMissionTitle = (id: 'hardware' | 'files' | 'internet1' | 'internet2' | 'text1' | 'text2' | 'algo1' | 'algo2' | 'scratch1' | 'scratch2' | 'g6_presentation1' | 'g6_presentation2' | 'g6_paint3d' | null) => {
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
    if (id === 'text1') {
      return lang === 'en'
        ? 'Module 4A: Word Processor & Text Formatting (Textbook p. 50-67)'
        : 'Modulul 4A: Inițierea și Formatarea Textului (Manual pag. 50-67)';
    }
    if (id === 'text2') {
      return lang === 'en'
        ? 'Module 4B: Visual Elements & Tables (Textbook p. 68-80)'
        : 'Modulul 4B: Elemente Grafice, Tabele & Paginare (Manual pag. 68-80)';
    }
    if (id === 'algo1') {
      return lang === 'en'
        ? 'Module 5A: Algorithm Fundamentals & Sequential Logic (Textbook p. 54-61)'
        : 'Modulul 5A: Noțiunea de Algoritm & Algoritmi Secvențiali (Manual pag. 54-61)';
    }
    if (id === 'algo2') {
      return lang === 'en'
        ? 'Module 5B: Decisions, Data Types & Flowcharts (Textbook p. 62-71)'
        : 'Modulul 5B: Structuri Decizionale, Date & Scheme Logice (Manual pag. 62-71)';
    }
    if (id === 'scratch1') {
      return lang === 'en'
        ? 'Module 6A: Scratch 3.0 Environment, Linear Movement & Variables (Textbook p. 72-90)'
        : 'Modulul 6A: Mediul Scratch, Mișcare Liniară & Variabile (Manual pag. 72-90)';
    }
    if (id === 'scratch2') {
      return lang === 'en'
        ? 'Module 6B: Scratch Decisions, Music, Contest Games & Grand Exam (Textbook p. 84-93)'
        : 'Modulul 6B: Decizii, Muzică, Concurs de Jocuri & Marea Evaluare (Manual pag. 84-93)';
    }
    if (id === 'g6_presentation1') {
      return lang === 'en'
        ? 'Grade 6 • Module 1A: Presentation & PowerPoint Interface (Textbook p. 10-15)'
        : 'Clasa a VI-a • Modulul 1A: Prezentarea & Interfața PowerPoint (Manual pag. 10-15)';
    }
    if (id === 'g6_presentation2') {
      return lang === 'en'
        ? 'Grade 6 • Module 1B: Slide Creation, Design, Animations & Public Speaking (Textbook p. 16-25)'
        : 'Clasa a VI-a • Modulul 1B: Realizare, Design, Animații & Public Speaking (Manual pag. 16-25)';
    }
    if (id === 'g6_paint3d') {
      return lang === 'en'
        ? 'Grade 6 • Module 2A: 3D Modeling in Paint 3D (Textbook p. 26-33)'
        : 'Clasa a VI-a • Modulul 2A: Modelare 3D în Paint 3D (Manual pag. 26-33)';
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
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight leading-snug sm:leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-200">
                  {lang === 'en' ? 'ICT' : 'TIC'}
                </span>
                <span className="text-slate-400 font-light mx-2">–</span>
                {lang === 'en' ? (
                  <span className="text-white">
                    <span>Information & Communications</span>{' '}
                    <span className="whitespace-nowrap sm:whitespace-normal">Technology</span>
                  </span>
                ) : (
                  <span className="text-white">
                    <span>Tehnologia Informației</span>{' '}
                    <span className="whitespace-nowrap sm:whitespace-normal">și a Comunicațiilor</span>
                  </span>
                )}
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

                        {activeMissionId && !isMissionDone(activeMissionId) && activeMissionLevel > 1 && (
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

                  {/* Player Stats & Economy Pill Grid (Total Points & Cyber City Funds) */}
                  {(() => {
                    const activeCity = activeAccount?.cyberCity || getCyberCityData();
                    const cityMetrics = calculateCityMetrics(activeCity);
                    const totalPoints = activeAccount?.totalXP || (activeAccount ? (activeAccount.arcadeScores?.totalArcade || 0) + (activeAccount.lessonsProgress?.totalLessonScore || 0) : 0);
                    const cityCoins = activeAccount?.byteCoins ?? 0;

                    return (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 pt-3.5 border-t border-slate-800/80">
                        {/* Stat 1: Total Points (XP) */}
                        <div className="p-3 rounded-2xl bg-gradient-to-b from-amber-950/40 to-slate-950/90 border border-amber-500/30 flex items-center gap-2.5 shadow-inner">
                          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold shrink-0 shadow-sm text-base">
                            ⭐
                          </div>
                          <div className="min-w-0">
                            <div className="text-[10px] text-amber-300/90 font-mono uppercase font-bold tracking-wider">{lang === 'en' ? 'Total Points' : 'Puncte Elev'}</div>
                            <div className="text-sm sm:text-base font-black text-amber-300 font-heading truncate">
                              {totalPoints.toLocaleString()} XP
                            </div>
                            <div className="text-[9px] text-slate-400 font-mono">{lang === 'en' ? 'Lessons & Arcade' : 'Lecții + Jocuri'}</div>
                          </div>
                        </div>

                        {/* Stat 2: Cyber City Funds (Bani de Oraș) */}
                        <div className="p-3 rounded-2xl bg-gradient-to-b from-purple-950/40 to-slate-950/90 border border-purple-500/30 flex items-center gap-2.5 shadow-inner">
                          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 font-bold shrink-0 shadow-sm text-base">
                            🪙
                          </div>
                          <div className="min-w-0">
                            <div className="text-[10px] text-purple-300/90 font-mono uppercase font-bold tracking-wider">{lang === 'en' ? 'City Funds' : 'Bani de Oraș'}</div>
                            <div className="text-sm sm:text-base font-black text-purple-200 font-heading truncate">
                              {cityCoins.toLocaleString()} <span className="text-[10px] font-normal text-purple-300">Coins</span>
                            </div>
                            <div className="text-[9px] text-slate-400 font-mono">{lang === 'en' ? 'CyberCity Wallet' : 'Portofel CyberCity'}</div>
                          </div>
                        </div>

                        {/* Stat 3: Cyber City Status & Rank */}
                        <div className="p-3 rounded-2xl bg-gradient-to-b from-cyan-950/40 to-slate-950/90 border border-cyan-500/30 flex items-center gap-2.5 col-span-2 sm:col-span-1 shadow-inner">
                          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold shrink-0 shadow-sm text-base">
                            🏙️
                          </div>
                          <div className="min-w-0">
                            <div className="text-[10px] text-cyan-300/90 font-mono uppercase font-bold tracking-wider">{lang === 'en' ? 'Cyber City' : 'Metropolă TIC'}</div>
                            <div className="text-sm sm:text-base font-black text-cyan-200 font-heading truncate">
                              {cityMetrics.cityScore.toLocaleString()} <span className="text-[10px] font-normal text-cyan-300">pts</span>
                            </div>
                            <div className="text-[9px] text-cyan-400/80 font-mono truncate">⚡ {lang === 'en' ? (cityMetrics.cityRankTitleEn || cityMetrics.cityRankTitle) : (cityMetrics.cityRankTitleRo || cityMetrics.cityRankTitle)}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

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
                            ? 'Create your free account. Your scores at all 16 arcade games and lesson progress follow you on any PC in the lab!'
                            : 'Creează contul tău: punctajele la cele 16 jocuri și progresul la lecții se salvează automat și te urmează pe orice calculator din laborator!'}
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
                title={lang === 'en' ? 'Open Arcade Games (16 Mini-Games)' : 'Deschide Jocurile Arcade (16 Mini-Jocuri)'}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/25 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shrink-0 group-hover:scale-110 transition-transform">
                    <Gamepad2 className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <span className="truncate">{lang === 'en' ? 'Arcade (16)' : 'Arcade (16)'}</span>
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
                title={lang === 'en' ? 'ArkyEdu Duel Arena 1v1' : 'Arena Duelurilor 1v1'}
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

      {/* Grade Selector Switcher (Clasa a V-a vs Clasa a VI-a) - Under Knowledge Pills */}
      <div id="comutator-clasa" className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-2 border-slate-700/80 rounded-3xl p-3.5 sm:p-5 shadow-2xl backdrop-blur relative overflow-hidden">
        {/* Ambient subtle glow */}
        <div className="absolute top-0 right-1/4 w-72 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none -z-0"></div>

        <div className="relative z-10 flex flex-col gap-3.5">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <School className="w-4 h-4 text-teal-400" />
                {lang === 'en' ? 'Select Academic Grade Level (Official Art Klett Textbook)' : 'Comutator Nivel Gimnaziu • Programa Oficială Art Klett'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{lang === 'en' ? 'Curriculum 2026 Aligned' : 'Conform OME 5022/2023'}</span>
            </div>
          </div>

          {/* Large Tactile Switcher Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Tab 1: Clasa a V-a */}
            <button
              type="button"
              onClick={() => handleSelectGrade('grade5')}
              className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                selectedGrade === 'grade5'
                  ? 'bg-gradient-to-br from-teal-950/80 via-slate-900 to-emerald-950/60 border-teal-400 shadow-xl shadow-teal-500/20 ring-2 ring-teal-400/30'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60 text-slate-400'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner ${
                    selectedGrade === 'grade5'
                      ? 'bg-teal-500/25 border border-teal-400/50 text-teal-200'
                      : 'bg-slate-800 border border-slate-700 text-slate-400'
                  }`}>
                    🏫
                  </div>
                  <div>
                    <h3 className={`text-base sm:text-lg font-black font-heading ${
                      selectedGrade === 'grade5' ? 'text-white' : 'text-slate-300'
                    }`}>
                      {lang === 'en' ? '5th Grade (Clasa a V-a)' : 'Clasa a V-a'}
                    </h3>
                    <div className="text-[11px] font-mono font-bold text-teal-400">
                      {lang === 'en' ? 'Complete Curriculum • 10 Missions' : 'Materia Completă • 10 Misiuni Active'}
                    </div>
                  </div>
                </div>

                <div className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border shrink-0 ${
                  selectedGrade === 'grade5'
                    ? 'bg-teal-500/20 border-teal-400 text-teal-300 animate-pulse'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                  {selectedGrade === 'grade5' ? (lang === 'en' ? '✓ ACTIVE' : '✓ ACTIVĂ') : (lang === 'en' ? 'Select' : 'Selectează')}
                </div>
              </div>

              <p className={`text-xs leading-relaxed ${selectedGrade === 'grade5' ? 'text-slate-200' : 'text-slate-400'}`}>
                {lang === 'en'
                  ? 'Hardware PC, Secret File Tree, Internet 3A & 3B, Word Formatting 4A & 4B, Sequential Algo 5A, Decisions 5B, Scratch 6A & 6B.'
                  : 'Sisteme de calcul, Arborele de fișiere, Internet 3A & 3B, Tehnoredactare Word 4A & 4B, Algoritmi 5A & 5B, Scratch 6A & 6B.'}
              </p>
            </button>

            {/* Tab 2: Clasa a VI-a */}
            <button
              type="button"
              onClick={() => handleSelectGrade('grade6')}
              className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                selectedGrade === 'grade6'
                  ? 'bg-gradient-to-br from-orange-950/80 via-slate-900 to-indigo-950/60 border-orange-400 shadow-xl shadow-orange-500/20 ring-2 ring-orange-400/30'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60 text-slate-400'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner ${
                    selectedGrade === 'grade6'
                      ? 'bg-orange-500/25 border border-orange-400/50 text-orange-200'
                      : 'bg-slate-800 border border-slate-700 text-slate-400'
                  }`}>
                    🚀
                  </div>
                  <div>
                    <h3 className={`text-base sm:text-lg font-black font-heading ${
                      selectedGrade === 'grade6' ? 'text-white' : 'text-slate-300'
                    }`}>
                      {lang === 'en' ? '6th Grade (Clasa a VI-a)' : 'Clasa a VI-a'}
                    </h3>
                    <div className="text-[11px] font-mono font-bold text-orange-400">
                      {lang === 'en' ? 'New Curriculum 2026 • 4 Units' : 'Curriculum Nou 2026 • 4 Mari Unități'}
                    </div>
                  </div>
                </div>

                <div className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border shrink-0 ${
                  selectedGrade === 'grade6'
                    ? 'bg-orange-500/20 border-orange-400 text-orange-300 animate-pulse'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                  {selectedGrade === 'grade6' ? (lang === 'en' ? '✓ ACTIVE' : '✓ ACTIVĂ') : (lang === 'en' ? 'Select' : 'Selectează')}
                </div>
              </div>

              <p className={`text-xs leading-relaxed ${selectedGrade === 'grade6' ? 'text-slate-200' : 'text-slate-400'}`}>
                {lang === 'en'
                  ? 'PowerPoint 1A & 1B, Paint 3D Modeling 2A, Toontastic & VR 2B, Malware Security 3A, Email 3B, Advanced Scratch Loops 4A & 4B.'
                  : 'Prezentări PowerPoint 1A & 1B, Modelare Paint 3D 2A, Toontastic & VR 2B, Securitate Malware 3A, E-mail 3B, Bucle Scratch 4A & 4B.'}
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Courses & Lessons Section - CLASA A V-A */}
      {selectedGrade === 'grade5' && (
      <div id="sectiune-misiuni-practice" className="scroll-mt-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg sm:text-2xl font-black text-white font-heading tracking-wide">
              {lang === 'en' ? 'Practical ICT Missions • 5th Grade (Art Klett)' : 'Misiuni Practice TIC • Clasa a V-a (Manual Art Klett)'}
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
            {lang === 'en' ? '10 Complete Interactive Missions Available' : '10 Misiuni Interactive Disponibile (Unitățile 1–6)'}
          </span>
        </div>

        {/* Lesson Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1 (NEW & FIRST): Modulul 1 - Sisteme de Calcul și Comunicații */}
          <div
            className={`group relative bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 rounded-3xl p-6 shadow-xl transition-all flex flex-col justify-between ${
              isMissionDone('hardware')
                ? 'border-emerald-500/80 shadow-emerald-500/10'
                : activeMissionId === 'hardware'
                ? 'border-teal-400 shadow-teal-500/20 ring-2 ring-teal-500/30'
                : 'border-teal-500/60 hover:border-teal-400 hover:shadow-teal-500/10'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                  💻
                </div>
                <div className="flex items-center gap-2">
                  {isMissionDone('hardware') ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-[11px] font-black uppercase tracking-wider font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'en' ? 'Completed • Grade 10' : 'Finalizat • Nota 10'}</span>
                    </span>
                  ) : activeMissionId === 'hardware' && activeMissionLevel > 1 ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black uppercase tracking-wider font-mono">
                      {lang === 'en' ? `In Progress (Level ${activeMissionLevel}/5)` : `În Curs (Nivel ${activeMissionLevel}/5)`}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> {lang === 'en' ? 'MODULE 1' : 'MODULUL 1'}
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
                {isMissionDone('hardware') ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5 font-mono">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'en' ? 'Diploma Earned (100 pts)' : 'Diplomă Obținută (100 pct)'}</span>
                  </span>
                ) : activeMissionId === 'hardware' && activeMissionLevel > 1 ? (
                  <span className="text-teal-400 font-bold">
                    {lang === 'en' ? `Progress: Level ${activeMissionLevel}/5 (${activeMissionScore} pts)` : `Progres: Nivel ${activeMissionLevel}/5 (${activeMissionScore} pct)`}
                  </span>
                ) : (
                  <span>{lang === 'en' ? '5 Interactive Levels' : '5 Niveluri interactive'}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openCurriculaModal('hardware')}
                  className="px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-sky-300 hover:text-white border border-sky-500/30 hover:border-sky-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Vezi programa școlară, teoria și fișa didactică"
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">{lang === 'en' ? 'Syllabus' : 'Programă & Teorie'}</span>
                </button>
                <button
                  onClick={() => handleAttemptStart('hardware')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer active:scale-95 shadow-lg ${
                  isMissionDone('hardware')
                    ? 'bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-emerald-500/50 hover:border-emerald-400 shadow-emerald-500/10'
                    : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-600/30'
                }`}
              >
                {isMissionDone('hardware') ? (
                  <>
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'en' ? 'View Diploma / Replay' : 'Vezi Diploma / Reia'}</span>
                  </>
                ) : activeMissionId === 'hardware' && activeMissionLevel > 1 ? (
                  <>
                    <span>{lang === 'en' ? 'Resume Hardware Mission' : 'Continuă Misiunea Hardware'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>{lang === 'en' ? 'Start Mission 1' : 'Începe Misiunea 1'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              </div>
            </div>
          </div>

          {/* Card 2: Modulul 2 - Organizarea Datelor • Arborele Secret */}
          <div
            className={`group relative bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 rounded-3xl p-6 shadow-xl transition-all flex flex-col justify-between ${
              isMissionDone('files')
                ? 'border-emerald-500/80 shadow-emerald-500/10'
                : activeMissionId === 'files'
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
                  {isMissionDone('files') ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-[11px] font-black uppercase tracking-wider font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'en' ? 'Completed • Grade 10' : 'Finalizat • Nota 10'}</span>
                    </span>
                  ) : activeMissionId === 'files' && activeMissionLevel > 1 ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black uppercase tracking-wider font-mono">
                      {lang === 'en' ? `In Progress (Level ${activeMissionLevel}/7)` : `În Curs (Nivel ${activeMissionLevel}/7)`}
                    </span>
                  ) : null}
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
                {isMissionDone('files') ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5 font-mono">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'en' ? 'Diploma Earned (100 pts)' : 'Diplomă Obținută (100 pct)'}</span>
                  </span>
                ) : activeMissionId === 'files' && activeMissionLevel > 1 ? (
                  <span className="text-emerald-400 font-bold">
                    {lang === 'en' ? `Progress: Level ${activeMissionLevel}/7 (${activeMissionScore} pts)` : `Progres: Nivel ${activeMissionLevel}/7 (${activeMissionScore} pct)`}
                  </span>
                ) : (
                  <span>{lang === 'en' ? '7 Practical Challenges' : '7 Provocări practice'}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openCurriculaModal('fisiere-so')}
                  className="px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-sky-300 hover:text-white border border-sky-500/30 hover:border-sky-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Vezi programa școlară, teoria și fișa didactică"
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">{lang === 'en' ? 'Syllabus' : 'Programă & Teorie'}</span>
                </button>
                <button
                  onClick={() => handleAttemptStart('files')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer active:scale-95 shadow-lg ${
                    isMissionDone('files')
                      ? 'bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-emerald-500/50 hover:border-emerald-400 shadow-emerald-500/10'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  }`}
                >
                  {isMissionDone('files') ? (
                    <>
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'en' ? 'View Diploma / Replay' : 'Vezi Diploma / Reia'}</span>
                    </>
                  ) : activeMissionId === 'files' && activeMissionLevel > 1 ? (
                    <>
                      <span>{lang === 'en' ? 'Resume Files Mission' : 'Continuă Misiunea Fișiere'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>{lang === 'en' ? 'Start Mission 2' : 'Începe Misiunea 2'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: ACTIVE MISSION 3A - Internet, Rețele & World Wide Web */}
          <div className={`relative group rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between ${
            isMissionDone('internet1')
              ? 'bg-slate-900/90 border-2 border-emerald-500/80 shadow-emerald-500/10'
              : 'bg-slate-900/80 border border-slate-700/80 hover:border-teal-500/80 hover:shadow-2xl hover:shadow-teal-500/10'
          }`}>
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-2xl border border-teal-500/30">
                  🌐
                </div>
                <div className="flex items-center gap-2">
                  {isMissionDone('internet1') ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-[11px] font-black uppercase tracking-wider font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'en' ? 'Completed • Grade 10' : 'Finalizat • Nota 10'}</span>
                    </span>
                  ) : activeMissionId === 'internet1' && activeMissionLevel > 1 ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black uppercase tracking-wider font-mono">
                      {lang === 'en' ? `In Progress (Page ${activeMissionLevel}/6)` : `În Curs (Pagina ${activeMissionLevel}/6)`}
                    </span>
                  ) : null}
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
                {isMissionDone('internet1') ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5 font-mono">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'en' ? 'Diploma Earned (100 pts)' : 'Diplomă Obținută (100 pct)'}</span>
                  </span>
                ) : activeMissionId === 'internet1' && activeMissionLevel > 1 ? (
                  <span className="text-teal-400 font-bold">
                    {lang === 'en' ? `Progress: Page ${activeMissionLevel}/6 (${activeMissionScore} pts)` : `Progres: Pagina ${activeMissionLevel}/6 (${activeMissionScore} pct)`}
                  </span>
                ) : (
                  <span>{lang === 'en' ? 'Theory + Interactive Tasks' : 'Teorie + Exerciții interactive'}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openCurriculaModal('internet-siguranta')}
                  className="px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-sky-300 hover:text-white border border-sky-500/30 hover:border-sky-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Vezi programa școlară, teoria și fișa didactică"
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">{lang === 'en' ? 'Syllabus' : 'Programă & Teorie'}</span>
                </button>
                <button
                  onClick={() => handleAttemptStart('internet1')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer active:scale-95 shadow-lg ${
                    isMissionDone('internet1')
                      ? 'bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-emerald-500/50 hover:border-emerald-400 shadow-emerald-500/10'
                      : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-600/30'
                  }`}
                >
                  {isMissionDone('internet1') ? (
                    <>
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'en' ? 'View Diploma / Replay' : 'Vezi Diploma / Reia'}</span>
                    </>
                  ) : activeMissionId === 'internet1' && activeMissionLevel > 1 ? (
                    <>
                      <span>{lang === 'en' ? 'Resume Internet 3A' : 'Continuă Misiunea 3A'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>{lang === 'en' ? 'Start Mission 3A' : 'Începe Misiunea 3A'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Card 4: ACTIVE MISSION 3B - Căutare Avansată, Comunicare & Identitate Digitală */}
          <div className={`relative group rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between ${
            isMissionDone('internet2')
              ? 'bg-slate-900/90 border-2 border-emerald-500/80 shadow-emerald-500/10'
              : 'bg-slate-900/80 border border-slate-700/80 hover:border-indigo-500/80 hover:shadow-2xl hover:shadow-indigo-500/10'
          }`}>
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl border border-indigo-500/30">
                  🔍
                </div>
                <div className="flex items-center gap-2">
                  {isMissionDone('internet2') ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-[11px] font-black uppercase tracking-wider font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'en' ? 'Completed • Grade 10' : 'Finalizat • Nota 10'}</span>
                    </span>
                  ) : activeMissionId === 'internet2' && activeMissionLevel > 1 ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black uppercase tracking-wider font-mono">
                      {lang === 'en' ? `In Progress (Level ${activeMissionLevel}/6)` : `În Curs (Nivel ${activeMissionLevel}/6)`}
                    </span>
                  ) : null}
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
                {isMissionDone('internet2') ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5 font-mono">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'en' ? 'Diploma Earned (100 pts)' : 'Diplomă Obținută (100 pct)'}</span>
                  </span>
                ) : activeMissionId === 'internet2' && activeMissionLevel > 1 ? (
                  <span className="text-indigo-400 font-bold">
                    {lang === 'en' ? `Progress: Level ${activeMissionLevel}/6 (${activeMissionScore} pts)` : `Progres: Nivel ${activeMissionLevel}/6 (${activeMissionScore} pct)`}
                  </span>
                ) : (
                  <span>{lang === 'en' ? 'Theory + Smart Simulator' : 'Teorie + Simulator Inteligent'}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openCurriculaModal('internet-siguranta')}
                  className="px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-sky-300 hover:text-white border border-sky-500/30 hover:border-sky-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Vezi programa școlară, teoria și fișa didactică"
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">{lang === 'en' ? 'Syllabus' : 'Programă & Teorie'}</span>
                </button>
                <button
                  onClick={() => handleAttemptStart('internet2')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer active:scale-95 shadow-lg ${
                    isMissionDone('internet2')
                      ? 'bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-emerald-500/50 hover:border-emerald-400 shadow-emerald-500/10'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                  }`}
                >
                  {isMissionDone('internet2') ? (
                    <>
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'en' ? 'View Diploma / Replay' : 'Vezi Diploma / Reia'}</span>
                    </>
                  ) : activeMissionId === 'internet2' && activeMissionLevel > 1 ? (
                    <>
                      <span>{lang === 'en' ? 'Resume Internet 3B' : 'Continuă Misiunea 3B'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>{lang === 'en' ? 'Start Mission 3B' : 'Începe Misiunea 3B'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Card 5: ACTIVE MISSION 4A - Procesorul de Text & Tehnoredactare */}
          <div
            className={`group relative bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 rounded-3xl p-6 shadow-xl transition-all flex flex-col justify-between ${
              isMissionDone('text1')
                ? 'border-emerald-500/80 shadow-emerald-500/10'
                : activeMissionId === 'text1'
                ? 'border-blue-400 shadow-blue-500/20 ring-2 ring-blue-500/30'
                : 'border-blue-500/60 hover:border-blue-400 hover:shadow-blue-500/10'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                  📝
                </div>
                <div className="flex items-center gap-2">
                  {isMissionDone('text1') ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-[11px] font-black uppercase tracking-wider font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'en' ? 'Completed • Grade 10' : 'Finalizat • Nota 10'}</span>
                    </span>
                  ) : activeMissionId === 'text1' && activeMissionLevel > 1 ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black uppercase tracking-wider font-mono">
                      {lang === 'en' ? `In Progress (Page ${activeMissionLevel}/7)` : `În Curs (Pagina ${activeMissionLevel}/7)`}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> {lang === 'en' ? 'MODULE 4A' : 'MODULUL 4A'}
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-1 font-mono">
                {lang === 'en' ? 'Textbook p. 50–67 • Mission 4A' : 'Manual pag. 50–67 • Misiunea 4A'}
              </div>

              <h3 className="text-xl font-black text-white font-heading mb-1 group-hover:text-blue-300 transition-colors">
                {lang === 'en' ? 'Word Processor & Text Formatting Mission' : 'Misiunea Procesorul de Text & Tehnoredactare'}
              </h3>
              <div className="text-xs font-semibold text-slate-300 mb-3">
                {lang === 'en' ? 'Ribbon & Ruler, Golden Typing Rules, Fonts, Subscript/Superscript, Alignment, Bullets & Find/Replace' : 'Ribbon & Riglă, Reguli Tehnoredactare, Fonturi, Indici, Alinieri, Liste & Find/Replace'}
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {lang === 'en'
                  ? 'Explore the word processor window & ruler (p. 50–52), master golden typing rules & punctuation hygiene (p. 53–55), format fonts & scientific scripts (p. 56–58), align paragraphs with Justify & indents (p. 59–61), structure multi-level lists (p. 62–64), deploy automated Find & Replace, and construct the Digital Student Charter!'
                  : 'Explorează interfața procesorului de text și rigla (pag. 50–52), învață regulile de aur ale tastării și punctuației (pag. 53–55), formatează caracterele cu stiluri și formule științifice (pag. 56–58), aliniază paragrafele cu Justify și alineate (pag. 59–61), structurează liste marcate și numerotate (pag. 62–64), automatizează căutările cu Find & Replace și redactează Carta Elevului Digital!'}
              </p>

              {/* Badges / Highlights */}
              <div className="flex flex-wrap gap-2 mb-4 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> 20-25 min
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-amber-300 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {lang === 'en' ? '100 Points (Grade 10)' : '100 Puncte (Nota 10)'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-blue-300 flex items-center gap-1">
                  <Award className="w-3 h-3 text-blue-400" /> {lang === 'en' ? 'Word Processor Certificate' : 'Diplomă Tehnician Text & Word'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between">
              <div className="text-xs text-slate-400 font-mono">
                {isMissionDone('text1') ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5 font-mono">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'en' ? 'Diploma Earned (100 pts)' : 'Diplomă Obținută (100 pct)'}</span>
                  </span>
                ) : activeMissionId === 'text1' && activeMissionLevel > 1 ? (
                  <span className="text-blue-400 font-bold">
                    {lang === 'en' ? `Progress: Page ${activeMissionLevel}/7 (${activeMissionScore} pts)` : `Progres: Pagina ${activeMissionLevel}/7 (${activeMissionScore} pct)`}
                  </span>
                ) : (
                  <span>{lang === 'en' ? '7 Interactive Pages' : '7 Pagini Interactive'}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openCurriculaModal('editoare-text')}
                  className="px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-sky-300 hover:text-white border border-sky-500/30 hover:border-sky-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Vezi programa școlară, teoria și fișa didactică"
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">{lang === 'en' ? 'Syllabus' : 'Programă & Teorie'}</span>
                </button>
                <button
                  onClick={() => handleAttemptStart('text1')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer active:scale-95 shadow-lg ${
                    isMissionDone('text1')
                      ? 'bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-emerald-500/50 hover:border-emerald-400 shadow-emerald-500/10'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                  }`}
                >
                  {isMissionDone('text1') ? (
                    <>
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'en' ? 'View Diploma / Replay' : 'Vezi Diploma / Reia'}</span>
                    </>
                  ) : activeMissionId === 'text1' && activeMissionLevel > 1 ? (
                    <>
                      <span>{lang === 'en' ? 'Resume Mission 4A' : 'Continuă Misiunea 4A'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>{lang === 'en' ? 'Start Mission 4A' : 'Începe Misiunea 4A'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Card 6: ACTIVE MISSION 4B - Elemente Grafice, Tabele & Paginare */}
          <div
            className={`group relative bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 rounded-3xl p-6 shadow-xl transition-all flex flex-col justify-between ${
              isMissionDone('text2')
                ? 'border-emerald-500/80 shadow-emerald-500/10'
                : activeMissionId === 'text2'
                ? 'border-emerald-400 shadow-emerald-500/20 ring-2 ring-emerald-500/30'
                : 'border-emerald-500/60 hover:border-emerald-400 hover:shadow-emerald-500/10'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                  📊
                </div>
                <div className="flex items-center gap-2">
                  {isMissionDone('text2') ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-[11px] font-black uppercase tracking-wider font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'en' ? 'Completed • Grade 10' : 'Finalizat • Nota 10'}</span>
                    </span>
                  ) : activeMissionId === 'text2' && activeMissionLevel > 1 ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black uppercase tracking-wider font-mono">
                      {lang === 'en' ? `In Progress (Page ${activeMissionLevel}/7)` : `În Curs (Pagina ${activeMissionLevel}/7)`}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> {lang === 'en' ? 'MODULE 4B' : 'MODULUL 4B'}
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1 font-mono">
                {lang === 'en' ? 'Textbook p. 68–80 • Mission 4B' : 'Manual pag. 68–80 • Misiunea 4B'}
              </div>

              <h3 className="text-xl font-black text-white font-heading mb-1 group-hover:text-emerald-300 transition-colors">
                {lang === 'en' ? 'Visual Elements, Tables & Page Layout' : 'Elemente Grafice, Tabele & Paginare'}
              </h3>
              <div className="text-xs font-semibold text-slate-300 mb-3">
                {lang === 'en' ? 'Tables & Merge, 1:1 Aspect Ratio, Text Wrapping, Shapes, Headers & Footers' : 'Tabele & Merge, Proporții 1:1, Text Wrapping, Forme, Antet & Subsol'}
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {lang === 'en'
                  ? 'Master table creation and cell merging (p. 68–72), preserve picture aspect ratio and crop margins (p. 73–75), configure Square & Behind text wrapping (p. 76–77), assemble text boxes and group shapes (p. 78–79), set A4 margins and dynamic page numbers (p. 80), and publish the Eco-Magazine!'
                  : 'Stăpânește inserarea tabelelor și îmbinarea celulelor (pag. 68–72), păstrează proporțiile imaginilor și decupează marginile (pag. 73–75), configurează încadrarea textului (Square, Behind - pag. 76–77), construiește ecusoane cu casete de text și grupare (pag. 78–79), configurează pagina A4 cu antet și numerotare dinamică (pag. 80) și publică Eco-Revista!'}
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
                  <Award className="w-3 h-3 text-emerald-400" /> {lang === 'en' ? 'Document Designer Diploma' : 'Diplomă Designer Documente'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-400 font-mono">
                {isMissionDone('text2') ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5 font-mono">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'en' ? 'Diploma Earned (100 pts)' : 'Diplomă Obținută (100 pct)'}</span>
                  </span>
                ) : activeMissionId === 'text2' && activeMissionLevel > 1 ? (
                  <span className="text-emerald-400 font-bold">
                    {lang === 'en' ? `Progress: Page ${activeMissionLevel}/7 (${activeMissionScore} pts)` : `Progres: Pagina ${activeMissionLevel}/7 (${activeMissionScore} pct)`}
                  </span>
                ) : (
                  <span>{lang === 'en' ? '7 Interactive Pages' : '7 Pagini Interactive'}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {onOpenArcade && (
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onOpenArcade();
                    }}
                    className="px-3 py-2.5 rounded-xl bg-indigo-950/90 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-950/40 active:scale-95"
                    title={lang === 'en' ? 'Play Module 4B Arcade: PageCraft' : 'Joacă Mini-Jocul Arcade 4B: PageCraft'}
                  >
                    <Gamepad2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{lang === 'en' ? 'Arcade 4B' : 'Arcade 4B'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => openCurriculaModal('editoare-text')}
                  className="px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-sky-300 hover:text-white border border-sky-500/30 hover:border-sky-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Vezi programa școlară, teoria și fișa didactică"
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">{lang === 'en' ? 'Syllabus' : 'Programă & Teorie'}</span>
                </button>
                <button
                  onClick={() => handleAttemptStart('text2')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer active:scale-95 shadow-lg ${
                    isMissionDone('text2')
                      ? 'bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-emerald-500/50 hover:border-emerald-400 shadow-emerald-500/10'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  }`}
                >
                  {isMissionDone('text2') ? (
                    <>
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'en' ? 'View Diploma / Replay' : 'Vezi Diploma / Reia'}</span>
                    </>
                  ) : activeMissionId === 'text2' && activeMissionLevel > 1 ? (
                    <>
                      <span>{lang === 'en' ? 'Resume Mission 4B' : 'Continuă Misiunea 4B'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>{lang === 'en' ? 'Start Mission 4B' : 'Începe Misiunea 4B'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Card 7: ACTIVE MISSION 5A - Noțiunea de Algoritm & Algoritmi Secvențiali */}
          <div
            className={`group relative bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 rounded-3xl p-6 shadow-xl transition-all flex flex-col justify-between ${
              isMissionDone('algo1')
                ? 'border-emerald-500/80 shadow-emerald-500/10'
                : activeMissionId === 'algo1'
                ? 'border-amber-400 shadow-amber-500/20 ring-2 ring-amber-500/30'
                : 'border-amber-500/60 hover:border-amber-400 hover:shadow-amber-500/10'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                  🧩
                </div>
                <div className="flex items-center gap-2">
                  {isMissionDone('algo1') ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-[11px] font-black uppercase tracking-wider font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'en' ? 'Completed • Grade 10' : 'Finalizat • Nota 10'}</span>
                    </span>
                  ) : activeMissionId === 'algo1' && activeMissionLevel > 1 ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black uppercase tracking-wider font-mono">
                      {lang === 'en' ? `In Progress (Page ${activeMissionLevel}/7)` : `În Curs (Pagina ${activeMissionLevel}/7)`}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-wider animate-pulse">
                    <Sparkles className="w-3 h-3" /> {lang === 'en' ? 'MODULE 5A • NEW' : 'MODULUL 5A • NOU'}
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1 font-mono">
                {lang === 'en' ? 'Textbook p. 54–61 • Mission 5A' : 'Manual pag. 54–61 • Misiunea 5A'}
              </div>

              <h3 className="text-xl font-black text-white font-heading mb-1 group-hover:text-amber-300 transition-colors">
                {lang === 'en' ? 'Algorithm Concept & Sequential Logic' : 'Noțiunea de Algoritm & Algoritmi Secvențiali'}
              </h3>
              <div className="text-xs font-semibold text-slate-300 mb-3">
                {lang === 'en' ? 'Algorithm Definition, 6 Properties, Ambiguities, Linear Steps, 3-Glass Swap & Ciphers' : 'Definiție, 6 Proprietăți, Ambiguități, Pași Liniari, Regula celor 3 Pahare & Criptare'}
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {lang === 'en'
                  ? 'Discover what an algorithm is with real-world tea & recipe routines (p. 54–55), master the 6 fundamental properties (p. 56–57), defuse the ambiguity trap (p. 58), execute sequential steps (p. 59), master the 3-glass variable swap algorithm (aux - p. 60), decode numeric substitution ciphers (p. 60–61), and solve perimeter & area math challenges!'
                  : 'Descoperă noțiunea de algoritm prin exemple din viața cotidiană (pag. 54–55), stăpânește cele 6 proprietăți fundamentale (pag. 56–57), evită capcana ambiguităților (pag. 58), ordonează pași secvențiali (pag. 59), experimentează interschimbarea valorilor prin regula celor 3 pahare (aux - pag. 60), decodează mesaje prin substituție numerică (pag. 60–61) și rezolvă algoritmii de arie și perimetru!'}
              </p>

              {/* Badges / Highlights */}
              <div className="flex flex-wrap gap-2 mb-4 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> 20-25 min
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-amber-300 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {lang === 'en' ? '100 Points (Grade 10)' : '100 Puncte (Nota 10)'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-amber-300 flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" /> {lang === 'en' ? 'Junior Algorithmist Diploma' : 'Diplomă Junior Algoritmist'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between">
              <div className="text-xs text-slate-400 font-mono">
                {isMissionDone('algo1') ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5 font-mono">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'en' ? 'Diploma Earned (100 pts)' : 'Diplomă Obținută (100 pct)'}</span>
                  </span>
                ) : activeMissionId === 'algo1' && activeMissionLevel > 1 ? (
                  <span className="text-amber-400 font-bold">
                    {lang === 'en' ? `Progress: Page ${activeMissionLevel}/7 (${activeMissionScore} pts)` : `Progres: Pagina ${activeMissionLevel}/7 (${activeMissionScore} pct)`}
                  </span>
                ) : (
                  <span>{lang === 'en' ? '7 Interactive Pages' : '7 Pagini Interactive'}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openCurriculaModal('algoritmi')}
                  className="px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-sky-300 hover:text-white border border-sky-500/30 hover:border-sky-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Vezi programa școlară, teoria și fișa didactică"
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">{lang === 'en' ? 'Syllabus' : 'Programă & Teorie'}</span>
                </button>
                <button
                  onClick={() => handleAttemptStart('algo1')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer active:scale-95 shadow-lg ${
                    isMissionDone('algo1')
                      ? 'bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-emerald-500/50 hover:border-emerald-400 shadow-emerald-500/10'
                      : 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-black shadow-amber-600/30'
                  }`}
                >
                  {isMissionDone('algo1') ? (
                    <>
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'en' ? 'View Diploma / Replay' : 'Vezi Diploma / Reia'}</span>
                    </>
                  ) : activeMissionId === 'algo1' && activeMissionLevel > 1 ? (
                    <>
                      <span>{lang === 'en' ? 'Resume Mission 5A' : 'Continuă Misiunea 5A'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>{lang === 'en' ? 'Start Mission 5A' : 'Începe Misiunea 5A'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Card 8: ACTIVE MISSION 5B - Structuri Decizionale, Date, Operatori & Scheme Logice */}
          <div
            className={`group relative bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 rounded-3xl p-6 shadow-xl transition-all flex flex-col justify-between ${
              isMissionDone('algo2')
                ? 'border-emerald-500/80 shadow-emerald-500/10'
                : activeMissionId === 'algo2'
                ? 'border-purple-400 shadow-purple-500/20 ring-2 ring-purple-500/30'
                : 'border-purple-500/60 hover:border-purple-400 hover:shadow-purple-500/10'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                  🚦
                </div>
                <div className="flex items-center gap-2">
                  {isMissionDone('algo2') ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-[11px] font-black uppercase tracking-wider font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'en' ? 'Completed • Grade 10' : 'Finalizat • Nota 10'}</span>
                    </span>
                  ) : activeMissionId === 'algo2' && activeMissionLevel > 1 ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black uppercase tracking-wider font-mono">
                      {lang === 'en' ? `In Progress (Page ${activeMissionLevel}/7)` : `În Curs (Pagina ${activeMissionLevel}/7)`}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-black uppercase tracking-wider animate-pulse">
                    <Sparkles className="w-3 h-3" /> {lang === 'en' ? 'MODULE 5B • NEW' : 'MODULUL 5B • NOU'}
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-1 font-mono">
                {lang === 'en' ? 'Textbook p. 62–71 • Mission 5B' : 'Manual pag. 62–71 • Misiunea 5B'}
              </div>

              <h3 className="text-xl font-black text-white font-heading mb-1 group-hover:text-purple-300 transition-colors">
                {lang === 'en' ? 'Decisions, Data Types & Flowcharts' : 'Structuri Decizionale, Date & Scheme Logice'}
              </h3>
              <div className="text-xs font-semibold text-slate-300 mb-3">
                {lang === 'en' ? 'If-Then-Else, Constants vs Variables, Data Types, Operators, Truth Tables, Flowcharts & Trace' : 'Dacă-Atunci-Altfel, Constante vs Variabile, Tipuri de Date, Operatori, Tabele de Adevăr & Scheme'}
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {lang === 'en'
                  ? 'Master alternative decision structures with traffic lights and maze robots (p. 62–63), organize input/intermediate/output data and constants (p. 64–65), identify numeric, text & boolean data types (p. 66), solve arithmetic (+, -, *, /, mod, div) & relational expressions (p. 67), evaluate logic connectives (AND, OR, NOT) with truth tables (p. 68–69), build standard flowchart block diagrams (p. 70), and trace execution tables (p. 71)!'
                  : 'Stăpânește structura alternativă Dacă-Atunci-Altfel prin semafor și ghidarea robotului (pag. 62–63), organizează datele de intrare, manevră și ieșire (pag. 64–65), explorează tipurile de date numeric, text și logic (pag. 66), evaluează expresii aritmetice (+, -, *, /, %, div) și de comparație (pag. 67), construiește tabele de adevăr pentru conectivele logice (ȘI, SAU, NU - pag. 68–69), asamblează scheme logice standardizate (pag. 70) și execută tabele de valori (trace table - pag. 71)!'}
              </p>

              {/* Badges / Highlights */}
              <div className="flex flex-wrap gap-2 mb-4 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> 20-25 min
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-amber-300 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {lang === 'en' ? '100 Points (Grade 10)' : '100 Puncte (Nota 10)'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-purple-300 flex items-center gap-1">
                  <Award className="w-3 h-3 text-purple-400" /> {lang === 'en' ? 'Flowchart Master Diploma' : 'Diplomă Maestru Scheme Logice'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between">
              <div className="text-xs text-slate-400 font-mono">
                {isMissionDone('algo2') ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5 font-mono">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'en' ? 'Diploma Earned (100 pts)' : 'Diplomă Obținută (100 pct)'}</span>
                  </span>
                ) : activeMissionId === 'algo2' && activeMissionLevel > 1 ? (
                  <span className="text-purple-400 font-bold">
                    {lang === 'en' ? `Progress: Page ${activeMissionLevel}/7 (${activeMissionScore} pts)` : `Progres: Pagina ${activeMissionLevel}/7 (${activeMissionScore} pct)`}
                  </span>
                ) : (
                  <span>{lang === 'en' ? '7 Interactive Pages' : '7 Pagini Interactive'}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openCurriculaModal('algoritmi')}
                  className="px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-sky-300 hover:text-white border border-sky-500/30 hover:border-sky-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Vezi programa școlară, teoria și fișa didactică"
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">{lang === 'en' ? 'Syllabus' : 'Programă & Teorie'}</span>
                </button>
                <button
                  onClick={() => handleAttemptStart('algo2')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer active:scale-95 shadow-lg ${
                    isMissionDone('algo2')
                      ? 'bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-emerald-500/50 hover:border-emerald-400 shadow-emerald-500/10'
                      : 'bg-purple-600 hover:bg-purple-500 text-white font-black shadow-purple-600/30'
                  }`}
                >
                  {isMissionDone('algo2') ? (
                    <>
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'en' ? 'View Diploma / Replay' : 'Vezi Diploma / Reia'}</span>
                    </>
                  ) : activeMissionId === 'algo2' && activeMissionLevel > 1 ? (
                    <>
                      <span>{lang === 'en' ? 'Resume Mission 5B' : 'Continuă Misiunea 5B'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>{lang === 'en' ? 'Start Mission 5B' : 'Începe Misiunea 5B'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Card 9: ACTIVE MISSION 6A - Mediul Scratch 3.0, Mișcare Liniară, Variabile & Creion */}
          <div
            className={`group relative bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 rounded-3xl p-6 shadow-xl transition-all flex flex-col justify-between ${
              isMissionDone('scratch1')
                ? 'border-emerald-500/80 shadow-emerald-500/10'
                : activeMissionId === 'scratch1'
                ? 'border-orange-400 shadow-orange-500/20 ring-2 ring-orange-500/30'
                : 'border-orange-500/60 hover:border-orange-400 hover:shadow-orange-500/10'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                  🐱
                </div>
                <div className="flex items-center gap-2">
                  {isMissionDone('scratch1') ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-[11px] font-black uppercase tracking-wider font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'en' ? 'Completed • Grade 10' : 'Finalizat • Nota 10'}</span>
                    </span>
                  ) : activeMissionId === 'scratch1' && activeMissionLevel > 1 ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black uppercase tracking-wider font-mono">
                      {lang === 'en' ? `In Progress (Page ${activeMissionLevel}/7)` : `În Curs (Pagina ${activeMissionLevel}/7)`}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 text-xs font-black uppercase tracking-wider animate-pulse">
                    <Sparkles className="w-3 h-3" /> {lang === 'en' ? 'MODULE 6A • SCRATCH' : 'MODULUL 6A • SCRATCH'}
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-orange-400 mb-1 font-mono">
                {lang === 'en' ? 'Textbook p. 72–90 • Mission 6A' : 'Manual pag. 72–90 • Misiunea 6A'}
              </div>

              <h3 className="text-xl font-black text-white font-heading mb-1 group-hover:text-orange-300 transition-colors">
                {lang === 'en' ? 'Scratch 3.0: Stage, Motion & Variables' : 'Mediul Scratch: Scena, Mișcare & Variabile'}
              </h3>
              <div className="text-xs font-semibold text-slate-300 mb-3">
                {lang === 'en' ? 'Visual Blocks, 480x360 Stage, 9 Categories, "RoboTIC Se Prezintă", Variables, Math & Pen Extension' : 'Blocuri Vizuale, Scena 480x360, 9 Categorii, RoboTIC Se Prezintă, Variabile & Extensia Creion'}
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {lang === 'en'
                  ? 'Explore the MIT Scratch 3.0 environment (p. 72–73), navigate the 480x360 coordinate stage with Green Flag & Red Stop (p. 74–75), categorize the 9 color palette blocks (p. 74–76), build project "RoboTIC Introduces Himself" with sequential gliding, speech & sound (p. 76–80), create and manipulate variables with stage watchers (p. 81–84), execute project "RoboOperations" with math operators & text join (p. 84–88), and draw geometric shapes with the Magic Pen extension (p. 88–90)!'
                  : 'Descoperă mediul Scratch 3.0 de la MIT Media Lab (pag. 72–73), navighează pe scena de 480x360 px cu Steagul Verde și Stop (pag. 74–75), explorează cele 9 categorii de blocuri colorate (pag. 74–76), implementează proiectul „RoboTIC se prezintă” cu glisare, dialog și sunet (pag. 76–80), creează variabile și monitoare de scor (pag. 81–84), efectuează calcule cu operatori și alăturare de text în „RoboOperații” (pag. 84–88) și desenează figuri geometrice cu Extensia Creion (pag. 88–90)!'}
              </p>

              {/* Badges / Highlights */}
              <div className="flex flex-wrap gap-2 mb-4 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> 20-25 min
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-amber-300 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {lang === 'en' ? '100 Points (Grade 10)' : '100 Puncte (Nota 10)'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-orange-300 flex items-center gap-1">
                  <Award className="w-3 h-3 text-orange-400" /> {lang === 'en' ? 'Scratch Developer Diploma' : 'Diplomă Programator Scratch'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between">
              <div className="text-xs text-slate-400 font-mono">
                {isMissionDone('scratch1') ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5 font-mono">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'en' ? 'Diploma Earned (100 pts)' : 'Diplomă Obținută (100 pct)'}</span>
                  </span>
                ) : activeMissionId === 'scratch1' && activeMissionLevel > 1 ? (
                  <span className="text-orange-400 font-bold">
                    {lang === 'en' ? `Progress: Page ${activeMissionLevel}/7 (${activeMissionScore} pts)` : `Progres: Pagina ${activeMissionLevel}/7 (${activeMissionScore} pct)`}
                  </span>
                ) : (
                  <span>{lang === 'en' ? '7 Interactive Pages' : '7 Pagini Interactive'}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openCurriculaModal('scratch')}
                  className="px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-sky-300 hover:text-white border border-sky-500/30 hover:border-sky-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Vezi programa școlară, teoria și fișa didactică"
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">{lang === 'en' ? 'Syllabus' : 'Programă & Teorie'}</span>
                </button>
                <button
                  onClick={() => handleAttemptStart('scratch1')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer active:scale-95 shadow-lg ${
                    isMissionDone('scratch1')
                      ? 'bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-emerald-500/50 hover:border-emerald-400 shadow-emerald-500/10'
                      : 'bg-orange-600 hover:bg-orange-500 text-white font-black shadow-orange-600/30'
                  }`}
                >
                  {isMissionDone('scratch1') ? (
                    <>
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'en' ? 'View Diploma / Replay' : 'Vezi Diploma / Reia'}</span>
                    </>
                  ) : activeMissionId === 'scratch1' && activeMissionLevel > 1 ? (
                    <>
                      <span>{lang === 'en' ? 'Resume Mission 6A' : 'Continuă Misiunea 6A'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>{lang === 'en' ? 'Start Mission 6A' : 'Începe Misiunea 6A'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Card 10: ACTIVE MISSION 6B - Decizii Scratch, Labirint, Tabla Înmulțirii, Muzică & Marea Evaluare */}
          <div
            className={`group relative bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 rounded-3xl p-6 shadow-xl transition-all flex flex-col justify-between ${
              isMissionDone('scratch2')
                ? 'border-emerald-500/80 shadow-emerald-500/10'
                : activeMissionId === 'scratch2'
                ? 'border-pink-400 shadow-pink-500/20 ring-2 ring-pink-500/30'
                : 'border-pink-500/60 hover:border-pink-400 hover:shadow-pink-500/10'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                  🎮
                </div>
                <div className="flex items-center gap-2">
                  {isMissionDone('scratch2') ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-[11px] font-black uppercase tracking-wider font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'en' ? 'Completed • Grade 10' : 'Finalizat • Nota 10'}</span>
                    </span>
                  ) : activeMissionId === 'scratch2' && activeMissionLevel > 1 ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black uppercase tracking-wider font-mono">
                      {lang === 'en' ? `In Progress (Page ${activeMissionLevel}/7)` : `În Curs (Pagina ${activeMissionLevel}/7)`}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 text-xs font-black uppercase tracking-wider animate-pulse">
                    <Sparkles className="w-3 h-3" /> {lang === 'en' ? 'MODULE 6B • GRADUATION' : 'MODULUL 6B • ABSOLVIRE'}
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-pink-400 mb-1 font-mono">
                {lang === 'en' ? 'Textbook p. 84–93 • Mission 6B' : 'Manual pag. 84–93 • Misiunea 6B'}
              </div>

              <h3 className="text-xl font-black text-white font-heading mb-1 group-hover:text-pink-300 transition-colors">
                {lang === 'en' ? 'Decisions, Music & Contest Games' : 'Decizii, Muzică, Jocuri & Marea Evaluare'}
              </h3>
              <div className="text-xs font-semibold text-slate-300 mb-3">
                {lang === 'en' ? 'If/Else, Maze Game, Math Quiz, Music MIDI Synth, Scale Songs, Catch Fish Contest & Final Grade 5 Exam' : 'Dacă/Altfel, Labirint, Tabla Înmulțirii, Extensia Muzică, Gama Do, Prinde Peștele & Marea Evaluare Finală'}
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {lang === 'en'
                  ? 'Implement decision structures in Scratch (p. 84–86), program the Smart Maze game with color sensing (p. 86–88), develop the Multiplication Quiz with user input and random numbers (p. 88–90), compose digital music with the MIDI Music extension (p. 90–92), play the C Major scale and "În pădurea cu alune" (p. 91–92), build multi-sprite contest game "Catch the Fish" with timers (p. 92–93), create the "Save the Planet" ecological story and graduate Grade 5 Informatics & ICT!'
                  : 'Programează decizii dacă/altfel în Scratch (pag. 84–86), construiește jocul Labirint cu senzori optici de culoare (pag. 86–88), creează jocul Tabla Înmulțirii cu generare de factori aleatorii și citire răspuns (pag. 88–90), explorează extensia Muzică și sintetizatorul digital (pag. 90–92), programează gama Do major și cântecul „În pădurea cu alune” (pag. 91–92), creează jocul de concurs „Prinde Peștișorul” cu cronometru (pag. 92–93), animă proiectul ecologic „Salvăm Planeta” și obține Diploma de Absolvire a Clasei a V-a (pag. 93)!'}
              </p>

              {/* Badges / Highlights */}
              <div className="flex flex-wrap gap-2 mb-4 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> 20-25 min
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-amber-300 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {lang === 'en' ? '100 Points (Grade 10)' : '100 Puncte (Nota 10)'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-pink-300 flex items-center gap-1">
                  <Award className="w-3 h-3 text-pink-400" /> {lang === 'en' ? 'Grade 5 Grand Diploma' : 'Marea Diplomă de Onoare Clasa a V-a'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between">
              <div className="text-xs text-slate-400 font-mono">
                {isMissionDone('scratch2') ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5 font-mono">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'en' ? 'Diploma Earned (100 pts)' : 'Diplomă Obținută (100 pct)'}</span>
                  </span>
                ) : activeMissionId === 'scratch2' && activeMissionLevel > 1 ? (
                  <span className="text-pink-400 font-bold">
                    {lang === 'en' ? `Progress: Page ${activeMissionLevel}/7 (${activeMissionScore} pts)` : `Progres: Pagina ${activeMissionLevel}/7 (${activeMissionScore} pct)`}
                  </span>
                ) : (
                  <span>{lang === 'en' ? '7 Interactive Pages' : '7 Pagini Interactive'}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openCurriculaModal('scratch')}
                  className="px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-sky-300 hover:text-white border border-sky-500/30 hover:border-sky-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Vezi programa școlară, teoria și fișa didactică"
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">{lang === 'en' ? 'Syllabus' : 'Programă & Teorie'}</span>
                </button>
                <button
                  onClick={() => handleAttemptStart('scratch2')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer active:scale-95 shadow-lg ${
                    isMissionDone('scratch2')
                      ? 'bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-emerald-500/50 hover:border-emerald-400 shadow-emerald-500/10'
                      : 'bg-pink-600 hover:bg-pink-500 text-white font-black shadow-pink-600/30'
                  }`}
                >
                  {isMissionDone('scratch2') ? (
                    <>
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'en' ? 'View Diploma / Replay' : 'Vezi Diploma / Reia'}</span>
                    </>
                  ) : activeMissionId === 'scratch2' && activeMissionLevel > 1 ? (
                    <>
                      <span>{lang === 'en' ? 'Resume Mission 6B' : 'Continuă Misiunea 6B'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>{lang === 'en' ? 'Start Mission 6B' : 'Începe Misiunea 6B'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Courses & Lessons Section - CLASA A VI-A */}
      {selectedGrade === 'grade6' && (
      <div id="sectiune-misiuni-clasa-6" className="scroll-mt-6 flex flex-col gap-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Presentation className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg sm:text-2xl font-black text-white font-heading tracking-wide">
              {lang === 'en' ? 'Practical ICT Missions • 6th Grade (Art Klett)' : 'Misiuni Practice TIC • Clasa a VI-a (Manual Art Klett)'}
            </h2>
          </div>
          <span className="text-xs font-mono text-orange-300 bg-orange-950/80 px-3 py-1 rounded-full border border-orange-500/40 self-start sm:self-auto">
            {lang === 'en' ? 'New Curriculum 2026 • 4 Major Units' : 'Curriculum Nou 2026 • 4 Mari Unități Curriculare'}
          </span>
        </div>

        {/* 4 Major Units Roadmap Matrix Banner */}
        <div className="bg-slate-900/90 border-2 border-orange-500/30 rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {lang === 'en' ? '6th Grade Curriculum Overview (Textbook pp. 10–93)' : 'Harta Curriculară Clasa a VI-a (Manual pag. 10–93)'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-orange-950/40 border border-orange-500/40 flex flex-col justify-between">
              <div>
                <span className="text-xl mb-1 block">📽️</span>
                <div className="font-bold text-white mb-0.5">Unitatea 1: Prezentări</div>
                <div className="text-[11px] text-slate-300 leading-snug">PowerPoint, design slide-uri, contrast, public speaking (pag. 10–25)</div>
              </div>
              <span className="mt-2 text-[10px] font-mono font-bold text-emerald-400">● DISPONIBIL ACUM</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xl mb-1 block">🧊</span>
                <div className="font-bold text-white mb-0.5">Unitatea 2: Animații & 3D</div>
                <div className="text-[11px] text-slate-400 leading-snug">Paint 3D, corpuri cu volum, Toontastic & VR CoSpaces (pag. 26–43)</div>
              </div>
              <span className="mt-2 text-[10px] font-mono font-bold text-amber-400">○ În dezvoltare</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xl mb-1 block">🛡️</span>
                <div className="font-bold text-white mb-0.5">Unitatea 3: Internet & Securitate</div>
                <div className="text-[11px] text-slate-400 leading-snug">Malware, firewall, parole, e-mail & Netichetă (pag. 44–61)</div>
              </div>
              <span className="mt-2 text-[10px] font-mono font-bold text-amber-400">○ În dezvoltare</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xl mb-1 block">🔄</span>
                <div className="font-bold text-white mb-0.5">Unitatea 4: Algoritmi & Scratch</div>
                <div className="text-[11px] text-slate-400 leading-snug">Bucle condiționate, contor For, Minecraft & fractali (pag. 62–93)</div>
              </div>
              <span className="mt-2 text-[10px] font-mono font-bold text-amber-400">○ În dezvoltare</span>
            </div>
          </div>
        </div>

        {/* 6th Grade Lesson Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Modulul 1A - Prezentarea & Interfața PowerPoint (READY & ACTIVE) */}
          <div
            className={`group relative bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 rounded-3xl p-6 shadow-xl transition-all flex flex-col justify-between ${
              isMissionDone('g6_presentation1')
                ? 'border-emerald-500/80 shadow-emerald-500/10'
                : activeMissionId === 'g6_presentation1'
                ? 'border-orange-400 shadow-orange-500/20 ring-2 ring-orange-500/30'
                : 'border-orange-500/60 hover:border-orange-400 hover:shadow-orange-500/10'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                  📽️
                </div>
                <div className="flex items-center gap-2">
                  {isMissionDone('g6_presentation1') ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-[11px] font-black uppercase tracking-wider font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'en' ? 'Completed • Grade 10' : 'Finalizat • Nota 10'}</span>
                    </span>
                  ) : activeMissionId === 'g6_presentation1' && activeMissionLevel > 1 ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black uppercase tracking-wider font-mono">
                      {lang === 'en' ? `In Progress (Level ${activeMissionLevel}/7)` : `În Curs (Nivel ${activeMissionLevel}/7)`}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 text-xs font-black uppercase tracking-wider animate-pulse">
                    <Sparkles className="w-3 h-3" /> {lang === 'en' ? 'NEW • MODULE 1A' : 'NOU • MODULUL 1A'}
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-orange-400 mb-1 font-mono">
                {lang === 'en' ? 'Textbook p. 10–15 • Unit 1 (Lessons 1-2)' : 'Manual pag. 10–15 • Unitatea 1 (Lecțiile 1-2)'}
              </div>

              <h3 className="text-xl font-black text-white font-heading mb-1 group-hover:text-orange-300 transition-colors">
                {lang === 'en' ? 'Presentation & PowerPoint Interface' : 'Prezentarea & Interfața PowerPoint'}
              </h3>
              <div className="text-xs font-semibold text-slate-300 mb-3">
                {lang === 'en' ? 'Presentation Types, 3 Launch Modes, Ribbon Anatomy & Views' : 'Tipuri de Prezentări, 3 Moduri de Start, Anatomia Panglicii & Moduri de Vizualizare'}
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {lang === 'en'
                  ? 'Discover presentation types, compare PowerPoint vs Keynote vs Google Slides, test the 3 launch modes (blank, template, open), master the 7 interface zones, explore Ribbon tabs, practice views & zoom, and pass the Command Lab to earn your Junior PowerPoint Specialist Diploma!'
                  : 'Descoperă ce este o prezentare electronică, testează cele 3 moduri de pornire, explorează cele 7 zone ale cabinei de comandă PowerPoint, învață diferența crucială dintre Tranziții și Animații, reglează modurile de vizualizare (F5) și deblochează Marea Diplomă!'}
              </p>

              {/* Badges / Highlights */}
              <div className="flex flex-wrap gap-2 mb-4 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> 20-25 min
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-amber-300 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 100 XP (Nota 10)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-orange-300 flex items-center gap-1">
                  <Award className="w-3 h-3 text-orange-400" /> Diplomă Operator PowerPoint Junior
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between">
              <div className="text-xs text-slate-400 font-mono">
                {isMissionDone('g6_presentation1') ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5 font-mono">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'en' ? 'Diploma Earned (100 pts)' : 'Diplomă Obținută (100 pct)'}</span>
                  </span>
                ) : activeMissionId === 'g6_presentation1' && activeMissionLevel > 1 ? (
                  <span className="text-orange-400 font-bold">
                    {lang === 'en' ? `Progress: Level ${activeMissionLevel}/7 (${activeMissionScore} pts)` : `Progres: Nivel ${activeMissionLevel}/7 (${activeMissionScore} pct)`}
                  </span>
                ) : (
                  <span>{lang === 'en' ? '7 Interactive Pages' : '7 Pagini Interactive'}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openCurriculaModal('prezentari-slides')}
                  className="px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-sky-300 hover:text-white border border-sky-500/30 hover:border-sky-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Vezi programa școlară, teoria și fișa didactică"
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">{lang === 'en' ? 'Syllabus' : 'Programă & Teorie'}</span>
                </button>
                <button
                  onClick={() => handleAttemptStart('g6_presentation1')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer active:scale-95 shadow-lg ${
                    isMissionDone('g6_presentation1')
                      ? 'bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-emerald-500/50 hover:border-emerald-400 shadow-emerald-500/10'
                      : 'bg-orange-600 hover:bg-orange-500 text-white font-black shadow-orange-600/30'
                  }`}
                >
                  {isMissionDone('g6_presentation1') ? (
                    <>
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'en' ? 'View Diploma / Replay' : 'Vezi Diploma / Reia'}</span>
                    </>
                  ) : activeMissionId === 'g6_presentation1' && activeMissionLevel > 1 ? (
                    <>
                      <span>{lang === 'en' ? 'Resume Mission 1A' : 'Continuă Misiunea 1A'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>{lang === 'en' ? 'Start Mission 1A (PowerPoint)' : 'Începe Misiunea 1A'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Modulul 1B - Realizare, Design, Animații & Susținerea Prezentării (Active Mission) */}
          <div
            className={`group relative bg-gradient-to-br from-slate-900 via-slate-850 to-rose-950/40 border-2 rounded-3xl p-6 shadow-xl transition-all duration-300 flex flex-col justify-between ${
              isMissionDone('g6_presentation2')
                ? 'border-emerald-500/80 shadow-emerald-500/10'
                : 'border-rose-500/50 hover:border-rose-400 hover:shadow-2xl hover:shadow-rose-500/20'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 border border-rose-400/40 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🎨
                </div>
                <div className="flex items-center gap-1.5">
                  {isMissionDone('g6_presentation2') ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-[11px] font-black uppercase tracking-wider font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'en' ? 'Completed • Grade 10' : 'Finalizat • Nota 10'}</span>
                    </span>
                  ) : activeMissionId === 'g6_presentation2' ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold font-mono animate-pulse">
                      ● ACTIV
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black uppercase tracking-wider animate-pulse">
                    <Sparkles className="w-3 h-3" /> {lang === 'en' ? 'NEW • MODULE 1B' : 'NOU • MODULUL 1B'}
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-rose-400 mb-1 font-mono">
                {lang === 'en' ? 'Textbook p. 16–25 • Unit 1 (Lessons 3-6)' : 'Manual pag. 16–25 • Unitatea 1 (Lecțiile 3-6)'}
              </div>

              <h3 className="text-xl font-black text-white font-heading mb-1 group-hover:text-rose-300 transition-colors">
                {lang === 'en' ? 'Slide Creation, Design & Public Speaking' : 'Realizare, Design & Public Speaking'}
              </h3>
              <div className="text-xs font-semibold text-slate-300 mb-3">
                {lang === 'en' ? 'Slide Operations, Multimedia Objects, 40-Word Rule & Stage Delivery' : 'Operații Diapozitive, Inserare Obiecte, Regula 40 de Cuvinte & Arta Discursului'}
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {lang === 'en'
                  ? 'Master slide duplication & deletion, insert rich multimedia & tables, configure 16:9 widescreen themes, test slide transitions vs object animations, repair bad slides using the 40-word & high contrast rules, and deliver on the live classroom stage to complete project "Touristic Romania"!'
                  : 'Stăpânește operațiile cu diapozitive (Ctrl+M), inserează imagini, tabele și clipuri multimedia, aplică formatul panoramic 16:9, exersează tranzițiile vs animațiile pe obiecte, aplică regula celor 40 de cuvinte și contrastul optim, iar apoi cucerește sala cu discursul tău în proiectul „România Turistică”!'}
              </p>

              {/* Badges / Highlights */}
              <div className="flex flex-wrap gap-2 mb-4 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> 20-25 min
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-amber-300 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 100 XP (Nota 10)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-rose-300 flex items-center gap-1">
                  <Award className="w-3 h-3 text-rose-400" /> Diplomă Public Speaking & Prezentări Pro
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between">
              <div className="text-xs text-slate-400 font-mono">
                {isMissionDone('g6_presentation2') ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5 font-mono">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'en' ? 'Diploma Earned (100 pts)' : 'Diplomă Obținută (100 pct)'}</span>
                  </span>
                ) : activeMissionId === 'g6_presentation2' && activeMissionLevel > 1 ? (
                  <span className="text-rose-400 font-bold">
                    {lang === 'en' ? `Progress: Level ${activeMissionLevel}/7 (${activeMissionScore} pts)` : `Progres: Nivel ${activeMissionLevel}/7 (${activeMissionScore} pct)`}
                  </span>
                ) : (
                  <span>{lang === 'en' ? '7 Interactive Pages' : '7 Pagini Interactive'}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openCurriculaModal('prezentari-slides')}
                  className="px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-sky-300 hover:text-white border border-sky-500/30 hover:border-sky-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Vezi programa școlară, teoria și fișa didactică"
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">{lang === 'en' ? 'Syllabus' : 'Programă & Teorie'}</span>
                </button>
                <button
                  onClick={() => handleAttemptStart('g6_presentation2')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer active:scale-95 shadow-lg ${
                    isMissionDone('g6_presentation2')
                      ? 'bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-emerald-500/50 hover:border-emerald-400 shadow-emerald-500/10'
                      : 'bg-rose-600 hover:bg-rose-500 text-white font-black shadow-rose-600/30'
                  }`}
                >
                  {isMissionDone('g6_presentation2') ? (
                    <>
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'en' ? 'View Diploma / Replay' : 'Vezi Diploma / Reia'}</span>
                    </>
                  ) : activeMissionId === 'g6_presentation2' && activeMissionLevel > 1 ? (
                    <>
                      <span>{lang === 'en' ? 'Resume Mission 1B' : 'Continuă Misiunea 1B'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>{lang === 'en' ? 'Start Mission 1B (Design & Speech)' : 'Începe Misiunea 1B'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Modulul 2A - Modelare 3D în Paint 3D (Active Mission) */}
          <div
            className={`group relative bg-gradient-to-br from-slate-900 via-slate-850 to-cyan-950/40 border-2 rounded-3xl p-6 shadow-xl transition-all duration-300 flex flex-col justify-between ${
              isMissionDone('g6_paint3d')
                ? 'border-emerald-500/80 shadow-emerald-500/10'
                : 'border-cyan-500/50 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-400/40 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🧊
                </div>
                <div className="flex items-center gap-1.5">
                  {isMissionDone('g6_paint3d') ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-[11px] font-black uppercase tracking-wider font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'en' ? 'Completed • Grade 10' : 'Finalizat • Nota 10'}</span>
                    </span>
                  ) : activeMissionId === 'g6_paint3d' ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold font-mono animate-pulse">
                      ● ACTIV
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-black uppercase tracking-wider animate-pulse">
                    <Sparkles className="w-3 h-3" /> {lang === 'en' ? 'NEW • MODULE 2A' : 'NOU • MODULUL 2A'}
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-1 font-mono">
                {lang === 'en' ? 'Textbook p. 26–33 • Unit 2 (Lessons 1-2)' : 'Manual pag. 26–33 • Unitatea 2 (Lecțiile 1-2)'}
              </div>

              <h3 className="text-xl font-black text-white font-heading mb-1 group-hover:text-cyan-300 transition-colors">
                {lang === 'en' ? '3D Modeling in Paint 3D' : 'Modelare 3D în Paint 3D'}
              </h3>
              <div className="text-xs font-semibold text-slate-300 mb-3">
                {lang === 'en' ? 'Tridimensional Space (X, Y, Z), 4 Control Anchors, Stickers & Primitives' : 'Spațiul Tridimensional (X, Y, Z), 4 Ancore de Manipulare, Stickere & Corpuri cu Volum'}
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {lang === 'en'
                  ? 'Explore the depth Z axis, master the 4 spatial control anchors (Pitch X, Yaw Y, Roll Z, translation), transform flat 2D drawings into 3D volume with Make 3D, apply custom stickers and 4 material finishes (Matte, Gloss, Dull & Glossy Metal), animate models with 360° loops, and export .GLB assets in the Avatar Lab!'
                  : 'Descoperă adâncimea axei Z, stăpânește cele 4 ancore de control spațial (rotiri X, Y, Z și translație față de pânză), transformă desenele 2D în corpuri 3D cu butonul magic „Creare 3D”, mulează stickere și aplică finisaje de materiale (mat, lucios, metal), generează bucle video de rotație și exportă asset-uri .GLB în laboratorul Avatar 3D!'}
              </p>

              {/* Badges / Highlights */}
              <div className="flex flex-wrap gap-2 mb-4 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> 20-25 min
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-amber-300 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 100 XP (Nota 10)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-cyan-300 flex items-center gap-1">
                  <Award className="w-3 h-3 text-cyan-400" /> Diplomă Creator & Modelator 3D Junior
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between">
              <div className="text-xs text-slate-400 font-mono">
                {isMissionDone('g6_paint3d') ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5 font-mono">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'en' ? 'Diploma Earned (100 pts)' : 'Diplomă Obținută (100 pct)'}</span>
                  </span>
                ) : activeMissionId === 'g6_paint3d' && activeMissionLevel > 1 ? (
                  <span className="text-cyan-400 font-bold">
                    {lang === 'en' ? `Progress: Level ${activeMissionLevel}/7 (${activeMissionScore} pts)` : `Progres: Nivel ${activeMissionLevel}/7 (${activeMissionScore} pct)`}
                  </span>
                ) : (
                  <span>{lang === 'en' ? '7 Interactive Pages' : '7 Pagini Interactive'}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openCurriculaModal('paint-3d')}
                  className="px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-sky-300 hover:text-white border border-sky-500/30 hover:border-sky-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Vezi programa școlară, teoria și fișa didactică"
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">{lang === 'en' ? 'Syllabus' : 'Programă & Teorie'}</span>
                </button>
                <button
                  onClick={() => handleAttemptStart('g6_paint3d')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer active:scale-95 shadow-lg ${
                    isMissionDone('g6_paint3d')
                      ? 'bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-emerald-500/50 hover:border-emerald-400 shadow-emerald-500/10'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white font-black shadow-cyan-600/30'
                  }`}
                >
                  {isMissionDone('g6_paint3d') ? (
                    <>
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'en' ? 'View Diploma / Replay' : 'Vezi Diploma / Reia'}</span>
                    </>
                  ) : activeMissionId === 'g6_paint3d' && activeMissionLevel > 1 ? (
                    <>
                      <span>{lang === 'en' ? 'Resume Mission 2A' : 'Continuă Misiunea 2A'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>{lang === 'en' ? 'Start Mission 2A (Paint 3D)' : 'Începe Misiunea 2A'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Card 4: Modulul 2B - Animație Toontastic & VR CoSpaces Edu */}
          <div className="bg-slate-900/80 border-2 border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl">
                  🎬
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-mono font-bold">
                  UNITATEA 2 • LECȚIILE 3–4
                </span>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 font-mono">
                Manual pag. 34–43 • Unitatea 2
              </div>

              <h3 className="text-xl font-black text-white font-heading mb-1">
                Animație Toontastic & Realitate Virtuală VR
              </h3>
              <div className="text-xs font-semibold text-slate-400 mb-3">
                Cadre pe Secundă (24 FPS), Regie Audio & Lumi Virtuale CoSpaces
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                Crearea personajelor animate, înregistrarea vocii în direct, setarea dispoziției sonore (Mood) și explorarea scenelor interactive la 360° cu ochelari VR.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">Cinema & Spațiu Virtual</span>
              <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
                În pregătire
              </span>
            </div>
          </div>

          {/* Card 5: Modulul 3A - Amenințări Malware & Securitate Cibernetică */}
          <div className="bg-slate-900/80 border-2 border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl">
                  🛡️
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-mono font-bold">
                  UNITATEA 3 • LECȚIA 1
                </span>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 font-mono">
                Manual pag. 44–45 • Unitatea 3
              </div>

              <h3 className="text-xl font-black text-white font-heading mb-1">
                Amenințări Malware & Protecție Digitală
              </h3>
              <div className="text-xs font-semibold text-slate-400 mb-3">
                Viruși, Viermi, Troieni, Spyware & Firewall
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                Identificarea programelor dăunătoare, crearea de parole complexe (litere, cifre, simboluri) și utilizarea programelor antivirus moderne cu baze de date actualizate.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">Securitate Cibernetică</span>
              <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
                În pregătire
              </span>
            </div>
          </div>

          {/* Card 6: Modulul 3B - E-mail & Netichetă */}
          <div className="bg-slate-900/80 border-2 border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl">
                  ✉️
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-mono font-bold">
                  UNITATEA 3 • LECȚIILE 2–4
                </span>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 font-mono">
                Manual pag. 46–61 • Unitatea 3
              </div>

              <h3 className="text-xl font-black text-white font-heading mb-1">
                Servicii E-mail, Netichetă & Colaborare
              </h3>
              <div className="text-xs font-semibold text-slate-400 mb-3">
                Structura Mesajului (To, CC, BCC, Atașamente) & Reguli de Conduită
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                Trimiterea corectă a scrisorilor electronice, respectarea bunelor maniere digitale (Neticheta) și utilizarea platformelor de stocare cloud pentru proiecte în echipă.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">Comunicare Digitală</span>
              <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
                În pregătire
              </span>
            </div>
          </div>

          {/* Card 7: Modulul 4A - Bucle Condiționate Scratch */}
          <div className="bg-slate-900/80 border-2 border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl">
                  🔄
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-mono font-bold">
                  UNITATEA 4 • LECȚIILE 1–2
                </span>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 font-mono">
                Manual pag. 62–75 • Unitatea 4
              </div>

              <h3 className="text-xl font-black text-white font-heading mb-1">
                Algoritmi & Bucle Condiționate în Scratch
              </h3>
              <div className="text-xs font-semibold text-slate-400 mb-3">
                Structura „Cât timp” (While) & „Repetă până când” (Repeat Until)
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                Comparație între execuția secvențială și structurile repetitive condiționate, gestionarea condițiilor de oprire și evitarea buclelor infinite în jocuri interactive.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">Programare Avansată</span>
              <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
                În pregătire
              </span>
            </div>
          </div>

          {/* Card 8: Modulul 4B - Contor For, Proiecte Minecraft 3D & Jocuri Finale */}
          <div className="bg-slate-900/80 border-2 border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl">
                  🎮
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-mono font-bold">
                  UNITATEA 4 • LECȚIILE 3–5
                </span>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 font-mono">
                Manual pag. 76–93 • Unitatea 4
              </div>

              <h3 className="text-xl font-black text-white font-heading mb-1">
                Bucle cu Contor, Minecraft 3D & Marea Diplomă
              </h3>
              <div className="text-xs font-semibold text-slate-400 mb-3">
                Fractali Geometrici, Proiectul Coloana Infinitului & Absolvire
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                Construcția de structuri Minecraft pas-cu-pas, generarea coloanei infinitului (Brâncuși), jocuri complexe cu scor și decernarea Marii Diplome de Absolvire a Clasei a VI-a!
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">Marea Finală Clasa a VI-a</span>
              <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
                În pregătire
              </span>
            </div>
          </div>
        </div>
      </div>
      )}

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
                  {lang === 'en' ? '18 Mini-Games' : '18 Mini-Jocuri'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white font-heading mt-0.5">
                {lang === 'en' ? '📑 PageCraft Studio, 🟥 Roblox Blox Clicker, ⛏️ Minecraft Redstone & Cyber Dino' : '📑 PageCraft: Machetare & Tabele, 🟥 Roblox Blox Clicker & ⛏️ Minecraft Redstone'}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {lang === 'en'
                  ? 'Master document layout in PageCraft, compete in Roblox Blox Clicker, build Minecraft Redstone circuits & Voxel PCs, sprint in Cyber Dino, and sort files in Tetris drop!'
                  : 'Machetează ziare în PageCraft, concurează în Roblox Blox Clicker, construiește calculatoare Voxel 3D, circuite Redstone în stil Minecraft și aleargă în Cyber Dino!'}
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
            <Gamepad2 className="w-4 h-4" />
            <span>{lang === 'en' ? 'Open Arcade' : 'Deschide Jocuri Arcade'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
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
                {lang === 'en' ? 'ArkyEdu Duel Arena — 1v1 Classmate Battles' : 'Arena Duelurilor TIC — Concurs 1v1 între Colegi pe Calculatoare Diferite'}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {lang === 'en'
                  ? 'Create a game room with a 4-letter code or join your classmate’s challenge! Block Coding Scratch Duel, Cyber Sprint typing race, and Quiz Blitz live competition.'
                  : 'Creează o cameră cu cod de 4 litere sau intră în provocarea colegului tău! Cursa Algoritmilor Scratch, Cyber Sprint tastare rapidă și bătălia creierelor Quiz Blitz.'}
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

      {/* Cyber City Builder Banner Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-cyan-950/60 to-slate-900 border-2 border-cyan-500/40 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0 mt-1 sm:mt-0 ring-2 ring-cyan-400/30">
              <Building2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  {lang === 'en' ? 'Metropolis Simulator' : 'Simulator Urban TIC'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/30">
                  {lang === 'en' ? 'Cyber City Builder' : 'Metropola Mea Tehnologică'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white font-heading mt-0.5">
                {lang === 'en' ? 'ArkyEdu Cyber City — Build & Expand Your Tech Metropolis' : 'ArkyEdu Cyber City — Construiește și Modernizează Metropola Ta Digitală'}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {lang === 'en'
                  ? 'Use ByteCoins earned in lessons to construct Cloud Data Centers, AI Labs, 5G Towers & Fusion Reactors. Boost your computing power and become a Supreme Galactic Architect!'
                  : 'Folosește ByteCoins câștigate în lecții pentru a construi Centre de Date Cloud, AI Labs, Turnuri 5G și Reactoare de Fuziune Curată. Crește puterea de calcul a orașului și devino Arhitect Suprem!'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onOpenCity?.();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 cursor-pointer shrink-0 active:scale-95"
          >
            <Building2 className="w-4 h-4" />
            <span>{lang === 'en' ? 'Open Cyber City' : 'Deschide Orașul Meu'}</span>
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

      {/* Discreet Teacher & Superadmin Portal Links */}
      {(onOpenTeacherPortal || onOpenSuperAdmin) && (
        <div className="pt-2 pb-1 border-t border-slate-800/60 flex items-center justify-center gap-3">
          {onOpenTeacherPortal && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenTeacherPortal();
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 text-[11px] font-medium transition cursor-pointer"
              title={lang === 'en' ? 'Instructor Portal (Gradebook & Scoring)' : 'Acces securizat pentru cadre didactice (catalog & notare)'}
            >
              <span className="text-slate-600 text-xs">🔒</span>
              <span>{lang === 'en' ? 'Instructor Portal' : 'Acces cadre didactice'}</span>
            </button>
          )}

          {onOpenSuperAdmin && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenSuperAdmin();
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-amber-500/70 hover:text-amber-300 hover:bg-amber-500/10 text-[11px] font-semibold transition cursor-pointer"
              title="Consolă Superadmin (Control Global Școli, Profesori, Scoruri)"
            >
              <span className="text-amber-500 text-xs">🛡️</span>
              <span>SuperAdmin Control</span>
            </button>
          )}
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

      {/* Course Curricula & SEO Syllabus Modal */}
      {selectedCurriculaModule && (
        <CourseCurriculaModal
          module={selectedCurriculaModule}
          onClose={() => {
            setSelectedCurriculaModule(null);
            try {
              if (window.location.hash.startsWith('#curricula-')) {
                window.history.replaceState(null, '', ' ');
              }
            } catch {}
          }}
          onStartMission={(mId) => {
            const mappedMission =
              mId === 'g6p1'
                ? 'g6_presentation1'
                : mId === 'g6p2'
                ? 'g6_presentation2'
                : mId === 'g6paint3d'
                ? 'g6_paint3d'
                : mId;
            handleAttemptStart(mappedMission as any);
          }}
        />
      )}
    </div>
  );
};

function activeScore(level: number, missionId?: 'hardware' | 'files' | 'internet1' | 'internet2' | 'text1' | 'text2' | 'algo1' | 'algo2' | 'scratch1' | 'scratch2' | 'g6_presentation1' | null): number {
  if (level <= 1) return 0;
  if (missionId === 'hardware') {
    return Math.min((level - 1) * 20, 100);
  }
  if (missionId === 'internet1' || missionId === 'internet2') {
    const internetScores = [0, 15, 30, 45, 60, 80, 100];
    return internetScores[Math.min(level - 1, 6)] || 0;
  }
  if (missionId === 'text1' || missionId === 'text2' || missionId === 'algo1' || missionId === 'algo2' || missionId === 'scratch1' || missionId === 'scratch2' || missionId === 'g6_presentation1') {
    const standardScores = [0, 15, 30, 45, 60, 75, 90, 100];
    return standardScores[Math.min(level - 1, 7)] || 0;
  }
  const filesScores = [0, 10, 25, 40, 55, 70, 85, 100];
  return filesScores[Math.min(level - 1, 7)] || 0;
}
