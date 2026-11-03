import React, { useState, useEffect, useRef } from 'react';
import {
  Palette,
  Sparkles,
  Trophy,
  Flame,
  RotateCcw,
  Eraser,
  PaintBucket,
  PenTool,
  FlipHorizontal,
  CheckCircle2,
  Zap,
  ArrowRight
} from 'lucide-react';
import { DuelRoomData, updateDuelProgress } from '../../lib/duelService';
import { sounds } from '../../utils/audio';

interface PixelClashDuelGameProps {
  roomData: DuelRoomData | null;
  isHost: boolean;
  studentName: string;
  studentAvatar: string;
  onFinish: (score: number, won: boolean) => void;
  onBack: () => void;
}

interface SpriteChallenge {
  id: number;
  name: string;
  difficulty: string;
  targetGrid: string[][]; // 8x8 hex strings
  accentColor: string;
}

// 8x8 Palette
const PALETTE_COLORS = [
  { name: 'Negru', hex: '#0f172a' },
  { name: 'Alb', hex: '#ffffff' },
  { name: 'Roșu', hex: '#ef4444' },
  { name: 'Cyan Neon', hex: '#06b6d4' },
  { name: 'Galben Aur', hex: '#eab308' },
  { name: 'Verde Smarald', hex: '#10b981' },
  { name: 'Mov Cosmic', hex: '#a855f7' },
  { name: 'Albastru Cobalt', hex: '#3b82f6' },
  { name: 'Portocaliu', hex: '#f97316' },
  { name: 'Gradiant Gol', hex: '#1e293b' } // Empty / canvas background
];

const EMPTY_COLOR = '#1e293b';

// Helper to generate blank 8x8 grid
const createEmptyGrid = (): string[][] => {
  return Array(8).fill(null).map(() => Array(8).fill(EMPTY_COLOR));
};

