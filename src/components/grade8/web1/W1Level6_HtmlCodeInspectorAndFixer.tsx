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
  buggySnippet: string;
  visualEffect: string;
  fixOptions: string[];
  correctIndex: number;
  explanation: string;
}

const BUG_CASES: BugCase[] = [
  {
    id: 'unclosed_h1',
    title: '1. Etichetă de titlu neînchisă',
    buggySnippet: '<h1>Capitolul 1: Noțiuni Web\n<p>Acesta este paragraful introductiv.</p>',
    visualEffect: 'Întregul paragraf este afișat cu font uriaș și îngroșat ca un titlu, deoarece browserul nu știe unde se termină <h1>.',
    fixOptions: [
      'Închidem eticheta de titlu cu </h1> înainte de începerea paragrafului',
      'Ștergem eticheta <p>',
      'Schimbăm <p> în <h6>'
    ],
    correctIndex: 0,
    explanation: 'Manual pag. 38: Etichetele pereche precum <h1>, <p>, <a> trebuie întotdeauna închise cu caracterul slash </tag> pentru a delimita precis porțiunea de text vizată.'
  },
  {
    id: 'crossing_tags',
    title: '2. Încrucișarea incorectă a etichetelor imbricate',
    buggySnippet: '<p>Acesta este un <strong>text <em>foarte important</strong></em> din lecție.</p>',
    visualEffect: 'Codul încalcă arborele DOM (principiul LIFO: Last In, First Out). Eticheta deschisă ultima (<em>) trebuie închisă prima.',
    fixOptions: [
      '<p>Acesta este un <strong>text <em>foarte important</em></strong> din lecție.</p>',
      '<p>Acesta este un <em>text <strong>foarte important</p></strong></em>',
      'Lăsăm textul fără nicio etichetă'
    ],
    correctIndex: 0,
    explanation: 'Manual pag. 40: Principiul imbricării cere ca eticheta deschisă cel mai recent să fie prima închisă: <strong><em>...</em></strong>.'
  },
  {
    id: 'missing_quotes_alt',
    title: '3. Ghilimele lipsă și atributul alt absent la imagine',
    buggySnippet: '<img src=robot.jpg width=300>',
    visualEffect: 'Lipsa ghilimelelor la căi de fișiere cu spații produce erori, iar lipsa atributului alt penalizează grav accesibilitatea conform W3C.',
    fixOptions: [
      '<img src="robot.jpg" alt="Robot educațional programabil" width="300">',
      '<img file="robot.jpg"></image>',
      '<picture>robot.jpg</picture>'
    ],
    correctIndex: 0,
    explanation: 'Manual pag. 43: Valorile tuturor atributelor HTML se trec obligatoriu între ghilimele duble, iar <img> necesită atributul semantic alt.'
  }
];

