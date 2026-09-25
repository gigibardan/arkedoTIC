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
  HardDrive,
  Radio,
  Target,
  ShieldAlert,
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
  | 'decoy' 
  | 'triple_click' 
  | 'scroll' 
  | 'drag' 
  | 'lasso' 
  | 'boss' 
  | 'wire_trace'
  | 'timing_ring';

interface TargetItem {
  id: number;
  type: ActionType;
  x: number; // percent 10-85
  y: number; // percent 15-80
  vx?: number; // drift velocity x
  vy?: number; // drift velocity y
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
  scrollStage?: number; // e.g. 1=up, 2=down
  // For timing ring
  ringScale?: number; // 2.5 down to 1.0
  // For drag
  dragCategory?: 'cpu' | 'quarantine' | 'storage';
  // For wire trace
  wireIndex?: number; // 0, 1, 2 for multi-wire
  wireTitleRo?: string;
  wireTitleEn?: string;
}

interface LassoDot {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  caught: boolean;
}

interface ClickRipple {
  id: number;
  x: number;
  y: number;
  isMiss: boolean;
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
  const [feedbackEffect, setFeedbackEffect] = useState<{ text: string; isMiss?: boolean } | null>(null);
  const [flashRedBorder, setFlashRedBorder] = useState<boolean>(false);
  const [clickRipples, setClickRipples] = useState<ClickRipple[]>([]);

  // Targets
  const [currentTarget, setCurrentTarget] = useState<TargetItem | null>(null);
  const [lassoDots, setLassoDots] = useState<LassoDot[]>([]);
  const [lassoSelection, setLassoSelection] = useState<{ startX: number; startY: number; currentX: number; currentY: number; isSelecting: boolean } | null>(null);

