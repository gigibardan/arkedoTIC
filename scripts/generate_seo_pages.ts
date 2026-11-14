import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CURRICULA_MODULES, CurriculaModule } from '../src/data/curriculaData';

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

    const htmlContent = `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
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
  <meta name="theme-color" content="#090d16">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${mod.title} — ${mod.grade}">
  <meta property="og:description" content="${mod.metaDescription.replace(/"/g, '&quot;')}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="ArkyEdu TIC & Arcade">
  <meta property="og:locale" content="ro_RO">
  <meta property="og:locale:alternate" content="en_US">
  <meta property="og:image" content="https://www.arkyedu.com/pwa-512x512.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${mod.title} — ${mod.grade}">
  <meta name="twitter:description" content="${mod.metaDescription.replace(/"/g, '&quot;')}">
  <meta name="twitter:image" content="https://www.arkyedu.com/pwa-512x512.png">
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
        <a href="https://www.arkyedu.com/arcade/">28 Jocuri Arcade</a>
        <a href="https://www.arkyedu.com/duel/">Duel 1v1 (20+)</a>
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
            <li><a href="https://www.arkyedu.com/arcade/">28 Jocuri Didactice Arcade</a></li>
            <li><a href="https://www.arkyedu.com/duel/">Arena Dueluri 1v1 (20+ Moduri)</a></li>
            <li><a href="https://www.arkyedu.com/profesor/">Portal Profesori &amp; Catalog</a></li>
            <li><a href="https://www.arkyedu.com/oras/">Arkedo Smart City IoT</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Comparație &amp; Legal</h4>
          <ul>
            <li><a href="https://www.arkyedu.com/comparatie-scoli-private/">ArkyEdu vs Cursuri Private</a></li>
            <li><a href="https://www.arkyedu.com/sitemap.xml">Harta Site-ului (Sitemap)</a></li>
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
  <meta charset="UTF-8">
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
  <meta property="og:image" content="https://www.arkyedu.com/pwa-512x512.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${g.title}">
  <meta name="twitter:description" content="${g.meta}">
  <meta name="twitter:image" content="https://www.arkyedu.com/pwa-512x512.png">
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
        <a href="https://www.arkyedu.com/arcade/">Arcade (28)</a>
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

    <!-- VALUE PROPOSITION -->
    <div class="hero-section" style="background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 1.5rem; padding: 3rem 1.5rem; margin-top: 3rem;">
      <h2 style="font-size: 1.85rem; margin-bottom: 1rem;">De Ce Învață Elevii Mai Bine cu ArkyEdu?</h2>
      <p style="color: var(--text-secondary); max-width: 750px; margin: 0 auto 2rem;">Spre deosebire de cursurile private scumpe (care cer 400 - 600 lei/lună și folosesc platforme străine), ArkyEdu este creat de profesori din România exact pe manualele școlare aprobate de Ministerul Educației, oferind 28 de jocuri arcade, peste 20 de dueluri 1v1 și diplome de merit oficiale, 100% gratuit!</p>
      <div class="cta-group">
        <a href="${appGradeLink}" class="btn-primary">Exersează Acum Clasa a ${g.roman}-a</a>
        <a href="https://www.arkyedu.com/arcade/" class="btn-secondary">Vezi Cele 28 de Jocuri Arcade</a>
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
            <li><a href="https://www.arkyedu.com/arcade/">28 Jocuri Arcade Didactice</a></li>
            <li><a href="https://www.arkyedu.com/duel/">Arena Dueluri 1v1 (20+ Moduri)</a></li>
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
              "text": "Platforma include Scratch 3.0, limbajul C++ (mediul Code::Blocks, sintaxă nativă, bucle while/for, algoritmi de numere prime, Fibonacci și vectori), HTML5 semantic, calcul tabelar avansat în Microsoft Excel & Google Sheets, simulatoare de circuite Arduino Uno cu senzori (LDR, PIR, Ultrasonic HC-SR04, Gaz MQ-2, ecran LCD 1602 I2C, servomotoare SG90), 28 de jocuri arcade didactice și 20+ dueluri 1v1."
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
  <meta charset="UTF-8">
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
  <meta property="og:image" content="https://www.arkyedu.com/pwa-512x512.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="ArkyEdu vs Școli Private de Programare: 100% Gratuit vs 4.800 lei/an">
  <meta name="twitter:description" content="Comparație detaliată: Învață programare, robotică, Excel și web design conform programei școlare din România fără taxe.">
  <meta name="twitter:image" content="https://www.arkyedu.com/pwa-512x512.png">
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
        <a href="https://www.arkyedu.com/arcade/">28 Jocuri Arcade</a>
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
          <span>🕹️ Descoperă Cele 28 Jocuri Arcade</span>
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
              <span class="check-icon">✓ 28 JOCURI RETRO ARCADE</span><br>
              Cyber Pac-Man, Cyber Arkanoid, Cyber Frogger, Cyber Sokoban, Cyber Asteroids, Circuit Master 80s, Cyber Snake, Redstone Logic, Minecraft Voxel, Hacker vs Defender, PC Builder etc.
            </td>
            <td>
              <span class="cross-icon">✗ EXERCIȚII REPETITIVE DE BAZĂ</span><br>
              Gamificarea se limitează adesea la badge-uri simple în portaluri web statice.
            </td>
          </tr>
          <tr>
            <td><strong>Competiții Tehnologice &amp; Dueluri</strong></td>
            <td>
              <span class="check-icon">✓ ARENĂ DUELURI 1V1 (20+ MODURI LIVE)</span><br>
              Cyber Battleship 1v1, File-Drop Attack Tetris, System Sabotage, C++ Code Racer, Binary Clash, Circuit Clash — confruntări multiplayer între elevi sau cu AI Cyber-Bot.
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
          Absolut deloc! ArkyEdu este o inițiativă educațională deschisă non-profit. Nu există conturi premium plătite, nu există reclame și nu cerem niciodată date de card bancar. Toți elevii și profesorii au acces egal la toate cele 40 de module didactice, simulatoarele hardware, cele 28 de jocuri arcade și 20+ dueluri 1v1.
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
        <div><a href="https://www.arkyedu.com/" style="color: var(--accent);">Acasă</a> • <a href="https://www.arkyedu.com/sitemap.xml" style="color: var(--accent);">Sitemap</a></div>
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
      title: 'Arcade TIC: 28 Jocuri Retro Didactice de Programare, Hardware & Securitate | ArkyEdu',
      meta: 'Colecție completă de 28 mini-jocuri arcade retro gratuite pentru educație TIC și coding copii: Cyber Pac-Man, Cyber Arkanoid, Cyber Frogger, Cyber Sokoban, Cyber Asteroids, Circuit Master 80s, Redstone Logic Lab, PC Builder și tastare oarbă.',
      keywords: 'jocuri arcade tic, jocuri educative programare copii, jocuri invatare informatica gimnaziu, cyber pacman tic, cyber arkanoid firewall, cyber frogger retea, cyber sokoban servere, circuit master 80s, redstone logic simulator, pc builder simulator',
      h1: 'Arcade Didactic TIC: 28 de Jocuri Retro de Programare & Tehnologie',
      appLink: 'https://www.arkyedu.com/#arcade',
      sectionTitle: 'Catalog Complet: Cele 28 de Mini-Jocuri Educative Arcade',
      cards: [
        { icon: '🟡', title: 'Cyber Pac-Man: Labirintul Biților', desc: 'Colectează pachete de date pe placa de bază și activează scutul antivirus răspunzând fulger la întrebări TIC.' },
        { icon: '🧱', title: 'Cyber Arkanoid: Firewall Breaker', desc: 'Distruge blocuri criptate cu lasere, capsule multi-ball și fizică 60 FPS pentru consolidarea logicii.' },
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
        { q: 'Sunt cele 28 de jocuri arcade aliniate la materia școlară de TIC?', a: 'Da! Fiecare joc arcade consolidează noțiuni exacte din programa claselor V–VIII: biți și octeți, extensii de fișiere, porți logice, componente PC, securitate cibernetică, sintaxă C++ și robotică Arduino.' },
        { q: 'Se pot juca gratuit pe telefon, tabletă sau calculator școlar?', a: 'Da, toate cele 28 de jocuri rulează direct în browser (desktop & touch mobil) fără instalare și fără reclame, fiind bilingve (Română și Engleză).' }
      ]
    },
    {
      dir: 'duel',
      title: 'Arena Dueluri TIC 1v1: 20+ Competiții Tehnologice, Coding Live & Circuite | ArkyEdu',
      meta: 'Confruntări live multiplayer 1v1 între elevi sau cu AI Cyber-Bot: Cyber Battleship 1v1, File-Drop Attack Tetris Pro, System Sabotage (Among Us), Cyber Clash Royale, C++ Code Racer, Binary Clash și Circuit Clash Arduino.',
      keywords: 'dueluri tic 1v1, competitii tehnologice scolare, cyber battleship 1v1, file drop attack tetris, system sabotage 1v1, binary clash 1v1, circuit clash arduino, c++ code racer, network packet racer, olimpiada tic live',
      h1: 'Arena Dueluri TIC 1v1: Peste 20 de Competiții Tehnologice Live',
      appLink: 'https://www.arkyedu.com/#duel',
      sectionTitle: 'Moduri Populare de Duel 1v1 (Live Cloud PvP & AI Cyber-Bot)',
      cards: [
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
  <meta charset="UTF-8">
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
  <meta property="og:image" content="https://www.arkyedu.com/pwa-512x512.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${h.title}">
  <meta name="twitter:description" content="${h.meta}">
  <meta name="twitter:image" content="https://www.arkyedu.com/pwa-512x512.png">
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
        <a href="https://www.arkyedu.com/arcade/">Arcade (28)</a>
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
        ${h.cards.map(c => `
          <div class="card">
            <div class="card-icon">${c.icon}</div>
            <h3 class="card-title">${c.title}</h3>
            <p class="card-desc">${c.desc}</p>
            <a href="${h.appLink}" class="card-link">Lansează în Aplicație →</a>
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
        <div><a href="https://www.arkyedu.com/" style="color: var(--accent);">Acasă</a> • <a href="https://www.arkyedu.com/educatie-tehnologie-copii/" style="color: var(--accent);">Educație Tehnologie Copii</a> • <a href="https://www.arkyedu.com/sitemap.xml" style="color: var(--accent);">Sitemap</a></div>
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
            "acceptedAnswer": { "@type": "Answer", "text": "Cele 28 de jocuri arcade (Cyber Pac-Man, Cyber Arkanoid, Sokoban, Circuit Master 80s, Redstone Logic) și peste 20 de dueluri 1v1 transformă algoritmica, rețelele, securitatea cibernetică și electronica în provocări interactive cu feedback imediat." }
          }
        ]
      }
    ]
  };

  const htmlContent = `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
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
  <meta property="og:image" content="https://www.arkyedu.com/pwa-512x512.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="https://www.arkyedu.com/pwa-512x512.png">
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
        <a href="https://www.arkyedu.com/arcade/">Arcade (28)</a>
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
        <h3 class="card-title">28 Jocuri Arcade Retro</h3>
        <p class="card-desc">Cyber Pac-Man, Cyber Arkanoid, Frogger, Sokoban, Asteroids, Circuit Master 80s, Redstone Logic și PC Builder.</p>
        <a href="https://www.arkyedu.com/arcade/" class="card-link">Explorează Arcade →</a>
      </div>
      <div class="card">
        <div class="card-icon">⚔️</div>
        <h3 class="card-title">Arena Dueluri 1v1 (20+ Moduri)</h3>
        <p class="card-desc">Cyber Battleship, File-Drop Attack Tetris, System Sabotage, C++ Code Racer și Binary Clash live sau cu AI Bot.</p>
        <a href="https://www.arkyedu.com/duel/" class="card-link">Intră în Arenă →</a>
      </div>
      <div class="card">
        <div class="card-icon">🎓</div>
        <h3 class="card-title">Portal Profesori &amp; Diplome 1–10</h3>
        <p class="card-desc">Catalog digital GDPR multi-școală, notare automată pe bareme oficiale și diplome imprimabile pentru elevi.</p>
        <a href="https://www.arkyedu.com/profesor/" class="card-link">Vezi Portalul Profesorului →</a>
      </div>
    </div>
  </main>

  <footer>
    <div class="container">
      <div class="footer-bottom" style="border: none;">
        <div>© 2026 ArkyEdu — Platforma #1 Gratuită de Educație TIC &amp; Coding pentru Copii.</div>
        <div><a href="https://www.arkyedu.com/" style="color: var(--accent);">Acasă</a> • <a href="https://www.arkyedu.com/llms.txt" style="color: var(--accent);">llms.txt</a> • <a href="https://www.arkyedu.com/sitemap.xml" style="color: var(--accent);">Sitemap</a></div>
      </div>
    </div>
  </footer>
</body>
</html>`;

  fs.writeFileSync(path.join(dirPath, 'index.html'), htmlContent, 'utf-8');
  console.log('Pillar Landing Page (/educatie-tehnologie-copii/) generated.');
}

