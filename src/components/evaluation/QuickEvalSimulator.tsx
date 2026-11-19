import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Coins,
  Flag,
  GraduationCap,
  History,
  Play,
  Radio,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { generateQuickEvalQuestions, QuickEvalQuestion } from '../../data/quickEvalBank';
import { computeGradeDetails } from '../../utils/pedagogicalGrading';
import { logStudentResult } from '../../lib/resultsService';
import {
  addByteCoins,
  getActiveStudent,
  getStoredQuickEvalHistory,
  saveQuickEvalAttempt,
} from '../../lib/studentAuthService';
import { QuickEvalAttempt } from '../../types';
import { sounds } from '../../utils/audio';

interface QuickEvalSimulatorProps {
  studentName: string;
  onBackToCatalog: () => void;
  onOpenCarnet?: () => void;
  onOpenLiveQuiz?: () => void;
}

type SimulatorPhase = 'setup' | 'running' | 'review';
type GradeOption = 'all' | 5 | 6 | 7 | 8;
type DifficultyOption = 'all' | 'easy' | 'medium' | 'hard';

interface LengthPreset {
  count: 5 | 10 | 15;
  minutes: number;
  labelRo: string;
  labelEn: string;
  descRo: string;
  descEn: string;
}

const LENGTH_PRESETS: LengthPreset[] = [
  {
    count: 5,
    minutes: 3,
    labelRo: 'Test Fulger (5 Întrebări)',
    labelEn: 'Quick Check (5 Questions)',
    descRo: '3 minute · Ideal pentru încălzire',
    descEn: '3 min · Quick warm-up',
  },
  {
    count: 10,
    minutes: 6,
    labelRo: 'Test Standard (10 Întrebări)',
    labelEn: 'Standard Test (10 Questions)',
    descRo: '6 minute · Evaluare completă',
    descEn: '6 min · Balanced check',
  },
  {
    count: 15,
    minutes: 10,
    labelRo: 'Simulare Teză (15 Întrebări)',
    labelEn: 'Exam Simulation (15 Questions)',
    descRo: '10 minute · Antrenament intensiv',
    descEn: '10 min · Full exam drill',
  },
];

