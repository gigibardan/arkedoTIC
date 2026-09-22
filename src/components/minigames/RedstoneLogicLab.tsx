import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Zap, 
  RotateCcw, 
  Trophy, 
  Lightbulb, 
  ShieldCheck, 
  HelpCircle, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  Layers, 
  Play, 
  Award,
  ChevronRight,
  Info,
  Sliders,
  Unlock,
  Volume2,
  VolumeX,
  Boxes
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { updateStudentArcadeScore } from '../../lib/studentAuthService';

interface RedstoneLogicLabProps {
  onBack: () => void;
  onGameComplete?: (score: number) => void;
}

export interface RedstoneLevel {
  id: number;
  titleRo: string;
  titleEn: string;
  subtitleRo: string;
  subtitleEn: string;
  goalRo: string;
  goalEn: string;
  conceptRo: string;
  conceptEn: string;
  hintRo: string;
  hintEn: string;
  gateType: 'DIRECT' | 'NOT' | 'AND' | 'OR' | 'XOR' | 'NAND' | 'BINARY_DECODER' | 'CLOCK' | 'HALF_ADDER' | 'MASTER_VAULT';
  inputs: Array<{ id: string; label: string; state: boolean }>;
  targetCondition: (inputs: boolean[], customState?: any) => boolean;
  truthTable: Array<{ inputs: boolean[]; output: boolean; label?: string }>;
  rewardDiamonds: number;
  xpPoints: number;
}

