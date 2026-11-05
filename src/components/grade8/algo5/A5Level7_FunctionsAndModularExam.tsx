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
  Layers,
  GraduationCap
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { useLanguage } from '../../../context/LanguageContext';

interface A5Level7Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
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
  options: { id: string; textRo: string; textEn: string }[];
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
    titleRo: 'Antetul Subprogramului & Tipul Returnat',
    titleEn: 'Function Header & Return Type',
    questionTextRo:
      'Ce reprezintă cuvântul cheie void specificat ca tip de returnare în antetul unei funcții C++, de exemplu void afisare(int v[], int n) (pag. 85)?',
    questionTextEn:
      'What does the keyword void specified as return type in a C++ function header signify, for example void display(int v[], int n) (p. 85)?',
    hintRo: 'Gândește-te dacă o astfel de funcție are nevoie de instrucțiunea return valoare; sau doar execută acțiuni.',
    hintEn: 'Consider whether such a function requires a return value; statement or simply performs actions.',
    options: [
      {
        id: 'a',
        textRo: 'A. Funcția returnează întotdeauna valoarea 0 către sistemul de operare.',
        textEn: 'A. The function always returns 0 to the operating system.'
      },
      {
        id: 'b',
        textRo: 'B. Funcția execută o secvență de instrucțiuni (prelucrări, afișări), dar nu întoarce nicio valoare printr-o expresie return.',
        textEn: 'B. The function executes actions (processing, printing), but does not return any value through a return expression.'
      },
      {
        id: 'c',
        textRo: 'C. Funcția este una invalidă și va genera obligatoriu o eroare de compilare.',
        textEn: 'C. The function is invalid and will cause a compiler error.'
      },
      {
        id: 'd',
        textRo: 'D. Indică faptul că funcția nu poate primi niciun parametru între paranteze.',
        textEn: 'D. Indicates that the function cannot receive any arguments in parentheses.'
      }
    ],
    correctOptionId: 'b',
    explanationRo:
      'Corect! În C++, cuvântul cheie void indică absența unei valori de return. Subprogramul este o procedură care realizează acțiuni sau modifică parametri prin referință, fără a produce un rezultat calculat unic direct prin return.',
    explanationEn:
      'Correct! In C++, the keyword void denotes the absence of a return value. The subprogram executes actions or modifies reference parameters without returning a direct evaluated value.',
    manualRefRo: 'Manual pag. 85',
    manualRefEn: 'Textbook p. 85'
  },
  {
    id: 'q2',
    questionNumber: 2,
    titleRo: 'Transmiterea prin Valoare vs prin Referință (&)',
    titleEn: 'Pass-by-Value vs Pass-by-Reference (&)',
    questionTextRo:
      'Care este diferența esențială între void f(int x) și void f(int &x) când apelăm f(a) în funcția main() (pag. 85–86)?',
    questionTextEn:
      'What is the fundamental difference between void f(int x) and void f(int &x) when invoking f(a) in main() (pp. 85–86)?',
    hintRo: 'Simbolul & creează un alias direct către variabila originală din memorie.',
    hintEn: 'The & symbol creates a direct alias to the original caller variable in memory.',
    options: [
      {
        id: 'a',
        textRo: 'A. Nu există nicio diferență; ambele variante modifică permanent variabila a din main.',
        textEn: 'A. There is no difference; both options permanently modify variable a in main.'
      },
      {
        id: 'b',
        textRo: 'B. La transmiterea prin valoare (int x), se creează o copie locală pe stivă, iar a rămâne neschimbat; la transmiterea prin referință (int &x), x devine un alias al lui a, modificându-l direct.',
        textEn: 'B. In pass-by-value (int x), an independent stack copy is created, leaving a unchanged; in pass-by-reference (int &x), x aliases a, modifying it directly in-place.'
      },
      {
        id: 'c',
        textRo: 'C. Transmiterea prin referință funcționează exclusiv pentru numere negative.',
        textEn: 'C. Pass-by-reference only operates on negative integers.'
      },
      {
        id: 'd',
        textRo: 'D. Transmiterea prin valoare șterge variabila din memorie la finalul programului.',
        textEn: 'D. Pass-by-value deletes the variable from memory at program termination.'
      }
    ],
    correctOptionId: 'b',
    explanationRo:
      'Corect! La transmiterea prin valoare, parametrii formali sunt copii independente create pe stivă și distruse la ieșirea din funcție. Operatorul & (referință) leagă parametrul formal direct de adresa variabilei reale din apelant.',
    explanationEn:
      'Correct! With pass-by-value, formal parameters are independent stack copies destroyed upon return. The & operator (reference) binds the parameter directly to the real variable address in the caller.',
    manualRefRo: 'Manual pag. 85–86',
    manualRefEn: 'Textbook pp. 85–86'
  },
  {
    id: 'q3',
    questionNumber: 3,
    titleRo: 'Vectorii ca Parametri în Subprograme',
    titleEn: 'Arrays as Parameters in Subprograms',
    questionTextRo:
      'Cum se comportă un vector unidimensional când este transmis către o funcție C++, de exemplu void dubleaza(int v[], int n) (pag. 86–87)?',
    questionTextEn:
      'How does a one-dimensional array behave when passed to a C++ function, e.g. void doubleElements(int v[], int n) (pp. 86–87)?',
    hintRo: 'De ce nu punem & în fața lui v[] pentru a-i modifica valorile?',
    hintEn: 'Why do we not put & before v[] to modify its values?',
    options: [
      {
        id: 'a',
        textRo: 'A. Vectorul v[] este transmis automat prin adresa primului său element; orice modificare asupra lui v[i] afectează direct vectorul din funcția apelantă.',
        textEn: 'A. Array v[] is automatically passed by the address of its first element; any change to v[i] directly affects the array in the caller.'
      },
      {
        id: 'b',
        textRo: 'B. Toate elementele vectorului sunt copiate integral într-un vector temporar, iar modificările se pierd.',
        textEn: 'B. All array elements are duplicated into a temporary array and modifications are lost.'
      },
      {
        id: 'c',
        textRo: 'C. Compilatorul C++ nu permite transmiterea vectorilor ca parametri în subprograme.',
        textEn: 'C. The C++ compiler forbids passing arrays as parameters in subprograms.'
      },
      {
        id: 'd',
        textRo: 'D. Vectorul se inversează automat în memorie la intrarea în funcție.',
        textEn: 'D. The array automatically reverses in memory upon entering the function.'
      }
    ],
    correctOptionId: 'a',
    explanationRo:
      'Corect! În C++, numele unui tablou este echivalent cu adresa primului său element (&v[0]). Prin urmare, vectorii sunt transmiși natural prin adresă, modificările in-place asupra elementelor reflectându-se imediat în vectorul din main.',
    explanationEn:
      'Correct! In C++, the name of an array decays to the address of its first element (&v[0]). Thus, arrays are naturally passed by address, and in-place modifications reflect immediately in main.',
    manualRefRo: 'Manual pag. 86–87',
    manualRefEn: 'Textbook pp. 86–87'
  },
  {
    id: 'q4',
    questionNumber: 4,
    titleRo: 'Domeniul de Vizibilitate & Durata de Viață (Scope)',
    titleEn: 'Scope & Variable Lifetime',
    questionTextRo:
      'Ce se întâmplă cu variabilele locale declarate în interiorul unei funcții C++ după executarea instrucțiunii de final sau return (pag. 88)?',
    questionTextEn:
      'What happens to local variables declared inside a C++ function after executing the closing brace or return (p. 88)?',
    hintRo: 'Variabilele locale există doar pe durata cât se execută blocul { } în care au fost declarate.',
    hintEn: 'Local variables exist only during the execution of the { } block in which they are defined.',
    options: [
      {
        id: 'a',
        textRo: 'A. Rămân salvate permanent pe disc într-un fișier text.',
        textEn: 'A. They remain saved permanently on disk in a text file.'
      },
      {
        id: 'b',
        textRo: 'B. Devin variabile globale accesibile de oriunde din program.',
        textEn: 'B. They turn into global variables accessible anywhere in the program.'
      },
      {
        id: 'c',
        textRo: 'C. Spațiul lor de memorie de pe stivă este eliberat, iar variabilele sunt distruse automat și nu mai pot fi accesate.',
        textEn: 'C. Their stack memory frame is deallocated, variables are destroyed automatically, and cannot be accessed.'
      },
      {
        id: 'd',
        textRo: 'D. Își dublează valoarea pentru următorul apel al aceleiași funcții.',
        textEn: 'D. Their value doubles for the next call to the same function.'
      }
    ],
    correctOptionId: 'c',
    explanationRo:
      'Corect! Variabilele locale au durata de viață limitată la execuția blocului {} în care sunt definite. La revenirea din funcție, cadrul de stivă (stack frame) este eliberat, iar valorile locale dispar.',
    explanationEn:
      'Correct! Local variables have their lifetime bound to the execution of their block {}. Upon returning from the function, their stack frame is deallocated and local values disappear.',
    manualRefRo: 'Manual pag. 88',
    manualRefEn: 'Textbook p. 88'
  },
  {
    id: 'q5',
    questionNumber: 5,
    titleRo: 'Arhitectura Modulară & Principiul Divide et Impera',
    titleEn: 'Modular Architecture & Divide and Conquer',
    questionTextRo:
      'Care este principalul avantaj ingineresc al împărțirii unui proiect C++ complex în subprograme specializate (pag. 87–88)?',
    questionTextEn:
      'What is the principal engineering advantage of decomposing a complex C++ program into specialized subprograms (pp. 87–88)?',
    hintRo: 'Gândește-te la refolosirea funcțiilor precum estePrim(), depanare ușoară și claritatea funcției main().',
    hintEn: 'Think about reusability of functions like isPrime(), isolated debugging, and clean readability in main().',
    options: [
      {
        id: 'a',
        textRo: 'A. Permite rularea programului fără a instala un compilator.',
        textEn: 'A. Allows running code without a compiler.'
      },
      {
        id: 'b',
        textRo: 'B. Modularitatea asigură claritate, reutilizarea codului fără duplicare, testare și depanare izolată și o funcție main() curată și expresivă.',
        textEn: 'B. Modularity provides clarity, code reuse without duplication, isolated unit testing and debugging, and an expressive, clean main() function.'
      },
      {
        id: 'c',
        textRo: 'C. Transformă automat codul C++ în pagini web HTML.',
        textEn: 'C. Automatically converts C++ code into HTML web pages.'
      },
      {
        id: 'd',
        textRo: 'D. Elimină complet necesitatea de a folosi variabile sau tipuri de date.',
        textEn: 'D. Eliminates any need to use variables or data types.'
      }
    ],
    correctOptionId: 'b',
    explanationRo:
      'Corect! Principiul Divide et Impera (Descompune și Stăpânește) transformă o problemă uriașă în module mici, testabile individual și refolosibile în multiple scenarii, făcând codul curat și profesional.',
    explanationEn:
      'Correct! Divide and Conquer breaks large problems into small, testable, and reusable modules, resulting in maintainable, clean production code.',
    manualRefRo: 'Manual pag. 87–88',
    manualRefEn: 'Textbook pp. 87–88'
  }
];

