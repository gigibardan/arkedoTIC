import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { updateStudentArcadeScore } from '../../lib/studentAuthService';
import {
  ArrowLeft,
  Boxes,
  RotateCcw,
  Trophy,
  HelpCircle,
  Play,
  Pause,
  Zap,
  Cpu,
  Layers,
  Sparkles,
  ChevronRight,
  Info,
  CheckCircle2,
  Sliders,
  Unlock,
  Eye,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  Code,
  Flame,
  Shield,
  Hammer
} from 'lucide-react';

// Block Types available in Voxel World
export type BlockType = 
  | 'air'
  | 'stone'
  | 'deepslate'
  | 'redstone_dust'
  | 'redstone_torch'
  | 'lever'
  | 'repeater'
  | 'piston'
  | 'redstone_lamp'
  | 'iron_door'
  | 'gate_and'
  | 'gate_or'
  | 'gate_xor'
  | 'gate_not'
  | 'command_block'
  | 'diamond_block'
  | 'lava'
  | 'water'
  | 'tnt';

export interface VoxelCell {
  type: BlockType;
  powered: boolean;
  powerLevel: number; // 0-15 (Minecraft Redstone Signal Strength)
  state?: boolean; // For levers (on/off), pistons (extended/retracted), doors (open/closed)
  label?: string;
  delay?: number; // For repeaters (1-4 ticks)
  locked?: boolean; // Cannot be modified in story missions
}

export interface VoxelMission {
  id: number;
  titleEn: string;
  titleRo: string;
  subtitleEn: string;
  subtitleRo: string;
  biome: 'overworld' | 'caves' | 'nether' | 'end' | 'cpu';
  conceptEn: string;
  conceptRo: string;
  goalEn: string;
  goalRo: string;
  hintEn: string;
  hintRo: string;
  gridWidth: number;
  gridHeight: number;
  initialGrid: { x: number; y: number; block: Partial<VoxelCell> }[];
  allowedHotbar: BlockType[];
  checkVictory: (grid: VoxelCell[][]) => boolean;
  rewardXP: number;
  rewardDiamonds: number;
}

