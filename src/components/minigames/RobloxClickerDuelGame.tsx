import React, { useState, useEffect, useRef } from 'react';
import {
  Trophy,
  Sparkles,
  Zap,
  Flame,
  Swords,
  Crown,
  RotateCcw,
  Volume2,
  VolumeX,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Clock,
  Heart,
  Egg,
  TrendingUp,
  Cpu,
  RefreshCw,
  Gift,
  ShieldAlert,
  Bot
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { DuelRoomData, DuelPlayer, updateDuelProgress } from '../../lib/duelService';
import { updateStudentArcadeScore } from '../../lib/studentAuthService';

export interface RobloxPet {
  id: string;
  name: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Godly';
  icon: string;
  multiplier: number; // Click multiplier
  cps: number; // Clicks per second passive
  color: string;
  bgGlow: string;
}

export interface UpgradeItem {
  id: string;
  nameRo: string;
  nameEn: string;
  cost: number;
  level: number;
  bonusPerClick: number;
  bonusCPS: number;
  icon: string;
  descRo: string;
  descEn: string;
}

export interface TicBossQuestion {
  questionRo: string;
  questionEn: string;
  options: string[];
  correctIdx: number;
  explanationRo: string;
  explanationEn: string;
}

const PET_POOL: Record<string, RobloxPet[]> = {
  starter_egg: [
    { id: 'doge', name: 'Blox Doge 🐶', rarity: 'Common', icon: '🐶', multiplier: 1.5, cps: 5, color: 'text-amber-300', bgGlow: 'from-amber-600/30' },
    { id: 'noob', name: 'Cyber Noob 👦', rarity: 'Rare', icon: '👦', multiplier: 2.0, cps: 12, color: 'text-yellow-300', bgGlow: 'from-yellow-600/30' },
    { id: 'slime', name: 'Redstone Slime 🔴', rarity: 'Epic', icon: '🔴', multiplier: 3.5, cps: 25, color: 'text-rose-400', bgGlow: 'from-rose-600/30' }
  ],
  cyber_egg: [
    { id: 'hacker_cat', name: 'Hacker Cat 🐱', rarity: 'Rare', icon: '🐱', multiplier: 5.0, cps: 60, color: 'text-emerald-300', bgGlow: 'from-emerald-600/30' },
    { id: 'glitch_dragon', name: 'Glitch Dragon 🐉', rarity: 'Epic', icon: '🐉', multiplier: 8.5, cps: 150, color: 'text-purple-400', bgGlow: 'from-purple-600/30' },
    { id: 'neon_bot', name: 'Neon CyberBot 🤖', rarity: 'Legendary', icon: '🤖', multiplier: 15.0, cps: 350, color: 'text-cyan-300', bgGlow: 'from-cyan-600/30' }
  ],
  godly_egg: [
    { id: 'dominus_rainbow', name: 'Dominus Quantum 👑', rarity: 'Legendary', icon: '👑', multiplier: 35.0, cps: 1000, color: 'text-amber-400', bgGlow: 'from-amber-500/40' },
    { id: 'valkyrie_matrix', name: 'Valkyrie Matrix 🛡️', rarity: 'Godly', icon: '🛡️', multiplier: 80.0, cps: 2800, color: 'text-pink-400', bgGlow: 'from-pink-500/40' },
    { id: 'titan_overlord', name: 'Titan Byte Overlord 🌌', rarity: 'Godly', icon: '🌌', multiplier: 200.0, cps: 8000, color: 'text-indigo-400', bgGlow: 'from-indigo-500/50' }
  ]
};

const TIC_BOSS_QUESTIONS: TicBossQuestion[] = [
  {
    questionRo: 'Un Byte (Octet) este format din exact:',
    questionEn: 'One Byte is composed of exactly:',
    options: ['4 Biți', '8 Biți', '16 Biți', '1024 Biți'],
    correctIdx: 1,
    explanationRo: '1 Byte = 8 biți (0 și 1).',
    explanationEn: '1 Byte = 8 bits.'
  },
  {
    questionRo: 'Care extensie este un fișier executabil ce poate conține viruși?',
    questionEn: 'Which extension is an executable file that could carry viruses?',
    options: ['.txt', '.png', '.exe', '.mp3'],
    correctIdx: 2,
    explanationRo: '.exe indică un program executabil în Windows.',
    explanationEn: '.exe indicates an executable program.'
  },
  {
    questionRo: 'Ce valoare zecimală are numărul binar 101₂?',
    questionEn: 'What is the decimal value of binary 101₂?',
    options: ['3', '5', '6', '7'],
    correctIdx: 1,
    explanationRo: '1×4 + 0×2 + 1×1 = 5 în baza 10.',
    explanationEn: '1×4 + 0×2 + 1×1 = 5.'
  },
  {
    questionRo: 'Combinația de taste pentru salvare rapidă în majoritatea aplicațiilor este:',
    questionEn: 'The quick save shortcut in most applications is:',
    options: ['Ctrl + C', 'Ctrl + S', 'Ctrl + V', 'Ctrl + Z'],
    correctIdx: 1,
    explanationRo: 'Ctrl + S este scurtătura universală de Save.',
    explanationEn: 'Ctrl + S is universal Save.'
  },
  {
    questionRo: 'Care este rolul principal al unui procesor (CPU)?',
    questionEn: 'What is the main role of a CPU microprocessor?',
    options: ['Stocare permanentă', 'Executarea instrucțiunilor și calculelor', 'Afișarea pe ecran', 'Răcirea carcasei'],
    correctIdx: 1,
    explanationRo: 'CPU (Unitatea Centrală de Prelucrare) este "creierul" care execută calculele.',
    explanationEn: 'CPU processes calculations and instructions.'
  },
  {
    questionRo: 'Ce protocol securizat criptează datele pe paginile web?',
    questionEn: 'Which secure protocol encrypts data on websites?',
    options: ['HTTP', 'HTTPS', 'FTP', 'SMTP'],
    correctIdx: 1,
    explanationRo: 'HTTPS folosește criptare SSL/TLS pentru confidențialitate.',
    explanationEn: 'HTTPS uses SSL/TLS encryption.'
  }
];

interface RobloxClickerDuelGameProps {
  roomData?: DuelRoomData | null;
  isHost?: boolean;
  studentName?: string;
  studentAvatar?: string;
  onFinish?: (score: number) => void;
  onBack?: () => void;
}

const TARGET_GOAL = 50000; // 50,000 Blox Points to win match

export const RobloxClickerDuelGame: React.FC<RobloxClickerDuelGameProps> = ({
  roomData,
  isHost = true,
  studentName = 'Robloxian TIC',
  studentAvatar = '⚡',
  onFinish,
  onBack
}) => {
  const { lang } = useLanguage();
  const [soundMuted, setSoundMuted] = useState(false);

  // Player Economy & State
  const [blox, setBlox] = useState(0);
  const [rebirths, setRebirths] = useState(0);
  const [diamonds, setDiamonds] = useState(10);
  const [totalClicks, setTotalClicks] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isFrenzy, setIsFrenzy] = useState(false);
  const [frenzyTimer, setFrenzyTimer] = useState(0);
  const [activeSpellEffect, setActiveSpellEffect] = useState<string | null>(null);
  const [shieldActive, setShieldActive] = useState(false);

  // Equipped Pets (Max 3)
  const [equippedPets, setEquippedPets] = useState<RobloxPet[]>([
    { id: 'starter_doge', name: 'Blox Doge 🐶', rarity: 'Common', icon: '🐶', multiplier: 1.5, cps: 5, color: 'text-amber-300', bgGlow: 'from-amber-600/30' }
  ]);
  const [petInventory, setPetInventory] = useState<RobloxPet[]>([]);

  // Upgrades
  const [upgrades, setUpgrades] = useState<UpgradeItem[]>([
    { id: 'mouse', nameRo: 'Mouse RGB cu Macro', nameEn: 'RGB Macro Mouse', cost: 30, level: 1, bonusPerClick: 2, bonusCPS: 0, icon: '🖱️', descRo: '+2 Blox / click', descEn: '+2 Blox / click' },
    { id: 'keyboard', nameRo: 'Switch Mecanic Red', nameEn: 'Mechanical Switches', cost: 120, level: 0, bonusPerClick: 5, bonusCPS: 2, icon: '⌨️', descRo: '+5 Blox / click & +2 CPS', descEn: '+5 Blox / click & +2 CPS' },
    { id: 'server', nameRo: 'Server Gigabit TIC', nameEn: 'Gigabit TIC Server', cost: 450, level: 0, bonusPerClick: 0, bonusCPS: 20, icon: '🛰️', descRo: '+20 Auto-Clicks/sec', descEn: '+20 Auto-Clicks/sec' },
    { id: 'quantum_ai', nameRo: 'Coprocesor AI Blox', nameEn: 'AI Blox Coprocessor', cost: 1500, level: 0, bonusPerClick: 25, bonusCPS: 80, icon: '🧠', descRo: '+25 / click & +80 CPS', descEn: '+25 / click & +80 CPS' }
  ]);

  // Floating Click Particles
  const [floatingTexts, setFloatingTexts] = useState<{ id: number; text: string; x: number; y: number; color: string; isCrit?: boolean }[]>([]);

  // Egg Hatching Animation Overlay
  const [hatchingEgg, setHatchingEgg] = useState<{ eggType: string; isWobbling: boolean; hatchedPet: RobloxPet | null } | null>(null);

  // Mini-Boss QTE Raid
  const [activeBoss, setActiveBoss] = useState<{
    name: string;
    icon: string;
    question: TicBossQuestion;
    timeLeft: number;
  } | null>(null);

  // Opponent Live State (Firebase synced or Solo AI Bot)
  const [opponentBlox, setOpponentBlox] = useState(0);
  const [opponentRebirths, setOpponentRebirths] = useState(0);
  const [opponentName] = useState(
    roomData
      ? (isHost ? (roomData.guest?.name || 'Rival Blox') : roomData.host.name)
      : 'ProBlox_Noob99 🤖'
  );
  const [opponentAvatar] = useState(
    roomData
      ? (isHost ? (roomData.guest?.avatar || '👾') : roomData.host.avatar)
      : '🤖'
  );

  // Match Status
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<'me' | 'opponent' | null>(null);

  // Sound changes listener
  useEffect(() => {
    const handleSoundChange = (e: CustomEvent<boolean>) => setSoundMuted(!e.detail);
    window.addEventListener('arkedo_sound_change', handleSoundChange as EventListener);
    return () => window.removeEventListener('arkedo_sound_change', handleSoundChange as EventListener);
  }, []);

  // Compute Active Multiplier & CPS
  const petMultiplier = equippedPets.reduce((acc, p) => acc + p.multiplier, 1);
  const petCPS = equippedPets.reduce((acc, p) => acc + p.cps, 0);
  const upgradeBonusClick = upgrades.reduce((acc, u) => acc + u.level * u.bonusPerClick, 1);
  const upgradeCPS = upgrades.reduce((acc, u) => acc + u.level * u.bonusCPS, 0);

  const rebirthMultiplier = 1 + rebirths * 1.5; // +150% per rebirth
  const frenzyMultiplier = isFrenzy ? 5 : 1;

  const totalClickValue = Math.round(upgradeBonusClick * petMultiplier * rebirthMultiplier * frenzyMultiplier);
  const totalCPS = Math.round((upgradeCPS + petCPS) * rebirthMultiplier * frenzyMultiplier);

  // Auto-CPS Loop (Every 1 second)
  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      if (totalCPS > 0) {
        setBlox((prev) => {
          const next = prev + totalCPS;
          checkVictory(next);
          return next;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [totalCPS, isGameOver, rebirths]);

  // Frenzy Countdown Timer
  useEffect(() => {
    if (!isFrenzy) return;
    const timer = setInterval(() => {
      setFrenzyTimer((prev) => {
        if (prev <= 1) {
          setIsFrenzy(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFrenzy]);

  // Spell Effect Countdown
  useEffect(() => {
    if (!activeSpellEffect) return;
    const timer = setTimeout(() => {
      setActiveSpellEffect(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [activeSpellEffect]);

  // Periodic Mini-Boss Invasions (Every 35 seconds)
  useEffect(() => {
    if (isGameOver) return;
    const bossTimer = setInterval(() => {
      if (!activeBoss && Math.random() > 0.3) {
        spawnMiniBoss();
      }
    }, 32000);
    return () => clearInterval(bossTimer);
  }, [activeBoss, isGameOver]);

  // Mini-Boss countdown
  useEffect(() => {
    if (!activeBoss || isGameOver) return;
    const interval = setInterval(() => {
      setActiveBoss((prev) => {
        if (!prev) return null;
        if (prev.timeLeft <= 1) {
          // Time expired -> Boss attacked!
          if (!soundMuted) sounds.playOof();
          return null;
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeBoss, isGameOver, soundMuted]);

  // Solo AI Bot or Firebase Opponent Sync
  useEffect(() => {
    if (roomData) {
      // Sync from live roomData
      const opp = isHost ? roomData.guest : roomData.host;
      if (opp) {
        setOpponentBlox(opp.score || 0);
        if (opp.score >= TARGET_GOAL && !isGameOver) {
          triggerOpponentWin();
        }
      }
    } else {
      // Solo AI Bot simulation
      if (isGameOver) return;
      const aiInterval = setInterval(() => {
        setOpponentBlox((prev) => {
          // AI clicks dynamically and buys upgrades
          const aiGain = Math.floor(15 + Math.random() * 45 + (prev > 5000 ? 120 : 0) + (prev > 20000 ? 400 : 0));
          const next = prev + aiGain;
          if (next >= TARGET_GOAL && !isGameOver) {
            triggerOpponentWin();
          }
          return next;
        });
      }, 600);
      return () => clearInterval(aiInterval);
    }
  }, [roomData, isHost, isGameOver]);

  // Sync My Progress to Cloud
  useEffect(() => {
    if (!roomData || isGameOver) return;
    const progressPercent = Math.min(100, Math.round((blox / TARGET_GOAL) * 100));
    updateDuelProgress(roomData.roomCode, isHost, {
      score: blox,
      progress: progressPercent
    });
  }, [blox, roomData, isHost, isGameOver]);

  const spawnMiniBoss = () => {
    const randomQ = TIC_BOSS_QUESTIONS[Math.floor(Math.random() * TIC_BOSS_QUESTIONS.length)];
    const bosses = [
      { name: 'Trojan Glitch Virus', icon: '👾' },
      { name: 'Phishing Phantom', icon: '🎣' },
      { name: 'DDoS Blox Destroyer', icon: '⚡' },
      { name: 'Crypto Ransomware', icon: '🔒' }
    ];
    const pickedBoss = bosses[Math.floor(Math.random() * bosses.length)];

    setActiveBoss({
      name: pickedBoss.name,
      icon: pickedBoss.icon,
      question: randomQ,
      timeLeft: 10
    });
    if (!soundMuted) sounds.playRetro('boss_alert');
  };

  const handleBossAnswer = (choiceIdx: number) => {
    if (!activeBoss) return;
    if (choiceIdx === activeBoss.question.correctIdx) {
      // Boss Defeated!
      if (!soundMuted) {
        sounds.playCorrect();
        sounds.playFrenzy();
      }
      const rewardBlox = 2500 * rebirthMultiplier;
      const rewardDiamonds = 3;
      setBlox((prev) => prev + rewardBlox);
      setDiamonds((prev) => prev + rewardDiamonds);

      // Trigger Mega Frenzy
      setIsFrenzy(true);
      setFrenzyTimer(10);
      setActiveBoss(null);

      // Spawn floating reward
      addFloatingText(`+${rewardBlox} BLOX & FRENZY 5X! 🔥`, window.innerWidth / 2, window.innerHeight / 2, '#38bdf8', true);
    } else {
      // Failed boss
      if (!soundMuted) sounds.playOof();
      setActiveBoss(null);
      addFloatingText('OOF! Boss Escaped!', window.innerWidth / 2, window.innerHeight / 2, '#f43f5e', false);
    }
  };

  const addFloatingText = (text: string, x: number, y: number, color: string, isCrit = false) => {
    const id = Date.now() + Math.random();
    setFloatingTexts((prev) => [...prev.slice(-12), { id, text, x, y, color, isCrit }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((t) => t.id !== id));
    }, 1200);
  };

  // Main Click Handler
  const handleMainClick = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    if (isGameOver) return;

    // Check crit chance (15%)
    const isCrit = Math.random() < 0.2;
    const multiplier = isCrit ? 3 : 1;
    const gained = totalClickValue * multiplier;

    setBlox((prev) => {
      const next = prev + gained;
      checkVictory(next);
      return next;
    });

    setTotalClicks((prev) => prev + 1);
    setCombo((prev) => prev + 1);

    if (!soundMuted) {
      if (isCrit) {
        sounds.playRetro('powerup');
      } else {
        sounds.playClick();
      }
    }

    // Floating text coords
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2 + (Math.random() * 80 - 40);
    const y = rect.top + (Math.random() * 40 - 20);

    const txt = isCrit ? `CRIT +${gained}! 🔥` : `+${gained}`;
    const color = isCrit ? '#f59e0b' : '#38bdf8';
    addFloatingText(txt, x, y, color, isCrit);
  };

  // Rebirth Prestige
  const rebirthCost = Math.round(5000 * Math.pow(2.8, rebirths));
  const handleRebirth = () => {
    if (blox < rebirthCost) return;
    setBlox(0);
    setRebirths((prev) => prev + 1);
    setDiamonds((prev) => prev + 15);
    if (!soundMuted) sounds.playLevelUp();
    addFloatingText(`REBIRTH #${rebirths + 1}! +150% PERMANENT BOOST! 💎`, window.innerWidth / 2, window.innerHeight / 2, '#ec4899', true);
  };

  // Upgrade Purchase
  const handleBuyUpgrade = (upgradeId: string) => {
    const upg = upgrades.find((u) => u.id === upgradeId);
    if (!upg || blox < upg.cost) return;

    setBlox((prev) => prev - upg.cost);
    setUpgrades((prev) =>
      prev.map((u) => {
        if (u.id === upgradeId) {
          return {
            ...u,
            level: u.level + 1,
            cost: Math.round(u.cost * 1.6)
          };
        }
        return u;
      })
    );
    if (!soundMuted) sounds.playRetro('coin');
  };

  // Egg Hatching Gacha
  const handleHatchEgg = (eggType: 'starter_egg' | 'cyber_egg' | 'godly_egg', cost: number) => {
    if (blox < cost) return;
    setBlox((prev) => prev - cost);

    const pool = PET_POOL[eggType];
    const pickedPet = pool[Math.floor(Math.random() * pool.length)];

    setHatchingEgg({
      eggType,
      isWobbling: true,
      hatchedPet: null
    });

    if (!soundMuted) sounds.playRetro('coin');

    // Wobble 1.2s then reveal
    setTimeout(() => {
      setHatchingEgg({
        eggType,
        isWobbling: false,
        hatchedPet: pickedPet
      });
      if (!soundMuted) sounds.playEggHatch();

      // Add to inventory & auto-equip if less than 3
      setPetInventory((prev) => [...prev, pickedPet]);
      setEquippedPets((prev) => {
        if (prev.length < 3) {
          return [...prev, pickedPet];
        }
        return prev;
      });
    }, 1400);
  };

  // Cast Sabotage Spells vs Opponent
  const handleCastSpell = (spellType: 'smoke' | 'freeze' | 'rocket' | 'shield', costDiamonds: number) => {
    if (diamonds < costDiamonds) return;
    setDiamonds((prev) => prev - costDiamonds);

    if (spellType === 'rocket') {
      setIsFrenzy(true);
      setFrenzyTimer(6);
      if (!soundMuted) sounds.playFrenzy();
      addFloatingText('TURBO ROCKET ACTIVATED! 🚀 (5X CLICK)', window.innerWidth / 2, window.innerHeight / 2, '#38bdf8', true);
    } else if (spellType === 'shield') {
      setShieldActive(true);
      if (!soundMuted) sounds.playRetro('powerup');
      addFloatingText('FIREWALL SHIELD READY! 🛡️', window.innerWidth / 2, window.innerHeight / 2, '#10b981', true);
    } else {
      // Smoke or Freeze on Opponent
      if (!soundMuted) sounds.playRetro('shoot');
      addFloatingText(`SABOTAGE SENT: ${spellType.toUpperCase()}! 💣`, window.innerWidth / 2, window.innerHeight / 2, '#f43f5e', true);
    }
  };

  // Check Win Condition
  const checkVictory = (currentBlox: number) => {
    if (currentBlox >= TARGET_GOAL && !isGameOver) {
      setIsGameOver(true);
      setWinner('me');
      if (!soundMuted) sounds.playVictory();

      // Record high score & sync room
      updateStudentArcadeScore('roblox_clicker', currentBlox);
      if (roomData) {
        updateDuelProgress(roomData.roomCode, isHost, {
          score: currentBlox,
          progress: 100,
          finishedAt: Date.now()
        }, isHost ? roomData.host.id : roomData.guest?.id, studentName);
      }
      if (onFinish) onFinish(currentBlox);
    }
  };

  const triggerOpponentWin = () => {
    setIsGameOver(true);
    setWinner('opponent');
    if (!soundMuted) sounds.playOof();
    if (onFinish) onFinish(blox);
  };

  const myProgress = Math.min(100, Math.round((blox / TARGET_GOAL) * 100));
  const oppProgress = Math.min(100, Math.round((opponentBlox / TARGET_GOAL) * 100));

  return (
    <div className="w-full max-w-5xl mx-auto p-3 sm:p-5 select-none font-sans relative overflow-hidden bg-slate-950 rounded-3xl border-2 border-indigo-500/40 shadow-2xl text-white">
      {/* Background Roblox Grid Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* Floating Damage/Coin Numbers */}
      {floatingTexts.map((ft) => (
        <div
          key={ft.id}
          style={{ left: ft.x, top: ft.y }}
          className={`fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 animate-bounce font-black text-sm sm:text-base drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] ${
            ft.isCrit ? 'text-amber-300 scale-125 font-mono' : 'text-cyan-300'
          }`}
        >
          {ft.text}
        </div>
      ))}

      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-3 mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/60 via-slate-900 to-indigo-900/60 border border-purple-500/30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-rose-500 to-indigo-600 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/30 ring-2 ring-amber-400/40 animate-pulse">
            🟥
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white font-heading">
                ROBLOX CYBER BLOX DUEL 1v1
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-black border border-rose-500/40 uppercase">
                Roblox Simulator
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {lang === 'en'
                ? 'Click, Hatch Pets, Rebirth & Beat your rival to 50,000 Blox!'
                : 'Dă click, cumpără Upgrade-uri, eclozează Animăluțe și învinge-ți rivalul la 50.000 Blox!'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => sounds.toggle()}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
          {onBack && (
            <button
              onClick={() => {
                sounds.playClick();
                onBack();
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-xs font-bold border border-slate-700 hover:border-rose-500 transition"
            >
              {lang === 'en' ? 'Exit Duel' : 'Ieși din Duel'}
            </button>
          )}
        </div>
      </div>

      {/* Real-time 1v1 Race Obby Track */}
      <div className="mb-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{studentAvatar}</span>
            <span className="font-bold text-amber-300">{studentName} (Tu)</span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
              {blox.toLocaleString()} / {TARGET_GOAL.toLocaleString()} Blox
            </span>
          </div>

          <div className="flex items-center gap-2 text-rose-300">
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
              {opponentBlox.toLocaleString()} / {TARGET_GOAL.toLocaleString()} Blox
            </span>
            <span className="font-bold">{opponentName}</span>
            <span className="text-lg">{opponentAvatar}</span>
          </div>
        </div>

        {/* Dual Race Bar */}
        <div className="space-y-2">
          {/* My Track */}
          <div className="relative w-full h-4 bg-slate-950 rounded-full border border-amber-500/30 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 transition-all duration-300 rounded-full"
              style={{ width: `${myProgress}%` }}
            />
            <div
              className="absolute top-0 transform -translate-x-1/2 text-xs transition-all duration-300"
              style={{ left: `${Math.max(4, Math.min(96, myProgress))}%` }}
            >
              🏃‍♂️
            </div>
          </div>

          {/* Opponent Track */}
          <div className="relative w-full h-4 bg-slate-950 rounded-full border border-rose-500/30 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 transition-all duration-300 rounded-full"
              style={{ width: `${oppProgress}%` }}
            />
            <div
              className="absolute top-0 transform -translate-x-1/2 text-xs transition-all duration-300"
              style={{ left: `${Math.max(4, Math.min(96, oppProgress))}%` }}
            >
              🤖
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Arena Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Col: Roblox Tycoon Upgrades & Egg Shop (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Pet Eggs Gacha Section */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-indigo-950/40 border border-indigo-500/30 shadow-lg">
            <h3 className="text-xs font-black uppercase tracking-wider text-indigo-300 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Egg className="w-4 h-4 text-amber-400" />
                {lang === 'en' ? 'Roblox Pet Eggs' : 'Ouă Animăluțe (Gacha)'}
              </span>
              <span className="text-[10px] text-amber-300 font-mono">Max 3 Echipate</span>
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {/* Starter Egg */}
              <button
                type="button"
                onClick={() => handleHatchEgg('starter_egg', 50)}
                disabled={blox < 50}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-between gap-1 transition text-center cursor-pointer ${
                  blox >= 50
                    ? 'bg-amber-950/40 border-amber-500/50 hover:border-amber-400 hover:scale-105 shadow-md shadow-amber-500/10'
                    : 'bg-slate-900/60 border-slate-800 opacity-50 cursor-not-allowed'
                }`}
              >
                <span className="text-2xl animate-bounce">🥚</span>
                <span className="text-[10px] font-bold text-amber-200">Starter Egg</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">50 Blox</span>
              </button>

              {/* Cyber Egg */}
              <button
                type="button"
                onClick={() => handleHatchEgg('cyber_egg', 500)}
                disabled={blox < 500}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-between gap-1 transition text-center cursor-pointer ${
                  blox >= 500
                    ? 'bg-emerald-950/40 border-emerald-500/50 hover:border-emerald-400 hover:scale-105 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900/60 border-slate-800 opacity-50 cursor-not-allowed'
                }`}
              >
                <span className="text-2xl animate-pulse">🧪</span>
                <span className="text-[10px] font-bold text-emerald-200">Cyber Egg</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">500 Blox</span>
              </button>

              {/* Godly Dominus Egg */}
              <button
                type="button"
                onClick={() => handleHatchEgg('godly_egg', 3000)}
                disabled={blox < 3000}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-between gap-1 transition text-center cursor-pointer ${
                  blox >= 3000
                    ? 'bg-purple-950/40 border-purple-500/50 hover:border-purple-400 hover:scale-105 shadow-md shadow-purple-500/10'
                    : 'bg-slate-900/60 border-slate-800 opacity-50 cursor-not-allowed'
                }`}
              >
                <span className="text-2xl animate-spin">👑</span>
                <span className="text-[10px] font-bold text-purple-200">Dominus Egg</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">3.000 Blox</span>
              </button>
            </div>

            {/* Equipped Pets Bar */}
            <div className="mt-3 pt-3 border-t border-indigo-900/40">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                {lang === 'en' ? 'Equipped Pets:' : 'Animăluțe Active:'}
              </span>
              <div className="flex items-center gap-1.5">
                {equippedPets.map((pet, idx) => (
                  <div
                    key={idx}
                    className="flex-1 p-1.5 rounded-lg bg-slate-950 border border-indigo-500/30 flex items-center gap-1 text-center justify-center text-[10px] font-mono text-indigo-200"
                  >
                    <span>{pet.icon}</span>
                    <span className="font-bold truncate">{pet.name.split(' ')[0]}</span>
                    <span className="text-[9px] text-emerald-400 font-bold">+{pet.multiplier}x</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upgrades Shop */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                {lang === 'en' ? 'Hardware Tycoon Upgrades' : 'Magazin Hardware TIC'}
              </span>
            </h3>

            <div className="space-y-2">
              {upgrades.map((u) => {
                const canAfford = blox >= u.cost;
                return (
                  <div
                    key={u.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition ${
                      canAfford ? 'bg-slate-950/80 border-slate-700' : 'bg-slate-950/40 border-slate-800/60 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-lg shrink-0">
                        {u.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{lang === 'en' ? u.nameEn : u.nameRo}</span>
                          <span className="text-[10px] font-mono text-amber-400">Nv.{u.level}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {lang === 'en' ? u.descEn : u.descRo}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleBuyUpgrade(u.id)}
                      disabled={!canAfford}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition shrink-0 cursor-pointer ${
                        canAfford
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 active:scale-95'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {u.cost.toLocaleString()} B
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Col: Massive Blox Core Clicker Button & Stats (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-between gap-4 p-4 rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950/20 to-slate-900 border-2 border-indigo-500/40 shadow-2xl relative overflow-hidden">
          {/* Frenzy Banner */}
          {isFrenzy && (
            <div className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 text-slate-950 text-center font-black text-xs uppercase tracking-wider animate-pulse flex items-center justify-center gap-2 shadow-lg shadow-rose-500/30">
              <Flame className="w-4 h-4 text-slate-950 animate-bounce" />
              <span>MEGA FRENZY 5X BOOST ACTIVE! ({frenzyTimer}s)</span>
              <Flame className="w-4 h-4 text-slate-950 animate-bounce" />
            </div>
          )}

          {/* Stats Bar */}
          <div className="w-full grid grid-cols-3 gap-2">
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Blox Points</div>
              <div className="text-base sm:text-lg font-black font-mono text-amber-400">
                {blox.toLocaleString()}
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Auto-CPS</div>
              <div className="text-base sm:text-lg font-black font-mono text-emerald-400">
                +{totalCPS.toLocaleString()}/s
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Rebirths 🔁</div>
              <div className="text-base sm:text-lg font-black font-mono text-pink-400">
                {rebirths} (x{rebirthMultiplier.toFixed(1)})
              </div>
            </div>
          </div>

          {/* MAIN GIANT CLICK BUTTON */}
          <div className="relative my-auto flex flex-col items-center justify-center">
            {/* Pulsing Aura */}
            <div className="absolute w-52 h-52 bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-indigo-500/20 rounded-full blur-2xl pointer-events-none animate-pulse" />

            <button
              id="roblox-main-clicker-button"
              type="button"
              onClick={handleMainClick}
              className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-gradient-to-tr from-rose-600 via-amber-500 to-yellow-400 border-4 border-yellow-200 shadow-[0_0_40px_rgba(245,158,11,0.5)] flex flex-col items-center justify-center text-center cursor-pointer transition-transform duration-75 active:scale-90 hover:scale-105 group select-none"
            >
              <div className="text-5xl sm:text-6xl group-hover:rotate-12 transition-transform drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">
                🧱
              </div>
              <span className="text-sm sm:text-base font-black text-slate-950 font-heading tracking-wider mt-1 drop-shadow">
                CLICK BLOX!
              </span>
              <span className="text-[11px] font-mono font-bold text-rose-950 bg-yellow-300/80 px-2 py-0.5 rounded-full mt-0.5">
                +{totalClickValue.toLocaleString()} / click
              </span>
            </button>
          </div>

          {/* Rebirth Button */}
          <div className="w-full flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block">Prestige Rebirth:</span>
              <span className="text-xs font-bold text-pink-300">
                Cost: {rebirthCost.toLocaleString()} Blox (+150% Boost)
              </span>
            </div>

            <button
              type="button"
              onClick={handleRebirth}
              disabled={blox < rebirthCost}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider font-mono transition flex items-center gap-1.5 cursor-pointer ${
                blox >= rebirthCost
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-lg shadow-pink-600/30 active:scale-95 animate-bounce'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Rebirth 💎</span>
            </button>
          </div>
        </div>

        {/* Right Col: PvP Sabotages & Rival Status (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* PvP Sabotage Spells */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
            <h3 className="text-xs font-black uppercase tracking-wider text-rose-300 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Swords className="w-4 h-4 text-rose-400" />
                {lang === 'en' ? 'PvP Sabotage Spells' : 'Vrăji & Sabotaj Duel'}
              </span>
              <span className="text-[10px] text-cyan-300 font-mono">💎 {diamonds} Diamante</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleCastSpell('rocket', 5)}
                disabled={diamonds < 5}
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1 transition ${
                  diamonds >= 5
                    ? 'bg-cyan-950/40 border-cyan-500/50 hover:border-cyan-400 hover:scale-105 cursor-pointer'
                    : 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed'
                }`}
              >
                <span className="text-xl">🚀</span>
                <span className="text-[10px] font-bold text-cyan-300">Turbo 5X</span>
                <span className="text-[9px] font-mono text-slate-400">5 💎 (6s)</span>
              </button>

              <button
                type="button"
                onClick={() => handleCastSpell('shield', 4)}
                disabled={diamonds < 4}
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1 transition ${
                  diamonds >= 4
                    ? 'bg-emerald-950/40 border-emerald-500/50 hover:border-emerald-400 hover:scale-105 cursor-pointer'
                    : 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed'
                }`}
              >
                <span className="text-xl">🛡️</span>
                <span className="text-[10px] font-bold text-emerald-300">Firewall</span>
                <span className="text-[9px] font-mono text-slate-400">4 💎</span>
              </button>

              <button
                type="button"
                onClick={() => handleCastSpell('smoke', 3)}
                disabled={diamonds < 3}
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1 transition ${
                  diamonds >= 3
                    ? 'bg-purple-950/40 border-purple-500/50 hover:border-purple-400 hover:scale-105 cursor-pointer'
                    : 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed'
                }`}
              >
                <span className="text-xl">🌫️</span>
                <span className="text-[10px] font-bold text-purple-300">Lag Bomb</span>
                <span className="text-[9px] font-mono text-slate-400">3 💎 (Rival)</span>
              </button>

              <button
                type="button"
                onClick={() => handleCastSpell('freeze', 6)}
                disabled={diamonds < 6}
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1 transition ${
                  diamonds >= 6
                    ? 'bg-rose-950/40 border-rose-500/50 hover:border-rose-400 hover:scale-105 cursor-pointer'
                    : 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed'
                }`}
              >
                <span className="text-xl">⚡</span>
                <span className="text-[10px] font-bold text-rose-300">EMP Shock</span>
                <span className="text-[9px] font-mono text-slate-400">6 💎 (Freeze)</span>
              </button>
            </div>
          </div>

          {/* Opponent Live Radar Card */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-rose-500/30 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{opponentAvatar}</span>
              <div>
                <h4 className="text-xs font-bold text-rose-300">{opponentName}</h4>
                <span className="text-[10px] text-slate-400">Rival Live Status</span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Blox Rival:</span>
                <span className="font-bold text-rose-400">{opponentBlox.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Obby Race:</span>
                <span className="font-bold text-amber-300">{oppProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Egg Hatching Gacha Animation Overlay */}
      {hatchingEgg && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border-2 border-indigo-500/60 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-amber-300 font-heading uppercase tracking-wider">
              {hatchingEgg.hatchedPet ? 'PET UNBOXED!' : 'HATCHING EGG...'}
            </h3>

            <div className="py-6 flex flex-col items-center justify-center">
              {hatchingEgg.isWobbling && (
                <div className="text-7xl animate-bounce drop-shadow-[0_10px_20px_rgba(245,158,11,0.4)]">
                  🥚
                </div>
              )}

              {hatchingEgg.hatchedPet && (
                <div className="space-y-3 animate-in zoom-in-50">
                  <div className="text-7xl drop-shadow-[0_10px_20px_rgba(99,102,241,0.5)]">
                    {hatchingEgg.hatchedPet.icon}
                  </div>
                  <div>
                    <h4 className={`text-xl font-black ${hatchingEgg.hatchedPet.color}`}>
                      {hatchingEgg.hatchedPet.name}
                    </h4>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold">
                      {hatchingEgg.hatchedPet.rarity}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-xs font-mono">
                    <span className="text-amber-400 font-bold">+{hatchingEgg.hatchedPet.multiplier}x Click</span>
                    <span className="text-emerald-400 font-bold">+{hatchingEgg.hatchedPet.cps} CPS</span>
                  </div>
                </div>
              )}
            </div>

            {hatchingEgg.hatchedPet && (
              <button
                type="button"
                onClick={() => setHatchingEgg(null)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                {lang === 'en' ? 'Equip & Continue' : 'Echipează & Continuă'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Mini-Boss TIC Invasion QTE */}
      {activeBoss && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border-2 border-rose-500/60 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{activeBoss.icon}</span>
                <div>
                  <h3 className="text-base font-black text-rose-400 uppercase tracking-wider">
                    {activeBoss.name}
                  </h3>
                  <span className="text-[10px] text-slate-400">Raid TIC Fulger</span>
                </div>
              </div>

              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-xs font-mono font-bold text-rose-300">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>{activeBoss.timeLeft}s</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-semibold text-slate-200">
              {lang === 'en' ? activeBoss.question.questionEn : activeBoss.question.questionRo}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {activeBoss.question.options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleBossAnswer(idx)}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-rose-900/60 border border-slate-700 hover:border-rose-500 text-xs font-bold text-left transition cursor-pointer text-white active:scale-95"
                >
                  {opt}
                </button>
              ))}
            </div>

            <p className="text-[10px] text-slate-400 text-center">
              {lang === 'en'
                ? 'Defeat the boss to gain +2,500 Blox & 10s Mega Frenzy 5X!'
                : 'Răspunde corect pentru +2.500 Blox și 10 secunde de Mega Frenzy 5X!'}
            </p>
          </div>
        </div>
      )}

      {/* MODAL 3: Match Results & Victory Screen */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in zoom-in-95">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 max-w-md w-full text-center shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-amber-500/30">
              {winner === 'me' ? '👑' : '💀'}
            </div>

            <h3 className="text-2xl font-black text-white font-heading">
              {winner === 'me'
                ? (lang === 'en' ? 'VICTORY ROYALE!' : 'VICTORIE ÎN DUEL!')
                : (lang === 'en' ? 'RIVAL WON!' : 'RIVALUL A CÂȘTIGAT!')}
            </h3>

            <p className="text-xs text-slate-300">
              {winner === 'me'
                ? (lang === 'en'
                    ? `Congratulations! You reached the 50,000 Blox summit first! Score: ${blox.toLocaleString()} Blox.`
                    : `Felicitări! Ai atins primul pragul de 50.000 Blox! Punctaj: ${blox.toLocaleString()} Blox.`)
                : (lang === 'en'
                    ? `${opponentName} reached the goal first. Train your pets and try again!`
                    : `${opponentName} a atins primul obiectivul. Antrenează-ți animăluțele și încearcă din nou!`)}
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-slate-400 block">Blox-ul Tău:</span>
                <span className="font-bold text-amber-400 text-sm">{blox.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Blox Rival:</span>
                <span className="font-bold text-rose-400 text-sm">{opponentBlox.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setBlox(0);
                  setOpponentBlox(0);
                  setIsGameOver(false);
                  setWinner(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Rematch' : 'Revanșă'}</span>
              </button>

              {onBack && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onBack();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  {lang === 'en' ? 'Exit to Lobby' : 'Înapoi în Lobby'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
