import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Cloud,
  CloudOff,
  Database,
  Download,
  Gamepad2,
  HardDrive,
  RefreshCw,
  ShieldCheck,
  Users,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { isCloudConnected } from '../lib/firebase';
import { getAllStudents } from '../lib/studentAuthService';
import { StudentResult, getStudentResults } from '../lib/resultsService';
import { CARNET_MISSIONS } from '../lib/carnetService';
import { ALL_GAMES, getLocalGameSettings, isGameOpen, subscribeGameSettings } from '../lib/gameControlService';
import { computeGradeDetails } from '../utils/pedagogicalGrading';
import { School, StudentProfile } from '../types';
import { sounds } from '../utils/audio';

interface TeacherDiagnosticsPanelProps {
  results: StudentResult[];
  schools: School[];
  onRefreshGradebook: () => Promise<void> | void;
}

interface ProbeMetrics {
  checkedAt: string;
  cloudLatencyMs: number | null;
  cloudReachable: boolean;
  browserOnline: boolean;
  swActive: boolean;
  swCount: number;
  arkedoKeysCount: number;
  storageKB: number;
}

function measureLocalStorageFootprint(): { count: number; kb: number } {
  try {
    let count = 0;
    let totalBytes = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (k.startsWith('arkedo_')) count++;
      const v = localStorage.getItem(k) || '';
      totalBytes += (k.length + v.length) * 2;
    }
    return { count, kb: Math.round((totalBytes / 1024) * 10) / 10 };
  } catch {
    return { count: 0, kb: 0 };
  }
}

