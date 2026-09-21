import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { sounds } from '../../utils/audio';
import { updateActiveArcadeScore } from '../../lib/studentAuthService';
import {
  ArrowLeft,
  RotateCcw,
  Trophy,
  Sparkles,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Biohazard,
  Radar,
  HelpCircle,
  Clock,
  Flame,
  Info,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Play,
  Zap,
  Search,
  Check,
  X,
  Server,
  Terminal,
  Activity,
  Award
} from 'lucide-react';

interface VirusSweeperGameProps {
  onBack: () => void;
  studentName?: string;
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface DifficultyConfig {
  id: DifficultyLevel;
  nameRo: string;
  nameEn: string;
  subRo: string;
  rows: number;
  cols: number;
  viruses: number;
  badge: string;
  color: string;
  baseScore: number;
}

const DIFFICULTIES: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    id: 'easy',
    nameRo: 'Laborator Școală',
    nameEn: 'School Lab',
    subRo: '8x8 Noduri • 10 Viruși',
    rows: 8,
    cols: 8,
    viruses: 10,
    badge: 'Ușor',
    color: 'from-emerald-500 to-teal-600',
    baseScore: 1000,
  },
  medium: {
    id: 'medium',
    nameRo: 'Rețea Liceu',
    nameEn: 'Campus Network',
    subRo: '10x10 Noduri • 18 Viruși',
    rows: 10,
    cols: 10,
    viruses: 18,
    badge: 'Mediu',
    color: 'from-indigo-500 to-blue-600',
    baseScore: 2200,
  },
  hard: {
    id: 'hard',
    nameRo: 'Data Center Cloud',
    nameEn: 'Cloud Datacenter',
    subRo: '12x12 Noduri • 28 Viruși',
    rows: 12,
    cols: 12,
    viruses: 28,
    badge: 'Avansat',
    color: 'from-rose-500 to-purple-600',
    baseScore: 4000,
  },
};

export interface MalwareInfo {
  name: string;
  type: string;
  severity: 'Ridicată' | 'Critică' | 'Medie';
  description: string;
  prevention: string;
}

const MALWARE_INTEL: MalwareInfo[] = [
  {
    name: 'Trojan.Win32.Injector',
    type: 'Cal Troian (Trojan Horse)',
    severity: 'Critică',
    description: 'Se deghizează într-un joc gratuit sau utilitar util, dar deschide o „ușă din spate” (backdoor) pentru hackeri.',
    prevention: 'Nu descărca programe sau jocuri piratate de pe site-uri nesigure.',
  },
  {
    name: 'Ransomware.CryptoLocker',
    type: 'Ransomware (Criptare Date)',
    severity: 'Critică',
    description: 'Criptează toate pozele, referatele și fișierele de pe calculator și cere bani pentru deblocare.',
    prevention: 'Păstrează copii de rezervă (backup) pe un stick USB sau pe Google Drive.',
  },
  {
    name: 'Worm.NetSpreader.v6',
    type: 'Vierme Informatic (Network Worm)',
    severity: 'Ridicată',
    description: 'Se autoreplică și se transmite singur de la un PC la altul prin cablul de rețea sau prin Wi-Fi fără nicio acțiune a utilizatorului.',
    prevention: 'Activează Firewall-ul și instalează actualizările periodice de securitate Windows/Linux.',
  },
  {
    name: 'Spyware.KeyLogger.Pro',
    type: 'Spyware & Înregistrator Taste',
    severity: 'Ridicată',
    description: 'Înregistrează în mod secret toate tastele apăsate pe tastatură pentru a fura parolele și conversațiile.',
    prevention: 'Folosește autentificarea în doi pași (2FA) și o tastatură virtuală pentru date sensibile.',
  },
  {
    name: 'Adware.BrowserHijack',
    type: 'Adware Invaziv',
    severity: 'Medie',
    description: 'Schimbă motorul de căutare implicit și afișează reclame agresive de tip pop-up care încetinesc navigarea.',
    prevention: 'Fii atent la căsuțele pre-bifate atunci când instalezi aplicații noi.',
  },
  {
    name: 'Phishing.MailBot',
    type: 'Bot de Phishing',
    severity: 'Ridicată',
    description: 'Trimite emailuri ce par a veni de la bancă sau școală pentru a păcăli utilizatorii să își introducă parola.',
    prevention: 'Verifică întotdeauna adresa expeditorului și nu da click pe linkuri suspecte.',
  },
];

