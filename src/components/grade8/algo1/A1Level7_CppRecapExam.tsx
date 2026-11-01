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
  Hash
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface A1Level7Props {
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
    title: 'Structura Programului & Biblioteca Standard',
    questionText: 'Care este rolul obligatoriu al directivei #include <iostream> plasate pe prima linie a oricărui fișier sursă C++ (pag. 59)?',
    hint: 'Numele iostream provine de la „Input / Output Stream” (flux de intrare și ieșire).',
    options: [
      { id: 'a', text: 'A. Permite calculatorului să se conecteze la rețeaua de internet Wi-Fi' },
      { id: 'b', text: 'B. Include fișierul antet standard care conține definițiile fluxurilor fundamentale de comunicare cu tastatura (cin) și monitorul (cout)' },
      { id: 'c', text: 'C. Șterge automat toate fișierele temporare de pe disc' },
      { id: 'd', text: 'D. Este o comandă opțională de decor care nu afectează compilarea' }
    ],
    correctOptionId: 'b',
    explanation: 'Corect! Directiva #include <iostream> include biblioteca standard fără de care obiectele de intrare/ieșire cin și cout nu ar fi recunoscute de compilator.',
    manualRef: 'Manual pag. 59'
  },
  {
    id: 'q2',
    questionNumber: 2,
    title: 'Alegerea Tipului de Date & Limite de Memorie',
    questionText: 'Dacă la o problemă de concurs trebuie să calculezi suma primelor n numere naturale pentru n = 200.000 (formula n*(n+1)/2 dă aproximativ 20 de miliarde), ce tip de date alegi pentru sumă (pag. 60)?',
    hint: 'Valoarea maximă a unui int pe 32 de biți este ~2.14 miliarde. Douăzeci de miliarde depășește această limită.',
    options: [
      { id: 'a', text: 'A. int, deoarece se potrivește pentru orice număr întreg' },
      { id: 'b', text: 'B. long long, deoarece este reprezentat pe 8 octeți (64 biți) și suportă valori de până la ~9 · 10¹⁸, prevenind depășirea de limită' },
      { id: 'c', text: 'C. bool, deoarece consumă doar 1 octet' },
      { id: 'd', text: 'D. char, deoarece literele nu au limită numerică' }
    ],
    correctOptionId: 'b',
    explanation: 'Excelent! 20 de miliarde depășește limita tipului int (~2.14 miliarde). Variabila trebuie declarată obligatoriu long long pentru a evita obținerea unui rezultat eronat sau negativ.',
    manualRef: 'Manual pag. 60'
  },
  {
    id: 'q3',
    questionNumber: 3,
    title: 'Operatori Aritmetici: Cât și Modulo',
    questionText: 'Care este valoarea expresiei C++: 25 / 4 + 25 % 4 (pag. 60–61)?',
    hint: 'Împărțirea 25 / 4 între două numere întregi dă câtul întreg 6. Restul 25 % 4 este 1 (deoarece 25 = 4 * 6 + 1).',
    options: [
      { id: 'a', text: 'A. 7 (deoarece 25 / 4 = 6, iar 25 % 4 = 1, deci 6 + 1 = 7)' },
      { id: 'b', text: 'B. 6.25' },
      { id: 'c', text: 'C. 12' },
      { id: 'd', text: 'D. 25' }
    ],
    correctOptionId: 'a',
    explanation: 'Corect! C++ efectuează împărțirea întreagă: 25 / 4 = 6 (câtul), iar 25 % 4 = 1 (restul). Adunarea 6 + 1 dă exact rezultatul 7.',
    manualRef: 'Manual pag. 60–61'
  },
  {
    id: 'q4',
    questionNumber: 4,
    title: 'Operatori Logici & Verificarea Proprietăților',
    questionText: 'Cum se scrie corect în C++ condiția ca un număr întreg n să fie strict pozitiv ȘI să aibă exact 3 cifre (pag. 61–62)?',
    hint: 'Un număr strict pozitiv de exact 3 cifre este cuprins între 100 și 999 inclusiv.',
    options: [
      { id: 'a', text: 'A. n > 0 || 100 <= n <= 999' },
      { id: 'b', text: 'B. n >= 100 && n <= 999' },
      { id: 'c', text: 'C. n == 100 && n == 999' },
      { id: 'd', text: 'D. n in [100, 999]' }
    ],
    correctOptionId: 'b',
    explanation: 'Excelent! Condiția n >= 100 && n <= 999 verifică atât faptul că numărul este pozitiv (>= 100), cât și faptul că are exact trei cifre (nu depășește 999).',
    manualRef: 'Manual pag. 61–62'
  },
  {
    id: 'q5',
    questionNumber: 5,
    title: 'Instrucțiuni de Decizie & Greșeala Egalității',
    questionText: 'Ce se va întâmpla la execuția secvenței: int x = 0; if (x = 5) cout << "Adevarat"; else cout << "Fals"; (pag. 63)?',
    hint: 'Atenție la operatorul = (atribuire) vs == (comparare de egalitate).',
    options: [
      { id: 'a', text: 'A. Se va afișa „Fals”, deoarece x era inițial 0' },
      { id: 'b', text: 'B. Se va afișa „Adevarat”, deoarece x = 5 atribuie valoarea 5 lui x, iar 5 este o valoare nenulă (evaluată ca true în C++)' },
      { id: 'c', text: 'C. Programul se va bloca într-o buclă infinită' },
      { id: 'd', text: 'D. Calculatorul va afișa numărul 0' }
    ],
    correctOptionId: 'b',
    explanation: 'Corect! Aceasta este capcana clasică: instrucțiunea if (x = 5) atribuie valoarea 5 variabilei x, iar valoarea unei expresii de atribuire este chiar valoarea atribuită (5). În C++, orice valoare diferită de 0 este considerată adevărată (true), executându-se ramura if!',
    manualRef: 'Manual pag. 63'
  }
];

