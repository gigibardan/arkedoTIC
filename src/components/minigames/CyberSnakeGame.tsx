import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  RotateCcw,
  Trophy,
  Zap,
  Shield,
  ArrowLeft,
  Volume2,
  VolumeX,
  Sparkles,
  Award,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pause,
  PlayCircle,
  Flame,
  Bug,
  Code2,
  Cpu,
  Layers,
  Terminal,
  RefreshCw,
  Target
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { updateStudentArcadeScore } from '../../lib/studentAuthService';

export interface CyberSnakeGameProps {
  studentName?: string;
  studentAvatar?: string;
  onBack: () => void;
  onAwardXP?: (amount: number, reason: string) => void;
  onSaveScore?: (score: number) => void;
}

// Grid dimensions
const GRID_SIZE = 20;
const CELL_COUNT = GRID_SIZE * GRID_SIZE;

// Directions
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface Position {
  x: number;
  y: number;
}

// Scratch Code Block Categories & Types
export type BlockCategory = 'motion' | 'control' | 'operator' | 'sensing';

export interface CodeBlock {
  id: string;
  label: string;
  codeSnippet: string;
  category: BlockCategory;
  color: string;
  borderColor: string;
  bgGlow: string;
  xp: number;
  effectType: 'move' | 'dodge_wall' | 'repeat' | 'shield' | 'freeze_bugs' | 'turbo_xp';
  descriptionRo: string;
}

const CODE_BLOCK_TEMPLATES: CodeBlock[] = [
  {
    id: 'step_10',
    label: 'Mergi 10 pași',
    codeSnippet: 'move(10);',
    category: 'motion',
    color: '#3b82f6', // blue-500
    borderColor: '#60a5fa',
    bgGlow: 'rgba(59, 130, 246, 0.4)',
    xp: 50,
    effectType: 'move',
    descriptionRo: 'Avansează procesarea și alungește șarpele cibernetic (+50 XP).'
  },
  {
    id: 'turn_90',
    label: 'Rotește 90°',
    codeSnippet: 'turnRight(90);',
    category: 'motion',
    color: '#2563eb',
    borderColor: '#93c5fd',
    bgGlow: 'rgba(37, 99, 235, 0.4)',
    xp: 60,
    effectType: 'move',
    descriptionRo: 'Manevră algoritmică de mare agilitate (+60 XP).'
  },
  {
    id: 'if_wall_dodge',
    label: 'Dacă perete Ocolește',
    codeSnippet: 'if (isWall()) dodge();',
    category: 'control',
    color: '#f97316', // orange-500
    borderColor: '#fdba74',
    bgGlow: 'rgba(249, 115, 22, 0.4)',
    xp: 100,
    effectType: 'dodge_wall',
    descriptionRo: '⚡ Scut Autonom: te salvează automat de la 1 impact fatal cu zidul!'
  },
  {
    id: 'repeat_4x',
    label: 'Repetă de 4 ori',
    codeSnippet: 'repeat(4) { ... }',
    category: 'control',
    color: '#ea580c',
    borderColor: '#fb923c',
    bgGlow: 'rgba(234, 88, 12, 0.4)',
    xp: 120,
    effectType: 'repeat',
    descriptionRo: '🔥 Buclă: multiplică XP-ul cu 4x pentru următoarele acțiuni!'
  },
  {
    id: 'shield_true',
    label: 'Scut = Adevărat',
    codeSnippet: 'shield = true;',
    category: 'operator',
    color: '#10b981', // emerald-500
    borderColor: '#6ee7b7',
    bgGlow: 'rgba(16, 185, 129, 0.4)',
    xp: 90,
    effectType: 'shield',
    descriptionRo: '🛡️ Scut Antivirus: devorează virușii roșii fără să fii avariat!'
  },
  {
    id: 'freeze_sensor',
    label: 'Detectează Virus',
    codeSnippet: 'if (touchBug()) freeze();',
    category: 'sensing',
    color: '#06b6d4', // cyan-500
    borderColor: '#67e8f9',
    bgGlow: 'rgba(6, 182, 212, 0.4)',
    xp: 80,
    effectType: 'freeze_bugs',
    descriptionRo: '❄️ Senzor: îngheață toți virușii timp de 5 secunde!'
  },
  {
    id: 'turbo_xp',
    label: 'Overclock Algo',
    codeSnippet: 'boostClock(2.0);',
    category: 'operator',
    color: '#a855f7', // purple-500
    borderColor: '#d8b4fe',
    bgGlow: 'rgba(168, 85, 247, 0.4)',
    xp: 150,
    effectType: 'turbo_xp',
    descriptionRo: '⚡ Overclocking: +150 XP instant și viteză supersonic!'
  }
];

// Active items on board
interface BoardItem {
  position: Position;
  block: CodeBlock;
  spawnTime: number;
}

// Patrolling Red Viruses
interface VirusBug {
  id: number;
  position: Position;
  direction: Direction;
  axis: 'horizontal' | 'vertical' | 'patrol_box';
  color: string;
  name: string;
}

// Particle effect for blasts & pickups
interface VisualParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
}

// Floating Toast Feedback
interface ScorePopup {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
}

// Missions / Challenges
interface AlgoMission {
  id: number;
  title: string;
  goalDescription: string;
  targetCount: number;
  type: 'collect_motion' | 'compile_algo' | 'destroy_bugs' | 'reach_score' | 'use_wall_dodge';
  rewardXP: number;
}

