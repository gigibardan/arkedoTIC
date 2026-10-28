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

interface Props {
  onPass: (score: number) => void;
  studentName?: string;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const EVALUATION_QUESTIONS: Question[] = [
  {
    id: 'q1',
    question: 'Care este rolul fundamental al structurii de decizie (alternative) într-un algoritm C++?',
    options: [
      'Ramifică execuția programului pe căi diferite în funcție de adevărul unei condiții logice.',
      'Repetă aceleași instrucțiuni la infinit până la oprirea calculatorului.',
      'Șterge variabilele din memoria RAM pentru a elibera spațiu de stocare.',
      'Traduce codul sursă în limbaj de asamblare binar.'
    ],
    correctIndex: 0,
    explanation: 'Structura de decizie permite algoritmului să aleagă între două sau mai multe ramuri de execuție pe baza evaluării unei condiții booleene (true/false).'
  },
  {
    id: 'q2',
    question: 'Care este diferența critică dintre operatorul simplu (=) și operatorul dublu (==) în C++?',
    options: [
      '= realizează atribuirea unei valori într-o variabilă, iar == verifică egalitatea matematică.',
      'Sunt perfect identici și interschimbabili în orice linie de cod.',
      '= se folosește doar pentru texte, iar == doar pentru numere zecimale.',
      '== este folosit pentru a aduna două numere întregi.'
    ],
    correctIndex: 0,
    explanation: 'În C++, operatorul = este operator de atribuire (stochează date), în timp ce == este operator relațional de testare a egalității.'
  },
  {
    id: 'q3',
    question: 'Ce operator logic returnează true dacă cel puțin una dintre condiții este adevărată?',
    options: [
      '|| (SAU logic / disjuncție)',
      '&& (ȘI logic / conjuncție)',
      '! (Negație logică / NOT)',
      '== (Egalitate relațională)'
    ],
    correctIndex: 0,
    explanation: 'Operatorul || returnează adevărat dacă oricare dintre condițiile comparate este adevărată.'
  },
  {
    id: 'q4',
    question: 'Care este instrucțiunea corectă pentru a verifica dacă un număr natural n este par?',
    options: [
      'if (n % 2 == 0)',
      'if (n / 2 == 0)',
      'if (n % 2 = 0)',
      'if (n * 2 == 0)'
    ],
    correctIndex: 0,
    explanation: 'Un număr este par dacă restul împărțirii sale la 2 este 0 (n % 2 == 0).'
  },
  {
    id: 'q5',
    question: 'Conform manualului Art Klett, trei numere a, b, c pot forma un triunghi dacă:',
    options: [
      'a + b > c && a + c > b && b + c > a (suma oricăror două laturi este strict mai mare decât a treia).',
      'a + b + c == 180 (suma laturilor este 180).',
      'a == b && b == c (toate laturile sunt obligatoriu egale).',
      'a * b > c || a * c > b (produsul laturilor este pozitiv).'
    ],
    correctIndex: 0,
    explanation: 'Inegalitatea triunghiului impune ca suma oricăror două laturi să fie strict mai mare decât lungimea celei de-a treia laturi.'
  },
  {
    id: 'q6',
    question: 'Este clauza „else” obligatorie la orice instrucțiune „if” în limbajul C++?',
    options: [
      'Nu! Clauza else este complet opțională; se folosește doar când avem instrucțiuni de executat și pe caz de fals.',
      'Da, lipsa lui else generează eroare fatală de compilare.',
      'Da, doar dacă numărul de instrucțiuni depășește 10 rânduri.',
      'Nu, dar numai dacă programul conține și instrucțiunea return 0.'
    ],
    correctIndex: 0,
    explanation: 'În C++, clauza else este opțională. Putem avea structuri alternative simple: if (conditie) { ... } fără ramură de else.'
  }
];

export const DecLevel7_EvaluationAndCertificate: React.FC<Props> = ({
  onPass,
  studentName = 'Elev Programator'
}) => {
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

    if (isCorrect) {
      sounds.playSuccess();
      setScore(s => s + Math.round(100 / EVALUATION_QUESTIONS.length));
      setFeedback({
        isCorrect: true,
        text: `Excelent! ${currentQ.explanation}`
      });
    } else {
      sounds.playError();
      setFeedback({
        isCorrect: false,
        text: `Răspuns incorect. ${currentQ.explanation}`
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
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-orange-950/60 p-5 sm:p-6 rounded-3xl border-2 border-amber-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold tracking-wider uppercase">
              Nivelul 7 din 7 • Evaluare &amp; Certificare
            </span>
            <span className="text-xs text-slate-400 font-mono">Curriculum Național OMEN 3393/2017 &amp; OM 5420/2024</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center gap-2.5">
            <Award className="w-6 h-6 text-amber-400" />
            <span>Evaluare Finală: Structura Alternativă &amp; Operatori Logici</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Răspunde corect la cele 6 întrebări oficiale pentru a valida cunoștințele din Modulul 4C și a primi Diploma Digitală Oficială!
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400">Progres Examen:</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-amber-400">
            {isExamCompleted ? '100%' : `${currentQIndex + 1} / ${EVALUATION_QUESTIONS.length}`}
          </span>
        </div>
      </div>

      {/* Quiz Screen or Diploma Screen */}
      {!isExamCompleted ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs font-mono">
                {currentQIndex + 1}
              </span>
              <h3 className="text-base font-bold text-white">
                Întrebarea {currentQIndex + 1} din {EVALUATION_QUESTIONS.length}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Notare conform baremului Art Klett
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-sans text-sm sm:text-base text-white font-semibold leading-relaxed">
            {currentQ.question}
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {currentQ.options.map((opt, idx) => {
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
                  <div className="text-xs sm:text-sm leading-relaxed">
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
                <span className="text-xs sm:text-sm font-medium leading-relaxed">
                  {feedback.text}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md"
              >
                <span>
                  {currentQIndex + 1 === EVALUATION_QUESTIONS.length
                    ? 'Vezi Diploma & Certificatul Oficial'
                    : 'Următoarea Întrebare'}
                </span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Printable Official Certificate */
        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-b from-slate-900 to-amber-950/30 border-4 border-amber-500/60 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center print:border-black print:bg-white print:text-black">
            {/* Watermark Logo */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-9xl">
              🔀
            </div>

            {/* Header / Republica Romania / Minister */}
            <div className="border-b-2 border-amber-500/30 pb-6 mb-6">
              <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold mb-1">
                MINISTERUL EDUCAȚIEI &bull; ROMÂNIA
              </div>
              <div className="text-xs font-serif text-slate-400 uppercase tracking-wider mb-2">
                Conform Programei Școlare Naționale OMEN 3393/2017 &amp; OM 5420/2024 &bull; Manual Art Klett
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-black text-white tracking-wide uppercase">
                CERTIFICAT DE COMPETENȚĂ DIGITALĂ
              </h1>
              <div className="text-sm font-mono text-amber-400 font-bold mt-1">
                DISCIPLINA: INFORMATICĂ ȘI TIC &bull; CLASA A VII-A
              </div>
            </div>

            {/* Recipient */}
            <div className="my-6 space-y-2">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-mono">
                Se acordă cu distincție elevului / programatorului:
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-300 underline underline-offset-8 decoration-amber-500/50">
                {studentName}
              </div>
              <div className="text-xs text-slate-300 max-w-xl mx-auto pt-2 leading-relaxed">
                Pentru absolvirea cu succes a probei de evaluare practică și teoretică a Modulului 4C:
                <br />
                <strong className="text-white">
                  &bdquo;Structura Alternativă: Instrucțiunea if / else &amp; Operatori Logici în C++&rdquo;
                </strong>
              </div>
            </div>

            {/* Competencies Acquired List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6 text-left text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300">
                <div className="text-emerald-400 font-bold mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Competența 2.1
                </div>
                Analiza condițiilor booleene și ramificarea algoritmilor cu decizii if/else.
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300">
                <div className="text-cyan-400 font-bold mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Competența 2.2
                </div>
                Utilizarea operatorilor logici compuși (&amp;&amp;, ||, !) și relaționali (==, !=, &lt;=, &gt;=).
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300">
                <div className="text-amber-400 font-bold mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Algoritmi Clasici
                </div>
                Rezolvarea problemelor de paritate (n % 2 == 0), maxim/minim și inegalitatea triunghiului.
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t-2 border-amber-500/30 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full border-2 border-amber-500/60 bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-lg shadow-inner">
                  🛡️
                </div>
                <div className="text-left">
                  <div className="text-white font-bold">Sigiliu Digital Ark3do</div>
                  <div className="text-[10px]">ID: CERT-G7-DEC-{Date.now().toString().slice(-6)}</div>
                  <div className="text-[10px] text-emerald-400">Validat &bull; Nota 10 (Zece)</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Data emiterii: {new Date().toLocaleDateString('ro-RO')}</span>
              </div>

              <div className="text-center sm:text-right">
                <div className="font-serif italic text-white text-sm">Arky &bull; Asistent Inteligent TIC</div>
                <div className="text-[10px] text-slate-500">Semnătură Criptografică Oficială</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={handlePrint}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimă / Salvează Certificatul ca PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
