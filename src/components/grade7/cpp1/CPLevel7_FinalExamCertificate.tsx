import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Printer,
  RotateCcw
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  onPass: (score: number) => void;
  studentName?: string;
}

interface Question {
  id: number;
  questionRo: string;
  questionEn: string;
  optionsRo: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationRo: string;
  explanationEn: string;
}

const EXAM_QUESTIONS: Question[] = [
  {
    id: 1,
    questionRo: 'Care este directiva obligatorie pentru a include biblioteca de intrare/ieșire (cin/cout)?',
    questionEn: 'Which preprocessor directive is mandatory to include the standard I/O library (cin/cout)?',
    optionsRo: [
      '#include <iostream>',
      '#import <math.h>',
      'include studio.h',
      '#library <scratch>'
    ],
    optionsEn: [
      '#include <iostream>',
      '#import <math.h>',
      'include studio.h',
      '#library <scratch>'
    ],
    correctIndex: 0,
    explanationRo: '#include <iostream> (input-output stream) este directiva de preprocesor esențială pentru operațiile de consolă în C++.',
    explanationEn: '#include <iostream> (input-output stream) is the vital preprocessor directive for console operations in C++.'
  },
  {
    id: 2,
    questionRo: 'Unde începe execuția oricărui program scris în C++?',
    questionEn: 'Where does the execution of any C++ program begin?',
    optionsRo: [
      'În funcția specială main()',
      'La prima linie de comentarii',
      'În fișierul iostream.exe',
      'Direct în compilatorul GCC'
    ],
    optionsEn: [
      'Inside the special main() function',
      'At the first comment line',
      'Inside the iostream.exe file',
      'Directly inside the GCC compiler'
    ],
    correctIndex: 0,
    explanationRo: 'Execuția începe întotdeauna de la prima instrucțiune din corpul funcției principale int main().',
    explanationEn: 'Execution always starts from the first statement inside the body of the int main() function.'
  },
  {
    id: 3,
    questionRo: 'Ce caracter este obligatoriu la finalul fiecărei instrucțiuni simple în C++?',
    questionEn: 'What character is mandatory at the end of each simple statement in C++?',
    optionsRo: [
      'Punct și virgulă (;)',
      'Două puncte (:)',
      'Punct simplu (.)',
      'Semnul exclamării (!)'
    ],
    optionsEn: [
      'Semicolon (;)',
      'Colon (:)',
      'Period (.)',
      'Exclamation mark (!)'
    ],
    correctIndex: 0,
    explanationRo: 'Punctul și virgula (;) este terminatorul obligatoriu de instrucțiune. Lipsa lui provoacă eroarea clasică de compilare.',
    explanationEn: 'The semicolon (;) is the mandatory statement terminator in C++. Omitting it triggers a syntax compiler error.'
  },
  {
    id: 4,
    questionRo: 'Care dintre următoarele nume de variabilă este un IDENTIFICATOR VALID în C++?',
    questionEn: 'Which of the following variable names is a VALID C++ IDENTIFIER?',
    optionsRo: [
      'nota_10',
      '10_nota',
      'nota elev',
      'return'
    ],
    optionsEn: [
      'nota_10',
      '10_nota',
      'nota elev',
      'return'
    ],
    correctIndex: 0,
    explanationRo: 'nota_10 este valid (conține litere, underscore și cifre, fără să înceapă cu o cifră și fără spații).',
    explanationEn: 'nota_10 is valid (contains letters, underscore, digits, does not start with digit, contains no spaces).'
  },
  {
    id: 5,
    questionRo: 'Ce tip de date fundamental este cel mai potrivit pentru a stoca media generală (ex: 9.75)?',
    questionEn: 'Which primitive data type is most appropriate to store a student GPA (e.g. 9.75)?',
    optionsRo: [
      'double (sau float)',
      'int',
      'char',
      'bool'
    ],
    optionsEn: [
      'double (or float)',
      'int',
      'char',
      'bool'
    ],
    correctIndex: 0,
    explanationRo: 'double reprezintă numere reale cu zecimale cu virgulă mobilă de dublă precizie.',
    explanationEn: 'double represents double-precision 64-bit floating point real numbers with decimal fractions.'
  },
  {
    id: 6,
    questionRo: 'Ce tastă rapidă din Code::Blocks construiește și rulează programul (Build and Run)?',
    questionEn: 'Which keyboard shortcut in Code::Blocks builds and runs the project (Build and Run)?',
    optionsRo: [
      'Tasta F9',
      'Tasta F1',
      'Tasta F5',
      'Ctrl + P'
    ],
    optionsEn: [
      'F9 Key',
      'F1 Key',
      'F5 Key',
      'Ctrl + P'
    ],
    correctIndex: 0,
    explanationRo: 'F9 este comanda rapidă esențială din Code::Blocks pentru compilare, link-editare și lansare în consolă.',
    explanationEn: 'F9 is the standard Code::Blocks keyboard shortcut for compilation, linking, and terminal launching.'
  }
];

