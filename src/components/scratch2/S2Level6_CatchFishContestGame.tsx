import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Play, 
  RotateCcw, 
  Check, 
  ExternalLink,
  Timer,
  Fish,
  Cat,
  Gamepad2,
  Award
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface S2Level6Props {
  onCompletePage: (earnedScore: number) => void;
}

export const S2Level6_CatchFishContestGame: React.FC<S2Level6Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Game state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [score, setScore] = useState<number>(0);
  const [catPos, setCatPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [fishPos, setFishPos] = useState<{ x: number; y: number }>({ x: 100, y: 50 });
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [targetScoreAchieved, setTargetScoreAchieved] = useState<boolean>(false);

  // Quiz State
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  useEffect(() => {
    const hasActive = Object.values(cooldowns).some((c: number) => c > 0);
    if (!hasActive) return;
    const timer = setInterval(() => {
      setCooldowns(prev => {
        const next: Record<string, number> = {};
        for (const [k, v] of Object.entries(prev)) {
          const val = v as number;
          if (val > 1) next[k] = val - 1;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldowns]);

  // Countdown timer
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) {
      if (isPlaying && timeLeft <= 0) {
        setIsPlaying(false);
        setGameFinished(true);
        if (score >= 3) {
          sounds.playStar();
          setTargetScoreAchieved(true);
        }
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, timeLeft, score]);

  // Fish auto glide
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const rx = Math.floor(Math.random() * 360) - 180;
      const ry = Math.floor(Math.random() * 240) - 120;
      setFishPos({ x: rx, y: ry });
    }, 1500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Start game
  const handleStartGame = () => {
    sounds.playClick();
    setIsPlaying(true);
    setTimeLeft(20);
    setScore(0);
    setGameFinished(false);
    setCatPos({ x: -100, y: 0 });
    setFishPos({ x: 80, y: 60 });
  };

  // Stage click to move diver cat
  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlaying) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const normX = Math.round(((clickX / rect.width) * 480) - 240);
    const normY = Math.round(180 - ((clickY / rect.height) * 360));

    setCatPos({ x: normX, y: normY });

    // Check collision with fish
    const dist = Math.sqrt(Math.pow(normX - fishPos.x, 2) + Math.pow(normY - fishPos.y, 2));
    if (dist < 60) {
      sounds.playCorrect();
      const newScore = score + 1;
      setScore(newScore);
      // Reposition fish immediately
      const rx = Math.floor(Math.random() * 360) - 180;
      const ry = Math.floor(Math.random() * 240) - 120;
      setFishPos({ x: rx, y: ry });

      if (newScore >= 3 && !targetScoreAchieved) {
        setTargetScoreAchieved(true);
      }
    }
  };

  // Quiz Handlers
  const handleQ1 = (id: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    setQ1Answer(id);
    if (id === 'touching_sprite') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const handleQ2 = (id: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    setQ2Answer(id);
    if (id === 'timer_loop') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  const isQ1Correct = q1Answer === 'touching_sprite';
  const isQ2Correct = q2Answer === 'timer_loop';

  let totalScore = 0;
  if (targetScoreAchieved) totalScore += 40;
  if (isQ1Correct) totalScore += 30;
  if (isQ2Correct) totalScore += 30;

  const isPageComplete = targetScoreAchieved && isQ1Correct && isQ2Correct;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600/30 via-orange-600/20 to-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/40 text-amber-300">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {lang === 'en' ? 'Unit 6 • Scratch 3.0 (Mission 2)' : 'Unitatea 6 • Scratch 3.0 (Misiunea 2)'}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {lang === 'en' ? 'Page 6 of 7' : 'Pagina 6 din 7'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {lang === 'en'
                  ? 'Contest Project: "Catch the Fish" Multi-Sprite Game'
                  : 'Proiect de Concurs: Jocul „Prinde Peștișorul”'}
              </h1>
            </div>
          </div>
          <a
            href="https://scratch.mit.edu/projects/editor/?tutorial=getStarted"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-600/30 hover:bg-orange-600/50 border border-orange-500/40 text-orange-200 text-xs font-semibold transition cursor-pointer"
          >
            <span>{lang === 'en' ? 'Open MIT Scratch' : 'Deschide Scratch Oficial'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Educational Guide Card */}
      <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
          <BookOpen className="w-5 h-5" />
          <h2>{lang === 'en' ? 'Multi-Sprite Architecture in Scratch (Textbook pp. 92–93)' : 'Arhitectura cu Multiple Personaje în Scratch (Manual pag. 92–93)'}</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {lang === 'en'
            ? 'Complete Scratch games coordinate multiple independent sprites: Sprite 1 (Player diver) controlled by user clicks/keys, Sprite 2 (Fish target) running an autonomous glide loop, and a global countdown timer script.'
            : 'Jocurile complete în Scratch sincronizează mai multe personaje independente: Personajul 1 (Scafandrul) ghidat de jucător, Personajul 2 (Peștele) care glisează autonom pe scenă, și un script global de cronometru descrescător.'}
        </p>
      </div>

      {/* Interactive Playable Contest Game */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <Gamepad2 className="w-5 h-5 text-amber-400" />
            <h3>{lang === 'en' ? 'Playable Underwater Contest Game' : 'Laborator Interactiv: Jocul Scufundătorului'}</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-xs font-mono">
              <Timer className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-slate-400">Timp:</span>
              <strong className="text-white text-sm">{timeLeft}s</strong>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-xs font-mono">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">Scor:</span>
              <strong className="text-amber-400 text-sm">{score}</strong>
            </div>
            {!isPlaying ? (
              <button
                type="button"
                onClick={handleStartGame}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow cursor-pointer"
              >
                {gameFinished ? (lang === 'en' ? 'Play Again' : 'Joacă din Nou') : (lang === 'en' ? 'Start Game' : 'Pornește Jocul')}
              </button>
            ) : null}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">
          {lang === 'en'
            ? 'Click anywhere on the underwater stage to move the diver cat and catch the gliding fish. Goal: Catch at least 3 fish before time runs out!'
            : 'Apasă pe scenă pentru a muta pisoiul scufundător și a prinde peștișorul galben. Misiune: Prinde cel puțin 3 pești înainte de expirarea timpului!'}
        </p>

        {/* Playable Stage Area */}
        <div
          onClick={handleStageClick}
          className="relative w-full aspect-[4/3] max-h-[360px] bg-gradient-to-b from-cyan-900 via-blue-950 to-slate-950 rounded-2xl border-2 border-slate-700 overflow-hidden cursor-crosshair select-none shadow-2xl"
        >
          {/* Bubbles animation */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>

          {/* Diver Cat Sprite */}
          <div
            style={{
              left: `${((catPos.x + 240) / 480) * 100}%`,
              top: `${((180 - catPos.y) / 360) * 100}%`,
              transform: 'translate(-50%, -50%)',
              transition: isPlaying ? 'left 0.25s ease-out, top 0.25s ease-out' : 'none'
            }}
            className="absolute flex flex-col items-center pointer-events-none drop-shadow-2xl z-20"
          >
            <div className="text-4xl filter drop-shadow">
              🐱🤿
            </div>
            <span className="text-[9px] font-bold text-white bg-slate-900/80 px-1.5 py-0.2 rounded-full">Scafandru</span>
          </div>

          {/* Gliding Fish Target Sprite */}
          <div
            style={{
              left: `${((fishPos.x + 240) / 480) * 100}%`,
              top: `${((180 - fishPos.y) / 360) * 100}%`,
              transform: 'translate(-50%, -50%)',
              transition: isPlaying ? 'left 1.2s ease-in-out, top 1.2s ease-in-out' : 'none'
            }}
            className="absolute flex flex-col items-center pointer-events-none drop-shadow-2xl z-10 animate-bounce"
          >
            <div className="text-4xl filter drop-shadow">
              🐠
            </div>
            <span className="text-[9px] font-bold text-amber-300 bg-slate-900/80 px-1.5 py-0.2 rounded-full">Pește</span>
          </div>

          {/* Game Over Overlay */}
          {gameFinished && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30">
              <div className="text-5xl mb-2">{score >= 3 ? '🏆' : '⏰'}</div>
              <h4 className="text-lg font-bold text-white">
                {score >= 3
                  ? (lang === 'en' ? `Magnificent! You caught ${score} fish! (+40 Pts)` : `Minunat! Ai prins ${score} pești! (+40 Pcte)`)
                  : (lang === 'en' ? `Time's up! You caught ${score} fish.` : `Timpul a expirat! Ai prins ${score} pești.`)}
              </h4>
              <button
                type="button"
                onClick={handleStartGame}
                className="mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg cursor-pointer"
              >
                {lang === 'en' ? 'Play Again' : 'Reîncearcă'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Assessment Quiz */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>{lang === 'en' ? 'Multi-Sprite Coordination Quiz' : 'Evaluare: Coordonarea Personajelor'}</span>
        </h3>

        {/* Question 1 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
            </span>
            <QuestionHint
              hintRo="Detectarea atingerii dintre două personaje se face cu blocul „atinge [nume personaj] ?” din categoria Detectare."
              hintEn="Inter-sprite contact is checked via 'touching [sprite-name] ?' in Sensing."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'Which block detects when the diver cat catches the fish sprite in Scratch?'
              : 'Ce bloc detectează momentul în care pisoiul atinge peștișorul pe scenă?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'touching_sprite', ro: 'atinge [Peștișor] ? din categoria Detectare', en: 'touching [Fish] ? from Sensing category' },
              { id: 'touching_mouse', ro: 'atinge marginea scenei', en: 'touching stage edge' },
              { id: 'color_sound', ro: 'redă sunetul miau', en: 'play sound meow' },
              { id: 'set_pen', ro: 'stilou jos', en: 'pen down' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q1 || 0) > 0}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'touching_sprite'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-amber-400 text-slate-300'
                }`}
              >
                {lang === 'en' ? opt.en : opt.ro}
              </button>
            ))}
          </div>
          {cooldowns.q1 && cooldowns.q1 > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.q1}
              totalSeconds={5}
              customMessageRo="Reflecție didactică: Detectarea atingerii între personaje permite crearea de mecanici de joc captivante!"
              customMessageEn="Pedagogical reflection: Inter-sprite sensing powers engaging gameplay mechanics!"
            />
          ) : null}
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanationRo="Meniul derulant al blocului „atinge” listează toate personajele active de pe scenă, indicatorul mausului și marginea scenei."
              explanationEn="The 'touching' block dropdown lists all active sprites, mouse pointer, and stage edges."
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
            </span>
            <QuestionHint
              hintRo="Cronometrul descrescător folosește o buclă care așteaptă 1 secundă și scade 1 din variabila timp la fiecare pas."
              hintEn="A countdown timer uses a loop with 'wait 1 second' and 'change time by -1'."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'How is a countdown timer implemented in Scratch for games?'
              : 'Cum se programează un cronometru descrescător de 30 de secunde în Scratch?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'timer_loop', ro: 'Setează [timp] la (30) și repetă de 30 ori: [așteaptă 1 secunde, modifică [timp] cu (-1)]', en: 'Set [time] to 30, repeat 30 times: [wait 1 sec, change [time] by -1]' },
              { id: 'timer_instant', ro: 'Setează [timp] la (0) dintr-o dată', en: 'Set [time] to 0 instantly' },
              { id: 'timer_costume', ro: 'Schimbă fundalul de 30 de ori pe secundă', en: 'Change backdrop 30 times per second' },
              { id: 'timer_glide', ro: 'Glisează la infinit în afara scenei', en: 'Glide infinitely offstage' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q2 || 0) > 0}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'timer_loop'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-amber-400 text-slate-300'
                }`}
              >
                {lang === 'en' ? opt.en : opt.ro}
              </button>
            ))}
          </div>
          {cooldowns.q2 && cooldowns.q2 > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.q2}
              totalSeconds={5}
              customMessageRo="Reflecție didactică: Combinația dintre pauza de 1 secundă și decrementarea variabilei creează secunda exactă!"
              customMessageEn="Pedagogical reflection: Combining 1s pause with variable decrement models real seconds!"
            />
          ) : null}
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanationRo="După finalizarea buclei de 30 de repetiții, scriptul execută blocul „oprește tot” pentru a încheia jocul."
              explanationEn="After the 30 loop iterations finish, the script executes 'stop all' to conclude the game."
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentPage={6}
        totalPages={7}
        earnedScore={totalScore}
        isCompleted={isPageComplete}
        onNextPage={() => {
          sounds.playCorrect();
          onCompletePage(totalScore);
        }}
        nextButtonLabelRo="Continuă la Pagina 7: Marea Evaluare Finală & Proiectul Ecologic"
        nextButtonLabelEn="Proceed to Page 7: Grand Final Exam & Ecology Project"
      />
    </div>
  );
};
