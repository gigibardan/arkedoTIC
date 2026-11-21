import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Trophy,
  RotateCcw,
  Clock,
  Flame,
  Zap,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Users,
  Cpu,
  AlertTriangle,
  WifiOff,
  Lock,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  DuelRoomData,
  ViceLeonidaSyncEvent,
  ViceLeonidaAttackType,
  sendViceLeonidaEvent,
  updateDuelProgress,
} from '../../lib/duelService';
import { recordStudentDuelResult } from '../../lib/studentAuthService';
import { forceScrollToTop } from '../../utils/scrollHelper';

interface ViceLeonidaDuelGameProps {
  roomData?: DuelRoomData | null;
  isHost?: boolean;
  studentName?: string;
  studentAvatar?: string;
  onFinish?: (score: number, won: boolean) => void;
  onBack?: () => void;
}

const TARGET_VAULT_POINTS = 2500;
const MATCH_DURATION_SEC = 90;
const CANVAS_W = 520;
const CANVAS_H = 320;
const LANE_COUNT = 4;
const ROAD_LEFT = 56;
const ROAD_W = CANVAS_W - 112;
const LANE_W = ROAD_W / LANE_COUNT;

interface AttackCard {
  type: ViceLeonidaAttackType;
  nameRo: string;
  nameEn: string;
  descRo: string;
  descEn: string;
  cost: number;
  icon: React.ReactNode;
  btnClass: string;
}

const ATTACK_CARDS: AttackCard[] = [
  {
    type: 'roadblock',
    nameRo: 'Drone VCPD 3★',
    nameEn: 'VCPD Drones 3★',
    descRo: 'Lansează 3 drone pe benzile rivalului',
    descEn: 'Spawns 3 patrol drones on rival lanes',
    cost: 1,
    icon: <ShieldAlert className="w-4 h-4" />,
    btnClass: 'from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 border-rose-400/50',
  },
  {
    type: 'glitch',
    nameRo: 'Glitch Direcție',
    nameEn: 'Steer Glitch',
    descRo: 'Inversează stânga/dreapta rivalului 4s',
    descEn: 'Inverts rival left/right steering for 4s',
    cost: 1,
    icon: <AlertTriangle className="w-4 h-4" />,
    btnClass: 'from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 border-fuchsia-400/50',
  },
  {
    type: 'throttle',
    nameRo: 'Limitare Bandă',
    nameEn: 'Bandwidth Throttle',
    descRo: 'Frânează viteza până curăță cache-ul',
    descEn: 'Slows rival speed until Cache Flush',
    cost: 1,
    icon: <WifiOff className="w-4 h-4" />,
    btnClass: 'from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 border-amber-400/50',
  },
  {
    type: 'firewall_lock',
    nameRo: 'Firewall 4-Bit',
    nameEn: '4-Bit Firewall',
    descRo: 'Blochează Turbo rival până rezolvă binarul',
    descEn: 'Locks rival boost until binary solved',
    cost: 2,
    icon: <Lock className="w-4 h-4" />,
    btnClass: 'from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 border-cyan-400/50',
  },
];

interface GateQuiz {
  qRo: string;
  qEn: string;
  options: Array<{ label: string; correct: boolean }>;
}

const GATE_QUIZZES: GateQuiz[] = [
  {
    qRo: 'Binar: 1010₂ în zecimal = ?',
    qEn: 'Binary: 1010₂ in decimal = ?',
    options: [
      { label: '10', correct: true },
      { label: '12', correct: false },
      { label: '8', correct: false },
    ],
  },
  {
    qRo: 'Port standard pentru trafic securizat HTTPS?',
    qEn: 'Standard port for encrypted HTTPS?',
    options: [
      { label: '443', correct: true },
      { label: '80', correct: false },
      { label: '21', correct: false },
    ],
  },
  {
    qRo: 'C++: Ce valoare are `19 % 5` ?',
    qEn: 'C++: What is `19 % 5` ?',
    options: [
      { label: '4', correct: true },
      { label: '3', correct: false },
      { label: '5', correct: false },
    ],
  },
  {
    qRo: 'Poarta logică `1 XOR 1` returnează?',
    qEn: 'Logic gate `1 XOR 1` returns?',
    options: [
      { label: '0', correct: true },
      { label: '1', correct: false },
      { label: '2', correct: false },
    ],
  },
  {
    qRo: 'Câți MB sunt într-un GB binar?',
    qEn: 'How many MB in 1 binary GB?',
    options: [
      { label: '1024 MB', correct: true },
      { label: '100 MB', correct: false },
      { label: '512 MB', correct: false },
    ],
  },
];

