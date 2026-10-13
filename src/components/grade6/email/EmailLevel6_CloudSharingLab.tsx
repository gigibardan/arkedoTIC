import React, { useState } from 'react';
import {
  Cloud,
  Share2,
  Users,
  Eye,
  MessageSquare,
  Edit3,
  Lock,
  History,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { sounds } from '../../../utils/audio';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface EmailLevel6Props {
  onCompletePage: (earnedScore: number) => void;
}

export const EmailLevel6_CloudSharingLab: React.FC<EmailLevel6Props> = ({ onCompletePage }) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  // Permissions lab configuration
  const [danRole, setDanRole] = useState<'viewer' | 'commenter' | 'editor' | ''>('');
  const [profRole, setProfRole] = useState<'viewer' | 'commenter' | 'editor' | ''>('');
  const [linkPrivacy, setLinkPrivacy] = useState<'restricted' | 'public' | ''>('');

  const [labSubmitted, setLabSubmitted] = useState<boolean>(false);
  const [labSuccess, setLabSuccess] = useState<boolean>(false);

  // Version history quiz
  const [qVersionAnswer, setQVersionAnswer] = useState<string | null>(null);

  const handleValidateLab = () => {
    if (!danRole || !profRole || !linkPrivacy) return;

    // Dan should be editor (partner), Teacher should be commenter or viewer, link must be restricted for safety
    const isDanOk = danRole === 'editor';
    const isProfOk = profRole === 'commenter' || profRole === 'viewer';
    const isLinkOk = linkPrivacy === 'restricted';

    const passed = isDanOk && isProfOk && isLinkOk;
    setLabSubmitted(true);
    setLabSuccess(passed);

    if (passed) sounds.playCorrect();
    else sounds.playWrong();
  };

  const handleVersionAnswer = (ans: string) => {
    if (qVersionAnswer) return;
    setQVersionAnswer(ans);
    if (ans === 'version_history') sounds.playCorrect();
    else sounds.playWrong();
  };

  const isAllComplete = labSuccess && qVersionAnswer === 'version_history';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-950/80 via-slate-900 to-indigo-950 border-2 border-sky-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-mono font-bold border border-sky-500/40">
                {isEn ? 'Unit 3 • Lesson 6 • Grade 6' : 'Unitatea 3 • Lecția 6 • Clasa a VI-a'}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {isEn ? 'Level 6 of 7' : 'Nivelul 6 din 7'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-wide">
              {isEn ? 'Cloud Collaboration & Secure Sharing Permissions' : 'Colaborare în Cloud & Gestionarea Securizată a Permisiunilor'}
            </h1>
            <p className="text-sm text-sky-200/90 mt-2 max-w-2xl leading-relaxed">
              {isEn
                ? 'Master the 3 core sharing roles: Viewer, Commenter, and Editor. Configure link security and restore deleted content using Version History.'
                : 'Stăpânește cele 3 permisiuni cheie de partajare: Vizualizator, Comentator și Editor. Configurează accesul securizat și restaurează documente prin Istoricul Versiunilor.'}
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-sky-500/20 border-2 border-sky-400/40 flex items-center justify-center text-3xl shadow-inner shrink-0">
            ☁️
          </div>
        </div>
      </div>

      {/* 3 Roles Hierarchy Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Viewer */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border-2 border-blue-500/30 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-xl bg-blue-500/20 text-blue-300 font-mono font-bold text-xs">
                Rolul: Vizualizator (Viewer)
              </span>
              <Eye className="w-5 h-5 text-blue-400" />
            </div>
            <h4 className="font-bold text-white text-base mb-1">Doar Citire & Descărcare</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Persoana poate citi documentul și îl poate tipări, dar <span className="text-rose-400 font-bold">nu poate modifica</span> niciun cuvânt și nu poate adăuga comentarii.
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-blue-300 font-mono">
            Nivel acces: Citire simplă (0% modificări)
          </div>
        </div>

        {/* Commenter */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border-2 border-amber-500/30 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-mono font-bold text-xs">
                Rolul: Comentator (Commenter)
              </span>
              <MessageSquare className="w-5 h-5 text-amber-400" />
            </div>
            <h4 className="font-bold text-white text-base mb-1">Citire & Sugestii pe Margine</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Nu poate altera textul original, dar poate lăsa bule de comentarii și propuneri de corectare pentru autori.
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-amber-300 font-mono">
            Nivel acces: Feedback constructiv
          </div>
        </div>

        {/* Editor */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/30 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs">
                Rolul: Editor (Colaborator Plin)
              </span>
              <Edit3 className="w-5 h-5 text-emerald-400" />
            </div>
            <h4 className="font-bold text-white text-base mb-1">Drepturi Complete de Modificare</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Poate scrie, șterge, formata, adăuga imagini și partaja mai departe documentul în timp real cu ceilalți co-autori.
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-emerald-300 font-mono font-bold">
            Nivel acces: Control total asupra fișierului
          </div>
        </div>
      </div>

      {/* Interactive Permission Setup Lab */}
      <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-400 font-mono font-bold text-sm uppercase tracking-wider">
            <Share2 className="w-4 h-4" />
            <span>Simulator Interactiv: Fereastra de Partajare (Share Settings)</span>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-300">
            {labSuccess ? '✅ Configurație Corectă' : 'În Configurare'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed">
          <span className="font-bold text-white block mb-1">Misiunea Ta:</span>
          Lucrezi la un proiect de echipă la Informatică denumit <code className="text-amber-400 font-mono">„Robotică_și_Viitor.docx”</code>.
          Trebuie să partajezi fișierul astfel:
          <ul className="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
            <li>Colegul tău de echipă, Dan, trebuie să poată scrie capitole împreună cu tine.</li>
            <li>Profesorul de TIC trebuie să vadă proiectul și să poată adăuga sugestii/observații pe marginea textului.</li>
            <li>Restul Internetului nu trebuie să poată accesa fișierul dacă linkul este scăpat din greșeală pe rețele.</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* User 1: Dan */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="text-xs font-mono font-bold text-white flex items-center justify-between">
              <span>Dan (Coleg de echipă)</span>
              <span className="text-[10px] text-slate-400">dan@scoala.ro</span>
            </div>
            <select
              value={danRole}
              onChange={(e) => {
                setDanRole(e.target.value as any);
                setLabSubmitted(false);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:ring-2 focus:ring-sky-500"
            >
              <option value="">-- Alege Permisiunea --</option>
              <option value="viewer">Vizualizator (Viewer)</option>
              <option value="commenter">Comentator (Commenter)</option>
              <option value="editor">Editor (poate scrie/modifica)</option>
            </select>
          </div>

          {/* User 2: Professor */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="text-xs font-mono font-bold text-white flex items-center justify-between">
              <span>Profesor TIC</span>
              <span className="text-[10px] text-slate-400">prof@scoala.ro</span>
            </div>
            <select
              value={profRole}
              onChange={(e) => {
                setProfRole(e.target.value as any);
                setLabSubmitted(false);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:ring-2 focus:ring-sky-500"
            >
              <option value="">-- Alege Permisiunea --</option>
              <option value="commenter">Comentator (poate lăsa sugestii)</option>
              <option value="viewer">Vizualizator (doar citire)</option>
              <option value="editor">Editor (poate rescrie proiectul)</option>
            </select>
          </div>

          {/* Link Privacy */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="text-xs font-mono font-bold text-white flex items-center justify-between">
              <span>Acces General Link</span>
              <Lock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <select
              value={linkPrivacy}
              onChange={(e) => {
                setLinkPrivacy(e.target.value as any);
                setLabSubmitted(false);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:ring-2 focus:ring-sky-500"
            >
              <option value="">-- Alege Securitatea Linkului --</option>
              <option value="restricted">Restricționat (doar adresele adăugate)</option>
              <option value="public">Public (oricine are linkul de pe net)</option>
            </select>
          </div>
        </div>

        {!labSubmitted ? (
          <button
            type="button"
            onClick={handleValidateLab}
            disabled={!danRole || !profRole || !linkPrivacy}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm font-mono flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Aplică Permisiunile în Cloud</span>
          </button>
        ) : (
          <AnswerExplanation
            isCorrect={labSuccess}
            explanation={
              labSuccess
                ? 'Impecabil! Dan este Editor (poate scrie conținut), profesorul este Comentator/Vizualizator (lasă observații fără să altereze textul), iar linkul este Restricționat pentru securitate.'
                : 'Atenție! Colegul de echipă are nevoie de drept de Editor pentru a lucra, iar accesul general la link trebuie să fie Restricționat pentru a preveni scurgerile de date pe Internet.'
            }
          />
        )}
      </div>

      {/* Version History Lifesaver Question */}
      <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 font-mono font-bold text-sm uppercase tracking-wider">
          <History className="w-4 h-4" />
          <span>Salvarea de Urgență: Istoricul Versiunilor (Version History)</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
          În timp ce lucrați pe un document partajat, un coleg a selectat din greșeală 3 pagini întregi și le-a șters, apoi a închis fereastra. Cum poți recupera textul pierdut fără să rescrii nimic de la zero?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleVersionAnswer('lost_forever')}
            disabled={!!qVersionAnswer}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold text-left transition-all ${
              qVersionAnswer === 'lost_forever'
                ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300'
            }`}
          >
            A. Textul este pierdut definitiv și trebuie rescris totul
          </button>

          <button
            type="button"
            onClick={() => handleVersionAnswer('version_history')}
            disabled={!!qVersionAnswer}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold text-left transition-all ${
              qVersionAnswer === 'version_history'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                : 'bg-slate-800/80 border-slate-700 text-slate-300'
            }`}
          >
            B. Deschizi meniul „Istoricul Versiunilor” (Version History) și restaurezi versiunea de acum 30 de minute
          </button>
        </div>

        <QuestionHint hint="Aplicațiile Cloud salvează fiecare literă în mod continuu într-o linie a timpului numită Version History." />

        {qVersionAnswer && (
          <AnswerExplanation
            isCorrect={qVersionAnswer === 'version_history'}
            explanation={
              qVersionAnswer === 'version_history'
                ? 'Excelent! În Cloud nu pierzi niciodată munca: Version History îți permite să călătorești înapoi în timp și să restaurezi orice stare anterioară a fișierului!'
                : 'Incorect. Serviciile Cloud precum Google Docs sau OneDrive păstrează automat Istoricul Versiunilor, permițând restaurarea instantanee cu un singur click.'
            }
          />
        )}
      </div>

      {/* Footer Navigation */}
      <PageNavigationFooter
        canAdvance={isAllComplete}
        onNext={() => {
          sounds.playLevelUp();
          onCompletePage(90);
        }}
        nextLabel={isEn ? 'Next: Final Exam & Official Diploma ➜' : 'Următorul: Examenul Final & Marea Diplomă ➜'}
      />
    </div>
  );
};
