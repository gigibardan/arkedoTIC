import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Globe,
  FileCheck
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface W2Level7Props {
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
    title: 'Găzduirea și Salvarea Proiectelor Google Sites',
    questionText: 'Unde se salvează automat fișierele și modificările efectuate într-un site creat cu Google Sites conform manualului de clasa a VIII-a (pag. 44)?',
    hint: 'Google Sites face parte din suita Google Workspace Cloud. Nu există buton manual de Salvează (Save) deoarece salvarea este continuă în spațiul tău de stocare.',
    options: [
      { id: 'a', text: 'A. În memoria RAM a calculatorului, ștergându-se la oprirea PC-ului' },
      { id: 'b', text: 'B. Automat pe contul tău Google Drive, într-un fișier dedicat asociat site-ului' },
      { id: 'c', text: 'C. Pe un stick USB pe care trebuie să îl introduci obligatoriu în portul 1' },
      { id: 'd', text: 'D. Într-un folder C:\\Windows\\System32\\Sites' }
    ],
    correctOptionId: 'b',
    explanation: 'Corect! Orice site creat este salvat continuu și în timp real în Google Drive ca un document de tip Google Sites, putând fi accesat de pe orice dispozitiv conectat la internet.',
    manualRef: 'Manual pag. 44'
  },
  {
    id: 'q2',
    questionNumber: 2,
    title: 'Structura Panoului Lateral Dreapta',
    questionText: 'Care sunt cele 3 file esențiale din panoul lateral dreapta al mediului de editare Google Sites și în ce ordine logică sunt organizate?',
    hint: 'Manual pag. 45: Panoul din dreapta este inima editării: adaugi elemente, organizezi arborele de navigare și schimbi identitatea vizuală.',
    options: [
      { id: 'a', text: 'A. Fișier, Editare, Vizualizare' },
      { id: 'b', text: 'B. Inserare (Insert), Pagini (Pages), Teme (Themes)' },
      { id: 'c', text: 'C. Font, Paragraf, Stiluri' },
      { id: 'd', text: 'D. C++, Algoritmi, Matrici' }
    ],
    correctOptionId: 'b',
    explanation: 'Corect! Cele trei file fundamentale sunt: Inserare (adăugare casete, imagini, blocuri, widgeturi), Pagini (ierarhia și subpaginile) și Teme (paleta de culori și fonturile globale).',
    manualRef: 'Manual pag. 45'
  },
  {
    id: 'q3',
    questionNumber: 3,
    title: 'Tipuri de Antet (Header Types)',
    questionText: 'Dorești ca prima pagină a revistei școlare să aibă un impact vizual masiv, în care o imagine mare de înaltă rezoluție să ocupe tot ecranul vizitatorului înainte de a derula. Ce tip de antet alegi conform manualului (pag. 46)?',
    hint: 'Manual pag. 46: Opțiunea Tip de antet oferă 4 variante: Doar titlu, Banner, Banner mare și Copertă (Cover).',
    options: [
      { id: 'a', text: 'A. Doar titlu (Title only)' },
      { id: 'b', text: 'B. Copertă (Cover)' },
      { id: 'c', text: 'C. Banner îngust' },
      { id: 'd', text: 'D. Subsol ascuns' }
    ],
    correctOptionId: 'b',
    explanation: 'Excelent! Tipul de antet „Copertă” (Cover) extinde imaginea pe întreaga înălțime a ferestrei de navigare a utilizatorului, fiind ideal pentru paginile de pornire cu impact vizual puternic.',
    manualRef: 'Manual pag. 46'
  },
  {
    id: 'q4',
    questionNumber: 4,
    title: 'Secțiuni & Machete de Conținut Predefinite',
    questionText: 'Care este principalul avantaj al folosirii unui Bloc de Conținut (Content Block) din fila Inserare în loc de adăugarea manuală și izolată a textelor și imaginilor (pag. 48)?',
    hint: 'Machetele leagă structural imaginile și casetele de text asociate, garantând că nu se vor suprapune greșit la redimensionarea ecranului.',
    options: [
      { id: 'a', text: 'A. Blocurile de conținut garantează alinierea proporțională și adaptarea automată responsivă pe tablete și telefoane fără decalaje neplăcute' },
      { id: 'b', text: 'B. Blocurile de conținut transformă automat site-ul într-un joc 3D' },
      { id: 'c', text: 'C. Doar blocurile de conținut pot fi colorate în galben' },
      { id: 'd', text: 'D. Niciun avantaj, este exact același lucru' }
    ],
    correctOptionId: 'a',
    explanation: 'Corect! Blocurile de conținut sunt machete inteligente care mențin asocierile corecte între fotografii și descrieri și se rearanjează automat și ordonat pe ecranele tactile mici.',
    manualRef: 'Manual pag. 48'
  },
  {
    id: 'q5',
    questionNumber: 5,
    title: 'Sincronizarea cu Ecosistemul Google Workspace',
    questionText: 'Dacă ai încorporat un formular Google Forms pentru înscrieri și o foaie Google Sheets cu orarul cursurilor pe site-ul școlii, ce acțiune este necesară atunci când actualizezi orarul în Google Sheets (pag. 49)?',
    hint: 'Google Workspace funcționează pe principiul integrării cloud în timp real.',
    options: [
      { id: 'a', text: 'A. Trebuie să ștergi site-ul și să cumperi un domeniu nou' },
      { id: 'b', text: 'B. Nicio acțiune pe site; datele din foaia de calcul se sincronizează automat în timp real pentru toți vizitatorii' },
      { id: 'c', text: 'C. Trebuie să rescrii manual codul HTML în fiecare seară la ora 20:00' },
      { id: 'd', text: 'D. Trebuie să contactezi operatorul de telecomunicații' }
    ],
    correctOptionId: 'b',
    explanation: 'Excelent! Conectarea directă cu fișierele din Google Drive asigură afișarea instantanee a celor mai recente modificări fără a fi necesară reconstruirea sau re-inserarea componentelor.',
    manualRef: 'Manual pag. 49'
  }
];

