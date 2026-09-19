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
import { useArky } from '../context/ArkyContext';
import { sounds } from '../utils/audio';
import { KnowledgePills } from './hardware/KnowledgePills';
import { MissionGuardModal } from './MissionGuardModal';

interface CoursesCatalogProps {
  studentName: string;
  onSetStudentName: (name: string) => void;
  onSelectMission: (missionId: 'hardware' | 'files' | 'internet1') => void;
  activeMissionId: 'hardware' | 'files' | 'internet1' | null;
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
  const { t, lang } = useLanguage();
  const arky = useArky();
  const [nameInput, setNameInput] = useState<string>(studentName);
  const [isEditingName, setIsEditingName] = useState<boolean>(!studentName);
  const [nameError, setNameError] = useState<boolean>(false);

  // Guard modal state
  const [guardModalOpen, setGuardModalOpen] = useState<boolean>(false);
  const [pendingTargetMission, setPendingTargetMission] = useState<'hardware' | 'files' | 'internet1' | null>(null);

  const handleSaveName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = nameInput.trim();
    if (trimmed.length > 0) {
      onSetStudentName(trimmed);
      setIsEditingName(false);
      setNameError(false);
      sounds.playCorrect();
      arky.triggerSuccess(
        lang === 'en'
          ? `Welcome aboard, ${trimmed}! Let's conquer the digital world! 🚀`
          : `Bun venit la bord, ${trimmed}! Hai să cucerim lumea digitală! 🚀`
      );
    } else {
      setNameError(true);
      arky.triggerError(
        lang === 'en'
          ? "Oops! Please enter your name so Arky can put it on your diploma! ✍️"
          : "Hopa! Scrie-ți numele pentru ca Arky să-l poată pune pe diplomă! ✍️"
      );
    }
  };

  const handleAttemptStart = (targetMission: 'hardware' | 'files' | 'internet1') => {
    // If student has no name yet, prompt them first
    if (!studentName && !nameInput.trim()) {
      setNameError(true);
      setIsEditingName(true);
      sounds.playWrong();
      arky.triggerError(
        lang === 'en'
          ? "Hold on! Tell Arky your name first before starting the mission! 🤖"
          : "Stai puțin! Spune-i lui Arky numele tău înainte de a începe misiunea! 🤖"
      );
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
      activeMissionLevel <= 6;

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

  const getMissionTitle = (id: 'hardware' | 'files' | 'internet1' | null) => {
    if (id === 'hardware') {
      return lang === 'en'
        ? 'Module 1: Computer Systems & Hardware (Textbook p. 10-20)'
        : 'Modulul 1: Sisteme de calcul & Hardware (Manual pag. 10-20)';
    }
    if (id === 'files') {
      return lang === 'en'
        ? 'Module 2: The Secret File Tree (Textbook p. 27-30)'
        : 'Modulul 2: Arborele Secret de Fișiere (Manual pag. 27-30)';
    }
    if (id === 'internet1') {
      return lang === 'en'
        ? 'Module 3A: Internet, Networks & World Wide Web (Textbook p. 32-36)'
        : 'Modulul 3A: Internet, Rețele & World Wide Web (Manual pag. 32-36)';
    }
    return lang === 'en' ? 'No active mission' : 'Nicio misiune activă';
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
            {lang === 'en'
              ? 'Explore interactive modules designed according to the ICT curriculum for Grades 5 and 6. Each mission contains hands-on exercises, teacher tips, and an official merit certificate!'
              : 'Explorează modulele interactive concepute conform Programei Școlare Naționale și Manualelor TIC pentru Clasele a V-a și a VI-a. Fiecare misiune conține exerciții practice, sfaturi de la profesor și o diplomă oficială!'}
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
                      <span>{lang === 'en' ? `Resume Mission (${activeMissionId === 'hardware' ? 'Hardware' : 'Files'})` : `Reia Misiunea (${activeMissionId === 'hardware' ? 'Hardware' : 'Fișiere'})`}</span>
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
              {lang === 'en' ? 'Practical ICT Missions for 5th & 6th Grade' : 'Misiuni Practice TIC Clasa a V-a'}
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
            {lang === 'en' ? '2 Interactive Missions Available' : '2 Misiuni Interactive Disponibile'}
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
                      {lang === 'en' ? `In Progress (Level ${activeMissionLevel}/5)` : `În Curs (Nivel ${activeMissionLevel}/5)`}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-black uppercase tracking-wider animate-pulse">
                    <Sparkles className="w-3 h-3" /> {lang === 'en' ? 'NEW • MODULE 1' : 'NOU • MODULUL 1'}
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-teal-400 mb-1 font-mono">
                {lang === 'en' ? 'Textbook p. 10–20 • Unit 1' : 'Manual pag. 10–20 • Unitatea 1'}
              </div>

              <h3 className="text-xl font-black text-white font-heading mb-1 group-hover:text-teal-300 transition-colors">
                {lang === 'en' ? 'Computing & Communication Systems' : 'Sisteme de calcul și comunicații'}
              </h3>
              <div className="text-xs font-semibold text-slate-300 mb-3">
                {lang === 'en' ? 'PC Architecture, Ergonomics, History & Capacity Math' : 'Arhitectură PC, Ergonomie, Istorie & Calculul Capacității'}
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {lang === 'en'
                  ? 'Learn safety and ergonomics in the computer lab, explore the timeline (1642 Pascaline → 1981 IBM PC), assemble central unit components (CPU, RAM, Motherboard), sort peripherals, and solve the binary capacity math from the textbook!'
                  : 'Învață normele de protecția muncii și ergonomie în laborator, explorează axa timpului (1642 Pascalina → 1981 IBM PC), montează componentele unității centrale (CPU, RAM, Placă de bază), sortează perifericele și rezolvă problema stocării în biți din manual!'}
              </p>

              {/* Badges / Highlights */}
              <div className="flex flex-wrap gap-2 mb-4 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> 20-25 min
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-amber-300 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {lang === 'en' ? '100 Points (Grade 10)' : '100 Puncte (Nota 10)'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-teal-300 flex items-center gap-1">
                  <Award className="w-3 h-3 text-teal-400" /> {lang === 'en' ? 'Hardware Technician Certificate' : 'Diplomă Tehnician Hardware'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between">
              <div className="text-xs text-slate-400 font-mono">
                {activeMissionId === 'hardware' && activeMissionLevel > 1 ? (
                  <span className="text-teal-400 font-bold">
                    {lang === 'en' ? `Progress: Level ${activeMissionLevel}/5 (${activeMissionScore} pts)` : `Progres: Nivel ${activeMissionLevel}/5 (${activeMissionScore} pct)`}
                  </span>
                ) : (
                  <span>{lang === 'en' ? '5 Interactive Levels' : '5 Niveluri interactive'}</span>
                )}
              </div>
              <button
                onClick={() => handleAttemptStart('hardware')}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-teal-600/30 cursor-pointer active:scale-95"
              >
                <span>
                  {activeMissionId === 'hardware' && activeMissionLevel > 1
                    ? (lang === 'en' ? 'Resume Hardware Mission' : 'Continuă Misiunea Hardware')
                    : (lang === 'en' ? 'Start Mission 1' : 'Începe Misiunea 1')}
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
                      {lang === 'en' ? `In Progress (Level ${activeMissionLevel}/7)` : `În Curs (Nivel ${activeMissionLevel}/7)`}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> {lang === 'en' ? 'MODULE 2' : 'MODULUL 2'}
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1 font-mono">
                {lang === 'en' ? 'Textbook p. 22–30 • Unit 2' : 'Manual pag. 22–30 • Unitatea 2'}
              </div>

              <h3 className="text-xl font-black text-white font-heading mb-1 group-hover:text-emerald-300 transition-colors">
                {lang === 'en' ? 'The Secret File Tree & OS Mission' : 'Misiunea Arborele Secret de Fișiere & SO'}
              </h3>
              <div className="text-xs font-semibold text-slate-300 mb-3">
                {lang === 'en' ? 'Windows 10 Interface, Extensions, C:\\ Structure, Shortcuts & Recycle Bin' : 'Interfață Windows 10, Extensii, Structură C:\\, Comenzi Rapide & Recycle Bin'}
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {lang === 'en'
                  ? 'Explore the operating system interface (p. 22–24), learn extension rules and file paths (p. 25–26), build hierarchical directory structures (p. 27–28), find secret files using patterns (*.docx), move files with shortcuts, inspect properties, and restore items from the Recycle Bin!'
                  : 'Explorează interfața sistemului de operare (pag. 22–24), învață regula extensiilor și calea către fișiere (pag. 25–26), construiește structura ierarhică de directoare (pag. 27–28), găsește fișierele secrete cu masca (*.docx), mută documente cu taste rapide, gestionează proprietățile și restaurează datele din Recycle Bin!'}
              </p>

              {/* Badges / Highlights */}
              <div className="flex flex-wrap gap-2 mb-4 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> 20-25 min
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-amber-300 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {lang === 'en' ? '100 Points (Grade 10)' : '100 Puncte (Nota 10)'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-emerald-300 flex items-center gap-1">
                  <Award className="w-3 h-3 text-emerald-400" /> {lang === 'en' ? 'File Architect & OS Certificate' : 'Diplomă Arhitect Fișiere & SO'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between">
              <div className="text-xs text-slate-400 font-mono">
                {activeMissionId === 'files' && activeMissionLevel > 1 ? (
                  <span className="text-emerald-400 font-bold">
                    {lang === 'en' ? `Progress: Level ${activeMissionLevel}/7 (${activeMissionScore} pts)` : `Progres: Nivel ${activeMissionLevel}/7 (${activeMissionScore} pct)`}
                  </span>
                ) : (
                  <span>{lang === 'en' ? '7 Practical Challenges' : '7 Provocări practice'}</span>
                )}
              </div>
              <button
                onClick={() => handleAttemptStart('files')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
              >
                <span>
                  {activeMissionId === 'files' && activeMissionLevel > 1
                    ? (lang === 'en' ? 'Resume Files Mission' : 'Continuă Misiunea Fișiere')
                    : (lang === 'en' ? 'Start Mission 2' : 'Începe Misiunea 2')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 3: ACTIVE MISSION 3A - Internet, Rețele & World Wide Web */}
          <div className="relative group bg-slate-900/80 border border-slate-700/80 hover:border-teal-500/80 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/10 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-2xl border border-teal-500/30">
                  🌐
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> {lang === 'en' ? '6 Interactive Pages' : '6 Pagini Interactive'}
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-teal-400 mb-1 font-mono">
                {lang === 'en' ? 'Textbook p. 32–36 • Mission 3A' : 'Manual pag. 32–36 • Misiunea 3A'}
              </div>

              <h3 className="text-xl font-black text-white font-heading mb-1 group-hover:text-teal-300 transition-colors">
                {lang === 'en' ? 'Internet & World Wide Web Explorer' : 'Explorator Internet, Rețele & Web'}
              </h3>
              <div className="text-xs font-semibold text-slate-300 mb-3">
                {lang === 'en' ? 'ARPANET, TCP/IP, Services, Crossword, URL Anatomy, Browser Lab & Cyber Safety' : 'ARPANET, TCP/IP, Servicii, Rebus, Anatomie URL, Ghid Browser & Siguranță'}
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {lang === 'en'
                  ? 'Discover computer networks & protocols (p. 32), match Internet services (WWW, Email, FTP, IRC, Telnet - p. 33), solve the secret crossword (p. 34), decode URL addresses (p. 34-35), master browser navigation buttons (p. 35-36), and assemble your cybersecurity shield against digital threats!'
                  : 'Descoperă ce este o rețea și protocolul TCP/IP (pag. 32), asociază serviciile Internet (WWW, E-mail, FTP, IRC, Telnet - pag. 33), rezolvă rebusul tematic (pag. 34), descifrează adresele URL (pag. 34-35), stăpânește butoanele de navigare din browser (pag. 35-36) și activează scutul de securitate cibernetică!'}
              </p>

              {/* Badges / Highlights */}
              <div className="flex flex-wrap gap-2 mb-4 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> 15-20 min
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-amber-300 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {lang === 'en' ? '100 Points (Grade 10)' : '100 Puncte (Nota 10)'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-teal-300 flex items-center gap-1">
                  <Award className="w-3 h-3 text-teal-400" /> {lang === 'en' ? 'Web Explorer Certificate' : 'Diplomă Explorator Web'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between">
              <div className="text-xs text-slate-400 font-mono">
                {activeMissionId === 'internet1' && activeMissionLevel > 1 ? (
                  <span className="text-teal-400 font-bold">
                    {lang === 'en' ? `Progress: Page ${activeMissionLevel}/6 (${activeMissionScore} pts)` : `Progres: Pagina ${activeMissionLevel}/6 (${activeMissionScore} pct)`}
                  </span>
                ) : (
                  <span>{lang === 'en' ? 'Theory + Interactive Tasks' : 'Teorie + Exerciții interactive'}</span>
                )}
              </div>
              <button
                onClick={() => handleAttemptStart('internet1')}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-teal-600/30 cursor-pointer active:scale-95"
              >
                <span>
                  {activeMissionId === 'internet1' && activeMissionLevel > 1
                    ? (lang === 'en' ? 'Resume Internet 3A' : 'Continuă Misiunea 3A')
                    : (lang === 'en' ? 'Start Mission 3A' : 'Începe Misiunea 3A')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
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
              <span>{lang === 'en' ? 'Module 4 • 5th Grade' : 'Modulul 4 • Clasa a V-a'}</span>
              <span className="px-3 py-1 rounded-lg bg-slate-800/80 text-slate-400">
                {lang === 'en' ? 'In preparation ⏳' : 'În pregătire ⏳'}
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
            title={lang === 'en' ? 'Instructor Portal (Gradebook & Scoring)' : 'Acces securizat pentru cadre didactice (catalog & notare)'}
          >
            <span className="text-slate-600 text-xs">🔒</span>
            <span>{lang === 'en' ? 'Instructor Portal (Gradebook & Scoring)' : 'Acces cadre didactice (catalog & notare)'}</span>
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

function activeScore(level: number, missionId?: 'hardware' | 'files' | 'internet1' | null): number {
  if (level <= 1) return 0;
  if (missionId === 'hardware') {
    return Math.min((level - 1) * 20, 100);
  }
  if (missionId === 'internet1') {
    const internetScores = [0, 15, 30, 45, 60, 80, 100];
    return internetScores[Math.min(level - 1, 6)] || 0;
  }
  const filesScores = [0, 10, 25, 40, 55, 70, 85, 100];
  return filesScores[Math.min(level - 1, 7)] || 0;
}
