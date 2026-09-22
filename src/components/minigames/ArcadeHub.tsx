import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { TypingGame } from './TypingGame';
import { MouseAgilityGame } from './MouseAgilityGame';
import { Game2048Binary } from './Game2048Binary';
import { CyberSafeDetective } from './CyberSafeDetective';
import { FileOrganizerGame } from './FileOrganizerGame';
import { BinaryFactoryGame } from './BinaryFactoryGame';
import { AlgorithmMazeGame } from './AlgorithmMazeGame';
import { FirewallDefenderGame } from './FirewallDefenderGame';
import { PCBuilderGame } from './PCBuilderGame';
import { RGBPixelMasterGame } from './RGBPixelMasterGame';
import { ByteSliderGame } from './ByteSliderGame';
import { FileDropGame } from './FileDropGame';
import { VirusSweeperGame } from './VirusSweeperGame';
import { CyberDinoRunner } from './CyberDinoRunner';
import { RedstoneLogicLab } from './RedstoneLogicLab';
import {
  Gamepad2,
  Keyboard,
  MousePointer,
  Binary,
  ShieldAlert,
  Folder,
  Zap,
  Bot,
  ShieldCheck,
  Trophy,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Flame,
  HardDrive,
  School,
  Cpu,
  Palette,
  Layers,
  FileDown,
  Biohazard,
  Swords,
  Footprints,
  Boxes,
} from 'lucide-react';

interface ArcadeHubProps {
  studentName?: string;
  onBackToCatalog: () => void;
  onOpenDuel?: () => void;
}

type ActiveGame = 'hub' | 'typing' | 'mouse' | '2048' | 'pcbuilder' | 'detective' | 'files' | 'binary_factory' | 'maze' | 'firewall' | 'rgb_pixel' | 'byte_slider' | 'file_drop' | 'virus_sweeper' | 'cyber_dino' | 'redstone_lab';

