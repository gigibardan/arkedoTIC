import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert,
  Building2, 
  Users, 
  Award, 
  Gamepad2, 
  FileText, 
  Swords, 
  Settings, 
  LogOut, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  Search, 
  Lock, 
  Unlock, 
  KeyRound, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Coins,
  ChevronRight,
  School as SchoolIcon,
  UserCheck,
  UserX,
  Sliders,
  Database
} from 'lucide-react';
import { 
  School, 
  Teacher, 
  SuperAdminUser, 
  StudentProfile, 
  ArcadeScores, 
  LessonsProgress 
} from '../../types';
import { 
  signInSuperAdmin, 
  signOutSuperAdmin, 
  getCurrentSuperAdminSession,
  getAllSchools,
  createSchool,
  updateSchool,
  deleteSchool,
  getAllTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  updateArcadeScoreSuperAdmin,
  updateLessonProgressSuperAdmin,
  adjustStudentXPAndCoinsSuperAdmin,
  toggleStudentSuspensionSuperAdmin,
  transferStudentSchoolSuperAdmin,
  updateSubmissionSuperAdmin,
  getAllActiveDuelRooms,
  forceCloseDuelRoom,
  ActiveDuelRoom,
  PRIMARY_SUPERADMIN_EMAIL
} from '../../lib/superadminService';
import { 
  getAllStudents, 
  deleteStudentAccount, 
  recalculateStudentXP,
  ARCADE_GAME_KEYS
} from '../../lib/studentAuthService';
import { 
  getStudentResults, 
  deleteStudentResult, 
  deleteAllResultsByStudentName, 
  purgeZeroSecondGhostResults,
  StudentResult 
} from '../../lib/resultsService';
import { isCloudConnected } from '../../lib/firebase';
import { sounds } from '../../utils/audio';

