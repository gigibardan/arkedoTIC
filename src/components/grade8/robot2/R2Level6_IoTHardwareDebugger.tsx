import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Code2,
  Cpu,
  Zap,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Bug,
  RotateCcw,
  Sliders,
  Check
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface R2Level6Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface DebugCase {
  id: string;
  titleRo: string;
  titleEn: string;
  subsystemRo: string;
  subsystemEn: string;
  symptomRo: string;
  symptomEn: string;
  buggyCode: string;
  fixedCode: string;
  explanationRo: string;
  explanationEn: string;
  options: {
    id: string;
    labelRo: string;
    labelEn: string;
    isCorrect: boolean;
    feedbackRo: string;
    feedbackEn: string;
  }[];
}

const DEBUG_CASES: DebugCase[] = [
  {
    id: 'i2c_address',
    titleRo: 'Cazul 1: Ecranul LCD 1602 Afișează Doar Blocuri Negre',
    titleEn: 'Case 1: LCD 1602 Displays Only Solid Black Boxes',
    subsystemRo: 'Stație Meteo IoT (I2C LCD)',
    subsystemEn: 'IoT Weather Station (I2C LCD)',
    symptomRo:
      'La alimentarea plăcii, rândul superior al ecranului LCD 1602 luminează cu blocuri albe/negre pline, dar nu afișează niciun caracter sau temperatură.',
    symptomEn:
      'Upon powering the board, the top row of the LCD 1602 lights up with solid blocks, but displays no characters or temperature readings.',
    buggyCode: `// Codul cu eroare / Buggy code:
#include <LiquidCrystal_I2C.h>

// Wrong address specified:
LiquidCrystal_I2C lcd(0x3F, 16, 2);

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.print("Statie Meteo");
}`,
    fixedCode: `// Soluția corectă (I2C Scanner) / Fixed solution:
#include <LiquidCrystal_I2C.h>

// Real hardware address of PCF8574 is 0x27:
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.print("Statie Meteo");
}`,
    explanationRo:
      'Modulele I2C de pe spatele LCD 1602 au adresa hardware implicită 0x27 (sau rareori 0x3F). Dacă adresa nu corespunde cu cipul fizic PCF8574, microcontrollerul nu poate inițializa controlerul HD44780.',
    explanationEn:
      'The I2C backpack modules behind LCD 1602 have default hardware address 0x27 (or rarely 0x3F). If the address does not match the physical PCF8574 chip, the microcontroller cannot initialize the HD44780 controller.',
    options: [
      {
        id: 'opt1',
        labelRo: 'Înlocuim ecranul cu unul de 20x4 caractere',
        labelEn: 'Replace the screen with a 20x4 character model',
        isCorrect: false,
        feedbackRo: 'Dimensiunea fizică a ecranului nu rezolvă comunicarea I2C invalidă pe magistrală.',
        feedbackEn: 'Physical screen size does not fix invalid I2C communication on the bus.'
      },
      {
        id: 'opt2',
        labelRo: 'Rulăm I2C Scanner și setăm adresa corectă a cipului: 0x27',
        labelEn: 'Run I2C Scanner and set the correct chip address: 0x27',
        isCorrect: true,
        feedbackRo:
          'Corect! Adresa hardware standard a adaptorului I2C este 0x27, permițând inițializarea corectă.',
        feedbackEn:
          'Correct! The standard hardware address of the I2C adapter is 0x27, allowing proper initialization.'
      },
      {
        id: 'opt3',
        labelRo: 'Conectăm ecranul la pinii digitali D0 și D1',
        labelEn: 'Connect the screen to digital pins D0 and D1',
        isCorrect: false,
        feedbackRo:
          'Greșit! Pinii I2C pe Arduino Uno sunt exclusiv A4 (SDA) și A5 (SCL), nu D0/D1 care sunt UART.',
        feedbackEn:
          'Incorrect! I2C pins on Arduino Uno are strictly A4 (SDA) and A5 (SCL), not D0/D1 which are UART.'
      }
    ]
  },
  {
    id: 'blocking_delay',
    titleRo: 'Cazul 2: Alarma de Gaz Nu Reacționează Când Bariera Așteaptă',
    titleEn: 'Case 2: Gas Alarm Does Not React While Gate Is Delaying',
    subsystemRo: 'Smart City Master Hub (Sincronizare)',
    subsystemEn: 'Smart City Master Hub (Synchronization)',
    symptomRo:
      'Când o mașină intră în parcare, bariera rămâne ridicată 5 secunde folosind delay(5000). În acest timp, dacă are loc o scăpare de gaz, alarma nu sună deloc!',
    symptomEn:
      'When a car enters the parking, the gate stays open for 5 seconds using delay(5000). During this time, if a gas leak occurs, the alarm does not trigger at all!',
    buggyCode: `// Codul cu eroare (Blocant) / Buggy code:
void loop() {
  if (carAtBarrier) {
    barrier.write(90); // Open
    delay(5000);       // FULL CPU FREEZE FOR 5 SECONDS!
    barrier.write(0);  // Close
  }
  // Gas sensor is ignored for 5 full seconds!
  checkGasSensor();
}`,
    fixedCode: `// Soluția corectă (Non-blocant cu millis) / Fixed solution:
unsigned long gateTimer = 0;
bool gateOpen = false;

void loop() {
  // Gas sensor is checked on EVERY SINGLE loop iteration!
  checkGasSensor();

  if (carAtBarrier && !gateOpen) {
    barrier.write(90);
    gateTimer = millis();
    gateOpen = true;
  }
  if (gateOpen && millis() - gateTimer >= 5000) {
    barrier.write(0);
    gateOpen = false;
  }
}`,
    explanationRo:
      'Instrucțiunea delay() îngheață procesorul Arduino, blocând toate celelalte verificări de siguranță. Folosind cronometrarea cu millis(), sistemul rămâne reactiv în timp real la urgențe.',
    explanationEn:
      'The delay() statement freezes the Arduino CPU, halting all other safety checks. Using millis() timing keeps the system reactive in real-time to critical emergencies.',
    options: [
      {
        id: 'opt1',
        labelRo: 'Mărim durata delay la 10000 ms pentru siguranță',
        labelEn: 'Increase delay duration to 10000 ms for safety',
        isCorrect: false,
        feedbackRo: 'O întârziere mai mare ar bloca procesorul și mai mult timp!',
        feedbackEn: 'A longer delay would lock up the processor for even longer!'
      },
      {
        id: 'opt2',
        labelRo: 'Înlocuim delay() cu verificarea non-blocantă a timpului prin millis()',
        labelEn: 'Replace delay() with non-blocking elapsed time checks via millis()',
        isCorrect: true,
        feedbackRo:
          'Excelent! Aceasta este tehnica esențială de multitasking cooperativ pe microcontroller.',
        feedbackEn:
          'Excellent! This is the essential cooperative multitasking technique on microcontrollers.'
      },
      {
        id: 'opt3',
        labelRo: 'Mutăm apelul verificaSenzorGaz() în funcția setup()',
        labelEn: 'Move checkGasSensor() call into setup()',
        isCorrect: false,
        feedbackRo:
          'Funcția setup() rulează o singură dată la pornire, deci senzorul nu ar mai fi citit niciodată!',
        feedbackEn:
          'The setup() function runs only once on boot, so the sensor would never be polled again!'
      }
    ]
  },
  {
    id: 'relay_active_low',
    titleRo: 'Cazul 3: Ventilatorul de Evacuare Pornește Invers pe Releu',
    titleEn: 'Case 3: Exhaust Fan Runs in Reverse Logic on Relay Module',
    subsystemRo: 'Sistem Siguranță Gaz (Releu Electromecanic)',
    subsystemEn: 'Gas Safety System (Electromechanical Relay)',
    symptomRo:
      'Elevul dorește să pornească ventilatorul când este gaz (HIGH) și să-l oprească când e aer curat (LOW). Însă ventilatorul merge non-stop în aer curat și se OPREȘTE la gaz!',
    symptomEn:
      'The student wants to run the fan on gas leak (HIGH) and stop it during clean air (LOW). But the fan runs continuously during clean air and STOPS when gas is detected!',
    buggyCode: `// Codul cu logică inversată / Inverted logic:
const int relayPin = 7;

if (gasLevel > 450) {
  // Student assumes HIGH turns relay ON:
  digitalWrite(relayPin, HIGH); 
} else {
  // Student assumes LOW turns relay OFF:
  digitalWrite(relayPin, LOW); 
}`,
    fixedCode: `// Soluția corectă (Releu Active-LOW) / Fixed solution:
const int relayPin = 7;
#define RELAY_ON  LOW   // Optocoupler transistor conducts at 0V
#define RELAY_OFF HIGH  // Relay coil releases at 5V

if (gasLevel > 450) {
  digitalWrite(relayPin, RELAY_ON);
} else {
  digitalWrite(relayPin, RELAY_OFF);
}`,
    explanationRo:
      'Marea majoritate a modulelor de releu pentru Arduino sunt de tip Active-LOW: bobina este alimentată când pinul de comandă este tras la masă (LOW / 0V), iar la HIGH releul se dezactivează.',
    explanationEn:
      'The vast majority of hobby relay breakout modules are Active-LOW: the coil energizes when the signal pin is pulled to ground (LOW / 0V), and de-energizes at HIGH.',
    options: [
      {
        id: 'opt1',
        labelRo: 'Definim comanda conform standardului Active-LOW: LOW = PORNIT, HIGH = OPRIT',
        labelEn: 'Define commands according to Active-LOW standard: LOW = ON, HIGH = OFF',
        isCorrect: true,
        feedbackRo:
          'Foarte bine! Modulele de releu cu optocuplor funcționează uzual pe logică inversată (Active-LOW).',
        feedbackEn:
          'Very good! Optocoupled relay modules typically operate on inverted (Active-LOW) logic.'
      },
      {
        id: 'opt2',
        labelRo: 'Tăiem firul de alimentare VCC de la releu',
        labelEn: 'Cut the VCC power wire to the relay module',
        isCorrect: false,
        feedbackRo: 'Tăierea alimentării va dezactiva complet releul, împiedicând orice funcționare.',
        feedbackEn: 'Cutting power completely disables the relay from functioning at all.'
      },
      {
        id: 'opt3',
        labelRo: 'Schimbăm pinul digital 7 cu un pin analogic A0',
        labelEn: 'Change digital pin 7 to analog pin A0',
        isCorrect: false,
        feedbackRo: 'Releul necesită o comandă logică binară (HIGH/LOW), pinul digital fiind ideal.',
        feedbackEn: 'Relays require a binary switching signal (HIGH/LOW), for which digital pins are ideal.'
      }
    ]
  },
  {
    id: 'servo_brownout',
    titleRo: 'Cazul 4: Servomotorul Barierei Tremură și Arduino se Resetează',
    titleEn: 'Case 4: Barrier Servo Jitters and Arduino Resets (Brownout)',
    subsystemRo: 'Barieră Inteligentă (Alimentare Servomotor)',
    subsystemEn: 'Smart Barrier (Servo Motor Power Supply)',
    symptomRo:
      'Când servomotorul începe să ridice bariera, plăcuța Arduino Uno se stinge pentru o fracțiune de secundă, LED-urile pâlpâie, iar programul reia execuția de la început (buclă de reset).',
    symptomEn:
      'When the servo begins lifting the barrier, the Arduino Uno shuts off for a fraction of a second, LEDs blink, and code restarts from setup() (reset loop).',
    buggyCode: `// Schema cu eroare hardware / Buggy hardware wiring:
// Red Servo wire (VCC) is connected directly to Arduino 5V pin.
// Current spike during motor startup exceeds onboard voltage regulator (500mA),
// causing a severe voltage dip (Brownout Reset).`,
    fixedCode: `// Schema corectă de alimentare / Correct power schematic:
// 1. Power servo from separate external power pack (5V-6V, 2A).
// 2. Connect Black wire (GND) of battery pack to Arduino GND (Common Ground).
// 3. Connect only Yellow/White wire (PWM signal) to Arduino pin D9.`,
    explanationRo:
      'Servomotoarele și motoarele electrice trag vârfuri de curent mari la pornire. Regulatorul plăcii Arduino nu poate furniza curent suficient prin USB/5V, intrând în protecție termică și declanșând Brownout Reset.',
    explanationEn:
      'Servos and inductive motors draw large current spikes at startup. The onboard 5V regulator cannot supply enough current via USB, dropping voltage and triggering a Brownout Reset.',
    options: [
      {
        id: 'opt1',
        labelRo: 'Adăugăm un delay(1000) înainte de rotirea motorului',
        labelEn: 'Add delay(1000) before rotating the motor',
        isCorrect: false,
        feedbackRo: 'Întârzierea în cod nu rezolvă deficitul fizic de curent electric la pornirea motorului.',
        feedbackEn: 'A code delay does not solve the physical current draw deficit during motor startup.'
      },
      {
        id: 'opt2',
        labelRo: 'Alimentăm servomotorul din sursă externă separată cu Masă Comună (GND comun)',
        labelEn: 'Power servo from dedicated external supply with Common Ground (shared GND)',
        isCorrect: true,
        feedbackRo:
          'Corect! Sursa externă furnizează curentul necesar, iar masa comună asigură referința comună de tensiune pentru semnalul PWM.',
        feedbackEn:
          'Correct! The external supply delivers needed current, while common ground provides the reference for PWM control.'
      },
      {
        id: 'opt3',
        labelRo: 'Conectăm servomotorul la pinul de 3.3V al Arduino',
        labelEn: 'Connect servo to the 3.3V pin of Arduino',
        isCorrect: false,
        feedbackRo:
          'Pinul de 3.3V are o capacitate de curent și mai mică (maxim 50mA) și ar agrava problema!',
        feedbackEn:
          'The 3.3V pin has even lower current capacity (max 50mA) and would severely worsen the issue!'
      }
    ]
  }
];

