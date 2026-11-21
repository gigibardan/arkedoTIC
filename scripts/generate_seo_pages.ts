import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CURRICULA_MODULES, CurriculaModule } from '../src/data/curriculaData';
import { BLOG_ARTICLES, BLOG_CATEGORIES, BlogArticle, getRelatedBlogArticles } from '../src/data/blog/index';
import {
  GLOSSARY_TERMS,
  GLOSSARY_CATEGORIES,
  GlossaryTerm,
  getRelatedGlossaryTerms,
  getGlossaryTermsForModule
} from '../src/data/glossary/index';
import { SANDBOX_CHALLENGES } from '../src/data/sandboxChallenges';
import { OLYMPIAD_PROBLEMS } from '../src/data/olympiadProblems';
import {
  WORKSHEETS_BANK,
  WORKSHEET_GRADE_LABELS,
  WORKSHEET_KIND_LABELS,
  getRelatedWorksheets
} from '../src/data/worksheets/index';
import {
  GTA6_FACTS_2026,
  LEONIDA_REGIONS,
  LEONIDA_CAST,
  LEONIDA_VEHICLES,
  LEONIDA_STORY_CHALLENGES,
  LEONIDA_TECH_BRIDGES,
  LEONIDA_FAQS
} from '../src/data/leonidaOpenWorldData';
import {
  TOKENIZER_PRESETS,
  HALLUCINATION_STRESS_TESTS,
  DEEPFAKE_FORENSIC_CASES,
  PROMPT_ARCHITECT_CHALLENGES,
  AI_CURRICULUM_BRIDGES,
  AI_LAB_FAQS
} from '../src/data/aiLabData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

// Common modern responsive styles for all static SEO pages
const commonStyles = `
  :root {
    --bg-dark: #090d16;
    --card-bg: #111827;
    --card-border: #1f2937;
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    --text-muted: #64748b;
    --accent: #10b981;
    --accent-hover: #059669;
    --brand-cyan: #06b6d4;
    --brand-blue: #3b82f6;
    --brand-purple: #8b5cf6;
    --brand-amber: #f59e0b;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background-color: var(--bg-dark);
    color: var(--text-primary);
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    line-height: 1.6;
    overflow-x: hidden;
  }
  .container {
    max-width: 1140px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }
  /* HEADER */
  header {
    background: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--card-border);
    position: sticky;
    top: 0;
    z-index: 50;
  }
  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 4.5rem;
  }
  .logo-box {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: #fff;
  }
  .logo-icon {
    width: 2.5rem;
    height: 2.5rem;
    background: linear-gradient(135deg, #10b981, #06b6d4);
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
  }
  .logo-text {
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.025em;
  }
  .nav-links {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }
  .nav-links a {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 600;
    transition: color 0.2s;
  }
  .nav-links a:hover {
    color: #fff;
  }
  .nav-cta {
    background: linear-gradient(135deg, #10b981, #059669);
    color: #fff !important;
    padding: 0.6rem 1.25rem;
    border-radius: 0.75rem;
    font-weight: 700;
    box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .nav-cta:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
  }
  @media (max-width: 768px) {
    .nav-links { display: none; }
  }

  /* HERO & MAIN */
  .hero-section {
    padding: 3.5rem 0 2.5rem;
    text-align: center;
  }
  .badge-bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
  }
  .badge {
    padding: 0.35rem 0.85rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background: #1e293b;
    color: var(--brand-cyan);
    border: 1px solid rgba(6, 182, 212, 0.3);
  }
  .badge-green {
    background: rgba(16, 185, 129, 0.15);
    color: #34d399;
    border-color: rgba(16, 185, 129, 0.35);
  }
  .badge-free {
    background: rgba(245, 158, 11, 0.15);
    color: #fbbf24;
    border-color: rgba(245, 158, 11, 0.35);
  }
  h1 {
    font-size: 2.25rem;
    font-weight: 900;
    line-height: 1.25;
    letter-spacing: -0.03em;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #ffffff 40%, #94a3b8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  @media (min-width: 768px) {
    h1 { font-size: 3rem; }
  }
  .lead-text {
    font-size: 1.125rem;
    color: var(--text-secondary);
    max-width: 780px;
    margin: 0 auto 2rem;
  }
  .cta-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2.5rem;
  }
  .btn-primary {
    background: linear-gradient(135deg, #10b981, #059669);
    color: #fff;
    text-decoration: none;
    font-weight: 800;
    font-size: 1rem;
    padding: 0.85rem 1.85rem;
    border-radius: 0.85rem;
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35);
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(16, 185, 129, 0.45);
  }
  .btn-secondary {
    background: #1e293b;
    color: #e2e8f0;
    text-decoration: none;
    font-weight: 700;
    font-size: 1rem;
    padding: 0.85rem 1.85rem;
    border-radius: 0.85rem;
    border: 1px solid var(--card-border);
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: background 0.2s, border-color 0.2s;
  }
  .btn-secondary:hover {
    background: #334155;
    border-color: #475569;
  }

  /* CARDS GRID */
  .grid-2 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }
  .grid-3 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }
  .grid-4 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.25rem;
    margin-bottom: 3rem;
  }
  .card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 1.25rem;
    padding: 1.75rem;
    transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
  }
  .card:hover {
    transform: translateY(-3px);
    border-color: rgba(16, 185, 129, 0.5);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
  }
  .card-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
    display: inline-block;
  }
  .card-title {
    font-size: 1.2rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    color: #f1f5f9;
  }
  .card-desc {
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 1.25rem;
  }
  .card-link {
    color: var(--accent);
    font-weight: 700;
    font-size: 0.875rem;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }
  .card-link:hover {
    text-decoration: underline;
  }

  /* COMPARISON TABLE */
  .table-wrapper {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 1.25rem;
    overflow-x: auto;
    margin: 2rem 0 3rem;
  }
  table.comp-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 0.95rem;
  }
  table.comp-table th {
    padding: 1.25rem 1.5rem;
    background: #0f172a;
    font-weight: 800;
    border-bottom: 2px solid var(--card-border);
  }
  table.comp-table td {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--card-border);
    vertical-align: top;
  }
  table.comp-table tr:hover td {
    background: rgba(255, 255, 255, 0.02);
  }
  .check-icon { color: #34d399; font-weight: 900; }
  .cross-icon { color: #f87171; font-weight: 900; }

  /* ACCORDION FAQ */
  .faq-block {
    margin-bottom: 1.25rem;
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 1rem;
    padding: 1.25rem 1.5rem;
  }
  .faq-question {
    font-size: 1.05rem;
    font-weight: 800;
    color: #f8fafc;
    margin-bottom: 0.5rem;
  }
  .faq-answer {
    font-size: 0.925rem;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  /* FOOTER */
  footer {
    background: #070a12;
    border-top: 1px solid var(--card-border);
    padding: 3.5rem 0 2rem;
    margin-top: 5rem;
  }
  .footer-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin-bottom: 2.5rem;
  }
  .footer-col h4 {
    color: #fff;
    font-size: 0.95rem;
    font-weight: 800;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .footer-col ul {
    list-style: none;
  }
  .footer-col li {
    margin-bottom: 0.5rem;
  }
  .footer-col a {
    color: var(--text-muted);
    text-decoration: none;
    font-size: 0.85rem;
    transition: color 0.2s;
  }
  .footer-col a:hover {
    color: var(--accent);
  }
  .footer-bottom {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding-top: 2rem;
    border-top: 1px solid #1e293b;
    font-size: 0.8rem;
    color: var(--text-muted);
  }
`;

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 1. GENERATE STATIC PAGES FOR ALL 40 MODULES
function generateModulePages() {
  console.log(`Generating static pages for ${CURRICULA_MODULES.length} modules...`);

  CURRICULA_MODULES.forEach((mod) => {
    const modDir = path.join(publicDir, 'cursuri', mod.id);
    ensureDir(modDir);

    const canonicalUrl = `https://www.arkyedu.com/cursuri/${mod.id}/`;
    const appDeepLink = `https://www.arkyedu.com/?mission=${mod.id}`;

    // Normalize theory points
    const theorySections = (mod.theorySections || (mod as any).theory || []).map((sec: any) => {
      const heading = sec.title || sec.heading || '';
      const points = sec.content || sec.points || [];
      return { heading, points, tips: sec.tips };
    });

    // Normalize terms
    const terms = (mod.keyTerms || (mod as any).terms || []).map((t: any) => ({
      term: t.term || t.t || '',
      definition: t.definition || t.d || ''
    }));

    // Normalize FAQs
    const faqs = (mod.faqs || (mod as any).faq || []).map((f: any) => ({
      question: f.question || f.q || '',
      answer: f.answer || f.a || ''
    }));

    // Competencies
    const competencies = (mod.competencies || []).map((c: any) => ({
      code: c.code || '',
      description: c.description || c.desc || ''
    }));

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Course",
          "@id": `${canonicalUrl}#course`,
          "name": `${mod.title} — ${mod.grade}`,
          "description": mod.metaDescription,
          "provider": {
            "@type": "EducationalOrganization",
            "name": "ArkyEdu TIC",
            "url": "https://www.arkyedu.com/"
          },
          "educationalLevel": `${mod.grade} (Gimnaziu România)`,
          "inLanguage": "ro",
          "isAccessibleForFree": true,
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "RON"
          },
          "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "online",
            "courseWorkload": "PT2H"
          }
        },
        {
          "@type": "LearningResource",
          "name": `Fișă Didactică & Sinteză Teoretică: ${mod.shortTitle}`,
          "description": mod.metaDescription,
          "learningResourceType": "Lesson Plan",
          "isAccessibleForFree": true,
          "educationalAlignment": competencies.map(c => ({
            "@type": "AlignmentObject",
            "alignmentType": "educationalSubject",
            "targetName": `Competența ${c.code}: ${c.description}`
          }))
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Acasă", "item": "https://www.arkyedu.com/" },
            { "@type": "ListItem", "position": 2, "name": mod.grade, "item": `https://www.arkyedu.com/clasa-${mod.grade.includes('V-a') && !mod.grade.includes('VI') && !mod.grade.includes('VII') && !mod.grade.includes('VIII') ? '5' : mod.grade.includes('VI-a') ? '6' : mod.grade.includes('VII-a') ? '7' : '8'}/` },
            { "@type": "ListItem", "position": 3, "name": mod.shortTitle, "item": canonicalUrl }
          ]
        },
        ...(faqs.length > 0 ? [{
          "@type": "FAQPage",
          "mainEntity": faqs.map(f => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": f.answer
            }
          }))
        }] : [])
      ]
    };

    const gradeModules = CURRICULA_MODULES.filter((m) => m.grade === mod.grade);
    const modIndex = gradeModules.findIndex((m) => m.id === mod.id);
    const prevMod = modIndex > 0 ? gradeModules[modIndex - 1] : null;
    const nextMod = modIndex >= 0 && modIndex < gradeModules.length - 1 ? gradeModules[modIndex + 1] : null;
    const gradeSlug = mod.grade.includes('V-a') && !mod.grade.includes('VI') && !mod.grade.includes('VII') && !mod.grade.includes('VIII') ? '5' : mod.grade.includes('VI-a') ? '6' : mod.grade.includes('VII-a') ? '7' : '8';
    const directBlogMatches = BLOG_ARTICLES.filter((art) =>
      art.ro.internalLinks.some((lnk) => lnk.url.includes(`/cursuri/${mod.id}/`))
    );
    const fallbackBlogMatches = BLOG_ARTICLES.filter(
      (art) => !directBlogMatches.some((d) => d.id === art.id)
    ).slice(0, Math.max(0, 3 - directBlogMatches.length));
    const relatedBlogGuides = [...directBlogMatches, ...fallbackBlogMatches].slice(0, 3);

    const htmlContent = `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${mod.title} — ${mod.grade} | ArkyEdu TIC</title>
  <meta name="description" content="${mod.metaDescription.replace(/"/g, '&quot;')}">
  <meta name="keywords" content="${Array.isArray(mod.keywords) ? mod.keywords.join(', ') : (mod.keywords || '')}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="alternate" hreflang="ro" href="${canonicalUrl}">
  <link rel="alternate" hreflang="x-default" href="${canonicalUrl}">
  <link rel="help" type="text/markdown" href="/llms.txt">
  <link rel="sitemap" type="application/xml" href="/sitemap.xml">
  <link rel="alternate" type="application/rss+xml" title="ArkyEdu Blog &amp; Ghiduri TIC (RSS)" href="https://www.arkyedu.com/rss.xml">
  <meta name="theme-color" content="#090d16">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${mod.title} — ${mod.grade}">
  <meta property="og:description" content="${mod.metaDescription.replace(/"/g, '&quot;')}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="ArkyEdu TIC & Arcade">
  <meta property="og:locale" content="ro_RO">
  <meta property="og:locale:alternate" content="en_US">
  <meta property="og:image" content="https://www.arkyedu.com/og-cover.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${mod.title} — ${mod.grade}">
  <meta name="twitter:description" content="${mod.metaDescription.replace(/"/g, '&quot;')}">
  <meta name="twitter:image" content="https://www.arkyedu.com/og-cover.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>
  <style>
${commonStyles}
    .page-header { text-align: center; margin-bottom: 2.5rem; }
    .badge-bar { justify-content: center; margin-bottom: 1rem; }
    .content-box {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 1.25rem;
      padding: 2rem;
      margin-bottom: 2rem;
    }
    .content-box h2 {
      font-size: 1.5rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .content-box h3 {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--brand-cyan);
      margin: 1.25rem 0 0.5rem;
    }
    .content-box ul {
      margin-left: 1.5rem;
      margin-bottom: 1rem;
      color: var(--text-secondary);
    }
    .content-box li {
      margin-bottom: 0.4rem;
    }
    .pro-tip {
      background: rgba(16, 185, 129, 0.1);
      border-left: 4px solid var(--accent);
      padding: 1rem;
      border-radius: 0 0.75rem 0.75rem 0;
      font-size: 0.9rem;
      color: #34d399;
      margin: 1rem 0;
    }
    .terms-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    .term-card {
      background: #0f172a;
      border: 1px solid var(--card-border);
      border-radius: 0.75rem;
      padding: 1rem;
    }
    .term-title {
      font-weight: 800;
      color: #38bdf8;
      font-size: 0.95rem;
      margin-bottom: 0.25rem;
    }
  </style>
</head>
<body>
  <header>
    <div class="container header-content">
      <a href="https://www.arkyedu.com/" class="logo-box">
        <div class="logo-icon">🚀</div>
        <span class="logo-text">ArkyEdu <span style="color: var(--accent);">TIC</span></span>
      </a>
      <nav class="nav-links">
        <a href="https://www.arkyedu.com/clasa-5/">Clasa a V-a</a>
        <a href="https://www.arkyedu.com/clasa-6/">Clasa a VI-a</a>
        <a href="https://www.arkyedu.com/clasa-7/">Clasa a VII-a</a>
        <a href="https://www.arkyedu.com/clasa-8/">Clasa a VIII-a</a>
        <a href="https://www.arkyedu.com/blog/">Blog TIC</a>
        <a href="https://www.arkyedu.com/glosar/">Glosar (44)</a>
        <a href="https://www.arkyedu.com/arcade/">30 Jocuri Arcade</a>
        <a href="https://www.arkyedu.com/leonida/">Vice Leonida GTA 6</a>
        <a href="https://www.arkyedu.com/duel/">Duel 1v1 (21+)</a>
        <a href="https://www.arkyedu.com/educatie-tehnologie-copii/">Educație Tehnologie</a>
      </nav>
      <a href="${appDeepLink}" class="nav-cta">
        <span>🎮 Deschide Misiunea</span>
      </a>
    </div>
  </header>

  <main class="container" style="padding-top: 2.5rem;">
    <div class="page-header">
      <div class="badge-bar">
        <span class="badge">${mod.grade}</span>
        <span class="badge">${mod.unit}</span>
        <span class="badge badge-green">Curriculum Național 100% Gratuit</span>
      </div>
      <h1>${mod.title}</h1>
      <p class="lead-text">${mod.metaDescription}</p>
      
      <div class="cta-group">
        <a href="${appDeepLink}" class="btn-primary">
          <span>🚀 Lansează Laboratorul Interactiv Acum</span>
        </a>
        <a href="https://www.arkyedu.com/comparatie-scoli-private/" class="btn-secondary">
          <span>💡 Vezi De Ce Este 100% Gratuit</span>
        </a>
      </div>
    </div>

    <!-- TEORIE SI CONTINUT DIDACTIC -->
    <div class="content-box">
      <h2>📖 Ghid Didactic &amp; Sinteză Teoretică</h2>
      ${theorySections.map(sec => `
        <h3>${sec.heading}</h3>
        <ul>
          ${sec.points.map(p => `<li>${p}</li>`).join('')}
        </ul>
        ${sec.tips ? `<div class="pro-tip">💡 <strong>Sfat de la Profesor:</strong> ${sec.tips}</div>` : ''}
      `).join('')}
    </div>

    <!-- COMPETENTE CURRICULARE -->
    <div class="content-box">
      <h2>🎯 Competențe Specifice Oficiale (OMEN 3393/2017 &amp; OM 5420/2024)</h2>
      <ul>
        ${competencies.map(c => `
          <li><strong>Competența ${c.code}:</strong> ${c.description}</li>
        `).join('')}
      </ul>
    </div>

    <!-- VOCABULAR IT -->
    ${terms.length > 0 ? `
    <div class="content-box">
      <h2>💡 Glosar de Noțiuni IT &amp; Concepte Cheie</h2>
      <div class="terms-grid">
        ${terms.map(t => `
          <div class="term-card">
            <div class="term-title">${t.term}</div>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">${t.definition}</p>
          </div>
        `).join('')}
      </div>
    </div>` : ''}

    <!-- FAQ -->
    ${faqs.length > 0 ? `
    <div class="content-box">
      <h2>❓ Întrebări Frecvente &amp; Auto-Evaluare</h2>
      ${faqs.map(f => `
        <div class="faq-block">
          <div class="faq-question">Q: ${f.question}</div>
          <div class="faq-answer">R: ${f.answer}</div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- GHIDURI PRACTICE DIN BLOG CONECTATE LA ACEST MODUL -->
    <div class="content-box">
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
        <h2 style="margin-bottom: 0;">📚 Ghiduri Practice &amp; Rezolvări Erori (Blog TIC)</h2>
        <a href="https://www.arkyedu.com/blog/" class="card-link">Vezi toate cele 12 ghiduri →</a>
      </div>
      <div class="terms-grid">
        ${relatedBlogGuides.map(art => `
          <a href="https://www.arkyedu.com/blog/${art.ro.slug}/" class="term-card" style="display: block; text-decoration: none;">
            <div class="term-title">${escapeHtmlText(art.ro.breadcrumbLabel)} →</div>
            <p style="font-size: 0.84rem; color: var(--text-secondary); margin: 0;">${escapeHtmlText(art.ro.metaDescription)}</p>
          </a>
        `).join('')}
      </div>
    </div>

    <!-- TERMENI DIN GLOSARUL INTERACTIV CONECTATI -->
    ${(() => {
      const moduleGlossary = getGlossaryTermsForModule(mod.id);
      const fallbackGlossary = moduleGlossary.length > 0
        ? moduleGlossary
        : GLOSSARY_TERMS.filter(gt => gt.gradeTagRo === mod.grade).slice(0, 4);
      if (fallbackGlossary.length === 0) return '';
      return `
    <div class="content-box">
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
        <h2 style="margin-bottom: 0;">🔤 Termeni din Glosarul Bilingv TIC (Definiții &amp; Formule)</h2>
        <a href="https://www.arkyedu.com/glosar/" class="card-link">Deschide Glosarul A–Z (44 termeni) →</a>
      </div>
      <div class="terms-grid">
        ${fallbackGlossary.slice(0, 6).map(gt => `
          <a href="https://www.arkyedu.com/glosar/${gt.ro.slug}/" class="term-card" style="display: block; text-decoration: none;">
            <div class="term-title">${escapeHtmlText(gt.ro.term)} →</div>
            <p style="font-size: 0.84rem; color: var(--text-secondary); margin: 0;">${escapeHtmlText(gt.ro.shortAnswer)}</p>
          </a>
        `).join('')}
      </div>
    </div>`;
    })()}

    <!-- INTERNAL MODULE NAVIGATION (PREV / HUB / NEXT) -->
    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; margin: 2rem 0;">
      ${prevMod ? `<a href="https://www.arkyedu.com/cursuri/${prevMod.id}/" class="btn-secondary">← ${prevMod.shortTitle}</a>` : `<a href="https://www.arkyedu.com/clasa-${gradeSlug}/" class="btn-secondary">← Toate Lecțiile (${mod.grade})</a>`}
      <a href="https://www.arkyedu.com/clasa-${gradeSlug}/" class="card-link">📚 Hub ${mod.grade}</a>
      ${nextMod ? `<a href="https://www.arkyedu.com/cursuri/${nextMod.id}/" class="btn-secondary">${nextMod.shortTitle} →</a>` : `<a href="https://www.arkyedu.com/educatie-tehnologie-copii/" class="btn-secondary">Ghid Complet Copii →</a>`}
    </div>

    <!-- FINAL CTA BANNER -->
    <div class="hero-section" style="background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 1.5rem; padding: 3rem 1.5rem; margin-top: 2rem;">
      <h2 style="font-size: 1.75rem; margin-bottom: 0.75rem;">Gata de Provocare? Intră în Simulatorul Interactiv!</h2>
      <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto 1.5rem;">Fiecare nivel îți testează cunoștințele prin practică reală, audio feedback, provocări retro arcade și diplomă de merit oficială.</p>
      <a href="${appDeepLink}" class="btn-primary" style="font-size: 1.1rem; padding: 1rem 2.5rem;">
        🎮 Începe Modulul Acum — 100% Gratuit
      </a>
    </div>
  </main>

  <footer>
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h4>ArkyEdu TIC</h4>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem;">Platforma educațională gratuită nr. 1 pentru educație TIC, coding și robotică gimnaziu din România.</p>
          <a href="https://www.arkyedu.com/educatie-tehnologie-copii/" style="color: var(--accent); font-weight: 700;">Ghid Educație Tehnologie →</a>
        </div>
        <div class="footer-col">
          <h4>Clase Gimnaziu</h4>
          <ul>
            <li><a href="https://www.arkyedu.com/clasa-5/">TIC Clasa a V-a</a></li>
            <li><a href="https://www.arkyedu.com/clasa-6/">TIC Clasa a VI-a</a></li>
            <li><a href="https://www.arkyedu.com/clasa-7/">TIC Clasa a VII-a</a></li>
            <li><a href="https://www.arkyedu.com/clasa-8/">TIC Clasa a VIII-a</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Arcade &amp; Competiții</h4>
          <ul>
            <li><a href="https://www.arkyedu.com/arcade/">30 Jocuri Didactice Arcade</a></li>
            <li><a href="https://www.arkyedu.com/leonida/">Vice Leonida GTA 6 Open-World</a></li>
            <li><a href="https://www.arkyedu.com/duel/">Arena Dueluri 1v1 (21+ Moduri)</a></li>
            <li><a href="https://www.arkyedu.com/profesor/">Portal Profesori &amp; Catalog</a></li>
            <li><a href="https://www.arkyedu.com/oras/">Arkedo Smart City IoT</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Comparație &amp; Legal</h4>
          <ul>
            <li><a href="https://www.arkyedu.com/comparatie-scoli-private/">ArkyEdu vs Cursuri Private</a></li>
            <li><a href="https://www.arkyedu.com/blog/">Blog &amp; Ghiduri TIC (RO/EN)</a></li>
            <li><a href="https://www.arkyedu.com/glosar/">Glosar Bilingv TIC (44 Termeni A–Z)</a></li>
            <li><a href="https://www.arkyedu.com/sitemap.xml">Harta Site-ului (Sitemap)</a></li>
            <li><a href="https://www.arkyedu.com/rss.xml">Feed RSS Blog</a></li>
            <li><a href="https://www.arkyedu.com/llms.txt">Documentație AI (LLMs)</a></li>
            <li><a href="mailto:contact@arkyedu.com">contact@arkyedu.com</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div>© 2026 ArkyEdu — Platformă Educațională Gratuită. Aliniată programei Ministerului Educației.</div>
        <div>Fără reclame • Fără abonamente • 100% Educație Digitală Românească</div>
      </div>
    </div>
  </footer>
</body>
</html>`;

    fs.writeFileSync(path.join(modDir, 'index.html'), htmlContent, 'utf-8');
  });

  console.log(`All ${CURRICULA_MODULES.length} static module pages generated.`);
}

