import React, { useState } from 'react';
import {
  Binary,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  HelpCircle,
  Sun,
  Moon,
  Activity,
  Layers,
  Check,
  Radio,
  Sliders,
  Gauge
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface R1Level2Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const R1Level2_DigitalVsAnalogSensors: React.FC<R1Level2Props> = ({
  onCompletePage,
  onComplete
}) => {
  const [sensorType, setSensorType] = useState<'analog' | 'digital'>('analog');
  // Analog LDR slider: 0 (pitch dark) to 100 (bright sun)
  const [lightPercent, setLightPercent] = useState<number>(65);
  // Digital PIR motion detector: true / false
  const [motionDetected, setMotionDetected] = useState<boolean>(false);

  // Quiz
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  // Computations for Analog Sensor
  const adcValue = Math.round((lightPercent / 100) * 1023);
  const voltage = Number(((adcValue * 5.0) / 1023).toFixed(2));
  const isStreetlightOn = adcValue < 400; // Automatic threshold

  const binaryString = adcValue.toString(2).padStart(10, '0');

  const isLevelCompleted =
    q1Answer === 'adc_1024' && q2Answer === 'digital_two_states';

  const handleFinish = () => {
    if (!isLevelCompleted) return;
    sounds.playLevelComplete();
    if (onCompletePage) onCompletePage(150);
    if (onComplete) onComplete();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-cyan-950/70 border border-blue-800/40 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-300">
              <Binary className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-blue-400 font-semibold">
                Nivelul 2 • Unitatea 4: Robotică (Manual pag. 92–94)
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Senzori Digitali vs Senzori Analogici &amp; Conversia ADC
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-900/40 border border-blue-700/50 rounded-lg text-blue-300 text-sm font-mono">
            <span>Rezoluție ADC: 10 Biți (0..1023)</span>
          </div>
        </div>
        <p className="mt-3 text-slate-300 text-sm leading-relaxed">
          Roboții interacționează cu lumea prin senzori. <strong>Senzorii digitali</strong> oferă doar
          stări binare (0 sau 1, LOW sau HIGH), în timp ce <strong>senzorii analogici</strong> transmit
          o tensiune variabilă continuă (0V..5V), transformată de convertorul ADC pe 10 biți într-un număr întreg între <strong>0 și 1023</strong>.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
        <span className="text-xs font-mono text-slate-400">
          Alege tipul de senzor pentru experimentare:
        </span>
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => {
              setSensorType('analog');
              sounds.playClick();
            }}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              sensorType === 'analog'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Senzor Analogic (LDR - Lumină)</span>
          </button>
          <button
            onClick={() => {
              setSensorType('digital');
              sounds.playClick();
            }}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              sensorType === 'digital'
                ? 'bg-cyan-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Senzor Digital (PIR - Mișcare)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Sensor Control & Meter */}
        <div className="lg:col-span-7 space-y-4">
          {sensorType === 'analog' ? (
            /* Analog LDR Lab */
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-sm font-semibold">
                  <Sun className="w-4 h-4" />
                  <span>Senzor Foto-rezistență LDR pe Pinul A0</span>
                </div>
                <span className="text-xs bg-slate-800 text-amber-300 px-2 py-0.5 rounded font-mono">
                  analogRead(A0)
                </span>
              </div>

              {/* Slider for light */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Moon className="w-3.5 h-3.5 text-indigo-400" /> Întuneric (0%)
                  </span>
                  <span className="text-amber-300 font-bold">
                    Intensitate Luminoasă Ambientală: {lightPercent}%
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    Soare Direct (100%) <Sun className="w-3.5 h-3.5 text-amber-400" />
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={lightPercent}
                  onChange={(e) => setLightPercent(Number(e.target.value))}
                  className="w-full accent-amber-500 h-2 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>

              {/* Real-time Readings Dashboard */}
              <div className="grid grid-cols-3 gap-3 font-mono text-center">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">Tensiune Fizică</span>
                  <span className="text-lg font-bold text-cyan-400">{voltage} V</span>
                  <span className="text-[9px] text-slate-500 block mt-0.5">0.00V .. 5.00V</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-blue-500/40">
                  <span className="text-[10px] text-slate-400 block mb-1">Registru ADC (10 biți)</span>
                  <span className="text-xl font-bold text-amber-300">{adcValue}</span>
                  <span className="text-[9px] text-slate-500 block mt-0.5">0 .. 1023 trepte</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">Procent Scalat (map)</span>
                  <span className="text-lg font-bold text-emerald-400">{lightPercent}%</span>
                  <span className="text-[9px] text-slate-500 block mt-0.5">map(adc, 0, 1023, 0, 100)</span>
                </div>
              </div>

              {/* 10-bit Binary Register Representation */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Reprezentarea Binară în Registrul Microcontrollerului:</span>
                  <span className="text-amber-400 font-bold">2¹⁰ = 1024 stări</span>
                </div>
                <div className="flex justify-center gap-1 font-mono text-sm py-1 bg-slate-900 rounded border border-slate-800">
                  {binaryString.split('').map((bit, idx) => (
                    <span
                      key={idx}
                      className={`px-1.5 py-0.5 rounded ${
                        bit === '1'
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                          : 'text-slate-600'
                      }`}
                    >
                      {bit}
                    </span>
                  ))}
                </div>
              </div>

              {/* Automatic Streetlight Decision Simulation */}
              <div
                className={`p-3.5 rounded-xl border transition-colors flex items-center justify-between ${
                  isStreetlightOn
                    ? 'bg-amber-950/30 border-amber-500/50 text-amber-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-xs font-mono">
                  <span className="font-bold block">
                    Decizie Automată Iluminat Inteligent (Prag: adc &lt; 400):
                  </span>
                  <span className="text-[11px] text-slate-300">
                    {isStreetlightOn
                      ? 'Lumina a scăzut sub prag! Iluminatul stradal s-a APRINS automat.'
                      : 'Lumină suficientă din mediu. Lampa stradală rămâne STINSĂ.'}
                  </span>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold ${
                    isStreetlightOn
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isStreetlightOn ? 'LAMPĂ APRINSĂ' : 'LAMPĂ STINSĂ'}
                </div>
              </div>
            </div>
          ) : (
            /* Digital PIR Motion Lab */
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-semibold">
                  <Radio className="w-4 h-4" />
                  <span>Senzor Digital de Mișcare PIR pe Pinul D2</span>
                </div>
                <span className="text-xs bg-slate-800 text-cyan-300 px-2 py-0.5 rounded font-mono">
                  digitalRead(2)
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Senzorul PIR (Passive Infrared) detectează radiația infraroșie emisă de corpul uman.
                Ieșirea sa este pur binară: generează <strong>5V (HIGH / 1)</strong> când o persoană trece prin raza sa,
                și <strong>0V (LOW / 0)</strong> când zona este în repaus.
              </p>

              {/* Motion Trigger Button */}
              <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center gap-3">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${
                    motionDetected
                      ? 'bg-cyan-500 text-slate-950 ring-8 ring-cyan-500/20 shadow-lg shadow-cyan-500/50 animate-pulse'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {motionDetected ? '🚶‍♂️' : '🛑'}
                </div>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setMotionDetected(!motionDetected);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    motionDetected
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                  }`}
                >
                  {motionDetected ? 'Oprește Mișcarea (Comută LOW)' : 'Simulează Trecere Pieton (Comută HIGH)'}
                </button>
              </div>

              {/* Digital Readings */}
              <div className="grid grid-cols-2 gap-3 font-mono text-center">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">Stare Logică C++</span>
                  <span className="text-xl font-bold text-cyan-400">
                    {motionDetected ? 'HIGH (1)' : 'LOW (0)'}
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">Nivel Tensiune Ieșire</span>
                  <span className="text-xl font-bold text-white">
                    {motionDetected ? '4.95 V' : '0.00 V'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Code Snippets & Knowledge Checks */}
        <div className="lg:col-span-5 space-y-4">
          {/* C++ Code Comparison Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2">
            <span className="text-[11px] font-bold text-blue-400 block pb-1 border-b border-slate-800">
              Sintaxa C++ comparativă din manual:
            </span>
            <div className="space-y-2 text-slate-300 text-[11px]">
              <div>
                <span className="text-amber-400 font-bold">// 1. Citire Analogică (0..1023):</span>
                <pre className="text-slate-400 mt-0.5">int adc = analogRead(A0);</pre>
              </div>
              <div>
                <span className="text-cyan-400 font-bold">// 2. Citire Digitală (0 sau 1):</span>
                <pre className="text-slate-400 mt-0.5">int miscare = digitalRead(2);</pre>
              </div>
            </div>
          </div>

          {/* Interactive Check Questions */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-400">
              <HelpCircle className="w-4 h-4" />
              <span>Verificare Înțelegere Senzori (Manual pag. 93)</span>
            </div>

            {/* Question 1 */}
            <div className="space-y-2 text-xs">
              <p className="text-slate-300 font-medium">
                1. Ce valori produce convertorul ADC pe 10 biți la citirea unei tensiuni analogice între 0V și 5V?
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'adc_1024', text: 'Valori întregi între 0 (pentru 0V) și 1023 (pentru 5V), reprezentând 1024 trepte' },
                  { id: 'adc_100', text: 'Doar două valori: 0 sau 100' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      sounds.playClick();
                      setQ1Answer(opt.id);
                    }}
                    className={`text-left p-2.5 rounded-lg border transition-all text-xs ${
                      q1Answer === opt.id
                        ? opt.id === 'adc_1024'
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
                2. Prin ce se distinge un senzor digital (ex: buton sau PIR) de unul analogic?
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'digital_two_states', text: 'Are doar 2 stări discrete posibile: LOW (0V) sau HIGH (5V)' },
                  { id: 'digital_speed', text: 'Funcționează doar noaptea fără curent electric' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      sounds.playClick();
                      setQ2Answer(opt.id);
                    }}
                    className={`text-left p-2.5 rounded-lg border transition-all text-xs ${
                      q2Answer === opt.id
                        ? opt.id === 'digital_two_states'
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
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              {isLevelCompleted
                ? 'Nivelul 2 Finalizat cu Succes!'
                : 'Cerințe: Răspunde corect la cele 2 întrebări despre conversia ADC și senzorii digitali.'}
            </div>
            <div className="text-xs text-slate-400">
              Recompensă: +150 puncte XP și deblocarea Laboratorului Ultrasonic (Nivelul 3).
            </div>
          </div>
        </div>

        <button
          onClick={handleFinish}
          disabled={!isLevelCompleted}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            isLevelCompleted
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/20 cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Continuă spre Nivelul 3</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
