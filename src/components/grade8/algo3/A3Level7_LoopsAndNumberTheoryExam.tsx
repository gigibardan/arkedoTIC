import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Code2,
  FileCheck,
  Terminal,
  Cpu,
  Hash,
  Repeat
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface A3Level7Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface ExamQuestion {
  id: string;
  questionNumber: number;
  title: string;
  questionText: string;
  hint: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  manualRef: string;
}

const EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 'q1',
    questionNumber: 1,
    title: 'Bucle cu Test Inițial vs Test Final',
    questionText:
      'Care este diferența majoră dintre bucla `while (cond)` și bucla `do { ... } while (cond);` în cazul în care condiția este evaluată ca FALSĂ încă de la prima iterație (pag. 71–73)?',
    hint: 'Gândește-te la momentul în care se verifică condiția: înainte de execuție sau după prima execuție a corpului.',
    options: [
      { id: 'a', text: 'A. Ambele structuri se execută exact o singură dată' },
      { id: 'b', text: 'B. Bucla while nu execută corpul nici măcar o dată (0 ori), în timp ce do-while execută corpul garantat cel puțin o dată (1 dată)' },
      { id: 'c', text: 'C. Bucla while provoacă blocarea calculatorului' },
      { id: 'd', text: 'D. Nu există nicio diferență între cele două structuri' }
    ],
    correctOptionId: 'b',
    explanation:
      'Corect! La bucla while, condiția se verifică înaintea executării instrucțiunilor (test inițial), deci dacă este falsă inițial, corpul nu se execută niciodată. La do-while, instrucțiunile se execută cel puțin o dată, condiția fiind verificată abia la final (test final).',
    manualRef: 'Manual pag. 71–73'
  },
  {
    id: 'q2',
    questionNumber: 2,
    title: 'Mecanismul de Execuție al Buclei for',
    questionText:
      'În instrucțiunea `for (int i = 1; i <= n; i++)`, care este ordinea corectă a operațiilor executate de procesor la fiecare pas (pag. 73–74)?',
    hint: 'Inițializarea contorului (int i = 1) se execută o singură dată la început.',
    options: [
      { id: 'a', text: 'A. Incrementare (i++) &rarr; Verificare condiție (i <= n) &rarr; Corp buclă' },
      { id: 'b', text: 'B. Corp buclă &rarr; Incrementare &rarr; Inițializare' },
      { id: 'c', text: 'C. 1. Inițializare (o singură dată); 2. Testare condiție; 3. Executare corp; 4. Incrementare contor (i++); 5. Salt la pasul 2' },
      { id: 'd', text: 'D. Toate se execută simultan în mod aleatoriu' }
    ],
    correctOptionId: 'c',
    explanation:
      'Corect! Antetul buclei for execută inițializarea o singură dată la start, apoi repetă secvența: Verificare condiție -> Executare corp -> Incrementare pas -> Reverificare condiție.',
    manualRef: 'Manual pag. 73–74'
  },
  {
    id: 'q3',
    questionNumber: 3,
    title: 'Algoritmul General de Prelucrare a Cifrelor',
    questionText:
      'Care este schema algoritmică canonică în C++ pentru a extrage pe rând toate cifrele unui număr natural oarecare `n` până când numărul se epuizează (pag. 74–75)?',
    hint: 'Folosim restul împărțirii la 10 pentru ultima cifră și câtul împărțirii la 10 pentru a tăia cifra.',
    options: [
      { id: 'a', text: 'A. while (n != 0) { c = n % 10; /* prelucrare */ n = n / 10; }' },
      { id: 'b', text: 'B. for (int i = 1; i <= n; i++) { c = n + 10; }' },
      { id: 'c', text: 'C. if (n > 0) { c = n / 10; }' },
      { id: 'd', text: 'D. do { n = n * 10; } while (n > 0);' }
    ],
    correctOptionId: 'a',
    explanation:
      'Corect! Aceasta este schema clasică de descompunere: n % 10 izolează ultima cifră a numărului, iar n = n / 10 o elimină prin împărțire întreagă, procesul repetându-se până când n devine 0.',
    manualRef: 'Manual pag. 74–75'
  },
  {
    id: 'q4',
    questionNumber: 4,
    title: 'Algoritmul lui Euclid & Relația cu CMMMC',
    questionText:
      'Cum se calculează Cel Mai Mic Multiplu Comun (CMMMC) a două numere naturale `a` și `b` după ce am determinat Cel Mai Mare Divizor Comun (CMMDC) prin algoritmul lui Euclid (pag. 75–76)?',
    hint: 'Produsul a două numere naturale este egal cu produsul dintre CMMDC și CMMMC.',
    options: [
      { id: 'a', text: 'A. cmmmc = a + b - cmmdc' },
      { id: 'b', text: 'B. cmmmc = (a * b) / cmmdc (produsul numerelor împărțit la cel mai mare divizor comun)' },
      { id: 'c', text: 'C. cmmmc = cmmdc * 2' },
      { id: 'd', text: 'D. cmmmc = a * a + b * b' }
    ],
    correctOptionId: 'b',
    explanation:
      'Corect! Conform teoremei fundamentale din aritmetică: a * b = CMMDC(a, b) * CMMMC(a, b). Prin urmare, CMMMC = (a * b) / CMMDC.',
    manualRef: 'Manual pag. 75–76'
  },
  {
    id: 'q5',
    questionNumber: 5,
    title: 'Testul de Primalitate Optimizat',
    questionText:
      'De ce algoritmul optimizat de verificare dacă un număr natural `n` este prim testează existența unui divizor propriu doar până la `d * d <= n` (adică până la radicalul lui `n`) (pag. 75)?',
    hint: 'Dacă un număr ar avea un divizor mai mare decât radicalul, perechea sa ar trebui să fie mai mică decât radicalul.',
    options: [
      { id: 'a', text: 'A. Pentru că divizorii oricărui număr compus vin în perechi (d și n/d); dacă numărul nu are niciun divizor <= sqrt(n), este imposibil să aibă vreun divizor > sqrt(n)' },
      { id: 'b', text: 'B. Numerele mai mari decât radicalul sunt interzise în C++' },
      { id: 'c', text: 'C. Este o convenție fără fundament matematic' },
      { id: 'd', text: 'D. Pentru că toate numerele impare sunt automat prime' }
    ],
    correctOptionId: 'a',
    explanation:
      'Corect! Dacă un număr compus n = a * b, cel puțin unul dintre factori (a sau b) trebuie să fie mai mic sau egal cu radicalul lui n. Dacă nu găsim niciun divizor în intervalul [2, sqrt(n)], numărul este garantat prim.',
    manualRef: 'Manual pag. 75'
  }
];