// 10 Detailed Story Missions
const VOXEL_MISSIONS: VoxelMission[] = [
  {
    id: 1,
    titleEn: 'Digital Signals: The Power Lever',
    titleRo: 'Semnale Digitale: Pârghia de Alimentare',
    subtitleEn: 'Learn how binary 0 and 1 transmit along redstone wires',
    subtitleRo: 'Învață cum se transmit biții 0 și 1 pe circuitele de redstone',
    biome: 'overworld',
    conceptEn: 'In computers, high voltage represents Bit 1 (ON) and low voltage represents Bit 0 (OFF). In Minecraft, a lever outputs a signal of strength 15 that travels through redstone dust to illuminate lamps.',
    conceptRo: 'În calculatoare, tensiunea electrică reprezintă Bitul 1 (ACTIV) și lipsa ei Bitul 0 (OPRIT). În Minecraft, pârghia generează un semnal de putere 15 care călătorește prin praful de Redstone spre lampă.',
    goalEn: 'Place redstone dust between the Power Lever and the Redstone Lamp, then flip the lever to turn on the lamp!',
    goalRo: 'Așază praf de Redstone între Pârghia de Alimentare și Lampa Redstone, apoi acționează pârghia pentru a aprinde lampa!',
    hintEn: 'Select Redstone Dust from your hotbar, fill the gap between the lever and lamp, then click the lever to toggle power.',
    hintRo: 'Selectează Praf Redstone din bara de unelte, umple golul dintre pârghie și lampă, apoi dă click pe pârghie pentru a o comuta.',
    gridWidth: 7,
    gridHeight: 4,
    allowedHotbar: ['redstone_dust', 'lever', 'stone'],
    initialGrid: [
      { x: 1, y: 1, block: { type: 'lever', state: false, powered: false, powerLevel: 0, locked: false, label: 'PWR' } },
      { x: 5, y: 1, block: { type: 'redstone_lamp', powered: false, powerLevel: 0, locked: true, label: 'LAMP' } },
      { x: 0, y: 2, block: { type: 'stone', locked: true } },
      { x: 1, y: 2, block: { type: 'stone', locked: true } },
      { x: 2, y: 2, block: { type: 'stone', locked: true } },
      { x: 3, y: 2, block: { type: 'stone', locked: true } },
      { x: 4, y: 2, block: { type: 'stone', locked: true } },
      { x: 5, y: 2, block: { type: 'stone', locked: true } },
      { x: 6, y: 2, block: { type: 'stone', locked: true } }
    ],
    checkVictory: (grid) => {
      const lamp = grid[1]?.[5];
      return Boolean(lamp && lamp.type === 'redstone_lamp' && lamp.powered);
    },
    rewardXP: 100,
    rewardDiamonds: 2
  },
  {
    id: 2,
    titleEn: 'NOT Gate: The Inverting Redstone Torch',
    titleRo: 'Poarta NOT: Inversorul cu Torță Redstone',
    subtitleEn: 'Invert input signals so output is ON when input is OFF',
    subtitleRo: 'Inversează semnalul de intrare: ieșirea devine 1 când intrarea este 0',
    biome: 'caves',
    conceptEn: 'A NOT gate (Inverter) inverts the digital logic: 0 becomes 1, and 1 becomes 0. A redstone torch mounted on a powered block turns off, acting as a real-world hardware inverter!',
    conceptRo: 'O poartă logică NOT (Inversor) inversează semnalul: 0 devine 1, iar 1 devine 0. În Minecraft, o torță de redstone atașată de un bloc alimentat se stinge automat, formând un inversor real!',
    goalEn: 'Build an inverter using a Redstone Torch or NOT Gate so the iron security door stays unlocked when the alarm lever is OFF.',
    goalRo: 'Construiește un inversor folosind o Torță Redstone sau Poarta NOT astfel încât ușa de securitate să rămână deschisă când pârghia este OPRITĂ.',
    hintEn: 'Place a Redstone Torch or NOT gate in the circuit line. When the lever is 0, the torch powers the iron door (1).',
    hintRo: 'Plasează o Torță Redstone sau o Poartă NOT în linie. Când pârghia este pe 0, torța va alimenta ușa din fier (1).',
    gridWidth: 8,
    gridHeight: 4,
    allowedHotbar: ['redstone_dust', 'redstone_torch', 'gate_not', 'stone'],
    initialGrid: [
      { x: 1, y: 1, block: { type: 'lever', state: false, powered: false, powerLevel: 0, locked: false, label: 'ALARM' } },
      { x: 6, y: 1, block: { type: 'iron_door', powered: false, state: false, powerLevel: 0, locked: true, label: 'DOOR' } },
      { x: 0, y: 2, block: { type: 'deepslate', locked: true } },
      { x: 1, y: 2, block: { type: 'deepslate', locked: true } },
      { x: 2, y: 2, block: { type: 'deepslate', locked: true } },
      { x: 3, y: 2, block: { type: 'deepslate', locked: true } },
      { x: 4, y: 2, block: { type: 'deepslate', locked: true } },
      { x: 5, y: 2, block: { type: 'deepslate', locked: true } },
      { x: 6, y: 2, block: { type: 'deepslate', locked: true } },
      { x: 7, y: 2, block: { type: 'deepslate', locked: true } }
    ],
    checkVictory: (grid) => {
      const door = grid[1]?.[6];
      const lever = grid[1]?.[1];
      return Boolean(door && door.powered && lever && !lever.state);
    },
    rewardXP: 150,
    rewardDiamonds: 3
  },
  {
    id: 3,
    titleEn: 'AND Gate: The Piston Bridge Over Lava',
    titleRo: 'Poarta AND: Podul cu Pistoane peste Lavă',
    subtitleEn: 'Both safety switches must be active (1 AND 1 = 1) to extend the bridge',
    subtitleRo: 'Ambele manete de siguranță trebuie activate (1 ȘI 1 = 1) pentru a extinde podul',
    biome: 'nether',
    conceptEn: 'An AND gate only outputs 1 when ALL its inputs are 1 (True AND True = True). It is essential in security systems, 2-factor authentication, and processor arithmetic.',
    conceptRo: 'O poartă AND oferă ieșirea 1 doar când TOATE intrările sunt 1 (Adevărat ȘI Adevărat = Adevărat). Este esențială în autentificarea în doi pași și calculul binar.',
    goalEn: 'Place an AND Gate connected to both levers (KEY 1 & KEY 2) and wire it to the Bridge Piston to cross the lava!',
    goalRo: 'Așază o Poartă AND conectată la ambele pârghii (CHEIA 1 și CHEIA 2) și leag-o prin redstone la Pistonul de Pod pentru a traversa lava!',
    hintEn: 'Wire both levers into the AND Gate inputs, then connect the gate output to the piston and activate both levers.',
    hintRo: 'Leagă ambele pârghii la intrările Porții AND, apoi conectează ieșirea porții la piston și activează ambele manete.',
    gridWidth: 8,
    gridHeight: 5,
    allowedHotbar: ['redstone_dust', 'gate_and', 'stone'],
    initialGrid: [
      { x: 1, y: 0, block: { type: 'lever', state: false, powered: false, powerLevel: 0, locked: false, label: 'KEY 1' } },
      { x: 1, y: 3, block: { type: 'lever', state: false, powered: false, powerLevel: 0, locked: false, label: 'KEY 2' } },
      { x: 6, y: 1, block: { type: 'piston', state: false, powered: false, powerLevel: 0, locked: true, label: 'BRIDGE' } },
      { x: 6, y: 2, block: { type: 'lava', locked: true } },
      { x: 7, y: 1, block: { type: 'diamond_block', locked: true, label: 'VAULT' } }
    ],
    checkVictory: (grid) => {
      const piston = grid[1]?.[6];
      const l1 = grid[0]?.[1];
      const l2 = grid[3]?.[1];
      return Boolean(piston && piston.powered && l1?.state && l2?.state);
    },
    rewardXP: 200,
    rewardDiamonds: 4
  },
  {
    id: 4,
    titleEn: 'Repeater Booster: Long Distance Data Bus',
    titleRo: 'Amplificator Repeater: Magistrala de Date la Distanță',
    subtitleEn: 'Overcome redstone signal decay (max 15 blocks) using repeaters',
    subtitleRo: 'Depășește atenuarea semnalului (maxim 15 blocuri) folosind repetoare',
    biome: 'overworld',
    conceptEn: 'Electrical and redstone signals naturally lose energy over distance. Repeaters act as digital relays/amplifiers, refreshing the signal strength back to 15!',
    conceptRo: 'Semnalele electrice și de redstone își pierd puterea pe distanțe lungi. Repetoarele funcționează ca amplificatoare digitale de semnal, restabilind puterea la 15!',
    goalEn: 'Place Repeaters along the long transmission bus to deliver power all the way to the far Server Core Lamp.',
    goalRo: 'Plasează Repetoare de-a lungul magistralei lungi de transmisie pentru a alimenta Lampa Serverului Central.',
    hintEn: 'Redstone signal fades after traveling multiple blocks. Place a Repeater facing right to boost the signal.',
    hintRo: 'Semnalul scade pe măsură ce avansează. Plasează un Repeater orientat spre dreapta pentru a amplifica fluxul.',
    gridWidth: 9,
    gridHeight: 3,
    allowedHotbar: ['redstone_dust', 'repeater', 'stone'],
    initialGrid: [
      { x: 0, y: 1, block: { type: 'lever', state: true, powered: true, powerLevel: 15, locked: false, label: 'MAIN PWR' } },
      { x: 8, y: 1, block: { type: 'redstone_lamp', powered: false, powerLevel: 0, locked: true, label: 'SERVER' } },
      { x: 0, y: 2, block: { type: 'stone', locked: true } },
      { x: 1, y: 2, block: { type: 'stone', locked: true } },
      { x: 2, y: 2, block: { type: 'stone', locked: true } },
      { x: 3, y: 2, block: { type: 'stone', locked: true } },
      { x: 4, y: 2, block: { type: 'stone', locked: true } },
      { x: 5, y: 2, block: { type: 'stone', locked: true } },
      { x: 6, y: 2, block: { type: 'stone', locked: true } },
      { x: 7, y: 2, block: { type: 'stone', locked: true } },
      { x: 8, y: 2, block: { type: 'stone', locked: true } }
    ],
    checkVictory: (grid) => {
      const server = grid[1]?.[8];
      return Boolean(server && server.powered);
    },
    rewardXP: 250,
    rewardDiamonds: 5
  },
  {
    id: 5,
    titleEn: 'Binary Half-Adder: Arithmetic Logic Unit',
    titleRo: 'Sumator Binar: Unitatea Aritmetică Logică (ALU)',
    subtitleEn: 'Calculate Bit Sum (XOR) and Carry Out (AND) for 1 + 1 = 10 in binary',
    subtitleRo: 'Calculează Suma (XOR) și Transportul Carry (AND) pentru 1 + 1 = 10 în binar',
    biome: 'cpu',
    conceptEn: 'A Half Adder is the fundamental building block of all CPU processors. Sum = A XOR B, and Carry = A AND B. When both inputs are 1, Sum=0 and Carry=1 (representing binary 2 / 10).',
    conceptRo: 'Sumatorul Binar este cărămida fundamentală a oricărui procesor CPU. Suma = A XOR B, iar Transportul (Carry) = A AND B. Când ambele intrări sunt 1, Sum=0 și Carry=1 (adică 2 în binar).',
    goalEn: 'Wire the XOR gate to the SUM Lamp and the AND gate to the CARRY Lamp, then set both inputs (BIT A & BIT B) to 1.',
    goalRo: 'Conectează Poarta XOR la Lampa SUMĂ și Poarta AND la Lampa CARRY, apoi comută ambele intrări (BIT A și BIT B) pe 1.',
    hintEn: 'Make sure both A and B feed into both gates. For A=1 & B=1, the SUM lamp will be 0 and the CARRY lamp will be 1!',
    hintRo: 'Asigură-te că ambele intrări ajung în ambele porți. Pentru A=1 și B=1, lampa CARRY trebuie să se aprindă!',
    gridWidth: 9,
    gridHeight: 5,
    allowedHotbar: ['redstone_dust', 'gate_xor', 'gate_and', 'repeater'],
    initialGrid: [
      { x: 1, y: 0, block: { type: 'lever', state: true, powered: true, powerLevel: 15, locked: false, label: 'BIT A' } },
      { x: 1, y: 4, block: { type: 'lever', state: true, powered: true, powerLevel: 15, locked: false, label: 'BIT B' } },
      { x: 7, y: 1, block: { type: 'redstone_lamp', powered: false, powerLevel: 0, locked: true, label: 'SUM (XOR)' } },
      { x: 7, y: 3, block: { type: 'redstone_lamp', powered: false, powerLevel: 0, locked: true, label: 'CARRY (AND)' } }
    ],
    checkVictory: (grid) => {
      const sumLamp = grid[1]?.[7];
      const carryLamp = grid[3]?.[7];
      const bitA = grid[0]?.[1];
      const bitB = grid[4]?.[1];
      return Boolean(bitA?.state && bitB?.state && carryLamp?.powered && !sumLamp?.powered);
    },
    rewardXP: 300,
    rewardDiamonds: 6
  },
  {
    id: 6,
    titleEn: '1-Bit Memory Latch: RAM Storage Cell',
    titleRo: 'Celula de Memorie RAM: 1-Bit RS-Latch',
    subtitleEn: 'Build a feedback circuit that stores data even when input is released',
    subtitleRo: 'Construiește un circuit cu feedback care reține starea chiar și după eliberarea butonului',
    biome: 'cpu',
    conceptEn: 'Computer RAM stores data using bistable logic latches (Flip-Flops). When a SET signal triggers, the cell latches to 1 and keeps powering the memory lamp.',
    conceptRo: 'Memoria RAM din calculatoare stochează date prin circuite bistabile (Flip-Flop). Când semnalul SET se declanșează, celula se blochează pe 1 și păstrează lampa aprinsă.',
    goalEn: 'Build a memory loop with OR Gate and feedback wire so the MEMORY cell stays powered.',
    goalRo: 'Construiește o buclă de memorie cu Poarta OR și fir de feedback astfel încât celula MEMORY să rămână alimentată.',
    hintEn: 'An OR gate connected back into its own input will remember that it was turned ON!',
    hintRo: 'O poartă OR conectată cu ieșirea înapoi în propria intrare își va aminti că a fost pornită!',
    gridWidth: 8,
    gridHeight: 5,
    allowedHotbar: ['redstone_dust', 'gate_or', 'repeater', 'stone'],
    initialGrid: [
      { x: 1, y: 2, block: { type: 'lever', state: true, powered: true, powerLevel: 15, locked: false, label: 'SET PIN' } },
      { x: 6, y: 2, block: { type: 'redstone_lamp', powered: false, powerLevel: 0, locked: true, label: 'RAM CELL' } }
    ],
    checkVictory: (grid) => {
      const ram = grid[2]?.[6];
      return Boolean(ram && ram.powered);
    },
    rewardXP: 350,
    rewardDiamonds: 7
  },
  {
    id: 7,
    titleEn: 'Command Block AI: Automated Voxel Builder',
    titleRo: 'Bloc de Comandă: Automatizarea Algoritmică',
    subtitleEn: 'Execute pseudo-code commands to synthesize diamond blocks',
    subtitleRo: 'Execută comenzi de programare pentru a sintetiza blocuri de diamante',
    biome: 'end',
    conceptEn: 'Minecraft Command Blocks function like executable scripts or microcode in a CPU. When triggered by a redstone pulse, they execute instructions like `/fill`, `/clone`, and `/scoreboard`.',
    conceptRo: 'Blocurile de Comandă din Minecraft funcționează ca scripturi de programare sau instrucțiuni de microcod CPU. La impulsul de redstone, ele rulează instrucțiuni automate.',
    goalEn: 'Place a Command Block wired to the trigger lever and link it to the Diamond Replicator vault.',
    goalRo: 'Așază un Bloc de Comandă conectat la maneta de pornire și leagă-l de seiful Replicatorului de Diamante.',
    hintEn: 'Place Command Block, connect redstone dust from the lever to it, and wire the output to the diamond vault lamp.',
    hintRo: 'Plasează Blocul de Comandă, conectează praful de redstone de la manetă la el și ieșirea spre lampa seifului.',
    gridWidth: 8,
    gridHeight: 4,
    allowedHotbar: ['redstone_dust', 'command_block', 'repeater'],
    initialGrid: [
      { x: 1, y: 1, block: { type: 'lever', state: false, powered: false, powerLevel: 0, locked: false, label: 'RUN SCRIPT' } },
      { x: 6, y: 1, block: { type: 'redstone_lamp', powered: false, powerLevel: 0, locked: true, label: 'SYNTHESIS' } }
    ],
    checkVictory: (grid) => {
      const lamp = grid[1]?.[6];
      return Boolean(lamp && lamp.powered);
    },
    rewardXP: 400,
    rewardDiamonds: 8
  },
  {
    id: 8,
    titleEn: 'The Ultimate Voxel Microprocessor Core',
    titleRo: 'Super-Procesorul Voxel Core (ALU + RAM + Display)',
    subtitleEn: 'Integrate multi-gate logic to power the Central CPU Supercomputer',
    subtitleRo: 'Integrează logica cu porți multiple pentru a alimenta Supercomputerul Central',
    biome: 'cpu',
    conceptEn: 'A complete modern computer combines an ALU, Control Unit, and RAM bus. When all logic conditions are synchronized, the Master Processor activates!',
    conceptRo: 'Un calculator complet combină o Unitate Aritmetică Logică (ALU), o Unitate de Control și magistrala RAM. Când toate condițiile sunt sincronizate, Procesorul Central pornește!',
    goalEn: 'Activate both Control Lines (BUS A and BUS B), route through the master logic matrix, and power all 3 CPU Core Lamps!',
    goalRo: 'Activează ambele Linii de Control (BUS A și BUS B), rutează semnalul prin matricea logică și alimentează toate cele 3 Lămpi CPU!',
    hintEn: 'Connect logic gates (AND / OR) so that the master signal splits and powers Core 1, Core 2, and Core 3.',
    hintRo: 'Conectează porțile logice (AND / OR) astfel încât semnalul să se ramifice și să alimenteze Core 1, Core 2 și Core 3.',
    gridWidth: 9,
    gridHeight: 6,
    allowedHotbar: ['redstone_dust', 'gate_and', 'gate_or', 'repeater', 'redstone_torch'],
    initialGrid: [
      { x: 1, y: 1, block: { type: 'lever', state: true, powered: true, powerLevel: 15, locked: false, label: 'BUS A' } },
      { x: 1, y: 4, block: { type: 'lever', state: true, powered: true, powerLevel: 15, locked: false, label: 'BUS B' } },
      { x: 7, y: 1, block: { type: 'redstone_lamp', powered: false, powerLevel: 0, locked: true, label: 'CORE 1' } },
      { x: 7, y: 3, block: { type: 'redstone_lamp', powered: false, powerLevel: 0, locked: true, label: 'CORE 2' } },
      { x: 7, y: 5, block: { type: 'redstone_lamp', powered: false, powerLevel: 0, locked: true, label: 'CORE 3' } }
    ],
    checkVictory: (grid) => {
      const c1 = grid[1]?.[7];
      const c2 = grid[3]?.[7];
      const c3 = grid[5]?.[7];
      return Boolean(c1?.powered && c2?.powered && c3?.powered);
    },
    rewardXP: 500,
    rewardDiamonds: 10
  }
];