const MISSIONS: AlgoMission[] = [
  {
    id: 1,
    title: 'Misiunea 1: Inițializare Scratch',
    goalDescription: 'Colectează 5 blocuri de Mișcare (Mergi 10 pași sau Rotește)',
    targetCount: 5,
    type: 'collect_motion',
    rewardXP: 250
  },
  {
    id: 2,
    title: 'Misiunea 2: Compilare Algoritmică',
    goalDescription: 'Compilează 2 algoritmi compleți prin secvențe de 3 blocuri',
    targetCount: 2,
    type: 'compile_algo',
    rewardXP: 400
  },
  {
    id: 3,
    title: 'Misiunea 3: Vânătorul de Malware',
    goalDescription: 'Folosește Scutul Antivirus pentru a elimina 3 viruși roșii',
    targetCount: 3,
    type: 'destroy_bugs',
    rewardXP: 500
  },
  {
    id: 4,
    title: 'Misiunea 4: Salvat de Condițională',
    goalDescription: 'Folosește blocul „Dacă perete Ocolește” pentru a evita impactul',
    targetCount: 1,
    type: 'use_wall_dodge',
    rewardXP: 300
  },
  {
    id: 5,
    title: 'Misiunea 5: Hackathon Grand Master',
    goalDescription: 'Acumulează 2500 XP într-o singură sesiune cibernetică',
    targetCount: 2500,
    type: 'reach_score',
    rewardXP: 1000
  }
];