export const TeacherDiagnosticsPanel: React.FC<TeacherDiagnosticsPanelProps> = ({
  results,
  schools,
  onRefreshGradebook,
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>('all');
  const [runningProbe, setRunningProbe] = useState<boolean>(false);
  const [gameSettings, setGameSettings] = useState(() => getLocalGameSettings());
  const [probe, setProbe] = useState<ProbeMetrics>(() => {
    const ls = measureLocalStorageFootprint();
    return {
      checkedAt: '—',
      cloudLatencyMs: null,
      cloudReachable: isCloudConnected,
      browserOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      swActive: false,
      swCount: 0,
      arkedoKeysCount: ls.count,
      storageKB: ls.kb,
    };
  });

  useEffect(() => {
    const unsub = subscribeGameSettings((next) => setGameSettings(next));
    return () => unsub();
  }, []);

  const runDiagnosticProbe = useCallback(
    async (alsoRefreshParent = false) => {
      setRunningProbe(true);
      const t0 = performance.now();

      try {
        const [fetchedStudents, fetchedResults] = await Promise.all([
          getAllStudents(),
          alsoRefreshParent ? getStudentResults() : Promise.resolve(results),
        ]);
        const elapsed = Math.round(performance.now() - t0);
        setStudents(fetchedStudents);

        if (alsoRefreshParent) {
          await onRefreshGradebook();
        }

        let swCount = 0;
        let swActive = false;
        if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
          try {
            const regs = await navigator.serviceWorker.getRegistrations();
            swCount = regs.length;
            swActive = regs.some((r) => Boolean(r.active));
          } catch {
            swCount = 0;
          }
        }

        const ls = measureLocalStorageFootprint();
        setProbe({
          checkedAt: new Date().toLocaleTimeString(isEn ? 'en-GB' : 'ro-RO', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
          cloudLatencyMs: isCloudConnected ? elapsed : null,
          cloudReachable: isCloudConnected && (fetchedStudents.length >= 0 || fetchedResults.length >= 0),
          browserOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
          swActive,
          swCount,
          arkedoKeysCount: ls.count,
          storageKB: ls.kb,
        });
      } finally {
        setRunningProbe(false);
      }
    },
    [isEn, onRefreshGradebook, results]
  );

  useEffect(() => {
    void runDiagnosticProbe(false);
    // Run once on tab mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredStudents = useMemo(() => {
    if (selectedSchoolFilter === 'all') return students;
    return students.filter((s) => (s.schoolId || 'scoala_pilot_01') === selectedSchoolFilter);
  }, [students, selectedSchoolFilter]);

  const filteredResults = useMemo(() => {
    if (selectedSchoolFilter === 'all') return results;
    return results.filter((r) => (r.schoolId || 'scoala_pilot_01') === selectedSchoolFilter);
  }, [results, selectedSchoolFilter]);

  // Compute class readiness & per-grade mastery from real Firestore data
  const analytics = useMemo(() => {
    const nowMs = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

    let activeLast7d = 0;
    let totalCompletedMissions = 0;
    let totalQuickEvalAttempts = 0;
    let quickEvalGradesSum = 0;

    const gradeStats: Record<5 | 6 | 7 | 8, { completedCount: number; missionsTotal: number; scoresSum: number }> = {
      5: { completedCount: 0, missionsTotal: 0, scoresSum: 0 },
      6: { completedCount: 0, missionsTotal: 0, scoresSum: 0 },
      7: { completedCount: 0, missionsTotal: 0, scoresSum: 0 },
      8: { completedCount: 0, missionsTotal: 0, scoresSum: 0 },
    };

    for (const m of CARNET_MISSIONS) {
      gradeStats[m.gradeNum].missionsTotal += 1;
    }

    const studentSummaries = filteredStudents.map((st) => {
      if (st.lastActiveAt) {
        const ts = new Date(st.lastActiveAt).getTime();
        if (!Number.isNaN(ts) && nowMs - ts <= sevenDaysMs) activeLast7d++;
      }

      const lp = (st.lessonsProgress || {}) as unknown as Record<
        string,
        { completed?: boolean; score?: number } | undefined
      >;

      let stCompleted = 0;
      for (const m of CARNET_MISSIONS) {
        const entry = lp[m.lessonsKey];
        const done = Boolean(entry?.completed || (entry?.score || 0) >= 100);
        if (done) {
          stCompleted++;
          totalCompletedMissions++;
          gradeStats[m.gradeNum].completedCount += 1;
          gradeStats[m.gradeNum].scoresSum += entry?.score || 100;
        }
      }

      const evalHist = Array.isArray(st.quickEvalHistory) ? st.quickEvalHistory : [];
      totalQuickEvalAttempts += evalHist.length;
      for (const ev of evalHist) {
        quickEvalGradesSum += ev.grade || computeGradeDetails(ev.score, ev.maxScore || 10).grade;
      }

      const stEvalAvg =
        evalHist.length > 0
          ? Number((evalHist.reduce((acc, e) => acc + e.grade, 0) / evalHist.length).toFixed(2))
          : null;

      return {
        id: st.id || st.username,
        username: st.username,
        avatar: st.avatar || '🎓',
        classGrade: st.classGrade || (isEn ? 'Unset' : 'Nesetată'),
        completedCount: stCompleted,
        totalXP: st.totalXP || 0,
        evalCount: evalHist.length,
        evalAvg: stEvalAvg,
        lastActiveAt: st.lastActiveAt || '',
      };
    });

    studentSummaries.sort((a, b) => b.completedCount - a.completedCount || b.totalXP - a.totalXP);

    // Gradebook integrity audit
    const zeroSecEntries = filteredResults.filter((r) => (r.elapsedSeconds || 0) === 0).length;
    const speedFlags = filteredResults.filter(
      (r) => r.elapsedSeconds > 0 && r.elapsedSeconds < 15 && r.score >= 90
    ).length;
    const localOnlyResults = filteredResults.filter((r) => String(r.id || '').startsWith('local_')).length;

    const avgCatalogGrade =
      filteredResults.length > 0
        ? Number(
            (
              filteredResults.reduce(
                (acc, r) => acc + computeGradeDetails(r.score || 0, r.maxScore || 100).grade,
                0
              ) / filteredResults.length
            ).toFixed(2)
          )
        : 0;

    const avgQuickEvalGrade =
      totalQuickEvalAttempts > 0 ? Number((quickEvalGradesSum / totalQuickEvalAttempts).toFixed(2)) : 0;

    const openGamesCount = ALL_GAMES.filter((g) => isGameOpen(gameSettings, g.id)).length;

    return {
      activeLast7d,
      totalCompletedMissions,
      totalQuickEvalAttempts,
      avgQuickEvalGrade,
      avgCatalogGrade,
      gradeStats,
      studentSummaries,
      zeroSecEntries,
      speedFlags,
      localOnlyResults,
      openGamesCount,
    };
  }, [filteredStudents, filteredResults, gameSettings, isEn]);

  const handleExportHealthCSV = () => {
    if (analytics.studentSummaries.length === 0) return;
    const headers = [
      'Elev',
      'Clasa',
      'Misiuni Finalizate (din 44)',
      'Total XP',
      'Simulari Evaluare',
      'Media Simulari',
      'Ultima Activitate',
    ];
    const rows = analytics.studentSummaries.map((s) => [
      `"${s.username.replace(/"/g, '""')}"`,
      `"${s.classGrade}"`,
      s.completedCount,
      s.totalXP,
      s.evalCount,
      s.evalAvg ?? '—',
      `"${s.lastActiveAt ? s.lastActiveAt.slice(0, 10) : '—'}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `ArkyEdu_Diagnostic_Clasa_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    sounds.playClick();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Control & School Filter Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-white font-heading flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>{isEn ? 'Lab Diagnostics & Class Readiness' : 'Diagnostic Laborator & Sănătate Clasă'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isEn
              ? 'Real-time Cloud connectivity check, local browser cache health, and mastery distribution across Grades 5–8.'
              : 'Verificare reală a conexiunii Cloud Firestore, starea cache-ului local din browser și distribuția progresului pe clasele V–VIII.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <select
              value={selectedSchoolFilter}
              onChange={(e) => setSelectedSchoolFilter(e.target.value)}
              aria-label={isEn ? 'Filter by school' : 'Filtrează după școală'}
              className="min-h-[40px] bg-slate-950 border border-slate-700 px-3 py-2 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">{isEn ? 'All Schools' : 'Toate Școlile'}</option>
              {schools.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.name} ({sc.city})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              void runDiagnosticProbe(true);
            }}
            disabled={runningProbe}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${runningProbe ? 'animate-spin' : ''}`} />
            <span>{isEn ? 'Run Lab Check' : 'Rulează Verificare Laborator'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportHealthCSV}
            disabled={analytics.studentSummaries.length === 0}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isEn ? 'Export Class CSV' : 'Exportă Raport Clasă (CSV)'}</span>
          </button>
        </div>
      </div>

      {/* Infrastructure Health Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cloud Sync */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">{isEn ? 'Cloud Database' : 'Bază de date Cloud'}</span>
            {probe.cloudReachable ? (
              <Cloud className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <CloudOff className="w-4 h-4 text-amber-400 shrink-0" />
            )}
          </div>
          <div className="text-base font-bold text-white flex items-center gap-2">
            {probe.cloudReachable ? (
              <span className="text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {isEn ? 'Firestore Active' : 'Firestore Activ'}
              </span>
            ) : (
              <span className="text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {isEn ? 'Local Mode Only' : 'Mod Local Offline'}
              </span>
            )}
          </div>
          <div className="text-xs text-slate-400 tabular-nums">
            {probe.cloudLatencyMs !== null
              ? `${isEn ? 'Round-trip latency' : 'Latență măsurată'}: ${probe.cloudLatencyMs} ms · ${probe.checkedAt}`
              : `${isEn ? 'Last checked' : 'Ultima verificare'}: ${probe.checkedAt}`}
          </div>
        </div>

        {/* Network & Service Worker */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">{isEn ? 'Network & PWA Cache' : 'Rețea & Cache PWA'}</span>
            {probe.browserOnline ? (
              <Wifi className="w-4 h-4 text-cyan-400 shrink-0" />
            ) : (
              <WifiOff className="w-4 h-4 text-rose-400 shrink-0" />
            )}
          </div>
          <div className="text-base font-bold text-white flex items-center gap-2">
            <span className={probe.browserOnline ? 'text-cyan-300' : 'text-rose-300'}>
              {probe.browserOnline
                ? isEn
                  ? 'Browser Online'
                  : 'Browser Conectat'
                : isEn
                ? 'Offline'
                : 'Fără Internet'}
            </span>
          </div>
          <div className="text-xs text-slate-400 tabular-nums">
            Service Worker: {probe.swActive ? (isEn ? 'Active' : 'Activ') : isEn ? 'Inactive' : 'Inactiv'} ({probe.swCount})
          </div>
        </div>

        {/* Browser LocalStorage */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">{isEn ? 'Workstation Storage' : 'Stocare Stație Lucru'}</span>
            <HardDrive className="w-4 h-4 text-indigo-400 shrink-0" />
          </div>
          <div className="text-xl font-black text-white tabular-nums">{probe.storageKB} KB</div>
          <div className="text-xs text-slate-400 tabular-nums">
            {probe.arkedoKeysCount} {isEn ? 'active ArkyEdu keys in browser' : 'chei ArkyEdu salvate local'}
          </div>
        </div>

        {/* Game Controls Overview */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">{isEn ? 'Arcade & Duel Access' : 'Acces Jocuri & Duel'}</span>
            <Gamepad2 className="w-4 h-4 text-purple-400 shrink-0" />
          </div>
          <div className="text-xl font-black text-white tabular-nums">
            {analytics.openGamesCount} / {ALL_GAMES.length} {isEn ? 'open' : 'deschise'}
          </div>
          <div className="text-xs text-slate-400">
            {gameSettings.allGamesOpen
              ? isEn
                ? 'Global switch: Open'
                : 'Comutator global: Deschis'
              : isEn
              ? 'Global switch: Restricted'
              : 'Comutator global: Restricționat'}
          </div>
        </div>
      </div>

      {/* Class Readiness KPIs & Grade Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Grade 5-8 Completion Distribution */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isEn ? 'Curriculum Completion by Grade (V–VIII)' : 'Progres pe Clase (V–VIII)'}</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5 tabular-nums">
                {filteredStudents.length} {isEn ? 'registered students' : 'elevi înregistrați'} ·{' '}
                {analytics.activeLast7d} {isEn ? 'active in last 7 days' : 'activi în ultimele 7 zile'} ·{' '}
                {analytics.totalCompletedMissions} {isEn ? 'completed missions' : 'misiuni finalizate'}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            {([5, 6, 7, 8] as const).map((gNum) => {
              const stat = analytics.gradeStats[gNum];
              const maxPossible = Math.max(1, filteredStudents.length * stat.missionsTotal);
              const pct = filteredStudents.length > 0 ? Math.min(100, Math.round((stat.completedCount / maxPossible) * 100)) : 0;
              const roman = gNum === 5 ? 'V' : gNum === 6 ? 'VI' : gNum === 7 ? 'VII' : 'VIII';
              const avgGrade =
                stat.completedCount > 0
                  ? computeGradeDetails(stat.scoresSum / stat.completedCount, 100).grade
                  : null;

              return (
                <div key={gNum} className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-2">
                    <span className="font-bold text-slate-100">
                      {isEn ? `Grade ${gNum}` : `Clasa a ${roman}-a`} ({stat.missionsTotal}{' '}
                      {isEn ? 'missions' : 'misiuni'})
                    </span>
                    <div className="flex items-center gap-3 text-slate-400 tabular-nums">
                      <span>
                        {stat.completedCount} {isEn ? 'completions' : 'finalizări'}
                      </span>
                      {avgGrade !== null && (
                        <span className="text-emerald-300 font-semibold">
                          {isEn ? 'Avg Grade' : 'Medie'}: {avgGrade}
                        </span>
                      )}
                      <span className="font-bold text-cyan-300">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: QuickEval & Gradebook Integrity Audit */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col gap-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{isEn ? 'Assessment & Integrity Audit' : 'Audit Evaluare & Integritate Date'}</span>
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <ClipboardCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{isEn ? 'QuickEval Tests' : 'Simulări Evaluare'}</span>
              </div>
              <div className="text-xl font-black text-white mt-1 tabular-nums">
                {analytics.totalQuickEvalAttempts}
              </div>
              <div className="text-xs text-slate-400 tabular-nums mt-0.5">
                {isEn ? 'Avg grade' : 'Medie'}: {analytics.avgQuickEvalGrade || '—'}
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{isEn ? 'Catalog Avg' : 'Medie Catalog'}</span>
              </div>
              <div className="text-xl font-black text-emerald-300 mt-1 tabular-nums">
                {analytics.avgCatalogGrade || '—'}
              </div>
              <div className="text-xs text-slate-400 tabular-nums mt-0.5">
                {filteredResults.length} {isEn ? 'logged grades' : 'note salvate'}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 text-xs pt-1">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-300 flex items-center gap-2">
                {analytics.zeroSecEntries > 0 ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                {isEn ? '0-second cache ghost entries' : 'Înregistrări fantomă 0s (cache)'}
              </span>
              <span
                className={`font-bold tabular-nums ${
                  analytics.zeroSecEntries > 0 ? 'text-amber-300' : 'text-emerald-300'
                }`}
              >
                {analytics.zeroSecEntries}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-300 flex items-center gap-2">
                {analytics.speedFlags > 0 ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                {isEn ? 'Implausible speed flags (<15s)' : 'Suspiciuni viteză (<15s, scor ≥ 90)'}
              </span>
              <span
                className={`font-bold tabular-nums ${
                  analytics.speedFlags > 0 ? 'text-rose-300' : 'text-emerald-300'
                }`}
              >
                {analytics.speedFlags}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-300 flex items-center gap-2">
                {analytics.localOnlyResults > 0 ? (
                  <HardDrive className="w-4 h-4 text-cyan-400 shrink-0" />
                ) : (
                  <Cloud className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                {isEn ? 'Local-only unsynced entries' : 'Note salvate exclusiv local (nesincronizate)'}
              </span>
              <span className="font-bold text-slate-200 tabular-nums">{analytics.localOnlyResults}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Student Readiness Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-base font-bold text-white tabular-nums">
            {isEn
              ? `Student Readiness Matrix (${analytics.studentSummaries.length})`
              : `Situație Pregătire Elevi (${analytics.studentSummaries.length})`}
          </h4>
          <span className="text-xs text-slate-400 tabular-nums">
            {CARNET_MISSIONS.length} {isEn ? 'curriculum missions total' : 'misiuni în programă'}
          </span>
        </div>

        {analytics.studentSummaries.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400">
            {isEn
              ? 'No student profiles found for the selected filter yet.'
              : 'Nu există încă profiluri de elevi înregistrate pentru filtrul selectat.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4 font-bold">{isEn ? 'Student' : 'Elev'}</th>
                  <th className="py-3 px-4 font-bold">{isEn ? 'Grade' : 'Clasa'}</th>
                  <th className="py-3 px-4 font-bold">{isEn ? 'Missions' : 'Misiuni'}</th>
                  <th className="py-3 px-4 font-bold">{isEn ? 'QuickEval' : 'Simulări'}</th>
                  <th className="py-3 px-4 font-bold text-right">XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {analytics.studentSummaries.slice(0, 30).map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-semibold text-white">
                      <span className="mr-2" aria-hidden="true">
                        {s.avatar}
                      </span>
                      {s.username}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{s.classGrade}</td>
                    <td className="py-3 px-4 tabular-nums">
                      <span className="font-bold text-emerald-300">{s.completedCount}</span> / {CARNET_MISSIONS.length}
                    </td>
                    <td className="py-3 px-4 tabular-nums text-slate-300">
                      {s.evalCount > 0 ? `${s.evalCount} (${isEn ? 'Avg' : 'Medie'} ${s.evalAvg})` : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-amber-300 tabular-nums">
                      {s.totalXP.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
