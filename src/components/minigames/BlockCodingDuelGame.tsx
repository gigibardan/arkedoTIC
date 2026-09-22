import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  RotateCcw,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Trophy,
  ArrowRight,
  HelpCircle,
  Cpu,
  Flame,
  Bot
} from 'lucide-react';
import {
  BlockCodingChallenge,
  CodeBlockType,
  GridCoord,
  DUEL_BLOCK_CODING_CHALLENGES
} from '../../lib/duelService';
import { sounds } from '../../utils/audio';

interface BlockCodingDuelGameProps {
  challenges?: BlockCodingChallenge[];
  currentLevelIndex: number;
  myScore: number;
  opponentProgress: number;
  opponentName?: string;
  opponentAvatar?: string;
  isHost: boolean;
  lang?: 'ro' | 'en';
  onLevelComplete: (pointsEarned: number, nextLevelIndex: number) => void;
  onFinishMatch: (finalScore: number) => void;
  onUpdateProgress: (progressPercent: number, currentScore: number, currentLevel: number) => void;
}

export interface WorkspaceBlock {
  uid: string;
  type: CodeBlockType;
  label: string;
  color: string;
  category: 'motion' | 'turn' | 'control' | 'action';
  multiplier?: number;
}

export const BlockCodingDuelGame: React.FC<BlockCodingDuelGameProps> = ({
  challenges = DUEL_BLOCK_CODING_CHALLENGES,
  currentLevelIndex,
  myScore,
  opponentProgress,
  opponentName = 'ByteBot 🤖',
  opponentAvatar = '🤖',
  lang = 'ro',
  onLevelComplete,
  onFinishMatch,
  onUpdateProgress
}) => {
  const activeChallenge = challenges[currentLevelIndex] || challenges[0];
  const totalLevels = challenges.length;

  // Character Execution State
  const [arkyPos, setArkyPos] = useState<GridCoord>(activeChallenge.startPos);
  const [arkyDirection, setArkyDirection] = useState<'N' | 'E' | 'S' | 'W'>(activeChallenge.startDirection);
  const [collectedItems, setCollectedItems] = useState<GridCoord[]>([]);
  const [trail, setTrail] = useState<GridCoord[]>([activeChallenge.startPos]);

  // Workspace Blocks State
  const [workspace, setWorkspace] = useState<WorkspaceBlock[]>([]);
  const [activeExecutingIdx, setActiveExecutingIdx] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [executionMessage, setExecutionMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  // Level Timer & Score
  const [levelStartTime, setLevelStartTime] = useState<number>(Date.now());
  const [accumulatedScore, setAccumulatedScore] = useState<number>(myScore);
  const [levelSuccess, setLevelSuccess] = useState(false);

  // Simulated Bot Progress (if playing against bot/solo)
  const [botLevel, setBotLevel] = useState(1);
  const [botStatus, setBotStatus] = useState(lang === 'en' ? 'Assembling blocks...' : 'Asamblează scriptul...');

  // Reset character when level changes
  useEffect(() => {
    setArkyPos(activeChallenge.startPos);
    setArkyDirection(activeChallenge.startDirection);
    setCollectedItems([]);
    setTrail([activeChallenge.startPos]);
    setWorkspace([]);
    setActiveExecutingIdx(null);
    setIsRunning(false);
    setExecutionMessage(null);
    setLevelSuccess(false);
    setLevelStartTime(Date.now());
  }, [currentLevelIndex, activeChallenge]);

  // Bot simulation loop (if opponent is bot)
  useEffect(() => {
    if (!opponentName.includes('Bot')) return;
    const interval = setInterval(() => {
      if (levelSuccess) return;
      const r = Math.random();
      if (r > 0.6) {
        setBotStatus(lang === 'en' ? 'Running code test...' : 'Rulează test de cod...');
      } else {
        setBotStatus(lang === 'en' ? 'Optimizing loops...' : 'Optimizează buclele...');
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [opponentName, levelSuccess, lang]);

  // Available Block Templates
  const getBlockConfig = (type: CodeBlockType) => {
    switch (type) {
      case 'move_forward':
        return {
          label: lang === 'en' ? 'Move Forward (1 step)' : 'Mergi în față (1 pas)',
          color: 'bg-blue-600 border-blue-400 text-white hover:bg-blue-500 shadow-blue-500/25',
          category: 'motion' as const,
          icon: '⬆️'
        };
      case 'turn_left':
        return {
          label: lang === 'en' ? 'Turn Left 90°' : 'Viraj la Stânga 90°',
          color: 'bg-orange-600 border-orange-400 text-white hover:bg-orange-500 shadow-orange-500/25',
          category: 'turn' as const,
          icon: '↩️'
        };
      case 'turn_right':
        return {
          label: lang === 'en' ? 'Turn Right 90°' : 'Viraj la Dreapta 90°',
          color: 'bg-amber-600 border-amber-400 text-white hover:bg-amber-500 shadow-amber-500/25',
          category: 'turn' as const,
          icon: '↪️'
        };
      case 'repeat_2':
        return {
          label: lang === 'en' ? 'Repeat 2x [Step]' : 'Repetă de 2 ori [Pas]',
          color: 'bg-purple-600 border-purple-400 text-white hover:bg-purple-500 shadow-purple-500/25',
          category: 'control' as const,
          icon: '🔁',
          multiplier: 2
        };
      case 'repeat_3':
        return {
          label: lang === 'en' ? 'Repeat 3x [Step]' : 'Repetă de 3 ori [Pas]',
          color: 'bg-purple-700 border-purple-400 text-white hover:bg-purple-600 shadow-purple-500/25',
          category: 'control' as const,
          icon: '🔁',
          multiplier: 3
        };
      case 'collect':
        return {
          label: lang === 'en' ? 'Collect Data Item' : 'Culege Stea / Cip RAM',
          color: 'bg-cyan-600 border-cyan-400 text-white hover:bg-cyan-500 shadow-cyan-500/25',
          category: 'action' as const,
          icon: '⭐'
        };
      default:
        return {
          label: 'Bloc Cod',
          color: 'bg-slate-700 border-slate-500 text-white',
          category: 'motion' as const,
          icon: '📦'
        };
    }
  };

  // Add block to workspace
  const handleAddBlock = (type: CodeBlockType) => {
    if (isRunning || levelSuccess) return;
    sounds.playClick();
    const cfg = getBlockConfig(type);
    const newBlock: WorkspaceBlock = {
      uid: 'block_' + Math.random().toString(36).substring(2, 9),
      type,
      label: cfg.label,
      color: cfg.color,
      category: cfg.category,
      multiplier: 'multiplier' in cfg ? cfg.multiplier : undefined
    };
    setWorkspace((prev) => [...prev, newBlock]);
    setExecutionMessage(null);
  };

  // Remove block
  const handleRemoveBlock = (uid: string) => {
    if (isRunning || levelSuccess) return;
    sounds.playClick();
    setWorkspace((prev) => prev.filter((b) => b.uid !== uid));
  };

  // Move block up
  const handleMoveUp = (idx: number) => {
    if (isRunning || levelSuccess || idx <= 0) return;
    sounds.playClick();
    setWorkspace((prev) => {
      const copy = [...prev];
      const temp = copy[idx - 1];
      copy[idx - 1] = copy[idx];
      copy[idx] = temp;
      return copy;
    });
  };

  // Move block down
  const handleMoveDown = (idx: number) => {
    if (isRunning || levelSuccess || idx >= workspace.length - 1) return;
    sounds.playClick();
    setWorkspace((prev) => {
      const copy = [...prev];
      const temp = copy[idx + 1];
      copy[idx + 1] = copy[idx];
      copy[idx] = temp;
      return copy;
    });
  };

  // Clear workspace
  const handleClearWorkspace = () => {
    if (isRunning || levelSuccess) return;
    sounds.playClick();
    setWorkspace([]);
    setArkyPos(activeChallenge.startPos);
    setArkyDirection(activeChallenge.startDirection);
    setCollectedItems([]);
    setTrail([activeChallenge.startPos]);
    setExecutionMessage(null);
  };

  // Turn rotation calculation
  const getNextDirection = (current: 'N' | 'E' | 'S' | 'W', turn: 'left' | 'right'): 'N' | 'E' | 'S' | 'W' => {
    const dirs: ('N' | 'E' | 'S' | 'W')[] = ['N', 'E', 'S', 'W'];
    const idx = dirs.indexOf(current);
    if (turn === 'left') {
      return dirs[(idx + 3) % 4];
    } else {
      return dirs[(idx + 1) % 4];
    }
  };

  // Move step calculation
  const getNextPosition = (current: GridCoord, dir: 'N' | 'E' | 'S' | 'W'): GridCoord => {
    switch (dir) {
      case 'N':
        return { x: current.x, y: current.y - 1 };
      case 'E':
        return { x: current.x + 1, y: current.y };
      case 'S':
        return { x: current.x, y: current.y + 1 };
      case 'W':
        return { x: current.x - 1, y: current.y };
    }
  };

  // Execute Code Script
  const handleRunCode = async () => {
    if (isRunning || levelSuccess) return;
    if (workspace.length === 0) {
      setExecutionMessage({
        type: 'info',
        text: lang === 'en' ? 'Add code blocks to your script first!' : 'Adaugă mai întâi blocuri de cod în script din paleta de mai jos!'
      });
      return;
    }

    setIsRunning(true);
    setExecutionMessage({
      type: 'info',
      text: lang === 'en' ? 'Executing algorithm...' : 'Arky execută algoritmul pas cu pas...'
    });

    // Reset character to start position before executing
    let curPos = { ...activeChallenge.startPos };
    let curDir = activeChallenge.startDirection;
    const curCollected: GridCoord[] = [];
    const curTrail: GridCoord[] = [{ ...curPos }];

    setArkyPos(curPos);
    setArkyDirection(curDir);
    setCollectedItems([]);
    setTrail(curTrail);

    sounds.playRetro('powerup');

    // Expand blocks into atomic execution steps
    interface ExecStep {
      type: 'move' | 'turn_left' | 'turn_right' | 'collect';
      sourceBlockIdx: number;
    }

    const steps: ExecStep[] = [];
    workspace.forEach((block, bIdx) => {
      if (block.type === 'move_forward') {
        steps.push({ type: 'move', sourceBlockIdx: bIdx });
      } else if (block.type === 'turn_left') {
        steps.push({ type: 'turn_left', sourceBlockIdx: bIdx });
      } else if (block.type === 'turn_right') {
        steps.push({ type: 'turn_right', sourceBlockIdx: bIdx });
      } else if (block.type === 'repeat_2') {
        steps.push({ type: 'move', sourceBlockIdx: bIdx });
        steps.push({ type: 'move', sourceBlockIdx: bIdx });
      } else if (block.type === 'repeat_3') {
        steps.push({ type: 'move', sourceBlockIdx: bIdx });
        steps.push({ type: 'move', sourceBlockIdx: bIdx });
        steps.push({ type: 'move', sourceBlockIdx: bIdx });
      } else if (block.type === 'collect') {
        steps.push({ type: 'collect', sourceBlockIdx: bIdx });
      }
    });

    // Execute steps sequentially with animated delays
    for (let s = 0; s < steps.length; s++) {
      const step = steps[s];
      setActiveExecutingIdx(step.sourceBlockIdx);

      await new Promise((r) => setTimeout(r, 420));

      if (step.type === 'turn_left') {
        curDir = getNextDirection(curDir, 'left');
        setArkyDirection(curDir);
        sounds.playRetro('duck');
      } else if (step.type === 'turn_right') {
        curDir = getNextDirection(curDir, 'right');
        setArkyDirection(curDir);
        sounds.playRetro('duck');
      } else if (step.type === 'move') {
        const nextPos = getNextPosition(curPos, curDir);

        // Check Boundary Collision
        if (
          nextPos.x < 0 ||
          nextPos.x >= activeChallenge.gridSize.width ||
          nextPos.y < 0 ||
          nextPos.y >= activeChallenge.gridSize.height
        ) {
          sounds.playRetro('hit');
          setExecutionMessage({
            type: 'error',
            text: lang === 'en'
              ? '💥 Border collision! Arky stepped out of the grid bounds.'
              : '💥 Coliziune cu marginea! Arky a ieșit în afara grilei de calcul.'
          });
          setIsRunning(false);
          setActiveExecutingIdx(null);
          return;
        }

        // Check Obstacle Collision (Firewall / Bug)
        const hitObstacle = activeChallenge.obstacles.some(
          (obs) => obs.x === nextPos.x && obs.y === nextPos.y
        );

        if (hitObstacle) {
          sounds.playRetro('hit');
          setExecutionMessage({
            type: 'error',
            text: lang === 'en'
              ? '🚨 Firewall Alert! Arky collided with a security barrier.'
              : '🚨 Alertă Firewall! Arky a lovit un obstacol de securitate. Reorganizează blocurile!'
          });
          setIsRunning(false);
          setActiveExecutingIdx(null);
          return;
        }

        // Valid move
        curPos = nextPos;
        curTrail.push({ ...curPos });
        setArkyPos({ ...curPos });
        setTrail([...curTrail]);
        sounds.playRetro('jump');

        // Check Collectibles
        const foundItem = activeChallenge.collectibles.find(
          (c) => c.x === curPos.x && c.y === curPos.y
        );
        if (foundItem && !curCollected.some((c) => c.x === foundItem.x && c.y === foundItem.y)) {
          curCollected.push(foundItem);
          setCollectedItems([...curCollected]);
          sounds.playRetro('coin');
        }
      } else if (step.type === 'collect') {
        const foundItem = activeChallenge.collectibles.find(
          (c) => c.x === curPos.x && c.y === curPos.y
        );
        if (foundItem && !curCollected.some((c) => c.x === foundItem.x && c.y === foundItem.y)) {
          curCollected.push(foundItem);
          setCollectedItems([...curCollected]);
          sounds.playRetro('coin');
        }
      }
    }

    setActiveExecutingIdx(null);
    setIsRunning(false);

    // Check if target destination reached!
    const reachedTarget =
      curPos.x === activeChallenge.targetPos.x && curPos.y === activeChallenge.targetPos.y;

    if (reachedTarget) {
      sounds.playVictory();
      setLevelSuccess(true);

      const elapsedSec = Math.max(1, Math.round((Date.now() - levelStartTime) / 1000));
      const speedBonus = Math.max(0, 150 - elapsedSec * 2);
      const itemsBonus = curCollected.length * 100;
      const efficiencyBonus = workspace.length <= activeChallenge.parBlocks ? 100 : 0;
      const levelScore = 300 + speedBonus + itemsBonus + efficiencyBonus;

      const newTotalScore = accumulatedScore + levelScore;
      setAccumulatedScore(newTotalScore);

      setExecutionMessage({
        type: 'success',
        text: lang === 'en'
          ? `🎉 Mission Complete! Reached ${activeChallenge.targetName} (+${levelScore} pts)`
          : `🎉 Misiune Îndeplinită! Arky a ajuns la ${activeChallenge.targetName} (+${levelScore} XP)`
      });

      const nextLevel = currentLevelIndex + 1;
      const overallProgress = Math.min(100, Math.round((nextLevel / totalLevels) * 100));
      onUpdateProgress(overallProgress, newTotalScore, nextLevel);

      setTimeout(() => {
        if (nextLevel >= totalLevels) {
          onFinishMatch(newTotalScore);
        } else {
          onLevelComplete(levelScore, nextLevel);
        }
      }, 1600);
    } else {
      sounds.playRetro('hit');
      setExecutionMessage({
        type: 'error',
        text: lang === 'en'
          ? `⚠️ Script finished, but Arky did not reach ${activeChallenge.targetName}. Keep coding!`
          : `⚠️ Scriptul s-a încheiat, dar Arky nu a ajuns la ${activeChallenge.targetName}. Mai adaugă pași!`
      });
    }
  };

  // Convert rotation to CSS degrees
  const getRotationDegrees = (dir: 'N' | 'E' | 'S' | 'W'): number => {
    switch (dir) {
      case 'N':
        return 0;
      case 'E':
        return 90;
      case 'S':
        return 180;
      case 'W':
        return 270;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Duel Challenge Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border-2 border-indigo-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-black tracking-wider uppercase border border-indigo-500/40 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {lang === 'en' ? `Level ${currentLevelIndex + 1} of ${totalLevels}` : `Nivelul ${currentLevelIndex + 1} din ${totalLevels}`}
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              {activeChallenge.concept}
            </span>
          </div>
          <h3 className="text-lg font-black text-white flex items-center gap-2 font-heading">
            🧩 {activeChallenge.title}
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            {activeChallenge.story}
          </p>
        </div>

        {/* Rival Progress Mini-HUD */}
        <div className="w-full md:w-auto p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-xl shadow-md">
            {opponentAvatar}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <span className="truncate">{opponentName}</span>
              <span className="text-[10px] text-rose-400">({opponentProgress}%)</span>
            </div>
            <div className="w-32 h-2 rounded-full bg-slate-800 overflow-hidden mt-1 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-amber-400 transition-all duration-300"
                style={{ width: `${Math.max(5, opponentProgress)}%` }}
              />
            </div>
            <span className="text-[9px] text-slate-400 block truncate mt-0.5">
              {botStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Main Duel Interactive Arena (Split: Grid & Code Workspace) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Game Grid & Character */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  {lang === 'en' ? 'Visual Matrix Grid' : 'Matricea Cibernetică TIC'}
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                  {activeChallenge.gridSize.width} x {activeChallenge.gridSize.height}
                </span>
              </div>
              <div className="text-xs font-mono text-amber-300 flex items-center gap-1">
                <span>⭐ Colectate: {collectedItems.length}/{activeChallenge.collectibles.length}</span>
              </div>
            </div>

            {/* Matrix Board */}
            <div className="relative p-3 rounded-2xl bg-slate-950 border-2 border-indigo-900/60 shadow-inner overflow-hidden">
              {/* Grid Background Lines */}
              <div
                className="grid gap-1.5 sm:gap-2 select-none"
                style={{
                  gridTemplateColumns: `repeat(${activeChallenge.gridSize.width}, minmax(0, 1fr))`
                }}
              >
                {Array.from({ length: activeChallenge.gridSize.height }).map((_, rIdx) =>
                  Array.from({ length: activeChallenge.gridSize.width }).map((_, cIdx) => {
                    const isArkyHere = arkyPos.x === cIdx && arkyPos.y === rIdx;
                    const isStart = activeChallenge.startPos.x === cIdx && activeChallenge.startPos.y === rIdx;
                    const isTarget = activeChallenge.targetPos.x === cIdx && activeChallenge.targetPos.y === rIdx;
                    const isObstacle = activeChallenge.obstacles.some((o) => o.x === cIdx && o.y === rIdx);
                    const isCollectible = activeChallenge.collectibles.some((c) => c.x === cIdx && c.y === rIdx);
                    const isCollected = collectedItems.some((c) => c.x === cIdx && c.y === rIdx);
                    const isTrail = trail.some((t) => t.x === cIdx && t.y === rIdx);

                    return (
                      <div
                        key={`cell_${rIdx}_${cIdx}`}
                        className={`aspect-square rounded-xl flex items-center justify-center relative transition-all duration-200 border ${
                          isObstacle
                            ? 'bg-rose-950/70 border-rose-600/70 shadow-inner'
                            : isTarget
                            ? 'bg-cyan-950/80 border-cyan-400 shadow-lg shadow-cyan-500/20 animate-pulse'
                            : isStart
                            ? 'bg-emerald-950/60 border-emerald-500/60'
                            : isTrail
                            ? 'bg-indigo-950/40 border-indigo-800/40'
                            : 'bg-slate-900/80 border-slate-800/80'
                        }`}
                      >
                        {/* Target Landmark */}
                        {isTarget && !isArkyHere && (
                          <div className="flex flex-col items-center justify-center text-center scale-95 sm:scale-100">
                            <span className="text-2xl sm:text-3xl animate-bounce">🔮</span>
                            <span className="text-[8px] sm:text-[9px] font-black text-cyan-300 uppercase tracking-tighter truncate max-w-[45px]">
                              {lang === 'en' ? 'TARGET' : 'ȚINTĂ'}
                            </span>
                          </div>
                        )}

                        {/* Start Marker */}
                        {isStart && !isArkyHere && !isTarget && (
                          <div className="text-center opacity-60">
                            <span className="text-lg">🚩</span>
                            <span className="text-[8px] font-bold text-emerald-400 block -mt-1">
                              START
                            </span>
                          </div>
                        )}

                        {/* Obstacle (Firewall / Bug) */}
                        {isObstacle && (
                          <div className="flex flex-col items-center justify-center text-center">
                            <span className="text-xl sm:text-2xl">🧱</span>
                            <span className="text-[7px] sm:text-[8px] font-black text-rose-300 uppercase tracking-tighter">
                              FIREWALL
                            </span>
                          </div>
                        )}

                        {/* Collectible Star / RAM */}
                        {isCollectible && !isCollected && !isArkyHere && !isTarget && (
                          <div className="animate-spin text-xl sm:text-2xl" style={{ animationDuration: '6s' }}>
                            ⭐
                          </div>
                        )}

                        {/* Trail dot */}
                        {isTrail && !isArkyHere && !isStart && !isTarget && !isObstacle && (
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/50" />
                        )}

                        {/* Arky Character Avatar with Direction Rotation */}
                        {isArkyHere && (
                          <div
                            className="relative z-10 flex flex-col items-center justify-center transition-all duration-300"
                            style={{
                              transform: `rotate(${getRotationDegrees(arkyDirection)}deg)`
                            }}
                          >
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-500 border-2 border-cyan-300 flex items-center justify-center text-lg sm:text-xl shadow-lg shadow-cyan-500/40 relative">
                              🤖
                              {/* Direction Indicator Notch */}
                              <div className="absolute -top-1 w-2 h-2 bg-amber-400 rotate-45 border border-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Hint Box */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
              <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300 block mb-0.5">
                  {lang === 'en' ? 'Algorithm Strategy Hint:' : 'Indiciu de Algoritm TIC:'}
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">{activeChallenge.hint}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Scratch-Style Block Palette & Script Workspace */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            {/* Script Header & Controls */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  {lang === 'en' ? 'Workspace Script' : 'Zona de Programare Scratch'}
                </span>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
                  {workspace.length} {lang === 'en' ? 'blocks' : 'blocuri'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearWorkspace}
                  disabled={isRunning || workspace.length === 0}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-900/40 border border-slate-700 text-slate-400 hover:text-rose-300 text-xs font-bold transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Clear' : 'Șterge'}</span>
                </button>
              </div>
            </div>

            {/* Script Assembly Container */}
            <div className="min-h-[220px] max-h-[300px] overflow-y-auto p-3 rounded-2xl bg-slate-950 border-2 border-slate-800 space-y-2 font-mono">
              {/* Permanent Scratch Green Flag / Start Event Block */}
              <div className="p-3 rounded-xl bg-amber-500 border-2 border-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-amber-500/20 select-none">
                <span className="text-base">🚩</span>
                <span>{lang === 'en' ? 'When green flag clicked (Start)' : 'Când se apasă pe START (Rulare)'}</span>
              </div>

              {/* Assembled Blocks List */}
              {workspace.length === 0 ? (
                <div className="py-8 text-center text-slate-500 space-y-2">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-sm">
                    🧩
                  </div>
                  <p className="text-xs">
                    {lang === 'en'
                      ? 'Click on the blocks below to assemble your algorithm!'
                      : 'Apasă pe blocurile de mai jos pentru a asambla algoritmul lui Arky!'}
                  </p>
                </div>
              ) : (
                workspace.map((block, idx) => {
                  const isExecuting = activeExecutingIdx === idx;

                  return (
                    <div
                      key={block.uid}
                      className={`p-2.5 sm:p-3 rounded-xl border-2 flex items-center justify-between gap-2 transition-all ${block.color} ${
                        isExecuting ? 'ring-4 ring-yellow-400 scale-[1.02] shadow-xl' : 'shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-[10px] font-mono opacity-80 bg-black/30 px-1.5 py-0.5 rounded">
                          #{idx + 1}
                        </span>
                        <span className="text-sm sm:text-base font-bold truncate">{block.label}</span>
                      </div>

                      {/* Reorder and Delete Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={isRunning || idx === 0}
                          onClick={() => handleMoveUp(idx)}
                          className="p-1 rounded bg-black/20 hover:bg-black/40 text-white disabled:opacity-20 cursor-pointer"
                          title="Mută mai sus"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={isRunning || idx === workspace.length - 1}
                          onClick={() => handleMoveDown(idx)}
                          className="p-1 rounded bg-black/20 hover:bg-black/40 text-white disabled:opacity-20 cursor-pointer"
                          title="Mută mai jos"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={isRunning}
                          onClick={() => handleRemoveBlock(block.uid)}
                          className="p-1 rounded bg-rose-950/60 hover:bg-rose-800 text-rose-200 cursor-pointer ml-1"
                          title="Șterge blocul"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Execution Status / Error Alert */}
            {executionMessage && (
              <div
                className={`p-3.5 rounded-xl border flex items-center gap-2 text-xs font-bold animate-fadeIn ${
                  executionMessage.type === 'success'
                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                    : executionMessage.type === 'error'
                    ? 'bg-rose-950/80 border-rose-400 text-rose-200'
                    : 'bg-indigo-950/80 border-indigo-400 text-indigo-200'
                }`}
              >
                {executionMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : executionMessage.type === 'error' ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                ) : (
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                )}
                <span>{executionMessage.text}</span>
              </div>
            )}

            {/* Run Button */}
            <div>
              <button
                type="button"
                disabled={isRunning || workspace.length === 0 || levelSuccess}
                onClick={handleRunCode}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-sm tracking-wider shadow-xl shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>
                  {isRunning
                    ? (lang === 'en' ? 'RUNNING SCRIPT...' : 'SE EXECUTĂ ALGORITMUL...')
                    : (lang === 'en' ? '🚀 RUN ALGORITHM (RULARE)' : '🚀 RULEAZĂ ALGORITMUL!')}
                </span>
              </button>
            </div>

            {/* Available Blocks Palette (Click to Add) */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {lang === 'en' ? 'Block Toolbox (Click to add to script):' : 'Paleta de Blocuri Scratch (Apasă pentru a adăuga în script):'}
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {activeChallenge.allowedBlocks.map((bType) => {
                  const cfg = getBlockConfig(bType);

                  return (
                    <button
                      key={bType}
                      type="button"
                      disabled={isRunning || levelSuccess}
                      onClick={() => handleAddBlock(bType)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-2 ${cfg.color} disabled:opacity-40`}
                    >
                      <span className="text-base shrink-0">{cfg.icon}</span>
                      <span className="truncate">{cfg.label}</span>
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
