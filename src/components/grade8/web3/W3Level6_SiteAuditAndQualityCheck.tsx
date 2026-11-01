import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Wrench,
  Link2Off,
  Eye,
  FileImage,
  Smartphone,
  Gauge
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';

interface W3Level6Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface AuditIssue {
  id: string;
  category: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  fixed: boolean;
  fixActionLabel: string;
}

const INITIAL_ISSUES: AuditIssue[] = [
  {
    id: 'broken_link',
    category: 'Navigare & Linkuri',
    severity: 'high',
    title: 'Hiperlegătură ruptă (Eroare 404)',
    description: 'Butonul „Descarcă Regulamentul” indică o adresă inexistentă: /docs/regulament-vechi.pdf',
    fixed: false,
    fixActionLabel: 'Corectează URL-ul la fișierul valid pe Google Drive'
  },
  {
    id: 'missing_alt',
    category: 'Accesibilitate & SEO',
    severity: 'medium',
    title: 'Imagine fără etichetă descriptivă alt',
    description: 'Fotografia principală a laboratorului STEAM nu are text alternativ pentru cititoarele de ecran.',
    fixed: false,
    fixActionLabel: 'Adaugă: alt="Elevi la atelierul de robotică"'
  },
  {
    id: 'low_contrast',
    category: 'Design & Lizibilitate',
    severity: 'high',
    title: 'Contrast cromatic scăzut (WCAG 2.1)',
    description: 'Text galben deschis pe fundal alb în secțiunea de anunțuri, fiind aproape ilizibil.',
    fixed: false,
    fixActionLabel: 'Comută fundalul la indigo închis pentru contrast optim'
  },
  {
    id: 'huge_image',
    category: 'Viteză & Performanță',
    severity: 'medium',
    title: 'Fișier imagine gigant (18.4 MB)',
    description: 'O fotografie din banner nu a fost comprimată, îngreunând încărcarea pe conexiuni mobile.',
    fixed: false,
    fixActionLabel: 'Comprimă imaginea în format WebP (sub 250 KB)'
  }
];

