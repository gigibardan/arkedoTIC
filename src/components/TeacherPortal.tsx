import React, { useState, useEffect } from 'react';
import { Lock, LogOut, RefreshCw, Trash2, Award, Clock, Users, Trophy, ShieldCheck, ArrowLeft, Cloud, HardDrive } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getStudentResults, deleteStudentResult, StudentResult } from '../lib/resultsService';
import { isCloudConnected } from '../lib/firebase';
import { sounds } from '../utils/audio';

interface TeacherPortalProps {
  onBackToHome: () => void;
}

const TEACHER_HARDCODED_PASSWORD = 'Ark3do!';

export const TeacherPortal: React.FC<TeacherPortalProps> = ({ onBackToHome }) => {
  const { t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('arkedo_teacher_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<boolean>(false);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchResults = async () => {
    setLoading(true);
    const data = await getStudentResults();
    setResults(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchResults();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === TEACHER_HARDCODED_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError(false);
      sessionStorage.setItem('arkedo_teacher_auth', 'true');
      sounds.playCorrect();
    } else {
      setAuthError(true);
      sounds.playWrong();
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('arkedo_teacher_auth');
    setPasswordInput('');
    sounds.playClick();
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (window.confirm(t.teacherDeleteConfirm)) {
      setDeletingId(id);
      const success = await deleteStudentResult(id);
      if (success) {
        setResults((prev) => prev.filter((r) => r.id !== id));
        sounds.playClick();
      }
      setDeletingId(null);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    if (mins === 0) return `${remaining}s`;
    return `${mins}m ${remaining}s`;
  };

  // Calculations for dashboard metrics
  const totalCount = results.length;
  const avgScore = totalCount > 0 ? Math.round(results.reduce((acc, r) => acc + (r.score || 0), 0) / totalCount) : 0;
  const avgSeconds = totalCount > 0 ? Math.round(results.reduce((acc, r) => acc + (r.elapsedSeconds || 0), 0) / totalCount) : 0;

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg text-3xl">
            🔐
          </div>
          <h2 className="text-2xl font-black text-white font-heading">
            {t.teacherLoginPrompt}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t.teacherPortalSub}
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2 font-bold">
              Parolă Acces Profesor
            </label>
            <div className="relative">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (authError) setAuthError(false);
                }}
                placeholder={t.teacherPasswordPlaceholder}
                className={`w-full bg-slate-950 border px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                  authError
                    ? 'border-rose-500 focus:ring-rose-500/50'
                    : 'border-slate-700 focus:ring-emerald-500/50'
                }`}
                autoFocus
              />
              <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
            </div>
            {authError && (
              <p className="text-xs text-rose-400 mt-2 font-medium">
                {t.teacherPasswordError}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-heading text-sm transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t.teacherLoginBtn}</span>
          </button>

          <button
            type="button"
            onClick={onBackToHome}
            className="text-xs text-slate-400 hover:text-slate-200 transition py-2 text-center cursor-pointer"
          >
            ← {t.backToCourses}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Banner with Navigation */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
              <ShieldCheck className="w-3.5 h-3.5" /> Panou Securizat Cadru Didactic
            </div>
            {isCloudConnected ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold font-mono">
                <Cloud className="w-3.5 h-3.5" /> Sincronizat Firestore
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-mono">
                <HardDrive className="w-3.5 h-3.5 text-cyan-400" /> Catalog Local Securizat
              </div>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
            {t.teacherPortalTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t.teacherPortalSub}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchResults}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
            title={t.teacherRefresh}
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
            <span>{t.teacherRefresh}</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800 text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.teacherLogout}</span>
          </button>

          <button
            onClick={onBackToHome}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.backToCourses}</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono font-bold uppercase tracking-wider">
              {t.teacherTotalStudents}
            </div>
            <div className="text-2xl font-black text-white font-heading mt-0.5">
              {totalCount}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono font-bold uppercase tracking-wider">
              {t.teacherAvgScore}
            </div>
            <div className="text-2xl font-black text-amber-300 font-heading mt-0.5">
              {avgScore} / 100
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono font-bold uppercase tracking-wider">
              {t.teacherAvgTime}
            </div>
            <div className="text-2xl font-black text-cyan-300 font-heading mt-0.5 font-mono">
              {formatSeconds(avgSeconds)}
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Evidență Note & Realizări</span>
          </h3>
          <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
            Firebase: Firestore Cloud
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
            <p className="text-xs font-mono">Se încarcă datele din baza de date...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-sm font-semibold max-w-md mx-auto leading-relaxed">
              {t.teacherNoResults}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4 font-bold">{t.teacherTableStudent}</th>
                  <th className="py-3 px-4 font-bold">{t.teacherTableCourse}</th>
                  <th className="py-3 px-4 font-bold">{t.teacherTableScore}</th>
                  <th className="py-3 px-4 font-bold">{t.teacherTableDuration}</th>
                  <th className="py-3 px-4 font-bold">{t.teacherTableDate}</th>
                  <th className="py-3 px-4 font-bold text-right">{t.teacherTableActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {results.map((r, idx) => (
                  <tr key={r.id || idx} className="hover:bg-slate-850/50 transition">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-mono shrink-0">
                        {idx + 1}
                      </span>
                      <span>{r.studentName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {r.courseTitle}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 text-xs font-mono">
                        ⭐ {r.score} / {r.maxScore}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-cyan-300 text-xs">
                      ⏱️ {formatSeconds(r.elapsedSeconds)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-xs">
                      {r.dateFormatted || 'Recent'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(r.id)}
                        disabled={deletingId === r.id}
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 transition cursor-pointer disabled:opacity-50"
                        title="Șterge rând"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
