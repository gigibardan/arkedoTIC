import React, { useState, useEffect } from 'react';
import {
  Car,
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
  Check,
  Activity,
  Layers,
  Volume2
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface R2Level2Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const R2Level2_SmartParkingBarrier: React.FC<R2Level2Props> = ({
  onCompletePage,
  onComplete,
}) => {
  // State
  const MAX_SPOTS = 4;
  const [freeSpots, setFreeSpots] = useState<number>(3);
  const [distanceCm, setDistanceCm] = useState<number>(45); // distance to ultrasonic sensor
  const [servoAngle, setServoAngle] = useState<number>(0); // 0 = Closed (horizontal), 90 = Open (vertical)
  const [carState, setCarState] = useState<'NONE' | 'APPROACHING' | 'WAITING' | 'PASSING' | 'PARKED'>('NONE');
  const [gateClosingTimer, setGateClosingTimer] = useState<number>(0);

  // Challenges
  const [testedEntryPass, setTestedEntryPass] = useState<boolean>(false);
  const [testedFullBlock, setTestedFullBlock] = useState<boolean>(false);
  const [testedExitCar, setTestedExitCar] = useState<boolean>(false);

  // Barrier logic
  const isVehicleDetected = distanceCm <= 15;
  const isParkingFull = freeSpots <= 0;
  const isBarrierOpen = servoAngle >= 80;

  // Gate control based on rules
  useEffect(() => {
    if (isVehicleDetected) {
      if (!isParkingFull) {
        // Open barrier
        setServoAngle(90);
        sounds.playClick();
      } else {
        // Full: keep barrier at 0
        setServoAngle(0);
        sounds.playWrong();
      }
    } else if (carState === 'NONE' || carState === 'PARKED') {
      // Vehicle left or parked
      setServoAngle(0);
    }
  }, [distanceCm, isParkingFull, carState]);

  // Car simulation handler
  const handleSimulateApproach = () => {
    sounds.playClick();
    setDistanceCm(8); // Car right at barrier
    setCarState('WAITING');
  };

  const handleSimulatePass = () => {
    if (isParkingFull) return;
    sounds.playCorrect();
    setCarState('PASSING');
    setTimeout(() => {
      setCarState('PARKED');
      setDistanceCm(50); // Sensor cleared
      setFreeSpots((prev) => Math.max(0, prev - 1));
      setTestedEntryPass(true);
    }, 1500);
  };

  const handleSimulateExit = () => {
    if (freeSpots >= MAX_SPOTS) return;
    sounds.playClick();
    setFreeSpots((prev) => Math.min(MAX_SPOTS, prev + 1));
    setTestedExitCar(true);
  };

  const handleFillParking = () => {
    sounds.playClick();
    setFreeSpots(0);
    setTestedFullBlock(true);
  };

  const handleReset = () => {
    sounds.playClick();
    setFreeSpots(3);
    setDistanceCm(45);
    setServoAngle(0);
    setCarState('NONE');
  };

  const allCompleted = testedEntryPass && (testedFullBlock || freeSpots === 0) && testedExitCar;

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
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900/60 border border-blue-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-300">
              <Car className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Modulul 4B • Pasul 2 din 7
                </span>
                <span className="text-xs text-slate-400 font-mono">Manual Art Klett pag. 102–104</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
                Barieră Inteligentă de Parcare (Smart Parking Gate)
              </h1>
              <p className="text-slate-300 text-sm mt-1 max-w-2xl">
                Controlează accesul vehiculelor cu senzorul ultrasonic HC-SR04, un servomotor SG90 (0°..90°) și o variabilă contor pentru locurile libere.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-700/60">
            <div className="text-right">
              <div className="text-xs text-slate-400">Locuri Libere</div>
              <div className={`text-xl font-bold font-mono ${freeSpots > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {freeSpots} / {MAX_SPOTS}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Gate & Parking Lot Simulation */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/70 border border-slate-700/60 rounded-2xl p-6 shadow-lg">
            <h2 className="text-base font-semibold text-slate-200 flex items-center justify-between mb-4">
              <span className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-400" />
                Vedere Poartă Acces & Simulare 2D Parcări
              </span>
              <button
                onClick={handleReset}
                className="text-xs flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Resetare
              </button>
            </h2>

            {/* Visual Canvas */}
            <div className="relative h-64 bg-slate-950 rounded-xl border border-slate-700 overflow-hidden p-6 flex flex-col justify-between">
              {/* Parking bays (top) */}
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: MAX_SPOTS }).map((_, idx) => {
                  const isOccupied = idx >= freeSpots;
                  return (
                    <div
                      key={idx}
                      className={`h-20 rounded-lg border-2 flex flex-col items-center justify-center p-1 transition-all ${
                        isOccupied
                          ? 'border-red-500/60 bg-red-950/20 text-red-300'
                          : 'border-emerald-500/60 bg-emerald-950/20 text-emerald-300 border-dashed'
                      }`}
                    >
                      <span className="text-[10px] font-mono font-bold">Loc #{idx + 1}</span>
                      {isOccupied ? (
                        <span className="text-2xl mt-1">🚗</span>
                      ) : (
                        <span className="text-xs text-emerald-400/80 font-bold mt-2">LIBER</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Road & Barrier Center Section */}
              <div className="relative h-28 border-t-2 border-slate-700 pt-3 flex items-center justify-between px-4">
                {/* Car visual position */}
                <div
                  className="transition-all duration-700 flex items-center gap-2"
                  style={{
                    transform: carState === 'NONE' ? 'translateX(-80px)' : carState === 'WAITING' ? 'translateX(40px)' : carState === 'PASSING' ? 'translateX(180px)' : 'translateX(-80px)'
                  }}
                >
                  <span className="text-3xl">🚙</span>
                  {carState === 'WAITING' && (
                    <span className="text-[10px] bg-blue-500 text-white font-bold px-1.5 py-0.5 rounded shadow">
                      d = {distanceCm} cm
                    </span>
                  )}
                </div>

                {/* Barrier Gate Post + Arm */}
                <div className="relative flex flex-col items-center">
                  {/* Gate status LED */}
                  <div className="flex items-center gap-1.5 mb-1 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                    <div className={`w-2.5 h-2.5 rounded-full ${isBarrierOpen ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} />
                    <span className="text-[10px] font-mono font-bold text-slate-300">
                      {isBarrierOpen ? 'LIBER (90°)' : 'STOP (0°)'}
                    </span>
                  </div>

                  {/* Barrier Arm (rotates with servoAngle) */}
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    {/* The Arm */}
                    <div
                      className="absolute right-3 bottom-3 w-32 h-2.5 rounded-full bg-gradient-to-r from-red-600 via-white to-red-600 border border-slate-900 origin-right transition-transform duration-500 shadow-md"
                      style={{
                        transform: `rotate(${-servoAngle}deg)`
                      }}
                    />
                    {/* Post Pivot */}
                    <div className="w-5 h-5 rounded-full bg-slate-500 border-2 border-slate-200 z-10" />
                  </div>
                  {/* Base */}
                  <div className="w-8 h-4 bg-slate-700 rounded-b mt-1" />
                </div>

                {/* Ultrasonic Sensor Icon */}
                <div className="flex flex-col items-center bg-slate-900/90 border border-slate-800 p-2 rounded-xl">
                  <div className="text-[10px] font-mono text-cyan-400 font-bold">HC-SR04</div>
                  <div className="flex gap-1 mt-1">
                    <div className="w-3 h-3 rounded-full bg-cyan-500/40 border border-cyan-400" />
                    <div className="w-3 h-3 rounded-full bg-cyan-500/40 border border-cyan-400" />
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1">Trig/Echo</span>
                </div>
              </div>
            </div>

            {/* Manual Controls & Distance Slider */}
            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between items-center text-sm font-medium text-slate-300 mb-1">
                  <span>Distanță vehicul față de barieră (HC-SR04):</span>
                  <span className="font-mono text-cyan-400 font-bold">{distanceCm} cm</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="60"
                  value={distanceCm}
                  onChange={(e) => {
                    setDistanceCm(Number(e.target.value));
                    if (Number(e.target.value) <= 15) {
                      setCarState('WAITING');
                    }
                  }}
                  className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span className="text-emerald-400 font-semibold">Zona declanșare: &le; 15 cm</span>
                  <span>Zonă liberă: &gt; 15 cm</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2.5 pt-2 border-t border-slate-800">
                <button
                  onClick={handleSimulateApproach}
                  className="px-3.5 py-2 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
                >
                  <Car className="w-3.5 h-3.5 text-blue-400" />
                  1. Apropie Mașină (d = 8 cm)
                </button>

                <button
                  disabled={!isBarrierOpen || carState !== 'WAITING'}
                  onClick={handleSimulatePass}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                    isBarrierOpen && carState === 'WAITING'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg cursor-pointer'
                      : 'bg-slate-800/40 text-slate-500 border border-slate-800 cursor-not-allowed'
                  }`}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  2. Mașina trece și parchează
                </button>

                <button
                  disabled={freeSpots >= MAX_SPOTS}
                  onClick={handleSimulateExit}
                  className="px-3.5 py-2 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 flex items-center gap-1.5 transition-all"
                >
                  <Car className="w-3.5 h-3.5 text-amber-400" />
                  3. O mașină părăsește parcarea (+1 loc)
                </button>

                <button
                  onClick={handleFillParking}
                  className="px-3.5 py-2 rounded-xl font-bold text-xs bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/50 flex items-center gap-1.5 ml-auto transition-all"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  Umple parcarea (0 locuri)
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
                <Code2 className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-mono font-bold text-slate-200">smart_parking_gate.ino</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Arduino Servo</span>
            </div>

            <pre className="mt-3 text-[11px] font-mono text-slate-300 leading-relaxed overflow-x-auto bg-slate-900/90 p-3 rounded-xl border border-slate-800/80">
              <code>{`#include <Servo.h>

Servo barieră;
int locuriLibere = ${freeSpots};
const int PRAG_DIST = 15; // cm

void setup() {
  barieră.attach(9);
  barieră.write(${servoAngle}); // 0 = Închis, 90 = Deschis
  pinMode(ledVerde, OUTPUT);
  pinMode(ledRosu, OUTPUT);
}

void loop() {
  long d = masoaraDistantaUltrasonic();

  if (d <= PRAG_DIST && locuriLibere > 0) {
    // Acces permis: ridică bariera la 90 grade
    barieră.write(90);
    digitalWrite(ledVerde, HIGH);
    digitalWrite(ledRosu, LOW);
  } else {
    // Închis / Parcare Plină
    barieră.write(0);
    digitalWrite(ledVerde, LOW);
    digitalWrite(ledRosu, HIGH);
  }
}`}</code>
            </pre>
          </div>

          {/* Educational Checklist */}
          <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Obiective Laborator Smart Parking
            </h3>
            <p className="text-xs text-slate-300">
              Urmează cei 3 pași metodici din manualul de Informatică (pag. 103):
            </p>

            <div className="space-y-2 text-xs">
              <div className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                testedEntryPass ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-slate-800/50 border-slate-700 text-slate-400'
              }`}>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${testedEntryPass ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span>1. Deschide bariera (&le; 15 cm) și permite parcarea unei mașini</span>
              </div>

              <div className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                testedFullBlock || freeSpots === 0 ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-slate-800/50 border-slate-700 text-slate-400'
              }`}>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${testedFullBlock || freeSpots === 0 ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span>2. Testează scenariul Parcare Plină (0 locuri &rarr; bariera rămâne la 0°)</span>
              </div>

              <div className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                testedExitCar ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-slate-800/50 border-slate-700 text-slate-400'
              }`}>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${testedExitCar ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span>3. Eliberează un loc (plecare mașină) și verifică reactivarea accesului</span>
              </div>
            </div>

            {/* Next Level Button */}
            <div className="pt-2">
              <button
                disabled={!allCompleted}
                onClick={handleFinish}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                  allCompleted
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white cursor-pointer hover:shadow-blue-500/25'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <span>Continuă spre Nivelul 3: Alertă Gaz & Securitate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
