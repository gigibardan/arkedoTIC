import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bug,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Coins,
  Eye,
  EyeOff,
  FileText,
  GraduationCap,
  HelpCircle,
  Home,
  Printer,
  RotateCcw,
  Search,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import {
  findWorksheetBySlug,
  getCompletedWorksheetsMap,
  getRelatedWorksheets,
  normalizeShortAnswer,
  saveCompletedWorksheetResult,
  WORKSHEET_GRADE_LABELS,
  WORKSHEET_KIND_LABELS,
  WORKSHEETS_BANK,
  WorksheetGrade,
  WorksheetItem,
  WorksheetKind,
  WorksheetQuestion,
} from '../../data/worksheets';
import { addByteCoins } from '../../lib/studentAuthService';
import { AllMissionId } from '../../types';
import { sounds } from '../../utils/audio';

interface WorksheetsHubProps {
  activeSlug?: string | null;
  onSelectWorksheet: (slug: string | null) => void;
  onBackToHome: () => void;
  onSelectMission: (missionId: AllMissionId) => void;
  onOpenBlog?: (slug?: string | null) => void;
  onOpenGlossary?: (slug?: string | null) => void;
  onOpenTraceWithCode?: (code: string, stdin: string, label: string) => void;
}

type GradeFilter = 'all' | WorksheetGrade;
type KindFilter = 'all' | WorksheetKind;

function isQuestionAnswerCorrect(
  question: WorksheetQuestion,
  userValue: number | string | undefined
): boolean {
  if (userValue === undefined || userValue === null || userValue === '') return false;
  if (question.type === 'mcq' || question.type === 'true-false') {
    return Number(userValue) === Number(question.correctAnswer);
  }
  const normalizedUser = normalizeShortAnswer(String(userValue));
  if (!normalizedUser) return false;
  const canonical = normalizeShortAnswer(String(question.correctAnswer));
  if (normalizedUser === canonical) return true;
  if (question.acceptedAliases) {
    return question.acceptedAliases.some((alias) => normalizeShortAnswer(alias) === normalizedUser);
  }
  return false;
}

