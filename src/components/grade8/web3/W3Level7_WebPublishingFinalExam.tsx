import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Globe,
  FileCheck,
  Scale,
  Lock,
  Search
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface W3Level7Props {
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
    title: 'Publicare & Propagare pe Web',
    questionText: 'Care este diferența esențială dintre salvarea automată pe Google Drive și acțiunea de „Publicare” (Publish) în Google Sites (pag. 52)?',
    hint: 'Google Drive salvează ciorna (Draft) privată pe care lucrezi tu. Publicarea este comutatorul care o face vizibilă pe internet.',
    options: [
      { id: 'a', text: 'A. Salvarea pe Drive șterge calculatorul, iar publicarea îl repornește' },
      { id: 'b', text: 'B. Salvarea pe Drive păstrează modificările în modul privat de lucru (ciornă), în timp ce Publicarea face versiunea respectivă vizibilă pentru vizitatorii de pe internet' },
      { id: 'c', text: 'C. Publicarea necesită trimiterea unui DVD prin poștă la sediul Google din California' },
      { id: 'd', text: 'D. Nu este nicio diferență, Google Sites publică orice literă tastată instantaneu pe internet fără control' }
    ],
    correctOptionId: 'b',
    explanation: 'Corect! Salvarea este automată și continuă pe Drive ca ciornă privată, însă vizitatorii externi văd modificările doar după ce autorul apasă explicit butonul albastru „Publicați” (Publish).',
    manualRef: 'Manual pag. 52'
  },
  {
    id: 'q2',
    questionNumber: 2,
    title: 'Gestionarea Rolurilor de Colaborare',
    questionText: 'Echipa ta dorește să ceară feedback de la colegii din alte clase, dar fără ca aceștia să poată șterge sau altera conținutul paginilor. Ce setare de acces alegeți conform manualului (pag. 53)?',
    hint: 'Manual pag. 53: În panoul de partajare se poate seta accesul ca Cititor (Viewer) pentru public/colegi, păstrând dreptul de Redactor (Editor) exclusiv pentru membrii echipei.',
    options: [
      { id: 'a', text: 'A. Acordarea rolului de Redactor (Editor) cu drepturi depline tuturor utilizatorilor' },
      { id: 'b', text: 'B. Publicarea site-ului cu rolul de Cititor al site-ului publicat (Published Viewer) pentru colegi, menținând dreptul de editare doar pentru echipa de proiect' },
      { id: 'c', text: 'C. Ștergerea tuturor parolelor din Google Drive' },
      { id: 'd', text: 'D. Trimiterea capturilor de ecran prin fax' }
    ],
    correctOptionId: 'b',
    explanation: 'Corect! Separarea riguroasă a rolurilor (Redactor pentru creatori, Cititor pentru public) protejează integritatea sitului și previne incidentele de securitate sau pierderea de date.',
    manualRef: 'Manual pag. 53'
  },
  {
    id: 'q3',
    questionNumber: 3,
    title: 'Drepturi de Autor & Creative Commons',
    questionText: 'Găsești o ilustrație remarcabilă marcată cu licența „CC BY-NC 4.0”. În ce condiții o poți utiliza legal pe site-ul proiectului tău școlar conform manualului (pag. 54–55)?',
    hint: 'CC BY-NC conține două cerințe: BY (menționarea autorului) și NC (utilizare exclusiv necomercială/educațională).',
    options: [
      { id: 'a', text: 'A. O poți vinde pe bani fără să spui nimănui cine a creat-o' },
      { id: 'b', text: 'B. O poți folosi gratuit în proiectul școlar educațional (fără scop comercial), cu condiția obligatorie de a menționa autorul și licența originală' },
      { id: 'c', text: 'C. Nu o poți folosi deloc, este strict confidențială' },
      { id: 'd', text: 'D. O poți folosi doar dacă o transformi în alb-negru' }
    ],
    correctOptionId: 'b',
    explanation: 'Excelent! Licența CC BY-NC permite utilizarea liberă în scopuri educaționale (fără activități economice aducătoare de profit), cu atribuirea clară a numelui autorului original.',
    manualRef: 'Manual pag. 54–55'
  },
  {
    id: 'q4',
    questionNumber: 4,
    title: 'Securitate Web & Protocolul HTTPS',
    questionText: 'De ce Google Sites și toate browserele moderne impun protocolul HTTPS în locul vechiului HTTP (pag. 55)?',
    hint: 'HTTPS utilizează criptare SSL/TLS pe portul 443 pentru a împiedica interceptarea pachetelor de date pe rețea.',
    options: [
      { id: 'a', text: 'A. HTTPS criptează traficul de date între browser și server, protejând informațiile împotriva interceptării și atacurilor cibernetice de tip Man-in-the-Middle' },
      { id: 'b', text: 'B. HTTPS face literele mai mari și mai îngroșate pe ecran' },
      { id: 'c', text: 'C. Deoarece litera S vine de la Sunet și face site-ul să cânte' },
      { id: 'd', text: 'D. Nu există niciun motiv, este o simplă alegere de modă' }
    ],
    correctOptionId: 'a',
    explanation: 'Corect! Protocolul HTTPS este pilonul de securitate al web-ului modern: prin criptare matematică avansată, nimeni nu poate citi datele transmise în tranzit pe rețea.',
    manualRef: 'Manual pag. 55'
  },
  {
    id: 'q5',
    questionNumber: 5,
    title: 'Optimizare SEO & Accesibilitate',
    questionText: 'Care dintre următoarele acțiuni contribuie direct la o clasare mai bună în căutările Google și la accesibilitatea elevilor cu deficiențe de vedere (pag. 56)?',
    hint: 'Titlurile descriptive, meta descrierile clare și textul alternativ (alt) pentru imagini sunt fundamentul web-ului accesibil.',
    options: [
      { id: 'a', text: 'A. Completarea unui titlu descriptiv de 50 caractere și a atributului alt pentru fiecare imagine din site' },
      { id: 'b', text: 'B. Scrierea tuturor cuvintelor legate fără niciun spațiu liber' },
      { id: 'c', text: 'C. Încărcarea de imagini uriașe de 50 de megabytes' },
      { id: 'd', text: 'D. Ascunderea paginilor principale din meniu' }
    ],
    correctOptionId: 'a',
    explanation: 'Excelent! Un titlu calibrat optim și textele alternative (alt) ajută robotul Google să clasifice corect subiectul paginii și permit cititoarelor de ecran să asigure o experiență incluzivă tuturor elevilor.',
    manualRef: 'Manual pag. 56'
  }
];

