import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Wrench, 
  RotateCcw,
  Bot,
  Check
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface ALevel3Props {
  onCompletePage: (earnedScore: number) => void;
}

interface AmbiguityBug {
  id: string;
  flawedTextRo: string;
  flawedTextEn: string;
  problemType: 'claritate' | 'finitudine' | 'unicitate';
  flawExplanationRo: string;
  flawExplanationEn: string;
  fixedTextRo: string;
  fixedTextEn: string;
}

const AMBIGUITY_BUGS: AmbiguityBug[] = [
  {
    id: 'b1',
    flawedTextRo: '„Dacă plouă afară, citește o carte sau joacă-te pe calculator.”',
    flawedTextEn: '"If it rains outside, read a book or play a computer game."',
    problemType: 'unicitate',
    flawExplanationRo: 'Lipsește unicitatea: un calculator nu are liber arbitru pentru a alege între două variante contradictorii fără o regulă clară.',
    flawExplanationEn: 'Lacks uniqueness: a computer cannot guess between two arbitrary actions without a strict priority rule.',
    fixedTextRo: '„Dacă plouă afară, citește o carte timp de 30 de minute.”',
    fixedTextEn: '"If it rains outside, read a book for 30 minutes."'
  },
  {
    id: 'b2',
    flawedTextRo: '„Pune în ceai un vârf de cuțit de zahăr și amestecă puțin.”',
    flawedTextEn: '"Put a pinch of sugar into the tea and stir a little bit."',
    problemType: 'claritate',
    flawExplanationRo: 'Lipsește claritatea: expresiile subiective („un vârf”, „puțin”) sunt necunoscute unui robot. Sunt necesare unități de măsură exacte (ex: 5 grame, 10 rotații).',
    flawExplanationEn: 'Lacks clarity: subjective terms ("a pinch", "a little") are invalid for robots. Exact units (5 grams, 10 rotations) are required.',
    fixedTextRo: '„Adaugă exact 5 grame de zahăr și amestecă cu lingurița timp de 10 secunde.”',
    fixedTextEn: '"Add exactly 5 grams of sugar and stir with a spoon for 10 seconds."'
  },
  {
    id: 'b3',
    flawedTextRo: '„Pasul 1: Fă un pas înainte. Pasul 2: Repetă Pasul 1.”',
    flawedTextEn: '"Step 1: Take one step forward. Step 2: Repeat Step 1."',
    problemType: 'finitudine',
    flawExplanationRo: 'Lipsește finitudinea: instrucțiunea creează o buclă infinită fără nicio condiție de oprire (robotul va merge la nesfârșit până lovește un perete).',
    flawExplanationEn: 'Lacks finiteness: creates an infinite loop with no termination condition (the robot walks forever).',
    fixedTextRo: '„Repetă Pasul 1 de 5 ori, apoi oprește-te.”',
    fixedTextEn: '"Repeat Step 1 exactly 5 times, then STOP."'
  }
];

