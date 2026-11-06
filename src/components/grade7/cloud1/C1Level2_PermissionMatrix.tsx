import React, { useState, useEffect } from 'react';
import { Share2, Users, Shield, Lock, Eye, MessageSquare, Edit3, CheckCircle2, AlertTriangle, HelpCircle, Sparkles, Globe, UserCheck } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useLanguage } from '../../../context/LanguageContext';

interface C1Level2Props {
  onPass: (score: number) => void;
}

type RoleType = 'viewer' | 'commenter' | 'editor';

export const C1Level2_PermissionMatrix: React.FC<C1Level2Props> = ({ onPass }) => {
  const { lang } = useLanguage();

  // Simulator State: Sharing Dialog for 3 collaborators
  const [profRole, setProfRole] = useState<RoleType>('editor'); // Should be 'viewer'
  const [peerReviewerRole, setPeerReviewerRole] = useState<RoleType>('editor'); // Should be 'commenter'
  const [teammateRole, setTeammateRole] = useState<RoleType>('viewer'); // Should be 'editor'
  const [generalAccess, setGeneralAccess] = useState<'restricted' | 'domain' | 'public_edit'>('public_edit'); // Should not be 'public_edit'

  const [simulationStatusRo, setSimulationStatusRo] = useState<string>('');
  const [simulationStatusEn, setSimulationStatusEn] = useState<string>('');
  const [isVandalismTriggered, setIsVandalismTriggered] = useState<boolean>(false);

  // Quiz questions state with 5s cooldown
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q1Cooldown, setQ1Cooldown] = useState<number>(0);
  const [q1ErrorMsg, setQ1ErrorMsg] = useState<string>('');

  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q2Cooldown, setQ2Cooldown] = useState<number>(0);
  const [q2ErrorMsg, setQ2ErrorMsg] = useState<string>('');

  const [q3Answer, setQ3Answer] = useState<string | null>(null);
  const [q3Cooldown, setQ3Cooldown] = useState<number>(0);
  const [q3ErrorMsg, setQ3ErrorMsg] = useState<string>('');

  const [isPassed, setIsPassed] = useState<boolean>(false);

  // Cooldown timers
  useEffect(() => {
    const timer = setInterval(() => {
      setQ1Cooldown((c) => (c > 0 ? c - 1 : 0));
      setQ2Cooldown((c) => (c > 0 ? c - 1 : 0));
      setQ3Cooldown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTestSecurityAudit = () => {
    sounds.playClick();
    if (generalAccess === 'public_edit') {
      setIsVandalismTriggered(true);
      setSimulationStatusRo('ALERTA: Linkul este public cu drept de Editare! Un utilizator necunoscut a șters 3 pagini din proiectul vostru!');
      setSimulationStatusEn('ALERT: General link is set to Public Edit! An anonymous visitor deleted 3 pages from your report!');
      sounds.playFailure();
      return;
    }

    setIsVandalismTriggered(false);

    const isProfCorrect = profRole === 'viewer';
    const isPeerCorrect = peerReviewerRole === 'commenter';
    const isTeammateCorrect = teammateRole === 'editor';

    if (isProfCorrect && isPeerCorrect && isTeammateCorrect) {
      setSimulationStatusRo('EXCELENT: Matricea de permisiuni este perfect configurată! Rolurile respectă principiul securității minime necesare.');
      setSimulationStatusEn('EXCELLENT: The permission matrix is securely configured! Roles adhere to the principle of least privilege.');
      sounds.playCorrect();
    } else {
      setSimulationStatusRo('ATENȚIE: Verifică rolurile! Profesorul doar notează (Viewer), evaluatorul coleg oferă doar feedback pe margine (Commenter), iar coechipierul scrie conținut (Editor).');
      setSimulationStatusEn('ATTENTION: Check the assigned roles! The teacher only grades (Viewer), the peer reviewer gives margin suggestions (Commenter), and the teammate writes content (Editor).');
      sounds.playWrong();
    }
  };

  const handleCheckQ1 = (choice: string) => {
    if (q1Cooldown > 0) return;
    setQ1Answer(choice);
    if (choice === 'C') {
      sounds.playCorrect();
      setQ1ErrorMsg('');
    } else {
      sounds.playFailure();
      setQ1Cooldown(5);
      setQ1ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Rolul Commenter permite adăugarea de note și sugestii pe marginea textului, dar protejează conținutul documentului de ștergeri accidentale.'
          : 'Incorrect! The Commenter role permits adding margin notes and suggestions, while shielding original document content from accidental deletions.'
      );
    }
  };

  const handleCheckQ2 = (choice: string) => {
    if (q2Cooldown > 0) return;
    setQ2Answer(choice);
    if (choice === 'B') {
      sounds.playCorrect();
      setQ2ErrorMsg('');
    } else {
      sounds.playFailure();
      setQ2Cooldown(5);
      setQ2ErrorMsg(
        lang === 'ro'
          ? 'Incorect! „Oricine are linkul poate edita” deschide accesul către orice străin de pe internet, expunând munca echipei la vandalism și ștergere.'
          : 'Incorrect! Setting "Anyone with the link can edit" exposes team files to internet strangers and anonymous deletion or vandalism.'
      );
    }
  };

  const handleCheckQ3 = (choice: string) => {
    if (q3Cooldown > 0) return;
    setQ3Answer(choice);
    if (choice === 'A') {
      sounds.playCorrect();
      setQ3ErrorMsg('');
    } else {
      sounds.playFailure();
      setQ3Cooldown(5);
      setQ3ErrorMsg(
        lang === 'ro'
          ? 'Incorect! Profesorul evaluator are nevoie doar de dreptul Viewer (sau Commenter) pentru a citi și nota lucrarea finală.'
          : 'Incorrect! The grading teacher only requires Viewer (or Commenter) permissions to review and score final student submissions.'
      );
    }
  };

  const isConfigCorrect = profRole === 'viewer' && peerReviewerRole === 'commenter' && teammateRole === 'editor' && generalAccess !== 'public_edit';
  const allAnsweredCorrectly = q1Answer === 'C' && q2Answer === 'B' && q3Answer === 'A';

  const handleFinishLevel = () => {
    if (!allAnsweredCorrectly || !isConfigCorrect) return;
    setIsPassed(true);
    sounds.playLevelComplete();
    onPass(100);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950/80 via-slate-900 to-emerald-950/80 border border-teal-500/30 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400">
              {lang === 'ro'
                ? 'Nivelul 2 • Manual Art Klett pag. 52–54'
                : 'Level 2 • Art Klett Textbook pp. 52–54'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              {lang === 'ro'
                ? 'Matricea de Permisiuni & Partajare Securizată în Cloud'
                : 'Permission Matrix & Secure Cloud Sharing'}
            </h2>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          {lang === 'ro' ? (
            <>
              Înțelege diferența dintre cele 3 niveluri de acces (<strong>Viewer</strong>, <strong>Commenter</strong>, <strong>Editor</strong>) și previne riscul catastrofal al linkurilor publice nesecurizate.
            </>
          ) : (
            <>
              Understand the clear boundaries among access tiers (<strong>Viewer</strong>, <strong>Commenter</strong>, <strong>Editor</strong>) and avoid the severe security pitfalls of careless public edit links.
            </>
          )}
        </p>
      </div>

      {/* Interactive Simulator: Google Drive Sharing Modal */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              {lang === 'ro'
                ? 'Simulator Dialog Partajare (Google Docs / Drive)'
                : 'Sharing Permissions Dialog Simulator (Google Docs / Drive)'}
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {lang === 'ro' ? 'Fișier: „Studiu_Biomuri_Terestre.gdoc”' : 'File: “Terrestrial_Biomes_Report.gdoc”'}
          </span>
        </div>

        {/* The Mock Modal Card */}
        <div className="max-w-xl mx-auto w-full bg-slate-950 p-6 rounded-3xl border-2 border-slate-700 shadow-2xl flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-400" />
              <span className="text-sm font-bold text-white">
                {lang === 'ro' ? 'Partajați cu persoane și grupuri' : 'Share with people and groups'}
              </span>
            </div>
            <Lock className="w-4 h-4 text-slate-400" />
          </div>

          {/* Collaborator 1: Teammate */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs">
                M
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">
                  {lang === 'ro' ? 'Maria Popescu (Colegă de Echipă)' : 'Maria Miller (Teammate)'}
                </span>
                <span className="text-[11px] text-slate-400">
                  maria.p@scoala.edu.ro • {lang === 'ro' ? 'Scrie capitolul 2' : 'Writing chapter 2'}
                </span>
              </div>
            </div>

            <select
              value={teammateRole}
              onChange={(e) => setTeammateRole(e.target.value as RoleType)}
              className="bg-slate-800 border border-slate-600 rounded-xl px-2.5 py-1 text-xs text-white font-mono cursor-pointer focus:outline-none focus:border-teal-400"
            >
              <option value="viewer">{lang === 'ro' ? 'Vizualizator (Viewer)' : 'Viewer'}</option>
              <option value="commenter">{lang === 'ro' ? 'Comentator (Commenter)' : 'Commenter'}</option>
              <option value="editor">{lang === 'ro' ? 'Editor (Scriere deplină)' : 'Editor (Full access)'}</option>
            </select>
          </div>

          {/* Collaborator 2: Peer Reviewer */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">
                  {lang === 'ro' ? 'Andrei Ionescu (Verificator / Corector)' : 'Andrew Stone (Peer Reviewer)'}
                </span>
                <span className="text-[11px] text-slate-400">
                  andrei.i@scoala.edu.ro • {lang === 'ro' ? 'Oferă feedback & sugestii' : 'Provides feedback & notes'}
                </span>
              </div>
            </div>

            <select
              value={peerReviewerRole}
              onChange={(e) => setPeerReviewerRole(e.target.value as RoleType)}
              className="bg-slate-800 border border-slate-600 rounded-xl px-2.5 py-1 text-xs text-white font-mono cursor-pointer focus:outline-none focus:border-teal-400"
            >
              <option value="viewer">{lang === 'ro' ? 'Vizualizator (Viewer)' : 'Viewer'}</option>
              <option value="commenter">{lang === 'ro' ? 'Comentator (Commenter)' : 'Commenter'}</option>
              <option value="editor">{lang === 'ro' ? 'Editor (Scriere deplină)' : 'Editor (Full access)'}</option>
            </select>
          </div>

          {/* Collaborator 3: Teacher */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs">
                P
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">
                  {lang === 'ro' ? 'Prof. Elena Radu (Evaluare Notă)' : 'Prof. Helen Ross (Grading Teacher)'}
                </span>
                <span className="text-[11px] text-slate-400">
                  elena.radu@prof.scoala.edu.ro • {lang === 'ro' ? 'Citește lucrarea finală' : 'Reads finished report'}
                </span>
              </div>
            </div>

            <select
              value={profRole}
              onChange={(e) => setProfRole(e.target.value as RoleType)}
              className="bg-slate-800 border border-slate-600 rounded-xl px-2.5 py-1 text-xs text-white font-mono cursor-pointer focus:outline-none focus:border-teal-400"
            >
              <option value="viewer">{lang === 'ro' ? 'Vizualizator (Viewer)' : 'Viewer'}</option>
              <option value="commenter">{lang === 'ro' ? 'Comentator (Commenter)' : 'Commenter'}</option>
              <option value="editor">{lang === 'ro' ? 'Editor (Scriere deplină)' : 'Editor (Full access)'}</option>
            </select>
          </div>

          {/* General Access Link Section */}
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-teal-400" />
              {lang === 'ro' ? 'Acces general (Link public):' : 'General access (Public link):'}
            </span>

            <select
              value={generalAccess}
              onChange={(e) => setGeneralAccess(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-slate-200 font-sans cursor-pointer focus:outline-none focus:border-teal-400"
            >
              <option value="restricted">
                {lang === 'ro'
                  ? 'Restricționat — Doar persoanele cu acces adăugate pot deschide'
                  : 'Restricted — Only added collaborators can open'}
              </option>
              <option value="domain">
                {lang === 'ro'
                  ? 'Colegiul Național — Oricine din grup poate vizualiza'
                  : 'School Domain — Anyone in domain can view'}
              </option>
              <option value="public_edit">
                {lang === 'ro'
                  ? '⚠️ Oricine are linkul poate EDITA (Risc extrem de vandalism)'
                  : '⚠️ Anyone with the link can EDIT (Extreme vandalism risk)'}
              </option>
            </select>
          </div>

          {/* Test Configuration Button */}
          <button
            onClick={handleTestSecurityAudit}
            className="w-full py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <UserCheck className="w-4 h-4" />
            <span>
              {lang === 'ro' ? 'Verifică & Simulează Securitatea Accesului' : 'Audit & Test Security Permissions'}
            </span>
          </button>

          {/* Status Message */}
          {(simulationStatusRo || simulationStatusEn) && (
            <div
              className={`p-3 rounded-xl text-xs font-medium border ${
                isVandalismTriggered
                  ? 'bg-rose-950/70 border-rose-500 text-rose-300'
                  : isConfigCorrect
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                  : 'bg-amber-950/70 border-amber-500 text-amber-300'
              }`}
            >
              {lang === 'ro' ? simulationStatusRo : simulationStatusEn}
            </div>
          )}
        </div>
      </div>

      {/* Quiz Section with 5s Cooldown */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-teal-400" />
          <h3 className="text-base sm:text-lg font-bold text-white">
            {lang === 'ro'
              ? 'Verificare Noțiuni: Permisiuni în Cloud (3 Întrebări Interactive)'
              : 'Knowledge Check: Cloud Permissions (3 Interactive Questions)'}
          </h3>
        </div>

        {/* Q1 */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase">
            {lang === 'ro' ? 'Întrebarea 1 din 3' : 'Question 1 of 3'}
          </div>
          <p className="text-sm font-semibold text-slate-200">
            {lang === 'ro'
              ? 'Ce acțiuni îi sunt permise unui utilizator căruia i-ai acordat dreptul de „Comentator” (Commenter)?'
              : 'What actions can a user perform when granted the "Commenter" role?'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'A',
                textRo: 'Poate șterge orice capitol și poate schimba fontul titlurilor',
                textEn: 'Can delete any section and format headline typography'
              },
              {
                id: 'B',
                textRo: 'Nu poate citi textul, ci doar să vadă titlul documentului',
                textEn: 'Cannot view document body, only filename and title'
              },
              {
                id: 'C',
                textRo: 'Poate citi și adăuga note sau sugestii pe margine, fără a putea altera direct textul original',
                textEn: 'Can read and leave margin notes/suggestions without modifying the original text'
              }
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={q1Cooldown > 0}
                onClick={() => handleCheckQ1(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                  q1Answer === opt.id
                    ? opt.id === 'C'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:border-slate-500'
                } ${q1Cooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="font-bold font-mono mr-1.5">[{opt.id}]</span>{' '}
                {lang === 'ro' ? opt.textRo : opt.textEn}
              </button>
            ))}
          </div>

          {q1Cooldown > 0 && (
            <div className="text-xs text-amber-400 font-mono animate-pulse">
              {lang === 'ro'
                ? `Cooldown activ: ${q1Cooldown}s până la următoarea încercare. ${q1ErrorMsg}`
                : `Cooldown active: ${q1Cooldown}s until next attempt. ${q1ErrorMsg}`}
            </div>
          )}
        </div>

        {/* Q2 */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase">
            {lang === 'ro' ? 'Întrebarea 2 din 3' : 'Question 2 of 3'}
          </div>
          <p className="text-sm font-semibold text-slate-200">
            {lang === 'ro'
              ? 'De ce este considerată o greșeală majoră de securitate să setezi accesul general ca „Oricine are linkul poate fi Editor”?'
              : 'Why is setting general access to "Anyone with the link can edit" deemed a critical security hazard?'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'A',
                textRo: 'Deoarece Google Docs va funcționa de două ori mai lent',
                textEn: 'Because Google Docs will run at half its normal speed'
              },
              {
                id: 'B',
                textRo: 'Oricine accesează linkul pe internet poate șterge sau vandaliza conținutul fără a putea fi identificat ușor',
                textEn: 'Anyone who discovers the link online can wipe or deface team content anonymously'
              },
              {
                id: 'C',
                textRo: 'Deoarece documentul nu se va mai putea descărca niciodată în format PDF',
                textEn: 'Because the document can never be exported as PDF thereafter'
              }
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={q2Cooldown > 0}
                onClick={() => handleCheckQ2(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                  q2Answer === opt.id
                    ? opt.id === 'B'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:border-slate-500'
                } ${q2Cooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="font-bold font-mono mr-1.5">[{opt.id}]</span>{' '}
                {lang === 'ro' ? opt.textRo : opt.textEn}
              </button>
            ))}
          </div>

          {q2Cooldown > 0 && (
            <div className="text-xs text-amber-400 font-mono animate-pulse">
              {lang === 'ro'
                ? `Cooldown activ: ${q2Cooldown}s până la următoarea încercare. ${q2ErrorMsg}`
                : `Cooldown active: ${q2Cooldown}s until next attempt. ${q2ErrorMsg}`}
            </div>
          )}
        </div>

        {/* Q3 */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase">
            {lang === 'ro' ? 'Întrebarea 3 din 3' : 'Question 3 of 3'}
          </div>
          <p className="text-sm font-semibold text-slate-200">
            {lang === 'ro'
              ? 'Ce permisiune este recomandată la predarea referatului final către profesor pentru notare?'
              : 'What role is appropriate when submitting final coursework to a teacher for evaluation?'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'A',
                textRo: 'Numai vizualizare (Viewer) sau Comentator, pentru a păstra versiunea neatinsă',
                textEn: 'Viewer or Commenter, safeguarding the submitted work in its authentic final state'
              },
              {
                id: 'B',
                textRo: 'Proprietar exclusiv pe contul profesorului fără nicio copie',
                textEn: 'Transferring exclusive ownership to the instructor without keeping a copy'
              },
              {
                id: 'C',
                textRo: 'Editor complet cu drept de ștergere a fișierului din Drive',
                textEn: 'Full Editor privileges with deletion rights on student Drive storage'
              }
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={q3Cooldown > 0}
                onClick={() => handleCheckQ3(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                  q3Answer === opt.id
                    ? opt.id === 'A'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:border-slate-500'
                } ${q3Cooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="font-bold font-mono mr-1.5">[{opt.id}]</span>{' '}
                {lang === 'ro' ? opt.textRo : opt.textEn}
              </button>
            ))}
          </div>

          {q3Cooldown > 0 && (
            <div className="text-xs text-amber-400 font-mono animate-pulse">
              {lang === 'ro'
                ? `Cooldown activ: ${q3Cooldown}s până la următoarea încercare. ${q3ErrorMsg}`
                : `Cooldown active: ${q3Cooldown}s until next attempt. ${q3ErrorMsg}`}
            </div>
          )}
        </div>

        {/* Pass Button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-xs font-mono text-slate-400">
            {isConfigCorrect && allAnsweredCorrectly ? (
              <span className="text-teal-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                {lang === 'ro'
                  ? 'Matricea de securitate și testul sunt complet validate!'
                  : 'Security matrix and knowledge check are fully validated!'}
              </span>
            ) : (
              <span>
                {lang === 'ro'
                  ? 'Configurează corect matricea de permisiuni și răspunde la întrebări.'
                  : 'Configure the permission matrix properly and answer all questions.'}
              </span>
            )}
          </div>

          <button
            onClick={handleFinishLevel}
            disabled={!isConfigCorrect || !allAnsweredCorrectly || isPassed}
            className={`px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              isConfigCorrect && allAnsweredCorrectly && !isPassed
                ? 'bg-teal-600 hover:bg-teal-500 text-white font-black shadow-lg shadow-teal-600/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {lang === 'ro' ? 'Finalizează Nivelul 2 (+100 XP)' : 'Complete Level 2 (+100 XP)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
