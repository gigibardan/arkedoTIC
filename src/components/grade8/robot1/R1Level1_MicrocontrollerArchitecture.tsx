import React, { useState } from 'react';
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  HelpCircle,
  Zap,
  Layers,
  Check,
  Power,
  Sliders,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface R1Level1Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface PinInfo {
  id: string;
  name: string;
  type: 'digital' | 'pwm' | 'analog' | 'power' | 'comm';
  voltage: string;
  description: string;
  codeSnippet: string;
}

const BOARD_PINS: PinInfo[] = [
  {
    id: 'd13',
    name: 'Pin D13 (LED Integrat)',
    type: 'digital',
    voltage: '0V / 5V',
    description: 'Pin digital conectat direct la LED-ul galben marcat "L" de pe placă. Folosit pentru testul clasic Blink.',
    codeSnippet: 'pinMode(13, OUTPUT);\ndigitalWrite(13, HIGH);'
  },
  {
    id: 'd9',
    name: 'Pin ~D9 (PWM)',
    type: 'pwm',
    voltage: '0V..5V (PWM)',
    description: 'Pin capabil de modulație în lățime a impulsurilor (Pulse Width Modulation, 490Hz). Permite reglarea intensității luminoase sau a turației motoarelor.',
    codeSnippet: 'analogWrite(9, 128); // 50% ciclu activ'
  },
  {
    id: 'a0',
    name: 'Pin A0 (Analog IN)',
    type: 'analog',
    voltage: '0V..5V -> 0..1023',
    description: 'Pin de intrare analogică conectat la convertorul ADC pe 10 biți. Măsoară tensiuni continue de la senzori (ex. fotorezistență LDR, potențiometru).',
    codeSnippet: 'int lumina = analogRead(A0);'
  },
  {
    id: 'pin5v',
    name: 'Pin 5V (Alimentare)',
    type: 'power',
    voltage: '5.0V stabilizat',
    description: 'Ieșire de tensiune continuă stabilizată de 5V din regulatorul plăcii. Alimentează senzorii și cipurile logice (curent max ~400mA).',
    codeSnippet: '// Conectat la pinul VCC al senzorilor'
  },
  {
    id: 'gnd',
    name: 'Pin GND (Masă comună)',
    type: 'power',
    voltage: '0V (Referință)',
    description: 'Potențialul de referință 0V (Ground). Toate circuitele, senzorii și actuatorii trebuie să aibă masa comună (GND) legată la placă!',
    codeSnippet: '// Toate circuitele se închid la GND'
  },
  {
    id: 'tx_rx',
    name: 'Pini D0(RX) / D1(TX)',
    type: 'comm',
    voltage: 'Serial UART',
    description: 'Linii de comunicație serială prin USB cu calculatorul. Evită conectarea altor senzori pe D0 și D1 pentru a nu bloca încărcarea programelor!',
    codeSnippet: 'Serial.begin(9600);\nSerial.println("Hello Robot!");'
  }
];

