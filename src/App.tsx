import React, { useState, useEffect } from 'react';
import { GameLevel } from './types';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ArkyProvider, useArky } from './context/ArkyContext';
import { HintProvider } from './context/HintContext';
import { MascotaArky } from './components/MascotaArky';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { CoursesCatalog } from './components/CoursesCatalog';

// Files Mission (Unitatea 2 - Manual pag. 22-30)
import { FLevel1_OSInterface } from './components/files/FLevel1_OSInterface';
import { FLevel2_DataMemory } from './components/files/FLevel2_DataMemory';
import { Level1_Structure } from './components/Level1_Structure';
import { Level2_SelectionSearch } from './components/Level2_SelectionSearch';
import { Level3_MoveShortcuts } from './components/Level3_MoveShortcuts';
import { Level4_CopyRenameProps } from './components/Level4_CopyRenameProps';
import { Level5_RecycleBin } from './components/Level5_RecycleBin';

// Hardware Mission (Unitatea 1 - Manual pag. 10-20)
import { HLevel1_ErgonomyRules } from './components/hardware/HLevel1_ErgonomyRules';
import { HLevel2_HistoryTimeline } from './components/hardware/HLevel2_HistoryTimeline';
import { HLevel3_CentralUnitAssembly } from './components/hardware/HLevel3_CentralUnitAssembly';
import { HLevel4_PeripheralsSort } from './components/hardware/HLevel4_PeripheralsSort';
import { HLevel5_BitsQuiz } from './components/hardware/HLevel5_BitsQuiz';

// Internet Mission 3A (Unitatea 3 - Manual pag. 32-36)
import { Module3AFlow } from './components/internet1/Module3AFlow';

// Internet Mission 3B (Unitatea 3 - Manual pag. 38-48)
import { Module3BFlow } from './components/internet2/Module3BFlow';

import { VictoryScreen } from './components/VictoryScreen';
import { TeacherPortal } from './components/TeacherPortal';
import { ArcadeHub } from './components/minigames/ArcadeHub';
import { DuelArena } from './components/DuelArena';
import { sounds } from './utils/audio';
import { Clock, Star, User } from 'lucide-react';
import { updateActiveLessonProgress, getActiveStudent } from './lib/studentAuthService';