export const W1Level6_HtmlCodeInspectorAndFixer: React.FC<W1Level6Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
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
        text: `Excelent! ${currentCase.explanation}`
      });
      if (!solvedCases.includes(currentCase.id)) {
        setSolvedCases(prev => [...prev, currentCase.id]);
      }
    } else {
      sounds.playWrong();
      setFeedback({
        isSuccess: false,
        text: 'Soluție incorectă. Această modificare nu respectă standardele HTML5 din manual. Analizează cu atenție etichetele pereche!'
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
              <span>Manual Art Klett 2025 • Pag. 38–43</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-rose-400" />
              Nivelul 6: Clinica de Depanare & Audit al Codului HTML
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Fii inspector de cod (Code Inspector): depistează etichetele neînchise, încrucișările ilegale de taguri și atributele lipsă înainte de publicarea paginii pe Internet.
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-rose-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">Erori Remediate</div>
            <div className="text-2xl font-black text-rose-400">{solvedCases.length}/{BUG_CASES.length}</div>
            <div className="text-[11px] text-slate-400">Audit Sintactic</div>
          </div>
        </div>
      </div>

      {/* Case Navigator */}
      <div className="grid grid-cols-3 gap-2">
        {BUG_CASES.map((bc, idx) => {
          const isCurrent = idx === activeCaseIdx;
          const isSolved = solvedCases.includes(bc.id);
          return (
            <button
              key={bc.id}
              onClick={() => {
                sounds.playClick();
                setActiveCaseIdx(idx);
                setSelectedFix(null);
                setFeedback(null);
              }}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                isCurrent
                  ? 'border-rose-500 bg-rose-500/10 text-rose-300 shadow-md ring-2 ring-rose-500/20'
                  : isSolved
                  ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-300'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs">
                {isSolved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
                Cazul {idx + 1}
              </div>
              <span className="text-[10px] text-slate-400 truncate max-w-[150px]">{bc.title.split('.')[1]}</span>
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
              <span className="text-xs text-rose-400 font-bold uppercase tracking-wider">Fișă de Depanare HTML</span>
              <h2 className="text-lg font-bold text-white">{currentCase.title}</h2>
            </div>
          </div>
          <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            Eroarea {activeCaseIdx + 1} din {BUG_CASES.length}
          </span>
        </div>

        {/* Buggy Snippet vs Effect */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-slate-950 border border-rose-950/60 rounded-2xl p-4 font-mono text-xs">
            <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Fragment Defectuos (Buggy HTML)
            </div>
            <pre className="text-rose-300 whitespace-pre-wrap leading-relaxed bg-rose-950/20 p-3 rounded-xl border border-rose-900/30">
              {currentCase.buggySnippet}
            </pre>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-blue-400" /> Efect Produs în Browser
            </div>
            <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              {currentCase.visualEffect}
            </p>
          </div>
        </div>

        {/* Repair Options */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            Alege codul corectat conform standardului HTML5:
          </label>
          <div className="space-y-2.5">
            {currentCase.fixOptions.map((opt, idx) => {
              const isSelected = selectedFix === idx;
              const isCorrect = idx === currentCase.correctIndex;
              return (
                <button
                  key={idx}
                  onClick={() => handleFixSelect(idx)}
                  className={`w-full text-left p-4 rounded-xl border text-xs font-mono transition-all flex items-start gap-3 ${
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
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg flex items-center gap-2"
            >
              Următorul Caz de Depanare <ArrowRight className="w-4 h-4" />
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
            <h2 className="text-lg font-bold text-white">Reflecție Pedagogică: Validarea & Calitatea Codului Web</h2>
            <p className="text-xs text-slate-400">Manual Art Klett pag. 38–43</p>
          </div>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-200">
            1. Ce instrument gratuit oferit de consorțiul W3C este folosit la nivel mondial pentru a verifica dacă un fișier HTML conține erori de sintaxă?
          </div>
          <QuestionHint hint="Termenul englezesc pentru verificator de conformitate." />
          <div className="space-y-2">
            {[
              { text: 'W3C Markup Validation Service (validator.w3.org)', correct: true },
              { text: 'Un antivirus obișnuit de pe calculator', correct: false },
              { text: 'Calculatorul din Windows', correct: false }
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
                  <span>{opt.text}</span>
                  {isSelected && (opt.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />)}
                </button>
              );
            })}
          </div>
          {isLocked('w1_l6_q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['w1_l6_q1'] || 0} />
          )}
          {quizSubmitted['w1_l6_q1'] && (
            <AnswerExplanation explanation="Corect! Validatorul oficial W3C analizează pagina linie cu linie și raportează toate tagurile uitate sau neînchise conform standardelor web." />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="text-sm font-semibold text-slate-200">
            2. De ce browserul nu afișează de obicei un mesaj mare de eroare de culoare roșie atunci când codul HTML este greșit, ci încearcă să-l afișeze oricum?
          </div>
          <QuestionHint hint="Browserele sunt proiectate să fie tolerante la erori (permissive parsing) pentru a nu arăta o pagină complet albă utilizatorului." />
          <div className="space-y-2">
            {[
              { text: 'Browserele folosesc algoritmi de toleranță la erori (Quirks Mode) pentru a randa parțial pagina, însă rezultatul vizual este adesea deformat sau imprevizibil', correct: true },
              { text: 'Pentru că în HTML nu pot exista erori de niciun fel', correct: false },
              { text: 'Pentru că browserul se repară singur în timp real', correct: false }
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
                  <span>{opt.text}</span>
                  {isSelected && (opt.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />)}
                </button>
              );
            })}
          </div>
          {isLocked('w1_l6_q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['w1_l6_q2'] || 0} />
          )}
          {quizSubmitted['w1_l6_q2'] && (
            <AnswerExplanation explanation="Exact! Filosofia web-ului este „robustness principle” (fii tolerant cu ceea ce primești). Totuși, scrierea unui cod HTML curat și valid este semnul unui programator profesionist." />
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
        nextLabel="Spre Evaluarea Sumativă Oficială (Nivelul 7)"
      />
    </div>
  );
};