  // Wire trace state
  const [wireProgress, setWireProgress] = useState<number>(0);
  const [isTracingWire, setIsTracingWire] = useState<boolean>(false);
  const [activeWireIndex, setActiveWireIndex] = useState<number>(1); // Wire 1, 2, 3

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
  const wireTrackRef = useRef<HTMLDivElement>(null);
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
      ro: 'Etapa 1: Calibrare Reflex & Viteză (Click & Dublu-Click)',
      en: 'Stage 1: Speed & Double-Click Calibration',
      descRo: 'Ținte mobile: 8 noduri ce plutesc ușor. Elimină-le cu click simplu și dublu-click rapid sub 380ms!',
      descEn: 'Drifting targets: clear 8 nodes with single clicks and fast double-taps under 380ms!',
      targetAction: 'click',
      goalCount: 8,
    },
    2: {
      ro: 'Etapa 2: Capcane Malware & Click Dreapta (Context Disarm)',
      en: 'Stage 2: Malware Traps & Context Right-Click',
      descRo: 'Atenție la capcane! Albastru = Click Dreapta, Verde = Click Stânga, Roșu = CAPCANĂ (Nu apăsa)!',
      descEn: 'Watch for traps! Blue = Right Click, Green = Left Click, Red = Trap (Do NOT click)!',
      targetAction: 'right_click',
      goalCount: 8,
    },
    3: {
      ro: 'Etapa 3: Traseu Conductori Optici (3 Cabluri de Conectat)',
      en: 'Stage 3: Optical Wire Tracing (3 Solder Cables)',
      descRo: 'Trage precis conectorul de la START până la FINISH! Conectează toate cele 3 cabluri de alimentare.',
      descEn: 'Drag connector precisely from START to FINISH! Connect all 3 power cables.',
      targetAction: 'wire_trace',
      goalCount: 3,
    },
    4: {
      ro: 'Etapa 4: Furtună de Răcire Scroll-Storm (Turbină CPU)',
      en: 'Stage 4: Scroll-Storm Dual Turbine (Mouse Wheel)',
      descRo: 'Rotește rapid de rotița mouse-ului pentru a genera 3 impulsuri de răcire la 100% contra cronometru!',
      descEn: 'Spin the mouse wheel quickly to trigger 3 cooling energy surges at 100%!',
      targetAction: 'scroll',
      goalCount: 3,
    },
    5: {
      ro: 'Etapa 5: Sortare Rapidă Drag & Quarantine (3 Destinații)',
      en: 'Stage 5: Fast Drag & Quarantine (3 Sockets)',
      descRo: 'Trage componentele CPU pe Placă, fișierele infectate în Carantină și datele pe SSD!',
      descEn: 'Drag CPU chips to Board, malware to Quarantine, and database to SSD storage!',
      targetAction: 'drag',
      goalCount: 6,
    },
    6: {
      ro: 'Etapa 6: Selecție Lasso Box Sweep (Roi de Micro-Bugs)',
      en: 'Stage 6: Lasso Sweep (Floating Bug Clusters)',
      descRo: 'Bugurile se mișcă! Trage o cutie de selecție lasso cu mouse-ul pentru a le prinde pe toate odată.',
      descEn: 'Bugs are moving! Drag a selection rectangle over the swarm to capture them all in one sweep.',
      targetAction: 'lasso',
      goalCount: 4,
    },
    7: {
      ro: 'Etapa 7: Bătălie Boss Overclock (CPS Frenzy Rush)',
      en: 'Stage 7: Overclock Boss Battle (CPS Frenzy Rush)',
      descRo: 'Nucleul Central a cedat! Spamează clickuri cu viteză maximă (CPS) pentru a-i distruge scutul în 8s!',
      descEn: 'The Core is overloading! Spam clicks with maximum speed to shatter its shield within 8s!',
      targetAction: 'boss',
      goalCount: 1,
    },
    8: {
      ro: 'Etapa 8: Frecvență Înaltă & Triplu-Click (Burst Switches)',
      en: 'Stage 8: Triple Click & High Frequency Burst',
      descRo: 'Noduri de criptare cuarț: necesită secvențe fulger de 3 clicuri rapide consecutive!',
      descEn: 'Quartz encryption nodes: require rapid 3-click bursts with crisp cadence!',
      targetAction: 'triple_click',
      goalCount: 6,
    },
    9: {
      ro: 'Etapa 9: Inele de Precizie & Ritm (Sniper Timing)',
      en: 'Stage 9: Precision Timing Rings (Sniper Timing)',
      descRo: 'Apasă exact când inelul exterior se contractă peste cercul verde central pentru acuratețe maximă!',
      descEn: 'Click precisely when the outer ring shrinks into the green core circle for maximum timing!',
      targetAction: 'timing_ring',
      goalCount: 8,
    },
    10: {
      ro: 'Etapa 10: MARELE MAESTRU CYBER 2.0 (The Ultimate Gauntlet)',
      en: 'Stage 10: ULTIMATE CYBER MASTER 2.0 (The Final Trial)',
      descRo: 'Marea finală: 4 noduri reflex + 1 cablu optic + 1 descărcare scroll + 1 mini-boss final!',
      descEn: 'The final trial: 4 reflex nodes + 1 fiber cable + 1 scroll burst + 1 final boss showdown!',
      targetAction: 'click',
      goalCount: 7,
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
    setActiveWireIndex(1);
    setIsTracingWire(false);
    setScrollCharge(0);
    spawnCampaignTarget(stageNum, 0, 1);
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
    setIsTracingWire(false);
    setScrollCharge(0);
    spawnSurvivalTarget();
    arky.triggerIdle();
  };

  // Spawn target for campaign
  const spawnCampaignTarget = (stage: number, currentHits: number, currentWireIdx: number = 1) => {
    const stageInfo = STAGE_TITLES[stage] || STAGE_TITLES[1];
    const posX = Math.floor(Math.random() * 60) + 20;
    const posY = Math.floor(Math.random() * 50) + 25;

    // PTFE upgrade adds +400ms per level
    const baseDuration = (3500 + upgrades.ptfeSkates * 400);

    let type: ActionType = stageInfo.targetAction;

    if (stage === 1) {
      type = currentHits % 2 === 0 ? 'click' : 'double_click';
    } else if (stage === 2) {
      // Stage 2 has Decoys (25% chance of trap decoy!)
      const r = Math.random();
      if (r < 0.25) {
        type = 'decoy';
      } else if (r < 0.65) {
        type = 'right_click';
      } else {
        type = 'click';
      }
    } else if (stage === 5) {
      type = 'drag';
    } else if (stage === 10) {
      // Stage 10 gauntlet progression
      if (currentHits < 4) {
        type = currentHits % 2 === 0 ? 'click' : 'double_click';
      } else if (currentHits === 4) {
        type = 'wire_trace';
      } else if (currentHits === 5) {
        type = 'scroll';
      } else {
        type = 'boss';
      }
    }

    if (type === 'lasso') {
      // Spawn 6 floating micro-dots
      const dots: LassoDot[] = [];
      for (let i = 0; i < 6; i++) {
        dots.push({
          id: i,
          x: Math.floor(Math.random() * 55) + 20,
          y: Math.floor(Math.random() * 45) + 25,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          caught: false,
        });
      }
      setLassoDots(dots);
    } else {
      setLassoDots([]);
    }

    const wireLabels = [
      { ro: 'Cablul 1/3: Fibră Optică (Cyan)', en: 'Cable 1/3: Optical Fiber (Cyan)' },
      { ro: 'Cablul 2/3: Magistrală Date (Aurie)', en: 'Cable 2/3: Data Bus (Gold)' },
      { ro: 'Cablul 3/3: Alimentare CPU (Smarald)', en: 'Cable 3/3: CPU Power Rail (Emerald)' },
    ];
    const wireMeta = wireLabels[currentWireIdx - 1] || wireLabels[0];

    const dragCategories: Array<'cpu' | 'quarantine' | 'storage'> = ['cpu', 'quarantine', 'storage'];
    const selectedDragCat = dragCategories[Math.floor(Math.random() * dragCategories.length)];

    const newTarget: TargetItem = {
      id: Date.now(),
      type,
      x: posX,
      y: posY,
      vx: stage === 1 ? (Math.random() - 0.5) * 0.3 : 0,
      vy: stage === 1 ? (Math.random() - 0.5) * 0.3 : 0,
      labelRo: getActionLabelRo(type),
      labelEn: getActionLabelEn(type),
      icon: getActionIcon(type),
      spawnTime: Date.now(),
      duration: type === 'boss' ? 9000 : type === 'wire_trace' ? 14000 : baseDuration,
      clicksNeeded: type === 'triple_click' ? 3 : type === 'double_click' ? 2 : 1,
      currentClicks: 0,
      targetRadius: 40 + upgrades.dpiSensor * 6,
      maxHealth: type === 'boss' ? 32 : undefined,
      currentHealth: type === 'boss' ? 32 : undefined,
      currentScroll: 0,
      targetScroll: 100,
      dragCategory: selectedDragCat,
      wireIndex: currentWireIdx,
      wireTitleRo: wireMeta.ro,
      wireTitleEn: wireMeta.en,
    };

    setCurrentTarget(newTarget);
    setWireProgress(0);
    setIsTracingWire(false);
    setScrollCharge(0);
  };

  // Spawn target for survival frenzy
  const spawnSurvivalTarget = () => {
    const posX = Math.floor(Math.random() * 60) + 20;
    const posY = Math.floor(Math.random() * 50) + 25;

    const types: ActionType[] = ['click', 'double_click', 'right_click', 'triple_click', 'scroll', 'drag', 'timing_ring'];
    const isBoss = Math.random() < 0.12;
    const chosenType = isBoss ? 'boss' : types[Math.floor(Math.random() * types.length)];

    const baseDuration = (3200 + upgrades.ptfeSkates * 400);

    const dragCategories: Array<'cpu' | 'quarantine' | 'storage'> = ['cpu', 'quarantine', 'storage'];
    const selectedDragCat = dragCategories[Math.floor(Math.random() * dragCategories.length)];

    const newTarget: TargetItem = {
      id: Date.now(),
      type: chosenType,
      x: posX,
      y: posY,
      labelRo: getActionLabelRo(chosenType),
      labelEn: getActionLabelEn(chosenType),
      icon: getActionIcon(chosenType),
      spawnTime: Date.now(),
      duration: chosenType === 'boss' ? 8500 : baseDuration,
      clicksNeeded: chosenType === 'triple_click' ? 3 : chosenType === 'double_click' ? 2 : 1,
      currentClicks: 0,
      targetRadius: 40 + upgrades.dpiSensor * 6,
      maxHealth: chosenType === 'boss' ? 24 : undefined,
      currentHealth: chosenType === 'boss' ? 24 : undefined,
      currentScroll: 0,
      targetScroll: 100,
      dragCategory: selectedDragCat,
    };

    setCurrentTarget(newTarget);
    setWireProgress(0);
    setIsTracingWire(false);
    setScrollCharge(0);
  };

  const getActionLabelRo = (type: ActionType) => {
    switch (type) {
      case 'double_click': return 'Dublu-Click!';
      case 'triple_click': return 'Triplu-Click Fulger!';
      case 'right_click': return 'Click Dreapta!';
      case 'decoy': return '⚠️ CAPCANĂ - NU APĂSA!';
      case 'scroll': return 'Rotește Rotița Mouse!';
      case 'drag': return 'Trage în Destinație!';
      case 'lasso': return 'Încercuiește Bugurile!';
      case 'boss': return 'CLICK SPAM BOSS!';
      case 'wire_trace': return 'Trage firul de la START!';
      case 'timing_ring': return 'Apasă în Cercul Verde!';
      default: return 'Click Stânga!';
    }
  };

  const getActionLabelEn = (type: ActionType) => {
    switch (type) {
      case 'double_click': return 'Double Click!';
      case 'triple_click': return 'Triple Click Burst!';
      case 'right_click': return 'Right Click Disarm!';
      case 'decoy': return '⚠️ TRAP - DO NOT CLICK!';
      case 'scroll': return 'Scroll Wheel!';
      case 'drag': return 'Drag to Socket!';
      case 'lasso': return 'Lasso Sweep Swarm!';
      case 'boss': return 'CLICK SPAM BOSS!';
      case 'wire_trace': return 'Drag wire from START!';
      case 'timing_ring': return 'Hit in Green Ring!';
      default: return 'Left Click!';
    }
  };

  const getActionIcon = (type: ActionType) => {
    switch (type) {
      case 'double_click': return '⚡⚡';
      case 'triple_click': return '⚡⚡⚡';
      case 'right_click': return '🖱️👆';
      case 'decoy': return '☠️';
      case 'scroll': return '🎚️';
      case 'drag': return '📦';
      case 'lasso': return '🎯';
      case 'boss': return '👾';
      case 'wire_trace': return '〰️';
      case 'timing_ring': return '🎯';
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

  // Target drift & expiration timer
  useEffect(() => {
    if (gameState !== 'playing' || !currentTarget) return;

    const checkInterval = setInterval(() => {
      const now = Date.now();
      // Target expiration
      if (now - currentTarget.spawnTime > currentTarget.duration) {
        if (currentTarget.type === 'decoy') {
          // Decoys expiring without being clicked is a SUCCESS!
          sounds.playCorrect();
          registerSuccess(15, 'CAPCANĂ EVITATĂ! +15');
          return;
        }

        // Target expired - registered as miss with penalties
        registerMiss();
        if (activeMode === 'campaign') {
          spawnCampaignTarget(currentStage, hitsCount, activeWireIndex);
        } else {
          spawnSurvivalTarget();
        }
      }

      // Drift physics for Stage 1 targets
      if (currentTarget.vx || currentTarget.vy) {
        setCurrentTarget((prev) => {
          if (!prev) return null;
          let nx = prev.x + (prev.vx || 0);
          let ny = prev.y + (prev.vy || 0);
          let nvx = prev.vx || 0;
          let nvy = prev.vy || 0;
          if (nx < 15 || nx > 80) nvx = -nvx;
          if (ny < 20 || ny > 75) nvy = -nvy;
          return { ...prev, x: nx, y: ny, vx: nvx, vy: nvy };
        });
      }

      // Lasso floating bug swarm movement
      if (lassoDots.length > 0) {
        setLassoDots((prev) =>
          prev.map((d) => {
            let nx = d.x + d.vx;
            let ny = d.y + d.vy;
            let nvx = d.vx;
            let nvy = d.vy;
            if (nx < 15 || nx > 80) nvx = -nvx;
            if (ny < 20 || ny > 75) nvy = -nvy;
            return { ...d, x: nx, y: ny, vx: nvx, vy: nvy };
          })
        );
      }
    }, 80);

    return () => clearInterval(checkInterval);
  }, [gameState, currentTarget, activeMode, currentStage, hitsCount, activeWireIndex, lassoDots]);

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

    // Earn Mouse Bits for hardware shop (1 Bit per 25 pts)
    const earnedBits = Math.max(1, Math.floor(totalAwarded / 20));
    setMouseBits((prev) => {
      const updated = prev + earnedBits;
      try {
        localStorage.setItem('arkedo_mousev2_bits', String(updated));
      } catch {}
      return updated;
    });

    if (isCritical) {
      setFeedbackEffect({ text: `CRITICAL! +${totalAwarded} pts` });
    } else if (customMessage) {
      setFeedbackEffect({ text: customMessage });
    } else {
      setFeedbackEffect({ text: `+${totalAwarded}` });
    }
    setTimeout(() => setFeedbackEffect(null), 700);

    // Check campaign progression
    if (activeMode === 'campaign') {
      const stageInfo = STAGE_TITLES[currentStage] || STAGE_TITLES[1];
      if (newHits >= stageInfo.goalCount) {
        completeStage();
      } else {
        spawnCampaignTarget(currentStage, newHits, activeWireIndex);
      }
    } else {
      spawnSurvivalTarget();
    }
  };

  // HANDLE MISS CLICK (NOW WITH VISUAL & SCORE PENALTY AS REQUESTED)
  const registerMiss = (clickCoords?: { x: number; y: number }) => {
    sounds.playWrong();
    setCombo(0);
    setMissesCount((prev) => prev + 1);

    // Score deduction penalty (-5 pts, minimum 0)
    setScore((prev) => Math.max(0, prev - 5));

    // Visual penalty: red border flash
    setFlashRedBorder(true);
    setTimeout(() => setFlashRedBorder(false), 350);

    // Floating text indicator
    setFeedbackEffect({ text: '-5 pts (RATAT)', isMiss: true });
    setTimeout(() => setFeedbackEffect(null), 650);

    // Spawn red click ripple if coords provided
    if (clickCoords) {
      const ripId = Date.now();
      setClickRipples((prev) => [...prev, { id: ripId, x: clickCoords.x, y: clickCoords.y, isMiss: true }]);
      setTimeout(() => {
        setClickRipples((prev) => prev.filter((r) => r.id !== ripId));
      }, 500);
    }
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
    updateActiveArcadeScore('mouse_v2', finalScore);
  };

  // Left click on target
  const handleTargetLeftClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (gameState !== 'playing' || !currentTarget) return;

    if (currentTarget.type === 'decoy') {
      // Clicked on a decoy trap! Major penalty!
      setScore((prev) => Math.max(0, prev - 10));
      setFeedbackEffect({ text: '⚠️ CAPCANĂ ACTIVATĂ! -10', isMiss: true });
      setTimeout(() => setFeedbackEffect(null), 800);
      sounds.playWrong();
      setFlashRedBorder(true);
      setTimeout(() => setFlashRedBorder(false), 400);
      spawnCampaignTarget(currentStage, hitsCount, activeWireIndex);
      return;
    }

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
    } else if (currentTarget.type === 'timing_ring') {
      // Precision Timing Ring
      registerSuccess(35, 'PERFECT TIMING!');
    } else if (currentTarget.type === 'boss') {
      // Boss click spam
      sounds.playClick();
      const newHealth = (currentTarget.currentHealth || 1) - 1;
      if (newHealth <= 0) {
        registerSuccess(60, 'BOSS OVERCLOCK DISTRUS!');
      } else {
        setCurrentTarget({
          ...currentTarget,
          currentHealth: newHealth,
        });
      }
    } else if (currentTarget.type === 'right_click') {
      // Player did left click on a right-click target!
      const rect = arenaRef.current?.getBoundingClientRect();
      const clickCoords = rect ? { x: e.clientX - rect.left, y: e.clientY - rect.top } : undefined;
      registerMiss(clickCoords);
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
      const rect = arenaRef.current?.getBoundingClientRect();
      const clickCoords = rect ? { x: e.clientX - rect.left, y: e.clientY - rect.top } : undefined;
      registerMiss(clickCoords);
    }
  };

  // Wheel scroll on target or arena
  const handleWheel = (e: React.WheelEvent) => {
    if (gameState !== 'playing' || !currentTarget || currentTarget.type !== 'scroll') return;
    e.preventDefault();

    const scrollDelta = Math.abs(e.deltaY) * (1 + upgrades.titanWheel * 0.4);
    const newCharge = Math.min(100, scrollCharge + scrollDelta * 0.18);
    setScrollCharge(newCharge);

    if (newCharge >= 100) {
      registerSuccess(35, 'TURBINĂ RĂCITĂ 100%!');
    }
  };

  // Arena miss click (clicked empty space in arena)
  const handleArenaClick = (e: React.MouseEvent) => {
    if (gameState !== 'playing') return;
    const rect = arenaRef.current?.getBoundingClientRect();
    const clickCoords = rect ? { x: e.clientX - rect.left, y: e.clientY - rect.top } : undefined;
    registerMiss(clickCoords);
  };

  // EMP Nanoclicker active power (Spacebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && gameState === 'playing' && upgrades.empNanoclicker > 0 && empReady) {
        e.preventDefault();
        sounds.playVictory();
        setEmpReady(false);
        setFeedbackEffect({ text: '⚡ EMP PULSE ACTIVATED!' });
        setTimeout(() => setFeedbackEffect(null), 900);
        registerSuccess(25, 'EMP CLEAR!');
        setTimeout(() => setEmpReady(true), 25000);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, empReady, upgrades.empNanoclicker]);

  // ==========================================
  // STEP 3: FLAWLESS WIRE TRACING IMPLEMENTATION
  // ==========================================
  const handleWireStartMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentTarget?.type !== 'wire_trace' || gameState !== 'playing') return;
    setIsTracingWire(true);
    sounds.playClick();
  };

  // Global cursor tracker while tracing wire to guarantee 100% smooth dragging
  useEffect(() => {
    if (!isTracingWire) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!wireTrackRef.current) return;
      const rect = wireTrackRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const width = rect.width;

      // Calculate percentage clamped between 0 and 100
      const currentPct = Math.max(0, Math.min(100, (relativeX / width) * 100));
      setWireProgress(currentPct);

      // Check if finished (reached >= 95% of distance)
      if (currentPct >= 95) {
        setIsTracingWire(false);
        sounds.playVictory();

        if (activeMode === 'campaign' && currentStage === 3) {
          if (activeWireIndex < 3) {
            const nextIdx = activeWireIndex + 1;
            setActiveWireIndex(nextIdx);
            setFeedbackEffect({ text: `CABLU ${activeWireIndex}/3 CONECTAT!` });
            setTimeout(() => setFeedbackEffect(null), 800);
            spawnCampaignTarget(3, hitsCount + 1, nextIdx);
          } else {
            registerSuccess(45, 'CIRCUITE ALIMENTATE 100%!');
          }
        } else {
          registerSuccess(40, 'CIRCUIT SOLDERED!');
        }
      }
    };

    const handleGlobalMouseUp = () => {
      if (isTracingWire) {
        setIsTracingWire(false);
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isTracingWire, activeMode, currentStage, activeWireIndex, hitsCount]);

  // ==========================================
  // STEP 6: LASSO BOX SELECTION LOGIC
  // ==========================================
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
      const caughtCount = lassoDots.filter((d) => d.caught).length;
      if (caughtCount >= 4) {
        registerSuccess(40, `LASSO SWEEP (${caughtCount}/6 BUGS)!`);
      } else {
        sounds.playWrong();
        registerMiss();
      }
    }
  };

  // ==========================================
  // STEP 5: DRAG & DROP SORTING LOGIC
  // ==========================================
  const handleDragStart = (e: React.DragEvent, category: 'cpu' | 'quarantine' | 'storage') => {
    e.dataTransfer.setData('text/plain', category);
    sounds.playClick();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnZone = (e: React.DragEvent, zoneType: 'cpu' | 'quarantine' | 'storage') => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (data === zoneType) {
      registerSuccess(30, 'SORTARE CORECTĂ!');
    } else {
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                PRO LAB
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'en'
                ? 'Circuit Tracing, Scroll-Storm, Lasso Sweep, Boss CPS & Hardware Upgrades'
                : 'Circuite optice, Scroll-Storm, Selecție Lasso, Boși CPS și Atelier Hardware'}
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
              ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-600/30'
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
              ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30'
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
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30'
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
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/30 font-bold scale-105'
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
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Etapa {currentStage} / 10
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400 font-bold">
                  {lang === 'en' ? STAGE_TITLES[currentStage]?.en : STAGE_TITLES[currentStage]?.ro}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mt-1">
                {lang === 'en' ? STAGE_TITLES[currentStage]?.descEn : STAGE_TITLES[currentStage]?.descRo}
              </h3>
            </div>

            {gameState === 'idle' && (
              <button
                onClick={() => startCampaignStage(currentStage)}
                className="px-6 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm transition flex items-center gap-2 shadow-xl shadow-cyan-500/20 cursor-pointer shrink-0"
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
                ? 'Targets evolve rapidly: Single clicks, fast double-taps, context right-click, wire soldering, and boss encounters. Misses now deduct -5 points! Keep your combo streak alive.'
                : 'Țintele se schimbă constant: clicuri simple, dublu-clic rapid, dezactivare click dreapta, circuite optice și boși overclock. Atenție: Clicurile greșite scad -5 puncte!'}
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
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Ținte & Erori</span>
              <span className="text-lg font-black font-mono flex items-center justify-center gap-1.5">
                <span className="text-cyan-300">🎯 {hitsCount}</span>
                <span className="text-rose-400 text-xs font-normal">({missesCount} ratări)</span>
              </span>
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

          {/* Interactive Game Arena with Flash Red Border on Miss */}
          <div
            ref={arenaRef}
            onClick={handleArenaClick}
            onWheel={handleWheel}
            onMouseDown={currentTarget?.type === 'lasso' ? handleLassoMouseDown : undefined}
            onMouseMove={currentTarget?.type === 'lasso' ? handleLassoMouseMove : undefined}
            onMouseUp={currentTarget?.type === 'lasso' ? handleLassoMouseUp : undefined}
            className={`relative w-full h-[380px] sm:h-[440px] bg-slate-950 border-2 rounded-3xl overflow-hidden cursor-crosshair transition-all duration-150 shadow-inner select-none ${
              flashRedBorder
                ? 'border-rose-500 ring-4 ring-rose-500/30 shadow-2xl shadow-rose-950/80'
                : gameState === 'playing'
                ? 'border-cyan-500/30'
                : 'border-slate-800'
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

            {/* Click Ripples for Visual Feedback on Miss */}
            {clickRipples.map((rip) => (
              <div
                key={rip.id}
                className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-rose-500 bg-rose-500/20 animate-ping z-20"
                style={{ left: `${rip.x}px`, top: `${rip.y}px` }}
              />
            ))}

            {/* Float feedback popup (Green on hit, Red on miss) */}
            {feedbackEffect && (
              <div className={`absolute top-6 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-xl font-mono text-xs font-bold shadow-2xl animate-bounce pointer-events-none border ${
                feedbackEffect.isMiss
                  ? 'bg-rose-950/95 border-rose-500 text-rose-300'
                  : 'bg-slate-900/90 border-amber-500/40 text-amber-300'
              }`}>
                {feedbackEffect.text}
              </div>
            )}

            {/* IDLE SCREEN OVERLAY */}
            {gameState === 'idle' && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-3xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-3xl mb-3 shadow-xl">
                  🖱️
                </div>
                <h3 className="text-xl font-black text-white font-heading">
                  {lang === 'en' ? 'Mouse Master Lab Ready' : 'Laboratorul de Mouse Este Pregătit'}
                </h3>
                <p className="text-xs text-slate-400 max-w-md mt-1 leading-relaxed">
                  {lang === 'en'
                    ? 'Test reflexes and accuracy. Watch for action types: left click, double click, right click disarm, wheel scroll, and boss encounters.'
                    : 'Antrenează reflexele și precizia. Atenție la tipurile de noduri: click stânga, dublu-click, click dreapta, rotiță scroll și bătălii cu boși.'}
                </p>
                <button
                  onClick={() => {
                    if (activeMode === 'campaign') {
                      startCampaignStage(currentStage);
                    } else {
                      startSurvivalFrenzy();
                    }
                  }}
                  className="mt-5 px-7 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm transition flex items-center gap-2 shadow-xl shadow-cyan-500/20 cursor-pointer"
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
                      className="px-6 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/30"
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
                    className="px-6 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/30"
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
                {/* 1. REGULAR CLICK / DOUBLE / TRIPLE / RIGHT CLICK / DECOY */}
                {(currentTarget.type === 'click' ||
                  currentTarget.type === 'double_click' ||
                  currentTarget.type === 'triple_click' ||
                  currentTarget.type === 'right_click' ||
                  currentTarget.type === 'decoy') && (
                  <div
                    onClick={handleTargetLeftClick}
                    onContextMenu={handleTargetRightClick}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex flex-col items-center justify-center font-bold transition-transform cursor-pointer shadow-2xl active:scale-95 group ${
                      currentTarget.type === 'decoy'
                        ? 'bg-rose-950/90 border-2 border-rose-500 text-rose-300 animate-pulse shadow-rose-950/60'
                        : currentTarget.type === 'right_click'
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

                {/* 2. TIMING RING TARGET (STAGE 9) */}
                {currentTarget.type === 'timing_ring' && (
                  <div
                    onClick={handleTargetLeftClick}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full flex items-center justify-center cursor-pointer z-10"
                    style={{ left: `${currentTarget.x}%`, top: `${currentTarget.y}%` }}
                  >
                    {/* Concentric shrinking animated ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-75" />
                    <div className="w-14 h-14 rounded-full bg-emerald-500/80 border-2 border-emerald-300 flex items-center justify-center text-xl shadow-xl shadow-emerald-500/40">
                      🎯
                    </div>
                  </div>
                )}

                {/* 3. BOSS CLICK SPAM ENCOUNTER */}
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

                {/* 4. SCROLL-STORM WHEEL TARGET */}
                {currentTarget.type === 'scroll' && (
                  <div
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-48 p-5 rounded-3xl bg-slate-900/95 border-2 border-cyan-400 flex flex-col items-center shadow-2xl text-center z-10"
                    style={{
                      left: `${currentTarget.x}%`,
                      top: `${currentTarget.y}%`,
                    }}
                  >
                    <span className="text-3xl animate-bounce">🎚️</span>
                    <span className="text-xs font-black text-cyan-300 uppercase font-mono mt-1">
                      {lang === 'en' ? 'SPIN WHEEL RAPIDLY!' : 'ROTEȘTE ROTIȚA MOUSE!'}
                    </span>
                    <div className="w-full bg-slate-950 rounded-full h-4 mt-3 overflow-hidden border border-cyan-500/40 p-0.5">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all"
                        style={{ width: `${scrollCharge}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-cyan-200 mt-2 font-bold">
                      {Math.round(scrollCharge)}% / 100%
                    </span>
                  </div>
                )}

                {/* 5. WIRE TRACING (FIXED & FULLY INTERACTIVE WITH GLOBAL LISTENER) */}
                {currentTarget.type === 'wire_trace' && (
                  <div
                    className="absolute inset-6 sm:inset-10 border-2 border-cyan-500/30 rounded-3xl bg-slate-900/90 backdrop-blur-md flex flex-col justify-between p-5 pointer-events-auto shadow-2xl z-20"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                        <span className="text-xs font-mono font-bold text-cyan-300 uppercase">
                          {lang === 'en' ? currentTarget.wireTitleEn : currentTarget.wireTitleRo}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-300">
                        Progres: {Math.round(wireProgress)}%
                      </span>
                    </div>

                    <div className="text-center my-2">
                      <span className="text-xs text-slate-300 font-semibold">
                        {lang === 'en'
                          ? 'Click & HOLD the START terminal and drag your mouse smoothly to FINISH!'
                          : 'Apasă și ȚINE APĂSAT pe borna START, apoi trage cursorul lin până la borna FINISH!'}
                      </span>
                    </div>

                    {/* Interactive Wire Track */}
                    <div
                      ref={wireTrackRef}
                      className="relative w-full h-16 bg-slate-950 rounded-2xl border-2 border-slate-700 overflow-hidden flex items-center px-4"
                    >
                      {/* Internal conduit guide line */}
                      <div className="absolute left-6 right-6 h-2 bg-slate-800 rounded-full" />

                      {/* Glowing Filled Electric Cable */}
                      <div
                        className="absolute left-6 h-3.5 rounded-full bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 shadow-lg shadow-cyan-500/50 transition-all duration-75"
                        style={{
                          width: `calc(${wireProgress}% * 0.88)`,
                        }}
                      />

                      {/* START TERMINAL */}
                      <div
                        onMouseDown={handleWireStartMouseDown}
                        className={`absolute left-2 z-20 w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black text-[10px] cursor-grab active:cursor-grabbing shadow-xl transition-transform ${
                          isTracingWire
                            ? 'bg-amber-400 text-slate-950 scale-110 shadow-amber-500/50 animate-pulse'
                            : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                        }`}
                        title="Click & Drag"
                      >
                        <span>START</span>
                        <MousePointer className="w-3 h-3 mt-0.5" />
                      </div>

                      {/* Moving Cable Head indicator */}
                      {isTracingWire && (
                        <div
                          className="absolute z-20 w-8 h-8 -translate-x-1/2 rounded-full bg-amber-300 border-2 border-white shadow-xl shadow-amber-400/80 pointer-events-none animate-ping"
                          style={{ left: `calc(1rem + ${wireProgress}% * 0.88)` }}
                        />
                      )}

                      {/* FINISH TERMINAL */}
                      <div
                        className={`absolute right-2 z-10 w-12 h-12 rounded-xl border-2 flex flex-col items-center justify-center font-black text-[10px] transition-all ${
                          wireProgress >= 95
                            ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-emerald-500/50 scale-105'
                            : 'bg-slate-900 text-slate-400 border-slate-700'
                        }`}
                      >
                        <span>FINISH</span>
                        <Zap className="w-3 h-3 mt-0.5" />
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. DRAG & DROP SORTING TARGET (3 DESTINATIONS) */}
                {currentTarget.type === 'drag' && (
                  <div
                    className="absolute inset-4 flex flex-col justify-between p-3 pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="text-center">
                      <span className="text-xs font-mono font-bold text-cyan-300 uppercase">
                        {lang === 'en'
                          ? 'Drag module into the matching hardware socket!'
                          : 'Trage modulul în soclul hardware corespunzător!'}
                      </span>
                    </div>

                    {/* Draggable Component */}
                    <div className="flex justify-center my-2">
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, currentTarget.dragCategory || 'cpu')}
                        className={`px-5 py-3 rounded-2xl border-2 text-white font-bold text-xs flex items-center gap-2.5 cursor-grab active:cursor-grabbing shadow-2xl animate-pulse ${
                          currentTarget.dragCategory === 'cpu'
                            ? 'bg-emerald-600 border-emerald-300 shadow-emerald-600/40'
                            : currentTarget.dragCategory === 'quarantine'
                            ? 'bg-rose-600 border-rose-300 shadow-rose-600/40'
                            : 'bg-blue-600 border-cyan-300 shadow-blue-600/40'
                        }`}
                      >
                        {currentTarget.dragCategory === 'cpu' ? (
                          <>
                            <Cpu className="w-5 h-5" />
                            <span>{lang === 'en' ? 'Clean CPU Processor' : 'Procesor CPU Curat'}</span>
                          </>
                        ) : currentTarget.dragCategory === 'quarantine' ? (
                          <>
                            <ShieldAlert className="w-5 h-5" />
                            <span>{lang === 'en' ? 'Malware Trojan .EXE' : 'Troian Infectat .EXE'}</span>
                          </>
                        ) : (
                          <>
                            <HardDrive className="w-5 h-5" />
                            <span>{lang === 'en' ? 'Backup NVMe Drive' : 'Stocare SSD NVMe'}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* 3 Drop Targets */}
                    <div className="grid grid-cols-3 gap-3">
                      <div
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDropOnZone(e, 'cpu')}
                        className="h-24 rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-950/20 flex flex-col items-center justify-center p-2 text-center transition hover:bg-emerald-950/40"
                      >
                        <Cpu className="w-6 h-6 text-emerald-400 mb-1" />
                        <span className="text-[11px] font-bold text-emerald-300 font-mono">
                          {lang === 'en' ? 'Motherboard CPU' : 'Placă de Bază CPU'}
                        </span>
                      </div>

                      <div
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDropOnZone(e, 'quarantine')}
                        className="h-24 rounded-2xl border-2 border-dashed border-rose-400 bg-rose-950/20 flex flex-col items-center justify-center p-2 text-center transition hover:bg-rose-950/40"
                      >
                        <Trash2 className="w-6 h-6 text-rose-400 mb-1" />
                        <span className="text-[11px] font-bold text-rose-300 font-mono">
                          {lang === 'en' ? 'Firewall Quarantine' : 'Carantină Firewall'}
                        </span>
                      </div>

                      <div
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDropOnZone(e, 'storage')}
                        className="h-24 rounded-2xl border-2 border-dashed border-cyan-400 bg-cyan-950/20 flex flex-col items-center justify-center p-2 text-center transition hover:bg-cyan-950/40"
                      >
                        <HardDrive className="w-6 h-6 text-cyan-400 mb-1" />
                        <span className="text-[11px] font-bold text-cyan-300 font-mono">
                          {lang === 'en' ? 'NVMe Storage' : 'Unitate NVMe SSD'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. LASSO SELECTION BUG CLUSTER (STAGE 6) */}
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
