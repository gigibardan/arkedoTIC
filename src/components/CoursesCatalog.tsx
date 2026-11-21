import React, { useState, useEffect } from 'react';
import {
  School,
  BookOpen,
  Award,
  Sparkles,
  User,
  ArrowRight,
  CheckCircle2,
  Lock,
  BadgeCheck,
  Gamepad2,
  Volume2,
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
  Building2,
  Presentation,
  Code2,
  Terminal,
  ClipboardCheck,
  Radio,
  CalendarClock,
  Compass,
  BrainCircuit,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useArky } from '../context/ArkyContext';
import { sounds } from '../utils/audio';
import { KnowledgePills } from './hardware/KnowledgePills';
import { MissionGuardModal } from './MissionGuardModal';
import { CourseCurriculaModal } from './CourseCurriculaModal';
import { CURRICULA_MODULES, CurriculaModule } from '../data/curriculaData';
import { BLOG_ARTICLES } from '../data/blog';
import { GLOSSARY_TERMS } from '../data/glossary';
import { WORKSHEETS_BANK, WORKSHEET_GRADE_LABELS, WORKSHEET_KIND_LABELS } from '../data/worksheets';
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
import { Grade7CatalogSection } from './grade7/Grade7CatalogSection';
import { Grade7InteractiveSimulators } from './grade7/Grade7InteractiveSimulators';
import { Grade8CatalogSection } from './grade8/Grade8CatalogSection';
import { Grade8InteractiveSimulators } from './grade8/Grade8InteractiveSimulators';
import { AllMissionId, ClassAssignment } from '../types';
import { forceScrollToTop } from '../utils/scrollHelper';
import { MissionCard } from './catalog/MissionCard';
import { GRADE5_MISSIONS, GRADE6_MISSIONS } from './catalog/gradeMissionsData';
import { MISSION_META_BY_ID } from '../data/missionsRegistry';
import {
  evaluateAssignmentForStudent,
  getAssignmentsForStudent,
  getStoredStudentClassMeta,
} from '../lib/classroomService';
import { SANDBOX_CHALLENGES } from '../data/sandboxChallenges';

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
  onSelectMission: (missionId: AllMissionId) => void;
  activeMissionId: AllMissionId | null;
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
  onOpenBlog?: (slug?: string | null) => void;
  onOpenGlossary?: (slug?: string | null) => void;
  onOpenSandbox?: (
    lang?: 'cpp' | 'python' | 'html',
    challengeId?: string,
    tab?: 'editor' | 'trace' | 'olympiad'
  ) => void;
  onOpenCarnet?: () => void;
  onOpenEvaluare?: () => void;
  onOpenLiveQuiz?: () => void;
  onOpenWorksheets?: (slug?: string | null) => void;
  onOpenLeonida?: (launchWorld?: boolean) => void;
  onOpenAiLab?: () => void;
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
  onOpenBlog,
  onOpenGlossary,
  onOpenSandbox,
  onOpenCarnet,
  onOpenEvaluare,
  onOpenLiveQuiz,
  onOpenWorksheets,
  onOpenLeonida,
  onOpenAiLab,
  byteCoins,
}) => {
  const getMaxPlayableLevels = (mId: string): number => {
    const meta = MISSION_META_BY_ID[mId];
    if (meta) return meta.maxLevels;
    if (mId.startsWith('g8_')) return 5;
    return 7;
  };

  const isMissionDone = (mId: string): boolean => {
    const meta = MISSION_META_BY_ID[mId];
    const victoryLevelStr = String((meta?.maxLevels ?? getMaxPlayableLevels(mId)) + 1);
    try {
      if (localStorage.getItem(`arkedo_completed_${mId}`) === 'true') return true;
      const prefixes = meta
        ? [meta.localPrefix, ...(meta.legacyLocalPrefix ? [meta.legacyLocalPrefix] : [])]
        : mId.startsWith('g8_')
        ? [mId]
        : [];
      for (const prefix of prefixes) {
        if (
          localStorage.getItem(`arkedo_${prefix}_level`) === victoryLevelStr ||
          Number(localStorage.getItem(`arkedo_${prefix}_score`) || '0') >= 100
        ) {
          return true;
        }
      }
    } catch {}
    if (completedMissions && completedMissions[mId]) return true;
    if (activeMissionId === mId && activeMissionLevel > getMaxPlayableLevels(mId)) return true;
    const activeStudent = getActiveStudent();
    if (activeStudent?.lessonsProgress) {
      const lessonKey = meta?.lessonsKey ?? mId;
      const lpRecord = activeStudent.lessonsProgress as unknown as Record<
        string,
        { completed?: boolean; score?: number } | undefined
      >;
      if (lpRecord[lessonKey]?.completed || (lpRecord[lessonKey]?.score || 0) >= 100) {
        return true;
      }
    }
    return false;
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

  const [passMode, setPassMode] = useState<'login' | 'register' | 'guest'>('login');

  const [loginUsername, setLoginUsername] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');

  const [registerUsername, setRegisterUsername] = useState<string>('');
  const [registerPassword, setRegisterPassword] = useState<string>('');
  const [showRegisterPassword, setShowRegisterPassword] = useState<boolean>(false);
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);
  const [registerError, setRegisterError] = useState<string>('');

  const [isRenaming, setIsRenaming] = useState<boolean>(false);
  const [renameInput, setRenameInput] = useState<string>('');
  const [renameError, setRenameError] = useState<string>('');
  const [renameLoading, setRenameLoading] = useState<boolean>(false);

  const [isSelectingAvatar, setIsSelectingAvatar] = useState<boolean>(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(() => {
    try {
      return localStorage.getItem('arkedo_student_avatar') || '🎓';
    } catch {
      return '🎓';
    }
  });

  const [guardModalOpen, setGuardModalOpen] = useState<boolean>(false);
  const [pendingTargetMission, setPendingTargetMission] = useState<AllMissionId | null>(null);
  const [selectedCurriculaModule, setSelectedCurriculaModule] = useState<CurriculaModule | null>(null);
  const [studentAssignments, setStudentAssignments] = useState<ClassAssignment[]>([]);

  useEffect(() => {
    getAssignmentsForStudent(activeAccount)
      .then((list) => setStudentAssignments(list.filter((a) => a.status === 'active')))
      .catch(() => {});
  }, [activeAccount?.id, activeAccount?.classId, completedMissions]);

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

  const [selectedGrade, setSelectedGrade] = useState<'grade5' | 'grade6' | 'grade7' | 'grade8'>(() => {
    try {
      if (typeof window !== 'undefined') {
        const fullUrl = (window.location.pathname + window.location.search + window.location.hash).toLowerCase();
        if (fullUrl.includes('clasa-8') || fullUrl.includes('clasa-a-8') || fullUrl.includes('grade8') || fullUrl.includes('clasa-a-viii')) return 'grade8';
        if (fullUrl.includes('clasa-7') || fullUrl.includes('clasa-a-7') || fullUrl.includes('grade7') || fullUrl.includes('clasa-a-vii')) return 'grade7';
        if (fullUrl.includes('clasa-6') || fullUrl.includes('clasa-a-6') || fullUrl.includes('grade6') || fullUrl.includes('clasa-a-vi')) return 'grade6';
        if (fullUrl.includes('clasa-5') || fullUrl.includes('clasa-a-5') || fullUrl.includes('grade5') || fullUrl.includes('clasa-a-v')) return 'grade5';
      }
      const saved = localStorage.getItem('arkedo_selected_grade');
      if (saved === 'grade8') return 'grade8';
      if (saved === 'grade7') return 'grade7';
      if (saved === 'grade6') return 'grade6';
    } catch {
      // Ignore
    }
    return 'grade5';
  });

  const handleSelectGrade = (grade: 'grade5' | 'grade6' | 'grade7' | 'grade8') => {
    sounds.playClick();
    setSelectedGrade(grade);
    try {
      localStorage.setItem('arkedo_selected_grade', grade);
    } catch {
      // Ignore
    }
  };

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const [arkyTipIndex, setArkyTipIndex] = useState<number>(0);
  const arkyTips =
    lang === 'en'
      ? [
          'Tap me anytime for a secret tech fact! 🤖✨',
          'Win + E opens File Explorer in a single blink! ⚡',
          'Ctrl + A selects everything at once. Super fast! 🎯',
          'Remember: RAM is your desk, SSD is your permanent shelf! 💾',
          'The 20-20-20 rule keeps your eyes fresh during long sessions! 👀',
          'Never type ? or * in filenames—Windows reserves them for search! 🛑',
          'Shift + Click selects adjacent items; Ctrl + Click selects scattered items! 🖱️',
        ]
      : [
          'Apasă pe mine oricând pentru un secret tehnologic! 🤖✨',
          'Win + E deschide File Explorer într-o secundă! ⚡',
          'Ctrl + A selectează toate fișierele dintr-o mișcare! 🎯',
          'Reține: RAM este masa de lucru, SSD este dulapul permanent! 💾',
          'Regula 20-20-20 îți relaxează ochii: 20 secunde la 6 metri distanță! 👀',
          'Nu folosi niciodată ? sau * în nume de fișiere—sunt caractere rezervate! 🛑',
          'Shift + Click selectează fișiere legate; Ctrl + Click pe cele răsfirate! 🖱️',
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

  const handleAttemptStart = (targetMission: AllMissionId) => {
    if (!studentName && !nameInput.trim()) {
      const defaultName = lang === 'en' ? 'Student Explorer' : 'Elev Explorator';
      setNameInput(defaultName);
      onSetStudentName(defaultName);
    } else if (nameInput.trim() && !studentName) {
      onSetStudentName(nameInput.trim());
    }

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

    sounds.playClick();
    forceScrollToTop();
    onSelectMission(targetMission);
  };

  const getMissionTitle = (id: AllMissionId | null) => {
    if (id?.startsWith('g8_')) {
      const g8Titles: Record<string, { ro: string; en: string }> = {
        g8_calc_a: { ro: 'Clasa a VIII-a • Modulul 1A: Registrul de calcul tabelar, Celule & Tipuri de Date', en: 'Grade 8 • Module 1A: Spreadsheet Workbook Structure, Cells & Data Types' },
        g8_calc_b: { ro: 'Clasa a VIII-a • Modulul 1B: Formule & Funcții Matematice/Statistice (SUM, AVERAGE, MIN, MAX)', en: 'Grade 8 • Module 1B: Formulas & Statistical Functions (SUM, AVERAGE, MIN, MAX)' },
        g8_calc_c: { ro: 'Clasa a VIII-a • Modulul 1C: Reprezentări Grafice & Diagrame 2D/3D', en: 'Grade 8 • Module 1C: Data Visualization & 2D/3D Charts' },
        g8_calc_d: { ro: 'Clasa a VIII-a • Modulul 1D: Baze de Date Tabelare, Sortare & Filtrare', en: 'Grade 8 • Module 1D: Tabular Databases, Multi-key Sorting & Filtering' },
        g8_web_a: { ro: 'Clasa a VIII-a • Modulul 2A: Structura Web & HTML5 Semantic', en: 'Grade 8 • Module 2A: Web Structure & Semantic HTML5' },
        g8_web_b: { ro: 'Clasa a VIII-a • Modulul 2B: Google Sites & Creare Vizuală WYSIWYG', en: 'Grade 8 • Module 2B: Google Sites & Visual WYSIWYG Web Design' },
        g8_web_c: { ro: 'Clasa a VIII-a • Modulul 2C: Publicare Web, Domenii, Securitate HTTPS & SEO', en: 'Grade 8 • Module 2C: Web Publishing, Domains, HTTPS Security & SEO' },
        g8_algo_a: { ro: 'Clasa a VIII-a • Modulul 3A: Recapitulare C++, Variabile & Expresii', en: 'Grade 8 • Module 3A: C++ Recap, Variables & Complex Expressions' },
        g8_algo_b: { ro: 'Clasa a VIII-a • Modulul 3B: Structuri Alternative: if/else, switch & Cifrele unui Număr', en: 'Grade 8 • Module 3B: Decisions: if/else, switch & Digit Extraction' },
        g8_algo_c: { ro: 'Clasa a VIII-a • Modulul 3C: Structuri Repetitive: while, do-while, for & Șiruri', en: 'Grade 8 • Module 3C: Loops: while, do-while, for & Number Sequences' },
        g8_algo_d: { ro: 'Clasa a VIII-a • Modulul 3D: Algoritmi Fundamentali: Primalitate, CMMDC, Fibonacci', en: 'Grade 8 • Module 3D: Fundamental Algorithms: Primes, GCD & Fibonacci' },
        g8_algo_e: { ro: 'Clasa a VIII-a • Modulul 3E: Subprograme, Funcții & Proiect Integrator C++', en: 'Grade 8 • Module 3E: Subprograms, Functions & C++ Integrator Project' },
        g8_robot_a: { ro: 'Clasa a VIII-a • Modulul 4A: Robotică, Microcontrollere Arduino & Senzori (Manual pag. 89-98)', en: 'Grade 8 • Module 4A: Robotics, Arduino Microcontrollers & Sensors (Textbook p. 89-98)' },
        g8_robot_b: { ro: 'Clasa a VIII-a • Modulul 4B: Sisteme Inteligente, Smart Home & Proiectul Integrator IoT (Manual pag. 99-108)', en: 'Grade 8 • Module 4B: Smart Systems, Smart Home & IoT Integrator Project (Textbook p. 99-108)' },
      };
      if (id && g8Titles[id]) {
        return lang === 'en' ? g8Titles[id].en : g8Titles[id].ro;
      }
    }
    if (id === 'g7_robot_b') return lang === 'en' ? 'Grade 7 • Module 4F: Educational Robotics & Virtual Robots with Sensors (Textbook p. 103-108)' : 'Clasa a VII-a • Modulul 4F: Robotică Educațională & Roboți Virtuali cu Senzori (Manual pag. 103-108)';
    if (id === 'g7_stem_a') return lang === 'en' ? 'Grade 7 • Module 4E: For Loop, do-while & Interdisciplinary STEM in C++ (Textbook p. 86-102)' : 'Clasa a VII-a • Modulul 4E: Bucle for, do-while & Aplicații Interdisciplinare STEM (Manual pag. 86-102)';
    if (id === 'g7_loop_b') return lang === 'en' ? 'Grade 7 • Module 4D: While Loop & Number Digit Algorithms (Textbook p. 81-85)' : 'Clasa a VII-a • Modulul 4D: Structura Repetitivă while & Algoritmi pe Cifrele unui Număr (Manual pag. 81-85)';
    if (id === 'g7_decision_a') return lang === 'en' ? 'Grade 7 • Module 4C: Alternative Structure, if/else & Logical Operators (Textbook p. 77-80)' : 'Clasa a VII-a • Modulul 4C: Structura Alternativă: if / else & Operatori Logici (Manual pag. 77-80)';
    if (id === 'g7_cpp_b') return lang === 'en' ? 'Grade 7 • Module 4B: Linear Structure, cin/cout & The 3-Glasses Rule (Textbook p. 74-76)' : 'Clasa a VII-a • Modulul 4B: Structura Liniară, cin/cout & Regula celor 3 Pahare (Manual pag. 74-76)';
    if (id === 'g7_cpp_a') return lang === 'en' ? 'Grade 7 • Module 4A: Transition to C++, Code::Blocks & Data Types (Textbook p. 64-73)' : 'Clasa a VII-a • Modulul 4A: Tranziția la C++: Mediul Code::Blocks, Compilare & Tipuri de Date (Manual pag. 64-73)';
    if (id === 'g7_gis_b') return lang === 'en' ? 'Grade 7 • Module 3B: GIS & Digital Cartography (Textbook p. 57-63)' : 'Clasa a VII-a • Modulul 3B: Sisteme Informaționale Geografice (GIS) & Cartografie Digitală (Manual pag. 57-63)';
    if (id === 'g7_cloud_a') return lang === 'en' ? 'Grade 7 • Module 3A: Cloud Collaboration & Teams (Textbook p. 48-56)' : 'Clasa a VII-a • Modulul 3A: Aplicații Colaborative în Cloud — Google Docs & Slides în Echipă (Manual pag. 48-56)';
    if (id === 'g7_video_b') return lang === 'en' ? 'Grade 7 • Module 2B: Multitrack VideoPad Editing, Transitions & Titling (Textbook p. 36-47)' : 'Clasa a VII-a • Modulul 2B: Montaj Video Multitrack, Tranziții & Titrare în VideoPad (Manual pag. 36-47)';
    if (id === 'g7_audio_a') return lang === 'en' ? 'Grade 7 • Module 2A: Digital Acoustics & WavePad Audio Studio (Textbook p. 28-35)' : 'Clasa a VII-a • Modulul 2A: Acustică Digitală & Studio de Editare WavePad (Manual pag. 28-35)';
    if (id === 'g7_word_a') return lang === 'en' ? 'Grade 7 • Module 1A: Advanced Typography & Romanian Digital Standards (Textbook p. 10-14)' : 'Clasa a VII-a • Modulul 1A: Tehnoredactare Avansată & Tipografie Digitală Românească (Manual pag. 10-14)';
    if (id === 'g7_word_b') return lang === 'en' ? 'Grade 7 • Module 1B: Page Layout, Headers & Structured Documents (Textbook p. 18-27)' : 'Clasa a VII-a • Modulul 1B: Machetare de Pagină, Antet, Subsol & Documente Structurate (Manual pag. 18-27)';
    if (id === 'hardware') return lang === 'en' ? 'Module 1: Computer Systems & Hardware (Textbook p. 10-20)' : 'Modulul 1: Sisteme de calcul & Hardware (Manual pag. 10-20)';
    if (id === 'files') return lang === 'en' ? 'Module 2: The Secret File Tree (Textbook p. 27-30)' : 'Modulul 2: Arborele Secret de Fișiere (Manual pag. 27-30)';
    if (id === 'internet1') return lang === 'en' ? 'Module 3A: Internet, Networks & World Wide Web (Textbook p. 32-36)' : 'Modulul 3A: Internet, Rețele & World Wide Web (Manual pag. 32-36)';
    if (id === 'internet2') return lang === 'en' ? 'Module 3B: Advanced Search, Communication & Digital Identity (Textbook p. 38-48)' : 'Modulul 3B: Căutare Avansată, Comunicare & Identitate Digitală (Manual pag. 38-48)';
    if (id === 'text1') return lang === 'en' ? 'Module 4A: Word Processor & Text Formatting (Textbook p. 50-67)' : 'Modulul 4A: Inițierea și Formatarea Textului (Manual pag. 50-67)';
    if (id === 'text2') return lang === 'en' ? 'Module 4B: Visual Elements & Tables (Textbook p. 68-80)' : 'Modulul 4B: Elemente Grafice, Tabele & Paginare (Manual pag. 68-80)';
    if (id === 'algo1') return lang === 'en' ? 'Module 5A: Algorithm Fundamentals & Sequential Logic (Textbook p. 54-61)' : 'Modulul 5A: Noțiunea de Algoritm & Algoritmi Secvențiali (Manual pag. 54-61)';
    if (id === 'algo2') return lang === 'en' ? 'Module 5B: Decisions, Data Types & Flowcharts (Textbook p. 62-71)' : 'Modulul 5B: Structuri Decizionale, Date & Scheme Logice (Manual pag. 62-71)';
    if (id === 'scratch1') return lang === 'en' ? 'Module 6A: Scratch 3.0 Environment, Linear Movement & Variables (Textbook p. 72-90)' : 'Modulul 6A: Mediul Scratch, Mișcare Liniară & Variabile (Manual pag. 72-90)';
    if (id === 'scratch2') return lang === 'en' ? 'Module 6B: Scratch Decisions, Music, Contest Games & Grand Exam (Textbook p. 84-93)' : 'Modulul 6B: Decizii, Muzică, Concurs de Jocuri & Marea Evaluare (Manual pag. 84-93)';
    if (id === 'g6_presentation1') return lang === 'en' ? 'Grade 6 • Module 1A: Presentation & PowerPoint Interface (Textbook p. 10-15)' : 'Clasa a VI-a • Modulul 1A: Prezentarea & Interfața PowerPoint (Manual pag. 10-15)';
    if (id === 'g6_presentation2') return lang === 'en' ? 'Grade 6 • Module 1B: Slide Creation, Design, Animations & Public Speaking (Textbook p. 16-25)' : 'Clasa a VI-a • Modulul 1B: Realizare, Design, Animații & Public Speaking (Manual pag. 16-25)';
    if (id === 'g6_paint3d') return lang === 'en' ? 'Grade 6 • Module 2A: 3D Modeling in Paint 3D (Textbook p. 26-33)' : 'Clasa a VI-a • Modulul 2A: Modelare 3D în Paint 3D (Manual pag. 26-33)';
    if (id === 'g6_anim3d') return lang === 'en' ? 'Grade 6 • Module 2B: Toontastic Animation & Virtual Reality VR (Textbook p. 34-43)' : 'Clasa a VI-a • Modulul 2B: Animație Toontastic & Realitate Virtuală VR (Manual pag. 34-43)';
    if (id === 'g6_malware') return lang === 'en' ? 'Grade 6 • Module 3A: Malware Threats & Cyber Security (Textbook p. 44-45)' : 'Clasa a VI-a • Modulul 3A: Amenințări Malware & Securitate Cibernetică (Manual pag. 44-45)';
    if (id === 'g6_email') return lang === 'en' ? 'Grade 6 • Module 3B: Email Services, Netiquette & Cloud Collaboration (Textbook p. 46-61)' : 'Clasa a VI-a • Modulul 3B: Servicii E-mail, Netichetă & Colaborare Cloud (Manual pag. 46-61)';
    if (id === 'g6_scratch1') return lang === 'en' ? 'Grade 6 • Module 4A: Scratch Conditional Loops & Algorithm Logic (Textbook p. 62-75)' : 'Clasa a VI-a • Modulul 4A: Algoritmi & Bucle Condiționate în Scratch (Manual pag. 62-75)';
    if (id === 'g6_scratch2') return lang === 'en' ? 'Grade 6 • Module 4B: Counter Loops, Minecraft 3D & Graduation (Textbook p. 76-93)' : 'Clasa a VI-a • Modulul 4B: Bucle cu Contor, Minecraft 3D & Marea Diplomă (Manual pag. 76-93)';
    return lang === 'en' ? 'No active mission' : 'Nicio misiune activă';
  };

  const scrollToMissions = () => {
    sounds.playClick();
    const target =
      document.getElementById('comutator-clasa') ||
      document.getElementById('sectiune-misiuni-practice') ||
      document.getElementById('sectiune-misiuni-clasa-6') ||
      document.getElementById('sectiune-misiuni-clasa-7') ||
      document.getElementById('sectiune-misiuni-clasa-8');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const grade5DoneCount = GRADE5_MISSIONS.filter((m) => isMissionDone(m.id)).length;
  const grade6DoneCount = GRADE6_MISSIONS.filter((m) => isMissionDone(m.id)).length;

  const hasResumableMission =
    Boolean(activeMissionId) &&
    !isMissionDone(activeMissionId as string) &&
    activeMissionLevel > 1;

  return (
    <div className="flex flex-col gap-6 sm:gap-8 pb-10">
      {/* 1. STREAMLINED HERO + STUDENT PASS + ARKY COMPANION */}
      <section
        aria-label={lang === 'en' ? 'ArkyEdu Hero & Student Station' : 'Secțiune Principală ArkyEdu'}
        className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950/35 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-8 shadow-2xl"
      >
        {/* Subtle ambient corner glow */}
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute -bottom-24 -left-16 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Clean Title + Primary CTA + Compact Student Access Pass */}
          <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-5">
            {/* Unboxed Clean Curriculum Eyebrow */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono text-teal-300 font-semibold">
              <span className="inline-flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{t.catalogBadge}</span>
              </span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="text-emerald-300">
                {lang === 'en' ? 'Curriculum 2026 Ready · 100% Free' : 'Conform Programei Școlare · 100% Gratuit'}
              </span>
            </div>

            {/* Hero Headline & Readable Lead */}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-heading tracking-tight leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-200">
                  {lang === 'en' ? 'ICT' : 'TIC'}
                </span>
                <span className="text-slate-500 font-light mx-2">–</span>
                <span>
                  {lang === 'en'
                    ? 'Information & Communications Technology'
                    : 'Tehnologia Informației și a Comunicațiilor'}
                </span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-[15px] leading-relaxed mt-2 max-w-2xl">
                {lang === 'en'
                  ? 'Explore interactive modules for Grades 5–8 with hands-on simulators, coding sandboxes, teacher pro tips, and official merit diplomas.'
                  : 'Platformă educațională digitală pentru clasele V–VIII cu misiuni interactive, simulatoare de sistem de operare, C++ / Python, jocuri arcade și diplome oficiale de merit.'}
              </p>
            </div>

            {/* Primary Focal CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {hasResumableMission && activeMissionId ? (
                <button
                  type="button"
                  onClick={() => handleAttemptStart(activeMissionId)}
                  className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer active:scale-[0.98] min-h-[46px]"
                >
                  <span>{lang === 'en' ? 'Resume Active Mission' : 'Continuă Misiunea Activă'}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={scrollToMissions}
                  className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer active:scale-[0.98] min-h-[46px]"
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>{lang === 'en' ? 'Choose Grade & Start Learning' : 'Alege Clasa și Începe'}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              )}

              {onOpenSandbox && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onOpenSandbox('cpp');
                  }}
                  className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 hover:border-teal-400/50 font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] min-h-[46px]"
                >
                  <Code2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>{lang === 'en' ? 'Code Sandbox (C++ / Python)' : 'Sandbox Cod (C++ / Python)'}</span>
                </button>
              )}
            </div>

            {/* Compact Student Access Pass Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-xl">
              {/* Pass Top Bar */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5 mb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-400/35 flex items-center justify-center text-teal-300 shrink-0">
                    <BadgeCheck className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-black tracking-wide text-white font-heading leading-tight truncate">
                      {lang === 'en' ? 'Student Access Pass' : 'Legitimație Elev'}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 truncate">
                      {lang === 'en' ? 'Computer Lab & Home Sync' : 'Laborator TIC & Sincronizare'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {activeAccount ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-300 bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-500/35">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{lang === 'en' ? 'CLOUD' : 'CONT CLOUD'}</span>
                    </span>
                  ) : studentName ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-300 bg-amber-500/15 px-2.5 py-1 rounded-lg border border-amber-500/35">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{lang === 'en' ? 'GUEST' : 'VIZITATOR'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                      <span>{lang === 'en' ? 'GUEST / SIGN IN' : 'NECONECTAT'}</span>
                    </span>
                  )}

                  {(activeAccount || studentName) && (
                    <button
                      onClick={handleLogout}
                      type="button"
                      className="flex items-center gap-1 text-[11px] font-mono font-bold text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900 px-2.5 py-1 rounded-lg border border-rose-500/35 transition cursor-pointer min-h-[30px]"
                      title={lang === 'en' ? 'Sign out' : 'Deconectează contul'}
                    >
                      <LogOut className="w-3 h-3" />
                      <span className="hidden xs:inline">{lang === 'en' ? 'Exit' : 'Ieșire'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* CARD BODY */}
              {activeAccount || (studentName && !isEditingName) ? (
                <div className="flex flex-col gap-3.5">
                  {isRenaming ? (
                    <form onSubmit={handleSaveRename} className="p-3.5 rounded-xl bg-slate-950/90 border border-teal-500/40 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5" />
                          {lang === 'en' ? 'Change your student name:' : 'Schimbă numele tău de elev:'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsRenaming(false);
                            setRenameError('');
                          }}
                          className="text-xs text-slate-400 hover:text-white cursor-pointer"
                        >
                          {lang === 'en' ? 'Cancel' : 'Anulează'}
                        </button>
                      </div>

                      {activeAccount && (
                        <p className="text-[11px] text-slate-400">
                          {lang === 'en'
                            ? 'We verify in real-time that the new name is available.'
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
                          className="flex-1 bg-slate-900 border border-slate-700 focus:border-teal-400 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none min-h-[42px]"
                          autoFocus
                        />
                        <button
                          type="submit"
                          disabled={renameLoading}
                          className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50 min-h-[42px]"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{renameLoading ? (lang === 'en' ? 'Saving...' : 'Se salvează...') : lang === 'en' ? 'Save Name' : 'Salvează Numele'}</span>
                        </button>
                      </div>

                      {renameError && (
                        <div className="text-xs text-rose-400 font-bold flex items-center gap-1.5 bg-rose-950/60 p-2 rounded-xl border border-rose-500/40">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{renameError}</span>
                        </div>
                      )}
                    </form>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-teal-400/40 flex items-center justify-center text-2xl shadow-inner">
                            {selectedAvatar}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setIsSelectingAvatar((prev) => !prev);
                              sounds.playClick();
                            }}
                            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 border border-teal-400/60 text-xs flex items-center justify-center text-teal-300 hover:text-white cursor-pointer shadow"
                            title={lang === 'en' ? 'Change avatar' : 'Schimbă avatarul'}
                            aria-label={lang === 'en' ? 'Change avatar' : 'Schimbă avatarul'}
                          >
                            ✏️
                          </button>
                        </div>

                        <div className="min-w-0">
                          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 flex-wrap">
                            <span>{t.helloStudent},</span>
                            <span className="text-teal-300 font-semibold">
                              {lang === 'en' ? 'Digital Cadet' : 'Cadet TIC'}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className={activeAccount ? 'text-emerald-400' : 'text-amber-400'}>
                              {activeAccount ? '☁️ Cloud Sync' : '💻 Local'}
                            </span>
                          </div>
                          <div className="text-lg font-black text-white font-heading truncate">
                            {studentName || activeAccount?.username}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 flex-wrap">
                        {onOpenCarnet && (
                          <button
                            type="button"
                            onClick={() => {
                              sounds.playClick();
                              onOpenCarnet();
                            }}
                            className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 hover:text-white text-xs font-bold transition border border-amber-500/40 cursor-pointer flex items-center gap-1.5 min-h-[38px]"
                          >
                            <Award className="w-3.5 h-3.5 text-amber-400" />
                            <span>{lang === 'en' ? 'Digital Portfolio' : 'Carnet Digital'}</span>
                          </button>
                        )}
                        {onOpenEvaluare && (
                          <button
                            type="button"
                            onClick={() => {
                              sounds.playClick();
                              onOpenEvaluare();
                            }}
                            className="px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-200 hover:text-white text-xs font-bold transition border border-cyan-500/40 cursor-pointer flex items-center gap-1.5 min-h-[38px]"
                          >
                            <ClipboardCheck className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{lang === 'en' ? 'Quick Quiz' : 'Test Rapid'}</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleStartRename}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition border border-slate-700 cursor-pointer flex items-center gap-1.5 min-h-[38px]"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{t.studentNameChangeBtn}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Player Stats Grid */}
                  {(() => {
                    const activeCity = activeAccount?.cyberCity || getCyberCityData();
                    const cityMetrics = calculateCityMetrics(activeCity);
                    const totalPoints =
                      activeAccount?.totalXP ||
                      (activeAccount
                        ? (activeAccount.arcadeScores?.totalArcade || 0) + (activeAccount.lessonsProgress?.totalLessonScore || 0)
                        : 0);
                    const cityCoins = typeof byteCoins === 'number' ? byteCoins : activeAccount?.byteCoins ?? 0;

                    return (
                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 tabular-nums">
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2">
                          <span className="text-base shrink-0" aria-hidden="true">⭐</span>
                          <div className="min-w-0">
                            <div className="text-[10px] text-amber-300/90 font-mono uppercase font-bold truncate">
                              {lang === 'en' ? 'XP' : 'Puncte'}
                            </div>
                            <div className="text-xs sm:text-sm font-black text-amber-300 font-heading truncate">
                              {totalPoints.toLocaleString()} XP
                            </div>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2">
                          <span className="text-base shrink-0" aria-hidden="true">🪙</span>
                          <div className="min-w-0">
                            <div className="text-[10px] text-purple-300/90 font-mono uppercase font-bold truncate">
                              ByteCoins
                            </div>
                            <div className="text-xs sm:text-sm font-black text-purple-200 font-heading truncate">
                              {cityCoins.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2">
                          <span className="text-base shrink-0" aria-hidden="true">🏙️</span>
                          <div className="min-w-0">
                            <div className="text-[10px] text-cyan-300/90 font-mono uppercase font-bold truncate">
                              {lang === 'en' ? 'City' : 'Oraș TIC'}
                            </div>
                            <div className="text-xs sm:text-sm font-black text-cyan-200 font-heading truncate">
                              {cityMetrics.cityScore.toLocaleString()} pts
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {isSelectingAvatar && (
                    <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                        <span>{lang === 'en' ? 'Choose an avatar:' : 'Alege un nou avatar:'}</span>
                        <button
                          type="button"
                          onClick={() => setIsSelectingAvatar(false)}
                          className="text-slate-400 hover:text-white text-xs cursor-pointer"
                        >
                          {lang === 'en' ? 'Done' : 'Închide'}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {AVATARS.map((av) => (
                          <button
                            key={av.emoji}
                            type="button"
                            onClick={() => handleSelectAvatar(av.emoji)}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition cursor-pointer shrink-0 ${
                              selectedAvatar === av.emoji
                                ? 'bg-teal-500 text-white ring-2 ring-teal-300 scale-105'
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

                  {!activeAccount && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-200 bg-amber-950/25 p-2.5 rounded-xl border border-amber-500/25">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>
                          {lang === 'en'
                            ? 'Scores sync to leaderboard only with an account.'
                            : 'Punctajul se salvează în clasament doar dacă ai cont.'}
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
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-lg transition cursor-pointer self-start sm:self-auto shrink-0"
                      >
                        {lang === 'en' ? 'Create Account' : 'Creează Cont'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Signed Out: Compact 3-Mode Student Pass Form */
                <div className="flex flex-col gap-2.5">
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setPassMode('login');
                        setLoginError('');
                        setRegisterError('');
                        sounds.playClick();
                      }}
                      className={`py-2 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] ${
                        passMode === 'login'
                          ? 'bg-teal-500 text-slate-950 font-black shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <LogIn className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{lang === 'en' ? 'Sign In' : 'Autentificare'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPassMode('register');
                        setLoginError('');
                        setRegisterError('');
                        sounds.playClick();
                      }}
                      className={`py-2 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] ${
                        passMode === 'register'
                          ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <KeyRound className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{lang === 'en' ? 'New Account' : 'Cont Nou'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPassMode('guest');
                        setLoginError('');
                        setRegisterError('');
                        sounds.playClick();
                      }}
                      className={`py-2 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] ${
                        passMode === 'guest'
                          ? 'bg-slate-800 text-white border border-slate-600'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <User className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{lang === 'en' ? 'Guest' : 'Vizitator'}</span>
                    </button>
                  </div>

                  {/* Helper note */}
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-950/70 text-[11px] text-slate-300">
                    {passMode === 'login' && (
                      <>
                        <Info className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span>
                          {lang === 'en'
                            ? 'Sign in to sync scores, ByteCoins, and diplomas across devices.'
                            : 'Autentifică-te pentru a sincroniza punctajul și diplomele pe orice calculator.'}
                        </span>
                      </>
                    )}
                    {passMode === 'register' && (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>
                          {lang === 'en'
                            ? 'Free student pass: pick an avatar, username & simple password.'
                            : 'Cont gratuit: alege un avatar, numele tău și o parolă simplă.'}
                        </span>
                      </>
                    )}
                    {passMode === 'guest' && (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>
                          {lang === 'en'
                            ? 'Guest mode saves progress locally on this device only.'
                            : 'Mod vizitator: progresul este salvat temporar doar pe acest calculator.'}
                        </span>
                      </>
                    )}
                  </div>

                  {passMode === 'login' && (
                    <form onSubmit={handleInCardLogin} className="flex flex-col gap-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                            className="w-full bg-slate-950 border border-slate-700 pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 min-h-[42px]"
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
                            className="w-full bg-slate-950 border border-slate-700 pl-9 pr-9 py-2 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 min-h-[42px]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                            aria-label={showLoginPassword ? (lang === 'en' ? 'Hide password' : 'Ascunde parola') : (lang === 'en' ? 'Show password' : 'Afișează parola')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                          >
                            {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {loginError && (
                        <div className="text-xs text-rose-300 font-bold flex items-center gap-1.5 bg-rose-950/60 p-2 rounded-xl border border-rose-500/40">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{loginError}</span>
                        </div>
                      )}

                      <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setPassMode('register');
                            setLoginError('');
                            sounds.playClick();
                          }}
                          className="text-xs text-center sm:text-left text-teal-400 hover:text-teal-300 underline underline-offset-2 cursor-pointer py-1"
                        >
                          {lang === 'en' ? "Don't have an account? Create one!" : 'Nu ai cont? Creează cont nou!'}
                        </button>
                        <button
                          type="submit"
                          disabled={loginLoading}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 min-h-[42px]"
                        >
                          <LogIn className="w-4 h-4" />
                          <span>{loginLoading ? (lang === 'en' ? 'Connecting...' : 'Se conectează...') : lang === 'en' ? 'Sign In' : 'Conectare'}</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {passMode === 'register' && (
                    <form onSubmit={handleInCardRegister} className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                        {AVATARS.map((av) => (
                          <button
                            key={av.emoji}
                            type="button"
                            onClick={() => handleSelectAvatar(av.emoji)}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-base transition cursor-pointer shrink-0 ${
                              selectedAvatar === av.emoji
                                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 font-bold'
                                : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700'
                            }`}
                            title={lang === 'en' ? av.labelEn : av.labelRo}
                          >
                            {av.emoji}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                            className="w-full bg-slate-950 border border-slate-700 pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 min-h-[42px]"
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
                            placeholder={lang === 'en' ? 'Password (min 3)...' : 'Alege o parolă (min 3)...'}
                            className="w-full bg-slate-950 border border-slate-700 pl-9 pr-9 py-2 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 min-h-[42px]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                            aria-label={showRegisterPassword ? (lang === 'en' ? 'Hide password' : 'Ascunde parola') : (lang === 'en' ? 'Show password' : 'Afișează parola')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                          >
                            {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {registerError && (
                        <div className="text-xs text-rose-300 font-bold flex items-start gap-2 bg-rose-950/60 p-2 rounded-xl border border-rose-500/40">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                          <span>{registerError}</span>
                        </div>
                      )}

                      <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setPassMode('login');
                            setRegisterError('');
                            sounds.playClick();
                          }}
                          className="text-xs text-center sm:text-left text-amber-400 hover:text-amber-300 underline underline-offset-2 cursor-pointer py-1"
                        >
                          {lang === 'en' ? 'Already have an account? Sign in!' : 'Ai deja cont? Autentifică-te!'}
                        </button>
                        <button
                          type="submit"
                          disabled={registerLoading}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 min-h-[42px]"
                        >
                          <KeyRound className="w-4 h-4" />
                          <span>{registerLoading ? (lang === 'en' ? 'Creating...' : 'Se creează...') : lang === 'en' ? 'Create Account' : 'Creează Contul'}</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {passMode === 'guest' && (
                    <form onSubmit={handleInCardGuestSubmit} className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                        {AVATARS.map((av) => (
                          <button
                            key={av.emoji}
                            type="button"
                            onClick={() => handleSelectAvatar(av.emoji)}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-base transition cursor-pointer shrink-0 ${
                              selectedAvatar === av.emoji
                                ? 'bg-teal-500 text-slate-950 ring-2 ring-teal-300 font-bold'
                                : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700'
                            }`}
                            title={lang === 'en' ? av.labelEn : av.labelRo}
                          >
                            {av.emoji}
                          </button>
                        ))}
                      </div>

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
                            className={`w-full bg-slate-950 border pl-9 pr-3.5 py-2 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none min-h-[42px] ${
                              nameError ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-700 focus:border-teal-400'
                            }`}
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer min-h-[42px]"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>{lang === 'en' ? 'Continue as Guest' : 'Confirmă Vizitator'}</span>
                        </button>
                      </div>
                      {nameError && <p className="text-xs text-rose-400 font-semibold">{t.enterNameAlert}</p>}
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Arky Live Companion */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative bg-slate-900/95 border border-teal-500/40 rounded-2xl p-3.5 sm:p-4 text-center shadow-xl mb-3 w-full max-w-sm">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-teal-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Arky TIC Assistant</span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-100 leading-snug">
                {!studentName
                  ? lang === 'en'
                    ? 'Hey! I am Arky! Sign in or pick an avatar to start earning diplomas! 🤖'
                    : 'Salut! Sunt Arky! Conectează-te sau alege un avatar pentru a debloca diplomele! 🤖'
                  : arkyTips[arkyTipIndex]}
              </p>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-teal-500/40" aria-hidden="true" />
            </div>

            <button
              type="button"
              onClick={handleArkyHeroClick}
              className="group relative cursor-pointer transition-transform touch-manipulation active:scale-95 flex flex-col items-center pb-2"
              title={lang === 'en' ? 'Tap Arky for a secret tip!' : 'Apasă pe Arky pentru un sfat secret!'}
            >
              <div className="absolute inset-4 bg-gradient-to-t from-teal-500/20 to-emerald-500/15 rounded-full blur-2xl group-hover:from-teal-400/35 group-hover:to-emerald-400/25 transition-all" aria-hidden="true" />
              <img
                src={studentName ? ARKY_IMAGES.success : ARKY_IMAGES.idle}
                alt="Arky Mascota"
                width={224}
                height={315}
                fetchPriority="high"
                className="relative z-10 w-36 sm:w-44 md:w-52 h-auto object-contain drop-shadow-[0_12px_22px_rgba(20,184,166,0.3)] group-hover:scale-105 transition-transform duration-300"
              />
              <span className="mt-1 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 group-hover:border-teal-400/60 text-[11px] font-bold text-teal-300 flex items-center gap-1.5 transition-colors">
                <Volume2 className="w-3 h-3 text-teal-400" />
                <span>{lang === 'en' ? 'Tap Arky for a tech tip' : 'Apasă pe Arky pentru un sfat'}</span>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* CLASSROOM HOMEWORK & LIVE QUIZ STRIP */}
      {(() => {
        const classMeta = getStoredStudentClassMeta();
        const evaluated = studentAssignments.map((a) =>
          evaluateAssignmentForStudent(a, activeAccount, true)
        );
        const pendingEval = evaluated.find((ev) => !ev.isAllCompleted);
        const nextTask = pendingEval?.taskStatuses.find((ts) => !ts.completed);

        if (!pendingEval && !onOpenLiveQuiz) return null;

        return (
          <section className="rounded-2xl bg-slate-900/85 border border-slate-800 px-4 py-3 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300 shrink-0">
                <CalendarClock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                {pendingEval ? (
                  <>
                    <div className="text-xs font-black text-white truncate">
                      {classMeta?.className ? `${classMeta.className} · ` : ''}
                      {pendingEval.assignment.title}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 truncate tabular-nums">
                      {pendingEval.completedCount}/{pendingEval.totalCount}{' '}
                      {lang === 'en' ? 'tasks done' : 'cerințe rezolvate'}
                      {nextTask ? ` · ${nextTask.task.label}` : ''}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-xs font-black text-white truncate">
                      {classMeta?.className
                        ? `${classMeta.className} (${classMeta.classCode})`
                        : lang === 'en'
                        ? 'Classroom Live Arena & Homework'
                        : 'Ora de TIC Live & Teme de Clasă'}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {lang === 'en'
                        ? 'Join a teacher-hosted Live Quiz with your 6-digit PIN.'
                        : 'Intră cu codul PIN de pe tablă la Quiz Live sau verifică temele în Carnet.'}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {pendingEval && nextTask && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    if (nextTask.task.type === 'mission' && nextTask.task.missionId) {
                      handleAttemptStart(nextTask.task.missionId);
                    } else if (nextTask.task.type === 'sandbox' && nextTask.task.challengeId && onOpenSandbox) {
                      const ch = SANDBOX_CHALLENGES.find((c) => c.id === nextTask.task.challengeId);
                      onOpenSandbox(ch?.language || 'cpp', nextTask.task.challengeId);
                    } else if (nextTask.task.type === 'eval' && onOpenEvaluare) {
                      onOpenEvaluare();
                    } else if (nextTask.task.type === 'arcade' && onOpenArcade) {
                      onOpenArcade();
                    } else if (onOpenCarnet) {
                      onOpenCarnet();
                    }
                  }}
                  className="px-3.5 py-2 min-h-[38px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{lang === 'en' ? 'Solve Homework' : 'Rezolvă Tema'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {onOpenLiveQuiz && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onOpenLiveQuiz();
                  }}
                  className="px-3.5 py-2 min-h-[38px] rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-200 border border-rose-500/40 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Radio className="w-3.5 h-3.5 text-rose-400" />
                  <span>{lang === 'en' ? 'Live Quiz (PIN)' : 'Quiz Live (PIN)'}</span>
                </button>
              )}
            </div>
          </section>
        );
      })()}

      {/* 2. QUICK EXPLORER STRIP (4 High-Clarity Tiles) */}
      <section aria-label={lang === 'en' ? 'Quick Platform Access' : 'Acces Rapid Platformă'}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          <button
            id="hero-badge-misiuni"
            type="button"
            onClick={scrollToMissions}
            className="group flex items-center justify-between gap-2 p-3 sm:p-3.5 rounded-2xl bg-slate-950/75 hover:bg-slate-900 border border-slate-800 hover:border-teal-400/50 transition-all cursor-pointer touch-manipulation active:scale-[0.98] text-left min-h-[60px]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300 shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-extrabold text-white truncate">
                  {lang === 'en' ? '44 Missions' : 'Misiuni V–VIII'}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {lang === 'en' ? 'Grades 5–8 ICT' : '44 lecții practice'}
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-300 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          <button
            id="hero-badge-arcade"
            type="button"
            onClick={() => {
              sounds.playClick();
              onOpenArcade?.();
            }}
            className="group flex items-center justify-between gap-2 p-3 sm:p-3.5 rounded-2xl bg-slate-950/75 hover:bg-slate-900 border border-slate-800 hover:border-indigo-400/50 transition-all cursor-pointer touch-manipulation active:scale-[0.98] text-left min-h-[60px]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-extrabold text-white truncate">
                  {lang === 'en' ? 'Arcade (30)' : 'Arcade (30)'}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {lang === 'en' ? 'ICT mini-games' : 'Jocuri educative'}
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          <button
            id="hero-badge-duel"
            type="button"
            onClick={() => {
              sounds.playClick();
              onOpenDuel?.();
            }}
            className="group flex items-center justify-between gap-2 p-3 sm:p-3.5 rounded-2xl bg-slate-950/75 hover:bg-slate-900 border border-slate-800 hover:border-rose-400/50 transition-all cursor-pointer touch-manipulation active:scale-[0.98] text-left min-h-[60px]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-300 shrink-0">
                <Swords className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-extrabold text-white truncate">Duel 1v1 Live</div>
                <div className="text-[11px] text-slate-400 truncate">
                  {lang === 'en' ? 'Play with classmates' : 'Concurs cu colegii'}
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-300 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          <button
            id="hero-badge-clasament"
            type="button"
            onClick={() => {
              sounds.playClick();
              const target = document.getElementById('sectiune-clasamente');
              if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="group flex items-center justify-between gap-2 p-3 sm:p-3.5 rounded-2xl bg-slate-950/75 hover:bg-slate-900 border border-slate-800 hover:border-amber-400/50 transition-all cursor-pointer touch-manipulation active:scale-[0.98] text-left min-h-[60px]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                <Trophy className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-extrabold text-white truncate">
                  {lang === 'en' ? 'Leaderboard' : 'Top Elevi'}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {lang === 'en' ? 'Class rankings' : 'Clasament & scoruri'}
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        </div>
      </section>

      {/* 3. GRADE LEVEL SELECTOR (Clasa V / VI / VII / VIII) */}
      <section
        id="comutator-clasa"
        aria-label={lang === 'en' ? 'Select Grade Level' : 'Selector Clasă Gimnaziu'}
        className="scroll-mt-20 bg-slate-950/75 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5 px-0.5">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
            <School className="w-4 h-4 text-teal-400 shrink-0" />
            <span>
              {lang === 'en'
                ? 'Select Academic Grade Level (Official Art Klett Curriculum)'
                : 'Alege Clasa • Programa Oficială Art Klett'}
            </span>
          </h2>
          <span className="text-[11px] font-mono text-slate-400">
            {lang === 'en' ? 'Curriculum 2026 Aligned' : 'Conform OME 5022/2023'}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Grade 5 Tab */}
          <button
            type="button"
            onClick={() => handleSelectGrade('grade5')}
            className={`p-3 sm:p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between touch-manipulation active:scale-[0.98] ${
              selectedGrade === 'grade5'
                ? 'bg-teal-950/45 border-teal-400 shadow-lg shadow-teal-950/50'
                : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-lg shrink-0">
                  🏫
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-black font-heading text-white truncate">
                    {lang === 'en' ? '5th Grade' : 'Clasa a V-a'}
                  </h3>
                  <div className="text-[11px] font-mono font-bold text-teal-400 tabular-nums">
                    {grade5DoneCount > 0 ? `${grade5DoneCount}/10 ${lang === 'en' ? 'done' : 'gata'}` : lang === 'en' ? '10 Missions' : '10 Misiuni'}
                  </div>
                </div>
              </div>
              {selectedGrade === 'grade5' && (
                <span className="px-2 py-0.5 rounded-md bg-teal-500/20 border border-teal-400/50 text-[10px] font-mono font-bold text-teal-200 shrink-0">
                  {lang === 'en' ? 'Active' : 'Activă'}
                </span>
              )}
            </div>
            <p className="hidden sm:block text-xs text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'Hardware, Secret File Tree, Internet, Word 4A–4B, Algorithms & Scratch 6A–6B.'
                : 'Hardware PC, Fișiere, Internet 3A–3B, Word 4A–4B, Algoritmi & Scratch.'}
            </p>
          </button>

          {/* Grade 6 Tab */}
          <button
            type="button"
            onClick={() => handleSelectGrade('grade6')}
            className={`p-3 sm:p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between touch-manipulation active:scale-[0.98] ${
              selectedGrade === 'grade6'
                ? 'bg-orange-950/40 border-orange-400 shadow-lg shadow-orange-950/50'
                : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-lg shrink-0">
                  🚀
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-black font-heading text-white truncate">
                    {lang === 'en' ? '6th Grade' : 'Clasa a VI-a'}
                  </h3>
                  <div className="text-[11px] font-mono font-bold text-orange-400 tabular-nums">
                    {grade6DoneCount > 0 ? `${grade6DoneCount}/8 ${lang === 'en' ? 'done' : 'gata'}` : lang === 'en' ? '8 Missions' : '8 Misiuni'}
                  </div>
                </div>
              </div>
              {selectedGrade === 'grade6' && (
                <span className="px-2 py-0.5 rounded-md bg-orange-500/20 border border-orange-400/50 text-[10px] font-mono font-bold text-orange-200 shrink-0">
                  {lang === 'en' ? 'Active' : 'Activă'}
                </span>
              )}
            </div>
            <p className="hidden sm:block text-xs text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'PowerPoint, Paint 3D, Toontastic & VR, Malware, Email & Scratch Loops.'
                : 'PowerPoint, Paint 3D, Toontastic & VR, Malware, E-mail & Bucle Scratch.'}
            </p>
          </button>

          {/* Grade 7 Tab */}
          <button
            type="button"
            onClick={() => handleSelectGrade('grade7')}
            className={`p-3 sm:p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between touch-manipulation active:scale-[0.98] ${
              selectedGrade === 'grade7'
                ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-950/50'
                : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-lg shrink-0">
                  🔬
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-black font-heading text-white truncate">
                    {lang === 'en' ? '7th Grade' : 'Clasa a VII-a'}
                  </h3>
                  <div className="text-[11px] font-mono font-bold text-cyan-400 tabular-nums">
                    {lang === 'en' ? '12 Missions' : '12 Misiuni'}
                  </div>
                </div>
              </div>
              {selectedGrade === 'grade7' && (
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-400/50 text-[10px] font-mono font-bold text-cyan-200 shrink-0">
                  {lang === 'en' ? 'Active' : 'Activă'}
                </span>
              )}
            </div>
            <p className="hidden sm:block text-xs text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'Word, Audio/Video, Cloud & GIS, C++ Programming & Virtual Robots.'
                : 'Word Avansat, Audio/Video, Cloud & GIS, Programare C++ & Robotică.'}
            </p>
          </button>

          {/* Grade 8 Tab */}
          <button
            type="button"
            onClick={() => handleSelectGrade('grade8')}
            className={`p-3 sm:p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between touch-manipulation active:scale-[0.98] ${
              selectedGrade === 'grade8'
                ? 'bg-emerald-950/40 border-emerald-400 shadow-lg shadow-emerald-950/50'
                : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-lg shrink-0">
                  🎓
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-black font-heading text-white truncate">
                    {lang === 'en' ? '8th Grade' : 'Clasa a VIII-a'}
                  </h3>
                  <div className="text-[11px] font-mono font-bold text-emerald-400 tabular-nums">
                    {lang === 'en' ? '14 Missions' : '14 Misiuni'}
                  </div>
                </div>
              </div>
              {selectedGrade === 'grade8' && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/50 text-[10px] font-mono font-bold text-emerald-200 shrink-0">
                  {lang === 'en' ? 'Active' : 'Activă'}
                </span>
              )}
            </div>
            <p className="hidden sm:block text-xs text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'Excel Spreadsheets, Web HTML5/Sites, C++ Algorithms & Arduino IoT.'
                : 'Calcul Tabelar Excel, Web HTML5, Algoritmi C++ & Arduino Smart Home.'}
            </p>
          </button>
        </div>
      </section>

      {/* 4. GRADE MISSIONS CATALOG */}
      {selectedGrade === 'grade5' && (
        <section id="sectiune-misiuni-practice" className="scroll-mt-20 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-teal-400 shrink-0" />
              <h2 className="text-lg sm:text-2xl font-black text-white font-heading tracking-wide">
                {lang === 'en' ? 'Practical ICT Missions · 5th Grade' : 'Misiuni Practice TIC · Clasa a V-a'}
              </h2>
            </div>
            <div className="flex items-center gap-3 self-start sm:self-auto tabular-nums">
              <span className="text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                {grade5DoneCount} / {GRADE5_MISSIONS.length}{' '}
                {lang === 'en' ? 'completed' : 'finalizate'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {GRADE5_MISSIONS.map((mission) => {
              const loc = lang === 'en' ? mission.en : mission.ro;
              const isDone = isMissionDone(mission.id);
              const isActive = activeMissionId === mission.id;

              return (
                <MissionCard
                  key={mission.id}
                  missionId={mission.id}
                  emoji={mission.emoji}
                  moduleLabel={loc.moduleLabel}
                  textbookRef={loc.textbookRef}
                  title={loc.title}
                  topics={loc.topics}
                  description={loc.description}
                  duration={loc.duration}
                  pointsLabel={loc.pointsLabel}
                  diplomaLabel={loc.diplomaLabel}
                  levelsCount={mission.levelsCount}
                  defaultFooterLabel={loc.defaultFooterLabel}
                  curriculaId={mission.curriculaId}
                  accentColor={mission.accentColor}
                  isCompleted={isDone}
                  isActive={isActive}
                  activeLevel={activeMissionLevel}
                  activeScore={activeMissionScore}
                  startLabel={loc.startLabel}
                  resumeLabel={loc.resumeLabel}
                  lang={lang}
                  onStart={handleAttemptStart}
                  onOpenCurricula={openCurriculaModal}
                  extraAction={
                    mission.id === 'text2' && onOpenArcade
                      ? {
                          label: 'Arcade 4B',
                          title: lang === 'en' ? 'Play Module 4B Arcade: PageCraft' : 'Joacă Mini-Jocul Arcade 4B: PageCraft',
                          onClick: () => {
                            sounds.playClick();
                            onOpenArcade();
                          },
                        }
                      : undefined
                  }
                />
              );
            })}
          </div>
        </section>
      )}

      {selectedGrade === 'grade6' && (
        <section id="sectiune-misiuni-clasa-6" className="scroll-mt-20 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Presentation className="w-5 h-5 text-orange-400 shrink-0" />
              <h2 className="text-lg sm:text-2xl font-black text-white font-heading tracking-wide">
                {lang === 'en' ? 'Practical ICT Missions · 6th Grade' : 'Misiuni Practice TIC · Clasa a VI-a'}
              </h2>
            </div>
            <span className="text-xs font-mono text-orange-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-orange-500/30 self-start sm:self-auto tabular-nums">
              {grade6DoneCount} / {GRADE6_MISSIONS.length}{' '}
              {lang === 'en' ? 'completed · 4 Major Units' : 'finalizate · 4 Unități'}
            </span>
          </div>

          {/* 4 Major Units Curriculum Overview Matrix */}
          <div className="bg-slate-950/75 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <div className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>
                {lang === 'en'
                  ? '6th Grade Curriculum Map (Textbook p. 10–93)'
                  : 'Harta Curriculară Clasa a VI-a (Manual pag. 10–93)'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-orange-500/30">
                <div className="flex items-center gap-2 font-bold text-white mb-1">
                  <span>📽️</span>
                  <span>{lang === 'en' ? 'Unit 1: Presentations' : 'Unitatea 1: Prezentări'}</span>
                </div>
                <div className="text-[11px] text-slate-300 leading-snug">
                  {lang === 'en'
                    ? 'PowerPoint, slide design, contrast, public speaking (p. 10–25)'
                    : 'PowerPoint, design slide-uri, contrast, public speaking (pag. 10–25)'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30">
                <div className="flex items-center gap-2 font-bold text-white mb-1">
                  <span>🧊</span>
                  <span>{lang === 'en' ? 'Unit 2: 3D & Animation' : 'Unitatea 2: Animații & 3D'}</span>
                </div>
                <div className="text-[11px] text-slate-300 leading-snug">
                  {lang === 'en'
                    ? 'Paint 3D, Z-axis modeling, Toontastic & VR Worlds (p. 26–43)'
                    : 'Paint 3D, corpuri cu volum, stickere, Toontastic & VR (pag. 26–43)'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-rose-500/30">
                <div className="flex items-center gap-2 font-bold text-white mb-1">
                  <span>🛡️</span>
                  <span>{lang === 'en' ? 'Unit 3: Security & Email' : 'Unitatea 3: Malware & E-mail'}</span>
                </div>
                <div className="text-[11px] text-slate-300 leading-snug">
                  {lang === 'en'
                    ? 'Malware, firewall, email etiquette & cloud permissions (p. 44–61)'
                    : 'Malware, firewall, e-mail, netichetă & cloud (pag. 44–61)'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/30">
                <div className="flex items-center gap-2 font-bold text-white mb-1">
                  <span>🔄</span>
                  <span>{lang === 'en' ? 'Unit 4: Loops & Scratch' : 'Unitatea 4: Algoritmi & Scratch'}</span>
                </div>
                <div className="text-[11px] text-slate-300 leading-snug">
                  {lang === 'en'
                    ? 'Conditional loops, For counters, Minecraft & fractals (p. 62–93)'
                    : 'Bucle condiționate, contor For, Minecraft & fractali (pag. 62–93)'}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {GRADE6_MISSIONS.map((mission) => {
              const loc = lang === 'en' ? mission.en : mission.ro;
              const isDone = isMissionDone(mission.id);
              const isActive = activeMissionId === mission.id;

              return (
                <MissionCard
                  key={mission.id}
                  missionId={mission.id}
                  emoji={mission.emoji}
                  moduleLabel={loc.moduleLabel}
                  textbookRef={loc.textbookRef}
                  title={loc.title}
                  topics={loc.topics}
                  description={loc.description}
                  duration={loc.duration}
                  pointsLabel={loc.pointsLabel}
                  diplomaLabel={loc.diplomaLabel}
                  levelsCount={mission.levelsCount}
                  defaultFooterLabel={loc.defaultFooterLabel}
                  curriculaId={mission.curriculaId}
                  accentColor={mission.accentColor}
                  isCompleted={isDone}
                  isActive={isActive}
                  activeLevel={activeMissionLevel}
                  activeScore={activeMissionScore}
                  startLabel={loc.startLabel}
                  resumeLabel={loc.resumeLabel}
                  lang={lang}
                  onStart={handleAttemptStart}
                  onOpenCurricula={openCurriculaModal}
                />
              );
            })}
          </div>
        </section>
      )}

      {selectedGrade === 'grade7' && (
        <div className="flex flex-col gap-8">
          <Grade7CatalogSection
            onOpenCurriculaModal={openCurriculaModal}
            onLaunchInteractiveLab={(mId) => {
              if (
                mId === 'g7_word_a' ||
                mId === 'g7_word_b' ||
                mId === 'g7_audio_a' ||
                mId === 'g7_video_b' ||
                mId === 'g7_cloud_a' ||
                mId === 'g7_gis_b' ||
                mId === 'g7_cpp_a' ||
                mId === 'g7_cpp_b' ||
                mId === 'g7_decision_a' ||
                mId === 'g7_loop_b' ||
                mId === 'g7_stem_a' ||
                mId === 'g7_robot_b'
              ) {
                handleAttemptStart(mId);
              } else {
                openCurriculaModal(mId);
              }
            }}
            completedMissions={
              activeAccount?.lessonsProgress
                ? Object.keys(activeAccount.lessonsProgress).reduce((acc, k) => {
                    const lState = (activeAccount.lessonsProgress as Record<string, { completed?: boolean }>)[k];
                    if (lState?.completed) acc[k] = true;
                    return acc;
                  }, {} as Record<string, boolean>)
                : {}
            }
          />

          <div id="simulatoare-interactive-clasa-7" className="scroll-mt-20">
            <Grade7InteractiveSimulators />
          </div>
        </div>
      )}

      {selectedGrade === 'grade8' && (
        <div className="flex flex-col gap-8">
          <Grade8CatalogSection
            onOpenCurriculaModal={openCurriculaModal}
            onLaunchInteractiveLab={(mId) => {
              if (
                mId === 'g8_calc_a' ||
                mId === 'g8_calc_b' ||
                mId === 'g8_calc_c' ||
                mId === 'g8_calc_d' ||
                mId === 'g8_web_a' ||
                mId === 'g8_web_b' ||
                mId === 'g8_web_c' ||
                mId === 'g8_algo_a' ||
                mId === 'g8_algo_b' ||
                mId === 'g8_algo_c' ||
                mId === 'g8_algo_d' ||
                mId === 'g8_algo_e' ||
                mId === 'g8_robot_a' ||
                mId === 'g8_robot_b'
              ) {
                handleAttemptStart(mId as AllMissionId);
              } else {
                openCurriculaModal(mId);
              }
            }}
            completedMissions={
              activeAccount?.lessonsProgress
                ? Object.keys(activeAccount.lessonsProgress).reduce((acc, k) => {
                    const lState = (activeAccount.lessonsProgress as Record<string, { completed?: boolean }>)[k];
                    if (lState?.completed) acc[k] = true;
                    return acc;
                  }, {} as Record<string, boolean>)
                : {}
            }
          />

          <div id="simulatoare-interactive-clasa-8" className="scroll-mt-20">
            <Grade8InteractiveSimulators />
          </div>
        </div>
      )}

      {/* 5. INTERACTIVE LABS HUB: ARCADE (28), DUEL 1v1, CYBER CITY & CODE SANDBOX */}
      <section aria-label={lang === 'en' ? 'Interactive Labs & Competitions' : 'Laboratoare Practice & Jocuri'} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Card 1: Arcade Lab (28 Mini-Games) */}
          <div className="rounded-2xl bg-slate-950/80 border border-indigo-500/35 p-5 flex flex-col justify-between gap-4 shadow-lg">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                    {lang === 'en' ? 'Digital Skills Arcade · 28 Games' : 'Laborator Arcade · 28 Mini-Jocuri'}
                  </div>
                  <h3 className="text-base font-black text-white font-heading">
                    {lang === 'en' ? 'PageCraft, Roblox & Minecraft Redstone' : 'PageCraft, Roblox & Minecraft Redstone'}
                  </h3>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'en'
                  ? 'Master document layout in PageCraft, compete in Roblox Blox Clicker, build Minecraft Redstone circuits & Voxel PCs, sprint in Cyber Dino, and sort files in Tetris drop!'
                  : 'Machetează ziare în PageCraft, concurează în Roblox Blox Clicker, construiește calculatoare Voxel 3D, circuite Redstone în stil Minecraft și aleargă în Cyber Dino!'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenArcade?.();
              }}
              className="w-full px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] min-h-[42px]"
            >
              <Gamepad2 className="w-4 h-4 shrink-0" />
              <span>{lang === 'en' ? 'Open Arcade (28 Games)' : 'Deschide Jocuri Arcade'}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>

          {/* Card 2: Duel Arena 1v1 */}
          <div className="rounded-2xl bg-slate-950/80 border border-rose-500/35 p-5 flex flex-col justify-between gap-4 shadow-lg">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 shrink-0">
                  <Swords className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-400">
                    {lang === 'en' ? 'Multiplayer 1v1 · Cloud Realtime' : 'Duel 1v1 în Direct · Cloud Realtime'}
                  </div>
                  <h3 className="text-base font-black text-white font-heading">
                    {lang === 'en' ? 'ArkyEdu Duel Arena 1v1' : 'Arena Duelurilor între Colegi'}
                  </h3>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'en'
                  ? 'Create a game room with a 4-letter code or join your classmate’s challenge! Block Coding Scratch Duel, Cyber Sprint typing race, and Quiz Blitz live competition.'
                  : 'Creează o cameră cu cod de 4 litere sau intră în provocarea colegului tău! Cursa Algoritmilor Scratch, Cyber Sprint tastare rapidă și bătălia creierelor Quiz Blitz.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenDuel?.();
              }}
              className="w-full px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] min-h-[42px]"
            >
              <Swords className="w-4 h-4 shrink-0" />
              <span>{lang === 'en' ? 'Enter Duel Arena 1v1' : 'Intră în Arena Duel 1v1'}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>

          {/* Card 3: Cyber City Builder */}
          <div className="rounded-2xl bg-slate-950/80 border border-cyan-500/35 p-5 flex flex-col justify-between gap-4 shadow-lg">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                    {lang === 'en' ? 'Metropolis Simulator · ByteCoins' : 'Simulator Urban TIC · ByteCoins'}
                  </div>
                  <h3 className="text-base font-black text-white font-heading">
                    {lang === 'en' ? 'ArkyEdu Cyber City Builder' : 'ArkyEdu Cyber City — Orașul Meu'}
                  </h3>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'en'
                  ? 'Use ByteCoins earned in lessons to construct Cloud Data Centers, AI Labs, 5G Towers & Fusion Reactors. Boost your computing power and become a Galactic Architect!'
                  : 'Folosește ByteCoins câștigate în lecții pentru a construi Centre de Date Cloud, AI Labs, Turnuri 5G și Reactoare de Fuziune Curată. Crește puterea de calcul a orașului!'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenCity?.();
              }}
              className="w-full px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] min-h-[42px]"
            >
              <Building2 className="w-4 h-4 shrink-0" />
              <span>{lang === 'en' ? 'Open Cyber City' : 'Deschide Orașul Meu'}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>

        {/* Live Browser Code Sandbox Lab Section (C++, Python 3, HTML5) */}
        <div
          aria-labelledby="catalog-sandbox-heading"
          className="bg-slate-950/75 border border-emerald-500/35 rounded-2xl p-5 sm:p-6 space-y-4 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
            <div className="space-y-1">
              <h2 id="catalog-sandbox-heading" className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2 font-heading">
                <Terminal className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
                <span>
                  {lang === 'en'
                    ? 'Live Browser Code Sandbox (C++, Python 3 & HTML5)'
                    : 'Sandbox Cod Live în Browser (C++, Python 3 & HTML5)'}
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                {lang === 'en'
                  ? 'Write, run, and verify curriculum coding challenges directly in your browser with automated test cases and ByteCoins rewards.'
                  : 'Scrie, rulează și verifică instantaneu cod C++ (Code::Blocks), Python 3 și HTML5/CSS cu teste automate și recompense ByteCoins.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenSandbox?.('cpp', undefined, 'trace');
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors min-h-[40px] cursor-pointer whitespace-nowrap"
              >
                <span>{lang === 'en' ? 'C++ Visual Debugger' : 'Debug Vizual C++ (Trace RAM)'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenSandbox?.('cpp', undefined, 'olympiad');
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors min-h-[40px] cursor-pointer whitespace-nowrap"
              >
                <Trophy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{lang === 'en' ? 'ICT Olympiad (12)' : 'Arena Olimpiada TIC (12)'}</span>
              </button>
              <a
                href={lang === 'en' ? '/sandbox/en/' : '/sandbox/'}
                onClick={(e) => {
                  if (onOpenSandbox) {
                    e.preventDefault();
                    sounds.playClick();
                    onOpenSandbox('cpp', undefined, 'editor');
                  }
                }}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shrink-0 shadow-sm min-h-[40px] whitespace-nowrap"
              >
                <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{lang === 'en' ? 'Open Code Sandbox' : 'Deschide Sandbox Cod'}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                langKey: 'cpp' as const,
                tabKey: 'trace' as const,
                titleRo: 'Debug Vizual C++ (Trace RAM)',
                titleEn: 'C++ Step-by-Step Trace & RAM',
                descRo: 'Execuție pas-cu-pas cu Breakpoints, valori în RAM, bare animate pe vectori (Bubble Sort, Căutare Binară) și Tabel de Urmărire.',
                descEn: 'Step-by-step execution with Breakpoints, live RAM inspector, animated array bars & clickable Trace Table.',
                ctaRo: 'Deschide Trace C++',
                ctaEn: 'Launch C++ Trace',
              },
              {
                langKey: 'cpp' as const,
                tabKey: 'olympiad' as const,
                titleRo: 'Arena Olimpiada TIC (12 Probleme)',
                titleEn: 'ICT Olympiad Arena (12 Problems)',
                descRo: '4 niveluri (Inițiere → Național), Evaluator pe 5 teste, Problema Zilei (+50 BC), Quiz-uri OJI și ranguri până la Maestru AlgoriX.',
                descEn: '4 progressive tiers, 5-test automated judge, Daily Spotlight (+50 BC), OJI dry-run quizzes & competitive ranks.',
                ctaRo: 'Intră în Arena OJI',
                ctaEn: 'Enter Olympiad Arena',
              },
              {
                langKey: 'python' as const,
                tabKey: 'editor' as const,
                titleRo: 'Python 3 Educațional',
                titleEn: 'Python 3 Curriculum Lab',
                descRo: 'Liste, f-strings, bucle for/range și medie școlară cu input() și verificare automată pe 3 cazuri de test.',
                descEn: 'Lists, f-strings, for/range loops, and GPA calculator with input() and 3 automated test cases.',
                ctaRo: 'Rulează Python',
                ctaEn: 'Run Python',
              },
              {
                langKey: 'html' as const,
                tabKey: 'editor' as const,
                titleRo: 'HTML5 Semantic & CSS Live',
                titleEn: 'Semantic HTML5 & CSS Preview',
                descRo: 'Construiește carduri responsive cu Flexbox și verifică automat structura DOM (<main>, <h1>, stiluri CSS).',
                descEn: 'Build responsive Flexbox cards and verify semantic DOM structure (<main>, <h1>, CSS styling) live.',
                ctaRo: 'Deschide Preview HTML5',
                ctaEn: 'Open HTML5 Preview',
              },
            ].map((item) => (
              <button
                key={`${item.langKey}-${item.tabKey}`}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenSandbox?.(item.langKey, undefined, item.tabKey);
                }}
                className="group text-left rounded-xl p-4 bg-slate-900/75 hover:bg-slate-900 border border-slate-800 hover:border-emerald-400/50 transition-colors flex flex-col justify-between gap-2.5 cursor-pointer min-h-[120px]"
              >
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-200 transition-colors">
                    {lang === 'en' ? item.titleEn : item.titleRo}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lang === 'en' ? item.descEn : item.descRo}
                  </p>
                </div>
                <span className="text-[11px] font-bold text-emerald-300 inline-flex items-center gap-1">
                  <span>{lang === 'en' ? item.ctaEn : item.ctaRo}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE KNOWLEDGE PILLS */}
      <KnowledgePills />

      {/* 6A. VICE LEONIDA OPEN-WORLD (GTA 6 TECH UNIVERSE) */}
      <section
        aria-labelledby="catalog-leonida-heading"
        className="bg-gradient-to-br from-slate-950 via-fuchsia-950/25 to-slate-950 border border-fuchsia-500/35 rounded-2xl p-5 sm:p-6 shadow-lg"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="text-[11px] font-mono text-fuchsia-300 font-semibold">
              {lang === 'en'
                ? 'GTA 6 Universe · State of Leonida · Open-World + Arcade + 1v1'
                : 'Univers GTA 6 · Statul Leonida · Open-World 2D + Arcade + Duel 1v1'}
            </div>
            <h2 id="catalog-leonida-heading" className="text-base sm:text-xl font-black text-white flex items-center gap-2 font-heading">
              <Compass className="w-5 h-5 text-fuchsia-400 shrink-0" aria-hidden="true" />
              <span>
                {lang === 'en'
                  ? 'Vice Leonida: Open-World Story & GTA 6 Computer Science Hub'
                  : 'Vice Leonida: Open-World Story & Universul Tehnologic GTA 6'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lang === 'en'
                ? 'Roam 6 interactive Leonida regions with Lucia Caminos & Jason Duval, pilot 5 vehicles + Grassrivers Airboat, outrun 5-star VCPD chases, and master binary, C++, Excel, and cybersecurity challenges.'
                : 'Explorează liber toate cele 6 regiuni din Leonida cu Lucia Caminos & Jason Duval, condu 5 vehicule + Hydro-Airboat, scapă de urmăririle VCPD 5★ și rezolvă misiuni reale de Binar, C++, Excel și Arduino.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenLeonida?.(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-rose-500 hover:from-fuchsia-500 hover:to-rose-400 text-white text-xs font-black inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 min-h-[40px]"
            >
              <span>{lang === 'en' ? 'Play Open-World 2D' : 'Joacă Open-World 2D'}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <a
              href={lang === 'en' ? '/leonida/en/' : '/leonida/'}
              onClick={(e) => {
                if (onOpenLeonida) {
                  e.preventDefault();
                  sounds.playClick();
                  onOpenLeonida(false);
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-fuchsia-500/40 text-fuchsia-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 min-h-[40px]"
            >
              <span>{lang === 'en' ? 'Explore Leonida Atlas' : 'Vezi Atlasul Leonida'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 6A-2. AI LITERACY & DEEPFAKE FORENSICS LAB */}
      <section
        aria-labelledby="catalog-ailab-heading"
        className="bg-gradient-to-br from-slate-950 via-cyan-950/25 to-slate-950 border border-cyan-500/35 rounded-2xl p-5 sm:p-6 shadow-lg"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="text-[11px] font-mono text-cyan-300 font-semibold">
              {lang === 'en'
                ? 'AI Literacy · BPE Tokenizer · Softmax Temperature · Deepfake Forensics · C.R.I.F. Prompts'
                : 'Literație AI · Tokenizator BPE · Temperatură Softmax · Detector Deepfake · Prompting C.R.I.F.'}
            </div>
            <h2 id="catalog-ailab-heading" className="text-base sm:text-xl font-black text-white flex items-center gap-2 font-heading">
              <BrainCircuit className="w-5 h-5 text-cyan-400 shrink-0" aria-hidden="true" />
              <span>
                {lang === 'en'
                  ? 'AI Literacy & Deepfake Forensics Lab (Interactive Classroom Simulator)'
                  : 'Laboratorul AI & Detector Deepfake (Simulator Sigur în Browser)'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lang === 'en'
                ? 'See how LLMs tokenize Romanian & English code, dial Softmax Temperature to trigger or stop hallucinations, inspect 6 photo/voice/video deepfake cases (+ByteCoins), and assemble ethical C.R.I.F. study prompts.'
                : 'Descoperă cum împart modelele LLM textul în tokeni, reglează Temperatura Softmax pentru a observa halucinațiile, investighează 6 cazuri Deepfake foto/audio/video (+ByteCoins) și construiește prompturi C.R.I.F. responsabile.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenAiLab?.();
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white text-xs font-black inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 min-h-[40px]"
            >
              <span>{lang === 'en' ? 'Open AI & Deepfake Lab' : 'Deschide Laboratorul AI'}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <a
              href={lang === 'en' ? '/laborator-ai/en/' : '/laborator-ai/'}
              onClick={(e) => {
                if (onOpenAiLab) {
                  e.preventDefault();
                  sounds.playClick();
                  onOpenAiLab();
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 min-h-[40px]"
            >
              <span>{lang === 'en' ? 'Forensics Guide & FAQ' : 'Ghid Deepfake & FAQ'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 6B. PRINTABLE & INTERACTIVE WORKSHEETS & GRADED EXAMS HUB */}
      <section
        aria-labelledby="catalog-worksheets-heading"
        className="bg-slate-950/75 border border-emerald-500/35 rounded-2xl p-5 sm:p-6 space-y-4 shadow-lg"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
          <div className="space-y-1">
            <h2 id="catalog-worksheets-heading" className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2 font-heading">
              <ClipboardCheck className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
              <span>
                {lang === 'en'
                  ? `Printable A4 Worksheets, Graded Exams (1–10) & Olympiad Bank (${WORKSHEETS_BANK.length})`
                  : `Fișe de Lucru, Teste cu Barem 1–10 & Subiecte OJI / Admitere (${WORKSHEETS_BANK.length})`}
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              {lang === 'en'
                ? 'Interactive student mode (+35 ByteCoins & auto 1–10 grading), C++ RAM Trace links, and 1-click A4 print (blank student copy or full answer key).'
                : 'Rezolvă interactiv cu notare 1–10 (+35 ByteCoins), deschide codul în Trace C++ sau tipărește A4 curat (varianta elev fără răspunsuri sau varianta profesor cu barem).'}
            </p>
          </div>
          <a
            href={lang === 'en' ? '/fise/en/' : '/fise/'}
            onClick={(e) => {
              if (onOpenWorksheets) {
                e.preventDefault();
                sounds.playClick();
                onOpenWorksheets(null);
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shrink-0 self-start sm:self-center min-h-[40px] whitespace-nowrap"
          >
            <span>{lang === 'en' ? `Open All ${WORKSHEETS_BANK.length} Sheets` : `Deschide Toate cele ${WORKSHEETS_BANK.length} Fișe`}</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            WORKSHEETS_BANK.find((w) => w.id === 'ws-g5-test-algoritmi-scratch'),
            WORKSHEETS_BANK.find((w) => w.id === 'ws-g6-test-securitate-email'),
            WORKSHEETS_BANK.find((w) => w.id === 'ws-g7-oji-while-cifre'),
            WORKSHEETS_BANK.find((w) => w.id === 'ws-g8-teza-admitere-vectori'),
          ]
            .filter((w): w is NonNullable<typeof w> => Boolean(w))
            .map((ws) => {
              const loc = lang === 'en' ? ws.en : ws.ro;
              const gradeTxt = WORKSHEET_GRADE_LABELS[ws.grade][lang === 'en' ? 'en' : 'ro'];
              const kindTxt = WORKSHEET_KIND_LABELS[ws.kind][lang === 'en' ? 'shortEn' : 'shortRo'];
              const href = lang === 'en' ? `/fise/en/${ws.en.slug}/` : `/fise/${ws.ro.slug}/`;
              return (
                <a
                  key={ws.id}
                  href={href}
                  onClick={(e) => {
                    if (onOpenWorksheets) {
                      e.preventDefault();
                      sounds.playClick();
                      onOpenWorksheets(loc.slug);
                    }
                  }}
                  className="group rounded-xl p-4 bg-slate-900/75 hover:bg-slate-900 border border-slate-800 hover:border-emerald-400/50 transition-colors flex flex-col justify-between gap-2.5"
                >
                  <div className="space-y-1">
                    <div className="text-[11px] font-mono text-emerald-300 font-semibold">
                      {gradeTxt} · {kindTxt} · {ws.maxPoints}p
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-200 transition-colors line-clamp-2">
                      {loc.breadcrumbLabel}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {loc.directAnswerSummary}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-300 inline-flex items-center gap-1">
                    <span>{lang === 'en' ? 'Solve / Print A4' : 'Rezolvă / Tipărește A4'}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </span>
                </a>
              );
            })}
        </div>
      </section>

      {/* 7. STUDY GUIDES (BLOG) & BILINGUAL GLOSSARY */}
      <section
        aria-labelledby="catalog-blog-guides-heading"
        className="bg-slate-950/75 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
          <div className="space-y-1">
            <h2 id="catalog-blog-guides-heading" className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2 font-heading">
              <BookOpen className="w-5 h-5 text-teal-400 shrink-0" aria-hidden="true" />
              <span>
                {lang === 'en'
                  ? 'ICT Study Guides & Error Fixes (Grades 5–8)'
                  : 'Ghiduri Practice & Rezolvări Erori TIC (Clasele V–VIII)'}
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              {lang === 'en'
                ? 'Step-by-step bilingual guides for C++, Excel, Scratch, Arduino IoT, Online Safety, Parents & Teachers.'
                : 'Articole bilingve cu exemple gata de aplicat: C++, Excel, Scratch 3.0, Word, Arduino Smart Home, Părinți & Profesori.'}
            </p>
          </div>
          <a
            href={lang === 'en' ? '/blog/en/' : '/blog/'}
            onClick={(e) => {
              if (onOpenBlog) {
                e.preventDefault();
                sounds.playClick();
                onOpenBlog(null);
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/40 text-teal-300 text-xs font-bold transition-colors shrink-0 self-start sm:self-center min-h-[40px]"
          >
            <span>{lang === 'en' ? 'All 12 Guides' : 'Vezi toate cele 12 ghiduri'}</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {BLOG_ARTICLES.filter((a) => a.featured)
            .slice(0, 6)
            .map((article) => {
              const c = lang === 'en' ? article.en : article.ro;
              const gradeLabel = lang === 'en' ? article.gradeTagEn : article.gradeTagRo;
              const href = lang === 'en' ? `/blog/en/${article.en.slug}/` : `/blog/${article.ro.slug}/`;
              return (
                <a
                  key={article.id}
                  href={href}
                  onClick={(e) => {
                    if (onOpenBlog) {
                      e.preventDefault();
                      sounds.playClick();
                      onOpenBlog(c.slug);
                    }
                  }}
                  className="group rounded-xl p-4 bg-slate-900/75 hover:bg-slate-900 border border-slate-800 hover:border-teal-400/50 transition-colors flex flex-col justify-between gap-2.5"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                      <span className="font-semibold text-teal-300">{c.categoryLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{gradeLabel}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-teal-200 transition-colors line-clamp-2">
                      {c.breadcrumbLabel}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{c.metaDescription}</p>
                  </div>
                  <span className="text-[11px] font-bold text-teal-300 inline-flex items-center gap-1">
                    <span>{lang === 'en' ? 'Read guide' : 'Citește ghidul'}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </span>
                </a>
              );
            })}
        </div>
      </section>

      <section
        aria-label={lang === 'en' ? 'Bilingual ICT & Coding Glossary' : 'Glosar Bilingv Informatică & TIC'}
        className="rounded-2xl border border-slate-800 bg-slate-950/75 p-5 sm:p-6 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2 font-heading">
              <Binary className="w-5 h-5 text-cyan-400 shrink-0" aria-hidden="true" />
              <span>
                {lang === 'en'
                  ? `Bilingual ICT & CS Glossary (${GLOSSARY_TERMS.length} Essential Terms, Grades 5–8)`
                  : `Glosar Bilingv Informatică & TIC (${GLOSSARY_TERMS.length} Termeni Esențiali, Clasele V–VIII)`}
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              {lang === 'en'
                ? 'Quick definitions, C++ & Excel formulas, Arduino wiring snippets, exam traps, and direct links to simulators.'
                : 'Definiții clare, sintaxă C++ și Excel, formule Arduino IoT, greșeli frecvente la test și acces direct în laboratoare.'}
            </p>
          </div>
          <a
            href={lang === 'en' ? '/glosar/en/' : '/glosar/'}
            onClick={(e) => {
              if (onOpenGlossary) {
                e.preventDefault();
                sounds.playClick();
                onOpenGlossary(null);
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-colors shrink-0 self-start sm:self-center min-h-[40px]"
          >
            <span>
              {lang === 'en'
                ? `Open Full Glossary (${GLOSSARY_TERMS.length} terms)`
                : `Deschide Glosarul Complet (${GLOSSARY_TERMS.length} termeni)`}
            </span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            'cpu-processor',
            'modulo-integer-division',
            'excel-if-countif',
            'phishing-social-engineering',
            'arduino-millis',
            'prompt-engineering-rccl',
          ]
            .map((id) => GLOSSARY_TERMS.find((item) => item.id === id))
            .filter((item): item is NonNullable<typeof item> => Boolean(item))
            .map((termItem) => {
              const loc = lang === 'en' ? termItem.en : termItem.ro;
              const gradeLabel = lang === 'en' ? termItem.gradeTagEn : termItem.gradeTagRo;
              const href = lang === 'en' ? `/glosar/en/${termItem.en.slug}/` : `/glosar/${termItem.ro.slug}/`;
              return (
                <a
                  key={termItem.id}
                  href={href}
                  onClick={(e) => {
                    if (onOpenGlossary) {
                      e.preventDefault();
                      sounds.playClick();
                      onOpenGlossary(loc.slug);
                    }
                  }}
                  className="group rounded-xl p-4 bg-slate-900/75 hover:bg-slate-900 border border-slate-800 hover:border-cyan-400/50 transition-colors flex flex-col justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="text-[11px] font-mono font-semibold text-cyan-300">{gradeLabel}</div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors line-clamp-1">
                      {loc.term}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{loc.shortAnswer}</p>
                  </div>
                  <span className="text-[11px] font-bold text-cyan-300 inline-flex items-center gap-1">
                    <span>{lang === 'en' ? 'View definition & example' : 'Vezi definiția și exemplul'}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </span>
                </a>
              );
            })}
        </div>
      </section>

      {/* 8. 100% FREE VS PRIVATE ACADEMIES COMPARISON */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950/35 to-slate-950 border border-emerald-500/35 rounded-2xl p-5 sm:p-6 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="font-bold uppercase tracking-wider text-emerald-400">
                  {lang === 'en' ? 'Free Education vs Paid Academies' : '100% Gratuit vs Școli Private'}
                </span>
                <span className="text-slate-600" aria-hidden="true">·</span>
                <span className="text-emerald-300 font-semibold">
                  {lang === 'en' ? 'Save 4,500+ RON / year' : 'Economie 4.500+ Lei / an'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white font-heading mt-0.5">
                {lang === 'en'
                  ? 'ArkyEdu vs Private Coding Schools (Logiscool, MindHub): Why Pay Thousands?'
                  : 'ArkyEdu vs Școli Private de Programare (Logiscool, MindHub): De ce să plătești mii de lei?'}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {lang === 'en'
                  ? 'Get complete curriculum-aligned ICT education for Grades 5-8 with C++, Arduino IoT, 30 Arcade Games, 1v1 Live Duels, and official diplomas — completely free, 24/7!'
                  : 'Educație digitală de înaltă performanță pentru clasele 5-8 conform programei oficiale a Ministerului Educației (OMEN 3393/2017 & OM 5420/2024), C++, Arduino IoT, 30 jocuri arcade și diplome oficiale — 100% gratuit, non-profit!'}
              </p>
            </div>
          </div>

          <a
            href="/comparatie-scoli-private/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shrink-0 active:scale-[0.98] min-h-[42px]"
            title="Vezi de ce ArkyEdu este 100% gratuit și cum se compară cu școlile private"
          >
            <span>{lang === 'en' ? 'See Full Comparison' : 'Vezi Comparația Detaliată'}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </a>
        </div>
      </div>

      {/* 9. PUBLIC CLASSROOM LEADERBOARD */}
      <div id="sectiune-clasamente" className="scroll-mt-20">
        <LeaderboardSection
          currentStudentName={studentName}
          onOpenArcade={onOpenArcade}
          onOpenLoginModal={() => {
            setAuthModalMode('login');
            setAuthModalOpen(true);
          }}
        />
      </div>

      {/* 10. TEACHER & SUPERADMIN LINKS */}
      {(onOpenTeacherPortal || onOpenSuperAdmin) && (
        <div className="pt-2 pb-1 border-t border-slate-800/60 flex flex-wrap items-center justify-center gap-3">
          {onOpenTeacherPortal && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenTeacherPortal();
              }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 text-xs font-medium transition cursor-pointer"
              title={lang === 'en' ? 'Instructor Portal (Gradebook & Scoring)' : 'Acces securizat pentru cadre didactice (catalog & notare)'}
            >
              <span className="text-slate-400 text-xs" aria-hidden="true">🔒</span>
              <span>{lang === 'en' ? 'Instructor Portal' : 'Acces cadre didactice'}</span>
            </button>
          )}

          {onOpenSuperAdmin && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenSuperAdmin();
              }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 text-xs font-semibold transition cursor-pointer"
              title="Consolă Superadmin (Control Global Școli, Profesori, Scoruri)"
            >
              <span className="text-amber-400 text-xs" aria-hidden="true">🛡️</span>
              <span>SuperAdmin Control</span>
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />

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
                : mId === 'g6anim3d' || mId === 'g6_anim3d'
                ? 'g6_anim3d'
                : mId === 'g6malware' || mId === 'g6_malware'
                ? 'g6_malware'
                : mId === 'g6email' || mId === 'g6_email'
                ? 'g6_email'
                : mId === 'g6scratch1' || mId === 'g6_scratch1'
                ? 'g6_scratch1'
                : mId;
            handleAttemptStart(mappedMission as AllMissionId);
          }}
        />
      )}
    </div>
  );
};

function activeScore(level: number, missionId?: string | null): number {
  if (level <= 1) return 0;
  if (missionId === 'hardware') {
    return Math.min((level - 1) * 20, 100);
  }
  if (missionId === 'internet1' || missionId === 'internet2') {
    const internetScores = [0, 15, 30, 45, 60, 80, 100];
    return internetScores[Math.min(level - 1, 6)] || 0;
  }
  if (
    missionId === 'text1' ||
    missionId === 'text2' ||
    missionId === 'algo1' ||
    missionId === 'algo2' ||
    missionId === 'scratch1' ||
    missionId === 'scratch2' ||
    missionId === 'g6_presentation1' ||
    missionId === 'g6_presentation2' ||
    missionId === 'g6_paint3d' ||
    missionId === 'g6_anim3d' ||
    missionId === 'g6_malware' ||
    missionId === 'g6_email' ||
    missionId === 'g6_scratch1' ||
    missionId === 'g6_scratch2' ||
    missionId === 'g7_word_a' ||
    missionId === 'g7_word_b' ||
    missionId === 'g7_audio_a' ||
    missionId === 'g7_video_b' ||
    missionId === 'g7_cloud_a' ||
    missionId === 'g7_gis_b' ||
    missionId === 'g7_cpp_a' ||
    missionId === 'g7_cpp_b' ||
    missionId === 'g7_decision_a'
  ) {
    const standardScores = [0, 15, 30, 45, 60, 75, 90, 100];
    return standardScores[Math.min(level - 1, 7)] || 0;
  }
  const filesScores = [0, 10, 25, 40, 55, 70, 85, 100];
  return filesScores[Math.min(level - 1, 7)] || 0;
}
