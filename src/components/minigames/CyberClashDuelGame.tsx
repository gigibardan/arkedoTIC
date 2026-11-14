import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Swords,
  Zap,
  Volume2,
  VolumeX,
  Shield,
  Flame,
  Trophy,
  RotateCcw,
  ArrowLeft,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  ClashCardId,
  ClashSyncEvent,
  DuelRoomData,
  sendClashSpawnEvent,
  updateDuelProgress,
} from '../../lib/duelService';
import { recordStudentDuelResult } from '../../lib/studentAuthService';
import { forceScrollToTop } from '../../utils/scrollHelper';

interface CyberClashDuelGameProps {
  roomData?: DuelRoomData | null;
  isHost?: boolean;
  studentName?: string;
  studentAvatar?: string;
  onFinish?: (score: number, won: boolean) => void;
  onBack?: () => void;
}

interface ClashCardDef {
  id: ClashCardId;
  nameRo: string;
  nameEn: string;
  roleRo: string;
  roleEn: string;
  cost: number;
  icon: string;
  accent: string;
  isSpell?: boolean;
  isBuilding?: boolean;
}

const CLASH_CARDS: ClashCardDef[] = [
  {
    id: 'drone_scout',
    nameRo: 'Drone Scout x2',
    nameEn: 'Drone Scouts x2',
    roleRo: 'Aerien · Rapid',
    roleEn: 'Flying · Fast',
    cost: 2,
    icon: '🛸',
    accent: '#38bdf8',
  },
  {
    id: 'ddos_swarm',
    nameRo: 'Roi DDoS x5',
    nameEn: 'DDoS Swarm x5',
    roleRo: 'ROI · Anti-Tank',
    roleEn: 'Swarm · Anti-Tank',
    cost: 3,
    icon: '👾',
    accent: '#f43f5e',
  },
  {
    id: 'laser_sniper',
    nameRo: 'Sniper Laser',
    nameEn: 'Laser Sniper',
    roleRo: 'Distanță · Aer+Sol',
    roleEn: 'Ranged · Air+Ground',
    cost: 3,
    icon: '🎯',
    accent: '#22d3ee',
  },
  {
    id: 'hacker_ninja',
    nameRo: 'Cyber Ninja',
    nameEn: 'Cyber Ninja',
    roleRo: 'Atac · Daune Mari',
    roleEn: 'Burst · High DMG',
    cost: 4,
    icon: '⚔️',
    accent: '#c084fc',
  },
  {
    id: 'cyber_tank',
    nameRo: 'Golem Firewall',
    nameEn: 'Firewall Golem',
    roleRo: 'Tank · Ținte Turnuri',
    roleEn: 'Tank · Targets Towers',
    cost: 5,
    icon: '🤖',
    accent: '#fb923c',
  },
  {
    id: 'tesla_node',
    nameRo: 'Turn Tesla',
    nameEn: 'Tesla Sentry',
    roleRo: 'Clădire Defensivă',
    roleEn: 'Defense Turret',
    cost: 4,
    icon: '🗼',
    accent: '#34d399',
    isBuilding: true,
  },
  {
    id: 'emp_spell',
    nameRo: 'Impuls EMP',
    nameEn: 'EMP Shockwave',
    roleRo: 'Vrajă · Stun & AoE',
    roleEn: 'Spell · Stun & AoE',
    cost: 3,
    icon: '⚡',
    accent: '#facc15',
    isSpell: true,
  },
  {
    id: 'overclock_spell',
    nameRo: 'Overclock x1.5',
    nameEn: 'Overclock Field',
    roleRo: 'Vrajă · Viteză +45%',
    roleEn: 'Spell · +45% Haste',
    cost: 2,
    icon: '🔥',
    accent: '#2dd4bf',
    isSpell: true,
  },
];

const CARD_MAP: Record<ClashCardId, ClashCardDef> = {
  drone_scout: CLASH_CARDS[0],
  ddos_swarm: CLASH_CARDS[1],
  laser_sniper: CLASH_CARDS[2],
  hacker_ninja: CLASH_CARDS[3],
  cyber_tank: CLASH_CARDS[4],
  tesla_node: CLASH_CARDS[5],
  emp_spell: CLASH_CARDS[6],
  overclock_spell: CLASH_CARDS[7],
};

// Arena Logical Coordinate Space
const ARENA_W = 440;
const ARENA_H = 540;
const RIVER_Y = 270;
const LEFT_BRIDGE_X = 106;
const RIGHT_BRIDGE_X = 334;
const BRIDGE_HALF_W = 40;
const BRIDGE_Y_MIN = 244;
const BRIDGE_Y_MAX = 296;

interface TowerEntity {
  id: string;
  team: 'player' | 'enemy';
  isKing: boolean;
  x: number;
  y: number;
  radius: number;
  hp: number;
  maxHp: number;
  range: number;
  damage: number;
  atkInterval: number;
  atkCooldown: number;
  stunTimer: number;
  active: boolean;
  destroyed: boolean;
}

interface UnitEntity {
  id: string;
  team: 'player' | 'enemy';
  kind: 'drone' | 'tank' | 'sniper' | 'swarm' | 'ninja' | 'turret';
  x: number;
  y: number;
  radius: number;
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  range: number;
  atkInterval: number;
  atkCooldown: number;
  isFlying: boolean;
  isBuilding: boolean;
  targetsBuildingsOnly: boolean;
  canHitAir: boolean;
  stunTimer: number;
  hasteTimer: number;
  ttl?: number; // for buildings
  hitFlash: number;
  color: string;
  icon: string;
}

interface Projectile {
  id: string;
  team: 'player' | 'enemy';
  x: number;
  y: number;
  tx: number;
  ty: number;
  targetId: string;
  speed: number;
  damage: number;
  color: string;
  radius: number;
}