// 5 Curated 8-bit Sprite Challenges
const SPRITE_CHALLENGES: SpriteChallenge[] = [
  {
    id: 1,
    name: 'Inimă 8-bit (Pixel Heart)',
    difficulty: 'Ușor',
    accentColor: '#ef4444',
    targetGrid: [
      [EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR],
      [EMPTY_COLOR, '#ef4444', '#ef4444', EMPTY_COLOR, EMPTY_COLOR, '#ef4444', '#ef4444', EMPTY_COLOR],
      ['#ef4444', '#ffffff', '#ef4444', '#ef4444', '#ef4444', '#ef4444', '#ef4444', '#ef4444'],
      ['#ef4444', '#ef4444', '#ef4444', '#ef4444', '#ef4444', '#ef4444', '#ef4444', '#ef4444'],
      [EMPTY_COLOR, '#ef4444', '#ef4444', '#ef4444', '#ef4444', '#ef4444', '#ef4444', EMPTY_COLOR],
      [EMPTY_COLOR, EMPTY_COLOR, '#ef4444', '#ef4444', '#ef4444', '#ef4444', EMPTY_COLOR, EMPTY_COLOR],
      [EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, '#ef4444', '#ef4444', EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR],
      [EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR]
    ]
  },
  {
    id: 2,
    name: 'Dischetă Floppy 3.5" (Save Disk)',
    difficulty: 'Mediu',
    accentColor: '#3b82f6',
    targetGrid: [
      ['#0f172a', '#0f172a', '#0f172a', '#0f172a', '#0f172a', '#0f172a', '#0f172a', EMPTY_COLOR],
      ['#0f172a', '#ffffff', '#ffffff', '#0f172a', '#ffffff', '#ffffff', '#0f172a', '#0f172a'],
      ['#0f172a', '#ffffff', '#ffffff', '#0f172a', '#ffffff', '#ffffff', '#0f172a', '#0f172a'],
      ['#0f172a', '#3b82f6', '#3b82f6', '#3b82f6', '#3b82f6', '#3b82f6', '#0f172a', '#0f172a'],
      ['#0f172a', '#3b82f6', '#3b82f6', '#3b82f6', '#3b82f6', '#3b82f6', '#0f172a', '#0f172a'],
      ['#0f172a', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#0f172a', '#0f172a'],
      ['#0f172a', '#ffffff', '#ffffff', '#0f172a', '#ffffff', '#ffffff', '#0f172a', '#0f172a'],
      ['#0f172a', '#0f172a', '#0f172a', '#0f172a', '#0f172a', '#0f172a', '#0f172a', '#0f172a']
    ]
  },
  {
    id: 3,
    name: 'Sabie de Diamant (Pixel Sword)',
    difficulty: 'Avansat',
    accentColor: '#06b6d4',
    targetGrid: [
      [EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, '#ffffff', '#06b6d4'],
      [EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, '#06b6d4', '#06b6d4', '#06b6d4'],
      [EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, '#06b6d4', '#06b6d4', '#06b6d4', EMPTY_COLOR],
      [EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, '#06b6d4', '#06b6d4', '#06b6d4', EMPTY_COLOR, EMPTY_COLOR],
      [EMPTY_COLOR, '#eab308', '#06b6d4', '#06b6d4', '#06b6d4', EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR],
      [EMPTY_COLOR, EMPTY_COLOR, '#eab308', '#06b6d4', '#eab308', EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR],
      [EMPTY_COLOR, '#0f172a', EMPTY_COLOR, '#eab308', EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR],
      ['#0f172a', EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR]
    ]
  },
  {
    id: 4,
    name: 'Extraterestru Space Invader',
    difficulty: 'Maestru',
    accentColor: '#10b981',
    targetGrid: [
      [EMPTY_COLOR, EMPTY_COLOR, '#10b981', EMPTY_COLOR, EMPTY_COLOR, '#10b981', EMPTY_COLOR, EMPTY_COLOR],
      [EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, '#10b981', '#10b981', EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR],
      [EMPTY_COLOR, '#10b981', '#10b981', '#10b981', '#10b981', '#10b981', '#10b981', EMPTY_COLOR],
      ['#10b981', '#10b981', '#0f172a', '#10b981', '#10b981', '#0f172a', '#10b981', '#10b981'],
      ['#10b981', '#10b981', '#10b981', '#10b981', '#10b981', '#10b981', '#10b981', '#10b981'],
      [EMPTY_COLOR, EMPTY_COLOR, '#10b981', EMPTY_COLOR, EMPTY_COLOR, '#10b981', EMPTY_COLOR, EMPTY_COLOR],
      [EMPTY_COLOR, '#10b981', EMPTY_COLOR, '#10b981', '#10b981', EMPTY_COLOR, '#10b981', EMPTY_COLOR],
      ['#10b981', EMPTY_COLOR, '#10b981', EMPTY_COLOR, EMPTY_COLOR, '#10b981', EMPTY_COLOR, '#10b981']
    ]
  },
  {
    id: 5,
    name: 'Cupa Campionilor de Aur',
    difficulty: 'Final Boss',
    accentColor: '#eab308',
    targetGrid: [
      ['#eab308', '#eab308', '#eab308', '#eab308', '#eab308', '#eab308', '#eab308', '#eab308'],
      ['#eab308', '#ffffff', '#eab308', '#eab308', '#eab308', '#eab308', '#eab308', '#eab308'],
      ['#eab308', '#eab308', '#eab308', '#eab308', '#eab308', '#eab308', '#eab308', '#eab308'],
      [EMPTY_COLOR, '#eab308', '#eab308', '#eab308', '#eab308', '#eab308', '#eab308', EMPTY_COLOR],
      [EMPTY_COLOR, EMPTY_COLOR, '#eab308', '#eab308', '#eab308', '#eab308', EMPTY_COLOR, EMPTY_COLOR],
      [EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, '#eab308', '#eab308', EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR],
      [EMPTY_COLOR, EMPTY_COLOR, '#0f172a', '#0f172a', '#0f172a', '#0f172a', EMPTY_COLOR, EMPTY_COLOR],
      [EMPTY_COLOR, '#0f172a', '#0f172a', '#0f172a', '#0f172a', '#0f172a', '#0f172a', EMPTY_COLOR]
    ]
  }
];

export const PixelClashDuelGame: React.FC<PixelClashDuelGameProps> = ({
  roomData,
  isHost,
  studentName,
  studentAvatar,
  onFinish,
  onBack
}) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [grid, setGrid] = useState<string[][]>(createEmptyGrid());
  const [selectedColor, setSelectedColor] = useState<string>('#ef4444');
  const [activeTool, setActiveTool] = useState<'pen' | 'bucket' | 'eraser'>('pen');
  const [mirrorX, setMirrorX] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [botProgress, setBotProgress] = useState<number>(0);

  const currentChallenge = SPRITE_CHALLENGES[currentStage];

  // Calculate current grid accuracy vs target
  const calculateAccuracy = (currentGrid: string[][]): number => {
    let matched = 0;
    const target = currentChallenge.targetGrid;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (currentGrid[r][c] === target[r][c]) {
          matched++;
        }
      }
    }
    return Math.round((matched / 64) * 100);
  };

  const accuracy = calculateAccuracy(grid);

  // Sync progress to Duel Room
  const syncProgress = (newScore: number, stageIdx: number, done: boolean = false) => {
    if (!roomData) return;
    const totalProgress = Math.min(100, Math.round(((stageIdx + (accuracy / 100)) / SPRITE_CHALLENGES.length) * 100));
    const myId = isHost ? roomData.host.id : roomData.guest?.id;

    updateDuelProgress(
      roomData.roomCode,
      isHost,
      {
        progress: done ? 100 : totalProgress,
        score: newScore,
        currentStageIndex: stageIdx,
        finishedAt: done ? Date.now() : undefined
      },
      myId,
      studentName
    );
  };

  // Bot simulation if no live guest
  useEffect(() => {
    if (roomData && roomData.guest && roomData.guest.id !== 'practice_bot') return;
    if (isFinished) return;

    const interval = setInterval(() => {
      setBotProgress((prev) => {
        const next = Math.min(100, prev + Math.floor(Math.random() * 6) + 3);
        if (next >= 100 && !isFinished) {
          setIsFinished(true);
          sounds.playFailure();
          onFinish(score, false);
        }
        return next;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [roomData, isFinished, score, onFinish]);

  // Color cell action
  const colorCell = (row: number, col: number) => {
    if (isFinished) return;

    const paintColor = activeTool === 'eraser' ? EMPTY_COLOR : selectedColor;

    if (grid[row][col] === paintColor && (!mirrorX || grid[row][7 - col] === paintColor)) {
      return; // Already painted with this color
    }

    sounds.playPop();

    setGrid((prev) => {
      const next = prev.map((r) => [...r]);
      if (activeTool === 'bucket') {
        // Flood fill
        const targetColor = prev[row][col];
        if (targetColor === paintColor) return prev;
        const fill = (r: number, c: number) => {
          if (r < 0 || r >= 8 || c < 0 || c >= 8) return;
          if (next[r][c] !== targetColor) return;
          next[r][c] = paintColor;
          fill(r + 1, c);
          fill(r - 1, c);
          fill(r, c + 1);
          fill(r, c - 1);
        };
        fill(row, col);
      } else {
        // Single cell + mirror
        next[row][col] = paintColor;
        if (mirrorX) {
          next[row][7 - col] = paintColor;
        }
      }
      return next;
    });
  };

  // Check stage completion
  useEffect(() => {
    if (accuracy >= 100 && !isFinished) {
      sounds.playCorrect();
      sounds.playVictory();

      const stageBonus = 250 + streak * 40;
      const nextScore = score + stageBonus;
      setScore(nextScore);
      setStreak((prev) => prev + 1);

      if (currentStage + 1 < SPRITE_CHALLENGES.length) {
        syncProgress(nextScore, currentStage + 1, false);
        setCurrentStage((prev) => prev + 1);
        setGrid(createEmptyGrid());
      } else {
        // All stages complete!
        setIsFinished(true);
        syncProgress(nextScore, currentStage, true);
        onFinish(nextScore, true);
      }
    }
  }, [accuracy, currentStage, isFinished]);

  // Reset current grid
  const handleResetCanvas = () => {
    sounds.playClick();
    setGrid(createEmptyGrid());
  };

  // Get opponent progress
  const opponent = isHost ? roomData?.guest : roomData?.host;
  const oppProgress = roomData?.guest ? (opponent?.progress || 0) : botProgress;
  const oppName = opponent?.name || 'Pixel Bot 🤖';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Top Header Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/80 to-slate-900 border border-purple-500/40 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-xl shadow-md border border-purple-500/30">
            🎨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white font-heading tracking-tight">
                Pixel Art Sprite Clash 1v1
              </h3>
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold uppercase">
                Etapa {currentStage + 1}/{SPRITE_CHALLENGES.length}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {currentChallenge.name} • Precizie Necesare: 100%
            </p>
          </div>
        </div>

        {/* Live Score & Streak */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Scor Jucător</span>
            <span className="text-base font-black text-amber-300 font-mono">+{score} XP</span>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold animate-pulse">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>x{streak} Combo</span>
            </div>
          )}
        </div>
      </div>

      {/* Duel Competitors Progress Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span>{studentAvatar}</span>
              <span>{studentName} (Tu)</span>
            </span>
            <span className="font-mono font-bold text-cyan-400">{accuracy}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-200"
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <span>{opponent?.avatar || '🤖'}</span>
              <span>{oppName}</span>
            </span>
            <span className="font-mono font-bold text-rose-400">{oppProgress}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-400 transition-all duration-300"
              style={{ width: `${oppProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Play Area: Model Sprite vs Player Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Column: Target Sprite (Rețeta Model) */}
        <div className="md:col-span-5 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Model Țintă (Sprite Rețetă)
              </span>
              <span className="text-[10px] font-mono text-slate-400">8 x 8 Pixeli</span>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Reprodu pe pânza din dreapta exact acest sprite colorat!
            </p>

            {/* Target 8x8 Visual Grid */}
            <div className="grid grid-cols-8 gap-1 p-2 rounded-xl bg-slate-950 border border-slate-800 w-fit mx-auto shadow-inner">
              {currentChallenge.targetGrid.map((row, rIdx) =>
                row.map((cellHex, cIdx) => (
                  <div
                    key={`target-${rIdx}-${cIdx}`}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-sm border border-slate-800/80 transition-colors"
                    style={{ backgroundColor: cellHex }}
                  />
                ))
              )}
            </div>
          </div>

          {/* Quick Tip on Resolution & RGB */}
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400">
            <span className="text-purple-300 font-bold block mb-0.5">💡 Concept TIC Gimnaziu:</span>
            Grafica raster (bitmap) este alcătuită dintr-o matrice bidimensională de pixeli colorați prin amestec RGB.
          </div>
        </div>

        {/* Right Column: Player Canvas & Tools */}
        <div className="md:col-span-7 p-4 rounded-2xl bg-slate-900 border-2 border-purple-500/30 shadow-lg space-y-4">
          {/* Tool Selector Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setActiveTool('pen');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  activeTool === 'pen'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Pensulă</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setActiveTool('bucket');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  activeTool === 'bucket'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <PaintBucket className="w-3.5 h-3.5" />
                <span>Umplere</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setActiveTool('eraser');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  activeTool === 'eraser'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Radieră</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Symmetry Toggle */}
              <button
                type="button"
                onClick={() => {
                  sounds.playPowerup();
                  setMirrorX(!mirrorX);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                  mirrorX
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/40 shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
                title="Sincronizează coloana opusă orizontal pentru viteză 2x"
              >
                <FlipHorizontal className="w-3.5 h-3.5" />
                <span>Oglindă X</span>
              </button>

              <button
                type="button"
                onClick={handleResetCanvas}
                className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-rose-300 border border-slate-800 transition cursor-pointer"
                title="Curăță Pânza"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Color Palette Grid */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Culoare:</span>
            {PALETTE_COLORS.map((col) => {
              const isSelected = selectedColor === col.hex && activeTool !== 'eraser';
              return (
                <button
                  key={col.hex}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedColor(col.hex);
                    if (activeTool === 'eraser') setActiveTool('pen');
                  }}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg border-2 transition-transform cursor-pointer ${
                    isSelected
                      ? 'scale-125 border-white shadow-lg ring-2 ring-purple-500/50'
                      : 'border-slate-800 hover:scale-110'
                  }`}
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                />
              );
            })}
          </div>

          {/* Interactive Player 8x8 Canvas */}
          <div
            className="grid grid-cols-8 gap-1.5 p-3 rounded-2xl bg-slate-950 border-2 border-purple-500/40 w-fit mx-auto shadow-2xl touch-none select-none"
            onMouseDown={() => setIsMouseDown(true)}
            onMouseUp={() => setIsMouseDown(false)}
            onMouseLeave={() => setIsMouseDown(false)}
          >
            {grid.map((row, rIdx) =>
              row.map((cellHex, cIdx) => {
                const targetHex = currentChallenge.targetGrid[rIdx][cIdx];
                const isCellCorrect = cellHex === targetHex;

                return (
                  <button
                    key={`player-${rIdx}-${cIdx}`}
                    type="button"
                    onClick={() => colorCell(rIdx, cIdx)}
                    onMouseEnter={() => {
                      if (isMouseDown && activeTool === 'pen') {
                        colorCell(rIdx, cIdx);
                      }
                    }}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md border transition-all cursor-pointer relative overflow-hidden active:scale-95 ${
                      isCellCorrect
                        ? 'border-emerald-500/40'
                        : 'border-slate-800 hover:border-purple-400'
                    }`}
                    style={{ backgroundColor: cellHex }}
                  >
                    {isCellCorrect && cellHex !== EMPTY_COLOR && (
                      <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onBack}
              className="text-xs text-slate-400 hover:text-white transition cursor-pointer"
            >
              ← Părăsește Duelul
            </button>

            <div className="text-right">
              <span className="text-xs font-black text-emerald-400">
                {accuracy >= 100 ? '✅ Etapă Perfectă!' : `Potrivire Pixeli: ${accuracy}%`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
