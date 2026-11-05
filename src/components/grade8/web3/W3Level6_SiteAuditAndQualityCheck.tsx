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
import { useLanguage } from '../../../context/LanguageContext';

interface W3Level6Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

interface AuditIssue {
  id: string;
  categoryRo: string;
  categoryEn: string;
  severity: 'high' | 'medium' | 'low';
  titleRo: string;
  titleEn: string;
  descriptionRo: string;
  descriptionEn: string;
  fixed: boolean;
  fixActionLabelRo: string;
  fixActionLabelEn: string;
}

const INITIAL_ISSUES: AuditIssue[] = [
  {
    id: 'broken_link',
    categoryRo: 'Navigare & Linkuri',
    categoryEn: 'Navigation & Links',
    severity: 'high',
    titleRo: 'Hiperlegătură ruptă (Eroare 404)',
    titleEn: 'Broken Hyperlink (404 Not Found)',
    descriptionRo: 'Butonul „Descarcă Regulamentul” indică o adresă inexistentă: /docs/regulament-vechi.pdf',
    descriptionEn: 'The "Download Regulations" button points to an obsolete file: /docs/old-regulations.pdf',
    fixed: false,
    fixActionLabelRo: 'Corectează URL-ul la fișierul valid pe Google Drive',
    fixActionLabelEn: 'Fix URL to point to active Google Drive doc'
  },
  {
    id: 'missing_alt',
    categoryRo: 'Accesibilitate & SEO',
    categoryEn: 'Accessibility & SEO',
    severity: 'medium',
    titleRo: 'Imagine fără etichetă descriptivă alt',
    titleEn: 'Image missing descriptive alt attribute',
    descriptionRo: 'Fotografia principală a laboratorului STEAM nu are text alternativ pentru cititoarele de ecran.',
    descriptionEn: 'The hero photo of the STEAM robotics lab lacks alt text for screen readers.',
    fixed: false,
    fixActionLabelRo: 'Adaugă: alt="Elevi la atelierul de robotică"',
    fixActionLabelEn: 'Add: alt="Students in robotics workshop"'
  },
  {
    id: 'low_contrast',
    categoryRo: 'Design & Lizibilitate',
    categoryEn: 'Design & Readability',
    severity: 'high',
    titleRo: 'Contrast cromatic scăzut (WCAG 2.1)',
    titleEn: 'Low color contrast ratio (WCAG 2.1)',
    descriptionRo: 'Text galben deschis pe fundal alb în secțiunea de anunțuri, fiind aproape ilizibil.',
    descriptionEn: 'Light yellow text on a white card background, rendering text nearly illegible.',
    fixed: false,
    fixActionLabelRo: 'Comută fundalul la indigo închis pentru contrast optim',
    fixActionLabelEn: 'Switch card background to deep indigo'
  },
  {
    id: 'huge_image',
    categoryRo: 'Viteză & Performanță',
    categoryEn: 'Speed & Performance',
    severity: 'medium',
    titleRo: 'Fișier imagine gigant (18.4 MB)',
    titleEn: 'Bloated hero image file (18.4 MB)',
    descriptionRo: 'O fotografie din banner nu a fost comprimată, îngreunând încărcarea pe conexiuni mobile.',
    descriptionEn: 'An uncompressed raw camera photo is slowing page load drastically on mobile devices.',
    fixed: false,
    fixActionLabelRo: 'Comprimă imaginea în format WebP (sub 250 KB)',
    fixActionLabelEn: 'Compress image into WebP format (<250 KB)'
  }
];

