import React, { useState, useEffect } from 'react';
import { GameLevel } from './types';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ArkyProvider, useArky } from './context/ArkyContext';
import { HintProvider } from './context/HintContext';
import { ThemeProvider } from './context/ThemeContext';
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

// Text Mission 4A (Unitatea 4 - Manual pag. 50-67)
import { Module4AFlow } from './components/text1/Module4AFlow';

// Text Mission 4B (Unitatea 4 - Manual pag. 68-80)
import { Module4BFlow } from './components/text2/Module4BFlow';

// Algo Mission 5A (Unitatea 5 - Manual pag. 54-61)
import { Module5AFlow } from './components/algo1/Module5AFlow';

// Algo Mission 5B (Unitatea 5 - Manual pag. 62-71)
import { Module5BFlow } from './components/algo2/Module5BFlow';

// Scratch Mission 6A (Unitatea 6 - Manual pag. 72-83)
import { Module6AFlow } from './components/scratch1/Module6AFlow';

// Scratch Mission 6B (Unitatea 6 - Manual pag. 84-93)
import { Module6BFlow } from './components/scratch2/Module6BFlow';

// Grade 6 Presentation Mission 1A (Unitatea 1 - Manual pag. 10-15)
import { ModuleG6P1Flow } from './components/grade6/presentation1/ModuleG6P1Flow';

// Grade 6 Presentation Mission 1B (Unitatea 1 - Manual pag. 16-25)
import { ModuleG6P2Flow } from './components/grade6/presentation2/ModuleG6P2Flow';

// Grade 6 Paint 3D Mission 2A (Unitatea 2 - Manual pag. 26-33)
import { ModuleG6Paint3DFlow } from './components/grade6/paint3d/ModuleG6Paint3DFlow';

import { VictoryScreen } from './components/VictoryScreen';
import { TeacherPortal } from './components/TeacherPortal';
import { ArcadeHub } from './components/minigames/ArcadeHub';
import { DuelArena } from './components/DuelArena';
import { CyberCityView } from './components/cybercity/CyberCityView';
import { sounds } from './utils/audio';
import { Clock, Star, User } from 'lucide-react';
import { updateActiveLessonProgress, getActiveStudent } from './lib/studentAuthService';

