import React, { useState } from 'react';
import { TeacherTip } from '../TeacherTip';
import { sounds } from '../../utils/audio';
import { Cpu, Zap, CheckCircle2, ArrowRight, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { AnswerExplanation } from '../common/AnswerExplanation';
import { QuestionHint } from '../common/QuestionHint';

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
    id: 'ram',
    name: 'Memoria RAM',
    slotNumber: 3,
    icon: '⚡',
    role: 'Memoria de lucru temporară unde sunt stocate datele imediat necesare aplicațiilor rulate.',
    detail: 'Manual pag. 17, punctul 3',
    pillRo: 'RAM este memorie volatilă: extrem de rapidă, dar se golește complet la oprirea calculatorului.',
    pillEn: 'RAM is volatile high-speed memory that gets completely cleared when power is turned off.',
  },
  {
    id: 'psu',
    name: 'Sursa de alimentare',
    slotNumber: 5,
    icon: '🔌',
    role: 'Asigură energia electrică necesară funcționării întregii unități centrale.',
    detail: 'Manual pag. 17, punctul 5',
    pillRo: 'Transformă curentul alternativ de la priză (230V) în curent continuu de joasă tensiune (12V, 5V, 3.3V) pentru circuite.',
    pillEn: 'Converts 230V AC household power into safe regulated DC voltages (12V, 5V, 3.3V) for PC chips.',
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
    id: 'ram',
    name: 'RAM Memory',
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
  
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  const parts = lang === 'en' ? PARTS_EN : PARTS_RO;

  const handleInstall = (partId: string) => {
    sounds.playCorrect();
    if (!installedParts.includes(partId)) {
      setInstalledParts(prev => [...prev, partId]);
    }
    setSelectedPartId(partId);
  };

  const isAllInstalled = parts.every(p => installedParts.includes(p.id));
  const isQuizCorrect = quizStorageAnswer === 'ssd';

  const canValidate = isAllInstalled && quizStorageAnswer !== null;

  const handleValidate = () => {
    if (!canValidate) {
      sounds.playWrong();
      setShowErrors(true);
      return;
    }

    if (isAllInstalled && isQuizCorrect) {
      sounds.playCorrect();
      setCompleted(true);
      onComplete();
    } else {
      sounds.playWrong();
      setShowErrors(true);
    }
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

      {/* Task 2: RAM vs Storage permanent quiz (pag. 17, ex. 3) */}
      <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 mb-6">
        <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2 mb-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <span>{lang === 'en' ? 'Mission 2: Technical question from textbook (p. 17, Ex. 3b)' : 'Misiunea 2: Întrebare tehnică din manual (pag. 17, Ex. 3b)'}</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-200 mb-2 font-medium">
          {lang === 'en'
            ? '“To permanently preserve a photo or project on a computer, where must we save it?”'
            : '„Pentru a păstra definitiv o fotografie sau un proiect pe calculator, unde trebuie să o salvăm?”'}
        </p>

        <QuestionHint
          id="q-ram-vs-storage"
          hintRo="Gândește-te la diferența dintre masa de lucru (RAM) și dulapul cu dosare (HDD/SSD). Dacă se oprește curentul, ce memorie nu își pierde conținutul?"
          hintEn="Think of the difference between a desk (RAM) and an archival file cabinet (HDD/SSD). Which one retains data without power?"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <button
            onClick={() => {
              sounds.playClick();
              setQuizStorageAnswer('ram');
            }}
            className={`p-3 rounded-xl text-xs font-semibold text-left transition border cursor-pointer ${
              quizStorageAnswer === 'ram'
                ? 'bg-rose-950/40 text-rose-300 border-rose-500'
                : 'bg-slate-950 hover:bg-slate-900 text-slate-300 border-slate-800'
            }`}
          >
            <div className="font-bold text-white mb-1">
              {lang === 'en' ? 'A) In RAM Memory' : 'A) În memoria RAM'}
            </div>
            <div className="text-[11px] text-slate-400">
              {lang === 'en' ? '(Volatile working memory erased upon shutdown)' : '(Memoria de lucru temporară care se șterge la stingerea PC-ului)'}
            </div>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setQuizStorageAnswer('ssd');
            }}
            className={`p-3 rounded-xl text-xs font-semibold text-left transition border cursor-pointer ${
              quizStorageAnswer === 'ssd'
                ? 'bg-emerald-600/30 text-emerald-200 border-emerald-500 font-bold ring-1 ring-emerald-400'
                : 'bg-slate-950 hover:bg-slate-900 text-slate-300 border-slate-800'
            }`}
          >
            <div className="font-bold text-white mb-1">
              {lang === 'en' ? 'B) On HDD / SSD (Permanent Storage) ✓' : 'B) Pe HDD / SSD (Memorie permanentă) ✓'}
            </div>
            <div className="text-[11px] text-slate-400">
              {lang === 'en' ? '(Magnetic or flash drive where files remain preserved)' : '(Discul de stocare magnetic sau flash unde datele rămân în siguranță)'}
            </div>
          </button>
        </div>

        {quizStorageAnswer && (
          <AnswerExplanation
            isCorrect={quizStorageAnswer === 'ssd'}
            explanationRo={
              quizStorageAnswer === 'ssd'
                ? 'Excelent! HDD-ul și SSD-ul reprezintă memoria externă/secundară permanentă (nevolatilă). Fișierele salvate pe SSD rămân în siguranță chiar dacă scoți PC-ul din priză.'
                : 'Incorect! Memoria RAM este volatilă: când calculatorul este oprit, tot conținutul ei dispare instantaneu. Pentru păstrare permanentă se folosește discul SSD sau HDD (Manual pag. 17-18).'
            }
            explanationEn={
              quizStorageAnswer === 'ssd'
                ? 'Spot on! HDDs and SSDs provide non-volatile permanent storage. Files written to SSD remain secure even when power is turned off.'
                : 'Incorrect! RAM is volatile: when the PC turns off, RAM clears out. Permanent retention requires writing to an SSD or HDD (p. 17-18).'
            }
          />
        )}
      </div>

      {/* Validation / Next Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-700">
        <div className="text-xs text-slate-400">
          {completed ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> {lang === 'en' ? 'Central unit assembled successfully! +20 points added.' : 'Unitate Centrală asamblată cu succes! +20 puncte adăugate.'}
            </span>
          ) : (
            <span>{lang === 'en' ? 'Install all 5 components and answer the technical question.' : 'Instalează toate cele 5 componente și răspunde la întrebarea tehnică.'}</span>
          )}
        </div>

        <button
          onClick={handleValidate}
          disabled={completed}
          className={`px-6 py-3 rounded-2xl font-bold text-sm transition flex items-center gap-2 shadow-lg cursor-pointer ${
            completed
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
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
