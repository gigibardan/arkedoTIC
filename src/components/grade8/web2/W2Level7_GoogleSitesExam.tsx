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
import { useLanguage } from '../../../context/LanguageContext';

interface W2Level7Props {
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
    titleRo: 'Găzduirea și Salvarea Proiectelor Google Sites',
    titleEn: 'Hosting & Auto-Saving Google Sites Projects',
    questionTextRo: 'Unde se salvează automat fișierele și modificările efectuate într-un site creat cu Google Sites conform manualului de clasa a VIII-a (pag. 44)?',
    questionTextEn: 'Where are project files and real-time edits automatically stored when building a site with Google Sites according to 8th grade curriculum (p. 44)?',
    hintRo: 'Google Sites face parte din suita Google Workspace Cloud. Nu există buton manual de Salvează (Save) deoarece salvarea este continuă în spațiul tău de stocare.',
    hintEn: 'Google Sites is part of Google Workspace Cloud. There is no manual Save button because edits synchronize continuously to your cloud storage.',
    options: [
      {
        id: 'a',
        textRo: 'A. În memoria RAM a calculatorului, ștergându-se la oprirea PC-ului',
        textEn: 'A. In temporary computer RAM, getting wiped when the PC turns off'
      },
      {
        id: 'b',
        textRo: 'B. Automat pe contul tău Google Drive, într-un fișier dedicat asociat site-ului',
        textEn: 'B. Automatically in your Google Drive account, inside a dedicated site document'
      },
      {
        id: 'c',
        textRo: 'C. Pe un stick USB pe care trebuie să îl introduci obligatoriu în portul 1',
        textEn: 'C. On a USB flash drive that must be inserted into port 1'
      },
      {
        id: 'd',
        textRo: 'D. Într-un folder C:\\Windows\\System32\\Sites',
        textEn: 'D. Inside a local C:\\Windows\\System32\\Sites directory'
      }
    ],
    correctOptionId: 'b',
    explanationRo: 'Corect! Orice site creat este salvat continuu și în timp real în Google Drive ca un document de tip Google Sites, putând fi accesat de pe orice dispozitiv conectat la internet.',
    explanationEn: 'Correct! Every created site is saved continuously in real time within Google Drive as a Google Sites document, accessible from any internet-connected device.',
    manualRefRo: 'Manual pag. 44',
    manualRefEn: 'Curriculum p. 44'
  },
  {
    id: 'q2',
    questionNumber: 2,
    titleRo: 'Structura Panoului Lateral Dreapta',
    titleEn: 'Right Sidebar Organization & Tabs',
    questionTextRo: 'Care sunt cele 3 file esențiale din panoul lateral dreapta al mediului de editare Google Sites și în ce ordine logică sunt organizate?',
    questionTextEn: 'What are the three essential tabs in the right sidebar of the Google Sites editor, and in what logical order are they organized?',
    hintRo: 'Manual pag. 45: Panoul din dreapta este inima editării: adaugi elemente, organizezi arborele de navigare și schimbi identitatea vizuală.',
    hintEn: 'Curriculum p. 45: The right panel is the core: insert components, arrange page hierarchy, and customize visual themes.',
    options: [
      {
        id: 'a',
        textRo: 'A. Fișier, Editare, Vizualizare',
        textEn: 'A. File, Edit, View'
      },
      {
        id: 'b',
        textRo: 'B. Inserare (Insert), Pagini (Pages), Teme (Themes)',
        textEn: 'B. Insert, Pages, Themes'
      },
      {
        id: 'c',
        textRo: 'C. Font, Paragraf, Stiluri',
        textEn: 'C. Font, Paragraph, Styles'
      },
      {
        id: 'd',
        textRo: 'D. C++, Algoritmi, Matrici',
        textEn: 'D. C++, Algorithms, Matrices'
      }
    ],
    correctOptionId: 'b',
    explanationRo: 'Corect! Cele trei file fundamentale sunt: Inserare (adăugare casete, imagini, blocuri, widgeturi), Pagini (ierarhia și subpaginile) și Teme (paleta de culori și fonturile globale).',
    explanationEn: 'Correct! The three cornerstone tabs are: Insert (text, images, content blocks, widgets), Pages (site hierarchy and subpages), and Themes (colors and typography).',
    manualRefRo: 'Manual pag. 45',
    manualRefEn: 'Curriculum p. 45'
  },
  {
    id: 'q3',
    questionNumber: 3,
    titleRo: 'Tipuri de Antet (Header Types)',
    titleEn: 'Banner & Header Types',
    questionTextRo: 'Dorești ca prima pagină a revistei școlare să aibă un impact vizual masiv, în care o imagine mare de înaltă rezoluție să ocupe tot ecranul vizitatorului înainte de a derula. Ce tip de antet alegi conform manualului (pag. 46)?',
    questionTextEn: 'You want your school magazine homepage to make an immersive visual impact where a high-res hero image occupies the full viewport before scrolling. Which header type do you choose (p. 46)?',
    hintRo: 'Manual pag. 46: Opțiunea Tip de antet oferă 4 variante: Doar titlu, Banner, Banner mare și Copertă (Cover).',
    hintEn: 'Curriculum p. 46: The Header Type menu offers 4 options: Title only, Banner, Large banner, and Cover.',
    options: [
      {
        id: 'a',
        textRo: 'A. Doar titlu (Title only)',
        textEn: 'A. Title only'
      },
      {
        id: 'b',
        textRo: 'B. Copertă (Cover)',
        textEn: 'B. Cover'
      },
      {
        id: 'c',
        textRo: 'C. Banner îngust',
        textEn: 'C. Thin banner'
      },
      {
        id: 'd',
        textRo: 'D. Subsol ascuns',
        textEn: 'D. Hidden footer'
      }
    ],
    correctOptionId: 'b',
    explanationRo: 'Excelent! Tipul de antet „Copertă” (Cover) extinde imaginea pe întreaga înălțime a ferestrei de navigare a utilizatorului, fiind ideal pentru paginile de pornire cu impact vizual puternic.',
    explanationEn: 'Excellent! The "Cover" header type expands the hero background to fill the user viewport height, making it ideal for impactful launch pages.',
    manualRefRo: 'Manual pag. 46',
    manualRefEn: 'Curriculum p. 46'
  },
  {
    id: 'q4',
    questionNumber: 4,
    titleRo: 'Secțiuni & Machete de Conținut Predefinite',
    titleEn: 'Predefined Content Blocks & Layouts',
    questionTextRo: 'Care este principalul avantaj al folosirii unui Bloc de Conținut (Content Block) din fila Inserare în loc de adăugarea manuală și izolată a textelor și imaginilor (pag. 48)?',
    questionTextEn: 'What is the primary benefit of using a Content Block template from the Insert tab instead of floating standalone texts and images (p. 48)?',
    hintRo: 'Machetele leagă structural imaginile și casetele de text asociate, garantând că nu se vor suprapune greșit la redimensionarea ecranului.',
    hintEn: 'Layout blocks structurally pair images with captions, guaranteeing proper flow and zero overlap during screen resize.',
    options: [
      {
        id: 'a',
        textRo: 'A. Blocurile de conținut garantează alinierea proporțională și adaptarea automată responsivă pe tablete și telefoane fără decalaje neplăcute',
        textEn: 'A. Content blocks guarantee proportional alignment and automatic responsive reordering on phones/tablets without awkward spacing'
      },
      {
        id: 'b',
        textRo: 'B. Blocurile de conținut transformă automat site-ul într-un joc 3D',
        textEn: 'B. Content blocks automatically turn the website into a 3D video game'
      },
      {
        id: 'c',
        textRo: 'C. Doar blocurile de conținut pot fi colorate în galben',
        textEn: 'C. Only content blocks can be colored in yellow'
      },
      {
        id: 'd',
        textRo: 'D. Niciun avantaj, este exact același lucru',
        textEn: 'D. No benefit, it performs identically to blank drag-and-drop'
      }
    ],
    correctOptionId: 'a',
    explanationRo: 'Corect! Blocurile de conținut sunt machete inteligente care mențin asocierile corecte între fotografii și descrieri și se rearanjează automat și ordonat pe ecranele tactile mici.',
    explanationEn: 'Correct! Content blocks are responsive layout grids keeping media paired with copy, stacking tidily on narrow mobile viewports.',
    manualRefRo: 'Manual pag. 48',
    manualRefEn: 'Curriculum p. 48'
  },
  {
    id: 'q5',
    questionNumber: 5,
    titleRo: 'Sincronizarea cu Ecosistemul Google Workspace',
    titleEn: 'Cloud Integration with Google Workspace',
    questionTextRo: 'Dacă ai încorporat un formular Google Forms pentru înscrieri și o foaie Google Sheets cu orarul cursurilor pe site-ul școlii, ce acțiune este necesară atunci când actualizezi orarul în Google Sheets (pag. 49)?',
    questionTextEn: 'If you embedded a Google Form for registrations and a Google Sheet with course schedules, what step is required when you update the schedule in Google Sheets (p. 49)?',
    hintRo: 'Google Workspace funcționează pe principiul integrării cloud în timp real.',
    hintEn: 'Google Workspace operates on real-time cloud data binding.',
    options: [
      {
        id: 'a',
        textRo: 'A. Trebuie să ștergi site-ul și să cumperi un domeniu nou',
        textEn: 'A. You must delete the site and purchase a brand new domain name'
      },
      {
        id: 'b',
        textRo: 'B. Nicio acțiune pe site; datele din foaia de calcul se sincronizează automat în timp real pentru toți vizitatorii',
        textEn: 'B. No action on the site; spreadsheet updates sync automatically in real time for all visitors'
      },
      {
        id: 'c',
        textRo: 'C. Trebuie să rescrii manual codul HTML în fiecare seară la ora 20:00',
        textEn: 'C. You must manually rewrite the HTML code every evening at 8:00 PM'
      },
      {
        id: 'd',
        textRo: 'D. Trebuie să contactezi operatorul de telecomunicații',
        textEn: 'D. You must call your internet service provider'
      }
    ],
    correctOptionId: 'b',
    explanationRo: 'Excelent! Conectarea directă cu fișierele din Google Drive asigură afișarea instantanee a celor mai recente modificări fără a fi necesară reconstruirea sau re-inserarea componentelor.',
    explanationEn: 'Excellent! Live cloud embedding from Google Drive ensures visitors immediately see fresh spreadsheet data without needing to re-embed components or re-publish.',
    manualRefRo: 'Manual pag. 49',
    manualRefEn: 'Curriculum p. 49'
  }
];

