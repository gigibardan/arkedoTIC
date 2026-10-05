import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Play, 
  RotateCcw, 
  Check, 
  ExternalLink,
  MessageSquare,
  Trophy,
  Volume2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface S2Level3Props {
  onCompletePage: (earnedScore: number) => void;
}

export const S2Level3_MultiplicationQuizGame: React.FC<S2Level3Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Scratch game state
  const [numA, setNumA] = useState<number>(6);
  const [numB, setNumB] = useState<number>(7);
  const [userAnswerInput, setUserAnswerInput] = useState<string>('');
  const [scoreCount, setScoreCount] = useState<number>(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isCorrectFeedback, setIsCorrectFeedback] = useState<boolean>(false);
  const [targetStreakAchieved, setTargetStreakAchieved] = useState<boolean>(false);

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

  const generateNewProblem = () => {
    const a = Math.floor(Math.random() * 7) + 4; // 4..10
    const b = Math.floor(Math.random() * 7) + 4; // 4..10
    setNumA(a);
    setNumB(b);
    setUserAnswerInput('');
  };

  const handleSubmitAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsed = parseInt(userAnswerInput.trim(), 10);
    const expected = numA * numB;

    if (parsed === expected) {
      sounds.playCorrect();
      setIsCorrectFeedback(true);
      setFeedbackMessage(lang === 'en' ? `Correct! ${numA} × ${numB} = ${expected} (+1 Score)` : `Bravo! ${numA} × ${numB} = ${expected} (+1 Scor)`);
      const newScore = scoreCount + 1;
      setScoreCount(newScore);
      if (newScore >= 3 && !targetStreakAchieved) {
        sounds.playStar();
        setTargetStreakAchieved(true);
      }
      setTimeout(() => {
        generateNewProblem();
        setFeedbackMessage(null);
      }, 1500);
    } else {
      sounds.playWrong();
      setIsCorrectFeedback(false);
      setFeedbackMessage(lang === 'en' ? `Oops! ${numA} × ${numB} is not ${parsed}. Try again!` : `Ups! ${numA} × ${numB} nu este ${parsed}. Încearcă din nou!`);
    }
  };

  // Quiz Handlers
  const handleQ1 = (id: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    setQ1Answer(id);
    if (id === 'ask_and_wait') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const handleQ2 = (id: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    setQ2Answer(id);
    if (id === 'pick_random') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  const isQ1Correct = q1Answer === 'ask_and_wait';
  const isQ2Correct = q2Answer === 'pick_random';

  let totalScore = 0;
  if (targetStreakAchieved) totalScore += 40;
  if (isQ1Correct) totalScore += 30;
  if (isQ2Correct) totalScore += 30;

  const isPageComplete = targetStreakAchieved && isQ1Correct && isQ2Correct;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600/30 via-teal-600/20 to-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/40 text-emerald-300">
              <Calculator className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {lang === 'en' ? 'Unit 6 • Scratch 3.0 (Mission 2)' : 'Unitatea 6 • Scratch 3.0 (Misiunea 2)'}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {lang === 'en' ? 'Page 3 of 7' : 'Pagina 3 din 7'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {lang === 'en'
                  ? 'Project: "The Multiplication Quiz Game" (ask, answer, random)'
                  : 'Proiectul „Jocul Tabla Înmulțirii” (întreabă, răspuns, aleator)'}
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
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
          <BookOpen className="w-5 h-5" />
          <h2>{lang === 'en' ? 'Game Logic: ask, answer & pick random (Textbook pp. 88–90)' : 'Logica Jocului: întreabă, răspuns și alege aleator (Manual pag. 88–90)'}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-300">
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="font-bold text-emerald-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {lang === 'en' ? '1. "pick random () to ()"' : '1. „alege aleator între () și ()”'}
            </div>
            <p className="text-slate-400">
              {lang === 'en'
                ? 'Generates pseudo-random integers so each game question is fresh and unpredictable.'
                : 'Generează factori numerici aleatorii între 4 și 10 pentru ca fiecare întrebare din joc să fie diferită.'}
            </p>
          </div>
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="font-bold text-sky-300 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sky-400" />
              {lang === 'en' ? '2. "ask and wait" & "answer"' : '2. „întreabă și așteaptă” & „răspuns”'}
            </div>
            <p className="text-slate-400">
              {lang === 'en'
                ? 'Opens a text input prompt at the bottom of the stage and saves the user response into the `answer` reporter.'
                : 'Deschide o casetă de tastare pe scenă și salvează textul introdus în blocul special `răspuns`.'}
            </p>
          </div>
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="font-bold text-amber-300 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              {lang === 'en' ? '3. Scoring & Cheer Sounds' : '3. Punctajul & Efecte Sonore'}
            </div>
            <p className="text-slate-400">
              {lang === 'en'
                ? 'Compares `answer = (a * b)`. If true, `change score by 1` and plays Cheer; otherwise plays Crowd Gasp.'
                : 'Compară dacă `răspuns = (a * b)`. Dacă da, adună 1 la scor și redă un sunet de victorie.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Playable Game Simulator */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <h3>{lang === 'en' ? 'Live Interactive Math Game Simulator' : 'Laborator Interactiv: Jocul Matematic Scratch'}</h3>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">{lang === 'en' ? 'Variable [scor]:' : 'Variabila [scor]:'}</span>
            <strong className="text-amber-400 text-base">{scoreCount}</strong>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">
          {lang === 'en'
            ? 'Task: Answer at least 3 multiplication questions correctly to complete the challenge (+40 Pts)!'
            : 'Misiune practică: Răspunde corect la cel puțin 3 înmulțiri pentru a obține punctajul (+40 Pcte)!'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Scratch Game Stage Canvas */}
          <div className="md:col-span-7 bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-between min-h-[260px]">
            {/* RoboTIC Question Bubble */}
            <div className="w-full flex items-center justify-center">
              <div className="bg-white text-slate-950 font-bold text-sm sm:text-base px-5 py-3 rounded-2xl rounded-bl-none shadow-2xl border-2 border-purple-500 animate-pulse text-center">
                {lang === 'en' ? `How much is ${numA} × ${numB} ?` : `Cât face ${numA} × ${numB} ?`}
              </div>
            </div>

            <div className="my-3 text-5xl">
              🤖
            </div>

            {/* Stage Input Form (mimicking Scratch ask and wait prompt) */}
            <form onSubmit={handleSubmitAnswer} className="w-full flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  autoFocus
                  value={userAnswerInput}
                  onChange={e => setUserAnswerInput(e.target.value)}
                  placeholder={lang === 'en' ? 'Type answer...' : 'Scrie răspunsul...'}
                  className="w-full bg-slate-900 border-2 border-sky-500 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-inner"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{lang === 'en' ? 'Submit' : 'Trimite'}</span>
              </button>
            </form>

            {feedbackMessage && (
              <div className={`mt-2 text-xs font-bold px-3 py-1 rounded-full ${
                isCorrectFeedback ? 'bg-emerald-950 text-emerald-300 border border-emerald-500' : 'bg-rose-950 text-rose-300 border border-rose-500'
              }`}>
                {feedbackMessage}
              </div>
            )}
          </div>

          {/* Scratch Script Representation */}
          <div className="md:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              {lang === 'en' ? 'Scratch Quiz Script Structure:' : 'Structura Scriptului Scratch:'}
            </span>

            <div className="p-2 rounded bg-amber-500 text-slate-950 font-bold">
              când se dă clic pe 🚩
            </div>
            <div className="p-2 rounded bg-orange-600 text-white">
              setează [scor] la (0)
            </div>
            <div className="p-2 rounded bg-sky-500 text-slate-950 font-bold">
              întreabă (alătură [Cât face ] ...) și așteaptă
            </div>
            <div className="p-2 rounded bg-amber-600 text-white border-l-4 border-amber-400 pl-3">
              <div>dacă &lt;(răspuns) = (A * B)&gt; atunci</div>
              <div className="pl-3 text-orange-300">modifică [scor] cu (1)</div>
              <div className="pl-3 text-purple-300">spune [Bravo!] pentru 1 sec</div>
              <div>altfel</div>
              <div className="pl-3 text-purple-300">spune [Greșit!] pentru 1 sec</div>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Quiz */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span>{lang === 'en' ? 'Input & Random Blocks Quiz' : 'Evaluare: Întrebări și Factori Aleatorii'}</span>
        </h3>

        {/* Question 1 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
            </span>
            <QuestionHint
              hintRo="Instrucțiunea care solicită introducerea de text și oprește temporar scriptul până la apăsarea tastei Enter este „întreabă și așteaptă”."
              hintEn="The block that displays a text prompt and pauses execution until Enter is pressed is 'ask and wait'."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'Where is the user’s typed text stored after the block "întreabă [...] și așteaptă" is executed?'
              : 'Unde se stochează textul introdus de utilizator după executarea blocului „întreabă [...] și așteaptă” în Scratch?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'ask_and_wait', ro: 'În blocul reporter special „răspuns” (answer) din categoria Detectare', en: 'Inside the special "answer" reporter block in the Sensing category' },
              { id: 'notepad_file', ro: 'Într-un fișier separat Notepad de pe desktop', en: 'In a separate Notepad file on the desktop' },
              { id: 'browser_url', ro: 'În bara de adrese URL a browserului', en: 'In the browser address bar' },
              { id: 'lost_forever', ro: 'Se pierde imediat fără a putea fi citit', en: 'Lost immediately without being readable' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q1 || 0) > 0}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'ask_and_wait'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-emerald-400 text-slate-300'
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
              customMessageRo="Reflecție didactică: Blocul „răspuns” păstrează întotdeauna ultimul text introdus de la tastatură!"
              customMessageEn="Pedagogical reflection: The 'answer' reporter always stores the last keyboard input!"
            />
          ) : null}
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanationRo="Blocul „răspuns” poate fi comparat cu soluția așteptată sau afișat în mesaje ulterioare."
              explanationEn="The 'answer' block can be compared with expected calculations or echoed in messages."
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
            </span>
            <QuestionHint
              hintRo="Generarea de numere neprevăzute se face cu blocul verde „alege aleator între () și ()” din categoria Operatori."
              hintEn="Generating unpredictable numbers is done with 'pick random () to ()' in the Operators category."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'Which block is used to generate a random number between 4 and 10 for math questions?'
              : 'Ce bloc este folosit pentru a alege un număr la întâmplare între 4 și 10 pentru întrebările din joc?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'pick_random', ro: 'alege aleator între (4) și (10) din categoria Operatori', en: 'pick random (4) to (10) from Operators category' },
              { id: 'glide_random', ro: 'glisează 1 secunde la poziție aleatorie', en: 'glide 1 secs to random position' },
              { id: 'change_var', ro: 'modifică variabila cu 10', en: 'change variable by 10' },
              { id: 'show_random', ro: 'arată personajul', en: 'show sprite' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q2 || 0) > 0}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'pick_random'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-emerald-400 text-slate-300'
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
              customMessageRo="Reflecție didactică: Numerele aleatorii fac jocurile dinamice și rejucabile!"
              customMessageEn="Pedagogical reflection: Random numbers make games dynamic and endlessly replayable!"
            />
          ) : null}
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanationRo="Blocul „alege aleator” generează o valoare întreagă cuprinsă inclusiv între cele două limite specificate."
              explanationEn="The 'pick random' block outputs an inclusive integer within the specified range."
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentPage={3}
        totalPages={7}
        earnedScore={totalScore}
        isCompleted={isPageComplete}
        onNextPage={() => {
          sounds.playCorrect();
          onCompletePage(totalScore);
        }}
        nextButtonLabelRo="Continuă la Pagina 4: Extensia Muzică în Scratch"
        nextButtonLabelEn="Proceed to Page 4: Music Extension in Scratch"
      />
    </div>
  );
};
