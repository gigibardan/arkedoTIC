import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MousePointer,
  Crosshair,
  Zap,
  Flame,
  Swords,
  Trophy,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Bot,
  Crown,
  Target,
  Layers,
  ArrowRight,
  Wifi,
  Clock,
  Hand,
  Cpu,
  HardDrive,
  Usb,
  ShieldX,
  Gauge
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { DuelRoomData, DuelPlayer, updateDuelProgress } from '../../lib/duelService';
import { recordStudentDuelResult } from '../../lib/studentAuthService';

// Progressive milestone thresholds (15, 30, 45, 60, 75, 90, 95, 100)
const MILESTONES = [15, 30, 45, 60, 75, 90, 95, 100] as const;
type Milestone = (typeof MILESTONES)[number];

interface TargetItem {
  id: string;
  x: number; // percentage 5 - 85%
  y: number; // percentage 10 - 80%
  size: number; // px
  type: 'standard' | 'bonus_gold' | 'rapid_double' | 'micro_snipe';
  points: number;
  clicksNeeded: number;
  clicksDone: number;
  spawnTime: number;
  lifetimeMs: number;
}

interface DragComponentItem {
  id: string;
  name: string;
  slot: 'cpu' | 'ram' | 'usb' | 'ssd';
  slotName: string;
  icon: string;
  color: string;
}

interface MalwareProjectile {
  id: string;
  x: number; // %
  y: number; // %
  targetX: number;
  targetY: number;
  threatName: string;
  icon: string;
  speed: number;
}

interface MovingBug {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

interface MouseMasterDuelGameProps {
  roomData?: DuelRoomData | null;
  isHost?: boolean;
  studentName?: string;
  studentAvatar?: string;
  onFinish?: (score: number, isWinner: boolean) => void;
  onBack?: () => void;
}

export const MouseMasterDuelGame: React.FC<MouseMasterDuelGameProps> = ({
  roomData,
  isHost = true,
  studentName = 'Campion TIC',
  studentAvatar = '⚡',
  onFinish,
  onBack,
}) => {
  const { lang } = useLanguage();

  // Arena & Gameplay State
  const [stage, setStage] = useState<number>(1); // 1 to 7
  const [score, setScore] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0); // 0 to 100%
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [accuracyHits, setAccuracyHits] = useState<number>(0);
  const [totalClicks, setTotalClicks] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [winnerName, setWinnerName] = useState<string | null>(null);
  const [isWinner, setIsWinner] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Opponent Live Sync State
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const [opponentProgress, setOpponentProgress] = useState<number>(0);
  const [opponentName, setOpponentName] = useState<string>(
    roomData ? (isHost ? roomData.guest?.name || 'Oponent' : roomData.host.name) : 'Botul Antrenor 🤖'
  );
  const [opponentAvatar, setOpponentAvatar] = useState<string>(
    roomData ? (isHost ? roomData.guest?.avatar || '👾' : roomData.host.avatar) : '🤖'
  );

  // Stage 1: Precision Targets
  const [targets, setTargets] = useState<TargetItem[]>([]);
  const [stage1Hits, setStage1Hits] = useState<number>(0);

  // Stage 2: Rapid Double Click Orbs
  const [stage2Hits, setStage2Hits] = useState<number>(0);

  // Stage 3: Circuit Laser Path Trace
  const [circuitProgress, setCircuitProgress] = useState<number>(0); // 0 to 100%
  const [isTracingCircuit, setIsTracingCircuit] = useState<boolean>(false);
  const [circuitOffTrack, setCircuitOffTrack] = useState<boolean>(false);

  // Stage 4: Drag & Drop Hardware Sockets
  const [draggedItem, setDraggedItem] = useState<DragComponentItem | null>(null);
  const [placedSlots, setPlacedSlots] = useState<Set<string>>(new Set());

  // Stage 5: Right-Click Deflector
  const [projectiles, setProjectiles] = useState<MalwareProjectile[]>([]);
  const [deflectedCount, setDeflectedCount] = useState<number>(0);
  const [mobileShieldActive, setMobileShieldActive] = useState<boolean>(false);

  // Stage 6: Matrix Quantum Moving Bugs
  const [movingBugs, setMovingBugs] = useState<MovingBug[]>([]);
  const [bugsEliminated, setBugsEliminated] = useState<number>(0);

  // Stage 7: Mainframe Overclock Clicks
  const [overclockClicks, setOverclockClicks] = useState<number>(0);