export const W2Level7_GoogleSitesExam: React.FC<W2Level7Props> = ({
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
              <span>
                {lang === 'ro'
                  ? 'Unitatea 2: Pagini Web & Proiecte Online • Modulul 2B'
                  : 'Unit 2: Web Pages & Online Projects • Module 2B'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {lang === 'ro'
                ? 'Lecția 7: Evaluare Sumativă Oficială – Crearea și Structurarea Site-urilor Web'
                : 'Lesson 7: Official Summative Assessment – Creating & Structuring Websites'}
            </h1>
            <p className="text-indigo-100 text-sm md:text-base mt-1 max-w-3xl">
              {lang === 'ro'
                ? 'Manual Art Klett pag. 51: Demonstrează stăpânirea completă a platformei Google Sites: structură multi-pagină, navigare, blocuri de conținut, teme vizuale și integrare Google Workspace.'
                : 'Curriculum p. 51: Demonstrate mastery of Google Sites: multi-page hierarchy, navigation, content blocks, visual branding themes, and real-time Google Workspace cloud embedding.'}
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
              {lang === 'ro' ? 'Progres Evaluare' : 'Assessment Progress'}
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
              {lang === 'ro' ? 'Nota Estimată' : 'Estimated Grade'}
            </div>
            <div className="text-2xl font-black text-indigo-700">
              {score >= 10 ? (score / 10).toFixed(1) : '1.0'} / 10
            </div>
          </div>
          <div className="bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 text-xs font-bold text-indigo-800">
            {isAllAnswered
              ? lang === 'ro'
                ? 'Evaluare Finalizată 🎉'
                : 'Assessment Completed 🎉'
              : lang === 'ro'
              ? 'În Desfășurare'
              : 'In Progress'}
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

      {/* Completion Banner */}
      {isAllAnswered && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-xl text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur mx-auto flex items-center justify-center">
            <Award className="w-10 h-10 text-amber-300" />
          </div>
          <h2 className="text-2xl font-black">
            {lang === 'ro'
              ? 'Felicitări! Ai finalizat cu succes Evaluarea Sumativă Modul 2B!'
              : 'Congratulations! You successfully finished Summative Assessment Module 2B!'}
          </h2>
          <p className="text-emerald-100 text-sm max-w-xl mx-auto">
            {lang === 'ro'
              ? 'Ai demonstrat cunoștințe temeinice de structurare a site-urilor web în Google Sites, design responsive, machetare de conținut și integrare Google Workspace.'
              : 'You have shown solid mastery of Google Sites web architecture, responsive viewport design, content layouts, and cloud Workspace embedding.'}
          </p>
          <div className="pt-2">
            <button
              onClick={handleFinish}
              className="px-8 py-3.5 bg-white text-emerald-900 font-extrabold rounded-xl shadow-lg hover:bg-emerald-50 transition transform hover:scale-105"
            >
              {lang === 'ro'
                ? 'Deblochează Diploma Oficială & Revendică Punctele →'
                : 'Unlock Official Diploma & Claim Reward Points →'}
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
            ? 'Revendică Diploma de Arhitect Google Sites'
            : 'Claim Google Sites Architect Diploma'
        }
      />
    </div>
  );
};
