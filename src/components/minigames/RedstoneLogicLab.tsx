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
  Lock,
  Volume2,
  VolumeX,
  Boxes,
  Check,
  AlertTriangle,
  Eye,
  ArrowRight,
  Gauge,
  Wrench,
  RefreshCw,
  Key
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { updateStudentArcadeScore } from '../../lib/studentAuthService';

interface RedstoneLogicLabProps {
  onBack: () => void;
  onGameComplete?: (score: number) => void;
}

export type GateType = 
  | 'INTERLOCK_NOT' 
  | 'AND_3WAY' 
  | 'OR_AND_COMBINED' 
  | 'XOR_PARITY' 
  | 'BINARY_DECODER_4BIT' 
  | 'REPEATER_SYNC' 
  | 'NAND_SECURITY' 
  | 'RS_NOR_LATCH' 
  | 'HALF_ADDER' 
  | 'MUX_2TO1' 
  | 'MASTER_VAULT' 
  | 'CPU_DECODER';

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
  gateType: GateType;
  inputs: Array<{ id: string; labelRo: string; labelEn: string; defaultState: boolean; isPulseButton?: boolean }>;
  hasRepeater?: boolean;
  targetRepeaterDelay?: number; // 1, 2, 3, or 4 ticks
  isDualOutput?: boolean;
  output1LabelRo: string;
  output1LabelEn: string;
  output2LabelRo?: string;
  output2LabelEn?: string;
  targetCondition: (inputs: boolean[], repeaterTicks: number, memoryBit: boolean) => boolean;
  truthTable: Array<{ inputs: boolean[]; output1: boolean; output2?: boolean; label?: string }>;
  rewardDiamonds: number;
  xpPoints: number;
}

