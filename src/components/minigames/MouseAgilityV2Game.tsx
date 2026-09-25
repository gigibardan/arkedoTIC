import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { sounds } from '../../utils/audio';
import { updateActiveArcadeScore } from '../../lib/studentAuthService';
import {
  MousePointer,
  RotateCcw,
  Trophy,
  Flame,
  Zap,
  Timer,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowLeft,
  Folder,
  Trash2,
  FileText,
  ShieldCheck,
  Cpu,
  Layers,
  Activity,
  Crosshair,
  Sliders,
  Award,
  ChevronRight,
  Maximize2,
  Disc,
  Play,
  Settings,
  HelpCircle,
} from 'lucide-react';

interface MouseAgilityV2GameProps {
  onBack: () => void;
  studentName?: string;
}

type GameMode = 'campaign' | 'survival' | 'benchmark' | 'shop';

interface HardwareUpgrades {
  dpiSensor: number; // Level 0-3: increases target hit area
  opticalSwitches: number; // Level 0-3: chance for Critical Click (+15 pts)
  ptfeSkates: number; // Level 0-3: targets stay on screen +0.4s longer
  titanWheel: number; // Level 0-3: scroll points and speed multiplier
  empNanoclicker: number; // Level 0-1: active EMP ability on Space key
}

const DEFAULT_UPGRADES: HardwareUpgrades = {
  dpiSensor: 0,
  opticalSwitches: 0,
  ptfeSkates: 0,
  titanWheel: 0,
  empNanoclicker: 0,
};

type ActionType = 
  | 'click' 
  | 'double_click' 
  | 'right_click' 
  | 'triple_click' 
  | 'scroll' 
  | 'drag' 
  | 'lasso' 
  | 'boss' 
  | 'wire_trace';

interface TargetItem {
  id: number;
  type: ActionType;
  x: number;
  y: number;
  labelRo: string;
  labelEn: string;
  icon: string;
  spawnTime: number;
  duration: number; // ms before target expires
  clicksNeeded: number;
  currentClicks: number;
  lastClickTime?: number;
  targetRadius?: number;
  // For boss
  maxHealth?: number;
  currentHealth?: number;
  // For scroll
  currentScroll?: number;
  targetScroll?: number;
  // For wire trace
  traceCompleted?: boolean;
}

interface LassoDot {
  id: number;
  x: number;
  y: number;
  caught: boolean;
}