export const QuickEvalSimulator: React.FC<QuickEvalSimulatorProps> = ({
  studentName,
  onBackToCatalog,
  onOpenCarnet,
  onOpenLiveQuiz,
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const arky = useArky();

  const [phase, setPhase] = useState<SimulatorPhase>('setup');
  const [gradeFilter, setGradeFilter] = useState<GradeOption>('all');
  const [preset, setPreset] = useState<LengthPreset>(LENGTH_PRESETS[1]);
  const [difficulty, setDifficulty] = useState<DifficultyOption>('all');

  const [questions, setQuestions] = useState<QuickEvalQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState<number>(360);
  const [totalSecondsAllocated, setTotalSecondsAllocated] = useState<number>(360);

  const [lastAttempt, setLastAttempt] = useState<QuickEvalAttempt | null>(null);
  const [coinsAwarded, setCoinsAwarded] = useState<number>(0);
  const [history, setHistory] = useState<QuickEvalAttempt[]>(() => getStoredQuickEvalHistory());
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState<boolean>(false);

  const finalizeEvaluation = useCallback(
    async (explicitTimeout = false) => {
      if (questions.length === 0) return;

      const elapsed = Math.max(1, totalSecondsAllocated - secondsLeft);
      let correctCount = 0;
      for (const q of questions) {
        if (answers[q.id] === q.correctIndex) {
          correctCount++;
        }
      }

      const maxScore = 100;
      const score = Math.round((correctCount / questions.length) * 100);
      const gradeDetails = computeGradeDetails(score, maxScore);

      const attempt: QuickEvalAttempt = {
        id: `qeval_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        gradeFilter,
        difficulty,
        score,
        maxScore,
        nota: gradeDetails.grade,
        correctCount,
        totalQuestions: questions.length,
        elapsedSeconds: elapsed,
        completedAt: new Date().toISOString(),
      };

      setLastAttempt(attempt);
      setPhase('review');
      setConfirmSubmitOpen(false);

      if (score >= 70) {
        sounds.playSuccess();
        arky.triggerSuccess();
      } else if (explicitTimeout) {
        sounds.playError();
        arky.triggerError();
      } else {
        sounds.playClick();
      }

      const coins = Math.max(10, Math.round(score * 0.4));
      setCoinsAwarded(coins);

      const activeStudent = getActiveStudent();
      const effectiveName = (activeStudent?.username || studentName || '').trim();

      const gradeTag =
        gradeFilter === 'all' ? 'Clasele V–VIII' : `Clasa a ${gradeFilter === 5 ? 'V' : gradeFilter === 6 ? 'VI' : gradeFilter === 7 ? 'VII' : 'VIII'}-a`;
      const courseTitle = `Simulare Evaluare (${gradeTag}) · ${questions.length} întrebări`;

      try {
        const updatedHist = await saveQuickEvalAttempt(attempt);
        setHistory(updatedHist);
        await addByteCoins(coins, `Simulare Evaluare (${score}%)`);
        if (effectiveName) {
          await logStudentResult(effectiveName, courseTitle, score, maxScore, elapsed);
        }
      } catch {
        // Non-blocking cloud fallback
      }
    },
    [questions, totalSecondsAllocated, secondsLeft, answers, gradeFilter, difficulty, studentName, arky]
  );

  // Countdown timer when running
  useEffect(() => {
    if (phase !== 'running') return;
    if (secondsLeft <= 0) {
      void finalizeEvaluation(true);
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, secondsLeft, finalizeEvaluation]);

  // Keyboard shortcuts during running phase
  useEffect(() => {
    if (phase !== 'running' || questions.length === 0) return;
    const activeQ = questions[currentIdx];
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '4' && activeQ) {
        const idx = Number(e.key) - 1;
        setAnswers((prev) => ({ ...prev, [activeQ.id]: idx }));
        sounds.playClick();
      } else if (e.key === 'ArrowRight' && currentIdx < questions.length - 1) {
        setCurrentIdx((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentIdx > 0) {
        setCurrentIdx((prev) => prev - 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, questions, currentIdx]);

  const startEvaluation = () => {
    sounds.playClick();
    const selected = generateQuickEvalQuestions(gradeFilter, preset.count, difficulty);
    const totalSec = preset.minutes * 60;
    setQuestions(selected);
    setAnswers({});
    setFlagged({});
    setCurrentIdx(0);
    setSecondsLeft(totalSec);
    setTotalSecondsAllocated(totalSec);
    setLastAttempt(null);
    setConfirmSubmitOpen(false);
    setPhase('running');
  };

  const formatMMSS = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const answeredCount = useMemo(
    () => questions.filter((q) => answers[q.id] !== undefined).length,
    [questions, answers]
  );

  const avgHistoryGrade = useMemo(() => {
    if (history.length === 0) return 0;
    const sum = history.reduce((acc, a) => acc + a.nota, 0);
    return Number((sum / history.length).toFixed(2));
  }, [history]);

  const currentQuestion = questions[currentIdx];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onBackToCatalog();
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 text-xs sm:text-sm font-bold transition cursor-pointer min-h-[40px]"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>{isEn ? 'Back to Courses' : 'Înapoi la Cursuri'}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenLiveQuiz && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenLiveQuiz();
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-200 border border-rose-500/40 text-xs font-bold transition cursor-pointer min-h-[40px]"
            >
              <Radio className="w-4 h-4 text-rose-400" />
              <span>{isEn ? 'Join Live Quiz (PIN)' : 'Intră la Quiz Live (PIN)'}</span>
            </button>
          )}

          {onOpenCarnet && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenCarnet();
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border border-amber-500/40 text-xs font-bold transition cursor-pointer min-h-[40px]"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>{isEn ? 'View Digital Portfolio' : 'Vezi în Carnetul Digital'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= PHASE 1: SETUP ================= */}
      {phase === 'setup' && (
        <div className="space-y-6">
          <section className="rounded-3xl bg-slate-950/90 border border-slate-800 p-5 sm:p-7 space-y-6 shadow-2xl">
            <div className="space-y-2">
              <div className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-cyan-400" />
                <span>{isEn ? 'Timed Curriculum Assessment Simulator' : 'Simulator Evaluare & Test Rapid TIC'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-heading text-balance">
                {isEn
                  ? 'Test Your ICT & Coding Knowledge (Grades 5–8)'
                  : 'Antrenament Cronometrat cu Notare Oficială 1–10'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {isEn
                  ? 'Generate randomized timed quizzes from 52 curriculum questions. Your grade (1–10), ByteCoins, and answer explanations are logged directly to your Digital Portfolio.'
                  : 'Generează instant teste cronometrate din programa națională (Clasele V–VIII). Primești nota oficială (1–10), explicații pas cu pas pentru fiecare răspuns și ByteCoins în Carnetul tău Digital.'}
              </p>
            </div>

            {/* 1. Choose Grade */}
            <div className="space-y-2.5">
              <label className="text-xs font-mono uppercase font-bold text-slate-400 block">
                {isEn ? '1. Select Curriculum Level' : '1. Alege Clasa / Programa'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(
                  [
                    { val: 'all', labelRo: 'Mixt V–VIII', labelEn: 'All (5–8)' },
                    { val: 5, labelRo: 'Clasa a V-a', labelEn: '5th Grade' },
                    { val: 6, labelRo: 'Clasa a VI-a', labelEn: '6th Grade' },
                    { val: 7, labelRo: 'Clasa a VII-a', labelEn: '7th Grade' },
                    { val: 8, labelRo: 'Clasa a VIII-a', labelEn: '8th Grade' },
                  ] as const
                ).map((g) => (
                  <button
                    key={String(g.val)}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setGradeFilter(g.val);
                    }}
                    className={`px-3 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition cursor-pointer min-h-[44px] ${
                      gradeFilter === g.val
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {isEn ? g.labelEn : g.labelRo}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Choose Duration & Question Count */}
            <div className="space-y-2.5">
              <label className="text-xs font-mono uppercase font-bold text-slate-400 block">
                {isEn ? '2. Test Format & Timer' : '2. Format Test & Cronometru'}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {LENGTH_PRESETS.map((p) => {
                  const active = preset.count === p.count;
                  return (
                    <button
                      key={p.count}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setPreset(p);
                      }}
                      className={`p-4 rounded-2xl border text-left transition cursor-pointer space-y-1 ${
                        active
                          ? 'bg-cyan-500/15 border-cyan-400/70 text-white shadow-md'
                          : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-sm font-black font-heading">
                        {isEn ? p.labelEn : p.labelRo}
                      </div>
                      <div className="text-xs text-slate-400">
                        {isEn ? p.descEn : p.descRo}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Choose Difficulty */}
            <div className="space-y-2.5">
              <label className="text-xs font-mono uppercase font-bold text-slate-400 block">
                {isEn ? '3. Difficulty Level' : '3. Nivel de Dificultate'}
              </label>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { val: 'all', labelRo: 'Echilibrat (Mixt)', labelEn: 'Balanced Mix' },
                    { val: 'easy', labelRo: 'Bază (Ușor)', labelEn: 'Foundation' },
                    { val: 'medium', labelRo: 'Standard (Mediu)', labelEn: 'Standard' },
                    { val: 'hard', labelRo: 'Performanță (Avansat)', labelEn: 'Challenge' },
                  ] as const
                ).map((d) => (
                  <button
                    key={d.val}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setDifficulty(d.val);
                    }}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition cursor-pointer min-h-[40px] ${
                      difficulty === d.val
                        ? 'bg-teal-500/20 border-teal-400 text-teal-200'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {isEn ? d.labelEn : d.labelRo}
                  </button>
                ))}
              </div>
            </div>

            {/* Start CTA */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {isEn
                    ? 'Earn up to +40 ByteCoins and official catalog score on completion.'
                    : 'Primești până la +40 ByteCoins și nota se înregistrează automat în catalog.'}
                </span>
              </div>
              <button
                type="button"
                onClick={startEvaluation}
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition cursor-pointer inline-flex items-center justify-center gap-2 shadow-lg min-h-[48px] shrink-0"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{isEn ? 'Start Timed Evaluation' : 'Începe Testul Acum'}</span>
              </button>
            </div>
          </section>

          {/* Recent Quick Eval History */}
          {history.length > 0 && (
            <section className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 tabular-nums">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base font-black text-white font-heading flex items-center gap-2">
                  <History className="w-4 h-4 text-cyan-400" />
                  <span>{isEn ? 'Recent Simulation Results' : 'Ultimele Tale Simulări'}</span>
                </h2>
                <div className="text-xs font-mono text-emerald-300 font-bold">
                  {isEn ? 'Average Grade:' : 'Media Simulărilor:'} {avgHistoryGrade.toFixed(2)}/10
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {history.slice(0, 6).map((h) => {
                  const dateLabel = (() => {
                    try {
                      return new Date(h.completedAt).toLocaleDateString(isEn ? 'en-GB' : 'ro-RO', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                    } catch {
                      return h.completedAt;
                    }
                  })();
                  return (
                    <div
                      key={h.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {h.gradeFilter === 'all'
                            ? isEn
                              ? 'Mixed V–VIII'
                              : 'Mixt V–VIII'
                            : isEn
                            ? `Grade ${h.gradeFilter}`
                            : `Clasa a ${h.gradeFilter === 5 ? 'V' : h.gradeFilter === 6 ? 'VI' : h.gradeFilter === 7 ? 'VII' : 'VIII'}-a`}
                          {' · '}
                          {h.totalQuestions}q
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                          {h.correctCount}/{h.totalQuestions} · {dateLabel}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-base font-black text-emerald-300 font-heading">
                          {isEn ? 'Grade' : 'Nota'} {h.nota}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">{h.score}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}

      {/* ================= PHASE 2: ACTIVE TIMED QUIZ ================= */}
      {phase === 'running' && currentQuestion && (
        <div className="space-y-5">
          {/* Status Header */}
          <div className="rounded-2xl bg-slate-950/90 border border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3 tabular-nums">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">
                {isEn ? 'Question' : 'Întrebarea'}{' '}
                <strong className="text-white text-sm">
                  {currentIdx + 1}/{questions.length}
                </strong>
              </span>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <span className="text-xs font-mono text-teal-300">
                {answeredCount}/{questions.length} {isEn ? 'answered' : 'răspunse'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-sm font-black ${
                  secondsLeft <= 30
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse'
                    : 'bg-slate-900 border-slate-700 text-cyan-300'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{formatMMSS(secondsLeft)}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setConfirmSubmitOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition cursor-pointer min-h-[38px]"
              >
                {isEn ? 'Finish Test' : 'Finalizează'}
              </button>
            </div>
          </div>

          {/* Question Navigator Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIdx;
              const isAnswered = answers[q.id] !== undefined;
              const isFlagged = Boolean(flagged[q.id]);
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setCurrentIdx(idx);
                  }}
                  className={`min-w-[36px] h-9 px-2 rounded-xl text-xs font-mono font-bold border transition cursor-pointer shrink-0 relative ${
                    isCurrent
                      ? 'bg-cyan-500 text-slate-950 border-cyan-300'
                      : isAnswered
                      ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {idx + 1}
                  {isFlagged && (
                    <span
                      className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-950"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Question Card */}
          <section className="rounded-3xl bg-slate-900/95 border border-slate-800 p-5 sm:p-7 space-y-5 shadow-xl">
            <div className="flex items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-teal-300 font-bold">
                  {isEn ? `Grade ${currentQuestion.grade}` : `Clasa a ${currentQuestion.grade === 5 ? 'V' : currentQuestion.grade === 6 ? 'VI' : currentQuestion.grade === 7 ? 'VII' : 'VIII'}-a`}
                </span>
                <span aria-hidden="true">·</span>
                <span>{isEn ? currentQuestion.topicEn : currentQuestion.topicRo}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setFlagged((prev) => ({
                    ...prev,
                    [currentQuestion.id]: !prev[currentQuestion.id],
                  }));
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                  flagged[currentQuestion.id]
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flagged[currentQuestion.id] ? (isEn ? 'Flagged' : 'Marcată') : isEn ? 'Flag' : 'Marchează'}</span>
              </button>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-white font-heading leading-snug">
              {isEn ? currentQuestion.promptEn : currentQuestion.promptRo}
            </h2>

            <div className="space-y-2.5">
              {(isEn ? currentQuestion.optionsEn : currentQuestion.optionsRo).map((opt, idx) => {
                const selected = answers[currentQuestion.id] === idx;
                const letter = ['A', 'B', 'C', 'D'][idx];
                return (
                  <button
                    key={`${currentQuestion.id}-${idx}`}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: idx }));
                    }}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3 min-h-[52px] ${
                      selected
                        ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-md'
                        : 'bg-slate-950/85 border-slate-800 text-slate-200 hover:border-slate-600 hover:bg-slate-950'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-black shrink-0 ${
                        selected
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-900 border border-slate-700 text-slate-300'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed pt-0.5">
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Prev / Next Navigation */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                disabled={currentIdx === 0}
                onClick={() => {
                  sounds.playClick();
                  setCurrentIdx((prev) => Math.max(0, prev - 1));
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200 hover:text-white disabled:opacity-40 cursor-pointer min-h-[40px]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isEn ? 'Previous' : 'Înapoi'}</span>
              </button>

              {currentIdx < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1));
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition cursor-pointer min-h-[40px]"
                >
                  <span>{isEn ? 'Next Question' : 'Următoarea'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setConfirmSubmitOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition cursor-pointer min-h-[40px]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isEn ? 'Submit Test' : 'Trimite Evaluarea'}</span>
                </button>
              )}
            </div>
          </section>

          {/* Confirm Finish Modal */}
          {confirmSubmitOpen && (
            <div
              className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setConfirmSubmitOpen(false)}
            >
              <div
                className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-5 space-y-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-black text-white font-heading">
                  {isEn ? 'Finish Evaluation?' : 'Finalizezi Evaluarea?'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {answeredCount < questions.length
                    ? isEn
                      ? `You answered ${answeredCount} out of ${questions.length} questions. Unanswered questions count as 0 points.`
                      : `Ai răspuns la ${answeredCount} din ${questions.length} întrebări. Întrebările fără răspuns primesc 0 puncte.`
                    : isEn
                    ? 'All questions answered! Submit now to calculate your grade (1–10) and save to your Digital Portfolio.'
                    : 'Ai răspuns la toate întrebările! Trimite evaluarea pentru a afla nota finală și a salva în Carnet.'}
                </p>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setConfirmSubmitOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer min-h-[40px]"
                  >
                    {isEn ? 'Keep Reviewing' : 'Continuă Testul'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void finalizeEvaluation(false)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black cursor-pointer min-h-[40px]"
                  >
                    {isEn ? 'Calculate Grade' : 'Afișează Nota'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= PHASE 3: EVALUATION REPORT & REVIEW ================= */}
      {phase === 'review' && lastAttempt && (
        <div className="space-y-6">
          {(() => {
            const gInfo = computeGradeDetails(lastAttempt.score, lastAttempt.maxScore);
            return (
              <section className="rounded-3xl bg-slate-950/90 border border-emerald-500/35 p-6 space-y-5 shadow-2xl tabular-nums">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0">
                      <GraduationCap className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-emerald-300 font-bold uppercase">
                        {isEn ? 'Official Simulation Result' : 'Rezultat Oficial Simulare'}
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
                        {isEn ? `Grade ${gInfo.grade}/10` : `Nota ${gInfo.grade}/10`}{' '}
                        <span className="text-base font-bold text-slate-300">
                          · {lastAttempt.score}%
                        </span>
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                        {isEn ? gInfo.calificativEn : gInfo.calificativRo}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setPhase('setup');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer inline-flex items-center gap-2 min-h-[42px]"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>{isEn ? 'New Simulation' : 'Alt Test Rapid'}</span>
                    </button>
                    {onOpenCarnet && (
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          onOpenCarnet();
                        }}
                        className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition cursor-pointer inline-flex items-center gap-2 min-h-[42px]"
                      >
                        <Trophy className="w-4 h-4" />
                        <span>{isEn ? 'Open Digital Portfolio' : 'Deschide Carnetul'}</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800">
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">
                      {isEn ? 'Correct' : 'Corecte'}
                    </div>
                    <div className="text-lg font-black text-emerald-300">
                      {lastAttempt.correctCount}/{lastAttempt.totalQuestions}
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">
                      {isEn ? 'Time Spent' : 'Timp Realizat'}
                    </div>
                    <div className="text-lg font-black text-cyan-300">
                      {formatMMSS(lastAttempt.elapsedSeconds)}
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">
                      ByteCoins
                    </div>
                    <div className="text-lg font-black text-purple-300 flex items-center gap-1">
                      <Coins className="w-4 h-4" />
                      <span>+{coinsAwarded}</span>
                    </div>
                  </div>
                </div>
              </section>
            );
          })()}

          {/* Answer-by-Answer Explanations */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-white font-heading">
              {isEn ? 'Detailed Answer Review & Explanations' : 'Barem Detaliat & Explicații'}
            </h2>
            <div className="space-y-3">
              {questions.map((q, idx) => {
                const chosen = answers[q.id];
                const isCorrect = chosen === q.correctIndex;
                const opts = isEn ? q.optionsEn : q.optionsRo;
                return (
                  <article
                    key={q.id}
                    className={`p-4 sm:p-5 rounded-2xl border space-y-2.5 ${
                      isCorrect
                        ? 'bg-slate-900/90 border-emerald-500/35'
                        : 'bg-slate-900/90 border-rose-500/35'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-xs font-mono text-slate-400">
                        #{idx + 1} · {isEn ? q.topicEn : q.topicRo}
                      </div>
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{isEn ? 'Correct' : 'Corect'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-300 shrink-0">
                          <XCircle className="w-4 h-4" />
                          <span>{chosen === undefined ? (isEn ? 'Unanswered' : 'Nerăspuns') : isEn ? 'Incorrect' : 'Greșit'}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {isEn ? q.promptEn : q.promptRo}
                    </h3>

                    <div className="text-xs space-y-1">
                      {!isCorrect && chosen !== undefined && (
                        <div className="text-rose-300">
                          {isEn ? 'Your answer:' : 'Răspunsul tău:'} <strong>{opts[chosen]}</strong>
                        </div>
                      )}
                      <div className="text-emerald-300">
                        {isEn ? 'Correct answer:' : 'Răspuns corect:'}{' '}
                        <strong>{opts[q.correctIndex]}</strong>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-950/90 border border-slate-800 rounded-xl p-3 leading-relaxed">
                      <strong className="text-cyan-300">{isEn ? 'Why:' : 'Explicație:'} </strong>
                      {isEn ? q.explanationEn : q.explanationRo}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