  // Arena Ref for relative coordinate calculations
  const arenaRef = useRef<HTMLDivElement>(null);

  // Progressive Sync Gatekeeper (Records already synced milestones to avoid repeated DB writes)
  const syncedMilestonesRef = useRef<Set<Milestone>>(new Set());
  const lastScoreRef = useRef<number>(0);
  const isGameOverRef = useRef<boolean>(false);
  lastScoreRef.current = score;
  isGameOverRef.current = isGameOver;

  // Track combo & accuracy
  const addScore = (points: number, isHit: boolean = true) => {
    setTotalClicks((prev) => prev + 1);
    if (isHit) {
      setAccuracyHits((prev) => prev + 1);
      setCombo((prev) => {
        const next = prev + 1;
        setMaxCombo((m) => Math.max(m, next));
        return next;
      });
      const bonusCombo = Math.min(50, combo * 2);
      setScore((prev) => prev + points + bonusCombo);
    } else {
      setCombo(0);
    }
  };

  // Check and fire milestone DB sync
  const checkMilestoneSync = useCallback(
    (currentProg: number, currentSc: number) => {
      if (!roomData?.roomCode || isGameOverRef.current) return;

      for (const m of MILESTONES) {
        if (currentProg >= m && !syncedMilestonesRef.current.has(m)) {
          syncedMilestonesRef.current.add(m);
          updateDuelProgress(roomData.roomCode, isHost, {
            score: currentSc,
            progress: m,
            currentStageIndex: stage,
          });
        }
      }
    },
    [roomData?.roomCode, isHost, stage]
  );

  // Recalculate global duel progress based on multi-stage advancement
  useEffect(() => {
    let calculatedProg = 0;
    if (stage === 1) {
      // 0% to 15% (5 targets: 3% each)
      calculatedProg = Math.min(15, Math.round((stage1Hits / 5) * 15));
    } else if (stage === 2) {
      // 15% to 30% (5 double-click orbs: 3% each)
      calculatedProg = 15 + Math.min(15, Math.round((stage2Hits / 5) * 15));
    } else if (stage === 3) {
      // 30% to 45% (circuit trace 0-100% -> 15% span)
      calculatedProg = 30 + Math.min(15, Math.round((circuitProgress / 100) * 15));
    } else if (stage === 4) {
      // 45% to 60% (4 hardware parts placed: 3.75% each)
      calculatedProg = 45 + Math.min(15, Math.round((placedSlots.size / 4) * 15));
    } else if (stage === 5) {
      // 60% to 75% (5 malware deflected: 3% each)
      calculatedProg = 60 + Math.min(15, Math.round((deflectedCount / 5) * 15));
    } else if (stage === 6) {
      // 75% to 90% (4 bugs destroyed: 3.75% each)
      calculatedProg = 75 + Math.min(15, Math.round((bugsEliminated / 4) * 15));
    } else if (stage === 7) {
      // 90% to 100% (Overclock 12 rapid clicks)
      if (overclockClicks < 6) {
        calculatedProg = 90 + Math.round((overclockClicks / 6) * 5); // up to 95%
      } else {
        calculatedProg = 95 + Math.round(((overclockClicks - 6) / 6) * 5); // 95% to 100%
      }
    }

    const clamped = Math.min(100, Math.max(progress, calculatedProg));
    setProgress(clamped);
    checkMilestoneSync(clamped, score);

    if (clamped >= 100 && !isGameOver) {
      handleMatchVictory();
    }
  }, [
    stage,
    stage1Hits,
    stage2Hits,
    circuitProgress,
    placedSlots.size,
    deflectedCount,
    bugsEliminated,
    overclockClicks,
    score,
    checkMilestoneSync,
    isGameOver,
    progress,
  ]);

  // Handle Local Victory
  const handleMatchVictory = () => {
    if (isGameOver) return;
    setIsGameOver(true);
    setIsWinner(true);
    setWinnerName(studentName);
    setProgress(100);

    // Final Sync to DB
    if (roomData?.roomCode) {
      updateDuelProgress(
        roomData.roomCode,
        isHost,
        {
          score: score + 500,
          progress: 100,
          finishedAt: Date.now(),
        },
        isHost ? roomData.host.id : roomData.guest?.id,
        studentName
      );
    }

    recordStudentDuelResult({
      mode: 'mouse_duel',
      won: true,
      score: score + 500,
    });

    onFinish?.(score + 500, true);
  };