interface SpellZone {
  id: string;
  team: 'player' | 'enemy';
  kind: 'emp' | 'overclock';
  x: number;
  y: number;
  radius: number;
  timer: number;
  maxTimer: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

function createInitialTowers(): TowerEntity[] {
  return [
    // Enemy Towers (Top)
    {
      id: 'enemy_left',
      team: 'enemy',
      isKing: false,
      x: LEFT_BRIDGE_X,
      y: 120,
      radius: 21,
      hp: 900,
      maxHp: 900,
      range: 138,
      damage: 46,
      atkInterval: 0.78,
      atkCooldown: 0,
      stunTimer: 0,
      active: true,
      destroyed: false,
    },
    {
      id: 'enemy_right',
      team: 'enemy',
      isKing: false,
      x: RIGHT_BRIDGE_X,
      y: 120,
      radius: 21,
      hp: 900,
      maxHp: 900,
      range: 138,
      damage: 46,
      atkInterval: 0.78,
      atkCooldown: 0,
      stunTimer: 0,
      active: true,
      destroyed: false,
    },
    {
      id: 'enemy_king',
      team: 'enemy',
      isKing: true,
      x: ARENA_W / 2,
      y: 54,
      radius: 29,
      hp: 1850,
      maxHp: 1850,
      range: 155,
      damage: 64,
      atkInterval: 0.88,
      atkCooldown: 0,
      stunTimer: 0,
      active: false,
      destroyed: false,
    },
    // Player Towers (Bottom)
    {
      id: 'player_left',
      team: 'player',
      isKing: false,
      x: LEFT_BRIDGE_X,
      y: ARENA_H - 120,
      radius: 21,
      hp: 900,
      maxHp: 900,
      range: 138,
      damage: 46,
      atkInterval: 0.78,
      atkCooldown: 0,
      stunTimer: 0,
      active: true,
      destroyed: false,
    },
    {
      id: 'player_right',
      team: 'player',
      isKing: false,
      x: RIGHT_BRIDGE_X,
      y: ARENA_H - 120,
      radius: 21,
      hp: 900,
      maxHp: 900,
      range: 138,
      damage: 46,
      atkInterval: 0.78,
      atkCooldown: 0,
      stunTimer: 0,
      active: true,
      destroyed: false,
    },
    {
      id: 'player_king',
      team: 'player',
      isKing: true,
      x: ARENA_W / 2,
      y: ARENA_H - 54,
      radius: 29,
      hp: 1850,
      maxHp: 1850,
      range: 155,
      damage: 64,
      atkInterval: 0.88,
      atkCooldown: 0,
      stunTimer: 0,
      active: false,
      destroyed: false,
    },
  ];
}

function buildShuffledDeck(): ClashCardId[] {
  const arr: ClashCardId[] = CLASH_CARDS.map((c) => c.id);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const CyberClashDuelGame: React.FC<CyberClashDuelGameProps> = ({
  roomData,
  isHost = true,
  studentName = 'Cyber Commander',
  studentAvatar = '⚔️',
  onFinish,
  onBack,
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const isLivePvP = Boolean(
    roomData &&
      roomData.guest &&
      roomData.guest.id !== 'practice_bot'
  );
  const opponentName = isLivePvP
    ? (isHost ? roomData?.guest?.name : roomData?.host?.name) || (isEn ? 'Rival' : 'Adversar')
    : 'Cyber-Bot AI';
  const opponentAvatar = isLivePvP
    ? (isHost ? roomData?.guest?.avatar : roomData?.host?.avatar) || '🚀'
    : '🤖';

  // UI & HUD React states
  const [energy, setEnergy] = useState<number>(5.0);
  const [deckQueue, setDeckQueue] = useState<ClashCardId[]>(() => buildShuffledDeck());
  const [selectedHandIdx, setSelectedHandIdx] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(90);
  const [isOvertime, setIsOvertime] = useState<boolean>(false);
  const [isDoubleEnergy, setIsDoubleEnergy] = useState<boolean>(false);
  const [playerCrowns, setPlayerCrowns] = useState<number>(0);
  const [enemyCrowns, setEnemyCrowns] = useState<number>(0);
  const [matchBanner, setMatchBanner] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [matchResult, setMatchResult] = useState<{
    won: boolean;
    draw: boolean;
    playerCrowns: number;
    enemyCrowns: number;
    finalScore: number;
    reasonRo: string;
    reasonEn: string;
  } | null>(null);

  // Canvas & simulation refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const towersRef = useRef<TowerEntity[]>(createInitialTowers());
  const unitsRef = useRef<UnitEntity[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const zonesRef = useRef<SpellZone[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const energyRef = useRef<number>(5.0);
  const botEnergyRef = useRef<number>(5.0);
  const botCooldownRef = useRef<number>(1.8);
  const timeRef = useRef<number>(90);
  const overtimeRef = useRef<boolean>(false);
  const finishedRef = useRef<boolean>(false);
  const hoverPosRef = useRef<{ x: number; y: number } | null>(null);
  const selectedHandIdxRef = useRef<number>(0);
  const deckQueueRef = useRef<ClashCardId[]>(deckQueue);
  const soundEnabledRef = useRef<boolean>(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Cloud sync event tracking
  const mySentEventsRef = useRef<ClashSyncEvent[]>([]);
  const processedRemoteIdsRef = useRef<Set<string>>(new Set());
  const lastProgressSyncRef = useRef<number>(0);
  const lastCrownsSyncRef = useRef<string>('0-0');

  useEffect(() => {
    forceScrollToTop();
  }, []);

  useEffect(() => {
    selectedHandIdxRef.current = selectedHandIdx;
  }, [selectedHandIdx]);

  useEffect(() => {
    deckQueueRef.current = deckQueue;
  }, [deckQueue]);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  // Web Audio API synth SFX
  const playTone = useCallback((freq: number, duration = 0.1, type: OscillatorType = 'triangle', gainVal = 0.08, endFreq?: number) => {
    if (!soundEnabledRef.current) return;
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new Ctx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (endFreq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), ctx.currentTime + duration);
      }
      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }, []);

  const showBanner = useCallback((text: string) => {
    setMatchBanner(text);
    setTimeout(() => {
      setMatchBanner((prev) => (prev === text ? null : prev));
    }, 2400);
  }, []);

  const addParticles = useCallback((x: number, y: number, color: string, count = 12, speed = 75) => {
    for (let i = 0; i < count; i++) {
      const ang = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const mag = speed * (0.4 + Math.random() * 0.8);
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(ang) * mag,
        vy: Math.sin(ang) * mag,
        life: 0.45 + Math.random() * 0.25,
        maxLife: 0.7,
        color,
        size: 2.2 + Math.random() * 2.5,
      });
    }
  }, []);

  // Spawn card units or spell effect into simulation
  const executeCardSpawn = useCallback(
    (team: 'player' | 'enemy', cardId: ClashCardId, x: number, y: number) => {
      const clampX = Math.max(24, Math.min(ARENA_W - 24, x));
      const clampY = Math.max(28, Math.min(ARENA_H - 28, y));
      const teamColor = team === 'player' ? '#38bdf8' : '#fb7185';
      const uid = `${team}_${cardId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

      if (cardId === 'emp_spell') {
        zonesRef.current.push({
          id: uid,
          team,
          kind: 'emp',
          x: clampX,
          y: clampY,
          radius: 84,
          timer: 0.75,
          maxTimer: 0.75,
        });
        addParticles(clampX, clampY, '#facc15', 22, 120);
        playTone(480, 0.24, 'sawtooth', 0.1, 90);

        const targetTeam = team === 'player' ? 'enemy' : 'player';
        unitsRef.current.forEach((u) => {
          if (u.team === targetTeam) {
            const dist = Math.hypot(u.x - clampX, u.y - clampY);
            if (dist <= 84 + u.radius) {
              u.hp -= 155;
              u.stunTimer = Math.max(u.stunTimer, 2.2);
              u.hitFlash = 0.25;
            }
          }
        });
        towersRef.current.forEach((t) => {
          if (!t.destroyed && t.team === targetTeam) {
            const dist = Math.hypot(t.x - clampX, t.y - clampY);
            if (dist <= 84 + t.radius) {
              t.hp -= 60;
              t.stunTimer = Math.max(t.stunTimer, 1.8);
              if (t.isKing) t.active = true;
            }
          }
        });
        return;
      }

      if (cardId === 'overclock_spell') {
        zonesRef.current.push({
          id: uid,
          team,
          kind: 'overclock',
          x: clampX,
          y: clampY,
          radius: 90,
          timer: 6.0,
          maxTimer: 6.0,
        });
        addParticles(clampX, clampY, '#2dd4bf', 18, 90);
        playTone(620, 0.18, 'sine', 0.08, 920);
        return;
      }

      const pushUnit = (cfg: Omit<UnitEntity, 'id' | 'team' | 'atkCooldown' | 'stunTimer' | 'hasteTimer' | 'hitFlash'>) => {
        unitsRef.current.push({
          ...cfg,
          id: `${uid}_${unitsRef.current.length}_${Math.random().toString(36).slice(2, 5)}`,
          team,
          atkCooldown: 0.15,
          stunTimer: 0,
          hasteTimer: 0,
          hitFlash: 0,
        });
      };

      addParticles(clampX, clampY, teamColor, 10, 65);
      if (team === 'player') {
        playTone(360, 0.09, 'triangle', 0.07, 520);
      }

      if (cardId === 'drone_scout') {
        [-18, 18].forEach((dx) => {
          pushUnit({
            kind: 'drone',
            x: clampX + dx,
            y: clampY,
            radius: 12,
            hp: 135,
            maxHp: 135,
            speed: 78,
            damage: 28,
            range: 52,
            atkInterval: 0.65,
            isFlying: true,
            isBuilding: false,
            targetsBuildingsOnly: false,
            canHitAir: true,
            color: team === 'player' ? '#38bdf8' : '#f472b6',
            icon: '🛸',
          });
        });
      } else if (cardId === 'ddos_swarm') {
        const offsets = [
          [0, -14],
          [-16, 0],
          [16, 0],
          [-10, 14],
          [10, 14],
        ];
        offsets.forEach(([dx, dy]) => {
          pushUnit({
            kind: 'swarm',
            x: clampX + dx,
            y: clampY + dy,
            radius: 9,
            hp: 70,
            maxHp: 70,
            speed: 74,
            damage: 24,
            range: 20,
            atkInterval: 0.58,
            isFlying: false,
            isBuilding: false,
            targetsBuildingsOnly: false,
            canHitAir: false,
            color: team === 'player' ? '#60a5fa' : '#fb7185',
            icon: '👾',
          });
        });
      } else if (cardId === 'laser_sniper') {
        pushUnit({
          kind: 'sniper',
          x: clampX,
          y: clampY,
          radius: 13,
          hp: 215,
          maxHp: 215,
          speed: 50,
          damage: 46,
          range: 126,
          atkInterval: 0.84,
          isFlying: false,
          isBuilding: false,
          targetsBuildingsOnly: false,
          canHitAir: true,
          color: team === 'player' ? '#22d3ee' : '#f43f5e',
          icon: '🎯',
        });
      } else if (cardId === 'hacker_ninja') {
        pushUnit({
          kind: 'ninja',
          x: clampX,
          y: clampY,
          radius: 14,
          hp: 345,
          maxHp: 345,
          speed: 68,
          damage: 90,
          range: 24,
          atkInterval: 0.78,
          isFlying: false,
          isBuilding: false,
          targetsBuildingsOnly: false,
          canHitAir: false,
          color: team === 'player' ? '#a855f7' : '#e11d48',
          icon: '⚔️',
        });
      } else if (cardId === 'cyber_tank') {
        pushUnit({
          kind: 'tank',
          x: clampX,
          y: clampY,
          radius: 18,
          hp: 740,
          maxHp: 740,
          speed: 33,
          damage: 96,
          range: 28,
          atkInterval: 1.25,
          isFlying: false,
          isBuilding: false,
          targetsBuildingsOnly: true,
          canHitAir: false,
          color: team === 'player' ? '#0ea5e9' : '#ea580c',
          icon: '🤖',
        });
      } else if (cardId === 'tesla_node') {
        pushUnit({
          kind: 'turret',
          x: clampX,
          y: clampY,
          radius: 17,
          hp: 520,
          maxHp: 520,
          speed: 0,
          damage: 56,
          range: 134,
          atkInterval: 0.72,
          isFlying: false,
          isBuilding: true,
          targetsBuildingsOnly: false,
          canHitAir: true,
          ttl: 22,
          color: team === 'player' ? '#10b981' : '#f59e0b',
          icon: '🗼',
        });
      }
    },
    [addParticles, playTone]
  );

  // Deploy selected card at canvas coordinate
  const deployPlayerCard = useCallback(
    (cardSlotIdx: number, targetX: number, targetY: number) => {
      if (finishedRef.current) return;
      const cardId = deckQueueRef.current[cardSlotIdx];
      if (!cardId) return;
      const card = CARD_MAP[cardId];
      if (energyRef.current < card.cost) {
        playTone(150, 0.08, 'square', 0.06);
        showBanner(isEn ? `Need ${card.cost}⚡ Bandwidth!` : `Necesită ${card.cost}⚡ Energie!`);
        return;
      }

      // Enforce deployment territory for troops/buildings (bottom half only)
      let deployY = targetY;
      if (!card.isSpell && deployY < RIVER_Y + 26) {
        deployY = RIVER_Y + 34;
      }
      const deployX = Math.max(30, Math.min(ARENA_W - 30, targetX));

      energyRef.current = Math.max(0, energyRef.current - card.cost);
      setEnergy(energyRef.current);

      // Cycle card from hand slot to end of deck
      setDeckQueue((prev) => {
        const next = [...prev];
        const played = next[cardSlotIdx];
        // Pull the 5th card (index 4) into played slot, move played to end
        const reserve = next[4];
        next[cardSlotIdx] = reserve;
        const rest = next.slice(5);
        const updated = [...next.slice(0, 4), ...rest, played];
        deckQueueRef.current = updated;
        return updated;
      });

      executeCardSpawn('player', cardId, deployX, deployY);

      // Sync to opponent over Firestore in live 1v1
      if (isLivePvP && roomData?.roomCode) {
        const syncEvt: ClashSyncEvent = {
          id: `${isHost ? 'h' : 'g'}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          cardId,
          nx: Number((deployX / ARENA_W).toFixed(3)),
          ny: Number((deployY / ARENA_H).toFixed(3)),
          createdAt: Date.now(),
        };
        const updatedEvents = [...mySentEventsRef.current, syncEvt].slice(-24);
        mySentEventsRef.current = updatedEvents;
        sendClashSpawnEvent(roomData.roomCode, isHost, updatedEvents);
      }
    },
    [executeCardSpawn, isEn, isHost, isLivePvP, playTone, roomData?.roomCode, showBanner]
  );