interface CellState {
  r: number;
  c: number;
  isVirus: boolean;
  isRevealed: boolean;
  isShielded: boolean; // Flagged with Antivirus Shield
  isQuestion: boolean; // Flagged with ?
  neighborViruses: number;
  isTriggered: boolean; // The mine that blew up
  isSonarHighlighted?: boolean;
}

export const VirusSweeperGame: React.FC<VirusSweeperGameProps> = ({ onBack, studentName }) => {
  const { lang } = useLanguage();
  const arky = useArky();
  const arkyRef = useRef(arky);
  arkyRef.current = arky;
  const langRef = useRef(lang);
  langRef.current = lang;

  // Configuration
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');
  const currentDiff = DIFFICULTIES[difficulty];

  // Game Engine State
  const [grid, setGrid] = useState<CellState[][]>([]);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  // Tools & Special Abilities
  const [mobileMode, setMobileMode] = useState<'inspect' | 'shield'>('inspect');
  const [sonarCharges, setSonarCharges] = useState<number>(1);
  const [firewallBuffer, setFirewallBuffer] = useState<number>(1); // Absorbs 1 blast!
  const [firewallAbsorbedCount, setFirewallAbsorbedCount] = useState<number>(0);

  // Modals & UI
  const [showIntelModal, setShowIntelModal] = useState<boolean>(false);
  const [selectedIntel, setSelectedIntel] = useState<MalwareInfo | null>(null);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [alertBanner, setAlertBanner] = useState<{ text: string; type: 'success' | 'warning' | 'info' | 'error' } | null>(null);

  // High Score
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_virus_sweeper') || '0');
    } catch {
      return 0;
    }
  });

  // Timer Ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Count remaining shields
  const shieldedCount = grid.reduce(
    (acc, row) => acc + row.filter((c) => c.isShielded).length,
    0
  );
  const remainingThreatsToMark = Math.max(0, currentDiff.viruses - shieldedCount);

  // Check neighbors helper (8 directions)
  const getNeighbors = (r: number, c: number, rows: number, cols: number): [number, number][] => {
    const neighbors: [number, number][] = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          neighbors.push([nr, nc]);
        }
      }
    }
    return neighbors;
  };

  // Initialize empty grid
  const initializeGrid = useCallback((diffConfig: DifficultyConfig): CellState[][] => {
    const newGrid: CellState[][] = [];
    for (let r = 0; r < diffConfig.rows; r++) {
      const row: CellState[] = [];
      for (let c = 0; c < diffConfig.cols; c++) {
        row.push({
          r,
          c,
          isVirus: false,
          isRevealed: false,
          isShielded: false,
          isQuestion: false,
          neighborViruses: 0,
          isTriggered: false,
        });
      }
      newGrid.push(row);
    }
    return newGrid;
  }, []);

  // Reset Game
  const resetGame = useCallback((diff: DifficultyLevel = difficulty) => {
    const config = DIFFICULTIES[diff];
    setDifficulty(diff);
    setGrid(initializeGrid(config));
    setHasStarted(false);
    setIsGameOver(false);
    setHasWon(false);
    setElapsedSeconds(0);
    setScore(0);
    setSonarCharges(1);
    setFirewallBuffer(1);
    setFirewallAbsorbedCount(0);
    setAlertBanner(null);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    arkyRef.current.triggerIdle(
      langRef.current === 'en'
        ? 'Cyber Sweeper ready! Scan safe computer nodes and place Antivirus Shields on infected workstations! 🛡️💻'
        : 'Căutătorul de Viruși este gata! Scanează nodurile sigure și plasează Scuturi Antivirus pe stațiile infectate! 🛡️💻'
    );
  }, [difficulty, initializeGrid]);

  // Initial load
  useEffect(() => {
    resetGame(difficulty);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []); // Run once on mount

  // Timer effect
  useEffect(() => {
    if (hasStarted && !isGameOver && !hasWon) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasStarted, isGameOver, hasWon]);

  // Populate viruses ensuring first click (and its neighbors) are 100% safe
  const populateVirusesAndCalculate = (
    currentGrid: CellState[][],
    startR: number,
    startC: number,
    config: DifficultyConfig
  ): CellState[][] => {
    const rows = config.rows;
    const cols = config.cols;
    const totalViruses = config.viruses;

    // Clone grid
    const newGrid = currentGrid.map((row) => row.map((cell) => ({ ...cell })));

    // Excluded coordinates (start cell + all immediate 8 neighbors)
    const forbidden = new Set<string>();
    forbidden.add(`${startR},${startC}`);
    const firstNeighbors = getNeighbors(startR, startC, rows, cols);
    firstNeighbors.forEach(([nr, nc]) => forbidden.add(`${nr},${nc}`));

    // Place viruses
    let placed = 0;
    while (placed < totalViruses) {
      const randR = Math.floor(Math.random() * rows);
      const randC = Math.floor(Math.random() * cols);
      const key = `${randR},${randC}`;

      if (!forbidden.has(key) && !newGrid[randR][randC].isVirus) {
        newGrid[randR][randC].isVirus = true;
        placed++;
      }
    }

    // Calculate neighboring virus counts for each cell
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (newGrid[r][c].isVirus) {
          newGrid[r][c].neighborViruses = -1;
          continue;
        }

        const neighbors = getNeighbors(r, c, rows, cols);
        const count = neighbors.filter(([nr, nc]) => newGrid[nr][nc].isVirus).length;
        newGrid[r][c].neighborViruses = count;
      }
    }

    return newGrid;
  };

  // Check victory condition
  const checkVictory = (currentGrid: CellState[][], config: DifficultyConfig): boolean => {
    const rows = config.rows;
    const cols = config.cols;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = currentGrid[r][c];
        // If there is any non-virus cell that is still unrevealed, game is not won yet
        if (!cell.isVirus && !cell.isRevealed) {
          return false;
        }
      }
    }
    return true;
  };

  // Flood reveal (Cascade empty 0 cells)
  const revealCellAndCascade = (
    currentGrid: CellState[][],
    startR: number,
    startC: number,
    config: DifficultyConfig
  ): CellState[][] => {
    const rows = config.rows;
    const cols = config.cols;
    const newGrid = currentGrid.map((row) => row.map((c) => ({ ...c })));

    const queue: [number, number][] = [[startR, startC]];
    const visited = new Set<string>();
    visited.add(`${startR},${startC}`);

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      const cell = newGrid[r][c];

      // Unshield if needed and reveal
      cell.isRevealed = true;
      cell.isShielded = false;
      cell.isQuestion = false;

      // If this cell has 0 neighboring viruses, expand to neighbors
      if (cell.neighborViruses === 0) {
        const neighbors = getNeighbors(r, c, rows, cols);
        for (const [nr, nc] of neighbors) {
          const key = `${nr},${nc}`;
          const neighborCell = newGrid[nr][nc];

          if (!visited.has(key) && !neighborCell.isRevealed && !neighborCell.isVirus) {
            visited.add(key);
            queue.push([nr, nc]);
          }
        }
      }
    }

    return newGrid;
  };

  // Handle clicking on an unrevealed Node (Left Click / Tap)
  const handleInspectCell = (r: number, c: number) => {
    if (isGameOver || hasWon) return;

    let activeGrid = grid;

    // Handle First Click
    if (!hasStarted) {
      setHasStarted(true);
      activeGrid = populateVirusesAndCalculate(grid, r, c, currentDiff);
    }

    const cell = activeGrid[r][c];
    if (cell.isRevealed || cell.isShielded) {
      return; // Can't click revealed or shielded cells directly
    }

    // Check if cell is a virus!
    if (cell.isVirus) {
      // Check if Firewall buffer can absorb the blast!
      if (firewallBuffer > 0) {
        sounds.playWrong();
        setFirewallBuffer(0);
        setFirewallAbsorbedCount((prev) => prev + 1);

        // Auto-shield the virus and alert student!
        const protectedGrid = activeGrid.map((row) => row.map((cellItem) => ({ ...cellItem })));
        protectedGrid[r][c].isShielded = true;
        protectedGrid[r][c].isTriggered = true;

        setGrid(protectedGrid);
        setAlertBanner({
          text: '🛡️ BUFFER FIREWALL ACTIVAT! Ai atins un virus Trojan, dar scutul de urgență a izolat automat amenințarea! Atenție la deducții!',
          type: 'warning',
        });

        arkyRef.current.triggerIdle(
          langRef.current === 'en'
            ? 'Warning! Firewall absorbed the viral blast! Calculate adjacent numbers carefully! ⚠️'
            : 'Atenție! Firewall-ul a absorbit infecția virală! Privește cifrele din jur pentru a deduce minele! ⚠️'
        );
        return;
      }

      // GAME OVER: Detonated a virus without firewall buffer!
      sounds.playWrong();
      setIsGameOver(true);

      // Reveal all viruses
      const revealedGrid = activeGrid.map((row) =>
        row.map((item) => ({
          ...item,
          isRevealed: item.isVirus ? true : item.isRevealed,
          isTriggered: item.r === r && item.c === c,
        }))
      );
      setGrid(revealedGrid);

      setAlertBanner({
        text: '💥 INFECȚIE VIRALĂ DETONATĂ! Ai lovit un nod compromis fără Scut Antivirus. Analizează indiciile și încearcă din nou!',
        type: 'error',
      });

      arkyRef.current.triggerFinished(
        langRef.current === 'en'
          ? 'Network compromised by malware! Deduce adjacent safe nodes next time! 💥🤖'
          : 'Rețeaua a fost infectată! Folosește logica matematică a cifrelor pentru a izola toți virușii! 💥🤖'
      );
      return;
    }

    // Safe cell clicked: Reveal & Cascade
    sounds.playCorrect();
    const updatedGrid = revealCellAndCascade(activeGrid, r, c, currentDiff);
    setGrid(updatedGrid);

    // Check if player won
    if (checkVictory(updatedGrid, currentDiff)) {
      handleVictory(updatedGrid);
    }
  };

  // Handle Right Click / Shield Placement (Toggle: Unshielded -> Shielded -> Question -> Unshielded)
  const handleToggleShield = (r: number, c: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (isGameOver || hasWon) return;

    sounds.playClick();

    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => row.map((cell) => ({ ...cell })));
      const cell = newGrid[r][c];

      if (cell.isRevealed) return prevGrid;

      if (!cell.isShielded && !cell.isQuestion) {
        // Apply Shield
        cell.isShielded = true;
        cell.isQuestion = false;
      } else if (cell.isShielded) {
        // Switch to Question Probe
        cell.isShielded = false;
        cell.isQuestion = true;
      } else {
        // Clear
        cell.isShielded = false;
        cell.isQuestion = false;
      }

      return newGrid;
    });
  };

  // Chording: Clicking on a revealed number that already has all adjacent flags placed
  const handleChordClick = (r: number, c: number) => {
    if (isGameOver || hasWon) return;

    const cell = grid[r][c];
    if (!cell.isRevealed || cell.neighborViruses <= 0) return;

    const neighbors = getNeighbors(r, c, currentDiff.rows, currentDiff.cols);
    const adjacentShields = neighbors.filter(([nr, nc]) => grid[nr][nc].isShielded).length;

    // If flags count equals the number, inspect all unshielded unrevealed neighbors
    if (adjacentShields === cell.neighborViruses) {
      sounds.playClick();
      let hadBlast = false;
      let nextGrid = grid.map((row) => row.map((cellItem) => ({ ...cellItem })));

      for (const [nr, nc] of neighbors) {
        const neighborCell = nextGrid[nr][nc];
        if (!neighborCell.isRevealed && !neighborCell.isShielded) {
          if (neighborCell.isVirus) {
            hadBlast = true;
            neighborCell.isTriggered = true;
          } else {
            nextGrid = revealCellAndCascade(nextGrid, nr, nc, currentDiff);
          }
        }
      }

      if (hadBlast) {
        sounds.playWrong();
        setIsGameOver(true);
        // Reveal all
        const finalGrid = nextGrid.map((row) =>
          row.map((item) => ({
            ...item,
            isRevealed: item.isVirus ? true : item.isRevealed,
          }))
        );
        setGrid(finalGrid);
        setAlertBanner({
          text: '💥 Atenție la Scuturi! Unul dintre scuturile plasate adiacent a fost greșit poziționat!',
          type: 'error',
        });
      } else {
        setGrid(nextGrid);
        if (checkVictory(nextGrid, currentDiff)) {
          handleVictory(nextGrid);
        }
      }
    }
  };

  // Sonar Scan Power-up: Reveal a random safe node or isolate 1 virus
  const useSonarScan = () => {
    if (sonarCharges <= 0 || isGameOver || hasWon) return;

    let activeGrid = grid;
    if (!hasStarted) {
      // Pick center as start
      const startR = Math.floor(currentDiff.rows / 2);
      const startC = Math.floor(currentDiff.cols / 2);
      setHasStarted(true);
      activeGrid = populateVirusesAndCalculate(grid, startR, startC, currentDiff);
    }

    sounds.playLevelUp();
    setSonarCharges((prev) => prev - 1);

    // Find all unrevealed safe cells
    const unrevealedSafeCells: [number, number][] = [];
    for (let r = 0; r < currentDiff.rows; r++) {
      for (let c = 0; c < currentDiff.cols; c++) {
        if (!activeGrid[r][c].isRevealed && !activeGrid[r][c].isVirus && !activeGrid[r][c].isShielded) {
          unrevealedSafeCells.push([r, c]);
        }
      }
    }

    if (unrevealedSafeCells.length > 0) {
      // Pick random safe cell and cascade it
      const [pickR, pickC] = unrevealedSafeCells[Math.floor(Math.random() * unrevealedSafeCells.length)];
      const updatedGrid = revealCellAndCascade(activeGrid, pickR, pickC, currentDiff);
      setGrid(updatedGrid);

      setAlertBanner({
        text: `📡 SONAR ACTIVAT: Nodul de rețea (${pickR + 1}, ${pickC + 1}) a fost scanat cu succes și s-a dovedit 100% sigur!`,
        type: 'info',
      });

      if (checkVictory(updatedGrid, currentDiff)) {
        handleVictory(updatedGrid);
      }
    } else {
      setAlertBanner({
        text: '📡 Sonarul a confirmat că toate nodurile sigure rămase sunt deja scanate!',
        type: 'info',
      });
    }
  };

  // Handle Victory Logic
  const handleVictory = (finalGrid: CellState[][]) => {
    sounds.playLevelUp();
    setHasWon(true);
    setIsGameOver(false);

    // Auto-flag all viruses properly
    const victoryGrid = finalGrid.map((row) =>
      row.map((c) => ({
        ...c,
        isShielded: c.isVirus ? true : c.isShielded,
      }))
    );
    setGrid(victoryGrid);

    // Score calculation
    // Base score + Time bonus + Difficulty Multiplier - Penalty for Firewall absorb
    const timeBonus = Math.max(0, 400 - elapsedSeconds * 2);
    const difficultyMultiplier = difficulty === 'hard' ? 2.5 : difficulty === 'medium' ? 1.6 : 1.0;
    const finalScore = Math.round((currentDiff.baseScore + timeBonus) * difficultyMultiplier);

    setScore(finalScore);

    // High score check
    if (finalScore > highScore) {
      setHighScore(finalScore);
      try {
        localStorage.setItem('arkedo_highscore_virus_sweeper', String(finalScore));
      } catch {
        // Fallback
      }
    }

    updateActiveArcadeScore('virus_sweeper', finalScore);

    arkyRef.current.triggerFinished(
      langRef.current === 'en'
        ? `VICTORY! Subnet secured! All ${currentDiff.viruses} malware strains neutralized in ${elapsedSeconds}s! Score: ${finalScore} pts! 🏆🛡️`
        : `VICTORIE! Rețeaua este securizată! Toți cei ${currentDiff.viruses} viruși au fost izolați în ${elapsedSeconds}s! Punctaj: ${finalScore} XP! 🏆🛡️`
    );

    setAlertBanner({
      text: `🎉 VICTORIE TOTALĂ! Ai dezinfectat întreaga rețea "${currentDiff.nameRo}" cu scorul de ${finalScore} XP!`,
      type: 'success',
    });
  };

  // Color mapping for numbers (1 to 8)
  const getNumberColorClass = (count: number): string => {
    switch (count) {
      case 1:
        return 'text-sky-400 font-bold';
      case 2:
        return 'text-emerald-400 font-bold';
      case 3:
        return 'text-amber-400 font-bold';
      case 4:
        return 'text-indigo-400 font-bold';
      case 5:
        return 'text-rose-400 font-extrabold';
      case 6:
        return 'text-teal-300 font-extrabold';
      case 7:
        return 'text-fuchsia-400 font-extrabold';
      case 8:
        return 'text-white font-black';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto pb-12 animate-fadeIn select-none">
      {/* Top Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 backdrop-blur shadow-xl">
        <div className="flex items-center gap-3">
          <button
            id="virus-sweeper-btn-back"
            type="button"
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-sky-400" />
            <span>{lang === 'en' ? 'Back to Arcade' : 'Înapoi la Jocuri'}</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Cyber-Safe Minesweeper
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                {lang === 'en' ? 'Network Virus Sweeper' : 'Căutătorul de Viruși & Malware'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-heading mt-0.5 flex items-center gap-2">
              <span>Cyber-Safe (Căutătorul de Viruși)</span>
              <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
            </h1>
          </div>
        </div>

        {/* Action Controls & High Score */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="virus-sweeper-btn-intel"
            type="button"
            onClick={() => {
              sounds.playClick();
              setShowIntelModal(true);
            }}
            className="px-3 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Biohazard className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">Enciclopedie Viruși</span>
          </button>

          <button
            id="virus-sweeper-btn-guide"
            type="button"
            onClick={() => {
              sounds.playClick();
              setShowGuideModal(true);
            }}
            className="px-3 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Reguli & Ghid</span>
          </button>

          <button
            id="virus-sweeper-btn-restart"
            type="button"
            onClick={() => {
              sounds.playClick();
              resetGame(difficulty);
            }}
            className="px-3 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>

          {/* High Score */}
          <div className="px-3 py-1.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs">
            <Trophy className="w-4 h-4 text-amber-400" />
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-slate-400 font-mono leading-none">Record</span>
              <span className="font-mono font-black text-amber-300">{highScore} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Selector Tabs */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {(Object.keys(DIFFICULTIES) as DifficultyLevel[]).map((diffKey) => {
          const diff = DIFFICULTIES[diffKey];
          const isSelected = difficulty === diffKey;

          return (
            <button
              key={`diff-tab-${diffKey}`}
              id={`virus-diff-${diffKey}`}
              type="button"
              onClick={() => {
                sounds.playClick();
                resetGame(diffKey);
              }}
              className={`p-3 rounded-2xl border-2 transition-all text-left flex flex-col justify-between cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-slate-900 border-sky-400 shadow-lg shadow-sky-500/20 ring-2 ring-sky-400/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {diff.badge}
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-sky-400" />}
              </div>

              <div className="font-bold text-white text-xs sm:text-sm font-heading">{diff.nameRo}</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">{diff.subRo}</div>
            </button>
          );
        })}
      </div>

      {/* Cyber Defense Status & Gamification Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Remaining Threat Shields to place */}
        <div className="bg-slate-900/80 border border-rose-500/20 rounded-2xl p-3 text-center">
          <div className="text-[11px] font-mono text-rose-300 uppercase tracking-wider flex items-center justify-center gap-1">
            <Biohazard className="w-3.5 h-3.5 text-rose-400" />
            <span>Viruși de Izolat</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-rose-300 mt-0.5">
            {remainingThreatsToMark} <span className="text-xs text-slate-400 font-normal">/ {currentDiff.viruses}</span>
          </div>
        </div>

        {/* Timer */}
        <div className="bg-slate-900/80 border border-sky-500/20 rounded-2xl p-3 text-center">
          <div className="text-[11px] font-mono text-sky-300 uppercase tracking-wider flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>Timp Misiune</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white mt-0.5">
            {elapsedSeconds}s
          </div>
        </div>

        {/* Firewall Buffer Shield (1 blast absorption) */}
        <div className="bg-slate-900/80 border border-indigo-500/20 rounded-2xl p-3 text-center flex flex-col justify-center items-center">
          <div className="text-[11px] font-mono text-indigo-300 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Buffer Firewall</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                firewallBuffer > 0
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {firewallBuffer > 0 ? 'ACTIV (1x Scut)' : 'CONSUMAT'}
            </span>
          </div>
        </div>

        {/* Sonar Network Scan Power-Up Button */}
        <div className="bg-slate-900/80 border border-teal-500/20 rounded-2xl p-2.5 flex flex-col justify-between items-center text-center">
          <div className="text-[10px] font-mono text-teal-300 uppercase">Sonar Rețea</div>
          <button
            id="virus-sweeper-btn-sonar"
            type="button"
            disabled={sonarCharges <= 0 || isGameOver || hasWon}
            onClick={useSonarScan}
            className={`w-full py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 ${
              sonarCharges > 0 && !isGameOver && !hasWon
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-md shadow-teal-600/30 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Radar className="w-4 h-4 text-teal-200" />
            <span>Scan ({sonarCharges})</span>
          </button>
        </div>
      </div>

      {/* Alert Banner / Feedback */}
      {alertBanner && (
        <div
          className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs font-bold animate-fadeIn ${
            alertBanner.type === 'error'
              ? 'bg-rose-950/80 border-rose-500/50 text-rose-200'
              : alertBanner.type === 'warning'
              ? 'bg-amber-950/80 border-amber-500/50 text-amber-200'
              : alertBanner.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
              : 'bg-sky-950/80 border-sky-500/50 text-sky-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {alertBanner.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
            {alertBanner.type === 'warning' && <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />}
            {alertBanner.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {alertBanner.type === 'info' && <Radar className="w-4 h-4 text-sky-400 shrink-0" />}
            <span>{alertBanner.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setAlertBanner(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Mobile & Touch Mode Switcher (Scan vs Flag) */}
      <div className="sm:hidden flex items-center justify-center gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-2">
        <span className="text-[11px] text-slate-400 font-mono mr-1">Mod Atingere:</span>
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setMobileMode('inspect');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
            mobileMode === 'inspect'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Scanează Nod</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setMobileMode('shield');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
            mobileMode === 'shield'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Plasează Scut 🛡️</span>
        </button>
      </div>

      {/* Main Interactive Network Grid Stage */}
      <div className="relative bg-slate-950/95 border-2 border-indigo-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur overflow-x-auto flex flex-col items-center">
        {/* Network Subnet Canvas Frame */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${currentDiff.cols}, minmax(0, 1fr))`,
            gap: currentDiff.cols > 10 ? '4px' : '6px',
            maxWidth: currentDiff.cols > 10 ? '580px' : '480px',
            width: '100%',
          }}
          className="p-3 bg-slate-900/90 rounded-2xl border-2 border-slate-800 shadow-inner"
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isRevealed = cell.isRevealed;
              const isShielded = cell.isShielded;
              const isQuestion = cell.isQuestion;
              const isVirus = cell.isVirus;
              const isTriggered = cell.isTriggered;
              const neighborCount = cell.neighborViruses;

              return (
                <button
                  key={`cell-${r}-${c}`}
                  id={`virus-cell-${r}-${c}`}
                  type="button"
                  onContextMenu={(e) => handleToggleShield(r, c, e)}
                  onClick={() => {
                    if (mobileMode === 'shield') {
                      handleToggleShield(r, c);
                    } else {
                      if (isRevealed) {
                        handleChordClick(r, c);
                      } else {
                        handleInspectCell(r, c);
                      }
                    }
                  }}
                  className={`relative aspect-square rounded-xl flex items-center justify-center font-mono font-bold text-sm sm:text-base transition-all select-none cursor-pointer active:scale-90 ${
                    isRevealed
                      ? isVirus
                        ? isTriggered
                          ? 'bg-rose-600 text-white border-2 border-rose-400 animate-bounce shadow-lg shadow-rose-600/50'
                          : 'bg-rose-950/70 border border-rose-500/40 text-rose-300'
                        : 'bg-slate-950/80 border border-slate-800/80 shadow-inner'
                      : isShielded
                      ? 'bg-gradient-to-b from-rose-950 to-slate-900 border-2 border-rose-500/80 text-rose-300 shadow-md shadow-rose-500/20'
                      : isQuestion
                      ? 'bg-indigo-950/70 border border-indigo-500/50 text-indigo-300'
                      : 'bg-gradient-to-b from-slate-800 to-slate-900 border-t border-l border-slate-700 border-b-2 border-r-2 border-slate-950 hover:bg-slate-750 hover:border-sky-500/60 shadow-md'
                  }`}
                >
                  {/* Inside Cell Content */}
                  {isRevealed ? (
                    isVirus ? (
                      <Biohazard className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 animate-pulse" />
                    ) : neighborCount > 0 ? (
                      <span className={getNumberColorClass(neighborCount)}>{neighborCount}</span>
                    ) : null
                  ) : isShielded ? (
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 fill-rose-500/30" />
                  ) : isQuestion ? (
                    <span className="text-xs font-bold text-indigo-300">?</span>
                  ) : (
                    <Server className="w-3 h-3 text-slate-600 opacity-40" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Desktop Helper Tips */}
        <div className="hidden sm:flex items-center justify-between text-xs text-slate-400 w-full max-w-lg mt-4 px-2">
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">
              Click Stânga
            </kbd>
            <span>Scanează Nod</span>
          </span>

          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">
              Click Dreapta
            </kbd>
            <span>Plasează Scut 🛡️</span>
          </span>

          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">
              Dublu Click
            </kbd>
            <span>Scanare Rapidă (Chord)</span>
          </span>
        </div>
      </div>

      {/* Malware Threat Intel Cards (Interactive Education) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm sm:text-base font-bold text-white font-heading">
              Ghid de Securitate Cibernetică: Tipuri de Amenințări TIC
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Apasă pe un virus pentru detalii</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {MALWARE_INTEL.map((intel) => (
            <button
              key={intel.name}
              type="button"
              onClick={() => {
                sounds.playClick();
                setSelectedIntel(intel);
              }}
              className="p-3 rounded-2xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-sky-500/50 text-left transition flex flex-col justify-between gap-1.5 group cursor-pointer active:scale-95"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-rose-400 px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                  {intel.severity}
                </span>
                <Info className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition-colors" />
              </div>

              <div className="font-bold text-xs text-white group-hover:text-sky-300 transition-colors truncate">
                {intel.type}
              </div>

              <div className="text-[10px] text-slate-400 font-mono truncate">{intel.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal: Specific Malware Intel Details */}
      {selectedIntel && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-rose-500/50 rounded-3xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <Biohazard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-heading">{selectedIntel.type}</h3>
                  <span className="text-xs text-rose-400 font-mono">{selectedIntel.name}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIntel(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 mt-4 text-xs text-slate-300">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <strong className="text-white block mb-1">Cum funcționează atacul:</strong>
                <p className="leading-relaxed text-slate-300">{selectedIntel.description}</p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200">
                <strong className="text-emerald-300 block mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Măsuri de protecție & prevenție:
                </strong>
                <p className="leading-relaxed">{selectedIntel.prevention}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedIntel(null)}
              className="mt-5 w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
            >
              Închide Raportul
            </button>
          </div>
        </div>
      )}

      {/* Modal: Full Rules & Deduction Guide */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-3xl p-6 max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-sky-400" />
                <h3 className="text-lg font-black text-white font-heading">
                  Cum se joacă Cyber-Safe Minesweeper?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-sky-400 text-sm block mb-1">
                  1. Semnificația Cifrelor de pe Ecran
                </span>
                <p>
                  Când dai click pe un PC sigur, cifra afișată (ex: <strong>1, 2 sau 3</strong>) îți spune exact câți viruși se ascund în cele <strong>8 calculatoare direct învecinate</strong> (sus, jos, stânga, dreapta și diagonale).
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-rose-400 text-sm block mb-1">
                  2. Plasarea Scutului Antivirus (Stegulețul)
                </span>
                <p>
                  Când ești sigur că un pătrățel conține un virus, dă <strong>Click Dreapta</strong> (sau selectează modul <em>Plasează Scut</em> pe mobil) pentru a izola computerul cu un Scut Antivirus 🛡️.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-emerald-400 text-sm block mb-1">
                  3. Buffer-ul de Urgență Firewall (1 Viață Bonus)
                </span>
                <p>
                  Dacă greșești o dată și apeși din greșeală pe un virus, <strong>Firewall-ul de rezervă</strong> absoarbe explozia și izolează automat amenințarea, permițându-ți să continui partida!
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-teal-400 text-sm block mb-1">
                  4. Sonarul de Rețea (Ping de Siguranță)
                </span>
                <p>
                  Când ești blocat într-o dilemă 50-50%, folosește butonul <strong>Sonar Rețea</strong> pentru a scana de la distanță un nod 100% sigur!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="mt-6 w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30"
            >
              Am înțeles, la luptă cibernetică!
            </button>
          </div>
        </div>
      )}

      {/* Modal: Full Virus Encyclopedia */}
      {showIntelModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-rose-500/50 rounded-3xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Biohazard className="w-6 h-6 text-rose-400" />
                <h3 className="text-lg font-black text-white font-heading">
                  Enciclopedia Amenințărilor & Malware-ului TIC
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIntelModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {MALWARE_INTEL.map((item) => (
                <div key={item.name} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-sm">{item.type}</span>
                    <span className="text-[10px] font-mono text-rose-400 px-1.5 py-0.5 rounded bg-rose-500/10">
                      {item.severity}
                    </span>
                  </div>
                  <div className="text-slate-400 font-mono text-[10px] mb-2">{item.name}</div>
                  <p className="text-slate-300 leading-relaxed mb-2">{item.description}</p>
                  <div className="pt-2 border-t border-slate-800/80 text-emerald-300 text-[11px]">
                    <strong>Protecție:</strong> {item.prevention}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowIntelModal(false)}
              className="mt-6 w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
            >
              Închide Enciclopedia
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
