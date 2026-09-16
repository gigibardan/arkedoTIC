import React, { useState, useEffect } from 'react';
import { GameLevel } from './types';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { CoursesCatalog } from './components/CoursesCatalog';
import { Level1_Structure } from './components/Level1_Structure';
import { Level2_SelectionSearch } from './components/Level2_SelectionSearch';
import { Level3_MoveShortcuts } from './components/Level3_MoveShortcuts';
import { Level4_CopyRenameProps } from './components/Level4_CopyRenameProps';
import { Level5_RecycleBin } from './components/Level5_RecycleBin';
import { VictoryScreen } from './components/VictoryScreen';
import { TeacherPortal } from './components/TeacherPortal';
import { sounds } from './utils/audio';
import { Clock, Star, User } from 'lucide-react';

function GameContent() {
  const { t } = useLanguage();
  const [view, setView] = useState<'catalog' | 'lesson' | 'teacher'>(() => {
    // Check if initial URL or hash points to /profesor
    if (window.location.pathname.includes('/profesor') || window.location.hash.includes('profesor')) {
      return 'teacher';
    }
    return 'catalog';
  });
  const [currentLevel, setCurrentLevel] = useState<GameLevel>(1);
  const [score, setScore] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Student Name persistence
  const [studentName, setStudentName] = useState<string>(() => {
    try {
      return localStorage.getItem('arkedo_student_name') || '';
    } catch {
      return '';
    }
  });

  // Test Stopwatch / Cronometru
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const maxScore = 100;

  // Persist student name to localStorage
  const handleSetStudentName = (name: string) => {
    setStudentName(name);
    try {
      localStorage.setItem('arkedo_student_name', name);
    } catch {
      // Ignore
    }
  };

  // Automatically scroll to the very top whenever the level or view changes!
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentLevel, view]);

  // Timer interval effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && view === 'lesson' && currentLevel <= 5) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, view, currentLevel]);

  // Listen to browser navigation popstate or hash changes for /profesor
  useEffect(() => {
    const handleUrlChange = () => {
      if (window.location.pathname.includes('/profesor') || window.location.hash.includes('profesor')) {
        setView('teacher');
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const navigateToView = (newView: 'catalog' | 'lesson' | 'teacher') => {
    setView(newView);
    if (newView === 'teacher') {
      window.history.pushState({}, '', '/profesor');
    } else if (newView === 'catalog') {
      window.history.pushState({}, '', '/');
    }
  };

  const handleToggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    sounds.enabled = newState;
    if (newState) sounds.playClick();
  };

  const handleStartLesson1 = () => {
    setView('lesson');
    setIsTimerRunning(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLevel1Complete = () => {
    setScore(20);
    setCurrentLevel(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLevel2Complete = () => {
    setScore(40);
    setCurrentLevel(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLevel3Complete = () => {
    setScore(60);
    setCurrentLevel(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLevel4Complete = () => {
    setScore(80);
    setCurrentLevel(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLevel5Complete = () => {
    setScore(100);
    setCurrentLevel(6);
    setIsTimerRunning(false); // Stop timer on victory!
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetGame = () => {
    sounds.playClick();
    setScore(0);
    setCurrentLevel(1);
    setElapsedSeconds(0);
    setIsTimerRunning(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white relative">
      {/* Top Header */}
      <Header
        score={score}
        maxScore={maxScore}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        currentView={view}
        onNavigateToCatalog={() => navigateToView('catalog')}
        studentName={studentName}
        elapsedSeconds={elapsedSeconds}
        onEditStudentName={() => navigateToView('catalog')}
        onNavigateToTeacher={() => navigateToView('teacher')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {view === 'teacher' ? (
          <TeacherPortal onBackToHome={() => navigateToView('catalog')} />
        ) : view === 'catalog' ? (
          <CoursesCatalog
            studentName={studentName}
            onSetStudentName={handleSetStudentName}
            onStartLesson1={handleStartLesson1}
            currentLevel={currentLevel}
            score={score}
            onOpenTeacherPortal={() => navigateToView('teacher')}
          />
        ) : (
          <>
            {/* Tree Evolution Progress */}
            <ProgressBar currentLevel={currentLevel} />

            {/* Level Views */}
            <div className="flex-1">
              {currentLevel === 1 && (
                <Level1_Structure onComplete={handleLevel1Complete} />
              )}

              {currentLevel === 2 && (
                <Level2_SelectionSearch onComplete={handleLevel2Complete} />
              )}

              {currentLevel === 3 && (
                <Level3_MoveShortcuts onComplete={handleLevel3Complete} />
              )}

              {currentLevel === 4 && (
                <Level4_CopyRenameProps onComplete={handleLevel4Complete} />
              )}

              {currentLevel === 5 && (
                <Level5_RecycleBin onComplete={handleLevel5Complete} />
              )}

              {currentLevel === 6 && (
                <VictoryScreen
                  score={score}
                  maxScore={maxScore}
                  studentName={studentName}
                  elapsedSeconds={elapsedSeconds}
                  onReset={handleResetGame}
                />
              )}
            </div>
          </>
        )}
      </main>

      {/* Floating Bottom Stopwatch Bar (shown during active lesson) */}
      {view === 'lesson' && currentLevel <= 5 && (
        <div className="sticky bottom-3 z-30 flex justify-center px-4 pointer-events-none">
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl px-4 py-2.5 shadow-2xl flex items-center gap-4 text-xs font-mono pointer-events-auto ring-1 ring-emerald-500/20">
            {/* Student Name */}
            {studentName && (
              <div className="flex items-center gap-1.5 text-slate-300 border-r border-slate-700 pr-3 font-sans">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold text-emerald-300 max-w-[110px] truncate">
                  {studentName}
                </span>
              </div>
            )}

            {/* Stopwatch */}
            <div className="flex items-center gap-1.5 text-cyan-300">
              <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-slate-400 hidden sm:inline">{t.timerLabel}:</span>
              <strong className="text-sm font-black text-cyan-200">
                {formatTimer(elapsedSeconds)}
              </strong>
            </div>

            {/* Score pill */}
            <div className="flex items-center gap-1.5 text-amber-300 border-l border-slate-700 pl-3">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold">{score}/{maxScore} {t.pts}</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500 bg-slate-950/40 mt-auto">
        <p className="max-w-xl mx-auto leading-relaxed">
          {t.footerText}
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <GameContent />
    </LanguageProvider>
  );
}
