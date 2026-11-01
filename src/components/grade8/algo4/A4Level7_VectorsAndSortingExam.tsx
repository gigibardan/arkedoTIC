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
  Layers
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface A4Level7Props {
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
    title: 'Declararea & Indexarea Tablourilor în C++',
    questionText:
      'Dacă declarăm vectorul `int v[50];`, care este intervalul de indici valizi pentru accesarea elementelor sale conform standardului C++ (pag. 77–78)?',
    hint: 'În C++, primul element are întotdeauna indicele 0, iar ultimul are indicele dimensiune - 1.',
    options: [
      { id: 'a', text: 'A. De la 1 la 50' },
      { id: 'b', text: 'B. De la 0 la 49' },
      { id: 'c', label: 'C. De la 1 la 49' } as any,
      { id: 'd', text: 'D. De la 0 la 50' }
    ],
    correctOptionId: 'b',
    explanation:
      'Corect! În limbajul C++, tablourile sunt indexate de la 0. Prin urmare, pentru un vector declarat cu 50 de elemente, indicii valizi sunt de la 0 (primul element) până la 49 (al 50-lea element).',
    manualRef: 'Manual pag. 77–78'
  },
  {
    id: 'q2',
    questionNumber: 2,
    title: 'Găsirea Maximului și a Poziției Sale',
    questionText:
      'Cum este corect să inițializăm variabilele `maxim` și `poz_max` înainte de a parcurge un vector `v` cu `n` elemente oarecare (pozitive sau negative) (pag. 78–79)?',
    hint: 'Nu presupune că numerele sunt pozitive; inițializează cu chiar primul element din vector.',
    options: [
      { id: 'a', text: 'A. maxim = 0; poz_max = 0;' },
      { id: 'b', text: 'B. maxim = v[0]; poz_max = 0; (apoi bucla for parcurge de la i = 1 la n - 1)' },
      { id: 'c', text: 'C. maxim = 99999; poz_max = n;' },
      { id: 'd', text: 'D. maxim = n; poz_max = -1;' }
    ],
    correctOptionId: 'b',
    explanation:
      'Corect! Dacă vectorul ar conține doar numere negative (de ex: -15, -40, -8), inițializarea cu 0 ar produce un rezultat complet eronat. Inițializarea corectă este maxim = v[0] și poz_max = 0.',
    manualRef: 'Manual pag. 78–79'
  },
  {
    id: 'q3',
    questionNumber: 3,
    title: 'Inserarea unui Element pe Poziția k',
    questionText:
      'În ce ordine trebuie realizată deplasarea elementelor pentru a insera o valoare nouă `X` pe poziția `k` a unui tablou cu `n` elemente (pag. 80–81)?',
    hint: 'Trebuie să începem deplasarea de la capătul din dreapta spre stânga, altfel valorile se suprascriu.',
    options: [
      { id: 'a', text: 'A. De la stânga la dreapta: for (int i = k; i < n; i++) v[i+1] = v[i];' },
      { id: 'b', text: 'B. De la dreapta la stânga: for (int i = n; i > k; i--) v[i] = v[i-1]; apoi v[k] = X; n++;' },
      { id: 'c', text: 'C. Nu este nevoie de nicio deplasare, C++ inserează automat' },
      { id: 'd', text: 'D. Se șterg toate celelalte elemente' }
    ],
    correctOptionId: 'b',
    explanation:
      'Corect! Pentru a face loc noului element fără a suprascrie valorile existente, elementele trebuie deplasate spre dreapta începând de la ultimul element spre poziția k (for i de la n descrescător la k + 1).',
    manualRef: 'Manual pag. 80–81'
  },
  {
    id: 'q4',
    questionNumber: 4,
    title: 'Algoritmul de Sortare Bubble Sort',
    questionText:
      'Care este principiul de funcționare al sortării prin metoda bulelor (Bubble Sort) (pag. 81–82)?',
    hint: 'Comparațiile se fac exclusiv între elemente vecine (adiacente).',
    options: [
      { id: 'a', text: 'A. Compară elemente adiacente v[i] și v[i+1] și le interschimbă dacă v[i] > v[i+1], repetând procesul până când nu mai are loc nicio inversiune' },
      { id: 'b', text: 'B. Împarte vectorul în 3 bucăți egale' },
      { id: 'c', text: 'C. Calculează suma tuturor elementelor și le împarte la 2' },
      { id: 'd', text: 'D. Ordonează elementele folosind un zar electronic' }
    ],
    correctOptionId: 'a',
    explanation:
      'Corect! Bubble Sort compară elemente vecine două câte două, interschimbându-le dacă sunt în ordine greșită. La fiecare parcurgere, elementul cel mai mare urcă la capătul vectorului ca o bulă de aer.',
    manualRef: 'Manual pag. 81–82'
  },
  {
    id: 'q5',
    questionNumber: 5,
    title: 'Căutarea Liniară vs Căutarea Binară',
    questionText:
      'De ce algoritmul de Căutare Binară este considerabil mai rapid decât Căutarea Liniară și care este cerința sa obligatorie (pag. 82–83)?',
    hint: 'La fiecare pas se elimină jumătate din elementele rămase, dar vectorul trebuie să fie ordonat.',
    options: [
      { id: 'a', text: 'A. Căutarea binară funcționează doar pe telefoane mobile' },
      { id: 'b', text: 'B. Necesită ca vectorul să fie obligatoriu sortat; comparând direct cu mijlocul intervalului (mij = (st + dr) / 2), înjumătățește spațiul de căutare la fiecare pas' },
      { id: 'c', text: 'C. Căutarea binară caută doar elementele de valoare 0 sau 1' },
      { id: 'd', text: 'D. Căutarea binară face exact același număr de comparații ca cea liniară' }
    ],
    correctOptionId: 'b',
    explanation:
      'Corect! Căutarea binară presupune ca vectorul să fie ordonat. Comparând valoarea căutată cu elementul median, elimină la fiecare iterație jumătate din elemente, obținând o complexitate logaritmică extraordinar de rapidă.',
    manualRef: 'Manual pag. 82–83'
  }
];