export const CyberSnakeGame: React.FC<CyberSnakeGameProps> = ({
  studentName = 'Programator TIC',
  studentAvatar = '🐍',
  onBack,
  onAwardXP,
  onSaveScore
}) => {
  // Game states
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'paused' | 'gameover'>('lobby');
  const [gameMode, setGameMode] = useState<'arcade' | 'missions' | 'speedrun'>('arcade');
  const [activeMissionIdx, setActiveMissionIdx] = useState(0);
  const [missionProgress, setMissionProgress] = useState(0);

  // Snake State
  const [snake, setSnake] = useState<Position[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 }
  ]);
  const [direction, setDirection] = useState<Direction>('UP');
  const nextDirectionRef = useRef<Direction>('UP');

  // Items & Board
  const [boardItems, setBoardItems] = useState<BoardItem[]>([]);
  const [viruses, setViruses] = useState<VirusBug[]>([]);
  const [particles, setParticles] = useState<VisualParticle[]>([]);
  const [popups, setPopups] = useState<ScorePopup[]>([]);

  // Algorithm Code Stack (Queue of collected blocks)
  const [algoStack, setAlgoStack] = useState<CodeBlock[]>([]);
  const [compilationFlash, setCompilationFlash] = useState<string | null>(null);

  // Powerups & Active Shields
  const [shieldActive, setShieldActive] = useState(false);
  const [shieldTimeLeft, setShieldTimeLeft] = useState(0);
  const [wallDodgeCharges, setWallDodgeCharges] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [multiplierCharges, setMultiplierCharges] = useState(0);
  const [bugsFrozen, setBugsFrozen] = useState(false);

  // Score & Stats
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_cyber_snake') || '0');
    } catch {
      return 0;
    }
  });
  const [blocksCollected, setBlocksCollected] = useState(0);
  const [algorithmsCompiled, setAlgorithmsCompiled] = useState(0);
  const [bugsDestroyed, setBugsDestroyed] = useState(0);
  const [speedrunTimer, setSpeedrunTimer] = useState(60);

  // Snake Skin
  const [selectedSkin, setSelectedSkin] = useState<'matrix' | 'cyan' | 'fire'>('matrix');

  // Sound settings
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tickRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef<number>(0);

  // Speed configuration (ms per grid step)
  const [baseSpeedMs, setBaseSpeedMs] = useState(130);

  // Initialize Board Items & Viruses
  const spawnBlock = useCallback((currentSnake: Position[], existingItems: BoardItem[]): BoardItem | null => {
    const occupied = new Set<string>();
    currentSnake.forEach(p => occupied.add(`${p.x},${p.y}`));
    existingItems.forEach(i => occupied.add(`${i.position.x},${i.position.y}`));

    const available: Position[] = [];
    for (let x = 1; x < GRID_SIZE - 1; x++) {
      for (let y = 1; y < GRID_SIZE - 1; y++) {
        if (!occupied.has(`${x},${y}`)) {
          available.push({ x, y });
        }
      }
    }

    if (available.length === 0) return null;

    const randomPos = available[Math.floor(Math.random() * available.length)];
    const randomBlock = CODE_BLOCK_TEMPLATES[Math.floor(Math.random() * CODE_BLOCK_TEMPLATES.length)];

    return {
      position: randomPos,
      block: randomBlock,
      spawnTime: Date.now()
    };
  }, []);

  const spawnInitialViruses = useCallback(() => {
    const initialViruses: VirusBug[] = [
      {
        id: 1,
        position: { x: 3, y: 3 },
        direction: 'RIGHT',
        axis: 'horizontal',
        color: '#ef4444',
        name: 'Worm.exe'
      },
      {
        id: 2,
        position: { x: 16, y: 16 },
        direction: 'LEFT',
        axis: 'horizontal',
        color: '#dc2626',
        name: 'Trojan.dll'
      },
      {
        id: 3,
        position: { x: 15, y: 4 },
        direction: 'DOWN',
        axis: 'vertical',
        color: '#f43f5e',
        name: 'GlitchBug'
      }
    ];
    return initialViruses;
  }, []);

  // Play custom synthesized sound
  const playSoundEffect = useCallback((type: 'pickup' | 'compile' | 'shield' | 'bug_destroy' | 'dodge' | 'gameover' | 'freeze') => {
    if (!soundEnabled) return;
    try {
      if (type === 'pickup') {
        sounds.playSuccess();
      } else if (type === 'compile') {
        sounds.playClick();
        setTimeout(() => sounds.playSuccess(), 100);
      } else if (type === 'shield') {
        sounds.playClick();
      } else if (type === 'bug_destroy') {
        sounds.playClick();
      } else if (type === 'dodge') {
        sounds.playClick();
      } else if (type === 'gameover') {
        sounds.playWrong();
      } else if (type === 'freeze') {
        sounds.playClick();
      }
    } catch {
      // Audio context fallback
    }
  }, [soundEnabled]);

  // Create popup text
  const addPopup = useCallback((text: string, x: number, y: number, color: string = '#10b981') => {
    const newPopup: ScorePopup = {
      id: Date.now() + Math.random(),
      text,
      x,
      y,
      color
    };
    setPopups(prev => [...prev.slice(-6), newPopup]);
    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== newPopup.id));
    }, 1200);
  }, []);

  // Add particles
  const addParticles = useCallback((gx: number, gy: number, color: string, count = 12) => {
    const newP: VisualParticle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const speed = Math.random() * 2.5 + 1;
      newP.push({
        x: gx,
        y: gy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 2,
        color,
        alpha: 1,
        life: 1
      });
    }
    setParticles(prev => [...prev.slice(-40), ...newP]);
  }, []);

  // Start / Restart Game
  const startGame = useCallback((mode: 'arcade' | 'missions' | 'speedrun' = gameMode) => {
    setGameMode(mode);
    setSnake([
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 }
    ]);
    setDirection('UP');
    nextDirectionRef.current = 'UP';
    setScore(0);
    setBlocksCollected(0);
    setAlgorithmsCompiled(0);
    setBugsDestroyed(0);
    setAlgoStack([]);
    setCompilationFlash(null);
    setShieldActive(false);
    setShieldTimeLeft(0);
    setWallDodgeCharges(0);
    setMultiplier(1);
    setMultiplierCharges(0);
    setBugsFrozen(false);
    setSpeedrunTimer(60);
    setMissionProgress(0);

    const initialSnake = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
    const b1 = spawnBlock(initialSnake, []);
    const b2 = b1 ? spawnBlock(initialSnake, [b1]) : null;
    const b3 = (b1 && b2) ? spawnBlock(initialSnake, [b1, b2]) : null;
    setBoardItems([b1, b2, b3].filter(Boolean) as BoardItem[]);

    setViruses(spawnInitialViruses());
    setGameState('playing');
    lastTickTimeRef.current = performance.now();
  }, [gameMode, spawnBlock, spawnInitialViruses]);

  // Handle Game Over
  const handleGameOver = useCallback((reason: string) => {
    setGameState('gameover');
    playSoundEffect('gameover');

    setScore(currentScore => {
      // High score check
      const prevBest = Number(localStorage.getItem('arkedo_highscore_cyber_snake') || '0');
      if (currentScore > prevBest) {
        localStorage.setItem('arkedo_highscore_cyber_snake', currentScore.toString());
        setHighScore(currentScore);
      }
      // Save to student profile
      updateStudentArcadeScore('cyber_snake', currentScore);
      onSaveScore?.(currentScore);

      if (currentScore > 0) {
        const xpEarned = Math.round(currentScore / 2);
        onAwardXP?.(xpEarned, `Cyber Snake: ${currentScore} puncte (${reason})`);
      }
      return currentScore;
    });
  }, [onAwardXP, onSaveScore, playSoundEffect]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (gameState !== 'playing') {
        if (e.key === ' ' || e.key === 'Enter') {
          if (gameState === 'lobby' || gameState === 'gameover') {
            startGame();
          } else if (gameState === 'paused') {
            setGameState('playing');
          }
        }
        return;
      }

      const cur = nextDirectionRef.current;
      if ((e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') && cur !== 'DOWN') {
        nextDirectionRef.current = 'UP';
      } else if ((e.key === 'ArrowDown' || e.key.toLowerCase() === 's') && cur !== 'UP') {
        nextDirectionRef.current = 'DOWN';
      } else if ((e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') && cur !== 'RIGHT') {
        nextDirectionRef.current = 'LEFT';
      } else if ((e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') && cur !== 'LEFT') {
        nextDirectionRef.current = 'RIGHT';
      } else if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, startGame]);

  // Shield & Freeze timers
  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => {
      // Shield timer
      setShieldTimeLeft(prev => {
        if (prev <= 1) {
          setShieldActive(false);
          return 0;
        }
        return prev - 1;
      });

      // Speedrun timer
      if (gameMode === 'speedrun') {
        setSpeedrunTimer(prev => {
          if (prev <= 1) {
            handleGameOver('Timpul a expirat!');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, gameMode, handleGameOver]);

  // Algorithm Stack Compilation Logic
  const checkAlgorithmCompilation = useCallback((currentStack: CodeBlock[]) => {
    if (currentStack.length < 3) return;

    // Check if we have 3 complementary categories (e.g. motion + control + operator)
    const categories = new Set(currentStack.map(b => b.category));
    const isSpecialCombo = categories.size >= 2;

    if (isSpecialCombo) {
      // COMPILE!
      const bonusXP = 400 * (multiplier > 1 ? multiplier : 1);
      setScore(s => s + bonusXP);
      setAlgorithmsCompiled(c => c + 1);
      setCompilationFlash('⚡ ALGORITM COMPILAT! +400 XP & SCUT MAXIM!');
      playSoundEffect('compile');

      // Mission progress check
      if (gameMode === 'missions' && MISSIONS[activeMissionIdx].type === 'compile_algo') {
        setMissionProgress(p => p + 1);
      }

      // Activate Mega Shield
      setShieldActive(true);
      setShieldTimeLeft(prev => Math.max(prev, 12));

      // Clear all active viruses in a flash!
      setViruses(prev => prev.map(v => ({
        ...v,
        position: { x: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2, y: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2 }
      })));

      // Clear stack
      setAlgoStack([]);

      setTimeout(() => {
        setCompilationFlash(null);
      }, 2500);
    }
  }, [multiplier, playSoundEffect, gameMode, activeMissionIdx]);

  // Move Patrolling Viruses
  const updateViruses = useCallback(() => {
    if (bugsFrozen) return;

    setViruses(prevViruses => {
      return prevViruses.map(virus => {
        let newX = virus.position.x;
        let newY = virus.position.y;
        let newDir = virus.direction;

        if (virus.axis === 'horizontal') {
          if (virus.direction === 'RIGHT') {
            if (newX >= GRID_SIZE - 2) {
              newDir = 'LEFT';
              newX -= 1;
            } else {
              newX += 1;
            }
          } else {
            if (newX <= 1) {
              newDir = 'RIGHT';
              newX += 1;
            } else {
              newX -= 1;
            }
          }
        } else if (virus.axis === 'vertical') {
          if (virus.direction === 'DOWN') {
            if (newY >= GRID_SIZE - 2) {
              newDir = 'UP';
              newY -= 1;
            } else {
              newY += 1;
            }
          } else {
            if (newY <= 1) {
              newDir = 'DOWN';
              newY += 1;
            } else {
              newY -= 1;
            }
          }
        } else {
          // Patrol box
          const steps: Record<Direction, Position> = {
            UP: { x: 0, y: -1 },
            DOWN: { x: 0, y: 1 },
            LEFT: { x: -1, y: 0 },
            RIGHT: { x: 1, y: 0 }
          };
          const delta = steps[virus.direction];
          const testX = newX + delta.x;
          const testY = newY + delta.y;

          if (testX <= 1 || testX >= GRID_SIZE - 2 || testY <= 1 || testY >= GRID_SIZE - 2) {
            const rotMap: Record<Direction, Direction> = {
              UP: 'RIGHT',
              RIGHT: 'DOWN',
              DOWN: 'LEFT',
              LEFT: 'UP'
            };
            newDir = rotMap[virus.direction];
          } else {
            newX = testX;
            newY = testY;
          }
        }

        return {
          ...virus,
          position: { x: newX, y: newY },
          direction: newDir
        };
      });
    });
  }, [bugsFrozen]);

  // Main Game Loop (Step)
  const gameStep = useCallback(() => {
    if (gameState !== 'playing') return;

    const currentDirection = nextDirectionRef.current;
    setDirection(currentDirection);

    setSnake(prevSnake => {
      const head = prevSnake[0];
      let nextHead: Position = { ...head };

      if (currentDirection === 'UP') nextHead.y -= 1;
      else if (currentDirection === 'DOWN') nextHead.y += 1;
      else if (currentDirection === 'LEFT') nextHead.x -= 1;
      else if (currentDirection === 'RIGHT') nextHead.x += 1;

      // 1. Check Wall Collision
      const hitWall =
        nextHead.x < 0 ||
        nextHead.x >= GRID_SIZE ||
        nextHead.y < 0 ||
        nextHead.y >= GRID_SIZE;

      if (hitWall) {
        // If player collected "Dacă perete Ocolește", save them!
        if (wallDodgeCharges > 0) {
          setWallDodgeCharges(c => c - 1);
          playSoundEffect('dodge');
          addPopup('🛡️ REFLEX AUTONOM: PERETE OCOLIT!', head.x, head.y, '#f97316');

          if (gameMode === 'missions' && MISSIONS[activeMissionIdx].type === 'use_wall_dodge') {
            setMissionProgress(p => p + 1);
          }

          // Teleport / Wrap safely
          const safeX = (nextHead.x + GRID_SIZE) % GRID_SIZE;
          const safeY = (nextHead.y + GRID_SIZE) % GRID_SIZE;
          nextHead = { x: safeX, y: safeY };
        } else {
          handleGameOver('Șarpele s-a izbit de firewall-ul matricei!');
          return prevSnake;
        }
      }

      // 2. Check Self Collision
      const hitSelf = prevSnake.slice(1).some(segment => segment.x === nextHead.x && segment.y === nextHead.y);
      if (hitSelf) {
        handleGameOver('Șarpele s-a blocat într-o buclă infinită recursivă!');
        return prevSnake;
      }

      // 3. Check Virus Collision
      const hitVirus = viruses.find(v => v.position.x === nextHead.x && v.position.y === nextHead.y);
      if (hitVirus) {
        if (shieldActive) {
          // DESTROY / DEBUG VIRUS
          playSoundEffect('bug_destroy');
          addParticles(nextHead.x, nextHead.y, '#10b981', 15);
          addPopup(`💥 VIRUS ${hitVirus.name} DEZINFECTAT! +200 XP`, nextHead.x, nextHead.y, '#10b981');

          setScore(s => s + 200 * multiplier);
          setBugsDestroyed(b => b + 1);

          if (gameMode === 'missions' && MISSIONS[activeMissionIdx].type === 'destroy_bugs') {
            setMissionProgress(p => p + 1);
          }

          // Respawn virus far away
          setViruses(curr => curr.map(v => v.id === hitVirus.id ? {
            ...v,
            position: { x: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2, y: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2 }
          } : v));
        } else {
          // Unshielded impact
          handleGameOver(`Infectat cu ${hitVirus.name}! Activează un Scut de Cod.`);
          return prevSnake;
        }
      }

      // 4. Check Block Pickup
      const eatenItemIndex = boardItems.findIndex(
        item => item.position.x === nextHead.x && item.position.y === nextHead.y
      );

      let newSnake: Position[];

      if (eatenItemIndex !== -1) {
        const eatenItem = boardItems[eatenItemIndex];
        playSoundEffect('pickup');
        addParticles(nextHead.x, nextHead.y, eatenItem.block.color, 12);

        // Apply XP with multiplier
        const xpGained = eatenItem.block.xp * multiplier;
        setScore(s => s + xpGained);
        setBlocksCollected(b => b + 1);
        addPopup(`+${xpGained} XP • ${eatenItem.block.label}`, nextHead.x, nextHead.y, eatenItem.block.color);

        // Handle mission tracking
        if (gameMode === 'missions') {
          const currentMission = MISSIONS[activeMissionIdx];
          if (currentMission.type === 'collect_motion' && eatenItem.block.category === 'motion') {
            setMissionProgress(p => p + 1);
          } else if (currentMission.type === 'reach_score') {
            setMissionProgress(score + xpGained);
          }
        }

        // Apply Block Mechanics
        if (eatenItem.block.effectType === 'dodge_wall') {
          setWallDodgeCharges(c => c + 1);
        } else if (eatenItem.block.effectType === 'repeat') {
          setMultiplier(4);
          setMultiplierCharges(4);
        } else if (eatenItem.block.effectType === 'shield') {
          setShieldActive(true);
          setShieldTimeLeft(prev => Math.max(prev, 10));
        } else if (eatenItem.block.effectType === 'freeze_bugs') {
          setBugsFrozen(true);
          setTimeout(() => setBugsFrozen(false), 5000);
          addPopup('❄️ VIRUȘI ÎNGHEȚAȚI 5 SECUNDE!', nextHead.x, nextHead.y, '#06b6d4');
        }

        // Decrement multiplier charges if active
        if (multiplierCharges > 0) {
          setMultiplierCharges(c => {
            if (c <= 1) {
              setMultiplier(1);
              return 0;
            }
            return c - 1;
          });
        }

        // Add to Algorithm Queue & Check Compilation
        setAlgoStack(prevStack => {
          const updated = [...prevStack, eatenItem.block].slice(-4);
          setTimeout(() => checkAlgorithmCompilation(updated), 50);
          return updated;
        });

        // Grow snake
        newSnake = [nextHead, ...prevSnake];

        // Replace eaten item
        const remainingItems = boardItems.filter((_, idx) => idx !== eatenItemIndex);
        const newItem = spawnBlock(newSnake, remainingItems);
        setBoardItems(newItem ? [...remainingItems, newItem] : remainingItems);
      } else {
        // Normal move without growth
        newSnake = [nextHead, ...prevSnake.slice(0, -1)];
      }

      return newSnake;
    });

    // Move viruses occasionally
    updateViruses();
  }, [
    gameState,
    viruses,
    shieldActive,
    multiplier,
    multiplierCharges,
    wallDodgeCharges,
    boardItems,
    gameMode,
    activeMissionIdx,
    score,
    playSoundEffect,
    addParticles,
    addPopup,
    spawnBlock,
    handleGameOver,
    updateViruses,
    checkAlgorithmCompilation
  ]);

  // Mission completion watcher
  useEffect(() => {
    if (gameMode !== 'missions' || gameState !== 'playing') return;
    const curMission = MISSIONS[activeMissionIdx];
    if (missionProgress >= curMission.targetCount) {
      playSoundEffect('compile');
      addPopup(`🏆 MISIUNE FINALIZATĂ: +${curMission.rewardXP} XP!`, 10, 10, '#eab308');
      setScore(s => s + curMission.rewardXP);
      onAwardXP?.(curMission.rewardXP, `Misiune Cyber Snake: ${curMission.title}`);

      if (activeMissionIdx < MISSIONS.length - 1) {
        setActiveMissionIdx(i => i + 1);
        setMissionProgress(0);
      } else {
        setCompilationFlash('🎉 TOATE MISIUNILE FINALIZATE! GRAND MASTER!');
      }
    }
  }, [missionProgress, activeMissionIdx, gameMode, gameState, onAwardXP, playSoundEffect, addPopup]);

  // Main tick loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      gameStep();
    }, baseSpeedMs);

    return () => clearInterval(interval);
  }, [gameState, gameStep, baseSpeedMs]);

  // Dynamic particle animation tick
  useEffect(() => {
    const anim = requestAnimationFrame(() => {
      if (particles.length > 0) {
        setParticles(prev =>
          prev
            .map(p => ({
              ...p,
              x: p.x + p.vx * 0.1,
              y: p.y + p.vy * 0.1,
              alpha: p.alpha - 0.05,
              life: p.life - 0.05
            }))
            .filter(p => p.alpha > 0)
        );
      }
    });
    return () => cancelAnimationFrame(anim);
  }, [particles]);

  // Render on 2D Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cellSize = width / GRID_SIZE;

    // Clear background
    ctx.fillStyle = '#020617'; // slate-950
    ctx.fillRect(0, 0, width, height);

    // Grid lines (subtle cyber motherboard trace)
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(width, i * cellSize);
      ctx.stroke();
    }

    // Outer border glow
    if (shieldActive) {
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, width - 4, height - 4);
    } else if (wallDodgeCharges > 0) {
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.7)';
      ctx.lineWidth = 3;
      ctx.strokeRect(2, 2, width - 4, height - 4);
    }

    // Draw Board Code Blocks
    boardItems.forEach(item => {
      const bx = item.position.x * cellSize;
      const by = item.position.y * cellSize;

      // Glow behind block
      ctx.save();
      ctx.fillStyle = item.block.bgGlow;
      ctx.beginPath();
      ctx.arc(bx + cellSize / 2, by + cellSize / 2, cellSize * 0.8, 0, Math.PI * 2);
      ctx.fill();

      // Block puzzle shape
      ctx.fillStyle = item.block.color;
      ctx.strokeStyle = item.block.borderColor;
      ctx.lineWidth = 2;

      const pad = 3;
      const r = 6;
      ctx.beginPath();
      ctx.roundRect(bx + pad, by + pad, cellSize - pad * 2, cellSize - pad * 2, r);
      ctx.fill();
      ctx.stroke();

      // Small notch on left (Scratch puzzle style)
      ctx.fillStyle = item.block.borderColor;
      ctx.beginPath();
      ctx.arc(bx + cellSize / 2, by + pad + 2, 3, 0, Math.PI);
      ctx.fill();

      // Category icon / text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const shortLabel = item.block.label.length > 8 ? item.block.label.slice(0, 7) + '..' : item.block.label;
      ctx.fillText(shortLabel, bx + cellSize / 2, by + cellSize / 2);
      ctx.restore();
    });

    // Draw Patrolling Viruses
    viruses.forEach(virus => {
      const vx = virus.position.x * cellSize;
      const vy = virus.position.y * cellSize;

      ctx.save();
      // Sinister red glow
      ctx.fillStyle = bugsFrozen ? 'rgba(6, 182, 212, 0.3)' : 'rgba(239, 68, 68, 0.35)';
      ctx.beginPath();
      ctx.arc(vx + cellSize / 2, vy + cellSize / 2, cellSize * 0.7, 0, Math.PI * 2);
      ctx.fill();

      // Virus body
      ctx.fillStyle = bugsFrozen ? '#06b6d4' : virus.color;
      ctx.strokeStyle = bugsFrozen ? '#a5f3fc' : '#fecaca';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.arc(vx + cellSize / 2, vy + cellSize / 2, cellSize * 0.38, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Spikes
      for (let a = 0; a < 6; a++) {
        const rad = (Math.PI / 3) * a;
        const sx = vx + cellSize / 2 + Math.cos(rad) * (cellSize * 0.46);
        const sy = vy + cellSize / 2 + Math.sin(rad) * (cellSize * 0.46);
        ctx.beginPath();
        ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = bugsFrozen ? '#67e8f9' : '#f87171';
        ctx.fill();
      }

      // Virus eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(vx + cellSize * 0.38, vy + cellSize * 0.45, 2, 0, Math.PI * 2);
      ctx.arc(vx + cellSize * 0.62, vy + cellSize * 0.45, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    // Draw Snake Body
    snake.forEach((segment, index) => {
      const sx = segment.x * cellSize;
      const sy = segment.y * cellSize;
      const isHead = index === 0;

      ctx.save();
      if (isHead) {
        // Snake Head
        const headColor = selectedSkin === 'matrix' ? '#10b981' : selectedSkin === 'cyan' ? '#06b6d4' : '#f97316';
        const headGlow = selectedSkin === 'matrix' ? 'rgba(16, 185, 129, 0.6)' : selectedSkin === 'cyan' ? 'rgba(6, 182, 212, 0.6)' : 'rgba(249, 115, 22, 0.6)';

        // Head aura
        ctx.fillStyle = headGlow;
        ctx.beginPath();
        ctx.arc(sx + cellSize / 2, sy + cellSize / 2, cellSize * 0.7, 0, Math.PI * 2);
        ctx.fill();

        // Head main rect
        ctx.fillStyle = headColor;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(sx + 2, sy + 2, cellSize - 4, cellSize - 4, 7);
        ctx.fill();
        ctx.stroke();

        // Shield ring if protected
        if (shieldActive) {
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(sx + cellSize / 2, sy + cellSize / 2, cellSize * 0.65, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Eyes based on direction
        ctx.fillStyle = '#ffffff';
        let e1 = { x: sx + 6, y: sy + 6 };
        let e2 = { x: sx + cellSize - 6, y: sy + 6 };

        if (direction === 'DOWN') {
          e1 = { x: sx + 6, y: sy + cellSize - 6 };
          e2 = { x: sx + cellSize - 6, y: sy + cellSize - 6 };
        } else if (direction === 'LEFT') {
          e1 = { x: sx + 6, y: sy + 6 };
          e2 = { x: sx + 6, y: sy + cellSize - 6 };
        } else if (direction === 'RIGHT') {
          e1 = { x: sx + cellSize - 6, y: sy + 6 };
          e2 = { x: sx + cellSize - 6, y: sy + cellSize - 6 };
        }

        ctx.beginPath();
        ctx.arc(e1.x, e1.y, 2.5, 0, Math.PI * 2);
        ctx.arc(e2.x, e2.y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(e1.x, e1.y, 1.2, 0, Math.PI * 2);
        ctx.arc(e2.x, e2.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Body segment (Code chip)
        const alpha = Math.max(0.35, 1 - index / (snake.length + 5));
        const bodyColor = selectedSkin === 'matrix' ? `rgba(16, 185, 129, ${alpha})` : selectedSkin === 'cyan' ? `rgba(6, 182, 212, ${alpha})` : `rgba(249, 115, 22, ${alpha})`;

        ctx.fillStyle = bodyColor;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(sx + 3, sy + 3, cellSize - 6, cellSize - 6, 5);
        ctx.fill();
        ctx.stroke();

        // Inner binary dot
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(sx + cellSize / 2, sy + cellSize / 2, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    // Draw Particles
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x * cellSize + cellSize / 2, p.y * cellSize + cellSize / 2, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }, [snake, direction, boardItems, viruses, particles, shieldActive, wallDodgeCharges, selectedSkin, bugsFrozen]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 animate-fadeIn pb-8 select-none">
      {/* Top Header / Bar */}
      <div className="bg-slate-900/90 border-2 border-emerald-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onBack();
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition font-bold text-sm shadow-md"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>Arcade TIC</span>
            </button>

            <div className="flex items-center gap-2.5">
              <span className="text-3xl p-1.5 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl">🐍</span>
              <div>
                <h1 className="text-lg sm:text-xl font-black text-white tracking-wide flex items-center gap-2">
                  Cyber Snake: <span className="text-emerald-400">Șarpele Algoritmic</span>
                </h1>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Gândire Algoritmică</span>
                  <span aria-hidden="true">·</span>
                  <span>Blocuri Scratch</span>
                  <span aria-hidden="true">·</span>
                  <span>Antivirus 100%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/70 border border-amber-500/40 rounded-xl text-amber-300 font-mono text-sm font-bold shadow-inner">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Record: {highScore}</span>
            </div>

            <button
              type="button"
              onClick={() => setSoundEnabled(s => !s)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
              title={soundEnabled ? 'Sunet activat' : 'Sunet oprit'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </div>

        {/* Mode Selector & Quick Stats Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                startGame('arcade');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                gameMode === 'arcade'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Arcade Infinit</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                startGame('missions');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                gameMode === 'missions'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Misiuni Scratch</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                startGame('speedrun');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                gameMode === 'speedrun'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Overclock 60s</span>
            </button>
          </div>

          {/* Active Buff Badges */}
          <div className="flex items-center gap-2">
            {shieldActive && (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-300 font-bold animate-pulse">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>SCUT ACTIV ({shieldTimeLeft}s)</span>
              </div>
            )}
            {wallDodgeCharges > 0 && (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-orange-500/20 border border-orange-500/50 rounded-lg text-orange-300 font-bold">
                <Zap className="w-3.5 h-3.5 text-orange-400" />
                <span>OCOLEȘTE ZID x{wallDodgeCharges}</span>
              </div>
            )}
            {multiplier > 1 && (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-purple-500/20 border border-purple-500/50 rounded-lg text-purple-300 font-bold animate-bounce">
                <Flame className="w-3.5 h-3.5 text-purple-400" />
                <span>REPETĂ {multiplier}x!</span>
              </div>
            )}
            {bugsFrozen && (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-lg text-cyan-300 font-bold">
                <span>❄️ VIRUȘI ÎNGHEȚAȚI</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Play Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        {/* Left Column: Mission / Program Queue */}
        <div className="space-y-4 lg:col-span-1">
          {/* Mission Box if in Missions Mode */}
          {gameMode === 'missions' && (
            <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">
                <span>Obiectiv Misiune</span>
                <span>{activeMissionIdx + 1}/{MISSIONS.length}</span>
              </div>
              <h3 className="text-sm font-black text-white">{MISSIONS[activeMissionIdx].title}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {MISSIONS[activeMissionIdx].goalDescription}
              </p>
              <div className="mt-3">
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Progres</span>
                  <span className="font-mono text-cyan-300 font-bold">
                    {Math.min(missionProgress, MISSIONS[activeMissionIdx].targetCount)} / {MISSIONS[activeMissionIdx].targetCount}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-cyan-500 transition-all duration-300 rounded-full"
                    style={{ width: `${Math.min(100, (missionProgress / MISSIONS[activeMissionIdx].targetCount) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Algorithmic Execution Stack (Scratch Blocks assembled) */}
          <div className="bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-indigo-400 tracking-wider flex items-center gap-1.5 uppercase">
                <Code2 className="w-4 h-4" />
                <span>Program Executat</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {algoStack.length}/3 blocuri
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3 leading-tight">
              Colectează blocuri diferite pentru a compila algoritmul și a declanșa <strong>Mega Scutul</strong>!
            </p>

            <div className="space-y-1.5 min-h-[140px] flex flex-col justify-center">
              {algoStack.length === 0 ? (
                <div className="p-3 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
                  Mănâncă blocuri de cod pe matrice pentru a asambla scriptul!
                </div>
              ) : (
                algoStack.map((b, idx) => (
                  <div
                    key={`${b.id}-${idx}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center justify-between border shadow-sm transition transform hover:scale-[1.02]"
                    style={{ backgroundColor: b.color, borderColor: b.borderColor }}
                  >
                    <span>{b.label}</span>
                    <span className="text-[10px] opacity-75 font-mono">{b.codeSnippet}</span>
                  </div>
                ))
              )}
            </div>

            {/* Compilation Flash Banner */}
            {compilationFlash && (
              <div className="mt-2 p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-black text-center animate-pulse shadow-lg">
                {compilationFlash}
              </div>
            )}
          </div>

          {/* Legend: Blocuri & Viruși */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2 text-xs">
            <h4 className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ghid Blocuri TIC</span>
            </h4>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2 text-blue-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                <span><strong>Mișcare:</strong> Alungește șarpele & XP</span>
              </div>
              <div className="flex items-center gap-2 text-orange-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
                <span><strong>Dacă perete:</strong> Ocolește impactul</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                <span><strong>Scut = true:</strong> Zdrobiți virușii roșii!</span>
              </div>
              <div className="flex items-center gap-2 text-rose-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span><strong>Virus Roșu:</strong> Evită fără Scut!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Canvas Screen & Live Stats */}
        <div className="lg:col-span-2 flex flex-col items-center">
          {/* Live Top Stats */}
          <div className="w-full flex items-center justify-between px-3 py-2 bg-slate-950/80 rounded-2xl border border-slate-800 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Scor:</span>
              <span className="text-xl font-black text-emerald-400 font-mono">{score}</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1 text-slate-300">
                <Code2 className="w-3.5 h-3.5 text-blue-400" />
                <span>{blocksCollected} blocuri</span>
              </div>
              <div className="flex items-center gap-1 text-slate-300">
                <Bug className="w-3.5 h-3.5 text-rose-400" />
                <span>{bugsDestroyed} dezinfectați</span>
              </div>
              {gameMode === 'speedrun' && (
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{speedrunTimer}s</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                if (gameState === 'playing') setGameState('paused');
                else if (gameState === 'paused') setGameState('playing');
              }}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold border border-slate-700"
            >
              {gameState === 'playing' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          </div>

          {/* Canvas Viewport Container */}
          <div className="relative w-full aspect-square max-w-[460px] bg-slate-950 rounded-3xl p-1.5 border-2 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)] overflow-hidden">
            <canvas
              ref={canvasRef}
              width={460}
              height={460}
              className="w-full h-full rounded-2xl block bg-slate-950"
            />

            {/* Floating Popups */}
            {popups.map(popup => (
              <div
                key={popup.id}
                className="absolute pointer-events-none text-xs font-black drop-shadow-md animate-bounce"
                style={{
                  left: `${(popup.x / GRID_SIZE) * 100}%`,
                  top: `${(popup.y / GRID_SIZE) * 100}%`,
                  color: popup.color,
                  transform: 'translate(-50%, -100%)'
                }}
              >
                {popup.text}
              </div>
            ))}

            {/* Overlay: Lobby or GameOver */}
            {gameState !== 'playing' && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center z-20">
                {gameState === 'lobby' ? (
                  <div className="space-y-4 max-w-sm">
                    <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center text-4xl shadow-lg shadow-emerald-500/20 animate-pulse">
                      🐍
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white">Cyber Snake</h2>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Șarpele Algoritmic colectează instrucțiuni Scratch, obține scuturi și elimină virușii roșii ce patrulează pe matrice!
                      </p>
                    </div>

                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedSkin('matrix')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                          selectedSkin === 'matrix' ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        🟩 Matrix
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedSkin('cyan')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                          selectedSkin === 'cyan' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        🟦 Quantum
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedSkin('fire')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                          selectedSkin === 'fire' ? 'bg-orange-500/20 border-orange-400 text-orange-300' : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        🟧 Titan
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => startGame()}
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-emerald-500/30 transition transform hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      <Play className="w-5 h-5 fill-slate-950" />
                      <span>START ALGORITM (SPACE / ENTER)</span>
                    </button>
                  </div>
                ) : gameState === 'paused' ? (
                  <div className="space-y-4">
                    <h3 className="text-xl font-black text-white">Joc Întrerupt</h3>
                    <p className="text-xs text-slate-400">Apasă tasta P sau butonul de mai jos pentru a relua.</p>
                    <button
                      type="button"
                      onClick={() => setGameState('playing')}
                      className="py-2.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md"
                    >
                      Reia Execuția
                    </button>
                  </div>
                ) : (
                  /* Game Over Screen */
                  <div className="space-y-4 max-w-sm">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-3xl">
                      💥
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white">Execuție Oprită!</h2>
                      <p className="text-xs text-slate-300 mt-1">
                        Ai adunat <span className="text-emerald-400 font-bold">{score} XP</span> în această sesiune!
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/90 p-3 rounded-2xl border border-slate-800 font-mono">
                      <div className="text-slate-400">Blocuri: <span className="text-white font-bold">{blocksCollected}</span></div>
                      <div className="text-slate-400">Algoritmi: <span className="text-white font-bold">{algorithmsCompiled}</span></div>
                      <div className="text-slate-400">Viruși eliminați: <span className="text-white font-bold">{bugsDestroyed}</span></div>
                      <div className="text-slate-400">Record: <span className="text-amber-400 font-bold">{highScore}</span></div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startGame()}
                        className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-lg"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>REÎNCEARCĂ</span>
                      </button>
                      <button
                        type="button"
                        onClick={onBack}
                        className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition"
                      >
                        Înapoi la Hub
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Tactile D-Pad Controls */}
          <div className="mt-4 flex flex-col items-center gap-1.5 sm:hidden">
            <button
              type="button"
              onClick={() => {
                if (direction !== 'DOWN') nextDirectionRef.current = 'UP';
              }}
              className="w-14 h-12 bg-slate-800 active:bg-emerald-600 rounded-xl border border-slate-700 flex items-center justify-center text-white shadow-lg"
            >
              <ChevronUp className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (direction !== 'RIGHT') nextDirectionRef.current = 'LEFT';
                }}
                className="w-14 h-12 bg-slate-800 active:bg-emerald-600 rounded-xl border border-slate-700 flex items-center justify-center text-white shadow-lg"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (direction !== 'UP') nextDirectionRef.current = 'DOWN';
                }}
                className="w-14 h-12 bg-slate-800 active:bg-emerald-600 rounded-xl border border-slate-700 flex items-center justify-center text-white shadow-lg"
              >
                <ChevronDown className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (direction !== 'LEFT') nextDirectionRef.current = 'RIGHT';
                }}
                className="w-14 h-12 bg-slate-800 active:bg-emerald-600 rounded-xl border border-slate-700 flex items-center justify-center text-white shadow-lg"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Key Mechanics & Cyber Bot Details */}
        <div className="space-y-4 lg:col-span-1">
          {/* Controls instructions */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl text-xs space-y-3">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Taste de Control</span>
            </h4>
            <div className="space-y-2 text-[11px] text-slate-300">
              <div className="flex items-center justify-between">
                <span>Mișcare</span>
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-bold">
                  SĂGEȚI / WASD
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Pauză</span>
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">P / ESC</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Start / Reia</span>
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">SPACE / ENTER</span>
              </div>
            </div>
          </div>

          {/* Student Profile Card in Mini-game */}
          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 shadow-xl text-xs">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-1 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                {studentAvatar}
              </span>
              <div>
                <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Pilot Algo</div>
                <div className="font-black text-white text-sm truncate max-w-[150px]">{studentName}</div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Algoritmi Compilați:</span>
                <span className="font-bold text-white">{algorithmsCompiled}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Viruși Curățați:</span>
                <span className="font-bold text-emerald-400">{bugsDestroyed}</span>
              </div>
            </div>
          </div>

          {/* Scratch Concept Tip */}
          <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900/80 border border-indigo-500/30 rounded-2xl p-4 text-xs space-y-1.5">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Sfat Algoritmic TIC</span>
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              În Scratch, blocurile de <strong>Control</strong> (`Dacă... Atunci` și `Repetă`) lucrează cel mai bine alături de blocuri de <strong>Mișcare</strong>. Adună-le pe ambele pentru a genera scuturi impenetrabile!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
