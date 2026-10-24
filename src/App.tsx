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
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { Footer } from './components/Footer';
import { LegalModal, LegalTabType } from './components/LegalModal';
import { CookieBanner } from './components/CookieBanner';

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

// Grade 6 Animation & VR Mission 2B (Unitatea 2 - Manual pag. 34-43)
import { ModuleG6AnimVRFlow } from './components/grade6/animation_vr/ModuleG6AnimVRFlow';

// Grade 6 Malware & Cyber Security Mission 3A (Unitatea 3 - Manual pag. 44-45)
import { ModuleG6M1Flow } from './components/grade6/malware/ModuleG6M1Flow';

// Grade 6 Email, Netiquette & Cloud Mission 3B (Unitatea 3 - Manual pag. 46-61)
import { ModuleG6EmailFlow } from './components/grade6/email/ModuleG6EmailFlow';

// Grade 6 Scratch Algo Mission 4A (Unitatea 4 - Manual pag. 62-75)
import { ModuleG6ScratchAlgo1Flow } from './components/grade6/scratch_algo1/ModuleG6ScratchAlgo1Flow';

// Grade 6 Scratch Algo Mission 4B (Unitatea 4 - Manual pag. 76-93)
import { ModuleG6ScratchAlgo2Flow } from './components/grade6/scratch_algo2/ModuleG6ScratchAlgo2Flow';

// Grade 7 Word Mission 1A (Unitatea 1 - Manual pag. 10-17)
import { ModuleG7Word1Flow } from './components/grade7/word1/ModuleG7Word1Flow';

// Grade 7 Word Mission 1B (Unitatea 1 - Manual pag. 18-27)
import { ModuleG7Word2Flow } from './components/grade7/word2/ModuleG7Word2Flow';

// Grade 7 Audio Mission 2A (Unitatea 2 - Manual pag. 28-35)
import { ModuleG7Audio1Flow } from './components/grade7/audio1/ModuleG7Audio1Flow';

// Grade 7 Video Mission 2B (Unitatea 2 - Manual pag. 36-47)
import { ModuleG7Video1Flow } from './components/grade7/video1/ModuleG7Video1Flow';

import { VictoryScreen } from './components/VictoryScreen';
import { TeacherPortal } from './components/TeacherPortal';
import { SuperAdminDashboard } from './components/superadmin/SuperAdminDashboard';
import { ArcadeHub } from './components/minigames/ArcadeHub';
import { DuelArena } from './components/DuelArena';
import { CyberCityView } from './components/cybercity/CyberCityView';
import { sounds } from './utils/audio';
import { Clock, Star, User } from 'lucide-react';
import { updateActiveLessonProgress, getActiveStudent } from './lib/studentAuthService';

