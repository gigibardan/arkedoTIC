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

  // Practical Project Steps State
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    step1: true
  });
  const [hasCelebrated, setHasCelebrated] = useState<boolean>(false);

  const handleToggleStep = (stepId: string) => {
    sounds.playRetro('coin');
    setCompletedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const handleAnswerQ1 = (val: string) => {
    if (q1Answer) return;
    setQ1Answer(val);
    if (val === 'ctrl_m') sounds.playCorrect();
    else sounds.playWrong();
  };

  const handleAnswerQ2 = (val: string) => {
    if (q2Answer) return;
    setQ2Answer(val);
    if (val === 'f5') sounds.playCorrect();
    else sounds.playWrong();
  };

  const handleAnswerQ3 = (val: string) => {
    if (q3Answer) return;
    setQ3Answer(val);
    if (val === 'rule_contrast') sounds.playCorrect();
    else sounds.playWrong();
  };

  const isQ1Correct = q1Answer === 'ctrl_m';
  const isQ2Correct = q2Answer === 'f5';
  const isQ3Correct = q3Answer === 'rule_contrast';

  const allProjectStepsDone = completedSteps.step1 && completedSteps.step2 && completedSteps.step3 && completedSteps.step4;
  const allQuizzesCorrect = isQ1Correct && isQ2Correct && isQ3Correct;
  const isGraduated = allProjectStepsDone && allQuizzesCorrect;

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
        // Fallback if confetti fails
      }
      onCompletePage(100);
    }
  }, [isGraduated, hasCelebrated, onCompletePage]);

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
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
                disabled={!!q1Answer}
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
                disabled={!!q2Answer}
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
                disabled={!!q3Answer}
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
        </div>
      </div>

      {/* Graduation Certificate / Diploma */}
      {isGraduated ? (
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-4 border-amber-400/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-scaleUp">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl">🏅</span>
              <div className="inline-block px-4 py-1 rounded-full bg-amber-400/20 border border-amber-400 text-amber-300 font-mono font-black text-xs uppercase tracking-widest">
                DIPLOMĂ OFICIALĂ DE ABSOLVIRE • CLASA A VI-A
              </div>
              <span className="text-4xl">🏅</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 font-heading">
                MAESTRU AL PREZENTĂRILOR & PUBLIC SPEAKING
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
                Se acordă cu distincție elevului/elevei
              </p>
              <div className="text-2xl sm:text-3xl font-black text-teal-300 font-mono underline decoration-amber-400 decoration-wavy py-1">
                {studentName}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed pt-2">
                Pentru stăpânirea completă a aplicațiilor de prezentare electronică (PowerPoint), a tehnicilor de design vizual (Regula celor 40 de cuvinte, contraste optime, format 16:9), a inserării elementelor multimedia și a artei susținerii discursului în fața publicului!
              </p>
            </div>

            {/* Diploma Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 py-3 border-y border-slate-700/60">
              <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-teal-500/40 text-xs font-mono text-teal-300">
                ⭐ 100% Punctaj Unitatea 1
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-amber-500/40 text-xs font-mono text-amber-300">
                🏛️ Manual Art Klett • OME 5022/2023
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-indigo-500/40 text-xs font-mono text-indigo-300">
                🎙️ Certificat Public Speaker Junior
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-sm shadow-lg hover:brightness-110 flex items-center gap-2 cursor-pointer transition-all"
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
                  <span>Reia Misiunea</span>
                </button>
              )}

              {onReturnToCatalog && (
                <button
                  type="button"
                  onClick={onReturnToCatalog}
                  className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Înapoi la Catalogul Cursurilor</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center text-xs font-mono text-amber-300">
          👉 Bifează toate etapele Proiectului „România Turistică” și răspunde corect la cele 3 întrebări pentru a debloca Diploma!
        </div>
      )}
    </div>
  );
};
