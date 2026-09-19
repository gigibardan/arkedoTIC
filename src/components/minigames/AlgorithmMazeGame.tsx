import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { sounds } from '../../utils/audio';
import {
  Compass,
  Play,
  RotateCcw,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  RotateCw,
  Trash2,
  Trophy,
  Flame,
  CheckCircle2,
  XCircle,
  Sparkles,
  Bot,
  Flag,
  HelpCircle,
  Cpu,
  Layers,
} from 'lucide-react';

interface AlgorithmMazeGameProps {
  onBack: () => void;
  studentName?: string;
}

type Direction = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';
type CommandType = 'FORWARD' | 'TURN_LEFT' | 'TURN_RIGHT' | 'REPEAT_2';

interface Cell {
  row: number;
  col: number;
}

interface MazeLevel {
  id: number;
  nameRo: string;
  nameEn: string;
  gridSize: number; // e.g. 5 for 5x5
  startPos: Cell;
  startDir: Direction;
  targetPos: Cell;
  walls: Cell[]; // Obstacles / firewalls / broken circuits
  stars: Cell[]; // Optional collectibles for bonus points
  maxCommands: number;
  hintRo: string;
  hintEn: string;
}

const MAZE_LEVELS: MazeLevel[] = [
  {
    id: 1,
    nameRo: 'Nivelul 1: Linia Dreaptă (Secvențialitate)',
    nameEn: 'Level 1: Straight Line (Sequencing)',
    gridSize: 5,
    startPos: { row: 4, col: 2 },
    startDir: 'UP',
    targetPos: { row: 1, col: 2 },
    walls: [
      { row: 2, col: 1 },
      { row: 2, col: 3 },
    ],
    stars: [{ row: 3, col: 2 }, { row: 2, col: 2 }],
    maxCommands: 5,
    hintRo: 'Robotul Arky trebuie să meargă 3 pași înainte drept înainte pentru a ajunge la serverul țintă.',
    hintEn: 'Robot Arky needs to move 3 steps forward to reach the destination target.',
  },
  {
    id: 2,
    nameRo: 'Nivelul 2: Virajul în L (Rotiri la 90°)',
    nameEn: 'Level 2: The L-Turn (90° Rotations)',
    gridSize: 5,
    startPos: { row: 4, col: 1 },
    startDir: 'UP',
    targetPos: { row: 1, col: 3 },
    walls: [
      { row: 2, col: 1 },
      { row: 3, col: 2 },
      { row: 2, col: 2 },
    ],
    stars: [{ row: 3, col: 1 }, { row: 1, col: 2 }],
    maxCommands: 7,
    hintRo: 'Mergi înainte, cotește la dreapta pentru a ocoli zidul de firewall, apoi înainte spre steag!',
    hintEn: 'Move forward, turn right to avoid the firewall obstacle, then proceed forward!',
  },
  {
    id: 3,
    nameRo: 'Nivelul 3: Zig-Zag prin Circuite',
    nameEn: 'Level 3: Circuit Zig-Zag',
    gridSize: 5,
    startPos: { row: 4, col: 0 },
    startDir: 'UP',
    targetPos: { row: 0, col: 4 },
    walls: [
      { row: 3, col: 0 },
      { row: 3, col: 2 },
      { row: 1, col: 2 },
      { row: 1, col: 4 },
      { row: 2, col: 4 },
    ],
    stars: [{ row: 4, col: 2 }, { row: 2, col: 2 }, { row: 0, col: 3 }],
    maxCommands: 10,
    hintRo: 'Navighează în zigzag prin deschiderile din plăcuța de circuite pentru a evita blocajele.',
    hintEn: 'Navigate in a zig-zag through the PCB corridor gaps to bypass circuit blocks.',
  },
  {
    id: 4,
    nameRo: 'Nivelul 4: Labirintul cu Repetare & Bucle',
    nameEn: 'Level 4: Loop Optimization Lab',
    gridSize: 6,
    startPos: { row: 5, col: 0 },
    startDir: 'UP',
    targetPos: { row: 0, col: 5 },
    walls: [
      { row: 4, col: 1 },
      { row: 4, col: 2 },
      { row: 2, col: 2 },
      { row: 2, col: 3 },
      { row: 2, col: 4 },
      { row: 4, col: 4 },
      { row: 1, col: 0 },
      { row: 0, col: 2 },
    ],
    stars: [{ row: 3, col: 0 }, { row: 3, col: 3 }, { row: 1, col: 5 }],
    maxCommands: 14,
    hintRo: 'Gândește algoritmul pas cu pas. Folosește butonul de Repetă x2 pentru a optimiza memoria robotului!',
    hintEn: 'Think algorithmically. Use the Repeat x2 block to optimize command memory!',
  },
];

