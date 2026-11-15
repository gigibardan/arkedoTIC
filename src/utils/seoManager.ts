import { AllMissionId, Language } from '../types';
import { CURRICULA_MODULES } from '../data/curriculaData';
import { findBlogArticleBySlug } from '../data/blog';
import { findGlossaryTermBySlug } from '../data/glossary';

export type AppSeoView = 'catalog' | 'lesson' | 'teacher' | 'arcade' | 'duel' | 'city' | 'superadmin' | 'blog' | 'glossary' | 'sandbox';

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

export function updateDynamicSeo(
  view: AppSeoView,
  lang: Language,
  activeMission: AllMissionId | null,
  blogSlug: string | null = null,
  glossarySlug: string | null = null
): void {
  if (typeof document === 'undefined') return;

  const isEn = lang === 'en';
  document.documentElement.lang = isEn ? 'en' : 'ro';

  let title = isEn
    ? 'ArkyEdu – Free Kids ICT, Coding & Arduino Education (Ages 10–15)'
    : 'ArkyEdu – Educație TIC, Coding & Robotică Copii (V–VIII)';

  let description = isEn
    ? '100% free interactive ICT, C++, Scratch, Excel & Arduino IoT learning platform for students aged 10-15, featuring 40 lessons, 28 arcade games & 20+ 1v1 duels.'
    : 'Platformă 100% gratuită de educație TIC, programare C++/Scratch, Excel și robotică Arduino pentru copii (clasele V–VIII), 28 jocuri arcade și 20+ dueluri 1v1.';

  let canonicalUrl = `${BASE_URL}/`;
  let robotsContent = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

  if (view === 'superadmin') {
    title = isEn ? 'School Admin Panel | ArkyEdu' : 'Administrare Școli & Clase | ArkyEdu';
    robotsContent = 'noindex, nofollow';
    canonicalUrl = `${BASE_URL}/superadmin`;
  } else if (view === 'teacher') {
    title = isEn
      ? 'Teacher Portal & Digital Gradebook | ArkyEdu ICT'
      : 'Portal Profesor TIC: Catalog Digital & Bareme 1–10 | ArkyEdu';
    description = isEn
      ? 'Digital gradebook, curriculum sheets, automated scoring (1-10) and GDPR-compliant class management for ICT & Computer Science teachers.'
      : 'Instrument gratuit pentru profesorii de TIC: catalog digital, evaluare automată pe bareme 1–10, export condică și fișe conforme programei naționale.';
    canonicalUrl = `${BASE_URL}/profesor/`;
  } else if (view === 'arcade') {
    title = isEn
      ? 'ICT Educational Arcade: 28 Retro Coding & Tech Games | ArkyEdu'
      : 'Arcade TIC: 28 Jocuri Educative Programare & Hardware | ArkyEdu';
    description = isEn
      ? 'Play 28 free educational retro games: Cyber Pac-Man, Cyber Arkanoid, Cyber Frogger, Sokoban, Circuit Master, Redstone Logic & PC Builder.'
      : '28 mini-jocuri arcade gratuite pentru educație digitală: Cyber Pac-Man, Arkanoid, Frogger, Sokoban, Circuit Master 80s, Redstone Logic & PC Builder.';
    canonicalUrl = `${BASE_URL}/arcade/`;
  } else if (view === 'duel') {
    title = isEn
      ? '1v1 Live Tech & Coding Duels Arena (20+ Modes) | ArkyEdu'
      : 'Arena Dueluri TIC 1v1 Live: 20+ Competiții Coding | ArkyEdu';
    description = isEn
      ? 'Compete live 1v1 in Cyber Battleship, File-Drop Attack Tetris, System Sabotage, C++ Code Racer, Binary Clash & Circuit Duel with AI Bot or friends.'
      : 'Confruntări live 1v1 pentru elevi: Cyber Battleship, File-Drop Attack, System Sabotage, C++ Code Racer, Binary Clash și Circuit Clash Arduino.';
    canonicalUrl = `${BASE_URL}/duel/`;
  } else if (view === 'city') {
    title = isEn
      ? 'Arkedo Smart City: Arduino IoT & Robotics Lab | ArkyEdu'
      : 'Arkedo Smart City: Laborator IoT & Robotică Arduino | ArkyEdu';
    description = isEn
      ? 'Interactive Smart City & IoT robotics lab: PWM smart lighting, ultrasonic barriers, MQ-2 gas alerts, and Arduino Uno sensors in your browser.'
      : 'Simulator interactiv Smart City IoT pentru gimnaziu: iluminat PWM, senzori ultrasonici HC-SR04, alarmă gaz MQ-2 și microcontroller Arduino Uno.';
    canonicalUrl = `${BASE_URL}/oras/`;
  } else if (view === 'blog') {
    const article = findBlogArticleBySlug(blogSlug);
    if (article) {
      const content = isEn ? article.en : article.ro;
      title = content.metaTitle;
      description = content.metaDescription.slice(0, 158);
      canonicalUrl = isEn ? `${BASE_URL}/blog/en/${article.en.slug}/` : `${BASE_URL}/blog/${article.ro.slug}/`;
    } else {
      title = isEn
        ? 'ICT, Coding & Tech Guides Blog (Grades 5–8) | ArkyEdu'
        : 'Blog & Ghiduri TIC Gimnaziu: C++, Excel, AI & Siguranță Online | ArkyEdu';
      description = isEn
        ? 'Practical bilingual guides for middle school students, parents, and ICT teachers: C++ troubleshooting, Excel formulas, AI study habits, and online safety.'
        : 'Articole și ghiduri practice de TIC pentru clasele V–VIII: rezolvare erori C++, formule Excel, AI & ChatGPT la școală și siguranță online pe Roblox, TikTok și Discord.';
      canonicalUrl = isEn ? `${BASE_URL}/blog/en/` : `${BASE_URL}/blog/`;
    }
  } else if (view === 'glossary') {
    const found = findGlossaryTermBySlug(glossarySlug).term;
    if (found) {
      const c = isEn ? found.en : found.ro;
      title = isEn ? `${c.term} – Definition & Examples | ArkyEdu Glossary` : `${c.term} – Definiție, Exemplu & Teste | Glosar ArkyEdu`;
      description = c.shortAnswer.slice(0, 158);
      canonicalUrl = isEn ? `${BASE_URL}/glosar/en/${found.en.slug}/` : `${BASE_URL}/glosar/${found.ro.slug}/`;
    } else {
      title = isEn
        ? 'Bilingual ICT & Computer Science Glossary (Grades 5–8) | ArkyEdu'
        : 'Glosar Bilingv Informatică & TIC (Clasele V–VIII) | ArkyEdu';
      description = isEn
        ? '44 essential middle-school CS & ICT terms explained clearly: CPU, RAM, C++ modulo %, Excel IF, Phishing 2FA, Arduino millis() & AI prompting.'
        : '44 de termeni esențiali de Informatică și TIC explicați clar pentru gimnaziu: CPU, RAM, modulo %, Excel IF, Phishing 2FA, Arduino millis() și AI.';
      canonicalUrl = isEn ? `${BASE_URL}/glosar/en/` : `${BASE_URL}/glosar/`;
    }
  } else if (view === 'sandbox') {
    title = isEn
      ? 'Interactive C++, Python & HTML5 Code Sandbox Lab | ArkyEdu'
      : 'Sandbox Cod Live: Editor C++, Python & HTML5 în Browser | ArkyEdu';
    description = isEn
      ? 'Run C++ (Code::Blocks style), Python 3, and HTML5/CSS code directly in your browser with automated curriculum tests and instant Arky diagnostics.'
      : 'Rulează cod C++ (Code::Blocks), Python 3 și HTML5/CSS direct în browser fără instalare, cu verificare automată a testelor școlare și diagnostic Arky.';
    canonicalUrl = isEn ? `${BASE_URL}/sandbox/en/` : `${BASE_URL}/sandbox/`;
  } else if (view === 'lesson' && activeMission) {
    const mappedId = MISSION_ID_MAP[activeMission] || activeMission;
    const mod = CURRICULA_MODULES.find((m) => m.id === mappedId || m.missionId === activeMission);
    if (mod) {
      title = isEn
        ? `${mod.shortTitle} – Interactive ICT Lab | ArkyEdu`
        : `${mod.shortTitle} – ${mod.grade} | ArkyEdu TIC`;
      description = mod.metaDescription.slice(0, 158);
      canonicalUrl = `${BASE_URL}/cursuri/${mod.id}/`;
    }
  }

  document.title = title;
  upsertMeta('name', 'description', description);
  upsertMeta('name', 'robots', robotsContent);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:url', canonicalUrl);
  upsertMeta('property', 'og:locale', isEn ? 'en_US' : 'ro_RO');
  upsertMeta('property', 'og:image', `${BASE_URL}/og-cover.png`);
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', description);
  upsertMeta('name', 'twitter:image', `${BASE_URL}/og-cover.png`);
  upsertLink('canonical', canonicalUrl);
}
