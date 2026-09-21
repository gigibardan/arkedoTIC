import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  RotateCcw,
  Trophy,
  Zap,
  Flame,
  ArrowLeft,
  Volume2,
  VolumeX,
  Sparkles,
  Shield,
  Crosshair,
  WifiOff,
  Wifi,
  Keyboard,
  Info,
  Award,
  Crown,
  Pause,
  PlayCircle,
  Eye,
  Sliders,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { updateActiveArcadeScore } from '../../lib/studentAuthService';

interface CyberDinoRunnerProps {
  studentName?: string;
  onBack: () => void;
  onAwardXP?: (amount: number, reason: string) => void;
  onSaveScore?: (score: number) => void;
}

// Biomes
type BiomeType = 'motherboard' | 'fiber_optic' | 'matrix_storm' | 'server_vault';

// Skin Types
type DinoSkin = 'classic' | 'mecha' | 'hacker' | 'neon';

// Game Mode
type GameMode = 'endless' | 'campaign' | 'hardcore';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'cactus_small' | 'cactus_large' | 'capacitor' | 'usb_cluster' | 'drone_low' | 'drone_mid' | 'drone_high' | 'malware_worm' | 'laser_beam';
  speedMultiplier: number;
  frame: number;
  isHit?: boolean;
}

interface CollectibleItem {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'bit_zero' | 'bit_one' | 'gold_byte' | 'shield' | 'ammo' | 'overclock' | 'magnet';
  collected?: boolean;
  value: number;
}

interface Projectile {
  x: number;
  y: number;
  vx: number;
  size: number;
  color: string;
  active: boolean;
}