// 2. GENERATE GRADE HUBS (Clasa 5, 6, 7, 8)
function generateGradeHubs() {
  const grades = [
    {
      num: '5',
      roman: 'V',
      title: 'TIC Clasa a V-a: Manual Interactiv, Hardware, Windows & Scratch Gratuit',
      meta: 'Ghid curricular complet TIC Clasa a 5-a: Arhitectura calculatorului, sisteme de operare, organizarea fișierelor, internet și siguranță online, tehnoredactare Word și programare vizuală Scratch.',
      keywords: 'tic clasa 5, informatica clasa a v-a, manual tic clasa 5, hardware calculator clasa 5, scratch 3.0 clasa 5, editoare text word clasa 5, sistem de operare windows foldere',
      modules: CURRICULA_MODULES.filter(m => m.grade === 'Clasa a V-a')
    },
    {
      num: '6',
      roman: 'VI',
      title: 'TIC Clasa a VI-a: Prezentări PowerPoint, Modelare 3D, Securitate Cibernetică & Algoritmi',
      meta: 'Ghid curricular complet TIC Clasa a 6-a: Diapozitive PowerPoint, animații, modelare Paint 3D, securitate cibernetică, malware, phishing, e-mail și bucle condiționate în Scratch.',
      keywords: 'tic clasa 6, informatica clasa a vi-a, prezentari powerpoint clasa 6, securitate cibernetica malware clasa 6, paint 3d clasa 6, algoritmi bucle scratch clasa 6, neticheta email',
      modules: CURRICULA_MODULES.filter(m => m.grade === 'Clasa a VI-a')
    },
    {
      num: '7',
      roman: 'VII',
      title: 'TIC Clasa a VII-a: Tehnoredactare Word, Audio WavePad, Video VideoPad, C++ Code::Blocks & Robotică',
      meta: 'Ghid curricular complet TIC Clasa a 7-a: Tehnoredactare avansată Word, studio audio WavePad, montaj video VideoPad, Google Docs & Slides colaborativ, GIS, programare C++ Code::Blocks și robotică cu senzori.',
      keywords: 'tic clasa 7, informatica clasa a vii-a, programare c++ clasa 7, code blocks c++, wavepad audio tic clasa 7, videopad video clasa 7, robotica virtuala senzori clasa 7, bucle while c++',
      modules: CURRICULA_MODULES.filter(m => m.grade === 'Clasa a VII-a')
    },
    {
      num: '8',
      roman: 'VIII',
      title: 'TIC Clasa a VIII-a: Calcul Tabelar Excel, Google Sites, Algoritmi C++, Robotică Arduino Uno & IoT Smart Home',
      meta: 'Ghid curricular complet TIC Clasa a 8-a: Foi de calcul Excel, formule SUM/AVERAGE/IF, diagrame 2D/3D, Google Sites, algoritmi structurați C++, microcontrollere Arduino Uno și proiect integrator Smart Home IoT.',
      keywords: 'tic clasa 8, informatica clasa a viii-a, calcul tabelar excel clasa 8, formule excel functii, google sites clasa 8, c++ switch siruri fibonacci clasa 8, robotica arduino uno clasa 8, smart home iot gimnaziu',
      modules: CURRICULA_MODULES.filter(m => m.grade === 'Clasa a VIII-a')
    }
  ];

  grades.forEach(g => {
    const hubDir = path.join(publicDir, `clasa-${g.num}`);
    ensureDir(hubDir);

    const canonicalUrl = `https://www.arkyedu.com/clasa-${g.num}/`;
    const appGradeLink = `https://www.arkyedu.com/?grade=grade${g.num}`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Course",
          "@id": `${canonicalUrl}#course`,
          "name": g.title,
          "description": g.meta,
          "provider": {
            "@type": "EducationalOrganization",
            "name": "ArkyEdu TIC",
            "url": "https://www.arkyedu.com/"
          },
          "educationalLevel": `Clasa a ${g.roman}-a Gimnaziu`,
          "inLanguage": "ro",
          "isAccessibleForFree": true,
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "RON" },
          "hasCourseInstance": { "@type": "CourseInstance", "courseMode": "online" }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Acasă", "item": "https://www.arkyedu.com/" },
            { "@type": "ListItem", "position": 2, "name": `Clasa a ${g.roman}-a`, "item": canonicalUrl }
          ]
        },
        {
          "@type": "ItemList",
          "name": `Module TIC Clasa a ${g.roman}-a — ArkyEdu`,
          "itemListElement": g.modules.map((m, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": m.title,
            "url": `https://www.arkyedu.com/cursuri/${m.id}/`
          }))
        }
      ]
    };

    const htmlContent = `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${g.title} | ArkyEdu TIC</title>
  <meta name="description" content="${g.meta}">
  <meta name="keywords" content="${g.keywords}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="alternate" hreflang="ro" href="${canonicalUrl}">
  <link rel="alternate" hreflang="x-default" href="${canonicalUrl}">
  <meta name="theme-color" content="#090d16">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${g.title}">
  <meta property="og:description" content="${g.meta}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="ArkyEdu TIC & Arcade">
  <meta property="og:locale" content="ro_RO">
  <meta property="og:image" content="https://www.arkyedu.com/og-cover.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${g.title}">
  <meta name="twitter:description" content="${g.meta}">
  <meta name="twitter:image" content="https://www.arkyedu.com/og-cover.png">
  <link rel="alternate" type="application/rss+xml" title="ArkyEdu Blog &amp; Ghiduri TIC (RSS)" href="https://www.arkyedu.com/rss.xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>
  <style>
${commonStyles}
  </style>
</head>
<body>
  <header>
    <div class="container header-content">
      <a href="https://www.arkyedu.com/" class="logo-box">
        <div class="logo-icon">🚀</div>
        <span class="logo-text">ArkyEdu <span style="color: var(--accent);">Clasa a ${g.roman}-a</span></span>
      </a>
      <nav class="nav-links">
        <a href="https://www.arkyedu.com/clasa-5/">Clasa 5</a>
        <a href="https://www.arkyedu.com/clasa-6/">Clasa 6</a>
        <a href="https://www.arkyedu.com/clasa-7/">Clasa 7</a>
        <a href="https://www.arkyedu.com/clasa-8/">Clasa 8</a>
        <a href="https://www.arkyedu.com/blog/">Blog TIC</a>
        <a href="https://www.arkyedu.com/glosar/">Glosar (44)</a>
        <a href="https://www.arkyedu.com/sandbox/">Sandbox Cod</a>
        <a href="https://www.arkyedu.com/arcade/">Arcade (29)</a>
        <a href="https://www.arkyedu.com/duel/">Duel 1v1</a>
        <a href="https://www.arkyedu.com/educatie-tehnologie-copii/">Ghid Copii</a>
      </nav>
      <a href="${appGradeLink}" class="nav-cta">
        <span>🎮 Deschide Catalogul Clasa a ${g.roman}-a</span>
      </a>
    </div>
  </header>

  <main class="container">
    <div class="hero-section">
      <div class="badge-bar">
        <span class="badge">Programa Națională OMEN 3393/2017 &amp; OM 5420/2024</span>
        <span class="badge badge-green">${g.modules.length} Module Didactice Interactive</span>
        <span class="badge badge-free">100% Gratuit — Fără Abonament</span>
      </div>
      <h1>${g.title}</h1>
      <p class="lead-text">${g.meta}</p>
      
      <div class="cta-group">
        <a href="${appGradeLink}" class="btn-primary">
          <span>🚀 Deschide Aplicația &amp; Începe Lecțiile</span>
        </a>
        <a href="https://www.arkyedu.com/comparatie-scoli-private/" class="btn-secondary">
          <span>⚖️ Compară cu Școlile Private de Coding</span>
        </a>
      </div>
    </div>

    <!-- MODULES GRID -->
    <h2 style="font-size: 1.75rem; margin-bottom: 1.5rem; text-align: center;">Module Curriculare Interactive — Clasa a ${g.roman}-a</h2>
    <div class="grid-2">
      ${g.modules.map(mod => `
        <div class="card">
          <div class="card-icon">${mod.icon || '💻'}</div>
          <h3 class="card-title">${mod.title}</h3>
          <p class="card-desc">${mod.metaDescription}</p>
          <div style="display: flex; gap: 1rem; align-items: center;">
            <a href="https://www.arkyedu.com/cursuri/${mod.id}/" class="card-link">Citește Teoria &amp; Fisa Didactică →</a>
            <a href="https://www.arkyedu.com/?mission=${mod.id}" style="font-size: 0.85rem; background: rgba(16, 185, 129, 0.2); color: #34d399; padding: 0.35rem 0.75rem; border-radius: 0.5rem; text-decoration: none; font-weight: 700;">Lansează Misiunea 🚀</a>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- BLOG STUDY GUIDES CONNECTED TO THIS GRADE -->
    <section aria-label="Ghiduri Practice din Blog pentru Clasa a ${g.roman}-a" style="margin-top: 2.5rem;">
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem;">
        <h2 style="font-size: 1.45rem;">📚 Ghiduri Practice &amp; Rezolvări din Blog pentru Clasa a ${g.roman}-a</h2>
        <a href="https://www.arkyedu.com/blog/" class="card-link">Toate cele 12 ghiduri →</a>
      </div>
      <div class="grid-2">
        ${BLOG_ARTICLES.filter(art =>
          art.ro.internalLinks.some(lnk => g.modules.some(m => lnk.url.includes(`/cursuri/${m.id}/`))) ||
          art.gradeTagRo.includes(g.roman)
        ).slice(0, 4).map(art => `
          <div class="card">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--brand-cyan); margin-bottom: 0.35rem;">${escapeHtmlText(art.ro.categoryLabel)} · ${escapeHtmlText(art.gradeTagRo)}</div>
            <h3 class="card-title" style="font-size: 1.1rem;">${escapeHtmlText(art.ro.breadcrumbLabel)}</h3>
            <p class="card-desc">${escapeHtmlText(art.ro.metaDescription)}</p>
            <div style="display: flex; gap: 1rem; align-items: center;">
              <a href="https://www.arkyedu.com/blog/${art.ro.slug}/" class="card-link">Citește în Română →</a>
              <a href="https://www.arkyedu.com/blog/en/${art.en.slug}/" style="font-size: 0.82rem; color: var(--text-secondary); text-decoration: none;">English Guide →</a>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- GLOSSARY TERMS CONNECTED TO THIS GRADE -->
    <section aria-label="Termeni din Glosar pentru Clasa a ${g.roman}-a" style="margin-top: 2.5rem;">
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem;">
        <h2 style="font-size: 1.45rem;">🔤 Termeni Esențiali din Glosarul TIC — Clasa a ${g.roman}-a</h2>
        <a href="https://www.arkyedu.com/glosar/" class="card-link">Toți cei 44 de termeni A–Z →</a>
      </div>
      <div class="grid-3">
        ${GLOSSARY_TERMS.filter(gt => gt.grades.includes(g.num as any)).slice(0, 6).map(gt => `
          <div class="card">
            <div style="font-size: 0.75rem; font-weight: 700; color: var(--brand-cyan); margin-bottom: 0.35rem;">${escapeHtmlText(gt.gradeTagRo)}</div>
            <h3 class="card-title" style="font-size: 1.02rem;">${escapeHtmlText(gt.ro.term)}</h3>
            <p class="card-desc" style="font-size: 0.86rem;">${escapeHtmlText(gt.ro.shortAnswer)}</p>
            <div style="display: flex; gap: 0.85rem; align-items: center; flex-wrap: wrap;">
              <a href="https://www.arkyedu.com/glosar/${gt.ro.slug}/" class="card-link">Definiție &amp; Exemplu →</a>
              <a href="https://www.arkyedu.com/glosar/en/${gt.en.slug}/" style="font-size: 0.78rem; color: var(--text-secondary); text-decoration: none;">EN →</a>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- VALUE PROPOSITION -->
    <div class="hero-section" style="background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 1.5rem; padding: 3rem 1.5rem; margin-top: 2rem;">
      <h2 style="font-size: 1.85rem; margin-bottom: 1rem;">De Ce Învață Elevii Mai Bine cu ArkyEdu?</h2>
      <p style="color: var(--text-secondary); max-width: 750px; margin: 0 auto 2rem;">Spre deosebire de cursurile private scumpe (care cer 400 - 600 lei/lună și folosesc platforme străine), ArkyEdu este creat de profesori din România exact pe manualele școlare aprobate de Ministerul Educației, oferind 30 de jocuri arcade, peste 21 de dueluri 1v1 și diplome de merit oficiale, 100% gratuit!</p>
      <div class="cta-group">
        <a href="${appGradeLink}" class="btn-primary">Exersează Acum Clasa a ${g.roman}-a</a>
        <a href="https://www.arkyedu.com/arcade/" class="btn-secondary">Vezi Cele 30 de Jocuri Arcade</a>
      </div>
    </div>
  </main>

  <footer>
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h4>ArkyEdu TIC</h4>
          <p style="color: var(--text-muted); font-size: 0.85rem;">Platformă educațională 100% gratuită dedicată elevilor și profesorilor de gimnaziu din România.</p>
        </div>
        <div class="footer-col">
          <h4>Gimnaziu</h4>
          <ul>
            <li><a href="https://www.arkyedu.com/clasa-5/">Clasa a V-a</a></li>
            <li><a href="https://www.arkyedu.com/clasa-6/">Clasa a VI-a</a></li>
            <li><a href="https://www.arkyedu.com/clasa-7/">Clasa a VII-a</a></li>
            <li><a href="https://www.arkyedu.com/clasa-8/">Clasa a VIII-a</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Arcade &amp; Duel</h4>
          <ul>
            <li><a href="https://www.arkyedu.com/arcade/">30 Jocuri Arcade Didactice</a></li>
            <li><a href="https://www.arkyedu.com/leonida/">Vice Leonida GTA 6 Open-World</a></li>
            <li><a href="https://www.arkyedu.com/duel/">Arena Dueluri 1v1 (21+ Moduri)</a></li>
            <li><a href="https://www.arkyedu.com/blog/">Blog &amp; Ghiduri TIC (RO/EN)</a></li>
            <li><a href="https://www.arkyedu.com/glosar/">Glosar Bilingv TIC (44 Termeni A–Z)</a></li>
            <li><a href="https://www.arkyedu.com/sandbox/">Sandbox Cod Live (C++ / Python 3 / HTML5)</a></li>
            <li><a href="https://www.arkyedu.com/comparatie-scoli-private/">ArkyEdu vs Școli Private</a></li>
            <li><a href="https://www.arkyedu.com/educatie-tehnologie-copii/">Educație Tehnologie Copii</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div>© 2026 ArkyEdu. Conform manualelor școlare Art Klett, Litera, EDP.</div>
        <div>Fără taxe • Fără reclame • 100% Gratuit</div>
      </div>
    </div>
  </footer>
</body>
</html>`;

    fs.writeFileSync(path.join(hubDir, 'index.html'), htmlContent, 'utf-8');
  });

  console.log('All 4 Grade Hubs generated.');
}

// 3. GENERATE COMPARISON LANDING PAGE (ArkyEdu vs Scoli Private de Programare)
function generateComparisonPage() {
  const compDir = path.join(publicDir, 'comparatie-scoli-private');
  ensureDir(compDir);

  const canonicalUrl = 'https://www.arkyedu.com/comparatie-scoli-private/';

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        "name": "ArkyEdu vs Școli Private de Programare (Logiscool, MindHub, Academia Micilor Developeri): Cursuri TIC Gratuite Copii",
        "description": "Comparație completă între ArkyEdu (platformă 100% gratuită de TIC și programare gimnaziu) și școlile private de programare (Logiscool, MindHub, etc.). Economisește peste 4.500 lei/an cu un curriculum aliniat la școală.",
        "url": canonicalUrl,
        "inLanguage": "ro"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "De ce este ArkyEdu 100% gratuit, în timp ce școlile private cer 400 - 600 lei/lună?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "ArkyEdu a fost dezvoltat ca o resursă educațională deschisă non-profit pentru elevii și profesorii din România, pentru a garanta accesul egal la educație digitală modernă fără bariere financiare. Nu percepem taxe, abonamente și nu avem reclame."
            }
          },
          {
            "@type": "Question",
            "name": "Cum ajută ArkyEdu elevul la notele de la școală și la examene?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Spre deosebire de cursurile private cu programe proprii paralele, ArkyEdu este sincronizat 100% cu programa școlară oficială (OMEN 3393/2017 & OM 5420/2024) și manualele naționale (Art Klett, Litera, EDP). Elevul învață exact ce se predă în clasă: Word, Excel, PowerPoint, C++, Scratch, HTML și Arduino, obținând cu ușurință note de 10."
            }
          },
          {
            "@type": "Question",
            "name": "Ce tehnologii și limbaje de programare sunt incluse?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Platforma include Scratch 3.0, limbajul C++ (mediul Code::Blocks, sintaxă nativă, bucle while/for, algoritmi de numere prime, Fibonacci și vectori), HTML5 semantic, calcul tabelar avansat în Microsoft Excel & Google Sheets, simulatoare de circuite Arduino Uno cu senzori (LDR, PIR, Ultrasonic HC-SR04, Gaz MQ-2, ecran LCD 1602 I2C, servomotoare SG90), 30 de jocuri arcade didactice (incl. Vice Leonida Open-World GTA 6) și 21+ dueluri 1v1."
            }
          },
          {
            "@type": "Question",
            "name": "Copilul primește diplomă la finalul modulelor?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Da! Fiecare modul oferă la absolvirea examenului final o Diplomă Oficială de Onoare TIC descărcabilă și imprimabilă în format de înaltă rezoluție, cu nota obținută pe baremul de evaluare de la 1 la 10 și cod unic de verificare."
            }
          }
        ]
      }
    ]
  };

  const htmlContent = `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ArkyEdu vs Școli Private de Programare (Logiscool, MindHub): Cursuri TIC &amp; Coding 100% Gratuite | ArkyEdu</title>
  <meta name="description" content="Comparație obiectivă: De ce să plătești 4.000 - 6.000 lei/an pe cursuri private de coding copii când ArkyEdu oferă TIC &amp; programare completă pentru gimnaziu 100% GRATUIT, aliniat la programa școlară oficială?">
  <meta name="keywords" content="cursuri programare copii preturi, alternative gratuite logiscool, cursuri mindhub pret, academia micilor developeri alternativa gratuita, cursuri it copii bucuresti gratuit, invatare programare copii gimnaziu, tic clasa 5 6 7 8 gratuit, robotica arduino copii gratis">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="alternate" hreflang="ro" href="${canonicalUrl}">
  <link rel="alternate" hreflang="x-default" href="${canonicalUrl}">
  <meta name="theme-color" content="#090d16">
  <meta property="og:type" content="article">
  <meta property="og:title" content="ArkyEdu vs Școli Private de Programare: 100% Gratuit vs 4.800 lei/an">
  <meta property="og:description" content="Comparație detaliată: Învață programare, robotică, Excel și web design conform programei școlare din România fără taxe și fără abonamente.">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="ArkyEdu TIC & Arcade">
  <meta property="og:locale" content="ro_RO">
  <meta property="og:image" content="https://www.arkyedu.com/og-cover.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="ArkyEdu vs Școli Private de Programare: 100% Gratuit vs 4.800 lei/an">
  <meta name="twitter:description" content="Comparație detaliată: Învață programare, robotică, Excel și web design conform programei școlare din România fără taxe.">
  <meta name="twitter:image" content="https://www.arkyedu.com/og-cover.png">
  <link rel="alternate" type="application/rss+xml" title="ArkyEdu Blog &amp; Ghiduri TIC (RSS)" href="https://www.arkyedu.com/rss.xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>
  <style>
${commonStyles}
    .badge-diff {
      padding: 0.25rem 0.65rem;
      border-radius: 0.5rem;
      font-size: 0.8rem;
      font-weight: 800;
    }
    .badge-win { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }
    .badge-loss { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); }
  </style>
</head>
<body>
  <header>
    <div class="container header-content">
      <a href="https://www.arkyedu.com/" class="logo-box">
        <div class="logo-icon">🚀</div>
        <span class="logo-text">ArkyEdu <span style="color: var(--accent);">vs Cursuri Private</span></span>
      </a>
      <nav class="nav-links">
        <a href="https://www.arkyedu.com/clasa-5/">Clasa 5</a>
        <a href="https://www.arkyedu.com/clasa-6/">Clasa 6</a>
        <a href="https://www.arkyedu.com/clasa-7/">Clasa 7</a>
        <a href="https://www.arkyedu.com/clasa-8/">Clasa 8</a>
        <a href="https://www.arkyedu.com/blog/">Blog TIC</a>
        <a href="https://www.arkyedu.com/arcade/">30 Jocuri Arcade</a>
        <a href="https://www.arkyedu.com/duel/">Duel 1v1</a>
      </nav>
      <a href="https://www.arkyedu.com/" class="nav-cta">
        <span>🎮 Intră în Aplicație — 0 Lei</span>
      </a>
    </div>
  </header>

  <main class="container">
    <div class="hero-section">
      <div class="badge-bar">
        <span class="badge badge-free">Economie de 4.500+ Lei pe An Școlar</span>
        <span class="badge badge-green">100% Curricular Național OMEN 3393/2017</span>
        <span class="badge">Tehnologie Reală în Browser</span>
      </div>
      <h1>ArkyEdu vs Școli Private de Programare pentru Copii</h1>
      <p class="lead-text">
        Părinții din România cheltuie între <strong>4.000 și 6.000 lei pe an</strong> pe cursuri private precum Logiscool, MindHub sau Academia Micilor Developeri. Iată de ce <strong>ArkyEdu oferă o pregătire superioară, direct conectată la notele de la școală, 100% GRATUIT</strong>.
      </p>

      <div class="cta-group">
        <a href="https://www.arkyedu.com/" class="btn-primary">
          <span>🚀 Începe Acum Gratuit — Fără Card Bancar</span>
        </a>
        <a href="https://www.arkyedu.com/arcade/" class="btn-secondary">
          <span>🕹️ Descoperă Cele 30 Jocuri Arcade</span>
        </a>
      </div>
    </div>

    <!-- COMPARISON MATRIX -->
    <div class="table-wrapper">
      <table class="comp-table">
        <thead>
          <tr>
            <th style="width: 25%;">Criteriu de Comparație</th>
            <th style="width: 38%; color: #34d399; background: #064e3b20;">🚀 ArkyEdu (Platformă Educațională Gratuită)</th>
            <th style="width: 37%; color: #94a3b8;">🏫 Școli Private de Coding (Logiscool, MindHub etc.)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Cost Anual &amp; Taxe</strong></td>
            <td>
              <span class="badge-diff badge-win">0 LEI (100% GRATUIT)</span><br>
              Fără abonamente lunare, fără plată semestrială, fără costuri ascunse. Acces egal pentru orice elev din România.
            </td>
            <td>
              <span class="badge-diff badge-loss">4.000 – 6.000 LEI / AN</span><br>
              Abonamente de 400 – 600 lei/lună sau 2.100 – 2.300 lei/semestru, greu accesibile multor familii.
            </td>
          </tr>
          <tr>
            <td><strong>Conexiunea cu Programa Școlară (TIC Gimnaziu)</strong></td>
            <td>
              <span class="check-icon">✓ 100% ALINIAT LA ȘCOALĂ</span><br>
              Urmează strict programa oficială a Ministerului Educației (OMEN 3393/2017 &amp; OM 5420/2024) și manualele Art Klett, Litera, EDP. Pregătește elevul direct pentru nota 10 la clasă și olimpiade.
            </td>
            <td>
              <span class="cross-icon">✗ CURRICULUM PROPRIETAR PARALEL</span><br>
              Programe generice internaționale, adesea deconectate de cerințele profesorilor de la școală (nu acoperă Word, Excel tabelar avansat sau manualele românești).
            </td>
          </tr>
          <tr>
            <td><strong>Flexibilitate &amp; Program</strong></td>
            <td>
              <span class="check-icon">✓ ACCES NELIMITAT 24/7</span><br>
              Elevul exersează în ritmul propriu, când dorește, de pe laptop, PC, tabletă sau telefon. Nu depinde de orare fixe sau navetă prin trafic.
            </td>
            <td>
              <span class="cross-icon">✗ 1 ȘEDINȚĂ FIXĂ PE SĂPTĂMÂNĂ</span><br>
              Doar 60 - 90 minute/săptămână. Dacă elevul lipsește sau e bolnav, ședința este adesea pierdută sau greu de recuperat.
            </td>
          </tr>
          <tr>
            <td><strong>Tehnologii &amp; Limbaje Reale</strong></td>
            <td>
              <span class="check-icon">✓ C++, ARDUINO IoT, EXCEL, WEB</span><br>
              Interpretor și depanator C++ real (Code::Blocks), simulatoare Arduino cu senzori fizici (LDR, PIR, Ultrasonic HC-SR04, Gaz MQ-2, LCD 1602), HTML5 și Excel cu formule avansate.
            </td>
            <td>
              <span class="cross-icon">✗ PLATFORME ÎNCHISE / SIMPLIFICATE</span><br>
              Multe academii țin elevii luni de zile pe blocuri vizuale simplificate înainte de a trece la cod real sau cer achiziționarea de kituri hardware scumpe.
            </td>
          </tr>
          <tr>
            <td><strong>Gamificare &amp; Imersiune</strong></td>
            <td>
              <span class="check-icon">✓ 30 JOCURI RETRO &amp; OPEN-WORLD ARCADE</span><br>
              Vice Leonida Open-World Story (GTA 6), Cyber Runner, Cyber Pac-Man, Cyber Arkanoid, Cyber Frogger, Cyber Sokoban, Cyber Asteroids, Circuit Master 80s, Redstone Logic, PC Builder etc.
            </td>
            <td>
              <span class="cross-icon">✗ EXERCIȚII REPETITIVE DE BAZĂ</span><br>
              Gamificarea se limitează adesea la badge-uri simple în portaluri web statice.
            </td>
          </tr>
          <tr>
            <td><strong>Competiții Tehnologice &amp; Dueluri</strong></td>
            <td>
              <span class="check-icon">✓ ARENĂ DUELURI 1V1 (21+ MODURI LIVE)</span><br>
              Vice Leonida 1v1 (GTA 6), Cyber Battleship 1v1, File-Drop Attack Tetris, System Sabotage, C++ Code Racer, Binary Clash, Circuit Clash — confruntări multiplayer între elevi sau cu AI Cyber-Bot.
            </td>
            <td>
              <span class="cross-icon">✗ CONCURSURI RARE CU TAXĂ</span><br>
              Evenimentele competitive sunt organizate rar și presupun taxe suplimentare de înscriere.
            </td>
          </tr>
          <tr>
            <td><strong>Diplome de Merit &amp; Evaluare</strong></td>
            <td>
              <span class="check-icon">✓ DIPLOME OFICIALE CU NOTĂ (1-10)</span><br>
              Generare automată a diplomei PDF de înaltă rezoluție, cu barem didactic oficial, număr de puncte XP și semnătură digitală.
            </td>
            <td>
              <span class="cross-icon">✗ DIPLOME GENERICE DE PARTICIPARE</span><br>
              Certificate standard fără notare curriculară corelată cu sistemul de învățământ din România.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- FAQ SECTION -->
    <div class="content-box" style="background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 1.25rem; padding: 2.5rem; margin-bottom: 3rem;">
      <h2 style="font-size: 1.65rem; margin-bottom: 1.5rem;">❓ Întrebări Frecvente ale Părinților și Profesorilor</h2>
      
      <div class="faq-block">
        <div class="faq-question">1. Chiar este complet gratuit? Există vreo taxă ascunsă sau reclame?</div>
        <div class="faq-answer">
          Absolut deloc! ArkyEdu este o inițiativă educațională deschisă non-profit. Nu există conturi premium plătite, nu există reclame și nu cerem niciodată date de card bancar. Toți elevii și profesorii au acces egal la toate cele 40 de module didactice, simulatoarele hardware, cele 30 de jocuri arcade și 21+ dueluri 1v1.
        </div>
      </div>

      <div class="faq-block">
        <div class="faq-question">2. Copilul meu are nevoie de un calculator performant de gaming?</div>
        <div class="faq-answer">
          Nu! ArkyEdu rulează 100% în browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari) pe orice calculator de birou, laptop, tabletă sau telefon mobil obișnuit. Simulatoarele noastre de robotică Arduino și C++ sunt optimizate să ruleze fluid chiar și pe calculatoare școlare mai vechi.
        </div>
      </div>

      <div class="faq-block">
        <div class="faq-question">3. Cum poate folosi profesorul de TIC platforma la clasă?</div>
        <div class="faq-answer">
          Profesorii au la dispoziție modulul dedicat <strong>Portal Profesor &amp; Catalog Digital</strong> (<a href="https://www.arkyedu.com/profesor/" style="color: var(--accent);">arkyedu.com/profesor</a>), unde pot genera coduri de clasă, urmări progresul elevilor, consulta baremele didactice oficiale și exporta notele direct pentru catalogul școlar.
        </div>
      </div>
    </div>

    <!-- PARENTS & TEACHERS GUIDES FROM BLOG -->
    <section style="margin-bottom: 3rem;">
      <h2 style="font-size: 1.55rem; margin-bottom: 1.25rem; text-align: center;">📚 Ghiduri Utile pentru Părinți &amp; Profesori</h2>
      <div class="grid-2">
        <div class="card">
          <h3 class="card-title">Coding gratuit vs. școli private (Ghid Părinți)</h3>
          <p class="card-desc">Harta competențelor 10–15 ani și rutina de 2×30 min/săptămână acasă fără abonament de 5.000 lei/an.</p>
          <a href="https://www.arkyedu.com/blog/cursuri-programare-copii-gratuit-vs-academii-private-logiscool/" class="card-link">Citește ghidul complet →</a>
        </div>
        <div class="card">
          <h3 class="card-title">Alegerea laptopului / PC-ului pentru școală</h3>
          <p class="card-desc">Specificații reale (CPU, 16 GB RAM, SSD NVMe, ergonomie) fără să plătești inutil pe marketing.</p>
          <a href="https://www.arkyedu.com/blog/alegere-laptop-pc-scoala-gimnaziu-ram-ssd-cpu-componente/" class="card-link">Vezi recomandările →</a>
        </div>
      </div>
    </section>

    <!-- FINAL CALL TO ACTION -->
    <div class="hero-section" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15)); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 1.5rem; padding: 3.5rem 1.5rem;">
      <h2 style="font-size: 2rem; margin-bottom: 1rem;">Începe Educația Digitală a Copilului Tău Fără Să Plătești Mii de Lei</h2>
      <p style="color: var(--text-secondary); max-width: 650px; margin: 0 auto 2rem;">Alătură-te miilor de elevi și profesori care folosesc deja ArkyEdu pentru nota 10 la TIC, robotică și coding!</p>
      <a href="https://www.arkyedu.com/" class="btn-primary" style="font-size: 1.15rem; padding: 1.1rem 2.5rem;">
        🚀 Lansează ArkyEdu Gratuit
      </a>
    </div>
  </main>

  <footer>
    <div class="container">
      <div class="footer-bottom" style="border: none; padding-top: 0;">
        <div>© 2026 ArkyEdu. Alternativa gratuită și de înaltă performanță pentru educația digitală din România.</div>
        <div><a href="https://www.arkyedu.com/" style="color: var(--accent);">Acasă</a> • <a href="https://www.arkyedu.com/blog/" style="color: var(--accent);">Blog &amp; Ghiduri TIC</a> • <a href="https://www.arkyedu.com/sitemap.xml" style="color: var(--accent);">Sitemap</a></div>
      </div>
    </div>
  </footer>
