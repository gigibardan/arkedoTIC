import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Anchor,
  Crosshair,
  Radar,
  Flame,
  Zap,
  Shield,
  RotateCw,
  Shuffle,
  Trash2,
  Volume2,
  VolumeX,
  Trophy,
  RotateCcw,
  ArrowLeft,
  Clock,
  CheckCircle2,
  Bomb,
  Wrench,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  BattleshipCellOutcome,
  BattleshipSyncEvent,
  BattleshipWeaponType,
  DuelRoomData,
  sendBattleshipEvent,
  updateDuelProgress,
} from '../../lib/duelService';
import { recordStudentDuelResult } from '../../lib/studentAuthService';
import { forceScrollToTop } from '../../utils/scrollHelper';

interface CyberBattleshipDuelGameProps {
  roomData?: DuelRoomData | null;
  isHost?: boolean;
  studentName?: string;
  studentAvatar?: string;
  onFinish?: (score: number, won: boolean) => void;
  onBack?: () => void;
}

interface ShipBlueprint {
  id: string;
  nameRo: string;
  nameEn: string;
  length: number;
  color: string;
}

interface PlacedShip {
  id: string;
  nameRo: string;
  nameEn: string;
  length: number;
  cells: Array<{ x: number; y: number }>;
  hits: boolean[];
  sunk: boolean;
}

type RadarCellStatus = 'unknown' | 'miss' | 'hit' | 'sunk' | 'mine';

interface RadarCell {
  status: RadarCellStatus;
  sonarCount?: number;
}

interface MyBoardCell {
  shipId: string | null;
  hasMine: boolean;
  shielded: boolean;
  hit: boolean;
  miss: boolean;
}

const GRID_SIZE = 10;
const TURN_SECONDS = 25;
const COL_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

const SHIP_BLUEPRINTS: ShipBlueprint[] = [
  { id: 'carrier', nameRo: 'Portavion Cuantic', nameEn: 'Quantum Carrier', length: 5, color: 'bg-cyan-500' },
  { id: 'battleship', nameRo: 'Cuirasat Firewall', nameEn: 'Firewall Battleship', length: 4, color: 'bg-indigo-500' },
  { id: 'cruiser', nameRo: 'Crucișător Router', nameEn: 'Router Cruiser', length: 3, color: 'bg-emerald-500' },
  { id: 'submarine', nameRo: 'Submarin Stealth', nameEn: 'Stealth Proxy Sub', length: 3, color: 'bg-purple-500' },
  { id: 'destroyer', nameRo: 'Distrugător Pachete', nameEn: 'Packet Destroyer', length: 2, color: 'bg-amber-500' },
];

function createEmptyMyBoard(): MyBoardCell[][] {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => ({
      shipId: null,
      hasMine: false,
      shielded: false,
      hit: false,
      miss: false,
    }))
  );
}

function createEmptyRadarBoard(): RadarCell[][] {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => ({ status: 'unknown' }))
  );
}

function generateRandomFleet(): { board: MyBoardCell[][]; ships: PlacedShip[]; mines: Array<{ x: number; y: number }> } {
  const board = createEmptyMyBoard();
  const ships: PlacedShip[] = [];

  for (const bp of SHIP_BLUEPRINTS) {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 250) {
      attempts++;
      const horizontal = Math.random() < 0.5;
      const maxX = horizontal ? GRID_SIZE - bp.length : GRID_SIZE - 1;
      const maxY = horizontal ? GRID_SIZE - 1 : GRID_SIZE - bp.length;
      const sx = Math.floor(Math.random() * (maxX + 1));
      const sy = Math.floor(Math.random() * (maxY + 1));

      const coords: Array<{ x: number; y: number }> = [];
      let conflict = false;
      for (let i = 0; i < bp.length; i++) {
        const cx = horizontal ? sx + i : sx;
        const cy = horizontal ? sy : sy + i;
        if (board[cy][cx].shipId !== null) {
          conflict = true;
          break;
        }
        coords.push({ x: cx, y: cy });
      }
      if (!conflict) {
        for (const pt of coords) {
          board[pt.y][pt.x].shipId = bp.id;
        }
        ships.push({
          id: bp.id,
          nameRo: bp.nameRo,
          nameEn: bp.nameEn,
          length: bp.length,
          cells: coords,
          hits: Array(bp.length).fill(false),
          sunk: false,
        });
        placed = true;
      }
    }
  }

  // Place 2 Cyber EMP Mines on empty water
  const mines: Array<{ x: number; y: number }> = [];
  let mineAttempts = 0;
  while (mines.length < 2 && mineAttempts < 100) {
    mineAttempts++;
    const mx = Math.floor(Math.random() * GRID_SIZE);
    const my = Math.floor(Math.random() * GRID_SIZE);
    if (board[my][mx].shipId === null && !board[my][mx].hasMine) {
      board[my][mx].hasMine = true;
      mines.push({ x: mx, y: my });
    }
  }

  return { board, ships, mines };
}

function getWeaponTargetCells(
  cx: number,
  cy: number,
  weapon: BattleshipWeaponType
): Array<{ x: number; y: number }> {
  const raw: Array<{ x: number; y: number }> = [];
  if (weapon === 'railgun') {
    raw.push({ x: cx, y: cy });
  } else if (weapon === 'sonar') {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        raw.push({ x: cx + dx, y: cy + dy });
      }
    }
  } else if (weapon === 'cluster') {
    raw.push({ x: cx, y: cy }, { x: cx - 1, y: cy }, { x: cx + 1, y: cy }, { x: cx, y: cy - 1 }, { x: cx, y: cy + 1 });
  } else if (weapon === 'torpedo_h') {
    const startX = Math.max(0, Math.min(GRID_SIZE - 4, cx));
    for (let i = 0; i < 4; i++) raw.push({ x: startX + i, y: cy });
  } else if (weapon === 'torpedo_v') {
    const startY = Math.max(0, Math.min(GRID_SIZE - 4, cy));
    for (let i = 0; i < 4; i++) raw.push({ x: cx, y: startY + i });
  }
  return raw.filter((p) => p.x >= 0 && p.x < GRID_SIZE && p.y >= 0 && p.y < GRID_SIZE);
}

