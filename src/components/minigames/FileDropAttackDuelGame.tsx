import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Trophy,
  Clock,
  Flame,
  Zap,
  ShieldCheck,
  Layers,
  ArrowDown,
  ArrowRight,
  ChevronsDown,
  Shuffle,
  Cpu,
  Trash2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  DuelRoomData,
  FileDropSyncEvent,
  sendFileDropEvent,
  updateDuelProgress,
} from '../../lib/duelService';
import { recordStudentDuelResult } from '../../lib/studentAuthService';
import { forceScrollToTop } from '../../utils/scrollHelper';

interface FileDropAttackDuelGameProps {
  roomData?: DuelRoomData | null;
  isHost?: boolean;
  studentName?: string;
  studentAvatar?: string;
  onFinish?: (score: number, won: boolean) => void;
  onBack?: () => void;
}

type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
type CellValue = PieceType | 'G' | null; // 'G' = corrupted garbage row

interface ActivePiece {
  type: PieceType;
  x: number;
  y: number; // Can start at -1 or 0
  rot: number; // 0, 1, 2, 3
  lockResets: number;
  lastActionRotate: boolean;
}

interface FloatingCallout {
  id: number;
  text: string;
  color: string;
  yOffset: number;
  alpha: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  size: number;
}

const COLS = 10;
const ROWS = 20;
const BUFFER_ROWS = 2;
const TOTAL_ROWS = ROWS + BUFFER_ROWS;
const CELL_PX = 24;
const MATCH_DURATION_SEC = 120;

const PIECE_META: Record<
  PieceType,
  { color: string; glow: string; ext: string }
> = {
  I: { color: '#06b6d4', glow: '#67e8f9', ext: '.mp4' },
  O: { color: '#eab308', glow: '#fde047', ext: '.zip' },
  T: { color: '#a855f7', glow: '#d8b4fe', ext: '.py' },
  S: { color: '#10b981', glow: '#6ee7b7', ext: '.png' },
  Z: { color: '#f43f5e', glow: '#fda4af', ext: '.exe' },
  J: { color: '#3b82f6', glow: '#93c5fd', ext: '.docx' },
  L: { color: '#f97316', glow: '#fdba74', ext: '.html' },
};

// Base shapes per rotation (0=spawn, 1=R, 2=2, 3=L) in local bounding box
const SHAPES: Record<PieceType, number[][][]> = {
  I: [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
  ],
  O: [
    [
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
  ],
  T: [
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
  S: [
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
  Z: [
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0],
    ],
  ],
  J: [
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
  ],
  L: [
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0],
    ],
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
  ],
};

// SRS Wall Kick tables (y inverted cleanly in board coords: positive dy goes down, so SRS +y = dy=-1)
const JLSTZ_KICKS: Record<string, Array<[number, number]>> = {
  '0->1': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  '1->0': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
  '1->2': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
  '2->1': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  '2->3': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
  '3->2': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
  '3->0': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
  '0->3': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
};

const I_KICKS: Record<string, Array<[number, number]>> = {
  '0->1': [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
  '1->0': [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
  '1->2': [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]],
  '2->1': [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
  '2->3': [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
  '3->2': [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
  '3->0': [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
  '0->3': [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]],
};

function createEmptyBoard(): CellValue[][] {
  return Array.from({ length: TOTAL_ROWS }, () => Array<CellValue>(COLS).fill(null));
}

function create7Bag(): PieceType[] {
  const bag: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = bag[i];
    bag[i] = bag[j];
    bag[j] = tmp;
  }
  return bag;
}

function collides(board: CellValue[][], type: PieceType, px: number, py: number, rot: number): boolean {
  const mat = SHAPES[type][rot];
  for (let r = 0; r < mat.length; r++) {
    for (let c = 0; c < mat[r].length; c++) {
      if (!mat[r][c]) continue;
      const bx = px + c;
      const by = py + r;
      if (bx < 0 || bx >= COLS || by >= TOTAL_ROWS) return true;
      if (by >= 0 && board[by][bx] !== null) return true;
    }
  }
  return false;
}

function computeStackHeights(board: CellValue[][]): number[] {
  const heights: number[] = [];
  for (let c = 0; c < COLS; c++) {
    let h = 0;
    for (let r = 0; r < TOTAL_ROWS; r++) {
      if (board[r][c] !== null) {
        h = TOTAL_ROWS - r;
        break;
      }
    }
    heights.push(Math.min(ROWS, h));
  }
  return heights;
}

function injectGarbageLines(board: CellValue[][], count: number): { nextBoard: CellValue[][]; toppedOut: boolean } {
  if (count <= 0) return { nextBoard: board, toppedOut: false };
  let toppedOut = false;
  for (let r = 0; r < Math.min(count, TOTAL_ROWS); r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] !== null && r < BUFFER_ROWS + count - 1) {
        toppedOut = true;
      }
    }
  }
  const hole = Math.floor(Math.random() * COLS);
  const sliced = board.slice(count);
  const garbageRows: CellValue[][] = [];
  for (let i = 0; i < count; i++) {
    // 25% chance to shift gap 1 step for spicy messy garbage
    const rowHole = Math.random() < 0.25 ? (hole + 1) % COLS : hole;
    const row: CellValue[] = Array.from({ length: COLS }, (_, c) => (c === rowHole ? null : 'G'));
    garbageRows.push(row);
  }
  return {
    nextBoard: [...sliced, ...garbageRows],
    toppedOut,
  };
}

// Dellacherie-inspired quick AI board evaluator for Cyber-Bot
function findBestBotPlacement(board: CellValue[][], type: PieceType): { x: number; y: number; rot: number } | null {
  let bestScore = -Infinity;
  let bestMove: { x: number; y: number; rot: number } | null = null;
  const maxRot = type === 'O' ? 1 : type === 'I' || type === 'S' || type === 'Z' ? 2 : 4;

  for (let rot = 0; rot < maxRot; rot++) {
    for (let x = -2; x < COLS; x++) {
      if (collides(board, type, x, 0, rot)) continue;
      let y = 0;
      while (!collides(board, type, x, y + 1, rot)) {
        y++;
      }

      // Simulate placement
      const sim = board.map((row) => [...row]);
      const mat = SHAPES[type][rot];
      let overflow = false;
      for (let r = 0; r < mat.length; r++) {
        for (let c = 0; c < mat[r].length; c++) {
          if (!mat[r][c]) continue;
          const by = y + r;
          const bx = x + c;
          if (by < BUFFER_ROWS) overflow = true;
          if (by >= 0 && by < TOTAL_ROWS && bx >= 0 && bx < COLS) {
            sim[by][bx] = type;
          }
        }
      }

      let cleared = 0;
      for (let r = 0; r < TOTAL_ROWS; r++) {
        if (sim[r].every((cell) => cell !== null)) {
          cleared++;
        }
      }

      // Evaluate column heights, holes & bumpiness
      const colH = new Array<number>(COLS).fill(0);
      let holes = 0;
      for (let c = 0; c < COLS; c++) {
        let seenBlock = false;
        for (let r = 0; r < TOTAL_ROWS; r++) {
          if (sim[r][c] !== null) {
            if (!seenBlock) {
              colH[c] = TOTAL_ROWS - r;
              seenBlock = true;
            }
          } else if (seenBlock) {
            holes++;
          }
        }
      }

      let bumpiness = 0;
      let aggHeight = 0;
      let maxH = 0;
      for (let c = 0; c < COLS; c++) {
        aggHeight += colH[c];
        if (colH[c] > maxH) maxH = colH[c];
        if (c > 0) bumpiness += Math.abs(colH[c] - colH[c - 1]);
      }

      const evalScore =
        (overflow ? -500 : 0) +
        (cleared === 4 ? 60 : cleared * 14) -
        holes * 8.5 -
        aggHeight * 0.55 -
        bumpiness * 1.9 -
        maxH * 1.1;

      if (evalScore > bestScore) {
        bestScore = evalScore;
        bestMove = { x, y, rot };
      }
    }
  }
  return bestMove;
}