export const REDSTONE_LEVELS: RedstoneLevel[] = [
  {
    id: 1,
    titleRo: 'Misiunea 1: Circuitul de Siguranță & Invertorul (Torța NOT)',
    titleEn: 'Mission 1: Safety Interlock & NOT Inverter Torch',
    subtitleRo: 'Sincronizarea Semnalului cu Negare Logică',
    subtitleEn: 'Signal Synchronization with Logic Inversion',
    goalRo: 'Pistonul de piatră se activează doar dacă Alimentarea Principală este 1 ȘI Sistemul de Blocare (Inhibitor) este 0 (trecut prin torța de negare NOT).',
    goalEn: 'The stone piston activates only if Main Power is 1 AND the Safety Lock (Inhibitor) is 0 (routed via the NOT inversion torch).',
    conceptRo: 'Poarta NOT inversează semnalul de intrare: 0 devine 1, iar 1 devine 0. Combinată cu alimentarea (A AND NOT B), creează un sistem de siguranță industrial.',
    conceptEn: 'A NOT gate inverts the input signal: 0 becomes 1, and 1 becomes 0. Combined with main power (A AND NOT B), it forms an industrial safety interlock.',
    hintRo: 'Pornește Pârghia Principală (ON) și lasă Pârghia de Blocare pe (OFF) pentru ca torța NOT să transmită 1.',
    hintEn: 'Set Main Power to ON and leave Safety Lock at OFF so the NOT torch outputs 1.',
    gateType: 'INTERLOCK_NOT',
    inputs: [
      { id: 'A', labelRo: 'Pârghie Principală (Power)', labelEn: 'Main Power Lever', defaultState: false },
      { id: 'B', labelRo: 'Pârghie Blocare (Inhibitor)', labelEn: 'Safety Lock Lever', defaultState: true }
    ],
    output1LabelRo: 'Piston de Piatră',
    output1LabelEn: 'Stone Piston',
    targetCondition: (inputs) => inputs[0] === true && inputs[1] === false,
    truthTable: [
      { inputs: [false, false], output1: false, label: 'Fără curent' },
      { inputs: [false, true], output1: false, label: 'Blocat' },
      { inputs: [true, false], output1: true, label: 'DEBLOCAT (A=1, B=0) ⭐' },
      { inputs: [true, true], output1: false, label: 'Inhibat de siguranță' }
    ],
    rewardDiamonds: 2,
    xpPoints: 80
  },
  {
    id: 2,
    titleRo: 'Misiunea 2: Seiful de Diamante (Poarta AND cu 3 Chei)',
    titleEn: 'Mission 2: Diamond Vault (3-Way AND Gate)',
    subtitleRo: 'Autorizare Multiplă de Securitate',
    subtitleEn: 'Multi-Key Security Protocol',
    goalRo: 'Ușa masivă de fier a seifului de diamante cere validarea simultană a tuturor celor 3 chei de acces (Pârghiile Alfa, Beta și Gama pe poziția 1).',
    goalEn: 'The massive iron door of the diamond vault requires simultaneous activation of all 3 security keys (Levers Alpha, Beta, and Gamma at 1).',
    conceptRo: 'Poarta AND (ȘI) cu mai multe intrări generează ieșire 1 DOAR dacă TOATE intrările sunt 1: Ieșire = A · B · C.',
    conceptEn: 'A multi-input AND gate generates output 1 ONLY when ALL inputs are 1: Output = A · B · C.',
    hintRo: 'Comută toate cele trei pârghii în poziția ON (1).',
    hintEn: 'Toggle all three levers into the ON (1) position.',
    gateType: 'AND_3WAY',
    inputs: [
      { id: 'A', labelRo: 'Cheia Alfa (Pârghie 1)', labelEn: 'Key Alpha (Lever 1)', defaultState: false },
      { id: 'B', labelRo: 'Cheia Beta (Pârghie 2)', labelEn: 'Key Beta (Lever 2)', defaultState: false },
      { id: 'C', labelRo: 'Cheia Gama (Pârghie 3)', labelEn: 'Key Gamma (Lever 3)', defaultState: false }
    ],
    output1LabelRo: 'Ușă Masivă de Fier',
    output1LabelEn: 'Heavy Iron Door',
    targetCondition: (inputs) => inputs[0] && inputs[1] && inputs[2],
    truthTable: [
      { inputs: [false, false, false], output1: false },
      { inputs: [true, false, false], output1: false },
      { inputs: [true, true, false], output1: false },
      { inputs: [true, true, true], output1: true, label: '3 Chei Active ⭐' }
    ],
    rewardDiamonds: 2,
    xpPoints: 90
  },
  {
    id: 3,
    titleRo: 'Misiunea 3: Podul Peste Lacul de Lavă (Combinată OR-AND)',
    titleEn: 'Mission 3: Lava Bridge (Combined OR-AND)',
    subtitleRo: 'Consolă Dublă cu Pârghie Generală de Urgență',
    subtitleEn: 'Dual Station with Master Power Switch',
    goalRo: 'Podul de piatră peste lavă se extinde dacă apeși oricare dintre cele 2 console (Mal Nord SAU Mal Sud), DAR numai dacă Pârghia Generală este ON!',
    goalEn: 'The stone bridge extends if either station (North OR South) is active, BUT only if Master Power is ON!',
    conceptRo: 'Logică combinată: (A OR B) AND C. Semnalul de la console trece printr-o joncțiune OR, apoi e validat de autorizarea AND.',
    conceptEn: 'Combinational logic: (A OR B) AND C. Station signals pass through an OR junction, validated by master power AND.',
    hintRo: 'Asigură-te că Pârghia Generală este ON (1) și cel puțin o consolă de mal este activată.',
    hintEn: 'Ensure Master Power is ON (1) and at least one riverbank station is activated.',
    gateType: 'OR_AND_COMBINED',
    inputs: [
      { id: 'A', labelRo: 'Consola Nord (Mal A)', labelEn: 'North Console (Bank A)', defaultState: false },
      { id: 'B', labelRo: 'Consola Sud (Mal B)', labelEn: 'South Console (Bank B)', defaultState: false },
      { id: 'C', labelRo: 'Pârghia Generală (Master)', labelEn: 'Master Power Switch', defaultState: false }
    ],
    output1LabelRo: 'Podul peste Lavă',
    output1LabelEn: 'Lava Bridge Pistons',
    targetCondition: (inputs) => (inputs[0] || inputs[1]) && inputs[2],
    truthTable: [
      { inputs: [false, false, true], output1: false, label: 'Nicio consolă' },
      { inputs: [true, false, false], output1: false, label: 'Fără curent general' },
      { inputs: [true, false, true], output1: true, label: 'Valid: Nord + Master ⭐' },
      { inputs: [false, true, true], output1: true, label: 'Valid: Sud + Master ⭐' }
    ],
    rewardDiamonds: 3,
    xpPoints: 100
  },
  {
    id: 4,
    titleRo: 'Misiunea 4: Comutatorul Cap-Scară Dual (Poarta XOR Dublă)',
    titleEn: 'Mission 4: 3-Way Staircase Switch (Dual XOR Parity)',
    subtitleRo: 'Controlul Iluminatului din Trei Puncte ale Minei',
    subtitleEn: 'Mine Lighting Control from Three Shafts',
    goalRo: 'Lampa din galeria minei este controlată din 3 puncte (Suprafață, Etajul 1, Galeria de Diamante): (A XOR B) XOR C. Lampa se aprinde doar pe paritate impară!',
    goalEn: 'The mine gallery lamp is controlled from 3 stations: (A XOR B) XOR C. The lamp lights up only when an ODD number of switches is ON (1 or 3)!',
    conceptRo: 'Poarta XOR calculează paritatea binară: ieșirea este 1 dacă numărul de intrări active este IMPAR (1 sau 3). Folosită în circuitele de iluminat cap-scară și verificare CRC.',
    conceptEn: 'The XOR gate computes binary parity: output is 1 if an ODD number of inputs is high. Used in multi-way stair switches and CRC checksums.',
    hintRo: 'Configurează fie exact o singură pârghie pe ON, fie toate cele trei pârghii pe ON!',
    hintEn: 'Set either exactly one lever to ON, or all three levers to ON!',
    gateType: 'XOR_PARITY',
    inputs: [
      { id: 'A', labelRo: 'Comutator Suprafață', labelEn: 'Surface Switch', defaultState: false },
      { id: 'B', labelRo: 'Comutator Etajul 1', labelEn: 'Shaft 1 Switch', defaultState: false },
      { id: 'C', labelRo: 'Comutator Galeria Diamante', labelEn: 'Diamond Gallery Switch', defaultState: false }
    ],
    output1LabelRo: 'Lampa Centrală a Minei',
    output1LabelEn: 'Central Mine Lamp',
    targetCondition: (inputs) => {
      const activeCount = inputs.filter(Boolean).length;
      return activeCount % 2 === 1;
    },
    truthTable: [
      { inputs: [false, false, false], output1: false, label: '0 active (Par)' },
      { inputs: [true, false, false], output1: true, label: '1 activ (Impar) ⭐' },
      { inputs: [true, true, false], output1: false, label: '2 active (Par)' },
      { inputs: [true, true, true], output1: true, label: '3 active (Impar) ⭐' }
    ],
    rewardDiamonds: 3,
    xpPoints: 110
  },
  {
    id: 5,
    titleRo: 'Misiunea 5: Decodorul Binar al Seifului Netherite (4 Biți - Codul: 11)',
    titleEn: 'Mission 5: 4-Bit Binary Vault Decoder (Secret Code: 11)',
    subtitleRo: 'Ponderile Puterilor lui 2: 8, 4, 2, 1',
    subtitleEn: 'Powers of 2 Binary Weights: 8, 4, 2, 1',
    goalRo: 'Seiful de Netherite este criptat cu codul zecimal 11. Configurează pârghiile pe reprezentarea binară corectă (8 + 2 + 1 = 1011₂)!',
    goalEn: 'The Netherite vault is locked with decimal PIN 11. Configure the 4 levers to the exact binary sequence (8 + 2 + 1 = 1011₂)!',
    conceptRo: 'În binar pe 4 biți: Bit 8 (2³) + Bit 4 (2²) + Bit 2 (2¹) + Bit 1 (2⁰). Pentru numărul 11: 8 + 0 + 2 + 1 ➡️ 1 0 1 1₂.',
    conceptEn: 'In 4-bit binary: Bit 8 (2³) + Bit 4 (2²) + Bit 2 (2¹) + Bit 1 (2⁰). For 11: 8 + 0 + 2 + 1 ➡️ 1 0 1 1₂.',
    hintRo: 'Comută B8=ON, B4=OFF, B2=ON, B1=ON.',
    hintEn: 'Set B8=ON, B4=OFF, B2=ON, B1=ON.',
    gateType: 'BINARY_DECODER_4BIT',
    inputs: [
      { id: 'B8', labelRo: 'Bit 8 (Pondere 2³ = 8)', labelEn: 'Bit 8 (Weight 8)', defaultState: false },
      { id: 'B4', labelRo: 'Bit 4 (Pondere 2² = 4)', labelEn: 'Bit 4 (Weight 4)', defaultState: false },
      { id: 'B2', labelRo: 'Bit 2 (Pondere 2¹ = 2)', labelEn: 'Bit 2 (Weight 2)', defaultState: false },
      { id: 'B1', labelRo: 'Bit 1 (Pondere 2⁰ = 1)', labelEn: 'Bit 1 (Weight 1)', defaultState: false }
    ],
    output1LabelRo: 'Seiful Netherite',
    output1LabelEn: 'Netherite Vault',
    targetCondition: (inputs) => inputs[0] === true && inputs[1] === false && inputs[2] === true && inputs[3] === true,
    truthTable: [
      { inputs: [false, false, false, false], output1: false, label: '0000₂ = 0' },
      { inputs: [true, false, false, false], output1: false, label: '1000₂ = 8' },
      { inputs: [true, false, true, false], output1: false, label: '1010₂ = 10' },
      { inputs: [true, false, true, true], output1: true, label: '1011₂ = 11 ⭐' }
    ],
    rewardDiamonds: 3,
    xpPoints: 120
  },
  {
    id: 6,
    titleRo: 'Misiunea 6: Repetitorul Redstone & Sincronizarea Pistoanelor',
    titleEn: 'Mission 6: Redstone Repeater Delay Synchronization',
    subtitleRo: 'Reglarea Ticks-urilor de Întârziere (1t - 4t)',
    subtitleEn: 'Calibrating Signal Delay Ticks (1t - 4t)',
    goalRo: 'Mecanismul pistonului dublu necesită sincronizare: alimentează semnalul de intrare ȘI ajustează Repetitorul de Redstone exact la 3 Ticks (0.3s) pentru a deschide trapa.',
    goalEn: 'The double piston mechanism requires timing: engage input power AND adjust the Redstone Repeater to exactly 3 Ticks (0.3s) to open the trapdoor.',
    conceptRo: 'Repetitorul de Redstone îndeplinește două roluri fundamentale: amplifică puterea semnalului la 15 și introduce o întârziere programabilă (1-4 tick-uri de joc).',
    conceptEn: 'The Redstone Repeater boosts signal strength to 15 blocks and provides an adjustable delay (1 to 4 game ticks).',
    hintRo: 'Comută pârghia pe ON și apasă pe blocul de Repetitor până ajunge pe treapta de 3 Ticks!',
    hintEn: 'Turn the lever ON and click the Repeater block until it reaches 3 Ticks delay!',
    gateType: 'REPEATER_SYNC',
    hasRepeater: true,
    targetRepeaterDelay: 3,
    inputs: [
      { id: 'PWR', labelRo: 'Pârghie Sursă Curent', labelEn: 'Power Source Lever', defaultState: false },
      { id: 'CLK', labelRo: 'Linie de Sincronizare', labelEn: 'Sync Line Trigger', defaultState: true }
    ],
    output1LabelRo: 'Trapa cu Pistoane Sincronizate',
    output1LabelEn: 'Synchronized Piston Trapdoor',
    targetCondition: (inputs, repeaterTicks) => inputs[0] === true && inputs[1] === true && repeaterTicks === 3,
    truthTable: [
      { inputs: [false, true], output1: false, label: 'Fără curent' },
      { inputs: [true, true], output1: true, label: 'Curent + 3 Ticks Delay ⭐' }
    ],
    rewardDiamonds: 4,
    xpPoints: 130
  },
  {
    id: 7,
    titleRo: 'Misiunea 7: Alarma Anti-Griefing (Poarta Universală NAND)',
    titleEn: 'Mission 7: Anti-Griefing Security (Universal NAND Gate)',
    subtitleRo: 'Dezactivarea Capcanei cu TNT prin Senzori',
    subtitleEn: 'Disarming TNT Traps with Laser Tripwires',
    goalRo: 'Capcana cu TNT este stabilizată în siguranță (Ieșire = 1). Ea detonează DOAR dacă toți cei 3 senzori sunt tăiați simultan (A=1, B=1, C=1). Păstrează capcana dezamorsată!',
    goalEn: 'The TNT trap is safely disarmed (Output = 1). It detonates ONLY if all 3 laser sensors are tripped simultaneously (A=1, B=1, C=1). Keep the system disarmed!',
    conceptRo: 'Poarta NAND (NOT-AND) este o poartă universală. Ieșirea este 1 în TOATE combinațiile posibile, MAI PUȚIN când toate intrările sunt 1 simultan.',
    conceptEn: 'The NAND gate is a universal logic gate. The output is 1 in all states EXCEPT when all inputs are 1.',
    hintRo: 'Asigură-te că cel puțin un senzor este lăsat pe 0 (nu activa toți cei 3 senzori).',
    hintEn: 'Ensure at least one sensor remains at 0 (do not engage all 3 simultaneously).',
    gateType: 'NAND_SECURITY',
    inputs: [
      { id: 'S1', labelRo: 'Senzor Tripwire A', labelEn: 'Tripwire Sensor A', defaultState: true },
      { id: 'S2', labelRo: 'Senzor Tripwire B', labelEn: 'Tripwire Sensor B', defaultState: true },
      { id: 'S3', labelRo: 'Senzor Tripwire C', labelEn: 'Tripwire Sensor C', defaultState: true }
    ],
    output1LabelRo: 'Modul de Siguranță TNT',
    output1LabelEn: 'TNT Safety Interlock',
    targetCondition: (inputs) => !(inputs[0] && inputs[1] && inputs[2]),
    truthTable: [
      { inputs: [false, false, false], output1: true, label: 'Sigur (Output: 1)' },
      { inputs: [true, true, false], output1: true, label: 'Sigur (Output: 1) ⭐' },
      { inputs: [true, true, true], output1: false, label: 'DETONARE! (Output: 0)' }
    ],
    rewardDiamonds: 4,
    xpPoints: 140
  },
  {
    id: 8,
    titleRo: 'Misiunea 8: Celula de Memorie 1-Bit (RS-NOR Latch RAM)',
    titleEn: 'Mission 8: 1-Bit Memory Cell (RS-NOR Latch RAM)',
    subtitleRo: 'Păstrarea Stării de 1 cu Torțe Cross-Cuplate',
    subtitleEn: 'Cross-Coupled Torches Storing Bit 1',
    goalRo: 'Construiește un bit de memorie RAM: Apasă butonul SET pentru a memora 1 (Lampa Q se aprinde). Chiar dacă oprești SET, memoria rămâne 1! Apoi testează ștergerea cu RESET.',
    goalEn: 'Build a RAM memory bit: Pulse the SET button to store 1 (Lamp Q turns ON). Even if SET is turned off, memory retains 1! Then reset it with RESET.',
    conceptRo: 'Celula de memorie RS-NOR Latch folosește două porți NOR interconectate. Are stări stabile și reține informația binară fără semnal permanent pe intrare!',
    conceptEn: 'An RS-NOR Latch uses cross-coupled NOR gates to create bistable feedback, storing a binary bit without needing continuous input power!',
    hintRo: 'Activează comutatorul SET pe ON (1), observă că Lampa Q se aprinde, apoi poți reveni la OFF (memoria ține minte starea 1)!',
    hintEn: 'Flip SET to ON (1), observe Lamp Q light up, then you can return to OFF (memory bit stays 1)!',
    gateType: 'RS_NOR_LATCH',
    isDualOutput: true,
    output1LabelRo: 'Ieșire Memorie Q',
    output1LabelEn: 'Memory Output Q',
    output2LabelRo: 'Ieșire Inversată Q̅',
    output2LabelEn: 'Inverted Output Q̅',
    inputs: [
      { id: 'SET', labelRo: 'Comandă SET (Înscrie 1)', labelEn: 'SET Command (Write 1)', defaultState: false },
      { id: 'RST', labelRo: 'Comandă RESET (Șterge la 0)', labelEn: 'RESET Command (Clear 0)', defaultState: false }
    ],
    targetCondition: (inputs, _ticks, memoryBit) => {
      // Memory bit must be set to true and reset not held
      return memoryBit === true && inputs[1] === false;
    },
    truthTable: [
      { inputs: [true, false], output1: true, output2: false, label: 'SET: Înscrie Q=1 ⭐' },
      { inputs: [false, false], output1: true, output2: false, label: 'MEMORIE PĂSTRATĂ (Q=1) ⭐' },
      { inputs: [false, true], output1: false, output2: true, label: 'RESET: Șterge Q=0' }
    ],
    rewardDiamonds: 4,
    xpPoints: 150
  },
  {
    id: 9,
    titleRo: 'Misiunea 9: Sumatorul Binar Half-Adder (ALU: Sumă & Transport)',
    titleEn: 'Mission 9: Half-Adder Arithmetic Unit (ALU: Sum & Carry)',
    subtitleRo: 'Cum Calculează Microprocesorul: 1 + 1 = 10₂',
    subtitleEn: 'How CPU Calculates Addition: 1 + 1 = 10₂',
    goalRo: 'Verifică adunarea binară: activează Operand A=1 și Operand B=1 pentru a obține Suma S=0 (prin XOR) și Transportul Carry C=1 (prin AND) ➡️ 10₂ (2 zecimal)!',
    goalEn: 'Verify binary addition: engage Operand A=1 and Operand B=1 to produce Sum S=0 (via XOR) and Carry C=1 (via AND) ➡️ 10₂ (decimal 2)!',
    conceptRo: 'Half-Adder-ul este nucleul unității aritmetico-logice (ALU): folosește o poartă XOR pentru Sumă (S = A ⊕ B) și o poartă AND pentru Transport / Carry (C = A · B).',
    conceptEn: 'A Half-Adder is the fundamental core of an ALU: it uses an XOR gate for Sum (S = A ⊕ B) and an AND gate for Carry (C = A · B).',
    hintRo: 'Comută ambele intrări A și B pe ON (1). Lampa Transport (Carry) se va aprinde, iar Lampa Sumă se va stinge!',
    hintEn: 'Set both inputs A and B to ON (1). The Carry lamp will ignite, and the Sum lamp will turn off!',
    gateType: 'HALF_ADDER',
    isDualOutput: true,
    output1LabelRo: 'Lampa Transport (Carry C)',
    output1LabelEn: 'Carry Lamp (C)',
    output2LabelRo: 'Lampa Sumă (Sum S)',
    output2LabelEn: 'Sum Lamp (S)',
    inputs: [
      { id: 'A', labelRo: 'Operand A (Bit 1)', labelEn: 'Operand A (Bit 1)', defaultState: false },
      { id: 'B', labelRo: 'Operand B (Bit 1)', labelEn: 'Operand B (Bit 1)', defaultState: false }
    ],
    targetCondition: (inputs) => inputs[0] === true && inputs[1] === true,
    truthTable: [
      { inputs: [false, false], output1: false, output2: false, label: '0 + 0 = S:0, C:0' },
      { inputs: [true, false], output1: false, output2: true, label: '1 + 0 = S:1, C:0' },
      { inputs: [false, true], output1: false, output2: true, label: '0 + 1 = S:1, C:0' },
      { inputs: [true, true], output1: true, output2: false, label: '1 + 1 = 10₂ (S:0, C:1) ⭐' }
    ],
    rewardDiamonds: 5,
    xpPoints: 160
  },
  {
    id: 10,
    titleRo: 'Misiunea 10: Multiplexorul Redstone MUX 2:1 (Rutare Date TIC)',
    titleEn: 'Mission 10: Redstone Multiplexer MUX 2:1 (Data Routing)',
    subtitleRo: 'Selectarea Canalului de Transmisie',
    subtitleEn: 'Transmission Channel Selector',
    goalRo: 'Rutează pachetul de date: comută Selectorul S pe 1 pentru a transmite Canalul B către Serverul Central (Ieșire = Date B = 1).',
    goalEn: 'Route the telemetry packet: toggle Selector S to 1 to transmit Channel B to the Central Server (Output = Data B = 1).',
    conceptRo: 'Multiplexorul (MUX 2:1) acționează ca un macaz electronic: dacă S=0 transmite Date A, dacă S=1 transmite Date B. Formulă: Y = (NOT S · A) + (S · B).',
    conceptEn: 'A 2:1 Multiplexer acts as an electronic data switch: if S=0 it forwards Data A, if S=1 it forwards Data B. Equation: Y = (NOT S · A) + (S · B).',
    hintRo: 'Pune Pârghia de Selecție S pe 1 (ON) și asigură-te că Pârghia Date B este 1 (ON).',
    hintEn: 'Set Selection Lever S to 1 (ON) and verify Data B lever is 1 (ON).',
    gateType: 'MUX_2TO1',
    inputs: [
      { id: 'SEL', labelRo: 'Pârghie Selecție (S)', labelEn: 'Selector Switch (S)', defaultState: false },
      { id: 'D0', labelRo: 'Canal Date A (D0)', labelEn: 'Data Channel A (D0)', defaultState: true },
      { id: 'D1', labelRo: 'Canal Date B (D1)', labelEn: 'Data Channel B (D1)', defaultState: false }
    ],
    output1LabelRo: 'Serverul Central de Date',
    output1LabelEn: 'Central Server Receiver',
    targetCondition: (inputs) => inputs[0] === true && inputs[2] === true,
    truthTable: [
      { inputs: [false, true, false], output1: true, label: 'S=0 ➡️ Trimite Canal A' },
      { inputs: [false, false, true], output1: false, label: 'S=0 ➡️ Canal A este 0' },
      { inputs: [true, false, true], output1: true, label: 'S=1 ➡️ Trimite Canal B ⭐' }
    ],
    rewardDiamonds: 5,
    xpPoints: 170
  },
  {
    id: 11,
    titleRo: 'Misiunea 11: Seiful Suprem de Netherite (4 Porți Logice Combinate)',
    titleEn: 'Mission 11: Netherite Master Core (4-Gate Combinational Network)',
    subtitleRo: 'Ecuația: (A AND B) OR (C AND NOT D)',
    subtitleEn: 'Equation: (A AND B) OR (C AND NOT D)',
    goalRo: 'Deschide Seiful Suprem al Dragonului Ender: alimentează ramura superioară (A=1 ȘI B=1) SAU ramura inferioară (C=1 ȘI D=0). Găsește o configurație validă!',
    goalEn: 'Unlock the Ender Dragon Master Core: energize the upper branch (A=1 AND B=1) OR the lower branch (C=1 AND D=0). Find any valid unlocking state!',
    conceptRo: 'Circuitele integrate moderne conțin miliarde de porți logice conectate în rețele complexe pentru a executa instrucțiuni logice paralele.',
    conceptEn: 'Modern computer processors connect billions of logic gates in complex networks to evaluate parallel instructions.',
    hintRo: 'O metodă sigură: activează Pârghia A (ON) și Pârghia B (ON).',
    hintEn: 'A dependable solution: turn ON Lever A and Lever B.',
    gateType: 'MASTER_VAULT',
    inputs: [
      { id: 'A', labelRo: 'Cod Alfa (Intrare A)', labelEn: 'Alpha Code (Input A)', defaultState: false },
      { id: 'B', labelRo: 'Cod Beta (Intrare B)', labelEn: 'Beta Code (Input B)', defaultState: false },
      { id: 'C', labelRo: 'Cod Gama (Intrare C)', labelEn: 'Gamma Code (Input C)', defaultState: false },
      { id: 'D', labelRo: 'Blocaj Delta (Intrare D)', labelEn: 'Delta Lock (Input D)', defaultState: true }
    ],
    output1LabelRo: 'Camera Secretă a Dragonului',
    output1LabelEn: 'Ender Dragon Secret Vault',
    targetCondition: (inputs) => (inputs[0] && inputs[1]) || (inputs[2] && !inputs[3]),
    truthTable: [
      { inputs: [true, true, false, false], output1: true, label: 'Soluție 1: A & B ⭐' },
      { inputs: [false, false, true, false], output1: true, label: 'Soluție 2: C & NOT D ⭐' },
      { inputs: [false, false, false, true], output1: false, label: 'Blocat' }
    ],
    rewardDiamonds: 5,
    xpPoints: 180
  },
  {
    id: 12,
    titleRo: 'Misiunea 12: Super-Decodorul de Instrucțiuni CPU (4-Bit Micro-Opcode)',
    titleEn: 'Mission 12: 4-Bit CPU Microcode Instruction Decoder',
    subtitleRo: 'Arhitectura Microprocesorului Redstone',
    subtitleEn: 'Redstone CPU Architecture',
    goalRo: 'Comandă procesorului instrucțiunea [EXECUTE: WRITE REG_1]: configurează pârghiile pe codul 1001₂ (Opcode 10₂ = WRITE, Registru 01₂ = REG_1) pentru a finaliza laboratorul!',
    goalEn: 'Command the CPU instruction [EXECUTE: WRITE REG_1]: configure levers to binary 1001₂ (Opcode 10₂ = WRITE, Register 01₂ = REG_1) to master the lab!',
    conceptRo: 'Orice procesor (CPU) citește un cod binar (Opcode). Circuitul decodor recunoaște combinația și activează circuitele aritmetice și registrele corespunzătoare.',
    conceptEn: 'Every CPU executes binary opcodes. The instruction decoder identifies the bit pattern and routes data to arithmetic units and registers.',
    hintRo: 'Configurează: OP1 = 1 (ON), OP0 = 0 (OFF), R1 = 0 (OFF), R0 = 1 (ON).',
    hintEn: 'Set: OP1 = 1 (ON), OP0 = 0 (OFF), R1 = 0 (OFF), R0 = 1 (ON).',
    gateType: 'CPU_DECODER',
    inputs: [
      { id: 'OP1', labelRo: 'Opcode Bit 1', labelEn: 'Opcode Bit 1', defaultState: false },
      { id: 'OP0', labelRo: 'Opcode Bit 0', labelEn: 'Opcode Bit 0', defaultState: false },
      { id: 'R1', labelRo: 'Registru Bit 1', labelEn: 'Register Bit 1', defaultState: false },
      { id: 'R0', labelRo: 'Registru Bit 0', labelEn: 'Register Bit 0', defaultState: false }
    ],
    output1LabelRo: 'Busul de Execuție CPU',
    output1LabelEn: 'CPU Execution Bus',
    targetCondition: (inputs) => inputs[0] === true && inputs[1] === false && inputs[2] === false && inputs[3] === true,
    truthTable: [
      { inputs: [false, false, false, false], output1: false, label: 'NOP (No Operation)' },
      { inputs: [false, true, false, false], output1: false, label: 'READ REG_0' },
      { inputs: [true, false, false, true], output1: true, label: '1001₂ = WRITE REG_1 ⭐' },
      { inputs: [true, true, true, true], output1: false, label: 'HALT SYSTEM' }
    ],
    rewardDiamonds: 6,
    xpPoints: 200
  }
];

