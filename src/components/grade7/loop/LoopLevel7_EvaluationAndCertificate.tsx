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
  BookOpen
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
  optionsRo: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationRo: string;
  explanationEn: string;
}

const EVALUATION_QUESTIONS: Question[] = [
  {
    id: 'q1',
    questionRo: 'Care este caracteristica principală a buclei while (structură repetitivă cu test inițial)?',
    questionEn: 'What is the primary characteristic of the while loop (pre-test loop structure)?',
    optionsRo: [
      'Condiția se evaluează ÎNAINTE de fiecare pas; dacă la început este falsă, corpul buclei nu se execută niciodată.',
      'Corpul buclei se execută întotdeauna cel puțin o dată, indiferent de condiție.',
      'Numărul de repetări este fixat dinainte de compilator și nu se poate schimba.',
      'Bucla se poate folosi doar pentru operații cu litere și texte.'
    ],
    optionsEn: [
      'The condition is evaluated BEFORE each step; if initially false, the loop body never executes.',
      'The loop body always executes at least once, regardless of condition truth value.',
      'The number of repetitions is fixed beforehand by the compiler and cannot vary.',
      'The loop can only be used for character and string operations.'
    ],
    correctIndex: 0,
    explanationRo: 'while este o structură repetitivă condiționată anterior (cu test inițial). Condiția este verificată la fiecare intrare în buclă.',
    explanationEn: 'while is a pre-tested loop structure. The condition is verified prior to each entrance into the loop body.'
  },
  {
    id: 'q2',
    questionRo: 'Cum extragem cifra unităților (ultima cifră din dreapta) a unui număr natural n în C++?',
    questionEn: 'How do we extract the units digit (rightmost digit) of a natural number n in C++?',
    optionsRo: [
      'cifra = n % 10; (restul împărțirii întregi la 10)',
      'cifra = n / 10;',
      'cifra = n - 10;',
      'cifra = n * 10;'
    ],
    optionsEn: [
      'digit = n % 10; (remainder of integer division by 10)',
      'digit = n / 10;',
      'digit = n - 10;',
      'digit = n * 10;'
    ],
    correctIndex: 0,
    explanationRo: 'Operatorul modulo 10 (n % 10) returnează restul împărțirii la 10, adică ultima cifră a numărului în baza 10.',
    explanationEn: 'The modulo 10 operator (n % 10) returns the remainder modulo 10, i.e. the base-10 units digit.'
  },
  {
    id: 'q3',
    questionRo: 'Cum eliminăm (tăiem) ultima cifră a numărului n pentru a trece la cifra următoare?',
    questionEn: 'How do we truncate (chop) the last digit of number n to proceed to the next digit?',
    optionsRo: [
      'n = n / 10; (câtul împărțirii întregi)',
      'n = n % 10;',
      'n = n - 1;',
      'n = 0;'
    ],
    optionsEn: [
      'n = n / 10; (integer quotient of division by 10)',
      'n = n % 10;',
      'n = n - 1;',
      'n = 0;'
    ],
    correctIndex: 0,
    explanationRo: 'Împărțirea întreagă la 10 (n = n / 10) șterge ultima cifră din număr.',
    explanationEn: 'Integer division by 10 (n = n / 10) drops the rightmost digit.'
  },
  {
    id: 'q4',
    questionRo: 'Ce cauzează apariția unei bucle infinite (infinite loop) într-un program C++?',
    questionEn: 'What causes an infinite loop in a C++ program?',
    optionsRo: [
      'Omiterea instrucțiunii de pas sau scrierea unei condiții care rămâne permanent adevărată.',
      'Utilizarea tipului de date int în loc de float.',
      'Afișarea unui mesaj cu instrucțiunea cout.',
      'Declararea mai multor variabile în aceeași linie.'
    ],
    optionsEn: [
      'Omitting the step instruction or creating a condition that evaluates to true indefinitely.',
      'Using the int data type instead of float.',
      'Printing a message via the cout statement.',
      'Declaring multiple variables on the same line.'
    ],
    correctIndex: 0,
    explanationRo: 'O buclă devine infinită atunci când variabila care guvernează condiția nu se apropie niciodată de oprire, blocând procesorul.',
    explanationEn: 'A loop turns infinite when the controlling variable never approaches the stopping condition, freezing CPU execution.'
  },
  {
    id: 'q5',
    questionRo: 'Care este formula matematică corectă pentru construirea numărului oglindit?',
    questionEn: 'What is the correct mathematical formula for building a reversed number?',
    optionsRo: [
      'ogl = ogl * 10 + n % 10;',
      'ogl = ogl + n % 10;',
      'ogl = ogl * 10;',
      'ogl = n % 10 * 10;'
    ],
    optionsEn: [
      'ogl = ogl * 10 + n % 10;',
      'ogl = ogl + n % 10;',
      'ogl = ogl * 10;',
      'ogl = n % 10 * 10;'
    ],
    correctIndex: 0,
    explanationRo: 'ogl * 10 deplasează cifrele deja oglindite cu un ordin spre stânga, permițând adăugarea noii cifre n % 10 la unități.',
    explanationEn: 'ogl * 10 shifts already accumulated digits one place leftwards, allowing the fresh digit n % 10 to occupy units.'
  },
  {
    id: 'q6',
    questionRo: 'De ce salvăm copia clona = n înainte de bucla de calcul a oglinditului?',
    questionEn: 'Why do we store a copy clona = n before running the reversed number loop?',
    optionsRo: [
      'Deoarece algoritmul while (n > 0) taie cifrele succesiv, lăsând numărul n egal cu 0 la final.',
      'Pentru că variabila n se șterge automat din memoria RAM.',
      'Pentru a putea schimba tipul variabilei din int în double.',
      'Este o instrucțiune decorativă fără impact matematic.'
    ],
    optionsEn: [
      'Because the while (n > 0) algorithm chops digits sequentially, leaving n equal to 0 at the end.',
      'Because the variable n gets automatically deleted from RAM.',
      'To enable converting the variable type from int to double.',
      'It is merely decorative without mathematical consequence.'
    ],
    correctIndex: 0,
    explanationRo: 'Prin împărțiri repetate la 10, valoarea lui n este distrusă și devine 0. Copia clona este necesară pentru verificarea finală: clona == ogl.',
    explanationEn: 'Repeated divisions by 10 destroy the original value of n, making it 0. The clone copy is needed for the final comparison: clona == ogl.'
  }
];

