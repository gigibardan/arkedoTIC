import React, { useState } from 'react';
import {
  UploadCloud,
  Globe,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink,
  Lock,
  Server
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { useLanguage } from '../../../context/LanguageContext';

interface W3Level1Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const W3Level1_PublishingAndDomains: React.FC<W3Level1Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  // Publishing simulator state
  const [siteSlug, setSiteSlug] = useState<string>('revista-infoteen-8');
  const [requestNoIndex, setRequestNoIndex] = useState<boolean>(false);
  const [customDomainActive, setCustomDomainActive] = useState<boolean>(false);
  const [published, setPublished] = useState<boolean>(false);

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

  // Slug cleaner
  const cleanSlug = siteSlug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-');

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-200 text-sm font-semibold tracking-wide uppercase mb-1">
              <UploadCloud className="w-5 h-5 text-sky-300" />
              <span>
                {lang === 'ro'
                  ? 'Unitatea 2: Pagini Web & Proiecte Online • Modulul 2C'
                  : 'Unit 2: Web Pages & Online Projects • Module 2C'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {lang === 'ro'
                ? 'Lecția 1: Procedura de Publicare & Gestionarea Domeniilor Web'
                : 'Lesson 1: Publishing Procedure & Web Domain Management'}
            </h1>
            <p className="text-blue-100 text-sm md:text-base mt-1 max-w-3xl">
              {lang === 'ro'
                ? 'Manual Art Klett pag. 52–53: Învață cum se transformă un proiect privat din spațiul de editare Google Sites într-un site public accesibil pe întreg globul, cum se alege adresa URL și rolul domeniilor personalizate.'
                : 'Curriculum p. 52–53: Learn how a private draft in Google Sites turns into a live website accessible across the world, how canonical URLs are formatted, and the role of custom domains.'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-sky-200 font-bold block">
              {lang === 'ro' ? 'Nivel' : 'Level'}
            </span>
            <span className="text-2xl font-black text-white">1 / 7</span>
          </div>
        </div>
      </div>

      {/* Manual Theory Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <BookOpen className="w-6 h-6 text-indigo-600 flex-shrink-0" />
          <h2 className="text-lg font-bold text-slate-800">
            {lang === 'ro'
              ? 'Repere Teoretice: Dialogul de Publicare Google Sites (Manual pag. 52)'
              : 'Theoretical Reference: Google Sites Publishing Dialog (Curriculum p. 52)'}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100 space-y-2">
            <div className="font-bold text-blue-900 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-blue-600" />
              {lang === 'ro' ? 'Butonul „Publicați” (Publish)' : 'The "Publish" Button'}
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'ro'
                ? 'Situat în colțul din dreapta-sus al editorului. Până la acționarea acestui buton, site-ul tău există doar ca ciornă de lucru privată (Draft) în Google Drive, inaccesibilă altor utilizatori pe internet.'
                : 'Located in the top right corner of the editor. Until you click this button, your site exists solely as a private draft in Google Drive, inaccessible to public internet visitors.'}
            </p>
          </div>

          <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 space-y-2">
            <div className="font-bold text-indigo-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600" />
              {lang === 'ro' ? 'Adresa Web Canonică' : 'Canonical Web URL'}
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'ro'
                ? 'Structura URL standard este: https://sites.google.com/view/[nume-site]. Numele trebuie să conțină doar litere mici, cifre și cratime (-), fără spații sau diacritice românești (ă, î, ș, ț, â).'
                : 'Standard URL structure is: https://sites.google.com/view/[site-name]. The name must contain only lowercase letters, numbers, and hyphens (-), without spaces or special characters.'}
            </p>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 space-y-2">
            <div className="font-bold text-emerald-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-600" />
              {lang === 'ro' ? 'Domenii Personalizate' : 'Custom Domains'}
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'ro'
                ? 'Pentru proiecte oficiale ale școlii, se poate atașa un domeniu propriu (ex: www.cn-vladimirescu.ro) prin configurarea înregistrărilor CNAME în serverele de nume de domeniu (DNS).'
                : 'For official school websites, custom domain routing (e.g., www.school8.edu) can be assigned by configuring CNAME records on DNS servers.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Publishing Dialog Simulator */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-lg">
              {lang === 'ro'
                ? 'Simulator Interactiv: Fereastra „Publicare pe web” (Google Sites Publish Modal)'
                : 'Interactive Simulator: "Publish to the Web" Dialog (Google Sites Publish Modal)'}
            </h3>
          </div>
          <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
            {lang === 'ro' ? 'Laborator Practic' : 'Practical Lab'}
          </span>
        </div>

        {/* Modal Window Simulator */}
        <div className="max-w-2xl mx-auto border-2 border-slate-300 rounded-2xl shadow-xl overflow-hidden bg-white">
          <div className="bg-slate-800 text-white px-5 py-3 flex items-center justify-between text-sm font-bold">
            <span className="flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-sky-400" />
              {lang === 'ro' ? 'Publicare pe web' : 'Publish to the web'}
            </span>
            <span className="text-xs text-slate-400 font-mono">Google Sites Engine</span>
          </div>

          <div className="p-6 space-y-5">
            {/* Slug Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                {lang === 'ro'
                  ? 'Adresă Web (Numele proiectului tău):'
                  : 'Web Address (Your project site name):'}
              </label>
              <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs">
                <span className="text-slate-500 font-mono whitespace-nowrap">
                  https://sites.google.com/view/
                </span>
                <input
                  type="text"
                  value={siteSlug}
                  onChange={(e) => {
                    setSiteSlug(e.target.value);
                    setPublished(false);
                  }}
                  className="w-full bg-transparent font-bold text-indigo-700 outline-none ml-1 font-mono"
                  placeholder="nume-site-clasa"
                />
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>
                  {lang === 'ro' ? 'Adresă validată: ' : 'Validated URL: '}
                  <code>https://sites.google.com/view/{cleanSlug || 'nume'}</code>
                </span>
              </div>
            </div>

            {/* Custom Domain Option */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  {lang === 'ro' ? 'Domeniu Personalizat (Custom Domain)' : 'Custom Domain (Domain Mapping)'}
                </div>
                <button
                  onClick={() => {
                    setCustomDomainActive(!customDomainActive);
                    sounds.playClick();
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    customDomainActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {customDomainActive
                    ? lang === 'ro' ? 'Activat' : 'Active'
                    : lang === 'ro' ? 'Activează' : 'Enable'}
                </button>
              </div>
              {customDomainActive && (
                <div className="text-xs text-indigo-900 bg-indigo-50 p-2.5 rounded-lg border border-indigo-200 animate-fadeIn">
                  {lang === 'ro'
                    ? 'Site-ul va răspunde și la: www.infoteen-colegiu.edu.ro (certificat SSL securizat activat).'
                    : 'The site will also resolve to: www.infoteen-college.edu (SSL security certificate active).'}
                </div>
              )}
            </div>

            {/* Search Engine Visibility Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={requestNoIndex}
                  onChange={(e) => {
                    setRequestNoIndex(e.target.checked);
                    sounds.playClick();
                  }}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <div>
                  <strong className="text-slate-900 block">
                    {lang === 'ro' ? 'Setări de căutare:' : 'Search settings:'}
                  </strong>
                  {lang === 'ro'
                    ? 'Solicitați motoarelor de căutare publice să nu afișeze site-ul meu (noindex).'
                    : 'Request public search engines not to display my site (noindex).'}
                  <span className="text-slate-500 block text-[11px] mt-0.5">
                    {lang === 'ro'
                      ? 'Util atunci când site-ul este încă în construcție sau este destinat exclusiv colegilor din clasă.'
                      : 'Useful when the site is still under construction or meant exclusively for class peers.'}
                  </span>
                </div>
              </label>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => {
                  setSiteSlug('revista-infoteen-8');
                  setRequestNoIndex(false);
                  setPublished(false);
                  sounds.playClick();
                }}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                {lang === 'ro' ? 'Anulează' : 'Cancel'}
              </button>

              <button
                onClick={() => {
                  setPublished(true);
                  sounds.playCorrect();
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transition transform active:scale-95"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{lang === 'ro' ? 'Publicați Site-ul Acum' : 'Publish Website Now'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Published Feedback */}
        {published && (
          <div className="bg-emerald-50 border-2 border-emerald-400 p-4 rounded-xl text-xs space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              {lang === 'ro'
                ? 'Site-ul a fost publicat cu succes pe internet!'
                : 'The website was successfully published to the live web!'}
            </div>
            <p className="text-emerald-800">
              {lang === 'ro'
                ? 'Oricine poate accesa pagina ta folosind adresa securizată: '
                : 'Anyone can now access your page via the secure URL: '}
              <a
                href="#simulator"
                onClick={(e) => e.preventDefault()}
                className="font-mono font-bold underline text-blue-700"
              >
                https://sites.google.com/view/{cleanSlug}
              </a>
            </p>
            <div className="text-[11px] text-slate-600">
              {lang === 'ro' ? 'Stare indexare Google: ' : 'Google index status: '}
              {requestNoIndex
                ? lang === 'ro' ? '❌ Ascuns de motoarele de căutare publice' : '❌ Hidden from public search engines'
                : lang === 'ro' ? '✅ Indexabil de Googlebot & Bing' : '✅ Indexable by Googlebot & Bing'}
            </div>
          </div>
        )}
      </div>

      {/* Pedagogical Verification */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800 text-lg">
            {lang === 'ro'
              ? 'Verificare Pedagogică: Regulile de Publicare (Manual pag. 52–53)'
              : 'Pedagogical Check: Publishing Rules (Curriculum p. 52–53)'}
          </h3>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              {lang === 'ro'
                ? 'Cerința 1: Dacă ai terminat de aranjat textele și imaginile pe pânza Google Sites, dar nu ai apăsat butonul albastru „Publicați” (Publish), ce vor vedea vizitatorii care încearcă să acceseze adresa site-ului?'
                : 'Requirement 1: If you arranged texts and graphics on the Google Sites canvas, but have NOT clicked the blue "Publish" button, what will visitors see when accessing the site URL?'}
            </span>
            <QuestionHint
              hintRo="Manual pag. 52: Până la publicare, modificările există doar în spațiul privat de editare din Google Drive al autorului."
              hintEn="Curriculum p. 52: Prior to publishing, edits exist solely in the author's private Google Drive editing draft."
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
                labelRo: 'A. Vor vedea automat ultima variantă editată, deoarece Google salvează totul în cloud',
                labelEn: 'A. They automatically see the latest live edit, because Google continuously auto-saves'
              },
              {
                id: 'opt_b',
                labelRo: 'B. Vor primi o eroare (404 - Sit negăsit) sau vor vedea doar varianta publicată anterior, deoarece noile modificări sunt doar ciorne private',
                labelEn: 'B. They get an error (404 Not Found) or only see the previously published version, because new edits are private drafts'
              },
              {
                id: 'opt_c',
                labelRo: 'C. Calculatorul vizitatorilor va descărca automat fișierul pe desktop',
                labelEn: 'C. Visitor computers automatically download a local backup file'
              },
              {
                id: 'opt_d',
                labelRo: 'D. Vor primi un apel telefonic de la Google',
                labelEn: 'D. They receive an automated phone call from Google'
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
                  ? 'Corect! Butonul „Publicați” este comutatorul esențial care propagă ciorna (Draft) din modul de editare în versiunea publică online accesibilă vizitatorilor.'
                  : 'Correct! The "Publish" button is the essential switch that promotes the private draft from editing mode into the public version reachable by worldwide visitors.'
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
                ? 'Cerința 2: Care dintre următoarele adrese URL respectă regulile stricte de denumire a unui site Google Sites conform manualului (pag. 52)?'
                : 'Requirement 2: Which of the following URLs complies strictly with Google Sites naming syntax according to curriculum standards (p. 52)?'}
            </span>
            <QuestionHint
              hintRo="Manual pag. 52: Adresele URL nu permit spații libere, majuscule sau diacritice românești (ă, î, ș, ț, â), utilizându-se cratima (-) ca separator."
              hintEn="Curriculum p. 52: URLs disallow blank spaces, uppercase letters, or special diacritics, requiring hyphens (-) as word separators."
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
                labelRo: 'A. sites.google.com/view/Revista Școlară Clasa a 8-a!',
                labelEn: 'A. sites.google.com/view/School Magazine Class 8!'
              },
              {
                id: 'opt_b',
                labelRo: 'B. sites.google.com/view/revista-scolara-clasa8',
                labelEn: 'B. sites.google.com/view/school-magazine-class8'
              },
              {
                id: 'opt_c',
                labelRo: 'C. sites.google.com/view/proiect învățământ 2025',
                labelEn: 'C. sites.google.com/view/project education 2025'
              },
              {
                id: 'opt_d',
                labelRo: 'D. sites.google.com/view/școala_noastră#1',
                labelEn: 'D. sites.google.com/view/our_school#1'
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
                  ? 'Excelent! Numai varianta B folosește exclusiv litere mici fără diacritice, cifre și cratime (-) ca separatori, fiind compatibilă 100% cu standardele de adresare URL la nivel mondial.'
                  : 'Excellent! Only option B strictly uses lowercase alphanumeric characters and hyphens (-) without spaces or special diacritics, fully compliant with global RFC web URL standards.'
              }
              isCorrect={true}
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentLevel={1}
        totalLevels={7}
        isCompleted={allQuizzesPassed}
        onPrev={onPrev}
        onNext={handleFinish}
        nextLabel={
          lang === 'ro'
            ? 'Continuă cu Lecția 2: Partajare & Colaborare Multi-Utilizator'
            : 'Continue to Lesson 2: Multi-User Sharing & Access Permissions'
        }
      />
    </div>
  );
};
