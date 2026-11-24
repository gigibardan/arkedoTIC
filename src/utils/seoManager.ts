import { AllMissionId, Language } from '../types';

export type AppSeoView =
  | 'catalog'
  | 'lesson'
  | 'teacher'
  | 'arcade'
  | 'duel'
  | 'city'
  | 'superadmin'
  | 'blog'
  | 'glossary'
  | 'sandbox'
  | 'carnet'
  | 'evaluare'
  | 'livequiz'
  | 'fise'
  | 'leonida'
  | 'ailab'
  | 'algolab';

const BASE_URL = 'https://www.arkyedu.com';

const MISSION_ID_MAP: Record<string, string> = {
  hardware: 'hardware',
  files: 'fisiere-so',
  internet1: 'internet-siguranta',
  internet2: 'internet-siguranta',
  text1: 'editoare-text',
  text2: 'editoare-text',
  algo1: 'algoritmi',
  algo2: 'algoritmi',
  scratch1: 'scratch',
  scratch2: 'scratch',
  g6_presentation1: 'prezentari-slides',
  g6_presentation2: 'prezentari-slides-2',
  g6_paint3d: 'paint-3d',
  g6_anim3d: 'animatie-vr-toontastic-cospaces',
  g6_malware: 'malware-securitate',
  g6_email: 'email-neticheta',
  g6_scratch1: 'algoritmi-bucle-scratch-1',
  g6_scratch2: 'algoritmi-contor-minecraft-scratch',
};

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  if (typeof document === 'undefined') return;
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  if (typeof document === 'undefined') return;
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export interface AlternateRouteUrls {
  roPath: string;
  enPath: string;
  hasPairedEnRoute: boolean;
}

type AlternateRouteListener = (routes: AlternateRouteUrls) => void;

let currentAlternateRoutes: AlternateRouteUrls = {
  roPath: '/',
  enPath: '/en/',
  hasPairedEnRoute: true,
};
const alternateRouteListeners = new Set<AlternateRouteListener>();

export function subscribeAlternateRoutes(listener: AlternateRouteListener): () => void {
  alternateRouteListeners.add(listener);
  listener(currentAlternateRoutes);
  return () => {
    alternateRouteListeners.delete(listener);
  };
}

function notifyAlternateRoutes(next: AlternateRouteUrls) {
  currentAlternateRoutes = next;
  for (const listener of alternateRouteListeners) {
    try {
      listener(next);
    } catch {
      // Ignore subscriber errors
    }
  }
}

function upsertHreflang(hreflang: 'ro' | 'en' | 'x-default', href: string | null) {
  if (typeof document === 'undefined') return;
  const existing = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hreflang}"]`);
  if (!href) {
    if (existing) existing.remove();
    return;
  }
  const el = existing || document.createElement('link');
  el.setAttribute('rel', 'alternate');
  el.setAttribute('hreflang', hreflang);
  el.setAttribute('href', href);
  if (!existing) {
    document.head.appendChild(el);
  }
}

function upsertJsonLd(id: string, data: Record<string, unknown> | null) {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById(id);
  if (!data) {
    if (existing) existing.remove();
    return;
  }
  const script = existing instanceof HTMLScriptElement ? existing : document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  if (!existing) {
    document.head.appendChild(script);
  }
}

let activeSeoRequestToken = 0;