  // Keyboard shortcuts [1-4] select card, [Q]/[E] quick deploy Left/Right bridge
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (finishedRef.current) return;
      if (e.key === '1' || e.key === '2' || e.key === '3' || e.key === '4') {
        setSelectedHandIdx(Number(e.key) - 1);
      } else if (e.key === 'q' || e.key === 'Q') {
        deployPlayerCard(selectedHandIdxRef.current, LEFT_BRIDGE_X, ARENA_H - 175);
      } else if (e.key === 'e' || e.key === 'E') {
        deployPlayerCard(selectedHandIdxRef.current, RIGHT_BRIDGE_X, ARENA_H - 175);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [deployPlayerCard]);

  // Listen for incoming enemy spawn events from Firestore roomData
  useEffect(() => {
    if (!isLivePvP || !roomData) return;
    const remoteEvents = isHost ? roomData.guestClashEvents : roomData.hostClashEvents;
    if (!remoteEvents || remoteEvents.length === 0) return;

    remoteEvents.forEach((evt) => {
      if (!processedRemoteIdsRef.current.has(evt.id)) {
        processedRemoteIdsRef.current.add(evt.id);
        // Mirror point-symmetrically from opponent bottom-up view to top-down view
        const mirroredX = (1 - evt.nx) * ARENA_W;
        const mirroredY = (1 - evt.ny) * ARENA_H;
        executeCardSpawn('enemy', evt.cardId, mirroredX, mirroredY);
      }
    });
  }, [roomData, isHost, isLivePvP, executeCardSpawn]);

