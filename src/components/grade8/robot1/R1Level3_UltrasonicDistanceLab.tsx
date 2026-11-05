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
import { useLanguage } from '../../../context/LanguageContext';
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
  const { lang } = useLanguage();
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
                {lang === 'ro'
                  ? 'Nivelul 3 • Unitatea 4: Robotică (Manual pag. 94–95)'
                  : 'Level 3 • Unit 4: Robotics (Textbook pp. 94–95)'}
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {lang === 'ro'
                  ? 'Laborator Senzor Ultrasonic HC-SR04 & Calcul Distanță'
                  : 'HC-SR04 Ultrasonic Sensor Lab & Distance Calculation'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-900/40 border border-teal-700/50 rounded-lg text-teal-300 text-sm font-mono">
            <span>v = 343 m/s (0.0343 cm/µs)</span>
          </div>
        </div>
        <p className="mt-3 text-slate-300 text-sm leading-relaxed">
          {lang === 'ro' ? (
            <>
              Senzorul HC-SR04 emite un impuls acustic la <strong>40 kHz</strong> (imperceptibil pentru urechea umană).
              Măsurând durata în microsecunde în care ecoul se întoarce la capsula receptoare,
              microcontrollerul calculează distanța exactă aplicând formula fizică: <code>distanță = (timp * 0.0343) / 2</code>.
            </>
          ) : (
            <>
              The HC-SR04 sensor emits an acoustic pulse at <strong>40 kHz</strong> (ultrasonic, inaudible to humans).
              By measuring the duration in microseconds until the echo returns to the receiver module,
              the microcontroller calculates exact distance using the physics formula: <code>distance = (time * 0.0343) / 2</code>.
            </>
          )}
        </p>
      </div>

      {/* Main Grid: Interactive Acoustic Simulation & Formula */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 2D Acoustic Radar Benchmark */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">
                {lang === 'ro'
                  ? 'Banc de Măsurare Metrică Ultrasonică'
                  : 'Ultrasonic Metric Measurement Bench'}
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
                {lang === 'ro' ? 'Emite Puls Ultrasonic (Trigger)' : 'Emit Ultrasonic Pulse (Trigger)'}
              </button>
            </div>

            {/* Slider to adjust distance */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">
                  {lang === 'ro' ? 'Poziționează Obstacolul:' : 'Position Obstacle:'}
                </span>
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
                  {lang === 'ro' ? 'Obstacol' : 'Obstacle'}
                </span>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="grid grid-cols-2 gap-3 font-mono text-center">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-1">
                  {lang === 'ro' ? 'Durata Ecou Dus-Întors (pulseIn)' : 'Round-Trip Echo Duration (pulseIn)'}
                </span>
                <span className="text-xl font-bold text-cyan-400">
                  {roundTripTimeUs} µs
                </span>
                <span className="text-[9px] text-slate-500 block mt-0.5">
                  {lang === 'ro' ? 'microsecunde' : 'microseconds'}
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
                  {lang === 'ro' ? 'Alertă Proximitate (< 20 cm)' : 'Proximity Alert (< 20 cm)'}
                </span>
                <span className="text-lg font-bold block">
                  {isDangerZone
                    ? lang === 'ro' ? 'PERICOL COLIZIUNE' : 'COLLISION HAZARD'
                    : lang === 'ro' ? 'TRAIECTORIE SIGURĂ' : 'CLEAR TRAJECTORY'}
                </span>
                <span className="text-[9px] text-slate-500 block mt-0.5">
                  {isDangerZone
                    ? lang === 'ro' ? 'Buzzer Activ • Robot Oprit' : 'Active Buzzer • Robot Stopped'
                    : lang === 'ro' ? 'Înainte cu viteză normală' : 'Forward at normal speed'}
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
              {lang === 'ro' ? 'Algoritmul C++ din Manual (pag. 95):' : 'Textbook C++ Algorithm (p. 95):'}
            </span>
            <pre className="text-slate-300 text-[11px] leading-relaxed overflow-x-auto">
{lang === 'ro'
  ? `// 1. Emisie impuls 10 microsecunde
digitalWrite(trigPin, HIGH);
delayMicroseconds(10);
digitalWrite(trigPin, LOW);

// 2. Măsurare timp recepție ecou
durata = pulseIn(echoPin, HIGH);

// 3. Calcul distanță dus-întors
distanta = (durata * 0.0343) / 2;`
  : `// 1. Emit 10-microsecond pulse
digitalWrite(trigPin, HIGH);
delayMicroseconds(10);
digitalWrite(trigPin, LOW);

// 2. Measure echo reception duration
duration = pulseIn(echoPin, HIGH);

// 3. Calculate round-trip distance
distance = (duration * 0.0343) / 2;`}
            </pre>
          </div>

          {/* Interactive Check Questions */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-400">
              <HelpCircle className="w-4 h-4" />
              <span>
                {lang === 'ro'
                  ? 'Verificare Înțelegere (Manual pag. 95)'
                  : 'Comprehension Check (Textbook p. 95)'}
              </span>
            </div>

            {/* Question 1 */}
            <div className="space-y-2 text-xs">
              <p className="text-slate-300 font-medium">
                {lang === 'ro'
                  ? '1. De ce este obligatorie împărțirea la 2 în formula distanței: (durata * 0.0343) / 2?'
                  : '1. Why is dividing by 2 mandatory in the distance formula: (duration * 0.0343) / 2?'}
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    id: 'dus_intors',
                    text:
                      lang === 'ro'
                        ? 'Deoarece unda sonoră parcurge distanța de două ori: de la emițător la obstacol (dus) și înapoi la receptor (întors).'
                        : 'Because the sound wave travels the distance twice: from emitter to obstacle (out) and back to receiver (return).'
                  },
                  {
                    id: 'baterie',
                    text:
                      lang === 'ro'
                        ? 'Pentru a economisi jumătate din bateria robotului.'
                        : 'To save half of the robot\'s battery charge.'
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
                {lang === 'ro'
                  ? '2. Ce funcție C++ măsoară timpul cât un pin rămâne în starea HIGH (durata pulsului)?'
                  : '2. Which C++ function measures how long a pin stays in the HIGH state (pulse duration)?'}
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
                ? lang === 'ro'
                  ? 'Nivelul 3 Finalizat cu Succes!'
                  : 'Level 3 Successfully Completed!'
                : lang === 'ro'
                ? 'Cerințe: Testează bancul ultrasonic și răspunde corect la cele 2 întrebări.'
                : 'Requirements: Test the ultrasonic bench and answer both questions correctly.'}
            </div>
            <div className="text-xs text-slate-400">
              {lang === 'ro'
                ? 'Recompensă: +150 puncte XP și deblocarea Laboratorului de Motoare & Actuatori (Nivelul 4).'
                : 'Reward: +150 XP points and unlocking the Motors & Actuators Lab (Level 4).'}
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
          <span>{lang === 'ro' ? 'Continuă spre Nivelul 4' : 'Continue to Level 4'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
