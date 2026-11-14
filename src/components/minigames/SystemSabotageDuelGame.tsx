import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Wrench,
  AlertTriangle,
  Flame,
  Volume2,
  VolumeX,
  Trophy,
  RotateCcw,
  ArrowLeft,
  Clock,
  CheckCircle2,
  X,
  ShieldAlert,
  Snowflake,
  EyeOff,
  Radio,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  DuelRoomData,
  SabotageSyncEvent,
  SabotageType,
  sendSabotageEvent,
  updateDuelProgress,
} from '../../lib/duelService';
import { recordStudentDuelResult } from '../../lib/studentAuthService';
import { forceScrollToTop } from '../../utils/scrollHelper';

interface SystemSabotageDuelGameProps {
  roomData?: DuelRoomData | null;
  isHost?: boolean;
  studentName?: string;
  studentAvatar?: string;
  onFinish?: (score: number, won: boolean) => void;
  onBack?: () => void;
}

type MiniTaskKind =
  | 'wires'
  | 'manifolds'
  | 'card_swipe'
  | 'calibrate'
  | 'purge_bugs'
  | 'align_freq';

const TOTAL_TASKS_GOAL = 8;
const MATCH_DURATION_SEC = 90;

interface WireNode {
  id: string;
  color: string;
  label: string;
}

const WIRE_PALETTE: WireNode[] = [
  { id: 'red', color: '#ef4444', label: 'PWR' },
  { id: 'cyan', color: '#06b6d4', label: 'DATA' },
  { id: 'amber', color: '#f59e0b', label: 'CLK' },
  { id: 'emerald', color: '#10b981', label: 'GND' },
];

interface PopupAd {
  id: string;
  titleRo: string;
  titleEn: string;
  xPct: number;
  yPct: number;
  color: string;
}

const FAKE_POPUPS = [
  { titleRo: 'DESCARCĂ 128 GB RAM GRATUIT!', titleEn: 'DOWNLOAD 128GB FREE RAM!', color: 'border-rose-500 bg-rose-950' },
  { titleRo: 'EROARE KERNEL #404 DETECTATĂ!', titleEn: 'KERNEL ERROR #404 DETECTED!', color: 'border-amber-500 bg-amber-950' },
  { titleRo: 'AI CÂȘTIGAT 9999 BITCOINI!', titleEn: 'YOU WON 9999 BITCOINS!', color: 'border-purple-500 bg-purple-950' },
  { titleRo: 'ALERTĂ: CABLU DECONECTAT!', titleEn: 'ALERT: DATA CABLE UNPLUGGED!', color: 'border-cyan-500 bg-cyan-950' },
];

interface SabotageDef {
  type: SabotageType;
  nameRo: string;
  nameEn: string;
  descRo: string;
  descEn: string;
  cost: number;
  icon: React.ReactNode;
  btnClass: string;
}

const SABOTAGES: SabotageDef[] = [
  {
    type: 'blackout',
    nameRo: 'Stinge Lumina',
    nameEn: 'Lights Out',
    descRo: 'Orbește adversarul cu lanternă (5s)',
    descEn: 'Blackout flashlight mode (5s)',
    cost: 1,
    icon: <EyeOff className="w-4 h-4" />,
    btnClass: 'from-slate-700 to-indigo-700 hover:from-slate-600 hover:to-indigo-600 border-indigo-400/50',
  },
  {
    type: 'popups',
    nameRo: 'Adware Pop-ups',
    nameEn: 'Pop-Up Storm',
    descRo: '3 ferestre false blochează ecranul',
    descEn: '3 fake popup windows block task',
    cost: 1,
    icon: <AlertTriangle className="w-4 h-4" />,
    btnClass: 'from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 border-amber-400/50',
  },
  {
    type: 'cryofreeze',
    nameRo: 'Criogenare UI',
    nameEn: 'Cryo-Freeze',
    descRo: 'Îngheață consola (4 lovituri să spargă)',
    descEn: 'Freezes console (4 taps to shatter)',
    cost: 1,
    icon: <Snowflake className="w-4 h-4" />,
    btnClass: 'from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 border-cyan-400/50',
  },
  {
    type: 'meltdown',
    nameRo: 'Alertă Reactor',
    nameEn: 'Reactor Meltdown',
    descRo: 'Blochează sistemul până apasă 3 valve',
    descEn: 'Locks controls until 3 valves pressed',
    cost: 2,
    icon: <ShieldAlert className="w-4 h-4" />,
    btnClass: 'from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 border-rose-400/50',
  },
];

function buildTaskDeck(): MiniTaskKind[] {
  const pool: MiniTaskKind[] = ['wires', 'manifolds', 'card_swipe', 'calibrate', 'purge_bugs', 'align_freq'];
  const result: MiniTaskKind[] = [];
  for (let i = 0; i < TOTAL_TASKS_GOAL + 4; i++) {
    const chunk = [...pool].sort(() => Math.random() - 0.5);
    for (const item of chunk) {
      if (result.length > 0 && result[result.length - 1] === item) continue;
      result.push(item);
      if (result.length >= TOTAL_TASKS_GOAL + 2) break;
    }
    if (result.length >= TOTAL_TASKS_GOAL + 2) break;
  }
  return result;
}

