import React, { useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  AlertTriangle,
  Award,
  Bug,
  CalendarClock,
  CheckCircle2,
  Code2,
  Coins,
  Cpu,
  HelpCircle,
  Lock,
  Play,
  RotateCcw,
  Save,
  Terminal,
  Trophy,
  Unlock,
  XCircle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import {
  getDailyOlympiadProblem,
  getOlympiadRank,
  getTodayOlympiadBonusKey,
  OLYMPIAD_PROBLEMS,
  OLYMPIAD_TIERS,
  OlympiadProblem,
  OlympiadTier,
} from '../../data/olympiadProblems';
import {
  addByteCoins,
  getActiveStudent,
  getStoredSandboxProgress,
  saveSandboxChallengeSolved,
  saveSandboxSnippet,
} from '../../lib/studentAuthService';
import { sounds } from '../../utils/audio';
import { runCppCode, SandboxExecutionResult } from '../../utils/sandboxRunner';

interface OlympiadArenaProps {
  solvedIds: string[];
  onSolvedIdsChange: (nextSolved: string[]) => void;
  onDebugInTrace: (code: string, stdin: string, label: string) => void;
}

interface JudgeTestRow {
  id: string;
  label: string;
  stdin: string;
  expected: string;
  actual: string;
  passed: boolean;
  error: string | null;
  totalSteps?: number;
}

type ProblemSubTab = 'judge' | 'quiz' | 'solution';

export const OlympiadArena: React.FC<OlympiadArenaProps> = ({
  solvedIds,
  onSolvedIdsChange,
  onDebugInTrace,
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const arky = useArky();

  const dailyProblem = useMemo(() => getDailyOlympiadProblem(), []);
  const [dailyClaimed, setDailyClaimed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(getTodayOlympiadBonusKey()) === '1';
    } catch {
      return false;
    }
  });

  const [tierFilter, setTierFilter] = useState<'all' | OlympiadTier>('all');
  const filteredProblems = useMemo(
    () =>
      tierFilter === 'all'
        ? OLYMPIAD_PROBLEMS
        : OLYMPIAD_PROBLEMS.filter((p) => p.tier === tierFilter),
    [tierFilter]
  );

  const [selectedProblemId, setSelectedProblemId] = useState<string>(OLYMPIAD_PROBLEMS[0].id);
  const activeProblem: OlympiadProblem = useMemo(
    () => OLYMPIAD_PROBLEMS.find((p) => p.id === selectedProblemId) || OLYMPIAD_PROBLEMS[0],
    [selectedProblemId]
  );

  const [subTab, setSubTab] = useState<ProblemSubTab>('judge');
  const [code, setCode] = useState<string>(() => {
    const saved = getStoredSandboxProgress().snippets[`oji_${OLYMPIAD_PROBLEMS[0].id}`];
    return saved?.code || OLYMPIAD_PROBLEMS[0].starterCode;
  });
  const [stdinValue, setStdinValue] = useState<string>(() => {
    const saved = getStoredSandboxProgress().snippets[`oji_${OLYMPIAD_PROBLEMS[0].id}`];
    return saved?.stdin !== undefined ? saved.stdin : OLYMPIAD_PROBLEMS[0].defaultStdin;
  });
  const [showHint, setShowHint] = useState<boolean>(false);
  const [singleResult, setSingleResult] = useState<SandboxExecutionResult | null>(null);
  const [judgeRows, setJudgeRows] = useState<JudgeTestRow[] | null>(null);
  const [rewardBanner, setRewardBanner] = useState<string | null>(null);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // Dry-Run Quiz state per problem
  const [quizSelection, setQuizSelection] = useState<number | null>(null);
  const [quizVerified, setQuizVerified] = useState<boolean>(false);
  const [studyUnlockedIds, setStudyUnlockedIds] = useState<string[]>([]);

  const loadProblem = (prob: OlympiadProblem, forceStarter = false) => {
    const saved = forceStarter ? undefined : getStoredSandboxProgress().snippets[`oji_${prob.id}`];
    setSelectedProblemId(prob.id);
    setCode(saved?.code ?? prob.starterCode);
    setStdinValue(saved?.stdin !== undefined ? saved.stdin : prob.defaultStdin);
    setShowHint(false);
    setSingleResult(null);
    setJudgeRows(null);
    setRewardBanner(null);
    setSaveNotice(null);
    setQuizSelection(null);
    setQuizVerified(false);
  };

  // Auto-save draft locally on code change
  useEffect(() => {
    const timer = setTimeout(() => {
      void saveSandboxSnippet(`oji_${activeProblem.id}`, code, undefined, stdinValue, false);
    }, 500);
    return () => clearTimeout(timer);
  }, [code, stdinValue, activeProblem.id]);

  const olympiadSolvedCount = useMemo(
    () => solvedIds.filter((id) => OLYMPIAD_PROBLEMS.some((p) => p.id === id)).length,
    [solvedIds]
  );

  const rankInfo = useMemo(
    () => getOlympiadRank(olympiadSolvedCount, isEn),
    [olympiadSolvedCount, isEn]
  );

  const isCurrentSolved = solvedIds.includes(activeProblem.id);
  const isSolutionUnlocked = isCurrentSolved || studyUnlockedIds.includes(activeProblem.id);

  const handleRunSample = () => {
    sounds.playClick();
    setRewardBanner(null);
    const res = runCppCode(code, stdinValue);
    setSingleResult(res);
    if (res.error) arky.triggerError();
  };

  const handleSubmitJudge = async () => {
    sounds.playClick();
    setRewardBanner(null);
    void saveSandboxSnippet(`oji_${activeProblem.id}`, code, undefined, stdinValue, true);

    const single = runCppCode(code, stdinValue);
    setSingleResult(single);

    const rows: JudgeTestRow[] = activeProblem.tests.map((tc) => {
      const res = runCppCode(code, tc.stdin);
      const actualNorm = res.stdout.trim().replace(/\r\n/g, '\n');
      const expectedNorm = tc.expectedOutput.trim().replace(/\r\n/g, '\n');
      return {
        id: tc.id,
        label: isEn ? tc.labelEn : tc.labelRo,
        stdin: tc.stdin,
        expected: expectedNorm,
        actual: actualNorm,
        passed: !res.error && actualNorm === expectedNorm,
        error: res.error,
        totalSteps: res.totalSteps,
      };
    });
    setJudgeRows(rows);

    const allPassed = rows.every((r) => r.passed);
    if (allPassed) {
      sounds.playSuccess();
      arky.triggerSuccess();
      try {
        confetti({ particleCount: 70, spread: 65, origin: { y: 0.7 } });
      } catch {}

      let earnedCoins = 0;
      if (!solvedIds.includes(activeProblem.id)) {
        const next = await saveSandboxChallengeSolved(activeProblem.id);
        onSolvedIdsChange(next);
        earnedCoins += activeProblem.rewardCoins;
        await addByteCoins(activeProblem.rewardCoins, `Olimpiada TIC: ${activeProblem.id}`);
      }

      let bonusGranted = false;
      if (activeProblem.id === dailyProblem.id && !dailyClaimed) {
        try {
          localStorage.setItem(getTodayOlympiadBonusKey(), '1');
        } catch {}
        setDailyClaimed(true);
        earnedCoins += 50;
        bonusGranted = true;
        await addByteCoins(50, `Daily Olympiad Bonus: ${activeProblem.id}`);
      }

      if (earnedCoins > 0) {
        setRewardBanner(
          isEn
            ? `Accepted (5/5 tests)! +${earnedCoins} ByteCoins earned${bonusGranted ? ' (includes +50 Daily Bonus)' : ''} & synced.`
            : `Acceptat (5/5 teste)! Ai câștigat +${earnedCoins} ByteCoins${bonusGranted ? ' (include +50 Bonus Zilnic)' : ''} și progresul s-a sincronizat.`
        );
      } else {
        setRewardBanner(
          isEn ? 'Accepted! All 5 Olympiad test cases passed.' : 'Acceptat! Toate cele 5 teste oficiale au trecut.'
        );
      }
    } else {
      sounds.playError();
      arky.triggerError();
    }
  };

  const handleSaveCloud = async () => {
    sounds.playClick();
    await saveSandboxSnippet(`oji_${activeProblem.id}`, code, undefined, stdinValue, true);
    setSaveNotice(
      getActiveStudent()
        ? isEn
          ? 'Saved to Cloud'
          : 'Salvat în Cloud'
        : isEn
        ? 'Saved locally'
        : 'Salvat local'
    );
    setTimeout(() => setSaveNotice(null), 2200);
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      void handleSubmitJudge();
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const updated = code.slice(0, start) + '    ' + code.slice(end);
      setCode(updated);
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      });
    }
  };

  const lineCount = code.split('\n').length;
  const progressPct = Math.round((olympiadSolvedCount / OLYMPIAD_PROBLEMS.length) * 100);

  return (
    <div className="space-y-5">
      {/* Olympiad Rank & Daily Challenge Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 flex flex-col justify-between gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <Trophy className="w-5 h-5 text-amber-400 shrink-0" aria-hidden="true" />
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-white">
                  {isEn ? 'ICT & Algorithms Olympiad Arena' : 'Arena Olimpiada TIC & Algoritmică C++'}
                </h2>
                <div className="text-xs text-slate-300 flex flex-wrap items-center gap-2 tabular-nums">
                  <span className={`font-bold ${rankInfo.current.colorClass}`}>
                    {isEn ? `Rank: ${rankInfo.title}` : `Rang: ${rankInfo.title}`}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {olympiadSolvedCount} / {OLYMPIAD_PROBLEMS.length}{' '}
                    {isEn ? 'problems accepted' : 'probleme acceptate'}
                  </span>
                </div>
              </div>
            </div>

            {rankInfo.next && (
              <span className="text-xs font-mono text-slate-300 tabular-nums">
                {isEn
                  ? `${rankInfo.next.minSolved - olympiadSolvedCount} more to ${rankInfo.next.titleEn}`
                  : `Încă ${rankInfo.next.minSolved - olympiadSolvedCount} până la ${rankInfo.next.titleRo}`}
              </span>
            )}
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Daily Olympiad Challenge Card */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/90 border border-amber-500/35 p-4 sm:p-5 flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <CalendarClock className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{isEn ? 'Daily Olympiad Spotlight (+50 BC)' : 'Problema Zilei OJI (+50 BC Bonus)'}</span>
              </div>
              <div className="text-sm font-extrabold text-white">
                #{String(dailyProblem.number).padStart(2, '0')} ·{' '}
                {isEn ? dailyProblem.titleEn : dailyProblem.titleRo}
              </div>
            </div>
            <span
              className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border whitespace-nowrap ${
                dailyClaimed
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
              }`}
            >
              {dailyClaimed
                ? isEn
                  ? 'CLAIMED'
                  : 'REVENDICAT'
                : isEn
                ? '+50 BC ACTIVE'
                : '+50 BC ACTIV'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setTierFilter('all');
              loadProblem(dailyProblem);
            }}
            className="w-full px-3.5 py-2 min-h-[38px] rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            {isEn ? 'Solve Daily Problem Now' : 'Rezolvă Problema Zilei'}
          </button>
        </div>
      </div>

      {/* Tier Filter Tabs + 12-Problem Strip */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setTierFilter('all')}
            className={`px-3 py-1.5 min-h-[36px] rounded-lg border text-xs font-bold cursor-pointer whitespace-nowrap ${
              tierFilter === 'all'
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isEn ? `All (${OLYMPIAD_PROBLEMS.length})` : `Toate (${OLYMPIAD_PROBLEMS.length})`}
          </button>
          {OLYMPIAD_TIERS.map((tier) => (
            <button
              key={tier.id}
              type="button"
              onClick={() => setTierFilter(tier.id)}
              className={`px-3 py-1.5 min-h-[36px] rounded-lg border text-xs font-bold cursor-pointer whitespace-nowrap ${
                tierFilter === tier.id
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {isEn ? tier.labelEn : tier.labelRo}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:flex-wrap">
          {filteredProblems.map((prob) => {
            const isActive = prob.id === activeProblem.id;
            const solved = solvedIds.includes(prob.id);
            return (
              <button
                key={prob.id}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  loadProblem(prob);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 tabular-nums ${
                  isActive
                    ? 'bg-slate-800 border-amber-400/75 text-white'
                    : 'bg-slate-900/75 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                {solved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />}
                <span>
                  {String(prob.number).padStart(2, '0')}. {isEn ? prob.titleEn : prob.titleRo}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Problem Brief & Sub-Mode Switcher */}
      <section className="rounded-2xl bg-slate-900/85 border border-slate-800 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 tabular-nums">
              <span className="font-bold text-amber-300">
                {isEn ? activeProblem.gradeLabelEn : activeProblem.gradeLabelRo}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-cyan-300">
                {isEn ? 'Target:' : 'Complexitate:'} {activeProblem.complexityTarget}
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 text-amber-300 font-bold">
                <Coins className="w-3.5 h-3.5" aria-hidden="true" />+{activeProblem.rewardCoins} BC
              </span>
              {isCurrentSolved && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 text-emerald-300 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    {isEn ? 'Accepted (5/5)' : 'Acceptată (5/5)'}
                  </span>
                </>
              )}
            </div>
            <h3 className="text-lg font-extrabold text-white">
              {String(activeProblem.number).padStart(2, '0')}.{' '}
              {isEn ? activeProblem.titleEn : activeProblem.titleRo}
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed max-w-4xl">
              {isEn ? activeProblem.statementEn : activeProblem.statementRo}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs text-slate-300">
              <div className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-2">
                <strong className="text-slate-200">{isEn ? 'Input: ' : 'Intrare: '}</strong>
                {isEn ? activeProblem.inputFormatEn : activeProblem.inputFormatRo}
              </div>
              <div className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-2">
                <strong className="text-slate-200">{isEn ? 'Output: ' : 'Ieșire: '}</strong>
                {isEn ? activeProblem.outputFormatEn : activeProblem.outputFormatRo}
              </div>
              <div className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 font-mono tabular-nums">
                <strong className="font-sans text-slate-200">{isEn ? 'Limits: ' : 'Restricții: '}</strong>
                {activeProblem.constraints}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowHint((p) => !p)}
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer whitespace-nowrap"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
              <span>{showHint ? (isEn ? 'Hide Hint' : 'Ascunde Indiciu') : isEn ? 'Hint' : 'Indiciu'}</span>
            </button>
          </div>
        </div>

        {showHint && (
          <div className="rounded-xl bg-slate-950 border border-amber-500/35 p-3 text-xs text-amber-100 leading-relaxed">
            <strong className="text-amber-300">{isEn ? 'Algorithm Hint: ' : 'Indiciu Algoritm: '}</strong>
            {isEn ? activeProblem.hintEn : activeProblem.hintRo}
          </div>
        )}

        {/* Sub-Tabs for Problem */}
        <div
          role="tablist"
          aria-label={isEn ? 'Problem sections' : 'Mod de lucru problemă'}
          className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto max-w-full"
        >
          {(
            [
              { id: 'judge', labelRo: 'Editor & Evaluator (5 Teste)', labelEn: 'Editor & Judge (5 Tests)' },
              { id: 'quiz', labelRo: 'Quiz Grilă Execuție (OJI)', labelEn: 'Dry-Run Quiz (OJI)' },
              { id: 'solution', labelRo: 'Soluție Model & Complexitate', labelEn: 'Model Solution & Complexity' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={subTab === t.id}
              onClick={() => {
                sounds.playClick();
                setSubTab(t.id);
              }}
              className={`px-3.5 py-2 min-h-[36px] rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                subTab === t.id ? 'bg-amber-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              {isEn ? t.labelEn : t.labelRo}
            </button>
          ))}
        </div>
      </section>

      {/* SUB-TAB 1: EDITOR & AUTO-JUDGE */}
      {subTab === 'judge' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <section className="lg:col-span-7 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col overflow-hidden">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-mono">
                <Code2 className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <span className="font-bold text-slate-200">oji_solution.cpp</span>
                <span className="text-slate-400 tabular-nums">
                  · {lineCount} {isEn ? 'lines' : 'linii'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {saveNotice && (
                  <span className="text-[11px] font-mono text-emerald-300 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30">
                    {saveNotice}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onDebugInTrace(
                      code,
                      stdinValue,
                      `${isEn ? 'Debugging Olympiad #' : 'Depanare Olimpiadă #'}${activeProblem.number}: ${
                        isEn ? activeProblem.titleEn : activeProblem.titleRo
                      }`
                    );
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg bg-slate-800 hover:bg-slate-700 border border-cyan-500/40 text-xs font-semibold text-cyan-200 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Bug className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                  <span>{isEn ? 'Debug in Trace' : 'Debug în Trace'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => void handleSaveCloud()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Save className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                  <span>{isEn ? 'Save' : 'Salvează'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    loadProblem(activeProblem, true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{isEn ? 'Reset' : 'Resetează'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRunSample}
                  className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                  <span>{isEn ? 'Run Sample' : 'Rulează Test'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => void handleSubmitJudge()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[38px] rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Award className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{isEn ? 'Evaluate (5 Tests)' : 'Evaluează (5 Teste)'}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-1 min-h-[280px] sm:min-h-[380px] bg-slate-950 font-mono text-xs sm:text-sm">
              <div
                aria-hidden="true"
                className="select-none py-3.5 px-3 text-right text-slate-500 bg-slate-900/60 border-r border-slate-800/80 tabular-nums leading-6 min-w-[2.75rem]"
              >
                {Array.from({ length: lineCount }, (_, idx) => (
                  <div key={idx}>{idx + 1}</div>
                ))}
              </div>
              <textarea
                aria-label={isEn ? 'Olympiad C++ editor' : 'Editor C++ Olimpiadă'}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleEditorKeyDown}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                className="flex-1 w-full bg-transparent text-slate-100 p-3.5 leading-6 resize-none focus:outline-none overflow-auto"
              />
            </div>

            <div className="border-t border-slate-800 bg-slate-900/70 p-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="oji-stdin" className="font-semibold text-slate-300">
                  {isEn ? 'Custom Test Input (cin)' : 'Date de intrare test manual (cin)'}
                </label>
                <span className="text-slate-400">Ctrl + Enter</span>
              </div>
              <textarea
                id="oji-stdin"
                rows={2}
                value={stdinValue}
                onChange={(e) => setStdinValue(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 font-mono text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </section>

          <section className="lg:col-span-5 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <span>{isEn ? 'Judge & Console Output' : 'Evaluator Oficial & Consolă'}</span>
              </h3>
              {singleResult && (
                <span className="text-xs font-mono text-slate-400 tabular-nums">
                  {singleResult.totalSteps !== undefined ? `${singleResult.totalSteps} ops · ` : ''}
                  {singleResult.durationMs} ms
                </span>
              )}
            </div>

            {rewardBanner && (
              <div
                role="status"
                className="rounded-xl bg-emerald-950/60 border border-emerald-500/50 p-3 flex items-center gap-2.5 text-xs font-semibold text-emerald-200"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                <span>{rewardBanner}</span>
              </div>
            )}

            {singleResult?.error && (
              <div
                role="alert"
                className="rounded-xl bg-rose-950/60 border border-rose-500/50 p-3 flex items-start gap-2.5 text-xs text-rose-200"
              >
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="font-mono">{singleResult.error}</div>
              </div>
            )}

            {singleResult?.diagnostic && (
              <div className="rounded-xl bg-amber-950/50 border border-amber-500/40 p-3 flex items-start gap-2.5 text-xs text-amber-100">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>{singleResult.diagnostic}</div>
              </div>
            )}

            <div className="rounded-xl bg-slate-950 border border-slate-800 p-3.5 min-h-[100px] font-mono text-xs text-emerald-300 whitespace-pre-wrap overflow-auto">
              {singleResult === null
                ? isEn
                  ? 'Run a sample or click Evaluate (5 Tests) to judge your C++ solution.'
                  : 'Apasă Rulează Test sau Evaluează (5 Teste) pentru verdictul evaluatorului.'
                : singleResult.error
                ? ''
                : singleResult.stdout || (isEn ? '(no output)' : '(fără output)')}
            </div>

            {judgeRows && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                  <span>{isEn ? 'Official Test Cases (5)' : 'Teste Oficiale (5 Cazuri)'}</span>
                  <span className="font-mono tabular-nums text-amber-300">
                    {judgeRows.filter((r) => r.passed).length} / {judgeRows.length} PASS
                  </span>
                </div>
                <div className="space-y-2">
                  {judgeRows.map((row) => (
                    <div
                      key={row.id}
                      className={`rounded-xl border p-2.5 text-xs space-y-1.5 ${
                        row.passed
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100'
                          : 'bg-rose-950/30 border-rose-500/40 text-rose-100'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 font-semibold">
                        <span className="flex items-center gap-1.5">
                          {row.passed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" aria-hidden="true" />
                          )}
                          <span>{row.label}</span>
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono uppercase">{row.passed ? 'PASS' : 'FAIL'}</span>
                          <button
                            type="button"
                            onClick={() => {
                              sounds.playClick();
                              onDebugInTrace(
                                code,
                                row.stdin,
                                `${row.label} — ${isEn ? activeProblem.titleEn : activeProblem.titleRo}`
                              );
                            }}
                            className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-[11px] font-semibold text-cyan-200 cursor-pointer whitespace-nowrap"
                          >
                            {isEn ? 'Debug Test' : 'Debug Test'}
                          </button>
                        </div>
                      </div>
                      {!row.passed && (
                        <div className="font-mono text-[11px] text-slate-300 pl-5 space-y-0.5 tabular-nums">
                          <div>{isEn ? 'Input:' : 'Intrare:'} {row.stdin}</div>
                          <div>{isEn ? 'Expected:' : 'Așteptat:'} {row.expected}</div>
                          <div>{isEn ? 'Actual:' : 'Obținut:'} {row.error ? row.error : row.actual || '(empty)'}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {/* SUB-TAB 2: OJI DRY-RUN QUIZ */}
      {subTab === 'quiz' && (
        <section className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-white">
                {isEn ? 'OJI Dry-Run Prediction Challenge' : 'Întrebare Grilă de Urmărire Execuție (Tip OJI)'}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {isEn ? activeProblem.dryRunQuiz.promptEn : activeProblem.dryRunQuiz.promptRo}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onDebugInTrace(
                  activeProblem.dryRunQuiz.codeSnippet,
                  activeProblem.dryRunQuiz.stdin,
                  `${isEn ? 'Dry-Run Demo #' : 'Demonstrație Grilă #'}${activeProblem.number}`
                );
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white cursor-pointer whitespace-nowrap shrink-0"
            >
              <Cpu className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isEn ? 'Prove in Trace Visualizer' : 'Demonstrează în Trace Visualizer'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-6 rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-100 whitespace-pre overflow-x-auto">
              {activeProblem.dryRunQuiz.codeSnippet}
              {activeProblem.dryRunQuiz.stdin && (
                <div className="mt-3 pt-2 border-t border-slate-800 text-cyan-300">
                  stdin: {activeProblem.dryRunQuiz.stdin}
                </div>
              )}
            </div>

            <div className="lg:col-span-6 space-y-2.5">
              {activeProblem.dryRunQuiz.options.map((opt, idx) => {
                const isSelected = quizSelection === idx;
                const isCorrect = idx === activeProblem.dryRunQuiz.correctIndex;
                let cls = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-600';
                if (quizVerified) {
                  if (isCorrect) cls = 'bg-emerald-950/60 border-emerald-500 text-emerald-100';
                  else if (isSelected) cls = 'bg-rose-950/60 border-rose-500 text-rose-100';
                } else if (isSelected) {
                  cls = 'bg-slate-800 border-amber-400 text-white';
                }
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setQuizSelection(idx);
                      setQuizVerified(true);
                      if (idx === activeProblem.dryRunQuiz.correctIndex) sounds.playSuccess();
                      else sounds.playError();
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl border font-mono text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-between gap-2 ${cls}`}
                  >
                    <span className="whitespace-pre-wrap">
                      {String.fromCharCode(65 + idx)}. {opt}
                    </span>
                    {quizVerified && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                    )}
                    {quizVerified && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" aria-hidden="true" />
                    )}
                  </button>
                );
              })}

              {quizVerified && (
                <div className="rounded-xl bg-slate-950 border border-cyan-500/40 p-3.5 text-xs text-slate-200 leading-relaxed">
                  <strong className="text-cyan-300">
                    {quizSelection === activeProblem.dryRunQuiz.correctIndex
                      ? isEn
                        ? 'Correct! '
                        : 'Corect! '
                      : isEn
                      ? 'Explanation: '
                      : 'Explicație: '}
                  </strong>
                  {isEn ? activeProblem.dryRunQuiz.explanationEn : activeProblem.dryRunQuiz.explanationRo}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* SUB-TAB 3: MODEL SOLUTION & COMPLEXITY */}
      {subTab === 'solution' && (
        <section className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
          {!isSolutionUnlocked ? (
            <div className="py-6 flex flex-col items-center text-center gap-3 max-w-md mx-auto">
              <Lock className="w-8 h-8 text-amber-400" aria-hidden="true" />
              <h3 className="text-base font-extrabold text-white">
                {isEn ? 'Model Solution Locked' : 'Soluție Model Protejată'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isEn
                  ? 'Try passing the 5 automated tests first! Or unlock the official OJI reference solution for study.'
                  : 'Încearcă mai întâi să treci cele 5 teste în Editor! Sau poți debloca soluția oficială doar pentru studiu.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setStudyUnlockedIds((prev) => [...prev, activeProblem.id]);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[40px] rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-xs font-bold text-amber-200 cursor-pointer"
              >
                <Unlock className="w-4 h-4" aria-hidden="true" />
                <span>{isEn ? 'Unlock Reference Solution for Study' : 'Deblochează Soluția pentru Studiu'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    {isEn ? 'Official Reference Solution' : 'Soluție Model Oficială'}
                  </h3>
                  <p className="text-xs text-cyan-300 font-mono">
                    {isEn ? 'Optimal Time Complexity:' : 'Complexitate Optimă:'} {activeProblem.complexityTarget}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setCode(activeProblem.solutionCode);
                      setSubTab('judge');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-100 cursor-pointer whitespace-nowrap"
                  >
                    <Code2 className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                    <span>{isEn ? 'Load into Editor' : 'Copiază în Editor'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onDebugInTrace(
                        activeProblem.solutionCode,
                        activeProblem.defaultStdin,
                        `${isEn ? 'Reference Trace #' : 'Trace Soluție #'}${activeProblem.number}`
                      );
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white cursor-pointer whitespace-nowrap"
                  >
                    <Cpu className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{isEn ? 'Trace Solution Step-by-Step' : 'Trace Soluția Pas-cu-Pas'}</span>
                  </button>
                </div>
              </div>

              <pre className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs sm:text-[13px] text-emerald-200 overflow-x-auto leading-6">
                {activeProblem.solutionCode}
              </pre>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
