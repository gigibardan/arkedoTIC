import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Terminal,
  Code2,
  Wrench,
  Check
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface W1Level6Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface BugCase {
  id: string;
  title: string;
  titleEn: string;
  buggySnippet: string;
  visualEffect: string;
  visualEffectEn: string;
  fixOptions: string[];
  fixOptionsEn: string[];
  correctIndex: number;
  explanation: string;
  explanationEn: string;
}

const BUG_CASES: BugCase[] = [
  {
    id: 'unclosed_h1',
    title: '1. Etichetă de titlu neînchisă',
    titleEn: '1. Unclosed Heading Tag',
    buggySnippet: '<h1>Capitolul 1: Noțiuni Web\n<p>Acesta este paragraful introductiv.</p>',
    visualEffect: 'Întregul paragraf este afișat cu font uriaș și îngroșat ca un titlu, deoarece browserul nu știe unde se termină <h1>.',
    visualEffectEn: 'The entire paragraph is rendered in giant bold font like a heading because the browser cannot determine where <h1> ends.',
    fixOptions: [
      'Închidem eticheta de titlu cu </h1> înainte de începerea paragrafului',
      'Ștergem eticheta <p>',
      'Schimbăm <p> în <h6>'
    ],
    fixOptionsEn: [
      'Close the heading tag with </h1> before starting the paragraph',
      'Delete the <p> tag entirely',
      'Change <p> into <h6>'
    ],
    correctIndex: 0,
    explanation: 'Manual pag. 38: Etichetele pereche precum <h1>, <p>, <a> trebuie întotdeauna închise cu caracterul slash </tag> pentru a delimita precis porțiunea de text vizată.',
    explanationEn: 'Textbook page 38: Paired tags like <h1>, <p>, <a> must always be properly closed with a forward slash </tag> to strictly delimit targeted content.'
  },
  {
    id: 'crossing_tags',
    title: '2. Încrucișarea incorectă a etichetelor imbricate',
    titleEn: '2. Improper Tag Crossing & Bad Nesting',
    buggySnippet: '<p>Acesta este un <strong>text <em>foarte important</strong></em> din lecție.</p>',
    visualEffect: 'Codul încalcă arborele DOM (principiul LIFO: Last In, First Out). Eticheta deschisă ultima (<em>) trebuie închisă prima.',
    visualEffectEn: 'Code violates DOM tree hierarchy (LIFO rule: Last In, First Out). The tag opened last (<em>) must be closed first.',
    fixOptions: [
      '<p>Acesta este un <strong>text <em>foarte important</em></strong> din lecție.</p>',
      '<p>Acesta este un <em>text <strong>foarte important</p></strong></em>',
      'Lăsăm textul fără nicio etichetă'
    ],
    fixOptionsEn: [
      '<p>This is a <strong><em>very important</em> text</strong> from the lesson.</p>',
      '<p>This is an <em><strong>important text</p></strong></em>',
      'Leave all text without any semantic tags'
    ],
    correctIndex: 0,
    explanation: 'Manual pag. 40: Principiul imbricării cere ca eticheta deschisă cel mai recent să fie prima închisă: <strong><em>...</em></strong>.',
    explanationEn: 'Textbook page 40: Nesting principles dictate that the most recently opened tag must be the first one closed: <strong><em>...</em></strong>.'
  },
  {
    id: 'missing_quotes_alt',
    title: '3. Ghilimele lipsă și atributul alt absent la imagine',
    titleEn: '3. Missing Quotes & Omitted alt Attribute on Image',
    buggySnippet: '<img src=robot.jpg width=300>',
    visualEffect: 'Lipsa ghilimelelor la căi de fișiere cu spații produce erori, iar lipsa atributului alt penalizează grav accesibilitatea conform W3C.',
    visualEffectEn: 'Unquoted attribute values break paths containing spaces, and omitting alt severely penalizes W3C accessibility compliance.',
    fixOptions: [
      '<img src="robot.jpg" alt="Robot educațional programabil" width="300">',
      '<img file="robot.jpg"></image>',
      '<picture>robot.jpg</picture>'
    ],
    fixOptionsEn: [
      '<img src="robot.jpg" alt="Programmable educational robot" width="300">',
      '<img file="robot.jpg"></image>',
      '<picture>robot.jpg</picture>'
    ],
    correctIndex: 0,
    explanation: 'Manual pag. 43: Valorile tuturor atributelor HTML se trec obligatoriu între ghilimele duble, iar <img> necesită atributul semantic alt.',
    explanationEn: 'Textbook page 43: Values of all HTML attributes should strictly reside inside double quotes, and <img> mandates the semantic alt attribute.'
  }
];

