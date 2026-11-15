import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Copy,
  HelpCircle,
  Home,
  Search,
  CheckCircle2,
  ExternalLink,
  Share2,
  MessageCircle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  BLOG_ARTICLES,
  BLOG_CATEGORIES,
  BlogArticle,
  BlogCategoryId,
  BlogInternalLink,
  getRelatedBlogArticles,
} from '../../data/blog';
import { AllMissionId } from '../../types';
import { sounds } from '../../utils/audio';
import { forceScrollToTop } from '../../utils/scrollHelper';

interface BlogHubProps {
  activeSlug: string | null;
  onSelectArticle: (slug: string | null) => void;
  onBackToHome: () => void;
  onSelectMission: (missionId: AllMissionId) => void;
  onNavigateToView: (view: 'catalog' | 'arcade' | 'duel' | 'city' | 'teacher' | 'sandbox') => void;
}

export const BlogHub: React.FC<BlogHubProps> = ({
  activeSlug,
  onSelectArticle,
  onBackToHome,
  onSelectMission,
  onNavigateToView,
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const [selectedCategory, setSelectedCategory] = useState<BlogCategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window === 'undefined') return '';
    try {
      return new URLSearchParams(window.location.search).get('q') || '';
    } catch {
      return '';
    }
  });
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  const activeArticle: BlogArticle | undefined = useMemo(() => {
    if (!activeSlug) return undefined;
    const clean = activeSlug.replace(/^\/+|\/+$/g, '').toLowerCase();
    return BLOG_ARTICLES.find(
      (a) => a.ro.slug.toLowerCase() === clean || a.en.slug.toLowerCase() === clean || a.id.toLowerCase() === clean
    );
  }, [activeSlug]);

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return BLOG_ARTICLES.filter((article) => {
      if (selectedCategory !== 'all' && article.category !== selectedCategory) return false;
      if (!q) return true;
      const content = isEn ? article.en : article.ro;
      const haystack = `${content.title} ${content.metaDescription} ${content.keywords} ${content.categoryLabel} ${article.gradeTagRo} ${article.gradeTagEn}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [selectedCategory, searchQuery, isEn]);

  const activeCategoriesWithCount = useMemo(() => {
    return BLOG_CATEGORIES.filter((cat) => {
      if (cat.id === 'all') return true;
      return BLOG_ARTICLES.some((a) => a.category === cat.id);
    });
  }, []);

  const handleOpenArticle = (article: BlogArticle) => {
    sounds.playClick();
    const targetSlug = isEn ? article.en.slug : article.ro.slug;
    onSelectArticle(targetSlug);
    forceScrollToTop();
  };

  const handleBackToIndex = () => {
    sounds.playClick();
    onSelectArticle(null);
    forceScrollToTop();
  };

  const handleCopyCode = (key: string, code: string) => {
    sounds.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        setCopiedCodeKey(key);
        setTimeout(() => setCopiedCodeKey(null), 2000);
      }).catch(() => {});
    }
  };

  const handleInternalLinkClick = (e: React.MouseEvent, link: BlogInternalLink) => {
    if (link.missionId) {
      e.preventDefault();
      sounds.playClick();
      onSelectMission(link.missionId as AllMissionId);
      return;
    }
    if (link.targetView) {
      e.preventDefault();
      sounds.playClick();
      onNavigateToView(link.targetView);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // ARTICLE DETAIL VIEW
  if (activeArticle) {
    const content = isEn ? activeArticle.en : activeArticle.ro;
    const gradeTag = isEn ? activeArticle.gradeTagEn : activeArticle.gradeTagRo;
    const related = getRelatedBlogArticles(activeArticle.id, 3);
    const staticArticleUrl = isEn ? `/blog/en/${activeArticle.en.slug}/` : `/blog/${activeArticle.ro.slug}/`;
    const canonicalShareUrl = `https://www.arkyedu.com${staticArticleUrl}`;
    const whatsappShareHref = `https://wa.me/?text=${encodeURIComponent(`${content.title} — ${canonicalShareUrl}`)}`;

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
            title: content.title,
            text: content.tldr,
            url: canonicalShareUrl,
          });
          return;
        } catch {
          // User cancelled or share unsupported; fall back to copy
        }
      }
      handleCopyShareUrl();
    };

    return (
      <article className="max-w-4xl mx-auto w-full space-y-8 pb-12" itemScope itemType="https://schema.org/BlogPosting">
        {/* Breadcrumbs returning to Home & Blog Index */}
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
            href={isEn ? '/blog/en/' : '/blog/'}
            onClick={(e) => {
              e.preventDefault();
              handleBackToIndex();
            }}
            className="hover:text-teal-300 transition-colors py-1 px-1 font-medium text-teal-300"
          >
            {isEn ? 'ICT Blog & Guides' : 'Blog & Ghiduri TIC'}
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          <span className="text-slate-400">{content.categoryLabel}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          <span className="text-slate-100 font-semibold truncate max-w-[240px] sm:max-w-xs" aria-current="page">
            {content.breadcrumbLabel}
          </span>
        </nav>

        {/* Article Header */}
        <header className="space-y-4 border-b border-slate-800 pb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="font-semibold text-teal-300">{content.categoryLabel}</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span>{gradeTag}</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span>{content.readTime}</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <time dateTime={activeArticle.updatedAt}>
              {isEn ? `Updated ${activeArticle.updatedAt}` : `Actualizat ${activeArticle.updatedAt}`}
            </time>
          </div>

          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight text-balance"
            itemProp="headline"
          >
            {content.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl" itemProp="description">
            {content.intro}
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleBackToIndex}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isEn ? 'All Blog Guides' : 'Toate articolele'}</span>
            </button>
            <a
              href={whatsappShareHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sounds.playClick()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={handleCopyShareUrl}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              {copiedShareLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                  <span className="text-emerald-300">{isEn ? 'Link copied!' : 'Link copiat!'}</span>
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
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-teal-300 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isEn ? 'Share' : 'Distribuie'}</span>
            </button>
            <a
              href={staticArticleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-teal-300 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isEn ? 'Permalink / Print View' : 'Link direct SEO'}</span>
            </a>
          </div>
        </header>

        {/* Answer-First TL;DR Summary Box for Quick Student Clarity & AI Citation */}
        <section
          aria-labelledby="tldr-heading"
          className="rounded-xl bg-slate-800/60 border border-teal-500/35 p-5 sm:p-6 space-y-2"
        >
          <h2 id="tldr-heading" className="text-sm font-bold text-teal-300 tracking-tight">
            {content.tldrTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-100 leading-relaxed">{content.tldr}</p>
        </section>

        {/* Table of Contents */}
        <nav
          aria-labelledby="toc-heading"
          className="rounded-xl bg-slate-900/70 border border-slate-800 p-5 space-y-3"
        >
          <h2 id="toc-heading" className="text-sm font-bold text-slate-100">
            {isEn ? 'In This Guide' : 'Cuprinsul ghidului'}
          </h2>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
            {content.sections.map((sec) => (
              <li key={sec.id}>
                <button
                  type="button"
                  onClick={() => scrollToSection(sec.id)}
                  className="text-left text-slate-300 hover:text-teal-300 transition-colors underline-offset-4 hover:underline cursor-pointer"
                >
                  {sec.heading}
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => scrollToSection('faq-section')}
                className="text-left text-slate-300 hover:text-teal-300 transition-colors underline-offset-4 hover:underline cursor-pointer"
              >
                {isEn ? 'Frequently Asked Questions (FAQ)' : 'Întrebări frecvente (FAQ)'}
              </button>
            </li>
          </ol>
        </nav>

        {/* Article Sections */}
        <div className="space-y-10" itemProp="articleBody">
          {content.sections.map((section) => (
            <section key={section.id} id={section.id} className="space-y-4 scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight text-balance">
                {section.heading}
              </h2>

              <div className="space-y-3">
                {section.paragraphs.map((p, idx) => (
                  <p key={idx} className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-3xl">
                    {p}
                  </p>
                ))}
              </div>

              {section.numberedSteps && section.numberedSteps.length > 0 && (
                <ol className="space-y-2.5 pl-5 list-decimal text-sm sm:text-base text-slate-200 leading-relaxed max-w-3xl marker:text-teal-300 marker:font-bold">
                  {section.numberedSteps.map((step, idx) => (
                    <li key={idx} className="pl-1">
                      {step}
                    </li>
                  ))}
                </ol>
              )}

              {section.bulletPoints && section.bulletPoints.length > 0 && (
                <ul className="space-y-2.5 pl-5 list-disc text-sm sm:text-base text-slate-200 leading-relaxed max-w-3xl marker:text-teal-400">
                  {section.bulletPoints.map((item, idx) => (
                    <li key={idx} className="pl-1">
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {section.codeBlock && (
                <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                  <div className="flex items-center justify-between gap-4 px-4 py-2.5 border-b border-slate-800 bg-slate-900/70">
                    <span className="text-xs font-semibold text-slate-200">{section.codeBlock.title}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(section.id, section.codeBlock!.code)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors cursor-pointer"
                    >
                      {copiedCodeKey === section.id ? (
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
                    <code>{section.codeBlock.code}</code>
                  </pre>
                  {section.codeBlock.caption && (
                    <p className="px-4 py-2 text-xs text-slate-300 border-t border-slate-800/80 bg-slate-900/40">
                      {section.codeBlock.caption}
                    </p>
                  )}
                </div>
              )}

              {section.table && (
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    {section.table.caption && (
                      <caption className="px-4 py-2.5 text-left text-xs font-semibold text-slate-300 border-b border-slate-800 bg-slate-900/80">
                        {section.table.caption}
                      </caption>
                    )}
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/70 text-slate-100">
                        {section.table.headers.map((header, idx) => (
                          <th key={idx} className="px-4 py-3 font-bold">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {section.table.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-800/30 transition-colors">
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className={`px-4 py-3 align-top leading-relaxed ${
                                cIdx === 0 ? 'font-semibold text-white tabular-nums' : 'text-slate-200'
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {section.callout && (
                <div
                  className={`rounded-xl p-4 sm:p-5 border space-y-1 ${
                    section.callout.variant === 'warning'
                      ? 'bg-amber-950/25 border-amber-500/35'
                      : 'bg-slate-800/45 border-slate-700'
                  }`}
                >
                  <h3
                    className={`text-sm font-bold ${
                      section.callout.variant === 'warning' ? 'text-amber-300' : 'text-teal-300'
                    }`}
                  >
                    {section.callout.title}
                  </h3>
                  <p className="text-sm text-slate-200 leading-relaxed">{section.callout.text}</p>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Checklist */}
        <section className="rounded-xl bg-slate-800/40 border border-slate-700/80 p-5 sm:p-6 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>{content.checklistTitle}</span>
          </h2>
          <ul className="space-y-2 text-sm text-slate-200">
            {content.checklist.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Contextual Internal Links to ArkyEdu Courses / Games */}
        <section className="rounded-xl bg-slate-900/75 border border-teal-500/30 p-5 sm:p-6 space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-white">{content.internalLinksTitle}</h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {isEn
                ? 'Launch the interactive ArkyEdu browser labs and arcade games connected to this topic:'
                : 'Deschide direct din articol laboratoarele interactive și jocurile ArkyEdu conectate cu acest subiect:'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {content.internalLinks.map((link) => (
              <a
                key={link.url + link.label}
                href={link.url}
                onClick={(e) => handleInternalLinkClick(e, link)}
                className="group rounded-xl p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-400/50 transition-colors flex flex-col justify-between gap-2"
              >
                <div className="space-y-1">
                  <div className="text-sm font-bold text-teal-300 group-hover:text-teal-200 flex items-center justify-between gap-2">
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{link.description}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq-section" className="space-y-4 scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-teal-400 shrink-0" aria-hidden="true" />
            <span>{isEn ? 'Frequently Asked Questions' : 'Întrebări frecvente (FAQ)'}</span>
          </h2>
          <div className="divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-900/50">
            {content.faqs.map((faq, idx) => (
              <div key={idx} className="p-4 sm:p-5 space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-white">{faq.question}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Share Bar for Class Groups & Parents */}
        <section className="rounded-xl bg-slate-800/40 border border-slate-700/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h2 className="text-sm sm:text-base font-bold text-white">
              {isEn ? 'Helpful guide? Share it with classmates or parents' : 'Ți-a fost util ghidul? Trimite-l pe grupul clasei sau părinților'}
            </h2>
            <p className="text-xs text-slate-300">
              {isEn ? '100% free educational resource, zero ads.' : 'Resursă educațională 100% gratuită, fără reclame.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href={whatsappShareHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sounds.playClick()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={handleCopyShareUrl}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              {copiedShareLink ? <Check className="w-3.5 h-3.5 text-emerald-300" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
              <span>{copiedShareLink ? (isEn ? 'Copied!' : 'Copiat!') : (isEn ? 'Copy link' : 'Copiază link')}</span>
            </button>
          </div>
        </section>

        {/* Related Articles & Breadcrumb Return Footer */}
        {related.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {isEn ? 'Continue Reading' : 'Citește și alte ghiduri recomandate'}
              </h2>
              <button
                type="button"
                onClick={handleBackToIndex}
                className="text-xs sm:text-sm font-semibold text-teal-300 hover:text-teal-200 transition-colors cursor-pointer"
              >
                {isEn ? 'Back to Blog Index →' : 'Înapoi la Indexul Blogului →'}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((rel) => {
                const relContent = isEn ? rel.en : rel.ro;
                const relGrade = isEn ? rel.gradeTagEn : rel.gradeTagRo;
                return (
                  <button
                    key={rel.id}
                    type="button"
                    onClick={() => handleOpenArticle(rel)}
                    className="text-left rounded-xl p-4 bg-slate-800/40 hover:bg-slate-800/75 border border-slate-700/80 hover:border-teal-400/50 transition-colors flex flex-col justify-between gap-3 cursor-pointer"
                  >
                    <div className="space-y-2">
                      <div className="text-xs text-slate-300 flex items-center gap-1.5">
                        <span className="text-teal-300 font-semibold">{relContent.categoryLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span>{relGrade}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white leading-snug">{relContent.breadcrumbLabel}</h3>
                      <p className="text-xs text-slate-300 line-clamp-2">{relContent.metaDescription}</p>
                    </div>
                    <span className="text-xs font-semibold text-teal-300">
                      {isEn ? 'Read guide →' : 'Citește ghidul →'}
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

  // BLOG INDEX VIEW
  return (
    <div className="max-w-6xl mx-auto w-full space-y-8 pb-12">
      {/* Breadcrumb Home > Blog */}
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
          {isEn ? 'ICT Blog & Study Guides' : 'Blog & Ghiduri TIC'}
        </span>
      </nav>

      {/* Editorial Hero */}
      <section className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <p className="text-xs font-semibold text-teal-300">
              {isEn
                ? 'ArkyEdu Knowledge Hub · Grades 5–8 · Bilingual RO / EN'
                : 'Resurse TIC & Programare Gimnaziu · Clasele V–VIII · Bilingv RO / EN'}
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight text-balance">
              {isEn
                ? 'ICT, Coding & Tech Guides That Solve Real School Problems'
                : 'Ghiduri practice de TIC, C++, Excel, AI și Siguranță Online'}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {isEn
                ? 'Step-by-step tutorials built for Google and AI discovery—helping students fix Code::Blocks bugs, write Excel formulas, use ChatGPT safely, and stay secure online.'
                : 'Articole ample, scrise clar pentru elevi de gimnaziu, părinți și profesori: rezolvări de erori C++, formule Excel, prompturi AI corecte și siguranță digitală, conectate direct cu laboratoarele ArkyEdu.'}
            </p>
          </div>
          <a
            href={isEn ? '/blog/en/' : '/blog/'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold border border-slate-700 transition-colors shrink-0"
          >
            <BookOpen className="w-4 h-4 text-teal-300" aria-hidden="true" />
            <span>{isEn ? 'Static SEO Index' : 'Versiune HTML Statică'}</span>
          </a>
        </div>

        {/* Search + Interactive Category Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
            {activeCategoriesWithCount.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-teal-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {isEn ? cat.labelEn : cat.labelRo}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? 'Search C++, Excel, AI, Roblox...' : 'Caută C++, Excel, AI, Roblox...'}
              aria-label={isEn ? 'Search blog articles' : 'Caută articole în blog'}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/90 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
            />
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-8 text-center space-y-2">
          <p className="text-sm font-semibold text-white">
            {isEn ? 'No guides matched your search.' : 'Niciun ghid nu corespunde căutării tale.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="text-xs font-semibold text-teal-300 hover:text-teal-200 underline cursor-pointer"
          >
            {isEn ? 'Reset filters' : 'Resetează filtrele'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredArticles.map((article) => {
            const content = isEn ? article.en : article.ro;
            const gradeTag = isEn ? article.gradeTagEn : article.gradeTagRo;
            return (
              <article
                key={article.id}
                className="rounded-2xl bg-slate-800/40 hover:bg-slate-800/65 border border-slate-700/80 hover:border-teal-400/50 p-6 flex flex-col justify-between gap-4 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                    <span className="font-semibold text-teal-300">{content.categoryLabel}</span>
                    <span aria-hidden="true" className="text-slate-500">·</span>
                    <span>{gradeTag}</span>
                    <span aria-hidden="true" className="text-slate-500">·</span>
                    <span>{content.readTime}</span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-white leading-snug text-balance">
                    <a
                      href={isEn ? `/blog/en/${article.en.slug}/` : `/blog/${article.ro.slug}/`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleOpenArticle(article);
                      }}
                      className="hover:text-teal-300 transition-colors"
                    >
                      {content.title}
                    </a>
                  </h2>

                  <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                    {content.tldr}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-700/60">
                  <span className="text-xs text-slate-400">
                    {isEn ? `${content.faqs.length} FAQs · ${content.internalLinks.length} Labs` : `${content.faqs.length} FAQ · ${content.internalLinks.length} Laboratoare`}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenArticle(article)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>{isEn ? 'Read Full Guide' : 'Citește ghidul complet'}</span>
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
