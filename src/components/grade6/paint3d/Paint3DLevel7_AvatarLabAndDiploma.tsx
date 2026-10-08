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
  Box, 
  Smile, 
  Wand2, 
  Download,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';

interface Paint3DLevel7Props {
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const Paint3DLevel7_AvatarLabAndDiploma: React.FC<Paint3DLevel7Props> = ({
  onCompletePage,
  studentName = 'Elev Creator 3D',
  onRestartMission,
  onReturnToCatalog
}) => {
  const { lang } = useLanguage();

  // Practical Avatar Lab Checklist
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    step1: true
  });

  // Synthesis Quiz Answers
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const [hasCelebrated, setHasCelebrated] = useState<boolean>(false);

  const handleToggleStep = (stepId: string) => {
    sounds.playRetro('coin');
    setCompletedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const handleAnswerQ1 = (val: string) => {
    if (q1Answer) return;
    setQ1Answer(val);
    if (val === 'xyz_axes') sounds.playCorrect();
    else sounds.playWrong();
  };

  const handleAnswerQ2 = (val: string) => {
    if (q2Answer) return;
    setQ2Answer(val);
    if (val === 'make_3d') sounds.playCorrect();
    else sounds.playWrong();
  };

  const handleAnswerQ3 = (val: string) => {
    if (q3Answer) return;
    setQ3Answer(val);
    if (val === 'left_anchor') sounds.playCorrect();
    else sounds.playWrong();
  };

  const isQ1Correct = q1Answer === 'xyz_axes';
  const isQ2Correct = q2Answer === 'make_3d';
  const isQ3Correct = q3Answer === 'left_anchor';

  const allStepsDone = completedSteps.step1 && completedSteps.step2 && completedSteps.step3 && completedSteps.step4;
  const allQuizzesCorrect = isQ1Correct && isQ2Correct && isQ3Correct;
  const isGraduated = allStepsDone && allQuizzesCorrect;

  // Trigger celebration confetti
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
        // Fallback
      }
      onCompletePage(100);
    }
  }, [isGraduated, hasCelebrated, onCompletePage]);

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-2 border-cyan-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-3xl shadow-inner shrink-0">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-[11px] font-mono font-bold text-cyan-300 uppercase">
                  {lang === 'en' ? 'Unit 2 • Practical Lab & Final Exam (p. 33)' : 'Unitatea 2 • Atelier Practic & Marea Evaluare (pag. 33)'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {lang === 'en' ? 'Screen 7/7 • Graduation' : 'Ecranul 7/7 • Absolvire'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {lang === 'en' 
                  ? '3D Avatar Robot Lab & Unit 2A Junior 3D Creator Diploma' 
                  : 'Atelierul Practic „Avatar Robot 3D” & Marea Diplomă de Creator 3D'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-mono text-cyan-300">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>{lang === 'en' ? '3D Modeler Certified' : 'Modelator 3D Certificat'}</span>
          </div>
        </div>
      </div>

      {/* Practical Avatar Lab Checklist Section */}
      <div className="bg-slate-900/95 border-2 border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Box className="w-5 h-5 text-cyan-400" />
              <span>Ghidul Practic: Crearea unui Avatar Robot 3D (Manual pag. 33)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Bifează etapele parcurse pentru asamblarea personajului tridimensional în Paint 3D:
            </p>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
            allStepsDone
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
              : 'bg-amber-500/20 border-amber-400 text-amber-300'
          }`}>
            {allStepsDone ? '✅ Proiect 3D Validat!' : 'În lucru'}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              id: 'step1',
              title: '1. Corpul Principal & Trunchiul (Cub / Capsulă)',
              desc: 'Inserarea corpului din Forme 3D și poziționarea lui centrală pe planul pânzei.'
            },
            {
              id: 'step2',
              title: '2. Capul & Membrele Asamblate pe Axa Z',
              desc: 'Adăugarea sferei pentru cap și a cilindrilor pentru brațe, aliniate cu ancora de translație din stânga.'
            },
            {
              id: 'step3',
              title: '3. Texturare & Finisaj Metal Lucios',
              desc: 'Aplicarea materialului Glossy Metal și mularea stickerelor (ochi robotici, ecran pe piept).'
            },
            {
              id: 'step4',
              title: '4. Exportul Modelului (.GLB) & Animație Turntable',
              desc: 'Salvarea în format .glb pentru Minecraft/PowerPoint și testarea rotației automate la 360°.'
            }
          ].map(st => (
            <button
              key={st.id}
              type="button"
              onClick={() => handleToggleStep(st.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                completedSteps[st.id]
                  ? 'bg-cyan-950/60 border-cyan-400 text-cyan-100'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center border mt-0.5 shrink-0 ${
                completedSteps[st.id] ? 'bg-cyan-400 text-slate-950 border-cyan-300' : 'border-slate-600'
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
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">Întrebarea 1 din 3</span>
          <h3 className="text-xs sm:text-sm font-bold text-white">
            Care sunt cele 3 coordonate spațiale ale unui obiect 3D?
          </h3>
          <div className="space-y-1.5">
            {[
              { id: 'xyz_axes', label: 'X (Lățime), Y (Înălțime) și Z (Adâncime)' },
              { id: 'abc_axes', label: 'A, B și C' },
              { id: 'xy_only', label: 'Doar X și Y ca pe foaia de hârtie' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={!!q1Answer}
                onClick={() => handleAnswerQ1(opt.id)}
                className={`w-full p-2 rounded-lg border text-left text-xs font-medium cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'xyz_axes'
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Q2 */}
        <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 shadow-lg space-y-3">
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">Întrebarea 2 din 3</span>
          <h3 className="text-xs sm:text-sm font-bold text-white">
            Ce buton detașează o formă 2D de pânză și îi conferă volum 3D?
          </h3>
          <div className="space-y-1.5">
            {[
              { id: 'make_3d', label: 'Butonul „Creare 3D” (Make 3D)' },
              { id: 'eraser', label: 'Radiera' },
              { id: 'clear_all', label: 'Ștergere completă pânză' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={!!q2Answer}
                onClick={() => handleAnswerQ2(opt.id)}
                className={`w-full p-2 rounded-lg border text-left text-xs font-medium cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'make_3d'
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Q3 */}
        <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 shadow-lg space-y-3">
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">Întrebarea 3 din 3</span>
          <h3 className="text-xs sm:text-sm font-bold text-white">
            Ce ancoră de control mută obiectul înainte și înapoi pe axa Z?
          </h3>
          <div className="space-y-1.5">
            {[
              { id: 'left_anchor', label: 'Ancora din Stânga (Translație Z-depth)' },
              { id: 'top_anchor', label: 'Ancora de Sus (Roll)' },
              { id: 'right_anchor', label: 'Ancora din Dreapta (Yaw)' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={!!q3Answer}
                onClick={() => handleAnswerQ3(opt.id)}
                className={`w-full p-2 rounded-lg border text-left text-xs font-medium cursor-pointer ${
                  q3Answer === opt.id
                    ? opt.id === 'left_anchor'
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-400 text-rose-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Graduation Certificate / Diploma */}
      {isGraduated ? (
        <div className="bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 border-4 border-cyan-400/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-scaleUp">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl">🏅</span>
              <div className="inline-block px-4 py-1 rounded-full bg-cyan-400/20 border border-cyan-400 text-cyan-300 font-mono font-black text-xs uppercase tracking-widest">
                DIPLOMĂ OFICIALĂ DE ABSOLVIRE • CLASA A VI-A
              </div>
              <span className="text-4xl">🏅</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 font-heading">
                MODELATOR & CREATOR 3D JUNIOR
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
                Se acordă cu distincție elevului/elevei
              </p>
              <div className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono underline decoration-cyan-400 decoration-wavy py-1">
                {studentName}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed pt-2">
                Pentru stăpânirea coordonatelor spațiale (X, Y, Z), a manipulării pe cele 4 ancore de control, transformarea desenelor 2D în corpuri 3D, aplicarea texturilor și stickerelor mulate pe curburi și generarea animațiilor video în Paint 3D!
              </p>
            </div>

            {/* Diploma Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 py-3 border-y border-slate-700/60">
              <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-cyan-500/40 text-xs font-mono text-cyan-300">
                ⭐ 100% Punctaj Unitatea 2A
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-amber-500/40 text-xs font-mono text-amber-300">
                🏛️ Manual Art Klett • OME 5022/2023
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-indigo-500/40 text-xs font-mono text-indigo-300">
                🧊 Certificat Export .GLB & .3MF
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-sm shadow-lg hover:brightness-110 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Tipărește / Salvează Diploma (PDF)</span>
              </button>

              {onRestartMission && (
                <button
                  type="button"
                  onClick={onRestartMission}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-medium text-sm flex items-center gap-2 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reia Misiunea 2A</span>
                </button>
              )}

              {onReturnToCatalog && (
                <button
                  type="button"
                  onClick={onReturnToCatalog}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Înapoi la Catalogul Cursurilor</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center text-xs font-mono text-cyan-300">
          👉 Bifează toate etapele Atelierului „Avatar Robot 3D” și răspunde corect la cele 3 întrebări pentru a debloca Diploma!
        </div>
      )}
    </div>
  );
};
