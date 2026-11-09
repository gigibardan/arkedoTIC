import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Cpu,
  Zap,
  Activity,
  Flame,
  Swords,
  Trophy,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Wifi,
  Clock,
  Compass,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Power,
  Sliders,
  HardDrive
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { DuelRoomData, DuelPlayer, updateDuelProgress } from '../../lib/duelService';
import { recordStudentDuelResult } from '../../lib/studentAuthService';

// Progressive milestone thresholds for Firebase quota protection
const MILESTONES = [20, 40, 60, 80, 100] as const;

interface RotatingComponent {
  id: string;
  nameRo: string;
  nameEn: string;
  slotRo: string;
  slotEn: string;
  targetAngle: number; // 0, 90, 180, 270
  currentAngle: number;
  icon: string;
  aligned: boolean;
}

interface WireTerminal {
  id: string;
  label: string;
  color: string;
  sourceX: number;
  sourceY: number;
  destX: number;
  destY: number;
  connected: boolean;
}

interface SparkSurge {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  deflected: boolean;
}

interface BreakerSwitch {
  id: number;
  label: string;
  currentState: boolean;
  requiredState: boolean;
}

interface CircuitOverdriveDuelGameProps {
  roomData?: DuelRoomData | null;
  isHost?: boolean;
  studentName?: string;
  studentAvatar?: string;
  onFinish?: (score: number, isWinner: boolean) => void;
  onBack?: () => void;
}

