import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Archive,
  Building2,
  Check,
  Copy,
  GraduationCap,
  KeyRound,
  Maximize2,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Sliders,
  Trash2,
  UserMinus,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { ClassAssignment, ClassroomGroup, School, StudentProfile } from '../../types';
import {
  addStudentToClassroom,
  computeClassRosterAnalytics,
  createClassroom,
  deleteClassroom,
  formatGradeNumLabel,
  getAssignments,
  getClassrooms,
  removeStudentFromClassroom,
  updateClassroom,
} from '../../lib/classroomService';
import { getAllStudents } from '../../lib/studentAuthService';
import { StudentResult } from '../../lib/resultsService';
import { TeacherScoreModal } from '../TeacherScoreModal';
import { sounds } from '../../utils/audio';

interface TeacherClassroomsTabProps {
  schools: School[];
  results: StudentResult[];
  onOpenAssignmentsForClass?: (classId: string) => void;
  onOpenExportForClass?: (classId: string) => void;
}

export const TeacherClassroomsTab: React.FC<TeacherClassroomsTabProps> = ({
  schools,
  results,
  onOpenAssignmentsForClass,
  onOpenExportForClass,
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [classrooms, setClassrooms] = useState<ClassroomGroup[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [assignments, setAssignments] = useState<ClassAssignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>('all');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Create Classroom Form
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newGradeNum, setNewGradeNum] = useState<5 | 6 | 7 | 8>(7);
  const [newSchoolId, setNewSchoolId] = useState<string>(schools[0]?.id || 'scoala_pilot_01');
  const [newTeacherName, setNewTeacherName] = useState<string>('Prof. Informatică & TIC');
  const [newAcademicYear, setNewAcademicYear] = useState<string>('2026-2027');
  const [creating, setCreating] = useState<boolean>(false);

  // Poster / Projector Modal
  const [posterClass, setPosterClass] = useState<ClassroomGroup | null>(null);

  // Add existing student modal
  const [addStudentModalOpen, setAddStudentModalOpen] = useState<boolean>(false);
  const [studentSearch, setStudentSearch] = useState<string>('');

  // Inspect Student Score Modal
  const [inspectingStudent, setInspectingStudent] = useState<StudentProfile | null>(null);

  // Confirm delete classroom
  const [confirmDeleteClass, setConfirmDeleteClass] = useState<ClassroomGroup | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [clsList, stdList, assgnList] = await Promise.all([
        getClassrooms(),
        getAllStudents(),
        getAssignments(),
      ]);
      setClassrooms(clsList);
      setStudents(stdList);
      setAssignments(assgnList);
      setSelectedClassId((prev) => {
        if (prev && clsList.some((c) => c.id === prev)) return prev;
        return clsList[0]?.id || null;
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (schools.length > 0 && !schools.some((s) => s.id === newSchoolId)) {
      setNewSchoolId(schools[0].id);
    }
  }, [schools, newSchoolId]);

  const visibleClassrooms = useMemo(() => {
    return classrooms.filter((c) => {
      if (selectedSchoolFilter !== 'all' && c.schoolId !== selectedSchoolFilter) return false;
      return true;
    });
  }, [classrooms, selectedSchoolFilter]);

  const selectedClassroom = useMemo(
    () => classrooms.find((c) => c.id === selectedClassId) || visibleClassrooms[0] || null,
    [classrooms, selectedClassId, visibleClassrooms]
  );

  const rosterAnalytics = useMemo(() => {
    if (!selectedClassroom) {
      return { roster: [], classAvgGrade: 0, activeTodayCount: 0, avgAssignmentsPct: 0, totalClassXP: 0 };
    }
    return computeClassRosterAnalytics(selectedClassroom, students, results, assignments);
  }, [selectedClassroom, students, results, assignments]);

  const unenrolledOrOtherStudents = useMemo(() => {
    if (!selectedClassroom) return [];
    const q = studentSearch.trim().toLowerCase();
    return students
      .filter((s) => {
        const alreadyIn =
          s.classId === selectedClassroom.id ||
          (selectedClassroom.memberIds || []).includes(s.id);
        if (alreadyIn) return false;
        if (q && !s.username.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => a.username.localeCompare(b.username, 'ro'));
  }, [students, selectedClassroom, studentSearch]);

  const handleCreateClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const created = await createClassroom({
        name: newName.trim(),
        gradeNum: newGradeNum,
        schoolId: newSchoolId,
        teacherName: newTeacherName.trim() || 'Profesor TIC',
        academicYear: newAcademicYear.trim() || '2026-2027',
      });
      sounds.playCorrect();
      setNewName('');
      setShowCreateForm(false);
      await loadData();
      setSelectedClassId(created.id);
    } finally {
      setCreating(false);
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      sounds.playClick();
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {}
  };

  const handleEnrollStudent = async (student: StudentProfile) => {
    if (!selectedClassroom) return;
    sounds.playCorrect();
    await addStudentToClassroom(selectedClassroom, student);
    await loadData();
  };

  const handleRemoveStudent = async (student: StudentProfile) => {
    if (!selectedClassroom) return;
    sounds.playClick();
    await removeStudentFromClassroom(selectedClassroom, student.id, student.username);
    await loadData();
  };

  const handleToggleArchive = async (cls: ClassroomGroup) => {
    sounds.playClick();
    await updateClassroom(cls.id, { archived: !cls.archived });
    await loadData();
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteClass) return;
    const id = confirmDeleteClass.id;
    setConfirmDeleteClass(null);
    sounds.playClick();
    await deleteClassroom(id);
    if (selectedClassId === id) setSelectedClassId(null);
    await loadData();
  };

  const schoolNameFor = (schoolId: string) =>
    schools.find((s) => s.id === schoolId)?.name || 'Școala Pilot ArkyEdu';

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
            {isEn ? 'Classroom & Group Management' : 'Gestiune Clase & Grupe de Elevi'}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
            {isEn ? 'School Classes & Join Codes' : 'Clasele Mele & Coduri de Alăturare'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            {isEn
              ? 'Create classes (e.g. 7B), share the join code on the smartboard, and track every student’s real progress.'
              : 'Creează grupe reale (ex: Clasa a VII-a B), proiectează codul pe tablă și urmărește situația fiecărui elev.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <select
              value={selectedSchoolFilter}
              onChange={(e) => setSelectedSchoolFilter(e.target.value)}
              className="min-h-[40px] bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">{isEn ? 'All Schools' : 'Toate Școlile'}</option>
              {schools.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-teal-400 ${loading ? 'animate-spin' : ''}`} />
            <span>{isEn ? 'Refresh' : 'Reîncarcă'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setShowCreateForm((v) => !v);
            }}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{isEn ? 'New Classroom' : 'Creează Clasă Nouă'}</span>
          </button>
        </div>
      </div>

      {/* Create Classroom Inline Form */}
      {showCreateForm && (
        <form
          onSubmit={handleCreateClassroom}
          className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-5 sm:p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-base font-black text-white font-heading">
              {isEn ? 'Create New Classroom Group' : 'Adaugă Clasă / Grupă Nouă'}
            </h4>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
              aria-label="Închide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isEn ? 'Class Name' : 'Denumire Clasă'}
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="ex: Clasa a VII-a B (Grupa 1)"
                className="w-full min-h-[40px] bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isEn ? 'Grade Level' : 'Nivel Studiu'}
              </label>
              <select
                value={newGradeNum}
                onChange={(e) => setNewGradeNum(Number(e.target.value) as 5 | 6 | 7 | 8)}
                className="w-full min-h-[40px] bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value={5}>Clasa a V-a</option>
                <option value={6}>Clasa a VI-a</option>
                <option value={7}>Clasa a VII-a</option>
                <option value={8}>Clasa a VIII-a</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isEn ? 'School' : 'Școală'}
              </label>
              <select
                value={newSchoolId}
                onChange={(e) => setNewSchoolId(e.target.value)}
                className="w-full min-h-[40px] bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {schools.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isEn ? 'Teacher Name & Year' : 'Profesor & An Școlar'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  placeholder="Nume profesor"
                  className="flex-1 min-w-0 min-h-[40px] bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  value={newAcademicYear}
                  onChange={(e) => setNewAcademicYear(e.target.value)}
                  className="w-24 min-h-[40px] bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs font-mono text-white text-center focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
            >
              {isEn ? 'Cancel' : 'Anulează'}
            </button>
            <button
              type="submit"
              disabled={creating}
              className="min-h-[40px] px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              {creating ? 'Se creează...' : isEn ? 'Generate Class & Code' : 'Salvează Clasa & Generează Cod'}
            </button>
          </div>
        </form>
      )}

      {/* Main Split Workspace: Class List (Left) + Selected Class Roster & Analytics (Right) */}
      {loading && classrooms.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin mx-auto mb-2" />
          <p className="text-xs font-mono">Se încarcă clasele...</p>
        </div>
      ) : visibleClassrooms.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-3">
          <GraduationCap className="w-10 h-10 text-emerald-400 mx-auto" />
          <h4 className="text-lg font-black text-white font-heading">
            {isEn ? 'No classes created yet' : 'Nicio clasă creată încă'}
          </h4>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            {isEn
              ? 'Create your first classroom group to get a short join code for your students and unlock deadline assignments.'
              : 'Creează prima ta clasă (ex: Clasa a VI-a A) pentru a genera un cod de alăturare și a putea da teme cu termen limită.'}
          </p>
          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="min-h-[40px] px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isEn ? 'Create First Class' : 'Creează Prima Clasă'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Classrooms Selector */}
          <div className="lg:col-span-4 space-y-2.5">
            {visibleClassrooms.map((cls) => {
              const isSelected = selectedClassroom?.id === cls.id;
              const enrolledCount = students.filter(
                (s) => s.classId === cls.id || (cls.memberIds || []).includes(s.id)
              ).length;
              const activeAssgns = assignments.filter(
                (a) => a.status === 'active' && (a.classId === cls.id || a.classId === 'ALL')
              ).length;

              return (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedClassId(cls.id);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500 ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  } ${cls.archived ? 'opacity-65' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-black text-white font-heading truncate">
                        {cls.name}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 truncate">
                        {formatGradeNumLabel(cls.gradeNum, isEn)} · {schoolNameFor(cls.schoolId)}
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-400 shrink-0 tabular-nums">
                      {cls.code}
                    </span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 tabular-nums">
                    <span>
                      {enrolledCount} {isEn ? 'students' : 'elevi'}
                    </span>
                    <span>
                      {activeAssgns} {isEn ? 'active tasks' : 'teme active'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Selected Classroom Workspace */}
          {selectedClassroom && (
            <div className="lg:col-span-8 space-y-5">
              {/* Classroom Header & Join Code Banner */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
                      <span>{formatGradeNumLabel(selectedClassroom.gradeNum, isEn)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{schoolNameFor(selectedClassroom.schoolId)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{selectedClassroom.academicYear}</span>
                      {selectedClassroom.archived && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-400 font-semibold">Arhivată</span>
                        </>
                      )}
                    </div>
                    <h4 className="text-xl sm:text-2xl font-black text-white font-heading truncate">
                      {selectedClassroom.name}
                    </h4>
                    <div className="text-xs text-slate-400">
                      Profesor: <strong className="text-slate-200">{selectedClassroom.teacherName}</strong>
                    </div>
                  </div>

                  {/* Join Code Box */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3 shrink-0">
                    <div>
                      <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                        {isEn ? 'Student Join Code' : 'Cod Alăturare Elevi'}
                      </div>
                      <div className="text-lg sm:text-xl font-black font-mono text-emerald-400 tracking-wider tabular-nums">
                        {selectedClassroom.code}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopyCode(selectedClassroom.code)}
                        className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center cursor-pointer"
                        title={isEn ? 'Copy Code' : 'Copiază Cod'}
                      >
                        {copiedCode === selectedClassroom.code ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setPosterClass(selectedClassroom);
                        }}
                        className="w-9 h-9 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 flex items-center justify-center cursor-pointer"
                        title={isEn ? 'Project Code on Smartboard' : 'Proiectează Cod pe Tablă / Printează'}
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4 Single-Row KPI Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[11px] text-slate-400">{isEn ? 'Enrolled' : 'Elevi înscriși'}</div>
                    <div className="text-xl font-black text-white font-mono tabular-nums mt-0.5">
                      {rosterAnalytics.roster.length}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[11px] text-slate-400">{isEn ? 'Class GPA' : 'Media Clasei'}</div>
                    <div className="text-xl font-black text-emerald-400 font-mono tabular-nums mt-0.5">
                      {rosterAnalytics.classAvgGrade > 0 ? rosterAnalytics.classAvgGrade.toFixed(2) : '—'}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[11px] text-slate-400">{isEn ? 'Assignments' : 'Progres Teme'}</div>
                    <div className="text-xl font-black text-amber-300 font-mono tabular-nums mt-0.5">
                      {rosterAnalytics.avgAssignmentsPct}%
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[11px] text-slate-400">{isEn ? 'Class XP' : 'XP Total Clasă'}</div>
                    <div className="text-xl font-black text-cyan-300 font-mono tabular-nums mt-0.5">
                      {rosterAnalytics.totalClassXP.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setAddStudentModalOpen(true);
                      }}
                      className="min-h-[38px] px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Add Student' : 'Adaugă Elev în Clasă'}</span>
                    </button>

                    {onOpenAssignmentsForClass && (
                      <button
                        type="button"
                        onClick={() => onOpenAssignmentsForClass(selectedClassroom.id)}
                        className="min-h-[38px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isEn ? 'Assign Homework' : 'Dă o Temă Clasei'}</span>
                      </button>
                    )}

                    {onOpenExportForClass && (
                      <button
                        type="button"
                        onClick={() => onOpenExportForClass(selectedClassroom.id)}
                        className="min-h-[38px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        <Printer className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{isEn ? 'Export Catalog' : 'Catalog & Print'}</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleArchive(selectedClassroom)}
                      className="min-h-[38px] px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span>{selectedClassroom.archived ? 'Dezarhivează' : 'Arhivează'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setConfirmDeleteClass(selectedClassroom)}
                      className="min-h-[38px] px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/70 text-rose-300 border border-rose-800/60 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Delete' : 'Șterge'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Roster Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
                  <h5 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>{isEn ? 'Class Roster & Live Progress' : 'Catalogul Elevilor din Clasă'}</span>
                  </h5>
                  <span className="text-xs text-slate-400 font-mono tabular-nums">
                    {rosterAnalytics.roster.length} {isEn ? 'enrolled' : 'înscriși'}
                  </span>
                </div>

                {rosterAnalytics.roster.length === 0 ? (
                  <div className="p-10 text-center space-y-2 text-slate-400">
                    <p className="text-sm font-semibold text-slate-300">
                      Niciun elev înscris în această clasă încă.
                    </p>
                    <p className="text-xs max-w-md mx-auto">
                      Elevii pot introduce codul <strong className="text-emerald-400 font-mono">{selectedClassroom.code}</strong> din Carnetul Digital sau îi poți adăuga direct din butonul „Adaugă Elev în Clasă”.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                        <tr>
                          <th className="py-3 px-4">Elev</th>
                          <th className="py-3 px-4 text-right">Misiuni</th>
                          <th className="py-3 px-4 text-right">Medie</th>
                          <th className="py-3 px-4 text-right">Teme</th>
                          <th className="py-3 px-4 text-right">XP</th>
                          <th className="py-3 px-4 text-right">Acțiuni</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 text-slate-200">
                        {rosterAnalytics.roster.map((row) => (
                          <tr key={row.student.id} className="hover:bg-slate-800/40 transition">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <span className="text-lg">{row.student.avatar || '🎓'}</span>
                                <div className="min-w-0">
                                  <div className="font-bold text-white truncate">{row.student.username}</div>
                                  <div className="text-[11px] text-slate-400 font-mono">
                                    Serie: {row.streakCurrent} zile · Sandbox: {row.sandboxSolvedCount}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right font-mono tabular-nums">
                              {row.completedMissions}/{row.totalMissions}
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-emerald-300">
                              {row.averageGrade > 0 ? row.averageGrade.toFixed(2) : '—'}
                            </td>
                            <td className="py-3 px-4 text-right font-mono tabular-nums">
                              {row.assignmentsTotal > 0
                                ? `${row.assignmentsCompleted}/${row.assignmentsTotal} (${row.assignmentsPct}%)`
                                : '—'}
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-bold text-amber-300 tabular-nums">
                              {row.totalXP.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    sounds.playClick();
                                    setInspectingStudent(row.student);
                                  }}
                                  className="min-h-[34px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                                  title="Inspectează și editează scorurile"
                                >
                                  <Sliders className="w-3.5 h-3.5 text-teal-400" />
                                  <span>Scoruri</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveStudent(row.student)}
                                  className="min-h-[34px] min-w-[34px] p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 flex items-center justify-center cursor-pointer"
                                  title="Elimină din clasă"
                                >
                                  <UserMinus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal 1: Poster / Smartboard Join Card */}
      {posterClass && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">
                ArkyEdu · {schoolNameFor(posterClass.schoolId)}
              </span>
              <button
                type="button"
                onClick={() => setPosterClass(null)}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-black text-white font-heading">
                {posterClass.name}
              </h3>
              <p className="text-xs text-slate-400">
                {formatGradeNumLabel(posterClass.gradeNum)} · Prof. {posterClass.teacherName}
              </p>
            </div>

            <div className="bg-slate-950 border-2 border-emerald-500/50 rounded-2xl p-6 space-y-2">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                Cod de Alăturare în Clasă
              </div>
              <div className="text-4xl sm:text-5xl font-black font-mono text-emerald-400 tracking-widest select-all tabular-nums">
                {posterClass.code}
              </div>
            </div>

            <ol className="text-left text-xs sm:text-sm text-slate-300 space-y-2 bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
              <li>1. Deschide platforma <strong>ArkyEdu</strong> pe PC sau telefon.</li>
              <li>2. Intră în <strong>Cont Nou</strong> sau în <strong>Carnetul meu Digital</strong>.</li>
              <li>3. Introdu codul <strong className="font-mono text-emerald-300">{posterClass.code}</strong> pentru a primi automat temele și evaluările clasei.</li>
            </ol>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleCopyCode(posterClass.code)}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
              >
                <Copy className="w-4 h-4 text-emerald-400" />
                <span>{copiedCode === posterClass.code ? 'Copiat!' : 'Copiază Codul'}</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Printează Fișa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Enroll Existing Student */}
      {addStudentModalOpen && selectedClassroom && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-black text-white font-heading">
                  Adaugă elevi în {selectedClassroom.name}
                </h4>
                <p className="text-xs text-slate-400">
                  Selectează elevii cu cont creat pe platformă pentru a-i înscrie instant în grupă.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAddStudentModalOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Caută elev după nume..."
                className="w-full min-h-[40px] bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800 border border-slate-800 rounded-xl">
              {unenrolledOrOtherStudents.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Nu există alți elevi disponibili pentru înscriere.
                </div>
              ) : (
                unenrolledOrOtherStudents.map((st) => (
                  <div
                    key={st.id}
                    className="p-3 flex items-center justify-between gap-3 hover:bg-slate-800/40"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl">{st.avatar || '🎓'}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{st.username}</div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {st.className ? `Momentan în: ${st.className}` : 'Fără clasă atribuită'} · {st.totalXP} XP
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEnrollStudent(st)}
                      className="min-h-[34px] px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 cursor-pointer"
                    >
                      Înscrie
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Confirm Delete Classroom */}
      {confirmDeleteClass && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h4 className="text-lg font-black text-white font-heading">
              Ștergi clasa „{confirmDeleteClass.name}”?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Conturile și notele elevilor rămân intacte, dar grupa și codul <strong className="font-mono">{confirmDeleteClass.code}</strong> vor fi eliminate.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteClass(null)}
                className="min-h-[38px] px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Anulează
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="min-h-[38px] px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
              >
                Șterge Clasa
              </button>
            </div>
          </div>
        </div>
      )}

      {inspectingStudent && (
        <TeacherScoreModal
          student={inspectingStudent}
          onClose={() => setInspectingStudent(null)}
          onSuccess={() => {
            setInspectingStudent(null);
            loadData();
          }}
        />
      )}
    </div>
  );
};
