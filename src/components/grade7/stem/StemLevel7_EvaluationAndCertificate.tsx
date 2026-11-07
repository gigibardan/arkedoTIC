import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Printer,
  ShieldCheck,
  Check,
  QrCode,
  GraduationCap,
  Calendar,
  BookOpen,
  X
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  onPass: (score: number) => void;
  studentName?: string;
}

interface Question {
  id: string;
  questionRo: string;
  questionEn: string;
  codeSnippet?: string;
  options: {
    textRo: string;
    textEn: string;
    isCorrect: boolean;
  }[];
  explanationRo: string;
  explanationEn: string;
}

const EVALUATION_QUESTIONS: Question[] = [
  {
    id: 'q1',
    questionRo: 'Care este ordinea corectă de execuție a celor 3 elemente din antetul buclei for (int i = 1; i <= n; i++) la prima iterație?',
    questionEn: 'What is the correct execution order of the 3 header elements in for (int i = 1; i <= n; i++) on the first iteration?',
    codeSnippet: 'for (int i = 1; i <= n; i++) {\n    cout << i;\n}',
    options: [
      {
        textRo: '1. Inițializare (i=1) -> 2. Test condiție (i<=n) -> 3. Corpul buclei -> 4. Pasul de incrementare (i++)',
        textEn: '1. Initialization (i=1) -> 2. Condition check (i<=n) -> 3. Loop body -> 4. Step increment (i++)',
        isCorrect: true
      },
      {
        textRo: '1. Pasul de incrementare (i++) -> 2. Inițializare -> 3. Condiție',
        textEn: '1. Increment step (i++) -> 2. Initialization -> 3. Condition',
        isCorrect: false
      },
      {
        textRo: '1. Corpul buclei -> 2. Condiția -> 3. Inițializarea',
        textEn: '1. Loop body -> 2. Condition -> 3. Initialization',
        isCorrect: false
      },
      {
        textRo: 'Toate cele 3 se execută simultan în paralel',
        textEn: 'All 3 execute concurrently in parallel',
        isCorrect: false
      }
    ],
    explanationRo: 'Inițializarea se execută o singură dată la intrare, apoi se testează condiția, se rulează instrucțiunile, iar la sfârșitul pasului se face incrementarea i++.',
    explanationEn: 'Initialization executes once upon entry, then condition is evaluated, body statements run, and finally i++ increments at step conclusion.'
  },
  {
    id: 'q2',
    questionRo: 'De ce este obligatoriu semnul punct și virgulă (;) după condiția buclei do { ... } while (cond); ?',
    questionEn: 'Why is a semicolon (;) mandatory after the do { ... } while (cond); loop condition?',
    codeSnippet: 'do {\n    cin >> nota;\n} while (nota < 1 || nota > 10); // Obligatoriu punct si virgula!',
    options: [
      {
        textRo: 'Pentru că marchează finalul instrucțiunii compuse do-while în gramatica limbajului C++',
        textEn: 'Because it marks the end of the compound do-while statement in C++ grammar',
        isCorrect: true
      },
      {
        textRo: 'Pentru a șterge ecranul consolei',
        textEn: 'To clear the console screen',
        isCorrect: false
      },
      {
        textRo: 'Este doar o sugestie, programul compilează și fără el',
        textEn: 'It is just a suggestion, code compiles fine without it',
        isCorrect: false
      },
      {
        textRo: 'Pentru a converti numărul în zecimal',
        textEn: 'To convert the number to decimal',
        isCorrect: false
      }
    ],
    explanationRo: 'Spre deosebire de for și while unde acoladele urmează după condiție, la do-while acoladele sunt înainte, iar condiția finală reprezintă sfârșitul comenzii (de aceea cere punct și virgulă).',
    explanationEn: 'Unlike for/while where braces follow the condition, in do-while braces precede it, meaning the final condition statement requires a terminating semicolon.'
  },
  {
    id: 'q3',
    questionRo: 'Care este cel mai eficient interval în care căutăm divizorii proprii ai unui număr natural n?',
    questionEn: 'What is the most efficient interval to test for proper divisors of a natural number n?',
    codeSnippet: 'for (int d = 2; d <= n / 2; d++) {\n    if (n % d == 0) cout << d << " ";\n}',
    options: [
      {
        textRo: 'De la d = 2 până la n / 2 (jumătatea numărului)',
        textEn: 'From d = 2 up to n / 2 (half of the number)',
        isCorrect: true
      },
      {
        textRo: 'De la d = 1 până la 100.000',
        textEn: 'From d = 1 up to 100,000',
        isCorrect: false
      },
      {
        textRo: 'De la d = n până la 2 * n',
        textEn: 'From d = n up to 2 * n',
        isCorrect: false
      },
      {
        textRo: 'Numai numerele impare',
        textEn: 'Only odd numbers',
        isCorrect: false
      }
    ],
    explanationRo: 'Niciun număr n nu poate avea un divizor propriu strict mai mare decât n / 2 (ex: pentru 50, cel mai mare divizor propriu este 25).',
    explanationEn: 'No number n can have a proper divisor strictly greater than n / 2 (e.g. for 50, the largest proper divisor is 25).'
  },
  {
    id: 'q4',
    questionRo: 'Numărul 28 este un „Număr Perfect” (pag. 89). Care este motivul matematic?',
    questionEn: 'The number 28 is a "Perfect Number" (p. 89). What is the mathematical justification?',
    codeSnippet: '// Divizorii proprii ai lui 28 sunt: 1, 2, 4, 7, 14',
    options: [
      {
        textRo: 'Suma divizorilor săi proprii este exact egală cu numărul: 1 + 2 + 4 + 7 + 14 = 28',
        textEn: 'The sum of its proper divisors strictly equals the number: 1 + 2 + 4 + 7 + 14 = 28',
        isCorrect: true
      },
      {
        textRo: 'Are doar cifre pare',
        textEn: 'It has only even digits',
        isCorrect: false
      },
      {
        textRo: 'Este divizibil cu 10',
        textEn: 'It is divisible by 10',
        isCorrect: false
      },
      {
        textRo: 'Este cel mai mare număr prim din manual',
        textEn: 'It is the largest prime number in the textbook',
        isCorrect: false
      }
    ],
    explanationRo: 'Prin definiție, un număr este perfect dacă este egal cu suma divizorilor săi stricți (fără el însuși): 1 + 2 + 4 + 7 + 14 = 28.',
    explanationEn: 'By definition, a number is perfect if it equals the sum of its strict proper divisors (excluding itself): 1 + 2 + 4 + 7 + 14 = 28.'
  },
  {
    id: 'q5',
    questionRo: 'În laboratorul de fizică (pag. 97), cum calculăm forța de frecare la mișcarea unei sănii pe zăpadă?',
    questionEn: 'In the physics lab (p. 97), how do we compute friction force for a sled sliding on snow?',
    codeSnippet: 'double Ff = mu * m * 9.8;',
    options: [
      {
        textRo: 'Ff = μ · m · g (unde μ este coeficientul de frecare, m este masa în kg, iar g = 9.8 N/kg)',
        textEn: 'Ff = μ · m · g (where μ is friction coefficient, m is mass in kg, and g = 9.8 N/kg)',
        isCorrect: true
      },
      {
        textRo: 'Ff = m / μ + 9.8',
        textEn: 'Ff = m / μ + 9.8',
        isCorrect: false
      },
      {
        textRo: 'Ff = m · d / t',
        textEn: 'Ff = m · d / t',
        isCorrect: false
      },
      {
        textRo: 'Ff = viteza · timpul',
        textEn: 'Ff = speed · time',
        isCorrect: false
      }
    ],
    explanationRo: 'Forța de frecare la alunecare pe suprafață orizontală este Ff = μ * Greutate = μ * m * g.',
    explanationEn: 'Sliding friction force on horizontal surfaces is Ff = μ * Weight = μ * m * g.'
  },
  {
    id: 'q6',
    questionRo: 'Dacă temperatura minimă a fost de -10°C, iar maxima a fost de +25°C, cât este amplitudinea termică anuală?',
    questionEn: 'If the minimum temperature was -10°C and maximum was +25°C, what is the annual thermal range?',
    codeSnippet: 'double amp = T_max - T_min;',
    options: [
      {
        textRo: '35°C (25 - (-10) = 35°C)',
        textEn: '35°C (25 - (-10) = 35°C)',
        isCorrect: true
      },
      {
        textRo: '15°C (25 - 10)',
        textEn: '15°C (25 - 10)',
        isCorrect: false
      },
      {
        textRo: '-35°C',
        textEn: '-35°C',
        isCorrect: false
      },
      {
        textRo: '250°C',
        textEn: '250°C',
        isCorrect: false
      }
    ],
    explanationRo: 'Ecartul termic este diferența dintre maximă și minimă: 25 - (-10) = 35°C.',
    explanationEn: 'The thermal range is max minus min: 25 - (-10) = 35°C.'
  }
];

