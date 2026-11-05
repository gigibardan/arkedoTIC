import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Code2
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface W1Level7Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface ExamQuestion {
  id: string;
  topic: string;
  topicEn: string;
  question: string;
  questionEn: string;
  codeSnippet?: string;
  options: string[];
  optionsEn: string[];
  correctIndex: number;
  hint: string;
  hintEn: string;
  explanation: string;
  explanationEn: string;
}

const EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 'w1_exam_q1',
    topic: 'Structura & Scheletul HTML5',
    topicEn: 'HTML5 Structure & Skeleton',
    question: 'Care este ordinea corectă a etichetelor principale care alcătuiesc scheletul canonic al oricărui document HTML5?',
    questionEn: 'What is the correct sequential order of the primary tags composing the canonical skeleton of any HTML5 document?',
    options: [
      '<!DOCTYPE html>, urmat de <html>, apoi în interior <head> (cu <title>) și <body>',
      '<body>, urmat de <head>, apoi <html> și la final <!DOCTYPE html>',
      '<title>, urmat de <h1>, apoi <p> și la final <html>',
      '<html>, urmat direct de <p>, fără nicio altă etichetă obligatorie'
    ],
    optionsEn: [
      '<!DOCTYPE html>, followed by <html>, then nested within are <head> (with <title>) and <body>',
      '<body>, followed by <head>, then <html> and finally <!DOCTYPE html>',
      '<title>, followed by <h1>, then <p> and finally <html>',
      '<html>, followed directly by <p>, without any other mandatory tags'
    ],
    correctIndex: 0,
    hint: 'Gândește-te la anatomia corpului uman: întâi capul (head), apoi corpul (body), toate cuprinse în întreg (html).',
    hintEn: 'Think of human anatomy: first the head (metadata), then the body (visual content), all wrapped in the whole (html).',
    explanation: 'Manual pag. 38–39: Orice fișier HTML5 valid începe cu <!DOCTYPE html>, urmat de containerul <html>, care conține strict două secțiuni principale: <head> (metadate) și <body> (conținut vizual).',
    explanationEn: 'Textbook pages 38–39: Every valid HTML5 document begins with <!DOCTYPE html>, followed by the <html> root wrapper containing exactly two primary branches: <head> (metadata) and <body> (rendered visual content).'
  },
  {
    id: 'w1_exam_q2',
    topic: 'Titluri Semantice & Ierarhie',
    topicEn: 'Semantic Headings & Hierarchy',
    question: 'Ce etichetă este destinată titlului principal unic al unei pagini web, având cel mai mare impact semantic și SEO?',
    questionEn: 'Which tag is designated for the single primary heading of a web page, carrying maximum semantic weight and SEO impact?',
    options: [
      '<h1> — titlul de cel mai înalt nivel ierarhic',
      '<h6> — titlul de cel mai înalt nivel',
      '<head> — titlul care apare pe pagină',
      '<bold> — eticheta oficială de titlu'
    ],
    optionsEn: [
      '<h1> — top-level hierarchical heading',
      '<h6> — top-level hierarchical heading',
      '<head> — title appearing directly on the page surface',
      '<bold> — official heading tag'
    ],
    correctIndex: 0,
    hint: 'Numerele de la 1 la 6 indică importanța: 1 este cel mai important, 6 cel mai mic.',
    hintEn: 'Numbers from 1 to 6 denote importance: 1 is greatest, 6 is smallest.',
    explanation: 'Manual pag. 40: <h1> definește titlul cel mai important al documentului. Ierarhia coboară de la <h1> până la <h6>.',
    explanationEn: 'Textbook page 40: <h1> defines the foremost title of the document. The heading hierarchy descends smoothly from <h1> down to <h6>.'
  },
  {
    id: 'w1_exam_q3',
    topic: 'Atribute Hiperlegături',
    topicEn: 'Hyperlink Attributes',
    question: 'Un elev dorește ca la apăsarea unui link, pagina destinație să se deschidă într-o filă nouă a browserului. Ce cod este corect?',
    questionEn: 'A student wants a destination page to open in a brand new browser tab upon clicking a link. Which code is correct?',
    codeSnippet: '<a href="https://muzeu.ro" target="_blank">Vizitează Muzeul</a>',
    options: [
      '<a href="https://muzeu.ro" target="_blank">Vizitează Muzeul</a>',
      '<a url="https://muzeu.ro" newtab="yes">Vizitează Muzeul</a>',
      '<link to="https://muzeu.ro" open="new">Vizitează Muzeul</link>',
      '<a file="muzeu.ro">Vizitează Muzeul</a>'
    ],
    optionsEn: [
      '<a href="https://museum.org" target="_blank">Visit the Museum</a>',
      '<a url="https://museum.org" newtab="yes">Visit the Museum</a>',
      '<link to="https://museum.org" open="new">Visit the Museum</link>',
      '<a file="museum.org">Visit the Museum</a>'
    ],
    correctIndex: 0,
    hint: 'Atributul standard W3C pentru destinație este href, iar pentru filă nouă este target="_blank".',
    hintEn: 'The W3C standard destination attribute is href, and for a new tab target="_blank".',
    explanation: 'Manual pag. 42: Sintaxa corectă este <a href="..." target="_blank">...</a>. Atributul target="_blank" instruiește browserul să deschidă o nouă filă.',
    explanationEn: 'Textbook page 42: The exact syntax is <a href="..." target="_blank">...</a>. The target="_blank" attribute instructs the browser engine to spawn a new tab.'
  },
  {
    id: 'w1_exam_q4',
    topic: 'Imagini & Accesibilitate Web',
    topicEn: 'Images & Web Accessibility',
    question: 'De ce este obligatorie includerea atributului alt="..." în eticheta <img> conform standardelor internaționale de accesibilitate?',
    questionEn: 'Why is including the alt="..." attribute inside the <img> tag mandatory according to international accessibility guidelines?',
    options: [
      'Oferă un text descriptiv alternativ afișat dacă imaginea nu se poate încărca și citit de aplicațiile screen-reader pentru persoanele nevăzătoare',
      'Setează altitudinea la care a fost făcută fotografia',
      'Transformă automat imaginea într-un fișier audio MP3',
      'Permite descărcarea gratuită a imaginii pe desktop'
    ],
    optionsEn: [
      'Provides an alternative descriptive text rendered if the image fails to load and read aloud by screen-readers for visually impaired users',
      'Sets the geographical altitude where the picture was captured',
      'Converts the image automatically into an MP3 audio recording',
      'Enables free desktop download of the graphic file'
    ],
    correctIndex: 0,
    hint: 'Atributul „alt” provine de la „Alternative text” (text alternativ).',
    hintEn: 'The "alt" attribute stands for "Alternative text".',
    explanation: 'Manual pag. 43: Atributul alt este crucial pentru accesibilitate web, permițând persoanelor cu dizabilități vizuale și motoarelor de căutare să înțeleagă conținutul imaginii.',
    explanationEn: 'Textbook page 43: The alt attribute is paramount for web accessibility, allowing users with visual impairments and search crawlers to decipher the image subject.'
  },
  {
    id: 'w1_exam_q5',
    topic: 'Arhitectură Liste',
    topicEn: 'List Architecture',
    question: 'Ce etichetă generează o listă numerotată secvențial (1, 2, 3...) și ce etichetă conține fiecare rând?',
    questionEn: 'Which tag generates a sequentially numbered list (1, 2, 3...) and which tag encapsulates each item?',
    options: [
      '<ol> pentru lista ordonată, iar fiecare element este cuprins între <li> și </li>',
      '<ul> pentru lista ordonată, iar fiecare element este <item>',
      '<list> pentru lista numerotată, iar fiecare element este <row>',
      '<numbers> pentru lista ordonată, iar fiecare element este <num>'
    ],
    optionsEn: [
      '<ol> for the ordered list, with each item wrapped between <li> and </li>',
      '<ul> for the ordered list, with each item as <item>',
      '<list> for the numbered list, with each item as <row>',
      '<numbers> for the ordered list, with each item as <num>'
    ],
    correctIndex: 0,
    hint: 'Ordered List (OL) vs Unordered List (UL) și List Item (LI).',
    hintEn: 'Ordered List (OL) vs Unordered List (UL), and List Item (LI).',
    explanation: 'Manual pag. 41–42: <ol> (Ordered List) generează automat numerotarea secvențială, iar elementele componente sunt definite strict prin <li> (List Item).',
    explanationEn: 'Textbook pages 41–42: <ol> (Ordered List) generates sequential numbering, and each member entry is defined strictly via <li> (List Item).'
  }
];

