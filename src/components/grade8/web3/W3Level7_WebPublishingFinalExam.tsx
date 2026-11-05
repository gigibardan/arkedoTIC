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
import { useLanguage } from '../../../context/LanguageContext';

interface W3Level7Props {
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
    titleRo: 'Publicare & Propagare pe Web',
    titleEn: 'Web Publishing & Propagation',
    questionTextRo: 'Care este diferența esențială dintre salvarea automată pe Google Drive și acțiunea de „Publicare” (Publish) în Google Sites (pag. 52)?',
    questionTextEn: 'What is the fundamental difference between Google Drive cloud auto-saving and the explicit "Publish" action in Google Sites (p. 52)?',
    hintRo: 'Google Drive salvează ciorna (Draft) privată pe care lucrezi tu. Publicarea este comutatorul care o face vizibilă pe internet.',
    hintEn: 'Drive continuously commits your private work-in-progress draft. Publishing is the explicit promotion switch exposing it to the worldwide web.',
    options: [
      {
        id: 'a',
        textRo: 'A. Salvarea pe Drive șterge calculatorul, iar publicarea îl repornește',
        textEn: 'A. Drive auto-save wipes the computer, while publishing restarts it'
      },
      {
        id: 'b',
        textRo: 'B. Salvarea pe Drive păstrează modificările în modul privat de lucru (ciornă), în timp ce Publicarea face versiunea respectivă vizibilă pentru vizitatorii de pe internet',
        textEn: 'B. Drive saves changes into private editing drafts, while Publishing promotes that revision into a publicly browsable website'
      },
      {
        id: 'c',
        textRo: 'C. Publicarea necesită trimiterea unui DVD prin poștă la sediul Google din California',
        textEn: 'C. Publishing requires mailing a physical DVD to Google headquarters in California'
      },
      {
        id: 'd',
        textRo: 'D. Nu este nicio diferență, Google Sites publică orice literă tastată instantaneu pe internet fără control',
        textEn: 'D. There is no difference; every keystroke immediately goes live without editorial control'
      }
    ],
    correctOptionId: 'b',
    explanationRo: 'Corect! Salvarea este automată și continuă pe Drive ca ciornă privată, însă vizitatorii externi văd modificările doar după ce autorul apasă explicit butonul albastru „Publicați” (Publish).',
    explanationEn: 'Correct! Auto-saving is continuous in Drive as a private draft, but external visitors only observe updates once the author explicitly triggers the "Publish" button.',
    manualRefRo: 'Manual pag. 52',
    manualRefEn: 'Curriculum p. 52'
  },
  {
    id: 'q2',
    questionNumber: 2,
    titleRo: 'Gestionarea Rolurilor de Colaborare',
    titleEn: 'Collaborative Role Permissions',
    questionTextRo: 'Echipa ta dorește să ceară feedback de la colegii din alte clase, dar fără ca aceștia să poată șterge sau altera conținutul paginilor. Ce setare de acces alegeți conform manualului (pag. 53)?',
    questionTextEn: 'Your team wants peer feedback from other classes without allowing them to delete or tamper with page content. Which access policy should you configure (p. 53)?',
    hintRo: 'Manual pag. 53: În panoul de partajare se poate seta accesul ca Cititor (Viewer) pentru public/colegi, păstrând dreptul de Redactor (Editor) exclusiv pentru membrii echipei.',
    hintEn: 'Curriculum p. 53: Configure Published Viewer privileges for peer reviewers while reserving Editor access strictly for project team co-authors.',
    options: [
      {
        id: 'a',
        textRo: 'A. Acordarea rolului de Redactor (Editor) cu drepturi depline tuturor utilizatorilor',
        textEn: 'A. Granting Editor write privileges with full administrative rights to everyone'
      },
      {
        id: 'b',
        textRo: 'B. Publicarea site-ului cu rolul de Cititor al site-ului publicat (Published Viewer) pentru colegi, menținând dreptul de editare doar pentru echipa de proiect',
        textEn: 'B. Publishing with Published Viewer permissions for peer review, keeping Editor rights strictly for the primary project team'
      },
      {
        id: 'c',
        textRo: 'C. Ștergerea tuturor parolelor din Google Drive',
        textEn: 'C. Deleting all passwords from Google Drive'
      },
      {
        id: 'd',
        textRo: 'D. Trimiterea capturilor de ecran prin fax',
        textEn: 'D. Transmitting screenshots via analog fax'
      }
    ],
    correctOptionId: 'b',
    explanationRo: 'Corect! Separarea riguroasă a rolurilor (Redactor pentru creatori, Cititor pentru public) protejează integritatea sitului și previne incidentele de securitate sau pierderea de date.',
    explanationEn: 'Correct! Strict role separation (Editor for authorized creators, Viewer for public visitors) guards project integrity and prevents accidental or malicious data loss.',
    manualRefRo: 'Manual pag. 53',
    manualRefEn: 'Curriculum p. 53'
  },
  {
    id: 'q3',
    questionNumber: 3,
    titleRo: 'Drepturi de Autor & Creative Commons',
    titleEn: 'Copyright & Creative Commons Licenses',
    questionTextRo: 'Găsești o ilustrație remarcabilă marcată cu licența „CC BY-NC 4.0”. În ce condiții o poți utiliza legal pe site-ul proiectului tău școlar conform manualului (pag. 54–55)?',
    questionTextEn: 'You discover an illustration carrying a "CC BY-NC 4.0" license. Under what lawful conditions can you embed it into your school web project (p. 54–55)?',
    hintRo: 'CC BY-NC conține două cerințe: BY (menționarea autorului) și NC (utilizare exclusiv necomercială/educațională).',
    hintEn: 'CC BY-NC combines two distinct requirements: BY (mandatory attribution) and NC (strictly non-commercial educational reuse).',
    options: [
      {
        id: 'a',
        textRo: 'A. O poți vinde pe bani fără să spui nimănui cine a creat-o',
        textEn: 'A. You may resell it for profit without crediting the creator'
      },
      {
        id: 'b',
        textRo: 'B. O poți folosi gratuit în proiectul școlar educațional (fără scop comercial), cu condiția obligatorie de a menționa autorul și licența originală',
        textEn: 'B. You may use it freely within your non-profit educational project, with mandatory attribution to the original author and license terms'
      },
      {
        id: 'c',
        textRo: 'C. Nu o poți folosi deloc, este strict confidențială',
        textEn: 'C. You cannot use it at all; it is classified confidential'
      },
      {
        id: 'd',
        textRo: 'D. O poți folosi doar dacă o transformi în alb-negru',
        textEn: 'D. You may use it only after converting it into black-and-white'
      }
    ],
    correctOptionId: 'b',
    explanationRo: 'Excelent! Licența CC BY-NC permite utilizarea liberă în scopuri educaționale (fără activități economice aducătoare de profit), cu atribuirea clară a numelui autorului original.',
    explanationEn: 'Excellent! The CC BY-NC license allows open reuse for non-profit education while mandating clear attribution to the original creator.',
    manualRefRo: 'Manual pag. 54–55',
    manualRefEn: 'Curriculum p. 54–55'
  },
  {
    id: 'q4',
    questionNumber: 4,
    titleRo: 'Securitate Web & Protocolul HTTPS',
    titleEn: 'Web Security & The HTTPS Protocol',
    questionTextRo: 'De ce Google Sites și toate browserele moderne impun protocolul HTTPS în locul vechiului HTTP (pag. 55)?',
    questionTextEn: 'Why do Google Sites and modern web browsers enforce HTTPS instead of legacy HTTP (p. 55)?',
    hintRo: 'HTTPS utilizează criptare SSL/TLS pe portul 443 pentru a împiedica interceptarea pachetelor de date pe rețea.',
    hintEn: 'HTTPS leverages SSL/TLS encryption over port 443 to prevent eavesdropping and data tampering on network transit lines.',
    options: [
      {
        id: 'a',
        textRo: 'A. HTTPS criptează traficul de date între browser și server, protejând informațiile împotriva interceptării și atacurilor cibernetice de tip Man-in-the-Middle',
        textEn: 'A. HTTPS encrypts packet traffic between browser and server, defending data against interception and Man-in-the-Middle cyber attacks'
      },
      {
        id: 'b',
        textRo: 'B. HTTPS face literele mai mari și mai îngroșate pe ecran',
        textEn: 'B. HTTPS makes fonts render in larger bold styles'
      },
      {
        id: 'c',
        textRo: 'C. Deoarece litera S vine de la Sunet și face site-ul să cânte',
        textEn: 'C. Because the "S" stands for Sound, enabling background music'
      },
      {
        id: 'd',
        textRo: 'D. Nu există niciun motiv, este o simplă alegere de modă',
        textEn: 'D. There is no technical rationale; it is just a styling fashion'
      }
    ],
    correctOptionId: 'a',
    explanationRo: 'Corect! Protocolul HTTPS este pilonul de securitate al web-ului modern: prin criptare matematică avansată, nimeni nu poate citi datele transmise în tranzit pe rețea.',
    explanationEn: 'Correct! HTTPS is the foundational pillar of modern web security: advanced end-to-end cryptographic ciphers prevent packet inspection in transit.',
    manualRefRo: 'Manual pag. 55',
    manualRefEn: 'Curriculum p. 55'
  },
  {
    id: 'q5',
    questionNumber: 5,
    titleRo: 'Optimizare SEO & Accesibilitate',
    titleEn: 'SEO Optimization & Web Accessibility',
    questionTextRo: 'Care dintre următoarele acțiuni contribuie direct la o clasare mai bună în căutările Google și la accesibilitatea elevilor cu deficiențe de vedere (pag. 56)?',
    questionTextEn: 'Which of the following actions directly promotes both superior Google ranking and accessibility for visually impaired students (p. 56)?',
    hintRo: 'Titlurile descriptive, meta descrierile clare și textul alternativ (alt) pentru imagini sunt fundamentul web-ului accesibil.',
    hintEn: 'Descriptive title tags, rich meta descriptions, and alternative text (alt) for images represent the core of accessible, indexable web design.',
    options: [
      {
        id: 'a',
        textRo: 'A. Completarea unui titlu descriptiv de 50 caractere și a atributului alt pentru fiecare imagine din site',
        textEn: 'A. Specifying an informative 50-character page title and descriptive alt attributes for all embedded images'
      },
      {
        id: 'b',
        textRo: 'B. Scrierea tuturor cuvintelor legate fără niciun spațiu liber',
        textEn: 'B. Concatenating all sentences into one continuous string without spaces'
      },
      {
        id: 'c',
        textRo: 'C. Încărcarea de imagini uriașe de 50 de megabytes',
        textEn: 'C. Uploading bloated 50 MB raw camera photos'
      },
      {
        id: 'd',
        textRo: 'D. Ascunderea paginilor principale din meniu',
        textEn: 'D. Hiding primary pages from the top navigation bar'
      }
    ],
    correctOptionId: 'a',
    explanationRo: 'Excelent! Un titlu calibrat optim și textele alternative (alt) ajută robotul Google să clasifice corect subiectul paginii și permit cititoarelor de ecran să asigure o experiență incluzivă tuturor elevilor.',
    explanationEn: 'Excellent! Well-calibrated page titles and image alt attributes help search crawlers parse subject relevance while enabling screen readers to provide an inclusive learning experience for everyone.',
    manualRefRo: 'Manual pag. 56',
    manualRefEn: 'Curriculum p. 56'
  }
];

