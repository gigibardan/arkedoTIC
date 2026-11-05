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
import { useLanguage } from '../../../context/LanguageContext';

interface A3Level7Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface ExamOption {
  id: string;
  textRo: string;
  textEn: string;
}

interface ExamQuestion {
  id: string;
  questionNumber: number;
  titleRo: string;
  titleEn: string;
  questionTextRo: string;
  questionTextEn: string;
  hintRo: string;
  hintEn: string;
  options: ExamOption[];
  correctOptionId: string;
  explanationRo: string;
  explanationEn: string;
  manualRefRo: string;
  manualRefEn: string;
}

const EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 'q1',
    questionNumber: 1,
    titleRo: 'Bucle cu Test Inițial vs Test Final',
    titleEn: 'Pre-Test vs Post-Test Repetitive Loops',
    questionTextRo:
      'Care este diferența majoră dintre bucla `while (cond)` și bucla `do { ... } while (cond);` în cazul în care condiția este evaluată ca FALSĂ încă de la prima iterație (pag. 71–73)?',
    questionTextEn:
      'What is the fundamental distinction between `while (cond)` and `do { ... } while (cond);` when the condition evaluates to FALSE prior to the very first iteration (pp. 71–73)?',
    hintRo: 'Gândește-te la momentul în care se verifică condiția: înainte de execuție sau după prima execuție a corpului.',
    hintEn: 'Consider when the predicate is tested: before body execution or after the initial pass through the body.',
    options: [
      {
        id: 'a',
        textRo: 'A. Ambele structuri se execută exact o singură dată',
        textEn: 'A. Both constructs execute exactly once'
      },
      {
        id: 'b',
        textRo: 'B. Bucla while nu execută corpul nici măcar o dată (0 ori), în timp ce do-while execută corpul garantat cel puțin o dată (1 dată)',
        textEn: 'B. The while loop executes zero times (0), whereas do-while executes the body at least once unconditionally (1 time)'
      },
      {
        id: 'c',
        textRo: 'C. Bucla while provoacă blocarea calculatorului',
        textEn: 'C. The while loop triggers a system freeze'
      },
      {
        id: 'd',
        textRo: 'D. Nu există nicio diferență între cele două structuri',
        textEn: 'D. There is no behavioral difference between the two'
      }
    ],
    correctOptionId: 'b',
    explanationRo:
      'Corect! La bucla while, condiția se verifică înaintea executării instrucțiunilor (test inițial), deci dacă este falsă inițial, corpul nu se execută niciodată. La do-while, instrucțiunile se execută cel puțin o dată, condiția fiind verificată abia la final (test final).',
    explanationEn:
      'Correct! The while loop checks its predicate before body execution; thus an initially false condition results in zero iterations. In contrast, do-while tests the condition at the end, ensuring at least one execution.',
    manualRefRo: 'Manual pag. 71–73',
    manualRefEn: 'Textbook pp. 71–73'
  },
  {
    id: 'q2',
    questionNumber: 2,
    titleRo: 'Mecanismul de Execuție al Buclei for',
    titleEn: 'Execution Sequence of the for Loop Header',
    questionTextRo:
      'În instrucțiunea `for (int i = 1; i <= n; i++)`, care este ordinea corectă a operațiilor executate de procesor la fiecare pas (pag. 73–74)?',
    questionTextEn:
      'In `for (int i = 1; i <= n; i++)`, what is the exact operational sequence executed by the CPU at each iteration cycle (pp. 73–74)?',
    hintRo: 'Inițializarea contorului (int i = 1) se execută o singură dată la început.',
    hintEn: 'Counter initialization (int i = 1) runs solely once upon entering the loop.',
    options: [
      {
        id: 'a',
        textRo: 'A. Incrementare (i++) &rarr; Verificare condiție (i <= n) &rarr; Corp buclă',
        textEn: 'A. Increment (i++) &rarr; Test condition (i <= n) &rarr; Loop body'
      },
      {
        id: 'b',
        textRo: 'B. Corp buclă &rarr; Incrementare &rarr; Inițializare',
        textEn: 'B. Loop body &rarr; Increment &rarr; Initialization'
      },
      {
        id: 'c',
        textRo: 'C. 1. Inițializare (o singură dată); 2. Testare condiție; 3. Executare corp; 4. Incrementare contor (i++); 5. Salt la pasul 2',
        textEn: 'C. 1. Initialization (once); 2. Evaluate condition; 3. Execute body; 4. Increment counter (i++); 5. Loop back to step 2'
      },
      {
        id: 'd',
        textRo: 'D. Toate se execută simultan în mod aleatoriu',
        textEn: 'D. All clauses execute concurrently in random order'
      }
    ],
    correctOptionId: 'c',
    explanationRo:
      'Corect! Antetul buclei for execută inițializarea o singură dată la start, apoi repetă secvența: Verificare condiție -> Executare corp -> Incrementare pas -> Reverificare condiție.',
    explanationEn:
      'Correct! The for loop executes initialization once, followed by the repeating cycle: Condition test -> Body execution -> Step update -> Next condition evaluation.',
    manualRefRo: 'Manual pag. 73–74',
    manualRefEn: 'Textbook pp. 73–74'
  },
  {
    id: 'q3',
    questionNumber: 3,
    titleRo: 'Algoritmul General de Prelucrare a Cifrelor',
    titleEn: 'Canonical Digit Extraction Schema',
    questionTextRo:
      'Care este schema algoritmică canonică în C++ pentru a extrage pe rând toate cifrele unui număr natural oarecare `n` până când numărul se epuizează (pag. 74–75)?',
    questionTextEn:
      'What is the canonical C++ algorithmic pattern to iteratively process each digit of an arbitrary integer `n` until digits are exhausted (pp. 74–75)?',
    hintRo: 'Folosim restul împărțirii la 10 pentru ultima cifră și câtul împărțirii la 10 pentru a tăia cifra.',
    hintEn: 'Use remainder modulo 10 to extract the trailing digit, and integer division by 10 to truncate it.',
    options: [
      {
        id: 'a',
        textRo: 'A. while (n != 0) { c = n % 10; /* prelucrare */ n = n / 10; }',
        textEn: 'A. while (n != 0) { c = n % 10; /* process */ n = n / 10; }'
      },
      {
        id: 'b',
        textRo: 'B. for (int i = 1; i <= n; i++) { c = n + 10; }',
        textEn: 'B. for (int i = 1; i <= n; i++) { c = n + 10; }'
      },
      {
        id: 'c',
        textRo: 'C. if (n > 0) { c = n / 10; }',
        textEn: 'C. if (n > 0) { c = n / 10; }'
      },
      {
        id: 'd',
        textRo: 'D. do { n = n * 10; } while (n > 0);',
        textEn: 'D. do { n = n * 10; } while (n > 0);'
      }
    ],
    correctOptionId: 'a',
    explanationRo:
      'Corect! Aceasta este schema clasică de descompunere: n % 10 izolează ultima cifră a numărului, iar n = n / 10 o elimină prin împărțire întreagă, procesul repetându-se până când n devine 0.',
    explanationEn:
      'Correct! The canonical digit dissection pattern: n % 10 yields the trailing digit, and n = n / 10 truncates it through integer division until n reaches 0.',
    manualRefRo: 'Manual pag. 74–75',
    manualRefEn: 'Textbook pp. 74–75'
  },
  {
    id: 'q4',
    questionNumber: 4,
    titleRo: 'Algoritmul lui Euclid & Relația cu CMMMC',
    titleEn: 'Euclidean Algorithm & Relationship to LCM',
    questionTextRo:
      'Cum se calculează Cel Mai Mic Multiplu Comun (CMMMC) a două numere naturale `a` și `b` după ce am determinat Cel Mai Mare Divizor Comun (CMMDC) prin algoritmul lui Euclid (pag. 75–76)?',
    questionTextEn:
      'How do you compute the Least Common Multiple (LCM) of two natural numbers `a` and `b` after obtaining the Greatest Common Divisor (GCD) via Euclid (pp. 75–76)?',
    hintRo: 'Produsul a două numere naturale este egal cu produsul dintre CMMDC și CMMMC.',
    hintEn: 'The product of two positive integers equals the product of their GCD and LCM.',
    options: [
      {
        id: 'a',
        textRo: 'A. cmmmc = a + b - cmmdc',
        textEn: 'A. lcm = a + b - gcd'
      },
      {
        id: 'b',
        textRo: 'B. cmmmc = (a * b) / cmmdc (produsul numerelor împărțit la cel mai mare divizor comun)',
        textEn: 'B. lcm = (a * b) / gcd (the product of the numbers divided by their greatest common divisor)'
      },
      {
        id: 'c',
        textRo: 'C. cmmmc = cmmdc * 2',
        textEn: 'C. lcm = gcd * 2'
      },
      {
        id: 'd',
        textRo: 'D. cmmmc = a * a + b * b',
        textEn: 'D. lcm = a * a + b * b'
      }
    ],
    correctOptionId: 'b',
    explanationRo:
      'Corect! Conform teoremei fundamentale din aritmetică: a * b = CMMDC(a, b) * CMMMC(a, b). Prin urmare, CMMMC = (a * b) / CMMDC.',
    explanationEn:
      'Correct! From the arithmetic theorem a * b = GCD(a, b) * LCM(a, b), the Least Common Multiple evaluates to LCM = (a * b) / GCD.',
    manualRefRo: 'Manual pag. 75–76',
    manualRefEn: 'Textbook pp. 75–76'
  },
  {
    id: 'q5',
    questionNumber: 5,
    titleRo: 'Testul de Primalitate Optimizat',
    titleEn: 'Optimized Primality Testing Boundary',
    questionTextRo:
      'De ce algoritmul optimizat de verificare dacă un număr natural `n` este prim testează existența unui divizor propriu doar până la `d * d <= n` (adică până la radicalul lui `n`) (pag. 75)?',
    questionTextEn:
      'Why does the optimized primality test for integer `n` restrict divisor searching strictly up to `d * d <= n` (the square root of `n`) (p. 75)?',
    hintRo: 'Dacă un număr ar avea un divizor mai mare decât radicalul, perechea sa ar trebui să fie mai mică decât radicalul.',
    hintEn: 'If a composite number has a factor larger than its square root, its conjugate factor must be strictly smaller than the square root.',
    options: [
      {
        id: 'a',
        textRo: 'A. Pentru că divizorii oricărui număr compus vin în perechi (d și n/d); dacă numărul nu are niciun divizor <= sqrt(n), este imposibil să aibă vreun divizor > sqrt(n)',
        textEn: 'A. Because divisors of any composite integer occur in conjugate pairs (d and n/d); if no divisor exists <= sqrt(n), none can exist > sqrt(n)'
      },
      {
        id: 'b',
        textRo: 'B. Numerele mai mari decât radicalul sunt interzise în C++',
        textEn: 'B. Integers above the square root are forbidden by C++ standards'
      },
      {
        id: 'c',
        textRo: 'C. Este o convenție fără fundament matematic',
        textEn: 'C. It is an arbitrary convention lacking mathematical proof'
      },
      {
        id: 'd',
        textRo: 'D. Pentru că toate numerele impare sunt automat prime',
        textEn: 'D. Because all odd numbers are automatically prime'
      }
    ],
    correctOptionId: 'a',
    explanationRo:
      'Corect! Dacă un număr compus n = a * b, cel puțin unul dintre factori (a sau b) trebuie să fie mai mic sau egal cu radicalul lui n. Dacă nu găsim niciun divizor în intervalul [2, sqrt(n)], numărul este garantat prim.',
    explanationEn:
      'Correct! If n = a * b is composite, at least one factor must satisfy factor <= sqrt(n). If no divisor exists in [2, sqrt(n)], n is definitively proven prime.',
    manualRefRo: 'Manual pag. 75',
    manualRefEn: 'Textbook p. 75'
  }
];

