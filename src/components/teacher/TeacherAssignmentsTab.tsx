import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  Download,
  Gamepad2,
  Lock,
  Plus,
  RefreshCw,
  Trash2,
  Unlock,
  X,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  AllMissionId,
  ArcadeScores,
  AssignmentTaskItem,
  AssignmentTaskType,
  ClassAssignment,
  ClassroomGroup,
  School,
  StudentProfile,
} from '../../types';
import { CARNET_MISSIONS } from '../../data/missionsRegistry';
import { SANDBOX_CHALLENGES } from '../../data/sandboxChallenges';
import { ARCADE_REGISTRY } from '../../data/arcadeRegistry';
import {
  createAssignment,
  deleteAssignment,
  evaluateAssignmentForStudent,
  exportCsvFile,
  getAssignments,
  getClassrooms,
  updateAssignmentStatus,
} from '../../lib/classroomService';
import { getAllStudents } from '../../lib/studentAuthService';
import { sounds } from '../../utils/audio';

interface TeacherAssignmentsTabProps {
  schools: School[];
  initialClassId?: string | null;
}

export const TeacherAssignmentsTab: React.FC<TeacherAssignmentsTabProps> = ({
  schools,
  initialClassId = null,
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [classrooms, setClassrooms] = useState<ClassroomGroup[]>([]);
  const [assignments, setAssignments] = useState<ClassAssignment[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [filterClassId, setFilterClassId] = useState<string>(initialClassId || 'all');

  // Builder State
  const [showBuilder, setShowBuilder] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [targetClassId, setTargetClassId] = useState<string>(initialClassId || 'ALL');
  const [dueDate, setDueDate] = useState<string>(() => {
    const dt = new Date(Date.now() + 7 * 24 * 3600 * 1000);
    return dt.toISOString().slice(0, 16);
  });
  const [tasks, setTasks] = useState<AssignmentTaskItem[]>([]);
  const [saving, setSaving] = useState<boolean>(false);

  // Add-Task Helper Controls
  const [pickerType, setPickerType] = useState<AssignmentTaskType>('mission');
  const [selectedMissionId, setSelectedMissionId] = useState<AllMissionId>('hardware');
  const [missionMinScore, setMissionMinScore] = useState<number>(70);
  const [selectedSandboxId, setSelectedSandboxId] = useState<string>(SANDBOX_CHALLENGES[0]?.id || '');
  const [evalGrade, setEvalGrade] = useState<'all' | 5 | 6 | 7 | 8>(7);
  const [evalMinNota, setEvalMinNota] = useState<number>(7);
  const [selectedGameKey, setSelectedGameKey] = useState<keyof Omit<ArcadeScores, 'totalArcade'>>('typing');
  const [minArcadeScore, setMinArcadeScore] = useState<number>(40);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [cls, assgn, stds] = await Promise.all([
        getClassrooms(),
        getAssignments(),
        getAllStudents(),
      ]);
      setClassrooms(cls);
      setAssignments(assgn);
      setStudents(stds);
      setSelectedAssignmentId((prev) => {
        if (prev && assgn.some((a) => a.id === prev)) return prev;
        return assgn[0]?.id || null;
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (initialClassId) {
      setFilterClassId(initialClassId);
      setTargetClassId(initialClassId);
    }
  }, [initialClassId]);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      if (filterClassId !== 'all' && a.classId !== filterClassId && a.classId !== 'ALL') return false;
      return true;
    });
  }, [assignments, filterClassId]);

  const selectedAssignment = useMemo(
    () =>
      assignments.find((a) => a.id === selectedAssignmentId) ||
      filteredAssignments[0] ||
      null,
    [assignments, selectedAssignmentId, filteredAssignments]
  );

  const submissionMatrix = useMemo(() => {
    if (!selectedAssignment) return [];
    const targetCls = classrooms.find((c) => c.id === selectedAssignment.classId);
    const matchingStudents = students.filter((s) => {
      if (selectedAssignment.classId === 'ALL') {
        return !selectedAssignment.schoolId || (s.schoolId || 'scoala_pilot_01') === selectedAssignment.schoolId;
      }
      if (!targetCls) return s.classId === selectedAssignment.classId;
      return (
        s.classId === targetCls.id ||
        (targetCls.memberIds || []).includes(s.id) ||
        (targetCls.memberUsernames || []).some(
          (u) => u.toLowerCase() === (s.username || '').toLowerCase()
        )
      );
    });

    return matchingStudents
      .map((student) => ({
        student,
        evaluation: evaluateAssignmentForStudent(selectedAssignment, student, false),
      }))
      .sort((a, b) => b.evaluation.percentage - a.evaluation.percentage || a.student.username.localeCompare(b.student.username, 'ro'));
  }, [selectedAssignment, classrooms, students]);

  const handleAddTaskItem = () => {
    sounds.playClick();
    const id = `tsk_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;

    if (pickerType === 'mission') {
      const m = CARNET_MISSIONS.find((x) => x.id === selectedMissionId);
      if (!m) return;
      if (tasks.some((t) => t.type === 'mission' && t.missionId === m.id)) return;
      setTasks((prev) => [
        ...prev,
        {
          id,
          type: 'mission',
          missionId: m.id,
          minScore: missionMinScore,
          labelRo: `Lecție: ${m.titleRo} (min. ${missionMinScore} pct)`,
          labelEn: `Mission: ${m.titleEn} (min. ${missionMinScore} pts)`,
        },
      ]);
      return;
    }

    if (pickerType === 'sandbox') {
      const ch = SANDBOX_CHALLENGES.find((x) => x.id === selectedSandboxId);
      if (!ch) return;
      if (tasks.some((t) => t.type === 'sandbox' && t.challengeId === ch.id)) return;
      setTasks((prev) => [
        ...prev,
        {
          id,
          type: 'sandbox',
          challengeId: ch.id,
          sandboxLang: ch.language,
          labelRo: `Code Sandbox (${ch.language.toUpperCase()}): ${ch.titleRo}`,
          labelEn: `Code Sandbox (${ch.language.toUpperCase()}): ${ch.titleEn}`,
        },
      ]);
      return;
    }

    if (pickerType === 'eval') {
      setTasks((prev) => [
        ...prev,
        {
          id,
          type: 'eval',
          evalGrade,
          minNota: evalMinNota,
          labelRo: `Evaluare Rapidă (${evalGrade === 'all' ? 'Mixt' : `Clasa ${evalGrade}`}, min. nota ${evalMinNota})`,
          labelEn: `Quick Eval (${evalGrade === 'all' ? 'Mixed' : `Grade ${evalGrade}`}, min. ${evalMinNota})`,
        },
      ]);
      return;
    }

    if (pickerType === 'arcade') {
      const g = ARCADE_REGISTRY.find((x) => x.scoreKey === selectedGameKey);
      if (!g) return;
      setTasks((prev) => [
        ...prev,
        {
          id,
          type: 'arcade',
          gameKey: g.scoreKey,
          minArcadeScore,
          labelRo: `Arcade: ${g.nameRo} (scor țintă ${minArcadeScore})`,
          labelEn: `Arcade: ${g.nameEn} (target ${minArcadeScore})`,
        },
      ]);
    }
  };

  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || tasks.length === 0) return;
    setSaving(true);
    try {
      const cls = classrooms.find((c) => c.id === targetClassId);
      const created = await createAssignment({
        title: title.trim(),
        description: description.trim(),
        classId: targetClassId,
        className: cls ? cls.name : 'Toate Clasele (Școală)',
        schoolId: cls?.schoolId || schools[0]?.id || 'scoala_pilot_01',
        teacherName: cls?.teacherName || 'Profesor TIC',
        dueDate,
        tasks,
      });
      sounds.playCorrect();
      setTitle('');
      setDescription('');
      setTasks([]);
      setShowBuilder(false);
      await loadData();
      setSelectedAssignmentId(created.id);
    } finally {
      setSaving(false);
    }
  };

  const handleExportMatrixCsv = () => {
    if (!selectedAssignment || submissionMatrix.length === 0) return;
    const headers = [
      'Elev',
      'Clasă',
      ...selectedAssignment.tasks.map((t) => t.labelRo),
      'Progres (%)',
      'Status Temă',
    ];
    const rows = submissionMatrix.map(({ student, evaluation }) => [
      student.username,
      student.className || student.classGrade || '-',
      ...evaluation.taskStatuses.map((ts) => (ts.completed ? `Finalizat (${ts.currentValueLabel})` : ts.currentValueLabel)),
      `${evaluation.percentage}%`,
      evaluation.isAllCompleted ? 'Predată Complet' : evaluation.isOverdue ? 'Întârziată' : 'În Lucru',
    ]);
    exportCsvFile(
      `ArkyEdu_Tema_${selectedAssignment.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.csv`,
      headers,
      rows
    );
    sounds.playClick();
  };

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">
            {isEn ? 'Assignments & Deadlines Engine' : 'Teme, Sarcini & Evaluări cu Termen Limită'}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
            {isEn ? 'Classroom Homework & Auto-Grading Matrix' : 'Teme pentru Acasă & Matrice de Predare'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            {isEn
              ? 'Combine curriculum missions, Code Sandbox challenges, and Quick Eval tests. Progress updates automatically when students finish!'
              : 'Combină lecții, exerciții Code Sandbox C++/Python/HTML, Evaluări și Arcade. Platforma verifică automat fiecare elev.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={filterClassId}
            onChange={(e) => setFilterClassId(e.target.value)}
            className="min-h-[40px] bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">Toate Clasele</option>
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizează</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setShowBuilder((v) => !v);
            }}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Creează Temă Nouă</span>
          </button>
        </div>
      </div>

      {/* Builder Form */}
      {showBuilder && (
        <form
          onSubmit={handleSaveAssignment}
          className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5 sm:p-6 space-y-5"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-base font-black text-white font-heading">
              Configurare Temă Nouă
            </h4>
            <button
              type="button"
              onClick={() => setShowBuilder(false)}
              className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Titlul Temei
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ex: Tema Săptămâna 4 · Algoritmi & C++"
                className="w-full min-h-[40px] bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Clasa Destinatară
              </label>
              <select
                value={targetClassId}
                onChange={(e) => setTargetClassId(e.target.value)}
                className="w-full min-h-[40px] bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">Toate Clasele (Anunț Global Școală)</option>
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Termen Limită (Deadline)
              </label>
              <input
                type="datetime-local"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full min-h-[40px] bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Instrucțiuni pentru elevi (opțional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ex: Parcurgeți lecția înainte de a rezolva provocarea din Code Sandbox."
              className="w-full min-h-[40px] bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Task Picker Bar */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-300 mr-1">Adaugă sarcină din:</span>
              {(
                [
                  { id: 'mission', label: 'Lecție TIC (44)', icon: BookOpen },
                  { id: 'sandbox', label: 'Code Sandbox', icon: Code2 },
                  { id: 'eval', label: 'Evaluare Rapidă', icon: ClipboardCheck },
                  { id: 'arcade', label: 'Mini-Joc Arcade', icon: Gamepad2 },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPickerType(tab.id)}
                    className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition ${
                      pickerType === tab.id
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {pickerType === 'mission' && (
                <>
                  <select
                    value={selectedMissionId}
                    onChange={(e) => setSelectedMissionId(e.target.value as AllMissionId)}
                    className="flex-1 min-h-[40px] bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {CARNET_MISSIONS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.gradeLabelRo} · {m.titleRo}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 whitespace-nowrap">Scor min:</span>
                    <input
                      type="number"
                      min={10}
                      max={100}
                      step={10}
                      value={missionMinScore}
                      onChange={(e) => setMissionMinScore(Number(e.target.value) || 70)}
                      className="w-20 min-h-[40px] bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs font-mono text-white text-center"
                    />
                  </div>
                </>
              )}

              {pickerType === 'sandbox' && (
                <select
                  value={selectedSandboxId}
                  onChange={(e) => setSelectedSandboxId(e.target.value)}
                  className="flex-1 min-h-[40px] bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {SANDBOX_CHALLENGES.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      [{ch.language.toUpperCase()}] {ch.gradeLabelRo} · {ch.titleRo}
                    </option>
                  ))}
                </select>
              )}

              {pickerType === 'eval' && (
                <>
                  <select
                    value={String(evalGrade)}
                    onChange={(e) =>
                      setEvalGrade(e.target.value === 'all' ? 'all' : (Number(e.target.value) as 5 | 6 | 7 | 8))
                    }
                    className="flex-1 min-h-[40px] bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="all">Toate Clasele (Mixt)</option>
                    <option value="5">Clasa a V-a</option>
                    <option value="6">Clasa a VI-a</option>
                    <option value="7">Clasa a VII-a</option>
                    <option value="8">Clasa a VIII-a</option>
                  </select>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 whitespace-nowrap">Notă min:</span>
                    <input
                      type="number"
                      min={5}
                      max={10}
                      step={0.5}
                      value={evalMinNota}
                      onChange={(e) => setEvalMinNota(Number(e.target.value) || 7)}
                      className="w-20 min-h-[40px] bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs font-mono text-white text-center"
                    />
                  </div>
                </>
              )}

              {pickerType === 'arcade' && (
                <>
                  <select
                    value={selectedGameKey}
                    onChange={(e) =>
                      setSelectedGameKey(e.target.value as keyof Omit<ArcadeScores, 'totalArcade'>)
                    }
                    className="flex-1 min-h-[40px] bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {ARCADE_REGISTRY.map((g) => (
                      <option key={g.scoreKey} value={g.scoreKey}>
                        {g.icon} {g.nameRo}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 whitespace-nowrap">Scor țintă:</span>
                    <input
                      type="number"
                      min={10}
                      max={50000}
                      step={10}
                      value={minArcadeScore}
                      onChange={(e) => setMinArcadeScore(Number(e.target.value) || 100)}
                      className="w-24 min-h-[40px] bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs font-mono text-white text-center"
                    />
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={handleAddTaskItem}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Adaugă în Temă</span>
              </button>
            </div>

            {tasks.length > 0 && (
              <div className="pt-2 space-y-1.5">
                {tasks.map((t, idx) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                  >
                    <span className="truncate">
                      <strong className="font-mono text-amber-300 mr-1.5">{idx + 1}.</strong>
                      {t.labelRo}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTasks((prev) => prev.filter((x) => x.id !== t.id))}
                      className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowBuilder(false)}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
            >
              Anulează
            </button>
            <button
              type="submit"
              disabled={saving || tasks.length === 0}
              className="min-h-[40px] px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Se publică...' : `Publică Tema (${tasks.length} sarcini)`}
            </button>
          </div>
        </form>
      )}

      {/* Split Workspace: Assignments List + Live Submission Matrix */}
      {filteredAssignments.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-3">
          <CalendarClock className="w-10 h-10 text-amber-400 mx-auto" />
          <h4 className="text-lg font-black text-white font-heading">Nicio temă publicată încă</h4>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Creează o temă și elevii clasei o vor vedea automat în Carnetul Digital cu buton direct „Rezolvă acum”.
          </p>
          <button
            type="button"
            onClick={() => setShowBuilder(true)}
            className="min-h-[40px] px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black cursor-pointer"
          >
            Creează Prima Temă
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Assignments List */}
          <div className="lg:col-span-4 space-y-2.5">
            {filteredAssignments.map((assgn) => {
              const isSelected = selectedAssignment?.id === assgn.id;
              const isExpired = new Date(assgn.dueDate).getTime() < Date.now();

              return (
                <button
                  key={assgn.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedAssignmentId(assgn.id);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500 ring-1 ring-amber-500/30'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-black text-white font-heading truncate">
                        {assgn.title}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 truncate">
                        {assgn.className} · {assgn.tasks.length} sarcini
                      </div>
                    </div>
                    <span
                      className={`text-[11px] font-mono font-bold shrink-0 ${
                        assgn.status === 'closed'
                          ? 'text-slate-400'
                          : isExpired
                          ? 'text-rose-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {assgn.status === 'closed'
                        ? 'Închisă'
                        : isExpired
                        ? 'Expirată'
                        : 'Activă'}
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] font-mono text-slate-400 tabular-nums">
                    Termen: {assgn.dueDate.replace('T', ' ')}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Submission Matrix */}
          {selectedAssignment && (
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs text-slate-400">
                    {selectedAssignment.className} · Termen:{' '}
                    <span className="font-mono text-slate-200 tabular-nums">
                      {selectedAssignment.dueDate.replace('T', ' ')}
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-white font-heading truncate mt-0.5">
                    {selectedAssignment.title}
                  </h4>
                  {selectedAssignment.description && (
                    <p className="text-xs text-slate-400 mt-1">{selectedAssignment.description}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleExportMatrixCsv}
                    disabled={submissionMatrix.length === 0}
                    className="min-h-[36px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>CSV Temă</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      sounds.playClick();
                      await updateAssignmentStatus(
                        selectedAssignment.id,
                        selectedAssignment.status === 'active' ? 'closed' : 'active'
                      );
                      await loadData();
                    }}
                    className="min-h-[36px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    {selectedAssignment.status === 'active' ? (
                      <>
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Închide</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Redeschide</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      sounds.playClick();
                      await deleteAssignment(selectedAssignment.id);
                      setSelectedAssignmentId(null);
                      await loadData();
                    }}
                    className="min-h-[36px] px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/70 text-rose-300 border border-rose-800/50 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Șterge</span>
                  </button>
                </div>
              </div>

              {submissionMatrix.length === 0 ? (
                <div className="p-10 text-center text-xs text-slate-400">
                  Nu există încă elevi înscriși în clasa „{selectedAssignment.className}”.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                      <tr>
                        <th className="py-3 px-4">Elev</th>
                        {selectedAssignment.tasks.map((task, idx) => (
                          <th key={task.id} className="py-3 px-4" title={task.labelRo}>
                            S{idx + 1} · {task.type.toUpperCase()}
                          </th>
                        ))}
                        <th className="py-3 px-4 text-right">Finalizare</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-200">
                      {submissionMatrix.map(({ student, evaluation }) => (
                        <tr key={student.id} className="hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                            <span className="mr-2">{student.avatar || '🎓'}</span>
                            {student.username}
                          </td>
                          {evaluation.taskStatuses.map((ts) => (
                            <td key={ts.task.id} className="py-3 px-4 font-mono text-xs whitespace-nowrap">
                              <span
                                className={
                                  ts.completed
                                    ? 'text-emerald-400 font-bold'
                                    : ts.inProgress
                                    ? 'text-amber-300'
                                    : 'text-slate-500'
                                }
                              >
                                {ts.completed ? `✓ ${ts.currentValueLabel}` : ts.currentValueLabel}
                              </span>
                            </td>
                          ))}
                          <td className="py-3 px-4 text-right font-mono font-bold tabular-nums whitespace-nowrap">
                            <span
                              className={
                                evaluation.isAllCompleted
                                  ? 'text-emerald-400'
                                  : evaluation.percentage > 0
                                  ? 'text-amber-300'
                                  : 'text-slate-400'
                              }
                            >
                              {evaluation.completedCount}/{evaluation.totalCount} ({evaluation.percentage}%)
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
