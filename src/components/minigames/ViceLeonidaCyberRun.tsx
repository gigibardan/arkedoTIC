import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Trophy,
  RotateCcw,
  Play,
  Pause,
  Zap,
  Shield,
  Sparkles,
  Heart,
  Flame,
  Cpu,
  Radio,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Users,
  Lock,
  Unlock,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { forceScrollToTop } from '../../utils/scrollHelper';
import { getActiveStudent, updateStudentArcadeScore } from '../../lib/studentAuthService';
import { sounds } from '../../utils/audio';

export interface ViceLeonidaCyberRunProps {
  onBack: () => void;
  studentName?: string;
  studentAvatar?: string;
  onAwardXP?: (amount: number, reason: string) => void;
  onSaveScore?: (score: number) => void;
}

type GameState = 'menu' | 'playing' | 'paused' | 'hack' | 'gameover';
type HeroId = 'lucia' | 'jason';

interface SectorDef {
  id: string;
  nameRo: string;
  nameEn: string;
  subtitleRo: string;
  subtitleEn: string;
  skyTop: string;
  skyBottom: string;
  roadBg: string;
  stripeColor: string;
  neonLeft: string;
  neonRight: string;
  isWater?: boolean;
  minDist: number;
}

const SECTORS: SectorDef[] = [
  {
    id: 'vice_beach',
    nameRo: 'Vice Beach Neon Strip',
    nameEn: 'Vice Beach Neon Strip',
    subtitleRo: 'Sector 1 · Bulevardul Ocean Drive & Palmieri Cyber',
    subtitleEn: 'Sector 1 · Ocean Drive Strip & Neon Palms',
    skyTop: '#1e1b4b',
    skyBottom: '#be185d',
    roadBg: '#0f172a',
    stripeColor: '#f472b6',
    neonLeft: '#ec4899',
    neonRight: '#22d3ee',
    minDist: 0,
  },
  {
    id: 'venetian_causeway',
    nameRo: 'Podul Venetian Causeway',
    nameEn: 'Venetian Causeway Bridge',
    subtitleRo: 'Sector 2 · Traversare Peste Golful Leonida',
    subtitleEn: 'Sector 2 · Leonida Bay High-Speed Causeway',
    skyTop: '#0f172a',
    skyBottom: '#0284c7',
    roadBg: '#1e293b',
    stripeColor: '#38bdf8',
    neonLeft: '#38bdf8',
    neonRight: '#f59e0b',
    minDist: 900,
  },
  {
    id: 'port_gellhorn',
    nameRo: 'Port Gellhorn Cyber Docks',
    nameEn: 'Port Gellhorn Cyber Docks',
    subtitleRo: 'Sector 3 · Terminale Cargo & Scannere Laser',
    subtitleEn: 'Sector 3 · Cargo Terminals & Laser Scanners',
    skyTop: '#18181b',
    skyBottom: '#ea580c',
    roadBg: '#111827',
    stripeColor: '#fb923c',
    neonLeft: '#f97316',
    neonRight: '#a855f7',
    minDist: 2000,
  },
  {
    id: 'grassrivers',
    nameRo: 'Mlaștinile Grassrivers (Airboat)',
    nameEn: 'Grassrivers Digital Swamp (Airboat)',
    subtitleRo: 'Sector 4 · Mod Hydro-Airboat pe Canale Criptate',
    subtitleEn: 'Sector 4 · Cyber Airboat Mode on Encrypted Canals',
    skyTop: '#022c22',
    skyBottom: '#0d9488',
    roadBg: '#064e3b',
    stripeColor: '#34d399',
    neonLeft: '#10b981',
    neonRight: '#facc15',
    isWater: true,
    minDist: 3200,
  },
];

