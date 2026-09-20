import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { sounds } from '../../utils/audio';
import { updateActiveArcadeScore } from '../../lib/studentAuthService';
import {
  Keyboard,
  RotateCcw,
  Trophy,
  Flame,
  Zap,
  Timer,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Volume2,
} from 'lucide-react';

interface TypingGameProps {
  onBack: () => void;
  studentName?: string;
}

const RO_WORDS = [
  'tastatura', 'mouse', 'monitor', 'procesor', 'memorie', 'folder', 'fisier',
  'internet', 'algoritm', 'browser', 'parola', 'retea', 'octet', 'pixel',
  'unitate', 'stocare', 'ferestre', 'securitate', 'salvare', 'copiere',
  'decupare', 'lipire', 'cursor', 'ecran', 'desktop', 'iconita', 'meniu',
  'eticheta', 'adresa', 'robot', 'program', 'aplicatie', 'sistem', 'comanda'
];

const EN_WORDS = [
  'keyboard', 'mouse', 'monitor', 'processor', 'memory', 'folder', 'file',
  'internet', 'algorithm', 'browser', 'password', 'network', 'byte', 'pixel',
  'storage', 'windows', 'security', 'backup', 'cursor', 'screen', 'desktop',
  'icons', 'menu', 'robot', 'program', 'system', 'hardware', 'software'
];

