import React, { useState } from 'react';
import {
  Award,
  Trophy,
  Sparkles,
  Printer,
  RotateCcw,
  Star,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Mail,
  Cloud
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns, computeGradeDetails, PedagogicalReflectionBanner } from '../../../utils/pedagogicalGrading';

interface EmailLevel7Props {
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const EmailLevel7_DiplomeAndExam: React.FC<EmailLevel7Props> = ({
  onCompletePage,
  studentName = 'Elev Ambasador Netichetă',
  onRestartMission,
  onReturnToCatalog
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);
  const [showPreviewDiploma, setShowPreviewDiploma] = useState<boolean>(false);

  const handleQ1 = (val: string) => {
    if (isLocked('q1') || q1Answer === 'bcc') return;
    setQ1Answer(val);
    if (val === 'bcc') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1', 5);
    }
  };

  const handleQ2 = (val: string) => {
    if (isLocked('q2') || q2Answer === 'cloud') return;
    setQ2Answer(val);
    if (val === 'cloud') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2', 5);
    }
  };

  const handleQ3 = (val: string) => {
    if (isLocked('q3') || q3Answer === 'shouting') return;
    setQ3Answer(val);
    if (val === 'shouting') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3', 5);
    }
  };

  const isQ1Correct = q1Answer === 'bcc';
  const isQ2Correct = q2Answer === 'cloud';
  const isQ3Correct = q3Answer === 'shouting';

  const correctCount = [isQ1Correct, isQ2Correct, isQ3Correct].filter(Boolean).length;
  const allAnswered = !!(q1Answer && q2Answer && q3Answer);

  const earnedScore = Math.min(100, correctCount * 30 + (allAnswered ? 10 : 0));
  const gradeDetails = computeGradeDetails(earnedScore, 100);

  const handleFinalize = () => {
    sounds.playFanfare();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
    onCompletePage(earnedScore);
  };

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/90 via-slate-900 to-indigo-950 border-2 border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono font-bold border border-purple-500/40">
                {isEn ? 'Unit 3 • Final Exam & Diploma • Grade 6' : 'Unitatea 3 • Marea Diplomă & Evaluare Finală • Clasa a VI-a'}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40 flex items-center gap-1">
                <Star className="w-3 h-3 fill-emerald-400" />
                100 XP
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-purple-600/30 border border-purple-500/50 text-2xl">
                📬
              </span>
              <span>
                {isEn ? 'Netiquette Ambassador & Cloud Master' : 'Ambasadorul Netichetei & Comunicații Cloud'}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {isEn
                ? 'Answer the 3 official curriculum synthesis questions to validate your knowledge and claim your official certified Diploma!'
                : 'Răspunde la cele 3 întrebări de sinteză didactică din manual pentru a valida competențele de comunicare electronică și a revendica Diploma Oficială!'}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/60 p-4 rounded-2xl border border-purple-500/30 shrink-0">
            <Mail className="w-8 h-8 text-purple-400" />
            <Cloud className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* 3 Final Exam Questions */}
      <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-sm uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Testul Final de Certificare (Răspunde la toate cele 3 întrebări)</span>
        </div>

        {/* Q1 */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <span className="text-xs font-mono font-bold text-blue-400 block">Întrebarea 1 din 3:</span>
          <p className="text-xs sm:text-sm text-slate-200 font-medium">
            Ce câmp de adresare ascunde complet adresele de e-mail ale destinatarilor unii de alții, respectând normele de confidențialitate și GDPR?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQ1('to')}
              disabled={isLocked('q1') || isQ1Correct}
              className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                q1Answer === 'to' ? 'bg-rose-950/80 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}
            >
              A. Câmpul TO (Către)
            </button>
            <button
              type="button"
              onClick={() => handleQ1('cc')}
              disabled={isLocked('q1') || isQ1Correct}
              className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                q1Answer === 'cc' ? 'bg-rose-950/80 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}
            >
              B. Câmpul CC (Copie)
            </button>
            <button
              type="button"
              onClick={() => handleQ1('bcc')}
              disabled={isLocked('q1') || isQ1Correct}
              className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                q1Answer === 'bcc' ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}
            >
              C. Câmpul BCC (Copie Ascunsă)
            </button>
          </div>

          {cooldowns.q1 && cooldowns.q1 > 0 ? (
            <PedagogicalReflectionBanner cooldown={cooldowns.q1} />
          ) : null}

          {q1Answer && (
            <div className="text-[11px] font-mono text-slate-300 pt-1">
              {q1Answer === 'bcc' ? '✓ Corect! BCC asigură discreția adreselor.' : '✕ Greșit. Doar BCC păstrează adresele secrete. Te rugăm să reflectezi 5 secunde înainte de a reîncerca!'}
            </div>
          )}
        </div>

        {/* Q2 */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <span className="text-xs font-mono font-bold text-amber-400 block">Întrebarea 2 din 3:</span>
          <p className="text-xs sm:text-sm text-slate-200 font-medium">
            Vrei să transmiți un videoclip de 150 MB către colegii de grupă. Cum procedezi corect?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQ2('direct_fail')}
              disabled={isLocked('q2') || isQ2Correct}
              className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                q2Answer === 'direct_fail' ? 'bg-rose-950/80 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}
            >
              A. Îl atașezi direct în e-mail indiferent de erori
            </button>
            <button
              type="button"
              onClick={() => handleQ2('cloud')}
              disabled={isLocked('q2') || isQ2Correct}
              className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                q2Answer === 'cloud' ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}
            >
              B. Îl încarci în Cloud (Google Drive / OneDrive) și trimiți link de acces securizat
            </button>
          </div>

          {cooldowns.q2 && cooldowns.q2 > 0 ? (
            <PedagogicalReflectionBanner cooldown={cooldowns.q2} />
          ) : null}

          {q2Answer && (
            <div className="text-[11px] font-mono text-slate-300 pt-1">
              {q2Answer === 'cloud' ? '✓ Corect! Limita de 25MB impune folosirea Cloud-ului.' : '✕ Greșit. E-mailul blochează atașamentele peste 25 MB. Te rugăm să reflectezi 5 secunde!'}
            </div>
          )}
        </div>

        {/* Q3 */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <span className="text-xs font-mono font-bold text-emerald-400 block">Întrebarea 3 din 3:</span>
          <p className="text-xs sm:text-sm text-slate-200 font-medium">
            Conform regulilor de Netichetă, de ce este considerat nepoliticos să scrii un e-mail integral cu litere mari (MAJUSCULE)?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQ3('shouting')}
              disabled={isLocked('q3') || isQ3Correct}
              className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                q3Answer === 'shouting' ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}
            >
              A. Pentru că este perceput ca un STRIGĂT agresiv la adresa cititorului
            </button>
            <button
              type="button"
              onClick={() => handleQ3('hard_disk')}
              disabled={isLocked('q3') || isQ3Correct}
              className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                q3Answer === 'hard_disk' ? 'bg-rose-950/80 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}
            >
              B. Pentru că ocupă mai mult spațiu pe hard disk
            </button>
          </div>

          {cooldowns.q3 && cooldowns.q3 > 0 ? (
            <PedagogicalReflectionBanner cooldown={cooldowns.q3} />
          ) : null}

          {q3Answer && (
            <div className="text-[11px] font-mono text-slate-300 pt-1">
              {q3Answer === 'shouting' ? '✓ Corect! Scrierea cu majuscule înseamnă țipăt în mediul digital.' : '✕ Greșit. Majusculele transmit agresivitate verbală. Te rugăm să reflectezi 5 secunde!'}
            </div>
          )}
        </div>
      </div>

      {/* Capstone Evaluation Summary Card */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-950 border-2 border-purple-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-3xl shadow-inner">
          🏆
        </div>

        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {isEn ? 'Synthesis Evaluation Completed' : 'Evaluare Finală Modulul 3B'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            {isEn
              ? 'Your official score and educational grade are dynamically calculated.'
              : 'Punctajul și nota sunt calculate dinamic în baza răspunsurilor și timpului de reflecție.'}
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
            {isEn ? gradeDetails.calificativEn : gradeDetails.calificativRo}
          </span>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleFinalize}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 cursor-pointer transition transform active:scale-95 flex items-center gap-2.5"
          >
            <Trophy className="w-5 h-5" />
            <span>{isEn ? 'Finalize Mission & Claim Official Diploma!' : 'Finalizează Misiunea 3B & Revendică Marea Diplomă!'}</span>
          </button>

        </div>
      </div>
    </div>
  );
};
