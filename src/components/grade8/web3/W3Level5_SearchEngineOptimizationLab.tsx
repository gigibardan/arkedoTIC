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
  const { cooldowns, triggerCooldown, isLocked } = useQuestionCooldowns(5);

  // SEO Simulator State
  const [pageTitle, setPageTitle] = useState<string>('Revista Școlară InfoTeen | Clasa a VIII-a Colegiu');
  const [metaDesc, setMetaDesc] = useState<string>('Descoperă proiectele de robotică, ghidurile de algoritmi C++ și articolele interactive realizate de elevii de gimnaziu.');
  const [altText, setAltText] = useState<string>('Elevi în laboratorul de informatică programând un robot mobil');
  const [primaryKeyword, setPrimaryKeyword] = useState<string>('robotică');

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
  const hasKeywordInTitle = pageTitle.toLowerCase().includes(primaryKeyword.toLowerCase());
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
              <span>Unitatea 2: Pagini Web & Proiecte Online • Modulul 2C</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Lecția 5: Optimizare pentru Motoarele de Căutare (SEO) & Indexare
            </h1>
            <p className="text-sky-100 text-sm md:text-base mt-1 max-w-3xl">
              Manual Art Klett pag. 56: Descoperă cum analizează motoarele de căutare (Google, Bing) paginile web,
              cum se configurează titlurile meta, fragmentele informative (snippets) și etichetele alt ale imaginilor.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-sky-200 font-bold block">Nivel</span>
            <span className="text-2xl font-black text-white">5 / 7</span>
          </div>
        </div>
      </div>

      {/* Manual Theory Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <BookOpen className="w-6 h-6 text-indigo-600 flex-shrink-0" />
          <h2 className="text-lg font-bold text-slate-800">
            Repere Teoretice: Cum funcționează indexarea și clasarea Google (Manual pag. 56)
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-100 space-y-2">
            <div className="font-bold text-sky-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-600" />
              Titlul Paginii (`&lt;title&gt;`)
            </div>
            <p className="text-slate-600 text-xs">
              Este primul element citit de robotul Google. Trebuie să aibă între 45 și 65 de caractere,
              să fie descriptiv și să conțină cele mai importante cuvinte-cheie ale proiectului.
            </p>
          </div>

          <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 space-y-2">
            <div className="font-bold text-indigo-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              Descrierea Meta (Snippet)
            </div>
            <p className="text-slate-600 text-xs">
              Apare sub titlu în rezultatele Google. Oferă vizitatorilor un rezumat convingător (120-160 caractere)
              despre ce vor găsi pe pagina web, crescând rata de accesare (Click-Through Rate).
            </p>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 space-y-2">
            <div className="font-bold text-emerald-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              Textul Alternativ (`alt`)
            </div>
            <p className="text-slate-600 text-xs">
              Motoarele de căutare nu pot „vedea” fișierele foto ca oamenii; ele citesc atributul <code>alt="..."</code>
              pentru a indexa imaginile și pentru a ajuta persoanele cu deficiențe de vedere.
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
              Simulator Interactiv: Editor de Meta-Etichete & Previzualizare Google Search
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold">Scor SEO:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-black ${
              seoScore >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {seoScore}% {seoScore >= 80 ? 'Excelent ⭐' : 'Optimizați'}
            </span>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <label className="font-bold text-slate-700">Titlul Paginii (Meta Title):</label>
                <span className={`font-mono text-[11px] ${titleLen > 65 ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                  {titleLen} / 60 caractere
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
                <label className="font-bold text-slate-700">Descrierea Paginii (Meta Description):</label>
                <span className={`font-mono text-[11px] ${descLen > 160 ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                  {descLen} / 160 caractere
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
                Text Alternativ Imagine Hero (Atributul alt):
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
              Cum apare pagina în căutările Google (Rezultat SERP Live):
            </span>
            <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm space-y-1.5 font-sans">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                  G
                </div>
                <div>
                  <div className="text-slate-800 text-xs font-medium">Revista InfoTeen Școala</div>
                  <div className="text-[11px] text-slate-500 font-mono">https://sites.google.com/view/revista-infoteen-8</div>
                </div>
              </div>

              <div className="text-blue-800 hover:underline cursor-pointer text-base font-medium leading-snug">
                {pageTitle || 'Titlu pagină'}
              </div>

              <div className="text-xs text-slate-600 leading-relaxed">
                <span className="text-slate-400 font-medium mr-1">31 oct. 2026 —</span>
                {metaDesc || 'Descrierea paginii va fi afișată aici pentru utilizatori.'}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-600">
              <div className="font-bold text-slate-800">Evaluare Algoritmică:</div>
              <div>• Lungime titlu: {titleLen >= 30 && titleLen <= 65 ? '✅ Calibrat optim (30-65 car)' : '⚠️ Prea scurt sau depășește limita'}</div>
              <div>• Descriere meta: {descLen >= 80 && descLen <= 160 ? '✅ Lungime optimă (80-160 car)' : '⚠️ Necesită completare'}</div>
              <div>• Atribut alt la imagini: {hasAlt ? '✅ Prezent și descriptiv' : '❌ Lipsă alt text (penalizare SEO)'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pedagogical Verification */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800 text-lg">
            Verificare Pedagogică: Optimizarea SEO (Manual pag. 56)
          </h3>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 1: De ce este esențial să completezi textul alternativ (atributul alt) pentru fiecare imagine inserată pe site-ul tău?
            </span>
            <QuestionHint
              hint="Manual pag. 56: Roboții motoarelor de căutare nu pot recunoaște vizual conținutul pixelilor și se bazează pe textul descriptiv, la fel ca și persoanele cu dizabilități vizuale ce folosesc cititoare de ecran."
              isOpen={showHint['q1'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q1: !prev.q1 }))}
            />
          </div>

          {isLocked('q1') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q1'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. Doar pentru a mări dimensiunea fișierului pe hard disk' },
              { id: 'opt_b', label: 'B. Pentru ca motoarele de căutare să poată indexa corect imaginea și pentru a asigura accesibilitatea persoanelor nevăzătoare' },
              { id: 'opt_c', label: 'C. Pentru a ascunde imaginea de colegii din clasă' },
              { id: 'opt_d', label: 'D. Este o eroare de programare care trebuie ștearsă întotdeauna' }
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
              explanation="Corect! Atributul alt joacă un rol dublu fundamental: ajută motoarele de căutare să înțeleagă subiectul imaginii pentru căutările Google Imagini și oferă accesibilitate elevilor cu deficiențe de vedere prin cititoare de ecran."
              isCorrect={true}
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-slate-800">
              Cerința 2: Ce se înțelege prin noțiunea de „fragment informativ” (snippet) în rezultatele căutării Google?
            </span>
            <QuestionHint
              hint="Manual pag. 56: Fragmentul cuprinde titlul paginii, adresa URL și scurtul rezumat de 1-2 propoziții afișat în lista de rezultate."
              isOpen={showHint['q2'] || false}
              onToggle={() => setShowHint(prev => ({ ...prev, q2: !prev.q2 }))}
            />
          </div>

          {isLocked('q2') && (
            <PedagogicalReflectionBanner remainingSeconds={cooldowns['q2'] || 0} />
          )}

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'opt_a', label: 'A. Un virus informatic care distruge rezultatele de căutare' },
              { id: 'opt_b', label: 'B. Blocul informativ format din titlul paginii, adresa web și descrierea meta afișat vizitatorilor în pagina de rezultate' },
              { id: 'opt_c', label: 'C. O tastatură specială pentru căutări rapide' },
              { id: 'opt_d', label: 'D. Un fișier audio descărcat automat în telefon' }
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
              explanation="Excelent! Snippet-ul este cartea de vizită a site-ului tău în motorul de căutare: un titlu atractiv și o descriere meta clară determină utilizatorii să dea clic pe linkul tău."
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
        nextLabel="Continuă cu Lecția 6: Audit Calitativ al Sitului Web & Testare Finală"
      />
    </div>
  );
};
