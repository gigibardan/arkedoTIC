import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  BookOpen, 
  Layers, 
  Target, 
  Clock, 
  Check, 
  Cpu,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';
import { QuestionHint } from '../text1/QuestionHint';
import { AnswerExplanation } from '../text1/AnswerExplanation';
import { PageNavigationFooter } from '../text1/PageNavigationFooter';
import { PedagogicalReflectionBanner } from '../common/usePedagogicalCooldown';

interface ALevel2Props {
  onCompletePage: (earnedScore: number) => void;
}

interface ScenarioCard {
  id: string;
  scenarioRo: string;
  scenarioEn: string;
  correctProperty: 'claritate' | 'generalitate' | 'finitudine' | 'succesiune';
  explanationRo: string;
  explanationEn: string;
}

const SCENARIOS: ScenarioCard[] = [
  {
    id: 's1',
    scenarioRo: 'Algoritmul de calcul al ariei dreptunghiului funcționează pentru ORICE dreptunghi din lume (cu lungimi de 2m, 50m sau 1000m), nu doar pentru o singură foaie.',
    scenarioEn: 'The rectangle area algorithm works for ANY rectangle in the world (with sides of 2m, 50m or 1000m), not just a single sheet.',
    correctProperty: 'generalitate',
    explanationRo: 'Generalitatea înseamnă că algoritmul rezolvă o întreagă clasă de probleme similare, nu doar un caz particular.',
    explanationEn: 'Generality means the algorithm solves a whole class of similar problems with variable input data.'
  },
  {
    id: 's2',
    scenarioRo: 'Fiecare operație este exprimată fără echivoc („adaugă 50 ml de apă”, nu „pune puțină apă după ochi”). Executantul știe exact ce are de făcut.',
    scenarioEn: 'Every operation is stated without ambiguity ("add 50 ml of water", not "add some water"). The executor knows precisely what to do.',
    correctProperty: 'claritate',
    explanationRo: 'Claritatea presupune că fiecare comandă este precisă, neinterpretabilă și aparține vocabularului executantului.',
    explanationEn: 'Clarity guarantees that every instruction is precise, unambiguous, and directly executable.'
  },
  {
    id: 's3',
    scenarioRo: 'Algoritmul se oprește garantat după un număr determinat de pași și oferă rezultatul, fără a intra într-o buclă infinită.',
    scenarioEn: 'The algorithm is guaranteed to stop after a finite number of steps and return the result without infinite looping.',
    correctProperty: 'finitudine',
    explanationRo: 'Finitudinea asigură oprirea execuției după un număr finit de operații.',
    explanationEn: 'Finiteness ensures the algorithm terminates in finite time and steps.'
  },
  {
    id: 's4',
    scenarioRo: 'Pașii se execută într-o ordine strict determinată (Pasul 1, apoi Pasul 2, apoi Pasul 3), fără a sări aleatoriu între instrucțiuni.',
    scenarioEn: 'Steps execute in a strictly defined chronological order (Step 1, then Step 2, then Step 3) without random jumps.',
    correctProperty: 'succesiune',
    explanationRo: 'Succesiunea determinată a pașilor definește ordinea logică și cronologică obligatorie a instrucțiunilor.',
    explanationEn: 'Deterministic step sequencing establishes the mandatory logical order of execution.'
  }
];

