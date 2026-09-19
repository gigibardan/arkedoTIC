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
} from 'lucide-react';

interface ArcadeHubProps {
  studentName?: string;
  onBackToCatalog: () => void;
}

type ActiveGame = 'hub' | 'typing' | 'mouse' | '2048' | 'detective' | 'files' | 'binary_factory' | 'maze' | 'firewall';

export const ArcadeHub: React.FC<ArcadeHubProps> = ({ studentName, onBackToCatalog }) => {
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

  const avatar = (() => {
    try {
      return localStorage.getItem('arkedo_student_avatar') || '🎓';
    } catch {
      return '🎓';
    }
  })();

  if (activeGame === 'typing') {
    return <TypingGame onBack={() => setActiveGame('hub')} studentName={studentName} />;
  }

  if (activeGame === 'mouse') {
    return <MouseAgilityGame onBack={() => setActiveGame('hub')} studentName={studentName} />;
  }

  if (activeGame === '2048') {
    return <Game2048Binary onBack={() => setActiveGame('hub')} studentName={studentName} />;
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
                8 {lang === 'en' ? 'Arcade Games Available' : 'Jocuri Disponibile'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini-Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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

            <div className="inline-block px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-2">
              {lang === 'en' ? 'Binary Logic' : 'Gândire & Logică Binară'}
            </div>

            <h3 className="text-lg font-black text-white font-heading group-hover:text-amber-300 transition-colors">
              {lang === 'en' ? '2048 Binary Bytes' : '2048 Binar TIC'}
            </h3>

            <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
              {lang === 'en'
                ? 'Slide and merge powers of 2 (2 B, 4 B, 8 B... up to 1024 B = 1 KB and 2048 B). Based on textbook memory units.'
                : 'Unește puterile lui 2: 2 B, 4 B, 8 B... până când formezi 1024 B (1 Kilobyte) și atingi 2048 B!'}
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

        {/* Game 4: Cyber-Safe Detective */}
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

        {/* Game 5: File Organizer Express */}
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

        {/* Game 6: Binary Bit Factory */}
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

        {/* Game 7: Algorithm Maze Robot */}
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
            <span className="text-[11px] text-slate-400 font-mono">🤖 4 Niveluri TIC</span>
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

        {/* Game 8: Firewall Defender */}
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
      </div>
    </div>
  );
};