function GameContent() {
  const { t } = useLanguage();
  const arky = useArky();
  const [view, setView] = useState<'catalog' | 'lesson' | 'teacher' | 'arcade' | 'duel'>(() => {
    if (window.location.pathname.includes('/profesor') || window.location.hash.includes('profesor')) {
      return 'teacher';
    }
    if (window.location.pathname.includes('/arcade') || window.location.hash.includes('arcade')) {
      return 'arcade';
    }
    if (window.location.pathname.includes('/duel') || window.location.hash.includes('duel')) {
      return 'duel';
    }
    return 'catalog';
  });

  // Current selected mission
  const [activeMission, setActiveMission] = useState<'hardware' | 'files' | 'internet1' | 'internet2' | null>(() => {
    try {
      const saved = localStorage.getItem('arkedo_active_mission');
      if (saved === 'hardware' || saved === 'files' || saved === 'internet1' || saved === 'internet2') return saved;
    } catch {
      // Ignore
    }
    return null;
  });

  // Hardware mission progress
  const [hwLevel, setHwLevel] = useState<GameLevel>(() => {
    try {
      const saved = localStorage.getItem('arkedo_hw_level');
      if (saved) return Number(saved) as GameLevel;
    } catch {
      // Ignore
    }
    return 1;
  });
  const [hwScore, setHwScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_hw_score');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });
  const [hwElapsedSeconds, setHwElapsedSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_hw_elapsed');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });

  // Files mission progress
  const [filesLevel, setFilesLevel] = useState<GameLevel>(() => {
    try {
      const saved = localStorage.getItem('arkedo_files_level');
      if (saved) return Number(saved) as GameLevel;
    } catch {
      // Ignore
    }
    return 1;
  });
  const [filesScore, setFilesScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_files_score');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });
  const [filesElapsedSeconds, setFilesElapsedSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_files_elapsed');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });

  // Internet 1 (Mission 3A) progress
  const [internet1Level, setInternet1Level] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_internet1_level');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 1;
  });
  const [internet1Score, setInternet1Score] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_internet1_score');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });
  const [internet1ElapsedSeconds, setInternet1ElapsedSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_internet1_elapsed');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });

  // Internet 2 (Mission 3B) progress
  const [internet2Level, setInternet2Level] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_internet2_level');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 1;
  });
  const [internet2Score, setInternet2Score] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_internet2_score');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });
  const [internet2ElapsedSeconds, setInternet2ElapsedSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_internet2_elapsed');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => sounds.enabled);

  // Sync state if audio manager changes anywhere (e.g. from in-game sound button)
  useEffect(() => {
    const handleSoundChange = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      if (typeof customEvent.detail === 'boolean') {
        setSoundEnabled(customEvent.detail);
      }
    };
    window.addEventListener('arkedo_sound_change', handleSoundChange);
    return () => {
      window.removeEventListener('arkedo_sound_change', handleSoundChange);
    };
  }, []);
  
  // Student Name persistence
  const [studentName, setStudentName] = useState<string>(() => {
    try {
      return localStorage.getItem('arkedo_student_name') || '';
    } catch {
      return '';
    }
  });

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

  // Persist active mission & levels
  useEffect(() => {
    try {
      if (activeMission) localStorage.setItem('arkedo_active_mission', activeMission);
      localStorage.setItem('arkedo_hw_level', String(hwLevel));
      localStorage.setItem('arkedo_hw_score', String(hwScore));
      localStorage.setItem('arkedo_files_level', String(filesLevel));
      localStorage.setItem('arkedo_files_score', String(filesScore));
      localStorage.setItem('arkedo_internet1_level', String(internet1Level));
      localStorage.setItem('arkedo_internet1_score', String(internet1Score));
      localStorage.setItem('arkedo_internet2_level', String(internet2Level));
      localStorage.setItem('arkedo_internet2_score', String(internet2Score));
      localStorage.setItem('arkedo_hw_elapsed', String(hwElapsedSeconds));
      localStorage.setItem('arkedo_files_elapsed', String(filesElapsedSeconds));
      localStorage.setItem('arkedo_internet1_elapsed', String(internet1ElapsedSeconds));
      localStorage.setItem('arkedo_internet2_elapsed', String(internet2ElapsedSeconds));
    } catch {
      // Ignore
    }
  }, [
    activeMission, 
    hwLevel, hwScore, hwElapsedSeconds,
    filesLevel, filesScore, filesElapsedSeconds,
    internet1Level, internet1Score, internet1ElapsedSeconds,
    internet2Level, internet2Score, internet2ElapsedSeconds
  ]);

  // Current active level & score
  const currentLevel = activeMission === 'hardware' 
    ? hwLevel 
    : activeMission === 'internet1' 
    ? internet1Level 
    : activeMission === 'internet2'
    ? internet2Level
    : filesLevel;
    
  const currentScore = activeMission === 'hardware' 
    ? hwScore 
    : activeMission === 'internet1' 
    ? internet1Score 
    : activeMission === 'internet2'
    ? internet2Score
    : filesScore;
    
  const currentElapsedSeconds = activeMission === 'hardware' 
    ? hwElapsedSeconds 
    : activeMission === 'internet1' 
    ? internet1ElapsedSeconds 
    : activeMission === 'internet2'
    ? internet2ElapsedSeconds
    : filesElapsedSeconds;

  // Automatically scroll to top on view or level change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentLevel, view, activeMission]);

  // Timer interval effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const isOngoing = (activeMission === 'hardware' && hwLevel <= 5) ||
      (activeMission === 'files' && filesLevel <= 7) ||
      (activeMission === 'internet1' && internet1Level <= 6) ||
      (activeMission === 'internet2' && internet2Level <= 6);

    if (isTimerRunning && view === 'lesson' && isOngoing) {
      interval = setInterval(() => {
        if (activeMission === 'hardware') {
          setHwElapsedSeconds((prev) => prev + 1);
        } else if (activeMission === 'internet1') {
          setInternet1ElapsedSeconds((prev) => prev + 1);
        } else if (activeMission === 'internet2') {
          setInternet2ElapsedSeconds((prev) => prev + 1);
        } else {
          setFilesElapsedSeconds((prev) => prev + 1);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, view, currentLevel, activeMission, hwLevel, filesLevel, internet1Level, internet2Level]);

  // Listen to browser navigation
  useEffect(() => {
    const handleUrlChange = () => {
      if (window.location.pathname.includes('/profesor') || window.location.hash.includes('profesor')) {
        setView('teacher');
      } else if (window.location.pathname.includes('/arcade') || window.location.hash.includes('arcade')) {
        setView('arcade');
      } else if (window.location.pathname.includes('/duel') || window.location.hash.includes('duel')) {
        setView('duel');
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const navigateToView = (newView: 'catalog' | 'lesson' | 'teacher' | 'arcade' | 'duel') => {
    setView(newView);
    if (newView === 'teacher') {
      window.history.pushState({}, '', '/profesor');
    } else if (newView === 'arcade') {
      window.history.pushState({}, '', '/arcade');
    } else if (newView === 'duel') {
      window.history.pushState({}, '', '/duel');
    } else if (newView === 'catalog') {
      window.history.pushState({}, '', '/');
    }
  };

  const handleToggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    sounds.setEnabled(newState);
    if (newState) sounds.playClick();
  };

  // Launch or resume a mission
  const handleSelectMission = (missionId: 'hardware' | 'files' | 'internet1' | 'internet2') => {
    setActiveMission(missionId);
    setView('lesson');
    setIsTimerRunning(true);
    sounds.playClick();
    arky.triggerIdle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetActiveMission = () => {
    if (activeMission === 'hardware') {
      setHwLevel(1);
      setHwScore(0);
      setHwElapsedSeconds(0);
    } else if (activeMission === 'files') {
      setFilesLevel(1);
      setFilesScore(0);
      setFilesElapsedSeconds(0);
    } else if (activeMission === 'internet1') {
      setInternet1Level(1);
      setInternet1Score(0);
      setInternet1ElapsedSeconds(0);
    } else if (activeMission === 'internet2') {
      setInternet2Level(1);
      setInternet2Score(0);
      setInternet2ElapsedSeconds(0);
    }
    arky.triggerIdle();
  };

  // Internet 1 level progression
  const handleInternet1CompleteLevel = (levelIndex: number, earnedScore: number) => {
    const updatedTotal = Math.min(100, Math.max(internet1Score, earnedScore));
    setInternet1Score(updatedTotal);
    
    if (levelIndex < 6) {
      setInternet1Level(levelIndex + 1);
      arky.triggerSuccess();
    } else {
      setInternet1Level(7); // Victory Screen
      setIsTimerRunning(false);
      arky.triggerFinished();
      updateActiveLessonProgress('internet1', true, 7, updatedTotal, internet1ElapsedSeconds);
    }
  };

  const handleResetInternet1 = () => {
    sounds.playClick();
    setInternet1Score(0);
    setInternet1Level(1);
    setInternet1ElapsedSeconds(0);
    setIsTimerRunning(true);
    arky.triggerIdle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Internet 2 level progression
  const handleInternet2CompleteLevel = (levelIndex: number, earnedScore: number) => {
    const updatedTotal = Math.min(100, Math.max(internet2Score, earnedScore));
    setInternet2Score(updatedTotal);
    
    if (levelIndex < 6) {
      setInternet2Level(levelIndex + 1);
      arky.triggerSuccess();
    } else {
      setInternet2Level(7); // Victory Screen
      setIsTimerRunning(false);
      arky.triggerFinished();
      updateActiveLessonProgress('internet2', true, 7, updatedTotal, internet2ElapsedSeconds);
    }
  };

  const handleResetInternet2 = () => {
    sounds.playClick();
    setInternet2Score(0);
    setInternet2Level(1);
    setInternet2ElapsedSeconds(0);
    setIsTimerRunning(true);
    arky.triggerIdle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hardware level progression
  const handleHwComplete1 = () => {
    setHwScore(20);
    setHwLevel(2);
    arky.triggerSuccess();
  };
  const handleHwComplete2 = () => {
    setHwScore(40);
    setHwLevel(3);
    arky.triggerSuccess();
  };
  const handleHwComplete3 = () => {
    setHwScore(60);
    setHwLevel(4);
    arky.triggerSuccess();
  };
  const handleHwComplete4 = () => {
    setHwScore(80);
    setHwLevel(5);
    arky.triggerSuccess();
  };
  const handleHwComplete5 = () => {
    setHwScore(100);
    setHwLevel(6);
    setIsTimerRunning(false);
    arky.triggerFinished();
    updateActiveLessonProgress('hardware', true, 6, 100, hwElapsedSeconds);
  };

  const handleResetHardware = () => {
    sounds.playClick();
    setHwScore(0);
    setHwLevel(1);
    setHwElapsedSeconds(0);
    setIsTimerRunning(true);
    arky.triggerIdle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Files level progression (7 levels + victory level 8)
  const handleFilesComplete1 = () => {
    setFilesScore(10);
    setFilesLevel(2);
    arky.triggerSuccess();
  };
  const handleFilesComplete2 = () => {
    setFilesScore(25);
    setFilesLevel(3);
    arky.triggerSuccess();
  };
  const handleFilesComplete3 = () => {
    setFilesScore(40);
    setFilesLevel(4);
    arky.triggerSuccess();
  };
  const handleFilesComplete4 = () => {
    setFilesScore(55);
    setFilesLevel(5);
    arky.triggerSuccess();
  };
  const handleFilesComplete5 = () => {
    setFilesScore(70);
    setFilesLevel(6);
    arky.triggerSuccess();
  };
  const handleFilesComplete6 = () => {
    setFilesScore(85);
    setFilesLevel(7);
    arky.triggerSuccess();
  };
  const handleFilesComplete7 = () => {
    setFilesScore(100);
    setFilesLevel(8);
    setIsTimerRunning(false);
    arky.triggerFinished();
    updateActiveLessonProgress('files', true, 8, 100, filesElapsedSeconds);
  };

  const handleResetFiles = () => {
    sounds.playClick();
    setFilesScore(0);
    setFilesLevel(1);
    setFilesElapsedSeconds(0);
    setIsTimerRunning(true);
    arky.triggerIdle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-teal-500 selection:text-white relative">
      {/* Top Header */}
      <Header
        score={currentScore}
        maxScore={maxScore}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        currentView={view}
        missionId={activeMission}
        onNavigateToCatalog={() => navigateToView('catalog')}
        studentName={studentName}
        elapsedSeconds={currentElapsedSeconds}
        onEditStudentName={() => navigateToView('catalog')}
        onNavigateToTeacher={() => navigateToView('teacher')}
        onNavigateToArcade={() => navigateToView('arcade')}
        onNavigateToDuel={() => navigateToView('duel')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-6 lg:p-8 flex flex-col gap-5 sm:gap-6">
        {view === 'teacher' ? (
          <TeacherPortal onBackToHome={() => navigateToView('catalog')} />
        ) : view === 'arcade' ? (
          <ArcadeHub
            studentName={studentName}
            onBackToCatalog={() => navigateToView('catalog')}
            onOpenDuel={() => navigateToView('duel')}
          />
        ) : view === 'duel' ? (
          <DuelArena
            studentName={studentName}
            onBack={() => navigateToView('catalog')}
          />
        ) : view === 'catalog' ? (
          <CoursesCatalog
            studentName={studentName}
            onSetStudentName={handleSetStudentName}
            onSelectMission={handleSelectMission}
            activeMissionId={activeMission}
            activeMissionLevel={currentLevel}
            activeMissionScore={currentScore}
            elapsedSeconds={currentElapsedSeconds}
            onResetActiveMission={handleResetActiveMission}
            onOpenTeacherPortal={() => navigateToView('teacher')}
            onOpenArcade={() => navigateToView('arcade')}
            onOpenDuel={() => navigateToView('duel')}
          />
        ) : (
          <>
            {/* Mission Evolution Progress */}
            <ProgressBar
              currentLevel={currentLevel}
              courseId={activeMission === 'hardware' ? 'hardware' : activeMission === 'internet1' ? 'internet1' : activeMission === 'internet2' ? 'internet2' : 'files'}
            />

            {/* Level Views for HARDWARE */}
            {activeMission === 'hardware' && (
              <div className="flex-1">
                {hwLevel === 1 && (
                  <HLevel1_ErgonomyRules onComplete={handleHwComplete1} />
                )}
                {hwLevel === 2 && (
                  <HLevel2_HistoryTimeline onComplete={handleHwComplete2} />
                )}
                {hwLevel === 3 && (
                  <HLevel3_CentralUnitAssembly onComplete={handleHwComplete3} />
                )}
                {hwLevel === 4 && (
                  <HLevel4_PeripheralsSort onComplete={handleHwComplete4} />
                )}
                {hwLevel === 5 && (
                  <HLevel5_BitsQuiz onComplete={handleHwComplete5} />
                )}
                {hwLevel === 6 && (
                  <VictoryScreen
                    score={hwScore}
                    maxScore={maxScore}
                    studentName={studentName}
                    elapsedSeconds={hwElapsedSeconds}
                    courseId="hardware"
                    onReset={handleResetHardware}
                    onBackToCatalog={() => navigateToView('catalog')}
                  />
                )}
              </div>
            )}

            {/* Level Views for FILES / ARBORELE SECRET */}
            {activeMission === 'files' && (
              <div className="flex-1">
                {filesLevel === 1 && (
                  <FLevel1_OSInterface onComplete={handleFilesComplete1} />
                )}
                {filesLevel === 2 && (
                  <FLevel2_DataMemory onComplete={handleFilesComplete2} />
                )}
                {filesLevel === 3 && (
                  <Level1_Structure onComplete={handleFilesComplete3} />
                )}
                {filesLevel === 4 && (
                  <Level2_SelectionSearch onComplete={handleFilesComplete4} />
                )}
                {filesLevel === 5 && (
                  <Level3_MoveShortcuts onComplete={handleFilesComplete5} />
                )}
                {filesLevel === 6 && (
                  <Level4_CopyRenameProps onComplete={handleFilesComplete6} />
                )}
                {filesLevel === 7 && (
                  <Level5_RecycleBin onComplete={handleFilesComplete7} />
                )}
                {filesLevel === 8 && (
                  <VictoryScreen
                    score={filesScore}
                    maxScore={maxScore}
                    studentName={studentName}
                    elapsedSeconds={filesElapsedSeconds}
                    courseId="files"
                    onReset={handleResetFiles}
                    onBackToCatalog={() => navigateToView('catalog')}
                  />
                )}
              </div>
            )}

            {/* Level Views for INTERNET 1 (MISSION 3A) */}
            {activeMission === 'internet1' && (
              <div className="flex-1">
                {internet1Level <= 6 ? (
                  <Module3AFlow
                    currentLevel={internet1Level}
                    onCompleteLevel={handleInternet1CompleteLevel}
                  />
                ) : (
                  <VictoryScreen
                    score={internet1Score}
                    maxScore={maxScore}
                    studentName={studentName}
                    elapsedSeconds={internet1ElapsedSeconds}
                    courseId="internet1"
                    onReset={handleResetInternet1}
                    onBackToCatalog={() => navigateToView('catalog')}
                  />
                )}
              </div>
            )}

            {/* Level Views for INTERNET 2 (MISSION 3B) */}
            {activeMission === 'internet2' && (
              <div className="flex-1">
                {internet2Level <= 6 ? (
                  <Module3BFlow
                    currentLevel={internet2Level}
                    onCompleteLevel={handleInternet2CompleteLevel}
                  />
                ) : (
                  <VictoryScreen
                    score={internet2Score}
                    maxScore={maxScore}
                    studentName={studentName}
                    elapsedSeconds={internet2ElapsedSeconds}
                    courseId="internet2"
                    onReset={handleResetInternet2}
                    onBackToCatalog={() => navigateToView('catalog')}
                  />
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Bottom Stopwatch Bar (shown during active lesson) */}
      {view === 'lesson' && ((activeMission === 'hardware' && hwLevel <= 5) || (activeMission === 'files' && filesLevel <= 7) || (activeMission === 'internet1' && internet1Level <= 6) || (activeMission === 'internet2' && internet2Level <= 6)) && (
        <div className="sticky bottom-3 z-30 flex justify-center px-4 pointer-events-none">
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl px-4 py-2.5 shadow-2xl flex items-center gap-4 text-xs font-mono pointer-events-auto ring-1 ring-teal-500/20">
            {/* Student Name */}
            {studentName && (
              <div className="flex items-center gap-1.5 text-slate-300 border-r border-slate-700 pr-3 font-sans">
                <User className="w-3.5 h-3.5 text-teal-400" />
                <span className="font-bold text-teal-300 max-w-[110px] truncate">
                  {studentName}
                </span>
              </div>
            )}

            {/* Stopwatch */}
            <div className="flex items-center gap-1.5 text-cyan-300">
              <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-slate-400 hidden sm:inline">{t.timerLabel}:</span>
              <strong className="text-sm font-black text-cyan-200">
                {formatTimer(currentElapsedSeconds)}
              </strong>
            </div>

            {/* Score pill */}
            <div className="flex items-center gap-1.5 text-amber-300 border-l border-slate-700 pl-3">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold">{currentScore}/{maxScore} {t.pts}</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-4 bg-slate-950/60 mt-auto">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="text-slate-400 text-center sm:text-left leading-relaxed">
            {t.footerText}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-teal-500/30 text-teal-300 font-mono font-bold text-[11px] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              {t.poweredBy}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <HintProvider>
        <ArkyProvider>
          <GameContent />
          <MascotaArky />
        </ArkyProvider>
      </HintProvider>
    </LanguageProvider>
  );
}