export const CircuitOverdriveDuelGame: React.FC<CircuitOverdriveDuelGameProps> = ({
  roomData,
  isHost = true,
  studentName = 'Campion TIC',
  studentAvatar = '⚡',
  onFinish,
  onBack,
}) => {
  const { lang } = useLanguage();

  // Arena & Gameplay State
  const [stage, setStage] = useState<number>(1); // 1 to 5
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<{ text: string; color: string } | null>(null);
  const [hasFinishedLocal, setHasFinishedLocal] = useState<boolean>(false);

  // Screen lock & position refs
  const arenaRef = useRef<HTMLDivElement>(null);
  const reachedMilestonesRef = useRef<Set<number>>(new Set());
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  // Opponent tracking
  const me: DuelPlayer | null = roomData ? (isHost ? roomData.host : roomData.guest || null) : null;
  const opponent: DuelPlayer | null = roomData ? (isHost ? roomData.guest || null : roomData.host) : null;

  // ==========================================
  // STAGE 1: SCROLL-TO-ROTATE ALIGNMENT
  // ==========================================
  const [components, setComponents] = useState<RotatingComponent[]>([
    { id: 'cpu', nameRo: 'Procesor Octa-Core (CPU)', nameEn: 'Octa-Core CPU', slotRo: 'Socket LGA-1700', slotEn: 'LGA-1700 Socket', targetAngle: 180, currentAngle: 0, icon: '🧠', aligned: false },
    { id: 'cooler', nameRo: 'Radiator Răcire Cupru', nameEn: 'Copper Heatsink Cooler', slotRo: 'Suport Răcire', slotEn: 'Cooling Bracket', targetAngle: 90, currentAngle: 0, icon: '❄️', aligned: false },
    { id: 'ram', nameRo: 'Modul Memorie DDR5', nameEn: 'DDR5 RAM Module', slotRo: 'Slot DIMM A2', slotEn: 'DIMM A2 Slot', targetAngle: 270, currentAngle: 0, icon: '⚡', aligned: false },
    { id: 'gpu', nameRo: 'Placă Video PCIe 5.0', nameEn: 'PCIe 5.0 GPU Card', slotRo: 'Slot PCIe x16', slotEn: 'PCIe x16 Slot', targetAngle: 90, currentAngle: 0, icon: '🎮', aligned: false },
  ]);
  const [activeCompIdx, setActiveCompIdx] = useState<number>(0);

  // ==========================================
  // STAGE 2: BUS & WIRE PRECISION ROUTING
  // ==========================================
  const [wires, setWires] = useState<WireTerminal[]>([
    { id: 'w1', label: '12V ATX Power Rail', color: '#eab308', sourceX: 15, sourceY: 25, destX: 85, destY: 25, connected: false },
    { id: 'w2', label: '5V VRM Bus Core', color: '#06b6d4', sourceX: 15, sourceY: 45, destX: 85, destY: 45, connected: false },
    { id: 'w3', label: 'GND Ground Shield', color: '#10b981', sourceX: 15, sourceY: 65, destX: 85, destY: 65, connected: false },
    { id: 'w4', label: 'Data Bus PCIe Lane', color: '#a855f7', sourceX: 15, sourceY: 85, destX: 85, destY: 85, connected: false },
  ]);
  const [activeWireId, setActiveWireId] = useState<string | null>(null);

  // ==========================================
  // STAGE 3: VOLTAGE SURGE DEFLECTOR
  // ==========================================
  const [sparks, setSparks] = useState<SparkSurge[]>([
    { id: 's1', x: 20, y: 30, vx: 0.9, vy: 0.8, deflected: false },
    { id: 's2', x: 75, y: 40, vx: -0.8, vy: 0.7, deflected: false },
    { id: 's3', x: 35, y: 65, vx: 0.7, vy: -0.9, deflected: false },
    { id: 's4', x: 65, y: 70, vx: -0.9, vy: -0.8, deflected: false },
  ]);
  const [deflectedSparksCount, setDeflectedSparksCount] = useState<number>(0);

  // ==========================================
  // STAGE 4: CIRCUIT BREAKER OVERLOAD RESET
  // ==========================================
  const [breakers, setBreakers] = useState<BreakerSwitch[]>([
    { id: 1, label: 'PWR_PRI', currentState: false, requiredState: true },
    { id: 2, label: 'VRM_AUX', currentState: true, requiredState: false },
    { id: 3, label: 'FAN_PWM', currentState: false, requiredState: true },
    { id: 4, label: 'IO_SHLD', currentState: false, requiredState: true },
    { id: 5, label: 'SATA_BUS', currentState: true, requiredState: false },
    { id: 6, label: 'CPU_CORE', currentState: false, requiredState: true },
  ]);

  // ==========================================
  // STAGE 5: CPU CLOCK OSCILLOSCOPE (CLIMAX)
  // ==========================================
  const [clockFrequency, setClockFrequency] = useState<number>(2.4); // 2.4 to 5.0 GHz
  const [targetFrequency, setTargetFrequency] = useState<number>(3.8);
  const [oscPulseT, setOscPulseT] = useState<number>(0);
  const [clockCyclesMatched, setClockCyclesMatched] = useState<number>(0);

  // Sound feedback trigger
  const triggerFeedback = (text: string, color: string = 'text-emerald-400') => {
    setFeedbackText({ text, color });
    setTimeout(() => setFeedbackText(null), 900);
  };

  // Safe Progress sync to Firestore (Milestones only)
  const syncProgressToDb = useCallback(
    (progressPct: number, currentScore: number) => {
      if (!roomData?.roomCode) return;

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

  const registerHit = (points: number, label: string = 'ALIGNED!') => {
    setCombo(prev => prev + 1);
    const multiplier = combo >= 6 ? 1.4 : combo >= 3 ? 1.2 : 1.0;
    const gained = Math.round(points * multiplier);
    setScore(prev => prev + gained);
    triggerFeedback(`${label} +${gained}`, 'text-amber-300');
    sounds.playCorrect();
  };

  const registerMiss = (penalty: number = 3) => {
    setCombo(0);
    setScore(prev => Math.max(0, prev - penalty));
    triggerFeedback(lang === 'en' ? 'SHORT CIRCUIT! -3' : 'SCURTCIRCUIT! -3', 'text-rose-400');
    sounds.playError();
  };

  // Prevent scroll globally during match
  useEffect(() => {
    const handleWheelBlock = (e: WheelEvent) => {
      e.preventDefault();
    };

    const handleTouchMoveBlock = (e: TouchEvent) => {
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

  // Finish match logic
  const finishMatch = useCallback(() => {
    if (hasFinishedLocal) return;
    setHasFinishedLocal(true);
    sounds.playVictory();

    const finalScore = score + 45;
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
    recordStudentDuelResult(won, 'circuit_overdrive', finalScore);

    if (onFinish) {
      onFinish(finalScore, won);
    }
  }, [hasFinishedLocal, score, roomData?.roomCode, isHost, me?.id, me?.name, opponent, onFinish]);

  // Pointer move inside arena
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const xPct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setCursorPos({ x: xPct, y: yPct });
  };

  // Stage 1: Scroll Wheel Component Rotation
  const handleWheelRotate = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (stage !== 1) return;
    const delta = e.deltaY;
    const dir = delta > 0 ? 90 : -90;

    setComponents(prev =>
      prev.map((c, idx) => {
        if (idx !== activeCompIdx || c.aligned) return c;
        const newAngle = (c.currentAngle + dir + 360) % 360;
        sounds.playClick();
        return { ...c, currentAngle: newAngle };
      })
    );
  };

  // Touch rotation buttons fallback
  const handleManualRotate = (dir: 90 | -90) => {
    if (stage !== 1) return;
    sounds.playClick();
    setComponents(prev =>
      prev.map((c, idx) => {
        if (idx !== activeCompIdx || c.aligned) return c;
        const newAngle = (c.currentAngle + dir + 360) % 360;
        return { ...c, currentAngle: newAngle };
      })
    );
  };

  // Stage 1: Lock component into socket
  const handleLockComponent = () => {
    const comp = components[activeCompIdx];
    if (!comp) return;

    if (comp.currentAngle === comp.targetAngle) {
      sounds.playSuccess();
      registerHit(12, lang === 'en' ? 'PINS LOCKED! 🔌' : 'PINI BLOCAȚI! 🔌');
      setComponents(prev =>
        prev.map((c, idx) => (idx === activeCompIdx ? { ...c, aligned: true } : c))
      );

      const nextIdx = activeCompIdx + 1;
      setActiveCompIdx(nextIdx);

      if (nextIdx >= components.length) {
        syncProgressToDb(20, score + 20);
        setTimeout(() => setStage(2), 500);
      }
    } else {
      registerMiss(4);
    }
  };

  // Stage 2: Connect Wire
  const handleWireConnect = (wireId: string) => {
    sounds.playSuccess();
    registerHit(10, lang === 'en' ? 'BUS TERMINAL ROUTED!' : 'CALE TERMINAL CONECTATĂ!');
    setWires(prev =>
      prev.map(w => (w.id === wireId ? { ...w, connected: true } : w))
    );

    const remaining = wires.filter(w => w.id !== wireId && !w.connected);
    if (remaining.length === 0) {
      syncProgressToDb(40, score + 25);
      setTimeout(() => setStage(3), 500);
    }
  };

  // Stage 3: Voltage Sparks Physics Loop
  useEffect(() => {
    if (stage !== 3) return;

    const interval = setInterval(() => {
      setSparks(prevSparks =>
        prevSparks.map(s => {
          if (s.deflected) return s;

          let newX = s.x + s.vx;
          let newY = s.y + s.vy;
          let newVx = s.vx;
          let newVy = s.vy;

          if (newX <= 12 || newX >= 88) newVx = -newVx;
          if (newY <= 15 || newY >= 85) newVy = -newVy;

          // Repulsor distance to cursor
          const dx = cursorPos.x - newX;
          const dy = cursorPos.y - newY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 10) {
            // Deflect towards nearest ground capacitor
            const angle = Math.atan2(newY - cursorPos.y, newX - cursorPos.x);
            newVx = Math.cos(angle) * 1.6;
            newVy = Math.sin(angle) * 1.6;
          }

          // Ground Capacitor check (x: 50, y: 15) or (x: 50, y: 85)
          const distGnd1 = Math.sqrt((50 - newX) ** 2 + (15 - newY) ** 2);
          const distGnd2 = Math.sqrt((50 - newX) ** 2 + (85 - newY) ** 2);

          if (distGnd1 < 8 || distGnd2 < 8) {
            sounds.playSuccess();
            registerHit(10, lang === 'en' ? 'GROUND DISCHARGED! ⚡' : 'IMPULS DESCĂRCAT GND! ⚡');
            setDeflectedSparksCount(c => {
              const updated = c + 1;
              if (updated >= 4) {
                syncProgressToDb(60, score + 15);
                setTimeout(() => setStage(4), 500);
              }
              return updated;
            });
            return { ...s, deflected: true };
          }

          return { ...s, x: newX, y: newY, vx: newVx, vy: newVy };
        })
      );
    }, 30);

    return () => clearInterval(interval);
  }, [stage, cursorPos, lang, score, syncProgressToDb]);

  // Stage 4: Toggle Breaker Switch
  const handleToggleBreaker = (switchId: number) => {
    sounds.playClick();
    setBreakers(prev => {
      const updated = prev.map(b =>
        b.id === switchId ? { ...b, currentState: !b.currentState } : b
      );

      const allCorrect = updated.every(b => b.currentState === b.requiredState);
      if (allCorrect) {
        sounds.playSuccess();
        registerHit(25, lang === 'en' ? 'ALL BREAKERS STABILIZED!' : 'TOATE SIGURANȚELE STABILIZATE!');
        syncProgressToDb(80, score + 30);
        setTimeout(() => setStage(5), 600);
      }
      return updated;
    });
  };

  // Stage 5: Oscilloscope Sine Wave Animation Loop
  useEffect(() => {
    if (stage !== 5) return;

    const interval = setInterval(() => {
      setOscPulseT(prev => (prev + 0.08) % (Math.PI * 2));
    }, 40);

    return () => clearInterval(interval);
  }, [stage]);

  // Stage 5: Lock Frequency Peak
  const handleLockFrequency = () => {
    // Current sine wave peak value is Math.sin(oscPulseT)
    const sinVal = Math.sin(oscPulseT);

    // Peak is when sinVal > 0.85
    if (sinVal > 0.85) {
      sounds.playSuccess();
      registerHit(15, lang === 'en' ? 'CLOCK HARMONIC LOCKED! ⏱️' : 'HARMONICĂ DE CEAS FIXATĂ! ⏱️');
      const nextFreq = parseFloat((clockFrequency + 0.6).toFixed(1));
      setClockFrequency(nextFreq);

      setClockCyclesMatched(c => {
        const updated = c + 1;
        if (updated >= 4) {
          finishMatch();
        }
        return updated;
      });
    } else {
      registerMiss(3);
    }
  };

  return (
    <div
      ref={arenaRef}
      onContextMenu={(e) => e.preventDefault()}
      onWheel={handleWheelRotate}
      onPointerMove={handlePointerMove}
      className="relative w-full max-w-5xl mx-auto rounded-3xl bg-slate-950 border-2 border-amber-500/50 shadow-2xl overflow-hidden select-none touch-none flex flex-col"
      style={{ touchAction: 'none' }}
    >
      {/* Top HUD Bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-amber-950/70 to-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-400 font-mono tracking-wider uppercase">
                {lang === 'en' ? `STAGE ${stage}/5` : `ETAPA ${stage}/5`}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 text-[10px] font-mono border border-amber-500/40 font-bold">
                {stage === 1 && (lang === 'en' ? 'Scroll-to-Rotate Alignment' : 'Aliniere Componente cu Rotița')}
                {stage === 2 && (lang === 'en' ? 'Bus & Wire Routing' : 'Cablare Trasee & Alimentare')}
                {stage === 3 && (lang === 'en' ? 'Voltage Surge Deflector' : 'Deflector Tensiune Înaltă')}
                {stage === 4 && (lang === 'en' ? 'Circuit Breaker Bank' : 'Panou Siguranțe Server')}
                {stage === 5 && (lang === 'en' ? 'CPU Clock Harmonic Calibration' : 'Calibrare Osciloscop GHz')}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white font-heading">
              Circuit Overdrive 🔧⚡
            </h3>
          </div>
        </div>

        {/* Live Score & Combo Multiplier */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono uppercase text-slate-400">
              {lang === 'en' ? 'Multiplier' : 'Multiplicator'}
            </span>
            <div className="flex items-center gap-1 font-mono text-amber-400 font-black text-base">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
              <span>x{combo >= 6 ? '1.4' : combo >= 3 ? '1.2' : '1.0'}</span>
              <span className="text-xs text-slate-400">({combo} streak)</span>
            </div>
          </div>

          <div className="bg-slate-950 px-4 py-2 rounded-2xl border border-amber-500/40 text-center">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              {lang === 'en' ? 'Power Score' : 'Punctaj'}
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono text-amber-300">
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

      {/* Main Interactive Motherboard Canvas Arena */}
      <div className="relative w-full h-[480px] sm:h-[540px] bg-slate-950 overflow-hidden">
        {/* Motherboard Trace Pattern Grid */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, #f59e0b 1px, transparent 1px), linear-gradient(to right, rgba(245, 158, 11, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(245, 158, 11, 0.05) 1px, transparent 1px)',
            backgroundSize: '36px 36px'
          }}
        />

        {/* Feedback Badge */}
        {feedbackText && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 shadow-xl font-mono font-black text-sm animate-bounce pointer-events-none">
            <span className={feedbackText.color}>{feedbackText.text}</span>
          </div>
        )}

        {/* ================================================================= */}
        {/* STAGE 1: SCROLL-TO-ROTATE COMPONENT ALIGNMENT                     */}
        {/* ================================================================= */}
        {stage === 1 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <div className="absolute top-3 left-4 text-xs font-mono text-amber-300 bg-slate-900/80 px-3 py-1 rounded-xl border border-amber-500/30 flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-amber-400" />
              <span>
                {lang === 'en'
                  ? 'USE MOUSE WHEEL (or rotation buttons) to rotate component to target angle, then click LOCK!'
                  : 'FOLOSEȘTE ROTIȚA MOUSE-ULUI pentru a roti componenta la unghiul corect, apoi apasă FIXEAZĂ!'}
              </span>
            </div>

            {(() => {
              const currentComp = components[activeCompIdx];
              if (!currentComp) return null;

              const isAngleMatched = currentComp.currentAngle === currentComp.targetAngle;

              return (
                <div className="flex flex-col items-center gap-6 z-10">
                  <div className="text-center">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                      {lang === 'en' ? currentComp.slotEn : currentComp.slotRo}
                    </span>
                    <h4 className="text-lg sm:text-xl font-black text-white">
                      {lang === 'en' ? currentComp.nameEn : currentComp.nameRo}
                    </h4>
                  </div>

                  {/* Motherboard Socket Blueprint with Angle Marker */}
                  <div className="relative w-56 h-56 rounded-3xl bg-slate-900 border-4 border-dashed border-slate-700 flex items-center justify-center shadow-2xl">
                    {/* Target Angle Guide Indicator */}
                    <div
                      className="absolute inset-2 rounded-2xl border-2 border-emerald-500/40 pointer-events-none flex items-start justify-center pt-1"
                      style={{ transform: `rotate(${currentComp.targetAngle}deg)` }}
                    >
                      <span className="text-[10px] font-mono font-black text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">
                        PIN 1 ▼
                      </span>
                    </div>

                    {/* Rotating Hardware Component with 3D feel */}
                    <div
                      style={{ transform: `rotate(${currentComp.currentAngle}deg)` }}
                      className={`relative w-40 h-40 rounded-2xl flex flex-col items-center justify-center text-4xl shadow-xl transition-transform duration-150 border-2 ${
                        isAngleMatched
                          ? 'bg-gradient-to-br from-emerald-900 to-teal-950 border-emerald-400 ring-4 ring-emerald-500/30'
                          : 'bg-gradient-to-br from-slate-800 to-slate-900 border-amber-500/60 ring-2 ring-amber-500/20'
                      }`}
                    >
                      <span>{currentComp.icon}</span>
                      <span className="text-[11px] font-mono font-bold text-white mt-1">
                        {currentComp.currentAngle}°
                      </span>
                    </div>
                  </div>

                  {/* Controls Bar: Touch Rotate Buttons + Lock Button */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleManualRotate(-90)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-xs font-bold border border-slate-700 transition cursor-pointer flex items-center gap-1"
                    >
                      ↺ -90°
                    </button>

                    <button
                      type="button"
                      onClick={handleLockComponent}
                      className={`px-6 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-black transition cursor-pointer shadow-lg ${
                        isAngleMatched
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 ring-2 ring-emerald-300 animate-pulse'
                          : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                      }`}
                    >
                      {lang === 'en' ? 'LOCK INTO SOCKET 🔌' : 'FIXEAZĂ ÎN SOCLU 🔌'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleManualRotate(90)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-xs font-bold border border-slate-700 transition cursor-pointer flex items-center gap-1"
                    >
                      +90° ↻
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ================================================================= */}
        {/* STAGE 2: BUS & WIRE ROUTING                                       */}
        {/* ================================================================= */}
        {stage === 2 && (
          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <div className="text-xs font-mono text-amber-300 bg-slate-900/80 px-3 py-1 rounded-xl border border-amber-500/30 self-start">
              {lang === 'en'
                ? 'Click each power rail to establish safe circuit connection without polarity inversion!'
                : 'Apasă pe fiecare traseu de alimentare pentru a conecta magistralele fără inversare de polaritate!'}
            </div>

            <div className="grid gap-4 max-w-2xl mx-auto w-full my-auto">
              {wires.map(wire => (
                <div
                  key={wire.id}
                  onClick={() => !wire.connected && handleWireConnect(wire.id)}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer shadow-lg ${
                    wire.connected
                      ? 'bg-emerald-950/70 border-emerald-400 text-emerald-200'
                      : 'bg-slate-900/90 border-slate-800 hover:border-amber-400 text-slate-300 hover:scale-[1.02]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: wire.color }} />
                    <span className="font-mono font-bold text-xs sm:text-sm">{wire.label}</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs font-black">
                    {wire.connected ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        {lang === 'en' ? 'CONNECTED 100%' : 'CONECTAT 100%'}
                      </span>
                    ) : (
                      <span className="text-amber-400 underline">
                        {lang === 'en' ? 'CLICK TO ROUTE' : 'APASĂ PENTRU CABLARE'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STAGE 3: VOLTAGE SURGE DEFLECTOR                                  */}
        {/* ================================================================= */}
        {stage === 3 && (
          <div className="absolute inset-0">
            <div className="absolute top-3 left-4 text-xs font-mono text-amber-300 bg-slate-900/80 px-3 py-1 rounded-xl border border-amber-500/30">
              {lang === 'en'
                ? `Deflect dangerous voltage spikes with cursor into Ground Capacitors! (${deflectedSparksCount}/4)`
                : `Ricoșează descărcările electrice cu cursorul spre Condensatorii GND! (${deflectedSparksCount}/4)`}
            </div>

            {/* Top Ground Capacitor (GND 1) */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-48 h-10 rounded-b-2xl bg-gradient-to-b from-emerald-900 to-emerald-950 border-2 border-emerald-400/60 flex items-center justify-center font-mono text-xs font-black text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              GND CAPACITOR 1 ▼
            </div>

            {/* Bottom Ground Capacitor (GND 2) */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-48 h-10 rounded-t-2xl bg-gradient-to-t from-emerald-900 to-emerald-950 border-2 border-emerald-400/60 flex items-center justify-center font-mono text-xs font-black text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              GND CAPACITOR 2 ▲
            </div>

            {/* Cursor Shield Deflector Ring */}
            <div
              style={{
                left: `${cursorPos.x}%`,
                top: `${cursorPos.y}%`,
                animationDuration: '6s'
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-dashed border-amber-400/70 pointer-events-none animate-spin"
            />

            {/* Spikes */}
            {sparks.map(s => {
              if (s.deflected) return null;
              return (
                <div
                  key={s.id}
                  style={{ left: `${s.x}%`, top: `${s.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 via-rose-500 to-amber-600 shadow-xl ring-2 ring-white flex items-center justify-center text-sm pointer-events-none animate-pulse"
                >
                  ⚡
                </div>
              );
            })}
          </div>
        )}

        {/* ================================================================= */}
        {/* STAGE 4: CIRCUIT BREAKER OVERLOAD RESET                           */}
        {/* ================================================================= */}
        {stage === 4 && (
          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <div className="text-xs font-mono text-amber-300 bg-slate-900/80 px-3 py-1 rounded-xl border border-amber-500/30 self-start">
              {lang === 'en'
                ? 'Toggle breaker switches to match the server safety configuration (Green = Correct)!'
                : 'Comută siguranțele pentru a respecta schema de siguranță a serverului (Verde = Corect)!'}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl mx-auto w-full my-auto">
              {breakers.map(b => {
                const isCorrect = b.currentState === b.requiredState;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleToggleBreaker(b.id)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 cursor-pointer shadow-lg transition-all hover:scale-105 active:scale-95 ${
                      isCorrect
                        ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                        : 'bg-slate-900 border-rose-500/80 text-rose-300'
                    }`}
                  >
                    <Power className={`w-6 h-6 ${b.currentState ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span className="font-mono font-black text-xs">{b.label}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 font-bold">
                      {b.currentState ? 'ON [1]' : 'OFF [0]'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STAGE 5: CPU CLOCK OSCILLOSCOPE (CLIMAX)                          */}
        {/* ================================================================= */}
        {stage === 5 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            <div className="absolute top-3 left-4 text-xs font-mono text-amber-300 bg-slate-900/80 px-3 py-1 rounded-xl border border-amber-500/30">
              {lang === 'en'
                ? `OSCILLOSCOPE CLOCK SURGE: Click at sine wave PEAK to overclock server to 5.0 GHz! (${clockCyclesMatched}/4)`
                : `OSCILOSCOP CPU: Apasă pe VÂRFUL undei sinusoidale pentru a atinge 5.0 GHz! (${clockCyclesMatched}/4)`}
            </div>

            <div className="flex flex-col items-center gap-5 z-10 w-full max-w-md">
              {/* Frequency readout display */}
              <div className="bg-slate-900 px-6 py-2.5 rounded-2xl border border-amber-500/40 text-center shadow-xl">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">
                  {lang === 'en' ? 'Current Frequency' : 'Frecvență Curentă'}
                </span>
                <span className="text-3xl font-black font-mono text-amber-400">
                  {clockFrequency} GHz
                </span>
              </div>

              {/* Oscilloscope Simulated Wave Display */}
              <div className="relative w-full h-36 rounded-2xl bg-slate-950 border-2 border-emerald-500/50 overflow-hidden shadow-inner flex items-center justify-center">
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                />

                {/* Animated Sine Wave */}
                <svg className="w-full h-full pointer-events-none">
                  <path
                    d={`M 20 70 Q 100 ${70 - Math.sin(oscPulseT) * 45} 180 70 T 340 70 T 500 70`}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                  />
                </svg>

                {/* Peak Indicator Laser Line */}
                <div className="absolute top-2 left-0 right-0 border-b border-dashed border-amber-400/60 pointer-events-none text-center">
                  <span className="text-[9px] font-mono text-amber-300 bg-slate-950 px-2 py-0.5 rounded">
                    PEAK TRIGGER HARMONIC ▲
                  </span>
                </div>
              </div>

              {/* Click to Lock Peak Button */}
              <button
                type="button"
                onClick={handleLockFrequency}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-600 to-purple-600 text-white font-mono font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              >
                {lang === 'en' ? 'LOCK PEAK PULSE ⚡' : 'SINCRONIZEAZĂ IMPULS PEAK ⚡'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Mission / Helper Bar */}
      <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono gap-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>
            {lang === 'en'
              ? 'Mouse wheel rotates hardware components during Stage 1. Page scroll is safely locked.'
              : 'Rotița mouse-ului rotește componentele în Etapa 1. Scroll-ul paginii este blocat în siguranță.'}
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
