import React, { useState } from 'react';
import {
  Award,
  Trophy,
  Sparkles,
  CheckCircle2,
  XCircle,
  Printer,
  RotateCcw,
  Star,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Mail,
  Cloud,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';

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

  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  const [hasCelebrated, setHasCelebrated] = useState<boolean>(false);

  const handleQ1 = (val: string) => {
    if (q1Answer) return;
    setQ1Answer(val);
    if (val === 'bcc') sounds.playCorrect();
    else sounds.playWrong();
  };

  const handleQ2 = (val: string) => {
    if (q2Answer) return;
    setQ2Answer(val);
    if (val === 'cloud') sounds.playCorrect();
    else sounds.playWrong();
  };

  const handleQ3 = (val: string) => {
    if (q3Answer) return;
    setQ3Answer(val);
    if (val === 'shouting') sounds.playCorrect();
    else sounds.playWrong();
  };

  const isExamPassed = q1Answer === 'bcc' && q2Answer === 'cloud' && q3Answer === 'shouting';

  const triggerCelebration = () => {
    if (hasCelebrated) return;
    setHasCelebrated(true);
    sounds.playFanfare();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
    onCompletePage(100);
  };

  if (isExamPassed && !hasCelebrated) {
    triggerCelebration();
  }

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
                <Sparkles className="w-3.5 h-3.5" />
                {isEn ? 'Level 7 of 7' : 'Nivelul 7 din 7'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-wide">
              {isEn ? 'Netiquette Ambassador Exam & Official Diploma' : 'Examenul de Inspector de Netichetă & Diploma Oficială'}
            </h1>
            <p className="text-sm text-purple-200/90 mt-2 max-w-2xl leading-relaxed">
              {isEn
                ? 'Answer the 3 final evaluation questions correctly to unlock the official 6th Grade Digital Communications & Netiquette Diploma!'
                : 'Răspunde corect la cele 3 întrebări de evaluare finală pentru a debloca Diploma Oficială de Ambasador al Netichetei & Comunicațiilor Digitale!'}
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border-2 border-purple-400/40 flex items-center justify-center text-3xl shadow-inner shrink-0">
            🎓
          </div>
        </div>
      </div>

      {/* 3 Final Exam Questions */}
      {!isExamPassed && (
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
                disabled={!!q1Answer}
                className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                  q1Answer === 'to' ? 'bg-rose-950/80 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                A. Câmpul TO (Către)
              </button>
              <button
                type="button"
                onClick={() => handleQ1('cc')}
                disabled={!!q1Answer}
                className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                  q1Answer === 'cc' ? 'bg-rose-950/80 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                B. Câmpul CC (Copie)
              </button>
              <button
                type="button"
                onClick={() => handleQ1('bcc')}
                disabled={!!q1Answer}
                className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                  q1Answer === 'bcc' ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                C. Câmpul BCC (Copie Ascunsă)
              </button>
            </div>
            {q1Answer && (
              <div className="text-[11px] font-mono text-slate-300 pt-1">
                {q1Answer === 'bcc' ? '✓ Corect! BCC asigură discreția adreselor.' : '✕ Greșit. Doar BCC păstrează adresele secrete.'}
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
                disabled={!!q2Answer}
                className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                  q2Answer === 'direct_fail' ? 'bg-rose-950/80 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                A. Îl atașezi direct în e-mail indiferent de erori
              </button>
              <button
                type="button"
                onClick={() => handleQ2('cloud')}
                disabled={!!q2Answer}
                className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                  q2Answer === 'cloud' ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                B. Îl încarci în Cloud (Google Drive / OneDrive) și trimiți link de acces securizat
              </button>
            </div>
            {q2Answer && (
              <div className="text-[11px] font-mono text-slate-300 pt-1">
                {q2Answer === 'cloud' ? '✓ Corect! Limita de 25MB impune folosirea Cloud-ului.' : '✕ Greșit. E-mailul blochează atașamentele peste 25 MB.'}
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
                disabled={!!q3Answer}
                className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                  q3Answer === 'shouting' ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                A. Pentru că este perceput ca un STRIGĂT agresiv la adresa cititorului
              </button>
              <button
                type="button"
                onClick={() => handleQ3('hard_disk')}
                disabled={!!q3Answer}
                className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                  q3Answer === 'hard_disk' ? 'bg-rose-950/80 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                B. Pentru că ocupă mai mult spațiu pe hard disk
              </button>
            </div>
            {q3Answer && (
              <div className="text-[11px] font-mono text-slate-300 pt-1">
                {q3Answer === 'shouting' ? '✓ Corect! Scrierea cu majuscule înseamnă țipăt în mediul digital.' : '✕ Greșit. Majusculele transmit agresivitate verbală.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Official Diploma Screen */}
      {isExamPassed && (
        <div className="space-y-6">
          {/* Printable Diploma Frame */}
          <div
            id="official-diploma-print"
            className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-indigo-950 border-4 border-amber-400/80 shadow-2xl relative overflow-hidden text-center space-y-6"
          >
            {/* Background watermarks */}
            <div className="absolute top-4 left-6 text-6xl opacity-10 select-none">✉️</div>
            <div className="absolute bottom-4 right-6 text-6xl opacity-10 select-none">☁️</div>

            {/* Top Badge */}
            <div className="flex items-center justify-center gap-2">
              <Award className="w-8 h-8 text-amber-400 animate-bounce" />
              <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-amber-300 font-bold">
                MINISTERUL EDUCAȚIEI • PROGRAMA TIC CLASA A VI-A
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl font-black text-white font-heading tracking-wide">
                DIPLOMĂ DE AMBASADOR AL NETICHETEI
              </h2>
              <div className="text-sm sm:text-base font-semibold text-purple-300 font-mono">
                &amp; COMUNICAȚIILOR DIGITALE ÎN CLOUD
              </div>
            </div>

            <div className="py-2 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Se conferă oficial cu distincție și nota maximă <span className="font-bold text-amber-300 font-mono">10 (ZECE)</span> elevului:
            </div>

            {/* Student Name */}
            <div className="py-3 px-6 rounded-2xl bg-slate-900/90 border-2 border-amber-500/50 inline-block shadow-inner">
              <span className="text-xl sm:text-3xl font-black text-amber-300 font-heading">
                {studentName}
              </span>
            </div>

            <p className="text-xs text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Pentru stăpânirea exemplară a structurii poștei electronice, utilizarea responsabilă a câmpurilor To, CC și BCC, aplicarea normelor etice de Netichetă, respectarea protocolului de siguranță Anti-Cyberbullying și colaborarea securizată pe platforme Cloud.
            </p>

            {/* Competencies Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-3xl mx-auto pt-2">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px]">
                <span className="font-mono font-bold text-amber-400 block mb-0.5">Competența 1.2</span>
                <span className="text-slate-300">Norme etice &amp; de securitate în comunicarea digitală</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px]">
                <span className="font-mono font-bold text-blue-400 block mb-0.5">Competența 3.1</span>
                <span className="text-slate-300">Transmiterea corectă și protejată a datelor prin E-mail</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px]">
                <span className="font-mono font-bold text-emerald-400 block mb-0.5">Competența 3.2</span>
                <span className="text-slate-300">Colaborare online &amp; gestiunea fișierelor în Cloud</span>
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
              <div>
                <span className="block text-slate-500">Platforma Educațională:</span>
                <span className="font-bold text-white">ArkyEdu • Misiuni Practice TIC</span>
              </div>
              <div className="w-16 h-16 rounded-full border-2 border-amber-400/60 bg-amber-950/40 flex items-center justify-center text-amber-300 font-bold text-[10px] uppercase text-center shadow-lg">
                SIGILIU<br />OFICIAL
              </div>
              <div className="text-right">
                <span className="block text-slate-500">Status Certificare:</span>
                <span className="font-bold text-emerald-400">VALIDATĂ 100% (GRADUATED)</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm font-mono flex items-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>{isEn ? 'Print / Save Diploma as PDF' : 'Tipărește / Salvează Diploma ca PDF'}</span>
            </button>

            {onRestartMission && (
              <button
                type="button"
                onClick={onRestartMission}
                className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm font-mono flex items-center gap-2 border border-slate-700 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isEn ? 'Replay Mission' : 'Reia Misiunea'}</span>
              </button>
            )}

            {onReturnToCatalog && (
              <button
                type="button"
                onClick={onReturnToCatalog}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm font-mono flex items-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <span>{isEn ? 'Return to Courses Catalog' : 'Înapoi la Catalogul de Cursuri'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