interface SuperAdminDashboardProps {
  onBackToHome: () => void;
  onOpenTeacherPortal?: () => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ 
  onBackToHome,
  onOpenTeacherPortal 
}) => {
  // Auth state
  const [session, setSession] = useState<SuperAdminUser | null>(() => getCurrentSuperAdminSession());
  const [emailInput, setEmailInput] = useState<string>(PRIMARY_SUPERADMIN_EMAIL);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'schools' | 'teachers' | 'students' | 'scores' | 'submissions' | 'duels' | 'settings'>('overview');

  // Data states
  const [schools, setSchools] = useState<School[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [submissions, setSubmissions] = useState<StudentResult[]>([]);
  const [duelRooms, setDuelRooms] = useState<ActiveDuelRoom[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Search & Filter
  const [searchStudentQuery, setSearchStudentQuery] = useState<string>('');
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>('all');
  const [searchSubmissionQuery, setSearchSubmissionQuery] = useState<string>('');

  // Selected Student for Score Editing
  const [selectedStudentForScores, setSelectedStudentForScores] = useState<StudentProfile | null>(null);
  const [editingScoreGame, setEditingScoreGame] = useState<string>('typing');
  const [newScoreVal, setNewScoreVal] = useState<number>(0);

  // School creation modal state
  const [showAddSchoolModal, setShowAddSchoolModal] = useState<boolean>(false);
  const [newSchoolName, setNewSchoolName] = useState<string>('');
  const [newSchoolCode, setNewSchoolCode] = useState<string>('');
  const [newSchoolCity, setNewSchoolCity] = useState<string>('');

  // Teacher creation modal state
  const [showAddTeacherModal, setShowAddTeacherModal] = useState<boolean>(false);
  const [newTeacherName, setNewTeacherName] = useState<string>('');
  const [newTeacherEmail, setNewTeacherEmail] = useState<string>('');
  const [newTeacherSchoolId, setNewTeacherSchoolId] = useState<string>('');

  // Submission Edit Modal
  const [editingSubmission, setEditingSubmission] = useState<StudentResult | null>(null);
  const [newSubmissionScore, setNewSubmissionScore] = useState<number>(0);
  const [newSubmissionPercentage, setNewSubmissionPercentage] = useState<number>(0);

  const showNotification = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  const loadAllDashboardData = async () => {
    setLoadingData(true);
    try {
      const [schoolsData, teachersData, studentsData, subsData, duelsData] = await Promise.all([
        getAllSchools(),
        getAllTeachers(),
        getAllStudents(),
        getStudentResults(),
        getAllActiveDuelRooms()
      ]);
      setSchools(schoolsData);
      setTeachers(teachersData);
      setStudents(studentsData);
      setSubmissions(subsData);
      setDuelRooms(duelsData);
    } catch (err) {
      console.warn('Error fetching superadmin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadAllDashboardData();
    }
  }, [session]);

  // LOGIN HANDLER
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await signInSuperAdmin(emailInput, passwordInput);
      if (res.isAuthenticated && res.user) {
        setSession(res.user);
        sounds.playCorrect();
      } else {
        setAuthError(res.error || 'Autentificare eșuată.');
        sounds.playWrong();
      }
    } catch (err: any) {
      setAuthError(err.message || 'Eroare necunoscută la autentificare.');
      sounds.playWrong();
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOutSuperAdmin();
    setSession(null);
    sounds.playClick();
  };

  /* ==========================================================
     SCHOOL HANDLERS
     ========================================================== */
  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName || !newSchoolCode) return;
    try {
      await createSchool({
        name: newSchoolName.trim(),
        code: newSchoolCode.trim().toUpperCase(),
        city: newSchoolCity.trim() || 'România',
        active: true
      });
      setShowAddSchoolModal(false);
      setNewSchoolName('');
      setNewSchoolCode('');
      setNewSchoolCity('');
      sounds.playCorrect();
      showNotification('Școala a fost înregistrată cu succes!');
      await loadAllDashboardData();
    } catch {
      sounds.playWrong();
    }
  };

  const handleDeleteSchool = async (schoolId: string, name: string) => {
    if (window.confirm(`Sigur doriți să ștergeți școala "${name}"? Profesorii și elevii asociați își vor păstra conturile.`)) {
      await deleteSchool(schoolId);
      sounds.playClick();
      showNotification(`Școala "${name}" a fost eliminată.`);
      await loadAllDashboardData();
    }
  };

  /* ==========================================================
     TEACHER HANDLERS
     ========================================================== */
  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName || !newTeacherEmail) return;
    try {
      const targetSchool = schools.find(s => s.id === newTeacherSchoolId);
      await createTeacher({
        name: newTeacherName.trim(),
        email: newTeacherEmail.trim().toLowerCase(),
        schoolId: newTeacherSchoolId || 'scoala_pilot_01',
        schoolName: targetSchool ? targetSchool.name : 'Școală Nespecificată',
        role: 'teacher',
        approved: true
      });
      setShowAddTeacherModal(false);
      setNewTeacherName('');
      setNewTeacherEmail('');
      sounds.playCorrect();
      showNotification('Contul de profesor a fost adăugat cu succes!');
      await loadAllDashboardData();
    } catch {
      sounds.playWrong();
    }
  };

  const handleToggleTeacherApproved = async (teacher: Teacher) => {
    const updated = !teacher.approved;
    await updateTeacher(teacher.id, { approved: updated });
    sounds.playClick();
    showNotification(`Stare profesor actualizată: ${updated ? 'Aprobat' : 'Suspendat'}`);
    await loadAllDashboardData();
  };

  const handleDeleteTeacher = async (teacherId: string, name: string) => {
    if (window.confirm(`Sigur doriți să ștergeți profesorul "${name}"?`)) {
      await deleteTeacher(teacherId);
      sounds.playClick();
      showNotification(`Profesorul "${name}" a fost șters.`);
      await loadAllDashboardData();
    }
  };

  /* ==========================================================
     STUDENT MANAGEMENT HANDLERS
     ========================================================== */
  const handleToggleStudentSuspension = async (student: StudentProfile) => {
    const willSuspend = !student.isSuspended;
    const ok = await toggleStudentSuspensionSuperAdmin(student.id, willSuspend);
    if (ok) {
      sounds.playClick();
      showNotification(`Contul ${student.username} este acum ${willSuspend ? 'SUSPENDAT' : 'ACTIV'}`);
      await loadAllDashboardData();
    }
  };

  const handleDeleteStudentGlobal = async (student: StudentProfile) => {
    if (window.confirm(`ATENȚIE SUPERADMIN: Sigur doriți să ștergeți DEFINITIV contul elevului "${student.username}" și TOATE submisiile sale din catalog?`)) {
      await deleteStudentAccount(student.id, student.username);
      await deleteAllResultsByStudentName(student.username);
      sounds.playCorrect();
      showNotification(`Contul "${student.username}" și submisiile sale au fost șterse.`);
      await loadAllDashboardData();
    }
  };

  const handleTransferStudentSchool = async (studentId: string, newSchoolId: string) => {
    const ok = await transferStudentSchoolSuperAdmin(studentId, newSchoolId);
    if (ok) {
      sounds.playCorrect();
      const targetSchool = schools.find(s => s.id === newSchoolId);
      showNotification(`Elevul a fost transferat la școala "${targetSchool?.name || newSchoolId}"!`);
      const updatedList = await getAllStudents();
      setStudents(updatedList);
    } else {
      sounds.playWrong();
    }
  };

  /* ==========================================================
     SCORE CONTROL HANDLERS
     ========================================================== */
  const handleApplyArcadeScore = async () => {
    if (!selectedStudentForScores) return;
    const ok = await updateArcadeScoreSuperAdmin(
      selectedStudentForScores.id, 
      editingScoreGame as keyof ArcadeScores, 
      Number(newScoreVal)
    );
    if (ok) {
      sounds.playCorrect();
      showNotification(`Scor actualizat la jocul "${editingScoreGame}" pentru ${selectedStudentForScores.username}!`);
      const updatedList = await getAllStudents();
      setStudents(updatedList);
      const freshlySelected = updatedList.find(s => s.id === selectedStudentForScores.id);
      if (freshlySelected) setSelectedStudentForScores(freshlySelected);
    } else {
      sounds.playWrong();
    }
  };

  const handleAdjustBonusXPAndCoins = async (xpDelta: number, coinsDelta: number) => {
    if (!selectedStudentForScores) return;
    const ok = await adjustStudentXPAndCoinsSuperAdmin(
      selectedStudentForScores.id, 
      xpDelta, 
      coinsDelta
    );
    if (ok) {
      sounds.playCorrect();
      showNotification(`Ajustare aplicată: ${xpDelta >= 0 ? '+' : ''}${xpDelta} XP, ${coinsDelta >= 0 ? '+' : ''}${coinsDelta} Monede`);
      const updatedList = await getAllStudents();
      setStudents(updatedList);
      const freshlySelected = updatedList.find(s => s.id === selectedStudentForScores.id);
      if (freshlySelected) setSelectedStudentForScores(freshlySelected);
    }
  };

  const handleRecalculateXP = async () => {
    if (!selectedStudentForScores) return;
    const newXP = await recalculateStudentXP(selectedStudentForScores.id);
    sounds.playCorrect();
    showNotification(`XP-ul a fost recalculat curat: ${newXP} XP.`);
    const updatedList = await getAllStudents();
    setStudents(updatedList);
    const freshlySelected = updatedList.find(s => s.id === selectedStudentForScores.id);
    if (freshlySelected) setSelectedStudentForScores(freshlySelected);
  };

  /* ==========================================================
     SUBMISSION EDIT HANDLERS
     ========================================================== */
  const handleSaveEditedSubmission = async () => {
    if (!editingSubmission) return;
    const ok = await updateSubmissionSuperAdmin(editingSubmission.id!, {
      score: Number(newSubmissionScore)
    });
    if (ok) {
      sounds.playCorrect();
      showNotification('Submisia a fost actualizată în catalog!');
      setEditingSubmission(null);
      await loadAllDashboardData();
    } else {
      sounds.playWrong();
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    if (window.confirm('Ștergeți această submisie din catalog?')) {
      await deleteStudentResult(id);
      sounds.playClick();
      showNotification('Submisia a fost ștearsă.');
      await loadAllDashboardData();
    }
  };

  const handlePurgeGhosts = async () => {
    if (window.confirm('Goliți TOATE testele fantomă de 0 secunde sau fără punctaj valid?')) {
      await purgeZeroSecondGhostResults();
      sounds.playCorrect();
      showNotification('Testele fantomă au fost curățate!');
      await loadAllDashboardData();
    }
  };

  /* ==========================================================
     DUEL HANDLERS
     ========================================================== */
  const handleForceCloseDuel = async (roomId: string) => {
    const ok = await forceCloseDuelRoom(roomId);
    if (ok) {
      sounds.playClick();
      showNotification(`Camera de duel ${roomId} a fost forțat închisă.`);
      const updated = await getAllActiveDuelRooms();
      setDuelRooms(updated);
    }
  };

  // If not logged in as Superadmin, show the authenticated Firebase login form
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle glowing badge */}
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Înapoi acasă
            </button>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Role: SuperAdmin
            </span>
          </div>

          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 mb-3">
              <ShieldCheck className="w-9 h-9 text-slate-950" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Arkedo Superadmin
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Acces securizat la administrarea centrală a școlilor, profesorilor, elevilor și scorurilor.
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email Administrator
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Gheorghe.Bardan@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Parolă
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {authLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Verificare Identitate...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" /> Autentificare Securizată
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Securizat prin Firebase Identity Platform & RBAC Rules
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Filtered students
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.username.toLowerCase().includes(searchStudentQuery.toLowerCase());
    const matchesSchool = selectedSchoolFilter === 'all' || s.schoolId === selectedSchoolFilter;
    return matchesSearch && matchesSchool;
  });

  // Filtered submissions
  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = (sub.studentName || '').toLowerCase().includes(searchSubmissionQuery.toLowerCase()) ||
           (sub.courseTitle || '').toLowerCase().includes(searchSubmissionQuery.toLowerCase());
    const matchesSchool = selectedSchoolFilter === 'all' || (sub.schoolId || 'scoala_pilot_01') === selectedSchoolFilter;
    return matchesSearch && matchesSchool;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* TOP HEADER */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Înapoi în aplicație"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-wide bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">
                ARKEDO SUPERADMIN
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                MASTER CONTROL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Control centralizat: Școli, Profesori, Elevi & Baza de Date
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Cross-School Switcher */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs">
            <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-slate-400 text-[11px] font-semibold">Vizualizare:</span>
            <select
              value={selectedSchoolFilter}
              onChange={(e) => setSelectedSchoolFilter(e.target.value)}
              className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer text-xs"
            >
              <option value="all" className="bg-slate-900 text-white">Toate Școlile (Acces Global)</option>
              {schools.map(s => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                  {s.name} ({s.city})
                </option>
              ))}
            </select>
          </div>

          {onOpenTeacherPortal && (
            <button
              onClick={onOpenTeacherPortal}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            >
              <SchoolIcon className="w-3.5 h-3.5 text-cyan-400" />
              Panou Profesor
            </button>
          )}

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate max-w-[120px] sm:max-w-none">{session.email}</span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
            title="Deconectare Superadmin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* NOTIFICATION TOAST */}
      {actionSuccessMsg && (
        <div className="bg-emerald-500/90 text-slate-950 font-bold text-xs py-2 px-4 text-center sticky top-[57px] z-50 shadow-md flex items-center justify-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* SIDEBAR TABS */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/40 p-2 sm:p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp className="w-4 h-4 flex-shrink-0" /> Prezentare Generală
          </button>

          <button
            onClick={() => setActiveTab('schools')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'schools'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
            }`}
          >
            <Building2 className="w-4 h-4 flex-shrink-0" /> Școli ({schools.length})
          </button>

          <button
            onClick={() => setActiveTab('teachers')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'teachers'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-4 h-4 flex-shrink-0" /> Profesori ({teachers.length})
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'students'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
            }`}
          >
            <UserCheck className="w-4 h-4 flex-shrink-0" /> Elevi ({students.length})
          </button>

          <button
            onClick={() => setActiveTab('scores')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'scores'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
            }`}
          >
            <Gamepad2 className="w-4 h-4 flex-shrink-0" /> Control Scoruri & XP
          </button>

          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'submissions'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4 flex-shrink-0" /> Catalog & Submisii ({submissions.length})
          </button>

          <button
            onClick={() => setActiveTab('duels')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'duels'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
            }`}
          >
            <Swords className="w-4 h-4 flex-shrink-0" /> Dueluri Live ({duelRooms.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
            }`}
          >
            <Sliders className="w-4 h-4 flex-shrink-0" /> Setări Globale
          </button>

          <div className="mt-auto hidden md:block pt-4 border-t border-slate-800">
            <button
              onClick={loadAllDashboardData}
              disabled={loadingData}
              className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
              Reîmprospătează datele
            </button>
          </div>
        </aside>

        {/* CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  Tablou de Bord Superadmin
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Stare globală a platformei Arkedo, fără a fi nevoie de acces manual în consola Firebase.
                </p>
              </div>

              {/* STATS CARDS */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Școli Înregistrate</span>
                    <Building2 className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{schools.length}</div>
                  <p className="text-[10px] text-slate-500 mt-1">Instituții partenere</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Profesori Activi</span>
                    <Users className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{teachers.length}</div>
                  <p className="text-[10px] text-slate-500 mt-1">Cadre didactice aprobate</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Elevi Înregistrați</span>
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{students.length}</div>
                  <p className="text-[10px] text-slate-500 mt-1">Profiluri cu XP & inventar</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Teste Submise</span>
                    <FileText className="w-4 h-4 text-violet-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{submissions.length}</div>
                  <p className="text-[10px] text-slate-500 mt-1">Note salvate în catalog</p>
                </div>
              </div>

              {/* QUICK ACTIONS */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Acțiuni Administrative Rapide
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => { setActiveTab('schools'); setShowAddSchoolModal(true); }}
                    className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5 text-amber-400" /> Adaugă Școală Nouă
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Creează cod de acces pentru o nouă instituție</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('scores')}
                    className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" /> Modifică Scor Elev
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Ajustează punctajul oricărui mini-joc din cele 19</p>
                  </button>

                  <button
                    onClick={handlePurgeGhosts}
                    className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" /> Curăță Teste Fantomă
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Șterge submisiile de 0 secunde sau nesalvate</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCHOOLS */}
          {activeTab === 'schools' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-400" />
                    Gestiune Școli & Parteneriate
                  </h2>
                  <p className="text-xs text-slate-400">
                    Fiecare școală are un cod unic pentru profesori și elevi.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddSchoolModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Adaugă Școală
                </button>
              </div>

              {/* SCHOOLS TABLE */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800/50 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">Nume Școală</th>
                        <th className="p-3.5">Cod Unic</th>
                        <th className="p-3.5">Oraș</th>
                        <th className="p-3.5">Profesori</th>
                        <th className="p-3.5">Stare</th>
                        <th className="p-3.5 text-right">Acțiuni</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200">
                      {schools.map(school => {
                        const teacherCount = teachers.filter(t => t.schoolId === school.id).length;
                        return (
                          <tr key={school.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="p-3.5 font-semibold text-white flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                              <span>{school.name}</span>
                            </td>
                            <td className="p-3.5 font-mono text-amber-300 font-bold">
                              {school.code}
                            </td>
                            <td className="p-3.5 text-slate-300">{school.city}</td>
                            <td className="p-3.5">{teacherCount} profesori</td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                school.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                              }`}>
                                {school.active ? 'Activă' : 'Inactivă'}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => handleDeleteSchool(school.id, school.name)}
                                className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-rose-500/10 transition-colors"
                                title="Șterge școală"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {schools.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-500">
                            Nu există încă școli înregistrate. Adăugați prima școală folosind butonul de mai sus.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TEACHERS */}
          {activeTab === 'teachers' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    Gestiune Profesori & Permisiuni
                  </h2>
                  <p className="text-xs text-slate-400">
                    Aprobați sau suspendați accesul cadrelor didactice la catalogul școlii.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddTeacherModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Adaugă Profesor
                </button>
              </div>

              {/* TEACHERS TABLE */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800/50 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">Profesor</th>
                        <th className="p-3.5">Email</th>
                        <th className="p-3.5">Școală Asociată</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Acțiuni</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200">
                      {teachers.map(teacher => (
                        <tr key={teacher.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-3.5 font-semibold text-white flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                            <span>{teacher.name}</span>
                          </td>
                          <td className="p-3.5 font-mono text-slate-300">{teacher.email}</td>
                          <td className="p-3.5 text-slate-300">{teacher.schoolName || 'Nespecificată'}</td>
                          <td className="p-3.5">
                            <button
                              onClick={() => handleToggleTeacherApproved(teacher)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                                teacher.approved 
                                  ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' 
                                  : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                              }`}
                            >
                              {teacher.approved ? 'Aprobat' : 'Suspendat'}
                            </button>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => handleDeleteTeacher(teacher.id, teacher.name)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-rose-500/10 transition-colors"
                              title="Șterge profesor"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STUDENTS */}
          {activeTab === 'students' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-emerald-400" />
                    Director Global Elevi ({filteredStudents.length})
                  </h2>
                  <p className="text-xs text-slate-400">
                    Căutați, suspendați conturi cu nume nepotrivite sau ștergeți utilizatori din baza de date.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Căutare după nume..."
                      value={searchStudentQuery}
                      onChange={(e) => setSearchStudentQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* STUDENTS TABLE */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800/50 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">Elev</th>
                        <th className="p-3.5">Școală / Transfer</th>
                        <th className="p-3.5">Total XP</th>
                        <th className="p-3.5">Monede</th>
                        <th className="p-3.5">Stare Cont</th>
                        <th className="p-3.5 text-right">Acțiuni Superadmin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200">
                      {filteredStudents.map(student => (
                        <tr key={student.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-3.5 flex items-center gap-2.5">
                            <span className="text-lg">{student.avatar || '🎓'}</span>
                            <div>
                              <span className="font-bold text-white block">{student.username}</span>
                              <span className="text-[10px] text-slate-500 font-mono">ID: {student.id.slice(0, 10)}...</span>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <select
                              value={student.schoolId || 'scoala_pilot_01'}
                              onChange={(e) => handleTransferStudentSchool(student.id, e.target.value)}
                              className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer max-w-[160px] truncate"
                              title="Transferă elevul la altă școală"
                            >
                              {schools.map(s => (
                                <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                                  {s.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-3.5 font-bold text-amber-300">
                            {student.totalXP || 0} XP
                          </td>
                          <td className="p-3.5 font-semibold text-cyan-300">
                            {student.byteCoins || 0} 🪙
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              student.isSuspended ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              {student.isSuspended ? 'Suspendat' : 'Activ'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right space-x-1">
                            <button
                              onClick={() => {
                                setSelectedStudentForScores(student);
                                setActiveTab('scores');
                              }}
                              className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-[11px] transition-colors"
                              title="Editare scoruri și jocuri"
                            >
                              Scoruri
                            </button>
                            <button
                              onClick={() => handleToggleStudentSuspension(student)}
                              className={`p-1 rounded text-xs transition-colors ${
                                student.isSuspended 
                                  ? 'text-emerald-400 hover:bg-emerald-500/10' 
                                  : 'text-amber-400 hover:bg-amber-500/10'
                              }`}
                              title={student.isSuspended ? 'Reactivează cont' : 'Blochează cont'}
                            >
                              {student.isSuspended ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleDeleteStudentGlobal(student)}
                              className="p-1 text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                              title="Șterge definitiv elevul"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredStudents.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-500">
                            Niciun elev găsit conform filtrelor selectate.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SCORES & XP MASTER CONTROL */}
          {activeTab === 'scores' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-amber-400" />
                  Control Total Scoruri Arcade & Lecții TIC
                </h2>
                <p className="text-xs text-slate-400">
                  Selectați un elev pentru a corecta direct notele la oricare din cele 19 jocuri sau 14 module de curs.
                </p>
              </div>

              {/* STUDENT PICKER */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                <span className="text-xs font-semibold text-slate-300">Selectează Elevul:</span>
                <select
                  value={selectedStudentForScores?.id || ''}
                  onChange={(e) => {
                    const found = students.find(s => s.id === e.target.value);
                    setSelectedStudentForScores(found || null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500 flex-1"
                >
                  <option value="">-- Alege un elev din listă --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.username} ({s.totalXP || 0} XP)
                    </option>
                  ))}
                </select>
              </div>

              {selectedStudentForScores ? (
                <div className="space-y-6">
                  {/* STUDENT BANNER */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-slate-900 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{selectedStudentForScores.avatar || '🎓'}</span>
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          {selectedStudentForScores.username}
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-normal">
                            {selectedStudentForScores.totalXP} Total XP
                          </span>
                        </h3>
                        <p className="text-xs text-slate-400">
                          Arcade: {selectedStudentForScores.arcadeScores?.totalArcade || 0} XP | Lecții TIC: {selectedStudentForScores.lessonsProgress?.totalLessonScore || 0} XP | Monede: {selectedStudentForScores.byteCoins || 0} 🪙
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAdjustBonusXPAndCoins(100, 20)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold transition-colors"
                      >
                        +100 XP / +20 🪙
                      </button>
                      <button
                        onClick={handleRecalculateXP}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Recalculează XP corect pe baza jocurilor și testelor"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Recalculează
                      </button>
                    </div>
                  </div>

                  {/* ARCADE GAMES GRID */}
                  <div>
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <Gamepad2 className="w-4 h-4 text-cyan-400" />
                      Scoruri Cele 19 Mini-Jocuri Arcade
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {ARCADE_GAME_KEYS.map(gameKey => {
                        const currentVal = (selectedStudentForScores.arcadeScores as any)?.[gameKey] || 0;
                        return (
                          <div 
                            key={gameKey}
                            className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
                          >
                            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wide truncate">
                              {gameKey.replace('_', ' ')}
                            </span>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-base font-bold text-amber-300">{currentVal}</span>
                              <button
                                onClick={() => {
                                  const prompted = window.prompt(`Introdu noul scor pentru jocul "${gameKey}":`, currentVal.toString());
                                  if (prompted !== null) {
                                    const num = parseInt(prompted, 10);
                                    if (!isNaN(num)) {
                                      updateArcadeScoreSuperAdmin(selectedStudentForScores.id, gameKey as keyof ArcadeScores, num)
                                        .then(() => {
                                          sounds.playCorrect();
                                          showNotification(`Scor salvat pentru ${gameKey}!`);
                                          getAllStudents().then(list => {
                                            setStudents(list);
                                            const updated = list.find(s => s.id === selectedStudentForScores.id);
                                            if (updated) setSelectedStudentForScores(updated);
                                          });
                                        });
                                    }
                                  }
                                }}
                                className="p-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-400 transition-colors"
                                title="Editează scor"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800/80">
                  Selectează un elev din meniul de mai sus pentru a vizualiza și edita matricea de scoruri.
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SUBMISSIONS & GRADEBOOK */}
          {activeTab === 'submissions' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-violet-400" />
                    Catalog Global Submisii ({filteredSubmissions.length})
                  </h2>
                  <p className="text-xs text-slate-400">
                    Modificați direct orice notă trimisă greșit sau ștergeți teste invalidate.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Filtrează după elev..."
                      value={searchSubmissionQuery}
                      onChange={(e) => setSearchSubmissionQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <button
                    onClick={handlePurgeGhosts}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Curăță Fantome
                  </button>
                </div>
              </div>

              {/* SUBMISSIONS TABLE */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800/50 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">Elev</th>
                        <th className="p-3.5">Misiune / Test</th>
                        <th className="p-3.5">Punctaj</th>
                        <th className="p-3.5">Procent</th>
                        <th className="p-3.5">Data Trimiterii</th>
                        <th className="p-3.5 text-right">Acțiuni</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200">
                      {filteredSubmissions.map(sub => (
                        <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-3.5 font-bold text-white">{sub.studentName}</td>
                          <td className="p-3.5 text-slate-300 font-medium">{sub.courseTitle}</td>
                          <td className="p-3.5 font-bold text-amber-300">{sub.score} / {sub.maxScore || 100}</td>
                          <td className="p-3.5 font-semibold text-emerald-400">
                            {sub.maxScore > 0 ? Math.round((sub.score / sub.maxScore) * 100) : 100}%
                          </td>
                          <td className="p-3.5 text-slate-400 font-mono text-[11px]">{sub.dateFormatted || 'N/A'}</td>
                          <td className="p-3.5 text-right space-x-1">
                            <button
                              onClick={() => {
                                setEditingSubmission(sub);
                                setNewSubmissionScore(sub.score);
                                const pct = sub.maxScore > 0 ? Math.round((sub.score / sub.maxScore) * 100) : 100;
                                setNewSubmissionPercentage(pct);
                              }}
                              className="p-1 text-slate-400 hover:text-amber-300 rounded hover:bg-slate-800 transition-colors"
                              title="Modifică nota"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSubmission(sub.id!)}
                              className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                              title="Șterge submisie"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: LIVE DUELS */}
          {activeTab === 'duels' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Swords className="w-5 h-5 text-amber-400" />
                    Monitorizare Dueluri Multiplayer 1v1
                  </h2>
                  <p className="text-xs text-slate-400">
                    Săli de duel active în timp real. Puteți închide camere abandonate sau blocate.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {duelRooms.map(room => (
                  <div key={room.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-300">#{room.roomCode}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {room.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 space-y-1">
                      <div><strong className="text-slate-400">Gazdă:</strong> {room.hostName}</div>
                      <div><strong className="text-slate-400">Oaspete:</strong> {room.guestName || 'Așteaptă jucător...'}</div>
                      <div><strong className="text-slate-400">Mod joc:</strong> {room.mode}</div>
                    </div>
                    <button
                      onClick={() => handleForceCloseDuel(room.id)}
                      className="w-full py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/30 transition-colors"
                    >
                      Forțează Închiderea Camerei
                    </button>
                  </div>
                ))}
                {duelRooms.length === 0 && (
                  <div className="col-span-full p-8 text-center text-slate-500 bg-slate-900 rounded-xl border border-slate-800">
                    Nicio cameră de duel activă în acest moment.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 8: GLOBAL SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-xl space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-400" />
                  Setări Globale & Securitate
                </h2>
                <p className="text-xs text-slate-400">
                  Comutatoare administrative la nivel de platformă.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Stare Conexiune Cloud</h4>
                    <p className="text-[11px] text-slate-400">Sincronizare cu Firebase Firestore</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    isCloudConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {isCloudConnected ? 'Cloud Online' : 'Mod Securizat'}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-white mb-1">Superadmin Principal Desemnat</h4>
                  <p className="text-xs font-mono text-amber-300">{PRIMARY_SUPERADMIN_EMAIL}</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: ADD SCHOOL */}
      {showAddSchoolModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" /> Adăugare Școală Nouă
            </h3>
            <form onSubmit={handleCreateSchool} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nume Școală / Liceu</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Liceul Tehnologic „Spiru Haret”"
                  value={newSchoolName}
                  onChange={(e) => setNewSchoolName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Cod Identificator Unic</label>
                <input
                  type="text"
                  required
                  placeholder="ex: SPIRU-01"
                  value={newSchoolCode}
                  onChange={(e) => setNewSchoolCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white uppercase focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Oraș / Localitate</label>
                <input
                  type="text"
                  placeholder="ex: București"
                  value={newSchoolCity}
                  onChange={(e) => setNewSchoolCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSchoolModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Salvează Școala
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD TEACHER */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" /> Înregistrare Profesor
            </h3>
            <form onSubmit={handleCreateTeacher} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nume și Prenume</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Prof. Maria Ionescu"
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Adresă de Email</label>
                <input
                  type="email"
                  required
                  placeholder="ex: maria.ionescu@scoala.ro"
                  value={newTeacherEmail}
                  onChange={(e) => setNewTeacherEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Școală Asociată</label>
                <select
                  value={newTeacherSchoolId}
                  onChange={(e) => setNewTeacherSchoolId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">-- Alege școala --</option>
                  {schools.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  Adaugă Profesor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT SUBMISSION */}
      {editingSubmission && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-amber-400" /> Modifică Nota Submiterii
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Elev: <strong className="text-white">{editingSubmission.studentName}</strong> ({editingSubmission.courseTitle})
            </p>
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Punctaj Obținut</label>
                <input
                  type="number"
                  value={newSubmissionScore}
                  onChange={(e) => {
                    const score = Number(e.target.value);
                    setNewSubmissionScore(score);
                    const max = editingSubmission.maxScore || 100;
                    if (max > 0) {
                      setNewSubmissionPercentage(Math.round((score / max) * 100));
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Procentaj Calculat (%)</label>
                <input
                  type="number"
                  value={newSubmissionPercentage}
                  onChange={(e) => setNewSubmissionPercentage(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSubmission(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                >
                  Anulează
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditedSubmission}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Salvează Nota
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
