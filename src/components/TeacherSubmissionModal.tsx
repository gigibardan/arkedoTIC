import React, { useState } from 'react';
import { X, Save, Award, Clock, User, BookOpen, AlertTriangle } from 'lucide-react';
import { StudentResult, updateStudentResult, deleteStudentResult } from '../lib/resultsService';
import { sounds } from '../utils/audio';

interface TeacherSubmissionModalProps {
  result: StudentResult | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lang: 'ro' | 'en';
}

export const TeacherSubmissionModal: React.FC<TeacherSubmissionModalProps> = ({
  result,
  isOpen,
  onClose,
  onSuccess,
  lang
}) => {
  const isEn = lang === 'en';

  const [studentName, setStudentName] = useState(result?.studentName || '');
  const [courseTitle, setCourseTitle] = useState(result?.courseTitle || '');
  const [score, setScore] = useState<number>(result?.score || 0);
  const [maxScore, setMaxScore] = useState<number>(result?.maxScore || 100);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(result?.elapsedSeconds || 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state if result changes
  React.useEffect(() => {
    if (result) {
      setStudentName(result.studentName);
      setCourseTitle(result.courseTitle);
      setScore(result.score);
      setMaxScore(result.maxScore || 100);
      setElapsedSeconds(result.elapsedSeconds);
      setError(null);
    }
  }, [result]);

  if (!isOpen || !result) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result.id) return;
    setSaving(true);
    setError(null);

    const ok = await updateStudentResult(result.id, {
      studentName: studentName.trim(),
      courseTitle: courseTitle.trim(),
      score: Math.max(0, score),
      maxScore: Math.max(1, maxScore),
      elapsedSeconds: Math.max(0, elapsedSeconds)
    });

    setSaving(false);
    if (ok) {
      sounds.playCorrect();
      onSuccess();
      onClose();
    } else {
      sounds.playWrong();
      setError(isEn ? 'Failed to update submission in database.' : 'Eroare la salvarea în baza de date.');
    }
  };

  const handleDelete = async () => {
    if (!result.id) return;
    if (window.confirm(isEn ? 'Are you sure you want to delete this submission?' : 'Sigur doriți să ștergeți această notare?')) {
      setSaving(true);
      const ok = await deleteStudentResult(result.id);
      setSaving(false);
      if (ok) {
        sounds.playClick();
        onSuccess();
        onClose();
      }
    }
  };

  const isSuspicious = (elapsedSeconds < 15 && score >= 90) || score > maxScore;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-black text-white font-heading">
              {isEn ? 'Edit Grade / Submission' : 'Modificare Notă & Rezultat Test'}
            </h4>
            <p className="text-xs text-slate-400">
              {isEn ? 'Correct grades, fix typos, or eliminate cheated tests.' : 'Corectați nota, timpul sau ștergeți testul dacă a trișat.'}
            </p>
          </div>
        </div>

        {isSuspicious && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{isEn ? 'Suspicious speedrun: Finished test in under 15s!' : 'Suspiciune trișare: Test finalizat în mai puțin de 15 secunde!'}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-xs font-mono uppercase font-bold mb-1">
              {isEn ? 'Student Name' : 'Nume Elev'}
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 px-3.5 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-mono uppercase font-bold mb-1">
              {isEn ? 'Lesson / Mission Title' : 'Misiune / Curs TIC'}
            </label>
            <input
              type="text"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 px-3.5 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 text-xs font-mono uppercase font-bold mb-1">
                {isEn ? 'Score Points' : 'Punctaj'}
              </label>
              <input
                type="number"
                value={score}
                onChange={(e) => setScore(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-slate-950 border border-slate-700 px-3.5 py-2.5 rounded-xl text-sm text-amber-300 font-mono font-bold focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 text-xs font-mono uppercase font-bold mb-1">
                {isEn ? 'Max Score' : 'Punctaj Maxim'}
              </label>
              <input
                type="number"
                value={maxScore}
                onChange={(e) => setMaxScore(parseInt(e.target.value, 10) || 100)}
                className="w-full bg-slate-950 border border-slate-700 px-3.5 py-2.5 rounded-xl text-sm text-slate-300 font-mono font-bold focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-mono uppercase font-bold mb-1">
              {isEn ? 'Elapsed Time (seconds)' : 'Timp Lucru (secunde)'}
            </label>
            <input
              type="number"
              value={elapsedSeconds}
              onChange={(e) => setElapsedSeconds(parseInt(e.target.value, 10) || 0)}
              className="w-full bg-slate-950 border border-slate-700 px-3.5 py-2.5 rounded-xl text-sm text-cyan-300 font-mono font-bold focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 font-bold">{error}</p>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800 text-xs font-bold transition cursor-pointer"
            >
              {isEn ? 'Delete Record' : 'Șterge Notarea'}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                {isEn ? 'Cancel' : 'Anulează'}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/30 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? (isEn ? 'Saving...' : 'Se salvează...') : (isEn ? 'Save Grade' : 'Salvează Nota')}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
