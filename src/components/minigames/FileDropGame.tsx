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
  Heart,
  ShieldAlert,
  HelpCircle,
  FileText,
  Image,
  Film,
  Archive,
  Biohazard,
  Zap,
  Flame,
  ArrowDown,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  Play,
  Pause,
  Clock,
  Info,
  Layers,
  CheckCircle2,
  XCircle,
  Check
} from 'lucide-react';

interface FileDropGameProps {
  onBack: () => void;
  studentName?: string;
}

export type FileCategory = 'docs' | 'images' | 'media' | 'archives' | 'quarantine';

export interface FileItem {
  id: string;
  name: string;
  extension: string;
  category: FileCategory;
  description: string;
  programs: string;
  isThreat?: boolean;
  isSpecial?: 'slow' | 'heal' | 'clean';
}

export interface FolderLane {
  category: FileCategory;
  title: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  bgColor: string;
  tagColor: string;
  allowedExtensions: string[];
}

// Full library of educational files
const FILE_CATALOG: Omit<FileItem, 'id'>[] = [
  // 1. DOCUMENTE (DOCS)
  {
    name: 'referat_istorie',
    extension: '.docx',
    category: 'docs',
    description: 'Document text editabil Microsoft Word cu imagini și tabele formatate.',
    programs: 'MS Word, LibreOffice Writer, Google Docs',
  },
  {
    name: 'manual_tic_clasa_5',
    extension: '.pdf',
    category: 'docs',
    description: 'Portable Document Format — document fix, identic pe orice ecran sau la tipar.',
    programs: 'Adobe Acrobat, Edge, Chrome',
  },
  {
    name: 'catalog_note',
    extension: '.xlsx',
    category: 'docs',
    description: 'Foaie de calcul tabelar cu formule matematice, medii și grafice automate.',
    programs: 'MS Excel, LibreOffice Calc, Google Sheets',
  },
  {
    name: 'prezentare_roboti',
    extension: '.pptx',
    category: 'docs',
    description: 'Prezentare multimedia pe diapozitive (slide-uri) cu animații.',
    programs: 'MS PowerPoint, Google Slides, Keynote',
  },
  {
    name: 'notițe_rapide',
    extension: '.txt',
    category: 'docs',
    description: 'Text simplu fără formatare (fără fonturi sau culori), dimensiune infimă.',
    programs: 'Notepad, TextEdit, VS Code',
  },
  {
    name: 'export_date_elevi',
    extension: '.csv',
    category: 'docs',
    description: 'Comma Separated Values — date tabelare separate prin virgule sau punct și virgulă.',
    programs: 'Excel, Notepad, Baze de date',
  },

  // 2. IMAGINI (IMAGES)
  {
    name: 'avatar_arky',
    extension: '.png',
    category: 'images',
    description: 'Imagine grafică bitmap cu suport pentru transparență (fără fundal).',
    programs: 'Photoshop, Paint, Browser Web',
  },
  {
    name: 'peisaj_munte',
    extension: '.jpg',
    category: 'images',
    description: 'Fotografie digitală comprimată, optimă pentru camere foto și telefoane.',
    programs: 'Vizualizator Fotografii, GIMP, Lightroom',
  },
  {
    name: 'logo_arkedo_vectorial',
    extension: '.svg',
    category: 'images',
    description: 'Grafică vectorială scalabilă la infinit fără să își piardă din claritate.',
    programs: 'Illustrator, Inkscape, Browser',
  },
  {
    name: 'animatie_pisica',
    extension: '.gif',
    category: 'images',
    description: 'Succesiune de cadre animate într-un singur fișier grafic de mici dimensiuni.',
    programs: 'Browser, WhatsApp, Mesagerii',
  },
  {
    name: 'poster_eveniment',
    extension: '.webp',
    category: 'images',
    description: 'Format modern de imagine Google pentru web, comprimat eficient.',
    programs: 'Chrome, Firefox, Editoare moderne',
  },

  // 3. AUDIO-VIDEO (MEDIA)
  {
    name: 'hit_vara_2026',
    extension: '.mp3',
    category: 'media',
    description: 'Format audio standard comprimat pentru melodii și podcasturi.',
    programs: 'Spotify, VLC, Windows Media Player',
  },
  {
    name: 'inregistrare_microfon',
    extension: '.wav',
    category: 'media',
    description: 'Sunet de înaltă fidelitate necomprimat, utilizat în studiouri muzicale.',
    programs: 'Audacity, Sound Recorder, DAW',
  },
  {
    name: 'curs_video_programare',
    extension: '.mp4',
    category: 'media',
    description: 'Clip video de înaltă rezoluție comprimat universal pentru toate ecranele.',
    programs: 'YouTube, VLC, QuickTime',
  },
  {
    name: 'film_documentar_4k',
    extension: '.mkv',
    category: 'media',
    description: 'Container multimedia avansat pentru subtitrări multiple și canale audio.',
    programs: 'VLC Media Player, MPC-HC',
  },
  {
    name: 'efect_sonor_arcade',
    extension: '.ogg',
    category: 'media',
    description: 'Format audio liber de licență, foarte folosit în jocuri video și streaming.',
    programs: 'Jocuri video, VLC, Web Audio',
  },

  // 4. ARHIVE & COD (ARCHIVES)
  {
    name: 'proiect_complet',
    extension: '.zip',
    category: 'archives',
    description: 'Arhivă comprimată care împachetează mai multe fișiere într-unul singur.',
    programs: '7-Zip, WinRAR, Windows Explorer',
  },
  {
    name: 'backup_documente',
    extension: '.rar',
    category: 'archives',
    description: 'Arhivă cu rată mare de compresie și opțiuni de recuperare date.',
    programs: 'WinRAR, 7-Zip, PeaZip',
  },
  {
    name: 'pachet_software',
    extension: '.7z',
    category: 'archives',
    description: 'Format de arhivă ultra-eficient cu algoritm avansat LZMA.',
    programs: '7-Zip, p7zip',
  },
  {
    name: 'joc_sarpe',
    extension: '.py',
    category: 'archives',
    description: 'Cod sursă scris în limbajul de programare Python.',
    programs: 'Python IDLE, VS Code, PyCharm',
  },
  {
    name: 'pagina_web_laborator',
    extension: '.html',
    category: 'archives',
    description: 'HyperText Markup Language — structura de bază a paginilor de internet.',
    programs: 'Chrome, Edge, VS Code',
  },

  // 5. CARANTINĂ ANTIVIRUS (THREATS & EXECUTABLES)
  {
    name: 'hack_robux_free',
    extension: '.exe',
    category: 'quarantine',
    isThreat: true,
    description: 'Fișier executabil suspect pretins gratuit! Poate infecta tot calculatorul.',
    programs: 'Windows Defender, Malwarebytes (Carantină)',
  },
  {
    name: 'auto_delete_system',
    extension: '.bat',
    category: 'quarantine',
    isThreat: true,
    description: 'Script batch malițios ce poate executa comenzi distructive în consolă.',
    programs: 'Antivirus Sandbox, Notepad (analiză)',
  },
  {
    name: 'trojan_downloader',
    extension: '.vbs',
    category: 'quarantine',
    isThreat: true,
    description: 'Script VBScript malițios conceput să descarce viruși pe ascuns.',
    programs: 'Windows Script Host (BLOCAT)',
  },
  {
    name: 'screensaver_infractor',
    extension: '.scr',
    category: 'quarantine',
    isThreat: true,
    description: 'Extensie aparent inofensivă, dar de fapt este un program executabil deghizat.',
    programs: 'Antivirus EDR, Defender',
  },
  {
    name: 'ransomware_cryptolocker',
    extension: '.bin',
    category: 'quarantine',
    isThreat: true,
    description: 'Cod binar malițios ce încearcă să cripteze fișierele personale pentru recompensă.',
    programs: 'Carantină Antivirus Imediată!',
  },
];

