import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Play, 
  Check, 
  RotateCcw, 
  ExternalLink,
  Plus,
  Minus,
  X,
  Divide,
  Percent,
  Link2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface SLevel6Props {
  onCompletePage: (earnedScore: number) => void;
}

export const SLevel6_RoboOperationsMath: React.FC<SLevel6Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive math test operands
  const [valA, setValA] = useState<number>(14);
  const [valB, setValB] = useState<number>(4);
  const [selectedOp, setSelectedOp] = useState<'+' | '-' | '*' | '/' | 'mod' | 'join'>('+');
  const [computedResult, setComputedResult] = useState<string | number>('18');
  const [speechBubble, setSpeechBubble] = useState<string>('Suma este: 18');
  const [labSuccess, setLabSuccess] = useState<boolean>(false);

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

  // Compute on inputs changed
  const handleCalculate = (op: '+' | '-' | '*' | '/' | 'mod' | 'join', a: number, b: number) => {
    sounds.playClick();
    setSelectedOp(op);
    let res: string | number = 0;
    let speech = '';

    if (op === '+') {
      res = a + b;
      speech = lang === 'en' ? `Sum is: ${res}` : `Suma este: ${res}`;
    } else if (op === '-') {
      res = a - b;
      speech = lang === 'en' ? `Difference is: ${res}` : `Diferența este: ${res}`;
    } else if (op === '*') {
      res = a * b;
      speech = lang === 'en' ? `Product is: ${res}` : `Produsul este: ${res}`;
    } else if (op === '/') {
      res = b !== 0 ? Number((a / b).toFixed(2)) : 'Eroare: div cu 0';
      speech = lang === 'en' ? `Quotient is: ${res}` : `Câtul este: ${res}`;
    } else if (op === 'mod') {
      res = b !== 0 ? a % b : 0;
      speech = lang === 'en' ? `Remainder (mod) is: ${res}` : `Restul (mod) este: ${res}`;
      if (!labSuccess) {
        sounds.playStar();
        setLabSuccess(true);
      }
    } else if (op === 'join') {
      res = `${a}${b}`;
      speech = lang === 'en' ? `Joined text: ${a} și ${b}` : `Text alăturat: ${a} și ${b}`;
    }

    setComputedResult(res);
    setSpeechBubble(speech);
  };

  // Quiz Handlers
  const handleQ1 = (id: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    setQ1Answer(id);
    if (id === 'mod_remainder') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const handleQ2 = (id: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    setQ2Answer(id);
    if (id === 'join_concat') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  const isQ1Correct = q1Answer === 'mod_remainder';
  const isQ2Correct = q2Answer === 'join_concat';

  let totalScore = 0;
  if (labSuccess) totalScore += 40;
  if (isQ1Correct) totalScore += 30;
  if (isQ2Correct) totalScore += 30;

  const isPageComplete = labSuccess && isQ1Correct && isQ2Correct;

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
                  {lang === 'en' ? 'Unit 6 • Scratch 3.0' : 'Unitatea 6 • Scratch 3.0'}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {lang === 'en' ? 'Page 6 of 7' : 'Pagina 6 din 7'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {lang === 'en'
                  ? 'Project "RoboOperations": Math Operators & Join Block'
                  : 'Proiectul „RoboOperații”: Operatori Matematici și Blocul Alătură'}
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
          <h2>{lang === 'en' ? 'Math Operators in Scratch (Textbook pp. 84–88)' : 'Operatorii Matematici în Scratch (Manual pag. 84–88)'}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-300">
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="font-bold text-emerald-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {lang === 'en' ? '1. Basic Arithmetic (+, -, *, /)' : '1. Operațiile de Bază (+, -, *, /)'}
            </div>
            <p className="text-slate-400">
              {lang === 'en'
                ? 'Round green operator blocks calculate values that fit seamlessly inside speech blocks or variable assignment slots.'
                : 'Blocurile rotunde verzi calculează valori care se introduc direct în blocurile de replică sau de atribuire.'}
            </p>
          </div>
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="font-bold text-amber-300 flex items-center gap-2">
              <Percent className="w-4 h-4 text-amber-400" />
              {lang === 'en' ? '2. Modulus (mod) Operator' : '2. Operatorul Mod (Restul)'}
            </div>
            <p className="text-slate-400">
              {lang === 'en'
                ? 'The `( ) mod ( )` block returns the integer remainder of a division. For example: 14 mod 4 = 2 (since 14 = 3×4 + 2).'
                : 'Blocul `( ) mod ( )` calculează restul împărțirii întregi. De exemplu: 14 mod 4 = 2 (deoarece 14 = 3×4 + 2).'}
            </p>
          </div>
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="font-bold text-teal-300 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-teal-400" />
              {lang === 'en' ? '3. The "join () ()" Block' : '3. Blocul „alătură () ()”'}
            </div>
            <p className="text-slate-400">
              {lang === 'en'
                ? 'Concatenates text labels with calculated numbers so RoboTIC can say full sentences like "Suma este: 18".'
                : 'Lipește un text explicativ cu o valoare calculată pentru ca RoboTIC să poată rosti fraze complete precum „Suma este: 18”.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Calculation & Speech Lab */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-white font-bold">
          <Calculator className="w-5 h-5 text-emerald-400" />
          <h3>{lang === 'en' ? 'Interactive Scratch Expression Evaluator' : 'Laborator Interactiv: Evaluatorul de Expresii Scratch'}</h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">
          {lang === 'en'
            ? 'Adjust operands A and B below and test all operator blocks. Task: Click the "mod" (rest) operator to complete the mission challenge!'
            : 'Modifică valorile A și B și testează blocurile de calcul. Misiune practică: Testează operatorul „mod” (restul) pentru a debloca punctajul!'}
        </p>

        {/* Inputs row */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 font-bold">A =</span>
            <input
              type="number"
              value={valA}
              onChange={e => {
                const val = Number(e.target.value) || 0;
                setValA(val);
                handleCalculate(selectedOp, val, valB);
              }}
              className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-sm font-mono text-white text-center focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 font-bold">B =</span>
            <input
              type="number"
              value={valB}
              onChange={e => {
                const val = Number(e.target.value) || 1;
                setValB(val);
                handleCalculate(selectedOp, valA, val);
              }}
              className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-sm font-mono text-white text-center focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Operator Buttons */}
          <div className="flex flex-wrap gap-2 ml-auto">
            <button
              type="button"
              onClick={() => handleCalculate('+', valA, valB)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition cursor-pointer ${
                selectedOp === '+' ? 'bg-emerald-500 text-slate-950 ring-2 ring-white' : 'bg-emerald-700 hover:bg-emerald-600 text-white'
              }`}
            >
              ( {valA} ) + ( {valB} )
            </button>
            <button
              type="button"
              onClick={() => handleCalculate('-', valA, valB)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition cursor-pointer ${
                selectedOp === '-' ? 'bg-emerald-500 text-slate-950 ring-2 ring-white' : 'bg-emerald-700 hover:bg-emerald-600 text-white'
              }`}
            >
              ( {valA} ) - ( {valB} )
            </button>
            <button
              type="button"
              onClick={() => handleCalculate('*', valA, valB)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition cursor-pointer ${
                selectedOp === '*' ? 'bg-emerald-500 text-slate-950 ring-2 ring-white' : 'bg-emerald-700 hover:bg-emerald-600 text-white'
              }`}
            >
              ( {valA} ) * ( {valB} )
            </button>
            <button
              type="button"
              onClick={() => handleCalculate('/', valA, valB)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition cursor-pointer ${
                selectedOp === '/' ? 'bg-emerald-500 text-slate-950 ring-2 ring-white' : 'bg-emerald-700 hover:bg-emerald-600 text-white'
              }`}
            >
              ( {valA} ) / ( {valB} )
            </button>
            <button
              type="button"
              onClick={() => handleCalculate('mod', valA, valB)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition cursor-pointer ${
                selectedOp === 'mod' ? 'bg-amber-400 text-slate-950 ring-2 ring-white' : 'bg-amber-600 hover:bg-amber-500 text-white'
              }`}
            >
              ( {valA} ) mod ( {valB} ) ⭐
            </button>
          </div>
        </div>

        {/* Scratch Block Preview & RoboTIC Speech Output */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Scratch Joined Block Representation */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {lang === 'en' ? 'Scratch Composite Block Structure:' : 'Structura Blocului Compus Scratch:'}
            </span>

            {/* Looks Say Wrapper */}
            <div className="p-3 bg-purple-600 rounded-2xl border-2 border-purple-700 text-white font-mono text-xs shadow-lg space-y-2">
              <div className="flex items-center gap-1.5">
                <span>spune</span>
                {/* Join operator block */}
                <div className="bg-emerald-600 px-2.5 py-1 rounded-full border border-emerald-500 flex items-center gap-1.5 text-white">
                  <span>alătură [Rezultatul este: ]</span>
                  {/* Math operator block */}
                  <div className="bg-emerald-500 px-2 py-0.5 rounded-full border border-emerald-400 text-slate-950 font-bold">
                    ( {valA} {selectedOp} {valB} )
                  </div>
                </div>
                <span>pentru (2) secunde</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Evaluare: <strong className="text-emerald-400">{computedResult}</strong>
            </div>
          </div>

          {/* Stage Character View */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center min-h-[160px]">
            {/* Speech bubble */}
            <div className="mb-2 bg-white text-slate-950 font-bold text-xs px-4 py-2 rounded-2xl rounded-bl-none shadow-2xl border-2 border-purple-500 animate-pulse">
              {speechBubble}
            </div>
            <div className="text-5xl animate-float">
              🤖
            </div>
            <span className="text-[10px] text-slate-400 mt-1">RoboTIC</span>
          </div>
        </div>
      </div>

      {/* Assessment Quiz */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span>{lang === 'en' ? 'Math & String Operators Quiz' : 'Evaluare: Operatori Aritmetici și Concatenare'}</span>
        </h3>

        {/* Question 1 */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
            </span>
            <QuestionHint
              hintRo="Împarte 17 la 5: 17 = 3 × 5 + 2. Restul este 2."
              hintEn="Divide 17 by 5: 17 = 3 × 5 + 2. The remainder is 2."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'What is the evaluated output of the Scratch block "(17) mod (5)"?'
              : 'Care este rezultatul calculat de blocul Scratch „(17) mod (5)”?'
            }
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'mod_remainder', ro: '2 (restul împărțirii lui 17 la 5)', en: '2 (the remainder of 17 divided by 5)' },
              { id: 'mod_quotient', ro: '3 (câtul întreg)', en: '3 (the integer quotient)' },
              { id: 'mod_sum', ro: '22 (suma celor două numere)', en: '22 (sum of both numbers)' },
              { id: 'mod_decimal', ro: '3.4 (împărțirea cu zecimale)', en: '3.4 (decimal division)' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q1 || 0) > 0}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'mod_remainder'
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
              customMessageRo="Reflecție didactică: Operatorul mod furnizează exclusiv restul împărțirii a două numere întregi!"
              customMessageEn="Pedagogical reflection: The mod operator strictly returns the remainder of integer division!"
            />
          ) : null}
          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              explanationRo="17 împărțit la 5 dă câtul 3 și restul 2. Blocul „mod” returnează întotdeauna restul împărțirii întregi."
              explanationEn="17 divided by 5 gives quotient 3 with remainder 2. The 'mod' block always produces the remainder."
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
              hintRo="Blocul „alătură () ()” lipește (concatenează) două texte sau numere într-un singur șir continuu."
              hintEn="The 'join () ()' block concatenates two texts or values into a single continuous string."
            />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? 'What is the function of the green operator block "alătură (text1) (text2)" (join)?'
              : 'Care este rolul blocului operator verde „alătură (text1) (text2)” (join) în Scratch?'
            }
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'join_concat', ro: 'Concatenează (lipește) două bucăți de text sau valori într-un singur șir de caractere', en: 'Concatenates (joins) two strings or values into one continuous text string' },
              { id: 'join_sum', ro: 'Adună matematic valorile ca pe o sumă numerică', en: 'Mathematically adds numbers as a numerical sum' },
              { id: 'join_split', ro: 'Șterge spațiile goale din propoziție', en: 'Deletes whitespace from sentences' },
              { id: 'join_compare', ro: 'Verifică dacă textele sunt identice', en: 'Compares if both texts are identical' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q2 || 0) > 0}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'join_concat'
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
              customMessageRo="Reflecție didactică: Alăturarea permite construirea de mesaje dinamice pentru utilizator!"
              customMessageEn="Pedagogical reflection: Joining allows dynamic messages composed of labels and variables!"
            />
          ) : null}
          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              explanationRo="Blocul „alătură” unește două valori alfanumerice fără a efectua o adunare numerică (ex: alătură [3] [4] devine [34])."
              explanationEn="The 'join' block binds two alphanumeric values together without arithmetic addition (e.g. join 3 and 4 becomes 34)."
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
        nextButtonLabelRo="Continuă la Pagina 7: Extensia Creion / Stiloul Magic"
        nextButtonLabelEn="Proceed to Page 7: The Magic Pen Extension"
      />
    </div>
  );
};