export const W3Level6_SiteAuditAndQualityCheck: React.FC<W3Level6Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();
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
              <span>
                {lang === 'ro'
                  ? 'Unitatea 2: Pagini Web & Proiecte Online • Modulul 2C'
                  : 'Unit 2: Web Pages & Online Projects • Module 2C'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {lang === 'ro'
                ? 'Lecția 6: Audit Calitativ al Sitului Web & Testare Finală'
                : 'Lesson 6: Site Quality Audit & Final Pre-Launch Testing'}
            </h1>
            <p className="text-teal-100 text-sm md:text-base mt-1 max-w-3xl">
              {lang === 'ro'
                ? 'Manual Art Klett pag. 56–57: Înainte de lansarea oficială sau evaluarea de la clasă, un dezvoltator web efectuează un audit riguros: detectarea legăturilor rupte (404), optimizarea vitezei și verificarea contrastului.'
                : 'Curriculum p. 56–57: Prior to official launch or classroom evaluation, run a rigorous pre-flight audit: detecting broken links (404), compressing images for mobile speed, and verifying color contrast.'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-teal-200 font-bold block">
              {lang === 'ro' ? 'Nivel' : 'Level'}
            </span>
            <span className="text-2xl font-black text-white">6 / 7</span>
          </div>
        </div>
      </div>

      {/* Manual Theory Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <BookOpen className="w-6 h-6 text-indigo-600 flex-shrink-0" />
          <h2 className="text-lg font-bold text-slate-800">
            {lang === 'ro'
              ? 'Repere Teoretice: Lista de Verificare (Checklist) Pre-Lansare (Manual pag. 56–57)'
              : 'Theoretical Reference: Pre-Launch Site Audit Checklist (Curriculum p. 56–57)'}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-100 space-y-2">
            <div className="font-bold text-rose-900 flex items-center gap-2">
              <Link2Off className="w-4 h-4 text-rose-600" />
              {lang === 'ro' ? 'Verificarea Hiperlegăturilor' : 'Hyperlink Validation'}
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'ro'
                ? 'Un vizitator frustrat părăsește rapid site-ul dacă butoanele returnează eroarea 404 - Pagină Negăsită. Fiecare buton, meniu și link extern trebuie testat prin clic înainte de publicare.'
                : 'Visitors bounce immediately when buttons yield 404 Not Found errors. Every button, menu item, and external link must be verified before declaring the site production-ready.'}
            </p>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-100 space-y-2">
            <div className="font-bold text-amber-900 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-amber-600" />
              {lang === 'ro' ? 'Viteza de Încărcare & Imagini' : 'Page Speed & Image Compression'}
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'ro'
                ? 'Fotografiile de înaltă rezoluție descărcate direct de pe telefon (15-20 MB) încetinesc dramatic site-ul. Ele trebuie comprimate înainte de încărcare în formate moderne precum WebP sau JPEG optimizat.'
                : 'Raw 15–20 MB mobile camera uploads dramatically bottleneck bandwidth. Images must be compressed into lightweight formats like WebP or modern JPEG (<250 KB).'}
            </p>
          </div>

          <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 space-y-2">
            <div className="font-bold text-indigo-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-600" />
              {lang === 'ro' ? 'Contrast Cromatic & Accesibilitate' : 'Color Contrast & WCAG'}
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'ro'
                ? 'Conform standardelor internaționale WCAG 2.1, textul trebuie să aibă un raport minim de contrast de 4.5:1 față de culoarea fundalului pentru a asigura o lectură confortabilă tuturor utilizatorilor.'
                : 'Under international WCAG 2.1 standards, body text requires a minimum 4.5:1 contrast ratio against backgrounds to ensure comfortable reading across diverse vision needs.'}
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
              {lang === 'ro'
                ? 'Simulator Interactiv: Clinica de Audit Calitativ al Sitului (Site Health Inspector)'
                : 'Interactive Simulator: Site Health & Pre-Flight Audit Clinic'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold">
              {lang === 'ro' ? 'Scor Calitate:' : 'Quality Score:'}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-black ${
              auditScore === 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {auditScore}% {auditScore === 100
                ? (lang === 'ro' ? '100% Gata de Lansare 🚀' : '100% Launch Ready 🚀')
                : (lang === 'ro' ? `${fixedCount}/${issues.length} Rezolvate` : `${fixedCount}/${issues.length} Resolved`)}
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
                      {issue.fixed
                        ? (lang === 'ro' ? 'Rezolvat ✅' : 'Fixed ✅')
                        : (lang === 'ro' ? issue.categoryRo : issue.categoryEn)}
                    </span>
                    <h4 className={`text-sm font-bold ${issue.fixed ? 'text-emerald-900 line-through opacity-80' : 'text-slate-900'}`}>
                      {lang === 'ro' ? issue.titleRo : issue.titleEn}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    {lang === 'ro' ? issue.descriptionRo : issue.descriptionEn}
                  </p>
                </div>

                {!issue.fixed ? (
                  <button
                    onClick={() => handleFixIssue(issue.id)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>{lang === 'ro' ? issue.fixActionLabelRo : issue.fixActionLabelEn}</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {lang === 'ro' ? 'Optimizat cu Succes' : 'Successfully Optimized'}
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
            {lang === 'ro'
              ? 'Verificare Pedagogică: Auditul Calității (Manual pag. 56–57)'
              : 'Pedagogical Check: Site Quality Audit (Curriculum p. 56–57)'}
          </h3>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              {lang === 'ro'
                ? 'Cerința 1: Ce înseamnă eroarea „HTTP 404 - Not Found” atunci când un vizitator dă clic pe un buton din meniul site-ului tău?'
                : 'Requirement 1: What does an "HTTP 404 - Not Found" status code indicate when a visitor clicks a menu link on your site?'}
            </span>
            <QuestionHint
              hintRo="Manual pag. 57: Codul 404 este codul de stare standard pe internet care semnalează că serverul nu a putut găsi pagina solicitată la adresa URL indicată."
              hintEn="Curriculum p. 57: HTTP 404 is the global RFC status code confirming that the web server cannot locate the requested resource at the target URL."
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
                labelRo: 'A. Că site-ul a fost vizitat de 404 persoane în acea zi',
                labelEn: 'A. That exactly 404 visitors loaded the site today'
              },
              {
                id: 'opt_b',
                labelRo: 'B. Că pagina sau resursa căutată nu mai există la acea adresă URL (legătură ruptă)',
                labelEn: 'B. That the requested page or asset does not exist at the target URL (broken link)'
              },
              {
                id: 'opt_c',
                labelRo: 'C. Că este necesar să cumperi o licență de 404 dolari',
                labelEn: 'C. That you must purchase a 404 dollar license'
              },
              {
                id: 'opt_d',
                labelRo: 'D. Că bateria calculatorului a ajuns la 4%',
                labelEn: 'D. That computer battery dropped to 4%'
              }
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
                {lang === 'ro' ? opt.labelRo : opt.labelEn}
              </button>
            ))}
          </div>

          {!submitted['q1'] ? (
            <button
              onClick={() => handleVerify('q1', 'opt_b')}
              disabled={!answers['q1'] || isLocked('q1')}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>{lang === 'ro' ? 'Verifică Răspunsul' : 'Check Answer'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation={
                lang === 'ro'
                  ? 'Corect! Eroarea 404 indică o legătură ruptă: pagina a fost mutată, ștearsă sau adresa a fost scrisă greșit în atributul href al butonului.'
                  : 'Correct! A 404 status indicates a broken link: the destination page was moved, deleted, or mistyped in the button href attribute.'
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
                ? 'Cerința 2: De ce este contraindicat să folosești o combinație de culori precum text gri-deschis pe un fundal gri-albicios?'
                : 'Requirement 2: Why is it bad practice to style light-gray text on a pale-gray background?'}
            </span>
            <QuestionHint
              hintRo="Manual pag. 57: Accesibilitatea și ergonomia vizuală impun un contrast suficient pentru a nu obosi ochii vizitatorilor."
              hintEn="Curriculum p. 57: Accessibility and ergonomic principles require adequate color contrast to prevent eye strain and maintain legibility."
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
                labelRo: 'A. Deoarece monitorul se va arde din cauza culorii gri',
                labelEn: 'A. Because the monitor screen hardware will burn out'
              },
              {
                id: 'opt_b',
                labelRo: 'B. Deoarece contrastul cromatic slab face textul greu sau imposibil de citit pentru utilizatori și încalcă standardele de accesibilitate',
                labelEn: 'B. Because poor color contrast renders text illegible to visitors, violating international accessibility standards'
              },
              {
                id: 'opt_c',
                labelRo: 'C. Deoarece Google refuză să salveze fișierele gri pe Google Drive',
                labelEn: 'C. Because Google rejects saving gray documents to Drive'
              },
              {
                id: 'opt_d',
                labelRo: 'D. Nu este contraindicat, este cel mai lizibil stil de text',
                labelEn: 'D. It is not bad practice; it is the most readable styling'
              }
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
                {lang === 'ro' ? opt.labelRo : opt.labelEn}
              </button>
            ))}
          </div>

          {!submitted['q2'] ? (
            <button
              onClick={() => handleVerify('q2', 'opt_b')}
              disabled={!answers['q2'] || isLocked('q2')}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>{lang === 'ro' ? 'Verifică Răspunsul' : 'Check Answer'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <AnswerExplanation
              explanation={
                lang === 'ro'
                  ? 'Excelent! Contrastul optim între text și fundal garantează lizibilitatea conținutului pentru toți cititorii, indiferent de luminozitatea ecranului sau de eventuale probleme de vedere.'
                  : 'Excellent! Ample contrast between foreground typography and background elements guarantees comfortable readability across all lighting environments and visual abilities.'
              }
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
        nextLabel={
          lang === 'ro'
            ? 'Continuă cu Lecția 7: Marea Evaluare Sumativă a Unității 2 (Web & Google Sites)'
            : 'Continue to Lesson 7: Grand Summative Assessment of Unit 2 (Web & Google Sites)'
        }
      />
    </div>
  );
};
