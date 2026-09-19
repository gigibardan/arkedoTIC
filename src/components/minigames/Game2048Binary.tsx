import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { sounds } from '../../utils/audio';
import {
  Binary,
  RotateCcw,
  Trophy,
  Sparkles,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  HardDrive,
  Info,
} from 'lucide-react';

interface Game2048Props {
  onBack: () => void;
  studentName?: string;
}

type Board = number[][];

const GRID_SIZE = 4;

// Mapping values to TIC units & formulas
const TILE_INFO: Record<number, { label: string; sub: string; color: string; border: string; text: string }> = {
  2: { label: '2 B', sub: '2¹', color: 'bg-slate-800', border: 'border-slate-700', text: 'text-slate-200' },
  4: { label: '4 B', sub: '2²', color: 'bg-slate-750', border: 'border-slate-650', text: 'text-slate-100' },
  8: { label: '8 B', sub: '1 Octet', color: 'bg-teal-900/60', border: 'border-teal-600/40', text: 'text-teal-300' },
  16: { label: '16 B', sub: '2⁴', color: 'bg-teal-800/70', border: 'border-teal-500/50', text: 'text-teal-200' },
  32: { label: '32 B', sub: '2⁵', color: 'bg-emerald-900/60', border: 'border-emerald-600/50', text: 'text-emerald-300' },
  64: { label: '64 B', sub: '2⁶', color: 'bg-emerald-800/70', border: 'border-emerald-500/60', text: 'text-emerald-200' },
  128: { label: '128 B', sub: '2⁷', color: 'bg-cyan-900/70', border: 'border-cyan-500/60', text: 'text-cyan-200' },
  256: { label: '256 B', sub: '2⁸', color: 'bg-blue-900/80', border: 'border-blue-500/60', text: 'text-blue-200' },
  512: { label: '512 B', sub: '½ KB', color: 'bg-indigo-900/80', border: 'border-indigo-500/70', text: 'text-indigo-200' },
  1024: { label: '1 KB!', sub: '1024 B', color: 'bg-amber-600', border: 'border-amber-400', text: 'text-amber-100 font-black' },
  2048: { label: '2 KB!!', sub: 'VICTORIE!', color: 'bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500', border: 'border-amber-300', text: 'text-white font-black animate-pulse' },
  4096: { label: '4 KB', sub: '2¹²', color: 'bg-purple-700', border: 'border-purple-400', text: 'text-purple-100 font-black' },
  8192: { label: '8 KB', sub: '2¹³', color: 'bg-pink-700', border: 'border-pink-400', text: 'text-pink-100 font-black' },
};

