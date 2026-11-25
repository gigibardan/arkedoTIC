import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

function ensureCharsetFirstPlugin(): Plugin {
  return {
    name: 'ensure-charset-first',
    enforce: 'post',
    transformIndexHtml(html) {
      const cleaned = html.replace(/^\uFEFF/, '');
      const withoutCharset = cleaned.replace(/<meta\s+charset=["']?[^"'>\s]+["']?\s*\/?>\s*/gi, '');
      return withoutCharset.replace(/<head(\s[^>]*)?>\s*/i, '<head$1>\n    <meta charset="utf-8">\n    ');
    },
  };
}

function autoBuildVersionPlugin(buildId: string): Plugin {
  return {
    name: 'auto-build-version',
    transformIndexHtml(html) {
      return html.replace(/__ARKY_BUILD_VERSION__/g, buildId);
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify({ version: buildId, builtAt: new Date().toISOString() }, null, 2),
      });
    },
  };
}

function buildEnglishIndexHtml(roHtml: string): string {
  const enTitle = 'ArkyEdu – Free Kids ICT, Coding &amp; Arduino Education (Ages 10–15)';
  const enDesc =
    '100% free interactive ICT, C++, Scratch, Excel &amp; Arduino IoT learning platform for students (ages 10–15), featuring 40 lessons, 30 arcade games &amp; 21+ 1v1 duels.';
  const enOgDesc =
    '100% free interactive ICT, C++, Scratch, Excel &amp; Arduino robotics platform for kids (Grades 5–8): 40 modules, 30 arcade games &amp; 21+ live 1v1 duels.';
  const enKeywords =
    'kids coding platform free, ict education grades 5-8, computer science for kids, c++ algorithms kids, scratch 3.0 interactive lessons, excel formulas for students, arduino smart home simulator, html5 web design kids, cyber security for students, vice leonida gta 6 tech game, cyber battleship 1v1, ArkyEdu';

  const enJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://www.arkyedu.com/en/#website',
        name: 'ArkyEdu – Free Kids ICT, Coding & Robotics Platform',
        alternateName: ['ArkyEdu', 'ARKEDO', 'ArkyEdu ICT'],
        url: 'https://www.arkyedu.com/en/',
        inLanguage: 'en',
        publisher: { '@id': 'https://www.arkyedu.com/#organization' },
        description:
          '100% free bilingual educational platform for middle school ICT, Computer Science, C++, Scratch 3.0, Excel spreadsheets, HTML5 web design, cybersecurity, and Arduino Uno IoT robotics.',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://www.arkyedu.com/blog/en/?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
        hasPart: [
          { '@type': 'CollectionPage', name: 'Worksheets & Grading Rubrics 1–10 (16 Sheets)', url: 'https://www.arkyedu.com/fise/en/' },
          { '@type': 'CollectionPage', name: 'ICT & Coding Blog Guides (24 Guides)', url: 'https://www.arkyedu.com/blog/en/' },
          { '@type': 'DefinedTermSet', name: 'Bilingual CS & ICT Glossary (44 Terms)', url: 'https://www.arkyedu.com/glosar/en/' },
          { '@type': 'WebApplication', name: 'Live Code Sandbox C++ / Python / HTML5', url: 'https://www.arkyedu.com/sandbox/en/' },
          { '@type': 'CollectionPage', name: 'ICT Educational Arcade (30 Games)', url: 'https://www.arkyedu.com/arcade/en/' },
          { '@type': 'CollectionPage', name: '1v1 Live Coding Duels Arena (21+ Modes)', url: 'https://www.arkyedu.com/duel/en/' },
          { '@type': 'WebApplication', name: 'Arkedo Smart City Arduino IoT Lab', url: 'https://www.arkyedu.com/oras/en/' },
          { '@type': 'WebApplication', name: 'ICT Teacher Portal & Digital Gradebook', url: 'https://www.arkyedu.com/profesor/en/' },
          { '@type': 'WebApplication', name: 'Vice Leonida Open-World GTA 6 Sandbox 2D', url: 'https://www.arkyedu.com/leonida/en/' },
          { '@type': 'WebApplication', name: 'Interactive AI Literacy & Deepfake Lab', url: 'https://www.arkyedu.com/laborator-ai/en/' },
          { '@type': 'WebApplication', name: 'Visual Algorithms & Von Neumann CPU Lab', url: 'https://www.arkyedu.com/laborator-algoritmi/en/' },
          { '@type': 'VideoGame', name: 'Vice Leonida VI: Cyber Runner (GTA 6 Arcade)', url: 'https://www.arkyedu.com/arcade/vice-leonida-gta6/en/' },
          { '@type': 'VideoGame', name: 'Vice Leonida 1v1: Cyber-Heist Showdown', url: 'https://www.arkyedu.com/duel/vice-leonida-1v1/en/' },
        ],
      },
      {
        '@type': 'EducationalOrganization',
        '@id': 'https://www.arkyedu.com/#organization',
        name: 'ArkyEdu',
        alternateName: 'ARKEDO Digital Education',
        url: 'https://www.arkyedu.com/en/',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.arkyedu.com/pwa-512x512.png',
          width: 512,
          height: 512,
        },
        description:
          'Free non-profit educational platform dedicated to ICT, Computer Science, coding literacy, and robotics for students aged 10–15.',
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'contact@arkyedu.com',
          contactType: 'educational support',
          availableLanguage: ['English', 'Romanian'],
        },
      },
      {
        '@type': 'WebApplication',
        '@id': 'https://www.arkyedu.com/en/#webapp',
        name: 'ArkyEdu ICT & Coding Platform',
        alternateName: ['ARKEDO', 'ArkyEdu', 'ArkyEdu ICT'],
        applicationCategory: 'EducationalApplication',
        applicationSubCategory: 'ICT Education, Coding for Kids, Robotics Simulator',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript, HTML5',
        inLanguage: 'en',
        isAccessibleForFree: true,
        educationalUse: ['Interactive Simulation', 'Self Assessment', 'Classroom Teaching', 'Olympiad Preparation'],
        audience: {
          '@type': 'EducationalAudience',
          educationalRole: ['student', 'teacher', 'parent'],
        },
        description:
          '100% free interactive coding, ICT, Scratch 3.0, C++, Excel, HTML5 & Arduino IoT educational platform with 40 interactive modules, 30 arcade games, and 21+ live 1v1 duels.',
        url: 'https://www.arkyedu.com/en/',
        screenshot: 'https://www.arkyedu.com/pwa-512x512.png',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.arkyedu.com/en/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is ArkyEdu completely free for students, parents, and teachers?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. ArkyEdu is 100% free with zero ads, zero subscriptions, and instant browser access to 40 curriculum modules, 16 printable worksheets, 30 arcade games, and 21+ 1v1 duels.',
            },
          },
          {
            '@type': 'Question',
            name: 'What programming languages and tech skills can kids learn on ArkyEdu?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Students progress from computer hardware, Scratch 3.0, cyber safety, Word, PowerPoint, and 3D modeling to Excel formulas (SUM, AVERAGE, IF), HTML5 web design, C++ algorithms, AI literacy, and Arduino Uno IoT robotics.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does ArkyEdu work in Romanian as well as English?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. The entire platform is bilingual: Romanian is served at https://www.arkyedu.com/ and English is served at https://www.arkyedu.com/en/ with dedicated hreflang URLs across guides, worksheets, glossary, and labs.',
            },
          },
        ],
      },
    ],
  };

  const enNoscript = `<noscript>
      <header>
        <h1>ArkyEdu — Free Interactive ICT, Coding &amp; Robotics Platform for Kids (Grades 5–8)</h1>
        <p>100% free bilingual platform with 40 interactive curriculum modules, live C++ / Python / HTML5 sandbox, AI &amp; CPU simulators, 30 educational arcade games, and 21+ live 1v1 duels.</p>
      </header>
      <nav aria-label="ArkyEdu English Navigation">
        <ul>
          <li><a href="/en/">ArkyEdu English Home</a></li>
          <li><a href="/">ArkyEdu Română (RO)</a></li>
          <li><a href="/fise/en/">Worksheets &amp; Grading Rubrics 1–10 (16 Bilingual Sheets)</a></li>
          <li><a href="/leonida/en/">Vice Leonida Open-World Story (GTA 6 2D Sandbox)</a></li>
          <li><a href="/laborator-ai/en/">Interactive AI Literacy &amp; Deepfake Detector Lab</a></li>
          <li><a href="/laborator-algoritmi/en/">Visual Algorithms, Binary &amp; Von Neumann CPU Lab</a></li>
          <li><a href="/blog/en/">ICT, Coding &amp; AI Study Guides (24 Articles)</a></li>
          <li><a href="/glosar/en/">Computer Science &amp; ICT Glossary (44 Essential Terms)</a></li>
          <li><a href="/sandbox/en/">Live Browser Code Sandbox (C++17, Python 3 &amp; HTML5)</a></li>
          <li><a href="/arcade/en/">ICT Educational Arcade (30 Retro &amp; Coding Games)</a></li>
          <li><a href="/duel/en/">1v1 Live Coding Duels Arena (21+ Modes)</a></li>
          <li><a href="/oras/en/">Arkedo Smart City: Arduino IoT &amp; Robotics Lab</a></li>
          <li><a href="/profesor/en/">ICT Teacher Portal &amp; Digital Gradebook</a></li>
          <li><a href="/arcade/vice-leonida-gta6/en/">Vice Leonida VI: Cyber Runner Arcade Game</a></li>
          <li><a href="/duel/vice-leonida-1v1/en/">Vice Leonida 1v1: Cyber-Heist Showdown</a></li>
        </ul>
      </nav>
    </noscript>`;

  return roHtml
    .replace(/<html\s+lang="ro">/i, '<html lang="en">')
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${enTitle}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${enDesc}" />`)
    .replace(/<meta\s+name="author"\s+content="[^"]*"\s*\/?>/i, '<meta name="author" content="ArkyEdu — Digital ICT Education" />')
    .replace(/<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/i, `<meta name="keywords" content="${enKeywords}" />`)
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${enTitle}" />`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${enOgDesc}" />`)
    .replace(/<meta\s+property="og:locale"\s+content="ro_RO"\s*\/?>/i, '<meta property="og:locale" content="en_US" />')
    .replace(/<meta\s+property="og:locale:alternate"\s+content="en_US"\s*\/?>/i, '<meta property="og:locale:alternate" content="ro_RO" />')
    .replace(
      /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/?>/i,
      '<meta property="og:image:alt" content="ArkyEdu — Free Interactive ICT, Coding and Robotics Platform for Kids (Ages 10–15)" />'
    )
    .replace(/<meta\s+property="og:url"\s+content="https:\/\/www\.arkyedu\.com\/"\s*\/?>/i, '<meta property="og:url" content="https://www.arkyedu.com/en/" />')
    .replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${enTitle}" />`)
    .replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
      '<meta name="twitter:description" content="40 interactive ICT lessons, C++ &amp; Arduino IoT simulators, Excel, HTML5, 30 arcade games (incl. Vice Leonida GTA 6 Tech) &amp; 21+ 1v1 duels — 100% free." />'
    )
    .replace(
      /<link\s+rel="canonical"\s+href="https:\/\/www\.arkyedu\.com\/"\s*\/?>/i,
      '<link rel="canonical" href="https://www.arkyedu.com/en/" />'
    )
    .replace(
      /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
      `<script type="application/ld+json">\n    ${JSON.stringify(enJsonLd, null, 2)}\n    </script>`
    )
    .replace(/<noscript>\s*<header>[\s\S]*?<\/noscript>/i, enNoscript);
}