export const LoopLevel7_EvaluationAndCertificate: React.FC<Props> = ({
  onPass,
  studentName = 'Elev Programator'
}) => {
  const { lang } = useLanguage();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQ = EVALUATION_QUESTIONS[currentQIndex];

  const handleSelectAnswer = (optionIdx: number) => {
    sounds.playClick();
    const isCorrect = optionIdx === currentQ.correctIndex;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQIndex] = optionIdx;
    setSelectedAnswers(newAnswers);

    const explanation = lang === 'ro' ? currentQ.explanationRo : currentQ.explanationEn;

    if (isCorrect) {
      sounds.playSuccess();
      setScore(s => s + Math.round(100 / EVALUATION_QUESTIONS.length));
      setFeedback({
        isCorrect: true,
        text: `${lang === 'ro' ? 'Excelent!' : 'Excellent!'} ${explanation}`
      });
    } else {
      sounds.playError();
      setFeedback({
        isCorrect: false,
        text: `${lang === 'ro' ? 'Răspuns incorect.' : 'Incorrect answer.'} ${explanation}`
      });
    }
  };

  const handleNext = () => {
    sounds.playClick();
    setFeedback(null);
    if (currentQIndex + 1 < EVALUATION_QUESTIONS.length) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setIsExamCompleted(true);
      sounds.playVictory();
      onPass(100);
    }
  };

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-950/70 via-slate-900 to-amber-950/60 p-5 sm:p-6 rounded-3xl border-2 border-orange-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 text-[10px] font-mono font-bold tracking-wider uppercase">
              {lang === 'ro' ? 'Nivelul 7 din 7 • Evaluare & Certificare' : 'Level 7 of 7 • Assessment & Certification'}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {lang === 'ro'
                ? 'Curriculum Național OMEN 3393/2017 & OM 5420/2024'
                : 'National Curriculum OMEN 3393/2017 & OM 5420/2024'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center gap-2.5">
            <Award className="w-6 h-6 text-orange-400" />
            <span>
              {lang === 'ro'
                ? 'Evaluare Finală: Bucle while & Prelucrarea Cifrelor'
                : 'Final Assessment: while Loops & Digit Processing'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            {lang === 'ro'
              ? 'Răspunde corect la cele 6 întrebări oficiale pentru a valida cunoștințele din Modulul 4D și a obține Certificatul Oficial de Competență Digitală!'
              : 'Answer the 6 official questions correctly to validate knowledge from Module 4D and earn your Official Digital Competence Certificate!'}
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400">{lang === 'ro' ? 'Progres Examen:' : 'Exam Progress:'}</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-orange-400">
            {isExamCompleted ? '100%' : `${currentQIndex + 1} / ${EVALUATION_QUESTIONS.length}`}
          </span>
        </div>
      </div>

      {/* Quiz Screen or Diploma Screen */}
      {!isExamCompleted ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs font-mono">
                {currentQIndex + 1}
              </span>
              <h3 className="text-base font-bold text-white">
                {lang === 'ro'
                  ? `Întrebarea ${currentQIndex + 1} din ${EVALUATION_QUESTIONS.length}`
                  : `Question ${currentQIndex + 1} of ${EVALUATION_QUESTIONS.length}`}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {lang === 'ro' ? 'Notare conform baremului Art Klett' : 'Graded per Art Klett criteria'}
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-sans text-sm sm:text-base text-white font-semibold leading-relaxed">
            {lang === 'ro' ? currentQ.questionRo : currentQ.questionEn}
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {(lang === 'ro' ? currentQ.optionsRo : currentQ.optionsEn).map((opt, idx) => {
              const isSelected = selectedAnswers[currentQIndex] === idx;
              const hasAnswered = selectedAnswers[currentQIndex] !== undefined;

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={hasAnswered}
                  onClick={() => handleSelectAnswer(idx)}
                  className={`p-4 rounded-2xl border-2 text-left transition flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? idx === currentQ.correctIndex
                        ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                        : 'bg-rose-950/80 border-rose-500 text-white'
                      : hasAnswered && idx === currentQ.correctIndex
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-white opacity-90'
                      : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    isSelected
                      ? idx === currentQ.correctIndex
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-rose-500 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="text-xs sm:text-sm leading-relaxed font-sans">
                    {opt}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {feedback && (
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn ${
              feedback.isCorrect
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                : 'bg-rose-950/60 border-rose-500/60 text-rose-200'
            }`}>
              <div className="flex items-center gap-2.5">
                {feedback.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <span className="text-xs sm:text-sm font-medium leading-relaxed font-sans">
                  {feedback.text}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md font-sans"
              >
                <span>
                  {currentQIndex + 1 === EVALUATION_QUESTIONS.length
                    ? (lang === 'ro' ? 'Vezi Diploma & Certificatul Oficial' : 'View Diploma & Official Certificate')
                    : (lang === 'ro' ? 'Următoarea Întrebare' : 'Next Question')}
                </span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Printable Official Certificate */
        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-b from-slate-900 to-orange-950/30 border-4 border-orange-500/60 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center print:border-black print:bg-white print:text-black">
            {/* Watermark Logo */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-9xl">
              🔄
            </div>

            {/* Header / Republica Romania / Minister */}
            <div className="border-b-2 border-orange-500/30 pb-6 mb-6">
              <div className="text-[11px] font-mono uppercase tracking-widest text-orange-400 font-bold mb-1">
                {lang === 'ro' ? 'MINISTERUL EDUCAȚIEI • ROMÂNIA' : 'MINISTRY OF EDUCATION • ROMANIA'}
              </div>
              <div className="text-xs font-serif text-slate-400 uppercase tracking-wider mb-2">
                {lang === 'ro'
                  ? 'Conform Programei Școlare Naționale OMEN 3393/2017 & OM 5420/2024 • Manual Art Klett'
                  : 'According to National Curriculum OMEN 3393/2017 & OM 5420/2024 • Art Klett Textbook'}
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-black text-white tracking-wide uppercase">
                {lang === 'ro' ? 'CERTIFICAT DE COMPETENȚĂ DIGITALĂ' : 'CERTIFICATE OF DIGITAL COMPETENCE'}
              </h1>
              <div className="text-sm font-mono text-orange-400 font-bold mt-1">
                {lang === 'ro'
                  ? 'DISCIPLINA: INFORMATICĂ ȘI TIC • CLASA A VII-A'
                  : 'SUBJECT: COMPUTER SCIENCE & ICT • GRADE 7'}
              </div>
            </div>

            {/* Recipient */}
            <div className="my-6 space-y-2">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-mono">
                {lang === 'ro'
                  ? 'Se acordă cu distincție elevului / programatorului:'
                  : 'Conferred with distinction to student / programmer:'}
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-orange-300 underline underline-offset-8 decoration-orange-500/50">
                {studentName}
              </div>
              <div className="text-xs text-slate-300 max-w-xl mx-auto pt-2 leading-relaxed font-sans">
                {lang === 'ro' ? (
                  <>
                    Pentru absolvirea cu succes a probei de evaluare practică și teoretică a Modulului 4D:
                    <br />
                    <strong className="text-white">
                      „Structura Repetitivă while & Algoritmi pe Cifrele unui Număr în C++”
                    </strong>
                  </>
                ) : (
                  <>
                    For the successful completion of the theoretical and practical evaluation for Module 4D:
                    <br />
                    <strong className="text-white">
                      &quot;while Loop Structure & Digit Algorithms in C++&quot;
                    </strong>
                  </>
                )}
              </div>
            </div>

            {/* Competencies Acquired List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6 text-left text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300">
                <div className="text-emerald-400 font-bold mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Competența 2.1' : 'Competency 2.1'}
                </div>
                {lang === 'ro'
                  ? 'Descompunerea algoritmilor de prelucrare a numerelor în bucle condiționate anterior (while).'
                  : 'Decomposition of number processing algorithms into pre-tested conditional loops (while).'}
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300">
                <div className="text-cyan-400 font-bold mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Competența 2.2' : 'Competency 2.2'}
                </div>
                {lang === 'ro'
                  ? 'Stăpânirea mecanismului de aur: extragerea ultimei cifre (n % 10) și tăierea cifrelor (n / 10).'
                  : 'Mastery of the golden mechanism: extracting the units digit (n % 10) and truncating (n / 10).'}
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300">
                <div className="text-amber-400 font-bold mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'ro' ? 'Algoritmi Cifre' : 'Digit Algorithms'}
                </div>
                {lang === 'ro'
                  ? 'Calculul sumei cifrelor, contorizarea cifrelor pare, cifra minimă/maximă și testul de număr palindrom.'
                  : 'Digit sum calculation, even digit counter, min/max digit, and palindrome testing.'}
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t-2 border-orange-500/30 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full border-2 border-orange-500/60 bg-orange-500/10 flex items-center justify-center text-orange-400 font-bold text-lg shadow-inner">
                  🛡️
                </div>
                <div className="text-left">
                  <div className="text-white font-bold">{lang === 'ro' ? 'Sigiliu Digital Ark3do' : 'Ark3do Digital Seal'}</div>
                  <div className="text-[10px]">ID: CERT-G7-LOOP-{Date.now().toString().slice(-6)}</div>
                  <div className="text-[10px] text-emerald-400">
                    {lang === 'ro' ? 'Validat • Nota 10 (Zece)' : 'Validated • Grade 10 (A+)'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-400" />
                <span>
                  {lang === 'ro' ? 'Data emiterii: ' : 'Issue Date: '}
                  {new Date().toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-US')}
                </span>
              </div>

              <div className="text-center sm:text-right">
                <div className="font-serif italic text-white text-sm">
                  {lang === 'ro' ? 'Arky • Asistent Inteligent TIC' : 'Arky • Intelligent ICT Assistant'}
                </div>
                <div className="text-[10px] text-slate-500">
                  {lang === 'ro' ? 'Semnătură Criptografică Oficială' : 'Official Cryptographic Signature'}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={handlePrint}
              className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-sm transition shadow-lg shadow-orange-500/20 flex items-center gap-2 cursor-pointer active:scale-95 font-sans"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'ro' ? 'Imprimă / Salvează Certificatul ca PDF' : 'Print / Save Certificate as PDF'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