export const R2Level6_IoTHardwareDebugger: React.FC<R2Level6Props> = ({
  onCompletePage,
  onComplete,
}) => {
  const { lang } = useLanguage();
  const [activeCaseIndex, setActiveCaseIndex] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<{ [caseId: string]: string }>({});
  const [solvedCases, setSolvedCases] = useState<{ [caseId: string]: boolean }>({});

  const currentCase = DEBUG_CASES[activeCaseIndex];
  const isCurrentSolved = solvedCases[currentCase.id];

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    setSelectedOptions((prev) => ({ ...prev, [currentCase.id]: optionId }));
    if (isCorrect) {
      sounds.playCorrect();
      setSolvedCases((prev) => ({ ...prev, [currentCase.id]: true }));
    } else {
      sounds.playWrong();
    }
  };

  const allSolved = DEBUG_CASES.every((c) => solvedCases[c.id]);

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
      <div className="bg-gradient-to-r from-amber-900/40 via-orange-900/30 to-slate-900/60 border border-amber-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300">
              <Wrench className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {lang === 'ro' ? 'Modulul 4B • Pasul 6 din 7' : 'Module 4B • Step 6 of 7'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {lang === 'ro'
                    ? 'Clinică Diagnosticare Hardware & Software'
                    : 'Hardware & Software Diagnostic Clinic'}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
                {lang === 'ro'
                  ? 'Clinica de Debugging IoT & Sisteme Inteligente'
                  : 'IoT & Smart Systems Debugging Clinic'}
              </h1>
              <p className="text-slate-300 text-sm mt-1 max-w-2xl">
                {lang === 'ro'
                  ? 'Rezolvă cele 4 anomalii critice întâlnite frecvent în proiectele de robotică: adrese I2C greșite, blocaje de procesor prin delay, relee cu logică inversată și căderi de tensiune brownout.'
                  : 'Resolve the 4 critical anomalies commonly encountered in robotics: incorrect I2C addresses, CPU blocking via delay, inverted logic relays, and brownout voltage drops.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-700/60">
            <div className="text-right">
              <div className="text-xs text-slate-400">
                {lang === 'ro' ? 'Cazuri Rezolvate' : 'Solved Cases'}
              </div>
              <div className="text-lg font-bold font-mono text-amber-400">
                {Object.keys(solvedCases).length} / {DEBUG_CASES.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Case Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {DEBUG_CASES.map((c, idx) => {
          const isSolved = solvedCases[c.id];
          const isActive = idx === activeCaseIndex;
          return (
            <button
              key={c.id}
              onClick={() => {
                sounds.playClick();
                setActiveCaseIndex(idx);
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-amber-950/40 border-amber-500 text-white shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span>{lang === 'ro' ? `Cazul #${idx + 1}` : `Case #${idx + 1}`}</span>
                {isSolved ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                )}
              </div>
              <div className="text-xs font-bold truncate mt-1 text-slate-200">
                {lang === 'ro' ? c.subsystemRo : c.subsystemEn}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Debugger Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Symptom & Code Comparison */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/70 border border-slate-700/60 rounded-2xl p-6 shadow-lg space-y-4">
            <div>
              <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wide">
                {lang === 'ro' ? currentCase.subsystemRo : currentCase.subsystemEn}
              </div>
              <h2 className="text-lg font-extrabold text-white mt-0.5">
                {lang === 'ro' ? currentCase.titleRo : currentCase.titleEn}
              </h2>
            </div>

            {/* Symptom Box */}
            <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 text-red-200 text-xs leading-relaxed flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">
                  {lang === 'ro' ? 'Simptom înregistrat în laborator:' : 'Symptom recorded in lab:'}
                </span>
                <p className="mt-1 text-slate-300">
                  {lang === 'ro' ? currentCase.symptomRo : currentCase.symptomEn}
                </p>
              </div>
            </div>

            {/* Code / Circuit Inspector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-950 p-3 rounded-xl border border-red-900/50">
                <div className="text-red-400 font-bold mb-2 flex items-center gap-1.5">
                  <Bug className="w-3.5 h-3.5" />{' '}
                  {lang === 'ro' ? 'Cod / Schemă cu Bug:' : 'Buggy Code / Schematic:'}
                </div>
                <pre className="text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {currentCase.buggyCode}
                </pre>
              </div>

              <div
                className={`p-3 rounded-xl border transition-all ${
                  isCurrentSolved
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className="font-bold mb-2 flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />{' '}
                  {lang === 'ro' ? 'Remediu Recomandat:' : 'Recommended Fix:'}
                </div>
                {isCurrentSolved ? (
                  <pre className="text-[11px] text-emerald-200 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {currentCase.fixedCode}
                  </pre>
                ) : (
                  <div className="h-40 flex items-center justify-center text-center p-4">
                    <span className="text-[11px] text-slate-500">
                      {lang === 'ro'
                        ? 'Selectează soluția corectă de mai jos pentru a debloca remediul ingineresc.'
                        : 'Select the correct solution below to unlock the engineering remedy.'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Explanation when solved */}
            {isCurrentSolved && (
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 leading-relaxed">
                <span className="font-bold">
                  {lang === 'ro' ? 'Explicație Pedagogică:' : 'Pedagogical Explanation:'}
                </span>{' '}
                {lang === 'ro' ? currentCase.explanationRo : currentCase.explanationEn}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Diagnostic Multiple-Choice Selection */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {lang === 'ro'
                ? 'Ce acțiune corectivă aplici pe circuit / în cod?'
                : 'What corrective action do you apply to the circuit / code?'}
            </h3>

            <div className="space-y-2.5">
              {currentCase.options.map((opt) => {
                const isSelected = selectedOptions[currentCase.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                    className={`w-full p-3.5 rounded-xl text-left border transition-all text-xs flex flex-col gap-1.5 ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-emerald-950/50 border-emerald-500 text-emerald-100 shadow-md'
                          : 'bg-red-950/50 border-red-500 text-red-200 shadow-md'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="font-semibold flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] font-mono shrink-0">
                        {isSelected ? (opt.isCorrect ? '✓' : '✗') : '•'}
                      </span>
                      <span>{lang === 'ro' ? opt.labelRo : opt.labelEn}</span>
                    </div>

                    {isSelected && (
                      <div
                        className={`text-[11px] pl-7 ${opt.isCorrect ? 'text-emerald-300' : 'text-red-300'}`}
                      >
                        {lang === 'ro' ? opt.feedbackRo : opt.feedbackEn}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Next Step / Finish Button */}
            <div className="pt-2 border-t border-slate-800">
              <button
                disabled={!allSolved}
                onClick={handleFinish}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                  allSolved
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white cursor-pointer hover:shadow-amber-500/25'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <span>
                  {lang === 'ro'
                    ? 'Continuă spre Nivelul 7: Examenul Sumativ de Robotică'
                    : 'Continue to Level 7: Summative Robotics Exam'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