// Special power-up items
const SPECIAL_ITEMS: Omit<FileItem, 'id'>[] = [
  {
    name: 'slow_motion_defrag',
    extension: '.sys',
    category: 'archives',
    isSpecial: 'slow',
    description: 'Driver de optimizare: încetinește timpul de cădere pentru 6 secunde!',
    programs: 'Sistem de Operare',
  },
  {
    name: 'backup_restaurare',
    extension: '.iso',
    category: 'docs',
    isSpecial: 'heal',
    description: 'Imagine de rezervă a sistemului: reface 1 viață din integritatea calculatorului!',
    programs: 'Modul Restaurare Sistem',
  },
];

// The 5 Lanes definition
export const LANES: FolderLane[] = [
  {
    category: 'docs',
    title: 'Documente',
    sub: 'Text & Tabele',
    icon: <FileText className="w-5 h-5 text-sky-400" />,
    color: 'from-sky-500 to-blue-600',
    borderColor: 'border-sky-500/40',
    bgColor: 'bg-sky-950/40',
    tagColor: 'text-sky-300 bg-sky-500/20 border-sky-500/30',
    allowedExtensions: ['.docx', '.pdf', '.xlsx', '.pptx', '.txt', '.csv'],
  },
  {
    category: 'images',
    title: 'Imagini',
    sub: 'Grafică & Poze',
    icon: <Image className="w-5 h-5 text-fuchsia-400" />,
    color: 'from-fuchsia-500 to-purple-600',
    borderColor: 'border-fuchsia-500/40',
    bgColor: 'bg-fuchsia-950/40',
    tagColor: 'text-fuchsia-300 bg-fuchsia-500/20 border-fuchsia-500/30',
    allowedExtensions: ['.png', '.jpg', '.svg', '.gif', '.webp'],
  },
  {
    category: 'media',
    title: 'Audio-Video',
    sub: 'Sunete & Filme',
    icon: <Film className="w-5 h-5 text-emerald-400" />,
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500/40',
    bgColor: 'bg-emerald-950/40',
    tagColor: 'text-emerald-300 bg-emerald-500/20 border-emerald-500/30',
    allowedExtensions: ['.mp3', '.wav', '.mp4', '.mkv', '.ogg'],
  },
  {
    category: 'archives',
    title: 'Arhive & Cod',
    sub: 'Comprimate & Script',
    icon: <Archive className="w-5 h-5 text-amber-400" />,
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-500/40',
    bgColor: 'bg-amber-950/40',
    tagColor: 'text-amber-300 bg-amber-500/20 border-amber-500/30',
    allowedExtensions: ['.zip', '.rar', '.7z', '.py', '.html'],
  },
  {
    category: 'quarantine',
    title: 'Carantină',
    sub: 'Viruși & Executabile',
    icon: <Biohazard className="w-5 h-5 text-rose-400 animate-pulse" />,
    color: 'from-rose-500 to-red-600',
    borderColor: 'border-rose-500/60',
    bgColor: 'bg-rose-950/50',
    tagColor: 'text-rose-300 bg-rose-500/20 border-rose-500/30',
    allowedExtensions: ['.exe', '.bat', '.vbs', '.scr', '.bin'],
  },
];