export const W3Level6_SiteAuditAndQualityCheck: React.FC<W3Level6Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  const [issues, setIssues] = useState<AuditIssue[]>(INITIAL_ISSUES);

  // Quiz state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});

  const handleFixIssue = (id: string) => {
    setIssues(prev => prev.map(issue => issue.id === id ? { ...issue, fixed: true } : issue));
    sounds.playCorrect();
  };

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

  const allIssuesFixed = issues.every(i => i.fixed);
  const allQuizzesPassed = submitted['q1'] && submitted['q2'];
  const canProceed = allIssuesFixed && allQuizzesPassed;

  const handleFinish = () => {
    sounds.playLevelUp();
    if (onCompletePage) onCompletePage(100);
    if (onComplete) onComplete();
  };

  const fixedCount = issues.filter(i => i.fixed).length;
  const auditScore = Math.round((fixedCount / issues.length) * 100);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-200 text-sm font-semibold tracking-wide uppercase mb-1">
              <ShieldCheck className="w-5 h-5 text-teal-300" />
              <span>Unitatea 2: Pagini Web & Proiecte Online • Modulul 2C</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Lecția 6: Audit Calitativ al Sitului Web & Testare Finală
            </h1>
            <p className="text-teal-100 text-sm md:text-base mt-1 max-w-3xl">
              Manual Art Klett pag. 56–57: Înainte de lansarea oficială sau evaluarea de la clasă, un dezvoltator web
              efectuează un audit riguros: detectarea legăturilor rupte (404), optimizarea vitezei și verificarea contrastului.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-teal-200 font-bold block">Nivel</span>
            <span className="text-2xl font-black text-white">6 / 7</span>
          </div>
        </div>
      </div>

      {/* Manual Theory Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <BookOpen className="w-6 h-6 text-indigo-600 flex-shrink-0" />
          <h2 className="text-lg font-bold text-slate-800">
            Repere Teoretice: Lista de Verificare (Checklist) Pre-Lansare (Manual pag. 56–57)
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-100 space-y-2">
            <div className="font-bold text-rose-900 flex items-center gap-2">
              <Link2Off className="w-4 h-4 text-rose-600" />
              Verificarea Hiperlegăturilor
            </div>
            <p className="text-slate-600 text-xs">
              Un vizitator frustrat părăsește rapid site-ul dacă butoanele returnează eroarea <strong>404 - Pagină Negăsită</strong>.
              Fiecare buton, meniu și link extern trebuie testat prin clic înainte de publicare.
            </p>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-100 space-y-2">
            <div className="font-bold text-amber-900 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-amber-600" />
              Viteza de Încărcare & Imagini
            </div>
            <p className="text-slate-600 text-xs">
              Fotografiile de înaltă rezoluție descărcate direct de pe telefon (15-20 MB) încetinesc dramatic site-ul.
              Ele trebuie comprimate înainte de încărcare în formate moderne precum WebP sau JPEG optimizat.
            </p>
          </div>

          <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 space-y-2">
            <div className="font-bold text-indigo-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-600" />
              Contrast Cromatic & Accesibilitate
            </div>
            <p className="text-slate-600 text-xs">
              Conform standardelor internaționale WCAG 2.1, textul trebuie să aibă un raport minim de contrast de 4.5:1
              față de culoarea fundalului pentru a asigura o lectură confortabilă tuturor utilizatorilor.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Site Health Inspector */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-800 text-lg">
              Simulator Interactiv: Clinica de Audit Calitativ al Sitului (Site Health Inspector)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold">Scor Calitate:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-black ${
              auditScore === 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {auditScore}% {auditScore === 100 ? '100% Gata de Lansare 🚀' : `${fixedCount}/${issues.length} Rezolvate`}
            </span>
          </div>
        </div>

        {/* Issues List with Fix Actions */}
        <div className="space-y-3">
          {issues.map(issue => (
            <div
              key={issue.id}
              className={`p-4 rounded-xl border transition-all ${
                issue.fixed
                  ? 'bg-emerald-50/60 border-emerald-300 text-slate-700'
                  : 'bg-white border-slate-300 shadow-sm'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      issue.fixed
                        ? 'bg-emerald-200 text-emerald-900'
                        : issue.severity === 'high'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {issue.fixed ? 'Rezolvat ✅' : issue.category}
                    </span>
                    <h4 className={`text-sm font-bold ${issue.fixed ? 'text-emerald-900 line-through opacity-80' : 'text-slate-900'}`}>
                      {issue.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600">{issue.description}</p>
                </div>

                {!issue.fixed ? (
                  <button
                    onClick={() => handleFixIssue(issue.id)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>{issue.fixActionLabel}</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Optimizat cu Succes
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pedagogical Verification */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="w-5 h-5 text-teal-600" />
          <h3 className="font-bold text-slate-800 text-lg">
            Verificare Pedagogică: Auditul Calității (Manual pag. 56–57)
          </h3>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 1: Ce înseamnă eroarea „HTTP 404 - Not Found” atunci când un vizitator dă clic pe un buton din meniul site-ului tău?
            </span>
            <QuestionHint
              hint="Manual pag. 57: Codul 404 este codul de stare standard pe internet care semnalează că serverul nu a putut găsi pagina solicitată la adresa URL indicată."
              isOpen={showHint['q1'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q1: !prev.q1 }))}
            />
          </div>

          {isLocked('q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q1'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. Că site-ul a fost vizitat de 404 persoane în acea zi' },
              { id: 'opt_b', label: 'B. Că pagina sau resursa căutată nu mai există la acea adresă URL (legătură ruptă)' },
              { id: 'opt_c', label: 'C. Că este necesar să cumperi o licență de 404 dolari' },
              { id: 'opt_d', label: 'D. Că bateria calculatorului a ajuns la 4%' }
            ].map(opt => (
              <button
                key={opt.id}
                disabled={submitted['q1'] || isLocked('q1')}
                onClick={() => handleSelectAnswer('q1', opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  answers['q1'] === opt.id
                    ? 'border-teal-600 bg-teal-50 font-semibold'
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
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Verifică Răspunsul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation="Corect! Eroarea 404 indică o legătură ruptă: pagina a fost mutată, ștearsă sau adresa a fost scrisă greșit în atributul href al butonului."
              isCorrect={true}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 2: De ce este contraindicat să folosești o combinație de culori precum text gri-deschis pe un fundal gri-albicios?
            </span>
            <QuestionHint
              hint="Manual pag. 57: Accesibilitatea și ergonomia vizuală impun un contrast suficient pentru a nu obosi ochii vizitatorilor."
              isOpen={showHint['q2'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q2: !prev.q2 }))}
            />
          </div>

          {isLocked('q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q2'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. Deoarece monitorul se va arde din cauza culorii gri' },
              { id: 'opt_b', label: 'B. Deoarece contrastul cromatic slab face textul greu sau imposibil de citit pentru utilizatori și încalcă standardele de accesibilitate' },
              { id: 'opt_c', label: 'C. Deoarece Google refuză să salveze fișierele gri pe Google Drive' },
              { id: 'opt_d', label: 'D. Nu este contraindicat, este cel mai lizibil stil de text' }
            ].map(opt => (
              <button
                key={opt.id}
                disabled={submitted['q2'] || isLocked('q2')}
                onClick={() => handleSelectAnswer('q2', opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  answers['q2'] === opt.id
                    ? 'border-teal-600 bg-teal-50 font-semibold'
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
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Verifică Răspunsul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation="Excelent! Contrastul optim între text și fundal garantează lizibilitatea conținutului pentru toți cititorii, indiferent de luminozitatea ecranului sau de eventuale probleme de vedere."
              isCorrect={true}
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentLevel={6}
        totalLevels={7}
        isCompleted={canProceed}
        onPrev={onPrev}
        onNext={handleFinish}
        nextLabel="Continuă cu Lecția 7: Marea Evaluare Sumativă a Unității 2 (Web & Google Sites)"
      />
    </div>
  );
};
