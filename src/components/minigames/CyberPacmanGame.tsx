import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Trophy,
  RotateCcw,
  Sparkles,
  Zap,
  Play,
  Pause,
  Award,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Shield,
  HelpCircle,
  Coins
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { forceScrollToTop } from '../../utils/scrollHelper';
import { getActiveStudent } from '../../lib/studentAuthService';

interface CyberPacmanGameProps {
  onBack: () => void;
  studentName?: string;
  studentAvatar?: string;
  onAwardXP?: (amount: number, reason: string) => void;
}

// Direction types
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'NONE';

interface Position {
  x: number;
  y: number;
}

interface Ghost {
  id: 'blinky' | 'pinky' | 'inky' | 'clyde';
  nameRo: string;
  nameEn: string;
  threatRo: string;
  threatEn: string;
  color: string;
  x: number;
  y: number;
  dir: Direction;
  targetX: number;
  targetY: number;
  isFrightened: boolean;
  isEaten: boolean; // Just eyes returning to base
  homeX: number;
  homeY: number;
}

// Bonus item appearing under CPU socket
interface BonusItem {
  type: 'floppy' | 'cd' | 'nvme' | 'qubit';
  labelRo: string;
  labelEn: string;
  icon: string;
  points: number;
  active: boolean;
  duration: number; // in frames
}