  // Handle Opponent Victory
  const handleOpponentVictory = (oppName: string) => {
    if (isGameOver) return;
    setIsGameOver(true);
    setIsWinner(false);
    setWinnerName(oppName);

    recordStudentDuelResult({
      mode: 'mouse_duel',
      won: false,
      score: score,
    });

    onFinish?.(score, false);
  };

  // Opponent Live Sync / Solo AI Bot Simulation
  useEffect(() => {
    if (roomData) {
      const opp = isHost ? roomData.guest : roomData.host;
      if (opp) {
        setOpponentName(opp.name || 'Oponent');
        setOpponentAvatar(opp.avatar || '🚀');
        setOpponentScore(opp.score || 0);
        setOpponentProgress(opp.progress || 0);

        if (opp.progress >= 100 && !isGameOver) {
          handleOpponentVictory(opp.name);
        }
      }
    } else {
      // Solo AI Bot Simulation (balanced ~45 seconds to finish)
      if (isGameOver) return;
      const botInterval = setInterval(() => {
        setOpponentProgress((prev) => {
          const gain = Math.floor(Math.random() * 4) + 2; // 2-5% per tick
          const next = Math.min(100, prev + gain);
          setOpponentScore((s) => s + gain * 15);
          if (next >= 100 && !isGameOver) {
            handleOpponentVictory('Botul Antrenor TIC 🤖');
          }
          return next;
        });
      }, 1400);

      return () => clearInterval(botInterval);
    }
  }, [roomData, isHost, isGameOver]);

  // Match Stopwatch
  useEffect(() => {
    if (isGameOver) return;
    const timer = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameOver]);

  // ==================== STAGE 1: PRECISION TARGETS SPAWNER ====================
  useEffect(() => {
    if (stage !== 1 || isGameOver) return;

    const spawnTarget = () => {
      setTargets((prev) => {
        if (prev.length >= 3) return prev;
        const isGold = Math.random() < 0.3;
        const isMicro = Math.random() < 0.25;
        const newTarget: TargetItem = {
          id: 't_' + Math.random().toString(36).substring(2, 8),
          x: Math.floor(Math.random() * 75) + 10,
          y: Math.floor(Math.random() * 65) + 15,
          size: isMicro ? 36 : isGold ? 48 : 56,
          type: isGold ? 'bonus_gold' : isMicro ? 'micro_snipe' : 'standard',
          points: isGold ? 150 : isMicro ? 200 : 80,
          clicksNeeded: 1,
          clicksDone: 0,
          spawnTime: Date.now(),
          lifetimeMs: 3200,
        };
        return [...prev, newTarget];
      });
    };

    spawnTarget();
    const interval = setInterval(spawnTarget, 900);
    return () => clearInterval(interval);
  }, [stage, isGameOver]);

  const handleTargetClick = (target: TargetItem, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    addScore(target.points, true);
    setTargets((prev) => prev.filter((t) => t.id !== target.id));
    setStage1Hits((h) => {
      const next = h + 1;
      if (next >= 5) {
        setStage(2);
      }
      return next;
    });
  };

  // ==================== STAGE 2: DOUBLE CLICK RAPID ORBS ====================
  useEffect(() => {
    if (stage !== 2 || isGameOver) return;

    const spawnDoubleTarget = () => {
      setTargets((prev) => {
        if (prev.length >= 2) return prev;
        const newTarget: TargetItem = {
          id: 'd_' + Math.random().toString(36).substring(2, 8),
          x: Math.floor(Math.random() * 70) + 12,
          y: Math.floor(Math.random() * 60) + 20,
          size: 64,
          type: 'rapid_double',
          points: 120,
          clicksNeeded: 2,
          clicksDone: 0,
          spawnTime: Date.now(),
          lifetimeMs: 4000,
        };
        return [...prev, newTarget];
      });
    };

    spawnDoubleTarget();
    const interval = setInterval(spawnDoubleTarget, 1200);
    return () => clearInterval(interval);
  }, [stage, isGameOver]);

  const handleDoubleTargetClick = (target: TargetItem, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const nextDone = target.clicksDone + 1;
    if (nextDone >= target.clicksNeeded) {
      addScore(target.points, true);
      setTargets((prev) => prev.filter((t) => t.id !== target.id));
      setStage2Hits((h) => {
        const next = h + 1;
        if (next >= 5) {
          setStage(3);
        }
        return next;
      });
    } else {
      setTargets((prev) =>
        prev.map((t) => (t.id === target.id ? { ...t, clicksDone: nextDone } : t))
      );
    }
  };

