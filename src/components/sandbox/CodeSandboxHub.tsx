import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Bug,
  CheckCircle2,
  ChevronRight,
  Cloud,
  Code2,
  Coins,
  Cpu,
  HelpCircle,
  Home,
  Play,
  RotateCcw,
  Save,
  Terminal,
  Trophy,
  XCircle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useArky } from '../../context/ArkyContext';
import { OLYMPIAD_PROBLEMS } from '../../data/olympiadProblems';
import { SANDBOX_CHALLENGES, SandboxChallenge } from '../../data/sandboxChallenges';
import {
  addByteCoins,
  getActiveStudent,
  getStoredSandboxProgress,
  refreshActiveStudentFromCloud,
  saveSandboxChallengeSolved,
  saveSandboxSnippet,
} from '../../lib/studentAuthService';
import { AllMissionId } from '../../types';
import { sounds } from '../../utils/audio';
import {
  buildHtmlSandboxDoc,
  runCppCode,
  runPythonCode,
  SandboxExecutionResult,
  SandboxLanguage,
} from '../../utils/sandboxRunner';
import { CppTraceVisualizer } from './CppTraceVisualizer';
import { OlympiadArena } from './OlympiadArena';

export type SandboxWorkspaceTab = 'editor' | 'trace' | 'olympiad';

interface CodeSandboxHubProps {
  initialLanguage?: SandboxLanguage;
  initialChallengeId?: string | null;
  initialTab?: SandboxWorkspaceTab;
  initialTraceCode?: string | null;
  initialTraceStdin?: string | null;
  initialTraceLabel?: string | null;
  onBackToHome: () => void;
  onSelectMission: (missionId: AllMissionId) => void;
  onOpenBlog?: (slug?: string | null) => void;
}

interface TestRunResult {
  id: string;
  label: string;
  stdin: string;
  expected: string;
  actual: string;
  passed: boolean;
  error: string | null;
}

interface HtmlRuleResult {
  id: string;
  label: string;
  passed: boolean;
}

const getWorkspaceKey = (targetLang: SandboxLanguage, challengeId: string): string =>
  challengeId === 'free' ? `free_${targetLang}` : challengeId;

function loadSolvedIds(): string[] {
  return getStoredSandboxProgress().solvedIds;
}

const FREE_STARTERS: Record<SandboxLanguage, { code: string; css?: string; stdin: string }> = {
  cpp: {
    code: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << "Suma = " << (a + b) << endl;
    cout << "Rest (a % b) = " << (a % b) << endl;
    return 0;
}`,
    stdin: '17 5',
  },
  python: {
    code: `nume = input()
for i in range(1, 4):
    print(f"Salut, {nume}! Pasul {i}")`,
    stdin: 'Alex',
  },
  html: {
    code: `<section class="box">
  <h1>Laborator HTML5 + CSS3</h1>
  <p>Modifică codul din stânga și apasă <strong>Rulează</strong> pentru previzualizare instantanee.</p>
</section>`,
    css: `.box {
  padding: 20px;
  border-radius: 12px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
}
h1 { margin: 0 0 8px; color: #0f172a; font-size: 1.4rem; }`,
    stdin: '',
  },
};