export const A3Level7_LoopsAndNumberTheoryExam: React.FC<A3Level7Props> = ({
  onCompletePage,
  onComplete
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [activeHintId, setActiveHintId] = useState<string | null>(null);

  // 5 seconds cooldown on wrong answers
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (isLocked(questionId) || submitted) return;

    sounds.playClick();
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId
    }));

    const q = EXAM_QUESTIONS.find((item) => item.id === questionId);
    if (q) {
      if (optionId === q.correctOptionId) {
        sounds.playCorrect();
      } else {
        sounds.playWrong();
        triggerCooldown(questionId);
      }
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    EXAM_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        correctCount++;
      }
    });
    return Math.round((correctCount / EXAM_QUESTIONS.length) * 100);
  };

  const allAnswered = EXAM_QUESTIONS.every((q) => selectedAnswers[q.id] !== undefined);

  const handleSubmitExam = () => {
    if (!allAnswered) return;
    setSubmitted(true);
    const score = calculateScore();
    if (score >= 70) {
      sounds.playLevelComplete();
    } else {
      sounds.playWrong();
    }
  };

  const handleFinishLevel = () => {
    const score = calculateScore();
    if (score >= 70) {
      if (onCompletePage) onCompletePage(score);
      if (onComplete) onComplete();
    }
  };

  const score = calculateScore();
  const romanianGrade = (1 + (score / 100) * 9).toFixed(1);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-950 via-cyan-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-teal-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-teal-500/20 rounded-xl border border-teal-400/30 text-teal-300">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/30 text-teal-200 border border-teal-400/30">
                  Modulul 3C • Nivelul 7 din 7
                </span>
                <span className="text-xs text-teal-300">Manual Art Klett pag. 76</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                Evaluare Sumativă: Structuri Repetitive & Teoria Numerelor C++
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-teal-300 uppercase tracking-wider block">Standard Național</span>
            <span className="text-lg font-bold text-cyan-300">5 Întrebări Oficiale</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-teal-100/90 leading-relaxed max-w-3xl">
          Demonstrează stăpânirea structurilor repetitive <code className="bg-teal-950 px-1 rounded text-cyan-300 font-mono">while</code>, <code className="bg-teal-950 px-1 rounded text-cyan-300 font-mono">do-while</code>, <code className="bg-teal-950 px-1 rounded text-cyan-300 font-mono">for</code>, descompunerii cifrelor unui număr oarecare, testului de primalitate optimizat și algoritmului lui Euclid pentru a obține <strong>Diploma Oficială C++: Loops & Number Theory Specialist</strong>!
        </p>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {EXAM_QUESTIONS.map((q) => {
          const currentSelected = selectedAnswers[q.id];
          const remainingCooldown = cooldowns[q.id] || 0;
          const locked = isLocked(q.id);
          const isCorrect = currentSelected === q.correctOptionId;

          return (
            <div
              key={q.id}
              className={`bg-slate-900 rounded-2xl border transition-all overflow-hidden ${
                submitted
                  ? isCorrect
                    ? 'border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                    : 'border-rose-500/60 shadow-lg shadow-rose-500/10'
                  : currentSelected
                  ? 'border-teal-500/40'
                  : 'border-slate-800'
              }`}
            >
              {/* Question Header */}
              <div className="p-5 border-b border-slate-800/80 bg-slate-950/50 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 font-bold text-xs flex items-center justify-center border border-teal-500/30">
                    {q.questionNumber}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{q.title}</h3>
                    <span className="text-[11px] text-slate-400 font-medium">{q.manualRef}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <QuestionHint
                    hint={q.hint}
                    isOpen={activeHintId === q.id}
                    onToggle={() => setActiveHintId(activeHintId === q.id ? null : q.id)}
                  />
                  {submitted && (
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${
                        isCorrect
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Corect (+20p)</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Incorect (0p)</span>
                        </>
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* Question Body */}
              <div className="p-5 space-y-4">
                <p className="text-sm text-slate-200 leading-relaxed font-medium">{q.questionText}</p>

                {/* Cooldown banner if wrong */}
                {locked && <PedagogicalReflectionBanner remainingSeconds={remainingCooldown} />}

                {/* Options list */}
                <div className="space-y-2.5">
                  {q.options.map((opt) => {
                    const isSelected = currentSelected === opt.id;
                    const showOptionCorrectness = submitted && opt.id === q.correctOptionId;
                    const showOptionWrongness = submitted && isSelected && !isCorrect;

                    let btnClasses =
                      'w-full text-left p-3.5 rounded-xl border text-xs md:text-sm transition-all flex items-start space-x-3 ';

                    if (submitted) {
                      if (showOptionCorrectness) {
                        btnClasses += 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-medium';
                      } else if (showOptionWrongness) {
                        btnClasses += 'bg-rose-950/60 border-rose-500 text-rose-200';
                      } else {
                        btnClasses += 'bg-slate-950/40 border-slate-800 text-slate-400 opacity-60';
                      }
                    } else if (isSelected) {
                      btnClasses += 'bg-teal-950/70 border-teal-400 text-teal-100 font-medium shadow-md';
                    } else if (locked) {
                      btnClasses += 'bg-slate-950/30 border-slate-800/60 text-slate-500 cursor-not-allowed';
                    } else {
                      btnClasses += 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900';
                    }

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        disabled={locked || submitted}
                        className={btnClasses}
                      >
                        <span
                          className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center text-xs font-bold font-mono mt-0.5 border ${
                            isSelected
                              ? 'bg-teal-600 border-teal-400 text-white'
                              : 'bg-slate-800 border-slate-700 text-slate-400'
                          }`}
                        >
                          {opt.id.toUpperCase()}
                        </span>
                        <span className="flex-1 leading-snug">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {submitted && (
                  <AnswerExplanation
                    explanation={q.explanation}
                    isCorrect={isCorrect}
                    correctAnswerText={q.options.find((o) => o.id === q.correctOptionId)?.text}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit / Score Summary */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        {!submitted ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Finalizare Evaluare Sumativă</h3>
              <p className="text-xs text-slate-400">
                {allAnswered
                  ? 'Ai răspuns la toate cele 5 întrebări! Apasă butonul pentru corectare oficială.'
                  : `Ai răspuns la ${Object.keys(selectedAnswers).length} din 5 întrebări.`}
              </p>
            </div>
            <button
              onClick={handleSubmitExam}
              disabled={!allAnswered}
              className={`py-3 px-6 rounded-xl font-bold text-xs md:text-sm flex items-center space-x-2 transition-all ${
                allAnswered
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-lg cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Trimite Evaluarea spre Notare</span>
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 block">Rezultat Evaluare Sumativă</span>
                <div className="text-2xl font-black text-white flex items-center space-x-2 mt-0.5">
                  <span className={score >= 70 ? 'text-emerald-400' : 'text-rose-400'}>
                    Nota {romanianGrade} / 10
                  </span>
                  <span className="text-sm font-normal text-slate-400">({score} puncte din 100)</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Condiție Promovare:</span>
                <span className="text-xs font-bold text-cyan-300">Minim Nota 7.00 (70%)</span>
              </div>
            </div>

            {score >= 70 ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start space-x-3 text-emerald-200">
                <Sparkles className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <strong>Felicitări! Ai promovat cu succes Evaluarea Sumativă a Modulului 3C!</strong>
                  <br />
                  Ai demonstrat o înțelegere impecabilă a buclelor while, do-while, for, descompunerii cifrelor, numerelor prime și algoritmului lui Euclid. Apasă butonul de mai jos pentru a revendica <strong>Diploma Oficială C++ de Loops & Number Theory Specialist</strong>!
                </div>
              </div>
            ) : (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-start space-x-3 text-rose-200">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <strong>Punctaj insuficient pentru promovare.</strong> Este necesară nota minimă 7.00.
                  Recitește explicațiile pedagogice, revizuiește conceptele și încearcă din nou!
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleFinishLevel}
                disabled={score < 70}
                className={`py-3 px-6 rounded-xl font-bold text-xs md:text-sm flex items-center space-x-2 transition-all ${
                  score >= 70
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg cursor-pointer'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <span>Revendică Diploma & Finalizează Modulul 3C</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