// 21 columns x 21 rows classic cyber circuit maze
// 0: empty path, 1: bit (dot), 2: neon wall, 3: firewall power pellet, 4: CPU house (ghost spawn), 5: warp tunnel
const INITIAL_MAZE: number[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2],
  [2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2],
  [2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [2, 1, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1, 2],
  [2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2],
  [2, 2, 2, 2, 2, 1, 2, 2, 2, 0, 2, 0, 2, 2, 2, 1, 2, 2, 2, 2, 2],
  [0, 0, 0, 0, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 0, 0, 0, 0],
  [2, 2, 2, 2, 2, 1, 2, 0, 2, 2, 4, 2, 2, 0, 2, 1, 2, 2, 2, 2, 2],
  [5, 0, 0, 0, 0, 1, 0, 0, 2, 4, 4, 4, 2, 0, 0, 1, 0, 0, 0, 0, 5],
  [2, 2, 2, 2, 2, 1, 2, 0, 2, 2, 2, 2, 2, 0, 2, 1, 2, 2, 2, 2, 2],
  [0, 0, 0, 0, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 0, 0, 0, 0],
  [2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2],
  [2, 3, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1, 3, 2],
  [2, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2],
  [2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2],
  [2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
];

const GHOST_CONFIG: Ghost[] = [
  {
    id: 'blinky',
    nameRo: 'Troianul Roșu',
    nameEn: 'Red Trojan',
    threatRo: 'Urmărire directă',
    threatEn: 'Direct pursuer',
    color: '#ef4444',
    x: 10,
    y: 8,
    dir: 'UP',
    targetX: 10,
    targetY: 8,
    isFrightened: false,
    isEaten: false,
    homeX: 19,
    homeY: 1
  },
  {
    id: 'pinky',
    nameRo: 'Viermele Roz',
    nameEn: 'Pink Worm',
    threatRo: 'Capcană frontală',
    threatEn: 'Ambush ahead',
    color: '#ec4899',
    x: 9,
    y: 10,
    dir: 'UP',
    targetX: 9,
    targetY: 10,
    isFrightened: false,
    isEaten: false,
    homeX: 1,
    homeY: 1
  },
  {
    id: 'inky',
    nameRo: 'Spionul Cyan',
    nameEn: 'Cyan Spyware',
    threatRo: 'Flancare oblică',
    threatEn: 'Flanking scout',
    color: '#06b6d4',
    x: 10,
    y: 10,
    dir: 'UP',
    targetX: 10,
    targetY: 10,
    isFrightened: false,
    isEaten: false,
    homeX: 19,
    homeY: 19
  },
  {
    id: 'clyde',
    nameRo: 'Ransomware Criptor',
    nameEn: 'Orange Ransom',
    threatRo: 'Pază & retragere',
    threatEn: 'Patrol & retreat',
    color: '#f97316',
    x: 11,
    y: 10,
    dir: 'UP',
    targetX: 11,
    targetY: 10,
    isFrightened: false,
    isEaten: false,
    homeX: 1,
    homeY: 19
  }
];

export const CyberPacmanGame: React.FC<CyberPacmanGameProps> = ({
  onBack,
  studentName = 'Campion TIC',
  studentAvatar = '🎓',
  onAwardXP
}) => {
  const { lang } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // High score handling
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const local = Number(localStorage.getItem('arkedo_highscore_cyber_pacman') || '0');
      const active = getActiveStudent();
      const cloud = active?.arcadeScores?.cyber_pacman || 0;
      return Math.max(local, cloud);
    } catch {
      return 0;
    }
  });

  // Sound Synth Settings
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Game Loop States
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [victory, setVictory] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [level, setLevel] = useState<number>(1);
  const [frightenedTime, setFrightenedTime] = useState<number>(0);
  const [ghostCombo, setGhostCombo] = useState<number>(0);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);

  // Floppy / Tech Artifact Bonus
  const [bonusItem, setBonusItem] = useState<BonusItem | null>(null);

  // Floating score text announcements on canvas
  const floatingTextsRef = useRef<{ text: string; x: number; y: number; alpha: number; color: string }[]>([]);

  // Pac-Man Entity State
  const pacmanRef = useRef({
    x: 10, // Tile units
    y: 16,
    subX: 10, // Continuous sub-pixel coordinate
    subY: 16,
    dir: 'NONE' as Direction,
    nextDir: 'NONE' as Direction,
    mouthAngle: 0.25,
    mouthDir: 1,
    speed: 0.12 // Tiles per frame
  });

  // Maze Tile Matrix
  const mazeRef = useRef<number[][]>(JSON.parse(JSON.stringify(INITIAL_MAZE)));
  const totalBitsRef = useRef<number>(0);
  const eatenBitsRef = useRef<number>(0);

  // Ghosts State
  const ghostsRef = useRef<Ghost[]>(JSON.parse(JSON.stringify(GHOST_CONFIG)));

  // Touch Swipe tracking
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Sound Synth Helpers
  const initAudio = () => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playSynthBeep = (freq: number, type: OscillatorType, duration: number, vol = 0.1) => {
    if (!soundOn) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not permitted yet
    }
  };

  const playWakaSound = () => {
    playSynthBeep(340 + Math.random() * 60, 'triangle', 0.08, 0.08);
  };

  const playEatGhostSound = () => {
    if (!soundOn) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {}
  };

  const playPowerPelletSound = () => {
    playSynthBeep(180, 'sine', 0.3, 0.18);
  };

  const playDeathSound = () => {
    if (!soundOn) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.7);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.7);
    } catch {}
  };

  const playVictoryJingle = () => {
    if (!soundOn) return;
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playSynthBeep(freq, 'triangle', 0.2, 0.15);
      }, idx * 100);
    });
  };

  // Count total bits at init
  const resetMazeAndStats = useCallback((resetEntire = true) => {
    mazeRef.current = JSON.parse(JSON.stringify(INITIAL_MAZE));
    let bits = 0;
    for (let r = 0; r < mazeRef.current.length; r++) {
      for (let c = 0; c < mazeRef.current[r].length; c++) {
        if (mazeRef.current[r][c] === 1 || mazeRef.current[r][c] === 3) {
          bits++;
        }
      }
    }
    totalBitsRef.current = bits;
    eatenBitsRef.current = 0;

    // Reset Pac-Man
    pacmanRef.current = {
      x: 10,
      y: 16,
      subX: 10,
      subY: 16,
      dir: 'NONE',
      nextDir: 'NONE',
      mouthAngle: 0.25,
      mouthDir: 1,
      speed: 0.11 + Math.min(0.05, (level - 1) * 0.015)
    };

    // Reset Ghosts
    ghostsRef.current = JSON.parse(JSON.stringify(GHOST_CONFIG));

    if (resetEntire) {
      setScore(0);
      setLives(3);
      setLevel(1);
    }
    setGameOver(false);
    setVictory(false);
    setFrightenedTime(0);
    setGhostCombo(0);
    setBonusItem(null);
    floatingTextsRef.current = [];
  }, [level]);

  // Restart / Start Game
  const handleStartGame = () => {
    initAudio();
    resetMazeAndStats(true);
    setIsPlaying(true);
    setIsPaused(false);
    forceScrollToTop();
  };

  const handleNextLevel = () => {
    initAudio();
    const nextLvl = level + 1;
    setLevel(nextLvl);
    resetMazeAndStats(false);
    setIsPlaying(true);
    setIsPaused(false);
    setVictory(false);
    playVictoryJingle();
    forceScrollToTop();
  };

  // Handle Input Changes
  const setNextDirection = useCallback((dir: Direction) => {
    initAudio();
    pacmanRef.current.nextDir = dir;
    if (pacmanRef.current.dir === 'NONE') {
      pacmanRef.current.dir = dir;
    }
  }, []);

  // Keyboard navigation & lock screen scroll while in game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault(); // Block webpage scrolling!
      }

      if (e.key === 'p' || e.key === 'P') {
        setIsPaused((prev) => !prev);
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          setNextDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          setNextDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          setNextDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          setNextDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setNextDirection]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) > 20) {
      if (absX > absY) {
        setNextDirection(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        setNextDirection(dy > 0 ? 'DOWN' : 'UP');
      }
    }
    touchStartRef.current = null;
  };

  // Check if tile is a passable space
  const isPassable = (x: number, y: number, isGhost = false): boolean => {
    const maze = mazeRef.current;
    if (y < 0 || y >= maze.length) return false;
    // Warp tunnel on side
    if ((x < 0 || x >= maze[0].length) && (y === 10)) return true;
    if (x < 0 || x >= maze[0].length) return false;

    const tile = maze[y][x];
    if (tile === 2) return false; // Wall
    if (tile === 4 && !isGhost) return false; // Ghost house door only for ghosts
    return true;
  };

  // Add floating text
  const addFloatingText = (text: string, x: number, y: number, color = '#38bdf8') => {
    floatingTextsRef.current.push({ text, x, y, alpha: 1.0, color });
  };

  // Main Game Loop Engine
  useEffect(() => {
    if (!isPlaying || isPaused || gameOver || victory) return;

    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tileSize = 20; // 21 cols x 20px = 420px width

    const gameLoop = () => {
      // 1. UPDATE FRIGHTENED STATE
      if (frightenedTime > 0) {
        setFrightenedTime((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            // Restore normal ghosts
            ghostsRef.current.forEach((g) => {
              g.isFrightened = false;
            });
            setGhostCombo(0);
          }
          return next;
        });
      }

      // 2. UPDATE BONUS ITEM
      if (bonusItem && bonusItem.active) {
        setBonusItem((prev) => {
          if (!prev) return null;
          if (prev.duration <= 1) return null;
          return { ...prev, duration: prev.duration - 1 };
        });
      }

      // 3. UPDATE PAC-MAN POSITION
      const p = pacmanRef.current;

      // Animate mouth
      p.mouthAngle += 0.03 * p.mouthDir;
      if (p.mouthAngle >= 0.4 || p.mouthAngle <= 0.02) {
        p.mouthDir *= -1;
      }

      // Try turning into nextDir if aligned with tile grid
      const isCenteredX = Math.abs(p.subX - Math.round(p.subX)) < 0.15;
      const isCenteredY = Math.abs(p.subY - Math.round(p.subY)) < 0.15;

      if (p.nextDir !== p.dir && p.nextDir !== 'NONE') {
        const checkTileX = Math.round(p.subX) + (p.nextDir === 'RIGHT' ? 1 : p.nextDir === 'LEFT' ? -1 : 0);
        const checkTileY = Math.round(p.subY) + (p.nextDir === 'DOWN' ? 1 : p.nextDir === 'UP' ? -1 : 0);

        // Instant 180° turnaround allowed anytime!
        const isOpposite =
          (p.dir === 'LEFT' && p.nextDir === 'RIGHT') ||
          (p.dir === 'RIGHT' && p.nextDir === 'LEFT') ||
          (p.dir === 'UP' && p.nextDir === 'DOWN') ||
          (p.dir === 'DOWN' && p.nextDir === 'UP');

        if (isOpposite || ((isCenteredX && isCenteredY) && isPassable(checkTileX, checkTileY))) {
          p.dir = p.nextDir;
          if (!isOpposite) {
            p.subX = Math.round(p.subX);
            p.subY = Math.round(p.subY);
          }
        }
      }

      // Move in current direction if passable
      let nextSubX = p.subX;
      let nextSubY = p.subY;
      if (p.dir === 'UP') nextSubY -= p.speed;
      if (p.dir === 'DOWN') nextSubY += p.speed;
      if (p.dir === 'LEFT') nextSubX -= p.speed;
      if (p.dir === 'RIGHT') nextSubX += p.speed;

      // Handle Warp tunnel (row 10)
      if (Math.round(p.subY) === 10) {
        if (nextSubX < -0.5) nextSubX = 20.5;
        if (nextSubX > 20.5) nextSubX = -0.5;
      }

      const targetTileX = p.dir === 'RIGHT' ? Math.ceil(nextSubX) : Math.floor(nextSubX);
      const targetTileY = p.dir === 'DOWN' ? Math.ceil(nextSubY) : Math.floor(nextSubY);

      if (isPassable(targetTileX, targetTileY)) {
        p.subX = nextSubX;
        p.subY = nextSubY;
      } else {
        // Snap to center of tile
        p.subX = Math.round(p.subX);
        p.subY = Math.round(p.subY);
        p.dir = 'NONE';
      }

      p.x = Math.round(p.subX);
      p.y = Math.round(p.subY);

      // Check eating bits/pellets
      if (p.x >= 0 && p.x < 21 && p.y >= 0 && p.y < 21) {
        const currentTile = mazeRef.current[p.y][p.x];
        if (currentTile === 1) {
          // Ate standard bit (10 pts)
          mazeRef.current[p.y][p.x] = 0;
          eatenBitsRef.current++;
          playWakaSound();
          setScore((s) => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });

          // Trigger fruit/tech artifact bonus at milestones
          if (eatenBitsRef.current === 40 || eatenBitsRef.current === 90) {
            const artifacts: BonusItem[] = [
              { type: 'floppy', labelRo: 'Dischetă 1.44MB', labelEn: '1.44MB Floppy Disk', icon: '💾', points: 150, active: true, duration: 400 },
              { type: 'cd', labelRo: 'CD-ROM 700MB', labelEn: '700MB CD-ROM', icon: '💿', points: 300, active: true, duration: 400 },
              { type: 'nvme', labelRo: 'SSD NVMe 1TB', labelEn: '1TB NVMe SSD', icon: '⚡', points: 500, active: true, duration: 350 },
              { type: 'qubit', labelRo: 'Procesor Qubit Quantum', labelEn: 'Quantum Qubit Core', icon: '🚀', points: 1000, active: true, duration: 300 }
            ];
            const chosen = artifacts[Math.min(level - 1, artifacts.length - 1)];
            setBonusItem(chosen);
            addFloatingText(lang === 'en' ? 'Bonus Tech Detected!' : 'Componentă Apărută!', 10 * tileSize, 12 * tileSize, '#f59e0b');
          }

          // Check Victory (all bits eaten)
          if (eatenBitsRef.current >= totalBitsRef.current) {
            setVictory(true);
            playVictoryJingle();
            if (onAwardXP) {
              onAwardXP(500, lang === 'en' ? 'Cyber Pac-Man Board Cleared!' : 'Placă de Bază Curățată în Cyber Pac-Man!');
            }
            return;
          }
        } else if (currentTile === 3) {
          // Ate Firewall Power-Pellet (50 pts + Frightened Ghosts!)
          mazeRef.current[p.y][p.x] = 0;
          eatenBitsRef.current++;
          playPowerPelletSound();
          setFrightenedTime(350); // ~6-7 seconds
          setGhostCombo(0);
          ghostsRef.current.forEach((g) => {
            if (!g.isEaten) g.isFrightened = true;
          });
          setScore((s) => {
            const newScore = s + 50;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          addFloatingText(lang === 'en' ? 'FIREWALL OVERCLOCK! ⚡' : 'FIREWALL ACTIVAT! ⚡', p.x * tileSize, p.y * tileSize - 10, '#38bdf8');
        }

        // Check eating bonus tech artifact (Floppy / CD / NVMe)
        if (bonusItem && bonusItem.active && p.x === 10 && p.y === 12) {
          playPowerPelletSound();
          const pts = bonusItem.points;
          setBonusItem(null);
          setScore((s) => {
            const newScore = s + pts;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          addFloatingText(`+${pts} ${bonusItem.icon}`, 10 * tileSize, 12 * tileSize, '#fbbf24');
        }
      }

      // 4. UPDATE GHOSTS
      ghostsRef.current.forEach((g) => {
        // Speed calculation
        let ghostSpeed = 0.08 + Math.min(0.04, (level - 1) * 0.01);
        if (g.isFrightened) ghostSpeed *= 0.6;
        if (g.isEaten) ghostSpeed *= 1.8; // Eyes speed back to CPU socket!

        // Move ghost smoothly
        const dx = g.targetX - g.x;
        const dy = g.targetY - g.y;
        const dist = Math.hypot(dx, dy);

        if (dist <= ghostSpeed) {
          g.x = g.targetX;
          g.y = g.targetY;

          // If eaten and reached house (x:10, y:10), revive!
          if (g.isEaten && Math.abs(g.x - 10) < 1 && Math.abs(g.y - 10) < 1) {
            g.isEaten = false;
            g.isFrightened = false;
          }

          // Choose target tile based on AI personality
          let targetGoalX = p.x;
          let targetGoalY = p.y;

          if (g.isEaten) {
            targetGoalX = 10;
            targetGoalY = 10;
          } else if (g.isFrightened) {
            // Scatter to random corner
            targetGoalX = g.homeX;
            targetGoalY = g.homeY;
          } else {
            // Individual Ghost Personalities
            if (g.id === 'blinky') {
              // Direct pursuer
              targetGoalX = p.x;
              targetGoalY = p.y;
            } else if (g.id === 'pinky') {
              // Ambush: 3 tiles ahead
              targetGoalX = p.x + (p.dir === 'RIGHT' ? 3 : p.dir === 'LEFT' ? -3 : 0);
              targetGoalY = p.y + (p.dir === 'DOWN' ? 3 : p.dir === 'UP' ? -3 : 0);
            } else if (g.id === 'inky') {
              // Flanker
              targetGoalX = p.x + (p.x - 10);
              targetGoalY = p.y + (p.y - 10);
            } else if (g.id === 'clyde') {
              // If close, retreat to corner
              const distToPacman = Math.hypot(g.x - p.x, g.y - p.y);
              if (distToPacman < 6) {
                targetGoalX = g.homeX;
                targetGoalY = g.homeY;
              } else {
                targetGoalX = p.x;
                targetGoalY = p.y;
              }
            }
          }

          // Check possible next moves (prevent 180° back turn unless forced)
          const possibleMoves: { dir: Direction; x: number; y: number; dist: number }[] = [];
          const directions: { dir: Direction; dx: number; dy: number; opposite: Direction }[] = [
            { dir: 'UP', dx: 0, dy: -1, opposite: 'DOWN' },
            { dir: 'DOWN', dx: 0, dy: 1, opposite: 'UP' },
            { dir: 'LEFT', dx: -1, dy: 0, opposite: 'RIGHT' },
            { dir: 'RIGHT', dx: 1, dy: 0, opposite: 'LEFT' }
          ];

          directions.forEach((d) => {
            if (d.dir !== d.opposite && g.dir !== d.opposite) {
              const nx = g.x + d.dx;
              const ny = g.y + d.dy;
              if (isPassable(nx, ny, true)) {
                possibleMoves.push({
                  dir: d.dir,
                  x: nx,
                  y: ny,
                  dist: Math.hypot(nx - targetGoalX, ny - targetGoalY)
                });
              }
            }
          });

          // Sort by closest distance to goal
          if (possibleMoves.length > 0) {
            possibleMoves.sort((a, b) => a.dist - b.dist);
            g.dir = possibleMoves[0].dir;
            g.targetX = possibleMoves[0].x;
            g.targetY = possibleMoves[0].y;
          } else {
            // Reverse direction if dead end
            const revDir = g.dir === 'UP' ? 'DOWN' : g.dir === 'DOWN' ? 'UP' : g.dir === 'LEFT' ? 'RIGHT' : 'LEFT';
            g.dir = revDir;
            g.targetX = g.x + (revDir === 'RIGHT' ? 1 : revDir === 'LEFT' ? -1 : 0);
            g.targetY = g.y + (revDir === 'DOWN' ? 1 : revDir === 'UP' ? -1 : 0);
          }
        } else {
          g.x += (dx / dist) * ghostSpeed;
          g.y += (dy / dist) * ghostSpeed;
        }

        // 5. COLLISION DETECTION: PAC-MAN vs GHOST
        const colDist = Math.hypot(p.subX - g.x, p.subY - g.y);
        if (colDist < 0.65) {
          if (g.isFrightened && !g.isEaten) {
            // Eat ghost!
            g.isFrightened = false;
            g.isEaten = true;
            playEatGhostSound();
            const comboPoints = Math.pow(2, ghostCombo + 1) * 100; // 200, 400, 800, 1600
            setGhostCombo((c) => Math.min(3, c + 1));
            setScore((s) => {
              const newScore = s + comboPoints;
              if (newScore > highScore) setHighScore(newScore);
              return newScore;
            });
            addFloatingText(`+${comboPoints} VIRUS DELETED!`, g.x * tileSize, g.y * tileSize, '#ec4899');
          } else if (!g.isEaten) {
            // Pac-Man caught by virus!
            playDeathSound();
            setLives((l) => {
              const newLives = l - 1;
              if (newLives <= 0) {
                setGameOver(true);
                // Save highscore
                try {
                  const finalScore = score;
                  localStorage.setItem('arkedo_highscore_cyber_pacman', String(Math.max(highScore, finalScore)));
                } catch {}
              } else {
                // Reset positions only
                p.x = 10;
                p.y = 16;
                p.subX = 10;
                p.subY = 16;
                p.dir = 'NONE';
                p.nextDir = 'NONE';
                ghostsRef.current = JSON.parse(JSON.stringify(GHOST_CONFIG));
                addFloatingText(lang === 'en' ? 'SYSTEM CRASH! REBOOTING...' : 'EROARE DE SISTEM! REBOOT...', 10 * tileSize, 14 * tileSize, '#ef4444');
              }
              return newLives;
            });
          }
        }
      });

      // 6. RENDER CANVAS
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background: Deep Cyber Dark Navy
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid / PCB Tracks
      const maze = mazeRef.current;
      for (let r = 0; r < maze.length; r++) {
        for (let c = 0; c < maze[r].length; c++) {
          const tile = maze[r][c];
          const px = c * tileSize;
          const py = r * tileSize;

          if (tile === 2) {
            // Wall: Neon Cyan circuit border with glow
            ctx.fillStyle = '#0e7490';
            ctx.strokeStyle = '#06b6d4';
            ctx.lineWidth = 1.5;
            ctx.fillRect(px, py, tileSize, tileSize);
            ctx.strokeRect(px + 1, py + 1, tileSize - 2, tileSize - 2);

            // Subtle inner tech dot
            ctx.fillStyle = '#22d3ee';
            ctx.fillRect(px + tileSize / 2 - 1, py + tileSize / 2 - 1, 2, 2);
          } else if (tile === 1) {
            // Bit: Glowing Data Bit
            ctx.fillStyle = '#fef08a';
            ctx.shadowColor = '#facc15';
            ctx.shadowBlur = 4;
            ctx.beginPath();
            ctx.arc(px + tileSize / 2, py + tileSize / 2, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          } else if (tile === 3) {
            // Firewall Power-Pellet: Pulsing large cyan/yellow orb
            const pulse = 4.5 + Math.sin(Date.now() / 150) * 1.5;
            ctx.fillStyle = '#38bdf8';
            ctx.shadowColor = '#0284c7';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(px + tileSize / 2, py + tileSize / 2, pulse, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          } else if (tile === 4) {
            // CPU Socket Ghost House
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(px, py, tileSize, tileSize);
            ctx.strokeStyle = '#334155';
            ctx.strokeRect(px, py, tileSize, tileSize);
          }
        }
      }

      // Draw Bonus Artifact if present
      if (bonusItem && bonusItem.active) {
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(bonusItem.icon, 10 * tileSize + tileSize / 2, 12 * tileSize + tileSize / 2);
      }

      // Draw Pac-Man (Yellow animated wedge with tech visor)
      const pacX = p.subX * tileSize + tileSize / 2;
      const pacY = p.subY * tileSize + tileSize / 2;

      let rotation = 0;
      if (p.dir === 'RIGHT' || p.dir === 'NONE') rotation = 0;
      if (p.dir === 'DOWN') rotation = Math.PI * 0.5;
      if (p.dir === 'LEFT') rotation = Math.PI;
      if (p.dir === 'UP') rotation = Math.PI * 1.5;

      ctx.save();
      ctx.translate(pacX, pacY);
      ctx.rotate(rotation);

      // Yellow Pac-Man Body
      ctx.fillStyle = '#facc15';
      ctx.shadowColor = '#eab308';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(0, 0, tileSize * 0.45, p.mouthAngle, Math.PI * 2 - p.mouthAngle);
      ctx.lineTo(0, 0);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Tech Eye
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(tileSize * 0.1, -tileSize * 0.25, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Draw Ghosts
      ghostsRef.current.forEach((g) => {
        const gx = g.x * tileSize + tileSize / 2;
        const gy = g.y * tileSize + tileSize / 2;
        const gr = tileSize * 0.45;

        ctx.save();
        ctx.translate(gx, gy);

        if (g.isEaten) {
          // Just eyes returning to base
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(-gr * 0.35, -gr * 0.1, 3.5, 0, Math.PI * 2);
          ctx.arc(gr * 0.35, -gr * 0.1, 3.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#0284c7';
          ctx.beginPath();
          ctx.arc(-gr * 0.35, -gr * 0.1, 1.8, 0, Math.PI * 2);
          ctx.arc(gr * 0.35, -gr * 0.1, 1.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Ghost Dome Body
          let ghostColor = g.color;
          if (g.isFrightened) {
            // Flash white in the last 2 seconds
            ghostColor = frightenedTime < 100 && Math.floor(frightenedTime / 15) % 2 === 0 ? '#f8fafc' : '#2563eb';
          }

          ctx.fillStyle = ghostColor;
          ctx.shadowColor = ghostColor;
          ctx.shadowBlur = 5;

          ctx.beginPath();
          ctx.arc(0, -gr * 0.2, gr, Math.PI, 0, false);
          ctx.lineTo(gr, gr);
          // Skirt tentacles
          ctx.lineTo(gr * 0.5, gr * 0.6);
          ctx.lineTo(0, gr);
          ctx.lineTo(-gr * 0.5, gr * 0.6);
          ctx.lineTo(-gr, gr);
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;

          // Ghost Eyes
          ctx.fillStyle = g.isFrightened ? '#fef08a' : '#ffffff';
          ctx.beginPath();
          ctx.arc(-gr * 0.35, -gr * 0.2, 3.5, 0, Math.PI * 2);
          ctx.arc(gr * 0.35, -gr * 0.2, 3.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = g.isFrightened ? '#ea580c' : '#0f172a';
          ctx.beginPath();
          ctx.arc(-gr * 0.35, -gr * 0.2, 1.8, 0, Math.PI * 2);
          ctx.arc(gr * 0.35, -gr * 0.2, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      // 7. RENDER FLOATING ANNOUNCEMENTS
      for (let i = floatingTextsRef.current.length - 1; i >= 0; i--) {
        const item = floatingTextsRef.current[i];
        ctx.save();
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = item.color;
        ctx.globalAlpha = item.alpha;
        ctx.fillText(item.text, item.x, item.y);
        ctx.restore();

        item.y -= 0.6;
        item.alpha -= 0.02;
        if (item.alpha <= 0) {
          floatingTextsRef.current.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isPaused, gameOver, victory, frightenedTime, ghostCombo, bonusItem, level, soundOn, highScore, score, lang, onAwardXP]);

  return (
    <div className="flex flex-col gap-5 max-w-4xl mx-auto pb-12 select-none">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900/95 border-2 border-amber-500/40 rounded-3xl shadow-xl backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              forceScrollToTop();
              onBack();
            }}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center gap-1.5 cursor-pointer touch-manipulation active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold">{lang === 'en' ? 'Back' : 'Înapoi la Jocuri'}</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-xl shadow-inner">
              🟡
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white font-heading leading-tight flex items-center gap-1.5">
                <span>Cyber Pac-Man</span>
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-black border border-amber-500/30">
                  {lang === 'en' ? 'NEON PCB' : 'RETRO 1980'}
                </span>
              </h2>
              <div className="text-[10px] sm:text-[11px] font-mono text-slate-400">
                {lang === 'en' ? 'Motherboard Maze & Algorithmic Defense' : 'Labirintul Plăcii de Bază & Securitate'}
              </div>
            </div>
          </div>
        </div>

        {/* HUD: Score, HighScore, Lives, Audio */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Current Score */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-1.5 shadow-inner">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{lang === 'en' ? 'Score' : 'Scor'}:</span>
            <span className="text-sm font-black text-amber-300 font-mono">{score.toLocaleString()}</span>
          </div>

          {/* Personal Best Record */}
          <div className="px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center gap-1.5 shadow-inner">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-mono text-amber-300 font-bold">{highScore.toLocaleString()}</span>
          </div>

          {/* Lives Counter (Pac-Man icons) */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            {Array.from({ length: Math.max(0, lives) }).map((_, i) => (
              <span key={i} className="text-sm animate-pulse">🟡</span>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundOn((s) => !s)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer touch-manipulation active:scale-95"
            title={soundOn ? 'Sunet Activat' : 'Sunet Oprit'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          </button>
        </div>
      </div>

      {/* Main Canvas & Game Container */}
      <div className="relative bg-slate-950 border-2 border-slate-800 rounded-3xl p-3 sm:p-5 flex flex-col items-center justify-center shadow-2xl overflow-hidden">
        {/* Ambient Neon PCB Background Glow */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Level & Overclock Status Banner */}
        <div className="w-full flex items-center justify-between text-xs font-mono mb-2 px-2 text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold">{lang === 'en' ? 'STAGE' : 'NIVEL'}: {level}</span>
            <span>•</span>
            <span className="text-cyan-300">
              {lang === 'en' ? 'BITS REMAINING' : 'BIȚI RĂMAȘI'}: {Math.max(0, totalBitsRef.current - eatenBitsRef.current)}
            </span>
          </div>

          {frightenedTime > 0 && (
            <div className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-bold text-[11px] animate-pulse flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-300" />
              <span>{lang === 'en' ? 'FIREWALL OVERCLOCK' : 'CARANTINĂ VIRUȘI'} ({Math.ceil(frightenedTime / 60)}s)</span>
            </div>
          )}
        </div>

        {/* Canvas Display */}
        <div
          className="relative rounded-2xl overflow-hidden border border-cyan-500/40 shadow-2xl shadow-cyan-950/50 bg-[#030712] touch-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <canvas
            ref={canvasRef}
            width={420}
            height={420}
            className="w-full max-w-[360px] sm:max-w-[420px] aspect-square block cursor-pointer"
          />

          {/* Overlay: Game Start / Menu */}
          {!isPlaying && !gameOver && !victory && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30 mb-3 animate-bounce">
                🟡
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
                Cyber Pac-Man 1980
              </h3>
              <p className="text-xs text-slate-300 max-w-xs mt-1 mb-4 leading-relaxed">
                {lang === 'en'
                  ? 'Devour all data bits on the neon motherboard, collect Firewall Power-Pellets, and quarantine invading malware!'
                  : 'Mănâncă toți biții de date de pe placa de bază, activează pastilele de Firewall și pune virușii în carantină!'}
              </p>

              {/* Ghost Threat Legend */}
              <div className="grid grid-cols-2 gap-2 w-full max-w-xs text-left mb-4">
                {GHOST_CONFIG.map((g) => (
                  <div key={g.id} className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: g.color }} />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-white truncate">{lang === 'en' ? g.nameEn : g.nameRo}</div>
                      <div className="text-[9px] text-slate-400 font-mono truncate">{lang === 'en' ? g.threatEn : g.threatRo}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleStartGame}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm transition shadow-lg shadow-amber-500/30 flex items-center gap-2 cursor-pointer touch-manipulation active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{lang === 'en' ? 'Start Cyber Mission' : 'Pornește Misiunea Arcade'}</span>
              </button>
            </div>
          )}

          {/* Overlay: Game Over Screen */}
          {gameOver && (
            <div className="absolute inset-0 bg-rose-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border-2 border-rose-500/40 flex items-center justify-center text-3xl shadow-xl shadow-rose-950/60 mb-2">
                💀
              </div>

              <h3 className="text-2xl font-black text-white font-heading">
                {lang === 'en' ? 'SYSTEM COMPROMISED!' : 'SISTEM INFECTAT!'}
              </h3>
              <p className="text-xs text-rose-200 mt-1 mb-3">
                {lang === 'en' ? 'Trojan viruses caught your data packet!' : 'Virușii au capturat pachetul de date!'}
              </p>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 w-full max-w-xs mb-4">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">{lang === 'en' ? 'Final Score' : 'Scor Obținut'}</div>
                <div className="text-2xl font-black text-amber-300 font-mono">{score.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                  ⭐ +{Math.min(500, Math.round(score / 5))} XP & 🪙 +{Math.min(50, Math.round(score / 40))} ByteCoins
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartGame}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/30 flex items-center gap-1.5 cursor-pointer touch-manipulation active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Play Again' : 'Reîncearcă'}</span>
                </button>
                <button
                  onClick={onBack}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition border border-slate-700 cursor-pointer"
                >
                  {lang === 'en' ? 'Exit Hub' : 'Ieșire'}
                </button>
              </div>
            </div>
          )}

          {/* Overlay: Victory Screen (Level Complete) */}
          {victory && (
            <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/50 flex items-center justify-center text-3xl shadow-xl shadow-emerald-950/60 mb-2 animate-bounce">
                🏆
              </div>

              <h3 className="text-2xl font-black text-white font-heading">
                {lang === 'en' ? 'STAGE CLEARED!' : 'CIRCUIT CURĂȚAT!'}
              </h3>
              <p className="text-xs text-emerald-200 mt-1 mb-3">
                {lang === 'en' ? 'All data bits harvested successfully!' : 'Toți biții de date au fost colectați cu succes!'}
              </p>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 w-full max-w-xs mb-4">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">{lang === 'en' ? 'Current Score' : 'Punctaj Nivel'}</div>
                <div className="text-2xl font-black text-amber-300 font-mono">{score.toLocaleString()}</div>
                <div className="text-[10px] text-cyan-300 font-mono mt-0.5">
                  🚀 +250 Overclock Bonus!
                </div>
              </div>

              <button
                onClick={handleNextLevel}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer touch-manipulation active:scale-95"
              >
                <span>{lang === 'en' ? `Next Stage (Level ${level + 1}) ⚡` : `Următorul Nivel (Nivel ${level + 1}) ⚡`}</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Tactile Virtual D-Pad Controls */}
        <div className="sm:hidden mt-4 w-full flex flex-col items-center gap-1">
          <button
            onClick={() => setNextDirection('UP')}
            className="w-14 h-12 rounded-xl bg-slate-800 active:bg-amber-500 active:text-slate-950 border border-slate-700 text-white flex items-center justify-center shadow-lg touch-manipulation active:scale-90"
            aria-label="Sus"
          >
            <ChevronUp className="w-7 h-7" />
          </button>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setNextDirection('LEFT')}
              className="w-14 h-12 rounded-xl bg-slate-800 active:bg-amber-500 active:text-slate-950 border border-slate-700 text-white flex items-center justify-center shadow-lg touch-manipulation active:scale-90"
              aria-label="Stânga"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <button
              onClick={() => setNextDirection('DOWN')}
              className="w-14 h-12 rounded-xl bg-slate-800 active:bg-amber-500 active:text-slate-950 border border-slate-700 text-white flex items-center justify-center shadow-lg touch-manipulation active:scale-90"
              aria-label="Jos"
            >
              <ChevronDown className="w-7 h-7" />
            </button>
            <button
              onClick={() => setNextDirection('RIGHT')}
              className="w-14 h-12 rounded-xl bg-slate-800 active:bg-amber-500 active:text-slate-950 border border-slate-700 text-white flex items-center justify-center shadow-lg touch-manipulation active:scale-90"
              aria-label="Dreapta"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </div>
        </div>

        {/* Bottom Instruction & Controls Hint */}
        <div className="mt-4 flex items-center justify-between w-full max-w-md text-slate-400 text-[11px] font-mono px-2">
          <div className="flex items-center gap-1.5">
            <span className="hidden sm:inline">⌨️ {lang === 'en' ? 'Arrows or WASD to Move' : 'Taste Săgeți sau WASD'}</span>
            <span className="sm:hidden">📱 {lang === 'en' ? 'D-Pad or Swipe on Canvas' : 'Folosește butoanele sau Swipe'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHowToPlay((v) => !v)}
              className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
            >
              {lang === 'en' ? 'How to Play' : 'Cum se Joacă'}
            </button>
          </div>
        </div>
      </div>

      {/* Pedagogical Tech Guide / How to Play Drawer */}
      {showHowToPlay && (
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-cyan-500/30 text-xs text-slate-300 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{lang === 'en' ? 'Cyber Pac-Man: Mission Architecture' : 'Ghid Didactic: Arhitectura Cyber Pac-Man'}</span>
            </h4>
            <button
              onClick={() => setShowHowToPlay(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕ {lang === 'en' ? 'Close' : 'Închide'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-amber-300 font-bold flex items-center gap-1">
                <span>🟡 Biți & Pachete</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {lang === 'en'
                  ? 'Each golden dot represents 1 byte of information (+10 pts). Clear the circuit to advance.'
                  : 'Fiecare punct auriu reprezintă 1 byte de date (+10 pct). Curăță întreg circuitul pentru victorie.'}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-cyan-300 font-bold flex items-center gap-1">
                <span>⚡ Firewall Overclock</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {lang === 'en'
                  ? 'Power-Pellets trigger system quarantine: ghosts turn blue (+200, +400, +800, +1600 pts when deleted).'
                  : 'Pastilele mari activează carantina: virușii devin albaștri și pot fi curățați (+200, +400, +800, +1600 pct).'}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-rose-300 font-bold flex items-center gap-1">
                <span>👾 Tipuri de Viruși</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {lang === 'en'
                  ? 'Trojan attacks directly, Worm ambushes ahead, Spyware flanks, and Ransomware patrols.'
                  : 'Troianul atacă direct, Viermele pândește înainte, Spionul flanchează, iar Ransomware patrulează.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
