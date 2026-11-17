import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Code2,
  Copy,
  ExternalLink,
  GitCompare,
  GraduationCap,
  HelpCircle,
  Home,
  Lightbulb,
  MessageCircle,
  Play,
  Search,
  Share2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { BLOG_ARTICLES } from '../../data/blog';
import { CURRICULA_MODULES } from '../../data/curriculaData';
import {
  findGlossaryTermBySlug,
  getRelatedGlossaryTerms,
  GLOSSARY_CATEGORIES,
  GLOSSARY_TERMS,
  GlossaryCategoryId,
  GlossaryTerm,
} from '../../data/glossary';
import { AllMissionId } from '../../types';
import { sounds } from '../../utils/audio';
import { forceScrollToTop } from '../../utils/scrollHelper';

interface GlossaryHubProps {
  activeSlug: string | null;
  onSelectTerm: (slug: string | null) => void;
  onBackToHome: () => void;
  onSelectMission: (missionId: AllMissionId) => void;
  onOpenBlog: (slug?: string | null) => void;
  onNavigateToView: (view: 'catalog' | 'arcade' | 'duel' | 'city' | 'teacher' | 'blog' | 'sandbox') => void;
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const GlossaryHub: React.FC<GlossaryHubProps> = ({
  activeSlug,
  onSelectTerm,
  onBackToHome,
  onSelectMission,
  onOpenBlog,
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategoryId | 'all'>('all');
  const [selectedGrade, setSelectedGrade] = useState<'all' | '5' | '6' | '7' | '8'>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window === 'undefined') return '';
    try {
      return new URLSearchParams(window.location.search).get('q') || '';
    } catch {
      return '';
    }
  });
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  const activeTerm: GlossaryTerm | null = useMemo(() => {
    return findGlossaryTermBySlug(activeSlug).term;
  }, [activeSlug]);

  const availableLetters = useMemo(() => {
    const set = new Set<string>();
    GLOSSARY_TERMS.forEach((item) => {
      const label = (isEn ? item.en.term : item.ro.term).trim().toUpperCase();
      const first = label.charAt(0).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (/[A-Z]/.test(first)) set.add(first);
    });
    return set;
  }, [isEn]);

  const filteredTerms = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return GLOSSARY_TERMS.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedGrade !== 'all' && !item.grades.includes(selectedGrade)) return false;

      const c = isEn ? item.en : item.ro;
      if (selectedLetter !== 'ALL') {
        const first = c.term.trim().toUpperCase().charAt(0).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (first !== selectedLetter) return false;
      }

      if (!q) return true;
      const catMeta = GLOSSARY_CATEGORIES.find((cat) => cat.id === item.category);
      const catText = catMeta ? (isEn ? catMeta.enName : catMeta.roName) : '';
      const haystack = `${c.term} ${c.shortAnswer} ${c.keywords} ${c.example} ${catText} ${item.gradeTagRo} ${item.gradeTagEn}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [selectedCategory, selectedGrade, selectedLetter, searchQuery, isEn]);

  const handleOpenTerm = (term: GlossaryTerm) => {
    sounds.playClick();
    const slug = isEn ? term.en.slug : term.ro.slug;
    onSelectTerm(slug);
    forceScrollToTop();
  };

  const handleBackToIndex = () => {
    sounds.playClick();
    onSelectTerm(null);
    forceScrollToTop();
  };

  const handleCopyCode = (code: string) => {
    sounds.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      }).catch(() => {});
    }
  };

  // DETAIL VIEW FOR A GLOSSARY TERM
  if (activeTerm) {
    const c = isEn ? activeTerm.en : activeTerm.ro;
    const catMeta = GLOSSARY_CATEGORIES.find((cat) => cat.id === activeTerm.category);
    const catName = catMeta ? (isEn ? catMeta.enName : catMeta.roName) : activeTerm.category;
    const gradeTag = isEn ? activeTerm.gradeTagEn : activeTerm.gradeTagRo;
    const staticUrl = isEn ? `/glosar/en/${activeTerm.en.slug}/` : `/glosar/${activeTerm.ro.slug}/`;
    const canonicalShareUrl = `https://www.arkyedu.com${staticUrl}`;
    const whatsappShareHref = `https://wa.me/?text=${encodeURIComponent(`${c.term} — ${canonicalShareUrl}`)}`;

    const relatedModule = CURRICULA_MODULES.find((m) => m.id === activeTerm.relatedModuleId);
    const relatedBlogs = activeTerm.relatedBlogIds
      .map((id) => BLOG_ARTICLES.find((a) => a.id === id))
      .filter((a): a is NonNullable<typeof a> => Boolean(a));
    const relatedTerms = getRelatedGlossaryTerms(activeTerm, 4);

    const handleCopyShareUrl = () => {
      sounds.playClick();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(canonicalShareUrl).then(() => {
          setCopiedShareLink(true);
          setTimeout(() => setCopiedShareLink(false), 2200);
        }).catch(() => {});
      }
    };

    const handleNativeShare = async () => {
      sounds.playClick();
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        try {
          await navigator.share({
            title: c.term,
            text: c.shortAnswer,
            url: canonicalShareUrl,
          });
          return;
        } catch {
          // Ignore cancel / fallback
        }
      }
      handleCopyShareUrl();
    };

    return (
      <article className="max-w-4xl mx-auto w-full space-y-8 pb-12" itemScope itemType="https://schema.org/DefinedTerm">
        {/* Breadcrumbs returning cleanly to Home & Glossary Index */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-slate-300">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onBackToHome();
            }}
            className="inline-flex items-center gap-1 hover:text-teal-300 transition-colors py-1 px-1 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isEn ? 'Home' : 'Acasă'}</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          <a
            href={isEn ? '/glosar/en/' : '/glosar/'}
            onClick={(e) => {
              e.preventDefault();
              handleBackToIndex();
            }}
            className="hover:text-teal-300 transition-colors py-1 px-1 font-medium text-teal-300"
          >
            {isEn ? 'ICT & CS Glossary' : 'Glosar Informatică & TIC'}
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          <span className="text-slate-400">{catName}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          <span className="text-slate-100 font-semibold truncate max-w-[240px] sm:max-w-xs" aria-current="page">
            {c.term}
          </span>
        </nav>

        {/* Term Header */}
        <header className="space-y-4 border-b border-slate-800 pb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="font-semibold text-teal-300">{catName}</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span>{gradeTag}</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span>{isEn ? 'Bilingual RO / EN' : 'Definiție bilingvă RO / EN'}</span>
          </div>

          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight text-balance"
            itemProp="name"
          >
            {c.term}
          </h1>

          {/* Action & Share Controls */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleBackToIndex}
              className="inline-flex items-center gap-2 px-4 py-2 min-h-[38px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isEn ? 'All 44 Terms' : 'Toți cei 44 termeni'}</span>
            </button>
            <a
              href={whatsappShareHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sounds.playClick()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition-colors whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={handleCopyShareUrl}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {copiedShareLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                  <span className="text-emerald-300">{isEn ? 'Copied!' : 'Copiat!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{isEn ? 'Copy link' : 'Copiază link'}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleNativeShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg text-xs font-medium text-slate-300 hover:text-teal-300 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isEn ? 'Share' : 'Distribuie'}</span>
            </button>
            <a
              href={staticUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg text-xs font-medium text-slate-300 hover:text-teal-300 transition-colors whitespace-nowrap shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isEn ? 'SEO Print View' : 'Link SEO Static'}</span>
            </a>
          </div>
        </header>

        {/* Position-0 Quick Answer Definition Box */}
        <section
          aria-labelledby="quick-def-heading"
          className="rounded-xl bg-slate-800/60 border border-teal-500/35 p-5 sm:p-6 space-y-2"
        >
          <h2 id="quick-def-heading" className="text-sm font-bold text-teal-300 tracking-tight flex items-center gap-2">
            <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{isEn ? 'Quick School Definition' : 'Definiție rapidă pentru școală'}</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-100 leading-relaxed font-medium" itemProp="description">
            {c.shortAnswer}
          </p>
        </section>

        {/* Detailed Explanation */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {isEn ? 'How It Works & Curriculum Context' : 'Cum funcționează și contextul din programă'}
          </h2>
          <div className="space-y-3">
            {c.explanation.map((paragraph, idx) => (
              <p key={idx} className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-3xl">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Optional Syntax / Formula Block */}
        {c.syntaxOrFormula && (
          <section className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-slate-800 bg-slate-900/70">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Code2 className="w-4 h-4 text-teal-400 shrink-0" aria-hidden="true" />
                <span>{c.syntaxOrFormula.title}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyCode(c.syntaxOrFormula!.code)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 min-h-[34px] rounded-md bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                    <span>{isEn ? 'Copied' : 'Copiat'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{isEn ? 'Copy' : 'Copiază'}</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-emerald-200 leading-relaxed">
              <code>{c.syntaxOrFormula.code}</code>
            </pre>
          </section>
        )}

        {/* Concrete Example + Nu Confunda Cu (Side-by-Side) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-5 space-y-2">
            <h2 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{isEn ? 'Concrete Classroom Example' : 'Exemplu practic din clasă'}</span>
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed">{c.example}</p>
          </div>

          <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-5 space-y-2">
            <h2 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <GitCompare className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{isEn ? `Do Not Confuse: ${c.vsComparison.title}` : `Nu confunda cu: ${c.vsComparison.title}`}</span>
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed">{c.vsComparison.summary}</p>
          </div>
        </section>

        {/* Common Exam Mistake Warning Callout */}
        <section className="rounded-xl bg-amber-950/25 border border-amber-500/35 p-5 space-y-1.5">
          <h2 className="text-sm font-bold text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{isEn ? 'Common Mistake on Tests & Homework' : 'Greșeală frecventă la test și teme'}</span>
          </h2>
          <p className="text-sm text-slate-200 leading-relaxed">{c.commonMistake}</p>
        </section>

        {/* Deep Internal Cross-Links to Interactive Labs, Syllabus & Blog Guides */}
        <section className="rounded-xl bg-slate-900/75 border border-teal-500/30 p-5 sm:p-6 space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-teal-400 shrink-0" aria-hidden="true" />
              <span>{isEn ? 'Practice Interactive Lab & Study Guides' : 'Exersează practic și aprofundează lecția'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {isEn
                ? 'Jump straight from definition into browser practice missions, curriculum notes, and step-by-step blog tutorials.'
                : 'Treci direct de la teorie la simulatorul interactiv în browser, fișa curriculară și ghidurile complete ArkyEdu.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Direct Interactive Mission Launch */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onSelectMission(activeTerm.relatedMissionId as AllMissionId);
              }}
              className="text-left group rounded-xl p-4 bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/40 transition-colors flex flex-col justify-between gap-2 cursor-pointer"
            >
              <div className="space-y-1">
                <div className="text-sm font-bold text-teal-300 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5">
                    <Play className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{isEn ? 'Launch Interactive Simulator' : 'Lansează Simulatorul Interactiv'}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {relatedModule
                    ? `${relatedModule.title} (${relatedModule.grade})`
                    : isEn
                    ? 'Open the matching interactive ArkyEdu lab'
                    : 'Deschide misiunea interactivă corespunzătoare în browser'}
                </p>
              </div>
            </button>

            {/* Static Curricula Guide */}
            {relatedModule && (
              <a
                href={`/cursuri/${relatedModule.id}/`}
                className="group rounded-xl p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-400/50 transition-colors flex flex-col justify-between gap-2"
              >
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white group-hover:text-teal-300 flex items-center justify-between gap-2">
                    <span>{isEn ? `Syllabus: ${relatedModule.shortTitle}` : `Fișă modul: ${relatedModule.shortTitle}`}</span>
                    <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{relatedModule.metaDescription}</p>
                </div>
              </a>
            )}

            {/* Connected Blog Guides */}
            {relatedBlogs.map((art) => {
              const bc = isEn ? art.en : art.ro;
              const blogHref = isEn ? `/blog/en/${art.en.slug}/` : `/blog/${art.ro.slug}/`;
              return (
                <a
                  key={art.id}
                  href={blogHref}
                  onClick={(e) => {
                    e.preventDefault();
                    sounds.playClick();
                    onOpenBlog(bc.slug);
                    forceScrollToTop();
                  }}
                  className="group rounded-xl p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-400/50 transition-colors flex flex-col justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-teal-300 group-hover:text-teal-200 flex items-center justify-between gap-2">
                      <span>{isEn ? `Guide: ${bc.breadcrumbLabel}` : `Ghid Blog: ${bc.breadcrumbLabel}`}</span>
                      <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{bc.metaDescription}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* Term FAQs */}
        {c.faqs.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-teal-400 shrink-0" aria-hidden="true" />
              <span>{isEn ? 'Frequently Asked Questions' : 'Întrebări frecvente pentru test'}</span>
            </h2>
            <div className="divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-900/50">
              {c.faqs.map((faq, idx) => (
                <div key={idx} className="p-4 sm:p-5 space-y-1.5">
                  <h3 className="text-sm sm:text-base font-bold text-white">{faq.question}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Glossary Terms */}
        {relatedTerms.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {isEn ? 'Related Glossary Terms' : 'Termeni înrudiți din glosar'}
              </h2>
              <button
                type="button"
                onClick={handleBackToIndex}
                className="text-xs sm:text-sm font-semibold text-teal-300 hover:text-teal-200 transition-colors cursor-pointer"
              >
                {isEn ? 'Back to A–Z Glossary →' : 'Înapoi la Glosarul A–Z →'}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedTerms.map((rel) => {
                const rc = isEn ? rel.en : rel.ro;
                const relGrade = isEn ? rel.gradeTagEn : rel.gradeTagRo;
                return (
                  <button
                    key={rel.id}
                    type="button"
                    onClick={() => handleOpenTerm(rel)}
                    className="text-left rounded-xl p-4 bg-slate-800/40 hover:bg-slate-800/75 border border-slate-700/80 hover:border-teal-400/50 transition-colors flex flex-col justify-between gap-2 cursor-pointer"
                  >
                    <div className="space-y-1.5">
                      <div className="text-xs text-slate-400">{relGrade}</div>
                      <h3 className="text-sm font-bold text-white leading-snug">{rc.term}</h3>
                      <p className="text-xs text-slate-300 line-clamp-2">{rc.shortAnswer}</p>
                    </div>
                    <span className="text-xs font-semibold text-teal-300">
                      {isEn ? 'Read definition →' : 'Vezi definiția →'}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </article>
    );
  }

  // GLOSSARY INDEX VIEW
  return (
    <div className="max-w-6xl mx-auto w-full space-y-7 pb-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-300">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onBackToHome();
          }}
          className="inline-flex items-center gap-1 hover:text-teal-300 transition-colors py-1 px-1 cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{isEn ? 'Home' : 'Acasă'}</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
        <span className="text-slate-100 font-semibold" aria-current="page">
          {isEn ? 'ICT & Computer Science Glossary' : 'Glosar Bilingv Informatică & TIC'}
        </span>
      </nav>

      {/* Hero + Filter Bar */}
      <section className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <p className="text-xs font-semibold text-teal-300 tabular-nums">
              {isEn
                ? `ArkyEdu Reference · ${GLOSSARY_TERMS.length} Curriculum Terms · Grades 5–8 · Bilingual RO / EN`
                : `Dicționar Școlar TIC & Coding · ${GLOSSARY_TERMS.length} Termeni Esențiali V–VIII · Bilingv RO / EN`}
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight text-balance">
              {isEn
                ? 'Interactive Computer Science & ICT Glossary (Grades 5–8)'
                : 'Glosar Bilingv Informatică & TIC pentru Gimnaziu (Clasele V–VIII)'}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {isEn
                ? 'Clear school-ready definitions, C++/Excel syntax formulas, real classroom examples, and "Do Not Confuse" comparisons linked straight to interactive ArkyEdu simulators.'
                : 'Definiții clare de nota 10, formule Excel și cod C++ gata de copiat, comparații „Nu confunda cu” și greșeli frecvente la test, conectate direct la laboratoarele ArkyEdu.'}
            </p>
          </div>
          <a
            href={isEn ? '/glosar/en/' : '/glosar/'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 min-h-[38px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold border border-slate-700 transition-colors shrink-0 whitespace-nowrap"
          >
            <BookOpen className="w-4 h-4 text-teal-300" aria-hidden="true" />
            <span>{isEn ? 'Static HTML Version' : 'Versiune HTML Statică'}</span>
          </a>
        </div>

        {/* Category Filter Tabs + Search Input */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none sm:flex-wrap bg-slate-950/70 p-1 rounded-xl border border-slate-800 max-w-full">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setSelectedCategory('all');
              }}
              className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                selectedCategory === 'all'
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {isEn ? `All (${GLOSSARY_TERMS.length})` : `Toate (${GLOSSARY_TERMS.length})`}
            </button>
            {GLOSSARY_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-teal-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {isEn ? cat.enName : cat.roName}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? 'Search CPU, modulo, IF, millis...' : 'Caută CPU, modulo %, IF, millis...'}
              aria-label={isEn ? 'Search glossary terms' : 'Caută termeni în glosar'}
              className="w-full min-h-[40px] pl-9 pr-3 py-2 rounded-xl bg-slate-950/90 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
            />
          </div>
        </div>

        {/* Grade Filter & A-Z Quick Jump */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 mr-1">
              {isEn ? 'Grade:' : 'Clasa:'}
            </span>
            {(['all', '5', '6', '7', '8'] as const).map((gr) => (
              <button
                key={gr}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setSelectedGrade(gr);
                }}
                className={`px-3 py-1.5 min-h-[36px] rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedGrade === gr
                    ? 'bg-slate-100 text-slate-950 font-bold'
                    : 'bg-slate-800/70 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {gr === 'all'
                  ? isEn
                    ? 'All'
                    : 'Toate'
                  : isEn
                  ? `Grade ${gr}`
                  : gr === '5'
                  ? 'a V-a'
                  : gr === '6'
                  ? 'a VI-a'
                  : gr === '7'
                  ? 'a VII-a'
                  : 'a VIII-a'}
              </button>
            ))}
          </div>

          {/* A-Z Letter Jump */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:flex-wrap max-w-full">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setSelectedLetter('ALL');
              }}
              className={`px-2.5 py-1 min-h-[34px] rounded text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedLetter === 'ALL'
                  ? 'bg-teal-500 text-slate-950'
                  : 'bg-slate-800/70 text-slate-300 hover:text-white'
              }`}
            >
              A–Z
            </button>
            {LETTERS.filter((l) => availableLetters.has(l)).map((letter) => (
              <button
                key={letter}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setSelectedLetter((prev) => (prev === letter ? 'ALL' : letter));
                }}
                className={`min-w-[34px] min-h-[34px] px-2 rounded text-xs font-mono font-bold transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
                  selectedLetter === letter
                    ? 'bg-teal-500 text-slate-950'
                    : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Terms Grid */}
      {filteredTerms.length === 0 ? (
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-8 text-center space-y-2">
          <p className="text-sm font-semibold text-white">
            {isEn ? 'No glossary terms matched your filters.' : 'Niciun termen nu corespunde filtrelor selectate.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSelectedGrade('all');
              setSelectedLetter('ALL');
              setSearchQuery('');
            }}
            className="text-xs font-semibold text-teal-300 hover:text-teal-200 underline cursor-pointer"
          >
            {isEn ? 'Reset all filters' : 'Resetează toate filtrele'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTerms.map((item) => {
            const c = isEn ? item.en : item.ro;
            const catMeta = GLOSSARY_CATEGORIES.find((cat) => cat.id === item.category);
            const catLabel = catMeta ? (isEn ? catMeta.enName : catMeta.roName) : item.category;
            const gradeTag = isEn ? item.gradeTagEn : item.gradeTagRo;
            const href = isEn ? `/glosar/en/${item.en.slug}/` : `/glosar/${item.ro.slug}/`;

            return (
              <article
                key={item.id}
                className="rounded-2xl bg-slate-800/40 hover:bg-slate-800/65 border border-slate-700/80 hover:border-teal-400/50 p-5 flex flex-col justify-between gap-4 transition-colors"
              >
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                    <span className="font-semibold text-teal-300">{catLabel}</span>
                    <span aria-hidden="true" className="text-slate-500">·</span>
                    <span>{gradeTag}</span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-white leading-snug text-balance">
                    <a
                      href={href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleOpenTerm(item);
                      }}
                      className="hover:text-teal-300 transition-colors"
                    >
                      {c.term}
                    </a>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                    {c.shortAnswer}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-700/60">
                  <span className="text-xs text-slate-400 truncate max-w-[200px]">
                    {c.vsComparison.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenTerm(item)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>{isEn ? 'Read Definition' : 'Vezi Definiția'}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