export const AlgorithmMazeGame: React.FC<AlgorithmMazeGameProps> = ({ onBack, studentName }) => {
  const { lang } = useLanguage();
  const arky = useArky();

  const [currentLevelIdx, setCurrentLevelIdx] = useState<number>(0);
  const currentLevel = MAZE_LEVELS[currentLevelIdx];

  // Program command stack
  const [commands, setCommands] = useState<CommandType[]>([]);

  // Simulation execution state
  const [robotPos, setRobotPos] = useState<Cell>(currentLevel.startPos);
  const [robotDir, setRobotDir] = useState<Direction>(currentLevel.startDir);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(-1);
  const [collectedStars, setCollectedStars] = useState<Cell[]>([]);
  const [executionResult, setExecutionResult] = useState<'success' | 'wall' | 'bounds' | 'timeout' | null>(null);

  // Stats
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [isCompletedAll, setIsCompletedAll] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // High score
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_maze') || '0');
    } catch {
      return 0;
    }
  });

  // Reset state on level change
  const resetToLevelStart = () => {
    setRobotPos(currentLevel.startPos);
    setRobotDir(currentLevel.startDir);
    setCommands([]);
    setIsRunning(false);
    setActiveStepIdx(-1);
    setCollectedStars([]);
    setExecutionResult(null);
    setShowHint(false);
  };

  useEffect(() => {
    resetToLevelStart();
  }, [currentLevelIdx]);

  // Command management
  const addCommand = (cmd: CommandType) => {
    if (isRunning) return;
    if (commands.length >= currentLevel.maxCommands) {
      sounds.playWrong();
      return;
    }
    sounds.playClick();
    setCommands((prev) => [...prev, cmd]);
  };

  const removeLastCommand = () => {
    if (isRunning || commands.length === 0) return;
    sounds.playClick();
    setCommands((prev) => prev.slice(0, -1));
  };

  const clearAllCommands = () => {
    if (isRunning) return;
    sounds.playClick();
    setCommands([]);
    setExecutionResult(null);
  };

  // Helper for directions
  const rotateLeft = (dir: Direction): Direction => {
    switch (dir) {
      case 'UP': return 'LEFT';
      case 'LEFT': return 'DOWN';
      case 'DOWN': return 'RIGHT';
      case 'RIGHT': return 'UP';
    }
  };

  const rotateRight = (dir: Direction): Direction => {
    switch (dir) {
      case 'UP': return 'RIGHT';
      case 'RIGHT': return 'DOWN';
      case 'DOWN': return 'LEFT';
      case 'LEFT': return 'UP';
    }
  };

  const getForwardCell = (pos: Cell, dir: Direction): Cell => {
    switch (dir) {
      case 'UP': return { row: pos.row - 1, col: pos.col };
      case 'DOWN': return { row: pos.row + 1, col: pos.col };
      case 'LEFT': return { row: pos.row, col: pos.col - 1 };
      case 'RIGHT': return { row: pos.row, col: pos.col + 1 };
    }
  };

  // Expand "REPEAT_2" if present into primitive actions for execution
  const expandCommands = (cmds: CommandType[]): CommandType[] => {
    const expanded: CommandType[] = [];
    let i = 0;
    while (i < cmds.length) {
      if (cmds[i] === 'REPEAT_2' && i + 1 < cmds.length) {
        expanded.push(cmds[i + 1]);
        expanded.push(cmds[i + 1]);
        i += 2;
      } else if (cmds[i] === 'REPEAT_2') {
        // standalone repeat ignored
        i += 1;
      } else {
        expanded.push(cmds[i]);
        i += 1;
      }
    }
    return expanded;
  };

  // Run the algorithm step by step
  const executeAlgorithm = async () => {
    if (commands.length === 0 || isRunning) return;

    sounds.playClick();
    setIsRunning(true);
    setExecutionResult(null);
    setRobotPos(currentLevel.startPos);
    setRobotDir(currentLevel.startDir);
    setCollectedStars([]);

    const expanded = expandCommands(commands);
    let curPos = { ...currentLevel.startPos };
    let curDir = currentLevel.startDir;
    const curStars: Cell[] = [];

    for (let i = 0; i < expanded.length; i++) {
      setActiveStepIdx(i);
      const cmd = expanded[i];

      await new Promise((resolve) => setTimeout(resolve, 450));

      if (cmd === 'FORWARD') {
        const nextPos = getForwardCell(curPos, curDir);

        // Check bounds
        if (
          nextPos.row < 0 ||
          nextPos.row >= currentLevel.gridSize ||
          nextPos.col < 0 ||
          nextPos.col >= currentLevel.gridSize
        ) {
          sounds.playWrong();
          setExecutionResult('bounds');
          setIsRunning(false);
          setActiveStepIdx(-1);
          arky.triggerIdle();
          return;
        }

        // Check walls
        const hitWall = currentLevel.walls.some(
          (w) => w.row === nextPos.row && w.col === nextPos.col
        );
        if (hitWall) {
          sounds.playWrong();
          setExecutionResult('wall');
          setIsRunning(false);
          setActiveStepIdx(-1);
          arky.triggerIdle();
          return;
        }

        curPos = nextPos;
        setRobotPos(curPos);
        sounds.playClick();

        // Check star collection
        const foundStar = currentLevel.stars.find(
          (s) => s.row === curPos.row && s.col === curPos.col
        );
        if (foundStar && !curStars.some((s) => s.row === foundStar.row && s.col === foundStar.col)) {
          curStars.push(foundStar);
          setCollectedStars([...curStars]);
          sounds.playCorrect();
        }
      } else if (cmd === 'TURN_LEFT') {
        curDir = rotateLeft(curDir);
        setRobotDir(curDir);
        sounds.playClick();
      } else if (cmd === 'TURN_RIGHT') {
        curDir = rotateRight(curDir);
        setRobotDir(curDir);
        sounds.playClick();
      }
    }

    // Finished executing all commands
    setIsRunning(false);
    setActiveStepIdx(-1);

    // Check if target reached
    if (curPos.row === currentLevel.targetPos.row && curPos.col === currentLevel.targetPos.col) {
      sounds.playVictory();
      setExecutionResult('success');

      const levelScore = 200 + curStars.length * 50 + (currentLevel.maxCommands - commands.length) * 15;
      const newScore = score + levelScore;
      setScore(newScore);

      arky.triggerSuccess(
        lang === 'en'
          ? `Algorithm executed successfully! Destination reached with ${curStars.length} stars!`
          : `Algoritm executat cu succes! Robotul a ajuns la destinație colectând ${curStars.length} steluțe! 🤖✨`
      );

      // Check if all levels completed
      if (currentLevelIdx + 1 >= MAZE_LEVELS.length) {
        setIsCompletedAll(true);
        if (newScore > highScore) {
          setHighScore(newScore);
          try {
            localStorage.setItem('arkedo_highscore_maze', String(newScore));
          } catch {
            // ignore
          }
        }
        arky.triggerFinished(
          lang === 'en'
            ? `Master of Algorithms! You guided the robot through all maze obstacles! Score: ${newScore} pts!`
            : `Maestru al Algoritmilor! Ai ghidat robotul prin toate circuitele! Scor: ${newScore} puncte! 🏆⚡`
        );
      }
    } else {
      sounds.playWrong();
      setExecutionResult('timeout');
      arky.triggerIdle();
    }
  };

  const handleNextLevel = () => {
    sounds.playClick();
    if (currentLevelIdx + 1 < MAZE_LEVELS.length) {
      setCurrentLevelIdx((prev) => prev + 1);
    }
  };

  const handleRestartGame = () => {
    sounds.playClick();
    setCurrentLevelIdx(0);
    setScore(0);
    setIsCompletedAll(false);
    resetToLevelStart();
    arky.triggerIdle();
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-10 select-none">
      {/* Top Header */}
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
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-white font-heading">
              {lang === 'en' ? 'Algorithm Maze Robot' : 'Labirintul Algoritmic (Robotul TIC)'}
            </h1>
            <p className="text-[11px] text-emerald-400 font-mono">
              {lang === 'en' ? 'Program Movements, Turns & Loops to Reach the Server' : 'Programează Pașii, Virajele și Buclele Robotului'}
            </p>
          </div>
        </div>

        {/* High Score Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Record: {highScore} pts</span>
        </div>
      </div>

      {/* Main Container */}
      {!isCompletedAll ? (
        <div className="bg-slate-900/95 border-2 border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col gap-6 relative">
          {/* Top Bar: Level info, Score */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-300">
                {lang === 'en' ? `Level ${currentLevel.id} / ${MAZE_LEVELS.length}` : `Nivelul ${currentLevel.id} / ${MAZE_LEVELS.length}`}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white">
                {lang === 'en' ? currentLevel.nameEn : currentLevel.nameRo}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowHint((prev) => !prev)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>{showHint ? (lang === 'en' ? 'Hide Hint' : 'Ascunde') : (lang === 'en' ? 'Hint 💡' : 'Indiciu 💡')}</span>
              </button>

              <div className="bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-black text-white font-mono">{score} pts</span>
              </div>
            </div>
          </div>

          {/* Optional Hint Banner */}
          {showHint && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 animate-fadeIn">
              <strong>{lang === 'en' ? 'Didactic Hint:' : 'Indiciu Didactic:'}</strong>{' '}
              {lang === 'en' ? currentLevel.hintEn : currentLevel.hintRo}
            </div>
          )}

          {/* Grid Arena & Code Construction Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: The Maze Grid Stage */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950/90 border-2 border-slate-800 rounded-2xl p-4 sm:p-6 shadow-inner relative">
              <div
                className="grid gap-2 relative"
                style={{
                  gridTemplateColumns: `repeat(${currentLevel.gridSize}, minmax(0, 1fr))`,
                  width: '100%',
                  maxWidth: '380px',
                  aspectRatio: '1 / 1',
                }}
              >
                {Array.from({ length: currentLevel.gridSize }).map((_, rowIdx) =>
                  Array.from({ length: currentLevel.gridSize }).map((_, colIdx) => {
                    const isRobotHere = robotPos.row === rowIdx && robotPos.col === colIdx;
                    const isTarget = currentLevel.targetPos.row === rowIdx && currentLevel.targetPos.col === colIdx;
                    const isWall = currentLevel.walls.some((w) => w.row === rowIdx && w.col === colIdx);
                    const isStar = currentLevel.stars.some((s) => s.row === rowIdx && s.col === colIdx);
                    const isCollected = collectedStars.some((s) => s.row === rowIdx && s.col === colIdx);

                    return (
                      <div
                        key={`${rowIdx}-${colIdx}`}
                        className={`rounded-xl border flex items-center justify-center relative transition-all duration-300 ${
                          isWall
                            ? 'bg-rose-950/60 border-rose-600/50 shadow-inner'
                            : isTarget
                            ? 'bg-emerald-950/50 border-emerald-500/60'
                            : 'bg-slate-900/60 border-slate-800'
                        }`}
                      >
                        {/* Grid coordinate watermark */}
                        <span className="absolute bottom-1 right-1 text-[8px] font-mono text-slate-700 pointer-events-none">
                          {rowIdx},{colIdx}
                        </span>

                        {/* Wall obstacle */}
                        {isWall && (
                          <div className="flex flex-col items-center justify-center text-rose-400">
                            <span className="text-base sm:text-xl">🚧</span>
                          </div>
                        )}

                        {/* Target flag */}
                        {isTarget && !isRobotHere && (
                          <div className="flex flex-col items-center justify-center text-emerald-400 animate-pulse">
                            <Flag className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                          </div>
                        )}

                        {/* Star collectible */}
                        {isStar && !isCollected && !isRobotHere && (
                          <span className="text-sm sm:text-base animate-bounce">⭐</span>
                        )}

                        {/* Robot avatar */}
                        {isRobotHere && (
                          <div
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 text-slate-950 flex items-center justify-center shadow-lg transition-transform duration-300 z-10"
                            style={{
                              transform:
                                robotDir === 'UP'
                                  ? 'rotate(0deg)'
                                  : robotDir === 'RIGHT'
                                  ? 'rotate(90deg)'
                                  : robotDir === 'DOWN'
                                  ? 'rotate(180deg)'
                                  : 'rotate(270deg)',
                            }}
                          >
                            <Bot className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block"></span> Robot Arky
                </span>
                <span className="flex items-center gap-1">
                  <Flag className="w-3 h-3 text-emerald-400 inline" /> Destinație
                </span>
                <span className="flex items-center gap-1">🚧 Firewall / Zid</span>
                <span className="flex items-center gap-1">⭐ Bonus</span>
              </div>
            </div>

            {/* Right: Algorithm Command Blocks & Queue */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Command Palette (Instruction Blocks) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  <span>{lang === 'en' ? 'Instruction Blocks:' : 'Instrucțiuni Disponibile:'}</span>
                  <span className="text-emerald-400">
                    {commands.length} / {currentLevel.maxCommands} sloturi
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => addCommand('FORWARD')}
                    disabled={isRunning || commands.length >= currentLevel.maxCommands}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
                  >
                    <ArrowUp className="w-4 h-4" />
                    <span>Înainte (1 pas)</span>
                  </button>

                  <button
                    onClick={() => addCommand('TURN_LEFT')}
                    disabled={isRunning || commands.length >= currentLevel.maxCommands}
                    className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Viraj Stânga (90°)</span>
                  </button>

                  <button
                    onClick={() => addCommand('TURN_RIGHT')}
                    disabled={isRunning || commands.length >= currentLevel.maxCommands}
                    className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>Viraj Dreapta (90°)</span>
                  </button>

                  <button
                    onClick={() => addCommand('REPEAT_2')}
                    disabled={isRunning || commands.length >= currentLevel.maxCommands}
                    className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Bucle Repetă x2</span>
                  </button>
                </div>
              </div>

              {/* Execution Queue / Program Stack */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-3 min-h-[190px]">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400">
                  <span>{lang === 'en' ? 'Program Queue (Sequence):' : 'Secvența de Comenzi a Robotului:'}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={removeLastCommand}
                      disabled={isRunning || commands.length === 0}
                      className="text-slate-400 hover:text-white text-[11px] underline disabled:opacity-30 cursor-pointer"
                    >
                      Șterge ultimul
                    </button>
                    <button
                      onClick={clearAllCommands}
                      disabled={isRunning || commands.length === 0}
                      className="text-rose-400 hover:text-rose-300 text-[11px] underline disabled:opacity-30 cursor-pointer"
                    >
                      Golește tot
                    </button>
                  </div>
                </div>

                {/* List of blocks in sequence */}
                <div className="flex flex-wrap gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 min-h-[90px] items-start">
                  {commands.length === 0 ? (
                    <span className="text-xs text-slate-600 font-mono italic m-auto">
                      {lang === 'en'
                        ? 'Select blocks above to build algorithm...'
                        : 'Apasă pe instrucțiunile de mai sus pentru a construi algoritmul...'}
                    </span>
                  ) : (
                    commands.map((cmd, idx) => {
                      const isStepRunning = activeStepIdx === idx;
                      return (
                        <div
                          key={idx}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                            isStepRunning
                              ? 'ring-2 ring-emerald-400 scale-105 bg-emerald-500 text-slate-950'
                              : cmd === 'FORWARD'
                              ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                              : cmd === 'REPEAT_2'
                              ? 'bg-purple-950 border border-purple-500/40 text-purple-300'
                              : 'bg-cyan-950 border border-cyan-500/40 text-cyan-300'
                          }`}
                        >
                          <span className="text-[10px] opacity-60">{idx + 1}.</span>
                          {cmd === 'FORWARD' && 'Înainte'}
                          {cmd === 'TURN_LEFT' && 'Stânga'}
                          {cmd === 'TURN_RIGHT' && 'Dreapta'}
                          {cmd === 'REPEAT_2' && 'Repetă x2'}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Execution Feedback Alerts */}
                {executionResult && (
                  <div
                    className={`p-3 rounded-xl text-xs font-bold font-mono animate-fadeIn flex items-center gap-2 ${
                      executionResult === 'success'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {executionResult === 'success' && (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{lang === 'en' ? 'Destination reached!' : 'Destinație atinsă cu succes! Felicitări!'}</span>
                      </>
                    )}
                    {executionResult === 'wall' && (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{lang === 'en' ? 'Robot collided with a firewall obstacle!' : 'Coliziune cu un zid firewall! Modifică traseul.'}</span>
                      </>
                    )}
                    {executionResult === 'bounds' && (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{lang === 'en' ? 'Robot left the circuit grid!' : 'Robotul a părăsit perimetrul plăcii de circuite!'}</span>
                      </>
                    )}
                    {executionResult === 'timeout' && (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{lang === 'en' ? 'All commands finished, but destination was not reached.' : 'Comenzile s-au terminat înainte de a ajunge la steag! Mai adaugă pași.'}</span>
                      </>
                    )}
                  </div>
                )}

                {/* Run & Next Level Controls */}
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={executeAlgorithm}
                    disabled={isRunning || commands.length === 0}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{isRunning ? (lang === 'en' ? 'Running Code...' : 'Rulează...') : (lang === 'en' ? 'Run Algorithm ▶' : 'Rulează Algoritmul ▶')}</span>
                  </button>

                  {executionResult === 'success' && currentLevelIdx + 1 < MAZE_LEVELS.length && (
                    <button
                      onClick={handleNextLevel}
                      className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-lg shadow-blue-600/30 cursor-pointer animate-bounce"
                    >
                      <span>{lang === 'en' ? 'Next Level ➔' : 'Nivelul Următor ➔'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Final Victory Screen */
        <div className="bg-slate-900/95 border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col items-center justify-center text-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/20 ring-4 ring-emerald-500/20 animate-bounce">
            🤖
          </div>

          <div>
            <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 uppercase tracking-wider">
              {lang === 'en' ? 'Algorithm Course Complete!' : 'Labirint Algoritmic Absolvit!'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-heading mt-2">
              {studentName ? `${studentName}, ` : ''}
              {lang === 'en' ? 'Grand Algorithm Architect! 💻⭐' : 'Arhitect Maestru de Algoritmi! 💻⭐'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-lg mt-2">
              {lang === 'en'
                ? 'You have proven exceptional problem-solving and algorithmic sequencing skills by navigating all maze obstacles!'
                : 'Ai demonstrat o gândire algoritmică impecabilă, ghidând robotul prin toate nivelurile de dificultate fără erori!'}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-w-lg w-full">
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 uppercase font-bold">Scor Total</span>
              <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono mt-1">
                {score}
              </span>
              <span className="text-[11px] text-slate-500">puncte</span>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 uppercase font-bold">Niveluri Finalizate</span>
              <span className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono mt-1">
                {MAZE_LEVELS.length} / {MAZE_LEVELS.length}
              </span>
              <span className="text-[11px] text-slate-500">fără blocaje</span>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 uppercase font-bold">Concept TIC</span>
              <span className="text-lg font-black text-amber-400 font-mono mt-1">
                Gândire Liniară
              </span>
              <span className="text-[11px] text-slate-500">& Bucle Structurate</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleRestartGame}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{lang === 'en' ? 'Play Again' : 'Joacă din Nou'}</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                onBack();
              }}
              className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-sm transition border border-slate-700 cursor-pointer"
            >
              <span>{lang === 'en' ? 'Back to Arcade' : 'Înapoi la Jocuri'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
