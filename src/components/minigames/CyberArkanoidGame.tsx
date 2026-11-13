import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Trophy,
  RotateCcw,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Zap,
  Sparkles,
  Heart,
  Layers,
  Flame,
  Cpu
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { forceScrollToTop } from '../../utils/scrollHelper';
import { getActiveStudent, updateStudentArcadeScore } from '../../lib/studentAuthService';
import { sounds } from '../../utils/audio';

export interface CyberArkanoidGameProps {
  onBack: () => void;
  studentName?: string;
  studentAvatar?: string;
  onAwardXP?: (amount: number, reason: string) => void;
  onSaveScore?: (score: number) => void;
}

type GameState = 'menu' | 'playing' | 'paused' | 'stage_clear' | 'gameover' | 'victory';
type BrickType = 'data' | 'armor' | 'gold' | 'emp';
type PowerUpType = 'E' | 'L' | 'M' | 'P' | 'S' | 'C' | 'B' | 'H';

interface Brick {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  type: BrickType;
  hp: number;
  maxHp: number;
  color: string;
  glow: string;
  points: number;
  hitFlash: number;
}

interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  stuckToPaddle: boolean;
  stuckOffset: number;
  trail: { x: number; y: number }[];
}

interface PowerUpCapsule {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  vy: number;
  type: PowerUpType;
}

interface LaserBolt {
  x: number;
  y: number;
  vy: number;
  isEnemy?: boolean;
  vx?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

interface FloatingText {
  text: string;
  x: number;
  y: number;
  color: string;
  alpha: number;
}

interface BossCore {
  active: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  hp: number;
  maxHp: number;
  hitFlash: number;
  shootTimer: number;
}

const CANVAS_W = 480;
const CANVAS_H = 560;
const COLS = 11;
const MARGIN_X = 16;
const BRICK_W = 38;
const BRICK_H = 18;
const BRICK_GAP = 3;
const TOP_OFFSET = 54;
const PADDLE_Y = CANVAS_H - 40;
const PADDLE_NORMAL_W = 92;
const PADDLE_EXPAND_W = 138;
const PADDLE_H = 14;

const ROW_PALETTE = [
  { color: '#f43f5e', glow: '#fb7185', points: 120 }, // Rose
  { color: '#f59e0b', glow: '#fbbf24', points: 100 }, // Amber
  { color: '#10b981', glow: '#34d399', points: 90 },  // Emerald
  { color: '#06b6d4', glow: '#22d3ee', points: 80 },  // Cyan
  { color: '#8b5cf6', glow: '#a78bfa', points: 70 },  // Violet
  { color: '#ec4899', glow: '#f472b6', points: 60 },  // Pink
];

const POWERUP_META: Record<
  PowerUpType,
  {
    color: string;
    border: string;
    labelRo: string;
    labelEn: string;
    shortRo: string;
    shortEn: string;
  }
> = {
  E: {
    color: '#2563eb',
    border: '#60a5fa',
    labelRo: 'Expand (Paletă Lată)',
    labelEn: 'Expand (Wide Paddle)',
    shortRo: 'PALETĂ LATĂ',
    shortEn: 'WIDE PADDLE',
  },
  L: {
    color: '#dc2626',
    border: '#f87171',
    labelRo: 'Laser Dual Automată',
    labelEn: 'Dual Cyber Lasers',
    shortRo: 'TUNURI LASER',
    shortEn: 'LASER CANNONS',
  },
  M: {
    color: '#059669',
    border: '#34d399',
    labelRo: 'Multi-Sferă (x3)',
    labelEn: 'Multi-Ball (x3)',
    shortRo: 'MULTI-SFERĂ',
    shortEn: 'MULTI-BALL',
  },
  P: {
    color: '#ea580c',
    border: '#fb923c',
    labelRo: 'Overclock Plasmă (Străpunge)',
    labelEn: 'Plasma Overclock (Pierce)',
    shortRo: 'SFERĂ PLASMĂ',
    shortEn: 'PLASMA BALL',
  },
  S: {
    color: '#0891b2',
    border: '#22d3ee',
    labelRo: 'Răcire CPU (Încetinire)',
    labelEn: 'CPU Cooling (Slow Ball)',
    shortRo: 'RĂCIRE CPU',
    shortEn: 'SLOW-MO',
  },
  C: {
    color: '#7c3aed',
    border: '#c084fc',
    labelRo: 'Magnet (Prinde & Țintește)',
    labelEn: 'Magnet Catch (Aim)',
    shortRo: 'MAGNET ACTIV',
    shortEn: 'MAGNET CATCH',
  },
  B: {
    color: '#0d9488',
    border: '#2dd4bf',
    labelRo: 'Scut Firewall la Bază',
    labelEn: 'Bottom Firewall Shield',
    shortRo: 'SCUT BAZĂ',
    shortEn: 'FLOOR SHIELD',
  },
  H: {
    color: '#db2777',
    border: '#f472b6',
    labelRo: '+1 Viață Extra',
    labelEn: '+1 Extra Life',
    shortRo: '+1 VIAȚĂ!',
    shortEn: '+1 LIFE!',
  },
};

const STAGE_INFOS = [
  {
    nameRo: 'Sectorul 1: Boot Sector',
    nameEn: 'Stage 1: Boot Sector',
    factRo: 'Știai că? Primul joc Breakout a fost creat în 1976 de Steve Wozniak și Steve Jobs, iar Arkanoid a lansat puterile speciale în 1986!',
    factEn: 'Did you know? The original Breakout was designed in 1976 by Steve Wozniak & Steve Jobs, and Arkanoid introduced power-ups in 1986!',
  },
  {
    nameRo: 'Sectorul 2: Cetatea Firewall',
    nameEn: 'Stage 2: Firewall Citadel',
    factRo: 'Blocurile argintii necesită mai multe lovituri, exact ca un Firewall cu mai multe straturi de filtrare a pachetelor de rețea.',
    factEn: 'Silver blocks take multiple hits, just like a multi-layered Firewall inspecting network packets before letting data pass.',
  },
  {
    nameRo: 'Sectorul 3: Matricea Binară',
    nameEn: 'Stage 3: Binary Matrix',
    factRo: 'Condensatorii roșii EMP declanșează o reacție în lanț! Într-un calculator, condensatorii stochează energie electrică rapidă.',
    factEn: 'Red EMP capacitors trigger chain blasts! Inside real hardware, capacitors store and release bursts of electrical energy.',
  },
  {
    nameRo: 'Sectorul 4: Magistrala Plăcii de Bază',
    nameEn: 'Stage 4: Motherboard Bus',
    factRo: 'Magistralele (Bus) transportă semnale între CPU, RAM și placa video cu viteze de miliarde de biți pe secundă.',
    factEn: 'System buses transfer data signals between the CPU, RAM, and GPU at billions of bits per second.',
  },
  {
    nameRo: 'Sectorul 5: Invadatorul Pixel 1986',
    nameEn: 'Stage 5: Pixel Invader 1986',
    factRo: 'Pixelii sunt cele mai mici puncte luminoase ale unui ecran. Combinând roșu, verde și albastru (RGB) obținem milioane de culori!',
    factEn: 'Pixels are the smallest addressable dots on a display. Combining Red, Green, and Blue (RGB) creates millions of colors!',
  },
  {
    nameRo: 'Sectorul 6: Nucleul AI Corupt (BOSS)',
    nameEn: 'Stage 6: Rogue AI Kernel (BOSS)',
    factRo: 'Nucleul (Kernel) este inima sistemului de operare: el controlează memoria, procesorul și securitatea tuturor programelor.',
    factEn: 'The Kernel is the core of an operating system, managing memory, CPU scheduling, and security across all hardware.',
  },
];

// Build level brick layouts
function createStageBricks(stageNum: number): { bricks: Brick[]; boss: BossCore } {
  const effectiveStage = ((stageNum - 1) % 6) + 1;
  const extraHp = Math.floor((stageNum - 1) / 6); // Loop difficulty scaling
  const bricks: Brick[] = [];
  let idCounter = 1;

  const pushBrick = (r: number, c: number, type: BrickType, paletteIdx = r) => {
    const x = MARGIN_X + c * (BRICK_W + BRICK_GAP);
    const y = TOP_OFFSET + r * (BRICK_H + BRICK_GAP);
    const pal = ROW_PALETTE[paletteIdx % ROW_PALETTE.length];

    if (type === 'armor') {
      bricks.push({
        id: idCounter++,
        x,
        y,
        w: BRICK_W,
        h: BRICK_H,
        type: 'armor',
        hp: 2 + Math.min(2, extraHp + (stageNum >= 4 ? 1 : 0)),
        maxHp: 2 + Math.min(2, extraHp + (stageNum >= 4 ? 1 : 0)),
        color: '#94a3b8',
        glow: '#cbd5e1',
        points: 200,
        hitFlash: 0,
      });
    } else if (type === 'gold') {
      bricks.push({
        id: idCounter++,
        x,
        y,
        w: BRICK_W,
        h: BRICK_H,
        type: 'gold',
        hp: 999,
        maxHp: 999,
        color: '#eab308',
        glow: '#fef08a',
        points: 350,
        hitFlash: 0,
      });
    } else if (type === 'emp') {
      bricks.push({
        id: idCounter++,
        x,
        y,
        w: BRICK_W,
        h: BRICK_H,
        type: 'emp',
        hp: 1,
        maxHp: 1,
        color: '#ef4444',
        glow: '#fca5a5',
        points: 180,
        hitFlash: 0,
      });
    } else {
      bricks.push({
        id: idCounter++,
        x,
        y,
        w: BRICK_W,
        h: BRICK_H,
        type: 'data',
        hp: 1 + Math.min(1, extraHp),
        maxHp: 1 + Math.min(1, extraHp),
        color: pal.color,
        glow: pal.glow,
        points: pal.points,
        hitFlash: 0,
      });
    }
  };

  let boss: BossCore = {
    active: false,
    x: CANVAS_W / 2 - 44,
    y: 78,
    w: 88,
    h: 40,
    vx: 1.85,
    hp: 14,
    maxHp: 14,
    hitFlash: 0,
    shootTimer: 110,
  };

  if (effectiveStage === 1) {
    // Stage 1: Boot Sector - Classic colorful cyber grid with 2 EMP capacitors
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < COLS; c++) {
        if (r === 0 && (c === 0 || c === COLS - 1)) {
          pushBrick(r, c, 'armor');
        } else if (r === 3 && (c === 3 || c === 7)) {
          pushBrick(r, c, 'emp');
        } else {
          pushBrick(r, c, 'data', r);
        }
      }
    }
  } else if (effectiveStage === 2) {
    // Stage 2: Firewall Citadel - Fortified rim + inner core
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < COLS; c++) {
        if (r === 6 && c !== 5 && c !== 0 && c !== COLS - 1) {
          if (c === 2 || c === 8) pushBrick(r, c, 'gold');
          else pushBrick(r, c, 'armor');
        } else if ((c === 0 || c === COLS - 1) && r < 6) {
          pushBrick(r, c, 'armor');
        } else if (r === 2 && (c === 5 || c === 2 || c === 8)) {
          pushBrick(r, c, 'emp');
        } else if (r === 4 && c >= 3 && c <= 7) {
          pushBrick(r, c, 'data', 1);
        } else {
          pushBrick(r, c, 'data', r);
        }
      }
    }
  } else if (effectiveStage === 3) {
    // Stage 3: Binary Matrix (Checkerboard + EMP chains)
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < COLS; c++) {
        if ((r + c) % 2 === 0) {
          if (r === 7 && (c === 2 || c === 8)) pushBrick(r, c, 'gold');
          else if ((r === 2 || r === 5) && c === 5) pushBrick(r, c, 'emp');
          else if (r % 3 === 0) pushBrick(r, c, 'armor');
          else pushBrick(r, c, 'data', (r + c) % 6);
        } else if (r === 3 || r === 4) {
          pushBrick(r, c, 'data', 3);
        }
      }
    }
  } else if (effectiveStage === 4) {
    // Stage 4: Motherboard Bus - Vertical channels
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < COLS; c++) {
        if (c === 2 || c === 5 || c === 8) continue; // High-speed data channels!
        if (r === 7 && (c === 1 || c === 3 || c === 7 || c === 9)) {
          pushBrick(r, c, 'gold');
        } else if (r === 3 && (c === 0 || c === 4 || c === 6 || c === 10)) {
          pushBrick(r, c, 'emp');
        } else if (r === 0 || r === 6) {
          pushBrick(r, c, 'armor');
        } else {
          pushBrick(r, c, 'data', c);
        }
      }
    }
  } else if (effectiveStage === 5) {
    // Stage 5: Classic Pixel Space Invader Mosaic!
    const invaderMap = [
      '..X.....X..',
      '...X...X...',
      '..XXXXXXX..',
      '.XX.XXX.XX.',
      'XXXXXXXXXXX',
      'X.XXXXXXX.X',
      'X.X.....X.X',
      '...XX.XX...',
    ];
    for (let r = 0; r < invaderMap.length; r++) {
      for (let c = 0; c < COLS; c++) {
        const ch = invaderMap[r][c];
        if (ch === 'X') {
          if (r === 3 && (c === 1 || c === 9)) pushBrick(r, c, 'emp');
          else if (r === 4 && (c === 0 || c === 10)) pushBrick(r, c, 'armor');
          else if (r === 7) pushBrick(r, c, 'armor');
          else pushBrick(r, c, 'data', r % 6);
        } else if (r === 3 && (c === 3 || c === 7)) {
          // Eyes
          pushBrick(r, c, 'emp');
        }
      }
    }
  } else {
    // Stage 6: Rogue AI Kernel Boss + Shield Wall
    boss.active = true;
    boss.maxHp = 14 + extraHp * 6;
    boss.hp = boss.maxHp;
    boss.vx = 2.0 + extraHp * 0.4;

    for (let r = 4; r < 8; r++) {
      for (let c = 0; c < COLS; c++) {
        if (r === 4 && (c === 1 || c === 5 || c === 9)) {
          pushBrick(r, c, 'emp');
        } else if (r === 7 && (c === 2 || c === 8)) {
          pushBrick(r, c, 'gold');
        } else if (r === 7 && c % 2 === 1) {
          pushBrick(r, c, 'armor');
        } else if (r === 5 || r === 6) {
          pushBrick(r, c, 'data', (r + c) % 6);
        }
      }
    }
  }

  return { bricks, boss };
}