export const ALevel2_AlgorithmProperties: React.FC<ALevel2Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();

  // Matcher State: scenario id -> chosen property
  const [matches, setMatches] = useState<Record<string, string | null>>({
    s1: null,
    s2: null,
    s3: null,
    s4: null
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

  const handleSelectProperty = (scenarioId: string, propKey: string) => {
    if ((cooldowns[scenarioId] || 0) > 0) return;
    sounds.playClick();
    setMatches(prev => ({ ...prev, [scenarioId]: propKey }));

    const targetScenario = SCENARIOS.find(s => s.id === scenarioId);
    if (targetScenario && targetScenario.correctProperty === propKey) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, [scenarioId]: 5 }));
    }
  };

  const handleResetMatcher = () => {
    sounds.playClick();
    setMatches({ s1: null, s2: null, s3: null, s4: null });
  };

  // Quiz handlers
  const isQ1Correct = q1Answer === 'generalitate';
  const handleQ1 = (val: string) => {
    if ((cooldowns.q1 || 0) > 0) return;
    sounds.playClick();
    setQ1Answer(val);
    if (val === 'generalitate') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q1: 5 }));
    }
  };

  const isQ2Correct = q2Answer === 'finitudine';
  const handleQ2 = (val: string) => {
    if ((cooldowns.q2 || 0) > 0) return;
    sounds.playClick();
    setQ2Answer(val);
    if (val === 'finitudine') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      setCooldowns(prev => ({ ...prev, q2: 5 }));
    }
  };

  // Scoring
  let correctCount = 0;
  SCENARIOS.forEach(sc => {
    if (matches[sc.id] === sc.correctProperty) correctCount++;
  });
  if (isQ1Correct) correctCount++;
  if (isQ2Correct) correctCount++;

  const totalQuestions = 6;
  const earnedScore = Math.round((correctCount / totalQuestions) * 15);
  const canProceed = correctCount >= 4;

  const propertyOptions = [
    { key: 'claritate', labelRo: 'Claritate', labelEn: 'Clarity' },
    { key: 'generalitate', labelRo: 'Generalitate', labelEn: 'Generality' },
    { key: 'finitudine', labelRo: 'Finitudine', labelEn: 'Finiteness' },
    { key: 'succesiune', labelRo: 'Succesiune determinată', labelEn: 'Deterministic steps' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn select-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900/60 via-slate-900 to-yellow-900/60 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-amber-500/20 border border-amber-400/40 rounded-2xl text-amber-300 text-3xl shrink-0 shadow-inner">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest mb-1">
              <span>{lang === 'en' ? 'Module 5A • Page 2 of 7' : 'Modulul 5A • Pagina 2 din 7'}</span>
              <span>•</span>
              <span className="text-slate-400">{lang === 'en' ? 'Textbook p. 56–57' : 'Manual pag. 56–57'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              {lang === 'en' ? '2. The Fundamental Properties of Algorithms' : '2. Proprietățile Fundamentale ale Algoritmilor'}
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              {lang === 'en'
                ? 'An effective algorithm must satisfy strict core properties: Clarity, Generality, Finiteness, Deterministic step order, Uniqueness, and Efficiency. Discover why computers require absolute precision!'
                : 'Pentru a funcționa corect pe orice calculator, un algoritm trebuie să respecte proprietăți fundamentale: Claritate, Generalitate, Finitudine, Succesiune determinată a pașilor, Unicitate și Eficiență.'}
            </p>
          </div>
        </div>
      </div>

      {/* 6 Properties Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { icon: '🔍', titleRo: '1. Claritate', titleEn: '1. Clarity', descRo: 'Comenzile sunt precise, fără termeni vagi sau ambigui.', descEn: 'Precise unambiguous instructions.' },
          { icon: '🌐', titleRo: '2. Generalitate', titleEn: '2. Generality', descRo: 'Rezolvă o întreagă clasă de probleme cu date variabile.', descEn: 'Solves an entire problem family.' },
          { icon: '⏳', titleRo: '3. Finitudine', titleEn: '3. Finiteness', descRo: 'Se termină garantat după un număr finit de pași.', descEn: 'Terminates in finite steps.' },
          { icon: '🔢', titleRo: '4. Succesiune', titleEn: '4. Sequence', descRo: 'Pașii se execută într-o ordine cronologică strictă.', descEn: 'Strict deterministic order.' },
          { icon: '🎯', titleRo: '5. Unicitate', titleEn: '5. Uniqueness', descRo: 'Aceleași date de intrare dau întotdeauna același rezultat.', descEn: 'Same inputs yield identical outputs.' },
          { icon: '⚡', titleRo: '6. Eficiență', titleEn: '6. Efficiency', descRo: 'Rezolvă problema cu un număr minim de operații și memorie.', descEn: 'Optimal runtime and memory.' }
        ].map((prop, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 hover:border-amber-500/40 transition">
            <div className="text-2xl">{prop.icon}</div>
            <h3 className="text-xs sm:text-sm font-bold text-white">
              {lang === 'en' ? prop.titleEn : prop.titleRo}
            </h3>
            <p className="text-[11px] text-slate-400 leading-snug">
              {lang === 'en' ? prop.descEn : prop.descRo}
            </p>
          </div>
        ))}
      </div>

      {/* Step 1: Scenario Matcher Simulator */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Target className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-heading">
                {lang === 'en' ? 'Property Detective: Match Each Scenario' : 'Detectivul de Proprietăți: Asociază Scenariile din Manual'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'en' ? 'Textbook page 56, Practice Box' : 'Manual pagina 56, Caseta Aplică'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetMatcher}
            className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Reset' : 'Resetează'}</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">
          {lang === 'en'
            ? 'Read each scenario below and select the algorithmic property it illustrates:'
            : 'Citește fiecare descriere de mai jos și selectează proprietatea algoritmică pe care o reflectă:'}
        </p>

        <div className="space-y-4">
          {SCENARIOS.map((sc) => {
            const currentMatch = matches[sc.id];
            const isCorrect = currentMatch === sc.correctProperty;
            const hasCooldown = (cooldowns[sc.id] || 0) > 0;

            return (
              <div
                key={sc.id}
                className={`p-4 sm:p-5 rounded-2xl border transition space-y-3 ${
                  currentMatch
                    ? isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/60'
                      : 'bg-rose-950/40 border-rose-500/60'
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                  {lang === 'en' ? sc.scenarioEn : sc.scenarioRo}
                </div>

                {hasCooldown && (
                  <PedagogicalReflectionBanner
                    cooldown={cooldowns[sc.id]}
                    customMessageRo="Proprietate incorectă! Te rugăm să acorzi 5 secunde pentru a citi din nou descrierea scenariului."
                    customMessageEn="Incorrect property! Please take 5 seconds to re-read the scenario description."
                  />
                )}

                <div className="flex flex-wrap gap-2 pt-1">
                  {propertyOptions.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      disabled={hasCooldown}
                      onClick={() => handleSelectProperty(sc.id, opt.key)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        hasCooldown ? 'opacity-60 cursor-not-allowed' : ''
                      } ${
                        currentMatch === opt.key
                          ? opt.key === sc.correctProperty
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-md'
                            : 'bg-rose-500 text-white border-rose-400 font-extrabold shadow-md'
                          : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                      }`}
                    >
                      {lang === 'en' ? opt.labelEn : opt.labelRo}
                    </button>
                  ))}
                </div>

                {currentMatch && (
                  <div className={`text-xs font-medium pt-1 ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {isCorrect ? (
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        {lang === 'en' ? sc.explanationEn : sc.explanationRo}
                      </span>
                    ) : (
                      <span>{lang === 'en' ? 'Incorrect. Analyze the description carefully.' : 'Incorect. Analizează cu atenție caracteristica descrisă în scenariu.'}</span>
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
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <span>{lang === 'en' ? 'Check Your Knowledge: Finiteness & Generality' : 'Verifică-ți Cunoștințele: Finitudine & Generalitate'}</span>
        </div>

        {/* Q1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-amber-400 uppercase font-mono">
            {lang === 'en' ? 'Question 1 of 2' : 'Întrebarea 1 din 2'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'If an algorithm calculates the sum of ANY two real numbers a and b, which algorithmic property is displayed?'
              : 'Dacă un algoritm calculează suma a ORICĂROR două numere citite a și b, ce proprietate ilustrează acesta?'}
          </div>

          {(cooldowns.q1 || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q1}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a reflecta la proprietatea de a funcționa pentru orice date de intrare."
                customMessageEn="Incorrect answer! Please take 5 seconds to reflect on the property of working for any input data."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { id: 'generalitate', text: lang === 'en' ? 'A) Generality (Generalitate)' : 'A) Generalitate (rezolvă orice caz din acea categorie)' },
              { id: 'randomness', text: lang === 'en' ? 'B) Randomness' : 'B) Întâmplare' },
              { id: 'manual_only', text: lang === 'en' ? 'C) Particularity (only numbers 2 and 3)' : 'C) Particularitate (funcționează doar pentru 2 și 3)' },
              { id: 'infinite_time', text: lang === 'en' ? 'D) Infinite runtime' : 'D) Rulare infinită' }
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
                    ? opt.id === 'generalitate'
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
            hintId="algo_q1_gen"
            hintRo="Proprietatea care permite rezolvarea unei clase întregi de probleme se numește Generalitate."
            hintEn="The property that allows solving a whole family of problems is called Generality."
          />

          {q1Answer && (
            <AnswerExplanation
              isCorrect={isQ1Correct}
              cooldown={cooldowns.q1}
              explanation={
                isQ1Correct
                  ? (lang === 'en' ? 'Correct! Generality ensures the algorithm operates on variable input parameters.' : 'Corect! Generalitatea înseamnă că algoritmul rezolvă orice sumă a + b, indiferent de valorile introduse.')
                  : (lang === 'en' ? 'Incorrect. The correct property is Generality.' : 'Incorect. Proprietatea căutată este Generalitatea.')
              }
              ruleReference="Manual TIC pag. 56"
            />
          )}
        </div>

        {/* Q2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-amber-400 uppercase font-mono">
            {lang === 'en' ? 'Question 2 of 2' : 'Întrebarea 2 din 2'}
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {lang === 'en'
              ? 'Why would an instruction like "Write all natural even numbers" violate the properties of an algorithm?'
              : 'De ce cerința „Scrieți toate numerele naturale pare” încalcă proprietățile unui algoritm?'}
          </div>

          {(cooldowns.q2 || 0) > 0 && (
            <div className="mb-2">
              <PedagogicalReflectionBanner
                cooldown={cooldowns.q2}
                customMessageRo="Răspuns incorect! Te rugăm să acorzi 5 secunde pentru a analiza de ce numerele pare sunt infinite și nu se pot scrie toate."
                customMessageEn="Incorrect answer! Please take 5 seconds to reflect on why even numbers are infinite."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { id: 'finitudine', text: lang === 'en' ? 'A) Violates Finiteness (even numbers are infinite)' : 'A) Încalcă finitudinea (mulțimea numerelor pare este infinită)' },
              { id: 'too_easy', text: lang === 'en' ? 'B) It is too easy to write' : 'B) Este prea ușor de scris' },
              { id: 'no_even_numbers', text: lang === 'en' ? 'C) Even numbers do not exist' : 'C) Nu există numere pare' },
              { id: 'only_drawings', text: lang === 'en' ? 'D) Algorithms only accept drawing commands' : 'D) Algoritmii acceptă doar desene' }
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
                    ? opt.id === 'finitudine'
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
            hintId="algo_q2_finite"
            hintRo="Un algoritm nu poate rula la nesfârșit. El trebuie să se oprească după un număr finit de pași."
            hintEn="An algorithm cannot run forever. It must stop after a finite count of steps."
          />

          {q2Answer && (
            <AnswerExplanation
              isCorrect={isQ2Correct}
              cooldown={cooldowns.q2}
              explanation={
                isQ2Correct
                  ? (lang === 'en' ? 'Spot on! Since even numbers are infinite, the task never finishes, violating Finiteness.' : 'Exact! Șirul numerelor pare este infinit (2, 4, 6, 8...), deci algoritmul nu s-ar termina niciodată, încălcând Finitudinea.')
                  : (lang === 'en' ? 'Incorrect. An endless task violates the Finiteness property.' : 'Incorect. O execuție nesfârșită încalcă proprietatea de finitudine.')
              }
              ruleReference="Manual TIC pag. 57"
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