export const RedstoneLogicLab: React.FC<RedstoneLogicLabProps> = ({ onBack, onGameComplete }) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [levelInputs, setLevelInputs] = useState<boolean[]>([]);
  const [repeaterTicks, setRepeaterTicks] = useState<number>(1);
  const [memoryBit, setMemoryBit] = useState<boolean>(false);
  const [isSandboxMode, setIsSandboxMode] = useState<boolean>(false);
  const [sandboxGate, setSandboxGate] = useState<'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND' | 'NOR'>('AND');
  const [sandboxInputs, setSandboxInputs] = useState<boolean[]>([false, false]);

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

  // Initialize level states
  useEffect(() => {
    setLevelInputs(level.inputs.map((inp) => inp.defaultState));
    setRepeaterTicks(1);
    setMemoryBit(false);
    setIsLevelSolved(false);
    setShowHint(false);
  }, [currentLevelIndex]);

  // Compute live outputs
  const computeOutputs = (): { out1: boolean; out2?: boolean; signalPower: number } => {
    if (isSandboxMode) {
      let out = false;
      const [a, b] = sandboxInputs;
      switch (sandboxGate) {
        case 'AND': out = a && b; break;
        case 'OR': out = a || b; break;
        case 'NOT': out = !a; break;
        case 'XOR': out = (a && !b) || (!a && b); break;
        case 'NAND': out = !(a && b); break;
        case 'NOR': out = !(a || b); break;
      }
      return { out1: out, signalPower: out ? 15 : 0 };
    }

    switch (level.gateType) {
      case 'INTERLOCK_NOT': {
        const out = levelInputs[0] === true && !levelInputs[1];
        return { out1: out, signalPower: out ? 15 : 0 };
      }
      case 'AND_3WAY': {
        const out = levelInputs[0] && levelInputs[1] && levelInputs[2];
        return { out1: out, signalPower: out ? 15 : 0 };
      }
      case 'OR_AND_COMBINED': {
        const out = (levelInputs[0] || levelInputs[1]) && levelInputs[2];
        return { out1: out, signalPower: out ? 15 : 0 };
      }
      case 'XOR_PARITY': {
        const activeCount = levelInputs.filter(Boolean).length;
        const out = activeCount % 2 === 1;
        return { out1: out, signalPower: out ? 15 : 0 };
      }
      case 'BINARY_DECODER_4BIT': {
        const out = levelInputs[0] === true && levelInputs[1] === false && levelInputs[2] === true && levelInputs[3] === true;
        return { out1: out, signalPower: out ? 15 : 0 };
      }
      case 'REPEATER_SYNC': {
        const out = levelInputs[0] === true && levelInputs[1] === true && repeaterTicks === 3;
        return { out1: out, signalPower: out ? 15 : 0 };
      }
      case 'NAND_SECURITY': {
        const out = !(levelInputs[0] && levelInputs[1] && levelInputs[2]);
        return { out1: out, signalPower: out ? 15 : 0 };
      }
      case 'RS_NOR_LATCH': {
        const q = memoryBit;
        const qNot = !q;
        return { out1: q, out2: qNot, signalPower: q ? 15 : 0 };
      }
      case 'HALF_ADDER': {
        const a = levelInputs[0];
        const b = levelInputs[1];
        const sum = (a && !b) || (!a && b);
        const carry = a && b;
        return { out1: carry, out2: sum, signalPower: (carry || sum) ? 15 : 0 };
      }
      case 'MUX_2TO1': {
        const s = levelInputs[0];
        const d0 = levelInputs[1];
        const d1 = levelInputs[2];
        const out = (!s && d0) || (s && d1);
        return { out1: out, signalPower: out ? 15 : 0 };
      }
      case 'MASTER_VAULT': {
        const [a, b, c, d] = levelInputs;
        const out = (a && b) || (c && !d);
        return { out1: out, signalPower: out ? 15 : 0 };
      }
      case 'CPU_DECODER': {
        const [op1, op0, r1, r0] = levelInputs;
        const out = op1 === true && op0 === false && r1 === false && r0 === true;
        return { out1: out, signalPower: out ? 15 : 0 };
      }
      default:
        return { out1: false, signalPower: 0 };
    }
  };

  const { out1, out2, signalPower } = computeOutputs();

  // Victory evaluation
  useEffect(() => {
    if (isSandboxMode) return;
    if (levelInputs.length > 0) {
      const solved = level.targetCondition(levelInputs, repeaterTicks, memoryBit);
      if (solved && !isLevelSolved) {
        setIsLevelSolved(true);
        if (!soundMuted) sounds.playCorrect();

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
  }, [levelInputs, repeaterTicks, memoryBit, isSandboxMode]);

  const toggleInput = (index: number) => {
    const updated = [...levelInputs];
    const newState = !updated[index];
    updated[index] = newState;
    setLevelInputs(updated);

    // If RS-NOR Latch: update memory bit
    if (level.gateType === 'RS_NOR_LATCH') {
      if (index === 0 && newState === true) {
        // SET pressed
        setMemoryBit(true);
      } else if (index === 1 && newState === true) {
        // RESET pressed
        setMemoryBit(false);
      }
    }

    if (!soundMuted) sounds.playClick();
  };

  const cycleRepeaterTicks = () => {
    const nextTicks = repeaterTicks >= 4 ? 1 : repeaterTicks + 1;
    setRepeaterTicks(nextTicks);
    if (!soundMuted) sounds.playClick();
  };

  const handleNextLevel = () => {
    if (currentLevelIndex < REDSTONE_LEVELS.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1);
      if (!soundMuted) sounds.playLevelUp();
    }
  };

  const handleResetCurrentLevel = () => {
    setLevelInputs(level.inputs.map((inp) => inp.defaultState));
    setRepeaterTicks(1);
    setMemoryBit(false);
    setIsLevelSolved(false);
    if (!soundMuted) sounds.playClick();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 pb-16 select-none animate-fadeIn">
      {/* Top Navigation & Status Bar */}
      <div className="bg-stone-900 border-2 border-stone-700/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden mb-4 sm:mb-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <button
            onClick={onBack}
            className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-600 transition shadow-md cursor-pointer group shrink-0"
            title={isEn ? 'Back to Arcade' : 'Înapoi la Jocuri'}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider">
                <Zap className="w-3 h-3 text-rose-400 animate-pulse" />
                <span>Minecraft Redstone Lab</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700 text-[10px] sm:text-[11px] font-mono">
                {isSandboxMode
                  ? (isEn ? 'Free Sandbox Mode' : 'Laborator Liber')
                  : `${isEn ? 'Mission' : 'Misiunea'} ${currentLevelIndex + 1} / ${REDSTONE_LEVELS.length}`}
              </span>
            </div>
            <h2 className="text-base sm:text-xl md:text-2xl font-black text-white font-heading tracking-tight truncate">
              {isSandboxMode
                ? (isEn ? 'Redstone Circuit Simulator Sandbox' : 'Simulator Liber de Circuite Redstone')
                : (isEn ? level.titleEn : level.titleRo)}
            </h2>
          </div>
        </div>

        {/* Action Controls & Badges */}
        <div className="relative z-10 flex items-center justify-between sm:justify-start gap-2 shrink-0">
          <button
            onClick={() => {
              setIsSandboxMode(!isSandboxMode);
              if (!soundMuted) sounds.playClick();
            }}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border transition flex items-center gap-1.5 cursor-pointer ${
              isSandboxMode
                ? 'bg-amber-600 text-white border-amber-400 shadow-md shadow-amber-600/30 ring-2 ring-amber-500/20'
                : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white hover:bg-stone-750'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>{isSandboxMode ? (isEn ? 'Missions' : 'Misiuni') : 'Sandbox'}</span>
          </button>

          {/* Diamonds Collected */}
          <div className="px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center gap-1.5 shadow-inner">
            <span className="text-base">💎</span>
            <div>
              <div className="text-[9px] font-mono text-cyan-300 uppercase leading-none font-bold">
                {isEn ? 'Diamonds' : 'Diamante'}
              </div>
              <div className="text-xs sm:text-sm font-black text-cyan-100 font-mono">
                {totalDiamonds}
              </div>
            </div>
          </div>

          {/* XP Score */}
          <div className="px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/40 flex items-center gap-1.5 shadow-inner">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <div>
              <div className="text-[9px] font-mono text-amber-300 uppercase leading-none font-bold">
                XP
              </div>
              <div className="text-xs sm:text-sm font-black text-amber-100 font-mono">
                {totalScore}
              </div>
            </div>
          </div>

          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className="p-2 sm:p-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 border border-stone-700 transition cursor-pointer"
            title={soundMuted ? 'Unmute' : 'Mute'}
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Level Selection Bar (Scrollable horizontally without layout break) */}
      {!isSandboxMode && (
        <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-2 sm:p-2.5 flex items-center gap-1.5 sm:gap-2 overflow-x-auto shadow-lg mb-4 sm:mb-6 custom-scrollbar">
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
                className={`px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-mono font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer border ${
                  isCurrent
                    ? 'bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-600/30 ring-2 ring-rose-500/30'
                    : isDone
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                    : 'bg-stone-850 text-stone-400 border-stone-700 hover:bg-stone-800 hover:text-stone-200'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-stone-800 flex items-center justify-center text-[10px]">
                    {lvl.id}
                  </span>
                )}
                <span>M{lvl.id}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Spacious Circuit Workbench (Full Width) */}
      <div className="w-full flex flex-col gap-6">
        {/* Interactive Minecraft Circuit Workbench */}
        <div className="bg-stone-900 border-2 border-stone-700 rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl relative overflow-visible flex flex-col justify-between w-full">
          {/* Minecraft Deepslate Pattern Background */}
          <div 
            className="absolute inset-0 opacity-10 rounded-3xl pointer-events-none" 
            style={{
              backgroundImage: `radial-gradient(#f43f5e 1.5px, transparent 1.5px), radial-gradient(#d97706 1.5px, #1c1917 1.5px)`,
              backgroundSize: '28px 28px',
              backgroundPosition: '0 0, 14px 14px'
            }}
          />

          {/* Circuit Mission Header */}
          {!isSandboxMode ? (
            <div className="relative z-10 bg-stone-950/90 border border-stone-800 p-4 sm:p-5 rounded-2xl flex items-start gap-3.5 backdrop-blur-sm shadow-md mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 mt-0.5 shadow-inner">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-mono text-rose-400 font-bold uppercase tracking-wider">
                    {isEn ? 'Mission Objective' : 'Obiectivul Circuitului TIC'}
                  </span>
                  <span className="text-[11px] font-mono text-stone-400 bg-stone-900 px-2.5 py-0.5 rounded-lg border border-stone-800 font-bold">
                    ID: {level.gateType}
                  </span>
                </div>
                <p className="text-sm sm:text-base font-semibold text-white mt-1.5 leading-relaxed break-words">
                  {isEn ? level.goalEn : level.goalRo}
                </p>
              </div>
            </div>
          ) : (
            <div className="relative z-10 bg-amber-950/40 border border-amber-500/30 p-4 rounded-2xl mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-400" />
                <span className="text-xs sm:text-sm font-mono font-bold text-amber-300">
                  {isEn ? 'Select Logic Gate:' : 'Alege Poarta Logică:'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {(['AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR'] as const).map((gate) => (
                  <button
                    key={gate}
                    onClick={() => setSandboxGate(gate)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold cursor-pointer transition ${
                      sandboxGate === gate
                        ? 'bg-amber-500 text-stone-950 font-black shadow-md'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    {gate}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Circuit Diagram Container (Spacious 3-Column Grid) */}
          <div className="relative z-10 my-2 sm:my-4 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center w-full">
            {/* 1. INPUTS COLUMN (Spacious Left) */}
            <div className="md:col-span-5 lg:col-span-5 flex flex-col gap-3 w-full min-w-0">
              <div className="pb-1.5 border-b border-stone-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-mono text-amber-400 uppercase tracking-wider font-bold">
                  <Sliders className="w-4 h-4" />
                  <span>{isEn ? 'Inputs & Levers' : 'Pârghii de Intrare'}</span>
                </span>
                <span className="text-[11px] text-stone-400 font-mono bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                  {!isSandboxMode ? `${levelInputs.filter(Boolean).length} / ${level.inputs.length} ACTIVE` : `${sandboxInputs.filter(Boolean).length} / 2 ACTIVE`}
                </span>
              </div>

              <div className="flex flex-col gap-2.5 w-full">
                {!isSandboxMode ? (
                  level.inputs.map((inp, idx) => {
                    const isActive = levelInputs[idx];
                    return (
                      <div
                        key={inp.id}
                        onClick={() => toggleInput(idx)}
                        className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 sm:gap-4 shadow-lg active:scale-[0.99] w-full ${
                          isActive
                            ? 'bg-gradient-to-r from-rose-950/90 via-stone-900 to-rose-950/70 border-rose-500 shadow-rose-600/25 ring-1 ring-rose-500/30'
                            : 'bg-stone-950/90 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                          {/* Realistic Minecraft Lever Visual */}
                          <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-xl font-bold border shrink-0 transition-transform ${
                            isActive 
                              ? 'bg-rose-600 border-rose-400 text-white shadow-md shadow-rose-600/50 scale-105' 
                              : 'bg-stone-850 border-stone-700 text-stone-500'
                          }`}>
                            {isActive ? '⚡' : '🔘'}
                          </div>

                          <div className="min-w-0 flex-1">
                            {/* Complete label without truncation */}
                            <div className="font-bold text-white text-xs sm:text-sm leading-snug break-words">
                              {isEn ? inp.labelEn : inp.labelRo}
                            </div>
                            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                              <span className={`w-2 h-2 rounded-full shrink-0 ${isActive ? 'bg-rose-400 animate-pulse' : 'bg-stone-600'}`} />
                              <span className={`text-[11px] font-mono font-bold ${
                                isActive ? 'text-rose-300' : 'text-stone-500'
                              }`}>
                                {isActive ? (isEn ? 'SIGNAL: 1 (ACTIVE / HIGH)' : 'SEMNAL: 1 (ACTIV)') : (isEn ? 'SIGNAL: 0 (INACTIVE / LOW)' : 'SEMNAL: 0 (OPRIT)')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Physical Lever Toggle Switch */}
                        <div className={`w-12 h-6 rounded-full p-0.5 transition-colors shrink-0 ${
                          isActive ? 'bg-rose-600' : 'bg-stone-800'
                        }`}>
                          <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                            isActive ? 'translate-x-6' : 'translate-x-0'
                          }`} />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  [0, 1].map((idx) => {
                    const isActive = sandboxInputs[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          const updated = [...sandboxInputs];
                          updated[idx] = !updated[idx];
                          setSandboxInputs(updated);
                          if (!soundMuted) sounds.playClick();
                        }}
                        className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-lg active:scale-[0.99] ${
                          isActive
                            ? 'bg-rose-950/80 border-rose-500 shadow-rose-600/20'
                            : 'bg-stone-950 border-stone-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{isActive ? '⚡' : '🔘'}</span>
                          <div>
                            <span className="text-xs sm:text-sm font-bold text-white font-mono block">
                              {isEn ? `Input ${idx === 0 ? 'A' : 'B'}` : `Intrarea ${idx === 0 ? 'A' : 'B'}`}
                            </span>
                            <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-rose-300' : 'text-stone-500'}`}>
                              {isActive ? 'SEMNAL: 1' : 'SEMNAL: 0'}
                            </span>
                          </div>
                        </div>
                        <div className={`w-12 h-6 rounded-full p-0.5 ${isActive ? 'bg-rose-600' : 'bg-stone-800'}`}>
                          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Optional Redstone Repeater Block */}
              {!isSandboxMode && level.hasRepeater && (
                <div 
                  onClick={cycleRepeaterTicks}
                  className="p-3.5 rounded-2xl bg-stone-950 border-2 border-amber-500/50 hover:border-amber-400 cursor-pointer shadow-md transition group mt-1"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-amber-300 font-bold uppercase flex items-center gap-1.5">
                      <span>⏱️</span>
                      <span>{isEn ? 'Redstone Repeater' : 'Repetitor Redstone'}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
                      {repeaterTicks} Ticks ({repeaterTicks * 0.1}s)
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-1.5 bg-stone-900 p-2 rounded-xl border border-stone-800">
                    {[1, 2, 3, 4].map((tick) => (
                      <div
                        key={tick}
                        className={`flex-1 py-1 text-center rounded-lg text-xs font-mono font-bold transition ${
                          repeaterTicks === tick
                            ? 'bg-amber-500 text-stone-950 shadow-md font-black'
                            : 'text-stone-500 hover:text-stone-300'
                        }`}
                      >
                        {tick}t
                      </div>
                    ))}
                  </div>
                  <div className="text-[10px] text-stone-400 mt-1.5 font-mono text-center group-hover:text-amber-300 transition-colors">
                    {isEn ? 'Click to cycle delay ticks (1t - 4t)' : 'Apasă pentru a schimba întârzierea (1t - 4t)'}
                  </div>
                </div>
              )}
            </div>

            {/* 2. CENTER: REDSTONE BUS & MAIN LOGIC GATE BLOCK */}
            <div className="md:col-span-3 lg:col-span-3 flex flex-col items-center justify-center shrink-0 w-full my-3 md:my-0">
              {/* Glowing Redstone Dust Line Inflow */}
              <div className="w-full flex items-center justify-center gap-1 mb-2">
                <div className={`h-1.5 flex-1 max-w-[60px] rounded-full transition-all ${
                  signalPower > 0
                    ? 'bg-rose-500 shadow-lg shadow-rose-500 animate-pulse'
                    : 'bg-stone-800'
                }`} />
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  signalPower > 0
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-stone-900 text-stone-500 border-stone-800'
                }`}>
                  {signalPower > 0 ? 'BUS REDSTONE ACTIV' : 'FĂRĂ SEMNAL'}
                </span>
                <div className={`h-1.5 flex-1 max-w-[60px] rounded-full transition-all ${
                  signalPower > 0
                    ? 'bg-rose-500 shadow-lg shadow-rose-500 animate-pulse'
                    : 'bg-stone-800'
                }`} />
              </div>

              {/* Main Logic Gate Block */}
              <div className={`w-full max-w-[220px] p-4 rounded-3xl border-2 shadow-2xl flex flex-col items-center gap-2.5 relative transition-all ${
                signalPower > 0
                  ? 'bg-gradient-to-b from-stone-900 via-rose-950/80 to-stone-900 border-rose-500 shadow-rose-600/30 ring-2 ring-rose-500/30'
                  : 'bg-stone-950 border-stone-700'
              }`}>
                <div className="text-[11px] font-mono uppercase font-black text-center text-stone-300 tracking-wider flex items-center justify-center gap-1 w-full">
                  <Cpu className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="truncate">{isSandboxMode ? `POARTĂ ${sandboxGate}` : level.gateType.replace(/_/g, ' ')}</span>
                </div>

                {/* Minecraft Block Icon */}
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-4xl border-2 transition-all shadow-inner ${
                  signalPower > 0 
                    ? 'bg-rose-600/25 border-rose-400 text-rose-300 shadow-rose-600/60 scale-105 animate-pulse' 
                    : 'bg-stone-850 border-stone-700 text-stone-500'
                }`}>
                  {isSandboxMode ? (
                    sandboxGate === 'NOT' ? '🪓' :
                    sandboxGate === 'AND' ? '🔒' :
                    sandboxGate === 'OR' ? '🌉' :
                    sandboxGate === 'XOR' ? '🏮' :
                    sandboxGate === 'NAND' ? '💣' : '🛡️'
                  ) : (
                    level.gateType === 'INTERLOCK_NOT' ? '🪓' :
                    level.gateType === 'AND_3WAY' ? '🔒' :
                    level.gateType === 'OR_AND_COMBINED' ? '🌉' :
                    level.gateType === 'XOR_PARITY' ? '🏮' :
                    level.gateType === 'BINARY_DECODER_4BIT' ? '🔢' :
                    level.gateType === 'REPEATER_SYNC' ? '⏱️' :
                    level.gateType === 'NAND_SECURITY' ? '💣' :
                    level.gateType === 'RS_NOR_LATCH' ? '💾' :
                    level.gateType === 'HALF_ADDER' ? '🧮' :
                    level.gateType === 'MUX_2TO1' ? '🔀' :
                    level.gateType === 'MASTER_VAULT' ? '👑' : '💻'
                  )}
                </div>

                {/* Power Gauge */}
                <div className="w-full flex items-center justify-between px-2.5 py-1 rounded-xl bg-stone-900/90 border border-stone-800 mt-1">
                  <div className="flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-rose-400" />
                    <span className="text-[10px] font-mono text-stone-400 font-bold uppercase">Semnal:</span>
                  </div>
                  <span className={`text-xs font-mono font-black ${
                    signalPower > 0 
                      ? 'text-rose-300 font-bold'
                      : 'text-stone-500'
                  }`}>
                    {signalPower} / 15
                  </span>
                </div>
              </div>

              {/* Glowing Redstone Dust Line Outflow */}
              <div className={`w-20 h-1.5 rounded-full mt-2 transition-all ${
                signalPower > 0
                  ? 'bg-rose-500 shadow-lg shadow-rose-500 animate-pulse'
                  : 'bg-stone-800'
              }`} />
            </div>

            {/* 3. RIGHT: OUTPUT ACTUATORS (Spacious Right) */}
            <div className="md:col-span-4 lg:col-span-4 flex flex-col gap-3 w-full min-w-0">
              <div className="pb-1.5 border-b border-stone-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                  <Unlock className="w-4 h-4" />
                  <span>{isEn ? 'Output Actuators' : 'Mecanisme Ieșire'}</span>
                </span>
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
                  out1 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                    : 'bg-stone-950 text-stone-500 border-stone-800'
                }`}>
                  {out1 ? (isEn ? 'ACTIVE' : 'DEBLOCAT') : (isEn ? 'LOCKED' : 'BLOCAT')}
                </span>
              </div>

              {/* Primary Output Block */}
              <div className={`p-4 rounded-2xl border-2 transition-all duration-300 shadow-xl w-full ${
                out1
                  ? 'bg-gradient-to-r from-stone-900 to-emerald-950/80 border-emerald-500 shadow-emerald-600/30 ring-1 ring-emerald-500/30'
                  : 'bg-stone-950/90 border-stone-800'
              }`}>
                <div className="flex items-center gap-3.5 w-full">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-3xl border-2 transition-all shrink-0 ${
                    out1
                      ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/40 scale-105'
                      : 'bg-stone-900 border-stone-700 text-stone-600'
                  }`}>
                    {out1 ? '💡' : '⚫'}
                  </div>

                  <div className="min-w-0 flex-1">
                    {/* Complete output label without truncation */}
                    <div className="font-black text-white text-sm sm:text-base leading-snug break-words">
                      {isEn ? level.output1LabelEn : level.output1LabelRo}
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-mono font-black ${
                        out1
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-stone-900 text-stone-400 border border-stone-800'
                      }`}>
                        <span className={`w-2 h-2 rounded-full shrink-0 ${out1 ? 'bg-emerald-400 animate-pulse' : 'bg-stone-600'}`} />
                        <span>{out1 ? (isEn ? 'ACTIVE (1)' : 'DEBLOCAT (1)') : (isEn ? 'LOCKED (0)' : 'BLOCAT / STINS (0)')}</span>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-black border shrink-0 ${
                        out1 
                          ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400 shadow-sm' 
                          : 'bg-stone-850 text-stone-500 border-stone-700'
                      }`}>
                        {out1 ? 'Q = 1' : 'Q = 0'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional Dual Output Block (for Adders & RS-NOR Latch) */}
              {!isSandboxMode && level.isDualOutput && (
                <div className={`p-4 rounded-2xl border-2 transition-all duration-300 shadow-xl w-full ${
                  out2
                    ? 'bg-gradient-to-r from-stone-900 to-cyan-950/80 border-cyan-500 shadow-cyan-600/30 ring-1 ring-cyan-500/30'
                    : 'bg-stone-950/90 border-stone-800'
                }`}>
                  <div className="flex items-center gap-3.5 w-full">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-3xl border-2 transition-all shrink-0 ${
                      out2
                        ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/40 scale-105'
                        : 'bg-stone-900 border-stone-700 text-stone-600'
                    }`}>
                      {out2 ? '✨' : '🔘'}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="font-black text-white text-sm sm:text-base leading-snug break-words">
                        {isEn ? level.output2LabelEn : level.output2LabelRo}
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-mono font-black ${
                          out2
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'bg-stone-900 text-stone-400 border border-stone-800'
                        }`}>
                          <span className={`w-2 h-2 rounded-full shrink-0 ${out2 ? 'bg-cyan-400 animate-pulse' : 'bg-stone-600'}`} />
                          <span>{out2 ? (isEn ? 'ACTIVE (1)' : 'SEMNAL ACTIV (1)') : (isEn ? 'INACTIVE (0)' : 'INACTIV (0)')}</span>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-black border shrink-0 ${
                          out2 
                            ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400 shadow-sm' 
                            : 'bg-stone-850 text-stone-500 border-stone-700'
                        }`}>
                          {out2 ? 'OUT = 1' : 'OUT = 0'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Victory Banner or Level Actions */}
          {!isSandboxMode && (
            isLevelSolved ? (
              <div className="relative z-10 mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-stone-900 to-emerald-950/90 border-2 border-emerald-500/80 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
                <div className="flex items-center gap-3.5 w-full sm:w-auto">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 text-2xl shadow-inner">
                    💎
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-base font-bold text-white flex items-center gap-2 flex-wrap">
                      <span>{isEn ? 'Circuit Solved!' : 'Circuit Rezolvat cu Succes!'}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                        +{level.rewardDiamonds} 💎 | +{level.xpPoints} XP
                      </span>
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-300 break-words mt-0.5">
                      {isEn 
                        ? 'Outstanding work! The redstone logic condition has been satisfied.' 
                        : 'Excelent! Condiția logică Redstone a fost validată cu succes.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleNextLevel}
                  disabled={currentLevelIndex >= REDSTONE_LEVELS.length - 1}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm font-mono transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer disabled:opacity-50 shrink-0 active:scale-95"
                >
                  <span>{isEn ? 'Next Mission' : 'Misiunea Următoare'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative z-10 mt-6 pt-4 border-t border-stone-800 flex items-center justify-between gap-3 text-xs font-mono text-stone-400 flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowTruthTableModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 hover:text-white border border-stone-700 transition flex items-center gap-2 cursor-pointer text-xs"
                  >
                    <Info className="w-4 h-4 text-cyan-400" />
                    <span>{isEn ? 'Truth Table Guide' : 'Ghid Tabel Adevăr'}</span>
                  </button>

                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="px-3.5 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-500/30 transition flex items-center gap-2 cursor-pointer text-xs"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>{isEn ? 'Hint' : 'Indiciu'}</span>
                  </button>
                </div>

                <button
                  onClick={handleResetCurrentLevel}
                  className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 hover:text-white border border-stone-700 transition flex items-center gap-2 cursor-pointer text-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{isEn ? 'Reset Levers' : 'Resetează Pârghiile'}</span>
                </button>
              </div>
            )
          )}
        </div>

        {/* Educational Section Beneath Workbench (2 Spacious Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
          {/* Left Column: Architectural Logic Principle & Hint */}
          <div className="lg:col-span-6 bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider pb-2 border-b border-stone-800">
              <span className="flex items-center gap-2 text-rose-400">
                <Cpu className="w-4 h-4" />
                <span>{isEn ? 'Architecture Principle' : 'Principiul Logic TIC & Teoria Redstone'}</span>
              </span>
              <span className="text-stone-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                {isSandboxMode ? 'SANDBOX' : level.gateType}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-stone-300 leading-relaxed break-words">
              {isSandboxMode
                ? (isEn
                  ? 'In Sandbox mode, test how logic gates combine binary inputs into outputs. Notice that NAND and NOR are universal gates capable of synthesizing any Boolean function!'
                  : 'În modul Sandbox poți testa cum combină porțile logice intrările binare. Porțile NAND și NOR sunt porți universale, capabile să sintetizeze orice funcție logică!')
                : (isEn ? level.conceptEn : level.conceptRo)}
            </div>

            {/* Teacher Hint Card */}
            {!isSandboxMode && showHint && (
              <div className="p-4 rounded-2xl bg-amber-950/50 border border-amber-500/40 text-amber-200 text-xs sm:text-sm leading-relaxed animate-fadeIn flex items-start gap-3 break-words">
                <span className="text-xl shrink-0">💡</span>
                <div>
                  <strong className="block text-amber-300 font-bold mb-1">
                    {isEn ? 'Engineering Tip:' : 'Sfatul Inginerului Redstone:'}
                  </strong>
                  {isEn ? level.hintEn : level.hintRo}
                </div>
              </div>
            )}

            {/* Certification Badge */}
            <div className="bg-gradient-to-br from-cyan-950/50 to-stone-900 border border-cyan-500/30 rounded-2xl p-4 flex items-center justify-between gap-3 w-full mt-auto">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-3xl shrink-0">⛏️</span>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white uppercase font-mono truncate">
                    {isEn ? 'Master Redstone Architect' : 'Inginer Certificat Redstone'}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-stone-400 mt-0.5">
                    {completedLevels.length} / {REDSTONE_LEVELS.length} {isEn ? 'Missions Completed' : 'Misiuni Finalizate'}
                  </p>
                </div>
              </div>

              <div className="text-right font-mono text-cyan-300 font-black text-sm sm:text-base shrink-0">
                {Math.round((completedLevels.length / REDSTONE_LEVELS.length) * 100)}%
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Truth Table */}
          <div className="lg:col-span-6 bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col gap-3 w-full">
            <div className="text-xs font-mono text-stone-400 font-bold uppercase pb-2 border-b border-stone-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-rose-400">
                <Lightbulb className="w-4 h-4" />
                <span>{isEn ? 'Live Truth Table' : 'Tabel de Adevăr Interactiv Live'}</span>
              </span>
              <span className="text-[10px] text-stone-500 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                {isEn ? 'Auto-Highlighting' : 'Linia Activă Iluminată'}
              </span>
            </div>

            {!isSandboxMode ? (
              <div className="overflow-x-auto rounded-2xl border border-stone-800 bg-stone-950 text-xs font-mono w-full">
                <table className="w-full text-left">
                  <thead className="bg-stone-900 border-b border-stone-800 text-stone-400 text-xs">
                    <tr>
                      {level.inputs.map((inp) => (
                        <th key={inp.id} className="p-3 text-center font-bold">
                          {inp.id}
                        </th>
                      ))}
                      <th className="p-3 text-right font-bold">{isEn ? 'Output Result' : 'Ieșire Rezultat'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-850">
                    {level.truthTable.map((row, rIdx) => {
                      const isCurrent = row.inputs.every((val, vIdx) => val === levelInputs[vIdx]);

                      return (
                        <tr 
                          key={rIdx} 
                          className={`transition-all ${
                            isCurrent 
                              ? 'bg-rose-950/80 font-bold text-rose-200 ring-2 ring-rose-500/80 shadow-md' 
                              : 'text-stone-400 hover:bg-stone-900/50'
                          }`}
                        >
                          {row.inputs.map((val, vIdx) => (
                            <td key={vIdx} className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded font-mono font-bold ${val ? 'bg-rose-500/20 text-rose-300' : 'text-stone-500'}`}>
                                {val ? '1' : '0'}
                              </span>
                            </td>
                          ))}
                          <td className="p-3 text-right">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-black ${
                              row.output1 
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                                : 'bg-stone-900 text-stone-500 border border-stone-800'
                            }`}>
                              {row.output1 ? '1 (ACTIV)' : '0 (BLOCAT)'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-stone-950 border border-stone-800 text-center text-stone-400 text-xs leading-relaxed">
                {isEn 
                  ? 'Switch between logic gates above in Sandbox to test different truth table behaviors in real-time!' 
                  : 'Comută între porțile logice de mai sus în modul Sandbox pentru a testa comportamentul tabelului de adevăr în timp real!'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Truth Table Full Modal */}
      {showTruthTableModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-stone-900 border-2 border-stone-700 rounded-3xl p-5 sm:p-7 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
            <h3 className="text-base sm:text-lg font-black text-white font-heading mb-2 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{isEn ? `Truth Table Guide: ${level.gateType}` : `Tabel de Adevăr & Logică: ${level.gateType}`}</span>
            </h3>

            <p className="text-xs text-stone-300 mb-4 leading-relaxed">
              {isEn ? level.conceptEn : level.conceptRo}
            </p>

            <div className="overflow-x-auto rounded-2xl border border-stone-800 bg-stone-950 text-xs font-mono mb-4 w-full">
              <table className="w-full text-left">
                <thead className="bg-stone-850 border-b border-stone-800 text-stone-400 text-[11px]">
                  <tr>
                    {level.inputs.map((inp) => (
                      <th key={inp.id} className="p-3 text-center">
                        {isEn ? inp.labelEn : inp.labelRo} ({inp.id})
                      </th>
                    ))}
                    <th className="p-3 text-right">{isEn ? 'Result' : 'Rezultat'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-850">
                  {level.truthTable.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-stone-900/50">
                      {row.inputs.map((val, vIdx) => (
                        <td key={vIdx} className="p-3 text-center text-stone-200">
                          {val ? '1 (ON)' : '0 (OFF)'}
                        </td>
                      ))}
                      <td className="p-3 text-right font-bold text-emerald-400">
                        {row.output1 ? '1 (DESCHIS)' : '0 (BLOCAT)'}
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