export const WorksheetsHub: React.FC<WorksheetsHubProps> = ({
  activeSlug = null,
  onSelectWorksheet,
  onBackToHome,
  onSelectMission,
  onOpenBlog,
  onOpenGlossary,
  onOpenTraceWithCode,
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const arky = useArky();

  const [gradeFilter, setGradeFilter] = useState<GradeFilter>('all');
  const [kindFilter, setKindFilter] = useState<KindFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [completedMap, setCompletedMap] = useState(() => getCompletedWorksheetsMap());

  // Detail interactive state
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showSolutionsAndRubric, setShowSolutionsAndRubric] = useState<boolean>(false);
  const [printWithSolutions, setPrintWithSolutions] = useState<boolean>(false);
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);

  const selectedWorksheet: WorksheetItem | null = useMemo(() => {
    if (!activeSlug) return null;
    return findWorksheetBySlug(activeSlug).worksheet;
  }, [activeSlug]);

  // Reset interactive state cleanly when switching worksheet
  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setShowSolutionsAndRubric(false);
    setPrintWithSolutions(false);
    setRewardMessage(null);
  }, [selectedWorksheet?.id]);

  const filteredWorksheets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return WORKSHEETS_BANK.filter((item) => {
      if (gradeFilter !== 'all' && item.grade !== gradeFilter) return false;
      if (kindFilter !== 'all' && item.kind !== kindFilter) return false;
      if (!q) return true;
      const loc = isEn ? item.en : item.ro;
      const haystack = `${loc.title} ${loc.directAnswerSummary} ${loc.keywords.join(' ')} ${item.curriculumRef}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [gradeFilter, kindFilter, searchQuery, isEn]);

  const completedCount = Object.keys(completedMap).length;

  const evaluationSummary = useMemo(() => {
    if (!selectedWorksheet) return null;
    let earnedItemPoints = 0;
    let correctItems = 0;
    for (const q of selectedWorksheet.questions) {
      if (isQuestionAnswerCorrect(q, answers[q.id])) {
        earnedItemPoints += q.points;
        correctItems += 1;
      }
    }
    const totalPoints = Math.min(
      selectedWorksheet.maxPoints,
      selectedWorksheet.exOfficioPoints + earnedItemPoints
    );
    const nota = Math.max(1, Math.min(10, Math.round((totalPoints / 10) * 100) / 100));
    return {
      earnedItemPoints,
      totalPoints,
      nota,
      correctItems,
      totalItems: selectedWorksheet.questions.length,
    };
  }, [selectedWorksheet, answers]);

  const handleCheckAnswers = async () => {
    if (!selectedWorksheet || !evaluationSummary) return;
    sounds.playSuccess();
    setSubmitted(true);
    setShowSolutionsAndRubric(true);

    const saved = saveCompletedWorksheetResult(selectedWorksheet.id, evaluationSummary.totalPoints);
    setCompletedMap(getCompletedWorksheetsMap());

    if (saved.isFirstSolve) {
      await addByteCoins(35);
      setRewardMessage(
        isEn
          ? `Worksheet graded: ${evaluationSummary.totalPoints}/100 pts (Grade ${evaluationSummary.nota.toFixed(2)}) · +35 ByteCoins awarded!`
          : `Fișă evaluată: ${evaluationSummary.totalPoints}/100p (Nota ${evaluationSummary.nota.toFixed(2)}) · Ai câștigat +35 ByteCoins!`
      );
      arky.triggerSuccess(
        isEn
          ? `Awesome job! Score ${evaluationSummary.totalPoints}/100 and +35 ByteCoins earned!`
          : `Bravo! Ai obținut ${evaluationSummary.totalPoints}/100p și +35 ByteCoins!`
      );
    } else {
      setRewardMessage(
        isEn
          ? `Updated score: ${evaluationSummary.totalPoints}/100 pts (Best: ${saved.bestScore}/100)`
          : `Scor actualizat: ${evaluationSummary.totalPoints}/100p (Record personal: ${saved.bestScore}/100p)`
      );
    }
  };

  const handleResetSheet = () => {
    sounds.playClick();
    setAnswers({});
    setSubmitted(false);
    setRewardMessage(null);
  };

  const handlePrintSheet = (includeSolutions: boolean) => {
    sounds.playClick();
    setPrintWithSolutions(includeSolutions);
    if (includeSolutions) {
      setShowSolutionsAndRubric(true);
    }
    setTimeout(() => {
      window.print();
    }, 80);
  };

  // ============================================================================
  // DETAIL WORKSHEET VIEW (INTERACTIVE + A4 PRINTABLE)
  // ============================================================================
  if (selectedWorksheet) {
    const loc = isEn ? selectedWorksheet.en : selectedWorksheet.ro;
    const gradeLabel = WORKSHEET_GRADE_LABELS[selectedWorksheet.grade][isEn ? 'en' : 'ro'];
    const kindLabel = WORKSHEET_KIND_LABELS[selectedWorksheet.kind][isEn ? 'en' : 'ro'];
    const related = getRelatedWorksheets(selectedWorksheet.id, 3);
    const savedRecord = completedMap[selectedWorksheet.id];

    return (
      <div className="space-y-5 print:space-y-4 print:bg-white print:text-slate-900">
        {/* Top Action Toolbar (Hidden when printing) */}
        <div className="print:hidden flex flex-wrap items-center justify-between gap-2.5 bg-slate-950/90 border border-slate-800 rounded-2xl p-3 sm:p-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onSelectWorksheet(null);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition cursor-pointer whitespace-nowrap min-h-[38px]"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{isEn ? 'All 16 Worksheets' : 'Toate cele 16 Fișe'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onBackToHome();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer whitespace-nowrap min-h-[38px]"
            >
              <Home className="w-3.5 h-3.5 shrink-0" />
              <span>{isEn ? 'Courses' : 'Catalog'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedWorksheet.optionalCppTraceCode && onOpenTraceWithCode && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenTraceWithCode(
                    selectedWorksheet.optionalCppTraceCode!,
                    selectedWorksheet.optionalCppTraceStdin || '',
                    loc.breadcrumbLabel
                  );
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition cursor-pointer whitespace-nowrap min-h-[38px]"
              >
                <Bug className="w-3.5 h-3.5 shrink-0" />
                <span>{isEn ? 'Open Code in C++ Trace' : 'Deschide Codul în Trace C++'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setShowSolutionsAndRubric((prev) => !prev);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-amber-200 transition cursor-pointer whitespace-nowrap min-h-[38px]"
            >
              {showSolutionsAndRubric ? (
                <EyeOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              ) : (
                <Eye className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              )}
              <span>
                {showSolutionsAndRubric
                  ? isEn
                    ? 'Hide Answer Key'
                    : 'Ascunde Baremul'
                  : isEn
                  ? 'Show Answer Key'
                  : 'Afișează Baremul'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handlePrintSheet(false)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer whitespace-nowrap min-h-[38px]"
              title={isEn ? 'Print blank student copy (no answers)' : 'Tipărește A4 varianta elev (fără rezolvări)'}
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span>{isEn ? 'Print Blank A4' : 'Tipărește A4 (Elev)'}</span>
            </button>

            <button
              type="button"
              onClick={() => handlePrintSheet(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-emerald-500/40 text-emerald-200 text-xs font-bold transition cursor-pointer whitespace-nowrap min-h-[38px]"
              title={isEn ? 'Print teacher key with full rubric' : 'Tipărește A4 cu barem și rezolvări'}
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span>{isEn ? 'Print Key' : 'Tipărește cu Barem'}</span>
            </button>
          </div>
        </div>

        {/* Printable A4 School Header (Shown ONLY when printing) */}
        <div className="hidden print:block border-2 border-slate-800 rounded-lg p-4 mb-4 text-black">
          <div className="flex items-start justify-between gap-4 border-b border-slate-400 pb-3 mb-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                ArkyEdu · {selectedWorksheet.curriculumRef}
              </div>
              <h1 className="text-lg font-black text-black mt-0.5">{loc.title}</h1>
            </div>
            <div className="text-right text-xs font-mono tabular-nums shrink-0">
              <div>{gradeLabel} · {kindLabel}</div>
              <div className="font-bold">{selectedWorksheet.maxPoints}p ({selectedWorksheet.exOfficioPoints}p oficiu)</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs font-semibold">
            <div>{isEn ? 'Student Name:' : 'Nume și Prenume:'} ______________________</div>
            <div>{isEn ? 'Class / Date:' : 'Clasa / Data:'} ________________</div>
            <div className="text-right">{isEn ? 'Score / Grade:' : 'Punctaj / Nota:'} _____ / {selectedWorksheet.maxPoints}p</div>
          </div>
        </div>

        {/* Main Sheet Header (Screen) */}
        <header className="print:hidden rounded-2xl bg-slate-950/90 border border-slate-800 p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
            <div className="flex flex-wrap items-center gap-2 font-mono">
              <span className="font-bold text-teal-300">{gradeLabel}</span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="font-semibold text-amber-300">{kindLabel}</span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 tabular-nums">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {selectedWorksheet.estimatedMinutes} min
              </span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="tabular-nums font-bold text-emerald-300">
                {selectedWorksheet.maxPoints}p ({selectedWorksheet.exOfficioPoints}p {isEn ? 'free' : 'oficiu'})
              </span>
            </div>

            {savedRecord && (
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 tabular-nums">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {isEn
                    ? `Best: ${savedRecord.bestScore}/100 (Grade ${savedRecord.bestNota.toFixed(2)})`
                    : `Record: ${savedRecord.bestScore}/100p (Nota ${savedRecord.bestNota.toFixed(2)})`}
                </span>
              </div>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-heading leading-tight">
            {loc.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/75 border border-slate-800 rounded-xl p-3.5">
            {loc.directAnswerSummary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-3.5 space-y-1.5">
              <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 shrink-0" />
                <span>{isEn ? 'Learning Objectives & Theory Snapshot' : 'Obiective & Sinteză Rapidă de Teorie'}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{loc.theorySnapshot}</p>
            </div>

            <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-3.5 space-y-1.5">
              <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{isEn ? 'Curriculum & Interactive Practice' : 'Programă & Practică Interactivă'}</span>
              </div>
              <p className="text-slate-300">{selectedWorksheet.curriculumRef}</p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onSelectMission(selectedWorksheet.relatedModuleId);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-600/20 hover:bg-teal-600/35 border border-teal-500/40 text-teal-200 font-bold transition cursor-pointer whitespace-nowrap"
                >
                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                  <span>{isEn ? 'Open Interactive Lesson' : 'Deschide Lecția Interactivă'}</span>
                </button>
                {selectedWorksheet.relatedBlogSlugRo && onOpenBlog && (
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onOpenBlog(isEn ? selectedWorksheet.relatedBlogSlugEn : selectedWorksheet.relatedBlogSlugRo);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold transition cursor-pointer whitespace-nowrap"
                  >
                    <FileText className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>{isEn ? 'Study Guide' : 'Ghid Blog'}</span>
                  </button>
                )}
                {selectedWorksheet.relatedGlossarySlugRo && onOpenGlossary && (
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onOpenGlossary(isEn ? selectedWorksheet.relatedGlossarySlugEn : selectedWorksheet.relatedGlossarySlugRo);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold transition cursor-pointer whitespace-nowrap"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{isEn ? 'Glossary Term' : 'Termen Glosar'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Reward / Score Banner after grading */}
        {submitted && evaluationSummary && (
          <div
            role="status"
            className="print:hidden rounded-2xl bg-emerald-950/50 border border-emerald-500/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-black text-white tabular-nums">
                  {rewardMessage ||
                    `${evaluationSummary.totalPoints}/${selectedWorksheet.maxPoints}p · ${
                      isEn ? 'Grade' : 'Nota'
                    } ${evaluationSummary.nota.toFixed(2)}`}
                </div>
                <div className="text-xs text-emerald-200 tabular-nums">
                  {isEn
                    ? `${evaluationSummary.correctItems}/${evaluationSummary.totalItems} items solved correctly (+${selectedWorksheet.exOfficioPoints} ex officio points included).`
                    : `${evaluationSummary.correctItems}/${evaluationSummary.totalItems} itemi corecți (+${selectedWorksheet.exOfficioPoints}p din oficiu incluse).`}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetSheet}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white cursor-pointer whitespace-nowrap shrink-0 min-h-[38px]"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span>{isEn ? 'Retry Worksheet' : 'Reia Fișa'}</span>
            </button>
          </div>
        )}

        {/* Interactive + Printable Questions List */}
        <section aria-label={isEn ? 'Worksheet Items' : 'Subiecte și Exerciții'} className="space-y-4">
          {selectedWorksheet.questions.map((q, qIdx) => {
            const prompt = isEn ? q.promptEn : q.promptRo;
            const partLabel = isEn ? q.partLabelEn : q.partLabelRo;
            const options = isEn ? q.optionsEn : q.optionsRo;
            const solutionStep = isEn ? q.solutionStepEn : q.solutionStepRo;
            const userVal = answers[q.id];
            const isCorrect = submitted ? isQuestionAnswerCorrect(q, userVal) : false;

            return (
              <article
                key={q.id}
                className={`rounded-2xl border p-4 sm:p-5 space-y-3 print:rounded-lg print:border-slate-400 print:bg-white print:text-black print:break-inside-avoid ${
                  submitted
                    ? isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/45'
                      : 'bg-rose-950/20 border-rose-500/45'
                    : 'bg-slate-950/85 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="font-mono font-bold text-teal-300 print:text-black">
                    {qIdx + 1}. {partLabel}
                  </div>
                  <div className="flex items-center gap-2 font-mono font-bold tabular-nums">
                    {submitted && (
                      <span
                        className={`inline-flex items-center gap-1 ${
                          isCorrect ? 'text-emerald-300' : 'text-rose-300'
                        }`}
                      >
                        {isCorrect ? (
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span>{isCorrect ? `+${q.points}p` : '0p'}</span>
                      </span>
                    )}
                    <span className="text-slate-300 print:text-slate-700">({q.points}p)</span>
                  </div>
                </div>

                <h2 className="text-sm sm:text-base font-bold text-white print:text-black leading-snug">
                  {prompt}
                </h2>

                {q.codeSnippet && (
                  <pre className="rounded-xl bg-slate-900 border border-slate-700/80 p-3.5 text-xs sm:text-sm font-mono text-cyan-200 overflow-x-auto print:bg-slate-100 print:text-black print:border-slate-300">
                    <code>{q.codeSnippet}</code>
                  </pre>
                )}

                {(q.type === 'mcq' || q.type === 'true-false') && options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {options.map((opt, optIdx) => {
                      const isSelected = userVal === optIdx;
                      const isRightOption = Number(q.correctAnswer) === optIdx;
                      const letter = String.fromCharCode(65 + optIdx);

                      let btnStyle =
                        'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-slate-200';
                      if (submitted) {
                        if (isRightOption) {
                          btnStyle = 'bg-emerald-950/60 border-emerald-400 text-emerald-200 font-bold';
                        } else if (isSelected && !isRightOption) {
                          btnStyle = 'bg-rose-950/60 border-rose-400 text-rose-200';
                        } else {
                          btnStyle = 'bg-slate-900/50 border-slate-800 text-slate-400';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-teal-600/25 border-teal-400 text-white font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={submitted}
                          onClick={() => {
                            sounds.playClick();
                            setAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                          }}
                          className={`text-left px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition flex items-start gap-2.5 cursor-pointer disabled:cursor-default print:bg-white print:text-black print:border-slate-400 ${btnStyle}`}
                        >
                          <span className="font-mono font-bold text-teal-400 print:text-black shrink-0">
                            {letter})
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {(q.type === 'short-answer' || q.type === 'code-output') && (
                  <div className="pt-1 space-y-1.5">
                    <input
                      type="text"
                      disabled={submitted}
                      value={typeof userVal === 'string' ? userVal : ''}
                      onChange={(e) =>
                        setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                      }
                      placeholder={isEn ? q.placeholderEn : q.placeholderRo}
                      aria-label={`${partLabel} answer`}
                      className="print:hidden w-full sm:max-w-md min-h-[42px] rounded-xl bg-slate-900 border border-slate-700 focus:border-teal-400 px-3.5 py-2 text-sm font-mono text-white placeholder-slate-500 focus:outline-none disabled:opacity-80"
                    />
                    <div className="hidden print:block border-b border-dashed border-slate-500 h-7 text-xs text-slate-500 pt-1">
                      {isEn ? 'Answer:' : 'Răspuns:'}
                    </div>
                  </div>
                )}

                {/* Worked solution (shown when toggled on screen OR printed with solutions) */}
                {(showSolutionsAndRubric || printWithSolutions) && (
                  <div
                    className={`rounded-xl border border-emerald-500/35 bg-emerald-950/25 p-3 text-xs text-emerald-100 leading-relaxed print:bg-slate-50 print:text-black print:border-slate-400 ${
                      printWithSolutions ? 'print:block' : 'print:hidden'
                    }`}
                  >
                    <strong className="text-emerald-300 print:text-black">
                      {isEn ? 'Solution & Key: ' : 'Rezolvare & Barem: '}
                    </strong>
                    <span>
                      {(q.type === 'mcq' || q.type === 'true-false') && options
                        ? `${String.fromCharCode(65 + Number(q.correctAnswer))}) ${
                            options[Number(q.correctAnswer)]
                          } — `
                        : `${String(q.correctAnswer)} — `}
                    </span>
                    <span>{solutionStep}</span>
                  </div>
                )}
              </article>
            );
          })}
        </section>

        {/* Submit / Auto-Grade Bar */}
        <div className="print:hidden flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-950/90 border border-slate-800 p-4">
          <div className="text-xs text-slate-300 tabular-nums">
            {isEn
              ? `Answered ${Object.keys(answers).length} / ${selectedWorksheet.questions.length} items · +${selectedWorksheet.exOfficioPoints} ex officio points`
              : `Completat ${Object.keys(answers).length} / ${selectedWorksheet.questions.length} itemi · +${selectedWorksheet.exOfficioPoints}p din oficiu`}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!submitted ? (
              <button
                type="button"
                onClick={() => {
                  void handleCheckAnswers();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black transition cursor-pointer whitespace-nowrap min-h-[42px]"
              >
                <ClipboardCheck className="w-4 h-4 shrink-0" />
                <span>
                  {isEn ? 'Grade Worksheet (1–10)' : 'Verifică Răspunsurile & Calculează Nota'}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleResetSheet}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer whitespace-nowrap min-h-[42px]"
              >
                <RotateCcw className="w-4 h-4 shrink-0" />
                <span>{isEn ? 'Reset & Try Again' : 'Resetează & Încearcă Din Nou'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Official 100-Point Rubric Table */}
        {(showSolutionsAndRubric || printWithSolutions) && (
          <section
            aria-label={isEn ? 'Official 100-Point Rubric' : 'Barem Oficial de Evaluare (100p)'}
            className={`rounded-2xl bg-slate-950/90 border border-slate-800 p-5 space-y-3 print:bg-white print:text-black print:border-slate-400 print:break-inside-avoid ${
              printWithSolutions ? 'print:block' : 'print:hidden'
            }`}
          >
            <h2 className="text-base sm:text-lg font-black text-white print:text-black flex items-center gap-2 font-heading">
              <GraduationCap className="w-5 h-5 text-amber-400 print:text-black shrink-0" />
              <span>
                {isEn
                  ? 'Official Grading Rubric (Total 100 pts → Grade 1–10)'
                  : 'Barem Oficial de Evaluare și Notare (Total 100p → Nota 1–10)'}
              </span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse tabular-nums">
                <thead>
                  <tr className="border-b border-slate-700 print:border-slate-400 text-slate-300 print:text-black">
                    <th className="py-2 pr-3 font-bold">{isEn ? 'Section' : 'Subiect / Item'}</th>
                    <th className="py-2 px-3 font-bold">{isEn ? 'Evaluated Competency' : 'Competență Evaluată'}</th>
                    <th className="py-2 pl-3 font-bold text-right">{isEn ? 'Points' : 'Punctaj'}</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedWorksheet.rubricRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-800/80 print:border-slate-300 text-slate-200 print:text-black"
                    >
                      <td className="py-2 pr-3 font-semibold">{isEn ? row.itemEn : row.itemRo}</td>
                      <td className="py-2 px-3">{isEn ? row.competencyEn : row.competencyRo}</td>
                      <td className="py-2 pl-3 font-mono font-bold text-right text-emerald-300 print:text-black">
                        {row.points}p
                      </td>
                    </tr>
                  ))}
                  <tr className="font-black text-white print:text-black">
                    <td colSpan={2} className="py-2.5 pr-3">
                      {isEn ? 'TOTAL (Final Grade = Total Points / 10)' : 'TOTAL GENERAL (Nota Finală = Total Puncte / 10)'}
                    </td>
                    <td className="py-2.5 pl-3 font-mono text-right text-amber-300 print:text-black">
                      {selectedWorksheet.maxPoints}p
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-400 print:text-slate-700 pt-1">
              <strong className="text-slate-200 print:text-black">
                {isEn ? 'Teacher Note: ' : 'Recomandare Profesor: '}
              </strong>
              {loc.teacherTips}
            </p>
          </section>
        )}

        {/* FAQ Section for Students, Parents & Search Engines */}
        {selectedWorksheet.faqs.length > 0 && (
          <section className="print:hidden rounded-2xl bg-slate-950/80 border border-slate-800 p-5 space-y-3">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2 font-heading">
              <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{isEn ? 'Frequently Asked Questions' : 'Întrebări Frecvente & Capcane la Test'}</span>
            </h2>
            <div className="space-y-3">
              {selectedWorksheet.faqs.map((faq, idx) => (
                <div key={idx} className="rounded-xl bg-slate-900/70 border border-slate-800 p-3.5 space-y-1">
                  <div className="text-xs sm:text-sm font-bold text-cyan-200">
                    {isEn ? faq.qEn : faq.qRo}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isEn ? faq.aEn : faq.aRo}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Worksheets */}
        <section className="print:hidden space-y-3">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
            {isEn ? 'More Practice Worksheets & Exams' : 'Alte Fișe & Teste Recomandate'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {related.map((rel) => {
              const rLoc = isEn ? rel.en : rel.ro;
              const rGrade = WORKSHEET_GRADE_LABELS[rel.grade][isEn ? 'en' : 'ro'];
              const rKind = WORKSHEET_KIND_LABELS[rel.kind][isEn ? 'shortEn' : 'shortRo'];
              return (
                <button
                  key={rel.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onSelectWorksheet(rLoc.slug);
                  }}
                  className="text-left rounded-xl p-4 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/40 transition flex flex-col justify-between gap-2 cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="text-[11px] font-mono text-teal-300">
                      {rGrade} · {rKind} · {rel.maxPoints}p
                    </div>
                    <div className="text-sm font-bold text-white line-clamp-2">{rLoc.title}</div>
                  </div>
                  <span className="text-xs font-bold text-emerald-300 inline-flex items-center gap-1">
                    <span>{isEn ? 'Open sheet' : 'Deschide fișa'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  // ============================================================================
  // HUB INDEX VIEW (ALL 16 WORKSHEETS, EXAMS & OLYMPIAD SHEETS)
  // ============================================================================
  return (
    <div className="space-y-6">
      {/* Top Hero Header */}
      <section className="rounded-3xl bg-slate-950/90 border border-slate-800 p-5 sm:p-7 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="text-xs font-mono font-bold text-emerald-300">
              {isEn
                ? 'ArkyEdu Assessment Library · 16 Interactive & A4 Printable Sheets (32 RO/EN Pages)'
                : 'Biblioteca de Evaluare ArkyEdu · 16 Fișe Interactive & Imprimabile A4 (Barem 1–10)'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading leading-tight">
              {isEn
                ? 'ICT Worksheets, Graded Exams (1–10) & C++ Olympiad Practice Bank (Grades 5–8)'
                : 'Fișe de Lucru, Teste cu Barem 1–10 & Subiecte OJI / Admitere TIC (Clasele V–VIII)'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isEn
                ? 'Solve worksheets interactively for +35 ByteCoins and instant 1–10 grading, inspect C++ solutions inside the Visual RAM Trace Debugger, or print clean blank A4 student copies and full teacher answer keys in one click.'
                : 'Rezolvă fișele direct în browser pentru notare automată 1–10 și +35 ByteCoins, rulează codul C++ în Debug Vizual Trace RAM sau tipărește A4 în 1 clic varianta pentru elev (fără rezolvări) ori varianta profesor cu barem oficial.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 px-4 py-3 text-center min-w-[130px] tabular-nums">
              <div className="text-[11px] font-mono text-slate-400 uppercase font-bold">
                {isEn ? 'Completed' : 'Finalizate'}
              </div>
              <div className="text-xl font-black text-emerald-300 font-heading">
                {completedCount} <span className="text-xs text-slate-400">/ {WORKSHEETS_BANK.length}</span>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 px-4 py-3 text-center min-w-[130px] tabular-nums">
              <div className="text-[11px] font-mono text-slate-400 uppercase font-bold">
                {isEn ? 'First Solve Bonus' : 'Bonus Rezolvare'}
              </div>
              <div className="text-xl font-black text-amber-300 font-heading inline-flex items-center gap-1 justify-center">
                <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+35 BC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grade & Kind Filters + Search */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'all', labelRo: 'Toate Clasele', labelEn: 'All Grades' },
                { id: 5, labelRo: 'Clasa V', labelEn: 'Grade 5' },
                { id: 6, labelRo: 'Clasa VI', labelEn: 'Grade 6' },
                { id: 7, labelRo: 'Clasa VII', labelEn: 'Grade 7' },
                { id: 8, labelRo: 'Clasa VIII', labelEn: 'Grade 8' },
              ] as const
            ).map((g) => {
              const active = gradeFilter === g.id;
              return (
                <button
                  key={String(g.id)}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setGradeFilter(g.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap min-h-[36px] ${
                    active
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  {isEn ? g.labelEn : g.labelRo}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'all', labelRo: 'Toate Tipurile', labelEn: 'All Types' },
                { id: 'worksheet', labelRo: 'Fișe de Lucru', labelEn: 'Worksheets' },
                { id: 'exam', labelRo: 'Teste cu Barem', labelEn: 'Graded Exams' },
                { id: 'olympiad', labelRo: 'OJI & Admitere', labelEn: 'Olympiad / Prep' },
                { id: 'project', labelRo: 'Ghid Proiect', labelEn: 'Projects' },
              ] as const
            ).map((k) => {
              const active = kindFilter === k.id;
              return (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setKindFilter(k.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap min-h-[36px] ${
                    active
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  {isEn ? k.labelEn : k.labelRo}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-64 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? 'Search C++, Excel, Word...' : 'Caută C++, Excel, Scratch...'}
              aria-label={isEn ? 'Search worksheets' : 'Caută fișe și teste'}
              className="w-full min-h-[38px] pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-teal-400 text-xs text-white placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Cards Grid */}
      {filteredWorksheets.length === 0 ? (
        <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-8 text-center space-y-2">
          <div className="text-sm font-bold text-white">
            {isEn ? 'No worksheets match your filters.' : 'Nicio fișă nu corespunde filtrelor alese.'}
          </div>
          <button
            type="button"
            onClick={() => {
              setGradeFilter('all');
              setKindFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
          >
            {isEn ? 'Reset Filters' : 'Resetează Filtrele'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorksheets.map((item) => {
            const loc = isEn ? item.en : item.ro;
            const gradeText = WORKSHEET_GRADE_LABELS[item.grade][isEn ? 'en' : 'ro'];
            const kindText = WORKSHEET_KIND_LABELS[item.kind][isEn ? 'en' : 'ro'];
            const record = completedMap[item.id];

            return (
              <article
                key={item.id}
                className="rounded-2xl bg-slate-950/85 hover:bg-slate-950 border border-slate-800 hover:border-emerald-500/45 p-5 flex flex-col justify-between gap-4 transition"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                    <span className="text-teal-300 font-bold">
                      {gradeText} · {kindText}
                    </span>
                    <span className="text-slate-400 tabular-nums shrink-0">
                      {item.estimatedMinutes} min · {item.maxPoints}p
                    </span>
                  </div>

                  <h2 className="text-base font-extrabold text-white font-heading leading-snug">
                    {loc.title}
                  </h2>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {loc.directAnswerSummary}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    {record ? (
                      <span className="inline-flex items-center gap-1 text-emerald-300 font-bold tabular-nums">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {isEn ? `Best ${record.bestScore}p` : `Nota ${record.bestNota.toFixed(2)}`}
                        </span>
                      </span>
                    ) : (
                      <span className="text-slate-400">
                        {item.optionalCppTraceCode
                          ? isEn
                            ? 'Includes C++ Trace'
                            : 'Include Trace RAM C++'
                          : isEn
                          ? 'A4 Printable + Key'
                          : 'Imprimabilă A4 + Barem'}
                      </span>
                    )}

                    <a
                      href={isEn ? `/fise/en/${item.en.slug}/` : `/fise/${item.ro.slug}/`}
                      onClick={(e) => {
                        e.preventDefault();
                        sounds.playClick();
                        onSelectWorksheet(loc.slug);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition whitespace-nowrap shrink-0 min-h-[36px]"
                    >
                      <span>{isEn ? 'Solve / Print' : 'Rezolvă / Tipărește'}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
