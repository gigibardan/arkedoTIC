import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Star,
  School,
  Clock,
  ArrowLeft,
  Gamepad2,
  Swords,
  ShoppingBag,
  Building2,
  BookOpen,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Globe,
  FileText,
  Code2,
  Award,
  ClipboardCheck,
  Radio,
  Compass,
  BrainCircuit,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { sounds } from '../utils/audio';
import { PWAInstallButton } from './pwa/PWAInstallButton';

interface HeaderProps {
  score: number;
  maxScore: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentView: 'catalog' | 'lesson' | 'teacher' | 'arcade' | 'duel' | 'city' | 'superadmin' | 'blog' | 'glossary' | 'sandbox' | 'carnet' | 'evaluare' | 'livequiz' | 'fise' | 'leonida' | 'ailab';
  onNavigateToCatalog: () => void;
  studentName: string;
  elapsedSeconds: number;
  missionId?: string | null;
  byteCoins?: number;
  onEditStudentName?: () => void;
  onNavigateToCarnet?: () => void;
  onNavigateToEvaluare?: () => void;
  onNavigateToLiveQuiz?: () => void;
  onNavigateToTeacher?: () => void;
  onNavigateToSuperAdmin?: () => void;
  onNavigateToArcade?: () => void;
  onNavigateToDuel?: () => void;
  onNavigateToCity?: () => void;
  onNavigateToBlog?: () => void;
  onNavigateToGlossary?: () => void;
  onNavigateToSandbox?: () => void;
  onNavigateToWorksheets?: () => void;
  onNavigateToLeonida?: () => void;
  onNavigateToAiLab?: () => void;
  onOpenShop?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  maxScore,
  soundEnabled,
  onToggleSound,
  currentView,
  onNavigateToCatalog,
  studentName,
  elapsedSeconds,
  missionId = null,
  byteCoins,
  onEditStudentName,
  onNavigateToCarnet,
  onNavigateToEvaluare,
  onNavigateToLiveQuiz,
  onNavigateToTeacher,
  onNavigateToArcade,
  onNavigateToDuel,
  onNavigateToCity,
  onNavigateToBlog,
  onNavigateToGlossary,
  onNavigateToSandbox,
  onNavigateToWorksheets,
  onNavigateToLeonida,
  onNavigateToAiLab,
  onOpenShop,
}) => {
  const { lang, setLang, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const resourcesDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resourcesDropdownRef.current && !resourcesDropdownRef.current.contains(event.target as Node)) {
        setIsResourcesOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsResourcesOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLanguageChange = (newLang: 'ro' | 'en') => {
    sounds.playClick();
    setLang(newLang);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getLessonTitle = () => {
    if (missionId === 'hardware') return t.hwCourseTitle;
    if (missionId === 'files') return t.lesson1CardTitle;
    if (missionId === 'internet1') return t.internet1CourseTitle;
    if (missionId === 'internet2') return t.internet2CourseTitle;
    if (missionId === 'text1') return t.text1CourseTitle;
    if (missionId === 'text2') return t.text2CourseTitle;
    if (missionId === 'algo1') return lang === 'en' ? 'M5A: Sequential Algorithms' : 'Misiunea 5A: Algoritmi Secvențiali';
    if (missionId === 'algo2') return lang === 'en' ? 'M5B: Decisions & Flowcharts' : 'Misiunea 5B: Decizii & Scheme Logice';
    if (missionId === 'scratch1') return lang === 'en' ? 'M6A: Scratch Motion & Variables' : 'Misiunea 6A: Scratch & Variabile';
    if (missionId === 'scratch2') return lang === 'en' ? 'M6B: Scratch Games & Exam' : 'Misiunea 6B: Jocuri Scratch & Evaluare';
    if (missionId === 'g6_presentation1') return lang === 'en' ? 'G6 M1A: PowerPoint Interface' : 'Cls. VI • M1A: PowerPoint';
    if (missionId === 'g6_presentation2') return lang === 'en' ? 'G6 M1B: Design & Speech' : 'Cls. VI • M1B: Design & Discurs';
    if (missionId === 'g6_paint3d') return lang === 'en' ? 'G6 M2A: Paint 3D Modeling' : 'Cls. VI • M2A: Modelare Paint 3D';
    if (missionId === 'g6_anim3d') return lang === 'en' ? 'G6 M2B: Toontastic & VR' : 'Cls. VI • M2B: Toontastic & VR';
    if (missionId === 'g6_malware') return lang === 'en' ? 'G6 M3A: Malware & Security' : 'Cls. VI • M3A: Malware & Securitate';
    if (missionId === 'g6_email') return lang === 'en' ? 'G6 M3B: Email & Netiquette' : 'Cls. VI • M3B: E-mail & Netichetă';
    if (missionId === 'g6_scratch1') return lang === 'en' ? 'G6 M4A: Scratch Loops' : 'Cls. VI • M4A: Bucle Scratch';
    if (missionId === 'g6_scratch2') return lang === 'en' ? 'G6 M4B: Minecraft 3D & Loops' : 'Cls. VI • M4B: Minecraft 3D & Contor';
    if (missionId === 'g7_word_a') return lang === 'en' ? 'M1A: Word Processing & Typography' : 'Misiunea 1A: Tehnoredactare & Tipografie';
    if (missionId === 'g7_word_b') return lang === 'en' ? 'M1B: Page Layout & Structured Documents' : 'Misiunea 1B: Machetare & Tipografie';
    if (missionId === 'g7_audio_a') return lang === 'en' ? 'M2A: Digital Acoustics & WavePad' : 'Misiunea 2A: Acustică & WavePad';
    if (missionId === 'g7_video_b') return lang === 'en' ? 'M2B: VideoPad & Video Editing' : 'Misiunea 2B: VideoPad & Montaj Video';
    if (missionId === 'g7_cloud_a') return lang === 'en' ? 'M3A: Cloud Collaboration & Teams' : 'Misiunea 3A: Aplicații Colaborative Cloud';
    if (missionId === 'g7_gis_b') return lang === 'en' ? 'M3B: GIS & Digital Cartography' : 'Misiunea 3B: GIS & Cartografie Digitală';
    if (missionId?.startsWith('g7_')) return lang === 'en' ? '7th Grade C++ & Robotics' : 'Clasa VII • C++ & Robotică';
    if (missionId?.startsWith('g8_')) return lang === 'en' ? '8th Grade Interactive Lab' : 'Clasa VIII • Modul Interactiv';
    return t.appTitle;
  };

  const getHeaderTitle = () => {
    if (currentView === 'lesson') return getLessonTitle();
    if (currentView === 'teacher') return t.teacherPortalNav;
    if (currentView === 'superadmin') return 'SuperAdmin';
    if (currentView === 'arcade') return lang === 'en' ? 'Arcade Lab' : 'Laborator Arcade';
    if (currentView === 'duel') return lang === 'en' ? 'Duel Arena 1v1' : 'Arena Duel 1v1';
    if (currentView === 'city') return lang === 'en' ? 'Cyber City' : 'Orașul Cyber';
    if (currentView === 'blog') return lang === 'en' ? 'ICT Blog & Guides' : 'Blog & Ghiduri TIC';
    if (currentView === 'glossary') return lang === 'en' ? 'ICT & CS Glossary' : 'Glosar Informatică & TIC';
    if (currentView === 'sandbox') return lang === 'en' ? 'Code Sandbox Lab' : 'Sandbox Cod Live';
    if (currentView === 'carnet') return lang === 'en' ? 'My Digital Portfolio' : 'Carnetul meu Digital';
    if (currentView === 'evaluare') return lang === 'en' ? 'Quick Eval Simulator' : 'Simulare Evaluare TIC';
    if (currentView === 'livequiz') return lang === 'en' ? 'Live Class Quiz (PIN)' : 'Quiz Live în Clasă';
    if (currentView === 'fise') return lang === 'en' ? 'Worksheets & Rubrics' : 'Fișe & Teste cu Barem';
    if (currentView === 'leonida') return lang === 'en' ? 'Vice Leonida · GTA 6 Hub' : 'Vice Leonida · Open-World GTA 6';
    if (currentView === 'ailab') return lang === 'en' ? 'AI & Deepfake Lab' : 'Laborator AI & Deepfake';
    return 'ArkyEdu';
  };

  const currentAvatar = (() => {
    try {
      return localStorage.getItem('arkedo_student_avatar') || '🎓';
    } catch {
      return '🎓';
    }
  })();

  const isResourceViewActive =
    currentView === 'carnet' ||
    currentView === 'evaluare' ||
    currentView === 'livequiz' ||
    currentView === 'sandbox' ||
    currentView === 'fise' ||
    currentView === 'leonida' ||
    currentView === 'ailab' ||
    currentView === 'blog' ||
    currentView === 'glossary' ||
    currentView === 'teacher';

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsResourcesOpen(false);
  };

  return (
    <>
      {/* Sticky Single-Row Header */}
      <header className="print:hidden bg-slate-950/92 backdrop-blur-xl border-b border-slate-800/90 sticky top-0 z-40 px-3 sm:px-5 lg:px-6 h-14 sm:h-16 flex items-center shadow-lg">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Left Zone: Single-line Brand Wordmark or Back + Active View Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {currentView !== 'catalog' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    closeMenus();
                    onNavigateToCatalog();
                  }}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0 whitespace-nowrap min-h-[36px]"
                  title={t.backToCourses}
                >
                  <ArrowLeft className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="hidden sm:inline">{t.backToCourses}</span>
                  <span className="inline sm:hidden text-xs font-bold">{lang === 'en' ? 'Courses' : 'Cursuri'}</span>
                </button>
                <span className="text-xs sm:text-sm md:text-base font-extrabold text-white font-heading truncate max-w-[150px] xs:max-w-[200px] sm:max-w-[240px] lg:max-w-[260px]">
                  {getHeaderTitle()}
                </span>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2.5 text-left group cursor-pointer shrink-0 whitespace-nowrap"
                aria-label="ArkyEdu Home"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 via-emerald-500 to-cyan-400 flex items-center justify-center text-lg shadow-md shadow-teal-500/20 ring-1 ring-emerald-300/40 shrink-0 group-hover:scale-105 transition-transform">
                  💻
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-base sm:text-lg font-black text-white font-heading tracking-tight">
                    Arky<span className="text-emerald-400">Edu</span>
                  </span>
                  <span className="hidden xl:inline text-[11px] font-mono text-slate-400 font-semibold">
                    {lang === 'en' ? 'ICT Grades 5–8' : 'TIC · V–VIII'}
                  </span>
                </div>
              </button>
            )}
          </div>

          {/* Center Zone: Clean 5-Item Desktop/Tablet Nav (no capsule crowd, zero wrap) */}
          <nav
            aria-label={lang === 'en' ? 'Main Navigation' : 'Navigație principală'}
            className="hidden md:flex items-center gap-1 lg:gap-1.5"
          >
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                closeMenus();
                onNavigateToCatalog();
              }}
              className={`px-2.5 lg:px-3 py-1.5 rounded-xl text-xs lg:text-[13px] font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                currentView === 'catalog' || currentView === 'lesson'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'en' ? 'Courses' : 'Cursuri'}</span>
            </button>

            {onNavigateToArcade && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  closeMenus();
                  currentView === 'arcade' ? onNavigateToCatalog() : onNavigateToArcade();
                }}
                className={`px-2.5 lg:px-3 py-1.5 rounded-xl text-xs lg:text-[13px] font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                  currentView === 'arcade'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5 shrink-0" />
                <span>Arcade</span>
              </button>
            )}

            {onNavigateToDuel && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  closeMenus();
                  currentView === 'duel' ? onNavigateToCatalog() : onNavigateToDuel();
                }}
                className={`px-2.5 lg:px-3 py-1.5 rounded-xl text-xs lg:text-[13px] font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                  currentView === 'duel'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent'
                }`}
              >
                <Swords className="w-3.5 h-3.5 shrink-0" />
                <span>Duel 1v1</span>
              </button>
            )}

            {onNavigateToCity && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  closeMenus();
                  currentView === 'city' ? onNavigateToCatalog() : onNavigateToCity();
                }}
                className={`px-2.5 lg:px-3 py-1.5 rounded-xl text-xs lg:text-[13px] font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                  currentView === 'city'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden lg:inline">{lang === 'en' ? 'Cyber City' : 'Orașul Meu'}</span>
                <span className="lg:hidden">{lang === 'en' ? 'City' : 'Oraș'}</span>
              </button>
            )}

            {/* Resources & Tools Dropdown (Carnet, Evaluare, Fise, Leonida, AI Lab, Sandbox, Blog, Glossary, Shop, Teacher) */}
            {(onNavigateToCarnet || onNavigateToEvaluare || onNavigateToWorksheets || onNavigateToLeonida || onNavigateToAiLab || onNavigateToSandbox || onNavigateToBlog || onNavigateToGlossary || onNavigateToTeacher || onOpenShop) && (
              <div className="relative" ref={resourcesDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setIsResourcesOpen((prev) => !prev);
                  }}
                  aria-expanded={isResourcesOpen}
                  aria-haspopup="menu"
                  className={`px-2.5 lg:px-3 py-1.5 rounded-xl text-xs lg:text-[13px] font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                    isResourceViewActive || isResourcesOpen
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{lang === 'en' ? 'Resources' : 'Resurse'}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-150 ${
                      isResourcesOpen ? 'rotate-180 text-teal-300' : 'text-slate-400'
                    }`}
                  />
                </button>

                {isResourcesOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900/98 backdrop-blur-xl border border-slate-700/90 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    {onNavigateToCarnet && (
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          sounds.playClick();
                          setIsResourcesOpen(false);
                          onNavigateToCarnet();
                        }}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition cursor-pointer text-left ${
                          currentView === 'carnet'
                            ? 'bg-amber-500/15 text-amber-200 border border-amber-500/30'
                            : 'hover:bg-slate-800/80 text-slate-200 border border-transparent'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                          <Award className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white">
                            {lang === 'en' ? 'My Digital Portfolio' : 'Carnetul meu Digital'}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {lang === 'en' ? 'Grades, Diplomas & Streak' : 'Note 1–10, Diplome & Trofee'}
                          </div>
                        </div>
                      </button>
                    )}

                    {onNavigateToEvaluare && (
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          sounds.playClick();
                          setIsResourcesOpen(false);
                          onNavigateToEvaluare();
                        }}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition cursor-pointer text-left ${
                          currentView === 'evaluare'
                            ? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/30'
                            : 'hover:bg-slate-800/80 text-slate-200 border border-transparent'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                          <ClipboardCheck className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white">
                            {lang === 'en' ? 'Quick Eval Simulator' : 'Simulare Evaluare (Test)'}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {lang === 'en' ? 'Timed Quizzes · Grades 5–8' : 'Test Cronometrat · Nota 1–10'}
                          </div>
                        </div>
                      </button>
                    )}

                    {onNavigateToLiveQuiz && (
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          sounds.playClick();
                          setIsResourcesOpen(false);
                          onNavigateToLiveQuiz();
                        }}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition cursor-pointer text-left ${
                          currentView === 'livequiz'
                            ? 'bg-rose-500/15 text-rose-200 border border-rose-500/30'
                            : 'hover:bg-slate-800/80 text-slate-200 border border-transparent'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                          <Radio className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white">
                            {lang === 'en' ? 'Live Class Quiz (PIN)' : 'Quiz Live în Clasă (PIN)'}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {lang === 'en' ? 'Join teacher session live' : 'Intră cu codul PIN de pe tablă'}
                          </div>
                        </div>
                      </button>
                    )}

                    {onNavigateToSandbox && (
                      <a
                        href={lang === 'en' ? '/sandbox/en/' : '/sandbox/'}
                        role="menuitem"
                        onClick={(e) => {
                          e.preventDefault();
                          sounds.playClick();
                          setIsResourcesOpen(false);
                          onNavigateToSandbox();
                        }}
                        className={`flex items-center gap-3 p-2.5 rounded-xl transition cursor-pointer ${
                          currentView === 'sandbox'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'hover:bg-slate-800/80 text-slate-200 border border-transparent'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                          <Code2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white">
                            {lang === 'en' ? 'Code Sandbox Lab' : 'Sandbox Cod Live'}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            C++ · Python 3 · HTML5
                          </div>
                        </div>
                      </a>
                    )}

                    {onNavigateToBlog && (
                      <a
                        href={lang === 'en' ? '/blog/en/' : '/blog/'}
                        role="menuitem"
                        onClick={(e) => {
                          e.preventDefault();
                          sounds.playClick();
                          setIsResourcesOpen(false);
                          onNavigateToBlog();
                        }}
                        className={`flex items-center gap-3 p-2.5 rounded-xl transition cursor-pointer ${
                          currentView === 'blog'
                            ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                            : 'hover:bg-slate-800/80 text-slate-200 border border-transparent'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white">
                            {lang === 'en' ? 'ICT Blog & Guides' : 'Blog & Ghiduri TIC'}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {lang === 'en' ? '12 step-by-step guides' : '12 ghiduri practice V–VIII'}
                          </div>
                        </div>
                      </a>
                    )}

                    {onNavigateToGlossary && (
                      <a
                        href={lang === 'en' ? '/glosar/en/' : '/glosar/'}
                        role="menuitem"
                        onClick={(e) => {
                          e.preventDefault();
                          sounds.playClick();
                          setIsResourcesOpen(false);
                          onNavigateToGlossary();
                        }}
                        className={`flex items-center gap-3 p-2.5 rounded-xl transition cursor-pointer ${
                          currentView === 'glossary'
                            ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                            : 'hover:bg-slate-800/80 text-slate-200 border border-transparent'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white">
                            {lang === 'en' ? 'ICT & CS Glossary' : 'Glosar Informatică & TIC'}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {lang === 'en' ? '44 Essential Terms A–Z' : '44 Termeni Esențiali A–Z'}
                          </div>
                        </div>
                      </a>
                    )}

                    {onNavigateToWorksheets && (
                      <a
                        href={lang === 'en' ? '/fise/en/' : '/fise/'}
                        role="menuitem"
                        onClick={(e) => {
                          e.preventDefault();
                          sounds.playClick();
                          setIsResourcesOpen(false);
                          onNavigateToWorksheets();
                        }}
                        className={`flex items-center gap-3 p-2.5 rounded-xl transition cursor-pointer ${
                          currentView === 'fise'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'hover:bg-slate-800/80 text-slate-200 border border-transparent'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                          <ClipboardCheck className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white">
                            {lang === 'en' ? 'Worksheets & Rubrics (16)' : 'Fișe & Teste cu Barem (16)'}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {lang === 'en' ? 'A4 Printable · OJI & 1–10 Keys' : 'A4 Imprimabile · Barem 1–10'}
                          </div>
                        </div>
                      </a>
                    )}

                    {onNavigateToLeonida && (
                      <a
                        href={lang === 'en' ? '/leonida/en/' : '/leonida/'}
                        role="menuitem"
                        onClick={(e) => {
                          e.preventDefault();
                          sounds.playClick();
                          setIsResourcesOpen(false);
                          onNavigateToLeonida();
                        }}
                        className={`flex items-center gap-3 p-2.5 rounded-xl transition cursor-pointer ${
                          currentView === 'leonida'
                            ? 'bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30'
                            : 'hover:bg-slate-800/80 text-slate-200 border border-transparent'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-fuchsia-500/15 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 shrink-0">
                          <Compass className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white">
                            {lang === 'en' ? 'Vice Leonida (GTA 6 Open-World)' : 'Vice Leonida (Open-World GTA 6)'}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {lang === 'en' ? '6 Districts · 5 Rides · 3 Modes' : '6 Regiuni · 5 Vehicule · 3 Moduri'}
                          </div>
                        </div>
                      </a>
                    )}

                    {onNavigateToAiLab && (
                      <a
                        href={lang === 'en' ? '/laborator-ai/en/' : '/laborator-ai/'}
                        role="menuitem"
                        onClick={(e) => {
                          e.preventDefault();
                          sounds.playClick();
                          setIsResourcesOpen(false);
                          onNavigateToAiLab();
                        }}
                        className={`flex items-center gap-3 p-2.5 rounded-xl transition cursor-pointer ${
                          currentView === 'ailab'
                            ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                            : 'hover:bg-slate-800/80 text-slate-200 border border-transparent'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                          <BrainCircuit className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white">
                            {lang === 'en' ? 'AI & Deepfake Lab' : 'Laborator AI & Deepfake'}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {lang === 'en' ? 'Tokens · Forensics · Prompts' : 'Tokeni · Detectiv · Prompturi'}
                          </div>
                        </div>
                      </a>
                    )}

                    {onOpenShop && (
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          sounds.playClick();
                          setIsResourcesOpen(false);
                          onOpenShop();
                        }}
                        className="w-full flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-slate-800/80 text-slate-200 transition cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                            <ShoppingBag className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white">
                              {lang === 'en' ? 'Cyber Shop' : 'Magazin Cyber'}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {typeof byteCoins === 'number' ? `${byteCoins} ByteCoins` : (lang === 'en' ? 'Avatars & Upgrades' : 'Avataruri & Bonusuri')}
                            </div>
                          </div>
                        </div>
                      </button>
                    )}

                    {onNavigateToTeacher && (
                      <div className="mt-1.5 pt-1.5 border-t border-slate-800">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            sounds.playClick();
                            setIsResourcesOpen(false);
                            currentView === 'teacher' ? onNavigateToCatalog() : onNavigateToTeacher();
                          }}
                          className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition cursor-pointer text-left ${
                            currentView === 'teacher'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : 'hover:bg-amber-500/10 text-amber-200 border border-transparent'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                            <School className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-amber-200">
                              {lang === 'en' ? 'Teacher Portal' : 'Portal Profesor'}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {lang === 'en' ? 'Gradebook & Class Codes' : 'Catalog Elevi & Coduri'}
                            </div>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Right Controls: Lesson Stats / Student Chip / Install / Language / Audio / Mobile Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Lesson Stats (Timer & Score) */}
            {currentView === 'lesson' && (
              <div className="flex items-center gap-1.5 bg-slate-900 px-2 sm:px-2.5 py-1 rounded-xl border border-slate-700/80 shadow-inner tabular-nums">
                <div className="flex items-center gap-1 text-[11px] sm:text-xs font-mono text-cyan-300 font-bold">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>{formatTime(elapsedSeconds)}</span>
                </div>
                <span className="text-slate-600 text-[10px]" aria-hidden="true">|</span>
                <div className="flex items-center gap-1 text-xs font-black font-heading text-amber-300">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{score}</span>
                  <span className="text-slate-400 text-[10px] hidden sm:inline">/{maxScore}</span>
                </div>
              </div>
            )}

            {/* Student Greeting Chip (Desktop >= lg, opens Carnet if available) */}
            {studentName && currentView !== 'lesson' && (
              <button
                type="button"
                onClick={onNavigateToCarnet || onEditStudentName}
                className="hidden lg:flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-700/80 text-xs font-semibold text-slate-200 cursor-pointer transition shrink-0"
                title={
                  onNavigateToCarnet
                    ? lang === 'en'
                      ? 'Open My Digital Portfolio'
                      : 'Deschide Carnetul meu Digital'
                    : t.changeName
                }
              >
                <span className="text-sm">{currentAvatar}</span>
                <span className="font-bold text-emerald-300 max-w-[90px] truncate">
                  {studentName}
                </span>
              </button>
            )}

            {/* PWA Install Button (Large Desktop >= xl so md/lg tablets never crowd) */}
            <div className="hidden xl:flex items-center shrink-0">
              <PWAInstallButton variant="compact" />
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-900 p-0.5 rounded-xl border border-slate-700/80 shadow-inner shrink-0">
              <button
                type="button"
                onClick={() => handleLanguageChange('ro')}
                className={`px-2 py-1 rounded-lg text-[11px] sm:text-xs font-black font-mono transition cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center touch-manipulation active:scale-95 ${
                  lang === 'ro' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
                title="Română"
                aria-label="Comută limba în Română"
              >
                RO
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`px-2 py-1 rounded-lg text-[11px] sm:text-xs font-black font-mono transition cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center touch-manipulation active:scale-95 ${
                  lang === 'en' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
                title="English"
                aria-label="Switch language to English"
              >
                EN
              </button>
            </div>

            {/* Audio Sound Toggle */}
            <button
              type="button"
              onClick={onToggleSound}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white transition border border-slate-700/80 cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center touch-manipulation active:scale-95 shrink-0"
              title={soundEnabled ? t.soundOn : t.soundOff}
              aria-label={t.soundLabel}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Mobile Drawer Toggle Button (Mobile < md) */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsMobileMenuOpen((prev) => !prev);
              }}
              className={`md:hidden p-2 rounded-xl border transition cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center touch-manipulation active:scale-95 shrink-0 ${
                isMobileMenuOpen
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-2 ring-emerald-500/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
              }`}
              aria-expanded={isMobileMenuOpen}
              aria-label={lang === 'en' ? 'Open Menu' : 'Meniu Opțiuni'}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 z-20 bg-slate-950/75 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-Down Quick Menu Sheet (Mobile < md) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-14 z-30 bg-slate-900/98 backdrop-blur-2xl border-b border-slate-800 shadow-2xl p-4 max-h-[calc(100dvh-116px)] overflow-y-auto animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-3 max-w-md mx-auto">
            {/* Student Profile Quick Card */}
            <button
              type="button"
              onClick={() => {
                if (onEditStudentName) onEditStudentName();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-emerald-500/40 transition touch-manipulation active:scale-[0.98]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xl shrink-0">
                  {currentAvatar}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] text-slate-400 font-semibold">{t.helloStudent}</div>
                  <div className="text-sm font-black text-white truncate">
                    {studentName || (lang === 'en' ? 'Guest Student' : 'Elev Invitat')}
                  </div>
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 shrink-0">
                {lang === 'en' ? 'Profile' : 'Profil'} <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </button>

            {/* Quick Navigation Items Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {onNavigateToCarnet && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setIsMobileMenuOpen(false);
                    onNavigateToCarnet();
                  }}
                  className={`p-3 rounded-xl border font-bold text-xs flex items-center gap-2.5 transition text-left cursor-pointer col-span-2 min-h-[48px] ${
                    currentView === 'carnet'
                      ? 'bg-amber-600 text-white border-amber-400'
                      : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-200'
                  }`}
                >
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold truncate">
                      {lang === 'en' ? 'My Digital Portfolio' : 'Carnetul meu Digital'}
                    </div>
                    <div className="text-[10px] text-amber-200/90 truncate">
                      {lang === 'en' ? 'Grades, Diplomas & Badges' : 'Note 1–10, Diplome PDF & Insigne'}
                    </div>
                  </div>
                </button>
              )}

              {onNavigateToEvaluare && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setIsMobileMenuOpen(false);
                    onNavigateToEvaluare();
                  }}
                  className={`p-3 rounded-xl border font-bold text-xs flex items-center gap-2.5 transition text-left cursor-pointer col-span-2 min-h-[48px] ${
                    currentView === 'evaluare'
                      ? 'bg-cyan-600 text-white border-cyan-400'
                      : 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-200'
                  }`}
                >
                  <ClipboardCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold truncate">
                      {lang === 'en' ? 'Quick Eval Simulator' : 'Test Rapid & Simulare Evaluare'}
                    </div>
                    <div className="text-[10px] text-cyan-200/90 truncate">
                      {lang === 'en' ? 'Timed Quizzes V–VIII · Auto Grade 1–10' : 'Antrenament Cronometrat · Nota 1–10'}
                    </div>
                  </div>
                </button>
              )}

              {onNavigateToLiveQuiz && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setIsMobileMenuOpen(false);
                    onNavigateToLiveQuiz();
                  }}
                  className={`p-3 rounded-xl border font-bold text-xs flex items-center gap-2.5 transition text-left cursor-pointer col-span-2 min-h-[48px] ${
                    currentView === 'livequiz'
                      ? 'bg-rose-600 text-white border-rose-400'
                      : 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-200'
                  }`}
                >
                  <Radio className="w-4 h-4 text-rose-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold truncate">
                      {lang === 'en' ? 'Live Class Quiz (PIN)' : 'Quiz Live în Clasă (PIN)'}
                    </div>
                    <div className="text-[10px] text-rose-200/90 truncate">
                      {lang === 'en' ? 'Join classroom arena live' : 'Intră cu codul PIN afișat pe tablă'}
                    </div>
                  </div>
                </button>
              )}

              {onNavigateToSandbox && (
                <a
                  href={lang === 'en' ? '/sandbox/en/' : '/sandbox/'}
                  onClick={(e) => {
                    e.preventDefault();
                    sounds.playClick();
                    setIsMobileMenuOpen(false);
                    onNavigateToSandbox();
                  }}
                  className={`p-3 rounded-xl border font-bold text-xs flex items-center gap-2.5 transition text-left cursor-pointer col-span-2 min-h-[48px] ${
                    currentView === 'sandbox'
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                  }`}
                >
                  <Code2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold truncate">{lang === 'en' ? 'Code Sandbox Lab' : 'Sandbox Cod Live'}</div>
                    <div className="text-[10px] text-emerald-200 truncate">C++ · Python 3 · HTML5</div>
                  </div>
                </a>
              )}

              {onNavigateToBlog && (
                <a
                  href={lang === 'en' ? '/blog/en/' : '/blog/'}
                  onClick={(e) => {
                    e.preventDefault();
                    sounds.playClick();
                    setIsMobileMenuOpen(false);
                    onNavigateToBlog();
                  }}
                  className={`p-3 rounded-xl border font-bold text-xs flex items-center gap-2.5 transition text-left cursor-pointer min-h-[48px] ${
                    currentView === 'blog'
                      ? 'bg-teal-600 text-white border-teal-400'
                      : 'bg-teal-500/10 hover:bg-teal-500/20 border-teal-500/30 text-teal-300'
                  }`}
                >
                  <FileText className="w-4 h-4 text-teal-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold truncate">{lang === 'en' ? 'ICT Blog' : 'Blog TIC'}</div>
                    <div className="text-[10px] text-teal-200 truncate">{lang === 'en' ? '12 Guides' : '12 Ghiduri'}</div>
                  </div>
                </a>
              )}

              {onNavigateToGlossary && (
                <a
                  href={lang === 'en' ? '/glosar/en/' : '/glosar/'}
                  onClick={(e) => {
                    e.preventDefault();
                    sounds.playClick();
                    setIsMobileMenuOpen(false);
                    onNavigateToGlossary();
                  }}
                  className={`p-3 rounded-xl border font-bold text-xs flex items-center gap-2.5 transition text-left cursor-pointer min-h-[48px] ${
                    currentView === 'glossary'
                      ? 'bg-cyan-600 text-white border-cyan-400'
                      : 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-300'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold truncate">{lang === 'en' ? 'ICT Glossary' : 'Glosar TIC'}</div>
                    <div className="text-[10px] text-cyan-200 truncate">{lang === 'en' ? '44 Terms A–Z' : '44 Termeni A–Z'}</div>
                  </div>
                </a>
              )}

              {onNavigateToWorksheets && (
                <a
                  href={lang === 'en' ? '/fise/en/' : '/fise/'}
                  onClick={(e) => {
                    e.preventDefault();
                    sounds.playClick();
                    setIsMobileMenuOpen(false);
                    onNavigateToWorksheets();
                  }}
                  className={`p-3 rounded-xl border font-bold text-xs flex items-center gap-2.5 transition text-left cursor-pointer col-span-2 min-h-[48px] ${
                    currentView === 'fise'
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                  }`}
                >
                  <ClipboardCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold truncate">{lang === 'en' ? 'Worksheets & Rubrics (16)' : 'Fișe de Lucru & Teste cu Barem (16)'}</div>
                    <div className="text-[10px] text-emerald-200 truncate">{lang === 'en' ? 'A4 Print + Interactive Grading 1–10' : 'Imprimabile A4 · Barem Oficial 1–10'}</div>
                  </div>
                </a>
              )}

              {onNavigateToLeonida && (
                <a
                  href={lang === 'en' ? '/leonida/en/' : '/leonida/'}
                  onClick={(e) => {
                    e.preventDefault();
                    sounds.playClick();
                    setIsMobileMenuOpen(false);
                    onNavigateToLeonida();
                  }}
                  className={`p-3 rounded-xl border font-bold text-xs flex items-center gap-2.5 transition text-left cursor-pointer col-span-2 min-h-[48px] ${
                    currentView === 'leonida'
                      ? 'bg-fuchsia-600 text-white border-fuchsia-400'
                      : 'bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border-fuchsia-500/30 text-fuchsia-200'
                  }`}
                >
                  <Compass className="w-4 h-4 text-fuchsia-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold truncate">{lang === 'en' ? 'Vice Leonida (GTA 6 Open-World)' : 'Vice Leonida (Open-World GTA 6)'}</div>
                    <div className="text-[10px] text-fuchsia-200 truncate">{lang === 'en' ? '6 Districts · Lucia & Jason · 3 Modes' : '6 Regiuni · Lucia & Jason · 3 Moduri'}</div>
                  </div>
                </a>
              )}

              {onNavigateToAiLab && (
                <a
                  href={lang === 'en' ? '/laborator-ai/en/' : '/laborator-ai/'}
                  onClick={(e) => {
                    e.preventDefault();
                    sounds.playClick();
                    setIsMobileMenuOpen(false);
                    onNavigateToAiLab();
                  }}
                  className={`p-3 rounded-xl border font-bold text-xs flex items-center gap-2.5 transition text-left cursor-pointer col-span-2 min-h-[48px] ${
                    currentView === 'ailab'
                      ? 'bg-teal-600 text-white border-teal-400'
                      : 'bg-teal-500/10 hover:bg-teal-500/20 border-teal-500/30 text-teal-200'
                  }`}
                >
                  <BrainCircuit className="w-4 h-4 text-teal-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold truncate">{lang === 'en' ? 'AI & Deepfake Forensics Lab' : 'Laboratorul AI & Detector Deepfake'}</div>
                    <div className="text-[10px] text-teal-200 truncate">{lang === 'en' ? 'Tokens · Voice/Photo Deepfakes · Prompting' : 'Tokeni LLM · Deepfake Foto/Voce · Prompturi'}</div>
                  </div>
                </a>
              )}

              {onNavigateToTeacher && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setIsMobileMenuOpen(false);
                    onNavigateToTeacher();
                  }}
                  className={`p-3 rounded-xl border font-bold text-xs flex items-center gap-2.5 transition text-left cursor-pointer min-h-[48px] ${
                    currentView === 'teacher'
                      ? 'bg-amber-600 text-white border-amber-400'
                      : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300'
                  } ${!onOpenShop ? 'col-span-2' : ''}`}
                >
                  <School className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold truncate">{lang === 'en' ? 'Teacher Portal' : 'Portal Profesor'}</div>
                    <div className="text-[10px] text-amber-200 truncate">{lang === 'en' ? 'Gradebook & Codes' : 'Catalog & Setări'}</div>
                  </div>
                </button>
              )}

              {onOpenShop && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setIsMobileMenuOpen(false);
                    onOpenShop();
                  }}
                  className="p-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold text-xs flex items-center gap-2.5 transition text-left cursor-pointer min-h-[48px]"
                >
                  <ShoppingBag className="w-4 h-4 text-purple-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold truncate">{lang === 'en' ? 'Cyber Shop' : 'Magazin Cyber'}</div>
                    <div className="text-[10px] text-purple-200 truncate tabular-nums">
                      {typeof byteCoins === 'number' ? `${byteCoins} Coins` : 'Inventar'}
                    </div>
                  </div>
                </button>
              )}
            </div>

            {/* PWA Install in Mobile Drawer */}
            <div className="pt-1">
              <PWAInstallButton variant="full" className="w-full justify-center" />
            </div>

            {/* Sound & Language in Mobile Drawer */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
              <button
                type="button"
                onClick={() => {
                  onToggleSound();
                  sounds.playClick();
                }}
                className="flex items-center gap-2 hover:text-white transition cursor-pointer py-1.5"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
                <span>{soundEnabled ? (lang === 'en' ? 'Sound: On' : 'Sunet: Activat') : (lang === 'en' ? 'Sound: Off' : 'Sunet: Oprit')}</span>
              </button>

              <div className="flex items-center gap-2 font-mono">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <button
                  type="button"
                  onClick={() => handleLanguageChange('ro')}
                  className={`font-bold transition cursor-pointer px-1 ${lang === 'ro' ? 'text-emerald-400 underline' : 'text-slate-400'}`}
                >
                  Română
                </button>
                <span className="text-slate-600">/</span>
                <button
                  type="button"
                  onClick={() => handleLanguageChange('en')}
                  className={`font-bold transition cursor-pointer px-1 ${lang === 'en' ? 'text-emerald-400 underline' : 'text-slate-400'}`}
                >
                  English
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Dock (Phones < md) */}
      <nav
        aria-label={lang === 'en' ? 'Mobile Bottom Navigation' : 'Navigație rapidă mobil'}
        className="print:hidden md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/90 shadow-[0_-8px_25px_rgba(0,0,0,0.7)] px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      >
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setIsMobileMenuOpen(false);
              onNavigateToCatalog();
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer touch-manipulation active:scale-95 min-h-[46px] ${
              currentView === 'catalog' || currentView === 'lesson'
                ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <BookOpen className={`w-4 h-4 ${currentView === 'catalog' || currentView === 'lesson' ? 'text-emerald-400' : ''}`} />
            <span className="text-[10px] mt-1 tracking-tight font-bold whitespace-nowrap">{lang === 'en' ? 'Courses' : 'Cursuri'}</span>
          </button>

          {onNavigateToArcade && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsMobileMenuOpen(false);
                currentView === 'arcade' ? onNavigateToCatalog() : onNavigateToArcade();
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer touch-manipulation active:scale-95 min-h-[46px] ${
                currentView === 'arcade'
                  ? 'bg-indigo-500/15 text-indigo-300 font-bold border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Gamepad2 className={`w-4 h-4 ${currentView === 'arcade' ? 'text-indigo-400' : ''}`} />
              <span className="text-[10px] mt-1 tracking-tight font-bold whitespace-nowrap">Arcade</span>
            </button>
          )}

          {onNavigateToDuel && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsMobileMenuOpen(false);
                currentView === 'duel' ? onNavigateToCatalog() : onNavigateToDuel();
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer touch-manipulation active:scale-95 min-h-[46px] relative ${
                currentView === 'duel'
                  ? 'bg-rose-500/15 text-rose-300 font-bold border border-rose-500/40'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Swords className={`w-4 h-4 ${currentView === 'duel' ? 'text-rose-400' : ''}`} />
              <span className="text-[10px] mt-1 tracking-tight font-bold whitespace-nowrap">Duel 1v1</span>
            </button>
          )}

          {onNavigateToCity && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsMobileMenuOpen(false);
                currentView === 'city' ? onNavigateToCatalog() : onNavigateToCity();
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer touch-manipulation active:scale-95 min-h-[46px] ${
                currentView === 'city'
                  ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Building2 className={`w-4 h-4 ${currentView === 'city' ? 'text-cyan-400' : ''}`} />
              <span className="text-[10px] mt-1 tracking-tight font-bold whitespace-nowrap">{lang === 'en' ? 'City' : 'Orașul'}</span>
            </button>
          )}

          {onNavigateToTeacher && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsMobileMenuOpen(false);
                currentView === 'teacher' ? onNavigateToCatalog() : onNavigateToTeacher();
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer touch-manipulation active:scale-95 min-h-[46px] ${
                currentView === 'teacher'
                  ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <School className={`w-4 h-4 ${currentView === 'teacher' ? 'text-amber-400' : ''}`} />
              <span className="text-[10px] mt-1 tracking-tight font-bold whitespace-nowrap">{lang === 'en' ? 'Teacher' : 'Profesor'}</span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
};