export const StemLevel7_EvaluationAndCertificate: React.FC<Props> = ({ onPass, studentName }) => {
  const { lang } = useLanguage();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [calculatedScore, setCalculatedScore] = useState<number>(0);
  const [showIncompleteWarning, setShowIncompleteWarning] = useState<boolean>(false);

  const handleSelectOption = (qId: string, optIdx: number) => {
    if (isSubmitted) return;
    sounds.playClick();
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIdx }));
    setShowIncompleteWarning(false);
  };

  const handleSubmitExam = () => {
    // Verify all answered
    if (Object.keys(selectedAnswers).length < EVALUATION_QUESTIONS.length) {
      sounds.playWrong();
      setShowIncompleteWarning(true);
      return;
    }

    let correctCount = 0;
    EVALUATION_QUESTIONS.forEach(q => {
      const pickedIdx = selectedAnswers[q.id];
      if (pickedIdx !== undefined && q.options[pickedIdx].isCorrect) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / EVALUATION_QUESTIONS.length) * 100);
    setCalculatedScore(finalScore);
    setIsSubmitted(true);

    if (finalScore >= 70) {
      sounds.playSuccess();
      onPass(finalScore);
    } else {
      sounds.playWrong();
    }
  };

  const handleResetExam = () => {
    sounds.playClick();
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCalculatedScore(0);
    setShowIncompleteWarning(false);
  };

  const handlePrintCertificate = () => {
    sounds.playClick();
    window.print();
  };

  const isPassed = isSubmitted && calculatedScore >= 70;

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-900/80 via-blue-900/80 to-slate-900 p-6 rounded-3xl border border-cyan-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30 mb-2">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'ro' ? 'Nivelul 7 din 7 • Evaluare Finală & Certificare' : 'Level 7 of 7 • Final Evaluation & Certificate'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {lang === 'ro' ? 'Test Sumativ STEM & Diploma Oficială C++' : 'STEM Summative Exam & Official C++ Diploma'}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              {lang === 'ro'
                ? 'Dovedește că stăpânești buclele for și do-while, algoritmii pe divizori și aplicarea formulelor din Fizică și Geografie în C++.'
                : 'Prove mastery of for and do-while loops, divisor algorithms, and applied Physics and Geography formulas in C++.'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5 shadow-inner">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ro' ? '100 Puncte' : '100 Points'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* In-DOM Incomplete Warning Banner */}
      {showIncompleteWarning && (
        <div className="bg-amber-950/80 border-2 border-amber-500/60 p-4 rounded-2xl flex items-center justify-between gap-3 text-amber-200 text-xs sm:text-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              {lang === 'ro'
                ? 'Te rugăm să răspunzi la toate cele 6 întrebări înainte de evaluare!'
                : 'Please answer all 6 questions before submitting your assessment!'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowIncompleteWarning(false)}
            className="p-1 rounded-lg bg-amber-900/60 hover:bg-amber-800 text-amber-200 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Questions Grid */}
      <div className="flex flex-col gap-5">
        {EVALUATION_QUESTIONS.map((q, qIndex) => {
          const selectedIdx = selectedAnswers[q.id];
          return (
            <div
              key={q.id}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  {lang === 'ro'
                    ? `Întrebarea ${qIndex + 1} din ${EVALUATION_QUESTIONS.length}`
                    : `Question ${qIndex + 1} of ${EVALUATION_QUESTIONS.length}`}
                </span>
                {isSubmitted && (
                  <span className={`text-xs font-mono font-bold flex items-center gap-1 ${q.options[selectedIdx]?.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {q.options[selectedIdx]?.isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    <span>
                      {q.options[selectedIdx]?.isCorrect
                        ? (lang === 'ro' ? 'Corect (+17 pct)' : 'Correct (+17 pts)')
                        : (lang === 'ro' ? 'Incorect (0 pct)' : 'Incorrect (0 pts)')}
                    </span>
                  </span>
                )}
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white mb-2 leading-relaxed">
                {lang === 'ro' ? q.questionRo : q.questionEn}
              </h3>

              {q.codeSnippet && (
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl font-mono text-xs text-cyan-300 mb-4 whitespace-pre">
                  {q.codeSnippet}
                </div>
              )}

              <div className="grid grid-cols-1 gap-2.5">
                {q.options.map((opt, optIndex) => {
                  const isPicked = selectedIdx === optIndex;
                  return (
                    <button
                      key={optIndex}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(q.id, optIndex)}
                      className={`p-3.5 rounded-2xl text-left text-xs font-medium border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isPicked
                          ? isSubmitted
                            ? opt.isCorrect
                              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                              : 'bg-rose-950/60 border-rose-500 text-rose-200'
                            : 'bg-cyan-950/60 border-cyan-500 text-cyan-200 shadow-md'
                          : isSubmitted && opt.isCorrect
                          ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-950/60 hover:bg-slate-850 border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span>{lang === 'ro' ? opt.textRo : opt.textEn}</span>
                      {isPicked && (
                        <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-cyan-300" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {isSubmitted && (
                <div className="mt-3.5 pt-3.5 border-t border-slate-800 text-xs text-slate-400 leading-relaxed font-sans">
                  <strong className="text-slate-300">{lang === 'ro' ? 'Explicație: ' : 'Explanation: '}</strong>
                  {lang === 'ro' ? q.explanationRo : q.explanationEn}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      {!isSubmitted ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
          <div className="text-xs text-slate-400 font-mono">
            {lang === 'ro' ? 'Răspunsuri completate: ' : 'Completed answers: '}
            <strong className="text-cyan-300">
              {Object.keys(selectedAnswers).length} / {EVALUATION_QUESTIONS.length}
            </strong>
          </div>
          <button
            type="button"
            onClick={handleSubmitExam}
            className="py-3 px-8 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-black text-sm transition shadow-lg shadow-cyan-600/30 cursor-pointer active:scale-95"
          >
            {lang === 'ro' ? 'Finalizează Evaluarea & Vezi Diploma' : 'Complete Evaluation & View Diploma'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          {/* Results Bar */}
          <div className={`w-full p-6 rounded-3xl border text-center flex flex-col items-center gap-2 ${isPassed ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-rose-950/40 border-rose-500/40'}`}>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              {lang === 'ro' ? 'Rezultat Evaluare Sumativă' : 'Summative Assessment Result'}
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-white">
              {lang === 'ro' ? 'Nota ' : 'Grade '}
              {calculatedScore >= 95 ? '10' : calculatedScore >= 80 ? '9' : calculatedScore >= 70 ? '8' : '< 7'} ({calculatedScore} {lang === 'ro' ? 'Puncte' : 'Points'})
            </div>
            <p className="text-xs text-slate-300 max-w-md">
              {isPassed
                ? (lang === 'ro'
                    ? 'Felicitări! Ai promovat cu succes Modulul 4E: Bucle for, do-while & Aplicații STEM!'
                    : 'Congratulations! You successfully passed Module 4E: for, do-while Loops & STEM Applications!')
                : (lang === 'ro'
                    ? 'Scorul este sub 70%. Poți reîncerca testul pentru a obține diploma de merit!'
                    : 'Score is under 70%. You may retake the exam to earn your merit diploma!')}
            </p>
            {!isPassed && (
              <button
                type="button"
                onClick={handleResetExam}
                className="mt-3 py-2 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'ro' ? 'Reia Testul' : 'Retake Exam'}</span>
              </button>
            )}
          </div>

          {/* Official Printable Diploma */}
          {isPassed && (
            <div className="w-full flex flex-col items-center gap-4">
              <div
                id="diploma-stem-grade7"
                className="w-full max-w-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-4 border-amber-400/80 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center text-slate-200"
              >
                {/* Gold ornament border styling */}
                <div className="absolute top-2 left-2 right-2 bottom-2 border border-amber-400/30 rounded-2xl pointer-events-none" />

                <div className="flex flex-col items-center gap-3 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center text-amber-300 text-3xl shadow-lg">
                    🎓
                  </div>

                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                    {lang === 'ro'
                      ? 'MINISTERUL EDUCAȚIEI • PROGRAMA NAȚIONALĂ OMEN 3393/2017 & OM 5420/2024'
                      : 'MINISTRY OF EDUCATION • NATIONAL CURRICULUM OMEN 3393/2017 & OM 5420/2024'}
                  </span>

                  <h2 className="text-xl sm:text-3xl font-black text-white font-serif tracking-tight mt-1">
                    {lang === 'ro' ? 'DIPLOMĂ DE MERIT STEM & PROGRAMARE C++' : 'STEM & C++ PROGRAMMING MERIT DIPLOMA'}
                  </h2>

                  <p className="text-xs text-slate-400 max-w-lg italic font-serif">
                    {lang === 'ro' ? 'Se acordă elevului / elevei' : 'Conferred upon student'}
                  </p>

                  <div className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 font-mono py-1 border-b-2 border-amber-400/40 min-w-[240px]">
                    {studentName?.trim() || (lang === 'ro' ? 'Elev Clasa a VII-a' : 'Grade 7 Student')}
                  </div>

                  <p className="text-xs text-slate-300 max-w-xl leading-relaxed mt-2">
                    {lang === 'ro' ? (
                      <>
                        Pentru absolvirea cu succes a <strong>Modulului 4E: Bucle for, do-while &amp; Aplicații Interdisciplinare STEM</strong> (Manual pag. 86–102). A demonstrat competențe avansate în structuri repetitive, determinarea divizorilor, numere prime, modele grafice ASCII și rezolvarea de probleme practice din Fizică și Geografie.
                      </>
                    ) : (
                      <>
                        For successful completion of <strong>Module 4E: for, do-while Loops &amp; Interdisciplinary STEM Applications</strong> (Textbook p. 86–102). Demonstrated advanced competence in iterative control structures, divisors, prime testing, ASCII 2D graphics, and problem solving in Physics and Geography.
                      </>
                    )}
                  </p>

                  {/* Badges & Seal Row */}
                  <div className="grid grid-cols-3 gap-4 w-full max-w-lg mt-6 pt-6 border-t border-slate-800 text-center">
                    <div className="flex flex-col items-center">
                      <GraduationCap className="w-5 h-5 text-cyan-400 mb-1" />
                      <span className="text-[10px] font-mono uppercase text-slate-400">{lang === 'ro' ? 'Disciplina' : 'Subject'}</span>
                      <strong className="text-xs font-mono text-white">{lang === 'ro' ? 'Informatică & TIC' : 'Computer Science & ICT'}</strong>
                    </div>

                    <div className="flex flex-col items-center">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1" />
                      <span className="text-[10px] font-mono uppercase text-slate-400">{lang === 'ro' ? 'Punctaj Obținut' : 'Earned Score'}</span>
                      <strong className="text-xs font-mono text-emerald-300">{calculatedScore} / 100 {lang === 'ro' ? 'Pct' : 'Pts'}</strong>
                    </div>

                    <div className="flex flex-col items-center">
                      <Calendar className="w-5 h-5 text-amber-400 mb-1" />
                      <span className="text-[10px] font-mono uppercase text-slate-400">{lang === 'ro' ? 'An Școlar' : 'School Year'}</span>
                      <strong className="text-xs font-mono text-white">2025–2026</strong>
                    </div>
                  </div>

                  {/* Digital Signature & Stamp */}
                  <div className="flex items-center justify-between w-full max-w-lg mt-6 pt-4 border-t border-slate-800/80 text-[11px] font-mono">
                    <div className="flex flex-col items-start text-left">
                      <span className="text-slate-500">{lang === 'ro' ? 'Certificat Verificat:' : 'Verified Certificate:'}</span>
                      <span className="text-amber-400 font-bold">ARK3DO-STEM-G7-PASS</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <QrCode className="w-8 h-8 text-cyan-400 opacity-80" />
                      <div className="w-10 h-10 rounded-full border border-amber-400/50 bg-amber-500/10 flex items-center justify-center text-[8px] font-mono text-amber-300 font-bold rotate-[-12deg]">
                        {lang === 'ro' ? 'OFICIAL' : 'OFFICIAL'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Print Button */}
              <button
                type="button"
                onClick={handlePrintCertificate}
                className="py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/40 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>{lang === 'ro' ? 'Printează Diploma / Salvează PDF' : 'Print Diploma / Save as PDF'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
