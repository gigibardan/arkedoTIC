import React, { useState } from 'react';
import {
  Trophy,
  Sparkles,
  CheckCircle2,
  XCircle,
  Printer,
  RotateCcw,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Repeat,
  Star,
  Award,
  Layers,
  GraduationCap,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { useQuestionCooldowns, computeGradeDetails, PedagogicalReflectionBanner } from '../../../utils/pedagogicalGrading';

interface Level7Props {
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const ScratchAlgo2_Level7_FinalExamAndDiploma: React.FC<Level7Props> = ({
  onCompletePage,
  studentName = 'Elev Programator Scratch',
  onRestartMission,
  onReturnToCatalog
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [q3, setQ3] = useState<string | null>(null);
  const [showPreviewDiploma, setShowPreviewDiploma] = useState<boolean>(false);

  const handleQ1 = (val: string) => {
    if (isLocked('q1') || q1 === 'repeat_n') return;
    setQ1(val);
    if (val === 'repeat_n') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1', 5);
    }
  };

  const handleQ2 = (val: string) => {
    if (isLocked('q2') || q2 === '360_div_8') return;
    setQ2(val);
    if (val === '360_div_8') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2', 5);
    }
  };

  const handleQ3 = (val: string) => {
    if (isLocked('q3') || q3 === 'layering_depth') return;
    setQ3(val);
    if (val === 'layering_depth') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3', 5);
    }
  };

  const isQ1Correct = q1 === 'repeat_n';
  const isQ2Correct = q2 === '360_div_8';
  const isQ3Correct = q3 === 'layering_depth';

  const correctCount = [isQ1Correct, isQ2Correct, isQ3Correct].filter(Boolean).length;
  const earnedScore = 85 + correctCount * 5; // 85 base + up to 15 = 100 max
  const gradeDetails = computeGradeDetails(earnedScore);

  const handleFinalize = () => {
    sounds.playFanfare();
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {}
    setShowPreviewDiploma(true);
    onCompletePage(earnedScore);
  };

  const printDiploma = () => {
    sounds.playClick();
    window.print();
  };

  const handleDownloadDiplomaJson = () => {
    sounds.playRetro('powerup');
    const diplomaData = {
      projectType: 'Grade6_Graduation_Diploma',
      level: 'Clasa a VI-a • Marea Evaluare Finală & Absolvire Gimnazială',
      studentName,
      issuedDate: currentDate,
      score: earnedScore,
      gradeDetails,
      disciplinesMastered: [
        'Prezentări Electronice PowerPoint (Format 16:9, Regula 6x6)',
        'Modelare & Editare 3D în Paint 3D (Forme tridimensionale, Iluminare & Texturi)',
        'Animație Cinematografică & VR (Arc Narativ 3 Acte, CoSpaces Edu 360°)',
        'Securitate Cibernetică & Protecție Malware (Firewall, Antivirus, Phishing)',
        'Algoritmi & Programare Scratch Clasa a VI-a (Structuri Repetitive, Fractali, Variabile)'
      ],
      curriculumReference: 'OMEN nr. 3393/2017',
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(diplomaData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Diploma_Onoare_Absolvire_TIC_${studentName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentDate = new Date().toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900/90 via-slate-900 to-purple-950/90 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              {isEn ? '6th Grade TIC • Final Graduation Exam (p. 92–93)' : 'TIC Clasa a VI-a • Marea Evaluare Finală & Absolvire (pag. 92–93)'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              {isEn ? 'Grand Middle School Exam & Diploma of Honor' : 'Marea Evaluare Gimnazială & Diploma de Onoare TIC'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {isEn
                ? 'Answer the 3 final synthesis questions to validate your 6th Grade Computer Science journey and claim your official printable National Curriculum Diploma!'
                : 'Răspunde la cele 3 întrebări finale de sinteză pentru a valida parcursul complet al Clasei a VI-a și a debloca Diploma Oficială de Onoare Gimnazială!'}
            </p>
          </div>
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center text-4xl shadow-2xl shadow-amber-500/30 shrink-0">
            🎓
          </div>
        </div>
      </div>

      {/* Synthesis Questions */}
      <div className="space-y-4">
        {/* Q1 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">
              {isEn
                ? '1. In pseudocode: "Pentru i <- 1, 10 execută". Which native Scratch block is the direct equivalent?'
                : '1. În pseudocod: „Pentru i ← 1, 10 execută”. Care este blocul nativ din Scratch care corespunde acestei structuri cu număr cunoscut de pași?'}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-2.5 pt-2">
            {[
              {
                id: 'repeat_n',
                label: 'Blocul galben de Control „repetă (10)”',
                isCorrect: true
              },
              {
                id: 'forever',
                label: 'Blocul „la nesfârșit” (buclă fără condiție de oprire)',
                isCorrect: false
              },
              {
                id: 'if_then',
                label: 'Blocul „dacă... atunci” (structură decizională simplă)',
                isCorrect: false
              }
            ].map((opt) => {
              const isSelected = q1 === opt.id;
              let style = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (q1) {
                if (opt.isCorrect) style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                else if (isSelected) style = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={opt.id}
                  disabled={isLocked('q1') || isQ1Correct}
                  onClick={() => handleQ1(opt.id)}
                  className={`p-3.5 rounded-xl border font-bold text-xs sm:text-sm text-left transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-between gap-3 ${style}`}
                >
                  <span>{opt.label}</span>
                  {q1 && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {q1 && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {cooldowns.q1 && cooldowns.q1 > 0 ? (
            <PedagogicalReflectionBanner cooldown={cooldowns.q1} />
          ) : null}

          {q1 && (
            <AnswerExplanation
              isCorrect={q1 === 'repeat_n'}
              explanation="Corect! Blocul „repetă (n)” execută instrucțiunile din interior de exact n ori, implementând structura FOR din programare!"
            />
          )}
        </div>

        {/* Q2 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-base">
              {isEn
                ? '2. What is the rotation angle required to draw a regular octagon (8 sides) in Scratch?'
                : '2. Ce unghi de rotație trebuie aplicat în bucla repetitivă pentru a desena un octogon regulat (8 laturi)?'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            {[
              { id: '360_div_8', label: '45° (360° / 8)', isCorrect: true },
              { id: '90_deg', label: '90° (360° / 4)', isCorrect: false },
              { id: '60_deg', label: '60° (360° / 6)', isCorrect: false }
            ].map((opt) => {
              const isSelected = q2 === opt.id;
              let style = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (q2) {
                if (opt.isCorrect) style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                else if (isSelected) style = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={opt.id}
                  disabled={isLocked('q2') || isQ2Correct}
                  onClick={() => handleQ2(opt.id)}
                  className={`p-3.5 rounded-xl border font-bold text-xs sm:text-sm text-left transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-between gap-3 ${style}`}
                >
                  <span className="font-mono">{opt.label}</span>
                  {q2 && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {q2 && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {cooldowns.q2 && cooldowns.q2 > 0 ? (
            <PedagogicalReflectionBanner cooldown={cooldowns.q2} />
          ) : null}

          {q2 && (
            <AnswerExplanation
              isCorrect={q2 === '360_div_8'}
              explanation="Corect! Formula unghiului exterior este 360° / n. Pentru un octogon (n=8): 360° / 8 = 45°!"
            />
          )}
        </div>

        {/* Q3 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-white text-base">
              {isEn
                ? '3. In the Scratch 3D Minecraft project, how do you prevent the player from passing behind background trees?'
                : '3. În proiectul Minecraft 3D, cum asiguri că personajul jucătorului nu este acoperit accidental de copacii din fundal?'}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-2.5 pt-2">
            {[
              {
                id: 'layering_depth',
                label: 'Folosind blocul „mergi în stratul [din față v]” din categoria Aspect (Z-index superior)',
                isCorrect: true
              },
              {
                id: 'change_costume',
                label: 'Schimbând culoarea costumului personajului',
                isCorrect: false
              },
              {
                id: 'delete_trees',
                label: 'Ștergând definitiv toți copacii din joc',
                isCorrect: false
              }
            ].map((opt) => {
              const isSelected = q3 === opt.id;
              let style = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (q3) {
                if (opt.isCorrect) style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                else if (isSelected) style = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={opt.id}
                  disabled={isLocked('q3') || isQ3Correct}
                  onClick={() => handleQ3(opt.id)}
                  className={`p-3.5 rounded-xl border font-bold text-xs sm:text-sm text-left transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-between gap-3 ${style}`}
                >
                  <span>{opt.label}</span>
                  {q3 && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {q3 && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {cooldowns.q3 && cooldowns.q3 > 0 ? (
            <PedagogicalReflectionBanner cooldown={cooldowns.q3} />
          ) : null}

          {q3 && (
            <AnswerExplanation
              isCorrect={q3 === 'layering_depth'}
              explanation="Perfect! Blocul „mergi în stratul [din față]” ridică nivelul Z de afișare al personajului deasupra tuturor obiectelor de decor!"
            />
          )}
        </div>
      </div>

      {/* Synthesis Evaluation Card */}
      <div className="bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-950 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-3xl shadow-inner">
          🏆
        </div>

        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {isEn ? '6th Grade TIC Curriculum Completed!' : 'Curriculumul Complet Clasa a VI-a Finalizat!'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            {isEn
              ? 'Congratulations! You have successfully completed all 4 Units of 6th Grade TIC (Art Klett).'
              : 'Felicitări! Ai parcurs cu succes toate cele 4 mari unități din manualul oficial Art Klett (Prezentări, Grafică 3D & Animație, Internet & Securitate, Algoritmi în Scratch).'}
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
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 cursor-pointer transition transform active:scale-95 flex items-center gap-2.5"
          >
            <Trophy className="w-5 h-5" />
            <span>{isEn ? 'Generate Official Graduation Diploma!' : 'Generează Marea Diplomă Oficială de Absolvire!'}</span>
          </button>
        </div>
      </div>

      {/* Official Printable Diploma Section */}
      {showPreviewDiploma && (
        <div className="animate-fadeIn space-y-4 pt-4">
          <div className="flex justify-end gap-2 print:hidden">
            <button
              type="button"
              onClick={handleDownloadDiplomaJson}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{isEn ? 'Export Diploma (.json)' : 'Exportă Diploma (.json)'}</span>
            </button>

            <button
              type="button"
              onClick={printDiploma}
              className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer transition active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>{isEn ? 'Print Diploma (A4)' : 'Tipărește Diploma (Format A4)'}</span>
            </button>
          </div>

          <div
            id="diploma-container"
            className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-amber-50 via-yellow-50/80 to-amber-100/90 border-8 border-double border-amber-700/80 text-slate-900 shadow-2xl relative overflow-hidden"
          >
            {/* Watermark Crest */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <span className="text-[280px]">🏛️</span>
            </div>

            {/* Inner Border */}
            <div className="border-2 border-amber-700/50 p-6 sm:p-10 rounded-2xl text-center space-y-6 relative">
              <div className="flex items-center justify-between border-b-2 border-amber-800/20 pb-4">
                <div className="text-left font-serif text-xs text-amber-900">
                  <div className="font-bold tracking-wider uppercase">Ministerul Educației</div>
                  <div className="text-[11px] text-amber-800">Programa Națională OMEN nr. 3393/2017</div>
                </div>
                <div className="text-4xl">🏅</div>
                <div className="text-right font-serif text-xs text-amber-900">
                  <div className="font-bold tracking-wider uppercase">Platforma ArkyEdu</div>
                  <div className="text-[11px] text-amber-800">Editura Art Klett Clasa a VI-a</div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-serif font-black text-amber-950 uppercase tracking-widest">
                  Diplomă de Onoare
                </h2>
                <div className="text-sm font-serif italic text-amber-800 font-semibold tracking-wider">
                  Absolvent al Cursului de Informatică și TIC • Clasa a VI-a
                </div>
              </div>

              <div className="py-2">
                <div className="text-xs font-serif uppercase tracking-widest text-slate-600 mb-1">
                  Se acordă elevului / elevei
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-indigo-950 border-b-2 border-dashed border-amber-700 inline-block px-8 py-1">
                  {studentName}
                </div>
              </div>

              <p className="text-xs sm:text-sm font-serif text-slate-700 max-w-xl mx-auto leading-relaxed">
                pentru absolvirea cu succes a programului curricular de <strong>Informatică și TIC Clasa a VI-a</strong>, demonstrând competențe excelente în realizarea prezentărilor electronice, modelarea tridimensională în Paint 3D, animație cinematografică, protecție malware și programarea structurilor repetitive complexe în Scratch.
              </p>

              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-xl bg-amber-200/60 border border-amber-600/40 font-mono text-xs font-bold text-amber-950">
                <span>Punctaj: 100 / 100</span>
                <span>•</span>
                <span>Calificativ: Foarte Bine (Nota 10)</span>
                <span>•</span>
                <span>Data: {currentDate}</span>
              </div>

              {/* Signatures */}
              <div className="pt-6 grid grid-cols-2 gap-8 text-xs font-serif text-amber-950 border-t border-amber-800/20">
                <div className="text-center">
                  <div className="font-cursive text-lg text-indigo-900 font-bold mb-1">Arky 🤖</div>
                  <div className="border-t border-amber-800/40 pt-1 font-bold">Mascota Didactică Arky</div>
                  <div className="text-[10px] text-slate-500">Ghid Interactiv ArkyEdu</div>
                </div>
                <div className="text-center">
                  <div className="font-cursive text-lg text-emerald-900 font-bold mb-1">Prof. TIC ✍️</div>
                  <div className="border-t border-amber-800/40 pt-1 font-bold">Profesor Coordonator</div>
                  <div className="text-[10px] text-slate-500">Laboratorul de Informatică</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 print:hidden">
            {onRestartMission && (
              <button
                type="button"
                onClick={onRestartMission}
                className="py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs flex items-center gap-2 cursor-pointer transition border border-slate-700"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isEn ? 'Replay Mission 4B' : 'Reia Misiunea 4B'}</span>
              </button>
            )}
            {onReturnToCatalog && (
              <button
                type="button"
                onClick={onReturnToCatalog}
                className="py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer transition"
              >
                <ArrowRight className="w-4 h-4" />
                <span>{isEn ? 'Return to Courses Catalog' : 'Înapoi la Catalogul de Cursuri'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
