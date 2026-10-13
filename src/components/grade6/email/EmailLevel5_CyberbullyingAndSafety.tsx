import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  PhoneCall,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Camera,
  UserX,
  HeartHandshake,
  BookOpen,
  MessageCircle
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface EmailLevel5Props {
  onCompletePage: (earnedScore: number) => void;
}

export const EmailLevel5_CyberbullyingAndSafety: React.FC<EmailLevel5Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  // 4 Steps Protocol Interactive sequence
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Simulation scenario answer
  const [qScenarioAnswer, setQScenarioAnswer] = useState<string | null>(null);

  // Phone helpline quiz
  const [qHelplineAnswer, setQHelplineAnswer] = useState<string | null>(null);

  const handleStepClick = (stepIndex: number) => {
    if (completedSteps.includes(stepIndex)) return;
    sounds.playClick();
    setCompletedSteps((prev) => [...prev, stepIndex]);
  };

  const handleScenarioAnswer = (ans: string) => {
    if (qScenarioAnswer) return;
    setQScenarioAnswer(ans);
    if (ans === 'support_and_report') sounds.playCorrect();
    else sounds.playWrong();
  };

  const handleHelplineAnswer = (ans: string) => {
    if (qHelplineAnswer) return;
    setQHelplineAnswer(ans);
    if (ans === '119_116111') sounds.playCorrect();
    else sounds.playWrong();
  };

  const allStepsLearned = completedSteps.length >= 4;
  const isAllComplete = allStepsLearned && qScenarioAnswer === 'support_and_report' && qHelplineAnswer === '119_116111';

  const protocolSteps = [
    {
      id: 1,
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      titleRo: '1. STOP — Nu riposta cu violență',
      titleEn: '1. STOP — Do not retaliate aggressively',
      descRo: 'Agresorii caută reacții de panică sau furie. Nu coborî la nivelul lor și nu răspunde cu insulte.'
    },
    {
      id: 2,
      icon: <Camera className="w-5 h-5 text-blue-400" />,
      titleRo: '2. SALVEAZĂ — Fă capturi de ecran (Screenshots)',
      titleEn: '2. SAVE — Capture screenshots as proof',
      descRo: 'Păstrează mesajele, linkurile, pozele și data exactă. Acestea constituie probe concrete.'
    },
    {
      id: 3,
      icon: <UserX className="w-5 h-5 text-rose-400" />,
      titleRo: '3. BLOCHEAZĂ — Block & Report',
      titleEn: '3. BLOCK — Use Block & Report features',
      descRo: 'Oprește comunicarea imediat prin butonul de Blocare și raportează profilul către administratorii platformei.'
    },
    {
      id: 4,
      icon: <HeartHandshake className="w-5 h-5 text-emerald-400" />,
      titleRo: '4. ANUNȚĂ — Vorbește cu un adult de încredere',
      titleEn: '4. TALK — Contact a trusted adult',
      descRo: 'Spune-le părinților, dirigintelui sau psihologului școlar. Nu ești singur și nimeni nu are voie să te rănească.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-purple-950 border-2 border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono font-bold border border-rose-500/40">
                {isEn ? 'Unit 3 • Lesson 5 • Grade 6' : 'Unitatea 3 • Lecția 5 • Clasa a VI-a'}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {isEn ? 'Level 5 of 7' : 'Nivelul 5 din 7'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-wide">
              {isEn ? 'Anti-Cyberbullying Shield & Digital Safety' : 'Scutul Anti-Cyberbullying & Conduita în Situații de Hărțuire'}
            </h1>
            <p className="text-sm text-rose-200/90 mt-2 max-w-2xl leading-relaxed">
              {isEn
                ? 'Understand what cyberbullying is, follow the golden 4-step emergency protocol, and learn the national child protection helplines (119 and 116 111).'
                : 'Înțelege ce este hărțuirea digitală (cyberbullying), stăpânește protocolul de reacție în 4 pași (Stop-Salvează-Blochează-Anunță) și memorează numerele de ajutor 119 și 116 111.'}
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border-2 border-rose-400/40 flex items-center justify-center text-3xl shadow-inner shrink-0">
            🛡️
          </div>
        </div>
      </div>

      {/* The 4-step Protocol Interactive Cards */}
      <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-sm uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Protocolul de Urgență în 4 Pași (Apasă pe fiecare pas)</span>
          </div>
          <span className="text-xs font-mono text-slate-300 bg-slate-800 px-3 py-1 rounded-full">
            {completedSteps.length} / 4 pași asimilați
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {protocolSteps.map((step) => {
            const isRead = completedSteps.includes(step.id);
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => handleStepClick(step.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isRead
                    ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-white">
                      {step.icon}
                      <span>{step.titleRo}</span>
                    </div>
                    {isRead ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full">
                        Apasă
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{step.descRo}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scenario Challenge: Class Chat Group Dilemma */}
      <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-sm uppercase tracking-wider">
          <MessageCircle className="w-4 h-4" />
          <span>Scenariu de Rol: Dilemă pe Grupul de Chat al Clasei</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            Pe grupul de WhatsApp al clasei, 2 elevi postează o fotografie modificată batjocoritoare cu un coleg mai timid și încep să râdă de el, chemând și pe ceilalți să trimită stickere jignitoare. Care este comportamentul tău corect și demn?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleScenarioAnswer('join_laugh')}
            disabled={!!qScenarioAnswer}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold text-left transition-all ${
              qScenarioAnswer === 'join_laugh'
                ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300'
            }`}
          >
            A. Râzi și tu și dai mai departe poza pe alte grupuri
          </button>

          <button
            type="button"
            onClick={() => handleScenarioAnswer('support_and_report')}
            disabled={!!qScenarioAnswer}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold text-left transition-all ${
              qScenarioAnswer === 'support_and_report'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                : 'bg-slate-800/80 border-slate-700 text-slate-300'
            }`}
          >
            B. Iei apărarea colegului, salvezi dovezi (screenshot) și anunți dirigintele / un adult
          </button>

          <button
            type="button"
            onClick={() => handleScenarioAnswer('ignore_completely')}
            disabled={!!qScenarioAnswer}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold text-left transition-all ${
              qScenarioAnswer === 'ignore_completely'
                ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300'
            }`}
          >
            C. Te prefaci că nu ai văzut nimic și lași victima singură
          </button>
        </div>

        <QuestionHint hint="Tăcerea în fața unei nedreptăți îi încurajează pe agresori. Fii un martor activ care sprijină victima!" />

        {qScenarioAnswer && (
          <AnswerExplanation
            isCorrect={qScenarioAnswer === 'support_and_report'}
            explanation={
              qScenarioAnswer === 'support_and_report'
                ? 'Absolut exemplar! A nu tolera agresiunea, a susține colegul afectat și a anunța un cadru didactic este dovada unei personalități mature și empatice.'
                : 'Greșit. Participarea la batjocură sau ignorarea totală transformă martorul într-un complice al agresiunii.'
            }
          />
        )}
      </div>

      {/* Helplines Quick Test */}
      <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-sm uppercase tracking-wider">
          <PhoneCall className="w-4 h-4" />
          <span>Numerele Naționale de Ajutor pentru Copii din România</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200">
          Ce numere gratuite de telefon poți apela oricând dacă ești victima sau martorul unei situații grave de abuz ori hărțuire?
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleHelplineAnswer('random')}
            disabled={!!qHelplineAnswer}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold text-left transition-all ${
              qHelplineAnswer === 'random'
                ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300'
            }`}
          >
            A. Numerele 8989 și 9999
          </button>

          <button
            type="button"
            onClick={() => handleHelplineAnswer('119_116111')}
            disabled={!!qHelplineAnswer}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold text-left transition-all ${
              qHelplineAnswer === '119_116111'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                : 'bg-slate-800/80 border-slate-700 text-slate-300'
            }`}
          >
            B. 119 (Numărul Unic Copii) & 116 111 (Telefonul Copilului)
          </button>
        </div>

        {qHelplineAnswer && (
          <AnswerExplanation
            isCorrect={qHelplineAnswer === '119_116111'}
            explanation={
              qHelplineAnswer === '119_116111'
                ? 'Corect! 119 este linia guvernamentală gratuită de urgență pentru copii, iar 116 111 oferă consiliere psihologică confidențială.'
                : 'Incorect. Numerele oficiale în România sunt 119 (Urgență Copii) și 116 111 (Telefonul Copilului).'
            }
          />
        )}
      </div>

      {/* Footer Navigation */}
      <PageNavigationFooter
        canAdvance={isAllComplete}
        onNext={() => {
          sounds.playLevelUp();
          onCompletePage(75);
        }}
        nextLabel={isEn ? 'Next: Cloud Collaboration Lab ➜' : 'Următorul: Colaborare în Cloud & Permisiuni ➜'}
      />
    </div>
  );
};
