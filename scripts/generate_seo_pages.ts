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

    const htmlContent = `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${mod.title} — ${mod.grade} | ArkyEdu TIC</title>
  <meta name="description" content="${mod.metaDescription.replace(/"/g, '&quot;')}">
  <meta name="keywords" content="${Array.isArray(mod.keywords) ? mod.keywords.join(', ') : (mod.keywords || '')}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta name="theme-color" content="#090d16">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${mod.title} — ${mod.grade}">
  <meta property="og:description" content="${mod.metaDescription.replace(/"/g, '&quot;')}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="ArkyEdu TIC & Arcade">
  <meta property="og:locale" content="ro_RO">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${mod.title} — ${mod.grade}">
  <meta name="twitter:description" content="${mod.metaDescription.replace(/"/g, '&quot;')}">
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
        <a href="https://www.arkyedu.com/arcade/">21 Jocuri Arcade</a>
        <a href="https://www.arkyedu.com/duel/">Duel 1v1</a>
        <a href="https://www.arkyedu.com/comparatie-scoli-private/">100% Gratuit vs Privat</a>
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

    <!-- FINAL CTA BANNER -->
    <div class="hero-section" style="background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 1.5rem; padding: 3rem 1.5rem; margin-top: 3rem;">
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
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem;">Platforma educațională gratuită nr. 1 pentru TIC și informatică gimnaziu din România.</p>
          <a href="https://www.arkyedu.com/comparatie-scoli-private/" style="color: var(--accent); font-weight: 700;">De ce 100% Gratuit? →</a>
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
            <li><a href="https://www.arkyedu.com/arcade/">21 Jocuri Didactice Arcade</a></li>
            <li><a href="https://www.arkyedu.com/duel/">Arena Dueluri 1v1 Live</a></li>
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
  <link rel="canonical" href="${canonicalUrl}">
  <meta name="theme-color" content="#090d16">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${g.title}">
  <meta property="og:description" content="${g.meta}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="ArkyEdu TIC & Arcade">
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
        <a href="https://www.arkyedu.com/arcade/">Arcade (21)</a>
        <a href="https://www.arkyedu.com/duel/">Duel 1v1</a>
        <a href="https://www.arkyedu.com/comparatie-scoli-private/">vs Privat</a>
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
      <p style="color: var(--text-secondary); max-width: 750px; margin: 0 auto 2rem;">Spre deosebire de cursurile private scumpe (care cer 400 - 600 lei/lună și folosesc platforme străine), ArkyEdu este creat de profesori din România exact pe manualele școlare aprobate de Ministerul Educației, oferind 21 de jocuri arcade, simulatoare interactive și diplome de merit oficiale, 100% gratuit!</p>
      <div class="cta-group">
        <a href="${appGradeLink}" class="btn-primary">Exersează Acum Clasa a ${g.roman}-a</a>
        <a href="https://www.arkyedu.com/arcade/" class="btn-secondary">Vezi Cele 21 de Jocuri Arcade</a>
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
            <li><a href="https://www.arkyedu.com/arcade/">21 Jocuri Arcade Didactice</a></li>
            <li><a href="https://www.arkyedu.com/duel/">Arena Dueluri 1v1 Live</a></li>
            <li><a href="https://www.arkyedu.com/comparatie-scoli-private/">ArkyEdu vs Școli Private</a></li>
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
              "text": "Platforma include Scratch 3.0, limbajul C++ (mediul Code::Blocks, sintaxă nativă, bucle while/for, algoritmi de numere prime, Fibonacci și vectori), HTML5 semantic, calcul tabelar avansat în Microsoft Excel & Google Sheets, simulatoare de circuite Arduino Uno cu senzori (LDR, PIR, Ultrasonic HC-SR04, Gaz MQ-2, ecran LCD 1602 I2C, servomotoare SG90) și 21 de jocuri arcade didactice."
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
  <link rel="canonical" href="${canonicalUrl}">
  <meta name="theme-color" content="#090d16">
  <meta property="og:type" content="article">
  <meta property="og:title" content="ArkyEdu vs Școli Private de Programare: 100% Gratuit vs 4.800 lei/an">
  <meta property="og:description" content="Comparație detaliată: Învață programare, robotică, Excel și web design conform programei școlare din România fără taxe și fără abonamente.">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="ArkyEdu TIC & Arcade">
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
        <a href="https://www.arkyedu.com/arcade/">21 Jocuri Arcade</a>
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
          <span>🕹️ Descoperă Cele 21 Jocuri Arcade</span>
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
              <span class="check-icon">✓ 21 JOCURI RETRO ARCADE</span><br>
              Circuit Master 80s, Cyber Snake, Redstone Logic, Minecraft Voxel, Hacker vs Defender, Byte Slider, tastare oarbă QWERTY, etc.
            </td>
            <td>
              <span class="cross-icon">✗ EXERCIȚII REPETITIVE DE BAZĂ</span><br>
              Gamificarea se limitează adesea la badge-uri simple în portaluri web statice.
            </td>
          </tr>
          <tr>
            <td><strong>Competiții Tehnologice &amp; Dueluri</strong></td>
            <td>
              <span class="check-icon">✓ ARENĂ DUELURI 1V1 ÎN TIMP REAL</span><br>
              Confruntări live multiplayer între colegi de clasă sau elevi din alte școli, simulând olimpiadele și concursurile de programare.
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
          Absolut deloc! ArkyEdu este o inițiativă educațională deschisă non-profit. Nu există conturi premium plătite, nu există reclame și nu cerem niciodată date de card bancar. Toți elevii și profesorii au acces egal la toate cele 40 de module didactice, simulatoarele hardware și cele 21 de jocuri arcade.
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

// 4. GENERATE ARCADE, DUEL, PROFESOR, ORAS HUBS
function generateFeatureHubs() {
  const hubs = [
    {
      dir: 'arcade',
      title: 'Arcade TIC: 21 Jocuri Retro Didactice de Programare, Hardware & Securitate | ArkyEdu',
      meta: 'Colecție completă de 21 mini-jocuri arcade retro pentru fixarea noțiunilor de TIC: Circuit Master 80s, Cyber Snake, Redstone Logic, Hacker vs Defender, PC Builder și tastare oarbă.',
      keywords: 'jocuri arcade tic, jocuri educative programare copii, jocuri invatare informatica gimnaziu, circuit master 80s, cyber snake scratch, redstone logic simulator, hacker vs defender duel',
      h1: 'Arcade Didactic TIC: 21 de Jocuri Retro de Programare & Tehnologie',
      appLink: 'https://www.arkyedu.com/#arcade'
    },
    {
      dir: 'duel',
      title: 'Arena Dueluri TIC 1v1: Competiții Tehnologice Școlare, Coding Live & Circuite | ArkyEdu',
      meta: 'Confruntări live multiplayer 1v1 între elevi: Binary Clash (cursa biților), Circuit Clash Arduino Smart City, C++ Code Racer, Pixel Art Sprite Clash, Network Packet Racer (rutare porturi), Hacker vs Defender și Cursa Algoritmilor Scratch.',
      keywords: 'dueluri tic 1v1, competitii tehnologice scolare, binary clash 1v1, circuit clash arduino, c++ code racer, pixel art clash, network packet racer, jocuri multiplayer educative, olimpiada tic live',
      h1: 'Arena Dueluri TIC 1v1: 11 Competiții Tehnologice în Timp Real',
      appLink: 'https://www.arkyedu.com/#duel'
    },
    {
      dir: 'profesor',
      title: 'Portal Profesor TIC: Catalog Digital, Bareme Oficiale & Notare Automată | ArkyEdu',
      meta: 'Instrument didactic dedicat cadrelor didactice: evaluare automată pe bareme de 1-10, urmărire progres elevi, fișe curriculare conforme OMEN 3393/2017 & OM 5420/2024.',
      keywords: 'catalog digital tic, portal profesor informatica, bareme didactice tic gimnaziu, fise de lucru tic clasa 5 6 7 8, omen 3393 2017 manual art klett',
      h1: 'Portalul Profesorului de TIC: Resurse Didactice & Catalog Digital',
      appLink: 'https://www.arkyedu.com/#profesor'
    },
    {
      dir: 'oras',
      title: 'Arkedo Smart City: Laborator Interactiv IoT, Robotică & Sisteme Inteligente | ArkyEdu',
      meta: 'Simulator interactiv de oraș inteligent (Smart City): iluminat public LDR+PIR, barieră inteligentă cu servomotoare, alertă gaze MQ-2 și stație meteo Arduino IoT.',
      keywords: 'smart city tic clasa 8, simulator iot arduino, laborator robotica orase inteligente, proiect integrator clasa 8 art klett pag 99 108',
      h1: 'Arkedo Smart City: Laborator Interactiv IoT & Robotică Urbană',
      appLink: 'https://www.arkyedu.com/#oras'
    }
  ];

  hubs.forEach(h => {
    const hubDir = path.join(publicDir, h.dir);
    ensureDir(hubDir);

    const canonicalUrl = `https://www.arkyedu.com/${h.dir}/`;

    const htmlContent = `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${h.title}</title>
  <meta name="description" content="${h.meta}">
  <meta name="keywords" content="${h.keywords}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta name="theme-color" content="#090d16">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${h.title}">
  <meta property="og:description" content="${h.meta}">
  <meta property="og:url" content="${canonicalUrl}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
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
        <a href="https://www.arkyedu.com/arcade/">Arcade (21)</a>
        <a href="https://www.arkyedu.com/duel/">Duel 1v1</a>
        <a href="https://www.arkyedu.com/comparatie-scoli-private/">vs Privat</a>
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
  </main>

  <footer>
    <div class="container">
      <div class="footer-bottom" style="border: none;">
        <div>© 2026 ArkyEdu TIC. Toate drepturile rezervate.</div>
        <div><a href="https://www.arkyedu.com/" style="color: var(--accent);">Acasă</a> • <a href="https://www.arkyedu.com/sitemap.xml" style="color: var(--accent);">Sitemap</a></div>
      </div>
    </div>
  </footer>
</body>
</html>`;

    fs.writeFileSync(path.join(hubDir, 'index.html'), htmlContent, 'utf-8');
  });

  console.log('Feature Hubs (arcade, duel, profesor, oras) generated.');
}

// 5. GENERATE COMPLETE SITEMAP.XML
function generateSitemap() {
  const currentDate = new Date().toISOString().split('T')[0];

  const staticUrls = [
    { loc: 'https://www.arkyedu.com/', priority: '1.0', changefreq: 'daily' },
    { loc: 'https://www.arkyedu.com/clasa-5/', priority: '0.95', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/clasa-6/', priority: '0.95', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/clasa-7/', priority: '0.95', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/clasa-8/', priority: '0.95', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/comparatie-scoli-private/', priority: '0.95', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/arcade/', priority: '0.9', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/duel/', priority: '0.9', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/profesor/', priority: '0.85', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/oras/', priority: '0.85', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/llms.txt', priority: '0.8', changefreq: 'weekly' },
    { loc: 'https://www.arkyedu.com/llms-full.txt', priority: '0.7', changefreq: 'weekly' }
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
generateSitemap();
console.log('--- ALL SEO ASSETS GENERATED SUCCESSFULLY ---');
