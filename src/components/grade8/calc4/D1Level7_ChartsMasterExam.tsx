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
  BookOpen
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface D1Level7Props {
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
    id: 'd1_exam_q1',
    topic: 'Tipologia Diagramelor',
    topicEn: 'Chart Typology',
    question: 'Care este cel mai potrivit tip de diagramă pentru a reprezenta proporția procentuală a elevilor unei școli care practică diferite sporturi (fotbal, baschet, înot, tenis), știind că fiecare elev a ales o singură opțiune din totalul de 100%?',
    questionEn: 'What is the most suitable chart type to represent the percentage proportion of school students participating in various sports (football, basketball, swimming, tennis), given each student chose one option out of the 100% total?',
    options: [
      'Diagrama circulară (Pie Chart) — redă optim compoziția procentuală a unui întreg',
      'Diagrama de dispersie (XY Scatter) — arată doar formule matematice',
      'Diagrama liniară (Line Chart) — pentru că sporturile se joacă în timp',
      'Diagrama cu suprafețe (Surface Chart) — pentru că terenul are suprafață'
    ],
    optionsEn: [
      'Pie Chart — optimally depicts the percentage composition of a whole',
      'XY Scatter Chart — shows only mathematical formulas',
      'Line Chart — because sports occur over time',
      'Surface Chart — because courts have surface area'
    ],
    correctIndex: 0,
    hint: 'Căutăm diagrama ideală pentru împărțirea unui total (100%) în părți componente.',
    hintEn: 'We are looking for the ideal chart for dividing a total (100%) into component parts.',
    explanation: 'Manual pag. 29: Diagrama circulară (Pie Chart) este dedicată exclusiv reprezentării structurale a proporțiilor și procentelor dintr-un întreg de 100%.',
    explanationEn: 'Textbook page 29: The Pie Chart is exclusively dedicated to structural representations of proportions and percentages making up a 100% whole.'
  },
  {
    id: 'd1_exam_q2',
    topic: 'Anatomia Diagramei',
    topicEn: 'Chart Anatomy',
    question: 'Ce reprezintă „Zona de trasare” (Plot Area) într-o diagramă din foaia de calcul?',
    questionEn: 'What does the "Plot Area" represent inside a spreadsheet chart?',
    options: [
      'Zona dreptunghiulară strict delimitată de axele orizontală și verticală, unde sunt desenate fizic coloanele sau liniile de date',
      'Întreaga suprafață a fișierului Excel salvat pe disc',
      'Bara superioară unde se scrie doar titlul diagramei',
      'Caseta care conține exclusiv textul legendei'
    ],
    optionsEn: [
      'The rectangular zone strictly bounded by the horizontal and vertical axes where data columns or lines are physically rendered',
      'The entire surface of the Excel file saved to disk',
      'The top header bar where only the chart title is written',
      'The box that exclusively holds legend text'
    ],
    correctIndex: 0,
    hint: 'Gândește-te la spațiul geometric interior dintre axele X și Y.',
    hintEn: 'Think of the inner geometric space between the X and Y axes.',
    explanation: 'Manual pag. 30: Plot Area (Zona de trasare) este spațiul delimitat de axe în care sunt reprezentate vizual seriile de date.',
    explanationEn: 'Textbook page 30: The Plot Area is the bounded space delimited by the axes where data series are graphically rendered.'
  },
  {
    id: 'd1_exam_q3',
    topic: 'Manipularea Axelor & Seriilor',
    topicEn: 'Axes & Series Manipulation',
    question: 'Dacă o diagramă combină evoluția temperaturilor lunare (°C) cu barele precipitațiilor (mm), de ce este necesară activarea unei „Axe Secundare” (Secondary Axis)?',
    questionEn: 'If a chart combines monthly temperatures (°C) with precipitation bars (mm), why is activating a "Secondary Axis" necessary?',
    options: [
      'Pentru că cele două mărimi au unități de măsură eterogene (°C vs mm) și scări numerice foarte diferite; pe o singură axă, una din serii ar fi deformată sau ilizibilă',
      'Pentru că Excel refuză salvarea fișierului dacă are o singură axă',
      'Pentru a imprima diagrama în două culori diferite',
      'Nu este necesară, este o simplă opțiune decorativă fără impact'
    ],
    optionsEn: [
      'Because the two variables have heterogeneous units (°C vs mm) and vastly different numerical scales; on a single axis, one series would be flattened or unreadable',
      'Because Excel refuses to save files with only one axis',
      'To print the chart in two distinct ink colors',
      'It is not necessary, merely a decorative cosmetic option'
    ],
    correctIndex: 0,
    hint: 'Compară valorile de la -5 la 25 cu valorile de la 30 la 100.',
    hintEn: 'Compare values from -5 to 25 against rainfall values from 30 to 100.',
    explanation: 'Manual pag. 34: În diagramele combinate (Combo Charts), axa secundară permite fiecărei serii de date să fie măsurată la scara proprie adecvată.',
    explanationEn: 'Textbook page 34: In Combo Charts, the secondary axis allows each data series to be plotted against its own appropriate unit scale.'
  },
  {
    id: 'd1_exam_q4',
    topic: 'Comutarea Perspectivelor (Switch Row/Column)',
    topicEn: 'Switching Perspectives (Switch Row/Column)',
    question: 'Ce operațiune realizează comanda „Switch Row/Column” (Comutare rând/coloană) din tab-ul Chart Design?',
    questionEn: 'What does the "Switch Row/Column" command perform in the Chart Design contextual tab?',
    options: [
      'Inversează datele de pe axa categoriilor X cu seriile afișate în legendă, permițând schimbarea rapidă a perspectivei de analiză',
      'Inversează numerele pozitive în numere negative',
      'Șterge toate rândurile impare din tabel',
      'Rotește monitorul la 90 de grade'
    ],
    optionsEn: [
      'Swaps data on the X category axis with the series displayed in the legend, allowing rapid toggling of analytical perspective',
      'Inverts positive numbers into negative numbers',
      'Deletes all odd rows from the worksheet',
      'Rotates the computer monitor 90 degrees'
    ],
    correctIndex: 0,
    hint: 'Axa X devine legendă, iar legenda devine axa X.',
    hintEn: 'The X axis becomes the legend, and the legend becomes the X axis.',
    explanation: 'Manual pag. 32: Comutarea rând/coloană este un instrument puternic ce schimbă orientarea analizei (ex. de la evoluția pe trimestre la compararea între produse).',
    explanationEn: 'Textbook page 32: Switch Row/Column is a pivotal tool altering analytical perspective (e.g. from quarterly trends to product comparisons).'
  },
  {
    id: 'd1_exam_q5',
    topic: 'Bune Practici & Erori Frecvente',
    topicEn: 'Best Practices & Common Traps',
    question: 'Ce greșeală gravă de proiectare se comite dacă la crearea unei diagrame circulare (Pie Chart) este inclusă în selecție și linia ce conține „TOTALUL”?',
    questionEn: 'What critical design error occurs if the "TOTAL" row is included in the selection when creating a Pie Chart?',
    options: [
      'Totalul va reprezenta 50% din cerc, iar celelalte categorii vor fi forțate să împartă doar restul de 50%, distorsionând complet proporțiile reale',
      'Computerul se blochează instantaneu',
      'Diagrama se transformă automat într-un fișier text',
      'Culorile devin toate negre'
    ],
    optionsEn: [
      'The total will occupy 50% of the circle, forcing all other categories to split the remaining 50%, completely distorting true proportions',
      'The computer freezes instantaneously',
      'The chart converts automatically into a plain text file',
      'All slice colors turn pitch black'
    ],
    correctIndex: 0,
    hint: 'Suma elementelor este egală cu totalul, așadar totalul este jumătate din selecția dublată.',
    hintEn: 'The sum of elements equals the total, so the total row represents half of the duplicated selection.',
    explanation: 'Manual pag. 35: Într-o diagramă circulară nu se selectează niciodată linia de total, deoarece Excel calculează singur întregul din suma feliilor.',
    explanationEn: 'Textbook page 35: In a pie chart, never select the total row, because Excel autonomously derives the whole (100%) from the sum of slices.'
  }
];