function englishSpaEntryPlugin(): Plugin {
  return {
    name: 'arky-english-spa-entry',
    enforce: 'post',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const rootHtmlPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(rootHtmlPath)) return;
      const roHtml = fs.readFileSync(rootHtmlPath, 'utf-8');
      const enDir = path.join(distDir, 'en');
      fs.mkdirSync(enDir, { recursive: true });
      fs.writeFileSync(path.join(enDir, 'index.html'), buildEnglishIndexHtml(roHtml), 'utf-8');
    },
  };
}

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';
  const buildId = isBuild
    ? new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)
    : 'dev';

  return {
    define: {
      __APP_VERSION__: JSON.stringify(buildId),
    },
    plugins: [
      react(),
      tailwindcss(),
      autoBuildVersionPlugin(buildId),
      ensureCharsetFirstPlugin(),
      englishSpaEntryPlugin(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
        manifest: {
          id: '/',
          name: 'ArkyEdu: Platformă Interactivă TIC & Coding',
          short_name: 'ArkyEdu',
          description: 'Platformă educativă și interactivă de TIC pentru elevii de gimnaziu: Sisteme de calcul, Sisteme de Operare, Securitate Web, Arcade Retro și Dueluri 1v1.',
          theme_color: '#0f172a',
          background_color: '#0f172a',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          orientation: 'any',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          cleanupOutdatedCaches: true,
          navigateFallback: null,
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
          globPatterns: ['assets/**/*.{js,css}', 'icon.svg', 'favicon.ico', 'apple-touch-icon.png', 'pwa-*.png'],
          globIgnores: ['**/assets/aistudio/**', '**/version.json'],
          runtimeCaching: [
            {
              urlPattern: /\/version\.json/,
              handler: 'NetworkOnly',
            },
            {
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'arky-pages-cache',
                networkTimeoutSeconds: 3,
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 7,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          // Keep dev SW disabled so vite-plugin-pwa does not call import.meta.hot.send() before Vite 6 WS connects
          enabled: false,
          type: 'module',
        },
      }),
    ],
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('firebase')) {
                return 'vendor-firebase';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('motion') || id.includes('framer-motion')) {
                return 'vendor-motion';
              }
              if (id.includes('react') || id.includes('scheduler')) {
                return 'vendor-react';
              }
            }
          },
        },
      },
    },
  };
});
