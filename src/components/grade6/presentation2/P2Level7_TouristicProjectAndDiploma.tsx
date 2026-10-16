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
  Heart
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