export async function updateDynamicSeo(
  view: AppSeoView,
  lang: Language,
  activeMission: AllMissionId | null,
  blogSlug: string | null = null,
  glossarySlug: string | null = null,
  arcadeGame: string | null = null,
  duelMode: string | null = null,
  worksheetSlug: string | null = null
): Promise<void> {
  if (typeof document === 'undefined') return;

  const requestToken = ++activeSeoRequestToken;
  const isEn = lang === 'en';
  document.documentElement.lang = isEn ? 'en' : 'ro';

  let title = isEn
    ? 'ArkyEdu – Free Kids ICT, Coding & Arduino Education (Ages 10–15)'
    : 'ArkyEdu – Educație TIC, Coding & Robotică Copii (V–VIII)';

  let description = isEn
    ? '100% free interactive ICT, C++, Scratch, Excel & Arduino IoT learning platform for students aged 10-15, featuring 40 lessons, 30 arcade games & 21+ 1v1 duels.'
    : 'Platformă 100% gratuită de educație TIC, programare C++/Scratch, Excel și robotică Arduino pentru copii (clasele V–VIII), 30 jocuri arcade și 21+ dueluri 1v1.';

  let canonicalUrl = isEn ? `${BASE_URL}/en/` : `${BASE_URL}/`;
  let hreflangRoUrl: string | null = `${BASE_URL}/`;
  let hreflangEnUrl: string | null = `${BASE_URL}/en/`;
  let hreflangXDefaultUrl: string | null = `${BASE_URL}/`;
  let hasPairedEnRoute = view === 'catalog';
  let robotsContent = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
  let dynamicJsonLd: Record<string, unknown> | null = null;

  if (view === 'superadmin') {
    title = isEn ? 'School Admin Panel | ArkyEdu' : 'Administrare Școli & Clase | ArkyEdu';
    robotsContent = 'noindex, nofollow';
    canonicalUrl = `${BASE_URL}/superadmin`;
    hreflangRoUrl = null;
    hreflangEnUrl = null;
    hreflangXDefaultUrl = null;
  } else if (view === 'teacher') {
    title = isEn
      ? 'Teacher Portal & Digital Gradebook | ArkyEdu ICT'
      : 'Portal Profesor TIC: Catalog Digital & Bareme 1–10 | ArkyEdu';
    description = isEn
      ? 'Digital gradebook, curriculum sheets, automated scoring (1-10) and GDPR-compliant class management for ICT & Computer Science teachers.'
      : 'Instrument gratuit pentru profesorii de TIC: catalog digital, evaluare automată pe bareme 1–10, export condică și fișe conforme programei naționale.';
    canonicalUrl = `${BASE_URL}/profesor/`;
    hreflangRoUrl = canonicalUrl;
    hreflangEnUrl = null;
    hreflangXDefaultUrl = canonicalUrl;
  } else if (view === 'arcade') {
    if (arcadeGame === 'vice_leonida') {
      title = isEn
        ? 'Vice Leonida VI: Cyber Runner – GTA 6 Tech Arcade Game | ArkyEdu'
        : 'Vice Leonida VI: Cyber Runner – Joc Arcade GTA 6 TIC | ArkyEdu';
      description = isEn
        ? 'Play Vice Leonida VI: Cyber Runner free in browser! Swap Lucia Caminos & Jason Duval across Vice Beach, Venetian Causeway, Port Gellhorn & Grassrivers Airboat.'
        : 'Joacă gratuit Vice Leonida VI: Cyber Runner, joc arcade inspirat din GTA 6 cu Lucia Caminos & Jason Duval, 4 sectoare din Leonida, Airboat și hack-uri binare TIC.';
      hreflangRoUrl = `${BASE_URL}/arcade/vice-leonida-gta6/`;
      hreflangEnUrl = `${BASE_URL}/arcade/vice-leonida-gta6/en/`;
      hreflangXDefaultUrl = hreflangRoUrl;
      canonicalUrl = isEn ? hreflangEnUrl : hreflangRoUrl;
      hasPairedEnRoute = true;
      dynamicJsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'VideoGame',
            name: 'Vice Leonida VI: Cyber Runner',
            alternateName: ['Vice Leonida GTA 6 Tech Arcade', 'GTA 6 Leonida Educational Runner'],
            url: canonicalUrl,
            description,
            image: `${BASE_URL}/assets/leonida-hero.jpg`,
            genre: ['Arcade', 'Educational', 'Cyberpunk Racing'],
            gamePlatform: ['Web Browser', 'Desktop', 'Mobile'],
            applicationCategory: 'Game',
            operatingSystem: 'All',
            isAccessibleForFree: true,
            inLanguage: ['ro', 'en'],
            character: [
              { '@type': 'Person', name: 'Lucia Caminos' },
              { '@type': 'Person', name: 'Jason Duval' },
            ],
            gameLocation: {
              '@type': 'Place',
              name: 'State of Leonida (Vice Beach, Venetian Causeway, Port Gellhorn, Grassrivers)',
            },
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'RON' },
          },
          {
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: isEn ? 'How do you play Vice Leonida VI: Cyber Runner?' : 'Cum se joacă Vice Leonida VI: Cyber Runner (stil GTA 6)?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: isEn
                    ? 'Drive across 4 State of Leonida sectors, swap live between Lucia Caminos (Nitro & Data Shards) and Jason Duval (Steering & Kinetic Shield) with Q, trigger EMP with E, morph into a Cyber Airboat in Grassrivers, and solve 4-bit binary & ICT vault breaches.'
                    : 'Traversezi 4 sectoare din Leonida (Vice Beach, Venetian Causeway, Port Gellhorn, Grassrivers Airboat), schimbi live între Lucia Caminos și Jason Duval cu Q, folosești Nitro și EMP (E) și rezolvi hack-uri binare pe 4 biți și întrebări TIC.',
                },
              },
            ],
          },
        ],
      };
    } else {
      title = isEn
        ? 'ICT Educational Arcade: 30 Retro Coding & Tech Games | ArkyEdu'
        : 'Arcade TIC: 30 Jocuri Educative Programare & Hardware | ArkyEdu';
      description = isEn
        ? 'Play 30 free educational retro & open-world games: Vice Leonida Open-World (GTA 6), Cyber Runner, Cyber Pac-Man, Arkanoid, Frogger, Sokoban & PC Builder.'
        : '30 mini-jocuri arcade gratuite pentru educație digitală: Vice Leonida Open-World (GTA 6), Cyber Runner, Pac-Man, Arkanoid, Frogger, Sokoban & PC Builder.';
      canonicalUrl = `${BASE_URL}/arcade/`;
      hreflangRoUrl = canonicalUrl;
      hreflangEnUrl = null;
      hreflangXDefaultUrl = canonicalUrl;
      dynamicJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: title,
        description,
        url: canonicalUrl,
        image: `${BASE_URL}/assets/og-arcade-duel.jpg`,
        inLanguage: ['ro', 'en'],
      };
    }
  } else if (view === 'duel') {
    if (duelMode === 'vice_leonida_duel') {
      title = isEn
        ? 'Vice Leonida 1v1: GTA 6 Cyber-Heist Live Showdown | ArkyEdu'
        : 'Vice Leonida 1v1: Duel GTA 6 Cyber-Heist Live & AI Bot | ArkyEdu';
      description = isEn
        ? 'Compete 1v1 in Vice Leonida Cyber-Heist Showdown! Race to 2,500 Vault Points with Lucia & Jason, hit ICT Boost Gates, and launch live cyber sabotages.'
        : 'Duel multiplayer 1v1 inspirat din GTA 6! Întrece-te până la 2.500 puncte Vault în Vice Beach cu Boost Gates TIC și sabotaje live: Drone 3★, Glitch și Firewall Lock.';
      hreflangRoUrl = `${BASE_URL}/duel/vice-leonida-1v1/`;
      hreflangEnUrl = `${BASE_URL}/duel/vice-leonida-1v1/en/`;
      hreflangXDefaultUrl = hreflangRoUrl;
      canonicalUrl = isEn ? hreflangEnUrl : hreflangRoUrl;
      hasPairedEnRoute = true;
      dynamicJsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'VideoGame',
            name: 'Vice Leonida 1v1: Cyber-Heist Showdown',
            url: canonicalUrl,
            description,
            image: `${BASE_URL}/assets/leonida-hero.jpg`,
            genre: ['Multiplayer 1v1', 'Arcade Racing', 'Educational'],
            playMode: ['MultiPlayer', 'SinglePlayer'],
            gamePlatform: ['Web Browser', 'Desktop', 'Mobile'],
            applicationCategory: 'Game',
            operatingSystem: 'All',
            isAccessibleForFree: true,
            inLanguage: ['ro', 'en'],
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'RON' },
          },
          {
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: isEn ? 'Can I play Vice Leonida 1v1 against friends or AI Bot?' : 'Pot juca Vice Leonida 1v1 contra unui coleg sau contra AI Bot?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: isEn
                    ? 'Yes! Create a 4-character live Firestore room to race a friend in real time, or select Cyber-Bot Leonida AI for instant solo 1v1 practice.'
                    : 'Da! Poți crea o cameră live cu cod din 4 caractere pentru duel în timp real cu un coleg sau poți alege antrenament instant contra Cyber-Bot Leonida AI.',
                },
              },
            ],
          },
        ],
      };
    } else {
      title = isEn
        ? '1v1 Live Tech & Coding Duels Arena (21+ Modes) | ArkyEdu'
        : 'Arena Dueluri TIC 1v1 Live: 21+ Competiții Coding | ArkyEdu';
      description = isEn
        ? 'Compete live 1v1 in Vice Leonida 1v1 (GTA 6), Cyber Battleship, File-Drop Attack Tetris, System Sabotage, C++ Code Racer, Binary Clash & Circuit Duel.'
        : 'Confruntări live 1v1 pentru elevi: Vice Leonida 1v1 (GTA 6), Cyber Battleship, File-Drop Attack, System Sabotage, C++ Code Racer, Binary Clash și Circuit Clash.';
      canonicalUrl = `${BASE_URL}/duel/`;
      hreflangRoUrl = canonicalUrl;
      hreflangEnUrl = null;
      hreflangXDefaultUrl = canonicalUrl;
      dynamicJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: title,
        description,
        url: canonicalUrl,
        image: `${BASE_URL}/assets/og-arcade-duel.jpg`,
        inLanguage: ['ro', 'en'],
      };
    }
  } else if (view === 'city') {
    title = isEn
      ? 'Arkedo Smart City: Arduino IoT & Robotics Lab | ArkyEdu'
      : 'Arkedo Smart City: Laborator IoT & Robotică Arduino | ArkyEdu';
    description = isEn
      ? 'Interactive Smart City & IoT robotics lab: PWM smart lighting, ultrasonic barriers, MQ-2 gas alerts, and Arduino Uno sensors in your browser.'
      : 'Simulator interactiv Smart City IoT pentru gimnaziu: iluminat PWM, senzori ultrasonici HC-SR04, alarmă gaz MQ-2 și microcontroller Arduino Uno.';
    canonicalUrl = `${BASE_URL}/oras/`;
    hreflangRoUrl = canonicalUrl;
    hreflangEnUrl = null;
    hreflangXDefaultUrl = canonicalUrl;
  } else if (view === 'blog') {
    const { findBlogArticleBySlug } = await import('../data/blog');
    if (requestToken !== activeSeoRequestToken) return;
    const article = findBlogArticleBySlug(blogSlug);
    hasPairedEnRoute = true;
    if (article) {
      const content = isEn ? article.en : article.ro;
      title = content.metaTitle;
      description = content.metaDescription.slice(0, 158);
      hreflangRoUrl = `${BASE_URL}/blog/${article.ro.slug}/`;
      hreflangEnUrl = `${BASE_URL}/blog/en/${article.en.slug}/`;
      hreflangXDefaultUrl = hreflangRoUrl;
      canonicalUrl = isEn ? hreflangEnUrl : hreflangRoUrl;
    } else {
      title = isEn
        ? 'ICT, Coding & Tech Guides Blog (Grades 5–8) | ArkyEdu'
        : 'Blog & Ghiduri TIC Gimnaziu: C++, Excel, AI & Siguranță Online | ArkyEdu';
      description = isEn
        ? 'Practical bilingual guides for middle school students, parents, and ICT teachers: C++ troubleshooting, Excel formulas, AI study habits, and online safety.'
        : 'Articole și ghiduri practice de TIC pentru clasele V–VIII: rezolvare erori C++, formule Excel, AI & ChatGPT la școală și siguranță online pe Roblox, TikTok și Discord.';
      hreflangRoUrl = `${BASE_URL}/blog/`;
      hreflangEnUrl = `${BASE_URL}/blog/en/`;
      hreflangXDefaultUrl = hreflangRoUrl;
      canonicalUrl = isEn ? hreflangEnUrl : hreflangRoUrl;
    }
  } else if (view === 'glossary') {
    const { findGlossaryTermBySlug } = await import('../data/glossary');
    if (requestToken !== activeSeoRequestToken) return;
    const found = findGlossaryTermBySlug(glossarySlug).term;
    hasPairedEnRoute = true;
    if (found) {
      const c = isEn ? found.en : found.ro;
      title = isEn ? `${c.term} – Definition & Examples | ArkyEdu Glossary` : `${c.term} – Definiție, Exemplu & Teste | Glosar ArkyEdu`;
      description = c.shortAnswer.slice(0, 158);
      hreflangRoUrl = `${BASE_URL}/glosar/${found.ro.slug}/`;
      hreflangEnUrl = `${BASE_URL}/glosar/en/${found.en.slug}/`;
      hreflangXDefaultUrl = hreflangRoUrl;
      canonicalUrl = isEn ? hreflangEnUrl : hreflangRoUrl;
    } else {
      title = isEn
        ? 'Bilingual ICT & Computer Science Glossary (Grades 5–8) | ArkyEdu'
        : 'Glosar Bilingv Informatică & TIC (Clasele V–VIII) | ArkyEdu';
      description = isEn
        ? '44 essential middle-school CS & ICT terms explained clearly: CPU, RAM, C++ modulo %, Excel IF, Phishing 2FA, Arduino millis() & AI prompting.'
        : '44 de termeni esențiali de Informatică și TIC explicați clar pentru gimnaziu: CPU, RAM, modulo %, Excel IF, Phishing 2FA, Arduino millis() și AI.';
      hreflangRoUrl = `${BASE_URL}/glosar/`;
      hreflangEnUrl = `${BASE_URL}/glosar/en/`;
      hreflangXDefaultUrl = hreflangRoUrl;
      canonicalUrl = isEn ? hreflangEnUrl : hreflangRoUrl;
    }
  } else if (view === 'fise') {
    const { findWorksheetBySlug } = await import('../data/worksheets');
    if (requestToken !== activeSeoRequestToken) return;
    const foundWs = findWorksheetBySlug(worksheetSlug).worksheet;
    hasPairedEnRoute = true;
    if (foundWs) {
      const wLoc = isEn ? foundWs.en : foundWs.ro;
      title = wLoc.metaTitle;
      description = wLoc.metaDescription.slice(0, 158);
      hreflangRoUrl = `${BASE_URL}/fise/${foundWs.ro.slug}/`;
      hreflangEnUrl = `${BASE_URL}/fise/en/${foundWs.en.slug}/`;
      hreflangXDefaultUrl = hreflangRoUrl;
      canonicalUrl = isEn ? hreflangEnUrl : hreflangRoUrl;
      dynamicJsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': ['LearningResource', 'Quiz'],
            name: wLoc.title,
            description: wLoc.directAnswerSummary,
            url: canonicalUrl,
            image: `${BASE_URL}/assets/og-worksheets.jpg`,
            inLanguage: isEn ? 'en' : 'ro',
            isAccessibleForFree: true,
            educationalLevel: isEn ? `Grade ${foundWs.grade}` : `Clasa a ${foundWs.grade}-a`,
            learningResourceType: foundWs.kind,
            timeRequired: `PT${foundWs.estimatedMinutes}M`,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'RON' },
          },
          ...(foundWs.faqs.length > 0
            ? [
                {
                  '@type': 'FAQPage',
                  mainEntity: foundWs.faqs.map((f) => ({
                    '@type': 'Question',
                    name: isEn ? f.qEn : f.qRo,
                    acceptedAnswer: { '@type': 'Answer', text: isEn ? f.aEn : f.aRo },
                  })),
                },
              ]
            : []),
        ],
      };
    } else {
      title = isEn
        ? 'ICT Worksheets, Graded Exams (1–10) & C++ Olympiad Bank | ArkyEdu'
        : 'Fișe de Lucru, Teste cu Barem 1–10 & Subiecte OJI TIC (V–VIII) | ArkyEdu';
      description = isEn
        ? '16 printable A4 and interactive ICT & C++ worksheets, graded exams with 100-point rubrics, Scratch, Excel & Arduino IoT project sheets for Grades 5–8.'
        : '16 fișe de lucru și teste cu barem oficial 1–10 (100p) pentru clasele V–VIII: C++, Scratch, Excel, Word, HTML5, Securitate & Arduino Smart City. Tipărire A4 gratuită.';
      hreflangRoUrl = `${BASE_URL}/fise/`;
      hreflangEnUrl = `${BASE_URL}/fise/en/`;
      hreflangXDefaultUrl = hreflangRoUrl;
      canonicalUrl = isEn ? hreflangEnUrl : hreflangRoUrl;
      dynamicJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: title,
        description,
        url: canonicalUrl,
        image: `${BASE_URL}/assets/og-worksheets.jpg`,
        inLanguage: ['ro', 'en'],
      };
    }
  } else if (view === 'sandbox') {
    title = isEn
      ? 'C++ Step Debugger, Code Sandbox & ICT Olympiad Arena | ArkyEdu'
      : 'Debug Vizual C++ Pas-cu-Pas, Sandbox & Olimpiada TIC | ArkyEdu';
    description = isEn
      ? 'Step-by-step C++ RAM & array trace debugger with breakpoints, 12-problem ICT Olympiad Arena, Python 3 & HTML5 live sandbox in your browser.'
      : 'Depanator vizual C++ pas-cu-pas cu memorie RAM și vectori, Arena Olimpiada TIC cu 12 probleme pe 5 teste, plus Python 3 și HTML5 direct în browser.';
    hreflangRoUrl = `${BASE_URL}/sandbox/`;
    hreflangEnUrl = `${BASE_URL}/sandbox/en/`;
    hreflangXDefaultUrl = hreflangRoUrl;
    canonicalUrl = isEn ? hreflangEnUrl : hreflangRoUrl;
    hasPairedEnRoute = true;
  } else if (view === 'carnet') {
    title = isEn
      ? 'My Digital Portfolio: Grades, Diplomas & Streaks | ArkyEdu'
      : 'Carnetul Meu Digital: Note, Diplome & Progres TIC | ArkyEdu';
    description = isEn
      ? 'Personal ArkyEdu student portfolio with real curriculum grades, printable certificates, daily streaks, badges, and Arcade highscores.'
      : 'Carnetul digital personal ArkyEdu cu note pe clase, diplome imprimabile, serie zilnică, insigne și recorduri Arcade.';
    robotsContent = 'noindex, nofollow';
    canonicalUrl = `${BASE_URL}/carnet`;
    hreflangRoUrl = null;
    hreflangEnUrl = null;
    hreflangXDefaultUrl = null;
  } else if (view === 'evaluare') {
    title = isEn
      ? 'ICT & CS Timed Evaluation Simulator (Grades 5–8) | ArkyEdu'
      : 'Test Rapid & Simulare Evaluare TIC (Clasele V–VIII) | ArkyEdu';
    description = isEn
      ? 'Generate randomized timed ICT & coding tests across Grades 5–8 with automated 1–10 grading, detailed answer explanations, and Cloud progress tracking.'
      : 'Generează teste rapide cronometrate din programa TIC și Informatică V–VIII, cu notare automată 1–10 și explicații pas cu pas.';
    canonicalUrl = `${BASE_URL}/evaluare`;
    hreflangRoUrl = canonicalUrl;
    hreflangEnUrl = null;
    hreflangXDefaultUrl = canonicalUrl;
  } else if (view === 'livequiz') {
    title = isEn
      ? 'Live Classroom Quiz Arena (PIN Join) | ArkyEdu'
      : 'Quiz Live în Clasă (Intrare cu Cod PIN) | ArkyEdu';
    description = isEn
      ? 'Join your teacher live ICT classroom quiz using a 6-digit PIN from phone, tablet, or lab PC.'
      : 'Participă în timp real la concursul Quiz Live din ora de TIC introducând codul PIN de pe tablă.';
    robotsContent = 'noindex, nofollow';
    canonicalUrl = `${BASE_URL}/quiz-live`;
    hreflangRoUrl = null;
    hreflangEnUrl = null;
    hreflangXDefaultUrl = null;
  } else if (view === 'leonida') {
    const { LEONIDA_FAQS } = await import('../data/leonidaOpenWorldData');
    if (requestToken !== activeSeoRequestToken) return;
    title = isEn
      ? 'Vice Leonida: GTA 6 Open-World Game & State of Leonida Tech Hub | ArkyEdu'
      : 'Vice Leonida: Joc Open-World GTA 6 & Universul Leonida TIC | ArkyEdu';
    description = isEn
      ? 'Play Vice Leonida Open-World 2D free in browser! Explore 6 GTA 6 State of Leonida districts with Lucia Caminos & Jason Duval, drive 5 vehicles, evade 5-star VCPD chases & crack CS quests.'
      : 'Joacă gratuit Vice Leonida Open-World 2D direct în browser! Explorează toate cele 6 regiuni din GTA 6 Leonida cu Lucia Caminos & Jason Duval, condu 5 vehicule + Airboat și sparge misiuni TIC.';
    hreflangRoUrl = `${BASE_URL}/leonida/`;
    hreflangEnUrl = `${BASE_URL}/leonida/en/`;
    hreflangXDefaultUrl = hreflangRoUrl;
    canonicalUrl = isEn ? hreflangEnUrl : hreflangRoUrl;
    hasPairedEnRoute = true;
    dynamicJsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['VideoGame', 'SoftwareApplication', 'LearningResource'],
          name: 'Vice Leonida: Open-World Story & State of Leonida Hub',
          alternateName: ['Vice Leonida GTA 6 Open-World', 'GTA 6 Leonida Educational Game'],
          url: canonicalUrl,
          description,
          image: `${BASE_URL}/assets/leonida-hero.jpg`,
          genre: ['Open-World', 'Educational', 'Action Adventure', 'Computer Science'],
          gamePlatform: ['Web Browser', 'Desktop', 'Mobile'],
          applicationCategory: 'GameApplication',
          operatingSystem: 'All',
          isAccessibleForFree: true,
          inLanguage: ['ro', 'en'],
          character: [
            { '@type': 'Person', name: 'Lucia Caminos' },
            { '@type': 'Person', name: 'Jason Duval' },
          ],
          gameLocation: {
            '@type': 'Place',
            name: 'State of Leonida (Vice City, Leonida Keys, Port Gellhorn, Grassrivers, Mount Kalaga, Ambrosia)',
          },
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'RON' },
        },
        {
          '@type': 'FAQPage',
          mainEntity: LEONIDA_FAQS.map((f) => ({
            '@type': 'Question',
            name: isEn ? f.qEn : f.qRo,
            acceptedAnswer: { '@type': 'Answer', text: isEn ? f.aEn : f.aRo },
          })),
        },
      ],
    };
  } else if (view === 'ailab') {
    const { AI_LAB_FAQS } = await import('../data/aiLabData');
    if (requestToken !== activeSeoRequestToken) return;
    title = isEn
      ? 'AI Literacy & Deepfake Detector Lab for Students (Ages 10–15) | ArkyEdu'
      : 'Laborator AI & Detector Deepfake pentru Elevi (Clasele V–VIII) | ArkyEdu';
    description = isEn
      ? 'Explore free interactive LLM tokenizers, Softmax Temperature & hallucinations, 6 Deepfake photo/voice forensics cases & C.R.I.F. Prompt Architect.'
      : 'Simulator gratuit pentru elevi: Tokenizator LLM, Temperatură & Halucinații AI, 6 cazuri de detecție Deepfake foto/audio/știri și Prompt Architect C.R.I.F.';
    hreflangRoUrl = `${BASE_URL}/laborator-ai/`;
    hreflangEnUrl = `${BASE_URL}/laborator-ai/en/`;
    hreflangXDefaultUrl = hreflangRoUrl;
    canonicalUrl = isEn ? hreflangEnUrl : hreflangRoUrl;
    hasPairedEnRoute = true;
    dynamicJsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['LearningResource', 'SoftwareApplication'],
          name: isEn ? 'ArkyEdu AI Literacy & Deepfake Forensics Lab' : 'Laboratorul AI & Detectorul de Deepfake ArkyEdu',
          url: canonicalUrl,
          description,
          image: `${BASE_URL}/assets/ai-lab-hero.jpg`,
          applicationCategory: 'EducationalApplication',
          operatingSystem: 'All',
          isAccessibleForFree: true,
          inLanguage: ['ro', 'en'],
          educationalLevel: isEn ? 'Middle School (Grades 5–8)' : 'Gimnaziu (Clasele V–VIII)',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'RON' },
        },
        {
          '@type': 'FAQPage',
          mainEntity: AI_LAB_FAQS.map((f) => ({
            '@type': 'Question',
            name: isEn ? f.qEn : f.qRo,
            acceptedAnswer: { '@type': 'Answer', text: isEn ? f.aEn : f.aRo },
          })),
        },
      ],
    };
  } else if (view === 'algolab') {
    const { ALGO_LAB_FAQS } = await import('../data/algoLabData');
    if (requestToken !== activeSeoRequestToken) return;
    title = isEn
      ? 'Visual Algorithms, Binary 8-Bit & Von Neumann CPU Lab | ArkyEdu'
      : 'Laborator Algoritmi Vizuali, Binar & CPU Von Neumann | ArkyEdu';
    description = isEn
      ? 'Animate Bubble Sort, Selection Sort, Insertion Sort & Binary Search live with C++, toggle 8-bit binary/RGB LEDs, step through a Von Neumann CPU and wire logic gates.'
      : 'Animație pas-cu-pas Bubble Sort, Căutare Binară și cod C++, registru binar 8-biți / RGB, simulator CPU Von Neumann Fetch-Decode-Execute și porți logice.';
    hreflangRoUrl = `${BASE_URL}/laborator-algoritmi/`;
    hreflangEnUrl = `${BASE_URL}/laborator-algoritmi/en/`;
    hreflangXDefaultUrl = hreflangRoUrl;
    canonicalUrl = isEn ? hreflangEnUrl : hreflangRoUrl;
    hasPairedEnRoute = true;
    dynamicJsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['LearningResource', 'SoftwareApplication'],
          name: isEn ? 'ArkyEdu Visual Algorithms, Binary & CPU Architecture Lab' : 'Laboratorul Vizual de Algoritmi, Binar & CPU ArkyEdu',
          url: canonicalUrl,
          description,
          image: `${BASE_URL}/assets/algo-lab-hero.jpg`,
          applicationCategory: 'EducationalApplication',
          operatingSystem: 'All',
          isAccessibleForFree: true,
          inLanguage: ['ro', 'en'],
          educationalLevel: isEn ? 'Middle School (Grades 5–8)' : 'Gimnaziu (Clasele V–VIII)',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'RON' },
        },
        {
          '@type': 'FAQPage',
          mainEntity: ALGO_LAB_FAQS.map((f) => ({
            '@type': 'Question',
            name: isEn ? f.qEn : f.qRo,
            acceptedAnswer: { '@type': 'Answer', text: isEn ? f.aEn : f.aRo },
          })),
        },
      ],
    };
  } else if (view === 'lesson' && activeMission) {
    const { CURRICULA_MODULES } = await import('../data/curriculaData');
    if (requestToken !== activeSeoRequestToken) return;
    const mappedId = MISSION_ID_MAP[activeMission] || activeMission;
    const mod = CURRICULA_MODULES.find((m) => m.id === mappedId || m.missionId === activeMission);
    if (mod) {
      title = isEn
        ? `${mod.shortTitle} – Interactive ICT Lab | ArkyEdu`
        : `${mod.shortTitle} – ${mod.grade} | ArkyEdu TIC`;
      description = mod.metaDescription.slice(0, 158);
      canonicalUrl = `${BASE_URL}/cursuri/${mod.id}/`;
      hreflangRoUrl = canonicalUrl;
      hreflangEnUrl = null;
      hreflangXDefaultUrl = canonicalUrl;
    }
  }

  const socialImage =
    view === 'leonida' ||
    (view === 'arcade' && arcadeGame === 'vice_leonida') ||
    (view === 'duel' && duelMode === 'vice_leonida_duel')
      ? `${BASE_URL}/assets/leonida-hero.jpg`
      : view === 'ailab'
      ? `${BASE_URL}/assets/ai-lab-hero.jpg`
      : view === 'algolab'
      ? `${BASE_URL}/assets/algo-lab-hero.jpg`
      : view === 'blog'
      ? `${BASE_URL}/assets/og-blog.jpg`
      : view === 'fise'
      ? `${BASE_URL}/assets/og-worksheets.jpg`
      : view === 'arcade' || view === 'duel'
      ? `${BASE_URL}/assets/og-arcade-duel.jpg`
      : `${BASE_URL}/og-cover.png`;

  document.title = title;
  upsertMeta('name', 'description', description);
  upsertMeta('name', 'robots', robotsContent);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:url', canonicalUrl);
  upsertMeta('property', 'og:locale', isEn ? 'en_US' : 'ro_RO');
  upsertMeta('property', 'og:locale:alternate', isEn ? 'ro_RO' : 'en_US');
  upsertMeta('property', 'og:image', socialImage);
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', description);
  upsertMeta('name', 'twitter:image', socialImage);
  upsertLink('canonical', canonicalUrl);
  upsertHreflang('ro', hreflangRoUrl);
  upsertHreflang('en', hreflangEnUrl);
  upsertHreflang('x-default', hreflangXDefaultUrl);
  upsertJsonLd('arky-dynamic-jsonld', dynamicJsonLd);

  const toPath = (fullUrl: string | null, fallback: string) => {
    if (!fullUrl) return fallback;
    return fullUrl.replace(BASE_URL, '') || '/';
  };
  notifyAlternateRoutes({
    roPath: hasPairedEnRoute ? toPath(hreflangRoUrl, '/') : '/',
    enPath: hasPairedEnRoute ? toPath(hreflangEnUrl, '/en/') : '/en/',
    hasPairedEnRoute,
  });
}