function GameContent() {
  const { t } = useLanguage();
  const arky = useArky();
  const [view, setView] = useState<'catalog' | 'lesson' | 'teacher' | 'arcade' | 'duel' | 'city' | 'superadmin'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname.includes('/superadmin') || window.location.hash.includes('superadmin')) {
        return 'superadmin';
      }
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
    }
    return 'catalog';
  });

  // Current selected mission
  const [activeMission, setActiveMission] = useState<'hardware' | 'files' | 'internet1' | 'internet2' | 'text1' | 'text2' | 'algo1' | 'algo2' | 'scratch1' | 'scratch2' | 'g6_presentation1' | 'g6_presentation2' | 'g6_paint3d' | 'g6_anim3d' | 'g6_malware' | 'g6_email' | 'g6_scratch1' | 'g6_scratch2' | 'g7_word_a' | 'g7_word_b' | 'g7_audio_a' | 'g7_video_b' | null>(() => {
    try {
      const saved = localStorage.getItem('arkedo_active_mission');
      if (saved === 'hardware' || saved === 'files' || saved === 'internet1' || saved === 'internet2' || saved === 'text1' || saved === 'text2' || saved === 'algo1' || saved === 'algo2' || saved === 'scratch1' || saved === 'scratch2' || saved === 'g6_presentation1' || saved === 'g6_presentation2' || saved === 'g6_paint3d' || saved === 'g6_anim3d' || saved === 'g6_malware' || saved === 'g6_email' || saved === 'g6_scratch1' || saved === 'g6_scratch2' || saved === 'g7_word_a' || saved === 'g7_word_b' || saved === 'g7_audio_a' || saved === 'g7_video_b') {
        const isDone = localStorage.getItem(`arkedo_completed_${saved}`) === 'true';
        if (!isDone) return saved;
      }
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

  // Grade 6 Animation & VR Mission 2B progress (Unitatea 2 - Manual pag. 34-43)
  const [g6A1Level, setG6A1Level] = useState<GameLevel>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g6a1_level');
      if (saved) return Number(saved) as GameLevel;
    } catch {
      // Ignore
    }
    return 1;
  });
  const [g6A1Score, setG6A1Score] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g6a1_score');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });
  const [g6A1ElapsedSeconds, setG6A1ElapsedSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g6a1_elapsed');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });

  // Grade 6 Malware Mission 3A progress (Unitatea 3 - Manual pag. 44-45)
  const [g6M1Level, setG6M1Level] = useState<GameLevel>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g6m1_level');
      if (saved) return Number(saved) as GameLevel;
    } catch {
      // Ignore
    }
    return 1;
  });
  const [g6M1Score, setG6M1Score] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g6m1_score');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });
  const [g6M1ElapsedSeconds, setG6M1ElapsedSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g6m1_elapsed');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });

  // Grade 6 Email, Netiquette & Cloud Mission 3B progress (Unitatea 3 - Manual pag. 46-61)
  const [g6E1Level, setG6E1Level] = useState<GameLevel>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g6e1_level');
      if (saved) return Number(saved) as GameLevel;
    } catch {
      // Ignore
    }
    return 1;
  });
  const [g6E1Score, setG6E1Score] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g6e1_score');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });
  const [g6E1ElapsedSeconds, setG6E1ElapsedSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g6e1_elapsed');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });

  // Grade 6 Scratch Algo Mission 4A progress (Unitatea 4 - Manual pag. 62-75)
  const [g6S1Level, setG6S1Level] = useState<GameLevel>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g6s1_level');
      if (saved) return Number(saved) as GameLevel;
    } catch {
      // Ignore
    }
    return 1;
  });
  const [g6S1Score, setG6S1Score] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g6s1_score');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });
  const [g6S1ElapsedSeconds, setG6S1ElapsedSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g6s1_elapsed');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });

  // Grade 6 Scratch Algo Mission 4B progress (Unitatea 4 - Manual pag. 76-93)
  const [g6S2Level, setG6S2Level] = useState<GameLevel>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g6s2_level');
      if (saved) return Number(saved) as GameLevel;
    } catch {
      // Ignore
    }
    return 1;
  });
  const [g6S2Score, setG6S2Score] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g6s2_score');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });
  const [g6S2ElapsedSeconds, setG6S2ElapsedSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g6s2_elapsed');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });

  // Grade 7 Word Mission 1A progress (Unitatea 1 - Tehnoredactare Avansată)
  const [g7W1Level, setG7W1Level] = useState<GameLevel>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g7w1_level');
      if (saved) return Number(saved) as GameLevel;
    } catch {
      // Ignore
    }
    return 1;
  });
  const [g7W1Score, setG7W1Score] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g7w1_score');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });
  const [g7W1ElapsedSeconds, setG7W1ElapsedSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g7w1_elapsed');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });

  // Grade 7 Word Mission 1B progress (Unitatea 1 - Machetare de Pagină & Tipografie)
  const [g7W2Level, setG7W2Level] = useState<GameLevel>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g7w2_level');
      if (saved) return Number(saved) as GameLevel;
    } catch {
      // Ignore
    }
    return 1;
  });
  const [g7W2Score, setG7W2Score] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g7w2_score');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });
  const [g7W2ElapsedSeconds, setG7W2ElapsedSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g7w2_elapsed');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });

  // Grade 7 Audio Mission 2A progress (Unitatea 2 - Acustică Digitală & Studio WavePad)
  const [g7A1Level, setG7A1Level] = useState<GameLevel>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g7a1_level');
      if (saved) return Number(saved) as GameLevel;
    } catch {
      // Ignore
    }
    return 1;
  });
  const [g7A1Score, setG7A1Score] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g7a1_score');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });
  const [g7A1ElapsedSeconds, setG7A1ElapsedSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g7a1_elapsed');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });

  // Grade 7 Video Mission 2B progress (Unitatea 2 - Montaj Video Multitrack & VideoPad)
  const [g7V2Level, setG7V2Level] = useState<GameLevel>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g7v2_level');
      if (saved) return Number(saved) as GameLevel;
    } catch {
      // Ignore
    }
    return 1;
  });
  const [g7V2Score, setG7V2Score] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g7v2_score');
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 0;
  });
  const [g7V2ElapsedSeconds, setG7V2ElapsedSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkedo_g7v2_elapsed');
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

  // Legal & About Modal State
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTabType>('about');

  const openLegalModal = (tab: LegalTabType) => {
    setLegalTab(tab);
    setLegalModalOpen(true);
  };

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#despre' || hash === '#about') {
        openLegalModal('about');
      } else if (hash === '#gdpr' || hash === '#privacy' || hash === '#confidentialitate') {
        openLegalModal('privacy');
      } else if (hash === '#cookies' || hash === '#cookie') {
        openLegalModal('cookies');
      } else if (hash === '#termeni' || hash === '#terms') {
        openLegalModal('terms');
      } else if (hash === '#contact' || hash === '#feedback') {
        openLegalModal('contact');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

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
      if (activeMission && !isMissionCompleted(activeMission)) {
        localStorage.setItem('arkedo_active_mission', activeMission);
      } else {
        localStorage.removeItem('arkedo_active_mission');
      }
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
      localStorage.setItem('arkedo_g6a1_level', String(g6A1Level));
      localStorage.setItem('arkedo_g6a1_score', String(g6A1Score));
      localStorage.setItem('arkedo_g6a1_elapsed', String(g6A1ElapsedSeconds));
      localStorage.setItem('arkedo_g6m1_level', String(g6M1Level));
      localStorage.setItem('arkedo_g6m1_score', String(g6M1Score));
      localStorage.setItem('arkedo_g6m1_elapsed', String(g6M1ElapsedSeconds));
      localStorage.setItem('arkedo_g6e1_level', String(g6E1Level));
      localStorage.setItem('arkedo_g6e1_score', String(g6E1Score));
      localStorage.setItem('arkedo_g6e1_elapsed', String(g6E1ElapsedSeconds));
      localStorage.setItem('arkedo_g6s1_level', String(g6S1Level));
      localStorage.setItem('arkedo_g6s1_score', String(g6S1Score));
      localStorage.setItem('arkedo_g6s1_elapsed', String(g6S1ElapsedSeconds));
      localStorage.setItem('arkedo_g6s2_level', String(g6S2Level));
      localStorage.setItem('arkedo_g6s2_score', String(g6S2Score));
      localStorage.setItem('arkedo_g6s2_elapsed', String(g6S2ElapsedSeconds));
      localStorage.setItem('arkedo_g7w1_level', String(g7W1Level));
      localStorage.setItem('arkedo_g7w1_score', String(g7W1Score));
      localStorage.setItem('arkedo_g7w1_elapsed', String(g7W1ElapsedSeconds));
      localStorage.setItem('arkedo_g7w2_level', String(g7W2Level));
      localStorage.setItem('arkedo_g7w2_score', String(g7W2Score));
      localStorage.setItem('arkedo_g7w2_elapsed', String(g7W2ElapsedSeconds));
      localStorage.setItem('arkedo_g7a1_level', String(g7A1Level));
      localStorage.setItem('arkedo_g7a1_score', String(g7A1Score));
      localStorage.setItem('arkedo_g7a1_elapsed', String(g7A1ElapsedSeconds));
      localStorage.setItem('arkedo_g7v2_level', String(g7V2Level));
      localStorage.setItem('arkedo_g7v2_score', String(g7V2Score));
      localStorage.setItem('arkedo_g7v2_elapsed', String(g7V2ElapsedSeconds));
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
    g6P3Level, g6P3Score, g6P3ElapsedSeconds,
    g6A1Level, g6A1Score, g6A1ElapsedSeconds,
    g6M1Level, g6M1Score, g6M1ElapsedSeconds,
    g6E1Level, g6E1Score, g6E1ElapsedSeconds,
    g6S1Level, g6S1Score, g6S1ElapsedSeconds,
    g6S2Level, g6S2Score, g6S2ElapsedSeconds,
    g7W1Level, g7W1Score, g7W1ElapsedSeconds,
    g7W2Level, g7W2Score, g7W2ElapsedSeconds,
    g7A1Level, g7A1Score, g7A1ElapsedSeconds,
    g7V2Level, g7V2Score, g7V2ElapsedSeconds
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
    : activeMission === 'g6_anim3d'
    ? g6A1Level
    : activeMission === 'g6_malware'
    ? g6M1Level
    : activeMission === 'g6_email'
    ? g6E1Level
    : activeMission === 'g6_scratch1'
    ? g6S1Level
    : activeMission === 'g6_scratch2'
    ? g6S2Level
    : activeMission === 'g7_word_a'
    ? g7W1Level
    : activeMission === 'g7_word_b'
    ? g7W2Level
    : activeMission === 'g7_audio_a'
    ? g7A1Level
    : activeMission === 'g7_video_b'
    ? g7V2Level
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
    : activeMission === 'g6_anim3d'
    ? g6A1Score
    : activeMission === 'g6_malware'
    ? g6M1Score
    : activeMission === 'g6_email'
    ? g6E1Score
    : activeMission === 'g6_scratch1'
    ? g6S1Score
    : activeMission === 'g6_scratch2'
    ? g6S2Score
    : activeMission === 'g7_word_a'
    ? g7W1Score
    : activeMission === 'g7_word_b'
    ? g7W2Score
    : activeMission === 'g7_audio_a'
    ? g7A1Score
    : activeMission === 'g7_video_b'
    ? g7V2Score
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
    : activeMission === 'g6_anim3d'
    ? g6A1ElapsedSeconds
    : activeMission === 'g6_malware'
    ? g6M1ElapsedSeconds
    : activeMission === 'g6_email'
    ? g6E1ElapsedSeconds
    : activeMission === 'g6_scratch1'
    ? g6S1ElapsedSeconds
    : activeMission === 'g6_scratch2'
    ? g6S2ElapsedSeconds
    : activeMission === 'g7_word_a'
    ? g7W1ElapsedSeconds
    : activeMission === 'g7_word_b'
    ? g7W2ElapsedSeconds
    : activeMission === 'g7_audio_a'
    ? g7A1ElapsedSeconds
    : activeMission === 'g7_video_b'
    ? g7V2ElapsedSeconds
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
      (activeMission === 'g6_paint3d' && g6P3Level <= 7) ||
      (activeMission === 'g6_anim3d' && g6A1Level <= 7) ||
      (activeMission === 'g6_malware' && g6M1Level <= 7) ||
      (activeMission === 'g6_email' && g6E1Level <= 7) ||
      (activeMission === 'g6_scratch1' && g6S1Level <= 7) ||
      (activeMission === 'g6_scratch2' && g6S2Level <= 7) ||
      (activeMission === 'g7_word_a' && g7W1Level <= 7) ||
      (activeMission === 'g7_word_b' && g7W2Level <= 7) ||
      (activeMission === 'g7_audio_a' && g7A1Level <= 7) ||
      (activeMission === 'g7_video_b' && g7V2Level <= 7);

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
        } else if (activeMission === 'g6_anim3d') {
          setG6A1ElapsedSeconds((prev) => prev + 1);
        } else if (activeMission === 'g6_malware') {
          setG6M1ElapsedSeconds((prev) => prev + 1);
        } else if (activeMission === 'g6_email') {
          setG6E1ElapsedSeconds((prev) => prev + 1);
        } else if (activeMission === 'g6_scratch1') {
          setG6S1ElapsedSeconds((prev) => prev + 1);
        } else if (activeMission === 'g6_scratch2') {
          setG6S2ElapsedSeconds((prev) => prev + 1);
        } else if (activeMission === 'g7_word_a') {
          setG7W1ElapsedSeconds((prev) => prev + 1);
        } else if (activeMission === 'g7_word_b') {
          setG7W2ElapsedSeconds((prev) => prev + 1);
        } else if (activeMission === 'g7_audio_a') {
          setG7A1ElapsedSeconds((prev) => prev + 1);
        } else if (activeMission === 'g7_video_b') {
          setG7V2ElapsedSeconds((prev) => prev + 1);
        } else {
          setFilesElapsedSeconds((prev) => prev + 1);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, view, currentLevel, activeMission, hwLevel, filesLevel, internet1Level, internet2Level, text1Level, text2Level, algo1Level, algo2Level, scratch1Level, scratch2Level, g6P1Level, g6P2Level, g6P3Level, g6A1Level, g6M1Level, g6E1Level, g6S1Level, g6S2Level, g7W1Level, g7W2Level, g7A1Level, g7V2Level]);

  // Check if a mission is fully completed and finished
  const isMissionCompleted = (mId: string): boolean => {
    try {
      if (localStorage.getItem(`arkedo_completed_${mId}`) === 'true') return true;
    } catch {}

    if (mId === 'hardware' && (hwLevel >= 6 || hwScore >= 100)) return true;
    if (mId === 'files' && (filesLevel >= 8 || filesScore >= 100)) return true;
    if (mId === 'internet1' && (internet1Level >= 7 || internet1Score >= 100)) return true;
    if (mId === 'internet2' && (internet2Level >= 7 || internet2Score >= 100)) return true;
    if (mId === 'text1' && (text1Level >= 8 || text1Score >= 100)) return true;
    if (mId === 'text2' && (text2Level >= 8 || text2Score >= 100)) return true;
    if (mId === 'algo1' && (algo1Level >= 8 || algo1Score >= 100)) return true;
    if (mId === 'algo2' && (algo2Level >= 8 || algo2Score >= 100)) return true;
    if (mId === 'scratch1' && (scratch1Level >= 8 || scratch1Score >= 100)) return true;
    if (mId === 'scratch2' && (scratch2Level >= 8 || scratch2Score >= 100)) return true;
    if (mId === 'g6_presentation1' && (g6P1Level >= 8 || g6P1Score >= 100)) return true;
    if (mId === 'g6_presentation2' && (g6P2Level >= 8 || g6P2Score >= 100)) return true;
    if (mId === 'g6_paint3d' && (g6P3Level >= 8 || g6P3Score >= 100)) return true;
    if (mId === 'g6_anim3d' && (g6A1Level >= 8 || g6A1Score >= 100)) return true;
    if (mId === 'g6_malware' && (g6M1Level >= 8 || g6M1Score >= 100)) return true;
    if (mId === 'g6_email' && (g6E1Level >= 8 || g6E1Score >= 100)) return true;
    if (mId === 'g6_scratch1' && (g6S1Level >= 8 || g6S1Score >= 100)) return true;
    if (mId === 'g6_scratch2' && (g6S2Level >= 8 || g6S2Score >= 100)) return true;
    if (mId === 'g7_word_a' && (g7W1Level >= 8 || g7W1Score >= 100)) return true;
    if (mId === 'g7_word_b' && (g7W2Level >= 8 || g7W2Score >= 100)) return true;
    if (mId === 'g7_audio_a' && (g7A1Level >= 8 || g7A1Score >= 100)) return true;
    if (mId === 'g7_video_b' && (g7V2Level >= 8 || g7V2Score >= 100)) return true;

    const activeStudent = getActiveStudent();
    if (activeStudent?.lessonsProgress) {
      const lp = activeStudent.lessonsProgress;
      if (mId === 'hardware' && (lp.hardware?.completed || (lp.hardware?.score || 0) >= 100)) return true;
      if (mId === 'files' && (lp.files?.completed || (lp.files?.score || 0) >= 100)) return true;
      if (mId === 'internet1' && (lp.internet1?.completed || (lp.internet1?.score || 0) >= 100)) return true;
      if (mId === 'internet2' && (lp.internet2?.completed || (lp.internet2?.score || 0) >= 100)) return true;
      if (mId === 'text1' && (lp.text1?.completed || (lp.text1?.score || 0) >= 100)) return true;
      if (mId === 'text2' && (lp.text2?.completed || (lp.text2?.score || 0) >= 100)) return true;
      if (mId === 'algo1' && (lp.algo1?.completed || (lp.algo1?.score || 0) >= 100)) return true;
      if (mId === 'algo2' && (lp.algo2?.completed || (lp.algo2?.score || 0) >= 100)) return true;
      if (mId === 'scratch1' && (lp.scratch1?.completed || (lp.scratch1?.score || 0) >= 100)) return true;
      if (mId === 'scratch2' && (lp.scratch2?.completed || (lp.scratch2?.score || 0) >= 100)) return true;
      if (mId === 'g6_presentation1' && (lp.presentation1?.completed || (lp.presentation1?.score || 0) >= 100)) return true;
      if (mId === 'g6_presentation2' && (lp.presentation2?.completed || (lp.presentation2?.score || 0) >= 100)) return true;
      if (mId === 'g6_paint3d' && (lp.model3d1?.completed || (lp.model3d1?.score || 0) >= 100)) return true;
      if (mId === 'g6_anim3d' && (lp.model3d2?.completed || (lp.model3d2?.score || 0) >= 100)) return true;
      if (mId === 'g6_malware' && (lp.cyber6a?.completed || (lp.cyber6a?.score || 0) >= 100)) return true;
      if (mId === 'g6_email' && (lp.cyber6b?.completed || (lp.cyber6b?.score || 0) >= 100)) return true;
      if (mId === 'g6_scratch1' && (lp.scratch6a?.completed || (lp.scratch6a?.score || 0) >= 100)) return true;
      if (mId === 'g6_scratch2' && (lp.scratch6b?.completed || (lp.scratch6b?.score || 0) >= 100)) return true;
      if (mId === 'g7_word_a' && (lp.g7_word_a?.completed || (lp.g7_word_a?.score || 0) >= 100)) return true;
      if (mId === 'g7_word_b' && (lp.g7_word_b?.completed || (lp.g7_word_b?.score || 0) >= 100)) return true;
      if (mId === 'g7_audio_a' && (lp.g7_audio_a?.completed || (lp.g7_audio_a?.score || 0) >= 100)) return true;
      if (mId === 'g7_video_b' && (lp.g7_video_b?.completed || (lp.g7_video_b?.score || 0) >= 100)) return true;
    }

    return false;
  };

  const completedMissions: Record<string, boolean> = {
    hardware: isMissionCompleted('hardware'),
    files: isMissionCompleted('files'),
    internet1: isMissionCompleted('internet1'),
    internet2: isMissionCompleted('internet2'),
    text1: isMissionCompleted('text1'),
    text2: isMissionCompleted('text2'),
    algo1: isMissionCompleted('algo1'),
    algo2: isMissionCompleted('algo2'),
    scratch1: isMissionCompleted('scratch1'),
    scratch2: isMissionCompleted('scratch2'),
    g6_presentation1: isMissionCompleted('g6_presentation1'),
    g6_presentation2: isMissionCompleted('g6_presentation2'),
    g6_paint3d: isMissionCompleted('g6_paint3d'),
    g6_anim3d: isMissionCompleted('g6_anim3d'),
    g6_malware: isMissionCompleted('g6_malware'),
    g6_email: isMissionCompleted('g6_email'),
    g6_scratch1: isMissionCompleted('g6_scratch1'),
    g6_scratch2: isMissionCompleted('g6_scratch2'),
    g7_word_a: isMissionCompleted('g7_word_a'),
    g7_word_b: isMissionCompleted('g7_word_b'),
    g7_audio_a: isMissionCompleted('g7_audio_a'),
    g7_video_b: isMissionCompleted('g7_video_b'),
  };

  // Listen to browser navigation
  useEffect(() => {
    const handleUrlChange = () => {
      if (window.location.pathname.includes('/superadmin') || window.location.hash.includes('superadmin')) {
        setView('superadmin');
      } else if (window.location.pathname.includes('/profesor') || window.location.hash.includes('profesor')) {
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

  const navigateToView = (newView: 'catalog' | 'lesson' | 'teacher' | 'arcade' | 'duel' | 'city' | 'superadmin') => {
    setView(newView);
    if (newView === 'superadmin') {
      window.history.pushState({}, '', '/superadmin');
    } else if (newView === 'teacher') {
      window.history.pushState({}, '', '/profesor');
    } else if (newView === 'arcade') {
      window.history.pushState({}, '', '/arcade');
    } else if (newView === 'duel') {
      window.history.pushState({}, '', '/duel');
    } else if (newView === 'city') {
      window.history.pushState({}, '', '/oras');
    } else if (newView === 'catalog') {
      window.history.pushState({}, '', '/');
      // If the current active mission is completed, clear activeMission so it doesn't linger as in-progress!
      if (activeMission && isMissionCompleted(activeMission)) {
        setActiveMission(null);
        try {
          localStorage.removeItem('arkedo_active_mission');
        } catch {}
      }
    }
  };

  // When in catalog view, ensure completed missions do not linger as activeMission
  useEffect(() => {
    if (view === 'catalog' && activeMission && isMissionCompleted(activeMission)) {
      setActiveMission(null);
      try {
        localStorage.removeItem('arkedo_active_mission');
      } catch {}
    }
  }, [view, activeMission, hwLevel, filesLevel, internet1Level, internet2Level, text1Level, text2Level, algo1Level, algo2Level, scratch1Level, scratch2Level, g6P1Level, g6P2Level, g6P3Level, g7W1Level, g7W2Level, g7A1Level]);

  const handleToggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    sounds.setEnabled(newState);
    if (newState) sounds.playClick();
  };

  // Launch or resume a mission
  const handleSelectMission = (missionId: 'hardware' | 'files' | 'internet1' | 'internet2' | 'text1' | 'text2' | 'algo1' | 'algo2' | 'scratch1' | 'scratch2' | 'g6_presentation1' | 'g6_presentation2' | 'g6_paint3d' | 'g6_anim3d' | 'g6_malware' | 'g6_email' | 'g6_scratch1' | 'g6_scratch2' | 'g7_word_a' | 'g7_word_b' | 'g7_audio_a') => {
    setActiveMission(missionId);
    setView('lesson');
    setIsTimerRunning(true);
    sounds.playClick();
    arky.triggerIdle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetActiveMission = () => {
    if (activeMission) {
      try {
        localStorage.removeItem(`arkedo_completed_${activeMission}`);
      } catch {}
    }
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
    } else if (activeMission === 'g6_anim3d') {
      setG6A1Level(1);
      setG6A1Score(0);
      setG6A1ElapsedSeconds(0);
    } else if (activeMission === 'g6_malware') {
      setG6M1Level(1);
      setG6M1Score(0);
      setG6M1ElapsedSeconds(0);
    } else if (activeMission === 'g6_email') {
      setG6E1Level(1);
      setG6E1Score(0);
      setG6E1ElapsedSeconds(0);
    } else if (activeMission === 'g6_scratch1') {
      setG6S1Level(1);
      setG6S1Score(0);
      setG6S1ElapsedSeconds(0);
    } else if (activeMission === 'g6_scratch2') {
      setG6S2Level(1);
      setG6S2Score(0);
      setG6S2ElapsedSeconds(0);
    } else if (activeMission === 'g7_word_a') {
      handleResetG7W1();
      return;
    } else if (activeMission === 'g7_word_b') {
      handleResetG7W2();
      return;
    } else if (activeMission === 'g7_audio_a') {
      handleResetG7A1();
      return;
    } else if (activeMission === 'g7_video_b') {
      handleResetG7V2();
      return;
    }
    arky.triggerIdle();
  };

  // Grade 7 Word Mission 1A (Unitatea 1) level progression
  const handleG7W1CompleteLevel = (levelIndex: number, earnedScore: number) => {
    if (levelIndex < 7) {
      const updatedTotal = Math.min(100, Math.max(g7W1Score, earnedScore));
      setG7W1Score(updatedTotal);
      setG7W1Level((levelIndex + 1) as GameLevel);
      try {
        localStorage.setItem('arkedo_g7w1_level', String(levelIndex + 1));
        localStorage.setItem('arkedo_g7w1_score', String(updatedTotal));
      } catch {}
      arky.triggerSuccess();
    } else {
      const finalScore = Math.min(100, Math.max(0, earnedScore));
      setG7W1Score(finalScore);
      setG7W1Level(8 as GameLevel); // Victory Screen
      setIsTimerRunning(false);
      arky.triggerFinished();
      try {
        localStorage.setItem('arkedo_g7w1_level', '8');
        localStorage.setItem('arkedo_g7w1_score', String(finalScore));
        localStorage.setItem('arkedo_completed_g7_word_a', 'true');
      } catch {}
      updateActiveLessonProgress('g7_word_a', true, 8, finalScore, g7W1ElapsedSeconds);
    }
  };

  const handleResetG7W1 = () => {
    sounds.playClick();
    setG7W1Score(0);
    setG7W1Level(1);
    setG7W1ElapsedSeconds(0);
    try {
      localStorage.removeItem('arkedo_completed_g7_word_a');
      localStorage.setItem('arkedo_g7w1_level', '1');
      localStorage.setItem('arkedo_g7w1_score', '0');
      localStorage.setItem('arkedo_g7w1_elapsed', '0');
    } catch {}
    setIsTimerRunning(true);
    arky.triggerIdle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Grade 7 Word Mission 1B (Unitatea 1 - Machetare & Tipografie) level progression
  const handleG7W2CompleteLevel = (levelIndex: number, earnedScore: number) => {
    if (levelIndex < 7) {
      const updatedTotal = Math.min(100, Math.max(g7W2Score, earnedScore));
      setG7W2Score(updatedTotal);
      setG7W2Level((levelIndex + 1) as GameLevel);
      try {
        localStorage.setItem('arkedo_g7w2_level', String(levelIndex + 1));
        localStorage.setItem('arkedo_g7w2_score', String(updatedTotal));
      } catch {}
      arky.triggerSuccess();
    } else {
      const finalScore = Math.min(100, Math.max(0, earnedScore));
      setG7W2Score(finalScore);
      setG7W2Level(8 as GameLevel); // Victory Screen
      setIsTimerRunning(false);
      arky.triggerFinished();
      try {
        localStorage.setItem('arkedo_g7w2_level', '8');
        localStorage.setItem('arkedo_g7w2_score', String(finalScore));
        localStorage.setItem('arkedo_completed_g7_word_b', 'true');
      } catch {}
      updateActiveLessonProgress('g7_word_b', true, 8, finalScore, g7W2ElapsedSeconds);
    }
  };

  const handleResetG7W2 = () => {
    sounds.playClick();
    setG7W2Score(0);
    setG7W2Level(1);
    setG7W2ElapsedSeconds(0);
    try {
      localStorage.removeItem('arkedo_completed_g7_word_b');
      localStorage.setItem('arkedo_g7w2_level', '1');
      localStorage.setItem('arkedo_g7w2_score', '0');
      localStorage.setItem('arkedo_g7w2_elapsed', '0');
    } catch {}
    setIsTimerRunning(true);
    arky.triggerIdle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Grade 7 Audio Mission 2A (Unitatea 2 - Acustică Digitală & Studio WavePad) level progression
  const handleG7A1CompleteLevel = (levelIndex: number, earnedScore: number) => {
    if (levelIndex < 7) {
      const updatedTotal = Math.min(100, Math.max(g7A1Score, earnedScore));
      setG7A1Score(updatedTotal);
      setG7A1Level((levelIndex + 1) as GameLevel);
      try {
        localStorage.setItem('arkedo_g7a1_level', String(levelIndex + 1));
        localStorage.setItem('arkedo_g7a1_score', String(updatedTotal));
      } catch {}
      arky.triggerSuccess();
    } else {
      const finalScore = Math.min(100, Math.max(0, earnedScore));
      setG7A1Score(finalScore);
      setG7A1Level(8 as GameLevel); // Victory Screen
      setIsTimerRunning(false);
      arky.triggerFinished();
      try {
        localStorage.setItem('arkedo_g7a1_level', '8');
        localStorage.setItem('arkedo_g7a1_score', String(finalScore));
        localStorage.setItem('arkedo_completed_g7_audio_a', 'true');
      } catch {}
      updateActiveLessonProgress('g7_audio_a', true, 8, finalScore, g7A1ElapsedSeconds);
    }
  };

  const handleResetG7A1 = () => {
    sounds.playClick();
    setG7A1Score(0);
    setG7A1Level(1);
    setG7A1ElapsedSeconds(0);
    try {
      localStorage.removeItem('arkedo_completed_g7_audio_a');
      localStorage.setItem('arkedo_g7a1_level', '1');
      localStorage.setItem('arkedo_g7a1_score', '0');
      localStorage.setItem('arkedo_g7a1_elapsed', '0');
    } catch {}
    setIsTimerRunning(true);
    arky.triggerIdle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Grade 7 Video Mission 2B (Unitatea 2 - Montaj Video Multitrack & VideoPad) level progression
  const handleG7V2CompleteLevel = (levelIndex: number, earnedScore: number) => {
    if (levelIndex < 7) {
      const updatedTotal = Math.min(100, Math.max(g7V2Score, earnedScore));
      setG7V2Score(updatedTotal);
      setG7V2Level((levelIndex + 1) as GameLevel);
      try {
        localStorage.setItem('arkedo_g7v2_level', String(levelIndex + 1));
        localStorage.setItem('arkedo_g7v2_score', String(updatedTotal));
      } catch {}
      arky.triggerSuccess();
    } else {
      const finalScore = Math.min(100, Math.max(0, earnedScore));
      setG7V2Score(finalScore);
      setG7V2Level(8 as GameLevel); // Victory Screen
      setIsTimerRunning(false);
      arky.triggerFinished();
      try {
        localStorage.setItem('arkedo_g7v2_level', '8');
        localStorage.setItem('arkedo_g7v2_score', String(finalScore));
        localStorage.setItem('arkedo_completed_g7_video_b', 'true');
      } catch {}
      updateActiveLessonProgress('g7_video_b', true, 8, finalScore, g7V2ElapsedSeconds);
    }
  };

  const handleResetG7V2 = () => {
    sounds.playClick();
    setG7V2Score(0);
    setG7V2Level(1);
    setG7V2ElapsedSeconds(0);
    try {
      localStorage.removeItem('arkedo_completed_g7_video_b');
      localStorage.setItem('arkedo_g7v2_level', '1');
      localStorage.setItem('arkedo_g7v2_score', '0');
      localStorage.setItem('arkedo_g7v2_elapsed', '0');
    } catch {}
    setIsTimerRunning(true);
    arky.triggerIdle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Grade 6 Presentation 1 (Mission 1A) level progression
  const handleG6P1CompleteLevel = (levelIndex: number, earnedScore: number) => {
    if (levelIndex < 7) {
      const updatedTotal = Math.min(100, Math.max(g6P1Score, earnedScore));
      setG6P1Score(updatedTotal);
      setG6P1Level(levelIndex + 1);
      arky.triggerSuccess();
    } else {
      const finalScore = Math.min(100, Math.max(0, earnedScore));
      setG6P1Score(finalScore);
      setG6P1Level(8); // Victory Screen
      setIsTimerRunning(false);
      arky.triggerFinished();
      try {
        localStorage.setItem('arkedo_completed_g6_presentation1', 'true');
      } catch {}
      updateActiveLessonProgress('presentation1', true, 8, finalScore, g6P1ElapsedSeconds);
    }
  };

  const handleResetG6P1 = () => {
    sounds.playClick();
    setG6P1Score(0);
    setG6P1Level(1);
    setG6P1ElapsedSeconds(0);
    try {
      localStorage.removeItem('arkedo_completed_g6_presentation1');
    } catch {}
    setIsTimerRunning(true);
    arky.triggerIdle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Grade 6 Scratch Algo (Mission 4A) level progression
  const handleG6S1CompleteLevel = (levelIndex: number, earnedScore: number) => {
    if (levelIndex < 7) {
      const updatedTotal = Math.min(100, Math.max(g6S1Score, earnedScore));
      setG6S1Score(updatedTotal);
      setG6S1Level((levelIndex + 1) as GameLevel);
      arky.triggerSuccess();
    } else {
      const finalScore = Math.min(100, Math.max(0, earnedScore));
      setG6S1Score(finalScore);
      setG6S1Level(8 as GameLevel); // Victory Screen
      setIsTimerRunning(false);
      arky.triggerFinished();
      try {
        localStorage.setItem('arkedo_completed_g6_scratch1', 'true');
      } catch {}
      updateActiveLessonProgress('scratch6a', true, 8, finalScore, g6S1ElapsedSeconds);
    }
  };

  const handleResetG6S1 = () => {
    sounds.playClick();
    setG6S1Score(0);
    setG6S1Level(1);
    setG6S1ElapsedSeconds(0);
    try {
      localStorage.removeItem('arkedo_completed_g6_scratch1');
    } catch {}
    setIsTimerRunning(true);
    arky.triggerIdle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Grade 6 Scratch Algo (Mission 4B) level progression
  const handleG6S2CompleteLevel = (levelIndex: number, earnedScore: number) => {
    if (levelIndex < 7) {
      const updatedTotal = Math.min(100, Math.max(g6S2Score, earnedScore));
      setG6S2Score(updatedTotal);
      setG6S2Level((levelIndex + 1) as GameLevel);
      arky.triggerSuccess();
    } else {
      const finalScore = Math.min(100, Math.max(0, earnedScore));
      setG6S2Score(finalScore);
      setG6S2Level(8 as GameLevel); // Victory Screen
      setIsTimerRunning(false);
      arky.triggerFinished();
      try {
        localStorage.setItem('arkedo_completed_g6_scratch2', 'true');
      } catch {}
      updateActiveLessonProgress('scratch6b', true, 8, finalScore, g6S2ElapsedSeconds);
    }
  };

  const handleResetG6S2 = () => {
    sounds.playClick();
    setG6S2Score(0);
    setG6S2Level(1);
    setG6S2ElapsedSeconds(0);
    try {
      localStorage.removeItem('arkedo_completed_g6_scratch2');
    } catch {}
    setIsTimerRunning(true);
    arky.triggerIdle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Grade 6 Presentation 2 (Mission 1B) level progression
  const handleG6P2CompleteLevel = (levelIndex: number, earnedScore: number) => {
    if (levelIndex < 7) {
      const updatedTotal = Math.min(100, Math.max(g6P2Score, earnedScore));
      setG6P2Score(updatedTotal);
      setG6P2Level(levelIndex + 1);
      arky.triggerSuccess();
    } else {
      const finalScore = Math.min(100, Math.max(0, earnedScore));
      setG6P2Score(finalScore);
      setG6P2Level(8); // Victory Screen
      setIsTimerRunning(false);
      arky.triggerFinished();
      try {
        localStorage.setItem('arkedo_completed_g6_presentation2', 'true');
      } catch {}
      updateActiveLessonProgress('presentation2', true, 8, finalScore, g6P2ElapsedSeconds);
    }
  };

  const handleResetG6P2 = () => {
    sounds.playClick();
    setG6P2Score(0);
    setG6P2Level(1);
    setG6P2ElapsedSeconds(0);
    try {
      localStorage.removeItem('arkedo_completed_g6_presentation2');
    } catch {}
    setIsTimerRunning(true);
    arky.triggerIdle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Grade 6 Paint 3D (Mission 2A) level progression
  const handleG6P3CompleteLevel = (levelIndex: number, earnedScore: number) => {
    if (levelIndex < 7) {
      const updatedTotal = Math.min(100, Math.max(g6P3Score, earnedScore));
      setG6P3Score(updatedTotal);
      setG6P3Level(levelIndex + 1);
      arky.triggerSuccess();
    } else {
      const finalScore = Math.min(100, Math.max(0, earnedScore));
      setG6P3Score(finalScore);
      setG6P3Level(8); // Victory Screen
      setIsTimerRunning(false);
      arky.triggerFinished();
      try {
        localStorage.setItem('arkedo_completed_g6_paint3d', 'true');
      } catch {}
      updateActiveLessonProgress('model3d1', true, 8, finalScore, g6P3ElapsedSeconds);
    }
  };

  const handleResetG6P3 = () => {
    sounds.playClick();
    setG6P3Score(0);
    setG6P3Level(1);
    setG6P3ElapsedSeconds(0);
    try {
      localStorage.removeItem('arkedo_completed_g6_paint3d');
    } catch {}
    setIsTimerRunning(true);
    arky.triggerIdle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Grade 6 Animation & VR (Mission 2B) level progression
  const handleG6A1CompleteLevel = (levelIndex: number, earnedScore: number) => {
    if (levelIndex < 7) {
      const updatedTotal = Math.min(100, Math.max(g6A1Score, earnedScore));
      setG6A1Score(updatedTotal);
      setG6A1Level((levelIndex + 1) as GameLevel);
      arky.triggerSuccess();
    } else {
      const finalScore = Math.min(100, Math.max(0, earnedScore));
      setG6A1Score(finalScore);
      setG6A1Level(8 as GameLevel); // Victory Screen
      setIsTimerRunning(false);
      arky.triggerFinished();
      try {
        localStorage.setItem('arkedo_completed_g6_anim3d', 'true');
      } catch {}
      updateActiveLessonProgress('model3d2', true, 8, finalScore, g6A1ElapsedSeconds);
    }
  };

  const handleResetG6A1 = () => {
    sounds.playClick();
    setG6A1Score(0);
    setG6A1Level(1);
    setG6A1ElapsedSeconds(0);
    try {
      localStorage.removeItem('arkedo_completed_g6_anim3d');
    } catch {}
    setIsTimerRunning(true);
    arky.triggerIdle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Grade 6 Malware & Cybersecurity (Mission 3A) level progression
  const handleG6M1CompleteLevel = (levelIndex: number, earnedScore: number) => {
    if (levelIndex < 7) {
      const updatedTotal = Math.min(100, Math.max(g6M1Score, earnedScore));
      setG6M1Score(updatedTotal);
      setG6M1Level((levelIndex + 1) as GameLevel);
      arky.triggerSuccess();
    } else {
      const finalScore = Math.min(100, Math.max(0, earnedScore));
      setG6M1Score(finalScore);
      setG6M1Level(8 as GameLevel); // Victory Screen
      setIsTimerRunning(false);
      arky.triggerFinished();
      try {
        localStorage.setItem('arkedo_completed_g6_malware', 'true');
      } catch {}
      updateActiveLessonProgress('cyber6a', true, 8, finalScore, g6M1ElapsedSeconds);
    }
  };

  const handleResetG6M1 = () => {
    sounds.playClick();
    setG6M1Score(0);
    setG6M1Level(1);
    setG6M1ElapsedSeconds(0);
    try {
      localStorage.removeItem('arkedo_completed_g6_malware');
    } catch {}
    setIsTimerRunning(true);
    arky.triggerIdle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Grade 6 Email, Netiquette & Cloud (Mission 3B) level progression
  const handleG6E1CompleteLevel = (levelIndex: number, earnedScore: number) => {
    if (levelIndex < 7) {
      const updatedTotal = Math.min(100, Math.max(g6E1Score, earnedScore));
      setG6E1Score(updatedTotal);
      setG6E1Level((levelIndex + 1) as GameLevel);
      arky.triggerSuccess();
    } else {
      const finalScore = Math.min(100, Math.max(0, earnedScore));
      setG6E1Score(finalScore);
      setG6E1Level(8 as GameLevel); // Victory Screen
      setIsTimerRunning(false);
      arky.triggerFinished();
      try {
        localStorage.setItem('arkedo_completed_g6_email', 'true');
      } catch {}
      updateActiveLessonProgress('cyber6b', true, 8, finalScore, g6E1ElapsedSeconds);
    }
  };

  const handleResetG6E1 = () => {
    sounds.playClick();
    setG6E1Score(0);
    setG6E1Level(1);
    setG6E1ElapsedSeconds(0);
    try {
      localStorage.removeItem('arkedo_completed_g6_email');
    } catch {}
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
      try {
        localStorage.setItem('arkedo_completed_scratch1', 'true');
      } catch {}
      updateActiveLessonProgress('scratch1', true, 8, updatedTotal, scratch1ElapsedSeconds);
    }
  };

  const handleResetScratch1 = () => {
    sounds.playClick();
    setScratch1Score(0);
    setScratch1Level(1);
    setScratch1ElapsedSeconds(0);
    try {
      localStorage.removeItem('arkedo_completed_scratch1');
    } catch {}
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
      try {
        localStorage.setItem('arkedo_completed_scratch2', 'true');
      } catch {}
      updateActiveLessonProgress('scratch2', true, 8, updatedTotal, scratch2ElapsedSeconds);
    }
  };

  const handleResetScratch2 = () => {
    sounds.playClick();
    setScratch2Score(0);
    setScratch2Level(1);
    setScratch2ElapsedSeconds(0);
    try {
      localStorage.removeItem('arkedo_completed_scratch2');
    } catch {}
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
      try {
        localStorage.setItem('arkedo_completed_algo1', 'true');
      } catch {}
      updateActiveLessonProgress('algo1', true, 8, updatedTotal, algo1ElapsedSeconds);
    }
  };

  const handleResetAlgo1 = () => {
    sounds.playClick();
    setAlgo1Score(0);
    setAlgo1Level(1);
    setAlgo1ElapsedSeconds(0);
    try {
      localStorage.removeItem('arkedo_completed_algo1');
    } catch {}
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
      try {
        localStorage.setItem('arkedo_completed_algo2', 'true');
      } catch {}
      updateActiveLessonProgress('algo2', true, 8, updatedTotal, algo2ElapsedSeconds);
    }
  };

  const handleResetAlgo2 = () => {
    sounds.playClick();
    setAlgo2Score(0);
    setAlgo2Level(1);
    setAlgo2ElapsedSeconds(0);
    try {
      localStorage.removeItem('arkedo_completed_algo2');
    } catch {}
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
      try {
        localStorage.setItem('arkedo_completed_text2', 'true');
      } catch {}
      updateActiveLessonProgress('text2', true, 8, updatedTotal, text2ElapsedSeconds);
    }
  };

  const handleResetText2 = () => {
    sounds.playClick();
    setText2Score(0);
    setText2Level(1);
    setText2ElapsedSeconds(0);
    try {
      localStorage.removeItem('arkedo_completed_text2');
    } catch {}
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
      try {
        localStorage.setItem('arkedo_completed_text1', 'true');
      } catch {}
      updateActiveLessonProgress('text1', true, 8, updatedTotal, text1ElapsedSeconds);
    }
  };

  const handleResetText1 = () => {
    sounds.playClick();
    setText1Score(0);
    setText1Level(1);
    setText1ElapsedSeconds(0);
    try {
      localStorage.removeItem('arkedo_completed_text1');
    } catch {}
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
      try {
        localStorage.setItem('arkedo_completed_internet1', 'true');
      } catch {}
      updateActiveLessonProgress('internet1', true, 7, updatedTotal, internet1ElapsedSeconds);
    }
  };

  const handleResetInternet1 = () => {
    sounds.playClick();
    setInternet1Score(0);
    setInternet1Level(1);
    setInternet1ElapsedSeconds(0);
    try {
      localStorage.removeItem('arkedo_completed_internet1');
    } catch {}
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
      try {
        localStorage.setItem('arkedo_completed_internet2', 'true');
      } catch {}
      updateActiveLessonProgress('internet2', true, 7, updatedTotal, internet2ElapsedSeconds);
    }
  };

  const handleResetInternet2 = () => {
    sounds.playClick();
    setInternet2Score(0);
    setInternet2Level(1);
    setInternet2ElapsedSeconds(0);
    try {
      localStorage.removeItem('arkedo_completed_internet2');
    } catch {}
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
    try {
      localStorage.setItem('arkedo_completed_hardware', 'true');
    } catch {}
    updateActiveLessonProgress('hardware', true, 6, 100, hwElapsedSeconds);
  };

  const handleResetHardware = () => {
    sounds.playClick();
    setHwScore(0);
    setHwLevel(1);
    setHwElapsedSeconds(0);
    try {
      localStorage.removeItem('arkedo_completed_hardware');
    } catch {}
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
    try {
      localStorage.setItem('arkedo_completed_files', 'true');
    } catch {}
    updateActiveLessonProgress('files', true, 8, 100, filesElapsedSeconds);
  };

  const handleResetFiles = () => {
    sounds.playClick();
    setFilesScore(0);
    setFilesLevel(1);
    setFilesElapsedSeconds(0);
    try {
      localStorage.removeItem('arkedo_completed_files');
    } catch {}
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
        onNavigateToSuperAdmin={() => navigateToView('superadmin')}
        onNavigateToArcade={() => navigateToView('arcade')}
        onNavigateToDuel={() => navigateToView('duel')}
        onNavigateToCity={() => navigateToView('city')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 lg:p-8 pb-24 md:pb-8 flex flex-col gap-5 sm:gap-6">
        {view === 'superadmin' ? (
          <SuperAdminDashboard
            onBackToHome={() => navigateToView('catalog')}
            onOpenTeacherPortal={() => navigateToView('teacher')}
          />
        ) : view === 'teacher' ? (
          <TeacherPortal 
            onBackToHome={() => navigateToView('catalog')} 
            onOpenSuperAdmin={() => navigateToView('superadmin')}
          />
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
            activeMissionId={activeMission && !isMissionCompleted(activeMission) ? activeMission : null}
            activeMissionLevel={currentLevel}
            activeMissionScore={currentScore}
            completedMissions={completedMissions}
            elapsedSeconds={currentElapsedSeconds}
            onResetActiveMission={handleResetActiveMission}
            onOpenTeacherPortal={() => navigateToView('teacher')}
            onOpenSuperAdmin={() => navigateToView('superadmin')}
            onOpenArcade={() => navigateToView('arcade')}
            onOpenDuel={() => navigateToView('duel')}
            onOpenCity={() => navigateToView('city')}
          />
        ) : (
          <>
            {/* Mission Evolution Progress */}
            <ProgressBar
              currentLevel={currentLevel}
              courseId={activeMission || 'files'}
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

            {/* Level Views for GRADE 6 - ANIMATION & VR (MISSION 2B - TOONTASTIC, CADRE 24 FPS & COSPACES 360°) */}
            {activeMission === 'g6_anim3d' && (
              <div className="flex-1">
                {g6A1Level <= 7 ? (
                  <ModuleG6AnimVRFlow
                    currentLevel={g6A1Level}
                    onCompletePage={(earnedScore) => handleG6A1CompleteLevel(g6A1Level, earnedScore)}
                    studentName={studentName}
                    onRestartMission={handleResetG6A1}
                    onReturnToCatalog={() => navigateToView('catalog')}
                  />
                ) : (
                  <VictoryScreen
                    score={g6A1Score}
                    maxScore={maxScore}
                    studentName={studentName}
                    elapsedSeconds={g6A1ElapsedSeconds}
                    courseId="g6_anim3d"
                    onReset={handleResetG6A1}
                    onBackToCatalog={() => navigateToView('catalog')}
                  />
                )}
              </div>
            )}

            {/* Level Views for GRADE 6 - MALWARE (MISSION 3A - AMENINȚĂRI MALWARE & SECURITATE CIBERNETICĂ) */}
            {activeMission === 'g6_malware' && (
              <div className="flex-1">
                {g6M1Level <= 7 ? (
                  <ModuleG6M1Flow
                    currentLevel={g6M1Level}
                    onCompletePage={(earnedScore) => handleG6M1CompleteLevel(g6M1Level, earnedScore)}
                    studentName={studentName}
                    onRestartMission={handleResetG6M1}
                    onReturnToCatalog={() => navigateToView('catalog')}
                  />
                ) : (
                  <VictoryScreen
                    score={g6M1Score}
                    maxScore={maxScore}
                    studentName={studentName}
                    elapsedSeconds={g6M1ElapsedSeconds}
                    courseId="g6_malware"
                    onReset={handleResetG6M1}
                    onBackToCatalog={() => navigateToView('catalog')}
                  />
                )}
              </div>
            )}

            {/* Level Views for GRADE 6 - EMAIL & NETIQUETTE (MISSION 3B - E-MAIL, NETICHETĂ & CLOUD) */}
            {activeMission === 'g6_email' && (
              <div className="flex-1">
                {g6E1Level <= 7 ? (
                  <ModuleG6EmailFlow
                    currentLevel={g6E1Level}
                    onCompletePage={(earnedScore) => handleG6E1CompleteLevel(g6E1Level, earnedScore)}
                    studentName={studentName}
                    onRestartMission={handleResetG6E1}
                    onReturnToCatalog={() => navigateToView('catalog')}
                  />
                ) : (
                  <VictoryScreen
                    score={g6E1Score}
                    maxScore={maxScore}
                    studentName={studentName}
                    elapsedSeconds={g6E1ElapsedSeconds}
                    courseId="g6_email"
                    onReset={handleResetG6E1}
                    onBackToCatalog={() => navigateToView('catalog')}
                  />
                )}
              </div>
            )}

            {/* Level Views for GRADE 6 - SCRATCH ALGO 1 (MISSION 4A - BUCLE CONDIȚIONATE & ALGORITMI) */}
            {activeMission === 'g6_scratch1' && (
              <div className="flex-1">
                {g6S1Level <= 7 ? (
                  <ModuleG6ScratchAlgo1Flow
                    currentLevel={g6S1Level}
                    onCompletePage={(earnedScore) => handleG6S1CompleteLevel(g6S1Level, earnedScore)}
                    studentName={studentName}
                    onRestartMission={handleResetG6S1}
                    onReturnToCatalog={() => navigateToView('catalog')}
                  />
                ) : (
                  <VictoryScreen
                    score={g6S1Score}
                    maxScore={maxScore}
                    studentName={studentName}
                    elapsedSeconds={g6S1ElapsedSeconds}
                    courseId="g6_scratch1"
                    onReset={handleResetG6S1}
                    onBackToCatalog={() => navigateToView('catalog')}
                  />
                )}
              </div>
            )}

            {/* Level Views for GRADE 6 - SCRATCH ALGO 2 (MISSION 4B - BUCLE CU CONTOR, MINECRAFT 3D & ABSOLVIRE) */}
            {activeMission === 'g6_scratch2' && (
              <div className="flex-1">
                {g6S2Level <= 7 ? (
                  <ModuleG6ScratchAlgo2Flow
                    currentLevel={g6S2Level}
                    onCompletePage={(earnedScore) => handleG6S2CompleteLevel(g6S2Level, earnedScore)}
                    studentName={studentName}
                    onRestartMission={handleResetG6S2}
                    onReturnToCatalog={() => navigateToView('catalog')}
                  />
                ) : (
                  <VictoryScreen
                    score={g6S2Score}
                    maxScore={maxScore}
                    studentName={studentName}
                    elapsedSeconds={g6S2ElapsedSeconds}
                    courseId="g6_scratch2"
                    onReset={handleResetG6S2}
                    onBackToCatalog={() => navigateToView('catalog')}
                  />
                )}
              </div>
            )}
            {/* Level Views for GRADE 7 - WORD MISSION 1A (TEHNOREDACTARE AVANSATĂ & TIPOGRAFIE ROMÂNEASCĂ) */}
            {activeMission === 'g7_word_a' && (
              <div className="flex-1">
                {g7W1Level <= 7 ? (
                  <ModuleG7Word1Flow
                    currentLevel={g7W1Level}
                    onCompletePage={(earnedScore) => handleG7W1CompleteLevel(g7W1Level, earnedScore)}
                    studentName={studentName}
                    onRestartMission={handleResetG7W1}
                    onReturnToCatalog={() => navigateToView('catalog')}
                  />
                ) : (
                  <VictoryScreen
                    score={g7W1Score}
                    maxScore={maxScore}
                    studentName={studentName}
                    elapsedSeconds={g7W1ElapsedSeconds}
                    courseId="g7_word_a"
                    onReset={handleResetG7W1}
                    onBackToCatalog={() => navigateToView('catalog')}
                  />
                )}
              </div>
            )}

            {/* Level Views for GRADE 7 - WORD MISSION 1B (MACHETARE DE PAGINĂ & DOCUMENTE STRUCTURATE) */}
            {activeMission === 'g7_word_b' && (
              <div className="flex-1">
                {g7W2Level <= 7 ? (
                  <ModuleG7Word2Flow
                    currentLevel={g7W2Level}
                    onCompletePage={(earnedScore) => handleG7W2CompleteLevel(g7W2Level, earnedScore)}
                    studentName={studentName}
                    onRestartMission={handleResetG7W2}
                    onReturnToCatalog={() => navigateToView('catalog')}
                  />
                ) : (
                  <VictoryScreen
                    score={g7W2Score}
                    maxScore={maxScore}
                    studentName={studentName}
                    elapsedSeconds={g7W2ElapsedSeconds}
                    courseId="g7_word_b"
                    onReset={handleResetG7W2}
                    onBackToCatalog={() => navigateToView('catalog')}
                  />
                )}
              </div>
            )}

            {/* Level Views for GRADE 7 - AUDIO MISSION 2A (ACUSTICĂ DIGITALĂ, FRECVENȚE & STUDIO WAVEPAD) */}
            {activeMission === 'g7_audio_a' && (
              <div className="flex-1">
                {g7A1Level <= 7 ? (
                  <ModuleG7Audio1Flow
                    currentLevel={g7A1Level}
                    onCompletePage={(earnedScore) => handleG7A1CompleteLevel(g7A1Level, earnedScore)}
                    studentName={studentName}
                    onRestartMission={handleResetG7A1}
                    onReturnToCatalog={() => navigateToView('catalog')}
                  />
                ) : (
                  <VictoryScreen
                    score={g7A1Score}
                    maxScore={maxScore}
                    studentName={studentName}
                    elapsedSeconds={g7A1ElapsedSeconds}
                    courseId="g7_audio_a"
                    onReset={handleResetG7A1}
                    onBackToCatalog={() => navigateToView('catalog')}
                  />
                )}
              </div>
            )}

            {/* Level Views for GRADE 7 - VIDEO MISSION 2B (MONTAJ VIDEO MULTITRACK, TRANZIȚII & TITRARE ÎN VIDEOPAD) */}
            {activeMission === 'g7_video_b' && (
              <div className="flex-1">
                {g7V2Level <= 7 ? (
                  <ModuleG7Video1Flow
                    currentLevel={g7V2Level}
                    onCompletePage={(earnedScore) => handleG7V2CompleteLevel(g7V2Level, earnedScore)}
                    studentName={studentName}
                    onRestartMission={handleResetG7V2}
                    onReturnToCatalog={() => navigateToView('catalog')}
                  />
                ) : (
                  <VictoryScreen
                    score={g7V2Score}
                    maxScore={maxScore}
                    studentName={studentName}
                    elapsedSeconds={g7V2ElapsedSeconds}
                    courseId="g7_video_b"
                    onReset={handleResetG7V2}
                    onBackToCatalog={() => navigateToView('catalog')}
                  />
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Bottom Stopwatch Bar (shown during active lesson) */}
      {view === 'lesson' && ((activeMission === 'hardware' && hwLevel <= 5) || (activeMission === 'files' && filesLevel <= 7) || (activeMission === 'internet1' && internet1Level <= 6) || (activeMission === 'internet2' && internet2Level <= 6) || (activeMission === 'text1' && text1Level <= 7) || (activeMission === 'text2' && text2Level <= 7) || (activeMission === 'algo1' && algo1Level <= 7) || (activeMission === 'algo2' && algo2Level <= 7) || (activeMission === 'scratch1' && scratch1Level <= 7) || (activeMission === 'scratch2' && scratch2Level <= 7) || (activeMission === 'g6_presentation1' && g6P1Level <= 7) || (activeMission === 'g6_presentation2' && g6P2Level <= 7) || (activeMission === 'g6_paint3d' && g6P3Level <= 7) || (activeMission === 'g6_anim3d' && g6A1Level <= 7) || (activeMission === 'g6_malware' && g6M1Level <= 7) || (activeMission === 'g6_email' && g6E1Level <= 7) || (activeMission === 'g6_scratch1' && g6S1Level <= 7) || (activeMission === 'g6_scratch2' && g6S2Level <= 7) || (activeMission === 'g7_word_a' && g7W1Level <= 7) || (activeMission === 'g7_word_b' && g7W2Level <= 7) || (activeMission === 'g7_audio_a' && g7A1Level <= 7) || (activeMission === 'g7_video_b' && g7V2Level <= 7)) && (
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

      <Footer
        onOpenLegal={openLegalModal}
        onNavigateToCatalog={() => setView('catalog')}
        onNavigateToArcade={() => setView('arcade')}
        onNavigateToDuel={() => setView('duel')}
        onNavigateToCity={() => setView('city')}
        onNavigateToTeacher={() => setView('teacher')}
        onNavigateToSuperAdmin={() => setView('superadmin')}
      />

      {/* Legal & About Modal with Netlify Contact form */}
      <LegalModal
        isOpen={legalModalOpen}
        initialTab={legalTab}
        onClose={() => {
          setLegalModalOpen(false);
          try {
            if (
              window.location.hash.startsWith('#despre') ||
              window.location.hash.startsWith('#about') ||
              window.location.hash.startsWith('#privacy') ||
              window.location.hash.startsWith('#gdpr') ||
              window.location.hash.startsWith('#cookies') ||
              window.location.hash.startsWith('#termeni') ||
              window.location.hash.startsWith('#contact')
            ) {
              window.history.replaceState(null, '', ' ');
            }
          } catch {}
        }}
      />

      {/* Floating Cookie Consent Banner */}
      <CookieBanner onOpenCookiePolicy={() => openLegalModal('cookies')} />
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
            <OfflineIndicator />
          </ArkyProvider>
        </HintProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