interface RoadObj {
  id: number;
  kind: 'shard' | 'gate' | 'traffic' | 'drone';
  lane: number;
  x: number;
  y: number;
  color: string;
  speed: number;
}

export const ViceLeonidaDuelGame: React.FC<ViceLeonidaDuelGameProps> = ({
  roomData,
  isHost = true,
  studentName = 'Leonida Runner',
  studentAvatar = '🌴',
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
    ? (isHost ? roomData?.guest?.name : roomData?.host?.name) || (isEn ? 'Rival Courier' : 'Curier Rival')
    : 'Cyber-Bot Leonida';
  const opponentAvatar = isLivePvP
    ? (isHost ? roomData?.guest?.avatar : roomData?.host?.avatar) || '🏎️'
    : '🤖';

  const [hero, setHero] = useState<'lucia' | 'jason'>('lucia');
  const [myScore, setMyScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [charges, setCharges] = useState(1);
  const [attacksSent, setAttacksSent] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(MATCH_DURATION_SEC);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [activeGateQuiz, setActiveGateQuiz] = useState<GateQuiz | null>(null);

  // Active incoming sabotage states
  const [glitchUntil, setGlitchUntil] = useState(0);
  const [throttled, setThrottled] = useState(false);
  const [firewallTarget, setFirewallTarget] = useState<number | null>(null);
  const [firewallBits, setFirewallBits] = useState<number[]>([0, 0, 0, 0]);

  const [matchResult, setMatchResult] = useState<{
    won: boolean;
    myScore: number;
    oppScore: number;
    reasonRo: string;
    reasonEn: string;
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const finishedRef = useRef(false);
  const myScoreRef = useRef(0);
  const oppScoreRef = useRef(0);
  const heroRef = useRef<'lucia' | 'jason'>('lucia');
  const glitchUntilRef = useRef(0);
  const throttledRef = useRef(false);
  const sentEventsRef = useRef<ViceLeonidaSyncEvent[]>([]);
  const processedRemoteIdsRef = useRef<Set<string>>(new Set());

  const carRef = useRef({
    x: CANVAS_W / 2,
    targetLane: 1,
    invuln: 0,
    roadOffset: 0,
    spawnTimer: 22,
    shardTimer: 12,
    nextId: 1,
  });
  const objsRef = useRef<RoadObj[]>([]);

  useEffect(() => {
    forceScrollToTop();
  }, []);

  useEffect(() => {
    heroRef.current = hero;
  }, [hero]);

  useEffect(() => {
    glitchUntilRef.current = glitchUntil;
  }, [glitchUntil]);

  useEffect(() => {
    throttledRef.current = throttled;
  }, [throttled]);

  const playTone = useCallback(
    (freq: number, dur = 0.08, type: OscillatorType = 'triangle', vol = 0.08, endFreq?: number) => {
      if (!soundEnabled) return;
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
        if (endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(50, endFreq), ctx.currentTime + dur);
        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + dur);
      } catch {
        // ignore
      }
    },
    [soundEnabled]
  );

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2300);
  }, []);

  const concludeMatch = useCallback(
    (won: boolean, finalMyScore: number, finalOppScore: number, reasonRo: string, reasonEn: string) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      playTone(won ? 620 : 190, 0.22, won ? 'triangle' : 'sawtooth', 0.1, won ? 980 : 110);

      setMatchResult({
        won,
        myScore: finalMyScore,
        oppScore: finalOppScore,
        reasonRo,
        reasonEn,
      });

      const awardXP = (won ? 500 : 180) + Math.min(450, Math.round(finalMyScore / 6)) + attacksSent * 35;
      recordStudentDuelResult(won, 'vice_leonida_duel', awardXP);

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
            score: finalMyScore,
            finishedAt: Date.now(),
          },
          won ? myId : oppId || myId,
          won ? myName : oppName
        );
      }

      onFinish?.(awardXP, won);
    },
    [attacksSent, isHost, onFinish, playTone, roomData, studentName]
  );

  const addPoints = useCallback(
    (pts: number) => {
      if (finishedRef.current) return;
      const next = Math.min(TARGET_VAULT_POINTS, myScoreRef.current + pts);
      myScoreRef.current = next;
      setMyScore(next);

      const pct = Math.min(100, Math.round((next / TARGET_VAULT_POINTS) * 100));
      if (roomData?.roomCode && next < TARGET_VAULT_POINTS) {
        updateDuelProgress(roomData.roomCode, isHost, {
          progress: pct,
          score: next,
        });
      }

      if (next >= TARGET_VAULT_POINTS) {
        concludeMatch(
          true,
          next,
          oppScoreRef.current,
          `Ai atins primul 2.500 puncte în Vice Leonida!`,
          `You reached 2,500 Leonida Vault Points first!`
        );
      }
    },
    [concludeMatch, isHost, roomData?.roomCode]
  );

  const triggerIncomingAttack = useCallback(
    (type: ViceLeonidaAttackType) => {
      if (finishedRef.current) return;
      playTone(170, 0.2, 'sawtooth', 0.1, 95);

      if (type === 'roadblock') {
        [0, 1, 2].forEach((i) => {
          const lane = Math.floor(Math.random() * LANE_COUNT);
          objsRef.current.push({
            id: carRef.current.nextId++,
            kind: 'drone',
            lane,
            x: ROAD_LEFT + lane * LANE_W + LANE_W / 2,
            y: -40 - i * 48,
            color: '#f43f5e',
            speed: 5.5,
          });
        });
        showToast(isEn ? '🚨 VCPD 3★ Drone Blockade ahead!' : '🚨 Baraj Drone VCPD 3★ în față!');
      } else if (type === 'glitch') {
        setGlitchUntil(Date.now() + 4000);
        showToast(isEn ? '⚡ STEERING GLITCHED (4s)!' : '⚡ DIRECȚIE INVERSATĂ (4s)!');
      } else if (type === 'throttle') {
        setThrottled(true);
        showToast(isEn ? '📶 BANDWIDTH THROTTLED! Tap Flush Cache!' : '📶 VITEZĂ LIMITATĂ! Apasă Curăță Cache!');
      } else if (type === 'firewall_lock') {
        setFirewallTarget(5 + Math.floor(Math.random() * 10)); // 5..14
        setFirewallBits([0, 0, 0, 0]);
        showToast(isEn ? '🔒 4-BIT FIREWALL LOCK! Solve binary!' : '🔒 BLOCAJ FIREWALL 4-BIT! Rezolvă binarul!');
      }
    },
    [isEn, playTone, showToast]
  );

  const handleLaunchAttack = (card: AttackCard) => {
    if (finishedRef.current || charges < card.cost) return;
    setCharges((c) => Math.max(0, c - card.cost));
    setAttacksSent((n) => n + 1);
    addPoints(55);
    playTone(540, 0.14, 'square', 0.08, 820);
    showToast(
      isEn
        ? `🚀 Sent ${card.nameEn} to ${opponentName}!`
        : `🚀 Ai lansat „${card.nameRo}” către ${opponentName}!`
    );

    if (isLivePvP && roomData?.roomCode) {
      const evt: ViceLeonidaSyncEvent = {
        id: `vl_${isHost ? 'h' : 'g'}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        kind: card.type,
        createdAt: Date.now(),
      };
      const updated = [...sentEventsRef.current, evt].slice(-20);
      sentEventsRef.current = updated;
      sendViceLeonidaEvent(roomData.roomCode, isHost, updated);
    }
  };

  // Sync live PvP room state & incoming sabotage attacks
  useEffect(() => {
    if (!isLivePvP || !roomData) return;
    const opp = isHost ? roomData.guest : roomData.host;
    if (opp) {
      const remotePts = opp.score ?? Math.round((opp.progress / 100) * TARGET_VAULT_POINTS);
      oppScoreRef.current = remotePts;
      setOppScore(remotePts);
      if (opp.progress >= 100 && !finishedRef.current && myScoreRef.current < TARGET_VAULT_POINTS) {
        concludeMatch(
          false,
          myScoreRef.current,
          remotePts,
          `${opponentName} a câștigat cursa Vice Leonida 1v1!`,
          `${opponentName} won the Vice Leonida 1v1 race!`
        );
      }
    }

    const remoteEvents = isHost ? roomData.guestViceEvents : roomData.hostViceEvents;
    if (remoteEvents && remoteEvents.length > 0) {
      remoteEvents.forEach((evt) => {
        if (!processedRemoteIdsRef.current.has(evt.id)) {
          processedRemoteIdsRef.current.add(evt.id);
          triggerIncomingAttack(evt.kind);
        }
      });
    }
  }, [concludeMatch, isHost, isLivePvP, opponentName, roomData, triggerIncomingAttack]);

  // Countdown Clock + Solo Cyber-Bot Simulation
  useEffect(() => {
    if (matchResult) return;
    const t = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          const won = myScoreRef.current >= oppScoreRef.current;
          concludeMatch(
            won,
            myScoreRef.current,
            oppScoreRef.current,
            won ? 'Timp expirat! Ai strâns mai multe Vault Points!' : 'Timp expirat! Rivalul a fost mai rapid.',
            won ? 'Time up! You scored more Vault Points!' : 'Time up! Rival finished ahead.'
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [concludeMatch, matchResult]);

  useEffect(() => {
    if (isLivePvP || matchResult) return;
    const botProgTimer = setInterval(() => {
      if (finishedRef.current) return;
      const gain = 115 + Math.floor(Math.random() * 85);
      const next = Math.min(TARGET_VAULT_POINTS, oppScoreRef.current + gain);
      oppScoreRef.current = next;
      setOppScore(next);
      if (next >= TARGET_VAULT_POINTS) {
        concludeMatch(
          false,
          myScoreRef.current,
          next,
          'Cyber-Bot Leonida a atins primul 2.500 puncte!',
          'Cyber-Bot Leonida hit 2,500 points first!'
        );
      }
    }, 3400);

    const botAttackTimer = setInterval(() => {
      if (finishedRef.current) return;
      const pool: ViceLeonidaAttackType[] = ['roadblock', 'glitch', 'throttle', 'firewall_lock'];
      triggerIncomingAttack(pool[Math.floor(Math.random() * pool.length)]);
    }, 10500);

    return () => {
      clearInterval(botProgTimer);
      clearInterval(botAttackTimer);
    };
  }, [concludeMatch, isLivePvP, matchResult, triggerIncomingAttack]);

  // Steering helper
  const moveLane = useCallback((dir: -1 | 1) => {
    if (finishedRef.current) return;
    const isGlitched = glitchUntilRef.current > Date.now();
    const effectiveDir = isGlitched ? -dir : dir;
    carRef.current.targetLane = Math.max(0, Math.min(LANE_COUNT - 1, carRef.current.targetLane + effectiveDir));
    playTone(340, 0.04, 'sine', 0.04);
  }, [playTone]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') moveLane(-1);
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') moveLane(1);
      if (e.key === 'q' || e.key === 'Q') {
        setHero((prev) => (prev === 'lucia' ? 'jason' : 'lucia'));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [moveLane]);

  // 60FPS Duel Highway Canvas Loop
  useEffect(() => {
    if (matchResult) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(2.0, Math.max(0.4, (now - lastTime) / 16.6667));
      lastTime = now;

      const car = carRef.current;
      const isLucia = heroRef.current === 'lucia';
      const baseSpeed = throttledRef.current ? 3.2 : 6.2;

      const desiredX = ROAD_LEFT + car.targetLane * LANE_W + LANE_W / 2;
      car.x += (desiredX - car.x) * (isLucia ? 0.24 : 0.34) * dt;
      if (car.invuln > 0) car.invuln = Math.max(0, car.invuln - dt);
      car.roadOffset = (car.roadOffset + baseSpeed * dt) % 48;

      car.spawnTimer -= dt;
      if (car.spawnTimer <= 0) {
        const lane = Math.floor(Math.random() * LANE_COUNT);
        objsRef.current.push({
          id: car.nextId++,
          kind: Math.random() < 0.35 ? 'drone' : 'traffic',
          lane,
          x: ROAD_LEFT + lane * LANE_W + LANE_W / 2,
          y: -40,
          color: Math.random() < 0.5 ? '#f43f5e' : '#fb923c',
          speed: baseSpeed * 0.85,
        });
        car.spawnTimer = 32 + Math.random() * 16;
      }

      car.shardTimer -= dt;
      if (car.shardTimer <= 0) {
        const lane = Math.floor(Math.random() * LANE_COUNT);
        const isGate = Math.random() < 0.22;
        objsRef.current.push({
          id: car.nextId++,
          kind: isGate ? 'gate' : 'shard',
          lane,
          x: ROAD_LEFT + lane * LANE_W + LANE_W / 2,
          y: -30,
          color: isGate ? '#c084fc' : '#fbbf24',
          speed: baseSpeed,
        });
        car.shardTimer = 24 + Math.random() * 14;
      }

      const nextObjs: RoadObj[] = [];
      const carY = CANVAS_H - 58;
      for (const o of objsRef.current) {
        o.y += o.speed * dt;
        const hit = Math.abs(o.x - car.x) < 28 && Math.abs(o.y - carY) < 34;
        if (hit) {
          if (o.kind === 'shard') {
            addPoints(isLucia ? 95 : 75);
            playTone(760, 0.06, 'sine', 0.06, 980);
            continue;
          }
          if (o.kind === 'gate') {
            playTone(620, 0.1, 'triangle', 0.08, 940);
            setActiveGateQuiz(GATE_QUIZZES[Math.floor(Math.random() * GATE_QUIZZES.length)]);
            continue;
          }
          if (car.invuln <= 0) {
            car.invuln = 60;
            playTone(150, 0.18, 'sawtooth', 0.09, 80);
            const penalty = isLucia ? -90 : -50;
            myScoreRef.current = Math.max(0, myScoreRef.current + penalty);
            setMyScore(myScoreRef.current);
          }
          continue;
        }
        if (o.y < CANVAS_H + 50) nextObjs.push(o);
      }
      objsRef.current = nextObjs;

      // Render Highway
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(ROAD_LEFT, 0, ROAD_W, CANVAS_H);

      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ROAD_LEFT, 0);
      ctx.lineTo(ROAD_LEFT, CANVAS_H);
      ctx.stroke();

      ctx.strokeStyle = '#22d3ee';
      ctx.beginPath();
      ctx.moveTo(ROAD_LEFT + ROAD_W, 0);
      ctx.lineTo(ROAD_LEFT + ROAD_W, CANVAS_H);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(244, 114, 182, 0.4)';
      ctx.lineWidth = 2;
      for (let l = 1; l < LANE_COUNT; l++) {
        const lx = ROAD_LEFT + l * LANE_W;
        for (let y = -48 + car.roadOffset; y < CANVAS_H + 48; y += 48) {
          ctx.beginPath();
          ctx.moveTo(lx, y);
          ctx.lineTo(lx, y + 24);
          ctx.stroke();
        }
      }

      // Draw Objects
      for (const o of objsRef.current) {
        ctx.save();
        ctx.translate(o.x, o.y);
        if (o.kind === 'shard') {
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(0, 0, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#020617';
          ctx.font = 'bold 9px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('+DATA', 0, 0);
        } else if (o.kind === 'gate') {
          ctx.fillStyle = 'rgba(168, 85, 247, 0.35)';
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(-28, -14, 56, 28, 8);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#f3e8ff';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('BOOST GATE', 0, 0);
        } else {
          ctx.fillStyle = '#1e293b';
          ctx.strokeStyle = o.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(-16, -22, 32, 44, 7);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = o.kind === 'drone' ? '#ef4444' : '#f97316';
          ctx.font = 'bold 8px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(o.kind === 'drone' ? 'VCPD' : 'CAR', 0, 3);
        }
        ctx.restore();
      }

      // Draw Player Car
      if (car.invuln <= 0 || Math.floor(car.invuln / 5) % 2 === 0) {
        ctx.save();
        ctx.translate(car.x, carY);
        const hCol = isLucia ? '#f472b6' : '#fbbf24';
        ctx.fillStyle = '#090d16';
        ctx.strokeStyle = hCol;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(-15, -24, 30, 48, 8);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = hCol;
        ctx.fillRect(-3, -20, 6, 40);
        ctx.fillStyle = '#22d3ee';
        ctx.fillRect(-10, -11, 20, 9);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [addPoints, matchResult, playTone]);

  const myPct = Math.min(100, Math.round((myScore / TARGET_VAULT_POINTS) * 100));
  const oppPct = Math.min(100, Math.round((oppScore / TARGET_VAULT_POINTS) * 100));
  const isGlitched = glitchUntil > Date.now();
  const fwValue = firewallBits.reduce((acc, b, idx) => acc + b * Math.pow(2, 3 - idx), 0);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/95 border border-fuchsia-500/40 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-fuchsia-400" />
            <span>{isEn ? 'Lobby' : 'Înapoi'}</span>
          </button>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-black text-white font-heading truncate">
              🌴 {isEn ? 'Vice Leonida 1v1: Cyber Heist Showdown' : 'Vice Leonida 1v1: Cursa Cyber-Heist'}
            </h2>
            <p className="text-[11px] text-slate-400">
              {isEn ? `First to ${TARGET_VAULT_POINTS.toLocaleString()} pts or lead at 90s wins!` : `Primul la ${TARGET_VAULT_POINTS.toLocaleString()} pts sau scor maxim la 90s câștigă!`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-rose-500/40 text-rose-300 font-mono font-black text-sm flex items-center gap-1.5 tabular-nums">
            <Clock className="w-4 h-4" />
            <span>{timeRemaining}s</span>
          </div>
          <button
            type="button"
            onClick={() => setSoundEnabled((s) => !s)}
            aria-label="Toggle sound"
            className="min-w-[38px] min-h-[38px] rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          </button>
        </div>
      </div>

      {/* Live Sector Duel Radar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-fuchsia-300 font-bold truncate">
            {studentAvatar} {studentName}: {myScore.toLocaleString()} / {TARGET_VAULT_POINTS.toLocaleString()} ({myPct}%)
          </span>
          <span className="text-amber-300 font-bold truncate">
            {opponentAvatar} {opponentName}: {oppScore.toLocaleString()} ({oppPct}%)
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="h-3 rounded-full bg-slate-950 border border-fuchsia-500/30 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-fuchsia-600 to-cyan-400 transition-all duration-300" style={{ width: `${Math.max(4, myPct)}%` }} />
          </div>
          <div className="h-3 rounded-full bg-slate-950 border border-amber-500/30 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-600 to-amber-400 transition-all duration-300" style={{ width: `${Math.max(4, oppPct)}%` }} />
          </div>
        </div>
        {toastMsg && (
          <div className="px-3 py-1.5 rounded-xl bg-fuchsia-950/90 border border-fuchsia-400/50 text-xs font-bold text-fuchsia-200 text-center">
            {toastMsg}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Live Highway Canvas + Boost Quiz / Sabotage Defense */}
        <div className="lg:col-span-8 relative bg-slate-950 border-2 border-fuchsia-500/40 rounded-3xl overflow-hidden shadow-2xl">
          <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className="w-full aspect-[13/8] block" />

          {/* Active Gate ICT Boost Quiz Popup */}
          {activeGateQuiz && !matchResult && (
            <div className="absolute inset-x-3 top-3 bg-slate-900/95 border-2 border-purple-400 rounded-2xl p-3.5 shadow-2xl space-y-2.5 z-20">
              <div className="flex items-center justify-between text-[11px] font-mono text-purple-300 font-bold">
                <span>⚡ LEONIDA BOOST GATE (+250 PTS +1 ATTACK)</span>
                <button
                  type="button"
                  onClick={() => setActiveGateQuiz(null)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs sm:text-sm font-black text-white">
                {isEn ? activeGateQuiz.qEn : activeGateQuiz.qRo}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {activeGateQuiz.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (opt.correct) {
                        playTone(720, 0.14, 'triangle', 0.09, 1020);
                        addPoints(250);
                        setCharges((c) => Math.min(3, c + 1));
                        showToast(isEn ? '⚡ GATE CRACKED! +250 pts & +1 Charge!' : '⚡ POARTĂ SPARTĂ! +250 pts & +1 Încărcare!');
                      } else {
                        playTone(170, 0.16, 'sawtooth', 0.08);
                        showToast(isEn ? 'Wrong answer on Gate!' : 'Răspuns greșit la Poartă!');
                      }
                      setActiveGateQuiz(null);
                    }}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-purple-800 border border-slate-700 hover:border-purple-300 text-xs font-bold text-white cursor-pointer"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Incoming Sabotage: Bandwidth Throttle Clear */}
          {throttled && !matchResult && (
            <div className="absolute top-3 left-3 z-10">
              <button
                type="button"
                onClick={() => {
                  setThrottled(false);
                  playTone(620, 0.1, 'sine', 0.08);
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black shadow-lg cursor-pointer animate-bounce"
              >
                {isEn ? '📶 FLUSH CACHE (Restore Speed!)' : '📶 CURĂȚĂ CACHE (Restabilește Viteza!)'}
              </button>
            </div>
          )}

          {/* Active Incoming Sabotage: 4-Bit Firewall Lock */}
          {firewallTarget !== null && !matchResult && (
            <div className="absolute inset-x-4 bottom-16 bg-slate-900/95 border-2 border-cyan-400 rounded-2xl p-3.5 shadow-2xl space-y-2 z-20">
              <div className="flex justify-between items-center text-xs font-mono text-cyan-300 font-bold">
                <span>🔒 {isEn ? `UNLOCK FIREWALL: MAKE ${firewallTarget}` : `DEBLOCHEAZĂ FIREWALL: FORMEAZĂ ${firewallTarget}`}</span>
                <span className="tabular-nums">{fwValue} / {firewallTarget}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[8, 4, 2, 1].map((w, i) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => {
                      const next = [...firewallBits];
                      next[i] = next[i] === 1 ? 0 : 1;
                      setFirewallBits(next);
                      const sum = next.reduce((acc, b, idx) => acc + b * Math.pow(2, 3 - idx), 0);
                      if (sum === firewallTarget) {
                        setFirewallTarget(null);
                        playTone(760, 0.12, 'triangle', 0.09);
                        showToast(isEn ? '🔓 Firewall Unlocked!' : '🔓 Firewall Deblocat!');
                      }
                    }}
                    className={`p-2 rounded-xl border font-mono text-xs font-black cursor-pointer ${
                      firewallBits[i] === 1 ? 'bg-cyan-600 border-cyan-300 text-white' : 'bg-slate-950 border-slate-700 text-slate-300'
                    }`}
                  >
                    {w} ({firewallBits[i]})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Steer Controls Bar */}
          <div className="bg-slate-900/95 border-t border-slate-800 px-3 py-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => moveLane(-1)}
                aria-label="Lane Left"
                className="w-12 h-10 rounded-xl bg-slate-800 active:bg-fuchsia-600 border border-slate-700 text-white flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => moveLane(1)}
                aria-label="Lane Right"
                className="w-12 h-10 rounded-xl bg-slate-800 active:bg-cyan-600 border border-slate-700 text-white flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              {isGlitched && (
                <span className="text-[11px] font-mono font-bold text-fuchsia-400">
                  ⚡ {isEn ? 'GLITCHED!' : 'INVERSAT!'}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setHero((prev) => (prev === 'lucia' ? 'jason' : 'lucia'))}
              className={`min-h-[40px] px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                hero === 'lucia'
                  ? 'bg-fuchsia-950 border-fuchsia-400 text-fuchsia-200'
                  : 'bg-amber-950 border-amber-400 text-amber-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{hero === 'lucia' ? 'Lucia (+Pts) [Q]' : 'Jason (+Grip) [Q]'}</span>
            </button>
          </div>
        </div>

        {/* Right: Sabotage Deck */}
        <div className="lg:col-span-4 bg-slate-900/95 border border-slate-800 rounded-3xl p-4 flex flex-col justify-between gap-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                {isEn ? 'Leonida Sabotage Deck' : 'Atacuri Sabotaj Leonida'}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-mono font-black tabular-nums">
                ⚡ {charges}/3
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {ATTACK_CARDS.map((card) => (
                <button
                  key={card.type}
                  type="button"
                  disabled={charges < card.cost || !!matchResult}
                  onClick={() => handleLaunchAttack(card)}
                  className={`p-3 rounded-2xl bg-gradient-to-r ${card.btnClass} border text-left text-white transition active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black flex items-center gap-1.5">
                      {card.icon}
                      <span>{isEn ? card.nameEn : card.nameRo}</span>
                    </span>
                    <span className="text-[10px] font-mono bg-black/30 px-2 py-0.5 rounded">
                      ⚡ {card.cost}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/85 mt-1">
                    {isEn ? card.descEn : card.descRo}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <Cpu className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              {isEn
                ? 'Hit purple BOOST GATES on the highway to earn +250 pts and +1 Sabotage Charge!'
                : 'Intră prin porțile mov BOOST GATE pe autostradă ca să câștigi +250 pts și +1 Încărcare Sabotaj!'}
            </span>
          </div>
        </div>
      </div>

      {/* Match Result Overlay Modal */}
      {matchResult && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border-2 border-amber-400/60 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-amber-500 mx-auto flex items-center justify-center text-white shadow-xl">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white font-heading">
              {matchResult.won
                ? (isEn ? 'VICTORY IN VICE LEONIDA! 🏆' : 'VICTORIE ÎN VICE LEONIDA! 🏆')
                : (isEn ? 'RIVAL TOOK THE VAULT!' : 'RIVALUL A CÂȘTIGAT CURSA!')}
            </h3>
            <p className="text-xs text-slate-300">{isEn ? matchResult.reasonEn : matchResult.reasonRo}</p>
            <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 font-mono text-xs tabular-nums">
              <div>
                <span className="text-slate-400 block">{studentName}</span>
                <strong className="text-cyan-300 text-lg">{matchResult.myScore.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">{opponentName}</span>
                <strong className="text-amber-300 text-lg">{matchResult.oppScore.toLocaleString()}</strong>
              </div>
            </div>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 min-h-[44px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isEn ? 'Back to Duel Lobby' : 'Înapoi la Arena Duel'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
