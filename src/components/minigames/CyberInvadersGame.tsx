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
  Pause,
  Award,
  Crown,
  Info,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Bomb,
  Radio,
  Sliders,
  Tv,
  Check
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { updateStudentArcadeScore } from '../../lib/studentAuthService';

export interface CyberInvadersGameProps {
  studentName?: string;
  studentAvatar?: string;
  onBack: () => void;
  onAwardXP?: (amount: number, reason: string) => void;
  onSaveScore?: (score: number) => void;
}

// Ship chassis types
type ShipChassis = 'quantum' | 'firewall' | 'hyperion';

// Game state
type GameState = 'menu' | 'playing' | 'paused' | 'quiz' | 'gameover' | 'victory';

// Enemy types
type EnemyType = 'ddos' | 'trojan' | 'spyware' | 'ransomware' | 'boss';

interface Enemy {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: EnemyType;
  health: number;
  maxHealth: number;
  scoreValue: number;
  color: string;
  isDiving?: boolean;
  diveVx?: number;
  diveVy?: number;
  originX?: number;
  originY?: number;
  animFrame: number;
}

interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isEnemy: boolean;
  color: string;
  damage: number;
}

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
  char?: string;
}

interface PowerUp {
  id: number;
  x: number;
  y: number;
  type: 'dual' | 'triple' | 'shield' | 'freeze' | 'bomb' | 'life' | 'quiz';
  vy: number;
  size: number;
}

interface MysteryUFO {
  x: number;
  y: number;
  vx: number;
  width: number;
  height: number;
  active: boolean;
}

interface MicroQuizQuestion {
  questionRo: string;
  questionEn: string;
  options: { labelRo: string; labelEn: string; isCorrect: boolean }[];
  explanationRo: string;
  explanationEn: string;
}

const MICRO_QUESTIONS: MicroQuizQuestion[] = [
  {
    questionRo: 'Ce port de rețea securizat folosește protocolul HTTPS?',
    questionEn: 'Which secure network port does the HTTPS protocol use?',
    options: [
      { labelRo: 'Portul 443', labelEn: 'Port 443', isCorrect: true },
      { labelRo: 'Portul 80', labelEn: 'Port 80', isCorrect: false },
      { labelRo: 'Portul 21', labelEn: 'Port 21', isCorrect: false }
    ],
    explanationRo: 'HTTPS utilizează portul securizat 443 criptat cu SSL/TLS!',
    explanationEn: 'HTTPS uses encrypted SSL/TLS port 443!'
  },
  {
    questionRo: 'Câți biți alcătuiesc un Octet (Byte)?',
    questionEn: 'How many bits make up one Byte (Octet)?',
    options: [
      { labelRo: '8 biți', labelEn: '8 bits', isCorrect: true },
      { labelRo: '4 biți', labelEn: '4 bits', isCorrect: false },
      { labelRo: '16 biți', labelEn: '16 bits', isCorrect: false }
    ],
    explanationRo: '1 Byte (Octet) conține exact 8 biți de informație (0 și 1).',
    explanationEn: '1 Byte contains exactly 8 binary bits (0s and 1s).'
  },
  {
    questionRo: 'Care este „creierul” calculatorului ce execută calculele?',
    questionEn: 'What is the "brain" of the computer that executes instructions?',
    options: [
      { labelRo: 'CPU (Procesorul)', labelEn: 'CPU (Processor)', isCorrect: true },
      { labelRo: 'RAM (Memoria volatilă)', labelEn: 'RAM (Memory)', isCorrect: false },
      { labelRo: 'Sursa de alimentare (PSU)', labelEn: 'Power Supply (PSU)', isCorrect: false }
    ],
    explanationRo: 'CPU (Central Processing Unit) este unitatea centrală de procesare.',
    explanationEn: 'CPU (Central Processing Unit) executes all program instructions.'
  },
  {
    questionRo: 'Ce se întâmplă cu datele din memoria RAM când oprești PC-ul?',
    questionEn: 'What happens to data in RAM memory when you turn off the PC?',
    options: [
      { labelRo: 'Se șterg complet (memorie volatilă)', labelEn: 'They are wiped (volatile memory)', isCorrect: true },
      { labelRo: 'Rămân salvate permanent', labelEn: 'They stay permanently saved', isCorrect: false },
      { labelRo: 'Se trimit automat în cloud', labelEn: 'They auto-upload to cloud', isCorrect: false }
    ],
    explanationRo: 'RAM este memorie volatilă de lucru; își pierde conținutul la oprire.',
    explanationEn: 'RAM is volatile working memory; it resets upon power cutoff.'
  },
  {
    questionRo: 'Care este scurtătura standard pe tastatură pentru Salvare rapidă?',
    questionEn: 'What is the universal keyboard shortcut for quick Save?',
    options: [
      { labelRo: 'Ctrl + S', labelEn: 'Ctrl + S', isCorrect: true },
      { labelRo: 'Ctrl + C', labelEn: 'Ctrl + C', isCorrect: false },
      { labelRo: 'Ctrl + Z', labelEn: 'Ctrl + Z', isCorrect: false }
    ],
    explanationRo: 'Ctrl + S (Save) salvează instantaneu fișierul curent.',
    explanationEn: 'Ctrl + S triggers an immediate file save operation.'
  },
  {
    questionRo: 'Ce înseamnă abrevierea SSD?',
    questionEn: 'What does the abbreviation SSD stand for?',
    options: [
      { labelRo: 'Solid State Drive', labelEn: 'Solid State Drive', isCorrect: true },
      { labelRo: 'Super Speed Disk', labelEn: 'Super Speed Disk', isCorrect: false },
      { labelRo: 'System Storage Device', labelEn: 'System Storage Device', isCorrect: false }
    ],
    explanationRo: 'SSD = Solid State Drive, mediu de stocare bazat pe cipuri flash rapide.',
    explanationEn: 'SSD = Solid State Drive, fast flash-based secondary storage.'
  },
  {
    questionRo: 'Care extensie corespunde unui fișier executabil de instalare?',
    questionEn: 'Which extension corresponds to an executable installer file?',
    options: [
      { labelRo: '.exe', labelEn: '.exe', isCorrect: true },
      { labelRo: '.docx', labelEn: '.docx', isCorrect: false },
      { labelRo: '.png', labelEn: '.png', isCorrect: false }
    ],
    explanationRo: '.exe reprezintă un program executabil în sistemul Windows.',
    explanationEn: '.exe indicates an executable program binary on Windows.'
  },
  {
    questionRo: 'Ce tip de malware criptează fișierele și cere o recompensă?',
    questionEn: 'What type of malware encrypts files and demands a ransom?',
    options: [
      { labelRo: 'Ransomware', labelEn: 'Ransomware', isCorrect: true },
      { labelRo: 'Spyware', labelEn: 'Spyware', isCorrect: false },
      { labelRo: 'Adware', labelEn: 'Adware', isCorrect: false }
    ],
    explanationRo: 'Ransomware-ul blochează accesul la date până la plata unei răscumpărări.',
    explanationEn: 'Ransomware encrypts user data until a ransom is paid.'
  }
];