  // Conclude match & report score/winner
  const concludeMatch = useCallback(
    (pCrowns: number, eCrowns: number, won: boolean, draw: boolean, reasonRo: string, reasonEn: string) => {
      if (finishedRef.current) return;
      finishedRef.current = true;

      if (won) {
        playTone(523, 0.14, 'triangle', 0.1, 784);
      } else {
        playTone(220, 0.25, 'sawtooth', 0.08, 120);
      }

      const bonusBase = won ? 550 : draw ? 300 : 180;
      const finalScore = bonusBase + pCrowns * 150 - eCrowns * 30;

      setMatchResult({
        won,
        draw,
        playerCrowns: pCrowns,
        enemyCrowns: eCrowns,
        finalScore,
        reasonRo,
        reasonEn,
      });

      recordStudentDuelResult(won, 'cyber_clash', finalScore);

      if (roomData?.roomCode) {
        const myId = isHost ? roomData.host.id : roomData.guest?.id;
        const oppId = isHost ? roomData.guest?.id : roomData.host.id;
        const myName = isHost ? roomData.host.name : roomData.guest?.name || studentName;
        const oppName = isHost ? (roomData.guest?.name || 'Opponent') : roomData.host.name;

        const winnerId = won ? myId : oppId;
        const winnerName = won ? myName : oppName;

        updateDuelProgress(
          roomData.roomCode,
          isHost,
          {
            progress: 100,
            score: finalScore,
            finishedAt: Date.now(),
          },
          winnerId || myId,
          winnerName
        );
      }

      onFinish?.(finalScore, won);
    },
    [isHost, onFinish, playTone, roomData, studentName]
  );

