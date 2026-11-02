import React, { useState, useEffect } from 'react';
import {
  Flame,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  HelpCircle,
  Eye,
  Sliders,
  Volume2,
  VolumeX,
  Fan,
  Activity,
  Zap
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface R2Level3Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const R2Level3_GasAndFireSafetySystem: React.FC<R2Level3Props> = ({
  onCompletePage,
  onComplete,
}) => {
  // Gas & Safety state
  const [gasLevelAdc, setGasLevelAdc] = useState<number>(180); // 0..1023
  const [flameDetected, setFlameDetected] = useState<boolean>(false);
  const [gasValveOpen, setGasValveOpen] = useState<boolean>(true); // 90° = Open, 0° = Closed
  const [exhaustFanActive, setExhaustFanActive] = useState<boolean>(false);
  const [alarmMuted, setAlarmMuted] = useState<boolean>(false);

  // Challenge checks
  const [testedSafeBaseline, setTestedSafeBaseline] = useState<boolean>(false);
  const [testedGasAlarm, setTestedGasAlarm] = useState<boolean>(false);
  const [testedEmergencyResponse, setTestedEmergencyResponse] = useState<boolean>(false);

  // Safety thresholds
  const GAS_THRESHOLD = 450;
  const isEmergency = gasLevelAdc >= GAS_THRESHOLD || flameDetected;

  // Auto-actions on emergency
  useEffect(() => {
    if (isEmergency) {
      setExhaustFanActive(true);
      setGasValveOpen(false); // emergency shutoff
      setTestedGasAlarm(true);
      if (!alarmMuted) {
        sounds.playWrong();
      }
    } else {
      if (gasLevelAdc < 300 && !flameDetected) {
        setTestedSafeBaseline(true);
      }
    }
  }, [isEmergency, gasLevelAdc, flameDetected, alarmMuted]);

  useEffect(() => {
    if (isEmergency && exhaustFanActive && !gasValveOpen) {
      setTestedEmergencyResponse(true);
    }
  }, [isEmergency, exhaustFanActive, gasValveOpen]);

  const handleSimulateGasLeak = () => {
    sounds.playClick();
    setGasLevelAdc(680);
  };

  const handleSimulateClearAir = () => {
    sounds.playCorrect();
    setGasLevelAdc(160);
    setFlameDetected(false);
    setExhaustFanActive(false);
    setGasValveOpen(true);
  };

  const handleToggleFlame = () => {
    sounds.playClick();
    setFlameDetected((prev) => !prev);
  };

  const allCompleted = testedSafeBaseline && testedGasAlarm && testedEmergencyResponse;

  const handleFinish = () => {
    sounds.playSuccess();
    if (onCompletePage) {
      onCompletePage(100);
    } else if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900/40 via-red-900/30 to-slate-900/60 border border-rose-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3.5 rounded-xl border transition-all ${
              isEmergency ? 'bg-red-500/30 border-red-500/60 text-red-300 animate-pulse' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
            }`}>
              {isEmergency ? <ShieldAlert className="w-8 h-8 text-red-400" /> : <ShieldCheck className="w-8 h-8 text-emerald-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Modulul 4B • Pasul 3 din 7
                </span>
                <span className="text-xs text-slate-400 font-mono">Manual Art Klett pag. 104–105</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
                Sistem Inteligent de Securitate: Gaz, Fum & Incendiu
              </h1>
              <p className="text-slate-300 text-sm mt-1 max-w-2xl">
                Monitorizează gazele inflamabile cu senzorul analogic MQ-2, activează alarma sonoră piezo prin PWM, comută releul ventilatorului de evacuare și închide electrovalva de gaz prin servomotor.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-700/60">
            <div className="text-right">
              <div className="text-xs text-slate-400">Stare Siguranță</div>
              <div className={`text-sm font-bold font-mono ${isEmergency ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                {isEmergency ? '🚨 ALARMĂ CRITICĂ' : '🛡️ NORMAL (SIGUR)'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Safety Dashboard */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/70 border border-slate-700/60 rounded-2xl p-6 shadow-lg">
            <h2 className="text-base font-semibold text-slate-200 flex items-center justify-between mb-4">
              <span className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-rose-400" />
                Panou Senzori & Actuatori de Urgență
              </span>
              <button
                onClick={() => setAlarmMuted((prev) => !prev)}
                className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all ${
                  alarmMuted ? 'bg-amber-950/40 text-amber-300 border-amber-800' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {alarmMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                {alarmMuted ? 'Alarmă Mută' : 'Sunet Activ'}
              </button>
            </h2>

            {/* Visual Room & Actuator Animation */}
            <div className={`relative h-60 rounded-xl border overflow-hidden p-6 transition-all duration-500 flex flex-col justify-between ${
              isEmergency
                ? 'bg-gradient-to-br from-red-950/70 via-slate-950 to-orange-950/50 border-red-500/50 shadow-[inset_0_0_30px_rgba(239,68,68,0.2)]'
                : 'bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/30 border-slate-700'
            }`}>
              {/* Top Sensor Readouts */}
              <div className="grid grid-cols-3 gap-3">
                {/* MQ-2 Gas Sensor */}
                <div className={`p-3 rounded-xl border backdrop-blur-sm transition-all ${
                  gasLevelAdc >= GAS_THRESHOLD ? 'bg-red-500/20 border-red-400 text-red-200' : 'bg-slate-900/80 border-slate-800 text-slate-300'
                }`}>
                  <div className="text-[10px] font-mono uppercase text-slate-400">Senzor Gaz MQ-2 (A0)</div>
                  <div className="text-lg font-bold font-mono mt-0.5">{gasLevelAdc} ADC</div>
                  <div className="text-[10px] text-slate-400">Prag: {GAS_THRESHOLD} ADC</div>
                </div>

                {/* Flame Sensor */}
                <div className={`p-3 rounded-xl border backdrop-blur-sm transition-all ${
                  flameDetected ? 'bg-orange-500/20 border-orange-400 text-orange-200' : 'bg-slate-900/80 border-slate-800 text-slate-300'
                }`}>
                  <div className="text-[10px] font-mono uppercase text-slate-400">Senzor Flacără (D3)</div>
                  <div className="text-sm font-bold font-mono mt-1">
                    {flameDetected ? '🔥 FLACĂRĂ' : 'SIGUR'}
                  </div>
                  <div className="text-[10px] text-slate-400">{flameDetected ? 'Semnal LOW' : 'Semnal HIGH'}</div>
                </div>

                {/* Piezo Buzzer */}
                <div className={`p-3 rounded-xl border backdrop-blur-sm transition-all ${
                  isEmergency ? 'bg-red-600/30 border-red-500 text-red-100 animate-bounce' : 'bg-slate-900/80 border-slate-800 text-slate-300'
                }`}>
                  <div className="text-[10px] font-mono uppercase text-slate-400">Buzzer Acustic (~D8)</div>
                  <div className="text-sm font-bold font-mono mt-1">
                    {isEmergency ? '🔊 2000 Hz' : 'MUT (0 Hz)'}
                  </div>
                  <div className="text-[10px] text-slate-400">{isEmergency ? 'Puls 500ms' : 'Repaus'}</div>
                </div>
              </div>

              {/* Bottom Emergency Actuators Visualization */}
              <div className="flex items-center justify-around bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
                {/* Exhaust Fan Relay */}
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-full border transition-all ${
                    exhaustFanActive
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}>
                    <Fan className={`w-6 h-6 ${exhaustFanActive ? 'animate-spin' : ''}`} style={{ animationDuration: '0.4s' }} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Releu Ventilator (D7)</div>
                    <div className="text-[11px] text-slate-400">
                      {exhaustFanActive ? '🟢 ACTIV (Evacuare Gaz)' : '⚪ OPRIT'}
                    </div>
                  </div>
                </div>

                {/* Gas Valve Servo */}
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-full border transition-all ${
                    gasValveOpen
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-red-500/20 border-red-400 text-red-300'
                  }`}>
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Robinet Gaz Servo (~D9)</div>
                    <div className="text-[11px] font-mono">
                      {gasValveOpen ? (
                        <span className="text-emerald-400 font-bold">DESCHIS (90°)</span>
                      ) : (
                        <span className="text-red-400 font-bold">BLOCAT URGENȚĂ (0°)</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between items-center text-sm font-medium text-slate-300 mb-1">
                  <span>Simulare Concentrație Gaz MQ-2 (Pin A0):</span>
                  <span className={`font-mono font-bold ${gasLevelAdc >= GAS_THRESHOLD ? 'text-red-400' : 'text-emerald-400'}`}>
                    {gasLevelAdc} ADC ({(gasLevelAdc / 1023 * 100).toFixed(1)}%)
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="950"
                  step="25"
                  value={gasLevelAdc}
                  onChange={(e) => setGasLevelAdc(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>50 ADC (Aer curat)</span>
                  <span className="text-red-400 font-semibold">Prag critic: {GAS_THRESHOLD} ADC</span>
                  <span>950 ADC (Scurgere masivă)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2.5 pt-2 border-t border-slate-800">
                <button
                  onClick={handleSimulateGasLeak}
                  className="px-3.5 py-2 rounded-xl font-bold text-xs bg-red-950/50 hover:bg-red-900/60 text-red-200 border border-red-700/60 flex items-center gap-1.5 transition-all"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  Simulează Scurgere Gaz (680 ADC)
                </button>

                <button
                  onClick={handleToggleFlame}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs border flex items-center gap-1.5 transition-all ${
                    flameDetected
                      ? 'bg-orange-600 text-white border-orange-400'
                      : 'bg-slate-800 hover:bg-slate-700 text-orange-300 border-slate-700'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  {flameDetected ? 'Oprește Flacără' : 'Declanșează Flacără'}
                </button>

                <button
                  onClick={handleSimulateClearAir}
                  className="px-3.5 py-2 rounded-xl font-bold text-xs bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-700/60 flex items-center gap-1.5 ml-auto transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Curăță Aerul & Reset Siguranță
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: C++ Source & Educational Protocol */}
        <div className="lg:col-span-5 space-y-6">
          {/* C++ Code Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-mono font-bold text-slate-200">gas_safety_alarm.ino</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Arduino C++</span>
            </div>

            <pre className="mt-3 text-[11px] font-mono text-slate-300 leading-relaxed overflow-x-auto bg-slate-900/90 p-3 rounded-xl border border-slate-800/80">
              <code>{`#include <Servo.h>

const int pinGaz = A0;      // Senzor MQ-2
const int pinFlacara = 3;   // Senzor optic
const int pinBuzzer = 8;    // Difuzor piezo
const int pinReleu = 7;     // Ventilator evacuare
Servo valvaGaz;

void setup() {
  pinMode(pinFlacara, INPUT);
  pinMode(pinBuzzer, OUTPUT);
  pinMode(pinReleu, OUTPUT);
  valvaGaz.attach(9);
  valvaGaz.write(90); // Normal deschis
}

void loop() {
  int nivelGaz = analogRead(pinGaz);
  int flacara = digitalRead(pinFlacara);

  if (nivelGaz > ${GAS_THRESHOLD} || flacara == LOW) {
    // URGENȚĂ: Sună alarma, pornește ventilatorul, taie gazul
    tone(pinBuzzer, 2000, 300);
    digitalWrite(pinReleu, HIGH);
    valvaGaz.write(0); // Închidere robinet
  } else {
    // Stare de siguranță
    noTone(pinBuzzer);
    digitalWrite(pinReleu, LOW);
  }
}`}</code>
            </pre>
          </div>

          {/* Educational Checklist */}
          <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              Misiuni Laborator Siguranță Gaz
            </h3>
            <p className="text-xs text-slate-300">
              Verifică reacția în lanț conform manualului (pag. 104):
            </p>

            <div className="space-y-2 text-xs">
              <div className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                testedSafeBaseline ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-slate-800/50 border-slate-700 text-slate-400'
              }`}>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${testedSafeBaseline ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span>1. Verifică starea normală de siguranță (&lt; 300 ADC, valva la 90°)</span>
              </div>

              <div className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                testedGasAlarm ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-slate-800/50 border-slate-700 text-slate-400'
              }`}>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${testedGasAlarm ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span>2. Depășește pragul critic de 450 ADC (pornire buzzer + LED de alarmă)</span>
              </div>

              <div className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                testedEmergencyResponse ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-slate-800/50 border-slate-700 text-slate-400'
              }`}>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${testedEmergencyResponse ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span>3. Verifică acționarea releului (ventilator ON) și blocarea valvei (0°)</span>
              </div>
            </div>

            {/* Next Level Button */}
            <div className="pt-2">
              <button
                disabled={!allCompleted}
                onClick={handleFinish}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                  allCompleted
                    ? 'bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-400 hover:to-red-400 text-white cursor-pointer hover:shadow-rose-500/25'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <span>Continuă spre Nivelul 4: Stație Meteo IoT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