export const R1Level1_MicrocontrollerArchitecture: React.FC<R1Level1Props> = ({
  onCompletePage,
  onComplete
}) => {
  const [selectedPinId, setSelectedPinId] = useState<string>('d13');
  const [led13State, setLed13State] = useState<boolean>(false);
  const [exploredPins, setExploredPins] = useState<Set<string>>(new Set(['d13']));
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    'Placa Arduino Uno ATmega328P conectată la USB COM3 (16 MHz).',
    'Selectează pinii pentru a inspecta caracteristicile electrice și rolul fiecărui bloc.'
  ]);

  // Quiz states
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const selectedPin = BOARD_PINS.find((p) => p.id === selectedPinId) || BOARD_PINS[0];

  const handleSelectPin = (pin: PinInfo) => {
    sounds.playClick();
    setSelectedPinId(pin.id);
    setExploredPins((prev) => new Set([...prev, pin.id]));
    setConsoleLogs((prev) => [
      ...prev.slice(-4),
      `Inspectare [${pin.name}]: Tip ${pin.type.toUpperCase()} | Tensiune: ${pin.voltage}`
    ]);
  };

  const handleToggleLed13 = () => {
    sounds.playClick();
    const nextState = !led13State;
    setLed13State(nextState);
    if (nextState) {
      sounds.playCorrect();
    }
    setConsoleLogs((prev) => [
      ...prev.slice(-4),
      `digitalWrite(13, ${nextState ? 'HIGH' : 'LOW'}) -> Tensiune la pin: ${
        nextState ? '4.98V' : '0.01V'
      } | LED "L": ${nextState ? 'APRINS' : 'STINS'}`
    ]);
  };

  const isLevelCompleted =
    exploredPins.size >= 4 &&
    q1Answer === 'atmega' &&
    q2Answer === 'pwm_tilde';

  const handleFinish = () => {
    if (!isLevelCompleted) return;
    sounds.playLevelComplete();
    if (onCompletePage) onCompletePage(150);
    if (onComplete) onComplete();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-950/70 via-slate-900 to-blue-950/70 border border-cyan-800/40 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/20 border border-cyan-500/40 rounded-xl text-cyan-300">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-semibold">
                Nivelul 1 • Unitatea 4: Robotică (Manual pag. 89–92)
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Arhitectura Plăcii de Dezvoltare &amp; Microcontrollerul
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-900/40 border border-cyan-700/50 rounded-lg text-cyan-300 text-sm font-mono">
            <span>{exploredPins.size} / 6 Pini Explorați</span>
          </div>
        </div>
        <p className="mt-3 text-slate-300 text-sm leading-relaxed">
          Microcontrollerul (cipul <strong>ATmega328P</strong>) reprezintă „creierul” oricărui robot autonom.
          Pentru a controla senzori și motoare, trebuie să stăpânești organizarea pinilor săi: <strong>pini digitali</strong> (0/1),
          <strong>pini PWM</strong> (modulație variabilă ~) și <strong>pini analogici</strong> (canale ADC 0..1023).
        </p>
      </div>

      {/* Main Grid: Interactive Board & Pin Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Virtual Board Layout */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-semibold">
                <Layers className="w-4 h-4" />
                <span>Placa Virtuală Arduino Uno R3 (Simulator Interactiv)</span>
              </div>
              <span className="text-xs bg-cyan-950 border border-cyan-800 text-cyan-300 px-2.5 py-0.5 rounded-full font-mono">
                16 MHz Crystal
              </span>
            </div>

            {/* Board Graphical Simulation Box */}
            <div className="mt-4 p-5 bg-gradient-to-br from-teal-950/80 via-slate-950 to-blue-950/80 rounded-xl border-2 border-teal-600/40 relative shadow-2xl">
              {/* USB Port & Power Jack */}
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-12 bg-slate-700 border-2 border-slate-500 rounded-sm flex items-center justify-center text-[10px] font-mono text-slate-300 shadow">
                  USB-B
                </div>
                <div className="w-14 h-14 bg-slate-900 border-2 border-slate-700 rounded-sm flex items-center justify-center text-[10px] font-mono text-slate-400">
                  DC 7-12V
                </div>
              </div>

              {/* ATmega328P Chip representation */}
              <div className="my-6 mx-auto w-48 py-3 bg-slate-900 border border-slate-600 rounded-md shadow-2xl flex flex-col items-center justify-center relative">
                <div className="text-[11px] font-mono font-bold text-slate-300 tracking-wider">
                  ATmega328P-PU
                </div>
                <div className="text-[9px] font-mono text-cyan-400">
                  32KB Flash • 2KB SRAM
                </div>
                {/* Pins legs */}
                <div className="absolute -top-1.5 left-4 right-4 flex justify-between">
                  {[...Array(14)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-amber-400/80 rounded-full" />
                  ))}
                </div>
                <div className="absolute -bottom-1.5 left-4 right-4 flex justify-between">
                  {[...Array(14)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-amber-400/80 rounded-full" />
                  ))}
                </div>
              </div>

              {/* Onboard LED L (Pin 13) */}
              <div className="flex items-center justify-center gap-3 p-3 bg-slate-900/90 rounded-lg border border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      led13State
                        ? 'bg-amber-400 shadow-[0_0_15px_#f59e0b] ring-2 ring-amber-300'
                        : 'bg-slate-800 border border-slate-600'
                    }`}
                  />
                  <span className="text-xs font-mono font-bold text-slate-200">
                    LED Integrat (Pin 13 &quot;L&quot;)
                  </span>
                </div>
                <button
                  onClick={handleToggleLed13}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                    led13State
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  {led13State ? 'Comută LOW (0V)' : 'Comută HIGH (5V)'}
                </button>
              </div>

              {/* Pin Header Buttons */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-slate-400 block font-semibold">
                  Selectează un pin pentru inspecție detaliată:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {BOARD_PINS.map((pin) => {
                    const isSelected = selectedPinId === pin.id;
                    const isExplored = exploredPins.has(pin.id);

                    return (
                      <button
                        key={pin.id}
                        onClick={() => handleSelectPin(pin)}
                        className={`p-2.5 rounded-xl border text-left font-mono text-xs transition-all relative ${
                          isSelected
                            ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
                            : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span className="text-cyan-300 text-[11px]">{pin.name.split(' ')[1]}</span>
                          {isExplored && (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate mt-0.5">
                          {pin.type.toUpperCase()}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Terminal Console */}
            <div className="mt-4 bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono text-xs space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-[11px] pb-1 border-b border-slate-800">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Serial Monitor &amp; Multimetru Virtual</span>
              </div>
              <div className="space-y-1 pt-1 min-h-[70px]">
                {consoleLogs.map((log, idx) => (
                  <div key={idx} className="text-cyan-300 text-[11px]">
                    &gt; {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Pin Detailed Card & Knowledge Checks */}
        <div className="lg:col-span-5 space-y-4">
          {/* Selected Pin Details */}
          <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Fișă Tehnică Pin
              </span>
              <span className="text-xs font-mono bg-cyan-950 text-cyan-300 px-2.5 py-0.5 rounded border border-cyan-800">
                {selectedPin.voltage}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white font-mono">
                {selectedPin.name}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {selectedPin.description}
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300">
              <span className="text-slate-500 block text-[10px] uppercase mb-1">
                Sintaxă C++ (Arduino IDE):
              </span>
              <pre className="text-[11px]">{selectedPin.codeSnippet}</pre>
            </div>
          </div>

          {/* Interactive Check Questions */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-400">
              <HelpCircle className="w-4 h-4" />
              <span>Verificare Înțelegere Hardware (Manual pag. 90)</span>
            </div>

            {/* Question 1 */}
            <div className="space-y-2 text-xs">
              <p className="text-slate-300 font-medium">
                1. Care este cipul microcontroller ce îndeplinește rolul de „creier” pe placa Arduino Uno?
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'atmega', text: 'ATmega328P (cu memorie Flash de 32 KB și frecvență de 16 MHz)' },
                  { id: 'intel', text: 'Intel Core i9 cu răcire pe lichid' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      sounds.playClick();
                      setQ1Answer(opt.id);
                    }}
                    className={`text-left p-2.5 rounded-lg border transition-all text-xs ${
                      q1Answer === opt.id
                        ? opt.id === 'atmega'
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
                2. Cum recunoaștem pe placa Arduino pinii capabili de modulație PWM (tensiune variabilă pentru motoare)?
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'pwm_tilde', text: 'Sunt marcați cu simbolul tildă (~) lângă număr (de ex: ~3, ~5, ~6, ~9, ~10, ~11)' },
                  { id: 'pwm_err', text: 'Sunt vopsiți exclusiv cu vopsea aurie' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      sounds.playClick();
                      setQ2Answer(opt.id);
                    }}
                    className={`text-left p-2.5 rounded-lg border transition-all text-xs ${
                      q2Answer === opt.id
                        ? opt.id === 'pwm_tilde'
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
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              {isLevelCompleted
                ? 'Nivelul 1 Finalizat cu Succes!'
                : `Cerințe: Explorează cel puțin 4 pini (${exploredPins.size}/4) și răspunde corect la cele 2 întrebări.`}
            </div>
            <div className="text-xs text-slate-400">
              Recompensă: +150 puncte XP și deblocarea Laboratorului de Senzori (Nivelul 2).
            </div>
          </div>
        </div>

        <button
          onClick={handleFinish}
          disabled={!isLevelCompleted}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            isLevelCompleted
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/20 cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Continuă spre Nivelul 2</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