export const A1Level7_CppRecapExam: React.FC<A1Level7Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});

  const handleSelect = (qId: string, optId: string) => {
    if (submittedAnswers[qId] || isLocked(qId)) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optId }));
    sounds.playClick();
  };

  const handleVerify = (qId: string, correctOptId: string) => {
    if (isLocked(qId)) return;
    const isCorrect = selectedAnswers[qId] === correctOptId;
    if (isCorrect) {
      sounds.playCorrect();
      setSubmittedAnswers(prev => ({ ...prev, [qId]: true }));
    } else {
      sounds.playWrong();
      triggerCooldown(qId);
    }
  };

  // 10 points default (Romanian grade 1) + 18 points per question = max 100 points (grade 10)
  const totalQuestions = EXAM_QUESTIONS.length;
  const correctCount = EXAM_QUESTIONS.filter(
    q => submittedAnswers[q.id] && selectedAnswers[q.id] === q.correctOptionId
  ).length;
  const score = Math.round((correctCount / totalQuestions) * 90 + 10);
  const isAllAnswered = EXAM_QUESTIONS.every(q => submittedAnswers[q.id]);

  const handleFinish = () => {
    sounds.playLevelUp();
    if (onCompletePage) onCompletePage(score);
    if (onComplete) onComplete();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-200 text-sm font-semibold tracking-wide uppercase mb-1">
              <Award className="w-5 h-5 text-indigo-300" />
              <span>Unitatea 3: Algoritmi & Programare C++ Avansată • Modulul 3A</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Lecția 7: Evaluare Sumativă – Fundamentele Limbajului C++
            </h1>
            <p className="text-indigo-100 text-sm md:text-base mt-1 max-w-3xl">
              Manual Art Klett pag. 64: Demonstrează stăpânirea structurii canonice C++, a tipurilor de date,
              a operatorilor aritmetici și logici, precum și abilitatea de a identifica capcanele de compilare.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-indigo-200 font-bold block">Nivel</span>
            <span className="text-2xl font-black text-white">7 / 7</span>
          </div>
        </div>
      </div>

      {/* Score Summary Box */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Progres Evaluare Modul 3A</div>
            <div className="text-lg font-black text-slate-800">
              {correctCount} din {totalQuestions} cerințe validate
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Nota Estimată</div>
            <div className="text-2xl font-black text-indigo-700">
              {score >= 10 ? (score / 10).toFixed(1) : '1.0'} / 10
            </div>
          </div>
          <div className="bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 text-xs font-bold text-indigo-800">
            {isAllAnswered ? 'Evaluare Finalizată 🎉' : 'În Desfășurare'}
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {EXAM_QUESTIONS.map(q => {
          const isSubmitted = submittedAnswers[q.id];
          const selected = selectedAnswers[q.id];
          const isCorrect = selected === q.correctOptionId;
          const locked = isLocked(q.id);

          return (
            <div
              key={q.id}
              className={`bg-white rounded-2xl p-6 border transition-all ${
                isSubmitted
                  ? 'border-emerald-300 bg-emerald-50/20 shadow-sm'
                  : 'border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    {q.questionNumber}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{q.title}</h3>
                    <span className="text-[11px] text-slate-500 font-medium">{q.manualRef}</span>
                  </div>
                </div>

                <QuestionHint
                  hint={q.hint}
                  isOpen={showHints[q.id] || false}
                  onToggle={() => setShowHints(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                />
              </div>

              <p className="text-sm text-slate-700 font-medium mb-4 leading-relaxed font-sans">
                {q.questionText}
              </p>

              {locked && (
                <div className="mb-4">
                  <PedagogicalReflectionBanner remainingSeconds={cooldowns[q.id] || 0} />
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-2.5 mb-4">
                {q.options.map(opt => {
                  const isOptSelected = selected === opt.id;
                  let btnStyle = 'border-slate-200 hover:bg-slate-50 text-slate-700';

                  if (isSubmitted) {
                    if (opt.id === q.correctOptionId) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                    } else if (isOptSelected) {
                      btnStyle = 'border-rose-400 bg-rose-50 text-rose-800 line-through';
                    } else {
                      btnStyle = 'border-slate-200 opacity-50';
                    }
                  } else if (isOptSelected) {
                    btnStyle = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold ring-2 ring-indigo-200';
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={isSubmitted || locked}
                      onClick={() => handleSelect(q.id, opt.id)}
                      className={`p-3 rounded-xl border text-left text-xs transition leading-snug ${btnStyle}`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              {!isSubmitted ? (
                <button
                  onClick={() => handleVerify(q.id, q.correctOptionId)}
                  disabled={!selected || locked}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>Validează Răspunsul</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <AnswerExplanation
                  explanation={q.explanation}
                  isCorrect={isCorrect}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Completion Banner */}
      {isAllAnswered && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur mx-auto flex items-center justify-center">
            <Award className="w-10 h-10 text-amber-300" />
          </div>
          <h2 className="text-2xl font-black">
            Felicitări! Ai finalizat cu succes Evaluarea Sumativă Modul 3A!
          </h2>
          <p className="text-emerald-100 text-sm max-w-xl mx-auto">
            Ai demonstrat cunoștințe temeinice de sintaxă C++, stăpânirea tipurilor de date,
            operatorilor aritmetici și logici, precum și abilitatea de a depana expresii complexe.
          </p>
          <div className="pt-2">
            <button
              onClick={handleFinish}
              className="px-8 py-3.5 bg-white text-indigo-950 font-extrabold rounded-xl shadow-lg hover:bg-emerald-50 transition transform hover:scale-105"
            >
              Deblochează Diploma C++ Junior Developer & Revendică Punctele &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <PageNavigationFooter
        currentLevel={7}
        totalLevels={7}
        isCompleted={isAllAnswered}
        onPrev={onPrev}
        onNext={handleFinish}
        nextLabel="Revendică Diploma de C++ Junior Developer"
      />
    </div>
  );
};