</body>
</html>`;

  fs.writeFileSync(path.join(compDir, 'index.html'), htmlContent, 'utf-8');
  console.log('Comparison Landing Page generated.');
}

// 4. GENERATE ARCADE, DUEL, PROFESOR, ORAS HUBS (WITH RICH CARDS & SCHEMA.ORG)
function generateFeatureHubs() {
  const hubs = [
    {
      dir: 'arcade',
      title: 'Arcade TIC: 30 Jocuri Retro & GTA 6 Open-World | ArkyEdu',
      meta: 'Colecție completă de 30 mini-jocuri arcade și open-world gratuite pentru educație TIC și coding copii: Vice Leonida Open-World Story (GTA 6), Cyber Runner, Cyber Pac-Man, Cyber Arkanoid, Frogger, Sokoban, Circuit Master 80s & PC Builder.',
      keywords: 'jocuri arcade tic, vice leonida gta 6 joc, gta 6 open world browser educativ, jocuri educative programare copii, cyber pacman tic, cyber arkanoid firewall, cyber frogger retea, cyber sokoban servere, circuit master 80s, redstone logic simulator, pc builder simulator',
      h1: 'Arcade Didactic TIC: 30 de Jocuri Retro &amp; Vice Leonida Open-World (GTA 6)',
      appLink: 'https://www.arkyedu.com/#arcade',
      sectionTitle: 'Catalog Complet: Cele 30 de Mini-Jocuri Educative Arcade',
      cards: [
        { icon: '🗺️', title: 'Vice Leonida: Open-World Story (GTA 6 Sandbox 2D)', desc: 'Explorează liber toate cele 6 regiuni din Statul Leonida (Vice City, Leonida Keys, Port Gellhorn, Grassrivers, Mount Kalaga, Ambrosia) cu Lucia & Jason, 5 vehicule + Hydro-Airboat, poliție VCPD 1★–5★ și misiuni TIC!', href: 'https://www.arkyedu.com/leonida/' },
        { icon: '🌴', title: 'Vice Leonida VI: Cyber Runner (GTA 6 Tech)', desc: 'Traversează 4 sectoare din Statul Leonida (Vice Beach, Venetian Causeway, Port Gellhorn, Grassrivers Airboat) cu Lucia Caminos & Jason Duval, Nitro, EMP și hack-uri binare pe 4 biți.', href: 'https://www.arkyedu.com/arcade/vice-leonida-gta6/' },
        { icon: '🟡', title: 'Cyber Pac-Man: Labirintul Biților', desc: 'Colectează pachete de date pe placa de bază și activează scutul antivirus răspunzând fulger la întrebări TIC.' },
        { icon: '🧱', title: 'Cyber Arkanoid: Firewall Breaker', desc: 'Distrugere blocuri criptate cu lasere, capsule multi-ball și fizică 60 FPS pentru consolidarea logicii.' },
        { icon: '🐸', title: 'Cyber Frogger: Traversarea Rețelei', desc: 'Navighează pachetele IP prin benzi de trafic LAN/WAN și canale de fibră optică fără coliziuni malware.' },
        { icon: '🤖', title: 'Cyber Sokoban: Inginerul de Servere', desc: 'Puzzle algoritmic de optimizare și împingere servere/baterii pe rack-uri în Data Center.' },
        { icon: '☄️', title: 'Cyber Asteroids: Reactorul Vectorial', desc: 'Pilotaj vectorial cu inerție și distrugere de meteoriți binari și viruși în spațiul cibernetic.' },
        { icon: '🚀', title: 'Cyber Invaders: Galaxia Codului', desc: 'Shooter arcade retro împotriva valurilor de bug-uri de compilare și amenințări de rețea.' },
        { icon: '⚡', title: 'Circuit Master 80s (Arduino & Smart City)', desc: 'Cablare breadboard, Legea lui Ohm (V=I·R), multitasking millis() și grila Smart City IoT.' },
        { icon: '⛏️', title: 'Redstone Logic Lab & Voxel Architect', desc: 'Porți logice AND, OR, NOT, XOR și construcție 3D creativă în stil Minecraft pentru gimnaziu.' },
        { icon: '🔧', title: 'PC Builder, File-Drop & Virus Sweeper', desc: 'Asamblare PC pas cu pas (CPU, RAM, GPU, SSD), sortare extensii tip Tetris și detecție malware.' },
        { icon: '⌨️', title: 'Tastare Rapidă (WPM), Mouse Pro & Binary', desc: 'Antrenament tastare oarbă QWERTY cu diacritice românești, dexteritate periferice și conversii binare.' }
      ],
      faqs: [
        { q: 'Sunt cele 30 de jocuri arcade aliniate la materia școlară de TIC?', a: 'Da! Fiecare joc arcade consolidează noțiuni exacte din programa claselor V–VIII: biți și conversii binare pe 4/8 biți (inclusiv în Vice Leonida Open-World & Cyber Runner), extensii de fișiere, porți logice, componente PC, securitate cibernetică, sintaxă C++ și robotică Arduino.' },
        { q: 'Se pot juca gratuit pe telefon, tabletă sau calculator școlar?', a: 'Da, toate cele 30 de jocuri rulează direct în browser (desktop & touch mobil) fără instalare și fără reclame, fiind bilingve (Română și Engleză).' }
      ]
    },
    {
      dir: 'duel',
      title: 'Arena Dueluri TIC 1v1: 21+ Competiții Live & Vice Leonida GTA 6 | ArkyEdu',
      meta: 'Confruntări live multiplayer 1v1 între elevi sau cu AI Cyber-Bot: Vice Leonida 1v1 (GTA 6 Cyber-Heist), Cyber Battleship 1v1, File-Drop Attack Tetris Pro, System Sabotage, Cyber Clash Royale, C++ Code Racer & Binary Clash.',
      keywords: 'dueluri tic 1v1, vice leonida 1v1 gta 6, cyber heist 1v1, competitii tehnologice scolare, cyber battleship 1v1, file drop attack tetris, system sabotage 1v1, binary clash 1v1, circuit clash arduino, c++ code racer',
      h1: 'Arena Dueluri TIC 1v1: Peste 21 de Competiții Tehnologice Live',
      appLink: 'https://www.arkyedu.com/#duel',
      sectionTitle: 'Moduri Populare de Duel 1v1 (Live Cloud PvP & AI Cyber-Bot)',
      cards: [
        { icon: '🌴', title: 'Vice Leonida 1v1: Cyber-Heist Showdown (GTA 6)', desc: 'Cursă competitivă până la 2.500 puncte Vault pe autostrada Vice Beach cu Lucia & Jason, Boost Gates TIC și 4 sabotaje live: Drone 3★, Glitch, Throttle și Firewall Lock.', href: 'https://www.arkyedu.com/duel/vice-leonida-1v1/' },
        { icon: '⚓', title: 'Cyber Battleship 1v1 (Bătălie Navală 10×10)', desc: '5 nave cibernetice + 2 Mine EMP, Railgun, Scanare Sonar 3×3, Bombă Cluster +, Torpile H/V și Nano-Reparație cu Scut.' },
        { icon: '🧱', title: 'File-Drop Attack 1v1 (Tetris Pro)', desc: 'SRS Wall-Kicks, T-Spin, Back-to-Back și atacuri live DDoS, Overclock x2.2, Scramble & Defrag Purge.' },
        { icon: '🛸', title: 'System Sabotage 1v1 (Stil Among Us)', desc: 'Repară 8 sisteme ale navei înaintea rivalului și declanșează sabotaje live: Stinge Lumina, Adware, Criogenare, Meltdown.' },
        { icon: '👑', title: 'Cyber Clash Royale 1v1', desc: 'Strategie în timp real pe 2 benzi cu turnuri defensive, energie tactică și unități de atac cibernetic.' },
        { icon: '💻', title: 'C++ Code Racer & Binary Clash 1v1', desc: 'Depanare algoritmi C++17 contra cronometru și conversii zecimal-binar pe 8 biți cu bonus de streak.' },
        { icon: '🔌', title: 'Circuit Clash & Network Packet Racer', desc: 'Cablare senzori Arduino Uno Smart City fără scurtcircuit și rutare pachete pe porturi HTTPS/DNS/SSH.' }
      ],
      faqs: [
        { q: 'Cum se pot duela elevii 1v1 de pe calculatoare diferite sau pe același ecran?', a: 'Fiecare duel permite crearea unei camere private cu cod unic din 4 caractere (sincronizată în timp real prin cloud) sau antrenament solo contra AI Cyber-Bot.' },
        { q: 'Contribuie duelurile 1v1 la punctajul elevului?', a: 'Da, victoriile sunt înregistrate în profilul elevului (puncte XP și trofee pe fiecare mod) și pot fi vizualizate în clasamentele școlare.' }
      ]
    },
    {
      dir: 'profesor',
      title: 'Portal Profesor TIC: Catalog Digital, Bareme Oficiale & Notare Automată | ArkyEdu',
      meta: 'Instrument didactic gratuit pentru profesori de informatică și TIC: catalog digital, evaluare automată pe bareme 1–10, urmărire progres elevi, export PDF și conformitate OMEN 3393/2017 & OM 5420/2024.',
      keywords: 'catalog digital tic, portal profesor informatica, bareme didactice tic gimnaziu, fise de lucru tic clasa 5 6 7 8, omen 3393 2017 manual art klett, platforma gratuita profesori tic',
      h1: 'Portalul Profesorului de TIC: Resurse Didactice & Catalog Digital',
      appLink: 'https://www.arkyedu.com/#profesor',
      sectionTitle: 'Funcționalități Dedicate Profesorilor de Informatică și TIC',
      cards: [
        { icon: '📊', title: 'Catalog Digital & Evaluare 1–10', desc: 'Calcul automat al mediilor și notelor de la 1 la 10 pe baza baremelor oficiale pentru toate cele 40 de module.' },
        { icon: '🏫', title: 'Management Multi-Școală & GDPR', desc: 'Izolare sigură pe școli și clase, coduri rapide de acces pentru elevi și protecție totală a datelor minorilor.' },
        { icon: '📄', title: 'Export Condică & Diplome Oficiale', desc: 'Export rapid în format imprimabil PDF / foaie de calcul și verificare diplome de merit cu cod unic.' },
        { icon: '🎮', title: 'Control Laborator & Misiuni Arcade', desc: 'Posibilitate de activare sau blocare temporară a jocurilor arcade în timpul testelor și orelor de curs.' }
      ],
      faqs: [
        { q: 'Este Portalul Profesorului gratuit pentru școlile de stat și private?', a: 'Da, 100% gratuit pentru orice cadru didactic de Informatică și TIC din România și din străinătate, fără limită de elevi sau clase.' },
        { q: 'Cum se aliniează evaluările la programa Ministerului Educației?', a: 'Fiecare modul acoperă competențele specifice din OMEN 3393/2017 și OM 5420/2024, manualele Art Klett 2025, Litera și EDP.' }
      ]
    },
    {
      dir: 'oras',
      title: 'Arkedo Smart City: Laborator Interactiv IoT, Robotică & Sisteme Inteligente | ArkyEdu',
      meta: 'Simulator interactiv de oraș inteligent (Smart City) pentru clasa a VIII-a: iluminat public LDR+PIR PWM, barieră parcare cu servomotor SG90, alertă gaze MQ-2, ecran LCD 1602 I2C și stație meteo Arduino IoT.',
      keywords: 'smart city tic clasa 8, simulator iot arduino, laborator robotica orase inteligente, proiect integrator clasa 8 art klett pag 99 108, arduino uno copii',
      h1: 'Arkedo Smart City: Laborator Interactiv IoT & Robotică Urbană',
      appLink: 'https://www.arkyedu.com/#oras',
      sectionTitle: 'Subsisteme Smart City & Robotică Arduino Integrate',
      cards: [
        { icon: '💡', title: 'Iluminat Stradal Inteligent (LDR + PIR + PWM)', desc: 'Aprindere automată la lăsarea serii și modulare PWM la detectarea mișcării pietonilor pentru economie de energie.' },
        { icon: '🚧', title: 'Barieră Parcare Automată (HC-SR04 + SG90)', desc: 'Măsurarea distanței cu senzor ultrasonic și acționarea precisă a servomotorului cu afișaj locuri libere.' },
        { icon: '🚨', title: 'Senzor Gaz MQ-2 & Ecran LCD 1602 I2C', desc: 'Monitorizare continuă a calității aerului cu praguri de alertă, buzzer piezo și mesaje de stare pe I2C.' },
        { icon: '🏙️', title: 'Orașul Digital al Elevului (ByteCoins & Upgrade)', desc: 'Elevii își construiesc propriul oraș tehnologic cu recompensele obținute din lecțiile de TIC.' }
      ],
      faqs: [
        { q: 'Este nevoie de kit fizic Arduino pentru a folosi Arkedo Smart City?', a: 'Nu! Toți senzorii, conexiunile și logica de control (inclusiv multitasking cu millis()) sunt simulate interactiv direct în browser.' }
      ]
    }
  ];

  hubs.forEach(h => {
    const hubDir = path.join(publicDir, h.dir);
    ensureDir(hubDir);

    const canonicalUrl = `https://www.arkyedu.com/${h.dir}/`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": `${canonicalUrl}#webpage`,
          "name": h.title,
          "description": h.meta,
          "url": canonicalUrl,
          "inLanguage": ["ro", "en"],
          "isPartOf": { "@id": "https://www.arkyedu.com/#website" }
        },
        {
          "@type": "ItemList",
          "name": h.sectionTitle,
          "itemListElement": h.cards.map((c, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": c.title,
            "description": c.desc
          }))
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Acasă", "item": "https://www.arkyedu.com/" },
            { "@type": "ListItem", "position": 2, "name": h.h1, "item": canonicalUrl }
          ]
        },
        ...(h.faqs.length > 0 ? [{
          "@type": "FAQPage",
          "mainEntity": h.faqs.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        }] : [])
      ]
    };

    const htmlContent = `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${h.title}</title>
  <meta name="description" content="${h.meta}">
  <meta name="keywords" content="${h.keywords}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="alternate" hreflang="ro" href="${canonicalUrl}">
  <link rel="alternate" hreflang="x-default" href="${canonicalUrl}">
  <meta name="theme-color" content="#090d16">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${h.title}">
  <meta property="og:description" content="${h.meta}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="ArkyEdu TIC & Arcade">
  <meta property="og:locale" content="ro_RO">
  <meta property="og:image" content="https://www.arkyedu.com/og-cover.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${h.title}">
  <meta name="twitter:description" content="${h.meta}">
  <meta name="twitter:image" content="https://www.arkyedu.com/og-cover.png">
  <link rel="alternate" type="application/rss+xml" title="ArkyEdu Blog &amp; Ghiduri TIC (RSS)" href="https://www.arkyedu.com/rss.xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>
  <style>
${commonStyles}
  </style>
</head>
<body>
  <header>
    <div class="container header-content">
      <a href="https://www.arkyedu.com/" class="logo-box">
        <div class="logo-icon">🚀</div>
        <span class="logo-text">ArkyEdu <span style="color: var(--accent);">${h.dir.toUpperCase()}</span></span>
      </a>
      <nav class="nav-links">
        <a href="https://www.arkyedu.com/clasa-5/">Clasa 5</a>
        <a href="https://www.arkyedu.com/clasa-6/">Clasa 6</a>
        <a href="https://www.arkyedu.com/clasa-7/">Clasa 7</a>
        <a href="https://www.arkyedu.com/clasa-8/">Clasa 8</a>
        <a href="https://www.arkyedu.com/blog/">Blog TIC</a>
        <a href="https://www.arkyedu.com/sandbox/">Sandbox Cod</a>
        <a href="https://www.arkyedu.com/arcade/">Arcade (30)</a>
        <a href="https://www.arkyedu.com/leonida/">Vice Leonida GTA 6</a>
        <a href="https://www.arkyedu.com/duel/">Duel 1v1</a>
        <a href="https://www.arkyedu.com/educatie-tehnologie-copii/">Ghid Copii</a>
      </nav>
      <a href="${h.appLink}" class="nav-cta">
        <span>🎮 Lansează ${h.dir.toUpperCase()}</span>
      </a>
    </div>
  </header>

  <main class="container">
    <div class="hero-section">
      <div class="badge-bar">
        <span class="badge badge-green">100% Interactiv în Browser</span>
        <span class="badge badge-free">0 Lei — Fără Înregistrare Obligatorie</span>
        <span class="badge">Bilingv RO / EN</span>
      </div>
      <h1>${h.h1}</h1>
      <p class="lead-text">${h.meta}</p>
      <div class="cta-group">
        <a href="${h.appLink}" class="btn-primary">
          <span>🚀 Deschide Simulatorul Live</span>
        </a>
        <a href="https://www.arkyedu.com/comparatie-scoli-private/" class="btn-secondary">
          <span>⚖️ Vezi Comparația cu Cursurile Private</span>
        </a>
      </div>
    </div>

    <section aria-labelledby="hub-section-title">
      <h2 id="hub-section-title" style="font-size: 1.75rem; margin-bottom: 1.5rem; text-align: center;">${h.sectionTitle}</h2>
      <div class="grid-2">
        ${h.cards.map((c: { icon: string; title: string; desc: string; href?: string }) => `
          <div class="card">
            <div class="card-icon">${c.icon}</div>
            <h3 class="card-title">${c.title}</h3>
            <p class="card-desc">${c.desc}</p>
            <a href="${c.href || h.appLink}" class="card-link">${c.href ? 'Detalii &amp; Lansează Jocul →' : 'Lansează în Aplicație →'}</a>
          </div>
        `).join('')}
      </div>
    </section>

    <section style="margin-bottom: 2.5rem;">
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem;">
        <h2 style="font-size: 1.4rem;">📚 Ghiduri Practice din Blog Conectate cu ${h.dir.toUpperCase()}</h2>
        <a href="https://www.arkyedu.com/blog/" class="card-link">Toate cele 12 ghiduri →</a>
      </div>
      <div class="grid-2">
        ${(h.dir === 'profesor'
          ? BLOG_ARTICLES.filter(a => ['ghid-profesor-tic-catalog-digital-olimpiada-gimnaziu', 'inteligenta-artificiala-chatgpt-scoala-gimnaziu'].includes(a.id))
          : h.dir === 'oras'
          ? BLOG_ARTICLES.filter(a => ['proiect-arduino-smart-home-gimnaziu-senzori-millis', 'primul-site-web-clasa-8-html5-https-google-sites'].includes(a.id))
          : BLOG_ARTICLES.filter(a => ['erori-cpp-gimnaziu-if-while-algoritmi-cifre', 'siguranta-copii-tiktok-roblox-discord-phishing-2fa'].includes(a.id))
        ).map(art => `
          <div class="card">
            <h3 class="card-title" style="font-size: 1.1rem;">${escapeHtmlText(art.ro.breadcrumbLabel)}</h3>
            <p class="card-desc">${escapeHtmlText(art.ro.metaDescription)}</p>
            <a href="https://www.arkyedu.com/blog/${art.ro.slug}/" class="card-link">Citește ghidul complet →</a>
          </div>
        `).join('')}
      </div>
    </section>

    ${h.faqs.length > 0 ? `
    <section style="background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 1.25rem; padding: 2rem; margin-bottom: 3rem;">
      <h2 style="font-size: 1.5rem; margin-bottom: 1.25rem;">❓ Întrebări Frecvente</h2>
      ${h.faqs.map(f => `
        <div class="faq-block">
          <div class="faq-question">${f.q}</div>
          <div class="faq-answer">${f.a}</div>
        </div>
      `).join('')}
    </section>` : ''}
  </main>

  <footer>
    <div class="container">
      <div class="footer-bottom" style="border: none;">
        <div>© 2026 ArkyEdu TIC. 100% Gratuit pentru educație digitală.</div>
        <div><a href="https://www.arkyedu.com/" style="color: var(--accent);">Acasă</a> • <a href="https://www.arkyedu.com/blog/" style="color: var(--accent);">Blog &amp; Ghiduri TIC</a> • <a href="https://www.arkyedu.com/educatie-tehnologie-copii/" style="color: var(--accent);">Educație Tehnologie Copii</a> • <a href="https://www.arkyedu.com/sitemap.xml" style="color: var(--accent);">Sitemap</a></div>
      </div>
    </div>
  </footer>
</body>
</html>`;

    fs.writeFileSync(path.join(hubDir, 'index.html'), htmlContent, 'utf-8');
  });

  console.log('Feature Hubs (arcade, duel, profesor, oras) generated with rich cards & JSON-LD.');
}

// 5. GENERATE PILLAR LANDING PAGE (/educatie-tehnologie-copii/)
function generateTechEducationPillar() {
  const dirPath = path.join(publicDir, 'educatie-tehnologie-copii');
  ensureDir(dirPath);

  const canonicalUrl = 'https://www.arkyedu.com/educatie-tehnologie-copii/';
  const title = 'Educație TIC, Programare & Tehnologie pentru Copii (10–15 Ani) | ArkyEdu';
  const description = 'Ghid complet și gratuit de educație digitală, TIC, programare Scratch & C++, Excel, web design și robotică Arduino pentru copii (clasele V–VIII).';
  const keywords = 'educatie copii tehnologie, educatie tic gimnaziu, educatie digitala copii romania, cursuri programare copii gratuit, invatare tehnologie copii, coding copii 10 15 ani, robotica copii online, alternativa gratuita logiscool';

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${canonicalUrl}#article`,
        "headline": "Educație TIC, Programare și Tehnologie pentru Copii în România (Ghid Complet V–VIII)",
        "description": description,
        "author": { "@type": "Organization", "name": "ArkyEdu" },
        "publisher": {
          "@type": "EducationalOrganization",
          "name": "ArkyEdu",
          "logo": { "@type": "ImageObject", "url": "https://www.arkyedu.com/pwa-512x512.png" }
        },
        "inLanguage": ["ro", "en"],
        "mainEntityOfPage": canonicalUrl
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Acasă", "item": "https://www.arkyedu.com/" },
          { "@type": "ListItem", "position": 2, "name": "Educație Tehnologie Copii", "item": canonicalUrl }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "La ce vârstă poate începe un copil educația TIC și programarea pe ArkyEdu?",
            "acceptedAnswer": { "@type": "Answer", "text": "Platforma este optimizată pentru copii între 10 și 15 ani (clasele V–VIII), începând de la noțiuni vizuale (hardware, fișiere, siguranță online, Scratch 3.0) și avansând progresiv spre C++, Excel, Web Design și robotică Arduino IoT." }
          },
          {
            "@type": "Question",
            "name": "Cum contribuie jocurile educative și duelurile 1v1 la educația tehnologică a copiilor?",
            "acceptedAnswer": { "@type": "Answer", "text": "Cele 30 de jocuri arcade (Vice Leonida Open-World Story & Cyber Runner GTA 6 Tech, Cyber Pac-Man, Cyber Arkanoid, Sokoban, Circuit Master 80s, Redstone Logic) și peste 21 de dueluri 1v1 transformă algoritmica, rețelele, securitatea cibernetică și electronica în provocări interactive cu feedback imediat." }
          }
        ]
      }
    ]
  };

  const htmlContent = `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="${keywords}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="alternate" hreflang="ro" href="${canonicalUrl}">
  <link rel="alternate" hreflang="en" href="https://www.arkyedu.com/?lang=en">
  <link rel="alternate" hreflang="x-default" href="${canonicalUrl}">
  <meta name="theme-color" content="#090d16">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="ArkyEdu TIC & Arcade">
  <meta property="og:locale" content="ro_RO">
  <meta property="og:locale:alternate" content="en_US">
  <meta property="og:image" content="https://www.arkyedu.com/og-cover.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="https://www.arkyedu.com/og-cover.png">
  <link rel="alternate" type="application/rss+xml" title="ArkyEdu Blog &amp; Ghiduri TIC (RSS)" href="https://www.arkyedu.com/rss.xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>
  <style>
${commonStyles}
  </style>
</head>
<body>
  <header>
    <div class="container header-content">
      <a href="https://www.arkyedu.com/" class="logo-box">
        <div class="logo-icon">🚀</div>
        <span class="logo-text">ArkyEdu <span style="color: var(--accent);">EDUCAȚIE DIGITALĂ</span></span>
      </a>
      <nav class="nav-links">
        <a href="https://www.arkyedu.com/clasa-5/">Clasa 5</a>
        <a href="https://www.arkyedu.com/clasa-6/">Clasa 6</a>
        <a href="https://www.arkyedu.com/clasa-7/">Clasa 7</a>
        <a href="https://www.arkyedu.com/clasa-8/">Clasa 8</a>
        <a href="https://www.arkyedu.com/blog/">Blog TIC</a>
        <a href="https://www.arkyedu.com/sandbox/">Sandbox Cod</a>
        <a href="https://www.arkyedu.com/arcade/">Arcade (30)</a>
        <a href="https://www.arkyedu.com/leonida/">Vice Leonida GTA 6</a>
        <a href="https://www.arkyedu.com/duel/">Duel 1v1</a>
      </nav>
      <a href="https://www.arkyedu.com/" class="nav-cta">
        <span>🎮 Intră în Platformă</span>
      </a>
    </div>
  </header>

  <main class="container">
    <div class="hero-section">
      <div class="badge-bar">
        <span class="badge badge-green">Educație Digitală &amp; TIC (10–15 Ani)</span>
        <span class="badge badge-free">100% Gratuit &amp; Fără Reclame</span>
        <span class="badge">Bilingv Română / Engleză</span>
      </div>
      <h1>Educație TIC, Programare &amp; Tehnologie pentru Copii</h1>
      <p class="lead-text">Traseu complet de alfabetizare digitală, gândire algoritmică, programare C++/Scratch, birotică modernă, securitate cibernetică și robotică Arduino — aliniat 100% programei școlare românești și manualelor aprobate.</p>
      <div class="cta-group">
        <a href="https://www.arkyedu.com/" class="btn-primary">🚀 Începe Gratuit în Browser</a>
        <a href="https://www.arkyedu.com/comparatie-scoli-private/" class="btn-secondary">⚖️ ArkyEdu vs Școli Private</a>
      </div>
    </div>

    <h2 style="font-size: 1.75rem; margin-bottom: 1.5rem; text-align: center;">Traseul Tehnologic pe Etape de Vârstă (Clasele V – VIII)</h2>
    <div class="grid-2">
      <div class="card">
        <div class="card-icon">🖥️</div>
        <h3 class="card-title">Clasa a V-a (10–11 ani): Fundamente &amp; Scratch 3.0</h3>
        <p class="card-desc">Arhitectura calculatorului, sisteme de operare, siguranță online, Word și primele jocuri algoritmice în Scratch 3.0.</p>
        <a href="https://www.arkyedu.com/clasa-5/" class="card-link">Vezi Cele 6 Module Clasa a V-a →</a>
      </div>
      <div class="card">
        <div class="card-icon">🛡️</div>
        <h3 class="card-title">Clasa a VI-a (11–12 ani): Multimedia, 3D &amp; Cyber Security</h3>
        <p class="card-desc">Prezentări PowerPoint, Paint 3D, animație VR, protecție împotriva malware și phishing, netichetă și bucle în Scratch.</p>
        <a href="https://www.arkyedu.com/clasa-6/" class="card-link">Vezi Cele 8 Module Clasa a VI-a →</a>
      </div>
      <div class="card">
        <div class="card-icon">⚙️</div>
        <h3 class="card-title">Clasa a VII-a (12–13 ani): Audio-Video, GIS &amp; C++</h3>
        <p class="card-desc">Tehnoredactare avansată Word, WavePad, VideoPad, hărți digitale GIS, inițiere în C++ (Code::Blocks) și roboți virtuali.</p>
        <a href="https://www.arkyedu.com/clasa-7/" class="card-link">Vezi Cele 12 Module Clasa a VII-a →</a>
      </div>
      <div class="card">
        <div class="card-icon">🤖</div>
        <h3 class="card-title">Clasa a VIII-a (13–15 ani): Excel, Web, C++ &amp; Arduino IoT</h3>
        <p class="card-desc">Calcul tabelar Excel, Web Design HTML5 &amp; Google Sites, algoritmi avansați C++ și proiect Smart Home IoT pe Arduino Uno.</p>
        <a href="https://www.arkyedu.com/clasa-8/" class="card-link">Vezi Cele 14 Module Clasa a VIII-a →</a>
      </div>
    </div>

    <div class="grid-3">
      <div class="card">
        <div class="card-icon">🕹️</div>
        <h3 class="card-title">29 Jocuri Arcade Retro</h3>
        <p class="card-desc">Vice Leonida VI (GTA 6 Tech), Cyber Pac-Man, Cyber Arkanoid, Frogger, Sokoban, Circuit Master 80s, Redstone Logic și PC Builder.</p>
        <a href="https://www.arkyedu.com/arcade/" class="card-link">Explorează Arcade →</a>
      </div>
      <div class="card">
        <div class="card-icon">⚔️</div>
        <h3 class="card-title">Arena Dueluri 1v1 (21+ Moduri)</h3>
        <p class="card-desc">Vice Leonida 1v1 (GTA 6), Cyber Battleship, File-Drop Attack Tetris, System Sabotage, C++ Code Racer și Binary Clash live sau cu AI Bot.</p>
        <a href="https://www.arkyedu.com/duel/" class="card-link">Intră în Arenă →</a>
      </div>
      <div class="card">
        <div class="card-icon">🎓</div>
        <h3 class="card-title">Portal Profesori &amp; Diplome 1–10</h3>
        <p class="card-desc">Catalog digital GDPR multi-școală, notare automată pe bareme oficiale și diplome imprimabile pentru elevi.</p>
        <a href="https://www.arkyedu.com/profesor/" class="card-link">Vezi Portalul Profesorului →</a>
      </div>
    </div>

    <section style="margin-top: 2.5rem; margin-bottom: 2.5rem;">
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem;">
        <h2 style="font-size: 1.55rem;">📖 Ghiduri Esențiale din Blogul ArkyEdu (RO &amp; EN)</h2>
        <a href="https://www.arkyedu.com/blog/" class="card-link">Deschide toate cele 12 ghiduri →</a>
      </div>
      <div class="grid-2">
        ${BLOG_ARTICLES.filter(a => a.featured).slice(0, 4).map(art => `
          <div class="card">
            <h3 class="card-title" style="font-size: 1.1rem;">${escapeHtmlText(art.ro.breadcrumbLabel)}</h3>
            <p class="card-desc">${escapeHtmlText(art.ro.metaDescription)}</p>
            <a href="https://www.arkyedu.com/blog/${art.ro.slug}/" class="card-link">Citește ghidul complet →</a>
          </div>
        `).join('')}
      </div>
    </section>

    <section style="margin-top: 2rem; margin-bottom: 2.5rem;">
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
        <h2 style="font-size: 1.45rem;">🔤 Glosar Bilingv Informatică &amp; TIC (44 Termeni Esențiali V–VIII)</h2>
        <a href="https://www.arkyedu.com/glosar/" class="card-link">Deschide Glosarul A–Z →</a>
      </div>
      <div class="grid-3">
        ${GLOSSARY_TERMS.slice(0, 3).map(gt => `
          <div class="card">
            <h3 class="card-title" style="font-size: 1.05rem;">${escapeHtmlText(gt.ro.term)}</h3>
            <p class="card-desc">${escapeHtmlText(gt.ro.shortAnswer)}</p>
            <a href="https://www.arkyedu.com/glosar/${gt.ro.slug}/" class="card-link">Vezi definiția →</a>
          </div>
        `).join('')}
      </div>
    </section>
  </main>

  <footer>
    <div class="container">
      <div class="footer-bottom" style="border: none;">
        <div>© 2026 ArkyEdu — Platforma #1 Gratuită de Educație TIC &amp; Coding pentru Copii.</div>
        <div><a href="https://www.arkyedu.com/" style="color: var(--accent);">Acasă</a> • <a href="https://www.arkyedu.com/blog/" style="color: var(--accent);">Blog &amp; Ghiduri TIC</a> • <a href="https://www.arkyedu.com/glosar/" style="color: var(--accent);">Glosar TIC (44)</a> • <a href="https://www.arkyedu.com/llms.txt" style="color: var(--accent);">llms.txt</a> • <a href="https://www.arkyedu.com/sitemap.xml" style="color: var(--accent);">Sitemap</a></div>
      </div>
    </div>
  </footer>
</body>
</html>`;

  fs.writeFileSync(path.join(dirPath, 'index.html'), htmlContent, 'utf-8');
  console.log('Pillar Landing Page (/educatie-tehnologie-copii/) generated.');
}