export const ArcadeHub: React.FC<ArcadeHubProps> = ({ studentName, onBackToCatalog, onOpenDuel }) => {
  const { lang } = useLanguage();
  const [activeGame, setActiveGame] = useState<ActiveGame>('hub');

  // Load High Scores
  const typingHighScore = (() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_typing') || '0');
    } catch {
      return 0;
    }
  })();

  const mouseHighScore = (() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_mouse') || '0');
    } catch {
      return 0;
    }
  })();

  const game2048HighScore = (() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_2048') || '0');
    } catch {
      return 0;
    }
  })();

  const cyberHighScore = (() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_cyber') || '0');
    } catch {
      return 0;
    }
  })();

  const filesHighScore = (() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_files') || '0');
    } catch {
      return 0;
    }
  })();

  const binaryFactoryHighScore = (() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_binary_factory') || '0');
    } catch {
      return 0;
    }
  })();

  const mazeHighScore = (() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_maze') || '0');
    } catch {
      return 0;
    }
  })();

  const firewallHighScore = (() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_firewall') || '0');
    } catch {
      return 0;
    }
  })();

  const pcBuilderHighScore = (() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_pcbuilder') || '0');
    } catch {
      return 0;
    }
  })();

  const rgbHighScore = (() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_rgb_pixels') || '0');
    } catch {
      return 0;
    }
  })();

  const byteSliderHighScore = (() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_byte_slider') || '0');
    } catch {
      return 0;
    }
  })();

  const fileDropHighScore = (() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_file_drop') || '0');
    } catch {
      return 0;
    }
  })();

  const virusSweeperHighScore = (() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_virus_sweeper') || '0');
    } catch {
      return 0;
    }
  })();

  const cyberDinoHighScore = (() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_cyber_dino') || '0');
    } catch {
      return 0;
    }
  })();

  const redstoneLabHighScore = (() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_redstone_lab') || '0');
    } catch {
      return 0;
    }
  })();

  const avatar = (() => {
    try {
      return localStorage.getItem('arkedo_student_avatar') || '🎓';
    } catch {
      return '🎓';
    }
  })();

  if (activeGame === 'redstone_lab') {
    return (
      <RedstoneLogicLab
        onBack={() => setActiveGame('hub')}
      />
    );
  }

  if (activeGame === 'cyber_dino') {
    return (
      <CyberDinoRunner
        onBack={() => setActiveGame('hub')}
        studentName={studentName}
      />
    );
  }

  if (activeGame === 'typing') {
    return <TypingGame onBack={() => setActiveGame('hub')} studentName={studentName} />;
  }

  if (activeGame === 'mouse') {
    return <MouseAgilityGame onBack={() => setActiveGame('hub')} studentName={studentName} />;
  }

  if (activeGame === '2048') {
    return <Game2048Binary onBack={() => setActiveGame('hub')} studentName={studentName} />;
  }

  if (activeGame === 'pcbuilder') {
    return <PCBuilderGame onBack={() => setActiveGame('hub')} studentName={studentName} />;
  }

  if (activeGame === 'rgb_pixel') {
    return <RGBPixelMasterGame onBack={() => setActiveGame('hub')} studentName={studentName} />;
  }

  if (activeGame === 'byte_slider') {
    return <ByteSliderGame onBack={() => setActiveGame('hub')} studentName={studentName} />;
  }

  if (activeGame === 'file_drop') {
    return <FileDropGame onBack={() => setActiveGame('hub')} studentName={studentName} />;
  }

  if (activeGame === 'virus_sweeper') {
    return <VirusSweeperGame onBack={() => setActiveGame('hub')} studentName={studentName} />;
  }

  if (activeGame === 'detective') {
    return <CyberSafeDetective onBack={() => setActiveGame('hub')} studentName={studentName} />;
  }

  if (activeGame === 'files') {
    return <FileOrganizerGame onBack={() => setActiveGame('hub')} studentName={studentName} />;
  }

  if (activeGame === 'binary_factory') {
    return <BinaryFactoryGame onBack={() => setActiveGame('hub')} studentName={studentName} />;
  }

  if (activeGame === 'maze') {
    return <AlgorithmMazeGame onBack={() => setActiveGame('hub')} studentName={studentName} />;
  }

  if (activeGame === 'firewall') {
    return <FirewallDefenderGame onBack={() => setActiveGame('hub')} studentName={studentName} />;
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-900 border-2 border-indigo-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => {
                  sounds.playClick();
                  onBackToCatalog();
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'en' ? 'Back to Missions' : 'Înapoi la Cursuri'}</span>
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                <Gamepad2 className="w-4 h-4 text-indigo-400" />
                <span>{lang === 'en' ? 'ARKEDO Arcade Lab' : 'Laboratorul Arcade TIC'}</span>
              </div>

              {onOpenDuel && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenDuel();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white border border-rose-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-lg shadow-rose-600/30"
                >
                  <Swords className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>{lang === 'en' ? 'Duel Arena 1v1' : 'Arena Duel 1v1'}</span>
                </button>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white font-heading tracking-tight">
              {lang === 'en' ? 'Digital Agility & Logic Mini-Games' : 'Mini-Jocuri Educative & Antrenament TIC'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-2.5">
              {lang === 'en'
                ? 'Enhance your typing speed, mouse accuracy, and binary thinking with fast-paced educational challenges!'
                : 'Dezvoltă-ți viteza la tastatură, precizia cu mouse-ul și gândirea logică binară prin jocuri rapide și antrenante!'}
            </p>
          </div>

          {/* Student Status Card */}
          <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-4 flex items-center gap-3.5 shadow-xl shrink-0 backdrop-blur">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow">
              {avatar}
            </div>
            <div>
              <div className="text-[11px] font-mono text-indigo-300">
                {lang === 'en' ? 'Player Profile' : 'Profil Jucător'}
              </div>
              <div className="text-sm font-black text-white font-heading">
                {studentName || (lang === 'en' ? 'Guest Cadet' : 'Elev Neînregistrat')}
              </div>
              <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
                14 {lang === 'en' ? 'Arcade Games Available' : 'Jocuri Disponibile'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured 1v1 Realtime Duel Arena Card */}
      {onOpenDuel && (
        <div className="relative overflow-hidden bg-gradient-to-r from-rose-950/70 via-slate-900 to-amber-950/60 border-2 border-rose-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shrink-0 mt-1 sm:mt-0 ring-2 ring-amber-400/40">
                <Swords className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/40">
                    MULTIPLAYER 1V1
                  </span>
                  <span className="text-xs text-amber-300 font-mono font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    {lang === 'en' ? 'Live Room System' : 'Camere în Timp Real'}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white font-heading mt-0.5">
                  {lang === 'en' ? 'Duel Arena: Challenge a Classmate!' : 'Arena Duel: Provoacă un Coleg de Bancă!'}
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  {lang === 'en'
                    ? 'Pick Cyber Sprint (Typing Race) or Quiz Blitz (TIC trivia) and compete head-to-head with live score sync.'
                    : 'Alege Cyber Sprint (cursă de tastare) sau Quiz Blitz (cultură TIC) și concurează 1 la 1 cu sincronizare instantanee.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                onOpenDuel();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 via-amber-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 cursor-pointer shrink-0 active:scale-95"
            >
              <Swords className="w-4 h-4" />
              <span>{lang === 'en' ? 'Launch Duel 1v1' : 'Lansează Duel 1v1'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mini-Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Featured Game: Minecraft Redstone Logic Lab */}
        <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 border-2 border-rose-500/60 hover:border-rose-400 rounded-3xl p-5 shadow-2xl flex flex-col justify-between gap-4 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden sm:col-span-2 lg:col-span-3">
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-600/20 border-2 border-rose-500/50 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform shadow-lg shadow-rose-600/20 shrink-0 text-2xl">
                ⛏️
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                    ⭐ Minecraft TIC Edition
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700 text-[10px] font-mono">
                    10 Misiuni Logice + Porți AND/OR/XOR/Binar
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-heading group-hover:text-rose-300 transition-colors">
                  {lang === 'en' ? 'Redstone Logic Lab ⚡' : 'Laboratorul de Circuite Redstone ⛏️'}
                </h3>
                <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
                  {lang === 'en'
                    ? 'Explore binary signals, redstone torches, inverters (NOT), security gates (AND, OR, XOR, NAND) and binary adders in an authentic voxel Minecraft environment!'
                    : 'Explorează semnalele binare, torțele de redstone, invertoarele (NOT), porțile de securitate (AND, OR, XOR, NAND) și sumatoarele binare într-un laborator interactiv inspirat din Minecraft!'}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-800">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-stone-950 border border-stone-800 text-xs font-mono text-cyan-300">
                <span>💎</span>
                <span>{redstoneLabHighScore} XP</span>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveGame('redstone_lab');
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-rose-600/40 cursor-pointer active:scale-95"
              >
                <span>{lang === 'en' ? 'Enter Lab' : 'Intră în Laborator'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Game 1: Speed Typing */}
        <div className="bg-slate-900/90 border-2 border-slate-700/80 hover:border-cyan-500/60 rounded-3xl p-5 shadow-xl flex flex-col justify-between gap-4 transition-all duration-300 group hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border-2 border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Keyboard className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>{typingHighScore} WPM</span>
              </div>
            </div>

            <div className="inline-block px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 text-[10px] font-bold uppercase tracking-wider mb-2">
              {lang === 'en' ? 'Typing Sprint' : 'Viteză la Tastatură'}
            </div>

            <h3 className="text-lg font-black text-white font-heading group-hover:text-cyan-300 transition-colors">
              {lang === 'en' ? 'Speed Typing TIC' : 'Vitezomanul Tastaturii'}
            </h3>

            <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
              {lang === 'en'
                ? 'Type curriculum computer science words under time pressure. Tracks words-per-minute (WPM) and combos.'
                : 'Tastează termeni reali din TIC (procesor, memorie, folder, rețea) contra cronometru. Măsoară WPM și acuratețea.'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">⏱️ 30s / 60s</span>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveGame('typing');
              }}
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-cyan-600/30 cursor-pointer active:scale-95"
            >
              <span>{lang === 'en' ? 'Play Now' : 'Joacă Acum'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Game 2: Mouse Agility */}
        <div className="bg-slate-900/90 border-2 border-slate-700/80 hover:border-emerald-500/60 rounded-3xl p-5 shadow-xl flex flex-col justify-between gap-4 transition-all duration-300 group hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <MousePointer className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>{mouseHighScore} pts</span>
              </div>
            </div>

            <div className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-2">
              {lang === 'en' ? 'Precision & Reflexes' : 'Coordonare & Reflexe'}
            </div>

            <h3 className="text-lg font-black text-white font-heading group-hover:text-emerald-300 transition-colors">
              {lang === 'en' ? 'Mouse Master' : 'Maestrul Mouse-ului'}
            </h3>

            <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
              {lang === 'en'
                ? 'Sharpen mouse skills: single left-click, fast double-click, context right-click, and file drag & drop into folders.'
                : 'Exersează comenzile esențiale: Click Stânga, Dublu-Click Rapid, Click Dreapta pe dosare și Glisare Drag & Drop!'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">⏱️ 45s</span>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveGame('mouse');
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
            >
              <span>{lang === 'en' ? 'Play Now' : 'Joacă Acum'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Game 3: 2048 Binary */}
        <div className="bg-slate-900/90 border-2 border-slate-700/80 hover:border-amber-500/60 rounded-3xl p-5 shadow-xl flex flex-col justify-between gap-4 transition-all duration-300 group hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border-2 border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Binary className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-mono text-amber-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>{game2048HighScore} pts</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <div className="inline-block px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                {lang === 'en' ? 'Binary Logic' : 'Gândire & Logică Binară'}
              </div>
              <div className="inline-block px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                ⭐ +3.000 pts Bonus 2048
              </div>
            </div>

            <h3 className="text-lg font-black text-white font-heading group-hover:text-amber-300 transition-colors">
              {lang === 'en' ? '2048 Binary Bytes' : '2048 Binar TIC'}
            </h3>

            <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
              {lang === 'en'
                ? 'Slide & merge powers of 2. Enhanced points for higher difficulty + a HUGE 3,000 pts extra bonus for synthesizing 2048 B (2 KB)!'
                : 'Unește puterile lui 2: 2 B, 4 B... Punctaj mărit pentru dificultate ridicată și un BONUS EXTRA de +3.000 puncte pentru cine atinge 2048 B!'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">🧠 Puzzle</span>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveGame('2048');
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-amber-600/30 cursor-pointer active:scale-95"
            >
              <span>{lang === 'en' ? 'Play Now' : 'Joacă Acum'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Game 4: PC Builder (Constructorul de PC-uri - Misiunea Hardware) */}
        <div className="bg-slate-900/90 border-2 border-slate-700/80 hover:border-blue-500/60 rounded-3xl p-5 shadow-xl flex flex-col justify-between gap-4 transition-all duration-300 group hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border-2 border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-mono text-blue-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>{pcBuilderHighScore} pts</span>
              </div>
            </div>

            <div className="inline-block px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-2">
              {lang === 'en' ? 'Hardware & Architecture' : 'Sisteme de Calcul & Hardware'}
            </div>

            <h3 className="text-lg font-black text-white font-heading group-hover:text-blue-300 transition-colors">
              {lang === 'en' ? 'PC Builder: Hardware Mission' : 'Constructorul de PC-uri'}
            </h3>

            <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
              {lang === 'en'
                ? 'Mount CPU, RAM, GPU, SSD, and PSU into correct motherboard slots. Avoid short circuits and boot up your PC!'
                : 'Trage CPU-ul, plăcuțele RAM, placa video, SSD-ul și sursa în sloturile corecte. Evită scurtcircuitele și pornește PC-ul!'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">🖥️ 3 Niveluri & POST</span>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveGame('pcbuilder');
              }}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-blue-600/30 cursor-pointer active:scale-95"
            >
              <span>{lang === 'en' ? 'Assemble' : 'Asamblează'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Game 5: Cyber Dino: Matrix Rush (Dinozaurul Chrome TIC) */}
        <div className="bg-slate-900/90 border-2 border-emerald-500/60 hover:border-emerald-400 rounded-3xl p-5 shadow-xl flex flex-col justify-between gap-4 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden bg-gradient-to-b from-emerald-950/30 to-slate-900">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🦖
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>{cyberDinoHighScore} pts</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                {lang === 'en' ? 'Arcade Runner' : 'Chrome Edition'}
              </div>
              <span className="text-[10px] text-teal-400 font-mono font-bold">⚡ Viteză Progresivă</span>
            </div>

            <h3 className="text-lg font-black text-white font-heading group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
              <span>Cyber Dino: Matrix Rush</span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </h3>

            <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
              {lang === 'en'
                ? 'Cyberpunk runner inspired by Google Dino! Jump capacitors, duck Wi-Fi drones, collect bits and blast glitch bosses with progressive speed!'
                : 'Adaptarea cyberpunk a jocului Google Dino! Sari peste condensatori, alunecă sub drone Wi-Fi, colectează biți și accelerează progresiv prin Matrix!'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-emerald-400 font-mono">⚡ 3 Moduri & Lasere</span>
            <button
              id="arcade-btn-start-cyber-dino"
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveGame('cyber_dino');
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
            >
              <span>{lang === 'en' ? 'Run' : 'Joacă'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Game 6: Cyber-Safe Detective */}
        <div className="bg-slate-900/90 border-2 border-slate-700/80 hover:border-rose-500/60 rounded-3xl p-5 shadow-xl flex flex-col justify-between gap-4 transition-all duration-300 group hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border-2 border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-mono text-rose-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>{cyberHighScore} pts</span>
              </div>
            </div>

            <div className="inline-block px-2.5 py-0.5 rounded-md bg-rose-500/10 text-rose-300 text-[10px] font-bold uppercase tracking-wider mb-2">
              {lang === 'en' ? 'Cyber Security' : 'Securitate Digitală'}
            </div>

            <h3 className="text-lg font-black text-white font-heading group-hover:text-rose-300 transition-colors">
              {lang === 'en' ? 'Cyber-Safe Detective' : 'Detectivul Cyber-Safe'}
            </h3>

            <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
              {lang === 'en'
                ? 'Investigate emails, SMS, and popups with the forensic Magnifier. Expose phishing traps and scam prizes!'
                : 'Analizează e-mailuri, SMS-uri și pop-up-uri cu Lupa de Detectiv criminalistică. Depistează capcanele online!'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">🔍 8 Cazuri & Lupă</span>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveGame('detective');
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-rose-600/30 cursor-pointer active:scale-95"
            >
              <span>{lang === 'en' ? 'Investigate' : 'Anchetă'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Game 7: File Organizer Express */}
        <div className="bg-slate-900/90 border-2 border-slate-700/80 hover:border-blue-500/60 rounded-3xl p-5 shadow-xl flex flex-col justify-between gap-4 transition-all duration-300 group hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border-2 border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Folder className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-mono text-blue-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>{filesHighScore} pts</span>
              </div>
            </div>

            <div className="inline-block px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-2">
              {lang === 'en' ? 'File System' : 'Dosare & Extensii'}
            </div>

            <h3 className="text-lg font-black text-white font-heading group-hover:text-blue-300 transition-colors">
              {lang === 'en' ? 'File Organizer Express' : 'Sortatorul de Fișiere'}
            </h3>

            <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
              {lang === 'en'
                ? 'Sort incoming files (.docx, .jpg, .mp3, .zip, .exe) into their correct laboratory folders before the 45s timer ends!'
                : 'Clasifică fișierele (.docx, .jpg, .mp3, .zip, .exe) în dosarele corecte ale laboratorului contra cronometru în 45s!'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">⏱️ 45s Sprint</span>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveGame('files');
              }}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-blue-600/30 cursor-pointer active:scale-95"
            >
              <span>{lang === 'en' ? 'Organize' : 'Sortează'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Game 8: Binary Bit Factory */}
        <div className="bg-slate-900/90 border-2 border-slate-700/80 hover:border-amber-400/60 rounded-3xl p-5 shadow-xl flex flex-col justify-between gap-4 transition-all duration-300 group hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border-2 border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-mono text-amber-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>{binaryFactoryHighScore} pts</span>
              </div>
            </div>

            <div className="inline-block px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-2">
              {lang === 'en' ? 'Binary Electronics' : 'Arhitectură & Biți'}
            </div>

            <h3 className="text-lg font-black text-white font-heading group-hover:text-amber-300 transition-colors">
              {lang === 'en' ? 'Binary Bit Factory' : 'Decodorul Binar (0 și 1)'}
            </h3>

            <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
              {lang === 'en'
                ? 'Turn powers-of-2 switches ON (1) or OFF (0) to encode target decimal numbers into binary bits (4 bits or 1 byte).'
                : 'Comută becurile interactive ale puterilor lui 2 (128, 64, 32... 1) pentru a forma numărul zecimal țintă în binar!'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">💡 4 sau 8 Biți</span>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveGame('binary_factory');
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-amber-600/30 cursor-pointer active:scale-95"
            >
              <span>{lang === 'en' ? 'Decode' : 'Decodifică'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Game 9: Algorithm Maze Robot */}
        <div className="bg-slate-900/90 border-2 border-slate-700/80 hover:border-emerald-500/60 rounded-3xl p-5 shadow-xl flex flex-col justify-between gap-4 transition-all duration-300 group hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>{mazeHighScore} pts</span>
              </div>
            </div>

            <div className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-2">
              {lang === 'en' ? 'Algorithms & Logic' : 'Gândire Algoritmică'}
            </div>

            <h3 className="text-lg font-black text-white font-heading group-hover:text-emerald-300 transition-colors">
              {lang === 'en' ? 'Algorithm Maze Robot' : 'Labirintul Algoritmic'}
            </h3>

            <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
              {lang === 'en'
                ? 'Program sequences of forward movements, 90° rotations, and repeat loops to navigate obstacles and reach servers!'
                : 'Programează secvențe de pași, viraje la 90° și bucle de repetare pentru a ghida robotul printre circuite!'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">🤖 5 Niveluri TIC</span>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveGame('maze');
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
            >
              <span>{lang === 'en' ? 'Program' : 'Programează'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Game 10: Firewall Defender */}
        <div className="bg-slate-900/90 border-2 border-slate-700/80 hover:border-red-500/60 rounded-3xl p-5 shadow-xl flex flex-col justify-between gap-4 transition-all duration-300 group hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-red-500/15 border-2 border-red-500/30 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-mono text-red-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>{firewallHighScore} pts</span>
              </div>
            </div>

            <div className="inline-block px-2.5 py-0.5 rounded-md bg-red-500/10 text-red-300 text-[10px] font-bold uppercase tracking-wider mb-2">
              {lang === 'en' ? 'Network Defense' : 'Securitate & Antivirus'}
            </div>

            <h3 className="text-lg font-black text-white font-heading group-hover:text-red-300 transition-colors">
              {lang === 'en' ? 'Firewall Defender' : 'Scutul Antivirus & Firewall'}
            </h3>

            <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
              {lang === 'en'
                ? 'Inspect inbound network packets by protocol and port. Allow legitimate homework traffic and BLOCK dangerous malware!'
                : 'Inspectează pachetele de rețea după protocol și port. Permite traficul școlar legitim și blochează troienii și virușii!'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">🛡️ 45s Defensă</span>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveGame('firewall');
              }}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-red-600/30 cursor-pointer active:scale-95"
            >
              <span>{lang === 'en' ? 'Defend' : 'Apără'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Game 11: RGB Pixel Master (Grafică Digitală 2D & Pixeli) */}
        <div className="bg-slate-900/90 border-2 border-slate-700/80 hover:border-purple-500/60 rounded-3xl p-5 shadow-xl flex flex-col justify-between gap-4 transition-all duration-300 group hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border-2 border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Palette className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-mono text-purple-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>{rgbHighScore} pts</span>
              </div>
            </div>

            <div className="inline-block px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-300 text-[10px] font-bold uppercase tracking-wider mb-2">
              {lang === 'en' ? '2D Graphics & Colors' : 'Grafică Digitală & Pixeli'}
            </div>

            <h3 className="text-lg font-black text-white font-heading group-hover:text-purple-300 transition-colors">
              {lang === 'en' ? 'RGB Pixel Master' : 'Maestrul Pixelilor RGB'}
            </h3>

            <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
              {lang === 'en'
                ? 'Synthesize RGB sub-pixels (Red, Green, Blue 0-255), recreate retro pixel art sprites, and decode resolution & formats!'
                : 'Experimentează sinteza luminii RGB (0-255), reconstruiește mozaicuri pixel art și rezolvă misiunile de rezoluție și formate!'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">🎨 3 Moduri TIC</span>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveGame('rgb_pixel');
              }}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-purple-600/30 cursor-pointer active:scale-95"
            >
              <span>{lang === 'en' ? 'Paint' : 'Pictează'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Game 12: Byte Slider 3x3 (Puzzle-ul Unităților de Date & Jocul 15) */}
        <div className="bg-slate-900/90 border-2 border-slate-700/80 hover:border-emerald-500/60 rounded-3xl p-5 shadow-xl flex flex-col justify-between gap-4 transition-all duration-300 group hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>{byteSliderHighScore} pts</span>
              </div>
            </div>

            <div className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-2">
              {lang === 'en' ? 'Sliding Puzzle 3×3' : 'Puzzle 3×3 & Unități de Date'}
            </div>

            <h3 className="text-lg font-black text-white font-heading group-hover:text-emerald-300 transition-colors">
              {lang === 'en' ? 'Byte Slider 3×3' : 'Byte Slider 3×3 (Jocul 15)'}
            </h3>

            <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
              {lang === 'en'
                ? 'Classic 15-puzzle adapted for CS! Slide adjacent tiles to order data units: Bit, Byte, KB, MB, GB, TB, PB, and EB with soft shuffle.'
                : 'Jocul clasic 15 adaptat pentru TIC! Glisează piesele adiacente pentru a ordona unitățile de la Bit la Exabyte, cu amestecare inteligentă garantat rezolvabilă.'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">🧩 8 Unități + Liber</span>
            <button
              id="arcade-btn-start-byte-slider"
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveGame('byte_slider');
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
            >
              <span>{lang === 'en' ? 'Slide' : 'Rezolvă'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Game 13: File-Drop (Tetris cu Fișiere & Extensii) */}
        <div className="bg-slate-900/90 border-2 border-slate-700/80 hover:border-sky-500/60 rounded-3xl p-5 shadow-xl flex flex-col justify-between gap-4 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border-2 border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                <FileDown className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-mono text-sky-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>{fileDropHighScore} pts</span>
              </div>
            </div>

            <div className="inline-block px-2.5 py-0.5 rounded-md bg-sky-500/10 text-sky-300 text-[10px] font-bold uppercase tracking-wider mb-2">
              {lang === 'en' ? 'Tetris File Sorter' : 'Tetris cu Fișiere & Extensii'}
            </div>

            <h3 className="text-lg font-black text-white font-heading group-hover:text-sky-300 transition-colors flex items-center gap-1.5">
              <span>{lang === 'en' ? 'File-Drop (Tetris)' : 'File-Drop (Tetris Fișiere)'}</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>

            <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
              {lang === 'en'
                ? 'Hyper-addictive Tetris mechanics! Guide falling files (.docx, .png, .mp3, viruses) into the right folders. Stack, trigger line clears, and neutralize malware!'
                : 'Mecanică captivantă stil Tetris! Potrivește fișierele (.docx, .png, .mp3, .zip, viruși .exe) în folderele corecte înainte să cadă la bază. Curăță folderele și fă combo-uri!'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">⚡ 5 Foldere + Stack</span>
            <button
              id="arcade-btn-start-file-drop"
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveGame('file_drop');
              }}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-sky-600/30 cursor-pointer active:scale-95"
            >
              <span>{lang === 'en' ? 'Drop' : 'Joacă'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Game 14: Cyber-Safe Minesweeper (Căutătorul de Viruși) */}
        <div className="bg-slate-900/90 border-2 border-slate-700/80 hover:border-rose-500/60 rounded-3xl p-5 shadow-xl flex flex-col justify-between gap-4 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border-2 border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                <Biohazard className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-mono text-rose-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>{virusSweeperHighScore} pts</span>
              </div>
            </div>

            <div className="inline-block px-2.5 py-0.5 rounded-md bg-rose-500/10 text-rose-300 text-[10px] font-bold uppercase tracking-wider mb-2">
              {lang === 'en' ? 'Cyber Minesweeper' : 'Căutătorul de Viruși'}
            </div>

            <h3 className="text-lg font-black text-white font-heading group-hover:text-rose-300 transition-colors flex items-center gap-1.5">
              <span>{lang === 'en' ? 'Virus Sweeper (Cyber-Safe)' : 'Căutătorul de Viruși (Minesweeper)'}</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>

            <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
              {lang === 'en'
                ? 'Classic Minesweeper reimagined for cybersecurity! Scan safe network nodes, calculate adjacent infection clues, place Antivirus Shields on Trojans, and deploy Sonar pings!'
                : 'Mecanica clasică Minesweeper adaptată pentru securitate online! Scanează nodurile de rețea sigure, calculează virușii adiacenți din cifre și plasează Scuturi Antivirus pe stațiile infectate!'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">🛡️ Scut + Sonar + Buffer</span>
            <button
              id="arcade-btn-start-virus-sweeper"
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveGame('virus_sweeper');
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-rose-600/30 cursor-pointer active:scale-95"
            >
              <span>{lang === 'en' ? 'Sweep' : 'Joacă'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