export const D1Level7_ChartsMasterExam: React.FC<D1Level7Props> = ({
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
      <div className="bg-gradient-to-r from-sky-950/70 via-indigo-950/40 to-slate-900 border border-sky-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Art Klett Manual 2025 • Page 35' : 'Manual Art Klett 2025 • Pag. 35'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Award className="w-8 h-8 text-sky-400" />
              {lang === 'en'
                ? 'Level 7: Official Summative Assessment (Charts & Graphs)'
                : 'Nivelul 7: Evaluare Sumativă Oficială (Diagrame & Grafice)'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {lang === 'en'
                ? 'Official end-of-unit exam: prove your mastery of chart typologies, axis formatting, climodiagrams, and accurate data interpretation.'
                : 'Testul oficial de final de capitol: demonstrează că stăpânești tipurile de diagrame, formatarea axelor, climodiagramele și interpretarea corectă a datelor.'}
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-sky-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">
              {lang === 'en' ? 'Exam Progress' : 'Progres Test'}
            </div>
            <div className="text-2xl font-black text-sky-400">{answeredCount}/{EXAM_QUESTIONS.length}</div>
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
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-3 py-1 rounded-md border border-sky-500/20">
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
                      className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-start gap-3 ${btnStyle}`}
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
        <div className="bg-gradient-to-r from-sky-950 to-indigo-950 border border-sky-500/50 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <Sparkles className="w-12 h-12 text-sky-400 mx-auto" />
          <h2 className="text-2xl font-black text-white">
            {lang === 'en'
              ? 'You have answered all questions in the charts exam!'
              : 'Ai completat toate întrebările testului de diagrame!'}
          </h2>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            {lang === 'en'
              ? 'Click the button below to generate your official grade report and claim your Chart & Data Visualization Specialist badge.'
              : 'Apasă butonul de mai jos pentru a genera borderoul final de notare și pentru a debloca insigna oficială de Chart & Data Visualization Specialist.'}
          </p>
          <button
            onClick={handleFinishExam}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-black shadow-lg shadow-sky-500/20 transform hover:-translate-y-0.5 transition-all text-base"
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
              <span className="text-4xl font-black text-sky-400">{percentage}%</span>
              <span className="block text-xs text-slate-400 uppercase font-semibold">
                {lang === 'en' ? `Official Grade: ${percentage / 10}` : `Nota Oficială: ${percentage / 10}`}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-slate-300 leading-relaxed">
            {isPassed ? (
              <span>
                {lang === 'en'
                  ? 'Congratulations! You successfully completed the entire Charts and Graphical Representations Module in Unit 1 of the official 8th-grade curriculum.'
                  : 'Felicitări! Ai finalizat cu succes întregul Modul de Diagrame și Reprezentări Grafice din Unitatea 1 a manualului oficial de clasa a VIII-a.'}
              </span>
            ) : (
              <span>
                {lang === 'en'
                  ? 'Passing threshold is 75%. You may retake the exam to achieve the maximum grade.'
                  : 'Pragul de promovare este de 75%. Poți relua testul pentru a-ți asigura nota maximă.'}
              </span>
            )}
          </div>

          {!isPassed && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleRetryExam}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 flex items-center gap-2"
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
