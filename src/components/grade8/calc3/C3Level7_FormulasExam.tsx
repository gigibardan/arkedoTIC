import React, { useState } from 'react';
import { Award, CheckCircle2, AlertTriangle, RefreshCw, HelpCircle, ArrowRight, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface C3Level7Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface ExamQuestion {
  id: string;
  topic: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
}

const EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 'exam_c3_q1',
    topic: 'Ordinea de Execuție a Operațiilor',
    question: 'Care este rezultatul evaluat de aplicația de calcul tabelar pentru formula:',
    codeSnippet: '=4 + 2 * 3 ^ 2',
    options: [
      '22 (Ridicarea la putere 3^2=9 are prioritate absolută, urmată de înmulțire 2*9=18, apoi adunare 4+18=22)',
      '54 (Operațiile se calculează de la stânga la dreapta: 4+2=6, 6*3=18, 18^2=324)',
      '36 (Înmulțirea 2*3=6 se face prima, apoi 6^2=36, plus 4)',
      '18 (Se calculează doar adunarea și înmulțirea)'
    ],
    correctIndex: 0,
    hint: 'Prioritatea operatorilor în Excel: 1) Paranteze (), 2) Ridicare la putere ^, 3) Înmulțire/Împărțire *, /, 4) Adunare/Scădere +, -.',
    explanation: 'Ridicarea la putere 3^2 = 9 este prima evaluată. Apoi înmulțirea 2 * 9 = 18. În final, adunarea 4 + 18 = 22. Respectarea strictă a priorității matematice previne erorile de calcul.'
  },
  {
    id: 'exam_c3_q2',
    topic: 'Sinteză Funcții Statistice',
    question: 'Dacă intervalul B2:B11 conține 10 note școlare, care dintre următoarele două formule oferă un rezultat identic?',
    options: [
      '=AVERAGE(B2:B11) și =SUM(B2:B11) / COUNT(B2:B11)',
      '=AVERAGE(B2:B11) și =MAX(B2:B11) - MIN(B2:B11)',
      '=SUM(B2:B11) și =AVERAGE(B2:B11) * 2',
      '=COUNT(B2:B11) și =SUM(B2:B11) / 10'
    ],
    correctIndex: 0,
    hint: 'Media aritmetică reprezintă suma elementelor împărțită la numărul total de elemente.',
    explanation: 'Exact! Funcția AVERAGE calculează automat media aritmetică prin adunarea valorilor (=SUM) și împărțirea la numărul de celule ce conțin valori numerice (=COUNT).'
  },
  {
    id: 'exam_c3_q3',
    topic: 'Sintaxa Funcției Logice IF',
    question: 'Un profesor dorește ca celula D2 să afișeze "Admis" dacă media din C2 este cel puțin 5, altfel "Respins". Care este formula corectă conform standardului?',
    codeSnippet: '=IF(C2 >= 5, "Admis", "Respins")',
    options: [
      '=IF(C2 >= 5, "Admis", "Respins")',
      '=IF(C2 > 5; "Respins"; "Admis")',
      '=DACA(C2 == 5: "Admis", "Respins")',
      '=CHECK(C2 >= 5, Admis, Respins)'
    ],
    correctIndex: 0,
    hint: 'Sintaxa standard este =IF(test_logic, valoare_daca_adevarat, valoare_daca_fals), iar textele se pun obligatoriu între ghilimele duble.',
    explanation: 'Formula corectă este =IF(C2 >= 5, "Admis", "Respins"). Observați operatorul de comparație >= (mai mare sau egal) și plasarea textelor între ghilimele.'
  },
  {
    id: 'exam_c3_q4',
    topic: 'Funcții Specializate & Trunchiere',
    question: 'Dacă celula A1 conține numărul zecimal 18.75, ce rezultat returnează formula =INT(A1)?',
    options: [
      '18 (Funcția INT trunchiază partea fracționară și reține cel mai apropiat întreg inferior)',
      '19 (Rotunjește automat prin adăugare)',
      '0.75 (Extrage doar zecimalele)',
      '#VALUE! (Generează eroare deoarece numărul are virgulă)'
    ],
    correctIndex: 0,
    hint: 'INT (Integer) rotunjește un număr în jos până la cel mai apropiat număr întreg.',
    explanation: 'Corect! Funcția =INT(A1) elimină zecimalele și returnează 18. Spre deosebire de ROUND care ar da 19, INT face trunchiere inferioară directă.'
  },
  {
    id: 'exam_c3_q5',
    topic: 'Gestiunea Erorilor în Calcul Tabelar',
    question: 'În ce situație foaia de calcul va genera codul de eroare #DIV/0! ?',
    options: [
      'Când formula încearcă să împartă o valoare la zero sau la o celulă complet goală',
      'Când numele funcției a fost scris greșit cu caractere necunoscute',
      'Când o celulă referențiată a fost ștearsă fizic din foaie',
      'Când numărul este prea lung pentru a încăpea în lățimea coloanei'
    ],
    correctIndex: 0,
    hint: 'Denumirea DIV/0 provine din "Divide by Zero" (împărțire la zero).',
    explanation: '#DIV/0! semnalează o împărțire la zero sau la o celulă vidă tratată ca zero. Se previne prin teste logice IF de validare înainte de raportare.'
  }
];

