import React, { useState } from 'react';
import { Award, CheckCircle2, RotateCcw, Printer, Sparkles, Check, X } from 'lucide-react';
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
  optionsRo: string[];
  optionsEn: string[];
  correctIdx: number;
  explanationRo: string;
  explanationEn: string;
}

const EVALUATION_QUESTIONS: Question[] = [
  {
    id: 'q1',
    questionRo: 'Care este rolul operatorului >> în instrucțiunea cin >> x;?',
    questionEn: 'What is the role of operator >> in the instruction cin >> x;?',
    optionsRo: [
      'Inserează textul pe ecranul consolei',
      'Extrage datele introduse de utilizator de la tastatură și le stochează în variabila x',
      'Compară dacă cin este mai mare strict decât x',
      'Șterge conținutul variabilei x din memorie'
    ],
    optionsEn: [
      'Inserts text onto the console screen',
      'Extracts keyboard input from the user and stores it into variable x',
      'Checks whether cin is strictly greater than x',
      'Erases the content of variable x from memory'
    ],
    correctIdx: 1,
    explanationRo: 'Operatorul >> este operatorul de extracție din fluxul de intrare (cin) și direcționează datele de la tastatură înspre variabila din memorie.',
    explanationEn: 'Operator >> is the input stream extraction operator (cin) that routes keyboard data into the variable in memory.'
  },
  {
    id: 'q2',
    questionRo: 'Într-un algoritm liniar simplu, care este ordinea logică corectă a celor 4 pași?',
    questionEn: 'In a simple linear algorithm, what is the correct logical order of the 4 steps?',
    optionsRo: [
      'Afișare -> Calcul -> Citire -> Declarare',
      'Calcul -> Declarare -> Afișare -> Citire',
      'Declarare variabile -> Citire date intrare -> Calcul / Prelucrare -> Afișare rezultate',
      'Citire -> Afișare -> Declarare -> Calcul'
    ],
    optionsEn: [
      'Output -> Calculation -> Input -> Declaration',
      'Calculation -> Declaration -> Output -> Input',
      'Variable declaration -> Read input data -> Processing / Calculation -> Output results',
      'Input -> Output -> Declaration -> Calculation'
    ],
    correctIdx: 2,
    explanationRo: 'În structura liniară ordinea este strictă: întâi rezervăm memorie (declarare), apoi cerem date utilizatorului (citire), efectuăm calculele, iar la final tipărim rezultatul (afișare).',
    explanationEn: 'In linear structure sequence is strict: reserve RAM slots (declaration), obtain user data (input), perform calculations (processing), and finally print outputs.'
  },
  {
    id: 'q3',
    questionRo: 'Dacă executăm în C++ expresia 23 / 4, ce valoare obținem (ambele fiind de tip int)?',
    questionEn: 'If we evaluate expression 23 / 4 in C++, what value is obtained (both being int)?',
    optionsRo: [
      '5.75',
      '5 (câtul împărțirii întregi)',
      '3 (restul împărțirii întregi)',
      'Eroare de compilare'
    ],
    optionsEn: [
      '5.75',
      '5 (the integer quotient)',
      '3 (the division remainder)',
      'Compilation error'
    ],
    correctIdx: 1,
    explanationRo: '23 / 4 între două numere întregi reprezintă câtul întreg: 23 = 4 * 5 + 3. Câtul este 5.',
    explanationEn: '23 / 4 between two integers calculates the integer quotient: 23 = 4 * 5 + 3. The quotient is 5.'
  },
  {
    id: 'q4',
    questionRo: 'Ce valoare returnează expresia 23 % 4 în C++?',
    questionEn: 'What value does the expression 23 % 4 return in C++?',
    optionsRo: [
      '5',
      '3 (restul împărțirii)',
      '23%',
      '0'
    ],
    optionsEn: [
      '5',
      '3 (the remainder)',
      '23%',
      '0'
    ],
    correctIdx: 1,
    explanationRo: 'Operatorul modulo (%) returnează restul împărțirii întregi. 23 împărțit la 4 dă restul 3.',
    explanationEn: 'The modulo operator (%) returns the remainder of integer division. 23 divided by 4 leaves a remainder of 3.'
  },
  {
    id: 'q5',
    questionRo: 'Ce se întâmplă dacă încercăm să inversăm două variabile folosind instrucțiunile a = b; b = a;?',
    questionEn: 'What happens if we try to swap two variables using instructions a = b; b = a;?',
    optionsRo: [
      'Variabilele își schimbă valorile fără probleme',
      'Valoarea inițială a lui a este suprascrisă și pierdută la primul pas, iar ambele variabile vor avea valoarea lui b',
      'Compilatorul C++ inversează automat variabilele în fundal',
      'Valoarea lui b devine 0'
    ],
    optionsEn: [
      'Variables swap values with no problems',
      'The initial value of a is overwritten and lost in the first step, leaving both variables holding b\'s value',
      'The C++ compiler automatically swaps variables in the background',
      'The value of b becomes 0'
    ],
    correctIdx: 1,
    explanationRo: 'La a = b, memoria lui a primește valoarea din b, ștergând ireversibil vechea valoare a lui a. Apoi b = a doar recopiază aceeași valoare a lui b.',
    explanationEn: 'With a = b, a\'s memory gets overwritten with b\'s value, permanently wiping a\'s old value. Then b = a simply copies that same value back.'
  },
  {
    id: 'q6',
    questionRo: 'Care este succesiunea corectă a instrucțiunilor pentru Regula celor 3 Pahare (folosind variabila auxiliară aux)?',
    questionEn: 'What is the correct sequence of instructions for the 3 Glasses Rule (using auxiliary variable aux)?',
    optionsRo: [
      'a = b; b = aux; aux = a;',
      'aux = a; a = b; b = aux;',
      'b = a; aux = b; a = aux;',
      'aux = b; b = aux; a = b;'
    ],
    optionsEn: [
      'a = b; b = aux; aux = a;',
      'aux = a; a = b; b = aux;',
      'b = a; aux = b; a = aux;',
      'aux = b; b = aux; a = b;'
    ],
    correctIdx: 1,
    explanationRo: 'Ordinea de aur a interschimbării: 1) Salvăm a în aux (aux = a); 2) Copiem b în a (a = b); 3) Transferăm valoarea salvată în b (b = aux).',
    explanationEn: 'The golden swap sequence: 1) Save a into aux (aux = a); 2) Copy b into a (a = b); 3) Transfer the saved value into b (b = aux).'
  }
];

