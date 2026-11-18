import React, { useEffect, useState } from 'react';
import { X, Printer, CheckCircle2, Award, Clock, Save } from 'lucide-react';
import { StudentDiploma } from '../../types';
import { MISSION_META_BY_ID } from '../../lib/carnetService';
import { saveStudentDiploma } from '../../lib/studentAuthService';
import { useLanguage } from '../../context/LanguageContext';
import { sounds } from '../../utils/audio';

interface DiplomaPreviewModalProps {
  diploma: StudentDiploma | null;
  schoolLabel?: string;
  onClose: () => void;
  onDiplomaUpdated?: (updated: StudentDiploma) => void;
}

export const DiplomaPreviewModal: React.FC<DiplomaPreviewModalProps> = ({
  diploma,
  schoolLabel,
  onClose,
  onDiplomaUpdated,
}) => {
  const { lang, t } = useLanguage();
  const [editableName, setEditableName] = useState(diploma?.studentName || '');
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    setEditableName(diploma?.studentName || '');
    setSavedFeedback(false);
  }, [diploma]);

  useEffect(() => {
    if (!diploma) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [diploma, onClose]);

  if (!diploma) return null;

  const meta = MISSION_META_BY_ID[diploma.courseId];
  const emoji = meta?.emoji || '🏅';

  const formattedDate = (() => {
    try {
      return new Date(diploma.awardedAt).toLocaleDateString(lang === 'en' ? 'en-GB' : 'ro-RO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return diploma.awardedAt;
    }
  })();

  const formattedTime = (() => {
    const sec = diploma.timeSpentSeconds || 0;
    if (sec <= 0) return null;
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return mins > 0 ? `${mins} min ${rem} sec` : `${rem} sec`;
  })();

  const persistNameIfChanged = async (): Promise<StudentDiploma> => {
    const clean = editableName.trim() || diploma.studentName || (lang === 'en' ? 'Student' : 'Elev ArkyEdu');
    if (clean !== diploma.studentName) {
      const updated: StudentDiploma = { ...diploma, studentName: clean };
      await saveStudentDiploma(updated);
      onDiplomaUpdated?.(updated);
      return updated;
    }
    return diploma;
  };

  const handleSaveName = async () => {
    sounds.playClick();
    await persistNameIfChanged();
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handlePrint = async () => {
    sounds.playClick();
    await persistNameIfChanged();
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'en' ? 'Official Certificate Preview' : 'Previzualizare Diplomă Oficială'}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-4 sm:p-6 shadow-2xl my-auto">
        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400 shrink-0" />
            <h3 className="text-sm sm:text-base font-black text-white font-heading">
              {lang === 'en' ? 'Official Merit Certificate' : 'Diplomă Oficială de Merit'}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            aria-label={lang === 'en' ? 'Close' : 'Închide'}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Diploma Card */}
        <div
          id="diploma-to-print"
          className="bg-gradient-to-tr from-amber-50 via-white to-amber-100 text-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-4 border-amber-400 shadow-xl text-center"
        >
          <div className="border-2 border-dashed border-amber-600/40 p-4 sm:p-6 rounded-2xl">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-base shrink-0">
                  {emoji}
                </span>
                <span className="text-[11px] sm:text-xs font-black text-emerald-900 uppercase tracking-wider text-left truncate">
                  {schoolLabel || t.schoolName}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-800">
                {diploma.grade}
              </span>
            </div>

            <h4 className="text-xl sm:text-2xl font-black tracking-wide text-slate-900 uppercase font-heading text-balance">
              {lang === 'en' ? diploma.titleEn : diploma.titleRo}
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-600 font-semibold uppercase tracking-wider mt-1">
              {t.vDiplomaDept}
            </p>

            <p className="text-xs text-slate-500 mt-4">{t.vDiplomaAwardTo}</p>

            <div className="my-2.5">
              <input
                type="text"
                value={editableName}
                onChange={(e) => setEditableName(e.target.value)}
                placeholder={t.vDiplomaDefaultName}
                aria-label={lang === 'en' ? 'Student Name on Certificate' : 'Numele elevului pe diplomă'}
                className="w-full text-center text-lg sm:text-2xl font-black text-emerald-800 bg-amber-50/70 border-b-2 border-emerald-500 focus:outline-none focus:border-emerald-700 py-1 px-3 rounded-lg"
              />
            </div>

            <div className="my-3 inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-xl bg-amber-200/75 border border-amber-600/40 tabular-nums">
              <span className="text-sm sm:text-base" aria-hidden="true">⭐</span>
              <span className="text-xs sm:text-sm font-black text-amber-950 font-mono">
                {diploma.score} / {diploma.maxScore} {t.pts} · {diploma.calificativ}
              </span>
            </div>

            {meta && (
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-lg mx-auto mt-2">
                {lang === 'en'
                  ? `Awarded for completing module "${meta.titleEn}" (${meta.unitEn}) in the official ArkyEdu ICT & Computer Science curriculum.`
                  : `Se acordă pentru absolvirea cu succes a modulului „${meta.titleRo}” (${meta.unitRo}) din programa interactivă ArkyEdu TIC & Informatică.`}
              </p>
            )}

            <div className="mt-6 pt-4 border-t border-amber-300 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-700">
              <div className="text-left">
                <div className="font-extrabold text-slate-900">{t.vDiplomaTeacher}</div>
                <div className="text-slate-600">{schoolLabel || t.schoolName}</div>
              </div>
              {formattedTime && (
                <div className="flex items-center gap-1 text-slate-600 font-mono tabular-nums">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formattedTime}</span>
                </div>
              )}
              <div className="text-right ml-auto">
                <div className="font-extrabold text-slate-900">{formattedDate}</div>
                <div className="font-mono text-slate-500">
                  {diploma.officialRef || `ARKY-${diploma.courseId.toUpperCase()}`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={handleSaveName}
            className="min-h-[42px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer"
          >
            {savedFeedback ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-300">
                  {lang === 'en' ? 'Name saved!' : 'Nume salvat!'}
                </span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{lang === 'en' ? 'Save Name' : 'Salvează Nume'}</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="min-h-[42px] px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm transition flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Printer className="w-4 h-4 shrink-0" />
              <span>{lang === 'en' ? 'Print / Save PDF' : 'Printează / Salvează PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
