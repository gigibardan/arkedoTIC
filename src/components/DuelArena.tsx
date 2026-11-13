import React, { useState, useEffect, useRef } from 'react';
import {
  Swords,
  Users,
  Copy,
  Check,
  Play,
  RotateCcw,
  Trophy,
  Zap,
  Flame,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Award,
  Crown,
  Wifi,
  Keyboard,
  HelpCircle,
  Clock,
  LogOut,
  ArrowLeft,
  Volume2,
  ShieldCheck,
  ShieldX,
  Cpu,
  Mail,
  AlertTriangle,
  FileCode,
  HardDrive,
  CheckCircle2,
  XCircle,
  Wrench,
  CheckCheck,
  Puzzle,
  Boxes,
  Crosshair,
  Filter
} from 'lucide-react';
import {
  DuelGameMode,
  DuelRoomData,
  DuelPlayer,
  getDeviceId,
  createDuelRoom,
  joinDuelRoom,
  startDuelMatch,
  updateDuelProgress,
  setRoomPlaying,
  subscribeToDuelRoom,
  leaveDuelRoom,
  CyberShieldItem,
  PCRushPart,
  BlockCodingChallenge
} from '../lib/duelService';
import { CyberPrecisionDuelGame } from './minigames/CyberPrecisionDuelGame';
import { CircuitOverdriveDuelGame } from './minigames/CircuitOverdriveDuelGame';
import { BlockCodingDuelGame } from './minigames/BlockCodingDuelGame';
import { SpeedCraftingDuelGame } from './minigames/SpeedCraftingDuelGame';
import { RobloxClickerDuelGame } from './minigames/RobloxClickerDuelGame';
import { MouseMasterDuelGame } from './minigames/MouseMasterDuelGame';
import { HackerDefenderDuelGame } from './minigames/HackerDefenderDuelGame';
import { BinaryClashDuelGame } from './minigames/BinaryClashDuelGame';
import { CircuitMasterDuelGame } from './minigames/CircuitMasterDuelGame';
import { CodeRacerCppDuelGame } from './minigames/CodeRacerCppDuelGame';
import { PixelClashDuelGame } from './minigames/PixelClashDuelGame';
import { NetworkPacketRacerDuelGame } from './minigames/NetworkPacketRacerDuelGame';
import { recordStudentDuelResult } from '../lib/studentAuthService';
import { isCloudConnected } from '../lib/firebase';
import { useLanguage } from '../context/LanguageContext';
import { sounds } from '../utils/audio';
import { UnloggedNoticeBadge } from './common/UnloggedNoticeBadge';
import { forceScrollToTop } from '../utils/scrollHelper';

interface DuelArenaProps {
  lang?: 'ro' | 'en';
  studentName?: string;
  studentAvatar?: string;
  currentStudentName?: string;
  currentStudentAvatar?: string;
  onAwardXP?: (amount: number, reason: string) => void;
  onBack?: () => void;
  onClose?: () => void;
}

