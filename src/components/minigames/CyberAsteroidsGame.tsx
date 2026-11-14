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
  ChevronUp,
  Zap,
  Shield,
  Sparkles,
  Heart,
  Crosshair,
  Flame,
  Cpu,
  Rocket
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { forceScrollToTop } from '../../utils/scrollHelper';
import { getActiveStudent, updateStudentArcadeScore } from '../../lib/studentAuthService';
import { sounds } from '../../utils/audio';

export interface CyberAsteroidsGameProps {
  onBack: () => void;
  studentName?: string;
  studentAvatar?: string;
  onAwardXP?: (amount: number, reason: string) => void;
  onSaveScore?: (score: number) => void;
}

type GameState = 'menu' | 'playing' | 'paused' | 'gameover';
type ShipClass = 'viper' | 'phantom' | 'titan';
type PowerUpType = 'T' | 'O' | 'S' | 'M' | 'F';

interface Asteroid {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  sizeTier: 3 | 2 | 1; // 3 = Large, 2 = Medium, 1 = Small
  angle: number;
  spin: number;
  vertices: number[]; // Radial multipliers for crisp vector polygon
  color: string;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  isEnemy?: boolean;
  isHoming?: boolean;
  color: string;
}

interface Ufo {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isHunter: boolean;
  hp: number;
  maxHp: number;
  shootTimer: number;
}

interface BossMothership {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hp: number;
  maxHp: number;
  shootTimer: number;
  hitFlash: number;
}