export const W3Level7_WebPublishingFinalExam: React.FC<W3Level7Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();
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
              <span>
                {lang === 'ro'
                  ? 'Unitatea 2: Pagini Web & Proiecte Online • Modulul 2C'
                  : 'Unit 2: Web Pages & Online Projects • Module 2C'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {lang === 'ro'
                ? 'Lecția 7: Evaluare Sumativă a Unității 2 – Publicare Web, Securitate & Drepturi de Autor'
                : 'Lesson 7: Unit 2 Summative Assessment – Web Publishing, Security & Copyright'}
            </h1>
            <p className="text-indigo-100 text-sm md:text-base mt-1 max-w-3xl">
              {lang === 'ro'
                ? 'Manual Art Klett pag. 57–58: Demonstrează stăpânirea completă a conceptelor de publicare web, permisiuni colaborative, licențe Creative Commons, securitate HTTPS și audit calitativ SEO.'
                : 'Curriculum p. 57–58: Demonstrate complete mastery of web deployment, team permission workflows, Creative Commons licensing, HTTPS protocol, and SEO quality audits.'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-indigo-200 font-bold block">
              {lang === 'ro' ? 'Nivel' : 'Level'}
            </span>
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
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
              {lang === 'ro' ? 'Progres Evaluare Sumativă' : 'Summative Assessment Progress'}
            </div>
            <div className="text-lg font-black text-slate-800">
              {lang === 'ro'
                ? `${correctCount} din ${totalQuestions} cerințe validate`
                : `${correctCount} of ${totalQuestions} requirements validated`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
              {lang === 'ro' ? 'Nota Finală Unitatea 2' : 'Final Unit 2 Grade'}
            </div>
            <div className="text-2xl font-black text-indigo-700">
              {score >= 10 ? (score / 10).toFixed(1) : '1.0'} / 10
            </div>
          </div>
          <div className="bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 text-xs font-bold text-indigo-800">
            {isAllAnswered
              ? lang === 'ro' ? 'Unitate Finalizată 🎉' : 'Unit Completed 🎉'
              : lang === 'ro' ? 'În Desfășurare' : 'In Progress'}
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
                    <h3 className="font-bold text-slate-800 text-base">
                      {lang === 'ro' ? q.titleRo : q.titleEn}
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {lang === 'ro' ? q.manualRefRo : q.manualRefEn}
                    </span>
                  </div>
                </div>

                <QuestionHint
                  hintRo={q.hintRo}
                  hintEn={q.hintEn}
                  isOpen={showHints[q.id] || false}
                  onToggle={() => setShowHints(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                />
              </div>

              <p className="text-sm text-slate-700 font-medium mb-4 leading-relaxed">
                {lang === 'ro' ? q.questionTextRo : q.questionTextEn}
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
                      {lang === 'ro' ? opt.textRo : opt.textEn}
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
                  <span>{lang === 'ro' ? 'Validează Răspunsul' : 'Validate Answer'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <AnswerExplanation
                  explanation={lang === 'ro' ? q.explanationRo : q.explanationEn}
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
            {lang === 'ro'
              ? 'Extraordinar! Ai absolvit cu brio Unitatea 2: Pagini Web & Proiecte Online!'
              : 'Outstanding! You successfully graduated Unit 2: Web Pages & Online Projects!'}
          </h2>
          <p className="text-emerald-100 text-sm max-w-xl mx-auto">
            {lang === 'ro'
              ? 'Ai parcurs 21 de niveluri complete de programare HTML5, dezvoltare Google Sites, design responsive, audit calitativ, securitate cibernetică și etică digitală.'
              : 'You have mastered 21 complete modules across HTML5 semantics, Google Sites web authoring, responsive layouts, pre-flight audits, cybersecurity, and digital ethics.'}
          </p>
          <div className="pt-2">
            <button
              onClick={handleFinish}
              className="px-8 py-3.5 bg-white text-indigo-950 font-extrabold rounded-xl shadow-lg hover:bg-emerald-50 transition transform hover:scale-105"
            >
              {lang === 'ro'
                ? 'Deblochează Marea Diplomă de Web Publisher & Revendică Punctele →'
                : 'Unlock Grand Web Publisher Diploma & Claim Points →'}
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
        nextLabel={
          lang === 'ro'
            ? 'Revendică Diploma de Web Publisher & Cyber Ethics'
            : 'Claim Web Publisher & Cyber Ethics Diploma'
        }
      />
    </div>
  );
};