export const Game2048Binary: React.FC<Game2048Props> = ({ onBack, studentName }) => {
  const { lang } = useLanguage();
  const arky = useArky();

  const [board, setBoard] = useState<Board>(() => getInitialBoard());
  const [score, setScore] = useState<number>(0);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [highestTile, setHighestTile] = useState<number>(2);

  // High score
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_2048') || '0');
    } catch {
      return 0;
    }
  });

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  function getInitialBoard(): Board {
    const emptyBoard: Board = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(0));
    addRandomTile(emptyBoard);
    addRandomTile(emptyBoard);
    return emptyBoard;
  }

  function addRandomTile(currentBoard: Board) {
    const emptyCells: { r: number; c: number }[] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (currentBoard[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }
    if (emptyCells.length === 0) return;
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    // 90% chance of 2, 10% chance of 4
    currentBoard[randomCell.r][randomCell.c] = Math.random() < 0.9 ? 2 : 4;
  }

  const resetGame = () => {
    sounds.playClick();
    const newBoard = getInitialBoard();
    setBoard(newBoard);
    setScore(0);
    setHasWon(false);
    setIsGameOver(false);
    setHighestTile(2);
    arky.triggerIdle();
  };

  // Slide and merge row to the left
  const slideAndMergeRow = (row: number[], currentScore: number) => {
    // 1. Filter out zeros
    let nonZeros = row.filter((val) => val !== 0);
    let pointsGained = 0;
    let mergedRow: number[] = [];

    let i = 0;
    while (i < nonZeros.length) {
      if (i + 1 < nonZeros.length && nonZeros[i] === nonZeros[i + 1]) {
        const mergedVal = nonZeros[i] * 2;
        mergedRow.push(mergedVal);
        pointsGained += mergedVal;
        i += 2;
      } else {
        mergedRow.push(nonZeros[i]);
        i += 1;
      }
    }

    // Pad with zeros
    while (mergedRow.length < GRID_SIZE) {
      mergedRow.push(0);
    }

    return { mergedRow, pointsGained };
  };

  // Move Board in direction
  const moveBoard = useCallback(
    (direction: 'left' | 'right' | 'up' | 'down') => {
      if (isGameOver) return;

      let changed = false;
      let newScore = score;
      let newBoard: Board = board.map((row) => [...row]);
      let maxTileFound = highestTile;

      if (direction === 'left') {
        for (let r = 0; r < GRID_SIZE; r++) {
          const { mergedRow, pointsGained } = slideAndMergeRow(newBoard[r], newScore);
          newScore += pointsGained;
          if (JSON.stringify(newBoard[r]) !== JSON.stringify(mergedRow)) changed = true;
          newBoard[r] = mergedRow;
        }
      } else if (direction === 'right') {
        for (let r = 0; r < GRID_SIZE; r++) {
          const reversed = [...newBoard[r]].reverse();
          const { mergedRow, pointsGained } = slideAndMergeRow(reversed, newScore);
          newScore += pointsGained;
          const normalRow = mergedRow.reverse();
          if (JSON.stringify(newBoard[r]) !== JSON.stringify(normalRow)) changed = true;
          newBoard[r] = normalRow;
        }
      } else if (direction === 'up') {
        for (let c = 0; c < GRID_SIZE; c++) {
          const col = [newBoard[0][c], newBoard[1][c], newBoard[2][c], newBoard[3][c]];
          const { mergedRow, pointsGained } = slideAndMergeRow(col, newScore);
          newScore += pointsGained;
          for (let r = 0; r < GRID_SIZE; r++) {
            if (newBoard[r][c] !== mergedRow[r]) changed = true;
            newBoard[r][c] = mergedRow[r];
          }
        }
      } else if (direction === 'down') {
        for (let c = 0; c < GRID_SIZE; c++) {
          const col = [newBoard[3][c], newBoard[2][c], newBoard[1][c], newBoard[0][c]];
          const { mergedRow, pointsGained } = slideAndMergeRow(col, newScore);
          newScore += pointsGained;
          const normalCol = mergedRow.reverse();
          for (let r = 0; r < GRID_SIZE; r++) {
            if (newBoard[r][c] !== normalCol[r]) changed = true;
            newBoard[r][c] = normalCol[r];
          }
        }
      }

      if (changed) {
        sounds.playClick();
        addRandomTile(newBoard);

        // Check highest tile
        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
            if (newBoard[r][c] > maxTileFound) {
              maxTileFound = newBoard[r][c];
            }
          }
        }
        setHighestTile(maxTileFound);

        // 1024 B / 1 KB Milestone!
        if (maxTileFound >= 1024 && !hasWon) {
          if (maxTileFound >= 2048) {
            setHasWon(true);
            sounds.playVictory();
            arky.triggerFinished(
              lang === 'en'
                ? 'VICTORY! You synthesized 2048 B (2 Kilobytes)! 🏆🎉'
                : 'VICTORIE! Ai atins 2048 B (2 Kilobytes)! O minune a memoriei binare! 🏆🎉'
            );
          } else if (maxTileFound === 1024) {
            sounds.playLevelUp();
            arky.triggerSuccess(
              lang === 'en'
                ? 'Awesome! 1024 Bytes = 1 Kilobyte synthesized! 💾✨'
                : 'Excelent! Ai format 1024 Bytes = 1 Kilobyte (KB)! 💾✨'
            );
          }
        }

        setBoard(newBoard);
        setScore(newScore);

        if (newScore > highScore) {
          setHighScore(newScore);
          try {
            localStorage.setItem('arkedo_highscore_2048', String(newScore));
          } catch {
            // Ignore
          }
        }

        // Check if game is over (no moves left)
        if (checkGameOver(newBoard)) {
          setIsGameOver(true);
          sounds.playWrong();
        }
      }
    },
    [board, score, isGameOver, highestTile, hasWon, highScore, lang, arky]
  );

  function checkGameOver(b: Board): boolean {
    // If there's an empty space, not game over
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (b[r][c] === 0) return false;
      }
    }
    // If adjacent cells have same value, not game over
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const val = b[r][c];
        if (r + 1 < GRID_SIZE && b[r + 1][c] === val) return false;
        if (c + 1 < GRID_SIZE && b[r][c + 1] === val) return false;
      }
    }
    return true;
  }

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        moveBoard('up');
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        moveBoard('down');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        moveBoard('left');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        moveBoard('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveBoard]);

  // Touch Swipe Controls
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) > 30) {
      if (absX > absY) {
        if (dx > 0) moveBoard('right');
        else moveBoard('left');
      } else {
        if (dy > 0) moveBoard('down');
        else moveBoard('up');
      }
    }
    touchStartRef.current = null;
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-10 select-none">
      {/* Top Header / Navigation */}
      <div className="flex items-center justify-between gap-4 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl">
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'en' ? 'Back to Arcade' : 'Înapoi la Jocuri'}</span>
        </button>

        <div className="flex items-center gap-2 text-center">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
            <Binary className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-white font-heading">
              {lang === 'en' ? '2048 Binary Bytes' : '2048 Binar TIC (Puterile lui 2)'}
            </h1>
            <p className="text-[11px] text-amber-400 font-mono">
              {lang === 'en' ? 'Merge powers of 2 to reach 1024 B (1 KB) and 2048 B!' : 'Unește puterile lui 2 până la 1024 B (1 KB) și 2048 B!'}
            </p>
          </div>
        </div>

        {/* High Score Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Record: {highScore}</span>
        </div>
      </div>

      {/* Main Grid & Side info layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Game Board (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/95 border-2 border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl relative flex flex-col items-center">
          {/* Top Score Bar & Controls */}
          <div className="w-full flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              <div className="bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Scor Curent</div>
                <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">{score}</div>
              </div>

              <div className="bg-slate-950 px-3 py-2 rounded-2xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Max Memorie</div>
                <div className="text-base sm:text-lg font-black text-teal-300 font-mono">
                  {TILE_INFO[highestTile]?.label || `${highestTile} B`}
                </div>
              </div>
            </div>

            <button
              onClick={resetGame}
              className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition cursor-pointer active:scale-95 flex items-center gap-1.5 text-xs font-bold"
              title="Resetează jocul"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

          {/* 4x4 Game Board */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="w-full max-w-[380px] aspect-square bg-slate-950/90 border-4 border-slate-800 rounded-3xl p-3 sm:p-4 grid grid-cols-4 gap-2.5 sm:gap-3 shadow-2xl relative overflow-hidden"
          >
            {board.map((row, r) =>
              row.map((cellValue, c) => {
                const info = cellValue > 0 ? TILE_INFO[cellValue] || {
                  label: `${cellValue} B`,
                  sub: '2ⁿ',
                  color: 'bg-purple-800',
                  border: 'border-purple-500',
                  text: 'text-white',
                } : null;

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`rounded-2xl flex flex-col items-center justify-center transition-all duration-150 relative ${
                      info
                        ? `${info.color} border-2 ${info.border} ${info.text} shadow-md`
                        : 'bg-slate-900/60 border border-slate-800/80'
                    }`}
                  >
                    {info && (
                      <>
                        <span className="text-xs sm:text-base font-black tracking-tight leading-tight">
                          {info.label}
                        </span>
                        <span className="text-[9px] sm:text-[11px] font-mono opacity-80 mt-0.5">
                          {info.sub}
                        </span>
                      </>
                    )}
                  </div>
                );
              })
            )}

            {/* Game Over Overlay */}
            {isGameOver && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-6 text-center gap-3 animate-fadeIn">
                <span className="text-4xl">🛑</span>
                <h3 className="text-xl font-black text-white font-heading">
                  {lang === 'en' ? 'No More Moves!' : 'Nu mai sunt mutări posibile!'}
                </h3>
                <p className="text-xs text-slate-300">
                  {lang === 'en' ? `Final memory reached: ${highestTile} B` : `Memorie maximă atinsă: ${highestTile} B`}
                </p>
                <button
                  onClick={resetGame}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-lg cursor-pointer"
                >
                  {lang === 'en' ? 'Try Again' : 'Încearcă din Nou'}
                </button>
              </div>
            )}
          </div>

          {/* On-Screen D-PAD for Touch & Mobile Devices */}
          <div className="mt-5 flex flex-col items-center gap-2">
            <button
              onClick={() => moveBoard('up')}
              className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-amber-500 text-slate-200 active:text-slate-950 flex items-center justify-center shadow-md border border-slate-700 cursor-pointer active:scale-95 transition"
              aria-label="Up"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={() => moveBoard('left')}
                className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-amber-500 text-slate-200 active:text-slate-950 flex items-center justify-center shadow-md border border-slate-700 cursor-pointer active:scale-95 transition"
                aria-label="Left"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => moveBoard('down')}
                className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-amber-500 text-slate-200 active:text-slate-950 flex items-center justify-center shadow-md border border-slate-700 cursor-pointer active:scale-95 transition"
                aria-label="Down"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
              <button
                onClick={() => moveBoard('right')}
                className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-amber-500 text-slate-200 active:text-slate-950 flex items-center justify-center shadow-md border border-slate-700 cursor-pointer active:scale-95 transition"
                aria-label="Right"
              >
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
            <span className="text-[11px] font-mono text-slate-400 mt-1">
              💡 {lang === 'en' ? 'Use Arrow Keys, Swipe, or on-screen arrows' : 'Folosește tastele săgeți, glisare pe ecran sau butoanele de mai sus'}
            </span>
          </div>
        </div>

        {/* Right Side: Educational TIC Guide & Unit Conversion Reference (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400 mb-3">
              <HardDrive className="w-4 h-4 text-amber-400" />
              <span>{lang === 'en' ? 'Curriculum Unit Reference' : 'Unități de Măsură • Manual TIC'}</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {lang === 'en'
                ? 'In digital systems, memory is calculated in base 2 (powers of 2):'
                : 'În informatică, calculatoarele funcționează pe baza sistemului binar (puterile lui 2):'}
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-teal-300 font-bold">1 Bit (b)</span>
                <span className="text-slate-400">0 sau 1</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-teal-300 font-bold">1 Byte (B) / Octet</span>
                <span className="text-slate-400">8 biți (2³)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-amber-500/15 border border-amber-500/40">
                <span className="text-amber-300 font-bold">1 Kilobyte (KB)</span>
                <span className="text-amber-200">1024 Bytes (2¹⁰)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-300 font-bold">1 Megabyte (MB)</span>
                <span className="text-slate-400">1024 KB (2²⁰)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-300 font-bold">1 Gigabyte (GB)</span>
                <span className="text-slate-400">1024 MB (2³⁰)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-300 font-bold">1 Terabyte (TB)</span>
                <span className="text-slate-400">1024 GB (2⁴⁰)</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-2xl bg-teal-950/50 border border-teal-500/30 text-xs text-teal-200 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>
                {lang === 'en'
                  ? 'Tip: When two 512 B tiles touch, they synthesize exactly 1 KB (1024 B)!'
                  : 'Sfat: Când două blocuri de 512 B se unesc, formează exact 1 Kilobyte (1024 B)!'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