export const MouseAgilityV2Game: React.FC<MouseAgilityV2GameProps> = ({ onBack, studentName }) => {
  const { lang } = useLanguage();
  const arky = useArky();

  // Navigation mode
  const [activeMode, setActiveMode] = useState<GameMode>('campaign');

  // Campaign stage (1 to 10)
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [unlockedStages, setUnlockedStages] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('arkedo_mousev2_unlocked_stage') || '1');
    } catch {
      return 1;
    }
  });

  // Hardware upgrades
  const [upgrades, setUpgrades] = useState<HardwareUpgrades>(() => {
    try {
      const raw = localStorage.getItem('arkedo_mousev2_upgrades');
      return raw ? { ...DEFAULT_UPGRADES, ...JSON.parse(raw) } : DEFAULT_UPGRADES;
    } catch {
      return DEFAULT_UPGRADES;
    }
  });

  // Mouse Bits currency for hardware upgrades
  const [mouseBits, setMouseBits] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('arkedo_mousev2_bits') || '50');
    } catch {
      return 50;
    }
  });

  // Game state
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'stage_cleared' | 'game_over'>('idle');
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [hitsCount, setHitsCount] = useState<number>(0);
  const [missesCount, setMissesCount] = useState<number>(0);
  const [empReady, setEmpReady] = useState<boolean>(true);
  const [feedbackEffect, setFeedbackEffect] = useState<string | null>(null);

  // Targets
  const [currentTarget, setCurrentTarget] = useState<TargetItem | null>(null);
  const [lassoDots, setLassoDots] = useState<LassoDot[]>([]);
  const [lassoSelection, setLassoSelection] = useState<{ startX: number; startY: number; currentX: number; currentY: number; isSelecting: boolean } | null>(null);

  // Wire trace state
  const [wireProgress, setWireProgress] = useState<number>(0);
  const [isTracing, setIsTracing] = useState<boolean>(false);

  // Scroll gauge
  const [scrollCharge, setScrollCharge] = useState<number>(0);

  // Benchmark stats
  const [benchmarkTime, setBenchmarkTime] = useState<5 | 10>(5);
  const [benchmarkState, setBenchmarkState] = useState<'ready' | 'clicking' | 'finished'>('ready');
  const [benchmarkClicks, setBenchmarkClicks] = useState<number>(0);
  const [benchmarkTimeLeft, setBenchmarkTimeLeft] = useState<number>(5);
  const [benchmarkCPS, setBenchmarkCPS] = useState<number>(0);
  const [reactionStage, setReactionStage] = useState<'wait' | 'ready' | 'green' | 'clicked' | 'too_soon'>('wait');
  const [reactionStartTime, setReactionStartTime] = useState<number>(0);
  const [reactionResultMs, setReactionResultMs] = useState<number | null>(null);

  // High score
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_mouse_v2') || '0');
    } catch {
      return 0;
    }
  });

  const arenaRef = useRef<HTMLDivElement>(null);
  const reactionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Save upgrades
  const saveUpgrades = (newUpgrades: HardwareUpgrades, newBits: number) => {
    setUpgrades(newUpgrades);
    setMouseBits(newBits);
    try {
      localStorage.setItem('arkedo_mousev2_upgrades', JSON.stringify(newUpgrades));
      localStorage.setItem('arkedo_mousev2_bits', String(newBits));
    } catch {}
  };

  // Stage setup
  const STAGE_TITLES: { [k: number]: { ro: string; en: string; descRo: string; descEn: string; targetAction: ActionType; goalCount: number } } = {
    1: {
      ro: 'Etapa 1: Senzor de Bază (Click & Dublu-Click)',
      en: 'Stage 1: Basic Sensor (Click & Double-Click)',
      descRo: 'Calibrează reflexele primare. Elimină 8 noduri cu click stânga și dublu-click rapid.',
      descEn: 'Calibrate primary reflexes. Clear 8 nodes with single & rapid double clicks.',
      targetAction: 'click',
      goalCount: 8,
    },
    2: {
      ro: 'Etapa 2: Meniu Contextual (Click Dreapta)',
      en: 'Stage 2: Contextual Menu (Right Click)',
      descRo: 'Infiltrare în sistem: nodurile albastre necesită dezactivare prin click dreapta!',
      descEn: 'System bypass: blue nodes require tactical context disarming via right click!',
      targetAction: 'right_click',
      goalCount: 8,
    },
    3: {
      ro: 'Etapa 3: Traseu Conductor Optic (Wire Tracing)',
      en: 'Stage 3: Optical Wire Tracing (Steady Hand)',
      descRo: 'Ține apăsat butonul mouse-ului și urmărește traseul laser fără să atingi marginile roșii!',
      descEn: 'Hold mouse button and trace the conduit without touching the red electric barriers!',
      targetAction: 'wire_trace',
      goalCount: 3,
    },
    4: {
      ro: 'Etapa 4: Furtună de Răcire (Scroll-Storm Wheel)',
      en: 'Stage 4: Scroll-Storm (Mouse Wheel)',
      descRo: 'Răcire CPU: rotește rapid de rotița mouse-ului pentru a încărca rezerva energetică la 100%!',
      descEn: 'CPU cooling: spin your mouse wheel quickly to fill the energy gauge to 100%!',
      targetAction: 'scroll',
      goalCount: 3,
    },
    5: {
      ro: 'Etapa 5: Sortare & Carantină (Drag & Drop)',
      en: 'Stage 5: Quarantine & Sorting (Drag & Drop)',
      descRo: 'Trage componentele verzi pe Procesor și cele roșii infectate în Coșul de Siguranță!',
      descEn: 'Drag green chips to the Processor, and infected red files to the Quarantine bin!',
      targetAction: 'drag',
      goalCount: 6,
    },
    6: {
      ro: 'Etapa 6: Selecție Lasso (Box Multi-Select)',
      en: 'Stage 6: Lasso Sweep (Box Multi-Select)',
      descRo: 'Trage un dreptunghi de selecție cu mouse-ul peste roiul de micro-buguri pentru a le curăța simultan!',
      descEn: 'Drag a selection box over the swarm of micro-bugs to zap them all at once!',
      targetAction: 'lasso',
      goalCount: 4,
    },
    7: {
      ro: 'Etapa 7: Bătălie Boss Overclock (CPS Frenzy)',
      en: 'Stage 7: Overclock Boss Battle (CPS Frenzy)',
      descRo: 'Nucleul Central a luat-o razna! Fă clicuri rapide la viteza maximă pentru a-i sparge scutul!',
      descEn: 'The Central Core is overheating! Click at maximum CPS speed to shatter its energy shield!',
      targetAction: 'boss',
      goalCount: 1,
    },
    8: {
      ro: 'Etapa 8: Triplu-Click & Frecvență Înaltă',
      en: 'Stage 8: Triple Click & Burst Cadence',
      descRo: 'Noduri de mare securitate: necesită secvențe fulger de 3 clicuri rapide consecutive!',
      descEn: 'High-security crystal nodes: require lightning-fast 3-click bursts!',
      targetAction: 'triple_click',
      goalCount: 6,
    },
    9: {
      ro: 'Etapa 9: Inele de Precizie & Ritm',
      en: 'Stage 9: Precision Timing Rings',
      descRo: 'Apasă exact în momentul în care inelul exterior se micșorează peste nucleul central!',
      descEn: 'Click at the exact moment the shrinking outer ring aligns with the core circle!',
      targetAction: 'click',
      goalCount: 8,
    },
    10: {
      ro: 'Etapa 10: MARELE MAESTRU CYBER 2.0',
      en: 'Stage 10: ULTIMATE CYBER MASTER 2.0',
      descRo: 'Testul suprem: toate provocările combinate într-o cursă contra-cronometru!',
      descEn: 'The final gauntlet: all mouse mechanics fused in a high-speed cyber sprint!',
      targetAction: 'click',
      goalCount: 15,
    },
  };

  // Start campaign stage
  const startCampaignStage = (stageNum: number) => {
    sounds.playClick();
    setCurrentStage(stageNum);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setHitsCount(0);
    setMissesCount(0);
    setTimeLeft(50);
    setGameState('playing');
    setWireProgress(0);
    setScrollCharge(0);
    spawnCampaignTarget(stageNum, 0);
    arky.triggerIdle();
  };

  // Start survival frenzy
  const startSurvivalFrenzy = () => {
    sounds.playClick();
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setHitsCount(0);
    setMissesCount(0);
    setTimeLeft(60);
    setGameState('playing');
    setWireProgress(0);
    setScrollCharge(0);
    spawnSurvivalTarget();
    arky.triggerIdle();
  };

  // Spawn target for campaign
  const spawnCampaignTarget = (stage: number, currentHits: number) => {
    const stageInfo = STAGE_TITLES[stage] || STAGE_TITLES[1];
    const posX = Math.floor(Math.random() * 65) + 15;
    const posY = Math.floor(Math.random() * 55) + 20;

    // PTFE upgrade adds +400ms per level
    const baseDuration = (3500 + upgrades.ptfeSkates * 400);

    let type: ActionType = stageInfo.targetAction;

    if (stage === 1) {
      type = currentHits % 2 === 0 ? 'click' : 'double_click';
    } else if (stage === 10) {
      const allTypes: ActionType[] = ['click', 'double_click', 'right_click', 'triple_click', 'scroll', 'drag'];
      type = allTypes[Math.floor(Math.random() * allTypes.length)];
    }

    if (type === 'lasso') {
      // Spawn 5 micro-dots for lasso sweep
      const dots: LassoDot[] = [];
      for (let i = 0; i < 5; i++) {
        dots.push({
          id: i,
          x: Math.floor(Math.random() * 60) + 20,
          y: Math.floor(Math.random() * 50) + 25,
          caught: false,
        });
      }
      setLassoDots(dots);
    } else {
      setLassoDots([]);
    }

    const newTarget: TargetItem = {
      id: Date.now(),
      type,
      x: posX,
      y: posY,
      labelRo: getActionLabelRo(type),
      labelEn: getActionLabelEn(type),
      icon: getActionIcon(type),
      spawnTime: Date.now(),
      duration: baseDuration,
      clicksNeeded: type === 'triple_click' ? 3 : type === 'double_click' ? 2 : 1,
      currentClicks: 0,
      targetRadius: 40 + upgrades.dpiSensor * 6,
      maxHealth: type === 'boss' ? 25 : undefined,
      currentHealth: type === 'boss' ? 25 : undefined,
      currentScroll: 0,
      targetScroll: 100,
    };

    setCurrentTarget(newTarget);
    setWireProgress(0);
    setScrollCharge(0);
  };

  // Spawn target for survival frenzy
  const spawnSurvivalTarget = () => {
    const posX = Math.floor(Math.random() * 65) + 15;
    const posY = Math.floor(Math.random() * 55) + 20;

    // Randomize action type with boss appearing occasionally
    const types: ActionType[] = ['click', 'double_click', 'right_click', 'triple_click', 'scroll', 'drag'];
    // 10% chance for a mini boss in survival
    const isBoss = Math.random() < 0.12;
    const chosenType = isBoss ? 'boss' : types[Math.floor(Math.random() * types.length)];

    const baseDuration = (3200 + upgrades.ptfeSkates * 400);

    const newTarget: TargetItem = {
      id: Date.now(),
      type: chosenType,
      x: posX,
      y: posY,
      labelRo: getActionLabelRo(chosenType),
      labelEn: getActionLabelEn(chosenType),
      icon: getActionIcon(chosenType),
      spawnTime: Date.now(),
      duration: chosenType === 'boss' ? 8000 : baseDuration,
      clicksNeeded: chosenType === 'triple_click' ? 3 : chosenType === 'double_click' ? 2 : 1,
      currentClicks: 0,
      targetRadius: 40 + upgrades.dpiSensor * 6,
      maxHealth: chosenType === 'boss' ? 15 : undefined,
      currentHealth: chosenType === 'boss' ? 15 : undefined,
      currentScroll: 0,
      targetScroll: 100,
    };

    setCurrentTarget(newTarget);
    setWireProgress(0);
    setScrollCharge(0);
  };

  const getActionLabelRo = (type: ActionType) => {
    switch (type) {
      case 'double_click': return 'Dublu-Click!';
      case 'triple_click': return 'Triplu-Click Fulger!';
      case 'right_click': return 'Click Dreapta!';
      case 'scroll': return 'Rotește Rotița Mouse!';
      case 'drag': return 'Trage în Destinație!';
      case 'lasso': return 'Încercuiește Bugurile!';
      case 'boss': return 'CLICK SPAM BOSS!';
      case 'wire_trace': return 'Ține & Trasează Firul!';
      default: return 'Click Stânga!';
    }
  };

  const getActionLabelEn = (type: ActionType) => {
    switch (type) {
      case 'double_click': return 'Double Click!';
      case 'triple_click': return 'Triple Click Burst!';
      case 'right_click': return 'Right Click Disarm!';
      case 'scroll': return 'Scroll Wheel!';
      case 'drag': return 'Drag to Destination!';
      case 'lasso': return 'Lasso Sweep Bugs!';
      case 'boss': return 'CLICK SPAM BOSS!';
      case 'wire_trace': return 'Hold & Trace Wire!';
      default: return 'Left Click!';
    }
  };

  const getActionIcon = (type: ActionType) => {
    switch (type) {
      case 'double_click': return '⚡⚡';
      case 'triple_click': return '⚡⚡⚡';
      case 'right_click': return '🖱️👆';
      case 'scroll': return '🎚️';
      case 'drag': return '📦';
      case 'lasso': return '🎯';
      case 'boss': return '👾';
      case 'wire_trace': return '〰️';
      default: return '🖱️';
    }
  };

  // Main Timer loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      endGame();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Target expiration timer
  useEffect(() => {
    if (gameState !== 'playing' || !currentTarget) return;

    const checkInterval = setInterval(() => {
      const now = Date.now();
      if (now - currentTarget.spawnTime > currentTarget.duration) {
        // Target expired - registered as miss
        sounds.playWrong();
        registerMiss();
        if (activeMode === 'campaign') {
          spawnCampaignTarget(currentStage, hitsCount);
        } else {
          spawnSurvivalTarget();
        }
      }
    }, 200);

    return () => clearInterval(checkInterval);
  }, [gameState, currentTarget, activeMode, currentStage, hitsCount]);

  // Handle successful hit
  const registerSuccess = (basePts: number, customMessage?: string) => {
    sounds.playCorrect();

    // Critical click calculation based on Omron switches
    const critChance = upgrades.opticalSwitches * 0.15;
    const isCritical = Math.random() < critChance;
    const critBonus = isCritical ? 15 : 0;

    // Combo points (capped at +10 max)
    const newCombo = combo + 1;
    setCombo(newCombo);
    if (newCombo > maxCombo) setMaxCombo(newCombo);

    const comboBonus = Math.min(newCombo, 10);
    const totalAwarded = basePts + critBonus + comboBonus;

    setScore((prev) => prev + totalAwarded);
    const newHits = hitsCount + 1;
    setHitsCount(newHits);

    // Earn Mouse Bits for hardware shop (1 Bit per 40 pts)
    const earnedBits = Math.max(1, Math.floor(totalAwarded / 20));
    setMouseBits((prev) => {
      const updated = prev + earnedBits;
      try {
        localStorage.setItem('arkedo_mousev2_bits', String(updated));
      } catch {}
      return updated;
    });

    if (isCritical) {
      setFeedbackEffect(`CRITICAL! +${totalAwarded} pts`);
    } else if (customMessage) {
      setFeedbackEffect(customMessage);
    } else {
      setFeedbackEffect(`+${totalAwarded}`);
    }
    setTimeout(() => setFeedbackEffect(null), 700);

    // Check campaign progression
    if (activeMode === 'campaign') {
      const stageInfo = STAGE_TITLES[currentStage] || STAGE_TITLES[1];
      if (newHits >= stageInfo.goalCount) {
        // Stage completed!
        completeStage();
      } else {
        spawnCampaignTarget(currentStage, newHits);
      }
    } else {
      spawnSurvivalTarget();
    }
  };

  // Handle Miss Click
  const registerMiss = () => {
    setCombo(0);
    setMissesCount((prev) => prev + 1);
    setFeedbackEffect('MISS!');
    setTimeout(() => setFeedbackEffect(null), 600);
  };

  // Complete Campaign Stage
  const completeStage = () => {
    sounds.playVictory();
    setGameState('stage_cleared');

    // Unlock next stage
    if (currentStage >= unlockedStages && currentStage < 10) {
      const nextUnlocked = currentStage + 1;
      setUnlockedStages(nextUnlocked);
      try {
        localStorage.setItem('arkedo_mousev2_unlocked_stage', String(nextUnlocked));
      } catch {}
    }

    // Award stage bonus
    const stageClearBonus = 50 + currentStage * 10;
    setScore((prev) => prev + stageClearBonus);

    // Sync score to arcade profile
    syncFinalScore(score + stageClearBonus);

    arky.triggerSuccess(
      lang === 'en'
        ? `Stage ${currentStage} Cleared! Superb precision!`
        : `Etapa ${currentStage} Completată! O precizie impecabilă!`
    );
  };

  // End Game (Finished Time)
  const endGame = () => {
    sounds.playVictory();
    setGameState('game_over');
    syncFinalScore(score);

    if (score >= 700) {
      arky.triggerSuccess(
        lang === 'en'
          ? `Master of the Mouse 2.0! ${score} pts! Incredible speed!`
          : `Maestru al Mouse-ului 2.0! ${score} pct! Viteza unui profesionist!`
      );
    }
  };

  // Sync highscore with safety cap
  const syncFinalScore = (finalScore: number) => {
    if (finalScore > highScore) {
      setHighScore(finalScore);
      try {
        localStorage.setItem('arkedo_highscore_mouse_v2', String(finalScore));
      } catch {}
    }
    // Update live student arcade score
    updateActiveArcadeScore('mouse_v2', finalScore);
  };

  // Left click on target
  const handleTargetLeftClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (gameState !== 'playing' || !currentTarget) return;

    if (currentTarget.type === 'click') {
      registerSuccess(20);
    } else if (currentTarget.type === 'double_click') {
      const now = Date.now();
      const last = currentTarget.lastClickTime || 0;
      if (now - last < 450) {
        registerSuccess(30, 'DOUBLE CLICK!');
      } else {
        sounds.playClick();
        setCurrentTarget({
          ...currentTarget,
          lastClickTime: now,
          currentClicks: 1,
        });
      }
    } else if (currentTarget.type === 'triple_click') {
      const now = Date.now();
      const last = currentTarget.lastClickTime || 0;
      if (now - last < 450) {
        const nextClicks = currentTarget.currentClicks + 1;
        if (nextClicks >= 3) {
          registerSuccess(40, 'TRIPLE BURST!');
        } else {
          sounds.playClick();
          setCurrentTarget({
            ...currentTarget,
            lastClickTime: now,
            currentClicks: nextClicks,
          });
        }
      } else {
        sounds.playClick();
        setCurrentTarget({
          ...currentTarget,
          lastClickTime: now,
          currentClicks: 1,
        });
      }
    } else if (currentTarget.type === 'boss') {
      // Boss click spam
      sounds.playClick();
      const newHealth = (currentTarget.currentHealth || 1) - 1;
      if (newHealth <= 0) {
        registerSuccess(60, 'BOSS OVERCLOCK DESTROYED!');
      } else {
        setCurrentTarget({
          ...currentTarget,
          currentHealth: newHealth,
        });
      }
    } else if (currentTarget.type === 'right_click') {
      sounds.playWrong();
      registerMiss();
    }
  };

  // Right click on target
  const handleTargetRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (gameState !== 'playing' || !currentTarget) return;

    if (currentTarget.type === 'right_click') {
      registerSuccess(25, 'CONTEXT DISARMED!');
    } else {
      sounds.playWrong();
      registerMiss();
    }
  };

  // Wheel scroll on target or arena
  const handleWheel = (e: React.WheelEvent) => {
    if (gameState !== 'playing' || !currentTarget || currentTarget.type !== 'scroll') return;
    e.preventDefault();

    const scrollDelta = Math.abs(e.deltaY) * (1 + upgrades.titanWheel * 0.4);
    const newCharge = Math.min(100, scrollCharge + scrollDelta * 0.15);
    setScrollCharge(newCharge);

    if (newCharge >= 100) {
      registerSuccess(35, 'SCROLL OVERLOAD CLEARED!');
    }
  };

  // Arena miss click
  const handleArenaClick = (e: React.MouseEvent) => {
    if (gameState !== 'playing') return;
    sounds.playWrong();
    registerMiss();
  };

  // EMP Nanoclicker active power (Spacebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && gameState === 'playing' && upgrades.empNanoclicker > 0 && empReady) {
        e.preventDefault();
        sounds.playVictory();
        setEmpReady(false);
        setFeedbackEffect('⚡ EMP PULSE ACTIVATED!');
        setTimeout(() => setFeedbackEffect(null), 900);
        // Instantly clears current target
        registerSuccess(25, 'EMP CLEAR!');
        // 25s cooldown
        setTimeout(() => setEmpReady(true), 25000);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, empReady, upgrades.empNanoclicker]);

  // Wire tracing logic
  const handleWireMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentTarget?.type === 'wire_trace') {
      setIsTracing(true);
      sounds.playClick();
    }
  };

  const handleWireMouseMove = (e: React.MouseEvent) => {
    if (isTracing && currentTarget?.type === 'wire_trace') {
      const rect = arenaRef.current?.getBoundingClientRect();
      if (!rect) return;
      const relX = ((e.clientX - rect.left) / rect.width) * 100;
      setWireProgress((prev) => {
        const next = Math.min(100, prev + 2.5);
        if (next >= 100) {
          setIsTracing(false);
          registerSuccess(45, 'CIRCUIT SOLDERED!');
        }
        return next;
      });
    }
  };

  const handleWireMouseUp = () => {
    if (isTracing) {
      setIsTracing(false);
    }
  };

  // Lasso box selection logic
  const handleLassoMouseDown = (e: React.MouseEvent) => {
    if (currentTarget?.type !== 'lasso' || gameState !== 'playing') return;
    const rect = arenaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLassoSelection({ startX: x, startY: y, currentX: x, currentY: y, isSelecting: true });
  };

  const handleLassoMouseMove = (e: React.MouseEvent) => {
    if (!lassoSelection?.isSelecting) return;
    const rect = arenaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLassoSelection((prev) => (prev ? { ...prev, currentX: x, currentY: y } : null));

    // Check if lasso box caught dots
    const minX = Math.min(lassoSelection.startX, x);
    const maxX = Math.max(lassoSelection.startX, x);
    const minY = Math.min(lassoSelection.startY, y);
    const maxY = Math.max(lassoSelection.startY, y);

    setLassoDots((prev) =>
      prev.map((dot) => {
        if (dot.x >= minX && dot.x <= maxX && dot.y >= minY && dot.y <= maxY) {
          return { ...dot, caught: true };
        }
        return dot;
      })
    );
  };

  const handleLassoMouseUp = () => {
    if (lassoSelection?.isSelecting) {
      setLassoSelection(null);
      // Check if all dots caught
      const uncaught = lassoDots.filter((d) => !d.caught);
      if (uncaught.length === 0 && lassoDots.length > 0) {
        registerSuccess(40, 'LASSO SWEEP 100%!');
      }
    }
  };

  // Drag and drop sorting logic
  const handleDragStart = (e: React.DragEvent, isSafe: boolean) => {
    e.dataTransfer.setData('text/plain', isSafe ? 'safe_chip' : 'virus_chip');
    sounds.playClick();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnZone = (e: React.DragEvent, zoneType: 'cpu' | 'quarantine') => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if ((zoneType === 'cpu' && data === 'safe_chip') || (zoneType === 'quarantine' && data === 'virus_chip')) {
      registerSuccess(30, 'CORRECTLY QUARANTINED!');
    } else {
      sounds.playWrong();
      registerMiss();
    }
  };

  // BENCHMARK CPS TEST
  const startBenchmark = () => {
    sounds.playClick();
    setBenchmarkState('clicking');
    setBenchmarkClicks(0);
    setBenchmarkTimeLeft(benchmarkTime);
    setBenchmarkCPS(0);
  };

  useEffect(() => {
    if (benchmarkState !== 'clicking') return;

    const timer = setInterval(() => {
      setBenchmarkTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setBenchmarkState('finished');
          sounds.playVictory();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [benchmarkState]);

  useEffect(() => {
    if (benchmarkState === 'finished') {
      const cps = Number((benchmarkClicks / benchmarkTime).toFixed(1));
      setBenchmarkCPS(cps);
    }
  }, [benchmarkState, benchmarkClicks, benchmarkTime]);

  const handleBenchmarkClick = () => {
    if (benchmarkState === 'clicking') {
      sounds.playClick();
      setBenchmarkClicks((prev) => prev + 1);
    }
  };

  // REACTION TIME TEST
  const startReactionTest = () => {
    setReactionStage('ready');
    setReactionResultMs(null);
    sounds.playClick();

    const randomDelay = Math.floor(Math.random() * 2500) + 1500;
    reactionTimerRef.current = setTimeout(() => {
      setReactionStage('green');
      setReactionStartTime(Date.now());
    }, randomDelay);
  };

  const handleReactionClick = () => {
    if (reactionStage === 'ready') {
      // Clicked too early!
      if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
      setReactionStage('too_soon');
      sounds.playWrong();
    } else if (reactionStage === 'green') {
      const reactionTime = Date.now() - reactionStartTime;
      setReactionResultMs(reactionTime);
      setReactionStage('clicked');
      sounds.playCorrect();
    }
  };

  // Upgrades purchase
  const buyUpgrade = (key: keyof HardwareUpgrades, cost: number) => {
    if (mouseBits >= cost && upgrades[key] < 3) {
      sounds.playCorrect();
      const updated = {
        ...upgrades,
        [key]: upgrades[key] + 1,
      };
      saveUpgrades(updated, mouseBits - cost);
    } else {
      sounds.playWrong();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-5 p-2 sm:p-4 select-none">
      {/* Header bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
            title={lang === 'en' ? 'Back to Arcade' : 'Înapoi la Arcade'}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🖱️⚡</span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-heading tracking-wide">
                {lang === 'en' ? 'Mouse Master Pro 2.0' : 'Maestrul Mouse-ului 2.0'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                PRO LAB
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'en'
                ? 'Circuit Tracing, Scroll-Storm, Lasso Sweep, Boss CPS & Hardware Upgrades'
                : 'Circuite optice, Scroll-Storm, Selecție Lasso, Boss CPS și Laborator Hardware'}
            </p>
          </div>
        </div>

        {/* Currency & Best Score */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <div className="text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Mouse Bits</span>
              <span className="font-bold text-amber-300 font-mono text-sm">{mouseBits} 🪙</span>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <div className="text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Record</span>
              <span className="font-bold text-emerald-300 font-mono text-sm">{highScore} pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mode navigation tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => {
            sounds.playClick();
            setActiveMode('campaign');
            if (gameState === 'playing') setGameState('idle');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 border ${
            activeMode === 'campaign'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{lang === 'en' ? 'Missions Campaign (10 Stages)' : 'Campanie Misiuni (10 Etape)'}</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveMode('survival');
            if (gameState === 'playing') setGameState('idle');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 border ${
            activeMode === 'survival'
              ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-600/30'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>{lang === 'en' ? 'Survival Frenzy (60s)' : 'Supraviețuire Frenzy (60s)'}</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveMode('benchmark');
            if (gameState === 'playing') setGameState('idle');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 border ${
            activeMode === 'benchmark'
              ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-600/30'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{lang === 'en' ? 'CPS & Reflex Benchmark' : 'Laborator CPS & Reflex'}</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveMode('shop');
            if (gameState === 'playing') setGameState('idle');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 border ${
            activeMode === 'shop'
              ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>{lang === 'en' ? 'Hardware Upgrades' : 'Atelier Hardware DPI'}</span>
        </button>
      </div>

      {/* MODE 1: CAMPAIGN MODE */}
      {activeMode === 'campaign' && (
        <div className="flex flex-col gap-4">
          {/* Stage selector bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex items-center gap-2 overflow-x-auto">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((stageNum) => {
              const isUnlocked = stageNum <= unlockedStages;
              const isCurrent = stageNum === currentStage;

              return (
                <button
                  key={stageNum}
                  disabled={!isUnlocked}
                  onClick={() => {
                    sounds.playClick();
                    startCampaignStage(stageNum);
                  }}
                  className={`w-10 h-10 rounded-2xl font-black text-xs transition flex flex-col items-center justify-center shrink-0 border cursor-pointer ${
                    !isUnlocked
                      ? 'bg-slate-950 text-slate-600 border-slate-800 opacity-50 cursor-not-allowed'
                      : isCurrent
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/30 font-bold scale-105'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <span>{stageNum}</span>
                </button>
              );
            })}
          </div>

          {/* Active Stage Description Header */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Etapa {currentStage} / 10
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">
                  {lang === 'en' ? STAGE_TITLES[currentStage]?.en : STAGE_TITLES[currentStage]?.ro}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                {lang === 'en' ? STAGE_TITLES[currentStage]?.descEn : STAGE_TITLES[currentStage]?.descRo}
              </h3>
            </div>

            {gameState === 'idle' && (
              <button
                onClick={() => startCampaignStage(currentStage)}
                className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition flex items-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer shrink-0"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{lang === 'en' ? 'Start Stage' : 'Începe Etapa'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* MODE 2: SURVIVAL FRENZY HEADER */}
      {activeMode === 'survival' && gameState === 'idle' && (
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex flex-col gap-2 max-w-xl">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase">
              <Flame className="w-4 h-4" />
              <span>{lang === 'en' ? 'Continuous 60s Reflex Trial' : 'Cursă Continuă de 60 de Secunde'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
              {lang === 'en' ? 'Survival Frenzy 2.0' : 'Supraviețuire Frenzy 2.0'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'en'
                ? 'Targets evolve every second: Single clicks, fast double-taps, right-click context menu dismissals, and intense Boss spam bursts. Keep your combo alive to maximize score without inflated multipliers!'
                : 'Țintele se schimbă constant: clicuri simple, dublu-clic rapid, dezactivare click dreapta și bătălii frenetice cu boși overclock. Menține combo-ul activ pentru cel mai mare punctaj echilibrat!'}
            </p>
          </div>

          <button
            onClick={startSurvivalFrenzy}
            className="px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base transition flex items-center gap-2 shadow-2xl shadow-amber-500/30 cursor-pointer shrink-0"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>{lang === 'en' ? 'Launch Frenzy' : 'Lansează Frenzy (60s)'}</span>
          </button>
        </div>
      )}

      {/* PLAYING ARENA (FOR CAMPAIGN & SURVIVAL) */}
      {(activeMode === 'campaign' || activeMode === 'survival') && (
        <div className="flex flex-col gap-3">
          {/* Live HUD scoreboard */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Punctaj Scor</span>
              <span className="text-lg font-black text-amber-300 font-mono">{score} pts</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Timp Rămas</span>
              <span className={`text-lg font-black font-mono ${timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-cyan-300'}`}>
                ⏱️ {timeLeft}s
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Combo Activ</span>
              <span className="text-lg font-black text-emerald-400 font-mono">
                🔥 x{combo} <span className="text-[10px] text-slate-500">(max {maxCombo})</span>
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Ținte Nimerite</span>
              <span className="text-lg font-black text-indigo-300 font-mono">🎯 {hitsCount}</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Abilitate EMP</span>
              <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md inline-block mt-1 ${
                upgrades.empNanoclicker === 0
                  ? 'text-slate-600 bg-slate-900'
                  : empReady
                  ? 'text-purple-300 bg-purple-500/20 border border-purple-500/40 animate-pulse'
                  : 'text-slate-500 bg-slate-900'
              }`}>
                {upgrades.empNanoclicker === 0 ? 'Blocat' : empReady ? '⚡ SPACE GATA' : '⏳ Reîncărcare...'}
              </span>
            </div>
          </div>

          {/* Interactive Game Arena */}
          <div
            ref={arenaRef}
            onClick={handleArenaClick}
            onWheel={handleWheel}
            onMouseDown={currentTarget?.type === 'lasso' ? handleLassoMouseDown : undefined}
            onMouseMove={currentTarget?.type === 'lasso' ? handleLassoMouseMove : isTracing ? handleWireMouseMove : undefined}
            onMouseUp={currentTarget?.type === 'lasso' ? handleLassoMouseUp : isTracing ? handleWireMouseUp : undefined}
            className={`relative w-full h-[380px] sm:h-[440px] bg-slate-950 border-2 rounded-3xl overflow-hidden cursor-crosshair transition shadow-inner select-none ${
              gameState === 'playing' ? 'border-cyan-500/30' : 'border-slate-800'
            }`}
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)',
            }}
          >
            {/* Grid cyber lines background */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            {/* Float feedback popup */}
            {feedbackEffect && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-xl bg-slate-900/90 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold shadow-2xl animate-bounce pointer-events-none">
                {feedbackEffect}
              </div>
            )}

            {/* IDLE SCREEN OVERLAY */}
            {gameState === 'idle' && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-3xl mb-3 shadow-xl">
                  🖱️
                </div>
                <h3 className="text-xl font-black text-white font-heading">
                  {lang === 'en' ? 'Mouse Master Lab Ready' : 'Laboratorul de Mouse Este Pregătit'}
                </h3>
                <p className="text-xs text-slate-400 max-w-md mt-1 leading-relaxed">
                  {lang === 'en'
                    ? 'Click Start to enter the cyber arena. Watch for different action types: left click, double click, right click disarm, wheel scroll, and boss encounters.'
                    : 'Apasă butonul de start pentru a începe. Fii atent la tipurile de acțiune: click simplu, dublu-click, click dreapta, rotiță scroll și bătălii cu boși.'}
                </p>
                <button
                  onClick={() => {
                    if (activeMode === 'campaign') {
                      startCampaignStage(currentStage);
                    } else {
                      startSurvivalFrenzy();
                    }
                  }}
                  className="mt-5 px-7 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition flex items-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>{lang === 'en' ? 'Start Round' : 'Pornește Runda'}</span>
                </button>
              </div>
            )}

            {/* STAGE CLEARED OVERLAY */}
            {gameState === 'stage_cleared' && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl mb-3 shadow-xl">
                  🏆
                </div>
                <h3 className="text-2xl font-black text-amber-300 font-heading">
                  {lang === 'en' ? `Stage ${currentStage} Complete!` : `Etapa ${currentStage} Finalizată!`}
                </h3>
                <p className="text-xs text-slate-300 max-w-sm mt-1">
                  {lang === 'en'
                    ? `Flawless reflexes! You scored ${score} points and collected Mouse Bits for hardware upgrades.`
                    : `Reflexe extraordinare! Ai obținut ${score} puncte și ai colectat Mouse Bits pentru atelierul hardware.`}
                </p>

                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={() => startCampaignStage(currentStage)}
                    className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2 cursor-pointer border border-slate-700"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{lang === 'en' ? 'Replay Stage' : 'Rejoacă Etapa'}</span>
                  </button>

                  {currentStage < 10 && (
                    <button
                      onClick={() => startCampaignStage(currentStage + 1)}
                      className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/30"
                    >
                      <span>{lang === 'en' ? 'Next Stage' : 'Etapa Următoare'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* GAME OVER OVERLAY */}
            {gameState === 'game_over' && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-3xl mb-3 shadow-xl">
                  ⭐
                </div>
                <h3 className="text-2xl font-black text-white font-heading">
                  {lang === 'en' ? 'Session Complete!' : 'Sesiune Încheiată!'}
                </h3>
                <div className="mt-3 flex items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Scor Final</span>
                    <span className="text-2xl font-black text-amber-300 font-mono">{score} pts</span>
                  </div>
                  <div className="w-px h-8 bg-slate-800" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Max Combo</span>
                    <span className="text-2xl font-black text-emerald-400 font-mono">x{maxCombo}</span>
                  </div>
                  <div className="w-px h-8 bg-slate-800" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Ținte Nimerite</span>
                    <span className="text-2xl font-black text-cyan-300 font-mono">{hitsCount}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={() => {
                      if (activeMode === 'campaign') {
                        startCampaignStage(currentStage);
                      } else {
                        startSurvivalFrenzy();
                      }
                    }}
                    className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/30"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{lang === 'en' ? 'Play Again' : 'Joacă Din Nou'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* ACTIVE TARGET RENDERING */}
            {gameState === 'playing' && currentTarget && (
              <>
                {/* 1. REGULAR CLICK / DOUBLE / TRIPLE / RIGHT CLICK */}
                {(currentTarget.type === 'click' ||
                  currentTarget.type === 'double_click' ||
                  currentTarget.type === 'triple_click' ||
                  currentTarget.type === 'right_click') && (
                  <div
                    onClick={handleTargetLeftClick}
                    onContextMenu={handleTargetRightClick}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex flex-col items-center justify-center font-bold transition-transform cursor-pointer shadow-2xl active:scale-95 group ${
                      currentTarget.type === 'right_click'
                        ? 'bg-blue-600/90 border-2 border-cyan-300 shadow-cyan-500/30'
                        : currentTarget.type === 'triple_click'
                        ? 'bg-purple-600/90 border-2 border-purple-300 shadow-purple-500/30 animate-pulse'
                        : currentTarget.type === 'double_click'
                        ? 'bg-amber-600/90 border-2 border-amber-300 shadow-amber-500/30'
                        : 'bg-emerald-600/90 border-2 border-emerald-300 shadow-emerald-500/30'
                    }`}
                    style={{
                      left: `${currentTarget.x}%`,
                      top: `${currentTarget.y}%`,
                      width: `${currentTarget.targetRadius ? currentTarget.targetRadius * 1.8 : 75}px`,
                      height: `${currentTarget.targetRadius ? currentTarget.targetRadius * 1.8 : 75}px`,
                    }}
                  >
                    <span className="text-xl sm:text-2xl drop-shadow">{currentTarget.icon}</span>
                    <span className="text-[10px] font-black text-white px-1.5 rounded uppercase font-mono tracking-tight text-center leading-tight">
                      {lang === 'en' ? currentTarget.labelEn : currentTarget.labelRo}
                    </span>
                    {currentTarget.clicksNeeded > 1 && (
                      <span className="text-[9px] font-mono text-amber-200 mt-0.5">
                        {currentTarget.currentClicks} / {currentTarget.clicksNeeded}
                      </span>
                    )}
                  </div>
                )}

                {/* 2. BOSS CLICK SPAM ENCOUNTER */}
                {currentTarget.type === 'boss' && (
                  <div
                    onClick={handleTargetLeftClick}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full bg-gradient-to-br from-rose-600 via-purple-700 to-slate-900 border-4 border-rose-400 flex flex-col items-center justify-center cursor-pointer shadow-2xl shadow-rose-600/50 animate-pulse active:scale-95 z-10"
                    style={{
                      left: `${currentTarget.x}%`,
                      top: `${currentTarget.y}%`,
                    }}
                  >
                    <span className="text-4xl drop-shadow animate-bounce">👾</span>
                    <span className="text-xs font-black text-white uppercase font-mono mt-1">
                      {lang === 'en' ? 'CLICK SPAM BOSS!' : 'CLICK RAPID BOSS!'}
                    </span>
                    <div className="w-28 bg-slate-950 rounded-full h-3 mt-2 overflow-hidden border border-rose-400/50 p-0.5">
                      <div
                        className="bg-gradient-to-r from-amber-400 to-rose-500 h-full rounded-full transition-all"
                        style={{
                          width: `${((currentTarget.currentHealth || 0) / (currentTarget.maxHealth || 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-rose-200 font-bold mt-1">
                      HP: {currentTarget.currentHealth} / {currentTarget.maxHealth}
                    </span>
                  </div>
                )}

                {/* 3. SCROLL-STORM WHEEL TARGET */}
                {currentTarget.type === 'scroll' && (
                  <div
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-44 p-4 rounded-3xl bg-slate-900/90 border-2 border-cyan-400 flex flex-col items-center shadow-2xl text-center z-10"
                    style={{
                      left: `${currentTarget.x}%`,
                      top: `${currentTarget.y}%`,
                    }}
                  >
                    <span className="text-3xl animate-bounce">🎚️</span>
                    <span className="text-xs font-black text-cyan-300 uppercase font-mono mt-1">
                      {lang === 'en' ? 'SPIN WHEEL UP/DOWN' : 'ROTEȘTE ROTIȚA MOUSE'}
                    </span>
                    <div className="w-full bg-slate-950 rounded-full h-4 mt-3 overflow-hidden border border-cyan-500/40 p-0.5">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all"
                        style={{ width: `${scrollCharge}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-cyan-200 mt-1 font-bold">
                      {Math.round(scrollCharge)}% / 100%
                    </span>
                  </div>
                )}

                {/* 4. WIRE TRACING TARGET */}
                {currentTarget.type === 'wire_trace' && (
                  <div
                    className="absolute inset-10 border-2 border-dashed border-amber-500/30 rounded-2xl flex flex-col justify-between p-4 pointer-events-auto"
                    onMouseMove={handleWireMouseMove}
                    onMouseUp={handleWireMouseUp}
                  >
                    <div className="text-center">
                      <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                        {lang === 'en' ? 'Click & Hold START, then drag along wire to END!' : 'Apasă și ține START, apoi trage pe fir până la FINISH!'}
                      </span>
                    </div>

                    <div className="relative w-full h-12 bg-slate-900/80 rounded-2xl border border-slate-700 overflow-hidden flex items-center px-4">
                      {/* Laser conduit */}
                      <div className="absolute left-0 top-0 bottom-0 bg-amber-500/20 border-r-2 border-amber-400 transition-all" style={{ width: `${wireProgress}%` }} />

                      <div
                        onMouseDown={handleWireMouseDown}
                        className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center cursor-pointer shadow-lg z-10 active:scale-95"
                      >
                        START
                      </div>

                      <div className="flex-1 text-center font-mono text-xs text-amber-400 font-bold z-10">
                        {Math.round(wireProgress)}%
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center z-10">
                        FINISH
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. DRAG & DROP SORTING TARGET */}
                {currentTarget.type === 'drag' && (
                  <div className="absolute inset-6 flex items-center justify-between p-4 pointer-events-auto">
                    {/* Draggable Component */}
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, true)}
                      className="px-4 py-3 rounded-2xl bg-emerald-600 border-2 border-emerald-300 text-white font-bold text-xs flex items-center gap-2 cursor-grab active:cursor-grabbing shadow-xl animate-pulse"
                    >
                      <Cpu className="w-5 h-5" />
                      <span>{lang === 'en' ? 'Clean CPU Chip' : 'Cip CPU Curat'}</span>
                    </div>

                    {/* Target Drop Zone */}
                    <div
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropOnZone(e, 'cpu')}
                      className="w-48 h-32 rounded-3xl border-2 border-dashed border-emerald-400 bg-emerald-950/20 flex flex-col items-center justify-center p-3 text-center transition hover:bg-emerald-950/40"
                    >
                      <Cpu className="w-7 h-7 text-emerald-400 mb-1" />
                      <span className="text-xs font-bold text-emerald-300 font-mono">
                        {lang === 'en' ? 'Drop to CPU Socket' : 'Plasează în Soclul CPU'}
                      </span>
                    </div>
                  </div>
                )}

                {/* 6. LASSO SELECTION BUG CLUSTER */}
                {currentTarget.type === 'lasso' && (
                  <div className="absolute inset-0 pointer-events-none">
                    {lassoDots.map((dot) => (
                      <div
                        key={dot.id}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                          dot.caught
                            ? 'bg-emerald-500 text-slate-950 scale-75'
                            : 'bg-rose-500/80 text-white border border-rose-300 animate-pulse'
                        }`}
                        style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                      >
                        {dot.caught ? '✓' : '🐛'}
                      </div>
                    ))}

                    {/* Selection rectangle */}
                    {lassoSelection?.isSelecting && (
                      <div
                        className="absolute border-2 border-dashed border-cyan-400 bg-cyan-500/20"
                        style={{
                          left: `${Math.min(lassoSelection.startX, lassoSelection.currentX)}%`,
                          top: `${Math.min(lassoSelection.startY, lassoSelection.currentY)}%`,
                          width: `${Math.abs(lassoSelection.currentX - lassoSelection.startX)}%`,
                          height: `${Math.abs(lassoSelection.currentY - lassoSelection.startY)}%`,
                        }}
                      />
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* MODE 3: BENCHMARK CPS & REFLEX LAB */}
      {activeMode === 'benchmark' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* CPS Click Speed Test */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  {lang === 'en' ? 'Click Speed Test (CPS)' : 'Test Viteză de Clic (CPS)'}
                </h3>
              </div>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  disabled={benchmarkState === 'clicking'}
                  onClick={() => setBenchmarkTime(5)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                    benchmarkTime === 5 ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  5s
                </button>
                <button
                  disabled={benchmarkState === 'clicking'}
                  onClick={() => setBenchmarkTime(10)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                    benchmarkTime === 10 ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  10s
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Measure your true Clicks Per Second (CPS). Used in e-sports and competitive mouse agility.'
                : 'Măsoară viteza pură de clicuri pe secundă (CPS). Relevanță directă pentru reflexe rapide.'}
            </p>

            {/* Click Button Area */}
            <button
              onClick={benchmarkState === 'ready' ? startBenchmark : handleBenchmarkClick}
              className={`w-full h-44 rounded-3xl font-black text-xl flex flex-col items-center justify-center transition active:scale-95 cursor-pointer shadow-inner border-2 ${
                benchmarkState === 'clicking'
                  ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white border-cyan-300 shadow-cyan-500/30'
                  : 'bg-slate-950 hover:bg-slate-850 text-slate-300 border-slate-800'
              }`}
            >
              {benchmarkState === 'ready' && (
                <>
                  <MousePointer className="w-8 h-8 text-cyan-400 mb-2 animate-bounce" />
                  <span>{lang === 'en' ? 'CLICK TO START' : 'APASĂ PENTRU A ÎNCEPE'}</span>
                  <span className="text-xs font-normal text-slate-500 mt-1 font-mono">
                    {benchmarkTime}s sprint
                  </span>
                </>
              )}

              {benchmarkState === 'clicking' && (
                <>
                  <span className="text-4xl font-mono">{benchmarkClicks}</span>
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-200 mt-1">
                    {lang === 'en' ? 'CLICKS' : 'CLICURI'} • {benchmarkTimeLeft}s rămase
                  </span>
                </>
              )}

              {benchmarkState === 'finished' && (
                <>
                  <span className="text-3xl font-mono text-cyan-300 font-bold">{benchmarkCPS} CPS</span>
                  <span className="text-xs text-slate-300 mt-1">
                    {benchmarkClicks} clicuri în {benchmarkTime}s
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold mt-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40">
                    {benchmarkCPS >= 9
                      ? 'Nivel: Legendă E-Sports ⚡'
                      : benchmarkCPS >= 6.5
                      ? 'Nivel: Gamer Avansat 🎯'
                      : benchmarkCPS >= 4.5
                      ? 'Nivel: Rapid & Agil 🖱️'
                      : 'Nivel: Începător Clasic 🌱'}
                  </span>
                </>
              )}
            </button>

            {benchmarkState === 'finished' && (
              <button
                onClick={() => setBenchmarkState('ready')}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{lang === 'en' ? 'Test Again' : 'Repetă Testul CPS'}</span>
              </button>
            )}
          </div>

          {/* Reaction Time Reflex Test */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                {lang === 'en' ? 'Twitch Reaction Time' : 'Timp de Reacție la Stimul (ms)'}
              </h3>
            </div>

            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Wait for the red card to turn bright green, then click as fast as possible!'
                : 'Așteaptă ca panoul să devină verde aprins, apoi apasă cât de repede poți!'}
            </p>

            <div
              onClick={handleReactionClick}
              className={`w-full h-44 rounded-3xl font-black text-lg flex flex-col items-center justify-center transition cursor-pointer select-none border-2 text-center p-4 ${
                reactionStage === 'wait'
                  ? 'bg-slate-950 text-slate-400 border-slate-800'
                  : reactionStage === 'ready'
                  ? 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse'
                  : reactionStage === 'green'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-2xl shadow-emerald-500/50 scale-105'
                  : reactionStage === 'too_soon'
                  ? 'bg-amber-950 text-amber-300 border-amber-600'
                  : 'bg-cyan-950 text-cyan-300 border-cyan-600'
              }`}
            >
              {reactionStage === 'wait' && (
                <>
                  <Crosshair className="w-8 h-8 text-slate-500 mb-2" />
                  <span>{lang === 'en' ? 'START REACTION TEST' : 'PORNEȘTE TESTUL DE REACȚIE'}</span>
                </>
              )}

              {reactionStage === 'ready' && (
                <>
                  <span className="text-2xl">🔴</span>
                  <span className="text-sm mt-1">{lang === 'en' ? 'WAIT FOR GREEN...' : 'AȘTEAPTĂ CULOAREA VERDE...'}</span>
                </>
              )}

              {reactionStage === 'green' && (
                <>
                  <span className="text-4xl animate-bounce">⚡</span>
                  <span className="text-2xl font-black uppercase">{lang === 'en' ? 'CLICK NOW!' : 'APASĂ ACUM!'}</span>
                </>
              )}

              {reactionStage === 'too_soon' && (
                <>
                  <span className="text-2xl">⚠️</span>
                  <span className="text-sm text-amber-200 mt-1">{lang === 'en' ? 'Too soon! Wait for green.' : 'Prea repede! Așteaptă verdele.'}</span>
                </>
              )}

              {reactionStage === 'clicked' && reactionResultMs && (
                <>
                  <span className="text-4xl font-mono font-bold text-cyan-300">{reactionResultMs} ms</span>
                  <span className="text-xs text-slate-300 mt-1">
                    {reactionResultMs < 200
                      ? '⚡ Reflex Divin (Sub 200ms)'
                      : reactionResultMs < 280
                      ? '🎯 Reflex Excelent'
                      : reactionResultMs < 350
                      ? '👍 Reflex Bun de Elev'
                      : '🐢 Ai clipit! Mai încearcă o dată.'}
                  </span>
                </>
              )}
            </div>

            <button
              onClick={startReactionTest}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>{lang === 'en' ? 'Start Reaction Attempt' : 'Lansează Încercare de Reacție'}</span>
            </button>
          </div>
        </div>
      )}

      {/* MODE 4: HARDWARE SHOP / DPI LAB */}
      {activeMode === 'shop' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase">
                <Sliders className="w-4 h-4" />
                <span>{lang === 'en' ? 'Custom Hardware Overclocking' : 'Laborator Personalizare Hardware'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-heading mt-0.5">
                {lang === 'en' ? 'Mouse Components Atelier' : 'Atelier Componente Mouse'}
              </h3>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Sold Disponibil</span>
                <span className="font-bold text-amber-300 font-mono text-base">{mouseBits} Mouse Bits 🪙</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. DPI SENSOR */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-cyan-400" />
                    <span>Senzor Optic PixArt 26.000 DPI</span>
                  </h4>
                  <span className="text-xs font-mono text-cyan-300 font-bold">Nivel {upgrades.dpiSensor} / 3</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {lang === 'en'
                    ? 'Increases target hit detection radius by +15% per upgrade, making small targets easier to strike.'
                    : 'Mărește raza de precizie a țintelor cu +15% per nivel, facilitând nimerirea țintelor mici.'}
                </p>
              </div>

              <button
                disabled={upgrades.dpiSensor >= 3 || mouseBits < 40}
                onClick={() => buyUpgrade('dpiSensor', 40)}
                className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{upgrades.dpiSensor >= 3 ? 'MAXIM' : 'Upgradează (+15% Hitbox)'}</span>
                {upgrades.dpiSensor < 3 && <span className="font-mono text-cyan-200">• 40 Bits</span>}
              </button>
            </div>

            {/* 2. OMRON SWITCHES */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Micro-switch-uri Optice Omron 50M</span>
                  </h4>
                  <span className="text-xs font-mono text-amber-300 font-bold">Nivel {upgrades.opticalSwitches} / 3</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {lang === 'en'
                    ? 'Adds a 15% chance per level to trigger a Critical Click (+15 bonus score).'
                    : 'Oferă 15% șansă per nivel de a declanșa un Clic Critic (+15 puncte bonus de precizie).'}
                </p>
              </div>

              <button
                disabled={upgrades.opticalSwitches >= 3 || mouseBits < 45}
                onClick={() => buyUpgrade('opticalSwitches', 45)}
                className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{upgrades.opticalSwitches >= 3 ? 'MAXIM' : 'Upgradează (Critical Clicks)'}</span>
                {upgrades.opticalSwitches < 3 && <span className="font-mono text-amber-200">• 45 Bits</span>}
              </button>
            </div>

            {/* 3. PTFE SKATES */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Disc className="w-4 h-4 text-emerald-400" />
                    <span>Patine PTFE Glider Pro</span>
                  </h4>
                  <span className="text-xs font-mono text-emerald-300 font-bold">Nivel {upgrades.ptfeSkates} / 3</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {lang === 'en'
                    ? 'Extends active target lifespan by +0.4 seconds per level, giving you more time to react.'
                    : 'Prelungește durata de viață a țintelor active cu +0.4 secunde per nivel, oferind mai mult timp de reacție.'}
                </p>
              </div>

              <button
                disabled={upgrades.ptfeSkates >= 3 || mouseBits < 35}
                onClick={() => buyUpgrade('ptfeSkates', 35)}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{upgrades.ptfeSkates >= 3 ? 'MAXIM' : 'Upgradează (+0.4s Ținte)'}</span>
                {upgrades.ptfeSkates < 3 && <span className="font-mono text-emerald-200">• 35 Bits</span>}
              </button>
            </div>

            {/* 4. EMP NANOCLICKER PULSE */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Puls EMP Nanoclicker (Tasta Space)</span>
                  </h4>
                  <span className="text-xs font-mono text-purple-300 font-bold">
                    {upgrades.empNanoclicker > 0 ? 'Deblocat' : 'Blocat'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {lang === 'en'
                    ? 'Unlocks tactical Spacebar ability during play to instantly blast clear a difficult active target.'
                    : 'Deblochează abilitatea activă cu tasta Spacebar pentru a distruge instant o țintă dificilă.'}
                </p>
              </div>

              <button
                disabled={upgrades.empNanoclicker >= 1 || mouseBits < 60}
                onClick={() => buyUpgrade('empNanoclicker', 60)}
                className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{upgrades.empNanoclicker >= 1 ? 'DEBLOCAT' : 'Deblochează Nanoclicker'}</span>
                {upgrades.empNanoclicker < 1 && <span className="font-mono text-purple-200">• 60 Bits</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
