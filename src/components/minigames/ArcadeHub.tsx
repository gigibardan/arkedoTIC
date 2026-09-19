import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { TypingGame } from './TypingGame';
import { MouseAgilityGame } from './MouseAgilityGame';
import { Game2048Binary } from './Game2048Binary';
import {
  Gamepad2,
  Keyboard,
  MousePointer,
  Binary,
  Trophy,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Flame,
  Zap,
  HardDrive,
  School,
} from 'lucide-react';

interface ArcadeHubProps {
  studentName?: string;
  onBackToCatalog: () => void;
}

type ActiveGame = 'hub' | 'typing' | 'mouse' | '2048';

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
                3 {lang === 'en' ? 'Arcade Games Available' : 'Jocuri Disponibile'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini-Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Game 1: Speed Typing */}
        <div className="bg-slate-900/90 border-2 border-slate-700/80 hover:border-cyan-500/60 rounded-3xl p-6 shadow-xl flex flex-col justify-between gap-5 transition-all duration-300 group hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border-2 border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Keyboard className="w-7 h-7" />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>{typingHighScore} WPM</span>
              </div>
            </div>

            <div className="inline-block px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              {lang === 'en' ? 'Typing Sprint' : 'Viteză la Tastatură'}
            </div>

            <h3 className="text-xl font-black text-white font-heading group-hover:text-cyan-300 transition-colors">
              {lang === 'en' ? 'Speed Typing TIC' : 'Vitezomanul Tastaturii'}
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
              {lang === 'en'
                ? 'Type curriculum computer science words under time pressure. Tracks words-per-minute (WPM), accuracy, and combos.'
                : 'Tastează termeni reali din TIC (procesor, memorie, folder, rețea) contra cronometru. Măsoară WPM, acuratețea și combo-ul.'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">⏱️ 30s / 60s Sprint</span>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveGame('typing');
              }}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-cyan-600/30 cursor-pointer active:scale-95"
            >
              <span>{lang === 'en' ? 'Play Now' : 'Joacă Acum'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Game 2: Mouse Agility */}
        <div className="bg-slate-900/90 border-2 border-slate-700/80 hover:border-emerald-500/60 rounded-3xl p-6 shadow-xl flex flex-col justify-between gap-5 transition-all duration-300 group hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <MousePointer className="w-7 h-7" />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>{mouseHighScore} pts</span>
              </div>
            </div>

            <div className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              {lang === 'en' ? 'Precision & Reflexes' : 'Coordonare & Reflexe'}
            </div>

            <h3 className="text-xl font-black text-white font-heading group-hover:text-emerald-300 transition-colors">
              {lang === 'en' ? 'Mouse Master' : 'Maestrul Mouse-ului'}
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
              {lang === 'en'
                ? 'Sharpen your mouse skills: single left-click, fast double-click, context right-click, and file drag & drop into folders.'
                : 'Exersează comenzile esențiale: Click Stânga, Dublu-Click Rapid, Click Dreapta pe dosare și Glisare Drag & Drop!'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">⏱️ 45s Provocare</span>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveGame('mouse');
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
            >
              <span>{lang === 'en' ? 'Play Now' : 'Joacă Acum'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Game 3: 2048 Binary */}
        <div className="bg-slate-900/90 border-2 border-slate-700/80 hover:border-amber-500/60 rounded-3xl p-6 shadow-xl flex flex-col justify-between gap-5 transition-all duration-300 group hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border-2 border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Binary className="w-7 h-7" />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-mono text-amber-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>{game2048HighScore} pts</span>
              </div>
            </div>

            <div className="inline-block px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              {lang === 'en' ? 'Binary Logic' : 'Gândire & Logică Binară'}
            </div>

            <h3 className="text-xl font-black text-white font-heading group-hover:text-amber-300 transition-colors">
              {lang === 'en' ? '2048 Binary Bytes' : '2048 Binar TIC'}
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
              {lang === 'en'
                ? 'Slide and merge powers of 2 (2 B, 4 B, 8 B... up to 1024 B = 1 KB and 2048 B). Educational fun based on textbook memory units.'
                : 'Unește puterile lui 2: 2 B, 4 B, 8 B... până când formezi 1024 B (1 Kilobyte) și atingi 2048 B! Include ghidul unităților de stocare.'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">🧠 Puzzle Logic</span>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveGame('2048');
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-amber-600/30 cursor-pointer active:scale-95"
            >
              <span>{lang === 'en' ? 'Play Now' : 'Joacă Acum'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