export const CodeSandboxHub: React.FC<CodeSandboxHubProps> = ({
  initialLanguage = 'cpp',
  initialChallengeId = null,
  initialTab = 'editor',
  initialTraceCode = null,
  initialTraceStdin = null,
  initialTraceLabel = null,
  onBackToHome,
  onSelectMission,
  onOpenBlog,
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const arky = useArky();

  const [workspaceMode, setWorkspaceMode] = useState<SandboxWorkspaceTab>(initialTab);
  const [traceExternalCode, setTraceExternalCode] = useState<string | null>(initialTraceCode);
  const [traceExternalStdin, setTraceExternalStdin] = useState<string | null>(initialTraceStdin);
  const [traceExternalLabel, setTraceExternalLabel] = useState<string | null>(initialTraceLabel);

  useEffect(() => {
    setWorkspaceMode(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (initialTraceCode) {
      setTraceExternalCode(initialTraceCode);
      setTraceExternalStdin(initialTraceStdin ?? '');
      setTraceExternalLabel(initialTraceLabel ?? null);
    }
  }, [initialTraceCode, initialTraceStdin, initialTraceLabel]);

  const initialMatchedChallenge = initialChallengeId
    ? SANDBOX_CHALLENGES.find((c) => c.id === initialChallengeId) || null
    : null;
  const resolvedInitialLang: SandboxLanguage =
    initialMatchedChallenge?.language || (initialLanguage as SandboxLanguage) || 'cpp';
  const [selectedLang, setSelectedLang] = useState<SandboxLanguage>(resolvedInitialLang);
  const langChallenges = useMemo(
    () => SANDBOX_CHALLENGES.filter((c) => c.language === selectedLang),
    [selectedLang]
  );

  const initialResolvedChallenge =
    initialMatchedChallenge || SANDBOX_CHALLENGES.find((c) => c.language === resolvedInitialLang) || null;

  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(
    () => initialResolvedChallenge?.id || 'free'
  );
  const activeChallenge: SandboxChallenge | null = useMemo(
    () => langChallenges.find((c) => c.id === selectedChallengeId) || null,
    [langChallenges, selectedChallengeId]
  );

  const [code, setCode] = useState<string>(() => {
    const first = initialResolvedChallenge;
    const wsKey = getWorkspaceKey(resolvedInitialLang, first ? first.id : 'free');
    const saved = getStoredSandboxProgress().snippets[wsKey];
    if (saved?.code) return saved.code;
    return first ? first.starterCode : FREE_STARTERS[resolvedInitialLang].code;
  });
  const [cssCode, setCssCode] = useState<string>(() => {
    const first = initialResolvedChallenge;
    const wsKey = getWorkspaceKey(resolvedInitialLang, first ? first.id : 'free');
    const saved = getStoredSandboxProgress().snippets[wsKey];
    if (saved?.css !== undefined) return saved.css;
    return first?.starterCss || FREE_STARTERS.html.css || '';
  });
  const [stdinValue, setStdinValue] = useState<string>(() => {
    const first = initialResolvedChallenge;
    const wsKey = getWorkspaceKey(resolvedInitialLang, first ? first.id : 'free');
    const saved = getStoredSandboxProgress().snippets[wsKey];
    if (saved?.stdin !== undefined) return saved.stdin;
    return first ? first.defaultStdin : FREE_STARTERS[resolvedInitialLang].stdin;
  });
  const [htmlTab, setHtmlTab] = useState<'html' | 'css'>('html');
  const [showHint, setShowHint] = useState(false);

  const [execResult, setExecResult] = useState<SandboxExecutionResult | null>(null);
  const [testResults, setTestResults] = useState<TestRunResult[] | null>(null);
  const [htmlResults, setHtmlResults] = useState<HtmlRuleResult[] | null>(null);
  const [solvedIds, setSolvedIds] = useState<string[]>(() => loadSolvedIds());
  const [rewardBanner, setRewardBanner] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  const loadWorkspace = (targetLang: SandboxLanguage, challengeId: string, forceStarter = false) => {
    const found = SANDBOX_CHALLENGES.find((c) => c.id === challengeId && c.language === targetLang);
    const resolvedId = found ? found.id : 'free';
    const wsKey = getWorkspaceKey(targetLang, resolvedId);
    const saved = forceStarter ? undefined : getStoredSandboxProgress().snippets[wsKey];

    setSelectedLang(targetLang);
    setSelectedChallengeId(resolvedId);
    setShowHint(false);
    setRewardBanner(null);
    setSaveFeedback(null);
    setTestResults(null);
    setHtmlResults(null);

    if (found) {
      const nextCode = saved?.code ?? found.starterCode;
      const nextCss = saved?.css ?? (found.starterCss || '');
      const nextStdin = saved?.stdin ?? found.defaultStdin;
      setCode(nextCode);
      setCssCode(nextCss);
      setStdinValue(nextStdin);
      if (targetLang === 'html') {
        setExecResult(buildHtmlSandboxDoc(nextCode, nextCss));
      } else {
        setExecResult(null);
      }
    } else {
      const free = FREE_STARTERS[targetLang];
      const nextCode = saved?.code ?? free.code;
      const nextCss = saved?.css ?? (free.css || '');
      const nextStdin = saved?.stdin ?? free.stdin;
      setCode(nextCode);
      setCssCode(nextCss);
      setStdinValue(nextStdin);
      if (targetLang === 'html') {
        setExecResult(buildHtmlSandboxDoc(nextCode, nextCss));
      } else {
        setExecResult(null);
      }
    }
    setHtmlTab('html');
  };

  // Initial Cloud sync on mount if student is logged in
  useEffect(() => {
    if (!getActiveStudent()) return;
    refreshActiveStudentFromCloud().then(() => {
      const synced = getStoredSandboxProgress();
      setSolvedIds(synced.solvedIds);
      const wsKey = getWorkspaceKey(selectedLang, selectedChallengeId);
      const cloudSnip = synced.snippets[wsKey];
      if (cloudSnip?.code) {
        setCode(cloudSnip.code);
        if (cloudSnip.css !== undefined) setCssCode(cloudSnip.css);
        if (cloudSnip.stdin !== undefined) setStdinValue(cloudSnip.stdin);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save draft locally on edit (debounced local storage only, no excessive Cloud writes)
  useEffect(() => {
    const timer = setTimeout(() => {
      const wsKey = getWorkspaceKey(selectedLang, selectedChallengeId);
      void saveSandboxSnippet(
        wsKey,
        code,
        selectedLang === 'html' ? cssCode : undefined,
        selectedLang !== 'html' ? stdinValue : undefined,
        false
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [code, cssCode, stdinValue, selectedLang, selectedChallengeId]);

  useEffect(() => {
    if (selectedLang === 'html' && !execResult) {
      setExecResult(buildHtmlSandboxDoc(code, cssCode));
    }
  }, [selectedLang, execResult, code, cssCode]);

  const persistWorkspaceToCloud = async (showNotice = false) => {
    const wsKey = getWorkspaceKey(selectedLang, selectedChallengeId);
    await saveSandboxSnippet(
      wsKey,
      code,
      selectedLang === 'html' ? cssCode : undefined,
      selectedLang !== 'html' ? stdinValue : undefined,
      true
    );
    if (showNotice) {
      setSaveFeedback(
        getActiveStudent()
          ? isEn
            ? 'Saved to Cloud!'
            : 'Cod salvat în Cloud!'
          : isEn
          ? 'Saved locally!'
          : 'Salvat local!'
      );
      setTimeout(() => setSaveFeedback(null), 2200);
    }
  };

  const executeSingleRun = (): SandboxExecutionResult => {
    if (selectedLang === 'cpp') return runCppCode(code, stdinValue);
    if (selectedLang === 'python') return runPythonCode(code, stdinValue);
    return buildHtmlSandboxDoc(code, cssCode);
  };

  const handleRunOnly = () => {
    sounds.playClick();
    setRewardBanner(null);
    const res = executeSingleRun();
    setExecResult(res);
    void persistWorkspaceToCloud(false);
    if (res.error) {
      arky.triggerError();
    }
  };

  const handleVerifyChallenge = async () => {
    sounds.playClick();
    setRewardBanner(null);
    void persistWorkspaceToCloud(false);

    const single = executeSingleRun();
    setExecResult(single);

    if (!activeChallenge) return;

    if (selectedLang === 'html' && activeChallenge.htmlChecks) {
      const doc = new DOMParser().parseFromString(single.htmlDoc || '', 'text/html');
      const checks: HtmlRuleResult[] = activeChallenge.htmlChecks.map((rule) => ({
        id: rule.id,
        label: isEn ? rule.labelEn : rule.labelRo,
        passed: rule.check(doc, code, cssCode),
      }));
      setHtmlResults(checks);
      const allPassed = checks.every((c) => c.passed);
      await handleChallengeOutcome(activeChallenge, allPassed);
      return;
    }

    if (activeChallenge.tests) {
      const runs: TestRunResult[] = activeChallenge.tests.map((tc) => {
        const res = selectedLang === 'cpp' ? runCppCode(code, tc.stdin) : runPythonCode(code, tc.stdin);
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
        };
      });
      setTestResults(runs);
      const allPassed = runs.every((r) => r.passed);
      await handleChallengeOutcome(activeChallenge, allPassed);
    }
  };

  const handleChallengeOutcome = async (challenge: SandboxChallenge, passed: boolean) => {
    if (passed) {
      sounds.playSuccess();
      arky.triggerSuccess();
      if (!solvedIds.includes(challenge.id)) {
        const nextSolved = await saveSandboxChallengeSolved(challenge.id);
        setSolvedIds(nextSolved);
        await addByteCoins(challenge.rewardCoins, `Sandbox: ${challenge.id}`);
        setRewardBanner(
          isEn
            ? `All tests passed! +${challenge.rewardCoins} ByteCoins earned & synced.`
            : `Toate testele au trecut! Ai câștigat +${challenge.rewardCoins} ByteCoins și s-a sincronizat progresul.`
        );
      } else {
        setRewardBanner(
          isEn ? 'All tests passed cleanly!' : 'Toate testele au trecut cu succes!'
        );
      }
    } else {
      sounds.playError();
      arky.triggerError();
    }
  };

  const handleReset = () => {
    sounds.playClick();
    loadWorkspace(selectedLang, selectedChallengeId, true);
  };

  const activeEditorText = selectedLang === 'html' && htmlTab === 'css' ? cssCode : code;
  const lineCount = activeEditorText.split('\n').length;

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (activeChallenge) void handleVerifyChallenge();
      else handleRunOnly();
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const updated = activeEditorText.slice(0, start) + '    ' + activeEditorText.slice(end);
      if (selectedLang === 'html' && htmlTab === 'css') {
        setCssCode(updated);
      } else {
        setCode(updated);
      }
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      });
    }
  };

  const totalChallenges = SANDBOX_CHALLENGES.length;
  const solvedCount = solvedIds.filter((id) => SANDBOX_CHALLENGES.some((c) => c.id === id)).length;
  const olympiadSolvedCount = solvedIds.filter((id) => OLYMPIAD_PROBLEMS.some((p) => p.id === id)).length;

  const openInTraceVisualizer = (nextCode: string, nextStdin: string, label: string) => {
    setTraceExternalCode(nextCode);
    setTraceExternalStdin(nextStdin);
    setTraceExternalLabel(label);
    setWorkspaceMode('trace');
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Page Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-2">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onBackToHome();
              }}
              className="inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isEn ? 'Home' : 'Acasă'}</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
            <span className="text-emerald-300 font-medium">
              {isEn ? 'Code Sandbox, C++ Trace & Olympiad' : 'Sandbox Coding, Debug C++ & Olimpiadă TIC'}
            </span>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-balance">
            {isEn
              ? 'Code Sandbox: C++ Trace Debugger & Olympiad Arena'
              : 'Laborator Coding: Depanator C++, Sandbox & Olimpiada TIC'}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 tabular-nums">
            <span>{isEn ? 'Grades 6–8 & OJI Track' : 'Programa VI–VIII & Pregătire OJI'}</span>
            <span aria-hidden="true">·</span>
            <span>{isEn ? `${solvedCount}/${totalChallenges} Sandbox` : `${solvedCount}/${totalChallenges} Sandbox`}</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-300 font-semibold">
              {isEn
                ? `${olympiadSolvedCount}/${OLYMPIAD_PROBLEMS.length} Olympiad`
                : `${olympiadSolvedCount}/${OLYMPIAD_PROBLEMS.length} Olimpiadă`}
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 text-emerald-300">
              <Cloud className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{getActiveStudent() ? (isEn ? 'Cloud Sync Active' : 'Sincronizare Cloud Activă') : (isEn ? 'Local Drafts Saved' : 'Salvare Locală Automată')}</span>
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onBackToHome();
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[38px] rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start md:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{isEn ? 'Back to Courses' : 'Înapoi la Cursuri'}</span>
        </button>
      </div>

      {/* Top Workspace Mode Switcher */}
      <div
        role="tablist"
        aria-label={isEn ? 'Sandbox workspace modes' : 'Moduri laborator coding'}
        className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto max-w-full"
      >
        {(
          [
            {
              id: 'editor',
              icon: Code2,
              labelRo: 'Editor & Teste (C++ / Python / HTML5)',
              labelEn: 'Editor & Tests (C++ / Python / HTML5)',
              activeClass: 'bg-emerald-600 text-white',
            },
            {
              id: 'trace',
              icon: Cpu,
              labelRo: 'Debug Vizual C++ (Trace RAM)',
              labelEn: 'C++ Visual Trace Debugger',
              activeClass: 'bg-cyan-600 text-white',
            },
            {
              id: 'olympiad',
              icon: Trophy,
              labelRo: `Olimpiada TIC (${olympiadSolvedCount}/${OLYMPIAD_PROBLEMS.length})`,
              labelEn: `ICT Olympiad (${olympiadSolvedCount}/${OLYMPIAD_PROBLEMS.length})`,
              activeClass: 'bg-amber-600 text-white',
            },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const active = workspaceMode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                sounds.playClick();
                setWorkspaceMode(tab.id);
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                active ? tab.activeClass : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{isEn ? tab.labelEn : tab.labelRo}</span>
            </button>
          );
        })}
      </div>

      {workspaceMode === 'trace' && (
        <CppTraceVisualizer
          externalCode={traceExternalCode}
          externalStdin={traceExternalStdin}
          externalLabel={traceExternalLabel}
          onSendToEditor={(nextCode, nextStdin) => {
            setSelectedLang('cpp');
            setSelectedChallengeId('free');
            setCode(nextCode);
            setStdinValue(nextStdin);
            setExecResult(null);
            setTestResults(null);
            setWorkspaceMode('editor');
          }}
        />
      )}

      {workspaceMode === 'olympiad' && (
        <OlympiadArena
          solvedIds={solvedIds}
          onSolvedIdsChange={(next) => setSolvedIds(next)}
          onDebugInTrace={openInTraceVisualizer}
        />
      )}

      {workspaceMode === 'editor' && (
        <>
      {/* Workspace Controls Bar: Language Switcher + Challenge Picker */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Language Segmented Control */}
        <div
          role="tablist"
          aria-label={isEn ? 'Programming language' : 'Limbaj de programare'}
          className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 self-start overflow-x-auto scrollbar-none max-w-full"
        >
          {(
            [
              { id: 'cpp', label: 'C++ (Code::Blocks)' },
              { id: 'python', label: 'Python 3' },
              { id: 'html', label: 'HTML5 & CSS' },
            ] as const
          ).map((item) => {
            const active = selectedLang === item.id;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  const firstId = SANDBOX_CHALLENGES.find((c) => c.language === item.id)?.id || 'free';
                  loadWorkspace(item.id, firstId);
                }}
                className={`px-3.5 py-2 min-h-[38px] rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Challenge Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 lg:flex-wrap max-w-full">
          {langChallenges.map((ch, idx) => {
            const isActive = selectedChallengeId === ch.id;
            const isSolved = solvedIds.includes(ch.id);
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  loadWorkspace(selectedLang, ch.id);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-800 border-emerald-400/70 text-white'
                    : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                {isSolved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />}
                <span>
                  0{idx + 1}. {isEn ? ch.titleEn.split('(')[0].trim() : ch.titleRo.split('(')[0].trim()}
                </span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              loadWorkspace(selectedLang, 'free');
            }}
            className={`px-3 py-2 min-h-[38px] rounded-lg border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              selectedChallengeId === 'free'
                ? 'bg-slate-800 border-sky-400/70 text-white'
                : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            {isEn ? 'Free Playground' : 'Mod Liber'}
          </button>
        </div>
      </div>

      {/* Challenge Brief Banner */}
      {activeChallenge && (
        <section
          aria-label={isEn ? 'Current challenge instructions' : 'Cerința provocării curente'}
          className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 sm:p-5 space-y-3"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 tabular-nums">
                <span className="font-semibold text-emerald-300">
                  {isEn ? activeChallenge.gradeLabelEn : activeChallenge.gradeLabelRo}
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 text-amber-300 font-semibold">
                  <Coins className="w-3.5 h-3.5" aria-hidden="true" />
                  +{activeChallenge.rewardCoins} ByteCoins
                </span>
                {solvedIds.includes(activeChallenge.id) && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1 text-emerald-300 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      {isEn ? 'Completed' : 'Rezolvată'}
                    </span>
                  </>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {isEn ? activeChallenge.titleEn : activeChallenge.titleRo}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                {isEn ? activeChallenge.summaryEn : activeChallenge.summaryRo}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowHint((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
                <span>{showHint ? (isEn ? 'Hide Hint' : 'Ascunde Indiciu') : (isEn ? 'Show Hint' : 'Indiciu')}</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectMission(activeChallenge.relatedModuleId as AllMissionId)}
                className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-teal-300 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isEn ? 'Related Lesson' : 'Lecția Conectată'}</span>
              </button>
              {onOpenBlog && activeChallenge.relatedBlogSlugRo && (
                <button
                  type="button"
                  onClick={() =>
                    onOpenBlog(isEn ? activeChallenge.relatedBlogSlugEn : activeChallenge.relatedBlogSlugRo)
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-sky-300 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>{isEn ? 'Study Guide' : 'Ghid Blog'}</span>
                </button>
              )}
            </div>
          </div>

          {showHint && (
            <div className="rounded-xl bg-slate-950/90 border border-amber-500/30 p-3 text-xs text-amber-100 leading-relaxed">
              <strong className="text-amber-300">{isEn ? 'Hint: ' : 'Indiciu Arky: '}</strong>
              {isEn ? activeChallenge.hintEn : activeChallenge.hintRo}
            </div>
          )}
        </section>
      )}

      {/* Two-Zone Sandbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Zone: Code Editor & Stdin */}
        <section
          aria-label={isEn ? 'Code Editor' : 'Editor de Cod'}
          className="lg:col-span-7 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col overflow-hidden"
        >
          {/* Editor Toolbar */}
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              {selectedLang === 'html' ? (
                <div className="inline-flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setHtmlTab('html')}
                    className={`px-2.5 py-1 min-h-[32px] rounded-md text-xs font-mono font-semibold cursor-pointer whitespace-nowrap ${
                      htmlTab === 'html' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    index.html
                  </button>
                  <button
                    type="button"
                    onClick={() => setHtmlTab('css')}
                    className={`px-2.5 py-1 min-h-[32px] rounded-md text-xs font-mono font-semibold cursor-pointer whitespace-nowrap ${
                      htmlTab === 'css' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    style.css
                  </button>
                </div>
              ) : (
                <span className="text-xs font-mono font-semibold text-slate-200">
                  {selectedLang === 'cpp' ? 'main.cpp' : 'main.py'}
                </span>
              )}
              <span className="text-xs text-slate-400 tabular-nums">
                · {lineCount} {isEn ? 'lines' : 'linii'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {saveFeedback && (
                <span className="text-[11px] font-mono text-emerald-300 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30">
                  {saveFeedback}
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  void persistWorkspaceToCloud(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Save className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                <span>{isEn ? 'Save' : 'Salvează'}</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isEn ? 'Reset' : 'Resetează'}</span>
              </button>

              {selectedLang === 'cpp' && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    openInTraceVisualizer(
                      code,
                      stdinValue,
                      activeChallenge
                        ? `${isEn ? 'Tracing: ' : 'Urmărire pas-cu-pas: '}${
                            isEn ? activeChallenge.titleEn : activeChallenge.titleRo
                          }`
                        : isEn
                        ? 'Custom C++ Playground Trace'
                        : 'Urmărire Cod C++ Mod Liber'
                    );
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg bg-slate-800 hover:bg-slate-700 border border-cyan-500/40 text-xs font-semibold text-cyan-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Bug className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                  <span>{isEn ? 'Step-by-Step Debug' : 'Debug Pas-cu-Pas'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleRunOnly}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                <span>{isEn ? 'Run' : 'Rulează'}</span>
              </button>

              {activeChallenge && (
                <button
                  type="button"
                  onClick={() => {
                    void handleVerifyChallenge();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[38px] rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{isEn ? 'Verify Solution' : 'Verifică Soluția'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Code Textarea + Line Numbers */}
          <div className="flex flex-1 min-h-[260px] sm:min-h-[380px] bg-slate-950 font-mono text-xs sm:text-sm">
            <div
              aria-hidden="true"
              className="select-none py-3.5 px-3 text-right text-slate-500 bg-slate-900/60 border-r border-slate-800/80 tabular-nums leading-6 min-w-[2.75rem]"
            >
              {Array.from({ length: lineCount }, (_, idx) => (
                <div key={idx}>{idx + 1}</div>
              ))}
            </div>
            <textarea
              aria-label={isEn ? 'Code editor input' : 'Editor cod sursă'}
              value={activeEditorText}
              onChange={(e) => {
                if (selectedLang === 'html' && htmlTab === 'css') {
                  setCssCode(e.target.value);
                } else {
                  setCode(e.target.value);
                }
              }}
              onKeyDown={handleEditorKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              className="flex-1 w-full bg-transparent text-slate-100 p-3.5 leading-6 resize-none focus:outline-none overflow-auto"
            />
          </div>

          {/* Stdin Input Box (C++ & Python) */}
          {selectedLang !== 'html' && (
            <div className="border-t border-slate-800 bg-slate-900/70 p-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="sandbox-stdin" className="font-semibold text-slate-300">
                  {isEn ? 'Standard Input (cin / input)' : 'Date de intrare (cin / input)'}
                </label>
                <span className="text-slate-400">Ctrl + Enter</span>
              </div>
              <textarea
                id="sandbox-stdin"
                rows={2}
                value={stdinValue}
                onChange={(e) => setStdinValue(e.target.value)}
                placeholder={isEn ? 'Enter test inputs separated by spaces or new lines...' : 'Introdu datele de intrare separate prin spațiu sau linie nouă...'}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 font-mono text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}
        </section>

        {/* Right Zone: Live Output & Test Verification */}
        <section
          aria-label={isEn ? 'Program Output and Verification' : 'Rezultat Execuție și Verificare'}
          className="lg:col-span-5 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 flex flex-col gap-4"
        >
          {/* Output Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-sky-400" aria-hidden="true" />
              <span>
                {selectedLang === 'html'
                  ? isEn ? 'Live Browser Preview' : 'Previzualizare Browser Live'
                  : isEn ? 'Console Output' : 'Consolă Execuție'}
              </span>
            </h2>
            {execResult && (
              <span className="text-xs font-mono text-slate-400 tabular-nums">
                {execResult.durationMs} ms
              </span>
            )}
          </div>

          {/* Success / Reward Banner */}
          {rewardBanner && (
            <div
              role="status"
              className="rounded-xl bg-emerald-950/60 border border-emerald-500/50 p-3 flex items-center gap-2.5 text-xs font-semibold text-emerald-200"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
              <span>{rewardBanner}</span>
            </div>
          )}

          {/* Error or Diagnostic Callout */}
          {execResult?.error && (
            <div
              role="alert"
              className="rounded-xl bg-rose-950/60 border border-rose-500/50 p-3 flex items-start gap-2.5 text-xs text-rose-200"
            >
              <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1">
                <div className="font-bold text-rose-300">{isEn ? 'Execution Error' : 'Eroare la execuție'}</div>
                <div className="font-mono leading-relaxed">{execResult.error}</div>
              </div>
            </div>
          )}

          {execResult?.diagnostic && (
            <div className="rounded-xl bg-amber-950/50 border border-amber-500/40 p-3 flex items-start gap-2.5 text-xs text-amber-100">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="font-bold text-amber-300">{isEn ? 'Compiler Tip: ' : 'Atenționare: '}</span>
                {execResult.diagnostic}
              </div>
            </div>
          )}

          {/* Output Stage */}
          {selectedLang === 'html' ? (
            <div className="rounded-xl overflow-hidden border border-slate-700 bg-white min-h-[220px] flex-1">
              <iframe
                title={isEn ? 'HTML5 and CSS live preview' : 'Previzualizare live HTML5 și CSS'}
                srcDoc={execResult?.htmlDoc || ''}
                sandbox=""
                className="w-full h-full min-h-[220px] border-0 bg-white"
              />
            </div>
          ) : (
            <div className="rounded-xl bg-slate-950 border border-slate-800 p-3.5 min-h-[120px] font-mono text-xs text-emerald-300 whitespace-pre-wrap overflow-auto">
              {execResult === null
                ? isEn
                  ? 'Press Run or Verify Solution to see program output.'
                  : 'Apasă Rulează sau Verifică Soluția pentru a vedea rezultatul.'
                : execResult.error
                ? ''
                : execResult.stdout || (isEn ? '(no output printed)' : '(programul nu a afișat nimic)')}
            </div>
          )}

          {/* Automated Test Verification Results (C++ / Python) */}
          {testResults && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h3 className="text-xs font-bold text-slate-200">
                {isEn ? 'Automated Test Cases' : 'Rezultate Teste Automate'}
              </h3>
              <div className="space-y-2">
                {testResults.map((tr) => (
                  <div
                    key={tr.id}
                    className={`rounded-xl border p-2.5 text-xs space-y-1 ${
                      tr.passed
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100'
                        : 'bg-rose-950/30 border-rose-500/40 text-rose-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 font-semibold">
                      <span className="flex items-center gap-1.5">
                        {tr.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" aria-hidden="true" />
                        )}
                        <span>{tr.label}</span>
                      </span>
                      <span className="font-mono uppercase">{tr.passed ? 'PASS' : 'FAIL'}</span>
                    </div>
                    {!tr.passed && (
                      <div className="font-mono text-[11px] text-slate-300 pl-5 space-y-0.5 tabular-nums">
                        <div>{isEn ? 'Expected:' : 'Așteptat:'} {tr.expected}</div>
                        <div>{isEn ? 'Actual:' : 'Obținut:'} {tr.error ? `Error: ${tr.error}` : tr.actual || '(empty)'}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Automated DOM/CSS Rule Verification (HTML5) */}
          {htmlResults && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h3 className="text-xs font-bold text-slate-200">
                {isEn ? 'HTML5 & CSS Checklist' : 'Verificare Cerințe HTML5 & CSS'}
              </h3>
              <div className="space-y-1.5">
                {htmlResults.map((hr) => (
                  <div
                    key={hr.id}
                    className={`rounded-lg border px-3 py-2 text-xs flex items-center justify-between gap-2 ${
                      hr.passed
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100'
                        : 'bg-rose-950/30 border-rose-500/40 text-rose-100'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {hr.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" aria-hidden="true" />
                      )}
                      <span>{hr.label}</span>
                    </span>
                    <span className="font-mono text-[11px] font-bold">{hr.passed ? 'OK' : 'MISSING'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
        </>
      )}
    </div>
  );
};
