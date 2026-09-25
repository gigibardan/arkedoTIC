import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  KeyRound, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  RefreshCw, 
  Trophy, 
  Sparkles, 
  ShieldCheck, 
  GraduationCap, 
  Clock, 
  Gamepad2,
  AlertCircle,
  Sliders,
  AlertTriangle,
  Swords,
  BookOpen,
  Award
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { 
  getAllStudents, 
  updateStudentUsernameByTeacher, 
  resetStudentPassword, 
  deleteStudentAccount 
} from '../lib/studentAuthService';
import { StudentProfile } from '../types';
import { sounds } from '../utils/audio';
import { TeacherScoreModal } from './TeacherScoreModal';

export const TeacherStudentManagement: React.FC = () => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Editing username modal/inline state
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [newUsernameInput, setNewUsernameInput] = useState<string>('');
  const [renameError, setRenameError] = useState<string | null>(null);
  const [renameSuccess, setRenameSuccess] = useState<string | null>(null);

  // Score Inspector Modal state
  const [selectedStudentForScores, setSelectedStudentForScores] = useState<StudentProfile | null>(null);

  // Resetting password modal state
  const [resettingStudent, setResettingStudent] = useState<StudentProfile | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  // Deleting student
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchStudents = async () => {
    setLoading(true);
    const list = await getAllStudents();
    // Sort descending by totalXP
    list.sort((a, b) => (b.totalXP || 0) - (a.totalXP || 0));
    setStudents(list);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleStartRename = (student: StudentProfile) => {
    setEditingStudentId(student.id || null);
    setNewUsernameInput(student.username);
    setRenameError(null);
    setRenameSuccess(null);
  };

  const handleSaveRename = async (studentId: string) => {
    if (!newUsernameInput.trim()) return;
    const res = await updateStudentUsernameByTeacher(studentId, newUsernameInput.trim());
    if (res.success) {
      setRenameSuccess(isEn ? 'Username successfully changed!' : 'Nume de utilizator modificat!');
      setEditingStudentId(null);
      sounds.playCorrect();
      fetchStudents();
    } else {
      setRenameError(res.error || (isEn ? 'Failed to update username' : 'Eroare la modificare'));
      sounds.playWrong();
    }
  };

  const handleStartResetPassword = (student: StudentProfile) => {
    setResettingStudent(student);
    setNewPasswordInput('');
    setResetError(null);
    setResetSuccess(null);
  };

  const handleSaveResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingStudent?.id) return;
    if (newPasswordInput.trim().length < 3) {
      setResetError(isEn ? 'Password must be at least 3 characters' : 'Parola trebuie să aibă minim 3 caractere');
      sounds.playWrong();
      return;
    }

    const res = await resetStudentPassword(resettingStudent.id, newPasswordInput.trim());
    if (res.success) {
      setResetSuccess(
        isEn 
          ? `Password successfully reset for ${resettingStudent.username}!` 
          : `Parola a fost resetată cu succes pentru ${resettingStudent.username}!`
      );
      sounds.playCorrect();
      setTimeout(() => {
        setResettingStudent(null);
        setResetSuccess(null);
      }, 1800);
    } else {
      setResetError(res.error || (isEn ? 'Failed to reset password' : 'Eroare la resetarea parolei'));
      sounds.playWrong();
    }
  };

  const handleDelete = async (studentId?: string, username?: string) => {
    if (!studentId) return;
    const confirmMsg = isEn 
      ? `Are you sure you want to permanently delete account "${username}"?`
      : `Sigur doriți să ștergeți definitiv contul elevului "${username}"?`;
    if (window.confirm(confirmMsg)) {
      setDeletingId(studentId);
      const ok = await deleteStudentAccount(studentId, username);
      if (ok) {
        setStudents((prev) => prev.filter((s) => s.id !== studentId));
        sounds.playClick();
      }
      setDeletingId(null);
    }
  };

  // Flag suspicious scores (Anti-Cheat)
  const suspiciousStudents = students.filter((s) => {
    const arc = s.arcadeScores || {};
    return (
      (arc.typing && arc.typing > 250) ||
      (arc.cyber_dino && arc.cyber_dino > 10000) ||
      (arc.game2048 && arc.game2048 > 100000) ||
      (arc.mouse && arc.mouse > 3000) ||
      (arc.mouse_v2 && arc.mouse_v2 > 3500) ||
      (arc.roblox_clicker && arc.roblox_clicker > 25000) ||
      (s.totalXP > 10000 && (!s.lessonsProgress || Object.keys(s.lessonsProgress).length === 0))
    );
  });

  const filteredStudents = students.filter((s) => 
    s.username.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Action Header & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold font-mono mb-2">
            <Users className="w-3 h-3" />
            <span>{isEn ? 'Student Directory & Score Control' : 'Registru Elevi & Control Total Punctaje'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
            {isEn ? 'Classroom Student Accounts & Anti-Cheat' : 'Conturi Elevi Laborator & Audit Anti-Cheat'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {isEn 
              ? 'Inspect and edit any student score, reset cheated tasks, penalize or award bonuses, and reset passwords.' 
              : 'Verificați și editați scorurile pe elev, corectați trișarea, aplicați penalizări sau acordați bonusuri de merit.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? 'Search student name...' : 'Caută elev după nume...'}
              className="w-full bg-slate-950 border border-slate-700 pl-9 pr-3 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            />
          </div>

          <button
            onClick={fetchStudents}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-teal-400 ${loading ? 'animate-spin' : ''}`} />
            <span>{isEn ? 'Refresh' : 'Actualizează'}</span>
          </button>
        </div>
      </div>

      {/* Anti-Cheat Anomaly Alert Banner if any detected */}
      {suspiciousStudents.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-rose-950/80 border-2 border-rose-500/50 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{isEn ? 'Anti-Cheat Audit: Suspicious Activity Detected' : 'Audit Anti-Cheat: Scoruri Anormale Detectate'}</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-300 text-[10px] font-mono">
                  {suspiciousStudents.length} {isEn ? 'Students Flagged' : 'Elevi suspectați'}
                </span>
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                {isEn 
                  ? 'Unusual speeds or highscores detected (e.g. typing >250 WPM or Cyber Dino >50,000). Click Inspect & Edit on the student to correct.' 
                  : 'Viteze sau punctaje neverosimile detectate (ex. tastare >250 WPM sau Cyber Dino >50.000). Apăsați pe „Inspectează Scoruri” pentru a corecta.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {renameSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{renameSuccess}</span>
        </div>
      )}

      {renameError && (
        <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{renameError}</span>
        </div>
      )}

      {/* Students List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <GraduationCap className="w-4 h-4 text-teal-400" />
            <span>
              {isEn ? `Enrolled Students (${filteredStudents.length})` : `Elevi Înregistrați (${filteredStudents.length})`}
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
            {isEn ? 'Live Firebase Collection: elevi' : 'Baza Firestore: elevi'}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 text-teal-400 animate-spin" />
            <p className="text-xs font-mono">{isEn ? 'Loading student profiles...' : 'Se încarcă profilurile elevilor...'}</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <div className="text-4xl mb-3">🎓</div>
            <p className="text-sm font-semibold max-w-md mx-auto leading-relaxed">
              {searchQuery 
                ? (isEn ? 'No students match your search filter.' : 'Niciun elev nu corespunde căutării.')
                : (isEn ? 'No student accounts registered in the database yet.' : 'Nu există încă niciun elev înregistrat în baza de date.')}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4 font-bold">{isEn ? 'Student / Avatar' : 'Elev / Avatar'}</th>
                  <th className="py-3 px-4 font-bold">{isEn ? 'Total XP' : 'XP Total'}</th>
                  <th className="py-3 px-4 font-bold">{isEn ? 'Arcade Highscore' : 'Scor Jocuri'}</th>
                  <th className="py-3 px-4 font-bold">{isEn ? 'Lessons' : 'Lecții TIC'}</th>
                  <th className="py-3 px-4 font-bold">{isEn ? 'Duels (W/L)' : 'Duel 1v1 (V/Î)'}</th>
                  <th className="py-3 px-4 font-bold text-right">{isEn ? 'Admin & Score Control' : 'Gestiune & Control Scoruri'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {filteredStudents.map((s, idx) => {
                  const isEditingThis = editingStudentId === s.id;
                  const lessonsCount = [
                    s.lessonsProgress?.hardware?.completed,
                    s.lessonsProgress?.files?.completed,
                    s.lessonsProgress?.internet1?.completed,
                    s.lessonsProgress?.internet2?.completed
                  ].filter(Boolean).length;

                  const isSuspicious = suspiciousStudents.some((susp) => susp.id === s.id);

                  return (
                    <tr key={s.id || idx} className={`hover:bg-slate-850/50 transition ${isSuspicious ? 'bg-rose-950/20' : ''}`}>
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4 font-bold text-white">
                        {isEditingThis ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={newUsernameInput}
                              onChange={(e) => setNewUsernameInput(e.target.value)}
                              className="bg-slate-950 border border-teal-500/50 px-2 py-1 rounded text-xs text-white focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveRename(s.id!)}
                              className="p-1 rounded bg-teal-600 hover:bg-teal-500 text-white cursor-pointer"
                              title={isEn ? 'Save' : 'Salvează'}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingStudentId(null)}
                              className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 cursor-pointer"
                              title={isEn ? 'Cancel' : 'Anulează'}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0">
                              {s.avatar || '🎓'}
                            </div>
                            <div>
                              <div className="font-bold text-slate-100 flex items-center gap-1.5">
                                <span>{s.username}</span>
                                {isSuspicious && (
                                  <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono border border-rose-500/40 flex items-center gap-0.5" title="Scoruri suspecte detectate">
                                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                                    <span>Audit</span>
                                  </span>
                                )}
                                <button
                                  onClick={() => handleStartRename(s)}
                                  className="text-slate-500 hover:text-teal-400 transition cursor-pointer p-0.5"
                                  title={isEn ? 'Edit Username' : 'Modifică Nume'}
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                              </div>
                              <div className="text-[10px] font-mono text-slate-500">
                                ID: {s.id?.slice(0, 8)}...
                              </div>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Total XP */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30 text-xs font-mono">
                          <Trophy className="w-3 h-3 text-amber-400" />
                          <span>{s.totalXP || 0} XP</span>
                        </span>
                      </td>

                      {/* Arcade */}
                      <td className="py-3.5 px-4 font-mono text-xs text-indigo-300">
                        <div className="flex items-center gap-1">
                          <Gamepad2 className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{s.arcadeScores?.totalArcade || 0} pct</span>
                        </div>
                      </td>

                      {/* Lessons */}
                      <td className="py-3.5 px-4 font-mono text-xs text-emerald-300">
                        <div className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{lessonsCount}/4 {isEn ? 'Finished' : 'Finalizate'}</span>
                        </div>
                      </td>

                      {/* Duels */}
                      <td className="py-3.5 px-4 font-mono text-xs text-rose-300">
                        <div className="flex items-center gap-1">
                          <Swords className="w-3.5 h-3.5 text-rose-400" />
                          <span>{s.duelStats?.wins || 0}V / {s.duelStats?.losses || 0}Î</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Score Inspector / Editor Modal trigger */}
                          <button
                            onClick={() => {
                              setSelectedStudentForScores(s);
                              sounds.playClick();
                            }}
                            className="px-2.5 py-1 rounded-lg bg-teal-950/60 hover:bg-teal-900/80 text-teal-300 border border-teal-500/40 text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-sm active:scale-95"
                            title={isEn ? 'Inspect & Edit All Scores (Anti-Cheat)' : 'Inspectează & Modifică Toate Scorurile (Anti-Cheat)'}
                          >
                            <Sliders className="w-3 h-3 text-teal-400" />
                            <span>{isEn ? 'Edit Scores' : 'Modifică Scoruri'}</span>
                          </button>

                          <button
                            onClick={() => handleStartResetPassword(s)}
                            className="px-2 py-1 rounded-lg bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                            title={isEn ? 'Reset password for this student' : 'Resetează parola pentru acest elev'}
                          >
                            <KeyRound className="w-3 h-3 text-amber-400" />
                            <span className="hidden xl:inline">{isEn ? 'Pass' : 'Parolă'}</span>
                          </button>

                          <button
                            onClick={() => handleDelete(s.id, s.username)}
                            disabled={deletingId === s.id}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 transition cursor-pointer disabled:opacity-50"
                            title={isEn ? 'Delete student' : 'Șterge cont elev'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Password Reset Modal */}
      {resettingStudent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-7 shadow-2xl max-w-md w-full relative">
            <button
              onClick={() => setResettingStudent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-black text-white font-heading">
                  {isEn ? 'Reset Student Password' : 'Resetare Parolă Elev'}
                </h4>
                <p className="text-xs text-slate-400">
                  {isEn ? 'Set a simple new password for:' : 'Setează o nouă parolă simplă pentru:'}{' '}
                  <strong className="text-amber-300">{resettingStudent.username}</strong>
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveResetPassword} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold">
                  {isEn ? 'New Password (e.g. 1234 or school PIN):' : 'Parola nouă (ex. 1234 sau PIN):'}
                </label>
                <input
                  type="text"
                  value={newPasswordInput}
                  onChange={(e) => {
                    setNewPasswordInput(e.target.value);
                    if (resetError) setResetError(null);
                  }}
                  placeholder={isEn ? 'Enter new password...' : 'Introdu noua parolă...'}
                  className="w-full bg-slate-950 border border-slate-700 px-3.5 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  autoFocus
                />
              </div>

              {resetError && (
                <p className="text-xs text-rose-400 font-semibold">{resetError}</p>
              )}

              {resetSuccess && (
                <p className="text-xs text-emerald-400 font-semibold">{resetSuccess}</p>
              )}

              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setResettingStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  {isEn ? 'Cancel' : 'Anulează'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-600/30 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isEn ? 'Save New Password' : 'Salvează Parola'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Score Inspector / Editor Modal */}
      {selectedStudentForScores && (
        <TeacherScoreModal
          student={selectedStudentForScores}
          isOpen={!!selectedStudentForScores}
          onClose={() => setSelectedStudentForScores(null)}
          onSuccess={() => {
            setSelectedStudentForScores(null);
            fetchStudents();
          }}
          lang={lang}
        />
      )}
    </div>
  );
};