export const CyberArkanoidGame: React.FC<CyberArkanoidGameProps> = ({
  onBack,
  studentName,
  studentAvatar,
  onAwardXP,
  onSaveScore,
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const local = Number(localStorage.getItem('arkedo_highscore_cyber_arkanoid') || '0');
      const active = getActiveStudent();
      const cloud = active?.arcadeScores?.cyber_arkanoid || 0;
      return Math.max(local, cloud);
    } catch {
      return 0;
    }
  });
  const [stage, setStage] = useState(1);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [muted, setMuted] = useState(false);

  // Active powerup timers (seconds remaining for HUD)
  const [activeTimers, setActiveTimers] = useState<{
    expand: number;
    laser: number;
    plasma: number;
    slow: number;
    magnet: number;
    barrier: number;
  }>({
    expand: 0,
    laser: 0,
    plasma: 0,
    slow: 0,
    magnet: 0,
    barrier: 0,
  });

  // Canvas & Audio Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);

  // Live mutable game state inside refs for silky 60fps+ loop
  const paddleRef = useRef({
    x: CANVAS_W / 2 - PADDLE_NORMAL_W / 2,
    w: PADDLE_NORMAL_W,
    targetW: PADDLE_NORMAL_W,
    vx: 0,
    squish: 0,
  });
  const ballsRef = useRef<Ball[]>([]);
  const bricksRef = useRef<Brick[]>([]);
  const capsulesRef = useRef<PowerUpCapsule[]>([]);
  const lasersRef = useRef<LaserBolt[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const textsRef = useRef<FloatingText[]>([]);
  const bossRef = useRef<BossCore>({
    active: false,
    x: CANVAS_W / 2 - 44,
    y: 78,
    w: 88,
    h: 40,
    vx: 1.9,
    hp: 14,
    maxHp: 14,
    hitFlash: 0,
    shootTimer: 120,
  });

  const powerTimersRef = useRef({
    expand: 0,
    laser: 0,
    plasma: 0,
    slow: 0,
    magnet: 0,
    barrier: 0,
  });

  const inputRef = useRef({
    left: false,
    right: false,
    laserCooldown: 0,
  });

  const statsRef = useRef({
    score: 0,
    highScore: highScore,
    stage: 1,
    lives: 3,
    combo: 0,
    shake: 0,
    ballIdSeq: 1,
    capIdSeq: 1,
  });

  // Sync muted ref
  const mutedRef = useRef(muted);
  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    forceScrollToTop();
  }, []);

  // Prevent arrow/space page scrolling while active
  useEffect(() => {
    if (gameState !== 'playing') return;
    const prevOverflow = document.body.style.overflow;
    const handleKeyBlock = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyBlock, { passive: false });
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyBlock);
    };
  }, [gameState]);

  // Web Audio 1986 Retro Synth
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (Ctx) {
        audioCtxRef.current = new Ctx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
  }, []);

  const playTone = useCallback((freq: number, type: OscillatorType, duration: number, vol = 0.08, slideTo?: number) => {
    if (mutedRef.current || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (slideTo) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), ctx.currentTime + duration);
      }
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Ignore audio errors
    }
  }, []);

  const sfxPaddle = useCallback(() => playTone(380, 'triangle', 0.08, 0.1, 520), [playTone]);
  const sfxWall = useCallback(() => playTone(240, 'square', 0.04, 0.04), [playTone]);
  const sfxBrick = useCallback((comboCount: number) => {
    const base = 420 + Math.min(12, comboCount) * 45;
    playTone(base, 'square', 0.075, 0.06, base * 1.18);
  }, [playTone]);
  const sfxArmor = useCallback(() => playTone(190, 'sawtooth', 0.08, 0.07, 130), [playTone]);
  const sfxEmp = useCallback(() => {
    playTone(150, 'sawtooth', 0.28, 0.14, 42);
    playTone(320, 'square', 0.18, 0.08, 70);
  }, [playTone]);
  const sfxLaser = useCallback(() => playTone(980, 'sawtooth', 0.07, 0.04, 340), [playTone]);
  const sfxPowerup = useCallback(() => {
    playTone(523, 'triangle', 0.09, 0.09);
    setTimeout(() => playTone(659, 'triangle', 0.09, 0.09), 65);
    setTimeout(() => playTone(784, 'triangle', 0.14, 0.1), 130);
  }, [playTone]);
  const sfxLifeLost = useCallback(() => {
    playTone(340, 'sawtooth', 0.18, 0.1, 180);
    setTimeout(() => playTone(180, 'sawtooth', 0.3, 0.1, 75), 180);
  }, [playTone]);
  const sfxStageClear = useCallback(() => {
    [523, 659, 784, 1046].forEach((f, idx) => {
      setTimeout(() => playTone(f, 'triangle', 0.15, 0.1), idx * 95);
    });
  }, [playTone]);

  // Helper to spawn particles & texts
  const spawnParticles = (x: number, y: number, color: string, count = 10) => {
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 1.2 + Math.random() * 3.8;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 2 + Math.random() * 3,
        color,
        life: 24 + Math.random() * 14,
        maxLife: 38,
      });
    }
  };

  const addFloatingText = (text: string, x: number, y: number, color = '#38bdf8') => {
    textsRef.current.push({ text, x, y, color, alpha: 1 });
  };

  // Spawn stuck starter ball on paddle
  const resetBallOnPaddle = useCallback((stageNum: number) => {
    const p = paddleRef.current;
    p.x = CANVAS_W / 2 - p.w / 2;
    const baseSpeed = Math.min(7.8, 5.1 + (stageNum - 1) * 0.35);
    const angle = -Math.PI / 2 + (Math.random() * 0.4 - 0.2);
    ballsRef.current = [
      {
        id: statsRef.current.ballIdSeq++,
        x: p.x + p.w / 2,
        y: PADDLE_Y - 8,
        vx: Math.cos(angle) * baseSpeed,
        vy: Math.sin(angle) * baseSpeed,
        radius: 7,
        stuckToPaddle: true,
        stuckOffset: p.w / 2,
        trail: [],
      },
    ];
  }, []);

  // Load stage
  const loadStage = useCallback(
    (stageNum: number, resetScoreAndLives: boolean) => {
      const { bricks, boss } = createStageBricks(stageNum);
      bricksRef.current = bricks;
      bossRef.current = boss;
      capsulesRef.current = [];
      lasersRef.current = [];
      particlesRef.current = [];
      textsRef.current = [];
      powerTimersRef.current = { expand: 0, laser: 0, plasma: 0, slow: 0, magnet: 0, barrier: 0 };
      setActiveTimers({ expand: 0, laser: 0, plasma: 0, slow: 0, magnet: 0, barrier: 0 });
      paddleRef.current.w = PADDLE_NORMAL_W;
      paddleRef.current.targetW = PADDLE_NORMAL_W;

      if (resetScoreAndLives) {
        statsRef.current.score = 0;
        statsRef.current.lives = 3;
        statsRef.current.combo = 0;
        setScore(0);
        setLives(3);
        setCombo(0);
      }
      statsRef.current.stage = stageNum;
      setStage(stageNum);
      resetBallOnPaddle(stageNum);
    },
    [resetBallOnPaddle]
  );

  // Launch any stuck balls OR fire lasers if laser active
  const triggerActionLaunch = useCallback(() => {
    initAudio();
    let launchedAny = false;
    const baseSpeed = Math.min(7.8, 5.1 + (statsRef.current.stage - 1) * 0.35);
    ballsRef.current.forEach((b) => {
      if (b.stuckToPaddle) {
        b.stuckToPaddle = false;
        const p = paddleRef.current;
        const ratio = ((b.x - (p.x + p.w / 2)) / (p.w / 2)) * 0.9;
        const angle = -Math.PI / 2 + Math.max(-0.95, Math.min(0.95, ratio)) + (Math.abs(ratio) < 0.05 ? 0.14 : 0);
        const speedMult = powerTimersRef.current.slow > 0 ? 0.72 : 1;
        b.vx = Math.cos(angle) * baseSpeed * speedMult;
        b.vy = Math.sin(angle) * baseSpeed * speedMult;
        launchedAny = true;
      }
    });
    if (launchedAny) {
      sfxPaddle();
    } else if (powerTimersRef.current.laser > 0 && inputRef.current.laserCooldown <= 0) {
      const p = paddleRef.current;
      lasersRef.current.push({ x: p.x + 10, y: PADDLE_Y - 10, vy: -9.5 });
      lasersRef.current.push({ x: p.x + p.w - 10, y: PADDLE_Y - 10, vy: -9.5 });
      inputRef.current.laserCooldown = 14;
      sfxLaser();
    }
  }, [initAudio, sfxLaser, sfxPaddle]);

  const handleStartNewGame = () => {
    initAudio();
    sounds.playClick();
    loadStage(1, true);
    setGameState('playing');
    forceScrollToTop();
  };

  const handleNextStage = () => {
    initAudio();
    sounds.playClick();
    const next = statsRef.current.stage + 1;
    loadStage(next, false);
    setGameState('playing');
    forceScrollToTop();
  };

  // Persist final score to localStorage + cloud Firestore via studentAuthService
  const persistScore = useCallback(
    (finalScore: number, isVictory = false) => {
      if (finalScore > statsRef.current.highScore) {
        statsRef.current.highScore = finalScore;
        setHighScore(finalScore);
        try {
          localStorage.setItem('arkedo_highscore_cyber_arkanoid', String(finalScore));
        } catch {
          // ignore
        }
      }
      if (finalScore > 0) {
        updateStudentArcadeScore('cyber_arkanoid', finalScore);
        onSaveScore?.(finalScore);
      }
      if (isVictory) {
        onAwardXP?.(150, 'Cyber Arkanoid System Restored!');
      }
    },
    [onAwardXP, onSaveScore]
  );

  // Keyboard Listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        inputRef.current.left = true;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        inputRef.current.right = true;
      } else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        if (gameState === 'playing') triggerActionLaunch();
      } else if (e.key === 'p' || e.key === 'P') {
        setGameState((prev) => (prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev));
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        inputRef.current.left = false;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        inputRef.current.right = false;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [gameState, triggerActionLaunch]);

  // Pointer/Touch Move Handler directly on Canvas
  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const pointerX = (e.clientX - rect.left) * scaleX;
    const p = paddleRef.current;
    const prevX = p.x;
    p.x = Math.max(4, Math.min(CANVAS_W - p.w - 4, pointerX - p.w / 2));
    p.vx = p.x - prevX;
  };

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing') return;
    handleCanvasPointerMove(e);
    triggerActionLaunch();
  };

  // Main 60fps Canvas Game Loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();
    let hudSyncCounter = 0;

    // Damage brick helper with EMP chain explosions & capsule drops
    const hitBrick = (brick: Brick, isPlasma: boolean) => {
      if (brick.type === 'gold' && !isPlasma) {
        brick.hitFlash = 8;
        sfxArmor();
        spawnParticles(brick.x + brick.w / 2, brick.y + brick.h / 2, '#fef08a', 5);
        return false; // Indestructible normally
      }

      brick.hp = isPlasma ? 0 : brick.hp - 1;
      brick.hitFlash = 8;

      if (brick.hp <= 0) {
        statsRef.current.combo += 1;
        const mult = Math.min(4, 1 + Math.floor(statsRef.current.combo / 5));
        const earned = brick.points * mult;
        statsRef.current.score += earned;
        setScore(statsRef.current.score);
        setCombo(statsRef.current.combo);

        if (statsRef.current.score > statsRef.current.highScore) {
          statsRef.current.highScore = statsRef.current.score;
          setHighScore(statsRef.current.score);
        }

        spawnParticles(brick.x + brick.w / 2, brick.y + brick.h / 2, brick.color, 12);
        addFloatingText(
          mult > 1 ? `+${earned} x${mult}` : `+${earned}`,
          brick.x + brick.w / 2,
          brick.y + brick.h / 2,
          brick.glow
        );

        if (brick.type === 'emp') {
          sfxEmp();
          statsRef.current.shake = 10;
          addFloatingText('EMP BLAST!', brick.x + brick.w / 2, brick.y - 6, '#fca5a5');
          // Chain damage neighbors
          const cx = brick.x + brick.w / 2;
          const cy = brick.y + brick.h / 2;
          bricksRef.current.forEach((other) => {
            if (other.id !== brick.id && other.hp > 0) {
              const dist = Math.hypot(other.x + other.w / 2 - cx, other.y + other.h / 2 - cy);
              if (dist < 62) {
                other.hp = 0;
                statsRef.current.score += other.points;
                spawnParticles(other.x + other.w / 2, other.y + other.h / 2, other.color, 8);
              }
            }
          });
          setScore(statsRef.current.score);
        } else {
          sfxBrick(statsRef.current.combo);
        }

        // Power-up drop roll (~23% chance)
        if (Math.random() < 0.23) {
          const pool: PowerUpType[] = ['E', 'E', 'L', 'L', 'M', 'M', 'P', 'S', 'C', 'B', 'H'];
          const chosen = pool[Math.floor(Math.random() * pool.length)];
          capsulesRef.current.push({
            id: statsRef.current.capIdSeq++,
            x: brick.x + brick.w / 2 - 14,
            y: brick.y + brick.h / 2,
            w: 28,
            h: 15,
            vy: 2.25,
            type: chosen,
          });
        }
        return true;
      } else {
        sfxArmor();
        spawnParticles(brick.x + brick.w / 2, brick.y + brick.h / 2, '#e2e8f0', 4);
        return false;
      }
    };

    const applyPowerUp = (type: PowerUpType) => {
      sfxPowerup();
      const meta = POWERUP_META[type];
      addFloatingText(
        isEn ? meta.shortEn : meta.shortRo,
        paddleRef.current.x + paddleRef.current.w / 2,
        PADDLE_Y - 18,
        meta.border
      );
      statsRef.current.score += 100;
      setScore(statsRef.current.score);

      const timers = powerTimersRef.current;
      if (type === 'E') {
        timers.expand = 14 * 60;
        paddleRef.current.targetW = PADDLE_EXPAND_W;
      } else if (type === 'L') {
        timers.laser = 12 * 60;
      } else if (type === 'P') {
        timers.plasma = 9 * 60;
      } else if (type === 'S') {
        timers.slow = 11 * 60;
      } else if (type === 'C') {
        timers.magnet = 15 * 60;
      } else if (type === 'B') {
        timers.barrier = 14 * 60;
      } else if (type === 'H') {
        if (statsRef.current.lives < 5) {
          statsRef.current.lives += 1;
          setLives(statsRef.current.lives);
        } else {
          statsRef.current.score += 500;
          setScore(statsRef.current.score);
        }
      } else if (type === 'M') {
        // Clone balls up to max 6
        const currentBalls = [...ballsRef.current];
        const newBalls: Ball[] = [];
        currentBalls.forEach((b) => {
          if (ballsRef.current.length + newBalls.length >= 6) return;
          const spd = Math.hypot(b.vx, b.vy) || 5.4;
          const baseAng = b.stuckToPaddle ? -Math.PI / 2 : Math.atan2(b.vy, b.vx);
          [-0.36, 0.36].forEach((offset) => {
            if (ballsRef.current.length + newBalls.length < 6) {
              newBalls.push({
                id: statsRef.current.ballIdSeq++,
                x: b.x,
                y: b.y,
                vx: Math.cos(baseAng + offset) * spd,
                vy: Math.sin(baseAng + offset) * spd,
                radius: 7,
                stuckToPaddle: false,
                stuckOffset: 0,
                trail: [],
              });
            }
          });
          b.stuckToPaddle = false;
        });
        ballsRef.current.push(...newBalls);
      }
    };

    const loop = (now: number) => {
      const rawDt = (now - lastTime) / 16.6667;
      lastTime = now;
      const dt = Math.min(2.0, Math.max(0.4, rawDt));

      // 1. UPDATE TIMERS
      const timers = powerTimersRef.current;
      (Object.keys(timers) as (keyof typeof timers)[]).forEach((k) => {
        if (timers[k] > 0) {
          timers[k] = Math.max(0, timers[k] - dt);
        }
      });
      paddleRef.current.targetW = timers.expand > 0 ? PADDLE_EXPAND_W : PADDLE_NORMAL_W;
      paddleRef.current.w += (paddleRef.current.targetW - paddleRef.current.w) * 0.18 * dt;
      if (paddleRef.current.squish > 0) paddleRef.current.squish = Math.max(0, paddleRef.current.squish - 0.15 * dt);
      if (statsRef.current.shake > 0) statsRef.current.shake = Math.max(0, statsRef.current.shake - 0.6 * dt);
      if (inputRef.current.laserCooldown > 0) inputRef.current.laserCooldown -= dt;

      // Sync HUD timers ~6x/sec so React doesn't re-render every single frame
      hudSyncCounter++;
      if (hudSyncCounter % 10 === 0) {
        setActiveTimers({
          expand: Math.ceil(timers.expand / 60),
          laser: Math.ceil(timers.laser / 60),
          plasma: Math.ceil(timers.plasma / 60),
          slow: Math.ceil(timers.slow / 60),
          magnet: Math.ceil(timers.magnet / 60),
          barrier: Math.ceil(timers.barrier / 60),
        });
      }

      // 2. UPDATE PADDLE KEYBOARD / BUTTON MOVEMENT
      const p = paddleRef.current;
      const moveSpeed = 7.4 * dt;
      if (inputRef.current.left && !inputRef.current.right) {
        p.x = Math.max(4, p.x - moveSpeed);
        p.vx = -moveSpeed;
      } else if (inputRef.current.right && !inputRef.current.left) {
        p.x = Math.min(CANVAS_W - p.w - 4, p.x + moveSpeed);
        p.vx = moveSpeed;
      } else {
        p.vx *= 0.8;
      }

      // Auto-pulse lasers gently when laser powerup is active so mobile users can focus on moving
      if (timers.laser > 0 && inputRef.current.laserCooldown <= 0) {
        lasersRef.current.push({ x: p.x + 10, y: PADDLE_Y - 10, vy: -9.5 });
        lasersRef.current.push({ x: p.x + p.w - 10, y: PADDLE_Y - 10, vy: -9.5 });
        inputRef.current.laserCooldown = 26;
        sfxLaser();
      }

      // 3. UPDATE BOSS (Stage 6 / multiples of 6)
      const boss = bossRef.current;
      if (boss.active && boss.hp > 0) {
        boss.x += boss.vx * dt;
        if (boss.x <= 24) {
          boss.x = 24;
          boss.vx = Math.abs(boss.vx);
        } else if (boss.x + boss.w >= CANVAS_W - 24) {
          boss.x = CANVAS_W - 24 - boss.w;
          boss.vx = -Math.abs(boss.vx);
        }
        if (boss.hitFlash > 0) boss.hitFlash -= dt;
        boss.shootTimer -= dt;
        if (boss.shootTimer <= 0) {
          boss.shootTimer = 95;
          lasersRef.current.push({
            x: boss.x + boss.w / 2,
            y: boss.y + boss.h + 4,
            vy: 3.6,
            vx: (Math.random() - 0.5) * 1.2,
            isEnemy: true,
          });
        }
      }

      // 4. UPDATE LASERS (Player & Boss glitch bolts)
      lasersRef.current = lasersRef.current.filter((l) => {
        l.y += l.vy * dt;
        if (l.vx) l.x += l.vx * dt;

        if (l.isEnemy) {
          // Check hit paddle
          if (l.x >= p.x && l.x <= p.x + p.w && l.y >= PADDLE_Y && l.y <= PADDLE_Y + PADDLE_H) {
            sfxArmor();
            statsRef.current.shake = 5;
            spawnParticles(l.x, PADDLE_Y, '#f43f5e', 8);
            addFloatingText('GLITCH HIT!', l.x, PADDLE_Y - 10, '#f43f5e');
            p.w = Math.max(66, p.w - 10);
            return false;
          }
          return l.y < CANVAS_H + 10;
        } else {
          // Player laser vs bricks
          for (const b of bricksRef.current) {
            if (b.hp > 0 && l.x >= b.x && l.x <= b.x + b.w && l.y >= b.y && l.y <= b.y + b.h) {
              hitBrick(b, false);
              return false;
            }
          }
          // Player laser vs Boss
          if (boss.active && boss.hp > 0 && l.x >= boss.x && l.x <= boss.x + boss.w && l.y >= boss.y && l.y <= boss.y + boss.h) {
            boss.hp -= 1;
            boss.hitFlash = 8;
            sfxArmor();
            statsRef.current.score += 120;
            setScore(statsRef.current.score);
            spawnParticles(l.x, l.y, '#c084fc', 6);
            if (boss.hp <= 0) {
              boss.active = false;
              sfxEmp();
              statsRef.current.shake = 14;
              statsRef.current.score += 1500;
              setScore(statsRef.current.score);
              spawnParticles(boss.x + boss.w / 2, boss.y + boss.h / 2, '#f43f5e', 30);
            }
            return false;
          }
          return l.y > -12;
        }
      });

      // 5. UPDATE BALLS
      const targetSpeed = Math.min(7.8, 5.1 + (statsRef.current.stage - 1) * 0.35) * (timers.slow > 0 ? 0.72 : 1);
      const survivingBalls: Ball[] = [];

      for (const b of ballsRef.current) {
        if (b.stuckToPaddle) {
          b.x = p.x + Math.min(p.w - 8, Math.max(8, b.stuckOffset));
          b.y = PADDLE_Y - b.radius - 1;
          survivingBalls.push(b);
          continue;
        }

        // Normalize speed smoothly
        const curSpd = Math.hypot(b.vx, b.vy) || targetSpeed;
        b.vx = (b.vx / curSpd) * targetSpeed;
        b.vy = (b.vy / curSpd) * targetSpeed;

        // Anti-horizontal lock check
        if (Math.abs(b.vy) < targetSpeed * 0.24) {
          b.vy = (b.vy >= 0 ? 1 : -1) * targetSpeed * 0.28;
          const newSpd = Math.hypot(b.vx, b.vy);
          b.vx = (b.vx / newSpd) * targetSpeed;
          b.vy = (b.vy / newSpd) * targetSpeed;
        }

        b.trail.push({ x: b.x, y: b.y });
        if (b.trail.length > 8) b.trail.shift();

        b.x += b.vx * dt;
        b.y += b.vy * dt;

        // Wall collisions
        if (b.x - b.radius <= 2) {
          b.x = 2 + b.radius;
          b.vx = Math.abs(b.vx);
          sfxWall();
        } else if (b.x + b.radius >= CANVAS_W - 2) {
          b.x = CANVAS_W - 2 - b.radius;
          b.vx = -Math.abs(b.vx);
          sfxWall();
        }
        if (b.y - b.radius <= 2) {
          b.y = 2 + b.radius;
          b.vy = Math.abs(b.vy);
          sfxWall();
        }

        // Bottom Firewall Shield Barrier bounce
        if (timers.barrier > 0 && b.vy > 0 && b.y + b.radius >= CANVAS_H - 10) {
          b.y = CANVAS_H - 10 - b.radius;
          b.vy = -Math.abs(b.vy);
          sfxPaddle();
          spawnParticles(b.x, CANVAS_H - 10, '#2dd4bf', 8);
        }

        // Paddle collision
        if (
          b.vy > 0 &&
          b.y + b.radius >= PADDLE_Y &&
          b.y - b.radius <= PADDLE_Y + PADDLE_H &&
          b.x + b.radius >= p.x &&
          b.x - b.radius <= p.x + p.w
        ) {
          statsRef.current.combo = 0;
          setCombo(0);
          p.squish = 1;
          sfxPaddle();

          if (timers.magnet > 0) {
            b.stuckToPaddle = true;
            b.stuckOffset = b.x - p.x;
            b.y = PADDLE_Y - b.radius - 1;
            survivingBalls.push(b);
            continue;
          }

          const hitRatio = (b.x - (p.x + p.w / 2)) / (p.w / 2);
          const clampedRatio = Math.max(-0.92, Math.min(0.92, hitRatio));
          const bounceAngle = -Math.PI / 2 + clampedRatio * (Math.PI / 2.7);
          b.vx = Math.cos(bounceAngle) * targetSpeed + p.vx * 0.12;
          b.vy = Math.sin(bounceAngle) * targetSpeed;
          b.y = PADDLE_Y - b.radius - 1;
        }

        // Brick collisions
        const isPlasma = timers.plasma > 0;
        for (const br of bricksRef.current) {
          if (br.hp <= 0) continue;
          const closestX = Math.max(br.x, Math.min(b.x, br.x + br.w));
          const closestY = Math.max(br.y, Math.min(b.y, br.y + br.h));
          const dx = b.x - closestX;
          const dy = b.y - closestY;
          if (dx * dx + dy * dy <= b.radius * b.radius) {
            hitBrick(br, isPlasma);
            if (!isPlasma || br.type === 'gold') {
              // Reflect along shallowest penetration axis
              const overlapLeft = b.x + b.radius - br.x;
              const overlapRight = br.x + br.w - (b.x - b.radius);
              const overlapTop = b.y + b.radius - br.y;
              const overlapBottom = br.y + br.h - (b.y - b.radius);
              const minOverlapX = Math.min(overlapLeft, overlapRight);
              const minOverlapY = Math.min(overlapTop, overlapBottom);
              if (minOverlapX < minOverlapY) {
                b.vx = -b.vx;
              } else {
                b.vy = -b.vy;
              }
            }
            break; // One brick per frame per ball prevents corner clipping bugs
          }
        }

        // Boss collision
        if (boss.active && boss.hp > 0) {
          const cx = Math.max(boss.x, Math.min(b.x, boss.x + boss.w));
          const cy = Math.max(boss.y, Math.min(b.y, boss.y + boss.h));
          const dx = b.x - cx;
          const dy = b.y - cy;
          if (dx * dx + dy * dy <= b.radius * b.radius) {
            boss.hp -= isPlasma ? 2 : 1;
            boss.hitFlash = 10;
            statsRef.current.shake = 6;
            statsRef.current.score += 180;
            setScore(statsRef.current.score);
            sfxArmor();
            spawnParticles(cx, cy, '#f472b6', 10);
            addFloatingText('+180 CORE HIT!', cx, cy, '#f472b6');

            if (Math.abs(dx) > Math.abs(dy)) b.vx = -b.vx;
            else b.vy = -b.vy;

            if (boss.hp <= 0) {
              boss.active = false;
              sfxEmp();
              statsRef.current.shake = 16;
              statsRef.current.score += 1500;
              setScore(statsRef.current.score);
              spawnParticles(boss.x + boss.w / 2, boss.y + boss.h / 2, '#facc15', 36);
              addFloatingText('+1500 KERNEL PURGED!', boss.x + boss.w / 2, boss.y + 10, '#facc15');
            }
          }
        }

        if (b.y - b.radius < CANVAS_H + 12) {
          survivingBalls.push(b);
        }
      }

      ballsRef.current = survivingBalls;

      // Check if all balls lost
      if (ballsRef.current.length === 0) {
        sfxLifeLost();
        statsRef.current.lives -= 1;
        statsRef.current.combo = 0;
        setLives(statsRef.current.lives);
        setCombo(0);

        if (statsRef.current.lives <= 0) {
          persistScore(statsRef.current.score, false);
          setGameState('gameover');
          return;
        } else {
          // Clear dangerous powerups & reset ball
          powerTimersRef.current = { expand: 0, laser: 0, plasma: 0, slow: 0, magnet: 0, barrier: 0 };
          paddleRef.current.targetW = PADDLE_NORMAL_W;
          resetBallOnPaddle(statsRef.current.stage);
        }
      }

      // 6. UPDATE CAPSULES
      capsulesRef.current = capsulesRef.current.filter((c) => {
        c.y += c.vy * dt;
        // Catch with paddle
        if (
          c.x + c.w >= p.x &&
          c.x <= p.x + p.w &&
          c.y + c.h >= PADDLE_Y &&
          c.y <= PADDLE_Y + PADDLE_H + 4
        ) {
          applyPowerUp(c.type);
          return false;
        }
        return c.y < CANVAS_H + 20;
      });

      // Clean up dead bricks and decrement hit flash
      bricksRef.current = bricksRef.current.filter((br) => {
        if (br.hitFlash > 0) br.hitFlash = Math.max(0, br.hitFlash - dt);
        return br.hp > 0;
      });

      // Check Stage Clear condition: all non-gold bricks broken AND boss defeated
      const remainingDestructible = bricksRef.current.some((br) => br.type !== 'gold');
      const bossAlive = boss.active && boss.hp > 0;
      if (!remainingDestructible && !bossAlive) {
        sfxStageClear();
        const clearBonus = 300 * statsRef.current.stage;
        statsRef.current.score += clearBonus;
        setScore(statsRef.current.score);
        if (statsRef.current.stage === 6) {
          persistScore(statsRef.current.score, true);
          setGameState('victory');
        } else {
          persistScore(statsRef.current.score, false);
          setGameState('stage_clear');
        }
        return;
      }

      // 7. UPDATE PARTICLES & TEXTS
      particlesRef.current = particlesRef.current.filter((pt) => {
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.life -= dt;
        return pt.life > 0;
      });
      textsRef.current = textsRef.current.filter((t) => {
        t.y -= 0.75 * dt;
        t.alpha -= 0.022 * dt;
        return t.alpha > 0;
      });

      // 8. RENDER CANVAS
      ctx.save();
      if (statsRef.current.shake > 0) {
        const sx = (Math.random() - 0.5) * statsRef.current.shake;
        const sy = (Math.random() - 0.5) * statsRef.current.shake;
        ctx.translate(sx, sy);
      }

      // Deep cyber grid background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      ctx.strokeStyle = 'rgba(14, 116, 144, 0.14)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx <= CANVAS_W; gx += 32) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, CANVAS_H);
        ctx.stroke();
      }
      for (let gy = 0; gy <= CANVAS_H; gy += 32) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(CANVAS_W, gy);
        ctx.stroke();
      }

      // Outer Arcade Neon Frame
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.strokeRect(1.5, 1.5, CANVAS_W - 3, CANVAS_H - 3);

      // Draw Bricks
      bricksRef.current.forEach((br) => {
        ctx.save();
        ctx.fillStyle = br.hitFlash > 0 ? '#ffffff' : br.color;
        ctx.shadowColor = br.glow;
        ctx.shadowBlur = br.type === 'emp' ? 8 : 4;
        ctx.beginPath();
        ctx.roundRect(br.x, br.y, br.w, br.h, 4);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Top glossy highlight bevel
        ctx.fillStyle = 'rgba(255,255,255,0.28)';
        ctx.fillRect(br.x + 3, br.y + 2, br.w - 6, 3);

        // Visual affordances by brick type (Non-hue-only!)
        if (br.type === 'armor') {
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(br.x + 2, br.y + 2, br.w - 4, br.h - 4);
          if (br.hp < br.maxHp) {
            // Crack lines
            ctx.strokeStyle = '#0f172a';
            ctx.beginPath();
            ctx.moveTo(br.x + 8, br.y + 3);
            ctx.lineTo(br.x + 18, br.y + 10);
            ctx.lineTo(br.x + 26, br.y + 15);
            ctx.stroke();
          }
        } else if (br.type === 'gold') {
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(br.x + 2, br.y + 2, br.w - 4, br.h - 4);
          ctx.fillStyle = '#713f12';
          ctx.font = 'bold 9px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('LOCK', br.x + br.w / 2, br.y + br.h / 2 + 1);
        } else if (br.type === 'emp') {
          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⚡', br.x + br.w / 2, br.y + br.h / 2 + 1);
        }
        ctx.restore();
      });

      // Draw Boss Core (Stage 6)
      if (boss.active && boss.hp > 0) {
        ctx.save();
        ctx.fillStyle = boss.hitFlash > 0 ? '#ffffff' : '#7e22ce';
        ctx.strokeStyle = '#e879f9';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#d946ef';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.roundRect(boss.x, boss.y, boss.w, boss.h, 10);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#fdf4ff';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`AI KERNEL`, boss.x + boss.w / 2, boss.y + 17);

        // Boss HP bar
        const hpRatio = Math.max(0, boss.hp / boss.maxHp);
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(boss.x + 8, boss.y + 25, boss.w - 16, 7);
        ctx.fillStyle = hpRatio > 0.4 ? '#ec4899' : '#ef4444';
        ctx.fillRect(boss.x + 8, boss.y + 25, (boss.w - 16) * hpRatio, 7);
        ctx.restore();
      }

      // Draw Bottom Firewall Shield Barrier if active
      if (timers.barrier > 0) {
        const pulse = 0.65 + Math.sin(now / 120) * 0.35;
        ctx.save();
        ctx.strokeStyle = `rgba(45, 212, 191, ${pulse})`;
        ctx.lineWidth = 4;
        ctx.shadowColor = '#14b8a6';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(6, CANVAS_H - 10);
        ctx.lineTo(CANVAS_W - 6, CANVAS_H - 10);
        ctx.stroke();
        ctx.restore();
      }

      // Draw Power-Up Capsules
      capsulesRef.current.forEach((c) => {
        const meta = POWERUP_META[c.type];
        ctx.save();
        ctx.fillStyle = meta.color;
        ctx.strokeStyle = meta.border;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.roundRect(c.x, c.y, c.w, c.h, 7);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(c.type, c.x + c.w / 2, c.y + c.h / 2 + 0.5);
        ctx.restore();
      });

      // Draw Lasers
      lasersRef.current.forEach((l) => {
        ctx.save();
        ctx.fillStyle = l.isEnemy ? '#f43f5e' : '#38bdf8';
        ctx.shadowColor = l.isEnemy ? '#fb7185' : '#0ea5e9';
        ctx.shadowBlur = 8;
        if (l.isEnemy) {
          ctx.beginPath();
          ctx.arc(l.x, l.y, 4.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(l.x - 2, l.y, 4, 12);
        }
        ctx.restore();
      });

      // Draw Paddle (Vaus Cyber Craft)
      ctx.save();
      const sqY = p.squish * 3;
      const paddleGrad = ctx.createLinearGradient(p.x, PADDLE_Y, p.x, PADDLE_Y + PADDLE_H);
      paddleGrad.addColorStop(0, timers.magnet > 0 ? '#c084fc' : '#38bdf8');
      paddleGrad.addColorStop(1, timers.magnet > 0 ? '#6b21a8' : '#0369a1');
      ctx.fillStyle = paddleGrad;
      ctx.shadowColor = timers.magnet > 0 ? '#a855f7' : '#06b6d4';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.roundRect(p.x, PADDLE_Y + sqY, p.w, PADDLE_H - sqY * 0.5, 7);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Side thruster caps
      ctx.fillStyle = timers.laser > 0 ? '#ef4444' : '#facc15';
      ctx.beginPath();
      ctx.roundRect(p.x + 2, PADDLE_Y + sqY + 2, 10, PADDLE_H - 4, 4);
      ctx.roundRect(p.x + p.w - 12, PADDLE_Y + sqY + 2, 10, PADDLE_H - 4, 4);
      ctx.fill();

      // Laser turrets if active
      if (timers.laser > 0) {
        ctx.fillStyle = '#f87171';
        ctx.fillRect(p.x + 8, PADDLE_Y - 5, 4, 6);
        ctx.fillRect(p.x + p.w - 12, PADDLE_Y - 5, 4, 6);
      }
      ctx.restore();

      // Draw Balls + Trails
      const isPlasma = timers.plasma > 0;
      ballsRef.current.forEach((b) => {
        b.trail.forEach((tr, idx) => {
          const alpha = ((idx + 1) / b.trail.length) * 0.35;
          ctx.fillStyle = isPlasma ? `rgba(249, 115, 22, ${alpha})` : `rgba(34, 211, 238, ${alpha})`;
          ctx.beginPath();
          ctx.arc(tr.x, tr.y, b.radius * ((idx + 1) / b.trail.length), 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.save();
        ctx.fillStyle = isPlasma ? '#fb923c' : '#f8fafc';
        ctx.shadowColor = isPlasma ? '#ea580c' : '#22d3ee';
        ctx.shadowBlur = isPlasma ? 14 : 9;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Particles & Floating Texts
      particlesRef.current.forEach((pt) => {
        ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
      });
      ctx.globalAlpha = 1;

      textsRef.current.forEach((t) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, t.alpha);
        ctx.fillStyle = t.color;
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(t.text, t.x, t.y);
        ctx.restore();
      });

      // Prompt if ball is stuck to paddle
      if (ballsRef.current.some((b) => b.stuckToPaddle)) {
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          isEn ? 'TAP OR PRESS SPACE TO LAUNCH' : 'APASĂ ECRANUL SAU SPACE PENTRU LANSARE',
          CANVAS_W / 2,
          PADDLE_Y - 34
        );
      }

      ctx.restore();

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [gameState, isEn, persistScore, resetBallOnPaddle, sfxArmor, sfxBrick, sfxEmp, sfxLaser, sfxLifeLost, sfxPaddle, sfxPowerup, sfxStageClear, sfxWall]);

  const currentStageMeta = STAGE_INFOS[(stage - 1) % STAGE_INFOS.length];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 pb-10 select-none">
      {/* Top Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/95 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center gap-1.5 text-xs font-bold transition cursor-pointer shrink-0"
            title={isEn ? 'Back to Arcade Hub' : 'Înapoi la Arcade'}
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">{isEn ? 'Back' : 'Înapoi'}</span>
          </button>

          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-black text-white font-heading truncate flex items-center gap-2">
              <span aria-hidden="true">🧱</span>
              <span>{isEn ? 'Cyber Arkanoid: Firewall Breaker' : 'Cyber Arkanoid: Spărgătorul de Firewall'}</span>
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>{studentAvatar || '🎓'} {studentName || (isEn ? 'Cadet' : 'Elev')}</span>
              <span aria-hidden="true">·</span>
              <span className="text-cyan-400 font-semibold">{isEn ? currentStageMeta.nameEn : currentStageMeta.nameRo}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer flex items-center justify-center"
            title={muted ? (isEn ? 'Unmute Audio' : 'Pornește Sunetul') : (isEn ? 'Mute Audio' : 'Oprește Sunetul')}
          >
            {muted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>

          {(gameState === 'playing' || gameState === 'paused') && (
            <button
              type="button"
              onClick={() => setGameState((prev) => (prev === 'playing' ? 'paused' : 'playing'))}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              {gameState === 'paused' ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
              <span>{gameState === 'paused' ? (isEn ? 'Resume' : 'Continuă') : (isEn ? 'Pause' : 'Pauză')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Arena Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left/Center: Arcade Screen & Mobile Touch Controls */}
        <div className="lg:col-span-8 flex flex-col items-center gap-3">
          {/* HUD Strip above Canvas */}
          <div className="w-full max-w-[480px] grid grid-cols-4 gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-2.5 text-center shadow-lg">
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase">{isEn ? 'Score' : 'Scor'}</div>
              <div className="text-base sm:text-lg font-black text-cyan-300 font-mono tabular-nums">{score.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase">{isEn ? 'Record' : 'Record'}</div>
              <div className="text-base sm:text-lg font-black text-amber-300 font-mono tabular-nums">{highScore.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase">{isEn ? 'Stage' : 'Nivel'}</div>
              <div className="text-base sm:text-lg font-black text-emerald-300 font-mono tabular-nums">{stage}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase">{isEn ? 'Lives' : 'Vieți'}</div>
              <div className="text-sm sm:text-base font-black text-rose-400 font-mono tabular-nums flex items-center justify-center gap-0.5 mt-0.5">
                {Array.from({ length: Math.max(0, lives) }).map((_, i) => (
                  <Heart key={i} className="w-3.5 h-3.5 fill-rose-500 text-rose-400" />
                ))}
                {lives === 0 && <span>0</span>}
              </div>
            </div>
          </div>

          {/* Active Power-Up Countdown Strip */}
          {(activeTimers.expand > 0 || activeTimers.laser > 0 || activeTimers.plasma > 0 || activeTimers.slow > 0 || activeTimers.magnet > 0 || activeTimers.barrier > 0 || combo >= 3) && (
            <div className="w-full max-w-[480px] flex flex-wrap items-center justify-center gap-2 text-xs font-mono font-bold text-slate-200 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5">
              {activeTimers.expand > 0 && <span className="text-blue-400">E·{activeTimers.expand}s</span>}
              {activeTimers.laser > 0 && <span className="text-rose-400">L·{activeTimers.laser}s</span>}
              {activeTimers.plasma > 0 && <span className="text-orange-400">P·{activeTimers.plasma}s</span>}
              {activeTimers.slow > 0 && <span className="text-cyan-400">S·{activeTimers.slow}s</span>}
              {activeTimers.magnet > 0 && <span className="text-purple-400">C·{activeTimers.magnet}s</span>}
              {activeTimers.barrier > 0 && <span className="text-teal-400">B·{activeTimers.barrier}s</span>}
              {combo >= 3 && <span className="text-amber-300">COMBO x{Math.min(4, 1 + Math.floor(combo / 5))}</span>}
            </div>
          )}

          {/* Canvas Box */}
          <div className="relative w-full max-w-[480px] aspect-[480/560] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border-2 border-cyan-500/40">
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              onPointerMove={handleCanvasPointerMove}
              onPointerDown={handleCanvasPointerDown}
              className="w-full h-full block touch-none cursor-crosshair"
            />

            {/* TITLE MENU OVERLAY */}
            {gameState === 'menu' && (
              <div className="absolute inset-0 bg-slate-950/92 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 text-3xl">
                  🧱
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
                    {isEn ? 'Cyber Arkanoid 1986' : 'Cyber Arkanoid 1986'}
                  </h2>
                  <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-sm leading-relaxed">
                    {isEn
                      ? 'Deflect the Quantum Bit ball to shatter encrypted Firewall bricks across 6 stages, catch power-up capsules, and purge the Rogue AI Kernel!'
                      : 'Respinge Sfera Cuantică pentru a sparge blocurile Firewall criptate în 6 nivele, prinde capsulele bonus și învinge Nucleul AI!'}
                  </p>
                </div>

                <div className="w-full max-w-xs text-left text-xs text-slate-300 space-y-1.5 border-y border-slate-800 py-3">
                  <div>🖱️ {isEn ? 'Mouse / Touch Drag directly on screen' : 'Mouse / Glisare tactilă direct pe ecran'}</div>
                  <div>⌨️ {isEn ? 'Keys A/D or Arrows · Space to Launch' : 'Tastele A/D sau Săgeți · Space pt. Lansare'}</div>
                  <div>📱 {isEn ? 'Or use the big arcade buttons below!' : 'Sau folosește butoanele mari de mai jos!'}</div>
                </div>

                <button
                  type="button"
                  onClick={handleStartNewGame}
                  className="min-h-[48px] px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm shadow-lg shadow-cyan-500/30 transition active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>{isEn ? 'Start Game' : 'Începe Jocul'}</span>
                </button>
              </div>
            )}

            {/* PAUSE OVERLAY */}
            {gameState === 'paused' && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center gap-4">
                <Pause className="w-12 h-12 text-amber-400" />
                <h2 className="text-2xl font-black text-white">{isEn ? 'Game Paused' : 'Joc în Pauză'}</h2>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setGameState('playing')}
                    className="min-h-[44px] px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm cursor-pointer flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>{isEn ? 'Resume' : 'Continuă'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleStartNewGame}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm cursor-pointer flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{isEn ? 'Restart' : 'Reia'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* STAGE CLEAR OVERLAY */}
            {gameState === 'stage_clear' && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center gap-4">
                <Sparkles className="w-12 h-12 text-emerald-400 animate-pulse" />
                <div>
                  <div className="text-xs font-mono text-emerald-400 font-bold uppercase">
                    {isEn ? 'Sector Cleared!' : 'Sector Curățat!'}
                  </div>
                  <h2 className="text-2xl font-black text-white mt-1">
                    {isEn ? `Stage ${stage} Complete!` : `Nivelul ${stage} Complet!`}
                  </h2>
                  <p className="text-amber-300 font-mono font-bold text-sm mt-1">
                    +{300 * stage} {isEn ? 'Clear Bonus' : 'Bonus Nivel'}
                  </p>
                </div>

                <div className="max-w-xs bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 leading-relaxed">
                  <div className="font-bold text-cyan-300 mb-1 flex items-center justify-center gap-1">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>{isEn ? 'ICT Tech Byte' : 'Curiozitate TIC'}</span>
                  </div>
                  {isEn ? currentStageMeta.factEn : currentStageMeta.factRo}
                </div>

                <button
                  type="button"
                  onClick={handleNextStage}
                  className="min-h-[46px] px-7 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm shadow-lg transition active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{isEn ? `Start Stage ${stage + 1}` : `Intră în Nivelul ${stage + 1}`}</span>
                </button>
              </div>
            )}

            {/* GAME OVER / VICTORY OVERLAY */}
            {(gameState === 'gameover' || gameState === 'victory') && (
              <div className="absolute inset-0 bg-slate-950/92 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center gap-4">
                {gameState === 'victory' ? (
                  <Trophy className="w-14 h-14 text-amber-400 animate-bounce" />
                ) : (
                  <RotateCcw className="w-12 h-12 text-rose-400" />
                )}

                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    {gameState === 'victory'
                      ? isEn
                        ? 'System Restored!'
                        : 'Sistem Restaurat!'
                      : isEn
                        ? 'Firewall Breached!'
                        : 'Sfârșitul Partidei'}
                  </h2>
                  <p className="text-slate-300 text-xs sm:text-sm mt-1">
                    {gameState === 'victory'
                      ? isEn
                        ? 'You defeated the Rogue AI Kernel and cleared all 6 sectors!'
                        : 'Ai învins Nucleul AI Corupt și ai curățat toate cele 6 sectoare!'
                      : isEn
                        ? `Reached Stage ${stage}`
                        : `Ai ajuns până la Nivelul ${stage}`}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-900 border border-slate-800 rounded-2xl px-6 py-3">
                  <div>
                    <div className="text-[11px] text-slate-400">{isEn ? 'Final Score' : 'Scor Final'}</div>
                    <div className="text-xl font-black text-cyan-300 font-mono tabular-nums">{score.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">{isEn ? 'Best Record' : 'Record Personal'}</div>
                    <div className="text-xl font-black text-amber-300 font-mono tabular-nums">{highScore.toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  {gameState === 'victory' && (
                    <button
                      type="button"
                      onClick={handleNextStage}
                      className="min-h-[46px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-sm shadow-lg cursor-pointer flex items-center gap-2"
                    >
                      <Flame className="w-4 h-4" />
                      <span>{isEn ? 'Endless Overclock (Stage 7)' : 'Continuă Overclock (Nivel 7)'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleStartNewGame}
                    className="min-h-[46px] px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm shadow-lg cursor-pointer flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{isEn ? 'Play Again' : 'Joacă din Nou'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile & Touch Ergonomic Arcade Controls */}
          <div className="w-full max-w-[480px] grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onPointerDown={() => {
                initAudio();
                inputRef.current.left = true;
              }}
              onPointerUp={() => {
                inputRef.current.left = false;
              }}
              onPointerLeave={() => {
                inputRef.current.left = false;
              }}
              onPointerCancel={() => {
                inputRef.current.left = false;
              }}
              className="min-h-[54px] rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 border border-slate-700 text-white font-black flex items-center justify-center gap-1 touch-manipulation cursor-pointer shadow-md"
            >
              <ChevronLeft className="w-6 h-6" />
              <span className="text-xs sm:text-sm">{isEn ? 'LEFT' : 'STÂNGA'}</span>
            </button>

            <button
              type="button"
              onClick={triggerActionLaunch}
              className="min-h-[54px] rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-95 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 touch-manipulation cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Zap className="w-4 h-4" />
              <span>{isEn ? 'LAUNCH' : 'LANSEAZĂ'}</span>
            </button>

            <button
              type="button"
              onPointerDown={() => {
                initAudio();
                inputRef.current.right = true;
              }}
              onPointerUp={() => {
                inputRef.current.right = false;
              }}
              onPointerLeave={() => {
                inputRef.current.right = false;
              }}
              onPointerCancel={() => {
                inputRef.current.right = false;
              }}
              className="min-h-[54px] rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 border border-slate-700 text-white font-black flex items-center justify-center gap-1 touch-manipulation cursor-pointer shadow-md"
            >
              <span className="text-xs sm:text-sm">{isEn ? 'RIGHT' : 'DREAPTA'}</span>
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Right Side: Power-Up Capsule Legend & Brick Guide */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Power-Ups Reference */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <h3 className="text-sm font-black text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{isEn ? 'Power-Up Capsules' : 'Capsule Power-Up'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {(Object.keys(POWERUP_META) as PowerUpType[]).map((key) => {
                const meta = POWERUP_META[key];
                return (
                  <div key={key} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <span
                      className="w-7 h-5 rounded-md font-mono font-black text-white text-[11px] flex items-center justify-center shrink-0 border"
                      style={{ backgroundColor: meta.color, borderColor: meta.border }}
                    >
                      {key}
                    </span>
                    <span className="truncate">{isEn ? meta.labelEn : meta.labelRo}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Brick Types Guide */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <h3 className="text-sm font-black text-white mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>{isEn ? 'Firewall Bricks' : 'Tipuri de Blocuri'}</span>
            </h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-4 rounded bg-cyan-400 shrink-0" />
                <span>{isEn ? 'Data Block · 1 Hit (60–120 pts)' : 'Bloc Date · 1 Lovitură (60–120 pts)'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-4 rounded bg-slate-400 border border-slate-600 shrink-0" />
                <span>{isEn ? 'Armored Firewall · 2–3 Hits (200 pts)' : 'Firewall Blindat · 2–3 Lovituri (200 pts)'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-4 rounded bg-red-500 flex items-center justify-center text-[10px] shrink-0">⚡</span>
                <span>{isEn ? 'EMP Capacitor · Chain Explosion' : 'Condensator EMP · Explozie în Lanț'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-4 rounded bg-yellow-500 text-slate-950 font-mono font-bold text-[8px] flex items-center justify-center shrink-0">
                  LOCK
                </span>
                <span>{isEn ? 'Gold Node · Plasma Only' : 'Nod Aur · Doar cu Sferă Plasmă'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
