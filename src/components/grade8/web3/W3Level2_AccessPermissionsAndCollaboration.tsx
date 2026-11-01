import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Eye,
  Edit3,
  Lock,
  Globe,
  Building,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface W3Level2Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
}

export const W3Level2_AccessPermissionsAndCollaboration: React.FC<W3Level2Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  // Simulator state
  const [generalAccess, setGeneralAccess] = useState<'restricted' | 'domain' | 'public'>('domain');
  const [publishedAccess, setPublishedAccess] = useState<'public' | 'domain' | 'restricted'>('public');
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { id: '1', name: 'Popescu Andrei (Tu)', email: 'andrei.p@scoala8.ro', role: 'owner' },
    { id: '2', name: 'Prof. Radu Ionescu', email: 'radu.ionescu@scoala8.ro', role: 'editor' },
    { id: '3', name: 'Elena Moraru (Coleg)', email: 'elena.m@scoala8.ro', role: 'editor' }
  ]);
  const [newEmail, setNewEmail] = useState<string>('');
  const [newRole, setNewRole] = useState<'editor' | 'viewer'>('editor');

  // Quiz state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});

  const handleSelectAnswer = (qId: string, optId: string) => {
    if (submitted[qId] || isLocked(qId)) return;
    setAnswers(prev => ({ ...prev, [qId]: optId }));
    sounds.playClick();
  };

  const handleVerify = (qId: string, correctId: string) => {
    if (isLocked(qId)) return;
    const isCorrect = answers[qId] === correctId;
    if (isCorrect) {
      sounds.playCorrect();
      setSubmitted(prev => ({ ...prev, [qId]: true }));
    } else {
      sounds.playWrong();
      triggerCooldown(qId);
    }
  };

  const allQuizzesPassed = submitted['q1'] && submitted['q2'];

  const handleFinish = () => {
    sounds.playLevelUp();
    if (onCompletePage) onCompletePage(100);
    if (onComplete) onComplete();
  };

  const handleAddCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes('@')) return;
    const newCollab: Collaborator = {
      id: Date.now().toString(),
      name: newEmail.split('@')[0],
      email: newEmail.trim(),
      role: newRole
    };
    setCollaborators(prev => [...prev, newCollab]);
    setNewEmail('');
    sounds.playCorrect();
  };

  const handleRemoveCollaborator = (id: string) => {
    setCollaborators(prev => prev.filter(c => c.id !== id));
    sounds.playClick();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-indigo-700 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-200 text-sm font-semibold tracking-wide uppercase mb-1">
              <Users className="w-5 h-5 text-teal-300" />
              <span>Unitatea 2: Pagini Web & Proiecte Online • Modulul 2C</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Lecția 2: Partajarea & Gestionarea Permisiunilor de Acces
            </h1>
            <p className="text-teal-100 text-sm md:text-base mt-1 max-w-3xl">
              Manual Art Klett pag. 53–54: Descoperă cum se lucrează în echipă la un site web, diferența dintre
              rolul de Redactor (Editor) și Cititor (Viewer), și cum se securizează accesul la ciornă.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-teal-200 font-bold block">Nivel</span>
            <span className="text-2xl font-black text-white">2 / 7</span>
          </div>
        </div>
      </div>

      {/* Manual Theory Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <BookOpen className="w-6 h-6 text-indigo-600 flex-shrink-0" />
          <h2 className="text-lg font-bold text-slate-800">
            Repere Teoretice: Roluri & Niveluri de Securitate la Partajare (Manual pag. 53–54)
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 space-y-2">
            <div className="font-bold text-indigo-900 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-indigo-600" />
              Redactor (Editor) vs Cititor (Viewer)
            </div>
            <p className="text-slate-600 text-xs">
              <strong>Redactorul</strong> poate modifica paginile, șterge secțiuni sau schimba tema.
              <strong>Cititorul</strong> (Vizualizator al site-ului publicat) poate doar naviga pe pagină,
              fără a avea acces la codul sau uneltele de editare.
            </p>
          </div>

          <div className="bg-teal-50/70 p-4 rounded-xl border border-teal-100 space-y-2">
            <div className="font-bold text-teal-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-teal-600" />
              Domeniu Școlar Protejat
            </div>
            <p className="text-slate-600 text-xs">
              Pentru referate de clasă și proiecte interne, opțiunea „Numai persoanele din organizația mea”
              (ex: <code>@scoala.edu.ro</code>) garantează că site-ul este vizibil doar pentru colegi și profesori.
            </p>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-100 space-y-2">
            <div className="font-bold text-amber-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-600" />
              Principiul Securității Minime
            </div>
            <p className="text-slate-600 text-xs">
              Nu se acordă niciodată rolul de Redactor unor persoane anonime pe internet. Doar membrii desemnați
              ai echipei de proiect primesc drepturi de scriere, restul publicului primind statut de Cititor.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Share Modal Simulator */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-lg">
              Simulator Interactiv: Fereastra „Partajați cu alte persoane și grupuri”
            </h3>
          </div>
          <span className="text-xs bg-teal-100 text-teal-800 px-3 py-1 rounded-full font-semibold">
            Laborator Securitate
          </span>
        </div>

        {/* Modal Simulator */}
        <div className="max-w-2xl mx-auto border-2 border-slate-300 rounded-2xl shadow-xl overflow-hidden bg-white">
          <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between text-sm font-bold">
            <span className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-teal-400" />
              Partajare: Revista Școlară Clasa a VIII-a
            </span>
            <span className="text-xs text-slate-400 font-mono">Google Drive Workspace</span>
          </div>

          <div className="p-6 space-y-5">
            {/* Add user form */}
            <form onSubmit={handleAddCollaborator} className="flex gap-2">
              <input
                type="email"
                placeholder="Introdu adresa de e-mail a colegului (ex: coleg@scoala.ro)"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-xs bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
                className="border border-slate-300 rounded-xl px-3 py-2 text-xs bg-slate-50 font-semibold"
              >
                <option value="editor">Editor (Redactor)</option>
                <option value="viewer">Cititor (Viewer)</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition"
              >
                Adaugă
              </button>
            </form>

            {/* Collaborators list */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Persoane cu acces direct:
              </label>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                {collaborators.map(c => (
                  <div key={c.id} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                        {c.name[0]}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">{c.name}</div>
                        <div className="text-[11px] text-slate-500">{c.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        c.role === 'owner'
                          ? 'bg-amber-100 text-amber-800'
                          : c.role === 'editor'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {c.role === 'owner' ? 'Proprietar' : c.role === 'editor' ? 'Redactor' : 'Cititor'}
                      </span>
                      {c.role !== 'owner' && (
                        <button
                          onClick={() => handleRemoveCollaborator(c.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Elimină accesul"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* General Access Configuration */}
            <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Acces General la Site-ul Publicat:
              </div>
              <div className="grid sm:grid-cols-3 gap-2">
                {[
                  {
                    id: 'restricted',
                    label: 'Restricționat',
                    desc: 'Numai persoanele adăugate nominal pot vizualiza',
                    icon: Lock
                  },
                  {
                    id: 'domain',
                    label: 'Domeniu Școlar',
                    desc: 'Toți elevii din @scoala8.ro pot vizualiza',
                    icon: Building
                  },
                  {
                    id: 'public',
                    label: 'Public pe Internet',
                    desc: 'Oricine de pe glob poate vizualiza site-ul',
                    icon: Globe
                  }
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setPublishedAccess(item.id as any);
                        sounds.playClick();
                      }}
                      className={`p-3 rounded-xl border text-left transition ${
                        publishedAccess === item.id
                          ? 'border-indigo-600 bg-white shadow ring-2 ring-indigo-200'
                          : 'border-slate-200 bg-white/60 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800 mb-1">
                        <Icon className="w-3.5 h-3.5 text-indigo-600" />
                        {item.label}
                      </div>
                      <div className="text-[11px] text-slate-500 leading-tight">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pedagogical Verification */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800 text-lg">
            Verificare Pedagogică: Roluri și Permisiuni (Manual pag. 53–54)
          </h3>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 1: Dacă vrei ca profesorul de informatică să poată corecta și adăuga comentarii pe paginile site-ului tău, ce rol de partajare trebuie să îi acorzi conform manualului?
            </span>
            <QuestionHint
              hint="Manual pag. 53: Rolul de Cititor permite doar vizualizarea. Pentru a adăuga sau modifica conținut este necesar rolul cu drept de scriere."
              isOpen={showHint['q1'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q1: !prev.q1 }))}
            />
          </div>

          {isLocked('q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q1'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. Rolul de Cititor al site-ului publicat (Published Viewer)' },
              { id: 'opt_b', label: 'B. Rolul de Redactor (Editor)' },
              { id: 'opt_c', label: 'C. Nu este nevoie de niciun rol, oricine poate edita pe internet' },
              { id: 'opt_d', label: 'D. Îi trimiți parola ta personală de e-mail pe un bilet' }
            ].map(opt => (
              <button
                key={opt.id}
                disabled={submitted['q1'] || isLocked('q1')}
                onClick={() => handleSelectAnswer('q1', opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  answers['q1'] === opt.id
                    ? 'border-indigo-600 bg-indigo-50 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {!submitted['q1'] ? (
            <button
              onClick={() => handleVerify('q1', 'opt_b')}
              disabled={!answers['q1'] || isLocked('q1')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Verifică Răspunsul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation="Corect! Rolul de Redactor (Editor) oferă acces complet la mediul de editare al pânzei, permițând profesorului să adauge secțiuni, să ajusteze textele și să verifice compoziția paginilor."
              isCorrect={true}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 2: De ce este periculos să configurezi accesul general de editare pe „Oricine are linkul poate fi Redactor”?
            </span>
            <QuestionHint
              hint="Manual pag. 54: Oricine găsește linkul pe internet ar avea putere deplină asupra fișierului tău."
              isOpen={showHint['q2'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q2: !prev.q2 }))}
            />
          </div>

          {isLocked('q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q2'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. Deoarece Google va percepe o taxă suplimentară de 100 de euro pe oră' },
              { id: 'opt_b', label: 'B. Deoarece persoane necunoscute sau rău intenționate pot vandaliza, înlocui sau șterge ireversibil paginile și proiectele întregii echipe' },
              { id: 'opt_c', label: 'C. Deoarece ecranul calculatorului se va întoarce automat cu susul în jos' },
              { id: 'opt_d', label: 'D. Nu există niciun pericol, aceasta este setarea recomandată pentru toate proiectele' }
            ].map(opt => (
              <button
                key={opt.id}
                disabled={submitted['q2'] || isLocked('q2')}
                onClick={() => handleSelectAnswer('q2', opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  answers['q2'] === opt.id
                    ? 'border-indigo-600 bg-indigo-50 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {!submitted['q2'] ? (
            <button
              onClick={() => handleVerify('q2', 'opt_b')}
              disabled={!answers['q2'] || isLocked('q2')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Verifică Răspunsul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation="Excelent! Principiul securității cibernetice impune ca drepturile de Redactor să fie acordate nominal exclusiv persoanelor de încredere, protejând munca echipei împotriva ștergerilor sau modificărilor neautorizate."
              isCorrect={true}
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentLevel={2}
        totalLevels={7}
        isCompleted={allQuizzesPassed}
        onPrev={onPrev}
        onNext={handleFinish}
        nextLabel="Continuă cu Lecția 3: Drepturi de Autor & Licențe Creative Commons"
      />
    </div>
  );
};