export const CyberBattleshipDuelGame: React.FC<CyberBattleshipDuelGameProps> = ({
  roomData,
  isHost = true,
  studentName = 'Commander',
  studentAvatar = '⚓',
  onFinish,
  onBack,
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const isLivePvP = Boolean(roomData && roomData.guest && roomData.guest.id !== 'practice_bot');
  const opponentName = isLivePvP
    ? (isHost ? roomData?.guest?.name : roomData?.host?.name) || (isEn ? 'Rival Admiral' : 'Amiral Rival')
    : 'Admiral Cyber-Bot AI';
  const opponentAvatar = isLivePvP
    ? (isHost ? roomData?.guest?.avatar : roomData?.host?.avatar) || '🚀'
    : '🤖';

  // Phase: 'deploy' -> 'battle'
  const [phase, setPhase] = useState<'deploy' | 'battle'>('deploy');
  const [mobileBoardTab, setMobileBoardTab] = useState<'radar' | 'fleet'>('radar');

  // Deployment state
  const [myBoard, setMyBoard] = useState<MyBoardCell[][]>(() => createEmptyMyBoard());
  const [myShips, setMyShips] = useState<PlacedShip[]>([]);
  const [minesPlaced, setMinesPlaced] = useState<Array<{ x: number; y: number }>>([]);
  const [selectedDeployId, setSelectedDeployId] = useState<string>('carrier'); // ship id or 'mine'
  const [deployHorizontal, setDeployHorizontal] = useState<boolean>(true);
  const [hoverDeployCell, setHoverDeployCell] = useState<{ x: number; y: number } | null>(null);
  const [myReady, setMyReady] = useState(false);
  const [oppReady, setOppReady] = useState(!isLivePvP);

  // Battle state
  const [radarBoard, setRadarBoard] = useState<RadarCell[][]>(() => createEmptyRadarBoard());
  const [enemySunkShips, setEnemySunkShips] = useState<Array<{ id: string; nameRo: string; nameEn: string; length: number }>>([]);
  const [isMyTurn, setIsMyTurn] = useState<boolean>(() => (isLivePvP ? isHost : true));
  const [awaitingAck, setAwaitingAck] = useState(false);
  const [selectedWeapon, setSelectedWeapon] = useState<BattleshipWeaponType>('railgun');
  const [hoverRadarCell, setHoverRadarCell] = useState<{ x: number; y: number } | null>(null);
  const [sonarUsedThisTurn, setSonarUsedThisTurn] = useState(false);
  const [repairUsedThisTurn, setRepairUsedThisTurn] = useState(false);

  const [energy, setEnergy] = useState(35);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [turnClock, setTurnClock] = useState(TURN_SECONDS);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [matchResult, setMatchResult] = useState<{
    won: boolean;
    finalScore: number;
    mySunk: number;
    enemySunk: number;
    reasonRo: string;
    reasonEn: string;
  } | null>(null);

  // Refs for instant access inside event handlers & Bot AI
  const myBoardRef = useRef<MyBoardCell[][]>(myBoard);
  const myShipsRef = useRef<PlacedShip[]>(myShips);
  const radarBoardRef = useRef<RadarCell[][]>(radarBoard);
  const enemySunkRef = useRef(enemySunkShips);
  const scoreRef = useRef(0);
  const energyRef = useRef(35);
  const streakRef = useRef(0);
  const finishedRef = useRef(false);
  const soundEnabledRef = useRef(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // AI Secret Enemy Fleet
  const aiFleetRef = useRef<{ board: MyBoardCell[][]; ships: PlacedShip[] }>(generateRandomFleet());
  const aiEnergyRef = useRef(30);
  const aiTargetQueueRef = useRef<Array<{ x: number; y: number }>>([]);
  const aiShotGridRef = useRef<Array<Array<'unknown' | 'hit' | 'miss' | 'sunk'>>>(
    Array.from({ length: GRID_SIZE }, () => Array<'unknown' | 'hit' | 'miss' | 'sunk'>(GRID_SIZE).fill('unknown'))
  );

  // Live PvP sync tracking
  const myEventsRef = useRef<BattleshipSyncEvent[]>([]);
  const processedRemoteIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    forceScrollToTop();
  }, []);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    myBoardRef.current = myBoard;
  }, [myBoard]);

  useEffect(() => {
    myShipsRef.current = myShips;
  }, [myShips]);

  useEffect(() => {
    radarBoardRef.current = radarBoard;
  }, [radarBoard]);

  useEffect(() => {
    enemySunkRef.current = enemySunkShips;
  }, [enemySunkShips]);

  const playTone = useCallback(
    (freq: number, duration = 0.09, type: OscillatorType = 'triangle', gainVal = 0.08, endFreq?: number) => {
      if (!soundEnabledRef.current) return;
      try {
        const AudioCtx =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        const now = ctx.currentTime;
        osc.frequency.setValueAtTime(freq, now);
        if (endFreq !== undefined) {
          osc.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), now + duration);
        }
        gain.gain.setValueAtTime(gainVal, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + duration + 0.02);
      } catch {
        // Ignore blocked audio context
      }
    },
    []
  );

  const pushLog = useCallback((msg: string) => {
    setCombatLog((prev) => [msg, ...prev].slice(0, 6));
  }, []);

  const emitPvPEvent = useCallback(
    (evt: Omit<BattleshipSyncEvent, 'id' | 'createdAt'>) => {
      if (!isLivePvP || !roomData?.roomCode) return;
      const fullEvt: BattleshipSyncEvent = {
        ...evt,
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        createdAt: Date.now(),
      };
      myEventsRef.current = [...myEventsRef.current.slice(-30), fullEvt];
      sendBattleshipEvent(roomData.roomCode, isHost, myEventsRef.current);
    },
    [isHost, isLivePvP, roomData?.roomCode]
  );

  const concludeMatch = useCallback(
    (won: boolean, reasonRo: string, reasonEn: string) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      const mySunkCount = myShipsRef.current.filter((s) => s.sunk).length;
      const enemySunkCount = enemySunkRef.current.length;
      const finalScore = Math.max(90, Math.min(1000, scoreRef.current + (won ? 300 : 0)));

      setMatchResult({
        won,
        finalScore,
        mySunk: mySunkCount,
        enemySunk: enemySunkCount,
        reasonRo,
        reasonEn,
      });

      if (won) {
        playTone(523, 0.14, 'triangle', 0.1, 784);
        setTimeout(() => playTone(784, 0.3, 'triangle', 0.1, 1046), 140);
      } else {
        playTone(250, 0.28, 'sawtooth', 0.09, 105);
      }

      if (roomData?.roomCode) {
        const myId = isHost ? roomData.host.id : roomData.guest?.id;
        const myName = isHost ? roomData.host.name : roomData.guest?.name || studentName;
        const oppId = isHost ? roomData.guest?.id : roomData.host.id;

        if (won) {
          updateDuelProgress(
            roomData.roomCode,
            isHost,
            { progress: 100, score: finalScore, finishedAt: Date.now() },
            myId,
            myName
          );
        } else {
          updateDuelProgress(
            roomData.roomCode,
            isHost,
            { progress: Math.min(99, enemySunkCount * 20), score: scoreRef.current, finishedAt: Date.now() },
            oppId,
            opponentName
          );
        }
      }

      recordStudentDuelResult(won, 'cyber_battleship', finalScore);
      onFinish?.(finalScore, won);
    },
    [isHost, onFinish, opponentName, playTone, roomData, studentName]
  );

  // Resolve incoming shots against a fleet board (used both for My Fleet against AI/PvP and AI Fleet against Player)
  const applyShotsToFleet = useCallback(
    (
      board: MyBoardCell[][],
      ships: PlacedShip[],
      cells: Array<{ x: number; y: number }>
    ): {
      nextBoard: MyBoardCell[][];
      nextShips: PlacedShip[];
      outcomes: BattleshipCellOutcome[];
      allSunk: boolean;
      sunkShipsCount: number;
    } => {
      const nextBoard = board.map((row) => row.map((c) => ({ ...c })));
      const nextShips = ships.map((s) => ({ ...s, hits: [...s.hits] }));
      const outcomes: BattleshipCellOutcome[] = [];

      for (const pt of cells) {
        if (pt.x < 0 || pt.x >= GRID_SIZE || pt.y < 0 || pt.y >= GRID_SIZE) continue;
        const cell = nextBoard[pt.y][pt.x];

        if (cell.hit || cell.miss) continue;

        if (cell.hasMine) {
          cell.hit = true;
          cell.hasMine = false;
          outcomes.push({ x: pt.x, y: pt.y, status: 'mine' });
          continue;
        }

        if (cell.shielded) {
          cell.shielded = false;
          cell.miss = true;
          outcomes.push({ x: pt.x, y: pt.y, status: 'miss' });
          continue;
        }

        if (cell.shipId) {
          cell.hit = true;
          const ship = nextShips.find((s) => s.id === cell.shipId);
          if (ship) {
            const segIdx = ship.cells.findIndex((c) => c.x === pt.x && c.y === pt.y);
            if (segIdx >= 0) ship.hits[segIdx] = true;
            const nowSunk = ship.hits.every(Boolean);
            if (nowSunk && !ship.sunk) {
              ship.sunk = true;
              outcomes.push({
                x: pt.x,
                y: pt.y,
                status: 'sunk',
                sunkShipId: ship.id,
                sunkShipNameRo: ship.nameRo,
                sunkShipNameEn: ship.nameEn,
                sunkCells: ship.cells,
              });
            } else {
              outcomes.push({ x: pt.x, y: pt.y, status: 'hit' });
            }
          } else {
            outcomes.push({ x: pt.x, y: pt.y, status: 'hit' });
          }
        } else {
          cell.miss = true;
          outcomes.push({ x: pt.x, y: pt.y, status: 'miss' });
        }
      }

      const sunkShipsCount = nextShips.filter((s) => s.sunk).length;
      const allSunk = nextShips.length > 0 && sunkShipsCount === nextShips.length;
      return { nextBoard, nextShips, outcomes, allSunk, sunkShipsCount };
    },
    []
  );

  // Process outcomes returned onto MY enemy Radar
  const applyOutcomesToRadar = useCallback(
    (outcomes: BattleshipCellOutcome[]) => {
      let anyHit = false;
      let hitCount = 0;
      let mineCount = 0;
      let newlySunkShip: { id: string; nameRo: string; nameEn: string; length: number } | null = null;

      setRadarBoard((prev) => {
        const next = prev.map((row) => row.map((c) => ({ ...c })));
        for (const out of outcomes) {
          if (out.status === 'mine') {
            next[out.y][out.x] = { status: 'mine' };
            mineCount++;
          } else if (out.status === 'hit') {
            next[out.y][out.x] = { status: 'hit' };
            anyHit = true;
            hitCount++;
          } else if (out.status === 'sunk') {
            anyHit = true;
            hitCount++;
            if (out.sunkCells) {
              for (const sc of out.sunkCells) {
                next[sc.y][sc.x] = { status: 'sunk' };
              }
            } else {
              next[out.y][out.x] = { status: 'sunk' };
            }
            if (out.sunkShipId && !enemySunkRef.current.some((e) => e.id === out.sunkShipId)) {
              newlySunkShip = {
                id: out.sunkShipId,
                nameRo: out.sunkShipNameRo || out.sunkShipId,
                nameEn: out.sunkShipNameEn || out.sunkShipId,
                length: out.sunkCells?.length || 3,
              };
            }
          } else {
            if (next[out.y][out.x].status === 'unknown') {
              next[out.y][out.x] = { status: 'miss' };
            }
          }
        }
        return next;
      });

      if (newlySunkShip) {
        const sunkInfo = newlySunkShip as { id: string; nameRo: string; nameEn: string; length: number };
        setEnemySunkShips((prev) => {
          if (prev.some((e) => e.id === sunkInfo.id)) return prev;
          const updated = [...prev, sunkInfo];
          if (roomData?.roomCode) {
            updateDuelProgress(roomData.roomCode, isHost, {
              progress: Math.min(95, updated.length * 20),
              score: scoreRef.current + 150,
            });
          }
          if (updated.length >= SHIP_BLUEPRINTS.length) {
            setTimeout(() => {
              concludeMatch(
                true,
                'VICTORIE NAVALĂ! Ai scufundat întreaga flotă cibernetică a adversarului!',
                'NAVAL VICTORY! You sank all 5 enemy cyber vessels!'
              );
            }, 350);
          }
          return updated;
        });
        playTone(180, 0.28, 'sawtooth', 0.1, 70);
        pushLog(
          isEn
            ? `💥 SUNK ${sunkInfo.nameEn}! (+150 pts, +20⚡)`
            : `💥 SCUFUNDAT: ${sunkInfo.nameRo}! (+150 pct, +20⚡)`
        );
      } else if (anyHit) {
        playTone(460, 0.12, 'triangle', 0.09, 210);
        pushLog(
          isEn
            ? `🎯 Direct HIT x${hitCount}! (+${hitCount * 65} pts)`
            : `🎯 Lovitură DIRECTĂ x${hitCount}! (+${hitCount * 65} pct)`
        );
      } else if (mineCount > 0) {
        playTone(150, 0.22, 'sawtooth', 0.09, 90);
        pushLog(
          isEn
            ? `💣 Enemy EMP Mine triggered! (-25⚡ Energy)`
            : `💣 Mină EMP inamică detonată! (-25⚡ Energie)`
        );
      } else {
        playTone(280, 0.09, 'sine', 0.05, 190);
        pushLog(isEn ? '🌊 Splash — Sector empty.' : '🌊 Ratare — Sector gol.');
      }

      if (anyHit) {
        streakRef.current += 1;
        setStreak(streakRef.current);
      } else {
        streakRef.current = 0;
        setStreak(0);
      }

      const energyDelta =
        (anyHit ? hitCount * 22 : 14) +
        (newlySunkShip ? 20 : 0) -
        mineCount * 25;
      energyRef.current = Math.max(0, Math.min(100, energyRef.current + energyDelta));
      setEnergy(energyRef.current);

      const ptsGain =
        hitCount * (65 + Math.min(3, streakRef.current) * 15) +
        (newlySunkShip ? 150 : 0) +
        (hitCount === 0 ? 10 : 0);
      scoreRef.current += ptsGain;
      setScore(scoreRef.current);
    },
    [concludeMatch, isEn, isHost, playTone, pushLog, roomData?.roomCode]
  );

  // Auto-transition to Battle once both sides are ready
  useEffect(() => {
    if (phase === 'deploy' && myReady && oppReady) {
      setPhase('battle');
      setTurnClock(TURN_SECONDS);
      pushLog(
        isEn
          ? '⚓ Fleet locked! Cyber Naval Battle initiated!'
          : '⚓ Flotă blocată! Bătălia navală cibernetică a început!'
      );
      playTone(580, 0.14, 'triangle', 0.08, 880);
    }
  }, [isEn, myReady, oppReady, phase, playTone, pushLog]);

  // Listen to Remote PvP events
  useEffect(() => {
    if (!isLivePvP || !roomData) return;
    const remoteList: BattleshipSyncEvent[] =
      (isHost ? roomData.guestBattleshipEvents : roomData.hostBattleshipEvents) || [];

    for (const evt of remoteList) {
      if (processedRemoteIdsRef.current.has(evt.id)) continue;
      processedRemoteIdsRef.current.add(evt.id);

      if (evt.kind === 'ready') {
        setOppReady(true);
      } else if (evt.kind === 'fire' && evt.cells && evt.shotId) {
        const res = applyShotsToFleet(myBoardRef.current, myShipsRef.current, evt.cells);
        myBoardRef.current = res.nextBoard;
        myShipsRef.current = res.nextShips;
        setMyBoard(res.nextBoard);
        setMyShips(res.nextShips);

        emitPvPEvent({
          kind: 'result',
          shotId: evt.shotId,
          outcomes: res.outcomes,
          shipsRemaining: SHIP_BLUEPRINTS.length - res.sunkShipsCount,
        });

        const anyHitOnMe = res.outcomes.some((o) => o.status === 'hit' || o.status === 'sunk');
        if (anyHitOnMe) {
          playTone(210, 0.16, 'sawtooth', 0.09, 100);
          pushLog(isEn ? '🚨 Rival hit your hull!' : '🚨 Rivalul ți-a lovit o navă!');
        } else {
          playTone(320, 0.08, 'sine', 0.05);
          pushLog(isEn ? '🛡️ Enemy salvo missed!' : '🛡️ Salva inamică a ratat!');
        }

        if (res.allSunk) {
          concludeMatch(
            false,
            'Întreaga ta flotă a fost scufundată de amiralul advers!',
            'Your entire cyber fleet was sunk by the enemy admiral!'
          );
        } else {
          setIsMyTurn(true);
          setSonarUsedThisTurn(false);
          setRepairUsedThisTurn(false);
          setTurnClock(TURN_SECONDS);
        }
      } else if (evt.kind === 'sonar_req' && evt.cells && evt.shotId) {
        let signals = 0;
        for (const pt of evt.cells) {
          const c = myBoardRef.current[pt.y]?.[pt.x];
          if (c && c.shipId && !c.hit) {
            signals++;
          }
        }
        emitPvPEvent({
          kind: 'sonar_res',
          shotId: evt.shotId,
          cells: evt.cells,
          sonarSignals: signals,
        });
      } else if (evt.kind === 'result' && evt.outcomes) {
        setAwaitingAck(false);
        applyOutcomesToRadar(evt.outcomes);
        setIsMyTurn(false);
        setTurnClock(TURN_SECONDS);
      } else if (evt.kind === 'sonar_res' && evt.cells && typeof evt.sonarSignals === 'number') {
        const center = evt.cells[Math.floor(evt.cells.length / 2)] || evt.cells[0];
        if (center) {
          const countVal = evt.sonarSignals;
          setRadarBoard((prev) => {
            const next = prev.map((r) => r.map((c) => ({ ...c })));
            next[center.y][center.x] = { ...next[center.y][center.x], sonarCount: countVal };
            return next;
          });
          playTone(760, 0.18, 'sine', 0.08, 1020);
          pushLog(
            isEn
              ? `📡 Sonar Ping at ${COL_LABELS[center.x]}${center.y + 1}: ${countVal} ship signal(s)!`
              : `📡 Scanare Sonar la ${COL_LABELS[center.x]}${center.y + 1}: ${countVal} semnale navale!`
          );
        }
      } else if (evt.kind === 'repair') {
        pushLog(isEn ? '🔧 Rival activated Nano-Repair & Jammer!' : '🔧 Rivalul a activat Nano-Reparația!');
      }
    }
  }, [
    applyOutcomesToRadar,
    applyShotsToFleet,
    concludeMatch,
    emitPvPEvent,
    isEn,
    isHost,
    isLivePvP,
    playTone,
    pushLog,
    roomData,
  ]);

  // Cyber-Bot Smart AI Turn Execution
  const runBotTurn = useCallback(() => {
    if (finishedRef.current || isLivePvP) return;

    // Bot AI chooses weapon if enough energy
    let botWeapon: BattleshipWeaponType = 'railgun';
    if (aiEnergyRef.current >= 55 && Math.random() < 0.45) {
      botWeapon = Math.random() < 0.5 ? 'cluster' : Math.random() < 0.5 ? 'torpedo_h' : 'torpedo_v';
      aiEnergyRef.current -= 50;
    }

    // Choose target cell: Target queue first, else checkerboard parity Hunt!
    let target: { x: number; y: number } | null = null;
    while (aiTargetQueueRef.current.length > 0 && !target) {
      const candidate = aiTargetQueueRef.current.shift()!;
      if (aiShotGridRef.current[candidate.y]?.[candidate.x] === 'unknown') {
        target = candidate;
      }
    }

    if (!target) {
      const parityPool: Array<{ x: number; y: number }> = [];
      const fallbackPool: Array<{ x: number; y: number }> = [];
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          if (aiShotGridRef.current[y][x] === 'unknown') {
            fallbackPool.push({ x, y });
            if ((x + y) % 2 === 0) parityPool.push({ x, y });
          }
        }
      }
      const pool = parityPool.length > 0 ? parityPool : fallbackPool;
      if (pool.length > 0) {
        target = pool[Math.floor(Math.random() * pool.length)];
      }
    }

    if (!target) return;

    const strikeCells = getWeaponTargetCells(target.x, target.y, botWeapon);
    const res = applyShotsToFleet(myBoardRef.current, myShipsRef.current, strikeCells);
    myBoardRef.current = res.nextBoard;
    myShipsRef.current = res.nextShips;
    setMyBoard(res.nextBoard);
    setMyShips(res.nextShips);

    let botHitAny = false;
    let botSunkAny = false;
    for (const out of res.outcomes) {
      if (out.status === 'hit') {
        aiShotGridRef.current[out.y][out.x] = 'hit';
        botHitAny = true;
        const adj = [
          { x: out.x - 1, y: out.y },
          { x: out.x + 1, y: out.y },
          { x: out.x, y: out.y - 1 },
          { x: out.x, y: out.y + 1 },
        ].filter((p) => p.x >= 0 && p.x < GRID_SIZE && p.y >= 0 && p.y < GRID_SIZE);
        for (const a of adj) {
          if (aiShotGridRef.current[a.y][a.x] === 'unknown') {
            aiTargetQueueRef.current.unshift(a);
          }
        }
      } else if (out.status === 'sunk') {
        botHitAny = true;
        botSunkAny = true;
        if (out.sunkCells) {
          for (const sc of out.sunkCells) {
            aiShotGridRef.current[sc.y][sc.x] = 'sunk';
          }
        } else {
          aiShotGridRef.current[out.y][out.x] = 'sunk';
        }
      } else {
        aiShotGridRef.current[out.y][out.x] = 'miss';
        if (out.status === 'mine') {
          aiEnergyRef.current = Math.max(0, aiEnergyRef.current - 25);
        }
      }
    }

    aiEnergyRef.current = Math.min(100, aiEnergyRef.current + (botHitAny ? 26 : 15));

    if (botSunkAny) {
      playTone(170, 0.28, 'sawtooth', 0.1, 75);
      pushLog(
        isEn
          ? `🤖 Cyber-Bot fired ${botWeapon.toUpperCase()} & SUNK one of your ships!`
          : `🤖 Cyber-Bot a tras cu ${botWeapon.toUpperCase()} și ți-a SCUFUNDAT o navă!`
      );
    } else if (botHitAny) {
      playTone(230, 0.15, 'sawtooth', 0.08, 120);
      pushLog(
        isEn
          ? `🤖 Cyber-Bot hit ${COL_LABELS[target.x]}${target.y + 1}!`
          : `🤖 Cyber-Bot a lovit la ${COL_LABELS[target.x]}${target.y + 1}!`
      );
    } else {
      playTone(300, 0.08, 'sine', 0.05);
      pushLog(
        isEn
          ? `🤖 Cyber-Bot missed at ${COL_LABELS[target.x]}${target.y + 1}.`
          : `🤖 Cyber-Bot a ratat la ${COL_LABELS[target.x]}${target.y + 1}.`
      );
    }

    if (res.allSunk) {
      concludeMatch(
        false,
        'Flota ta a fost distrusă de Admiral Cyber-Bot AI!',
        'Your cyber fleet was eliminated by Admiral Cyber-Bot AI!'
      );
    } else {
      setIsMyTurn(true);
      setSonarUsedThisTurn(false);
      setRepairUsedThisTurn(false);
      setTurnClock(TURN_SECONDS);
    }
  }, [applyShotsToFleet, concludeMatch, isEn, isLivePvP, playTone, pushLog]);

  // Deployment Handlers
  const handleAutoPlaceFleet = () => {
    const gen = generateRandomFleet();
    setMyBoard(gen.board);
    setMyShips(gen.ships);
    setMinesPlaced(gen.mines);
    playTone(540, 0.08, 'triangle', 0.07, 740);
  };

  const handleClearDeploy = () => {
    setMyBoard(createEmptyMyBoard());
    setMyShips([]);
    setMinesPlaced([]);
    setSelectedDeployId('carrier');
    playTone(260, 0.08, 'sine', 0.06);
  };

  const handleDeployCellClick = (x: number, y: number) => {
    if (phase !== 'deploy' || myReady) return;
    const clickedCell = myBoard[y][x];

    // If clicking an already placed ship -> remove it so player can reposition
    if (clickedCell.shipId) {
      const targetId = clickedCell.shipId;
      const nextBoard = myBoard.map((row) =>
        row.map((c) => (c.shipId === targetId ? { ...c, shipId: null } : { ...c }))
      );
      setMyBoard(nextBoard);
      setMyShips((prev) => prev.filter((s) => s.id !== targetId));
      setSelectedDeployId(targetId);
      playTone(320, 0.06, 'sine', 0.05);
      return;
    }

    // If clicking an existing mine -> remove it
    if (clickedCell.hasMine) {
      const nextBoard = myBoard.map((row) => row.map((c) => ({ ...c })));
      nextBoard[y][x].hasMine = false;
      setMyBoard(nextBoard);
      setMinesPlaced((prev) => prev.filter((m) => !(m.x === x && m.y === y)));
      setSelectedDeployId('mine');
      playTone(320, 0.06, 'sine', 0.05);
      return;
    }

    // Placing Cyber Mine
    if (selectedDeployId === 'mine') {
      if (minesPlaced.length >= 2) return;
      const nextBoard = myBoard.map((row) => row.map((c) => ({ ...c })));
      nextBoard[y][x].hasMine = true;
      setMyBoard(nextBoard);
      setMinesPlaced((prev) => [...prev, { x, y }]);
      playTone(620, 0.07, 'triangle', 0.07);
      return;
    }

    // Placing Ship
    const bp = SHIP_BLUEPRINTS.find((s) => s.id === selectedDeployId);
    if (!bp || myShips.some((s) => s.id === bp.id)) return;

    const coords: Array<{ x: number; y: number }> = [];
    for (let i = 0; i < bp.length; i++) {
      const cx = deployHorizontal ? x + i : x;
      const cy = deployHorizontal ? y : y + i;
      if (cx >= GRID_SIZE || cy >= GRID_SIZE || myBoard[cy][cx].shipId !== null || myBoard[cy][cx].hasMine) {
        playTone(150, 0.1, 'square', 0.06);
        return;
      }
      coords.push({ x: cx, y: cy });
    }

    const nextBoard = myBoard.map((row) => row.map((c) => ({ ...c })));
    for (const pt of coords) {
      nextBoard[pt.y][pt.x].shipId = bp.id;
    }
    const newShip: PlacedShip = {
      id: bp.id,
      nameRo: bp.nameRo,
      nameEn: bp.nameEn,
      length: bp.length,
      cells: coords,
      hits: Array(bp.length).fill(false),
      sunk: false,
    };
    const nextShips = [...myShips, newShip];
    setMyBoard(nextBoard);
    setMyShips(nextShips);
    playTone(500, 0.08, 'triangle', 0.07, 680);

    // Auto-advance selection to next unplaced ship or mine
    const unplaced = SHIP_BLUEPRINTS.find((item) => !nextShips.some((ps) => ps.id === item.id));
    if (unplaced) {
      setSelectedDeployId(unplaced.id);
    } else if (minesPlaced.length < 2) {
      setSelectedDeployId('mine');
    }
  };

  const handleLockFleetReady = () => {
    if (myShips.length < SHIP_BLUEPRINTS.length) return;
    // Auto-place any unplaced Cyber Mines so player gets full defensive toolkit
    if (minesPlaced.length < 2) {
      const nextBoard = myBoard.map((row) => row.map((c) => ({ ...c })));
      const nextMines = [...minesPlaced];
      let guard = 0;
      while (nextMines.length < 2 && guard < 100) {
        guard++;
        const mx = Math.floor(Math.random() * GRID_SIZE);
        const my = Math.floor(Math.random() * GRID_SIZE);
        if (nextBoard[my][mx].shipId === null && !nextBoard[my][mx].hasMine) {
          nextBoard[my][mx].hasMine = true;
          nextMines.push({ x: mx, y: my });
        }
      }
      setMyBoard(nextBoard);
      setMinesPlaced(nextMines);
    }

    setMyReady(true);
    playTone(680, 0.12, 'triangle', 0.08, 920);
    if (isLivePvP) {
      emitPvPEvent({ kind: 'ready', shipsRemaining: SHIP_BLUEPRINTS.length });
    }
  };

  // Keyboard shortcut 'R' to rotate during deploy OR flip Torpedo H/V during battle
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        if (phase === 'deploy') {
          setDeployHorizontal((h) => !h);
        } else if (phase === 'battle') {
          setSelectedWeapon((w) => (w === 'torpedo_h' ? 'torpedo_v' : w === 'torpedo_v' ? 'torpedo_h' : w));
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase]);

  // Firing weapons on Enemy Radar
  const handleFireRadar = useCallback(
    (cx: number, cy: number) => {
      if (phase !== 'battle' || !isMyTurn || awaitingAck || finishedRef.current) return;

      const costMap: Record<BattleshipWeaponType, number> = {
        railgun: 0,
        sonar: 30,
        cluster: 50,
        torpedo_h: 60,
        torpedo_v: 60,
      };
      const cost = costMap[selectedWeapon];
      if (energyRef.current < cost) {
        setSelectedWeapon('railgun');
        return;
      }

      if (selectedWeapon === 'sonar') {
        if (sonarUsedThisTurn) return;
        const scanCells = getWeaponTargetCells(cx, cy, 'sonar');
        energyRef.current = Math.max(0, energyRef.current - 30);
        setEnergy(energyRef.current);
        setSonarUsedThisTurn(true);
        setSelectedWeapon('railgun');

        if (isLivePvP) {
          emitPvPEvent({
            kind: 'sonar_req',
            shotId: `son_${Date.now()}`,
            cells: scanCells,
          });
        } else {
          let signals = 0;
          for (const pt of scanCells) {
            const c = aiFleetRef.current.board[pt.y]?.[pt.x];
            if (c && c.shipId && !c.hit) signals++;
          }
          setRadarBoard((prev) => {
            const next = prev.map((r) => r.map((c) => ({ ...c })));
            next[cy][cx] = { ...next[cy][cx], sonarCount: signals };
            return next;
          });
          playTone(760, 0.18, 'sine', 0.08, 1040);
          pushLog(
            isEn
              ? `📡 Sonar Ping at ${COL_LABELS[cx]}${cy + 1}: ${signals} ship segment(s) detected!`
              : `📡 Scanare Sonar ${COL_LABELS[cx]}${cy + 1}: ${signals} segmente navale detectate!`
          );
        }
        return;
      }

      const rawTargets = getWeaponTargetCells(cx, cy, selectedWeapon);
      const validTargets = rawTargets.filter((pt) => radarBoardRef.current[pt.y][pt.x].status === 'unknown');
      if (validTargets.length === 0) return;

      // Deduct special weapon energy & reset back to Railgun after salvo
      if (cost > 0) {
        energyRef.current = Math.max(0, energyRef.current - cost);
        setEnergy(energyRef.current);
      }
      const weaponUsed = selectedWeapon;
      setSelectedWeapon('railgun');

      if (isLivePvP) {
        setAwaitingAck(true);
        emitPvPEvent({
          kind: 'fire',
          shotId: `shot_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          weapon: weaponUsed,
          cells: validTargets,
        });
        pushLog(
          isEn
            ? `🚀 Firing ${weaponUsed.toUpperCase()} at ${COL_LABELS[cx]}${cy + 1}...`
            : `🚀 Salva ${weaponUsed.toUpperCase()} spre ${COL_LABELS[cx]}${cy + 1}...`
        );
      } else {
        const res = applyShotsToFleet(aiFleetRef.current.board, aiFleetRef.current.ships, validTargets);
        aiFleetRef.current = { board: res.nextBoard, ships: res.nextShips };
        applyOutcomesToRadar(res.outcomes);

        if (!res.allSunk) {
          setIsMyTurn(false);
          setTurnClock(TURN_SECONDS);
          setTimeout(() => runBotTurn(), 750);
        }
      }
    },
    [
      applyOutcomesToRadar,
      applyShotsToFleet,
      awaitingAck,
      emitPvPEvent,
      isEn,
      isLivePvP,
      isMyTurn,
      phase,
      playTone,
      pushLog,
      runBotTurn,
      selectedWeapon,
      sonarUsedThisTurn,
    ]
  );

  // Defensive Nano-Repair Action (doesn't end turn!)
  const handleNanoRepair = () => {
    if (phase !== 'battle' || !isMyTurn || repairUsedThisTurn || energyRef.current < 45 || finishedRef.current) return;

    const damagedShip = myShipsRef.current.find((s) => !s.sunk && s.hits.some(Boolean));
    const intactCells: Array<{ x: number; y: number }> = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const c = myBoardRef.current[y][x];
        if (c.shipId && !c.hit && !c.shielded) intactCells.push({ x, y });
      }
    }
    if (!damagedShip && intactCells.length === 0) return;

    energyRef.current -= 45;
    setEnergy(energyRef.current);
    setRepairUsedThisTurn(true);

    const nextBoard = myBoardRef.current.map((row) => row.map((c) => ({ ...c })));
    const nextShips = myShipsRef.current.map((s) => ({ ...s, hits: [...s.hits] }));

    if (damagedShip) {
      const targetShip = nextShips.find((s) => s.id === damagedShip.id)!;
      const hitIdx = targetShip.hits.findIndex(Boolean);
      if (hitIdx >= 0) {
        targetShip.hits[hitIdx] = false;
        const coord = targetShip.cells[hitIdx];
        nextBoard[coord.y][coord.x].hit = false;
      }
    }
    if (intactCells.length > 0) {
      const shieldPt = intactCells[Math.floor(Math.random() * intactCells.length)];
      nextBoard[shieldPt.y][shieldPt.x].shielded = true;
    }

    myBoardRef.current = nextBoard;
    myShipsRef.current = nextShips;
    setMyBoard(nextBoard);
    setMyShips(nextShips);
    playTone(580, 0.16, 'triangle', 0.08, 960);
    pushLog(
      isEn
        ? '🔧 Nano-Repair restored 1 hull cell & deployed Radar Shield!'
        : '🔧 Nano-Reparație: 1 celulă refăcută + Scut Radar activat!'
    );
    if (isLivePvP) {
      emitPvPEvent({ kind: 'repair' });
    }
  };

  // Turn Shot Clock (prevents stalling in PvP or solo)
  useEffect(() => {
    if (phase !== 'battle' || !isMyTurn || awaitingAck || finishedRef.current) return;
    const t = setInterval(() => {
      setTurnClock((prev) => {
        if (prev <= 1) {
          // Auto-fire a valid unknown cell
          const candidates: Array<{ x: number; y: number }> = [];
          for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
              if (radarBoardRef.current[y][x].status === 'unknown') candidates.push({ x, y });
            }
          }
          if (candidates.length > 0) {
            const pick = candidates[Math.floor(Math.random() * candidates.length)];
            handleFireRadar(pick.x, pick.y);
          }
          return TURN_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [awaitingAck, handleFireRadar, isMyTurn, phase]);

  const handleRestartSolo = () => {
    finishedRef.current = false;
    aiFleetRef.current = generateRandomFleet();
    aiEnergyRef.current = 30;
    aiTargetQueueRef.current = [];
    aiShotGridRef.current = Array.from({ length: GRID_SIZE }, () =>
      Array<'unknown' | 'hit' | 'miss' | 'sunk'>(GRID_SIZE).fill('unknown')
    );

    const empty = createEmptyMyBoard();
    const emptyRadar = createEmptyRadarBoard();
    myBoardRef.current = empty;
    myShipsRef.current = [];
    radarBoardRef.current = emptyRadar;
    enemySunkRef.current = [];
    scoreRef.current = 0;
    energyRef.current = 35;
    streakRef.current = 0;

    setMyBoard(empty);
    setMyShips([]);
    setMinesPlaced([]);
    setSelectedDeployId('carrier');
    setPhase('deploy');
    setMyReady(false);
    setOppReady(true);
    setRadarBoard(emptyRadar);
    setEnemySunkShips([]);
    setIsMyTurn(true);
    setAwaitingAck(false);
    setSelectedWeapon('railgun');
    setSonarUsedThisTurn(false);
    setRepairUsedThisTurn(false);
    setEnergy(35);
    setStreak(0);
    setScore(0);
    setTurnClock(TURN_SECONDS);
    setCombatLog([]);
    setMatchResult(null);
  };

  // Hover highlight preview coordinates
  const deployPreviewSet = new Set<string>();
  let deployPreviewValid = true;
  if (phase === 'deploy' && hoverDeployCell && !myReady) {
    if (selectedDeployId === 'mine') {
      deployPreviewSet.add(`${hoverDeployCell.x}_${hoverDeployCell.y}`);
      deployPreviewValid =
        !myBoard[hoverDeployCell.y][hoverDeployCell.x].shipId &&
        !myBoard[hoverDeployCell.y][hoverDeployCell.x].hasMine &&
        minesPlaced.length < 2;
    } else {
      const bp = SHIP_BLUEPRINTS.find((s) => s.id === selectedDeployId);
      if (bp && !myShips.some((s) => s.id === bp.id)) {
        for (let i = 0; i < bp.length; i++) {
          const cx = deployHorizontal ? hoverDeployCell.x + i : hoverDeployCell.x;
          const cy = deployHorizontal ? hoverDeployCell.y : hoverDeployCell.y + i;
          if (cx >= GRID_SIZE || cy >= GRID_SIZE || myBoard[cy][cx].shipId !== null || myBoard[cy][cx].hasMine) {
            deployPreviewValid = false;
          }
          if (cx < GRID_SIZE && cy < GRID_SIZE) {
            deployPreviewSet.add(`${cx}_${cy}`);
          }
        }
      }
    }
  }

  const radarPreviewSet = new Set<string>();
  if (phase === 'battle' && hoverRadarCell && isMyTurn && !awaitingAck) {
    const pts = getWeaponTargetCells(hoverRadarCell.x, hoverRadarCell.y, selectedWeapon);
    for (const p of pts) radarPreviewSet.add(`${p.x}_${p.y}`);
  }

  const mySunkCount = myShips.filter((s) => s.sunk).length;

  return (
    <div className="space-y-3 select-none">
      {/* TOP BAR HUD */}
      <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/95 border border-cyan-500/40 shadow-xl flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title={isEn ? 'Back to Arena' : 'Înapoi la Arenă'}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5 font-heading truncate">
              <Anchor className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Cyber Battleship 1v1</span>
            </h3>
            <p className="text-[11px] text-slate-400 truncate">
              {studentAvatar} {studentName} vs {opponentAvatar} {opponentName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs font-black text-amber-300 tabular-nums">
            ⚡ {energy}/100
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs font-black text-cyan-300 tabular-nums">
            {score} pts
          </div>
          {phase === 'battle' && (
            <div
              className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-black flex items-center gap-1 tabular-nums ${
                isMyTurn
                  ? turnClock <= 6
                    ? 'bg-rose-950/90 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-emerald-950/90 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950 border-slate-700 text-slate-400'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isMyTurn ? `${turnClock}s` : isEn ? 'RIVAL' : 'RIVAL'}</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setSoundEnabled((s) => !s)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          </button>
        </div>
      </div>

      {/* PHASE 1: TACTICAL FLEET DEPLOYMENT */}
      {phase === 'deploy' && (
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-950 border-2 border-cyan-500/40 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-base font-black text-white font-heading">
                🚢 {isEn ? 'Phase 1: Tactical Fleet Deployment' : 'Faza 1: Poziționarea Flotei Cibernetice'}
              </h4>
              <p className="text-xs text-slate-400">
                {isEn
                  ? 'Select a vessel or Cyber Mine, tap the 10×10 grid to deploy (press R or Rotate button). Click a placed ship to remove it.'
                  : 'Selectează o navă sau o Mină Cyber, apasă pe grila 10×10 (tasta R sau butonul Rotește). Apasă pe o navă pusă ca să o muți.'}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                disabled={myReady}
                onClick={() => setDeployHorizontal((h) => !h)}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer touch-manipulation disabled:opacity-40"
              >
                <RotateCw className="w-4 h-4" />
                <span>{deployHorizontal ? (isEn ? 'Horizontal [R]' : 'Orizontal [R]') : isEn ? 'Vertical [R]' : 'Vertical [R]'}</span>
              </button>
              <button
                type="button"
                disabled={myReady}
                onClick={handleAutoPlaceFleet}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer touch-manipulation disabled:opacity-40"
              >
                <Shuffle className="w-4 h-4" />
                <span>{isEn ? 'Auto-Deploy' : 'Aranjare Auto'}</span>
              </button>
              <button
                type="button"
                disabled={myReady}
                onClick={handleClearDeploy}
                className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-rose-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer touch-manipulation disabled:opacity-40"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isEn ? 'Clear' : 'Șterge'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* 10x10 Deployment Grid */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="p-2 sm:p-3 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-inner">
                <div className="grid grid-cols-11 gap-1 text-[10px] font-mono text-slate-500 text-center mb-1">
                  <div />
                  {COL_LABELS.map((lbl) => (
                    <div key={lbl} className="font-bold">
                      {lbl}
                    </div>
                  ))}
                </div>
                {myBoard.map((row, y) => (
                  <div key={y} className="grid grid-cols-11 gap-1 mb-1 items-center">
                    <div className="text-[10px] font-mono font-bold text-slate-500 text-right pr-1">{y + 1}</div>
                    {row.map((cell, x) => {
                      const inPreview = deployPreviewSet.has(`${x}_${y}`);
                      const shipMeta = cell.shipId ? SHIP_BLUEPRINTS.find((s) => s.id === cell.shipId) : null;
                      return (
                        <button
                          key={`${x}_${y}`}
                          type="button"
                          onMouseEnter={() => setHoverDeployCell({ x, y })}
                          onMouseLeave={() => setHoverDeployCell(null)}
                          onClick={() => handleDeployCellClick(x, y)}
                          className={`w-7 h-7 sm:w-9 sm:h-9 rounded-md border flex items-center justify-center text-xs font-bold transition cursor-pointer touch-manipulation ${
                            shipMeta
                              ? `${shipMeta.color} border-white/50 text-white shadow`
                              : cell.hasMine
                              ? 'bg-rose-900/80 border-rose-400 text-amber-300'
                              : inPreview
                              ? deployPreviewValid
                                ? 'bg-emerald-500/40 border-emerald-400'
                                : 'bg-rose-500/40 border-rose-400'
                              : 'bg-slate-950/90 border-slate-800 hover:border-cyan-500/50'
                          }`}
                        >
                          {cell.hasMine ? '💣' : ''}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Ship & Mine Dock + Ready Action */}
            <div className="lg:col-span-5 space-y-2.5">
              {SHIP_BLUEPRINTS.map((bp) => {
                const isPlaced = myShips.some((s) => s.id === bp.id);
                const isSel = selectedDeployId === bp.id;
                return (
                  <button
                    key={bp.id}
                    type="button"
                    disabled={myReady || isPlaced}
                    onClick={() => setSelectedDeployId(bp.id)}
                    className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-2xl border-2 text-left flex items-center justify-between transition cursor-pointer touch-manipulation ${
                      isPlaced
                        ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                        : isSel
                        ? 'bg-cyan-950/80 border-cyan-400 text-white ring-2 ring-cyan-500/40'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-black truncate">{isEn ? bp.nameEn : bp.nameRo}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: bp.length }).map((_, i) => (
                          <span key={i} className={`w-3.5 h-2.5 rounded-sm ${bp.color}`} />
                        ))}
                      </div>
                    </div>
                    <span className="font-mono text-xs font-black shrink-0">
                      {isPlaced ? '✓' : `${bp.length}x`}
                    </span>
                  </button>
                );
              })}

              {/* 2 Cyber Mines Dock */}
              <button
                type="button"
                disabled={myReady || minesPlaced.length >= 2}
                onClick={() => setSelectedDeployId('mine')}
                className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-2xl border-2 text-left flex items-center justify-between transition cursor-pointer touch-manipulation ${
                  minesPlaced.length >= 2
                    ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                    : selectedDeployId === 'mine'
                    ? 'bg-amber-950/80 border-amber-400 text-white'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bomb className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="text-xs font-black">{isEn ? 'EMP Cyber Mines (-25⚡)' : 'Mine Cyber EMP (-25⚡)'}</div>
                    <div className="text-[10px] text-slate-400">
                      {isEn ? 'Optional (auto-placed if skipped)' : 'Opțional (se pun automat la start)'}
                    </div>
                  </div>
                </div>
                <span className="font-mono text-xs font-black">{minesPlaced.length}/2</span>
              </button>

              <button
                type="button"
                disabled={myReady || myShips.length < SHIP_BLUEPRINTS.length}
                onClick={handleLockFleetReady}
                className="w-full min-h-[52px] mt-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-sm shadow-lg transition active:scale-95 disabled:opacity-40 cursor-pointer touch-manipulation flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  {myReady
                    ? isEn
                      ? 'Waiting for Rival Fleet...'
                      : 'Se așteaptă flota rivală...'
                    : isEn
                    ? 'LOCK FLEET & START BATTLE 🚀'
                    : 'BLOCARE FLOTĂ & START LUPTĂ 🚀'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2: ACTIVE NAVAL BATTLE */}
      {phase === 'battle' && (
        <div className="space-y-3">
          {/* TURN & STREAK BANNER */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
            <span className={isMyTurn ? 'text-emerald-400 font-black' : 'text-amber-300'}>
              {awaitingAck
                ? isEn
                  ? '📡 Waiting for impact telemetry...'
                  : '📡 Se așteaptă confirmarea impactului...'
                : isMyTurn
                ? isEn
                  ? '🎯 YOUR TURN: Select weapon and strike Enemy Radar!'
                  : '🎯 RÂNDUL TĂU: Alege arma și lovește Radarul Inamic!'
                : isEn
                ? `⏳ ${opponentName} is aiming...`
                : `⏳ ${opponentName} ochește...`}
            </span>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              {streak >= 2 && (
                <span className="text-amber-300 flex items-center gap-1 font-black">
                  <Flame className="w-3.5 h-3.5" /> STREAK x{streak}
                </span>
              )}
              <span className="text-cyan-300">
                {isEn ? 'Sunk' : 'Scufundate'}: {enemySunkShips.length}/5
              </span>
              <span className="text-rose-300">
                {isEn ? 'Lost' : 'Pierdute'}: {mySunkCount}/5
              </span>
            </div>
          </div>

          {/* MOBILE TAB TOGGLE */}
          <div className="lg:hidden flex p-1 rounded-xl bg-slate-950 border border-slate-800 gap-1">
            <button
              type="button"
              onClick={() => setMobileBoardTab('radar')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-black cursor-pointer ${
                mobileBoardTab === 'radar' ? 'bg-cyan-600 text-white' : 'text-slate-400'
              }`}
            >
              🎯 {isEn ? 'Enemy Radar' : 'Radar Inamic'} ({enemySunkShips.length}/5)
            </button>
            <button
              type="button"
              onClick={() => setMobileBoardTab('fleet')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-black cursor-pointer ${
                mobileBoardTab === 'fleet' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              🚢 {isEn ? 'My Fleet' : 'Flota Mea'} ({5 - mySunkCount}/5)
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start relative">
            {/* ENEMY RADAR GRID (PRIMARY ATTACK BOARD) */}
            <div
              className={`lg:col-span-6 p-3.5 rounded-3xl bg-slate-950 border-2 border-cyan-500/40 shadow-2xl space-y-2.5 ${
                mobileBoardTab === 'fleet' ? 'hidden lg:block' : 'block'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-black text-cyan-300">
                <span className="flex items-center gap-1.5">
                  <Crosshair className="w-4 h-4" />
                  <span>{isEn ? 'ENEMY WATERS RADAR' : 'RADAR APE INAMICE'}</span>
                </span>
                <span className="font-mono text-[11px] text-slate-400 uppercase">{selectedWeapon}</span>
              </div>

              <div className="flex justify-center">
                <div>
                  <div className="grid grid-cols-11 gap-1 text-[10px] font-mono text-slate-500 text-center mb-1">
                    <div />
                    {COL_LABELS.map((lbl) => (
                      <div key={lbl} className="font-bold">
                        {lbl}
                      </div>
                    ))}
                  </div>
                  {radarBoard.map((row, y) => (
                    <div key={y} className="grid grid-cols-11 gap-1 mb-1 items-center">
                      <div className="text-[10px] font-mono font-bold text-slate-500 text-right pr-1">{y + 1}</div>
                      {row.map((cell, x) => {
                        const inTarget = radarPreviewSet.has(`${x}_${y}`);
                        return (
                          <button
                            key={`${x}_${y}`}
                            type="button"
                            disabled={!isMyTurn || awaitingAck || Boolean(matchResult)}
                            onMouseEnter={() => setHoverRadarCell({ x, y })}
                            onMouseLeave={() => setHoverRadarCell(null)}
                            onClick={() => handleFireRadar(x, y)}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md border flex items-center justify-center text-xs font-black transition cursor-pointer touch-manipulation relative ${
                              cell.status === 'sunk'
                                ? 'bg-rose-700 border-rose-300 text-white shadow'
                                : cell.status === 'hit'
                                ? 'bg-orange-600 border-amber-300 text-white animate-pulse'
                                : cell.status === 'mine'
                                ? 'bg-amber-900 border-amber-400 text-amber-200'
                                : cell.status === 'miss'
                                ? 'bg-slate-900 border-slate-800 text-cyan-500/60'
                                : inTarget
                                ? 'bg-cyan-500/40 border-cyan-300'
                                : 'bg-slate-900/90 border-slate-800 hover:border-cyan-400'
                            }`}
                          >
                            {cell.status === 'sunk'
                              ? '☠'
                              : cell.status === 'hit'
                              ? '🔥'
                              : cell.status === 'mine'
                              ? '💣'
                              : cell.status === 'miss'
                              ? '•'
                              : ''}
                            {typeof cell.sonarCount === 'number' && cell.status === 'unknown' && (
                              <span className="text-[10px] font-mono font-black text-cyan-300">
                                {cell.sonarCount}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Enemy Vessel Silhouette Tracker */}
              <div className="grid grid-cols-5 gap-1.5 pt-1 border-t border-slate-800/80">
                {SHIP_BLUEPRINTS.map((bp) => {
                  const isSunk = enemySunkShips.some((s) => s.id === bp.id);
                  return (
                    <div
                      key={bp.id}
                      className={`px-1.5 py-1 rounded-lg border text-center font-mono text-[10px] ${
                        isSunk
                          ? 'bg-rose-950/60 border-rose-500/50 text-rose-300 line-through opacity-75'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="font-black truncate">{bp.length}x</div>
                      <div className="text-[9px] truncate">{isSunk ? '☠' : bp.id.slice(0, 4).toUpperCase()}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT SIDE: MY FLEET + WEAPON DOCK + COMBAT LOG */}
            <div
              className={`lg:col-span-6 space-y-3 ${
                mobileBoardTab === 'radar' ? 'block' : 'block'
              }`}
            >
              {/* CYBER WEAPONS & SUPPORT DOCK */}
              <div className="p-3.5 rounded-3xl bg-slate-950 border border-amber-500/40 space-y-2.5 shadow-xl">
                <div className="flex items-center justify-between text-xs font-black text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4" />
                    <span>{isEn ? 'Weapons & Cyber Warfare' : 'Arme & Război Cibernetic'}</span>
                  </span>
                  <span className="font-mono">{energy} / 100 ⚡</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedWeapon('railgun')}
                    className={`min-h-[46px] p-2 rounded-xl border text-left transition cursor-pointer touch-manipulation ${
                      selectedWeapon === 'railgun'
                        ? 'bg-cyan-900/80 border-cyan-400 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="text-[11px] font-black flex justify-between">
                      <span>🎯 Railgun</span>
                      <span className="font-mono text-emerald-300">0⚡</span>
                    </div>
                    <div className="text-[10px] text-slate-400">1×1 (+15~30⚡)</div>
                  </button>

                  <button
                    type="button"
                    disabled={energy < 30 || sonarUsedThisTurn || !isMyTurn}
                    onClick={() => setSelectedWeapon('sonar')}
                    className={`min-h-[46px] p-2 rounded-xl border text-left transition cursor-pointer touch-manipulation disabled:opacity-40 ${
                      selectedWeapon === 'sonar'
                        ? 'bg-sky-900/80 border-sky-400 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="text-[11px] font-black flex justify-between">
                      <span className="flex items-center gap-1">
                        <Radar className="w-3 h-3" /> Sonar
                      </span>
                      <span className="font-mono text-amber-300">30⚡</span>
                    </div>
                    <div className="text-[10px] text-slate-400">{isEn ? '3×3 scan (free)' : 'Scan 3×3 gratis'}</div>
                  </button>

                  <button
                    type="button"
                    disabled={energy < 50 || !isMyTurn}
                    onClick={() => setSelectedWeapon('cluster')}
                    className={`min-h-[46px] p-2 rounded-xl border text-left transition cursor-pointer touch-manipulation disabled:opacity-40 ${
                      selectedWeapon === 'cluster'
                        ? 'bg-rose-900/80 border-rose-400 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="text-[11px] font-black flex justify-between">
                      <span>💥 Cluster +</span>
                      <span className="font-mono text-amber-300">50⚡</span>
                    </div>
                    <div className="text-[10px] text-slate-400">{isEn ? '5-cell Cross' : 'Cruce 5 celule'}</div>
                  </button>

                  <button
                    type="button"
                    disabled={energy < 60 || !isMyTurn}
                    onClick={() =>
                      setSelectedWeapon((w) => (w === 'torpedo_h' ? 'torpedo_v' : 'torpedo_h'))
                    }
                    className={`min-h-[46px] p-2 rounded-xl border text-left transition cursor-pointer touch-manipulation disabled:opacity-40 ${
                      selectedWeapon === 'torpedo_h' || selectedWeapon === 'torpedo_v'
                        ? 'bg-purple-900/80 border-purple-400 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="text-[11px] font-black flex justify-between">
                      <span>🚀 Torpedo {selectedWeapon === 'torpedo_v' ? '↕' : '↔'}</span>
                      <span className="font-mono text-amber-300">60⚡</span>
                    </div>
                    <div className="text-[10px] text-slate-400">{isEn ? '4-cell sweep [R]' : 'Linie 4 celule [R]'}</div>
                  </button>

                  <button
                    type="button"
                    disabled={energy < 45 || repairUsedThisTurn || !isMyTurn}
                    onClick={handleNanoRepair}
                    className="col-span-2 min-h-[46px] p-2 rounded-xl border border-emerald-500/50 bg-emerald-950/70 hover:bg-emerald-900 text-emerald-200 text-left transition cursor-pointer touch-manipulation disabled:opacity-40"
                  >
                    <div className="text-[11px] font-black flex justify-between">
                      <span className="flex items-center gap-1">
                        <Wrench className="w-3 h-3" /> {isEn ? 'Aegis Nano-Repair + Shield' : 'Nano-Reparație + Scut Radar'}
                      </span>
                      <span className="font-mono text-amber-300">45⚡</span>
                    </div>
                    <div className="text-[10px] text-emerald-300/80">
                      {isEn ? 'Heal 1 hit + shield 1 cell (keeps turn)' : 'Repară 1 lovitură + scut pe 1 celulă'}
                    </div>
                  </button>
                </div>
              </div>

              {/* MY FLEET BOARD */}
              <div
                className={`p-3.5 rounded-3xl bg-slate-950 border border-indigo-500/40 space-y-2 shadow-xl ${
                  mobileBoardTab === 'radar' ? 'hidden lg:block' : 'block'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-black text-indigo-300">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4" />
                    <span>{isEn ? 'MY FLEET WATERS' : 'FLOTA MEA'}</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {SHIP_BLUEPRINTS.length - mySunkCount}/5 {isEn ? 'Intact' : 'Active'}
                  </span>
                </div>

                <div className="flex justify-center">
                  <div>
                    <div className="grid grid-cols-11 gap-1 text-[9px] font-mono text-slate-500 text-center mb-0.5">
                      <div />
                      {COL_LABELS.map((lbl) => (
                        <div key={lbl}>{lbl}</div>
                      ))}
                    </div>
                    {myBoard.map((row, y) => (
                      <div key={y} className="grid grid-cols-11 gap-1 mb-1 items-center">
                        <div className="text-[9px] font-mono text-slate-500 text-right pr-1">{y + 1}</div>
                        {row.map((cell, x) => {
                          const shipMeta = cell.shipId ? SHIP_BLUEPRINTS.find((s) => s.id === cell.shipId) : null;
                          return (
                            <div
                              key={`${x}_${y}`}
                              className={`w-6 h-6 sm:w-7 sm:h-7 rounded border flex items-center justify-center text-[10px] font-bold ${
                                cell.hit && cell.shipId
                                  ? 'bg-rose-700 border-rose-300 text-white'
                                  : cell.shielded
                                  ? 'bg-emerald-700 border-emerald-300 text-white'
                                  : shipMeta
                                  ? `${shipMeta.color} border-white/40 text-white`
                                  : cell.hasMine
                                  ? 'bg-amber-900/70 border-amber-400 text-amber-200'
                                  : cell.miss
                                  ? 'bg-slate-900 border-slate-700 text-cyan-400/50'
                                  : 'bg-slate-900/70 border-slate-800'
                              }`}
                            >
                              {cell.hit && cell.shipId
                                ? '🔥'
                                : cell.shielded
                                ? '🛡'
                                : cell.hasMine
                                ? '💣'
                                : cell.miss
                                ? '•'
                                : ''}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* COMBAT TELEMETRY LOG */}
              {combatLog.length > 0 && (
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-[11px]">
                  {combatLog.slice(0, 3).map((entry, idx) => (
                    <div key={idx} className={idx === 0 ? 'text-cyan-300 font-bold' : 'text-slate-400'}>
                      {entry}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* VICTORY / DEFEAT OVERLAY */}
            {matchResult && (
              <div className="lg:col-span-12 absolute inset-0 z-40 rounded-3xl bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl ${
                    matchResult.won
                      ? 'bg-gradient-to-br from-amber-400 to-emerald-600 text-white'
                      : 'bg-rose-900 text-rose-200'
                  }`}
                >
                  <Trophy className="w-9 h-9" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white font-heading">
                    {matchResult.won
                      ? isEn
                        ? 'ADMIRAL VICTORY! ⚓'
                        : 'VICTORIE NAVALĂ! ⚓'
                      : isEn
                      ? 'FLEET SUNK!'
                      : 'FLOTĂ SCUFUNDATĂ!'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">{isEn ? matchResult.reasonEn : matchResult.reasonRo}</p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs font-black">
                  <span className="text-cyan-300">
                    {isEn ? 'Enemy Sunk' : 'Inamic Scufundat'}: {matchResult.enemySunk}/5
                  </span>
                  <span className="text-slate-700">|</span>
                  <span className="text-rose-300">
                    {isEn ? 'Your Sunk' : 'Pierdute'}: {matchResult.mySunk}/5
                  </span>
                  <span className="text-slate-700">|</span>
                  <span className="text-emerald-400">+{matchResult.finalScore} XP</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  {!isLivePvP && (
                    <button
                      type="button"
                      onClick={handleRestartSolo}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-black text-xs flex items-center gap-2 cursor-pointer"
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
      )}
    </div>
  );
};
