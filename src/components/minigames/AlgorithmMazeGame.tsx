import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { sounds } from '../../utils/audio';
import { updateActiveArcadeScore } from '../../lib/studentAuthService';
import {
  Play,
  RotateCcw,
  ArrowLeft,
  ArrowUp,
  RotateCw,
  Trophy,
  CheckCircle2,
  XCircle,
  Bot,
  Flag,
  HelpCircle,
  Layers,
  Repeat,
  Sparkles,
  Zap,
  Undo2,
  Trash2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

interface AlgorithmMazeGameProps {
  onBack: () => void;
  studentName?: string;
}

type Direction = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';
export type CommandType = 'FORWARD' | 'TURN_LEFT' | 'TURN_RIGHT' | 'REPEAT_2' | 'REPEAT_3';

interface Cell {
  row: number;
  col: number;
}

interface MazeLevel {
  id: number;
  nameRo: string;
  nameEn: string;
  gridSize: number;
  startPos: Cell;
  startDir: Direction;
  targetPos: Cell;
  walls: Cell[];
  stars: Cell[];
  maxCommands: number;
  hintRo: string;
  hintEn: string;
  conceptRo: string;
  conceptEn: string;
  idealPathNoteRo?: string;
  idealPathNoteEn?: string;
}

export const MAZE_LEVELS: MazeLevel[] = [
  {
    id: 1,
    nameRo: 'Nivelul 1: Linia Dreaptă (Secvențialitate)',
    nameEn: 'Level 1: Straight Line (Sequencing)',
    conceptRo: 'Instrucțiuni secvențiale pas cu pas',
    conceptEn: 'Sequential step-by-step instructions',
    gridSize: 5,
    startPos: { row: 4, col: 2 },
    startDir: 'UP',
    targetPos: { row: 1, col: 2 },
    walls: [
      { row: 4, col: 1 }, { row: 4, col: 3 },
      { row: 2, col: 1 }, { row: 2, col: 3 },
      { row: 0, col: 2 },
    ],
    stars: [{ row: 3, col: 2 }, { row: 2, col: 2 }],
    maxCommands: 6,
    hintRo: 'Robotul Arky trebuie să meargă 3 pași înainte drept înainte! Poți folosi 3 x Înainte sau blocul optimizat Repetă x3 + Înainte.',
    hintEn: 'Robot Arky must move 3 steps straight forward! You can use 3 x Forward or the optimized Repeat x3 + Forward block.',
    idealPathNoteRo: 'Sfat optim: Folosește [Repetă x3] urmat de [Înainte] pentru a folosi doar 2 blocuri de memorie!',
    idealPathNoteEn: 'Pro tip: Use [Repeat x3] followed by [Forward] to use only 2 memory blocks!',
  },
  {
    id: 2,
    nameRo: 'Nivelul 2: Virajul în L (Rotiri la 90°)',
    nameEn: 'Level 2: The L-Turn (90° Rotations)',
    conceptRo: 'Schimbarea direcției la 90° (Stânga / Dreapta)',
    conceptEn: '90° Direction changes (Turn Left / Turn Right)',
    gridSize: 5,
    startPos: { row: 4, col: 1 },
    startDir: 'UP',
    targetPos: { row: 1, col: 4 },
    walls: [
      { row: 0, col: 1 }, { row: 0, col: 2 },
      { row: 2, col: 2 }, { row: 3, col: 2 }, { row: 4, col: 2 },
      { row: 1, col: 0 }, { row: 2, col: 4 },
    ],
    stars: [{ row: 2, col: 1 }, { row: 1, col: 3 }],
    maxCommands: 8,
    hintRo: 'Avansează 3 pași înainte (colectezi prima steluță), rotește la dreapta la 90°, apoi mergi încă 3 pași înainte spre server!',
    hintEn: 'Move 3 steps forward (collect first star), turn right 90°, then move 3 steps forward to the target server!',
    idealPathNoteRo: 'Traseu complet: 3 x Înainte ➔ Viraj Dreapta ➔ 3 x Înainte (ambele steluțe garantate!).',
    idealPathNoteEn: 'Complete path: 3 x Forward ➔ Turn Right ➔ 3 x Forward (both stars guaranteed!).',
  },
  {
    id: 3,
    nameRo: 'Nivelul 3: Zig-Zag prin Circuite (S-Curve)',
    nameEn: 'Level 3: Circuit Zig-Zag (S-Curve)',
    conceptRo: 'Alternarea virajelor Stânga / Dreapta',
    conceptEn: 'Alternating Left / Right turns',
    gridSize: 5,
    startPos: { row: 4, col: 0 },
    startDir: 'UP',
    targetPos: { row: 0, col: 4 },
    walls: [
      { row: 1, col: 0 }, { row: 1, col: 1 },
      { row: 3, col: 1 }, { row: 3, col: 2 }, { row: 3, col: 3 },
      { row: 1, col: 3 }, { row: 1, col: 4 },
    ],
    stars: [{ row: 3, col: 0 }, { row: 2, col: 2 }, { row: 1, col: 2 }],
    maxCommands: 12,
    hintRo: 'Traseul formează un S: 2 pași înainte, dreapta, 2 pași înainte, stânga, 2 pași înainte, dreapta, 2 pași înainte spre steag!',
    hintEn: 'The path forms an S: 2 steps forward, turn right, 2 steps forward, turn left, 2 steps forward, turn right, 2 steps forward!',
    idealPathNoteRo: 'Fiecare segment are exact 2 pași! Poți folosi [Repetă x2] înainte de fiecare avansare.',
    idealPathNoteEn: 'Each corridor is exactly 2 steps long! You can place [Repeat x2] before each forward move.',
  },
  {
    id: 4,
    nameRo: 'Nivelul 4: Magistrala Perimetrală (Optimizare Bucle)',
    nameEn: 'Level 4: Perimeter Highway (Loop Optimization)',
    conceptRo: 'Bucle multiple de iterație pentru distanțe mari',
    conceptEn: 'Multiple iteration loops for long stretches',
    gridSize: 6,
    startPos: { row: 5, col: 0 },
    startDir: 'UP',
    targetPos: { row: 0, col: 5 },
    walls: [
      { row: 4, col: 1 }, { row: 3, col: 1 }, { row: 2, col: 1 }, { row: 1, col: 1 },
      { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 }, { row: 2, col: 4 },
      { row: 3, col: 3 }, { row: 4, col: 3 },
    ],
    stars: [{ row: 3, col: 0 }, { row: 0, col: 2 }, { row: 0, col: 4 }],
    maxCommands: 14,
    hintRo: 'Centrul este blocat de circuite defecte! Folosește coridorul exterior: 5 pași înainte spre colțul de sus, viraj la dreapta, apoi 5 pași înainte spre server!',
    hintEn: 'The center is blocked! Use the outer corridor: 5 steps forward to the top corner, turn right, then 5 steps forward to the server!',
    idealPathNoteRo: 'Optimizare bucle: 5 pași = [Repetă x3] + [Înainte] + [Repetă x2] + [Înainte]!',
    idealPathNoteEn: 'Loop optimization: 5 steps = [Repeat x3] + [Forward] + [Repeat x2] + [Forward]!',
  },
  {
    id: 5,
    nameRo: 'Nivelul 5: Spirala Microcipului (Nivel de Maestru)',
    nameEn: 'Level 5: Microchip Spiral (Master Level)',
    conceptRo: 'Algoritm spiralat & optimizare avansată',
    conceptEn: 'Spiral algorithm & advanced optimization',
    gridSize: 6,
    startPos: { row: 5, col: 5 },
    startDir: 'UP',
    targetPos: { row: 4, col: 3 },
    walls: [
      { row: 0, col: 5 }, { row: 0, col: 4 }, { row: 0, col: 3 }, { row: 0, col: 2 }, { row: 0, col: 1 },
      { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4 },
      { row: 3, col: 2 }, { row: 3, col: 4 },
      { row: 5, col: 1 }, { row: 5, col: 2 }, { row: 5, col: 3 },
    ],
    stars: [{ row: 3, col: 5 }, { row: 1, col: 3 }, { row: 3, col: 1 }],
    maxCommands: 16,
    hintRo: 'Robotul navighează într-o spirală concentrice: 4 pași înainte ➔ viraj stânga ➔ 4 pași înainte ➔ viraj stânga ➔ 3 pași înainte ➔ viraj stânga ➔ 2 pași înainte spre nucleu!',
    hintEn: 'The robot spirals inwards: 4 steps forward ➔ turn left ➔ 4 steps forward ➔ turn left ➔ 3 steps forward ➔ turn left ➔ 2 steps forward into the core!',
    idealPathNoteRo: 'Toate cele 3 steluțe sunt pe traseul natural al spiralei. Folosește buclele x2 și x3 cu încredere!',
    idealPathNoteEn: 'All 3 bonus stars lie along the spiral path. Use loops x2 and x3 effectively!',
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

  // Execution speed (Normal / Fast)
  const [execSpeed, setExecSpeed] = useState<'normal' | 'fast'>('normal');

  // Stats
  const [score, setScore] = useState<number>(0);
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

  // Level Reset
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

  // Reset only robot position (keep commands for fixing!)
  const resetRobotPositionOnly = () => {
    setRobotPos(currentLevel.startPos);
    setRobotDir(currentLevel.startDir);
    setIsRunning(false);
    setActiveStepIdx(-1);
    setCollectedStars([]);
    setExecutionResult(null);
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
    // If player had a failure message showing, dismiss it when they start editing
    if (executionResult && executionResult !== 'success') {
      setExecutionResult(null);
      setRobotPos(currentLevel.startPos);
      setRobotDir(currentLevel.startDir);
    }
  };

  const removeLastCommand = () => {
    if (isRunning || commands.length === 0) return;
    sounds.playClick();
    setCommands((prev) => prev.slice(0, -1));
    if (executionResult && executionResult !== 'success') {
      setExecutionResult(null);
      setRobotPos(currentLevel.startPos);
      setRobotDir(currentLevel.startDir);
    }
  };

  const removeCommandAtIndex = (index: number) => {
    if (isRunning) return;
    sounds.playClick();
    setCommands((prev) => prev.filter((_, idx) => idx !== index));
    if (executionResult && executionResult !== 'success') {
      setExecutionResult(null);
      setRobotPos(currentLevel.startPos);
      setRobotDir(currentLevel.startDir);
    }
  };

  const clearAllCommands = () => {
    if (isRunning) return;
    sounds.playClick();
    setCommands([]);
    setExecutionResult(null);
    setRobotPos(currentLevel.startPos);
    setRobotDir(currentLevel.startDir);
    setCollectedStars([]);
  };

  // Directions
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

  // Expand "REPEAT_2" and "REPEAT_3" into primitive actions for step execution
  // Also track which original command index corresponds to which step for UI highlighting
  interface ExpandedStep {
    cmd: 'FORWARD' | 'TURN_LEFT' | 'TURN_RIGHT';
    sourceCmdIdx: number;
    subStep: number;
    totalSubSteps: number;
  }

  const expandCommands = (cmds: CommandType[]): ExpandedStep[] => {
    const steps: ExpandedStep[] = [];
    let i = 0;
    while (i < cmds.length) {
      const c = cmds[i];
      if (c === 'REPEAT_2' && i + 1 < cmds.length && cmds[i + 1] !== 'REPEAT_2' && cmds[i + 1] !== 'REPEAT_3') {
        const targetCmd = cmds[i + 1] as 'FORWARD' | 'TURN_LEFT' | 'TURN_RIGHT';
        steps.push({ cmd: targetCmd, sourceCmdIdx: i, subStep: 1, totalSubSteps: 2 });
        steps.push({ cmd: targetCmd, sourceCmdIdx: i + 1, subStep: 2, totalSubSteps: 2 });
        i += 2;
      } else if (c === 'REPEAT_3' && i + 1 < cmds.length && cmds[i + 1] !== 'REPEAT_2' && cmds[i + 1] !== 'REPEAT_3') {
        const targetCmd = cmds[i + 1] as 'FORWARD' | 'TURN_LEFT' | 'TURN_RIGHT';
        steps.push({ cmd: targetCmd, sourceCmdIdx: i, subStep: 1, totalSubSteps: 3 });
        steps.push({ cmd: targetCmd, sourceCmdIdx: i + 1, subStep: 2, totalSubSteps: 3 });
        steps.push({ cmd: targetCmd, sourceCmdIdx: i + 1, subStep: 3, totalSubSteps: 3 });
        i += 2;
      } else if (c === 'REPEAT_2' || c === 'REPEAT_3') {
        // standalone repeat without follower is ignored
        i += 1;
      } else {
        steps.push({
          cmd: c as 'FORWARD' | 'TURN_LEFT' | 'TURN_RIGHT',
          sourceCmdIdx: i,
          subStep: 1,
          totalSubSteps: 1,
        });
        i += 1;
      }
    }
    return steps;
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

    const expandedSteps = expandCommands(commands);
    let curPos = { ...currentLevel.startPos };
    let curDir = currentLevel.startDir;
    const curStars: Cell[] = [];
    const stepDelay = execSpeed === 'fast' ? 240 : 420;

    for (let i = 0; i < expandedSteps.length; i++) {
      const step = expandedSteps[i];
      setActiveStepIdx(step.sourceCmdIdx);

      await new Promise((resolve) => setTimeout(resolve, stepDelay));

      if (step.cmd === 'FORWARD') {
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

          // AUTO-RESET ROBOT AFTER DELAY so student is ready for the next try
          setTimeout(() => {
            setRobotPos(currentLevel.startPos);
            setRobotDir(currentLevel.startDir);
            setCollectedStars([]);
          }, 1800);
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

          // AUTO-RESET ROBOT AFTER DELAY
          setTimeout(() => {
            setRobotPos(currentLevel.startPos);
            setRobotDir(currentLevel.startDir);
            setCollectedStars([]);
          }, 1800);
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
      } else if (step.cmd === 'TURN_LEFT') {
        curDir = rotateLeft(curDir);
        setRobotDir(curDir);
        sounds.playClick();
      } else if (step.cmd === 'TURN_RIGHT') {
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

      // Score calculation: 200 base + 75 per star + bonus for saving command slots
      const starBonus = curStars.length * 75;
      const memoryBonus = (currentLevel.maxCommands - commands.length) * 20;
      const levelScore = 200 + starBonus + Math.max(0, memoryBonus);
      const newScore = score + levelScore;
      setScore(newScore);

      arky.triggerSuccess(
        lang === 'en'
          ? `Algorithm executed successfully! Destination reached with ${curStars.length}/${currentLevel.stars.length} stars!`
          : `Algoritm executat cu succes! Robotul a ajuns la destinație cu ${curStars.length}/${currentLevel.stars.length} steluțe! 🤖✨`
      );

      // Check if all levels completed
      if (currentLevelIdx + 1 >= MAZE_LEVELS.length) {
        setIsCompletedAll(true);
        if (newScore > highScore) {
          setHighScore(newScore);
          try {
            localStorage.setItem('arkedo_highscore_maze', String(newScore));
            updateActiveArcadeScore('maze', newScore);
          } catch {
            // ignore
          }
        }
        arky.triggerFinished(
          lang === 'en'
            ? `Grand Algorithm Architect! You completed all 5 maze challenges! Score: ${newScore} pts!`
            : `Arhitect Maestru de Algoritmi! Ai absolvit toate cele 5 niveluri! Scor: ${newScore} puncte! 🏆⚡`
        );
      }
    } else {
      sounds.playWrong();
      setExecutionResult('timeout');
      arky.triggerIdle();

      // AUTO-RESET ROBOT TO START AFTER 2 SECONDS SO IT DOESN'T STAY STUCK
      setTimeout(() => {
        setRobotPos(currentLevel.startPos);
        setRobotDir(currentLevel.startDir);
        setCollectedStars([]);
      }, 2000);
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
    <div className="flex flex-col gap-5 max-w-5xl mx-auto w-full pb-10 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl">
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'en' ? 'Back to Arcade' : 'Înapoi la Jocuri'}</span>
        </button>

        <div className="flex items-center gap-2.5 text-center">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div className="text-left sm:text-center">
            <h1 className="text-sm sm:text-base font-black text-white font-heading">
              {lang === 'en' ? 'Algorithm Maze Robot' : 'Labirintul Algoritmic (Robotul TIC)'}
            </h1>
            <p className="text-[11px] text-emerald-400 font-mono">
              {lang === 'en' ? 'Program Movements, 90° Turns & Iteration Loops' : 'Programează Pașii, Virajele și Buclele de Repetare'}
            </p>
          </div>
        </div>

        {/* High Score Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
          <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Record: {highScore} pts</span>
        </div>
      </div>

      {/* Main Container */}
      {!isCompletedAll ? (
        <div className="bg-slate-900/95 border-2 border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-5 relative">
          {/* Top Bar: Level info, Concept badge, Hint button, Score */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-300">
                {lang === 'en' ? `Level ${currentLevel.id} / ${MAZE_LEVELS.length}` : `Nivelul ${currentLevel.id} / ${MAZE_LEVELS.length}`}
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white">
                  {lang === 'en' ? currentLevel.nameEn : currentLevel.nameRo}
                </h2>
                <div className="text-[11px] text-emerald-400/80 font-mono">
                  💡 {lang === 'en' ? currentLevel.conceptEn : currentLevel.conceptRo}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Reset Robot Position Button */}
              <button
                onClick={resetRobotPositionOnly}
                disabled={isRunning}
                title={lang === 'en' ? 'Reset Robot Position to Start' : 'Resetează Robotul la Start'}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">{lang === 'en' ? 'Reset Pos' : 'Reset Poziție'}</span>
              </button>

              {/* Toggle Hint */}
              <button
                onClick={() => setShowHint((prev) => !prev)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  showHint
                    ? 'bg-amber-500/20 text-amber-200 border-amber-500/50'
                    : 'bg-slate-800 hover:bg-slate-750 text-amber-300 border-slate-700'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>{showHint ? (lang === 'en' ? 'Hide Hint' : 'Ascunde') : (lang === 'en' ? 'Hint & Strategy 💡' : 'Indiciu & Strategie 💡')}</span>
              </button>

              {/* Score Display */}
              <div className="bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-black text-white font-mono">{score} pts</span>
              </div>
            </div>
          </div>

          {/* Expanded Rich Didactic Hint Box */}
          {showHint && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border-2 border-amber-500/40 text-xs text-amber-100 flex flex-col gap-2 animate-fadeIn shadow-lg">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{lang === 'en' ? 'Algorithmic Guidance & Walkthrough:' : 'Ghid Algoritmic Pas cu Pas:'}</span>
              </div>
              <p className="leading-relaxed">
                {lang === 'en' ? currentLevel.hintEn : currentLevel.hintRo}
              </p>
              {currentLevel.idealPathNoteRo && (
                <div className="mt-1 pt-2 border-t border-amber-500/20 text-[11px] text-amber-200 font-mono">
                  {lang === 'en' ? currentLevel.idealPathNoteEn : currentLevel.idealPathNoteRo}
                </div>
              )}
            </div>
          )}

          {/* Grid Arena & Code Construction Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: The Maze Grid Stage */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950/90 border-2 border-slate-800 rounded-3xl p-4 sm:p-6 shadow-inner relative">
              <div className="w-full flex items-center justify-between mb-3 px-1 text-[11px] font-mono text-slate-400">
                <span className="text-emerald-400 font-bold">
                  Placă de Circuite {currentLevel.gridSize}x{currentLevel.gridSize}
                </span>
                <span className="flex items-center gap-1 text-amber-300">
                  ⭐ Steluțe colectate: {collectedStars.length} / {currentLevel.stars.length}
                </span>
              </div>

              <div
                className="grid gap-2 relative transition-all"
                style={{
                  gridTemplateColumns: `repeat(${currentLevel.gridSize}, minmax(0, 1fr))`,
                  width: '100%',
                  maxWidth: currentLevel.gridSize === 6 ? '390px' : '360px',
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
                    const isStartCell = currentLevel.startPos.row === rowIdx && currentLevel.startPos.col === colIdx;

                    return (
                      <div
                        key={`${rowIdx}-${colIdx}`}
                        className={`rounded-xl border flex items-center justify-center relative transition-all duration-300 ${
                          isWall
                            ? 'bg-rose-950/70 border-rose-600/60 shadow-inner'
                            : isTarget
                            ? 'bg-emerald-950/50 border-emerald-500/70 shadow-sm shadow-emerald-500/20'
                            : isStartCell
                            ? 'bg-slate-900/90 border-slate-700/80 ring-1 ring-emerald-500/30'
                            : 'bg-slate-900/60 border-slate-800/90'
                        }`}
                      >
                        {/* Grid coordinate subtle watermark */}
                        <span className="absolute bottom-1 right-1 text-[8px] font-mono text-slate-700/80 pointer-events-none">
                          {rowIdx},{colIdx}
                        </span>

                        {/* Wall obstacle */}
                        {isWall && (
                          <div className="flex flex-col items-center justify-center text-rose-400">
                            <span className="text-base sm:text-lg">🚧</span>
                          </div>
                        )}

                        {/* Target flag / server */}
                        {isTarget && !isRobotHere && (
                          <div className="flex flex-col items-center justify-center text-emerald-400 animate-pulse">
                            <Flag className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                          </div>
                        )}

                        {/* Star collectible */}
                        {isStar && !isCollected && !isRobotHere && (
                          <span className="text-sm sm:text-base animate-bounce drop-shadow">⭐</span>
                        )}

                        {/* Star collected icon trace */}
                        {isStar && isCollected && !isRobotHere && (
                          <span className="text-xs opacity-30">✨</span>
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

              {/* Legend & Grid Info */}
              <div className="flex flex-wrap items-center justify-center gap-3.5 mt-4 text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-3 w-full">
                <span className="flex items-center gap-1 text-emerald-300">
                  <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block"></span> Robot Arky
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <Flag className="w-3.5 h-3.5 fill-current inline" /> Destinație Server
                </span>
                <span className="flex items-center gap-1 text-rose-300">
                  🚧 Firewall / Obstacol
                </span>
                <span className="flex items-center gap-1 text-amber-300">
                  ⭐ Steluță (+75 pts)
                </span>
              </div>
            </div>

            {/* Right: Algorithm Command Blocks & Queue */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Command Palette (Instruction Blocks) */}
              <div className="p-4 rounded-3xl bg-slate-950 border-2 border-slate-800 flex flex-col gap-3 shadow-md">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    {lang === 'en' ? 'Instruction Blocks:' : 'Instrucțiuni Disponibile:'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                    commands.length >= currentLevel.maxCommands
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {commands.length} / {currentLevel.maxCommands} sloturi
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* FORWARD */}
                  <button
                    onClick={() => addCommand('FORWARD')}
                    disabled={isRunning || commands.length >= currentLevel.maxCommands}
                    className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-35 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20 border border-emerald-400/30"
                  >
                    <ArrowUp className="w-4 h-4 shrink-0 stroke-[2.5]" />
                    <span>Înainte (1 pas)</span>
                  </button>

                  {/* TURN LEFT */}
                  <button
                    onClick={() => addCommand('TURN_LEFT')}
                    disabled={isRunning || commands.length >= currentLevel.maxCommands}
                    className="p-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 disabled:opacity-35 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-600/20 border border-cyan-400/30"
                  >
                    <RotateCcw className="w-4 h-4 shrink-0 stroke-[2.5]" />
                    <span>Viraj Stânga 90°</span>
                  </button>

                  {/* TURN RIGHT */}
                  <button
                    onClick={() => addCommand('TURN_RIGHT')}
                    disabled={isRunning || commands.length >= currentLevel.maxCommands}
                    className="p-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 disabled:opacity-35 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-600/20 border border-cyan-400/30"
                  >
                    <RotateCw className="w-4 h-4 shrink-0 stroke-[2.5]" />
                    <span>Viraj Dreapta 90°</span>
                  </button>

                  {/* REPEAT 2 */}
                  <button
                    onClick={() => addCommand('REPEAT_2')}
                    disabled={isRunning || commands.length >= currentLevel.maxCommands}
                    className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-500 active:scale-95 disabled:opacity-35 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-600/20 border border-purple-400/30"
                  >
                    <Repeat className="w-4 h-4 shrink-0 stroke-[2.5]" />
                    <span>Repetă x2</span>
                  </button>

                  {/* REPEAT 3 (NEW!) */}
                  <button
                    onClick={() => addCommand('REPEAT_3')}
                    disabled={isRunning || commands.length >= currentLevel.maxCommands}
                    className="col-span-2 p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-35 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20 border border-indigo-400/30"
                  >
                    <Layers className="w-4 h-4 shrink-0 stroke-[2.5]" />
                    <span>Repetă x3 (Super-Buclă 🚀)</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 italic">
                  💡 Pune blocul de <strong>Repetă x2 / x3</strong> chiar înaintea instrucțiunii pe care vrei să o multiplici!
                </p>
              </div>

              {/* Execution Queue / Program Stack */}
              <div className="p-4 rounded-3xl bg-slate-950 border-2 border-slate-800 flex flex-col gap-3 min-h-[220px] shadow-md">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400">
                  <span className="text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    {lang === 'en' ? 'Program Sequence:' : 'Secvența de Comenzi:'}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={removeLastCommand}
                      disabled={isRunning || commands.length === 0}
                      className="text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1 disabled:opacity-30 cursor-pointer"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'Undo' : 'Anulează'}</span>
                    </button>
                    <button
                      onClick={clearAllCommands}
                      disabled={isRunning || commands.length === 0}
                      className="text-rose-400 hover:text-rose-300 text-xs font-bold flex items-center gap-1 disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'Clear' : 'Golește'}</span>
                    </button>
                  </div>
                </div>

                {/* List of blocks in sequence (clickable to delete individually!) */}
                <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 min-h-[95px] items-start content-start">
                  {commands.length === 0 ? (
                    <span className="text-xs text-slate-500 font-mono italic m-auto text-center py-4">
                      {lang === 'en'
                        ? 'Click the blocks above to assemble your algorithm...'
                        : 'Apasă pe blocurile de sus pentru a asambla algoritmul...'}
                    </span>
                  ) : (
                    commands.map((cmd, idx) => {
                      const isStepRunning = activeStepIdx === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => removeCommandAtIndex(idx)}
                          disabled={isRunning}
                          title={lang === 'en' ? 'Click to remove block' : 'Apasă pentru a șterge acest bloc'}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer hover:opacity-80 active:scale-95 ${
                            isStepRunning
                              ? 'ring-4 ring-emerald-400 scale-105 bg-emerald-400 text-slate-950 animate-pulse'
                              : cmd === 'FORWARD'
                              ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
                              : cmd === 'REPEAT_2'
                              ? 'bg-purple-950 border border-purple-500/50 text-purple-300'
                              : cmd === 'REPEAT_3'
                              ? 'bg-indigo-950 border border-indigo-500/50 text-indigo-300'
                              : 'bg-cyan-950 border border-cyan-500/50 text-cyan-300'
                          }`}
                        >
                          <span className="text-[10px] opacity-60">{idx + 1}.</span>
                          {cmd === 'FORWARD' && 'Înainte'}
                          {cmd === 'TURN_LEFT' && 'Stânga 90°'}
                          {cmd === 'TURN_RIGHT' && 'Dreapta 90°'}
                          {cmd === 'REPEAT_2' && 'Repetă x2'}
                          {cmd === 'REPEAT_3' && 'Repetă x3'}
                          <span className="text-[10px] text-slate-400 opacity-60 ml-0.5">✕</span>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Execution Speed Selector */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1 pt-1">
                  <span>{lang === 'en' ? 'Execution Speed:' : 'Viteză simulare:'}</span>
                  <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setExecSpeed('normal')}
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                        execSpeed === 'normal'
                          ? 'bg-emerald-500 text-slate-950'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Normal (1x)
                    </button>
                    <button
                      onClick={() => setExecSpeed('fast')}
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                        execSpeed === 'fast'
                          ? 'bg-emerald-500 text-slate-950'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Rapid (2x ⚡)
                    </button>
                  </div>
                </div>

                {/* Execution Feedback Alerts */}
                {executionResult && (
                  <div
                    className={`p-3.5 rounded-2xl text-xs font-bold font-mono animate-fadeIn flex items-center gap-2.5 ${
                      executionResult === 'success'
                        ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                        : 'bg-rose-500/20 text-rose-200 border border-rose-500/50 shadow-lg shadow-rose-500/10'
                    }`}
                  >
                    {executionResult === 'success' && (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <div>
                          <div>{lang === 'en' ? 'Destination reached!' : 'Destinație atinsă cu succes! Felicitări!'}</div>
                          <div className="text-[11px] text-emerald-300 font-normal">
                            ⭐ Steluțe colectate: {collectedStars.length} / {currentLevel.stars.length}
                          </div>
                        </div>
                      </>
                    )}
                    {executionResult === 'wall' && (
                      <>
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        <div>
                          <div>{lang === 'en' ? 'Robot collided with a firewall obstacle!' : 'Coliziune cu un obstacol firewall!'}</div>
                          <div className="text-[11px] text-rose-300 font-normal">
                            Robotul a fost readus automat la start. Ajustează instrucțiunile și reîncearcă!
                          </div>
                        </div>
                      </>
                    )}
                    {executionResult === 'bounds' && (
                      <>
                        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                        <div>
                          <div>{lang === 'en' ? 'Robot left the circuit grid!' : 'Robotul a părăsit perimetrul plăcii de circuite!'}</div>
                          <div className="text-[11px] text-rose-300 font-normal">
                            Robotul s-a resetat la poziția inițială. Verifică numărul de pași înainte de viraj!
                          </div>
                        </div>
                      </>
                    )}
                    {executionResult === 'timeout' && (
                      <>
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        <div>
                          <div>{lang === 'en' ? 'Commands finished before reaching target.' : 'Comenzile s-au terminat înainte de destinație!'}</div>
                          <div className="text-[11px] text-rose-300 font-normal">
                            Robotul s-a resetat la start. Mai adaugă pași sau bucle pentru a atinge steagul!
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Run & Next Level Controls */}
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={executeAlgorithm}
                    disabled={isRunning || commands.length === 0}
                    className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/25 active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{isRunning ? (lang === 'en' ? 'Executing Algorithm...' : 'Robotul Execută...') : (lang === 'en' ? 'Run Algorithm ▶' : 'Rulează Algoritmul ▶')}</span>
                  </button>

                  {executionResult === 'success' && currentLevelIdx + 1 < MAZE_LEVELS.length && (
                    <button
                      onClick={handleNextLevel}
                      className="px-5 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-lg shadow-blue-600/30 cursor-pointer animate-bounce active:scale-95"
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
                ? 'You have proven exceptional problem-solving and algorithmic sequencing skills by navigating all 5 maze obstacles with loops and turns!'
                : 'Ai demonstrat o gândire algoritmică impecabilă, ghidând robotul prin toate cele 5 circuite complexe cu viraje precise și bucle optimizate!'}
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
              <span className="text-xs text-slate-400 uppercase font-bold">Concepte TIC</span>
              <span className="text-sm font-black text-amber-400 font-mono mt-1 text-center">
                Bucle x2, x3 & Viraje 90°
              </span>
              <span className="text-[11px] text-slate-500">optimizare memorie</span>
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
