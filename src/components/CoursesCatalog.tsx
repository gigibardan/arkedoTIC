import React, { useState } from 'react';
import { School, BookOpen, Clock, Star, Award, Sparkles, User, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { sounds } from '../utils/audio';

interface CoursesCatalogProps {
  studentName: string;
  onSetStudentName: (name: string) => void;
  onStartLesson1: () => void;
  currentLevel: number;
  score: number;
}

export const CoursesCatalog: React.FC<CoursesCatalogProps> = ({
  studentName,
  onSetStudentName,
  onStartLesson1,
  currentLevel,
  score,
}) => {
  const { t } = useLanguage();
  const [nameInput, setNameInput] = useState<string>(studentName);
  const [isEditingName, setIsEditingName] = useState<boolean>(!studentName);
  const [nameError, setNameError] = useState<boolean>(false);

  const handleSaveName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = nameInput.trim();
    if (trimmed.length > 0) {
      onSetStudentName(trimmed);
      setIsEditingName(false);
      setNameError(false);
      sounds.playCorrect();
    } else {
      setNameError(true);
    }
  };

  const handleStart = () => {
    if (!studentName && !nameInput.trim()) {
      setNameError(true);
      setIsEditingName(true);
      return;
    }
    if (nameInput.trim() && !studentName) {
      onSetStudentName(nameInput.trim());
    }
    sounds.playClick();
    onStartLesson1();
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950/60 border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs sm:text-sm font-bold border border-emerald-500/30 mb-4 shadow-sm">
            <School className="w-4 h-4" />
            <span>{t.catalogBadge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight leading-tight mb-3">
            {t.catalogTitle}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
            {t.catalogSub}
          </p>

          {/* Student Profile Registration Card */}
          <div className="bg-slate-900/90 backdrop-blur border-2 border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-xl max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
              <User className="w-4 h-4" />
              <span>{t.studentGreetingBadge}</span>
            </div>

            {studentName && !isEditingName ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-lg shadow">
                    🎓
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">{t.helloStudent},</div>
                    <div className="text-base sm:text-lg font-black text-white font-heading">
                      {studentName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setNameInput(studentName);
                      setIsEditingName(true);
                      sounds.playClick();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition border border-slate-700 cursor-pointer"
                  >
                    {t.studentNameChangeBtn}
                  </button>
                  <button
                    onClick={handleStart}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
                  >
                    <span>{currentLevel > 1 ? t.lesson1BtnResume : t.lesson1BtnStart}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveName} className="flex flex-col gap-2.5">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t.studentPromptSub}
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => {
                      setNameInput(e.target.value);
                      if (nameError) setNameError(false);
                    }}
                    placeholder={t.studentNamePlaceholder}
                    className={`flex-1 bg-slate-950/90 border px-3.5 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 font-medium ${
                      nameError
                        ? 'border-rose-500 focus:ring-rose-500/40'
                        : 'border-slate-700 focus:ring-emerald-500/40'
                    }`}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30 shrink-0 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.studentNameSaveBtn}</span>
                  </button>
                </div>
                {nameError && (
                  <p className="text-xs text-rose-400 font-semibold">
                    {t.enterNameAlert}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Decorative Graphic */}
        <div className="absolute -bottom-10 -right-10 text-9xl opacity-15 pointer-events-none select-none">
          🌳💻
        </div>
      </div>

      {/* Courses & Lessons Section */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg sm:text-2xl font-black text-white font-heading tracking-wide">
              {t.catalogSectionTitle}
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
            5 Module TIC
          </span>
        </div>

        {/* Lesson Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: ACTIVE - Misiunea Arborele Secret */}
          <div className="group relative bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 border-emerald-500/60 hover:border-emerald-400 rounded-3xl p-6 shadow-xl hover:shadow-emerald-500/10 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                  🌳
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider animate-pulse">
                  <Sparkles className="w-3 h-3" /> {t.statusActive}
                </span>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1 font-mono">
                {t.lesson1Grade}
              </div>

              <h3 className="text-xl font-black text-white font-heading mb-1 group-hover:text-emerald-300 transition-colors">
                {t.lesson1CardTitle}
              </h3>
              <div className="text-xs font-semibold text-slate-300 mb-3">
                {t.lesson1CardSub}
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {t.lesson1CardDesc}
              </p>

              {/* Badges / Highlights */}
              <div className="flex flex-wrap gap-2 mb-4 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> {t.lesson1Duration}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-amber-300 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {t.lesson1Points}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-emerald-300 flex items-center gap-1">
                  <Award className="w-3 h-3 text-emerald-400" /> Diplomă ARKEDO
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between">
              <div className="text-xs text-slate-400 font-mono">
                {currentLevel > 1 ? (
                  <span className="text-emerald-400 font-bold">
                    Progres: Nivel {currentLevel > 5 ? 5 : currentLevel}/5 ({score} pct)
                  </span>
                ) : (
                  <span>5 Provocări practice</span>
                )}
              </div>
              <button
                onClick={handleStart}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
              >
                <span>{currentLevel > 1 ? t.lesson1BtnResume : t.lesson1BtnStart}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: COMING SOON - Arhitectura unui sistem de calcul */}
          <div className="relative bg-slate-900/50 border border-slate-800 rounded-3xl p-6 opacity-85 hover:opacity-100 transition flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl">
                  💻
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-bold uppercase tracking-wider">
                  <Lock className="w-3 h-3" /> {t.statusComingSoon}
                </span>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                {t.lesson2Sub}
              </div>

              <h3 className="text-xl font-bold text-slate-200 font-heading mb-2">
                {t.lesson2Title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {t.lesson2Desc}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Modulul 2 • Clasa a V-a</span>
              <span className="px-3 py-1 rounded-lg bg-slate-800/80 text-slate-400">
                În pregătire ⏳
              </span>
            </div>
          </div>

          {/* Card 3: COMING SOON - Siguranță pe Internet */}
          <div className="relative bg-slate-900/50 border border-slate-800 rounded-3xl p-6 opacity-85 hover:opacity-100 transition flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl">
                  🌐
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-bold uppercase tracking-wider">
                  <Lock className="w-3 h-3" /> {t.statusComingSoon}
                </span>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                {t.lesson3Sub}
              </div>

              <h3 className="text-xl font-bold text-slate-200 font-heading mb-2">
                {t.lesson3Title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {t.lesson3Desc}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Modulul 3 • Clasa a V-a</span>
              <span className="px-3 py-1 rounded-lg bg-slate-800/80 text-slate-400">
                În pregătire ⏳
              </span>
            </div>
          </div>

          {/* Card 4: COMING SOON - Editare Text */}
          <div className="relative bg-slate-900/50 border border-slate-800 rounded-3xl p-6 opacity-85 hover:opacity-100 transition flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl">
                  📝
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-bold uppercase tracking-wider">
                  <Lock className="w-3 h-3" /> {t.statusComingSoon}
                </span>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                {t.lesson4Sub}
              </div>

              <h3 className="text-xl font-bold text-slate-200 font-heading mb-2">
                {t.lesson4Title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {t.lesson4Desc}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Modulul 4 • Clasa a V-a</span>
              <span className="px-3 py-1 rounded-lg bg-slate-800/80 text-slate-400">
                În pregătire ⏳
              </span>
            </div>
          </div>

          {/* Card 5: COMING SOON - Algoritmi */}
          <div className="relative bg-slate-900/50 border border-slate-800 rounded-3xl p-6 opacity-85 hover:opacity-100 transition flex flex-col justify-between md:col-span-2">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl">
                  🤖
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-bold uppercase tracking-wider">
                  <Lock className="w-3 h-3" /> {t.statusComingSoon}
                </span>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                {t.lesson5Sub}
              </div>

              <h3 className="text-xl font-bold text-slate-200 font-heading mb-2">
                {t.lesson5Title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4 max-w-3xl">
                {t.lesson5Desc}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Modulul 5 • Clasa a V-a</span>
              <span className="px-3 py-1 rounded-lg bg-slate-800/80 text-slate-400">
                În pregătire ⏳
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
