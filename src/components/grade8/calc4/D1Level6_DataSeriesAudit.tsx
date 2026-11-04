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
  Sliders,
  Filter,
  BarChart,
  EyeOff,
  Eye
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface D1Level6Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface AuditCase {
  id: string;
  bugTitle: string;
  bugTitleEn: string;
  symptom: string;
  symptomEn: string;
  defectDesc: string;
  defectDescEn: string;
  fixOptions: string[];
  fixOptionsEn: string[];
  correctIndex: number;
  explanation: string;
  explanationEn: string;
}

const AUDIT_CASES: AuditCase[] = [
  {
    id: 'case_total_in_pie',
    bugTitle: '1. Foaia circulară cu Total inclus greșit',
    bugTitleEn: '1. Pie Chart with Total Mistakenly Included',
    symptom: 'Jumătate din diagramă (50%) este o singură felie imensă etichetată „TOTAL”.',
    symptomEn: 'Half of the chart (50%) is a single giant slice labeled "TOTAL".',
    defectDesc: 'La selectarea intervalului pentru Pie Chart s-a inclus și rândul de jos care conținea formula =SUM(...). Deoarece suma elementelor este egală cu totalul, diagrama s-a dublat.',
    defectDescEn: 'When selecting the range for the Pie Chart, the bottom row containing the formula =SUM(...) was also included. Since the sum of elements equals the total, the chart doubled.',
    fixOptions: [
      'Folosim comanda „Select Data Source” și restrângem selecția doar la categoriile individuale (ex: A2:B6 în loc de A2:B7)',
      'Ștergem manual formula de calcul a totalului din foaie',
      'Împărțim toate valorile la 2'
    ],
    fixOptionsEn: [
      'Use the "Select Data Source" command and restrict selection strictly to individual categories (e.g. A2:B6 instead of A2:B7)',
      'Manually delete the total calculation formula from the worksheet',
      'Divide all values by 2'
    ],
    correctIndex: 0,
    explanation: 'Manual pag. 35: Într-o diagramă circulară nu se selectează NICIODATĂ linia de Total, deoarece Excel calculează automat întregul (100%) însumând feliile componente!',
    explanationEn: 'Textbook page 35: In a pie chart, NEVER select the Total row, because Excel automatically computes the whole (100%) by summing component slices!'
  },
  {
    id: 'case_truncated_axis',
    bugTitle: '2. Scara Y trunchiată artificial (Diagramă Înșelătoare)',
    bugTitleEn: '2. Artificially Truncated Y-Axis (Misleading Chart)',
    symptom: 'O creștere a vânzărilor de la 100 la 103 pare o explozie vizuală de 10 ori mai mare.',
    symptomEn: 'A sales increase from 100 to 103 looks visually like a 10x explosion.',
    defectDesc: 'Axa Y are valoarea minimă setată la 99 în loc de 0. Această practică este considerată o tehnică de manipulare vizuală a datelor.',
    defectDescEn: 'The Y-axis minimum bound is set to 99 instead of 0. This practice is considered an unethical visual data manipulation technique.',
    fixOptions: [
      'Formatăm Axa Y (Format Axis) și setăm valoarea minimă a limitelor (Minimum Bound) la 0',
      'Schimbăm culoarea barelor în gri',
      'Ștergem axa Y din diagramă ca să nu se mai vadă numerele'
    ],
    fixOptionsEn: [
      'Format the Y-Axis (Format Axis) and set the Minimum Bound value to 0',
      'Change bar colors to gray',
      'Delete the Y axis from the chart so numbers are hidden'
    ],
    correctIndex: 0,
    explanation: 'Corect! Pentru a păstra onestitatea științifică a comparației, barele verticale trebuie să aibă întotdeauna originea în 0, altfel diferențele mici devin disproporționat de dramatice.',
    explanationEn: 'Correct! To maintain scientific integrity in comparisons, vertical bars must always start at origin 0, otherwise small differences become disproportionately exaggerated.'
  },
  {
    id: 'case_line_between_discrete',
    bugTitle: '3. Linie continuă trasată între categorii deconectate',
    bugTitleEn: '3. Continuous Line Drawn Between Disconnected Categories',
    symptom: 'O diagramă de linii unește „Mere”, „Banane”, „Portocale” și „Struguri”.',
    symptomEn: 'A line chart connects "Apples", "Bananas", "Oranges", and "Grapes".',
    defectDesc: 'Fructele sunt categorii discrete, fără nicio succesiune cronologică sau cauzală. O linie între ele induce în eroare că ar exista valori intermediare.',
    defectDescEn: 'Fruits are discrete categories without chronological or causal sequence. A connecting line falsely implies intermediate values exist.',
    fixOptions: [
      'Schimbăm tipul diagramei (Change Chart Type) în Coloane (Column) sau Bare (Bar)',
      'Adăugăm mai multe linii colorate',
      'Lăsăm linia dar o facem punctată'
    ],
    fixOptionsEn: [
      'Change Chart Type to Column or Bar chart',
      'Add more colored lines',
      'Keep the line but make it dashed'
    ],
    correctIndex: 0,
    explanation: 'Manual pag. 29: Diagramele de linii sunt destinate evoluțiilor în timp. Pentru mărfuri sau categorii nominale distincte, reprezentarea corectă este cu coloane separate.',
    explanationEn: 'Textbook page 29: Line charts are designated for trends over time. For distinct commodities or nominal categories, the correct visual form is discrete columns or bars.'
  }
];