export const W1Level6_HtmlCodeInspectorAndFixer: React.FC<W1Level6Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);
  const [selectedFix, setSelectedFix] = useState<number | null>(null);
  const [solvedCases, setSolvedCases] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; text: string } | null>(null);

  // Reflection cooldown hook (5s anti-spam)
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{ [qId: string]: boolean }>({});

  const currentCase = BUG_CASES[activeCaseIdx];

  const handleFixSelect = (optionIdx: number) => {
    setSelectedFix(optionIdx);
    if (optionIdx === currentCase.correctIndex) {
      sounds.playCorrect();
      setFeedback({
        isSuccess: true,
        text: lang === 'en'
          ? `Excellent! ${currentCase.explanationEn}`
          : `Excelent! ${currentCase.explanation}`
      });
      if (!solvedCases.includes(currentCase.id)) {
        setSolvedCases(prev => [...prev, currentCase.id]);
      }
    } else {
      sounds.playWrong();
      setFeedback({
        isSuccess: false,
        text: lang === 'en'
          ? 'Incorrect fix. This does not satisfy official HTML5 standards from the curriculum. Carefully inspect paired tags and quotation!'
          : 'Soluție incorectă. Această modificare nu respectă standardele HTML5 din manual. Analizează cu atenție etichetele pereche!'
      });
    }
  };

  const handleNextCase = () => {
    sounds.playClick();
    setSelectedFix(null);
    setFeedback(null);
    if (activeCaseIdx < BUG_CASES.length - 1) {
      setActiveCaseIdx(prev => prev + 1);
    }
  };

  const handleQuizAnswer = (qId: string, optIdx: number, isCorrect: boolean) => {
    if (quizSubmitted[qId] || isLocked(qId)) return;
    setQuizAnswers(prev => ({ ...prev, [qId]: optIdx }));
    setQuizSubmitted(prev => ({ ...prev, [qId]: true }));
    if (isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown(qId);
    }
  };

  const allLabFixed = solvedCases.length === BUG_CASES.length;
  const quizDone = Object.keys(quizSubmitted).length >= 2;
  const canFinish = allLabFixed && quizDone;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950/70 via-red-950/40 to-slate-900 border border-rose-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Art Klett Manual 2025 • Pages 38–43' : 'Manual Art Klett 2025 • Pag. 38–43'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-rose-400" />
              {lang === 'en'
                ? 'Level 6: HTML Code Inspector & Bug Clinic'
                : 'Nivelul 6: Clinica de Depanare & Audit al Codului HTML'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {lang === 'en'
                ? 'Step into the shoes of a Code Inspector: detect unclosed tags, illegal tag nesting crossings, and missing accessibility attributes before web deployment.'
                : 'Fii inspector de cod (Code Inspector): depistează etichetele neînchise, încrucișările ilegale de taguri și atributele lipsă înainte de publicarea paginii pe Internet.'}
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-rose-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">
              {lang === 'en' ? 'Fixed Bugs' : 'Erori Remediate'}
            </div>
            <div className="text-2xl font-black text-rose-400">{solvedCases.length}/{BUG_CASES.length}</div>
            <div className="text-[11px] text-slate-400">
              {lang === 'en' ? 'Syntax Audit' : 'Audit Sintactic'}
            </div>
          </div>
        </div>
      </div>

      {/* Case Navigator */}
      <div className="grid grid-cols-3 gap-2">
        {BUG_CASES.map((bc, idx) => {
          const isCurrent = idx === activeCaseIdx;
          const isSolved = solvedCases.includes(bc.id);
          const title = lang === 'en' ? bc.titleEn : bc.title;
          return (
            <button
              key={bc.id}
              onClick={() => {
                sounds.playClick();
                setActiveCaseIdx(idx);
                setSelectedFix(null);
                setFeedback(null);
              }}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                isCurrent
                  ? 'border-rose-500 bg-rose-500/10 text-rose-300 shadow-md ring-2 ring-rose-500/20'
                  : isSolved
                  ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-300'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs">
                {isSolved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {lang === 'en' ? `Case ${idx + 1}` : `Cazul ${idx + 1}`}
              </div>
              <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                {title.includes('.') ? title.split('.')[1] : title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Diagnostic Workbench */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-rose-400 font-bold uppercase tracking-wider">
                {lang === 'en' ? 'HTML Debug Sheet' : 'Fișă de Depanare HTML'}
              </span>
              <h2 className="text-lg font-bold text-white">
                {lang === 'en' ? currentCase.titleEn : currentCase.title}
              </h2>
            </div>
          </div>
          <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            {lang === 'en'
              ? `Bug ${activeCaseIdx + 1} of ${BUG_CASES.length}`
              : `Eroarea ${activeCaseIdx + 1} din ${BUG_CASES.length}`}
          </span>
        </div>

        {/* Buggy Snippet vs Effect */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-slate-950 border border-rose-950/60 rounded-2xl p-4 font-mono text-xs">
            <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              {lang === 'en' ? 'Buggy Snippet (Defective HTML)' : 'Fragment Defectuos (Buggy HTML)'}
            </div>
            <pre className="text-rose-300 whitespace-pre-wrap leading-relaxed bg-rose-950/20 p-3 rounded-xl border border-rose-900/30">
              {currentCase.buggySnippet}
            </pre>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              {lang === 'en' ? 'Effect Rendered in Browser' : 'Efect Produs în Browser'}
            </div>
            <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              {lang === 'en' ? currentCase.visualEffectEn : currentCase.visualEffect}
            </p>
          </div>
        </div>

        {/* Repair Options */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            {lang === 'en'
              ? 'Choose the corrected code conforming to the HTML5 standard:'
              : 'Alege codul corectat conform standardului HTML5:'}
          </label>
          <div className="space-y-2.5">
            {(lang === 'en' ? currentCase.fixOptionsEn : currentCase.fixOptions).map((opt, idx) => {
              const isSelected = selectedFix === idx;
              const isCorrect = idx === currentCase.correctIndex;
              return (
                <button
                  key={idx}
                  onClick={() => handleFixSelect(idx)}
                  className={`w-full text-left p-4 rounded-xl border text-xs font-mono transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? isCorrect
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-200 ring-2 ring-emerald-500/20'
                        : 'border-rose-500 bg-rose-500/15 text-rose-200 ring-2 ring-rose-500/20'
                      : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-bold shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Area */}
        {feedback && (
          <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
            feedback.isSuccess
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}>
            {feedback.isSuccess ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <p className="text-sm leading-relaxed">{feedback.text}</p>
          </div>
        )}

        {/* Next Case Button */}
        {selectedFix === currentCase.correctIndex && activeCaseIdx < BUG_CASES.length - 1 && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNextCase}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg flex items-center gap-2 cursor-pointer"
            >
              {lang === 'en' ? 'Next Debug Case' : 'Următorul Caz de Depanare'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Reflection Quiz with Cooldowns */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {lang === 'en'
                ? 'Pedagogical Reflection: Validation & Web Code Quality'
                : 'Reflecție Pedagogică: Validarea & Calitatea Codului Web'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en' ? 'Art Klett Manual pages 38–43' : 'Manual Art Klett pag. 38–43'}
            </p>
          </div>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? '1. Which official free service provided by the W3C consortium is utilized globally to verify if an HTML document contains syntax errors?'
              : '1. Ce instrument gratuit oferit de consorțiul W3C este folosit la nivel mondial pentru a verifica dacă un fișier HTML conține erori de sintaxă?'}
          </div>
          <QuestionHint
            hintRo="Termenul englezesc pentru verificator de conformitate."
            hintEn="The official compliance validator tool."
          />
          <div className="space-y-2">
            {[
              {
                textRo: 'W3C Markup Validation Service (validator.w3.org)',
                textEn: 'W3C Markup Validation Service (validator.w3.org)',
                correct: true
              },
              {
                textRo: 'Un antivirus obișnuit de pe calculator',
                textEn: 'A conventional antivirus on the computer',
                correct: false
              },
              {
                textRo: 'Calculatorul din Windows',
                textEn: 'The Windows calculator app',
                correct: false
              }
            ].map((opt, idx) => {
              const qId = 'w1_l6_q1';
              const isSelected = quizAnswers[qId] === idx;
              const isSub = quizSubmitted[qId];
              return (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(qId, idx, opt.correct)}
                  disabled={isSub || isLocked(qId)}
                  className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${
                    isSelected
                      ? opt.correct
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500 bg-rose-500/10 text-rose-300'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{lang === 'en' ? opt.textEn : opt.textRo}</span>
                  {isSelected && (opt.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />)}
                </button>
              );
            })}
          </div>
          {isLocked('w1_l6_q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['w1_l6_q1'] || 0} />
          )}
          {quizSubmitted['w1_l6_q1'] && (
            <AnswerExplanation
              explanation={lang === 'en'
                ? 'Correct! The official W3C Validator inspects code line by line, reporting missing or unclosed tags according to W3C recommendations.'
                : 'Corect! Validatorul oficial W3C analizează pagina linie cu linie și raportează toate tagurile uitate sau neînchise conform standardelor web.'}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? '2. Why does a web browser typically avoid showing a catastrophic red error screen when HTML syntax is malformed, attempting to render it anyway?'
              : '2. De ce browserul nu afișează de obicei un mesaj mare de eroare de culoare roșie atunci când codul HTML este greșit, ci încearcă să-l afișeze oricum?'}
          </div>
          <QuestionHint
            hintRo="Browserele sunt proiectate să fie tolerante la erori (permissive parsing) pentru a nu arăta o pagină complet albă utilizatorului."
            hintEn="Browsers are engineered with permissive parsing / error tolerance so users are not met with completely blank screens."
          />
          <div className="space-y-2">
            {[
              {
                textRo: 'Browserele folosesc algoritmi de toleranță la erori (Quirks Mode) pentru a randa parțial pagina, însă rezultatul vizual este adesea deformat sau imprevizibil',
                textEn: 'Browsers employ permissive error-tolerance parsers (Quirks Mode) to salvage page display, though visual output is often degraded or unpredictable',
                correct: true
              },
              {
                textRo: 'Pentru că în HTML nu pot exista erori de niciun fel',
                textEn: 'Because errors cannot exist in HTML syntax',
                correct: false
              },
              {
                textRo: 'Pentru că browserul se repară singur în timp real',
                textEn: 'Because the browser automatically auto-repairs itself in real time',
                correct: false
              }
            ].map((opt, idx) => {
              const qId = 'w1_l6_q2';
              const isSelected = quizAnswers[qId] === idx;
              const isSub = quizSubmitted[qId];
              return (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(qId, idx, opt.correct)}
                  disabled={isSub || isLocked(qId)}
                  className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${
                    isSelected
                      ? opt.correct
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500 bg-rose-500/10 text-rose-300'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{lang === 'en' ? opt.textEn : opt.textRo}</span>
                  {isSelected && (opt.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />)}
                </button>
              );
            })}
          </div>
          {isLocked('w1_l6_q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['w1_l6_q2'] || 0} />
          )}
          {quizSubmitted['w1_l6_q2'] && (
            <AnswerExplanation
              explanation={lang === 'en'
                ? 'Exactly! The web was architected around Postel\'s Robustness Principle ("be liberal in what you accept"). Writing clean, standards-compliant HTML remains the hallmark of a skilled software engineer.'
                : 'Exact! Filosofia web-ului este „robustness principle” (fii tolerant cu ceea ce primești). Totuși, scrierea unui cod HTML curat și valid este semnul unui programator profesionist.'}
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <PageNavigationFooter
        canProceed={canFinish}
        onPrev={onPrev}
        onNext={() => {
          sounds.playCorrect();
          if (onCompletePage) onCompletePage(100);
          else if (onComplete) onComplete();
        }}
        nextLabel={lang === 'en'
          ? 'To Official Summative Assessment (Level 7)'
          : 'Spre Evaluarea Sumativă Oficială (Nivelul 7)'}
      />
    </div>
  );
};
