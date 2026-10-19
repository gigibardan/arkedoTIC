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
  Clapperboard,
  Film,
  Glasses,
  Volume2,
  Star,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { useQuestionCooldowns, computeGradeDetails, PedagogicalReflectionBanner } from '../../../utils/pedagogicalGrading';

interface AnimVRLevel7Props {
  onCompletePage: (earnedScore: number) => void;
  studentName?: string;
  onRestartMission?: () => void;
  onReturnToCatalog?: () => void;
}

export const AnimVRLevel7_DiplomaAndExam: React.FC<AnimVRLevel7Props> = ({
  onCompletePage,
  studentName = 'Elev Regizor Digital',
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
    if (isLocked('q1') || q1 === 'climax_dramatic') return;
    setQ1(val);
    if (val === 'climax_dramatic') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q1', 5);
    }
  };

  const handleQ2 = (val: string) => {
    if (isLocked('q2') || q2 === 'vr_isolates') return;
    setQ2(val);
    if (val === 'vr_isolates') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q2', 5);
    }
  };

  const handleQ3 = (val: string) => {
    if (isLocked('q3') || q3 === 'puppeteering_sync') return;
    setQ3(val);
    if (val === 'puppeteering_sync') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
      triggerCooldown('q3', 5);
    }
  };

  const isQ1Correct = q1 === 'climax_dramatic';
  const isQ2Correct = q2 === 'vr_isolates';
  const isQ3Correct = q3 === 'puppeteering_sync';

  const correctCount = [isQ1Correct, isQ2Correct, isQ3Correct].filter(Boolean).length;
  const allAnswered = !!(q1 && q2 && q3);

  const earnedScore = Math.min(100, correctCount * 30 + (allAnswered ? 10 : 0));
  const gradeDetails = computeGradeDetails(earnedScore, 100);

  const handleFinalize = () => {
    sounds.playFanfare();
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
    onCompletePage(earnedScore);
  };

  const handlePrint = () => {
    sounds.playClick();
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleDownloadCertificate = () => {
    sounds.playRetro('powerup');
    const certData = {
      projectType: 'Animation_VR_Diploma',
      unit: 'Clasa a VI-a • Unitatea 2B (Animație & Realitate Virtuală)',
      studentName,
      evaluation: {
        score: earnedScore,
        gradeDetails,
        topicsMastered: [
          'Story Arc in 3 Acts (Setup, Conflict, Resolution)',
          'Digital Puppeteering & Lip-Sync in Toontastic',
          '360° Virtual Scene Exploration in CoSpaces Edu',
          'Optical Isolation in VR vs Augmented Reality (AR)'
        ]
      },
      issuedDate: today,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(certData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Diploma_Regizor_Animatie_VR_${studentName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const today = new Date().toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-purple-950/60 to-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold uppercase tracking-wider">
                {isEn ? 'Grade 6 • Unit 2B: Capstone Evaluation' : 'Clasa a VI-a • Unitatea 2B: Evaluare Finală'}
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono">
                {isEn ? 'Textbook pp. 34–43' : 'Manual pag. 34–43'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-heading tracking-tight flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-2xl shadow-inner shrink-0">
                🎬
              </span>
              <span>
                {isEn ? 'Animation & VR Master Diploma' : 'Examenul Regizorului de Animație & Realitate Virtuală'}
              </span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              {isEn
                ? 'Answer the 3 official curriculum synthesis questions to validate your director credentials and claim your official Diploma!'
                : 'Rezolvă cele 3 întrebări de evaluare din manualul de clasa a VI-a pentru a-ți valida competențele de regizor digital și a revendica Diploma Oficială!'}
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-950/80 border border-amber-500/40 shrink-0">
            <Film className="w-6 h-6 text-amber-400" />
            <Glasses className="w-6 h-6 text-purple-400" />
            <div className="text-right">
              <div className="text-[10px] font-mono text-slate-400">Punctaj Maxim</div>
              <div className="text-sm font-black text-amber-300 font-mono">100 Puncte</div>
            </div>
          </div>
        </div>
      </div>

      {/* Synthesis Exam Questions */}
      <div className="space-y-4">
        {/* Q1: 3-Act Story Arc & Climax */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <Clapperboard className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-sm sm:text-base">
              {isEn
                ? '1. In Toontastic 3D (3-Act Narrative Arc: Setup, Conflict, Resolution), which part holds the emotional turning point (Climax)?'
                : '1. În arcul narativ în 3 acte (Introducere, Conflict, Rezoluție) din Toontastic 3D, ce moment reprezintă Punctul Culminant (Climax)?'}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-2.5 pt-2">
            {[
              {
                id: 'climax_dramatic',
                labelRo: 'Momentul de tensiune maximă din Conflict, în care personajul înfruntă obstacolul cel mai greu înainte de rezolvare',
                labelEn: 'The peak tension moment during the Conflict where the hero faces the hardest hurdle before resolution',
                isCorrect: true
              },
              {
                id: 'credits_screen',
                labelRo: 'Ecranul negru de final în care derulează genericul cu numele regizorului',
                labelEn: 'The final black screen showing the rolling director credits',
                isCorrect: false
              },
              {
                id: 'color_picker',
                labelRo: 'Momentul când alegi culoarea pălăriei personajului în laboratorul de pictură',
                labelEn: 'The moment when you pick the character hat color in the painting lab',
                isCorrect: false
              }
            ].map((opt) => {
              const isSelected = q1 === opt.id;
              let btnStyle = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (q1) {
                if (opt.isCorrect) btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                else if (isSelected) btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={opt.id}
                  disabled={isLocked('q1') || isQ1Correct}
                  onClick={() => handleQ1(opt.id)}
                  className={`p-3.5 rounded-xl border font-medium text-xs sm:text-sm text-left transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-between gap-3 ${btnStyle}`}
                >
                  <span>{isEn ? opt.labelEn : opt.labelRo}</span>
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
              isCorrect={isQ1Correct}
              explanation={
                isQ1Correct
                  ? (isEn
                    ? 'Excellent! Climax is the decisive peak of the narrative conflict.'
                    : 'Excelent! Punctul culminant este vârful dramatic al conflictului, pregătind deznodământul.')
                  : (isEn
                    ? 'Incorrect. Remember that the climax is the emotional turning point inside the Conflict stage.'
                    : 'Incorect. Punctul culminant este momentul cheie al confruntării din cadrul Conflictului.')
              }
            />
          )}
        </div>

        {/* Q2: VR vs AR Sensation */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <Glasses className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-white text-sm sm:text-base">
              {isEn
                ? '2. What is the defining difference in sensory immersion between Virtual Reality (VR) and Augmented Reality (AR)?'
                : '2. Care este diferența definitorie de imersiune senzorială între Realitatea Virtuală (VR) și Realitatea Augmentată (AR)?'}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-2.5 pt-2">
            {[
              {
                id: 'vr_isolates',
                labelRo: 'VR înlocuiește complet lumea reală cu una 100% digitală 360°, în timp ce AR suprapune elemente virtuale (holograme) peste lumea reală',
                labelEn: 'VR completely replaces the physical surroundings with a 100% digital 360° realm, whereas AR overlays digital holograms on top of reality',
                isCorrect: true
              },
              {
                id: 'vr_needs_paper',
                labelRo: 'VR funcționează doar imprimat pe foi de hârtie A4, iar AR necesită un proiector de cinema',
                labelEn: 'VR only operates printed on A4 paper sheets, while AR requires a cinema movie projector',
                isCorrect: false
              },
              {
                id: 'identical_tech',
                labelRo: 'Sunt doi termeni identici pentru același joc video 2D pe calculator',
                labelEn: 'They are two identical synonyms for standard 2D PC video games',
                isCorrect: false
              }
            ].map((opt) => {
              const isSelected = q2 === opt.id;
              let btnStyle = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (q2) {
                if (opt.isCorrect) btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                else if (isSelected) btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={opt.id}
                  disabled={isLocked('q2') || isQ2Correct}
                  onClick={() => handleQ2(opt.id)}
                  className={`p-3.5 rounded-xl border font-medium text-xs sm:text-sm text-left transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-between gap-3 ${btnStyle}`}
                >
                  <span>{isEn ? opt.labelEn : opt.labelRo}</span>
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
              isCorrect={isQ2Correct}
              explanation={
                isQ2Correct
                  ? (isEn
                    ? 'Perfect! VR creates full optical isolation, while AR enhances what you currently see in physical space.'
                    : 'Corect! VR izolează privirea într-un univers simulat 360°, pe când AR suprapune holograme peste camera reală.')
                  : (isEn
                    ? 'Incorrect. Remember: VR = full virtual immersion; AR = augmented physical world.'
                    : 'Incorect. Reține: VR = imersiune totală digitală; AR = îmbogățirea lumii reale cu holograme.')
              }
            />
          )}
        </div>

        {/* Q3: Digital Puppeteering & Lip Sync */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-sm sm:text-base">
              {isEn
                ? '3. How does digital puppeteering work in Toontastic when recording a scene?'
                : '3. Cum funcționează mânuirea marionetei digitale (Digital Puppeteering) în timpul înregistrării unei scene?'}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-2.5 pt-2">
            {[
              {
                id: 'puppeteering_sync',
                labelRo: 'Deplasezi personajul pe ecran cu degetul/mouse-ul și vorbești în microfon în timp real, aplicația sincronizând gura și gesturile',
                labelEn: 'You steer the sprite with your finger/mouse and speak into the mic live, with the app animating mouth and body in real time',
                isCorrect: true
              },
              {
                id: 'type_code',
                labelRo: 'Trebuie să scrii 500 de linii de cod în C++ înainte de fiecare pas al personajului',
                labelEn: 'You must type 500 lines of low-level C++ code before each sprite motion',
                isCorrect: false
              },
              {
                id: 'automatic_only',
                labelRo: 'Calculatorul alege singur ce spun personajele fără ca elevul să aibă vreun control',
                labelEn: 'The device chooses dialogue automatically without any student input',
                isCorrect: false
              }
            ].map((opt) => {
              const isSelected = q3 === opt.id;
              let btnStyle = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (q3) {
                if (opt.isCorrect) btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                else if (isSelected) btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={opt.id}
                  disabled={isLocked('q3') || isQ3Correct}
                  onClick={() => handleQ3(opt.id)}
                  className={`p-3.5 rounded-xl border font-medium text-xs sm:text-sm text-left transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-between gap-3 ${btnStyle}`}
                >
                  <span>{isEn ? opt.labelEn : opt.labelRo}</span>
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
              isCorrect={isQ3Correct}
              explanation={
                isQ3Correct
                  ? (isEn
                    ? 'Spot on! Real-time voice puppeteering is the magic behind interactive animation in Toontastic 3D.'
                    : 'Excelent! Mânuirea directă și dublajul vocal în timp real permit crearea de desene animate spectaculoase fără eforturi tehnice obositoare.')
                  : (isEn
                    ? 'Incorrect. Puppeteering means moving characters live on screen while recording voice.'
                    : 'Incorect. Marionetarea digitală presupune mânuirea personajului pe ecran concomitent cu înregistrarea vocii.')
              }
            />
          )}
        </div>
      </div>

      {/* Capstone Evaluation Card */}
      <div className="bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-950 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-3xl shadow-inner">
          🏆
        </div>

        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {isEn ? 'Evaluation Completed' : 'Evaluare Finală Modulul 2B'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            {isEn
              ? 'Your score is dynamically calculated based on your answers and pedagogical reflections.'
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
            <span>{isEn ? 'Finalize Mission & Claim Official Diploma!' : 'Finalizează Misiunea 2B & Revendică Marea Diplomă!'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadCertificate}
            className="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 font-bold text-sm shadow-lg cursor-pointer transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{isEn ? 'Export Certificate (.json)' : 'Exportă Certificatul (.json)'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm shadow-lg cursor-pointer transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>{isEn ? 'Print Official Certificate' : 'Tipărește Diploma'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