  // Main 60fps simulation & render loop
  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const stepSimulation = (dt: number) => {
      if (finishedRef.current) return;

      // 1. Timer & 2x Bandwidth Overdrive
      timeRef.current = Math.max(0, timeRef.current - dt);
      const roundedSec = Math.ceil(timeRef.current);
      setTimeRemaining((prev) => (prev !== roundedSec ? roundedSec : prev));

      const doubleRate = timeRef.current <= 30 || overtimeRef.current;
      setIsDoubleEnergy((prev) => (prev !== doubleRate ? doubleRate : prev));

      if (!overtimeRef.current && Math.abs(timeRef.current - 30) < 0.05) {
        showBanner(isEn ? '⚡ 2x BANDWIDTH OVERDRIVE!' : '⚡ SUPRADOZĂ ENERGIE 2x!');
        playTone(660, 0.2, 'triangle', 0.09, 880);
      }

      // 2. Energy Regen (Player & AI Bot)
      const regenPerSec = doubleRate ? 1.85 : 0.95;
      energyRef.current = Math.min(10, energyRef.current + regenPerSec * dt);
      setEnergy(energyRef.current);

      if (!isLivePvP) {
        botEnergyRef.current = Math.min(10, botEnergyRef.current + regenPerSec * 0.92 * dt);
        botCooldownRef.current -= dt;
        if (botCooldownRef.current <= 0) {
          botCooldownRef.current = doubleRate ? 1.4 + Math.random() * 1.1 : 2.1 + Math.random() * 1.4;
          const playerThreatLeft = unitsRef.current.filter((u) => u.team === 'player' && u.x < ARENA_W / 2 && u.y < RIVER_Y + 60);
          const playerThreatRight = unitsRef.current.filter((u) => u.team === 'player' && u.x >= ARENA_W / 2 && u.y < RIVER_Y + 60);

          let chosenCard: ClashCardId | null = null;
          let spawnX = Math.random() > 0.5 ? LEFT_BRIDGE_X : RIGHT_BRIDGE_X;
          let spawnY = 148;

          if (playerThreatLeft.length + playerThreatRight.length >= 4 && botEnergyRef.current >= 3) {
            const clump = playerThreatLeft.length >= playerThreatRight.length ? playerThreatLeft[0] : playerThreatRight[0];
            chosenCard = 'emp_spell';
            spawnX = clump.x;
            spawnY = clump.y;
          } else if (playerThreatLeft.some((u) => u.kind === 'tank') && botEnergyRef.current >= 3) {
            chosenCard = 'ddos_swarm';
            spawnX = LEFT_BRIDGE_X + (Math.random() * 24 - 12);
            spawnY = 165;
          } else if (playerThreatRight.some((u) => u.kind === 'tank') && botEnergyRef.current >= 3) {
            chosenCard = 'ddos_swarm';
            spawnX = RIGHT_BRIDGE_X + (Math.random() * 24 - 12);
            spawnY = 165;
          } else if (botEnergyRef.current >= 5 && Math.random() < 0.45) {
            chosenCard = 'cyber_tank';
            spawnX = Math.random() > 0.5 ? LEFT_BRIDGE_X : RIGHT_BRIDGE_X;
            spawnY = 135;
          } else if (botEnergyRef.current >= 3) {
            const pool: ClashCardId[] = ['drone_scout', 'laser_sniper', 'hacker_ninja', 'ddos_swarm'];
            const pick = pool[Math.floor(Math.random() * pool.length)];
            if (botEnergyRef.current >= CARD_MAP[pick].cost) {
              chosenCard = pick;
              spawnX = (Math.random() > 0.5 ? LEFT_BRIDGE_X : RIGHT_BRIDGE_X) + (Math.random() * 26 - 13);
              spawnY = 160 + Math.random() * 30;
            }
          }

          if (chosenCard) {
            botEnergyRef.current -= CARD_MAP[chosenCard].cost;
            executeCardSpawn('enemy', chosenCard, spawnX, spawnY);
          }
        }
      }

      // 3. Update Spell Zones
      zonesRef.current = zonesRef.current.filter((z) => {
        z.timer -= dt;
        if (z.kind === 'overclock') {
          unitsRef.current.forEach((u) => {
            if (u.team === z.team && Math.hypot(u.x - z.x, u.y - z.y) <= z.radius + u.radius) {
              u.hasteTimer = 0.25;
            }
          });
        }
        return z.timer > 0;
      });

      // 4. Update Units (AI targeting, bridge steering, movement, attacks)
      unitsRef.current.forEach((u) => {
        u.hitFlash = Math.max(0, u.hitFlash - dt);
        if (u.isBuilding && u.ttl !== undefined) {
          u.ttl -= dt;
          u.hp -= (u.maxHp / 22) * dt;
        }
        if (u.stunTimer > 0) {
          u.stunTimer = Math.max(0, u.stunTimer - dt);
          return;
        }

        const speedMult = u.hasteTimer > 0 ? 1.45 : 1.0;
        u.hasteTimer = Math.max(0, u.hasteTimer - dt);
        u.atkCooldown = Math.max(0, u.atkCooldown - dt * speedMult);

        const enemyTeam = u.team === 'player' ? 'enemy' : 'player';

        // Pick closest valid target
        let bestTarget: { kind: 'unit' | 'tower'; obj: UnitEntity | TowerEntity; dist: number } | null = null;

        if (!u.targetsBuildingsOnly) {
          for (const other of unitsRef.current) {
            if (other.team !== enemyTeam || other.hp <= 0) continue;
            if (other.isFlying && !u.canHitAir) continue;
            const d = Math.hypot(other.x - u.x, other.y - u.y) - other.radius;
            // Aggro range 155px for troops, u.range for turrets
            const aggro = u.isBuilding ? u.range : 155;
            if (d <= aggro && (!bestTarget || d < bestTarget.dist)) {
              bestTarget = { kind: 'unit', obj: other, dist: d };
            }
          }
        }

        for (const t of towersRef.current) {
          if (t.destroyed || t.team !== enemyTeam) continue;
          const d = Math.hypot(t.x - u.x, t.y - u.y) - t.radius;
          if (!bestTarget || d < bestTarget.dist) {
            bestTarget = { kind: 'tower', obj: t, dist: d };
          }
        }

        if (!bestTarget) return;

        if (bestTarget.dist <= u.range) {
          // Attack!
          if (u.atkCooldown <= 0) {
            u.atkCooldown = u.atkInterval;
            if (u.range > 45) {
              // Ranged projectile
              projectilesRef.current.push({
                id: `p_${Date.now()}_${Math.random()}`,
                team: u.team,
                x: u.x,
                y: u.y,
                tx: bestTarget.obj.x,
                ty: bestTarget.obj.y,
                targetId: bestTarget.obj.id,
                speed: 280,
                damage: u.damage,
                color: u.color,
                radius: 4,
              });
            } else {
              // Melee strike
              bestTarget.obj.hp -= u.damage;
              if (bestTarget.kind === 'tower') {
                const tw = bestTarget.obj as TowerEntity;
                if (tw.isKing) tw.active = true;
              } else {
                (bestTarget.obj as UnitEntity).hitFlash = 0.14;
              }
              addParticles(bestTarget.obj.x, bestTarget.obj.y, u.color, 4, 40);
            }
          }
        } else if (!u.isBuilding && u.speed > 0) {
          // Move toward target, routing ground units across the bridges if crossing the river
          let goalX = bestTarget.obj.x;
          let goalY = bestTarget.obj.y;

          if (!u.isFlying) {
            const needCrossRiver =
              (u.y > RIVER_Y + 12 && goalY < RIVER_Y - 12) ||
              (u.y < RIVER_Y - 12 && goalY > RIVER_Y + 12);
            const onBridgeX =
              Math.abs(u.x - LEFT_BRIDGE_X) <= BRIDGE_HALF_W - 8 ||
              Math.abs(u.x - RIGHT_BRIDGE_X) <= BRIDGE_HALF_W - 8;

            if (needCrossRiver && !onBridgeX) {
              const bridgeX = Math.abs(u.x - LEFT_BRIDGE_X) <= Math.abs(u.x - RIGHT_BRIDGE_X)
                ? LEFT_BRIDGE_X
                : RIGHT_BRIDGE_X;
              goalX = bridgeX;
              goalY = RIVER_Y;
            }
          }

          const dx = goalX - u.x;
          const dy = goalY - u.y;
          const len = Math.hypot(dx, dy) || 1;
          u.x += (dx / len) * u.speed * speedMult * dt;
          u.y += (dy / len) * u.speed * speedMult * dt;
        }
      });

      // Soft unit separation to prevent complete overlapping
      for (let i = 0; i < unitsRef.current.length; i++) {
        for (let j = i + 1; j < unitsRef.current.length; j++) {
          const a = unitsRef.current[i];
          const b = unitsRef.current[j];
          if (a.isBuilding || b.isBuilding || a.isFlying !== b.isFlying) continue;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.01;
          const minDist = a.radius + b.radius - 2;
          if (dist < minDist) {
            const push = (minDist - dist) * 0.5;
            const nx = dx / dist;
            const ny = dy / dist;
            a.x -= nx * push;
            a.y -= ny * push;
            b.x += nx * push;
            b.y += ny * push;
          }
        }
      }

      // 5. Update Towers defense fire
      towersRef.current.forEach((t) => {
        if (t.destroyed) return;
        if (t.stunTimer > 0) {
          t.stunTimer = Math.max(0, t.stunTimer - dt);
          return;
        }
        if (!t.active) return;

        t.atkCooldown = Math.max(0, t.atkCooldown - dt);
        if (t.atkCooldown <= 0) {
          const enemyTeam = t.team === 'player' ? 'enemy' : 'player';
          let closest: UnitEntity | null = null;
          let minD = Infinity;
          for (const u of unitsRef.current) {
            if (u.team !== enemyTeam || u.hp <= 0) continue;
            const d = Math.hypot(u.x - t.x, u.y - t.y);
            if (d <= t.range && d < minD) {
              minD = d;
              closest = u;
            }
          }
          if (closest) {
            t.atkCooldown = t.atkInterval;
            projectilesRef.current.push({
              id: `tp_${Date.now()}_${Math.random()}`,
              team: t.team,
              x: t.x,
              y: t.y - 6,
              tx: closest.x,
              ty: closest.y,
              targetId: closest.id,
              speed: 320,
              damage: t.damage,
              color: t.team === 'player' ? '#38bdf8' : '#fb7185',
              radius: 5,
            });
          }
        }
      });

      // 6. Update Projectiles
      projectilesRef.current = projectilesRef.current.filter((p) => {
        const targetUnit = unitsRef.current.find((u) => u.id === p.targetId && u.hp > 0);
        const targetTower = towersRef.current.find((t) => t.id === p.targetId && !t.destroyed);
        const dest = targetUnit || targetTower;
        if (dest) {
          p.tx = dest.x;
          p.ty = dest.y;
        }
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        const dist = Math.hypot(dx, dy);
        const moveDist = p.speed * dt;
        if (dist <= moveDist + 6) {
          if (dest) {
            dest.hp -= p.damage;
            if (targetUnit) targetUnit.hitFlash = 0.14;
            if (targetTower && targetTower.isKing) targetTower.active = true;
            addParticles(dest.x, dest.y, p.color, 4, 45);
          }
          return false;
        }
        p.x += (dx / dist) * moveDist;
        p.y += (dy / dist) * moveDist;
        return true;
      });

      // 7. Clean up dead units
      unitsRef.current = unitsRef.current.filter((u) => {
        if (u.hp <= 0) {
          addParticles(u.x, u.y, u.color, 9, 65);
          return false;
        }
        return true;
      });

      // 8. Check Tower Destructions & Crown Updates
      let pCrownsNow = 0;
      let eCrownsNow = 0;
      let playerKingDead = false;
      let enemyKingDead = false;

      towersRef.current.forEach((t) => {
        if (!t.destroyed && t.hp <= 0) {
          t.hp = 0;
          t.destroyed = true;
          addParticles(t.x, t.y, t.team === 'enemy' ? '#38bdf8' : '#f43f5e', 30, 145);
          playTone(130, 0.35, 'sawtooth', 0.14, 45);
          // Wake king tower when a princess turret falls
          towersRef.current.forEach((other) => {
            if (other.team === t.team && other.isKing) other.active = true;
          });
          showBanner(
            t.team === 'enemy'
              ? isEn
                ? '👑 ENEMY TURRET DESTROYED!'
                : '👑 TURN INAMIC DISTRUS!'
              : isEn
              ? '⚠️ ALLIED TURRET LOST!'
              : '⚠️ TURN ALIAT PIERDUT!'
          );
        }
        if (t.destroyed) {
          if (t.team === 'enemy') {
            pCrownsNow += t.isKing ? 3 : 1;
            if (t.isKing) enemyKingDead = true;
          } else {
            eCrownsNow += t.isKing ? 3 : 1;
            if (t.isKing) playerKingDead = true;
          }
        }
      });

      const cappedPCrowns = Math.min(3, pCrownsNow);
      const cappedECrowns = Math.min(3, eCrownsNow);
      setPlayerCrowns(cappedPCrowns);
      setEnemyCrowns(cappedECrowns);

      // Sync milestone progress cleanly on Crown change or every 5 seconds in live PvP
      if (isLivePvP && roomData?.roomCode) {
        const crownKey = `${cappedPCrowns}-${cappedECrowns}`;
        const nowMs = Date.now();
        if (crownKey !== lastCrownsSyncRef.current || nowMs - lastProgressSyncRef.current > 5000) {
          lastCrownsSyncRef.current = crownKey;
          lastProgressSyncRef.current = nowMs;
          const pct = Math.min(95, Math.round(((90 - timeRef.current) / 90) * 80 + cappedPCrowns * 10));
          updateDuelProgress(roomData.roomCode, isHost, {
            progress: Math.max(5, pct),
            score: cappedPCrowns * 150 + Math.round((1850 - towersRef.current[2].hp) / 10),
          });
        }
      }

      if (enemyKingDead) {
        concludeMatch(
          3,
          cappedECrowns,
          true,
          false,
          'Nucleul Central Inamic a fost distrus (3 Coroane)!',
          'Enemy Main Core Destroyed (3-Crown Knockout)!'
        );
        return;
      }
      if (playerKingDead) {
        concludeMatch(
          cappedPCrowns,
          3,
          false,
          false,
          'Nucleul tău Central a cedat sub asalt!',
          'Your Main Core was breached!'
        );
        return;
      }

      // Sudden death overtime check
      if (overtimeRef.current && cappedPCrowns !== cappedECrowns) {
        const won = cappedPCrowns > cappedECrowns;
        concludeMatch(
          cappedPCrowns,
          cappedECrowns,
          won,
          false,
          won ? 'Victorie în Sudden Death Overtime!' : 'Înfrângere în Sudden Death Overtime!',
          won ? 'Sudden Death Overtime Victory!' : 'Sudden Death Overtime Defeat!'
        );
        return;
      }

      // Clock hit 0:00
      if (timeRef.current <= 0) {
        if (!overtimeRef.current && cappedPCrowns === cappedECrowns) {
          overtimeRef.current = true;
          setIsOvertime(true);
          timeRef.current = 20;
          showBanner(isEn ? '🔥 SUDDEN DEATH OVERTIME (20s)!' : '🔥 OVERTIME SUDDEN DEATH (20s)!');
          playTone(720, 0.25, 'triangle', 0.1, 480);
          return;
        }

        if (cappedPCrowns !== cappedECrowns) {
          const won = cappedPCrowns > cappedECrowns;
          concludeMatch(
            cappedPCrowns,
            cappedECrowns,
            won,
            false,
            won ? `Ai dominat arena (${cappedPCrowns} - ${cappedECrowns} coroane)!` : `Adversarul a obținut mai multe coroane (${cappedECrowns} - ${cappedPCrowns}).`,
            won ? `Arena Victory (${cappedPCrowns} - ${cappedECrowns} crowns)!` : `Opponent took more crowns (${cappedECrowns} - ${cappedPCrowns}).`
          );
          return;
        }

        // Tiebreaker by remaining total Tower HP
        const pTotalHp = towersRef.current.filter((t) => t.team === 'player').reduce((s, t) => s + t.hp, 0);
        const eTotalHp = towersRef.current.filter((t) => t.team === 'enemy').reduce((s, t) => s + t.hp, 0);
        const won = pTotalHp >= eTotalHp;
        const draw = pTotalHp === eTotalHp;
        concludeMatch(
          cappedPCrowns,
          cappedECrowns,
          won,
          draw,
          draw ? 'Egalitate perfectă la puncte de viață!' : won ? 'Victorie la Tiebreak (Mai mult HP rămas pe turnuri)!' : 'Înfrângere la Tiebreak HP.',
          draw ? 'Exact Tie on Tower HP!' : won ? 'Tiebreaker Victory (More Tower HP remaining)!' : 'Tiebreaker Loss on remaining Tower HP.'
        );
        return;
      }

      // 9. Particles
      particlesRef.current = particlesRef.current.filter((pt) => {
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.life -= dt;
        return pt.life > 0;
      });
    };

