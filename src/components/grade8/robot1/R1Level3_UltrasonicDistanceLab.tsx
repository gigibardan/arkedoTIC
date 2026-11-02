import React, { useState } from 'react';
import {
  Radio,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  HelpCircle,
  Volume2,
  VolumeX,
  Gauge,
  Sliders,
  ShieldAlert,
  Zap
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface R1Level3Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const R1Level3_UltrasonicDistanceLab: React.FC<R1Level3Props> = ({
  onCompletePage,
  onComplete
}) => {
  // Target obstacle distance in cm (between 5 and 150)
  const [distanceCm, setDistanceCm] = useState<number>(45);
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [buzzerEnabled, setBuzzerEnabled] = useState<boolean>(true);

  // Quiz
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  // Speed of sound in cm per microsecond: 0.0343 cm / microsecond (343 m/s)
  // round-trip travel time in microseconds: (distanceCm * 2) / 0.0343
  const roundTripTimeUs = Math.round((distanceCm * 2) / 0.0343);
  const isDangerZone = distanceCm <= 20;

  const handleTriggerPing = () => {
    sounds.playClick();
    setIsPinging(true);
    if (isDangerZone && buzzerEnabled) {
      sounds.playWrong();
    } else {
      sounds.playCorrect();
    }
    setTimeout(() => {
      setIsPinging(false);
    }, 600);
  };

  const isLevelCompleted =
    q1Answer === 'dus_intors' && q2Answer === 'pulse_in';

  const handleFinish = () => {
    if (!isLevelCompleted) return;
    sounds.playLevelComplete();
    if (onCompletePage) onCompletePage(150);
    if (onComplete) onComplete();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-950/70 via-slate-900 to-cyan-950/70 border border-teal-800/40 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-500/20 border border-teal-500/40 rounded-xl text-teal-300">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-teal-400 font-semibold">
                Nivelul 3 • Unitatea 4: Robotică (Manual pag. 94–95)
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Laborator Senzor Ultrasonic HC-SR04 &amp; Calcul Distanță
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-900/40 border border-teal-700/50 rounded-lg text-teal-300 text-sm font-mono">
            <span>v = 343 m/s (0.0343 cm/µs)</span>
          </div>
        </div>
        <p className="mt-3 text-slate-300 text-sm leading-relaxed">
          Senzorul HC-SR04 emite un impuls acustic la <strong>40 kHz</strong> (imperceptibil pentru urechea umană).
          Măsurând durata în microsecunde în care ecoul se întoarce la capsula receptoare,
          microcontrollerul calculează distanța exactă aplicând formula fizică: <code>distanță = (timp * 0.0343) / 2</code>.
        </p>
      </div>

      {/* Main Grid: Interactive Acoustic Simulation & Formula */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 2D Acoustic Radar Benchmark */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">
                Banc de Măsurare Metrică Ultrasonică
              </span>
              <button
                onClick={handleTriggerPing}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  isPinging
                    ? 'bg-teal-400 text-slate-950 scale-105'
                    : 'bg-teal-600 hover:bg-teal-500 text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                Emite Puls Ultrasonic (Trigger)
              </button>
            </div>

            {/* Slider to adjust distance */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Poziționează Obstacolul:</span>
                <span className="text-teal-300 font-bold">{distanceCm} cm</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                value={distanceCm}
                onChange={(e) => setDistanceCm(Number(e.target.value))}
                className="w-full accent-teal-500 h-2 bg-slate-950 rounded-lg cursor-pointer"
              />
            </div>

            {/* 2D Visual Distance Simulator Track */}
            <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 relative min-h-[170px] overflow-hidden flex items-center justify-between">
              {/* Ultrasonic Sensor Graphic (Left) */}
              <div className="flex flex-col items-center z-10">
                <div className="bg-teal-900/60 border-2 border-teal-500 p-2.5 rounded-xl shadow-lg flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-slate-800 border-2 border-teal-400 flex items-center justify-center text-[9px] font-mono text-teal-300 font-bold">
                    T
                  </div>
                  <div className="w-5 h-5 rounded-full bg-slate-800 border-2 border-teal-400 flex items-center justify-center text-[9px] font-mono text-teal-300 font-bold">
                    R
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-1 font-semibold">
                  HC-SR04
                </span>
              </div>

              {/* Acoustic Waves Visualization */}
              <div className="flex-1 mx-4 relative flex items-center">
                <div className="w-full border-b border-dashed border-slate-700 h-0" />
                {/* Acoustic Waves when pinging */}
                {isPinging && (
                  <div className="absolute inset-0 flex items-center justify-around pointer-events-none">
                    <span className="text-teal-400 text-lg animate-ping">)))</span>
                    <span className="text-cyan-400 text-lg animate-ping delay-100">(((</span>
                  </div>
                )}
                {/* Distance text label in middle */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold shadow ${
                      isDangerZone
                        ? 'bg-rose-950 text-rose-300 border border-rose-600'
                        : 'bg-slate-900 text-teal-300 border border-slate-700'
                    }`}
                  >
                    {distanceCm} cm
                  </span>
                </div>
              </div>

              {/* Obstacle Graphic (Right) */}
              <div
                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all z-10 ${
                  isDangerZone
                    ? 'bg-rose-950/60 border-rose-500 text-rose-300 animate-pulse ring-2 ring-rose-500/50'
                    : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                <span className="text-2xl">🧱</span>
                <span className="text-[10px] font-mono font-bold mt-1">
                  Obstacol
                </span>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="grid grid-cols-2 gap-3 font-mono text-center">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-1">
                  Durata Ecou Dus-Întors (pulseIn)
                </span>
                <span className="text-xl font-bold text-cyan-400">
                  {roundTripTimeUs} µs
                </span>
                <span className="text-[9px] text-slate-500 block mt-0.5">
                  microsecunde
                </span>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  isDangerZone
                    ? 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                    : 'bg-slate-950 border-slate-800 text-teal-300'
                }`}
              >
                <span className="text-[10px] text-slate-400 block mb-1">
                  Alertă Proximitate (&lt; 20 cm)
                </span>
                <span className="text-lg font-bold block">
                  {isDangerZone ? 'PERICOL COLIZIUNE' : 'TRAIECTORIE SIGURĂ'}
                </span>
                <span className="text-[9px] text-slate-500 block mt-0.5">
                  {isDangerZone ? 'Buzzer Activ • Robot Oprit' : 'Înainte cu viteză normală'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: C++ Code & Knowledge Checks */}
        <div className="lg:col-span-5 space-y-4">
          {/* C++ Code Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2">
            <span className="text-[11px] font-bold text-teal-400 block pb-1 border-b border-slate-800">
              Algoritmul C++ din Manual (pag. 95):
            </span>
            <pre className="text-slate-300 text-[11px] leading-relaxed overflow-x-auto">
{`// 1. Emisie impuls 10 microsecunde
digitalWrite(trigPin, HIGH);
delayMicroseconds(10);
digitalWrite(trigPin, LOW);

// 2. Măsurare timp recepție ecou
durata = pulseIn(echoPin, HIGH);

// 3. Calcul distanță dus-întors
distanta = (durata * 0.0343) / 2;`}
            </pre>
          </div>

          {/* Interactive Check Questions */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-400">
              <HelpCircle className="w-4 h-4" />
              <span>Verificare Înțelegere (Manual pag. 95)</span>
            </div>

            {/* Question 1 */}
            <div className="space-y-2 text-xs">
              <p className="text-slate-300 font-medium">
                1. De ce este obligatorie împărțirea la 2 în formula distanței: <code>(durata * 0.0343) / 2</code>?
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    id: 'dus_intors',
                    text: 'Deoarece unda sonoră parcurge distanța de două ori: de la emițător la obstacol (dus) și înapoi la receptor (întors).'
                  },
                  {
                    id: 'baterie',
                    text: 'Pentru a economisi jumătate din bateria robotului.'
                  }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      sounds.playClick();
                      setQ1Answer(opt.id);
                    }}
                    className={`text-left p-2.5 rounded-lg border transition-all text-xs ${
                      q1Answer === opt.id
                        ? opt.id === 'dus_intors'
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                          : 'bg-rose-950/60 border-rose-500 text-rose-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2 */}
            <div className="space-y-2 text-xs pt-2 border-t border-slate-800">
              <p className="text-slate-300 font-medium">
                2. Ce funcție C++ măsoară timpul cât un pin rămâne în starea HIGH (durata pulsului)?
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'pulse_in', text: 'pulseIn(echoPin, HIGH)' },
                  { id: 'delay_func', text: 'delay(1000)' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      sounds.playClick();
                      setQ2Answer(opt.id);
                    }}
                    className={`text-left p-2.5 rounded-lg border transition-all text-xs ${
                      q2Answer === opt.id
                        ? opt.id === 'pulse_in'
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                          : 'bg-rose-950/60 border-rose-500 text-rose-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isLevelCompleted
                ? 'bg-teal-500/20 text-teal-400'
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              {isLevelCompleted
                ? 'Nivelul 3 Finalizat cu Succes!'
                : 'Cerințe: Testează bancul ultrasonic și răspunde corect la cele 2 întrebări.'}
            </div>
            <div className="text-xs text-slate-400">
              Recompensă: +150 puncte XP și deblocarea Laboratorului de Motoare &amp; Actuatori (Nivelul 4).
            </div>
          </div>
        </div>

        <button
          onClick={handleFinish}
          disabled={!isLevelCompleted}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            isLevelCompleted
              ? 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white shadow-lg shadow-teal-500/20 cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Continuă spre Nivelul 4</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