function escapeHtmlText(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const blogBaseStyles = `
    .breadcrumb {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.45rem;
      font-size: 0.82rem;
      color: #cbd5e1;
      margin: 1.5rem 0 1.25rem;
    }
    .breadcrumb a { color: #5eead4; text-decoration: none; font-weight: 600; }
    .breadcrumb a:hover { text-decoration: underline; }
    .article-wrap { max-width: 860px; margin: 0 auto; padding-bottom: 3rem; }
    .meta-line { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: #cbd5e1; margin-bottom: 0.85rem; }
    .meta-accent { color: #5eead4; font-weight: 700; }
    .article-h1 {
      font-size: 2rem;
      font-weight: 800;
      line-height: 1.2;
      color: #ffffff;
      background: none;
      -webkit-text-fill-color: #ffffff;
      text-align: left;
      margin-bottom: 1rem;
    }
    @media (min-width: 768px) { .article-h1 { font-size: 2.45rem; } }
    .article-intro { font-size: 1.08rem; color: #cbd5e1; line-height: 1.7; margin-bottom: 1.75rem; }
    .tldr-box {
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(45, 212, 191, 0.4);
      border-radius: 0.9rem;
      padding: 1.35rem 1.5rem;
      margin-bottom: 1.75rem;
    }
    .tldr-title { font-size: 0.9rem; font-weight: 800; color: #5eead4; margin-bottom: 0.45rem; }
    .tldr-text { font-size: 0.98rem; color: #f1f5f9; line-height: 1.65; }
    .toc-box {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 0.9rem;
      padding: 1.25rem 1.5rem;
      margin-bottom: 2.25rem;
    }
    .toc-title { font-size: 0.95rem; font-weight: 700; color: #ffffff; margin-bottom: 0.75rem; }
    .toc-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.5rem 1.25rem; padding-left: 1.2rem; font-size: 0.9rem; }
    .toc-list a { color: #cbd5e1; text-decoration: none; }
    .toc-list a:hover { color: #5eead4; text-decoration: underline; }
    .art-section { margin-bottom: 2.5rem; scroll-margin-top: 5.5rem; }
    .art-section h2 { font-size: 1.45rem; font-weight: 800; color: #ffffff; margin-bottom: 0.85rem; line-height: 1.3; }
    .art-section p { font-size: 1rem; color: #e2e8f0; line-height: 1.72; margin-bottom: 0.85rem; }
    .art-section ul, .art-section ol { padding-left: 1.4rem; margin-bottom: 1rem; color: #e2e8f0; line-height: 1.7; }
    .art-section li { margin-bottom: 0.45rem; }
    .code-box {
      background: #020617;
      border: 1px solid #1e293b;
      border-radius: 0.85rem;
      overflow: hidden;
      margin: 1.15rem 0;
    }
    .code-head { padding: 0.65rem 1rem; background: #0f172a; border-bottom: 1px solid #1e293b; font-size: 0.82rem; font-weight: 700; color: #e2e8f0; display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; }
    .code-box pre { padding: 1rem; overflow-x: auto; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.86rem; line-height: 1.6; color: #a7f3d0; }
    .code-cap { padding: 0.55rem 1rem; border-top: 1px solid #1e293b; font-size: 0.8rem; color: #cbd5e1; background: rgba(15, 23, 42, 0.5); }
    .table-wrap { overflow-x: auto; border: 1px solid #1e293b; border-radius: 0.85rem; margin: 1.15rem 0; background: #0f172a; }
    table.seo-tbl { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem; }
    table.seo-tbl caption { padding: 0.7rem 1rem; text-align: left; font-size: 0.8rem; font-weight: 700; color: #cbd5e1; border-bottom: 1px solid #1e293b; }
    table.seo-tbl th { padding: 0.75rem 1rem; font-weight: 700; color: #ffffff; background: rgba(2, 6, 23, 0.7); border-bottom: 1px solid #1e293b; }
    table.seo-tbl td { padding: 0.75rem 1rem; color: #e2e8f0; border-bottom: 1px solid rgba(30, 41, 59, 0.7); vertical-align: top; }
    .callout-tip, .callout-warn {
      border-radius: 0.85rem;
      padding: 1.1rem 1.25rem;
      margin: 1rem 0;
    }
    .callout-tip { background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(45, 212, 191, 0.35); }
    .callout-warn { background: rgba(69, 26, 3, 0.25); border: 1px solid rgba(245, 158, 11, 0.4); }
    .callout-title { font-size: 0.9rem; font-weight: 700; margin-bottom: 0.35rem; }
    .callout-tip .callout-title { color: #5eead4; }
    .callout-warn .callout-title { color: #fcd34d; }
    .check-box, .links-box, .faq-wrap {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 1rem;
      padding: 1.4rem 1.5rem;
      margin-bottom: 2rem;
    }
    .links-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 0.85rem; margin-top: 1rem; }
    .link-card {
      display: block;
      text-decoration: none;
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid #334155;
      border-radius: 0.75rem;
      padding: 1rem;
      transition: border-color 0.2s;
    }
    .link-card:hover { border-color: #2dd4bf; }
    .link-card-title { font-size: 0.95rem; font-weight: 700; color: #5eead4; margin-bottom: 0.3rem; }
    .link-card-desc { font-size: 0.84rem; color: #cbd5e1; line-height: 1.5; }
    .filter-bar { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-bottom: 2rem; }
    .filter-btn {
      background: #1e293b;
      color: #e2e8f0;
      border: 1px solid #334155;
      border-radius: 0.6rem;
      padding: 0.45rem 0.85rem;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
    }
    .filter-btn.active { background: #14b8a6; color: #020617; border-color: #14b8a6; font-weight: 800; }
    .lang-pill {
      color: #e2e8f0;
      text-decoration: none;
      font-size: 0.82rem;
      font-weight: 700;
      padding: 0.35rem 0.7rem;
      border-radius: 0.5rem;
      border: 1px solid #334155;
      background: #0f172a;
    }
    .lang-pill:hover { border-color: #5eead4; color: #5eead4; }
    .glos-search-wrap {
      max-width: 680px;
      margin: 0 auto 1.25rem;
      position: relative;
    }
    .glos-search-input {
      width: 100%;
      padding: 0.85rem 1.15rem;
      border-radius: 0.85rem;
      border: 1px solid #334155;
      background: #0f172a;
      color: #f8fafc;
      font-size: 0.96rem;
      font-family: inherit;
    }
    .glos-search-input:focus {
      outline: 2px solid #2dd4bf;
      border-color: #2dd4bf;
    }
    .alpha-bar {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.35rem;
      margin-bottom: 1.75rem;
    }
    .alpha-btn {
      min-width: 2rem;
      height: 2rem;
      padding: 0 0.45rem;
      border-radius: 0.45rem;
      border: 1px solid #334155;
      background: #0f172a;
      color: #cbd5e1;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
    }
    .alpha-btn.active {
      background: #06b6d4;
      color: #020617;
      border-color: #06b6d4;
    }
    .alpha-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
    .two-col-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
      margin: 1.25rem 0;
    }
    .glos-panel {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid #334155;
      border-radius: 0.9rem;
      padding: 1.15rem 1.25rem;
    }
    .copy-code-btn {
      background: #1e293b;
      color: #e2e8f0;
      border: 1px solid #334155;
      border-radius: 0.45rem;
      padding: 0.25rem 0.65rem;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
    }
    .copy-code-btn:hover { border-color: #5eead4; color: #5eead4; }
`;

// 6. GENERATE BILINGUAL BLOG INDEX (/blog/ & /blog/en/) AND ARTICLE PAGES
function generateBlogPages() {

  const renderBlogIndex = (lang: 'ro' | 'en') => {
    const isEn = lang === 'en';
    const dirPath = isEn ? path.join(publicDir, 'blog', 'en') : path.join(publicDir, 'blog');
    ensureDir(dirPath);

    const canonicalUrl = isEn ? 'https://www.arkyedu.com/blog/en/' : 'https://www.arkyedu.com/blog/';
    const roIndexUrl = 'https://www.arkyedu.com/blog/';
    const enIndexUrl = 'https://www.arkyedu.com/blog/en/';

    const title = isEn
      ? 'ICT, Coding & Tech Study Guides Blog (Grades 5–8) | ArkyEdu'
      : 'Blog & Ghiduri TIC Gimnaziu: C++, Excel, AI & Siguranță Online | ArkyEdu';
    const description = isEn
      ? 'Free bilingual ICT study guides solving real student & parent problems: C++ troubleshooting, Excel formulas, safe AI homework habits, and online safety on TikTok & Roblox.'
      : 'Articole ample și ghiduri gratuite de TIC pentru clasele V–VIII: top erori C++, formule Excel, AI & ChatGPT la școală și siguranța copiilor pe TikTok, Roblox și Discord.';

    const usedCategories = BLOG_CATEGORIES.filter(
      (cat) => cat.id === 'all' || BLOG_ARTICLES.some((a) => a.category === cat.id)
    );

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": `${canonicalUrl}#collection`,
          "url": canonicalUrl,
          "name": title,
          "description": description,
          "inLanguage": isEn ? "en" : "ro",
          "isPartOf": { "@id": "https://www.arkyedu.com/#website" }
        },
        {
          "@type": "Blog",
          "@id": `${canonicalUrl}#blog`,
          "url": canonicalUrl,
          "name": isEn ? "ArkyEdu ICT & Coding Blog" : "Blogul de TIC & Programare ArkyEdu",
          "description": description,
          "inLanguage": isEn ? "en" : "ro",
          "publisher": { "@id": "https://www.arkyedu.com/#organization" },
          "blogPost": BLOG_ARTICLES.map((art) => {
            const c = isEn ? art.en : art.ro;
            const artUrl = isEn
              ? `https://www.arkyedu.com/blog/en/${art.en.slug}/`
              : `https://www.arkyedu.com/blog/${art.ro.slug}/`;
            return {
              "@type": "BlogPosting",
              "headline": c.title,
              "description": c.metaDescription,
              "url": artUrl,
              "datePublished": art.publishedAt,
              "dateModified": art.updatedAt,
              "inLanguage": isEn ? "en" : "ro"
            };
          })
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": isEn ? "Home" : "Acasă", "item": "https://www.arkyedu.com/" },
            { "@type": "ListItem", "position": 2, "name": isEn ? "ICT Blog & Guides" : "Blog & Ghiduri TIC", "item": canonicalUrl }
          ]
        }
      ]
    };

    const html = `<!DOCTYPE html>
<html lang="${isEn ? 'en' : 'ro'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtmlText(title)}</title>
  <meta name="description" content="${escapeHtmlText(description)}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="alternate" hreflang="ro" href="${roIndexUrl}">
  <link rel="alternate" hreflang="en" href="${enIndexUrl}">
  <link rel="alternate" hreflang="x-default" href="${roIndexUrl}">
  <meta name="theme-color" content="#090d16">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtmlText(title)}">
  <meta property="og:description" content="${escapeHtmlText(description)}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="ArkyEdu TIC & Arcade">
  <meta property="og:locale" content="${isEn ? 'en_US' : 'ro_RO'}">
  <meta property="og:image" content="https://www.arkyedu.com/og-cover.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtmlText(title)}">
  <meta name="twitter:description" content="${escapeHtmlText(description)}">
  <meta name="twitter:image" content="https://www.arkyedu.com/og-cover.png">
  <link rel="alternate" type="application/rss+xml" title="ArkyEdu Blog &amp; Ghiduri TIC (RSS)" href="https://www.arkyedu.com/rss.xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>
  <style>
${commonStyles}
${blogBaseStyles}
  </style>
</head>
<body>
  <header>
    <div class="container header-content">
      <a href="https://www.arkyedu.com/" class="logo-box">
        <div class="logo-icon">🚀</div>
        <span class="logo-text">ArkyEdu <span style="color: var(--accent);">BLOG TIC</span></span>
      </a>
      <nav class="nav-links" aria-label="${isEn ? 'Primary Navigation' : 'Navigare Principală'}">
        <a href="https://www.arkyedu.com/clasa-5/">${isEn ? 'Grade 5' : 'Clasa 5'}</a>
        <a href="https://www.arkyedu.com/clasa-6/">${isEn ? 'Grade 6' : 'Clasa 6'}</a>
        <a href="https://www.arkyedu.com/clasa-7/">${isEn ? 'Grade 7' : 'Clasa 7'}</a>
        <a href="https://www.arkyedu.com/clasa-8/">${isEn ? 'Grade 8' : 'Clasa 8'}</a>
        <a href="${isEn ? 'https://www.arkyedu.com/glosar/en/' : 'https://www.arkyedu.com/glosar/'}">${isEn ? 'Glossary (44)' : 'Glosar (44)'}</a>
        <a href="${isEn ? 'https://www.arkyedu.com/sandbox/en/' : 'https://www.arkyedu.com/sandbox/'}">Sandbox</a>
        <a href="https://www.arkyedu.com/arcade/">Arcade (29)</a>
        <a href="https://www.arkyedu.com/duel/">Duel 1v1</a>
      </nav>
      <div style="display:flex;align-items:center;gap:0.6rem;">
        <a href="${isEn ? roIndexUrl : enIndexUrl}" class="lang-pill">${isEn ? 'RO' : 'EN'}</a>
        <a href="https://www.arkyedu.com/" class="nav-cta">${isEn ? 'Open App' : 'Intră în Platformă'}</a>
      </div>
    </div>
  </header>

  <main class="container">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="https://www.arkyedu.com/">${isEn ? 'Home' : 'Acasă'}</a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">${isEn ? 'ICT Blog & Study Guides' : 'Blog & Ghiduri TIC'}</span>
    </nav>

    <div class="hero-section" style="padding-top:1.5rem;">
      <h1>${isEn ? 'ICT, Coding & Tech Study Guides (Grades 5–8)' : 'Blog & Ghiduri Practice TIC pentru Gimnaziu (V–VIII)'}</h1>
      <p class="lead-text">${escapeHtmlText(description)}</p>
    </div>

    <div class="filter-bar" role="group" aria-label="${isEn ? 'Filter articles by topic' : 'Filtrează articolele după subiect'}">
      ${usedCategories
        .map(
          (cat, idx) =>
            `<button type="button" class="filter-btn${idx === 0 ? ' active' : ''}" data-cat="${cat.id}">${escapeHtmlText(isEn ? cat.labelEn : cat.labelRo)}</button>`
        )
        .join('\n      ')}
    </div>

    <section class="grid-2" id="blog-grid" aria-label="${isEn ? 'Blog Articles' : 'Articole Blog'}">
      ${BLOG_ARTICLES.map((art) => {
        const c = isEn ? art.en : art.ro;
        const gradeTag = isEn ? art.gradeTagEn : art.gradeTagRo;
        const artUrl = isEn ? `/blog/en/${art.en.slug}/` : `/blog/${art.ro.slug}/`;
        return `
        <article class="card blog-card" data-cat="${art.category}" style="display:flex;flex-direction:column;justify-content:space-between;gap:1rem;">
          <div>
            <div class="meta-line">
              <span class="meta-accent">${escapeHtmlText(c.categoryLabel)}</span>
              <span aria-hidden="true">·</span>
              <span>${escapeHtmlText(gradeTag)}</span>
              <span aria-hidden="true">·</span>
              <span>${escapeHtmlText(c.readTime)}</span>
            </div>
            <h2 class="card-title" style="font-size:1.25rem;margin-bottom:0.6rem;">
              <a href="${artUrl}" style="color:#ffffff;text-decoration:none;">${escapeHtmlText(c.title)}</a>
            </h2>
            <p class="card-desc" style="color:#cbd5e1;">${escapeHtmlText(c.tldr)}</p>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;padding-top:0.75rem;border-top:1px solid #1e293b;">
            <span style="font-size:0.8rem;color:#94a3b8;">${c.faqs.length} FAQ · ${c.internalLinks.length} ${isEn ? 'Labs' : 'Laboratoare'}</span>
            <a href="${artUrl}" class="card-link">${isEn ? 'Read Full Guide →' : 'Citește ghidul complet →'}</a>
          </div>
        </article>`;
      }).join('\n')}
    </section>
  </main>

  <footer>
    <div class="container">
      <div class="footer-bottom" style="border: none;">
        <div>© 2026 ArkyEdu (arkyedu.com) — ${isEn ? 'Free Bilingual ICT & Coding Platform.' : 'Platformă Gratuită de Educație TIC & Coding.'}</div>
        <div><a href="https://www.arkyedu.com/" style="color: var(--accent);">${isEn ? 'Home' : 'Acasă'}</a> • <a href="${isEn ? 'https://www.arkyedu.com/glosar/en/' : 'https://www.arkyedu.com/glosar/'}" style="color: var(--accent);">${isEn ? 'ICT Glossary (44)' : 'Glosar TIC (44)'}</a> • <a href="https://www.arkyedu.com/educatie-tehnologie-copii/" style="color: var(--accent);">${isEn ? 'Tech Education Hub' : 'Educație Tehnologie Copii'}</a> • <a href="https://www.arkyedu.com/sitemap.xml" style="color: var(--accent);">Sitemap</a></div>
      </div>
    </div>
  </footer>

  <script>
    (function() {
      var btns = document.querySelectorAll('.filter-btn');
      var cards = document.querySelectorAll('.blog-card');
      btns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          var cat = btn.getAttribute('data-cat');
          btns.forEach(function(b) { b.classList.remove('active'); });
          btn.classList.add('active');
          cards.forEach(function(card) {
            card.style.display = (cat === 'all' || card.getAttribute('data-cat') === cat) ? 'flex' : 'none';
          });
        });
      });
    })();
  </script>
</body>
</html>`;

    fs.writeFileSync(path.join(dirPath, 'index.html'), html, 'utf-8');
  };

  const renderArticlePage = (article: BlogArticle, lang: 'ro' | 'en') => {
    const isEn = lang === 'en';
    const c = isEn ? article.en : article.ro;
    const other = isEn ? article.ro : article.en;
    const gradeTag = isEn ? article.gradeTagEn : article.gradeTagRo;

    const roUrl = `https://www.arkyedu.com/blog/${article.ro.slug}/`;
    const enUrl = `https://www.arkyedu.com/blog/en/${article.en.slug}/`;
    const canonicalUrl = isEn ? enUrl : roUrl;
    const alternateLangUrl = isEn ? roUrl : enUrl;
    const indexUrl = isEn ? 'https://www.arkyedu.com/blog/en/' : 'https://www.arkyedu.com/blog/';
    const indexLabel = isEn ? 'ICT Blog & Guides' : 'Blog & Ghiduri TIC';

    const dirPath = isEn
      ? path.join(publicDir, 'blog', 'en', article.en.slug)
      : path.join(publicDir, 'blog', article.ro.slug);
    ensureDir(dirPath);

    const howToSteps = c.sections.flatMap((s) => s.numberedSteps || []);
    const related = getRelatedBlogArticles(article.id, 3);

    const jsonLd: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BlogPosting",
          "@id": `${canonicalUrl}#article`,
          "headline": c.title,
          "description": c.metaDescription,
          "keywords": c.keywords,
          "articleSection": c.categoryLabel,
          "inLanguage": isEn ? "en" : "ro",
          "datePublished": article.publishedAt,
          "dateModified": article.updatedAt,
          "isAccessibleForFree": true,
          "mainEntityOfPage": canonicalUrl,
          "isPartOf": { "@id": `${indexUrl}#blog` },
          "author": {
            "@type": "Organization",
            "name": "ArkyEdu — Educație TIC & Coding România",
            "url": "https://www.arkyedu.com/"
          },
          "publisher": {
            "@type": "EducationalOrganization",
            "name": "ArkyEdu",
            "logo": { "@type": "ImageObject", "url": "https://www.arkyedu.com/pwa-512x512.png" }
          },
          "image": "https://www.arkyedu.com/og-cover.png"
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": isEn ? "Home" : "Acasă", "item": "https://www.arkyedu.com/" },
            { "@type": "ListItem", "position": 2, "name": indexLabel, "item": indexUrl },
            { "@type": "ListItem", "position": 3, "name": c.breadcrumbLabel, "item": canonicalUrl }
          ]
        },
        {
          "@type": "FAQPage",
          "mainEntity": c.faqs.map((f) => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": { "@type": "Answer", "text": f.answer }
          }))
        },
        ...(howToSteps.length > 0
          ? [{
              "@type": "HowTo",
              "name": c.breadcrumbLabel,
              "description": c.tldr,
              "step": howToSteps.slice(0, 8).map((step, i) => ({
                "@type": "HowToStep",
                "position": i + 1,
                "text": step
              }))
            }]
          : [])
      ]
    };

    const html = `<!DOCTYPE html>
<html lang="${isEn ? 'en' : 'ro'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtmlText(c.metaTitle)}</title>
  <meta name="description" content="${escapeHtmlText(c.metaDescription)}">
  <meta name="keywords" content="${escapeHtmlText(c.keywords)}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="alternate" hreflang="ro" href="${roUrl}">
  <link rel="alternate" hreflang="en" href="${enUrl}">
  <link rel="alternate" hreflang="x-default" href="${roUrl}">
  <meta name="theme-color" content="#090d16">
  <meta property="og:type" content="article">
  <meta property="article:published_time" content="${article.publishedAt}">
  <meta property="article:modified_time" content="${article.updatedAt}">
  <meta property="article:section" content="${escapeHtmlText(c.categoryLabel)}">
  <meta property="og:title" content="${escapeHtmlText(c.metaTitle)}">
  <meta property="og:description" content="${escapeHtmlText(c.metaDescription)}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="ArkyEdu TIC & Arcade">
  <meta property="og:locale" content="${isEn ? 'en_US' : 'ro_RO'}">
  <meta property="og:locale:alternate" content="${isEn ? 'ro_RO' : 'en_US'}">
  <meta property="og:image" content="https://www.arkyedu.com/og-cover.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtmlText(c.metaTitle)}">
  <meta name="twitter:description" content="${escapeHtmlText(c.metaDescription)}">
  <meta name="twitter:image" content="https://www.arkyedu.com/og-cover.png">
  <link rel="alternate" type="application/rss+xml" title="ArkyEdu Blog &amp; Ghiduri TIC (RSS)" href="https://www.arkyedu.com/rss.xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>
  <style>
${commonStyles}
${blogBaseStyles}
  </style>
</head>
<body>
  <header>
    <div class="container header-content">
      <a href="https://www.arkyedu.com/" class="logo-box">
        <div class="logo-icon">🚀</div>
        <span class="logo-text">ArkyEdu <span style="color: var(--accent);">BLOG TIC</span></span>
      </a>
      <nav class="nav-links" aria-label="${isEn ? 'Primary Navigation' : 'Navigare Principală'}">
        <a href="${indexUrl}">${indexLabel}</a>
        <a href="https://www.arkyedu.com/clasa-5/">${isEn ? 'Grade 5' : 'Clasa 5'}</a>
        <a href="https://www.arkyedu.com/clasa-6/">${isEn ? 'Grade 6' : 'Clasa 6'}</a>
        <a href="https://www.arkyedu.com/clasa-7/">${isEn ? 'Grade 7' : 'Clasa 7'}</a>
        <a href="https://www.arkyedu.com/clasa-8/">${isEn ? 'Grade 8' : 'Clasa 8'}</a>
        <a href="${isEn ? 'https://www.arkyedu.com/glosar/en/' : 'https://www.arkyedu.com/glosar/'}">${isEn ? 'Glossary (44)' : 'Glosar (44)'}</a>
        <a href="https://www.arkyedu.com/arcade/">Arcade (29)</a>
      </nav>
      <div style="display:flex;align-items:center;gap:0.6rem;">
        <a href="${alternateLangUrl}" class="lang-pill" title="${escapeHtmlText(other.title)}">${isEn ? 'RO' : 'EN'}</a>
        <a href="https://www.arkyedu.com/" class="nav-cta">${isEn ? 'Open App' : 'Intră în Platformă'}</a>
      </div>
    </div>
  </header>

  <main class="container">
    <div class="article-wrap">
      <!-- Breadcrumbs returning straight back to Blog Index & Home -->
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="https://www.arkyedu.com/">${isEn ? 'Home' : 'Acasă'}</a>
        <span aria-hidden="true">/</span>
        <a href="${indexUrl}">${indexLabel}</a>
        <span aria-hidden="true">/</span>
        <span>${escapeHtmlText(c.categoryLabel)}</span>
        <span aria-hidden="true">/</span>
        <span aria-current="page">${escapeHtmlText(c.breadcrumbLabel)}</span>
      </nav>

      <article itemscope itemtype="https://schema.org/BlogPosting">
        <div class="meta-line">
          <span class="meta-accent">${escapeHtmlText(c.categoryLabel)}</span>
          <span aria-hidden="true">·</span>
          <span>${escapeHtmlText(gradeTag)}</span>
          <span aria-hidden="true">·</span>
          <span>${escapeHtmlText(c.readTime)}</span>
          <span aria-hidden="true">·</span>
          <time datetime="${article.updatedAt}">${isEn ? `Updated ${article.updatedAt}` : `Actualizat ${article.updatedAt}`}</time>
        </div>

        <h1 class="article-h1" itemprop="headline">${escapeHtmlText(c.title)}</h1>
        <p class="article-intro" itemprop="description">${escapeHtmlText(c.intro)}</p>

        <!-- Compact Share Bar (WhatsApp & Copy Link) -->
        <div style="display:flex;flex-wrap:wrap;gap:0.6rem;align-items:center;margin-bottom:1.5rem;">
          <a href="https://wa.me/?text=${encodeURIComponent(`${c.title} — ${canonicalUrl}`)}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:0.4rem;padding:0.45rem 0.85rem;border-radius:0.55rem;background:rgba(16,185,129,0.16);border:1px solid rgba(16,185,129,0.4);color:#6ee7b7;font-size:0.82rem;font-weight:700;text-decoration:none;">💬 WhatsApp</a>
          <button type="button" id="copy-share-btn" data-url="${canonicalUrl}" style="display:inline-flex;align-items:center;gap:0.4rem;padding:0.45rem 0.85rem;border-radius:0.55rem;background:#1e293b;border:1px solid #334155;color:#e2e8f0;font-size:0.82rem;font-weight:600;cursor:pointer;">🔗 ${isEn ? 'Copy guide link' : 'Copiază link ghid'}</button>
          <a href="${indexUrl}" style="font-size:0.82rem;color:#5eead4;text-decoration:none;font-weight:600;margin-left:0.25rem;">← ${indexLabel}</a>
        </div>

        <!-- Answer-First TL;DR for Google Featured Snippets & AI Engines -->
        <section class="tldr-box" aria-labelledby="tldr-h">
          <div class="tldr-title" id="tldr-h">${escapeHtmlText(c.tldrTitle)}</div>
          <p class="tldr-text">${escapeHtmlText(c.tldr)}</p>
        </section>

        <!-- Table of Contents -->
        <nav class="toc-box" aria-labelledby="toc-h">
          <div class="toc-title" id="toc-h">${isEn ? 'Table of Contents' : 'Cuprinsul articolului'}</div>
          <ol class="toc-list">
            ${c.sections.map((s) => `<li><a href="#${s.id}">${escapeHtmlText(s.heading)}</a></li>`).join('\n            ')}
            <li><a href="#faq-h">${isEn ? 'Frequently Asked Questions (FAQ)' : 'Întrebări frecvente (FAQ)'}</a></li>
          </ol>
        </nav>

        <div itemprop="articleBody">
          ${c.sections
            .map(
              (sec) => `
          <section class="art-section" id="${sec.id}">
            <h2>${escapeHtmlText(sec.heading)}</h2>
            ${sec.paragraphs.map((p) => `<p>${escapeHtmlText(p)}</p>`).join('\n            ')}
            ${
              sec.numberedSteps && sec.numberedSteps.length > 0
                ? `<ol>${sec.numberedSteps.map((st) => `<li>${escapeHtmlText(st)}</li>`).join('')}</ol>`
                : ''
            }
            ${
              sec.bulletPoints && sec.bulletPoints.length > 0
                ? `<ul>${sec.bulletPoints.map((bp) => `<li>${escapeHtmlText(bp)}</li>`).join('')}</ul>`
                : ''
            }
            ${
              sec.codeBlock
                ? `<div class="code-box">
                    <div class="code-head">${escapeHtmlText(sec.codeBlock.title)}</div>
                    <pre><code>${escapeHtmlText(sec.codeBlock.code)}</code></pre>
                    ${sec.codeBlock.caption ? `<div class="code-cap">${escapeHtmlText(sec.codeBlock.caption)}</div>` : ''}
                  </div>`
                : ''
            }
            ${
              sec.table
                ? `<div class="table-wrap">
                    <table class="seo-tbl">
                      ${sec.table.caption ? `<caption>${escapeHtmlText(sec.table.caption)}</caption>` : ''}
                      <thead><tr>${sec.table.headers.map((h) => `<th>${escapeHtmlText(h)}</th>`).join('')}</tr></thead>
                      <tbody>${sec.table.rows
                        .map((r) => `<tr>${r.map((cell) => `<td>${escapeHtmlText(cell)}</td>`).join('')}</tr>`)
                        .join('')}</tbody>
                    </table>
                  </div>`
                : ''
            }
            ${
              sec.callout
                ? `<div class="${sec.callout.variant === 'warning' ? 'callout-warn' : 'callout-tip'}">
                    <div class="callout-title">${escapeHtmlText(sec.callout.title)}</div>
                    <p style="margin:0;">${escapeHtmlText(sec.callout.text)}</p>
                  </div>`
                : ''
            }
          </section>`
            )
            .join('\n')}
        </div>

        <!-- Checklist -->
        <section class="check-box">
          <h2 style="font-size:1.2rem;margin-bottom:0.75rem;color:#fff;">✅ ${escapeHtmlText(c.checklistTitle)}</h2>
          <ul style="padding-left:1.35rem;color:#e2e8f0;line-height:1.7;">
            ${c.checklist.map((item) => `<li>${escapeHtmlText(item)}</li>`).join('\n            ')}
          </ul>
        </section>

        <!-- Deep Internal Links into ArkyEdu Interactive Labs & Arcade -->
        <section class="links-box">
          <h2 style="font-size:1.25rem;color:#fff;">${escapeHtmlText(c.internalLinksTitle)}</h2>
          <div class="links-grid">
            ${c.internalLinks
              .map(
                (l) => `<a href="https://www.arkyedu.com${l.url}" class="link-card">
                <div class="link-card-title">${escapeHtmlText(l.label)} →</div>
                <div class="link-card-desc">${escapeHtmlText(l.description)}</div>
              </a>`
              )
              .join('\n            ')}
          </div>
        </section>

        <!-- FAQ Section -->
        <section class="faq-wrap" id="faq-h">
          <h2 style="font-size:1.35rem;margin-bottom:1.1rem;color:#fff;">❓ ${isEn ? 'Frequently Asked Questions' : 'Întrebări frecvente (FAQ)'}</h2>
          ${c.faqs
            .map(
              (f) => `<div class="faq-block">
              <div class="faq-question">${escapeHtmlText(f.question)}</div>
              <div class="faq-answer">${escapeHtmlText(f.answer)}</div>
            </div>`
            )
            .join('\n          ')}
        </section>

        <!-- Glossary Terms Explained in This Guide -->
        ${(() => {
          const matchedTerms = GLOSSARY_TERMS.filter(gt => gt.relatedBlogIds.includes(article.id)).slice(0, 6);
          if (matchedTerms.length === 0) return '';
          const glosIndex = isEn ? 'https://www.arkyedu.com/glosar/en/' : 'https://www.arkyedu.com/glosar/';
          return `
        <section class="links-box">
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:0.75rem;">
            <h2 style="font-size:1.2rem;color:#fff;">🔤 ${isEn ? 'ICT Glossary Terms Used in This Guide' : 'Termeni din Glosarul TIC explicați în acest ghid'}</h2>
            <a href="${glosIndex}" class="card-link">${isEn ? 'All 44 Terms A–Z →' : 'Toți cei 44 termeni A–Z →'}</a>
          </div>
          <div class="links-grid">
            ${matchedTerms.map(gt => {
              const lc = isEn ? gt.en : gt.ro;
              const gHref = isEn ? `/glosar/en/${gt.en.slug}/` : `/glosar/${gt.ro.slug}/`;
              return `<a href="${gHref}" class="link-card">
                <div class="link-card-title">${escapeHtmlText(lc.term)} →</div>
                <div class="link-card-desc">${escapeHtmlText(lc.shortAnswer)}</div>
              </a>`;
            }).join('\n            ')}
          </div>
        </section>`;
        })()}

        <!-- Related Articles + Back to Blog Index Link -->
        <section style="border-top:1px solid #1e293b;padding-top:1.75rem;">
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:0.75rem;margin-bottom:1rem;">
            <h2 style="font-size:1.25rem;color:#fff;">${isEn ? 'More Study Guides' : 'Citește și alte ghiduri TIC'}</h2>
            <a href="${indexUrl}" class="card-link">${isEn ? '← Back to Blog Index' : '← Înapoi la Indexul Blogului'}</a>
          </div>
          <div class="links-grid">
            ${related
              .map((r) => {
                const rc = isEn ? r.en : r.ro;
                const rUrl = isEn ? `/blog/en/${r.en.slug}/` : `/blog/${r.ro.slug}/`;
                return `<a href="${rUrl}" class="link-card">
                  <div class="link-card-title">${escapeHtmlText(rc.breadcrumbLabel)} →</div>
                  <div class="link-card-desc">${escapeHtmlText(rc.metaDescription)}</div>
                </a>`;
              })
              .join('\n            ')}
          </div>
        </section>
      </article>
    </div>
  </main>

  <footer>
    <div class="container">
      <div class="footer-bottom" style="border: none;">
        <div>© 2026 ArkyEdu — ${isEn ? 'Free ICT & Coding Education.' : 'Educație TIC & Coding 100% Gratuită.'}</div>
        <div><a href="https://www.arkyedu.com/" style="color: var(--accent);">${isEn ? 'Home' : 'Acasă'}</a> • <a href="${indexUrl}" style="color: var(--accent);">${indexLabel}</a> • <a href="${isEn ? 'https://www.arkyedu.com/glosar/en/' : 'https://www.arkyedu.com/glosar/'}" style="color: var(--accent);">${isEn ? 'Glossary (44)' : 'Glosar TIC (44)'}</a> • <a href="https://www.arkyedu.com/rss.xml" style="color: var(--accent);">RSS</a> • <a href="https://www.arkyedu.com/sitemap.xml" style="color: var(--accent);">Sitemap</a></div>
      </div>
    </div>
  </footer>
  <script>
    (function() {
      var btn = document.getElementById('copy-share-btn');
      if (!btn || !navigator.clipboard) return;
      btn.addEventListener('click', function() {
        var u = btn.getAttribute('data-url') || window.location.href;
        navigator.clipboard.writeText(u).then(function() {
          var orig = btn.textContent;
          btn.textContent = '${isEn ? '✓ Copied!' : '✓ Link copiat!'}';
          setTimeout(function() { btn.textContent = orig; }, 2000);
        }).catch(function() {});
      });
    })();
  </script>
</body>
</html>`;

    fs.writeFileSync(path.join(dirPath, 'index.html'), html, 'utf-8');
  };

  renderBlogIndex('ro');
  renderBlogIndex('en');
  BLOG_ARTICLES.forEach((article) => {
    renderArticlePage(article, 'ro');
    renderArticlePage(article, 'en');
  });

  console.log(`Generated bilingual Blog Index (RO + EN) and ${BLOG_ARTICLES.length * 2} static article pages.`);
}

