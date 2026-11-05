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
import { useLanguage } from '../../../context/LanguageContext';
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
  const { lang } = useLanguage();
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
      setDiagnosticLogs(
        lang === 'ro'
          ? [
              '[EROARE PIN PLUTITOR]: Pinul D2 este neconectat la referință!',
              'Oscilații aleatorii citite: 0, 1, 1, 0, 0, 1 din cauza zgomotului electromagnetic din aer.',
              'Robotul execută comenzi false!'
            ]
          : [
              '[FLOATING PIN ERROR]: Pin D2 is disconnected from reference voltage!',
              'Random oscillations read: 0, 1, 1, 0, 0, 1 due to electromagnetic air noise.',
              'Robot executes false ghost commands!'
            ]
      );
    } else {
      setDiagnosticLogs(
        lang === 'ro'
          ? [
              '[REPARAT]: S-a activat rezistorul intern de pull-up prin pinMode(2, INPUT_PULLUP)!',
              'Stare stabilă: 1 în repaus, 0 exact la apăsarea butonului. Semnal curat!'
            ]
          : [
              '[REPAIRED]: Activated internal pull-up resistor via pinMode(2, INPUT_PULLUP)!',
              'Stable state: 1 at rest, 0 on button press. Clean signal!'
            ]
      );
      setSolvedCases((prev) => ({ ...prev, 1: true }));
    }
  };

  const handleTestBug2 = () => {
    sounds.playClick();
    if (!resistorFixed) {
      setDiagnosticLogs(
        lang === 'ro'
          ? [
              '[SUPRACURENT PERICULOS]: LED-ul a fost conectat direct între D13 și GND fără rezistor!',
              'Curent absorbit: 95 mA (Limita maximă admisă a pinului ATmega328P este 40 mA)!',
              'RISC IMINENT DE ARDERE A MICROCONTROLLERULUI!'
            ]
          : [
              '[DANGEROUS OVERCURRENT]: LED connected directly between D13 and GND without resistor!',
              'Current draw: 95 mA (Absolute maximum rating of ATmega328P pin is 40 mA)!',
              'IMMINENT RISK OF BURNING OUT THE MICROCONTROLLER!'
            ]
      );
    } else {
      setDiagnosticLogs(
        lang === 'ro'
          ? [
              '[REPARAT]: S-a inserat un rezistor de limitare de 220 Ohmi în serie!',
              'Curent stabilizat la 13.6 mA conform Legii lui Ohm: (5V - 2V) / 220Ω. Circuit protejat!'
            ]
          : [
              '[REPAIRED]: Inserted 220 Ohm current-limiting resistor in series!',
              'Current stabilized at 13.6 mA via Ohm\'s Law: (5V - 2V) / 220Ω. Circuit protected!'
            ]
      );
      setSolvedCases((prev) => ({ ...prev, 2: true }));
    }
  };

  const handleTestBug3 = () => {
    sounds.playClick();
    if (!powerFixed) {
      setDiagnosticLogs(
        lang === 'ro'
          ? [
              '[BROWNOUT RESET LOOP]: Cele două motoare DC au fost alimentate din pinul 5V al plăcii!',
              'Cădere instantanee de tensiune la 3.1V la pornirea motoarelor.',
              'Microcontrollerul se resetează continuu la fiecare secundă!'
            ]
          : [
              '[BROWNOUT RESET LOOP]: Both DC motors powered from the board\'s 5V pin!',
              'Instant voltage drop down to 3.1V upon motor startup.',
              'Microcontroller resets continually every second!'
            ]
      );
    } else {
      setDiagnosticLogs(
        lang === 'ro'
          ? [
              '[REPARAT]: Motoarele au fost conectate la un pachet extern de baterii (7.4V) cu GND comun!',
              'Tensiunea pe microcontroller rămâne perfect stabilă la 5.00V. Motoarele funcționează la putere maximă!'
            ]
          : [
              '[REPAIRED]: Motors connected to external battery pack (7.4V) with common GND!',
              'Microcontroller supply voltage stays rock solid at 5.00V. Motors run at full power!'
            ]
      );
      setSolvedCases((prev) => ({ ...prev, 3: true }));
    }
  };

  const handleTestBug4 = () => {
    sounds.playClick();
    if (!pinFixed) {
      setDiagnosticLogs(
        lang === 'ro'
          ? [
              '[TIMEOUT ULTRASONIC]: Pinii Trig și Echo au fost conectați invers în breadboard!',
              'pulseIn(echoPin, HIGH) așteaptă la infinit (returnează 0 cm).',
              'Robotul nu vede obstacolele și se izbește de zid!'
            ]
          : [
              '[ULTRASONIC TIMEOUT]: Trig and Echo pins swapped in the breadboard!',
              'pulseIn(echoPin, HIGH) waits indefinitely (returns 0 cm).',
              'Robot cannot see obstacles and crashes into walls!'
            ]
      );
    } else {
      setDiagnosticLogs(
        lang === 'ro'
          ? [
              '[REPARAT]: Cablajul a fost corectat: Trig pe D7 (ieșire), Echo pe D8 (intrare)!',
              'Pulsul este recepționat corect. Distanță măsurată cu succes: 34 cm.'
            ]
          : [
              '[REPAIRED]: Wiring corrected: Trig on D7 (output), Echo on D8 (input)!',
              'Pulse is received correctly. Successfully measured distance: 34 cm.'
            ]
      );
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
                {lang === 'ro'
                  ? 'Nivelul 6 • Unitatea 4: Robotică (Manual pag. 97–98)'
                  : 'Level 6 • Unit 4: Robotics (Textbook pp. 97–98)'}
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {lang === 'ro'
                  ? 'Clinica de Depanare Hardware & Circuite Robotice'
                  : 'Hardware & Robotic Circuits Debugging Clinic'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-900/40 border border-rose-700/50 rounded-lg text-rose-300 text-sm font-mono">
            <span>
              {lang === 'ro'
                ? `${totalSolved} / 4 Defecțiuni Remediate`
                : `${totalSolved} / 4 Faults Fixed`}
            </span>
          </div>
        </div>
        <p className="mt-3 text-slate-300 text-sm leading-relaxed">
          {lang === 'ro' ? (
            <>
              În robotică, 80% din probleme nu provin din cod, ci din circuite: <strong>pini plutitori</strong>,
              <strong>supracurent fără rezistor pe LED</strong>, <strong>resetări din cauza alimentării slabe</strong> sau <strong>pini inversați</strong>.
              Investighează fiecare caz clinic și aplică reparația corectă!
            </>
          ) : (
            <>
              In robotics, 80% of issues stem not from software bugs, but from hardware circuits: <strong>floating pins</strong>,
              <strong>LED overcurrent without limiting resistors</strong>, <strong>brownout resets due to under-powered rails</strong>, or <strong>swapped signal pins</strong>.
              Investigate each clinical scenario and apply the engineering fix!
            </>
          )}
        </p>
      </div>

      {/* Case Navigator */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            id: 1,
            title: lang === 'ro' ? 'Cazul 1: Pin Plutitor' : 'Case 1: Floating Pin',
            solved: solvedCases[1]
          },
          {
            id: 2,
            title: lang === 'ro' ? 'Cazul 2: Supracurent LED' : 'Case 2: LED Overcurrent',
            solved: solvedCases[2]
          },
          {
            id: 3,
            title: lang === 'ro' ? 'Cazul 3: Reset Motoare' : 'Case 3: Motor Brownout',
            solved: solvedCases[3]
          },
          {
            id: 4,
            title: lang === 'ro' ? 'Cazul 4: Inversare Pini' : 'Case 4: Swapped Pins',
            solved: solvedCases[4]
          }
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
              {c.solved
                ? lang === 'ro' ? 'Circuit Securizat' : 'Circuit Secured'
                : lang === 'ro' ? 'Defecțiune Activă' : 'Active Fault'}
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
                    {lang === 'ro'
                      ? 'Cazul 1: Pin Plutitor (Floating Input Pin)'
                      : 'Case 1: Floating Input Pin'}
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
                    {pullupFixed
                      ? lang === 'ro' ? 'Comută la Circuit Greșit' : 'Switch to Faulty Circuit'
                      : lang === 'ro' ? 'Activează INPUT_PULLUP' : 'Enable INPUT_PULLUP'}
                  </button>
                </div>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs leading-relaxed">
                  {pullupFixed ? (
                    <div className="text-emerald-300 space-y-1">
                      <div className="text-slate-400">
                        {lang === 'ro'
                          ? '// REPARAT: Rezistor intern de pull-up (20kΩ) activat:'
                          : '// REPAIRED: Internal 20kΩ pull-up resistor enabled:'}
                      </div>
                      <div className="text-emerald-400 font-bold">pinMode(2, INPUT_PULLUP);</div>
                      <div className="text-slate-400">
                        {lang === 'ro'
                          ? '// Butonul leagă pinul la GND la apăsare:'
                          : '// Button ties pin to GND when pressed:'}
                      </div>
                      <div>if (digitalRead(2) == LOW) &#123; /* pressed */ &#125;</div>
                    </div>
                  ) : (
                    <div className="text-rose-300 space-y-1">
                      <div className="text-slate-500">
                        {lang === 'ro'
                          ? '// DEFECT: Pin lăsat în aer fără rezistor de referință:'
                          : '// FAULT: Pin left floating without a reference resistor:'}
                      </div>
                      <div className="text-rose-400 font-bold">pinMode(2, INPUT);</div>
                      <div className="text-slate-500">
                        {lang === 'ro'
                          ? '// Pinul acționează ca o antenă și citește zgomot aleatoriu!'
                          : '// Pin behaves as an antenna reading electromagnetic air noise!'}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleTestBug1}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-mono font-bold transition-colors"
                >
                  <Play className="w-4 h-4 fill-white" />
                  {lang === 'ro' ? 'Testează Semnalul Pinului D2' : 'Test Pin D2 Signal'}
                </button>
              </>
            )}

            {/* Case 2 */}
            {selectedCase === 2 && (
              <>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {lang === 'ro'
                      ? 'Cazul 2: Conectare LED fără Rezistor de Limitare'
                      : 'Case 2: Direct LED Hookup without Current Limiter'}
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
                    {resistorFixed
                      ? lang === 'ro' ? 'Comută la Circuit Greșit' : 'Switch to Faulty Circuit'
                      : lang === 'ro' ? 'Inserează Rezistor 220Ω' : 'Insert 220Ω Resistor'}
                  </button>
                </div>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs leading-relaxed">
                  {resistorFixed ? (
                    <div className="text-emerald-300 space-y-1">
                      <div className="text-slate-400">
                        {lang === 'ro' ? '// REPARAT: Legea lui Ohm aplicată corect:' : '// REPAIRED: Ohm\'s law applied correctly:'}
                      </div>
                      <div className="text-emerald-400 font-bold">
                        R = (V_supply - V_led) / I = (5V - 2V) / 0.015A ≈ 200Ω &rarr; 220Ω
                      </div>
                      <div className="text-slate-400">
                        {lang === 'ro'
                          ? 'Curentul este limitat la 14 mA. Pinul este în siguranță!'
                          : 'Current limited to 14 mA. Pin is fully protected!'}
                      </div>
                    </div>
                  ) : (
                    <div className="text-rose-300 space-y-1">
                      <div className="text-slate-500">
                        {lang === 'ro' ? '// DEFECT: LED legat direct la 5V:' : '// FAULT: LED hooked directly to 5V:'}
                      </div>
                      <div className="text-rose-400 font-bold">
                        {lang === 'ro'
                          ? 'Rezistență aproape 0 → Curent absorbit ~95 mA!'
                          : 'Near 0 resistance → Current draw ~95 mA!'}
                      </div>
                      <div className="text-slate-500">
                        {lang === 'ro'
                          ? 'Depășește limita absolută de 40mA a cipului ATmega328P.'
                          : 'Exceeds the absolute 40mA limit of ATmega328P chip.'}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleTestBug2}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-mono font-bold transition-colors"
                >
                  <Play className="w-4 h-4 fill-white" />
                  {lang === 'ro' ? 'Măsoară Curentul cu Multimetrul Virtual' : 'Measure Current with Virtual Multimeter'}
                </button>
              </>
            )}

            {/* Case 3 */}
            {selectedCase === 3 && (
              <>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {lang === 'ro'
                      ? 'Cazul 3: Alimentarea Motoarelor din Pinul de 5V al Plăcii'
                      : 'Case 3: Powering Motors from the Board\'s 5V Pin'}
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
                    {powerFixed
                      ? lang === 'ro' ? 'Comută la Circuit Greșit' : 'Switch to Faulty Circuit'
                      : lang === 'ro' ? 'Adaugă Baterie Externă + GND Comun' : 'Add External Battery + Shared GND'}
                  </button>
                </div>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs leading-relaxed">
                  {powerFixed ? (
                    <div className="text-emerald-300 space-y-1">
                      <div className="text-slate-400">
                        {lang === 'ro' ? '// REPARAT: Alimentare separată pentru motoare:' : '// REPAIRED: Separate motor power rail:'}
                      </div>
                      <div className="text-emerald-400 font-bold">
                        {lang === 'ro' ? 'Baterie externă 7.4V conectată la VMS (punte H)' : 'External 7.4V battery wired to VMS (H-Bridge)'}
                      </div>
                      <div className="text-slate-400">
                        {lang === 'ro'
                          ? 'Masa GND a bateriei este unită cu GND-ul plăcii Arduino (Referință comună).'
                          : 'Battery GND tied to Arduino board GND (Common Ground Reference).'}
                      </div>
                    </div>
                  ) : (
                    <div className="text-rose-300 space-y-1">
                      <div className="text-slate-500">
                        {lang === 'ro' ? '// DEFECT: Motoarele consumă din pinul 5V al plăcii:' : '// FAULT: Motors draw current from 5V board rail:'}
                      </div>
                      <div className="text-rose-400 font-bold">
                        {lang === 'ro' ? 'Cădere bruscă de tensiune sub 4.5V → Brownout Reset!' : 'Sudden voltage dip below 4.5V → Brownout Reset!'}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleTestBug3}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-mono font-bold transition-colors"
                >
                  <Play className="w-4 h-4 fill-white" />
                  {lang === 'ro' ? 'Testează Stabilitatea Tensiunii la Pornire' : 'Test Voltage Rail Stability at Startup'}
                </button>
              </>
            )}

            {/* Case 4 */}
            {selectedCase === 4 && (
              <>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {lang === 'ro'
                      ? 'Cazul 4: Inversare Pini Trigger și Echo'
                      : 'Case 4: Swapped Trigger and Echo Signal Pins'}
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
                    {pinFixed
                      ? lang === 'ro' ? 'Comută la Circuit Greșit' : 'Switch to Faulty Circuit'
                      : lang === 'ro' ? 'Inversează Conexiunile Trig / Echo' : 'Swap Trig / Echo Connections'}
                  </button>
                </div>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs leading-relaxed">
                  {pinFixed ? (
                    <div className="text-emerald-300 space-y-1">
                      <div className="text-slate-400">
                        {lang === 'ro' ? '// REPARAT: Declarații conforme cu cablajul fizic:' : '// REPAIRED: Code aligns with physical pinout:'}
                      </div>
                      <div className="text-emerald-400 font-bold">#define TRIG_PIN 7  // OUTPUT</div>
                      <div className="text-emerald-400 font-bold">#define ECHO_PIN 8  // INPUT</div>
                    </div>
                  ) : (
                    <div className="text-rose-300 space-y-1">
                      <div className="text-slate-500">
                        {lang === 'ro' ? '// DEFECT: Firele au fost inversate:' : '// FAULT: Wires were swapped in breadboard:'}
                      </div>
                      <div className="text-rose-400 font-bold">
                        {lang === 'ro'
                          ? 'Pulsul de pornire a fost trimis pe pinul receptor!'
                          : 'Trigger pulse sent to receiver pin!'}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleTestBug4}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-mono font-bold transition-colors"
                >
                  <Play className="w-4 h-4 fill-white" />
                  {lang === 'ro' ? 'Testează Răspunsul Ecou Ultrasonic' : 'Test Ultrasonic Echo Response'}
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
              <span>
                {lang === 'ro' ? 'Diagnosticare Banc de Probe Robotic' : 'Robotic Testbed Diagnostics'}
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs space-y-2 min-h-[140px]">
              {diagnosticLogs.length === 0 ? (
                <div className="text-slate-500 italic">
                  {lang === 'ro'
                    ? 'Selectează un caz, aplică reparația hardware și apasă butonul de testare.'
                    : 'Select a case, apply the hardware fix, and press the test button.'}
                </div>
              ) : (
                diagnosticLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={
                      log.startsWith('[REPARAT]') || log.startsWith('[REPAIRED]')
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
              <div className="font-semibold text-slate-300">
                {lang === 'ro' ? 'Regula de aur a electronicii practice:' : 'Golden rule of practical electronics:'}
              </div>
              <p>
                {lang === 'ro' ? (
                  <>
                    Toate dispozitivele conectate la un microcontroller (senzori, drivere, baterii) trebuie să aibă <strong>GND-ul legat la aceeași masă comună</strong> pentru a împărți aceeași referință de 0V!
                  </>
                ) : (
                  <>
                    All peripheral devices connected to a microcontroller (sensors, drivers, battery packs) must have their <strong>GND linked to a shared common ground</strong> to establish a unified 0V voltage reference!
                  </>
                )}
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
                ? lang === 'ro'
                  ? 'Toate Defecțiunile Hardware au fost Remediate!'
                  : 'All Hardware Faults Successfully Resolved!'
                : lang === 'ro'
                ? `Cerințe: Remediază toate cele 4 cazuri clinice (${totalSolved}/4 rezolvate).`
                : `Requirements: Fix all 4 clinical hardware faults (${totalSolved}/4 resolved).`}
            </div>
            <div className="text-xs text-slate-400">
              {lang === 'ro'
                ? 'Recompensă: +150 puncte XP și deblocarea Examenului Sumativ de Robotică (Nivelul 7).'
                : 'Reward: +150 XP points and unlocking the Robotics Summative Exam (Level 7).'}
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
          <span>{lang === 'ro' ? 'Continuă spre Examenul Final (Nivelul 7)' : 'Continue to Final Exam (Level 7)'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