const INITIAL_LIVES = 3;
const FOLDER_CAPACITY = 4; // Tetris stack threshold for Line Clear!

export const FileDropGame: React.FC<FileDropGameProps> = ({ onBack, studentName }) => {
  const { lang } = useLanguage();
  const arky = useArky();
  const arkyRef = useRef(arky);
  arkyRef.current = arky;
  const langRef = useRef(lang);
  langRef.current = lang;

  // Game States
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // Stats
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [lives, setLives] = useState<number>(INITIAL_LIVES);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [filesSortedCount, setFilesSortedCount] = useState<number>(0);
  const [threatsNeutralized, setThreatsNeutralized] = useState<number>(0);
  const [clearedFoldersCount, setClearedFoldersCount] = useState<number>(0);

  // Falling Item State
  const [currentLane, setCurrentLane] = useState<number>(2); // Start middle lane (0..4)
  const [fallingProgress, setFallingProgress] = useState<number>(0); // 0 to 100%
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null);
  const [nextFile, setNextFile] = useState<FileItem | null>(null);

  // Stack of sorted items per folder lane: number of items currently in lane [0, 0, 0, 0, 0]
  const [laneStacks, setLaneStacks] = useState<number[]>([0, 0, 0, 0, 0]);
  const [recentlyClearedLane, setRecentlyClearedLane] = useState<number | null>(null);

  // Inspector & Learning Banner
  const [lastSortedFile, setLastSortedFile] = useState<FileItem | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isSlowMoActive, setIsSlowMoActive] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  // High score
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_file_drop') || '0');
    } catch {
      return 0;
    }
  });

  // Timers & Animation Frame Refs
  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const slowMoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Stable references to prevent stale closures
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;
  const isGameOverRef = useRef(isGameOver);
  isGameOverRef.current = isGameOver;
  const currentLaneRef = useRef(currentLane);
  currentLaneRef.current = currentLane;
  const fallingProgressRef = useRef(fallingProgress);
  fallingProgressRef.current = fallingProgress;
  const currentFileRef = useRef(currentFile);
  currentFileRef.current = currentFile;
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const livesRef = useRef(lives);
  livesRef.current = lives;
  const levelRef = useRef(level);
  levelRef.current = level;
  const isSlowMoRef = useRef(isSlowMoActive);
  isSlowMoRef.current = isSlowMoActive;
  const streakRef = useRef(streak);
  streakRef.current = streak;
  const laneStacksRef = useRef(laneStacks);
  laneStacksRef.current = laneStacks;

  // Helper: Generate random file item based on current difficulty level
  const generateRandomFile = useCallback((currentScore: number): FileItem => {
    // Determine chance for threats and special power-ups
    const roll = Math.random();
    let chosen: Omit<FileItem, 'id'>;

    // 10% chance for special items if score > 500
    if (roll < 0.08 && currentScore >= 400) {
      chosen = SPECIAL_ITEMS[Math.floor(Math.random() * SPECIAL_ITEMS.length)];
    } else {
      // Normal or threat
      // Higher score = slightly more frequent threats
      const threatChance = Math.min(0.28, 0.15 + (currentScore / 8000) * 0.15);
      const isThreatRoll = Math.random() < threatChance;

      if (isThreatRoll) {
        const threats = FILE_CATALOG.filter((f) => f.category === 'quarantine');
        chosen = threats[Math.floor(Math.random() * threats.length)];
      } else {
        const regulars = FILE_CATALOG.filter((f) => f.category !== 'quarantine');
        chosen = regulars[Math.floor(Math.random() * regulars.length)];
      }
    }

    return {
      ...chosen,
      id: `${chosen.name}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    };
  }, []);

  // Spawn new falling file
  const spawnNextFile = useCallback(() => {
    let nextSpawn: FileItem;
    if (nextFile) {
      nextSpawn = nextFile;
    } else {
      nextSpawn = generateRandomFile(scoreRef.current);
    }

    const upcoming = generateRandomFile(scoreRef.current);
    setCurrentFile(nextSpawn);
    setNextFile(upcoming);
    setCurrentLane(2); // Center lane
    setFallingProgress(0);
    fallingProgressRef.current = 0;
    currentLaneRef.current = 2;
  }, [nextFile, generateRandomFile]);

  // Start / Reset Game
  const startGame = useCallback(() => {
    sounds.playClick();
    setScore(0);
    setLevel(1);
    setLives(INITIAL_LIVES);
    setStreak(0);
    setMaxStreak(0);
    setFilesSortedCount(0);
    setThreatsNeutralized(0);
    setClearedFoldersCount(0);
    setLaneStacks([0, 0, 0, 0, 0]);
    setIsGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
    setFeedbackMessage(null);
    setIsSlowMoActive(false);

    const first = generateRandomFile(0);
    const second = generateRandomFile(0);
    setCurrentFile(first);
    setNextFile(second);
    setCurrentLane(2);
    setFallingProgress(0);

    arkyRef.current.triggerIdle(
      langRef.current === 'en'
        ? 'File-Drop started! Guide the files into their correct folders before they hit the ground! 🚀'
        : 'File-Drop a început! Condu fișierele în folderul corect folosind săgețile sau atingerile pe ecran! 🚀'
    );
  }, [generateRandomFile]);

  // Handle Landing File in currentLane
  const handleFileLanded = useCallback(() => {
    const activeFile = currentFileRef.current;
    if (!activeFile) return;

    const landedLaneIndex = currentLaneRef.current;
    const targetLane = LANES[landedLaneIndex];
    const isCorrectCategory = activeFile.category === targetLane.category;

    setLastSortedFile(activeFile);

    if (isCorrectCategory) {
      // SUCCESSFUL SORT
      sounds.playCorrect();

      // Check if special item
      if (activeFile.isSpecial === 'slow') {
        setIsSlowMoActive(true);
        if (slowMoTimeoutRef.current) clearTimeout(slowMoTimeoutRef.current);
        slowMoTimeoutRef.current = setTimeout(() => {
          setIsSlowMoActive(false);
        }, 6000);
      } else if (activeFile.isSpecial === 'heal') {
        setLives((l) => Math.min(INITIAL_LIVES + 1, l + 1));
      }

      // Check if threat neutralized
      if (activeFile.isThreat) {
        setThreatsNeutralized((prev) => prev + 1);
      }

      // Calculate score with combo multiplier
      const currentStreak = streakRef.current + 1;
      setStreak(currentStreak);
      setMaxStreak((prev) => Math.max(prev, currentStreak));

      let multiplier = 1;
      if (currentStreak >= 8) multiplier = 3;
      else if (currentStreak >= 5) multiplier = 2;
      else if (currentStreak >= 3) multiplier = 1.5;

      const basePoints = activeFile.isThreat ? 250 : 100;
      const pointsEarned = Math.round(basePoints * multiplier);

      setScore((prev) => {
        const newScore = prev + pointsEarned;
        // Check level progression
        const newLevel = Math.min(8, Math.floor(newScore / 1000) + 1);
        if (newLevel > levelRef.current) {
          setLevel(newLevel);
          sounds.playLevelUp();
        }
        return newScore;
      });

      setFilesSortedCount((prev) => prev + 1);

      // Tetris Stack Mechanic: add block to lane
      const currentStacks = [...laneStacksRef.current];
      const newCount = (currentStacks[landedLaneIndex] || 0) + 1;

      if (newCount >= FOLDER_CAPACITY) {
        // TETRIS LINE CLEAR / FOLDER BACKUP!
        sounds.playLevelUp();
        currentStacks[landedLaneIndex] = 0;
        setClearedFoldersCount((c) => c + 1);
        setRecentlyClearedLane(landedLaneIndex);
        setTimeout(() => setRecentlyClearedLane(null), 1200);

        // Huge bonus for line clear!
        const clearBonus = 350;
        setScore((prev) => prev + clearBonus);

        setFeedbackMessage({
          text: `🎉 BACKUP COMPLET! Folderul "${targetLane.title}" a fost curățat și arhivat! (+${clearBonus} XP Bonus)`,
          isError: false,
        });
      } else {
        currentStacks[landedLaneIndex] = newCount;
        setFeedbackMessage({
          text: `Corect! ${activeFile.name}${activeFile.extension} salvat în ${targetLane.title}! (+${pointsEarned} XP)`,
          isError: false,
        });
      }

      setLaneStacks(currentStacks);
    } else {
      // INCORRECT SORT
      sounds.playWrong();
      setStreak(0); // Reset combo

      const newLives = livesRef.current - 1;
      setLives(newLives);

      const correctLane = LANES.find((l) => l.category === activeFile.category);
      const explanation = activeFile.isThreat
        ? `⚠️ ATENȚIE! '${activeFile.name}${activeFile.extension}' este un fișier malițios / executabil suspect! Trebuia plasat în Carantină Antivirus!`
        : `Greșit! Fișierul '${activeFile.name}${activeFile.extension}' are extensia ${activeFile.extension} și trebuia pus în "${correctLane?.title}"!`;

      setFeedbackMessage({
        text: explanation,
        isError: true,
      });

      if (newLives <= 0) {
        // GAME OVER
        setIsPlaying(false);
        setIsGameOver(true);
        sounds.playWrong();

        // Final score check & save
        const finalScore = scoreRef.current;
        if (finalScore > highScore) {
          setHighScore(finalScore);
          try {
            localStorage.setItem('arkedo_highscore_file_drop', String(finalScore));
          } catch {
            // Local fallback
          }
        }

        updateActiveArcadeScore('file_drop', finalScore);

        arkyRef.current.triggerFinished(
          langRef.current === 'en'
            ? `Game Over! You sorted ${filesSortedCount + 1} files with a score of ${finalScore} pts! Keep practicing file extensions! 💾⚡`
            : `Joc Încheiat! Ai sortat cu succes ${filesSortedCount + 1} fișiere și ai obținut ${finalScore} puncte! Continuă să exersezi extensiile TIC! 💾⚡`
        );
        return;
      }
    }

    // Spawn next file
    spawnNextFile();
  }, [highScore, spawnNextFile, filesSortedCount]);

  // Main Game Loop (requestAnimationFrame)
  useEffect(() => {
    if (!isPlaying || isPaused || isGameOver) {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      return;
    }

    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const delta = (timestamp - lastTimestamp) / 1000; // in seconds
      lastTimestamp = timestamp;

      // Base speed calculation: Progress per second
      // Level 1: 18% per second (approx 5.5s to fall)
      // Level 2: 24% per second
      // Level 5+: up to 55% per second
      let speedFactor = 18 + (levelRef.current - 1) * 4.5;
      if (isSlowMoRef.current) {
        speedFactor *= 0.45; // Slow motion
      }

      setFallingProgress((prev) => {
        const next = prev + speedFactor * delta;
        if (next >= 100) {
          // File hit bottom folder!
          handleFileLanded();
          return 0;
        }
        return next;
      });

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isPlaying, isPaused, isGameOver, handleFileLanded]);

  // Control Actions: Move Left, Move Right, Soft Drop, Hard Drop
  const moveLeft = useCallback(() => {
    if (!isPlayingRef.current || isPausedRef.current || isGameOverRef.current) return;
    sounds.playClick();
    setCurrentLane((prev) => Math.max(0, prev - 1));
  }, []);

  const moveRight = useCallback(() => {
    if (!isPlayingRef.current || isPausedRef.current || isGameOverRef.current) return;
    sounds.playClick();
    setCurrentLane((prev) => Math.min(LANES.length - 1, prev + 1));
  }, []);

  const setLaneDirect = useCallback((laneIndex: number) => {
    if (!isPlayingRef.current || isPausedRef.current || isGameOverRef.current) return;
    sounds.playClick();
    setCurrentLane(laneIndex);
  }, []);

  const softDrop = useCallback(() => {
    if (!isPlayingRef.current || isPausedRef.current || isGameOverRef.current) return;
    setFallingProgress((prev) => Math.min(99, prev + 18));
  }, []);

  const hardDrop = useCallback(() => {
    if (!isPlayingRef.current || isPausedRef.current || isGameOverRef.current) return;
    sounds.playClick();
    handleFileLanded();
  }, [handleFileLanded]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlayingRef.current || isGameOverRef.current) {
        if (e.code === 'Space' && !isPlayingRef.current && !isGameOverRef.current) {
          startGame();
        }
        return;
      }

      if (e.key === 'p' || e.key === 'P') {
        setIsPaused((prev) => !prev);
        return;
      }

      if (isPausedRef.current) return;

      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        e.preventDefault();
        moveLeft();
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        e.preventDefault();
        moveRight();
      } else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
        e.preventDefault();
        softDrop();
      } else if (e.code === 'Space') {
        e.preventDefault();
        hardDrop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveLeft, moveRight, softDrop, hardDrop, startGame]);

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto pb-12 animate-fadeIn">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 backdrop-blur shadow-xl">
        <div className="flex items-center gap-3">
          <button
            id="file-drop-btn-back"
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
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Tetris TIC Arcade
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                {lang === 'en' ? 'File Extension Sorter' : 'Sortator de Extensii & Fișiere'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-heading mt-0.5 flex items-center gap-2">
              <span>File-Drop (Tetris Fișiere)</span>
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </h1>
          </div>
        </div>

        {/* Action Controls & Highscore */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="file-drop-btn-guide"
            type="button"
            onClick={() => {
              sounds.playClick();
              setShowGuideModal(true);
            }}
            className="px-3 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">{lang === 'en' ? 'Extensions Guide' : 'Ghid Extensii'}</span>
          </button>

          {isPlaying && (
            <button
              id="file-drop-btn-pause"
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsPaused((prev) => !prev);
              }}
              className="px-3 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
              <span>{isPaused ? 'Continuă' : 'Pauză'}</span>
            </button>
          )}

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

      {/* Gamification Dashboard Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Score */}
        <div className="bg-slate-900/80 border border-sky-500/20 rounded-2xl p-3 text-center">
          <div className="text-[11px] font-mono text-sky-300 uppercase tracking-wider">
            {lang === 'en' ? 'Score' : 'Punctaj'}
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white mt-0.5">
            {score}
          </div>
        </div>

        {/* Level */}
        <div className="bg-slate-900/80 border border-indigo-500/20 rounded-2xl p-3 text-center">
          <div className="text-[11px] font-mono text-indigo-300 uppercase tracking-wider">
            {lang === 'en' ? 'Level & Speed' : 'Nivel & Viteză'}
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-indigo-200 mt-0.5 flex items-center justify-center gap-1">
            <span>Niv. {level}</span>
            {isSlowMoActive && <span className="text-xs text-teal-300 font-normal animate-pulse">⏳ Slow</span>}
          </div>
        </div>

        {/* Combo / Streak */}
        <div className="bg-slate-900/80 border border-amber-500/20 rounded-2xl p-3 text-center">
          <div className="text-[11px] font-mono text-amber-300 uppercase tracking-wider flex items-center justify-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Combo</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-300 mt-0.5">
            {streak > 0 ? `x${streak}` : '-'}
          </div>
        </div>

        {/* System Integrity / Lives */}
        <div className="bg-slate-900/80 border border-rose-500/20 rounded-2xl p-3 text-center">
          <div className="text-[11px] font-mono text-rose-300 uppercase tracking-wider">
            {lang === 'en' ? 'System Integrity' : 'Integritate Sistem'}
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-1.5">
            {[...Array(INITIAL_LIVES + 1)].map((_, idx) => (
              <Heart
                key={`heart-${idx}`}
                className={`w-5 h-5 transition-transform ${
                  idx < lives ? 'text-rose-500 fill-rose-500 scale-110' : 'text-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Next File Preview */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 text-center col-span-2 sm:col-span-1 flex flex-col justify-center items-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">
            {lang === 'en' ? 'Next File' : 'Următorul'}
          </div>
          {nextFile ? (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-mono text-xs font-bold text-white truncate max-w-[110px]">
                {nextFile.extension}
              </span>
              {nextFile.isThreat && <Biohazard className="w-3.5 h-3.5 text-rose-400 animate-pulse" />}
            </div>
          ) : (
            <span className="text-xs text-slate-500">---</span>
          )}
        </div>
      </div>

      {/* Main Arcade Stage */}
      <div className="relative w-full bg-slate-950/95 border-2 border-indigo-500/40 rounded-3xl p-3 sm:p-5 shadow-2xl backdrop-blur overflow-hidden flex flex-col">
        {/* Playfield Area with 5 Columns (Lanes) */}
        <div className="relative w-full h-[420px] sm:h-[480px] bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between">
          {/* Background Grid Pattern & Lane Separators */}
          <div className="absolute inset-0 grid grid-cols-5 pointer-events-none divide-x divide-slate-800/60">
            {LANES.map((lane, idx) => (
              <div
                key={`bg-lane-${lane.category}`}
                className={`h-full transition-colors ${
                  currentLane === idx ? 'bg-indigo-500/5' : ''
                }`}
              />
            ))}
          </div>

          {/* Falling File Sprite */}
          {isPlaying && currentFile && (
            <div
              style={{
                position: 'absolute',
                left: `${currentLane * 20}%`,
                width: '20%',
                top: `${fallingProgress}%`,
                transform: 'translateY(-50%)',
                transition: 'left 80ms ease-out',
                zIndex: 20,
              }}
              className="p-1 sm:p-2 pointer-events-none"
            >
              <div
                className={`relative mx-auto max-w-[170px] rounded-2xl p-2.5 sm:p-3 border-2 shadow-2xl transition-all ${
                  currentFile.isThreat
                    ? 'bg-gradient-to-b from-rose-950 to-slate-950 border-rose-500 text-rose-100 shadow-rose-600/50 ring-2 ring-rose-500/40 animate-pulse'
                    : currentFile.isSpecial
                    ? 'bg-gradient-to-b from-teal-950 to-slate-950 border-teal-400 text-teal-100 shadow-teal-500/40 ring-2 ring-teal-400/40'
                    : 'bg-slate-900/95 border-sky-400 text-white shadow-indigo-600/30'
                }`}
              >
                {/* Threat / Special Badge */}
                {currentFile.isThreat && (
                  <div className="absolute -top-2.5 -right-2 px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <ShieldAlert className="w-3 h-3" />
                    <span>VIRUS</span>
                  </div>
                )}
                {currentFile.isSpecial && (
                  <div className="absolute -top-2.5 -right-2 px-1.5 py-0.5 rounded-md bg-teal-600 text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Zap className="w-3 h-3" />
                    <span>BONUS</span>
                  </div>
                )}

                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    {currentFile.isThreat ? (
                      <Biohazard className="w-3.5 h-3.5 text-rose-400" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-sky-400" />
                    )}
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-white truncate max-w-[95px]">
                    {currentFile.name}
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between">
                  <span
                    className={`font-mono font-black text-xs sm:text-sm px-1.5 py-0.5 rounded ${
                      currentFile.isThreat
                        ? 'bg-rose-900/60 text-rose-300'
                        : 'bg-indigo-900/60 text-sky-300'
                    }`}
                  >
                    {currentFile.extension}
                  </span>
                  <ArrowDown className="w-3.5 h-3.5 text-slate-400 animate-bounce" />
                </div>
              </div>
            </div>
          )}

          {/* Start Game / Paused / Game Over Overlay */}
          {!isPlaying && !isGameOver && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30 animate-fadeIn">
              <div className="w-16 h-16 rounded-3xl bg-sky-500/20 border-2 border-sky-400 flex items-center justify-center text-sky-400 mb-3 shadow-lg shadow-sky-500/20">
                <Layers className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
                File-Drop (Tetris cu Fișiere)
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-md mt-2 leading-relaxed">
                De sus cad continuu fișiere cu diverse extensii. Folosește <strong>Săgețile Stânga / Dreapta</strong> sau atinge coloana pentru a potrivi fișierul în folderul corect înainte să atingă baza!
              </p>

              {/* Instructions Summary */}
              <div className="grid grid-cols-2 gap-2 my-4 max-w-sm text-left text-xs text-slate-300">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-sky-300 block">⬅️ ➡️ Săgeți:</span>
                  <span>Schimbă folderul de destinație</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-amber-300 block">⬇️ Săgeată Jos:</span>
                  <span>Soft Drop (Cădere rapidă)</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-emerald-300 block">⚡ Spacebar:</span>
                  <span>Hard Drop (Drop instantaneu)</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-rose-300 block">☣️ Carantină:</span>
                  <span>Pune fișierele periculoase (.exe, .bat)!</span>
                </div>
              </div>

              <button
                id="file-drop-btn-start"
                type="button"
                onClick={startGame}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white font-black text-sm transition flex items-center gap-2 shadow-xl shadow-indigo-600/30 cursor-pointer active:scale-95"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Începe Jocul (Start)</span>
              </button>
            </div>
          )}

          {isPaused && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 mb-2">
                <Pause className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white font-heading">Joc în Pauză</h3>
              <p className="text-xs text-slate-300 mt-1">Apasă tasta P sau butonul de mai jos pentru a relua.</p>
              <button
                type="button"
                onClick={() => setIsPaused(false)}
                className="mt-4 px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4" />
                <span>Reia Jocul</span>
              </button>
            </div>
          )}

          {/* Top lane indicator arrow for active column */}
          <div className="grid grid-cols-5 w-full pt-1">
            {LANES.map((_, idx) => (
              <div key={`lane-pointer-${idx}`} className="flex justify-center">
                {currentLane === idx && isPlaying && (
                  <div className="w-3 h-3 rounded-full bg-sky-400 shadow-md shadow-sky-400/50 animate-bounce" />
                )}
              </div>
            ))}
          </div>

          {/* Bottom Destination Folders (The 5 Target Bins) */}
          <div className="grid grid-cols-5 gap-1 sm:gap-2 p-1.5 sm:p-2 border-t-2 border-slate-800 bg-slate-950/90 z-10">
            {LANES.map((lane, idx) => {
              const isTargeted = currentLane === idx;
              const stackCount = laneStacks[idx] || 0;
              const isCleared = recentlyClearedLane === idx;

              return (
                <button
                  key={`folder-${lane.category}`}
                  type="button"
                  onClick={() => setLaneDirect(idx)}
                  className={`group relative rounded-2xl p-1.5 sm:p-2.5 text-left border-2 transition-all flex flex-col justify-between cursor-pointer active:scale-95 select-none ${
                    isCleared
                      ? 'bg-emerald-500/30 border-emerald-400 shadow-lg shadow-emerald-500/50 ring-2 ring-emerald-400 animate-pulse'
                      : isTargeted
                      ? `${lane.bgColor} ${lane.borderColor} shadow-lg ring-2 ring-sky-400/50`
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Folder Icon & Title */}
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="shrink-0">{lane.icon}</div>
                      <span className="text-[9px] sm:text-[10px] font-mono text-slate-400">
                        #{idx + 1}
                      </span>
                    </div>

                    <div className="text-[11px] sm:text-xs font-black text-white truncate font-heading">
                      {lane.title}
                    </div>

                    <div className="text-[9px] text-slate-400 truncate hidden sm:block">
                      {lane.sub}
                    </div>
                  </div>

                  {/* Tetris Stack Meter (Blocks stacked in this folder) */}
                  <div className="mt-2 pt-1.5 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mb-1">
                      <span>Stack</span>
                      <span className={stackCount >= 3 ? 'text-amber-400 font-bold' : ''}>
                        {stackCount}/{FOLDER_CAPACITY}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-0.5 w-full h-1.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      {[0, 1, 2, 3].map((slotIdx) => (
                        <div
                          key={`slot-${slotIdx}`}
                          className={`rounded-sm transition-colors ${
                            slotIdx < stackCount
                              ? stackCount === 3
                                ? 'bg-amber-400 shadow-sm shadow-amber-400'
                                : 'bg-sky-400'
                              : 'bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile & Touch Controls Bar */}
        <div className="grid grid-cols-4 gap-2 mt-3 sm:hidden">
          <button
            type="button"
            onClick={moveLeft}
            className="py-3 rounded-2xl bg-slate-800 active:bg-slate-700 border border-slate-700 text-white font-bold flex items-center justify-center gap-1 active:scale-95"
          >
            <ArrowLeftIcon className="w-5 h-5 text-sky-400" />
            <span className="text-xs">Stânga</span>
          </button>

          <button
            type="button"
            onClick={moveRight}
            className="py-3 rounded-2xl bg-slate-800 active:bg-slate-700 border border-slate-700 text-white font-bold flex items-center justify-center gap-1 active:scale-95"
          >
            <span className="text-xs">Dreapta</span>
            <ArrowRightIcon className="w-5 h-5 text-sky-400" />
          </button>

          <button
            type="button"
            onClick={softDrop}
            className="py-3 rounded-2xl bg-indigo-900/60 active:bg-indigo-800 border border-indigo-700/60 text-indigo-200 font-bold flex items-center justify-center gap-1 active:scale-95"
          >
            <ArrowDown className="w-5 h-5 text-indigo-300" />
            <span className="text-xs">Rapid</span>
          </button>

          <button
            type="button"
            onClick={hardDrop}
            className="py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black flex items-center justify-center gap-1 active:scale-95 shadow-md shadow-emerald-600/30"
          >
            <Zap className="w-5 h-5 text-amber-300" />
            <span className="text-xs">Drop!</span>
          </button>
        </div>

        {/* Desktop Quick Key Helper */}
        <div className="hidden sm:flex items-center justify-between text-xs text-slate-400 px-2 mt-2">
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">
              ⬅️ A
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">
              ➡️ D
            </kbd>
            <span>Mută Fișierul</span>
          </span>

          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">
              ⬇️ S
            </kbd>
            <span>Soft Drop</span>
          </span>

          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">
              Space
            </kbd>
            <span>Hard Drop (Instant)</span>
          </span>

          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">
              P
            </kbd>
            <span>Pauză</span>
          </span>
        </div>
      </div>

      {/* Educational Inspector & Recent File Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left: Feedback or Inspector */}
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-sky-400" />
              <span>Inspector Extensii TIC (Învățare în Timp Real)</span>
            </h4>
            {feedbackMessage && (
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  feedbackMessage.isError
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {feedbackMessage.isError ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{feedbackMessage.isError ? 'Greșit' : 'Excelent'}</span>
              </span>
            )}
          </div>

          {lastSortedFile ? (
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-lg bg-sky-500/20 text-sky-300 font-mono font-bold text-xs border border-sky-500/30">
                    {lastSortedFile.extension}
                  </span>
                  <span className="font-bold text-white text-sm">
                    {lastSortedFile.name}{lastSortedFile.extension}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  Programe: <strong className="text-slate-200">{lastSortedFile.programs}</strong>
                </span>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed px-1">
                {lastSortedFile.description}
              </p>
            </div>
          ) : (
            <p className="text-slate-400 text-xs italic py-2">
              Pornește jocul și sortează fișierele pentru a vedea explicația fiecărei extensii și programele compatibile!
            </p>
          )}
        </div>

        {/* Right: Quick Stats & Arky helper */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg flex flex-col justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <span className="text-xl">🤖</span>
            <span>Arky Tips:</span>
          </div>
          <p className="text-xs text-slate-300 leading-snug">
            {isSlowMoActive
              ? '⏳ Slow-Motion activ! Profită de viteză pentru a așeza fișierele cu precizie maximă!'
              : streak >= 5
              ? '🔥 Super combo! Câștigi puncte duble la fiecare fișier sortat corect!'
              : 'Fișierele .docx, .xlsx și .pdf sunt Documente. Nu lăsa fișierele .exe malițioase să atingă folderele obișnuite!'}
          </p>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Folder curățat (Tetris):</span>
            <span className="font-bold text-emerald-400">{clearedFoldersCount} ori</span>
          </div>
        </div>
      </div>

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
            <div className="w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg shadow-rose-500/30">
              💾
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
              {lang === 'en' ? 'Game Over!' : 'Joc Încheiat!'}
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed mt-2 max-w-md mx-auto">
              Integritatea sistemului a atins 0%. Ai sortat fișierele cu succes și ai apărat sistemul de amenințări!
            </p>

            {/* Performance Summary Grid */}
            <div className="grid grid-cols-3 gap-3 my-6 bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">Punctaj</div>
                <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400 mt-0.5">
                  {score}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">Sortate</div>
                <div className="text-xl sm:text-2xl font-black font-mono text-sky-300 mt-0.5">
                  {filesSortedCount}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">Viruși Blocați</div>
                <div className="text-xl sm:text-2xl font-black font-mono text-rose-300 mt-0.5">
                  {threatsNeutralized}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={startGame}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{lang === 'en' ? 'Play Again' : 'Joacă din nou (Altă sesiune)'}</span>
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

      {/* Guide Modal: All 5 Categories & Allowed Extensions */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-indigo-500/50 rounded-3xl p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white font-heading">
                  Ghidul Extensiilor de Fișiere (Programă TIC)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto py-4 space-y-3 pr-1 text-xs">
              {LANES.map((lane) => (
                <div
                  key={`guide-${lane.category}`}
                  className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {lane.icon}
                      <span className="font-bold text-white text-sm">{lane.title}</span>
                      <span className="text-[11px] text-slate-400">({lane.sub})</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {lane.allowedExtensions.map((ext) => (
                      <span
                        key={ext}
                        className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 font-mono font-bold text-sky-300 text-[11px]"
                      >
                        {ext}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Am înțeles, închide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