// Mini canvas preview drawer for Hold & Next pieces
const PiecePreviewBox: React.FC<{ type: PieceType | null; compact?: boolean }> = ({ type, compact = false }) => {
  if (!type) {
    return (
      <div className={`${compact ? 'w-12 h-10' : 'w-16 h-12'} flex items-center justify-center text-[10px] font-mono text-slate-600`}>
        —
      </div>
    );
  }
  const mat = SHAPES[type][0];
  const meta = PIECE_META[type];
  // Trim empty rows
  const nonEmptyRows = mat.filter((r) => r.some(Boolean));
  const minCol = Math.min(
    ...nonEmptyRows.flatMap((r) => r.map((v, idx) => (v ? idx : 99)).filter((idx) => idx < 99))
  );
  const maxCol = Math.max(
    ...nonEmptyRows.flatMap((r) => r.map((v, idx) => (v ? idx : -1)).filter((idx) => idx >= 0))
  );
  const cellSize = compact ? 10 : 12;

  return (
    <div className="flex flex-col items-center justify-center gap-0.5">
      <div className="flex flex-col gap-[1px]">
        {nonEmptyRows.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-[1px]">
            {row.slice(minCol, maxCol + 1).map((cell, cIdx) => (
              <div
                key={cIdx}
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: cell ? meta.color : 'transparent',
                  boxShadow: cell ? `inset 0 0 4px ${meta.glow}` : undefined,
                  borderRadius: 2,
                }}
              />
            ))}
          </div>
        ))}
      </div>
      {!compact && (
        <span className="text-[9px] font-mono font-bold text-slate-400 leading-none mt-0.5">{meta.ext}</span>
      )}
    </div>
  );
};

