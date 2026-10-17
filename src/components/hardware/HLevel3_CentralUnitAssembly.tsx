import React, { useState } from 'react';
import { TeacherTip } from '../TeacherTip';
import { sounds } from '../../utils/audio';
import { Cpu, Zap, CheckCircle2, ArrowRight, HelpCircle, Activity, Volume2, Terminal, Power, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { AnswerExplanation } from '../common/AnswerExplanation';
import { QuestionHint } from '../common/QuestionHint';
import { PedagogicalQuizCard } from '../common/PedagogicalQuizCard';

interface HLevel3Props {
  onComplete: () => void;
}

interface ComponentPart {
  id: string;
  name: string;
  slotNumber: number;
  icon: string;
  role: string;
  detail: string;
  pillRo: string;
  pillEn: string;
}

const PARTS_RO: ComponentPart[] = [
  {
    id: 'mobo',
    name: 'Placa de bază (Motherboard)',
    slotNumber: 2,
    icon: '🟩',
    role: 'Cea mai mare placă electronică ce găzduiește CPU-ul, memoria și conectează toate componentele.',
    detail: 'Manual pag. 17, punctul 2',
    pillRo: 'Placa de bază conține trasee de cupru (magistrale) prin care componentele comunică la frecvențe de gigahertzi.',
    pillEn: 'The motherboard features copper traces (system buses) routing high-frequency signals between components.',
  },
  {
    id: 'cpu',
    name: 'Microprocesorul (CPU)',
    slotNumber: 1,
    icon: '🧠',
    role: 'Creierul calculatorului: execută calcule, comenzi și controlează toate celelalte componente.',
    detail: 'Manual pag. 17, punctul 1',
    pillRo: 'Conține Unitatea de Comandă și Control (UCC) și Unitatea Aritmetico-Logică (UAL), procesând miliarde de instrucțiuni pe secundă.',
    pillEn: 'Contains the Control Unit (CU) and Arithmetic Logic Unit (ALU), processing billions of instructions per second.',
  },
  {
    id: 'cooler',
    name: 'Cooler CPU & Pastă Termoconductoare',
    slotNumber: 4,
    icon: '❄️',
    role: 'Răcește procesorul și transferă căldura pentru a preveni oprirea de urgență la peste 95°C.',
    detail: 'Manual pag. 17, sfat practic',
    pillRo: 'Pasta termică umple micro-imperfecțiunile dintre procesor și radiatorul metalic pentru disipare termică optimă.',
    pillEn: 'Thermal paste fills microscopic gaps between the CPU heat spreader and copper cooler base.',
  },
  {
    id: 'ram',
    name: 'Memoria RAM (Dual-Channel)',
    slotNumber: 3,
    icon: '⚡',
    role: 'Memoria de lucru temporară unde sunt stocate datele imediat necesare aplicațiilor rulate.',
    detail: 'Manual pag. 17, punctul 3',
    pillRo: 'RAM este memorie volatilă: extrem de rapidă, dar se golește complet la oprirea calculatorului.',
    pillEn: 'RAM is volatile high-speed memory that gets completely cleared when power is turned off.',
  },
  {
    id: 'psu',
    name: 'Sursa de alimentare (PSU)',
    slotNumber: 5,
    icon: '🔌',
    role: 'Asigură energia electrică necesară funcționării întregii unități centrale.',
    detail: 'Manual pag. 17, punctul 5',
    pillRo: 'Transformă curentul alternativ de la priză (230V) în curent continuu de joasă tensiune (12V, 5V, 3.3V) pentru circuite.',
    pillEn: 'Converts 230V AC household power into safe regulated DC voltages (12V, 5V, 3.3V) for PC chips.',
  },
  {
    id: 'atx_cable',
    name: 'Cablaj Principal ATX 24-Pini',
    slotNumber: 6,
    icon: '⚡',
    role: 'Livrează energia electrică stabilă de la sursă direct către circuitele plăcii de bază.',
    detail: 'Standard ATX pag. 17',
    pillRo: 'Conectorul ATX 24 pini alimentează cipurile plăcii de bază și sloturile PCIe pentru plăcile de extensie.',
    pillEn: 'The 24-pin ATX connector delivers main rail power to the motherboard chipsets and expansion slots.',
  },
  {
    id: 'storage',
    name: 'SSD / HDD (Stocare Permanentă)',
    slotNumber: 7,
    icon: '💾',
    role: 'Memoria permanentă unde se păstrează Windows-ul, fișierele și pozele chiar și după oprirea PC-ului.',
    detail: 'Manual pag. 17, punctul 7',
    pillRo: 'SSD-ul folosește cipuri flash rapide și silențioase, păstrând datele intacte zeci de ani fără alimentare electrică.',
    pillEn: 'SSDs use solid-state flash cells, preserving user data safely for years without needing power.',
  },
];

const PARTS_EN: ComponentPart[] = [
  {
    id: 'mobo',
    name: 'Motherboard',
    slotNumber: 2,
    icon: '🟩',
    role: 'The primary circuit board holding the CPU, RAM modules, and interconnecting all internal components.',
    detail: 'Textbook p. 17, point 2',
    pillRo: 'Placa de bază conține trasee de cupru (magistrale) prin care componentele comunică la frecvențe de gigahertzi.',
    pillEn: 'The motherboard features copper traces (system buses) routing high-frequency signals between components.',
  },
  {
    id: 'cpu',
    name: 'Microprocessor (CPU)',
    slotNumber: 1,
    icon: '🧠',
    role: 'The brain of the computer: executes arithmetic, logic, and orchestrates all hardware instructions.',
    detail: 'Textbook p. 17, point 1',
    pillRo: 'Conține Unitatea de Comandă și Control (UCC) și Unitatea Aritmetico-Logică (UAL), procesând miliarde de instrucțiuni pe secundă.',
    pillEn: 'Contains the Control Unit (CU) and Arithmetic Logic Unit (ALU), processing billions of instructions per second.',
  },
  {
    id: 'cooler',
    name: 'CPU Cooler & Thermal Paste',
    slotNumber: 4,
    icon: '❄️',
    role: 'Transfers thermal energy away from the CPU die to prevent emergency thermal throttling over 95°C.',
    detail: 'Textbook p. 17 practical tip',
    pillRo: 'Pasta termică umple micro-imperfecțiunile dintre procesor și radiatorul metalic pentru disipare termică optimă.',
    pillEn: 'Thermal paste fills microscopic gaps between the CPU heat spreader and copper cooler base.',
  },
  {
    id: 'ram',
    name: 'RAM Memory (Dual-Channel)',
    slotNumber: 3,
    icon: '⚡',
    role: 'Temporary working memory storing volatile data needed immediately by active applications.',
    detail: 'Textbook p. 17, point 3',
    pillRo: 'RAM este memorie volatilă: extrem de rapidă, dar se golește complet la oprirea calculatorului.',
    pillEn: 'RAM is volatile high-speed memory that gets completely cleared when power is turned off.',
  },
  {
    id: 'psu',
    name: 'Power Supply Unit (PSU)',
    slotNumber: 5,
    icon: '🔌',
    role: 'Converts wall AC electricity into regulated DC power required by internal computer hardware.',
    detail: 'Textbook p. 17, point 5',
    pillRo: 'Transformă curentul alternativ de la priză (230V) în curent continuu de joasă tensiune (12V, 5V, 3.3V) pentru circuite.',
    pillEn: 'Converts 230V AC household power into safe regulated DC voltages (12V, 5V, 3.3V) for PC chips.',
  },
  {
    id: 'atx_cable',
    name: '24-Pin ATX Main Power Cable',
    slotNumber: 6,
    icon: '⚡',
    role: 'Routes regulated power rails from the PSU directly to the motherboard distribution circuits.',
    detail: 'ATX standard p. 17',
    pillRo: 'Conectorul ATX 24 pini alimentează cipurile plăcii de bază și sloturile PCIe pentru plăcile de extensie.',
    pillEn: 'The 24-pin ATX connector delivers main rail power to the motherboard chipsets and expansion slots.',
  },
  {
    id: 'storage',
    name: 'SSD / HDD (Permanent Storage)',
    slotNumber: 7,
    icon: '💾',
    role: 'Non-volatile storage where Windows, files, documents, and games are safely preserved without power.',
    detail: 'Textbook p. 17, point 7',
    pillRo: 'SSD-ul folosește cipuri flash rapide și silențioase, păstrând datele intacte zeci de ani fără alimentare electrică.',
    pillEn: 'SSDs use solid-state flash cells, preserving user data safely for years without needing power.',
  },
];

export const HLevel3_CentralUnitAssembly: React.FC<HLevel3Props> = ({ onComplete }) => {
  const { lang, t } = useLanguage();

  // Array of installed part IDs
  const [installedParts, setInstalledParts] = useState<string[]>([]);
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);

  // Exercise from textbook pag. 17, ex. 3:
  const [quizStorageAnswer, setQuizStorageAnswer] = useState<string | null>(null);
  const [quizPostAnswer, setQuizPostAnswer] = useState<string | null>(null);

  // Interactive BIOS POST & Beep Diagnostics Bench
  const [postStatus, setPostStatus] = useState<'idle' | 'testing' | 'error' | 'success'>('idle');
  const [postDiagnosticMsg, setPostDiagnosticMsg] = useState<{ ro: string; en: string; beep: string } | null>(null);

  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState<number>(0);

  const parts = lang === 'en' ? PARTS_EN : PARTS_RO;

  const handleInstall = (partId: string) => {
    sounds.playCorrect();
    if (!installedParts.includes(partId)) {
      setInstalledParts(prev => [...prev, partId]);
    }
    setSelectedPartId(partId);
    // Reset post status if parts change so student tests the new config
    setPostStatus('idle');
  };

  const handleRunPOSTTest = () => {
    sounds.playRetro('powerup');
    setPostStatus('testing');

    setTimeout(() => {
      // Diagnostic rule evaluation
      if (!installedParts.includes('mobo')) {
        sounds.playWrong();
        setPostStatus('error');
        setPostDiagnosticMsg({
          ro: 'EROARE CRITICĂ: Fără Placa de bază nu există circuite de comunicare între componente!',
          en: 'CRITICAL ERROR: Without the Motherboard there are no system communication buses!',
          beep: '⚡ 0 Beep / Fără alimentare'
        });
      } else if (!installedParts.includes('psu') || !installedParts.includes('atx_cable')) {
        sounds.playWrong();
        setPostStatus('error');
        setPostDiagnosticMsg({
          ro: 'EROARE ALIMENTARE: Sursa sau cablul ATX 24-pini lipsește! Niciun cip nu primește tensiunea de 12V/5V.',
          en: 'POWER ERROR: PSU or 24-pin ATX cable missing! Components receive no electrical power.',
          beep: '🔇 Fără semnal de pornire'
        });
      } else if (!installedParts.includes('cpu') || !installedParts.includes('cooler')) {
        sounds.playWrong();
        setPostStatus('error');
        setPostDiagnosticMsg({
          ro: 'EROARE PROCESOR: CPU lipsește sau Cooler-ul fără pastă provoacă alertă termică de urgență!',
          en: 'CPU ERROR: Microprocessor missing or cooler/paste missing causing emergency thermal shutdown!',
          beep: '🔊 Beep continuu înalt (Supraîncălzire CPU)'
        });
      } else if (!installedParts.includes('ram')) {
        sounds.playWrong();
        setPostStatus('error');
        setPostDiagnosticMsg({
          ro: 'EROARE MEMORIE: 3 Beep-uri scurte! Memoria RAM nu este detectată în slotul Dual-Channel.',
          en: 'MEMORY ERROR: 3 Short Beeps! RAM is missing or not seated in the Dual-Channel slot.',
          beep: '🔊 Beep • Beep • Beep (Cod alertă RAM)'
        });
      } else if (!installedParts.includes('storage')) {
        sounds.playWrong();
        setPostStatus('error');
        setPostDiagnosticMsg({
          ro: 'AVERTISMENT BIOS: Hardware POST reușit, dar mesajul este „No Bootable Device Found” (Lipsește SSD-ul).',
          en: 'BIOS WARNING: Hardware POST passed, but screen reads “No Bootable Device Found” (SSD missing).',
          beep: '🔊 1 Beep scurt urmat de ecran negru'
        });
      } else {
        sounds.playCorrect();
        setPostStatus('success');
        setPostDiagnosticMsg({
          ro: 'POST COMPLET CU SUCCES! 1 Beep scurt. Toate cele 7 componente vitale sunt recunoscute. Windows 11 inițializat!',
          en: 'POST SUCCESSFUL! 1 Short Beep. All 7 vital components recognized. System ready to boot Windows 11!',
          beep: '✅ 1 Beep scurt (Semnal oficial POST OK)'
        });
      }
    }, 500);
  };

  const isAllInstalled = parts.every(p => installedParts.includes(p.id));
  const isQuizCorrect = quizStorageAnswer === 'ssd';
  const isQuiz2Correct = quizPostAnswer === 'post_diagnostic';
  const isPostPassed = postStatus === 'success';

  const canValidate = isAllInstalled && isQuizCorrect && isQuiz2Correct && isPostPassed;

  const handleValidate = () => {
    if (cooldown > 0) return;

    if (!canValidate) {
      sounds.playWrong();
      setShowErrors(true);
      setCooldown(5);
      const timer = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return;
    }

    sounds.playCorrect();
    setCompleted(true);
    onComplete();
  };

  const activePart = parts.find(p => p.id === selectedPartId) || parts[0];

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-4 sm:p-7 shadow-2xl backdrop-blur">
      {/* Level Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-700">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-black uppercase tracking-wider font-mono">
              {lang === 'en' ? 'Level 3 of 5 • Hardware Module' : 'Nivelul 3 din 5 • Modulul Hardware'}
            </span>
            <span className="text-xs text-slate-400 font-semibold">• {t.bookPagePrefix} 15–17</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
            {lang === 'en' ? 'Tech Lab: Assemble the Central Processing Unit 🖥️' : 'Laboratorul Tehnic: Asamblează Unitatea Centrală 🖥️'}
          </h2>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs font-bold text-amber-400 font-mono bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl">
            {lang === 'en' ? 'Reward: +20 points' : 'Recompensă: +20 puncte'}
          </span>
        </div>
      </div>

      {/* Teacher Tip Component */}
      <TeacherTip
        title={lang === 'en' ? 'Teacher Pro Tip: RAM vs. SSD (Work Desk vs. Storage Closet)' : 'Sfat de Profesionist: RAM vs. SSD (Masa de lucru vs. Dulapul)'}
        tip={lang === 'en'
          ? '• RAM is your desk: while drawing, your paper rests on your desk. If power goes out, everything on the desk vanishes! • SSD/HDD is the archival cabinet: when you press Ctrl+S, the file is tucked into the drawer safely even without power!'
          : '• Memoria RAM este biroul de lucru: cât timp lucrezi la un desen, foaia stă pe birou. Dacă se stinge lumina (se ia curentul), tot ce era pe birou se pierde! • Discul SSD/HDD este dulapul de arhivă: când apeși Ctrl+S, foaia e pusă în dosar în dulap și rămâne în siguranță chiar și fără curent!'}
        bookPage="17"
        extraAdvice={lang === 'en'
          ? 'Microprocessors generate heavy heat during computation: always apply thermal paste and a heatsink with a fan (cooler)!'
          : 'Microprocesorul generează multă căldură la calcul: are nevoie mereu de pastă termoconductoare și un radiator cu ventilator (cooler)!'}
      />

      {/* Assembly Workbench Section */}
      <div className="mb-7">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>{lang === 'en' ? 'Mission 1: Install vital parts into the PC chassis (Fig. 5, p. 17)' : 'Misiunea 1: Instalează componentele vitale în carcasă (Fig. 5, pag. 17)'}</span>
          </h3>
          <span className="text-xs font-mono text-cyan-300 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-700">
            {installedParts.length}/{parts.length} {lang === 'en' ? 'mounted' : 'montate'}
          </span>
        </div>

        {/* Chassis & Components Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Chassis Visual Representation */}
          <div className="lg:col-span-7 bg-slate-950/90 border-2 border-slate-700 rounded-2xl p-4 sm:p-5 relative shadow-inner flex flex-col justify-between min-h-[300px]">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
              <span className="font-bold text-slate-200">{lang === 'en' ? 'PC CHASSIS • INTERNAL VIEW' : 'CARCASĂ PC • VEDERE INTERIOARĂ'}</span>
              <span>STAND-BY • 230V</span>
            </div>

            {/* Slots diagram */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
              {parts.map((part) => {
                const isInstalled = installedParts.includes(part.id);
                const isSelected = selectedPartId === part.id;

                return (
                  <div
                    key={part.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedPartId(part.id);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center text-center justify-between min-h-[100px] ${
                      isInstalled
                        ? isSelected
                          ? 'bg-cyan-950/50 border-cyan-400 shadow-md ring-1 ring-cyan-400'
                          : 'bg-emerald-950/40 border-emerald-500/60'
                        : 'bg-slate-900/40 border-dashed border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full text-[10px] font-mono text-slate-400">
                      <span>SLOT #{part.slotNumber}</span>
                      {isInstalled && <span className="text-emerald-400 font-bold">{lang === 'en' ? 'MOUNTED ✓' : 'MONTAT ✓'}</span>}
                    </div>

                    <div className="text-2xl my-1">
                      {isInstalled ? part.icon : '⬛'}
                    </div>

                    <div className="text-xs font-bold text-white leading-tight">
                      {part.name}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Component Inspector Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-black text-cyan-300 font-heading">
                  {activePart.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded">
                  {activePart.detail}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed mb-2">
                {activePart.role}
              </p>

              {installedParts.includes(activePart.id) && (
                <AnswerExplanation
                  isCorrect={true}
                  explanationRo={activePart.pillRo}
                  explanationEn={activePart.pillEn}
                  customBadgeRo="Pilulă Componentă:"
                  customBadgeEn="Component Pill:"
                />
              )}
            </div>
          </div>

          {/* Component Inventory & Install Controls */}
          <div className="lg:col-span-5 flex flex-col gap-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-1">
              {lang === 'en' ? 'Technician Workbench:' : 'Banc de Lucru Tehnician:'}
            </div>
            {parts.map((part) => {
              const isInstalled = installedParts.includes(part.id);

              return (
                <div
                  key={part.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${
                    isInstalled
                      ? 'bg-slate-900/60 border-slate-800 opacity-90'
                      : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{part.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-white">{part.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Slot #{part.slotNumber}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleInstall(part.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      isInstalled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30'
                    }`}
                  >
                    {isInstalled ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'Installed' : 'Instalat'}</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'Mount' : 'Montează'}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive BIOS POST & Beep Code Diagnostic Lab */}
      <div className="mb-7 bg-slate-950/90 border-2 border-indigo-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-heading">
                {lang === 'en' ? 'BIOS/UEFI Power-On Self-Test (POST) Diagnostic Bench' : 'Banc de Diagnoză BIOS/UEFI: Autotestarea POST & Coduri Beep'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {lang === 'en'
                  ? 'Press Power to test if all 7 hardware components receive power and communicate via system buses.'
                  : 'Apasă butonul de pornire pentru a verifica dacă toate cele 7 componente primesc tensiune și comunică.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleRunPOSTTest}
            disabled={postStatus === 'testing'}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition active:scale-95 disabled:opacity-50"
          >
            <Power className="w-4 h-4" />
            <span>{postStatus === 'testing' ? (lang === 'en' ? 'Testing Circuits...' : 'Testare circuite...') : (lang === 'en' ? 'Power-On / Run POST Test' : 'Pornire PC / Testează POST')}</span>
          </button>
        </div>

        {/* CRT BIOS Screen */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-[10px] text-slate-500 pb-1.5 border-b border-slate-900">
            <span>AMERICAN MEGATRENDS / UEFI BIOS v4.8</span>
            <span>ACPI x64 COMPLIANT</span>
          </div>

          {postStatus === 'idle' && (
            <div className="text-slate-400 py-3 text-center flex flex-col items-center gap-1">
              <Activity className="w-5 h-5 text-indigo-400 animate-pulse" />
              <span>{lang === 'en' ? 'System in Standby. Mount all 7 parts and click “Power-On / Run POST Test”.' : 'Sistem în standby. Montează toate cele 7 componente și apasă „Pornire PC / Testează POST”.'}</span>
            </div>
          )}

          {postStatus === 'testing' && (
            <div className="text-cyan-400 py-3 text-center flex flex-col items-center gap-1 animate-pulse">
              <Zap className="w-5 h-5 text-amber-400 animate-spin" />
              <span>{lang === 'en' ? 'Checking 24-Pin ATX voltage rails... Scanning CPU die temperature... Querying SPD EEPROM RAM...' : 'Verificare tensiuni ATX 24 pini... Scanare temperatură procesor... Detectare memorie RAM...'}</span>
            </div>
          )}

          {postStatus === 'error' && postDiagnosticMsg && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/50 text-rose-200 space-y-1.5">
              <div className="flex items-center justify-between text-rose-300 font-bold">
                <span className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-rose-400" /> {lang === 'en' ? 'POST FAILED' : 'POST EȘUAT'}</span>
                <span className="text-[11px] bg-rose-900/50 px-2 py-0.5 rounded border border-rose-500/40">{postDiagnosticMsg.beep}</span>
              </div>
              <p className="text-[11px] text-rose-100/90 leading-relaxed">
                {lang === 'en' ? postDiagnosticMsg.en : postDiagnosticMsg.ro}
              </p>
            </div>
          )}

          {postStatus === 'success' && postDiagnosticMsg && (
            <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 space-y-1.5">
              <div className="flex items-center justify-between text-emerald-300 font-bold">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> {lang === 'en' ? 'POST ALL OK' : 'POST REUȘIT'}</span>
                <span className="text-[11px] bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-500/40">{postDiagnosticMsg.beep}</span>
              </div>
              <p className="text-[11px] text-emerald-100/90 leading-relaxed">
                {lang === 'en' ? postDiagnosticMsg.en : postDiagnosticMsg.ro}
              </p>
              <div className="text-[10px] text-emerald-400/80 pt-1 border-t border-emerald-900/50 flex flex-wrap gap-3">
                <span>CPU: 3.80 GHz (32°C Cooler OK)</span>
                <span>RAM: 16 GB Dual-Channel 3200MHz OK</span>
                <span>NVMe: 1000 GB High Speed SSD OK</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Task 2: RAM vs Storage permanent quiz (pag. 17, ex. 3) with 5s Cooldown */}
      <div className="mb-6 space-y-5">
        <PedagogicalQuizCard
          questionRo="„Pentru a păstra definitiv o fotografie sau un proiect pe calculator, unde trebuie să o salvăm?” (Manual pag. 17, Ex. 3b)"
          questionEn="“To permanently preserve a photo or project on a computer, where must we save it?” (Textbook p. 17, Ex. 3b)"
          questionNumber={1}
          totalQuestions={2}
          bookPage="17-18"
          categoryLabelRo="Memorie Permanentă"
          categoryLabelEn="Permanent Storage"
          hintRo="Gândește-te la diferența dintre masa de lucru (RAM) și dulapul cu dosare (HDD/SSD). Dacă se oprește curentul, ce memorie nu își pierde conținutul?"
          hintEn="Think of the difference between a desk (RAM) and a storage cabinet (HDD/SSD). Which one retains data without power?"
          cooldownSeconds={5}
          maxXP={20}
          initialSelectedId={quizStorageAnswer || undefined}
          onAnswerSelected={(isCorrect, optId) => setQuizStorageAnswer(optId)}
          options={[
            {
              id: 'ram',
              labelRo: 'A) În memoria RAM (Memoria de lucru temporară)',
              labelEn: 'A) In RAM Memory (Volatile working memory)',
              isCorrect: false,
              explanationRo: 'Incorect! Memoria RAM este volatilă: când calculatorul este oprit sau repornit, tot conținutul ei dispare instantaneu. Pentru păstrare permanentă este nevoie de HDD sau SSD (Manual pag. 17).',
              explanationEn: 'Incorrect! RAM is volatile: when the PC turns off, RAM clears out completely. Permanent retention requires writing to an SSD or HDD (p. 17).',
            },
            {
              id: 'ssd',
              labelRo: 'B) Pe HDD / SSD (Memorie permanentă / Discuri de stocare)',
              labelEn: 'B) On HDD / SSD (Permanent non-volatile storage)',
              isCorrect: true,
              explanationRo: 'Excelent! Discurile HDD și SSD reprezintă memoria permanentă a calculatorului. Datele salvate pe SSD sau HDD rămân în siguranță chiar și după oprirea alimentării cu energie electrică.',
              explanationEn: 'Spot on! HDDs and SSDs provide non-volatile permanent storage. Files written to SSD remain secure even when power is turned off.',
            },
          ]}
        />

        {/* Task 3: BIOS POST & Beep codes check with 5s Cooldown */}
        <PedagogicalQuizCard
          questionRo="Ce indică un semnal sonor scurt (beep code) emis de difuzorul plăcii de bază la pornirea calculatorului?"
          questionEn="What does a short beep code from the motherboard speaker indicate when turning on the PC?"
          questionNumber={2}
          totalQuestions={2}
          bookPage="17"
          categoryLabelRo="Diagnoză Hardware & POST"
          categoryLabelEn="Hardware Diagnostics & POST"
          hintRo="Programele din cipul BIOS/UEFI verifică starea componentelor vitale înainte de încărcarea Windows-ului."
          hintEn="The BIOS/UEFI firmware checks vital hardware integrity before loading the OS."
          cooldownSeconds={5}
          maxXP={20}
          initialSelectedId={quizPostAnswer || undefined}
          onAnswerSelected={(isCorrect, optId) => setQuizPostAnswer(optId)}
          options={[
            {
              id: 'post_diagnostic',
              labelRo: 'A) Reușita testului POST (Power-On Self-Test) și inițializarea normală a componentelor vitale',
              labelEn: 'A) Success of the POST (Power-On Self-Test) routine and initialization of vital hardware',
              isCorrect: true,
              explanationRo: 'Corect! Un beep scurt la pornire este semnalul universal că BIOS-ul a verificat CPU-ul, memoria RAM și placa de bază și totul funcționează corect.',
              explanationEn: 'Correct! A single short beep is the standard POST confirmation that CPU, RAM, and motherboard passed hardware checks.',
            },
            {
              id: 'wifi_speed',
              labelRo: 'B) Că s-a descărcat un film sau melodia de pe YouTube',
              labelEn: 'B) That a movie or YouTube song finished downloading',
              isCorrect: false,
              explanationRo: 'Incorect! Beep-ul plăcii de bază este un semnal hardware de nivel foarte jos, emis înainte ca sistemul de operare sau internetul să funcționeze.',
              explanationEn: 'Incorrect! The BIOS beep is a low-level hardware alert before the OS or internet browser even loads.',
            },
            {
              id: 'volume_high',
              labelRo: 'C) Că volumul boxelor este setat la maximum',
              labelEn: 'C) That external speakers are set to maximum volume',
              isCorrect: false,
              explanationRo: 'Incorect! Difuzorul intern al carcasei (buzzer-ul de pe placa de bază) nu are legătură cu volumul boxelor externe.',
              explanationEn: 'Incorrect! The internal motherboard buzzer operates independently from external audio volume.',
            },
          ]}
        />
      </div>

      {/* Validation / Next Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-700">
        <div className="text-xs text-slate-400">
          {completed ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> {lang === 'en' ? 'Central unit assembled and POST validated! +20 points added.' : 'Unitate Centrală asamblată și testată POST cu succes! +20 puncte adăugate.'}
            </span>
          ) : (
            <span>
              {lang === 'en'
                ? `Install 7 parts (${installedParts.length}/7), run POST test (${isPostPassed ? 'OK ✓' : 'Pending'}), and answer both technical questions.`
                : `Montează cele 7 piese (${installedParts.length}/7), rulează testul POST (${isPostPassed ? 'Reușit ✓' : 'În așteptare'}) și răspunde la ambele întrebări.`}
            </span>
          )}
        </div>

        <button
          onClick={handleValidate}
          disabled={completed || cooldown > 0}
          className={`px-6 py-3 rounded-2xl font-bold text-sm transition flex items-center gap-2 shadow-lg cursor-pointer ${
            completed || cooldown > 0
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-60'
              : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/30 active:scale-95'
          }`}
        >
          <span>{completed ? (lang === 'en' ? 'Level Completed ✓' : 'Nivel Finalizat ✓') : (lang === 'en' ? 'Validate & Go to Level 4 (+20 pts)' : 'Validează & Mergi la Nivelul 4 (+20 pct)')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