  // ==================== STAGE 3: CIRCUIT LASER TRACE ====================
  const handleCircuitHover = (pct: number) => {
    if (stage !== 3 || isGameOver) return;
    setIsTracingCircuit(true);
    setCircuitOffTrack(false);
    setCircuitProgress((prev) => {
      if (pct > prev) {
        const next = Math.min(100, pct);
        if (next >= 100) {
          addScore(300, true);
          setTimeout(() => setStage(4), 400);
        }
        return next;
      }
      return prev;
    });
  };

  // ==================== STAGE 4: DRAG & DROP HARDWARE SOCKETS ====================
  const HARDWARE_PARTS: DragComponentItem[] = [
    { id: 'part_cpu', name: 'Microprocesor CPU 8-Core', slot: 'cpu', slotName: 'Soclu CPU LGA', icon: '🧠', color: 'border-amber-400 text-amber-300' },
    { id: 'part_ram', name: 'Modul RAM 16GB DDR5', slot: 'ram', slotName: 'Slot Memorie RAM', icon: '⚡', color: 'border-teal-400 text-teal-300' },
    { id: 'part_ssd', name: 'SSD NVMe PCIe 4.0 1TB', slot: 'ssd', slotName: 'Slot M.2 NVMe', icon: '💾', color: 'border-cyan-400 text-cyan-300' },
    { id: 'part_usb', name: 'Port USB-C Thunderbolt', slot: 'usb', slotName: 'Conector USB-C', icon: '🔌', color: 'border-purple-400 text-purple-300' },
  ];

  const handleDropSlot = (slotType: string) => {
    if (!draggedItem || stage !== 4 || isGameOver) return;
    if (draggedItem.slot === slotType && !placedSlots.has(slotType)) {
      addScore(150, true);
      const nextSlots = new Set(placedSlots);
      nextSlots.add(slotType);
      setPlacedSlots(nextSlots);
      setDraggedItem(null);

      if (nextSlots.size >= 4) {
        setTimeout(() => setStage(5), 400);
      }
    } else {
      setCombo(0);
      setDraggedItem(null);
    }
  };

  // ==================== STAGE 5: RIGHT-CLICK DEFLECTOR ====================
  useEffect(() => {
    if (stage !== 5 || isGameOver) return;

    const spawnMalware = () => {
      setProjectiles((prev) => {
        if (prev.length >= 3) return prev;
        const threats = [
          { name: 'Trojan.exe', icon: '👾' },
          { name: 'Phishing.link', icon: '🎣' },
          { name: 'Ransomware', icon: '🔒' },
          { name: 'Adware.bot', icon: '⚡' },
        ];
        const threat = threats[Math.floor(Math.random() * threats.length)];
        const newProj: MalwareProjectile = {
          id: 'p_' + Math.random().toString(36).substring(2, 8),
          x: Math.floor(Math.random() * 70) + 15,
          y: Math.floor(Math.random() * 65) + 15,
          targetX: 50,
          targetY: 50,
          threatName: threat.name,
          icon: threat.icon,
          speed: 1,
        };
        return [...prev, newProj];
      });
    };

    spawnMalware();
    const interval = setInterval(spawnMalware, 1100);
    return () => clearInterval(interval);
  }, [stage, isGameOver]);

  const handleDeflect = (projId: string, e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    addScore(180, true);
    setProjectiles((prev) => prev.filter((p) => p.id !== projId));
    setDeflectedCount((c) => {
      const next = c + 1;
      if (next >= 5) {
        setStage(6);
      }
      return next;
    });
  };

  // ==================== STAGE 6: MATRIX QUANTUM MOVING BUGS ====================
  useEffect(() => {
    if (stage !== 6 || isGameOver) return;

    // Initialize 4 bouncing quantum bugs
    const initialBugs: MovingBug[] = [
      { id: 'b1', x: 20, y: 30, vx: 1.2, vy: 0.9, size: 52, color: 'border-emerald-400 bg-emerald-950/80 text-emerald-300' },
      { id: 'b2', x: 70, y: 40, vx: -1.0, vy: 1.3, size: 48, color: 'border-cyan-400 bg-cyan-950/80 text-cyan-300' },
      { id: 'b3', x: 35, y: 70, vx: 1.4, vy: -1.1, size: 54, color: 'border-purple-400 bg-purple-950/80 text-purple-300' },
      { id: 'b4', x: 60, y: 20, vx: -1.3, vy: -0.8, size: 46, color: 'border-rose-400 bg-rose-950/80 text-rose-300' },
    ];
    setMovingBugs(initialBugs);

    const animation = setInterval(() => {
      setMovingBugs((prevBugs) =>
        prevBugs.map((bug) => {
          let nx = bug.x + bug.vx;
          let ny = bug.y + bug.vy;
          let nvx = bug.vx;
          let nvy = bug.vy;

          if (nx <= 5 || nx >= 85) nvx = -nvx;
          if (ny <= 10 || ny >= 75) nvy = -nvy;

          return { ...bug, x: nx, y: ny, vx: nvx, vy: nvy };
        })
      );
    }, 40);

    return () => clearInterval(animation);
  }, [stage, isGameOver]);

