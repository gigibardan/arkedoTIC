import React from 'react';
import { Volume2, VolumeX, Star, School, Clock, ArrowLeft, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { sounds } from '../utils/audio';

interface HeaderProps {
  score: number;
  maxScore: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentView: 'catalog' | 'lesson' | 'teacher';
  onNavigateToCatalog: () => void;
  studentName: string;
  elapsedSeconds: number;
  missionId?: 'hardware' | 'files' | null;
  onEditStudentName?: () => void;
  onNavigateToTeacher?: () => void;
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
  onEditStudentName,
  onNavigateToTeacher,
}) => {
  const { lang, setLang, t } = useLanguage();

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
    return t.appTitle;
  };

  return (
    <header className="bg-slate-900/90 backdrop-blur border-b border-slate-700/80 sticky top-0 z-40 px-3 sm:px-4 py-2.5 sm:py-3 shadow-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side: Back button or Logo + Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
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
              <span className="inline sm:hidden text-[11px]">{lang === 'ro' ? 'Cursuri' : 'Courses'}</span>
            </button>
          ) : (
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-teal-600 via-emerald-500 to-cyan-400 flex items-center justify-center text-lg sm:text-2xl shadow-lg shadow-teal-500/20 ring-2 ring-emerald-400/30 shrink-0">
              💻
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[9px] sm:text-[11px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider shrink-0">
                <School className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {t.schoolName}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-semibold hidden md:inline truncate">
                {t.subjectGrade}
              </span>
            </div>
            <h1 className="text-xs sm:text-base md:text-lg font-black text-white tracking-wide font-heading truncate leading-tight mt-0.5">
              {currentView === 'lesson'
                ? getLessonTitle()
                : currentView === 'teacher'
                ? t.teacherPortalNav
                : t.catalogTitle}
            </h1>
          </div>
        </div>

        {/* Right Side: Student Name, Timer, Score, Language & Audio */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Student Greeting Chip (if name is set) */}
          {studentName && (
            <div
              onClick={onEditStudentName}
              className="hidden lg:flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs font-semibold text-slate-200 shadow-inner cursor-pointer transition"
              title={t.changeName}
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">{t.helloStudent},</span>
              <span className="font-bold text-emerald-300 max-w-[100px] truncate">
                {studentName}
              </span>
            </div>
          )}

          {/* Test Timer (in lesson view) */}
          {currentView === 'lesson' && (
            <div
              className="hidden xs:flex bg-slate-950/90 px-2 sm:px-2.5 py-1.5 rounded-xl border border-cyan-500/30 items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-mono text-cyan-300 shadow-inner"
              title={t.timerLabel}
            >
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 animate-spin-slow" />
              <span className="font-bold">{formatTime(elapsedSeconds)}</span>
            </div>
          )}

          {/* Language Switcher: Explicitly "RO" and "EN" */}
          <div className="flex items-center bg-slate-950/95 p-0.5 sm:p-1 rounded-xl border border-slate-700/80 shadow-inner">
            <button
              onClick={() => handleLanguageChange('ro')}
              className={`px-1.5 sm:px-2 py-1 rounded-lg text-[10px] sm:text-xs font-extrabold font-mono transition cursor-pointer ${
                lang === 'ro'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Română"
            >
              RO
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-1.5 sm:px-2 py-1 rounded-lg text-[10px] sm:text-xs font-extrabold font-mono transition cursor-pointer ${
                lang === 'en'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* Score Pill (in lesson view) */}
          {currentView === 'lesson' && (
            <div className="bg-slate-950/90 px-2 sm:px-2.5 py-1.5 rounded-xl border border-slate-700/80 flex items-center gap-1 sm:gap-1.5 shadow-inner">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 drop-shadow" />
              <div className="flex items-baseline gap-0.5 sm:gap-1">
                <span className="font-black text-amber-300 text-xs sm:text-base font-heading">
                  {score}
                </span>
                <span className="text-slate-500 text-[10px] hidden sm:inline">/{maxScore}</span>
              </div>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-1.5 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition border border-slate-700/80 shadow-sm cursor-pointer"
            title={soundEnabled ? t.soundOn : t.soundOff}
            aria-label={t.soundLabel}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};


