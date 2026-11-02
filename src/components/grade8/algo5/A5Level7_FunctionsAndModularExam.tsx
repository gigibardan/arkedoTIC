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
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface A5Level7Props {
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
    title: 'Antetul Subprogramului & Tipul Returnat',
    questionText:
      'Ce reprezintă cuvântul cheie `void` specificat ca tip de returnare în antetul unei funcții C++, de exemplu `void afisare(int v[], int n)` (pag. 85)?',
    hint: 'Gândește-te dacă o astfel de funcție are nevoie de instrucțiunea `return valoare;` sau doar execută acțiuni.',
    options: [
      { id: 'a', text: 'A. Funcția returnează întotdeauna valoarea 0 către sistemul de operare.' },
      { id: 'b', text: 'B. Funcția execută o secvență de instrucțiuni (prelucrări, afișări), dar nu întoarce nicio valoare printr-o expresie return.' },
      { id: 'c', text: 'C. Funcția este una invalidă și va genera obligatoriu o eroare de compilare.' },
      { id: 'd', text: 'D. Indică faptul că funcția nu poate primi niciun parametru între paranteze.' }
    ],
    correctOptionId: 'b',
    explanation:
      'Corect! În C++, cuvântul cheie `void` indică absența unei valori de return. Subprogramul este o procedură care realizează acțiuni sau modifică parametri prin referință, fără a produce un rezultat calculat unic direct prin return.',
    manualRef: 'Manual pag. 85'
  },
  {
    id: 'q2',
    questionNumber: 2,
    title: 'Transmiterea prin Valoare vs prin Referință (&)',
    questionText:
      'Care este diferența esențială între `void f(int x)` și `void f(int &x)` când apelăm `f(a)` în funcția `main()` (pag. 85–86)?',
    hint: 'Simbolul & creează un alias direct către variabila originală din memorie.',
    options: [
      { id: 'a', text: 'A. Nu există nicio diferență; ambele variante modifică permanent variabila a din main.' },
      { id: 'b', text: 'B. La transmiterea prin valoare (int x), se creează o copie locală pe stivă, iar a rămâne neschimbat; la transmiterea prin referință (int &x), x devine un alias al lui a, modificându-l direct.' },
      { id: 'c', text: 'C. Transmiterea prin referință funcționează exclusiv pentru numere negative.' },
      { id: 'd', text: 'D. Transmiterea prin valoare șterge variabila din memorie la finalul programului.' }
    ],
    correctOptionId: 'b',
    explanation:
      'Corect! La transmiterea prin valoare, parametrii formali sunt copii independente create pe stivă și distruse la ieșirea din funcție. Operatorul `&` (referință) leagă parametrul formal direct de adresa variabilei reale din apelant.',
    manualRef: 'Manual pag. 85–86'
  },
  {
    id: 'q3',
    questionNumber: 3,
    title: 'Vectorii ca Parametri în Subprograme',
    questionText:
      'Cum se comportă un vector unidimensional când este transmis către o funcție C++, de exemplu `void dubleaza(int v[], int n)` (pag. 86–87)?',
    hint: 'De ce nu punem `&` în fața lui `v[]` pentru a-i modifica valorile?',
    options: [
      { id: 'a', text: 'A. Vectorul v[] este transmis automat prin adresa primului său element; orice modificare asupra lui v[i] afectează direct vectorul din funcția apelantă.' },
      { id: 'b', text: 'B. Toate elementele vectorului sunt copiate integral într-un vector temporar, iar modificările se pierd.' },
      { id: 'c', text: 'C. Compilatorul C++ nu permite transmiterea vectorilor ca parametri în subprograme.' },
      { id: 'd', text: 'D. Vectorul se inversează automat în memorie la intrarea în funcție.' }
    ],
    correctOptionId: 'a',
    explanation:
      'Corect! În C++, numele unui tablou este echivalent cu adresa primului său element (`&v[0]`). Prin urmare, vectorii sunt transmiși natural prin adresă, modificările in-place asupra elementelor reflectându-se imediat în vectorul din main.',
    manualRef: 'Manual pag. 86–87'
  },
  {
    id: 'q4',
    questionNumber: 4,
    title: 'Domeniul de Vizibilitate & Durata de Viață (Scope)',
    questionText:
      'Ce se întâmplă cu variabilele locale declarate în interiorul unei funcții C++ după executarea instrucțiunii de final sau `return` (pag. 88)?',
    hint: 'Variabilele locale există doar pe durata cât se execută blocul `{ }` în care au fost declarate.',
    options: [
      { id: 'a', text: 'A. Rămân salvate permanent pe disc într-un fișier text.' },
      { id: 'b', text: 'B. Devin variabile globale accesibile de oriunde din program.' },
      { id: 'c', text: 'C. Spațiul lor de memorie de pe stivă este eliberat, iar variabilele sunt distruse automat și nu mai pot fi accesate.' },
      { id: 'd', text: 'D. Își dublează valoarea pentru următorul apel al aceleiași funcții.' }
    ],
    correctOptionId: 'c',
    explanation:
      'Corect! Variabilele locale au durata de viață limitată la execuția blocului `{}` în care sunt definite. La revenirea din funcție, cadrul de stivă (stack frame) este eliberat, iar valorile locale dispar.',
    manualRef: 'Manual pag. 88'
  },
  {
    id: 'q5',
    questionNumber: 5,
    title: 'Arhitectura Modulară & Principiul Divide et Impera',
    questionText:
      'Care este principalul avantaj ingineresc al împărțirii unui proiect C++ complex în subprograme specializate (pag. 87–88)?',
    hint: 'Gândește-te la refolosirea funcțiilor precum `estePrim()`, depanare ușoară și claritatea funcției `main()`.',
    options: [
      { id: 'a', text: 'A. Permite rularea programului fără a instala un compilator.' },
      { id: 'b', text: 'B. Modularitatea asigură claritate, reutilizarea codului fără duplicare, testare și depanare izolată și o funcție main() curată și expresivă.' },
      { id: 'c', text: 'C. Transformă automat codul C++ în pagini web HTML.' },
      { id: 'd', text: 'D. Elimină complet necesitatea de a folosi variabile sau tipuri de date.' }
    ],
    correctOptionId: 'b',
    explanation:
      'Corect! Principiul Divide et Impera (Descompune și Stăpânește) transformă o problemă uriașă în module mici, testabile individual și refolosibile în multiple scenarii, făcând codul curat și profesional.',
    manualRef: 'Manual pag. 87–88'
  }
];