export const W2Level7_GoogleSitesExam: React.FC<W2Level7Props> = ({
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

  // Calculate score
  const totalQuestions = EXAM_QUESTIONS.length;
  const correctCount = EXAM_QUESTIONS.filter(
    q => submittedAnswers[q.id] && selectedAnswers[q.id] === q.correctOptionId
  ).length;
  const score = Math.round((correctCount / totalQuestions) * 90 + 10); // 10 points default (Romanian grade 10)
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
              <span>Unitatea 2: Pagini Web & Proiecte Online • Modulul 2B</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Lecția 7: Evaluare Sumativă Oficială – Crearea și Structurarea Site-urilor Web
            </h1>
            <p className="text-indigo-100 text-sm md:text-base mt-1 max-w-3xl">
              Manual Art Klett pag. 51: Demonstrează stăpânirea completă a platformei Google Sites: structură multi-pagină,
              navigare, blocuri de conținut, teme vizuale și integrare Google Workspace.
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
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Progres Evaluare</div>
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

              <p className="text-sm text-slate-700 font-medium mb-4 leading-relaxed">
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
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-xl text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur mx-auto flex items-center justify-center">
            <Award className="w-10 h-10 text-amber-300" />
          </div>
          <h2 className="text-2xl font-black">
            Felicitări! Ai finalizat cu succes Evaluarea Sumativă Modul 2B!
          </h2>
          <p className="text-emerald-100 text-sm max-w-xl mx-auto">
            Ai demonstrat cunoștințe temeinice de structurare a site-urilor web în Google Sites,
            design responsive, machetare de conținut și integrare Google Workspace.
          </p>
          <div className="pt-2">
            <button
              onClick={handleFinish}
              className="px-8 py-3.5 bg-white text-emerald-900 font-extrabold rounded-xl shadow-lg hover:bg-emerald-50 transition transform hover:scale-105"
            >
              Deblochează Diploma Oficială & Revendică Punctele &rarr;
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
        nextLabel="Revendică Diploma de Arhitect Google Sites"
      />
    </div>
  );
};
