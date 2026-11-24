import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Map as MapIcon,
  Radio,
  Car,
  User,
  Shield,
  Zap,
  Star,
  Navigation,
  RotateCcw,
  Play,
  X,
  HelpCircle,
  Trophy,
  Wrench,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { forceScrollToTop } from '../../utils/scrollHelper';
import {
  addByteCoins,
  getActiveStudent,
  updateStudentArcadeScore,
} from '../../lib/studentAuthService';
import {
  LEONIDA_REGIONS,
  LEONIDA_VEHICLES,
  LEONIDA_STORY_CHALLENGES,
  LEONIDA_SIDE_CONTRACTS,
  LEONIDA_CAST,
  LeonidaChallenge,
  LeonidaVehicleDef,
  LeonidaDistrictId,
} from '../../data/leonidaOpenWorldData';
import leonidaHeroImg from '../../assets/images/vice_leonida_hero_art_1795278167604.jpg';
import leonidaMapImg from '../../assets/images/leonida_tactical_map_1795278168340.jpg';
import leonidaDuoImg from '../../assets/images/leonida_duo_agents_1795278168626.jpg';

export interface ViceLeonidaOpenWorldProps {
  onBack: () => void;
  studentName?: string;
  onAwardXP?: (amount: number, reason: string) => void;
  onSaveScore?: (score: number) => void;
  onOpenLesson?: (missionId: string) => void;
}

type GameState = 'TITLE_MENU' | 'PLAYING' | 'PAUSED_MAP' | 'CHALLENGE' | 'SUMMARY';
type HeroId = 'lucia' | 'jason';
type RadioStation = 'off' | 'vice84' | 'leonida_bass';

interface WorldVehicle {
  uid: string;
  def: LeonidaVehicleDef;
  x: number;
  y: number;
  angle: number;
  vx: number;
  vy: number;
  speed: number;
  hp: number;
  isPolice?: boolean;
  aiPhase?: number;
  aiTargetX?: number;
  aiTargetY?: number;
}

interface DataShard {
  id: string;
  x: number;
  y: number;
  collected: boolean;
  label: string;
}

interface SkidMark {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  alpha: number;
}

interface BuildingBox {
  x: number;
  y: number;
  w: number;
  h: number;
  roof: string;
  trim: string;
  district: LeonidaDistrictId;
}

interface SafehouseZone {
  id: string;
  nameRo: string;
  nameEn: string;
  x: number;
  y: number;
  r: number;
}

const WORLD_W = 2600;
const WORLD_H = 1800;
const WORLD_STORAGE_KEY = 'arkedo_vice_leonida_world_state';
const HIGHSCORE_STORAGE_KEY = 'arkedo_highscore_vice_leonida_world';

const SAFEHOUSES: SafehouseZone[] = [
  { id: 'sh_vice', nameRo: 'Garaj Ocean Drive', nameEn: 'Ocean Drive Garage', x: 1840, y: 920, r: 58 },
  { id: 'sh_port', nameRo: 'Atelier Port Gellhorn', nameEn: 'Port Gellhorn Shop', x: 1360, y: 1380, r: 58 },
  { id: 'sh_ambrosia', nameRo: 'Hangar Ambrosia', nameEn: 'Ambrosia Safe Barn', x: 1180, y: 460, r: 58 },
];

// City buildings with subtle Art-Deco / Industrial blocks
const WORLD_BUILDINGS: BuildingBox[] = [
  // Vice City Downtown & Ocean Beach
  { x: 1480, y: 630, w: 130, h: 110, roof: '#1e1b4b', trim: '#ec4899', district: 'vice_city' },
  { x: 1650, y: 620, w: 120, h: 100, roof: '#172554', trim: '#22d3ee', district: 'vice_city' },
  { x: 1880, y: 640, w: 140, h: 130, roof: '#3b0764', trim: '#f472b6', district: 'vice_city' },
  { x: 1480, y: 920, w: 120, h: 120, roof: '#1e293b', trim: '#38bdf8', district: 'vice_city' },
  { x: 1940, y: 960, w: 130, h: 110, roof: '#311042', trim: '#f43f5e', district: 'vice_city' },
  // Port Gellhorn Industrial Warehouses & Containers
  { x: 1230, y: 1240, w: 150, h: 75, roof: '#27272a', trim: '#f59e0b', district: 'port_gellhorn' },
  { x: 1640, y: 1250, w: 140, h: 80, roof: '#1f2937', trim: '#fb923c', district: 'port_gellhorn' },
  { x: 1640, y: 1490, w: 160, h: 70, roof: '#27272a', trim: '#eab308', district: 'port_gellhorn' },
  // Ambrosia Refinery
  { x: 860, y: 210, w: 160, h: 90, roof: '#292524', trim: '#fb923c', district: 'ambrosia' },
  { x: 1260, y: 210, w: 140, h: 90, roof: '#1c1917', trim: '#facc15', district: 'ambrosia' },
  // Mount Kalaga Observatory Station
  { x: 2050, y: 210, w: 110, h: 95, roof: '#0f172a', trim: '#2dd4bf', district: 'mount_kalaga' },
];

const INITIAL_SHARDS: Omit<DataShard, 'collected'>[] = [
  { id: 'shard_vc1', x: 1740, y: 760, label: 'VC-01' },
  { id: 'shard_vc2', x: 2060, y: 840, label: 'VC-02' },
  { id: 'shard_keys1', x: 640, y: 1460, label: 'KY-03' },
  { id: 'shard_keys2', x: 380, y: 1520, label: 'KY-04' },
  { id: 'shard_port1', x: 1440, y: 1540, label: 'PG-05' },
  { id: 'shard_grass1', x: 540, y: 950, label: 'GR-06' },
  { id: 'shard_grass2', x: 780, y: 760, label: 'GR-07' },
  { id: 'shard_kalaga1', x: 1840, y: 260, label: 'MK-08' },
  { id: 'shard_ambrosia1', x: 1020, y: 390, label: 'AM-09' },
  { id: 'shard_bridge', x: 1040, y: 1280, label: 'BR-10' },
];

function isWaterTile(x: number, y: number): boolean {
  // East ocean coastline
  if (x > 2240) return true;
  // South Keys Lagoon (except Coral Causeway road strip & island pads)
  if (y > 1340 && x < 1080) {
    const onIsland1 = Math.hypot(x - 520, y - 1480) < 145;
    const onIsland2 = Math.hypot(x - 280, y - 1540) < 115;
    const onBridge = y > 1445 && y < 1510 && x >= 260 && x <= 1120;
    if (!onIsland1 && !onIsland2 && !onBridge) return true;
  }
  // Grassrivers winding canal
  if (x > 220 && x < 920 && y > 690 && y < 1140) {
    const canalY = 910 + Math.sin(x * 0.011) * 95;
    const onSwampBridge = x > 620 && x < 700 && y > 780 && y < 1020;
    if (Math.abs(y - canalY) < 58 && !onSwampBridge) return true;
  }
  return false;
}

function isRoadTile(x: number, y: number): boolean {
  // Main horizontal expressways
  if (Math.abs(y - 340) < 42 && x > 740 && x < 2140) return true; // North highway (Ambrosia <-> Kalaga)
  if (Math.abs(y - 820) < 46 && x > 560 && x < 2160) return true; // Central boulevard (Grassrivers <-> Vice City)
  if (Math.abs(y - 1380) < 44 && x > 980 && x < 1940) return true; // South Port Avenue
  if (Math.abs(y - 1480) < 34 && x > 280 && x < 1100) return true; // Keys Causeway
  // Main vertical highways
  if (Math.abs(x - 1680) < 46 && y > 320 && y < 1440) return true; // Vice City Ocean Strip
  if (Math.abs(x - 1120) < 42 && y > 320 && y < 1480) return true; // Central Spine
  if (Math.abs(x - 660) < 36 && y > 780 && y < 1480) return true; // West Coast Road
  return false;
}

function getDistrictAt(x: number, y: number): LeonidaDistrictId {
  let closest = LEONIDA_REGIONS[0];
  let bestDist = Infinity;
  for (const r of LEONIDA_REGIONS) {
    const d = Math.hypot(x - r.worldX, y - r.worldY);
    if (d < bestDist) {
      bestDist = d;
      closest = r;
    }
  }
  return closest.id;
}