const REDSTONE_LEVELS: RedstoneLevel[] = [
  {
    id: 1,
    titleRo: 'Misiunea 1: Primul Semnal Redstone',
    titleEn: 'Mission 1: First Redstone Signal',
    subtitleRo: 'Circuite Liniare & Pârghia de Piatră',
    subtitleEn: 'Direct Circuits & Stone Lever',
    goalRo: 'Comută Pârghia (Maneta) în poziția ON (1) pentru a alimenta firul de pulbere și a aprinde Lampa de Redstone.',
    goalEn: 'Toggle the Lever to ON (1) to power the redstone dust wire and ignite the Redstone Lamp.',
    conceptRo: 'Semnal Binar: 0 = Stins (Fără curent), 1 = Aprins (+15 Putere Redstone).',
    conceptEn: 'Binary Signal: 0 = Low (No power), 1 = High (+15 Redstone power).',
    hintRo: 'Apasă pur și simplu pe Pârghia A pentru a trimite semnal 1.',
    hintEn: 'Simply click Lever A to send a signal of 1.',
    gateType: 'DIRECT',
    inputs: [{ id: 'A', label: 'Pârghie A (Manetă)', state: false }],
    targetCondition: (inputs) => inputs[0] === true,
    truthTable: [
      { inputs: [false], output: false },
      { inputs: [true], output: true },
    ],
    rewardDiamonds: 1,
    xpPoints: 50,
  },
  {
    id: 2,
    titleRo: 'Misiunea 2: Invertorul (Torța / Poarta NOT)',
    titleEn: 'Mission 2: The Inverter (Redstone Torch / NOT Gate)',
    subtitleRo: 'Negarea Logică în Minecraft',
    subtitleEn: 'Logical Negation in Minecraft',
    goalRo: 'Torța de Redstone pe un bloc inversat acționează ca poartă NOT. Asigură-te că Ușa de Fier este DESCHISĂ (Ieșire = 1).',
    goalEn: 'A Redstone torch placed on a block inverts signals (NOT gate). Ensure the Iron Door is OPEN (Output = 1).',
    conceptRo: 'Poarta NOT inversează semnalul: Dacă Intrarea este 0, Ieșirea devine 1!',
    conceptEn: 'The NOT gate inverts the signal: If Input is 0, Output becomes 1!',
    hintRo: 'Dacă pârghia e OFF (0), torța se aprinde și emite 1.',
    hintEn: 'If the lever is OFF (0), the torch lights up and outputs 1.',
    gateType: 'NOT',
    inputs: [{ id: 'A', label: 'Pârghie A', state: true }],
    targetCondition: (inputs) => !inputs[0],
    truthTable: [
      { inputs: [false], output: true },
      { inputs: [true], output: false },
    ],
    rewardDiamonds: 1,
    xpPoints: 60,
  },
  {
    id: 3,
    titleRo: 'Misiunea 3: Seiful Dublu (Poarta AND / ȘI)',
    titleEn: 'Mission 3: Dual Vault (AND Gate)',
    subtitleRo: 'Securitate cu Două Chei',
    subtitleEn: 'Two-Key Security Protocol',
    goalRo: 'Ușa blindată de diamant necesită autorizare dublă. Deschide ușa (Ieșire = 1) folosind ambele pârghii!',
    goalEn: 'The diamond vault requires dual authorization. Open the door (Output = 1) using both levers!',
    conceptRo: 'Poarta AND (ȘI): Ieșirea este 1 DOAR dacă TOATE intrările sunt 1 (A = 1 ȘI B = 1).',
    conceptEn: 'AND Gate: Output is 1 ONLY if ALL inputs are 1 (A = 1 AND B = 1).',
    hintRo: 'Activează atât Pârghia A, cât și Pârghia B (ambele pe ON).',
    hintEn: 'Activate both Lever A and Lever B (both set to ON).',
    gateType: 'AND',
    inputs: [
      { id: 'A', label: 'Cheia A (Pârghie 1)', state: false },
      { id: 'B', label: 'Cheia B (Pârghie 2)', state: false },
    ],
    targetCondition: (inputs) => inputs[0] && inputs[1],
    truthTable: [
      { inputs: [false, false], output: false },
      { inputs: [false, true], output: false },
      { inputs: [true, false], output: false },
      { inputs: [true, true], output: true },
    ],
    rewardDiamonds: 2,
    xpPoints: 75,
  },
  {
    id: 4,
    titleRo: 'Misiunea 4: Podul Peste Lavă (Poarta OR / SAU)',
    titleEn: 'Mission 4: Lava Bridge (OR Gate)',
    subtitleRo: 'Activare de la Oricare Consolă',
    subtitleEn: 'Activation from Either Station',
    goalRo: 'Podul de piatră peste lacul de lavă se extinde dacă apeși oricare dintre cele două pârghii de control.',
    goalEn: 'The stone bridge over the lava lake extends if you press either of the two control levers.',
    conceptRo: 'Poarta OR (SAU): Ieșirea este 1 dacă CEL PUȚIN O intrare este 1 (A = 1 SAU B = 1 SAU ambele).',
    conceptEn: 'OR Gate: Output is 1 if AT LEAST ONE input is 1 (A = 1 OR B = 1 OR both).',
    hintRo: 'Comută măcar una dintre pârghii pe ON pentru a trece puntea.',
    hintEn: 'Toggle at least one lever to ON to extend the bridge.',
    gateType: 'OR',
    inputs: [
      { id: 'A', label: 'Consola Nord (Pârghie A)', state: false },
      { id: 'B', label: 'Consola Sud (Pârghie B)', state: false },
    ],
    targetCondition: (inputs) => inputs[0] || inputs[1],
    truthTable: [
      { inputs: [false, false], output: false },
      { inputs: [false, true], output: true },
      { inputs: [true, false], output: true },
      { inputs: [true, true], output: true },
    ],
    rewardDiamonds: 2,
    xpPoints: 80,
  },
  {
    id: 5,
    titleRo: 'Misiunea 5: Comutator Cap-Scară (Poarta XOR / SAU Exclusiv)',
    titleEn: 'Mission 5: Two-Way Light Switch (XOR Gate)',
    subtitleRo: 'Controlul Iluminatului din Mină',
    subtitleEn: 'Mine Illumination Switch',
    goalRo: 'Lampa din galeria minei trebuie să fie aprinsă doar când exact O SINGURĂ pârghie este activată (diferite între ele).',
    goalEn: 'The mine gallery lamp must be lit only when exactly ONE lever is active (inputs differ).',
    conceptRo: 'Poarta XOR (SAU Exclusiv): Ieșirea este 1 dacă intrările sunt DIFERITE (Una 1 și cealaltă 0). Dacă ambele sunt 0 sau ambele 1, ieșirea este 0.',
    conceptEn: 'XOR Gate (Exclusive OR): Output is 1 if inputs DIFFER (One is 1, other is 0). If identical, output is 0.',
    hintRo: 'Pune o pârghie pe ON și cealaltă pe OFF.',
    hintEn: 'Set one lever to ON and the other to OFF.',
    gateType: 'XOR',
    inputs: [
      { id: 'A', label: 'Comutator Intrare Mină', state: false },
      { id: 'B', label: 'Comutator Adâncime Mină', state: false },
    ],
    targetCondition: (inputs) => (inputs[0] && !inputs[1]) || (!inputs[0] && inputs[1]),
    truthTable: [
      { inputs: [false, false], output: false },
      { inputs: [false, true], output: true },
      { inputs: [true, false], output: true },
      { inputs: [true, true], output: false },
    ],
    rewardDiamonds: 3,
    xpPoints: 90,
  },
  {
    id: 6,
    titleRo: 'Misiunea 6: Decodor Binar (Codul Seifului: 5)',
    titleEn: 'Mission 6: Binary Decoder (Vault Code: 5)',
    subtitleRo: 'Conversie Binar în Zecimal cu Torțe',
    subtitleEn: 'Binary to Decimal with Torches',
    goalRo: 'Seiful cu diamante cere combinația binară pentru cifra 5 (Ponderi: 4, 2, 1). Configurează pârghiile pe 101₂!',
    goalEn: 'The diamond safe requires the binary combination for number 5 (Weights: 4, 2, 1). Set levers to 101₂!',
    conceptRo: 'Numere binare: Bit 4 (2²) + Bit 2 (2¹) + Bit 1 (2⁰). Pentru 5 = 4 + 0 + 1 ➡️ Binar: 1 0 1.',
    conceptEn: 'Binary weights: Bit 4 (2²) + Bit 2 (2¹) + Bit 1 (2⁰). For 5 = 4 + 0 + 1 ➡️ Binary: 1 0 1.',
    hintRo: 'Activează Pârghia 4 (ON), lasă Pârghia 2 (OFF), activează Pârghia 1 (ON).',
    hintEn: 'Turn ON Lever 4, leave Lever 2 OFF, turn ON Lever 1.',
    gateType: 'BINARY_DECODER',
    inputs: [
      { id: 'B4', label: 'Bit 4 (Valoare 4)', state: false },
      { id: 'B2', label: 'Bit 2 (Valoare 2)', state: false },
      { id: 'B1', label: 'Bit 1 (Valoare 1)', state: false },
    ],
    targetCondition: (inputs) => inputs[0] === true && inputs[1] === false && inputs[2] === true,
    truthTable: [
      { inputs: [false, false, false], output: false, label: '000₂ = 0' },
      { inputs: [false, false, true], output: false, label: '001₂ = 1' },
      { inputs: [false, true, false], output: false, label: '010₂ = 2' },
      { inputs: [false, true, true], output: false, label: '011₂ = 3' },
      { inputs: [true, false, false], output: false, label: '100₂ = 4' },
      { inputs: [true, false, true], output: true, label: '101₂ = 5 ⭐' },
      { inputs: [true, true, false], output: false, label: '110₂ = 6' },
      { inputs: [true, true, true], output: false, label: '111₂ = 7' },
    ],
    rewardDiamonds: 3,
    xpPoints: 100,
  },
  {
    id: 7,
    titleRo: 'Misiunea 7: Alarma Antiefracție (Poarta NAND / ȘI-NU)',
    titleEn: 'Mission 7: Intruder Alarm (NAND Gate)',
    subtitleRo: 'Inversarea Porții AND',
    subtitleEn: 'Inverted AND Security',
    goalRo: 'Capcana cu TNT este sigură (Ieșire = 1). Ea explodează DOAR când ambele lasere sunt tăiate (A=1 și B=1). Păstrează circuitul în siguranță (Ieșire = 1)!',
    goalEn: 'The TNT trap is disarmed (Output = 1). It only detonates if BOTH sensors are tripped (A=1 and B=1). Keep the system safe (Output = 1)!',
    conceptRo: 'Poarta NAND (NOT-AND): Ieșirea este 1 în TOATE cazurile, MAI PUȚIN când ambele intrări sunt 1.',
    conceptEn: 'NAND Gate: Output is 1 in ALL cases, EXCEPT when both inputs are 1.',
    hintRo: 'Asigură-te că NU sunt ambele pârghii pe ON în același timp.',
    hintEn: 'Make sure NOT both levers are set to ON simultaneously.',
    gateType: 'NAND',
    inputs: [
      { id: 'A', label: 'Senzor Laser A', state: true },
      { id: 'B', label: 'Senzor Laser B', state: true },
    ],
    targetCondition: (inputs) => !(inputs[0] && inputs[1]),
    truthTable: [
      { inputs: [false, false], output: true },
      { inputs: [false, true], output: true },
      { inputs: [true, false], output: true },
      { inputs: [true, true], output: false },
    ],
    rewardDiamonds: 3,
    xpPoints: 110,
  },
  {
    id: 8,
    titleRo: 'Misiunea 8: Pistonul Temporizat (Repetitorul)',
    titleEn: 'Mission 8: Timed Piston (Redstone Repeater)',
    subtitleRo: 'Întârzieri de Semnal & Releu',
    subtitleEn: 'Signal Delays & Relay',
    goalRo: 'Activează ambele repetitoare pe treapta corectă pentru a sincroniza pistonul și a ridica blocul de obsidian.',
    goalEn: 'Set both repeaters to the correct delay stage to synchronize the piston and raise the obsidian block.',
    conceptRo: 'Repetitorul de Redstone amplifică semnalul la 15 blocuri și introduce o întârziere reglabilă (1-4 tick-uri).',
    conceptEn: 'The Redstone Repeater boosts signal strength to 15 blocks and adds an adjustable delay (1-4 ticks).',
    hintRo: 'Comută Pârghia Principală pe ON și asigură-te că Repetitorul B este activat.',
    hintEn: 'Turn Main Lever ON and ensure Repeater B is energized.',
    gateType: 'CLOCK',
    inputs: [
      { id: 'A', label: 'Pârghie Impuls', state: false },
      { id: 'B', label: 'Blocare Repetitor', state: true },
    ],
    targetCondition: (inputs) => inputs[0] === true && inputs[1] === true,
    truthTable: [
      { inputs: [false, false], output: false },
      { inputs: [false, true], output: false },
      { inputs: [true, false], output: false },
      { inputs: [true, true], output: true },
    ],
    rewardDiamonds: 4,
    xpPoints: 120,
  },
  {
    id: 9,
    titleRo: 'Misiunea 9: Sumatorul Binar de 1-Bit (Half-Adder)',
    titleEn: 'Mission 9: 1-Bit Half-Adder Circuit',
    subtitleRo: 'Cum Calculează Microprocesorul (CPU)',
    subtitleEn: 'How CPU Arithmetic Works',
    goalRo: 'Calculează adunarea binară: 1 + 1 = 10₂ (Sumă S = 0 prin XOR, Transport C = 1 prin AND). Activează A=1 și B=1!',
    goalEn: 'Perform binary addition: 1 + 1 = 10₂ (Sum S = 0 via XOR, Carry C = 1 via AND). Set A=1 and B=1!',
    conceptRo: 'Un Half-Adder folosește o poartă XOR pentru Sumă (S) și o poartă AND pentru Transport / Carry (C).',
    conceptEn: 'A Half-Adder uses an XOR gate for Sum (S) and an AND gate for Carry (C).',
    hintRo: 'Activează ambele numere: Pârghia A (1) și Pârghia B (1) pentru a genera Transportul C=1 și Suma S=0.',
    hintEn: 'Activate both inputs: Lever A (1) and Lever B (1) to generate Carry C=1 and Sum S=0.',
    gateType: 'HALF_ADDER',
    inputs: [
      { id: 'A', label: 'Operand A (Bit 1)', state: false },
      { id: 'B', label: 'Operand B (Bit 1)', state: false },
    ],
    targetCondition: (inputs) => inputs[0] === true && inputs[1] === true,
    truthTable: [
      { inputs: [false, false], output: false, label: '0 + 0 = S:0, C:0' },
      { inputs: [false, true], output: false, label: '0 + 1 = S:1, C:0' },
      { inputs: [true, false], output: false, label: '1 + 0 = S:1, C:0' },
      { inputs: [true, true], output: true, label: '1 + 1 = S:0, C:1 (10₂) ⭐' },
    ],
    rewardDiamonds: 4,
    xpPoints: 140,
  },
  {
    id: 10,
    titleRo: 'Misiunea 10: Seiful Suprem din Netherite',
    titleEn: 'Mission 10: Netherite Master Vault',
    subtitleRo: 'Arhitectura Logică Combinată',
    subtitleEn: 'Combined Logic Architecture',
    goalRo: 'Deschide Seiful Suprem: Circuitul cere (A AND B) OR (C AND NOT D). Găsește o combinație validă pentru Ieșire = 1!',
    goalEn: 'Open the Master Vault: Requires (A AND B) OR (C AND NOT D). Find any valid combination for Output = 1!',
    conceptRo: 'Circuitele reale combină mai multe porți logice în rețele logice complexe (ALU / Cipuri grafice).',
    conceptEn: 'Real circuits combine multiple logic gates into complex networks (ALU / Graphic chips).',
    hintRo: 'O soluție ușoară: Pune A=ON și B=ON (ramura AND superioară). Sau C=ON și D=OFF.',
    hintEn: 'An easy solution: Set A=ON and B=ON (upper AND branch). Or C=ON and D=OFF.',
    gateType: 'MASTER_VAULT',
    inputs: [
      { id: 'A', label: 'Pârghia A (Cod Alfa)', state: false },
      { id: 'B', label: 'Pârghia B (Cod Beta)', state: false },
      { id: 'C', label: 'Pârghia C (Cod Gama)', state: false },
      { id: 'D', label: 'Pârghia D (Cod Delta)', state: true },
    ],
    targetCondition: (inputs) => (inputs[0] && inputs[1]) || (inputs[2] && !inputs[3]),
    truthTable: [
      { inputs: [true, true, false, false], output: true, label: 'Soluție 1 (A & B)' },
      { inputs: [false, false, true, false], output: true, label: 'Soluție 2 (C & NOT D)' },
      { inputs: [false, false, false, true], output: false, label: 'Blocat' },
      { inputs: [false, false, false, false], output: false, label: 'Blocat' },
    ],
    rewardDiamonds: 5,
    xpPoints: 170,
  }
];