// 6. GENERATE COMPLETE SITEMAP.XML
function generateSitemap() {
  const currentDate = new Date().toISOString().split('T')[0];

  const staticUrls = [
    { loc: 'https://www.arkyedu.com/', priority: '1.0', changefreq: 'daily' },
    { loc: 'https://www.arkyedu.com/educatie-tehnologie-copii/', priority: '0.98', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/clasa-5/', priority: '0.95', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/clasa-6/', priority: '0.95', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/clasa-7/', priority: '0.95', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/clasa-8/', priority: '0.95', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/comparatie-scoli-private/', priority: '0.95', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/arcade/', priority: '0.92', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/duel/', priority: '0.92', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/profesor/', priority: '0.88', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/oras/', priority: '0.88', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/llms.txt', priority: '0.85', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/llms-full.txt', priority: '0.8', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/ai-catalog.json', priority: '0.75', changefreq: 'weekly' }
  ];

  const courseUrls = CURRICULA_MODULES.map(m => ({
    loc: `https://www.arkyedu.com/cursuri/${m.id}/`,
    priority: m.grade === 'Clasa a VIII-a' ? '0.9' : m.grade === 'Clasa a VII-a' ? '0.88' : '0.85',
    changefreq: 'weekly'
  }));

  const allUrls = [...staticUrls, ...courseUrls];

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

// EXECUTE ALL GENERATORS
console.log('--- STARTING SEO PAGES GENERATION ---');
generateModulePages();
generateGradeHubs();
generateComparisonPage();
generateFeatureHubs();
generateTechEducationPillar();
generateSitemap();
console.log('--- ALL SEO ASSETS GENERATED SUCCESSFULLY ---');
