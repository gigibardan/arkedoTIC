import React, { useState } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Play,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  HelpCircle,
  Zap,
  Gauge,
  Sliders,
  Compass,
  ArrowUp,
  ArrowDown,
  Square
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface R1Level4Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const R1Level4_ActuatorsMotorsServos: React.FC<R1Level4Props> = ({
  onCompletePage,
  onComplete
}) => {
  // Servo State (0° to 180°)
  const [servoAngle, setServoAngle] = useState<number>(90);

  // DC Motor State
  const [motorDirection, setMotorDirection] = useState<'forward' | 'reverse' | 'stop'>('stop');
  const [motorSpeedPwm, setMotorSpeedPwm] = useState<number>(180); // 0 to 255

  // Quiz
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const handleSetServo = (angle: number) => {
    sounds.playClick();
    setServoAngle(angle);
  };

  const handleSetMotorDir = (dir: 'forward' | 'reverse' | 'stop') => {
    sounds.playClick();
    setMotorDirection(dir);
  };

  const isLevelCompleted =
    q1Answer === 'punte_h_sens' && q2Answer === 'servo_unghi';

  const handleFinish = () => {
    if (!isLevelCompleted) return;
    sounds.playLevelComplete();
    if (onCompletePage) onCompletePage(150);
    if (onComplete) onComplete();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-orange-950/70 border border-amber-800/40 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-semibold">
                Nivelul 4 • Unitatea 4: Robotică (Manual pag. 95–96)
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Actuatori Robotici: Servomotoare &amp; Motoare DC cu Punte H
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-900/40 border border-amber-700/50 rounded-lg text-amber-300 text-sm font-mono">
            <span>PWM 0..255 • Unghi 0°..180°</span>
          </div>
        </div>
        <p className="mt-3 text-slate-300 text-sm leading-relaxed">
          Dacă senzorii reprezintă simțurile, <strong>actuatorii sunt „mușchii” robotului</strong>.
          Pentru orientare precisă (ex. rotirea capului ultrasonic) folosim un <strong>servomotor (0°..180°)</strong>,
          iar pentru propulsie folosim <strong>motoare de curent continuu (DC)</strong> comandate printr-un driver punte H (L298N).
        </p>
      </div>

      {/* Main Grid: Dual Actuator Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Servomotor SG90 Playground */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-sm font-semibold">
                <Compass className="w-4 h-4" />
                <span>Servomotor SG90 (Poziționare Unghiulară)</span>
              </div>
              <span className="text-xs bg-slate-800 text-amber-300 px-2 py-0.5 rounded font-mono">
                Servo.write({servoAngle}°)
              </span>
            </div>

            {/* Visual Servo Arm Needle */}
            <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center min-h-[170px] relative overflow-hidden">
              <div className="w-28 h-28 rounded-full border-4 border-slate-800 relative flex items-center justify-center shadow-inner">
                {/* Degree ticks */}
                <span className="absolute top-1 text-[9px] font-mono text-slate-500">90°</span>
                <span className="absolute left-1 text-[9px] font-mono text-slate-500">0°</span>
                <span className="absolute right-1 text-[9px] font-mono text-slate-500">180°</span>

                {/* Rotating Arm Needle */}
                <div
                  className="w-1.5 h-12 bg-amber-400 rounded-full origin-bottom transition-transform duration-300 shadow-[0_0_10px_#f59e0b]"
                  style={{
                    transform: `rotate(${servoAngle - 90}deg)`
                  }}
                />
                <div className="w-4 h-4 bg-slate-200 rounded-full absolute shadow" />
              </div>

              <div className="mt-3 text-xs font-mono text-center">
                <span className="text-slate-400">Unghi curent: </span>
                <strong className="text-amber-300 text-sm">{servoAngle} grade</strong>
              </div>
            </div>

            {/* Quick Angle Presets */}
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              <button
                onClick={() => handleSetServo(0)}
                className={`py-2 rounded-lg border transition-all ${
                  servoAngle === 0
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                0° (Stânga)
              </button>
              <button
                onClick={() => handleSetServo(90)}
                className={`py-2 rounded-lg border transition-all ${
                  servoAngle === 90
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                90° (Centru)
              </button>
              <button
                onClick={() => handleSetServo(180)}
                className={`py-2 rounded-lg border transition-all ${
                  servoAngle === 180
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                180° (Dreapta)
              </button>
            </div>

            {/* Slider fine control */}
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max="180"
                value={servoAngle}
                onChange={(e) => setServoAngle(Number(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-slate-950 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right: DC Motor & H-Bridge Playground */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-semibold">
                <Gauge className="w-4 h-4" />
                <span>Motor DC &amp; Driver Punte H (L298N)</span>
              </div>
              <span className="text-xs bg-slate-800 text-cyan-300 px-2 py-0.5 rounded font-mono">
                PWM: {motorSpeedPwm} / 255
              </span>
            </div>

            {/* Visual Rotating Wheel Graphic */}
            <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center min-h-[170px] relative">
              <div
                className={`w-24 h-24 rounded-full border-4 border-dashed flex items-center justify-center transition-all ${
                  motorDirection === 'stop'
                    ? 'border-slate-700 text-slate-600'
                    : motorDirection === 'forward'
                    ? 'border-cyan-400 text-cyan-300 animate-spin shadow-[0_0_15px_#06b6d4]'
                    : 'border-rose-400 text-rose-300 animate-spin shadow-[0_0_15px_#f43f5e]'
                }`}
                style={{
                  animationDuration: `${Math.max(0.2, 1.5 - (motorSpeedPwm / 255))}s`,
                  animationDirection: motorDirection === 'reverse' ? 'reverse' : 'normal'
                }}
              >
                <span className="text-2xl font-bold font-mono">
                  {motorDirection === 'stop' ? '⏹' : '⚙️'}
                </span>
              </div>

              <div className="mt-3 text-xs font-mono text-center">
                <span className="text-slate-400">Sens &amp; Stare: </span>
                <strong
                  className={
                    motorDirection === 'forward'
                      ? 'text-cyan-300'
                      : motorDirection === 'reverse'
                      ? 'text-rose-300'
                      : 'text-slate-500'
                  }
                >
                  {motorDirection === 'forward'
                    ? 'ÎNAINTE (IN1=HIGH, IN2=LOW)'
                    : motorDirection === 'reverse'
                    ? 'ÎNAPOI (IN1=LOW, IN2=HIGH)'
                    : 'OPRIT (IN1=LOW, IN2=LOW)'}
                </strong>
              </div>
            </div>

            {/* Direction Buttons */}
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              <button
                onClick={() => handleSetMotorDir('forward')}
                className={`py-2 rounded-lg border flex items-center justify-center gap-1 transition-all ${
                  motorDirection === 'forward'
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <ArrowUp className="w-3.5 h-3.5" />
                Înainte
              </button>
              <button
                onClick={() => handleSetMotorDir('stop')}
                className={`py-2 rounded-lg border flex items-center justify-center gap-1 transition-all ${
                  motorDirection === 'stop'
                    ? 'bg-slate-700 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <Square className="w-3.5 h-3.5" />
                Stop
              </button>
              <button
                onClick={() => handleSetMotorDir('reverse')}
                className={`py-2 rounded-lg border flex items-center justify-center gap-1 transition-all ${
                  motorDirection === 'reverse'
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <ArrowDown className="w-3.5 h-3.5" />
                Înapoi
              </button>
            </div>

            {/* Speed PWM Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Viteză Rotație (PWM analogWrite):</span>
                <span className="text-cyan-300 font-bold">{motorSpeedPwm} / 255</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={motorSpeedPwm}
                onChange={(e) => setMotorSpeedPwm(Number(e.target.value))}
                className="w-full accent-cyan-500 h-2 bg-slate-950 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Check Questions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-amber-400">
          <HelpCircle className="w-4 h-4" />
          <span>Verificare Înțelegere Actuatori (Manual pag. 96)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1 */}
          <div className="space-y-2 text-xs">
            <p className="text-slate-300 font-medium">
              1. De ce este necesară o punte H (circuitul L298N) pentru comanda unui motor de curent continuu?
            </p>
            <div className="space-y-2">
              {[
                {
                  id: 'punte_h_sens',
                  text: 'Permite inversarea sensului de rotație (înainte/înapoi) și amplifică curentul fără a arde pinii plăcii Arduino.'
                },
                {
                  id: 'punte_h_sunet',
                  text: 'Transformă motorul într-un difuzor muzical pentru sonerii.'
                }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    sounds.playClick();
                    setQ1Answer(opt.id);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs ${
                    q1Answer === opt.id
                      ? opt.id === 'punte_h_sens'
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
          <div className="space-y-2 text-xs">
            <p className="text-slate-300 font-medium">
              2. Prin ce se deosebește fundamental un servomotor SG90 de un motor DC clasic?
            </p>
            <div className="space-y-2">
              {[
                {
                  id: 'servo_unghi',
                  text: 'Servomotorul se poziționează la un unghi precis (0°..180°), în timp ce motorul DC se rotește continuu.'
                },
                {
                  id: 'servo_viteza',
                  text: 'Servomotorul funcționează doar cu combustibil lichid.'
                }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    sounds.playClick();
                    setQ2Answer(opt.id);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs ${
                    q2Answer === opt.id
                      ? opt.id === 'servo_unghi'
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

      {/* Completion Banner */}
      <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isLevelCompleted
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              {isLevelCompleted
                ? 'Nivelul 4 Finalizat cu Succes!'
                : 'Cerințe: Răspunde corect la cele 2 întrebări despre actuatori, servomotoare și puntea H.'}
            </div>
            <div className="text-xs text-slate-400">
              Recompensă: +150 puncte XP și deblocarea Robotului Autonom Evitator de Obstacole (Nivelul 5).
            </div>
          </div>
        </div>

        <button
          onClick={handleFinish}
          disabled={!isLevelCompleted}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            isLevelCompleted
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-lg shadow-amber-500/20 cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Continuă spre Nivelul 5</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