export const W1Level7_WebFoundationsExam: React.FC<W1Level7Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();
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
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/70 via-indigo-950/40 to-slate-900 border border-blue-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Art Klett Manual 2025 • Page 43' : 'Manual Art Klett 2025 • Pag. 43'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Award className="w-8 h-8 text-blue-400" />
              {lang === 'en'
                ? 'Level 7: Official Summative Assessment (HTML5 & Web Foundations)'
                : 'Nivelul 7: Evaluare Sumativă Oficială (Fundamente HTML5 & Web)'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {lang === 'en'
                ? 'Official unit exam: demonstrate your mastery of client-server architecture, HTML5 canonical tags, semantic markup, and W3C standards.'
                : 'Testul oficial de final de modul: validează-ți cunoștințele de arhitectură client-server, structură canonică HTML5, etichete semantice și bune practici W3C.'}
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-blue-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">
              {lang === 'en' ? 'Exam Progress' : 'Progres Test'}
            </div>
            <div className="text-2xl font-black text-blue-400">{answeredCount}/{EXAM_QUESTIONS.length}</div>
            <div className="text-[11px] text-slate-400">
              {lang === 'en' ? 'Official Questions' : 'Întrebări Oficiale'}
            </div>
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
          const questionText = lang === 'en' ? q.questionEn : q.question;
          const topicText = lang === 'en' ? q.topicEn : q.topic;
          const optionsList = lang === 'en' ? q.optionsEn : q.options;

          return (
            <div
              key={q.id}
              className={`bg-slate-900/90 border rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl transition-all ${
                isAnswered
                  ? isCorrect
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : 'border-rose-500/40 bg-rose-950/10'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md border border-blue-500/20">
                  {lang === 'en' ? `Question ${qIndex + 1}: ${topicText}` : `Întrebarea ${qIndex + 1}: ${topicText}`}
                </span>
                {isAnswered && (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                    isCorrect ? 'text-emerald-400 bg-emerald-950/60' : 'text-rose-400 bg-rose-950/60'
                  }`}>
                    {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    {isCorrect
                      ? (lang === 'en' ? 'Correct (+20p)' : 'Corect (+20p)')
                      : (lang === 'en' ? 'Incorrect' : 'Incorect')}
                  </span>
                )}
              </div>

              <div className="text-slate-100 font-semibold text-base leading-relaxed">
                {questionText}
              </div>

              {q.codeSnippet && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-cyan-300 text-xs font-bold">
                  {q.codeSnippet}
                </div>
              )}

              {!isAnswered && (
                <QuestionHint
                  hintRo={q.hint}
                  hintEn={q.hintEn}
                />
              )}

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {optionsList.map((opt, optIdx) => {
                  const isSelected = chosen === optIdx;
                  let btnStyle = 'border-slate-800 bg-slate-950/60 hover:bg-slate-800 text-slate-300';

                  if (isAnswered) {
                    if (optIdx === q.correctIndex) {
                      btnStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-200 font-semibold';
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
                      className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                    >
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-bold shrink-0 mt-0.5">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1 leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {isLocked(q.id) && (
                <PedagogicalReflectionBanner remainingSeconds={remainingTime} />
              )}

              {isAnswered && (
                <div className="pt-2">
                  <AnswerExplanation
                    explanation={lang === 'en' ? q.explanationEn : q.explanation}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Finish Exam Button Card */}
      {isAllAnswered && !examSubmitted && (
        <div className="bg-gradient-to-r from-blue-950 to-indigo-950 border border-blue-500/50 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <Sparkles className="w-12 h-12 text-blue-400 mx-auto" />
          <h2 className="text-2xl font-black text-white">
            {lang === 'en'
              ? 'You have answered all questions in the official HTML5 exam!'
              : 'Ai completat toate întrebările testului oficial HTML5!'}
          </h2>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            {lang === 'en'
              ? 'Click the button below to generate your final evaluation report and unlock the official Web Architecture & HTML5 Specialist badge.'
              : 'Apasă butonul de mai jos pentru a genera raportul final de evaluare și pentru a debloca insigna oficială de Web Architecture & HTML5 Specialist.'}
          </p>
          <button
            onClick={handleFinishExam}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-black shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 transition-all text-base cursor-pointer"
          >
            {lang === 'en' ? 'Submit Summative Assessment' : 'Finalizează Evaluarea Sumativă'}
          </button>
        </div>
      )}

      {/* Exam Result Report */}
      {examSubmitted && (
        <div className={`p-8 rounded-3xl border ${
          isPassed
            ? 'bg-emerald-950/50 border-emerald-500/50 text-white'
            : 'bg-amber-950/50 border-amber-500/50 text-white'
        } space-y-4 shadow-2xl`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                isPassed ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
              }`}>
                {isPassed ? <ShieldCheck className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
              </div>
              <div>
                <h2 className="text-2xl font-black">
                  {isPassed
                    ? (lang === 'en' ? 'Assessment Passed with Honors!' : 'Evaluare Promovată cu Felicitări!')
                    : (lang === 'en' ? 'A Bit More Revision is Needed' : 'Mai ai nevoie de puțină recapitulare')}
                </h2>
                <p className="text-slate-300 text-sm">
                  {lang === 'en'
                    ? `You obtained ${correctCount} correct answers out of ${EXAM_QUESTIONS.length} (${percentage}%).`
                    : `Ai obținut ${correctCount} răspunsuri corecte din ${EXAM_QUESTIONS.length} (${percentage}%).`}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-4xl font-black text-blue-400">{percentage}%</span>
              <span className="block text-xs text-slate-400 uppercase font-semibold">
                {lang === 'en' ? `Official Grade: ${percentage / 10}` : `Nota Oficială: ${percentage / 10}`}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-slate-300 leading-relaxed">
            {isPassed ? (
              <span>
                {lang === 'en'
                  ? 'Excellent! You have completely mastered HTML5 foundations, web page canonical structure, and network communication protocols according to the official 8th-grade curriculum.'
                  : 'Excelent! Stăpânești la perfecție fundamentele limbajului HTML5, structura de bază a paginilor web și protocoalele de comunicare conform programei școlare de clasa a VIII-a.'}
              </span>
            ) : (
              <span>
                {lang === 'en'
                  ? 'Passing threshold is 75%. You can retake the exam to achieve the maximum grade.'
                  : 'Pragul de promovare este de 75%. Poți relua testul pentru a-ți asigura nota maximă.'}
              </span>
            )}
          </div>

          {!isPassed && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleRetryExam}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                {lang === 'en' ? 'Retake Exam' : 'Reia Testul'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Navigation Footer */}
      <PageNavigationFooter
        canProceed={examSubmitted && isPassed}
        onPrev={onPrev}
        onNext={() => {
          sounds.playCorrect();
          if (onCompletePage) onCompletePage(100);
          else if (onComplete) onComplete();
        }}
        nextLabel={lang === 'en'
          ? 'Claim Diploma & Badge (Complete Module)'
          : 'Revendică Diploma & Insigna (Finalizare Modul)'}
      />
    </div>
  );
};