function GameContent() {
  const { t } = useLanguage();
  const arky = useArky();
  const [view, setView] = useState<'catalog' | 'lesson' | 'teacher' | 'arcade' | 'duel' | 'city'>(() => {
    if (window.location.pathname.includes('/profesor') || window.location.hash.includes('profesor')) {
      return 'teacher';
    }
    if (window.location.pathname.includes('/arcade') || window.location.hash.includes('arcade')) {
      return 'arcade';
    }
    if (window.location.pathname.includes('/duel') || window.location.hash.includes('duel')) {
      return 'duel';
    }
    if (window.location.pathname.includes('/city') || window.location.pathname.includes('/oras') || window.location.hash.includes('city') || window.location.hash.includes('oras')) {
      return 'city';
    }
    return 'catalog';
  });

  // Current selected mission
  const [activeMission, setActiveMission] = useState<'hardware' | 'files' | 'internet1' | 'internet2' | 'text1' | 'text2' | 'algo1' | 'algo2' | 'scratch1' | 'scratch2' | 'g6_presentation1' | 'g6_presentation2' | 'g6_paint3d' | null>(() => {
    try {
      const saved = localStorage.getItem('arkedo_active_mission');
      if (saved === 'hardware' || saved === 'files' || saved === 'internet1' || saved === 'internet2' || saved === 'text1' || saved === 'text2' || saved === 'algo1' || saved === 'algo2' || saved === 'scratch1' || saved === 'scratch2' || saved === 'g6_presentation1' || saved === 'g6_presentation2' || saved === 'g6_paint3d') return saved;
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

  // Text 1 (Mission 4A) progress
  const [text1Level, setText1Level] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_text1_level');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 1;
  });
  const [text1Score, setText1Score] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_text1_score');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });
  const [text1ElapsedSeconds, setText1ElapsedSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_text1_elapsed');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });

  // Text 2 (Mission 4B) progress
  const [text2Level, setText2Level] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_text2_level');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 1;
  });
  const [text2Score, setText2Score] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_text2_score');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });
  const [text2ElapsedSeconds, setText2ElapsedSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_text2_elapsed');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });

  // Algo 1 (Mission 5A) progress
  const [algo1Level, setAlgo1Level] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_algo1_level');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 1;
  });
  const [algo1Score, setAlgo1Score] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_algo1_score');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });
  const [algo1ElapsedSeconds, setAlgo1ElapsedSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_algo1_elapsed');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });

  // Algo 2 (Mission 5B) progress
  const [algo2Level, setAlgo2Level] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_algo2_level');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 1;
  });
  const [algo2Score, setAlgo2Score] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_algo2_score');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });
  const [algo2ElapsedSeconds, setAlgo2ElapsedSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_algo2_elapsed');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });

  // Scratch 1 mission progress (Unitatea 6A - Manual pag. 72-83)
  const [scratch1Level, setScratch1Level] = useState<GameLevel>(() => {
    try {
      const saved = localStorage.getItem('arkedo_scratch1_level');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 1;
  });
  const [scratch1Score, setScratch1Score] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_scratch1_score');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });
  const [scratch1ElapsedSeconds, setScratch1ElapsedSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_scratch1_elapsed');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });

  // Scratch 2 mission progress (Unitatea 6B - Manual pag. 84-93)
  const [scratch2Level, setScratch2Level] = useState<GameLevel>(() => {
    try {
      const saved = localStorage.getItem('arkedo_scratch2_level');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 1;
  });
  const [scratch2Score, setScratch2Score] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_scratch2_score');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });
  const [scratch2ElapsedSeconds, setScratch2ElapsedSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_scratch2_elapsed');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });

  // Grade 6 Presentation Mission 1A progress (Unitatea 1 - Manual pag. 10-15)
  const [g6P1Level, setG6P1Level] = useState<GameLevel>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g6p1_level');
      if (saved) return Number(saved) as GameLevel;
    } catch {
      // Ignore
    }
    return 1;
  });
  const [g6P1Score, setG6P1Score] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g6p1_score');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });
  const [g6P1ElapsedSeconds, setG6P1ElapsedSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g6p1_elapsed');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });

  // Grade 6 Presentation Mission 1B progress (Unitatea 1 - Manual pag. 16-25)
  const [g6P2Level, setG6P2Level] = useState<GameLevel>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g6p2_level');
      if (saved) return Number(saved) as GameLevel;
    } catch {
      // Ignore
    }
    return 1;
  });
  const [g6P2Score, setG6P2Score] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g6p2_score');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });
  const [g6P2ElapsedSeconds, setG6P2ElapsedSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g6p2_elapsed');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });

  // Grade 6 Paint 3D Mission 2A progress (Unitatea 2 - Manual pag. 26-33)
  const [g6P3Level, setG6P3Level] = useState<GameLevel>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g6p3_level');
      if (saved) return Number(saved) as GameLevel;
    } catch {
      // Ignore
    }
    return 1;
  });
  const [g6P3Score, setG6P3Score] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g6p3_score');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });
  const [g6P3ElapsedSeconds, setG6P3ElapsedSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g6p3_elapsed');
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
      const saved = localStorage.getItem('arkedo_student_name') || '';
      // Automatic cleanup for purged ghost student "PRO"
      if (saved.trim().toUpperCase() === 'PRO') {
        localStorage.removeItem('arkedo_student_name');
        const prof = localStorage.getItem('arkedo_active_student_profile');
        if (prof && prof.toLowerCase().includes('"pro"')) {
          localStorage.removeItem('arkedo_active_student_profile');
        }
        return '';
      }
      return saved;
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
      localStorage.setItem('arkedo_text1_level', String(text1Level));
      localStorage.setItem('arkedo_text1_score', String(text1Score));
      localStorage.setItem('arkedo_text2_level', String(text2Level));
      localStorage.setItem('arkedo_text2_score', String(text2Score));
      localStorage.setItem('arkedo_algo1_level', String(algo1Level));
      localStorage.setItem('arkedo_algo1_score', String(algo1Score));
      localStorage.setItem('arkedo_algo2_level', String(algo2Level));
      localStorage.setItem('arkedo_algo2_score', String(algo2Score));
      localStorage.setItem('arkedo_hw_elapsed', String(hwElapsedSeconds));
      localStorage.setItem('arkedo_files_elapsed', String(filesElapsedSeconds));
      localStorage.setItem('arkedo_internet1_elapsed', String(internet1ElapsedSeconds));
      localStorage.setItem('arkedo_internet2_elapsed', String(internet2ElapsedSeconds));
      localStorage.setItem('arkedo_text1_elapsed', String(text1ElapsedSeconds));
      localStorage.setItem('arkedo_text2_elapsed', String(text2ElapsedSeconds));
      localStorage.setItem('arkedo_algo1_elapsed', String(algo1ElapsedSeconds));
      localStorage.setItem('arkedo_algo2_elapsed', String(algo2ElapsedSeconds));
      localStorage.setItem('arkedo_scratch1_level', String(scratch1Level));
      localStorage.setItem('arkedo_scratch1_score', String(scratch1Score));
      localStorage.setItem('arkedo_scratch1_elapsed', String(scratch1ElapsedSeconds));
      localStorage.setItem('arkedo_scratch2_level', String(scratch2Level));
      localStorage.setItem('arkedo_scratch2_score', String(scratch2Score));
      localStorage.setItem('arkedo_scratch2_elapsed', String(scratch2ElapsedSeconds));
      localStorage.setItem('arkedo_g6p1_level', String(g6P1Level));
      localStorage.setItem('arkedo_g6p1_score', String(g6P1Score));
      localStorage.setItem('arkedo_g6p1_elapsed', String(g6P1ElapsedSeconds));
      localStorage.setItem('arkedo_g6p2_level', String(g6P2Level));
      localStorage.setItem('arkedo_g6p2_score', String(g6P2Score));
      localStorage.setItem('arkedo_g6p2_elapsed', String(g6P2ElapsedSeconds));
      localStorage.setItem('arkedo_g6p3_level', String(g6P3Level));
      localStorage.setItem('arkedo_g6p3_score', String(g6P3Score));
      localStorage.setItem('arkedo_g6p3_elapsed', String(g6P3ElapsedSeconds));
    } catch {
      // Ignore
    }
  }, [
    activeMission, 
    hwLevel, hwScore, hwElapsedSeconds,
    filesLevel, filesScore, filesElapsedSeconds,
    internet1Level, internet1Score, internet1ElapsedSeconds,
    internet2Level, internet2Score, internet2ElapsedSeconds,
    text1Level, text1Score, text1ElapsedSeconds,
    text2Level, text2Score, text2ElapsedSeconds,
    algo1Level, algo1Score, algo1ElapsedSeconds,
    algo2Level, algo2Score, algo2ElapsedSeconds,
    scratch1Level, scratch1Score, scratch1ElapsedSeconds,
    scratch2Level, scratch2Score, scratch2ElapsedSeconds,
    g6P1Level, g6P1Score, g6P1ElapsedSeconds,
    g6P2Level, g6P2Score, g6P2ElapsedSeconds,
    g6P3Level, g6P3Score, g6P3ElapsedSeconds
  ]);

  // Current active level & score
  const currentLevel = activeMission === 'hardware' 
    ? hwLevel 
    : activeMission === 'internet1' 
    ? internet1Level 
    : activeMission === 'internet2'
    ? internet2Level
    : activeMission === 'text1'
    ? text1Level
    : activeMission === 'text2'
    ? text2Level
    : activeMission === 'algo1'
    ? algo1Level
    : activeMission === 'algo2'
    ? algo2Level
    : activeMission === 'scratch1'
    ? scratch1Level
    : activeMission === 'scratch2'
    ? scratch2Level
    : activeMission === 'g6_presentation1'
    ? g6P1Level
    : activeMission === 'g6_presentation2'
    ? g6P2Level
    : activeMission === 'g6_paint3d'
    ? g6P3Level
    : filesLevel;
    
  const currentScore = activeMission === 'hardware' 
    ? hwScore 
    : activeMission === 'internet1' 
    ? internet1Score 
    : activeMission === 'internet2'
    ? internet2Score
    : activeMission === 'text1'
    ? text1Score
    : activeMission === 'text2'
    ? text2Score
    : activeMission === 'algo1'
    ? algo1Score
    : activeMission === 'algo2'
    ? algo2Score
    : activeMission === 'scratch1'
    ? scratch1Score
    : activeMission === 'scratch2'
    ? scratch2Score
    : activeMission === 'g6_presentation1'
    ? g6P1Score
    : activeMission === 'g6_presentation2'
    ? g6P2Score
    : activeMission === 'g6_paint3d'
    ? g6P3Score
    : filesScore;
    
  const currentElapsedSeconds = activeMission === 'hardware' 
    ? hwElapsedSeconds 
    : activeMission === 'internet1' 
    ? internet1ElapsedSeconds 
    : activeMission === 'internet2'
    ? internet2ElapsedSeconds
    : activeMission === 'text1'
    ? text1ElapsedSeconds
    : activeMission === 'text2'
    ? text2ElapsedSeconds
    : activeMission === 'algo1'
    ? algo1ElapsedSeconds
    : activeMission === 'algo2'
    ? algo2ElapsedSeconds
    : activeMission === 'scratch1'
    ? scratch1ElapsedSeconds
    : activeMission === 'scratch2'
    ? scratch2ElapsedSeconds
    : activeMission === 'g6_presentation1'
    ? g6P1ElapsedSeconds
    : activeMission === 'g6_presentation2'
    ? g6P2ElapsedSeconds
    : activeMission === 'g6_paint3d'
    ? g6P3ElapsedSeconds
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
      (activeMission === 'internet2' && internet2Level <= 6) ||
      (activeMission === 'text1' && text1Level <= 7) ||
      (activeMission === 'text2' && text2Level <= 7) ||
      (activeMission === 'algo1' && algo1Level <= 7) ||
      (activeMission === 'algo2' && algo2Level <= 7) ||
      (activeMission === 'scratch1' && scratch1Level <= 7) ||
      (activeMission === 'scratch2' && scratch2Level <= 7) ||
      (activeMission === 'g6_presentation1' && g6P1Level <= 7) ||
      (activeMission === 'g6_presentation2' && g6P2Level <= 7) ||
      (activeMission === 'g6_paint3d' && g6P3Level <= 7);

    if (isTimerRunning && view === 'lesson' && isOngoing) {
      interval = setInterval(() => {
        if (activeMission === 'hardware') {
          setHwElapsedSeconds((prev) => prev + 1);
        } else if (activeMission === 'internet1') {
          setInternet1ElapsedSeconds((prev) => prev + 1);
        } else if (activeMission === 'internet2') {
          setInternet2ElapsedSeconds((prev) => prev + 1);
        } else if (activeMission === 'text1') {
          setText1ElapsedSeconds((prev) => prev + 1);
        } else if (activeMission === 'text2') {
          setText2ElapsedSeconds((prev) => prev + 1);
        } else if (activeMission === 'algo1') {
          setAlgo1ElapsedSeconds((prev) => prev + 1);
        } else if (activeMission === 'algo2') {
          setAlgo2ElapsedSeconds((prev) => prev + 1);
        } else if (activeMission === 'scratch1') {
          setScratch1ElapsedSeconds((prev) => prev + 1);
        } else if (activeMission === 'scratch2') {
          setScratch2ElapsedSeconds((prev) => prev + 1);
        } else if (activeMission === 'g6_presentation1') {
          setG6P1ElapsedSeconds((prev) => prev + 1);
        } else if (activeMission === 'g6_presentation2') {
          setG6P2ElapsedSeconds((prev) => prev + 1);
        } else if (activeMission === 'g6_paint3d') {
          setG6P3ElapsedSeconds((prev) => prev + 1);
        } else {
          setFilesElapsedSeconds((prev) => prev + 1);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, view, currentLevel, activeMission, hwLevel, filesLevel, internet1Level, internet2Level, text1Level, text2Level, algo1Level, algo2Level, scratch1Level, scratch2Level, g6P1Level, g6P2Level]);

  // Listen to browser navigation
  useEffect(() => {
    const handleUrlChange = () => {
      if (window.location.pathname.includes('/profesor') || window.location.hash.includes('profesor')) {
        setView('teacher');
      } else if (window.location.pathname.includes('/arcade') || window.location.hash.includes('arcade')) {
        setView('arcade');
      } else if (window.location.pathname.includes('/duel') || window.location.hash.includes('duel')) {
        setView('duel');
      } else if (window.location.pathname.includes('/city') || window.location.pathname.includes('/oras') || window.location.hash.includes('city') || window.location.hash.includes('oras')) {
        setView('city');
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const navigateToView = (newView: 'catalog' | 'lesson' | 'teacher' | 'arcade' | 'duel' | 'city') => {
    setView(newView);
    if (newView === 'teacher') {
      window.history.pushState({}, '', '/profesor');
    } else if (newView === 'arcade') {
      window.history.pushState({}, '', '/arcade');
    } else if (newView === 'duel') {
      window.history.pushState({}, '', '/duel');
    } else if (newView === 'city') {
      window.history.pushState({}, '', '/oras');
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
  const handleSelectMission = (missionId: 'hardware' | 'files' | 'internet1' | 'internet2' | 'text1' | 'text2' | 'algo1' | 'algo2' | 'scratch1' | 'scratch2' | 'g6_presentation1' | 'g6_presentation2' | 'g6_paint3d') => {
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
    } else if (activeMission === 'text1') {
      setText1Level(1);
      setText1Score(0);
      setText1ElapsedSeconds(0);
    } else if (activeMission === 'text2') {
      setText2Level(1);
      setText2Score(0);
      setText2ElapsedSeconds(0);
    } else if (activeMission === 'algo1') {
      setAlgo1Level(1);
      setAlgo1Score(0);
      setAlgo1ElapsedSeconds(0);
    } else if (activeMission === 'algo2') {
      setAlgo2Level(1);
      setAlgo2Score(0);
      setAlgo2ElapsedSeconds(0);
    } else if (activeMission === 'scratch1') {
      setScratch1Level(1);
      setScratch1Score(0);
      setScratch1ElapsedSeconds(0);
    } else if (activeMission === 'scratch2') {
      setScratch2Level(1);
      setScratch2Score(0);
      setScratch2ElapsedSeconds(0);
    } else if (activeMission === 'g6_presentation1') {
      setG6P1Level(1);
      setG6P1Score(0);
      setG6P1ElapsedSeconds(0);
    } else if (activeMission === 'g6_presentation2') {
      setG6P2Level(1);
      setG6P2Score(0);
      setG6P2ElapsedSeconds(0);
    } else if (activeMission === 'g6_paint3d') {
      setG6P3Level(1);
      setG6P3Score(0);
      setG6P3ElapsedSeconds(0);
    }
    arky.triggerIdle();
  };

  // Grade 6 Presentation 1 (Mission 1A) level progression
  const handleG6P1CompleteLevel = (levelIndex: number, earnedScore: number) => {
    const updatedTotal = Math.min(100, Math.max(g6P1Score, earnedScore));
    setG6P1Score(updatedTotal);
    
    if (levelIndex < 7) {
      setG6P1Level(levelIndex + 1);
      arky.triggerSuccess();
    } else {
      setG6P1Level(8); // Victory Screen
      setIsTimerRunning(false);
      arky.triggerFinished();
      updateActiveLessonProgress('presentation1', true, 8, updatedTotal, g6P1ElapsedSeconds);
    }
  };

  const handleResetG6P1 = () => {
    sounds.playClick();
    setG6P1Score(0);
    setG6P1Level(1);
    setG6P1ElapsedSeconds(0);
    setIsTimerRunning(true);
    arky.triggerIdle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Grade 6 Presentation 2 (Mission 1B) level progression
  const handleG6P2CompleteLevel = (levelIndex: number, earnedScore: number) => {
    const updatedTotal = Math.min(100, Math.max(g6P2Score, earnedScore));
    setG6P2Score(updatedTotal);
    
    if (levelIndex < 7) {
      setG6P2Level(levelIndex + 1);
      arky.triggerSuccess();
    } else {
      setG6P2Level(8); // Victory Screen
      setIsTimerRunning(false);
      arky.triggerFinished();
      updateActiveLessonProgress('presentation2', true, 8, updatedTotal, g6P2ElapsedSeconds);
    }
  };

  const handleResetG6P2 = () => {
    sounds.playClick();
    setG6P2Score(0);
    setG6P2Level(1);
    setG6P2ElapsedSeconds(0);
    setIsTimerRunning(true);
    arky.triggerIdle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Grade 6 Paint 3D (Mission 2A) level progression
  const handleG6P3CompleteLevel = (levelIndex: number, earnedScore: number) => {
    const updatedTotal = Math.min(100, Math.max(g6P3Score, earnedScore));
    setG6P3Score(updatedTotal);
    
    if (levelIndex < 7) {
      setG6P3Level(levelIndex + 1);
      arky.triggerSuccess();
    } else {
      setG6P3Level(8); // Victory Screen
      setIsTimerRunning(false);
      arky.triggerFinished();
      updateActiveLessonProgress('model3d1', true, 8, updatedTotal, g6P3ElapsedSeconds);
    }
  };

  const handleResetG6P3 = () => {
    sounds.playClick();
    setG6P3Score(0);
    setG6P3Level(1);
    setG6P3ElapsedSeconds(0);
    setIsTimerRunning(true);
    arky.triggerIdle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scratch 1 (Mission 6A) level progression
  const handleScratch1CompleteLevel = (levelIndex: number, earnedScore: number) => {
    const updatedTotal = Math.min(100, Math.max(scratch1Score, earnedScore));
    setScratch1Score(updatedTotal);
    
    if (levelIndex < 7) {
      setScratch1Level(levelIndex + 1);
      arky.triggerSuccess();
    } else {
      setScratch1Level(8); // Victory Screen
      setIsTimerRunning(false);
      arky.triggerFinished();
      updateActiveLessonProgress('scratch1', true, 8, updatedTotal, scratch1ElapsedSeconds);
    }
  };

  const handleResetScratch1 = () => {
    sounds.playClick();
    setScratch1Score(0);
    setScratch1Level(1);
    setScratch1ElapsedSeconds(0);
    setIsTimerRunning(true);
    arky.triggerIdle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scratch 2 (Mission 6B) level progression
  const handleScratch2CompleteLevel = (levelIndex: number, earnedScore: number) => {
    const updatedTotal = Math.min(100, Math.max(scratch2Score, earnedScore));
    setScratch2Score(updatedTotal);
    
    if (levelIndex < 7) {
      setScratch2Level(levelIndex + 1);
      arky.triggerSuccess();
    } else {
      setScratch2Level(8); // Victory Screen
      setIsTimerRunning(false);
      arky.triggerFinished();
      updateActiveLessonProgress('scratch2', true, 8, updatedTotal, scratch2ElapsedSeconds);
    }
  };

  const handleResetScratch2 = () => {
    sounds.playClick();
    setScratch2Score(0);
    setScratch2Level(1);
    setScratch2ElapsedSeconds(0);
    setIsTimerRunning(true);
    arky.triggerIdle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Algo 1 (Mission 5A) level progression
  const handleAlgo1CompleteLevel = (levelIndex: number, earnedScore: number) => {
    const updatedTotal = Math.min(100, Math.max(algo1Score, earnedScore));
    setAlgo1Score(updatedTotal);
    
    if (levelIndex < 7) {
      setAlgo1Level(levelIndex + 1);
      arky.triggerSuccess();
    } else {
      setAlgo1Level(8); // Victory Screen
      setIsTimerRunning(false);
      arky.triggerFinished();
      updateActiveLessonProgress('algo1', true, 8, updatedTotal, algo1ElapsedSeconds);
    }
  };

  const handleResetAlgo1 = () => {
    sounds.playClick();
    setAlgo1Score(0);
    setAlgo1Level(1);
    setAlgo1ElapsedSeconds(0);
    setIsTimerRunning(true);
    arky.triggerIdle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Algo 2 (Mission 5B) level progression
  const handleAlgo2CompleteLevel = (levelIndex: number, earnedScore: number) => {
    const updatedTotal = Math.min(100, Math.max(algo2Score, earnedScore));
    setAlgo2Score(updatedTotal);
    
    if (levelIndex < 7) {
      setAlgo2Level(levelIndex + 1);
      arky.triggerSuccess();
    } else {
      setAlgo2Level(8); // Victory Screen
      setIsTimerRunning(false);
      arky.triggerFinished();
      updateActiveLessonProgress('algo2', true, 8, updatedTotal, algo2ElapsedSeconds);
    }
  };

  const handleResetAlgo2 = () => {
    sounds.playClick();
    setAlgo2Score(0);
    setAlgo2Level(1);
    setAlgo2ElapsedSeconds(0);
    setIsTimerRunning(true);
    arky.triggerIdle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Text 2 (Mission 4B) level progression
  const handleText2CompleteLevel = (levelIndex: number, earnedScore: number) => {
    const updatedTotal = Math.min(100, Math.max(text2Score, earnedScore));
    setText2Score(updatedTotal);
    
    if (levelIndex < 7) {
      setText2Level(levelIndex + 1);
      arky.triggerSuccess();
    } else {
      setText2Level(8); // Victory Screen
      setIsTimerRunning(false);
      arky.triggerFinished();
      updateActiveLessonProgress('text2', true, 8, updatedTotal, text2ElapsedSeconds);
    }
  };

  const handleResetText2 = () => {
    sounds.playClick();
    setText2Score(0);
    setText2Level(1);
    setText2ElapsedSeconds(0);
    setIsTimerRunning(true);
    arky.triggerIdle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Text 1 (Mission 4A) level progression
  const handleText1CompleteLevel = (levelIndex: number, earnedScore: number) => {
    const updatedTotal = Math.min(100, Math.max(text1Score, earnedScore));
    setText1Score(updatedTotal);
    
    if (levelIndex < 7) {
      setText1Level(levelIndex + 1);
      arky.triggerSuccess();
    } else {
      setText1Level(8); // Victory Screen
      setIsTimerRunning(false);
      arky.triggerFinished();
      updateActiveLessonProgress('text1', true, 8, updatedTotal, text1ElapsedSeconds);
    }
  };

  const handleResetText1 = () => {
    sounds.playClick();
    setText1Score(0);
    setText1Level(1);
    setText1ElapsedSeconds(0);
    setIsTimerRunning(true);
    arky.triggerIdle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        onNavigateToCity={() => navigateToView('city')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 lg:p-8 pb-24 md:pb-8 flex flex-col gap-5 sm:gap-6">
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
        ) : view === 'city' ? (
          <CyberCityView
            studentName={studentName}
            onBackToCatalog={() => navigateToView('catalog')}
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
            onOpenCity={() => navigateToView('city')}
          />
        ) : (
          <>
            {/* Mission Evolution Progress */}
            <ProgressBar
              currentLevel={currentLevel}
              courseId={activeMission === 'hardware' ? 'hardware' : activeMission === 'internet1' ? 'internet1' : activeMission === 'internet2' ? 'internet2' : activeMission === 'text1' ? 'text1' : activeMission === 'text2' ? 'text2' : activeMission === 'algo1' ? 'algo1' : activeMission === 'algo2' ? 'algo2' : activeMission === 'scratch1' ? 'scratch1' : activeMission === 'scratch2' ? 'scratch2' : activeMission === 'g6_presentation1' ? 'g6_presentation1' : 'files'}
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

            {/* Level Views for TEXT 1 (MISSION 4A - PROCESORUL DE TEXT) */}
            {activeMission === 'text1' && (
              <div className="flex-1">
                {text1Level <= 7 ? (
                  <Module4AFlow
                    currentLevel={text1Level}
                    onCompleteLevel={handleText1CompleteLevel}
                  />
                ) : (
                  <VictoryScreen
                    score={text1Score}
                    maxScore={maxScore}
                    studentName={studentName}
                    elapsedSeconds={text1ElapsedSeconds}
                    courseId="text1"
                    onReset={handleResetText1}
                    onBackToCatalog={() => navigateToView('catalog')}
                  />
                )}
              </div>
            )}

            {/* Level Views for TEXT 2 (MISSION 4B - ELEMENTE GRAFICE, TABELE & PAGINARE) */}
            {activeMission === 'text2' && (
              <div className="flex-1">
                {text2Level <= 7 ? (
                  <Module4BFlow
                    currentLevel={text2Level}
                    onCompleteLevel={handleText2CompleteLevel}
                  />
                ) : (
                  <VictoryScreen
                    score={text2Score}
                    maxScore={maxScore}
                    studentName={studentName}
                    elapsedSeconds={text2ElapsedSeconds}
                    courseId="text2"
                    onReset={handleResetText2}
                    onBackToCatalog={() => navigateToView('catalog')}
                  />
                )}
              </div>
            )}

            {/* Level Views for ALGO 1 (MISSION 5A - NOȚIUNEA DE ALGORITM & ALGORITMI SECVENȚIALI) */}
            {activeMission === 'algo1' && (
              <div className="flex-1">
                {algo1Level <= 7 ? (
                  <Module5AFlow
                    currentLevel={algo1Level}
                    onCompleteLevel={handleAlgo1CompleteLevel}
                  />
                ) : (
                  <VictoryScreen
                    score={algo1Score}
                    maxScore={maxScore}
                    studentName={studentName}
                    elapsedSeconds={algo1ElapsedSeconds}
                    courseId="algo1"
                    onReset={handleResetAlgo1}
                    onBackToCatalog={() => navigateToView('catalog')}
                  />
                )}
              </div>
            )}

            {/* Level Views for ALGO 2 (MISSION 5B - STRUCTURI DECIZIONALE, DATE & SCHEME LOGICE) */}
            {activeMission === 'algo2' && (
              <div className="flex-1">
                {algo2Level <= 7 ? (
                  <Module5BFlow
                    currentLevel={algo2Level}
                    onCompleteLevel={handleAlgo2CompleteLevel}
                  />
                ) : (
                  <VictoryScreen
                    score={algo2Score}
                    maxScore={maxScore}
                    studentName={studentName}
                    elapsedSeconds={algo2ElapsedSeconds}
                    courseId="algo2"
                    onReset={handleResetAlgo2}
                    onBackToCatalog={() => navigateToView('catalog')}
                  />
                )}
              </div>
            )}

            {/* Level Views for SCRATCH 1 (MISSION 6A - PRIMII PAȘI, BLOCURI, VARIABILE & EXTENSIA PEN) */}
            {activeMission === 'scratch1' && (
              <div className="flex-1">
                {scratch1Level <= 7 ? (
                  <Module6AFlow
                    currentLevel={scratch1Level}
                    onCompleteLevel={handleScratch1CompleteLevel}
                  />
                ) : (
                  <VictoryScreen
                    score={scratch1Score}
                    maxScore={maxScore}
                    studentName={studentName}
                    elapsedSeconds={scratch1ElapsedSeconds}
                    courseId="scratch1"
                    onReset={handleResetScratch1}
                    onBackToCatalog={() => navigateToView('catalog')}
                  />
                )}
              </div>
            )}

            {/* Level Views for SCRATCH 2 (MISSION 6B - DECIZII, MUZICĂ, JOCURI & MAREA EVALUARE) */}
            {activeMission === 'scratch2' && (
              <div className="flex-1">
                {scratch2Level <= 7 ? (
                  <Module6BFlow
                    currentLevel={scratch2Level}
                    onCompleteLevel={handleScratch2CompleteLevel}
                  />
                ) : (
                  <VictoryScreen
                    score={scratch2Score}
                    maxScore={maxScore}
                    studentName={studentName}
                    elapsedSeconds={scratch2ElapsedSeconds}
                    courseId="scratch2"
                    onReset={handleResetScratch2}
                    onBackToCatalog={() => navigateToView('catalog')}
                  />
                )}
              </div>
            )}

            {/* Level Views for GRADE 6 - PRESENTATION 1 (MISSION 1A - PREZENTAREA & INTERFAȚA POWERPOINT) */}
            {activeMission === 'g6_presentation1' && (
              <div className="flex-1">
                {g6P1Level <= 7 ? (
                  <ModuleG6P1Flow
                    currentLevel={g6P1Level}
                    onCompleteLevel={handleG6P1CompleteLevel}
                  />
                ) : (
                  <VictoryScreen
                    score={g6P1Score}
                    maxScore={maxScore}
                    studentName={studentName}
                    elapsedSeconds={g6P1ElapsedSeconds}
                    courseId="g6_presentation1"
                    onReset={handleResetG6P1}
                    onBackToCatalog={() => navigateToView('catalog')}
                  />
                )}
              </div>
            )}

            {/* Level Views for GRADE 6 - PRESENTATION 2 (MISSION 1B - REALIZARE, DESIGN, ANIMAȚII & PUBLIC SPEAKING) */}
            {activeMission === 'g6_presentation2' && (
              <div className="flex-1">
                {g6P2Level <= 7 ? (
                  <ModuleG6P2Flow
                    currentLevel={g6P2Level}
                    onCompletePage={(earnedScore) => handleG6P2CompleteLevel(g6P2Level, earnedScore)}
                    studentName={studentName}
                    onRestartMission={handleResetG6P2}
                    onReturnToCatalog={() => navigateToView('catalog')}
                  />
                ) : (
                  <VictoryScreen
                    score={g6P2Score}
                    maxScore={maxScore}
                    studentName={studentName}
                    elapsedSeconds={g6P2ElapsedSeconds}
                    courseId="g6_presentation2"
                    onReset={handleResetG6P2}
                    onBackToCatalog={() => navigateToView('catalog')}
                  />
                )}
              </div>
            )}

            {/* Level Views for GRADE 6 - PAINT 3D (MISSION 2A - MODELARE 3D, ANCORE & EXPORT) */}
            {activeMission === 'g6_paint3d' && (
              <div className="flex-1">
                {g6P3Level <= 7 ? (
                  <ModuleG6Paint3DFlow
                    currentLevel={g6P3Level}
                    onCompletePage={(earnedScore) => handleG6P3CompleteLevel(g6P3Level, earnedScore)}
                    studentName={studentName}
                    onRestartMission={handleResetG6P3}
                    onReturnToCatalog={() => navigateToView('catalog')}
                  />
                ) : (
                  <VictoryScreen
                    score={g6P3Score}
                    maxScore={maxScore}
                    studentName={studentName}
                    elapsedSeconds={g6P3ElapsedSeconds}
                    courseId="g6_paint3d"
                    onReset={handleResetG6P3}
                    onBackToCatalog={() => navigateToView('catalog')}
                  />
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Bottom Stopwatch Bar (shown during active lesson) */}
      {view === 'lesson' && ((activeMission === 'hardware' && hwLevel <= 5) || (activeMission === 'files' && filesLevel <= 7) || (activeMission === 'internet1' && internet1Level <= 6) || (activeMission === 'internet2' && internet2Level <= 6) || (activeMission === 'text1' && text1Level <= 7) || (activeMission === 'text2' && text2Level <= 7) || (activeMission === 'algo1' && algo1Level <= 7) || (activeMission === 'algo2' && algo2Level <= 7) || (activeMission === 'scratch1' && scratch1Level <= 7) || (activeMission === 'scratch2' && scratch2Level <= 7) || (activeMission === 'g6_presentation1' && g6P1Level <= 7) || (activeMission === 'g6_presentation2' && g6P2Level <= 7) || (activeMission === 'g6_paint3d' && g6P3Level <= 7)) && (
        <div className="sticky bottom-20 md:bottom-3 z-30 flex justify-center px-4 pointer-events-none">
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
      <footer className="border-t border-slate-800/80 py-4 px-4 lg:px-6 pb-24 md:pb-5 bg-slate-950/60 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
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
    <ThemeProvider>
      <LanguageProvider>
        <HintProvider>
          <ArkyProvider>
            <GameContent />
            <MascotaArky />
          </ArkyProvider>
        </HintProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
