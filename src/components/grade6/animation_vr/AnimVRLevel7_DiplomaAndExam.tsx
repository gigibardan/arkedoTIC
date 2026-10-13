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
  Film,
  Glasses,
  Clapperboard
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';

interface Level7Props {
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const AnimVRLevel7_DiplomaAndExam: React.FC<Level7Props> = ({
  onCompletePage,
  studentName = 'Elev Regizor & Arhitect VR',
  onRestartMission,
  onReturnToCatalog
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [q3, setQ3] = useState<string | null>(null);

  const [hasCelebrated, setHasCelebrated] = useState<boolean>(false);

  const handleQ1 = (val: string) => {
    setQ1(val);
    if (val === 'climax_dramatic') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
  };

  const handleQ2 = (val: string) => {
    setQ2(val);
    if (val === 'vr_isolates') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
  };

  const handleQ3 = (val: string) => {
    setQ3(val);
    if (val === 'puppeteering_sync') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
  };

  const isExamPassed = q1 === 'climax_dramatic' && q2 === 'vr_isolates' && q3 === 'puppeteering_sync';

  const triggerCelebration = () => {
    sounds.playFanfare();
    setHasCelebrated(true);
    onCompletePage(10); // Final completion score bonus

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 350);
    } catch {
      // Confetti fallback
    }
  };

