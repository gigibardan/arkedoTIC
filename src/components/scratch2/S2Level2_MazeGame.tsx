import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Play, 
  RotateCcw, 
  Check, 
  ExternalLink,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Trophy
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface S2Level2Props {
  onCompletePage: (earnedScore: number) => void;
}

export const S2Level2_MazeGame: React.FC<S2Level2Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Maze grid state: Player position (row 0..5, col 0..5)
  // 0: path, 1: wall (black), 2: start (0,0), 3: goal (5,5 - gold)
  const MAZE_GRID = [
    [0, 0, 1, 0, 0, 0],
    [1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 1, 0],
    [0, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 0],
    [1, 0, 0, 0, 0, 3]
  ];

  const [playerPos, setPlayerPos] = useState<{ r: number; c: number }>({ r: 0, c: 0 });
  const [wallHits, setWallHits] = useState<number>(0);
  const [mazeWon, setMazeWon] = useState<boolean>(false);
  const [sensingFlash, setSensingFlash] = useState<boolean>(false);

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

  const movePlayer = (dr: number, dc: number) => {
    if (mazeWon) return;
    const targetR = playerPos.r + dr;
    const targetC = playerPos.c + dc;

    // Check bounds
    if (targetR < 0 || targetR >= 6 || targetC < 0 || targetC >= 6) {
      sounds.playWrong();
      return;
    }

    // Check black wall collision
    if (MAZE_GRID[targetR][targetC] === 1) {
      sounds.playWrong();
      setWallHits(h => h + 1);
      setSensingFlash(true);
      setTimeout(() => setSensingFlash(false), 500);
      return;
    }

    sounds.playClick();
    setPlayerPos({ r: targetR, c: targetC });

    // Check victory
    if (MAZE_GRID[targetR][targetC] === 3 || (targetR === 5 && targetC === 5)) {
      sounds.playStar();
      setMazeWon(true);
    }
  };

  const handleResetMaze = () => {
    sounds.playClick();
    setPlayerPos({ r: 0, c: 0 });
    setMazeWon(false);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) movePlayer(-1, 0);
      else if (['ArrowDown', 'KeyS'].includes(e.code)) movePlayer(1, 0);
      else if (['ArrowLeft', 'KeyA'].includes(e.code)) movePlayer(0, -1);
      else if (['ArrowRight', 'KeyD'].includes(e.code)) movePlayer(0, 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, mazeWon]);

  // Quiz Handlers
  const handleQ1 = (id: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    setQ1Answer(id);
    if (id === 'bounce_back') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const handleQ2 = (id: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    setQ2Answer(id);
    if (id === 'sensing_touch') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  const isQ1Correct = q1Answer === 'bounce_back';
  const isQ2Correct = q2Answer === 'sensing_touch';

  let totalScore = 0;
  if (mazeWon) totalScore += 40;
  if (isQ1Correct) totalScore += 30;
  if (isQ2Correct) totalScore += 30;

  const isPageComplete = mazeWon || (q1Answer !== null && q2Answer !== null) || totalScore >= 40;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-600/30 via-indigo-600/20 to-slate-900 border border-sky-500/40 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-500/20 rounded-xl border border-sky-500/40 text-sky-300">
              <Gamepad2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {lang === 'en' ? 'Unit 6 • Scratch 3.0 (Mission 2)' : 'Unitatea 6 • Scratch 3.0 (Misiunea 2)'}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {lang === 'en' ? 'Page 2 of 7' : 'Pagina 2 din 7'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {lang === 'en'
                  ? 'Project: "The Smart Maze" (Color Sensing)'
                  : 'Proiectul „Labirintul Inteligent” (Detectarea Culorilor)'}
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
        <div className="flex items-center gap-2 text-sky-400 font-bold text-base">
          <BookOpen className="w-5 h-5" />
          <h2>{lang === 'en' ? 'Color Sensing Algorithm for Mazes (Textbook pp. 86–88)' : 'Algoritmul de Detectare a Culorilor în Labirint (Manual pag. 86–88)'}</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {lang === 'en'
            ? 'In Scratch, games detect obstacles using the cyan Sensing block `touching color [#000000] ?`. When touching a wall, the sprite cancels its step by executing `move -10 steps` to bounce back.'
            : 'În Scratch, jocurile de tip labirint detectează coliziunile cu blocul de Detectare `atinge culoarea [#000000] ?`. Când lovește peretele negru, personajul își anulează pasul executând `mergi -10 pași` pentru a ricoșa înapoi.'}
        </p>
      </div>

      {/* Interactive Playable Maze Game */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <Gamepad2 className="w-5 h-5 text-sky-400" />
            <h3>{lang === 'en' ? 'Playable Scratch Maze Simulator' : 'Laborator Interactiv: Jocul Labirint Scratch'}</h3>
          </div>
          <button
            type="button"
            onClick={handleResetMaze}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Reset Position' : 'Resetează Poziția'}</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">
          {lang === 'en'
            ? 'Guide RoboTIC from the start (top-left) to the golden trophy (bottom-right). Avoid hitting the black walls!'
            : 'Ghidează-l pe RoboTIC de la start (stânga-sus) până la trofeul auriu (dreapta-jos). Evită pereții negri!'}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Maze Grid */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className={`p-2 bg-slate-950 rounded-2xl border-4 transition-all ${
              sensingFlash ? 'border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.6)]' : 'border-slate-800 shadow-xl'
            }`}>
              <div className="grid grid-cols-6 gap-1.5 bg-slate-900 p-2 rounded-xl">
                {MAZE_GRID.map((row, r) =>
                  row.map((cell, c) => {
                    const isPlayerHere = playerPos.r === r && playerPos.c === c;
                    const isWall = cell === 1;
                    const isGoal = cell === 3 || (r === 5 && c === 5);

                    return (
                      <div
                        key={`${r}-${c}`}
                        className={`w-11 h-11 sm:w-13 sm:h-13 rounded-lg flex items-center justify-center transition-all ${
                          isWall
                            ? 'bg-slate-950 border-2 border-slate-800 shadow-inner'
                            : isGoal
                            ? 'bg-amber-500/30 border-2 border-amber-400 animate-pulse'
                            : 'bg-slate-800/80 border border-slate-700/50'
                        }`}
                      >
                        {isPlayerHere ? (
                          <div className="text-2xl animate-bounce drop-shadow">
                            🤖
                          </div>
                        ) : isGoal ? (
                          <div className="text-2xl">
                            🏆
                          </div>
                        ) : null}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {sensingFlash && (
              <div className="mt-2 text-xs text-rose-400 font-bold flex items-center gap-1.5 animate-pulse">
                <ShieldAlert className="w-4 h-4" />
                <span>{lang === 'en' ? 'Sensing Event: Touching Black Color! Blocked!' : 'Eveniment Detectare: Atinge Culoarea Neagră! Pas blocat!'}</span>
              </div>
            )}

            {mazeWon && (
              <div className="mt-3 p-3 bg-emerald-950/90 border border-emerald-500 rounded-xl text-emerald-200 text-xs font-bold flex items-center gap-2 animate-bounce">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>{lang === 'en' ? 'Victory! You solved the maze! (+40 Pts)' : 'Victorie! Ai parcurs cu succes labirintul! (+40 Pcte)'}</span>
              </div>
            )}
          </div>

          {/* D-Pad Controls & Scratch Script */}
          <div className="lg:col-span-5 space-y-4">
            {/* Directional Pad */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{lang === 'en' ? 'Directional Controls:' : 'Comenzi Direcționale:'}</span>
              <button
                type="button"
                onClick={() => movePlayer(-1, 0)}
                className="w-12 h-12 rounded-xl bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center shadow-lg transition cursor-pointer active:scale-95"
              >
                <ArrowUp className="w-6 h-6" />
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => movePlayer(0, -1)}
                  className="w-12 h-12 rounded-xl bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center shadow-lg transition cursor-pointer active:scale-95"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => movePlayer(1, 0)}
                  className="w-12 h-12 rounded-xl bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center shadow-lg transition cursor-pointer active:scale-95"
                >
                  <ArrowDown className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => movePlayer(0, 1)}
                  className="w-12 h-12 rounded-xl bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center shadow-lg transition cursor-pointer active:scale-95"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
              <span className="text-[10px] text-slate-500">{lang === 'en' ? 'Or use keyboard arrow keys / WASD' : 'Sau folosește tastele săgeți / WASD'}</span>
            </div>

            {/* Scratch script snippet */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
              <div className="p-1.5 rounded bg-amber-500 text-slate-950 font-bold">
                la nesfârșit
              </div>
              <div className="p-1.5 rounded bg-amber-600 text-white pl-4">
                dacă &lt;atinge culoarea [#000000]?&gt; atunci
                <div className="pl-4 text-blue-300 font-bold">
                  mergi (-10) pași
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Quiz */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-sky-400" />
          <span>{lang === 'en' ? 'Maze Mechanics Quiz' : 'Evaluare: Mecanica Jocurilor cu Labirint'}</span>
        </h3>

        {/* Question 1 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
            </span>
            <QuestionHint
              hintRo="Pentru a împiedica personajul să treacă prin perete, acesta este împins înapoi cu un număr negativ de pași (ex: -10)."
              hintEn="To stop the sprite from passing through walls, it is pushed back by a negative step value (e.g. -10)."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'Why is the block "mergi (-10) pași" used immediately after detecting wall collision in a Scratch maze?'
              : 'De ce este utilizat blocul „mergi (-10) pași” imediat după detectarea atingerii peretelui în jocul Labirint?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'bounce_back', ro: 'Pentru a anula mișcarea înainte și a readuce personajul în afara peretelui', en: 'To cancel forward movement and keep the sprite outside the wall' },
              { id: 'delete_game', ro: 'Pentru a șterge automat tot labirintul', en: 'To automatically delete the entire maze' },
              { id: 'speed_up', ro: 'Pentru a dubla viteza personajului', en: 'To double sprite speed' },
              { id: 'invert_screen', ro: 'Pentru a roti ecranul cu 180 de grade', en: 'To rotate screen by 180 degrees' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q1 || 0) > 0}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'bounce_back'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-sky-400 text-slate-300'
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
              customMessageRo="Reflecție didactică: Mergi cu o valoare negativă reprezintă mecanismul de recul fizic în programare!"
              customMessageEn="Pedagogical reflection: Moving with a negative value represents the physical recoil mechanism!"
            />
          ) : null}
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanationRo="Dacă personajul a înaintat 10 pași și a lovit peretele, 10 - 10 = 0 îl repune exact la poziția liberă anterioară."
              explanationEn="If the sprite moved forward 10 steps and hit the wall, 10 - 10 = 0 returns it to the free position."
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
            </span>
            <QuestionHint
              hintRo="Blocul „atinge culoarea [..] ?” aparține categoriei Detectare (Sensing - turcoaz deschis)."
              hintEn="The block 'touching color [..] ?' belongs to the light cyan Sensing category."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'Which category provides the block "atinge culoarea [..] ?" (touching color)?'
              : 'Din ce categorie de blocuri face parte „atinge culoarea [..] ?” în Scratch?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'sensing_touch', ro: 'Detectare (Sensing - bleu / turcoaz)', en: 'Sensing (light cyan)' },
              { id: 'motion_cat', ro: 'Mișcare (Motion - albastru închis)', en: 'Motion (dark blue)' },
              { id: 'sound_cat', ro: 'Sunet (Sound - roz)', en: 'Sound (pink)' },
              { id: 'variables_cat', ro: 'Variabile (Variables - portocaliu)', en: 'Variables (orange)' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q2 || 0) > 0}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'sensing_touch'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-sky-400 text-slate-300'
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
              customMessageRo="Reflecție didactică: Categoria Detectare acționează ca senzorii virtuali ai personajelor!"
              customMessageEn="Pedagogical reflection: The Sensing category acts as virtual sensors for sprites!"
            />
          ) : null}
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanationRo="Categoria Detectare conține senzori optici, de atingere și de distanță pentru interacțiunea dintre personaje și decor."
              explanationEn="Sensing provides optical, contact, and distance sensors for interactions between sprites and stage."
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentPage={2}
        totalPages={7}
        earnedScore={totalScore}
        isCompleted={isPageComplete}
        onNextPage={() => {
          sounds.playCorrect();
          onCompletePage(totalScore);
        }}
        nextButtonLabelRo="Continuă la Pagina 3: Jocul „Tabla Înmulțirii”"
        nextButtonLabelEn="Proceed to Page 3: Game 'Multiplication Table Quiz'"
      />
    </div>
  );
};
