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
  Scale
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface A2Level7Props {
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
    title: 'Structura if-else & Acoladele de Bloc',
    questionText:
      'Dacă pe ramura `if (cond)` dorim să executăm două sau mai multe instrucțiuni consecutive (de exemplu atribuirea unei valori și afișarea unui mesaj), ce regulă de sintaxă este obligatorie în C++ (pag. 65–66)?',
    hint: 'Fără acolade { }, compilatorul leagă de condiție strict prima instrucțiune.',
    options: [
      { id: 'a', text: 'A. Trebuie să punem punct și virgulă după condiție: if (cond);' },
      { id: 'b', text: 'B. Toate instrucțiunile acelei ramuri trebuie grupate între acolade { } formând un bloc de instrucțiuni compus' },
      { id: 'c', text: 'C. Este suficient să fie indentate la același număr de spații pe ecran' },
      { id: 'd', text: 'D. C++ nu permite mai mult de o instrucțiune pe ramură' }
    ],
    correctOptionId: 'b',
    explanation:
      'Corect! În limbajul C++, indentarea este pur vizuală pentru programator. Pentru a executa mai multe instrucțiuni condiționate, este obligatorie gruparea lor între acolade { } într-un bloc compus.',
    manualRef: 'Manual pag. 65–66'
  },
  {
    id: 'q2',
    questionNumber: 2,
    title: 'Selecția Multiplă switch-case & break',
    questionText:
      'Ce restricție fundamentală impune limbajul C++ asupra expresiei evaluate într-un bloc `switch (expresie)` și ce rol are instrucțiunea `break` (pag. 66–67)?',
    hint: 'Nu putem compara numere cu virgulă mobilă în switch, iar fără break se produce fenomenul de cădere în cascadă.',
    options: [
      { id: 'a', text: 'A. Expresia poate fi orice număr real (double), iar break oprește definitiv calculatorul' },
      { id: 'b', text: 'B. Expresia trebuie să fie de tip întreg/ordinal (int, char, bool) — NU real (float/double); break provoacă saltul imediat în afara blocului switch, evitând căderea prin cazuri (fall-through)' },
      { id: 'c', text: 'C. Switch funcționează doar cu fișiere audio MP3' },
      { id: 'd', text: 'D. Instrucțiunea break este interzisă în C++ modern' }
    ],
    correctOptionId: 'b',
    explanation:
      'Corect! Expresia din switch trebuie să fie de tip întreg (int, char, etc.), nefiind permise tipuri reale (double/float). Instrucțiunea break este esențială pentru a părăsi structura după executarea cazului potrivit, împiedicând executarea nedorită a cazurilor următoare.',
    manualRef: 'Manual pag. 66–67'
  },
  {
    id: 'q3',
    questionNumber: 3,
    title: 'Inegalitatea Triunghiului & Clasificare',
    questionText:
      'Care este expresia logică completă și corectă pentru a verifica dacă trei numere strict pozitive `a, b, c` pot constitui laturile unui triunghi valid (pag. 67–68)?',
    hint: 'Oricare latură trebuie să fie strict mai mică decât suma celorlalte două simultan.',
    options: [
      { id: 'a', text: 'A. a + b + c > 0' },
      { id: 'b', text: 'B. a + b > c && a + c > b && b + c > a' },
      { id: 'c', text: 'C. a == b || b == c' },
      { id: 'd', text: 'D. a * a + b * b == c * c' }
    ],
    correctOptionId: 'b',
    explanation:
      'Corect! Conform teoremei inegalității triunghiului, trei segmente pot forma un triunghi dacă și numai dacă suma oricăror două laturi este strict mai mare decât a treia latură, toate cele 3 inegalități fiind legate prin ȘI logic (&&).',
    manualRef: 'Manual pag. 67–68'
  },
  {
    id: 'q4',
    questionNumber: 4,
    title: 'Descompunerea Cifrelor & Număr Palindrom',
    questionText:
      'Fie `n` un număr natural format din exact 3 cifre. Cum se verifică în C++ dacă `n` este un număr **palindrom** (adică citit de la stânga la dreapta este identic cu citirea de la dreapta la stânga, ex: 121, 383, 707) (pag. 68–69)?',
    hint: 'La un număr de 3 cifre, palindromul depinde doar de egalitatea primei cifre (sute) cu ultima cifră (unități).',
    options: [
      { id: 'a', text: 'A. n / 100 == n % 10' },
      { id: 'b', text: 'B. n % 10 == (n / 10) % 10' },
      { id: 'c', text: 'C. n / 10 == 0' },
      { id: 'd', text: 'D. n % 2 == 0' }
    ],
    correctOptionId: 'a',
    explanation:
      'Corect! Cifra sutelor este n / 100, iar cifra unităților este n % 10. La un număr de 3 cifre, acesta este palindrom dacă și numai dacă cifra sutelor este egală cu cifra unităților (c1 == c3).',
    manualRef: 'Manual pag. 68–69'
  },
  {
    id: 'q5',
    questionNumber: 5,
    title: 'Decizii Complexe & Algoritmul Anului Bisect',
    questionText:
      'Care este condiția C++ corectă pentru a determina dacă o variabilă `an` reprezintă un an bisect (366 de zile) conform manualului (pag. 69)?',
    hint: 'Anul trebuie să fie divizibil cu 4 dar nu cu 100, cu excepția cazului în care este divizibil cu 400.',
    options: [
      { id: 'a', text: 'A. an % 4 == 0 (orice an divizibil cu 4 este bisect fără excepție)' },
      { id: 'b', text: 'B. (an % 4 == 0 && an % 100 != 0) || (an % 400 == 0)' },
      { id: 'c', text: 'C. an % 100 == 0' },
      { id: 'd', text: 'D. an % 4 == 0 && an % 400 == 0' }
    ],
    correctOptionId: 'b',
    explanation:
      'Corect! Anul este bisect dacă este divizibil cu 4 și nu este sfârșit de secol (an % 100 != 0), sau este sfârșit de secol excepțional divizibil cu 400 (cum a fost anul 2000).',
    manualRef: 'Manual pag. 69'
  }
];