interface MinecraftVoxelArchitectProps {
  onBack: () => void;
  studentName?: string;
}

export const MinecraftVoxelArchitect: React.FC<MinecraftVoxelArchitectProps> = ({ onBack, studentName }) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  // Game Mode: 'story' (missions) or 'sandbox' (free creative mode)
  const [gameMode, setGameMode] = useState<'story' | 'sandbox'>('story');
  const [currentMissionIdx, setCurrentMissionIdx] = useState(0);
  const currentMission = VOXEL_MISSIONS[currentMissionIdx] || VOXEL_MISSIONS[0];

  // Grid Dimensions
  const gridW = gameMode === 'story' ? currentMission.gridWidth : 10;
  const gridH = gameMode === 'story' ? currentMission.gridHeight : 7;

  // Sound Muted State
  const [soundMuted, setSoundMuted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Selected Tool / Block from Hotbar
  const [selectedTool, setSelectedTool] = useState<BlockType | 'pickaxe'>('redstone_dust');

  // Stats & Progress
  const [completedMissions, setCompletedMissions] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('arkedo_voxel_architect_completed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [totalDiamonds, setTotalDiamonds] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('arkedo_voxel_architect_diamonds') || '0');
    } catch {
      return 0;
    }
  });

  const [totalXP, setTotalXP] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_voxel_architect') || '0');
    } catch {
      return 0;
    }
  });

  // Current Grid State
  const [grid, setGrid] = useState<VoxelCell[][]>([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(true);
  const [missionSolved, setMissionSolved] = useState(false);

  // Initialize Grid for current mission or sandbox
  const initGrid = useCallback(() => {
    const newGrid: VoxelCell[][] = [];
    for (let y = 0; y < gridH; y++) {
      const row: VoxelCell[] = [];
      for (let x = 0; x < gridW; x++) {
        row.push({
          type: 'air',
          powered: false,
          powerLevel: 0,
          state: false,
          locked: false
        });
      }
      newGrid.push(row);
    }

    if (gameMode === 'story') {
      currentMission.initialGrid.forEach(({ x, y, block }) => {
        if (y < gridH && x < gridW) {
          newGrid[y][x] = {
            type: block.type || 'stone',
            powered: block.powered || false,
            powerLevel: block.powerLevel || (block.state ? 15 : 0),
            state: block.state || false,
            locked: block.locked !== undefined ? block.locked : true,
            label: block.label
          };
        }
      });
    }

    setGrid(newGrid);
    setMissionSolved(false);
    setShowHint(false);
  }, [gameMode, currentMission, gridW, gridH]);

  useEffect(() => {
    initGrid();
  }, [initGrid]);

  // Propagate Redstone Signals (BFS / Cellular Automata simulation)
  const propagateSignals = useCallback((prevGrid: VoxelCell[][]): VoxelCell[][] => {
    if (!prevGrid.length || !prevGrid[0].length) return prevGrid;

    const rows = prevGrid.length;
    const cols = prevGrid[0].length;

    // Deep clone grid
    const nextGrid: VoxelCell[][] = prevGrid.map((row) =>
      row.map((cell) => ({
        ...cell,
        // Reset dynamic power levels for recalculation
        powered: cell.type === 'lever' ? Boolean(cell.state) : (cell.type === 'redstone_torch' && !cell.locked ? true : false),
        powerLevel: cell.type === 'lever' && cell.state ? 15 : (cell.type === 'redstone_torch' && !cell.locked ? 15 : 0)
      }))
    );

    // Queue for BFS propagation of redstone signals
    interface SignalNode {
      x: number;
      y: number;
      power: number;
    }

    const queue: SignalNode[] = [];

    // 1. Gather all active Power Sources (levers ON, active torches)
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = nextGrid[y][x];
        if (cell.type === 'lever' && cell.state) {
          cell.powered = true;
          cell.powerLevel = 15;
          queue.push({ x, y, power: 15 });
        }
      }
    }

    // 2. Process BFS signal flow along Redstone Wires & Components
    const visited = new Set<string>();

    const neighbors = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 }
    ];

    while (queue.length > 0) {
      const { x, y, power } = queue.shift()!;
      if (power <= 0) continue;

      for (const { dx, dy } of neighbors) {
        const nx = x + dx;
        const ny = y + dy;

        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
          const target = nextGrid[ny][nx];
          const key = `${nx},${ny}`;

          if (target.type === 'redstone_dust') {
            const newPower = power - 1;
            if (newPower > target.powerLevel) {
              target.powerLevel = newPower;
              target.powered = true;
              queue.push({ x: nx, y: ny, power: newPower });
            }
          } else if (
            target.type === 'redstone_lamp' ||
            target.type === 'piston' ||
            target.type === 'iron_door' ||
            target.type === 'command_block'
          ) {
            target.powered = true;
            target.powerLevel = Math.max(target.powerLevel, power - 1);
            if (target.type === 'piston') target.state = true;
            if (target.type === 'iron_door') target.state = true;
          } else if (target.type === 'gate_not') {
            // NOT gate inverts
            target.powered = true; // Input is powered
          } else if (target.type === 'gate_and' || target.type === 'gate_or' || target.type === 'gate_xor') {
            // Logic gates receive signal on inputs
            target.powered = true;
          } else if (target.type === 'repeater') {
            // Repeater boosts to 15!
            target.powered = true;
            target.powerLevel = 15;
            if (!visited.has(key)) {
              visited.add(key);
              // Transmit 15 to neighbor ahead
              queue.push({ x: nx, y: ny, power: 15 });
            }
          }
        }
      }
    }

    // 3. Evaluate Multi-Input Logic Gates (AND, OR, XOR, NOT)
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = nextGrid[y][x];

        if (cell.type === 'gate_and') {
          // Count active adjacent inputs (left, right, up, down)
          let activeInputs = 0;
          for (const { dx, dy } of neighbors) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
              const adj = nextGrid[ny][nx];
              if ((adj.type === 'lever' && adj.state) || (adj.type === 'redstone_dust' && adj.powerLevel > 0)) {
                activeInputs++;
              }
            }
          }
          const gateOutputActive = activeInputs >= 2;
          cell.powerLevel = gateOutputActive ? 15 : 0;
          if (gateOutputActive) {
            // Propagate 15 forward to output
            for (const { dx, dy } of neighbors) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
                const adj = nextGrid[ny][nx];
                if (adj.type === 'redstone_dust' || adj.type === 'redstone_lamp' || adj.type === 'piston' || adj.type === 'iron_door') {
                  adj.powered = true;
                  adj.powerLevel = 15;
                }
              }
            }
          }
        } else if (cell.type === 'gate_or') {
          let hasActiveInput = false;
          for (const { dx, dy } of neighbors) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
              const adj = nextGrid[ny][nx];
              if ((adj.type === 'lever' && adj.state) || (adj.type === 'redstone_dust' && adj.powerLevel > 0) || (adj.type === 'repeater' && adj.powered)) {
                hasActiveInput = true;
              }
            }
          }
          cell.powerLevel = hasActiveInput ? 15 : 0;
          if (hasActiveInput) {
            for (const { dx, dy } of neighbors) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
                const adj = nextGrid[ny][nx];
                if (adj.type === 'redstone_dust' || adj.type === 'redstone_lamp' || adj.type === 'piston' || adj.type === 'iron_door') {
                  adj.powered = true;
                  adj.powerLevel = 15;
                }
              }
            }
          }
        } else if (cell.type === 'gate_xor') {
          let activeInputs = 0;
          for (const { dx, dy } of neighbors) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
              const adj = nextGrid[ny][nx];
              if ((adj.type === 'lever' && adj.state) || (adj.type === 'redstone_dust' && adj.powerLevel > 0)) {
                activeInputs++;
              }
            }
          }
          const xorActive = activeInputs === 1;
          cell.powerLevel = xorActive ? 15 : 0;
          if (xorActive) {
            for (const { dx, dy } of neighbors) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
                const adj = nextGrid[ny][nx];
                if (adj.type === 'redstone_dust' || adj.type === 'redstone_lamp') {
                  adj.powered = true;
                  adj.powerLevel = 15;
                }
              }
            }
          }
        } else if (cell.type === 'gate_not' || cell.type === 'redstone_torch') {
          // Check if any input is powering it
          let isInputPowered = false;
          for (const { dx, dy } of neighbors) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
              const adj = prevGrid[ny][nx];
              if ((adj.type === 'lever' && adj.state) || (adj.type === 'redstone_dust' && adj.powerLevel > 0)) {
                isInputPowered = true;
              }
            }
          }
          const notOutput = !isInputPowered;
          cell.powerLevel = notOutput ? 15 : 0;
          if (notOutput) {
            for (const { dx, dy } of neighbors) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
                const adj = nextGrid[ny][nx];
                if (adj.type === 'redstone_dust' || adj.type === 'iron_door' || adj.type === 'redstone_lamp') {
                  adj.powered = true;
                  adj.powerLevel = 15;
                }
              }
            }
          }
        } else if (cell.type === 'command_block') {
          // If powered by redstone, pulse output
          if (cell.powered) {
            for (const { dx, dy } of neighbors) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
                const adj = nextGrid[ny][nx];
                if (adj.type === 'redstone_dust' || adj.type === 'redstone_lamp') {
                  adj.powered = true;
                  adj.powerLevel = 15;
                }
              }
            }
          }
        }
      }
    }

    return nextGrid;
  }, []);

  // Simulation Tick Loop
  useEffect(() => {
    if (!isSimulationRunning) return;
    const interval = setInterval(() => {
      setGrid((prev) => {
        const next = propagateSignals(prev);
        // Check victory in story mode
        if (gameMode === 'story' && !missionSolved && currentMission.checkVictory(next)) {
          handleMissionComplete();
        }
        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isSimulationRunning, propagateSignals, gameMode, missionSolved, currentMission]);

  // Handle Level Victory
  const handleMissionComplete = () => {
    setMissionSolved(true);
    if (!soundMuted) {
      sounds.playCorrect();
      sounds.playRetro('powerup');
    }

    const newDiamonds = totalDiamonds + currentMission.rewardDiamonds;
    const newXP = totalXP + currentMission.rewardXP;
    setTotalDiamonds(newDiamonds);
    setTotalXP(newXP);

    try {
      localStorage.setItem('arkedo_voxel_architect_diamonds', String(newDiamonds));
      localStorage.setItem('arkedo_highscore_voxel_architect', String(newXP));
      if (!completedMissions.includes(currentMission.id)) {
        const updated = [...completedMissions, currentMission.id];
        setCompletedMissions(updated);
        localStorage.setItem('arkedo_voxel_architect_completed', JSON.stringify(updated));
      }
    } catch {
      // Storage fallback
    }

    // Update Student Firebase Score
    updateStudentArcadeScore('voxel_architect', newXP);
  };

  // Handle Cell Click (Placing / Breaking / Toggling)
  const handleCellClick = (x: number, y: number) => {
    if (y < 0 || y >= gridH || x < 0 || x >= gridW) return;
    const cell = grid[y][x];

    // If cell is a Lever, toggle it regardless of tool (unless locked by story)
    if (cell.type === 'lever') {
      if (!soundMuted) sounds.playClick();
      setGrid((prev) => {
        const next = prev.map((r, ry) =>
          r.map((c, cx) => {
            if (ry === y && cx === x) {
              const newState = !c.state;
              return {
                ...c,
                state: newState,
                powered: newState,
                powerLevel: newState ? 15 : 0
              };
            }
            return c;
          })
        );
        return propagateSignals(next);
      });
      return;
    }

    // If cell is locked in story mode, don't allow modifying
    if (gameMode === 'story' && cell.locked) {
      return;
    }

    // Pickaxe Tool -> Clear to air
    if (selectedTool === 'pickaxe') {
      if (cell.type !== 'air') {
        if (!soundMuted) sounds.playRetro('hit');
        setGrid((prev) => {
          const next = prev.map((r, ry) =>
            r.map((c, cx) => (ry === y && cx === x ? { type: 'air', powered: false, powerLevel: 0, locked: false } : c))
          );
          return propagateSignals(next);
        });
      }
      return;
    }

    // Place selected block
    if (selectedTool) {
      if (!soundMuted) sounds.playClick();
      setGrid((prev) => {
        const next = prev.map((r, ry) =>
          r.map((c, cx) => {
            if (ry === y && cx === x) {
              return {
                type: selectedTool,
                powered: selectedTool === 'redstone_torch',
                powerLevel: selectedTool === 'redstone_torch' ? 15 : 0,
                state: selectedTool === 'lever' ? false : false,
                locked: false
              };
            }
            return c;
          })
        );
        return propagateSignals(next);
      });
    }
  };

  // Next Mission
  const handleNextMission = () => {
    if (currentMissionIdx < VOXEL_MISSIONS.length - 1) {
      setCurrentMissionIdx((prev) => prev + 1);
      if (!soundMuted) sounds.playClick();
    }
  };

  // Reset Mission Grid
  const handleResetMission = () => {
    initGrid();
    if (!soundMuted) sounds.playClick();
  };

  // Available Hotbar Items
  const hotbarItems: { type: BlockType | 'pickaxe'; icon: string; nameEn: string; nameRo: string }[] = useMemo(() => {
    const all = [
      { type: 'pickaxe' as const, icon: '⛏️', nameEn: 'Pickaxe', nameRo: 'Târnăcop' },
      { type: 'redstone_dust' as const, icon: '⚡', nameEn: 'Redstone Dust', nameRo: 'Praf Redstone' },
      { type: 'lever' as const, icon: '🔘', nameEn: 'Lever', nameRo: 'Pârghie' },
      { type: 'redstone_torch' as const, icon: '🔴', nameEn: 'Torch (NOT)', nameRo: 'Torță (NOT)' },
      { type: 'gate_and' as const, icon: '⚙️', nameEn: 'AND Gate', nameRo: 'Poartă AND' },
      { type: 'gate_or' as const, icon: '🔀', nameEn: 'OR Gate', nameRo: 'Poartă OR' },
      { type: 'gate_xor' as const, icon: '🎛️', nameEn: 'XOR Gate', nameRo: 'Poartă XOR' },
      { type: 'gate_not' as const, icon: '🔄', nameEn: 'NOT Gate', nameRo: 'Poartă NOT' },
      { type: 'repeater' as const, icon: '🔁', nameEn: 'Repeater', nameRo: 'Repeater' },
      { type: 'piston' as const, icon: '🪚', nameEn: 'Piston', nameRo: 'Piston' },
      { type: 'redstone_lamp' as const, icon: '💡', nameEn: 'Lamp', nameRo: 'Lampă' },
      { type: 'command_block' as const, icon: '📜', nameEn: 'Command Block', nameRo: 'Bloc Comandă' },
      { type: 'diamond_block' as const, icon: '💎', nameEn: 'Diamond Block', nameRo: 'Bloc Diamant' },
      { type: 'stone' as const, icon: '🧱', nameEn: 'Stone', nameRo: 'Piatră' }
    ];

    if (gameMode === 'sandbox') return all;

    const allowed = currentMission.allowedHotbar;
    return all.filter((item) => item.type === 'pickaxe' || allowed.includes(item.type as BlockType));
  }, [gameMode, currentMission]);

  // Biome Themes
  const biomeTheme = useMemo(() => {
    const b = gameMode === 'story' ? currentMission.biome : 'cpu';
    switch (b) {
      case 'nether':
        return {
          bg: 'from-red-950/80 via-stone-900 to-amber-950/80',
          border: 'border-rose-600/50',
          name: isEn ? 'Cyber Nether Fortress' : 'Fortăreața Criptografică Nether',
          icon: '🔥'
        };
      case 'caves':
        return {
          bg: 'from-stone-950 via-slate-900 to-stone-900',
          border: 'border-slate-700',
          name: isEn ? 'Deepslate Logic Mines' : 'Mina de Circuite Deepslate',
          icon: '⛏️'
        };
      case 'end':
        return {
          bg: 'from-purple-950/80 via-stone-900 to-indigo-950/80',
          border: 'border-purple-500/50',
          name: isEn ? 'The End: Network Skylands' : 'Skylands: Rețele & Scripting',
          icon: '🌌'
        };
      case 'cpu':
        return {
          bg: 'from-cyan-950/80 via-stone-900 to-emerald-950/80',
          border: 'border-cyan-500/50',
          name: isEn ? 'Voxel Microprocessor Core' : 'Nucleul Procesorului Voxel',
          icon: '💻'
        };
      default:
        return {
          bg: 'from-emerald-950/70 via-stone-900 to-stone-950',
          border: 'border-emerald-600/40',
          name: isEn ? 'Overworld Coding Valley' : 'Valea Algoritmilor Overworld',
          icon: '🌿'
        };
    }
  }, [gameMode, currentMission, isEn]);

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 pb-12 select-none animate-fadeIn overflow-x-hidden">
      {/* Top Navigation & Status Bar */}
      <div className={`bg-gradient-to-r ${biomeTheme.bg} border-2 ${biomeTheme.border} rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden`}>
        {/* Glow Particles */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <button
            onClick={onBack}
            className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-600 transition shadow-md cursor-pointer group shrink-0"
            title={isEn ? 'Back to Arcade Hub' : 'Înapoi la Jocuri'}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider">
                <span>{biomeTheme.icon}</span>
                <span>{biomeTheme.name}</span>
              </span>
              <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700 text-[10px] sm:text-[11px] font-mono">
                {gameMode === 'story'
                  ? (isEn ? `Chapter ${currentMissionIdx + 1} / ${VOXEL_MISSIONS.length}` : `Capitolul ${currentMissionIdx + 1} / ${VOXEL_MISSIONS.length}`)
                  : (isEn ? 'Creative Sandbox Lab' : 'Modul Sandbox Liber')}
              </span>
            </div>

            <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-white font-heading tracking-tight break-words flex items-center gap-2">
              <span>{gameMode === 'story' ? (isEn ? currentMission.titleEn : currentMission.titleRo) : (isEn ? 'Voxel Circuit Sandbox' : 'Laboratorul de Arhitectură Voxel')}</span>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            </h2>

            <p className="text-[11px] sm:text-xs md:text-sm text-stone-300 mt-0.5 break-words">
              {gameMode === 'story'
                ? (isEn ? currentMission.subtitleEn : currentMission.subtitleRo)
                : (isEn ? 'Build, test, and wire your own custom microprocessors, RAM cells, and logic gates freely!' : 'Construiește, testează și asamblează propriile circuite, porți logice și memorii RAM!')}
            </p>
          </div>
        </div>

        {/* Stats & Global Controls */}
        <div className="relative z-10 flex items-center justify-between sm:justify-start gap-2 sm:gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-800">
          {/* Mode Switcher */}
          <div className="flex items-center rounded-xl sm:rounded-2xl bg-stone-950 p-1 border border-stone-800">
            <button
              onClick={() => {
                setGameMode('story');
                if (!soundMuted) sounds.playClick();
              }}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-mono font-bold transition cursor-pointer ${
                gameMode === 'story'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {isEn ? 'Story' : 'Misiuni'}
            </button>
            <button
              onClick={() => {
                setGameMode('sandbox');
                if (!soundMuted) sounds.playClick();
              }}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-mono font-bold transition cursor-pointer ${
                gameMode === 'sandbox'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {isEn ? 'Sandbox' : 'Sandbox'}
            </button>
          </div>

          {/* Diamonds Collected */}
          <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center gap-1.5 shadow-inner">
            <span className="text-sm sm:text-base">💎</span>
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
          <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl bg-amber-950/60 border border-amber-500/40 flex items-center gap-1.5 shadow-inner">
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <div>
              <div className="text-[9px] font-mono text-amber-300 uppercase leading-none font-bold">
                XP
              </div>
              <div className="text-xs sm:text-sm font-black text-amber-100 font-mono">
                {totalXP}
              </div>
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-stone-800 hover:bg-stone-750 text-stone-300 border border-stone-700 transition cursor-pointer"
            title={soundMuted ? 'Unmute' : 'Mute'}
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Chapters Bar (Story Mode) */}
      {gameMode === 'story' && (
        <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-2 sm:p-2.5 flex items-center gap-1.5 sm:gap-2 overflow-x-auto shadow-lg max-w-full my-4">
          {VOXEL_MISSIONS.map((ms, idx) => {
            const isCurrent = idx === currentMissionIdx;
            const isDone = completedMissions.includes(ms.id);
            return (
              <button
                key={ms.id}
                onClick={() => {
                  setCurrentMissionIdx(idx);
                  if (!soundMuted) sounds.playClick();
                }}
                className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-mono font-bold transition flex items-center gap-1 sm:gap-1.5 shrink-0 cursor-pointer border ${
                  isCurrent
                    ? 'bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-600/30 ring-2 ring-rose-500/30'
                    : isDone
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900/60'
                    : 'bg-stone-950/80 text-stone-400 border-stone-800 hover:bg-stone-800'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                ) : (
                  <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-stone-800 flex items-center justify-center text-[9px]">
                    {ms.id}
                  </span>
                )}
                <span>{isEn ? `M${ms.id}` : `Cap ${ms.id}`}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Interactive Grid & Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 w-full mt-4">
        {/* Left: Interactive Voxel Simulation Canvas (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-3 sm:gap-4 w-full">
          <div className="bg-stone-900 border-2 border-stone-700 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between w-full">
            {/* Objective Banner */}
            {gameMode === 'story' && (
              <div className="relative z-10 bg-stone-950/90 border border-stone-800 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-start gap-2.5 sm:gap-3 mb-4 backdrop-blur-sm">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Hammer className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                    {isEn ? 'Architect Objective' : 'Obiectivul Arhitectului'}
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-white mt-0.5 leading-relaxed break-words">
                    {isEn ? currentMission.goalEn : currentMission.goalRo}
                  </p>
                </div>
              </div>
            )}

            {/* Voxel Grid Canvas */}
            <div className="overflow-x-auto w-full flex justify-center py-2">
              <div
                className="grid gap-1 sm:gap-2 p-2 sm:p-4 rounded-2xl bg-stone-950 border-4 border-stone-800 shadow-inner"
                style={{
                  gridTemplateColumns: `repeat(${gridW}, minmax(0, 1fr))`
                }}
              >
                {grid.map((row, y) =>
                  row.map((cell, x) => {
                    const isHovered = false;
                    const isWire = cell.type === 'redstone_dust';
                    const isLamp = cell.type === 'redstone_lamp';
                    const isLever = cell.type === 'lever';
                    const isDoor = cell.type === 'iron_door';
                    const isPiston = cell.type === 'piston';

                    // Cell Background & Visual Representation
                    let cellBg = 'bg-stone-900 border-stone-800';
                    let cellContent = null;

                    if (cell.type === 'air') {
                      cellBg = 'bg-stone-950/80 border-stone-850 hover:border-stone-700';
                    } else if (cell.type === 'stone' || cell.type === 'deepslate') {
                      cellBg = 'bg-stone-800 border-stone-700 shadow-sm';
                      cellContent = <span className="text-stone-500 text-[10px] font-mono">🧱</span>;
                    } else if (isWire) {
                      cellBg = cell.powered
                        ? 'bg-rose-950 border-rose-500 ring-2 ring-rose-500/40 shadow-lg shadow-rose-600/30 animate-pulse'
                        : 'bg-stone-900 border-rose-950 text-rose-900';
                      cellContent = (
                        <div className="flex flex-col items-center">
                          <span className={`text-base sm:text-xl font-bold ${cell.powered ? 'text-rose-400' : 'text-stone-600'}`}>⚡</span>
                          <span className={`text-[8px] font-mono font-bold ${cell.powered ? 'text-rose-300' : 'text-stone-700'}`}>
                            {cell.powerLevel}
                          </span>
                        </div>
                      );
                    } else if (isLever) {
                      cellBg = cell.state
                        ? 'bg-rose-950/90 border-rose-400 shadow-md shadow-rose-600/40 ring-2 ring-rose-400/30'
                        : 'bg-stone-900 border-stone-700 hover:border-stone-500';
                      cellContent = (
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-base sm:text-xl">{cell.state ? '⚡' : '🔘'}</span>
                          <span className={`text-[8px] font-mono font-black ${cell.state ? 'text-rose-300' : 'text-stone-500'}`}>
                            {cell.state ? 'ON' : 'OFF'}
                          </span>
                        </div>
                      );
                    } else if (isLamp) {
                      cellBg = cell.powered
                        ? 'bg-gradient-to-b from-amber-500 to-yellow-600 border-yellow-300 text-stone-950 shadow-lg shadow-yellow-500/50 scale-105 animate-pulse'
                        : 'bg-stone-900 border-stone-700 text-stone-600';
                      cellContent = (
                        <div className="flex flex-col items-center">
                          <span className="text-lg sm:text-2xl">{cell.powered ? '💡' : '🌑'}</span>
                          <span className={`text-[8px] font-mono font-bold ${cell.powered ? 'text-stone-950' : 'text-stone-500'}`}>
                            {cell.powered ? 'LAMP ON' : 'LAMP'}
                          </span>
                        </div>
                      );
                    } else if (isPiston) {
                      cellBg = cell.powered
                        ? 'bg-emerald-950 border-emerald-400 shadow-md'
                        : 'bg-stone-900 border-stone-700';
                      cellContent = (
                        <div className="flex flex-col items-center">
                          <span className="text-base sm:text-xl">{cell.powered ? '🪵' : '🪚'}</span>
                          <span className="text-[8px] font-mono text-stone-400">{cell.powered ? 'PUSH' : 'PISTON'}</span>
                        </div>
                      );
                    } else if (isDoor) {
                      cellBg = cell.powered
                        ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                        : 'bg-stone-950 border-stone-700 text-stone-500';
                      cellContent = (
                        <div className="flex flex-col items-center">
                          <span className="text-base sm:text-xl">{cell.powered ? '🚪' : '🔒'}</span>
                          <span className="text-[8px] font-mono font-bold">{cell.powered ? 'OPEN' : 'LOCK'}</span>
                        </div>
                      );
                    } else if (cell.type === 'gate_and') {
                      cellBg = cell.powerLevel > 0
                        ? 'bg-rose-950 border-rose-400 shadow-lg'
                        : 'bg-stone-900 border-stone-700';
                      cellContent = (
                        <div className="flex flex-col items-center">
                          <span className="text-xs sm:text-sm font-black font-mono text-amber-300">AND</span>
                          <span className="text-[8px] font-mono text-stone-400">⚙️</span>
                        </div>
                      );
                    } else if (cell.type === 'gate_or') {
                      cellBg = cell.powerLevel > 0
                        ? 'bg-rose-950 border-rose-400 shadow-lg'
                        : 'bg-stone-900 border-stone-700';
                      cellContent = (
                        <div className="flex flex-col items-center">
                          <span className="text-xs sm:text-sm font-black font-mono text-cyan-300">OR</span>
                          <span className="text-[8px] font-mono text-stone-400">🔀</span>
                        </div>
                      );
                    } else if (cell.type === 'gate_xor') {
                      cellBg = cell.powerLevel > 0
                        ? 'bg-rose-950 border-rose-400 shadow-lg'
                        : 'bg-stone-900 border-stone-700';
                      cellContent = (
                        <div className="flex flex-col items-center">
                          <span className="text-xs sm:text-sm font-black font-mono text-purple-300">XOR</span>
                          <span className="text-[8px] font-mono text-stone-400">🎛️</span>
                        </div>
                      );
                    } else if (cell.type === 'gate_not' || cell.type === 'redstone_torch') {
                      cellBg = cell.powerLevel > 0
                        ? 'bg-rose-950 border-rose-400 shadow-lg'
                        : 'bg-stone-900 border-stone-700';
                      cellContent = (
                        <div className="flex flex-col items-center">
                          <span className="text-base sm:text-xl">{cell.powerLevel > 0 ? '🔴' : '⚫'}</span>
                          <span className="text-[8px] font-mono font-bold text-rose-300">NOT</span>
                        </div>
                      );
                    } else if (cell.type === 'repeater') {
                      cellBg = cell.powered
                        ? 'bg-rose-950 border-rose-400 ring-2 ring-rose-500/40'
                        : 'bg-stone-900 border-stone-700';
                      cellContent = (
                        <div className="flex flex-col items-center">
                          <span className="text-sm sm:text-base">🔁</span>
                          <span className="text-[8px] font-mono text-stone-300">15 PWR</span>
                        </div>
                      );
                    } else if (cell.type === 'command_block') {
                      cellBg = cell.powered
                        ? 'bg-indigo-950 border-indigo-400 shadow-lg shadow-indigo-500/40 animate-pulse'
                        : 'bg-stone-900 border-indigo-900 text-indigo-400';
                      cellContent = (
                        <div className="flex flex-col items-center">
                          <span className="text-base sm:text-xl">📜</span>
                          <span className="text-[8px] font-mono font-bold text-indigo-300">CMD</span>
                        </div>
                      );
                    } else if (cell.type === 'diamond_block') {
                      cellBg = 'bg-cyan-950/80 border-cyan-400 shadow-lg shadow-cyan-500/30';
                      cellContent = <span className="text-lg sm:text-2xl">💎</span>;
                    } else if (cell.type === 'lava') {
                      cellBg = 'bg-orange-950 border-orange-500 animate-pulse';
                      cellContent = <span className="text-lg sm:text-2xl">🔥</span>;
                    }

                    return (
                      <div
                        key={`${x}-${y}`}
                        onClick={() => handleCellClick(x, y)}
                        className={`w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-150 active:scale-95 relative ${cellBg} ${
                          cell.locked ? 'ring-1 ring-stone-700/50' : ''
                        }`}
                        title={`${cell.label || cell.type} (${x},${y})`}
                      >
                        {cellContent}
                        {cell.label && (
                          <div className="absolute -top-1.5 -right-1.5 px-1 py-0.2 bg-stone-950/90 border border-stone-700 text-[7px] font-mono text-amber-300 rounded font-bold uppercase truncate max-w-[42px]">
                            {cell.label}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Victory Banner in Story Mode */}
            {missionSolved && (
              <div className="relative z-10 mt-4 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-950/90 via-stone-900 to-emerald-950/90 border-2 border-emerald-500/80 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 text-xl">
                    💎
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 flex-wrap">
                      <span>{isEn ? 'Voxel Architecture Solved!' : 'Misiune Rezolvată cu Succes!'}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                        +{currentMission.rewardDiamonds} 💎 | +{currentMission.rewardXP} XP
                      </span>
                    </h4>
                    <p className="text-[11px] sm:text-xs text-stone-300">
                      {isEn ? 'Awesome engineering! The redstone circuit criteria was fully met.' : 'Excelent! Circuitul logic funcționează impecabil.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleNextMission}
                  disabled={currentMissionIdx >= VOXEL_MISSIONS.length - 1}
                  className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer disabled:opacity-50 shrink-0 active:scale-95"
                >
                  <span>{isEn ? 'Next Chapter' : 'Capitolul Următor'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="relative z-10 mt-3 sm:mt-4 flex items-center justify-between gap-2 text-xs font-mono text-stone-400 flex-wrap">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setShowGuideModal(true)}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 hover:text-white border border-stone-700 transition flex items-center gap-1.5 cursor-pointer text-[11px] sm:text-xs"
                >
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isEn ? 'Logic Handbook' : 'Manualul Voxel'}</span>
                </button>

                {gameMode === 'story' && (
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-500/30 transition flex items-center gap-1.5 cursor-pointer text-[11px] sm:text-xs"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isEn ? 'Hint' : 'Indiciu'}</span>
                  </button>
                )}
              </div>

              <button
                onClick={handleResetMission}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 hover:text-white border border-stone-700 transition flex items-center gap-1.5 cursor-pointer text-[11px] sm:text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isEn ? 'Reset Grid' : 'Resetează Grila'}</span>
              </button>
            </div>
          </div>

          {/* Minecraft Hotbar (Materials & Tools Selector) */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-3 shadow-xl w-full">
            <div className="text-[11px] font-mono text-stone-400 uppercase font-bold mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Boxes className="w-3.5 h-3.5 text-amber-400" />
                <span>{isEn ? 'Minecraft Tool Belt & Materials' : 'Bara de Unelte & Materiale'}</span>
              </span>
              <span className="text-[10px] text-amber-400 font-mono">
                {isEn ? 'Selected: ' : 'Selectat: '}{selectedTool}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 max-w-full">
              {hotbarItems.map((item) => {
                const isSelected = selectedTool === item.type;
                return (
                  <button
                    key={item.type}
                    onClick={() => {
                      setSelectedTool(item.type);
                      if (!soundMuted) sounds.playClick();
                    }}
                    className={`px-2.5 sm:px-3 py-2 rounded-xl border-2 flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-950/90 border-rose-500 shadow-md shadow-rose-600/30 scale-102 ring-2 ring-rose-500/30'
                        : 'bg-stone-950/80 border-stone-800 hover:border-stone-600'
                    }`}
                  >
                    <span className="text-base sm:text-lg">{item.icon}</span>
                    <span className="text-[10px] sm:text-xs font-mono font-bold text-stone-200">
                      {isEn ? item.nameEn : item.nameRo}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Architectural Concept & Computer Science Guide (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4 w-full">
          {/* Concept Card */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col gap-3 sm:gap-4 w-full">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>{isEn ? 'Hardware Concept' : 'Concept Hardware & Logică TIC'}</span>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-stone-950 border border-stone-800 text-xs text-stone-300 leading-relaxed break-words">
              {gameMode === 'story'
                ? (isEn ? currentMission.conceptEn : currentMission.conceptRo)
                : (isEn ? 'Creative Mode allows you to simulate full microcode ALU units, RAM arrays, and command block automations without constraints.' : 'Modul Liber îți oferă un banc de lucru complet pentru a experimenta cu porți logice, memorii RAM și calculatoare voxel!')}
            </div>

            {/* Hint Box */}
            {showHint && gameMode === 'story' && (
              <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-amber-950/50 border border-amber-500/40 text-amber-200 text-xs leading-relaxed animate-fadeIn flex items-start gap-2 break-words">
                <span className="text-base shrink-0">💡</span>
                <div>
                  <strong className="block text-amber-300 font-bold mb-0.5">{isEn ? 'Architect Tip:' : 'Sfatul Inginerului:'}</strong>
                  {isEn ? currentMission.hintEn : currentMission.hintRo}
                </div>
              </div>
            )}

            {/* Signal Strength & Reference Table */}
            <div className="w-full">
              <div className="text-xs font-mono text-stone-400 font-bold uppercase mb-2 flex items-center justify-between">
                <span>{isEn ? 'Logic Signal Rules' : 'Reguli de Semnal Digital'}</span>
                <span className="text-[10px] text-stone-500">Minecraft TIC</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-stone-800 bg-stone-950 text-xs font-mono w-full">
                <table className="w-full text-left">
                  <thead className="bg-stone-900 border-b border-stone-800 text-stone-400 text-[10px]">
                    <tr>
                      <th className="p-2 sm:p-2.5">{isEn ? 'Component' : 'Componentă'}</th>
                      <th className="p-2 sm:p-2.5 text-center">{isEn ? 'Bit' : 'Stare'}</th>
                      <th className="p-2 sm:p-2.5 text-right">{isEn ? 'Function' : 'Efect'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-850 text-[11px]">
                    <tr>
                      <td className="p-2 sm:p-2.5 text-rose-400 font-bold flex items-center gap-1">
                        <span>⚡</span>
                        <span>Redstone</span>
                      </td>
                      <td className="p-2 sm:p-2.5 text-center text-stone-300">0 - 15</td>
                      <td className="p-2 sm:p-2.5 text-right text-stone-400">{isEn ? 'Bus Wire' : 'Magistrală'}</td>
                    </tr>
                    <tr>
                      <td className="p-2 sm:p-2.5 text-cyan-400 font-bold flex items-center gap-1">
                        <span>🔘</span>
                        <span>Lever</span>
                      </td>
                      <td className="p-2 sm:p-2.5 text-center text-stone-300">0 / 1</td>
                      <td className="p-2 sm:p-2.5 text-right text-stone-400">{isEn ? 'Input Switch' : 'Comutator'}</td>
                    </tr>
                    <tr>
                      <td className="p-2 sm:p-2.5 text-amber-400 font-bold flex items-center gap-1">
                        <span>⚙️</span>
                        <span>AND Gate</span>
                      </td>
                      <td className="p-2 sm:p-2.5 text-center text-stone-300">1 & 1 = 1</td>
                      <td className="p-2 sm:p-2.5 text-right text-stone-400">{isEn ? 'Conjunction' : 'Și logic'}</td>
                    </tr>
                    <tr>
                      <td className="p-2 sm:p-2.5 text-purple-400 font-bold flex items-center gap-1">
                        <span>🎛️</span>
                        <span>XOR Gate</span>
                      </td>
                      <td className="p-2 sm:p-2.5 text-center text-stone-300">1 ^ 0 = 1</td>
                      <td className="p-2 sm:p-2.5 text-right text-stone-400">{isEn ? 'Half-Adder Sum' : 'Sumă Binară'}</td>
                    </tr>
                    <tr>
                      <td className="p-2 sm:p-2.5 text-emerald-400 font-bold flex items-center gap-1">
                        <span>🔁</span>
                        <span>Repeater</span>
                      </td>
                      <td className="p-2 sm:p-2.5 text-center text-stone-300">15 Boost</td>
                      <td className="p-2 sm:p-2.5 text-right text-stone-400">{isEn ? 'Amplifier' : 'Amplificator'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Minecraft Master Architect Badge */}
          <div className="bg-gradient-to-br from-emerald-950/60 to-stone-900 border border-emerald-500/30 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xl flex items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <span className="text-2xl sm:text-3xl shrink-0">🏆</span>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white uppercase font-mono truncate">
                  {isEn ? 'Master Voxel Architect' : 'Arhitect Maestru Voxel'}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-stone-400 mt-0.5">
                  {completedMissions.length} / {VOXEL_MISSIONS.length} {isEn ? 'Chapters Mastered' : 'Capitole Finalizate'}
                </p>
              </div>
            </div>

            <div className="text-right font-mono text-emerald-300 font-bold text-xs sm:text-sm shrink-0">
              {Math.round((completedMissions.length / VOXEL_MISSIONS.length) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Logic Handbook Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-stone-900 border-2 border-stone-700 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
            <h3 className="text-base sm:text-lg font-black text-white font-heading mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
              <span className="break-words">{isEn ? 'Voxel Computer Architecture Guide' : 'Ghidul Arhitectului de Calculatoare Voxel'}</span>
            </h3>

            <p className="text-xs text-stone-300 mb-3 sm:mb-4 leading-relaxed break-words">
              {isEn 
                ? 'Discover how redstone in Minecraft mirrors actual hardware architecture in microprocessors: buses, flip-flop memory cells, full adders, and command microcode.'
                : 'Descoperă cum praful de Redstone din Minecraft reflectă arhitectura reală a procesoarelor: magistrale de date, celule de memorie RAM, sumatoare binare și microcod.'}
            </p>

            <div className="space-y-3 mb-4 text-xs">
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                <strong className="text-amber-300 font-bold block mb-1">1. Semnale Digitale (0 & 1)</strong>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  Pârghiile și torțele emit semnal de nivel 15 (Bit 1 / TRUE). Praful de Redstone transportă acest semnal pe o distanță de maxim 15 blocuri înainte ca el să scadă la 0 (Bit 0 / FALSE).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                <strong className="text-cyan-300 font-bold block mb-1">2. Porți Logice & ALU</strong>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  Porțile AND, OR, NOT și XOR combină semnalele pentru a realiza calcule matematice. Unitatea Aritmetică Logică (ALU) din CPU adună biții prin combinarea porților XOR (Sumă) și AND (Transport/Carry).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                <strong className="text-emerald-300 font-bold block mb-1">3. Memoria RAM (Flip-Flop)</strong>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  Prin conectarea ieșirii unei porți logice înapoi în propria intrare (buclă de feedback), circuitul reține valoarea 1 chiar dacă butonul inițial a fost oprit, simulând un bit de memorie RAM!
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowGuideModal(false)}
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