export const CyberDinoRunner: React.FC<CyberDinoRunnerProps> = ({
  studentName: propStudentName,
  onBack,
  onAwardXP,
  onSaveScore
}) => {
  const { lang } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Student details
  const studentName = propStudentName || (() => {
    try {
      return localStorage.getItem('arkedo_student_name') || (lang === 'en' ? 'Cadet Player' : 'Elev TIC');
    } catch {
      return lang === 'en' ? 'Cadet Player' : 'Elev TIC';
    }
  })();

  // State Management
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameover' | 'victory'>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('endless');
  const [selectedSkin, setSelectedSkin] = useState<DinoSkin>('classic');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_cyber_dino') || '0');
    } catch {
      return 0;
    }
  });

  const [bitsCollected, setBitsCollected] = useState(0);
  const [ammo, setAmmo] = useState(3);
  const [hasShield, setHasShield] = useState(false);
  const [isOverclocked, setIsOverclocked] = useState(false);
  const [magnetActive, setMagnetActive] = useState(false);
  const [currentBiome, setCurrentBiome] = useState<BiomeType>('motherboard');
  const [soundMuted, setSoundMuted] = useState(false);
  const [campaignLevel, setCampaignLevel] = useState(1);
  const [bossWarning, setBossWarning] = useState(false);
  const [bossHealth, setBossHealth] = useState(100);
  const [bossActive, setBossActive] = useState(false);

  // Stats for game over screen
  const [gameStats, setGameStats] = useState({
    distance: 0,
    bitsCount: 0,
    obstaclesDestroyed: 0,
    jumpsCount: 0,
    xpEarned: 0,
  });

  // Game Core Mutable References (for 60fps canvas loop)
  const engineRef = useRef({
    running: false,
    score: 0,
    distance: 0,
    speed: 6.5,
    baseSpeed: 6.5,
    groundY: 260,
    
    // Dino physics
    dino: {
      x: 70,
      y: 200,
      width: 44,
      height: 48,
      vy: 0,
      gravity: 0.68,
      jumpForce: -13.5,
      isGrounded: true,
      isDucking: false,
      isShooting: false,
      runFrame: 0,
      jumpCount: 0,
    },

    // Obstacles & Spawning
    obstacles: [] as Obstacle[],
    nextObstacleTimer: 60,
    obstacleIdCounter: 1,

    // Collectibles
    collectibles: [] as CollectibleItem[],
    nextCollectibleTimer: 45,
    collectibleIdCounter: 1,

    // Projectiles
    projectiles: [] as Projectile[],

    // Particles
    particles: [] as Particle[],

    // Powerups Timers
    shield: false,
    overclockTimer: 0,
    magnetTimer: 0,
    ammoCount: 3,
    bitsEarned: 0,
    destroyedCount: 0,

    // Biome & Background Scrolling
    biome: 'motherboard' as BiomeType,
    bgOffset1: 0,
    bgOffset2: 0,
    groundOffset: 0,

    // Boss State
    boss: {
      active: false,
      x: 900,
      y: 80,
      targetY: 80,
      width: 110,
      height: 90,
      health: 100,
      maxHealth: 100,
      shootTimer: 90,
      frame: 0
    },

    // Keyboard state tracker
    keys: {
      up: false,
      down: false,
      shoot: false
    }
  });

  // Simple Synthesized Web Audio Sound Effects for retro feel
  const playRetroSound = useCallback((type: 'jump' | 'duck' | 'coin' | 'powerup' | 'shoot' | 'hit' | 'gameover' | 'boss_alert') => {
    if (soundMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'jump') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.12);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'duck') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'coin') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.06); // A5
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'powerup') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'shoot') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.1);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.18);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'gameover') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.5);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === 'boss_alert') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(330, now + 0.1);
        osc.frequency.setValueAtTime(440, now + 0.2);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch {
      // Audio context might be restricted before interaction
    }
  }, [soundMuted]);

  // Spawn Particles Function
  const spawnParticles = (x: number, y: number, color: string, count = 8, speed = 3) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = (Math.random() * 0.8 + 0.2) * speed;
      engineRef.current.particles.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        size: Math.random() * 3 + 2,
        color,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 20 + 15
      });
    }
  };

  // Jump Trigger
  const triggerJump = useCallback(() => {
    const eng = engineRef.current;
    if (eng.dino.isGrounded) {
      eng.dino.vy = eng.dino.jumpForce;
      eng.dino.isGrounded = false;
      eng.dino.jumpCount++;
      playRetroSound('jump');
      spawnParticles(eng.dino.x + 10, eng.dino.y + eng.dino.height, '#38bdf8', 6, 2);
    }
  }, [playRetroSound]);

  // Duck Trigger
  const setDuckState = useCallback((ducking: boolean) => {
    const eng = engineRef.current;
    if (ducking && !eng.dino.isDucking) {
      playRetroSound('duck');
    }
    eng.dino.isDucking = ducking;
    if (ducking) {
      eng.dino.height = 28;
      // Fast fall if mid-air
      if (!eng.dino.isGrounded) {
        eng.dino.vy += 4;
      }
    } else {
      eng.dino.height = 48;
    }
  }, [playRetroSound]);

  // Shoot Trigger
  const triggerShoot = useCallback(() => {
    const eng = engineRef.current;
    if (eng.ammoCount <= 0) return;

    eng.ammoCount--;
    setAmmo(eng.ammoCount);
    eng.dino.isShooting = true;
    setTimeout(() => {
      eng.dino.isShooting = false;
    }, 120);

    playRetroSound('shoot');

    // Spawn laser projectile
    const projY = eng.dino.isDucking ? eng.dino.y + 12 : eng.dino.y + 20;
    eng.projectiles.push({
      x: eng.dino.x + eng.dino.width + 5,
      y: projY,
      vx: 16,
      size: 10,
      color: '#38bdf8',
      active: true
    });

    spawnParticles(eng.dino.x + eng.dino.width, projY, '#38bdf8', 4, 3);
  }, [playRetroSound]);

  // Start / Reset Game
  const startNewGame = useCallback((mode: GameMode = 'endless', level = 1) => {
    const eng = engineRef.current;
    const isHardcore = mode === 'hardcore';
    const initSpeed = isHardcore ? 9.5 : 6.5;

    eng.running = true;
    eng.score = 0;
    eng.distance = 0;
    eng.speed = initSpeed;
    eng.baseSpeed = initSpeed;
    eng.groundY = 260;

    eng.dino.x = 70;
    eng.dino.y = 200;
    eng.dino.width = 44;
    eng.dino.height = 48;
    eng.dino.vy = 0;
    eng.dino.isGrounded = true;
    eng.dino.isDucking = false;
    eng.dino.isShooting = false;
    eng.dino.runFrame = 0;
    eng.dino.jumpCount = 0;

    eng.obstacles = [];
    eng.collectibles = [];
    eng.projectiles = [];
    eng.particles = [];

    eng.shield = false;
    eng.overclockTimer = 0;
    eng.magnetTimer = 0;
    eng.ammoCount = isHardcore ? 5 : 3;
    eng.bitsEarned = 0;
    eng.destroyedCount = 0;
    eng.biome = 'motherboard';
    eng.nextObstacleTimer = 50;
    eng.nextCollectibleTimer = 30;

    eng.boss = {
      active: false,
      x: 900,
      y: 80,
      targetY: 80,
      width: 110,
      height: 90,
      health: 100,
      maxHealth: 100,
      shootTimer: 80,
      frame: 0
    };

    setScore(0);
    setBitsCollected(0);
    setAmmo(eng.ammoCount);
    setHasShield(false);
    setIsOverclocked(false);
    setMagnetActive(false);
    setCurrentBiome('motherboard');
    setGameMode(mode);
    setCampaignLevel(level);
    setBossWarning(false);
    setBossActive(false);
    setGameState('playing');

    sounds.playClick();
  }, []);

  // Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'menu' || gameState === 'gameover' || gameState === 'victory') {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          startNewGame(gameMode, campaignLevel);
        }
        return;
      }

      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        triggerJump();
      } else if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setDuckState(true);
      } else if (e.code === 'KeyF' || e.code === 'KeyE' || e.code === 'KeyX') {
        e.preventDefault();
        triggerShoot();
      } else if (e.code === 'KeyP' || e.code === 'Escape') {
        e.preventDefault();
        setGameState((prev) => (prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setDuckState(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, triggerJump, setDuckState, triggerShoot, startNewGame, gameMode, campaignLevel]);

  // Main 60 FPS Game Loop
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 800;
    const height = 320;
    canvas.width = width;
    canvas.height = height;

    const render = () => {
      const eng = engineRef.current;

      if (gameState === 'playing') {
        // --- 1. UPDATE PHYSICS & POSITIONS ---
        eng.distance += 1;
        const currentScore = Math.floor(eng.distance / 4) + eng.bitsEarned * 10;
        eng.score = currentScore;
        setScore(currentScore);

        // Gradually increase speed
        if (eng.speed < 15.5) {
          eng.speed = eng.baseSpeed + Math.min(8, eng.distance / 1200);
        }

        // Active Speed with Overclock
        const effectiveSpeed = eng.overclockTimer > 0 ? eng.speed * 1.45 : eng.speed;

        // Biome Transition milestones
        if (eng.distance > 3600) {
          eng.biome = 'server_vault';
        } else if (eng.distance > 2400) {
          eng.biome = 'matrix_storm';
        } else if (eng.distance > 1200) {
          eng.biome = 'fiber_optic';
        } else {
          eng.biome = 'motherboard';
        }
        if (eng.biome !== currentBiome) {
          setCurrentBiome(eng.biome);
        }

        // Check Boss Encounter Trigger in Campaign Mode or every 2000m
        if (gameMode === 'campaign' && eng.distance > 800 && !eng.boss.active && campaignLevel === 3) {
          eng.boss.active = true;
          setBossActive(true);
          setBossWarning(true);
          playRetroSound('boss_alert');
          setTimeout(() => setBossWarning(false), 2500);
        }

        // Overclock timer countdown
        if (eng.overclockTimer > 0) {
          eng.overclockTimer--;
          if (eng.overclockTimer === 0) {
            setIsOverclocked(false);
          }
        }

        // Magnet timer countdown
        if (eng.magnetTimer > 0) {
          eng.magnetTimer--;
          if (eng.magnetTimer === 0) {
            setMagnetActive(false);
          }
        }

        // Dino Physics
        const d = eng.dino;
        d.vy += d.gravity;
        d.y += d.vy;

        const groundLevel = eng.groundY - d.height;
        if (d.y >= groundLevel) {
          d.y = groundLevel;
          d.vy = 0;
          d.isGrounded = true;
        }

        d.runFrame += 0.25;

        // Background scrolling offsets
        eng.bgOffset1 = (eng.bgOffset1 + effectiveSpeed * 0.2) % width;
        eng.bgOffset2 = (eng.bgOffset2 + effectiveSpeed * 0.5) % width;
        eng.groundOffset = (eng.groundOffset + effectiveSpeed) % 40;

        // --- 2. SPAWN OBSTACLES ---
        eng.nextObstacleTimer--;
        if (eng.nextObstacleTimer <= 0 && (!eng.boss.active || Math.random() < 0.4)) {
          eng.obstacleIdCounter++;
          const rand = Math.random();
          let obsType: Obstacle['type'] = 'cactus_small';
          let obsWidth = 24;
          let obsHeight = 44;
          let obsY = eng.groundY - obsHeight;

          if (rand < 0.28) {
            obsType = 'cactus_small';
            obsWidth = 26;
            obsHeight = 44;
            obsY = eng.groundY - obsHeight;
          } else if (rand < 0.5) {
            obsType = 'cactus_large';
            obsWidth = 38;
            obsHeight = 52;
            obsY = eng.groundY - obsHeight;
          } else if (rand < 0.72) {
            // Pterodactyl Wi-Fi Drone at 3 altitudes
            const droneAltitude = Math.random();
            if (droneAltitude < 0.35) {
              obsType = 'drone_low'; // Jump over
              obsWidth = 40;
              obsHeight = 30;
              obsY = eng.groundY - 45;
            } else if (droneAltitude < 0.7) {
              obsType = 'drone_mid'; // Must Duck!
              obsWidth = 40;
              obsHeight = 30;
              obsY = eng.groundY - 75;
            } else {
              obsType = 'drone_high'; // Walk under
              obsWidth = 40;
              obsHeight = 30;
              obsY = eng.groundY - 105;
            }
          } else if (rand < 0.88) {
            obsType = 'capacitor';
            obsWidth = 32;
            obsHeight = 40;
            obsY = eng.groundY - obsHeight;
          } else {
            obsType = 'malware_worm';
            obsWidth = 36;
            obsHeight = 24;
            obsY = eng.groundY - obsHeight;
          }

          eng.obstacles.push({
            id: eng.obstacleIdCounter,
            x: width + 20,
            y: obsY,
            width: obsWidth,
            height: obsHeight,
            type: obsType,
            speedMultiplier: 1,
            frame: 0
          });

          // Randomize next obstacle interval based on speed
          const minGap = Math.max(35, 75 - Math.floor(effectiveSpeed * 2.5));
          const maxGap = minGap + 45;
          eng.nextObstacleTimer = Math.floor(Math.random() * (maxGap - minGap)) + minGap;
        }

        // --- 3. SPAWN COLLECTIBLES ---
        eng.nextCollectibleTimer--;
        if (eng.nextCollectibleTimer <= 0) {
          eng.collectibleIdCounter++;
          const r = Math.random();
          let cType: CollectibleItem['type'] = 'bit_one';
          let cVal = 1;
          const arcY = eng.groundY - (Math.random() * 80 + 35);

          if (r < 0.4) {
            cType = 'bit_one';
            cVal = 1;
          } else if (r < 0.7) {
            cType = 'bit_zero';
            cVal = 1;
          } else if (r < 0.82) {
            cType = 'gold_byte';
            cVal = 5;
          } else if (r < 0.88) {
            cType = 'ammo';
            cVal = 0;
          } else if (r < 0.94) {
            cType = 'shield';
            cVal = 0;
          } else if (r < 0.98) {
            cType = 'overclock';
            cVal = 0;
          } else {
            cType = 'magnet';
            cVal = 0;
          }

          eng.collectibles.push({
            id: eng.collectibleIdCounter,
            x: width + 30,
            y: arcY,
            width: 20,
            height: 20,
            type: cType,
            value: cVal
          });

          eng.nextCollectibleTimer = Math.floor(Math.random() * 40) + 30;
        }

        // --- 4. UPDATE OBSTACLES & CHECK HITBOX COLLISION ---
        for (let i = eng.obstacles.length - 1; i >= 0; i--) {
          const obs = eng.obstacles[i];
          obs.x -= effectiveSpeed * obs.speedMultiplier;
          obs.frame += 0.2;

          // Check Dino Collision
          if (!obs.isHit) {
            const dinoBox = {
              x: d.x + 8,
              y: d.y + 4,
              w: d.width - 16,
              h: d.height - 8
            };

            const obsBox = {
              x: obs.x + 4,
              y: obs.y + 4,
              w: obs.width - 8,
              h: obs.height - 8
            };

            const isColliding =
              dinoBox.x < obsBox.x + obsBox.w &&
              dinoBox.x + dinoBox.w > obsBox.x &&
              dinoBox.y < obsBox.y + obsBox.h &&
              dinoBox.y + dinoBox.h > obsBox.y;

            if (isColliding) {
              if (eng.overclockTimer > 0) {
                // Overclock smashes through!
                obs.isHit = true;
                eng.destroyedCount++;
                playRetroSound('hit');
                spawnParticles(obs.x + obs.width / 2, obs.y + obs.height / 2, '#fbbf24', 12, 4);
              } else if (eng.shield) {
                // Shield absorbs hit
                eng.shield = false;
                setHasShield(false);
                obs.isHit = true;
                playRetroSound('hit');
                spawnParticles(d.x + d.width / 2, d.y + d.height / 2, '#38bdf8', 16, 5);
              } else {
                // GAME OVER!
                playRetroSound('gameover');
                spawnParticles(d.x + d.width / 2, d.y + d.height / 2, '#f43f5e', 24, 6);
                eng.running = false;
                setGameState('gameover');

                // Compute high score & awards
                const finalScore = eng.score;
                if (finalScore > highScore) {
                  setHighScore(finalScore);
                  try {
                    localStorage.setItem('arkedo_highscore_cyber_dino', String(finalScore));
                    updateActiveArcadeScore('cyber_dino', finalScore);
                  } catch {
                    // Ignore storage limit
                  }
                } else {
                  try {
                    updateActiveArcadeScore('cyber_dino', finalScore);
                  } catch {}
                }

                const xpGained = Math.floor(finalScore / 2) + eng.bitsEarned * 5;
                setGameStats({
                  distance: Math.floor(eng.distance / 4),
                  bitsCount: eng.bitsEarned,
                  obstaclesDestroyed: eng.destroyedCount,
                  jumpsCount: d.jumpCount,
                  xpEarned: xpGained
                });

                if (onSaveScore) onSaveScore(finalScore);
                if (onAwardXP && xpGained > 0) {
                  onAwardXP(xpGained, 'Cyber Dino Run: Record de Date!');
                }
                break;
              }
            }
          }

          // Remove off-screen obstacles
          if (obs.x + obs.width < -50) {
            eng.obstacles.splice(i, 1);
          }
        }

        // --- 5. UPDATE COLLECTIBLES & MAGNET ---
        for (let i = eng.collectibles.length - 1; i >= 0; i--) {
          const item = eng.collectibles[i];
          item.x -= effectiveSpeed;

          // Magnet Attraction
          if (eng.magnetTimer > 0) {
            const dx = d.x + d.width / 2 - (item.x + item.width / 2);
            const dy = d.y + d.height / 2 - (item.y + item.height / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 220) {
              item.x += (dx / dist) * 7;
              item.y += (dy / dist) * 7;
            }
          }

          // Check Dino Pick up
          const dinoBox = { x: d.x, y: d.y, w: d.width, h: d.height };
          const itemBox = { x: item.x, y: item.y, w: item.width, h: item.height };

          const isCollected =
            dinoBox.x < itemBox.x + itemBox.w &&
            dinoBox.x + dinoBox.w > itemBox.x &&
            dinoBox.y < itemBox.y + itemBox.h &&
            dinoBox.y + dinoBox.h > itemBox.y;

          if (isCollected && !item.collected) {
            item.collected = true;

            if (item.type === 'bit_zero' || item.type === 'bit_one') {
              eng.bitsEarned += 1;
              setBitsCollected(eng.bitsEarned);
              playRetroSound('coin');
              spawnParticles(item.x, item.y, '#22c55e', 6, 2);
            } else if (item.type === 'gold_byte') {
              eng.bitsEarned += 5;
              setBitsCollected(eng.bitsEarned);
              playRetroSound('coin');
              spawnParticles(item.x, item.y, '#fbbf24', 10, 3);
            } else if (item.type === 'shield') {
              eng.shield = true;
              setHasShield(true);
              playRetroSound('powerup');
              spawnParticles(d.x + d.width / 2, d.y + d.height / 2, '#38bdf8', 14, 4);
            } else if (item.type === 'ammo') {
              eng.ammoCount = Math.min(10, eng.ammoCount + 4);
              setAmmo(eng.ammoCount);
              playRetroSound('powerup');
              spawnParticles(d.x + d.width / 2, d.y + d.height / 2, '#ec4899', 10, 3);
            } else if (item.type === 'overclock') {
              eng.overclockTimer = 300; // ~5 seconds at 60fps
              setIsOverclocked(true);
              playRetroSound('powerup');
              spawnParticles(d.x + d.width / 2, d.y + d.height / 2, '#f59e0b', 20, 5);
            } else if (item.type === 'magnet') {
              eng.magnetTimer = 360; // ~6 seconds
              setMagnetActive(true);
              playRetroSound('powerup');
              spawnParticles(d.x + d.width / 2, d.y + d.height / 2, '#a855f7', 14, 4);
            }

            eng.collectibles.splice(i, 1);
          } else if (item.x + item.width < -30) {
            eng.collectibles.splice(i, 1);
          }
        }

        // --- 6. UPDATE PROJECTILES & OBSTACLE DESTRUCTION ---
        for (let pIdx = eng.projectiles.length - 1; pIdx >= 0; pIdx--) {
          const proj = eng.projectiles[pIdx];
          proj.x += proj.vx;

          // Check collision with obstacles
          for (let oIdx = eng.obstacles.length - 1; oIdx >= 0; oIdx--) {
            const obs = eng.obstacles[oIdx];
            if (!obs.isHit) {
              if (
                proj.x > obs.x &&
                proj.x < obs.x + obs.width &&
                proj.y > obs.y &&
                proj.y < obs.y + obs.height
              ) {
                obs.isHit = true;
                proj.active = false;
                eng.destroyedCount++;
                playRetroSound('hit');
                spawnParticles(obs.x + obs.width / 2, obs.y + obs.height / 2, '#f43f5e', 14, 4);
                eng.obstacles.splice(oIdx, 1);
                break;
              }
            }
          }

          // Check collision with Boss
          if (eng.boss.active && proj.active) {
            const b = eng.boss;
            if (proj.x > b.x && proj.x < b.x + b.width && proj.y > b.y && proj.y < b.y + b.height) {
              proj.active = false;
              b.health -= 12;
              setBossHealth(b.health);
              playRetroSound('hit');
              spawnParticles(proj.x, proj.y, '#f59e0b', 8, 3);

              if (b.health <= 0) {
                // Boss Defeated!
                b.active = false;
                setBossActive(false);
                sounds.playVictory();
                spawnParticles(b.x + b.width / 2, b.y + b.height / 2, '#38bdf8', 40, 7);
                eng.bitsEarned += 50;
                setBitsCollected(eng.bitsEarned);
                if (gameMode === 'campaign') {
                  setGameState('victory');
                }
              }
            }
          }

          if (proj.x > width + 50 || !proj.active) {
            eng.projectiles.splice(pIdx, 1);
          }
        }

        // --- 7. UPDATE BOSS BEHAVIOR ---
        if (eng.boss.active) {
          const b = eng.boss;
          b.x = Math.max(width - 150, b.x - 3);
          b.frame += 0.08;
          b.y = 70 + Math.sin(b.frame) * 35;

          b.shootTimer--;
          if (b.shootTimer <= 0) {
            b.shootTimer = 110;
            // Launch Trojan projectile at Dino
            eng.obstacles.push({
              id: eng.obstacleIdCounter++,
              x: b.x,
              y: b.y + 30,
              width: 30,
              height: 20,
              type: 'laser_beam',
              speedMultiplier: 1.4,
              frame: 0
            });
            playRetroSound('boss_alert');
          }
        }

        // --- 8. UPDATE PARTICLES ---
        for (let i = eng.particles.length - 1; i >= 0; i--) {
          const p = eng.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life++;
          p.alpha = 1 - p.life / p.maxLife;
          if (p.life >= p.maxLife) {
            eng.particles.splice(i, 1);
          }
        }
      }

      // ==========================================
      // --- GRAPHICS RENDERING (CANVAS CANVAS) ---
      // ==========================================

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // 1. Biome Background Sky Gradient
      let skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (eng.biome === 'motherboard') {
        skyGrad.addColorStop(0, '#0f172a');
        skyGrad.addColorStop(1, '#020617');
      } else if (eng.biome === 'fiber_optic') {
        skyGrad.addColorStop(0, '#1e1b4b');
        skyGrad.addColorStop(1, '#030712');
      } else if (eng.biome === 'matrix_storm') {
        skyGrad.addColorStop(0, '#064e3b');
        skyGrad.addColorStop(1, '#022c22');
      } else {
        skyGrad.addColorStop(0, '#4c0519');
        skyGrad.addColorStop(1, '#1e050f');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Parallax City / Data Server Silhouettes
      ctx.fillStyle = 'rgba(30, 41, 59, 0.4)';
      for (let i = -1; i < 9; i++) {
        const bx = i * 110 - (eng.bgOffset1 % 110);
        const bh = 50 + ((i * 37) % 60);
        ctx.fillRect(bx, eng.groundY - bh - 40, 85, bh + 40);
        // Server rack blinking LED
        ctx.fillStyle = (i + Math.floor(eng.distance / 10)) % 2 === 0 ? '#38bdf8' : '#64748b';
        ctx.fillRect(bx + 15, eng.groundY - bh - 30, 4, 4);
        ctx.fillRect(bx + 25, eng.groundY - bh - 30, 4, 4);
        ctx.fillStyle = 'rgba(30, 41, 59, 0.4)';
      }

      // Floating Cloud / Wi-Fi signals in sky
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.font = '22px monospace';
      ctx.fillText('☁️', 180 - (eng.bgOffset1 % 400), 60);
      ctx.fillText('📡', 460 - (eng.bgOffset1 % 500), 50);
      ctx.fillText('📶', 720 - (eng.bgOffset1 % 600), 65);

      // Matrix Rain code effect if in Matrix Storm
      if (eng.biome === 'matrix_storm') {
        ctx.fillStyle = 'rgba(34, 197, 94, 0.25)';
        ctx.font = '11px monospace';
        for (let m = 0; m < 16; m++) {
          const mx = m * 50 + 10;
          const my = ((m * 30 + eng.distance * 2) % 200) + 20;
          ctx.fillText(m % 2 === 0 ? '1 0 1 1 0' : '0 1 0 0 1', mx, my);
        }
      }

      // 3. Ground Plane & Motherboard Traces
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, eng.groundY, width, height - eng.groundY);

      // Ground Top Line
      ctx.strokeStyle = eng.biome === 'matrix_storm' ? '#22c55e' : eng.biome === 'fiber_optic' ? '#818cf8' : '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, eng.groundY);
      ctx.lineTo(width, eng.groundY);
      ctx.stroke();

      // Ground Circuit Hatching Details
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
      ctx.lineWidth = 2;
      for (let g = -1; g < 25; g++) {
        const gx = g * 35 - eng.groundOffset;
        ctx.beginPath();
        ctx.moveTo(gx, eng.groundY + 8);
        ctx.lineTo(gx + 15, eng.groundY + 28);
        ctx.stroke();
      }

      // 4. Draw Collectibles
      eng.collectibles.forEach((item) => {
        ctx.save();
        ctx.translate(item.x + item.width / 2, item.y + item.height / 2);

        if (item.type === 'bit_zero' || item.type === 'bit_one') {
          // Glowing Neon Bit (0 or 1)
          ctx.fillStyle = '#22c55e';
          ctx.shadowColor = '#22c55e';
          ctx.shadowBlur = 8;
          ctx.font = 'bold 18px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(item.type === 'bit_one' ? '1' : '0', 0, 0);
        } else if (item.type === 'gold_byte') {
          // Gold Byte Coin
          ctx.fillStyle = '#fbbf24';
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(0, 0, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#78350f';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('B', 0, 1);
        } else if (item.type === 'shield') {
          // Shield Icon
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 12;
          ctx.font = '16px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🛡️', 0, 0);
        } else if (item.type === 'ammo') {
          ctx.fillStyle = '#ec4899';
          ctx.shadowColor = '#ec4899';
          ctx.shadowBlur = 12;
          ctx.font = '16px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🔋', 0, 0);
        } else if (item.type === 'overclock') {
          ctx.fillStyle = '#f59e0b';
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 15;
          ctx.font = '16px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⚡', 0, 0);
        } else if (item.type === 'magnet') {
          ctx.fillStyle = '#a855f7';
          ctx.shadowColor = '#a855f7';
          ctx.shadowBlur = 12;
          ctx.font = '16px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🧲', 0, 0);
        }
        ctx.restore();
      });

      // 5. Draw Obstacles
      eng.obstacles.forEach((obs) => {
        if (obs.isHit) return;
        ctx.save();

        if (obs.type === 'cactus_small' || obs.type === 'cactus_large') {
          // Cyber Cactus / Firewall Node
          ctx.fillStyle = '#10b981';
          ctx.shadowColor = '#059669';
          ctx.shadowBlur = 6;

          // Main Stem
          ctx.fillRect(obs.x + 8, obs.y, obs.width - 16, obs.height);
          // Left Arm
          ctx.fillRect(obs.x, obs.y + 12, 10, 8);
          ctx.fillRect(obs.x, obs.y + 4, 8, 12);
          // Right Arm
          ctx.fillRect(obs.x + obs.width - 10, obs.y + 18, 10, 8);
          ctx.fillRect(obs.x + obs.width - 8, obs.y + 10, 8, 12);

          // LED Pulse on top
          ctx.fillStyle = '#f43f5e';
          ctx.fillRect(obs.x + obs.width / 2 - 2, obs.y - 2, 4, 4);
        } else if (obs.type.startsWith('drone')) {
          // Cyber Pterodactyl / Wi-Fi Drone
          const flap = Math.sin(obs.frame * 2) * 6;
          ctx.fillStyle = '#f43f5e';
          ctx.shadowColor = '#e11d48';
          ctx.shadowBlur = 8;

          // Drone Body
          ctx.beginPath();
          ctx.ellipse(obs.x + 20, obs.y + 15, 14, 8, 0, 0, Math.PI * 2);
          ctx.fill();

          // Cyber Wings
          ctx.strokeStyle = '#fda4af';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(obs.x + 10, obs.y + 15);
          ctx.lineTo(obs.x - 4, obs.y + 6 + flap);
          ctx.moveTo(obs.x + 24, obs.y + 15);
          ctx.lineTo(obs.x + 36, obs.y + 6 - flap);
          ctx.stroke();

          // Camera Lens
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(obs.x + 8, obs.y + 15, 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (obs.type === 'capacitor') {
          // High-Voltage Capacitor
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(obs.x + 4, obs.y + 6, obs.width - 8, obs.height - 6);
          // Silver Pins
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(obs.x + 8, obs.y + obs.height - 4, 4, 4);
          ctx.fillRect(obs.x + obs.width - 12, obs.y + obs.height - 4, 4, 4);
          // Spark on top
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(obs.x + obs.width / 2 - 3, obs.y, 6, 6);
        } else if (obs.type === 'malware_worm') {
          // Crawling Bug / Malware Worm
          ctx.fillStyle = '#a855f7';
          ctx.shadowColor = '#9333ea';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(obs.x + 10, obs.y + 14, 8, 0, Math.PI * 2);
          ctx.arc(obs.x + 22, obs.y + 12, 7, 0, Math.PI * 2);
          ctx.arc(obs.x + 32, obs.y + 14, 6, 0, Math.PI * 2);
          ctx.fill();
        } else if (obs.type === 'laser_beam') {
          // Red Boss Laser Projectile
          ctx.fillStyle = '#f43f5e';
          ctx.shadowColor = '#f43f5e';
          ctx.shadowBlur = 12;
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(obs.x + 4, obs.y + 4, obs.width - 8, obs.height - 8);
        }
        ctx.restore();
      });

      // 6. Draw Boss if Active
      if (eng.boss.active) {
        const b = eng.boss;
        ctx.save();
        ctx.translate(b.x, b.y);

        // Boss Body: Titan Server Core
        ctx.fillStyle = '#1e1b4b';
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 15;
        ctx.fillRect(0, 0, b.width, b.height);
        ctx.strokeRect(0, 0, b.width, b.height);

        // Giant Red Malware Eye
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(b.width / 2, b.height / 2, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(b.width / 2, b.height / 2, 10, 0, Math.PI * 2);
        ctx.fill();

        // Boss Health Bar on top
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, -18, b.width, 10);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(0, -18, (b.health / b.maxHealth) * b.width, 10);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, -18, b.width, 10);

        ctx.restore();
      }

      // 7. Draw Projectiles
      eng.projectiles.forEach((proj) => {
        ctx.save();
        ctx.fillStyle = proj.color;
        ctx.shadowColor = proj.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(proj.x, proj.y - 3, proj.size * 1.6, 6);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(proj.x + 3, proj.y - 1, proj.size, 2);
        ctx.restore();
      });

      // 8. Draw Dino (Arky-Rex)
      const d = eng.dino;
      ctx.save();
      ctx.translate(d.x, d.y);

      // Overclock Chromatic Trail
      if (eng.overclockTimer > 0) {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
        ctx.fillRect(-15, 0, d.width, d.height);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.fillRect(-30, 0, d.width, d.height);
      }

      // Skin Colors
      let dinoColor = '#22c55e';
      let eyeColor = '#38bdf8';
      if (selectedSkin === 'mecha') {
        dinoColor = '#94a3b8';
        eyeColor = '#f43f5e';
      } else if (selectedSkin === 'hacker') {
        dinoColor = '#10b981';
        eyeColor = '#22c55e';
      } else if (selectedSkin === 'neon') {
        dinoColor = '#d946ef';
        eyeColor = '#38bdf8';
      }

      ctx.fillStyle = dinoColor;
      ctx.shadowColor = dinoColor;
      ctx.shadowBlur = 8;

      if (!d.isDucking) {
        // --- STANDING / JUMPING DINO SPRITE ---
        // Torso
        ctx.fillRect(12, 16, 24, 24);
        // Head & Snout
        ctx.fillRect(20, 0, 24, 18);
        ctx.fillRect(32, 10, 12, 8); // Jaw
        // Tail
        ctx.fillRect(2, 22, 12, 8);
        ctx.fillRect(0, 26, 6, 6);
        // Arms
        ctx.fillRect(34, 24, 8, 4);

        // Cyber Visor / Eye
        ctx.fillStyle = eyeColor;
        ctx.shadowColor = eyeColor;
        ctx.shadowBlur = 10;
        ctx.fillRect(30, 4, 10, 4);

        // Legs Animation (alternating while running)
        ctx.fillStyle = dinoColor;
        const legToggle = Math.floor(d.runFrame) % 2 === 0;
        if (d.isGrounded) {
          if (legToggle) {
            ctx.fillRect(16, 40, 6, 8); // Left Leg down
            ctx.fillRect(26, 40, 6, 4); // Right Leg back
          } else {
            ctx.fillRect(16, 40, 6, 4);
            ctx.fillRect(26, 40, 6, 8);
          }
        } else {
          // Mid-air tuck
          ctx.fillRect(14, 38, 6, 6);
          ctx.fillRect(24, 38, 6, 6);
        }
      } else {
        // --- DUCKING / SLIDING DINO SPRITE ---
        // Low Profile Body
        ctx.fillRect(4, 8, 32, 16);
        // Low Snout
        ctx.fillRect(28, 8, 16, 12);
        // Eye
        ctx.fillStyle = eyeColor;
        ctx.fillRect(36, 10, 8, 3);
        // Crawling feet
        ctx.fillStyle = dinoColor;
        const crawlToggle = Math.floor(d.runFrame) % 2 === 0;
        if (crawlToggle) {
          ctx.fillRect(12, 22, 10, 6);
        } else {
          ctx.fillRect(22, 22, 10, 6);
        }
      }

      // Draw Energy Shield Bubble if active
      if (eng.shield) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(d.width / 2, d.height / 2, Math.max(d.width, d.height) * 0.75, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();

      // 9. Draw Particles
      eng.particles.forEach((p) => {
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Loop frame
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, selectedSkin, highScore, onSaveScore, onAwardXP, gameMode, campaignLevel, playRetroSound, currentBiome]);

  return (
    <div id="cyber-dino-runner-root" className="w-full max-w-5xl mx-auto p-2 sm:p-6 select-none font-sans">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 sm:mb-4 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-slate-900 to-indigo-950/90 border border-emerald-500/40 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/40 shrink-0">
            🦖
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h2 className="text-base sm:text-xl font-black text-white tracking-tight font-heading">
                CYBER DINO: MATRIX RUSH
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] sm:text-[10px] font-black border border-emerald-500/40 uppercase tracking-wider flex items-center gap-1">
                <WifiOff className="w-3 h-3 text-rose-400" />
                Chrome Arcade TIC
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 hidden sm:block">
              {lang === 'en'
                ? 'Conquer the matrix grid, jump capacitors, duck Wi-Fi drones and defeat glitch titans!'
                : 'Aleargă prin Matrix, sari peste condensatori, alunecă sub drone Wi-Fi și învinge boșii glitch!'}
            </p>
          </div>
        </div>

        {/* Action controls right */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-amber-300">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Record: {highScore}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundMuted(!soundMuted)}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all text-xs font-bold cursor-pointer"
              title="Sunet ON/OFF"
            >
              {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onBack();
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 border border-slate-700 hover:border-rose-500 text-slate-200 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-rose-400" />
              <span>{lang === 'en' ? 'Arcade Hub' : 'Înapoi la Jocuri'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Game Stage Container */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-slate-950 border-2 border-slate-800 shadow-2xl overflow-hidden min-h-[260px] sm:min-h-[340px]">
        {/* HUD Live Stats Bar */}
        <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-4 sm:right-4 z-10 flex flex-wrap items-center justify-between gap-1.5 pointer-events-none">
          {/* Left HUD: Score & HighScore */}
          <div className="flex items-center gap-2 sm:gap-3 bg-slate-900/90 backdrop-blur-md px-2.5 sm:px-3.5 py-1 rounded-xl border border-slate-800 shadow-lg">
            <div className="flex items-center gap-1 font-mono">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">Scor:</span>
              <span className="text-sm sm:text-lg font-black text-emerald-400">{score.toString().padStart(5, '0')}</span>
            </div>
            <div className="h-3 sm:h-4 w-px bg-slate-700" />
            <div className="flex items-center gap-1 font-mono text-[11px] sm:text-xs">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span className="text-amber-300 font-bold">{highScore.toString().padStart(5, '0')}</span>
            </div>
          </div>

          {/* Center HUD: Biome & Boss Warning */}
          {bossWarning && (
            <div className="px-3 py-1 rounded-xl bg-rose-950/90 border border-rose-500 text-rose-200 text-[10px] sm:text-xs font-black animate-pulse flex items-center gap-1 shadow-lg">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>ATAC TITAN GLITCH!</span>
            </div>
          )}

          {/* Right HUD: Bits & Ammo & Powerups */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-900/90 backdrop-blur-md px-2.5 sm:px-3.5 py-1 rounded-xl border border-slate-800 shadow-lg">
            {/* Bits */}
            <div className="flex items-center gap-1 font-mono text-[11px] sm:text-xs text-emerald-300 font-bold">
              <span>🪙</span>
              <span>{bitsCollected}</span>
            </div>

            {/* Ammo */}
            <div className="flex items-center gap-1 font-mono text-[11px] sm:text-xs text-cyan-300 font-bold">
              <span>⚡</span>
              <span>{ammo}</span>
            </div>

            {/* Shield Icon */}
            {hasShield && (
              <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1 py-0.5 rounded border border-sky-400 font-bold">
                🛡️
              </span>
            )}

            {/* Overclock Icon */}
            {isOverclocked && (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1 py-0.5 rounded border border-amber-400 font-bold">
                🔥
              </span>
            )}

            {/* Magnet Icon */}
            {magnetActive && (
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1 py-0.5 rounded border border-purple-400 font-bold">
                🧲
              </span>
            )}
          </div>
        </div>

        {/* HTML5 Canvas Stage */}
        <canvas
          ref={canvasRef}
          className="w-full h-auto block bg-slate-950 cursor-pointer aspect-[800/320]"
          style={{ imageRendering: 'pixelated' }}
          onTouchStart={(e) => {
            if (gameState === 'playing') {
              e.preventDefault();
              triggerJump();
            }
          }}
          onClick={() => {
            if (gameState === 'playing') {
              triggerJump();
            }
          }}
        />

        {/* OVERLAY: MENU STATE */}
        {gameState === 'menu' && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-4 sm:p-6 text-center animate-fadeIn overflow-y-auto">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-2xl sm:text-4xl mb-2 shadow-xl ring-4 ring-emerald-500/30 shrink-0">
              🦖
            </div>

            <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight font-heading mb-1">
              CYBER DINO: MATRIX RUSH
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-300 max-w-md mb-3 sm:mb-4 leading-relaxed">
              Jocul legendar cu dinozauri din Chrome, adaptat pentru laboratorul TIC cu lasere, boost-uri și boși glitch!
            </p>

            {/* Game Mode Selector */}
            <div className="flex flex-wrap gap-2 mb-3 sm:mb-4 justify-center w-full max-w-lg">
              <button
                type="button"
                onClick={() => setGameMode('endless')}
                className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  gameMode === 'endless'
                    ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg ring-2 ring-emerald-400/40'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                🏃 Mod Clasic Infinit
              </button>

              <button
                type="button"
                onClick={() => setGameMode('campaign')}
                className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  gameMode === 'campaign'
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg ring-2 ring-indigo-400/40'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                🎯 Campanie & Boss
              </button>

              <button
                type="button"
                onClick={() => setGameMode('hardcore')}
                className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  gameMode === 'hardcore'
                    ? 'bg-rose-600 border-rose-400 text-white shadow-lg ring-2 ring-rose-400/40'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ⚡ Hardcore Viteză Max
              </button>
            </div>

            {/* Dino Skin Picker */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-4 bg-slate-900/80 px-3 py-1.5 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-bold mr-1">Costum:</span>
              <button
                type="button"
                onClick={() => setSelectedSkin('classic')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  selectedSkin === 'classic' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400' : 'text-slate-400'
                }`}
              >
                🦖 Clasic
              </button>
              <button
                type="button"
                onClick={() => setSelectedSkin('mecha')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  selectedSkin === 'mecha' ? 'bg-slate-500/20 text-slate-300 border border-slate-400' : 'text-slate-400'
                }`}
              >
                🤖 Mecha
              </button>
              <button
                type="button"
                onClick={() => setSelectedSkin('hacker')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  selectedSkin === 'hacker' ? 'bg-green-500/20 text-green-300 border border-green-400' : 'text-slate-400'
                }`}
              >
                👾 Hacker
              </button>
              <button
                type="button"
                onClick={() => setSelectedSkin('neon')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  selectedSkin === 'neon' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400' : 'text-slate-400'
                }`}
              >
                🦄 Neon
              </button>
            </div>

            {/* Play Button - Highly Prominent */}
            <button
              id="cyber-dino-start-game-btn"
              type="button"
              onClick={() => startNewGame(gameMode, campaignLevel)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-sm sm:text-base tracking-wide shadow-xl shadow-emerald-500/30 transition-all active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>START CURSĂ [APASĂ AICI / SPACE]</span>
            </button>
          </div>
        )}

        {/* OVERLAY: PAUSED STATE */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 animate-fadeIn">
            <h3 className="text-xl sm:text-2xl font-black text-white mb-4">JOCUL ESTE ÎN PAUZĂ</h3>
            <button
              type="button"
              onClick={() => setGameState('playing')}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Continuă Cursa (Apasă P)</span>
            </button>
          </div>
        )}

        {/* OVERLAY: GAME OVER STATE */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-4 sm:p-6 text-center animate-fadeIn overflow-y-auto">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-rose-950/80 border-2 border-rose-500 flex items-center justify-center text-2xl sm:text-3xl mb-2 text-rose-400 shadow-xl shrink-0">
              💥
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-rose-400 font-heading mb-1">
              404: IMPACT DETECTAT!
            </h3>
            <p className="text-xs text-slate-400 mb-3 sm:mb-4">Dinozaurul Arky a lovit un obstacol în Matrix!</p>

            {/* Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-lg w-full mb-4 text-xs font-mono">
              <div className="p-2 sm:p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Scor Final:</span>
                <span className="text-sm sm:text-base font-black text-emerald-400">{score} pts</span>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Biți Colectați:</span>
                <span className="text-sm sm:text-base font-black text-amber-400">🪙 {gameStats.bitsCount}</span>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Distruși / EMP:</span>
                <span className="text-sm sm:text-base font-black text-cyan-400">⚡ {gameStats.obstaclesDestroyed}</span>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">XP Câștigat:</span>
                <span className="text-sm sm:text-base font-black text-indigo-300">+{gameStats.xpEarned} XP</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 justify-center w-full max-w-md">
              <button
                type="button"
                onClick={() => startNewGame(gameMode, campaignLevel)}
                className="flex-1 min-w-[140px] px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reîncearcă [SPACE]</span>
              </button>

              <button
                type="button"
                onClick={() => setGameState('menu')}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer active:scale-95"
              >
                Meniu Principal
              </button>
            </div>
          </div>
        )}

        {/* OVERLAY: VICTORY STATE (Campaign Boss Defeated) */}
        {gameState === 'victory' && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-4 sm:p-6 text-center animate-fadeIn overflow-y-auto">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl sm:text-4xl mb-2 text-amber-400 shadow-xl shrink-0">
              🏆
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-amber-300 font-heading mb-1">
              VICTORIE! TITANUL GLITCH A FOST ANIHILAT!
            </h3>
            <p className="text-xs text-slate-300 mb-4 max-w-md">
              Ai restabilit conexiunea la rețea și ai salvat laboratorul de TIC! Ai primit +350 XP bonus de campion!
            </p>

            <button
              type="button"
              onClick={() => setGameState('menu')}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-black text-sm shadow-xl active:scale-95 cursor-pointer"
            >
              Înapoi la Meniu
            </button>
          </div>
        )}
      </div>

      {/* Touch & Mobile On-Screen Controls - High Reliability */}
      <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 touch-manipulation">
        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            triggerJump();
          }}
          onClick={triggerJump}
          className="min-h-[52px] sm:min-h-[64px] p-3 rounded-2xl bg-gradient-to-r sm:bg-gradient-to-b from-slate-900 to-slate-950 active:from-emerald-900 active:to-emerald-950 border-2 border-slate-800 active:border-emerald-400 text-white flex sm:flex-col items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
        >
          <ChevronUp className="w-6 h-6 text-emerald-400" />
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider">SARI (SPACE / TAP)</span>
        </button>

        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            setDuckState(true);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            setDuckState(false);
          }}
          onMouseDown={() => setDuckState(true)}
          onMouseUp={() => setDuckState(false)}
          className="min-h-[52px] sm:min-h-[64px] p-3 rounded-2xl bg-gradient-to-r sm:bg-gradient-to-b from-slate-900 to-slate-950 active:from-cyan-900 active:to-cyan-950 border-2 border-slate-800 active:border-cyan-400 text-white flex sm:flex-col items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
        >
          <ChevronDown className="w-6 h-6 text-cyan-400" />
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider">ALUNECĂ (S / ↓)</span>
        </button>

        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            triggerShoot();
          }}
          onClick={triggerShoot}
          className="min-h-[52px] sm:min-h-[64px] p-3 rounded-2xl bg-gradient-to-r sm:bg-gradient-to-b from-slate-900 to-slate-950 active:from-pink-900 active:to-pink-950 border-2 border-slate-800 active:border-pink-400 text-white flex sm:flex-col items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
        >
          <Crosshair className="w-6 h-6 text-pink-400" />
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider">TRAGE EMP (F / E)</span>
        </button>
      </div>

      {/* Game Guide & Controls Reference Card */}
      <div className="mt-4 p-3 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-start gap-2.5">
          <Keyboard className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-200 block mb-0.5">Comenzi Tastatură / Touch:</span>
            <p className="text-[11px] leading-relaxed">
              [SPACE] / Atingere = Salt • [↓] / Alunecare = Ferire drone • [F] = Laser EMP
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-200 block mb-0.5">Power-up-uri Speciale:</span>
            <p className="text-[11px] leading-relaxed">
              🛡️ Scutul absoarbe lovituri • ⚡ Turbo distruge obstacole • 🧲 Magnetul atrage biții
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Award className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-200 block mb-0.5">Punctaj & XP:</span>
            <p className="text-[11px] leading-relaxed">
              Scorul se sincronizează automat în profilul tău de elev și în Clasamentul General!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
