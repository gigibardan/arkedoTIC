import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
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
  Cpu,
  Radio,
  Lock,
  Unlock,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  MousePointer2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { DuelRoomData, DuelPlayer, updateDuelProgress } from '../../lib/duelService';
import { recordStudentDuelResult } from '../../lib/studentAuthService';

// Progressive milestone thresholds for Firebase quota protection
const MILESTONES = [16, 33, 50, 66, 83, 100] as const;

interface OsuNode {
  id: string;
  order: number;
  x: number; // percentage
  y: number; // percentage
  radius: number; // px
  type: 'click' | 'hold';
  holdDurationMs?: number;
  holdProgress?: number; // 0 to 1
  hit: boolean;
  spawnTime: number;
}

interface TriageThreatItem {
  id: string;
  x: number;
  y: number;
  type: 'data' | 'archive' | 'trojan';
  labelRo: string;
  labelEn: string;
  clicksNeeded: number;
  clicksDone: number;
  spawnTime: number;
  expiresInMs: number;
}

interface KineticOrb {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  captured: boolean;
}

interface FlickTarget {
  id: string;
  x: number;
  y: number;
  label: string;
  spawnTime: number;
  expiresInMs: number;
}

interface CyberPrecisionDuelGameProps {
  roomData?: DuelRoomData | null;
  isHost?: boolean;
  studentName?: string;
  studentAvatar?: string;
  onFinish?: (score: number, isWinner: boolean) => void;
  onBack?: () => void;
}

