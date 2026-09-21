import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { sounds } from '../../utils/audio';
import { updateActiveArcadeScore } from '../../lib/studentAuthService';
import {
  ArrowLeft,
  RotateCcw,
  Trophy,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  HardDrive,
  Cpu,
  Zap,
  Info,
  Layers,
  ChevronRight,
  Flame,
  Star,
  Award
} from 'lucide-react';

interface ByteSliderProps {
  onBack: () => void;
  studentName?: string;
}

// The 8 educational data units in strict ascending order (0 to 7)
export interface DataUnit {
  id: number;
  name: string;
  symbol: string;
  sub: string;
  sizeDesc: string;
  realWorldExample: string;
  color: string;
}

export const DATA_UNITS: DataUnit[] = [
  {
    id: 0,
    name: 'Bit',
    symbol: 'b',
    sub: '0 sau 1',
    sizeDesc: 'Cea mai mică unitate (puls electric binar)',
    realWorldExample: 'Starea unui comutator (stins / aprins)',
    color: 'from-sky-500 to-blue-600',
  },
  {
    id: 1,
    name: 'Byte',
    symbol: 'B',
    sub: '8 biți (1 Octet)',
    sizeDesc: '1 Octet = 8 biți consecutivi',
    realWorldExample: 'Un caracter sau o literă de text (ex: "A")',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 2,
    name: 'Kilobyte',
    symbol: 'KB',
    sub: '1024 Bytes',
    sizeDesc: '1 KB = 1024 Octeți (2¹⁰ B)',
    realWorldExample: 'O pagină de text simplu sau un email scurt',
    color: 'from-indigo-500 to-violet-600',
  },
  {
    id: 3,
    name: 'Megabyte',
    symbol: 'MB',
    sub: '1024 KB',
    sizeDesc: '1 MB = 1024 KB (aprox. 1 milion de octeți)',
    realWorldExample: 'O melodie MP3 de 3 min sau o poză de telefon',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 4,
    name: 'Gigabyte',
    symbol: 'GB',
    sub: '1024 MB',
    sizeDesc: '1 GB = 1024 MB (aprox. 1 miliard de octeți)',
    realWorldExample: 'Un film HD de 2 ore sau un joc video modern',
    color: 'from-purple-500 to-fuchsia-600',
  },
  {
    id: 5,
    name: 'Terabyte',
    symbol: 'TB',
    sub: '1024 GB',
    sizeDesc: '1 TB = 1024 GB (aprox. 1 mie de miliarde octeți)',
    realWorldExample: 'Capacitatea unui SSD sau Hard Disk modern',
    color: 'from-fuchsia-500 to-rose-600',
  },
  {
    id: 6,
    name: 'Petabyte',
    symbol: 'PB',
    sub: '1024 TB',
    sizeDesc: '1 PB = 1024 TB (baze de date masive)',
    realWorldExample: 'Arhiva completă a tuturor filmelor de pe un server Cloud',
    color: 'from-rose-500 to-amber-600',
  },
  {
    id: 7,
    name: 'Exabyte',
    symbol: 'EB',
    sub: '1024 PB',
    sizeDesc: '1 EB = 1024 PB (scară planetară de date)',
    realWorldExample: 'Tot traficul de date transmis pe Internet într-o lună!',
    color: 'from-amber-500 to-emerald-600',
  },
];

const EMPTY_INDEX = 8; // Row 2, Col 2 (bottom right)
const GRID_SIZE = 3;

