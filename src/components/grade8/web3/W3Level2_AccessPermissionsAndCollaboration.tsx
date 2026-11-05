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
import { useLanguage } from '../../../context/LanguageContext';

interface W3Level2Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface Collaborator {
  id: string;
  nameRo: string;
  nameEn: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
}

export const W3Level2_AccessPermissionsAndCollaboration: React.FC<W3Level2Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  // Simulator state
  const [publishedAccess, setPublishedAccess] = useState<'public' | 'domain' | 'restricted'>('domain');
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { id: '1', nameRo: 'Popescu Andrei (Tu)', nameEn: 'Andrei Popescu (You)', email: 'andrei.p@scoala8.ro', role: 'owner' },
    { id: '2', nameRo: 'Prof. Radu Ionescu', nameEn: 'Prof. Radu Ionescu', email: 'radu.ionescu@scoala8.ro', role: 'editor' },
    { id: '3', nameRo: 'Elena Moraru (Coleg)', nameEn: 'Elena Moraru (Peer)', email: 'elena.m@scoala8.ro', role: 'editor' }
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
    const username = newEmail.split('@')[0];
    const newCollab: Collaborator = {
      id: Date.now().toString(),
      nameRo: username,
      nameEn: username,
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
              <span>
                {lang === 'ro'
                  ? 'Unitatea 2: Pagini Web & Proiecte Online • Modulul 2C'
                  : 'Unit 2: Web Pages & Online Projects • Module 2C'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {lang === 'ro'
                ? 'Lecția 2: Partajarea & Gestionarea Permisiunilor de Acces'
                : 'Lesson 2: Sharing & Collaborative Access Permissions'}
            </h1>
            <p className="text-teal-100 text-sm md:text-base mt-1 max-w-3xl">
              {lang === 'ro'
                ? 'Manual Art Klett pag. 53–54: Descoperă cum se lucrează în echipă la un site web, diferența dintre rolul de Redactor (Editor) și Cititor (Viewer), și cum se securizează accesul la ciornă.'
                : 'Curriculum p. 53–54: Discover team collaboration workflows in Google Sites, distinguish between Editor and Viewer privileges, and secure draft files against unauthorized modifications.'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-teal-200 font-bold block">
              {lang === 'ro' ? 'Nivel' : 'Level'}
            </span>
            <span className="text-2xl font-black text-white">2 / 7</span>
          </div>
        </div>
      </div>

      {/* Manual Theory Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <BookOpen className="w-6 h-6 text-indigo-600 flex-shrink-0" />
          <h2 className="text-lg font-bold text-slate-800">
            {lang === 'ro'
              ? 'Repere Teoretice: Roluri & Niveluri de Securitate la Partajare (Manual pag. 53–54)'
              : 'Theoretical Reference: Roles & Security Levels in Sharing (Curriculum p. 53–54)'}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 space-y-2">
            <div className="font-bold text-indigo-900 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-indigo-600" />
              {lang === 'ro' ? 'Redactor (Editor) vs Cititor (Viewer)' : 'Editor vs Viewer Privileges'}
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'ro'
                ? 'Redactorul poate modifica paginile, șterge secțiuni sau schimba tema. Cititorul (Vizualizator al site-ului publicat) poate doar naviga pe pagină, fără a avea acces la codul sau uneltele de editare.'
                : 'An Editor can alter pages, delete content blocks, or switch themes. A Viewer (Published Viewer) can only browse pages without accessing editing toolbars or backend files.'}
            </p>
          </div>

          <div className="bg-teal-50/70 p-4 rounded-xl border border-teal-100 space-y-2">
            <div className="font-bold text-teal-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-teal-600" />
              {lang === 'ro' ? 'Domeniu Școlar Protejat' : 'Protected School Domain'}
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'ro'
                ? 'Pentru referate de clasă și proiecte interne, opțiunea „Numai persoanele din organizația mea” (ex: @scoala.edu.ro) garantează că site-ul este vizibil doar pentru colegi și profesori.'
                : 'For classroom assignments and internal projects, the "Organization only" setting (e.g., @school.edu) ensures the site is accessible solely to verified school members.'}
            </p>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-100 space-y-2">
            <div className="font-bold text-amber-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-600" />
              {lang === 'ro' ? 'Principiul Securității Minime' : 'Principle of Least Privilege'}
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'ro'
                ? 'Nu se acordă niciodată rolul de Redactor unor persoane anonime pe internet. Doar membrii desemnați ai echipei de proiect primesc drepturi de scriere, restul publicului primind statut de Cititor.'
                : 'Never grant Editor permissions to anonymous web users. Only designated co-authors receive write privileges, while the public is assigned Viewer status.'}
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
              {lang === 'ro'
                ? 'Simulator Interactiv: Fereastra „Partajați cu alte persoane și grupuri”'
                : 'Interactive Simulator: "Share with People and Groups" Dialog'}
            </h3>
          </div>
          <span className="text-xs bg-teal-100 text-teal-800 px-3 py-1 rounded-full font-semibold">
            {lang === 'ro' ? 'Laborator Securitate' : 'Security Lab'}
          </span>
        </div>

        {/* Modal Simulator */}
        <div className="max-w-2xl mx-auto border-2 border-slate-300 rounded-2xl shadow-xl overflow-hidden bg-white">
          <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between text-sm font-bold">
            <span className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-teal-400" />
              {lang === 'ro' ? 'Partajare: Revista Școlară Clasa a VIII-a' : 'Share: 8th Grade School Magazine'}
            </span>
            <span className="text-xs text-slate-400 font-mono">Google Drive Workspace</span>
          </div>

          <div className="p-6 space-y-5">
            {/* Add user form */}
            <form onSubmit={handleAddCollaborator} className="flex gap-2">
              <input
                type="email"
                placeholder={lang === 'ro' ? 'Introdu adresa de e-mail (ex: coleg@scoala.ro)' : 'Enter email address (e.g., peer@school.edu)'}
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-xs bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
                className="border border-slate-300 rounded-xl px-3 py-2 text-xs bg-slate-50 font-semibold"
              >
                <option value="editor">{lang === 'ro' ? 'Editor (Redactor)' : 'Editor'}</option>
                <option value="viewer">{lang === 'ro' ? 'Cititor (Viewer)' : 'Viewer'}</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition"
              >
                {lang === 'ro' ? 'Adaugă' : 'Add'}
              </button>
            </form>

            {/* Collaborators list */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                {lang === 'ro' ? 'Persoane cu acces direct:' : 'People with direct access:'}
              </label>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                {collaborators.map(c => (
                  <div key={c.id} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                        {(lang === 'ro' ? c.nameRo : c.nameEn)[0]}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          {lang === 'ro' ? c.nameRo : c.nameEn}
                        </div>
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
                        {c.role === 'owner'
                          ? lang === 'ro' ? 'Proprietar' : 'Owner'
                          : c.role === 'editor'
                          ? lang === 'ro' ? 'Redactor' : 'Editor'
                          : lang === 'ro' ? 'Cititor' : 'Viewer'}
                      </span>
                      {c.role !== 'owner' && (
                        <button
                          onClick={() => handleRemoveCollaborator(c.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title={lang === 'ro' ? 'Elimină accesul' : 'Remove access'}
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
                {lang === 'ro' ? 'Acces General la Site-ul Publicat:' : 'General Access for Published Site:'}
              </div>
              <div className="grid sm:grid-cols-3 gap-2">
                {[
                  {
                    id: 'restricted',
                    labelRo: 'Restricționat',
                    labelEn: 'Restricted',
                    descRo: 'Numai persoanele adăugate nominal pot vizualiza',
                    descEn: 'Only explicitly invited people can view',
                    icon: Lock
                  },
                  {
                    id: 'domain',
                    labelRo: 'Domeniu Școlar',
                    labelEn: 'School Domain',
                    descRo: 'Toți elevii din @scoala8.ro pot vizualiza',
                    descEn: 'Anyone in @school8.edu can view',
                    icon: Building
                  },
                  {
                    id: 'public',
                    labelRo: 'Public pe Internet',
                    labelEn: 'Public Web',
                    descRo: 'Oricine de pe glob poate vizualiza site-ul',
                    descEn: 'Anyone on the internet can view',
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
                        {lang === 'ro' ? item.labelRo : item.labelEn}
                      </div>
                      <div className="text-[11px] text-slate-500 leading-tight">
                        {lang === 'ro' ? item.descRo : item.descEn}
                      </div>
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
            {lang === 'ro'
              ? 'Verificare Pedagogică: Roluri și Permisiuni (Manual pag. 53–54)'
              : 'Pedagogical Check: Roles & Permissions (Curriculum p. 53–54)'}
          </h3>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              {lang === 'ro'
                ? 'Cerința 1: Dacă vrei ca profesorul de informatică să poată corecta și adăuga comentarii pe paginile site-ului tău, ce rol de partajare trebuie să îi acorzi conform manualului?'
                : 'Requirement 1: If you want your computer science teacher to review and edit content on your project site, what sharing role must you grant them according to curriculum guidelines?'}
            </span>
            <QuestionHint
              hintRo="Manual pag. 53: Rolul de Cititor permite doar vizualizarea. Pentru a adăuga sau modifica conținut este necesar rolul cu drept de scriere."
              hintEn="Curriculum p. 53: Viewer role only permits reading. Adding or editing content requires write access."
              isOpen={showHint['q1'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q1: !prev.q1 }))}
            />
          </div>

          {isLocked('q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q1'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              {
                id: 'opt_a',
                labelRo: 'A. Rolul de Cititor al site-ului publicat (Published Viewer)',
                labelEn: 'A. Published Viewer role'
              },
              {
                id: 'opt_b',
                labelRo: 'B. Rolul de Redactor (Editor)',
                labelEn: 'B. Editor role'
              },
              {
                id: 'opt_c',
                labelRo: 'C. Nu este nevoie de niciun rol, oricine poate edita pe internet',
                labelEn: 'C. No role needed, anyone on the internet can edit by default'
              },
              {
                id: 'opt_d',
                labelRo: 'D. Îi trimiți parola ta personală de e-mail pe un bilet',
                labelEn: 'D. Sending your personal email password on a paper note'
              }
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
                {lang === 'ro' ? opt.labelRo : opt.labelEn}
              </button>
            ))}
          </div>

          {!submitted['q1'] ? (
            <button
              onClick={() => handleVerify('q1', 'opt_b')}
              disabled={!answers['q1'] || isLocked('q1')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>{lang === 'ro' ? 'Verifică Răspunsul' : 'Check Answer'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation={
                lang === 'ro'
                  ? 'Corect! Rolul de Redactor (Editor) oferă acces complet la mediul de editare al pânzei, permițând profesorului să adauge secțiuni, să ajusteze textele și să verifice compoziția paginilor.'
                  : 'Correct! The Editor role grants full write access to the canvas, allowing teachers to review copy, insert sections, and inspect layout properties.'
              }
              isCorrect={true}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              {lang === 'ro'
                ? 'Cerința 2: De ce este periculos să configurezi accesul general de editare pe „Oricine are linkul poate fi Redactor”?'
                : 'Requirement 2: Why is it dangerous to set general edit access to "Anyone with the link can edit" on a public school project?'}
            </span>
            <QuestionHint
              hintRo="Manual pag. 54: Oricine găsește linkul pe internet ar avea putere deplină asupra fișierului tău."
              hintEn="Curriculum p. 54: Anyone coming across the link on the internet would wield full write power over your files."
              isOpen={showHint['q2'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q2: !prev.q2 }))}
            />
          </div>

          {isLocked('q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q2'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              {
                id: 'opt_a',
                labelRo: 'A. Deoarece Google va percepe o taxă suplimentară de 100 de euro pe oră',
                labelEn: 'A. Because Google will bill a 100 EUR hourly penalty'
              },
              {
                id: 'opt_b',
                labelRo: 'B. Deoarece persoane necunoscute sau rău intenționate pot vandaliza, înlocui sau șterge ireversibil paginile și proiectele întregii echipe',
                labelEn: 'B. Because unknown or malicious actors can vandalize, replace, or irreversibly delete your team\'s work'
              },
              {
                id: 'opt_c',
                labelRo: 'C. Deoarece ecranul calculatorului se va întoarce automat cu susul în jos',
                labelEn: 'C. Because the monitor screen will flip upside down'
              },
              {
                id: 'opt_d',
                labelRo: 'D. Nu există niciun pericol, aceasta este setarea recomandată pentru toate proiectele',
                labelEn: 'D. There is no danger, this is recommended for all projects'
              }
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
                {lang === 'ro' ? opt.labelRo : opt.labelEn}
              </button>
            ))}
          </div>

          {!submitted['q2'] ? (
            <button
              onClick={() => handleVerify('q2', 'opt_b')}
              disabled={!answers['q2'] || isLocked('q2')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>{lang === 'ro' ? 'Verifică Răspunsul' : 'Check Answer'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation={
                lang === 'ro'
                  ? 'Excelent! Principiul securității cibernetice impune ca drepturile de Redactor să fie acordate nominal exclusiv persoanelor de încredere, protejând munca echipei împotriva ștergerilor sau modificărilor neautorizate.'
                  : 'Excellent! Cybersecurity principles dictate that Editor privileges must be given strictly on a named, verified basis to trusted team members, safeguarding project integrity.'
              }
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
        nextLabel={
          lang === 'ro'
            ? 'Continuă cu Lecția 3: Drepturi de Autor & Licențe Creative Commons'
            : 'Continue to Lesson 3: Copyright & Creative Commons Licensing'
        }
      />
    </div>
  );
};