export const ViceLeonidaOpenWorld: React.FC<ViceLeonidaOpenWorldProps> = ({
  onBack,
  studentName = 'Leonida Agent',
  onAwardXP,
  onSaveScore,
  onOpenLesson,
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [hero, setHero] = useState<HeroId>('lucia');
  const [radio, setRadio] = useState<RadioStation>('vice84');
  const [soundOn, setSoundOn] = useState<boolean>(sounds.enabled);

  // HUD synced reactive snapshot
  const [hud, setHud] = useState({
    cash: 0,
    score: 0,
    hp: 100,
    armor: 50,
    wanted: 0,
    speedKmh: 0,
    districtId: 'vice_city' as LeonidaDistrictId,
    inVehicleNameRo: '',
    inVehicleNameEn: '',
    nearVehicleNameRo: '',
    nearVehicleNameEn: '',
    nearMissionId: '' as string,
    nearSafehouse: false,
    empCooldown: 0,
    shardsCollected: 0,
    contractsDone: 0,
  });

  const [completedMissions, setCompletedMissions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WORLD_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed?.completedMissions) ? parsed.completedMissions : [];
      }
    } catch {}
    return [];
  });
  const [bestScore, setBestScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem(HIGHSCORE_STORAGE_KEY) || '0');
    } catch {
      return 0;
    }
  });
  const [gpsTargetId, setGpsTargetId] = useState<LeonidaDistrictId>('vice_city');

  // Challenge Modal state
  const [activeChallenge, setActiveChallenge] = useState<LeonidaChallenge | null>(null);
  const [activeContractIdx, setActiveContractIdx] = useState<number | null>(null);
  const [binaryBits, setBinaryBits] = useState<[number, number, number, number]>([0, 0, 0, 0]);
  const [shortInput, setShortInput] = useState('');
  const [challengeFeedback, setChallengeFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [statusBanner, setStatusBanner] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const minimapRef = useRef<HTMLCanvasElement | null>(null);
  const keysRef = useRef<Record<string, boolean>>({});
  const dragStickRef = useRef<{ active: boolean; startX: number; startY: number }>({
    active: false,
    startX: 0,
    startY: 0,
  });
  const touchInputRef = useRef<{ dx: number; dy: number; accel: boolean; brake: boolean }>({
    dx: 0,
    dy: 0,
    accel: false,
    brake: false,
  });

  useEffect(() => {
    forceScrollToTop();
  }, []);

  // Mutable simulation ref for smooth 60 FPS loop
  const simRef = useRef<{
    px: number;
    py: number;
    pAngle: number;
    hp: number;
    armor: number;
    wanted: number;
    wantedDecay: number;
    cash: number;
    score: number;
    empTimer: number;
    empRingRadius: number;
    inVehicleUid: string | null;
    vehicles: WorldVehicle[];
    shards: DataShard[];
    skids: SkidMark[];
    contractsDone: number;
    contractCooldown: number;
    speedTrapCooldown: number;
    lastSafehouseHeal: number;
    hero: HeroId;
    gpsTarget: LeonidaDistrictId;
    completed: Set<string>;
  }>({
    px: 1680,
    py: 890,
    pAngle: -Math.PI / 2,
    hp: 100,
    armor: 50,
    wanted: 0,
    wantedDecay: 0,
    cash: 0,
    score: 0,
    empTimer: 0,
    empRingRadius: 0,
    inVehicleUid: null,
    vehicles: [],
    shards: INITIAL_SHARDS.map((s) => ({ ...s, collected: false })),
    skids: [],
    contractsDone: 0,
    contractCooldown: 0,
    speedTrapCooldown: 0,
    lastSafehouseHeal: 0,
    hero: 'lucia',
    gpsTarget: 'vice_city',
    completed: new Set(completedMissions),
  });

  const gameStateRef = useRef<GameState>(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    simRef.current.hero = hero;
  }, [hero]);

  useEffect(() => {
    simRef.current.gpsTarget = gpsTargetId;
  }, [gpsTargetId]);

  useEffect(() => {
    simRef.current.completed = new Set(completedMissions);
  }, [completedMissions]);

  // Procedural Web Audio Synthwave Radio
  useEffect(() => {
    if (gameState !== 'PLAYING' || radio === 'off' || !soundOn) return;
    let ctx: AudioContext | null = null;
    let timer: number | null = null;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      ctx = new AudioCtx();
      const notesVice = [220, 261.63, 329.63, 392, 329.63, 261.63, 293.66, 349.23];
      const notesBass = [110, 110, 130.81, 146.83, 98, 98, 123.47, 130.81];
      let step = 0;

      timer = window.setInterval(() => {
        if (!ctx || ctx.state === 'closed') return;
        if (ctx.state === 'suspended') void ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const seq = radio === 'vice84' ? notesVice : notesBass;
        osc.type = radio === 'vice84' ? 'triangle' : 'sawtooth';
        osc.frequency.value = seq[step % seq.length];
        gain.gain.setValueAtTime(0.032, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.24);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
        step += 1;
      }, radio === 'vice84' ? 270 : 320);
    } catch {}

    return () => {
      if (timer) window.clearInterval(timer);
      if (ctx) void ctx.close().catch(() => {});
    };
  }, [gameState, radio, soundOn]);

  const spawnWorldVehicles = useCallback((): WorldVehicle[] => {
    const banshee = LEONIDA_VEHICLES[0];
    const enforcer = LEONIDA_VEHICLES[1];
    const bronco = LEONIDA_VEHICLES[2];
    const airboat = LEONIDA_VEHICLES[3];
    const moto = LEONIDA_VEHICLES[4];

    return [
      { uid: 'v_vc_1', def: banshee, x: 1640, y: 865, angle: 0, vx: 0, vy: 0, speed: 0, hp: banshee.armor },
      { uid: 'v_vc_2', def: moto, x: 1790, y: 900, angle: -Math.PI / 2, vx: 0, vy: 0, speed: 0, hp: moto.armor },
      { uid: 'v_keys_1', def: moto, x: 560, y: 1475, angle: 0, vx: 0, vy: 0, speed: 0, hp: moto.armor },
      { uid: 'v_port_1', def: enforcer, x: 1460, y: 1360, angle: Math.PI, vx: 0, vy: 0, speed: 0, hp: enforcer.armor },
      { uid: 'v_grass_boat', def: airboat, x: 740, y: 925, angle: Math.PI, vx: 0, vy: 0, speed: 0, hp: airboat.armor },
      { uid: 'v_kalaga_4x4', def: bronco, x: 1860, y: 370, angle: Math.PI / 2, vx: 0, vy: 0, speed: 0, hp: bronco.armor },
      { uid: 'v_ambrosia_1', def: banshee, x: 1180, y: 380, angle: 0, vx: 0, vy: 0, speed: 0, hp: banshee.armor },
      // Dynamic Patrol / Street Cruisers
      { uid: 'ai_patrol_1', def: enforcer, x: 1680, y: 540, angle: Math.PI / 2, vx: 0, vy: 0, speed: 120, hp: enforcer.armor, isPolice: true, aiPhase: 0 },
      { uid: 'ai_patrol_2', def: enforcer, x: 1120, y: 1080, angle: -Math.PI / 2, vx: 0, vy: 0, speed: 125, hp: enforcer.armor, isPolice: true, aiPhase: 2 },
      { uid: 'ai_patrol_3', def: banshee, x: 1320, y: 820, angle: 0, vx: 0, vy: 0, speed: 110, hp: banshee.armor, isPolice: false, aiPhase: 1 },
    ];
  }, []);

  const persistProgress = useCallback(
    (nextMissions: string[], nextScore: number) => {
      try {
        localStorage.setItem(
          WORLD_STORAGE_KEY,
          JSON.stringify({ completedMissions: nextMissions, updatedAt: new Date().toISOString() })
        );
        if (nextScore > bestScore) {
          localStorage.setItem(HIGHSCORE_STORAGE_KEY, String(nextScore));
          setBestScore(nextScore);
        }
      } catch {}
      updateStudentArcadeScore('vice_leonida_world', Math.max(nextScore, bestScore));
      onSaveScore?.(nextScore);
    },
    [bestScore, onSaveScore]
  );

  const startNewCampaign = useCallback(() => {
    sounds.playClick();
    forceScrollToTop();
    const s = simRef.current;
    s.px = 1680;
    s.py = 890;
    s.pAngle = -Math.PI / 2;
    s.hp = 100;
    s.armor = s.hero === 'jason' ? 80 : 50;
    s.wanted = 0;
    s.wantedDecay = 0;
    s.cash = 0;
    s.score = 0;
    s.empTimer = 0;
    s.empRingRadius = 0;
    s.inVehicleUid = null;
    s.vehicles = spawnWorldVehicles();
    s.shards = INITIAL_SHARDS.map((item) => ({ ...item, collected: false }));
    s.skids = [];
    s.contractsDone = 0;
    s.contractCooldown = 0;

    // Select first uncompleted mission as GPS target
    const nextPending = LEONIDA_STORY_CHALLENGES.find((m) => !s.completed.has(m.id));
    if (nextPending) setGpsTargetId(nextPending.districtId);

    setStatusBanner(
      isEn
        ? 'Welcome to Leonida! Walk to the pink Banshee GT and press E to drive.'
        : 'Bine ai venit în Leonida! Apropie-te de Banshee GT și apasă E ca să conduci.'
    );
    setGameState('PLAYING');
  }, [isEn, spawnWorldVehicles]);

  const handleToggleEnterExit = useCallback(() => {
    if (gameStateRef.current !== 'PLAYING') return;
    const s = simRef.current;
    if (s.inVehicleUid) {
      const v = s.vehicles.find((veh) => veh.uid === s.inVehicleUid);
      if (v) {
        s.px = v.x + Math.cos(v.angle + Math.PI / 2) * 34;
        s.py = v.y + Math.sin(v.angle + Math.PI / 2) * 34;
        v.speed *= 0.35;
      }
      s.inVehicleUid = null;
      sounds.playClick();
      return;
    }

    // Find closest vehicle within 68px
    let nearest: WorldVehicle | null = null;
    let bestD = 68;
    for (const v of s.vehicles) {
      const d = Math.hypot(v.x - s.px, v.y - s.py);
      if (d < bestD) {
        bestD = d;
        nearest = v;
      }
    }
    if (nearest) {
      nearest.isPolice = false; // Hijacked by player cleanly!
      s.inVehicleUid = nearest.uid;
      sounds.playSuccess();
      setStatusBanner(
        isEn
          ? `Entered ${nearest.def.nameEn}${nearest.def.canWater ? ' (Water & Land!)' : ''}`
          : `Ai urcat în ${nearest.def.nameRo}${nearest.def.canWater ? ' (Apă & Uscat!)' : ''}`
      );
    }
  }, [isEn]);

  const handleTriggerEmp = useCallback(() => {
    const s = simRef.current;
    if (gameStateRef.current !== 'PLAYING' || s.empTimer > 0) return;
    s.empTimer = 18;
    s.empRingRadius = 15;
    sounds.playSuccess();
    let stunned = 0;
    for (const v of s.vehicles) {
      if (v.isPolice && Math.hypot(v.x - s.px, v.y - s.py) < 280) {
        v.speed = -40;
        v.aiPhase = (v.aiPhase || 0) + 4.5; // temporary stall
        stunned += 1;
      }
    }
    if (stunned > 0) {
      s.score += stunned * 40;
      setStatusBanner(
        isEn ? `EMP Shockwave disabled ${stunned} VCPD unit(s)!` : `Impuls EMP: ${stunned} unități VCPD dezactivate!`
      );
    }
  }, [isEn]);

  const handleOpenNearestChallenge = useCallback(() => {
    const s = simRef.current;
    if (gameStateRef.current !== 'PLAYING') return;

    // Check Story District Mission markers first
    for (const region of LEONIDA_REGIONS) {
      if (Math.hypot(s.px - region.worldX, s.py - region.worldY) < 70) {
        const challenge = LEONIDA_STORY_CHALLENGES.find((c) => c.districtId === region.id);
        if (challenge) {
          setActiveChallenge(challenge);
          setActiveContractIdx(null);
          setBinaryBits([0, 0, 0, 0]);
          setShortInput('');
          setChallengeFeedback(null);
          setShowHint(false);
          setGameState('CHALLENGE');
          sounds.playClick();
          return;
        }
      }
    }
  }, []);

  const handleTriggerSideContract = useCallback(() => {
    const s = simRef.current;
    if (gameStateRef.current !== 'PLAYING') return;
    if (s.contractCooldown > 0) {
      setStatusBanner(
        isEn
          ? `Contract radio recharging (${Math.ceil(s.contractCooldown)}s)...`
          : `Radio contracte se reîncarcă (${Math.ceil(s.contractCooldown)}s)...`
      );
      return;
    }
    const idx = Math.floor(Math.random() * LEONIDA_SIDE_CONTRACTS.length);
    setActiveContractIdx(idx);
    setActiveChallenge(null);
    setChallengeFeedback(null);
    setGameState('CHALLENGE');
    sounds.playClick();
  }, [isEn]);

  // Keyboard listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (gameStateRef.current === 'CHALLENGE') return;
      const key = e.key.toLowerCase();
      keysRef.current[key] = true;

      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key) && gameStateRef.current === 'PLAYING') {
        e.preventDefault();
      }
      if (key === 'e' || key === 'f') {
        // If standing directly on a mission marker, allow triggering mission OR toggling car
        const s = simRef.current;
        const onMission = LEONIDA_REGIONS.some(
          (r) => Math.hypot(s.px - r.worldX, s.py - r.worldY) < 70
        );
        if (onMission && !s.inVehicleUid) {
          handleOpenNearestChallenge();
        } else {
          handleToggleEnterExit();
        }
      } else if (key === 'enter' && gameStateRef.current === 'PLAYING') {
        handleOpenNearestChallenge();
      } else if (key === 'q' && gameStateRef.current === 'PLAYING') {
        setHero((prev) => (prev === 'lucia' ? 'jason' : 'lucia'));
        sounds.playClick();
      } else if (key === 'c' && gameStateRef.current === 'PLAYING') {
        handleTriggerEmp();
      } else if (key === 'm' && (gameStateRef.current === 'PLAYING' || gameStateRef.current === 'PAUSED_MAP')) {
        setGameState((prev) => (prev === 'PAUSED_MAP' ? 'PLAYING' : 'PAUSED_MAP'));
        sounds.playClick();
      } else if (key === 'n' && gameStateRef.current === 'PLAYING') {
        setRadio((prev) => (prev === 'vice84' ? 'leonida_bass' : prev === 'leonida_bass' ? 'off' : 'vice84'));
        sounds.playClick();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    const onBlur = () => {
      keysRef.current = {};
      touchInputRef.current.dx = 0;
      touchInputRef.current.dy = 0;
      touchInputRef.current.accel = false;
      touchInputRef.current.brake = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [handleOpenNearestChallenge, handleToggleEnterExit, handleTriggerEmp]);

  // Main 60 FPS Simulation & Rendering Loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    let rafId = 0;
    let lastTs = performance.now();
    let hudSyncAcc = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.04, (now - lastTs) / 1000);
      lastTs = now;
      const s = simRef.current;
      const keys = keysRef.current;
      const touch = touchInputRef.current;

      if (s.empTimer > 0) s.empTimer = Math.max(0, s.empTimer - dt);
      if (s.empRingRadius > 0) {
        s.empRingRadius += 620 * dt;
        if (s.empRingRadius > 320) s.empRingRadius = 0;
      }
      if (s.contractCooldown > 0) s.contractCooldown = Math.max(0, s.contractCooldown - dt);
      if (s.speedTrapCooldown > 0) s.speedTrapCooldown = Math.max(0, s.speedTrapCooldown - dt);

      const moveUp = keys['w'] || keys['arrowup'] || touch.accel || touch.dy < -0.35;
      const moveDown = keys['s'] || keys['arrowdown'] || touch.brake || touch.dy > 0.35;
      const moveLeft = keys['a'] || keys['arrowleft'] || touch.dx < -0.35;
      const moveRight = keys['d'] || keys['arrowright'] || touch.dx > 0.35;
      const isBoost = keys['shift'];
      const isHandbrake = keys[' '];

      // 1. Update Player or Driven Vehicle
      let activeVeh = s.inVehicleUid ? s.vehicles.find((v) => v.uid === s.inVehicleUid) || null : null;

      if (activeVeh) {
        const def = activeVeh.def;
        const onWater = isWaterTile(activeVeh.x, activeVeh.y);
        const onRoad = isRoadTile(activeVeh.x, activeVeh.y);
        let surfaceFactor = onRoad ? 1.0 : def.offroadFactor;
        if (onWater) {
          surfaceFactor = def.canWater ? 1.05 : 0.25;
        }
        const boostMult = isBoost ? 1.24 : 1.0;
        const topSpd = def.maxSpeed * surfaceFactor * boostMult;

        if (moveUp) {
          activeVeh.speed += def.accel * boostMult * dt;
        } else if (moveDown) {
          activeVeh.speed -= def.accel * 0.9 * dt;
        } else {
          activeVeh.speed *= Math.pow(0.18, dt);
        }

        if (isHandbrake) {
          activeVeh.speed *= Math.pow(0.12, dt);
          if (Math.abs(activeVeh.speed) > 95) {
            s.skids.push({
              x1: activeVeh.x,
              y1: activeVeh.y,
              x2: activeVeh.x - Math.cos(activeVeh.angle) * 10,
              y2: activeVeh.y - Math.sin(activeVeh.angle) * 10,
              alpha: 0.45,
            });
            if (s.skids.length > 140) s.skids.shift();
          }
        }

        activeVeh.speed = Math.max(-topSpd * 0.45, Math.min(topSpd, activeVeh.speed));
        const steerScale = Math.min(1, Math.abs(activeVeh.speed) / 90) * (activeVeh.speed >= 0 ? 1 : -1);
        const turnBoost = isHandbrake ? 1.35 : 1.0;
        if (moveLeft) activeVeh.angle -= def.turnRate * steerScale * turnBoost * dt;
        if (moveRight) activeVeh.angle += def.turnRate * steerScale * turnBoost * dt;

        const nextX = Math.max(40, Math.min(WORLD_W - 40, activeVeh.x + Math.cos(activeVeh.angle) * activeVeh.speed * dt));
        const nextY = Math.max(40, Math.min(WORLD_H - 40, activeVeh.y + Math.sin(activeVeh.angle) * activeVeh.speed * dt));

        // Building collision check
        const hitBuilding = WORLD_BUILDINGS.some(
          (b) => nextX > b.x - 18 && nextX < b.x + b.w + 18 && nextY > b.y - 18 && nextY < b.y + b.h + 18
        );
        if (hitBuilding) {
          activeVeh.speed *= -0.35;
        } else {
          activeVeh.x = nextX;
          activeVeh.y = nextY;
        }
        s.px = activeVeh.x;
        s.py = activeVeh.y;
        s.pAngle = activeVeh.angle;

        // Speed trap trigger when blasting past 490 px/s in Vice City
        if (Math.abs(activeVeh.speed) > 505 && s.speedTrapCooldown <= 0 && getDistrictAt(s.px, s.py) === 'vice_city') {
          s.wanted = Math.min(5, Math.max(1, s.wanted + 1));
          s.speedTrapCooldown = 14;
          s.score += 35;
          setStatusBanner(
            isEn ? 'VCPD Speed Radar triggered (+1★ Heat)!' : 'Radar viteză VCPD declanșat (+1★ Heat)!'
          );
        }
      } else {
        // On foot movement
        let vx = 0;
        let vy = 0;
        if (moveLeft) vx -= 1;
        if (moveRight) vx += 1;
        if (moveUp) vy -= 1;
        if (moveDown) vy += 1;
        if (vx !== 0 || vy !== 0) {
          const len = Math.hypot(vx, vy);
          vx /= len;
          vy /= len;
          s.pAngle = Math.atan2(vy, vx);
          const walkSpeed = (isBoost ? 235 : 165) * (isWaterTile(s.px, s.py) ? 0.55 : 1);
          const nx = Math.max(30, Math.min(WORLD_W - 30, s.px + vx * walkSpeed * dt));
          const ny = Math.max(30, Math.min(WORLD_H - 30, s.py + vy * walkSpeed * dt));
          const hitB = WORLD_BUILDINGS.some(
            (b) => nx > b.x - 10 && nx < b.x + b.w + 10 && ny > b.y - 10 && ny < b.y + b.h + 10
          );
          if (!hitB) {
            s.px = nx;
            s.py = ny;
          }
        }
      }

      // 2. Update AI Patrol / Traffic Vehicles
      for (const v of s.vehicles) {
        if (v.uid === s.inVehicleUid) continue;
        if (!v.isPolice) {
          // Parked ambient vehicles stay put unless AI street car
          if (v.uid.startsWith('ai_')) {
            const targetX = v.angle === 0 ? 2100 : 1200;
            v.x += Math.cos(v.angle) * 85 * dt;
            if (v.x > 2120) v.angle = Math.PI;
            if (v.x < 1180) v.angle = 0;
            void targetX;
          }
          continue;
        }

        // Police AI
        if (v.aiPhase && v.aiPhase > 3) {
          v.aiPhase = Math.max(0, v.aiPhase - dt); // EMP stunned
          continue;
        }
        const distToPlayer = Math.hypot(s.px - v.x, s.py - v.y);
        if (s.wanted > 0 && distToPlayer < 880) {
          const desiredAngle = Math.atan2(s.py - v.y, s.px - v.x);
          let diff = desiredAngle - v.angle;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          v.angle += Math.max(-2.6 * dt, Math.min(2.6 * dt, diff));
          const chaseSpd = 175 + s.wanted * 32;
          const nx = v.x + Math.cos(v.angle) * chaseSpd * dt;
          const ny = v.y + Math.sin(v.angle) * chaseSpd * dt;
          if (!isWaterTile(nx, ny)) {
            v.x = nx;
            v.y = ny;
          }
          if (distToPlayer < 30) {
            // Bump damage
            const dmg = 14 * dt;
            if (s.armor > 0) s.armor = Math.max(0, s.armor - dmg);
            else s.hp = Math.max(0, s.hp - dmg);
            if (s.hp <= 0) {
              setGameState('SUMMARY');
              persistProgress(Array.from(s.completed), s.score);
              return;
            }
          }
        } else {
          // Gentle patrol loop along vertical road
          v.y += Math.sin(v.angle) * 90 * dt;
          if (v.y < 360) v.angle = Math.PI / 2;
          if (v.y > 1360) v.angle = -Math.PI / 2;
        }
      }

      // 3. Collect Data Shards
      for (const shard of s.shards) {
        if (!shard.collected && Math.hypot(s.px - shard.x, s.py - shard.y) < 34) {
          shard.collected = true;
          const mult = s.hero === 'lucia' ? 1.3 : 1.0;
          const cashBonus = Math.round(120 * mult);
          s.cash += cashBonus;
          s.score += 110;
          sounds.playSuccess();
          void addByteCoins(10, 'Leonida Data Shard');
          setStatusBanner(
            isEn
              ? `Collected Shard ${shard.label}: +$${cashBonus} & +10 ByteCoins!`
              : `Shard ${shard.label} colectat: +$${cashBonus} și +10 ByteCoins!`
          );
        }
      }

      // 4. Safehouse Garage Heal & Heat Clear
      let inSafe = false;
      for (const sh of SAFEHOUSES) {
        if (Math.hypot(s.px - sh.x, s.py - sh.y) < sh.r) {
          inSafe = true;
          if (now - s.lastSafehouseHeal > 1200) {
            s.lastSafehouseHeal = now;
            const cleared = s.wanted > 0;
            s.hp = 100;
            s.armor = s.hero === 'jason' ? 85 : 55;
            s.wanted = 0;
            s.empTimer = 0;
            if (cleared) {
              sounds.playSuccess();
              setStatusBanner(
                isEn
                  ? `${sh.nameEn}: Vehicle repaired, Wanted Heat cleared!`
                  : `${sh.nameRo}: Vehicul reparat & urmărire VCPD anulată!`
              );
            }
          }
        }
      }

      // Wanted heat passive cooldown if far from police
      if (s.wanted > 0) {
        const nearestPolice = s.vehicles
          .filter((v) => v.isPolice)
          .reduce((minD, v) => Math.min(minD, Math.hypot(v.x - s.px, v.y - s.py)), Infinity);
        if (nearestPolice > 520) {
          s.wantedDecay += dt;
          if (s.wantedDecay > 10) {
            s.wantedDecay = 0;
            s.wanted = Math.max(0, s.wanted - 1);
          }
        } else {
          s.wantedDecay = 0;
        }
      }

      // 5. Render Main Viewport Canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const W = canvas.width;
          const H = canvas.height;
          const camX = Math.max(0, Math.min(WORLD_W - W, s.px - W / 2));
          const camY = Math.max(0, Math.min(WORLD_H - H, s.py - H / 2));

          ctx.save();
          ctx.clearRect(0, 0, W, H);

          // Base ground
          ctx.fillStyle = '#14261f';
          ctx.fillRect(0, 0, W, H);

          ctx.translate(-camX, -camY);

          // Region Biome Floor Patches
          // Vice City Urban Asphalt
          ctx.fillStyle = '#1e2436';
          ctx.fillRect(1360, 560, 820, 620);
          // Vice Beach Sand Strip
          ctx.fillStyle = '#d4b483';
          ctx.fillRect(2140, 520, 105, 760);
          // Ocean (East + South Lagoon)
          ctx.fillStyle = '#0369a1';
          ctx.fillRect(2240, 0, 360, WORLD_H);
          ctx.fillRect(0, 1340, 1080, 460);
          // Leonida Keys Islands
          ctx.fillStyle = '#22543d';
          ctx.beginPath();
          ctx.arc(520, 1480, 145, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(280, 1540, 115, 0, Math.PI * 2);
          ctx.fill();
          // Port Gellhorn Concrete Apron
          ctx.fillStyle = '#27272a';
          ctx.fillRect(1180, 1210, 720, 440);
          // Grassrivers Canal
          ctx.strokeStyle = '#0d9488';
          ctx.lineWidth = 104;
          ctx.lineCap = 'round';
          ctx.beginPath();
          for (let wx = 220; wx <= 920; wx += 40) {
            const wy = 910 + Math.sin(wx * 0.011) * 95;
            if (wx === 220) ctx.moveTo(wx, wy);
            else ctx.lineTo(wx, wy);
          }
          ctx.stroke();

          // Paved Roads & Highways
          ctx.fillStyle = '#334155';
          ctx.fillRect(740, 298, 1400, 84); // North Highway
          ctx.fillRect(560, 774, 1600, 92); // Central Ocean Drive Link
          ctx.fillRect(980, 1336, 960, 88); // Port Avenue
          ctx.fillRect(280, 1446, 820, 66); // Coral Keys Bridge
          ctx.fillRect(1634, 320, 92, 1120); // Vice City Strip
          ctx.fillRect(1078, 320, 84, 1160); // Central Spine
          ctx.fillRect(624, 780, 72, 700); // West Coast Road

          // Road Center Dashes
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 3;
          ctx.setLineDash([24, 22]);
          ctx.beginPath();
          ctx.moveTo(740, 340);
          ctx.lineTo(2140, 340);
          ctx.moveTo(560, 820);
          ctx.lineTo(2160, 820);
          ctx.moveTo(980, 1380);
          ctx.lineTo(1940, 1380);
          ctx.moveTo(1680, 320);
          ctx.lineTo(1680, 1440);
          ctx.moveTo(1120, 320);
          ctx.lineTo(1120, 1480);
          ctx.stroke();
          ctx.setLineDash([]);

          // Tire Skid Marks
          for (const sk of s.skids) {
            ctx.strokeStyle = `rgba(15, 23, 42, ${sk.alpha})`;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(sk.x1, sk.y1);
            ctx.lineTo(sk.x2, sk.y2);
            ctx.stroke();
          }

          // Buildings
          for (const b of WORLD_BUILDINGS) {
            ctx.fillStyle = '#090d16';
            ctx.fillRect(b.x + 6, b.y + 6, b.w, b.h);
            ctx.fillStyle = b.roof;
            ctx.fillRect(b.x, b.y, b.w, b.h);
            ctx.strokeStyle = b.trim;
            ctx.lineWidth = 2.5;
            ctx.strokeRect(b.x, b.y, b.w, b.h);
          }

          // Palm trees along Vice Beach
          for (let py = 560; py <= 1140; py += 120) {
            ctx.fillStyle = '#15803d';
            ctx.beginPath();
            ctx.arc(2115, py, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#22c55e';
            ctx.beginPath();
            ctx.arc(2115, py, 9, 0, Math.PI * 2);
            ctx.fill();
          }

          // Safehouse Garages
          for (const sh of SAFEHOUSES) {
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 3;
            ctx.fillStyle = 'rgba(16, 185, 129, 0.14)';
            ctx.beginPath();
            ctx.arc(sh.x, sh.y, sh.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#a7f3d0';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(isEn ? 'GARAGE' : 'GARAJ', sh.x, sh.y + 4);
          }

          // 6 District Story Mission Beacons
          const pulse = 0.5 + 0.5 * Math.sin(now * 0.005);
          for (const region of LEONIDA_REGIONS) {
            const ch = LEONIDA_STORY_CHALLENGES.find((c) => c.districtId === region.id);
            const isDone = ch ? s.completed.has(ch.id) : false;
            ctx.strokeStyle = isDone ? '#10b981' : region.accentHex;
            ctx.lineWidth = isDone ? 2 : 3.5;
            ctx.fillStyle = isDone ? 'rgba(16,185,129,0.16)' : 'rgba(236,72,153,0.18)';
            ctx.beginPath();
            ctx.arc(region.worldX, region.worldY, 34 + pulse * 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(isDone ? '✓ DONE' : 'MISSION', region.worldX, region.worldY + 4);
          }

          // Collectible Data Shards
          for (const shard of s.shards) {
            if (shard.collected) continue;
            ctx.save();
            ctx.translate(shard.x, shard.y);
            ctx.rotate(now * 0.0025);
            ctx.fillStyle = '#22d3ee';
            ctx.fillRect(-8, -8, 16, 16);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(-8, -8, 16, 16);
            ctx.restore();
          }

          // Vehicles
          for (const v of s.vehicles) {
            ctx.save();
            ctx.translate(v.x, v.y);
            ctx.rotate(v.angle);
            const hl = v.def.length / 2;
            const hw = v.def.width / 2;
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.fillRect(-hl + 3, -hw + 3, v.def.length, v.def.width);
            ctx.fillStyle = v.def.bodyColor;
            ctx.fillRect(-hl, -hw, v.def.length, v.def.width);
            ctx.fillStyle = v.def.stripeColor;
            ctx.fillRect(-hl + 4, -3, v.def.length - 8, 6);
            // Windshield
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, -hw + 4, 11, v.def.width - 8);
            // Police Siren strobes
            if (v.isPolice && (s.wanted > 0 || Math.floor(now / 180) % 2 === 0)) {
              ctx.fillStyle = Math.floor(now / 150) % 2 === 0 ? '#ef4444' : '#3b82f6';
              ctx.fillRect(-4, -hw + 3, 6, v.def.width - 6);
            }
            ctx.restore();
          }

          // EMP Shockwave Ring
          if (s.empRingRadius > 0) {
            ctx.strokeStyle = 'rgba(34, 211, 238, 0.8)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(s.px, s.py, s.empRingRadius, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Player on foot
          if (!s.inVehicleUid) {
            ctx.save();
            ctx.translate(s.px, s.py);
            ctx.rotate(s.pAngle);
            ctx.fillStyle = s.hero === 'lucia' ? '#f43f5e' : '#38bdf8';
            ctx.beginPath();
            ctx.arc(0, 0, 11, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            // Facing indicator
            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            ctx.arc(9, 0, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // GPS Arrow around Player pointing toward selected gpsTarget
          const gpsRegion = LEONIDA_REGIONS.find((r) => r.id === s.gpsTarget);
          if (gpsRegion) {
            const dGps = Math.hypot(gpsRegion.worldX - s.px, gpsRegion.worldY - s.py);
            if (dGps > 85) {
              const ang = Math.atan2(gpsRegion.worldY - s.py, gpsRegion.worldX - s.px);
              const ax = s.px + Math.cos(ang) * 46;
              const ay = s.py + Math.sin(ang) * 46;
              ctx.save();
              ctx.translate(ax, ay);
              ctx.rotate(ang);
              ctx.fillStyle = '#facc15';
              ctx.beginPath();
              ctx.moveTo(10, 0);
              ctx.lineTo(-5, -6);
              ctx.lineTo(-5, 6);
              ctx.closePath();
              ctx.fill();
              ctx.restore();
            }
          }

          ctx.restore();
        }
      }

      // 6. Render Radar Minimap
      const mini = minimapRef.current;
      if (mini) {
        const mctx = mini.getContext('2d');
        if (mctx) {
          const mw = mini.width;
          const mh = mini.height;
          mctx.fillStyle = '#090d16';
          mctx.fillRect(0, 0, mw, mh);

          // Water preview
          mctx.fillStyle = '#0c4a6e';
          mctx.fillRect((2240 / WORLD_W) * mw, 0, mw, mh);
          mctx.fillRect(0, (1340 / WORLD_H) * mh, (1080 / WORLD_W) * mw, mh);

          // Roads
          mctx.strokeStyle = '#475569';
          mctx.lineWidth = 2;
          mctx.beginPath();
          mctx.moveTo((740 / WORLD_W) * mw, (340 / WORLD_H) * mh);
          mctx.lineTo((2140 / WORLD_W) * mw, (340 / WORLD_H) * mh);
          mctx.moveTo((560 / WORLD_W) * mw, (820 / WORLD_H) * mh);
          mctx.lineTo((2160 / WORLD_W) * mw, (820 / WORLD_H) * mh);
          mctx.moveTo((1680 / WORLD_W) * mw, (320 / WORLD_H) * mh);
          mctx.lineTo((1680 / WORLD_W) * mw, (1440 / WORLD_H) * mh);
          mctx.stroke();

          // Mission pins
          for (const r of LEONIDA_REGIONS) {
            const mx = (r.worldX / WORLD_W) * mw;
            const my = (r.worldY / WORLD_H) * mh;
            const ch = LEONIDA_STORY_CHALLENGES.find((c) => c.districtId === r.id);
            const done = ch ? s.completed.has(ch.id) : false;
            mctx.fillStyle = done ? '#10b981' : r.id === s.gpsTarget ? '#facc15' : '#ec4899';
            mctx.beginPath();
            mctx.arc(mx, my, r.id === s.gpsTarget ? 4.5 : 3, 0, Math.PI * 2);
            mctx.fill();
          }

          // Police blips
          for (const v of s.vehicles) {
            if (!v.isPolice) continue;
            mctx.fillStyle = '#ef4444';
            mctx.fillRect((v.x / WORLD_W) * mw - 2, (v.y / WORLD_H) * mh - 2, 4, 4);
          }

          // Player blip
          mctx.fillStyle = '#ffffff';
          mctx.beginPath();
          mctx.arc((s.px / WORLD_W) * mw, (s.py / WORLD_H) * mh, 4, 0, Math.PI * 2);
          mctx.fill();
        }
      }

      // 7. Throttled HUD Sync (every ~120ms)
      hudSyncAcc += dt;
      if (hudSyncAcc > 0.12) {
        hudSyncAcc = 0;
        let nearVeh: WorldVehicle | null = null;
        if (!s.inVehicleUid) {
          for (const v of s.vehicles) {
            if (Math.hypot(v.x - s.px, v.y - s.py) < 68) {
              nearVeh = v;
              break;
            }
          }
        }
        const nearMission =
          LEONIDA_REGIONS.find((r) => Math.hypot(s.px - r.worldX, s.py - r.worldY) < 70)?.id || '';
        const nearSafe = SAFEHOUSES.some((sh) => Math.hypot(s.px - sh.x, s.py - sh.y) < sh.r + 10);

        setHud({
          cash: s.cash,
          score: s.score,
          hp: Math.round(s.hp),
          armor: Math.round(s.armor),
          wanted: s.wanted,
          speedKmh: activeVeh ? Math.round(Math.abs(activeVeh.speed) * 0.36) : 0,
          districtId: getDistrictAt(s.px, s.py),
          inVehicleNameRo: activeVeh ? activeVeh.def.nameRo : '',
          inVehicleNameEn: activeVeh ? activeVeh.def.nameEn : '',
          nearVehicleNameRo: nearVeh ? nearVeh.def.nameRo : '',
          nearVehicleNameEn: nearVeh ? nearVeh.def.nameEn : '',
          nearMissionId: nearMission,
          nearSafehouse: nearSafe,
          empCooldown: Math.ceil(s.empTimer),
          shardsCollected: s.shards.filter((sh) => sh.collected).length,
          contractsDone: s.contractsDone,
        });
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [gameState, isEn, persistProgress]);

  const handleSubmitStoryChallenge = (mcqChoice?: number) => {
    if (!activeChallenge) return;
    let isCorrect = false;
    if (activeChallenge.kind === 'binary4') {
      const dec = binaryBits[0] * 8 + binaryBits[1] * 4 + binaryBits[2] * 2 + binaryBits[3] * 1;
      isCorrect = dec === activeChallenge.targetAnswer;
    } else if (activeChallenge.kind === 'mcq') {
      isCorrect = mcqChoice === activeChallenge.targetAnswer;
    } else if (activeChallenge.kind === 'short-code') {
      const norm = shortInput.trim().toLowerCase();
      const target = String(activeChallenge.targetAnswer).trim().toLowerCase();
      const aliases = (activeChallenge.acceptedAliases || []).map((a) => a.trim().toLowerCase());
      isCorrect = norm === target || aliases.includes(norm);
    }

    if (!isCorrect) {
      sounds.playError();
      setChallengeFeedback({
        ok: false,
        msg: isEn
          ? 'Incorrect checksum! Review the hint or verify your calculation.'
          : 'Verificare eșuată! Verifică calculul sau deschide indiciul de mai jos.',
      });
      return;
    }

    sounds.playSuccess();
    const s = simRef.current;
    const isFirstTime = !s.completed.has(activeChallenge.id);
    const mult = s.hero === 'lucia' ? 1.3 : 1.0;
    const cashGain = Math.round(activeChallenge.rewardCash * mult);
    s.cash += cashGain;
    s.score += activeChallenge.rewardXP + (isFirstTime ? 200 : 60);
    s.wanted = Math.min(5, Math.max(2, s.wanted + 1)); // Vault breach triggers VCPD chase!

    const nextCompleted = Array.from(new Set([...Array.from(s.completed), activeChallenge.id]));
    s.completed = new Set(nextCompleted);
    setCompletedMissions(nextCompleted);
    persistProgress(nextCompleted, s.score);

    if (isFirstTime) {
      void addByteCoins(activeChallenge.rewardCoins, `Leonida Heist: ${activeChallenge.id}`);
      onAwardXP?.(activeChallenge.rewardXP, `Vice Leonida: ${activeChallenge.titleRo}`);
    }

    const nextPending = LEONIDA_STORY_CHALLENGES.find((c) => !s.completed.has(c.id));
    if (nextPending) setGpsTargetId(nextPending.districtId);

    setChallengeFeedback({
      ok: true,
      msg: isEn
        ? `Vault Unlocked! +$${cashGain}, +${activeChallenge.rewardXP} pts${isFirstTime ? ` & +${activeChallenge.rewardCoins} ByteCoins` : ''}. Escape VCPD or visit a Garage!`
        : `Seif Deblocat! +$${cashGain}, +${activeChallenge.rewardXP} pts${isFirstTime ? ` și +${activeChallenge.rewardCoins} ByteCoins` : ''}. Scăpați de VCPD sau intrați într-un Garaj!`,
    });
  };

  const handleSubmitSideContract = (choiceIdx: number) => {
    if (activeContractIdx === null) return;
    const contract = LEONIDA_SIDE_CONTRACTS[activeContractIdx];
    const s = simRef.current;
    if (choiceIdx === contract.correctIdx) {
      sounds.playSuccess();
      const gain = Math.round(contract.rewardCash * (s.hero === 'lucia' ? 1.3 : 1));
      s.cash += gain;
      s.score += 180;
      s.contractsDone += 1;
      s.contractCooldown = 14;
      void addByteCoins(15, 'Leonida Street Contract');
      persistProgress(Array.from(s.completed), s.score);
      setChallengeFeedback({
        ok: true,
        msg: isEn
          ? `Contract complete! +$${gain} & +15 ByteCoins.`
          : `Contract finalizat! +$${gain} și +15 ByteCoins.`,
      });
    } else {
      sounds.playError();
      setChallengeFeedback({
        ok: false,
        msg: isEn ? 'Wrong answer — contract aborted.' : 'Răspuns greșit — contract anulat.',
      });
    }
  };

  const spawnSafehouseRide = (vehicleDef: LeonidaVehicleDef) => {
    const s = simRef.current;
    const newUid = `custom_${vehicleDef.id}_${Date.now()}`;
    s.vehicles.push({
      uid: newUid,
      def: vehicleDef,
      x: s.px + 42,
      y: s.py,
      angle: 0,
      vx: 0,
      vy: 0,
      speed: 0,
      hp: vehicleDef.armor,
    });
    s.inVehicleUid = newUid;
    sounds.playSuccess();
    setGameState('PLAYING');
    setStatusBanner(
      isEn ? `Delivered ${vehicleDef.nameEn} to your GPS position!` : `Vehicul livrat: ${vehicleDef.nameRo}!`
    );
  };

  const activeDistrictObj = LEONIDA_REGIONS.find((r) => r.id === hud.districtId) || LEONIDA_REGIONS[0];
  const studentDisplay = studentName || getActiveStudent()?.username || 'Leonida Agent';
  const activeHeroObj = LEONIDA_CAST.find((c) => c.id === hero) || LEONIDA_CAST[0];

  return (
    <div className="space-y-2.5 sm:space-y-4 pb-4">
      {/* Top Workspace Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 bg-slate-900/95 border border-slate-800 rounded-2xl px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[36px] sm:min-h-[40px]"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{isEn ? 'Back' : 'Înapoi'}</span>
          </button>

          <div className="min-w-0">
            <h2 className="text-xs sm:text-base font-extrabold text-white truncate">
              {isEn ? 'Vice Leonida: Open World (GTA 6 Tech)' : 'Vice Leonida: Open World (GTA 6 Tech)'}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 truncate">
              {studentDisplay} · {completedMissions.length}/6 {isEn ? 'Districts' : 'Regiuni'} ·{' '}
              <span className="tabular-nums font-semibold text-amber-300">
                {bestScore.toLocaleString()} pts
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-wrap">
          {gameState === 'PLAYING' && (
            <>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setRadio((prev) => (prev === 'vice84' ? 'leonida_bass' : prev === 'leonida_bass' ? 'off' : 'vice84'));
                }}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer whitespace-nowrap shrink-0 min-h-[36px]"
                title={isEn ? 'Switch Radio (Key N)' : 'Schimbă Radio (Tasta N)'}
              >
                <Radio className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                <span className="hidden xs:inline">
                  {radio === 'vice84'
                    ? 'Vice 84'
                    : radio === 'leonida_bass'
                    ? 'Leonida Bass'
                    : isEn
                    ? 'Radio Off'
                    : 'Radio Oprit'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setGameState('PAUSED_MAP');
                }}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 text-xs font-bold flex items-center gap-1.5 border border-amber-500/40 cursor-pointer whitespace-nowrap shrink-0 min-h-[36px]"
              >
                <MapIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{isEn ? 'Map (M)' : 'Hartă (M)'}</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => {
              const next = !soundOn;
              setSoundOn(next);
              sounds.setEnabled(next);
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label={isEn ? 'Toggle Sound' : 'Comută Sunet'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* TITLE MENU SCREEN */}
      {gameState === 'TITLE_MENU' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-7 relative h-44 sm:h-64 lg:h-auto lg:min-h-[260px] bg-slate-950">
              <img
                src={leonidaHeroImg}
                alt={isEn ? 'Vice Leonida coastal boulevard at sunset' : 'Bulevardul Vice Leonida la apus'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent flex flex-col justify-end p-4 sm:p-6">
                <p className="text-[11px] sm:text-xs font-mono text-amber-300 font-semibold">
                  {isEn ? 'State of Leonida · 6 Regions · 5 Drivable Vehicles' : 'Statul Leonida · 6 Regiuni · 5 Vehicule Pilotabile'}
                </p>
                <h1 className="text-xl sm:text-3xl font-black text-white font-heading mt-1 leading-tight">
                  {isEn ? 'Vice Leonida: Open-World Story Sandbox' : 'Vice Leonida: Open-World & Misiuni TIC'}
                </h1>
              </div>
            </div>

            <div className="lg:col-span-5 p-4 sm:p-6 flex flex-col justify-between gap-4 sm:gap-5 bg-slate-900">
              <div className="space-y-3 sm:space-y-4">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {isEn
                    ? 'Roam freely across Vice City, Leonida Keys, Port Gellhorn, Grassrivers, Mount Kalaga, and Ambrosia. Hop into supercars or the swamp Hydro-Airboat, evade 1★–5★ patrols, and solve real Binary, C++, Excel, and Arduino missions.'
                    : 'Explorează liber Vice City, Leonida Keys, Port Gellhorn, Grassrivers, Mount Kalaga și Ambrosia. Urcă în mașini sau în Hydro-Airboat pe apă, scapă de urmăririle 1★–5★ și rezolvă misiuni de Binar, C++, Excel și Arduino.'}
                </p>

                {/* Choose Starting Protagonist */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-300">
                    {isEn ? 'Select Starting Protagonist (Swap live with Q):' : 'Alege Protagonistul (Schimb live cu Q):'}
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {(['lucia', 'jason'] as HeroId[]).map((hId) => {
                      const c = LEONIDA_CAST.find((m) => m.id === hId)!;
                      const active = hero === hId;
                      return (
                        <button
                          key={hId}
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            setHero(hId);
                          }}
                          className={`p-2.5 sm:p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                            active
                              ? 'bg-emerald-500/15 border-emerald-400 text-white'
                              : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-black">{c.name}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                            {isEn ? c.perkEn : c.perkRo}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Concise Key Controls */}
                <div className="hidden sm:block p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                  <div className="font-bold text-white">{isEn ? 'Controls:' : 'Controale esențiale:'}</div>
                  <div>• <strong>WASD / {isEn ? 'Arrows' : 'Săgeți'}</strong> — {isEn ? 'Walk or Drive' : 'Mers pe jos sau Condus'}</div>
                  <div>• <strong>E / F</strong> — {isEn ? 'Enter/Exit Vehicle or Start Mission' : 'Intră/Ieși din Vehicul sau Pornește Misiune'}</div>
                  <div>• <strong>Q</strong> — {isEn ? 'Swap Lucia / Jason' : 'Schimbă Lucia / Jason'} · <strong>C</strong> — EMP · <strong>M</strong> — {isEn ? 'World Map' : 'Hartă'}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={startNewCampaign}
                className="w-full py-3.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg"
              >
                <Play className="w-4 h-4 shrink-0" />
                <span>{isEn ? 'Start Open-World Campaign' : 'Pornește Campania Open-World'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE PLAYING CANVAS & HUD */}
      {gameState !== 'TITLE_MENU' && gameState !== 'SUMMARY' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-2 sm:p-4 space-y-2 sm:space-y-3 shadow-2xl">
          {/* Classic Clean GTA Top Telemetry Strip */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-1.5 sm:gap-2.5 tabular-nums">
            <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">{activeHeroObj.name}</div>
                <div className="text-[11px] sm:text-xs font-bold text-white truncate">
                  HP {hud.hp}% · ARM {hud.armor}%
                </div>
              </div>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
              <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                  {isEn ? activeDistrictObj.nameEn : activeDistrictObj.nameRo}
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-cyan-300 truncate">
                  {hud.inVehicleNameEn
                    ? `${isEn ? hud.inVehicleNameEn : hud.inVehicleNameRo} · ${hud.speedKmh} km/h`
                    : isEn
                    ? 'On Foot'
                    : 'Pe jos'}
                </div>
              </div>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] sm:text-[11px] text-slate-400">{isEn ? 'Wanted' : 'Urmărire'}</div>
                <div className="text-[11px] sm:text-xs font-black tracking-widest text-amber-300">
                  {'★'.repeat(hud.wanted) + '☆'.repeat(5 - hud.wanted)}
                </div>
              </div>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] sm:text-[11px] text-slate-400">{isEn ? 'Cash & Score' : 'Cash & Scor'}</div>
                <div className="text-[11px] sm:text-xs font-black text-emerald-300 truncate">
                  ${hud.cash.toLocaleString()} · {hud.score.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="col-span-2 md:col-span-1 p-1.5 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[10px] sm:text-[11px] text-slate-400">Shards / Missions</div>
                <div className="text-[11px] sm:text-xs font-bold text-white">
                  {hud.shardsCollected}/10 · {completedMissions.length}/6
                </div>
              </div>
              <button
                type="button"
                onClick={handleTriggerSideContract}
                disabled={hud.contractsDone > 12}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-black cursor-pointer whitespace-nowrap shrink-0"
              >
                {isEn ? '+ Street Job' : '+ Contract'}
              </button>
            </div>
          </div>

          {/* Canvas Container + Minimap */}
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
            <canvas
              ref={canvasRef}
              width={960}
              height={540}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                dragStickRef.current = { active: true, startX: e.clientX, startY: e.clientY };
                touchInputRef.current.dx = 0;
                touchInputRef.current.dy = 0;
              }}
              onPointerMove={(e) => {
                if (!dragStickRef.current.active) return;
                const rawDx = e.clientX - dragStickRef.current.startX;
                const rawDy = e.clientY - dragStickRef.current.startY;
                touchInputRef.current.dx = Math.max(-1, Math.min(1, rawDx / 32));
                touchInputRef.current.dy = Math.max(-1, Math.min(1, rawDy / 32));
                touchInputRef.current.accel = rawDy < -12;
                touchInputRef.current.brake = rawDy > 14;
              }}
              onPointerUp={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                  e.currentTarget.releasePointerCapture(e.pointerId);
                }
                dragStickRef.current.active = false;
                touchInputRef.current.dx = 0;
                touchInputRef.current.dy = 0;
                touchInputRef.current.accel = false;
                touchInputRef.current.brake = false;
              }}
              onPointerCancel={() => {
                dragStickRef.current.active = false;
                touchInputRef.current.dx = 0;
                touchInputRef.current.dy = 0;
                touchInputRef.current.accel = false;
                touchInputRef.current.brake = false;
              }}
              className="w-full h-auto block max-h-[560px] object-contain mx-auto touch-none cursor-crosshair"
            />

            {/* Bottom-Left GPS Radar Minimap */}
            <div className="hidden sm:block absolute bottom-3 left-3 p-1.5 rounded-xl bg-slate-950/90 border border-slate-700 shadow-xl pointer-events-none">
              <canvas ref={minimapRef} width={160} height={110} className="rounded-lg block" />
              <div className="text-[10px] font-mono text-slate-300 mt-1 flex items-center justify-between">
                <span>GPS RADAR</span>
                <span className="text-amber-300">{hud.shardsCollected}/10</span>
              </div>
            </div>

            {/* Bottom-Center Contextual Prompt Banner */}
            {(hud.nearMissionId || hud.nearVehicleNameEn || hud.nearSafehouse || statusBanner) && (
              <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 bg-slate-950/92 border border-slate-700 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs text-white font-semibold flex items-center gap-2 sm:gap-3 shadow-xl max-w-[94%]">
                {hud.nearMissionId ? (
                  <button
                    type="button"
                    onClick={handleOpenNearestChallenge}
                    className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {isEn ? 'Start District Mission (E / Enter)' : 'Deschide Misiunea (E / Enter)'}
                  </button>
                ) : hud.nearVehicleNameEn ? (
                  <button
                    type="button"
                    onClick={handleToggleEnterExit}
                    className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {isEn ? `Enter ${hud.nearVehicleNameEn} (E)` : `Urcă în ${hud.nearVehicleNameRo} (E)`}
                  </button>
                ) : hud.nearSafehouse ? (
                  <span className="text-emerald-300 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" />
                    {isEn ? 'Safehouse Active: Armor & Heat Cleared' : 'Garaj Activ: Reparat & Heat Curățat'}
                  </span>
                ) : (
                  <span className="truncate">{statusBanner}</span>
                )}
              </div>
            )}
          </div>

          {/* Mobile/Tablet Touch Pad placed immediately below canvas for ergonomic thumb reach */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 lg:hidden w-full sm:w-auto justify-center sm:justify-start bg-slate-900/90 border border-slate-800 rounded-xl p-1.5">
              <button
                type="button"
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  touchInputRef.current.dx = -1;
                }}
                onPointerUp={(e) => {
                  if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
                  touchInputRef.current.dx = 0;
                }}
                onPointerCancel={() => (touchInputRef.current.dx = 0)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 active:bg-cyan-600 text-white text-xs font-bold select-none touch-none min-h-[44px] min-w-[46px]"
                aria-label={isEn ? 'Steer left' : 'Viraj stânga'}
              >
                ◀
              </button>
              <button
                type="button"
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  touchInputRef.current.accel = true;
                  touchInputRef.current.dy = -1;
                }}
                onPointerUp={(e) => {
                  if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
                  touchInputRef.current.accel = false;
                  touchInputRef.current.dy = 0;
                }}
                onPointerCancel={() => {
                  touchInputRef.current.accel = false;
                  touchInputRef.current.dy = 0;
                }}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-600 active:bg-emerald-500 text-white text-xs font-black select-none touch-none min-h-[44px]"
              >
                {isEn ? 'Up / Gas ▲' : 'Sus / Gaz ▲'}
              </button>
              <button
                type="button"
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  touchInputRef.current.brake = true;
                  touchInputRef.current.dy = 1;
                }}
                onPointerUp={(e) => {
                  if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
                  touchInputRef.current.brake = false;
                  touchInputRef.current.dy = 0;
                }}
                onPointerCancel={() => {
                  touchInputRef.current.brake = false;
                  touchInputRef.current.dy = 0;
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-700 active:bg-rose-600 text-white text-xs font-bold select-none touch-none min-h-[44px] min-w-[46px]"
                aria-label={isEn ? 'Brake / Down' : 'Jos / Frână'}
              >
                ▼
              </button>
              <button
                type="button"
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  touchInputRef.current.dx = 1;
                }}
                onPointerUp={(e) => {
                  if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
                  touchInputRef.current.dx = 0;
                }}
                onPointerCancel={() => (touchInputRef.current.dx = 0)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 active:bg-cyan-600 text-white text-xs font-bold select-none touch-none min-h-[44px] min-w-[46px]"
                aria-label={isEn ? 'Steer right' : 'Viraj dreapta'}
              >
                ▶
              </button>
            </div>

            {/* Action Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={handleToggleEnterExit}
                className="px-2.5 sm:px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Car className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>
                  {hud.inVehicleNameEn
                    ? isEn
                      ? 'Exit Vehicle (E)'
                      : 'Ieși (E)'
                    : isEn
                    ? 'Enter Vehicle (E)'
                    : 'Urcă (E)'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setHero((p) => (p === 'lucia' ? 'jason' : 'lucia'));
                }}
                className="px-2.5 sm:px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Shield className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{isEn ? `Hero: ${activeHeroObj.name.split(' ')[0]}` : `${activeHeroObj.name.split(' ')[0]} [Q]`}</span>
              </button>

              <button
                type="button"
                onClick={handleTriggerEmp}
                disabled={hud.empCooldown > 0}
                className="px-2.5 sm:px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 border border-slate-700 text-xs font-bold text-cyan-300 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Zap className="w-3.5 h-3.5 shrink-0" />
                <span>{hud.empCooldown > 0 ? `EMP (${hud.empCooldown}s)` : 'EMP (C)'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                persistProgress(completedMissions, simRef.current.score);
                setGameState('SUMMARY');
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
            >
              {isEn ? 'End Session & Save' : 'Încheie & Salvează'}
            </button>
          </div>
        </div>
      )}

      {/* PAUSED WORLD MAP & GARAGE SPAWNER MODAL */}
      {gameState === 'PAUSED_MAP' && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-start sm:items-center justify-center p-3 sm:p-4 pb-24 sm:pb-4 overflow-y-auto">
          <div className="max-w-5xl w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 sm:p-6 space-y-5 shadow-2xl my-0 sm:my-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-white">
                  {isEn ? 'State of Leonida — GPS Map & Vehicle Delivery' : 'Statul Leonida — Hartă GPS & Livrare Vehicule'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isEn ? 'Click any district pin to set GPS waypoint or request a ride.' : 'Apasă pe orice regiune pentru GPS sau comandă un vehicul.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setGameState('PLAYING')}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black cursor-pointer whitespace-nowrap shrink-0"
              >
                {isEn ? 'Resume Game' : 'Continuă Jocul'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Map with Interactive Pins */}
              <div className="lg:col-span-7 space-y-2.5">
                <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img
                    src={leonidaMapImg}
                    alt="State of Leonida Map"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto block"
                  />
                  {LEONIDA_REGIONS.map((reg, idx) => {
                    const ch = LEONIDA_STORY_CHALLENGES.find((c) => c.districtId === reg.id);
                    const isDone = ch ? completedMissions.includes(ch.id) : false;
                    const isSelected = gpsTargetId === reg.id;
                    return (
                      <button
                        key={reg.id}
                        type="button"
                        aria-label={isEn ? reg.nameEn : reg.nameRo}
                        onClick={() => {
                          sounds.playClick();
                          setGpsTargetId(reg.id);
                        }}
                        style={{ left: `${reg.mapPctX}%`, top: `${reg.mapPctY}%` }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-auto sm:h-auto sm:px-2.5 sm:py-1 rounded-full sm:rounded-lg text-[11px] font-black shadow-lg border cursor-pointer transition-transform flex items-center justify-center gap-1 whitespace-nowrap ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 border-white scale-110 z-10'
                            : isDone
                            ? 'bg-emerald-600 text-white border-emerald-300'
                            : 'bg-slate-950/90 text-white border-fuchsia-400 hover:scale-105'
                        }`}
                      >
                        <span className="sm:hidden font-mono">{isDone ? '✓' : idx + 1}</span>
                        <span className="hidden sm:inline">{isDone ? '✓ ' : ''}{reg.nameRo.split('·')[0].trim()}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Quick GPS Target Strip on Mobile (< sm) */}
                <div className="grid grid-cols-2 sm:hidden gap-1.5">
                  {LEONIDA_REGIONS.map((reg, idx) => {
                    const ch = LEONIDA_STORY_CHALLENGES.find((c) => c.districtId === reg.id);
                    const isDone = ch ? completedMissions.includes(ch.id) : false;
                    const isSelected = gpsTargetId === reg.id;
                    return (
                      <button
                        key={reg.id}
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setGpsTargetId(reg.id);
                        }}
                        className={`px-2.5 py-2 rounded-lg border text-left text-[11px] font-bold flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 border-white'
                            : isDone
                            ? 'bg-emerald-950/50 text-emerald-200 border-emerald-500/40'
                            : 'bg-slate-950 text-slate-200 border-slate-800'
                        }`}
                      >
                        <span className="font-mono shrink-0">{isDone ? '✓' : `0${idx + 1}`}</span>
                        <span className="truncate">{reg.nameRo.split('·')[0].trim()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: District Info & Instant Vehicle Delivery */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                {(() => {
                  const selected = LEONIDA_REGIONS.find((r) => r.id === gpsTargetId) || LEONIDA_REGIONS[0];
                  return (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="text-xs font-mono text-amber-300">
                        {isEn ? 'ACTIVE GPS TARGET' : 'ȚINTĂ GPS ACTIVĂ'}
                      </div>
                      <h4 className="text-base font-black text-white">
                        {isEn ? selected.nameEn : selected.nameRo}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {isEn ? selected.descriptionEn : selected.descriptionRo}
                      </p>
                      <div className="text-xs font-semibold text-emerald-300 pt-1">
                        {isEn ? selected.curriculumTopicEn : selected.curriculumTopicRo}
                      </div>
                    </div>
                  );
                })()}

                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-300">
                    {isEn ? 'Call Mechanic (Instant Vehicle Drop):' : 'Mecanic Rapid (Livrează Vehicul la Tine):'}
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {LEONIDA_VEHICLES.map((veh) => (
                      <button
                        key={veh.id}
                        type="button"
                        onClick={() => spawnSafehouseRide(veh)}
                        className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-left cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{isEn ? veh.nameEn : veh.nameRo}</div>
                          <div className="text-[11px] text-slate-400">
                            {isEn ? veh.categoryEn : veh.categoryRo}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-cyan-300 whitespace-nowrap shrink-0">
                          {isEn ? 'Deliver' : 'Livrează'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE MISSION / CONTRACT CHALLENGE TERMINAL */}
      {gameState === 'CHALLENGE' && (activeChallenge || activeContractIdx !== null) && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-start sm:items-center justify-center p-3 sm:p-4 pb-24 sm:pb-4 overflow-y-auto">
          <div className="max-w-2xl w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl my-0 sm:my-auto">
            {activeChallenge ? (
              <>
                <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <div className="text-xs font-mono text-emerald-300">
                      {isEn ? activeChallenge.curriculumTagEn : activeChallenge.curriculumTagRo}
                    </div>
                    <h3 className="text-lg font-black text-white mt-0.5">
                      {isEn ? activeChallenge.titleEn : activeChallenge.titleRo}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGameState('PLAYING')}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed">
                  {isEn ? activeChallenge.briefingEn : activeChallenge.briefingRo}
                </p>

                {activeChallenge.codeSnippet && (
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
                    <code>{activeChallenge.codeSnippet}</code>
                  </pre>
                )}

                {/* Binary 4-Bit Interactive Bit Toggles */}
                {activeChallenge.kind === 'binary4' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-3">
                      {[8, 4, 2, 1].map((weight, i) => (
                        <button
                          key={weight}
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            setBinaryBits((prev) => {
                              const next = [...prev] as [number, number, number, number];
                              next[i] = next[i] === 1 ? 0 : 1;
                              return next;
                            });
                          }}
                          className={`py-4 rounded-xl border font-mono text-center cursor-pointer transition-colors ${
                            binaryBits[i] === 1
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          <div className="text-2xl font-black">{binaryBits[i]}</div>
                          <div className="text-[11px] mt-1">× {weight}</div>
                        </button>
                      ))}
                    </div>
                    <div className="text-xs font-mono text-center text-slate-300">
                      {isEn ? 'Current Decimal Value:' : 'Valoare Zecimală Curentă:'}{' '}
                      <strong className="text-amber-300">
                        {binaryBits[0] * 8 + binaryBits[1] * 4 + binaryBits[2] * 2 + binaryBits[3]}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSubmitStoryChallenge()}
                      className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm cursor-pointer"
                    >
                      {isEn ? 'Verify Binary Key' : 'Verifică Codul Binar'}
                    </button>
                  </div>
                )}

                {/* MCQ Options */}
                {activeChallenge.kind === 'mcq' && (
                  <div className="space-y-2">
                    {(isEn ? activeChallenge.optionsEn : activeChallenge.optionsRo)?.map((opt, idx) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSubmitStoryChallenge(idx)}
                        className="w-full p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-400 text-left text-xs sm:text-sm font-semibold text-slate-100 cursor-pointer transition-colors"
                      >
                        <span className="font-mono text-cyan-400 mr-2">{String.fromCharCode(65 + idx)}.</span>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Short Code / Output Input */}
                {activeChallenge.kind === 'short-code' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmitStoryChallenge();
                    }}
                    className="flex flex-col sm:flex-row gap-2.5"
                  >
                    <input
                      type="text"
                      value={shortInput}
                      onChange={(e) => setShortInput(e.target.value)}
                      placeholder={isEn ? 'Type exact answer...' : 'Scrie răspunsul exact...'}
                      className="flex-1 bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm cursor-pointer whitespace-nowrap shrink-0"
                    >
                      {isEn ? 'Submit Code' : 'Verifică Răspuns'}
                    </button>
                  </form>
                )}

                {/* Hint & Feedback */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowHint((p) => !p)}
                    className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showHint ? (isEn ? 'Hide Hint' : 'Ascunde Indiciul') : (isEn ? 'Show Hint' : 'Arată Indiciu')}</span>
                  </button>
                  {onOpenLesson && (
                    <button
                      type="button"
                      onClick={() => onOpenLesson(activeChallenge.relatedMissionId)}
                      className="text-xs font-bold text-cyan-300 hover:text-cyan-200 cursor-pointer"
                    >
                      {isEn ? 'Study Related Lesson →' : 'Deschide Lecția Asociată →'}
                    </button>
                  )}
                </div>

                {showHint && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
                    {isEn ? activeChallenge.hintEn : activeChallenge.hintRo}
                  </div>
                )}

                {challengeFeedback && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between gap-3 ${
                      challengeFeedback.ok
                        ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-200'
                        : 'bg-rose-500/15 border-rose-400/50 text-rose-200'
                    }`}
                  >
                    <span>{challengeFeedback.msg}</span>
                    {challengeFeedback.ok && (
                      <button
                        type="button"
                        onClick={() => setGameState('PLAYING')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-black cursor-pointer whitespace-nowrap shrink-0"
                      >
                        {isEn ? 'Return to City' : 'Înapoi în Oraș'}
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : activeContractIdx !== null ? (
              <>
                {(() => {
                  const sc = LEONIDA_SIDE_CONTRACTS[activeContractIdx];
                  return (
                    <>
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="text-base font-black text-amber-300">
                          {isEn ? 'Leonida Fast Courier Contract' : 'Contract Rapid Curier Leonida'}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setGameState('PLAYING')}
                          className="p-2 rounded-xl bg-slate-800 text-slate-300 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-white font-semibold">
                        {isEn ? sc.promptEn : sc.promptRo}
                      </p>
                      <div className="space-y-2">
                        {(isEn ? sc.optionsEn : sc.optionsRo).map((opt, idx) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleSubmitSideContract(idx)}
                            className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-xs sm:text-sm text-slate-100 cursor-pointer"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {challengeFeedback && (
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-emerald-300 flex items-center justify-between gap-2">
                          <span>{challengeFeedback.msg}</span>
                          <button
                            type="button"
                            onClick={() => setGameState('PLAYING')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-black cursor-pointer"
                          >
                            {isEn ? 'Continue' : 'Continuă'}
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()}
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* END STATE / VICTORY SUMMARY */}
      {gameState === 'SUMMARY' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden">
            <img src={leonidaDuoImg} alt="Lucia & Jason" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white">
              {isEn ? 'Leonida Operation Summary' : 'Raport Operațiune Leonida'}
            </h3>
            <p className="text-sm text-slate-300">
              {completedMissions.length}/6 {isEn ? 'Districts Secured' : 'Regiuni Deblocate'} ·{' '}
              <span className="tabular-nums font-bold text-emerald-300">
                ${simRef.current.cash.toLocaleString()} · {simRef.current.score.toLocaleString()} pts
              </span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto tabular-nums">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">{isEn ? 'Score' : 'Scor Final'}</div>
              <div className="text-lg font-black text-amber-300">{simRef.current.score}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">Shards</div>
              <div className="text-lg font-black text-cyan-300">{hud.shardsCollected}/10</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">{isEn ? 'Contracts' : 'Contracte'}</div>
              <div className="text-lg font-black text-emerald-300">{hud.contractsDone}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={startNewCampaign}
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isEn ? 'Play Again' : 'Joacă Din Nou'}</span>
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm cursor-pointer"
            >
              {isEn ? 'Back to Hub' : 'Înapoi la Hub'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
