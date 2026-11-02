import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Zap,
  Activity,
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
  ShieldCheck,
  Flame,
  Clock
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface R2Level1Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const R2Level1_SmartStreetlightLab: React.FC<R2Level1Props> = ({
  onCompletePage,
  onComplete,
}) => {
  // Simulator State
  const [ambientLux, setAmbientLux] = useState<number>(200); // 0 (beznă) .. 1000 (soare puternic)
  const [pirMotion, setPirMotion] = useState<boolean>(false);
  const [motionTimer, setMotionTimer] = useState<number>(0);
  const [hysteresisEnabled, setHysteresisEnabled] = useState<boolean>(true);
  const [lightThreshold, setLightThreshold] = useState<number>(400); // ADC threshold

  // Challenge checks
  const [testedDayEco, setTestedDayEco] = useState<boolean>(false);
  const [testedNightDim, setTestedNightDim] = useState<boolean>(false);
  const [testedNightMotion, setTestedNightMotion] = useState<boolean>(false);

  // Convert Lux to ADC (LDR inverse: întuneric -> ADC mic, lumină -> ADC mare cu divizor)
  const adcValue = Math.min(1023, Math.max(0, Math.round((ambientLux / 1000) * 1023)));

  // Streetlight logic
  const isNight = adcValue < lightThreshold;
  let lampMode: 'OFF' | 'DIMMED' | 'FULL' = 'OFF';
  let pwmValue = 0;

  if (!isNight) {
    lampMode = 'OFF';
    pwmValue = 0;
  } else if (pirMotion || motionTimer > 0) {
    lampMode = 'FULL';
    pwmValue = 255;
  } else {
    lampMode = 'DIMMED';
    pwmValue = 75; // ~30%
  }

  // Handle PIR trigger with 5-second countdown
  useEffect(() => {
    let interval: any = null;
    if (motionTimer > 0) {
      interval = setInterval(() => {
        setMotionTimer((prev) => {
          if (prev <= 1) {
            setPirMotion(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [motionTimer]);

  // Monitor progress
  useEffect(() => {
    if (!isNight && lampMode === 'OFF') {
      setTestedDayEco(true);
    }
    if (isNight && lampMode === 'DIMMED') {
      setTestedNightDim(true);
    }
    if (isNight && lampMode === 'FULL') {
      setTestedNightMotion(true);
    }
  }, [isNight, lampMode]);

  const handleTriggerMotion = () => {
    sounds.playClick();
    setPirMotion(true);
    setMotionTimer(5);
  };

  const allTasksCompleted = testedDayEco && testedNightDim && testedNightMotion;

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
      <div className="bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-slate-900/60 border border-emerald-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300">
              <Sun className="w-8 h-8 animate-pulse text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Modulul 4B • Pasul 1 din 7
                </span>
                <span className="text-xs text-slate-400 font-mono">Manual Art Klett pag. 99–101</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
                Sistem Inteligent de Iluminat Public (Smart Streetlight)
              </h1>
              <p className="text-slate-300 text-sm mt-1 max-w-2xl">
                Automatizează iluminatul stradal folosind un senzor de lumină ambientală (LDR), un senzor piroelectric de mișcare (PIR) și modulație PWM pentru economisirea energiei cu până la 70%.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-700/60">
            <div className="text-right">
              <div className="text-xs text-slate-400">Economie Energie</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">
                {lampMode === 'OFF' ? '100%' : lampMode === 'DIMMED' ? '70%' : '0%'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Scene Simulator */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/70 border border-slate-700/60 rounded-2xl p-6 shadow-lg relative overflow-hidden">
            <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-teal-400" />
              Simulare Stradală în Timp Real: Zi / Noapte & Mișcare
            </h2>

            {/* Visual Environment Canvas */}
            <div
              className={`relative h-64 rounded-xl border border-slate-700 overflow-hidden transition-colors duration-700 flex flex-col justify-end p-6 ${
                ambientLux > 500
                  ? 'bg-gradient-to-b from-sky-400 via-sky-200 to-amber-100'
                  : ambientLux > 200
                  ? 'bg-gradient-to-b from-indigo-900 via-purple-900 to-amber-900/40'
                  : 'bg-gradient-to-b from-slate-950 via-slate-900 to-black'
              }`}
            >
              {/* Sun or Moon */}
              <div className="absolute top-4 right-6 transition-all duration-700">
                {ambientLux > 400 ? (
                  <div className="flex items-center gap-2 bg-amber-500/20 px-3 py-1.5 rounded-full border border-amber-400/40 backdrop-blur-sm">
                    <Sun className="w-6 h-6 text-amber-300 animate-spin" style={{ animationDuration: '30s' }} />
                    <span className="text-xs font-bold text-amber-200">Soare ({ambientLux} Lux)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-indigo-500/20 px-3 py-1.5 rounded-full border border-indigo-400/40 backdrop-blur-sm">
                    <Moon className="w-5 h-5 text-indigo-200" />
                    <span className="text-xs font-bold text-indigo-200">Noapte ({ambientLux} Lux)</span>
                  </div>
                )}
              </div>

              {/* Streetlight Post */}
              <div className="absolute left-20 bottom-12 flex flex-col items-center">
                {/* Lamp Fixture with Cone Light Effect */}
                <div className="relative">
                  <div
                    className={`w-12 h-4 rounded-t-lg transition-all duration-500 ${
                      lampMode === 'OFF'
                        ? 'bg-slate-700'
                        : lampMode === 'DIMMED'
                        ? 'bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.5)]'
                        : 'bg-yellow-200 shadow-[0_0_50px_rgba(254,240,138,0.95)]'
                    }`}
                  />
                  {/* Light Cone Overlay */}
                  {lampMode !== 'OFF' && (
                    <div
                      className={`absolute top-4 left-1/2 -translate-x-1/2 w-48 h-40 pointer-events-none transition-opacity duration-500 ${
                        lampMode === 'DIMMED'
                          ? 'opacity-30 bg-gradient-to-b from-amber-300/60 to-transparent'
                          : 'opacity-85 bg-gradient-to-b from-yellow-100/90 to-transparent'
                      }`}
                      style={{
                        clipPath: 'polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%)'
                      }}
                    />
                  )}
                </div>
                {/* Pole */}
                <div className="w-2.5 h-36 bg-slate-600 rounded-sm" />
                <div className="w-6 h-2 bg-slate-700 rounded-sm" />
              </div>

              {/* Pedestrian / Car passing */}
              <div className="absolute bottom-12 right-20 flex flex-col items-center">
                {pirMotion ? (
                  <div className="flex flex-col items-center animate-bounce">
                    <span className="text-2xl">🚶</span>
                    <span className="text-[10px] bg-emerald-500/90 text-black font-extrabold px-1.5 py-0.5 rounded shadow">
                      PIR DETECTAT!
                    </span>
                  </div>
                ) : (
                  <div className="opacity-40 flex flex-col items-center">
                    <span className="text-2xl filter grayscale">🛣️</span>
                    <span className="text-[10px] text-slate-400">Zonă Liberă</span>
                  </div>
                )}
              </div>

              {/* Street Surface */}
              <div className="w-full h-10 bg-slate-800 border-t-2 border-slate-600 flex items-center justify-center">
                <div className="w-full border-t border-dashed border-yellow-400/50" />
              </div>
            </div>

            {/* Interactive Control Panel */}
            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between items-center text-sm font-medium text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-400" />
                    Intensitate Lumină Ambientală (LDR pe pinul A0):
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {ambientLux} Lux &rarr; ADC: {adcValue} / 1023
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="25"
                  value={ambientLux}
                  onChange={(e) => setAmbientLux(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>0 Lux (Noapte adâncă)</span>
                  <span className="text-amber-400 font-semibold">Prag comutare: ~{lightThreshold} ADC</span>
                  <span>1000 Lux (Amiază senină)</span>
                </div>
              </div>

              {/* PIR Trigger Button */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                <button
                  onClick={handleTriggerMotion}
                  className="px-4 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-lg flex items-center gap-2 active:scale-95 transition-all"
                >
                  <Activity className="w-4 h-4" />
                  Simulează Pieton / Vehicul (Declanșare PIR)
                </button>

                {motionTimer > 0 ? (
                  <div className="flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/40 text-xs font-mono font-bold animate-pulse">
                    <Clock className="w-3.5 h-3.5" />
                    Reținere mișcare: {motionTimer}s
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">PIR în repaus (LOW)</span>
                )}
              </div>
            </div>
          </div>

          {/* Status Diagnostic Card */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl text-center">
              <div className="text-xs text-slate-400">Stare LDR (A0)</div>
              <div className="text-sm font-bold mt-1 text-white">
                {isNight ? '🌙 Noapte' : '☀️ Zi'}
              </div>
              <div className="text-[11px] font-mono text-emerald-400">{adcValue} ADC</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl text-center">
              <div className="text-xs text-slate-400">Senzor PIR (D2)</div>
              <div className="text-sm font-bold mt-1 text-white">
                {pirMotion || motionTimer > 0 ? '🚶 DETECTAT' : '💤 REPAUS'}
              </div>
              <div className="text-[11px] font-mono text-amber-400">
                {pirMotion || motionTimer > 0 ? 'HIGH (5V)' : 'LOW (0V)'}
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl text-center">
              <div className="text-xs text-slate-400">Lampă PWM (~D9)</div>
              <div className="text-sm font-bold mt-1 text-white">
                {lampMode === 'OFF' ? 'STINS' : lampMode === 'DIMMED' ? 'ECO (30%)' : 'MAX (100%)'}
              </div>
              <div className="text-[11px] font-mono text-teal-400">{pwmValue} / 255 PWM</div>
            </div>
          </div>
        </div>

        {/* Right Column: C++ Source & Educational Protocol */}
        <div className="lg:col-span-5 space-y-6">
          {/* C++ Code Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-slate-200">smart_streetlight.ino</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Arduino C++</span>
            </div>

            <pre className="mt-3 text-[11px] font-mono text-slate-300 leading-relaxed overflow-x-auto bg-slate-900/90 p-3 rounded-xl border border-slate-800/80">
              <code>{`// Pini & Praguri
const int pinLDR = A0;      // Senzor lumină
const int pinPIR = 2;       // Senzor mișcare
const int pinLED = 9;       // Lampă stradală (PWM)
const int PRAG_LUMINA = ${lightThreshold};

void setup() {
  pinMode(pinPIR, INPUT);
  pinMode(pinLED, OUTPUT);
}

void loop() {
  int lumina = analogRead(pinLDR); // 0..1023
  int miscare = digitalRead(pinPIR); // 0 sau 1

  if (lumina > PRAG_LUMINA) {
    // Zi: Stins complet pentru economie maximă
    analogWrite(pinLED, 0);
  } else if (miscare == HIGH) {
    // Noapte + Mișcare: Iluminat la 100%
    analogWrite(pinLED, 255);
  } else {
    // Noapte fără mișcare: Mod Eco 30%
    analogWrite(pinLED, 75);
  }
}`}</code>
            </pre>
          </div>

          {/* Educational Checklist & Completion */}
          <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Laborator Interactiv: Misiuni de Testare
            </h3>
            <p className="text-xs text-slate-300">
              Verifică cele 3 scenarii de eficiență energetică din manualul de Informatică (pag. 100):
            </p>

            <div className="space-y-2 text-xs">
              <div className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                testedDayEco ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-slate-800/50 border-slate-700 text-slate-400'
              }`}>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${testedDayEco ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span>1. Reglează lumina la peste 500 Lux (Zi: Lampa stinsă la 0V)</span>
              </div>

              <div className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                testedNightDim ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-slate-800/50 border-slate-700 text-slate-400'
              }`}>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${testedNightDim ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span>2. Coboară lumina sub 300 Lux (Noapte fără pietoni: Mod Eco 30% PWM)</span>
              </div>

              <div className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                testedNightMotion ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-slate-800/50 border-slate-700 text-slate-400'
              }`}>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${testedNightMotion ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span>3. Declanșează senzorul PIR noaptea (Iluminare maximă 100% PWM 255)</span>
              </div>
            </div>

            {/* Next Level Button */}
            <div className="pt-2">
              <button
                disabled={!allTasksCompleted}
                onClick={handleFinish}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                  allTasksCompleted
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white cursor-pointer hover:shadow-emerald-500/25'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <span>Continuă spre Nivelul 2: Barieră de Parcare</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
