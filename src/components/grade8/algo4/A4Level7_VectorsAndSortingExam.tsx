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
import { useLanguage } from '../../../context/LanguageContext';

interface A4Level7Props {
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
    titleRo: 'Declararea & Indexarea Tablourilor în C++',
    titleEn: 'Array Declaration & Indexing in C++',
    questionTextRo:
      'Dacă declarăm vectorul int v[50];, care este intervalul de indici valizi pentru accesarea elementelor sale conform standardului C++ (pag. 77–78)?',
    questionTextEn:
      'If we declare the array int v[50];, what is the valid index range for accessing its elements according to the C++ standard (pp. 77–78)?',
    hintRo: 'În C++, primul element are întotdeauna indicele 0, iar ultimul are indicele dimensiune - 1.',
    hintEn: 'In C++, the first element always has index 0, and the last has index size - 1.',
    options: [
      { id: 'a', textRo: 'A. De la 1 la 50', textEn: 'A. From 1 to 50' },
      { id: 'b', textRo: 'B. De la 0 la 49', textEn: 'B. From 0 to 49' },
      { id: 'c', textRo: 'C. De la 1 la 49', textEn: 'C. From 1 to 49' },
      { id: 'd', textRo: 'D. De la 0 la 50', textEn: 'D. From 0 to 50' }
    ],
    correctOptionId: 'b',
    explanationRo:
      'Corect! În limbajul C++, tablourile sunt indexate de la 0. Prin urmare, pentru un vector declarat cu 50 de elemente, indicii valizi sunt de la 0 (primul element) până la 49 (al 50-lea element).',
    explanationEn:
      'Correct! In C++, arrays are 0-indexed. Therefore, for an array declared with 50 elements, valid indices are from 0 (first element) to 49 (50th element).',
    manualRefRo: 'Manual pag. 77–78',
    manualRefEn: 'Textbook pp. 77–78'
  },
  {
    id: 'q2',
    questionNumber: 2,
    titleRo: 'Găsirea Maximului și a Poziției Sale',
    titleEn: 'Finding the Maximum and its Position',
    questionTextRo:
      'Cum este corect să inițializăm variabilele maxim și poz_max înainte de a parcurge un vector v cu n elemente oarecare (pozitive sau negative) (pag. 78–79)?',
    questionTextEn:
      'How should we correctly initialize the variables maxim and poz_max before traversing an array v with n arbitrary elements (positive or negative) (pp. 78–79)?',
    hintRo: 'Nu presupune că numerele sunt pozitive; inițializează cu chiar primul element din vector.',
    hintEn: 'Do not assume numbers are positive; initialize with the very first element of the array.',
    options: [
      { id: 'a', textRo: 'A. maxim = 0; poz_max = 0;', textEn: 'A. maxim = 0; poz_max = 0;' },
      {
        id: 'b',
        textRo: 'B. maxim = v[0]; poz_max = 0; (apoi bucla for parcurge de la i = 1 la n - 1)',
        textEn: 'B. maxim = v[0]; poz_max = 0; (then the for loop traverses from i = 1 to n - 1)'
      },
      { id: 'c', textRo: 'C. maxim = 99999; poz_max = n;', textEn: 'C. maxim = 99999; poz_max = n;' },
      { id: 'd', textRo: 'D. maxim = n; poz_max = -1;', textEn: 'D. maxim = n; poz_max = -1;' }
    ],
    correctOptionId: 'b',
    explanationRo:
      'Corect! Dacă vectorul ar conține doar numere negative (de ex: -15, -40, -8), inițializarea cu 0 ar produce un rezultat complet eronat. Inițializarea corectă este maxim = v[0] și poz_max = 0.',
    explanationEn:
      'Correct! If the array contained only negative numbers (e.g., -15, -40, -8), initializing with 0 would produce an incorrect result. The correct initialization is maxim = v[0] and poz_max = 0.',
    manualRefRo: 'Manual pag. 78–79',
    manualRefEn: 'Textbook pp. 78–79'
  },
  {
    id: 'q3',
    questionNumber: 3,
    titleRo: 'Inserarea unui Element pe Poziția k',
    titleEn: 'Inserting an Element at Position k',
    questionTextRo:
      'În ce ordine trebuie realizată deplasarea elementelor pentru a insera o valoare nouă X pe poziția k a unui tablou cu n elemente (pag. 80–81)?',
    questionTextEn:
      'In what order must elements be shifted to insert a new value X at position k of an array with n elements (pp. 80–81)?',
    hintRo: 'Trebuie să începem deplasarea de la capătul din dreapta spre stânga, altfel valorile se suprascriu.',
    hintEn: 'We must begin shifting from the right end towards the left, otherwise existing values get overwritten.',
    options: [
      {
        id: 'a',
        textRo: 'A. De la stânga la dreapta: for (int i = k; i < n; i++) v[i+1] = v[i];',
        textEn: 'A. From left to right: for (int i = k; i < n; i++) v[i+1] = v[i];'
      },
      {
        id: 'b',
        textRo: 'B. De la dreapta la stânga: for (int i = n; i > k; i--) v[i] = v[i-1]; apoi v[k] = X; n++;',
        textEn: 'B. From right to left: for (int i = n; i > k; i--) v[i] = v[i-1]; then v[k] = X; n++;'
      },
      {
        id: 'c',
        textRo: 'C. Nu este nevoie de nicio deplasare, C++ inserează automat',
        textEn: 'C. No shifting needed, C++ inserts automatically'
      },
      {
        id: 'd',
        textRo: 'D. Se șterg toate celelalte elemente',
        textEn: 'D. All other elements are deleted'
      }
    ],
    correctOptionId: 'b',
    explanationRo:
      'Corect! Pentru a face loc noului element fără a suprascrie valorile existente, elementele trebuie deplasate spre dreapta începând de la ultimul element spre poziția k (for i de la n descrescător la k + 1).',
    explanationEn:
      'Correct! To make room for the new element without overwriting existing data, elements must be shifted rightwards starting from the last element down to position k (for i descending from n to k + 1).',
    manualRefRo: 'Manual pag. 80–81',
    manualRefEn: 'Textbook pp. 80–81'
  },
  {
    id: 'q4',
    questionNumber: 4,
    titleRo: 'Algoritmul de Sortare Bubble Sort',
    titleEn: 'Bubble Sort Algorithm',
    questionTextRo:
      'Care este principiul de funcționare al sortării prin metoda bulelor (Bubble Sort) (pag. 81–82)?',
    questionTextEn:
      'What is the operational principle of Bubble Sort (pp. 81–82)?',
    hintRo: 'Comparațiile se fac exclusiv între elemente vecine (adiacente).',
    hintEn: 'Comparisons are strictly made between adjacent neighbor elements.',
    options: [
      {
        id: 'a',
        textRo: 'A. Compară elemente adiacente v[i] și v[i+1] și le interschimbă dacă v[i] > v[i+1], repetând procesul până când nu mai are loc nicio inversiune',
        textEn: 'A. Compares adjacent elements v[i] and v[i+1] and swaps them if v[i] > v[i+1], repeating until no inversions occur'
      },
      {
        id: 'b',
        textRo: 'B. Împarte vectorul în 3 bucăți egale',
        textEn: 'B. Splits the array into 3 equal pieces'
      },
      {
        id: 'c',
        textRo: 'C. Calculează suma tuturor elementelor și le împarte la 2',
        textEn: 'C. Calculates the sum of all elements and divides by 2'
      },
      {
        id: 'd',
        textRo: 'D. Ordonează elementele folosind un zar electronic',
        textEn: 'D. Orders elements using an electronic dice'
      }
    ],
    correctOptionId: 'a',
    explanationRo:
      'Corect! Bubble Sort compară elemente vecine două câte două, interschimbându-le dacă sunt în ordine greșită. La fiecare parcurgere, elementul cel mai mare urcă la capătul vectorului ca o bulă de aer.',
    explanationEn:
      'Correct! Bubble Sort compares neighbor elements pairwise, swapping them if out of order. In each pass, the largest remaining element bubbles up to the end of the array.',
    manualRefRo: 'Manual pag. 81–82',
    manualRefEn: 'Textbook pp. 81–82'
  },
  {
    id: 'q5',
    questionNumber: 5,
    titleRo: 'Căutarea Liniară vs Căutarea Binară',
    titleEn: 'Linear Search vs Binary Search',
    questionTextRo:
      'De ce algoritmul de Căutare Binară este considerabil mai rapid decât Căutarea Liniară și care este cerința sa obligatorie (pag. 82–83)?',
    questionTextEn:
      'Why is Binary Search significantly faster than Linear Search, and what is its mandatory prerequisite (pp. 82–83)?',
    hintRo: 'La fiecare pas se elimină jumătate din elementele rămase, dar vectorul trebuie să fie ordonat.',
    hintEn: 'At each step half of the remaining elements are discarded, but the array must be sorted.',
    options: [
      {
        id: 'a',
        textRo: 'A. Căutarea binară funcționează doar pe telefoane mobile',
        textEn: 'A. Binary search only works on mobile phones'
      },
      {
        id: 'b',
        textRo: 'B. Necesită ca vectorul să fie obligatoriu sortat; comparând direct cu mijlocul intervalului (mij = (st + dr) / 2), înjumătățește spațiul de căutare la fiecare pas',
        textEn: 'B. Requires the array to be sorted; comparing directly to the midpoint (mid = (left + right) / 2), it halves the search space at each step'
      },
      {
        id: 'c',
        textRo: 'C. Căutarea binară caută doar elementele de valoare 0 sau 1',
        textEn: 'C. Binary search only searches for 0 or 1 values'
      },
      {
        id: 'd',
        textRo: 'D. Căutarea binară face exact același număr de comparații ca cea liniară',
        textEn: 'D. Binary search performs the exact same number of comparisons as linear search'
      }
    ],
    correctOptionId: 'b',
    explanationRo:
      'Corect! Căutarea binară presupune ca vectorul să fie ordonat. Comparând valoarea căutată cu elementul median, elimină la fiecare iterație jumătate din elemente, obținând o complexitate logaritmică extraordinar de rapidă.',
    explanationEn:
      'Correct! Binary search requires a sorted array. Comparing the target with the median element, it discards half of the candidate elements in every iteration, achieving remarkably fast logarithmic complexity.',
    manualRefRo: 'Manual pag. 82–83',
    manualRefEn: 'Textbook pp. 82–83'
  }
];

