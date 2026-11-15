import { GlossaryCategoryId, GlossaryTerm } from './types';
import { GLOSSARY_TERMS_PART_1 } from './termsPart1';
import { GLOSSARY_TERMS_PART_2 } from './termsPart2';
import { GLOSSARY_TERMS_PART_3 } from './termsPart3';

export type {
  GlossaryCategoryId,
  GlossaryComparison,
  GlossaryFaq,
  GlossaryLangTerm,
  GlossaryTerm,
} from './types';

export interface GlossaryCategoryMeta {
  id: GlossaryCategoryId;
  roName: string;
  enName: string;
  roDescription: string;
  enDescription: string;
}

export const GLOSSARY_CATEGORIES: GlossaryCategoryMeta[] = [
  {
    id: 'hardware-systems',
    roName: 'Hardware & Sisteme',
    enName: 'Hardware & Systems',
    roDescription: 'CPU, RAM, SSD, unități de măsură binare, periferice, SO și organizarea fișierelor.',
    enDescription: 'CPUs, RAM, SSD storage, binary units, peripherals, operating systems, and file trees.'
  },
  {
    id: 'algorithms-cpp',
    roName: 'Algoritmi, C++ & Scratch',
    enName: 'Algorithms, C++ & Scratch',
    roDescription: 'Variabile, modulo %, structuri if/else, bucle while/for, vectori și coordonate Scratch.',
    enDescription: 'Variables, modulo %, conditionals, while/for loops, arrays, and Scratch coordinates.'
  },
  {
    id: 'office-data',
    roName: 'Excel, Word & Grafică',
    enName: 'Spreadsheets, Docs & Media',
    roDescription: 'Referințe $A$1, funcții SUM/IF/COUNTIF, erori Excel, regula 6×6, diacritice și RGB.',
    enDescription: 'Absolute references, SUM/IF/COUNTIF, formula debugging, 6×6 slides, formatting, and RGB.'
  },
  {
    id: 'web-security',
    roName: 'Web, Rețele & Securitate',
    enName: 'Web, Networks & Security',
    roDescription: 'HTML5 semantic, HTTP vs HTTPS, IP & DNS, Phishing, Malware, 2FA, Netichetă și 119.',
    enDescription: 'Semantic HTML5, HTTPS encryption, IP & DNS, Phishing, Malware, 2FA, Netiquette, and safety.'
  },
  {
    id: 'robotics-iot',
    roName: 'Robotică & Arduino IoT',
    enName: 'Robotics & Arduino IoT',
    roDescription: 'Arduino UNO, pini PWM, Legea lui Ohm, ultrasonic HC-SR04, senzori Smart Home și millis().',
    enDescription: 'Arduino UNO, PWM pins, Ohm’s Law, HC-SR04 ultrasonic, Smart Home sensors, and millis().'
  },
  {
    id: 'ai-cloud',
    roName: 'AI, Cloud, GIS & Video',
    enName: 'AI, Cloud, GIS & Video',
    roDescription: 'Modele LLM și halucinații, prompt R.C.C.L., Cloud colaborativ, hărți GIS și editare video.',
    enDescription: 'LLMs & hallucinations, R.C.C.F. prompting, Cloud teamwork, GIS layers, and multitrack video.'
  }
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  ...GLOSSARY_TERMS_PART_1,
  ...GLOSSARY_TERMS_PART_2,
  ...GLOSSARY_TERMS_PART_3,
];

export function findGlossaryTermBySlug(slug: string | null | undefined): {
  term: GlossaryTerm | null;
  langHint: 'ro' | 'en' | null;
} {
  if (!slug) return { term: null, langHint: null };
  const clean = slug.trim().toLowerCase().replace(/^\/+|\/+$/g, '');
  if (!clean) return { term: null, langHint: null };

  for (const item of GLOSSARY_TERMS) {
    if (item.ro.slug.toLowerCase() === clean) return { term: item, langHint: 'ro' };
    if (item.en.slug.toLowerCase() === clean) return { term: item, langHint: 'en' };
    if (item.id.toLowerCase() === clean) return { term: item, langHint: null };
  }
  return { term: null, langHint: null };
}

export function getRelatedGlossaryTerms(term: GlossaryTerm, limit = 4): GlossaryTerm[] {
  const explicit = term.relatedTermIds
    .map((id) => GLOSSARY_TERMS.find((t) => t.id === id))
    .filter((t): t is GlossaryTerm => Boolean(t && t.id !== term.id));

  if (explicit.length >= limit) {
    return explicit.slice(0, limit);
  }

  const sameCat = GLOSSARY_TERMS.filter(
    (t) => t.id !== term.id && t.category === term.category && !explicit.some((e) => e.id === t.id)
  );
  return [...explicit, ...sameCat].slice(0, limit);
}

export function getGlossaryTermsForModule(moduleId: string, limit = 4): GlossaryTerm[] {
  const exact = GLOSSARY_TERMS.filter((t) => t.relatedModuleId === moduleId);
  if (exact.length >= limit) return exact.slice(0, limit);
  return exact;
}