export const A3Level7_LoopsAndNumberTheoryExam: React.FC<A3Level7Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();
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
                  {lang === 'ro' ? 'Modulul 3C • Nivelul 7 din 7' : 'Module 3C • Level 7 of 7'}
                </span>
                <span className="text-xs text-teal-300">
                  {lang === 'ro' ? 'Manual Art Klett pag. 76' : 'Art Klett Textbook p. 76'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                {lang === 'ro'
                  ? 'Evaluare Sumativă: Structuri Repetitive & Teoria Numerelor C++'
                  : 'Summative Assessment: Repetitive Structures & Number Theory in C++'}
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-teal-300 uppercase tracking-wider block">
              {lang === 'ro' ? 'Standard Național' : 'Curriculum Standard'}
            </span>
            <span className="text-lg font-bold text-cyan-300">
              {lang === 'ro' ? '5 Întrebări Oficiale' : '5 Official Questions'}
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm text-teal-100/90 leading-relaxed max-w-3xl">
          {lang === 'ro'
            ? 'Demonstrează stăpânirea structurilor repetitive while, do-while, for, descompunerii cifrelor unui număr oarecare, testului de primalitate optimizat și algoritmului lui Euclid pentru a obține Diploma Oficială C++: Loops & Number Theory Specialist!'
            : 'Demonstrate mastery of while, do-while, for loops, arbitrary digit dissection, optimized primality testing, and Euclidean GCD/LCM to earn the C++: Loops & Number Theory Specialist Certificate!'}
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
                    <h3 className="text-sm font-bold text-slate-100">
                      {lang === 'ro' ? q.titleRo : q.titleEn}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {lang === 'ro' ? q.manualRefRo : q.manualRefEn}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <QuestionHint
                    hint={lang === 'ro' ? q.hintRo : q.hintEn}
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
                          <span>{lang === 'ro' ? 'Corect (+20p)' : 'Correct (+20p)'}</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{lang === 'ro' ? 'Incorect (0p)' : 'Incorrect (0p)'}</span>
                        </>
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* Question Body */}
              <div className="p-5 space-y-4">
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {lang === 'ro' ? q.questionTextRo : q.questionTextEn}
                </p>

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
                        <span className="flex-1 leading-snug">
                          {lang === 'ro' ? opt.textRo : opt.textEn}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {submitted && (
                  <AnswerExplanation
                    explanation={lang === 'ro' ? q.explanationRo : q.explanationEn}
                    isCorrect={isCorrect}
                    correctAnswerText={
                      lang === 'ro'
                        ? q.options.find((o) => o.id === q.correctOptionId)?.textRo
                        : q.options.find((o) => o.id === q.correctOptionId)?.textEn
                    }
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
              <h3 className="text-sm font-semibold text-slate-200">
                {lang === 'ro' ? 'Finalizare Evaluare Sumativă' : 'Complete Summative Assessment'}
              </h3>
              <p className="text-xs text-slate-400">
                {allAnswered
                  ? (lang === 'ro'
                    ? 'Ai răspuns la toate cele 5 întrebări! Apasă butonul pentru corectare oficială.'
                    : 'You answered all 5 questions! Click the button for official grading.')
                  : (lang === 'ro'
                    ? `Ai răspuns la ${Object.keys(selectedAnswers).length} din 5 întrebări.`
                    : `You answered ${Object.keys(selectedAnswers).length} of 5 questions.`)}
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
              <span>{lang === 'ro' ? 'Trimite Evaluarea spre Notare' : 'Submit Exam for Grading'}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 block">
                  {lang === 'ro' ? 'Rezultat Evaluare Sumativă' : 'Summative Exam Outcome'}
                </span>
                <div className="text-2xl font-black text-white flex items-center space-x-2 mt-0.5">
                  <span className={score >= 70 ? 'text-emerald-400' : 'text-rose-400'}>
                    {lang === 'ro' ? `Nota ${romanianGrade} / 10` : `Grade: ${romanianGrade} / 10`}
                  </span>
                  <span className="text-sm font-normal text-slate-400">
                    {lang === 'ro' ? `(${score} puncte din 100)` : `(${score} points out of 100)`}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">
                  {lang === 'ro' ? 'Condiție Promovare:' : 'Passing Threshold:'}
                </span>
                <span className="text-xs font-bold text-cyan-300">
                  {lang === 'ro' ? 'Minim Nota 7.00 (70%)' : 'Minimum Grade 7.00 (70%)'}
                </span>
              </div>
            </div>

            {score >= 70 ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start space-x-3 text-emerald-200">
                <Sparkles className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <strong>
                    {lang === 'ro'
                      ? 'Felicitări! Ai promovat cu succes Evaluarea Sumativă a Modulului 3C!'
                      : 'Congratulations! You successfully passed Module 3C Summative Assessment!'}
                  </strong>
                  <br />
                  {lang === 'ro'
                    ? 'Ai demonstrat o înțelegere impecabilă a buclelor while, do-while, for, descompunerii cifrelor, numerelor prime și algoritmului lui Euclid. Apasă butonul de mai jos pentru a revendica Diploma Oficială C++ de Loops & Number Theory Specialist!'
                    : 'You demonstrated comprehensive mastery of while, do-while, for loops, arbitrary digit dissection, optimized primality testing, and Euclidean GCD/LCM. Click below to claim your C++ Loops & Number Theory Specialist Certificate!'}
                </div>
              </div>
            ) : (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-start space-x-3 text-rose-200">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <strong>
                    {lang === 'ro'
                      ? 'Punctaj insuficient pentru promovare.'
                      : 'Score insufficient for certificate passing.'}
                  </strong>{' '}
                  {lang === 'ro'
                    ? 'Este necesară nota minimă 7.00. Recitește explicațiile pedagogice, revizuiește conceptele și încearcă din nou!'
                    : 'A minimum grade of 7.00 is required. Review detailed pedagogical explanations, revisit textbook concepts, and reattempt the test!'}
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
                <span>
                  {lang === 'ro'
                    ? 'Revendică Diploma & Finalizează Modulul 3C'
                    : 'Claim Certificate & Finalize Module 3C'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