export const FileDropAttackDuelGame: React.FC<FileDropAttackDuelGameProps> = ({
  roomData,
  isHost = true,
  studentName = 'Architect',
  studentAvatar = '🧱',
  onFinish,
  onBack,
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const isLivePvP = Boolean(roomData && roomData.guest && roomData.guest.id !== 'practice_bot');
  const opponentName = isLivePvP
    ? (isHost ? roomData?.guest?.name : roomData?.host?.name) || (isEn ? 'Rival Architect' : 'Arhitect Rival')
    : 'Cyber-Bot AI';
  const opponentAvatar = isLivePvP
    ? (isHost ? roomData?.guest?.avatar : roomData?.host?.avatar) || '🚀'
    : '🤖';

  // React UI state for HUD & End Screen
  const [score, setScore] = useState(0);
  const [linesCleared, setLinesCleared] = useState(0);
  const [garbageSent, setGarbageSent] = useState(0);
  const [pendingGarbage, setPendingGarbage] = useState(0);
  const [combo, setCombo] = useState(-1);
  const [b2bActive, setB2bActive] = useState(false);
  const [cyberCharge, setCyberCharge] = useState(35); // Start with enough for a tactical play or build
  const [level, setLevel] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(MATCH_DURATION_SEC);
  const [holdPiece, setHoldPiece] = useState<PieceType | null>(null);
  const [holdLocked, setHoldLocked] = useState(false);
  const [nextQueue, setNextQueue] = useState<PieceType[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  // Incoming debuffs
  const [overclockEndAt, setOverclockEndAt] = useState(0);
  const [scrambleEndAt, setScrambleEndAt] = useState(0);

  // Rival state preview
  const [oppScore, setOppScore] = useState(0);
  const [oppLines, setOppLines] = useState(0);
  const [oppHeights, setOppHeights] = useState<number[]>(() => new Array(COLS).fill(0));
  const [oppOverclocked, setOppOverclocked] = useState(false);
  const [oppScrambled, setOppScrambled] = useState(false);
  const oppScoreRef = useRef(0);
  const oppLinesRef = useRef(0);

  const [matchResult, setMatchResult] = useState<{
    won: boolean;
    finalScore: number;
    myLines: number;
    oppLines: number;
    garbageSent: number;
    reasonRo: string;
    reasonEn: string;
  } | null>(null);

  // Mutable engine refs for smooth 60fps loop
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const boardRef = useRef<CellValue[][]>(createEmptyBoard());
  const bagRef = useRef<PieceType[]>(create7Bag());
  const queueRef = useRef<PieceType[]>([]);
  const activePieceRef = useRef<ActivePiece | null>(null);
  const holdRef = useRef<PieceType | null>(null);
  const holdLockedRef = useRef<boolean>(false);

  const scoreRef = useRef(0);
  const linesRef = useRef(0);
  const garbageSentRef = useRef(0);
  const pendingGarbageRef = useRef(0);
  const comboRef = useRef(-1);
  const b2bRef = useRef(false);
  const chargeRef = useRef(35);
  const levelRef = useRef(1);
  const finishedRef = useRef(false);

  const lastDropTimeRef = useRef(performance.now());
  const lockStartTimeRef = useRef<number | null>(null);
  const shakeRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const calloutsRef = useRef<FloatingCallout[]>([]);
  const overclockEndRef = useRef(0);
  const scrambleEndRef = useRef(0);

  // AI Bot refs
  const botBoardRef = useRef<CellValue[][]>(createEmptyBoard());
  const botBagRef = useRef<PieceType[]>(create7Bag());
  const botPendingGarbageRef = useRef(0);
  const botScoreRef = useRef(0);
  const botLinesRef = useRef(0);
  const botComboRef = useRef(-1);
  const botOverclockEndRef = useRef(0);
  const botScrambleEndRef = useRef(0);

  // Sync & Audio refs
  const soundEnabledRef = useRef(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const myEventsRef = useRef<FileDropSyncEvent[]>([]);
  const processedRemoteIdsRef = useRef<Set<string>>(new Set());
  const lastSnapshotSentRef = useRef<number>(0);
  const lastMilestoneRef = useRef<number>(0);

  useEffect(() => {
    forceScrollToTop();
  }, []);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const playTone = useCallback(
    (freq: number, duration = 0.08, type: OscillatorType = 'triangle', gainVal = 0.07, endFreq?: number) => {
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

  const addCallout = useCallback((text: string, color: string) => {
    calloutsRef.current.push({
      id: Date.now() + Math.random(),
      text,
      color,
      yOffset: 0,
      alpha: 1,
    });
  }, []);

  const spawnRowParticles = useCallback((rowIdx: number, color = '#38bdf8') => {
    const visibleRow = rowIdx - BUFFER_ROWS;
    if (visibleRow < 0) return;
    for (let i = 0; i < 18; i++) {
      particlesRef.current.push({
        x: Math.random() * (COLS * CELL_PX),
        y: visibleRow * CELL_PX + CELL_PX / 2,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.8) * 5,
        color,
        life: 1,
        size: 3 + Math.random() * 3,
      });
    }
  }, []);

  const pullNextFromBag = useCallback((): PieceType => {
    if (bagRef.current.length === 0) {
      bagRef.current = create7Bag();
    }
    return bagRef.current.pop() as PieceType;
  }, []);

  const refillQueue = useCallback(() => {
    while (queueRef.current.length < 4) {
      queueRef.current.push(pullNextFromBag());
    }
    setNextQueue(queueRef.current.slice(0, 3));
  }, [pullNextFromBag]);

  const concludeMatch = useCallback(
    (won: boolean, reasonRo: string, reasonEn: string) => {
      if (finishedRef.current) return;
      finishedRef.current = true;

      const finalScore = Math.max(80, Math.min(1000, scoreRef.current + (won ? 280 : 0)));
      setMatchResult({
        won,
        finalScore,
        myLines: linesRef.current,
        oppLines: oppLinesRef.current,
        garbageSent: garbageSentRef.current,
        reasonRo,
        reasonEn,
      });

      if (won) {
        playTone(523, 0.14, 'triangle', 0.1, 784);
        setTimeout(() => playTone(784, 0.28, 'triangle', 0.1, 1046), 130);
      } else {
        playTone(260, 0.28, 'sawtooth', 0.09, 110);
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
            { progress: Math.min(99, linesRef.current * 4), score: scoreRef.current, finishedAt: Date.now() },
            oppId,
            opponentName
          );
        }
      }

      recordStudentDuelResult(won, 'file_drop_attack', finalScore);
      onFinish?.(finalScore, won);
    },
    [isHost, onFinish, opponentName, playTone, roomData, studentName]
  );

  const emitPvPEvent = useCallback(
    (evt: Omit<FileDropSyncEvent, 'id' | 'createdAt'>) => {
      if (!isLivePvP || !roomData?.roomCode) return;
      const fullEvt: FileDropSyncEvent = {
        ...evt,
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        createdAt: Date.now(),
      };
      myEventsRef.current = [...myEventsRef.current.slice(-20), fullEvt];
      sendFileDropEvent(roomData.roomCode, isHost, myEventsRef.current);
    },
    [isHost, isLivePvP, roomData?.roomCode]
  );

  const spawnPiece = useCallback(
    (explicitType?: PieceType): boolean => {
      if (finishedRef.current) return false;
      let nextType = explicitType;
      if (!nextType) {
        refillQueue();
        nextType = queueRef.current.shift() as PieceType;
        refillQueue();
      }
      const startX = nextType === 'O' ? 3 : nextType === 'I' ? 3 : 3;
      const startY = BUFFER_ROWS - 1;
      if (collides(boardRef.current, nextType, startX, startY, 0)) {
        // Try 1 row higher in buffer
        if (collides(boardRef.current, nextType, startX, startY - 1, 0)) {
          // TOP OUT!
          activePieceRef.current = null;
          if (isLivePvP) {
            emitPvPEvent({ kind: 'topout', score: scoreRef.current, linesCleared: linesRef.current });
          }
          concludeMatch(
            false,
            'Stiva ta de fișiere a depășit capacitatea serverului!',
            'Your file stack overflowed the server limit!'
          );
          return false;
        }
        activePieceRef.current = {
          type: nextType,
          x: startX,
          y: startY - 1,
          rot: 0,
          lockResets: 0,
          lastActionRotate: false,
        };
      } else {
        activePieceRef.current = {
          type: nextType,
          x: startX,
          y: startY,
          rot: 0,
          lockResets: 0,
          lastActionRotate: false,
        };
      }
      lockStartTimeRef.current = null;
      lastDropTimeRef.current = performance.now();
      return true;
    },
    [concludeMatch, emitPvPEvent, isLivePvP, refillQueue]
  );

  // Initialize first match pieces
  useEffect(() => {
    boardRef.current = createEmptyBoard();
    bagRef.current = create7Bag();
    queueRef.current = [];
    holdRef.current = null;
    holdLockedRef.current = false;
    setHoldPiece(null);
    setHoldLocked(false);
    spawnPiece();
  }, [spawnPiece]);

  // Countdown match timer (120s)
  useEffect(() => {
    const timer = setInterval(() => {
      if (finishedRef.current) return;
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          const won =
            scoreRef.current > oppScoreRef.current ||
            (scoreRef.current === oppScoreRef.current && linesRef.current >= oppLinesRef.current);
          concludeMatch(
            won,
            won
              ? 'Timp expirat! Scorul tău de atac cibernetic a dominat arena!'
              : 'Timp expirat! Adversarul a acumulat un scor mai mare.',
            won
              ? 'Time up! Your cyber-attack score dominated the duel!'
              : 'Time up! Your opponent finished with a higher score.'
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [concludeMatch]);

  // Listen to Remote PvP events
  useEffect(() => {
    if (!isLivePvP || !roomData) return;
    const remoteList: FileDropSyncEvent[] =
      (isHost ? roomData.guestFileDropEvents : roomData.hostFileDropEvents) || [];

    for (const evt of remoteList) {
      if (processedRemoteIdsRef.current.has(evt.id)) continue;
      processedRemoteIdsRef.current.add(evt.id);

      if (evt.stackHeights) {
        setOppHeights(evt.stackHeights);
      }
      if (typeof evt.score === 'number') {
        oppScoreRef.current = evt.score;
        setOppScore(evt.score);
      }
      if (typeof evt.linesCleared === 'number') {
        oppLinesRef.current = evt.linesCleared;
        setOppLines(evt.linesCleared);
      }

      if (evt.kind === 'garbage' && evt.amount && evt.amount > 0) {
        pendingGarbageRef.current = Math.min(16, pendingGarbageRef.current + evt.amount);
        setPendingGarbage(pendingGarbageRef.current);
        shakeRef.current = 5;
        playTone(190, 0.14, 'sawtooth', 0.08, 130);
        setStatusBanner(
          isEn
            ? `⚠️ Incoming +${evt.amount} corrupted garbage lines! Clear lines to counter!`
            : `⚠️ Atac primit: +${evt.amount} linii corupte! Șterge linii pentru contraatac!`
        );
      } else if (evt.kind === 'overclock') {
        const endAt = Date.now() + 6000;
        overclockEndRef.current = endAt;
        setOverclockEndAt(endAt);
        playTone(620, 0.18, 'square', 0.07, 940);
        setStatusBanner(
          isEn ? '⚡ RIVAL OVERCLOCK! Gravity x2.2 for 6s!' : '⚡ OVERCLOCK DE LA RIVAL! Gravitație x2.2 timp de 6s!'
        );
      } else if (evt.kind === 'scramble') {
        const endAt = Date.now() + 4500;
        scrambleEndRef.current = endAt;
        setScrambleEndAt(endAt);
        playTone(300, 0.22, 'sawtooth', 0.07, 170);
        setStatusBanner(
          isEn ? '🔀 CONTROL SCRAMBLE! Left/Right inverted for 4.5s!' : '🔀 CONTROALE INVERSATE! Stânga/Dreapta inversate 4.5s!'
        );
      } else if (evt.kind === 'topout' && !finishedRef.current) {
        concludeMatch(
          true,
          'KNOCKOUT! Adversarul a depășit limita stivei și a făcut Top-Out!',
          'KNOCKOUT! Rival matrix overflowed — you forced a Top-Out!'
        );
      }
    }
  }, [concludeMatch, isEn, isHost, isLivePvP, playTone, roomData]);

  // Helper to send garbage lines to opponent (PvP or AI Bot)
  const dispatchAttackToOpponent = useCallback(
    (attackLines: number, customKind: 'garbage' | 'overclock' | 'scramble' = 'garbage') => {
      if (finishedRef.current) return;
      if (customKind === 'garbage' && attackLines > 0) {
        garbageSentRef.current += attackLines;
        setGarbageSent(garbageSentRef.current);
      }

      if (isLivePvP) {
        emitPvPEvent({
          kind: customKind,
          amount: attackLines,
          stackHeights: computeStackHeights(boardRef.current),
          linesCleared: linesRef.current,
          score: scoreRef.current,
        });
      } else {
        // Apply directly to Cyber-Bot engine!
        if (customKind === 'garbage' && attackLines > 0) {
          botPendingGarbageRef.current = Math.min(18, botPendingGarbageRef.current + attackLines);
        } else if (customKind === 'overclock') {
          botOverclockEndRef.current = Date.now() + 6000;
          setOppOverclocked(true);
          setTimeout(() => setOppOverclocked(false), 6000);
        } else if (customKind === 'scramble') {
          botScrambleEndRef.current = Date.now() + 4500;
          setOppScrambled(true);
          setTimeout(() => setOppScrambled(false), 4500);
        }
      }
    },
    [emitPvPEvent, isLivePvP]
  );

  // Lock active piece, detect T-Spins, Clear Lines, Compute Attacks, Handle Pending Garbage
  const lockActivePiece = useCallback(
    (hardDropDistance = 0) => {
      const piece = activePieceRef.current;
      if (!piece || finishedRef.current) return;

      const board = boardRef.current;
      const mat = SHAPES[piece.type][piece.rot];
      let placedAboveVisible = true;

      // Detect T-Spin BEFORE writing piece to board
      let isTSpin = false;
      if (piece.type === 'T' && piece.lastActionRotate) {
        const cx = piece.x + 1;
        const cy = piece.y + 1;
        const corners: Array<[number, number]> = [
          [cx - 1, cy - 1],
          [cx + 1, cy - 1],
          [cx - 1, cy + 1],
          [cx + 1, cy + 1],
        ];
        let occupiedCorners = 0;
        for (const [kx, ky] of corners) {
          if (kx < 0 || kx >= COLS || ky >= TOTAL_ROWS || (ky >= 0 && board[ky][kx] !== null)) {
            occupiedCorners++;
          }
        }
        if (occupiedCorners >= 3) {
          isTSpin = true;
        }
      }

      for (let r = 0; r < mat.length; r++) {
        for (let c = 0; c < mat[r].length; c++) {
          if (!mat[r][c]) continue;
          const bx = piece.x + c;
          const by = piece.y + r;
          if (by >= BUFFER_ROWS) placedAboveVisible = false;
          if (by >= 0 && by < TOTAL_ROWS && bx >= 0 && bx < COLS) {
            board[by][bx] = piece.type;
          }
        }
      }

      if (placedAboveVisible) {
        activePieceRef.current = null;
        if (isLivePvP) {
          emitPvPEvent({ kind: 'topout', score: scoreRef.current, linesCleared: linesRef.current });
        }
        concludeMatch(
          false,
          'Stiva de blocuri a blocat intrarea pieselor (Top-Out)!',
          'Spawn zone blocked — Top-Out!'
        );
        return;
      }

      // Check full rows
      const fullRows: number[] = [];
      for (let r = 0; r < TOTAL_ROWS; r++) {
        if (board[r].every((cell) => cell !== null)) {
          fullRows.push(r);
        }
      }

      let gainedScore = hardDropDistance * 2;
      const cleared = fullRows.length;

      if (cleared > 0) {
        for (const rIdx of fullRows) {
          spawnRowParticles(rIdx, PIECE_META[piece.type].glow);
        }
        const remainingRows = board.filter((_, idx) => !fullRows.includes(idx));
        while (remainingRows.length < TOTAL_ROWS) {
          remainingRows.unshift(Array<CellValue>(COLS).fill(null));
        }
        boardRef.current = remainingRows;

        linesRef.current += cleared;
        setLinesCleared(linesRef.current);

        const nextLvl = Math.min(12, 1 + Math.floor(linesRef.current / 8));
        levelRef.current = nextLvl;
        setLevel(nextLvl);

        // Combo progression
        comboRef.current += 1;
        setCombo(comboRef.current);

        // Difficult clear check (Tetris = 4 lines OR T-Spin)
        const isDifficult = cleared === 4 || isTSpin;
        const wasB2B = b2bRef.current;
        if (isDifficult) {
          b2bRef.current = true;
          setB2bActive(true);
        } else {
          b2bRef.current = false;
          setB2bActive(false);
        }

        // All-clear (Perfect Clear) check
        const isPerfectClear = boardRef.current.every((row) => row.every((c) => c === null));

        // Base attack lines
        let attack = 0;
        if (isTSpin) {
          attack = cleared === 1 ? 2 : cleared === 2 ? 4 : 6;
        } else {
          attack = cleared === 1 ? 0 : cleared === 2 ? 1 : cleared === 3 ? 2 : 4;
        }
        if (wasB2B && isDifficult) attack += 1;
        if (comboRef.current >= 2) {
          attack += comboRef.current >= 6 ? 3 : comboRef.current >= 4 ? 2 : 1;
        }
        if (isPerfectClear) attack += 6;

        // Points calculation
        const basePts = isTSpin
          ? cleared * 120
          : cleared === 4
          ? 240
          : cleared === 3
          ? 140
          : cleared === 2
          ? 85
          : 40;
        gainedScore += basePts + (wasB2B && isDifficult ? 80 : 0) + Math.max(0, comboRef.current) * 25 + (isPerfectClear ? 250 : 0);

        // Cyber Charge (+15% per line, extra +15% for Tetris/T-Spin)
        const chargeGain = cleared * 15 + (isDifficult ? 15 : 0);
        chargeRef.current = Math.min(100, chargeRef.current + chargeGain);
        setCyberCharge(chargeRef.current);

        // Callouts & Audio
        if (isPerfectClear) {
          addCallout(isEn ? 'PERFECT CLEAR +6!' : 'CURĂȚARE PERFECTĂ +6!', '#fde047');
          shakeRef.current = 8;
          playTone(880, 0.25, 'triangle', 0.1, 1320);
        } else if (isTSpin) {
          addCallout(`T-SPIN x${cleared}! (+${attack})`, '#d8b4fe');
          shakeRef.current = 6;
          playTone(660, 0.18, 'triangle', 0.09, 990);
        } else if (cleared === 4) {
          addCallout(wasB2B ? `B2B TETRIS! (+${attack})` : `TETRIS! (+${attack})`, '#22d3ee');
          shakeRef.current = 6;
          playTone(587, 0.18, 'triangle', 0.09, 880);
        } else if (comboRef.current >= 2) {
          addCallout(`COMBO x${comboRef.current}!`, '#fbbf24');
          playTone(440 + Math.min(6, comboRef.current) * 60, 0.12, 'triangle', 0.08);
        } else {
          playTone(440, 0.09, 'triangle', 0.07);
        }

        // Cancel pending garbage FIRST before sending net attack!
        if (pendingGarbageRef.current > 0 && attack > 0) {
          const canceled = Math.min(pendingGarbageRef.current, attack);
          pendingGarbageRef.current -= canceled;
          setPendingGarbage(pendingGarbageRef.current);
          attack -= canceled;
          if (canceled > 0) {
            addCallout(isEn ? `SHIELDED -${canceled}` : `BLOCAT -${canceled}`, '#34d399');
          }
        }

        if (attack > 0) {
          dispatchAttackToOpponent(attack, 'garbage');
        }
      } else {
        // No lines cleared: reset combo & inject queued incoming garbage (up to 6 rows per lock)
        comboRef.current = -1;
        setCombo(-1);
        playTone(170, 0.05, 'sine', 0.05);

        if (pendingGarbageRef.current > 0) {
          const batch = Math.min(6, pendingGarbageRef.current);
          pendingGarbageRef.current -= batch;
          setPendingGarbage(pendingGarbageRef.current);
          const { nextBoard, toppedOut } = injectGarbageLines(boardRef.current, batch);
          boardRef.current = nextBoard;
          shakeRef.current = 5;
          playTone(120, 0.15, 'sawtooth', 0.07, 80);
          if (toppedOut) {
            activePieceRef.current = null;
            if (isLivePvP) {
              emitPvPEvent({ kind: 'topout', score: scoreRef.current, linesCleared: linesRef.current });
            }
            concludeMatch(
              false,
              'Valul de linii corupte te-a împins peste limită!',
              'Garbage wave pushed your stack past the ceiling!'
            );
            return;
          }
        }
      }

      scoreRef.current += gainedScore;
      setScore(scoreRef.current);

      // Periodic PvP snapshot & Firestore progress milestones
      const now = Date.now();
      if (isLivePvP && now - lastSnapshotSentRef.current > 1800) {
        lastSnapshotSentRef.current = now;
        emitPvPEvent({
          kind: 'snapshot',
          stackHeights: computeStackHeights(boardRef.current),
          linesCleared: linesRef.current,
          score: scoreRef.current,
        });
      }
      if (roomData?.roomCode) {
        const pct = Math.min(96, Math.round((linesRef.current / 32) * 100));
        if (Math.floor(pct / 25) > Math.floor(lastMilestoneRef.current / 25)) {
          lastMilestoneRef.current = pct;
          updateDuelProgress(roomData.roomCode, isHost, {
            progress: pct,
            score: scoreRef.current,
          });
        }
      }

      holdLockedRef.current = false;
      setHoldLocked(false);
      spawnPiece();
    },
    [
      addCallout,
      concludeMatch,
      dispatchAttackToOpponent,
      emitPvPEvent,
      isEn,
      isHost,
      isLivePvP,
      playTone,
      roomData?.roomCode,
      spawnPiece,
      spawnRowParticles,
    ]
  );

  // Movement & Rotation actions
  const moveHorizontal = useCallback(
    (rawDx: number) => {
      const piece = activePieceRef.current;
      if (!piece || finishedRef.current) return false;
      const isScrambled = Date.now() < scrambleEndRef.current;
      const dx = isScrambled ? -rawDx : rawDx;

      if (!collides(boardRef.current, piece.type, piece.x + dx, piece.y, piece.rot)) {
        piece.x += dx;
        piece.lastActionRotate = false;
        if (lockStartTimeRef.current !== null && piece.lockResets < 12) {
          lockStartTimeRef.current = performance.now();
          piece.lockResets += 1;
        }
        playTone(300, 0.03, 'sine', 0.04);
        return true;
      }
      return false;
    },
    [playTone]
  );

  const rotatePiece = useCallback(
    (dir: 1 | -1) => {
      const piece = activePieceRef.current;
      if (!piece || finishedRef.current || piece.type === 'O') return false;
      const prevRot = piece.rot;
      const nextRot = (prevRot + dir + 4) % 4;
      const key = `${prevRot}->${nextRot}`;
      const kickTable = piece.type === 'I' ? I_KICKS[key] : JLSTZ_KICKS[key];
      const kicks = kickTable || [[0, 0]];

      for (const [kx, ky] of kicks) {
        if (!collides(boardRef.current, piece.type, piece.x + kx, piece.y + ky, nextRot)) {
          piece.x += kx;
          piece.y += ky;
          piece.rot = nextRot;
          piece.lastActionRotate = true;
          if (lockStartTimeRef.current !== null && piece.lockResets < 12) {
            lockStartTimeRef.current = performance.now();
            piece.lockResets += 1;
          }
          playTone(520, 0.04, 'triangle', 0.05);
          return true;
        }
      }
      return false;
    },
    [playTone]
  );

  const softDrop = useCallback(() => {
    const piece = activePieceRef.current;
    if (!piece || finishedRef.current) return false;
    if (!collides(boardRef.current, piece.type, piece.x, piece.y + 1, piece.rot)) {
      piece.y += 1;
      piece.lastActionRotate = false;
      lastDropTimeRef.current = performance.now();
      scoreRef.current += 1;
      setScore(scoreRef.current);
      return true;
    }
    return false;
  }, []);

  const hardDrop = useCallback(() => {
    const piece = activePieceRef.current;
    if (!piece || finishedRef.current) return;
    let dist = 0;
    while (!collides(boardRef.current, piece.type, piece.x, piece.y + 1, piece.rot)) {
      piece.y += 1;
      dist++;
    }
    if (dist > 0) piece.lastActionRotate = false;
    playTone(230, 0.06, 'triangle', 0.07, 110);
    lockActivePiece(dist);
  }, [lockActivePiece, playTone]);

  const performHold = useCallback(() => {
    const piece = activePieceRef.current;
    if (!piece || holdLockedRef.current || finishedRef.current) return;
    const prevHold = holdRef.current;
    holdRef.current = piece.type;
    holdLockedRef.current = true;
    setHoldPiece(piece.type);
    setHoldLocked(true);
    playTone(460, 0.06, 'sine', 0.06, 660);

    if (prevHold) {
      spawnPiece(prevHold);
    } else {
      spawnPiece();
    }
  }, [playTone, spawnPiece]);

  // 4 Cyber Attack / Defense Abilities
  const activateCyberAbility = useCallback(
    (ability: 'ddos' | 'overclock' | 'scramble' | 'defrag') => {
      if (finishedRef.current) return;
      const costMap = { ddos: 35, overclock: 45, scramble: 50, defrag: 60 };
      const cost = costMap[ability];
      if (chargeRef.current < cost) return;

      chargeRef.current -= cost;
      setCyberCharge(chargeRef.current);

      if (ability === 'ddos') {
        playTone(720, 0.14, 'square', 0.07, 360);
        addCallout(isEn ? 'DDoS FLOOD SENT (+2)!' : 'ATAC DDoS TRIMIS (+2)!', '#f43f5e');
        dispatchAttackToOpponent(2, 'garbage');
      } else if (ability === 'overclock') {
        playTone(840, 0.16, 'triangle', 0.08, 1200);
        addCallout(isEn ? 'RIVAL OVERCLOCKED!' : 'RIVAL SUPRATACTAT!', '#f59e0b');
        dispatchAttackToOpponent(0, 'overclock');
      } else if (ability === 'scramble') {
        playTone(340, 0.18, 'sawtooth', 0.07, 540);
        addCallout(isEn ? 'CONTROLS SCRAMBLED!' : 'CONTROALE INVERSATE!', '#a855f7');
        dispatchAttackToOpponent(0, 'scramble');
      } else if (ability === 'defrag') {
        // Defensive: clear queued garbage + remove bottom 3 rows!
        pendingGarbageRef.current = 0;
        setPendingGarbage(0);
        const kept = boardRef.current.slice(0, TOTAL_ROWS - 3);
        const cleanTop = Array.from({ length: 3 }, () => Array<CellValue>(COLS).fill(null));
        boardRef.current = [...cleanTop, ...kept];
        spawnRowParticles(TOTAL_ROWS - 2, '#10b981');
        spawnRowParticles(TOTAL_ROWS - 1, '#34d399');
        playTone(540, 0.2, 'triangle', 0.09, 1080);
        addCallout(isEn ? 'DEFRAG PURGE (-3 ROWS)!' : 'DEFRAGMENTARE (-3 RÂNDURI)!', '#10b981');
      }
    },
    [addCallout, dispatchAttackToOpponent, isEn, playTone, spawnRowParticles]
  );

  // Keyboard bindings
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (finishedRef.current) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (
        ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' ', 'Spacebar'].includes(e.key)
      ) {
        e.preventDefault();
      }

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        moveHorizontal(-1);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        moveHorizontal(1);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        softDrop();
      } else if (e.key === 'ArrowUp' || e.key === 'x' || e.key === 'X' || e.key === 'w' || e.key === 'W') {
        rotatePiece(1);
      } else if (e.key === 'z' || e.key === 'Z') {
        rotatePiece(-1);
      } else if (e.key === ' ') {
        hardDrop();
      } else if (e.key === 'c' || e.key === 'C' || e.key === 'Shift') {
        performHold();
      } else if (e.key === '1') {
        activateCyberAbility('ddos');
      } else if (e.key === '2') {
        activateCyberAbility('overclock');
      } else if (e.key === '3') {
        activateCyberAbility('scramble');
      } else if (e.key === '4') {
        activateCyberAbility('defrag');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activateCyberAbility, hardDrop, moveHorizontal, performHold, rotatePiece, softDrop]);

  // Clear status banner after 3.5s
  useEffect(() => {
    if (!statusBanner) return;
    const t = setTimeout(() => setStatusBanner(null), 3500);
    return () => clearTimeout(t);
  }, [statusBanner]);

  // Debuff UI countdown ticker
  useEffect(() => {
    const tick = setInterval(() => {
      const now = Date.now();
      if (overclockEndRef.current > 0 && now >= overclockEndRef.current) {
        overclockEndRef.current = 0;
        setOverclockEndAt(0);
      }
      if (scrambleEndRef.current > 0 && now >= scrambleEndRef.current) {
        scrambleEndRef.current = 0;
        setScrambleEndAt(0);
      }
    }, 250);
    return () => clearInterval(tick);
  }, []);

  // Cyber-Bot Smart AI Simulation Loop (when not Live PvP)
  useEffect(() => {
    if (isLivePvP) return;

    const botStep = () => {
      if (finishedRef.current) return;
      const now = Date.now();
      if (botBagRef.current.length === 0) {
        botBagRef.current = create7Bag();
      }
      const nextBotPiece = botBagRef.current.pop() as PieceType;

      let placement = findBestBotPlacement(botBoardRef.current, nextBotPiece);
      // If scrambled by player, bot slips randomly 55% of the time
      if (placement && now < botScrambleEndRef.current && Math.random() < 0.55) {
        const shiftedX = Math.max(0, Math.min(COLS - 3, placement.x + (Math.random() < 0.5 ? -2 : 2)));
        if (!collides(botBoardRef.current, nextBotPiece, shiftedX, 0, placement.rot)) {
          let sy = 0;
          while (!collides(botBoardRef.current, nextBotPiece, shiftedX, sy + 1, placement.rot)) sy++;
          placement = { x: shiftedX, y: sy, rot: placement.rot };
        }
      }

      if (!placement) {
        concludeMatch(
          true,
          'KNOCKOUT! Ai copleșit AI-ul Cyber-Bot până la Top-Out!',
          'KNOCKOUT! You overwhelmed Cyber-Bot AI into a Top-Out!'
        );
        return;
      }

      // Stamp onto bot board
      const mat = SHAPES[nextBotPiece][placement.rot];
      let overflow = true;
      for (let r = 0; r < mat.length; r++) {
        for (let c = 0; c < mat[r].length; c++) {
          if (!mat[r][c]) continue;
          const by = placement.y + r;
          const bx = placement.x + c;
          if (by >= BUFFER_ROWS) overflow = false;
          if (by >= 0 && by < TOTAL_ROWS && bx >= 0 && bx < COLS) {
            botBoardRef.current[by][bx] = nextBotPiece;
          }
        }
      }
      if (overflow) {
        concludeMatch(
          true,
          'KNOCKOUT! Cyber-Bot a făcut Top-Out sub presiunea liniilor tale!',
          'KNOCKOUT! Cyber-Bot topped out under your garbage pressure!'
        );
        return;
      }

      // Clear full rows on bot board
      const fullRows: number[] = [];
      for (let r = 0; r < TOTAL_ROWS; r++) {
        if (botBoardRef.current[r].every((c) => c !== null)) fullRows.push(r);
      }

      if (fullRows.length > 0) {
        const remaining = botBoardRef.current.filter((_, idx) => !fullRows.includes(idx));
        while (remaining.length < TOTAL_ROWS) {
          remaining.unshift(Array<CellValue>(COLS).fill(null));
        }
        botBoardRef.current = remaining;
        botLinesRef.current += fullRows.length;
        botComboRef.current += 1;
        oppLinesRef.current = botLinesRef.current;
        setOppLines(botLinesRef.current);

        let botAtk = fullRows.length === 4 ? 4 : fullRows.length === 3 ? 2 : fullRows.length === 2 ? 1 : 0;
        if (botComboRef.current >= 2) botAtk += 1;

        botScoreRef.current += fullRows.length * 65 + (fullRows.length === 4 ? 140 : 0);
        oppScoreRef.current = botScoreRef.current;
        setOppScore(botScoreRef.current);

        // Bot cancels its pending garbage first
        if (botPendingGarbageRef.current > 0 && botAtk > 0) {
          const canceled = Math.min(botPendingGarbageRef.current, botAtk);
          botPendingGarbageRef.current -= canceled;
          botAtk -= canceled;
        }
        if (botAtk > 0) {
          pendingGarbageRef.current = Math.min(16, pendingGarbageRef.current + botAtk);
          setPendingGarbage(pendingGarbageRef.current);
          shakeRef.current = 4;
          playTone(190, 0.12, 'sawtooth', 0.06, 130);
          setStatusBanner(
            isEn
              ? `🤖 Cyber-Bot sent +${botAtk} corrupted rows!`
              : `🤖 Cyber-Bot ți-a trimis +${botAtk} linii corupte!`
          );
        }
      } else {
        botComboRef.current = -1;
        botScoreRef.current += 12;
        oppScoreRef.current = botScoreRef.current;
        setOppScore(botScoreRef.current);

        // Apply pending garbage to bot board
        if (botPendingGarbageRef.current > 0) {
          const batch = Math.min(5, botPendingGarbageRef.current);
          botPendingGarbageRef.current -= batch;
          const res = injectGarbageLines(botBoardRef.current, batch);
          botBoardRef.current = res.nextBoard;
          if (res.toppedOut) {
            setOppHeights(computeStackHeights(botBoardRef.current));
            concludeMatch(
              true,
              'KNOCKOUT! Liniile tale corupte au doborât Cyber-Bot AI!',
              'KNOCKOUT! Your garbage barrage knocked out Cyber-Bot AI!'
            );
            return;
          }
        }

        // Occasional tactical power-up from bot
        if (Math.random() < 0.065) {
          if (Math.random() < 0.55) {
            const endAt = Date.now() + 5000;
            overclockEndRef.current = endAt;
            setOverclockEndAt(endAt);
            setStatusBanner(
              isEn ? '🤖 Bot triggered GRAVITY OVERCLOCK (5s)!' : '🤖 Botul a activat OVERCLOCK GRAVITAȚIONAL (5s)!'
            );
          } else {
            const endAt = Date.now() + 3800;
            scrambleEndRef.current = endAt;
            setScrambleEndAt(endAt);
            setStatusBanner(
              isEn ? '🤖 Bot triggered CONTROL SCRAMBLE (3.8s)!' : '🤖 Botul ți-a inversat controalele (3.8s)!'
            );
          }
        }
      }

      setOppHeights(computeStackHeights(botBoardRef.current));
    };

    const interval = setInterval(() => {
      const botPace = Date.now() < botOverclockEndRef.current ? 1150 : 840;
      if (Math.random() < (840 / botPace) * 0.95) {
        botStep();
      }
    }, 840);

    return () => clearInterval(interval);
  }, [concludeMatch, isEn, isLivePvP, playTone]);

  // Main 60fps Canvas Render & Gravity Loop
  useEffect(() => {
    let rafId = 0;

    const frame = (now: number) => {
      if (!finishedRef.current && activePieceRef.current) {
        const piece = activePieceRef.current;
        const isOverclocked = Date.now() < overclockEndRef.current;
        const baseInterval = Math.max(120, 740 - (levelRef.current - 1) * 58);
        const dropInterval = isOverclocked ? Math.max(95, baseInterval * 0.45) : baseInterval;

        if (collides(boardRef.current, piece.type, piece.x, piece.y + 1, piece.rot)) {
          if (lockStartTimeRef.current === null) {
            lockStartTimeRef.current = now;
          } else if (now - lockStartTimeRef.current >= 500) {
            lockActivePiece(0);
          }
        } else {
          lockStartTimeRef.current = null;
          if (now - lastDropTimeRef.current >= dropInterval) {
            piece.y += 1;
            piece.lastActionRotate = false;
            lastDropTimeRef.current = now;
          }
        }
      }

      // Draw canvas
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        const w = COLS * CELL_PX;
        const h = ROWS * CELL_PX;
        ctx.save();
        ctx.clearRect(0, 0, w, h);

        // Apply hit-shake
        if (shakeRef.current > 0.2) {
          const sx = (Math.random() - 0.5) * shakeRef.current * 2;
          const sy = (Math.random() - 0.5) * shakeRef.current * 2;
          ctx.translate(sx, sy);
          shakeRef.current *= 0.82;
        } else {
          shakeRef.current = 0;
        }

        // Background matrix grid
        ctx.fillStyle = '#040814';
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
        ctx.lineWidth = 1;
        for (let c = 1; c < COLS; c++) {
          ctx.beginPath();
          ctx.moveTo(c * CELL_PX, 0);
          ctx.lineTo(c * CELL_PX, h);
          ctx.stroke();
        }
        for (let r = 1; r < ROWS; r++) {
          ctx.beginPath();
          ctx.moveTo(0, r * CELL_PX);
          ctx.lineTo(w, r * CELL_PX);
          ctx.stroke();
        }

        // Danger zone top line indicator
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.35)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, CELL_PX * 2);
        ctx.lineTo(w, CELL_PX * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        const drawBlock = (gx: number, gy: number, color: string, glow: string, isGarbage = false) => {
          const visY = gy - BUFFER_ROWS;
          if (visY < 0 || visY >= ROWS) return;
          const px = gx * CELL_PX;
          const py = visY * CELL_PX;
          ctx.fillStyle = color;
          ctx.fillRect(px + 1, py + 1, CELL_PX - 2, CELL_PX - 2);
          ctx.fillStyle = glow;
          ctx.globalAlpha = isGarbage ? 0.25 : 0.4;
          ctx.fillRect(px + 2, py + 2, CELL_PX - 4, 4);
          ctx.globalAlpha = 1;
          ctx.strokeStyle = 'rgba(255,255,255,0.22)';
          ctx.lineWidth = 1;
          ctx.strokeRect(px + 1.5, py + 1.5, CELL_PX - 3, CELL_PX - 3);
        };

        // Locked board blocks
        const board = boardRef.current;
        for (let r = BUFFER_ROWS; r < TOTAL_ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            const cell = board[r][c];
            if (!cell) continue;
            if (cell === 'G') {
              drawBlock(c, r, '#475569', '#94a3b8', true);
            } else {
              const meta = PIECE_META[cell];
              drawBlock(c, r, meta.color, meta.glow);
            }
          }
        }

        // Ghost + Active Piece
        const piece = activePieceRef.current;
        if (piece) {
          const mat = SHAPES[piece.type][piece.rot];
          const meta = PIECE_META[piece.type];

          // Ghost drop Y (dimmed if Overclock active)
          let ghostY = piece.y;
          while (!collides(board, piece.type, piece.x, ghostY + 1, piece.rot)) {
            ghostY++;
          }
          const isOverclocked = Date.now() < overclockEndRef.current;
          ctx.save();
          ctx.strokeStyle = meta.glow;
          ctx.globalAlpha = isOverclocked ? 0.18 : 0.48;
          ctx.lineWidth = 1.5;
          for (let r = 0; r < mat.length; r++) {
            for (let c = 0; c < mat[r].length; c++) {
              if (!mat[r][c]) continue;
              const visY = ghostY + r - BUFFER_ROWS;
              if (visY < 0 || visY >= ROWS) continue;
              ctx.strokeRect(
                (piece.x + c) * CELL_PX + 2,
                visY * CELL_PX + 2,
                CELL_PX - 4,
                CELL_PX - 4
              );
            }
          }
          ctx.restore();

          // Actual Active Piece
          for (let r = 0; r < mat.length; r++) {
            for (let c = 0; c < mat[r].length; c++) {
              if (!mat[r][c]) continue;
              drawBlock(piece.x + c, piece.y + r, meta.color, meta.glow);
            }
          }
        }

        // Particles
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.18;
          p.life -= 0.035;
          if (p.life <= 0) {
            particlesRef.current.splice(i, 1);
            continue;
          }
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
        ctx.globalAlpha = 1;

        // Floating Callouts
        ctx.font = '900 13px monospace';
        ctx.textAlign = 'center';
        for (let i = calloutsRef.current.length - 1; i >= 0; i--) {
          const co = calloutsRef.current[i];
          co.yOffset -= 0.9;
          co.alpha -= 0.018;
          if (co.alpha <= 0) {
            calloutsRef.current.splice(i, 1);
            continue;
          }
          ctx.globalAlpha = Math.max(0, co.alpha);
          ctx.fillStyle = 'rgba(0,0,0,0.65)';
          ctx.fillText(co.text, w / 2 + 1, h * 0.42 + co.yOffset + 1);
          ctx.fillStyle = co.color;
          ctx.fillText(co.text, w / 2, h * 0.42 + co.yOffset);
        }
        ctx.globalAlpha = 1;

        ctx.restore();
      }

      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [lockActivePiece]);

  const handleRestartSolo = () => {
    finishedRef.current = false;
    boardRef.current = createEmptyBoard();
    botBoardRef.current = createEmptyBoard();
    bagRef.current = create7Bag();
    botBagRef.current = create7Bag();
    queueRef.current = [];
    holdRef.current = null;
    holdLockedRef.current = false;
    scoreRef.current = 0;
    linesRef.current = 0;
    garbageSentRef.current = 0;
    pendingGarbageRef.current = 0;
    botPendingGarbageRef.current = 0;
    botScoreRef.current = 0;
    botLinesRef.current = 0;
    comboRef.current = -1;
    b2bRef.current = false;
    chargeRef.current = 35;
    levelRef.current = 1;
    overclockEndRef.current = 0;
    scrambleEndRef.current = 0;
    botOverclockEndRef.current = 0;
    botScrambleEndRef.current = 0;

    setScore(0);
    setLinesCleared(0);
    setGarbageSent(0);
    setPendingGarbage(0);
    setCombo(-1);
    setB2bActive(false);
    setCyberCharge(35);
    setLevel(1);
    setTimeRemaining(MATCH_DURATION_SEC);
    setHoldPiece(null);
    setHoldLocked(false);
    setOverclockEndAt(0);
    setScrambleEndAt(0);
    oppScoreRef.current = 0;
    oppLinesRef.current = 0;
    setOppScore(0);
    setOppLines(0);
    setOppHeights(new Array(COLS).fill(0));
    setMatchResult(null);
    setStatusBanner(null);
    spawnPiece();
  };

  const isOverclockActive = overclockEndAt > Date.now();
  const isScrambleActive = scrambleEndAt > Date.now();

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
              <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>File-Drop Attack 1v1</span>
            </h3>
            <p className="text-[11px] text-slate-400 truncate">
              {studentAvatar} {studentName} vs {opponentAvatar} {opponentName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs font-black text-cyan-300 tabular-nums">
            {score} pts
          </div>
          <div
            className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-black flex items-center gap-1 tabular-nums ${
              timeRemaining <= 15
                ? 'bg-rose-950/90 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-slate-950 border-slate-800 text-amber-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{timeRemaining}s</span>
          </div>
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

      {/* STATUS ALERT BANNER */}
      {statusBanner && (
        <div className="p-2.5 rounded-xl bg-rose-950/90 border border-rose-400 text-rose-200 text-xs font-black text-center animate-pulse">
          {statusBanner}
        </div>
      )}

      {/* ACTIVE DEBUFF BAR */}
      {(isOverclockActive || isScrambleActive || b2bActive || combo >= 1) && (
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono font-black">
          {isOverclockActive && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-950/90 border border-amber-400 text-amber-300 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> OVERCLOCK x2.2
            </span>
          )}
          {isScrambleActive && (
            <span className="px-2.5 py-1 rounded-lg bg-purple-950/90 border border-purple-400 text-purple-300 flex items-center gap-1">
              <Shuffle className="w-3.5 h-3.5" /> {isEn ? 'CONTROLS INVERTED ⇄' : 'CONTROALE INVERSATE ⇄'}
            </span>
          )}
          {b2bActive && (
            <span className="px-2.5 py-1 rounded-lg bg-cyan-950/90 border border-cyan-400 text-cyan-300">
              ★ BACK-TO-BACK x1.5
            </span>
          )}
          {combo >= 1 && (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950/90 border border-emerald-400 text-emerald-300 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" /> COMBO x{combo}
            </span>
          )}
        </div>
      )}

      {/* MAIN DUEL WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT + CENTER: MY HOLD, PENDING GARBAGE, TETRIS MATRIX & NEXT 3 */}
        <div className="lg:col-span-7 p-3 sm:p-4 rounded-3xl bg-slate-950 border-2 border-slate-800 relative overflow-hidden shadow-2xl">
          <div className="flex items-start justify-center gap-2 sm:gap-3">
            {/* LEFT SIDEBAR: HOLD VAULT & PENDING GARBAGE GAUGE */}
            <div className="flex flex-col items-center gap-2.5 w-16 sm:w-20 shrink-0">
              <button
                type="button"
                onClick={performHold}
                disabled={holdLocked || Boolean(matchResult)}
                className={`w-full p-2 rounded-2xl border text-center transition cursor-pointer touch-manipulation ${
                  holdLocked
                    ? 'bg-slate-900/50 border-slate-800 opacity-50'
                    : 'bg-slate-900 hover:bg-slate-800 border-indigo-500/50'
                }`}
              >
                <span className="text-[10px] font-mono font-black text-indigo-300 block mb-1">
                  HOLD [C]
                </span>
                <div className="flex justify-center">
                  <PiecePreviewBox type={holdPiece} compact />
                </div>
              </button>

              {/* Stats Pill Stack */}
              <div className="w-full p-2 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1.5 font-mono">
                <div>
                  <span className="text-[9px] text-slate-400 block">{isEn ? 'LINES' : 'LINII'}</span>
                  <span className="text-sm font-black text-emerald-400 tabular-nums">{linesCleared}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block">{isEn ? 'SENT' : 'ATACAT'}</span>
                  <span className="text-sm font-black text-rose-400 tabular-nums">+{garbageSent}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block">LVL</span>
                  <span className="text-xs font-black text-cyan-300 tabular-nums">{level}</span>
                </div>
              </div>

              {/* Pending Garbage Bar */}
              <div className="w-full p-2 rounded-2xl bg-slate-900 border border-rose-500/40 flex flex-col items-center gap-1">
                <span className="text-[9px] font-mono font-black text-rose-300">
                  {isEn ? 'INCOMING' : 'PRIMITE'}
                </span>
                <div className="w-4 h-28 rounded-full bg-slate-950 border border-slate-800 p-0.5 flex flex-col justify-end overflow-hidden">
                  <div
                    className="w-full rounded-full bg-gradient-to-t from-rose-600 to-amber-400 transition-all duration-150"
                    style={{ height: `${Math.min(100, (pendingGarbage / 12) * 100)}%` }}
                  />
                </div>
                <span className="font-mono text-xs font-black text-rose-400 tabular-nums">
                  {pendingGarbage}
                </span>
              </div>
            </div>

            {/* CENTER: 10x20 MATRIX CANVAS */}
            <div className="relative rounded-2xl border-2 border-cyan-500/50 bg-[#040814] p-1 shadow-[0_0_25px_rgba(6,182,212,0.18)] shrink-0">
              <canvas
                ref={canvasRef}
                width={COLS * CELL_PX}
                height={ROWS * CELL_PX}
                className="block rounded-xl w-[210px] h-[420px] sm:w-[240px] sm:h-[480px]"
              />
            </div>

            {/* RIGHT SIDEBAR: NEXT-3 QUEUE */}
            <div className="flex flex-col items-center gap-2 w-16 sm:w-20 shrink-0">
              <div className="w-full p-2 rounded-2xl bg-slate-900 border border-cyan-500/40 text-center space-y-2.5">
                <span className="text-[10px] font-mono font-black text-cyan-300 block">
                  {isEn ? 'NEXT 3' : 'URM. 3'}
                </span>
                {nextQueue.map((pType, i) => (
                  <div
                    key={`${pType}_${i}`}
                    className={`p-1.5 rounded-xl flex justify-center ${
                      i === 0 ? 'bg-slate-800/80 ring-1 ring-cyan-500/40' : 'bg-slate-950/60 opacity-80'
                    }`}
                  >
                    <PiecePreviewBox type={pType} compact />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MATCH RESULT OVERLAY */}
          {matchResult && (
            <div className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
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
                  {matchResult.won ? (isEn ? 'MATRIX VICTORY! 🧱' : 'VICTORIE DE ARHITECT! 🧱') : isEn ? 'STACK OVERFLOW!' : 'DEPĂȘIT DE RIVAL!'}
                </h4>
                <p className="text-xs text-slate-300 mt-1">{isEn ? matchResult.reasonEn : matchResult.reasonRo}</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs font-black">
                <span className="text-cyan-300">
                  {isEn ? 'Lines' : 'Linii'}: {matchResult.myLines} vs {matchResult.oppLines}
                </span>
                <span className="text-slate-700">|</span>
                <span className="text-rose-300">
                  {isEn ? 'Sent' : 'Atac'}: +{matchResult.garbageSent}
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

        {/* RIGHT COLUMN: TACTICAL CYBER ABILITIES + LIVE RIVAL RADAR + TOUCH CONTROLS */}
        <div className="lg:col-span-5 space-y-3">
          {/* LIVE RIVAL MINI-MATRIX RADAR */}
          <div className="p-4 rounded-3xl bg-slate-950 border border-rose-500/40 space-y-2.5 shadow-xl">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="text-rose-300 flex items-center gap-1.5 truncate">
                <Cpu className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  {opponentAvatar} {opponentName}
                </span>
              </span>
              <span className="font-mono text-rose-200 tabular-nums">
                {oppScore} pts · {oppLines} {isEn ? 'lines' : 'linii'}
              </span>
            </div>

            {/* 10-column live stack radar */}
            <div className="h-24 p-2 rounded-2xl bg-slate-900 border border-slate-800 flex items-end gap-1.5 relative overflow-hidden">
              {oppHeights.map((h, idx) => (
                <div key={idx} className="flex-1 h-full flex flex-col justify-end bg-slate-950/80 rounded-sm overflow-hidden">
                  <div
                    className={`w-full transition-all duration-200 rounded-t-sm ${
                      h >= 15
                        ? 'bg-gradient-to-t from-rose-600 to-amber-400'
                        : 'bg-gradient-to-t from-indigo-600 to-cyan-400'
                    }`}
                    style={{ height: `${Math.min(100, (h / ROWS) * 100)}%` }}
                  />
                </div>
              ))}
              {(oppOverclocked || oppScrambled) && (
                <div className="absolute top-1.5 right-2 flex gap-1 text-[10px] font-mono font-black">
                  {oppOverclocked && <span className="px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300">⚡2.2x</span>}
                  {oppScrambled && <span className="px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-300">⇄</span>}
                </div>
              )}
            </div>
          </div>

          {/* CYBER CHARGE & 4 ACTIVE ABILITIES */}
          <div className="p-4 rounded-3xl bg-slate-950 border border-amber-500/40 space-y-3 shadow-xl">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="text-amber-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{isEn ? 'Cyber Arsenal [Keys 1–4]' : 'Arsenal Cibernetic [Taste 1–4]'}</span>
              </span>
              <span className="font-mono text-amber-300 tabular-nums">{cyberCharge}% ⚡</span>
            </div>

            <div className="h-2.5 w-full rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-400 transition-all duration-200"
                style={{ width: `${cyberCharge}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={cyberCharge < 35 || Boolean(matchResult)}
                onClick={() => activateCyberAbility('ddos')}
                className="min-h-[48px] p-2.5 rounded-xl border border-rose-500/50 bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-600 hover:to-red-500 text-white text-left transition active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer touch-manipulation"
              >
                <div className="flex items-center justify-between text-[11px] font-black">
                  <span>[1] DDoS +2</span>
                  <span className="font-mono">35⚡</span>
                </div>
                <div className="text-[10px] text-rose-100/80 truncate">
                  {isEn ? 'Send +2 garbage lines' : 'Trimite +2 linii corupte'}
                </div>
              </button>

              <button
                type="button"
                disabled={cyberCharge < 45 || Boolean(matchResult)}
                onClick={() => activateCyberAbility('overclock')}
                className="min-h-[48px] p-2.5 rounded-xl border border-amber-500/50 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-left transition active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer touch-manipulation"
              >
                <div className="flex items-center justify-between text-[11px] font-black">
                  <span>[2] Overclock</span>
                  <span className="font-mono">45⚡</span>
                </div>
                <div className="text-[10px] text-amber-100/80 truncate">
                  {isEn ? 'Rival speed x2.2 (6s)' : 'Viteză rival x2.2 (6s)'}
                </div>
              </button>

              <button
                type="button"
                disabled={cyberCharge < 50 || Boolean(matchResult)}
                onClick={() => activateCyberAbility('scramble')}
                className="min-h-[48px] p-2.5 rounded-xl border border-purple-500/50 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-left transition active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer touch-manipulation"
              >
                <div className="flex items-center justify-between text-[11px] font-black">
                  <span>[3] Scramble</span>
                  <span className="font-mono">50⚡</span>
                </div>
                <div className="text-[10px] text-purple-100/80 truncate">
                  {isEn ? 'Invert controls (4.5s)' : 'Inversare taste (4.5s)'}
                </div>
              </button>

              <button
                type="button"
                disabled={cyberCharge < 60 || Boolean(matchResult)}
                onClick={() => activateCyberAbility('defrag')}
                className="min-h-[48px] p-2.5 rounded-xl border border-emerald-500/50 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-left transition active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer touch-manipulation"
              >
                <div className="flex items-center justify-between text-[11px] font-black">
                  <span className="flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> [4] Defrag
                  </span>
                  <span className="font-mono">60⚡</span>
                </div>
                <div className="text-[10px] text-emerald-100/80 truncate">
                  {isEn ? 'Purge 3 bottom rows' : 'Curăță 3 rânduri jos'}
                </div>
              </button>
            </div>
          </div>

          {/* TACTILE ARCADE CONTROL PAD (Mobile + Mouse + Keyboard legend) */}
          <div className="p-3.5 rounded-3xl bg-slate-950 border border-slate-800 space-y-2.5 shadow-xl">
            <div className="grid grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => rotatePiece(-1)}
                className="min-h-[48px] rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center active:scale-90 cursor-pointer touch-manipulation"
                title={isEn ? 'Rotate Left (Z)' : 'Rotește Stânga (Z)'}
              >
                <RotateCcw className="w-5 h-5 text-cyan-300" />
              </button>
              <button
                type="button"
                onClick={() => moveHorizontal(-1)}
                className="min-h-[48px] rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center active:scale-90 cursor-pointer touch-manipulation"
                title={isEn ? 'Move Left (←)' : 'Stânga (←)'}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={softDrop}
                className="min-h-[48px] rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center active:scale-90 cursor-pointer touch-manipulation"
                title={isEn ? 'Soft Drop (↓)' : 'Coborâre Rapidă (↓)'}
              >
                <ArrowDown className="w-5 h-5 text-amber-300" />
              </button>
              <button
                type="button"
                onClick={() => moveHorizontal(1)}
                className="min-h-[48px] rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center active:scale-90 cursor-pointer touch-manipulation"
                title={isEn ? 'Move Right (→)' : 'Dreapta (→)'}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => rotatePiece(1)}
                className="min-h-[48px] rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center active:scale-90 cursor-pointer touch-manipulation"
                title={isEn ? 'Rotate Right (↑)' : 'Rotește Dreapta (↑)'}
              >
                <RotateCw className="w-5 h-5 text-cyan-300" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={performHold}
                disabled={holdLocked || Boolean(matchResult)}
                className="min-h-[46px] rounded-xl bg-indigo-950/90 hover:bg-indigo-900 border border-indigo-500/50 text-indigo-200 font-black text-xs flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-40 cursor-pointer touch-manipulation"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>HOLD [C]</span>
              </button>

              <button
                type="button"
                onClick={hardDrop}
                className="col-span-2 min-h-[46px] rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer touch-manipulation shadow-lg"
              >
                <ChevronsDown className="w-4 h-4" />
                <span>{isEn ? 'HARD DROP [SPACE]' : 'CĂDERE INSTANT [SPACE]'}</span>
              </button>
            </div>

            <div className="text-[10px] font-mono text-slate-400 text-center leading-relaxed pt-1 border-t border-slate-800/80">
              {isEn
                ? 'Pro Tips: 4-Line TETRIS (+4), T-SPIN (+2~6), Back-to-Back (+1) & Clear Lines to cancel incoming Garbage!'
                : 'Pro Tips: TETRIS 4 linii (+4), T-SPIN (+2~6), Back-to-Back (+1) și șterge linii ca să blochezi atacurile!'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