export const TypingGame: React.FC<TypingGameProps> = ({ onBack, studentName }) => {
  const { lang } = useLanguage();
  const arky = useArky();

  const [duration, setDuration] = useState<number>(30); // 30s or 60s
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');

  // Words bank
  const wordList = lang === 'en' ? EN_WORDS : RO_WORDS;
  const [wordsQueue, setWordsQueue] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [inputVal, setInputVal] = useState<string>('');

  // Stats
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState<number>(0);
  const [wordsCompleted, setWordsCompleted] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);

  // High Score
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('arkedo_highscore_typing') || '0');
    } catch {
      return 0;
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);

  // Shuffle words for a new session
  const generateWords = () => {
    const shuffled = [...wordList].sort(() => Math.random() - 0.5);
    const repeated = [...shuffled, ...shuffled, ...shuffled].sort(() => Math.random() - 0.5);
    return repeated;
  };

  const startGame = () => {
    sounds.playClick();
    setWordsQueue(generateWords());
    setCurrentWordIndex(0);
    setInputVal('');
    setTimeLeft(duration);
    setCorrectChars(0);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setWordsCompleted(0);
    setCurrentStreak(0);
    setMaxStreak(0);
    setGameState('playing');
    arky.triggerIdle();

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      setGameState('finished');
      sounds.playVictory();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  // Handle Game Over stats & High Score
  useEffect(() => {
    if (gameState === 'finished') {
      const elapsedMinutes = duration / 60;
      const finalWpm = Math.round((correctChars / 5) / elapsedMinutes) || 0;
      if (finalWpm > highScore) {
        setHighScore(finalWpm);
        try {
          localStorage.setItem('arkedo_highscore_typing', String(finalWpm));
        } catch {
          // Ignore
        }
      }
      updateActiveArcadeScore('typing', finalWpm);

      if (finalWpm >= 35) {
        arky.triggerSuccess(
          lang === 'en'
            ? `Incredible! ${finalWpm} WPM! You are a master typist! ⚡⌨️`
            : `Incredibil! ${finalWpm} WPM! Tastezi cu viteza luminii! ⚡⌨️`
        );
      } else {
        arky.triggerSuccess(
          lang === 'en'
            ? `Awesome run! ${finalWpm} WPM and ${wordsCompleted} tech terms typed! 🚀`
            : `Excelent antrenament! ${finalWpm} WPM și ${wordsCompleted} cuvinte TIC tastate! 🚀`
        );
      }
    }
  }, [gameState]);

  const currentTargetWord = wordsQueue[currentWordIndex] || '';

  // Keystroke handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== 'playing') return;

    const value = e.target.value;
    setTotalKeystrokes((prev) => prev + 1);

    // If user typed space or completed word
    if (value.endsWith(' ')) {
      const trimmed = value.trim();
      if (trimmed === currentTargetWord) {
        // Correct Word!
        sounds.playClick();
        setCorrectChars((prev) => prev + currentTargetWord.length + 1);
        setCorrectKeystrokes((prev) => prev + currentTargetWord.length + 1);
        setWordsCompleted((prev) => prev + 1);

        const newStreak = currentStreak + 1;
        setCurrentStreak(newStreak);
        if (newStreak > maxStreak) setMaxStreak(newStreak);

        if (newStreak % 5 === 0) {
          sounds.playCorrect();
        }
      } else {
        // Mismatched word
        sounds.playWrong();
        setCurrentStreak(0);
      }

      setInputVal('');
      setCurrentWordIndex((prev) => prev + 1);
      return;
    }

    // Checking partial match
    if (currentTargetWord.startsWith(value)) {
      setCorrectKeystrokes((prev) => prev + 1);
      sounds.playClick();
    } else {
      // Typo
      sounds.playWrong();
    }

    setInputVal(value);
  };

  // Metrics
  const elapsedSecs = duration - timeLeft;
  const currentWpm =
    elapsedSecs > 0 ? Math.round((correctChars / 5) / (elapsedSecs / 60)) : 0;
  const accuracy =
    totalKeystrokes > 0
      ? Math.min(100, Math.round((correctKeystrokes / totalKeystrokes) * 100))
      : 100;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-10">
      {/* Top Header / Back Navigation */}
      <div className="flex items-center justify-between gap-4 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl">
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'en' ? 'Back to Arcade' : 'Înapoi la Jocuri'}</span>
        </button>

        <div className="flex items-center gap-2 text-center">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-white font-heading">
              {lang === 'en' ? 'Speed Typing TIC' : 'Vitezomanul Tastaturii TIC'}
            </h1>
            <p className="text-[11px] text-cyan-400 font-mono">
              {lang === 'en' ? 'Train your typing speed & tech vocabulary' : 'Antrenează-ți viteza și vocabularul informatic'}
            </p>
          </div>
        </div>

        {/* High Score Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Record: {highScore} WPM</span>
        </div>
      </div>

      {/* Main Game Screen */}
      <div className="bg-slate-900/95 border-2 border-cyan-500/30 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col gap-6">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-bold">WPM (Viteză)</div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">{currentWpm}</div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-bold">Acuratețe</div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">{accuracy}%</div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-bold">Combo Streak</div>
              <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                {currentStreak} <span className="text-xs text-amber-500">🔥</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-bold">Timp Rămas</div>
              <div className={`text-xl sm:text-2xl font-black font-mono ${timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                {timeLeft}s
              </div>
            </div>
          </div>
        </div>

        {/* Ready State */}
        {gameState === 'ready' && (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-5 relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 flex items-center justify-center text-4xl shadow-xl shadow-cyan-500/20 ring-4 ring-cyan-500/20 animate-bounce">
              ⌨️
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
                {lang === 'en' ? 'Ready to Test Your Speed?' : 'Pregătit să-ți testezi viteza?'}
              </h2>
              <p className="text-slate-300 text-sm max-w-md mt-2">
                {lang === 'en'
                  ? 'Type each computer science word as fast and accurately as you can. Hit SPACE to confirm each word!'
                  : 'Tastează fiecare cuvânt din TIC cât mai repede și fără greșeli. Apasă tasta SPAȚIU după fiecare cuvânt!'}
              </p>
            </div>

            {/* Sprint Duration Selector */}
            <div className="flex items-center gap-3 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => setDuration(30)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  duration === 30
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ⏱️ Sprint 30s
              </button>
              <button
                onClick={() => setDuration(60)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  duration === 60
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ⏱️ Sprint 60s
              </button>
            </div>

            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-white font-black text-base shadow-xl shadow-cyan-600/30 transition transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>{lang === 'en' ? 'START TYPING!' : 'START TASTARE!'}</span>
            </button>
          </div>
        )}

        {/* Playing State */}
        {gameState === 'playing' && (
          <div className="flex flex-col gap-6 relative z-10">
            {/* Words Display Carousel */}
            <div className="bg-slate-950/90 border-2 border-slate-800 rounded-2xl p-6 min-h-[140px] flex flex-wrap items-center justify-center gap-3 select-none">
              {wordsQueue.slice(currentWordIndex, currentWordIndex + 8).map((word, idx) => {
                const isCurrent = idx === 0;
                if (isCurrent) {
                  return (
                    <div
                      key={`${word}-${idx}`}
                      className="px-5 py-3 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400 text-2xl sm:text-3xl font-black font-mono tracking-wider shadow-lg text-white flex items-center gap-0.5"
                    >
                      {word.split('').map((char, charIdx) => {
                        const typedChar = inputVal[charIdx];
                        let colorClass = 'text-slate-200';
                        if (typedChar !== undefined) {
                          colorClass = typedChar === char ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold underline';
                        }
                        return (
                          <span key={charIdx} className={colorClass}>
                            {char}
                          </span>
                        );
                      })}
                      {inputVal.length > word.length && (
                        <span className="text-rose-400 font-bold underline">
                          {inputVal.slice(word.length)}
                        </span>
                      )}
                    </div>
                  );
                }
                return (
                  <span
                    key={`${word}-${idx}`}
                    className="text-lg sm:text-xl font-bold font-mono text-slate-500 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80"
                  >
                    {word}
                  </span>
                );
              })}
            </div>

            {/* Input Field */}
            <div className="flex flex-col gap-2 max-w-xl mx-auto w-full">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={handleInputChange}
                placeholder={lang === 'en' ? 'Type the highlighted word and press SPACE...' : 'Tastează cuvântul evidențiat și apasă SPAȚIU...'}
                className="w-full bg-slate-950 border-2 border-cyan-500/60 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 rounded-2xl px-5 py-4 text-xl sm:text-2xl text-center text-white font-mono placeholder-slate-600 focus:outline-none shadow-inner"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
              <div className="flex items-center justify-between text-xs text-slate-400 px-2 font-mono">
                <span>💡 {lang === 'en' ? 'Press SPACE after each word' : 'Apasă tasta SPAȚIU după fiecare cuvânt'}</span>
                <span>{wordsCompleted} {lang === 'en' ? 'words typed' : 'cuvinte tastate'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Finished State */}
        {gameState === 'finished' && (
          <div className="flex flex-col items-center justify-center py-8 text-center gap-6 relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-emerald-400 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/20 ring-4 ring-amber-500/20">
              🏆
            </div>

            <div>
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 uppercase tracking-wider">
                {lang === 'en' ? 'Session Complete!' : 'Sesiune Finalizată!'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-heading mt-2">
                {studentName ? `${studentName}, ` : ''}
                {currentWpm >= 40
                  ? (lang === 'en' ? 'Legendary Typist! ⚡' : 'Tastator de Legendă! ⚡')
                  : currentWpm >= 25
                  ? (lang === 'en' ? 'Pro Digital Cadet! 🚀' : 'Cadet TIC Profesionist! 🚀')
                  : (lang === 'en' ? 'Great Effort! Keep Training! 👏' : 'Bravo! Continuă antrenamentul! 👏')}
              </h2>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-2xl w-full">
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
                <span className="text-xs text-slate-400 uppercase font-bold">Viteză Finală</span>
                <span className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono mt-1">
                  {currentWpm}
                </span>
                <span className="text-[11px] text-slate-500">WPM</span>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
                <span className="text-xs text-slate-400 uppercase font-bold">Acuratețe</span>
                <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono mt-1">
                  {accuracy}%
                </span>
                <span className="text-[11px] text-slate-500">{correctKeystrokes}/{totalKeystrokes} taste</span>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
                <span className="text-xs text-slate-400 uppercase font-bold">Cuvinte TIC</span>
                <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono mt-1">
                  {wordsCompleted}
                </span>
                <span className="text-[11px] text-slate-500">termeni nimeriți</span>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
                <span className="text-xs text-slate-400 uppercase font-bold">Max Streak</span>
                <span className="text-3xl sm:text-4xl font-black text-rose-400 font-mono mt-1">
                  {maxStreak}
                </span>
                <span className="text-[11px] text-slate-500">la rând fără eroare</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={startGame}
                className="px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition flex items-center gap-2 shadow-lg shadow-cyan-600/30 cursor-pointer active:scale-95"
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
    </div>
  );
};
