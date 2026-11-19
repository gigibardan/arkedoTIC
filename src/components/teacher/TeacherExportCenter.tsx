import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Download,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  Printer,
  RefreshCw,
  UserCheck,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { ClassAssignment, ClassroomGroup, LessonMissionState, School, StudentProfile } from '../../types';
import {
  computeClassRosterAnalytics,
  evaluateAssignmentForStudent,
  exportCsvFile,
  formatGradeNumLabel,
  getAssignments,
  getClassrooms,
} from '../../lib/classroomService';
import { getAllStudents } from '../../lib/studentAuthService';
import { StudentResult } from '../../lib/resultsService';
import { CARNET_MISSIONS } from '../../data/missionsRegistry';
import { computeGradeDetails } from '../../utils/pedagogicalGrading';
import { sounds } from '../../utils/audio';

interface TeacherExportCenterProps {
  schools: School[];
  results: StudentResult[];
  initialClassId?: string | null;
}

export const TeacherExportCenter: React.FC<TeacherExportCenterProps> = ({
  schools,
  results,
  initialClassId = null,
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [classrooms, setClassrooms] = useState<ClassroomGroup[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [assignments, setAssignments] = useState<ClassAssignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('all');
  const [selectedClassId, setSelectedClassId] = useState<string>(initialClassId || 'all');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [printMode, setPrintMode] = useState<'class' | 'student'>('class');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [cls, st, asg] = await Promise.all([
        getClassrooms(),
        getAllStudents(),
        getAssignments(),
      ]);
      setClassrooms(cls);
      setStudents(st);
      setAssignments(asg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (initialClassId) {
      setSelectedClassId(initialClassId);
    }
  }, [initialClassId]);

  const filteredClassrooms = useMemo(() => {
    return classrooms.filter((c) => {
      if (selectedSchoolId !== 'all' && c.schoolId !== selectedSchoolId) return false;
      return true;
    });
  }, [classrooms, selectedSchoolId]);

  const selectedClassroom = useMemo(
    () => (selectedClassId !== 'all' ? classrooms.find((c) => c.id === selectedClassId) || null : null),
    [classrooms, selectedClassId]
  );

  const filteredStudentsPool = useMemo(() => {
    if (selectedSchoolId === 'all') return students;
    return students.filter((s) => (s.schoolId || 'scoala_pilot_01') === selectedSchoolId);
  }, [students, selectedSchoolId]);

  const analytics = useMemo(
    () =>
      computeClassRosterAnalytics(
        selectedClassroom,
        filteredStudentsPool,
        results,
        assignments
      ),
    [selectedClassroom, filteredStudentsPool, results, assignments]
  );

  useEffect(() => {
    if (analytics.roster.length > 0 && !analytics.roster.some((r) => r.student.id === selectedStudentId)) {
      setSelectedStudentId(analytics.roster[0].student.id);
    }
  }, [analytics.roster, selectedStudentId]);

  const selectedStudentMetrics = useMemo(
    () => analytics.roster.find((r) => r.student.id === selectedStudentId) || analytics.roster[0] || null,
    [analytics.roster, selectedStudentId]
  );

  const handleExportSummaryCsv = () => {
    const headers = [
      'Nr',
      'Elev',
      'Clasa / Grupa',
      'Misiuni Finalizate',
      'Total Misiuni',
      'Medie Catalog (1-10)',
      'Medie Simulare Evaluare',
      'Exerciții Sandbox',
      'Teme Finalizate (%)',
      'Serie Activă (zile)',
      'XP Total',
    ];
    const rows = analytics.roster.map((r, i) => [
      i + 1,
      r.student.username,
      r.student.className || r.student.classGrade || 'Nespecificată',
      r.completedMissions,
      r.totalMissions,
      r.averageGrade > 0 ? r.averageGrade.toFixed(2) : '-',
      r.quickEvalAvg > 0 ? r.quickEvalAvg.toFixed(2) : '-',
      r.sandboxSolvedCount,
      `${r.assignmentsPct}%`,
      r.streakCurrent,
      r.totalXP,
    ]);
    const label = selectedClassroom ? selectedClassroom.code : 'Toate_Clasele';
    exportCsvFile(`ArkyEdu_Catalog_Sintetic_${label}_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
    sounds.playClick();
  };

  const handleExportDetailedResultsCsv = () => {
    const memberNames = new Set(analytics.roster.map((r) => r.student.username.toLowerCase()));
    const relevantResults =
      selectedClassroom && memberNames.size > 0
        ? results.filter((res) => memberNames.has((res.studentName || '').trim().toLowerCase()))
        : selectedSchoolId === 'all'
        ? results
        : results.filter((res) => (res.schoolId || 'scoala_pilot_01') === selectedSchoolId);

    const headers = ['Nr', 'Elev', 'Misiune / Evaluare', 'Punctaj', 'Punctaj Maxim', 'Notă (1-10)', 'Durată (sec)', 'Data'];
    const rows = relevantResults.map((res, i) => [
      i + 1,
      res.studentName,
      res.courseTitle,
      res.score,
      res.maxScore || 100,
      computeGradeDetails(res.score, res.maxScore || 100).grade,
      res.elapsedSeconds,
      res.dateFormatted || '',
    ]);
    const label = selectedClassroom ? selectedClassroom.code : 'Toate_Notele';
    exportCsvFile(`ArkyEdu_Note_Detaliate_${label}_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
    sounds.playClick();
  };

  const triggerPrint = (mode: 'class' | 'student') => {
    setPrintMode(mode);
    sounds.playClick();
    setTimeout(() => {
      window.print();
    }, 80);
  };

  const studentCompletedModules = useMemo(() => {
    if (!selectedStudentMetrics) return [];
    const lp = (selectedStudentMetrics.student.lessonsProgress || {}) as unknown as Record<
      string,
      LessonMissionState | undefined
    >;
    return CARNET_MISSIONS.map((m) => {
      const entry = lp[m.lessonsKey];
      if (!entry?.completed) return null;
      const score = entry.score > 0 ? entry.score : 100;
      const grade = computeGradeDetails(score, 100).grade;
      return { meta: m, score, grade };
    }).filter((x): x is NonNullable<typeof x> => Boolean(x));
  }, [selectedStudentMetrics]);

  const studentAssignmentsEval = useMemo(() => {
    if (!selectedStudentMetrics) return [];
    const clsId = selectedStudentMetrics.student.classId;
    const relevant = assignments.filter((a) => (clsId ? a.classId === clsId || a.classId === 'ALL' : a.classId === 'ALL'));
    return relevant.map((a) => evaluateAssignmentForStudent(a, selectedStudentMetrics.student, false));
  }, [selectedStudentMetrics, assignments]);

  const activeSchoolName = useMemo(() => {
    if (selectedClassroom) {
      return schools.find((s) => s.id === selectedClassroom.schoolId)?.name || 'Școală Parteneră ArkyEdu';
    }
    if (selectedSchoolId !== 'all') {
      return schools.find((s) => s.id === selectedSchoolId)?.name || 'Școală Parteneră ArkyEdu';
    }
    return 'Toate Școlile ArkyEdu';
  }, [selectedClassroom, selectedSchoolId, schools]);

  return (
    <div className="space-y-6">
      {/* Screen Controls */}
      <div className="print:hidden space-y-6">
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold mb-1">
                {isEn ? 'Official School Exports & Reports' : 'Export Catalog & Rapoarte A4 Părinți'}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
                {isEn ? 'Gradebook Summary & Printable Reports' : 'Borderou Oficial de Clasă & Fișe Individuale'}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={fetchData}
                disabled={loading}
                className="px-3.5 py-2 min-h-[40px] rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
                <span>{isEn ? 'Refresh' : 'Actualizează'}</span>
              </button>

              <button
                type="button"
                onClick={handleExportSummaryCsv}
                disabled={analytics.roster.length === 0}
                className="px-3.5 py-2 min-h-[40px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>{isEn ? 'Export Summary CSV' : 'Export Catalog Sintetic (CSV)'}</span>
              </button>

              <button
                type="button"
                onClick={handleExportDetailedResultsCsv}
                disabled={results.length === 0}
                className="px-3.5 py-2 min-h-[40px] rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>{isEn ? 'Detailed Grades CSV' : 'Export Note Detaliate (CSV)'}</span>
              </button>

              <button
                type="button"
                onClick={() => triggerPrint('class')}
                disabled={analytics.roster.length === 0}
                className="px-3.5 py-2 min-h-[40px] rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <Printer className="w-4 h-4" />
                <span>{isEn ? 'Print / PDF Class Report' : 'Printează / PDF Borderou Clasă'}</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <select
                value={selectedSchoolId}
                onChange={(e) => {
                  setSelectedSchoolId(e.target.value);
                  setSelectedClassId('all');
                }}
                className="w-full min-h-[40px] bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-200"
              >
                <option value="all">{isEn ? 'All Schools' : 'Toate Școlile'}</option>
                {schools.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.name} ({sc.city})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0" />
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full min-h-[40px] bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-200"
              >
                <option value="all">{isEn ? 'All Students / Classes' : 'Toți Elevii (Toate Clasele)'}</option>
                {filteredClassrooms.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} · {formatGradeNumLabel(c.gradeNum, isEn)} ({c.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 tabular-nums">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-mono uppercase text-slate-400">Elevi în Borderou</div>
              <div className="text-xl font-black text-white mt-0.5">{analytics.roster.length}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-mono uppercase text-slate-400">Medie Clasă (1–10)</div>
              <div className="text-xl font-black text-emerald-300 mt-0.5">
                {analytics.classAvgGrade > 0 ? analytics.classAvgGrade.toFixed(2) : '—'}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-mono uppercase text-slate-400">Teme Finalizate</div>
              <div className="text-xl font-black text-cyan-300 mt-0.5">{analytics.avgAssignmentsPct}%</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-mono uppercase text-slate-400">Activi Azi</div>
              <div className="text-xl font-black text-amber-300 mt-0.5">{analytics.activeTodayCount}</div>
            </div>
          </div>
        </div>

        {/* Summary Roster Table */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-2">
            <h4 className="text-sm sm:text-base font-black text-white font-heading">
              {selectedClassroom
                ? `Catalog Sintetic · ${selectedClassroom.name} (${selectedClassroom.code})`
                : 'Catalog Sintetic General'}
            </h4>
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              {analytics.roster.length} elevi
            </span>
          </div>

          {analytics.roster.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-400">
              {isEn
                ? 'No enrolled students found for the selected filter.'
                : 'Nu există elevi înregistrați pentru filtrul selectat.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm tabular-nums">
                <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Elev</th>
                    <th className="py-3 px-4">Misiuni</th>
                    <th className="py-3 px-4">Medie (1–10)</th>
                    <th className="py-3 px-4">Evaluare</th>
                    <th className="py-3 px-4">Sandbox</th>
                    <th className="py-3 px-4">Teme</th>
                    <th className="py-3 px-4">Serie</th>
                    <th className="py-3 px-4 text-right">XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {analytics.roster.map((r, idx) => (
                    <tr
                      key={r.student.id}
                      onClick={() => setSelectedStudentId(r.student.id)}
                      className={`cursor-pointer transition ${
                        selectedStudentId === r.student.id
                          ? 'bg-emerald-950/30'
                          : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-white">
                        <span className="mr-1.5">{r.student.avatar || '🎓'}</span>
                        {r.student.username}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {r.completedMissions}/{r.totalMissions}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-300">
                        {r.averageGrade > 0 ? r.averageGrade.toFixed(2) : '—'}
                      </td>
                      <td className="py-3 px-4 font-mono text-cyan-300">
                        {r.quickEvalAvg > 0 ? `${r.quickEvalAvg.toFixed(1)} (${r.quickEvalCount})` : '—'}
                      </td>
                      <td className="py-3 px-4 font-mono">{r.sandboxSolvedCount}</td>
                      <td className="py-3 px-4 font-mono text-amber-300">{r.assignmentsPct}%</td>
                      <td className="py-3 px-4 font-mono">{r.streakCurrent}z</td>
                      <td className="py-3 px-4 font-mono text-right text-slate-300">
                        {r.totalXP.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Individual Parent Report Preview */}
        {selectedStudentMetrics && (
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="text-xs font-mono uppercase text-cyan-300 font-bold flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>Fișă Individuală Progres Elev (pentru Părinți)</span>
                </div>
                <h4 className="text-lg font-black text-white font-heading mt-0.5">
                  {selectedStudentMetrics.student.avatar || '🎓'} {selectedStudentMetrics.student.username}
                </h4>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  value={selectedStudentMetrics.student.id}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="min-h-[40px] bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white"
                >
                  {analytics.roster.map((r) => (
                    <option key={r.student.id} value={r.student.id}>
                      {r.student.username} ({r.averageGrade > 0 ? `Medie ${r.averageGrade.toFixed(2)}` : 'Fără note'})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => triggerPrint('student')}
                  className="px-4 py-2 min-h-[40px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Printează / Salvează PDF Fișa Elevului</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 tabular-nums">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400">Medie Generală</div>
                <div className="text-lg font-black text-emerald-300">
                  {selectedStudentMetrics.averageGrade > 0
                    ? `${selectedStudentMetrics.averageGrade.toFixed(2)} / 10`
                    : '—'}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400">Module Parcurse</div>
                <div className="text-lg font-black text-white">
                  {selectedStudentMetrics.completedMissions} / {selectedStudentMetrics.totalMissions}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400">Teme Finalizate</div>
                <div className="text-lg font-black text-cyan-300">
                  {selectedStudentMetrics.assignmentsCompleted} / {selectedStudentMetrics.assignmentsTotal}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400">Sandbox & Serie</div>
                <div className="text-lg font-black text-amber-300">
                  {selectedStudentMetrics.sandboxSolvedCount} ex · {selectedStudentMetrics.streakBest}z
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <strong className="text-white block mb-1 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Recomandare Pedagogică Automată:</span>
              </strong>
              {selectedStudentMetrics.averageGrade >= 8.5
                ? `Elevul ${selectedStudentMetrics.student.username} demonstrează rezultate excelente (${selectedStudentMetrics.averageGrade.toFixed(2)}/10) și consecvență bună. Recomandăm exerciții avansate de algoritmică C++/Python în Sandbox și participarea la provocările Smart City.`
                : selectedStudentMetrics.completedMissions >= 3
                ? `Progres constant pe platformă (${selectedStudentMetrics.completedMissions} module finalizate). Pentru consolidarea mediei, recomandăm simulări cronometrate în Evaluare Rapidă și finalizarea temelor curente.`
                : `Activitate aflată la început de parcurs. Încurajăm completarea primelor 3 misiuni interactive din clasa curentă și menținerea seriei zilnice de studiu.`}
            </div>
          </div>
        )}
      </div>

      {/* ================= PRINT-READY A4 DOCUMENT VIEW (@media print) ================= */}
      <div className="hidden print:block bg-white text-slate-950 p-6 font-sans">
        {printMode === 'class' ? (
          <div className="space-y-5">
            <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider font-bold text-slate-600">
                  {activeSchoolName} · Platforma ArkyEdu TIC
                </div>
                <h1 className="text-2xl font-black text-slate-950">
                  Borderou Oficial de Clasă —{' '}
                  {selectedClassroom ? `${selectedClassroom.name} (${selectedClassroom.code})` : 'Sinteză Generală'}
                </h1>
              </div>
              <div className="text-right text-xs text-slate-700 font-mono">
                <div>Data: {new Date().toLocaleDateString('ro-RO')}</div>
                {selectedClassroom && <div>Cadru didactic: {selectedClassroom.teacherName}</div>}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 text-xs border border-slate-300 p-3 rounded">
              <div>
                <strong>Elevi:</strong> {analytics.roster.length}
              </div>
              <div>
                <strong>Medie Clasă:</strong>{' '}
                {analytics.classAvgGrade > 0 ? analytics.classAvgGrade.toFixed(2) : '—'}
              </div>
              <div>
                <strong>Teme Clasă:</strong> {analytics.avgAssignmentsPct}%
              </div>
              <div>
                <strong>Activi Azi:</strong> {analytics.activeTodayCount}
              </div>
            </div>

            <table className="w-full text-left text-xs border-collapse border border-slate-400">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-400">
                  <th className="p-2 border border-slate-300">Nr.</th>
                  <th className="p-2 border border-slate-300">Nume Elev</th>
                  <th className="p-2 border border-slate-300">Misiuni</th>
                  <th className="p-2 border border-slate-300">Medie (1–10)</th>
                  <th className="p-2 border border-slate-300">Evaluare</th>
                  <th className="p-2 border border-slate-300">Sandbox</th>
                  <th className="p-2 border border-slate-300">Teme</th>
                  <th className="p-2 border border-slate-300">XP</th>
                </tr>
              </thead>
              <tbody>
                {analytics.roster.map((r, idx) => (
                  <tr key={r.student.id} className="border-b border-slate-300">
                    <td className="p-2 border border-slate-300">{idx + 1}</td>
                    <td className="p-2 border border-slate-300 font-bold">{r.student.username}</td>
                    <td className="p-2 border border-slate-300">
                      {r.completedMissions}/{r.totalMissions}
                    </td>
                    <td className="p-2 border border-slate-300 font-bold">
                      {r.averageGrade > 0 ? r.averageGrade.toFixed(2) : '—'}
                    </td>
                    <td className="p-2 border border-slate-300">
                      {r.quickEvalAvg > 0 ? r.quickEvalAvg.toFixed(2) : '—'}
                    </td>
                    <td className="p-2 border border-slate-300">{r.sandboxSolvedCount}</td>
                    <td className="p-2 border border-slate-300">{r.assignmentsPct}%</td>
                    <td className="p-2 border border-slate-300">{r.totalXP}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pt-6 flex justify-between text-xs text-slate-700">
              <div>Semnătură Profesor TIC: _______________________</div>
              <div>Generat automat din ArkyEdu Digital Catalog</div>
            </div>
          </div>
        ) : (
          selectedStudentMetrics && (
            <div className="space-y-5">
              <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider font-bold text-slate-600">
                    {activeSchoolName} · Informare Părinți & Portofoliu Elev
                  </div>
                  <h1 className="text-2xl font-black text-slate-950">
                    Fișă Individuală de Progres TIC — {selectedStudentMetrics.student.username}
                  </h1>
                </div>
                <div className="text-right text-xs font-mono text-slate-700">
                  <div>Data emiterii: {new Date().toLocaleDateString('ro-RO')}</div>
                  <div>
                    Clasa:{' '}
                    {selectedStudentMetrics.student.className ||
                      selectedStudentMetrics.student.classGrade ||
                      'Gimnaziu'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 text-xs border border-slate-300 p-3 rounded">
                <div>
                  <strong>Medie Note:</strong>{' '}
                  {selectedStudentMetrics.averageGrade > 0
                    ? `${selectedStudentMetrics.averageGrade.toFixed(2)} / 10`
                    : '—'}
                </div>
                <div>
                  <strong>Module:</strong> {selectedStudentMetrics.completedMissions} /{' '}
                  {selectedStudentMetrics.totalMissions}
                </div>
                <div>
                  <strong>Teme Clasă:</strong> {selectedStudentMetrics.assignmentsCompleted} /{' '}
                  {selectedStudentMetrics.assignmentsTotal}
                </div>
                <div>
                  <strong>Exerciții Cod:</strong> {selectedStudentMetrics.sandboxSolvedCount}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-black uppercase mb-2">Module Finalizate & Note Obținute</h2>
                {studentCompletedModules.length === 0 ? (
                  <p className="text-xs text-slate-600">Nu există module finalizate încă.</p>
                ) : (
                  <table className="w-full text-left text-xs border-collapse border border-slate-400">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="p-2 border border-slate-300">Modul</th>
                        <th className="p-2 border border-slate-300">Clasa</th>
                        <th className="p-2 border border-slate-300">Punctaj</th>
                        <th className="p-2 border border-slate-300">Notă</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentCompletedModules.map((item) => (
                        <tr key={item.meta.id}>
                          <td className="p-2 border border-slate-300">{item.meta.titleRo}</td>
                          <td className="p-2 border border-slate-300">Clasa a {item.meta.gradeNum}-a</td>
                          <td className="p-2 border border-slate-300">{item.score}/100</td>
                          <td className="p-2 border border-slate-300 font-bold">{item.grade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {studentAssignmentsEval.length > 0 && (
                <div>
                  <h2 className="text-sm font-black uppercase mb-2">Situația Temelor Primite la Clasă</h2>
                  <ul className="text-xs space-y-1 list-disc pl-5">
                    {studentAssignmentsEval.map((ev) => (
                      <li key={ev.assignment.id}>
                        <strong>{ev.assignment.title}:</strong> {ev.completedCount}/{ev.totalCount} cerințe ({ev.percentage}%)
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-6 flex justify-between text-xs text-slate-700">
                <div>Profesor TIC: _______________________</div>
                <div>Luat la cunoștință (Părinte): _______________________</div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
