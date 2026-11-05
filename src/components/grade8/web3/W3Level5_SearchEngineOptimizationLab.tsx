import React, { useState } from 'react';
import {
  Search,
  Globe,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Image as ImageIcon,
  FileText,
  Eye
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { useQuestionCooldowns } from '../../../utils/pedagogicalGrading';
import { PedagogicalReflectionBanner } from '../../common/usePedagogicalCooldown';
import { QuestionHint } from '../../text1/QuestionHint';
import { AnswerExplanation } from '../../text1/AnswerExplanation';
import { PageNavigationFooter } from '../../text1/PageNavigationFooter';
import { useLanguage } from '../../../context/LanguageContext';

interface W3Level5Props {
  onCompletePage?: (earnedScore: number) => void;
  onComplete?: () => void;
  onPrev?: () => void;
}

export const W3Level5_SearchEngineOptimizationLab: React.FC<W3Level5Props> = ({
  onCompletePage,
  onComplete,
  onPrev
}) => {
  const { lang } = useLanguage();
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  // SEO Simulator State
  const [pageTitle, setPageTitle] = useState<string>(
    lang === 'ro'
      ? 'Revista Școlară InfoTeen | Clasa a VIII-a Colegiu'
      : 'InfoTeen School Magazine | 8th Grade STEAM College'
  );
  const [metaDesc, setMetaDesc] = useState<string>(
    lang === 'ro'
      ? 'Descoperă proiectele de robotică, ghidurile de algoritmi C++ și articolele interactive realizate de elevii de gimnaziu.'
      : 'Explore student robotics projects, C++ algorithm guides, and interactive science articles crafted by middle schoolers.'
  );
  const [altText, setAltText] = useState<string>(
    lang === 'ro'
      ? 'Elevi în laboratorul de informatică programând un robot mobil'
      : 'Students in the computer lab programming an autonomous mobile robot'
  );
  const [primaryKeyword] = useState<string>(lang === 'ro' ? 'robotică' : 'robotics');

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

  // SEO Score calculation
  const titleLen = pageTitle.trim().length;
  const descLen = metaDesc.trim().length;
  const hasKeywordInTitle = pageTitle.toLowerCase().includes(primaryKeyword.toLowerCase()) ||
    pageTitle.toLowerCase().includes('robotic') ||
    pageTitle.toLowerCase().includes('infoteen');
  const hasAlt = altText.trim().length > 10;

  let seoScore = 0;
  if (titleLen >= 30 && titleLen <= 65) seoScore += 30;
  else if (titleLen > 0) seoScore += 15;

  if (descLen >= 80 && descLen <= 160) seoScore += 30;
  else if (descLen > 0) seoScore += 15;

  if (hasKeywordInTitle) seoScore += 20;
  if (hasAlt) seoScore += 20;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-sky-700 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-200 text-sm font-semibold tracking-wide uppercase mb-1">
              <Search className="w-5 h-5 text-sky-300" />
              <span>
                {lang === 'ro'
                  ? 'Unitatea 2: Pagini Web & Proiecte Online • Modulul 2C'
                  : 'Unit 2: Web Pages & Online Projects • Module 2C'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {lang === 'ro'
                ? 'Lecția 5: Optimizare pentru Motoarele de Căutare (SEO) & Indexare'
                : 'Lesson 5: Search Engine Optimization (SEO) & Indexing'}
            </h1>
            <p className="text-sky-100 text-sm md:text-base mt-1 max-w-3xl">
              {lang === 'ro'
                ? 'Manual Art Klett pag. 56: Descoperă cum analizează motoarele de căutare (Google, Bing) paginile web, cum se configurează titlurile meta, fragmentele informative (snippets) și etichetele alt ale imaginilor.'
                : 'Curriculum p. 56: Discover how search crawlers parse websites, how to structure informative meta titles and SERP snippets, and how image alt tags drive both accessibility and indexability.'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-sky-200 font-bold block">
              {lang === 'ro' ? 'Nivel' : 'Level'}
            </span>
            <span className="text-2xl font-black text-white">5 / 7</span>
          </div>
        </div>
      </div>

      {/* Manual Theory Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <BookOpen className="w-6 h-6 text-indigo-600 flex-shrink-0" />
          <h2 className="text-lg font-bold text-slate-800">
            {lang === 'ro'
              ? 'Repere Teoretice: Cum funcționează indexarea și clasarea Google (Manual pag. 56)'
              : 'Theoretical Reference: How Search Crawlers Index and Rank Pages (Curriculum p. 56)'}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-100 space-y-2">
            <div className="font-bold text-sky-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-600" />
              {lang === 'ro' ? 'Titlul Paginii (<title>)' : 'Page Title (<title>)'}
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'ro'
                ? 'Este primul element citit de robotul Google. Trebuie să aibă între 45 și 65 de caractere, să fie descriptiv și să conțină cele mai importante cuvinte-cheie ale proiectului.'
                : 'The primary headline parsed by Googlebot. Optimal length is 45–65 characters, clearly contextualizing page intent with primary search keywords.'}
            </p>
          </div>

          <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 space-y-2">
            <div className="font-bold text-indigo-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              {lang === 'ro' ? 'Descrierea Meta (Snippet)' : 'Meta Description (SERP Snippet)'}
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'ro'
                ? 'Apare sub titlu în rezultatele Google. Oferă vizitatorilor un rezumat convingător (120-160 caractere) despre ce vor găsi pe pagina web, crescând rata de accesare (Click-Through Rate).'
                : 'Renders under the title in Google search results. Delivers a compelling 120–160 character overview that boosts organic Click-Through Rate (CTR).'}
            </p>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 space-y-2">
            <div className="font-bold text-emerald-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              {lang === 'ro' ? 'Textul Alternativ (alt)' : 'Alternative Text (alt attribute)'}
            </div>
            <p className="text-slate-600 text-xs">
              {lang === 'ro'
                ? 'Motoarele de căutare nu pot „vedea” fișierele foto ca oamenii; ele citesc atributul alt="..." pentru a indexa imaginile și pentru a ajuta persoanele cu deficiențe de vedere.'
                : 'Crawlers cannot inspect raw image pixels like human eyes; they read alt="..." attributes to index image search results and power screen readers for visually impaired students.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Google SERP Snippet Studio */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-lg">
              {lang === 'ro'
                ? 'Simulator Interactiv: Editor de Meta-Etichete & Previzualizare Google Search'
                : 'Interactive Simulator: Meta Tag Editor & Live Google SERP Preview'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold">
              {lang === 'ro' ? 'Scor SEO:' : 'SEO Score:'}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-black ${
              seoScore >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {seoScore}% {seoScore >= 80 ? (lang === 'ro' ? 'Excelent ⭐' : 'Excellent ⭐') : (lang === 'ro' ? 'Optimizați' : 'Optimize')}
            </span>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <label className="font-bold text-slate-700">
                  {lang === 'ro' ? 'Titlul Paginii (Meta Title):' : 'Page Title (Meta Title):'}
                </label>
                <span className={`font-mono text-[11px] ${titleLen > 65 ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                  {titleLen} / 60 {lang === 'ro' ? 'caractere' : 'chars'}
                </span>
              </div>
              <input
                type="text"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-slate-50 focus:bg-white outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <label className="font-bold text-slate-700">
                  {lang === 'ro' ? 'Descrierea Paginii (Meta Description):' : 'Page Description (Meta Description):'}
                </label>
                <span className={`font-mono text-[11px] ${descLen > 160 ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                  {descLen} / 160 {lang === 'ro' ? 'caractere' : 'chars'}
                </span>
              </div>
              <textarea
                rows={3}
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-slate-50 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 text-xs block mb-1">
                {lang === 'ro'
                  ? 'Text Alternativ Imagine Hero (Atributul alt):'
                  : 'Hero Image Alternative Text (alt attribute):'}
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-slate-50 focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* Live SERP Preview */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
              {lang === 'ro'
                ? 'Cum apare pagina în căutările Google (Rezultat SERP Live):'
                : 'How the page renders in Google Search (Live SERP Card):'}
            </span>
            <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm space-y-1.5 font-sans">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                  G
                </div>
                <div>
                  <div className="text-slate-800 text-xs font-medium">InfoTeen Magazine</div>
                  <div className="text-[11px] text-slate-500 font-mono">https://sites.google.com/view/revista-infoteen-8</div>
                </div>
              </div>

              <div className="text-blue-800 hover:underline cursor-pointer text-base font-medium leading-snug">
                {pageTitle || (lang === 'ro' ? 'Titlu pagină' : 'Page title')}
              </div>

              <div className="text-xs text-slate-600 leading-relaxed">
                <span className="text-slate-400 font-medium mr-1">
                  {lang === 'ro' ? '31 oct. 2026 —' : 'Oct 31, 2026 —'}
                </span>
                {metaDesc || (lang === 'ro' ? 'Descrierea paginii va fi afișată aici pentru utilizatori.' : 'Page summary snippet renders here for visitors.')}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-600">
              <div className="font-bold text-slate-800">
                {lang === 'ro' ? 'Evaluare Algoritmică:' : 'Algorithmic Assessment:'}
              </div>
              <div>
                • {lang === 'ro' ? 'Lungime titlu: ' : 'Title length: '}
                {titleLen >= 30 && titleLen <= 65
                  ? lang === 'ro' ? '✅ Calibrat optim (30-65 car)' : '✅ Optimal length (30-65 chars)'
                  : lang === 'ro' ? '⚠️ Prea scurt sau depășește limita' : '⚠️ Too short or exceeds view bounds'}
              </div>
              <div>
                • {lang === 'ro' ? 'Descriere meta: ' : 'Meta description: '}
                {descLen >= 80 && descLen <= 160
                  ? lang === 'ro' ? '✅ Lungime optimă (80-160 car)' : '✅ Optimal length (80-160 chars)'
                  : lang === 'ro' ? '⚠️ Necesită completare' : '⚠️ Needs refinement'}
              </div>
              <div>
                • {lang === 'ro' ? 'Atribut alt la imagini: ' : 'Image alt attribute: '}
                {hasAlt
                  ? lang === 'ro' ? '✅ Prezent și descriptiv' : '✅ Present and descriptive'
                  : lang === 'ro' ? '❌ Lipsă alt text (penalizare SEO)' : '❌ Missing alt text (SEO penalty)'}
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
              ? 'Verificare Pedagogică: Optimizarea SEO (Manual pag. 56)'
              : 'Pedagogical Check: Search Engine Optimization (Curriculum p. 56)'}
          </h3>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              {lang === 'ro'
                ? 'Cerința 1: De ce este esențial să completezi textul alternativ (atributul alt) pentru fiecare imagine inserată pe site-ul tău?'
                : 'Requirement 1: Why is it crucial to specify descriptive alternative text (alt attribute) for every image on your website?'}
            </span>
            <QuestionHint
              hintRo="Manual pag. 56: Roboții motoarelor de căutare nu pot recunoaște vizual conținutul pixelilor și se bazează pe textul descriptiv, la fel ca și persoanele cu dizabilități vizuale ce folosesc cititoare de ecran."
              hintEn="Curriculum p. 56: Web crawlers cannot interpret graphic pixels visually and rely on alternative text, as do screen readers for visually impaired users."
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
                labelRo: 'A. Doar pentru a mări dimensiunea fișierului pe hard disk',
                labelEn: 'A. Solely to inflate disk file size'
              },
              {
                id: 'opt_b',
                labelRo: 'B. Pentru ca motoarele de căutare să poată indexa corect imaginea și pentru a asigura accesibilitatea persoanelor nevăzătoare',
                labelEn: 'B. So search engines accurately index the visual subject and screen readers assist visually impaired students'
              },
              {
                id: 'opt_c',
                labelRo: 'C. Pentru a ascunde imaginea de colegii din clasă',
                labelEn: 'C. To conceal the photo from classmates'
              },
              {
                id: 'opt_d',
                labelRo: 'D. Este o eroare de programare care trebuie ștearsă întotdeauna',
                labelEn: 'D. It is a deprecated code glitch that should always be deleted'
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
                  ? 'Corect! Atributul alt joacă un rol dublu fundamental: ajută motoarele de căutare să înțeleagă subiectul imaginii pentru căutările Google Imagini și oferă accesibilitate elevilor cu deficiențe de vedere prin cititoare de ecran.'
                  : 'Correct! The alt attribute serves a dual purpose: powering visual relevance in Google Image Search and enabling screen readers to narrate images to visually impaired learners.'
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
                ? 'Cerința 2: Ce se înțelege prin noțiunea de „fragment informativ” (snippet) în rezultatele căutării Google?'
                : 'Requirement 2: What is meant by the concept of a search "snippet" in Google SERP listings?'}
            </span>
            <QuestionHint
              hintRo="Manual pag. 56: Fragmentul cuprinde titlul paginii, adresa URL și scurtul rezumat de 1-2 propoziții afișat în lista de rezultate."
              hintEn="Curriculum p. 56: The snippet comprises the page title, URL breadcrumb, and short 1-2 sentence meta description shown in search results."
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
                labelRo: 'A. Un virus informatic care distruge rezultatele de căutare',
                labelEn: 'A. A computer virus corrupting search databases'
              },
              {
                id: 'opt_b',
                labelRo: 'B. Blocul informativ format din titlul paginii, adresa web și descrierea meta afișat vizitatorilor în pagina de rezultate',
                labelEn: 'B. The informative block consisting of page title, URL, and meta description displayed to searchers'
              },
              {
                id: 'opt_c',
                labelRo: 'C. O tastatură specială pentru căutări rapide',
                labelEn: 'C. A specialized keyboard for rapid searching'
              },
              {
                id: 'opt_d',
                labelRo: 'D. Un fișier audio descărcat automat în telefon',
                labelEn: 'D. An audio file automatically downloaded to your phone'
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
                  ? 'Excelent! Snippet-ul este cartea de vizită a site-ului tău în motorul de căutare: un titlu atractiv și o descriere meta clară determină utilizatorii să dea clic pe linkul tău.'
                  : 'Excellent! The SERP snippet is your website\'s digital business card in search listings: a clear title and enticing meta description invite users to click through.'
              }
              isCorrect={true}
            />
          )}
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <PageNavigationFooter
        currentLevel={5}
        totalLevels={7}
        isCompleted={allQuizzesPassed}
        onPrev={onPrev}
        onNext={handleFinish}
        nextLabel={
          lang === 'ro'
            ? 'Continuă cu Lecția 6: Audit Calitativ al Sitului Web & Testare Finală'
            : 'Continue to Lesson 6: Site Quality Audit & Final Pre-Launch Testing'
        }
      />
    </div>
  );
};