export const A2Level7_DecisionStructuresExam: React.FC<A2Level7Props> = ({
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
      <div className="bg-gradient-to-r from-indigo-950 via-purple-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-indigo-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-400/30 text-indigo-300">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Modulul 3B • Nivelul 7 din 7
                </span>
                <span className="text-xs text-indigo-300">Manual Art Klett pag. 70</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                Evaluare Sumativă: Structuri de Decizie & Prelucrarea Cifrelor C++
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-indigo-300 uppercase tracking-wider block">Standard Național</span>
            <span className="text-lg font-bold text-cyan-300">5 Întrebări Oficiale</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-indigo-100/90 leading-relaxed max-w-3xl">
          Demonstrează stăpânirea structurilor alternative <code className="bg-indigo-950/70 px-1.5 py-0.5 rounded text-cyan-300 font-mono">if / else</code>, selecției multiple <code className="bg-indigo-950/70 px-1.5 py-0.5 rounded text-cyan-300 font-mono">switch</code>, algoritmilor de minim/maxim, validării geometrice a triunghiurilor, descompunerii cifrelor și calculului anului bisect pentru a debloca <strong>Diploma Oficială C++ de Specialist în Structuri de Decizie</strong>!
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
                  ? 'border-indigo-500/40'
                  : 'border-slate-800'
              }`}
            >
              {/* Question Header */}
              <div className="p-5 border-b border-slate-800/80 bg-slate-950/50 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
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
                      btnClasses += 'bg-indigo-950/70 border-indigo-400 text-indigo-100 font-medium shadow-md';
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
                              ? 'bg-indigo-600 border-indigo-400 text-white'
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
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg cursor-pointer'
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
                  <strong>Felicitări! Ai promovat cu succes Evaluarea Sumativă a Modulului 3B!</strong>
                  <br />
                  Ai stăpânit structurile alternative (if/else), selecția multiplă (switch/case), descompunerea cifrelor unui număr și algoritmii pe cazuri complexe. Apasă butonul de mai jos pentru a primi <strong>Diploma Oficială C++ de Specialist în Structuri de Decizie</strong>!
                </div>
              </div>
            ) : (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-start space-x-3 text-rose-200">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <strong>Punctaj insuficient pentru promovare.</strong> Este necesară nota minimă 7.00.
                  Recitește explicațiile detaliate de la fiecare întrebare, revizuiește conceptele din manual și încearcă din nou testul!
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
                <span>Revendică Diploma & Finalizează Modulul 3B</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