export const W3Level7_WebPublishingFinalExam: React.FC<W3Level7Props> = ({
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

  // Score calculation: 10 points default (Romanian grade 1) + 18 points per question = max 100 points (grade 10)
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
              <span>Unitatea 2: Pagini Web & Proiecte Online • Modulul 2C</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Lecția 7: Evaluare Sumativă a Unității 2 – Publicare Web, Securitate & Drepturi de Autor
            </h1>
            <p className="text-indigo-100 text-sm md:text-base mt-1 max-w-3xl">
              Manual Art Klett pag. 57–58: Demonstrează stăpânirea completă a conceptelor de publicare web, permisiuni colaborative,
              licențe Creative Commons, securitate HTTPS și audit calitativ SEO.
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
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Progres Evaluare Sumativă</div>
            <div className="text-lg font-black text-slate-800">
              {correctCount} din {totalQuestions} cerințe validate
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Nota Finală Unitatea 2</div>
            <div className="text-2xl font-black text-indigo-700">
              {score >= 10 ? (score / 10).toFixed(1) : '1.0'} / 10
            </div>
          </div>
          <div className="bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 text-xs font-bold text-indigo-800">
            {isAllAnswered ? 'Unitate Finalizată 🎉' : 'În Desfășurare'}
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
                  onToggle={() => setShowHints(prev => ({ ...prev, [q.id]: !prev.q1 }))}
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

      {/* Final Unit 2 Completion Celebration Banner */}
      {isAllAnswered && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur mx-auto flex items-center justify-center">
            <Award className="w-10 h-10 text-amber-300" />
          </div>
          <h2 className="text-2xl font-black">
            Extraordinar! Ai absolvit cu brio Unitatea 2: Pagini Web & Proiecte Online!
          </h2>
          <p className="text-emerald-100 text-sm max-w-xl mx-auto">
            Ai parcurs 21 de niveluri complete de programare HTML5, dezvoltare Google Sites,
            design responsive, audit calitativ, securitate cibernetică și etică digitală.
          </p>
          <div className="pt-2">
            <button
              onClick={handleFinish}
              className="px-8 py-3.5 bg-white text-indigo-950 font-extrabold rounded-xl shadow-lg hover:bg-emerald-50 transition transform hover:scale-105"
            >
              Deblochează Marea Diplomă de Web Publisher & Revendică Punctele &rarr;
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
        nextLabel="Revendică Diploma de Web Publisher & Cyber Ethics"
      />
    </div>
  );
};