export const A4Level7_VectorsAndSortingExam: React.FC<A4Level7Props> = ({
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
                  Modulul 3D • Nivelul 7 din 7
                </span>
                <span className="text-xs text-indigo-300">Manual Art Klett pag. 84</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                Evaluare Sumativă: Tablouri Unidimensionale (Vectori), Căutare & Sortare
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-indigo-300 uppercase tracking-wider block">Standard Național</span>
            <span className="text-lg font-bold text-cyan-300">5 Întrebări Oficiale</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-indigo-100/90 leading-relaxed max-w-3xl">
          Demonstrează stăpânirea structurilor de date liniare (vectori), indexării de la 0, algoritmilor de căutare (liniară și binară), inserării/ștergerii și sortării Bubble Sort pentru a obține <strong>Diploma Oficială C++: Arrays & Data Structures Specialist</strong>!
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
                  <strong>Felicitări! Ai promovat cu succes Evaluarea Sumativă a Modulului 3D!</strong>
                  <br />
                  Ai demonstrat o înțelegere avansată a tablourilor unidimensionale, a indexării continue în RAM, a algoritmilor de căutare și a sortării Bubble Sort. Apasă butonul de mai jos pentru a revendica <strong>Diploma Oficială C++ de Arrays & Data Structures Specialist</strong>!
                </div>
              </div>
            ) : (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-start space-x-3 text-rose-200">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <strong>Punctaj insuficient pentru promovare.</strong> Este necesară nota minimă 7.00.
                  Revizuiește conceptele, citește explicațiile detaliate și încearcă din nou!
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
                <span>Revendică Diploma & Finalizează Modulul 3D</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
