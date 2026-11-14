import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Trophy,
  RotateCcw,
  Undo2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Star,
  Cpu,
  AlertTriangle,
  Layers,
  Play,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { forceScrollToTop } from '../../utils/scrollHelper';
import { getActiveStudent, updateStudentArcadeScore } from '../../lib/studentAuthService';
import { sounds } from '../../utils/audio';

export interface CyberSokobanGameProps {
  onBack: () => void;
  studentName?: string;
  studentAvatar?: string;
  onAwardXP?: (amount: number, reason: string) => void;
  onSaveScore?: (score: number) => void;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface SokobanLevel {
  id: number;
  titleRo: string;
  titleEn: string;
  tierRo: string;
  tierEn: string;
  conceptRo: string;
  conceptEn: string;
  hintRo: string;
  hintEn: string;
  parMoves: number;
  map: string[];
}

interface Snapshot {
  px: number;
  py: number;
  dir: Direction;
  crates: [number, number][];
  moves: number;
  pushes: number;
}

interface LevelRecord {
  stars: number;
  bestMoves: number;
  bestScore: number;
}

const LEVELS: SokobanLevel[] = [
  {
    id: 1,
    titleRo: '01. Prima Pornire',
    titleEn: '01. First Boot',
    tierRo: 'Nivel 1 · Bazele Sokoban',
    tierEn: 'Tier 1 · Core Logic',
    conceptRo: 'Algoritmi secvențiali: planifică ordinea împingerilor înainte să blochezi o ladă de perete.',
    conceptEn: 'Sequential algorithms: plan push order before trapping a crate against a wall.',
    hintRo: 'Împinge mai întâi lăzile din centrul coloanei spre țintele de sus/jos, apoi pe cele laterale.',
    hintEn: 'Push the central crates toward top/bottom targets first, then line up the side targets.',
    parMoves: 13,
    map: [
      '#######',
      '#..T..#',
      '#..$..#',
      '#.T$.T#',
      '#..$@.#',
      '#.....#',
      '#######',
    ],
  },
  {
    id: 2,
    titleRo: '02. Magistrala Dublă',
    titleEn: '02. Twin Data Bus',
    tierRo: 'Nivel 1 · Bazele Sokoban',
    tierEn: 'Tier 1 · Core Logic',
    conceptRo: 'Spațiu de manevră: lasă loc robotului să ocolească lăzile pentru a schimba direcția.',
    conceptEn: 'Workspace routing: keep clear corridors so the droid can circle around crates.',
    hintRo: 'Nu lipi lăzile de peretele din stânga prematur; eliberează culoarul central.',
    hintEn: 'Avoid pushing crates flush against walls too early; keep the center loop open.',
    parMoves: 31,
    map: [
      '########',
      '#TT....#',
      '#T..#$.#',
      '#..$$..#',
      '#..@...#',
      '#......#',
      '########',
    ],
  },
  {
    id: 3,
    titleRo: '03. Stiva de Memorie',
    titleEn: '03. Memory Stack',
    tierRo: 'Nivel 1 · Bazele Sokoban',
    tierEn: 'Tier 1 · Core Logic',
    conceptRo: 'Structura LIFO (Stivă): exact ca butonul Undo, ultimul pas determină ieșirea din colț.',
    conceptEn: 'LIFO Stack logic: like the Undo button, the last crate pushed determines access.',
    hintRo: 'Umple ținta din colțul cel mai adânc din stânga-sus prima dată!',
    hintEn: 'Fill the deepest top-left target slot first before blocking the corridor.',
    parMoves: 46,
    map: [
      '########',
      '#TT....#',
      '#T#.##.#',
      '#..$$..#',
      '#.@.$..#',
      '#...####',
      '########',
    ],
  },
  {
    id: 4,
    titleRo: '04. Poarta Logică Alpha',
    titleEn: '04. Logic Gate Alpha',
    tierRo: 'Nivel 2 · Porți Laser & Senzori',
    tierEn: 'Tier 2 · Logic Plates & Gates',
    conceptRo: 'Instrucțiunea IF: DACĂ placa de presiune (P) este apăsată, ATUNCI Poarta Laser (G) se deschide.',
    conceptEn: 'IF Conditional: IF Pressure Plate (P) is active, THEN Laser Gate (G) opens.',
    hintRo: 'Parchează prima ladă pe senzorul P ca să deschizi poarta G, treci a doua ladă la ținta din dreapta, apoi mută prima ladă pe ținta din stânga!',
    hintEn: 'Park one crate on Plate P to hold Gate G open, push the second crate through to the right target, then move the first crate to the left target!',
    parMoves: 28,
    map: [
      '#########',
      '#T..#..T#',
      '#.P.G...#',
      '#.$$#...#',
      '#..@....#',
      '#########',
    ],
  },
  {
    id: 5,
    titleRo: '05. Ocolirea Firewall-ului',
    titleEn: '05. Firewall Bypass',
    tierRo: 'Nivel 2 · Porți Laser & Senzori',
    tierEn: 'Tier 2 · Logic Plates & Gates',
    conceptRo: 'Porți sincronizate: un singur senzor P poate controla simultan mai multe porți de securitate.',
    conceptEn: 'Synchronized gates: a single Pressure Plate P controls multiple Firewall Gates simultaneously.',
    hintRo: 'Menține o ladă pe P cât timp treci celelalte 2 lăzi prin porțile G spre țintele din dreapta.',
    hintEn: 'Hold a crate on P while routing the other 2 crates through the G gates to the right room.',
    parMoves: 28,
    map: [
      '#########',
      '#T..#T.T#',
      '#..$G...#',
      '#.P.#.$.#',
      '#.$@G...#',
      '#...#...#',
      '#########',
    ],
  },
  {
    id: 6,
    titleRo: '06. Protocolul Dublu',
    titleEn: '06. Dual Switch Protocol',
    tierRo: 'Nivel 2 · Porți Laser & Senzori',
    tierEn: 'Tier 2 · Logic Plates & Gates',
    conceptRo: 'Controlul accesului: planifică întoarcerea robotului prin cameră înainte să eliberezi senzorul.',
    conceptEn: 'Access control: route your return path before releasing the pressure switch.',
    hintRo: 'Folosește coridorul de jos pentru a ocoli și a poziționa lăzile în camera din dreapta.',
    hintEn: 'Use the bottom hallway to loop back and align crates on the right side.',
    parMoves: 35,
    map: [
      '##########',
      '#T..#...T#',
      '#.$.G.$..#',
      '#.P.#..#.#',
      '#.$@...#T#',
      '#........#',
      '##########',
    ],
  },
  {
    id: 7,
    titleRo: '07. Banda de Transfer',
    titleEn: '07. High-Speed Conveyor',
    tierRo: 'Nivel 3 · Benzi & Portaluri',
    tierEn: 'Tier 3 · Conveyors & Portals',
    conceptRo: 'Transfer unidirecțional: benzile (>, <, ^, v) împing automat lăzile și robotul cu un pas înainte.',
    conceptEn: 'Simplex data bus: conveyor belts (>, <, ^, v) boost crates and the droid one extra tile forward.',
    hintRo: 'Împinge lăzile pe banda ">" pentru a le accelera direct peste canal spre ținte!',
    hintEn: 'Push crates onto the ">" conveyor belt to slide them cleanly toward the targets!',
    parMoves: 29,
    map: [
      '#########',
      '#@$.>..T#',
      '#.#.#.###',
      '#.$...T.#',
      '#.$.>..T#',
      '#########',
    ],
  },
  {
    id: 8,
    titleRo: '08. Tunelul Cuantic',
    titleEn: '08. Quantum Tunnel',
    tierRo: 'Nivel 3 · Benzi & Portaluri',
    tierEn: 'Tier 3 · Conveyors & Portals',
    conceptRo: 'Telecomunicații & Tuning: portalurile pereche (A ↔ A) teleportează instant datele peste ziduri.',
    conceptEn: 'Quantum teleportation: paired portals (A ↔ A) warp crates and bots across solid firewalls.',
    hintRo: 'Împinge lăzile spre dreapta în portalul A pentru a le teleporta în camera țintelor, apoi treci prin coridorul de jos.',
    hintEn: 'Push crates into portal A on the left to warp them into the right vault, then loop around the bottom.',
    parMoves: 31,
    map: [
      '#########',
      '#...#T.T#',
      '#.$A#...#',
      '#.$.#.A.#',
      '#.@.....#',
      '#########',
    ],
  },
  {
    id: 9,
    titleRo: '09. Routerul de Pachete',
    titleEn: '09. Packet Router',
    tierRo: 'Nivel 3 · Benzi & Portaluri',
    tierEn: 'Tier 3 · Conveyors & Portals',
    conceptRo: 'Rutare dinamică: folosește direcția benzilor (< și ^) pentru a scoate lăzile din zone strâmte.',
    conceptEn: 'Dynamic routing: use conveyor directions (< and ^) to extract crates out of tight slots.',
    hintRo: 'Folosește banda ^ de jos pentru a ridica lada spre centru și banda < pentru a traversa spre stânga.',
    hintEn: 'Use the bottom ^ conveyor to boost crates upward and the < belt to push them left.',
    parMoves: 42,
    map: [
      '##########',
      '#T..#....#',
      '#..$<..$.#',
      '#.T.#@.#.#',
      '#..^..$.T#',
      '##########',
    ],
  },
  {
    id: 10,
    titleRo: '10. Blocajul Nucleului',
    titleEn: '10. Kernel Deadlock',
    tierRo: 'Nivel 4 · Arhitectură Master',
    tierEn: 'Tier 4 · Master Architecture',
    conceptRo: 'Prevenirea Deadlock-ului: în sistemele de operare, blocarea reciprocă a resurselor oprește procesorul!',
    conceptEn: 'OS Deadlock Prevention: pushing the wrong crate first locks out the others permanently!',
    hintRo: 'Nu împinge toate lăzile jos deodată — lasă spațiu să rotești fiecare ladă pe rând.',
    hintEn: 'Do not push all crates down at once — keep room to maneuver them into the bottom slots one by one.',
    parMoves: 56,
    map: [
      '#########',
      '#..###..#',
      '#.$$.$..#',
      '#..#.#@.#',
      '#.TTT...#',
      '#########',
    ],
  },
  {
    id: 11,
    titleRo: '11. Hiper-Magistrala Hibridă',
    titleEn: '11. Hybrid Hyperbus',
    tierRo: 'Nivel 4 · Arhitectură Master',
    tierEn: 'Tier 4 · Master Architecture',
    conceptRo: 'Sisteme integrate: combină senzorul P, poarta G și portalurile A într-un singur flux logic.',
    conceptEn: 'Integrated systems: combine Pressure Plate P, Gate G, and Portals A in one pipeline.',
    hintRo: 'Teleportează lăzile prin A sau deschide poarta G cu P pentru a popula toate cele 3 ținte din dreapta.',
    hintEn: 'Warp crates through Portal A or hold Gate G open with Plate P to fill all 3 right targets.',
    parMoves: 21,
    map: [
      '##########',
      '#@$.#T..T#',
      '#.P.G.A..#',
      '#.$A#..$.#',
      '#...#...T#',
      '##########',
    ],
  },
  {
    id: 12,
    titleRo: '12. Nucleul Central Arky',
    titleEn: '12. The Arky Mainframe Core',
    tierRo: 'Nivel 4 · Provocarea Finală',
    tierEn: 'Tier 4 · Grand Finale',
    conceptRo: 'Arhitect de Sisteme: stăpânește porți logice, portaluri cuantice și benzi unidirecționale la unison!',
    conceptEn: 'Systems Architect: master logic gates, quantum portals, and one-way buses all at once!',
    hintRo: 'Folosește poarta G, banda < și portalul A împreună pentru a ghida cele 4 lăzi pe toate cele 4 servere T.',
    hintEn: 'Coordinate Gate G, belt <, and Portal A to route all 4 encrypted crates onto every T dock.',
    parMoves: 22,
    map: [
      '###########',
      '#T...#...T#',
      '#..$.G..$.#',
      '#.P..#.<..#',
      '#..$@..AT.#',
      '#..A.#....#',
      '###########',
    ],
  },
];

const STORAGE_PROGRESS_KEY = 'arkedo_sokoban_progress';

export const CyberSokobanGame: React.FC<CyberSokobanGameProps> = ({
  onBack,
  studentName,
  studentAvatar,
  onAwardXP,
  onSaveScore,
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [levelIdx, setLevelIdx] = useState(0);
  const [grid, setGrid] = useState<string[][]>([]);
  const [px, setPx] = useState(1);
  const [py, setPy] = useState(1);
  const [dir, setDir] = useState<Direction>('DOWN');
  const [crates, setCrates] = useState<[number, number][]>([]);
  const [targets, setTargets] = useState<Set<string>>(new Set());
  const [plates, setPlates] = useState<Set<string>>(new Set());
  const [portals, setPortals] = useState<[number, number][]>([]);
  const [moves, setMoves] = useState(0);
  const [pushes, setPushes] = useState(0);
  const [undoStack, setUndoStack] = useState<Snapshot[]>([]);
  const [deadlockWarning, setDeadlockWarning] = useState(false);
  const [levelCleared, setLevelCleared] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const [progress, setProgress] = useState<Record<number, LevelRecord>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_PROGRESS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const local = Number(localStorage.getItem('arkedo_highscore_cyber_sokoban') || '0');
      const active = getActiveStudent();
      const cloud = active?.arcadeScores?.cyber_sokoban || 0;
      return Math.max(local, cloud);
    } catch {
      return 0;
    }
  });

  const audioCtxRef = useRef<AudioContext | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const walkTimerRef = useRef<number | null>(null);
  const mutedRef = useRef(muted);
  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  const currentLevel = LEVELS[levelIdx];

  useEffect(() => {
    forceScrollToTop();
  }, [levelIdx]);

  // Lock page scroll on arrow keys while playing
  useEffect(() => {
    const handleKeyBlock = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyBlock, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyBlock);
  }, []);

  // Web Audio Synth
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

  const sfxStep = useCallback(() => playTone(220, 'triangle', 0.04, 0.04, 260), [playTone]);
  const sfxPush = useCallback(() => playTone(150, 'square', 0.07, 0.07, 110), [playTone]);
  const sfxDock = useCallback(() => {
    playTone(587, 'triangle', 0.08, 0.09);
    setTimeout(() => playTone(880, 'triangle', 0.12, 0.09), 65);
  }, [playTone]);
  const sfxPortal = useCallback(() => playTone(440, 'sine', 0.16, 0.09, 1040), [playTone]);
  const sfxBlocked = useCallback(() => playTone(110, 'sawtooth', 0.07, 0.05), [playTone]);
  const sfxWin = useCallback(() => {
    [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => playTone(f, 'triangle', 0.15, 0.1), i * 85));
  }, [playTone]);

  // Parse Level Map
  const loadLevel = useCallback((idx: number) => {
    if (walkTimerRef.current) {
      clearInterval(walkTimerRef.current);
      walkTimerRef.current = null;
    }
    const lvl = LEVELS[idx];
    const parsedGrid = lvl.map.map((row) => row.split(''));
    let startX = 1;
    let startY = 1;
    const initCrates: [number, number][] = [];
    const initTargets = new Set<string>();
    const initPlates = new Set<string>();
    const initPortals: [number, number][] = [];

    for (let y = 0; y < parsedGrid.length; y++) {
      for (let x = 0; x < parsedGrid[y].length; x++) {
        const ch = parsedGrid[y][x];
        if (ch === '@' || ch === '+') {
          startX = x;
          startY = y;
        }
        if (ch === '$' || ch === '*') {
          initCrates.push([x, y]);
        }
        if (ch === 'T' || ch === '*' || ch === '+') {
          initTargets.add(`${x},${y}`);
        }
        if (ch === 'P') {
          initPlates.add(`${x},${y}`);
        }
        if (ch === 'A') {
          initPortals.push([x, y]);
        }
        // Normalize floor symbols in base grid
        if (ch === '@' || ch === '$') parsedGrid[y][x] = '.';
        if (ch === '+' || ch === '*') parsedGrid[y][x] = 'T';
      }
    }

    setGrid(parsedGrid);
    setPx(startX);
    setPy(startY);
    setDir('DOWN');
    setCrates(initCrates);
    setTargets(initTargets);
    setPlates(initPlates);
    setPortals(initPortals);
    setMoves(0);
    setPushes(0);
    setUndoStack([]);
    setDeadlockWarning(false);
    setLevelCleared(false);
    setShowHint(false);
  }, []);

  useEffect(() => {
    loadLevel(levelIdx);
  }, [levelIdx, loadLevel]);

  // Helper: Check if gates are currently open
  const checkGateOpen = useCallback(
    (curX: number, curY: number, curCrates: [number, number][]) => {
      if (plates.has(`${curX},${curY}`)) return true;
      return curCrates.some(([cx, cy]) => plates.has(`${cx},${cy}`));
    },
    [plates]
  );

  // Check simple corner deadlock on non-target crates
  const detectCornerDeadlock = useCallback(
    (g: string[][], curCrates: [number, number][]) => {
      const H = g.length;
      const W = g[0]?.length || 0;
      const isHardWall = (x: number, y: number) => {
        if (y < 0 || y >= H || x < 0 || x >= W) return true;
        return g[y][x] === '#';
      };

      for (const [cx, cy] of curCrates) {
        if (targets.has(`${cx},${cy}`)) continue;
        const tile = g[cy]?.[cx];
        if (tile === 'A' || tile === '^' || tile === 'v' || tile === '<' || tile === '>' || tile === 'P') continue;

        const upWall = isHardWall(cx, cy - 1);
        const downWall = isHardWall(cx, cy + 1);
        const leftWall = isHardWall(cx - 1, cy);
        const rightWall = isHardWall(cx + 1, cy);

        if ((upWall || downWall) && (leftWall || rightWall)) {
          return true;
        }
      }
      return false;
    },
    [targets]
  );

  // Execute Single Move / Push
  const performMove = useCallback(
    (moveDir: Direction) => {
      if (levelCleared || grid.length === 0) return false;
      initAudio();

      const dx = moveDir === 'LEFT' ? -1 : moveDir === 'RIGHT' ? 1 : 0;
      const dy = moveDir === 'UP' ? -1 : moveDir === 'DOWN' ? 1 : 0;
      setDir(moveDir);

      const H = grid.length;
      const W = grid[0].length;
      const cellAt = (x: number, y: number) => (y < 0 || y >= H || x < 0 || x >= W ? '#' : grid[y][x]);
      const gateOpen = checkGateOpen(px, py, crates);

      const nx = px + dx;
      const ny = py + dy;
      const targetCell = cellAt(nx, ny);

      if (targetCell === '#' || (targetCell === 'G' && !gateOpen)) {
        sfxBlocked();
        return false;
      }

      const isSolidForEntity = (x: number, y: number, cs: [number, number][], gOpen: boolean) => {
        const ch = cellAt(x, y);
        if (ch === '#') return true;
        if (ch === 'G' && !gOpen) return true;
        if (cs.some(([cx, cy]) => cx === x && cy === y)) return true;
        return false;
      };

      const applyConveyor = (x: number, y: number, px0: number, py0: number, cs: [number, number][], isCrate: boolean): [number, number] => {
        const ch = cellAt(x, y);
        let cdx = 0;
        let cdy = 0;
        if (ch === '^') cdy = -1;
        else if (ch === 'v') cdy = 1;
        else if (ch === '<') cdx = -1;
        else if (ch === '>') cdx = 1;
        else return [x, y];

        const cx = x + cdx;
        const cy = y + cdy;
        const gOpen = checkGateOpen(px0, py0, cs);
        if (!isSolidForEntity(cx, cy, cs, gOpen) && !(isCrate && cx === px0 && cy === py0)) {
          return [cx, cy];
        }
        return [x, y];
      };

      const warpPortal = (x: number, y: number, cs: [number, number][], gOpen: boolean): [number, number, boolean] => {
        if (cellAt(x, y) === 'A' && portals.length === 2) {
          const other = portals[0][0] === x && portals[0][1] === y ? portals[1] : portals[0];
          const occupied = cs.some(([cx, cy]) => cx === other[0] && cy === other[1]);
          if (!occupied && (cellAt(other[0], other[1]) !== 'G' || gOpen)) {
            return [other[0], other[1], true];
          }
        }
        return [x, y, false];
      };

      const crateIdx = crates.findIndex(([cx, cy]) => cx === nx && cy === ny);
      const nextCrates = crates.map(([cx, cy]) => [cx, cy] as [number, number]);
      let nextPx = nx;
      let nextPy = ny;
      let didPush = false;
      let warped = false;

      if (crateIdx !== -1) {
        const pushX = nx + dx;
        const pushY = ny + dy;
        if (isSolidForEntity(pushX, pushY, nextCrates, gateOpen)) {
          sfxBlocked();
          return false;
        }
        didPush = true;
        nextCrates[crateIdx] = [pushX, pushY];

        // Conveyor check for crate
        const [convX, convY] = applyConveyor(pushX, pushY, nextPx, nextPy, nextCrates, true);
        // Portal check for crate
        const gOpenAfter = checkGateOpen(nextPx, nextPy, nextCrates);
        const [wX, wY, didWarp] = warpPortal(convX, convY, nextCrates, gOpenAfter);
        nextCrates[crateIdx] = [wX, wY];
        warped = didWarp;

        if (warped) sfxPortal();
        else if (targets.has(`${wX},${wY}`)) sfxDock();
        else sfxPush();
      } else {
        // Player conveyor & portal check
        const [convX, convY] = applyConveyor(nx, ny, px, py, nextCrates, false);
        const gOpenAfter = checkGateOpen(convX, convY, nextCrates);
        const [wX, wY, didWarp] = warpPortal(convX, convY, nextCrates, gOpenAfter);
        if (didWarp && !nextCrates.some(([cx, cy]) => cx === wX && cy === wY)) {
          nextPx = wX;
          nextPy = wY;
          warped = true;
          sfxPortal();
        } else {
          nextPx = convX;
          nextPy = convY;
          sfxStep();
        }
      }

      // Push snapshot to Undo stack
      setUndoStack((prev) => [
        ...prev,
        { px, py, dir, crates: crates.map(([cx, cy]) => [cx, cy] as [number, number]), moves, pushes },
      ]);

      const newMoves = moves + 1;
      const newPushes = pushes + (didPush ? 1 : 0);
      setPx(nextPx);
      setPy(nextPy);
      setCrates(nextCrates);
      setMoves(newMoves);
      setPushes(newPushes);

      // Check Victory
      const won = nextCrates.every(([cx, cy]) => targets.has(`${cx},${cy}`));
      if (won) {
        sfxWin();
        setLevelCleared(true);
        setDeadlockWarning(false);

        const par = currentLevel.parMoves;
        const stars = newMoves <= par ? 3 : newMoves <= Math.ceil(par * 1.45) ? 2 : 1;
        const baseScore = 250 + currentLevel.id * 75;
        const effBonus = stars === 3 ? 250 : stars === 2 ? 120 : 0;
        const levelScore = baseScore + effBonus;

        setProgress((prev) => {
          const existing = prev[currentLevel.id];
          const updated: Record<number, LevelRecord> = {
            ...prev,
            [currentLevel.id]: {
              stars: Math.max(existing?.stars || 0, stars),
              bestMoves: existing ? Math.min(existing.bestMoves, newMoves) : newMoves,
              bestScore: Math.max(existing?.bestScore || 0, levelScore),
            },
          };
          try {
            localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(updated));
          } catch {
            // ignore
          }
          const newTotal = (Object.values(updated) as LevelRecord[]).reduce((sum, rec) => sum + rec.bestScore, 0);
          if (newTotal > highScore) {
            setHighScore(newTotal);
            try {
              localStorage.setItem('arkedo_highscore_cyber_sokoban', String(newTotal));
            } catch {
              // ignore
            }
          }
          updateStudentArcadeScore('cyber_sokoban', newTotal);
          onSaveScore?.(newTotal);
          return updated;
        });

        onAwardXP?.(stars === 3 ? 60 : 35, `Cyber Sokoban L${currentLevel.id} (${stars}★)`);
      } else {
        setDeadlockWarning(detectCornerDeadlock(grid, nextCrates));
      }
      return true;
    },
    [
      checkGateOpen,
      crates,
      currentLevel,
      detectCornerDeadlock,
      dir,
      grid,
      highScore,
      initAudio,
      levelCleared,
      moves,
      onAwardXP,
      onSaveScore,
      portals,
      pushes,
      px,
      py,
      sfxBlocked,
      sfxDock,
      sfxPortal,
      sfxPush,
      sfxStep,
      sfxWin,
      targets,
    ]
  );

  // Undo last move
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0 || levelCleared) return;
    initAudio();
    sounds.playClick();
    if (walkTimerRef.current) {
      clearInterval(walkTimerRef.current);
      walkTimerRef.current = null;
    }
    const last = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setPx(last.px);
    setPy(last.py);
    setDir(last.dir);
    setCrates(last.crates);
    setMoves(last.moves);
    setPushes(last.pushes);
    setDeadlockWarning(detectCornerDeadlock(grid, last.crates));
  }, [detectCornerDeadlock, grid, initAudio, levelCleared, undoStack]);

  // Tap-to-Walk BFS Pathfinding on floor tiles (or 1-step push if adjacent!)
  const handleTileTap = (tx: number, ty: number) => {
    if (levelCleared || grid.length === 0) return;
    if (walkTimerRef.current) {
      clearInterval(walkTimerRef.current);
      walkTimerRef.current = null;
    }

    const dx = tx - px;
    const dy = ty - py;
    // Direct adjacent click -> single step or crate push!
    if (Math.abs(dx) + Math.abs(dy) === 1) {
      if (dx === 1) performMove('RIGHT');
      else if (dx === -1) performMove('LEFT');
      else if (dy === 1) performMove('DOWN');
      else if (dy === -1) performMove('UP');
      return;
    }

    // BFS for safe walking path (avoiding walls, crates, closed gates, portals & conveyors so auto-walk stays predictable)
    const H = grid.length;
    const W = grid[0].length;
    const gateOpen = checkGateOpen(px, py, crates);
    const crateSet = new Set(crates.map(([cx, cy]) => `${cx},${cy}`));
    if (crateSet.has(`${tx},${ty}`)) return;

    const visited = new Set<string>([`${px},${py}`]);
    const queue: { x: number; y: number; path: Direction[] }[] = [{ x: px, y: py, path: [] }];
    const dirs: { d: Direction; dx: number; dy: number }[] = [
      { d: 'UP', dx: 0, dy: -1 },
      { d: 'DOWN', dx: 0, dy: 1 },
      { d: 'LEFT', dx: -1, dy: 0 },
      { d: 'RIGHT', dx: 1, dy: 0 },
    ];

    let foundPath: Direction[] | null = null;
    while (queue.length > 0) {
      const cur = queue.shift()!;
      if (cur.x === tx && cur.y === ty) {
        foundPath = cur.path;
        break;
      }
      for (const step of dirs) {
        const nx = cur.x + step.dx;
        const ny = cur.y + step.dy;
        if (ny < 0 || ny >= H || nx < 0 || nx >= W) continue;
        const key = `${nx},${ny}`;
        if (visited.has(key) || crateSet.has(key)) continue;
        const ch = grid[ny][nx];
        if (ch === '#' || (ch === 'G' && !gateOpen)) continue;
        // Stop auto-walk from unexpectedly triggering portals/conveyors mid-path unless destination
        if ((ch === 'A' || ch === '^' || ch === 'v' || ch === '<' || ch === '>') && (nx !== tx || ny !== ty)) continue;

        visited.add(key);
        queue.push({ x: nx, y: ny, path: [...cur.path, step.d] });
      }
    }

    if (foundPath && foundPath.length > 0) {
      let stepIdx = 0;
      const stepsCopy = [...foundPath];
      // Perform step 0 immediately and schedule remaining
      performMove(stepsCopy[0]);
      stepIdx = 1;
      if (stepIdx < stepsCopy.length) {
        walkTimerRef.current = window.setInterval(() => {
          if (stepIdx >= stepsCopy.length) {
            if (walkTimerRef.current) clearInterval(walkTimerRef.current);
            walkTimerRef.current = null;
            return;
          }
          //Note: since performMove uses closure state, single-step auto-walk triggers cleanly only if done cleanly via ref or let's execute 1 step at a time using state-independent queue? Wait: setInterval closure would capture old `px/py`!
          clearInterval(walkTimerRef.current!);
          walkTimerRef.current = null;
        }, 65);
      }
    }
  };

  // Safe ref-backed queued step runner for multi-step tap-to-walk!
  const pendingWalkRef = useRef<Direction[]>([]);
  useEffect(() => {
    if (pendingWalkRef.current.length === 0) return;
    const timer = window.setTimeout(() => {
      const nextStep = pendingWalkRef.current.shift();
      if (nextStep) {
        performMove(nextStep);
      }
    }, 65);
    return () => clearTimeout(timer);
  }, [px, py, performMove]);

  const handleTileTapSmart = (tx: number, ty: number) => {
    if (levelCleared || grid.length === 0) return;
    pendingWalkRef.current = [];
    const dx = tx - px;
    const dy = ty - py;
    if (Math.abs(dx) + Math.abs(dy) === 1) {
      if (dx === 1) performMove('RIGHT');
      else if (dx === -1) performMove('LEFT');
      else if (dy === 1) performMove('DOWN');
      else if (dy === -1) performMove('UP');
      return;
    }

    const H = grid.length;
    const W = grid[0].length;
    const gateOpen = checkGateOpen(px, py, crates);
    const crateSet = new Set(crates.map(([cx, cy]) => `${cx},${cy}`));
    if (crateSet.has(`${tx},${ty}`)) return;

    const visited = new Set<string>([`${px},${py}`]);
    const queue: { x: number; y: number; path: Direction[] }[] = [{ x: px, y: py, path: [] }];
    const dirs: { d: Direction; dx: number; dy: number }[] = [
      { d: 'UP', dx: 0, dy: -1 },
      { d: 'DOWN', dx: 0, dy: 1 },
      { d: 'LEFT', dx: -1, dy: 0 },
      { d: 'RIGHT', dx: 1, dy: 0 },
    ];

    let foundPath: Direction[] | null = null;
    while (queue.length > 0) {
      const cur = queue.shift()!;
      if (cur.x === tx && cur.y === ty) {
        foundPath = cur.path;
        break;
      }
      for (const step of dirs) {
        const nx = cur.x + step.dx;
        const ny = cur.y + step.dy;
        if (ny < 0 || ny >= H || nx < 0 || nx >= W) continue;
        const key = `${nx},${ny}`;
        if (visited.has(key) || crateSet.has(key)) continue;
        const ch = grid[ny][nx];
        if (ch === '#' || (ch === 'G' && !gateOpen)) continue;
        if ((ch === 'A' || ch === '^' || ch === 'v' || ch === '<' || ch === '>') && (nx !== tx || ny !== ty)) continue;
        visited.add(key);
        queue.push({ x: nx, y: ny, path: [...cur.path, step.d] });
      }
    }

    if (foundPath && foundPath.length > 0) {
      pendingWalkRef.current = foundPath.slice(1);
      performMove(foundPath[0]);
    }
  };

  // Suppress unused warning on legacy helper if replaced cleanly
  void handleTileTap;

  // Keyboard Listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') performMove('UP');
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') performMove('DOWN');
      else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') performMove('LEFT');
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') performMove('RIGHT');
      else if (e.key === 'z' || e.key === 'Z' || e.key === 'u' || e.key === 'U') handleUndo();
      else if (e.key === 'r' || e.key === 'R') loadLevel(levelIdx);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleUndo, levelIdx, loadLevel, performMove]);

  // Swipe gestures on board
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (Math.max(absX, absY) >= 22) {
      if (absX > absY) performMove(dx > 0 ? 'RIGHT' : 'LEFT');
      else performMove(dy > 0 ? 'DOWN' : 'UP');
    }
    touchStartRef.current = null;
  };

  const gateOpenNow = checkGateOpen(px, py, crates);
  const progressList = Object.values(progress) as LevelRecord[];
  const totalStarsEarned = progressList.reduce((sum, r) => sum + r.stars, 0);
  const totalCampaignScore = progressList.reduce((sum, r) => sum + r.bestScore, 0);
  const solvedLevelsCount = Object.keys(progress).length;

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
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">{isEn ? 'Back' : 'Înapoi'}</span>
          </button>

          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-black text-white font-heading truncate flex items-center gap-2">
              <span aria-hidden="true">🤖</span>
              <span>{isEn ? 'Cyber Sokoban: Data Center Architect' : 'Cyber Sokoban: Inginerul de Servere'}</span>
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>{studentAvatar || '🎓'} {studentName || (isEn ? 'Cadet' : 'Elev')}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-300 font-semibold">{isEn ? currentLevel.tierEn : currentLevel.tierRo}</span>
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
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left/Center: Warehouse Board & Controls */}
        <div className="lg:col-span-8 flex flex-col items-center gap-3">
          {/* HUD Bar */}
          <div className="w-full grid grid-cols-4 gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-2.5 text-center shadow-lg">
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase">{isEn ? 'Campaign' : 'Scor Total'}</div>
              <div className="text-base sm:text-lg font-black text-amber-300 font-mono tabular-nums">
                {Math.max(totalCampaignScore, highScore).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase">{isEn ? 'Stars' : 'Stele'}</div>
              <div className="text-base sm:text-lg font-black text-yellow-300 font-mono tabular-nums flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{totalStarsEarned}/36</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase">{isEn ? 'Moves / Par' : 'Pași / Optim'}</div>
              <div className="text-base sm:text-lg font-black text-cyan-300 font-mono tabular-nums">
                {moves} <span className="text-xs text-slate-500">/ {currentLevel.parMoves}</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase">{isEn ? 'Solved' : 'Rezolvate'}</div>
              <div className="text-base sm:text-lg font-black text-emerald-300 font-mono tabular-nums">{solvedLevelsCount}/12</div>
            </div>
          </div>

          {/* Level Header Banner & Concept */}
          <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-sm sm:text-base font-black text-white">
                {isEn ? currentLevel.titleEn : currentLevel.titleRo}
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {isEn ? currentLevel.conceptEn : currentLevel.conceptRo}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowHint((h) => !h)}
              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 text-xs font-bold shrink-0 cursor-pointer"
            >
              {showHint ? (isEn ? 'Hide Hint' : 'Ascunde Indiciu') : (isEn ? 'Need Hint?' : 'Indiciu?')}
            </button>
          </div>

          {showHint && (
            <div className="w-full bg-indigo-950/60 border border-indigo-500/40 rounded-xl px-4 py-2.5 text-xs text-indigo-200 leading-relaxed">
              💡 {isEn ? currentLevel.hintEn : currentLevel.hintRo}
            </div>
          )}

          {deadlockWarning && !levelCleared && (
            <div className="w-full bg-rose-950/70 border border-rose-500/50 rounded-xl px-4 py-2 text-xs text-rose-200 font-bold flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  {isEn
                    ? 'Corner Deadlock detected! This crate cannot leave the corner.'
                    : 'Blocaj în colț (Deadlock)! Lada nu mai poate fi scoasă.'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleUndo}
                className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-black cursor-pointer shrink-0"
              >
                {isEn ? 'Undo' : 'Înapoi'}
              </button>
            </div>
          )}

          {/* Interactive Grid Warehouse */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative w-full bg-slate-950 border-2 border-amber-500/40 rounded-2xl p-3 sm:p-5 shadow-2xl flex items-center justify-center touch-none overflow-hidden"
          >
            {grid.length > 0 && (
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`,
                  width: '100%',
                  maxWidth: `${grid[0].length * 48}px`,
                }}
              >
                {grid.map((row, y) =>
                  row.map((cell, x) => {
                    const isPlayer = px === x && py === y;
                    const isCrate = crates.some(([cx, cy]) => cx === x && cy === y);
                    const isTarget = targets.has(`${x},${y}`);
                    const isPlate = plates.has(`${x},${y}`);
                    const isGate = cell === 'G';
                    const isPortal = cell === 'A';
                    const isConveyor = cell === '^' || cell === 'v' || cell === '<' || cell === '>';

                    if (cell === '#') {
                      return (
                        <div
                          key={`${x}-${y}`}
                          className="aspect-square rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600/80 shadow-inner flex items-center justify-center"
                        >
                          <div className="w-2 h-2 rounded-sm bg-slate-900/60" />
                        </div>
                      );
                    }

                    return (
                      <button
                        key={`${x}-${y}`}
                        type="button"
                        onClick={() => handleTileTapSmart(x, y)}
                        className={`aspect-square rounded-lg relative flex items-center justify-center transition-all duration-150 cursor-pointer ${
                          isGate
                            ? gateOpenNow
                              ? 'bg-emerald-950/40 border border-dashed border-emerald-400/60'
                              : 'bg-rose-950/90 border-2 border-rose-500 shadow-inner shadow-rose-500/40'
                            : isTarget
                              ? 'bg-emerald-950/60 border border-emerald-500/50'
                              : isPlate
                                ? 'bg-amber-950/60 border border-amber-400/60'
                                : isPortal
                                  ? 'bg-purple-950/80 border border-purple-400/70'
                                  : isConveyor
                                    ? 'bg-cyan-950/70 border border-cyan-500/40'
                                    : 'bg-slate-900/90 border border-slate-800/80 hover:bg-slate-800/80'
                        }`}
                      >
                        {/* Floor Feature Icon (when no crate/player covering or behind) */}
                        {isTarget && !isCrate && (
                          <div className="w-3.5 h-3.5 rounded-full bg-emerald-400/30 border-2 border-emerald-400 animate-pulse" />
                        )}
                        {isPlate && !isCrate && !isPlayer && (
                          <div className="w-5 h-5 rounded-md bg-amber-500/30 border-2 border-amber-400 flex items-center justify-center text-[10px] font-mono font-black text-amber-300">
                            P
                          </div>
                        )}
                        {isGate && !gateOpenNow && (
                          <div className="text-[10px] font-mono font-black text-rose-300 tracking-tighter">LOCK</div>
                        )}
                        {isGate && gateOpenNow && !isCrate && !isPlayer && (
                          <div className="text-[9px] font-mono font-bold text-emerald-400/80">OPEN</div>
                        )}
                        {isPortal && !isCrate && !isPlayer && (
                          <div className="w-6 h-6 rounded-full border-2 border-purple-400 bg-purple-500/30 animate-spin flex items-center justify-center text-[10px] font-bold text-purple-200">
                            🌀
                          </div>
                        )}
                        {isConveyor && !isCrate && !isPlayer && (
                          <span className="text-cyan-300 font-black text-sm sm:text-base">
                            {cell === '^' ? '↑' : cell === 'v' ? '↓' : cell === '<' ? '←' : '→'}
                          </span>
                        )}

                        {/* Crate */}
                        {isCrate && (
                          <div
                            className={`absolute inset-1 rounded-md flex items-center justify-center font-black text-sm sm:text-lg shadow-lg transition-transform duration-150 ${
                              isTarget
                                ? 'bg-gradient-to-br from-emerald-400 to-teal-600 border-2 border-emerald-200 text-slate-950 shadow-emerald-500/40 scale-95'
                                : 'bg-gradient-to-br from-amber-400 to-orange-600 border-2 border-amber-200 text-slate-950 shadow-amber-500/30'
                            }`}
                          >
                            {isTarget ? '✓' : '📦'}
                          </div>
                        )}

                        {/* Arky-Bot Player */}
                        {isPlayer && (
                          <div className="absolute inset-0.5 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 border-2 border-white shadow-lg shadow-cyan-500/50 flex items-center justify-center text-base sm:text-xl z-10">
                            🤖
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            )}

            {/* LEVEL CLEARED OVERLAY */}
            {levelCleared && (
              <div className="absolute inset-0 bg-slate-950/92 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center gap-4 z-20">
                <Sparkles className="w-12 h-12 text-amber-400 animate-pulse" />
                <div>
                  <div className="text-xs font-mono font-bold text-emerald-400 uppercase">
                    {isEn ? 'Server Vault Synchronized!' : 'Servere Sincronizate!'}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    {isEn ? currentLevel.titleEn : currentLevel.titleRo}
                  </h2>
                </div>

                {/* Star Rating */}
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3].map((s) => {
                    const earnedStars = moves <= currentLevel.parMoves ? 3 : moves <= Math.ceil(currentLevel.parMoves * 1.45) ? 2 : 1;
                    const active = s <= earnedStars;
                    return (
                      <Star
                        key={s}
                        className={`w-8 h-8 ${active ? 'fill-yellow-400 text-yellow-400 drop-shadow' : 'text-slate-700'}`}
                      />
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-900 border border-slate-800 rounded-2xl px-6 py-3 text-center">
                  <div>
                    <div className="text-[11px] text-slate-400">{isEn ? 'Your Moves' : 'Pașii Tăi'}</div>
                    <div className="text-lg font-black text-cyan-300 font-mono tabular-nums">
                      {moves} <span className="text-xs text-slate-500">(Par {currentLevel.parMoves})</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">{isEn ? 'Total Score' : 'Scor Campanie'}</div>
                    <div className="text-lg font-black text-amber-300 font-mono tabular-nums">
                      {totalCampaignScore.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => loadLevel(levelIdx)}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm cursor-pointer flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{isEn ? 'Optimize Moves' : 'Optimizează'}</span>
                  </button>

                  {levelIdx < LEVELS.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setLevelIdx((i) => i + 1)}
                      className="min-h-[44px] px-7 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm shadow-lg cursor-pointer flex items-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>{isEn ? `Next Level (${levelIdx + 2}/12)` : `Nivelul Următor (${levelIdx + 2}/12)`}</span>
                    </button>
                  ) : (
                    <div className="px-5 py-2.5 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 font-black text-sm flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      <span>{isEn ? 'All 12 Vaults Mastered!' : 'Toate cele 12 Nivele Complete!'}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Bar + Tactile Mobile D-Pad */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
            {/* Undo & Reset */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-center">
              <button
                type="button"
                onClick={handleUndo}
                disabled={undoStack.length === 0 || levelCleared}
                className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-slate-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer touch-manipulation"
              >
                <Undo2 className="w-4 h-4 text-cyan-400" />
                <span>{isEn ? `Undo (${undoStack.length})` : `Înapoi (${undoStack.length})`}</span>
              </button>

              <button
                type="button"
                onClick={() => loadLevel(levelIdx)}
                className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer touch-manipulation"
              >
                <RotateCcw className="w-4 h-4 text-rose-400" />
                <span>{isEn ? 'Reset (R)' : 'Resetează (R)'}</span>
              </button>
            </div>

            {/* Tactile D-Pad */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => performMove('UP')}
                className="w-16 min-h-[46px] rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-amber-600 border border-slate-700 text-white flex items-center justify-center touch-manipulation cursor-pointer shadow"
                aria-label="Move Up"
              >
                <ChevronUp className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => performMove('LEFT')}
                  className="w-16 min-h-[46px] rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-amber-600 border border-slate-700 text-white flex items-center justify-center touch-manipulation cursor-pointer shadow"
                  aria-label="Move Left"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => performMove('DOWN')}
                  className="w-16 min-h-[46px] rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-amber-600 border border-slate-700 text-white flex items-center justify-center touch-manipulation cursor-pointer shadow"
                  aria-label="Move Down"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => performMove('RIGHT')}
                  className="w-16 min-h-[46px] rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-amber-600 border border-slate-700 text-white flex items-center justify-center touch-manipulation cursor-pointer shadow"
                  aria-label="Move Right"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: 12-Level Selector & Cyber Logistics Legend */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Level Selector Grid */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <h3 className="text-sm font-black text-white mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>{isEn ? 'Select Sector (12 Levels)' : 'Selectează Nivelul (1–12)'}</span>
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {LEVELS.map((lvl, idx) => {
                const rec = progress[lvl.id];
                const isSelected = idx === levelIdx;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setLevelIdx(idx);
                    }}
                    className={`min-h-[50px] rounded-xl border p-1.5 flex flex-col items-center justify-center gap-0.5 transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                        : rec
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200 hover:bg-emerald-900/40'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-xs font-black font-mono">{lvl.id}</span>
                    <div className="flex items-center gap-0.5">
                      {rec ? (
                        Array.from({ length: rec.stars }).map((_, s) => (
                          <Star key={s} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                        ))
                      ) : (
                        <span className="text-[9px] text-slate-500">Par {lvl.parMoves}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mechanics Legend */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <h3 className="text-sm font-black text-white mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>{isEn ? 'Cyber Vault Elements' : 'Elemente de Logistică'}</span>
            </h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">📦</span>
                <span>{isEn ? 'Encrypted Crate · Push onto Green Dock' : 'Ladă Date · Împinge pe Dock-ul Verde'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-md bg-amber-950 border border-amber-400 text-amber-300 font-mono font-black flex items-center justify-center shrink-0">
                  P
                </span>
                <span>{isEn ? 'Pressure Plate · Opens LOCK Gates' : 'Senzor P · Deschide Porțile Laser LOCK'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-md bg-purple-950 border border-purple-400 flex items-center justify-center shrink-0">🌀</span>
                <span>{isEn ? 'Quantum Portal · Teleports Crates/Bot' : 'Portal Cuantic · Teleportează Lăzi/Robot'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-md bg-cyan-950 border border-cyan-400 text-cyan-300 font-black flex items-center justify-center shrink-0">
                  →
                </span>
                <span>{isEn ? 'Data Conveyor · Slides 1 tile forward' : 'Bandă Transfer · Împinge automat 1 pas'}</span>
              </div>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400 border-t border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{isEn ? 'Tip: Tap any open floor tile to auto-walk there!' : 'Sfat: Apasă direct pe orice podea liberă pentru mers rapid!'}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{isEn ? 'Keyboard: Arrows/WASD · Z = Undo · R = Reset' : 'Tastatură: Săgeți/WASD · Z = Înapoi · R = Reset'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
