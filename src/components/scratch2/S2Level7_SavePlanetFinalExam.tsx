import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Play, 
  RotateCcw, 
  Check, 
  ExternalLink,
  Award,
  TreePine,
  Trash2,
  HeartHandshake
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface S2Level7Props {
  onCompletePage: (earnedScore: number) => void;
}

export const S2Level7_SavePlanetFinalExam: React.FC<S2Level7Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Project "Salvăm Planeta" eco-cleaning simulation state
  const [cleanedCount, setCleanedCount] = useState<number>(0);
  const [items, setItems] = useState<Array<{ id: number; name: string; icon: string; cleaned: boolean; x: number; y: number }>>([
    { id: 1, name: 'Plastic bottle', icon: '🍾', cleaned: false, x: 20, y: 35 },
    { id: 2, name: 'Can', icon: '🥫', cleaned: false, x: 70, y: 60 },
    { id: 3, name: 'Plastic bag', icon: '🛍️', cleaned: false, x: 45, y: 75 },
    { id: 4, name: 'Battery', icon: '🔋', cleaned: false, x: 80, y: 25 },
  ]);
  const [planetEcoScore, setPlanetEcoScore] = useState<number>(50);

  // Grand Final Assessment Quiz (4 Questions covering full curriculum)
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);
  const [q4Answer, setQ4Answer] = useState<string | null>(null);
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

  const handleCleanItem = (id: number) => {
    sounds.playCorrect();
    setItems(prev =>
      prev.map(it => (it.id === id ? { ...it, cleaned: true } : it))
    );
    const newCount = cleanedCount + 1;
    setCleanedCount(newCount);
    setPlanetEcoScore(prev => Math.min(100, prev + 15));
    if (newCount === items.length) {
      sounds.playStar();
    }
  };

  const handleResetEco = () => {
    sounds.playClick();
    setItems(items.map(it => ({ ...it, cleaned: false })));
    setCleanedCount(0);
    setPlanetEcoScore(50);
  };

  // Quiz Handlers
  const handleQ1 = (id: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    setQ1Answer(id);
    if (id === 'scratch_mit') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const handleQ2 = (id: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    setQ2Answer(id);
    if (id === 'algo_properties') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  const handleQ3 = (id: string) => {
    if ((cooldowns.q3 || 0) > 0) return;
    setQ3Answer(id);
    if (id === 'decision_rhombus') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q3: 5 }));
    }
  };

  const handleQ4 = (id: string) => {
    if ((cooldowns.q4 || 0) > 0) return;
    setQ4Answer(id);
    if (id === 'forever_stop') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q4: 5 }));
    }
  };

  const isQ1Correct = q1Answer === 'scratch_mit';
  const isQ2Correct = q2Answer === 'algo_properties';
  const isQ3Correct = q3Answer === 'decision_rhombus';
  const isQ4Correct = q4Answer === 'forever_stop';

  const isEcoLabComplete = cleanedCount === items.length;

  let totalScore = 0;
  if (isEcoLabComplete) totalScore += 20;
  if (isQ1Correct) totalScore += 20;
  if (isQ2Correct) totalScore += 20;
  if (isQ3Correct) totalScore += 20;
  if (isQ4Correct) totalScore += 20;

  const isPageComplete = isEcoLabComplete && isQ1Correct && isQ2Correct && isQ3Correct && isQ4Correct;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600/40 via-teal-600/30 to-slate-900 border-2 border-emerald-500/50 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/40 text-emerald-300">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {lang === 'en' ? 'Unit 6 • Grand Final Evaluation' : 'Unitatea 6 • Marea Evaluare Finală'}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {lang === 'en' ? 'Page 7 of 7 • Graduation' : 'Pagina 7 din 7 • Absolvire'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {lang === 'en'
                  ? 'Project "Save the Planet" & Grade 5 Grand Evaluation'
                  : 'Proiectul „Salvăm Planeta” & Marea Evaluare Finală Clasa a V-a'}
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
          <h2>{lang === 'en' ? 'End of Grade 5 Informatics & ICT (Textbook p. 93)' : 'Final de Clasa a V-a: Informatică și TIC (Manual pag. 93)'}</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {lang === 'en'
            ? 'Congratulations! You have mastered all 6 fundamental units of the official 5th grade curriculum: (1) Computer Architecture & Safety, (2) Files, Folders & Windows OS, (3) Internet & Cyber Security, (4) Word Text Editing & Formatting, (5) Algorithms & Decision Structures, and (6) Visual Block Programming in Scratch 3.0!'
            : 'Felicitări! Ai parcurs cu succes toate cele 6 unități curriculare ale manualului oficial de Clasa a V-a (Editura Art Klett): (1) Arhitectura Calculatorului & Ergonomie, (2) Fișiere, Foldere & Windows, (3) Internet & Securitate Cibernetică, (4) Tehnoredactare Text Word, (5) Algoritmi & Scheme Logice și (6) Programare Vizuală în Scratch 3.0!'}
        </p>
      </div>

      {/* Interactive Project: "Salvăm Planeta" Ecology Simulation */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <TreePine className="w-5 h-5 text-emerald-400" />
            <h3>{lang === 'en' ? 'Interactive Project: "Save the Planet"' : 'Proiect Practic: „Salvăm Planeta” (Curățenie Ecologică)'}</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-xs font-mono">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Sănătatea Planetei:</span>
              <strong className="text-emerald-400 text-sm">{planetEcoScore}%</strong>
            </div>
            <button
              type="button"
              onClick={handleResetEco}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Reset' : 'Resetează'}</span>
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">
          {lang === 'en'
            ? 'Click on each piece of waste in the virtual nature park to trigger the Scratch collection script and restore planet health to 100%!'
            : 'Apasă pe fiecare deșeu de pe scena virtuală pentru a executa scriptul Scratch de reciclare și a ridica sănătatea planetei la 100%!'}
        </p>

        {/* Eco Park Interactive Canvas */}
        <div className="relative w-full aspect-[16/9] max-h-[300px] bg-gradient-to-b from-sky-900 via-teal-950 to-emerald-950 rounded-2xl border-2 border-emerald-500/40 overflow-hidden select-none p-4 shadow-2xl">
          {/* Nature decorations */}
          <div className="absolute bottom-4 left-6 text-5xl opacity-80 pointer-events-none">🌲</div>
          <div className="absolute bottom-4 left-24 text-4xl opacity-70 pointer-events-none">🌳</div>
          <div className="absolute bottom-4 right-10 text-5xl opacity-80 pointer-events-none">🌲</div>
          <div className="absolute top-4 right-8 text-4xl opacity-90 animate-pulse pointer-events-none">☀️</div>

          {/* Eco Robot Assistant */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none drop-shadow-2xl">
            <div className="text-5xl animate-bounce">
              🤖🌱
            </div>
            <span className="text-[10px] font-bold text-white bg-slate-900/90 px-2 py-0.5 rounded-full border border-emerald-500">
              RoboTIC Eco-Patrol
            </span>
          </div>

          {/* Clickable Waste Sprites */}
          {items.map(it => (
            !it.cleaned ? (
              <button
                key={it.id}
                type="button"
                onClick={() => handleCleanItem(it.id)}
                style={{ left: `${it.x}%`, top: `${it.y}%` }}
                className="absolute text-3xl p-2 rounded-2xl bg-slate-900/80 hover:bg-emerald-950 border-2 border-amber-400 hover:border-emerald-400 animate-pulse shadow-lg transition transform hover:scale-125 cursor-pointer"
                title={it.name}
              >
                {it.icon}
              </button>
            ) : null
          ))}

          {/* All Clean Banner */}
          {isEcoLabComplete && (
            <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fade-in z-20">
              <div className="text-5xl mb-1">🌍✨</div>
              <h4 className="text-base sm:text-lg font-bold text-emerald-300">
                {lang === 'en'
                  ? 'The park is sparkling clean! Planet health restored (+20 Pts)!'
                  : 'Parcul este complet curat! Sănătatea planetei a fost restabilită (+20 Pcte)!'}
              </h4>
            </div>
          )}
        </div>
      </div>

      {/* Grand Final Assessment: 4 Questions */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span>{lang === 'en' ? 'Grand Final Assessment (Grade 5 Official Curriculum)' : 'Marea Evaluare Finală (Curriculum Oficial Clasa a V-a)'}</span>
        </h3>

        {/* Question 1 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {lang === 'en' ? 'Question 1 of 4 • Scratch Environment' : 'Întrebarea 1 din 4 • Mediul Scratch'}
            </span>
            <QuestionHint
              hintRo="Scratch a fost creat de MIT Media Lab pentru învățarea intuitivă a gândirii computaționale prin blocuri puzzle."
              hintEn="Scratch was created by MIT Media Lab for intuitive block puzzle computational learning."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'What is Scratch 3.0 and what is its primary educational objective?'
              : 'Ce este mediul Scratch 3.0 și care este scopul său educațional principal?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'scratch_mit', ro: 'Un mediu grafic vizual de programare cu blocuri puzzle pentru dezvoltarea gândirii algoritmice', en: 'A visual block-based programming environment developed by MIT for algorithmic thinking' },
              { id: 'antivirus_tool', ro: 'Un program antivirus pentru curățarea hard diskului', en: 'An antivirus program for hard drive cleaning' },
              { id: 'keyboard_driver', ro: 'Un driver pentru tastatură și imprimantă', en: 'A driver for keyboards and printers' },
              { id: 'video_card', ro: 'O componentă hardware din interiorul carcasei', en: 'A hardware component inside computer case' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q1 || 0) > 0}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'scratch_mit'
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
              customMessageRo="Reflecție didactică: Scratch înlocuiește sintaxa textuală dificilă cu blocuri colorate vizuale!"
              customMessageEn="Pedagogical reflection: Scratch replaces difficult text syntax with visual colored blocks!"
            />
          ) : null}
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanationRo="Scratch permite elevilor de clasa a V-a să creeze jocuri, povești animate și muzică fără a risca erori de scriere a codului."
              explanationEn="Scratch enables 5th graders to build games, animated stories and music free of text syntax typos."
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {lang === 'en' ? 'Question 2 of 4 • Algorithms' : 'Întrebarea 2 din 4 • Algoritmi'}
            </span>
            <QuestionHint
              hintRo="Proprietățile fundamentale ale oricărui algoritm sunt: Claritatea (neambiguitatea), Finitudinea și Generalitatea."
              hintEn="The core properties of any algorithm are: Clarity, Finitude, and Generality."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'Which of the following represents the core properties of any correct algorithm?'
              : 'Care dintre următoarele reprezintă proprietățile fundamentale ale oricărui algoritm corect?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'algo_properties', ro: 'Claritate (neambiguitate), Finitudine (număr finit de pași) și Generalitate', en: 'Clarity (unambiguous), Finitude (finite steps), and Generality' },
              { id: 'infinite_loop', ro: 'Să ruleze la infinit fără a se opri niciodată', en: 'To run infinitely without ever stopping' },
              { id: 'hardware_cost', ro: 'Prețul carcasei și viteza conexiunii Wi-Fi', en: 'Case price and Wi-Fi speed' },
              { id: 'color_only', ro: 'Doar culoarea folosită la desenarea fundalului', en: 'Only the background drawing color' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q2 || 0) > 0}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'algo_properties'
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
              customMessageRo="Reflecție didactică: Algoritmii trebuie să fie exacți, să se termine și să rezolve o clasă de probleme!"
              customMessageEn="Pedagogical reflection: Algorithms must be exact, finite, and solve a problem class!"
            />
          ) : null}
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanationRo="Un algoritm este o succesiune finită de operații clar definite care rezolvă orice problemă dintr-o categorie dată."
              explanationEn="An algorithm is a finite sequence of clearly defined steps resolving any problem of a given class."
            />
          )}
        </div>

        {/* Question 3 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {lang === 'en' ? 'Question 3 of 4 • Flowcharts & Decision' : 'Întrebarea 3 din 4 • Scheme Logice & Decizie'}
            </span>
            <QuestionHint
              hintRo="În schemele logice, blocul de decizie are formă de romb și dispune de două ramuri de ieșire (DA și NU)."
              hintEn="In flowcharts, the decision block is a rhombus shape with two output branches (YES and NO)."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'What geometric block is used to represent a decision/condition in a flowchart?'
              : 'Ce formă geometrică are blocul de decizie (condiție) într-o schemă logică?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'decision_rhombus', ro: 'Romb (cu două ramuri de ieșire: DA și NU)', en: 'Rhombus / Diamond (with two branches: YES and NO)' },
              { id: 'oval_end', ro: 'Oval (folosit doar la START și STOP)', en: 'Oval (used only for START and STOP)' },
              { id: 'rect_calc', ro: 'Dreptunghi (folosit doar pentru calcule și atribuiri)', en: 'Rectangle (used only for calculations)' },
              { id: 'parallel_io', ro: 'Paralelogram (folosit pentru citire și afișare)', en: 'Parallelogram (used for read and write)' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q3 || 0) > 0}
                onClick={() => handleQ3(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q3Answer === opt.id
                    ? opt.id === 'decision_rhombus'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-emerald-400 text-slate-300'
                }`}
              >
                {lang === 'en' ? opt.en : opt.ro}
              </button>
            ))}
          </div>
          {cooldowns.q3 && cooldowns.q3 > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.q3}
              totalSeconds={5}
              customMessageRo="Reflecție didactică: Rombul ramifică execuția în funcție de adevărul condiției evaluate!"
              customMessageEn="Pedagogical reflection: The rhombus branches execution based on condition truth value!"
            />
          ) : null}
          {q3Answer && (
            <AnswerExplanation
              isCorrect={isQ3Correct}
              explanationRo="Rombul este simbolul universal standard pentru structura alternativă (if-then-else) în informatică."
              explanationEn="The rhombus is the universal standard symbol for alternative conditional structures in computer science."
            />
          )}
        </div>

        {/* Question 4 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {lang === 'en' ? 'Question 4 of 4 • Program Control' : 'Întrebarea 4 din 4 • Controlul Programelor'}
            </span>
            <QuestionHint
              hintRo="Pentru a opri definitiv toate scripturile și animațiile dintr-un proiect Scratch se folosește blocul „oprește [tot]”."
              hintEn="To halt all scripts and animations immediately in Scratch, use 'stop [all]'."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'Which Scratch block is used to terminate all executing scripts when game over or victory is reached?'
              : 'Ce bloc Scratch oprește definitiv rularea tuturor scripturilor din joc la Game Over sau Victorie?'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'forever_stop', ro: 'oprește [tot] din categoria Control', en: 'stop [all] from Control category' },
              { id: 'forever_loop', ro: 'la nesfârșit (care continuă la infinit)', en: 'forever (which runs continuously)' },
              { id: 'pen_erase', ro: 'șterge tot din Creion', en: 'erase all from Pen' },
              { id: 'change_var', ro: 'modifică scorul cu 0', en: 'change score by 0' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q4 || 0) > 0}
                onClick={() => handleQ4(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q4Answer === opt.id
                    ? opt.id === 'forever_stop'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-emerald-400 text-slate-300'
                }`}
              >
                {lang === 'en' ? opt.en : opt.ro}
              </button>
            ))}
          </div>
          {cooldowns.q4 && cooldowns.q4 > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.q4}
              totalSeconds={5}
              customMessageRo="Reflecție didactică: Blocul „oprește tot” corespunde blocului terminator STOP din schemele logice!"
              customMessageEn="Pedagogical reflection: The 'stop all' block matches the terminal STOP block in flowcharts!"
            />
          ) : null}
          {q4Answer && (
            <AnswerExplanation
              isCorrect={isQ4Correct}
              explanationRo="Blocul „oprește [tot]” oprește toate procesele și cronometrele active, înghețând starea finală pe ecran."
              explanationEn="The 'stop [all]' block halts all active processes and timers, freezing the end state on screen."
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentPage={7}
        totalPages={7}
        earnedScore={totalScore}
        isCompleted={isPageComplete}
        onNextPage={() => {
          sounds.playStar();
          onCompletePage(totalScore);
        }}
        nextButtonLabelRo="🎓 Finalizează Misiunea 6B & Obține Diploma de Absolvire!"
        nextButtonLabelEn="🎓 Complete Mission 6B & Earn Graduation Diploma!"
      />
    </div>
  );
};
