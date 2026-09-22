import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle, 
  Zap, 
  Flame, 
  Cpu, 
  HardDrive, 
  Swords, 
  ArrowRight, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { DuelRoomData, DuelPlayer, updateDuelProgress } from '../../lib/duelService';
import { updateStudentArcadeScore } from '../../lib/studentAuthService';

export interface CraftingIngredient {
  id: string;
  nameRo: string;
  nameEn: string;
  icon: string;
  color: string;
}

export interface CraftingRecipe {
  id: string;
  nameRo: string;
  nameEn: string;
  categoryRo: string;
  categoryEn: string;
  icon: string;
  descriptionRo: string;
  descriptionEn: string;
  // 3x3 grid pattern (9 slots: 0 to 8, empty string '' means empty slot)
  grid: string[];
  hintRo: string;
  hintEn: string;
}

export const INGREDIENTS: CraftingIngredient[] = [
  { id: 'silicon', nameRo: 'Siliciu Pur', nameEn: 'Pure Silicon', icon: '💎', color: 'bg-cyan-900/60 border-cyan-500/40' },
  { id: 'copper', nameRo: 'Fir de Cupru', nameEn: 'Copper Wire', icon: '🟤', color: 'bg-amber-900/60 border-amber-600/40' },
  { id: 'transistor', nameRo: 'Tranzistor', nameEn: 'Transistor', icon: '⚡', color: 'bg-yellow-900/60 border-yellow-500/40' },
  { id: 'pcb', nameRo: 'Placă PCB', nameEn: 'PCB Board', icon: '🟩', color: 'bg-emerald-900/60 border-emerald-500/40' },
  { id: 'memory_chip', nameRo: 'Cip Memorie', nameEn: 'Memory Chip', icon: '💾', color: 'bg-indigo-900/60 border-indigo-500/40' },
  { id: 'flash_chip', nameRo: 'Cip Flash', nameEn: 'Flash Chip', icon: '🗄️', color: 'bg-blue-900/60 border-blue-500/40' },
  { id: 'redstone', nameRo: 'Pulbere Redstone', nameEn: 'Redstone Dust', icon: '🔴', color: 'bg-rose-900/60 border-rose-500/40' },
  { id: 'torch', nameRo: 'Torță Redstone', nameEn: 'Redstone Torch', icon: '🏮', color: 'bg-red-900/60 border-red-500/40' },
  { id: 'gold_pins', nameRo: 'Pini Aurii', nameEn: 'Gold Pins', icon: '🟡', color: 'bg-amber-800/60 border-amber-400/40' },
  { id: 'fan', nameRo: 'Ventilator', nameEn: 'Cooling Fan', icon: '🌀', color: 'bg-sky-900/60 border-sky-500/40' },
  { id: 'brick', nameRo: 'Cărămidă Zid', nameEn: 'Firewall Brick', icon: '🧱', color: 'bg-stone-800/80 border-stone-600/40' },
  { id: 'antenna', nameRo: 'Antenă Wi-Fi', nameEn: 'Wi-Fi Antenna', icon: '📡', color: 'bg-purple-900/60 border-purple-500/40' }
];

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  {
    id: 'cpu',
    nameRo: 'Microprocesor CPU (Creierul PC-ului)',
    nameEn: 'CPU Microprocessor (The Brain)',
    categoryRo: 'Hardware TIC',
    categoryEn: 'TIC Hardware',
    icon: '🧠',
    descriptionRo: 'Siliciu sus, Tranzistori la mijloc, Cupru jos.',
    descriptionEn: 'Silicon on top, Transistors in middle, Copper on bottom.',
    grid: [
      'silicon', 'silicon', 'silicon',
      'transistor', 'transistor', 'transistor',
      'copper', 'copper', 'copper'
    ],
    hintRo: 'Pune 3x Siliciu pe rândul 1, 3x Tranzistori pe rândul 2, 3x Cupru pe rândul 3.',
    hintEn: 'Place 3x Silicon in row 1, 3x Transistors in row 2, 3x Copper in row 3.'
  },
  {
    id: 'ram',
    nameRo: 'Modul Memorie RAM 16GB',
    nameEn: '16GB RAM Memory Module',
    categoryRo: 'Memorie Volatilă',
    categoryEn: 'Volatile Memory',
    icon: '⚡',
    descriptionRo: 'Placă PCB sus, Cipuri de memorie la mijloc, Pini aurii jos.',
    descriptionEn: 'PCB on top, Memory chips in middle, Gold pins on bottom.',
    grid: [
      'pcb', 'pcb', 'pcb',
      'memory_chip', 'memory_chip', 'memory_chip',
      'gold_pins', 'gold_pins', 'gold_pins'
    ],
    hintRo: 'Rând 1: 3x PCB verde, Rând 2: 3x Cipuri, Rând 3: 3x Pini de aur.',
    hintEn: 'Row 1: 3x Green PCB, Row 2: 3x Chips, Row 3: 3x Gold Pins.'
  },
  {
    id: 'ssd',
    nameRo: 'SSD Ultra-Rapid 1TB',
    nameEn: '1TB Ultra-Fast SSD',
    categoryRo: 'Stocare Date',
    categoryEn: 'Data Storage',
    icon: '💾',
    descriptionRo: 'Placă PCB cu 3 Cipuri Flash și pini aurii.',
    descriptionEn: 'PCB board with 3 Flash chips and gold contacts.',
    grid: [
      'pcb', 'flash_chip', 'pcb',
      'flash_chip', 'flash_chip', 'flash_chip',
      'gold_pins', 'gold_pins', 'gold_pins'
    ],
    hintRo: 'Colțurile sus sunt PCB, mijlocul e plin de Cipuri Flash, jos sunt Pini aurii.',
    hintEn: 'Top corners PCB, center filled with Flash chips, bottom Gold pins.'
  },
  {
    id: 'gpu',
    nameRo: 'Placă Video GPU RTX Gamer',
    nameEn: 'RTX Gamer Video Card',
    categoryRo: 'Procesare Grafică',
    categoryEn: 'Graphics Processing',
    icon: '🎮',
    descriptionRo: 'Ventilator sus, Cipuri memorie pe laterale, Siliciu în centru, PCB jos.',
    descriptionEn: 'Fan on top, Memory on sides, Silicon in center, PCB bottom.',
    grid: [
      '', 'fan', '',
      'memory_chip', 'silicon', 'memory_chip',
      'pcb', 'gold_pins', 'pcb'
    ],
    hintRo: 'Sus centru: Ventilator. Mijloc: Cip - Siliciu - Cip. Jos: PCB - Pini - PCB.',
    hintEn: 'Top center: Fan. Middle: Chip - Silicon - Chip. Bottom: PCB - Pins - PCB.'
  },
  {
    id: 'router',
    nameRo: 'Router Wi-Fi Gigabit',
    nameEn: 'Gigabit Wi-Fi Router',
    categoryRo: 'Rețele & Internet',
    categoryEn: 'Networking & Internet',
    icon: '📡',
    descriptionRo: 'Două Antene sus, Transmisie în mijloc, Carcasă jos.',
    descriptionEn: 'Two Antennas on top, Transmission in middle, Chassis bottom.',
    grid: [
      'antenna', '', 'antenna',
      'pcb', 'transistor', 'pcb',
      'copper', 'copper', 'copper'
    ],
    hintRo: 'Sus colțuri: 2x Antene. Mijloc: PCB - Tranzistor - PCB. Jos: 3x Cupru.',
    hintEn: 'Top corners: 2x Antennas. Middle: PCB - Transistor - PCB. Bottom: 3x Copper.'
  },
  {
    id: 'firewall',
    nameRo: 'Zid de Securitate Firewall',
    nameEn: 'Firewall Security Wall',
    categoryRo: 'Securitate Cibernetică',
    categoryEn: 'Cybersecurity',
    icon: '🧱',
    descriptionRo: 'Zid de cărămizi cu tranzistori de filtrare pachete.',
    descriptionEn: 'Brick wall with packet filtering transistors.',
    grid: [
      'brick', 'brick', 'brick',
      'brick', 'transistor', 'brick',
      'brick', 'brick', 'brick'
    ],
    hintRo: 'Umple marginea cu 8x Cărămizi și pune 1x Tranzistor în mijloc!',
    hintEn: 'Fill the outer border with 8x Bricks and put 1x Transistor in center!'
  },
  {
    id: 'binary_5',
    nameRo: 'Cod Binar Redstone: 101₂ (Zecimal: 5)',
    nameEn: 'Redstone Binary Code: 101₂ (Decimal: 5)',
    categoryRo: 'Binar & Logică',
    categoryEn: 'Binary & Logic',
    icon: '🔢',
    descriptionRo: 'Torță (1), Spațiu Gol (0), Torță (1) pe rândul de sus, pulbere jos.',
    descriptionEn: 'Torch (1), Empty (0), Torch (1) on top row, dust on bottom.',
    grid: [
      'torch', '', 'torch',
      'redstone', 'redstone', 'redstone',
      'copper', 'copper', 'copper'
    ],
    hintRo: 'Rând 1: Torță - Gol - Torță (reprezintă 1 0 1 în binar). Rând 2: Redstone.',
    hintEn: 'Row 1: Torch - Empty - Torch (represents 1 0 1 in binary). Row 2: Redstone.'
  },
  {
    id: 'and_gate',
    nameRo: 'Poartă Logică AND cu Redstone',
    nameEn: 'AND Logic Gate with Redstone',
    categoryRo: 'Circuite Logice',
    categoryEn: 'Logic Circuits',
    icon: '⚡',
    descriptionRo: 'Două torțe de intrare, pulbere redstone la mijloc.',
    descriptionEn: 'Two input torches, redstone dust in the center.',
    grid: [
      'torch', '', 'torch',
      '', 'redstone', '',
      'copper', 'copper', 'copper'
    ],
    hintRo: 'Sus: Torță - Gol - Torță. Mijloc: Gol - Redstone - Gol. Jos: 3x Cupru.',
    hintEn: 'Top: Torch - Empty - Torch. Center: Empty - Redstone - Empty. Bottom: 3x Copper.'
  }
];

