import React, { useState, useEffect } from 'react';
import { Share2, Users, Shield, Lock, Eye, MessageSquare, Edit3, CheckCircle2, AlertTriangle, HelpCircle, Sparkles, Globe, UserCheck } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface C1Level2Props {
  onPass: (score: number) => void;
}

type RoleType = 'viewer' | 'commenter' | 'editor';

export const C1Level2_PermissionMatrix: React.FC<C1Level2Props> = ({ onPass }) => {
  // Simulator State: Sharing Dialog for 3 collaborators
  const [profRole, setProfRole] = useState<RoleType>('editor'); // Should be 'viewer'
  const [peerReviewerRole, setPeerReviewerRole] = useState<RoleType>('editor'); // Should be 'commenter'
  const [teammateRole, setTeammateRole] = useState<RoleType>('viewer'); // Should be 'editor'
  const [generalAccess, setGeneralAccess] = useState<'restricted' | 'domain' | 'public_edit'>('public_edit'); // Should not be 'public_edit'

  const [simulationStatus, setSimulationStatus] = useState<string>('');
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
      setSimulationStatus('ALERTA: Linkul este public cu drept de Editare! Un utilizator necunoscut a șters 3 pagini din proiectul vostru!');
      sounds.playFailure();
      return;
    }

    setIsVandalismTriggered(false);

    const isProfCorrect = profRole === 'viewer';
    const isPeerCorrect = peerReviewerRole === 'commenter';
    const isTeammateCorrect = teammateRole === 'editor';

    if (isProfCorrect && isPeerCorrect && isTeammateCorrect) {
      setSimulationStatus('EXCELENT: Matricea de permisiuni este perfect configurată! Rolurile respectă principiul securității minime necesare.');
      sounds.playCorrect();
    } else {
      setSimulationStatus('ATENȚIE: Verifică rolurile! Profesorul doar notează (Viewer), evaluatorul coleg oferă doar feedback pe margine (Commenter), iar coechipierul scrie conținut (Editor).');
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
      setQ1ErrorMsg('Incorect! Rolul Commenter permite adăugarea de note și sugestii pe marginea textului, dar protejează conținutul documentului de ștergeri accidentale.');
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
      setQ2ErrorMsg('Incorect! „Oricine are linkul poate edita” deschide accesul către orice străin de pe internet, expunând munca echipei la vandalism și ștergere.');
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
      setQ3ErrorMsg('Incorect! Profesorul evaluator are nevoie doar de dreptul Viewer (sau Commenter) pentru a citi și nota lucrarea finală.');
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
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400">Nivelul 2 • Manual Art Klett pag. 52–54</span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              Matricea de Permisiuni & Partajare Securizată în Cloud
            </h2>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          Înțelege diferența dintre cele 3 niveluri de acces (<strong>Viewer</strong>, <strong>Commenter</strong>, <strong>Editor</strong>) și previne riscul catastrofal al linkurilor publice nesecurizate.
        </p>
      </div>

      {/* Interactive Simulator: Google Drive Sharing Modal */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              Simulator Dialog Partajare (Google Docs / Drive)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Fișier: „Studiu_Biomuri_Terestre.gdoc”</span>
        </div>

        {/* The Mock Modal Card */}
        <div className="max-w-xl mx-auto w-full bg-slate-950 p-6 rounded-3xl border-2 border-slate-700 shadow-2xl flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-400" />
              <span className="text-sm font-bold text-white">Partajați cu persoane și grupuri</span>
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
                <span className="text-xs font-bold text-white">Maria Popescu (Colegă de Echipă)</span>
                <span className="text-[11px] text-slate-400">maria.p@scoala.edu.ro • Scrie capitolul 2</span>
              </div>
            </div>

            <select
              value={teammateRole}
              onChange={(e) => setTeammateRole(e.target.value as RoleType)}
              className="bg-slate-800 border border-slate-600 rounded-xl px-2.5 py-1 text-xs text-white font-mono cursor-pointer focus:outline-none focus:border-teal-400"
            >
              <option value="viewer">Vizualizator (Viewer)</option>
              <option value="commenter">Comentator (Commenter)</option>
              <option value="editor">Editor (Scriere deplină)</option>
            </select>
          </div>

          {/* Collaborator 2: Peer Reviewer */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Andrei Ionescu (Verificator / Corector)</span>
                <span className="text-[11px] text-slate-400">andrei.i@scoala.edu.ro • Oferă feedback & sugestii</span>
              </div>
            </div>

            <select
              value={peerReviewerRole}
              onChange={(e) => setPeerReviewerRole(e.target.value as RoleType)}
              className="bg-slate-800 border border-slate-600 rounded-xl px-2.5 py-1 text-xs text-white font-mono cursor-pointer focus:outline-none focus:border-teal-400"
            >
              <option value="viewer">Vizualizator (Viewer)</option>
              <option value="commenter">Comentator (Commenter)</option>
              <option value="editor">Editor (Scriere deplină)</option>
            </select>
          </div>

          {/* Collaborator 3: Teacher */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs">
                P
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Prof. Elena Radu (Evaluare Notă)</span>
                <span className="text-[11px] text-slate-400">elena.radu@prof.scoala.edu.ro • Citește lucrarea finală</span>
              </div>
            </div>

            <select
              value={profRole}
              onChange={(e) => setProfRole(e.target.value as RoleType)}
              className="bg-slate-800 border border-slate-600 rounded-xl px-2.5 py-1 text-xs text-white font-mono cursor-pointer focus:outline-none focus:border-teal-400"
            >
              <option value="viewer">Vizualizator (Viewer)</option>
              <option value="commenter">Comentator (Commenter)</option>
              <option value="editor">Editor (Scriere deplină)</option>
            </select>
          </div>

          {/* General Access Link Section */}
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-teal-400" />
              Acces general (Link public):
            </span>

            <select
              value={generalAccess}
              onChange={(e) => setGeneralAccess(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-slate-200 font-sans cursor-pointer focus:outline-none focus:border-teal-400"
            >
              <option value="restricted">Restricționat — Doar persoanele cu acces adăugate pot deschide</option>
              <option value="domain">Colegiul Național — Oricine din grup poate vizualiza</option>
              <option value="public_edit">⚠️ Oricine are linkul poate EDITA (Risc extrem de vandalism)</option>
            </select>
          </div>

          {/* Test Configuration Button */}
          <button
            onClick={handleTestSecurityAudit}
            className="w-full py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <UserCheck className="w-4 h-4" />
            <span>Verifică & Simulează Securitatea Accesului</span>
          </button>

          {/* Status Message */}
          {simulationStatus && (
            <div
              className={`p-3 rounded-xl text-xs font-medium border ${
                isVandalismTriggered
                  ? 'bg-rose-950/70 border-rose-500 text-rose-300'
                  : isConfigCorrect
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                  : 'bg-amber-950/70 border-amber-500 text-amber-300'
              }`}
            >
              {simulationStatus}
            </div>
          )}
        </div>
      </div>

      {/* Quiz Section with 5s Cooldown */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-teal-400" />
          <h3 className="text-base sm:text-lg font-bold text-white">
            Verificare Noțiuni: Permisiuni în Cloud (3 Întrebări Interactive)
          </h3>
        </div>

        {/* Q1 */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase">Întrebarea 1 din 3</div>
          <p className="text-sm font-semibold text-slate-200">
            Ce acțiuni îi sunt permise unui utilizator căruia i-ai acordat dreptul de „Comentator” (Commenter)?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Poate șterge orice capitol și poate schimba fontul titlurilor' },
              { id: 'B', text: 'Nu poate citi textul, ci doar să vadă titlul documentului' },
              { id: 'C', text: 'Poate citi și adăuga note sau sugestii pe margine, fără a putea altera direct textul original' }
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
                <span className="font-bold font-mono mr-1.5">[{opt.id}]</span> {opt.text}
              </button>
            ))}
          </div>

          {q1Cooldown > 0 && (
            <div className="text-xs text-amber-400 font-mono animate-pulse">
              Cooldown activ: {q1Cooldown}s până la următoarea încercare. {q1ErrorMsg}
            </div>
          )}
        </div>

        {/* Q2 */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase">Întrebarea 2 din 3</div>
          <p className="text-sm font-semibold text-slate-200">
            De ce este considerată o greșeală majoră de securitate să setezi accesul general ca „Oricine are linkul poate fi Editor”?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Deoarece Google Docs va funcționa de două ori mai lent' },
              { id: 'B', text: 'Oricine accesează linkul pe internet poate șterge sau vandaliza conținutul fără a putea fi identificat ușor' },
              { id: 'C', text: 'Deoarece documentul nu se va mai putea descărca niciodată în format PDF' }
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
                <span className="font-bold font-mono mr-1.5">[{opt.id}]</span> {opt.text}
              </button>
            ))}
          </div>

          {q2Cooldown > 0 && (
            <div className="text-xs text-amber-400 font-mono animate-pulse">
              Cooldown activ: {q2Cooldown}s până la următoarea încercare. {q2ErrorMsg}
            </div>
          )}
        </div>

        {/* Q3 */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase">Întrebarea 3 din 3</div>
          <p className="text-sm font-semibold text-slate-200">
            Ce permisiune este recomandată la predarea referatului final către profesor pentru notare?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'A', text: 'Numai vizualizare (Viewer) sau Comentator, pentru a păstra versiunea neatinsă' },
              { id: 'B', text: 'Proprietar exclusiv pe contul profesorului fără nicio copie' },
              { id: 'C', text: 'Editor complet cu drept de ștergere a fișierului din Drive' }
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
                <span className="font-bold font-mono mr-1.5">[{opt.id}]</span> {opt.text}
              </button>
            ))}
          </div>

          {q3Cooldown > 0 && (
            <div className="text-xs text-amber-400 font-mono animate-pulse">
              Cooldown activ: {q3Cooldown}s până la următoarea încercare. {q3ErrorMsg}
            </div>
          )}
        </div>

        {/* Pass Button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-xs font-mono text-slate-400">
            {isConfigCorrect && allAnsweredCorrectly ? (
              <span className="text-teal-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                Matricea de securitate și testul sunt complet validate!
              </span>
            ) : (
              <span>Configurează corect matricea de permisiuni și răspunde la întrebări.</span>
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
            <span>Finalizează Nivelul 2 (+100 XP)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
