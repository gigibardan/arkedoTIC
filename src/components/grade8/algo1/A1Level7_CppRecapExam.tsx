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
  Hash
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { useLanguage } from '../../../context/LanguageContext';

interface A1Level7Props {
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
    titleRo: 'Structura Programului & Biblioteca Standard',
    titleEn: 'Program Structure & Standard Library',
    questionTextRo: 'Care este rolul obligatoriu al directivei #include <iostream> plasate pe prima linie a oricărui fișier sursă C++ (pag. 59)?',
    questionTextEn: 'What is the mandatory role of the #include <iostream> preprocessor directive placed at the top of any C++ source file (p. 59)?',
    hintRo: 'Numele iostream provine de la „Input / Output Stream” (flux de intrare și ieșire).',
    hintEn: 'The acronym iostream stands for "Input / Output Stream".',
    options: [
      {
        id: 'a',
        textRo: 'A. Permite calculatorului să se conecteze la rețeaua de internet Wi-Fi',
        textEn: 'A. Enables the computer to connect to Wi-Fi networks'
      },
      {
        id: 'b',
        textRo: 'B. Include fișierul antet standard care conține definițiile fluxurilor fundamentale de comunicare cu tastatura (cin) și monitorul (cout)',
        textEn: 'B. Includes the standard header containing definitions for essential streams communicating with keyboard (cin) and console monitor (cout)'
      },
      {
        id: 'c',
        textRo: 'C. Șterge automat toate fișierele temporare de pe disc',
        textEn: 'C. Automatically purges all temporary cached files on disk'
      },
      {
        id: 'd',
        textRo: 'D. Este o comandă opțională de decor care nu afectează compilarea',
        textEn: 'D. An optional decorative pragma that does not affect compilation'
      }
    ],
    correctOptionId: 'b',
    explanationRo: 'Corect! Directiva #include <iostream> include biblioteca standard fără de care obiectele de intrare/ieșire cin și cout nu ar fi recunoscute de compilator.',
    explanationEn: 'Correct! #include <iostream> imports the standard stream definitions without which cin and cout I/O objects are unrecognized by the C++ compiler.',
    manualRefRo: 'Manual pag. 59',
    manualRefEn: 'Textbook p. 59'
  },
  {
    id: 'q2',
    questionNumber: 2,
    titleRo: 'Alegerea Tipului de Date & Limite de Memorie',
    titleEn: 'Data Type Selection & Memory Limits',
    questionTextRo: 'Dacă la o problemă de concurs trebuie să calculezi suma primelor n numere naturale pentru n = 200.000 (formula n*(n+1)/2 dă aproximativ 20 de miliarde), ce tip de date alegi pentru sumă (pag. 60)?',
    questionTextEn: 'In a competition task requiring the sum of the first n integers for n = 200,000 (formula n*(n+1)/2 yields ~20 billion), which data type must you choose for the sum (p. 60)?',
    hintRo: 'Valoarea maximă a unui int pe 32 de biți este ~2.14 miliarde. Douăzeci de miliarde depășește această limită.',
    hintEn: 'The upper limit of a signed 32-bit int is ~2.14 billion. Twenty billion exceeds this boundary.',
    options: [
      {
        id: 'a',
        textRo: 'A. int, deoarece se potrivește pentru orice număr întreg',
        textEn: 'A. int, because it fits any integer'
      },
      {
        id: 'b',
        textRo: 'B. long long, deoarece este reprezentat pe 8 octeți (64 biți) și suportă valori de până la ~9 · 10¹⁸, prevenind depășirea de limită',
        textEn: 'B. long long, represented across 8 bytes (64 bits) holding values up to ~9 · 10¹⁸, avoiding integer overflow'
      },
      {
        id: 'c',
        textRo: 'C. bool, deoarece consumă doar 1 octet',
        textEn: 'C. bool, because it occupies just 1 byte'
      },
      {
        id: 'd',
        textRo: 'D. char, deoarece literele nu au limită numerică',
        textEn: 'D. char, because letters have no numeric limits'
      }
    ],
    correctOptionId: 'b',
    explanationRo: 'Excelent! 20 de miliarde depășește limita tipului int (~2.14 miliarde). Variabila trebuie declarată obligatoriu long long pentru a evita obținerea unui rezultat eronat sau negativ.',
    explanationEn: 'Excellent! 20 billion exceeds signed 32-bit int capacity (~2.14 billion). Declaring the variable as long long is mandatory to avoid arithmetic overflow wrap-around.',
    manualRefRo: 'Manual pag. 60',
    manualRefEn: 'Textbook p. 60'
  },
  {
    id: 'q3',
    questionNumber: 3,
    titleRo: 'Operatori Aritmetici: Cât și Modulo',
    titleEn: 'Arithmetic Operators: Quotient & Modulo',
    questionTextRo: 'Care este valoarea expresiei C++: 25 / 4 + 25 % 4 (pag. 60–61)?',
    questionTextEn: 'What is the evaluated value of the C++ expression: 25 / 4 + 25 % 4 (pp. 60–61)?',
    hintRo: 'Împărțirea 25 / 4 între două numere întregi dă câtul întreg 6. Restul 25 % 4 este 1 (deoarece 25 = 4 * 6 + 1).',
    hintEn: 'Integer division 25 / 4 yields quotient 6. Modulo 25 % 4 yields remainder 1 (since 25 = 4 * 6 + 1).',
    options: [
      {
        id: 'a',
        textRo: 'A. 7 (deoarece 25 / 4 = 6, iar 25 % 4 = 1, deci 6 + 1 = 7)',
        textEn: 'A. 7 (because 25 / 4 = 6, and 25 % 4 = 1, giving 6 + 1 = 7)'
      },
      {
        id: 'b',
        textRo: 'B. 6.25',
        textEn: 'B. 6.25'
      },
      {
        id: 'c',
        textRo: 'C. 12',
        textEn: 'C. 12'
      },
      {
        id: 'd',
        textRo: 'D. 25',
        textEn: 'D. 25'
      }
    ],
    correctOptionId: 'a',
    explanationRo: 'Corect! C++ efectuează împărțirea întreagă: 25 / 4 = 6 (câtul), iar 25 % 4 = 1 (restul). Adunarea 6 + 1 dă exact rezultatul 7.',
    explanationEn: 'Correct! C++ executes integer arithmetic: 25 / 4 = 6 (quotient) and 25 % 4 = 1 (remainder). The sum 6 + 1 evaluates to 7.',
    manualRefRo: 'Manual pag. 60–61',
    manualRefEn: 'Textbook pp. 60–61'
  },
  {
    id: 'q4',
    questionNumber: 4,
    titleRo: 'Operatori Logici & Verificarea Proprietăților',
    titleEn: 'Logical Operators & Range Verification',
    questionTextRo: 'Cum se scrie corect în C++ condiția ca un număr întreg n să fie strict pozitiv ȘI să aibă exact 3 cifre (pag. 61–62)?',
    questionTextEn: 'How do you accurately write the C++ condition that an integer n is strictly positive AND has exactly 3 digits (pp. 61–62)?',
    hintRo: 'Un număr strict pozitiv de exact 3 cifre este cuprins între 100 și 999 inclusiv.',
    hintEn: 'A strictly positive 3-digit integer spans the closed range from 100 to 999 inclusive.',
    options: [
      {
        id: 'a',
        textRo: 'A. n > 0 || 100 <= n <= 999',
        textEn: 'A. n > 0 || 100 <= n <= 999'
      },
      {
        id: 'b',
        textRo: 'B. n >= 100 && n <= 999',
        textEn: 'B. n >= 100 && n <= 999'
      },
      {
        id: 'c',
        textRo: 'C. n == 100 && n == 999',
        textEn: 'C. n == 100 && n == 999'
      },
      {
        id: 'd',
        textRo: 'D. n in [100, 999]',
        textEn: 'D. n in [100, 999]'
      }
    ],
    correctOptionId: 'b',
    explanationRo: 'Excelent! Condiția n >= 100 && n <= 999 verifică atât faptul că numărul este pozitiv (>= 100), cât și faptul că are exact trei cifre (nu depășește 999).',
    explanationEn: 'Excellent! The compound condition n >= 100 && n <= 999 guarantees both that the value is positive and that it consists of exactly 3 decimal digits.',
    manualRefRo: 'Manual pag. 61–62',
    manualRefEn: 'Textbook pp. 61–62'
  },
  {
    id: 'q5',
    questionNumber: 5,
    titleRo: 'Instrucțiuni de Decizie & Greșeala Egalității',
    titleEn: 'Decision Statements & Assignment in Conditions',
    questionTextRo: 'Ce se va întâmpla la execuția secvenței: int x = 0; if (x = 5) cout << "Adevarat"; else cout << "Fals"; (pag. 63)?',
    questionTextEn: 'What happens upon execution of: int x = 0; if (x = 5) cout << "Adevarat"; else cout << "Fals"; (p. 63)?',
    hintRo: 'Atenție la operatorul = (atribuire) vs == (comparare de egalitate).',
    hintEn: 'Note the critical difference between = (assignment) and == (equality comparison).',
    options: [
      {
        id: 'a',
        textRo: 'A. Se va afișa „Fals”, deoarece x era inițial 0',
        textEn: 'A. Prints "Fals", because x was initially 0'
      },
      {
        id: 'b',
        textRo: 'B. Se va afișa „Adevarat”, deoarece x = 5 atribuie valoarea 5 lui x, iar 5 este o valoare nenulă (evaluată ca true în C++)',
        textEn: 'B. Prints "Adevarat", because x = 5 assigns 5 to x, and 5 is non-zero (evaluated as true in C++)'
      },
      {
        id: 'c',
        textRo: 'C. Programul se va bloca într-o buclă infinită',
        textEn: 'C. Program halts in an infinite loop'
      },
      {
        id: 'd',
        textRo: 'D. Calculatorul va afișa numărul 0',
        textEn: 'D. Output displays number 0'
      }
    ],
    correctOptionId: 'b',
    explanationRo: 'Corect! Aceasta este capcana clasică: instrucțiunea if (x = 5) atribuie valoarea 5 variabilei x, iar valoarea unei expresii de atribuire este chiar valoarea atribuită (5). În C++, orice valoare diferită de 0 este considerată adevărată (true), executându-se ramura if!',
    explanationEn: 'Correct! Classic trap: if (x = 5) assigns 5 to x. In C++, an assignment expression evaluates to the assigned value (5). Since any non-zero value evaluates to boolean true, the if branch executes!',
    manualRefRo: 'Manual pag. 63',
    manualRefEn: 'Textbook p. 63'
  }
];