  const handleBugHit = (bugId: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    addScore(220, true);
    setMovingBugs((prev) => prev.filter((b) => b.id !== bugId));
    setBugsEliminated((b) => {
      const next = b + 1;
      if (next >= 4) {
        setStage(7);
      }
      return next;
    });
  };

  // ==================== STAGE 7: OVERCLOCK FINAL BURST ====================
  const handleOverclockClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    addScore(50, true);
    setOverclockClicks((c) => {
      const next = c + 1;
      if (next >= 12) {
        handleMatchVictory();
      }
      return next;
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 select-none font-sans">
      {/* Top Duel Match Header Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/90 to-slate-900 border border-indigo-500/40 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400/40">
            <MousePointer className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white font-heading tracking-tight flex items-center gap-1.5">
                <span>CYBER CURSOR CLASH</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-400/40">
                  DUEL 1v1
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-300">
              {lang === 'en'
                ? 'Agility & Precision Arena • Progressive Cloud Sync (15 • 30 • 45 • 60 • 75 • 90 • 95 • 100%)'
                : 'Arena de Agilitate & Reflex • Sincronizare Cloud Progresivă (15 • 30 • 45 • 60 • 75 • 90 • 95 • 100%)'}
            </p>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-[9px] font-bold text-slate-400 uppercase">Combo</div>
            <div className="text-sm sm:text-base font-black text-amber-400 font-mono">
              x{combo} {combo >= 5 && '🔥'}
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-[9px] font-bold text-slate-400 uppercase">Timp</div>
            <div className="text-sm sm:text-base font-black text-cyan-300 font-mono">
              {elapsedSeconds}s
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-indigo-500/40 text-center">
            <div className="text-[9px] font-bold text-indigo-300 uppercase">Scor</div>
            <div className="text-base sm:text-lg font-black text-white font-mono">{score}</div>
          </div>
        </div>
      </div>

      {/* Dual Progress Race Track (Me vs Opponent) */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        {/* Track 1: Player (Me) */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-cyan-300 flex items-center gap-1.5">
              <span>{studentAvatar}</span> {studentName} <span className="text-slate-400 font-normal">(Tu)</span>
            </span>
            <span className="font-mono text-cyan-200">{progress}%</span>
          </div>
          <div className="h-5 w-full rounded-full bg-slate-950 p-1 border border-cyan-500/40 relative overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 via-cyan-400 to-indigo-400 transition-all duration-300 flex items-center justify-end pr-1 shadow-sm"
              style={{ width: `${Math.max(4, progress)}%` }}
            >
              <span className="text-[10px]">🎯</span>
            </div>
          </div>
        </div>

        {/* Track 2: Opponent */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-rose-300 flex items-center gap-1.5">
              <span>{opponentAvatar}</span> {opponentName} <span className="text-slate-400 font-normal">(Rival)</span>
            </span>
            <span className="font-mono text-rose-200">{opponentProgress}%</span>
          </div>
          <div className="h-5 w-full rounded-full bg-slate-950 p-1 border border-rose-500/40 relative overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-rose-500 to-amber-400 transition-all duration-300 flex items-center justify-end pr-1 shadow-sm"
              style={{ width: `${Math.max(4, opponentProgress)}%` }}
            >
              <span className="text-[10px]">⚡</span>
            </div>
          </div>
        </div>

        {/* Milestone Indicator Badges */}
        <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-500">
          <span>START</span>
          {MILESTONES.map((m) => (
            <span
              key={m}
              className={`px-1.5 py-0.5 rounded transition ${
                progress >= m
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                  : 'text-slate-600'
              }`}
            >
              {m}%
            </span>
          ))}
        </div>
      </div>

      {/* Main Interactive Agility Arena */}
      <div
        ref={arenaRef}
        onContextMenu={(e) => e.preventDefault()}
        className="relative w-full h-[420px] sm:h-[460px] rounded-3xl bg-slate-950 border-2 border-cyan-500/30 shadow-2xl overflow-hidden cursor-crosshair select-none"
        style={{ touchAction: 'none' }}
      >
        {/* Background Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25 pointer-events-none" />

        {/* Current Stage Instruction Header Banner */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-400/50 backdrop-blur-md text-xs font-bold text-slate-200 flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>
            {stage === 1 && (lang === 'en' ? 'Phase 1 (15%): Click Glowing Precision Targets!' : 'Faza 1 (15%): Lovește Țintele de Precizie!')}
            {stage === 2 && (lang === 'en' ? 'Phase 2 (30%): Double-Click Rapid Energy Cores!' : 'Faza 2 (30%): Dublu-Click Rapid pe Nodurile de Energie!')}
            {stage === 3 && (lang === 'en' ? 'Phase 3 (45%): Trace the Laser Circuit Line!' : 'Faza 3 (45%): Urmărește Traseul Laser cu Cursorul!')}
            {stage === 4 && (lang === 'en' ? 'Phase 4 (60%): Drag & Drop Hardware to Sockets!' : 'Faza 4 (60%): Trage Componentele în Soclurile Corecte!')}
            {stage === 5 && (lang === 'en' ? 'Phase 5 (75%): Right-Click Deflect Malware!' : 'Faza 5 (75%): Click Dreapta pe Viruși pentru a-i Distruge!')}
            {stage === 6 && (lang === 'en' ? 'Phase 6 (90%): Snipe Moving Quantum Bugs!' : 'Faza 6 (90%): Vânează Bug-urile Cuantice Mobile!')}
            {stage === 7 && (lang === 'en' ? 'Phase 7 (100%): Hyper-Click Overclock Mainframe!' : 'Faza 7 (100%): Click Rapid pentru Suprasolicitarea Sistemului!')}
          </span>
        </div>

        {/* ================= STAGE 1: PRECISION TARGETS ================= */}
        {stage === 1 && (
          <div className="relative w-full h-full">
            {targets.map((t) => (
              <button
                key={t.id}
                onClick={(e) => handleTargetClick(t, e)}
                onTouchStart={(e) => handleTargetClick(t, e)}
                style={{
                  left: `${t.x}%`,
                  top: `${t.y}%`,
                  width: `${t.size}px`,
                  height: `${t.size}px`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 flex items-center justify-center transition-transform transform active:scale-90 animate-scale-up cursor-pointer shadow-xl ${
                  t.type === 'bonus_gold'
                    ? 'bg-amber-500/30 border-amber-400 text-amber-300 ring-4 ring-amber-500/40 shadow-amber-500/50 animate-pulse'
                    : t.type === 'micro_snipe'
                    ? 'bg-rose-500/30 border-rose-400 text-rose-300 ring-2 ring-rose-500/50 shadow-rose-500/40'
                    : 'bg-cyan-500/30 border-cyan-400 text-cyan-200 ring-2 ring-cyan-500/40 shadow-cyan-500/40'
                }`}
              >
                <Crosshair className="w-5 h-5 animate-spin" />
              </button>
            ))}
            <div className="absolute bottom-3 left-4 text-xs font-mono text-slate-400">
              Ținte atinse: {stage1Hits} / 5
            </div>
          </div>
        )}

        {/* ================= STAGE 2: DOUBLE CLICK ORBS ================= */}
        {stage === 2 && (
          <div className="relative w-full h-full">
            {targets.map((t) => (
              <button
                key={t.id}
                onDoubleClick={(e) => handleDoubleTargetClick(t, e)}
                onClick={(e) => handleDoubleTargetClick(t, e)} // Also supports rapid click for touch
                style={{
                  left: `${t.x}%`,
                  top: `${t.y}%`,
                  width: `${t.size}px`,
                  height: `${t.size}px`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-indigo-600/40 border-2 border-indigo-400 text-white flex flex-col items-center justify-center p-1 shadow-2xl ring-4 ring-indigo-500/40 animate-pulse active:scale-95 cursor-pointer"
              >
                <Zap className="w-5 h-5 text-amber-300" />
                <span className="text-[10px] font-black font-mono">
                  {t.clicksDone === 0 ? '2X CLICK' : '1X CLICK!'}
                </span>
              </button>
            ))}
            <div className="absolute bottom-3 left-4 text-xs font-mono text-slate-400">
              Noduri dublu-click absorbite: {stage2Hits} / 5
            </div>
          </div>
        )}

        {/* ================= STAGE 3: CIRCUIT LASER TRACE ================= */}
        {stage === 3 && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
            <div className="relative w-full max-w-xl h-36 bg-slate-900/90 rounded-2xl border-2 border-cyan-500/40 p-4 flex items-center justify-between overflow-hidden">
              {/* Glowing Trace Guide Line */}
              <div
                className="absolute left-8 right-8 h-4 rounded-full bg-slate-950 border border-cyan-500/50 overflow-hidden"
              >
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 transition-all duration-100"
                  style={{ width: `${circuitProgress}%` }}
                />
              </div>

              {/* Interactive Hover Nodes along the Wire */}
              {[10, 30, 50, 70, 90, 100].map((nodePct, i) => (
                <div
                  key={i}
                  onMouseEnter={() => handleCircuitHover(nodePct)}
                  onTouchStart={() => handleCircuitHover(nodePct)}
                  className={`relative z-10 w-10 h-10 rounded-xl border-2 flex items-center justify-center font-mono text-xs font-black transition-all cursor-pointer ${
                    circuitProgress >= nodePct
                      ? 'bg-emerald-500 border-emerald-300 text-slate-950 shadow-lg shadow-emerald-500/50 scale-110'
                      : 'bg-slate-800 border-cyan-400 text-cyan-300 hover:bg-cyan-500/30'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-cyan-300 font-mono">
                {lang === 'en'
                  ? 'Move cursor or finger smoothly over nodes 1 ➔ 6 without stopping!'
                  : 'Treci cu mouse-ul sau degetul succesiv peste nodurile 1 ➔ 6!'}
              </p>
            </div>
          </div>
        )}

        {/* ================= STAGE 4: DRAG & DROP HARDWARE ================= */}
        {stage === 4 && (
          <div className="relative w-full h-full p-4 sm:p-6 flex flex-col justify-between">
            {/* Target Motherboard Sockets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {HARDWARE_PARTS.map((part) => {
                const isPlaced = placedSlots.has(part.slot);
                return (
                  <div
                    key={part.slot}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDropSlot(part.slot)}
                    onClick={() => draggedItem && handleDropSlot(part.slot)}
                    className={`p-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center min-h-[95px] ${
                      isPlaced
                        ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                        : 'bg-slate-900/80 border-dashed border-slate-700 text-slate-400 hover:border-cyan-400'
                    }`}
                  >
                    <span className="text-2xl mb-1">{isPlaced ? '✅' : part.icon}</span>
                    <span className="text-xs font-bold">{part.slotName}</span>
                    <span className="text-[10px] opacity-70">
                      {isPlaced ? 'Montat cu succes' : 'Plasează componenta'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Draggable Component Inventory */}
            <div className="pt-4 border-t border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 mb-2 uppercase font-mono">
                Componente de montat (Trage sau apasă pe componentă, apoi pe soclu):
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {HARDWARE_PARTS.filter((p) => !placedSlots.has(p.slot)).map((part) => (
                  <div
                    key={part.id}
                    draggable
                    onDragStart={() => setDraggedItem(part)}
                    onClick={() => setDraggedItem(part)}
                    className={`px-3 py-2 rounded-xl bg-slate-900 border-2 ${part.color} shadow-lg flex items-center gap-2 cursor-grab active:cursor-grabbing hover:scale-105 transition ${
                      draggedItem?.id === part.id ? 'ring-2 ring-amber-400 scale-105 bg-slate-800' : ''
                    }`}
                  >
                    <span className="text-xl">{part.icon}</span>
                    <span className="text-xs font-bold text-slate-200">{part.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= STAGE 5: RIGHT-CLICK DEFLECTOR ================= */}
        {stage === 5 && (
          <div className="relative w-full h-full">
            {projectiles.map((p) => (
              <button
                key={p.id}
                onContextMenu={(e) => handleDeflect(p.id, e)}
                onClick={(e) => {
                  if (mobileShieldActive) {
                    handleDeflect(p.id, e);
                  }
                }}
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 px-3 py-2 rounded-2xl bg-rose-950 border-2 border-rose-400 text-rose-200 flex items-center gap-2 shadow-2xl shadow-rose-500/50 animate-bounce active:scale-95 cursor-pointer"
              >
                <span className="text-xl">{p.icon}</span>
                <div className="text-left">
                  <div className="text-xs font-black">{p.threatName}</div>
                  <div className="text-[9px] text-amber-300 font-mono">CLICK DREAPTA 🛡️</div>
                </div>
              </button>
            ))}

            {/* Mobile Shield Toggle Assistance */}
            <div className="absolute bottom-3 right-4 sm:hidden">
              <button
                onClick={() => setMobileShieldActive((prev) => !prev)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-lg ${
                  mobileShieldActive
                    ? 'bg-rose-500 text-white border-rose-400 ring-2 ring-rose-300'
                    : 'bg-slate-900 text-slate-300 border-slate-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{mobileShieldActive ? 'Scut Activ (Atinge Ținte)' : 'Activează Scut Touch'}</span>
              </button>
            </div>

            <div className="absolute bottom-3 left-4 text-xs font-mono text-slate-400">
              Amenințări distruse: {deflectedCount} / 5
            </div>
          </div>
        )}

        {/* ================= STAGE 6: QUANTUM MOVING BUGS ================= */}
        {stage === 6 && (
          <div className="relative w-full h-full">
            {movingBugs.map((bug) => (
              <button
                key={bug.id}
                onClick={(e) => handleBugHit(bug.id, e)}
                onTouchStart={(e) => handleBugHit(bug.id, e)}
                style={{
                  left: `${bug.x}%`,
                  top: `${bug.y}%`,
                  width: `${bug.size}px`,
                  height: `${bug.size}px`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 flex items-center justify-center transition-all shadow-xl active:scale-90 cursor-crosshair ${bug.color}`}
              >
                <span className="text-2xl animate-spin">👾</span>
              </button>
            ))}
            <div className="absolute bottom-3 left-4 text-xs font-mono text-slate-400">
              Bug-uri eliminate: {bugsEliminated} / 4
            </div>
          </div>
        )}

        {/* ================= STAGE 7: OVERCLOCK FINAL BURST ================= */}
        {stage === 7 && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
            <button
              onClick={handleOverclockClick}
              onTouchStart={handleOverclockClick}
              className="group relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-rose-600 via-amber-500 to-cyan-400 border-4 border-white p-2 shadow-[0_0_50px_rgba(239,68,68,0.6)] animate-pulse flex flex-col items-center justify-center text-white active:scale-95 cursor-pointer"
            >
              <Gauge className="w-12 h-12 text-white animate-spin" />
              <span className="text-sm font-black tracking-wider uppercase mt-1">OVERCLOCK!</span>
              <span className="text-xs font-mono font-bold bg-slate-950/60 px-2 py-0.5 rounded-full mt-1">
                {overclockClicks} / 12 Clicks
              </span>
            </button>
            <p className="mt-4 text-xs font-mono text-amber-300 font-bold animate-bounce">
              ⚡ DĂ CLICK CÂT MAI REPEDE PENTRU A CÂȘTIGA DUELUL! ⚡
            </p>
          </div>
        )}
      </div>

      {/* Game Over Result Modal */}
      {isGameOver && (
        <div className="p-6 rounded-3xl bg-slate-900 border-2 border-indigo-500/50 shadow-2xl text-center space-y-4 animate-scale-up">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400 to-rose-500 mx-auto flex items-center justify-center text-3xl shadow-xl shadow-amber-500/30 ring-4 ring-amber-400/30">
            {isWinner ? '👑' : '🥈'}
          </div>

          <div>
            <h3 className="text-2xl font-black text-white font-heading">
              {isWinner
                ? lang === 'en'
                  ? 'VICTORY! CYBER MOUSE CHAMPION! 🏆'
                  : 'VICTORIE! MAESTRU AL MOUSE-ULUI! 🏆'
                : lang === 'en'
                ? 'MATCH FINISHED!'
                : 'MECI ÎNCHEIAT!'}
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              Câștigătorul meciului:{' '}
              <strong className="text-amber-300 font-bold">{winnerName}</strong>
            </p>
          </div>

          {/* Match Recap Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto text-center">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Scor Final</div>
              <div className="text-lg font-black text-amber-400 font-mono">{score} pts</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Max Combo</div>
              <div className="text-lg font-black text-teal-300 font-mono">x{maxCombo}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Precizie</div>
              <div className="text-lg font-black text-cyan-300 font-mono">
                {totalClicks > 0 ? Math.round((accuracyHits / totalClicks) * 100) : 100}%
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Timp</div>
              <div className="text-lg font-black text-indigo-300 font-mono">{elapsedSeconds}s</div>
            </div>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg transition active:scale-95 cursor-pointer"
              >
                {lang === 'en' ? 'Back to Duel Lobby' : 'Înapoi la Arena de Duel'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
