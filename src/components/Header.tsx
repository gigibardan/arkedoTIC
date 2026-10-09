import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Star,
  School,
  Clock,
  ArrowLeft,
  User,
  Gamepad2,
  Swords,
  ShoppingBag,
  Building2,
  BookOpen,
  Menu,
  X,
  ChevronRight,
  Globe
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { sounds } from '../utils/audio';
import { PWAInstallButton } from './pwa/PWAInstallButton';

interface HeaderProps {
  score: number;
  maxScore: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentView: 'catalog' | 'lesson' | 'teacher' | 'arcade' | 'duel' | 'city' | 'superadmin';
  onNavigateToCatalog: () => void;
  studentName: string;
  elapsedSeconds: number;
  missionId?: 'hardware' | 'files' | 'internet1' | 'internet2' | 'text1' | 'text2' | null;
  byteCoins?: number;
  onEditStudentName?: () => void;
  onNavigateToTeacher?: () => void;
  onNavigateToSuperAdmin?: () => void;
  onNavigateToArcade?: () => void;
  onNavigateToDuel?: () => void;
  onNavigateToCity?: () => void;
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
  onNavigateToTeacher,
  onNavigateToArcade,
  onNavigateToDuel,
  onNavigateToCity,
  onOpenShop,
}) => {
  const { lang, setLang, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    return t.appTitle;
  };

  const getHeaderTitle = () => {
    if (currentView === 'lesson') return getLessonTitle();
    if (currentView === 'teacher') return t.teacherPortalNav;
    if (currentView === 'arcade') return lang === 'en' ? 'Arcade Lab' : 'Laborator Arcade';
    if (currentView === 'duel') return lang === 'en' ? 'Duel Arena 1v1' : 'Arena Duel 1v1';
    if (currentView === 'city') return lang === 'en' ? 'Cyber City' : 'Orașul Cyber';
    return lang === 'en' ? 'ICT' : 'TIC';
  };

  const currentAvatar = (() => {
    try {
      return localStorage.getItem('arkedo_student_avatar') || '🎓';
    } catch {
      return '🎓';
    }
  })();

  return (
    <>
      {/* Top Navbar */}
      <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Left Side: Brand Logo or Back Button */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 md:flex-initial">
            {currentView !== 'catalog' ? (
              <button
                onClick={() => {
                  sounds.playClick();
                  onNavigateToCatalog();
                }}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95 shrink-0"
                title={t.backToCourses}
              >
                <ArrowLeft className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">{t.backToCourses}</span>
                <span className="inline sm:hidden text-[11px] font-bold">{lang === 'ro' ? 'Cursuri' : 'Courses'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-emerald-500 to-cyan-400 flex items-center justify-center text-base sm:text-xl shadow-md shadow-teal-500/20 ring-2 ring-emerald-400/30 shrink-0">
                  💻
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider shrink-0">
                      {t.schoolName}
                    </span>
                  </div>
                  <h1 className="text-xs sm:text-sm md:text-base font-black text-white font-heading truncate leading-tight">
                    {getHeaderTitle()}
                  </h1>
                </div>
              </div>
            )}

            {currentView !== 'catalog' && (
              <div className="min-w-0">
                <h1 className="text-xs sm:text-sm md:text-base font-black text-white font-heading truncate leading-tight">
                  {getHeaderTitle()}
                </h1>
              </div>
            )}
          </div>

          {/* Center Navigation Links (Desktop Only >= md) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-800/90 shadow-inner">
            <button
              onClick={() => {
                sounds.playClick();
                onNavigateToCatalog();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'catalog' || currentView === 'lesson'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Courses' : 'Cursuri'}</span>
            </button>

            {onNavigateToArcade && (
              <button
                onClick={() => {
                  sounds.playClick();
                  currentView === 'arcade' ? onNavigateToCatalog() : onNavigateToArcade();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  currentView === 'arcade'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Arcade' : 'Arcade'}</span>
              </button>
            )}

            {onNavigateToDuel && (
              <button
                onClick={() => {
                  sounds.playClick();
                  currentView === 'duel' ? onNavigateToCatalog() : onNavigateToDuel();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  currentView === 'duel'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Swords className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Duel 1v1' : 'Duel 1v1'}</span>
              </button>
            )}

            {onNavigateToCity && (
              <button
                onClick={() => {
                  sounds.playClick();
                  currentView === 'city' ? onNavigateToCatalog() : onNavigateToCity();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  currentView === 'city'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Cyber City' : 'Orașul Meu'}</span>
              </button>
            )}

            {onNavigateToTeacher && (
              <button
                onClick={() => {
                  sounds.playClick();
                  currentView === 'teacher' ? onNavigateToCatalog() : onNavigateToTeacher();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  currentView === 'teacher'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-amber-300/80 hover:text-amber-200 hover:bg-amber-500/10'
                }`}
              >
                <School className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Teacher' : 'Profesor'}</span>
              </button>
            )}
          </nav>

          {/* Right Controls: Stats / Language / Audio / Mobile Menu Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Lesson Stats (Timer & Score) */}
            {currentView === 'lesson' && (
              <div className="flex items-center gap-1.5 bg-slate-950/90 px-2 sm:px-2.5 py-1 rounded-xl border border-slate-700/80 shadow-inner">
                <div className="flex items-center gap-1 text-[11px] sm:text-xs font-mono text-cyan-300 font-bold">
                  <Clock className="w-3 h-3 text-cyan-400 animate-spin-slow" />
                  <span>{formatTime(elapsedSeconds)}</span>
                </div>
                <span className="text-slate-600 text-[10px]">|</span>
                <div className="flex items-center gap-1 text-xs font-black font-heading text-amber-300">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{score}</span>
                  <span className="text-slate-500 text-[10px] hidden sm:inline">/{maxScore}</span>
                </div>
              </div>
            )}

            {/* Student Greeting Chip (Desktop >= lg) */}
            {studentName && (
              <div
                onClick={onEditStudentName}
                className="hidden lg:flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-750 px-2.5 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer transition"
                title={t.changeName}
              >
                <span className="text-sm">{currentAvatar}</span>
                <span className="font-bold text-emerald-300 max-w-[85px] truncate">
                  {studentName}
                </span>
              </div>
            )}

            {/* PWA Install Button (Desktop & Tablet) */}
            <div className="hidden sm:flex items-center">
              <PWAInstallButton variant="compact" />
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-950/95 p-0.5 rounded-xl border border-slate-700/80 shadow-inner">
              <button
                onClick={() => handleLanguageChange('ro')}
                className={`px-1.5 sm:px-2 py-1 rounded-lg text-[10px] sm:text-xs font-extrabold font-mono transition cursor-pointer ${
                  lang === 'ro' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Română"
              >
                RO
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-1.5 sm:px-2 py-1 rounded-lg text-[10px] sm:text-xs font-extrabold font-mono transition cursor-pointer ${
                  lang === 'en' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Audio Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition border border-slate-700/80 shadow-sm cursor-pointer"
              title={soundEnabled ? t.soundOn : t.soundOff}
              aria-label={t.soundLabel}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
              )}
            </button>

            {/* Mobile Drawer Toggle Button (Mobile < md) */}
            <button
              onClick={() => {
                sounds.playClick();
                setIsMobileMenuOpen((prev) => !prev);
              }}
              className={`md:hidden p-1.5 rounded-xl border transition cursor-pointer ${
                isMobileMenuOpen
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              aria-label="Meniu Opțiuni"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Down Quick Menu Sheet (Mobile < md) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[49px] z-30 bg-slate-900/98 backdrop-blur-xl border-b border-slate-800 shadow-2xl p-4 animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-3 max-w-md mx-auto">
            {/* Student Profile Quick Card */}
            <div
              onClick={() => {
                if (onEditStudentName) onEditStudentName();
                setIsMobileMenuOpen(false);
              }}
              className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-emerald-500/40 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xl shrink-0">
                  {currentAvatar}
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400 font-semibold">{t.helloStudent}</div>
                  <div className="text-sm font-black text-white truncate">
                    {studentName || (lang === 'en' ? 'Guest Student' : 'Elev Invitat')}
                  </div>
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 shrink-0">
                {lang === 'en' ? 'Edit' : 'Schimbă'} <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Quick Navigation Items Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {onNavigateToTeacher && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsMobileMenuOpen(false);
                    onNavigateToTeacher();
                  }}
                  className={`p-3 rounded-xl border font-bold text-xs flex items-center gap-2.5 transition text-left cursor-pointer ${
                    currentView === 'teacher'
                      ? 'bg-amber-600 text-white border-amber-400'
                      : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300'
                  }`}
                >
                  <School className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold truncate">{lang === 'en' ? 'Teacher Portal' : 'Portal Profesor'}</div>
                    <div className="text-[10px] text-amber-300/70 truncate">{lang === 'en' ? 'Gradebook & Codes' : 'Catalog & Setări'}</div>
                  </div>
                </button>
              )}

              {onOpenShop && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsMobileMenuOpen(false);
                    onOpenShop();
                  }}
                  className="p-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold text-xs flex items-center gap-2.5 transition text-left cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-purple-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold truncate">{lang === 'en' ? 'Cyber Shop' : 'Magazin Cyber'}</div>
                    <div className="text-[10px] text-purple-300/70 truncate">{typeof byteCoins === 'number' ? `${byteCoins} 🪙 Coins` : 'Inventar'}</div>
                  </div>
                </button>
              )}
            </div>

            {/* PWA Install in Mobile Drawer */}
            <div className="pt-2">
              <PWAInstallButton variant="full" className="w-full justify-center" />
            </div>

            {/* Sound & Language in Mobile Drawer */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <button
                onClick={() => {
                  onToggleSound();
                  sounds.playClick();
                }}
                className="flex items-center gap-2 hover:text-white transition cursor-pointer py-1"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
                <span>{soundEnabled ? (lang === 'en' ? 'Sound: On' : 'Sunet: Activat') : (lang === 'en' ? 'Sound: Off' : 'Sunet: Oprit')}</span>
              </button>

              <div className="flex items-center gap-2 font-mono">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <button
                  onClick={() => handleLanguageChange('ro')}
                  className={`font-bold transition cursor-pointer ${lang === 'ro' ? 'text-emerald-400 underline' : 'text-slate-400'}`}
                >
                  Română
                </button>
                <span>/</span>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`font-bold transition cursor-pointer ${lang === 'en' ? 'text-emerald-400 underline' : 'text-slate-400'}`}
                >
                  English
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Dock (Fixed at bottom for mobile screens) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/90 shadow-[0_-8px_25px_rgba(0,0,0,0.6)] px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
          {/* Tab 1: Cursuri / Misiuni */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsMobileMenuOpen(false);
              onNavigateToCatalog();
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
              currentView === 'catalog' || currentView === 'lesson'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shadow-inner'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className={`w-5 h-5 ${currentView === 'catalog' || currentView === 'lesson' ? 'text-emerald-400 scale-105' : ''}`} />
            <span className="text-[10px] mt-0.5 tracking-tight font-semibold">{lang === 'en' ? 'Courses' : 'Cursuri'}</span>
          </button>

          {/* Tab 2: Arcade */}
          {onNavigateToArcade && (
            <button
              onClick={() => {
                sounds.playClick();
                setIsMobileMenuOpen(false);
                currentView === 'arcade' ? onNavigateToCatalog() : onNavigateToArcade();
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
                currentView === 'arcade'
                  ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Gamepad2 className={`w-5 h-5 ${currentView === 'arcade' ? 'text-indigo-400 scale-105' : ''}`} />
              <span className="text-[10px] mt-0.5 tracking-tight font-semibold">{lang === 'en' ? 'Arcade' : 'Arcade'}</span>
            </button>
          )}

          {/* Tab 3: Duel 1v1 */}
          {onNavigateToDuel && (
            <button
              onClick={() => {
                sounds.playClick();
                setIsMobileMenuOpen(false);
                currentView === 'duel' ? onNavigateToCatalog() : onNavigateToDuel();
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer active:scale-95 relative ${
                currentView === 'duel'
                  ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Swords className={`w-5 h-5 ${currentView === 'duel' ? 'text-rose-400 scale-105' : ''}`} />
              <span className="text-[10px] mt-0.5 tracking-tight font-semibold">{lang === 'en' ? 'Duel 1v1' : 'Duel 1v1'}</span>
              <span className="absolute top-1.5 right-3 w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            </button>
          )}

          {/* Tab 4: Cyber City */}
          {onNavigateToCity && (
            <button
              onClick={() => {
                sounds.playClick();
                setIsMobileMenuOpen(false);
                currentView === 'city' ? onNavigateToCatalog() : onNavigateToCity();
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
                currentView === 'city'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className={`w-5 h-5 ${currentView === 'city' ? 'text-cyan-400 scale-105' : ''}`} />
              <span className="text-[10px] mt-0.5 tracking-tight font-semibold">{lang === 'en' ? 'City' : 'Orașul'}</span>
            </button>
          )}

          {/* Tab 5: Profesor */}
          {onNavigateToTeacher && (
            <button
              onClick={() => {
                sounds.playClick();
                setIsMobileMenuOpen(false);
                currentView === 'teacher' ? onNavigateToCatalog() : onNavigateToTeacher();
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
                currentView === 'teacher'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <School className={`w-5 h-5 ${currentView === 'teacher' ? 'text-amber-400 scale-105' : ''}`} />
              <span className="text-[10px] mt-0.5 tracking-tight font-semibold">{lang === 'en' ? 'Teacher' : 'Profesor'}</span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
};