  const handlePrint = () => {
    sounds.playClick();
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const today = new Date().toLocaleDateString(isEn ? 'en-US' : 'ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900/40 via-yellow-900/40 to-slate-900/60 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold tracking-wider uppercase">
                {isEn ? 'Unit 2B • Final Exam & Diploma' : 'Unitatea 2B • Marea Evaluare & Diplomă'}
              </span>
              <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 text-xs font-mono font-bold">
                Manual pag. 34–43 • OMEN 3393/2017
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-heading tracking-tight mb-2">
              {isEn ? 'Master Exam: Digital Director & VR Architect' : 'Marea Evaluare: Regizor Digital & Arhitect VR'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {isEn
                ? 'Answer the 3 summative questions to receive your official graduation diploma and certify your animation and virtual reality skills.'
                : 'Rezolvă cele 3 întrebări de sinteză pentru a debloca Diploma Oficială de Regizor Digital & Arhitect de Lumi Virtuale VR a Clasei a VI-a!'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
              <Trophy className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Summative 3 Questions */}
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xl">
            🎓
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              {isEn ? 'Summative Synthesis Exam (3 Questions)' : 'Testul Sumativ de Certificare (3 Întrebări)'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {isEn
                ? 'Score 100% on all 3 questions to unlock and print your graduation diploma.'
                : 'Obține punctaj maxim la cele 3 întrebări pentru a debloca și imprima diploma oficială.'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Question 1 */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-mono">1</span>
                {isEn
                  ? 'In the 3-act story arc, which act is accompanied by a Dramatic/Suspense soundtrack to amplify maximum tension?'
                  : 'În arcul narativ clasic (Setup, Conflict, Resolution), care act este asociat optim cu o coloană sonoră Dramatic / Suspans pentru a susține tensiunea maximă?'}
              </h3>
              <QuestionHint
                hintRo="Momentul în care apare problema neașteptată sau confruntarea cu obstacolul (Conflictul / Climax)."
                hintEn="The moment when the unexpected problem or climax occurs (Conflict)."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'climax_dramatic', label: 'Actul al II-lea: Conflictul (Punctul culminant al provocării)' },
                { id: 'setup_dramatic', label: 'Actul I: Introducerea liniștită a personajelor' },
                { id: 'credits_dramatic', label: 'Genericul final când spectatorii părăsesc sala' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleQ1(opt.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    q1 === opt.id
                      ? opt.id === 'climax_dramatic'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                        : 'bg-rose-500/20 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.label}</span>
                    {q1 === opt.id && (opt.id === 'climax_dramatic' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />)}
                  </div>
                </button>
              ))}
            </div>

            {q1 && (
              <AnswerExplanation
                isCorrect={q1 === 'climax_dramatic'}
                explanationRo="Corect! În Actul II (Conflict), muzica dramatică accentuează pericolul și dilema personajelor, pregătind deznodământul triumfal din Actul III."
                explanationEn="Correct! In Act II (Conflict), dramatic music highlights danger and dilemma, setting the stage for the triumphant resolution in Act III."
              />
            )}
          </div>

          {/* Question 2 */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-mono">2</span>
                {isEn
                  ? 'Which statement accurately describes the technological distinction between Virtual Reality (VR) and Augmented Reality (AR)?'
                  : 'Care afirmație descrie cel mai fidel diferența tehnologică dintre Realitatea Virtuală (VR) și Realitatea Augmentată (AR)?'}
              </h3>
              <QuestionHint
                hintRo="VR înlocuiește lumea reală cu o simulare 3D completă (ochelari opaci), în timp ce AR adaugă elemente digitale peste lumea fizică existentă (cameră telefon)."
                hintEn="VR replaces the real world with a 3D simulation (opaque goggles), while AR overlays digital elements onto the physical world."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'vr_isolates', label: 'VR oferă imersiune 100% într-o lume digitală blocând mediul fizic, în timp ce AR suprapune obiecte 3D peste realitate' },
                { id: 'vr_flat', label: 'VR este doar o imagine 2D plată, pe când AR necesită mereu tipărire pe hârtie' },
                { id: 'ar_audio', label: 'AR înseamnă doar fișiere audio transmise prin Bluetooth' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleQ2(opt.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    q2 === opt.id
                      ? opt.id === 'vr_isolates'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                        : 'bg-rose-500/20 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.label}</span>
                    {q2 === opt.id && (opt.id === 'vr_isolates' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />)}
                  </div>
                </button>
              ))}
            </div>

            {q2 && (
              <AnswerExplanation
                isCorrect={q2 === 'vr_isolates'}
                explanationRo="Exact! În VR ești complet scufundat în lumea creată de computer, pe când în AR continui să vezi clasa sau camera ta cu obiecte virtuale suprapuse."
                explanationEn="Exactly! In VR you are fully immersed in a computer-generated world, whereas in AR you continue seeing your physical room with digital objects overlaid."
              />
            )}
          </div>

          {/* Question 3 */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-mono">3</span>
                {isEn
                  ? 'How does Toontastic 3D synchronize actor motion and sound, avoiding laborious frame-by-frame animation?'
                  : 'Cum realizează Toontastic 3D sincronizarea mișcării personajelor cu dialogul, eliminând desenarea cadru cu cadru?'}
              </h3>
              <QuestionHint
                hintRo="Prin păpușărie digitală în timp real: în timp ce deplasezi personajul cu degetul pe ecran, microfonul înregistrează vocea simultan."
                hintEn="Through real-time digital puppeteering: as you move characters on screen, the mic records your voice simultaneously."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'puppeteering_sync', label: 'Prin păpușărie digitală: reține traseul degetului pe ecran și captează vocea sincron prin microfon' },
                { id: 'wait_year', label: 'Așteptând un an ca un studio profesionist de film să deseneze manual cadrele' },
                { id: 'mute_only', label: 'Dezactivând definitiv microfonul pentru a nu înregistra sunete' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleQ3(opt.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    q3 === opt.id
                      ? opt.id === 'puppeteering_sync'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                        : 'bg-rose-500/20 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.label}</span>
                    {q3 === opt.id && (opt.id === 'puppeteering_sync' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />)}
                  </div>
                </button>
              ))}
            </div>

            {q3 && (
              <AnswerExplanation
                isCorrect={q3 === 'puppeteering_sync'}
                explanationRo="Excelent! Tehnica păpușăriei digitale captează gesturile tale tactile și vocea în mod unitar, transformând orice elev într-un regizor și actor de voce complet!"
                explanationEn="Excellent! Digital puppeteering captures touch gestures and voice in unison, turning any student into a complete director and voice actor!"
              />
            )}
          </div>
        </div>

        {/* Claim Diploma Action */}
        {!hasCelebrated && (
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 font-mono">
              {isExamPassed ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {isEn ? 'All answers correct! Claim your diploma.' : 'Toate răspunsurile sunt corecte! Deblochează diploma.'}
                </span>
              ) : (
                <span>{isEn ? 'Pass all 3 questions to unlock your diploma.' : 'Răspunde corect la toate cele 3 întrebări pentru a finaliza misiunea.'}</span>
              )}
            </div>

            <button
              onClick={triggerCelebration}
              disabled={!isExamPassed}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-sm font-heading flex items-center justify-center gap-2 transition-all ${
                isExamPassed
                  ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:scale-105 text-slate-950 shadow-xl shadow-amber-500/30 cursor-pointer font-extrabold'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>{isEn ? 'Validate Exam & Generate Diploma' : 'Validează Examenul & Generează Diploma'}</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Official Certificate & Diploma View */}
      {hasCelebrated && (
        <div className="space-y-6 animate-fadeIn">
          {/* Printable Diploma Certificate Card */}
          <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 border-4 border-amber-500/80 shadow-2xl overflow-hidden print:p-6 print:border-amber-600 print:text-black">
            {/* Watermark background icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none text-[220px]">
              🎬
            </div>

            {/* Corner Decorative Ornaments */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-400" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-400" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-400" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-400" />

            {/* Certificate Header */}
            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-widest">
                ⭐ {isEn ? 'OFFICIAL ACCREDITATION • GRADE 6 TIC' : 'CERTIFICAT OFICIAL DE ABSOLVIRE • TIC CLASA A VI-A'} ⭐
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-amber-300 font-heading tracking-wide uppercase">
                {isEn ? 'DIPLOMA OF DIGITAL DIRECTOR & VR ARCHITECT' : 'DIPLOMĂ DE REGIZOR DIGITAL & ARHITECT VR'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-mono">
                Conform Programei Naționale TIC (OMEN 3393/2017) • Unitatea 2: Animații & Realitate Virtuală (pag. 34–43)
              </p>
            </div>

            {/* Recipient Details */}
            <div className="text-center my-6 space-y-3">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-mono">Se acordă cu distincție elevului / elevei:</p>
              <div className="text-2xl sm:text-4xl font-black text-white font-heading underline decoration-amber-400 decoration-2 underline-offset-8">
                {studentName}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed pt-2">
                Pentru asimilarea remarcabilă a principiilor animației clasice și digitale (24 FPS, persistența retiniană), structurarea scenariilor prin arcul narativ în 3 acte în Toontastic 3D, mânuirea marionetelor digitale sincronizate cu vocea, regia sonoră și explorarea mediilor imersive 360° prin CoSpaces Edu.
              </p>
            </div>

            {/* Badges Earned */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 pt-4 border-t border-slate-800 text-center">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/30">
                <div className="text-xl">🎬</div>
                <div className="text-[11px] font-bold text-white mt-1">24 FPS Master</div>
                <div className="text-[9px] text-slate-400 font-mono">Cinema Fluidity</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/30">
                <div className="text-xl">🎭</div>
                <div className="text-[11px] font-bold text-white mt-1">Story Arc Pro</div>
                <div className="text-[9px] text-slate-400 font-mono">Setup-Conflict-End</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/30">
                <div className="text-xl">🎵</div>
                <div className="text-[11px] font-bold text-white mt-1">Soundtrack Mood</div>
                <div className="text-[9px] text-slate-400 font-mono">Voice Direction</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/30">
                <div className="text-xl">🥽</div>
                <div className="text-[11px] font-bold text-white mt-1">VR 360° Explorer</div>
                <div className="text-[9px] text-slate-400 font-mono">CoSpaces Coblocks</div>
              </div>
            </div>

            {/* Footer with Date, Seal & Arky Signature */}
            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
              <div>
                <span className="text-slate-500">Data emiterii: </span>
                <span className="text-slate-300 font-bold">{today}</span>
              </div>

              {/* Hologram Official Stamp */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-400/40 text-amber-300 font-bold text-[11px]">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>ARKEDO OFFICIAL STAMP • 100/100 XP</span>
              </div>

              <div>
                <span className="text-slate-500">Certificat de: </span>
                <span className="text-amber-400 font-bold">Arky & Echipa TIC 🌳</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Print, Restart, Return */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm font-heading shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{isEn ? 'Print / Save PDF Diploma' : 'Imprimă / Salvează Diploma PDF'}</span>
            </button>

            {onRestartMission && (
              <button
                onClick={onRestartMission}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold border border-slate-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>{isEn ? 'Replay Mission' : 'Reia Misiunea de la Nivelul 1'}</span>
              </button>
            )}

            {onReturnToCatalog && (
              <button
                onClick={onReturnToCatalog}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-mono text-xs font-bold border border-amber-500/30 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>{isEn ? 'Return to Catalog' : 'Înapoi la Catalogul de Cursuri'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
