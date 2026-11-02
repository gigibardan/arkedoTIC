import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Zap,
  Cpu,
  ArrowLeft,
  RotateCcw,
  Trophy,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Play,
  Volume2,
  VolumeX,
  Layers,
  Activity,
  Sliders,
  Flame,
  Radio,
  Eye,
  ShieldCheck,
  Power,
  Gauge,
  Clock,
  Terminal,
  HelpCircle,
  Award
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { useLanguage } from '../../context/LanguageContext';
import { updateStudentArcadeScore } from '../../lib/studentAuthService';

export interface CircuitMasterGameProps {
  studentName?: string;
  studentAvatar?: string;
  onBack: () => void;
  onSaveScore?: (score: number) => void;
}

// Stage type
type GameStage = 'menu' | 'wiring' | 'oscilloscope' | 'multitask' | 'boss_grid' | 'game_over';

// Wire color selection
type WireColor = 'red' | 'black' | 'yellow' | 'green' | 'blue';

interface ComponentPin {
  id: string;
  label: string;
  type: '5V' | 'GND' | 'DIGITAL' | 'PWM' | 'ANALOG' | 'I2C_SDA' | 'I2C_SCL';
  connectedTo: string | null;
}

interface CircuitComponent {
  id: string;
  nameRo: string;
  nameEn: string;
  icon: string;
  color: string;
  pins: ComponentPin[];
  isComplete: boolean;
  requiredConnections: { pinId: string; targetArduinoPin: string; name: string }[];
  descriptionRo: string;
  descriptionEn: string;
}

// Arduino Pins Definition
interface ArduinoPin {
  id: string;
  label: string;
  type: '5V' | '3.3V' | 'GND' | 'VIN' | 'DIGITAL' | 'PWM' | 'ANALOG' | 'I2C_SDA' | 'I2C_SCL';
  connectedComponentPin: string | null;
}

const ARDUINO_PINS_DEF: ArduinoPin[] = [
  { id: '5V', label: '5V', type: '5V', connectedComponentPin: null },
  { id: 'GND_1', label: 'GND', type: 'GND', connectedComponentPin: null },
  { id: 'GND_2', label: 'GND', type: 'GND', connectedComponentPin: null },
  { id: '3.3V', label: '3.3V', type: '3.3V', connectedComponentPin: null },
  { id: 'VIN', label: 'VIN', type: 'VIN', connectedComponentPin: null },
  { id: 'A0', label: 'A0', type: 'ANALOG', connectedComponentPin: null },
  { id: 'A1', label: 'A1', type: 'ANALOG', connectedComponentPin: null },
  { id: 'A2', label: 'A2', type: 'ANALOG', connectedComponentPin: null },
  { id: 'A3', label: 'A3', type: 'ANALOG', connectedComponentPin: null },
  { id: 'A4', label: 'A4 (SDA)', type: 'I2C_SDA', connectedComponentPin: null },
  { id: 'A5', label: 'A5 (SCL)', type: 'I2C_SCL', connectedComponentPin: null },
  { id: 'D2', label: 'D2', type: 'DIGITAL', connectedComponentPin: null },
  { id: 'D3', label: '~D3 (PWM)', type: 'PWM', connectedComponentPin: null },
  { id: 'D4', label: 'D4', type: 'DIGITAL', connectedComponentPin: null },
  { id: 'D5', label: '~D5 (PWM)', type: 'PWM', connectedComponentPin: null },
  { id: 'D6', label: '~D6 (PWM)', type: 'PWM', connectedComponentPin: null },
  { id: 'D7', label: 'D7', type: 'DIGITAL', connectedComponentPin: null },
  { id: 'D8', label: 'D8', type: 'DIGITAL', connectedComponentPin: null },
  { id: 'D9', label: '~D9 (PWM)', type: 'PWM', connectedComponentPin: null },
  { id: 'D10', label: '~D10 (PWM)', type: 'PWM', connectedComponentPin: null },
  { id: 'D11', label: '~D11 (PWM)', type: 'PWM', connectedComponentPin: null },
  { id: 'D12', label: 'D12', type: 'DIGITAL', connectedComponentPin: null },
  { id: 'D13', label: 'D13', type: 'DIGITAL', connectedComponentPin: null },
];