interface RoadEntity {
  id: number;
  kind: 'traffic' | 'drone' | 'scanner' | 'shard' | 'nitro' | 'shield' | 'vault';
  lane: number; // 0..3 continuous or discrete
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
  color: string;
  label?: string;
  swayPhase?: number;
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

interface HackPuzzle {
  kind: 'binary' | 'choice';
  promptRo: string;
  promptEn: string;
  targetDecimal?: number;
  bitCount?: number;
  options?: Array<{ label: string; correct: boolean }>;
  hintRo: string;
  hintEn: string;
}

const CHOICE_PUZZLES: HackPuzzle[] = [
  {
    kind: 'choice',
    promptRo: 'Firewall Port: Pe ce port standard circulă traficul HTTPS criptat?',
    promptEn: 'Firewall Port: Which standard port carries encrypted HTTPS traffic?',
    options: [
      { label: 'Port 443 (SSL/TLS)', correct: true },
      { label: 'Port 21 (FTP)', correct: false },
      { label: 'Port 80 (HTTP)', correct: false },
      { label: 'Port 25 (SMTP)', correct: false },
    ],
    hintRo: 'HTTP folosește 80, iar HTTPS securizat folosește 443.',
    hintEn: 'Plain HTTP uses 80, while encrypted HTTPS uses 443.',
  },
  {
    kind: 'choice',
    promptRo: 'Poartă Logică: Ce returnează (1 AND 0) OR (1 XOR 0)?',
    promptEn: 'Logic Gate: What does (1 AND 0) OR (1 XOR 0) evaluate to?',
    options: [
      { label: '1 (HIGH / TRUE)', correct: true },
      { label: '0 (LOW / FALSE)', correct: false },
      { label: '2 (OVERFLOW)', correct: false },
      { label: '-1 (ERROR)', correct: false },
    ],
    hintRo: '1 AND 0 = 0, dar 1 XOR 0 = 1. Apoi 0 OR 1 = 1!',
    hintEn: '1 AND 0 = 0, while 1 XOR 0 = 1. Then 0 OR 1 = 1!',
  },
  {
    kind: 'choice',
    promptRo: 'Algoritm C++: Ce afișează `cout << (27 % 10);` ?',
    promptEn: 'C++ Algorithm: What does `cout << (27 % 10);` output?',
    options: [
      { label: '7 (ultima cifră)', correct: true },
      { label: '2 (prima cifră)', correct: false },
      { label: '2.7', correct: false },
      { label: '17', correct: false },
    ],
    hintRo: 'Operatorul modulo (%) returnează restul împărțirii la 10.',
    hintEn: 'The modulo operator (%) returns the remainder after dividing by 10.',
  },
  {
    kind: 'choice',
    promptRo: 'Rețele & DNS: Ce rol are serverul DNS când accesezi `arkyedu.com`?',
    promptEn: 'Networks & DNS: What does DNS do when you visit `arkyedu.com`?',
    options: [
      { label: 'Traduce numele de domeniu în adresă IP', correct: true },
      { label: 'Mărește memoria RAM a calculatorului', correct: false },
      { label: 'Formatează documentul în format .pdf', correct: false },
      { label: 'Șterge istoricul din browser', correct: false },
    ],
    hintRo: 'DNS este „agenda telefonică” a Internetului (Domeniu -> IP).',
    hintEn: 'DNS is the Internet phonebook translating domains into IP addresses.',
  },
  {
    kind: 'choice',
    promptRo: 'Securitate: Ce extensie de fișier ascunde adesea malware executabil?',
    promptEn: 'Security: Which file extension can run executable code/malware?',
    options: [
      { label: '.exe', correct: true },
      { label: '.txt', correct: false },
      { label: '.png', correct: false },
      { label: '.mp3', correct: false },
    ],
    hintRo: 'Fișierele .exe conțin instrucțiuni executabile directe.',
    hintEn: '.exe files contain directly executable program instructions.',
  },
];

function createRandomPuzzle(): HackPuzzle {
  if (Math.random() < 0.52) {
    const bitCount = 4;
    const target = 3 + Math.floor(Math.random() * 13); // 3..15
    return {
      kind: 'binary',
      bitCount,
      targetDecimal: target,
      promptRo: `Decriptare Binară Leonida: Formează numărul zecimal ${target} pe 4 biți!`,
      promptEn: `Leonida Binary Decryption: Build decimal value ${target} using 4 bits!`,
      hintRo: 'Adună valorile biților activați (8 + 4 + 2 + 1).',
      hintEn: 'Sum the active bit weights (8 + 4 + 2 + 1).',
    };
  }
  const base = CHOICE_PUZZLES[Math.floor(Math.random() * CHOICE_PUZZLES.length)];
  return {
    ...base,
    options: base.options ? [...base.options].sort(() => Math.random() - 0.5) : [],
  };
}

const CANVAS_W = 560;
const CANVAS_H = 420;
const ROAD_LEFT = 88;
const ROAD_WIDTH = 384;
const LANE_COUNT = 4;
const LANE_W = ROAD_WIDTH / LANE_COUNT;

export const ViceLeonidaCyberRun: React.FC<ViceLeonidaCyberRunProps> = ({
  onBack,
  studentName,
  onAwardXP,
  onSaveScore,
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [gameState, setGameState] = useState<GameState>('menu');
  const [hero, setHero] = useState<HeroId>('lucia');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const local = Number(localStorage.getItem('arkedo_highscore_vice_leonida') || '0');
      const active = getActiveStudent();
      const cloud = active?.arcadeScores?.vice_leonida || 0;
      return Math.max(local, cloud);
    } catch {
      return 0;
    }
  });
  const [hull, setHull] = useState(3);
  const [heatStars, setHeatStars] = useState(1);
  const [nitroPct, setNitroPct] = useState(100);
  const [empPct, setEmpPct] = useState(100);
  const [sectorIndex, setSectorIndex] = useState(0);
  const [distanceM, setDistanceM] = useState(0);
  const [vaultsCracked, setVaultsCracked] = useState(0);
  const [muted, setMuted] = useState(false);
  const [netFeed, setNetFeed] = useState<string>(
    isEn
      ? '@ViceBeach_Live: Lucia & Jason linked to Leonida Fiber Grid. Ready for upload!'
      : '@ViceBeach_Live: Lucia și Jason s-au conectat la rețeaua Leonida. Pregătiți de cursă!'
  );

  // Hack Overlay State
  const [activePuzzle, setActivePuzzle] = useState<HackPuzzle | null>(null);
  const [binaryBits, setBinaryBits] = useState<number[]>([0, 0, 0, 0]);
  const [hackTimer, setHackTimer] = useState(10);
  const [hackFeedback, setHackFeedback] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const heroRef = useRef<HeroId>(hero);
  useEffect(() => {
    heroRef.current = hero;
  }, [hero]);

  const mutedRef = useRef(muted);
  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  // Mutable 60fps simulation refs
  const playerRef = useRef({
    x: CANVAS_W / 2,
    y: CANVAS_H - 96,
    vx: 0,
    speed: 6.2,
    nitro: 100,
    nitroActive: false,
    empCharge: 100,
    invulnTimer: 0,
    jasonShieldTimer: 0,
    jasonShieldReady: true,
    tilt: 0,
  });

  const simRef = useRef({
    score: 0,
    highScore: 0,
    hull: 3,
    heat: 1.0,
    distance: 0,
    sectorIdx: 0,
    vaultsCracked: 0,
    roadOffset: 0,
    spawnTimer: 0,
    shardTimer: 0,
    vaultTimer: 320,
    shake: 0,
    nextId: 1,
    streakMultiplier: 1,
    empWaveRadius: 0,
  });

  const entitiesRef = useRef<RoadEntity[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const textsRef = useRef<FloatingText[]>([]);

  const inputRef = useRef({
    left: false,
    right: false,
    up: false,
    down: false,
    nitro: false,
    pointerX: CANVAS_W / 2,
    pointerY: CANVAS_H - 96,
    pointerActive: false,
  });

  useEffect(() => {
    forceScrollToTop();
    simRef.current.highScore = highScore;
  }, [highScore]);

  // Synth FX
  const playSynth = useCallback(
    (freq: number, dur = 0.09, type: OscillatorType = 'triangle', vol = 0.08, endFreq?: number) => {
      if (mutedRef.current) return;
      try {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return;
        if (!audioCtxRef.current) audioCtxRef.current = new Ctx();
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume().catch(() => {});
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        if (endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), ctx.currentTime + dur);
        g.gain.setValueAtTime(vol, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + dur);
      } catch {
        // ignore audio restriction
      }
    },
    []
  );

  const pushFeed = useCallback((msgRo: string, msgEn: string) => {
    setNetFeed(isEn ? msgEn : msgRo);
  }, [isEn]);

  const addFloatingText = (text: string, x: number, y: number, color: string) => {
    textsRef.current.push({ text, x, y, color, alpha: 1 });
  };

  const spawnParticles = (x: number, y: number, color: string, count = 14) => {
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
        life: 18 + Math.random() * 14,
        maxLife: 32,
      });
    }
  };

  const persistScore = useCallback(
    (finalScore: number, awardBonus = false) => {
      if (finalScore > simRef.current.highScore) {
        simRef.current.highScore = finalScore;
        setHighScore(finalScore);
        try {
          localStorage.setItem('arkedo_highscore_vice_leonida', String(finalScore));
        } catch {
          // ignore
        }
      }
      if (finalScore > 0) {
        updateStudentArcadeScore('vice_leonida', finalScore);
        onSaveScore?.(finalScore);
      }
      if (awardBonus) {
        onAwardXP?.(150, 'Vice Leonida VI Cyber Run Mastery!');
      }
    },
    [onAwardXP, onSaveScore]
  );

  const handleSwapHero = useCallback(() => {
    if (gameState !== 'playing') return;
    setHero((prev) => {
      const next: HeroId = prev === 'lucia' ? 'jason' : 'lucia';
      playSynth(next === 'lucia' ? 660 : 520, 0.12, 'sine', 0.08, next === 'lucia' ? 880 : 690);
      addFloatingText(
        next === 'lucia' ? 'LUCIA: HACKER NITRO' : 'JASON: EMP SHIELD',
        playerRef.current.x,
        playerRef.current.y - 24,
        next === 'lucia' ? '#f472b6' : '#fbbf24'
      );
      pushFeed(
        next === 'lucia'
          ? '@Leonida_Net: Lucia la volan! Regenerare Nitro +35% & Bonus ByteCoins!'
          : '@Leonida_Net: Jason la volan! Manevrabilitate maximă & Scut Kinetic activ!',
        next === 'lucia'
          ? '@Leonida_Net: Lucia took the wheel! +35% Nitro Regen & Shard Bonus!'
          : '@Leonida_Net: Jason took the wheel! Max Handling & Kinetic Auto-Shield active!'
      );
      return next;
    });
  }, [gameState, playSynth, pushFeed]);

  const triggerEmpBlast = useCallback(() => {
    if (gameState !== 'playing') return;
    const p = playerRef.current;
    if (p.empCharge < 100) return;
    p.empCharge = 0;
    setEmpPct(0);
    simRef.current.empWaveRadius = 18;
    simRef.current.shake = 10;
    playSynth(180, 0.35, 'sawtooth', 0.12, 620);

    let cleared = 0;
    entitiesRef.current = entitiesRef.current.filter((ent) => {
      if (ent.kind === 'traffic' || ent.kind === 'drone' || ent.kind === 'scanner') {
        spawnParticles(ent.x, ent.y, '#38bdf8', 12);
        cleared++;
        return false;
      }
      return true;
    });

    if (cleared > 0) {
      const bonus = cleared * 45;
      simRef.current.score += bonus;
      setScore(simRef.current.score);
      addFloatingText(`EMP CLEAR +${bonus}`, p.x, p.y - 30, '#38bdf8');
    } else {
      addFloatingText('EMP PULSE!', p.x, p.y - 30, '#38bdf8');
    }
    simRef.current.heat = Math.max(1, simRef.current.heat - 0.8);
    setHeatStars(Math.min(5, Math.max(1, Math.floor(simRef.current.heat))));
    pushFeed(
      `@VCPD_Grid: Impuls EMP detectat pe autostradă! ${cleared} unități dezactivate!`,
      `@VCPD_Grid: Highway EMP Shockwave! ${cleared} patrol units disabled!`
    );
  }, [gameState, playSynth, pushFeed]);

  const openVaultHack = useCallback(() => {
    const puzzle = createRandomPuzzle();
    setActivePuzzle(puzzle);
    setBinaryBits([0, 0, 0, 0]);
    setHackTimer(heroRef.current === 'lucia' ? 12 : 9);
    setHackFeedback(null);
    setGameState('hack');
    playSynth(540, 0.14, 'triangle', 0.08, 860);
  }, [playSynth]);

  const resolveHackSuccess = useCallback(() => {
    const bonus = heroRef.current === 'lucia' ? 500 : 380;
    simRef.current.score += bonus;
    simRef.current.vaultsCracked += 1;
    simRef.current.heat = Math.max(1, simRef.current.heat - 2.0);
    playerRef.current.nitro = 100;
    playerRef.current.empCharge = Math.min(100, playerRef.current.empCharge + 50);
    playerRef.current.invulnTimer = 95;
    setScore(simRef.current.score);
    setVaultsCracked(simRef.current.vaultsCracked);
    setHeatStars(Math.min(5, Math.max(1, Math.floor(simRef.current.heat))));
    setNitroPct(100);
    setEmpPct(Math.round(playerRef.current.empCharge));
    playSynth(660, 0.2, 'triangle', 0.1, 1080);

    // Clear close hazards around player on resume
    entitiesRef.current = entitiesRef.current.filter(
      (e) => e.kind === 'shard' || e.kind === 'nitro' || e.kind === 'shield' || Math.abs(e.y - playerRef.current.y) > 150
    );

    setActivePuzzle(null);
    setGameState('playing');
    addFloatingText(`VAULT +${bonus}!`, playerRef.current.x, playerRef.current.y - 32, '#34d399');
    pushFeed(
      `@Leonida_Net: Nodul Relay decriptat! +${bonus} pts & Heat redus cu -2★!`,
      `@Leonida_Net: Relay Vault decrypted! +${bonus} pts & Wanted Heat -2★!`
    );
  }, [playSynth, pushFeed]);

  const resolveHackFail = useCallback(() => {
    simRef.current.heat = Math.min(5.9, simRef.current.heat + 1.0);
    setHeatStars(Math.min(5, Math.floor(simRef.current.heat)));
    playerRef.current.invulnTimer = 60;
    playSynth(180, 0.22, 'sawtooth', 0.09, 95);
    setActivePuzzle(null);
    setGameState('playing');
    pushFeed(
      '@VCPD_Alert: Tentativă de decriptare blocată! Nivelul Heat a crescut!',
      '@VCPD_Alert: Decryption trace detected! Cyber-Patrol Heat increased!'
    );
  }, [playSynth, pushFeed]);

  // Hack countdown timer
  useEffect(() => {
    if (gameState !== 'hack') return;
    const t = setInterval(() => {
      setHackTimer((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          resolveHackFail();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [gameState, resolveHackFail]);

  const handleStartNewGame = (startHero: HeroId = hero) => {
    sounds.playClick();
    forceScrollToTop();
    setHero(startHero);
    heroRef.current = startHero;

    playerRef.current = {
      x: CANVAS_W / 2,
      y: CANVAS_H - 96,
      vx: 0,
      speed: 6.4,
      nitro: 100,
      nitroActive: false,
      empCharge: 100,
      invulnTimer: 90,
      jasonShieldTimer: 0,
      jasonShieldReady: true,
      tilt: 0,
    };
    inputRef.current = {
      left: false,
      right: false,
      up: false,
      down: false,
      nitro: false,
      pointerX: CANVAS_W / 2,
      pointerY: CANVAS_H - 96,
      pointerActive: false,
    };
    simRef.current = {
      score: 0,
      highScore,
      hull: 3,
      heat: 1.0,
      distance: 0,
      sectorIdx: 0,
      vaultsCracked: 0,
      roadOffset: 0,
      spawnTimer: 20,
      shardTimer: 10,
      vaultTimer: 360,
      shake: 0,
      nextId: 1,
      streakMultiplier: 1,
      empWaveRadius: 0,
    };
    entitiesRef.current = [];
    particlesRef.current = [];
    textsRef.current = [];

    setScore(0);
    setHull(3);
    setHeatStars(1);
    setNitroPct(100);
    setEmpPct(100);
    setSectorIndex(0);
    setDistanceM(0);
    setVaultsCracked(0);
    setActivePuzzle(null);
    setGameState('playing');
    pushFeed(
      '@ViceBeach_Live: Misiunea Leonida a pornit! Colectează Data Shards și sparge Relay Vaults!',
      '@ViceBeach_Live: Leonida Run live! Grab Data Shards and crack Relay Vaults!'
    );
    playSynth(440, 0.14, 'triangle', 0.08, 720);
  };

  // Keyboard Listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P') {
        setGameState((prev) => (prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev));
        return;
      }
      if (e.key === 'q' || e.key === 'Q') {
        handleSwapHero();
        return;
      }
      if (e.key === 'e' || e.key === 'E') {
        triggerEmpBlast();
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') inputRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') inputRef.current.right = true;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') inputRef.current.up = true;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') inputRef.current.down = true;
      if (e.key === ' ' || e.key === 'Shift') {
        if (gameState === 'playing') e.preventDefault();
        inputRef.current.nitro = true;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') inputRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') inputRef.current.right = false;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') inputRef.current.up = false;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') inputRef.current.down = false;
      if (e.key === ' ' || e.key === 'Shift') inputRef.current.nitro = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [gameState, handleSwapHero, triggerEmpBlast]);

  // Canvas Pointer Drag Steer (2D: Horizontal + Vertical)
  const updatePointerSteer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    inputRef.current.pointerX = ((e.clientX - rect.left) / rect.width) * CANVAS_W;
    inputRef.current.pointerY = ((e.clientY - rect.top) / rect.height) * CANVAS_H;
  };

  // Main 60 FPS Canvas Loop
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
    let hudTick = 0;

    const triggerDamage = () => {
      const p = playerRef.current;
      if (p.invulnTimer > 0) return;

      // Jason's Kinetic Auto-Shield passive absorbs 1 crash every 20s
      if (heroRef.current === 'jason' && p.jasonShieldReady) {
        p.jasonShieldReady = false;
        p.jasonShieldTimer = 1200; // 20s recharge
        p.invulnTimer = 95;
        simRef.current.shake = 8;
        spawnParticles(p.x, p.y, '#fbbf24', 22);
        addFloatingText(isEn ? 'JASON SHIELD SAVED!' : 'SCUT JASON ACTIVAT!', p.x, p.y - 24, '#fbbf24');
        playSynth(480, 0.18, 'triangle', 0.1, 780);
        return;
      }

      playSynth(150, 0.25, 'sawtooth', 0.12, 70);
      simRef.current.shake = 14;
      simRef.current.hull -= 1;
      simRef.current.streakMultiplier = 1;
      setHull(simRef.current.hull);
      spawnParticles(p.x, p.y, '#f43f5e', 26);

      if (simRef.current.hull <= 0) {
        persistScore(simRef.current.score, simRef.current.vaultsCracked >= 2);
        setGameState('gameover');
        return;
      }
      p.invulnTimer = 110;
    };

    const loop = (now: number) => {
      const rawDt = (now - lastTime) / 16.6667;
      lastTime = now;
      const dt = Math.min(2.0, Math.max(0.4, rawDt));

      const p = playerRef.current;
      const sim = simRef.current;
      const isLucia = heroRef.current === 'lucia';
      const sector = SECTORS[sim.sectorIdx % SECTORS.length];

      // 1. Hero & Nitro Physics
      const wantNitro = inputRef.current.nitro && p.nitro > 4;
      p.nitroActive = wantNitro;
      if (wantNitro) {
        p.nitro = Math.max(0, p.nitro - 0.9 * dt);
      } else {
        const regen = isLucia ? 0.32 : 0.21;
        p.nitro = Math.min(100, p.nitro + regen * dt);
      }

      if (!p.jasonShieldReady) {
        p.jasonShieldTimer -= dt;
        if (p.jasonShieldTimer <= 0) {
          p.jasonShieldReady = true;
        }
      }

      p.empCharge = Math.min(100, p.empCharge + 0.085 * dt);
      if (p.invulnTimer > 0) p.invulnTimer = Math.max(0, p.invulnTimer - dt);
      if (sim.shake > 0) sim.shake = Math.max(0, sim.shake - 0.65 * dt);
      if (sim.empWaveRadius > 0) {
        sim.empWaveRadius += 14 * dt;
        if (sim.empWaveRadius > 520) sim.empWaveRadius = 0;
      }

      const heatStarsNow = Math.min(5, Math.max(1, Math.floor(sim.heat)));
      const pointerUp = inputRef.current.pointerActive && inputRef.current.pointerY < p.y - 18;
      const pointerDown = inputRef.current.pointerActive && inputRef.current.pointerY > p.y + 18;
      const targetSpeed =
        (wantNitro
          ? 10.2
          : inputRef.current.up || pointerUp
          ? 7.6
          : inputRef.current.down || pointerDown
          ? 4.4
          : 6.2) +
        heatStarsNow * 0.38;
      p.speed += (targetSpeed - p.speed) * 0.1 * dt;

      // Steering (Keyboard + Touch Pointer)
      const lateralCap = isLucia ? 6.4 : 7.4;
      if (inputRef.current.left) {
        p.vx = Math.max(-lateralCap, p.vx - 1.15 * dt);
      } else if (inputRef.current.right) {
        p.vx = Math.min(lateralCap, p.vx + 1.15 * dt);
      } else if (inputRef.current.pointerActive) {
        const diff = inputRef.current.pointerX - p.x;
        p.vx = Math.max(-lateralCap, Math.min(lateralCap, diff * 0.22));
      } else {
        p.vx *= 0.78;
      }

      p.x += p.vx * dt;
      p.x = Math.max(ROAD_LEFT + 22, Math.min(ROAD_LEFT + ROAD_WIDTH - 22, p.x));
      p.tilt = p.vx * 0.045;

      // Vertical mobility (Keyboard + 4-way Touch + Canvas Touch Drag)
      if (inputRef.current.up) {
        p.y = Math.max(200, p.y - 2.6 * dt);
      } else if (inputRef.current.down) {
        p.y = Math.min(CANVAS_H - 48, p.y + 2.6 * dt);
      } else if (inputRef.current.pointerActive) {
        const targetY = Math.max(200, Math.min(CANVAS_H - 48, inputRef.current.pointerY));
        p.y += (targetY - p.y) * 0.16 * dt;
      } else {
        p.y += (CANVAS_H - 96 - p.y) * 0.06 * dt;
      }

      // Distance & Sector Progression
      sim.roadOffset = (sim.roadOffset + p.speed * dt) % 64;
      sim.distance += p.speed * 0.45 * dt;
      const loopCycle = Math.floor(sim.distance / 4400);
      const localDist = sim.distance % 4400;
      let nextSectorIdx = 0;
      for (let i = SECTORS.length - 1; i >= 0; i--) {
        if (localDist >= SECTORS[i].minDist) {
          nextSectorIdx = i;
          break;
        }
      }
      if (nextSectorIdx !== sim.sectorIdx) {
        sim.sectorIdx = nextSectorIdx;
        setSectorIndex(nextSectorIdx);
        const sObj = SECTORS[nextSectorIdx];
        addFloatingText(isEn ? sObj.nameEn.toUpperCase() : sObj.nameRo.toUpperCase(), CANVAS_W / 2, 130, sObj.neonRight);
        pushFeed(
          `@Leonida_Nav: Intrare în ${sObj.nameRo}! ${sObj.isWater ? 'Activare mod Cyber Airboat!' : 'Trafic intens înainte!'}`,
          `@Leonida_Nav: Entering ${sObj.nameEn}! ${sObj.isWater ? 'Cyber Airboat mode engaged!' : 'Watch the neon grid!'}`
        );
        playSynth(580, 0.16, 'sine', 0.09, 920);
      }

      // Passive Heat Build + Distance Score
      sim.heat = Math.min(5.9, sim.heat + (isLucia ? 0.0012 : 0.0018) * dt * (wantNitro ? 1.8 : 1));
      if (Math.random() < 0.25) {
        sim.score += Math.round(p.speed * (0.28 + loopCycle * 0.1));
      }

      // Nitro exhaust trail
      if (wantNitro && Math.random() < 0.8) {
        particlesRef.current.push({
          x: p.x + (Math.random() - 0.5) * 14,
          y: p.y + 26,
          vx: (Math.random() - 0.5) * 1.2,
          vy: 3.5 + Math.random() * 2,
          size: 3 + Math.random() * 2,
          color: isLucia ? '#f472b6' : '#38bdf8',
          life: 14,
          maxLife: 14,
        });
      }

      // 2. Spawning Traffic, Cyber-Patrol Drones, Scanners, Data Shards & Relay Vaults
      sim.spawnTimer -= dt;
      if (sim.spawnTimer <= 0) {
        const lane = Math.floor(Math.random() * LANE_COUNT);
        const laneCenter = ROAD_LEFT + lane * LANE_W + LANE_W / 2;
        const roll = Math.random();
        if (heatStarsNow >= 2 && roll < 0.28 + heatStarsNow * 0.05) {
          // Cyber-Patrol Drone or Gator Drone in water
          entitiesRef.current.push({
            id: sim.nextId++,
            kind: 'drone',
            lane,
            x: laneCenter,
            y: -44,
            w: 36,
            h: 44,
            speed: p.speed * 0.72 + 1.2,
            color: sector.isWater ? '#10b981' : '#f43f5e',
            swayPhase: Math.random() * Math.PI * 2,
          });
        } else if (roll < 0.42 && heatStarsNow >= 2) {
          // Laser Scanner Gate across 1.5 lanes
          entitiesRef.current.push({
            id: sim.nextId++,
            kind: 'scanner',
            lane,
            x: laneCenter,
            y: -26,
            w: LANE_W * 0.85,
            h: 16,
            speed: p.speed,
            color: '#ef4444',
          });
        } else {
          // Neon Civilian / Cargo Cruiser
          const carColors = ['#38bdf8', '#a855f7', '#fb923c', '#94a3b8'];
          entitiesRef.current.push({
            id: sim.nextId++,
            kind: 'traffic',
            lane,
            x: laneCenter,
            y: -60,
            w: 34,
            h: 56,
            speed: p.speed - (2.0 + Math.random() * 1.8),
            color: carColors[Math.floor(Math.random() * carColors.length)],
          });
        }
        sim.spawnTimer = Math.max(19, 44 - heatStarsNow * 4 - loopCycle * 3);
      }

      sim.shardTimer -= dt;
      if (sim.shardTimer <= 0) {
        const lane = Math.floor(Math.random() * LANE_COUNT);
        const laneCenter = ROAD_LEFT + lane * LANE_W + LANE_W / 2;
        const pRoll = Math.random();
        const kind: RoadEntity['kind'] = pRoll < 0.1 ? 'shield' : pRoll < 0.24 ? 'nitro' : 'shard';
        const shardLabels = ['0xFF', '8-BIT', 'SSD', 'RAM', 'CPU'];
        entitiesRef.current.push({
          id: sim.nextId++,
          kind,
          lane,
          x: laneCenter,
          y: -24,
          w: 26,
          h: 26,
          speed: p.speed * 0.92,
          color: kind === 'shield' ? '#34d399' : kind === 'nitro' ? '#38bdf8' : '#fbbf24',
          label: kind === 'shard' ? shardLabels[Math.floor(Math.random() * shardLabels.length)] : undefined,
        });
        sim.shardTimer = 28 + Math.random() * 16;
      }

      sim.vaultTimer -= dt;
      if (sim.vaultTimer <= 0) {
        const lane = Math.floor(Math.random() * LANE_COUNT);
        entitiesRef.current.push({
          id: sim.nextId++,
          kind: 'vault',
          lane,
          x: ROAD_LEFT + lane * LANE_W + LANE_W / 2,
          y: -40,
          w: 58,
          h: 34,
          speed: p.speed * 0.85,
          color: '#c084fc',
        });
        sim.vaultTimer = 460;
      }

      // 3. Update Entities & Collisions
      const playerW = 32;
      const playerH = 54;
      const remaining: RoadEntity[] = [];

      for (const ent of entitiesRef.current) {
        ent.y += ent.speed * dt;
        if (ent.kind === 'drone' && ent.swayPhase !== undefined) {
          ent.swayPhase += 0.07 * dt;
          ent.x += Math.sin(ent.swayPhase) * 1.6 * dt;
          ent.x = Math.max(ROAD_LEFT + 20, Math.min(ROAD_LEFT + ROAD_WIDTH - 20, ent.x));
        }

        const hit =
          Math.abs(ent.x - p.x) < (ent.w + playerW) * 0.44 &&
          Math.abs(ent.y - p.y) < (ent.h + playerH) * 0.44;

        if (hit) {
          if (ent.kind === 'shard') {
            const pts = isLucia ? 90 : 70;
            sim.score += pts;
            p.empCharge = Math.min(100, p.empCharge + 7);
            spawnParticles(ent.x, ent.y, '#fbbf24', 10);
            addFloatingText(`+${pts}`, ent.x, ent.y - 10, '#fbbf24');
            playSynth(740, 0.06, 'sine', 0.06, 980);
            continue;
          }
          if (ent.kind === 'nitro') {
            p.nitro = Math.min(100, p.nitro + 45);
            sim.score += 50;
            spawnParticles(ent.x, ent.y, '#38bdf8', 12);
            addFloatingText('NITRO +45%', ent.x, ent.y - 10, '#38bdf8');
            playSynth(620, 0.1, 'triangle', 0.07, 940);
            continue;
          }
          if (ent.kind === 'shield') {
            sim.hull = Math.min(4, sim.hull + 1);
            setHull(sim.hull);
            spawnParticles(ent.x, ent.y, '#34d399', 14);
            addFloatingText('+1 HULL', ent.x, ent.y - 10, '#34d399');
            playSynth(520, 0.12, 'sine', 0.08, 780);
            continue;
          }
          if (ent.kind === 'vault') {
            // Trigger Interactive ICT Relay Hack!
            openVaultHack();
            continue;
          }
          // Hazard collision
          triggerDamage();
          spawnParticles(ent.x, ent.y, '#f43f5e', 16);
          continue;
        }

        if (ent.y < CANVAS_H + 80) {
          remaining.push(ent);
        }
      }
      entitiesRef.current = remaining;

      // Update Particles & Floating Texts
      particlesRef.current = particlesRef.current.filter((pt) => {
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.life -= dt;
        return pt.life > 0;
      });
      textsRef.current = textsRef.current.filter((ft) => {
        ft.y -= 1.05 * dt;
        ft.alpha -= 0.02 * dt;
        return ft.alpha > 0;
      });

      // Sync React HUD every ~10 frames
      hudTick++;
      if (hudTick % 10 === 0) {
        setScore(sim.score);
        setDistanceM(Math.floor(sim.distance));
        setHeatStars(heatStarsNow);
        setNitroPct(Math.round(p.nitro));
        setEmpPct(Math.round(p.empCharge));
        if (sim.score > sim.highScore) {
          sim.highScore = sim.score;
          setHighScore(sim.score);
        }
      }

      // ================= RENDER 60FPS NEON LEONIDA CANVAS =================
      ctx.save();
      if (sim.shake > 0) {
        ctx.translate((Math.random() - 0.5) * sim.shake, (Math.random() - 0.5) * sim.shake);
      }

      // Sky Horizon Band
      const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
      skyGrad.addColorStop(0, sector.skyTop);
      skyGrad.addColorStop(0.22, sector.skyBottom);
      skyGrad.addColorStop(0.24, '#020617');
      skyGrad.addColorStop(1, '#020617');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Side Landscapes (Ocean/Palms or Water Canals)
      ctx.fillStyle = sector.isWater ? '#022c22' : '#090d1a';
      ctx.fillRect(0, 0, ROAD_LEFT, CANVAS_H);
      ctx.fillRect(ROAD_LEFT + ROAD_WIDTH, 0, CANVAS_W - (ROAD_LEFT + ROAD_WIDTH), CANVAS_H);

      // Scrolling roadside palms / neon pylons
      for (let y = -64 + sim.roadOffset; y < CANVAS_H + 64; y += 64) {
        // Left neon posts / palms
        ctx.fillStyle = sector.neonLeft;
        ctx.fillRect(ROAD_LEFT - 14, y, 6, 22);
        // Palm / Canopy silhouette
        ctx.fillStyle = sector.isWater ? '#065f46' : '#311042';
        ctx.beginPath();
        ctx.arc(38, y + 12, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = sector.neonLeft;
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.arc(38, y + 12, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Right neon posts / pylons
        ctx.fillStyle = sector.neonRight;
        ctx.fillRect(ROAD_LEFT + ROAD_WIDTH + 8, y, 6, 22);
        ctx.fillStyle = sector.isWater ? '#065f46' : '#1e1b4b';
        ctx.beginPath();
        ctx.arc(CANVAS_W - 38, y + 32, 16, 0, Math.PI * 2);
        ctx.fill();
      }

      // Main Highway / Waterway Surface
      ctx.fillStyle = sector.roadBg;
      ctx.fillRect(ROAD_LEFT, 0, ROAD_WIDTH, CANVAS_H);

      // Neon Edge Rails
      ctx.strokeStyle = sector.neonLeft;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ROAD_LEFT, 0);
      ctx.lineTo(ROAD_LEFT, CANVAS_H);
      ctx.stroke();

      ctx.strokeStyle = sector.neonRight;
      ctx.beginPath();
      ctx.moveTo(ROAD_LEFT + ROAD_WIDTH, 0);
      ctx.lineTo(ROAD_LEFT + ROAD_WIDTH, CANVAS_H);
      ctx.stroke();

      // Dashed Lane Dividers / Water Ripples
      ctx.strokeStyle = sector.stripeColor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.5;
      for (let l = 1; l < LANE_COUNT; l++) {
        const lx = ROAD_LEFT + l * LANE_W;
        for (let y = -64 + sim.roadOffset; y < CANVAS_H + 64; y += 64) {
          ctx.beginPath();
          ctx.moveTo(lx, y);
          ctx.lineTo(lx, y + 34);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // Nitro Speedlines
      if (p.nitroActive) {
        ctx.strokeStyle = 'rgba(255,255,255,0.24)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 10; i++) {
          const sx = ROAD_LEFT + ((i * 43 + now * 0.2) % ROAD_WIDTH);
          const sy = (now * 1.4 + i * 71) % CANVAS_H;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx, sy + 36);
          ctx.stroke();
        }
      }

      // Draw Entities
      for (const ent of entitiesRef.current) {
        ctx.save();
        ctx.translate(ent.x, ent.y);

        if (ent.kind === 'shard' || ent.kind === 'nitro' || ent.kind === 'shield') {
          ctx.fillStyle = ent.color;
          ctx.shadowColor = ent.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(0, 0, 13, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#020617';
          ctx.font = 'bold 9px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            ent.kind === 'shield' ? '+HP' : ent.kind === 'nitro' ? 'N2O' : ent.label || 'BIT',
            0,
            0
          );
        } else if (ent.kind === 'vault') {
          // Glowing Purple Relay Vault Portal
          ctx.strokeStyle = '#c084fc';
          ctx.fillStyle = 'rgba(168, 85, 247, 0.28)';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#c084fc';
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.roundRect(-29, -16, 58, 32, 8);
          ctx.fill();
          ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#f3e8ff';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('HACK VAULT', 0, 0);
        } else if (ent.kind === 'scanner') {
          // Red Laser Roadblock
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 12;
          ctx.fillRect(-ent.w / 2, -5, ent.w, 10);
          ctx.fillStyle = '#fecaca';
          ctx.fillRect(-ent.w / 2 + 4, -2, ent.w - 8, 4);
          ctx.shadowBlur = 0;
        } else if (ent.kind === 'drone') {
          // Cyber-Patrol Interceptor Drone (Flashing Red/Blue Siren Bar)
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = ent.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(-16, -22, 32, 44, 7);
          ctx.fill();
          ctx.stroke();

          // Siren Beacon
          const flashBlue = Math.floor(now / 120) % 2 === 0;
          ctx.fillStyle = flashBlue ? '#38bdf8' : '#ef4444';
          ctx.fillRect(-10, -4, 9, 6);
          ctx.fillStyle = flashBlue ? '#ef4444' : '#38bdf8';
          ctx.fillRect(1, -4, 9, 6);

          ctx.fillStyle = '#e2e8f0';
          ctx.font = 'bold 8px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(sector.isWater ? 'GATOR' : 'VCPD', 0, 14);
        } else {
          // Traffic Cruiser
          ctx.fillStyle = '#1e293b';
          ctx.strokeStyle = ent.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(-16, -26, 32, 52, 8);
          ctx.fill();
          ctx.stroke();
          // Windshield + Taillights
          ctx.fillStyle = '#020617';
          ctx.fillRect(-11, -14, 22, 12);
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(-12, 20, 7, 4);
          ctx.fillRect(5, 20, 7, 4);
        }
        ctx.restore();
      }

      // EMP Expanding Ring
      if (sim.empWaveRadius > 0) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, sim.empWaveRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // VCPD Helicopter Spotlight sweep at 3+ Stars
      if (heatStarsNow >= 3) {
        const spotX = CANVAS_W / 2 + Math.sin(now * 0.0022) * 145;
        const spotY = 180 + Math.cos(now * 0.0017) * 90;
        const grad = ctx.createRadialGradient(spotX, spotY, 8, spotX, spotY, 85);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(spotX, spotY, 85, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Player Vehicle (Vice Interceptor or Grassrivers Cyber Airboat)
      if (p.invulnTimer <= 0 || Math.floor(p.invulnTimer / 5) % 2 === 0) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.tilt);

        const heroColor = isLucia ? '#f472b6' : '#fbbf24';
        ctx.shadowColor = heroColor;
        ctx.shadowBlur = p.nitroActive ? 20 : 12;

        if (sector.isWater) {
          // Hover Airboat Hull
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = heroColor;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(0, -30);
          ctx.lineTo(18, -8);
          ctx.lineTo(16, 26);
          ctx.lineTo(-16, 26);
          ctx.lineTo(-18, -8);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Airboat Rear Fan Ring
          ctx.strokeStyle = '#34d399';
          ctx.beginPath();
          ctx.arc(0, 16, 9, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          // Leonida Cyber Supercar
          ctx.fillStyle = '#090d16';
          ctx.strokeStyle = heroColor;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.roundRect(-16, -28, 32, 56, 9);
          ctx.fill();
          ctx.stroke();

          // Neon Racing Stripe & Windshield
          ctx.fillStyle = heroColor;
          ctx.fillRect(-3, -24, 6, 48);
          ctx.fillStyle = '#22d3ee';
          ctx.fillRect(-11, -13, 22, 11);

          // Headlight beams
          ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
          ctx.beginPath();
          ctx.moveTo(-12, -28);
          ctx.lineTo(-24, -75);
          ctx.lineTo(24, -75);
          ctx.lineTo(12, -28);
          ctx.closePath();
          ctx.fill();
        }

        // Jason Shield Ring indicator
        if (!isLucia && p.jasonShieldReady) {
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.75)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(0, 0, 24, 34, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.shadowBlur = 0;
        ctx.restore();
      }

      // Draw Particles & Floating Texts
      for (const pt of particlesRef.current) {
        ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x - pt.size / 2, pt.y - pt.size / 2, pt.size, pt.size);
      }
      ctx.globalAlpha = 1;

      for (const ft of textsRef.current) {
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.fillStyle = ft.color;
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
      }
      ctx.globalAlpha = 1;

      // In-Canvas Sector & Multiplier Pill
      ctx.fillStyle = 'rgba(2, 6, 23, 0.78)';
      ctx.strokeStyle = sector.neonRight;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(10, 10, 210, 26, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(isEn ? sector.nameEn : sector.nameRo, 18, 23);

      ctx.restore();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [gameState, isEn, openVaultHack, persistScore, playSynth, pushFeed]);

  const activeSector = SECTORS[sectorIndex % SECTORS.length];
  const binaryValue = binaryBits.reduce((acc, bit, idx) => acc + bit * Math.pow(2, 3 - idx), 0);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-2.5 sm:gap-4 select-none pb-4">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 bg-slate-900/95 border border-fuchsia-500/40 rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-xl">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="min-h-[36px] px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4 text-fuchsia-400" />
            <span>{isEn ? 'Arcade' : 'Înapoi'}</span>
          </button>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-xl font-black text-white font-heading truncate flex items-center gap-1.5 sm:gap-2">
              <span className="truncate">🌴 Vice Leonida VI</span>
              <span className="hidden xs:inline-block px-2 py-0.5 rounded-md bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/40 text-[10px] font-mono uppercase shrink-0">
                GTA 6 TECH
              </span>
            </h1>
            <p className="hidden sm:block text-[11px] text-slate-400 truncate">
              {isEn
                ? 'Vice Beach · Venetian Causeway · Port Gellhorn · Grassrivers Airboat'
                : 'Vice Beach · Venetian Causeway · Port Gellhorn · Mlaștinile Grassrivers'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-950 border border-amber-500/40 text-[11px] sm:text-xs font-mono text-amber-300 flex items-center gap-1 tabular-nums">
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span>PB: {highScore.toLocaleString()}</span>
          </div>
          {gameState === 'playing' && (
            <button
              type="button"
              onClick={() => setGameState('paused')}
              className="min-h-[36px] px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Pause className="w-4 h-4" />
              <span className="hidden sm:inline">{isEn ? 'Pause' : 'Pauză'}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? 'Unmute' : 'Mute'}
            className="min-w-[36px] min-h-[36px] rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center cursor-pointer"
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* Leonida HUD Telemetry Strip — Compact on Mobile */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl p-2 sm:p-3 text-[11px] sm:text-xs font-mono">
        <div className="bg-slate-950 rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between tabular-nums">
          <span className="text-[9px] sm:text-xs text-slate-400">{isEn ? 'SCORE' : 'SCOR'}</span>
          <strong className="text-cyan-300 text-xs sm:text-sm font-black truncate">{score.toLocaleString()}</strong>
        </div>

        <div className="bg-slate-950 rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between tabular-nums">
          <span className="text-[9px] sm:text-xs text-slate-400">{isEn ? 'HEAT' : 'ALERTE'}</span>
          <span className="text-amber-400 font-black tracking-tight text-[11px] sm:text-xs">
            {'★'.repeat(heatStars)}
            <span className="text-slate-700">{'★'.repeat(5 - heatStars)}</span>
          </span>
        </div>

        <div className="bg-slate-950 rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between tabular-nums">
          <span className="text-[9px] sm:text-xs text-slate-400">{isEn ? 'HULL' : 'SCUT'}</span>
          <div className="flex items-center gap-0.5 sm:gap-1 mt-0.5 sm:mt-0">
            {[0, 1, 2, 3].slice(0, Math.max(3, hull)).map((idx) => (
              <Heart
                key={idx}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${idx < hull ? 'text-rose-500 fill-rose-500' : 'text-slate-700'}`}
              />
            ))}
          </div>
        </div>

        <div className="bg-slate-950 rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 border border-slate-800 flex flex-col justify-center gap-1 tabular-nums">
          <div className="flex justify-between text-[9px] sm:text-[10px]">
            <span className="text-cyan-400 font-bold">N2O</span>
            <span className="text-white">{nitroPct}%</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-400" style={{ width: `${nitroPct}%` }} />
          </div>
        </div>

        <div className="hidden sm:flex bg-slate-950 rounded-xl px-3 py-2 border border-slate-800 items-center justify-between gap-2">
          <span className="text-slate-400 text-[10px]">DIST / VAULT</span>
          <strong className="text-emerald-300 tabular-nums">{distanceM}m · {vaultsCracked}🔓</strong>
        </div>
      </div>

      {/* Main Canvas + Overlay Container */}
      <div className="relative bg-slate-950 border-2 border-fuchsia-500/40 rounded-3xl overflow-hidden shadow-2xl">
        {/* Live Leonida NetFeed Ticker */}
        <div className="bg-gradient-to-r from-fuchsia-950/90 via-slate-900 to-cyan-950/90 border-b border-fuchsia-500/30 px-3 sm:px-4 py-1.5 flex items-center gap-2 text-[10px] sm:text-[11px] font-mono">
          <Radio className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
          <span className="text-fuchsia-300 font-black shrink-0">NETFEED:</span>
          <span className="text-slate-200 truncate">{netFeed}</span>
        </div>

        <div className="relative flex justify-center bg-[#020617]">
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              inputRef.current.pointerActive = true;
              updatePointerSteer(e);
            }}
            onPointerMove={(e) => {
              if (inputRef.current.pointerActive) updatePointerSteer(e);
            }}
            onPointerUp={(e) => {
              if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                e.currentTarget.releasePointerCapture(e.pointerId);
              }
              inputRef.current.pointerActive = false;
            }}
            onPointerCancel={() => {
              inputRef.current.pointerActive = false;
            }}
            className={`${
              gameState === 'playing' ? 'block' : 'hidden sm:block'
            } w-full max-w-3xl aspect-[4/3] touch-none cursor-crosshair`}
          />

          {/* TITLE MENU OVERLAY (In-flow on mobile so nothing is clipped or stuck scrolling upward) */}
          {gameState === 'menu' && (
            <div className="relative sm:absolute sm:inset-0 w-full bg-slate-950/95 backdrop-blur-md p-4 sm:p-6 flex flex-col items-center justify-start sm:justify-center text-center sm:overflow-y-auto">
              <div className="max-w-xl w-full space-y-3.5 sm:space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/20 border border-fuchsia-400/40 text-fuchsia-300 text-[11px] sm:text-xs font-mono font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isEn ? 'STATE OF LEONIDA · CYBER COURIER' : 'STATUL LEONIDA · MISIUNE CYBER-COURIER'}</span>
                </div>

                <h2 className="text-xl sm:text-3xl font-black text-white font-heading tracking-tight">
                  Vice Leonida VI: <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-amber-300 to-cyan-400">Cyber Runner</span>
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {isEn
                    ? 'Race across Vice Beach, Venetian Causeway, Port Gellhorn & Grassrivers (Airboat!). Switch live between Lucia & Jason, evade Cyber-Patrol Drones (1★–5★ Heat), and hack Relay Vaults with Binary, Logic & C++ puzzles!'
                    : 'Gonește prin Vice Beach, Venetian Causeway, Port Gellhorn și mlaștinile Grassrivers (cu Airboat!). Schimbă live între Lucia și Jason, evită dronele Cyber-Patrol (1★–5★ Heat) și sparge Relay Vaults cu puzzle-uri Binar, Porți Logice & C++!'}
                </p>

                {/* Choose Starting Hero */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-left">
                  <button
                    type="button"
                    onClick={() => setHero('lucia')}
                    className={`p-3 rounded-2xl border-2 transition cursor-pointer ${
                      hero === 'lucia'
                        ? 'bg-fuchsia-950/70 border-fuchsia-400 shadow-lg shadow-fuchsia-500/20'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-black text-fuchsia-300">👩‍💻 Lucia Caminos</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-200">HACKER</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      {isEn
                        ? '+35% Nitro regen, +25% Shard pts, slower Heat & +3s Vault Hack timer.'
                        : '+35% regenerare Nitro, +25% puncte Shards, Heat mai lent & +3s la Vault Hack.'}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHero('jason')}
                    className={`p-3 rounded-2xl border-2 transition cursor-pointer ${
                      hero === 'jason'
                        ? 'bg-amber-950/70 border-amber-400 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-black text-amber-300">🕶️ Jason Duval</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-200">DRIVER</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      {isEn
                        ? 'Ultra-crisp steering + Auto Kinetic Shield (absorbs 1 crash every 20s).'
                        : 'Manevrabilitate maximă + Scut Kinetic Automat (absoarbe 1 coliziune la 20s).'}
                    </p>
                  </button>
                </div>

                <div className="hidden sm:flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-slate-400">
                  <span>[WASD / ◀▲▼▶] Move</span>
                  <span>•</span>
                  <span>[SPACE] Nitro</span>
                  <span>•</span>
                  <span>[Q] Swap Hero</span>
                  <span>•</span>
                  <span>[E] EMP Shockwave</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleStartNewGame(hero)}
                  className="w-full sm:w-auto min-h-[46px] px-8 py-3 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-rose-500 to-amber-500 hover:from-fuchsia-500 hover:to-amber-400 text-white font-black text-sm tracking-wide shadow-xl shadow-fuchsia-600/30 inline-flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>{isEn ? 'LAUNCH LEONIDA RUN 🚀' : 'PORNEȘTE CURSA LEONIDA 🚀'}</span>
                </button>
              </div>
            </div>
          )}

          {/* PAUSE OVERLAY */}
          {gameState === 'paused' && (
            <div className="relative sm:absolute sm:inset-0 w-full bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4 p-6 text-center min-h-[260px]">
              <h3 className="text-2xl font-black text-white font-heading">
                {isEn ? 'MISSION PAUSED' : 'MISIUNE ÎN PAUZĂ'}
              </h3>
              <p className="text-xs text-slate-300">
                {isEn ? `Current Sector: ${activeSector.nameEn}` : `Sector curent: ${activeSector.nameRo}`}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setGameState('playing')}
                  className="min-h-[42px] px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{isEn ? 'Resume' : 'Continuă'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStartNewGame(hero)}
                  className="min-h-[42px] px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{isEn ? 'Restart' : 'Reîncepe'}</span>
                </button>
              </div>
            </div>
          )}

          {/* INTERACTIVE RELAY VAULT HACK OVERLAY */}
          {gameState === 'hack' && activePuzzle && (
            <div className="relative sm:absolute sm:inset-0 w-full bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-start sm:justify-center p-4 sm:p-6 text-center sm:overflow-y-auto">
              <div className="max-w-md w-full bg-slate-900 border-2 border-purple-400/70 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-[11px] font-mono font-bold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    RELAY VAULT BREACH
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-mono font-black tabular-nums">
                    ⏱ {hackTimer}s
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-white">
                  {isEn ? activePuzzle.promptEn : activePuzzle.promptRo}
                </h3>

                {activePuzzle.kind === 'binary' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-2">
                      {[8, 4, 2, 1].map((weight, idx) => (
                        <button
                          key={weight}
                          type="button"
                          onClick={() => {
                            const next = [...binaryBits];
                            next[idx] = next[idx] === 1 ? 0 : 1;
                            setBinaryBits(next);
                            playSynth(500 + next[idx] * 220, 0.05, 'sine', 0.06);
                            const sum = next.reduce((acc, b, i) => acc + b * Math.pow(2, 3 - i), 0);
                            if (sum === activePuzzle.targetDecimal) {
                              resolveHackSuccess();
                            }
                          }}
                          className={`p-3 rounded-xl border-2 font-mono transition cursor-pointer ${
                            binaryBits[idx] === 1
                              ? 'bg-emerald-600 border-emerald-300 text-white shadow-lg'
                              : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-purple-400'
                          }`}
                        >
                          <div className="text-[10px] opacity-75">2^{3 - idx} = {weight}</div>
                          <div className="text-2xl font-black mt-0.5">{binaryBits[idx]}</div>
                        </button>
                      ))}
                    </div>
                    <div className="text-xs font-mono text-cyan-300 tabular-nums">
                      {isEn ? 'Current Decimal:' : 'Valoare curentă:'} <strong>{binaryValue}</strong> / {activePuzzle.targetDecimal}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2 text-left">
                    {activePuzzle.options?.map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (opt.correct) {
                            resolveHackSuccess();
                          } else {
                            setHackFeedback(isEn ? 'Wrong bit! Watch Wanted Heat!' : 'Răspuns greșit! Alertă activată!');
                            setTimeout(() => resolveHackFail(), 500);
                          }
                        }}
                        className="w-full p-3 rounded-xl bg-slate-950 hover:bg-purple-950/70 border border-slate-700 hover:border-purple-400 text-xs sm:text-sm font-bold text-white transition cursor-pointer flex items-center justify-between"
                      >
                        <span>{opt.label}</span>
                        <Unlock className="w-4 h-4 text-purple-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}

                {hackFeedback && (
                  <p className="text-xs font-bold text-rose-400">{hackFeedback}</p>
                )}
                <p className="text-[11px] text-slate-400">
                  💡 {isEn ? activePuzzle.hintEn : activePuzzle.hintRo}
                </p>
              </div>
            </div>
          )}

          {/* GAME OVER OVERLAY */}
          {gameState === 'gameover' && (
            <div className="relative sm:absolute sm:inset-0 w-full bg-slate-950/92 backdrop-blur-md flex flex-col items-center justify-start sm:justify-center p-4 sm:p-6 text-center">
              <div className="max-w-md w-full bg-slate-900 border-2 border-rose-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
                <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono font-bold">
                  {isEn ? 'TRANSMISSION INTERRUPTED' : 'TRANSMISIE ÎNTRERUPTĂ'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-heading">
                  {isEn ? 'Leonida Run Complete!' : 'Cursă Încheiată!'}
                </h3>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-slate-950 p-3 rounded-2xl border border-slate-800 tabular-nums">
                  <div>
                    <span className="text-slate-400 block text-[10px]">{isEn ? 'FINAL' : 'SCOR'}</span>
                    <strong className="text-cyan-300 text-base">{score.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">DISTANCE</span>
                    <strong className="text-amber-300 text-base">{distanceM}m</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">VAULTS</span>
                    <strong className="text-emerald-300 text-base">{vaultsCracked}</strong>
                  </div>
                </div>
                {studentName && (
                  <p className="text-[11px] text-emerald-400 font-mono">
                    {isEn ? `Saved to ${studentName}'s Digital Portfolio!` : `Scor salvat în Carnetul Digital (${studentName})!`}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => handleStartNewGame(hero)}
                    className="flex-1 min-h-[44px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-amber-500 hover:from-fuchsia-500 hover:to-amber-400 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{isEn ? 'Run Again' : 'Joacă din Nou'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={onBack}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
                  >
                    {isEn ? 'Exit' : 'Ieși'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ergonomic Bottom Tactical & 4-Way Touch Controls Bar */}
        <div className="bg-slate-900/95 border-t border-slate-800 px-3 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2">
          {/* 4-Way Touch D-Pad (Left / Up / Down / Right) */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                inputRef.current.left = true;
              }}
              onPointerUp={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
                inputRef.current.left = false;
              }}
              onPointerCancel={() => { inputRef.current.left = false; }}
              aria-label="Steer Left"
              className="w-11 h-11 rounded-xl bg-slate-800 active:bg-cyan-600 border border-slate-700 text-white flex items-center justify-center cursor-pointer touch-none"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                inputRef.current.up = true;
              }}
              onPointerUp={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
                inputRef.current.up = false;
              }}
              onPointerCancel={() => { inputRef.current.up = false; }}
              aria-label={isEn ? 'Move Up / Accelerate' : 'Urci / Accelerează'}
              className="w-11 h-11 rounded-xl bg-emerald-700/90 active:bg-emerald-500 border border-emerald-500/60 text-white flex items-center justify-center cursor-pointer touch-none"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <button
              type="button"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                inputRef.current.down = true;
              }}
              onPointerUp={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
                inputRef.current.down = false;
              }}
              onPointerCancel={() => { inputRef.current.down = false; }}
              aria-label={isEn ? 'Move Down / Brake' : 'Coboară / Frână'}
              className="w-11 h-11 rounded-xl bg-slate-800 active:bg-rose-600 border border-slate-700 text-white flex items-center justify-center cursor-pointer touch-none"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
            <button
              type="button"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                inputRef.current.right = true;
              }}
              onPointerUp={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
                inputRef.current.right = false;
              }}
              onPointerCancel={() => { inputRef.current.right = false; }}
              aria-label="Steer Right"
              className="w-11 h-11 rounded-xl bg-slate-800 active:bg-cyan-600 border border-slate-700 text-white flex items-center justify-center cursor-pointer touch-none"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Hero Switch + EMP + Nitro Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleSwapHero}
              disabled={gameState !== 'playing'}
              className={`min-h-[42px] px-2.5 sm:px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-40 ${
                hero === 'lucia'
                  ? 'bg-fuchsia-950/90 border-fuchsia-400 text-fuchsia-200'
                  : 'bg-amber-950/90 border-amber-400 text-amber-200'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>{hero === 'lucia' ? 'Lucia' : 'Jason'}</span>
            </button>

            <button
              type="button"
              onClick={triggerEmpBlast}
              disabled={gameState !== 'playing' || empPct < 100}
              className="min-h-[42px] px-2.5 sm:px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-black flex items-center gap-1 cursor-pointer tabular-nums"
            >
              <Zap className="w-4 h-4 shrink-0" />
              <span>EMP {empPct}%</span>
            </button>

            <button
              type="button"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                inputRef.current.nitro = true;
              }}
              onPointerUp={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
                inputRef.current.nitro = false;
              }}
              onPointerCancel={() => { inputRef.current.nitro = false; }}
              disabled={gameState !== 'playing'}
              className="min-h-[42px] px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-amber-500 active:scale-95 text-white text-xs font-black flex items-center gap-1 cursor-pointer disabled:opacity-40 touch-none"
            >
              <Flame className="w-4 h-4 shrink-0" />
              <span>NITRO</span>
            </button>
          </div>
        </div>
      </div>

      {/* Educational Footer Strip */}
      <div className="bg-slate-900/75 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-fuchsia-400 shrink-0" />
          <span>
            {isEn
              ? 'ICT Mechanics: Binary (8-4-2-1), Logic Gates (AND/OR/XOR), C++ modulo (%), DNS & HTTPS.'
              : 'Mecanici TIC: Conversii binare (8-4-2-1), Porți logice (AND/OR/XOR), C++ modulo (%), DNS & HTTPS.'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-amber-300 font-mono font-bold">
          <Shield className="w-4 h-4" />
          <span>{isEn ? activeSector.subtitleEn : activeSector.subtitleRo}</span>
        </div>
      </div>
    </div>
  );
};