export const A5Level7_FunctionsAndModularExam: React.FC<A5Level7Props> = ({
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
      <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-purple-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-400/30 text-purple-300">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">
                  Unitatea 3 • Evaluare Sumativă (Manual pag. 88)
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                  Standard Național 2025
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight mt-1">
                Examen Sumativ: Subprograme &amp; Programare Modulară C++
              </h1>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-purple-300 font-mono">Prag promovare: 70%</div>
            <div className="text-lg font-bold text-emerald-400 font-mono">5 Întrebări Oficiale</div>
          </div>
        </div>
        <p className="mt-4 text-purple-100 text-sm leading-relaxed border-t border-purple-800/40 pt-3">
          Verifică stăpânirea conceptelor esențiale: prototipuri, tipuri de return, transmitere prin valoare și referință (&amp;), prelucrarea tablourilor în funcții și arhitectură modulară. Răspunsurile greșite activează o pauză de reflecție pedagogică de 5 secunde.
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
                    {q.title}
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-mono bg-slate-800/50 px-2 py-0.5 rounded">
                  {q.manualRef}
                </span>
              </div>

              {/* Question Text */}
              <p className="text-slate-100 font-medium text-sm md:text-base leading-relaxed mb-4">
                {q.questionText}
              </p>

              {/* Pedagogical Reflection Banner */}
              {locked && !submitted && (
                <div className="mb-4">
                  <PedagogicalReflectionBanner
                    remainingSeconds={cooldowns[q.id] || 0}
                    tip="Gândește-te la modul în care compilatorul gestionează memoria stivei sau adresele variabilelor!"
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
                      <span className="flex-1 leading-snug">{opt.text}</span>
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
                    <span>{activeHintId === q.id ? 'Ascunde indiciul' : 'Arată indiciu'}</span>
                  </button>
                ) : (
                  <div className="text-slate-400">
                    <span className="font-semibold text-slate-300">Explicație didactică:</span>{' '}
                    {q.explanation}
                  </div>
                )}
              </div>

              {activeHintId === q.id && !submitted && (
                <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-xs">
                  <strong>Indiciu:</strong> {q.hint}
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
                ? 'Felicitări! Ai promovat Examenul Unității 3!'
                : 'Punctaj insuficient pentru promovare'}
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Punctaj obținut: <span className="font-bold text-white">{score}%</span> (Nota echivalentă:{' '}
              <span className="font-bold text-white">{romanianGrade}</span>)
            </p>
          </div>

          {score >= 70 ? (
            <p className="text-xs text-emerald-300 max-w-lg mx-auto">
              Ai demonstrat o stăpânire completă a arhitecturii modulare C++, a vectorilor și tehnicilor avansate de programare. Ești gata să primești Diploma Oficială de Arhitect Modular C++ (Nivelul 8)!
            </p>
          ) : (
            <p className="text-xs text-rose-300 max-w-lg mx-auto">
              Ai nevoie de cel puțin 70% pentru a debloca Diploma Oficială. Reia conceptele cheie și încearcă din nou!
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
                Reîncearcă Examenul
              </button>
            )}
            {score >= 70 && (
              <button
                onClick={handleFinishLevel}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center space-x-2 transition-all cursor-pointer"
              >
                <span>Revendică Diploma Oficială (Nivelul 8)</span>
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
                Toate întrebările au fost completate!
              </span>
            ) : (
              <span>Răspunde la toate cele 5 întrebări pentru a trimite lucrarea.</span>
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
            <span>Trimite Lucrarea de Examen</span>
          </button>
        </div>
      )}
    </div>
  );
};
