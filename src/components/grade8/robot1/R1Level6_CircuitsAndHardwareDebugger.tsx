import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  HelpCircle,
  ShieldAlert,
  Zap,
  Check,
  Cpu,
  Flame,
  Activity
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface R1Level6Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const R1Level6_CircuitsAndHardwareDebugger: React.FC<R1Level6Props> = ({
  onCompletePage,
  onComplete
}) => {
  const [selectedCase, setSelectedCase] = useState<number>(1);
  const [solvedCases, setSolvedCases] = useState<{ [key: number]: boolean }>({
    1: false,
    2: false,
    3: false,
    4: false
  });

  // Toggles for fixes
  const [pullupFixed, setPullupFixed] = useState<boolean>(false);
  const [resistorFixed, setResistorFixed] = useState<boolean>(false);
  const [powerFixed, setPowerFixed] = useState<boolean>(false);
  const [pinFixed, setPinFixed] = useState<boolean>(false);

  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);

  const handleTestBug1 = () => {
    sounds.playClick();
    if (!pullupFixed) {
      setDiagnosticLogs([
        '[EROARE PIN PLUTITOR]: Pinul D2 este neconectat la referință!',
        'Oscilații aleatorii citite: 0, 1, 1, 0, 0, 1 din cauza zgomotului electromagnetic din aer.',
        'Robotul execută comenzi false!'
      ]);
    } else {
      setDiagnosticLogs([
        '[REPARAT]: S-a activat rezistorul intern de pull-up prin pinMode(2, INPUT_PULLUP)!',
        'Stare stabilă: 1 în repaus, 0 exact la apăsarea butonului. Semnal curat!'
      ]);
      setSolvedCases((prev) => ({ ...prev, 1: true }));
    }
  };

  const handleTestBug2 = () => {
    sounds.playClick();
    if (!resistorFixed) {
      setDiagnosticLogs([
        '[SUPRACURENT PERICULOS]: LED-ul a fost conectat direct între D13 și GND fără rezistor!',
        'Curent absorbit: 95 mA (Limita maximă admisă a pinului ATmega328P este 40 mA)!',
        'RISC IMINENT DE ARDERE A MICROCONTROLLERULUI!'
      ]);
    } else {
      setDiagnosticLogs([
        '[REPARAT]: S-a inserat un rezistor de limitare de 220 Ohmi în serie!',
        'Curent stabilizat la 13.6 mA conform Legii lui Ohm: (5V - 2V) / 220Ω. Circuit protejat!'
      ]);
      setSolvedCases((prev) => ({ ...prev, 2: true }));
    }
  };

  const handleTestBug3 = () => {
    sounds.playClick();
    if (!powerFixed) {
      setDiagnosticLogs([
        '[BROWNOUT RESET LOOP]: Cele două motoare DC au fost alimentate din pinul 5V al plăcii!',
        'Cădere instantanee de tensiune la 3.1V la pornirea motoarelor.',
        'Microcontrollerul se resetează continuu la fiecare secundă!'
      ]);
    } else {
      setDiagnosticLogs([
        '[REPARAT]: Motoarele au fost conectate la un pachet extern de baterii (7.4V) cu GND comun!',
        'Tensiunea pe microcontroller rămâne perfect stabilă la 5.00V. Motoarele funcționează la putere maximă!'
      ]);
      setSolvedCases((prev) => ({ ...prev, 3: true }));
    }
  };

  const handleTestBug4 = () => {
    sounds.playClick();
    if (!pinFixed) {
      setDiagnosticLogs([
        '[TIMEOUT ULTRASONIC]: Pinii Trig și Echo au fost conectați invers în breadboard!',
        'pulseIn(echoPin, HIGH) așteaptă la infinit (returnează 0 cm).',
        'Robotul nu vede obstacolele și se izbește de zid!'
      ]);
    } else {
      setDiagnosticLogs([
        '[REPARAT]: Cablajul a fost corectat: Trig pe D7 (ieșire), Echo pe D8 (intrare)!',
        'Pulsul este recepționat corect. Distanță măsurată cu succes: 34 cm.'
      ]);
      setSolvedCases((prev) => ({ ...prev, 4: true }));
    }
  };

  const totalSolved = Object.values(solvedCases).filter(Boolean).length;
  const isCompleted = totalSolved === 4;

  const handleFinish = () => {
    if (!isCompleted) return;
    sounds.playLevelComplete();
    if (onCompletePage) onCompletePage(150);
    if (onComplete) onComplete();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-950/70 via-slate-900 to-amber-950/70 border border-rose-800/40 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-rose-400 font-semibold">
                Nivelul 6 • Unitatea 4: Robotică (Manual pag. 97–98)
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Clinica de Depanare Hardware &amp; Circuite Robotice
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-900/40 border border-rose-700/50 rounded-lg text-rose-300 text-sm font-mono">
            <span>{totalSolved} / 4 Defecțiuni Remediate</span>
          </div>
        </div>
        <p className="mt-3 text-slate-300 text-sm leading-relaxed">
          În robotică, 80% din probleme nu provin din cod, ci din circuite: <strong>pini plutitori</strong>,
          <strong>supracurent fără rezistor pe LED</strong>, <strong>resetări din cauza alimentării slabe</strong> sau <strong>pini inversați</strong>.
          Investighează fiecare caz clinic și aplică reparația corectă!
        </p>
      </div>

      {/* Case Navigator */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { id: 1, title: 'Cazul 1: Pin Plutitor', solved: solvedCases[1] },
          { id: 2, title: 'Cazul 2: Supracurent LED', solved: solvedCases[2] },
          { id: 3, title: 'Cazul 3: Reset Motoare', solved: solvedCases[3] },
          { id: 4, title: 'Cazul 4: Inversare Pini', solved: solvedCases[4] }
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setSelectedCase(c.id);
              sounds.playClick();
            }}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedCase === c.id
                ? 'bg-rose-900/40 border-rose-400 text-white shadow-lg'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono font-semibold">
              <span>{c.title}</span>
              {c.solved ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {c.solved ? 'Circuit Securizat' : 'Defecțiune Activă'}
            </div>
          </button>
        ))}
      </div>

      {/* Main Grid: Circuit Diagnostic & Oscilloscope */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Circuit Schematic & Repair Action */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            {/* Case 1 */}
            {selectedCase === 1 && (
              <>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    Cazul 1: Pin Plutitor (Floating Input Pin)
                  </span>
                  <button
                    onClick={() => {
                      setPullupFixed(!pullupFixed);
                      sounds.playClick();
                    }}
                    className={`px-3 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                      pullupFixed ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                    }`}
                  >
                    {pullupFixed ? 'Comută la Circuit Greșit' : 'Activează INPUT_PULLUP'}
                  </button>
                </div>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs leading-relaxed">
                  {pullupFixed ? (
                    <div className="text-emerald-300 space-y-1">
                      <div className="text-slate-400">// REPARAT: Rezistor intern de pull-up (20kΩ) activat:</div>
                      <div className="text-emerald-400 font-bold">pinMode(2, INPUT_PULLUP);</div>
                      <div className="text-slate-400">// Butonul leagă pinul la GND la apăsare:</div>
                      <div>if (digitalRead(2) == LOW) &#123; /* apasat */ &#125;</div>
                    </div>
                  ) : (
                    <div className="text-rose-300 space-y-1">
                      <div className="text-slate-500">// DEFECT: Pin lăsat în aer fără rezistor de referință:</div>
                      <div className="text-rose-400 font-bold">pinMode(2, INPUT);</div>
                      <div className="text-slate-500">// Pinul acționează ca o antenă și citește zgomot aleatoriu!</div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleTestBug1}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-mono font-bold transition-colors"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Testează Semnalul Pinului D2
                </button>
              </>
            )}

            {/* Case 2 */}
            {selectedCase === 2 && (
              <>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    Cazul 2: Conectare LED fără Rezistor de Limitare
                  </span>
                  <button
                    onClick={() => {
                      setResistorFixed(!resistorFixed);
                      sounds.playClick();
                    }}
                    className={`px-3 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                      resistorFixed ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                    }`}
                  >
                    {resistorFixed ? 'Comută la Circuit Greșit' : 'Inserează Rezistor 220Ω'}
                  </button>
                </div>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs leading-relaxed">
                  {resistorFixed ? (
                    <div className="text-emerald-300 space-y-1">
                      <div className="text-slate-400">// REPARAT: Legea lui Ohm aplicată corect:</div>
                      <div className="text-emerald-400 font-bold">
                        R = (V_sursa - V_led) / I = (5V - 2V) / 0.015A ≈ 200Ω &rarr; Valoare standard: 220Ω
                      </div>
                      <div className="text-slate-400">Curentul este limitat la 14 mA. Pinul este în siguranță!</div>
                    </div>
                  ) : (
                    <div className="text-rose-300 space-y-1">
                      <div className="text-slate-500">// DEFECT: LED legat direct la 5V:</div>
                      <div className="text-rose-400 font-bold">
                        Rezistență aproape 0 &rarr; Curent absorbit ~95 mA!
                      </div>
                      <div className="text-slate-500">Depășește limita absolută de 40mA a cipului ATmega328P.</div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleTestBug2}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-mono font-bold transition-colors"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Măsoară Curentul cu Multimetrul Virtual
                </button>
              </>
            )}

            {/* Case 3 */}
            {selectedCase === 3 && (
              <>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    Cazul 3: Alimentarea Motoarelor din Pinul de 5V al Plăcii
                  </span>
                  <button
                    onClick={() => {
                      setPowerFixed(!powerFixed);
                      sounds.playClick();
                    }}
                    className={`px-3 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                      powerFixed ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                    }`}
                  >
                    {powerFixed ? 'Comută la Circuit Greșit' : 'Adaugă Baterie Externă + GND Comun'}
                  </button>
                </div>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs leading-relaxed">
                  {powerFixed ? (
                    <div className="text-emerald-300 space-y-1">
                      <div className="text-slate-400">// REPARAT: Alimentare separată pentru motoare:</div>
                      <div className="text-emerald-400 font-bold">
                        Baterie externă 7.4V conectată la VMS (punte H)
                      </div>
                      <div className="text-slate-400">
                        Masa GND a bateriei este unită cu GND-ul plăcii Arduino (Referință comună).
                      </div>
                    </div>
                  ) : (
                    <div className="text-rose-300 space-y-1">
                      <div className="text-slate-500">// DEFECT: Motoarele consumă din pinul 5V al plăcii:</div>
                      <div className="text-rose-400 font-bold">
                        Cădere bruscă de tensiune sub 4.5V &rarr; Brownout Reset!
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleTestBug3}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-mono font-bold transition-colors"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Testează Stabilitatea Tensiunii la Pornire
                </button>
              </>
            )}

            {/* Case 4 */}
            {selectedCase === 4 && (
              <>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    Cazul 4: Inversare Pini Trigger și Echo
                  </span>
                  <button
                    onClick={() => {
                      setPinFixed(!pinFixed);
                      sounds.playClick();
                    }}
                    className={`px-3 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                      pinFixed ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                    }`}
                  >
                    {pinFixed ? 'Comută la Circuit Greșit' : 'Inversează Conexiunile Trig / Echo'}
                  </button>
                </div>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs leading-relaxed">
                  {pinFixed ? (
                    <div className="text-emerald-300 space-y-1">
                      <div className="text-slate-400">// REPARAT: Declarații conforme cu cablajul fizic:</div>
                      <div className="text-emerald-400 font-bold">#define TRIG_PIN 7  // OUTPUT</div>
                      <div className="text-emerald-400 font-bold">#define ECHO_PIN 8  // INPUT</div>
                    </div>
                  ) : (
                    <div className="text-rose-300 space-y-1">
                      <div className="text-slate-500">// DEFECT: Firele au fost inversate:</div>
                      <div className="text-rose-400 font-bold">
                        Pulsul de pornire a fost trimis pe pinul receptor!
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleTestBug4}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-mono font-bold transition-colors"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Testează Răspunsul Ecou Ultrasonic
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right: Diagnostic Log Screen */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-rose-400 pb-2 border-b border-slate-800">
              <Terminal className="w-4 h-4" />
              <span>Diagnosticare Banc de Probe Robotic</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs space-y-2 min-h-[140px]">
              {diagnosticLogs.length === 0 ? (
                <div className="text-slate-500 italic">
                  Selectează un caz, aplică reparația hardware și apasă butonul de testare.
                </div>
              ) : (
                diagnosticLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={
                      log.startsWith('[REPARAT]')
                        ? 'text-emerald-400 font-semibold'
                        : 'text-rose-400'
                    }
                  >
                    {log}
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="font-semibold text-slate-300">Regula de aur a electronicii practice:</div>
              <p>
                Toate dispozitivele conectate la un microcontroller (senzori, drivere, baterii) trebuie să aibă <strong>GND-ul legat la aceeași masă comună</strong> pentru a împărți aceeași referință de 0V!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isCompleted
                ? 'bg-rose-500/20 text-rose-400'
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              {isCompleted
                ? 'Toate Defecțiunile Hardware au fost Remediate!'
                : `Cerințe: Remediază toate cele 4 cazuri clinice (${totalSolved}/4 rezolvate).`}
            </div>
            <div className="text-xs text-slate-400">
              Recompensă: +150 puncte XP și deblocarea Examenului Sumativ de Robotică (Nivelul 7).
            </div>
          </div>
        </div>

        <button
          onClick={handleFinish}
          disabled={!isCompleted}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            isCompleted
              ? 'bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white shadow-lg shadow-rose-500/20 cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Continuă spre Examenul Final (Nivelul 7)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
