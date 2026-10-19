import React, { useState } from 'react';
import { 
  Award, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Printer, 
  RotateCcw, 
  Star,
  Check,
  Zap,
  Globe,
  MonitorPlay,
  Heart,
  Download,
  Play,
  Layout,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { useQuestionCooldowns, computeGradeDetails } from '../../../utils/pedagogicalGrading';

interface P2Level7Props {
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const P2Level7_TouristicProjectAndDiploma: React.FC<P2Level7Props> = ({
  onCompletePage,
  studentName = 'Elev Explorator',
  onRestartMission,
  onReturnToCatalog
}) => {
  const { lang } = useLanguage();

  // Synthesis Quiz Answers
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  // Practical Project Steps State
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    step1: true
  });
  const [hasCelebrated, setHasCelebrated] = useState<boolean>(false);
  const [isFinalized, setIsFinalized] = useState<boolean>(false);

  // Touristic Project Presentation Deckbuilder State
  const [selectedDestination, setSelectedDestination] = useState<'peles' | 'delta' | 'sighisoara' | 'maramures'>('peles');
  const [selectedTheme, setSelectedTheme] = useState<'teal' | 'sunset' | 'emerald' | 'midnight'>('teal');
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isF5Mode, setIsF5Mode] = useState<boolean>(false);

  const handleDownloadPresentation = () => {
    sounds.playRetro('powerup');
    const projectData = {
      projectType: 'PowerPoint_Touristic_Project',
      unit: 'Clasa a VI-a • Unitatea 1 (Prezentări)',
      studentName,
      destination: selectedDestination,
      theme: selectedTheme,
      slideCount: 4,
      aspectRatio: '16:9 Widescreen',
      rulesEnforced: ['Rule 6x6', 'High Contrast WCAG', 'Proportional Resizing', 'Morph Transitions'],
      gradeDetails,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Proiect_Prezentare_${selectedDestination}_${studentName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleToggleStep = (stepId: string) => {
    sounds.playRetro('coin');
    setCompletedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const handleAnswerQ1 = (val: string) => {
    if (isLocked('q1')) return;
    setQ1Answer(val);
    if (val === 'ctrl_m') sounds.playCorrect();
    else {
      sounds.playWrong();
      triggerCooldown('q1', 5);
    }
  };

  const handleAnswerQ2 = (val: string) => {
    if (isLocked('q2')) return;
    setQ2Answer(val);
    if (val === 'f5') sounds.playCorrect();
    else {
      sounds.playWrong();
      triggerCooldown('q2', 5);
    }
  };

  const handleAnswerQ3 = (val: string) => {
    if (isLocked('q3')) return;
    setQ3Answer(val);
    if (val === 'rule_contrast') sounds.playCorrect();
    else {
      sounds.playWrong();
      triggerCooldown('q3', 5);
    }
  };

  const isQ1Correct = q1Answer === 'ctrl_m';
  const isQ2Correct = q2Answer === 'f5';
  const isQ3Correct = q3Answer === 'rule_contrast';

  const projectStepsDone = Object.values(completedSteps).filter(Boolean).length;
  const correctQuizzes = [isQ1Correct, isQ2Correct, isQ3Correct].filter(Boolean).length;
  const allProjectStepsDone = projectStepsDone >= 4;
  const allQuizzesCorrect = isQ1Correct && isQ2Correct && isQ3Correct;
  const isGraduated = allProjectStepsDone && allQuizzesCorrect;

  const earnedScore = Math.min(100, Math.round((projectStepsDone / 4) * 40 + (correctQuizzes / 3) * 60));
  const gradeDetails = computeGradeDetails(earnedScore, 100);

  // Trigger celebration confetti once when graduated
  React.useEffect(() => {
    if (isGraduated && !hasCelebrated) {
      setHasCelebrated(true);
      sounds.playVictory();
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback if confetti fails
      }
    }
  }, [isGraduated, hasCelebrated]);

  const handleFinalizeMission = () => {
    sounds.playVictory();
    setIsFinalized(true);
    onCompletePage(earnedScore);
  };

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Pedagogical Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 border-2 border-teal-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-400 flex items-center justify-center text-3xl shadow-inner shrink-0">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 border border-teal-400/40 text-[11px] font-mono font-bold text-teal-300 uppercase">
                  {lang === 'en' ? 'Unit 1 • Practical Project & Final Exam (p. 24-25)' : 'Unitatea 1 • Proiect & Marea Evaluare (pag. 24-25)'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {lang === 'en' ? 'Screen 7/7 • Graduation' : 'Ecranul 7/7 • Absolvire'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {lang === 'en' 
                  ? 'Practical Project "Touristic Romania" & Unit 1 Diploma' 
                  : 'Proiectul Practic „România Turistică” & Marea Diplomă a Unității 1'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-mono text-teal-300">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>{lang === 'en' ? 'Pro Presenter Graduation' : 'Absolvire Prezentări Pro'}</span>
          </div>
        </div>
      </div>

      {/* Interactive Slide Deckbuilder Studio */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950/30 to-slate-900 border-2 border-teal-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-xl shadow-inner font-bold">
              <MonitorPlay className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white font-heading">
                {lang === 'en' ? 'Interactive Slide Deckbuilder Studio (F5)' : 'Atelierul Interactiv de Compoziție Diapozitive „România Turistică”'}
              </h2>
              <p className="text-xs text-slate-300">
                {lang === 'en'
                  ? 'Compose the 4-slide presentation deck, apply professional themes, and run the F5 slideshow player.'
                  : 'Compune prezentarea pe 4 diapozitive, aplică tema grafică unitară și rulează expunerea F5.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPresentation}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>{lang === 'en' ? 'Export Project (.json)' : 'Exportă Proiectul (.json)'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playRetro('powerup');
                setIsF5Mode(prev => !prev);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-lg ${
                isF5Mode
                  ? 'bg-amber-500 text-slate-950 shadow-amber-500/30'
                  : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>{isF5Mode ? 'Ieșire Expunere (ESC)' : 'Pornire Expunere (F5)'}</span>
            </button>
          </div>
        </div>

        {/* Studio Controls: Destination + Theme Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-mono font-bold text-slate-300 uppercase block mb-1.5">
              {lang === 'en' ? 'Choose Touristic Destination:' : 'Alege Destinația Turistică a României:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'peles', label: 'Castelul Peleș (Sinaia) 🏰' },
                { id: 'delta', label: 'Delta Dunării 🦆' },
                { id: 'sighisoara', label: 'Cetatea Sighișoara 🛡️' },
                { id: 'maramures', label: 'Biserici Maramureș ⛪' }
              ].map(d => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setSelectedDestination(d.id as any);
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-left transition cursor-pointer ${
                    selectedDestination === d.id
                      ? 'bg-teal-500/20 border-teal-400 text-teal-200 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono font-bold text-slate-300 uppercase block mb-1.5">
              {lang === 'en' ? 'Presentation Color Theme (Fila Proiectare):' : 'Temă Grafică Coordonată (Fila Proiectare):'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'teal', label: 'Teal Modern (Degrade Marin) 🌊' },
                { id: 'sunset', label: 'Sunset Amber (Apus Cald) 🌅' },
                { id: 'emerald', label: 'Forest Emerald (Natură Verde) 🌲' },
                { id: 'midnight', label: 'Royal Midnight (Bleumarin/Aur) 👑' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedTheme(t.id as any);
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-left transition cursor-pointer ${
                    selectedTheme === t.id
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 16:9 Slide Canvas Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Layout className="w-4 h-4 text-teal-400" />
              <span>Diapozitivul #{activeSlideIndex + 1} din 4 (Format 16:9 Widescreen)</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={activeSlideIndex === 0}
                onClick={() => {
                  sounds.playClick();
                  setActiveSlideIndex(prev => Math.max(0, prev - 1));
                }}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-bold text-teal-300">{activeSlideIndex + 1} / 4</span>
              <button
                type="button"
                disabled={activeSlideIndex === 3}
                onClick={() => {
                  sounds.playClick();
                  setActiveSlideIndex(prev => Math.min(3, prev + 1));
                }}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Slide Box 16:9 */}
          <div className={`w-full aspect-video rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between border-2 transition-all ${
            selectedTheme === 'teal'
              ? 'bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 border-teal-500/60 text-white'
              : selectedTheme === 'sunset'
              ? 'bg-gradient-to-br from-slate-950 via-amber-950 to-orange-950 border-amber-500/60 text-white'
              : selectedTheme === 'emerald'
              ? 'bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 border-emerald-500/60 text-white'
              : 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border-indigo-500/60 text-white'
          }`}>
            {/* Slide Header metadata */}
            <div className="flex items-center justify-between text-[11px] font-mono opacity-70 border-b border-white/10 pb-2">
              <span>PROIECT TIC CLASA A VI-A • ROMÂNIA TURISTICĂ</span>
              <span>16:9 Widescreen • Morf Tranziție</span>
            </div>

            {/* Slide 1: Cover */}
            {activeSlideIndex === 0 && (
              <div className="my-auto text-center space-y-3 animate-fadeIn">
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono font-bold tracking-wider uppercase">
                  Ghid Turistic Oficial
                </span>
                <h1 className="text-2xl sm:text-4xl font-black font-heading tracking-tight drop-shadow-lg">
                  {selectedDestination === 'peles' && 'Castelul Peleș — Perla Regală a Carpaților'}
                  {selectedDestination === 'delta' && 'Delta Dunării — Paradisul Păsărilor din România'}
                  {selectedDestination === 'sighisoara' && 'Cetatea Sighișoara — Farmecul Istoriei Medievale'}
                  {selectedDestination === 'maramures' && 'Maramureșul Istoric — Tradiții și Biserici de Lemn'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
                  O călătorie spectaculoasă prin cele mai frumoase atracții naturale și culturale românești.
                </p>
                <div className="pt-2 text-xs font-mono font-semibold text-teal-300">
                  Prezentat de: {studentName} • Elev Clasa a VI-a
                </div>
              </div>
            )}

            {/* Slide 2: Top Attractions */}
            {activeSlideIndex === 1 && (
              <div className="my-auto grid grid-cols-1 sm:grid-cols-2 gap-6 items-center animate-fadeIn">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-teal-300">Diapozitivul 2 • Atracții Cheie</span>
                  <h2 className="text-xl sm:text-2xl font-black">Ce Vizităm & De Ce Ne Fascinează</h2>
                  <ul className="text-xs sm:text-sm space-y-1.5 text-slate-200">
                    <li>• Peisaje alpine și arhitectură neorenascentistă unică</li>
                    <li>• Muzee bogate în istorie și colecții de artă de patrimoniu</li>
                    <li>• Trasee turistice accesibile pentru elevi și familii</li>
                  </ul>
                  <div className="text-[10px] text-emerald-300 font-mono pt-1">
                    ✓ Regula 6x6 respectată: sub 6 rânduri, lizibilitate maximă!
                  </div>
                </div>
                <div className="bg-slate-900/80 border border-white/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg">
                  <div className="text-4xl mb-2">📸</div>
                  <span className="text-xs font-bold text-white">Fotografie de Înaltă Rezoluție</span>
                  <span className="text-[10px] text-slate-400 mt-1">Încadrare proporțională cu colțurile Shift (fără deformare)</span>
                </div>
              </div>
            )}

            {/* Slide 3: Travel Schedule Table */}
            {activeSlideIndex === 2 && (
              <div className="my-auto space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-black">Planificarea Excursiei & Buget (Tabel 3x3)</h2>
                  <span className="text-[10px] font-mono text-teal-300">Inserare ➔ Tabel (Ctrl+Alt+T)</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/20 bg-white/10 font-bold">
                        <th className="p-2">Ziua</th>
                        <th className="p-2">Obiectiv / Activitate</th>
                        <th className="p-2">Cost Estimat / Elev</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-slate-200">
                      <tr>
                        <td className="p-2 font-mono font-bold">Ziua 1</td>
                        <td className="p-2">Tur ghidat și vizită muzee locale</td>
                        <td className="p-2 font-mono text-emerald-300">35 lei</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono font-bold">Ziua 2</td>
                        <td className="p-2">Drumeție în natură și atelier foto</td>
                        <td className="p-2 font-mono text-emerald-300">20 lei</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono font-bold">Ziua 3</td>
                        <td className="p-2">Recapitulare și prezentare impresii</td>
                        <td className="p-2 font-mono text-emerald-300">Gratuit</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Slide 4: Tips & 40-Words Rule */}
            {activeSlideIndex === 3 && (
              <div className="my-auto text-center space-y-3 animate-fadeIn">
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono font-bold text-amber-300">
                  Diapozitivul 4 • Concluzii & Recomandări
                </span>
                <h2 className="text-xl sm:text-2xl font-black">Sfaturi de Aur pentru Călători Responsabili</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                    <span className="font-bold block mb-1">🌿 Protejează</span>
                    <span className="text-slate-300 text-[11px]">Nu lăsa deșeuri în rezervațiile naturale.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                    <span className="font-bold block mb-1">🧭 Explorează</span>
                    <span className="text-slate-300 text-[11px]">Ascultă ghidul și respectă regulile locale.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                    <span className="font-bold block mb-1">✨ Împărtășește</span>
                    <span className="text-slate-300 text-[11px]">Prezintă impresiile colegilor de clasă.</span>
                  </div>
                </div>
                <div className="text-[10px] text-teal-300 font-mono">
                  Total cuvinte: 36 (Sub limita de 40 cuvinte/slide!)
                </div>
              </div>
            )}

            {/* Slide Footer */}
            <div className="flex items-center justify-between text-[10px] font-mono opacity-70 border-t border-white/10 pt-2">
              <span>{studentName} • Școala Gimnazială</span>
              <span>Slide {activeSlideIndex + 1} / 4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Practical Project Checklist Section */}
      <div className="bg-slate-900/95 border-2 border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-teal-400" />
              <span>{lang === 'en' ? 'Project "Touristic Romania": Step-by-Step Guide' : 'Ghidul Proiectului „România Turistică” (Manual pag. 24-25)'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Check each milestone to ensure your presentation meets the official curriculum standards.'
                : 'Bifează fiecare etapă finalizată pentru a asigura respectarea standardelor curriculare.'}
            </p>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
            allProjectStepsDone
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
              : 'bg-amber-500/20 border-amber-400 text-amber-300'
          }`}>
            {allProjectStepsDone ? '✅ Proiect Validat!' : 'Etapa de Lucru'}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              id: 'step1',
              title: '1. Structură pe 4 Diapozitive (Ctrl+M)',
              desc: 'Slide 1 (Copertă), Slide 2 (Atracții & Imagini), Slide 3 (Tabel 3x3 Cazare/Buget), Slide 4 (Concluzii & Sfaturi de călătorie).'
            },
            {
              id: 'step2',
              title: '2. Format Panoramic 16:9 & Temă Unitară',
              desc: 'Aplicarea unei teme coordonate din fila Proiectare și ajustarea fundalului cu un degrade elegant.'
            },
            {
              id: 'step3',
              title: '3. Animații Discrete & Tranziție Morfare',
              desc: 'Efecte de Intrare (verzi) pe titluri și o tranziție lină între slide-uri (fără excese sonore).'
            },
            {
              id: 'step4',
              title: '4. Respectarea Regulii celor 40 de Cuvinte',
              desc: 'Text concis, contrast maxim între scris și fundal, imagini clare redimensionate proporțional.'
            }
          ].map(st => (
            <button
              key={st.id}
              type="button"
              onClick={() => handleToggleStep(st.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                completedSteps[st.id]
                  ? 'bg-teal-950/60 border-teal-400 text-teal-100'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center border mt-0.5 shrink-0 ${
                completedSteps[st.id] ? 'bg-teal-400 text-slate-950 border-teal-300' : 'border-slate-600'
              }`}>
                {completedSteps[st.id] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <div>
                <div className="text-xs font-bold text-white mb-0.5">{st.title}</div>
                <div className="text-[11px] text-slate-300 leading-snug">{st.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Synthesis Evaluation Quiz (3 Questions) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Q1 */}
        <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 shadow-lg space-y-3">
          <span className="text-[10px] font-mono font-bold text-teal-400 uppercase">Întrebarea 1 din 3</span>
          <h3 className="text-xs sm:text-sm font-bold text-white">
            Ce scurtătură rapidă de tastatură inserează un Diapozitiv Nou?
          </h3>
          <div className="space-y-1.5">
            {[
              { id: 'ctrl_m', label: 'Ctrl + M (New Slide)' },
              { id: 'ctrl_n', label: 'Ctrl + N (New Document)' },
              { id: 'ctrl_s', label: 'Ctrl + S (Salvare)' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={isLocked('q1') || isQ1Correct}
                onClick={() => handleAnswerQ1(opt.id)}
                className={`w-full p-2 rounded-lg border text-left text-xs font-medium cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'ctrl_m'
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {cooldowns.q1 && cooldowns.q1 > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.q1}
              totalSeconds={5}
              customMessageRo="Timp de reflecție: Ctrl+M adaugă diapozitiv nou, iar Ctrl+N document nou!"
            />
          ) : null}
        </div>

        {/* Q2 */}
        <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 shadow-lg space-y-3">
          <span className="text-[10px] font-mono font-bold text-teal-400 uppercase">Întrebarea 2 din 3</span>
          <h3 className="text-xs sm:text-sm font-bold text-white">
            Ce tastă pornește expunerea (Slide Show) pe tot ecranul?
          </h3>
          <div className="space-y-1.5">
            {[
              { id: 'f5', label: 'Tasta F5' },
              { id: 'f1', label: 'Tasta F1 (Ajutor)' },
              { id: 'enter', label: 'Tasta Enter' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={isLocked('q2') || isQ2Correct}
                onClick={() => handleAnswerQ2(opt.id)}
                className={`w-full p-2 rounded-lg border text-left text-xs font-medium cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'f5'
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {cooldowns.q2 && cooldowns.q2 > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.q2}
              totalSeconds={5}
              customMessageRo="Timp de reflecție: Tasta F5 lansează prezentarea de la primul slide!"
            />
          ) : null}
        </div>

        {/* Q3 */}
        <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 shadow-lg space-y-3">
          <span className="text-[10px] font-mono font-bold text-teal-400 uppercase">Întrebarea 3 din 3</span>
          <h3 className="text-xs sm:text-sm font-bold text-white">
            Ce regulă garantează lizibilitatea perfectă a textului pe slide?
          </h3>
          <div className="space-y-1.5">
            {[
              { id: 'rule_contrast', label: 'Contrast puternic & sub 40 cuvinte' },
              { id: 'rainbow_text', label: 'Scris cu 7 culori diferite' },
              { id: 'all_caps', label: 'Scris doar cu litere mari' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={isLocked('q3') || isQ3Correct}
                onClick={() => handleAnswerQ3(opt.id)}
                className={`w-full p-2 rounded-lg border text-left text-xs font-medium cursor-pointer ${
                  q3Answer === opt.id
                    ? opt.id === 'rule_contrast'
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {cooldowns.q3 && cooldowns.q3 > 0 ? (
            <PedagogicalReflectionBanner
              cooldown={cooldowns.q3}
              totalSeconds={5}
              customMessageRo="Timp de reflecție: Contrastul optim și regula celor 40 de cuvinte!"
            />
          ) : null}
        </div>
      </div>

      {/* Capstone Evaluation Summary Card & Finalization */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-950 border-2 border-indigo-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-3xl shadow-inner">
          🏆
        </div>

        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {lang === 'en' ? 'Synthesis Evaluation Completed' : 'Evaluare Finală Modulul 1B'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            {lang === 'en'
              ? 'Your score is dynamically calculated based on your practical project steps and final quiz.'
              : 'Punctajul și nota sunt calculate dinamic în baza etapelor proiectului și întrebărilor finale.'}
          </p>
        </div>

        {/* Dynamic Score & Grade Badge */}
        <div className="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-950/90 border border-amber-500/50 shadow-lg">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          <span className="text-base sm:text-lg font-black text-amber-300 font-mono">
            Punctaj: {earnedScore} / 100 Puncte
          </span>
          <span className="text-slate-500 font-bold">•</span>
          <span className="text-sm sm:text-base font-bold text-emerald-300">
            {gradeDetails.calificativRo}
          </span>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleFinalizeMission}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 cursor-pointer transition transform active:scale-95 flex items-center gap-2.5"
          >
            <Trophy className="w-5 h-5" />
            <span>{lang === 'en' ? 'Finalize Mission 1B & Claim Official Diploma!' : 'Finalizează Misiunea 1B & Revendică Marea Diplomă!'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
