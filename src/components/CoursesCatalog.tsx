import React, { useState } from 'react';
import {
  School,
  BookOpen,
  Clock,
  Star,
  Award,
  Sparkles,
  User,
  ArrowRight,
  CheckCircle2,
  Lock,
  Cpu,
  FolderTree,
  Lightbulb,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { sounds } from '../utils/audio';
import { KnowledgePills } from './hardware/KnowledgePills';
import { MissionGuardModal } from './MissionGuardModal';

interface CoursesCatalogProps {
  studentName: string;
  onSetStudentName: (name: string) => void;
  onSelectMission: (missionId: 'hardware' | 'files') => void;
  activeMissionId: 'hardware' | 'files' | null;
  activeMissionLevel: number;
  activeMissionScore: number;
  elapsedSeconds: number;
  onResetActiveMission: () => void;
  onOpenTeacherPortal?: () => void;
}

export const CoursesCatalog: React.FC<CoursesCatalogProps> = ({
  studentName,
  onSetStudentName,
  onSelectMission,
  activeMissionId,
  activeMissionLevel,
  activeMissionScore,
  elapsedSeconds,
  onResetActiveMission,
  onOpenTeacherPortal,
}) => {
  const { t } = useLanguage();
  const [nameInput, setNameInput] = useState<string>(studentName);
  const [isEditingName, setIsEditingName] = useState<boolean>(!studentName);
  const [nameError, setNameError] = useState<boolean>(false);

  // Guard modal state
  const [guardModalOpen, setGuardModalOpen] = useState<boolean>(false);
  const [pendingTargetMission, setPendingTargetMission] = useState<'hardware' | 'files' | null>(null);

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

  const handleAttemptStart = (targetMission: 'hardware' | 'files') => {
    // If student has no name yet, prompt them first
    if (!studentName && !nameInput.trim()) {
      setNameError(true);
      setIsEditingName(true);
      sounds.playWrong();
      return;
    }
    if (nameInput.trim() && !studentName) {
      onSetStudentName(nameInput.trim());
    }

    // CHECK IN-PROGRESS GUARD:
    // If user has an active mission in progress (level > 1 and level <= 5) and tries to start a DIFFERENT mission
    const hasMissionInProgress =
      activeMissionId !== null &&
      activeMissionId !== targetMission &&
      activeMissionLevel > 1 &&
      activeMissionLevel <= 5;

    if (hasMissionInProgress) {
      sounds.playWrong();
      setPendingTargetMission(targetMission);
      setGuardModalOpen(true);
      return;
    }

    // Safe to proceed
    sounds.playClick();
    onSelectMission(targetMission);
  };

  const getMissionTitle = (id: 'hardware' | 'files' | null) => {
    if (id === 'hardware') return 'Modulul 1: Sisteme de calcul & Hardware (Manual pag. 10-20)';
    if (id === 'files') return 'Modulul 2: Arborele Secret de Fișiere (Manual pag. 27-30)';
    return 'Nicio misiune activă';
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950/50 border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 text-teal-300 text-xs sm:text-sm font-bold border border-teal-500/30 mb-4 shadow-sm">
            <School className="w-4 h-4" />
            <span>{t.catalogBadge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight leading-tight mb-3">
            {t.catalogTitle}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
            Explorează modulele interactive concepute conform Programei Școlare Naționale și Manualelor TIC pentru Clasele a V-a și a VI-a. Fiecare misiune conține exerciții practice, sfaturi de la profesor și o diplomă oficială!
          </p>

          {/* Student Profile Registration Card */}
          <div className="bg-slate-900/90 backdrop-blur border-2 border-teal-500/40 rounded-2xl p-4 sm:p-5 shadow-xl max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400 mb-2">
              <User className="w-4 h-4" />
              <span>{t.studentGreetingBadge}</span>
            </div>

            {studentName && !isEditingName ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-lg shadow">
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

                  {activeMissionId && (
                    <button
                      onClick={() => handleAttemptStart(activeMissionId)}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow-lg shadow-teal-600/30 cursor-pointer active:scale-95"
                    >
                      <span>Reia Misiunea ({activeMissionId === 'hardware' ? 'Hardware' : 'Fișiere'})</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
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
                        : 'border-slate-700 focus:ring-teal-500/40'
                    }`}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shadow-md shadow-teal-600/30 shrink-0 cursor-pointer"
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

        {/* Decorative Graphics */}
        <div className="absolute -bottom-8 -right-8 text-9xl opacity-10 pointer-events-none select-none">
          💻⚡
        </div>
      </div>

      {/* Interactive Knowledge Pills Section */}
      <KnowledgePills />

      {/* Courses & Lessons Section */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg sm:text-2xl font-black text-white font-heading tracking-wide">
              Misiuni Practice TIC Clasa a V-a
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
            2 Misiuni Interactive Disponibile
          </span>
        </div>

        {/* Lesson Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1 (NEW & FIRST): Modulul 1 - Sisteme de Calcul și Comunicații */}
          <div
            className={`group relative bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 rounded-3xl p-6 shadow-xl transition-all flex flex-col justify-between ${
              activeMissionId === 'hardware'
                ? 'border-teal-400 shadow-teal-500/20 ring-2 ring-teal-500/30'
                : 'border-teal-500/60 hover:border-teal-400 hover:shadow-teal-500/10'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                  💻⚡
                </div>
                <div className="flex items-center gap-2">
                  {activeMissionId === 'hardware' && activeMissionLevel > 1 && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black uppercase tracking-wider font-mono">
                      În Curs (Nivel {activeMissionLevel}/5)
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-black uppercase tracking-wider animate-pulse">
                    <Sparkles className="w-3 h-3" /> NOU • MODULUL 1
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-teal-400 mb-1 font-mono">
                Manual pag. 10–20 • Unitatea 1
              </div>

              <h3 className="text-xl font-black text-white font-heading mb-1 group-hover:text-teal-300 transition-colors">
                Sisteme de calcul și comunicații
              </h3>
              <div className="text-xs font-semibold text-slate-300 mb-3">
                Arhitectură PC, Ergonomie, Istorie & Calculul Capacității
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                Învață normele de protecția muncii și ergonomie în laborator, explorează axa timpului (1642 Pascalina → 1981 IBM PC), montează componentele unității centrale (CPU, RAM, Placă de bază), sortează perifericele și rezolvă problema stocării în biți din manual!
              </p>

              {/* Badges / Highlights */}
              <div className="flex flex-wrap gap-2 mb-4 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> 20-25 min
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-amber-300 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 100 Puncte (Nota 10)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-teal-300 flex items-center gap-1">
                  <Award className="w-3 h-3 text-teal-400" /> Diplomă Tehnician Hardware
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between">
              <div className="text-xs text-slate-400 font-mono">
                {activeMissionId === 'hardware' && activeMissionLevel > 1 ? (
                  <span className="text-teal-400 font-bold">
                    Progres: Nivel {activeMissionLevel}/5 ({activeMissionScore} pct)
                  </span>
                ) : (
                  <span>5 Niveluri interactive</span>
                )}
              </div>
              <button
                onClick={() => handleAttemptStart('hardware')}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-teal-600/30 cursor-pointer active:scale-95"
              >
                <span>
                  {activeMissionId === 'hardware' && activeMissionLevel > 1
                    ? 'Continuă Misiunea Hardware'
                    : 'Începe Misiunea 1'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Modulul 2 - Organizarea Datelor • Arborele Secret */}
          <div
            className={`group relative bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 rounded-3xl p-6 shadow-xl transition-all flex flex-col justify-between ${
              activeMissionId === 'files'
                ? 'border-emerald-400 shadow-emerald-500/20 ring-2 ring-emerald-500/30'
                : 'border-emerald-500/60 hover:border-emerald-400 hover:shadow-emerald-500/10'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                  🌳
                </div>
                <div className="flex items-center gap-2">
                  {activeMissionId === 'files' && activeMissionLevel > 1 && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black uppercase tracking-wider font-mono">
                      În Curs (Nivel {activeMissionLevel}/7)
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> MODULUL 2
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1 font-mono">
                Manual pag. 22–30 • Unitatea 2
              </div>

              <h3 className="text-xl font-black text-white font-heading mb-1 group-hover:text-emerald-300 transition-colors">
                Misiunea Arborele Secret de Fișiere & SO
              </h3>
              <div className="text-xs font-semibold text-slate-300 mb-3">
                Interfață Windows 10, Extensii, Structură C:\, Comenzi Rapide & Recycle Bin
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                Explorează interfața sistemului de operare (pag. 22–24), învață regula extensiilor și calea către fișiere (pag. 25–26), construiește structura ierarhică de directoare (pag. 27–28), găsește fișierele secrete cu masca (*.docx), mută documente cu taste rapide, gestionează proprietățile și restaurează datele din Recycle Bin!
              </p>

              {/* Badges / Highlights */}
              <div className="flex flex-wrap gap-2 mb-4 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> 20-25 min
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-amber-300 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 100 Puncte (Nota 10)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-emerald-300 flex items-center gap-1">
                  <Award className="w-3 h-3 text-emerald-400" /> Diplomă Arhitect Fișiere & SO
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between">
              <div className="text-xs text-slate-400 font-mono">
                {activeMissionId === 'files' && activeMissionLevel > 1 ? (
                  <span className="text-emerald-400 font-bold">
                    Progres: Nivel {activeMissionLevel}/7 ({activeMissionScore} pct)
                  </span>
                ) : (
                  <span>7 Provocări practice</span>
                )}
              </div>
              <button
                onClick={() => handleAttemptStart('files')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
              >
                <span>
                  {activeMissionId === 'files' && activeMissionLevel > 1
                    ? 'Continuă Misiunea Fișiere'
                    : 'Începe Misiunea 2'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
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
        </div>
      </div>

      {/* Discreet Teacher Portal Link (for instructors only) */}
      {onOpenTeacherPortal && (
        <div className="pt-2 pb-1 border-t border-slate-800/60 flex items-center justify-center">
          <button
            onClick={() => {
              sounds.playClick();
              onOpenTeacherPortal();
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 text-[11px] font-medium transition cursor-pointer"
            title="Acces securizat pentru cadre didactice (catalog & notare)"
          >
            <span className="text-slate-600 text-xs">🔒</span>
            <span>Acces cadre didactice (catalog & notare)</span>
          </button>
        </div>
      )}

      {/* Mission In-Progress Guard Modal */}
      <MissionGuardModal
        isOpen={guardModalOpen}
        activeMissionTitle={getMissionTitle(activeMissionId)}
        activeLevel={activeMissionLevel}
        activeScore={activeScore(activeMissionLevel, activeMissionId)}
        elapsedSeconds={elapsedSeconds}
        targetMissionTitle={getMissionTitle(pendingTargetMission)}
        onResumeActive={() => {
          setGuardModalOpen(false);
          if (activeMissionId) {
            onSelectMission(activeMissionId);
          }
        }}
        onAbandonAndStartNew={() => {
          setGuardModalOpen(false);
          onResetActiveMission();
          if (pendingTargetMission) {
            onSelectMission(pendingTargetMission);
          }
        }}
        onCancel={() => {
          setGuardModalOpen(false);
          setPendingTargetMission(null);
        }}
      />
    </div>
  );
};

function activeScore(level: number, missionId?: 'hardware' | 'files' | null): number {
  if (level <= 1) return 0;
  if (missionId === 'hardware') {
    return Math.min((level - 1) * 20, 100);
  }
  const filesScores = [0, 10, 25, 40, 55, 70, 85, 100];
  return filesScores[Math.min(level - 1, 7)] || 0;
}