export const CyberPrecisionDuelGame: React.FC<CyberPrecisionDuelGameProps> = ({
  roomData,
  isHost = true,
  studentName = 'Campion TIC',
  studentAvatar = '⚡',
  onFinish,
  onBack,
}) => {
  const { lang } = useLanguage();

  // Arena & Gameplay State
  const [stage, setStage] = useState<number>(1); // 1 to 6
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<{ text: string; color: string } | null>(null);
  const [hasFinishedLocal, setHasFinishedLocal] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Screen lock ref
  const arenaRef = useRef<HTMLDivElement>(null);
  const reachedMilestonesRef = useRef<Set<number>>(new Set());

  // Mouse / Touch Tracking
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [shieldActiveMobile, setShieldActiveMobile] = useState<boolean>(false);

  // ==========================================
  // STAGE 1: OSU! NODE STRIKE & HOLD TO CHARGE
  // ==========================================
  const [nodes, setNodes] = useState<OsuNode[]>([]);
  const [activeNodeIdx, setActiveNodeIdx] = useState<number>(0);
  const holdingNodeRef = useRef<{ id: string; startTime: number } | null>(null);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ==========================================
  // STAGE 2: FIBER-OPTIC LASER TRACING
  // ==========================================
  const [traceProgress, setTraceProgress] = useState<number>(0); // 0 to 100%
  const [traceT, setTraceT] = useState<number>(0); // 0 to 1 along curve
  const [isLaserLocked, setIsLaserLocked] = useState<boolean>(false);

  // ==========================================
  // STAGE 3: MALWARE & DATA TRIAGE (LEFT / RIGHT / DBL)
  // ==========================================
  const [triageItems, setTriageItems] = useState<TriageThreatItem[]>([]);
  const [triageClearedCount, setTriageClearedCount] = useState<number>(0);

  // ==========================================
  // STAGE 4: KINETIC DEFLECTOR ORBS
  // ==========================================
  const [orbs, setOrbs] = useState<KineticOrb[]>([]);
  const [capturedOrbsCount, setCapturedOrbsCount] = useState<number>(0);

  // ==========================================
  // STAGE 5: FLICK-SHOT MATRIX
  // ==========================================
  const [flickTargets, setFlickTargets] = useState<FlickTarget[]>([]);
  const [flickHitsCount, setFlickHitsCount] = useState<number>(0);

  // ==========================================
  // STAGE 6: OVERCLOCK CORE SURGE (CLIMAX)
  // ==========================================
  const [pulseRadius, setPulseRadius] = useState<number>(100); // 100% down to 20%
  const [surgeBeatsRemaining, setSurgeBeatsRemaining] = useState<number>(10);

  // Opponent tracking
  const me: DuelPlayer | null = roomData ? (isHost ? roomData.host : roomData.guest || null) : null;
  const opponent: DuelPlayer | null = roomData ? (isHost ? roomData.guest || null : roomData.host) : null;
  const isOpponentFinished = opponent ? opponent.progress >= 100 : false;

  // Sound feedback trigger
  const triggerFeedback = (text: string, color: string = 'text-emerald-400') => {
    setFeedbackText({ text, color });
    setTimeout(() => setFeedbackText(null), 900);
  };

  // Safe Progress sync to Firestore (Milestones only)
  const syncProgressToDb = useCallback(
    (progressPct: number, currentScore: number) => {
      if (!roomData?.roomCode) return;

      // Find matching milestone
      for (const m of MILESTONES) {
        if (progressPct >= m && !reachedMilestonesRef.current.has(m)) {
          reachedMilestonesRef.current.add(m);
          updateDuelProgress(roomData.roomCode, isHost, {
            progress: m,
            score: currentScore,
            currentStageIndex: stage
          });
          break;
        }
      }
    },
    [roomData?.roomCode, isHost, stage]
  );

  // Combo handling
  const registerHit = (points: number, label: string = 'PERFECT!') => {
    setCombo(prev => {
      const nextCombo = prev + 1;
      if (nextCombo > maxCombo) setMaxCombo(nextCombo);
      return nextCombo;
    });

    const comboMultiplier = combo >= 10 ? 1.5 : combo >= 5 ? 1.25 : 1.0;
    const gained = Math.round(points * comboMultiplier);
    setScore(prev => {
      const newScore = prev + gained;
      return newScore;
    });

    triggerFeedback(`${label} +${gained}`, 'text-amber-300');
    sounds.playCorrect();
  };

  const registerMiss = (penalty: number = 2) => {
    setCombo(0);
    setScore(prev => Math.max(0, prev - penalty));
    triggerFeedback(lang === 'en' ? 'MISS! -2' : 'RATAT! -2', 'text-rose-400');
    sounds.playError();
  };

  // Prevent scroll globally during active match
  useEffect(() => {
    const handleWheelBlock = (e: WheelEvent) => {
      e.preventDefault();
    };

    const handleTouchMoveBlock = (e: TouchEvent) => {
      // If inside arena, prevent scrolling
      if (arenaRef.current && arenaRef.current.contains(e.target as Node)) {
        if (e.cancelable) e.preventDefault();
      }
    };

    window.addEventListener('wheel', handleWheelBlock, { passive: false });
    window.addEventListener('touchmove', handleTouchMoveBlock, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheelBlock);
      window.removeEventListener('touchmove', handleTouchMoveBlock);
    };
  }, []);

  // Initialize start time
  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  // =========================================================================
  // STAGE 1 SETUP: OSU! NODES
  // =========================================================================
  const initStage1 = useCallback(() => {
    const stageNodes: OsuNode[] = [
      { id: 'n1', order: 1, x: 25, y: 35, radius: 28, type: 'click', hit: false, spawnTime: Date.now() },
      { id: 'n2', order: 2, x: 45, y: 25, radius: 28, type: 'click', hit: false, spawnTime: Date.now() },
      { id: 'n3', order: 3, x: 75, y: 40, radius: 34, type: 'hold', holdDurationMs: 600, holdProgress: 0, hit: false, spawnTime: Date.now() },
      { id: 'n4', order: 4, x: 60, y: 70, radius: 28, type: 'click', hit: false, spawnTime: Date.now() },
      { id: 'n5', order: 5, x: 30, y: 65, radius: 34, type: 'hold', holdDurationMs: 700, holdProgress: 0, hit: false, spawnTime: Date.now() },
      { id: 'n6', order: 6, x: 50, y: 50, radius: 32, type: 'click', hit: false, spawnTime: Date.now() },
    ];
    setNodes(stageNodes);
    setActiveNodeIdx(0);
  }, []);

  // =========================================================================
  // STAGE 2 SETUP: FIBER LASER TRACE
  // =========================================================================
  const initStage2 = useCallback(() => {
    setTraceProgress(0);
    setTraceT(0);
    setIsLaserLocked(false);
  }, []);

  // =========================================================================
  // STAGE 3 SETUP: MALWARE TRIAGE
  // =========================================================================
  const initStage3 = useCallback(() => {
    const threats: TriageThreatItem[] = [
      { id: 't1', x: 20, y: 30, type: 'data', labelRo: 'Pachet HTTP 200', labelEn: 'HTTP 200 Packet', clicksNeeded: 1, clicksDone: 0, spawnTime: Date.now(), expiresInMs: 9000 },
      { id: 't2', x: 70, y: 25, type: 'trojan', labelRo: 'Troian .exe', labelEn: 'Trojan .exe', clicksNeeded: 1, clicksDone: 0, spawnTime: Date.now(), expiresInMs: 9000 },
      { id: 't3', x: 40, y: 65, type: 'archive', labelRo: 'Arhivă Criptată .zip', labelEn: 'Encrypted Zip Archive', clicksNeeded: 2, clicksDone: 0, spawnTime: Date.now(), expiresInMs: 9000 },
      { id: 't4', x: 80, y: 70, type: 'data', labelRo: 'Pachet DNS 53', labelEn: 'DNS Port 53 Packet', clicksNeeded: 1, clicksDone: 0, spawnTime: Date.now(), expiresInMs: 9000 },
      { id: 't5', x: 25, y: 75, type: 'trojan', labelRo: 'Ransomware Lock', labelEn: 'Ransomware Lock', clicksNeeded: 1, clicksDone: 0, spawnTime: Date.now(), expiresInMs: 9000 },
      { id: 't6', x: 55, y: 35, type: 'archive', labelRo: 'Backup Bază de Date', labelEn: 'Database Backup', clicksNeeded: 2, clicksDone: 0, spawnTime: Date.now(), expiresInMs: 9000 },
    ];
    setTriageItems(threats);
    setTriageClearedCount(0);
  }, []);

  // =========================================================================
  // STAGE 4 SETUP: KINETIC ORBS
  // =========================================================================
  const initStage4 = useCallback(() => {
    const kinetic: KineticOrb[] = [
      { id: 'o1', x: 25, y: 30, vx: 0.7, vy: 0.9, color: 'from-cyan-400 to-blue-600', captured: false },
      { id: 'o2', x: 65, y: 40, vx: -0.8, vy: 0.6, color: 'from-emerald-400 to-teal-600', captured: false },
      { id: 'o3', x: 45, y: 60, vx: 0.6, vy: -0.7, color: 'from-amber-400 to-rose-600', captured: false },
      { id: 'o4', x: 75, y: 70, vx: -0.9, vy: -0.8, color: 'from-purple-400 to-pink-600', captured: false },
    ];
    setOrbs(kinetic);
    setCapturedOrbsCount(0);
  }, []);

  // =========================================================================
  // STAGE 5 SETUP: FLICK-SHOT TARGETS
  // =========================================================================
  const spawnFlickTarget = useCallback(() => {
    const id = `flick_${Date.now()}_${Math.random()}`;
    const x = Math.floor(Math.random() * 70) + 15;
    const y = Math.floor(Math.random() * 60) + 20;
    const labels = ['0x7F', '0xA4', 'PORT_443', 'CPU_TMR', 'MEM_01', 'STACK_PTR'];
    const label = labels[Math.floor(Math.random() * labels.length)];
    setFlickTargets([{ id, x, y, label, spawnTime: Date.now(), expiresInMs: 1400 }]);
  }, []);

  // Stage change trigger
  useEffect(() => {
    if (stage === 1) initStage1();
    if (stage === 2) initStage2();
    if (stage === 3) initStage3();
    if (stage === 4) initStage4();
    if (stage === 5) {
      setFlickHitsCount(0);
      spawnFlickTarget();
    }
    if (stage === 6) {
      setPulseRadius(100);
      setSurgeBeatsRemaining(10);
    }
  }, [stage, initStage1, initStage2, initStage3, initStage4, spawnFlickTarget]);

  // Stage 2: Laser Animation Loop
  useEffect(() => {
    if (stage !== 2) return;

    const interval = setInterval(() => {
      setTraceT(prev => {
        const next = (prev + 0.007) % 1.0;
        return next;
      });

      // Compute beam position on sinusoidal curve:
      // x: 15% to 85%, y: 50% + sin(x) * 25%
      const beamX = 15 + traceT * 70;
      const beamY = 50 + Math.sin(traceT * Math.PI * 4) * 22;

      // Distance from cursor to beam
      const dx = cursorPos.x - beamX;
      const dy = cursorPos.y - beamY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 10) {
        setIsLaserLocked(true);
        setTraceProgress(p => {
          const nextP = Math.min(100, p + 1.2);
          if (nextP >= 100) {
            registerHit(35, lang === 'en' ? 'FIBER SYNCED!' : 'FIBRĂ SINCRONIZATĂ!');
            syncProgressToDb(33, score + 35);
            setStage(3);
          }
          return nextP;
        });
      } else {
        setIsLaserLocked(false);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [stage, traceT, cursorPos, lang, score, syncProgressToDb]);

  // Stage 4: Kinetic Orbs Bouncing Physics Loop
  useEffect(() => {
    if (stage !== 4) return;

    const interval = setInterval(() => {
      setOrbs(prevOrbs =>
        prevOrbs.map(orb => {
          if (orb.captured) return orb;

          let newX = orb.x + orb.vx;
          let newY = orb.y + orb.vy;
          let newVx = orb.vx;
          let newVy = orb.vy;

          // Wall collision
          if (newX <= 10 || newX >= 90) newVx = -newVx;
          if (newY <= 15 || newY >= 85) newVy = -newVy;

          // Cursor repulsor physics
          const dx = cursorPos.x - newX;
          const dy = cursorPos.y - newY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 12) {
            // Push orb away from cursor
            const angle = Math.atan2(newY - cursorPos.y, newX - cursorPos.x);
            newVx = Math.cos(angle) * 1.5;
            newVy = Math.sin(angle) * 1.5;
          }

          // Check if orb reached top/bottom collector ports: Port A (x: 50, y: 15) or Port B (x: 50, y: 85)
          const distToPortA = Math.sqrt((50 - newX) ** 2 + (15 - newY) ** 2);
          const distToPortB = Math.sqrt((50 - newX) ** 2 + (85 - newY) ** 2);

          if (distToPortA < 8 || distToPortB < 8) {
            sounds.playSuccess();
            registerHit(10, lang === 'en' ? 'PORT CAPTURE!' : 'PORT CAPTURAT!');
            setCapturedOrbsCount(c => {
              const updated = c + 1;
              if (updated >= 4) {
                syncProgressToDb(66, score + 10);
                setTimeout(() => setStage(5), 400);
              }
              return updated;
            });
            return { ...orb, captured: true };
          }

          return { ...orb, x: newX, y: newY, vx: newVx, vy: newVy };
        })
      );
    }, 30);

    return () => clearInterval(interval);
  }, [stage, cursorPos, lang, score, syncProgressToDb]);

  // Stage 6: Overclock Core Pulse Loop
  useEffect(() => {
    if (stage !== 6) return;

    const pulseInterval = setInterval(() => {
      setPulseRadius(prev => {
        if (prev <= 25) {
          // Missed this pulse
          registerMiss(1);
          setSurgeBeatsRemaining(b => {
            const nextB = b - 1;
            if (nextB <= 0) {
              finishMatch();
            }
            return Math.max(0, nextB);
          });
          return 100;
        }
        return prev - 2.5;
      });
    }, 35);

    return () => clearInterval(pulseInterval);
  }, [stage]);

  // Finish match logic
  const finishMatch = useCallback(() => {
    if (hasFinishedLocal) return;
    setHasFinishedLocal(true);
    sounds.playVictory();

    const finalScore = score + 40;
    const finalProgress = 100;

    if (roomData?.roomCode) {
      updateDuelProgress(
        roomData.roomCode,
        isHost,
        {
          progress: finalProgress,
          score: finalScore,
          finishedAt: Date.now()
        },
        me?.id,
        me?.name
      );
    }

    const won = opponent ? finalScore >= (opponent.score || 0) : true;
    recordStudentDuelResult(won, 'cyber_precision', finalScore);

    if (onFinish) {
      onFinish(finalScore, won);
    }
  }, [hasFinishedLocal, score, roomData?.roomCode, isHost, me?.id, me?.name, opponent, onFinish]);

  // Handle cursor / touch move on arena
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const xPct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setCursorPos({ x: xPct, y: yPct });
  };

  // Node Click Handlers (Stage 1)
  const handleNodeClick = (node: OsuNode, index: number) => {
    if (index !== activeNodeIdx) {
      registerMiss(3);
      return;
    }

    if (node.type === 'click') {
      sounds.playClick();
      registerHit(6, 'PERFECT CLICK!');
      setNodes(prev => prev.map((n, i) => (i === index ? { ...n, hit: true } : n)));
      const nextIdx = index + 1;
      setActiveNodeIdx(nextIdx);

      if (nextIdx >= nodes.length) {
        sounds.playSuccess();
        syncProgressToDb(16, score + 10);
        setTimeout(() => setStage(2), 500);
      }
    }
  };

  // Hold-to-Charge Node (Stage 1)
  const handleHoldStart = (node: OsuNode, index: number) => {
    if (index !== activeNodeIdx || node.type !== 'hold') return;

    holdingNodeRef.current = { id: node.id, startTime: Date.now() };

    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    holdIntervalRef.current = setInterval(() => {
      if (!holdingNodeRef.current) return;
      const elapsed = Date.now() - holdingNodeRef.current.startTime;
      const targetDuration = node.holdDurationMs || 600;
      const progress = Math.min(1, elapsed / targetDuration);

      setNodes(prev =>
        prev.map((n, i) => (i === index ? { ...n, holdProgress: progress } : n))
      );

      if (progress >= 1) {
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        holdingNodeRef.current = null;
        sounds.playSuccess();
        registerHit(8, 'CHARGE COMPLETE! ⚡');
        setNodes(prev => prev.map((n, i) => (i === index ? { ...n, hit: true } : n)));
        const nextIdx = index + 1;
        setActiveNodeIdx(nextIdx);

        if (nextIdx >= nodes.length) {
          syncProgressToDb(16, score + 10);
          setTimeout(() => setStage(2), 500);
        }
      }
    }, 40);
  };

  const handleHoldEnd = (node: OsuNode, index: number) => {
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    if (holdingNodeRef.current && (node.holdProgress || 0) < 1) {
      registerMiss(2);
      setNodes(prev =>
        prev.map((n, i) => (i === index ? { ...n, holdProgress: 0 } : n))
      );
    }
    holdingNodeRef.current = null;
  };

  // Triage Handlers (Stage 3)
  const handleTriageItemInteraction = (
    item: TriageThreatItem,
    action: 'left' | 'right' | 'double'
  ) => {
    if (item.type === 'data' && action === 'left') {
      sounds.playSuccess();
      registerHit(7, lang === 'en' ? 'PACKET ACCEPTED!' : 'PACHET ACCEPTAT!');
      resolveTriageItem(item.id);
    } else if (item.type === 'trojan' && (action === 'right' || shieldActiveMobile)) {
      sounds.playSuccess();
      registerHit(8, lang === 'en' ? 'FIREWALL BLOCKED!' : 'FIREWALL BLOCAT!');
      resolveTriageItem(item.id);
    } else if (item.type === 'archive' && action === 'double') {
      sounds.playSuccess();
      registerHit(8, lang === 'en' ? 'ZIP EXTRACTED!' : 'ARHIVĂ DEZARHIVATĂ!');
      resolveTriageItem(item.id);
    } else {
      registerMiss(3);
    }
  };

  const resolveTriageItem = (id: string) => {
    setTriageItems(prev => prev.filter(t => t.id !== id));
    setTriageClearedCount(c => {
      const updated = c + 1;
      if (updated >= 6) {
        syncProgressToDb(50, score + 20);
        setTimeout(() => setStage(4), 500);
      }
      return updated;
    });
  };

  // Flick Target Hit (Stage 5)
  const handleFlickTargetClick = (target: FlickTarget) => {
    sounds.playCorrect();
    registerHit(6, lang === 'en' ? 'FLICK STRIKE!' : 'FLICK LOVIT!');
    setFlickHitsCount(prev => {
      const updated = prev + 1;
      if (updated >= 7) {
        syncProgressToDb(83, score + 15);
        setTimeout(() => setStage(6), 400);
      } else {
        spawnFlickTarget();
      }
      return updated;
    });
  };

  // Overclock Beat Strike (Stage 6)
  const handleOverclockBeatStrike = () => {
    // Perfect hit when pulseRadius is close to 30 (between 25 and 45)
    if (pulseRadius >= 25 && pulseRadius <= 45) {
      sounds.playSuccess();
      registerHit(9, lang === 'en' ? 'OVERCLOCK BEAT CRUSH!' : 'REPER FRECVENȚĂ PERFECT!');
    } else {
      registerMiss(2);
    }

    setSurgeBeatsRemaining(b => {
      const nextB = b - 1;
      if (nextB <= 0) {
        finishMatch();
      }
      return Math.max(0, nextB);
    });
    setPulseRadius(100);
  };

  return (
    <div
      ref={arenaRef}
      onContextMenu={(e) => e.preventDefault()}
      onWheel={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onPointerMove={handlePointerMove}
      className="relative w-full max-w-5xl mx-auto rounded-3xl bg-slate-950 border-2 border-cyan-500/50 shadow-2xl overflow-hidden select-none touch-none flex flex-col"
      style={{ touchAction: 'none' }}
    >
      {/* Top HUD Bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Crosshair className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-cyan-400 font-mono tracking-wider uppercase">
                {lang === 'en' ? `STAGE ${stage}/6` : `ETAPA ${stage}/6`}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 text-[10px] font-mono border border-cyan-500/40 font-bold">
                {stage === 1 && (lang === 'en' ? 'Osu! Node Strike' : 'Lovire & Încărcare Noduri')}
                {stage === 2 && (lang === 'en' ? 'Fiber Laser Tracing' : 'Urmărire Fibră Optică')}
                {stage === 3 && (lang === 'en' ? 'Malware Triage (L/R/Dbl)' : 'Sortare Malware (Stg/Dr/2x)')}
                {stage === 4 && (lang === 'en' ? 'Kinetic Deflector Ports' : 'Ricoșeu & Deflector Porturi')}
                {stage === 5 && (lang === 'en' ? 'Flick-Shot Reflex' : 'Viteză & Țintire Flick')}
                {stage === 6 && (lang === 'en' ? 'Overclock Core Surge' : 'Supratensionare & Ritm CPU')}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white font-heading">
              Cyber Precision Arena 🎯
            </h3>
          </div>
        </div>

        {/* Live Score & Combo Multiplier */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono uppercase text-slate-400">
              {lang === 'en' ? 'Combo Multiplier' : 'Multiplicator Combo'}
            </span>
            <div className="flex items-center gap-1 font-mono text-amber-400 font-black text-base">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
              <span>x{combo >= 10 ? '1.5' : combo >= 5 ? '1.25' : '1.0'}</span>
              <span className="text-xs text-slate-400">({combo} streak)</span>
            </div>
          </div>

          <div className="bg-slate-950 px-4 py-2 rounded-2xl border border-indigo-500/40 text-center">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              {lang === 'en' ? 'Your Score' : 'Scorul Tău'}
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono text-cyan-300">
              {score} <span className="text-xs text-slate-400 font-normal">pts</span>
            </span>
          </div>

          {/* Opponent Progress Indicator */}
          {opponent && (
            <div className="hidden sm:flex flex-col items-end bg-slate-950/80 px-3.5 py-1.5 rounded-2xl border border-rose-500/30">
              <span className="text-[10px] text-rose-300 font-bold flex items-center gap-1">
                <Swords className="w-3 h-3 text-rose-400" />
                {opponent.name}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-mono font-black text-rose-400">
                  {opponent.score || 0} pts
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  ({opponent.progress || 0}%)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Interactive Stage Canvas Arena */}
      <div className="relative w-full h-[480px] sm:h-[540px] bg-slate-950 overflow-hidden cursor-crosshair">
        {/* Subtle Cyber Grid Matrix Background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, #38bdf8 1px, transparent 1px), linear-gradient(to right, rgba(56, 189, 248, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.05) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />

        {/* Floating Feedback Badge */}
        {feedbackText && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 shadow-xl font-mono font-black text-sm animate-bounce pointer-events-none">
            <span className={feedbackText.color}>{feedbackText.text}</span>
          </div>
        )}

        {/* ================================================================= */}
        {/* STAGE 1: OSU! NODE STRIKE & HOLD TO CHARGE                        */}
        {/* ================================================================= */}
        {stage === 1 && (
          <div className="absolute inset-0">
            <div className="absolute top-3 left-4 text-xs font-mono text-cyan-300 bg-slate-900/80 px-3 py-1 rounded-xl border border-cyan-500/30">
              {lang === 'en'
                ? 'Strike numbered nodes in sequence! Hold circular nodes to charge data.'
                : 'Loviți nodurile în ordinea numerelor! Țineți apăsat pe nodurile circulare pentru încărcare.'}
            </div>

            {nodes.map((node, idx) => {
              if (node.hit) return null;
              const isActive = idx === activeNodeIdx;

              return (
                <div
                  key={node.id}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    width: `${node.radius * 2}px`,
                    height: `${node.radius * 2}px`
                  }}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    if (node.type === 'hold') {
                      handleHoldStart(node, idx);
                    } else {
                      handleNodeClick(node, idx);
                    }
                  }}
                  onPointerUp={(e) => {
                    e.preventDefault();
                    if (node.type === 'hold') handleHoldEnd(node, idx);
                  }}
                  onPointerLeave={(e) => {
                    if (node.type === 'hold') handleHoldEnd(node, idx);
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center font-mono font-black transition-transform cursor-pointer shadow-xl ${
                    isActive
                      ? node.type === 'hold'
                        ? 'bg-gradient-to-tr from-amber-500 to-rose-600 text-white ring-4 ring-amber-400/60 scale-105'
                        : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white ring-4 ring-cyan-400/60 scale-105 animate-pulse'
                      : 'bg-slate-900/80 border-2 border-slate-700 text-slate-500 opacity-60'
                  }`}
                >
                  {/* Shrinking Ring for Active Nodes */}
                  {isActive && (
                    <div
                      className="absolute inset-[-14px] rounded-full border-2 border-cyan-400/80 animate-ping pointer-events-none"
                      style={{ animationDuration: '1.2s' }}
                    />
                  )}

                  {/* Circular progress fill for hold nodes */}
                  {node.type === 'hold' && (
                    <div
                      className="absolute inset-0 rounded-full border-4 border-amber-300"
                      style={{
                        clipPath: `polygon(50% 50%, 50% 0%, ${
                          (node.holdProgress || 0) * 360 > 180 ? '100%' : '50%'
                        } 0%, 100% 100%, 0% 100%, 0% 0%)`
                      }}
                    />
                  )}

                  <span className="text-base sm:text-lg">
                    {node.type === 'hold' ? '⚡' : node.order}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* ================================================================= */}
        {/* STAGE 2: FIBER LASER TRACING                                      */}
        {/* ================================================================= */}
        {stage === 2 && (
          <div className="absolute inset-0">
            <div className="absolute top-3 left-4 text-xs font-mono text-cyan-300 bg-slate-900/80 px-3 py-1 rounded-xl border border-cyan-500/30 flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isLaserLocked ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
              <span>
                {lang === 'en'
                  ? `Keep cursor locked on the fiber optic packet! Synced: ${Math.round(traceProgress)}%`
                  : `Menține cursorul blocat pe semnalul luminos! Sincronizat: ${Math.round(traceProgress)}%`}
              </span>
            </div>

            {/* SVG Fiber Track Wave */}
            <svg className="w-full h-full pointer-events-none">
              <path
                d="M 150 270 Q 300 120 450 270 T 750 270"
                fill="none"
                stroke="rgba(56, 189, 248, 0.25)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M 150 270 Q 300 120 450 270 T 750 270"
                fill="none"
                stroke={isLaserLocked ? '#10b981' : '#38bdf8'}
                strokeWidth="3"
                strokeDasharray="6 6"
              />
            </svg>

            {/* Moving Laser Packet Target */}
            {(() => {
              const beamX = 15 + traceT * 70;
              const beamY = 50 + Math.sin(traceT * Math.PI * 4) * 22;

              return (
                <div
                  style={{
                    left: `${beamX}%`,
                    top: `${beamY}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center transition-all pointer-events-none ${
                    isLaserLocked
                      ? 'bg-emerald-500/30 border-2 border-emerald-400 ring-8 ring-emerald-500/20 scale-125'
                      : 'bg-cyan-500/20 border-2 border-cyan-400 ring-4 ring-cyan-500/10'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full ${isLaserLocked ? 'bg-emerald-300' : 'bg-cyan-300'} shadow-[0_0_20px_rgba(56,189,248,0.8)]`} />
                </div>
              );
            })()}

            {/* Progress Meter Bar */}
            <div className="absolute bottom-5 left-8 right-8 h-3.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-100"
                style={{ width: `${traceProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STAGE 3: MALWARE & DATA TRIAGE (LEFT / RIGHT / DBL CLICK)         */}
        {/* ================================================================= */}
        {stage === 3 && (
          <div className="absolute inset-0">
            <div className="absolute top-3 left-4 text-xs font-mono text-cyan-300 bg-slate-900/80 px-3 py-1 rounded-xl border border-cyan-500/30 flex flex-wrap items-center gap-3">
              <span className="text-emerald-300">🟢 {lang === 'en' ? 'Left-Click: Data' : 'Click-Stânga: Date'}</span>
              <span className="text-rose-400">🔴 {lang === 'en' ? 'Right-Click: Trojan Firewall' : 'Click-Dreapta: Blocare Troian'}</span>
              <span className="text-indigo-300">🔵 {lang === 'en' ? '2x-Click: Zip' : 'Dublu-Click: Arhivă'}</span>
            </div>

            {/* Mobile Firewall Shield Toggle Button */}
            <button
              type="button"
              onClick={() => {
                setShieldActiveMobile(prev => !prev);
                sounds.playClick();
              }}
              className={`absolute top-3 right-4 px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 sm:hidden transition ${
                shieldActiveMobile
                  ? 'bg-rose-600 text-white shadow-lg ring-2 ring-rose-400'
                  : 'bg-slate-900 border border-rose-500/50 text-rose-300'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{shieldActiveMobile ? (lang === 'en' ? 'FIREWALL ARMED' : 'FIREWALL ACTIV') : (lang === 'en' ? 'ARM FIREWALL' : 'ARMEAZĂ FIREWALL')}</span>
            </button>

            {triageItems.map(item => (
              <div
                key={item.id}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                onClick={(e) => {
                  e.preventDefault();
                  handleTriageItemInteraction(item, 'left');
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleTriageItemInteraction(item, 'right');
                }}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  handleTriageItemInteraction(item, 'double');
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-2xl border-2 flex items-center gap-2.5 cursor-pointer shadow-xl transition-transform hover:scale-110 active:scale-95 ${
                  item.type === 'data'
                    ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200'
                    : item.type === 'trojan'
                    ? 'bg-rose-950/90 border-rose-500 text-rose-200 ring-2 ring-rose-500/40 animate-pulse'
                    : 'bg-indigo-950/90 border-indigo-400 text-indigo-200'
                }`}
              >
                <span className="text-xl">
                  {item.type === 'data' ? '📁' : item.type === 'trojan' ? '👾' : '📦'}
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold font-mono">
                    {lang === 'en' ? item.labelEn : item.labelRo}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {item.type === 'data' && (lang === 'en' ? '[Click]' : '[Click]')}
                    {item.type === 'trojan' && (lang === 'en' ? '[Right-Click/Shield]' : '[Click-Dreapta/Scut]')}
                    {item.type === 'archive' && (lang === 'en' ? '[Double-Click]' : '[Dublu-Click]')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================================================================= */}
        {/* STAGE 4: KINETIC DEFLECTOR ORBS                                   */}
        {/* ================================================================= */}
        {stage === 4 && (
          <div className="absolute inset-0">
            <div className="absolute top-3 left-4 text-xs font-mono text-cyan-300 bg-slate-900/80 px-3 py-1 rounded-xl border border-cyan-500/30">
              {lang === 'en'
                ? `Repel orbs with your cursor into Port Alpha or Port Beta! (${capturedOrbsCount}/4)`
                : `Ricoșează bilele energetice cu cursorul spre Port Alpha sau Beta! (${capturedOrbsCount}/4)`}
            </div>

            {/* Top Receptor Port Alpha */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-48 h-10 rounded-b-2xl bg-gradient-to-b from-indigo-900 to-indigo-950 border-2 border-indigo-400/60 flex items-center justify-center font-mono text-xs font-black text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              PORT ALPHA ▲
            </div>

            {/* Bottom Receptor Port Beta */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-48 h-10 rounded-t-2xl bg-gradient-to-t from-teal-900 to-teal-950 border-2 border-teal-400/60 flex items-center justify-center font-mono text-xs font-black text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.5)]">
              PORT BETA ▼
            </div>

            {/* Cursor Deflector Ring Shield */}
            <div
              style={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%`, animationDuration: '8s' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-dashed border-cyan-400/60 pointer-events-none animate-spin"
            />

            {/* Bouncing Orbs */}
            {orbs.map(orb => {
              if (orb.captured) return null;
              return (
                <div
                  key={orb.id}
                  style={{ left: `${orb.x}%`, top: `${orb.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gradient-to-br ${orb.color} shadow-lg ring-2 ring-white/50 flex items-center justify-center text-xs pointer-events-none`}
                >
                  ⚡
                </div>
              );
            })}
          </div>
        )}

        {/* ================================================================= */}
        {/* STAGE 5: FLICK-SHOT MATRIX                                        */}
        {/* ================================================================= */}
        {stage === 5 && (
          <div className="absolute inset-0">
            <div className="absolute top-3 left-4 text-xs font-mono text-cyan-300 bg-slate-900/80 px-3 py-1 rounded-xl border border-cyan-500/30">
              {lang === 'en'
                ? `Flick-Shot Arena: Eliminate appearing memory addresses instantly! (${flickHitsCount}/7)`
                : `Arena Flick-Shot: Elimină adresele de memorie instant! (${flickHitsCount}/7)`}
            </div>

            {flickTargets.map(target => (
              <button
                key={target.id}
                type="button"
                style={{ left: `${target.x}%`, top: `${target.y}%` }}
                onClick={() => handleFlickTargetClick(target)}
                className="absolute -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black font-mono text-xs border-2 border-white shadow-2xl hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-cyan-400/40 animate-pulse"
              >
                {target.label}
              </button>
            ))}
          </div>
        )}

        {/* ================================================================= */}
        {/* STAGE 6: OVERCLOCK CORE SURGE (FINAL CLIMAX)                      */}
        {/* ================================================================= */}
        {stage === 6 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="absolute top-3 left-4 text-xs font-mono text-amber-300 bg-slate-900/80 px-3 py-1 rounded-xl border border-amber-500/30">
              {lang === 'en'
                ? `CLIMAX SURGE: Strike when collapsing pulse ring aligns with central CPU! (${surgeBeatsRemaining} beats left)`
                : `APOGEU OVERCLOCK: Loviți când inelul se aliniază cu nucleul CPU! (${surgeBeatsRemaining} bătăi rămase)`}
            </div>

            {/* Central CPU Core */}
            <button
              type="button"
              onClick={handleOverclockBeatStrike}
              className="relative w-36 h-36 rounded-full bg-gradient-to-br from-amber-500 via-rose-600 to-purple-700 border-4 border-amber-300 flex flex-col items-center justify-center text-white shadow-[0_0_50px_rgba(245,158,11,0.6)] cursor-pointer hover:scale-105 active:scale-95 transition-transform z-10"
            >
              <Cpu className="w-10 h-10 text-white mb-1 animate-pulse" />
              <span className="font-mono font-black text-xs uppercase tracking-wider">
                {lang === 'en' ? 'CORE STRIKE' : 'STRIKE NUCLEU'}
              </span>
            </button>

            {/* Collapsing Inward Pulse Ring */}
            <div
              style={{
                width: `${pulseRadius * 2.8}px`,
                height: `${pulseRadius * 2.8}px`
              }}
              className="absolute rounded-full border-4 border-dashed border-amber-400/80 pointer-events-none transition-all duration-75"
            />
          </div>
        )}
      </div>

      {/* Bottom Mission / Helper Bar */}
      <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono gap-2">
        <div className="flex items-center gap-2">
          <MousePointer2 className="w-4 h-4 text-cyan-400" />
          <span>
            {lang === 'en'
              ? 'Screen scroll is locked during gameplay for precision.'
              : 'Defilarea ecranului este blocată pe durata meciului pentru precizie.'}
          </span>
        </div>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            {lang === 'en' ? 'Abandon Match' : 'Abandonează Meciul'}
          </button>
        )}
      </div>
    </div>
  );
};