export const ALevel3_AmbiguityTrap: React.FC<ALevel3Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Interactive Fixer State
  const [diagnosedBugs, setDiagnosedBugs] = useState<Record<string, string | null>>({
    b1: null,
    b2: null,
    b3: null
  });
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  // Quiz State
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  // Timer cooldown decrement
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

  const handleDiagnose = (bugId: string, flawType: 'claritate' | 'finitudine' | 'unicitate') => {
    if ((cooldowns[bugId] || 0) > 0) return;
    sounds.playClick();
    setDiagnosedBugs(prev => ({ ...prev, [bugId]: flawType }));

    const targetBug = AMBIGUITY_BUGS.find(b => b.id === bugId);
    if (targetBug && targetBug.problemType === flawType) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, [bugId]: 5 }));
    }
  };

  const handleResetBugs = () => {
    sounds.playClick();
    setDiagnosedBugs({ b1: null, b2: null, b3: null });
  };

  // Quiz handlers
  const isQ1Correct = q1Answer === 'subjective_terms';
  const handleQ1 = (val: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    sounds.playClick();
    setQ1Answer(val);
    if (val === 'subjective_terms') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const isQ2Correct = q2Answer === 'stop_condition';
  const handleQ2 = (val: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    sounds.playClick();
    setQ2Answer(val);
    if (val === 'stop_condition') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  // Scoring
  let correctCount = 0;
  AMBIGUITY_BUGS.forEach(b => {
    if (diagnosedBugs[b.id] === b.problemType) correctCount++;
  });
  if (isQ1Correct) correctCount++;
  if (isQ2Correct) correctCount++;

  const totalQuestions = 5;
  const earnedScore = Math.round((correctCount / totalQuestions) * 15);
  const canProceed = correctCount >= 3;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn select-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/60 border border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-rose-500/20 border border-rose-400/40 rounded-2xl text-rose-300 text-3xl shrink-0 shadow-inner">
            ⚠️
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400 uppercase tracking-widest mb-1">
              <span>{lang === 'en' ? 'Module 5A • Page 3 of 7' : 'Modulul 5A • Pagina 3 din 7'}</span>
              <span>•</span>
              <span className="text-slate-400">{lang === 'en' ? 'Textbook p. 58' : 'Manual pag. 58'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              {lang === 'en' ? '3. The Ambiguity Trap: Debugging Flawed Instructions' : '3. Capcana Ambiguităților: Depanarea Comenzilor Greșite'}
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              {lang === 'en'
                ? 'Computers do not possess intuition or common sense. If an instruction contains subjective terms ("a pinch", "maybe") or lacks an exit condition, the algorithm fails. Learn to debug real formulation errors!'
                : 'Spre deosebire de oameni, calculatoarele nu au intuiție și nu pot ghici ce a vrut să spună autorul. Dacă o comandă conține termeni vagi („puțin”, „la alegere”) sau nu se oprește, programul se blochează!'}
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Interactive Bug Debugger Simulator */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Wrench className="w-6 h-6 text-rose-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-heading">
                {lang === 'en' ? 'Robot Debugger: Diagnose Formulation Errors' : 'Depanatorul de Algoritmi: Diagnosticarea Erorilor din Manual'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'en' ? 'Textbook page 58, Exercise 2' : 'Manual pagina 58, Exercițiul 2'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetBugs}
            className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Reset' : 'Resetează'}</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">
          {lang === 'en'
            ? 'Identify which fundamental property is VIOLATED in each of the 3 flawed instructions below:'
            : 'Identifică ce proprietate este ÎNCĂLCATĂ în fiecare dintre cele 3 instrucțiuni greșite de mai jos:'}
        </p>

        <div className="space-y-4">
          {AMBIGUITY_BUGS.map((bug, idx) => {
            const currentDiagnose = diagnosedBugs[bug.id];
            const isCorrect = currentDiagnose === bug.problemType;
            const hasCooldown = (cooldowns[bug.id] || 0) > 0;

            return (
              <div
                key={bug.id}
                className={`p-5 rounded-2xl border transition space-y-3 ${
                  currentDiagnose
                    ? isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/60'
                      : 'bg-rose-950/40 border-rose-500/60'
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0 border border-rose-500/40 font-mono">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider mb-0.5">
                      {lang === 'en' ? 'Flawed Formulation:' : 'Formulare Greșită:'}
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {lang === 'en' ? bug.flawedTextEn : bug.flawedTextRo}
                    </div>
                  </div>
                </div>

                {hasCooldown && (
                  <PedagogicalReflectionBanner
                    cooldown={cooldowns[bug.id]}
                    customMessageRo="Diagnostic incorect! Te rugăm să acorzi 5 secunde pentru a analiza de ce instrucțiunea induce executantul în eroare."
                    customMessageEn="Incorrect diagnosis! Please take 5 seconds to analyze why the instruction fails."
                  />
                )}

                <div className="pt-1">
                  <div className="text-xs text-slate-400 mb-2 font-medium">
                    {lang === 'en' ? 'Select violated property:' : 'Alege proprietatea încălcată de această formulare:'}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'claritate', labelRo: 'Lipsă de Claritate (Termeni vagi)', labelEn: 'Lacks Clarity (Vague terms)' },
                      { key: 'unicitate', labelRo: 'Lipsă de Unicitate (Opțiuni ambigue)', labelEn: 'Lacks Uniqueness (Ambiguous options)' },
                      { key: 'finitudine', labelRo: 'Lipsă de Finitudine (Buclă infinită)', labelEn: 'Lacks Finiteness (Infinite loop)' }
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        disabled={hasCooldown}
                        onClick={() => handleDiagnose(bug.id, opt.key as any)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                          hasCooldown ? 'opacity-60 cursor-not-allowed' : ''
                        } ${
                          currentDiagnose === opt.key
                            ? opt.key === bug.problemType
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-md'
                              : 'bg-rose-500 text-white border-rose-400 font-extrabold shadow-md'
                            : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                        }`}
                      >
                        {lang === 'en' ? opt.labelEn : opt.labelRo}
                      </button>
                    ))}
                  </div>
                </div>

                {currentDiagnose && (
                  <div className={`p-3 rounded-xl border text-xs font-medium space-y-1.5 ${
                    isCorrect
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                  }`}>
                    {isCorrect ? (
                      <>
                        <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{lang === 'en' ? 'Diagnostic Corect!' : 'Diagnostic Corect!'}</span>
                        </div>
                        <p>{lang === 'en' ? bug.flawExplanationEn : bug.flawExplanationRo}</p>
                        <div className="pt-1 text-[11px] font-mono text-emerald-300">
                          <span className="font-bold text-white">
                            {lang === 'en' ? 'Corrected Version: ' : 'Varianta Corectată: '}
                          </span>
                          {lang === 'en' ? bug.fixedTextEn : bug.fixedTextRo}
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5 text-rose-300">
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{lang === 'en' ? 'Incorrect property. Re-read the instruction carefully.' : 'Proprietate incorectă. Reanalizează de ce comanda nu poate fi executată.'}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Knowledge Assessment Quiz */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white border-b border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-rose-400" />
          <span>{lang === 'en' ? 'Check Your Knowledge: Precision in Algorithms' : 'Verifică-ți Cunoștințele: Precizia în Algoritmi'}</span>
        </div>

        {/* Q1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-rose-400 uppercase font-mono">
            {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'Why must culinary terms like "salt to taste" or "stir a little" be converted into exact units for a robot?'
              : 'De ce formulările culinare precum „sare după gust” sau „amestecă puțin” trebuie transformate în valori exacte pentru un robot?'}
          </div>

          {(cooldowns.q1 || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q1}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza lipsa simțului gustului la calculatoare."
                customMessageEn="Incorrect answer! Please take 5 seconds to reflect on subjective terms in computing."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { id: 'subjective_terms', text: lang === 'en' ? 'A) Robots lack subjective senses and require measurable units (grams, seconds)' : 'A) Roboții nu au simțuri subiective și necesită unități măsurabile (grame, secunde)' },
              { id: 'robots_eat_everything', text: lang === 'en' ? 'B) Robots eat all the food anyway' : 'B) Roboții mănâncă oricum tot' },
              { id: 'salt_is_illegal', text: lang === 'en' ? 'C) Salt is forbidden in computing' : 'C) Sarea este interzisă în algoritmi' },
              { id: 'only_for_water', text: lang === 'en' ? 'D) Algorithms can only process liquid water' : 'D) Algoritmii pot procesa doar apă' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q1 || 0) > 0}
                onClick={() => handleQ1(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                  (cooldowns.q1 || 0) > 0 ? 'opacity-60 cursor-not-allowed' : ''
                } ${
                  q1Answer === opt.id
                    ? opt.id === 'subjective_terms'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="algo_q1_exact"
            hintRo="Un executant automat are nevoie de cifre și unități de măsură exacte, nu de impresii."
            hintEn="An automated executor needs numbers and exact units, not subjective impressions."
          />

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              cooldown={cooldowns.q1}
              explanation={
                isQ1Correct
                  ? (lang === 'en' ? 'Correct! Precise numerical quantities guarantee consistent execution.' : 'Corect! Un calculator sau robot nu are gust sau intuiție, având nevoie de cantități numerice exacte (ex: 3 grame, 10 secunde).')
                  : (lang === 'en' ? 'Incorrect. Subjective terms must be replaced with measurable units.' : 'Incorect. Termenii subiectivi trebuie convertiți în date măsurabile.')
              }
              ruleReference="Manual TIC pag. 58"
            />
          )}
        </div>

        {/* Q2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-rose-400 uppercase font-mono">
            {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'What essential element must be added to any repetitive instruction to prevent an infinite loop?'
              : 'Ce element obligatoriu trebuie adăugat oricărei instrucțiuni repetitive pentru a evita o buclă infinită?'}
          </div>

          {(cooldowns.q2 || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q2}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza rolul condiției de oprire."
                customMessageEn="Incorrect answer! Please take 5 seconds to reflect on loop stopping conditions."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { id: 'stop_condition', text: lang === 'en' ? 'A) A clear termination condition (e.g. "repeat 5 times" or "until wall is reached")' : 'A) O condiție clară de oprire (ex: „repetă de 5 ori” sau „până ajungi la perete”)' },
              { id: 'louder_sound', text: lang === 'en' ? 'B) A louder beep sound' : 'B) Un sunet mai puternic' },
              { id: 'different_color', text: lang === 'en' ? 'C) Painting the robot in blue' : 'C) Schimbarea culorii robotului' },
              { id: 'no_condition', text: lang === 'en' ? 'D) No condition is ever needed' : 'D) Nu este nevoie de nicio condiție' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={(cooldowns.q2 || 0) > 0}
                onClick={() => handleQ2(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                  (cooldowns.q2 || 0) > 0 ? 'opacity-60 cursor-not-allowed' : ''
                } ${
                  q2Answer === opt.id
                    ? opt.id === 'stop_condition'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          <QuestionHint
            hintId="algo_q2_stop"
            hintRo="Fără o condiție de oprire, repetiția continuă la nesfârșit (buclă infinită)."
            hintEn="Without a stopping condition, repetition continues endlessly (infinite loop)."
          />

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              cooldown={cooldowns.q2}
              explanation={
                isQ2Correct
                  ? (lang === 'en' ? 'Spot on! A termination condition guarantees the algorithm stops, fulfilling Finiteness.' : 'Exact! Condiția de oprire asigură că algoritmul nu rulează la nesfârșit, respectând proprietatea de Finitudine.')
                  : (lang === 'en' ? 'Incorrect. An explicit stopping condition is mandatory.' : 'Incorect. O condiție de oprire este obligatorie pentru a preveni blocarea sistemului.')
              }
              ruleReference="Manual TIC pag. 58"
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        score={earnedScore}
        totalPoints={15}
        correctCount={correctCount}
        totalQuestions={totalQuestions}
        canProceed={canProceed}
        onProceed={() => {
          sounds.playCorrect();
          onCompletePage(earnedScore);
        }}
      />
    </div>
  );
};