export const A4Level7_VectorsAndSortingExam: React.FC<A4Level7Props> = ({
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
      <div className="bg-gradient-to-r from-indigo-950 via-purple-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-indigo-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-400/30 text-indigo-300">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  {lang === 'ro' ? 'Modulul 3D • Nivelul 7 din 7' : 'Module 3D • Level 7 of 7'}
                </span>
                <span className="text-xs text-indigo-300">
                  {lang === 'ro' ? 'Manual Art Klett pag. 84' : 'Art Klett Textbook p. 84'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                {lang === 'ro'
                  ? 'Evaluare Sumativă: Tablouri Unidimensionale (Vectori), Căutare & Sortare'
                  : 'Summative Exam: One-Dimensional Arrays (Vectors), Search & Sorting'}
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-indigo-300 uppercase tracking-wider block">
              {lang === 'ro' ? 'Standard Național' : 'National Standard'}
            </span>
            <span className="text-lg font-bold text-cyan-300">
              {lang === 'ro' ? '5 Întrebări Oficiale' : '5 Official Questions'}
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm text-indigo-100/90 leading-relaxed max-w-3xl">
          {lang === 'ro' ? (
            <>
              Demonstrează stăpânirea structurilor de date liniare (vectori), indexării de la 0, algoritmilor de căutare (liniară și binară), inserării/ștergerii și sortării Bubble Sort pentru a obține <strong>Diploma Oficială C++: Arrays & Data Structures Specialist</strong>!
            </>
          ) : (
            <>
              Demonstrate mastery of linear data structures (vectors/arrays), 0-based indexing, searching algorithms (linear & binary), insertion/deletion, and Bubble Sort to earn your <strong>Official C++ Certificate: Arrays & Data Structures Specialist</strong>!
            </>
          )}
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
                {lang === 'ro' ? 'Finalizare Evaluare Sumativă' : 'Complete Summative Evaluation'}
              </h3>
              <p className="text-xs text-slate-400">
                {allAnswered
                  ? lang === 'ro'
                    ? 'Ai răspuns la toate cele 5 întrebări! Apasă butonul pentru corectare oficială.'
                    : 'You answered all 5 questions! Click the button for official grading.'
                  : lang === 'ro'
                  ? `Ai răspuns la ${Object.keys(selectedAnswers).length} din 5 întrebări.`
                  : `You answered ${Object.keys(selectedAnswers).length} out of 5 questions.`}
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
              <span>{lang === 'ro' ? 'Trimite Evaluarea spre Notare' : 'Submit Evaluation for Grading'}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 block">
                  {lang === 'ro' ? 'Rezultat Evaluare Sumativă' : 'Summative Evaluation Result'}
                </span>
                <div className="text-2xl font-black text-white flex items-center space-x-2 mt-0.5">
                  <span className={score >= 70 ? 'text-emerald-400' : 'text-rose-400'}>
                    {lang === 'ro' ? `Nota ${romanianGrade} / 10` : `Grade ${romanianGrade} / 10`}
                  </span>
                  <span className="text-sm font-normal text-slate-400">
                    ({score} {lang === 'ro' ? 'puncte din 100' : 'points out of 100'})
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">
                  {lang === 'ro' ? 'Condiție Promovare:' : 'Passing Requirement:'}
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
                      ? 'Felicitări! Ai promovat cu succes Evaluarea Sumativă a Modulului 3D!'
                      : 'Congratulations! You passed the Module 3D Summative Evaluation!'}
                  </strong>
                  <br />
                  {lang === 'ro'
                    ? 'Ai demonstrat o înțelegere avansată a tablourilor unidimensionale, a indexării continue în RAM, a algoritmilor de căutare și a sortării Bubble Sort. Apasă butonul de mai jos pentru a revendica Diploma Oficială C++ de Arrays & Data Structures Specialist!'
                    : 'You demonstrated advanced mastery of one-dimensional arrays, RAM contiguous indexing, search algorithms, and Bubble Sort. Click the button below to claim your Official C++ Arrays & Data Structures Specialist Certificate!'}
                </div>
              </div>
            ) : (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-start space-x-3 text-rose-200">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <strong>
                    {lang === 'ro' ? 'Punctaj insuficient pentru promovare.' : 'Insufficient score to pass.'}
                  </strong>{' '}
                  {lang === 'ro'
                    ? 'Este necesară nota minimă 7.00. Revizuiește conceptele, citește explicațiile detaliate și încearcă din nou!'
                    : 'A minimum grade of 7.00 is required. Review the concepts, read the detailed explanations, and try again!'}
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
                    ? 'Revendică Diploma & Finalizează Modulul 3D'
                    : 'Claim Certificate & Complete Module 3D'}
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