interface PowerUp {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: PowerUpType;
  life: number;
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

const CANVAS_W = 520;
const CANVAS_H = 520;

const SHIP_SPECS: Record<
  ShipClass,
  {
    nameRo: string;
    nameEn: string;
    descRo: string;
    descEn: string;
    turnSpeed: number;
    thrust: number;
    maxSpeed: number;
    fireRate: number;
    color: string;
    startShield: boolean;
    baseSpread: number;
  }
> = {
  viper: {
    nameRo: 'Viper-80 (Echilibrat)',
    nameEn: 'Viper-80 (Balanced)',
    descRo: 'Viteză echilibrată + Tun Dual Plasma',
    descEn: 'Balanced agility + Dual Plasma Blaster',
    turnSpeed: 0.075,
    thrust: 0.21,
    maxSpeed: 5.8,
    fireRate: 11,
    color: '#22d3ee',
    startShield: false,
    baseSpread: 1,
  },
  phantom: {
    nameRo: 'Phantom-X (Rapid)',
    nameEn: 'Phantom-X (Interceptor)',
    descRo: 'Rotație ultra-rapidă + Foc în rafală',
    descEn: 'Ultra-fast rotation + Rapid Pulse Cannon',
    turnSpeed: 0.095,
    thrust: 0.25,
    maxSpeed: 6.5,
    fireRate: 8,
    color: '#a855f7',
    startShield: false,
    baseSpread: 1,
  },
  titan: {
    nameRo: 'Titan-RAM (Blindat)',
    nameEn: 'Titan-RAM (Armored)',
    descRo: 'Începe cu Scut Activ + Tir Triplu larg',
    descEn: 'Starts with Energy Shield + Wide Spread',
    turnSpeed: 0.062,
    thrust: 0.17,
    maxSpeed: 4.9,
    fireRate: 14,
    color: '#f59e0b',
    startShield: true,
    baseSpread: 3,
  },
};

const POWERUP_INFO: Record<
  PowerUpType,
  { color: string; border: string; labelRo: string; labelEn: string; shortRo: string; shortEn: string }
> = {
  T: {
    color: '#0284c7',
    border: '#38bdf8',
    labelRo: 'Laser Triplu Vectorial (12s)',
    labelEn: 'Triple Vector Laser (12s)',
    shortRo: 'LASER TRIPLU',
    shortEn: 'TRIPLE LASER',
  },
  O: {
    color: '#ea580c',
    border: '#fb923c',
    labelRo: 'Overclock Foc Rapid (10s)',
    labelEn: 'Overclock Rapid Fire (10s)',
    shortRo: 'OVERCLOCK 2X',
    shortEn: 'OVERCLOCK 2X',
  },
  S: {
    color: '#059669',
    border: '#34d399',
    labelRo: 'Scut Cuantic (Blochează 1 Impact)',
    labelEn: 'Quantum Shield (Blocks 1 Hit)',
    shortRo: 'SCUT ACTIVAT',
    shortEn: 'SHIELD READY',
  },
  M: {
    color: '#9333ea',
    border: '#c084fc',
    labelRo: 'Rachete Ghidate EMP (10s)',
    labelEn: 'Homing EMP Missiles (10s)',
    shortRo: 'RACHETE EMP',
    shortEn: 'HOMING EMP',
  },
  F: {
    color: '#0891b2',
    border: '#67e8f9',
    labelRo: 'Înghețare Timp CPU (8s)',
    labelEn: 'CPU Time Freeze (8s)',
    shortRo: 'TIMP ÎNGHEȚAT',
    shortEn: 'TIME FREEZE',
  },
};

const VECTOR_FACTS = [
  {
    ro: 'În Asteroids (1979), geometria navelor și meteoriților era desenată cu vectori matematici puri, fără pixeli clasici!',
    en: 'In Asteroids (1979), ships and rocks were rendered using pure mathematical vectors instead of raster pixels!',
  },
  {
    ro: 'Inerția Newtoniană face ca nava să alunece în direcția impulsului până când aplici o forță opusă.',
    en: 'Newtonian inertia keeps a spacecraft gliding along its velocity vector until an opposing thrust is applied.',
  },
  {
    ro: 'Ecranul toroidal (Wrap-Around) conectează marginea stângă cu dreapta și sus cu jos ca un univers circular.',
    en: 'Toroidal wrap-around connects left to right and top to bottom edges seamlessly into a continuous space.',
  },
];

function createPolygonVertices(count = 9): number[] {
  const verts: number[] = [];
  for (let i = 0; i < count; i++) {
    verts.push(0.74 + Math.random() * 0.36);
  }
  return verts;
}

export const CyberAsteroidsGame: React.FC<CyberAsteroidsGameProps> = ({
  onBack,
  studentName,
  studentAvatar,
  onAwardXP,
  onSaveScore,
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [gameState, setGameState] = useState<GameState>('menu');
  const [shipClass, setShipClass] = useState<ShipClass>('viper');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const local = Number(localStorage.getItem('arkedo_highscore_cyber_asteroids') || '0');
      const active = getActiveStudent();
      const cloud = active?.arcadeScores?.cyber_asteroids || 0;
      return Math.max(local, cloud);
    } catch {
      return 0;
    }
  });
  const [wave, setWave] = useState(1);
  const [lives, setLives] = useState(3);
  const [hasShield, setHasShield] = useState(false);
  const [warpCooldownSec, setWarpCooldownSec] = useState(0);
  const [autoFire, setAutoFire] = useState(false);
  const [muted, setMuted] = useState(false);

  const [timersHud, setTimersHud] = useState({
    triple: 0,
    overclock: 0,
    homing: 0,
    freeze: 0,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);

  const mutedRef = useRef(muted);
  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  const autoFireRef = useRef(autoFire);
  useEffect(() => {
    autoFireRef.current = autoFire;
  }, [autoFire]);

  // Mutable 60fps simulation refs
  const shipRef = useRef({
    x: CANVAS_W / 2,
    y: CANVAS_H / 2,
    vx: 0,
    vy: 0,
    angle: -Math.PI / 2,
    radius: 13,
    invulnTimer: 120,
    fireCooldown: 0,
    warpCooldown: 0,
    thrusting: false,
  });

  const asteroidsRef = useRef<Asteroid[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const ufosRef = useRef<Ufo[]>([]);
  const powerUpsRef = useRef<PowerUp[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const textsRef = useRef<FloatingText[]>([]);
  const bossRef = useRef<BossMothership>({
    active: false,
    x: CANVAS_W / 2,
    y: 80,
    vx: 1.5,
    vy: 0.6,
    radius: 36,
    hp: 30,
    maxHp: 30,
    shootTimer: 90,
    hitFlash: 0,
  });

  const starsRef = useRef<{ x: number; y: number; s: number; a: number }[]>(
    Array.from({ length: 65 }).map(() => ({
      x: Math.random() * CANVAS_W,
      y: Math.random() * CANVAS_H,
      s: Math.random() < 0.25 ? 2 : 1,
      a: 0.25 + Math.random() * 0.65,
    }))
  );

  const powerTimersRef = useRef({
    triple: 0,
    overclock: 0,
    homing: 0,
    freeze: 0,
  });

  const inputRef = useRef({
    left: false,
    right: false,
    thrust: false,
    fire: false,
    pointerAimActive: false,
    pointerX: CANVAS_W / 2,
    pointerY: CANVAS_H / 2,
  });

  const statsRef = useRef({
    score: 0,
    highScore,
    wave: 1,
    lives: 3,
    hasShield: false,
    shake: 0,
    ufoTimer: 480,
    nextId: 1,
    waveBannerTimer: 0,
  });

  useEffect(() => {
    forceScrollToTop();
  }, []);

  // Block arrow/space page scrolling while active
  useEffect(() => {
    if (gameState !== 'playing') return;
    const handleKeyBlock = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyBlock, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyBlock);
  }, [gameState]);

  // Web Audio 1979 Vector Synth
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (Ctx) audioCtxRef.current = new Ctx();
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
  }, []);

  const playTone = useCallback((freq: number, type: OscillatorType, duration: number, vol = 0.07, slideTo?: number) => {
    if (mutedRef.current || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (slideTo) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(35, slideTo), ctx.currentTime + duration);
      }
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // ignore
    }
  }, []);

  const sfxLaser = useCallback(() => playTone(740, 'sawtooth', 0.08, 0.045, 220), [playTone]);
  const sfxExplode = useCallback((tier: number) => {
    const startFreq = tier === 3 ? 130 : tier === 2 ? 190 : 280;
    playTone(startFreq, 'sawtooth', 0.22, 0.09, 38);
  }, [playTone]);
  const sfxPowerup = useCallback(() => {
    playTone(523, 'triangle', 0.08, 0.09);
    setTimeout(() => playTone(784, 'triangle', 0.14, 0.1), 70);
  }, [playTone]);
  const sfxWarp = useCallback(() => playTone(260, 'sine', 0.22, 0.1, 1180), [playTone]);
  const sfxShipHit = useCallback(() => {
    playTone(180, 'sawtooth', 0.25, 0.12, 42);
    setTimeout(() => playTone(120, 'square', 0.25, 0.1, 35), 110);
  }, [playTone]);
  const sfxWaveClear = useCallback(() => {
    [440, 554, 659, 880].forEach((f, i) => setTimeout(() => playTone(f, 'triangle', 0.14, 0.09), i * 85));
  }, [playTone]);

  const spawnParticles = (x: number, y: number, color: string, count = 12) => {
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 1.0 + Math.random() * 3.8;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 1.8 + Math.random() * 2.5,
        color,
        life: 22 + Math.random() * 16,
        maxLife: 38,
      });
    }
  };

  const addFloatingText = (text: string, x: number, y: number, color = '#22d3ee') => {
    textsRef.current.push({ text, x, y, color, alpha: 1 });
  };

  // Spawn Wave of Asteroids (safe distance from ship) + Dreadnought Boss every 4th wave
  const spawnWave = useCallback((waveNum: number) => {
    const newAsteroids: Asteroid[] = [];
    const count = Math.min(11, 3 + waveNum);
    const colors = ['#22d3ee', '#a855f7', '#f59e0b', '#38bdf8'];
    const s = shipRef.current;

    for (let i = 0; i < count; i++) {
      let ax = Math.random() * CANVAS_W;
      let ay = Math.random() * CANVAS_H;
      // Keep at least 125px away from player spawn
      let guard = 0;
      while (Math.hypot(ax - s.x, ay - s.y) < 125 && guard < 20) {
        ax = Math.random() * CANVAS_W;
        ay = Math.random() * CANVAS_H;
        guard++;
      }
      const ang = Math.random() * Math.PI * 2;
      const spd = (0.85 + Math.random() * 0.9) * (1 + (waveNum - 1) * 0.09);
      newAsteroids.push({
        id: statsRef.current.nextId++,
        x: ax,
        y: ay,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        radius: 32,
        sizeTier: 3,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.04,
        vertices: createPolygonVertices(10),
        color: colors[i % colors.length],
      });
    }
    asteroidsRef.current = newAsteroids;
    statsRef.current.waveBannerTimer = 110;

    if (waveNum % 4 === 0) {
      bossRef.current = {
        active: true,
        x: CANVAS_W / 2,
        y: 68,
        vx: 1.6 + waveNum * 0.1,
        vy: 0.5,
        radius: 36,
        hp: 22 + waveNum * 4,
        maxHp: 22 + waveNum * 4,
        shootTimer: 75,
        hitFlash: 0,
      };
    } else {
      bossRef.current.active = false;
    }
  }, []);

  const persistScore = useCallback(
    (finalScore: number, awardBonus = false) => {
      if (finalScore > statsRef.current.highScore) {
        statsRef.current.highScore = finalScore;
        setHighScore(finalScore);
        try {
          localStorage.setItem('arkedo_highscore_cyber_asteroids', String(finalScore));
        } catch {
          // ignore
        }
      }
      if (finalScore > 0) {
        updateStudentArcadeScore('cyber_asteroids', finalScore);
        onSaveScore?.(finalScore);
      }
      if (awardBonus) {
        onAwardXP?.(100, 'Cyber Asteroids Wave Mastery!');
      }
    },
    [onAwardXP, onSaveScore]
  );

  const handleStartNewGame = (chosenClass: ShipClass = shipClass) => {
    initAudio();
    sounds.playClick();
    setShipClass(chosenClass);
    const spec = SHIP_SPECS[chosenClass];

    shipRef.current = {
      x: CANVAS_W / 2,
      y: CANVAS_H / 2,
      vx: 0,
      vy: 0,
      angle: -Math.PI / 2,
      radius: 13,
      invulnTimer: 120,
      fireCooldown: 0,
      warpCooldown: 0,
      thrusting: false,
    };

    bulletsRef.current = [];
    ufosRef.current = [];
    powerUpsRef.current = [];
    particlesRef.current = [];
    textsRef.current = [];
    powerTimersRef.current = { triple: 0, overclock: 0, homing: 0, freeze: 0 };

    statsRef.current.score = 0;
    statsRef.current.wave = 1;
    statsRef.current.lives = 3;
    statsRef.current.hasShield = spec.startShield;
    statsRef.current.shake = 0;
    statsRef.current.ufoTimer = 460;

    setScore(0);
    setWave(1);
    setLives(3);
    setHasShield(spec.startShield);
    setWarpCooldownSec(0);
    setTimersHud({ triple: 0, overclock: 0, homing: 0, freeze: 0 });

    spawnWave(1);
    setGameState('playing');
    forceScrollToTop();
  };

  // Emergency Hyperspace Warp
  const triggerHyperspace = useCallback(() => {
    if (gameState !== 'playing') return;
    const s = shipRef.current;
    if (s.warpCooldown > 0) return;
    initAudio();
    sfxWarp();
    spawnParticles(s.x, s.y, '#38bdf8', 18);

    // Find safest spot furthest from asteroids
    let bestX = Math.random() * (CANVAS_W - 80) + 40;
    let bestY = Math.random() * (CANVAS_H - 80) + 40;
    let bestMinDist = 0;
    for (let attempt = 0; attempt < 15; attempt++) {
      const cx = Math.random() * (CANVAS_W - 80) + 40;
      const cy = Math.random() * (CANVAS_H - 80) + 40;
      let minDist = 9999;
      asteroidsRef.current.forEach((a) => {
        const d = Math.hypot(a.x - cx, a.y - cy);
        if (d < minDist) minDist = d;
      });
      if (minDist > bestMinDist) {
        bestMinDist = minDist;
        bestX = cx;
        bestY = cy;
      }
    }

    s.x = bestX;
    s.y = bestY;
    s.vx = 0;
    s.vy = 0;
    s.invulnTimer = 75;
    s.warpCooldown = 360; // 6 seconds
    spawnParticles(s.x, s.y, '#c084fc', 20);
    addFloatingText('HYPERSPACE!', s.x, s.y - 16, '#c084fc');
  }, [gameState, initAudio, sfxWarp]);

  // Keyboard Listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P') {
        setGameState((prev) => (prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev));
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') inputRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') inputRef.current.right = true;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') inputRef.current.thrust = true;
      if (e.key === ' ') inputRef.current.fire = true;
      if (e.key === 'h' || e.key === 'H' || e.key === 'Shift') triggerHyperspace();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') inputRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') inputRef.current.right = false;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') inputRef.current.thrust = false;
      if (e.key === ' ') inputRef.current.fire = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [triggerHyperspace]);

  // Direct Canvas Pointer/Touch Aiming & Thrust
  const updatePointerAim = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    inputRef.current.pointerX = ((e.clientX - rect.left) / rect.width) * CANVAS_W;
    inputRef.current.pointerY = ((e.clientY - rect.top) / rect.height) * CANVAS_H;
  };

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing') return;
    initAudio();
    inputRef.current.pointerAimActive = true;
    updatePointerAim(e);
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing' || !inputRef.current.pointerAimActive) return;
    updatePointerAim(e);
  };

  const handleCanvasPointerUp = () => {
    inputRef.current.pointerAimActive = false;
  };

  // Main 60fps Vector Simulation Loop
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
    let hudSync = 0;

    const wrapPos = (obj: { x: number; y: number }, margin = 16) => {
      if (obj.x < -margin) obj.x = CANVAS_W + margin;
      else if (obj.x > CANVAS_W + margin) obj.x = -margin;
      if (obj.y < -margin) obj.y = CANVAS_H + margin;
      else if (obj.y > CANVAS_H + margin) obj.y = -margin;
    };

    const dropPowerUpChance = (x: number, y: number, guaranteed = false) => {
      if (!guaranteed && Math.random() > 0.16) return;
      const pool: PowerUpType[] = ['T', 'O', 'S', 'M', 'F'];
      const chosen = pool[Math.floor(Math.random() * pool.length)];
      const ang = Math.random() * Math.PI * 2;
      powerUpsRef.current.push({
        id: statsRef.current.nextId++,
        x,
        y,
        vx: Math.cos(ang) * 0.7,
        vy: Math.sin(ang) * 0.7,
        type: chosen,
        life: 600,
      });
    };

    const damageShip = () => {
      const s = shipRef.current;
      if (s.invulnTimer > 0) return;

      if (statsRef.current.hasShield) {
        statsRef.current.hasShield = false;
        setHasShield(false);
        s.invulnTimer = 110;
        statsRef.current.shake = 10;
        sfxWarp();
        spawnParticles(s.x, s.y, '#34d399', 24);
        addFloatingText(isEn ? 'SHIELD ABSORBED!' : 'SCUT ACTIVAT!', s.x, s.y - 16, '#34d399');
        return;
      }

      sfxShipHit();
      statsRef.current.shake = 14;
      spawnParticles(s.x, s.y, '#f43f5e', 30);

      statsRef.current.lives -= 1;
      setLives(statsRef.current.lives);

      if (statsRef.current.lives <= 0) {
        persistScore(statsRef.current.score, statsRef.current.wave >= 4);
        setGameState('gameover');
        return;
      } else {
        s.x = CANVAS_W / 2;
        s.y = CANVAS_H / 2;
        s.vx = 0;
        s.vy = 0;
        s.invulnTimer = 150;
      }
    };

    const splitAsteroid = (ast: Asteroid) => {
      sfxExplode(ast.sizeTier);
      const pts = ast.sizeTier === 3 ? 50 : ast.sizeTier === 2 ? 100 : 150;
      statsRef.current.score += pts;
      setScore(statsRef.current.score);
      if (statsRef.current.score > statsRef.current.highScore) {
        statsRef.current.highScore = statsRef.current.score;
        setHighScore(statsRef.current.score);
      }

      spawnParticles(ast.x, ast.y, ast.color, ast.sizeTier * 6);
      addFloatingText(`+${pts}`, ast.x, ast.y, ast.color);

      if (ast.sizeTier > 1) {
        const nextTier = (ast.sizeTier - 1) as 2 | 1;
        const nextR = nextTier === 2 ? 19 : 11;
        const spdBoost = nextTier === 2 ? 1.35 : 1.75;
        for (let i = 0; i < 2; i++) {
          const ang = Math.random() * Math.PI * 2;
          const baseSpd = (1.1 + Math.random() * 1.1) * spdBoost;
          asteroidsRef.current.push({
            id: statsRef.current.nextId++,
            x: ast.x,
            y: ast.y,
            vx: Math.cos(ang) * baseSpd,
            vy: Math.sin(ang) * baseSpd,
            radius: nextR,
            sizeTier: nextTier,
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.07,
            vertices: createPolygonVertices(nextTier === 2 ? 8 : 6),
            color: ast.color,
          });
        }
      } else {
        dropPowerUpChance(ast.x, ast.y, false);
      }
    };

    const loop = (now: number) => {
      const rawDt = (now - lastTime) / 16.6667;
      lastTime = now;
      const dt = Math.min(2.0, Math.max(0.4, rawDt));

      const s = shipRef.current;
      const spec = SHIP_SPECS[shipClass];
      const timers = powerTimersRef.current;
      const enemyTimeScale = timers.freeze > 0 ? 0.45 : 1.0;

      // 1. UPDATE TIMERS
      (Object.keys(timers) as (keyof typeof timers)[]).forEach((k) => {
        if (timers[k] > 0) timers[k] = Math.max(0, timers[k] - dt);
      });
      if (s.invulnTimer > 0) s.invulnTimer = Math.max(0, s.invulnTimer - dt);
      if (s.fireCooldown > 0) s.fireCooldown = Math.max(0, s.fireCooldown - dt);
      if (s.warpCooldown > 0) s.warpCooldown = Math.max(0, s.warpCooldown - dt);
      if (statsRef.current.shake > 0) statsRef.current.shake = Math.max(0, statsRef.current.shake - 0.65 * dt);
      if (statsRef.current.waveBannerTimer > 0) statsRef.current.waveBannerTimer = Math.max(0, statsRef.current.waveBannerTimer - dt);

      hudSync++;
      if (hudSync % 12 === 0) {
        setWarpCooldownSec(Math.ceil(s.warpCooldown / 60));
        setTimersHud({
          triple: Math.ceil(timers.triple / 60),
          overclock: Math.ceil(timers.overclock / 60),
          homing: Math.ceil(timers.homing / 60),
          freeze: Math.ceil(timers.freeze / 60),
        });
      }

      // 2. SHIP CONTROLS (Keyboard + Pointer Touch Drag Aiming)
      let isThrusting = inputRef.current.thrust;
      if (inputRef.current.left) s.angle -= spec.turnSpeed * dt;
      if (inputRef.current.right) s.angle += spec.turnSpeed * dt;

      if (inputRef.current.pointerAimActive) {
        const dx = inputRef.current.pointerX - s.x;
        const dy = inputRef.current.pointerY - s.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 14) {
          const desired = Math.atan2(dy, dx);
          let diff = desired - s.angle;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          s.angle += Math.max(-spec.turnSpeed * 1.4 * dt, Math.min(spec.turnSpeed * 1.4 * dt, diff));
          if (dist > 38) isThrusting = true;
        }
      }

      s.thrusting = isThrusting;
      if (isThrusting) {
        s.vx += Math.cos(s.angle) * spec.thrust * dt;
        s.vy += Math.sin(s.angle) * spec.thrust * dt;
        if (Math.random() < 0.65) {
          particlesRef.current.push({
            x: s.x - Math.cos(s.angle) * 14,
            y: s.y - Math.sin(s.angle) * 14,
            vx: -Math.cos(s.angle) * 2.2 + (Math.random() - 0.5),
            vy: -Math.sin(s.angle) * 2.2 + (Math.random() - 0.5),
            size: 2.5,
            color: spec.color,
            life: 12,
            maxLife: 12,
          });
        }
      }

      // Clamp max velocity + slight space friction so ship feels crisp
      const curSpd = Math.hypot(s.vx, s.vy);
      if (curSpd > spec.maxSpeed) {
        s.vx = (s.vx / curSpd) * spec.maxSpeed;
        s.vy = (s.vy / curSpd) * spec.maxSpeed;
      }
      s.vx *= Math.pow(0.992, dt);
      s.vy *= Math.pow(0.992, dt);
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      wrapPos(s, 15);

      // 3. SHIP FIRING
      const wantsFire = inputRef.current.fire || autoFireRef.current || inputRef.current.pointerAimActive;
      if (wantsFire && s.fireCooldown <= 0) {
        const rate = timers.overclock > 0 ? Math.max(4, Math.floor(spec.fireRate * 0.5)) : spec.fireRate;
        s.fireCooldown = rate;
        sfxLaser();

        const spreadCount = timers.triple > 0 || spec.baseSpread === 3 ? 3 : 1;
        const angles = spreadCount === 3 ? [s.angle - 0.18, s.angle, s.angle + 0.18] : [s.angle];
        angles.forEach((a) => {
          bulletsRef.current.push({
            id: statsRef.current.nextId++,
            x: s.x + Math.cos(a) * 16,
            y: s.y + Math.sin(a) * 16,
            vx: Math.cos(a) * 8.6 + s.vx * 0.25,
            vy: Math.sin(a) * 8.6 + s.vy * 0.25,
            life: 54,
            color: timers.overclock > 0 ? '#fb923c' : spec.color,
          });
        });

        if (timers.homing > 0) {
          bulletsRef.current.push({
            id: statsRef.current.nextId++,
            x: s.x + Math.cos(s.angle) * 14,
            y: s.y + Math.sin(s.angle) * 14,
            vx: Math.cos(s.angle) * 6.5,
            vy: Math.sin(s.angle) * 6.5,
            life: 90,
            isHoming: true,
            color: '#e879f9',
          });
        }
      }

      // 4. UFO SPAWNER
      statsRef.current.ufoTimer -= dt * enemyTimeScale;
      if (statsRef.current.ufoTimer <= 0) {
        statsRef.current.ufoTimer = Math.max(260, 520 - statsRef.current.wave * 24);
        const fromLeft = Math.random() < 0.5;
        const isHunter = statsRef.current.wave >= 2 && Math.random() < 0.45;
        ufosRef.current.push({
          id: statsRef.current.nextId++,
          x: fromLeft ? -20 : CANVAS_W + 20,
          y: 50 + Math.random() * (CANVAS_H - 100),
          vx: (fromLeft ? 1 : -1) * (isHunter ? 2.4 : 1.7),
          vy: (Math.random() - 0.5) * 1.1,
          radius: isHunter ? 14 : 20,
          isHunter,
          hp: isHunter ? 2 : 3,
          maxHp: isHunter ? 2 : 3,
          shootTimer: 70,
        });
      }

      // 5. UPDATE BOSS (Every 4th wave)
      const boss = bossRef.current;
      if (boss.active && boss.hp > 0) {
        boss.x += boss.vx * dt * enemyTimeScale;
        boss.y += boss.vy * dt * enemyTimeScale;
        wrapPos(boss, boss.radius);
        if (boss.hitFlash > 0) boss.hitFlash -= dt;
        boss.shootTimer -= dt * enemyTimeScale;
        if (boss.shootTimer <= 0) {
          boss.shootTimer = 85;
          const aim = Math.atan2(s.y - boss.y, s.x - boss.x);
          [-0.25, 0, 0.25].forEach((off) => {
            bulletsRef.current.push({
              id: statsRef.current.nextId++,
              x: boss.x,
              y: boss.y,
              vx: Math.cos(aim + off) * 3.8,
              vy: Math.sin(aim + off) * 3.8,
              life: 110,
              isEnemy: true,
              color: '#f43f5e',
            });
          });
        }
        if (Math.hypot(boss.x - s.x, boss.y - s.y) < boss.radius + s.radius - 4) {
          damageShip();
          if (statsRef.current.lives <= 0) return;
        }
      }

      // 6. UPDATE ASTEROIDS
      asteroidsRef.current.forEach((a) => {
        a.x += a.vx * dt * enemyTimeScale;
        a.y += a.vy * dt * enemyTimeScale;
        a.angle += a.spin * dt * enemyTimeScale;
        wrapPos(a, a.radius + 4);

        if (Math.hypot(a.x - s.x, a.y - s.y) < a.radius + s.radius - 4) {
          damageShip();
        }
      });
      if (statsRef.current.lives <= 0) return;

      // 7. UPDATE UFOS
      ufosRef.current = ufosRef.current.filter((u) => {
        u.x += u.vx * dt * enemyTimeScale;
        u.y += u.vy * dt * enemyTimeScale;
        if (u.y < 30 || u.y > CANVAS_H - 30) u.vy = -u.vy;

        u.shootTimer -= dt * enemyTimeScale;
        if (u.shootTimer <= 0) {
          u.shootTimer = u.isHunter ? 75 : 105;
          const ang = u.isHunter ? Math.atan2(s.y - u.y, s.x - u.x) : Math.random() * Math.PI * 2;
          bulletsRef.current.push({
            id: statsRef.current.nextId++,
            x: u.x,
            y: u.y,
            vx: Math.cos(ang) * 4.2,
            vy: Math.sin(ang) * 4.2,
            life: 95,
            isEnemy: true,
            color: '#fb7185',
          });
        }

        if (Math.hypot(u.x - s.x, u.y - s.y) < u.radius + s.radius - 2) {
          damageShip();
          return false;
        }
        return u.x > -45 && u.x < CANVAS_W + 45;
      });
      if (statsRef.current.lives <= 0) return;

      // 8. UPDATE BULLETS & COLLISIONS
      const deadAsteroidIds = new Set<number>();
      bulletsRef.current = bulletsRef.current.filter((b) => {
        if (b.isHoming && !b.isEnemy) {
          // Steer gently toward nearest asteroid or UFO
          let nearestDist = 9999;
          let targetX = b.x;
          let targetY = b.y;
          asteroidsRef.current.forEach((a) => {
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < nearestDist) {
              nearestDist = d;
              targetX = a.x;
              targetY = a.y;
            }
          });
          ufosRef.current.forEach((u) => {
            const d = Math.hypot(u.x - b.x, u.y - b.y);
            if (d < nearestDist) {
              nearestDist = d;
              targetX = u.x;
              targetY = u.y;
            }
          });
          if (nearestDist < 260) {
            const desired = Math.atan2(targetY - b.y, targetX - b.x);
            const cur = Math.atan2(b.vy, b.vx);
            let diff = desired - cur;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            const nextAng = cur + Math.max(-0.14, Math.min(0.14, diff));
            const spd = Math.hypot(b.vx, b.vy);
            b.vx = Math.cos(nextAng) * spd;
            b.vy = Math.sin(nextAng) * spd;
          }
        }

        b.x += b.vx * dt;
        b.y += b.vy * dt;
        wrapPos(b, 6);
        b.life -= dt;
        if (b.life <= 0) return false;

        if (b.isEnemy) {
          if (Math.hypot(b.x - s.x, b.y - s.y) < s.radius + 4) {
            damageShip();
            return false;
          }
          return true;
        }

        // Player bullet vs Asteroids
        for (const a of asteroidsRef.current) {
          if (deadAsteroidIds.has(a.id)) continue;
          if (Math.hypot(b.x - a.x, b.y - a.y) <= a.radius + 4) {
            deadAsteroidIds.add(a.id);
            splitAsteroid(a);
            return false;
          }
        }

        // Player bullet vs UFOs
        for (let i = ufosRef.current.length - 1; i >= 0; i--) {
          const u = ufosRef.current[i];
          if (Math.hypot(b.x - u.x, b.y - u.y) <= u.radius + 4) {
            u.hp -= 1;
            spawnParticles(b.x, b.y, '#fb7185', 6);
            if (u.hp <= 0) {
              const pts = u.isHunter ? 650 : 400;
              statsRef.current.score += pts;
              setScore(statsRef.current.score);
              sfxExplode(3);
              addFloatingText(`+${pts} UFO!`, u.x, u.y, '#facc15');
              spawnParticles(u.x, u.y, '#f43f5e', 20);
              dropPowerUpChance(u.x, u.y, true);
              ufosRef.current.splice(i, 1);
            }
            return false;
          }
        }

        // Player bullet vs Boss
        if (boss.active && boss.hp > 0 && Math.hypot(b.x - boss.x, b.y - boss.y) <= boss.radius + 4) {
          boss.hp -= 1;
          boss.hitFlash = 6;
          statsRef.current.score += 40;
          setScore(statsRef.current.score);
          spawnParticles(b.x, b.y, '#e879f9', 5);
          if (boss.hp <= 0) {
            boss.active = false;
            statsRef.current.score += 1200;
            setScore(statsRef.current.score);
            sfxExplode(3);
            statsRef.current.shake = 18;
            addFloatingText('+1200 DREADNOUGHT!', boss.x, boss.y, '#facc15');
            spawnParticles(boss.x, boss.y, '#facc15', 38);
            dropPowerUpChance(boss.x, boss.y, true);
          }
          return false;
        }

        return true;
      });

      if (deadAsteroidIds.size > 0) {
        asteroidsRef.current = asteroidsRef.current.filter((a) => !deadAsteroidIds.has(a.id));
      }

      // Check Wave Cleared!
      if (asteroidsRef.current.length === 0 && (!boss.active || boss.hp <= 0)) {
        sfxWaveClear();
        const waveBonus = 250 * statsRef.current.wave;
        statsRef.current.score += waveBonus;
        setScore(statsRef.current.score);
        persistScore(statsRef.current.score, statsRef.current.wave % 3 === 0);

        statsRef.current.wave += 1;
        setWave(statsRef.current.wave);
        addFloatingText(
          isEn ? `WAVE ${statsRef.current.wave} (+${waveBonus})` : `VALUL ${statsRef.current.wave} (+${waveBonus})`,
          CANVAS_W / 2,
          CANVAS_H / 2 - 40,
          '#facc15'
        );
        spawnWave(statsRef.current.wave);
      }

      // 9. UPDATE POWER-UPS
      powerUpsRef.current = powerUpsRef.current.filter((pw) => {
        pw.x += pw.vx * dt;
        pw.y += pw.vy * dt;
        wrapPos(pw, 14);
        pw.life -= dt;
        if (pw.life <= 0) return false;

        if (Math.hypot(pw.x - s.x, pw.y - s.y) < s.radius + 15) {
          sfxPowerup();
          const info = POWERUP_INFO[pw.type];
          addFloatingText(isEn ? info.shortEn : info.shortRo, pw.x, pw.y - 12, info.border);
          statsRef.current.score += 100;
          setScore(statsRef.current.score);

          if (pw.type === 'T') timers.triple = 12 * 60;
          else if (pw.type === 'O') timers.overclock = 10 * 60;
          else if (pw.type === 'M') timers.homing = 10 * 60;
          else if (pw.type === 'F') timers.freeze = 8 * 60;
          else if (pw.type === 'S') {
            statsRef.current.hasShield = true;
            setHasShield(true);
          }
          return false;
        }
        return true;
      });

      // 10. UPDATE PARTICLES & TEXTS
      particlesRef.current = particlesRef.current.filter((pt) => {
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.life -= dt;
        return pt.life > 0;
      });
      textsRef.current = textsRef.current.filter((t) => {
        t.y -= 0.7 * dt;
        t.alpha -= 0.02 * dt;
        return t.alpha > 0;
      });

      // 11. RENDER VECTOR SPACE CANVAS
      ctx.save();
      if (statsRef.current.shake > 0) {
        ctx.translate((Math.random() - 0.5) * statsRef.current.shake, (Math.random() - 0.5) * statsRef.current.shake);
      }

      // Deep Space Canvas
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Parallax Stars
      starsRef.current.forEach((st) => {
        ctx.fillStyle = `rgba(186, 230, 253, ${st.a})`;
        ctx.fillRect(st.x, st.y, st.s, st.s);
      });

      // Time-Freeze subtle tint
      if (timers.freeze > 0) {
        ctx.fillStyle = 'rgba(6, 182, 212, 0.06)';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      }

      // Draw Vector Asteroids
      asteroidsRef.current.forEach((a) => {
        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.rotate(a.angle);
        ctx.strokeStyle = timers.freeze > 0 ? '#67e8f9' : a.color;
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.shadowColor = a.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        const count = a.vertices.length;
        for (let i = 0; i < count; i++) {
          const ang = (i / count) * Math.PI * 2;
          const r = a.radius * a.vertices[i];
          const vx = Math.cos(ang) * r;
          const vy = Math.sin(ang) * r;
          if (i === 0) ctx.moveTo(vx, vy);
          else ctx.lineTo(vx, vy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });

      // Draw UFOs
      ufosRef.current.forEach((u) => {
        ctx.save();
        ctx.translate(u.x, u.y);
        ctx.strokeStyle = u.isHunter ? '#f43f5e' : '#f59e0b';
        ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
        ctx.lineWidth = 2;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 8;

        ctx.beginPath();
        ctx.ellipse(0, 2, u.radius, u.radius * 0.42, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, -3, u.radius * 0.48, Math.PI, 0);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });

      // Draw Boss Dreadnought
      if (boss.active && boss.hp > 0) {
        ctx.save();
        ctx.translate(boss.x, boss.y);
        ctx.strokeStyle = boss.hitFlash > 0 ? '#ffffff' : '#e879f9';
        ctx.fillStyle = '#3b0764';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#d946ef';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const ang = (i / 8) * Math.PI * 2 + now / 1200;
          const r = i % 2 === 0 ? boss.radius : boss.radius * 0.72;
          const vx = Math.cos(ang) * r;
          const vy = Math.sin(ang) * r;
          if (i === 0) ctx.moveTo(vx, vy);
          else ctx.lineTo(vx, vy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#fdf4ff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('BOSS', 0, -4);

        const hpRatio = Math.max(0, boss.hp / boss.maxHp);
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(-26, 6, 52, 6);
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(-26, 6, 52 * hpRatio, 6);
        ctx.restore();
      }

      // Draw Power-Up Capsules
      powerUpsRef.current.forEach((pw) => {
        const info = POWERUP_INFO[pw.type];
        ctx.save();
        ctx.translate(pw.x, pw.y);
        ctx.fillStyle = info.color;
        ctx.strokeStyle = info.border;
        ctx.lineWidth = 2;
        ctx.shadowColor = info.border;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pw.type, 0, 0.5);
        ctx.restore();
      });

      // Draw Lasers & Missiles
      bulletsRef.current.forEach((b) => {
        ctx.save();
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.isHoming ? 4 : b.isEnemy ? 3.5 : 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Player Vector Ship
      const blinkSkip = s.invulnTimer > 0 && Math.floor(s.invulnTimer / 5) % 2 === 0;
      if (!blinkSkip) {
        ctx.save();
        ctx.translate(s.x, s.y);

        if (statsRef.current.hasShield) {
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(0, 0, 20, 0, Math.PI * 2);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        ctx.rotate(s.angle);
        ctx.strokeStyle = spec.color;
        ctx.fillStyle = '#0f172a';
        ctx.lineWidth = 2.4;
        ctx.shadowColor = spec.color;
        ctx.shadowBlur = 10;

        // Crisp 1979 Vector Delta Ship
        ctx.beginPath();
        ctx.moveTo(16, 0);
        ctx.lineTo(-12, 10);
        ctx.lineTo(-7, 0);
        ctx.lineTo(-12, -10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Cockpit core dot
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(2, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Thruster Flame
        if (s.thrusting) {
          ctx.strokeStyle = '#fb923c';
          ctx.beginPath();
          ctx.moveTo(-9, 4);
          ctx.lineTo(-18 - Math.random() * 6, 0);
          ctx.lineTo(-9, -4);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Particles & Texts
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

      // Wave Banner Overlay inside Canvas
      if (statsRef.current.waveBannerTimer > 0) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, statsRef.current.waveBannerTimer / 30);
        ctx.fillStyle = '#22d3ee';
        ctx.font = 'bold 18px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          statsRef.current.wave % 4 === 0
            ? isEn
              ? `WAVE ${statsRef.current.wave} · DREADNOUGHT BOSS!`
              : `VALUL ${statsRef.current.wave} · BOSS DREADNOUGHT!`
            : isEn
              ? `SECTOR WAVE ${statsRef.current.wave}`
              : `VALUL SPAȚIAL ${statsRef.current.wave}`,
          CANVAS_W / 2,
          52
        );
        ctx.restore();
      }

      ctx.restore();

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [gameState, isEn, persistScore, sfxExplode, sfxLaser, sfxPowerup, sfxShipHit, sfxWarp, sfxWaveClear, shipClass, spawnWave]);

  const currentFact = VECTOR_FACTS[(wave - 1) % VECTOR_FACTS.length];

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 pb-10 select-none">
      {/* Header */}
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
            <ArrowLeft className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">{isEn ? 'Back' : 'Înapoi'}</span>
          </button>

          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-black text-white font-heading truncate flex items-center gap-2">
              <Rocket className="w-5 h-5 text-purple-400 shrink-0" />
              <span>{isEn ? 'Cyber Asteroids: Vector Command' : 'Cyber Asteroids: Reactorul Vectorial'}</span>
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>{studentAvatar || '🎓'} {studentName || (isEn ? 'Pilot' : 'Pilot')}</span>
              <span aria-hidden="true">·</span>
              <span className="text-purple-300 font-semibold">{isEn ? SHIP_SPECS[shipClass].nameEn : SHIP_SPECS[shipClass].nameRo}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setAutoFire((a) => !a)}
            className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              autoFire
                ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Crosshair className="w-4 h-4" />
            <span>{autoFire ? (isEn ? 'Auto-Fire ON' : 'Foc Auto ON') : (isEn ? 'Auto-Fire' : 'Foc Auto')}</span>
          </button>

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
              <span className="hidden sm:inline">{gameState === 'paused' ? (isEn ? 'Resume' : 'Continuă') : (isEn ? 'Pause' : 'Pauză')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Game Canvas + Controls */}
        <div className="lg:col-span-8 flex flex-col items-center gap-3">
          {/* HUD Strip */}
          <div className="w-full max-w-[520px] grid grid-cols-4 gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-2.5 text-center shadow-lg">
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase">{isEn ? 'Score' : 'Scor'}</div>
              <div className="text-base sm:text-lg font-black text-purple-300 font-mono tabular-nums">{score.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase">{isEn ? 'Record' : 'Record'}</div>
              <div className="text-base sm:text-lg font-black text-amber-300 font-mono tabular-nums">{highScore.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase">{isEn ? 'Wave' : 'Val'}</div>
              <div className="text-base sm:text-lg font-black text-cyan-300 font-mono tabular-nums">{wave}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase">{isEn ? 'Hull' : 'Vieți'}</div>
              <div className="text-sm font-black text-rose-400 flex items-center justify-center gap-0.5 mt-1">
                {Array.from({ length: Math.max(0, lives) }).map((_, i) => (
                  <Heart key={i} className="w-3.5 h-3.5 fill-rose-500 text-rose-400" />
                ))}
                {lives === 0 && <span>0</span>}
              </div>
            </div>
          </div>

          {/* Active Power-Up Strip */}
          {(hasShield || timersHud.triple > 0 || timersHud.overclock > 0 || timersHud.homing > 0 || timersHud.freeze > 0) && (
            <div className="w-full max-w-[520px] flex flex-wrap items-center justify-center gap-3 text-xs font-mono font-bold bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5">
              {hasShield && <span className="text-emerald-400 flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> SHIELD</span>}
              {timersHud.triple > 0 && <span className="text-sky-400">T·{timersHud.triple}s</span>}
              {timersHud.overclock > 0 && <span className="text-orange-400">O·{timersHud.overclock}s</span>}
              {timersHud.homing > 0 && <span className="text-purple-400">M·{timersHud.homing}s</span>}
              {timersHud.freeze > 0 && <span className="text-cyan-300">F·{timersHud.freeze}s</span>}
            </div>
          )}

          {/* Canvas Box */}
          <div className="relative w-full max-w-[520px] aspect-square bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border-2 border-purple-500/40">
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              onPointerDown={handleCanvasPointerDown}
              onPointerMove={handleCanvasPointerMove}
              onPointerUp={handleCanvasPointerUp}
              onPointerCancel={handleCanvasPointerUp}
              onPointerLeave={handleCanvasPointerUp}
              className="w-full h-full block touch-none cursor-crosshair"
            />

            {/* MENU OVERLAY WITH SHIP SELECTION */}
            {gameState === 'menu' && (
              <div className="absolute inset-0 bg-slate-950/92 backdrop-blur-sm flex flex-col items-center justify-center p-5 text-center gap-4 overflow-y-auto">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
                    Cyber Asteroids 1979
                  </h2>
                  <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-sm">
                    {isEn
                      ? 'Pilot your 360° vector spacecraft, shatter encrypted meteors, intercept AI UFOs, and use Hyperspace Warp to survive!'
                      : 'Pilotează nava vectorială 360°, sparge meteoriții criptați, interceptează OZN-urile AI și folosește Saltul Hiper-Spațial!'}
                  </p>
                </div>

                {/* Ship Selector */}
                <div className="w-full max-w-md grid grid-cols-3 gap-2">
                  {(['viper', 'phantom', 'titan'] as ShipClass[]).map((sc) => {
                    const info = SHIP_SPECS[sc];
                    const selected = shipClass === sc;
                    return (
                      <button
                        key={sc}
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setShipClass(sc);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                          selected
                            ? 'bg-slate-800 border-purple-400 shadow-lg shadow-purple-500/20'
                            : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="text-xs font-black" style={{ color: info.color }}>
                          {isEn ? info.nameEn.split(' ')[0] : info.nameRo.split(' ')[0]}
                        </div>
                        <div className="text-[10px] text-slate-300 mt-1 leading-tight">
                          {isEn ? info.descEn : info.descRo}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="w-full max-w-sm text-left text-xs text-slate-300 space-y-1 border-y border-slate-800 py-2.5">
                  <div>⌨️ {isEn ? 'A/D or Left/Right Rotate · W/Up Thrust · Space Fire · H Warp' : 'A/D sau Săgeți Rotești · W/Sus Propulsie · Space Foc · H Salt'}</div>
                  <div>📱 {isEn ? 'Touch-drag on screen to aim & fly, or use buttons below!' : 'Glisează pe ecran ca să țintești și să zbori, sau folosește butoanele!'}</div>
                </div>

                <button
                  type="button"
                  onClick={() => handleStartNewGame(shipClass)}
                  className="min-h-[48px] px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-sm shadow-lg shadow-purple-500/30 transition active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>{isEn ? 'Launch Spacecraft' : 'Lansează Nava'}</span>
                </button>
              </div>
            )}

            {/* PAUSED OVERLAY */}
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
                    onClick={() => handleStartNewGame(shipClass)}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm cursor-pointer flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{isEn ? 'Restart' : 'Reia'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* GAME OVER OVERLAY */}
            {gameState === 'gameover' && (
              <div className="absolute inset-0 bg-slate-950/92 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center gap-4">
                <Trophy className="w-12 h-12 text-amber-400" />
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    {isEn ? 'Hull Destroyed!' : 'Navă Distrusă!'}
                  </h2>
                  <p className="text-slate-300 text-xs sm:text-sm mt-1">
                    {isEn ? `Survived up to Wave ${wave}` : `Ai rezistat până la Valul ${wave}`}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-900 border border-slate-800 rounded-2xl px-6 py-3">
                  <div>
                    <div className="text-[11px] text-slate-400">{isEn ? 'Final Score' : 'Scor Final'}</div>
                    <div className="text-xl font-black text-purple-300 font-mono tabular-nums">{score.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">{isEn ? 'Best Record' : 'Record Personal'}</div>
                    <div className="text-xl font-black text-amber-300 font-mono tabular-nums">{highScore.toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setGameState('menu')}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm cursor-pointer"
                  >
                    {isEn ? 'Change Ship' : 'Schimbă Nava'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartNewGame(shipClass)}
                    className="min-h-[44px] px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-sm shadow-lg cursor-pointer flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{isEn ? 'Play Again' : 'Joacă din Nou'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile & Touch Ergonomic Cockpit Controls */}
          <div className="w-full max-w-[520px] grid grid-cols-5 gap-2 pt-1">
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
              className="min-h-[54px] rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-purple-600 border border-slate-700 text-white flex items-center justify-center touch-manipulation cursor-pointer shadow"
              aria-label="Rotate Left"
            >
              <ChevronLeft className="w-7 h-7" />
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
              className="min-h-[54px] rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-purple-600 border border-slate-700 text-white flex items-center justify-center touch-manipulation cursor-pointer shadow"
              aria-label="Rotate Right"
            >
              <ChevronRight className="w-7 h-7" />
            </button>

            <button
              type="button"
              onPointerDown={() => {
                initAudio();
                inputRef.current.thrust = true;
              }}
              onPointerUp={() => {
                inputRef.current.thrust = false;
              }}
              onPointerLeave={() => {
                inputRef.current.thrust = false;
              }}
              onPointerCancel={() => {
                inputRef.current.thrust = false;
              }}
              className="min-h-[54px] rounded-2xl bg-cyan-900/60 hover:bg-cyan-800 active:bg-cyan-500 border border-cyan-500/40 text-cyan-200 font-black flex flex-col items-center justify-center touch-manipulation cursor-pointer shadow"
            >
              <ChevronUp className="w-5 h-5" />
              <span className="text-[10px]">{isEn ? 'THRUST' : 'ZBOR'}</span>
            </button>

            <button
              type="button"
              onPointerDown={() => {
                initAudio();
                inputRef.current.fire = true;
              }}
              onPointerUp={() => {
                inputRef.current.fire = false;
              }}
              onPointerLeave={() => {
                inputRef.current.fire = false;
              }}
              onPointerCancel={() => {
                inputRef.current.fire = false;
              }}
              className="min-h-[54px] rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 active:scale-95 text-white font-black flex flex-col items-center justify-center touch-manipulation cursor-pointer shadow-lg"
            >
              <Flame className="w-4 h-4" />
              <span className="text-[10px]">{isEn ? 'FIRE' : 'FOC'}</span>
            </button>

            <button
              type="button"
              onClick={triggerHyperspace}
              disabled={warpCooldownSec > 0 || gameState !== 'playing'}
              className="min-h-[54px] rounded-2xl bg-amber-900/50 hover:bg-amber-800/70 disabled:opacity-45 border border-amber-500/40 text-amber-200 font-black flex flex-col items-center justify-center touch-manipulation cursor-pointer shadow"
            >
              <Zap className="w-4 h-4" />
              <span className="text-[10px] tabular-nums">
                {warpCooldownSec > 0 ? `${warpCooldownSec}s` : (isEn ? 'WARP' : 'SALT')}
              </span>
            </button>
          </div>
        </div>

        {/* Right Side: Power-Ups & Vector Physics Fact */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <h3 className="text-sm font-black text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>{isEn ? 'Space Power-Up Modules' : 'Module Power-Up'}</span>
            </h3>
            <div className="space-y-2.5">
              {(Object.keys(POWERUP_INFO) as PowerUpType[]).map((key) => {
                const info = POWERUP_INFO[key];
                return (
                  <div key={key} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <span
                      className="w-7 h-7 rounded-full font-mono font-black text-white text-xs flex items-center justify-center shrink-0 border-2"
                      style={{ backgroundColor: info.color, borderColor: info.border }}
                    >
                      {key}
                    </span>
                    <span>{isEn ? info.labelEn : info.labelRo}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <h3 className="text-sm font-black text-white mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>{isEn ? 'Vector Physics Byte' : 'Știai că? (Grafică Vectorială)'}</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isEn ? currentFact.en : currentFact.ro}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