// 6B. GENERATE BILINGUAL ICT GLOSSARY INDEX (/glosar/ & /glosar/en/) + 88 TERM PAGES
function generateGlossaryPages() {
  const gradeMap: Record<'5' | '6' | '7' | '8', { roman: string; labelRo: string; labelEn: string }> = {
    '5': { roman: 'V', labelRo: 'Clasa a V-a', labelEn: 'Grade 5' },
    '6': { roman: 'VI', labelRo: 'Clasa a VI-a', labelEn: 'Grade 6' },
    '7': { roman: 'VII', labelRo: 'Clasa a VII-a', labelEn: 'Grade 7' },
    '8': { roman: 'VIII', labelRo: 'Clasa a VIII-a', labelEn: 'Grade 8' },
  };

  const renderGlossaryIndex = (lang: 'ro' | 'en') => {
    const isEn = lang === 'en';
    const dirPath = isEn ? path.join(publicDir, 'glosar', 'en') : path.join(publicDir, 'glosar');
    ensureDir(dirPath);

    const canonicalUrl = isEn ? 'https://www.arkyedu.com/glosar/en/' : 'https://www.arkyedu.com/glosar/';
    const roIndexUrl = 'https://www.arkyedu.com/glosar/';
    const enIndexUrl = 'https://www.arkyedu.com/glosar/en/';
    const blogUrl = isEn ? 'https://www.arkyedu.com/blog/en/' : 'https://www.arkyedu.com/blog/';

    const title = isEn
      ? `Bilingual ICT & Computer Science Glossary (${GLOSSARY_TERMS.length} Terms, Grades 5–8) | ArkyEdu`
      : `Glosar Bilingv Informatică & TIC (${GLOSSARY_TERMS.length} Termeni Esențiali V–VIII) | ArkyEdu`;
    const description = isEn
      ? `Complete A–Z middle school ICT & Computer Science glossary: CPU, RAM, C++ modulo & loops, Excel IF/COUNTIF, HTML5, HTTPS, phishing, Arduino millis(), and AI prompt engineering.`
      : `Dicționar complet A–Z de Informatică și TIC pentru gimnaziu (V–VIII): procesor CPU, RAM vs SSD, operatorul modulo %, bucle while/for C++, Excel IF/COUNTIF, HTML5, phishing, Arduino millis() și prompturi AI.`;

    const sortedTerms = [...GLOSSARY_TERMS].sort((a, b) => {
      const la = isEn ? a.en.term : a.ro.term;
      const lb = isEn ? b.en.term : b.ro.term;
      return la.localeCompare(lb, isEn ? 'en' : 'ro');
    });

    const letters = Array.from(
      new Set(sortedTerms.map((t) => (isEn ? t.en.term : t.ro.term).trim().charAt(0).toUpperCase()))
    ).sort();

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": `${canonicalUrl}#collection`,
          "url": canonicalUrl,
          "name": title,
          "description": description,
          "inLanguage": isEn ? "en" : "ro",
          "isPartOf": { "@id": "https://www.arkyedu.com/#website" }
        },
        {
          "@type": "DefinedTermSet",
          "@id": `${canonicalUrl}#termset`,
          "name": isEn ? "ArkyEdu Middle School ICT & Coding Glossary" : "Glosar Bilingv Informatică & TIC ArkyEdu",
          "description": description,
          "url": canonicalUrl,
          "inLanguage": isEn ? "en" : "ro",
          "hasDefinedTerm": sortedTerms.map((t) => {
            const loc = isEn ? t.en : t.ro;
            const tUrl = isEn ? `https://www.arkyedu.com/glosar/en/${t.en.slug}/` : `https://www.arkyedu.com/glosar/${t.ro.slug}/`;
            return {
              "@type": "DefinedTerm",
              "name": loc.term,
              "description": loc.shortAnswer,
              "url": tUrl,
              "inDefinedTermSet": `${canonicalUrl}#termset`
            };
          })
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": isEn ? "Home" : "Acasă", "item": "https://www.arkyedu.com/" },
            { "@type": "ListItem", "position": 2, "name": isEn ? "ICT & CS Glossary" : "Glosar Informatică & TIC", "item": canonicalUrl }
          ]
        }
      ]
    };

    const html = `<!DOCTYPE html>
<html lang="${isEn ? 'en' : 'ro'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtmlText(title)}</title>
  <meta name="description" content="${escapeHtmlText(description)}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="alternate" hreflang="ro" href="${roIndexUrl}">
  <link rel="alternate" hreflang="en" href="${enIndexUrl}">
  <link rel="alternate" hreflang="x-default" href="${roIndexUrl}">
  <meta name="theme-color" content="#090d16">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtmlText(title)}">
  <meta property="og:description" content="${escapeHtmlText(description)}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="ArkyEdu TIC & Arcade">
  <meta property="og:locale" content="${isEn ? 'en_US' : 'ro_RO'}">
  <meta property="og:locale:alternate" content="${isEn ? 'ro_RO' : 'en_US'}">
  <meta property="og:image" content="https://www.arkyedu.com/og-cover.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtmlText(title)}">
  <meta name="twitter:description" content="${escapeHtmlText(description)}">
  <meta name="twitter:image" content="https://www.arkyedu.com/og-cover.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>
  <style>
${commonStyles}
${blogBaseStyles}
  </style>
</head>
<body>
  <header>
    <div class="container header-content">
      <a href="https://www.arkyedu.com/" class="logo-box">
        <div class="logo-icon">🚀</div>
        <span class="logo-text">ArkyEdu <span style="color: var(--accent);">GLOSAR TIC</span></span>
      </a>
      <nav class="nav-links" aria-label="${isEn ? 'Primary Navigation' : 'Navigare Principală'}">
        <a href="https://www.arkyedu.com/clasa-5/">${isEn ? 'Grade 5' : 'Clasa 5'}</a>
        <a href="https://www.arkyedu.com/clasa-6/">${isEn ? 'Grade 6' : 'Clasa 6'}</a>
        <a href="https://www.arkyedu.com/clasa-7/">${isEn ? 'Grade 7' : 'Clasa 7'}</a>
        <a href="https://www.arkyedu.com/clasa-8/">${isEn ? 'Grade 8' : 'Clasa 8'}</a>
        <a href="${blogUrl}">${isEn ? 'Blog' : 'Blog TIC'}</a>
        <a href="https://www.arkyedu.com/arcade/">Arcade (29)</a>
      </nav>
      <div style="display:flex;align-items:center;gap:0.6rem;">
        <a href="${isEn ? roIndexUrl : enIndexUrl}" class="lang-pill">${isEn ? 'RO' : 'EN'}</a>
        <a href="https://www.arkyedu.com/" class="nav-cta">${isEn ? 'Open App' : 'Intră în Platformă'}</a>
      </div>
    </div>
  </header>

  <main class="container">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="https://www.arkyedu.com/">${isEn ? 'Home' : 'Acasă'}</a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">${isEn ? 'ICT & CS Glossary (A–Z)' : 'Glosar Informatică & TIC (A–Z)'}</span>
    </nav>

    <div class="hero-section" style="padding-top:1.25rem;padding-bottom:1.5rem;">
      <h1>${isEn ? `Bilingual ICT & Coding Glossary (${GLOSSARY_TERMS.length} Terms, Grades 5–8)` : `Glosar Bilingv Informatică & TIC (${GLOSSARY_TERMS.length} Termeni V–VIII)`}</h1>
      <p class="lead-text">${escapeHtmlText(description)}</p>
    </div>

    <div class="glos-search-wrap">
      <label for="glos-search" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);">${isEn ? 'Search glossary terms' : 'Caută termeni în glosar'}</label>
      <input id="glos-search" type="search" class="glos-search-input" placeholder="${isEn ? 'Search a term, C++ operator, Excel formula, sensor... (e.g. modulo, RAM, millis)' : 'Caută un termen, operator C++, formulă Excel, senzor... (ex: modulo, RAM, millis)'}" />
    </div>

    <div class="filter-bar" role="group" aria-label="${isEn ? 'Filter by category' : 'Filtrează după domeniu'}" style="margin-bottom:0.85rem;">
      <button type="button" class="filter-btn cat-btn active" data-cat="all">${isEn ? `All Domains (${GLOSSARY_TERMS.length})` : `Toate Domeniile (${GLOSSARY_TERMS.length})`}</button>
      ${GLOSSARY_CATEGORIES.map(
        (cat) =>
          `<button type="button" class="filter-btn cat-btn" data-cat="${cat.id}">${escapeHtmlText(isEn ? cat.enName : cat.roName)}</button>`
      ).join('\n      ')}
    </div>

    <div class="filter-bar" role="group" aria-label="${isEn ? 'Filter by grade' : 'Filtrează după clasă'}" style="margin-bottom:1rem;">
      <button type="button" class="filter-btn grade-btn active" data-grade="all">${isEn ? 'All Grades (V–VIII)' : 'Toate Clasele (V–VIII)'}</button>
      <button type="button" class="filter-btn grade-btn" data-grade="5">${isEn ? 'Grade 5' : 'Clasa a V-a'}</button>
      <button type="button" class="filter-btn grade-btn" data-grade="6">${isEn ? 'Grade 6' : 'Clasa a VI-a'}</button>
      <button type="button" class="filter-btn grade-btn" data-grade="7">${isEn ? 'Grade 7' : 'Clasa a VII-a'}</button>
      <button type="button" class="filter-btn grade-btn" data-grade="8">${isEn ? 'Grade 8' : 'Clasa a VIII-a'}</button>
    </div>

    <div class="alpha-bar" role="group" aria-label="${isEn ? 'Filter by first letter' : 'Filtrează după literă'}">
      <button type="button" class="alpha-btn active" data-letter="ALL">${isEn ? 'All' : 'Toți'}</button>
      ${letters.map((l) => `<button type="button" class="alpha-btn" data-letter="${l}">${l}</button>`).join('\n      ')}
    </div>

    <p id="glos-count" style="text-align:center;font-size:0.85rem;color:#94a3b8;margin-bottom:1.25rem;">
      ${isEn ? `Showing ${sortedTerms.length} of ${sortedTerms.length} terms` : `Se afișează ${sortedTerms.length} din ${sortedTerms.length} termeni`}
    </p>

    <section class="grid-3" id="glossary-grid" aria-label="${isEn ? 'Glossary Terms List' : 'Lista Termeni Glosar'}">
      ${sortedTerms.map((term) => {
        const loc = isEn ? term.en : term.ro;
        const other = isEn ? term.ro : term.en;
        const gradeLabel = isEn ? term.gradeTagEn : term.gradeTagRo;
        const termUrl = isEn ? `/glosar/en/${term.en.slug}/` : `/glosar/${term.ro.slug}/`;
        const firstLetter = loc.term.trim().charAt(0).toUpperCase();
        const searchBlob = `${loc.term} ${other.term} ${loc.shortAnswer} ${loc.keywords}`.toLowerCase();
        return `
      <article class="card glos-card" data-cat="${term.category}" data-grades="${term.grades.join(',')}" data-letter="${escapeHtmlText(firstLetter)}" data-search="${escapeHtmlText(searchBlob)}" style="display:flex;flex-direction:column;justify-content:space-between;gap:0.85rem;">
        <div>
          <div class="meta-line" style="font-size:0.78rem;margin-bottom:0.4rem;">
            <span class="meta-accent">${escapeHtmlText(gradeLabel)}</span>
            <span aria-hidden="true">·</span>
            <span>${escapeHtmlText(other.term)}</span>
          </div>
          <h2 class="card-title" style="font-size:1.08rem;margin-bottom:0.45rem;">
            <a href="${termUrl}" style="color:#ffffff;text-decoration:none;">${escapeHtmlText(loc.term)}</a>
          </h2>
          <p class="card-desc" style="font-size:0.88rem;color:#cbd5e1;margin:0;">${escapeHtmlText(loc.shortAnswer)}</p>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:0.65rem;border-top:1px solid #1e293b;">
          <a href="https://www.arkyedu.com/cursuri/${term.relatedModuleId}/" style="font-size:0.78rem;color:#94a3b8;text-decoration:none;">${isEn ? 'Lab & Theory' : 'Modul TIC'}</a>
          <a href="${termUrl}" class="card-link" style="font-size:0.84rem;">${isEn ? 'Open Term →' : 'Vezi definiția →'}</a>
        </div>
      </article>`;
      }).join('\n')}
    </section>

    <div id="glos-empty" style="display:none;text-align:center;padding:3rem 1rem;color:#cbd5e1;">
      <p style="margin-bottom:1rem;">${isEn ? 'No matching terms found for your current filters.' : 'Nu am găsit niciun termen pentru filtrele selectate.'}</p>
      <button type="button" id="glos-reset-btn" class="filter-btn active">${isEn ? 'Reset Filters' : 'Resetează Filtrele'}</button>
    </div>
  </main>

  <footer>
    <div class="container">
      <div class="footer-bottom" style="border: none;">
        <div>© 2026 ArkyEdu (arkyedu.com) — ${isEn ? 'Free Bilingual ICT & CS Glossary.' : 'Glosar Bilingv Gratuit de Informatică & TIC.'}</div>
        <div><a href="https://www.arkyedu.com/" style="color: var(--accent);">${isEn ? 'Home' : 'Acasă'}</a> • <a href="${blogUrl}" style="color: var(--accent);">${isEn ? 'Blog & Guides' : 'Blog & Ghiduri'}</a> • <a href="https://www.arkyedu.com/educatie-tehnologie-copii/" style="color: var(--accent);">${isEn ? 'Tech Hub' : 'Educație Copii'}</a> • <a href="https://www.arkyedu.com/sitemap.xml" style="color: var(--accent);">Sitemap</a></div>
      </div>
    </div>
  </footer>

  <script>
    (function() {
      var activeCat = 'all';
      var activeGrade = 'all';
      var activeLetter = 'ALL';
      var searchInput = document.getElementById('glos-search');
      var cards = document.querySelectorAll('.glos-card');
      var catBtns = document.querySelectorAll('.cat-btn');
      var gradeBtns = document.querySelectorAll('.grade-btn');
      var alphaBtns = document.querySelectorAll('.alpha-btn');
      var countEl = document.getElementById('glos-count');
      var emptyEl = document.getElementById('glos-empty');
      var resetBtn = document.getElementById('glos-reset-btn');
      var total = cards.length;

      function applyFilters() {
        var q = (searchInput && searchInput.value ? searchInput.value : '').trim().toLowerCase();
        var visible = 0;
        cards.forEach(function(c) {
          var okCat = activeCat === 'all' || c.getAttribute('data-cat') === activeCat;
          var grades = (c.getAttribute('data-grades') || '').split(',');
          var okGrade = activeGrade === 'all' || grades.indexOf(activeGrade) !== -1;
          var okLetter = activeLetter === 'ALL' || c.getAttribute('data-letter') === activeLetter;
          var okSearch = !q || (c.getAttribute('data-search') || '').indexOf(q) !== -1;
          var show = okCat && okGrade && okLetter && okSearch;
          c.style.display = show ? 'flex' : 'none';
          if (show) visible++;
        });
        if (countEl) {
          countEl.textContent = ${isEn ? '`Showing ` + visible + ` of ` + total + ` terms`' : '`Se afișează ` + visible + ` din ` + total + ` termeni`'};
        }
        if (emptyEl) emptyEl.style.display = visible === 0 ? 'block' : 'none';
      }

      try {
        var params = new URLSearchParams(window.location.search);
        var qParam = params.get('q');
        if (qParam && searchInput) {
          searchInput.value = qParam;
        }
      } catch (e) {}

      if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
      }
      catBtns.forEach(function(b) {
        b.addEventListener('click', function() {
          activeCat = b.getAttribute('data-cat') || 'all';
          catBtns.forEach(function(x) { x.classList.remove('active'); });
          b.classList.add('active');
          applyFilters();
        });
      });
      gradeBtns.forEach(function(b) {
        b.addEventListener('click', function() {
          activeGrade = b.getAttribute('data-grade') || 'all';
          gradeBtns.forEach(function(x) { x.classList.remove('active'); });
          b.classList.add('active');
          applyFilters();
        });
      });
      alphaBtns.forEach(function(b) {
        b.addEventListener('click', function() {
          activeLetter = b.getAttribute('data-letter') || 'ALL';
          alphaBtns.forEach(function(x) { x.classList.remove('active'); });
          b.classList.add('active');
          applyFilters();
        });
      });
      if (resetBtn) {
        resetBtn.addEventListener('click', function() {
          activeCat = 'all';
          activeGrade = 'all';
          activeLetter = 'ALL';
          if (searchInput) searchInput.value = '';
          catBtns.forEach(function(x, i) { x.classList.toggle('active', i === 0); });
          gradeBtns.forEach(function(x, i) { x.classList.toggle('active', i === 0); });
          alphaBtns.forEach(function(x, i) { x.classList.toggle('active', i === 0); });
          applyFilters();
        });
      }
      applyFilters();
    })();
  </script>
</body>
</html>`;

    fs.writeFileSync(path.join(dirPath, 'index.html'), html, 'utf-8');
  };

  const renderTermPage = (term: GlossaryTerm, lang: 'ro' | 'en') => {
    const isEn = lang === 'en';
    const c = isEn ? term.en : term.ro;
    const other = isEn ? term.ro : term.en;
    const gradeLabel = isEn ? term.gradeTagEn : term.gradeTagRo;
    const catMeta = GLOSSARY_CATEGORIES.find((cat) => cat.id === term.category);
    const categoryLabel = catMeta ? (isEn ? catMeta.enName : catMeta.roName) : term.category;

    const roUrl = `https://www.arkyedu.com/glosar/${term.ro.slug}/`;
    const enUrl = `https://www.arkyedu.com/glosar/en/${term.en.slug}/`;
    const canonicalUrl = isEn ? enUrl : roUrl;
    const alternateLangUrl = isEn ? roUrl : enUrl;
    const indexUrl = isEn ? 'https://www.arkyedu.com/glosar/en/' : 'https://www.arkyedu.com/glosar/';
    const indexLabel = isEn ? 'ICT Glossary' : 'Glosar TIC';

    const dirPath = isEn
      ? path.join(publicDir, 'glosar', 'en', term.en.slug)
      : path.join(publicDir, 'glosar', term.ro.slug);
    ensureDir(dirPath);

    const metaTitle = isEn
      ? `${c.term} — Definition, Syntax & School Example | ArkyEdu`
      : `${c.term} — Definiție, Exemplu & Greșeli Frecvente | ArkyEdu`;
    const metaDesc = c.shortAnswer.length > 158 ? `${c.shortAnswer.slice(0, 155)}...` : c.shortAnswer;

    const linkedMod = CURRICULA_MODULES.find((m) => m.id === term.relatedModuleId);
    const linkedBlogs = term.relatedBlogIds
      .map((id) => BLOG_ARTICLES.find((a) => a.id === id))
      .filter((a): a is NonNullable<typeof a> => Boolean(a));
    const relatedTerms = getRelatedGlossaryTerms(term, 4);

    const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(`${c.term} — ${canonicalUrl}`)}`;

    const jsonLd: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "DefinedTerm",
          "@id": `${canonicalUrl}#term`,
          "name": c.term,
          "description": c.shortAnswer,
          "url": canonicalUrl,
          "termCode": term.id,
          "inLanguage": isEn ? "en" : "ro",
          "inDefinedTermSet": {
            "@type": "DefinedTermSet",
            "@id": `${indexUrl}#termset`,
            "name": isEn ? "ArkyEdu Middle School ICT & Coding Glossary" : "Glosar Bilingv Informatică & TIC ArkyEdu",
            "url": indexUrl
          }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": isEn ? "Home" : "Acasă", "item": "https://www.arkyedu.com/" },
            { "@type": "ListItem", "position": 2, "name": indexLabel, "item": indexUrl },
            { "@type": "ListItem", "position": 3, "name": c.term, "item": canonicalUrl }
          ]
        },
        ...(c.faqs.length > 0
          ? [{
              "@type": "FAQPage",
              "mainEntity": c.faqs.map((f) => ({
                "@type": "Question",
                "name": f.question,
                "acceptedAnswer": { "@type": "Answer", "text": f.answer }
              }))
            }]
          : [])
      ]
    };

    const html = `<!DOCTYPE html>
<html lang="${isEn ? 'en' : 'ro'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtmlText(metaTitle)}</title>
  <meta name="description" content="${escapeHtmlText(metaDesc)}">
  <meta name="keywords" content="${escapeHtmlText(c.keywords)}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="alternate" hreflang="ro" href="${roUrl}">
  <link rel="alternate" hreflang="en" href="${enUrl}">
  <link rel="alternate" hreflang="x-default" href="${roUrl}">
  <meta name="theme-color" content="#090d16">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtmlText(metaTitle)}">
  <meta property="og:description" content="${escapeHtmlText(metaDesc)}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="ArkyEdu TIC & Arcade">
  <meta property="og:locale" content="${isEn ? 'en_US' : 'ro_RO'}">
  <meta property="og:locale:alternate" content="${isEn ? 'ro_RO' : 'en_US'}">
  <meta property="og:image" content="https://www.arkyedu.com/og-cover.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtmlText(metaTitle)}">
  <meta name="twitter:description" content="${escapeHtmlText(metaDesc)}">
  <meta name="twitter:image" content="https://www.arkyedu.com/og-cover.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>
  <style>
${commonStyles}
${blogBaseStyles}
  </style>
</head>
<body>
  <header>
    <div class="container header-content">
      <a href="https://www.arkyedu.com/" class="logo-box">
        <div class="logo-icon">🚀</div>
        <span class="logo-text">ArkyEdu <span style="color: var(--accent);">GLOSAR TIC</span></span>
      </a>
      <nav class="nav-links" aria-label="${isEn ? 'Primary Navigation' : 'Navigare Principală'}">
        <a href="${indexUrl}">${indexLabel}</a>
        <a href="https://www.arkyedu.com/clasa-5/">${isEn ? 'Grade 5' : 'Clasa 5'}</a>
        <a href="https://www.arkyedu.com/clasa-6/">${isEn ? 'Grade 6' : 'Clasa 6'}</a>
        <a href="https://www.arkyedu.com/clasa-7/">${isEn ? 'Grade 7' : 'Clasa 7'}</a>
        <a href="https://www.arkyedu.com/clasa-8/">${isEn ? 'Grade 8' : 'Clasa 8'}</a>
        <a href="${isEn ? 'https://www.arkyedu.com/blog/en/' : 'https://www.arkyedu.com/blog/'}">${isEn ? 'Blog' : 'Blog TIC'}</a>
      </nav>
      <div style="display:flex;align-items:center;gap:0.6rem;">
        <a href="${alternateLangUrl}" class="lang-pill" title="${escapeHtmlText(other.term)}">${isEn ? 'RO' : 'EN'}</a>
        <a href="https://www.arkyedu.com/?mission=${term.relatedMissionId}" class="nav-cta">${isEn ? 'Practice Lab' : 'Intră în Laborator'}</a>
      </div>
    </div>
  </header>

  <main class="container">
    <div class="article-wrap">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="https://www.arkyedu.com/">${isEn ? 'Home' : 'Acasă'}</a>
        <span aria-hidden="true">/</span>
        <a href="${indexUrl}">${indexLabel}</a>
        <span aria-hidden="true">/</span>
        <span>${escapeHtmlText(categoryLabel)}</span>
        <span aria-hidden="true">/</span>
        <span aria-current="page">${escapeHtmlText(c.term)}</span>
      </nav>

      <article itemscope itemtype="https://schema.org/DefinedTerm">
        <meta itemprop="inLanguage" content="${isEn ? 'en' : 'ro'}" />
        <div class="meta-line">
          <span class="meta-accent">${escapeHtmlText(categoryLabel)}</span>
          <span aria-hidden="true">·</span>
          <span>${escapeHtmlText(gradeLabel)}</span>
          <span aria-hidden="true">·</span>
          <span>${isEn ? 'RO Term' : 'EN Term'}: <a href="${alternateLangUrl}" style="color:#5eead4;text-decoration:none;font-weight:700;">${escapeHtmlText(other.term)}</a></span>
        </div>

        <h1 class="article-h1" itemprop="name">${escapeHtmlText(c.term)}</h1>

        <!-- Share bar -->
        <div style="display:flex;flex-wrap:wrap;gap:0.65rem;align-items:center;margin-bottom:1.5rem;">
          <a href="${whatsappShareUrl}" target="_blank" rel="noopener noreferrer" class="lang-pill">💬 ${isEn ? 'Share on WhatsApp' : 'Trimite pe WhatsApp'}</a>
          <button type="button" id="copy-share-btn" data-url="${canonicalUrl}" class="lang-pill" style="cursor:pointer;">🔗 ${isEn ? 'Copy Link' : 'Copiază link-ul'}</button>
        </div>

        <!-- Answer-First Position-0 Definition Box -->
        <div class="tldr-box">
          <div class="tldr-title">📌 ${isEn ? 'Quick Definition (Answer-First)' : 'Definiție Scurtă (Răspuns Direct)'}</div>
          <p class="tldr-text" itemprop="description">${escapeHtmlText(c.shortAnswer)}</p>
        </div>

        <!-- Detailed Explanation -->
        <section class="art-section">
          <h2>${isEn ? 'How It Works & Why It Matters' : 'Explicație Detaliată pentru Gimnaziu'}</h2>
          ${c.explanation.map((p) => `<p>${escapeHtmlText(p)}</p>`).join('\n          ')}
        </section>

        ${c.syntaxOrFormula ? `
        <!-- Copyable Code / Formula Block -->
        <div class="code-box">
          <div class="code-head">
            <span>💻 ${escapeHtmlText(c.syntaxOrFormula.title)}</span>
            <button type="button" class="copy-code-btn" id="copy-syntax-btn">${isEn ? 'Copy' : 'Copiază'}</button>
          </div>
          <pre id="syntax-pre">${escapeHtmlText(c.syntaxOrFormula.code)}</pre>
        </div>` : ''}

        <!-- Classroom Example vs Common Confusion -->
        <div class="two-col-grid">
          <div class="glos-panel">
            <h2 style="font-size:1.05rem;font-weight:800;color:#5eead4;margin-bottom:0.55rem;">🏫 ${isEn ? 'Classroom Example' : 'Exemplu Practic de la Clasǎ'}</h2>
            <p style="font-size:0.95rem;color:#e2e8f0;line-height:1.65;margin:0;">${escapeHtmlText(c.example)}</p>
          </div>
          ${c.vsComparison ? `
          <div class="glos-panel">
            <h2 style="font-size:1.05rem;font-weight:800;color:#38bdf8;margin-bottom:0.55rem;">⚖️ ${escapeHtmlText(c.vsComparison.title)}</h2>
            <p style="font-size:0.95rem;color:#e2e8f0;line-height:1.65;margin:0;">${escapeHtmlText(c.vsComparison.summary)}</p>
          </div>` : ''}
        </div>

        <!-- Common Exam Mistake Warning -->
        <div class="callout-warn">
          <div class="callout-title">⚠️ ${isEn ? 'Common Mistake in Exams & Homework' : 'Greșeală Frecventă la Test / Lucrare'}</div>
          <p style="margin:0;color:#fef3c7;line-height:1.65;">${escapeHtmlText(c.commonMistake)}</p>
        </div>

        <!-- Connected Practice Labs, Curricula & Guides -->
        <section class="links-box" style="margin-top:1.75rem;">
          <h2 style="font-size:1.25rem;color:#fff;">🚀 ${isEn ? 'Practice in ArkyEdu Labs & Related Guides' : 'Exersează în Simulator & Lecții Conectate'}</h2>
          <div class="links-grid">
            <a href="https://www.arkyedu.com/?mission=${term.relatedMissionId}" class="link-card" style="border-color:rgba(16,185,129,0.5);">
              <div class="link-card-title">🎮 ${isEn ? 'Launch Interactive Lab' : 'Lansează Simulatorul Interactiv'} →</div>
              <div class="link-card-desc">${linkedMod ? escapeHtmlText(linkedMod.title) : (isEn ? 'Open hands-on ArkyEdu simulator' : 'Deschide laboratorul practic în browser')}</div>
            </a>
            ${linkedMod ? `
            <a href="https://www.arkyedu.com/cursuri/${linkedMod.id}/" class="link-card">
              <div class="link-card-title">📖 ${isEn ? 'Full Lesson & Curriculum' : 'Fișa Didactică & Teoria'} →</div>
              <div class="link-card-desc">${escapeHtmlText(linkedMod.grade)} · ${escapeHtmlText(linkedMod.shortTitle)}</div>
            </a>` : ''}
            ${term.grades.map((gr) => {
              const gm = gradeMap[gr];
              return `<a href="https://www.arkyedu.com/clasa-${gr}/" class="link-card">
                <div class="link-card-title">🏫 ${isEn ? `${gm.labelEn} Hub` : `Hub ${gm.labelRo}`} →</div>
                <div class="link-card-desc">${isEn ? 'All modules & guides for this grade' : 'Toate modulele și ghidurile pentru această clasă'}</div>
              </a>`;
            }).join('\n            ')}
            ${linkedBlogs.map((ba) => {
              const bc = isEn ? ba.en : ba.ro;
              const bUrl = isEn ? `/blog/en/${ba.en.slug}/` : `/blog/${ba.ro.slug}/`;
              return `<a href="${bUrl}" class="link-card">
                <div class="link-card-title">📚 ${escapeHtmlText(bc.breadcrumbLabel)} →</div>
                <div class="link-card-desc">${escapeHtmlText(bc.metaDescription)}</div>
              </a>`;
            }).join('\n            ')}
          </div>
        </section>

        ${c.faqs.length > 0 ? `
        <!-- FAQ Section -->
        <section class="faq-wrap">
          <h2 style="font-size:1.3rem;margin-bottom:1rem;color:#fff;">❓ ${isEn ? 'Quick Questions & Answers' : 'Întrebări Frecvente'}</h2>
          ${c.faqs.map((f) => `<div class="faq-block">
            <div class="faq-question">${escapeHtmlText(f.question)}</div>
            <div class="faq-answer">${escapeHtmlText(f.answer)}</div>
          </div>`).join('\n          ')}
        </section>` : ''}

        <!-- Related Glossary Terms + Back Link -->
        <section style="border-top:1px solid #1e293b;padding-top:1.75rem;">
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:0.75rem;margin-bottom:1rem;">
            <h2 style="font-size:1.25rem;color:#fff;">${isEn ? 'Related Glossary Terms' : 'Termeni Înrudiți din Glosar'}</h2>
            <a href="${indexUrl}" class="card-link">${isEn ? '← Back to Full Glossary (A–Z)' : '← Înapoi la Glosarul Complet (A–Z)'}</a>
          </div>
          <div class="links-grid">
            ${relatedTerms.map((rt) => {
              const rc = isEn ? rt.en : rt.ro;
              const rUrl = isEn ? `/glosar/en/${rt.en.slug}/` : `/glosar/${rt.ro.slug}/`;
              return `<a href="${rUrl}" class="link-card">
                <div class="link-card-title">${escapeHtmlText(rc.term)} →</div>
                <div class="link-card-desc">${escapeHtmlText(rc.shortAnswer)}</div>
              </a>`;
            }).join('\n            ')}
          </div>
        </section>
      </article>
    </div>
  </main>

  <footer>
    <div class="container">
      <div class="footer-bottom" style="border: none;">
        <div>© 2026 ArkyEdu — ${isEn ? 'Free ICT & Coding Education.' : 'Educație TIC & Coding 100% Gratuită.'}</div>
        <div><a href="https://www.arkyedu.com/" style="color: var(--accent);">${isEn ? 'Home' : 'Acasă'}</a> • <a href="${indexUrl}" style="color: var(--accent);">${indexLabel}</a> • <a href="${isEn ? 'https://www.arkyedu.com/blog/en/' : 'https://www.arkyedu.com/blog/'}" style="color: var(--accent);">${isEn ? 'Blog' : 'Blog TIC'}</a> • <a href="https://www.arkyedu.com/sitemap.xml" style="color: var(--accent);">Sitemap</a></div>
      </div>
    </div>
  </footer>
  <script>
    (function() {
      var shareBtn = document.getElementById('copy-share-btn');
      if (shareBtn && navigator.clipboard) {
        shareBtn.addEventListener('click', function() {
          var u = shareBtn.getAttribute('data-url') || window.location.href;
          navigator.clipboard.writeText(u).then(function() {
            var orig = shareBtn.textContent;
            shareBtn.textContent = '${isEn ? '✓ Copied!' : '✓ Link copiat!'}';
            setTimeout(function() { shareBtn.textContent = orig; }, 2000);
          }).catch(function() {});
        });
      }
      var syntaxBtn = document.getElementById('copy-syntax-btn');
      var syntaxPre = document.getElementById('syntax-pre');
      if (syntaxBtn && syntaxPre && navigator.clipboard) {
        syntaxBtn.addEventListener('click', function() {
          navigator.clipboard.writeText(syntaxPre.textContent || '').then(function() {
            var orig = syntaxBtn.textContent;
            syntaxBtn.textContent = '${isEn ? '✓ Copied!' : '✓ Copiat!'}';
            setTimeout(function() { syntaxBtn.textContent = orig; }, 2000);
          }).catch(function() {});
        });
      }
    })();
  </script>
</body>
</html>`;

    fs.writeFileSync(path.join(dirPath, 'index.html'), html, 'utf-8');
  };

  renderGlossaryIndex('ro');
  renderGlossaryIndex('en');
  GLOSSARY_TERMS.forEach((term) => {
    renderTermPage(term, 'ro');
    renderTermPage(term, 'en');
  });

  console.log(`Generated bilingual Glossary Index (RO + EN) and ${GLOSSARY_TERMS.length * 2} static term pages.`);
}

// 6B. GENERATE BILINGUAL SANDBOX LANDING PAGES (/sandbox/ & /sandbox/en/)
function generateSandboxPages() {
  const renderSandboxPage = (lang: 'ro' | 'en') => {
    const isEn = lang === 'en';
    const dirPath = isEn ? path.join(publicDir, 'sandbox', 'en') : path.join(publicDir, 'sandbox');
    ensureDir(dirPath);

    const roUrl = 'https://www.arkyedu.com/sandbox/';
    const enUrl = 'https://www.arkyedu.com/sandbox/en/';
    const canonicalUrl = isEn ? enUrl : roUrl;
    const altUrl = isEn ? roUrl : enUrl;

    const title = isEn
      ? 'C++ Step Debugger, Code Sandbox & ICT Olympiad Arena | ArkyEdu'
      : 'Debug Vizual C++ Pas-cu-Pas, Sandbox Cod & Olimpiada TIC | ArkyEdu';
    const description = isEn
      ? 'Step-by-step C++ RAM & array trace debugger with breakpoints, 12-problem ICT Olympiad Arena (5-test judge), Python 3 & HTML5/CSS directly in your browser.'
      : 'Depanator vizual C++ pas-cu-pas cu memorie RAM și vectori, Arena Olimpiada TIC cu 12 probleme pe 5 teste, plus Python 3 și HTML5 direct în browser fără instalare.';

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SoftwareApplication",
          "@id": `${canonicalUrl}#app`,
          "name": isEn ? "ArkyEdu Browser Code Sandbox" : "ArkyEdu Sandbox Cod Live",
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Web Browser",
          "isAccessibleForFree": true,
          "inLanguage": isEn ? "en" : "ro",
          "url": canonicalUrl,
          "description": description,
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": isEn ? "USD" : "RON" }
        },
        {
          "@type": "ItemList",
          "name": isEn ? "Curriculum Coding Challenges" : "Provocări Curriculare în Sandbox",
          "itemListElement": SANDBOX_CHALLENGES.map((ch, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": isEn ? ch.titleEn : ch.titleRo,
            "description": isEn ? ch.summaryEn : ch.summaryRo
          }))
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": isEn ? "Home" : "Acasă", "item": "https://www.arkyedu.com/" },
            { "@type": "ListItem", "position": 2, "name": isEn ? "Code Sandbox" : "Sandbox Cod Live", "item": canonicalUrl }
          ]
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": isEn
                ? "Do I need to install Code::Blocks or Python to run code in ArkyEdu Sandbox?"
                : "Trebuie să instalez Code::Blocks sau Python pe calculator pentru a folosi Sandbox-ul?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": isEn
                  ? "No. ArkyEdu Sandbox runs C++17 (Code::Blocks curriculum subset), Python 3, and HTML5/CSS directly in your browser on desktop, tablet, or phone with automated test verification."
                  : "Nu. Sandbox-ul ArkyEdu rulează C++17 (subsetul de gimnaziu Code::Blocks), Python 3 și HTML5/CSS direct în browser pe PC, laptop, tabletă sau telefon, cu verificare automată pe teste."
              }
            },
            {
              "@type": "Question",
              "name": isEn
                ? "Which middle-school ICT topics are covered in the Sandbox challenges?"
                : "Ce lecții de TIC din programa de gimnaziu sunt acoperite în provocările Sandbox?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": isEn
                  ? "Three-glasses swap, digit sum with while (% 10 and / 10), prime numbers, arrays max/min, Python lists and loops, and semantic HTML5/CSS layouts."
                  : "Regula celor 3 pahare, suma cifrelor cu while (n % 10 și n / 10), verificarea numerelor prime, maximul în vectori, liste și bucle Python 3 și machete HTML5 + CSS."
              }
            }
          ]
        }
      ]
    };

    const html = `<!DOCTYPE html>
<html lang="${isEn ? 'en' : 'ro'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtmlText(title)}</title>
  <meta name="description" content="${escapeHtmlText(description)}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="alternate" hreflang="ro" href="${roUrl}">
  <link rel="alternate" hreflang="en" href="${enUrl}">
  <link rel="alternate" hreflang="x-default" href="${roUrl}">
  <meta name="theme-color" content="#090d16">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtmlText(title)}">
  <meta property="og:description" content="${escapeHtmlText(description)}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="ArkyEdu TIC & Arcade">
  <meta property="og:locale" content="${isEn ? 'en_US' : 'ro_RO'}">
  <meta property="og:image" content="https://www.arkyedu.com/og-cover.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtmlText(title)}">
  <meta name="twitter:description" content="${escapeHtmlText(description)}">
  <meta name="twitter:image" content="https://www.arkyedu.com/og-cover.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>
  <style>
${commonStyles}
  </style>
</head>
<body>
  <header>
    <div class="container header-content">
      <a href="https://www.arkyedu.com/" class="logo-box">
        <div class="logo-icon">🚀</div>
        <span class="logo-text">ArkyEdu <span style="color: var(--accent);">SANDBOX</span></span>
      </a>
      <nav class="nav-links" aria-label="${isEn ? 'Primary Navigation' : 'Navigare Principală'}">
        <a href="https://www.arkyedu.com/clasa-7/">${isEn ? 'Grade 7' : 'Clasa 7'}</a>
        <a href="https://www.arkyedu.com/clasa-8/">${isEn ? 'Grade 8' : 'Clasa 8'}</a>
        <a href="${isEn ? 'https://www.arkyedu.com/blog/en/' : 'https://www.arkyedu.com/blog/'}">${isEn ? 'Blog' : 'Blog TIC'}</a>
        <a href="${isEn ? 'https://www.arkyedu.com/glosar/en/' : 'https://www.arkyedu.com/glosar/'}">${isEn ? 'Glossary' : 'Glosar'}</a>
        <a href="https://www.arkyedu.com/arcade/">Arcade (29)</a>
      </nav>
      <div style="display:flex;align-items:center;gap:0.6rem;">
        <a href="${altUrl}" style="color:#94a3b8;text-decoration:none;font-weight:700;font-size:0.85rem;padding:0.4rem 0.7rem;border:1px solid #334155;border-radius:0.6rem;">${isEn ? 'RO' : 'EN'}</a>
        <a href="https://www.arkyedu.com/#sandbox" class="nav-cta">${isEn ? 'Launch Live Editor' : 'Deschide Editorul Live'}</a>
      </div>
    </div>
  </header>

  <main class="container">
    <div class="hero-section">
      <div class="badge-bar">
        <span class="badge badge-green">Debug Vizual C++ · RAM &amp; Vectori</span>
        <span class="badge badge-free">Arena Olimpiada TIC (${OLYMPIAD_PROBLEMS.length} Probleme)</span>
        <span class="badge">C++17 · Python 3 · HTML5 (${SANDBOX_CHALLENGES.length} Teste)</span>
      </div>
      <h1>${isEn ? 'C++ Visual Trace Debugger, Code Sandbox & ICT Olympiad' : 'Depanator Vizual C++ Pas-cu-Pas, Sandbox & Olimpiada TIC'}</h1>
      <p class="lead-text">${escapeHtmlText(description)}</p>
      <div class="cta-group">
        <a href="https://www.arkyedu.com/#sandbox" class="btn-primary">💻 ${isEn ? 'Open Code Sandbox & C++ Trace' : 'Deschide Sandbox & Trace C++'}</a>
        <a href="https://www.arkyedu.com/#olimpiada" class="btn-secondary">🏆 ${isEn ? 'Enter ICT Olympiad Arena' : 'Intră în Arena Olimpiada TIC'}</a>
      </div>
    </div>

    <h2 style="font-size: 1.65rem; margin-bottom: 1.5rem; text-align: center;">${isEn ? '12 Progressive ICT Olympiad Problems (OJI & National)' : '12 Probleme Progresive în Arena Olimpiada TIC (OJI & Național)'}</h2>
    <div class="grid-3" style="margin-bottom: 3rem;">
      ${OLYMPIAD_PROBLEMS.map((op) => `
        <div class="card">
          <div style="font-size:0.78rem;font-weight:700;color:var(--brand-amber);margin-bottom:0.35rem;text-transform:uppercase;">${escapeHtmlText(isEn ? op.gradeLabelEn : op.gradeLabelRo)} · ${escapeHtmlText(op.complexityTarget)}</div>
          <h3 class="card-title" style="font-size:1.05rem;">${String(op.number).padStart(2, '0')}. ${escapeHtmlText(isEn ? op.titleEn : op.titleRo)}</h3>
          <p class="card-desc" style="font-size:0.86rem;">${escapeHtmlText((isEn ? op.statementEn : op.statementRo).slice(0, 140))}...</p>
          <a href="https://www.arkyedu.com/#olimpiada" class="card-link">${isEn ? 'Solve & Trace →' : 'Rezolvă & Debug →'}</a>
        </div>
      `).join('')}
    </div>

    <h2 style="font-size: 1.65rem; margin-bottom: 1.5rem; text-align: center;">${isEn ? '9 Built-In Curriculum Challenges + Free Playground' : '9 Provocări Curriculare cu Verificare Automată + Mod Liber'}</h2>
    <div class="grid-3">
      ${SANDBOX_CHALLENGES.map((ch) => `
        <div class="card">
          <div style="font-size:0.78rem;font-weight:700;color:var(--brand-cyan);margin-bottom:0.35rem;text-transform:uppercase;">${ch.language} · ${escapeHtmlText(isEn ? ch.gradeLabelEn : ch.gradeLabelRo)}</div>
          <h3 class="card-title" style="font-size:1.08rem;">${escapeHtmlText(isEn ? ch.titleEn : ch.titleRo)}</h3>
          <p class="card-desc" style="font-size:0.88rem;">${escapeHtmlText(isEn ? ch.summaryEn : ch.summaryRo)}</p>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:0.75rem;">
            <a href="https://www.arkyedu.com/#sandbox" class="card-link">${isEn ? 'Solve in Sandbox →' : 'Rezolvă în Sandbox →'}</a>
            <a href="https://www.arkyedu.com/cursuri/${ch.relatedModuleId}/" style="font-size:0.8rem;color:#94a3b8;text-decoration:none;">${isEn ? 'Theory' : 'Lecție'}</a>
          </div>
        </div>
      `).join('')}
    </div>
  </main>

  <footer>
    <div class="container">
      <div class="footer-bottom" style="border: none;">
        <div>© 2026 ArkyEdu — ${isEn ? 'Free Browser Coding Labs.' : 'Laborator Gratuit de Programare în Browser.'}</div>
        <div><a href="https://www.arkyedu.com/" style="color: var(--accent);">${isEn ? 'Home' : 'Acasă'}</a> • <a href="${isEn ? 'https://www.arkyedu.com/blog/en/' : 'https://www.arkyedu.com/blog/'}" style="color: var(--accent);">${isEn ? 'Blog' : 'Blog TIC'}</a> • <a href="${isEn ? 'https://www.arkyedu.com/glosar/en/' : 'https://www.arkyedu.com/glosar/'}" style="color: var(--accent);">${isEn ? 'Glossary' : 'Glosar TIC'}</a> • <a href="https://www.arkyedu.com/sitemap.xml" style="color: var(--accent);">Sitemap</a></div>
      </div>
    </div>
  </footer>
</body>
</html>`;

    fs.writeFileSync(path.join(dirPath, 'index.html'), html, 'utf-8');
  };

  renderSandboxPage('ro');
  renderSandboxPage('en');
  console.log('Generated bilingual Sandbox landing pages (/sandbox/ and /sandbox/en/).');
}