interface SpeedCraftingDuelGameProps {
  room: DuelRoomData;
  currentPlayer: DuelPlayer;
  opponent: DuelPlayer | null;
  onVictory: () => void;
}

export const SpeedCraftingDuelGame: React.FC<SpeedCraftingDuelGameProps> = ({
  room,
  currentPlayer,
  opponent,
  onVictory
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const TARGET_CRAFTS_TO_WIN = 5;

  const [currentRecipeIndex, setCurrentRecipeIndex] = useState<number>(0);
  const [craftingGrid, setCraftingGrid] = useState<string[]>(Array(9).fill(''));
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
  const [craftedCount, setCraftedCount] = useState<number>(0);
  const [diamondsWon, setDiamondsWon] = useState<number>(0);
  const [showRecipeBlueprint, setShowRecipeBlueprint] = useState<boolean>(true);
  const [craftAnimation, setCraftAnimation] = useState<boolean>(false);
  const [hasFinished, setHasFinished] = useState<boolean>(false);

  const activeRecipe = CRAFTING_RECIPES[currentRecipeIndex % CRAFTING_RECIPES.length];

  // Handle placing ingredient into a grid cell
  const handleCellClick = (cellIndex: number) => {
    const newGrid = [...craftingGrid];
    if (selectedIngredient) {
      newGrid[cellIndex] = selectedIngredient;
      sounds.playClick();
    } else {
      // Clear cell if clicked with nothing selected
      newGrid[cellIndex] = '';
      sounds.playClick();
    }
    setCraftingGrid(newGrid);
  };

  const handleClearGrid = () => {
    setCraftingGrid(Array(9).fill(''));
    sounds.playClick();
  };

  // Check if current 3x3 grid matches the target recipe
  const handleCraftSubmit = async () => {
    const isCorrect = activeRecipe.grid.every((requiredItem, idx) => {
      return (craftingGrid[idx] || '') === (requiredItem || '');
    });

    if (isCorrect) {
      setCraftAnimation(true);
      sounds.playCorrect();

      const newCraftedCount = craftedCount + 1;
      const newDiamonds = diamondsWon + 1;
      setCraftedCount(newCraftedCount);
      setDiamondsWon(newDiamonds);

      const progressPercent = Math.min(100, Math.round((newCraftedCount / TARGET_CRAFTS_TO_WIN) * 100));
      const isHost = room.host.id === currentPlayer.id;

      // Sync progress with Firebase Duel room
      await updateDuelProgress(room.roomCode, isHost, {
        score: newCraftedCount * 100,
        progress: progressPercent,
        currentStageIndex: newCraftedCount
      });

      // Check if player won match
      if (newCraftedCount >= TARGET_CRAFTS_TO_WIN && !hasFinished) {
        setHasFinished(true);
        sounds.playVictory();
        await updateDuelProgress(
          room.roomCode, 
          isHost, 
          {
            score: newCraftedCount * 100,
            progress: 100,
            currentStageIndex: newCraftedCount
          },
          currentPlayer.id,
          currentPlayer.name
        );
        onVictory();
      } else {
        // Advance to next recipe
        setTimeout(() => {
          setCurrentRecipeIndex((prev) => prev + 1);
          setCraftingGrid(Array(9).fill(''));
          setCraftAnimation(false);
        }, 800);
      }
    } else {
      sounds.playWrong();
    }
  };

  const opponentCrafts = opponent?.currentStageIndex || 0;
  const opponentProgress = opponent?.progress || 0;

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto pb-10 select-none animate-fadeIn">
      {/* Top 1v1 Race HUD */}
      <div className="bg-stone-900 border-2 border-stone-700 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-2xl shrink-0 shadow-md">
            {currentPlayer.avatar || '⛏️'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                {isEn ? 'You (Crafter)' : 'Tu (Inginer TIC)'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px]">
                {craftedCount} / {TARGET_CRAFTS_TO_WIN} 💎
              </span>
            </div>
            <div className="font-black text-white text-base truncate">
              {currentPlayer.name}
            </div>
            {/* Progress Bar */}
            <div className="w-full sm:w-48 bg-stone-950 rounded-full h-2 mt-1.5 overflow-hidden border border-stone-700">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-300 rounded-full"
                style={{ width: `${(craftedCount / TARGET_CRAFTS_TO_WIN) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center Match Status */}
        <div className="flex flex-col items-center justify-center px-4 py-1.5 rounded-2xl bg-stone-950/80 border border-stone-800 shrink-0">
          <div className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400 font-bold uppercase">
            <Swords className="w-3.5 h-3.5 text-rose-500" />
            <span>Minecraft Crafting Race</span>
          </div>
          <div className="text-xs text-stone-400 mt-0.5">
            {isEn ? `First to ${TARGET_CRAFTS_TO_WIN} Diamonds Wins!` : `Primul la ${TARGET_CRAFTS_TO_WIN} Diamante Câștigă!`}
          </div>
        </div>

        {/* Opponent Info */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="text-right flex-1 md:flex-initial">
            <div className="flex items-center justify-end gap-2">
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px]">
                {opponentCrafts} / {TARGET_CRAFTS_TO_WIN} 💎
              </span>
              <span className="text-xs font-mono font-bold text-rose-400 uppercase">
                {isEn ? 'Opponent' : 'Adversar'}
              </span>
            </div>
            <div className="font-black text-white text-base truncate">
              {opponent?.name || (isEn ? 'Waiting...' : 'Se așteaptă...')}
            </div>
            {/* Progress Bar */}
            <div className="w-full sm:w-48 bg-stone-950 rounded-full h-2 mt-1.5 overflow-hidden border border-stone-700 ml-auto">
              <div 
                className="bg-gradient-to-r from-rose-500 to-amber-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${opponentProgress}%` }}
              />
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center text-2xl shrink-0 shadow-md">
            {opponent?.avatar || '🤖'}
          </div>
        </div>
      </div>

      {/* Target Recipe Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 border-2 border-amber-500/60 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl shrink-0 shadow-lg shadow-amber-500/20">
            {activeRecipe.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold uppercase border border-amber-500/30">
                {isEn ? activeRecipe.categoryEn : activeRecipe.categoryRo}
              </span>
              <span className="text-xs font-mono text-stone-400">
                {isEn ? `Recipe ${currentRecipeIndex + 1}` : `Rețeta ${currentRecipeIndex + 1}`}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white font-heading mt-0.5">
              {isEn ? activeRecipe.nameEn : activeRecipe.nameRo}
            </h3>
            <p className="text-xs text-stone-300 mt-0.5">
              {isEn ? activeRecipe.descriptionEn : activeRecipe.descriptionRo}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowRecipeBlueprint(!showRecipeBlueprint)}
          className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Info className="w-4 h-4 text-cyan-400" />
          <span>{showRecipeBlueprint ? (isEn ? 'Hide Blueprint' : 'Ascunde Schema') : (isEn ? 'Show Blueprint' : 'Arată Schema')}</span>
        </button>
      </div>

      {/* Main Crafting Table & Inventory Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 3x3 Minecraft Crafting Table (7 cols) */}
        <div className="lg:col-span-7 bg-stone-900 border-2 border-stone-700 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-between min-h-[420px]">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold uppercase text-stone-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>{isEn ? '3x3 Crafting Table' : 'Masă de Lucru 3x3'}</span>
            </span>

            <button
              onClick={handleClearGrid}
              className="px-3 py-1 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 hover:text-white border border-stone-700 text-xs font-mono transition flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isEn ? 'Clear Grid' : 'Golește Grila'}</span>
            </button>
          </div>

          {/* 3x3 Voxel Grid & Output Slot */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-auto">
            {/* 3x3 Grid Slots */}
            <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-3xl bg-stone-950 border-4 border-stone-800 shadow-inner">
              {craftingGrid.map((cellIngredientId, idx) => {
                const ingredient = INGREDIENTS.find((ing) => ing.id === cellIngredientId);

                return (
                  <div
                    key={idx}
                    onClick={() => handleCellClick(idx)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-150 active:scale-95 shadow-md ${
                      cellIngredientId && ingredient
                        ? `${ingredient.color} border-stone-400 scale-102`
                        : 'bg-stone-900/90 border-stone-800 hover:border-stone-600'
                    }`}
                  >
                    {ingredient ? (
                      <span className="text-2xl sm:text-3xl animate-fadeIn">{ingredient.icon}</span>
                    ) : (
                      <span className="text-stone-700 font-mono text-xs font-bold">{idx + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Arrow */}
            <div className="text-stone-500 flex flex-col items-center">
              <ArrowRight className="w-8 h-8 text-amber-400 animate-pulse hidden sm:block" />
            </div>

            {/* Output Slot & CRAFT Button */}
            <div className="flex flex-col items-center gap-3">
              <div className={`w-24 h-24 rounded-3xl border-4 flex flex-col items-center justify-center transition-all shadow-xl ${
                craftAnimation
                  ? 'bg-emerald-500/20 border-emerald-400 shadow-emerald-500/40 scale-110'
                  : 'bg-stone-950 border-stone-700'
              }`}>
                <span className="text-4xl">{activeRecipe.icon}</span>
              </div>

              <button
                onClick={handleCraftSubmit}
                className="w-full px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black font-heading text-sm uppercase tracking-wider transition shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-stone-950" />
                <span>{isEn ? 'Craft Item!' : 'CRAFTEAZĂ!'}</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] font-mono text-stone-400 mt-3 text-center">
            {isEn 
              ? 'Select an ingredient below, then click any cell on the grid to place it.' 
              : 'Selectează un ingredient mai jos, apoi apasă pe căsuțele din grilă pentru a-l plasa.'}
          </div>
        </div>

        {/* Right: Ingredients Palette & Blueprint (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Blueprint Reference if opened */}
          {showRecipeBlueprint && (
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-xl animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isEn ? 'Recipe Blueprint' : 'Schema Rețetei'}</span>
                </span>
                <span className="text-[10px] font-mono text-stone-400">3x3 Layout</span>
              </div>

              {/* Mini 3x3 Target Preview */}
              <div className="grid grid-cols-3 gap-1.5 p-2 rounded-2xl bg-stone-950 border border-stone-800 mb-3 max-w-[200px] mx-auto">
                {activeRecipe.grid.map((reqId, rIdx) => {
                  const reqIng = INGREDIENTS.find((i) => i.id === reqId);
                  return (
                    <div
                      key={rIdx}
                      className="w-12 h-12 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-lg"
                      title={reqIng ? (isEn ? reqIng.nameEn : reqIng.nameRo) : 'Gol'}
                    >
                      {reqIng ? reqIng.icon : <span className="text-stone-700 text-xs">·</span>}
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-stone-300 leading-relaxed bg-stone-950/80 p-3 rounded-xl border border-stone-800">
                <strong className="text-cyan-300 font-bold block mb-0.5">{isEn ? 'Assembly Hint:' : 'Indiciu Asamblare:'}</strong>
                {isEn ? activeRecipe.hintEn : activeRecipe.hintRo}
              </p>
            </div>
          )}

          {/* Minecraft Inventory Palette */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold uppercase text-stone-400">
                  {isEn ? 'Minecraft Materials Inventory' : 'Inventar Resurse TIC'}
                </span>
                {selectedIngredient && (
                  <span className="text-[10px] font-mono text-amber-400">
                    {isEn ? 'Selected' : 'Selectat'}: {INGREDIENTS.find((i) => i.id === selectedIngredient)?.nameRo}
                  </span>
                )}
              </div>

              {/* Grid of Materials */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {INGREDIENTS.map((ing) => {
                  const isSel = selectedIngredient === ing.id;
                  return (
                    <button
                      key={ing.id}
                      onClick={() => {
                        setSelectedIngredient(ing.id);
                        sounds.playClick();
                      }}
                      className={`p-2.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        isSel
                          ? `${ing.color} border-amber-400 ring-2 ring-amber-400/30 scale-105 shadow-lg`
                          : 'bg-stone-950/90 border-stone-800 hover:border-stone-600'
                      }`}
                    >
                      <span className="text-2xl">{ing.icon}</span>
                      <span className="text-[10px] font-mono text-stone-300 font-bold truncate max-w-full">
                        {isEn ? ing.nameEn : ing.nameRo}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
