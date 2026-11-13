import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Trophy,
  RotateCcw,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Heart,
  Cpu,
  Shield,
  Clock
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { forceScrollToTop } from '../../utils/scrollHelper';
import { getActiveStudent, updateStudentArcadeScore } from '../../lib/studentAuthService';
import { sounds } from '../../utils/audio';

export interface CyberFroggerGameProps {
  onBack: () => void;
  studentName?: string;
  studentAvatar?: string;
  onAwardXP?: (amount: number, reason: string) => void;
  onSaveScore?: (score: number) => void;
}

type GameState = 'menu' | 'playing' | 'paused' | 'stage_clear' | 'gameover';
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface LaneObject {
  x: number;
  w: number;
  type: 'bug' | 'phish' | 'spyware' | 'trojan' | 'ddos' | 'log' | 'fiber' | 'turtle';
  color: string;
  label?: string;
  canDive?: boolean;
  divePhase?: number; // 0..1 cycle; when underwater > 0.78 -> submerged
}

interface Lane {
  row: number;
  kind: 'road' | 'river';
  vx: number;
  items: LaneObject[];
}

interface FloatingText {
  text: string;
  x: number;
  y: number;
  color: string;
  alpha: number;
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

const COLS = 11;
const ROWS = 13;
const CELL = 40;
const CANVAS_W = COLS * CELL; // 440
const CANVAS_H = ROWS * CELL; // 520
const PORT_COLS = [1, 3, 5, 7, 9];
const PORT_NAMES = ['HTTP:80', 'HTTPS:443', 'SSH:22', 'DNS:53', 'FTP:21'];
const ROUND_TIME_SEC = 45;

const STAGE_NETWORK_FACTS = [
  {
    nameRo: 'Nivel 1: Rețeaua Locală (LAN)',
    nameEn: 'Stage 1: Local Area Network (LAN)',
    factRo: 'Porturile 80 (HTTP) și 443 (HTTPS) sunt porțile principale prin care browserul tău primește paginile web în siguranță!',
    factEn: 'Ports 80 (HTTP) and 443 (HTTPS) are the main digital gateways your browser uses to fetch web pages securely!',
  },
  {
    nameRo: 'Nivel 2: Autostrada Fibrei Optice',
    nameEn: 'Stage 2: Fiber-Optic Highway',
    factRo: 'Fiecare mesaj pe Internet este împărțit în mici „pachete de date” care călătoresc prin routere și cabluri de fibră optică.',
    factEn: 'Every message on the Internet is split into tiny "data packets" routed across fiber-optic cables and switches.',
  },
  {
    nameRo: 'Nivel 3: Trafic DNS & Cloud Sync',
    nameEn: 'Stage 3: DNS & Cloud Sync Traffic',
    factRo: 'DNS (Port 53) este „agenda telefonică” a Internetului: transformă numele site-urilor (ex: google.com) în adrese IP numerice.',
    factEn: 'DNS (Port 53) is the phonebook of the Internet: it translates domain names into numeric IP addresses.',
  },
  {
    nameRo: 'Nivel 4+: Mega-Magistrala Quantum',
    nameEn: 'Stage 4+: Quantum Backbone Bus',
    factRo: 'Un Firewall inspectează fiecare pachet care intră sau iese din rețea pentru a bloca atacurile de tip Trojan, Phishing și DDoS!',
    factEn: 'A Firewall inspects every incoming and outgoing packet to block Trojan, Phishing, and DDoS threats!',
  },
];

function buildLanes(stage: number): Lane[] {
  const speedScale = 1 + (stage - 1) * 0.16;
  const lanes: Lane[] = [];

  // River Rows 1..5
  lanes.push({
    row: 1,
    kind: 'river',
    vx: 1.55 * speedScale,
    items: [
      { x: 20, w: 120, type: 'fiber', color: '#0ea5e9', label: '10Gbps' },
      { x: 240, w: 120, type: 'fiber', color: '#0ea5e9', label: 'FIBER' },
    ],
  });

  lanes.push({
    row: 2,
    kind: 'river',
    vx: -1.35 * speedScale,
    items: [
      { x: 30, w: 80, type: 'turtle', color: '#14b8a6', canDive: true, divePhase: 0.1 },
      { x: 180, w: 80, type: 'turtle', color: '#14b8a6', canDive: false, divePhase: 0 },
      { x: 330, w: 80, type: 'turtle', color: '#14b8a6', canDive: true, divePhase: 0.55 },
    ],
  });

  lanes.push({
    row: 3,
    kind: 'river',
    vx: 1.85 * speedScale,
    items: [
      { x: 0, w: 150, type: 'log', color: '#6366f1', label: 'DATA STREAM' },
      { x: 240, w: 140, type: 'log', color: '#6366f1', label: 'PACKET BUS' },
    ],
  });

  lanes.push({
    row: 4,
    kind: 'river',
    vx: 1.15 * speedScale,
    items: [
      { x: 40, w: 96, type: 'log', color: '#8b5cf6', label: 'RAM' },
      { x: 200, w: 96, type: 'log', color: '#8b5cf6', label: 'CACHE' },
      { x: 360, w: 96, type: 'log', color: '#8b5cf6', label: 'SSD' },
    ],
  });

  lanes.push({
    row: 5,
    kind: 'river',
    vx: -1.45 * speedScale,
    items: [
      { x: 10, w: 108, type: 'turtle', color: '#10b981', canDive: false, divePhase: 0 },
      { x: 170, w: 108, type: 'turtle', color: '#10b981', canDive: stage >= 2, divePhase: 0.3 },
      { x: 330, w: 108, type: 'turtle', color: '#10b981', canDive: false, divePhase: 0 },
    ],
  });

  // Road Rows 7..11
  lanes.push({
    row: 7,
    kind: 'road',
    vx: -2.2 * speedScale,
    items: [
      { x: 60, w: 56, type: 'ddos', color: '#ec4899', label: 'DDoS' },
      { x: 260, w: 56, type: 'ddos', color: '#ec4899', label: 'DDoS' },
    ],
  });

  lanes.push({
    row: 8,
    kind: 'road',
    vx: 1.45 * speedScale,
    items: [
      { x: 20, w: 96, type: 'trojan', color: '#ef4444', label: 'TROJAN' },
      { x: 230, w: 96, type: 'trojan', color: '#ef4444', label: 'TROJAN' },
    ],
  });

  lanes.push({
    row: 9,
    kind: 'road',
    vx: -1.65 * speedScale,
    items: [
      { x: 50, w: 56, type: 'spyware', color: '#a855f7', label: 'SPY' },
      { x: 190, w: 56, type: 'spyware', color: '#a855f7', label: 'SPY' },
      { x: 340, w: 56, type: 'spyware', color: '#a855f7', label: 'SPY' },
    ],
  });

  lanes.push({
    row: 10,
    kind: 'road',
    vx: 1.35 * speedScale,
    items: [
      { x: 30, w: 62, type: 'phish', color: '#f59e0b', label: 'PHISH' },
      { x: 185, w: 62, type: 'phish', color: '#f59e0b', label: 'PHISH' },
      { x: 340, w: 62, type: 'phish', color: '#f59e0b', label: 'PHISH' },
    ],
  });

  lanes.push({
    row: 11,
    kind: 'road',
    vx: -1.15 * speedScale,
    items: [
      { x: 20, w: 48, type: 'bug', color: '#fb7185', label: 'BUG' },
      { x: 160, w: 48, type: 'bug', color: '#fb7185', label: 'BUG' },
      { x: 310, w: 48, type: 'bug', color: '#fb7185', label: 'BUG' },
    ],
  });

  return lanes;
}

export const CyberFroggerGame: React.FC<CyberFroggerGameProps> = ({
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
      const local = Number(localStorage.getItem('arkedo_highscore_cyber_frogger') || '0');
      const active = getActiveStudent();
      const cloud = active?.arcadeScores?.cyber_frogger || 0;
      return Math.max(local, cloud);
    } catch {
      return 0;
    }
  });
  const [stage, setStage] = useState(1);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME_SEC);
  const [portsFilledCount, setPortsFilledCount] = useState(0);
  const [hasShield, setHasShield] = useState(false);
  const [muted, setMuted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const mutedRef = useRef(muted);
  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  // Mutable live refs for 60fps loop
  const frogRef = useRef({
    x: 5 * CELL,
    y: 12 * CELL,
    startX: 5 * CELL,
    startY: 12 * CELL,
    targetX: 5 * CELL,
    targetY: 12 * CELL,
    hopProgress: 1, // 1 = landed
    dir: 'UP' as Direction,
    minRowReached: 12,
    queuedDir: null as Direction | null,
    invulnTimer: 0,
  });

  const lanesRef = useRef<Lane[]>(buildLanes(1));
  const portsFilledRef = useRef<boolean[]>([false, false, false, false, false]);
  const bonusBugRef = useRef<{
    active: boolean;
    type: 'bitfly' | 'shield';
    portIndex: number;
    timer: number;
  }>({ active: false, type: 'bitfly', portIndex: 0, timer: 0 });

  const particlesRef = useRef<Particle[]>([]);
  const textsRef = useRef<FloatingText[]>([]);

  const statsRef = useRef({
    score: 0,
    highScore,
    stage: 1,
    lives: 3,
    timeLeft: ROUND_TIME_SEC,
    hasShield: false,
    shake: 0,
  });

  useEffect(() => {
    forceScrollToTop();
  }, []);

  // Block arrow/space page scrolling while playing
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

  // Web Audio 1981 Frogger Synth
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
      // ignore
    }
  }, []);

  const sfxHop = useCallback(() => playTone(320, 'triangle', 0.07, 0.09, 590), [playTone]);
  const sfxSplash = useCallback(() => playTone(260, 'sawtooth', 0.28, 0.11, 55), [playTone]);
  const sfxCrash = useCallback(() => {
    playTone(180, 'square', 0.16, 0.12, 60);
    setTimeout(() => playTone(110, 'sawtooth', 0.22, 0.1, 45), 90);
  }, [playTone]);
  const sfxPort = useCallback(() => {
    [523, 659, 784].forEach((f, idx) => setTimeout(() => playTone(f, 'triangle', 0.12, 0.1), idx * 75));
  }, [playTone]);
  const sfxBonus = useCallback(() => {
    playTone(880, 'triangle', 0.08, 0.09);
    setTimeout(() => playTone(1174, 'triangle', 0.14, 0.1), 70);
  }, [playTone]);
  const sfxStageClear = useCallback(() => {
    [523, 659, 784, 1046, 1318].forEach((f, idx) => setTimeout(() => playTone(f, 'triangle', 0.15, 0.1), idx * 85));
  }, [playTone]);

  const spawnParticles = (x: number, y: number, color: string, count = 12) => {
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 1.2 + Math.random() * 3.4;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 2.5 + Math.random() * 2.5,
        color,
        life: 22 + Math.random() * 14,
        maxLife: 36,
      });
    }
  };

  const addFloatingText = (text: string, x: number, y: number, color = '#34d399') => {
    textsRef.current.push({ text, x, y, color, alpha: 1 });
  };

  const persistScore = useCallback(
    (finalScore: number, awardStageBonus = false) => {
      if (finalScore > statsRef.current.highScore) {
        statsRef.current.highScore = finalScore;
        setHighScore(finalScore);
        try {
          localStorage.setItem('arkedo_highscore_cyber_frogger', String(finalScore));
        } catch {
          // ignore
        }
      }
      if (finalScore > 0) {
        updateStudentArcadeScore('cyber_frogger', finalScore);
        onSaveScore?.(finalScore);
      }
      if (awardStageBonus) {
        onAwardXP?.(100, 'Cyber Frogger Network Stage Clear!');
      }
    },
    [onAwardXP, onSaveScore]
  );

  const resetFrogToStart = useCallback((resetMinRow = true) => {
    const f = frogRef.current;
    f.x = 5 * CELL;
    f.y = 12 * CELL;
    f.startX = f.x;
    f.startY = f.y;
    f.targetX = f.x;
    f.targetY = f.y;
    f.hopProgress = 1;
    f.dir = 'UP';
    f.queuedDir = null;
    if (resetMinRow) {
      f.minRowReached = 12;
    }
    statsRef.current.timeLeft = ROUND_TIME_SEC;
    setTimeLeft(ROUND_TIME_SEC);
  }, []);

  const setupStage = useCallback(
    (stageNum: number, resetEntire: boolean) => {
      lanesRef.current = buildLanes(stageNum);
      portsFilledRef.current = [false, false, false, false, false];
      setPortsFilledCount(0);
      particlesRef.current = [];
      textsRef.current = [];
      bonusBugRef.current = { active: false, type: 'bitfly', portIndex: 0, timer: 160 };

      if (resetEntire) {
        statsRef.current.score = 0;
        statsRef.current.lives = 3;
        statsRef.current.hasShield = false;
        setScore(0);
        setLives(3);
        setHasShield(false);
      }
      statsRef.current.stage = stageNum;
      setStage(stageNum);
      resetFrogToStart(true);
    },
    [resetFrogToStart]
  );

  const handleStartNewGame = () => {
    initAudio();
    sounds.playClick();
    setupStage(1, true);
    setGameState('playing');
    forceScrollToTop();
  };

  const handleNextStage = () => {
    initAudio();
    sounds.playClick();
    setupStage(statsRef.current.stage + 1, false);
    setGameState('playing');
    forceScrollToTop();
  };

  const attemptHop = useCallback(
    (dir: Direction) => {
      if (gameState !== 'playing') return;
      initAudio();
      const f = frogRef.current;
      if (f.hopProgress < 1) {
        f.queuedDir = dir;
        return;
      }

      const curCol = Math.round(f.x / CELL);
      const curRow = Math.round(f.y / CELL);
      let nextX = f.x;
      let nextY = f.y;

      if (dir === 'UP') {
        if (curRow <= 0) return;
        nextY = (curRow - 1) * CELL;
        // Snap horizontally cleanly when entering top goal row so landing in ports feels forgiving
        if (curRow - 1 === 0) {
          nextX = curCol * CELL;
        }
      } else if (dir === 'DOWN') {
        if (curRow >= ROWS - 1) return;
        nextY = (curRow + 1) * CELL;
      } else if (dir === 'LEFT') {
        if (f.x - CELL < -8) return;
        nextX = Math.max(0, f.x - CELL);
      } else if (dir === 'RIGHT') {
        if (f.x + CELL > CANVAS_W - CELL + 8) return;
        nextX = Math.min(CANVAS_W - CELL, f.x + CELL);
      }

      f.startX = f.x;
      f.startY = f.y;
      f.targetX = nextX;
      f.targetY = nextY;
      f.dir = dir;
      f.hopProgress = 0;
      sfxHop();
    },
    [gameState, initAudio, sfxHop]
  );

  // Keyboard Listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P') {
        setGameState((prev) => (prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev));
        return;
      }
      if (gameState !== 'playing') return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') attemptHop('UP');
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') attemptHop('DOWN');
      else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') attemptHop('LEFT');
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') attemptHop('RIGHT');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [attemptHop, gameState]);

  // Touch Swipe directly on Canvas
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || gameState !== 'playing') return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (Math.max(absX, absY) >= 16) {
      if (absX > absY) attemptHop(dx > 0 ? 'RIGHT' : 'LEFT');
      else attemptHop(dy > 0 ? 'DOWN' : 'UP');
    } else {
      // Quick tap without swipe -> hop UP!
      attemptHop('UP');
    }
    touchStartRef.current = null;
  };

  // Main 60fps Game Loop
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
    let secondTimer = 0;

    const triggerFrogFailure = (reasonRo: string, reasonEn: string, isWater: boolean) => {
      const f = frogRef.current;
      if (f.invulnTimer > 0) return;

      // Shield saves from traffic / boundary hit (except water void if not shielded, or shield bounces back safely!)
      if (statsRef.current.hasShield) {
        statsRef.current.hasShield = false;
        setHasShield(false);
        f.invulnTimer = 90;
        statsRef.current.shake = 6;
        sfxBonus();
        spawnParticles(f.x + CELL / 2, f.y + CELL / 2, '#38bdf8', 18);
        addFloatingText(isEn ? 'SHIELD SAVED!' : 'SCUT ACTIVAT!', f.x + CELL / 2, f.y, '#38bdf8');
        if (isWater) {
          resetFrogToStart(false);
        }
        return;
      }

      if (isWater) sfxSplash();
      else sfxCrash();

      statsRef.current.shake = 10;
      spawnParticles(f.x + CELL / 2, f.y + CELL / 2, isWater ? '#22d3ee' : '#f43f5e', 20);
      addFloatingText(isEn ? reasonEn : reasonRo, f.x + CELL / 2, f.y, '#fb7185');

      statsRef.current.lives -= 1;
      setLives(statsRef.current.lives);

      if (statsRef.current.lives <= 0) {
        persistScore(statsRef.current.score, false);
        setGameState('gameover');
        return;
      } else {
        resetFrogToStart(false);
      }
    };

    const loop = (now: number) => {
      const rawDt = (now - lastTime) / 16.6667;
      lastTime = now;
      const dt = Math.min(2.0, Math.max(0.4, rawDt));

      if (statsRef.current.shake > 0) statsRef.current.shake = Math.max(0, statsRef.current.shake - 0.6 * dt);
      if (frogRef.current.invulnTimer > 0) frogRef.current.invulnTimer = Math.max(0, frogRef.current.invulnTimer - dt);

      // 1. UPDATE TIMER
      secondTimer += dt / 60;
      if (secondTimer >= 1) {
        secondTimer -= 1;
        statsRef.current.timeLeft -= 1;
        setTimeLeft(statsRef.current.timeLeft);
        if (statsRef.current.timeLeft <= 0) {
          triggerFrogFailure('TIMP EXPIRAT!', 'TIME UP!', false);
          if (statsRef.current.lives <= 0) return;
        }
      }

      // 2. UPDATE BONUS PORT FLY/SHIELD SPAWNER
      const bug = bonusBugRef.current;
      bug.timer -= dt;
      if (bug.timer <= 0) {
        if (bug.active) {
          bug.active = false;
          bug.timer = 180 + Math.random() * 140;
        } else {
          const openIndices = PORT_COLS.map((_, idx) => idx).filter((idx) => !portsFilledRef.current[idx]);
          if (openIndices.length > 0) {
            bug.active = true;
            bug.portIndex = openIndices[Math.floor(Math.random() * openIndices.length)];
            bug.type = Math.random() < 0.35 && !statsRef.current.hasShield ? 'shield' : 'bitfly';
            bug.timer = 320;
          } else {
            bug.timer = 150;
          }
        }
      }

      // 3. UPDATE LANES (Wrap around cleanly)
      lanesRef.current.forEach((lane) => {
        lane.items.forEach((item) => {
          item.x += lane.vx * dt;
          if (lane.vx > 0 && item.x > CANVAS_W + 20) {
            item.x = -item.w - 20;
          } else if (lane.vx < 0 && item.x + item.w < -20) {
            item.x = CANVAS_W + 20;
          }
          if (item.canDive && item.divePhase !== undefined) {
            item.divePhase = (item.divePhase + 0.0028 * dt) % 1;
          }
        });
      });

      // 4. UPDATE FROG HOPPING & PLATFORM RIDING
      const f = frogRef.current;
      if (f.hopProgress < 1) {
        f.hopProgress = Math.min(1, f.hopProgress + 0.16 * dt);
        const t = f.hopProgress;
        f.x = f.startX + (f.targetX - f.startX) * t;
        f.y = f.startY + (f.targetY - f.startY) * t;

        if (f.hopProgress === 1) {
          const landedRow = Math.round(f.y / CELL);
          if (landedRow < f.minRowReached && landedRow > 0) {
            f.minRowReached = landedRow;
            statsRef.current.score += 10;
            setScore(statsRef.current.score);
          }
          if (f.queuedDir) {
            const q = f.queuedDir;
            f.queuedDir = null;
            attemptHop(q);
          }
        }
      }

      // 5. COLLISION & LANDING DETECTION (only evaluate tile hazards when landed)
      if (f.hopProgress === 1) {
        const currentRow = Math.round(f.y / CELL);
        const frogLeft = f.x + 8;
        const frogRight = f.x + CELL - 8;
        const frogCenterX = f.x + CELL / 2;

        if (currentRow === 0) {
          // Check Goal Port docking!
          let dockedPortIdx = -1;
          PORT_COLS.forEach((pCol, idx) => {
            const portCenter = pCol * CELL + CELL / 2;
            if (Math.abs(frogCenterX - portCenter) < CELL * 0.58) {
              dockedPortIdx = idx;
            }
          });

          if (dockedPortIdx !== -1 && !portsFilledRef.current[dockedPortIdx]) {
            portsFilledRef.current[dockedPortIdx] = true;
            const filledNow = portsFilledRef.current.filter(Boolean).length;
            setPortsFilledCount(filledNow);

            let earned = 150 + statsRef.current.timeLeft * 10;
            if (bug.active && bug.portIndex === dockedPortIdx) {
              if (bug.type === 'shield') {
                statsRef.current.hasShield = true;
                setHasShield(true);
                earned += 250;
                addFloatingText('+250 SHIELD!', frogCenterX, CELL, '#38bdf8');
              } else {
                earned += 250;
                addFloatingText('+250 BIT-FLY!', frogCenterX, CELL, '#facc15');
              }
              bug.active = false;
              sfxBonus();
            } else {
              sfxPort();
              addFloatingText(`+${earned}`, frogCenterX, CELL, '#34d399');
            }

            statsRef.current.score += earned;
            setScore(statsRef.current.score);
            if (statsRef.current.score > statsRef.current.highScore) {
              statsRef.current.highScore = statsRef.current.score;
              setHighScore(statsRef.current.score);
            }
            spawnParticles(frogCenterX, CELL / 2, '#34d399', 18);

            if (filledNow === PORT_COLS.length) {
              // All 5 Ports Docked -> Stage Clear!
              sfxStageClear();
              const stageBonus = 500 + statsRef.current.stage * 200;
              statsRef.current.score += stageBonus;
              setScore(statsRef.current.score);
              persistScore(statsRef.current.score, true);
              setGameState('stage_clear');
              return;
            } else {
              resetFrogToStart(true);
            }
          } else {
            // Hit wall between ports or already occupied port!
            triggerFrogFailure('PORT BLOCAT!', 'PORT BLOCKED!', false);
            if (statsRef.current.lives <= 0) return;
          }
        } else if (currentRow >= 1 && currentRow <= 5) {
          // River Zone: Must stand on an un-submerged platform
          const lane = lanesRef.current.find((l) => l.row === currentRow);
          let ridingPlatform: LaneObject | null = null;
          if (lane) {
            for (const item of lane.items) {
              const submerged = item.canDive && (item.divePhase ?? 0) > 0.78;
              if (!submerged && frogCenterX >= item.x + 2 && frogCenterX <= item.x + item.w - 2) {
                ridingPlatform = item;
                break;
              }
            }
          }

          if (ridingPlatform && lane) {
            f.x += lane.vx * dt;
            f.startX = f.x;
            f.targetX = f.x;
            if (f.x < -CELL * 0.45 || f.x + CELL > CANVAS_W + CELL * 0.45) {
              triggerFrogFailure('PIERDUT ÎN FLUX!', 'DRIFTED OFF!', true);
              if (statsRef.current.lives <= 0) return;
            }
          } else {
            triggerFrogFailure('SCURTCIRCUIT!', 'SPLASHED!', true);
            if (statsRef.current.lives <= 0) return;
          }
        } else if (currentRow >= 7 && currentRow <= 11) {
          // Road Zone: Check Malware Vehicles
          const lane = lanesRef.current.find((l) => l.row === currentRow);
          if (lane) {
            const hit = lane.items.some((item) => frogRight > item.x + 4 && frogLeft < item.x + item.w - 4);
            if (hit) {
              triggerFrogFailure('LOVIT DE MALWARE!', 'MALWARE HIT!', false);
              if (statsRef.current.lives <= 0) return;
            }
          }
        }
      }

      // 6. UPDATE PARTICLES & TEXTS
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

      // 7. RENDER CANVAS
      ctx.save();
      if (statsRef.current.shake > 0) {
        ctx.translate((Math.random() - 0.5) * statsRef.current.shake, (Math.random() - 0.5) * statsRef.current.shake);
      }

      // Background Zones
      // River Background (Rows 0..5)
      const riverGrad = ctx.createLinearGradient(0, 0, 0, 6 * CELL);
      riverGrad.addColorStop(0, '#042f2e');
      riverGrad.addColorStop(1, '#082f49');
      ctx.fillStyle = riverGrad;
      ctx.fillRect(0, 0, CANVAS_W, 6 * CELL);

      // Animated data stream shimmer lines on river
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.12)';
      ctx.lineWidth = 1;
      for (let r = 1; r <= 5; r++) {
        const yLine = r * CELL + CELL / 2;
        ctx.beginPath();
        ctx.moveTo(0, yLine);
        ctx.lineTo(CANVAS_W, yLine);
        ctx.stroke();
      }

      // Middle Safe Median (Row 6)
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(0, 6 * CELL, CANVAS_W, CELL);
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(0, 6 * CELL, CANVAS_W, CELL);
      ctx.fillStyle = 'rgba(165, 180, 252, 0.4)';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('=== ROUTER SAFE BUFFER ===', CANVAS_W / 2, 6 * CELL + CELL / 2);

      // Cyber Road (Rows 7..11)
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 7 * CELL, CANVAS_W, 5 * CELL);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.setLineDash([12, 12]);
      for (let r = 8; r <= 11; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * CELL);
        ctx.lineTo(CANVAS_W, r * CELL);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Start Base (Row 12)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 12 * CELL, CANVAS_W, CELL);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(0, 12 * CELL, CANVAS_W, CELL);
      ctx.fillStyle = 'rgba(52, 211, 153, 0.45)';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('LOCALHOST START ZONE', CANVAS_W / 2, 12 * CELL + CELL / 2);

      // Top Goal Row (Row 0): Walls & 5 Server Ports
      for (let c = 0; c < COLS; c++) {
        const px = c * CELL;
        const portIdx = PORT_COLS.indexOf(c);
        if (portIdx === -1) {
          // Cyber Firewall Wall Divider
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(px, 0, CELL, CELL);
          ctx.strokeStyle = '#334155';
          ctx.strokeRect(px + 2, 2, CELL - 4, CELL - 4);
        } else {
          const filled = portsFilledRef.current[portIdx];
          ctx.fillStyle = filled ? '#064e3b' : '#020617';
          ctx.beginPath();
          ctx.roundRect(px + 2, 2, CELL - 4, CELL - 4, 8);
          ctx.fill();
          ctx.strokeStyle = filled ? '#34d399' : '#06b6d4';
          ctx.lineWidth = 2;
          ctx.stroke();

          if (filled) {
            // Docked Cyber Frog Icon
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.arc(px + CELL / 2, CELL / 2, 11, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fef08a';
            ctx.font = 'bold 12px sans-serif';
            ctx.fillText('✓', px + CELL / 2, CELL / 2 + 1);
          } else {
            // Port Label
            ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
            ctx.font = 'bold 8px monospace';
            ctx.fillText(PORT_NAMES[portIdx].split(':')[0], px + CELL / 2, CELL / 2 + 10);

            // Bonus collectible inside port
            if (bug.active && bug.portIndex === portIdx) {
              const pulse = 1 + Math.sin(now / 110) * 0.15;
              ctx.save();
              ctx.translate(px + CELL / 2, CELL / 2 - 3);
              ctx.scale(pulse, pulse);
              ctx.font = '16px sans-serif';
              ctx.fillText(bug.type === 'shield' ? '🛡️' : '⚡', 0, 0);
              ctx.restore();
            }
          }
        }
      }

      // Draw River & Road Objects
      lanesRef.current.forEach((lane) => {
        const py = lane.row * CELL;
        lane.items.forEach((item) => {
          ctx.save();
          if (lane.kind === 'river') {
            const phase = item.divePhase ?? 0;
            const submerged = item.canDive && phase > 0.78;
            const warning = item.canDive && phase > 0.6 && phase <= 0.78;

            if (submerged) {
              // Outline ripple showing where turtle dove
              ctx.strokeStyle = 'rgba(45, 212, 191, 0.3)';
              ctx.setLineDash([4, 4]);
              ctx.strokeRect(item.x + 4, py + 8, item.w - 8, CELL - 16);
              ctx.setLineDash([]);
            } else {
              const alpha = warning && Math.floor(now / 120) % 2 === 0 ? 0.45 : 1;
              ctx.globalAlpha = alpha;
              if (item.type === 'turtle') {
                // Draw segmented cyber sync nodes (2 or 3 turtles)
                const segCount = Math.max(2, Math.floor(item.w / 32));
                const segW = item.w / segCount;
                for (let s = 0; s < segCount; s++) {
                  const cx = item.x + s * segW + segW / 2;
                  const cy = py + CELL / 2;
                  ctx.fillStyle = warning ? '#f59e0b' : item.color;
                  ctx.beginPath();
                  ctx.arc(cx, cy, 13, 0, Math.PI * 2);
                  ctx.fill();
                  ctx.strokeStyle = '#99f6e4';
                  ctx.lineWidth = 1.5;
                  ctx.stroke();
                  ctx.fillStyle = '#0f172a';
                  ctx.fillRect(cx - 4, cy - 4, 8, 8);
                }
              } else {
                // Data Log or Fiber Raft
                ctx.fillStyle = item.color;
                ctx.shadowColor = item.color;
                ctx.shadowBlur = 5;
                ctx.beginPath();
                ctx.roundRect(item.x + 2, py + 6, item.w - 4, CELL - 12, 8);
                ctx.fill();
                ctx.shadowBlur = 0;

                ctx.strokeStyle = '#e0f2fe';
                ctx.lineWidth = 1.5;
                ctx.stroke();
                if (item.label) {
                  ctx.fillStyle = '#ffffff';
                  ctx.font = 'bold 9px monospace';
                  ctx.fillText(item.label, item.x + item.w / 2, py + CELL / 2 + 1);
                }
              }
            }
          } else {
            // Malware Vehicles on Cyber Highway
            ctx.fillStyle = item.color;
            ctx.shadowColor = item.color;
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.roundRect(item.x + 2, py + 6, item.w - 4, CELL - 12, 6);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Headlights facing direction of travel
            ctx.fillStyle = '#fef08a';
            const frontX = lane.vx > 0 ? item.x + item.w - 7 : item.x + 3;
            ctx.fillRect(frontX, py + 9, 4, 5);
            ctx.fillRect(frontX, py + CELL - 14, 4, 5);

            if (item.label) {
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 9px monospace';
              ctx.fillText(item.label, item.x + item.w / 2, py + CELL / 2 + 1);
            }
          }
          ctx.restore();
        });
      });

      // Draw Cyber Bit-Frog
      const frogCx = f.x + CELL / 2;
      const frogCy = f.y + CELL / 2;
      const hopScale = 1 + Math.sin(f.hopProgress * Math.PI) * 0.28;
      let rot = 0;
      if (f.dir === 'RIGHT') rot = Math.PI / 2;
      if (f.dir === 'DOWN') rot = Math.PI;
      if (f.dir === 'LEFT') rot = -Math.PI / 2;

      ctx.save();
      ctx.translate(frogCx, frogCy);
      ctx.rotate(rot);
      ctx.scale(hopScale, hopScale);

      // Shield halo if active
      if (statsRef.current.hasShield || f.invulnTimer > 0) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Frog Hind & Front Legs
      ctx.fillStyle = '#059669';
      ctx.fillRect(-13, 3, 5, 9);
      ctx.fillRect(8, 3, 5, 9);
      ctx.fillRect(-12, -10, 4, 7);
      ctx.fillRect(8, -10, 4, 7);

      // Frog Torso
      ctx.fillStyle = '#34d399';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.ellipse(0, 0, 10, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Cyber Visor / Eyes
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(-5, -9, 3.2, 0, Math.PI * 2);
      ctx.arc(5, -9, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-6, -10, 2, 2);
      ctx.fillRect(4, -10, 2, 2);

      ctx.restore();

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

      ctx.restore();

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [attemptHop, gameState, isEn, persistScore, resetFrogToStart, sfxBonus, sfxCrash, sfxPort, sfxSplash, sfxStageClear]);

  const stageMeta = STAGE_NETWORK_FACTS[Math.min(stage - 1, STAGE_NETWORK_FACTS.length - 1)];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 pb-10 select-none">
      {/* Top Bar */}
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
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">{isEn ? 'Back' : 'Înapoi'}</span>
          </button>

          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-black text-white font-heading truncate flex items-center gap-2">
              <span aria-hidden="true">🐸</span>
              <span>{isEn ? 'Cyber Frogger: Network Hopper' : 'Cyber Frogger: Traversarea Rețelei'}</span>
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>{studentAvatar || '🎓'} {studentName || (isEn ? 'Cadet' : 'Elev')}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-semibold">{isEn ? stageMeta.nameEn : stageMeta.nameRo}</span>
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Game Screen & Mobile D-Pad */}
        <div className="lg:col-span-8 flex flex-col items-center gap-3">
          {/* HUD Bar */}
          <div className="w-full max-w-[440px] grid grid-cols-5 gap-1.5 bg-slate-900 border border-slate-800 rounded-2xl p-2.5 text-center shadow-lg">
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase">{isEn ? 'Score' : 'Scor'}</div>
              <div className="text-sm sm:text-base font-black text-emerald-300 font-mono tabular-nums">{score.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase">{isEn ? 'Record' : 'Record'}</div>
              <div className="text-sm sm:text-base font-black text-amber-300 font-mono tabular-nums">{highScore.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase">{isEn ? 'Ports' : 'Porturi'}</div>
              <div className="text-sm sm:text-base font-black text-cyan-300 font-mono tabular-nums">{portsFilledCount}/5</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase">{isEn ? 'Time' : 'Timp'}</div>
              <div className={`text-sm sm:text-base font-black font-mono tabular-nums ${timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-slate-100'}`}>
                {timeLeft}s
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase">{isEn ? 'Lives' : 'Vieți'}</div>
              <div className="text-xs font-black text-rose-400 flex items-center justify-center gap-0.5 mt-1">
                {Array.from({ length: Math.max(0, lives) }).map((_, i) => (
                  <Heart key={i} className="w-3.5 h-3.5 fill-rose-500 text-rose-400" />
                ))}
                {lives === 0 && <span>0</span>}
              </div>
            </div>
          </div>

          {hasShield && (
            <div className="w-full max-w-[440px] flex items-center justify-center gap-2 text-xs font-mono font-bold text-sky-300 bg-sky-950/60 border border-sky-500/40 rounded-xl px-3 py-1.5">
              <Shield className="w-4 h-4 text-sky-400" />
              <span>{isEn ? 'Cyber Shield Active (Blocks 1 Hazard)' : 'Scut Cibernetic Activ (Blochează 1 Lovitură)'}</span>
            </div>
          )}

          {/* Canvas Box */}
          <div className="relative w-full max-w-[440px] aspect-[440/520] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-500/40">
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="w-full h-full block touch-none"
            />

            {/* MENU OVERLAY */}
            {gameState === 'menu' && (
              <div className="absolute inset-0 bg-slate-950/92 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 text-3xl">
                  🐸
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
                    Cyber Frogger 1981
                  </h2>
                  <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-sm leading-relaxed">
                    {isEn
                      ? 'Guide Bit-Frog across the malware cyber highway and hop across Data Logs & Sync Turtles to dock inside all 5 Server Ports!'
                      : 'Ghidează-l pe Bit-Frog peste autostrada cu viruși și sari pe pachetele de date și țestoasele Sync până în cele 5 Porturi de Server!'}
                  </p>
                </div>

                <div className="w-full max-w-xs text-left text-xs text-slate-300 space-y-1.5 border-y border-slate-800 py-3">
                  <div>⌨️ {isEn ? 'Arrow Keys or W / A / S / D' : 'Săgeți sau tastele W / A / S / D'}</div>
                  <div>📱 {isEn ? 'Swipe on screen or use the D-Pad below' : 'Glisează pe ecran sau folosește D-Pad-ul de jos'}</div>
                  <div>⚡ {isEn ? 'Dock in Ports before 45s timer expires!' : 'Intră în porturi înainte să expire cele 45s!'}</div>
                </div>

                <button
                  type="button"
                  onClick={handleStartNewGame}
                  className="min-h-[48px] px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm shadow-lg shadow-emerald-500/30 transition active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>{isEn ? 'Start Game' : 'Începe Jocul'}</span>
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
                    {isEn ? 'All 5 Ports Connected!' : 'Toate cele 5 Porturi Conectate!'}
                  </div>
                  <h2 className="text-2xl font-black text-white mt-1">
                    {isEn ? `Stage ${stage} Complete!` : `Nivelul ${stage} Complet!`}
                  </h2>
                  <p className="text-amber-300 font-mono font-bold text-sm mt-1">
                    +{500 + stage * 200} {isEn ? 'Network Bonus' : 'Bonus Rețea'}
                  </p>
                </div>

                <div className="max-w-xs bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 leading-relaxed">
                  <div className="font-bold text-cyan-300 mb-1 flex items-center justify-center gap-1">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Networking Fact' : 'Știai că? (Rețele TIC)'}</span>
                  </div>
                  {isEn ? stageMeta.factEn : stageMeta.factRo}
                </div>

                <button
                  type="button"
                  onClick={handleNextStage}
                  className="min-h-[46px] px-7 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm shadow-lg transition active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{isEn ? `Next Network (Stage ${stage + 1})` : `Rețeaua Următoare (Nivel ${stage + 1})`}</span>
                </button>
              </div>
            )}

            {/* GAME OVER OVERLAY */}
            {gameState === 'gameover' && (
              <div className="absolute inset-0 bg-slate-950/92 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center gap-4">
                <RotateCcw className="w-12 h-12 text-rose-400" />
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    {isEn ? 'Connection Lost!' : 'Conexiune Pierdută!'}
                  </h2>
                  <p className="text-slate-300 text-xs sm:text-sm mt-1">
                    {isEn ? `Reached Stage ${stage}` : `Ai ajuns până la Nivelul ${stage}`}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-900 border border-slate-800 rounded-2xl px-6 py-3">
                  <div>
                    <div className="text-[11px] text-slate-400">{isEn ? 'Final Score' : 'Scor Final'}</div>
                    <div className="text-xl font-black text-emerald-300 font-mono tabular-nums">{score.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">{isEn ? 'Best Record' : 'Record Personal'}</div>
                    <div className="text-xl font-black text-amber-300 font-mono tabular-nums">{highScore.toLocaleString()}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStartNewGame}
                  className="min-h-[46px] px-7 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{isEn ? 'Play Again' : 'Joacă din Nou'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile & Touch Ergonomic D-Pad */}
          <div className="w-full max-w-[260px] flex flex-col items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => attemptHop('UP')}
              className="w-20 min-h-[52px] rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 border border-slate-700 text-white flex items-center justify-center touch-manipulation cursor-pointer shadow-md"
              aria-label="Hop Up"
            >
              <ChevronUp className="w-7 h-7" />
            </button>
            <div className="flex items-center justify-center gap-3 w-full">
              <button
                type="button"
                onClick={() => attemptHop('LEFT')}
                className="w-20 min-h-[52px] rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 border border-slate-700 text-white flex items-center justify-center touch-manipulation cursor-pointer shadow-md"
                aria-label="Hop Left"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button
                type="button"
                onClick={() => attemptHop('DOWN')}
                className="w-20 min-h-[52px] rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 border border-slate-700 text-white flex items-center justify-center touch-manipulation cursor-pointer shadow-md"
                aria-label="Hop Down"
              >
                <ChevronDown className="w-7 h-7" />
              </button>
              <button
                type="button"
                onClick={() => attemptHop('RIGHT')}
                className="w-20 min-h-[52px] rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 border border-slate-700 text-white flex items-center justify-center touch-manipulation cursor-pointer shadow-md"
                aria-label="Hop Right"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Legend & Scoring Guide */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <h3 className="text-sm font-black text-white mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>{isEn ? 'Network Crossing Guide' : 'Ghid de Traversare'}</span>
            </h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-4 rounded bg-indigo-500 shrink-0" />
                <span>{isEn ? 'Data Logs & Fiber Rafts · Safe ride' : 'Pachete Date & Fibră · Platformă sigură'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-4 rounded-full bg-teal-500 shrink-0" />
                <span>{isEn ? 'Sync Turtles · Dive when blinking amber!' : 'Țestoase Sync · Se scufundă când clipesc!'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-4 rounded bg-red-500 shrink-0" />
                <span>{isEn ? 'Trojans, Phish & DDoS · Avoid on road' : 'Troieni, Phish & DDoS · Evită pe șosea'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-4 rounded bg-emerald-600 text-white font-mono text-[9px] font-bold flex items-center justify-center shrink-0">
                  80
                </span>
                <span>{isEn ? 'Server Ports · Dock all 5 to clear stage!' : 'Porturi Server · Ocupă toate 5 pt. nivel!'}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <h3 className="text-sm font-black text-white mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{isEn ? 'Bonus Pickups & Points' : 'Bonusuri & Punctaj'}</span>
            </h3>
            <div className="space-y-2 text-xs text-slate-300">
              <div>⚡ <span className="text-amber-300 font-bold">+250 pts</span> · {isEn ? 'Bit-Fly inside open Port' : 'Bit-Fly apărut în Port'}</div>
              <div>🛡️ <span className="text-sky-300 font-bold">+250 pts + Shield</span> · {isEn ? 'Survives 1 hit!' : 'Te salvează de 1 lovitură!'}</div>
              <div>⏱️ <span className="text-emerald-300 font-bold">+10 pts / sec</span> · {isEn ? 'Time bonus on every port' : 'Bonus viteză la fiecare port'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