export const RedstoneLogicLab: React.FC<RedstoneLogicLabProps> = ({ onBack, onGameComplete }) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [levelInputs, setLevelInputs] = useState<boolean[]>([]);
  const [totalDiamonds, setTotalDiamonds] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('arkedo_redstone_diamonds') || '0');
    } catch {
      return 0;
    }
  });
  const [totalScore, setTotalScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_redstone_lab') || '0');
    } catch {
      return 0;
    }
  });
  const [completedLevels, setCompletedLevels] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('arkedo_redstone_completed_levels');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isLevelSolved, setIsLevelSolved] = useState<boolean>(false);
  const [showTruthTableModal, setShowTruthTableModal] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);

  const level = REDSTONE_LEVELS[currentLevelIndex] || REDSTONE_LEVELS[0];

  // Initialize level inputs when level changes
  useEffect(() => {
    setLevelInputs(level.inputs.map((inp) => inp.state));
    setIsLevelSolved(false);
    setShowHint(false);
  }, [currentLevelIndex]);

  // Compute live output based on level gate logic
  const computeLiveOutput = (inputs: boolean[]) => {
    switch (level.gateType) {
      case 'DIRECT':
        return inputs[0] === true;
      case 'NOT':
        return !inputs[0];
      case 'AND':
        return inputs[0] && inputs[1];
      case 'OR':
        return inputs[0] || inputs[1];
      case 'XOR':
        return (inputs[0] && !inputs[1]) || (!inputs[0] && inputs[1]);
      case 'BINARY_DECODER':
        return inputs[0] === true && inputs[1] === false && inputs[2] === true;
      case 'NAND':
        return !(inputs[0] && inputs[1]);
      case 'CLOCK':
        return inputs[0] && inputs[1];
      case 'HALF_ADDER':
        return inputs[0] && inputs[1];
      case 'MASTER_VAULT':
        return (inputs[0] && inputs[1]) || (inputs[2] && !inputs[3]);
      default:
        return false;
    }
  };

  const isOutputActive = computeLiveOutput(levelInputs);

  // Check victory condition
  useEffect(() => {
    if (levelInputs.length > 0) {
      const solved = level.targetCondition(levelInputs);
      if (solved && !isLevelSolved) {
        setIsLevelSolved(true);
        if (!soundMuted) sounds.playCorrect();

        // Award Diamonds & XP if not already completed
        if (!completedLevels.includes(level.id)) {
          const newCompleted = [...completedLevels, level.id];
          const newDiamonds = totalDiamonds + level.rewardDiamonds;
          const newScore = totalScore + level.xpPoints;

          setCompletedLevels(newCompleted);
          setTotalDiamonds(newDiamonds);
          setTotalScore(newScore);

          try {
            localStorage.setItem('arkedo_redstone_completed_levels', JSON.stringify(newCompleted));
            localStorage.setItem('arkedo_redstone_diamonds', String(newDiamonds));
            localStorage.setItem('arkedo_highscore_redstone_lab', String(newScore));
            updateStudentArcadeScore('redstone_lab', newScore);
          } catch (e) {
            console.error(e);
          }

          if (onGameComplete) onGameComplete(newScore);
        }
      } else if (!solved && isLevelSolved) {
        setIsLevelSolved(false);
      }
    }
  }, [levelInputs]);

  const toggleInput = (index: number) => {
    const updated = [...levelInputs];
    updated[index] = !updated[index];
    setLevelInputs(updated);
    if (!soundMuted) sounds.playClick();
  };

  const handleNextLevel = () => {
    if (currentLevelIndex < REDSTONE_LEVELS.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1);
      if (!soundMuted) sounds.playLevelUp();
    }
  };

  const handlePrevLevel = () => {
    if (currentLevelIndex > 0) {
      setCurrentLevelIndex(currentLevelIndex - 1);
      if (!soundMuted) sounds.playClick();
    }
  };

  const handleResetCurrentLevel = () => {
    setLevelInputs(level.inputs.map((inp) => inp.state));
    setIsLevelSolved(false);
    if (!soundMuted) sounds.playClick();
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 pb-12 select-none animate-fadeIn overflow-x-hidden">
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-950 border-2 border-stone-700/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        {/* Glowing Redstone Dust Particle Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <button
            onClick={onBack}
            className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-600 transition shadow-md cursor-pointer group shrink-0"
            title={isEn ? 'Back to Arcade' : 'Înapoi la Jocuri'}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider">
                <Zap className="w-3 h-3 text-rose-400 animate-pulse" />
                <span>Minecraft Redstone</span>
              </span>
              <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700 text-[10px] sm:text-[11px] font-mono">
                {isEn ? `Level ${currentLevelIndex + 1} / ${REDSTONE_LEVELS.length}` : `Nivelul ${currentLevelIndex + 1} / ${REDSTONE_LEVELS.length}`}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-white font-heading tracking-tight break-words">
              {isEn ? level.titleEn : level.titleRo}
            </h2>
            <p className="text-[11px] sm:text-xs md:text-sm text-stone-400 mt-0.5 break-words">
              {isEn ? level.subtitleEn : level.subtitleRo}
            </p>
          </div>
        </div>

        {/* Stats & Controls */}
        <div className="relative z-10 flex items-center justify-between sm:justify-start gap-2 sm:gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-800">
          {/* Diamonds Collected */}
          <div className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center gap-1.5 sm:gap-2 shadow-inner">
            <span className="text-base sm:text-xl">💎</span>
            <div>
              <div className="text-[9px] sm:text-[10px] font-mono text-cyan-300 uppercase leading-none font-bold">
                {isEn ? 'Diamonds' : 'Diamante'}
              </div>
              <div className="text-xs sm:text-sm font-black text-cyan-100 font-mono">
                {totalDiamonds}
              </div>
            </div>
          </div>

          {/* XP Score */}
          <div className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-amber-950/60 border border-amber-500/40 flex items-center gap-1.5 sm:gap-2 shadow-inner">
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <div>
              <div className="text-[9px] sm:text-[10px] font-mono text-amber-300 uppercase leading-none font-bold">
                XP
              </div>
              <div className="text-xs sm:text-sm font-black text-amber-100 font-mono">
                {totalScore}
              </div>
            </div>
          </div>

          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-stone-800 hover:bg-stone-750 text-stone-300 border border-stone-700 transition cursor-pointer"
            title={soundMuted ? 'Unmute' : 'Mute'}
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Level Selection Bar */}
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-2 sm:p-2.5 flex items-center gap-1.5 sm:gap-2 overflow-x-auto shadow-lg max-w-full">
        {REDSTONE_LEVELS.map((lvl, idx) => {
          const isCurrent = idx === currentLevelIndex;
          const isDone = completedLevels.includes(lvl.id);

          return (
            <button
              key={lvl.id}
              onClick={() => {
                setCurrentLevelIndex(idx);
                if (!soundMuted) sounds.playClick();
              }}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-mono font-bold transition flex items-center gap-1 sm:gap-1.5 shrink-0 cursor-pointer border ${
                isCurrent
                  ? 'bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-600/30 ring-2 ring-rose-500/30'
                  : isDone
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                  : 'bg-stone-850 text-stone-400 border-stone-700 hover:bg-stone-800 hover:text-stone-200'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
              ) : (
                <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-stone-800 flex items-center justify-center text-[9px] sm:text-[10px]">
                  {lvl.id}
                </span>
              )}
              <span>{isEn ? `M${lvl.id}` : `N${lvl.id}`}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Circuit Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 w-full">
        {/* Left: Circuit Board & Simulation (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4 w-full">
          <div className="bg-stone-900 border-2 border-stone-700 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between w-full">
            {/* Voxel Grid Background Pattern */}
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none" 
              style={{
                backgroundImage: `radial-gradient(#e11d48 1px, transparent 1px), radial-gradient(#d97706 1px, #1c1917 1px)`,
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px'
              }}
            />

            {/* Mission Objective Header inside canvas */}
            <div className="relative z-10 bg-stone-950/80 border border-stone-800 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-start gap-2.5 sm:gap-3 backdrop-blur-sm">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-wider">
                  {isEn ? 'Mission Goal' : 'Obiectivul Circuitului'}
                </div>
                <p className="text-xs sm:text-sm font-semibold text-white mt-0.5 leading-relaxed break-words">
                  {isEn ? level.goalEn : level.goalRo}
                </p>
              </div>
            </div>

            {/* Visual Redstone Circuit Representation */}
            <div className="relative z-10 my-5 sm:my-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 sm:gap-6 px-1 sm:px-4 w-full">
              {/* Inputs Column (Levers / Switches) */}
              <div className="flex flex-col gap-2.5 sm:gap-4 w-full md:w-auto flex-1">
                <div className="text-[11px] sm:text-xs font-mono text-stone-400 uppercase tracking-wider font-bold mb-0.5 sm:mb-1 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isEn ? 'Input Levers' : 'Pârghii de Intrare'}</span>
                </div>

                {level.inputs.map((inp, idx) => {
                  const isActive = levelInputs[idx];
                  return (
                    <div
                      key={inp.id}
                      onClick={() => toggleInput(idx)}
                      className={`p-2.5 sm:p-3.5 md:p-4 rounded-xl sm:rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2.5 sm:gap-4 shadow-lg active:scale-98 w-full ${
                        isActive
                          ? 'bg-gradient-to-r from-rose-950/90 to-stone-900 border-rose-500 shadow-rose-600/20'
                          : 'bg-stone-950/80 border-stone-700 hover:border-stone-500'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold border shrink-0 ${
                          isActive 
                            ? 'bg-rose-600 border-rose-400 text-white shadow-md shadow-rose-600/50' 
                            : 'bg-stone-800 border-stone-700 text-stone-400'
                        }`}>
                          {isActive ? '⚡' : '🔘'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-white text-xs sm:text-sm truncate">
                            {inp.label}
                          </div>
                          <div className={`text-[9px] sm:text-[10px] font-mono font-bold ${
                            isActive ? 'text-rose-400' : 'text-stone-500'
                          }`}>
                            {isActive ? (isEn ? 'SIGNAL: 1 (ON)' : 'SEMNAL: 1 (ACTIV)') : (isEn ? 'SIGNAL: 0 (OFF)' : 'SEMNAL: 0 (OPRIT)')}
                          </div>
                        </div>
                      </div>

                      {/* Minecraft Style Toggle Switch Visual */}
                      <div className={`w-10 sm:w-12 h-5 sm:h-6 rounded-full p-0.5 sm:p-1 transition-colors shrink-0 ${
                        isActive ? 'bg-rose-600' : 'bg-stone-800'
                      }`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                          isActive ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0'
                        }`} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Center: Logic Gate Block / Mechanism */}
              <div className="flex flex-col items-center justify-center my-1 sm:my-2 shrink-0">
                {/* Flowing Wire from inputs to Gate */}
                <div className={`px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl border-2 shadow-2xl flex flex-col items-center gap-1.5 sm:gap-2 relative ${
                  isOutputActive
                    ? 'bg-gradient-to-b from-stone-900 via-rose-950 to-stone-900 border-rose-500 shadow-rose-600/30 ring-2 ring-rose-500/20'
                    : 'bg-stone-950 border-stone-700'
                }`}>
                  <div className="text-[9px] sm:text-[10px] font-mono uppercase font-bold text-stone-400">
                    {level.gateType} GATE
                  </div>
                  
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl border-2 transition-all ${
                    isOutputActive 
                      ? 'bg-rose-600/20 border-rose-500 text-rose-400 shadow-lg shadow-rose-600/40 animate-pulse'
                      : 'bg-stone-800/40 border-stone-700 text-stone-500'
                  }`}>
                    {level.gateType === 'NOT' && '🪓'}
                    {level.gateType === 'AND' && '🔒'}
                    {level.gateType === 'OR' && '🌉'}
                    {level.gateType === 'XOR' && '💡'}
                    {level.gateType === 'BINARY_DECODER' && '🔢'}
                    {level.gateType === 'NAND' && '💣'}
                    {level.gateType === 'CLOCK' && '⏱️'}
                    {level.gateType === 'HALF_ADDER' && '➕'}
                    {level.gateType === 'MASTER_VAULT' && '👑'}
                    {level.gateType === 'DIRECT' && '⚡'}
                  </div>

                  <span className={`text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    isOutputActive 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-stone-800 text-stone-400'
                  }`}>
                    {isOutputActive ? 'POW: 15' : 'POW: 0'}
                  </span>
                </div>
              </div>

              {/* Right: Output Device (Lamp / Iron Door / Chest / Piston) */}
              <div className="flex flex-col items-center w-full md:w-44 lg:w-48 shrink-0">
                <div className="text-[11px] sm:text-xs font-mono text-stone-400 uppercase tracking-wider font-bold mb-1.5 sm:mb-2 flex items-center gap-1.5">
                  <Unlock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isEn ? 'Output Mechanism' : 'Mecanism Ieșire'}</span>
                </div>

                <div className={`w-full p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border-2 flex flex-col items-center justify-center text-center transition-all duration-300 shadow-xl ${
                  isOutputActive
                    ? 'bg-gradient-to-b from-emerald-950/80 to-stone-900 border-emerald-500 shadow-emerald-600/30'
                    : 'bg-stone-950/90 border-stone-800'
                }`}>
                  <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center text-3xl sm:text-4xl mb-2 sm:mb-3 border-2 transition-all ${
                    isOutputActive
                      ? 'bg-emerald-500/20 border-emerald-400 shadow-lg shadow-emerald-500/40 scale-105'
                      : 'bg-stone-900 border-stone-700 text-stone-600'
                  }`}>
                    {level.gateType === 'DIRECT' && (isOutputActive ? '💡' : '⚫')}
                    {level.gateType === 'NOT' && (isOutputActive ? '🚪' : '🔒')}
                    {level.gateType === 'AND' && (isOutputActive ? '💎' : '🔐')}
                    {level.gateType === 'OR' && (isOutputActive ? '🌉' : '🌋')}
                    {level.gateType === 'XOR' && (isOutputActive ? '🏮' : '🕯️')}
                    {level.gateType === 'BINARY_DECODER' && (isOutputActive ? '🎁' : '🔒')}
                    {level.gateType === 'NAND' && (isOutputActive ? '🛡️' : '💥')}
                    {level.gateType === 'CLOCK' && (isOutputActive ? '🧱' : '⬛')}
                    {level.gateType === 'HALF_ADDER' && (isOutputActive ? '🧮' : '⚙️')}
                    {level.gateType === 'MASTER_VAULT' && (isOutputActive ? '🏆' : '🗝️')}
                  </div>

                  <div className="font-black text-white text-xs sm:text-sm">
                    {isOutputActive ? (isEn ? 'ACTIVATED!' : 'DEBLOCAT!') : (isEn ? 'LOCKED / OFF' : 'BLOCAT / STINS')}
                  </div>
                  <div className={`text-[10px] sm:text-[11px] font-mono mt-0.5 font-bold ${
                    isOutputActive ? 'text-emerald-400' : 'text-stone-500'
                  }`}>
                    {isOutputActive ? 'OUTPUT: 1' : 'OUTPUT: 0'}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status & Success Banner */}
            {isLevelSolved ? (
              <div className="relative z-10 mt-3 sm:mt-4 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-950/90 via-stone-900 to-emerald-950/90 border-2 border-emerald-500/80 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 text-lg sm:text-xl">
                    💎
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 flex-wrap">
                      <span>{isEn ? 'Circuit Solved!' : 'Circuit Rezolvat cu Succes!'}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                        +{level.rewardDiamonds} 💎 | +{level.xpPoints} XP
                      </span>
                    </h4>
                    <p className="text-[11px] sm:text-xs text-stone-300 break-words">
                      {isEn 
                        ? 'Great job engineer! The redstone logic condition was successfully met.' 
                        : 'Excelent! Condiția logică Redstone a fost îndeplinită impecabil.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleNextLevel}
                  disabled={currentLevelIndex >= REDSTONE_LEVELS.length - 1}
                  className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer disabled:opacity-50 shrink-0 active:scale-95"
                >
                  <span>{isEn ? 'Next Level' : 'Nivelul Următor'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative z-10 mt-3 sm:mt-4 flex items-center justify-between gap-2 text-xs font-mono text-stone-400 flex-wrap">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => setShowTruthTableModal(true)}
                    className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 hover:text-white border border-stone-700 transition flex items-center gap-1.5 cursor-pointer text-[11px] sm:text-xs"
                  >
                    <Info className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isEn ? 'Truth Table' : 'Tabel Adevăr'}</span>
                  </button>

                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-500/30 transition flex items-center gap-1.5 cursor-pointer text-[11px] sm:text-xs"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isEn ? 'Hint' : 'Indiciu'}</span>
                  </button>
                </div>

                <button
                  onClick={handleResetCurrentLevel}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 hover:text-white border border-stone-700 transition flex items-center gap-1.5 cursor-pointer text-[11px] sm:text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Reset' : 'Resetează'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Educational Concept & Truth Table Panel (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4 w-full">
          {/* Concept Explanation Card */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col gap-3 sm:gap-4 w-full">
            <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-bold uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>{isEn ? 'Logic Gate Principle' : 'Principiul Porții Logice'}</span>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-stone-950 border border-stone-800 text-xs text-stone-300 leading-relaxed break-words">
              {isEn ? level.conceptEn : level.conceptRo}
            </div>

            {/* Hint Box if toggled */}
            {showHint && (
              <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-amber-950/50 border border-amber-500/40 text-amber-200 text-xs leading-relaxed animate-fadeIn flex items-start gap-2 break-words">
                <span className="text-base shrink-0">💡</span>
                <div>
                  <strong className="block text-amber-300 font-bold mb-0.5">{isEn ? 'Teacher Tip:' : 'Sfatul Profesorului:'}</strong>
                  {isEn ? level.hintEn : level.hintRo}
                </div>
              </div>
            )}

            {/* Compact Live Truth Table */}
            <div className="w-full">
              <div className="text-xs font-mono text-stone-400 font-bold uppercase mb-2 flex items-center justify-between">
                <span>{isEn ? 'Live Truth Table' : 'Tabel de Adevăr Live'}</span>
                <span className="text-[10px] text-stone-500">{level.gateType}</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-stone-800 bg-stone-950 text-xs font-mono w-full">
                <table className="w-full text-left">
                  <thead className="bg-stone-900 border-b border-stone-800 text-stone-400 text-[10px]">
                    <tr>
                      {level.inputs.map((inp) => (
                        <th key={inp.id} className="p-2 text-center">{inp.id}</th>
                      ))}
                      <th className="p-2 text-right">{isEn ? 'Output' : 'Ieșire'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-850">
                    {level.truthTable.map((row, rIdx) => {
                      // Check if current user inputs match this row
                      const isCurrentState = row.inputs.every((val, vIdx) => val === levelInputs[vIdx]);

                      return (
                        <tr 
                          key={rIdx} 
                          className={`transition-colors ${
                            isCurrentState 
                              ? 'bg-rose-950/60 font-bold text-rose-300 ring-1 ring-rose-500/50' 
                              : 'text-stone-400'
                          }`}
                        >
                          {row.inputs.map((val, vIdx) => (
                            <td key={vIdx} className="p-2 text-center">
                              {val ? '1' : '0'}
                            </td>
                          ))}
                          <td className="p-2 text-right">
                            <span className={`px-2 py-0.5 rounded ${
                              row.output 
                                ? 'bg-emerald-500/20 text-emerald-300 font-bold' 
                                : 'bg-stone-800 text-stone-500'
                            }`}>
                              {row.output ? '1' : '0'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Minecraft Rewards Banner */}
          <div className="bg-gradient-to-br from-cyan-950/60 to-stone-900 border border-cyan-500/30 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xl flex items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <span className="text-2xl sm:text-3xl shrink-0">⛏️</span>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white uppercase font-mono truncate">
                  {isEn ? 'Redstone Engineer Badge' : 'Insignă Inginer Redstone'}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-stone-400 mt-0.5">
                  {completedLevels.length} / {REDSTONE_LEVELS.length} {isEn ? 'Completed' : 'Misiuni Gata'}
                </p>
              </div>
            </div>

            <div className="text-right font-mono text-cyan-300 font-bold text-xs sm:text-sm shrink-0">
              {Math.round((completedLevels.length / REDSTONE_LEVELS.length) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Truth Table Full Modal */}
      {showTruthTableModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-stone-900 border-2 border-stone-700 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
            <h3 className="text-base sm:text-lg font-black text-white font-heading mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 shrink-0" />
              <span className="break-words">{isEn ? `Truth Table Guide: ${level.gateType}` : `Tabel de Adevăr & Logică: ${level.gateType}`}</span>
            </h3>

            <p className="text-xs text-stone-300 mb-3 sm:mb-4 leading-relaxed break-words">
              {isEn ? level.conceptEn : level.conceptRo}
            </p>

            <div className="overflow-x-auto rounded-xl sm:rounded-2xl border border-stone-800 bg-stone-950 text-xs font-mono mb-4 w-full">
              <table className="w-full text-left">
                <thead className="bg-stone-850 border-b border-stone-800 text-stone-400 text-[10px] sm:text-[11px]">
                  <tr>
                    {level.inputs.map((inp) => (
                      <th key={inp.id} className="p-2 sm:p-3 text-center">{inp.label} ({inp.id})</th>
                    ))}
                    <th className="p-2 sm:p-3 text-right">{isEn ? 'Result' : 'Rezultat'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-850">
                  {level.truthTable.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-stone-900/50">
                      {row.inputs.map((val, vIdx) => (
                        <td key={vIdx} className="p-2 sm:p-3 text-center text-stone-200">
                          {val ? '1 (ON)' : '0 (OFF)'}
                        </td>
                      ))}
                      <td className="p-2 sm:p-3 text-right font-bold text-emerald-400">
                        {row.output ? '1 (DESCHIS)' : '0 (BLOCAT)'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowTruthTableModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-white font-bold text-xs transition cursor-pointer active:scale-95"
              >
                {isEn ? 'Close Guide' : 'Închide Ghidul'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