// 7. GENERATE COMPLETE SITEMAP.XML
function generateSitemap() {
  const currentDate = new Date().toISOString().split('T')[0];

  const staticUrls = [
    { loc: 'https://www.arkyedu.com/', priority: '1.0', changefreq: 'daily' },
    { loc: 'https://www.arkyedu.com/sandbox/', priority: '0.95', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/sandbox/en/', priority: '0.90', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/blog/', priority: '0.95', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/blog/en/', priority: '0.92', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/glosar/', priority: '0.95', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/glosar/en/', priority: '0.92', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/educatie-tehnologie-copii/', priority: '0.98', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/clasa-5/', priority: '0.95', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/clasa-6/', priority: '0.95', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/clasa-7/', priority: '0.95', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/clasa-8/', priority: '0.95', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/comparatie-scoli-private/', priority: '0.95', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/arcade/', priority: '0.92', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/leonida/', priority: '0.97', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/leonida/en/', priority: '0.94', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/leonida-llm.txt', priority: '0.88', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/laborator-ai/', priority: '0.97', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/laborator-ai/en/', priority: '0.94', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/laborator-ai-llm.txt', priority: '0.88', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/arcade/vice-leonida-gta6/', priority: '0.93', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/arcade/vice-leonida-gta6/en/', priority: '0.90', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/duel/', priority: '0.92', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/duel/vice-leonida-1v1/', priority: '0.93', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/duel/vice-leonida-1v1/en/', priority: '0.90', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/profesor/', priority: '0.88', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/oras/', priority: '0.88', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/fise/', priority: '0.96', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/fise/en/', priority: '0.92', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/llms.txt', priority: '0.88', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/llms-full.txt', priority: '0.85', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/fise-llm.txt', priority: '0.85', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/ai-catalog.json', priority: '0.75', changefreq: 'weekly' }
  ];

  const worksheetUrls = WORKSHEETS_BANK.flatMap((ws) => [
    {
      loc: `https://www.arkyedu.com/fise/${ws.ro.slug}/`,
      priority: '0.92',
      changefreq: 'weekly'
    },
    {
      loc: `https://www.arkyedu.com/fise/en/${ws.en.slug}/`,
      priority: '0.88',
      changefreq: 'weekly'
    }
  ]);

  const blogUrls = BLOG_ARTICLES.flatMap((art) => [
    {
      loc: `https://www.arkyedu.com/blog/${art.ro.slug}/`,
      priority: '0.90',
      changefreq: 'weekly'
    },
    {
      loc: `https://www.arkyedu.com/blog/en/${art.en.slug}/`,
      priority: '0.88',
      changefreq: 'weekly'
    }
  ]);

  const glossaryUrls = GLOSSARY_TERMS.flatMap((gt) => [
    {
      loc: `https://www.arkyedu.com/glosar/${gt.ro.slug}/`,
      priority: '0.88',
      changefreq: 'weekly'
    },
    {
      loc: `https://www.arkyedu.com/glosar/en/${gt.en.slug}/`,
      priority: '0.86',
      changefreq: 'weekly'
    }
  ]);

  const courseUrls = CURRICULA_MODULES.map(m => ({
    loc: `https://www.arkyedu.com/cursuri/${m.id}/`,
    priority: m.grade === 'Clasa a VIII-a' ? '0.9' : m.grade === 'Clasa a VII-a' ? '0.88' : '0.85',
    changefreq: 'weekly'
  }));

  const allUrls = [...staticUrls, ...worksheetUrls, ...blogUrls, ...glossaryUrls, ...courseUrls];

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xmlContent, 'utf-8');
  console.log(`Generated sitemap.xml with ${allUrls.length} clean indexable URLs.`);
}

// 8. GENERATE RSS 2.0 FEED (/rss.xml) FOR ALL BILINGUAL BLOG ARTICLES
function generateRssFeed() {
  const nowRfc = new Date().toUTCString();
  const items = BLOG_ARTICLES.flatMap((art) => {
    const pubDate = new Date(`${art.publishedAt}T09:00:00Z`).toUTCString();
    const roUrl = `https://www.arkyedu.com/blog/${art.ro.slug}/`;
    const enUrl = `https://www.arkyedu.com/blog/en/${art.en.slug}/`;
    return [
      `  <item>
    <title>${escapeHtmlText(art.ro.title)}</title>
    <link>${roUrl}</link>
    <guid isPermaLink="true">${roUrl}</guid>
    <pubDate>${pubDate}</pubDate>
    <category>${escapeHtmlText(art.ro.categoryLabel)}</category>
    <description>${escapeHtmlText(art.ro.tldr)}</description>
  </item>`,
      `  <item>
    <title>${escapeHtmlText(art.en.title)}</title>
    <link>${enUrl}</link>
    <guid isPermaLink="true">${enUrl}</guid>
    <pubDate>${pubDate}</pubDate>
    <category>${escapeHtmlText(art.en.categoryLabel)}</category>
    <description>${escapeHtmlText(art.en.tldr)}</description>
  </item>`
    ];
  });

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>ArkyEdu — Blog &amp; Ghiduri TIC, Coding și Robotică (RO &amp; EN)</title>
  <link>https://www.arkyedu.com/blog/</link>
  <description>Ghiduri practice bilingve pentru elevi (clasele V–VIII), părinți și profesori de TIC: C++, Excel, Scratch 3.0, Word, HTML5, Arduino Smart Home IoT și siguranță online.</description>
  <language>ro</language>
  <lastBuildDate>${nowRfc}</lastBuildDate>
  <atom:link href="https://www.arkyedu.com/rss.xml" rel="self" type="application/rss+xml" />
${items.join('\n')}
</channel>
</rss>
`;

  fs.writeFileSync(path.join(publicDir, 'rss.xml'), rssXml, 'utf-8');
  console.log(`Generated rss.xml with ${BLOG_ARTICLES.length * 2} bilingual guide entries.`);
}

// 9. GENERATE DEDICATED BILINGUAL SEO LANDING PAGES FOR VICE LEONIDA VI (ARCADE & 1V1 DUEL)
function generateViceLeonidaSeoPages() {
  interface VicePageSpec {
    subPath: string;
    lang: 'ro' | 'en';
    kind: 'arcade' | 'duel';
    roUrl: string;
    enUrl: string;
    canonicalUrl: string;
    appLaunchUrl: string;
    siblingUrl: string;
    siblingLabel: string;
    title: string;
    meta: string;
    keywords: string;
    badgeHero: string;
    h1: string;
    lead: string;
    ctaLabel: string;
    highlightsTitle: string;
    highlights: Array<{ icon: string; title: string; desc: string }>;
    guideTitle: string;
    guideSteps: string[];
    faqs: Array<{ q: string; a: string }>;
  }

  const specs: VicePageSpec[] = [
    {
      subPath: path.join('arcade', 'vice-leonida-gta6'),
      lang: 'ro',
      kind: 'arcade',
      roUrl: 'https://www.arkyedu.com/arcade/vice-leonida-gta6/',
      enUrl: 'https://www.arkyedu.com/arcade/vice-leonida-gta6/en/',
      canonicalUrl: 'https://www.arkyedu.com/arcade/vice-leonida-gta6/',
      appLaunchUrl: 'https://www.arkyedu.com/?game=vice_leonida',
      siblingUrl: 'https://www.arkyedu.com/duel/vice-leonida-1v1/',
      siblingLabel: '⚔️ Încearcă Varianta Multiplayer 1v1 →',
      title: 'Vice Leonida VI: Cyber Runner – Joc Arcade GTA 6 TIC | ArkyEdu',
      meta: 'Joacă gratuit Vice Leonida VI: Cyber Runner direct în browser! Joc arcade inspirat din GTA 6 (Lucia Caminos & Jason Duval) în Statul Leonida: Vice Beach, Venetian Causeway, Port Gellhorn, Grassrivers Airboat și hack-uri binare TIC.',
      keywords: 'vice leonida gta 6, joc gta 6 browser educativ, lucia caminos jason duval joc tic, vice beach venetian causeway grassrivers, joc arcade binar clasa 5 8, arkyedu vice leonida',
      badgeHero: 'Ediție Specială GTA 6 Tech · Arcade TIC #01',
      h1: 'Vice Leonida VI: Cyber Runner — Joc Arcade Tehnologic Inspirat din GTA 6',
      lead: 'Explorează 4 sectoare futuriste din Statul Leonida cu protagoniștii Lucia Caminos și Jason Duval! Evită dronele VCPD 1★–5★, transformă mașina în Cyber Airboat în Grassrivers și sparge Relay Vault-uri prin conversii binare pe 4 biți și întrebări TIC.',
      ctaLabel: '🌴 Joacă Vice Leonida VI Acum (0 Lei)',
      highlightsTitle: 'Sisteme Tehnologice &amp; Mecanici Autentice din Leonida',
      highlights: [
        { icon: '👯', title: 'Swap Live: Lucia Caminos &amp; Jason Duval (Tasta Q)', desc: 'Lucia oferă +35% regenerare Nitro, +25% puncte Data Shard și +3s la hack-uri. Jason aduce viraj precis și Kinetic Auto-Shield care absoarbe 1 coliziune la fiecare 20s.' },
        { icon: '🗺️', title: '4 Sectoare Leonida + Transformare Airboat', desc: 'Vice Beach Neon Strip → Venetian Causeway → Port Gellhorn Cyber Docks → Grassrivers Digital Swamp, unde vehiculul se transformă automat în Cyber Airboat!' },
        { icon: '🔐', title: 'Relay Vault Breach: Binar 4-Bit &amp; Întrebări TIC', desc: 'Deblochează seifurile digitale convertind coduri binare 8-4-2-1 sau răspunzând fulger la întrebări de rețelistică (HTTPS 443, DNS), porți logice și C++.' },
        { icon: '🚨', title: 'Wanted Heat 1★–5★, Nitro &amp; Undă EMP (Tasta E)', desc: 'Drone VCPD Interceptor, scannere laser, reflectoare de elicopter la 3★+ și impuls EMP care dezactivează dronele din apropiere.' }
      ],
      guideTitle: 'Cum Să Domini Clasamentul în Vice Leonida VI (Clasele V–VIII)',
      guideSteps: [
        'Folosește A/D sau săgețile Stânga/Dreapta (sau butoanele tactile pe mobil) pentru a schimba banda pe cele 4 șosele neon.',
        'Apasă Space / Shift pentru Nitro Boost când colectezi baterii albastre, și E pentru impulsul EMP împotriva dronelor VCPD.',
        'Comută live între Lucia și Jason cu Q: folosește-l pe Jason în zonele aglomerate pentru scutul cinetic și pe Lucia la colectarea Data Shard-urilor.',
        'La fiecare 750 de puncte (sau la activarea unui Relay Vault) rezolvă rapid provocarea binară 8-4-2-1 pentru +300 XP și scăderea nivelului Wanted Heat!'
      ],
      faqs: [
        { q: 'Este Vice Leonida VI sigur și potrivit pentru elevii de gimnaziu (10–15 ani)?', a: 'Da! Deși este inspirat din estetica și geografia autentică GTA 6 (State of Leonida, Vice Beach, Port Gellhorn, Grassrivers, Lucia & Jason), jocul este 100% adaptat educațional fără arme reale sau violență — toate obstacolele sunt drone tech, lasere firewall și provocări de informatică.' },
        { q: 'Cum se salvează recordul și punctele XP?', a: 'Scorul maxim se salvează automat local și în Cloud în Carnetul Digital al elevului (până la 3.000 XP bonus pentru Arcade).' }
      ]
    },
    {
      subPath: path.join('arcade', 'vice-leonida-gta6', 'en'),
      lang: 'en',
      kind: 'arcade',
      roUrl: 'https://www.arkyedu.com/arcade/vice-leonida-gta6/',
      enUrl: 'https://www.arkyedu.com/arcade/vice-leonida-gta6/en/',
      canonicalUrl: 'https://www.arkyedu.com/arcade/vice-leonida-gta6/en/',
      appLaunchUrl: 'https://www.arkyedu.com/?game=vice_leonida&lang=en',
      siblingUrl: 'https://www.arkyedu.com/duel/vice-leonida-1v1/en/',
      siblingLabel: '⚔️ Try 1v1 Multiplayer Showdown →',
      title: 'Vice Leonida VI: Cyber Runner – GTA 6 Tech Arcade Game | ArkyEdu',
      meta: 'Play Vice Leonida VI: Cyber Runner free in your browser! GTA 6-inspired cyber arcade game with Lucia Caminos & Jason Duval across Vice Beach, Venetian Causeway, Port Gellhorn & Grassrivers Airboat.',
      keywords: 'vice leonida gta 6 game, gta 6 browser educational game, lucia caminos jason duval arcade, binary puzzle game kids, vice beach cyber runner, arkyedu arcade',
      badgeHero: 'GTA 6 Tech Special Edition · Arcade #01',
      h1: 'Vice Leonida VI: Cyber Runner — GTA 6 Inspired Tech Arcade Game',
      lead: 'Speed through 4 futuristic State of Leonida sectors with dual protagonists Lucia Caminos & Jason Duval! Outrun 1★–5★ VCPD drones, morph into a Grassrivers Cyber Airboat, and crack 4-bit binary & CS Relay Vaults.',
      ctaLabel: '🌴 Play Vice Leonida VI Free Now',
      highlightsTitle: 'Authentic Leonida Tech Systems &amp; Mechanics',
      highlights: [
        { icon: '👯', title: 'Live Swap: Lucia Caminos &amp; Jason Duval (Q Key)', desc: 'Lucia brings +35% Nitro regen, +25% Data Shard scoring, and +3s vault breach time. Jason delivers sharper steering and a Kinetic Auto-Shield absorbing 1 crash every 20s.' },
        { icon: '🗺️', title: '4 Leonida Sectors + Grassrivers Airboat Morph', desc: 'Race from Vice Beach Neon Strip through Venetian Causeway and Port Gellhorn Cyber Docks into Grassrivers Digital Swamp — where your car morphs into a Cyber Airboat!' },
        { icon: '🔐', title: '4-Bit Binary &amp; ICT Relay Vault Breaches', desc: 'Hack secure cyber vaults by converting 8-4-2-1 binary nibbles and answering fast CS quizzes on HTTPS (Port 443), logic gates, DNS, and C++.' },
        { icon: '🚨', title: 'Wanted Heat 1★–5★, Nitro &amp; EMP Shockwave (E)', desc: 'Dodge VCPD Interceptor Drones, laser scanners, and 3★+ chopper spotlights, or trigger an EMP pulse to clear drones in range.' }
      ],
      guideTitle: 'How to Master Vice Leonida VI',
      guideSteps: [
        'Use A/D or Left/Right arrows (or mobile touch buttons) to weave smoothly across 4 neon lanes.',
        'Hold Space / Shift for Nitro Boost and press E to fire an EMP Shockwave when surrounded by VCPD drones.',
        'Press Q anytime to swap between Lucia and Jason: switch to Jason when you need the Kinetic Shield, and Lucia when farming Data Shards.',
        'Solve 4-bit binary vault breaches quickly to earn +300 bonus points and cool down your Wanted Heat stars.'
      ],
      faqs: [
        { q: 'Is Vice Leonida VI safe and age-appropriate for students aged 10–15?', a: 'Yes! Inspired by the State of Leonida setting and dual protagonists Lucia & Jason, the game contains zero real weapons or violence — replacing them with cyber drones, EMP pulses, and real CS/binary challenges.' },
        { q: 'Does it work on both desktop and mobile browsers?', a: 'Yes, it runs at 60 FPS with keyboard controls on desktop and dedicated touch controls on phones and tablets.' }
      ]
    },
    {
      subPath: path.join('duel', 'vice-leonida-1v1'),
      lang: 'ro',
      kind: 'duel',
      roUrl: 'https://www.arkyedu.com/duel/vice-leonida-1v1/',
      enUrl: 'https://www.arkyedu.com/duel/vice-leonida-1v1/en/',
      canonicalUrl: 'https://www.arkyedu.com/duel/vice-leonida-1v1/',
      appLaunchUrl: 'https://www.arkyedu.com/?mode=vice_leonida_duel',
      siblingUrl: 'https://www.arkyedu.com/arcade/vice-leonida-gta6/',
      siblingLabel: '🌴 Joacă Varianta Arcade Solo →',
      title: 'Vice Leonida 1v1: Duel GTA 6 Cyber-Heist Live & AI Bot | ArkyEdu',
      meta: 'Competiție 1v1 live în Vice Beach inspirată din GTA 6! Întrece-te până la 2.500 puncte Vault contra unui coleg sau Cyber-Bot Leonida AI cu Boost Gates TIC și 4 sabotaje în timp real.',
      keywords: 'vice leonida 1v1, duel gta 6 multiplayer, cyber heist 1v1 browser, duel tic 1v1, arkyedu duel vice leonida, cyber bot ai 1v1',
      badgeHero: 'Arena 1v1 Multiplayer &amp; AI Cyber-Bot · GTA 6 Edition',
      h1: 'Vice Leonida 1v1: Cyber-Heist Showdown Live &amp; AI Bot',
      lead: 'Cursă head-to-head până la 2.500 Vault Points pe autostrada neon Vice Beach! Intră prin porțile mov Boost Gate pentru întrebări TIC (+250 pts + 1 Attack Charge) și lansează 4 atacuri cibernetice directe asupra rivalului.',
      ctaLabel: '⚔️ Intră în Duelul Vice Leonida 1v1',
      highlightsTitle: 'Tactică PvP Live &amp; Sabotaje Cibernetice în Timp Real',
      highlights: [
        { icon: '🤝', title: 'Live Cloud PvP (Cod 4 Caractere) sau AI Bot', desc: 'Creează o cameră privată sincronizată prin Firestore pentru a te întrece cu un coleg, sau provoacă instant Cyber-Bot Leonida AI în antrenament solo.' },
        { icon: '⚡', title: 'Boost Gates TIC (+250 Vault Pts &amp; Attack Charge)', desc: 'Intră pe banda porții violet din cursă pentru o întrebare rapidă de informatică (HTTPS, binar, C++, porți logice) și încarcă-ți arsenalul de atac.' },
        { icon: '🚨', title: '4 Atacuri Live Asupra Rivalului', desc: 'Declanșează Drone VCPD 3★ (roadblock), Steer Glitch (inversează comenzile 4s), Bandwidth Throttle (curățat cu Flush Cache) sau Firewall Lock pe 4 biți!' },
        { icon: '🏆', title: 'Cursă de 90s / 2.500 Puncte cu XP &amp; Trofee', desc: 'Fiecare victorie adaugă puncte XP oficiale și victorii în statisticile de duel ale Carnetului Digital.' }
      ],
      guideTitle: 'Strategia de Victorie în Vice Leonida 1v1',
      guideSteps: [
        'Alege Lucia (punctaj +15% pe Data Shards) sau Jason (scut defensiv automat) în lobby înainte de start.',
        'Țintește porțile mov Boost Gate imediat ce apar pe cele 4 benzi pentru salturi de +250 puncte și încărcare Attack Charge.',
        'Păstrează un atac Firewall Lock sau Steer Glitch pentru ultimii 500 de metri ai rivalului pentru a-i opri avansul!',
        'Dacă primești Bandwidth Throttle, apasă imediat butonul Flush Cache pentru a-ți recăpăta viteza maximă.'
      ],
      faqs: [
        { q: 'Cum invit un coleg la un duel Vice Leonida 1v1?', a: 'Apasă „Creează Cameră PvP”, trimite colegului codul unic de 4 caractere, iar când amândoi sunteți pregătiți cursa începe simultan în timp real.' },
        { q: 'Pot juca și singur fără alt jucător online?', a: 'Da! Modul „VS AI Bot (Cyber-Bot Leonida)” simulează un adversar inteligent care colectează puncte și lansează sabotaje realiste.' }
      ]
    },
    {
      subPath: path.join('duel', 'vice-leonida-1v1', 'en'),
      lang: 'en',
      kind: 'duel',
      roUrl: 'https://www.arkyedu.com/duel/vice-leonida-1v1/',
      enUrl: 'https://www.arkyedu.com/duel/vice-leonida-1v1/en/',
      canonicalUrl: 'https://www.arkyedu.com/duel/vice-leonida-1v1/en/',
      appLaunchUrl: 'https://www.arkyedu.com/?mode=vice_leonida_duel&lang=en',
      siblingUrl: 'https://www.arkyedu.com/arcade/vice-leonida-gta6/en/',
      siblingLabel: '🌴 Play Solo Arcade Edition →',
      title: 'Vice Leonida 1v1: GTA 6 Cyber-Heist Live Showdown | ArkyEdu',
      meta: 'Compete live 1v1 in Vice Leonida Cyber-Heist Showdown! Race to 2,500 Vault Points against friends or Cyber-Bot Leonida AI with ICT Boost Gates & 4 real-time cyber attacks.',
      keywords: 'vice leonida 1v1, gta 6 multiplayer browser duel, cyber heist showdown 1v1, educational 1v1 racing game, arkyedu duel',
      badgeHero: '1v1 Live Multiplayer &amp; AI Cyber-Bot · GTA 6 Edition',
      h1: 'Vice Leonida 1v1: Cyber-Heist Showdown (Live PvP &amp; AI Bot)',
      lead: 'Race head-to-head to 2,500 Vault Points across neon Vice Beach! Hit purple Boost Gates for fast ICT challenges (+250 pts + 1 Attack Charge) and deploy 4 live cyber sabotages against your opponent.',
      ctaLabel: '⚔️ Launch Vice Leonida 1v1 Duel',
      highlightsTitle: 'Real-Time PvP Tactics &amp; 4 Live Cyber Sabotages',
      highlights: [
        { icon: '🤝', title: 'Live Firestore PvP Room or Cyber-Bot AI', desc: 'Host a 4-character room code to battle classmates in real time, or jump straight into solo duel practice against Cyber-Bot Leonida AI.' },
        { icon: '⚡', title: 'ICT Boost Gates (+250 Pts &amp; Attack Charge)', desc: 'Steer through purple highway gates to answer quick CS questions and charge your offensive sabotage bar.' },
        { icon: '🚨', title: '4 Live Sabotage Attacks', desc: 'Send VCPD 3★ Interceptor Drones, 4-second Steer Glitch, Bandwidth Throttle (cleared via Flush Cache), or a 4-bit Binary Firewall Lock.' },
        { icon: '🏆', title: '90-Second / 2,500-Point Dash with XP Rewards', desc: 'Every win logs XP and Vice Leonida 1v1 victory stats directly to your student profile.' }
      ],
      guideTitle: 'Winning Tactics for Vice Leonida 1v1',
      guideSteps: [
        'Pick Lucia for +15% shard scoring or Jason for passive crash absorption before entering the highway.',
        'Prioritize purple Boost Gates whenever they spawn — solving one grants +250 Vault Points and +1 Attack Charge.',
        'Save Firewall Lock or Steer Glitch for when your rival passes 1,800 points to swing the finish line!',
        'Click Flush Cache immediately whenever hit by Bandwidth Throttle to restore full top speed.'
      ],
      faqs: [
        { q: 'Do both players need accounts on the same computer?', a: 'No! You can duel across separate computers, phones, or school lab PCs simply by entering the 4-character room code.' },
        { q: 'Can I practice solo before challenging a friend?', a: 'Yes, choose the Cyber-Bot Leonida AI mode anytime for instant 1v1 practice.' }
      ]
    }
  ];

  specs.forEach((p) => {
    const outDir = path.join(publicDir, p.subPath);
    ensureDir(outDir);
    const isEn = p.lang === 'en';
    const altUrl = isEn ? p.roUrl : p.enUrl;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'VideoGame',
          '@id': `${p.canonicalUrl}#game`,
          name: p.kind === 'arcade' ? 'Vice Leonida VI: Cyber Runner' : 'Vice Leonida 1v1: Cyber-Heist Showdown',
          description: p.meta,
          url: p.canonicalUrl,
          genre: p.kind === 'arcade' ? ['Arcade', 'Educational', 'Cyberpunk Runner'] : ['Multiplayer 1v1', 'Arcade Racing', 'Educational'],
          playMode: p.kind === 'arcade' ? 'SinglePlayer' : ['MultiPlayer', 'SinglePlayer'],
          gamePlatform: ['Web Browser', 'Desktop', 'Mobile'],
          applicationCategory: 'Game',
          operatingSystem: 'All',
          isAccessibleForFree: true,
          inLanguage: p.lang,
          character: [
            { '@type': 'Person', name: 'Lucia Caminos' },
            { '@type': 'Person', name: 'Jason Duval' }
          ],
          gameLocation: {
            '@type': 'Place',
            name: 'State of Leonida (Vice Beach, Venetian Causeway, Port Gellhorn, Grassrivers)'
          },
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'RON' }
        },
        {
          '@type': 'SoftwareApplication',
          name: p.title,
          applicationCategory: 'GameApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'RON' }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: isEn ? 'Home' : 'Acasă', item: 'https://www.arkyedu.com/' },
            {
              '@type': 'ListItem',
              position: 2,
              name: p.kind === 'arcade' ? 'Arcade (30)' : 'Duel 1v1 (21+)',
              item: p.kind === 'arcade' ? 'https://www.arkyedu.com/arcade/' : 'https://www.arkyedu.com/duel/'
            },
            { '@type': 'ListItem', position: 3, name: p.h1, item: p.canonicalUrl }
          ]
        },
        {
          '@type': 'FAQPage',
          mainEntity: p.faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a }
          }))
        }
      ]
    };

    const html = `<!DOCTYPE html>
<html lang="${p.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtmlText(p.title)}</title>
  <meta name="description" content="${escapeHtmlText(p.meta)}">
  <meta name="keywords" content="${escapeHtmlText(p.keywords)}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${p.canonicalUrl}">
  <link rel="alternate" hreflang="ro" href="${p.roUrl}">
  <link rel="alternate" hreflang="en" href="${p.enUrl}">
  <link rel="alternate" hreflang="x-default" href="${p.roUrl}">
  <meta name="theme-color" content="#090d16">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtmlText(p.title)}">
  <meta property="og:description" content="${escapeHtmlText(p.meta)}">
  <meta property="og:url" content="${p.canonicalUrl}">
  <meta property="og:site_name" content="ArkyEdu TIC &amp; Arcade">
  <meta property="og:locale" content="${isEn ? 'en_US' : 'ro_RO'}">
  <meta property="og:locale:alternate" content="${isEn ? 'ro_RO' : 'en_US'}">
  <meta property="og:image" content="https://www.arkyedu.com/og-cover.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtmlText(p.title)}">
  <meta name="twitter:description" content="${escapeHtmlText(p.meta)}">
  <meta name="twitter:image" content="https://www.arkyedu.com/og-cover.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>
  <style>
${commonStyles}
  </style>
</head>
<body>
  <header>
    <div class="container header-content">
      <a href="https://www.arkyedu.com/" class="logo-box">
        <div class="logo-icon">🌴</div>
        <span class="logo-text">ArkyEdu <span style="color: #ec4899;">LEONIDA VI</span></span>
      </a>
      <nav class="nav-links">
        <a href="${isEn ? 'https://www.arkyedu.com/leonida/en/' : 'https://www.arkyedu.com/leonida/'}">${isEn ? 'Open-World Hub' : 'Open-World Hub'}</a>
        <a href="https://www.arkyedu.com/arcade/">Arcade (30)</a>
        <a href="https://www.arkyedu.com/duel/">Duel 1v1 (21+)</a>
        <a href="https://www.arkyedu.com/arcade/vice-leonida-gta6/">Vice Leonida Arcade</a>
        <a href="https://www.arkyedu.com/duel/vice-leonida-1v1/">Vice Leonida 1v1</a>
        <a href="https://www.arkyedu.com/sandbox/">Sandbox Cod</a>
      </nav>
      <div style="display:flex;align-items:center;gap:0.6rem;">
        <a href="${altUrl}" style="color:#94a3b8;text-decoration:none;font-weight:700;font-size:0.85rem;padding:0.4rem 0.7rem;border:1px solid #334155;border-radius:0.6rem;">${isEn ? 'RO' : 'EN'}</a>
        <a href="${p.appLaunchUrl}" class="nav-cta">
          <span>${isEn ? 'Play Live' : 'Joacă Live'}</span>
        </a>
      </div>
    </div>
  </header>

  <main class="container">
    <div class="hero-section">
      <div class="badge-bar">
        <span class="badge badge-green">${p.badgeHero}</span>
        <span class="badge badge-free">${isEn ? '100% Free · Zero Ads' : '100% Gratuit · Fără Reclame'}</span>
        <span class="badge">Lucia Caminos &amp; Jason Duval</span>
      </div>
      <h1>${p.h1}</h1>
      <p class="lead-text">${p.lead}</p>
      <div class="cta-group">
        <a href="${p.appLaunchUrl}" class="btn-primary">
          <span>${p.ctaLabel}</span>
        </a>
        <a href="${p.siblingUrl}" class="btn-secondary">
          <span>${p.siblingLabel}</span>
        </a>
      </div>
    </div>

    <section style="margin-bottom: 3rem;">
      <h2 style="font-size: 1.7rem; margin-bottom: 1.5rem; text-align: center;">${p.highlightsTitle}</h2>
      <div class="grid-2">
        ${p.highlights.map((h) => `
          <div class="card">
            <div class="card-icon">${h.icon}</div>
            <h3 class="card-title">${h.title}</h3>
            <p class="card-desc">${h.desc}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="content-box" style="background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 1.25rem; padding: 2rem; margin-bottom: 2.5rem;">
      <h2 style="font-size: 1.45rem; margin-bottom: 1rem;">🎮 ${p.guideTitle}</h2>
      <ol style="padding-left: 1.35rem; color: var(--text-secondary); line-height: 1.7;">
        ${p.guideSteps.map((s) => `<li style="margin-bottom: 0.65rem;">${escapeHtmlText(s)}</li>`).join('')}
      </ol>
    </section>

    <section class="content-box" style="background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 1.25rem; padding: 2rem; margin-bottom: 3rem;">
      <h2 style="font-size: 1.45rem; margin-bottom: 1.25rem;">❓ ${isEn ? 'Frequently Asked Questions' : 'Întrebări Frecvente'}</h2>
      ${p.faqs.map((f) => `
        <div class="faq-block" style="margin-bottom: 1rem;">
          <div class="faq-question" style="font-weight: 800; margin-bottom: 0.35rem;">${escapeHtmlText(f.q)}</div>
          <div class="faq-answer" style="color: var(--text-secondary);">${escapeHtmlText(f.a)}</div>
        </div>
      `).join('')}
    </section>
  </main>

  <footer>
    <div class="container">
      <div class="footer-bottom">
        <div>© 2026 ArkyEdu · State of Leonida Tech Edition (Ages 10–15)</div>
        <div><a href="https://www.arkyedu.com/" style="color: var(--accent); text-decoration: none;">arkyedu.com</a></div>
      </div>
    </div>
  </footer>