export const DuelArena: React.FC<DuelArenaProps> = ({
  lang: propLang,
  studentName: propStudentName,
  studentAvatar: propStudentAvatar,
  currentStudentName,
  currentStudentAvatar,
  onAwardXP,
  onBack,
  onClose
}) => {
  const { lang: contextLang } = useLanguage();
  const lang = propLang || contextLang;

  const resolvedStudentName = (() => {
    if (propStudentName) return propStudentName;
    if (currentStudentName) return currentStudentName;
    try {
      return localStorage.getItem('arkedo_student_name') || '';
    } catch {
      return '';
    }
  })() || (lang === 'en' ? 'Cadet Player' : 'Campion TIC');

  const resolvedAvatar = (() => {
    if (propStudentAvatar) return propStudentAvatar;
    if (currentStudentAvatar) return currentStudentAvatar;
    try {
      return localStorage.getItem('arkedo_student_avatar') || '⚡';
    } catch {
      return '⚡';
    }
  })();

  const handleBack = onBack || onClose;
  // Navigation / Lobby States
  const [viewState, setViewState] = useState<'lobby' | 'room' | 'playing' | 'results'>('lobby');
  const [selectedMode, setSelectedMode] = useState<DuelGameMode>('cyber_sprint');
  const [activeCategory, setActiveCategory] = useState<'all' | 'precision' | 'speed' | 'algo' | 'hardware'>('all');
  const [mobileLobbyTab, setMobileLobbyTab] = useState<'create' | 'join'>('create');
  const [inputRoomCode, setInputRoomCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  // Automatically scroll to top whenever entering room, playing, results or lobby
  useEffect(() => {
    forceScrollToTop();
  }, [viewState]);

  const joinBoxRef = useRef<HTMLDivElement>(null);
  const createSectionRef = useRef<HTMLDivElement>(null);

  const isModeInCategory = (modeKey: DuelGameMode, cat: 'all' | 'precision' | 'speed' | 'algo' | 'hardware') => {
    if (cat === 'all') return true;
    if (cat === 'precision') {
      return ['cyber_precision', 'mouse_duel', 'pixel_clash', 'roblox_clicker'].includes(modeKey);
    }
    if (cat === 'speed') {
      return ['cyber_sprint', 'quiz_blitz', 'binary_clash'].includes(modeKey);
    }
    if (cat === 'algo') {
      return ['block_coding', 'algo_race_cpp', 'speed_crafting'].includes(modeKey);
    }
    if (cat === 'hardware') {
      return ['circuit_overdrive', 'pc_rush', 'cyber_shield', 'hacker_defense', 'circuit_duel', 'network_racer'].includes(modeKey);
    }
    return true;
  };

  const MODES_CONFIG: {
    key: DuelGameMode;
    titleRo: string;
    titleEn: string;
    badgeRo?: string;
    badgeEn?: string;
    badgeClass?: string;
    subtitleRo: string;
    subtitleEn: string;
    descRo: string;
    descEn: string;
    icon: React.ReactNode;
    iconBg: string;
    selectedGradient: string;
  }[] = [
    {
      key: 'cyber_sprint',
      titleRo: 'Cyber Sprint ⚡',
      titleEn: 'Cyber Sprint ⚡',
      subtitleRo: 'Cursa de Tastare Rapidă',
      subtitleEn: 'Fast Typing Race',
      descRo: 'Cine tastează cel mai repede și corect termenii informatici fără greșeli! Rachetele înaintează live pe ecran.',
      descEn: 'Type computer science terms accurately and fast without errors! Rockets advance live on screen.',
      icon: <Keyboard className="w-4 h-4 text-indigo-300" />,
      iconBg: 'bg-indigo-500/20',
      selectedGradient: 'bg-indigo-950/80 border-indigo-400 ring-2 ring-indigo-500/30 shadow-md',
    },
    {
      key: 'cyber_precision',
      titleRo: 'Cyber Precision 🎯',
      titleEn: 'Cyber Precision 🎯',
      badgeRo: 'NOU 🔥',
      badgeEn: 'NEW 🔥',
      badgeClass: 'bg-cyan-500/20 text-cyan-300',
      subtitleRo: 'AimLab & Osu! TIC 1v1 (Bătălia Reflexelor)',
      subtitleEn: 'AimLab & Osu! TIC 1v1 (High-Reflex Battle)',
      descRo: '6 etape de precizie extremă (Noduri Osu! & Hold, Urmărire Fibră Laser, Sortare Malware, Deflector Kinetic, Flick-Shot & Overclock CPU). Ecran blocat împotriva defilării!',
      descEn: '6 complex precision stages (Osu! Nodes & Hold, Fiber Laser Trace, Malware Triage, Kinetic Deflector, Flick-Shot & Overclock Core). Screen scroll locked for pure accuracy!',
      icon: <Crosshair className="w-4 h-4 text-white" />,
      iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/30',
      selectedGradient: 'bg-gradient-to-br from-cyan-950/90 via-indigo-950/80 to-purple-950/60 border-cyan-400 ring-2 ring-cyan-500/40 shadow-lg',
    },
    {
      key: 'circuit_overdrive',
      titleRo: 'Circuit Overdrive 🔧⚡',
      titleEn: 'Circuit Overdrive 🔧⚡',
      badgeRo: 'NOU 🔥',
      badgeEn: 'HOT 🔥',
      badgeClass: 'bg-amber-500/20 text-amber-300',
      subtitleRo: 'Hardware Placă de Bază & Osciloscop 1v1',
      subtitleEn: 'Motherboard Hardware & Oscilloscope 1v1',
      descRo: '5 etape de înaltă tensiune: Rotiță mouse pentru rotire CPU, Cablare trasee bus, Deflector scântei GND, Panou siguranțe & Sincronizare osciloscop 5.0 GHz!',
      descEn: '5 high-voltage stages: Scroll-to-Rotate CPU alignment, Bus Wire routing, Voltage surge deflector, Breaker switch bank & 5.0 GHz Oscilloscope lock!',
      icon: <Zap className="w-4 h-4 text-white" />,
      iconBg: 'bg-gradient-to-br from-amber-500 to-rose-600 shadow-amber-500/30',
      selectedGradient: 'bg-gradient-to-br from-amber-950/90 via-slate-900 to-rose-950/80 border-amber-400 ring-2 ring-amber-500/40 shadow-lg',
    },
    {
      key: 'speed_crafting',
      titleRo: 'Speed Crafting ⛏️',
      titleEn: 'Speed Crafting ⛏️',
      subtitleRo: 'Duel Rețete TIC & Binar (Minecraft 3x3)',
      subtitleEn: 'ICT & Binary Recipe Duel (Minecraft 3x3)',
      descRo: 'Aranjează componentele pe masa de lucru 3x3 (CPU, RAM, SSD, cod binar, porți logice)! Primul la 5 diamante asamblate câștigă duelul!',
      descEn: 'Arrange components on the 3x3 workbench (CPU, RAM, SSD, binary code, logic gates)! First to assemble 5 diamonds wins the duel!',
      icon: <Boxes className="w-4 h-4 text-amber-300" />,
      iconBg: 'bg-amber-500/20',
      selectedGradient: 'bg-amber-950/80 border-amber-400 ring-2 ring-amber-500/30 shadow-md',
    },
    {
      key: 'block_coding',
      titleRo: 'Cursa Algoritmilor 🧩',
      titleEn: 'Algorithm Race 🧩',
      subtitleRo: 'Block Coding Duel (Tip Scratch)',
      subtitleEn: 'Block Coding Duel (Scratch Style)',
      descRo: 'Asamblează logic scriptul (Start, Mergi în față, Viraje 90°, Repetă de 3 ori) pentru a-l ghida pe Arky prin matrice! Primul care ajunge la destinație fără să lovească un obstacol câștigă runda!',
      descEn: 'Assemble script logic (Start, Move Forward, 90° Turns, Repeat 3 times) to guide Arky across the grid! First to reach target wins!',
      icon: <Puzzle className="w-4 h-4 text-emerald-300" />,
      iconBg: 'bg-emerald-500/20',
      selectedGradient: 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-500/30 shadow-md',
    },
    {
      key: 'roblox_clicker',
      titleRo: 'Roblox Blox Clicker 🟥',
      titleEn: 'Roblox Blox Clicker 🟥',
      badgeRo: 'HOT 🔥',
      badgeEn: 'HOT 🔥',
      badgeClass: 'bg-amber-500/20 text-amber-300',
      subtitleRo: 'Simulator Roblox 1v1 (Pets & Rebirths)',
      subtitleEn: '1v1 Roblox Simulator (Pets & Rebirths)',
      descRo: 'Dă click pe nucleul Blox, eclozează animăluțe legendare din ouă Gacha, cumpără hardware și atinge primul 5.000 Blox înaintea rivalului!',
      descEn: 'Click the Blox core, hatch legendary pets from Gacha eggs, buy hardware and reach 5,000 Blox first!',
      icon: <span className="text-base">🧱</span>,
      iconBg: 'bg-gradient-to-br from-rose-500 to-amber-500 shadow-rose-500/30',
      selectedGradient: 'bg-gradient-to-br from-rose-950/90 via-purple-950/80 to-amber-950/60 border-amber-400 ring-2 ring-amber-500/40 shadow-lg',
    },
    {
      key: 'quiz_blitz',
      titleRo: 'Quiz Blitz 🧠',
      titleEn: 'Quiz Blitz 🧠',
      subtitleRo: 'Bătălia Creierelor TIC',
      subtitleEn: 'ICT Brain Battle',
      descRo: '5 întrebări fulger de hardware, securitate și algoritmi. Punctaj bonus pentru răspunsuri ultrarapide!',
      descEn: '5 lightning questions on hardware, cyber security, and algorithms. Bonus score for rapid answers!',
      icon: <HelpCircle className="w-4 h-4 text-purple-300" />,
      iconBg: 'bg-purple-500/20',
      selectedGradient: 'bg-purple-950/80 border-purple-400 ring-2 ring-purple-500/30 shadow-md',
    },
    {
      key: 'cyber_shield',
      titleRo: 'Cyber Shield 🛡️',
      titleEn: 'Cyber Shield 🛡️',
      subtitleRo: 'Apărare Anti-Phishing 1v1',
      subtitleEn: 'Anti-Phishing 1v1 Defense',
      descRo: 'Analizează email-urile și link-urile primite în timp real! Blochează atacurile hackerilor și permite mesajele sigure.',
      descEn: 'Analyze incoming emails and links in real-time! Block hacker cyber attacks and allow verified safe messages.',
      icon: <ShieldCheck className="w-4 h-4 text-rose-300" />,
      iconBg: 'bg-rose-500/20',
      selectedGradient: 'bg-rose-950/80 border-rose-400 ring-2 ring-rose-500/30 shadow-md',
    },
    {
      key: 'pc_rush',
      titleRo: 'Hardware PC Rush 🔧',
      titleEn: 'Hardware PC Rush 🔧',
      subtitleRo: 'Asamblare PC în Viteză',
      subtitleEn: 'High-Speed PC Assembly',
      descRo: 'Asamblează calculatorul în ordinea corectă pas cu pas (CPU, Cooler, RAM, SSD, GPU, Sursă)! Cine montează primul?',
      descEn: 'Assemble the computer in correct order step by step (CPU, Cooler, RAM, SSD, GPU, PSU)! Who mounts it first?',
      icon: <Cpu className="w-4 h-4 text-cyan-300" />,
      iconBg: 'bg-cyan-500/20',
      selectedGradient: 'bg-cyan-950/80 border-cyan-400 ring-2 ring-cyan-500/30 shadow-md',
    },
    {
      key: 'mouse_duel',
      titleRo: 'Cyber Cursor Clash 🎯',
      titleEn: 'Cyber Cursor Clash 🎯',
      badgeRo: 'NOU ✨',
      badgeEn: 'NEW ✨',
      badgeClass: 'bg-cyan-500/20 text-cyan-300',
      subtitleRo: 'Duel Agilitate Mouse & Touch 1v1',
      subtitleEn: 'Mouse & Touch Agility 1v1 Duel',
      descRo: '7 runde de precizie extremă (Ținte, 2x Click, Urmărire Circuit Laser, Drag & Drop, Scut Deflector, Bouncing Bugs, Overclock Burst). Progres sincronizat în DB la 15, 30, 45, 60, 75, 90, 95, 100%!',
      descEn: '7 precision rounds (Targets, 2x Click, Laser Trace, Drag & Drop, Deflector, Bouncing Bugs, Burst). Safe DB milestones!',
      icon: <span className="text-base">🎯</span>,
      iconBg: 'bg-cyan-500/20',
      selectedGradient: 'bg-gradient-to-br from-cyan-950/90 via-indigo-950/80 to-teal-950/60 border-cyan-400 ring-2 ring-cyan-500/40 shadow-lg',
    },
    {
      key: 'hacker_defense',
      titleRo: 'Hacker vs Defender ⚔️',
      titleEn: 'Hacker vs Defender ⚔️',
      badgeRo: 'NOU ✨',
      badgeEn: 'NEW ✨',
      badgeClass: 'bg-rose-500/20 text-rose-300',
      subtitleRo: 'Atac & Peticire 1v1 (Inversare la 45s)',
      subtitleEn: 'Attack & Patch 1v1 (Role Swap at 45s)',
      descRo: 'Un jucător lansează valuri de Troieni, Phishing și forțare parolă; celălalt activează Firewall, Antivirus sau 2FA. După 45 secunde, rolurile se inversează automat!',
      descEn: 'One player launches Trojans, Phishing and Brute Force; the other activates Firewall, Antivirus or 2FA. Roles swap after 45s!',
      icon: <span className="text-base">🛡️</span>,
      iconBg: 'bg-rose-500/20',
      selectedGradient: 'bg-gradient-to-br from-rose-950/90 via-slate-900 to-emerald-950/80 border-rose-400 ring-2 ring-rose-500/40 shadow-lg',
    },
    {
      key: 'binary_clash',
      titleRo: 'Binary Clash 1v1 🔢',
      titleEn: 'Binary Clash 1v1 🔢',
      badgeRo: 'NOU ✨',
      badgeEn: 'NEW ✨',
      badgeClass: 'bg-emerald-500/20 text-emerald-300',
      subtitleRo: 'Cursa Biților & Conversii Rapide (0/1)',
      subtitleEn: 'Bit Race & Fast Conversions (0/1)',
      descRo: 'Comută comutatoarele de biți (128, 64, 32, 16, 8, 4, 2, 1) pentru a atinge numărul zecimal țintă înaintea rivalului! Folosește porți NOT și multiplicatori.',
      descEn: 'Toggle bit switches (128, 64, 32, 16, 8, 4, 2, 1) to match decimal target before your rival! Use NOT gates and multipliers.',
      icon: <span className="text-base">🔢</span>,
      iconBg: 'bg-emerald-500/20',
      selectedGradient: 'bg-gradient-to-br from-emerald-950/90 via-slate-900 to-cyan-950/80 border-emerald-400 ring-2 ring-emerald-500/40 shadow-lg',
    },
    {
      key: 'circuit_duel',
      titleRo: 'Circuit Clash 1v1 ⚡',
      titleEn: 'Circuit Clash 1v1 ⚡',
      badgeRo: 'NOU ✨',
      badgeEn: 'NEW ✨',
      badgeClass: 'bg-amber-500/20 text-amber-300',
      subtitleRo: 'Cablare Breadboard Arduino & Senzori',
      subtitleEn: 'Arduino Breadboard & Sensors Wiring',
      descRo: 'Conectează contracronometru pini PWM, senzori LDR, ultrasonic HC-SR04, servomotoare SG90 și ecrane LCD I2C fără scurtcircuit!',
      descEn: 'Connect PWM pins, LDR sensors, ultrasonic HC-SR04, SG90 servos, and I2C LCDs against the clock without short circuits!',
      icon: <span className="text-base">⚡</span>,
      iconBg: 'bg-amber-500/20',
      selectedGradient: 'bg-gradient-to-br from-amber-950/90 via-slate-900 to-emerald-950/80 border-amber-400 ring-2 ring-amber-500/40 shadow-lg',
    },
    {
      key: 'algo_race_cpp',
      titleRo: 'C++ Code Racer 1v1 💻',
      titleEn: 'C++ Code Racer 1v1 💻',
      badgeRo: 'NOU ✨',
      badgeEn: 'NEW ✨',
      badgeClass: 'bg-cyan-500/20 text-cyan-300',
      subtitleRo: 'Bătălia Algoritmilor & Depanare C++',
      subtitleEn: 'Algorithms & Fast C++ Debugging',
      descRo: 'Găsește operatorul sau comanda lipsă din codul C++ (regula 3 pahare, while, bucle for Gauss, switch CNP, vectori)! Cine compilează primul fără eroare?',
      descEn: 'Find missing operators and statements in C++ code (swap 3 cups, while loops, Gauss for, switch, arrays)! Who compiles first?',
      icon: <span className="text-base">💻</span>,
      iconBg: 'bg-cyan-500/20',
      selectedGradient: 'bg-gradient-to-br from-cyan-950/90 via-slate-900 to-purple-950/80 border-cyan-400 ring-2 ring-cyan-500/40 shadow-lg',
    },
    {
      key: 'pixel_clash',
      titleRo: 'Pixel Art Clash 1v1 🎨',
      titleEn: 'Pixel Art Clash 1v1 🎨',
      badgeRo: 'NOU ✨',
      badgeEn: 'NEW ✨',
      badgeClass: 'bg-purple-500/20 text-purple-300',
      subtitleRo: 'Grafică Bitmap 8x8 & Culori RGB',
      subtitleEn: '8x8 Bitmap Graphics & RGB Colors',
      descRo: 'Reprodu sprite-urile retro pixel cu pixel (inimă 8-bit, floppy disk, sabie diamant)! Folosește instrumentul Oglindă X și umplerea rapidă.',
      descEn: 'Replicate retro sprites pixel by pixel (8-bit heart, floppy disk, diamond sword)! Use the X-Mirror tool and quick flood fill.',
      icon: <span className="text-base">🎨</span>,
      iconBg: 'bg-purple-500/20',
      selectedGradient: 'bg-gradient-to-br from-purple-950/90 via-slate-900 to-pink-950/80 border-purple-400 ring-2 ring-purple-500/40 shadow-lg',
    },
    {
      key: 'network_racer',
      titleRo: 'Network Packet Racer 1v1 🌐',
      titleEn: 'Network Packet Racer 1v1 🌐',
      badgeRo: 'NOU ✨',
      badgeEn: 'NEW ✨',
      badgeClass: 'bg-indigo-500/20 text-indigo-300',
      subtitleRo: 'Rutare Porturi (443/53/25) & Firewall',
      subtitleEn: 'Port Routing (443/53/25) & Firewall',
      descRo: 'Comută pachetele sosite în router către porturile potrivite (Web HTTPS, DNS, Email) și carantinează atacurile DDoS și virușii în Firewall!',
      descEn: 'Route inbound router packets to appropriate ports (Web HTTPS, DNS, Email) and quarantine DDoS floods and malware into the Firewall!',
      icon: <span className="text-base">🌐</span>,
      iconBg: 'bg-indigo-500/20',
      selectedGradient: 'bg-gradient-to-br from-indigo-950/90 via-slate-900 to-cyan-950/80 border-indigo-400 ring-2 ring-indigo-500/40 shadow-lg',
    },
  ];

  // Active Room State
  const [currentRoom, setCurrentRoom] = useState<DuelRoomData | null>(null);
  const myDeviceId = getDeviceId();
  const isHost = currentRoom ? currentRoom.host.id === myDeviceId : false;
  const isGuest = currentRoom ? currentRoom.guest?.id === myDeviceId : false;

  // Local Gameplay States - Cyber Sprint
  const [typedInput, setTypedInput] = useState('');
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [hasFinishedLocal, setHasFinishedLocal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Local Gameplay States - Quiz Blitz
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<{
    isCorrect: boolean;
    selectedOptionIdx: number;
    correctOptionIdx: number;
    explanationRo: string;
    explanationEn?: string;
    pointsEarned: number;
  } | null>(null);
  const [quizCountdown, setQuizCountdown] = useState<number>(3);
  const quizAnswerLockRef = useRef<boolean>(false);
  const quizTimerRef = useRef<NodeJS.Timeout | null>(null);
  const quizIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Local Gameplay States - Cyber Shield
  const [shieldIndex, setShieldIndex] = useState(0);
  const [shieldScore, setShieldScore] = useState(0);
  const [shieldStreak, setShieldStreak] = useState(0);
  const [shieldFeedback, setShieldFeedback] = useState<{ isCorrect: boolean; explanation: string; action: 'block' | 'allow' } | null>(null);
  const shieldAnswerLockRef = useRef<boolean>(false);
  const shieldTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Local Gameplay States - Hardware PC Rush
  const [assembledParts, setAssembledParts] = useState<string[]>([]);
  const [pcScore, setPcScore] = useState(0);
  const [pcMistake, setPcMistake] = useState<string | null>(null);
  const [pcLockedUntil, setPcLockedUntil] = useState<number>(0);

  // Local Gameplay States - Block Coding Duel (Cursa Algoritmilor)
  const [codingLevelIndex, setCodingLevelIndex] = useState(0);
  const [codingScore, setCodingScore] = useState(0);

  // Countdown timer before match start
  const [countdown, setCountdown] = useState<number | null>(null);

  // Subscribe to Room updates
  useEffect(() => {
    if (!currentRoom?.roomCode) return;

    const unsubscribe = subscribeToDuelRoom(currentRoom.roomCode, (updated) => {
      if (!updated) {
        // Room was closed or deleted
        if (viewState !== 'lobby') {
          setErrorMessage(lang === 'en' ? 'The duel room has been closed.' : 'Camera de duel a fost închisă.');
          setViewState('lobby');
          setCurrentRoom(null);
        }
        return;
      }

      setCurrentRoom(updated);

      // Handle status transitions
      if (updated.status === 'countdown' && viewState === 'room') {
        setCountdown(3);
      } else if (updated.status === 'playing' && viewState !== 'playing' && viewState !== 'results') {
        setViewState('playing');
        setStartTime(Date.now());
        setTimeout(() => inputRef.current?.focus(), 150);
      } else if (updated.status === 'finished' && viewState === 'playing') {
        setViewState('results');
      }
    });

    return () => unsubscribe();
  }, [currentRoom?.roomCode, viewState, lang]);

  // Countdown tick logic
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCountdown(null);
      if (isHost && currentRoom?.roomCode) {
        setRoomPlaying(currentRoom.roomCode);
      }
    }
  }, [countdown, isHost, currentRoom?.roomCode]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (quizTimerRef.current) clearTimeout(quizTimerRef.current);
      if (quizIntervalRef.current) clearInterval(quizIntervalRef.current);
      if (shieldTimerRef.current) clearTimeout(shieldTimerRef.current);
    };
  }, []);

  // Handle Create Room
  const handleCreateRoom = async () => {
    sounds.playClick();
    setIsCreating(true);
    setErrorMessage(null);
    try {
      const room = await createDuelRoom(resolvedStudentName, resolvedAvatar, selectedMode);
      if (room) {
        setCurrentRoom(room);
        setViewState('room');
      } else {
        setErrorMessage(lang === 'en' ? 'Could not create room.' : 'Nu s-a putut crea camera.');
      }
    } catch (err) {
      setErrorMessage(lang === 'en' ? 'Connection error.' : 'Eroare de conexiune.');
    } finally {
      setIsCreating(false);
    }
  };

  // Handle Join Room
  const handleJoinRoom = async () => {
    sounds.playClick();
    if (!inputRoomCode.trim()) {
      setErrorMessage(lang === 'en' ? 'Please enter a 4-letter room code!' : 'Introdu codul camerei (ex: AB12)!');
      return;
    }
    setIsJoining(true);
    setErrorMessage(null);
    try {
      const res = await joinDuelRoom(inputRoomCode, resolvedStudentName, resolvedAvatar);
      if (res.success && res.room) {
        setCurrentRoom(res.room);
        setViewState('room');
      } else {
        setErrorMessage(res.error || (lang === 'en' ? 'Room not found.' : 'Camera nu a fost găsită.'));
      }
    } catch (err) {
      setErrorMessage(lang === 'en' ? 'Connection error.' : 'Eroare de conexiune.');
    } finally {
      setIsJoining(false);
    }
  };

  // Handle Copy Room Code
  const handleCopyCode = () => {
    if (currentRoom?.roomCode) {
      navigator.clipboard.writeText(currentRoom.roomCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Cyber Sprint Typing Logic
  const words = ((lang === 'en' && currentRoom?.textSnippetEn ? currentRoom.textSnippetEn : currentRoom?.textSnippet) || (lang === 'en' ? 'Cyber security and interactive computer programming' : 'Securitate cibernetica si programare interactiva')).split(' ');

  const handleTypingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (viewState !== 'playing' || hasFinishedLocal || !currentRoom) return;

    const val = e.target.value;
    const targetWord = words[currentWordIdx] || '';

    // If user hit space or finished last word
    if (val.endsWith(' ') || (currentWordIdx === words.length - 1 && val === targetWord)) {
      const trimmed = val.trim();
      if (trimmed === targetWord) {
        sounds.playCorrect();
        const nextIdx = currentWordIdx + 1;
        setCurrentWordIdx(nextIdx);
        setTypedInput('');

        const progressPercent = Math.min(100, Math.round((nextIdx / words.length) * 100));
        const currentScore = nextIdx * 25;

        // Calculate real-time WPM
        if (startTime) {
          const minutes = (Date.now() - startTime) / 60000;
          if (minutes > 0) {
            setWpm(Math.round(nextIdx / minutes));
          }
        }

        if (nextIdx >= words.length) {
          // Finished the race!
          sounds.playVictory();
          setHasFinishedLocal(true);
          const finalScore = currentScore + 100;
          const myName = isHost ? currentRoom.host.name : (currentRoom.guest?.name || 'Elev');
          const myId = isHost ? currentRoom.host.id : currentRoom.guest?.id;

          updateDuelProgress(
            currentRoom.roomCode,
            isHost,
            { progress: 100, score: finalScore, finishedAt: Date.now() },
            myId,
            myName
          );

          recordStudentDuelResult(true, 'cyber_sprint', finalScore);

          if (onAwardXP) {
            onAwardXP(200, 'Victorie în Duelul Cyber Sprint 1v1!');
          }
        } else {
          // Update live progress only on 25% milestone steps to save Firestore quota
          const prevProgress = Math.round(((nextIdx - 1) / words.length) * 100);
          const crossedMilestone = Math.floor(progressPercent / 25) > Math.floor(prevProgress / 25);
          if (crossedMilestone) {
            updateDuelProgress(currentRoom.roomCode, isHost, {
              progress: progressPercent,
              score: currentScore,
              currentWordIndex: nextIdx
            });
          }
        }
        return;
      }
    }

    setTypedInput(val);
  };

  // Quiz Blitz Logic
  const currentQuestions = currentRoom?.questions || [];
  const currentQ = currentQuestions[currentQIndex];

  // Advance to next quiz question cleanly
  const advanceToNextQuizQuestion = (scoreToRecord?: number) => {
    if (quizTimerRef.current) {
      clearTimeout(quizTimerRef.current);
      quizTimerRef.current = null;
    }
    if (quizIntervalRef.current) {
      clearInterval(quizIntervalRef.current);
      quizIntervalRef.current = null;
    }

    setQuizFeedback(null);
    setSelectedAnswer(null);
    quizAnswerLockRef.current = false;

    const finalScore = typeof scoreToRecord === 'number' ? scoreToRecord : quizScore;
    const nextQIdx = currentQIndex + 1;
    const progressPercent = Math.min(100, Math.round((nextQIdx / currentQuestions.length) * 100));

    if (nextQIdx >= currentQuestions.length) {
      // Finished all questions
      sounds.playVictory();
      setHasFinishedLocal(true);
      const myName = isHost ? currentRoom?.host.name : (currentRoom?.guest?.name || 'Elev');
      const myId = isHost ? currentRoom?.host.id : currentRoom?.guest?.id;

      if (currentRoom) {
        updateDuelProgress(
          currentRoom.roomCode,
          isHost,
          { progress: 100, score: finalScore, finishedAt: Date.now() },
          myId,
          myName
        );
      }

      recordStudentDuelResult(true, 'quiz_blitz', finalScore);

      if (onAwardXP) {
        onAwardXP(250, lang === 'en' ? 'Champions in 1v1 TIC Quiz Blitz!' : 'Campioni în Quiz Blitz 1v1 TIC!');
      }
    } else {
      setCurrentQIndex(nextQIdx);
      if (currentRoom) {
        updateDuelProgress(currentRoom.roomCode, isHost, {
          progress: progressPercent,
          score: finalScore,
          currentQuestionIndex: nextQIdx
        });
      }
    }
  };

  const handleQuizAnswer = (optionIdx: number) => {
    // STRICT LOCK: Never allow re-selecting or rapid spamming
    if (quizAnswerLockRef.current || selectedAnswer !== null || !currentQ || !currentRoom || hasFinishedLocal) return;
    quizAnswerLockRef.current = true;

    setSelectedAnswer(optionIdx);
    const isCorrect = optionIdx === currentQ.correctIndex;

    if (isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }

    const newStreak = isCorrect ? streak + 1 : 0;
    setStreak(newStreak);

    // Wrong answer gets strictly 0 points; correct gets 100 + streak bonus
    const pointsEarned = isCorrect ? 100 + newStreak * 25 : 0;
    const newScore = quizScore + pointsEarned;
    setQuizScore(newScore);

    // Set feedback for explanation display
    setQuizFeedback({
      isCorrect,
      selectedOptionIdx: optionIdx,
      correctOptionIdx: currentQ.correctIndex,
      explanationRo: currentQ.explanation,
      explanationEn: currentQ.explanationEn || currentQ.explanation,
      pointsEarned
    });

    // Start 3-second countdown to read pedagogical explanation
    setQuizCountdown(3);
    let remaining = 3;
    if (quizIntervalRef.current) clearInterval(quizIntervalRef.current);
    quizIntervalRef.current = setInterval(() => {
      remaining -= 1;
      setQuizCountdown(Math.max(0, remaining));
      if (remaining <= 0 && quizIntervalRef.current) {
        clearInterval(quizIntervalRef.current);
      }
    }, 1000);

    if (quizTimerRef.current) clearTimeout(quizTimerRef.current);
    quizTimerRef.current = setTimeout(() => {
      advanceToNextQuizQuestion(newScore);
    }, 3200);
  };

  // Cyber Shield Logic (Phishing/Threats defense)
  const shieldItems: CyberShieldItem[] = currentRoom?.shieldItems || [];
  const currentShieldItem = shieldItems[shieldIndex];

  const advanceToNextShieldItem = (scoreToRecord?: number) => {
    if (shieldTimerRef.current) {
      clearTimeout(shieldTimerRef.current);
      shieldTimerRef.current = null;
    }
    setShieldFeedback(null);
    shieldAnswerLockRef.current = false;

    const finalScore = typeof scoreToRecord === 'number' ? scoreToRecord : shieldScore;
    const nextShieldIdx = shieldIndex + 1;
    const progressPercent = Math.min(100, Math.round((nextShieldIdx / shieldItems.length) * 100));

    if (nextShieldIdx >= shieldItems.length) {
      sounds.playVictory();
      setHasFinishedLocal(true);
      const myName = isHost ? currentRoom?.host.name : (currentRoom?.guest?.name || 'Elev');
      const myId = isHost ? currentRoom?.host.id : currentRoom?.guest?.id;

      if (currentRoom) {
        updateDuelProgress(
          currentRoom.roomCode,
          isHost,
          { progress: 100, score: finalScore, finishedAt: Date.now() },
          myId,
          myName
        );
      }

      recordStudentDuelResult(true, 'cyber_shield', finalScore);

      if (onAwardXP) {
        onAwardXP(300, lang === 'en' ? 'Impenetrable Shield in Cyber Shield 1v1!' : 'Scut Impenetrabil în Cyber Shield 1v1!');
      }
    } else {
      setShieldIndex(nextShieldIdx);
      if (currentRoom) {
        updateDuelProgress(currentRoom.roomCode, isHost, {
          progress: progressPercent,
          score: finalScore,
          currentStageIndex: nextShieldIdx
        });
      }
    }
  };

  const handleShieldDecision = (action: 'block' | 'allow') => {
    if (shieldAnswerLockRef.current || !currentShieldItem || shieldFeedback !== null || hasFinishedLocal || !currentRoom) return;
    shieldAnswerLockRef.current = true;

    const isCorrect = (currentShieldItem.isThreat && action === 'block') || (!currentShieldItem.isThreat && action === 'allow');

    if (isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }

    const newStreak = isCorrect ? shieldStreak + 1 : 0;
    setShieldStreak(newStreak);

    const pointsGained = isCorrect ? 150 + newStreak * 30 : 0;
    const newScore = shieldScore + pointsGained;
    setShieldScore(newScore);

    setShieldFeedback({
      isCorrect,
      explanation: currentShieldItem.explanation,
      action
    });

    if (shieldTimerRef.current) clearTimeout(shieldTimerRef.current);
    shieldTimerRef.current = setTimeout(() => {
      advanceToNextShieldItem(newScore);
    }, 2800);
  };

  // Hardware PC Rush Logic (Sequential PC Building conveyor)
  const pcParts: PCRushPart[] = currentRoom?.pcPartsOrder || [];
  const expectedStep = assembledParts.length + 1;
  const currentExpectedPart = pcParts.find((p) => p.stepOrder === expectedStep);

  const handleAssemblePart = (part: PCRushPart) => {
    if (pcLockedUntil > Date.now() || assembledParts.includes(part.id) || hasFinishedLocal || !currentRoom) return;

    if (part.stepOrder === expectedStep) {
      // Correct sequence
      sounds.playCorrect();
      setPcMistake(null);
      const updatedAssembled = [...assembledParts, part.id];
      setAssembledParts(updatedAssembled);

      const newScore = pcScore + 150;
      setPcScore(newScore);

      const progressPercent = Math.min(100, Math.round((updatedAssembled.length / pcParts.length) * 100));

      if (updatedAssembled.length >= pcParts.length) {
        // Assembled full computer!
        sounds.playVictory();
        setHasFinishedLocal(true);
        const finalScore = newScore + 100;
        const myName = isHost ? currentRoom.host.name : (currentRoom.guest?.name || 'Elev');
        const myId = isHost ? currentRoom.host.id : currentRoom.guest?.id;

        updateDuelProgress(
          currentRoom.roomCode,
          isHost,
          { progress: 100, score: finalScore, finishedAt: Date.now() },
          myId,
          myName
        );

        recordStudentDuelResult(true, 'pc_rush', finalScore);

        if (onAwardXP) {
          onAwardXP(350, lang === 'en' ? 'Lightning PC Assembly in Hardware PC Rush 1v1!' : 'Asamblare PC Fulger în Hardware PC Rush 1v1!');
        }
      } else {
        updateDuelProgress(currentRoom.roomCode, isHost, {
          progress: progressPercent,
          score: newScore,
          currentStageIndex: updatedAssembled.length
        });
      }
    } else {
      // Mistake: Wrong assembly order! Lock out spam clicking for 1.8s
      sounds.playWrong();
      setPcLockedUntil(Date.now() + 1800);
      setPcMistake(lang === 'en'
        ? `Mistake! Before "${part.name}", you must mount "${currentExpectedPart?.name}"! (Locked 1.8s)`
        : `Greșit! Înainte de "${part.name}", trebuie să montezi "${currentExpectedPart?.name}"! (Penalizare 1.8s)`);
      setTimeout(() => {
        setPcMistake(null);
      }, 1800);
    }
  };

  // Block Coding Duel Handlers
  const codingChallenges: BlockCodingChallenge[] = currentRoom?.codingChallenges || [];

  const handleBlockCodingLevelComplete = (pointsEarned: number, nextLevelIndex: number) => {
    if (!currentRoom || hasFinishedLocal) return;
    const newScore = codingScore + pointsEarned;
    setCodingScore(newScore);
    setCodingLevelIndex(nextLevelIndex);
    const totalCount = codingChallenges.length || 4;
    const progressPercent = Math.min(100, Math.round((nextLevelIndex / totalCount) * 100));
    updateDuelProgress(currentRoom.roomCode, isHost, {
      progress: progressPercent,
      score: newScore,
      currentStageIndex: nextLevelIndex
    });
  };

  const handleBlockCodingFinish = (finalScore: number) => {
    if (!currentRoom || hasFinishedLocal) return;
    setHasFinishedLocal(true);
    setCodingScore(finalScore);
    const myName = isHost ? currentRoom.host.name : (currentRoom.guest?.name || 'Elev');
    const myId = isHost ? currentRoom.host.id : currentRoom.guest?.id;

    updateDuelProgress(
      currentRoom.roomCode,
      isHost,
      { progress: 100, score: finalScore, finishedAt: Date.now() },
      myId,
      myName
    );

    recordStudentDuelResult(true, 'block_coding', finalScore);

    if (onAwardXP) {
      onAwardXP(350, 'Maestru în Cursa Algoritmilor 1v1 (Scratch)!');
    }
  };

  const handleSpeedCraftingFinish = () => {
    if (!currentRoom || hasFinishedLocal) return;
    setHasFinishedLocal(true);
    const finalScore = 500;
    const myName = isHost ? currentRoom.host.name : (currentRoom.guest?.name || 'Elev');
    const myId = isHost ? currentRoom.host.id : currentRoom.guest?.id;

    updateDuelProgress(
      currentRoom.roomCode,
      isHost,
      { progress: 100, score: finalScore, finishedAt: Date.now() },
      myId,
      myName
    );

    recordStudentDuelResult(true, 'speed_crafting', finalScore);

    if (onAwardXP) {
      onAwardXP(400, 'Campion în Speed Crafting Duel 1v1 (Minecraft TIC)!');
    }
  };

  const handleRobloxClickerFinish = (finalScore: number) => {
    if (!currentRoom || hasFinishedLocal) return;
    setHasFinishedLocal(true);
    const myName = isHost ? currentRoom.host.name : (currentRoom.guest?.name || 'Elev');
    const myId = isHost ? currentRoom.host.id : currentRoom.guest?.id;

    updateDuelProgress(
      currentRoom.roomCode,
      isHost,
      { progress: 100, score: finalScore, finishedAt: Date.now() },
      myId,
      myName
    );

    // Max 1000 XP cap for duel victory
    const awardedDuelXP = Math.min(1000, 600);
    recordStudentDuelResult(true, 'roblox_clicker', awardedDuelXP);

    if (onAwardXP) {
      onAwardXP(awardedDuelXP, 'Maestru în Roblox Cyber Blox Duel 1v1 (5.000 Blox)!');
    }
  };

  // Determine opponent and me
  const me: DuelPlayer | null = isHost ? currentRoom?.host || null : (currentRoom?.guest || null);
  const opponent: DuelPlayer | null = isHost ? currentRoom?.guest || null : (currentRoom?.host || null);

  const isMeWinner = currentRoom?.winnerId === me?.id;
  const isOpponentWinner = currentRoom?.winnerId === opponent?.id;

  const getModeTitle = (mode?: DuelGameMode) => {
    if (lang === 'en') {
      switch (mode) {
        case 'roblox_clicker':
          return '🟥 Roblox Blox Clicker (1v1 Simulator)';
        case 'cyber_sprint':
          return '⚡ Cyber Sprint (Typing Race)';
        case 'cyber_precision':
          return '🎯 Cyber Precision Arena (AimLab & Osu! 1v1)';
        case 'circuit_overdrive':
          return '🔧 Circuit Overdrive (Server Hardware 1v1)';
        case 'block_coding':
          return '🧩 Algorithm Race (Block Coding Duel)';
        case 'speed_crafting':
          return '⛏️ Speed Crafting Duel (Minecraft ICT 1v1)';
        case 'quiz_blitz':
          return '🧠 Quiz Blitz (Battle of the Minds)';
        case 'cyber_shield':
          return '🛡️ Cyber Shield (Phishing Defense)';
        case 'pc_rush':
          return '🔧 Hardware PC Rush (Speed PC Assembly)';
        case 'mouse_duel':
          return '🎯 Cyber Cursor Clash (Mouse Agility Duel 1v1)';
        case 'hacker_defense':
          return '🛡️⚔️ Hacker vs Defender (Attack & Patch 1v1)';
        case 'binary_clash':
          return '🔢 Binary Clash (Bit Race & Conversions 1v1)';
        case 'circuit_duel':
          return '⚡ Circuit Clash (Smart City Electricians 1v1)';
        case 'algo_race_cpp':
          return '💻 C++ Code Racer (Fast Compiler Duel 1v1)';
        case 'pixel_clash':
          return '🎨 Pixel Art Sprite Clash (Digital Graphics 1v1)';
        case 'network_racer':
          return '🌐 Network Packet Racer (Packets & Switch 1v1)';
        default:
          return '⚔️ ICT 1v1 Duel';
      }
    }
    switch (mode) {
      case 'roblox_clicker':
        return '🟥 Roblox Blox Clicker (Simulator 1v1)';
      case 'cyber_sprint':
        return '⚡ Cyber Sprint (Cursă Tastare)';
      case 'cyber_precision':
        return '🎯 Cyber Precision Arena (AimLab & Osu! TIC 1v1)';
      case 'circuit_overdrive':
        return '🔧 Circuit Overdrive (Hardware Server 1v1)';
      case 'block_coding':
        return '🧩 Cursa Algoritmilor (Block Coding Duel)';
      case 'speed_crafting':
        return '⛏️ Speed Crafting Duel (Minecraft TIC 1v1)';
      case 'quiz_blitz':
        return '🧠 Quiz Blitz (Bătălia Creierelor)';
      case 'cyber_shield':
        return '🛡️ Cyber Shield (Apărare Phishing)';
      case 'pc_rush':
        return '🔧 Hardware PC Rush (Asamblare)';
      case 'mouse_duel':
        return '🎯 Cyber Cursor Clash (Duelul Maeștrilor Mouse-ului 1v1)';
      case 'hacker_defense':
        return '🛡️⚔️ Hacker vs Defender (Atac & Peticire 1v1)';
      case 'binary_clash':
        return '🔢 Binary Clash (Cursa Biților & Conversii 1v1)';
      case 'circuit_duel':
        return '⚡ Circuit Clash (Duelul Electricienilor Smart City 1v1)';
      case 'algo_race_cpp':
        return '💻 C++ Code Racer (Duelul Compilatorului Rapid 1v1)';
      case 'pixel_clash':
        return '🎨 Pixel Art Sprite Clash (Duelul Graficii 1v1)';
      case 'network_racer':
        return '🌐 Network Packet Racer (Cursa Pachetelor & Switch 1v1)';
      default:
        return '⚔️ Duel 1v1 TIC';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 select-none font-sans">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-4 mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/30 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20 ring-2 ring-amber-400/30">
            <Swords className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight font-heading">
                {lang === 'en' ? 'ARKYEDU DUEL ARENA 1v1' : 'ARENA DUELURILOR TIC 1v1'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-black border border-rose-500/40 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Cloud Sync
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {lang === 'en'
                ? 'Challenge your classmate in real-time from different computers!'
                : 'Provoacă-ți colegul de bancă sau din laborator la duel de pe calculatoare diferite!'}
            </p>
          </div>
        </div>

        {handleBack && (
          <button
            onClick={() => {
              sounds.playClick();
              if (currentRoom?.roomCode) {
                leaveDuelRoom(currentRoom.roomCode, isHost);
              }
              handleBack();
            }}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 border border-slate-700 hover:border-rose-500 text-slate-300 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">{lang === 'en' ? 'Back to Courses' : 'Înapoi la Cursuri'}</span>
          </button>
        )}
      </div>

      {/* VIEW 1: LOBBY (Create / Join) */}
      {viewState === 'lobby' && (
        <>
          {/* Mobile Tab Switcher (Create vs Join with Code) */}
          <div className="lg:hidden flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-4 shadow-lg">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setMobileLobbyTab('create');
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                mobileLobbyTab === 'create'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>{lang === 'en' ? '1. Host a Duel (16 Modes)' : '1. Alege & Creează Meci'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setMobileLobbyTab('join');
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                mobileLobbyTab === 'join'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{lang === 'en' ? '2. Join with Code' : '2. Intră cu Cod'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Game Mode Selection Column */}
            <div className={`lg:col-span-7 space-y-4 ${mobileLobbyTab === 'join' ? 'hidden lg:block' : 'block'}`}>
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
                {/* Prominent Top Quick-Action Hero (Instant Create without scrolling) */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/90 via-indigo-950/80 to-slate-900 border-2 border-purple-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3.5 mb-5">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-11 h-11 rounded-xl bg-purple-600/30 border border-purple-400/50 flex items-center justify-center text-xl shrink-0 shadow-inner">
                      🎯
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono text-purple-300 font-bold uppercase tracking-wider block">
                        {lang === 'en' ? 'Selected Battle Mode:' : 'Mod de Duel Selectat:'}
                      </span>
                      <h4 className="text-sm sm:text-base font-black text-white truncate">
                        {getModeTitle(selectedMode)}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleCreateRoom}
                      disabled={isCreating}
                      className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isCreating ? (lang === 'en' ? 'Creating...' : 'Se creează...') : (lang === 'en' ? 'Create Duel Room 🚀' : 'Creează Cameră Acum 🚀')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setMobileLobbyTab('join');
                        setTimeout(() => {
                          joinBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 50);
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                      title={lang === 'en' ? 'Jump to Join Room with code' : 'Sari direct la conectare cu cod'}
                    >
                      <Users className="w-4 h-4" />
                      <span className="hidden sm:inline">{lang === 'en' ? 'Enter Code' : 'Am un Cod'}</span>
                    </button>
                  </div>
                </div>

                {/* Category Filter Pills (Avoid infinite scrolling) */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-4">
                  <span className="text-[11px] font-mono font-bold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
                    <Filter className="w-3.5 h-3.5 text-cyan-400" />
                    {lang === 'en' ? 'Filter:' : 'Filtru:'}
                  </span>
                  {[
                    { id: 'all', labelRo: 'Toate (16)', labelEn: 'All (16)' },
                    { id: 'precision', labelRo: '🎯 Precizie & Mouse (4)', labelEn: '🎯 Precision & Mouse (4)' },
                    { id: 'speed', labelRo: '⚡ Viteză & Reacție (3)', labelEn: '⚡ Speed & Typing (3)' },
                    { id: 'algo', labelRo: '🧠 Algoritmi & Logică (3)', labelEn: '🧠 Algorithms & Logic (3)' },
                    { id: 'hardware', labelRo: '🔧 Hardware & Securitate (6)', labelEn: '🔧 Hardware & Cyber (6)' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setActiveCategory(cat.id as any);
                        sounds.playClick();
                      }}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold whitespace-nowrap transition cursor-pointer ${
                        activeCategory === cat.id
                          ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                          : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {lang === 'en' ? cat.labelEn : cat.labelRo}
                    </button>
                  ))}
                </div>

                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  {lang === 'en' ? '1. Select Duel Battle Mode:' : '1. Alege Tipul de Duel:'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MODES_CONFIG.filter((m) => isModeInCategory(m.key, activeCategory)).map((mode) => {
                    const isSelected = selectedMode === mode.key;
                    return (
                      <button
                        key={mode.key}
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setSelectedMode(mode.key);
                        }}
                        className={`p-4 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                          isSelected
                            ? mode.selectedGradient
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2.5 mb-2">
                            <div className={`w-8 h-8 rounded-lg ${mode.iconBg} flex items-center justify-center shrink-0 shadow-md`}>
                              {mode.icon}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-black text-white flex items-center gap-1.5 flex-wrap">
                                <span>{lang === 'en' ? mode.titleEn : mode.titleRo}</span>
                                {mode.badgeRo && (
                                  <span className={`px-1.5 py-0.2 rounded ${mode.badgeClass || 'bg-purple-500/20 text-purple-300'} text-[9px] font-mono uppercase font-black`}>
                                    {lang === 'en' ? mode.badgeEn : mode.badgeRo}
                                  </span>
                                )}
                              </h4>
                              <span className={`text-[10px] font-medium block truncate ${isSelected ? 'text-indigo-200 font-semibold' : 'text-slate-400'}`}>
                                {lang === 'en' ? mode.subtitleEn : mode.subtitleRo}
                              </span>
                            </div>
                          </div>
                          <p className={`text-xs leading-relaxed ${isSelected ? 'text-slate-200' : 'text-slate-400'}`}>
                            {lang === 'en' ? mode.descEn : mode.descRo}
                          </p>
                        </div>

                        {/* Instant Action on Selected Card */}
                        {isSelected && (
                          <div className="mt-3 pt-2.5 border-t border-purple-500/30 flex items-center justify-between gap-2 animate-fadeIn">
                            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {lang === 'en' ? 'Selected' : 'Selectat'}
                            </span>
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCreateRoom();
                              }}
                              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-black text-xs shadow-md flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>{lang === 'en' ? 'Create Room 🚀' : 'Creează Cameră 🚀'}</span>
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Host / Create Button */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl ring-2 ring-purple-500/50">
                      {currentStudentAvatar || '⚡'}
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">{lang === 'en' ? 'Playing as:' : 'Joci ca:'}</span>
                      <span className="text-sm font-bold text-white">{currentStudentName || (lang === 'en' ? 'ICT Champion' : 'Campion TIC')}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCreateRoom}
                    disabled={isCreating}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black text-sm tracking-wide shadow-lg shadow-indigo-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isCreating
                      ? (lang === 'en' ? 'Creating Room...' : 'Se creează camera...')
                      : (lang === 'en' ? 'Create Duel Room (Host)' : 'Creează Cameră de Meci')}
                  </button>
                </div>
              </div>

              {/* Error Banner if any */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2 animate-shake">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Join Room Box */}
            <div
              ref={joinBoxRef}
              className={`lg:col-span-5 space-y-4 ${mobileLobbyTab === 'create' ? 'hidden lg:block' : 'block'}`}
            >
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col justify-between h-full">
                <div>
                  {mobileLobbyTab === 'join' && (
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setMobileLobbyTab('create');
                      }}
                      className="lg:hidden w-full mb-3 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? '← Back to Mode Selection (16 Modes)' : '← Înapoi la Lista de Dueluri (16 Moduri)'}</span>
                    </button>
                  )}

                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    {lang === 'en' ? '2. Or Join an Existing Duel:' : '2. Sau Conectează-te la un Coleg:'}
                  </h3>
                  <p className="text-xs text-slate-400 mb-5">
                    {lang === 'en'
                      ? 'Ask your classmate for their 4-character room code and enter the arena directly!'
                      : 'Cere-i colegului de bancă codul camerei create de el (4 caractere) și intră direct în arenă!'}
                  </p>

                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-slate-400">
                      {lang === 'en' ? 'Room Code (e.g., 8X4B):' : 'Cod Cameră (Ex: 8X4B):'}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={6}
                        value={inputRoomCode}
                        onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                        placeholder="ABCD"
                        className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border-2 border-indigo-500/40 focus:border-indigo-400 text-center font-mono text-2xl font-black text-amber-300 tracking-widest placeholder-slate-600 outline-none uppercase transition-all shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={handleJoinRoom}
                    disabled={isJoining || !inputRoomCode.trim()}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-sm tracking-wide shadow-lg shadow-cyan-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    {isJoining
                      ? (lang === 'en' ? 'Connecting...' : 'Se conectează...')
                      : (lang === 'en' ? 'Join Duel Match' : 'Intră în Meci')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Mobile Bottom Action Bar (Pinned for instant 1-tap room creation) */}
          {mobileLobbyTab === 'create' && (
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-purple-500/50 p-3 backdrop-blur-md shadow-[0_-5px_25px_rgba(0,0,0,0.6)] flex items-center justify-between gap-2.5 animate-fadeIn">
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-mono text-purple-300 font-bold uppercase block truncate">
                  {lang === 'en' ? 'Ready to duel:' : 'Gata de meci:'}
                </span>
                <span className="text-xs font-black text-white truncate block">
                  {getModeTitle(selectedMode)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCreateRoom}
                disabled={isCreating}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white font-black text-xs shadow-lg shadow-indigo-500/30 flex items-center gap-1.5 active:scale-95 disabled:opacity-50 shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isCreating ? '...' : (lang === 'en' ? 'Create (Host) 🚀' : 'Creează Cameră 🚀')}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setMobileLobbyTab('join');
                  setTimeout(() => {
                    joinBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 50);
                }}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white font-bold text-xs flex items-center gap-1 border border-slate-700 shrink-0 cursor-pointer"
                title={lang === 'en' ? 'Join with code' : 'Intră cu cod'}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Code' : 'Cod'}</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* VIEW 2: ROOM LOBBY (Waiting for 2nd Player / Countdown) */}
      {viewState === 'room' && currentRoom && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/95 border border-purple-500/40 shadow-2xl relative overflow-hidden">
          {/* Animated Background Glow */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Countdown Overlay if triggered */}
          {countdown !== null && (
            <div className="absolute inset-0 bg-slate-950/90 z-30 flex flex-col items-center justify-center backdrop-blur-md animate-fadeIn">
              <span className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-2">
                {lang === 'en' ? 'Duel starts in:' : 'Meciul începe în:'}
              </span>
              <div className="text-7xl font-black text-amber-400 font-mono animate-bounce drop-shadow-[0_0_25px_rgba(251,191,36,0.6)]">
                {countdown === 0 ? 'START! 🚀' : countdown}
              </div>
              <p className="text-xs text-slate-400 mt-4">
                {lang === 'en' ? 'Get ready for victory!' : 'Pregătește-te pentru victorie!'}
              </p>
            </div>
          )}

          {/* Header with Room Code */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {getModeTitle(currentRoom.mode)}
              </span>
              <h3 className="text-2xl font-black text-white">
                {lang === 'en' ? '1v1 Match Preparation Lobby' : 'Lobby Pregătire Meci 1v1'}
              </h3>
            </div>

            {/* Room Code Display Badge */}
            <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-2xl border-2 border-indigo-500/60 shadow-lg">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block text-right">
                  {lang === 'en' ? 'Room Code:' : 'Cod Cameră:'}
                </span>
                <span className="font-mono text-2xl font-black text-amber-300 tracking-widest">{currentRoom.roomCode}</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="p-2 rounded-xl bg-indigo-900/60 hover:bg-indigo-800 border border-indigo-500/50 text-indigo-200 transition-all cursor-pointer"
                title={lang === 'en' ? 'Copy code' : 'Copiază codul'}
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 1v1 Versus Cards */}
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center my-8">
            {/* Host Card */}
            <div className="md:col-span-5 p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border-2 border-indigo-500/40 flex items-center gap-4 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-400/50 flex items-center justify-center text-3xl shadow-md">
                {currentRoom.host.avatar || '⚡'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                    {lang === 'en' ? 'Host' : 'Gazdă'}
                  </span>
                  {currentRoom.host.id === myDeviceId && (
                    <span className="text-[10px] text-amber-400 font-bold">{lang === 'en' ? '(You)' : '(Tu)'}</span>
                  )}
                </div>
                <h4 className="text-lg font-black text-white truncate">{currentRoom.host.name}</h4>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {lang === 'en' ? 'Ready for Battle' : 'Pregătit de Luptă'}
                </div>
              </div>
            </div>

            {/* VS Badge */}
            <div className="md:col-span-1 flex justify-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-xl ring-4 ring-slate-900">
                VS
              </div>
            </div>

            {/* Guest Card */}
            <div className={`md:col-span-5 p-5 rounded-2xl border-2 flex items-center gap-4 shadow-xl transition-all ${
              currentRoom.guest
                ? 'bg-gradient-to-br from-cyan-950/60 to-slate-900 border-cyan-500/40'
                : 'bg-slate-950/40 border-dashed border-slate-800 text-slate-500'
            }`}>
              {currentRoom.guest ? (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-cyan-600/30 border border-cyan-400/50 flex items-center justify-center text-3xl shadow-md">
                    {currentRoom.guest.avatar || '🚀'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                        {lang === 'en' ? 'Guest' : 'Oaspete'}
                      </span>
                      {currentRoom.guest.id === myDeviceId && (
                        <span className="text-[10px] text-amber-400 font-bold">{lang === 'en' ? '(You)' : '(Tu)'}</span>
                      )}
                    </div>
                    <h4 className="text-lg font-black text-white truncate">{currentRoom.guest.name}</h4>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {lang === 'en' ? 'Connected' : 'Conectat'}
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-4 text-center w-full">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center mb-2 animate-bounce">
                    <Wifi className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-xs font-semibold text-slate-400">
                    {lang === 'en' ? 'Waiting for classmate to connect...' : 'Se așteaptă conectarea colegului...'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {lang === 'en' ? 'Tell your classmate to enter code:' : 'Spune-i colegului să introducă codul:'}{' '}
                    <span className="font-mono text-amber-400 font-bold">{currentRoom.roomCode}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                sounds.playClick();
                leaveDuelRoom(currentRoom.roomCode, isHost);
                setCurrentRoom(null);
                setViewState('lobby');
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              {lang === 'en' ? 'Cancel / Leave Room' : 'Anulează / Ieși din Cameră'}
            </button>

            {isHost ? (
              <button
                onClick={() => startDuelMatch(currentRoom.roomCode)}
                disabled={!currentRoom.guest}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-sm tracking-wider shadow-xl shadow-emerald-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
              >
                <Play className="w-4 h-4 fill-white" />
                {currentRoom.guest
                  ? (lang === 'en' ? 'START DUEL NOW 🚀' : 'START DUEL ACUM 🚀')
                  : (lang === 'en' ? 'Waiting for opponent...' : 'Se așteaptă oponentul...')}
              </button>
            ) : (
              <div className="text-xs text-indigo-300 font-semibold bg-indigo-950/60 px-4 py-2.5 rounded-xl border border-indigo-500/30 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                {lang === 'en'
                  ? 'The room host will start the match in a few moments...'
                  : 'Gazda camerei va porni meciul în câteva momente...'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: ACTIVE PLAYING DUEL */}
      {viewState === 'playing' && currentRoom && (
        <div className="space-y-6">
          <UnloggedNoticeBadge studentName={resolvedStudentName} onNavigateToAuth={onBack} />
          {/* Live Progress Bar (Race Track) */}
          <div className="p-5 rounded-2xl bg-slate-900/95 border border-purple-500/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Flame className="w-4 h-4" />
                {lang === 'en' ? 'Live Match Track (Real-time Cloud Sync)' : 'Pistă Live de Concurs (Sincronizare în Timp Real)'}
              </span>
              <span>{currentRoom.mode === 'cyber_sprint' ? (lang === 'en' ? `${wpm} WPM (Speed)` : `${wpm} WPM (Viteză)`) : (lang === 'en' ? `Score: ${me?.score || 0} pts` : `Scor: ${me?.score || 0} pts`)}</span>
            </div>

            {/* Track 1: Me */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-indigo-300 flex items-center gap-1">
                  <span>{me?.avatar}</span> {me?.name} {lang === 'en' ? '(You)' : '(Tu)'}
                </span>
                <span className="font-mono text-indigo-200">{me?.progress || 0}%</span>
              </div>
              <div className="h-6 w-full rounded-full bg-slate-950 p-1 border border-indigo-500/40 relative overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-purple-500 to-cyan-400 transition-all duration-300 flex items-center justify-end pr-1"
                  style={{ width: `${Math.max(5, me?.progress || 0)}%` }}
                >
                  <span className="text-xs">🚀</span>
                </div>
              </div>
            </div>

            {/* Track 2: Opponent */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-rose-300 flex items-center gap-1">
                  <span>{opponent?.avatar || '👤'}</span> {opponent?.name || (lang === 'en' ? 'Opponent' : 'Oponent')}
                </span>
                <span className="font-mono text-rose-200">{opponent?.progress || 0}%</span>
              </div>
              <div className="h-6 w-full rounded-full bg-slate-950 p-1 border border-rose-500/40 relative overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-600 via-amber-500 to-yellow-400 transition-all duration-300 flex items-center justify-end pr-1"
                  style={{ width: `${Math.max(5, opponent?.progress || 0)}%` }}
                >
                  <span className="text-xs">🏎️</span>
                </div>
              </div>
            </div>
          </div>

          {/* MODE 1: CYBER SPRINT GAMEPLAY */}
          {currentRoom.mode === 'cyber_sprint' && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
              {/* Words Text Container */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-lg sm:text-xl leading-relaxed flex flex-wrap gap-2.5">
                {words.map((word, idx) => {
                  let statusClass = 'text-slate-500';
                  if (idx < currentWordIdx) {
                    statusClass = 'text-emerald-400 font-bold line-through opacity-60';
                  } else if (idx === currentWordIdx) {
                    statusClass = 'text-amber-300 font-black bg-amber-500/20 px-2 py-0.5 rounded-lg ring-2 ring-amber-400/50';
                  }

                  return (
                    <span key={idx} className={`transition-all ${statusClass}`}>
                      {word}
                    </span>
                  );
                })}
              </div>

              {/* Typing Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {lang === 'en' ? 'Type the current word followed by [SPACE]:' : 'Tastează cuvântul curent urmat de [SPACE]:'}
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={typedInput}
                  onChange={handleTypingChange}
                  disabled={hasFinishedLocal}
                  placeholder={hasFinishedLocal ? (lang === 'en' ? 'Finished! Waiting for opponent...' : 'Ai terminat! Se așteaptă adversarul...') : (lang === 'en' ? 'Type here...' : 'Tastează aici...')}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-950 border-2 border-indigo-500 focus:border-cyan-400 text-white font-mono text-xl font-bold outline-none shadow-lg transition-all"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* MODE 0: ROBLOX BLOX CLICKER DUEL */}
          {currentRoom.mode === 'roblox_clicker' && (
            <RobloxClickerDuelGame
              roomData={currentRoom}
              isHost={isHost}
              studentName={resolvedStudentName}
              studentAvatar={resolvedAvatar}
              onFinish={handleRobloxClickerFinish}
              onBack={() => {
                if (currentRoom?.roomCode) {
                  leaveDuelRoom(currentRoom.roomCode, isHost);
                }
                setViewState('lobby');
              }}
            />
          )}

          {/* MODE: CYBER PRECISION ARENA (AIMLAB & OSU! TIC 1v1) */}
          {currentRoom.mode === 'cyber_precision' && (
            <CyberPrecisionDuelGame
              roomData={currentRoom}
              isHost={isHost}
              studentName={resolvedStudentName}
              studentAvatar={resolvedAvatar}
              onFinish={(finalScore, won) => {
                if (won) {
                  onAwardXP?.(200, lang === 'en' ? 'Victory in Cyber Precision Arena 1v1!' : 'Victorie în Cyber Precision Arena 1v1!');
                }
              }}
              onBack={() => {
                if (currentRoom?.roomCode) {
                  leaveDuelRoom(currentRoom.roomCode, isHost);
                }
                setViewState('lobby');
              }}
            />
          )}

          {/* MODE: CIRCUIT OVERDRIVE (HARDWARE SERVER 1v1) */}
          {currentRoom.mode === 'circuit_overdrive' && (
            <CircuitOverdriveDuelGame
              roomData={currentRoom}
              isHost={isHost}
              studentName={resolvedStudentName}
              studentAvatar={resolvedAvatar}
              onFinish={(finalScore, won) => {
                if (won) {
                  onAwardXP?.(200, lang === 'en' ? 'Victory in Circuit Overdrive 1v1!' : 'Victorie în Circuit Overdrive 1v1!');
                }
              }}
              onBack={() => {
                if (currentRoom?.roomCode) {
                  leaveDuelRoom(currentRoom.roomCode, isHost);
                }
                setViewState('lobby');
              }}
            />
          )}

          {/* MODE 1: CYBER CURSOR CLASH (MOUSE MASTER DUEL) */}
          {currentRoom.mode === 'mouse_duel' && (
            <MouseMasterDuelGame
              roomData={currentRoom}
              isHost={isHost}
              studentName={resolvedStudentName}
              studentAvatar={resolvedAvatar}
              onFinish={(finalScore, won) => {
                if (won) {
                  onAwardXP?.(150, 'Victorie Cyber Cursor Clash');
                }
              }}
              onBack={() => {
                if (currentRoom?.roomCode) {
                  leaveDuelRoom(currentRoom.roomCode, isHost);
                }
                setViewState('lobby');
              }}
            />
          )}

          {/* MODE: HACKER VS DEFENDER (ATAC & PETICIRE 1v1) */}
          {currentRoom.mode === 'hacker_defense' && (
            <HackerDefenderDuelGame
              room={currentRoom}
              currentPlayer={me || currentRoom.host}
              opponent={opponent}
              isHost={isHost}
              studentName={resolvedStudentName}
              studentAvatar={resolvedAvatar}
              onFinishMatch={(finalScore, won) => {
                if (won) {
                  onAwardXP?.(200, 'Victorie Hacker vs Defender 1v1');
                }
              }}
              onBackToLobby={() => {
                if (currentRoom?.roomCode) {
                  leaveDuelRoom(currentRoom.roomCode, isHost);
                }
                setViewState('lobby');
              }}
            />
          )}

          {/* MODE 2: SPEED CRAFTING DUEL (MINECRAFT TIC 1v1) */}
          {currentRoom.mode === 'speed_crafting' && (
            <SpeedCraftingDuelGame
              room={currentRoom}
              currentPlayer={me || currentRoom.host}
              opponent={opponent}
              onVictory={handleSpeedCraftingFinish}
            />
          )}

          {/* MODE 3: CURSA ALGORITMILOR (BLOCK CODING DUEL) */}
          {currentRoom.mode === 'block_coding' && (
            <BlockCodingDuelGame
              challenges={currentRoom.codingChallenges}
              currentLevelIndex={codingLevelIndex}
              myScore={codingScore}
              opponentProgress={opponent?.progress || 0}
              opponentName={opponent?.name}
              opponentAvatar={opponent?.avatar}
              isHost={isHost}
              lang={lang}
              onLevelComplete={handleBlockCodingLevelComplete}
              onFinishMatch={handleBlockCodingFinish}
              onUpdateProgress={(progress, score, level) => {
                updateDuelProgress(currentRoom.roomCode, isHost, {
                  progress,
                  score,
                  currentStageIndex: level
                });
              }}
            />
          )}

          {/* MODE 3: QUIZ BLITZ GAMEPLAY */}
          {currentRoom.mode === 'quiz_blitz' && currentQ && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1.5 font-mono">
                  <HelpCircle className="w-4 h-4 text-purple-400" />
                  {lang === 'en'
                    ? `Question ${currentQIndex + 1} of ${currentQuestions.length}`
                    : `Întrebarea ${currentQIndex + 1} din ${currentQuestions.length}`}
                </span>
                <span className="text-amber-400 flex items-center gap-1 font-mono font-bold">
                  <Flame className="w-4 h-4" /> Combo Streak: x{streak}
                  <span className="text-slate-600 mx-1.5">|</span>
                  <span className="text-emerald-400 font-bold">{quizScore} XP</span>
                </span>
              </div>

              {/* Question Text */}
              <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
                {lang === 'en' && currentQ.qEn ? currentQ.qEn : currentQ.q}
              </h3>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {(lang === 'en' && currentQ.optionsEn ? currentQ.optionsEn : currentQ.options).map((option, oIdx) => {
                  let btnStyle = 'bg-slate-950 border-slate-800 hover:border-indigo-500 text-white hover:bg-slate-900/60';
                  let statusBadge = null;

                  if (selectedAnswer !== null) {
                    if (oIdx === currentQ.correctIndex) {
                      btnStyle = 'bg-emerald-950/90 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-950/50';
                      statusBadge = (
                        <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1 ml-auto shrink-0 bg-emerald-900/60 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {lang === 'en' ? 'Correct Answer' : 'Răspuns Corect'}
                        </span>
                      );
                    } else if (selectedAnswer === oIdx) {
                      btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-200 ring-2 ring-rose-500/50 shadow-lg shadow-rose-950/50 animate-shake';
                      statusBadge = (
                        <span className="text-[11px] font-mono font-bold text-rose-400 flex items-center gap-1 ml-auto shrink-0 bg-rose-900/60 px-2 py-0.5 rounded-lg border border-rose-500/30">
                          <XCircle className="w-3.5 h-3.5" />
                          {lang === 'en' ? 'Your Answer (Wrong)' : 'Răspunsul Tău (Greșit)'}
                        </span>
                      );
                    } else {
                      btnStyle = 'bg-slate-950/30 border-slate-900 text-slate-600 opacity-40';
                    }
                  }

                  const isButtonDisabled = selectedAnswer !== null || quizAnswerLockRef.current;

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={isButtonDisabled}
                      onClick={() => handleQuizAnswer(oIdx)}
                      className={`p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all flex items-center gap-3 relative overflow-hidden ${
                        isButtonDisabled ? 'cursor-default pointer-events-none' : 'cursor-pointer active:scale-98'
                      } ${btnStyle}`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                        selectedAnswer !== null && oIdx === currentQ.correctIndex
                          ? 'bg-emerald-800 text-emerald-100'
                          : selectedAnswer === oIdx
                          ? 'bg-rose-800 text-rose-100'
                          : 'bg-slate-800/80 text-slate-300'
                      }`}>
                        {String.fromCharCode(65 + oIdx)}
                      </div>
                      <span className="flex-1 text-sm font-semibold">{option}</span>
                      {statusBadge}
                    </button>
                  );
                })}
              </div>

              {/* Explanations & Next Question Transition Callout */}
              {quizFeedback && (
                <div className={`p-4 sm:p-5 rounded-2xl border-2 space-y-3.5 animate-fadeIn ${
                  quizFeedback.isCorrect
                    ? 'bg-emerald-950/90 border-emerald-500/60 shadow-lg shadow-emerald-950/40 text-emerald-100'
                    : 'bg-rose-950/90 border-rose-500/60 shadow-lg shadow-rose-950/40 text-rose-100'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2.5">
                      {quizFeedback.isCorrect ? (
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                          <XCircle className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <span className="font-black text-sm sm:text-base block">
                          {quizFeedback.isCorrect
                            ? (lang === 'en' ? `BRAVO! CORRECT ANSWER (+${quizFeedback.pointsEarned} XP)` : `BRAVO! RĂSPUNS CORECT (+${quizFeedback.pointsEarned} XP)`)
                            : (lang === 'en' ? 'WRONG ANSWER! (0 points) — Locked, no reselecting' : 'RĂSPUNS GREȘIT! (0 puncte) — Selectare blocată, trecem mai departe')}
                        </span>
                        <span className="text-[11px] opacity-80 block">
                          {quizFeedback.isCorrect
                            ? (lang === 'en' ? 'Keep up your combo streak!' : 'Excelent! Ai menținut streak-ul de combo!')
                            : (lang === 'en' ? 'Rapid-clicking is penalized. Read the explanation below to learn!' : 'Apasarea la nimereală este penalizată. Citește explicația de mai jos!')}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => advanceToNextQuizQuestion()}
                      className={`px-4 py-2 rounded-xl font-black text-xs transition cursor-pointer flex items-center gap-2 shrink-0 shadow-md active:scale-95 ${
                        quizFeedback.isCorrect
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                          : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                      }`}
                    >
                      <span>{lang === 'en' ? 'Next Question' : 'Următoarea Întrebare'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Pedagogical Explanation Text */}
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                    <span className="text-xl shrink-0 mt-0.5">💡</span>
                    <div className="text-xs sm:text-sm leading-relaxed">
                      <strong className="text-amber-300 font-bold block mb-1">
                        {lang === 'en' ? 'Pedagogical Explanation:' : 'Explicație Didactică TIC:'}
                      </strong>
                      <p className="text-slate-200">
                        {lang === 'en' && quizFeedback.explanationEn ? quizFeedback.explanationEn : quizFeedback.explanationRo}
                      </p>
                    </div>
                  </div>

                  {/* Automatic Countdown Bar */}
                  <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono pt-1">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                      {lang === 'en'
                        ? `Auto-advancing to next question in ${quizCountdown}s...`
                        : `Trecem automat la următoarea întrebare în ${quizCountdown}s...`}
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      {lang === 'en' ? 'Or click "Next Question"' : 'Sau apasă „Următoarea Întrebare”'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE 3: CYBER SHIELD GAMEPLAY (Phishing / Threats) */}
          {currentRoom.mode === 'cyber_shield' && currentShieldItem && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-rose-500/40 shadow-2xl space-y-6">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                <span className="text-rose-300 font-mono flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  {lang === 'en'
                    ? `Security Scenario ${shieldIndex + 1} of ${shieldItems.length}`
                    : `Scenariul de Securitate ${shieldIndex + 1} din ${shieldItems.length}`}
                </span>
                <span className="text-amber-400 flex items-center gap-1 font-mono">
                  <Flame className="w-4 h-4" /> Streak: x{shieldStreak} (+{shieldScore} XP)
                </span>
              </div>

              {/* Simulated Email / Message Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border-2 border-slate-800 relative overflow-hidden shadow-inner">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-800 text-xs">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-slate-400">{lang === 'en' ? 'From:' : 'De la:'}</span>
                  <span className="font-mono font-bold text-white truncate">
                    {lang === 'en' && currentShieldItem.senderEn ? currentShieldItem.senderEn : currentShieldItem.sender}
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-black text-amber-200 font-heading mb-2">
                  {lang === 'en' && currentShieldItem.subjectEn ? currentShieldItem.subjectEn : currentShieldItem.subject}
                </h4>

                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  {lang === 'en' && currentShieldItem.bodyEn ? currentShieldItem.bodyEn : currentShieldItem.body}
                </p>

                {(currentShieldItem.linkOrAttachment || currentShieldItem.linkOrAttachmentEn) && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center gap-2 text-xs font-mono">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-slate-400">{lang === 'en' ? 'Link / Attachment:' : 'Link / Atașament:'}</span>
                    <span className="text-rose-300 font-bold truncate underline">
                      {lang === 'en' && currentShieldItem.linkOrAttachmentEn ? currentShieldItem.linkOrAttachmentEn : currentShieldItem.linkOrAttachment}
                    </span>
                  </div>
                )}
              </div>

              {/* Feedback Alert if choice made */}
              {shieldFeedback && (
                <div className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn text-sm ${
                  shieldFeedback.isCorrect 
                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200' 
                    : 'bg-rose-950/80 border-rose-400 text-rose-200'
                }`}>
                  <div className="flex items-start gap-3">
                    {shieldFeedback.isCorrect ? <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" /> : <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />}
                    <div>
                      <span className="font-black block">
                        {shieldFeedback.isCorrect
                          ? (lang === 'en' ? 'CORRECT DECISION! +150 XP' : 'DECIZIE CORECTĂ! +150 XP')
                          : (lang === 'en' ? 'WRONG DECISION! (0 XP)' : 'DECIZIE GREȘITĂ! (0 XP)')}
                      </span>
                      <p className="text-xs mt-0.5 opacity-90">
                        {lang === 'en' && currentShieldItem.explanationEn ? currentShieldItem.explanationEn : shieldFeedback.explanation}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => advanceToNextShieldItem()}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs shrink-0 cursor-pointer flex items-center gap-1.5 transition ${
                      shieldFeedback.isCorrect
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-rose-600 hover:bg-rose-500 text-white'
                    }`}
                  >
                    <span>{lang === 'en' ? 'Next' : 'Continuă'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Action Buttons: BLOCK THREAT vs ALLOW SAFE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  type="button"
                  disabled={shieldFeedback !== null || shieldAnswerLockRef.current}
                  onClick={() => handleShieldDecision('block')}
                  className="p-4 rounded-2xl bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-600 hover:to-red-500 text-white font-black text-base shadow-lg shadow-rose-600/30 transition-all active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShieldX className="w-5 h-5" />
                  {lang === 'en' ? '🚨 BLOCK ATTACK (Phishing/Virus)' : '🚨 BLOCHEAZĂ ATACUL (Phishing/Virus)'}
                </button>

                <button
                  type="button"
                  disabled={shieldFeedback !== null || shieldAnswerLockRef.current}
                  onClick={() => handleShieldDecision('allow')}
                  className="p-4 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-600 hover:to-teal-500 text-white font-black text-base shadow-lg shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShieldCheck className="w-5 h-5" />
                  {lang === 'en' ? '✅ ALLOW (Safe / Official Message)' : '✅ PERMITE (Mesaj Sigur / Oficial)'}
                </button>
              </div>
            </div>
          )}

          {/* MODE 4: HARDWARE PC RUSH GAMEPLAY */}
          {currentRoom.mode === 'pc_rush' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-cyan-500/40 shadow-2xl space-y-6">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                <span className="text-cyan-300 font-mono flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  {lang === 'en'
                    ? `Speed PC Assembly (Step ${expectedStep} of ${pcParts.length})`
                    : `Asamblare PC în Viteză (Pasul ${expectedStep} din ${pcParts.length})`}
                </span>
                <span className="text-emerald-400 font-mono">
                  {lang === 'en'
                    ? `Mounted Components: ${assembledParts.length}/${pcParts.length} (+${pcScore} XP)`
                    : `Componente Montate: ${assembledParts.length}/${pcParts.length} (+${pcScore} XP)`}
                </span>
              </div>

              {/* Motherboard / Case Target Diagram */}
              <div className="p-5 rounded-2xl bg-slate-950 border-2 border-cyan-500/30 shadow-inner space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
                    {lang === 'en' ? '🖥️ Motherboard & Case (Active Sockets)' : '🖥️ Placă de Bază & Carcasă (Socketuri Active)'}
                  </h4>
                  <span className="text-[11px] text-amber-300 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    {lang === 'en' ? 'Next required step: ' : 'Următorul pas necesar: '}
                    {lang === 'en' && currentExpectedPart?.slotLabelEn ? currentExpectedPart.slotLabelEn : currentExpectedPart?.slotLabel}
                  </span>
                </div>

                {/* Slots Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {pcParts.map((p) => {
                    const isMounted = assembledParts.includes(p.id);
                    const isNextTarget = p.stepOrder === expectedStep;
                    const slotName = lang === 'en' && p.slotLabelEn ? p.slotLabelEn : p.slotLabel;
                    const partName = lang === 'en' && p.nameEn ? p.nameEn : p.name;

                    return (
                      <div
                        key={p.id}
                        className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                          isMounted
                            ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                            : isNextTarget
                            ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400/40 animate-pulse'
                            : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60'
                        }`}
                      >
                        <span className="text-2xl">{isMounted ? '✅' : p.icon}</span>
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono text-slate-400 block truncate">
                            {slotName}
                          </span>
                          <span className="text-xs font-bold truncate block">
                            {isMounted ? partName : (lang === 'en' ? `[Empty Slot ${p.stepOrder}]` : `[Slot ${p.stepOrder} Liber]`)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Error Notice if wrong step */}
              {pcMistake && (
                <div className="p-3.5 rounded-xl bg-rose-950/90 border border-rose-500 text-rose-200 text-xs flex items-center gap-2 animate-shake">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="font-bold">{pcMistake}</span>
                </div>
              )}

              {/* Available Parts Shelf to click and install */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
                  {lang === 'en'
                    ? '📦 Available Parts Shelf (Click correct part to install):'
                    : '📦 Raftul cu Piese Disponibile (Apasă pe piesa corectă pentru instalare):'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {pcParts.map((part) => {
                    const isInstalled = assembledParts.includes(part.id);
                    const isLocked = isInstalled || pcLockedUntil > Date.now();
                    const partName = lang === 'en' && part.nameEn ? part.nameEn : part.name;
                    const partSpecs = lang === 'en' && part.specsEn ? part.specsEn : part.specs;
                    const partHint = lang === 'en' && part.hintEn ? part.hintEn : part.hint;

                    return (
                      <button
                        key={part.id}
                        type="button"
                        disabled={isLocked}
                        onClick={() => handleAssemblePart(part)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all active:scale-95 flex items-center gap-3 ${
                          isInstalled
                            ? 'bg-slate-950/40 border-slate-900 opacity-40 cursor-not-allowed'
                            : isLocked
                            ? 'bg-slate-950/60 border-rose-900/50 opacity-50 cursor-not-allowed'
                            : 'bg-slate-950 hover:bg-slate-800 border-cyan-500/50 hover:border-cyan-300 text-white shadow-md cursor-pointer'
                        }`}
                      >
                        <span className="text-3xl shrink-0">{part.icon}</span>
                        <div className="min-w-0 flex-1">
                          <h5 className="text-xs sm:text-sm font-bold truncate">{partName}</h5>
                          <span className="text-[10px] font-mono text-cyan-300 block truncate">{partSpecs}</span>
                          <span className="text-[10px] text-slate-400 block truncate mt-0.5">{partHint}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* MODE 7: BINARY CLASH 1v1 */}
          {currentRoom.mode === 'binary_clash' && (
            <BinaryClashDuelGame
              roomData={currentRoom}
              isHost={isHost}
              studentName={resolvedStudentName}
              studentAvatar={resolvedAvatar}
              onFinish={(finalScore, won) => {
                if (won) {
                  onAwardXP?.(250, 'Victorie Cursa Biților 1v1');
                }
              }}
              onBack={() => {
                if (currentRoom?.roomCode) {
                  leaveDuelRoom(currentRoom.roomCode, isHost);
                }
                setViewState('lobby');
              }}
            />
          )}

          {/* MODE 8: CIRCUIT CLASH 1v1 */}
          {currentRoom.mode === 'circuit_duel' && (
            <CircuitMasterDuelGame
              roomData={currentRoom}
              isHost={isHost}
              studentName={resolvedStudentName}
              studentAvatar={resolvedAvatar}
              onFinish={(finalScore, won) => {
                if (won) {
                  onAwardXP?.(300, 'Victorie Circuit Clash Smart City 1v1');
                }
              }}
              onBack={() => {
                if (currentRoom?.roomCode) {
                  leaveDuelRoom(currentRoom.roomCode, isHost);
                }
                setViewState('lobby');
              }}
            />
          )}

          {/* MODE 9: C++ CODE RACER 1v1 */}
          {currentRoom.mode === 'algo_race_cpp' && (
            <CodeRacerCppDuelGame
              roomData={currentRoom}
              isHost={isHost}
              studentName={resolvedStudentName}
              studentAvatar={resolvedAvatar}
              onFinish={(finalScore, won) => {
                if (won) {
                  onAwardXP?.(300, 'Victorie C++ Code Racer 1v1');
                }
              }}
              onBack={() => {
                if (currentRoom?.roomCode) {
                  leaveDuelRoom(currentRoom.roomCode, isHost);
                }
                setViewState('lobby');
              }}
            />
          )}

          {/* MODE 10: PIXEL ART SPRITE CLASH 1v1 */}
          {currentRoom.mode === 'pixel_clash' && (
            <PixelClashDuelGame
              roomData={currentRoom}
              isHost={isHost}
              studentName={resolvedStudentName}
              studentAvatar={resolvedAvatar}
              onFinish={(finalScore, won) => {
                if (won) {
                  onAwardXP?.(300, 'Victorie Pixel Art Sprite Clash 1v1');
                }
              }}
              onBack={() => {
                if (currentRoom?.roomCode) {
                  leaveDuelRoom(currentRoom.roomCode, isHost);
                }
                setViewState('lobby');
              }}
            />
          )}

          {/* MODE 11: NETWORK PACKET RACER 1v1 */}
          {currentRoom.mode === 'network_racer' && (
            <NetworkPacketRacerDuelGame
              roomData={currentRoom}
              isHost={isHost}
              studentName={resolvedStudentName}
              studentAvatar={resolvedAvatar}
              onFinish={(finalScore, won) => {
                if (won) {
                  onAwardXP?.(300, 'Victorie Network Packet Racer 1v1');
                }
              }}
              onBack={() => {
                if (currentRoom?.roomCode) {
                  leaveDuelRoom(currentRoom.roomCode, isHost);
                }
                setViewState('lobby');
              }}
            />
          )}
        </div>
      )}

      {/* VIEW 4: RESULTS PODIUM */}
      {viewState === 'results' && currentRoom && (
        <div className="p-8 rounded-3xl bg-slate-900/95 border-2 border-amber-500/40 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-rose-600 mx-auto flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30 ring-4 ring-amber-300/30 animate-bounce">
            <Trophy className="w-10 h-10 text-white" />
          </div>

          <div>
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest block">
              {lang === 'en' ? 'Match Finished!' : 'Meci Încheiat!'}
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-white font-heading mt-1">
              {isMeWinner
                ? (lang === 'en' ? '🎉 CONGRATULATIONS! YOU WON THE DUEL! 🎉' : '🎉 FELICITĂRI! AI CÂȘTIGAT DUELUL! 🎉')
                : (lang === 'en' ? `🏆 Winner: ${currentRoom.winnerName || 'Opponent'}` : `🏆 Câștigător: ${currentRoom.winnerName || 'Oponentul'}`)}
            </h3>
            <p className="text-sm text-slate-300 mt-2">
              {isMeWinner
                ? (lang === 'en'
                    ? 'You demonstrated exceptional speed and accuracy in the ICT laboratory! You earned +200 XP!'
                    : 'Ai demonstrat o viteză și precizie excepțională în laboratorul TIC! Ai primit +200 XP!')
                : (lang === 'en'
                    ? 'A close and thrilling duel! Seek vengeance in a fast rematch!'
                    : 'O luptă strânsă și spectaculoasă! Răzbună-te într-o revanșă fulger!')}
            </p>
          </div>

          {/* Scores Comparison */}
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className={`p-4 rounded-xl border ${isMeWinner ? 'bg-indigo-950/60 border-indigo-500' : 'bg-slate-900 border-slate-800'}`}>
              <span className="text-2xl block mb-1">{me?.avatar}</span>
              <span className="text-xs font-bold text-slate-400">{me?.name} {lang === 'en' ? '(You)' : '(Tu)'}</span>
              <div className="font-mono text-xl font-black text-indigo-300 mt-1">{me?.score || 0} pts</div>
            </div>

            <div className={`p-4 rounded-xl border ${isOpponentWinner ? 'bg-rose-950/60 border-rose-500' : 'bg-slate-900 border-slate-800'}`}>
              <span className="text-2xl block mb-1">{opponent?.avatar || '👤'}</span>
              <span className="text-xs font-bold text-slate-400">{opponent?.name || (lang === 'en' ? 'Opponent' : 'Oponent')}</span>
              <div className="font-mono text-xl font-black text-rose-300 mt-1">{opponent?.score || 0} pts</div>
            </div>
          </div>

          {/* Play Again / Exit */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                sounds.playClick();
                if (quizTimerRef.current) clearTimeout(quizTimerRef.current);
                if (quizIntervalRef.current) clearInterval(quizIntervalRef.current);
                if (shieldTimerRef.current) clearTimeout(shieldTimerRef.current);
                quizAnswerLockRef.current = false;
                shieldAnswerLockRef.current = false;
                setQuizFeedback(null);
                setSelectedAnswer(null);
                setPcLockedUntil(0);
                setViewState('lobby');
                setCurrentRoom(null);
                setHasFinishedLocal(false);
                setCurrentWordIdx(0);
                setCurrentQIndex(0);
                setQuizScore(0);
                setShieldIndex(0);
                setShieldScore(0);
                setAssembledParts([]);
                setPcScore(0);
                setCodingLevelIndex(0);
                setCodingScore(0);
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {lang === 'en' ? 'New Match / Change Mode' : 'Meci Nou / Schimbă Modul'}
            </button>

            {handleBack && (
              <button
                onClick={() => {
                  sounds.playClick();
                  handleBack();
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-sm border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-400" />
                {lang === 'en' ? 'Back to Courses' : 'Înapoi la Misiuni'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