export const CyberInvadersGame: React.FC<CyberInvadersGameProps> = ({
  studentName: propStudentName,
  studentAvatar: propStudentAvatar,
  onBack,
  onAwardXP,
  onSaveScore
}) => {
  const { lang } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const studentName = propStudentName || (() => {
    try {
      return localStorage.getItem('arkedo_student_name') || (lang === 'en' ? 'Cadet Pilot' : 'Campion TIC');
    } catch {
      return lang === 'en' ? 'Cadet Pilot' : 'Campion TIC';
    }
  })();

  const studentAvatar = propStudentAvatar || (() => {
    try {
      return localStorage.getItem('arkedo_student_avatar') || '🚀';
    } catch {
      return '🚀';
    }
  })();

  // Game configuration states
  const [gameState, setGameState] = useState<GameState>('menu');
  const [selectedChassis, setSelectedChassis] = useState<ShipChassis>('quantum');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_cyber_invaders') || '0');
    } catch {
      return 0;
    }
  });
  const [wave, setWave] = useState(1);
  const [lives, setLives] = useState(3);
  const [bombs, setBombs] = useState(2);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [scanlines, setScanlines] = useState(true);
  const [mouseFollow, setMouseFollow] = useState(false);
  const [autoFire, setAutoFire] = useState(false);
  const [combo, setCombo] = useState(1);
  const [comboTimer, setComboTimer] = useState(0);
  const [totalKills, setTotalKills] = useState(0);

  // Micro-Quiz state
  const [activeQuiz, setActiveQuiz] = useState<MicroQuizQuestion | null>(null);
  const [quizTimer, setQuizTimer] = useState(6);
  const [quizResult, setQuizResult] = useState<'correct' | 'wrong' | null>(null);

  // Overclock status (boost after quiz or powerup)
  const [overclockLeft, setOverclockLeft] = useState(0);
  const [shieldHits, setShieldHits] = useState(0);
  const [weaponType, setWeaponType] = useState<'single' | 'dual' | 'triple'>('single');
  const [weaponTimer, setWeaponTimer] = useState(0);
  const [freezeTimer, setFreezeTimer] = useState(0);

  // Boss state
  const [bossActive, setBossActive] = useState(false);
  const [bossHealth, setBossHealth] = useState(100);
  const [bossMaxHealth, setBossMaxHealth] = useState(100);
  const [bossName, setBossName] = useState('');

  // Refs for animation loop
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const keysRef = useRef<Record<string, boolean>>({});
  const touchLeftRef = useRef(false);
  const touchRightRef = useRef(false);
  const touchFireRef = useRef(false);

  // Game world entities in refs for 60fps performance
  const playerRef = useRef({
    x: 400,
    y: 540,
    width: 44,
    height: 38,
    vx: 0,
    speed: 380,
    lastFired: 0,
    fireRate: 200,
    invulnerableUntil: 0
  });

  const enemiesRef = useRef<Enemy[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const powerUpsRef = useRef<PowerUp[]>([]);
  const mysteryUFORef = useRef<MysteryUFO>({
    x: -80,
    y: 42,
    vx: 120,
    width: 52,
    height: 26,
    active: false
  });

  const formationRef = useRef({
    direction: 1,
    speed: 40,
    stepDown: false,
    nextDropTimer: 0
  });

  // Screen shake
  const shakeRef = useRef(0);

  // Play retro synth audio
  const playSoundEffect = useCallback((type: 'laser' | 'laser_heavy' | 'explosion' | 'powerup' | 'bomb' | 'shield' | 'quiz_chime' | 'boss_hit') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'laser') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'laser_heavy') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(1100, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'explosion') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'powerup') {
        const notes = [440, 554, 659, 880];
        notes.forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);
          g.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.05);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.15);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(ctx.currentTime + i * 0.05);
          o.stop(ctx.currentTime + i * 0.05 + 0.15);
        });
      } else if (type === 'bomb') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(250, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.6);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      } else if (type === 'shield') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(700, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'quiz_chime') {
        const chord = [523.25, 659.25, 783.99, 1046.50];
        chord.forEach((freq, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'triangle';
          o.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.04);
          g.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.04);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.04 + 0.3);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(ctx.currentTime + idx * 0.04);
          o.stop(ctx.currentTime + idx * 0.04 + 0.3);
        });
      } else if (type === 'boss_hit') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.07);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.07);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.07);
      }
    } catch {
      // AudioContext could be blocked by browser policy
    }
  }, [soundEnabled]);

  // Create Enemy Formation for Wave
  const initWaveEnemies = useCallback((waveNum: number) => {
    const isBossWave = waveNum % 3 === 0;
    const enemies: Enemy[] = [];

    if (isBossWave) {
      // Boss Battle Wave
      const bossIndex = Math.floor(waveNum / 3);
      let name = 'Zero-Day Worm Queen 🐛👑';
      let hp = 45;
      if (bossIndex === 2) {
        name = 'Rootkit Cyber Kraken 🐙⚡';
        hp = 70;
      } else if (bossIndex >= 3) {
        name = 'Quantum Kernel Overlord 💀👑';
        hp = 100;
      }

      setBossActive(true);
      setBossName(name);
      setBossHealth(hp);
      setBossMaxHealth(hp);

      enemies.push({
        id: 9999,
        x: 340,
        y: 80,
        width: 120,
        height: 65,
        type: 'boss',
        health: hp,
        maxHealth: hp,
        scoreValue: 1500,
        color: '#f43f5e',
        animFrame: 0
      });

      // Add escort minions
      for (let i = 0; i < 4; i++) {
        enemies.push({
          id: 100 + i,
          x: 180 + i * 120,
          y: 165,
          width: 32,
          height: 24,
          type: 'trojan',
          health: 2,
          maxHealth: 2,
          scoreValue: 40,
          color: '#10b981',
          animFrame: 0
        });
      }
    } else {
      setBossActive(false);
      // Standard 4-row formation
      const cols = 8;
      const rows = 4;
      const startX = 140;
      const startY = 75;
      const spacingX = 64;
      const spacingY = 44;

      let idCounter = 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let type: EnemyType = 'trojan';
          let color = '#10b981';
          let health = 1;
          let pts = 20;

          if (r === 0) {
            type = 'ddos';
            color = '#06b6d4';
            pts = 30;
          } else if (r === 1) {
            type = 'spyware';
            color = '#a855f7';
            pts = 20;
          } else if (r === 2) {
            type = 'trojan';
            color = '#10b981';
            pts = 20;
          } else {
            type = 'ransomware';
            color = '#f43f5e';
            health = 2;
            pts = 40;
          }

          enemies.push({
            id: idCounter++,
            x: startX + c * spacingX,
            y: startY + r * spacingY,
            width: 34,
            height: 24,
            type,
            health,
            maxHealth: health,
            scoreValue: pts,
            color,
            animFrame: 0
          });
        }
      }
    }

    enemiesRef.current = enemies;
    formationRef.current.direction = 1;
    formationRef.current.speed = 35 + waveNum * 6;
  }, []);

  // Trigger screen shake
  const addScreenShake = (amount: number) => {
    shakeRef.current = Math.min(25, shakeRef.current + amount);
  };

  // Particle Spawner
  const spawnExplosionParticles = (x: number, y: number, color: string, count = 16) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 180;
      const char = Math.random() > 0.5 ? '1' : '0';
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 4,
        color,
        alpha: 1,
        life: 0,
        maxLife: 0.4 + Math.random() * 0.5,
        char: Math.random() > 0.4 ? char : undefined
      });
    }
  };

  // Launch Player Laser
  const firePlayerLaser = useCallback(() => {
    if (gameState !== 'playing') return;
    const now = performance.now();
    const p = playerRef.current;
    if (now - p.lastFired < p.fireRate) return;

    p.lastFired = now;
    const isOverclocked = overclockLeft > 0;
    const currentWeapon = isOverclocked ? 'triple' : weaponType;
    const bulletDamage = isOverclocked ? 2 : 1;

    playSoundEffect(isOverclocked ? 'laser_heavy' : 'laser');

    if (currentWeapon === 'single') {
      projectilesRef.current.push({
        x: p.x + p.width / 2 - 2.5,
        y: p.y - 10,
        vx: 0,
        vy: -600,
        width: 5,
        height: 16,
        isEnemy: false,
        color: '#38bdf8',
        damage: bulletDamage
      });
    } else if (currentWeapon === 'dual') {
      projectilesRef.current.push(
        {
          x: p.x + 6,
          y: p.y - 8,
          vx: 0,
          vy: -650,
          width: 4,
          height: 16,
          isEnemy: false,
          color: '#38bdf8',
          damage: bulletDamage
        },
        {
          x: p.x + p.width - 10,
          y: p.y - 8,
          vx: 0,
          vy: -650,
          width: 4,
          height: 16,
          isEnemy: false,
          color: '#38bdf8',
          damage: bulletDamage
        }
      );
    } else if (currentWeapon === 'triple') {
      projectilesRef.current.push(
        {
          x: p.x + p.width / 2 - 2.5,
          y: p.y - 12,
          vx: 0,
          vy: -700,
          width: 5,
          height: 18,
          isEnemy: false,
          color: '#f59e0b',
          damage: bulletDamage
        },
        {
          x: p.x + 4,
          y: p.y - 8,
          vx: -110,
          vy: -680,
          width: 4,
          height: 16,
          isEnemy: false,
          color: '#f59e0b',
          damage: bulletDamage
        },
        {
          x: p.x + p.width - 8,
          y: p.y - 8,
          vx: 110,
          vy: -680,
          width: 4,
          height: 16,
          isEnemy: false,
          color: '#f59e0b',
          damage: bulletDamage
        }
      );
    }
  }, [gameState, overclockLeft, weaponType, playSoundEffect]);

  // Activate EMP Bomb
  const handleTriggerBomb = useCallback(() => {
    if (gameState !== 'playing' || bombs <= 0) return;
    setBombs((b) => b - 1);
    playSoundEffect('bomb');
    addScreenShake(18);

    // Destroy all enemy projectiles
    projectilesRef.current = projectilesRef.current.filter((p) => !p.isEnemy);

    // Damage all enemies
    enemiesRef.current.forEach((enemy) => {
      enemy.health -= 6;
      spawnExplosionParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#f43f5e', 8);
    });

    // EMP Shockwave visual particles
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2;
      particlesRef.current.push({
        x: playerRef.current.x + playerRef.current.width / 2,
        y: playerRef.current.y,
        vx: Math.cos(angle) * 350,
        vy: Math.sin(angle) * 350,
        size: 5,
        color: '#38bdf8',
        alpha: 1,
        life: 0,
        maxLife: 0.6
      });
    }
  }, [gameState, bombs, playSoundEffect]);

  // Start / Restart Game
  const handleStartGame = () => {
    sounds.playClick();
    setScore(0);
    setWave(1);
    setLives(selectedChassis === 'firewall' ? 4 : 3);
    setBombs(selectedChassis === 'quantum' ? 3 : 2);
    setCombo(1);
    setTotalKills(0);
    setOverclockLeft(0);
    setShieldHits(selectedChassis === 'firewall' ? 2 : 0);
    setWeaponType('single');
    setFreezeTimer(0);
    setActiveQuiz(null);
    setGameState('playing');

    playerRef.current.x = 400 - 22;
    playerRef.current.y = 530;
    playerRef.current.fireRate = selectedChassis === 'hyperion' ? 170 : 200;
    projectilesRef.current = [];
    particlesRef.current = [];
    powerUpsRef.current = [];

    initWaveEnemies(1);
  };

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;

      if (e.code === 'Space') {
        e.preventDefault();
        firePlayerLaser();
      } else if (e.code === 'KeyB' || e.code === 'KeyE') {
        e.preventDefault();
        handleTriggerBomb();
      } else if (e.code === 'KeyP') {
        e.preventDefault();
        setGameState((prev) => (prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [firePlayerLaser, handleTriggerBomb]);

  // Handle Micro-Quiz Answer
  const handleAnswerQuiz = (isCorrect: boolean) => {
    if (quizResult !== null) return;
    if (isCorrect) {
      sounds.playCorrect();
      setQuizResult('correct');
      setScore((s) => s + 500);
      setOverclockLeft(8); // 8 seconds of Super Overclock
      spawnExplosionParticles(400, 300, '#fbbf24', 30);
    } else {
      sounds.playWrong();
      setQuizResult('wrong');
    }

    setTimeout(() => {
      setActiveQuiz(null);
      setQuizResult(null);
      setGameState('playing');
    }, 1200);
  };

  // Main 60FPS Game Loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const gameLoop = (timestamp: number) => {
      if (!running) return;
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = timestamp;

      // Update Screen Shake
      if (shakeRef.current > 0) {
        shakeRef.current = Math.max(0, shakeRef.current - dt * 25);
      }

      // Update Player Position
      const p = playerRef.current;
      let moveDir = 0;
      if (keysRef.current['ArrowLeft'] || keysRef.current['KeyA'] || touchLeftRef.current) {
        moveDir -= 1;
      }
      if (keysRef.current['ArrowRight'] || keysRef.current['KeyD'] || touchRightRef.current) {
        moveDir += 1;
      }

      p.x += moveDir * p.speed * dt;
      p.x = Math.max(10, Math.min(canvas.width - p.width - 10, p.x));

      // Auto-fire or touch fire
      if (autoFire || touchFireRef.current) {
        firePlayerLaser();
      }

      // Update Overclock & Freeze Timers
      if (overclockLeft > 0) {
        setOverclockLeft((prev) => Math.max(0, prev - dt));
      }
      if (weaponTimer > 0) {
        setWeaponTimer((prev) => {
          const next = prev - dt;
          if (next <= 0) setWeaponType('single');
          return Math.max(0, next);
        });
      }
      if (freezeTimer > 0) {
        setFreezeTimer((prev) => Math.max(0, prev - dt));
      }

      // Update Mystery UFO
      const ufo = mysteryUFORef.current;
      if (ufo.active) {
        ufo.x += ufo.vx * dt;
        if (ufo.x > canvas.width + 100) {
          ufo.active = false;
        }
      } else {
        // Random spawn every ~20s
        if (Math.random() < 0.0015) {
          ufo.active = true;
          ufo.x = -ufo.width;
        }
      }

      // Update Enemy Formation
      const formation = formationRef.current;
      const enemies = enemiesRef.current;
      let hitEdge = false;
      const speedModifier = freezeTimer > 0 ? 0.35 : 1;

      enemies.forEach((enemy) => {
        if (!enemy.isDiving) {
          enemy.x += formation.direction * formation.speed * speedModifier * dt;
          if (enemy.x <= 15 || enemy.x + enemy.width >= canvas.width - 15) {
            hitEdge = true;
          }
        } else {
          // Diving enemy
          enemy.x += (enemy.diveVx || 0) * dt;
          enemy.y += (enemy.diveVy || 120) * dt;
          if (enemy.y > canvas.height + 50) {
            enemy.y = 80;
            enemy.isDiving = false;
          }
        }
      });

      if (hitEdge && !bossActive) {
        formation.direction *= -1;
        enemies.forEach((e) => {
          if (!e.isDiving) e.y += 18;
          // Check if bug reached bottom motherboard socket
          if (e.y + e.height >= p.y - 10) {
            setLives(0);
            setGameState('gameover');
          }
        });
      }

      // Enemy Shooting logic
      if (Math.random() < (0.012 + wave * 0.003) && enemies.length > 0) {
        const shooters = enemies.filter((e) => e.y < canvas.height - 100);
        if (shooters.length > 0) {
          const shooter = shooters[Math.floor(Math.random() * shooters.length)];
          projectilesRef.current.push({
            x: shooter.x + shooter.width / 2 - 2,
            y: shooter.y + shooter.height,
            vx: 0,
            vy: 200 + wave * 15,
            width: 4,
            height: 12,
            isEnemy: true,
            color: shooter.color,
            damage: 1
          });
        }
      }

      // Random dive attacks for Spyware / DDoS
      if (!bossActive && Math.random() < 0.004 && enemies.length > 0) {
        const candidates = enemies.filter((e) => (e.type === 'spyware' || e.type === 'ddos') && !e.isDiving);
        if (candidates.length > 0) {
          const diver = candidates[Math.floor(Math.random() * candidates.length)];
          diver.isDiving = true;
          diver.diveVx = (p.x - diver.x) * 0.8;
          diver.diveVy = 180 + wave * 20;
        }
      }

      // Update Projectiles
      const remainingProjectiles: Projectile[] = [];
      projectilesRef.current.forEach((proj) => {
        proj.x += proj.vx * dt;
        proj.y += proj.vy * dt;

        // Check canvas bounds
        if (proj.y < -30 || proj.y > canvas.height + 30) return;

        // Player laser hitting enemies
        if (!proj.isEnemy) {
          let hit = false;

          // Check Mystery UFO collision
          if (ufo.active && proj.x >= ufo.x && proj.x <= ufo.x + ufo.width && proj.y >= ufo.y && proj.y <= ufo.y + ufo.height) {
            hit = true;
            ufo.active = false;
            setScore((s) => s + 300);
            spawnExplosionParticles(ufo.x + ufo.width / 2, ufo.y + ufo.height / 2, '#fbbf24', 20);
            playSoundEffect('powerup');

            // Drop Micro-Quiz or Super Powerup
            powerUpsRef.current.push({
              id: Date.now(),
              x: ufo.x + ufo.width / 2,
              y: ufo.y,
              type: Math.random() > 0.4 ? 'quiz' : 'bomb',
              vy: 110,
              size: 20
            });
          }

          // Check bug enemies collision
          for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            if (
              proj.x + proj.width >= enemy.x &&
              proj.x <= enemy.x + enemy.width &&
              proj.y + proj.height >= enemy.y &&
              proj.y <= enemy.y + enemy.height
            ) {
              hit = true;
              enemy.health -= proj.damage;
              playSoundEffect(enemy.type === 'boss' ? 'boss_hit' : 'explosion');

              if (enemy.type === 'boss') {
                setBossHealth(Math.max(0, enemy.health));
                addScreenShake(6);
              }

              if (enemy.health <= 0) {
                // Enemy destroyed
                setScore((s) => s + enemy.scoreValue * combo);
                setTotalKills((k) => k + 1);
                spawnExplosionParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.color, enemy.type === 'boss' ? 40 : 12);
                if (enemy.type === 'boss') addScreenShake(20);

                // Chance to drop power-up
                if (Math.random() < 0.18) {
                  const types: PowerUp['type'][] = ['dual', 'triple', 'shield', 'freeze', 'bomb', 'life', 'quiz'];
                  const picked = types[Math.floor(Math.random() * types.length)];
                  powerUpsRef.current.push({
                    id: Math.random(),
                    x: enemy.x + enemy.width / 2,
                    y: enemy.y,
                    type: picked,
                    vy: 110,
                    size: 18
                  });
                }
              }
              break;
            }
          }

          if (!hit) remainingProjectiles.push(proj);
        } else {
          // Enemy projectile hitting player
          if (
            performance.now() > p.invulnerableUntil &&
            proj.x + proj.width >= p.x + 4 &&
            proj.x <= p.x + p.width - 4 &&
            proj.y + proj.height >= p.y + 4 &&
            proj.y <= p.y + p.height - 4
          ) {
            // Hit player!
            if (shieldHits > 0) {
              setShieldHits((s) => s - 1);
              playSoundEffect('shield');
              addScreenShake(8);
              p.invulnerableUntil = performance.now() + 600;
            } else {
              setLives((l) => {
                const nextLives = l - 1;
                if (nextLives <= 0) {
                  setGameState('gameover');
                }
                return nextLives;
              });
              playSoundEffect('explosion');
              addScreenShake(15);
              spawnExplosionParticles(p.x + p.width / 2, p.y + p.height / 2, '#38bdf8', 25);
              p.invulnerableUntil = performance.now() + 1500;
            }
            return;
          }
          remainingProjectiles.push(proj);
        }
      });
      projectilesRef.current = remainingProjectiles;

      // Filter living enemies
      enemiesRef.current = enemies.filter((e) => e.health > 0);

      // Check Wave Completion
      if (enemiesRef.current.length === 0) {
        // Next Wave!
        sounds.playLevelUp();
        setWave((w) => {
          const nextWave = w + 1;
          if (nextWave > 9) {
            setGameState('victory');
          } else {
            initWaveEnemies(nextWave);
          }
          return nextWave;
        });
      }

      // Update Powerups
      const remainingPowerups: PowerUp[] = [];
      powerUpsRef.current.forEach((pup) => {
        pup.y += pup.vy * dt;
        if (pup.y > canvas.height + 20) return;

        // Pickup collision
        if (
          pup.x + pup.size >= p.x &&
          pup.x <= p.x + p.width &&
          pup.y + pup.size >= p.y &&
          pup.y <= p.y + p.height
        ) {
          // Collect!
          playSoundEffect('powerup');
          if (pup.type === 'dual') {
            setWeaponType('dual');
            setWeaponTimer(12);
          } else if (pup.type === 'triple') {
            setWeaponType('triple');
            setWeaponTimer(10);
          } else if (pup.type === 'shield') {
            setShieldHits(3);
          } else if (pup.type === 'freeze') {
            setFreezeTimer(7);
          } else if (pup.type === 'bomb') {
            setBombs((b) => Math.min(4, b + 1));
          } else if (pup.type === 'life') {
            setLives((l) => Math.min(5, l + 1));
          } else if (pup.type === 'quiz') {
            // Trigger Micro-Quiz!
            const q = MICRO_QUESTIONS[Math.floor(Math.random() * MICRO_QUESTIONS.length)];
            setActiveQuiz(q);
            setQuizTimer(6);
            setGameState('quiz');
            playSoundEffect('quiz_chime');
          }
          return;
        }
        remainingPowerups.push(pup);
      });
      powerUpsRef.current = remainingPowerups;

      // Update Particles
      const remainingParticles: Particle[] = [];
      particlesRef.current.forEach((part) => {
        part.x += part.vx * dt;
        part.y += part.vy * dt;
        part.life += dt;
        part.alpha = Math.max(0, 1 - part.life / part.maxLife);
        if (part.life < part.maxLife) remainingParticles.push(part);
      });
      particlesRef.current = remainingParticles;

      // ================= DRAWING =================
      ctx.save();

      // Screen shake translation
      if (shakeRef.current > 0) {
        const shakeX = (Math.random() - 0.5) * shakeRef.current;
        const shakeY = (Math.random() - 0.5) * shakeRef.current;
        ctx.translate(shakeX, shakeY);
      }

      // Background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Scrolling Starfield & Binary streams
      ctx.fillStyle = '#1e293b';
      for (let i = 0; i < 30; i++) {
        const sx = ((i * 37 + timestamp * 0.04) % canvas.width);
        const sy = ((i * 71 + timestamp * 0.08) % canvas.height);
        ctx.fillRect(sx, sy, 2, 2);
      }
      ctx.fillStyle = '#334155';
      for (let i = 0; i < 15; i++) {
        const sx = ((i * 61 + timestamp * 0.09) % canvas.width);
        const sy = ((i * 93 + timestamp * 0.15) % canvas.height);
        ctx.fillRect(sx, sy, 3, 3);
      }

      // Motherboard Socket Defense Line (Bottom)
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 25);
      ctx.lineTo(canvas.width, canvas.height - 25);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Mystery UFO
      if (ufo.active) {
        ctx.save();
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.ellipse(ufo.x + ufo.width / 2, ufo.y + ufo.height / 2, ufo.width / 2, ufo.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('ROM UFO', ufo.x + 4, ufo.y + 16);
        ctx.restore();
      }

      // Draw Enemies
      enemies.forEach((enemy) => {
        ctx.save();
        ctx.translate(enemy.x, enemy.y);

        if (enemy.type === 'boss') {
          // Boss Ship
          ctx.fillStyle = '#e11d48';
          ctx.beginPath();
          ctx.moveTo(enemy.width / 2, 0);
          ctx.lineTo(enemy.width, enemy.height * 0.4);
          ctx.lineTo(enemy.width * 0.8, enemy.height);
          ctx.lineTo(enemy.width * 0.2, enemy.height);
          ctx.lineTo(0, enemy.height * 0.4);
          ctx.closePath();
          ctx.fill();

          // Boss Core Eye
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(enemy.width / 2, enemy.height / 2, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(enemy.width / 2, enemy.height / 2, 6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Standard Bugs
          ctx.fillStyle = enemy.color;
          ctx.shadowColor = enemy.color;
          ctx.shadowBlur = 8;

          if (enemy.type === 'ddos') {
            // Triangular speedy sprite
            ctx.beginPath();
            ctx.moveTo(enemy.width / 2, enemy.height);
            ctx.lineTo(enemy.width, 0);
            ctx.lineTo(0, 0);
            ctx.closePath();
            ctx.fill();
          } else if (enemy.type === 'trojan') {
            // Blocky Invader
            ctx.fillRect(4, 4, enemy.width - 8, enemy.height - 8);
            ctx.fillRect(0, 0, 4, 8);
            ctx.fillRect(enemy.width - 4, 0, 4, 8);
            ctx.fillRect(0, enemy.height - 8, 4, 8);
            ctx.fillRect(enemy.width - 4, enemy.height - 8, 4, 8);
          } else if (enemy.type === 'spyware') {
            // Spider crab
            ctx.beginPath();
            ctx.arc(enemy.width / 2, enemy.height / 2, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(2, enemy.height - 4, 4, 6);
            ctx.fillRect(enemy.width - 6, enemy.height - 4, 4, 6);
          } else {
            // Ransomware armored box
            ctx.fillRect(0, 0, enemy.width, enemy.height);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(6, 6, enemy.width - 12, enemy.height - 12);
          }
        }
        ctx.restore();
      });

      // Draw Powerups
      powerUpsRef.current.forEach((pup) => {
        ctx.save();
        ctx.fillStyle = pup.type === 'quiz' ? '#fbbf24' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(pup.x + pup.size / 2, pup.y + pup.size / 2, pup.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 11px monospace';
        const label = pup.type === 'dual' ? '2X' : pup.type === 'triple' ? '3X' : pup.type === 'shield' ? '🛡️' : pup.type === 'freeze' ? '❄️' : pup.type === 'bomb' ? '💣' : pup.type === 'life' ? '❤️' : '<?>';
        ctx.fillText(label, pup.x + 3, pup.y + 13);
        ctx.restore();
      });

      // Draw Projectiles
      projectilesRef.current.forEach((proj) => {
        ctx.save();
        ctx.fillStyle = proj.color;
        ctx.shadowColor = proj.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(proj.x, proj.y, proj.width, proj.height);
        ctx.restore();
      });

      // Draw Particles
      particlesRef.current.forEach((part) => {
        ctx.save();
        ctx.globalAlpha = part.alpha;
        ctx.fillStyle = part.color;
        if (part.char) {
          ctx.font = 'bold 12px monospace';
          ctx.fillText(part.char, part.x, part.y);
        } else {
          ctx.beginPath();
          ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // Draw Player Ship (Arky Sentinel)
      const isInvulnerable = performance.now() < p.invulnerableUntil;
      const flash = isInvulnerable && Math.floor(timestamp / 80) % 2 === 0;

      if (!flash) {
        ctx.save();
        ctx.translate(p.x, p.y);

        // Thruster exhaust flame
        ctx.fillStyle = overclockLeft > 0 ? '#f59e0b' : '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(p.width * 0.35, p.height);
        ctx.lineTo(p.width * 0.5, p.height + 12 + Math.random() * 8);
        ctx.lineTo(p.width * 0.65, p.height);
        ctx.closePath();
        ctx.fill();

        // Ship Body
        ctx.fillStyle = selectedChassis === 'firewall' ? '#059669' : selectedChassis === 'hyperion' ? '#d97706' : '#2563eb';
        ctx.beginPath();
        ctx.moveTo(p.width / 2, 0);
        ctx.lineTo(p.width, p.height - 4);
        ctx.lineTo(p.width * 0.7, p.height);
        ctx.lineTo(p.width * 0.3, p.height);
        ctx.lineTo(0, p.height - 4);
        ctx.closePath();
        ctx.fill();

        // Wings & Wingtips
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(0, p.height - 12, 6, 12);
        ctx.fillRect(p.width - 6, p.height - 12, 6, 12);

        // Cockpit
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(p.width / 2, p.height * 0.45, 6, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        // Deflector Shield Hexagon Bubble
        if (shieldHits > 0) {
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(p.width / 2, p.height / 2, p.width * 0.75, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();
      }

      ctx.restore(); // Restore shake translation

      requestRef.current = requestAnimationFrame(gameLoop);
    };

    requestRef.current = requestAnimationFrame(gameLoop);

    return () => {
      running = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, wave, overclockLeft, weaponType, weaponTimer, freezeTimer, shieldHits, autoFire, bossActive, combo, initWaveEnemies, playSoundEffect, selectedChassis]);

  // Handle Game Over / Save Score
  useEffect(() => {
    if (gameState === 'gameover' || gameState === 'victory') {
      if (score > highScore) {
        setHighScore(score);
        try {
          localStorage.setItem('arkedo_highscore_cyber_invaders', String(score));
        } catch {
          // Ignore
        }
      }
      updateStudentArcadeScore('cyber_invaders', score);
      onSaveScore?.(score);
      if (gameState === 'victory') {
        onAwardXP?.(150, 'Cyber Invaders Galaxy Victory!');
      }
    }
  }, [gameState, score, highScore, onSaveScore, onAwardXP]);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center select-none font-sans">
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between gap-3 mb-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title={lang === 'en' ? 'Back to Arcade Catalog' : 'Înapoi la Catalog'}
          >
            <ArrowLeft className="w-5 h-5 text-cyan-400" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                <span>Cyber Invaders: Galaxia Codului</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold uppercase">
                  {lang === 'en' ? 'SPACE RETRO 👾' : 'ARCADE RETRO 👾'}
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {lang === 'en'
                ? 'Defend the Motherboard data bus against waves of cyber bugs & Zero-Day bosses!'
                : 'Apără magistrala plăcii de bază împotriva viermilor troieni și boșilor Zero-Day!'}
            </p>
          </div>
        </div>

        {/* Action Controls & Sound */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled((s) => !s)}
            className={`p-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
              soundEnabled
                ? 'bg-slate-800 border-slate-700 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title={lang === 'en' ? 'Toggle Audio SFX' : 'Comută Sunetul'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setScanlines((s) => !s)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer hidden sm:flex items-center gap-1 ${
              scanlines
                ? 'bg-purple-950/70 border-purple-500/50 text-purple-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title={lang === 'en' ? 'Toggle CRT Retro Scanlines' : 'Comută Linii CRT Retro'}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>CRT</span>
          </button>
        </div>
      </div>

      {/* Main Game Frame Container */}
      <div className="relative w-full max-w-[800px] aspect-[4/3] max-h-[640px] rounded-3xl bg-slate-950 border-2 border-cyan-500/30 shadow-2xl overflow-hidden flex flex-col justify-between">
        {/* Optional CRT Scanlines Overlay */}
        {scanlines && (
          <div
            className="absolute inset-0 pointer-events-none z-20 opacity-15"
            style={{
              background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.7) 50%)',
              backgroundSize: '100% 4px'
            }}
          />
        )}

        {/* In-Game Live HUD (Visible while playing) */}
        {gameState === 'playing' && (
          <div className="absolute top-0 left-0 right-0 z-10 p-3 sm:p-4 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent flex items-center justify-between pointer-events-none">
            {/* Score & Wave */}
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">
                  {lang === 'en' ? 'SCORE' : 'SCOR'}
                </span>
                <span className="text-xl sm:text-2xl font-black text-white font-mono drop-shadow">
                  {score.toLocaleString()}
                </span>
              </div>
              <div className="border-l border-slate-800 pl-4">
                <span className="text-[10px] font-mono text-purple-400 uppercase font-bold block">
                  {lang === 'en' ? 'WAVE' : 'VAL'}
                </span>
                <span className="text-lg font-black text-amber-300 font-mono">
                  {wave} / 9
                </span>
              </div>
            </div>

            {/* Boss Bar (if active) */}
            {bossActive && (
              <div className="flex-1 max-w-xs mx-4 text-center">
                <span className="text-[10px] font-mono text-rose-400 font-black uppercase tracking-wider block truncate">
                  ⚠️ {bossName}
                </span>
                <div className="w-full h-3 rounded-full bg-slate-900 border border-rose-500/50 p-0.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-150"
                    style={{ width: `${(bossHealth / bossMaxHealth) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Lives & EMP Bombs */}
            <div className="flex items-center gap-3">
              {/* Overclock active */}
              {overclockLeft > 0 && (
                <div className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-400 text-amber-300 text-[10px] font-mono font-bold animate-pulse">
                  ⚡ 5.0 GHz ({Math.ceil(overclockLeft)}s)
                </div>
              )}
              {/* EMP Bombs stock */}
              <div className="flex items-center gap-1">
                {Array.from({ length: bombs }).map((_, i) => (
                  <span key={i} className="text-base" title="EMP Bomb (Press Space or B)">
                    💣
                  </span>
                ))}
              </div>
              {/* Hearts / Lives */}
              <div className="flex items-center gap-1">
                {Array.from({ length: lives }).map((_, i) => (
                  <span key={i} className="text-base text-rose-500">
                    ❤️
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2D HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-full object-contain cursor-crosshair"
          onMouseMove={(e) => {
            if (!mouseFollow || gameState !== 'playing') return;
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = ((e.clientX - rect.left) / rect.width) * 800;
            playerRef.current.x = Math.max(10, Math.min(800 - playerRef.current.width - 10, mouseX - playerRef.current.width / 2));
          }}
          onClick={() => {
            if (mouseFollow && gameState === 'playing') firePlayerLaser();
          }}
        />

        {/* OVERLAY: START MENU */}
        {gameState === 'menu' && (
          <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md p-6 flex flex-col items-center justify-between text-center animate-fadeIn">
            <div>
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono text-xs uppercase font-black tracking-widest inline-block mb-2">
                ArkyEdu Space Arcade 1980s
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white font-heading tracking-tight drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                CYBER INVADERS 🚀👾
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mt-2 leading-relaxed">
                {lang === 'en'
                  ? 'Defend the Motherboard! Blast descending malware swarms, collect RAM capacitors & answer terminal trivia for instant hyper overclock!'
                  : 'Apără magistrala plăcii de bază! Distruge valurile de viruși, colectează cipuri de memorie și răspunde la trivia TIC pentru viteză 5.0 GHz!'}
              </p>
            </div>

            {/* Ship Chassis Selection */}
            <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-mono text-slate-400 font-bold uppercase block mb-3">
                {lang === 'en' ? 'Select Your Ship Chassis:' : 'Alege Șasiul Navei:'}
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'quantum', name: 'Quantum Core ⚡', descRo: '+1 Bombă EMP', descEn: '+1 EMP Bomb', color: 'border-blue-500 bg-blue-950/40' },
                  { id: 'firewall', name: 'Firewall 🛡️', descRo: '+1 Viață & Scut', descEn: '+1 Life & Shield', color: 'border-emerald-500 bg-emerald-950/40' },
                  { id: 'hyperion', name: 'Hyperion 🚀', descRo: 'Tragere Rapidă', descEn: 'High Fire Rate', color: 'border-amber-500 bg-amber-950/40' }
                ].map((ship) => (
                  <button
                    key={ship.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setSelectedChassis(ship.id as ShipChassis);
                    }}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                      selectedChassis === ship.id
                        ? `${ship.color} ring-2 ring-cyan-400 font-black shadow-lg`
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold text-white block truncate">{ship.name}</span>
                    <span className="text-[10px] text-slate-300 block mt-1">{lang === 'en' ? ship.descEn : ship.descRo}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Launch Game Button */}
            <div className="flex flex-col items-center gap-2 w-full max-w-xs">
              <button
                type="button"
                onClick={handleStartGame}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-sm tracking-wider uppercase shadow-xl shadow-cyan-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{lang === 'en' ? 'Launch Mission 🚀' : 'Pornește Misiunea 🚀'}</span>
              </button>

              <span className="text-[11px] font-mono text-slate-400">
                {lang === 'en' ? 'Controls: A / D / Arrows or Drag Mouse' : 'Comenzi: Săgeți / A, D / Drag Mouse / Touch'}
              </span>
            </div>
          </div>
        )}

        {/* OVERLAY: MICRO-QUIZ TERMINAL (Educational Lightning Boost) */}
        {gameState === 'quiz' && activeQuiz && (
          <div className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center animate-fadeIn">
            <div className="max-w-md w-full bg-slate-900 border-2 border-amber-400/60 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />

              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-black uppercase tracking-wider inline-block mb-3 border border-amber-500/40">
                ⚡ {lang === 'en' ? 'OVERCLOCK TERMINAL TRIVIA (+500 PTS)' : 'TERMINAL OVERCLOCK TRIVIA (+500 PTS)'}
              </span>

              <h3 className="text-base sm:text-lg font-black text-white leading-snug mb-5">
                {lang === 'en' ? activeQuiz.questionEn : activeQuiz.questionRo}
              </h3>

              <div className="space-y-2.5 mb-4">
                {activeQuiz.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAnswerQuiz(opt.isCorrect)}
                    disabled={quizResult !== null}
                    className={`w-full py-3 px-4 rounded-xl border text-sm font-bold text-left transition flex items-center justify-between cursor-pointer ${
                      quizResult === null
                        ? 'bg-slate-950 border-slate-800 text-white hover:border-amber-400 hover:bg-slate-800'
                        : opt.isCorrect
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-500/40 text-rose-300 opacity-60'
                    }`}
                  >
                    <span>{lang === 'en' ? opt.labelEn : opt.labelRo}</span>
                    {quizResult !== null && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                ))}
              </div>

              {quizResult === 'correct' && (
                <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-bold animate-bounce">
                  ✨ {lang === 'en' ? 'CORRECT! SUPER OVERCLOCK 5.0 GHz ACTIVATED!' : 'CORECT! SUPER OVERCLOCK 5.0 GHz ACTIVAT!'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* OVERLAY: GAME OVER */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center animate-fadeIn">
            <div className="max-w-md w-full bg-slate-900 border-2 border-rose-500/50 rounded-3xl p-6 shadow-2xl">
              <span className="text-4xl block mb-2">💥</span>
              <h2 className="text-2xl sm:text-3xl font-black text-rose-400 font-heading">
                {lang === 'en' ? 'SYSTEM OVERHEAT - GAME OVER' : 'SISTEM COMPROMIS - GAME OVER'}
              </h2>
              <p className="text-xs text-slate-300 mt-1 mb-5">
                {lang === 'en'
                  ? 'The cyber bugs breached the motherboard socket. Reboot defense protocols!'
                  : 'Virușii au penetrat magistrala plăcii de bază. Repornește protocoalele de apărare!'}
              </p>

              {/* Stats Box */}
              <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">{lang === 'en' ? 'Final Score:' : 'Scor Final:'}</span>
                  <span className="text-lg font-black text-white block">{score.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">{lang === 'en' ? 'High Score:' : 'Recordul Tău:'}</span>
                  <span className="text-lg font-black text-amber-400 block">{Math.max(score, highScore).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">{lang === 'en' ? 'Wave Reached:' : 'Val Atins:'}</span>
                  <span className="text-sm font-bold text-cyan-300 block">{wave} / 9</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">{lang === 'en' ? 'Bugs Neutralized:' : 'Viruși Eliminați:'}</span>
                  <span className="text-sm font-bold text-emerald-400 block">{totalKills}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleStartGame}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider transition active:scale-95 cursor-pointer shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Play Again' : 'Reîncearcă'}</span>
                </button>
                <button
                  type="button"
                  onClick={onBack}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition cursor-pointer"
                >
                  {lang === 'en' ? 'Arcade Hub' : 'Catalog Arcade'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* OVERLAY: VICTORY (Beat All 9 Waves) */}
        {gameState === 'victory' && (
          <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center animate-fadeIn">
            <div className="max-w-md w-full bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 shadow-2xl">
              <span className="text-5xl block mb-2 animate-bounce">🏆</span>
              <h2 className="text-2xl sm:text-3xl font-black text-emerald-400 font-heading">
                {lang === 'en' ? 'MOTHERBOARD SAVED! VICTORY!' : 'PLACA DE BAZĂ CURĂȚATĂ! VICTORIE!'}
              </h2>
              <p className="text-xs text-slate-300 mt-1 mb-5">
                {lang === 'en'
                  ? 'All 9 waves and the Quantum Kernel Overlord have been defeated. Elite Defender rank achieved!'
                  : 'Toate cele 9 valuri și Overlordul Kernel au fost neutralizate. Rangul de Arhitect Defensiv atins!'}
              </p>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center font-mono mb-6">
                <span className="text-[10px] text-slate-400 uppercase">{lang === 'en' ? 'Final Score:' : 'Scor de Campion:'}</span>
                <span className="text-3xl font-black text-amber-300 block">{score.toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleStartGame}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs uppercase tracking-wider transition active:scale-95 cursor-pointer shadow-lg"
                >
                  {lang === 'en' ? 'Play Again 🚀' : 'Joacă din Nou 🚀'}
                </button>
                <button
                  type="button"
                  onClick={onBack}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  {lang === 'en' ? 'Exit' : 'Ieșire'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Touch Arcade Controls for Mobile / Tablets */}
      <div className="w-full max-w-[800px] mt-4 flex items-center justify-between gap-3 p-3 bg-slate-900/90 border border-slate-800 rounded-2xl">
        {/* Virtual Directional Pad */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onPointerDown={() => { touchLeftRef.current = true; }}
            onPointerUp={() => { touchLeftRef.current = false; }}
            onPointerLeave={() => { touchLeftRef.current = false; }}
            className="w-14 h-14 rounded-2xl bg-slate-800 active:bg-cyan-600 border border-slate-700 active:border-cyan-400 text-white flex items-center justify-center text-xl font-bold shadow-lg touch-none"
            aria-label="Left"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button
            type="button"
            onPointerDown={() => { touchRightRef.current = true; }}
            onPointerUp={() => { touchRightRef.current = false; }}
            onPointerLeave={() => { touchRightRef.current = false; }}
            className="w-14 h-14 rounded-2xl bg-slate-800 active:bg-cyan-600 border border-slate-700 active:border-cyan-400 text-white flex items-center justify-center text-xl font-bold shadow-lg touch-none"
            aria-label="Right"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>

        {/* Center Control Toggles */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAutoFire((a) => !a)}
            className={`px-3 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              autoFire
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'en' ? 'Auto-Fire' : 'Foc Automat'}</span>
          </button>
          <button
            type="button"
            onClick={() => setMouseFollow((m) => !m)}
            className={`px-3 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer hidden sm:flex ${
              mouseFollow
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Mouse</span>
          </button>
        </div>

        {/* Action Buttons: Fire & EMP Bomb */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTriggerBomb}
            disabled={bombs <= 0}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 to-red-700 active:scale-95 disabled:opacity-40 text-white flex flex-col items-center justify-center text-xs font-black shadow-lg shadow-rose-600/30 cursor-pointer"
            title="Launch EMP Bomb (Space / B)"
          >
            <Bomb className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] font-mono">EMP ({bombs})</span>
          </button>
          <button
            type="button"
            onPointerDown={() => {
              touchFireRef.current = true;
              firePlayerLaser();
            }}
            onPointerUp={() => { touchFireRef.current = false; }}
            onPointerLeave={() => { touchFireRef.current = false; }}
            className="w-16 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 active:from-cyan-400 active:to-blue-500 text-white flex flex-col items-center justify-center text-xs font-black shadow-lg shadow-cyan-500/30 touch-none active:scale-95"
          >
            <Flame className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] uppercase tracking-wider">{lang === 'en' ? 'FIRE' : 'TRAGE'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