export const CP2Level7_EvaluationAndCertificate: React.FC<Props> = ({ onPass, studentName = 'Elev Clasa a VII-a' }) => {
  const { lang } = useLanguage();
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const handleSelectAnswer = (qId: string, optIdx: number) => {
    if (isSubmitted) return;
    sounds.playClick();
    setUserAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitEvaluation = () => {
    sounds.playClick();
    let correctCount = 0;
    EVALUATION_QUESTIONS.forEach(q => {
      if (userAnswers[q.id] === q.correctIdx) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / EVALUATION_QUESTIONS.length) * 100);
    setScore(calculatedScore);
    setIsSubmitted(true);

    if (calculatedScore >= 70) {
      sounds.playLevelUp();
    } else {
      sounds.playError();
    }
  };

  const handleRetake = () => {
    sounds.playClick();
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };

  const handlePrintCertificate = () => {
    sounds.playClick();
    window.print();
  };

  const handleFinalFinish = () => {
    sounds.playLevelUp();
    onPass(score);
  };

  const isPassed = isSubmitted && score >= 70;
  const allAnswered = EVALUATION_QUESTIONS.every(q => userAnswers[q.id] !== undefined);

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-950 via-slate-900 to-indigo-950 border border-violet-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>
                {lang === 'ro'
                  ? 'Nivelul 7 • Evaluare Finală Misiunea 4B'
                  : 'Level 7 • Final Assessment Mission 4B'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {lang === 'ro' ? 'Test de Sinteză & ' : 'Synthesis Exam & '}
              <span className="text-violet-400 font-mono">
                {lang === 'ro' ? 'Certificare C++' : 'C++ Certification'}
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              {lang === 'ro' ? (
                <>
                  Demonstrează că stăpânești fluxurile <code className="text-indigo-300 font-mono">cin/cout</code>, structura liniară de execuție, operatorii cât &amp; rest, și celebra <strong>Regulă a celor 3 Pahare</strong>.
                </>
              ) : (
                <>
                  Demonstrate your mastery over <code className="text-indigo-300 font-mono">cin/cout</code> streams, linear instruction sequence, quotient &amp; modulo operators, and the famous <strong>3 Glasses Rule</strong>.
                </>
              )}
            </p>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto bg-slate-950/60 p-3 rounded-2xl border border-violet-500/20">
            <span className="text-xs text-slate-400 font-mono">
              {lang === 'ro' ? 'Condiție Promovare' : 'Passing Condition'}
            </span>
            <span className="text-sm font-bold text-violet-300 font-mono">
              {lang === 'ro' ? 'Minim 70% (5/6 corecte)' : 'Minimum 70% (5/6 correct)'}
            </span>
          </div>
        </div>
      </div>

      {/* Quiz Form */}
      {!isPassed ? (
        <div className="bg-slate-900/95 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="space-y-6">
            {EVALUATION_QUESTIONS.map((q, idx) => {
              const selectedOpt = userAnswers[q.id];
              const isCorrect = selectedOpt === q.correctIdx;
              const options = lang === 'ro' ? q.optionsRo : q.optionsEn;

              return (
                <div key={q.id} className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="w-6 h-6 rounded-full bg-violet-600/30 border border-violet-500/40 text-violet-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-sm sm:text-base font-bold text-white leading-snug">
                      {lang === 'ro' ? q.questionRo : q.questionEn}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 ml-0 sm:ml-9">
                    {options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      let optionStyle = 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300';

                      if (isSubmitted) {
                        if (optIdx === q.correctIdx) {
                          optionStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/20';
                        } else if (isSelected && !isCorrect) {
                          optionStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
                        } else {
                          optionStyle = 'bg-slate-950 border-slate-850 text-slate-500 opacity-60';
                        }
                      } else if (isSelected) {
                        optionStyle = 'bg-violet-950/80 border-violet-500 text-violet-200 ring-2 ring-violet-500/30';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectAnswer(q.id, optIdx)}
                          disabled={isSubmitted}
                          className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer flex items-center justify-between ${optionStyle}`}
                        >
                          <span>{opt}</span>
                          {isSubmitted && optIdx === q.correctIdx && (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                          )}
                          {isSubmitted && isSelected && !isCorrect && (
                            <X className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isSubmitted && (
                    <div className="mt-3 ml-0 sm:ml-9 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                      💡 <strong>{lang === 'ro' ? 'Explicație: ' : 'Explanation: '}</strong>
                      {lang === 'ro' ? q.explanationRo : q.explanationEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submission and Result Bar */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmitEvaluation}
                disabled={!allAnswered}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:pointer-events-none text-white font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-violet-900/30"
              >
                {lang === 'ro' ? 'Trimite Răspunsurile & Calculează Nota' : 'Submit Answers & Calculate Grade'}
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <div className="text-sm font-bold text-white">
                  {lang === 'ro' ? 'Punctaj obținut: ' : 'Score obtained: '}
                  <span className={score >= 70 ? 'text-emerald-400' : 'text-rose-400'}>{score}%</span>
                </div>
                {score < 70 && (
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer border border-slate-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{lang === 'ro' ? 'Reîncearcă Testul' : 'Retake Exam'}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* OFFICIAL CERTIFICATE SCREEN */
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl bg-slate-950 border-4 border-amber-500/60 p-8 sm:p-12 shadow-2xl text-center flex flex-col items-center">
            {/* Corner Ornamental Accents */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-400" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-400" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-400" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-400" />

            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 p-1 shadow-xl shadow-amber-500/20 mb-4 flex items-center justify-center text-slate-950">
              <Award className="w-12 h-12" />
            </div>

            <span className="text-xs uppercase tracking-widest font-mono text-amber-400 font-bold mb-1">
              {lang === 'ro'
                ? 'Ministerul Educației • Programa Școlară Națională OMEN 3393/2017 & OM 5420/2024'
                : 'Ministry of Education • National Curriculum Standards OMEN 3393/2017 & OM 5420/2024'}
            </span>
            <span className="text-xs text-slate-400 font-mono mb-4">
              {lang === 'ro'
                ? 'Platforma Educațională Interactivă Ark3do C++ Academy'
                : 'Ark3do C++ Academy Interactive Learning Platform'}
            </span>

            <h2 className="text-2xl sm:text-4xl font-serif font-black text-white tracking-wide mb-2">
              {lang === 'ro' ? 'CERTIFICAT DE ABSOLVIRE' : 'CERTIFICATE OF ACHIEVEMENT'}
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-6" />

            <p className="text-xs sm:text-sm text-slate-300 font-mono mb-2">
              {lang === 'ro'
                ? 'Se conferă cu felicitări elevului / elevei:'
                : 'Proudly awarded with honors to student:'}
            </p>
            <div className="text-xl sm:text-3xl font-extrabold text-amber-300 font-serif mb-4 px-6 py-2 border-b-2 border-amber-500/40">
              {studentName}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed mb-6">
              {lang === 'ro' ? (
                <>
                  pentru parcurgerea cu brio a <strong>Misiunii 4B: Structura Liniară, cin/cout &amp; Regula celor 3 Pahare (swap)</strong>, dobândind competențe avansate în organizarea secvențială a algoritmilor, calculul expresiilor aritmetice și manipularea celulelor de memorie RAM în limbajul C++.
                </>
              ) : (
                <>
                  for outstanding completion of <strong>Mission 4B: Linear Structure, cin/cout &amp; The 3 Glasses Rule (Swap)</strong>, acquiring practical competencies in sequential algorithm structure, arithmetic evaluation, and RAM memory manipulation in C++.
                </>
              )}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-lg mb-8 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block">
                  {lang === 'ro' ? 'Punctaj Evaluare:' : 'Exam Score:'}
                </span>
                <span className="text-emerald-400 font-bold text-sm">
                  {score}% {lang === 'ro' ? '(Excelent)' : '(Excellent)'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block">
                  {lang === 'ro' ? 'Nivel Disciplină:' : 'Curriculum Level:'}
                </span>
                <span className="text-cyan-400 font-bold text-sm">
                  {lang === 'ro' ? 'Clasa a VII-a' : '7th Grade'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-slate-500 block">
                  {lang === 'ro' ? 'Statut Certificat:' : 'Certificate Status:'}
                </span>
                <span className="text-amber-400 font-bold text-sm">
                  {lang === 'ro' ? 'Verificat & Valid' : 'Verified & Valid'}
                </span>
              </div>
            </div>

            {/* Seal & Signature Row */}
            <div className="flex items-center justify-between w-full max-w-md pt-4 border-t border-slate-800 text-xs font-mono text-slate-400">
              <div className="text-left">
                <span className="text-amber-400 font-bold block">Prof. Mentor Arky</span>
                <span>{lang === 'ro' ? 'Asistent Algoritmic AI' : 'AI Algorithmic Mentor'}</span>
              </div>
              <div className="w-12 h-12 rounded-full border border-amber-500/50 flex items-center justify-center text-[10px] text-amber-400 font-bold text-center">
                ARK3DO<br />SEAL
              </div>
              <div className="text-right">
                <span className="text-amber-400 font-bold block">
                  {lang === 'ro' ? 'Informatica & TIC' : 'Computer Science & ICT'}
                </span>
                <span>{lang === 'ro' ? 'Clasa a VII-a • C++' : '7th Grade • C++'}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={handlePrintCertificate}
              className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-mono text-xs font-bold flex items-center gap-2 border border-slate-700 cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ro' ? 'Printează / Salvează PDF' : 'Print / Save PDF'}</span>
            </button>

            <button
              type="button"
              onClick={handleFinalFinish}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer transition"
            >
              <span>
                {lang === 'ro'
                  ? 'Finalizează Misiunea 4B & Revino la Catalog'
                  : 'Complete Mission 4B & Return to Catalog'}
              </span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