</body>
</html>`;

    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');
  });

  console.log('Generated bilingual Vice Leonida GTA 6 SEO pages (/arcade/vice-leonida-gta6/ & /duel/vice-leonida-1v1/).');
}

// 9B. GENERATE FLAGSHIP VICE LEONIDA OPEN-WORLD HUB (/leonida/, /leonida/en/, & /leonida-llm.txt)
function generateLeonidaUniversePages() {
  const renderHub = (lang: 'ro' | 'en') => {
    const isEn = lang === 'en';
    const outDir = isEn ? path.join(publicDir, 'leonida', 'en') : path.join(publicDir, 'leonida');
    ensureDir(outDir);

    const roUrl = 'https://www.arkyedu.com/leonida/';
    const enUrl = 'https://www.arkyedu.com/leonida/en/';
    const canonicalUrl = isEn ? enUrl : roUrl;
    const altUrl = isEn ? roUrl : enUrl;

    const title = isEn
      ? 'Vice Leonida: GTA 6 Open-World Game & State of Leonida CS Hub | ArkyEdu'
      : 'Vice Leonida: Joc Open-World GTA 6 & Universul Leonida TIC | ArkyEdu';
    const description = isEn
      ? 'Play Vice Leonida Open-World 2D free in browser! Explore all 6 State of Leonida GTA 6 districts (Vice City, Leonida Keys, Port Gellhorn, Grassrivers, Mount Kalaga, Ambrosia) with Lucia Caminos & Jason Duval, 5 vehicles, 5-star chases & CS challenges.'
      : 'Joacă gratuit Vice Leonida Open-World 2D direct în browser! Explorează cele 6 regiuni din GTA 6 Leonida (Vice City, Leonida Keys, Port Gellhorn, Grassrivers, Mount Kalaga, Ambrosia) cu Lucia Caminos & Jason Duval, 5 vehicule + Airboat și misiuni TIC.';
    const keywords = isEn
      ? 'gta 6 open world browser game, vice leonida open world, state of leonida 6 regions, lucia caminos jason duval game, gta 6 november 19 2026 tech breakdown, educational gta 6 coding game'
      : 'joc open world gta 6 browser, vice leonida open world, statul leonida 6 regiuni gta 6, lucia caminos jason duval joc tic, data lansare gta 6 19 noiembrie 2026, joc educativ gta 6 copii';

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['VideoGame', 'SoftwareApplication', 'LearningResource'],
          '@id': `${canonicalUrl}#openworld`,
          name: 'Vice Leonida: Open-World Story & State of Leonida Universe',
          alternateName: ['Vice Leonida Open-World GTA 6', 'State of Leonida CS Hub'],
          description,
          url: canonicalUrl,
          image: 'https://www.arkyedu.com/assets/leonida-hero.jpg',
          genre: ['Open-World', 'Educational', 'Action Adventure', 'Computer Science'],
          playMode: ['SinglePlayer', 'MultiPlayer'],
          gamePlatform: ['Web Browser', 'Desktop', 'Mobile'],
          applicationCategory: 'GameApplication',
          operatingSystem: 'All',
          isAccessibleForFree: true,
          inLanguage: lang,
          character: LEONIDA_CAST.map((c) => ({ '@type': 'Person', name: c.name })),
          gameLocation: LEONIDA_REGIONS.map((r) => ({
            '@type': 'Place',
            name: isEn ? r.nameEn : r.nameRo,
            description: isEn ? r.descriptionEn : r.descriptionRo
          })),
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'RON' }
        },
        {
          '@type': 'ItemList',
          name: isEn ? '6 Confirmed State of Leonida Regions' : 'Cele 6 Regiuni din Statul Leonida',
          itemListElement: LEONIDA_REGIONS.map((r, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: isEn ? r.nameEn : r.nameRo,
            description: isEn ? r.curriculumTopicEn : r.curriculumTopicRo
          }))
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: isEn ? 'Home' : 'Acasă', item: 'https://www.arkyedu.com/' },
            { '@type': 'ListItem', position: 2, name: 'Arcade (30)', item: 'https://www.arkyedu.com/arcade/' },
            { '@type': 'ListItem', position: 3, name: isEn ? 'Vice Leonida Open-World' : 'Vice Leonida Open-World', item: canonicalUrl }
          ]
        },
        {
          '@type': 'FAQPage',
          mainEntity: LEONIDA_FAQS.map((f) => ({
            '@type': 'Question',
            name: isEn ? f.qEn : f.qRo,
            acceptedAnswer: { '@type': 'Answer', text: isEn ? f.aEn : f.aRo }
          }))
        }
      ]
    };

    const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtmlText(title)}</title>
  <meta name="description" content="${escapeHtmlText(description)}">
  <meta name="keywords" content="${escapeHtmlText(keywords)}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="alternate" hreflang="ro" href="${roUrl}">
  <link rel="alternate" hreflang="en" href="${enUrl}">
  <link rel="alternate" hreflang="x-default" href="${roUrl}">
  <meta name="theme-color" content="#090d16">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtmlText(title)}">
  <meta property="og:description" content="${escapeHtmlText(description)}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="ArkyEdu TIC &amp; Arcade">
  <meta property="og:locale" content="${isEn ? 'en_US' : 'ro_RO'}">
  <meta property="og:locale:alternate" content="${isEn ? 'ro_RO' : 'en_US'}">
  <meta property="og:image" content="https://www.arkyedu.com/assets/leonida-hero.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtmlText(title)}">
  <meta name="twitter:description" content="${escapeHtmlText(description)}">
  <meta name="twitter:image" content="https://www.arkyedu.com/assets/leonida-hero.jpg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>
  <style>
${commonStyles}
    .hero-img { width: 100%; border-radius: 1rem; border: 1px solid #334155; margin-top: 1.5rem; aspect-ratio: 16/9; object-fit: cover; }
    .meta-line { font-size: 0.85rem; color: #f472b6; font-weight: 700; margin-bottom: 0.65rem; }
  </style>
</head>
<body>
  <header>
    <div class="container header-content">
      <a href="https://www.arkyedu.com/" class="logo-box">
        <div class="logo-icon">🗺️</div>
        <span class="logo-text">ArkyEdu <span style="color: #ec4899;">LEONIDA OPEN-WORLD</span></span>
      </a>
      <nav class="nav-links">
        <a href="https://www.arkyedu.com/arcade/">Arcade (30)</a>
        <a href="${isEn ? 'https://www.arkyedu.com/arcade/vice-leonida-gta6/en/' : 'https://www.arkyedu.com/arcade/vice-leonida-gta6/'}">Cyber Runner</a>
        <a href="${isEn ? 'https://www.arkyedu.com/duel/vice-leonida-1v1/en/' : 'https://www.arkyedu.com/duel/vice-leonida-1v1/'}">Duel 1v1</a>
        <a href="https://www.arkyedu.com/leonida-llm.txt">leonida-llm.txt</a>
      </nav>
      <div style="display:flex;align-items:center;gap:0.6rem;">
        <a href="${altUrl}" style="color:#94a3b8;text-decoration:none;font-weight:700;font-size:0.85rem;padding:0.4rem 0.7rem;border:1px solid #334155;border-radius:0.6rem;">${isEn ? 'RO' : 'EN'}</a>
        <a href="https://www.arkyedu.com/?game=vice_leonida_world${isEn ? '&lang=en' : ''}" class="nav-cta">
          <span>${isEn ? 'Play Open-World' : 'Joacă Open-World'}</span>
        </a>
      </div>
    </div>
  </header>

  <main class="container">
    <div class="hero-section">
      <div class="meta-line">
        GTA 6 (${GTA6_FACTS_2026.releaseDateEn}) · ${GTA6_FACTS_2026.platforms} · State of Leonida · 100% Free
      </div>
      <h1>${isEn ? 'Vice Leonida: Open-World Story &amp; GTA 6 CS Hub' : 'Vice Leonida: Open-World Story &amp; Universul GTA 6 TIC'}</h1>
      <p class="lead-text">${escapeHtmlText(description)}</p>
      <div class="cta-group">
        <a href="https://www.arkyedu.com/?game=vice_leonida_world${isEn ? '&lang=en' : ''}" class="btn-primary">
          <span>${isEn ? 'Play 2D Open-World Engine (0 Lei)' : 'Pornește Lumea Open-World 2D (0 Lei)'}</span>
        </a>
        <a href="${isEn ? 'https://www.arkyedu.com/arcade/vice-leonida-gta6/en/' : 'https://www.arkyedu.com/arcade/vice-leonida-gta6/'}" class="btn-secondary">
          <span>${isEn ? 'Play Cyber Runner Arcade →' : 'Joacă Cyber Runner Arcade →'}</span>
        </a>
        <a href="${isEn ? 'https://www.arkyedu.com/duel/vice-leonida-1v1/en/' : 'https://www.arkyedu.com/duel/vice-leonida-1v1/'}" class="btn-secondary">
          <span>${isEn ? 'Enter 1v1 Live Duel →' : 'Duel Live 1v1 →'}</span>
        </a>
      </div>
      <img src="https://www.arkyedu.com/assets/leonida-hero.jpg" alt="Vice Leonida Open-World GTA 6 Illustration" class="hero-img" loading="eager">
    </div>

    <section style="margin-bottom: 3rem;">
      <h2 style="font-size: 1.7rem; margin-bottom: 1.25rem; text-align: center;">
        ${isEn ? '6 Confirmed State of Leonida Regions &amp; ICT Quests' : 'Cele 6 Regiuni Confirmate din Statul Leonida &amp; Misiuni TIC'}
      </h2>
      <img src="https://www.arkyedu.com/assets/leonida-map.jpg" alt="State of Leonida Tactical Radar Map" class="hero-img" style="margin-bottom: 1.5rem; margin-top: 0;" loading="lazy">
      <div class="grid-3">
        ${LEONIDA_REGIONS.map((r) => `
          <article class="card">
            <div style="font-size:0.78rem;color:#38bdf8;font-weight:700;margin-bottom:0.35rem;">${escapeHtmlText(isEn ? r.subtitleEn : r.subtitleRo)}</div>
            <h3 class="card-title">${escapeHtmlText(isEn ? r.nameEn : r.nameRo)}</h3>
            <p class="card-desc">${escapeHtmlText(isEn ? r.descriptionEn : r.descriptionRo)}</p>
            <div style="font-size:0.8rem;color:#34d399;font-weight:700;margin-top:0.5rem;">${escapeHtmlText(isEn ? r.curriculumTopicEn : r.curriculumTopicRo)}</div>
          </article>
        `).join('')}
      </div>
    </section>

    <section class="content-box" style="background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 1.25rem; padding: 2rem; margin-bottom: 2.5rem;">
      <h2 style="font-size: 1.55rem; margin-bottom: 1rem;">
        ${isEn ? 'Lucia Caminos, Jason Duval &amp; Verified GTA 6 Cast Roster' : 'Lucia Caminos, Jason Duval &amp; Personajele Oficiale din Leonida'}
      </h2>
      <img src="https://www.arkyedu.com/assets/leonida-duo.jpg" alt="Lucia Caminos and Jason Duval Cyber Agents" class="hero-img" style="margin-bottom: 1.5rem; margin-top: 0;" loading="lazy">
      <div class="grid-2">
        ${LEONIDA_CAST.map((c) => `
          <div class="card">
            <h3 class="card-title">${escapeHtmlText(c.name)} — ${escapeHtmlText(isEn ? c.roleEn : c.roleRo)}</h3>
            <p class="card-desc">${escapeHtmlText(isEn ? c.bioEn : c.bioRo)}</p>
            <div style="font-size:0.8rem;color:#f59e0b;font-weight:700;margin-top:0.4rem;">${escapeHtmlText(isEn ? c.perkEn : c.perkRo)}</div>
          </div>
        `).join('')}
      </div>
    </section>

    <section style="margin-bottom: 2.5rem;">
      <h2 style="font-size: 1.55rem; margin-bottom: 1.25rem; text-align: center;">
        ${isEn ? 'Drivable Vehicle Fleet &amp; GTA 6 Engine Tech Bridges' : 'Flota de Vehicule &amp; Tehnologia GTA 6 Explicată pentru Elevi'}
      </h2>
      <div class="grid-2">
        ${LEONIDA_TECH_BRIDGES.map((tb) => `
          <div class="card">
            <div style="font-size:0.78rem;color:#34d399;font-weight:700;margin-bottom:0.35rem;">${escapeHtmlText(isEn ? tb.curriculumLinkEn : tb.curriculumLinkRo)}</div>
            <h3 class="card-title">${escapeHtmlText(isEn ? tb.techTopicEn : tb.techTopicRo)}</h3>
            <p class="card-desc">${escapeHtmlText(isEn ? tb.gta6FeatureEn : tb.gta6FeatureRo)}</p>
            <a href="https://www.arkyedu.com/cursuri/${tb.missionId}/" class="card-link">${isEn ? 'Study Related Lesson →' : 'Deschide Lecția Asociată →'}</a>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="content-box" style="background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 1.25rem; padding: 2rem; margin-bottom: 3rem;">
      <h2 style="font-size: 1.5rem; margin-bottom: 1.25rem;">${isEn ? 'Frequently Asked Questions — GTA 6 &amp; Vice Leonida' : 'Întrebări Frecvente — GTA 6 &amp; Vice Leonida'}</h2>
      ${LEONIDA_FAQS.map((f) => `
        <div class="faq-block" style="margin-bottom: 1rem;">
          <div class="faq-question" style="font-weight: 800; margin-bottom: 0.35rem;">${escapeHtmlText(isEn ? f.qEn : f.qRo)}</div>
          <div class="faq-answer" style="color: var(--text-secondary);">${escapeHtmlText(isEn ? f.aEn : f.aRo)}</div>
        </div>
      `).join('')}
    </section>
  </main>

  <footer>
    <div class="container">
      <div class="footer-bottom">
        <div>© 2026 ArkyEdu · State of Leonida Open-World CS Universe (Ages 10–15)</div>
        <div><a href="https://www.arkyedu.com/" style="color: var(--accent);">arkyedu.com</a> · <a href="https://www.arkyedu.com/leonida-llm.txt" style="color: #f472b6;">leonida-llm.txt</a></div>
      </div>
    </div>
  </footer>
</body>
</html>`;

    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');
  };

  renderHub('ro');
  renderHub('en');

  // Generate dedicated Markdown RAG feed (/public/leonida-llm.txt)
  const llmLines: string[] = [
    '# ArkyEdu Vice Leonida — GTA 6 Open-World Game & Computer Science Universe (RO & EN)',
    '',
    '> Document de referință structurat pentru motoare de răspuns AI (ChatGPT Search, Perplexity, Gemini, Claude). Prezintă universul interactiv gratuit Vice Leonida din platforma ArkyEdu: joc Open-World 2D jucabil în browser, Cyber Runner Arcade și Duel Live 1v1, inspirate din Grand Theft Auto VI (lansat oficial 19 noiembrie 2026 pe PS5 și Xbox Series X|S).',
    '',
    '- Hub Open-World Română: https://www.arkyedu.com/leonida/',
    '- Hub Open-World Engleză: https://www.arkyedu.com/leonida/en/',
    '- Lansare directă joc Open-World: https://www.arkyedu.com/?game=vice_leonida_world',
    '- Arcade Cyber Runner: https://www.arkyedu.com/arcade/vice-leonida-gta6/',
    '- Duel Live 1v1 Showdown: https://www.arkyedu.com/duel/vice-leonida-1v1/',
    '- Documentație generală platformă: https://www.arkyedu.com/llms.txt',
    '',
    '---',
    '',
    '## 1. Fapte Verificate GTA 6 & Siguranță Educațională',
    `- **Data lansării oficiale GTA 6**: ${GTA6_FACTS_2026.releaseDateRo} (${GTA6_FACTS_2026.releaseDateEn})`,
    `- **Trailer 2**: ${GTA6_FACTS_2026.trailer2DateRo} (${GTA6_FACTS_2026.trailer2DateEn})`,
    `- **Platforme oficiale**: ${GTA6_FACTS_2026.platforms}`,
    `- **Protagoniști confirmați**: ${LEONIDA_CAST.filter((c) => c.playable).map((c) => c.name).join(' & ')}`,
    '- **Adaptare ArkyEdu pentru elevi 10–15 ani**: 0% violență sau arme reale; toată acțiunea folosește impulsuri EMP, drone de scanare VCPD, condus tactic în 5 vehicule + Hydro-Airboat și 6 misiuni de poveste TIC (Binar, C++, Excel, Arduino IoT, Securitate HTTPS/2FA).',
    '',
    '---',
    '',
    '## 2. Cele 6 Regiuni ale Statului Leonida (Hartă Open-World 2600×1800)',
    ...LEONIDA_REGIONS.map(
      (r, idx) =>
        `${idx + 1}. **${r.nameRo}** (${r.subtitleRo}): ${r.descriptionRo} — *Temă TIC*: ${r.curriculumTopicRo}`
    ),
    '',
    '---',
    '',
    '## 3. Distribuția Oficială (Personaje din Leonida)',
    ...LEONIDA_CAST.map(
      (c) => `- **${c.name}** (${c.roleRo} · ${c.homeDistrict}): ${c.bioRo} — *Bonus joc*: ${c.perkRo}`
    ),
    '',
    '---',
    '',
    '## 4. Flota Conducibilă în Open-World (5 Vehicule)',
    ...LEONIDA_VEHICLES.map(
      (v) => `- **${v.nameRo}** (${v.categoryRo}): Viteză max ${v.maxSpeed} px/s, Armură ${v.armor} HP${v.canWater ? ' [Amfibiu — navighează pe apele Grassrivers]' : ''}`
    ),
    '',
    '---',
    '',
    '## 5. Cele 6 Misiuni de Poveste TIC (Open-World Story Challenges)',
    ...LEONIDA_STORY_CHALLENGES.map(
      (ch, idx) => `${idx + 1}. **${ch.titleRo}** (${ch.curriculumTagRo}): ${ch.briefingRo} — Recompensă: +${ch.rewardCash}$ / +${ch.rewardXP} XP / +${ch.rewardCoins} ByteCoins`
    ),
    '',
    '---',
    '',
    '## 6. Punți Tehnologice GTA 6 -> Programa Școlară TIC (Clasele V–VIII)',
    ...LEONIDA_TECH_BRIDGES.map(
      (tb) => `- **${tb.techTopicRo}** (${tb.curriculumLinkRo}): ${tb.gta6FeatureRo} -> https://www.arkyedu.com/cursuri/${tb.missionId}/`
    ),
    '',
    '---',
    '',
    '## 7. Întrebări Frecvente (FAQ)',
    ...LEONIDA_FAQS.flatMap((f) => [`**Î: ${f.qRo}**`, `R: ${f.aRo}`, ''])
  ];

  fs.writeFileSync(path.join(publicDir, 'leonida-llm.txt'), llmLines.join('\n'), 'utf-8');
  console.log('Generated flagship bilingual Leonida Universe Hub (/leonida/, /leonida/en/) and public/leonida-llm.txt.');
}

// 9C. GENERATE AI LITERACY & DEEPFAKE FORENSICS LAB (/laborator-ai/, /laborator-ai/en/, & /laborator-ai-llm.txt)
function generateAiLabPages() {
  const renderHub = (lang: 'ro' | 'en') => {
    const isEn = lang === 'en';
    const outDir = isEn ? path.join(publicDir, 'laborator-ai', 'en') : path.join(publicDir, 'laborator-ai');
    ensureDir(outDir);

    const roUrl = 'https://www.arkyedu.com/laborator-ai/';
    const enUrl = 'https://www.arkyedu.com/laborator-ai/en/';
    const canonicalUrl = isEn ? enUrl : roUrl;
    const altUrl = isEn ? roUrl : enUrl;

    const title = isEn
      ? 'AI Literacy & Deepfake Forensics Lab (Tokenizer, Softmax, C.R.I.F.) | ArkyEdu'
      : 'Laboratorul AI & Detector Deepfake (Tokenizator, Halucinații, C.R.I.F.) | ArkyEdu';
    const description = isEn
      ? 'Interactive school-safe AI & Deepfake Forensics Lab in browser (ages 10-15): live BPE subword tokenizer, Softmax Temperature simulator, 6 AI photo/voice/video deepfake inspection cases, and C.R.I.F. prompt builder.'
      : 'Laborator interactiv de Literație AI și Detecție Deepfake în browser pentru elevi 10–15 ani: Tokenizator BPE live, simulator Temperatură Softmax & halucinații, 6 cazuri criminalistice Deepfake foto/audio/video și constructor prompturi C.R.I.F.';
    const keywords = isEn
      ? 'ai literacy lab students, deepfake detector game kids, bpe tokenizer simulator, softmax temperature hallucinations explained, c2pa exif image forensics, voice clone scam prevention, crif prompt engineering middle school'
      : 'laborator ai elevi romania, detector deepfake copii, cum functioneaza chatgpt tokeni temperatura, halucinatii ai explicatii scoala, verificare poza ai exif c2pa, clona vocala whatsapp 2fa, prompt engineering metoda crif rccl';

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['LearningResource', 'SoftwareApplication'],
          '@id': `${canonicalUrl}#ailab`,
          name: isEn ? 'ArkyEdu AI Literacy & Deepfake Forensics Lab' : 'Laboratorul AI & Detector Deepfake ArkyEdu',
          description,
          url: canonicalUrl,
          image: 'https://www.arkyedu.com/assets/ai-lab-hero.jpg',
          applicationCategory: 'EducationalApplication',
          educationalLevel: isEn ? 'Grades 5-8 (Ages 10-15)' : 'Clasele V-VIII (10-15 ani)',
          operatingSystem: 'All',
          isAccessibleForFree: true,
          inLanguage: lang,
          teaches: isEn
            ? ['Subword BPE Tokenization', 'Softmax Probability & AI Hallucinations', 'Deepfake Image EXIF/C2PA Forensics', 'Voice Clone & Lip-Sync Scam Prevention', 'C.R.I.F. Responsible Prompt Engineering']
            : ['Tokenizare BPE', 'Probabilități Softmax și Halucinații LLM', 'Criminalistică EXIF/C2PA pentru Imagini Deepfake', 'Prevenție Clonare Vocală și Lip-Sync Scam', 'Inginerie Prompturi Etice C.R.I.F.'],
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'RON' }
        },
        {
          '@type': 'ItemList',
          name: isEn ? '6 Interactive Deepfake & Media Forensics Cases' : '6 Cazuri Interactive de Investigație Deepfake & Media',
          itemListElement: DEEPFAKE_FORENSIC_CASES.map((c, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: isEn ? c.titleEn : c.titleRo,
            description: isEn ? c.verdictExplanationEn : c.verdictExplanationRo
          }))
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: isEn ? 'Home' : 'Acasă', item: 'https://www.arkyedu.com/' },
            { '@type': 'ListItem', position: 2, name: isEn ? 'AI & Deepfake Lab' : 'Laborator AI & Deepfake', item: canonicalUrl }
          ]
        },
        {
          '@type': 'FAQPage',
          mainEntity: AI_LAB_FAQS.map((f) => ({
            '@type': 'Question',
            name: isEn ? f.qEn : f.qRo,
            acceptedAnswer: { '@type': 'Answer', text: isEn ? f.aEn : f.aRo }
          }))
        }
      ]
    };

    const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtmlText(title)}</title>
  <meta name="description" content="${escapeHtmlText(description)}">
  <meta name="keywords" content="${escapeHtmlText(keywords)}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="alternate" hreflang="ro" href="${roUrl}">
  <link rel="alternate" hreflang="en" href="${enUrl}">
  <link rel="alternate" hreflang="x-default" href="${roUrl}">
  <meta name="theme-color" content="#090d16">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtmlText(title)}">
  <meta property="og:description" content="${escapeHtmlText(description)}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="ArkyEdu TIC &amp; AI Lab">
  <meta property="og:locale" content="${isEn ? 'en_US' : 'ro_RO'}">
  <meta property="og:locale:alternate" content="${isEn ? 'ro_RO' : 'en_US'}">
  <meta property="og:image" content="https://www.arkyedu.com/assets/ai-lab-hero.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtmlText(title)}">
  <meta name="twitter:description" content="${escapeHtmlText(description)}">
  <meta name="twitter:image" content="https://www.arkyedu.com/assets/ai-lab-hero.jpg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>
  <style>
