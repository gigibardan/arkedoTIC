import React, { useState } from 'react';
import {
  MessageSquare,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  Send,
  UserCheck,
  BookOpen,
  Reply,
  Users
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface EmailLevel4Props {
  onCompletePage: (earnedScore: number) => void;
}

export const EmailLevel4_NetiquetteMaster: React.FC<EmailLevel4Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  // Bad email flaws caught by student
  const [capsFlawChecked, setCapsFlawChecked] = useState<boolean>(false);
  const [subjectFlawChecked, setSubjectFlawChecked] = useState<boolean>(false);
  const [salutationFlawChecked, setSalutationFlawChecked] = useState<boolean>(false);
  const [signatureFlawChecked, setSignatureFlawChecked] = useState<boolean>(false);

  // Reply vs Reply All quiz
  const [qReplyAnswer, setQReplyAnswer] = useState<string | null>(null);

  // General netiquette quiz
  const [qCapsMeaning, setQCapsMeaning] = useState<string | null>(null);

  const handleToggleFlaw = (flaw: 'caps' | 'subject' | 'salutation' | 'signature') => {
    sounds.playClick();
    if (flaw === 'caps') setCapsFlawChecked((prev) => !prev);
    if (flaw === 'subject') setSubjectFlawChecked((prev) => !prev);
    if (flaw === 'salutation') setSalutationFlawChecked((prev) => !prev);
    if (flaw === 'signature') setSignatureFlawChecked((prev) => !prev);
  };

  const handleReplyAnswer = (ans: string) => {
    if (qReplyAnswer) return;
    setQReplyAnswer(ans);
    if (ans === 'reply_only') sounds.playCorrect();
    else sounds.playWrong();
  };

  const handleCapsAnswer = (ans: string) => {
    if (qCapsMeaning) return;
    setQCapsMeaning(ans);
    if (ans === 'shouting') sounds.playCorrect();
    else sounds.playWrong();
  };

  const allFlawsIdentified = capsFlawChecked && subjectFlawChecked && salutationFlawChecked && signatureFlawChecked;
  const isAllComplete = allFlawsIdentified && qReplyAnswer === 'reply_only' && qCapsMeaning === 'shouting';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40">
                {isEn ? 'Unit 3 • Lesson 4 • Grade 6' : 'Unitatea 3 • Lecția 4 • Clasa a VI-a'}
              </span>
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-mono font-bold border border-teal-500/40 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {isEn ? 'Level 4 of 7' : 'Nivelul 4 din 7'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-wide">
              {isEn ? 'Netiquette: Digital Courtesy & Communication Ethics' : 'Neticheta: Codul Bunelor Maniere în Lumea Digitală'}
            </h1>
            <p className="text-sm text-emerald-200/90 mt-2 max-w-2xl leading-relaxed">
              {isEn
                ? 'Network + Etiquette = Netiquette! Learn why typing in all-caps means shouting, how to craft polite emails, and when to avoid "Reply All" spam.'
                : 'Network + Etichetă = Netichetă! Descoperă de ce scrierea cu majuscule echivalează cu un strigăt în public, cum se structurează un e-mail politicos și de ce „Reply All” poate crea haos.'}
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/40 flex items-center justify-center text-3xl shadow-inner shrink-0">
            🎩
          </div>
        </div>
      </div>

      {/* 4 Golden Netiquette Commandments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 flex flex-col justify-between">
          <div>
            <div className="text-2xl mb-2">🤫</div>
            <h4 className="font-bold text-white text-sm mb-1">Fără Majuscule (Caps Lock)</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Scrierea integrală cu litere mari transmite agresivitate, mânie sau senzația că țipi la destinatar.
            </p>
          </div>
          <span className="mt-2 text-[10px] font-mono text-emerald-400">Regula #1 de Aur</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-blue-500/30 flex flex-col justify-between">
          <div>
            <div className="text-2xl mb-2">🏷️</div>
            <h4 className="font-bold text-white text-sm mb-1">Subiect Precis & Clar</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Subiectul (Subject) rezumă în câteva cuvinte mesajul. Nu lăsa câmpul gol și evită titluri de tip „salut” sau „urgent”.
            </p>
          </div>
          <span className="mt-2 text-[10px] font-mono text-blue-400">Regula #2 de Aur</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/30 flex flex-col justify-between">
          <div>
            <div className="text-2xl mb-2">✍️</div>
            <h4 className="font-bold text-white text-sm mb-1">Salut & Semnătură</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Începe cu „Bună ziua, stimate domnule profesor” și încheie cu „Cu respect, [Nume Prenume, Clasa]”.
            </p>
          </div>
          <span className="mt-2 text-[10px] font-mono text-purple-400">Regula #3 de Aur</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex flex-col justify-between">
          <div>
            <div className="text-2xl mb-2">🛡️</div>
            <h4 className="font-bold text-white text-sm mb-1">Respectul Intimității</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Nu trimite mesaje în lanț (chain mail), nu da forward la conversații private fără acord și folosește BCC la grupuri.
            </p>
          </div>
          <span className="mt-2 text-[10px] font-mono text-amber-400">Regula #4 de Aur</span>
        </div>
      </div>

      {/* Interactive Case: The Flawed Email Inspector */}
      <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-sm uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Laborator Practic: Detectorul de Greșeli de Netichetă</span>
          </div>
          <span className="text-xs font-mono text-slate-300 bg-slate-800 px-3 py-1 rounded-full">
            {[capsFlawChecked, subjectFlawChecked, salutationFlawChecked, signatureFlawChecked].filter(Boolean).length} / 4 greșeli bifate
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Un elev a trimis e-mailul de mai jos către profesorul său. Analizează mesajul și bifează toate cele 4 încălcări majore de netichetă:
        </p>

        {/* Flawed email mock box */}
        <div className="p-5 rounded-2xl bg-slate-950 border-2 border-rose-500/40 font-mono text-xs sm:text-sm space-y-2 shadow-inner">
          <div className="text-slate-400 pb-2 border-b border-slate-800 flex flex-col gap-1">
            <div><span className="text-slate-500 font-bold">From:</span> elevul.ghita@gmail.com</div>
            <div><span className="text-slate-500 font-bold">To:</span> profesor.tic@scoala.ro</div>
            <div className="text-rose-400 font-bold">
              <span className="text-slate-500 font-bold">Subject:</span> (Câmp lăsat complet GOL!)
            </div>
          </div>
          <div className="text-amber-300 leading-relaxed pt-2 font-bold uppercase">
            „VREAU SĂ ȘTIU DACĂ MI-AȚI TRECUT NOTA LA PROIECT CĂ NU O VĂD ÎN CATALOG ȘI SUNT SUPĂRAT!!! TRIMITEȚI-MI RĂSPUNSUL ACUM PE LOC CĂ MĂ GRĂBESC LA MECI!!!”
          </div>
          <div className="text-slate-500 pt-2 italic text-[11px]">
            (Fără formulă de salut, fără formulă de încheiere, fără nume de semnătură!)
          </div>
        </div>

        {/* Flaw Checkboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleToggleFlaw('caps')}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold text-left transition-all flex items-center gap-3 ${
              capsFlawChecked
                ? 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
              capsFlawChecked ? 'bg-rose-600 border-rose-400 text-white' : 'border-slate-600 bg-slate-900'
            }`}>
              {capsFlawChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
            </span>
            <span>1. Text scris integral cu MAJUSCULE (țipăt agresiv)</span>
          </button>

          <button
            type="button"
            onClick={() => handleToggleFlaw('subject')}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold text-left transition-all flex items-center gap-3 ${
              subjectFlawChecked
                ? 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
              subjectFlawChecked ? 'bg-rose-600 border-rose-400 text-white' : 'border-slate-600 bg-slate-900'
            }`}>
              {subjectFlawChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
            </span>
            <span>2. Câmpul Subject (Subiect) lăsat complet GOL</span>
          </button>

          <button
            type="button"
            onClick={() => handleToggleFlaw('salutation')}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold text-left transition-all flex items-center gap-3 ${
              salutationFlawChecked
                ? 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
              salutationFlawChecked ? 'bg-rose-600 border-rose-400 text-white' : 'border-slate-600 bg-slate-900'
            }`}>
              {salutationFlawChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
            </span>
            <span>3. Lipsa formulei politicoase de salut inițial</span>
          </button>

          <button
            type="button"
            onClick={() => handleToggleFlaw('signature')}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold text-left transition-all flex items-center gap-3 ${
              signatureFlawChecked
                ? 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
              signatureFlawChecked ? 'bg-rose-600 border-rose-400 text-white' : 'border-slate-600 bg-slate-900'
            }`}>
              {signatureFlawChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
            </span>
            <span>4. Lipsa formulei de respect și a semnăturii</span>
          </button>
        </div>

        {allFlawsIdentified && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs text-emerald-200 leading-relaxed">
              <span className="font-bold block">Excelent! Ai depistat toate cele 4 erori!</span>
              Varianta corectată ar fi: <span className="italic">„Bună ziua, domnule profesor. Vă rog frumos să verificați când aveți timp nota pentru proiectul meu la TIC. Vă mulțumesc, Mihai Ionescu, Clasa a 6-a B.”</span>
            </div>
          </div>
        )}
      </div>

      {/* Dilemma 2: Reply vs Reply All */}
      <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 font-mono font-bold text-sm uppercase tracking-wider">
          <Reply className="w-4 h-4" />
          <span>Dilemă Practică: Butonul „Reply” vs „Reply All”</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
          Profesorul trimite un anunț prin e-mail către toți cei 30 de elevi ai clasei. Vrei să îi transmiți doar profesorului că ai primit mesajul și ai o întrebare personală despre un exercițiu. Pe ce buton apeși?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleReplyAnswer('reply_only')}
            disabled={!!qReplyAnswer}
            className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold text-left transition-all ${
              qReplyAnswer === 'reply_only'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                : 'bg-slate-800/80 border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Reply className="w-4 h-4 text-emerald-400" />
              <span>A. Butonul „Reply” (Răspunde doar profesorului)</span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal">
              Mesajul ajunge doar la profesor, evitând umplerea inutilă a căsuțelor colegilor cu spam.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleReplyAnswer('reply_all')}
            disabled={!!qReplyAnswer}
            className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold text-left transition-all ${
              qReplyAnswer === 'reply_all'
                ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-rose-400" />
              <span>B. Butonul „Reply All” (Răspunde tuturor celor 30)</span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal">
              Mesajul este trimis la absolut toți colegii, chiar dacă întrebarea era strict privată.
            </p>
          </button>
        </div>

        <QuestionHint hint="„Reply All” trimite răspunsul către toți destinatarii inițiali. Folosește-l doar dacă informația este de interes public pentru toată grupa." />

        {qReplyAnswer && (
          <AnswerExplanation
            isCorrect={qReplyAnswer === 'reply_only'}
            explanation={
              qReplyAnswer === 'reply_only'
                ? 'Corect! Folosirea butonului Reply previne spamming-ul inutil al întregii clase.'
                : 'Greșit. Dacă apeși Reply All, toți cei 30 de colegi vor primi mesajul tău privat, încărcându-le inutil căsuțele poștale!'
            }
          />
        )}
      </div>

      {/* Question 3: Caps Meaning */}
      <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-teal-400 font-mono font-bold text-sm uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Test de Concepte Didactice</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 font-medium">
          În eticheta comunicării pe Internet (Netichetă), cum este interpretată scrierea unui text integral cu MAJUSCULE?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleCapsAnswer('polite')}
            disabled={!!qCapsMeaning}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold text-left transition-all ${
              qCapsMeaning === 'polite'
                ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300'
            }`}
          >
            A. Un semn de mare politețe
          </button>
          <button
            type="button"
            onClick={() => handleCapsAnswer('shouting')}
            disabled={!!qCapsMeaning}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold text-left transition-all ${
              qCapsMeaning === 'shouting'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                : 'bg-slate-800/80 border-slate-700 text-slate-300'
            }`}
          >
            B. Echivalentul unui STRIGĂT sau al țipătului
          </button>
          <button
            type="button"
            onClick={() => handleCapsAnswer('fast_typing')}
            disabled={!!qCapsMeaning}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold text-left transition-all ${
              qCapsMeaning === 'fast_typing'
                ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300'
            }`}
          >
            C. Un mod de a scrie mai rapid
          </button>
        </div>

        <QuestionHint hint="Gândește-te la efectul vizual al literelor mari comparat cu un ton ridicat de voce." />

        {qCapsMeaning && (
          <AnswerExplanation
            isCorrect={qCapsMeaning === 'shouting'}
            explanation={
              qCapsMeaning === 'shouting'
                ? 'Corect! Literele mari în spațiul online sunt percepute drept țipete agresive.'
                : 'Greșit. Conform netichetei, scrierea cu majuscule înseamnă că strigi sau țipi la destinatar.'
            }
          />
        )}
      </div>

      {/* Footer Navigation */}
      <PageNavigationFooter
        canAdvance={isAllComplete}
        onNext={() => {
          sounds.playLevelUp();
          onCompletePage(60);
        }}
        nextLabel={isEn ? 'Next: Cyberbullying & Safety Protocol ➜' : 'Următorul: Siguranță & Protocol Anti-Cyberbullying ➜'}
      />
    </div>
  );
};