export const C3Level7_FormulasExam: React.FC<C3Level7Props> = ({ onCompletePage, onComplete, onPrev }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<{ [qId: string]: boolean }>({});
  const [examSubmitted, setExamSubmitted] = useState(false);

  // Reflection cooldown hook (5s anti-spam)
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const handleSelectOption = (qId: string, optIdx: number) => {
    if (submittedAnswers[qId] || examSubmitted || isLocked(qId)) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIdx }));
    setSubmittedAnswers(prev => ({ ...prev, [qId]: true }));
    
    const question = EXAM_QUESTIONS.find(q => q.id === qId);
    if (question && optIdx === question.correctIndex) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown(qId);
    }
  };

  const answeredCount = Object.keys(submittedAnswers).length;
  const isAllAnswered = answeredCount === EXAM_QUESTIONS.length;

  const calculateScore = () => {
    let correct = 0;
    EXAM_QUESTIONS.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return correct;
  };

  const handleFinishExam = () => {
    sounds.playLevelUp();
    setExamSubmitted(true);
  };

  const handleRetryExam = () => {
    sounds.playClick();
    setSelectedAnswers({});
    setSubmittedAnswers({});
    setExamSubmitted(false);
  };

  const correctCount = calculateScore();
  const percentage = Math.round((correctCount / EXAM_QUESTIONS.length) * 100);
  const isPassed = percentage >= 75;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-indigo-950 text-white p-6 rounded-2xl shadow-xl border border-emerald-800/40">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold tracking-wider uppercase mb-1">
              <Award className="w-4 h-4" />
              Nivelul 7: Evaluare Sumativă Oficială
            </div>
            <h1 className="text-2xl font-black">Test de Autoevaluare: Formule & Funcții</h1>
            <p className="text-emerald-100 text-sm mt-1">
              Manualul oficial de Informatică și TIC, Clasa a VIII-a (pag. 28) — Sinteză completă.
            </p>
          </div>
          <div className="text-right bg-white/10 px-4 py-2.5 rounded-xl backdrop-blur-sm border border-white/20">
            <span className="text-xs text-emerald-200 block uppercase font-bold">Progres Răspunsuri</span>
            <span className="text-2xl font-black text-white">{answeredCount}/{EXAM_QUESTIONS.length}</span>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {EXAM_QUESTIONS.map((q, qIndex) => {
          const isAnswered = submittedAnswers[q.id];
          const chosen = selectedAnswers[q.id];
          const isCorrect = chosen === q.correctIndex;
          const remainingTime = cooldowns[q.id] || 0;

          return (
            <div
              key={q.id}
              className={`bg-slate-900 border rounded-2xl p-6 shadow-lg transition-all ${
                isAnswered
                  ? isCorrect
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : 'border-rose-500/40 bg-rose-950/10'
                  : 'border-slate-800'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  Întrebarea {qIndex + 1}: {q.topic}
                </span>
                {isAnswered && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                    isCorrect ? 'text-emerald-400 bg-emerald-950/60' : 'text-rose-400 bg-rose-950/60'
                  }`}>
                    {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    {isCorrect ? 'Corect (+20 puncte)' : 'Incorect'}
                  </span>
                )}
              </div>

              {/* Question Body */}
              <div className="text-slate-100 font-medium text-base mb-2">
                {q.question}
              </div>

              {q.codeSnippet && (
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-emerald-400 text-sm font-bold mb-3">
                  {q.codeSnippet}
                </div>
              )}

              {/* Pedagogical Hint */}
              {!isAnswered && <QuestionHint hint={q.hint} />}

              {/* Options */}
              <div className="space-y-2.5 mt-3">
                {q.options.map((opt, optIdx) => {
                  const isSelected = chosen === optIdx;
                  let btnStyle = 'border-slate-800 bg-slate-950/50 hover:bg-slate-800 text-slate-300';

                  if (isAnswered) {
                    if (optIdx === q.correctIndex) {
                      btnStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-semibold';
                    } else if (isSelected) {
                      btnStyle = 'border-rose-500 bg-rose-500/20 text-rose-300';
                    } else {
                      btnStyle = 'border-slate-800/40 bg-slate-950/30 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      disabled={isAnswered || isLocked(q.id) || examSubmitted}
                      className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-start gap-3 ${btnStyle}`}
                    >
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-bold shrink-0 mt-0.5">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Cooldown banner */}
              {isLocked(q.id) && (
                <div className="mt-3">
                  <PedagogicalReflectionBanner remainingSeconds={remainingTime} />
                </div>
              )}

              {/* Explanation */}
              {isAnswered && (
                <div className="mt-3">
                  <AnswerExplanation explanation={q.explanation} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Exam Result Card */}
      {isAllAnswered && !examSubmitted && (
        <div className="bg-gradient-to-r from-emerald-950 to-indigo-950 border border-emerald-500/50 rounded-2xl p-6 text-center space-y-4 shadow-xl">
          <Sparkles className="w-10 h-10 text-emerald-400 mx-auto" />
          <h2 className="text-xl font-black text-white">Ai răspuns la toate întrebările testului!</h2>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            Apasă butonul de mai jos pentru a genera raportul final de evaluare și pentru a debloca insigna oficială de Excel Formulas Master.
          </p>
          <button
            onClick={handleFinishExam}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20 transform hover:-translate-y-0.5 transition-all text-base"
          >
            Finalizează Evaluarea Sumativă
          </button>
        </div>
      )}

      {/* Results Report */}
      {examSubmitted && (
        <div className={`p-6 rounded-2xl border ${
          isPassed
            ? 'bg-emerald-950/50 border-emerald-500/50 text-white'
            : 'bg-amber-950/50 border-amber-500/50 text-white'
        } space-y-4 shadow-2xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isPassed ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
              }`}>
                {isPassed ? <ShieldCheck className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
              </div>
              <div>
                <h2 className="text-2xl font-black">
                  {isPassed ? 'Evaluare Promovată cu Succes!' : 'Mai ai nevoie de puțină recapitulare'}
                </h2>
                <p className="text-slate-300 text-sm">
                  Ai obținut {correctCount} răspunsuri corecte din {EXAM_QUESTIONS.length} ({percentage}%).
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-3xl font-black text-emerald-400">{percentage}%</span>
              <span className="block text-[11px] text-slate-400 uppercase font-semibold">Nota {percentage / 10}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-slate-300 leading-relaxed">
            {isPassed ? (
              <span>Felicitări! Stăpânești la perfecție formulele, ordinea de execuție, funcțiile statistice și logice, precum și diagnoza erorilor conform programei oficiale de clasa a VIII-a.</span>
            ) : (
              <span>Pragul de promovare este de 75%. Poți relua testul pentru a-ți îmbunătăți cunoștințele.</span>
            )}
          </div>

          {!isPassed && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleRetryExam}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Reia Testul
              </button>
            </div>
          )}
        </div>
      )}

      {/* Footer Navigation */}
      <PageNavigationFooter
        canProceed={examSubmitted && isPassed}
        onPrev={onPrev}
        onNext={() => {
          sounds.playCorrect();
          if (onCompletePage) onCompletePage(100);
          else if (onComplete) onComplete();
        }}
        nextLabel="Revendică Diploma & Insigna (Finalizare)"
      />
    </div>
  );
};