export const CPLevel7_FinalExamCertificate: React.FC<Props> = ({ onPass, studentName }) => {
  const { lang } = useLanguage();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  const displayName = studentName || localStorage.getItem('arkedo_student_name') || (lang === 'ro' ? 'Elev Clasa a VII-a' : 'Grade 7 Student');
  const currentDate = new Date().toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-US', { day: '2-digit', month: 'long', year: 'numeric' });

  const handleSelectAnswer = (qId: number, optIdx: number) => {
    if (submitted) return;
    sounds.playClick();
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    EXAM_QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correctIndex) correct++;
    });
    return correct;
  };

  const handleSubmitExam = () => {
    const correct = calculateScore();
    setSubmitted(true);
    if (correct >= 5) {
      sounds.playVictory();
      setShowCertificate(true);
    } else {
      sounds.playWrong();
    }
  };

  const handleRetake = () => {
    sounds.playClick();
    setAnswers({});
    setSubmitted(false);
    setShowCertificate(false);
  };

  const correctCount = calculateScore();
  const percentage = Math.round((correctCount / EXAM_QUESTIONS.length) * 100);

  const handlePrintCertificate = () => {
    window.print();
  };

  const handleCompleteMission = () => {
    sounds.playVictory();
    onPass(100);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl flex flex-col gap-6">
      {/* Level Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-500 flex items-center justify-center text-white shadow-lg text-2xl font-black">
            7
          </div>
          <div>
            <div className="text-[11px] font-mono font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>
                {lang === 'ro'
                  ? 'Evaluare Formativă • Manual Art Klett pag. 64–73'
                  : 'Formative Assessment • Art Klett Textbook pp. 64–73'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              {lang === 'ro'
                ? 'Examenul de Calificare TIC: C++ Junior Programmer'
                : 'ICT Qualification Exam: C++ Junior Programmer'}
            </h2>
          </div>
        </div>

        <div className="text-xs font-mono text-cyan-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          {lang === 'ro'
            ? `Răspunsuri: ${Object.keys(answers).length} / ${EXAM_QUESTIONS.length}`
            : `Answered: ${Object.keys(answers).length} / ${EXAM_QUESTIONS.length}`}
        </div>
      </div>

      {!showCertificate ? (
        <div className="flex flex-col gap-6">
          <p className="text-xs sm:text-sm text-slate-300">
            {lang === 'ro' ? (
              <>
                Răspunde la cele 6 întrebări din programa oficială. Obține minim 5 răspunsuri corecte pentru a debloca <strong>Certificatul Oficial C++ Junior Developer</strong>!
              </>
            ) : (
              <>
                Answer the 6 curriculum exam questions. Score at least 5 correct answers to unlock your <strong>Official C++ Junior Developer Certificate</strong>!
              </>
            )}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EXAM_QUESTIONS.map((q, idx) => {
              const selectedOpt = answers[q.id];
              const isCorrect = selectedOpt === q.correctIndex;
              const questionText = lang === 'ro' ? q.questionRo : q.questionEn;
              const options = lang === 'ro' ? q.optionsRo : q.optionsEn;
              const explanation = lang === 'ro' ? q.explanationRo : q.explanationEn;

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 ${
                    submitted
                      ? isCorrect
                        ? 'bg-slate-950/80 border-emerald-500/50'
                        : 'bg-slate-950/80 border-rose-500/50'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="text-xs font-mono font-bold text-violet-400 mb-1 flex items-center justify-between">
                      <span>{lang === 'ro' ? `ÎNTREBAREA ${idx + 1}` : `QUESTION ${idx + 1}`}</span>
                      {submitted && (
                        <span>
                          {isCorrect ? (
                            <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Corect' : 'Correct'}
                            </span>
                          ) : (
                            <span className="text-rose-400 flex items-center gap-1 text-[11px]">
                              <XCircle className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Greșit' : 'Incorrect'}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-200 mb-3">
                      {questionText}
                    </p>

                    <div className="space-y-1.5">
                      {options.map((opt, optIdx) => {
                        const isChosen = selectedOpt === optIdx;
                        const isThisCorrect = optIdx === q.correctIndex;

                        return (
                          <button
                            key={optIdx}
                            disabled={submitted}
                            onClick={() => handleSelectAnswer(q.id, optIdx)}
                            className={`w-full text-left p-2.5 rounded-xl border text-xs font-mono transition flex items-center justify-between cursor-pointer ${
                              submitted
                                ? isThisCorrect
                                  ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300 font-bold'
                                  : isChosen
                                  ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                                  : 'bg-slate-900 border-slate-800 text-slate-500'
                                : isChosen
                                ? 'bg-violet-600 text-white border-violet-400 font-bold'
                                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <span>{opt}</span>
                            {isChosen && !submitted && (
                              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {submitted && (
                    <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-900 font-sans leading-snug">
                      {explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
            {!submitted ? (
              <button
                disabled={Object.keys(answers).length < EXAM_QUESTIONS.length}
                onClick={handleSubmitExam}
                className="w-full sm:w-auto ml-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 text-white font-bold font-heading text-sm shadow-lg shadow-violet-600/30 disabled:opacity-50 transition cursor-pointer"
              >
                {lang === 'ro' ? 'Trimite Răspunsurile & Evaluează' : 'Submit Answers & Evaluate'}
              </button>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3 w-full">
                <div className="text-sm font-bold text-slate-200">
                  {lang === 'ro' ? 'Scor obținut: ' : 'Score earned: '}
                  <span className="text-violet-400 font-mono">{correctCount} / {EXAM_QUESTIONS.length} ({percentage}%)</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRetake}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{lang === 'ro' ? 'Reia Testul' : 'Retake Exam'}</span>
                  </button>

                  {correctCount >= 5 && (
                    <button
                      onClick={() => setShowCertificate(true)}
                      className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
                    >
                      <Award className="w-4 h-4" />
                      <span>{lang === 'ro' ? 'Vezi Certificatul' : 'View Certificate'}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* The Official Digital Certificate */
        <div className="flex flex-col gap-6 animate-fadeIn">
          <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950/60 border-4 border-amber-500/60 shadow-2xl relative overflow-hidden flex flex-col items-center text-center gap-6">
            {/* Certificate Header Emblem */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-orange-500 p-1 shadow-2xl shadow-amber-500/30 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-4xl">
                ⚙️
              </div>
            </div>

            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                {lang === 'ro'
                  ? 'MINISTERUL EDUCAȚIEI • PROGRAMA NAȚIONALĂ TIC (OMEN 3393/2017)'
                  : 'MINISTRY OF EDUCATION • NATIONAL CURRICULUM ACCREDITATION'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-heading mt-2">
                {lang === 'ro' ? 'CERTIFICAT DE ABSOLVIRE' : 'CERTIFICATE OF ACHIEVEMENT'}
              </h2>
              <div className="text-sm sm:text-base font-bold text-violet-300 mt-1">
                {lang === 'ro'
                  ? 'Modulul 4A: Tranziția la C++ & Mediul Code::Blocks'
                  : 'Module 4A: Transition to C++ & Code::Blocks IDE'}
              </div>
            </div>

            <div className="max-w-xl text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lang === 'ro' ? (
                <>
                  Se conferă prezentul certificat elevului:
                  <div className="text-xl sm:text-3xl font-black text-white font-heading my-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-amber-200">
                    {displayName}
                  </div>
                  pentru asimilarea impecabilă a noțiunilor fundamentale de programare C++, a anatomiei mediului Code::Blocks, a compilării și a tipurilor de date primitive.
                </>
              ) : (
                <>
                  This certificate is awarded to student:
                  <div className="text-xl sm:text-3xl font-black text-white font-heading my-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-amber-200">
                    {displayName}
                  </div>
                  for demonstrating exceptional mastery of C++ core syntax, Code::Blocks IDE anatomy, compilation mechanics, and fundamental data types.
                </>
              )}
            </div>

            {/* Certificate Meta Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-lg pt-4 border-t border-slate-800 text-xs font-mono">
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">
                  {lang === 'ro' ? 'Calificativ' : 'Grade'}
                </div>
                <div className="font-bold text-emerald-400 text-sm">
                  {lang === 'ro' ? 'FOARTE BINE (10)' : 'EXCELLENT (100%)'}
                </div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">
                  {lang === 'ro' ? 'Data Emiterii' : 'Issue Date'}
                </div>
                <div className="font-bold text-slate-300">{currentDate}</div>
              </div>
              <div className="col-span-2 sm:col-span-1 p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">
                  {lang === 'ro' ? 'Verificare' : 'Verification'}
                </div>
                <div className="font-bold text-cyan-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> ID-C++2026
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrintCertificate}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ro' ? 'Tipărește / Salvează PDF' : 'Print / Save PDF'}</span>
            </button>

            <button
              onClick={handleCompleteMission}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-black font-heading text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
            >
              <Award className="w-4 h-4" />
              <span>
                {lang === 'ro'
                  ? 'Finalizează Misiunea 4A & Înregistrează Nota 10'
                  : 'Complete Unit 4A & Record Grade 10'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