export const ByteSliderGame: React.FC<ByteSliderProps> = ({ onBack, studentName }) => {
  const { lang } = useLanguage();
  const arky = useArky();
  const arkyRef = useRef(arky);
  arkyRef.current = arky;
  const langRef = useRef(lang);
  langRef.current = lang;

  // Board state: an array of 9 slots (indices 0..8).
  // board[i] contains the tile id (0..7) or null for empty space.
  const [board, setBoard] = useState<(number | null)[]>([0, 1, 2, 3, 4, 5, 6, 7, null]);
  const [moves, setMoves] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [shuffleStep, setShuffleStep] = useState<number>(0);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [selectedUnitInfo, setSelectedUnitInfo] = useState<DataUnit | null>(null);
  const [showCheatSheet, setShowCheatSheet] = useState<boolean>(false);

  // High score
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_byte_slider') || '0');
    } catch {
      return 0;
    }
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const shuffleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef<boolean>(false);

  const boardRef = useRef(board);
  boardRef.current = board;
  const isShufflingRef = useRef(isShuffling);
  isShufflingRef.current = isShuffling;
  const hasWonRef = useRef(hasWon);
  hasWonRef.current = hasWon;

  // Timer logic
  useEffect(() => {
    if (isPlaying && !hasWon) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, hasWon]);

  // Check if position is adjacent to empty space
  const getAdjacentIndices = (emptyPos: number): number[] => {
    const row = Math.floor(emptyPos / GRID_SIZE);
    const col = emptyPos % GRID_SIZE;
    const adjacent: number[] = [];

    if (row > 0) adjacent.push(emptyPos - GRID_SIZE); // Up
    if (row < GRID_SIZE - 1) adjacent.push(emptyPos + GRID_SIZE); // Down
    if (col > 0) adjacent.push(emptyPos - 1); // Left
    if (col < GRID_SIZE - 1) adjacent.push(emptyPos + 1); // Right

    return adjacent;
  };

  // Check if puzzle is solved
  const checkVictory = (currentBoard: (number | null)[]): boolean => {
    for (let i = 0; i < 8; i++) {
      if (currentBoard[i] !== i) return false;
    }
    return currentBoard[EMPTY_INDEX] === null;
  };

  // Soft Shuffle Algorithm:
  // Starts from solved configuration and simulates 18 to 25 valid sliding moves
  // so the puzzle is 100% mathematically solvable and not overly frustrating.
  const performSoftShuffle = useCallback(() => {
    if (shuffleIntervalRef.current) {
      clearInterval(shuffleIntervalRef.current);
      shuffleIntervalRef.current = null;
    }

    setIsShuffling(true);
    setIsPlaying(false);
    setHasWon(false);
    setMoves(0);
    setSeconds(0);

    // Initial solved configuration
    let currentBoard: (number | null)[] = [0, 1, 2, 3, 4, 5, 6, 7, null];
    let emptyPos = EMPTY_INDEX;
    let prevEmptyPos = -1;

    const totalShuffleSteps = Math.floor(Math.random() * 8) + 18; // 18 to 25 steps
    const shuffleStepsHistory: (number | null)[][] = [];

    for (let step = 0; step < totalShuffleSteps; step++) {
      const candidates = getAdjacentIndices(emptyPos).filter((pos) => pos !== prevEmptyPos);
      const chosenPos = candidates[Math.floor(Math.random() * candidates.length)] ?? candidates[0];

      // Slide tile from chosenPos into emptyPos
      const nextBoard = [...currentBoard];
      nextBoard[emptyPos] = nextBoard[chosenPos];
      nextBoard[chosenPos] = null;

      prevEmptyPos = emptyPos;
      emptyPos = chosenPos;
      currentBoard = nextBoard;
      shuffleStepsHistory.push([...nextBoard]);
    }

    // Ensure it's not solved by pure chance
    if (checkVictory(currentBoard)) {
      const candidates = getAdjacentIndices(emptyPos);
      const chosenPos = candidates[0];
      currentBoard[emptyPos] = currentBoard[chosenPos];
      currentBoard[chosenPos] = null;
      shuffleStepsHistory.push([...currentBoard]);
    }

    // Animated shuffle sequence
    let currentStep = 0;
    shuffleIntervalRef.current = setInterval(() => {
      if (currentStep < shuffleStepsHistory.length) {
        setBoard(shuffleStepsHistory[currentStep]);
        setShuffleStep(currentStep + 1);
        if (currentStep % 4 === 0) {
          sounds.playClick();
        }
        currentStep++;
      } else {
        if (shuffleIntervalRef.current) {
          clearInterval(shuffleIntervalRef.current);
          shuffleIntervalRef.current = null;
        }
        setIsShuffling(false);
        setShuffleStep(0);
        sounds.playCorrect();
        arkyRef.current.triggerIdle(
          langRef.current === 'en'
            ? 'Byte Slider is ready! Slide tiles to order units from Bit to Exabyte! 🎮'
            : 'Puzzle-ul este pregătit! Glisează piesele pentru a ordona unitățile de la Bit la Exabyte! 🎮'
        );
      }
    }, 45); // Smooth 45ms per animation step
  }, []);

  // Initial load - strictly runs once on component mount
  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      performSoftShuffle();
    }
    return () => {
      if (shuffleIntervalRef.current) {
        clearInterval(shuffleIntervalRef.current);
        shuffleIntervalRef.current = null;
      }
    };
  }, [performSoftShuffle]);

  // Move tile handler
  const handleTileClick = (clickedIndex: number) => {
    if (isShufflingRef.current || hasWonRef.current) return;

    const currentBoard = boardRef.current;
    const emptyPos = currentBoard.indexOf(null);
    if (emptyPos === -1) return;

    const adjacent = getAdjacentIndices(emptyPos);
    if (!adjacent.includes(clickedIndex)) {
      // Tile cannot move
      return;
    }

    // Start timer on first move
    if (!isPlaying) {
      setIsPlaying(true);
    }

    // Swap clicked tile with empty slot
    const newBoard = [...currentBoard];
    newBoard[emptyPos] = newBoard[clickedIndex];
    newBoard[clickedIndex] = null;

    sounds.playClick();
    setBoard(newBoard);
    const newMoves = moves + 1;
    setMoves(newMoves);

    // Check if tile is now in correct position
    const movedTileId = newBoard[emptyPos];
    if (movedTileId === emptyPos) {
      // Subtle sound or feedback for correct placement
    }

    // Check victory
    if (checkVictory(newBoard)) {
      setHasWon(true);
      setIsPlaying(false);
      sounds.playVictory();

      // Calculate score: Base 1200 - moves*15 - seconds*5 with guaranteed minimum
      const calculatedScore = Math.max(300, 1500 - newMoves * 15 - seconds * 5) + (newMoves <= 25 ? 250 : 100);

      if (calculatedScore > highScore) {
        setHighScore(calculatedScore);
        try {
          localStorage.setItem('arkedo_highscore_byte_slider', String(calculatedScore));
        } catch {
          // LocalStorage fallback
        }
      }

      // Save to active profile & Firebase
      updateActiveArcadeScore('byte_slider', calculatedScore);

      // Trigger Arky victory mascot
      arkyRef.current.triggerFinished(
        langRef.current === 'en'
          ? `VICTORY! You sorted all data units from Bit to Exabyte in ${newMoves} moves and ${formatTime(seconds)}! Excellent logic! 🏆💾`
          : `VICTORIE! Ai ordonat perfect unitățile de măsură, de la Bit până la Exabyte, în ${newMoves} mutări și ${formatTime(seconds)}! Ești un adevărat maestru TIC! 🏆💾`
      );
    }
  };

  const handleTileClickRef = useRef(handleTileClick);
  handleTileClickRef.current = handleTileClick;

  // Keyboard navigation (Arrow keys / WASD)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isShufflingRef.current || hasWonRef.current) return;

      const currentBoard = boardRef.current;
      const emptyPos = currentBoard.indexOf(null);
      if (emptyPos === -1) return;

      const row = Math.floor(emptyPos / GRID_SIZE);
      const col = emptyPos % GRID_SIZE;

      let targetIndex: number | null = null;

      // When user presses ArrowUp, move the tile BELOW the empty space UP into the empty space
      if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        if (row < GRID_SIZE - 1) targetIndex = emptyPos + GRID_SIZE;
      } else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
        if (row > 0) targetIndex = emptyPos - GRID_SIZE;
      } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        if (col < GRID_SIZE - 1) targetIndex = emptyPos + 1;
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        if (col > 0) targetIndex = emptyPos - 1;
      }

      if (targetIndex !== null) {
        e.preventDefault();
        handleTileClickRef.current(targetIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Helper: Count tiles currently in correct position
  const correctTilesCount = board.reduce<number>((count, tileId, index) => {
    if (tileId !== null && tileId === index) {
      return count + 1;
    }
    return count;
  }, 0);

  // Format time (mm:ss)
  const formatTime = (totalSeconds: number): string => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const emptyPos = board.indexOf(null);
  const adjacentToEmpty = emptyPos !== -1 ? getAdjacentIndices(emptyPos) : [];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12 animate-fadeIn">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 backdrop-blur shadow-xl">
        <div className="flex items-center gap-3">
          <button
            id="byte-slider-btn-back"
            type="button"
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'en' ? 'Back to Arcade' : 'Înapoi la Jocuri'}</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Puzzle 3×3 TIC
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                {lang === 'en' ? 'Data Units Slider' : 'Glisorul Unităților de Date'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-heading mt-0.5 flex items-center gap-2">
              <span>Byte Slider 3×3</span>
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </h1>
          </div>
        </div>

        {/* Action Controls & Highscore */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="byte-slider-btn-cheat"
            type="button"
            onClick={() => {
              sounds.playClick();
              setShowCheatSheet((prev) => !prev);
            }}
            className={`px-3 py-2 rounded-2xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              showCheatSheet
                ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            title={lang === 'en' ? 'Educational Reference Scale' : 'Scara de referință & Ordinea corectă'}
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">{lang === 'en' ? 'Order Guide' : 'Ghid Ordine'}</span>
          </button>

          <button
            id="byte-slider-btn-restart"
            type="button"
            disabled={isShuffling}
            onClick={() => {
              sounds.playClick();
              performSoftShuffle();
            }}
            className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white border border-indigo-400 text-xs font-black transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md shadow-indigo-600/30"
          >
            <RotateCcw className={`w-4 h-4 ${isShuffling ? 'animate-spin' : ''}`} />
            <span>{isShuffling ? (lang === 'en' ? 'Shuffling...' : 'Amestecare...') : (lang === 'en' ? 'Soft Shuffle' : 'Joc Nou')}</span>
          </button>

          {/* High Score Badge */}
          <div className="px-3 py-1.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs">
            <Trophy className="w-4 h-4 text-amber-400" />
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-slate-400 font-mono leading-none">Record</span>
              <span className="font-mono font-black text-amber-300">{highScore} pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gamification Stats Bar */}
      <div className="grid grid-cols-3 gap-3">
        {/* Moves Counter */}
        <div className="bg-slate-900/80 border border-indigo-500/20 rounded-2xl p-3 sm:p-4 text-center">
          <div className="text-[11px] font-mono text-indigo-300 uppercase tracking-wider">
            {lang === 'en' ? 'Moves' : 'Mutări'}
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white mt-0.5">
            {moves}
          </div>
        </div>

        {/* Timer */}
        <div className="bg-slate-900/80 border border-indigo-500/20 rounded-2xl p-3 sm:p-4 text-center">
          <div className="text-[11px] font-mono text-cyan-300 uppercase tracking-wider">
            {lang === 'en' ? 'Time Elapsed' : 'Timp'}
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-200 mt-0.5">
            {formatTime(seconds)}
          </div>
        </div>

        {/* Correct Position Counter */}
        <div className="bg-slate-900/80 border border-indigo-500/20 rounded-2xl p-3 sm:p-4 text-center">
          <div className="text-[11px] font-mono text-emerald-300 uppercase tracking-wider">
            {lang === 'en' ? 'Correct Placed' : 'Piese la Locul Lor'}
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 mt-0.5 flex items-center justify-center gap-1">
            <span>{correctTilesCount}</span>
            <span className="text-xs text-slate-500 font-normal">/ 8</span>
          </div>
        </div>
      </div>

      {/* Educational Reference Scale (Always Accessible / Toggleable) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider">
              {lang === 'en' ? 'Target Winning Order (Ascending):' : 'Ordinea Corectă de Rezolvare (Crescător):'}
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            {lang === 'en' ? 'Click any unit to learn what it stores' : 'Apasă pe o unitate pentru detalii educative'}
          </span>
        </div>

        {/* Units Sequence Bar */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {DATA_UNITS.map((unit, idx) => {
            const isPlaced = board[idx] === unit.id;
            return (
              <React.Fragment key={unit.id}>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedUnitInfo(unit);
                  }}
                  className={`group px-2.5 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                    isPlaced
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-sm shadow-emerald-500/20 ring-1 ring-emerald-400/40'
                      : 'bg-slate-950/80 border-slate-700 text-slate-300 hover:border-indigo-400 hover:text-white'
                  }`}
                  title={`${unit.name}: ${unit.sizeDesc}`}
                >
                  <span className="w-4 h-4 rounded-md bg-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-400 group-hover:text-indigo-300">
                    {idx + 1}
                  </span>
                  <span>{unit.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({unit.symbol})</span>
                  {isPlaced && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
                {idx < DATA_UNITS.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <div className="px-2 py-1 rounded-xl border border-dashed border-slate-700 text-[11px] text-slate-500 font-mono">
            {lang === 'en' ? '9. Empty Slot ⬛' : '9. Spațiu Liber ⬛'}
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: Sliding Board & Education Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center: The 3x3 Puzzle Board */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {/* Board Container */}
          <div className="relative w-full max-w-[420px] aspect-square p-3 sm:p-4 rounded-3xl bg-slate-950/90 border-2 border-indigo-500/40 shadow-2xl backdrop-blur">
            {/* Background Grid Slot Indicators */}
            <div className="grid grid-cols-3 grid-rows-3 gap-2 sm:gap-3 w-full h-full">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((slotIdx) => {
                const targetUnit = slotIdx < 8 ? DATA_UNITS[slotIdx] : null;
                return (
                  <div
                    key={`slot-${slotIdx}`}
                    className="rounded-2xl border border-slate-800/80 bg-slate-900/40 flex flex-col items-center justify-center p-2 text-center pointer-events-none"
                  >
                    <span className="text-[10px] font-mono text-slate-600">
                      #{slotIdx + 1}
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 truncate">
                      {targetUnit ? targetUnit.name : (lang === 'en' ? 'Empty' : 'Liber')}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Sliding Tiles (Rendered over the grid with calculated positions) */}
            {DATA_UNITS.map((unit) => {
              const currentPos = board.indexOf(unit.id);
              if (currentPos === -1) return null;

              const row = Math.floor(currentPos / GRID_SIZE);
              const col = currentPos % GRID_SIZE;
              const isAtTarget = currentPos === unit.id;
              const isMovable = adjacentToEmpty.includes(currentPos);

              // Percentage positioning for smooth 180ms CSS transition
              const leftPercent = (col * 33.333);
              const topPercent = (row * 33.333);

              return (
                <button
                  key={`tile-${unit.id}`}
                  type="button"
                  disabled={isShuffling || hasWon}
                  onClick={() => handleTileClick(currentPos)}
                  style={{
                    position: 'absolute',
                    width: 'calc(33.333% - 14px)',
                    height: 'calc(33.333% - 14px)',
                    left: `calc(${leftPercent}% + 7px)`,
                    top: `calc(${topPercent}% + 7px)`,
                    transition: 'left 180ms cubic-bezier(0.2, 0, 0, 1), top 180ms cubic-bezier(0.2, 0, 0, 1), box-shadow 200ms ease, border-color 200ms ease',
                  }}
                  className={`group select-none rounded-2xl flex flex-col items-center justify-center p-2 text-center cursor-pointer active:scale-95 border-2 transition-all ${
                    isAtTarget
                      ? 'bg-gradient-to-br from-emerald-950/90 via-slate-900/90 to-teal-950/90 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.35)] ring-1 ring-emerald-400/50'
                      : isMovable
                      ? 'bg-slate-900/95 hover:bg-slate-850 border-indigo-500/50 hover:border-indigo-400 text-slate-100 shadow-md shadow-indigo-900/20 hover:shadow-indigo-500/20 ring-1 ring-indigo-500/20'
                      : 'bg-slate-900/90 border-slate-700/80 text-slate-300 opacity-90'
                  }`}
                >
                  {/* Target position indicator / Status badge */}
                  <div className="absolute top-1.5 left-2 flex items-center gap-1">
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-indigo-300">
                      #{unit.id + 1}
                    </span>
                  </div>

                  {isAtTarget && (
                    <div className="absolute top-1.5 right-2 flex items-center gap-0.5 text-emerald-400 animate-fadeIn">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  )}

                  {/* Main Unit Symbol & Name */}
                  <div className="font-heading font-black text-base sm:text-lg tracking-tight text-white flex items-center gap-1">
                    <span>{unit.name}</span>
                  </div>

                  <div className="text-[11px] font-mono font-bold text-indigo-300 group-hover:text-white">
                    {unit.symbol}
                  </div>

                  <div className="text-[10px] text-slate-400 truncate max-w-[90%] mt-0.5">
                    {unit.sub}
                  </div>
                </button>
              );
            })}

            {/* Shuffling Overlay Banner */}
            {isShuffling && (
              <div className="absolute inset-0 rounded-3xl bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-30 animate-fadeIn">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400 flex items-center justify-center text-indigo-300 animate-spin">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-black text-white font-heading">
                    {lang === 'en' ? 'Soft Shuffle in Progress...' : 'Se amestecă piesele inteligent...'}
                  </div>
                  <div className="text-xs text-indigo-300 mt-0.5">
                    {lang === 'en' ? 'Generating 100% solvable puzzle' : 'Garantare rezolvabilitate (18-25 mutări)'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick instructions below grid */}
          <div className="mt-3 flex items-center justify-between w-full max-w-[420px] px-2 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {lang === 'en' ? 'Green glow = Correct position' : 'Contur verde = Poziție corectă'}
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {lang === 'en' ? 'Arrows or Click to slide' : 'Săgeți sau Click pentru glisare'}
            </span>
          </div>
        </div>

        {/* Right: Educational Cheat Sheet & Unit Explorer */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Interactive Unit Details Card */}
          {selectedUnitInfo ? (
            <div className="bg-slate-900/90 border-2 border-indigo-500/40 rounded-3xl p-5 shadow-xl animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {selectedUnitInfo.symbol}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white font-heading">
                      {selectedUnitInfo.name} ({selectedUnitInfo.symbol})
                    </h3>
                    <div className="text-xs text-indigo-300 font-mono">
                      #{selectedUnitInfo.id + 1} în ierarhia de date
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedUnitInfo(null)}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="font-bold text-teal-400 block mb-0.5">Echivalență TIC:</span>
                  <span>{selectedUnitInfo.sizeDesc} ({selectedUnitInfo.sub})</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="font-bold text-amber-400 block mb-0.5">Exemplu practic din viața reală:</span>
                  <span>{selectedUnitInfo.realWorldExample}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/80 border border-indigo-500/20 rounded-3xl p-5 shadow-lg">
              <div className="flex items-center gap-2 text-indigo-300 mb-2">
                <Info className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  {lang === 'en' ? 'Did you know?' : 'Știai că în Informatică?'}
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Calculatoarele lucrează în baza 2 (binar). De aceea, fiecare multiplicator este <strong>1024</strong> (care este 2¹⁰), nu 1000! Astfel, 1 KB are 1024 Bytes, 1 MB are 1024 KB, și tot așa până la Exabyte!
              </p>
            </div>
          )}

          {/* Quick Step Guide Table */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Tabelul Unităților de Măsură</span>
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">1024x Multiplicator</span>
            </div>

            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              {DATA_UNITS.map((unit, idx) => (
                <div
                  key={unit.id}
                  onClick={() => setSelectedUnitInfo(unit)}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 text-xs transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-indigo-950 border border-indigo-500/30 flex items-center justify-center font-mono font-bold text-[10px] text-indigo-300">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-200">{unit.name}</span>
                    <span className="text-slate-400 font-mono text-[11px]">({unit.symbol})</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono truncate max-w-[150px]">
                    {unit.sub}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Victory Celebration Modal */}
      {hasWon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 border-2 border-emerald-400/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg shadow-emerald-500/30 animate-bounce">
              🏆
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'en' ? 'PUZZLE SOLVED!' : 'PUZZLE REZOLVAT CU SUCCES!'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
              {lang === 'en' ? 'Data Units Master!' : 'Maestru al Unităților de Date!'}
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed mt-2 max-w-md mx-auto">
              {lang === 'en'
                ? 'You successfully sorted all data units in strictly ascending order from the smallest Bit to the planetary Exabyte!'
                : 'Ai ordonat impecabil unitățile de măsură pentru date: Bit, Byte, KB, MB, GB, TB, PB și EB! Ești gata pentru nota 10 la informatică!'}
            </p>

            {/* Performance Stats */}
            <div className="grid grid-cols-3 gap-3 my-6 bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-4">
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">Mutări</div>
                <div className="text-xl sm:text-2xl font-black font-mono text-indigo-300 mt-0.5">
                  {moves}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">Timp</div>
                <div className="text-xl sm:text-2xl font-black font-mono text-cyan-300 mt-0.5">
                  {formatTime(seconds)}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">Punctaj</div>
                <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400 mt-0.5">
                  {Math.max(300, 1500 - moves * 15 - seconds * 5) + (moves <= 25 ? 250 : 100)} pts
                </div>
              </div>
            </div>

            {/* Arky Mascot Feedback */}
            <div className="p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex items-center gap-3 text-left mb-6">
              <div className="text-2xl shrink-0">🤖</div>
              <div className="text-xs text-indigo-200 leading-snug">
                <strong>Arky:</strong> &bdquo;Superbă gândire algoritmică! Punctajul tău a fost salvat și sincronizat în clasamentul laboratorului!&rdquo;
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  performSoftShuffle();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{lang === 'en' ? 'Play Again' : 'Joacă din nou (Alt Shuffle)'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onBack();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 text-slate-400" />
                <span>{lang === 'en' ? 'Arcade Hub' : 'Înapoi la Jocuri'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