export const CircuitMasterGame: React.FC<CircuitMasterGameProps> = ({
  studentName = 'Inginer Hardware',
  studentAvatar = '⚡',
  onBack,
  onSaveScore
}) => {
  const { lang } = useLanguage();

  // Game States
  const [stage, setStage] = useState<GameStage>('menu');
  const [score, setScore] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [health, setHealth] = useState<number>(100);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_circuit_master') || '0');
    } catch {
      return 0;
    }
  });

  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [activeWireColor, setActiveWireColor] = useState<WireColor>('yellow');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'BOOT: Circuit Master 80s Hardware BIOS v4.2...',
    'SYSTEM: Placa Arduino ATmega328P initializata. Tensiune: 5.00V OK.',
    'READY: Selecteaza un stadiu pentru antrenament hardware.'
  ]);

  const addLog = (msg: string) => {
    setTerminalLogs((prev) => [...prev.slice(-4), `> ${msg}`]);
  };

  // ================= STAGE 1: WIRING RUSH STATE =================
  const [selectedComponentId, setSelectedComponentId] = useState<string>('ldr_light');
  const [arduinoPins, setArduinoPins] = useState<ArduinoPin[]>(ARDUINO_PINS_DEF);
  const [selectedCompPin, setSelectedCompPin] = useState<{ compId: string; pinId: string } | null>(null);
  const [stageTimer, setStageTimer] = useState<number>(60);

  // Components to wire
  const [components, setComponents] = useState<CircuitComponent[]>([
    {
      id: 'ldr_light',
      nameRo: 'Senzor Lumină LDR & LED Iluminat',
      nameEn: 'LDR Light Sensor & PWM LED',
      icon: '💡',
      color: 'border-amber-500/50 bg-amber-950/20',
      isComplete: false,
      pins: [
        { id: 'ldr_vcc', label: 'VCC (+5V)', type: '5V', connectedTo: null },
        { id: 'ldr_sig', label: 'Semnal Analog', type: 'ANALOG', connectedTo: null },
        { id: 'ldr_gnd', label: 'GND (Masa)', type: 'GND', connectedTo: null },
        { id: 'led_pwm', label: 'Anod LED PWM', type: 'PWM', connectedTo: null }
      ],
      requiredConnections: [
        { pinId: 'ldr_vcc', targetArduinoPin: '5V', name: 'Alimentare 5V' },
        { pinId: 'ldr_sig', targetArduinoPin: 'A0', name: 'Pin Analog A0' },
        { pinId: 'ldr_gnd', targetArduinoPin: 'GND_1', name: 'Masă GND' },
        { pinId: 'led_pwm', targetArduinoPin: 'D9', name: 'Pin PWM ~D9' }
      ],
      descriptionRo: 'Conectează fotorezistorul la A0 pentru citire lux și LED-ul la ~D9 pentru reglaj PWM 10%-100%.',
      descriptionEn: 'Wire the photoresistor to A0 for lux ADC and the LED to ~D9 for PWM brightness modulation.'
    },
    {
      id: 'hc_sr04',
      nameRo: 'Senzor Ultrasonic HC-SR04 & SG90',
      nameEn: 'Ultrasonic HC-SR04 & SG90 Servo',
      icon: '📡',
      color: 'border-cyan-500/50 bg-cyan-950/20',
      isComplete: false,
      pins: [
        { id: 'us_vcc', label: 'VCC (+5V)', type: '5V', connectedTo: null },
        { id: 'us_trig', label: 'Trig (Puls)', type: 'DIGITAL', connectedTo: null },
        { id: 'us_echo', label: 'Echo (Receptie)', type: 'DIGITAL', connectedTo: null },
        { id: 'servo_pwm', label: 'Servo Semnal PWM', type: 'PWM', connectedTo: null },
        { id: 'us_gnd', label: 'GND (Masa)', type: 'GND', connectedTo: null }
      ],
      requiredConnections: [
        { pinId: 'us_vcc', targetArduinoPin: '5V', name: 'Alimentare 5V' },
        { pinId: 'us_trig', targetArduinoPin: 'D7', name: 'Trigger Pin D7' },
        { pinId: 'us_echo', targetArduinoPin: 'D8', name: 'Echo Pin D8' },
        { pinId: 'servo_pwm', targetArduinoPin: 'D6', name: 'Servo PWM ~D6' },
        { pinId: 'us_gnd', targetArduinoPin: 'GND_2', name: 'Masă GND' }
      ],
      descriptionRo: 'Conectează Trigger pe D7, Echo pe D8 și firul portocaliu al servomotorului pe ~D6.',
      descriptionEn: 'Wire Trigger to D7, Echo to D8, and the servo PWM orange line to ~D6.'
    },
    {
      id: 'mq2_gas',
      nameRo: 'Senzor Gaz MQ-2 & Releu Evacuare',
      nameEn: 'MQ-2 Gas Sensor & Exhaust Relay',
      icon: '🔥',
      color: 'border-rose-500/50 bg-rose-950/20',
      isComplete: false,
      pins: [
        { id: 'mq_vcc', label: 'VCC (+5V)', type: '5V', connectedTo: null },
        { id: 'mq_aout', label: 'AOUT (Analog ppm)', type: 'ANALOG', connectedTo: null },
        { id: 'mq_gnd', label: 'GND (Masa)', type: 'GND', connectedTo: null },
        { id: 'relay_in', label: 'Releu Ventilator IN', type: 'DIGITAL', connectedTo: null }
      ],
      requiredConnections: [
        { pinId: 'mq_vcc', targetArduinoPin: '5V', name: 'Alimentare 5V' },
        { pinId: 'mq_aout', targetArduinoPin: 'A1', name: 'AOUT pe Pin A1' },
        { pinId: 'mq_gnd', targetArduinoPin: 'GND_1', name: 'Masă GND' },
        { pinId: 'relay_in', targetArduinoPin: 'D4', name: 'Comandă Releu D4' }
      ],
      descriptionRo: 'Pinul AOUT se conectează la A1 pentru măsurare gaz ppm, iar comanda releului la D4.',
      descriptionEn: 'Connect AOUT to A1 for ppm concentration reading, and relay trigger to D4.'
    },
    {
      id: 'i2c_lcd',
      nameRo: 'Ecran LCD 1602 Magistrală I2C',
      nameEn: 'I2C LCD 1602 Display (0x27)',
      icon: '📟',
      color: 'border-emerald-500/50 bg-emerald-950/20',
      isComplete: false,
      pins: [
        { id: 'lcd_vcc', label: 'VCC (+5V)', type: '5V', connectedTo: null },
        { id: 'lcd_gnd', label: 'GND (Masa)', type: 'GND', connectedTo: null },
        { id: 'lcd_sda', label: 'SDA (Date Seriale)', type: 'I2C_SDA', connectedTo: null },
        { id: 'lcd_scl', label: 'SCL (Ceas Serial)', type: 'I2C_SCL', connectedTo: null }
      ],
      requiredConnections: [
        { pinId: 'lcd_vcc', targetArduinoPin: '5V', name: 'Alimentare 5V' },
        { pinId: 'lcd_gnd', targetArduinoPin: 'GND_2', name: 'Masă GND' },
        { pinId: 'lcd_sda', targetArduinoPin: 'A4', name: 'SDA pe Pin A4' },
        { pinId: 'lcd_scl', targetArduinoPin: 'A5', name: 'SCL pe Pin A5' }
      ],
      descriptionRo: 'Pe placa Uno, magistrala hardware I2C se conectează obligatoriu la A4 (SDA) și A5 (SCL).',
      descriptionEn: 'On Arduino Uno, hardware I2C bus routes strictly to A4 (SDA) and A5 (SCL).'
    }
  ]);

  // Handle Connecting a Pin
  const handleConnectPin = (arduinoPinId: string) => {
    if (!selectedCompPin) {
      if (!soundMuted) sounds.playWrong();
      addLog('EROARE: Alege mai intai un pin de pe componenta din stanga!');
      return;
    }

    const { compId, pinId } = selectedCompPin;
    const targetComp = components.find((c) => c.id === compId);
    if (!targetComp) return;

    const req = targetComp.requiredConnections.find((r) => r.pinId === pinId);
    if (!req) return;

    // Check if correct pin
    const isCorrect =
      req.targetArduinoPin === arduinoPinId ||
      (req.targetArduinoPin.startsWith('GND') && arduinoPinId.startsWith('GND')) ||
      (req.targetArduinoPin === '5V' && arduinoPinId === '5V');

    if (isCorrect) {
      if (!soundMuted) sounds.playCorrect();
      addLog(`CONECTAT: ${pinId} -> ${arduinoPinId} (${req.name}) - VALID!`);

      // Update Component pin
      setComponents((prev) =>
        prev.map((c) => {
          if (c.id !== compId) return c;
          const updatedPins = c.pins.map((p) =>
            p.id === pinId ? { ...p, connectedTo: arduinoPinId } : p
          );
          const allDone = c.requiredConnections.every((rc) =>
            updatedPins.some((p) => p.id === rc.pinId && p.connectedTo !== null)
          );
          return { ...c, pins: updatedPins, isComplete: allDone };
        })
      );

      // Update Arduino pin
      setArduinoPins((prev) =>
        prev.map((ap) => (ap.id === arduinoPinId ? { ...ap, connectedComponentPin: pinId } : ap))
      );

      // Score points (balanced +40 pts)
      const earned = 40 * multiplier;
      setScore((s) => s + earned);

      // Reset selection
      setSelectedCompPin(null);
    } else {
      if (!soundMuted) sounds.playWrong();
      setHealth((h) => Math.max(0, h - 10));
      addLog(`SCURTCIRCUIT / PIN ERONAT! ${pinId} nu apartine pinului ${arduinoPinId}. Atentie la scurtcircuit!`);
    }
  };

  // ================= STAGE 2: OSCILLOSCOPE & OHM BUSTER =================
  const [pwmDuty, setPwmDuty] = useState<number>(50);
  const [echoTimeUs, setEchoTimeUs] = useState<number>(1000); // 1000 us
  const [targetOhmChallenge, setTargetOhmChallenge] = useState<{
    vcc: number;
    vLed: number;
    iLedMa: number;
    correctOhm: number;
    options: number[];
  }>({
    vcc: 5,
    vLed: 2,
    iLedMa: 15, // (5-2) / 0.015 = 200 Ohm
    correctOhm: 200,
    options: [100, 200, 470, 10000]
  });

  const handleSelectOhm = (val: number) => {
    if (val === targetOhmChallenge.correctOhm) {
      if (!soundMuted) sounds.playLevelUp();
      const earned = 80 * multiplier;
      setScore((s) => s + earned);
      addLog(`LEGEA LUI OHM VALIDATA: R = (5V - 2V) / 0.015A = ${val} Ohmi! LED-ul este protejat.`);

      // Generate next challenge
      const challenges = [
        { vcc: 5, vLed: 1.8, iLedMa: 20, correctOhm: 160, options: [160, 330, 1000, 2200] },
        { vcc: 5, vLed: 3.0, iLedMa: 20, correctOhm: 100, options: [100, 470, 1000, 10000] },
        { vcc: 5, vLed: 2.0, iLedMa: 10, correctOhm: 300, options: [150, 220, 300, 4700] },
        { vcc: 5, vLed: 2.2, iLedMa: 20, correctOhm: 140, options: [140, 560, 1200, 10000] }
      ];
      const next = challenges[Math.floor(Math.random() * challenges.length)];
      setTargetOhmChallenge(next);
    } else {
      if (!soundMuted) sounds.playWrong();
      setHealth((h) => Math.max(0, h - 15));
      addLog(`EROARE DE CALCUL OHM: ${val} Ohmi! Curent periculos sau LED stins.`);
    }
  };

  // ================= STAGE 3: MULTITASKING MILLIS MASTER =================
  interface MultiTaskEvent {
    id: string;
    titleRo: string;
    titleEn: string;
    sensorRo: string;
    sensorEn: string;
    correctAction: 'millis_dispatch' | 'analog_smooth' | 'isr_interrupt' | 'i2c_buffer';
    timeoutSec: number;
    reward: number;
  }

  const [activeEvents, setActiveEvents] = useState<MultiTaskEvent[]>([]);
  const [taskTimer, setTaskTimer] = useState<number>(30);

  const ALL_TASK_EVENTS: MultiTaskEvent[] = [
    {
      id: 'gas_leak',
      titleRo: 'Scăpare de Gaz în Bucătărie (520 ppm)',
      titleEn: 'Kitchen Gas Leak (520 ppm)',
      sensorRo: 'MQ-2 Gas Sensor',
      sensorEn: 'MQ-2 Gas Sensor',
      correctAction: 'millis_dispatch',
      timeoutSec: 8,
      reward: 70
    },
    {
      id: 'car_barrier',
      titleRo: 'Automobil Apropiat la Barieră (12 cm)',
      titleEn: 'Car Approaching Barrier (12 cm)',
      sensorRo: 'HC-SR04 Ultrasunete',
      sensorEn: 'HC-SR04 Ultrasonic',
      correctAction: 'isr_interrupt',
      timeoutSec: 7,
      reward: 65
    },
    {
      id: 'street_pedestrian',
      titleRo: 'Pieton pe Trecere pe Timp de Noapte',
      titleEn: 'Night Pedestrian Crossing',
      sensorRo: 'LDR + PIR Motion',
      sensorEn: 'LDR + PIR Motion',
      correctAction: 'millis_dispatch',
      timeoutSec: 9,
      reward: 60
    },
    {
      id: 'weather_refresh',
      titleRo: 'Actualizare Date Meteo LCD 1602',
      titleEn: 'LCD 1602 Weather Screen Refresh',
      sensorRo: 'DHT11 Temp & Humid',
      sensorEn: 'DHT11 Temp & Humid',
      correctAction: 'i2c_buffer',
      timeoutSec: 10,
      reward: 50
    },
    {
      id: 'adc_noise',
      titleRo: 'Filtrare Zgomot Fluctuant ADC Lumină',
      titleEn: 'Filter ADC Voltage Ripple Noise',
      sensorRo: 'A0 ADC Noise Filter',
      sensorEn: 'A0 ADC Noise Filter',
      correctAction: 'analog_smooth',
      timeoutSec: 8,
      reward: 75
    }
  ];

  const handleResolveTask = (action: 'millis_dispatch' | 'analog_smooth' | 'isr_interrupt' | 'i2c_buffer') => {
    if (activeEvents.length === 0) return;
    const current = activeEvents[0];

    if (current.correctAction === action) {
      if (!soundMuted) sounds.playCorrect();
      setScore((s) => s + current.reward * multiplier);
      addLog(`EVENIMENT REZOLVAT ASINCRON: ${current.titleRo} a fost tratat cu succes!`);
      setActiveEvents((prev) => prev.slice(1));
    } else {
      if (!soundMuted) sounds.playWrong();
      setHealth((h) => Math.max(0, h - 12));
      addLog(`BLOCAJ CPU! Actiunea selectata nu este non-blocanta pentru ${current.titleRo}!`);
    }
  };

  // ================= STAGE 4: SMART CITY BOSS GRID =================
  const [cityGridStability, setCityGridStability] = useState<number>(100);
  const [gridBlackoutThreat, setGridBlackoutThreat] = useState<boolean>(true);
  const [subsystems, setSubsystems] = useState<{
    streetlight: boolean;
    parking: boolean;
    gasVent: boolean;
    weatherLcd: boolean;
  }>({
    streetlight: true,
    parking: true,
    gasVent: false,
    weatherLcd: true
  });

  const toggleSubsystem = (key: 'streetlight' | 'parking' | 'gasVent' | 'weatherLcd') => {
    sounds.playClick();
    setSubsystems((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      // Check grid balance
      const activeCount = Object.values(updated).filter(Boolean).length;
      if (activeCount >= 3) {
        setCityGridStability((st) => Math.min(100, st + 15));
        addLog(`GRILA STABILIZATA: Subsistemul ${key} reglat in mod cooperativ.`);
      }
      return updated;
    });
  };

  // Save Final Highscore
  const finalizeGame = useCallback(() => {
    setStage('game_over');
    if (!soundMuted) sounds.playVictory();

    // Check personal best
    if (score > highScore) {
      setHighScore(score);
      try {
        localStorage.setItem('arkedo_highscore_circuit_master', String(score));
      } catch {}
    }

    // Sync to student profile in Cloud & Local
    updateStudentArcadeScore('circuit_master', score);
    onSaveScore?.(score);
  }, [score, highScore, soundMuted, onSaveScore]);

  // Timers and game loops
  useEffect(() => {
    if (stage === 'wiring') {
      const interval = setInterval(() => {
        setStageTimer((t) => {
          if (t <= 1) {
            clearInterval(interval);
            setStage('oscilloscope');
            addLog('ETAPA 1 COMPLETA! Se initializeaza laboratorul de osciloscop.');
            return 60;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === 'multitask') {
      // Spawn tasks
      if (activeEvents.length === 0) {
        setActiveEvents(ALL_TASK_EVENTS.slice(0, 3));
      }
      const interval = setInterval(() => {
        setTaskTimer((t) => {
          if (t <= 1) {
            clearInterval(interval);
            setStage('boss_grid');
            addLog('ETAPA 3 COMPLETA! ALERTA: Furtuna electrica ameninta Grila Smart City!');
            return 45;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stage, activeEvents.length]);

  useEffect(() => {
    if (stage === 'boss_grid') {
      const interval = setInterval(() => {
        setCityGridStability((st) => {
          if (st <= 10) {
            clearInterval(interval);
            finalizeGame();
            return 0;
          }
          return Math.max(0, st - 3);
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stage, finalizeGame]);

  // Check health gameover
  useEffect(() => {
    if (health <= 0 && stage !== 'game_over') {
      finalizeGame();
    }
  }, [health, stage, finalizeGame]);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-5 p-2 sm:p-4 text-slate-100 font-sans select-none">
      {/* 80s Cyberpunk Neon Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/90 border-2 border-amber-500/50 rounded-2xl p-4 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                onBack();
              }}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 transition cursor-pointer"
              title={lang === 'en' ? 'Back to Arcade Hub' : 'Înapoi la Hub Arcade'}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 text-2xl shadow-lg shadow-amber-500/20">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-amber-500/40">
                  RETRO 80s HARDWARE LAB
                </span>
                <span className="text-xs text-cyan-400 font-mono font-bold">
                  Arduino Uno ATmega328P
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black text-white font-heading tracking-tight flex items-center gap-2">
                <span>Circuit Master 80s: Arduino & Smart City</span>
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              </h1>
            </div>
          </div>

          {/* Player stats & retro dials */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 flex items-center gap-2 font-mono text-xs">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400">{lang === 'en' ? 'Score:' : 'Scor:'}</span>
              <span className="font-bold text-amber-300 text-sm">{score}</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 flex items-center gap-2 font-mono text-xs">
              <Gauge className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400">{lang === 'en' ? 'Health:' : 'Integritate:'}</span>
              <span className={`font-bold text-sm ${health > 30 ? 'text-emerald-400' : 'text-rose-400 animate-pulse'}`}>
                {health}%
              </span>
            </div>

            <button
              onClick={() => setSoundMuted(!soundMuted)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
              title={soundMuted ? 'Activează Sunet' : 'Dezactivează Sunet'}
            >
              {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </div>

        {/* Retro CRT Scanline Overlay Effect */}
        <div className="mt-3 flex items-center gap-3 font-mono text-xs text-slate-400 border-t border-slate-800 pt-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-emerald-300 font-bold">5.0V STABIL</span>
          </div>
          <span>•</span>
          <span>Oscilator: 16.0 MHz Cuarț</span>
          <span>•</span>
          <span>Record Personal: <strong className="text-amber-300">{highScore} pts</strong></span>
        </div>
      </div>

      {/* Main Game Screen depending on Stage */}
      {stage === 'menu' && (
        <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col items-center text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-4xl mb-4 shadow-xl shadow-amber-500/10">
            🔌
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
            {lang === 'en' ? 'Hardware Engineering Simulator' : 'Simulatorul de Inginerie Hardware'}
          </h2>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            {lang === 'en'
              ? 'Become a master IoT hardware engineer: connect real breadboards with sensors and actuators, tune PWM and resistors with oscilloscope math, dispatch non-blocking events, and save the Smart City power grid from total blackout!'
              : 'Devino inginer hardware IoT de elită: conectează senzori reali și servomotoare pe breadboard, reglează PWM-ul și rezistențele prin legea lui Ohm, gestionează evenimentele concurente fără delay() și salvează rețeaua electrică Smart City!'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full my-6 text-left">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
              <div className="font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                <Cpu className="w-4 h-4" /> 1. Conexiuni Pini & Breadboard
              </div>
              <div className="text-slate-400">
                Pini digitali PWM (~3, ~5, ~6, ~9, ~10, ~11), analogici A0-A5 și I2C (A4/A5).
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
              <div className="font-bold text-cyan-400 flex items-center gap-1.5 mb-1">
                <Activity className="w-4 h-4" /> 2. Osciloscop & Legea lui Ohm
              </div>
              <div className="text-slate-400">
                Măsoară semnale PWM, calculează rezistența de protecție a LED-ului și evită suprasarcina.
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                <Clock className="w-4 h-4" /> 3. Multitasking millis()
              </div>
              <div className="text-slate-400">
                Rezolvă simultan semnale de gaz, mașini la barieră și pietoni fără să blochezi procesorul.
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
              <div className="font-bold text-rose-400 flex items-center gap-1.5 mb-1">
                <Radio className="w-4 h-4" /> 4. Criza Smart City
              </div>
              <div className="text-slate-400">
                Echilibrează grila de energie și previne blackout-ul cartierului inteligent.
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              setStage('wiring');
              addLog('INCEPE ETAPA 1: Conecteaza senzorii pe pinii corecti ai placii Arduino!');
            }}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/25 transition cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{lang === 'en' ? 'Start Circuit Lab' : 'Pornește Laboratorul de Circuite'}</span>
          </button>
        </div>
      )}

      {/* STAGE 1: BREADBOARD WIRING RUSH */}
      {stage === 'wiring' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Components Palette */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-black text-white font-heading uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-400" />
                  {lang === 'en' ? 'IoT Components to Wire' : 'Componente de Conectat'}
                </h3>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  ⏱️ {stageTimer}s
                </span>
              </div>

              {/* Wire Color Selector */}
              <div className="flex items-center gap-2 mb-3 p-2 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400 font-mono text-[11px]">Fir Culoare:</span>
                {(['red', 'black', 'yellow', 'green', 'blue'] as WireColor[]).map((col) => (
                  <button
                    key={col}
                    onClick={() => {
                      sounds.playClick();
                      setActiveWireColor(col);
                    }}
                    className={`w-6 h-6 rounded-lg transition border cursor-pointer ${
                      col === 'red' ? 'bg-rose-500 border-rose-300' :
                      col === 'black' ? 'bg-slate-900 border-slate-500' :
                      col === 'yellow' ? 'bg-amber-400 border-amber-200' :
                      col === 'green' ? 'bg-emerald-500 border-emerald-300' :
                      'bg-sky-500 border-sky-300'
                    } ${activeWireColor === col ? 'ring-2 ring-white scale-110 shadow-md' : 'opacity-70'}`}
                  />
                ))}
              </div>

              {/* Component Cards */}
              <div className="flex flex-col gap-3">
                {components.map((comp) => {
                  const isSelected = selectedComponentId === comp.id;
                  return (
                    <div
                      key={comp.id}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedComponentId(comp.id);
                      }}
                      className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex flex-col gap-2 ${
                        comp.color
                      } ${isSelected ? 'ring-2 ring-amber-400 shadow-lg' : 'hover:border-slate-600'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{comp.icon}</span>
                          <span className="font-bold text-sm text-white">
                            {lang === 'en' ? comp.nameEn : comp.nameRo}
                          </span>
                        </div>
                        {comp.isComplete ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/40 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            OK
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-amber-300">
                            {comp.pins.filter((p) => p.connectedTo !== null).length} / {comp.pins.length} pini
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {lang === 'en' ? comp.descriptionEn : comp.descriptionRo}
                      </p>

                      {/* Pins of this component */}
                      <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-800/80">
                        {comp.pins.map((pin) => {
                          const isPinSelected =
                            selectedCompPin?.compId === comp.id && selectedCompPin?.pinId === pin.id;
                          const isWired = pin.connectedTo !== null;

                          return (
                            <button
                              key={pin.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                sounds.playClick();
                                setSelectedCompPin({ compId: comp.id, pinId: pin.id });
                                addLog(`SELECTAT: Pin componenta [${pin.label}]. Alege acum pinul corespondent pe placa Arduino!`);
                              }}
                              className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition flex items-center gap-1 cursor-pointer ${
                                isWired
                                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                                  : isPinSelected
                                  ? 'bg-amber-500 text-slate-950 border border-amber-300 shadow-md font-black scale-105'
                                  : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              <span>{pin.label}</span>
                              {isWired && <span className="text-emerald-400 font-normal">→ {pin.connectedTo}</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Arduino Uno Virtual Pinout */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-gradient-to-b from-slate-900 to-indigo-950/60 border-2 border-slate-700/80 rounded-2xl p-5 shadow-2xl relative">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-teal-400" />
                  <span className="font-mono font-bold text-sm text-white">ARDUINO UNO PIN HEADER</span>
                </div>
                <div className="text-xs font-mono text-slate-400">
                  {selectedCompPin ? (
                    <span className="text-amber-300 animate-pulse font-bold">
                      Alege pinul pentru: {selectedCompPin.pinId}
                    </span>
                  ) : (
                    <span>Atinge un pin pentru conexiune</span>
                  )}
                </div>
              </div>

              {/* Arduino Board Graphic Representation */}
              <div className="bg-teal-950/50 border-2 border-teal-500/40 rounded-xl p-4 flex flex-col gap-4">
                {/* Digital / PWM Header (Top Row) */}
                <div>
                  <div className="text-[10px] font-mono text-teal-300 font-bold uppercase mb-1.5 flex items-center justify-between">
                    <span>Pini Digitali & PWM (~D3, ~D5, ~D6, ~D9, ~D10, ~D11)</span>
                    <span className="text-slate-400">DIGITAL (PWM ~)</span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                    {arduinoPins
                      .filter((p) => p.type === 'DIGITAL' || p.type === 'PWM')
                      .map((p) => {
                        const isConnected = p.connectedComponentPin !== null;
                        const isPWM = p.type === 'PWM';

                        return (
                          <button
                            key={p.id}
                            onClick={() => handleConnectPin(p.id)}
                            className={`p-2 rounded-xl border text-xs font-mono font-bold transition flex flex-col items-center justify-center cursor-pointer ${
                              isConnected
                                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60 shadow-md'
                                : isPWM
                                ? 'bg-cyan-950/50 hover:bg-cyan-900 text-cyan-200 border-cyan-500/40'
                                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            <span className="text-[11px]">{p.label}</span>
                            <span className="text-[9px] text-slate-400 font-normal">
                              {isConnected ? `✓ ${p.connectedComponentPin}` : isPWM ? 'PWM 8-bit' : 'GPIO'}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Power & Analog Header (Bottom Row) */}
                <div>
                  <div className="text-[10px] font-mono text-amber-300 font-bold uppercase mb-1.5 flex items-center justify-between">
                    <span>Alimentare (5V, GND) & Pini Analogici ADC / I2C (A0 - A5)</span>
                    <span className="text-slate-400">POWER & ANALOG IN</span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                    {arduinoPins
                      .filter((p) => p.type === '5V' || p.type === 'GND' || p.type === 'ANALOG' || p.type === 'I2C_SDA' || p.type === 'I2C_SCL')
                      .map((p) => {
                        const isConnected = p.connectedComponentPin !== null;
                        const isPower = p.type === '5V' || p.type === 'GND';

                        return (
                          <button
                            key={p.id}
                            onClick={() => handleConnectPin(p.id)}
                            className={`p-2 rounded-xl border text-xs font-mono font-bold transition flex flex-col items-center justify-center cursor-pointer ${
                              isConnected
                                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60 shadow-md'
                                : isPower
                                ? 'bg-amber-950/40 hover:bg-amber-900 text-amber-200 border-amber-500/40'
                                : 'bg-indigo-950/50 hover:bg-indigo-900 text-indigo-200 border-indigo-500/40'
                            }`}
                          >
                            <span className="text-[11px]">{p.label}</span>
                            <span className="text-[9px] text-slate-400 font-normal">
                              {isConnected ? `✓ ${p.connectedComponentPin}` : p.type}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Interactive Hardware Terminal Output */}
              <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400">
                <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-800 pb-1 mb-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Consola Serială UART 9600 Baud</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  {terminalLogs.map((log, i) => (
                    <div key={i} className="truncate">
                      {log}
                    </div>
                  ))}
                </div>
              </div>

              {/* Fast Forward Stage Button */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  Toate componentele conectate?
                </span>
                <button
                  onClick={() => {
                    sounds.playLevelUp();
                    setStage('oscilloscope');
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer shadow flex items-center gap-1.5"
                >
                  <span>Etapa 2: Osciloscop & Ohm</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: OSCILLOSCOPE & OHM BUSTER */}
      {stage === 'oscilloscope' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Oscilloscope Screen */}
          <div className="lg:col-span-7 bg-slate-950 border-2 border-cyan-500/60 rounded-2xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
                <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-sm">
                  <Activity className="w-5 h-5 animate-pulse" />
                  <span>OSCILOSCOP DUAL-CHANNEL RETRO (500 kHz)</span>
                </div>
                <span className="text-xs font-mono text-slate-400">CH1: PWM LED | CH2: ECHO HC-SR04</span>
              </div>

              {/* Waveform Graphic Display Canvas */}
              <div className="h-44 w-full bg-slate-900/90 border border-cyan-500/30 rounded-xl p-3 relative flex items-center justify-center font-mono">
                {/* Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:20px_20px] opacity-40"></div>

                {/* Simulated SVG Square Wave based on pwmDuty */}
                <svg className="w-full h-full relative z-10" viewBox="0 0 400 100">
                  <path
                    d={`M 0 80 
                        L ${pwmDuty * 2} 80 
                        L ${pwmDuty * 2} 20 
                        L 200 20 
                        L 200 80 
                        L ${200 + pwmDuty * 2} 80 
                        L ${200 + pwmDuty * 2} 20 
                        L 400 20`}
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="3"
                  />
                </svg>

                <div className="absolute top-2 left-2 text-[10px] text-cyan-300 font-bold bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                  DUTY CYCLE: {pwmDuty}% | TENSIUNE EFECTIVA: {((pwmDuty / 100) * 5).toFixed(2)} V
                </div>
              </div>

              {/* Duty Cycle Controls */}
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Reglează Factorul de Umplere PWM (analogWrite):</span>
                  <span className="text-cyan-400 font-bold">{Math.round((pwmDuty / 100) * 255)} / 255</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={pwmDuty}
                  onChange={(e) => {
                    setPwmDuty(Number(e.target.value));
                    if (Number(e.target.value) % 25 === 0 && !soundMuted) sounds.playClick();
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Ultrasonic echo calculator */}
            <div className="mt-4 p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono">
              <div className="text-cyan-300 font-bold mb-1 flex items-center justify-between">
                <span>Calcul Distanță Ultrasonic: d = (t * 0.0343) / 2</span>
                <span className="text-amber-400 font-bold">
                  {((echoTimeUs * 0.0343) / 2).toFixed(1)} cm
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="4000"
                step="100"
                value={echoTimeUs}
                onChange={(e) => setEchoTimeUs(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Right: Ohm's Law Buster Challenge */}
          <div className="lg:col-span-5 bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-sm mb-3 pb-2 border-b border-slate-800">
                <Sliders className="w-5 h-5" />
                <span>CLINICA DE REZISTENȚE (LEGEA LUI OHM)</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-amber-500/30 text-xs flex flex-col gap-2">
                <div className="text-slate-300">
                  Calculează rezistența de limitare a curentului necesară pentru a proteja un LED roșu conectat la Arduino:
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg font-mono text-amber-300 text-[11px] leading-relaxed">
                  Formula: <strong>R = (Vcc - V_led) / I_led</strong><br />
                  • Vcc alimentare: <strong>{targetOhmChallenge.vcc} V</strong><br />
                  • Cădere de tensiune LED: <strong>{targetOhmChallenge.vLed} V</strong><br />
                  • Curent dorit: <strong>{targetOhmChallenge.iLedMa} mA (0.015 A)</strong>
                </div>
              </div>

              {/* Multi-Choice Ohm Options */}
              <div className="grid grid-cols-2 gap-2.5 mt-4">
                {targetOhmChallenge.options.map((ohmVal) => (
                  <button
                    key={ohmVal}
                    onClick={() => handleSelectOhm(ohmVal)}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-amber-600/30 text-white font-mono font-bold text-xs border border-slate-700 hover:border-amber-400 transition cursor-pointer flex items-center justify-center gap-1 active:scale-95"
                  >
                    <span>{ohmVal} Ω</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playLevelUp();
                setStage('multitask');
                addLog('INCEPE ETAPA 3: Multitasking cooperativ! Evita delay() si rezolva evenimentele.');
              }}
              className="mt-6 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow flex items-center justify-center gap-2"
            >
              <span>Etapa 3: Multitasking millis()</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3: MULTITASKING MILLIS MASTER */}
      {stage === 'multitask' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Active Incoming Events Queue */}
          <div className="lg:col-span-7 bg-slate-900 border-2 border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <div className="flex items-center gap-2 font-mono font-bold text-sm text-amber-400">
                  <Clock className="w-5 h-5 animate-spin" />
                  <span>COADA DE EVENIMENTE IOT (NON-BLOCKING SCHEDULER)</span>
                </div>
                <span className="text-xs font-mono text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  ⏱️ Timp Etapă: {taskTimer}s
                </span>
              </div>

              <div className="flex flex-col gap-3 my-2">
                {activeEvents.map((ev, idx) => (
                  <div
                    key={ev.id}
                    className={`p-4 rounded-xl border-2 transition ${
                      idx === 0
                        ? 'bg-amber-950/40 border-amber-500 shadow-md scale-[1.01]'
                        : 'bg-slate-950/60 border-slate-800 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                          PRIO #{idx + 1}
                        </span>
                        <h4 className="font-bold text-sm text-white">
                          {lang === 'en' ? ev.titleEn : ev.titleRo}
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-emerald-400 font-bold">
                        +{ev.reward * multiplier} XP
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-1">
                      Senzor: <strong className="text-slate-200">{lang === 'en' ? ev.sensorEn : ev.sensorRo}</strong>
                    </div>
                  </div>
                ))}

                {activeEvents.length === 0 && (
                  <div className="p-8 text-center text-slate-400 text-xs font-mono">
                    Toate evenimentele curente au fost rezolvate! Felicitări!
                  </div>
                )}
              </div>
            </div>

            {/* Asynchronous Action Dispatch Buttons */}
            <div>
              <div className="text-[11px] font-mono text-slate-400 mb-2 uppercase font-bold">
                Alege Rutina Non-Blocantă Corectă:
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleResolveTask('millis_dispatch')}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-emerald-600/40 border border-slate-700 hover:border-emerald-400 text-white font-mono text-xs font-bold transition cursor-pointer flex flex-col items-center justify-center gap-0.5 active:scale-95"
                >
                  <span className="text-emerald-300">millis() Planificator</span>
                  <span className="text-[10px] text-slate-400 font-normal">Timp Asincron non-blocant</span>
                </button>

                <button
                  onClick={() => handleResolveTask('isr_interrupt')}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-cyan-600/40 border border-slate-700 hover:border-cyan-400 text-white font-mono text-xs font-bold transition cursor-pointer flex flex-col items-center justify-center gap-0.5 active:scale-95"
                >
                  <span className="text-cyan-300">Întrerupere Hardware (ISR)</span>
                  <span className="text-[10px] text-slate-400 font-normal">attachInterrupt(digitalPinToInterrupt)</span>
                </button>

                <button
                  onClick={() => handleResolveTask('analog_smooth')}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-amber-600/40 border border-slate-700 hover:border-amber-400 text-white font-mono text-xs font-bold transition cursor-pointer flex flex-col items-center justify-center gap-0.5 active:scale-95"
                >
                  <span className="text-amber-300">Filtru Medie Mobilă</span>
                  <span className="text-[10px] text-slate-400 font-normal">Netezire citiri ADC analogice</span>
                </button>

                <button
                  onClick={() => handleResolveTask('i2c_buffer')}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-purple-600/40 border border-slate-700 hover:border-purple-400 text-white font-mono text-xs font-bold transition cursor-pointer flex flex-col items-center justify-center gap-0.5 active:scale-95"
                >
                  <span className="text-purple-300">Buffer Ecran I2C (0x27)</span>
                  <span className="text-[10px] text-slate-400 font-normal">LiquidCrystal_I2C non-blocant</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Code Inspector (Why delay is dangerous) */}
          <div className="lg:col-span-5 bg-slate-900 border-2 border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-sm mb-3 pb-2 border-b border-slate-800">
                <AlertTriangle className="w-5 h-5" />
                <span>CAPCANA delay() vs REZOLVAREA millis()</span>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono leading-relaxed text-slate-300 flex flex-col gap-2">
                <div className="text-rose-400 font-bold">
                  ❌ GREȘIT (Blocant):
                </div>
                <pre className="p-2 bg-slate-900 rounded text-[10px] text-rose-300">
                  {`digitalWrite(LED, HIGH);
delay(5000); // PROCESOR ORB 5 SECUNDE!
// Nu poate citi senzorul de gaz!`}
                </pre>

                <div className="text-emerald-400 font-bold mt-2">
                  ✅ CORECT (Non-blocant):
                </div>
                <pre className="p-2 bg-slate-900 rounded text-[10px] text-emerald-300">
                  {`unsigned long acum = millis();
if (acum - anterior >= interval) {
  anterior = acum;
  comutaStare();
}
// Toti ceilalti senzori sunt activi!`}
                </pre>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playLevelUp();
                setStage('boss_grid');
                addLog('INCEPE CRIZA SMART CITY: Furtuna energetica! Salveaza grila electrica.');
              }}
              className="mt-4 w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs cursor-pointer shadow flex items-center justify-center gap-2"
            >
              <span>Etapa 4: Bătălia Grilei Smart City</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* STAGE 4: SMART CITY BOSS GRID */}
      {stage === 'boss_grid' && (
        <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-2xl text-amber-300">
                ⚡
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white font-heading">
                  CRIZA GRILEI SMART CITY: FURTUNĂ DE ÎNALTĂ TENSIUNE
                </h3>
                <p className="text-xs text-amber-300 font-mono">
                  Menține stabilitatea rețelei peste 0% și echilibrează cele 4 subsisteme!
                </p>
              </div>
            </div>

            {/* City Stability Bar */}
            <div className="w-full sm:w-48 flex flex-col gap-1 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Stabilitate Grilă:</span>
                <span className="font-bold text-amber-300">{cityGridStability}%</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${cityGridStability}%` }}
                />
              </div>
            </div>
          </div>

          {/* Subsystems Control Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Iluminat Public */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <span>💡 Iluminat Public LDR & PIR</span>
                </div>
                <div className="text-xs text-slate-400 mt-1 font-mono">
                  Stare: {subsystems.streetlight ? 'ECO PWM 10%' : 'OPRIT PENTRU REZERVĂ'}
                </div>
              </div>
              <button
                onClick={() => toggleSubsystem('streetlight')}
                className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition cursor-pointer ${
                  subsystems.streetlight
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30 shadow'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {subsystems.streetlight ? 'ACTIV' : 'STANDBY'}
              </button>
            </div>

            {/* 2. Bariera Parcării */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <span>🚧 Barieră Ultrasonică SG90</span>
                </div>
                <div className="text-xs text-slate-400 mt-1 font-mono">
                  Stare: {subsystems.parking ? 'AUTO 0°/90°' : 'BLOCATĂ SECURITATE'}
                </div>
              </div>
              <button
                onClick={() => toggleSubsystem('parking')}
                className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition cursor-pointer ${
                  subsystems.parking
                    ? 'bg-cyan-600 text-white shadow-cyan-600/30 shadow'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {subsystems.parking ? 'ACTIV' : 'STANDBY'}
              </button>
            </div>

            {/* 3. Ventilator Evacuare Gaze */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <span>🔥 Alertă Gaze MQ-2 Releu</span>
                </div>
                <div className="text-xs text-slate-400 mt-1 font-mono">
                  Stare: {subsystems.gasVent ? 'VENTILAȚIE MAXIMĂ' : 'MONITORIZARE NORMALĂ'}
                </div>
              </div>
              <button
                onClick={() => toggleSubsystem('gasVent')}
                className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition cursor-pointer ${
                  subsystems.gasVent
                    ? 'bg-rose-600 text-white shadow-rose-600/30 shadow'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {subsystems.gasVent ? 'EVACUARE' : 'NORMAL'}
              </button>
            </div>

            {/* 4. Ecran LCD 1602 Informare */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <span>📟 Panou Informare I2C LCD</span>
                </div>
                <div className="text-xs text-slate-400 mt-1 font-mono">
                  Stare: {subsystems.weatherLcd ? 'TRANSMISIE ALERTE' : 'STANDBY ECO'}
                </div>
              </div>
              <button
                onClick={() => toggleSubsystem('weatherLcd')}
                className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition cursor-pointer ${
                  subsystems.weatherLcd
                    ? 'bg-purple-600 text-white shadow-purple-600/30 shadow'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {subsystems.weatherLcd ? 'ACTIV' : 'STANDBY'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <span className="text-xs font-mono text-slate-400">
              Echilibrul ideal crește stabilitatea orașului.
            </span>
            <button
              onClick={() => {
                setScore((s) => s + 250);
                finalizeGame();
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs cursor-pointer shadow-lg shadow-amber-500/20"
            >
              Finalizează Misiunea Smart City 🏁
            </button>
          </div>
        </div>
      )}

      {/* GAME OVER / RESULTS MODAL */}
      {stage === 'game_over' && (
        <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col items-center text-center max-w-xl mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-4xl mb-3 shadow-lg shadow-amber-500/20">
            🏆
          </div>

          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            Misiune Hardware Încheiată
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
            {lang === 'en' ? 'Hardware Architect Diploma' : 'Rezultate Simulator Circuit Master'}
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-md">
            {lang === 'en'
              ? 'Congratulations! You mastered breadboards, PWM, Ohm resistors, and non-blocking multitasking.'
              : 'Felicitări! Ai conectat circuitele de breadboard, ai calibrat semnalele PWM și ai stăpânit multitasking-ul asincron fără delay().'}
          </p>

          {/* Scores Box */}
          <div className="grid grid-cols-2 gap-3 w-full my-6 font-mono text-left">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Scor Obținut:</span>
              <span className="text-2xl font-black text-amber-300">{score}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Punctaj arcade echilibrat</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Record Personal:</span>
              <span className="text-2xl font-black text-cyan-300">{highScore}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Salvat în profilul tău</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={() => {
                sounds.playClick();
                setScore(0);
                setHealth(100);
                setStage('menu');
              }}
              className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition flex items-center justify-center gap-2 border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{lang === 'en' ? 'Play Again' : 'Joacă din Nou'}</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onBack();
              }}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs cursor-pointer shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
            >
              <span>{lang === 'en' ? 'Back to Arcade' : 'Înapoi la Arcade'}</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