export const A5Level7_FunctionsAndModularExam: React.FC<A5Level7Props> = ({
  onCompletePage,
  onComplete
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
      <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-purple-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-400/30 text-purple-300">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">
                  {lang === 'ro' ? 'Unitatea 3 • Evaluare Sumativă (Manual pag. 88)' : 'Unit 3 • Summative Exam (Textbook p. 88)'}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                  {lang === 'ro' ? 'Standard Național 2025' : 'National Standard 2025'}
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight mt-1">
                {lang === 'ro'
                  ? 'Examen Sumativ: Subprograme & Programare Modulară C++'
                  : 'Summative Exam: Subprograms & Modular C++ Programming'}
              </h1>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-purple-300 font-mono">
              {lang === 'ro' ? 'Prag promovare: 70%' : 'Passing score: 70%'}
            </div>
            <div className="text-lg font-bold text-emerald-400 font-mono">
              {lang === 'ro' ? '5 Întrebări Oficiale' : '5 Official Questions'}
            </div>
          </div>
        </div>
        <p className="mt-4 text-purple-100 text-sm leading-relaxed border-t border-purple-800/40 pt-3">
          {lang === 'ro' ? (
            <>
              Verifică stăpânirea conceptelor esențiale: prototipuri, tipuri de return, transmitere prin valoare și referință (&amp;), prelucrarea tablourilor în funcții și arhitectură modulară. Răspunsurile greșite activează o pauză de reflecție pedagogică de 5 secunde.
            </>
          ) : (
            <>
              Tests core modular programming concepts: prototypes, return types, pass-by-value and reference (&amp;), array manipulation in subprograms, and modular decomposition. Incorrect answers trigger a 5-second pedagogical reflection timer.
            </>
          )}
        </p>
      </div>

      {/* Questions list */}
      <div className="space-y-6">
        {EXAM_QUESTIONS.map((q) => {
          const selected = selectedAnswers[q.id];
          const isCorrect = selected === q.correctOptionId;
          const locked = isLocked(q.id);

          return (
            <div
              key={q.id}
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                submitted
                  ? isCorrect
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-rose-950/20 border-rose-500/40'
                  : selected
                  ? 'bg-slate-900 border-indigo-500/40 shadow-lg shadow-indigo-500/5'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Question title and header */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center text-xs font-mono font-bold">
                    {q.questionNumber}
                  </span>
                  <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                    {lang === 'ro' ? q.titleRo : q.titleEn}
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-mono bg-slate-800/50 px-2 py-0.5 rounded">
                  {lang === 'ro' ? q.manualRefRo : q.manualRefEn}
                </span>
              </div>

              {/* Question Text */}
              <p className="text-slate-100 font-medium text-sm md:text-base leading-relaxed mb-4">
                {lang === 'ro' ? q.questionTextRo : q.questionTextEn}
              </p>

              {/* Pedagogical Reflection Banner */}
              {locked && !submitted && (
                <div className="mb-4">
                  <PedagogicalReflectionBanner
                    remainingSeconds={cooldowns[q.id] || 0}
                    tip={
                      lang === 'ro'
                        ? 'Gândește-te la modul în care compilatorul gestionează memoria stivei sau adresele variabilelor!'
                        : 'Consider how the compiler manages call stack memory frames and variable addresses!'
                    }
                  />
                </div>
              )}

              {/* Options */}
              <div className="space-y-2.5">
                {q.options.map((opt) => {
                  const isOptSelected = selected === opt.id;
                  const isOptCorrect = opt.id === q.correctOptionId;

                  let optStyle =
                    'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600';

                  if (locked && !submitted) {
                    optStyle = 'bg-slate-800/30 border-slate-800 text-slate-500 cursor-not-allowed opacity-60';
                  } else if (submitted) {
                    if (isOptCorrect) {
                      optStyle = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200 font-semibold';
                    } else if (isOptSelected && !isOptCorrect) {
                      optStyle = 'bg-rose-500/20 border-rose-500/60 text-rose-200';
                    } else {
                      optStyle = 'bg-slate-800/20 border-slate-800/40 text-slate-500';
                    }
                  } else if (isOptSelected) {
                    optStyle = 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-medium shadow-inner';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      disabled={locked || submitted}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs md:text-sm transition-all duration-200 flex items-start space-x-3 ${optStyle}`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-mono ${
                          isOptSelected
                            ? 'bg-indigo-500 text-white font-bold'
                            : 'bg-slate-700/60 text-slate-400'
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

              {/* Hints & Explanations */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                {!submitted ? (
                  <button
                    onClick={() =>
                      setActiveHintId(activeHintId === q.id ? null : q.id)
                    }
                    className="text-amber-400 hover:text-amber-300 flex items-center space-x-1.5 font-medium transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>
                      {activeHintId === q.id
                        ? lang === 'ro'
                          ? 'Ascunde indiciul'
                          : 'Hide hint'
                        : lang === 'ro'
                        ? 'Arată indiciu'
                        : 'Show hint'}
                    </span>
                  </button>
                ) : (
                  <div className="text-slate-400">
                    <span className="font-semibold text-slate-300">
                      {lang === 'ro' ? 'Explicație didactică:' : 'Pedagogical explanation:'}
                    </span>{' '}
                    {lang === 'ro' ? q.explanationRo : q.explanationEn}
                  </div>
                )}
              </div>

              {activeHintId === q.id && !submitted && (
                <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-xs">
                  <strong>{lang === 'ro' ? 'Indiciu:' : 'Hint:'}</strong> {lang === 'ro' ? q.hintRo : q.hintEn}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Score Card after submission */}
      {submitted && (
        <div
          className={`p-6 rounded-2xl border text-center space-y-4 shadow-xl ${
            score >= 70
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-slate-900 border border-current">
            {score >= 70 ? (
              <GraduationCap className="w-8 h-8 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-rose-400" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {score >= 70
                ? lang === 'ro'
                  ? 'Felicitări! Ai promovat Examenul Unității 3!'
                  : 'Congratulations! You passed the Unit 3 Exam!'
                : lang === 'ro'
                ? 'Punctaj insuficient pentru promovare'
                : 'Insufficient score to pass'}
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              {lang === 'ro' ? 'Punctaj obținut: ' : 'Achieved score: '}
              <span className="font-bold text-white">{score}%</span> (
              {lang === 'ro' ? 'Nota echivalentă: ' : 'Equivalent Grade: '}
              <span className="font-bold text-white">{romanianGrade}</span>)
            </p>
          </div>

          {score >= 70 ? (
            <p className="text-xs text-emerald-300 max-w-lg mx-auto">
              {lang === 'ro'
                ? 'Ai demonstrat o stăpânire completă a arhitecturii modulare C++, a vectorilor și tehnicilor avansate de programare. Ești gata să primești Diploma Oficială de Arhitect Modular C++ (Nivelul 8)!'
                : 'You have demonstrated complete mastery of C++ modular architecture, arrays, and advanced algorithm design. You are ready to claim your Official C++ Modular Architect Certificate!'}
            </p>
          ) : (
            <p className="text-xs text-rose-300 max-w-lg mx-auto">
              {lang === 'ro'
                ? 'Ai nevoie de cel puțin 70% pentru a debloca Diploma Oficială. Reia conceptele cheie și încearcă din nou!'
                : 'You need at least 70% to unlock the Official Certificate. Review key concepts and try again!'}
            </p>
          )}

          <div className="flex justify-center gap-3 pt-2">
            {score < 70 && (
              <button
                onClick={() => {
                  setSubmitted(false);
                  setSelectedAnswers({});
                  sounds.playClick();
                }}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-all"
              >
                {lang === 'ro' ? 'Reîncearcă Examenul' : 'Retake Exam'}
              </button>
            )}
            {score >= 70 && (
              <button
                onClick={handleFinishLevel}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center space-x-2 transition-all cursor-pointer"
              >
                <span>{lang === 'ro' ? 'Revendică Diploma Oficială (Nivelul 8)' : 'Claim Official Certificate (Level 8)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Exam submission button */}
      {!submitted && (
        <div className="sticky bottom-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-2xl flex items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            {allAnswered ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {lang === 'ro' ? 'Toate întrebările au fost completate!' : 'All questions answered!'}
              </span>
            ) : (
              <span>
                {lang === 'ro'
                  ? 'Răspunde la toate cele 5 întrebări pentru a trimite lucrarea.'
                  : 'Answer all 5 questions to submit your exam.'}
              </span>
            )}
          </div>
          <button
            onClick={handleSubmitExam}
            disabled={!allAnswered}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center space-x-2 ${
              allAnswered
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white shadow-lg shadow-purple-500/25 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>{lang === 'ro' ? 'Trimite Lucrarea de Examen' : 'Submit Exam'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