export const SystemSabotageDuelGame: React.FC<SystemSabotageDuelGameProps> = ({
  roomData,
  isHost = true,
  studentName = 'Crewmate',
  studentAvatar = '🛸',
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
    ? (isHost ? roomData?.guest?.name : roomData?.host?.name) || (isEn ? 'Rival Engineer' : 'Inginer Rival')
    : 'Cyber-Impostor AI';
  const opponentAvatar = isLivePvP
    ? (isHost ? roomData?.guest?.avatar : roomData?.host?.avatar) || '🚀'
    : '🤖';

  // Core Match State
  const [taskQueue, setTaskQueue] = useState<MiniTaskKind[]>(() => buildTaskDeck());
  const [tasksCompleted, setTasksCompleted] = useState<number>(0);
  const [oppTasksCompleted, setOppTasksCompleted] = useState<number>(0);
  const [sabotageCharges, setSabotageCharges] = useState<number>(1);
  const [sabotagesSentCount, setSabotagesSentCount] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(MATCH_DURATION_SEC);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [alertToast, setAlertToast] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<{
    won: boolean;
    finalScore: number;
    myTasks: number;
    oppTasks: number;
    reasonRo: string;
    reasonEn: string;
  } | null>(null);

  // Active Incoming Sabotage Effects on Local Player
  const [blackoutEndAt, setBlackoutEndAt] = useState<number>(0);
  const [spotlightPos, setSpotlightPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [activePopups, setActivePopups] = useState<PopupAd[]>([]);
  const [iceHitsLeft, setIceHitsLeft] = useState<number>(0);
  const [meltdownValves, setMeltdownValves] = useState<boolean[]>([false, false, false]);
  const [meltdownActive, setMeltdownActive] = useState<boolean>(false);

  // ========================================================
  // MINI-TASK STATES
  // ========================================================
  // 1. Wires
  const [wiresLeft, setWiresLeft] = useState<WireNode[]>([]);
  const [wiresRight, setWiresRight] = useState<WireNode[]>([]);
  const [selectedLeftWire, setSelectedLeftWire] = useState<string | null>(null);
  const [connectedWires, setConnectedWires] = useState<string[]>([]);

  // 2. Manifolds (1 to 8 ascending)
  const [manifoldNums, setManifoldNums] = useState<number[]>([]);
  const [nextManifoldNum, setNextManifoldNum] = useState<number>(1);

  // 3. Card Swipe
  const [swipeProgress, setSwipeProgress] = useState<number>(0);
  const [swipeFeedback, setSwipeFeedback] = useState<string | null>(null);
  const swipeStartTimeRef = useRef<number>(0);
  const swipeDraggingRef = useRef<boolean>(false);

  // 4. Calibrate Distributors (3 rotating gauge locks)
  const [calibrateStage, setCalibrateStage] = useState<number>(0); // 0, 1, 2
  const [needleAngle, setNeedleAngle] = useState<number>(0); // 0 to 100
  const [calibrateDir, setCalibrateDir] = useState<number>(1);
  const [targetZoneStart, setTargetZoneStart] = useState<number>(42);

  // 5. Purge Vent Bugs
  const [bugs, setBugs] = useState<Array<{ id: string; x: number; y: number; icon: string; purged: boolean }>>([]);

  // 6. Align Comm Frequency
  const [playerFreq, setPlayerFreq] = useState<number>(2);
  const [targetFreq, setTargetFreq] = useState<number>(5);
  const [playerAmp, setPlayerAmp] = useState<number>(30);
  const [targetAmp, setTargetAmp] = useState<number>(70);

  // Refs for timers & Firestore sync
  const finishedRef = useRef<boolean>(false);
  const soundEnabledRef = useRef<boolean>(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mySentEventsRef = useRef<SabotageSyncEvent[]>([]);
  const processedRemoteIdsRef = useRef<Set<string>>(new Set());
  const taskPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    forceScrollToTop();
  }, []);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const playTone = useCallback((freq: number, duration = 0.09, type: OscillatorType = 'triangle', gainVal = 0.08, endFreq?: number) => {
    if (!soundEnabledRef.current) return;
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtxRef.current) audioCtxRef.current = new Ctx();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(50, endFreq), ctx.currentTime + duration);
      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }, []);

  const showToast = useCallback((msg: string) => {
    setAlertToast(msg);
    setTimeout(() => {
      setAlertToast((prev) => (prev === msg ? null : prev));
    }, 2200);
  }, []);

  const currentTask: MiniTaskKind = taskQueue[tasksCompleted] || 'wires';

  // Initialize mini-task state whenever currentTask or tasksCompleted changes
  const setupTaskState = useCallback((kind: MiniTaskKind) => {
    if (kind === 'wires') {
      setWiresLeft([...WIRE_PALETTE].sort(() => Math.random() - 0.5));
      setWiresRight([...WIRE_PALETTE].sort(() => Math.random() - 0.5));
      setSelectedLeftWire(null);
      setConnectedWires([]);
    } else if (kind === 'manifolds') {
      const nums = [1, 2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() - 0.5);
      setManifoldNums(nums);
      setNextManifoldNum(1);
    } else if (kind === 'card_swipe') {
      setSwipeProgress(0);
      setSwipeFeedback(null);
      swipeDraggingRef.current = false;
    } else if (kind === 'calibrate') {
      setCalibrateStage(0);
      setNeedleAngle(10);
      setTargetZoneStart(32 + Math.floor(Math.random() * 34));
    } else if (kind === 'purge_bugs') {
      const icons = ['🦠', '🐛', '👾', '⚠️', '💀', '🕷️'];
      const spawned = icons.map((ic, idx) => ({
        id: `bug_${idx}_${Date.now()}`,
        x: 15 + Math.floor(Math.random() * 70),
        y: 18 + Math.floor(Math.random() * 64),
        icon: ic,
        purged: false,
      }));
      setBugs(spawned);
    } else if (kind === 'align_freq') {
      const tf = 2 + Math.floor(Math.random() * 5); // 2..6
      const ta = 35 + Math.floor(Math.random() * 45); // 35..80
      setTargetFreq(tf);
      setTargetAmp(ta);
      setPlayerFreq(tf === 3 ? 5 : 3);
      setPlayerAmp(ta > 55 ? 25 : 80);
    }
  }, []);

  useEffect(() => {
    if (tasksCompleted < TOTAL_TASKS_GOAL && !matchResult) {
      setupTaskState(currentTask);
    }
  }, [currentTask, tasksCompleted, setupTaskState, matchResult]);

  // Conclude Match cleanly
  const concludeMatch = useCallback(
    (won: boolean, finalTasks: number, oppTasks: number, reasonRo: string, reasonEn: string) => {
      if (finishedRef.current) return;
      finishedRef.current = true;

      const finalScore = (won ? 500 : 180) + finalTasks * 90 + sabotagesSentCount * 40;
      if (won) {
        playTone(587, 0.16, 'triangle', 0.1, 880);
      } else {
        playTone(220, 0.25, 'sawtooth', 0.08, 120);
      }

      setMatchResult({
        won,
        finalScore,
        myTasks: finalTasks,
        oppTasks,
        reasonRo,
        reasonEn,
      });

      recordStudentDuelResult(won, 'system_sabotage', finalScore);

      if (roomData?.roomCode) {
        const myId = isHost ? roomData.host.id : roomData.guest?.id;
        const oppId = isHost ? roomData.guest?.id : roomData.host.id;
        const myName = isHost ? roomData.host.name : roomData.guest?.name || studentName;
        const oppName = isHost ? (roomData.guest?.name || 'Opponent') : roomData.host.name;

        updateDuelProgress(
          roomData.roomCode,
          isHost,
          {
            progress: 100,
            score: finalScore,
            finishedAt: Date.now(),
          },
          won ? myId : oppId || myId,
          won ? myName : oppName
        );
      }

      onFinish?.(finalScore, won);
    },
    [isHost, onFinish, playTone, roomData, sabotagesSentCount, studentName]
  );

  // Task Completion Handler
  const handleCompleteCurrentTask = useCallback(() => {
    if (finishedRef.current) return;
    playTone(660, 0.12, 'triangle', 0.09, 990);

    const nextTasks = tasksCompleted + 1;
    const nextScore = score + 110;
    setTasksCompleted(nextTasks);
    setScore(nextScore);

    // Every task grants a Sabotage Charge (up to 3 max) so battles stay dynamic!
    setSabotageCharges((c) => Math.min(3, c + 1));
    showToast(isEn ? '✅ SUBSYSTEM REPAIRED! +1 Sabotage Charge!' : '✅ SISTEM REPARAT! +1 Încărcare Sabotaj!');

    const pct = Math.min(100, Math.round((nextTasks / TOTAL_TASKS_GOAL) * 100));
    if (roomData?.roomCode && nextTasks < TOTAL_TASKS_GOAL) {
      updateDuelProgress(roomData.roomCode, isHost, {
        progress: pct,
        score: nextScore,
        currentStageIndex: nextTasks,
      });
    }

    if (nextTasks >= TOTAL_TASKS_GOAL) {
      concludeMatch(
        true,
        nextTasks,
        oppTasksCompleted,
        'Ai finalizat toate cele 8 reparații înaintea rivalului!',
        'You completed all 8 ship repairs before your rival!'
      );
    }
  }, [concludeMatch, isEn, isHost, oppTasksCompleted, playTone, roomData?.roomCode, score, showToast, tasksCompleted]);

  // Apply Incoming Sabotage locally
  const triggerIncomingSabotage = useCallback(
    (type: SabotageType) => {
      if (finishedRef.current) return;
      playTone(170, 0.25, 'sawtooth', 0.1, 95);

      if (type === 'blackout') {
        setBlackoutEndAt(Date.now() + 5000);
        showToast(isEn ? '🌑 SABOTAGED: LIGHTS CUT! Use Spotlight!' : '🌑 SABOTAJ: LUMINĂ STINSĂ! Folosește Lanterna!');
      } else if (type === 'popups') {
        const spawned: PopupAd[] = [0, 1, 2].map((i) => {
          const tpl = FAKE_POPUPS[(Math.floor(Math.random() * FAKE_POPUPS.length) + i) % FAKE_POPUPS.length];
          return {
            id: `pop_${Date.now()}_${i}`,
            titleRo: tpl.titleRo,
            titleEn: tpl.titleEn,
            xPct: 8 + i * 20 + Math.floor(Math.random() * 10),
            yPct: 12 + (i % 2) * 32 + Math.floor(Math.random() * 14),
            color: tpl.color,
          };
        });
        setActivePopups(spawned);
        showToast(isEn ? '🦠 SABOTAGED: CLOSE ADWARE POP-UPS!' : '🦠 SABOTAJ: ÎNCHIDE FERESTRELE VIRUS!');
      } else if (type === 'cryofreeze') {
        setIceHitsLeft(4);
        showToast(isEn ? '❄️ SABOTAGED: CONSOLE FROZEN! Tap 4x!' : '❄️ SABOTAJ: CONSOLĂ ÎNGHEȚATĂ! Apasă de 4x!');
      } else if (type === 'meltdown') {
        setMeltdownValves([false, false, false]);
        setMeltdownActive(true);
        showToast(isEn ? '🚨 REACTOR MELTDOWN! PRESS ALL 3 VALVES!' : '🚨 ALERTĂ REACTOR! APASĂ CELE 3 VALVE!');
      }
    },
    [isEn, playTone, showToast]
  );

  // Send Sabotage Attack to Opponent
  const handleLaunchSabotage = (sab: SabotageDef) => {
    if (finishedRef.current || sabotageCharges < sab.cost) return;
    setSabotageCharges((c) => Math.max(0, c - sab.cost));
    setSabotagesSentCount((n) => n + 1);
    setScore((s) => s + 45);
    playTone(520, 0.14, 'square', 0.08, 780);
    showToast(
      isEn
        ? `😈 SENT ${sab.nameEn.toUpperCase()} TO ${opponentName}!`
        : `😈 AI TRIMIS „${sab.nameRo.toUpperCase()}” LA ${opponentName}!`
    );

    if (isLivePvP && roomData?.roomCode) {
      const evt: SabotageSyncEvent = {
        id: `sab_${isHost ? 'h' : 'g'}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        type: sab.type,
        createdAt: Date.now(),
      };
      const updated = [...mySentEventsRef.current, evt].slice(-20);
      mySentEventsRef.current = updated;
      sendSabotageEvent(roomData.roomCode, isHost, updated);
    }
  };

  // Listen for live remote Sabotage events & Opponent Progress
  useEffect(() => {
    if (!isLivePvP || !roomData) return;
    const remoteOpp = isHost ? roomData.guest : roomData.host;
    if (remoteOpp) {
      const oppStage = remoteOpp.currentStageIndex ?? Math.round((remoteOpp.progress / 100) * TOTAL_TASKS_GOAL);
      setOppTasksCompleted(Math.min(TOTAL_TASKS_GOAL, oppStage));
      if (remoteOpp.progress >= 100 && !finishedRef.current && tasksCompleted < TOTAL_TASKS_GOAL) {
        concludeMatch(
          false,
          tasksCompleted,
          TOTAL_TASKS_GOAL,
          `${opponentName} a terminat toate cele 8 sarcini primul!`,
          `${opponentName} finished all 8 tasks first!`
        );
      }
    }

    const remoteEvents = isHost ? roomData.guestSabotageEvents : roomData.hostSabotageEvents;
    if (remoteEvents && remoteEvents.length > 0) {
      remoteEvents.forEach((evt) => {
        if (!processedRemoteIdsRef.current.has(evt.id)) {
          processedRemoteIdsRef.current.add(evt.id);
          triggerIncomingSabotage(evt.type);
        }
      });
    }
  }, [roomData, isHost, isLivePvP, opponentName, tasksCompleted, concludeMatch, triggerIncomingSabotage]);

  // Match Countdown Clock + Solo AI Impostor Bot Simulation
  useEffect(() => {
    if (matchResult) return;
    const clockInterval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          const won = tasksCompleted >= oppTasksCompleted;
          concludeMatch(
            won,
            tasksCompleted,
            oppTasksCompleted,
            won ? 'Timp expirat! Ai reparat mai multe sisteme!' : 'Timp expirat! Adversarul a reparat mai multe sisteme.',
            won ? 'Time up! You repaired more subsystems!' : 'Time up! Opponent repaired more subsystems.'
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(clockInterval);
  }, [concludeMatch, matchResult, oppTasksCompleted, tasksCompleted]);

  // AI Bot Task Progression + Incoming Bot Sabotages when in Practice Mode
  useEffect(() => {
    if (isLivePvP || matchResult) return;

    const botTaskTimer = setInterval(() => {
      setOppTasksCompleted((prev) => {
        const next = Math.min(TOTAL_TASKS_GOAL, prev + 1);
        if (next >= TOTAL_TASKS_GOAL && !finishedRef.current) {
          concludeMatch(
            false,
            tasksCompleted,
            TOTAL_TASKS_GOAL,
            'Cyber-Impostor AI a terminat toate cele 8 reparații înaintea ta!',
            'Cyber-Impostor AI finished all 8 repairs before you!'
          );
        }
        return next;
      });
    }, 8200);

    const botSabotageTimer = setInterval(() => {
      if (finishedRef.current) return;
      const pool: SabotageType[] = ['blackout', 'popups', 'cryofreeze', 'meltdown'];
      const pick = pool[Math.floor(Math.random() * pool.length)];
      triggerIncomingSabotage(pick);
    }, 11500);

    return () => {
      clearInterval(botTaskTimer);
      clearInterval(botSabotageTimer);
    };
  }, [isLivePvP, matchResult, concludeMatch, tasksCompleted, triggerIncomingSabotage]);

  // Calibrate Needle Animation Loop
  useEffect(() => {
    if (currentTask !== 'calibrate' || matchResult) return;
    const anim = setInterval(() => {
      setNeedleAngle((prev) => {
        let next = prev + calibrateDir * 2.7;
        if (next >= 98) {
          setCalibrateDir(-1);
          next = 98;
        } else if (next <= 2) {
          setCalibrateDir(1);
          next = 2;
        }
        return next;
      });
    }, 24);
    return () => clearInterval(anim);
  }, [currentTask, calibrateDir, matchResult]);

  // Blackout timer re-render check
  const [nowTick, setNowTick] = useState<number>(Date.now());
  const isBlackoutActive = blackoutEndAt > nowTick;
  useEffect(() => {
    if (blackoutEndAt <= Date.now()) return;
    const t = setInterval(() => {
      const now = Date.now();
      setNowTick(now);
      if (now >= blackoutEndAt) clearInterval(t);
    }, 250);
    return () => clearInterval(t);
  }, [blackoutEndAt]);

  // Wire connection check
  const handleSelectRightWire = (rightId: string) => {
    if (!selectedLeftWire) return;
    if (selectedLeftWire === rightId && !connectedWires.includes(rightId)) {
      const next = [...connectedWires, rightId];
      setConnectedWires(next);
      setSelectedLeftWire(null);
      playTone(540, 0.08, 'sine', 0.07, 720);
      if (next.length >= WIRE_PALETTE.length) {
        setTimeout(() => handleCompleteCurrentTask(), 180);
      }
    } else {
      setSelectedLeftWire(null);
      playTone(180, 0.1, 'square', 0.06);
    }
  };

  // Calibrate Lock Button
  const handleCalibrateLock = () => {
    const zoneEnd = targetZoneStart + 18;
    if (needleAngle >= targetZoneStart && needleAngle <= zoneEnd) {
      playTone(620, 0.09, 'triangle', 0.08, 860);
      if (calibrateStage >= 2) {
        handleCompleteCurrentTask();
      } else {
        setCalibrateStage((s) => s + 1);
        setTargetZoneStart(18 + Math.floor(Math.random() * 58));
      }
    } else {
      playTone(150, 0.12, 'sawtooth', 0.07);
    }
  };

  // Align Frequency Check
  useEffect(() => {
    if (currentTask !== 'align_freq' || matchResult) return;
    if (playerFreq === targetFreq && Math.abs(playerAmp - targetAmp) <= 8) {
      const t = setTimeout(() => handleCompleteCurrentTask(), 260);
      return () => clearTimeout(t);
    }
  }, [currentTask, playerFreq, targetFreq, playerAmp, targetAmp, matchResult, handleCompleteCurrentTask]);

  const handleRestartSolo = () => {
    finishedRef.current = false;
    setTaskQueue(buildTaskDeck());
    setTasksCompleted(0);
    setOppTasksCompleted(0);
    setSabotageCharges(1);
    setSabotagesSentCount(0);
    setScore(0);
    setTimeRemaining(MATCH_DURATION_SEC);
    setBlackoutEndAt(0);
    setActivePopups([]);
    setIceHitsLeft(0);
    setMeltdownActive(false);
    setMatchResult(null);
  };

  const myPct = Math.round((tasksCompleted / TOTAL_TASKS_GOAL) * 100);
  const oppPct = Math.round((oppTasksCompleted / TOTAL_TASKS_GOAL) * 100);

  return (
    <div className="w-full max-w-5xl mx-auto p-3 sm:p-5 rounded-3xl bg-slate-900/95 border border-rose-500/30 shadow-2xl space-y-4 select-none">
      {/* Match Header HUD */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center text-white shadow-md">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-white font-heading">
              {isEn ? 'System Sabotage 1v1' : 'System Sabotage 1v1'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {isEn ? `Repair ${TOTAL_TASKS_GOAL} Systems & Sabotage Your Rival!` : `Repară ${TOTAL_TASKS_GOAL} Sisteme și Sabotează Rivalul!`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs font-black text-cyan-300 tabular-nums flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSoundEnabled((v) => !v)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
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

      {/* Live Dual Spaceship Repair Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-cyan-300 flex items-center gap-1.5">
              <span>{studentAvatar}</span>
              <span>{studentName}</span>
            </span>
            <span className="font-mono text-emerald-400 tabular-nums">
              {tasksCompleted} / {TOTAL_TASKS_GOAL} {isEn ? 'Tasks' : 'Sarcini'}
            </span>
          </div>
          <div className="h-3 rounded-full bg-slate-900 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${Math.max(4, myPct)}%` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-rose-500/40 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-rose-300 flex items-center gap-1.5">
              <span>{opponentAvatar}</span>
              <span>{opponentName}</span>
            </span>
            <span className="font-mono text-amber-300 tabular-nums">
              {oppTasksCompleted} / {TOTAL_TASKS_GOAL} {isEn ? 'Tasks' : 'Sarcini'}
            </span>
          </div>
          <div className="h-3 rounded-full bg-slate-900 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-600 to-amber-400 transition-all duration-300"
              style={{ width: `${Math.max(4, oppPct)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Alert Notification Toast */}
      {alertToast && (
        <div className="px-4 py-2 rounded-xl bg-amber-950/90 border border-amber-400/60 text-amber-200 text-xs font-black text-center shadow-lg">
          {alertToast}
        </div>
      )}

      {/* Main Layout: Active Interactive Task Panel + Sabotage Command Dock */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* TASK WORKSPACE PANEL */}
        <div
          ref={taskPanelRef}
          onPointerMove={(e) => {
            if (!isBlackoutActive || !taskPanelRef.current) return;
            const rect = taskPanelRef.current.getBoundingClientRect();
            setSpotlightPos({
              x: ((e.clientX - rect.left) / rect.width) * 100,
              y: ((e.clientY - rect.top) / rect.height) * 100,
            });
          }}
          className="lg:col-span-8 relative rounded-3xl bg-slate-950 border-2 border-slate-800 p-4 sm:p-6 min-h-[340px] flex flex-col justify-between overflow-hidden shadow-2xl"
        >
          {/* TASK 1: CONNECT WIRES */}
          {currentTask === 'wires' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-white">
                    🔌 {isEn ? 'Task: Reconnect Power & Data Wires' : 'Sarcină: Reconectează Cablurile de Date'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {isEn ? 'Tap a color on the left, then tap the matching port on the right!' : 'Apasă o mufă din stânga, apoi perechea ei colorată din dreapta!'}
                  </p>
                </div>
                <span className="font-mono text-xs font-black text-emerald-400">
                  {connectedWires.length} / 4
                </span>
              </div>

              <div className="grid grid-cols-2 gap-8 sm:gap-14 py-2">
                <div className="space-y-3">
                  {wiresLeft.map((w) => {
                    const isDone = connectedWires.includes(w.id);
                    const isSel = selectedLeftWire === w.id;
                    return (
                      <button
                        key={`L_${w.id}`}
                        type="button"
                        disabled={isDone}
                        onClick={() => {
                          setSelectedLeftWire(w.id);
                          playTone(400, 0.05, 'sine', 0.06);
                        }}
                        className={`w-full min-h-[48px] px-3 py-2.5 rounded-xl border-2 flex items-center justify-between font-mono text-xs font-black transition cursor-pointer touch-manipulation ${
                          isDone
                            ? 'opacity-45 border-emerald-500 bg-emerald-950/40 text-emerald-300'
                            : isSel
                            ? 'ring-2 ring-white scale-[1.03] text-white'
                            : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-white'
                        }`}
                        style={{ borderColor: isSel ? '#ffffff' : w.color }}
                      >
                        <span>{w.label}</span>
                        <span className="w-5 h-5 rounded-full border-2 border-white/60" style={{ backgroundColor: w.color }} />
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-3">
                  {wiresRight.map((w) => {
                    const isDone = connectedWires.includes(w.id);
                    return (
                      <button
                        key={`R_${w.id}`}
                        type="button"
                        disabled={isDone || !selectedLeftWire}
                        onClick={() => handleSelectRightWire(w.id)}
                        className={`w-full min-h-[48px] px-3 py-2.5 rounded-xl border-2 flex items-center justify-between font-mono text-xs font-black transition cursor-pointer touch-manipulation ${
                          isDone
                            ? 'opacity-45 border-emerald-500 bg-emerald-950/40 text-emerald-300'
                            : 'bg-slate-900 border-slate-700 hover:border-white text-white active:scale-95'
                        }`}
                        style={{ borderColor: w.color }}
                      >
                        <span className="w-5 h-5 rounded-full border-2 border-white/60" style={{ backgroundColor: w.color }} />
                        <span>{isDone ? '✓ LINKED' : w.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TASK 2: UNLOCK MANIFOLDS (1 to 8) */}
          {currentTask === 'manifolds' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-white">
                    🔢 {isEn ? 'Task: Unlock Cooling Manifolds (1 → 8)' : 'Sarcină: Deblochează Reactorul (1 → 8)'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {isEn ? 'Tap the numbers strictly in ascending order from 1 to 8!' : 'Apasă numerele în ordine crescătoare de la 1 la 8!'}
                  </p>
                </div>
                <span className="font-mono text-xs font-black text-cyan-300">
                  {isEn ? 'Next:' : 'Urmează:'} #{nextManifoldNum}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-3 pt-2">
                {manifoldNums.map((num) => {
                  const isDone = num < nextManifoldNum;
                  return (
                    <button
                      key={num}
                      type="button"
                      disabled={isDone}
                      onClick={() => {
                        if (num === nextManifoldNum) {
                          playTone(360 + num * 50, 0.08, 'triangle', 0.08);
                          if (num === 8) {
                            setNextManifoldNum(9);
                            handleCompleteCurrentTask();
                          } else {
                            setNextManifoldNum(num + 1);
                          }
                        } else {
                          playTone(140, 0.14, 'sawtooth', 0.08);
                          setNextManifoldNum(1);
                        }
                      }}
                      className={`min-h-[68px] rounded-2xl border-2 font-mono text-2xl font-black transition active:scale-95 cursor-pointer touch-manipulation ${
                        isDone
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : 'bg-slate-900 hover:bg-slate-800 border-cyan-500/50 text-white shadow-lg'
                      }`}
                    >
                      {isDone ? '✓' : num}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TASK 3: SWIPE KEYCARD */}
          {currentTask === 'card_swipe' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-base font-black text-white">
                  💳 {isEn ? 'Task: Admin Keycard Authentication' : 'Sarcină: Validare Card de Acces'}
                </h4>
                <p className="text-xs text-slate-400">
                  {isEn
                    ? 'Slide the card bar smoothly from left (0%) to right (100%) — neither too fast nor too slow!'
                    : 'Glisează cardul constant din stânga (0%) până în dreapta (100%) — nici prea repede, nici prea încet!'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border-2 border-indigo-500/40 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">READER STATUS:</span>
                  <span className="font-black text-amber-300">
                    {swipeFeedback || (isEn ? 'SLIDE CARD TO 100% ➔' : 'GLISEAZĂ CARDUL LA 100% ➔')}
                  </span>
                </div>

                <input
                  type="range"
                  min={0}
                  max={100}
                  value={swipeProgress}
                  onPointerDown={() => {
                    if (!swipeDraggingRef.current && swipeProgress <= 15) {
                      swipeDraggingRef.current = true;
                      swipeStartTimeRef.current = Date.now();
                      setSwipeFeedback(isEn ? 'READING...' : 'SE CITEȘTE...');
                    }
                  }}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!swipeDraggingRef.current) {
                      swipeDraggingRef.current = true;
                      swipeStartTimeRef.current = Date.now();
                    }
                    setSwipeProgress(val);
                    if (val >= 98) {
                      const elapsed = Date.now() - swipeStartTimeRef.current;
                      swipeDraggingRef.current = false;
                      if (elapsed < 160) {
                        setSwipeFeedback(isEn ? 'TOO FAST! Try again' : 'PREA REPEDE! Încearcă din nou');
                        setSwipeProgress(0);
                        playTone(150, 0.12, 'square', 0.07);
                      } else if (elapsed > 2900) {
                        setSwipeFeedback(isEn ? 'TOO SLOW! Try again' : 'PREA ÎNCET! Încearcă din nou');
                        setSwipeProgress(0);
                        playTone(150, 0.12, 'square', 0.07);
                      } else {
                        setSwipeFeedback(isEn ? '✅ KEYCARD ACCEPTED!' : '✅ CARD ACCEPTAT!');
                        handleCompleteCurrentTask();
                      }
                    }
                  }}
                  className="w-full h-12 accent-cyan-400 cursor-grab active:cursor-grabbing touch-none"
                />
              </div>
            </div>
          )}

          {/* TASK 4: CALIBRATE DISTRIBUTORS */}
          {currentTask === 'calibrate' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-white">
                    🎚️ {isEn ? 'Task: Calibrate Energy Distributors' : 'Sarcină: Calibrare Distribuitoare'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {isEn ? 'Press LOCK ENERGY when the white marker hits the green target zone!' : 'Apasă BLOCHEAZĂ când indicatorul alb intră în zona verde!'}
                  </p>
                </div>
                <span className="font-mono text-xs font-black text-emerald-400">
                  {calibrateStage + 1} / 3
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 space-y-5">
                <div className="relative h-12 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                  {/* Green Target Zone */}
                  <div
                    className="absolute top-0 bottom-0 bg-emerald-500/35 border-x-2 border-emerald-400"
                    style={{ left: `${targetZoneStart}%`, width: '18%' }}
                  />
                  {/* Moving Needle */}
                  <div
                    className="absolute top-0 bottom-0 w-2 bg-white shadow-[0_0_12px_#ffffff]"
                    style={{ left: `calc(${needleAngle}% - 4px)` }}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleCalibrateLock}
                  className="w-full min-h-[52px] rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-sm shadow-lg active:scale-95 transition cursor-pointer touch-manipulation"
                >
                  ⚡ {isEn ? `LOCK DISTRIBUTOR #${calibrateStage + 1}` : `BLOCHEAZĂ NIVELUL #${calibrateStage + 1}`}
                </button>
              </div>
            </div>
          )}

          {/* TASK 5: PURGE MALWARE BUGS */}
          {currentTask === 'purge_bugs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-white">
                    🧹 {isEn ? 'Task: Purge Malware Bugs from Chute' : 'Sarcină: Curăță Virușii din Sistem'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {isEn ? 'Tap every drifting cyber-bug to eject them!' : 'Apasă pe fiecare virus plutitor pentru a-l elimina!'}
                  </p>
                </div>
                <span className="font-mono text-xs font-black text-rose-400">
                  {bugs.filter((b) => !b.purged).length} {isEn ? 'left' : 'rămași'}
                </span>
              </div>

              <div className="relative h-56 rounded-2xl bg-slate-900 border border-slate-700 overflow-hidden">
                {bugs.map((b) =>
                  b.purged ? null : (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        playTone(540, 0.08, 'triangle', 0.08, 220);
                        setBugs((prev) => {
                          const next = prev.map((item) => (item.id === b.id ? { ...item, purged: true } : item));
                          if (next.every((item) => item.purged)) {
                            setTimeout(() => handleCompleteCurrentTask(), 150);
                          }
                          return next;
                        });
                      }}
                      className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-rose-950/90 border-2 border-rose-400 hover:scale-110 active:scale-90 flex items-center justify-center text-2xl shadow-lg cursor-pointer transition touch-manipulation"
                      style={{ left: `${b.x}%`, top: `${b.y}%` }}
                    >
                      {b.icon}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* TASK 6: ALIGN COMM FREQUENCY */}
          {currentTask === 'align_freq' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-black text-white">
                  📡 {isEn ? 'Task: Calibrate Subspace Telemetry' : 'Sarcină: Sincronizare Frecvență Radio'}
                </h4>
                <p className="text-xs text-slate-400">
                  {isEn ? 'Match Frequency and Power levels to the green Target marks!' : 'Potrivește Frecvența și Puterea exact pe ținta verde!'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono font-bold">
                    <span className="text-cyan-300">
                      {isEn ? 'Frequency:' : 'Frecvență:'} {playerFreq} GHz
                    </span>
                    <span className="text-emerald-400">
                      {isEn ? 'Target:' : 'Țintă:'} {targetFreq} GHz
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={7}
                    value={playerFreq}
                    onChange={(e) => setPlayerFreq(Number(e.target.value))}
                    className="w-full h-9 accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono font-bold">
                    <span className="text-cyan-300">
                      {isEn ? 'Signal Power:' : 'Putere Semnal:'} {playerAmp}%
                    </span>
                    <span className="text-emerald-400">
                      {isEn ? 'Target:' : 'Țintă:'} {targetAmp}% (±8%)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={90}
                    value={playerAmp}
                    onChange={(e) => setPlayerAmp(Number(e.target.value))}
                    className="w-full h-9 accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* INCOMING SABOTAGE DEFENSE OVERLAYS */}
          {/* ======================================================== */}

          {/* 1. BLACKOUT LIGHTS OUT SPOTLIGHT */}
          {isBlackoutActive && !matchResult && (
            <div
              className="absolute inset-0 z-20 pointer-events-none"
              style={{
                background: `radial-gradient(circle 85px at ${spotlightPos.x}% ${spotlightPos.y}%, transparent 0%, rgba(2, 6, 23, 0.96) 100%)`,
              }}
            />
          )}

          {/* 2. ADWARE POP-UPS */}
          {activePopups.length > 0 && !matchResult && (
            <div className="absolute inset-0 z-30 pointer-events-none">
              {activePopups.map((pop) => (
                <div
                  key={pop.id}
                  className={`pointer-events-auto absolute w-52 sm:w-60 p-3 rounded-xl border-2 ${pop.color} shadow-2xl text-white`}
                  style={{ left: `${pop.xPct}%`, top: `${pop.yPct}%` }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-mono font-black leading-tight">
                      ⚠️ {isEn ? pop.titleEn : pop.titleRo}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        playTone(720, 0.06, 'sine', 0.07);
                        setActivePopups((prev) => prev.filter((p) => p.id !== pop.id));
                      }}
                      className="w-8 h-8 rounded-lg bg-rose-600 hover:bg-rose-500 flex items-center justify-center shrink-0 cursor-pointer touch-manipulation"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3. CRYO-FREEZE SHATTER SHIELD */}
          {iceHitsLeft > 0 && !matchResult && (
            <button
              type="button"
              onClick={() => {
                playTone(880, 0.06, 'triangle', 0.08, 420);
                setIceHitsLeft((n) => Math.max(0, n - 1));
              }}
              className="absolute inset-0 z-40 bg-cyan-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center cursor-pointer touch-manipulation"
            >
              <Snowflake className="w-14 h-14 text-cyan-300 animate-spin mb-2" />
              <div className="text-xl font-black text-white font-heading">
                {isEn ? 'CONSOLE FROZEN!' : 'CONSOLĂ ÎNGHEȚATĂ!'}
              </div>
              <p className="text-xs text-cyan-200 mt-1">
                {isEn ? `Tap rapidly ${iceHitsLeft} more times to shatter the ice!` : `Apasă rapid încă de ${iceHitsLeft} ori ca să spargi gheața!`}
              </p>
            </button>
          )}

          {/* 4. REACTOR MELTDOWN ALARM */}
          {meltdownActive && !matchResult && (
            <div className="absolute inset-0 z-40 bg-rose-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-5 text-center space-y-4">
              <div className="flex items-center gap-2 text-rose-300 font-black text-lg animate-pulse">
                <ShieldAlert className="w-6 h-6" />
                <span>{isEn ? 'REACTOR MELTDOWN SABOTAGE!' : 'SABOTAJ: SUPRAÎNCĂLZIRE REACTOR!'}</span>
              </div>
              <p className="text-xs text-rose-200">
                {isEn ? 'Press all 3 Emergency Stabilizer Valves to resume tasks!' : 'Apasă toate cele 3 Valve de Stabilizare ca să continui!'}
              </p>
              <div className="flex items-center gap-3">
                {meltdownValves.map((pressed, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={pressed}
                    onClick={() => {
                      playTone(540 + idx * 90, 0.08, 'triangle', 0.08);
                      setMeltdownValves((prev) => {
                        const next = prev.map((v, i) => (i === idx ? true : v));
                        if (next.every(Boolean)) {
                          setMeltdownActive(false);
                        }
                        return next;
                      });
                    }}
                    className={`min-h-[56px] px-4 py-3 rounded-2xl border-2 font-black text-xs cursor-pointer transition touch-manipulation ${
                      pressed
                        ? 'bg-emerald-600 border-emerald-400 text-white'
                        : 'bg-rose-700 hover:bg-rose-600 border-amber-300 text-white active:scale-95'
                    }`}
                  >
                    {pressed ? '✓ OK' : `⚡ V${idx + 1}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MATCH RESULT OVERLAY */}
          {matchResult && (
            <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl ${
                  matchResult.won ? 'bg-gradient-to-br from-amber-400 to-emerald-600 text-white' : 'bg-rose-900 text-rose-200'
                }`}
              >
                <Trophy className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-2xl font-black text-white font-heading">
                  {matchResult.won ? (isEn ? 'CREWMATE VICTORY! 🚀' : 'VICTORIE DE ECHIPAJ! 🚀') : isEn ? 'SABOTAGED!' : 'DEPĂȘIT DE RIVAL!'}
                </h4>
                <p className="text-xs text-slate-300 mt-1">{isEn ? matchResult.reasonEn : matchResult.reasonRo}</p>
              </div>
              <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-sm font-black">
                <span className="text-cyan-300">
                  {matchResult.myTasks}/{TOTAL_TASKS_GOAL}
                </span>
                <span className="text-slate-600">vs</span>
                <span className="text-rose-300">
                  {matchResult.oppTasks}/{TOTAL_TASKS_GOAL}
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

        {/* SABOTAGE ATTACK DOCK */}
        <div className="lg:col-span-4 p-4 rounded-3xl bg-slate-950 border border-rose-500/40 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black text-rose-300 uppercase tracking-wider">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>{isEn ? 'Sabotage Arsenal' : 'Arsenal Sabotaje'}</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-mono text-xs font-black tabular-nums">
              {sabotageCharges} / 3 ⚡
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            {isEn
              ? 'Each repaired task charges +1 ⚡ Sabotage! Launch them immediately to disrupt your rival!'
              : 'Fiecare sarcină rezolvată îți încarcă +1 ⚡ Sabotaj! Lansează-le ca să încurci adversarul!'}
          </p>

          <div className="space-y-2.5">
            {SABOTAGES.map((sab) => {
              const ready = sabotageCharges >= sab.cost && !matchResult;
              return (
                <button
                  key={sab.type}
                  type="button"
                  disabled={!ready}
                  onClick={() => handleLaunchSabotage(sab)}
                  className={`w-full min-h-[56px] p-3 rounded-2xl border bg-gradient-to-r ${sab.btnClass} text-left text-white transition active:scale-95 flex items-center justify-between gap-2.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation shadow-md`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-black/25 flex items-center justify-center shrink-0">
                      {sab.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-black truncate">{isEn ? sab.nameEn : sab.nameRo}</div>
                      <div className="text-[10px] text-white/80 truncate">{isEn ? sab.descEn : sab.descRo}</div>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-black/30 font-mono text-xs font-black shrink-0">
                    {sab.cost}⚡
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              {isEn ? 'Score:' : 'Scor:'} <strong className="text-white">{score} XP</strong>
            </span>
            <span>
              <CheckCircle2 className="w-3.5 h-3.5 inline text-amber-400 mr-1" />
              {isEn ? 'Sent:' : 'Trimise:'} <strong className="text-amber-300">{sabotagesSentCount}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