export const D1Level6_DataSeriesAudit: React.FC<D1Level6Props> = ({
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

  const currentCase = AUDIT_CASES[activeCaseIdx];

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
          ? 'Incorrect solution. This fix does not solve the underlying visual flaw. Recheck according to the curriculum manual!'
          : 'Soluție incorectă. Această remediere nu rezolvă defectul de proiectare vizuală. Reîncearcă conform manualului!'
      });
    }
  };

  const handleNextCase = () => {
    sounds.playClick();
    setSelectedFix(null);
    setFeedback(null);
    if (activeCaseIdx < AUDIT_CASES.length - 1) {
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

  const allLabFixed = solvedCases.length === AUDIT_CASES.length;
  const quizDone = Object.keys(quizSubmitted).length >= 2;
  const canFinish = allLabFixed && quizDone;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/70 via-rose-950/40 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Art Klett Manual 2025 • Pages 32–35' : 'Manual Art Klett 2025 • Pag. 32–35'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-amber-400" />
              {lang === 'en'
                ? 'Level 6: Audit Clinic & Faulty Charts Diagnostics'
                : 'Nivelul 6: Clinica de Audit & Corectare a Diagramelor Greșite'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {lang === 'en'
                ? 'Learn to detect distorted charts, manipulated Y-axis baselines, and common pitfalls committed when selecting data ranges.'
                : 'Învață să depistezi diagramele deformate, scările Y manipulate și erorile frecvente comise la selectarea intervalelor de date.'}
            </p>
          </div>
          <div className="text-right shrink-0 bg-slate-900/80 px-4 py-3 rounded-2xl border border-amber-500/20">
            <div className="text-xs text-slate-400 uppercase font-semibold">
              {lang === 'en' ? 'Cases Solved' : 'Cazuri Rezolvate'}
            </div>
            <div className="text-2xl font-black text-amber-400">{solvedCases.length}/{AUDIT_CASES.length}</div>
            <div className="text-[11px] text-slate-400">
              {lang === 'en' ? 'Remediated Charts' : 'Diagrame Remediate'}
            </div>
          </div>
        </div>
      </div>

      {/* Case Navigator */}
      <div className="grid grid-cols-3 gap-2">
        {AUDIT_CASES.map((ac, idx) => {
          const isCurrent = idx === activeCaseIdx;
          const isSolved = solvedCases.includes(ac.id);
          const title = lang === 'en' ? ac.bugTitleEn : ac.bugTitle;
          return (
            <button
              key={ac.id}
              onClick={() => {
                sounds.playClick();
                setActiveCaseIdx(idx);
                setSelectedFix(null);
                setFeedback(null);
              }}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                isCurrent
                  ? 'border-amber-500 bg-amber-500/10 text-amber-300 shadow-md ring-2 ring-amber-500/20'
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
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              !
            </div>
            <div>
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                {lang === 'en' ? 'Visual Audit Sheet' : 'Fișă de Audit Vizual'}
              </span>
              <h2 className="text-lg font-bold text-white">
                {lang === 'en' ? currentCase.bugTitleEn : currentCase.bugTitle}
              </h2>
            </div>
          </div>
          <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            {lang === 'en'
              ? `Defect ${activeCaseIdx + 1} of ${AUDIT_CASES.length}`
              : `Defectul ${activeCaseIdx + 1} din ${AUDIT_CASES.length}`}
          </span>
        </div>

        {/* Symptoms & Defect Details */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              {lang === 'en' ? 'Detected Visual Symptom' : 'Simptom Vizual Detectat'}
            </div>
            <p className="text-slate-200 text-sm">
              {lang === 'en' ? currentCase.symptomEn : currentCase.symptom}
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              {lang === 'en' ? 'Technical Cause' : 'Cauză Tehnică'}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {lang === 'en' ? currentCase.defectDescEn : currentCase.defectDesc}
            </p>
          </div>
        </div>

        {/* Fixing Options */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            {lang === 'en'
              ? 'How do you properly resolve this error in the spreadsheet application?'
              : 'Cum rezolvi corect această eroare în aplicația de calcul tabelar?'}
          </label>
          <div className="space-y-2.5">
            {(lang === 'en' ? currentCase.fixOptionsEn : currentCase.fixOptions).map((opt, idx) => {
              const isSelected = selectedFix === idx;
              const isCorrect = idx === currentCase.correctIndex;
              return (
                <button
                  key={idx}
                  onClick={() => handleFixSelect(idx)}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-start gap-3 ${
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
                  <span className="flex-1">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Message */}
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
        {selectedFix === currentCase.correctIndex && activeCaseIdx < AUDIT_CASES.length - 1 && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNextCase}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg flex items-center gap-2"
            >
              {lang === 'en' ? 'Next Audit Case' : 'Următorul Caz de Audit'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Reflection Quiz with Cooldowns */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {lang === 'en'
                ? 'Pedagogical Reflection: Ethics & Integrity in Graphical Representations'
                : 'Reflecție Pedagogică: Etica & Integritatea Reprezentărilor Grafice'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Critical thinking guide in the era of visual disinformation'
                : 'Ghid de gândire critică în era dezinformării vizuale'}
            </p>
          </div>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? '1. Why is it dangerous to crop or omit numeric value labels and scale numbers on a news broadcast chart?'
              : '1. De ce este periculos să decupezi sau să nu afișezi etichetele valorilor numerice pe o diagramă dintr-un buletin de știri?'}
          </div>
          <QuestionHint
            hintRo="Fără numere și unități de măsură, privitorul nu poate judeca magnitudinea reală."
            hintEn="Without numbers and measurement units, viewers cannot judge true magnitude."
          />
          <div className="space-y-2">
            {[
              {
                textRo: 'Fără etichete și valori clare pe axe, privitorul poate fi ușor manipulat vizual să creadă că o diferență insignifiantă este enormă sau invers',
                textEn: 'Without clear axis labels and values, viewers can be easily manipulated visually into believing an insignificant change is massive or vice-versa',
                correct: true
              },
              {
                textRo: 'Diagramele fără cifre sunt șterse automat de computer',
                textEn: 'Charts without numbers are automatically deleted by the computer',
                correct: false
              },
              {
                textRo: 'Nu există niciun risc, cifrele doar încarcă ecranul inutil',
                textEn: 'There is no risk; numbers merely clutter the display pointlessly',
                correct: false
              }
            ].map((opt, idx) => {
              const qId = 'd1_l6_q1';
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
          {isLocked('d1_l6_q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['d1_l6_q1'] || 0} />
          )}
          {quizSubmitted['d1_l6_q1'] && (
            <AnswerExplanation
              explanation={lang === 'en'
                ? 'Correct! Visual integrity mandates unambiguous units, clear chart titles, and truthful axis ticks so the audience is not deceived.'
                : 'Corect! Integritatea vizuală impune prezența clară a unității de măsură, a titlului și a gradațiilor axei pentru a nu induce în eroare auditoriul.'}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="text-sm font-semibold text-slate-200">
            {lang === 'en'
              ? '2. What keyboard shortcut in MS Excel instantly creates a default column chart on a separate sheet with a single keypress?'
              : '2. Ce scurtătură de tastatură permite în MS Excel crearea instantanee a unei diagrame implicite cu coloane pe o foaie nouă dintr-o singură apăsare de tastă?'}
          </div>
          <QuestionHint
            hintRo="Tasta funcțională din rândul de sus al tastaturii dedicată creării rapide de diagrame."
            hintEn="The function key on the top keyboard row designated for rapid chart generation."
          />
          <div className="space-y-2">
            {[
              {
                textRo: 'Tasta F11 (creează instant un Chart Sheet separat) sau Alt + F1 (creează diagrama încorporată în foaia curentă)',
                textEn: 'The F11 key (instantly creates a separate Chart Sheet) or Alt + F1 (creates an embedded chart in current sheet)',
                correct: true
              },
              {
                textRo: 'Tasta ESC',
                textEn: 'The ESC key',
                correct: false
              },
              {
                textRo: 'Ctrl + Alt + Delete',
                textEn: 'Ctrl + Alt + Delete',
                correct: false
              }
            ].map((opt, idx) => {
              const qId = 'd1_l6_q2';
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
          {isLocked('d1_l6_q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['d1_l6_q2'] || 0} />
          )}
          {quizSubmitted['d1_l6_q2'] && (
            <AnswerExplanation
              explanation={lang === 'en'
                ? 'Exact! Key F11 instantly spawns a separate dedicated Chart Sheet from the selected dataset, while Alt + F1 embeds the chart right into the active sheet.'
                : 'Exact! Tasta F11 creează instant o foaie separată cu diagrama datelor selectate, iar Alt+F1 inserează diagrama pe foaia activă de calcul.'}
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
          ? 'To Official Summative Exam (Level 7)'
          : 'Spre Evaluarea Sumativă Oficială (Nivelul 7)'}
      />
    </div>
  );
};
