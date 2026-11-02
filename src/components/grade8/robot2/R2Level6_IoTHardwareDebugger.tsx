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

interface R2Level6Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface DebugCase {
  id: string;
  title: string;
  subsystem: string;
  symptom: string;
  buggyCode: string;
  fixedCode: string;
  explanation: string;
  options: {
    id: string;
    label: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

const DEBUG_CASES: DebugCase[] = [
  {
    id: 'i2c_address',
    title: 'Cazul 1: Ecranul LCD 1602 Afișează Doar Blocuri Negre',
    subsystem: 'Stație Meteo IoT (I2C LCD)',
    symptom: 'La alimentarea plăcii, rândul superior al ecranului LCD 1602 luminează cu blocuri albe/negre pline, dar nu afișează niciun caracter sau temperatură.',
    buggyCode: `// Codul cu eroare:
#include <LiquidCrystal_I2C.h>

// Adresă greșită specificată de elev:
LiquidCrystal_I2C lcd(0x3F, 16, 2);

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.print("Statie Meteo");
}`,
    fixedCode: `// Soluția corectă (verificată cu I2C Scanner):
#include <LiquidCrystal_I2C.h>

// Adresa reală a cipului PCF8574 este 0x27:
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.print("Statie Meteo");
}`,
    explanation: 'Modulele I2C de pe spatele LCD 1602 au adresa hardware implicită 0x27 (sau rareori 0x3F). Dacă adresa nu corespunde cu cipul fizic PCF8574, microcontrollerul nu poate inițializa controlerul HD44780.',
    options: [
      {
        id: 'opt1',
        label: 'Înlocuim ecranul cu unul de 20x4 caractere',
        isCorrect: false,
        feedback: 'Dimensiunea fizică a ecranului nu rezolvă comunicarea I2C invalidă pe magistrală.'
      },
      {
        id: 'opt2',
        label: 'Rulăm I2C Scanner și setăm adresa corectă a cipului: 0x27',
        isCorrect: true,
        feedback: 'Corect! Adresa hardware standard a adaptorului I2C este 0x27, permițând inițializarea corectă.'
      },
      {
        id: 'opt3',
        label: 'Conectăm ecranul la pinii digitali D0 și D1',
        isCorrect: false,
        feedback: 'Greșit! Pinii I2C pe Arduino Uno sunt exclusiv A4 (SDA) și A5 (SCL), nu D0/D1 care sunt UART.'
      }
    ]
  },
  {
    id: 'blocking_delay',
    title: 'Cazul 2: Alarma de Gaz Nu Reacționează Când Bariera Așteaptă',
    subsystem: 'Smart City Master Hub (Sincronizare)',
    symptom: 'Când o mașină intră în parcare, bariera rămâne ridicată 5 secunde folosind delay(5000). În acest timp, dacă are loc o scăpare de gaz, alarma nu sună deloc!',
    buggyCode: `// Codul cu eroare (Blocant):
void loop() {
  if (masinaLaBariera) {
    bariera.write(90); // Ridică bariera
    delay(5000);       // BLOCARE COMPLETĂ 5 SECUNDE!
    bariera.write(0);  // Coboară
  }
  // Senzorul de gaz este ignorat 5 secunde!
  verificaSenzorGaz();
}`,
    fixedCode: `// Soluția corectă (Non-blocant cu millis):
unsigned long timpBariera = 0;
bool barieraDeschisa = false;

void loop() {
  // Gazul este verificat fără întrerupere la FIECARE buclă!
  verificaSenzorGaz();

  if (masinaLaBariera && !barieraDeschisa) {
    bariera.write(90);
    timpBariera = millis();
    barieraDeschisa = true;
  }
  if (barieraDeschisa && millis() - timpBariera >= 5000) {
    bariera.write(0);
    barieraDeschisa = false;
  }
}`,
    explanation: 'Instrucțiunea delay() îngheață procesorul Arduino, blocând toate celelalte verificări de siguranță. Folosind cronometrarea cu millis(), sistemul rămâne reactiv în timp real la urgențe.',
    options: [
      {
        id: 'opt1',
        label: 'Mărim durata delay la 10000 ms pentru siguranță',
        isCorrect: false,
        feedback: 'O întârziere mai mare ar bloca procesorul și mai mult timp!'
      },
      {
        id: 'opt2',
        label: 'Înlocuim delay() cu verificarea non-blocantă a timpului prin millis()',
        isCorrect: true,
        feedback: 'Excelent! Aceasta este tehnica esențială de multitasking cooperativ pe microcontroller.'
      },
      {
        id: 'opt3',
        label: 'Mutăm apelul verificaSenzorGaz() în funcția setup()',
        isCorrect: false,
        feedback: 'Funcția setup() rulează o singură dată la pornire, deci senzorul nu ar mai fi citit niciodată!'
      }
    ]
  },
  {
    id: 'relay_active_low',
    title: 'Cazul 3: Ventilatorul de Evacuare Pornește Invers pe Releu',
    subsystem: 'Sistem Siguranță Gaz (Releu Electromecanic)',
    symptom: 'Elevul dorește să pornească ventilatorul când este gaz (HIGH) și să-l oprească când e aer curat (LOW). Însă ventilatorul merge non-stop în aer curat și se OPREȘTE la gaz!',
    buggyCode: `// Codul cu logică inversată:
const int pinReleu = 7;

if (nivelGaz > 450) {
  // Elevul crede că HIGH pornește releul:
  digitalWrite(pinReleu, HIGH); 
} else {
  // Elevul crede că LOW oprește releul:
  digitalWrite(pinReleu, LOW); 
}`,
    fixedCode: `// Soluția corectă (Releu Active-LOW):
const int pinReleu = 7;
#define RELEU_PORNIT LOW   // Tranzistorul optocuplorului conduce la 0V
#define RELEU_OPRIT  HIGH  // Releul este decuplat la 5V

if (nivelGaz > 450) {
  digitalWrite(pinReleu, RELEU_PORNIT);
} else {
  digitalWrite(pinReleu, RELEU_OPRIT);
}`,
    explanation: 'Marea majoritate a modulelor de releu pentru Arduino sunt de tip Active-LOW: bobina este alimentată când pinul de comandă este tras la masă (LOW / 0V), iar la HIGH releul se dezactivează.',
    options: [
      {
        id: 'opt1',
        label: 'Definim comanda conform standardului Active-LOW: LOW = PORNIT, HIGH = OPRIT',
        isCorrect: true,
        feedback: 'Foarte bine! Modulele de releu cu optocuplor funcționează uzual pe logică inversată (Active-LOW).'
      },
      {
        id: 'opt2',
        label: 'Tăiem firul de alimentare VCC de la releu',
        isCorrect: false,
        feedback: 'Tăierea alimentării va dezactiva complet releul, împiedicând orice funcționare.'
      },
      {
        id: 'opt3',
        label: 'Schimbăm pinul digital 7 cu un pin analogic A0',
        isCorrect: false,
        feedback: 'Releul necesită o comandă logică binară (HIGH/LOW), pinul digital fiind ideal.'
      }
    ]
  },
  {
    id: 'servo_brownout',
    title: 'Cazul 4: Servomotorul Barierei Tremură și Arduino se Resetează',
    subsystem: 'Barieră Inteligentă (Alimentare Servomotor)',
    symptom: 'Când servomotorul începe să ridice bariera, plăcuța Arduino Uno se stinge pentru o fracțiune de secundă, LED-urile pâlpâie, iar programul reia execuția de la început (buclă de reset).',
    buggyCode: `// Schema cu eroare hardware:
// Firul Roșu al Servomotorului (VCC) este legat direct la pinul 5V al Arduino.
// Curentul tras la pornirea motorului depășește limita regulatorului de pe placă (500mA),
// generând o cădere de tensiune (Brownout Reset).`,
    fixedCode: `// Schema corectă de alimentare:
// 1. Servomotorul se alimentează dintr-un pack extern de baterii (5V - 6V, 2A).
// 2. Firul Negru (GND) al bateriilor se leagă ÎMPREUNĂ cu pinul GND al plăcii Arduino (Masă Comună).
// 3. Doar firul Galben (Semnal PWM) merge la pinul D9 al plăcii.`,
    explanation: 'Servomotoarele și motoarele electrice trag vârfuri de curent mari la pornire. Regulatorul plăcii Arduino nu poate furniza curent suficient prin USB/5V, intrând în protecție termică și declanșând Brownout Reset.',
    options: [
      {
        id: 'opt1',
        label: 'Adăugăm un delay(1000) înainte de rotirea motorului',
        isCorrect: false,
        feedback: 'Întârzierea în cod nu rezolvă deficitul fizic de curent electric la pornirea motorului.'
      },
      {
        id: 'opt2',
        label: 'Alimentăm servomotorul din sursă externă separată cu Masă Comună (GND comun)',
        isCorrect: true,
        feedback: 'Corect! Sursa externă furnizează curentul necesar, iar masa comună asigură referința comună de tensiune pentru semnalul PWM.'
      },
      {
        id: 'opt3',
        label: 'Conectăm servomotorul la pinul de 3.3V al Arduino',
        isCorrect: false,
        feedback: 'Pinul de 3.3V are o capacitate de curent și mai mică (maxim 50mA) și ar agrava problema!'
      }
    ]
  }
];

export const R2Level6_IoTHardwareDebugger: React.FC<R2Level6Props> = ({
  onCompletePage,
  onComplete,
}) => {
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
                  Modulul 4B • Pasul 6 din 7
                </span>
                <span className="text-xs text-slate-400 font-mono">Clinică Diagnosticare Hardware & Software</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
                Clinica de Debugging IoT & Sisteme Inteligente
              </h1>
              <p className="text-slate-300 text-sm mt-1 max-w-2xl">
                Rezolvă cele 4 anomalii critice întâlnite frecvent în proiectele de robotică: adrese I2C greșite, blocaje de procesor prin delay, relee cu logică inversată și căderi de tensiune brownout.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-700/60">
            <div className="text-right">
              <div className="text-xs text-slate-400">Cazuri Rezolvate</div>
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
                <span>Cazul #{idx + 1}</span>
                {isSolved ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                )}
              </div>
              <div className="text-xs font-bold truncate mt-1 text-slate-200">{c.subsystem}</div>
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
                {currentCase.subsystem}
              </div>
              <h2 className="text-lg font-extrabold text-white mt-0.5">{currentCase.title}</h2>
            </div>

            {/* Symptom Box */}
            <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 text-red-200 text-xs leading-relaxed flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Simptom înregistrat în laborator:</span>
                <p className="mt-1 text-slate-300">{currentCase.symptom}</p>
              </div>
            </div>

            {/* Code / Circuit Inspector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-950 p-3 rounded-xl border border-red-900/50">
                <div className="text-red-400 font-bold mb-2 flex items-center gap-1.5">
                  <Bug className="w-3.5 h-3.5" /> Cod / Schemă cu Bug:
                </div>
                <pre className="text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {currentCase.buggyCode}
                </pre>
              </div>

              <div className={`p-3 rounded-xl border transition-all ${
                isCurrentSolved
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}>
                <div className="font-bold mb-2 flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Remediu Recomandat:
                </div>
                {isCurrentSolved ? (
                  <pre className="text-[11px] text-emerald-200 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {currentCase.fixedCode}
                  </pre>
                ) : (
                  <div className="h-40 flex items-center justify-center text-center p-4">
                    <span className="text-[11px] text-slate-500">
                      Selectează soluția corectă de mai jos pentru a debloca remediul ingineresc.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Explanation when solved */}
            {isCurrentSolved && (
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 leading-relaxed">
                <span className="font-bold">Explicație Pedagogică:</span> {currentCase.explanation}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Diagnostic Multiple-Choice Selection */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Ce acțiune corectivă aplici pe circuit / în cod?
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
                      <span>{opt.label}</span>
                    </div>

                    {isSelected && (
                      <div className={`text-[11px] pl-7 ${opt.isCorrect ? 'text-emerald-300' : 'text-red-300'}`}>
                        {opt.feedback}
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
                <span>Continuă spre Nivelul 7: Examenul Sumativ de Robotică</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