    const drawArena = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Background dark cyber grid
      ctx.fillStyle = '#070b18';
      ctx.fillRect(0, 0, ARENA_W, ARENA_H);

      // Subtle tactical grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx <= ARENA_W; gx += 32) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, ARENA_H);
        ctx.stroke();
      }
      for (let gy = 0; gy <= ARENA_H; gy += 32) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(ARENA_W, gy);
        ctx.stroke();
      }

      // Lane guide tracks
      ctx.fillStyle = 'rgba(30, 41, 59, 0.45)';
      ctx.fillRect(LEFT_BRIDGE_X - 24, 52, 48, ARENA_H - 104);
      ctx.fillRect(RIGHT_BRIDGE_X - 24, 52, 48, ARENA_H - 104);

      // Data River in center
      const riverGrad = ctx.createLinearGradient(0, BRIDGE_Y_MIN, 0, BRIDGE_Y_MAX);
      riverGrad.addColorStop(0, '#0c4a6e');
      riverGrad.addColorStop(0.5, '#0284c7');
      riverGrad.addColorStop(1, '#0c4a6e');
      ctx.fillStyle = riverGrad;
      ctx.fillRect(0, BRIDGE_Y_MIN + 4, ARENA_W, BRIDGE_Y_MAX - BRIDGE_Y_MIN - 8);

      // Animated data pulses in river
      const pulseOffset = (performance.now() * 0.04) % 44;
      ctx.fillStyle = 'rgba(125, 211, 252, 0.35)';
      for (let rx = -44 + pulseOffset; rx < ARENA_W; rx += 44) {
        ctx.fillRect(rx, RIVER_Y - 2, 18, 4);
      }

      // Two Tactical Bridges
      [LEFT_BRIDGE_X, RIGHT_BRIDGE_X].forEach((bx) => {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(bx - BRIDGE_HALF_W, BRIDGE_Y_MIN - 2, BRIDGE_HALF_W * 2, BRIDGE_Y_MAX - BRIDGE_Y_MIN + 4);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.strokeRect(bx - BRIDGE_HALF_W, BRIDGE_Y_MIN - 2, BRIDGE_HALF_W * 2, BRIDGE_Y_MAX - BRIDGE_Y_MIN + 4);

        // Bridge chevrons
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.beginPath();
        ctx.moveTo(bx - 22, RIVER_Y);
        ctx.lineTo(bx + 22, RIVER_Y);
        ctx.stroke();
      });

      // Placement territory guide when hovering/selecting card
      const activeCardId = deckQueueRef.current[selectedHandIdxRef.current];
      const activeCard = activeCardId ? CARD_MAP[activeCardId] : null;
      if (activeCard && hoverPosRef.current && !finishedRef.current) {
        const { x: hx, y: hy } = hoverPosRef.current;
        const clampedY = activeCard.isSpell ? hy : Math.max(RIVER_Y + 34, hy);
        const rad = activeCard.isSpell ? 84 : 20;
        const canAfford = energyRef.current >= activeCard.cost;
        ctx.save();
        ctx.beginPath();
        ctx.arc(hx, clampedY, rad, 0, Math.PI * 2);
        ctx.fillStyle = canAfford ? 'rgba(56, 189, 248, 0.16)' : 'rgba(244, 63, 94, 0.16)';
        ctx.fill();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = canAfford ? '#38bdf8' : '#f43f5e';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      // Draw Spell Zones
      zonesRef.current.forEach((z) => {
        const alpha = Math.min(0.42, (z.timer / z.maxTimer) * 0.45);
        ctx.save();
        ctx.beginPath();
        ctx.arc(z.x, z.y, z.radius, 0, Math.PI * 2);
        ctx.fillStyle = z.kind === 'emp' ? `rgba(250, 204, 21, ${alpha})` : `rgba(45, 212, 191, ${alpha * 0.65})`;
        ctx.fill();
        ctx.strokeStyle = z.kind === 'emp' ? '#fde047' : '#2dd4bf';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.restore();
      });

      // Draw Towers
      towersRef.current.forEach((t) => {
        const isEnemy = t.team === 'enemy';
        const baseColor = isEnemy ? '#e11d48' : '#0284c7';
        const glowColor = isEnemy ? '#fb7185' : '#38bdf8';

        if (t.destroyed) {
          ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
          ctx.beginPath();
          ctx.arc(t.x, t.y, t.radius * 0.85, 0, Math.PI * 2);
          ctx.fill();
          ctx.font = '18px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('💥', t.x, t.y);
          return;
        }

        // Base hexagon/square turret
        ctx.save();
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = t.stunTimer > 0 ? 4 : 14;
        ctx.fillStyle = t.stunTimer > 0 ? '#64748b' : baseColor;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = t.stunTimer > 0 ? '#facc15' : glowColor;
        ctx.stroke();
        ctx.restore();

        // Tower icon
        ctx.font = t.isKing ? '22px sans-serif' : '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(t.isKing ? (isEnemy ? '🏰' : '🛡️') : '🗼', t.x, t.y);

        // HP Bar
        const barW = t.isKing ? 64 : 48;
        const barH = 6;
        const bx = t.x - barW / 2;
        const by = isEnemy ? t.y - t.radius - 13 : t.y + t.radius + 7;
        ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
        ctx.fillRect(bx - 1, by - 1, barW + 2, barH + 2);
        const pct = Math.max(0, t.hp / t.maxHp);
        ctx.fillStyle = isEnemy ? '#fb7185' : '#38bdf8';
        ctx.fillRect(bx, by, barW * pct, barH);
      });

      // Draw Units (Ground first, Flying on top)
      const sortedUnits = [...unitsRef.current].sort((a, b) => Number(a.isFlying) - Number(b.isFlying));
      sortedUnits.forEach((u) => {
        ctx.save();
        if (u.isFlying) {
          // Drop shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
          ctx.beginPath();
          ctx.ellipse(u.x, u.y + 14, u.radius * 0.75, u.radius * 0.4, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        if (u.hasteTimer > 0) {
          ctx.strokeStyle = '#2dd4bf';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(u.x, u.y, u.radius + 4, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = u.hitFlash > 0 ? '#ffffff' : u.stunTimer > 0 ? '#94a3b8' : u.color;
        ctx.beginPath();
        ctx.arc(u.x, u.y, u.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = u.team === 'player' ? '#e0f2fe' : '#ffe4e6';
        ctx.stroke();

        ctx.font = `${Math.max(11, Math.round(u.radius * 1.15))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(u.stunTimer > 0 ? '⚡' : u.icon, u.x, u.y + 1);

        // Mini HP bar if damaged
        if (u.hp < u.maxHp) {
          const w = Math.max(20, u.radius * 2);
          const bx = u.x - w / 2;
          const by = u.y - u.radius - 7;
          ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
          ctx.fillRect(bx, by, w, 4);
          ctx.fillStyle = u.team === 'player' ? '#34d399' : '#fb7185';
          ctx.fillRect(bx, by, w * Math.max(0, u.hp / u.maxHp), 4);
        }
        ctx.restore();
      });

      // Draw Projectiles
      projectilesRef.current.forEach((p) => {
        ctx.save();
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Particles
      particlesRef.current.forEach((pt) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      stepSimulation(dt);
      drawArena();
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [addParticles, concludeMatch, executeCardSpawn, isEn, isHost, isLivePvP, playTone, roomData?.roomCode, showBanner]);

  // Canvas pointer mapping
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = ARENA_W / rect.width;
    const scaleY = ARENA_H / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    if (!coords) return;
    hoverPosRef.current = coords;
    deployPlayerCard(selectedHandIdx, coords.x, coords.y);
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    if (coords) {
      hoverPosRef.current = coords;
    }
  };

  const handleRestartSolo = () => {
    towersRef.current = createInitialTowers();
    unitsRef.current = [];
    projectilesRef.current = [];
    zonesRef.current = [];
    particlesRef.current = [];
    energyRef.current = 5.0;
    botEnergyRef.current = 5.0;
    timeRef.current = 90;
    overtimeRef.current = false;
    finishedRef.current = false;
    setEnergy(5.0);
    setTimeRemaining(90);
    setIsOvertime(false);
    setIsDoubleEnergy(false);
    setPlayerCrowns(0);
    setEnemyCrowns(0);
    setMatchResult(null);
    setDeckQueue(buildShuffledDeck());
  };

  const handCards = deckQueue.slice(0, 4);
  const nextCard = CARD_MAP[deckQueue[4]];
  const selectedCardDef = CARD_MAP[handCards[selectedHandIdx]];

  return (
    <div className="w-full max-w-5xl mx-auto p-3 sm:p-5 rounded-3xl bg-slate-900/95 border border-cyan-500/30 shadow-2xl space-y-3 select-none">
      {/* Compact Tactical Match Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-white font-heading">
              {isEn ? 'Cyber Clash 1v1' : 'Cyber Clash 1v1'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {isEn ? 'Destroy Enemy Turrets & Main Core' : 'Distruge Turnurile și Nucleul Adversarului'}
            </p>
          </div>
        </div>

        {/* Scoreboard: Crowns + Clock */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold tabular-nums">
            <span className="text-sky-300 flex items-center gap-1">
              <span>{studentAvatar}</span>
              <span className="hidden sm:inline max-w-[90px] truncate">{studentName}</span>
              <span className="text-amber-400 ml-1">👑 {playerCrowns}</span>
            </span>
            <span className="text-slate-600">vs</span>
            <span className="text-rose-300 flex items-center gap-1">
              <span className="text-amber-400 mr-1">{enemyCrowns} 👑</span>
              <span className="hidden sm:inline max-w-[90px] truncate">{opponentName}</span>
              <span>{opponentAvatar}</span>
            </span>
          </div>

          <div
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black tabular-nums flex items-center gap-1.5 border ${
              isOvertime
                ? 'bg-rose-950/90 border-rose-500 text-rose-300 animate-pulse'
                : isDoubleEnergy
                ? 'bg-amber-950/80 border-amber-400 text-amber-300'
                : 'bg-slate-950 border-slate-700 text-cyan-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>
              {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
            </span>
            {isDoubleEnergy && <span className="text-[10px] text-amber-400 font-black">2x⚡</span>}
          </div>

          <button
            type="button"
            onClick={() => setSoundEnabled((v) => !v)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            title={isEn ? 'Toggle Sound' : 'Sunet On/Off'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isEn ? 'Exit' : 'Ieși'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Arena + Deck Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Battlefield Canvas Column */}
        <div className="lg:col-span-7 flex flex-col items-center relative">
          <div className="relative w-full max-w-[440px] rounded-2xl overflow-hidden border-2 border-cyan-500/40 shadow-2xl bg-slate-950">
            <canvas
              ref={canvasRef}
              width={ARENA_W}
              height={ARENA_H}
              onPointerDown={handleCanvasPointerDown}
              onPointerMove={handleCanvasPointerMove}
              onPointerLeave={() => {
                hoverPosRef.current = null;
              }}
              className="w-full h-auto block cursor-crosshair touch-none"
            />

            {/* Floating Non-Blocking Alert Banner */}
            {matchBanner && !matchResult && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-xl bg-slate-950/90 border border-amber-400/60 text-amber-300 font-black text-xs shadow-lg pointer-events-none whitespace-nowrap">
                {matchBanner}
              </div>
            )}

            {/* End of Match Summary Overlay */}
            {matchResult && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl ${
                    matchResult.won
                      ? 'bg-gradient-to-br from-amber-400 to-orange-600 text-white'
                      : 'bg-gradient-to-br from-rose-600 to-slate-800 text-rose-200'
                  }`}
                >
                  <Trophy className="w-9 h-9" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white font-heading">
                    {matchResult.draw
                      ? isEn
                        ? 'DRAW MATCH!'
                        : 'EGALITATE!'
                      : matchResult.won
                      ? isEn
                        ? 'VICTORY! 👑'
                        : 'VICTORIE! 👑'
                      : isEn
                      ? 'DEFEAT!'
                      : 'ÎNFRÂNGERE!'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    {isEn ? matchResult.reasonEn : matchResult.reasonRo}
                  </p>
                </div>

                <div className="flex items-center gap-5 px-5 py-3 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-sm font-black">
                  <span className="text-sky-300">👑 {matchResult.playerCrowns}</span>
                  <span className="text-slate-500">-</span>
                  <span className="text-rose-300">{matchResult.enemyCrowns} 👑</span>
                  <span className="text-slate-700">|</span>
                  <span className="text-emerald-400">+{matchResult.finalScore} XP</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  {!isLivePvP && (
                    <button
                      type="button"
                      onClick={handleRestartSolo}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>{isEn ? 'Play Again' : 'Joacă Din Nou'}</span>
                    </button>
                  )}
                  {onBack && (
                    <button
                      type="button"
                      onClick={onBack}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{isEn ? 'Back to Arena' : 'Înapoi la Arenă'}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tactical Command Deck & Bandwidth Column */}
        <div className="lg:col-span-5 space-y-3.5">
          {/* Energy / Bandwidth Meter */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-cyan-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                {isEn ? 'Bandwidth Energy' : 'Energie Lățime Bandă'}
                {isDoubleEnergy && (
                  <span className="text-amber-400 font-black ml-1">
                    {isEn ? '(2x SPEED)' : '(VITEZĂ 2x)'}
                  </span>
                )}
              </span>
              <span className="font-mono text-base font-black text-amber-300 tabular-nums">
                {Math.floor(energy)} / 10 ⚡
              </span>
            </div>

            <div className="h-4 w-full rounded-full bg-slate-900 border border-slate-700 overflow-hidden p-0.5 flex gap-0.5">
              {Array.from({ length: 10 }).map((_, idx) => {
                const filled = energy >= idx + 1;
                const partial = !filled && energy > idx ? Math.round((energy - idx) * 100) : 0;
                return (
                  <div key={idx} className="flex-1 h-full rounded-sm bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-75 ${
                        isDoubleEnergy
                          ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                          : 'bg-gradient-to-r from-cyan-400 to-sky-500'
                      }`}
                      style={{ width: filled ? '100%' : `${partial}%` }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4-Card Active Hand */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">
                {isEn ? 'Tactical Hand (Keys 1-4 · Tap Arena)' : 'Pachet Activ (Taste 1-4 · Atinge Arena)'}
              </span>
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                {isEn ? 'Next:' : 'Urmează:'} <span className="text-white font-bold">{nextCard.icon} {isEn ? nextCard.nameEn : nextCard.nameRo}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5">
              {handCards.map((cId, idx) => {
                const card = CARD_MAP[cId];
                const isSelected = selectedHandIdx === idx;
                const affordable = energy >= card.cost;
                return (
                  <button
                    key={`${cId}_${idx}`}
                    type="button"
                    onClick={() => {
                      setSelectedHandIdx(idx);
                      playTone(440, 0.05, 'sine', 0.05);
                    }}
                    className={`min-h-[76px] p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between touch-manipulation active:scale-95 ${
                      isSelected
                        ? 'bg-sky-950/90 border-cyan-400 ring-2 ring-cyan-400/30 shadow-lg'
                        : affordable
                        ? 'bg-slate-900 border-slate-700 hover:border-slate-500'
                        : 'bg-slate-900/50 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xl leading-none">{card.icon}</span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-xs font-mono font-black ${
                          affordable ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-950 text-rose-400'
                        }`}
                      >
                        {card.cost}⚡
                      </span>
                    </div>
                    <div className="mt-1">
                      <div className="text-xs font-black text-white truncate">
                        [{idx + 1}] {isEn ? card.nameEn : card.nameRo}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {isEn ? card.roleEn : card.roleRo}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick 1-Tap Lane Deploy Buttons (Awesome for Mobile Thumb Play) */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
                <span>
                  {isEn ? 'Quick Deploy:' : 'Lansare Rapidă:'}{' '}
                  <span className="text-cyan-300">{selectedCardDef.icon} {isEn ? selectedCardDef.nameEn : selectedCardDef.nameRo}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">[Q] / [E]</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  disabled={energy < selectedCardDef.cost || Boolean(matchResult)}
                  onClick={() =>
                    deployPlayerCard(
                      selectedHandIdx,
                      LEFT_BRIDGE_X,
                      selectedCardDef.isSpell ? 150 : ARENA_H - 175
                    )
                  }
                  className="min-h-[46px] px-3 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 disabled:opacity-40 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer touch-manipulation"
                >
                  <Shield className="w-4 h-4" />
                  <span>{isEn ? 'Left Lane [Q]' : 'Banda Stângă [Q]'}</span>
                </button>
                <button
                  type="button"
                  disabled={energy < selectedCardDef.cost || Boolean(matchResult)}
                  onClick={() =>
                    deployPlayerCard(
                      selectedHandIdx,
                      RIGHT_BRIDGE_X,
                      selectedCardDef.isSpell ? 150 : ARENA_H - 175
                    )
                  }
                  className="min-h-[46px] px-3 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer touch-manipulation"
                >
                  <Flame className="w-4 h-4" />
                  <span>{isEn ? 'Right Lane [E]' : 'Banda Dreaptă [E]'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Concise Tactical Tips (RO / EN) */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEn ? 'Commander Strategy Tips' : 'Sfaturi Tactice de Comandant'}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isEn
                ? 'Counter Tanks with DDoS Swarm, freeze pushes with EMP Shockwave anywhere on the map, and protect Bridges!'
                : 'Oprește Golemii cu Roiul DDoS, paralizează atacurile cu Impulsul EMP oriunde pe hartă și apără Podurile de Date!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