export const A1Level7_CppRecapExam: React.FC<A1Level7Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});

  const handleSelect = (qId: string, optId: string) => {
    if (submittedAnswers[qId] || isLocked(qId)) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optId }));
    sounds.playClick();
  };

  const handleVerify = (qId: string, correctOptId: string) => {
    if (isLocked(qId)) return;
    const isCorrect = selectedAnswers[qId] === correctOptId;
    if (isCorrect) {
      sounds.playCorrect();
      setSubmittedAnswers(prev => ({ ...prev, [qId]: true }));
    } else {
      sounds.playWrong();
      triggerCooldown(qId);
    }
  };

  // 10 points default (Romanian grade 1) + 18 points per question = max 100 points (grade 10)
  const totalQuestions = EXAM_QUESTIONS.length;
  const correctCount = EXAM_QUESTIONS.filter(
    q => submittedAnswers[q.id] && selectedAnswers[q.id] === q.correctOptionId
  ).length;
  const score = Math.round((correctCount / totalQuestions) * 90 + 10);
  const isAllAnswered = EXAM_QUESTIONS.every(q => submittedAnswers[q.id]);

  const handleFinish = () => {
    sounds.playLevelUp();
    if (onCompletePage) onCompletePage(score);
    if (onComplete) onComplete();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-200 text-sm font-semibold tracking-wide uppercase mb-1">
              <Award className="w-5 h-5 text-indigo-300" />
              <span>
                {lang === 'ro'
                  ? 'Unitatea 3: Algoritmi & Programare C++ Avansată • Modulul 3A'
                  : 'Unit 3: Algorithms & Advanced C++ Programming • Module 3A'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {lang === 'ro'
                ? 'Lecția 7: Evaluare Sumativă – Fundamentele Limbajului C++'
                : 'Lesson 7: Summative Assessment – Fundamentals of C++'}
            </h1>
            <p className="text-indigo-100 text-sm md:text-base mt-1 max-w-3xl">
              {lang === 'ro'
                ? 'Manual Art Klett pag. 64: Demonstrează stăpânirea structurii canonice C++, a tipurilor de date, a operatorilor aritmetici și logici, precum și abilitatea de a identifica capcanele de compilare.'
                : 'Art Klett Textbook p. 64: Demonstrate mastery of canonical C++ structure, primitive data types, arithmetic and logical operators, and the diagnosis of compilation traps.'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-indigo-200 font-bold block">
              {lang === 'ro' ? 'Nivel' : 'Level'}
            </span>
            <span className="text-2xl font-black text-white">7 / 7</span>
          </div>
        </div>
      </div>

      {/* Score Summary Box */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
              {lang === 'ro' ? 'Progres Evaluare Modul 3A' : 'Module 3A Exam Progress'}
            </div>
            <div className="text-lg font-black text-slate-800">
              {lang === 'ro'
                ? `${correctCount} din ${totalQuestions} cerințe validate`
                : `${correctCount} of ${totalQuestions} requirements validated`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
              {lang === 'ro' ? 'Nota Estimată' : 'Estimated Grade'}
            </div>
            <div className="text-2xl font-black text-indigo-700">
              {score >= 10 ? (score / 10).toFixed(1) : '1.0'} / 10
            </div>
          </div>
          <div className="bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 text-xs font-bold text-indigo-800">
            {isAllAnswered
              ? (lang === 'ro' ? 'Evaluare Finalizată 🎉' : 'Assessment Completed 🎉')
              : (lang === 'ro' ? 'În Desfășurare' : 'In Progress')}
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {EXAM_QUESTIONS.map(q => {
          const isSubmitted = submittedAnswers[q.id];
          const selected = selectedAnswers[q.id];
          const isCorrect = selected === q.correctOptionId;
          const locked = isLocked(q.id);

          return (
            <div
              key={q.id}
              className={`bg-white rounded-2xl p-6 border transition-all ${
                isSubmitted
                  ? 'border-emerald-300 bg-emerald-50/20 shadow-sm'
                  : 'border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    {q.questionNumber}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">
                      {lang === 'ro' ? q.titleRo : q.titleEn}
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {lang === 'ro' ? q.manualRefRo : q.manualRefEn}
                    </span>
                  </div>
                </div>

                <QuestionHint
                  hint={lang === 'ro' ? q.hintRo : q.hintEn}
                  isOpen={showHints[q.id] || false}
                  onToggle={() => setShowHints(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                />
              </div>

              <p className="text-sm text-slate-700 font-medium mb-4 leading-relaxed font-sans">
                {lang === 'ro' ? q.questionTextRo : q.questionTextEn}
              </p>

              {locked && (
                <div className="mb-4">
                  <PedagogicalReflectionBanner remainingSeconds={cooldowns[q.id] || 0} />
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-2.5 mb-4">
                {q.options.map(opt => {
                  const isOptSelected = selected === opt.id;
                  let btnStyle = 'border-slate-200 hover:bg-slate-50 text-slate-700';

                  if (isSubmitted) {
                    if (opt.id === q.correctOptionId) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                    } else if (isOptSelected) {
                      btnStyle = 'border-rose-400 bg-rose-50 text-rose-800 line-through';
                    } else {
                      btnStyle = 'border-slate-200 opacity-50';
                    }
                  } else if (isOptSelected) {
                    btnStyle = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold ring-2 ring-indigo-200';
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={isSubmitted || locked}
                      onClick={() => handleSelect(q.id, opt.id)}
                      className={`p-3 rounded-xl border text-left text-xs transition leading-snug ${btnStyle}`}
                    >
                      {lang === 'ro' ? opt.textRo : opt.textEn}
                    </button>
                  );
                })}
              </div>

              {!isSubmitted ? (
                <button
                  onClick={() => handleVerify(q.id, q.correctOptionId)}
                  disabled={!selected || locked}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>{lang === 'ro' ? 'Validează Răspunsul' : 'Validate Answer'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <AnswerExplanation
                  explanation={lang === 'ro' ? q.explanationRo : q.explanationEn}
                  isCorrect={isCorrect}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Completion Banner */}
      {isAllAnswered && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur mx-auto flex items-center justify-center">
            <Award className="w-10 h-10 text-amber-300" />
          </div>
          <h2 className="text-2xl font-black">
            {lang === 'ro'
              ? 'Felicitări! Ai finalizat cu succes Evaluarea Sumativă Modul 3A!'
              : 'Congratulations! You successfully finished Module 3A Summative Assessment!'}
          </h2>
          <p className="text-emerald-100 text-sm max-w-xl mx-auto">
            {lang === 'ro'
              ? 'Ai demonstrat cunoștințe temeinice de sintaxă C++, stăpânirea tipurilor de date, operatorilor aritmetici și logici, precum și abilitatea de a depana expresii complexe.'
              : 'You demonstrated solid proficiency in canonical C++ syntax, primitive data types, arithmetic and logical operators, and complex expression debugging.'}
          </p>
          <div className="pt-2">
            <button
              onClick={handleFinish}
              className="px-8 py-3.5 bg-white text-indigo-950 font-extrabold rounded-xl shadow-lg hover:bg-emerald-50 transition transform hover:scale-105"
            >
              {lang === 'ro'
                ? 'Deblochează Diploma C++ Junior Developer & Revendică Punctele \u2192'
                : 'Unlock C++ Junior Developer Certificate & Claim Points \u2192'}
            </button>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <PageNavigationFooter
        currentLevel={7}
        totalLevels={7}
        isCompleted={isAllAnswered}
        onPrev={onPrev}
        onNext={handleFinish}
        nextLabel={lang === 'ro'
          ? "Revendică Diploma de C++ Junior Developer"
          : "Claim C++ Junior Developer Certificate"}
      />
    </div>
  );
};