${commonStyles}
    .hero-img { width: 100%; border-radius: 1rem; border: 1px solid #334155; margin-top: 1.5rem; aspect-ratio: 16/9; object-fit: cover; }
    .evidence-img { width: 100%; border-radius: 0.75rem; border: 1px solid #334155; aspect-ratio: 4/3; object-fit: cover; margin-bottom: 1rem; }
    .meta-line { font-size: 0.85rem; color: #22d3ee; font-weight: 700; margin-bottom: 0.65rem; }
  </style>
</head>
<body>
  <header>
    <div class="container header-content">
      <a href="https://www.arkyedu.com/" class="logo-box">
        <div class="logo-icon">🧠</div>
        <span class="logo-text">ArkyEdu <span style="color: #22d3ee;">AI &amp; DEEPFAKE LAB</span></span>
      </a>
      <nav class="nav-links">
        <a href="https://www.arkyedu.com/">${isEn ? 'Courses' : 'Cursuri'}</a>
        <a href="https://www.arkyedu.com/arcade/">Arcade (30)</a>
        <a href="${isEn ? 'https://www.arkyedu.com/glosar/en/' : 'https://www.arkyedu.com/glosar/'}">${isEn ? 'Glossary' : 'Glosar'}</a>
        <a href="https://www.arkyedu.com/laborator-ai-llm.txt">laborator-ai-llm.txt</a>
      </nav>
      <div style="display:flex;align-items:center;gap:0.6rem;">
        <a href="${altUrl}" style="color:#94a3b8;text-decoration:none;font-weight:700;font-size:0.85rem;padding:0.4rem 0.7rem;border:1px solid #334155;border-radius:0.6rem;">${isEn ? 'RO' : 'EN'}</a>
        <a href="https://www.arkyedu.com/?view=ailab${isEn ? '&lang=en' : ''}" class="nav-cta">
          <span>${isEn ? 'Launch AI Lab' : 'Deschide Simulatorul'}</span>
        </a>
      </div>
    </div>
  </header>

  <main class="container">
    <div class="hero-section">
      <div class="meta-line">
        ${isEn ? 'Zero Open Chatbot · 100% School-Safe · Ages 10–15 · Free Forever' : 'Fără Chat Nesupravegheat · 100% Sigur în Browser · Clasele V–VIII · 0 Lei'}
      </div>
      <h1>${isEn ? 'AI Literacy &amp; Deepfake Forensics Lab' : 'Laboratorul AI &amp; Detector Deepfake'}</h1>
      <p class="lead-text">${escapeHtmlText(description)}</p>
      <div class="cta-group">
        <a href="https://www.arkyedu.com/laborator-ai/" onclick="window.location.href='/laborator-ai/';" class="btn-primary">
          <span>${isEn ? 'Open Interactive Workbench →' : 'Deschide Simulatorul Interactiv →'}</span>
        </a>
        <a href="https://www.arkyedu.com/?game=detective${isEn ? '&lang=en' : ''}" class="btn-secondary">
          <span>${isEn ? 'Play CyberSafe Phishing Arcade →' : 'Joacă Detectivul Phishing Arcade →'}</span>
        </a>
        <a href="${isEn ? 'https://www.arkyedu.com/glosar/en/llm-and-ai-hallucinations/' : 'https://www.arkyedu.com/glosar/llm-and-ai-hallucinations/'}" class="btn-secondary">
          <span>${isEn ? 'LLM &amp; Hallucinations Glossary →' : 'Glosar LLM &amp; Halucinații →'}</span>
        </a>
      </div>
      <img src="https://www.arkyedu.com/assets/ai-lab-hero.jpg" alt="ArkyEdu AI Literacy and Deepfake Forensics Lab Workbench" class="hero-img" loading="eager">
    </div>

    <section style="margin-bottom: 3rem;">
      <h2 style="font-size: 1.7rem; margin-bottom: 1.25rem; text-align: center;">
        ${isEn ? '1. Inside an LLM: Subword Tokenization, Softmax Temperature &amp; Hallucinations' : '1. În interiorul unui LLM: Tokenizare, Temperatură Softmax &amp; Halucinații'}
      </h2>
      <div class="grid-2">
        ${TOKENIZER_PRESETS.map((tp) => `
          <article class="card">
            <div style="font-size:0.78rem;color:#22d3ee;font-weight:700;margin-bottom:0.35rem;">${escapeHtmlText(isEn ? tp.labelEn : tp.labelRo)}</div>
            <h3 class="card-title" style="font-family:monospace;font-size:0.95rem;">${escapeHtmlText(isEn ? tp.textEn : tp.textRo)}</h3>
            <p class="card-desc">${escapeHtmlText(isEn ? tp.noteEn : tp.noteRo)}</p>
          </article>
        `).join('')}
      </div>
      <div class="grid-2" style="margin-top: 1.25rem;">
        ${HALLUCINATION_STRESS_TESTS.map((ht) => `
          <article class="card">
            <div style="font-size:0.78rem;color:#f59e0b;font-weight:700;margin-bottom:0.35rem;">${escapeHtmlText(isEn ? ht.subjectEn : ht.subjectRo)}</div>
            <h3 class="card-title">${escapeHtmlText(isEn ? ht.promptEn : ht.promptRo)}</h3>
            <p class="card-desc">${escapeHtmlText(isEn ? ht.correctionEn : ht.correctionRo)}</p>
            <a href="https://www.arkyedu.com/cursuri/${ht.relatedMissionId}/" class="card-link">${isEn ? 'Related Lesson →' : 'Lecția Asociată →'}</a>
          </article>
        `).join('')}
      </div>
    </section>

    <section style="margin-bottom: 3rem;">
      <h2 style="font-size: 1.7rem; margin-bottom: 1.25rem; text-align: center;">
        ${isEn ? '2. Deepfake Forensics Lab: 6 Photo, Voice, Video &amp; News Investigations' : '2. Detectorul Deepfake: 6 Cazuri Criminalistice Foto, Audio, Video &amp; Știri'}
      </h2>
      <div class="grid-2" style="margin-bottom: 1.5rem;">
        <div class="card">
          <img src="https://www.arkyedu.com/assets/ai-evidence-fake.jpg" alt="Synthetic AI-generated school robotics fair photo with garbled text clues" class="evidence-img" loading="lazy">
          <h3 class="card-title">${isEn ? 'Visual Evidence A: Spot AI Artifacts (Garbled Text &amp; Anatomy)' : 'Probă Vizuală A: Artefacte AI (Text Corupt &amp; Anatomie)'}</h3>
          <p class="card-desc">${isEn ? 'Notice the garbled "GGRLLB...SDFKJHS" banner text, melted badge details, and missing authentic camera EXIF.' : 'Observă textul corupt de pe bannerul din perete („GGRLLB...SDFKJHS”), ecusonul topit și absența EXIF-ului real.'}</p>
        </div>
        <div class="card">
          <img src="https://www.arkyedu.com/assets/ai-evidence-real.jpg" alt="Authentic 35mm classroom Arduino electronics lab photograph" class="evidence-img" loading="lazy">
          <h3 class="card-title">${isEn ? 'Visual Evidence B: Authentic 35mm Classroom Arduino Photo' : 'Probă Vizuală B: Fotografie Autentică 35mm Arduino Uno'}</h3>
          <p class="card-desc">${isEn ? 'Consistent daylight shadows, logical breadboard jumper wires, authentic hands, and verified camera capture telemetry.' : 'Umbre consecvente spre fereastră, fire Arduino coerente, mâini naturale și metadate optice autentice.'}</p>
        </div>
      </div>
      <div class="grid-3">
        ${DEEPFAKE_FORENSIC_CASES.map((dc) => `
          <article class="card">
            <div style="font-size:0.78rem;color:${dc.isDeepfake ? '#fb7185' : '#34d399'};font-weight:700;margin-bottom:0.35rem;">
              ${escapeHtmlText(dc.isDeepfake ? (isEn ? 'SYNTHETIC / DEEPFAKE' : 'DEEPFAKE / SINTETIC') : (isEn ? 'AUTHENTIC VERIFIED' : 'AUTENTIC VERIFICAT'))} · +${dc.rewardCoins} ByteCoins
            </div>
            <h3 class="card-title">${escapeHtmlText(isEn ? dc.titleEn : dc.titleRo)}</h3>
            <p class="card-desc">${escapeHtmlText(isEn ? dc.verdictExplanationEn : dc.verdictExplanationRo)}</p>
          </article>
        `).join('')}
      </div>
    </section>

    <section class="content-box" style="background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 1.25rem; padding: 2rem; margin-bottom: 2.5rem;">
      <h2 style="font-size: 1.55rem; margin-bottom: 1rem;">
        ${isEn ? '3. C.R.I.F. Prompt Engineering &amp; National Curriculum Bridges' : '3. Constructor Prompturi C.R.I.F. &amp; Punți cu Programa Școlară TIC'}
      </h2>
      <div class="grid-3" style="margin-bottom: 1.5rem;">
        ${PROMPT_ARCHITECT_CHALLENGES.map((ch) => `
          <div class="card">
            <h3 class="card-title">${escapeHtmlText(isEn ? ch.titleEn : ch.titleRo)}</h3>
            <p class="card-desc">${escapeHtmlText(isEn ? ch.goalEn : ch.goalRo)}</p>
          </div>
        `).join('')}
      </div>
      <div class="grid-2">
        ${AI_CURRICULUM_BRIDGES.map((br) => `
          <div class="card">
            <div style="font-size:0.78rem;color:#34d399;font-weight:700;margin-bottom:0.35rem;">${escapeHtmlText(isEn ? br.gradeEn : br.gradeRo)}</div>
            <h3 class="card-title">${escapeHtmlText(isEn ? br.titleEn : br.titleRo)}</h3>
            <p class="card-desc">${escapeHtmlText(isEn ? br.descriptionEn : br.descriptionRo)}</p>
            <a href="https://www.arkyedu.com/cursuri/${br.missionId}/" class="card-link">${isEn ? 'Open Curriculum Lesson →' : 'Deschide Lecția TIC →'}</a>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="content-box" style="background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 1.25rem; padding: 2rem; margin-bottom: 3rem;">
      <h2 style="font-size: 1.5rem; margin-bottom: 1.25rem;">${isEn ? 'Frequently Asked Questions — AI &amp; Deepfake Lab' : 'Întrebări Frecvente — Laborator AI &amp; Deepfake'}</h2>
      ${AI_LAB_FAQS.map((f) => `
        <div class="faq-block" style="margin-bottom: 1rem;">
          <div class="faq-question" style="font-weight: 800; margin-bottom: 0.35rem;">${escapeHtmlText(isEn ? f.qEn : f.qRo)}</div>
          <div class="faq-answer" style="color: var(--text-secondary);">${escapeHtmlText(isEn ? f.aEn : f.aRo)}</div>
        </div>
      `).join('')}
    </section>
  </main>

  <footer>
    <div class="container">
      <div class="footer-bottom">
        <div>© 2026 ArkyEdu · AI Literacy &amp; Deepfake Forensics Lab (Ages 10–15)</div>
        <div><a href="https://www.arkyedu.com/" style="color: var(--accent);">arkyedu.com</a> · <a href="https://www.arkyedu.com/laborator-ai-llm.txt" style="color: #22d3ee;">laborator-ai-llm.txt</a></div>
      </div>
    </div>
  </footer>
</body>
</html>`;

    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');
  };

  renderHub('ro');
  renderHub('en');

  const llmLines: string[] = [
    '# ArkyEdu Laboratorul AI & Detector Deepfake (RO & EN — School-Safe Browser Lab)',
    '',
    '> Document structurat pentru motoare de răspuns AI (ChatGPT Search, Perplexity, Gemini, Claude). Prezintă Laboratorul interactiv AI & Deepfake ArkyEdu pentru elevi 10–15 ani (Clasele V–VIII): 100% determinist în browser, fără chatbot deschis nesupravegheat, fără chei API și gratuit.',
    '',
    '- Hub Română: https://www.arkyedu.com/laborator-ai/',
    '- Hub Engleză: https://www.arkyedu.com/laborator-ai/en/',
    '- Glosar LLM & Halucinații: https://www.arkyedu.com/glosar/llm-and-ai-hallucinations/',
    '- Arcade Detectiv CyberSafe Phishing: https://www.arkyedu.com/?game=detective',
    '- Documentație platformă: https://www.arkyedu.com/llms.txt',
    '',
    '---',
    '',
    '## 1. Simulare Internă LLM (Tokenizare BPE, Temperatură Softmax & Halucinații)',
    '- **Tokenizator BPE Live**: Arată cum cuvintele lungi, diacriticele românești (ă, î, â, ș, ț), numerele și operatorii C++/Excel (`==`, `<<`, `=COUNTIF`) devin ID-uri numerice de sub-tokeni.',
    '- **Slider Temperatură Softmax (0.10 – 1.50)**: Elevii ajustează temperatura în timp real și observă distribuția probabilităților Next-Token pentru C++ (`%` modulo), Robotică Arduino (`220 ohmi`) și scriere creativă.',
    '- **Detector de Halucinații (4 Teste Practice)**:',
    ...HALLUCINATION_STRESS_TESTS.map(
      (ht, idx) => `${idx + 1}. **${ht.subjectRo}** — Prompt: ${ht.promptRo} -> *Explicație*: ${ht.correctionRo}`
    ),
    '',
    '---',
    '',
    '## 2. Detectivul Deepfake (6 Cazuri Criminalistice: Foto, Audio, Video & Știri)',
    ...DEEPFAKE_FORENSIC_CASES.map(
      (dc, idx) =>
        `${idx + 1}. **${dc.titleRo}** [${dc.isDeepfake ? 'DEEPFAKE / SINTETIC' : 'AUTENTIC'}] (+${dc.rewardCoins} ByteCoins): ${dc.verdictExplanationRo}`
    ),
    '',
    '---',
    '',
    '## 3. Arhitectul de Prompturi Responsabile (Metoda C.R.I.F.)',
    ...PROMPT_ARCHITECT_CHALLENGES.map(
      (ch, idx) => `${idx + 1}. **${ch.titleRo}**: ${ch.goalRo} — *Rezultat optim*: ${ch.goodPreviewRo}`
    ),
    '',
    '---',
    '',
    '## 4. Punți cu Programa Școlară TIC (Clasele V–VIII)',
    ...AI_CURRICULUM_BRIDGES.map(
      (br) => `- **${br.gradeRo} · ${br.titleRo}**: ${br.descriptionRo} -> https://www.arkyedu.com/cursuri/${br.missionId}/`
    ),
    '',
    '---',
    '',
    '## 5. Întrebări Frecvente (FAQ)',
    ...AI_LAB_FAQS.flatMap((f) => [`**Î: ${f.qRo}**`, `R: ${f.aRo}`, ''])
  ];

  fs.writeFileSync(path.join(publicDir, 'laborator-ai-llm.txt'), llmLines.join('\n'), 'utf-8');
  console.log('Generated bilingual AI & Deepfake Lab (/laborator-ai/, /laborator-ai/en/) and public/laborator-ai-llm.txt.');
}

// 10. GENERATE BILINGUAL WORKSHEETS, GRADED EXAMS & OLYMPIAD SHEETS (/fise/ & /fise/en/)
function generateWorksheetsPages() {
  const fiseRoDir = path.join(publicDir, 'fise');
  const fiseEnDir = path.join(fiseRoDir, 'en');
  ensureDir(fiseRoDir);
  ensureDir(fiseEnDir);

  const renderHub = (lang: 'ro' | 'en') => {
    const isEn = lang === 'en';
    const canonicalUrl = isEn ? 'https://www.arkyedu.com/fise/en/' : 'https://www.arkyedu.com/fise/';
    const roUrl = 'https://www.arkyedu.com/fise/';
    const enUrl = 'https://www.arkyedu.com/fise/en/';
    const title = isEn
      ? 'ICT Worksheets, Graded Exams (1–10) & C++ Olympiad Bank | ArkyEdu'
      : 'Fișe de Lucru, Teste cu Barem 1–10 & Subiecte OJI TIC (V–VIII) | ArkyEdu';
    const description = isEn
      ? '16 free interactive and A4 printable ICT, Scratch, C++, Excel, HTML5 & Arduino Smart City worksheets with official 100-point rubrics for Grades 5–8.'
      : '16 fișe de lucru și teste cu barem oficial 1–10 (100p) pentru clasele V–VIII: Hardware, Scratch, C++ (cu Trace RAM), Excel, HTML5 & Arduino Smart City. Tipărire A4 gratuită.';

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          name: title,
          description,
          url: canonicalUrl,
          inLanguage: isEn ? 'en' : 'ro',
          isAccessibleForFree: true
        },
        {
          '@type': 'ItemList',
          numberOfItems: WORKSHEETS_BANK.length,
          itemListElement: WORKSHEETS_BANK.map((w, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: isEn ? w.en.title : w.ro.title,
            url: isEn ? `https://www.arkyedu.com/fise/en/${w.en.slug}/` : `https://www.arkyedu.com/fise/${w.ro.slug}/`
          }))
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: isEn ? 'Home' : 'Acasă', item: 'https://www.arkyedu.com/' },
            { '@type': 'ListItem', position: 2, name: isEn ? 'Worksheets & Exams' : 'Fișe & Teste cu Barem', item: canonicalUrl }
          ]
        }
      ]
    };

    const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtmlText(title)}</title>
  <meta name="description" content="${escapeHtmlText(description)}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="alternate" hreflang="ro" href="${roUrl}">
  <link rel="alternate" hreflang="en" href="${enUrl}">
  <link rel="alternate" hreflang="x-default" href="${roUrl}">
  <meta name="theme-color" content="#090d16">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtmlText(title)}">
  <meta property="og:description" content="${escapeHtmlText(description)}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="https://www.arkyedu.com/og-cover.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtmlText(title)}">
  <meta name="twitter:description" content="${escapeHtmlText(description)}">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  <style>${commonStyles}</style>
</head>
<body>
  <header>
    <div class="container header-content">
      <a href="https://www.arkyedu.com/" class="logo-box">
        <div class="logo-icon">📝</div>
        <span class="logo-text">ArkyEdu <span style="color: var(--accent);">${isEn ? 'WORKSHEETS' : 'FIȘE & BAREME'}</span></span>
      </a>
      <nav class="nav-links">
        <a href="https://www.arkyedu.com/">${isEn ? 'Courses' : 'Cursuri'}</a>
        <a href="${isEn ? 'https://www.arkyedu.com/fise/en/' : 'https://www.arkyedu.com/fise/'}">${isEn ? 'Worksheets (16)' : 'Fișe & Teste (16)'}</a>
        <a href="${isEn ? 'https://www.arkyedu.com/sandbox/en/' : 'https://www.arkyedu.com/sandbox/'}">Sandbox &amp; Trace C++</a>
        <a href="${isEn ? 'https://www.arkyedu.com/blog/en/' : 'https://www.arkyedu.com/blog/'}">Blog TIC</a>
        <a href="${isEn ? 'https://www.arkyedu.com/glosar/en/' : 'https://www.arkyedu.com/glosar/'}">${isEn ? 'Glossary' : 'Glosar'}</a>
      </nav>
      <div style="display:flex;align-items:center;gap:0.6rem;">
        <a href="${isEn ? roUrl : enUrl}" style="color:#94a3b8;text-decoration:none;font-weight:700;font-size:0.85rem;padding:0.4rem 0.7rem;border:1px solid #334155;border-radius:0.6rem;">${isEn ? 'RO' : 'EN'}</a>
        <a href="https://www.arkyedu.com/#fise" class="nav-cta"><span>${isEn ? 'Interactive Mode' : 'Mod Interactiv'}</span></a>
      </div>
    </div>
  </header>
  <main class="container" style="padding: 3rem 1.5rem 4rem;">
    <div class="hero-section" style="padding-top: 1rem;">
      <h1>${isEn ? 'ICT Worksheets, Graded Exams (1–10) &amp; Olympiad Practice (Grades 5–8)' : 'Fișe de Lucru, Teste cu Barem 1–10 &amp; Subiecte OJI / Admitere (Clasele V–VIII)'}</h1>
      <p class="lead-text">${escapeHtmlText(description)}</p>
      <div class="cta-group">
        <a href="https://www.arkyedu.com/#fise" class="btn-primary"><span>${isEn ? 'Solve Online for +35 ByteCoins' : 'Rezolvă Online cu Notare 1–10'}</span></a>
        <a href="https://www.arkyedu.com/fise-llm.txt" class="btn-secondary"><span>LLM Markdown Index (/fise-llm.txt)</span></a>
      </div>
    </div>
    <div class="grid-3">
      ${WORKSHEETS_BANK.map((w) => {
        const wLoc = isEn ? w.en : w.ro;
        const href = isEn ? `https://www.arkyedu.com/fise/en/${w.en.slug}/` : `https://www.arkyedu.com/fise/${w.ro.slug}/`;
        const gLabel = WORKSHEET_GRADE_LABELS[w.grade][lang];
        const kLabel = WORKSHEET_KIND_LABELS[w.kind][lang];
        return `
        <article class="card">
          <div style="font-size:0.78rem;font-weight:700;color:var(--accent);margin-bottom:0.4rem;">${escapeHtmlText(gLabel)} · ${escapeHtmlText(kLabel)} · ${w.maxPoints}p</div>
          <h2 class="card-title" style="font-size:1.05rem;">${escapeHtmlText(wLoc.title)}</h2>
          <p class="card-desc" style="font-size:0.86rem;">${escapeHtmlText(wLoc.directAnswerSummary)}</p>
          <a href="${href}" class="card-link">${isEn ? 'Open Sheet & Rubric →' : 'Deschide Fișa & Baremul →'}</a>
        </article>`;
      }).join('')}
    </div>
  </main>
  <footer>
    <div class="container">
      <div class="footer-bottom" style="border:none;">
        <div>© 2026 ArkyEdu · ${isEn ? '100% Free National ICT Curriculum Library.' : 'Bibliotecă Gratuită de Evaluare TIC V–VIII.'}</div>
        <div><a href="https://www.arkyedu.com/llms.txt" style="color:var(--accent);">llms.txt</a> · <a href="https://www.arkyedu.com/fise-llm.txt" style="color:var(--accent);">fise-llm.txt</a> · <a href="https://www.arkyedu.com/sitemap.xml" style="color:var(--accent);">Sitemap</a></div>
      </div>
    </div>
  </footer>
</body>
</html>`;

    fs.writeFileSync(path.join(isEn ? fiseEnDir : fiseRoDir, 'index.html'), html, 'utf-8');
  };

  renderHub('ro');
  renderHub('en');

  WORKSHEETS_BANK.forEach((ws) => {
    (['ro', 'en'] as const).forEach((lang) => {
      const isEn = lang === 'en';
      const loc = isEn ? ws.en : ws.ro;
      const outDir = path.join(isEn ? fiseEnDir : fiseRoDir, loc.slug);
      ensureDir(outDir);

      const roUrl = `https://www.arkyedu.com/fise/${ws.ro.slug}/`;
      const enUrl = `https://www.arkyedu.com/fise/en/${ws.en.slug}/`;
      const canonicalUrl = isEn ? enUrl : roUrl;
      const altUrl = isEn ? roUrl : enUrl;
      const gLabel = WORKSHEET_GRADE_LABELS[ws.grade][lang];
      const kLabel = WORKSHEET_KIND_LABELS[ws.kind][lang];
      const related = getRelatedWorksheets(ws.id, 3);

      const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': ['LearningResource', 'Quiz'],
            '@id': `${canonicalUrl}#resource`,
            name: loc.title,
            description: loc.directAnswerSummary,
            url: canonicalUrl,
            inLanguage: lang,
            isAccessibleForFree: true,
            educationalLevel: gLabel,
            learningResourceType: kLabel,
            timeRequired: `PT${ws.estimatedMinutes}M`,
            datePublished: ws.publishedAt,
            hasPart: ws.questions.map((q) => {
              const opts = isEn ? q.optionsEn : q.optionsRo;
              const ansText =
                (q.type === 'mcq' || q.type === 'true-false') && opts
                  ? `${opts[Number(q.correctAnswer)]} — ${isEn ? q.solutionStepEn : q.solutionStepRo}`
                  : `${String(q.correctAnswer)} — ${isEn ? q.solutionStepEn : q.solutionStepRo}`;
              return {
                '@type': 'Question',
                name: isEn ? q.promptEn : q.promptRo,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: ansText
                }
              };
            }),
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'RON' }
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: isEn ? 'Home' : 'Acasă', item: 'https://www.arkyedu.com/' },
              { '@type': 'ListItem', position: 2, name: isEn ? 'Worksheets' : 'Fișe & Teste', item: isEn ? 'https://www.arkyedu.com/fise/en/' : 'https://www.arkyedu.com/fise/' },
              { '@type': 'ListItem', position: 3, name: loc.breadcrumbLabel, item: canonicalUrl }
            ]
          },
          ...(ws.faqs.length > 0
            ? [
                {
                  '@type': 'FAQPage',
                  mainEntity: ws.faqs.map((f) => ({
                    '@type': 'Question',
                    name: isEn ? f.qEn : f.qRo,
                    acceptedAnswer: { '@type': 'Answer', text: isEn ? f.aEn : f.aRo }
                  }))
                }
              ]
            : [])
        ]
      };

      const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtmlText(loc.metaTitle)}</title>
  <meta name="description" content="${escapeHtmlText(loc.metaDescription)}">
  <meta name="keywords" content="${escapeHtmlText(loc.keywords.join(', '))}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="alternate" hreflang="ro" href="${roUrl}">
  <link rel="alternate" hreflang="en" href="${enUrl}">
  <link rel="alternate" hreflang="x-default" href="${roUrl}">
  <meta name="theme-color" content="#090d16">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtmlText(loc.metaTitle)}">
  <meta property="og:description" content="${escapeHtmlText(loc.metaDescription)}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="https://www.arkyedu.com/og-cover.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtmlText(loc.metaTitle)}">
  <meta name="twitter:description" content="${escapeHtmlText(loc.metaDescription)}">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  <style>
    ${commonStyles}
    .ws-box { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 1rem; padding: 1.5rem; margin-bottom: 1.25rem; }
    .ws-pre { background: #0b1220; border: 1px solid #334155; border-radius: 0.75rem; padding: 1rem; overflow-x: auto; font-family: monospace; color: #bae6fd; margin: 0.75rem 0; font-size: 0.9rem; }
    .ws-table { width: 100%; border-collapse: collapse; margin-top: 0.75rem; font-size: 0.92rem; }
    .ws-table th, .ws-table td { border-bottom: 1px solid #334155; padding: 0.6rem 0.5rem; text-align: left; }
    @media print {
      header, footer, .no-print { display: none !important; }
      body { background: #fff !important; color: #000 !important; }
      .ws-box { background: #fff !important; border: 1px solid #94a3b8 !important; color: #000 !important; page-break-inside: avoid; }
      .ws-pre { background: #f8fafc !important; color: #000 !important; border: 1px solid #cbd5e1 !important; }
      .ws-table th, .ws-table td { border-color: #94a3b8 !important; color: #000 !important; }
    }
  </style>
</head>
<body>
  <header>
    <div class="container header-content">
      <a href="https://www.arkyedu.com/" class="logo-box">
        <div class="logo-icon">📝</div>
        <span class="logo-text">ArkyEdu <span style="color: var(--accent);">TIC</span></span>
      </a>
      <nav class="nav-links">
        <a href="${isEn ? 'https://www.arkyedu.com/fise/en/' : 'https://www.arkyedu.com/fise/'}">${isEn ? 'All 16 Worksheets' : 'Toate Fișele (16)'}</a>
        <a href="https://www.arkyedu.com/cursuri/${ws.relatedModuleId}/">${isEn ? 'Interactive Lesson' : 'Lecția Interactivă'}</a>
        <a href="${isEn ? 'https://www.arkyedu.com/sandbox/en/' : 'https://www.arkyedu.com/sandbox/'}">Sandbox &amp; Trace C++</a>
      </nav>
      <div style="display:flex;align-items:center;gap:0.6rem;">
        <a href="${altUrl}" style="color:#94a3b8;text-decoration:none;font-weight:700;font-size:0.85rem;padding:0.4rem 0.7rem;border:1px solid #334155;border-radius:0.6rem;">${isEn ? 'RO' : 'EN'}</a>
        <a href="https://www.arkyedu.com/#fise/${encodeURIComponent(loc.slug)}" class="nav-cta"><span>${isEn ? 'Solve Interactive' : 'Rezolvă Interactiv'}</span></a>
      </div>
    </div>
  </header>

  <main class="container" style="padding: 2.5rem 1.5rem 4rem;">
    <div style="font-size:0.85rem;color:var(--accent);font-weight:700;margin-bottom:0.5rem;">
      ${escapeHtmlText(gLabel)} · ${escapeHtmlText(kLabel)} · ${ws.estimatedMinutes} min · ${ws.maxPoints}p (${ws.exOfficioPoints}p ${isEn ? 'ex officio' : 'din oficiu'})
    </div>
    <h1 style="font-size:2rem;line-height:1.25;margin-bottom:1rem;">${escapeHtmlText(loc.title)}</h1>
    <div class="ws-box">
      <strong>${isEn ? 'Quick Summary & Key Points:' : 'Rezumat Direct & Punctaj:'}</strong>
      <p style="margin-top:0.5rem;color:#cbd5e1;">${escapeHtmlText(loc.directAnswerSummary)}</p>
      <p style="margin-top:0.6rem;font-size:0.92rem;color:#94a3b8;"><strong>${isEn ? 'Theory Snapshot:' : 'Sinteză Teorie:'}</strong> ${escapeHtmlText(loc.theorySnapshot)}</p>
      <div class="no-print" style="margin-top:1rem;display:flex;flex-wrap:wrap;gap:0.75rem;">
        <a href="https://www.arkyedu.com/#fise/${encodeURIComponent(loc.slug)}" class="btn-primary"><span>${isEn ? 'Solve & Auto-Grade (1–10)' : 'Rezolvă Online cu Notă Automată 1–10'}</span></a>
        <button type="button" onclick="window.print()" class="btn-secondary" style="cursor:pointer;"><span>🖨️ ${isEn ? 'Print A4 Sheet' : 'Tipărește A4'}</span></button>
        ${ws.optionalCppTraceCode ? `<a href="https://www.arkyedu.com/#sandbox" class="btn-secondary"><span>🔬 ${isEn ? 'Trace C++ Code' : 'Rulează în Trace C++'}</span></a>` : ''}
      </div>
    </div>

    ${ws.questions.map((q, idx) => {
      const opts = isEn ? q.optionsEn : q.optionsRo;
      const ansLabel =
        (q.type === 'mcq' || q.type === 'true-false') && opts
          ? `${String.fromCharCode(65 + Number(q.correctAnswer))}) ${opts[Number(q.correctAnswer)]}`
          : String(q.correctAnswer);
      return `
      <article class="ws-box">
        <div style="display:flex;justify-content:space-between;font-size:0.85rem;color:var(--brand-cyan);font-weight:700;margin-bottom:0.4rem;">
          <span>${idx + 1}. ${escapeHtmlText(isEn ? q.partLabelEn : q.partLabelRo)}</span>
          <span>(${q.points}p)</span>
        </div>
        <h2 style="font-size:1.08rem;margin-bottom:0.65rem;">${escapeHtmlText(isEn ? q.promptEn : q.promptRo)}</h2>
        ${q.codeSnippet ? `<pre class="ws-pre"><code>${escapeHtmlText(q.codeSnippet)}</code></pre>` : ''}
        ${opts ? `<ul style="list-style:none;padding-left:0;margin:0.5rem 0 0.75rem;">${opts.map((o, i) => `<li style="margin-bottom:0.35rem;color:#e2e8f0;"><strong>${String.fromCharCode(65 + i)})</strong> ${escapeHtmlText(o)}</li>`).join('')}</ul>` : ''}
        <p style="margin-top:0.6rem;font-size:0.9rem;color:#86efac;">
          <strong>${isEn ? 'Answer & Explanation:' : 'Rezolvare & Barem:'}</strong> ${escapeHtmlText(ansLabel)} — ${escapeHtmlText(isEn ? q.solutionStepEn : q.solutionStepRo)}
        </p>
      </article>`;
    }).join('')}

    <section class="ws-box">
      <h2 style="font-size:1.3rem;margin-bottom:0.5rem;">${isEn ? 'Official 100-Point Grading Rubric (Grade 1–10)' : 'Barem Oficial de Evaluare și Notare (100p → Nota 1–10)'}</h2>
      <table class="ws-table">
        <thead>
          <tr>
            <th>${isEn ? 'Section' : 'Subiect / Item'}</th>
            <th>${isEn ? 'Evaluated Competency' : 'Competență Evaluată'}</th>
            <th style="text-align:right;">${isEn ? 'Points' : 'Punctaj'}</th>
          </tr>
        </thead>
        <tbody>
          ${ws.rubricRows.map((r) => `
            <tr>
              <td>${escapeHtmlText(isEn ? r.itemEn : r.itemRo)}</td>
              <td>${escapeHtmlText(isEn ? r.competencyEn : r.competencyRo)}</td>
              <td style="text-align:right;font-weight:700;">${r.points}p</td>
            </tr>`).join('')}
          <tr>
            <td colspan="2"><strong>TOTAL (${isEn ? 'Grade = Score / 10' : 'Nota = Punctaj / 10'})</strong></td>
            <td style="text-align:right;font-weight:900;color:var(--accent);">${ws.maxPoints}p</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="ws-box no-print">
      <h2 style="font-size:1.2rem;margin-bottom:0.75rem;">${isEn ? 'More Worksheets & Related Links' : 'Alte Fișe & Resurse Conectate'}</h2>
      <div class="grid-3">
        ${related.map((r) => {
          const rLoc = isEn ? r.en : r.ro;
          const rHref = isEn ? `https://www.arkyedu.com/fise/en/${r.en.slug}/` : `https://www.arkyedu.com/fise/${r.ro.slug}/`;
          return `<a href="${rHref}" class="card" style="text-decoration:none;"><div style="font-weight:700;color:#fff;font-size:0.95rem;">${escapeHtmlText(rLoc.breadcrumbLabel)}</div><div style="font-size:0.8rem;color:var(--accent);margin-top:0.35rem;">${isEn ? 'Open sheet →' : 'Deschide fișa →'}</div></a>`;
        }).join('')}
      </div>
    </section>
  </main>

  <footer>
    <div class="container">
      <div class="footer-bottom" style="border:none;">
        <div>© 2026 ArkyEdu · ${escapeHtmlText(ws.curriculumRef)}</div>
        <div><a href="https://www.arkyedu.com/fise/" style="color:var(--accent);">${isEn ? 'All Worksheets' : 'Toate Fișele'}</a> · <a href="https://www.arkyedu.com/fise-llm.txt" style="color:var(--accent);">fise-llm.txt</a></div>
      </div>
    </div>
  </footer>
</body>
</html>`;

      fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');
    });
  });

  console.log(`Generated ${WORKSHEETS_BANK.length * 2 + 2} bilingual worksheet & rubric SEO pages (/fise/ & /fise/en/).`);
}

// 11. GENERATE DEDICATED LLM CHEAT-SHEET FOR WORKSHEETS, RUBRICS & OLYMPIAD (/fise-llm.txt)
function generateFiseLlmIndex() {
  const lines: string[] = [
    '# ArkyEdu — Index Structurat Fișe de Lucru, Teste cu Barem 1–10 & Olimpiadă TIC (Clasele V–VIII)',
    '',
    '> Document de referință optimizat pentru motoare de răspuns AI (ChatGPT Search, Perplexity, Gemini, Claude). Conține toate cele 16 fișe și teste bilingve cu bareme oficiale pe 100 de puncte, rezolvări explicate, plus cele 12 probleme din Arena Olimpiada TIC.',
    '',
    '- Hub principal Română: https://www.arkyedu.com/fise/',
    '- Hub principal Engleză: https://www.arkyedu.com/fise/en/',
    '- Debug Vizual C++ & Olimpiadă: https://www.arkyedu.com/sandbox/',
    '- Documentație generală platformă: https://www.arkyedu.com/llms.txt',
    '',
    '---',
    '',
    '## 1. Biblioteca de Fișe, Teste cu Barem 100p & Subiecte OJI / Admitere (16 Resurse RO/EN)',
    '',
  ];

  WORKSHEETS_BANK.forEach((ws, idx) => {
    lines.push(`### ${idx + 1}. ${ws.ro.title}`);
    lines.push(`- URL RO: https://www.arkyedu.com/fise/${ws.ro.slug}/`);
    lines.push(`- URL EN: https://www.arkyedu.com/fise/en/${ws.en.slug}/`);
    lines.push(`- Clasă & Tip: ${WORKSHEET_GRADE_LABELS[ws.grade].ro} | ${WORKSHEET_KIND_LABELS[ws.kind].ro} | ${ws.maxPoints}p (${ws.exOfficioPoints}p oficiu) | ${ws.estimatedMinutes} min`);
    lines.push(`- Rezumat: ${ws.ro.directAnswerSummary}`);
    lines.push(`- Teorie cheie: ${ws.ro.theorySnapshot}`);
    lines.push('- Itemi & Barem Oficial:');
    ws.questions.forEach((q, qIdx) => {
      const ans =
        (q.type === 'mcq' || q.type === 'true-false') && q.optionsRo
          ? q.optionsRo[Number(q.correctAnswer)]
          : String(q.correctAnswer);
      lines.push(`  ${qIdx + 1}. [${q.points}p] ${q.promptRo} -> Răspuns corect: "${ans}" (${q.solutionStepRo})`);
    });
    lines.push('');
  });

  lines.push('---', '', '## 2. Arena Olimpiada TIC (12 Probleme C++ Progresive cu 5 Teste Automate)', '');
  OLYMPIAD_PROBLEMS.forEach((op) => {
    lines.push(`- **${String(op.number).padStart(2, '0')}. ${op.titleRo}** (${op.gradeLabelRo} · ${op.complexityTarget}): ${op.statementRo}`);
  });

  fs.writeFileSync(path.join(publicDir, 'fise-llm.txt'), lines.join('\n'), 'utf-8');
  console.log('Generated public/fise-llm.txt for LLM citation & RAG indexing.');
}

// EXECUTE ALL GENERATORS
console.log('--- STARTING SEO PAGES GENERATION ---');
generateModulePages();
generateGradeHubs();
generateComparisonPage();
generateFeatureHubs();
generateViceLeonidaSeoPages();
generateLeonidaUniversePages();
generateAiLabPages();
generateTechEducationPillar();
generateBlogPages();
generateGlossaryPages();
generateSandboxPages();
generateWorksheetsPages();
generateFiseLlmIndex();
generateSitemap();
generateRssFeed();
console.log('--- ALL SEO ASSETS GENERATED SUCCESSFULLY ---');
