import React, { useState, useEffect, useCallback } from 'react';
import {
  Zap,
  Activity,
  Cpu,
  Flame,
  Swords,
  Trophy,
  RotateCcw,
  Sparkles,
  Bot,
  Crown,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  ArrowRight,
  Sliders,
  Gauge
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { DuelRoomData, DuelPlayer, updateDuelProgress } from '../../lib/duelService';
import { recordStudentDuelResult } from '../../lib/studentAuthService';

interface CircuitStage {
  id: number;
  titleRo: string;
  titleEn: string;
  scenarioRo: string;
  scenarioEn: string;
  correctPin: string;
  options: { pin: string; labelRo: string; labelEn: string; voltage: string }[];
  ohmCheck: { questionRo: string; questionEn: string; answer: number; options: number[] };
}

const CIRCUIT_STAGES: CircuitStage[] = [
  {
    id: 1,
    titleRo: 'Runda 1: LED & Rezistor de Protecție 220Ω',
    titleEn: 'Round 1: LED & 220Ω Protective Resistor',
    scenarioRo: 'Conectează Anodul LED-ului (+) la pinul digital corect cu suport PWM pentru variația luminozității:',
    scenarioEn: 'Connect the LED Anode (+) to the correct digital PWM pin for smooth brightness dimming:',
    correctPin: 'D9_PWM',
    options: [
      { pin: 'D9_PWM', labelRo: 'Pin Digital D9 (~PWM)', labelEn: 'Digital Pin D9 (~PWM)', voltage: '5.0V PWM' },
      { pin: 'GND_1', labelRo: 'Pin GND (Masă)', labelEn: 'GND Ground Pin', voltage: '0.0V' },
      { pin: 'RESET', labelRo: 'Pin RESET Microcontroller', labelEn: 'RESET Pin', voltage: '0.0V' },
      { pin: 'AREF', labelRo: 'Pin AREF Referință Analogică', labelEn: 'AREF Reference Pin', voltage: '3.3V' },
    ],
    ohmCheck: {
      questionRo: 'La 5V și un curent sigur de 20mA (0.02A), ce rezistor minim folosim? (R = V / I)',
      questionEn: 'At 5V and a safe current of 20mA (0.02A), what minimum resistor is required? (R = V / I)',
      answer: 250,
      options: [100, 220, 250, 1000]
    }
  },
  {
    id: 2,
    titleRo: 'Runda 2: Senzor Fotoelectric LDR (Smart Streetlight)',
    titleEn: 'Round 2: LDR Photoresistor (Smart Streetlight)',
    scenarioRo: 'Fotorezistorul LDR măsoară lumina ambientală. La ce intrare a plăcii Arduino Uno îl conectăm pentru conversie ADC 10-biți?',
    scenarioEn: 'The LDR measures ambient sunlight. Which Arduino Uno input converts this analog voltage to 10-bit ADC?',
    correctPin: 'A0_ANALOG',
    options: [
      { pin: 'A0_ANALOG', labelRo: 'Pin Analogic A0 (0–1023 ADC)', labelEn: 'Analog Pin A0 (0–1023 ADC)', voltage: '2.5V (Lumină)' },
      { pin: 'TX_D1', labelRo: 'Pin Serial TX (D1)', labelEn: 'Serial Pin TX (D1)', voltage: '5.0V' },
      { pin: '3V3', labelRo: 'Ieșire Tensiune 3.3V', labelEn: 'Power Output 3.3V', voltage: '3.3V' },
      { pin: 'VIN', labelRo: 'Intrare Baterie Externe VIN', labelEn: 'External Battery VIN', voltage: '9.0V' },
    ],
    ohmCheck: {
      questionRo: 'Dacă pe întuneric LDR-ul are 50kΩ, tensiunea pe pinul A0 crește sau scade?',
      questionEn: 'In darkness when LDR reaches 50kΩ, does voltage at A0 rise or fall?',
      answer: 1, // 1 = Crește (cu pull-down la GND)
      options: [0, 1]
    }
  },
  {
    id: 3,
    titleRo: 'Runda 3: Senzor Ultrasonic Distanță HC-SR04',
    titleEn: 'Round 3: HC-SR04 Ultrasonic Distance Sensor',
    scenarioRo: 'Pinul TRIG emite impulsul acustic de 40kHz, iar pinul ECHO măsoară timpul de ecou. Unde conectăm ECHO?',
    scenarioEn: 'The TRIG pin pulses at 40kHz, while ECHO reads the pulse return. Where do we connect ECHO?',
    correctPin: 'D8_DIGITAL',
    options: [
      { pin: 'D8_DIGITAL', labelRo: 'Pin Digital D8 (Intrare Input)', labelEn: 'Digital Pin D8 (Input)', voltage: 'Impuls 5V' },
      { pin: 'IOREF', labelRo: 'Pin IOREF Nivel Logic', labelEn: 'IOREF Voltage Level', voltage: '5.0V' },
      { pin: 'A5_ANALOG', labelRo: 'Pin A5 / SCL I2C', labelEn: 'Analog Pin A5 / SCL', voltage: '0.0V' },
      { pin: '5V_POWER', labelRo: 'Șină Alimentare +5V', labelEn: '+5V Power Rail', voltage: '5.0V' },
    ],
    ohmCheck: {
      questionRo: 'Viteza sunetului este 340 m/s (0.034 cm/μs). La 588 μs dus-întors, ce distanță avem? (d = t · 0.034 / 2)',
      questionEn: 'Sound speed is 340 m/s. At 588 μs roundtrip, what is the obstacle distance? (d = t · 0.034 / 2)',
      answer: 10,
      options: [5, 10, 20, 50]
    }
  },
  {
    id: 4,
    titleRo: 'Runda 4: Barieră Inteligentă cu Servomotor SG90',
    titleEn: 'Round 4: Smart Parking Barrier SG90 Servo',
    scenarioRo: 'Servomotorul are 3 fire: Maro (GND), Roșu (5V) și Portocaliu (Semnal PWM). Unde conectăm firul Portocaliu?',
    scenarioEn: 'The servo has 3 wires: Brown (GND), Red (5V), and Orange (PWM). Where do we connect Orange?',
    correctPin: 'D5_PWM',
    options: [
      { pin: 'D5_PWM', labelRo: 'Pin PWM D5 (~Control Unghi 0–180°)', labelEn: 'PWM Pin D5 (~0–180° Angle)', voltage: 'PWM 50Hz' },
      { pin: 'RESET_2', labelRo: 'Buton Reset', labelEn: 'Reset Button', voltage: '0.0V' },
      { pin: 'GND_2', labelRo: 'Pin GND', labelEn: 'GND Pin', voltage: '0.0V' },
      { pin: 'A3_ANALOG', labelRo: 'Pin Analogic A3', labelEn: 'Analog Pin A3', voltage: '0.0V' },
    ],
    ohmCheck: {
      questionRo: 'Pentru a ridica bariera la verticală (90°), ce impuls PWM trimitem?',
      questionEn: 'To raise the barrier vertically to 90 degrees, what PWM pulse width is sent?',
      answer: 1500,
      options: [1000, 1500, 2000, 2500]
    }
  },
  {
    id: 5,
    titleRo: 'Runda 5: Alertă Gaze MQ-2 & Ecran LCD 1602 I2C',
    titleEn: 'Round 5: MQ-2 Gas Alarm & I2C LCD 1602 Display',
    scenarioRo: 'Protocolul I2C folosește două magistrale: SDA (date) și SCL (ceas). Pe Arduino Uno, la ce pin conectăm SDA?',
    scenarioEn: 'I2C uses two communication lines: SDA (data) and SCL (clock). On Arduino Uno, which pin is SDA?',
    correctPin: 'A4_SDA',
    options: [
      { pin: 'A4_SDA', labelRo: 'Pin A4 / SDA (Date I2C)', labelEn: 'Pin A4 / SDA (I2C Data)', voltage: 'I2C 100kHz' },
      { pin: 'A5_SCL', labelRo: 'Pin A5 / SCL (Ceas I2C)', labelEn: 'Pin A5 / SCL (I2C Clock)', voltage: 'Clock' },
      { pin: 'D2_DIGITAL', labelRo: 'Pin D2 (Întrerupere INT0)', labelEn: 'Pin D2 (INT0)', voltage: 'Digital' },
      { pin: 'AREF_2', labelRo: 'Pin AREF', labelEn: 'AREF', voltage: '3.3V' },
    ],
    ohmCheck: {
      questionRo: 'Adresa I2C standard din fabrică a modulului PCF8574 pentru LCD 1602 este:',
      questionEn: 'The standard factory I2C hex address for PCF8574 LCD 1602 backpack is:',
      answer: 27, // 0x27
      options: [20, 27, 32, 68]
    }
  }
];

interface CircuitMasterDuelGameProps {
  roomData?: DuelRoomData | null;
  isHost?: boolean;
  studentName?: string;
  studentAvatar?: string;
  onFinish?: (score: number, isWinner: boolean) => void;
  onBack?: () => void;
}

export const CircuitMasterDuelGame: React.FC<CircuitMasterDuelGameProps> = ({
  roomData,
  isHost = true,
  studentName = 'Campion TIC',
  studentAvatar = '⚡',
  onFinish,
  onBack,
}) => {
  const { lang } = useLanguage();

  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [stepInStage, setStepInStage] = useState<'wire' | 'ohm'>('wire');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [sparkError, setSparkError] = useState(false);
  const [multimeterVolts, setMultimeterVolts] = useState<string>('0.00 V');
  const [hasFinishedLocal, setHasFinishedLocal] = useState(false);

  // Bot practice fallback
  const [botProgress, setBotProgress] = useState(0);
  const [botScore, setBotScore] = useState(0);

  const stage = CIRCUIT_STAGES[currentStageIdx % CIRCUIT_STAGES.length];
  const progressPercent = Math.min(100, Math.round((currentStageIdx / CIRCUIT_STAGES.length) * 100));

  const me: DuelPlayer | null = isHost ? roomData?.host || null : (roomData?.guest || null);
  const opponent: DuelPlayer | null = isHost ? roomData?.guest || null : (roomData?.host || null);

  const opponentProgress = roomData ? (opponent?.progress || 0) : botProgress;
  const opponentScore = roomData ? (opponent?.score || 0) : botScore;
  const opponentName = roomData ? (opponent?.name || (lang === 'en' ? 'Opponent' : 'Oponent')) : (lang === 'en' ? 'Electrician Bot 🤖' : 'Robot Electrician 🤖');

  // Handle Pin Selection
  const handleSelectPin = (pin: string, voltage: string) => {
    if (hasFinishedLocal || sparkError) return;

    if (pin === stage.correctPin) {
      sounds.playCorrect();
      setMultimeterVolts(voltage);
      setSelectedPin(pin);
      setStepInStage('ohm');
      setScore((s) => s + 75);
    } else {
      sounds.playWrong();
      setSparkError(true);
      setMultimeterVolts('SHORT CIRCUIT! 0V');
      setStreak(0);
      setTimeout(() => setSparkError(false), 900);
    }
  };

  // Handle Ohm's Law / Math Question
  const handleOhmAnswer = (opt: number) => {
    if (hasFinishedLocal) return;

    if (opt === stage.ohmCheck.answer) {
      sounds.playPowerup();
      const points = 125 + streak * 30;
      const nextScore = score + points;
      const nextIndex = currentStageIdx + 1;
      const nextStreak = streak + 1;

      setScore(nextScore);
      setStreak(nextStreak);

      if (nextIndex >= CIRCUIT_STAGES.length) {
        setHasFinishedLocal(true);
        sounds.playFanfare();

        if (roomData?.roomCode) {
          updateDuelProgress(
            roomData.roomCode,
            isHost,
            { progress: 100, score: nextScore, finishedAt: Date.now() },
            isHost ? roomData.host.id : roomData.guest?.id,
            isHost ? roomData.host.name : (roomData.guest?.name || 'Elev')
          );
        }

        recordStudentDuelResult(true, 'circuit_duel', nextScore);
        onFinish?.(nextScore, true);
      } else {
        const newProg = Math.round((nextIndex / CIRCUIT_STAGES.length) * 100);
        if (roomData?.roomCode) {
          updateDuelProgress(roomData.roomCode, isHost, {
            progress: newProg,
            score: nextScore,
            currentStageIndex: nextIndex
          });
        }

        setCurrentStageIdx(nextIndex);
        setStepInStage('wire');
        setSelectedPin(null);
        setMultimeterVolts('0.00 V');
      }
    } else {
      sounds.playWrong();
      setSparkError(true);
      setTimeout(() => setSparkError(false), 800);
    }
  };

  // Bot practice opponent
  useEffect(() => {
    if (roomData || hasFinishedLocal) return;

    const interval = setInterval(() => {
      setBotProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const delta = Math.floor(Math.random() * 10) + 10;
        const next = Math.min(100, prev + delta);
        setBotScore((s) => s + 150);
        if (next >= 100 && !hasFinishedLocal) {
          setHasFinishedLocal(true);
          sounds.playWrong();
          onFinish?.(score, false);
        }
        return next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [roomData, hasFinishedLocal, score, onFinish]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 select-none font-sans">
      {/* Match Header Bar */}
      <div className="bg-slate-900/95 border-2 border-amber-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Me */}
          <div className="sm:col-span-5 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-2xl shadow-lg ring-2 ring-amber-400/40 shrink-0">
              {studentAvatar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="font-black text-white text-sm truncate">{studentName} (Tu)</span>
                <span className="font-mono text-xs font-bold text-amber-300">{score} XP</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 mt-1">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                {lang === 'en' ? `Circuit ${currentStageIdx + 1} of ${CIRCUIT_STAGES.length}` : `Circuit ${currentStageIdx + 1} din ${CIRCUIT_STAGES.length}`}
              </span>
            </div>
          </div>

          {/* Versus */}
          <div className="sm:col-span-2 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-black text-xs shadow-inner">
              ⚡ VS ⚡
            </div>
            {streak > 1 && (
              <span className="text-[11px] font-black text-amber-400 flex items-center gap-1 mt-1 font-mono animate-bounce">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {streak}x Wire Combo
              </span>
            )}
          </div>

          {/* Opponent */}
          <div className="sm:col-span-5 flex items-center gap-3">
            <div className="min-w-0 flex-1 text-right">
              <div className="flex items-center justify-between gap-1">
                <span className="font-mono text-xs font-bold text-rose-300">{opponentScore} XP</span>
                <span className="font-black text-white text-sm truncate">{opponentName}</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 mt-1">
                <div
                  className="h-full bg-gradient-to-l from-rose-500 to-amber-400 transition-all duration-300 rounded-full float-right"
                  style={{ width: `${opponentProgress}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                {opponentProgress}% finalizat
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-500 flex items-center justify-center text-2xl shadow-lg ring-2 ring-rose-400/40 shrink-0">
              {roomData?.guest ? roomData.guest.avatar : '🤖'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Electronic Breadboard & Terminal Simulator */}
      <div className={`bg-slate-900/90 border-2 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300 ${
        sparkError ? 'border-rose-500 ring-4 ring-rose-500/30 shake' : 'border-slate-800'
      }`}>
        {/* Background glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

        {/* Multimeter readout widget */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              {lang === 'en' ? 'Digital Multimeter & Circuit Probe' : 'Multimetru Digital & Banc de Probe'}
            </span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono font-black text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className={sparkError ? 'text-rose-400' : 'text-emerald-300'}>{multimeterVolts}</span>
          </div>
        </div>

        {/* Stage Header */}
        <div className="mb-6 relative z-10">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">
            {lang === 'en' ? stage.titleEn : stage.titleRo}
          </span>
          <h3 className="text-lg sm:text-xl font-black text-white font-heading">
            {lang === 'en' ? stage.scenarioEn : stage.scenarioRo}
          </h3>
        </div>

        {/* STEP 1: WIRE SELECTION */}
        {stepInStage === 'wire' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
            {stage.options.map((opt) => (
              <button
                key={opt.pin}
                type="button"
                onClick={() => handleSelectPin(opt.pin, opt.voltage)}
                className="p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-800/90 border-2 border-slate-800 hover:border-amber-400/80 transition-all text-left flex items-center justify-between group cursor-pointer shadow-lg active:scale-95"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm block">
                      {lang === 'en' ? opt.labelEn : opt.labelRo}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      ID: {opt.pin}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-950/50 border border-emerald-500/30">
                  {opt.voltage}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* STEP 2: OHM'S LAW / SENSOR CALCULATION */}
        {stepInStage === 'ohm' && (
          <div className="p-5 rounded-2xl bg-slate-950/90 border border-amber-500/40 relative z-10 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                {lang === 'en' ? 'Quick Physics & Voltage Calibration' : 'Calibrare Fizică & Legea lui Ohm'}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-200 mb-4">
              {lang === 'en' ? stage.ohmCheck.questionEn : stage.ohmCheck.questionRo}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {stage.ohmCheck.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleOhmAnswer(opt)}
                  className="p-3.5 rounded-xl bg-slate-900 hover:bg-amber-600 hover:text-slate-950 border border-slate-700 hover:border-amber-400 font-mono font-black text-sm text-white transition-all cursor-pointer active:scale-95 text-center shadow-sm"
                >
                  {opt === 1 && stage.id === 2 ? (lang === 'en' ? 'Rises' : 'Crește') :
                   opt === 0 && stage.id === 2 ? (lang === 'en' ? 'Falls' : 'Scade') :
                   opt === 27 && stage.id === 5 ? '0x27 (Hex)' :
                   `${opt} ${stage.id === 1 ? 'Ω' : stage.id === 3 ? 'cm' : stage.id === 4 ? 'μs' : ''}`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Finished Banner */}
      {hasFinishedLocal && (
        <div className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-emerald-950/90 border-2 border-amber-500/60 rounded-3xl p-6 text-center shadow-2xl">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-2 animate-bounce" />
          <h3 className="text-xl font-black text-white font-heading">
            {lang === 'en' ? 'Circuit Duel Conquered!' : 'Duelul Circuitelor a Fost Câștigat! ⚡'}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            {lang === 'en'
              ? `You wired all Smart City systems with a score of ${score} XP!`
              : `Ai conectat perfect toate circuitele Smart City și ai obținut ${score} XP!`}
          </p>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mt-4 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg shadow-amber-500/30"
            >
              {lang === 'en' ? 'Return to Lobby' : 'Înapoi în Arenă'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
