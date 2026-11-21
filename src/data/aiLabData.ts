import { AllMissionId } from '../types';

export interface TokenizerPreset {
  id: string;
  labelRo: string;
  labelEn: string;
  textRo: string;
  textEn: string;
  noteRo: string;
  noteEn: string;
}

export interface TokenChunk {
  text: string;
  id: number;
  kind: 'word' | 'subword' | 'number' | 'symbol';
}

export interface NextTokenCandidate {
  token: string;
  logit: number;
  isFactual: boolean;
  tagRo: string;
  tagEn: string;
}

export interface NextTokenScenario {
  id: string;
  topicRo: string;
  topicEn: string;
  promptRo: string;
  promptEn: string;
  candidatesRo: NextTokenCandidate[];
  candidatesEn: NextTokenCandidate[];
  explanationRo: string;
  explanationEn: string;
}

export interface HallucinationTestCase {
  id: string;
  subjectRo: string;
  subjectEn: string;
  promptRo: string;
  promptEn: string;
  statementsRo: string[];
  statementsEn: string[];
  hallucinatedIdx: number;
  correctionRo: string;
  correctionEn: string;
  relatedMissionId: AllMissionId;
}

export type ForensicMediaKind = 'image' | 'audio' | 'video' | 'news';

export interface ForensicClueHotspot {
  id: string;
  xPct: number;
  yPct: number;
  labelRo: string;
  labelEn: string;
  detailRo: string;
  detailEn: string;
}

export interface DeepfakeForensicCase {
  id: string;
  mediaKind: ForensicMediaKind;
  isDeepfake: boolean;
  evidenceImageKey?: 'fake_campus' | 'real_lab';
  titleRo: string;
  titleEn: string;
  sourceLabelRo: string;
  sourceLabelEn: string;
  scenarioRo: string;
  scenarioEn: string;
  metadataRows: Array<{
    keyRo: string;
    keyEn: string;
    value: string;
    suspicious: boolean;
  }>;
  audioTranscriptRo?: string;
  audioTranscriptEn?: string;
  hotspots?: ForensicClueHotspot[];
  checklistCluesRo: string[];
  checklistCluesEn: string[];
  verdictExplanationRo: string;
  verdictExplanationEn: string;
  rewardCoins: number;
}

export interface PromptBlockOption {
  id: string;
  textRo: string;
  textEn: string;
  clarityPts: number;
  contextPts: number;
  ethicsPts: number;
  guardrailPts: number;
  feedbackRo: string;
  feedbackEn: string;
}

export interface PromptArchitectChallenge {
  id: string;
  titleRo: string;
  titleEn: string;
  goalRo: string;
  goalEn: string;
  relatedMissionId: AllMissionId;
  slots: {
    role: PromptBlockOption[];
    context: PromptBlockOption[];
    instruction: PromptBlockOption[];
    guardrail: PromptBlockOption[];
  };
  goodPreviewRo: string;
  goodPreviewEn: string;
  weakPreviewRo: string;
  weakPreviewEn: string;
}

export interface AiCurriculumBridge {
  id: string;
  gradeRo: string;
  gradeEn: string;
  titleRo: string;
  titleEn: string;
  descriptionRo: string;
  descriptionEn: string;
  missionId: AllMissionId;
  glossarySlugRo?: string;
  glossarySlugEn?: string;
}

export interface AiLabFaqItem {
  qRo: string;
  qEn: string;
  aRo: string;
  aEn: string;
}

export const TOKENIZER_PRESETS: TokenizerPreset[] = [
  {
    id: 'excel',
    labelRo: 'Formulă Excel (Clasa VIII)',
    labelEn: 'Excel Formula (Grade 8)',
    textRo: 'Explică formula =COUNTIF(A1:A20, ">9") pas cu pas!',
    textEn: 'Explain the Excel formula =COUNTIF(A1:A20, ">9") step by step!',
    noteRo: 'Observă cum semnele =, parantezele și ghilimelele consumă tokeni separați față de cuvinte.',
    noteEn: 'Notice how symbols like =, parentheses, and quotes become individual tokens separate from words.',
  },
  {
    id: 'cpp',
    labelRo: 'Cod C++ (Clasa VII)',
    labelEn: 'C++ Code (Grade 7)',
    textRo: 'int n = 2026; if (n % 2 == 0) cout << "par";',
    textEn: 'int n = 2026; if (n % 2 == 0) cout << "even";',
    noteRo: 'Codul C++ are mulți tokeni scurți; operatorii == și << au propriile ID-uri numerice.',
    noteEn: 'C++ code splits into dense symbol tokens; operators like == and << have distinct numeric IDs.',
  },
  {
    id: 'diacritics',
    labelRo: 'Diacritice Românești',
    labelEn: 'Subwords & Accents',
    textRo: 'Inteligența artificială nu înțelege cuvinte, ci calculează șiruri de numere.',
    textEn: 'Artificial intelligence predicts statistical subword probabilities without real awareness.',
    noteRo: 'Cuvintele lungi sau cu diacritice românești (ă, î, â, ș, ț) sunt împărțite frecvent în mai mulți sub-tokeni.',
    noteEn: 'Long or specialized words split into multiple sub-word chunks (e.g. "statist" + "ical").',
  },
  {
    id: 'safety',
    labelRo: 'Verificare Siguranță',
    labelEn: 'AI Safety Check',
    textRo: 'Verifică sursa oficială .edu.ro înainte să crezi un videoclip viral!',
    textEn: 'Verify official sources before trusting any viral synthetic voice clip!',
    noteRo: 'Extensiile web (.edu.ro, .gov.ro) și cuvintele cheie devin ancore în contextul modelului.',
    noteEn: 'Domain fragments (.edu.ro, .gov.ro) act as structured context signals inside the prompt window.',
  },
];

function deterministicTokenId(chunk: string): number {
  let hash = 2166136261;
  for (let i = 0; i < chunk.length; i++) {
    hash ^= chunk.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return 1000 + (Math.abs(hash) % 89000);
}

/** Deterministic classroom BPE-style tokenizer (safe, offline, zero API calls) */
export function tokenizeText(raw: string): TokenChunk[] {
  if (!raw.trim()) return [];
  const matches = raw.match(/[A-Za-zăîâșțĂÎÂȘȚ]+|\d+|==|<<|>=|<=|!=|[^\sA-Za-zăîâșțĂÎÂȘȚ\d]/g) || [];
  const out: TokenChunk[] = [];

  for (const part of matches) {
    if (/^\d+$/.test(part)) {
      // Numbers longer than 3 digits split into 2-digit chunks like modern tokenizers
      if (part.length > 3) {
        for (let i = 0; i < part.length; i += 2) {
          const slice = part.slice(i, i + 2);
          out.push({ text: slice, id: deterministicTokenId(slice), kind: 'number' });
        }
      } else {
        out.push({ text: part, id: deterministicTokenId(part), kind: 'number' });
      }
    } else if (/^[A-Za-zăîâșțĂÎÂȘȚ]+$/.test(part)) {
      if (part.length >= 9) {
        const splitIdx = Math.ceil(part.length * 0.58);
        const first = part.slice(0, splitIdx);
        const second = `##${part.slice(splitIdx)}`;
        out.push({ text: first, id: deterministicTokenId(first), kind: 'word' });
        out.push({ text: second, id: deterministicTokenId(second), kind: 'subword' });
      } else if (/[ăîâșțĂÎÂȘȚ]/.test(part) && part.length >= 6) {
        const splitIdx = Math.floor(part.length / 2) + 1;
        const first = part.slice(0, splitIdx);
        const second = `##${part.slice(splitIdx)}`;
        out.push({ text: first, id: deterministicTokenId(first), kind: 'word' });
        out.push({ text: second, id: deterministicTokenId(second), kind: 'subword' });
      } else {
        out.push({ text: part, id: deterministicTokenId(part), kind: 'word' });
      }
    } else {
      out.push({ text: part, id: deterministicTokenId(part), kind: 'symbol' });
    }
  }
  return out;
}

export const NEXT_TOKEN_SCENARIOS: NextTokenScenario[] = [
  {
    id: 'modulo',
    topicRo: 'C++ Informatică',
    topicEn: 'C++ Programming',
    promptRo: 'În C++, operatorul % (modulo) returnează întotdeauna...',
    promptEn: 'In C++, the % (modulo) operator always returns...',
    candidatesRo: [
      { token: 'restul împărțirii întregi', logit: 5.2, isFactual: true, tagRo: 'Corect Științific', tagEn: 'Factual' },
      { token: 'câtul împărțirii', logit: 2.3, isFactual: false, tagRo: 'Confuzie frecventă', tagEn: 'Common confusion' },
      { token: 'procentul din 100', logit: 1.7, isFactual: false, tagRo: 'Halucinație de limbaj', tagEn: 'Semantic trap' },
      { token: 'media aritmetică', logit: 0.4, isFactual: false, tagRo: 'Halucinație totală', tagEn: 'Hallucination' },
    ],
    candidatesEn: [
      { token: 'the integer division remainder', logit: 5.2, isFactual: true, tagRo: 'Corect Științific', tagEn: 'Factual' },
      { token: 'the division quotient', logit: 2.3, isFactual: false, tagRo: 'Confuzie frecventă', tagEn: 'Common confusion' },
      { token: 'a 0-to-100 percentage', logit: 1.7, isFactual: false, tagRo: 'Halucinație de limbaj', tagEn: 'Semantic trap' },
      { token: 'an array length', logit: 0.4, isFactual: false, tagRo: 'Halucinație totală', tagEn: 'Hallucination' },
    ],
    explanationRo:
      'La temperatură mică (0.1–0.3), modelul alege aproape sigur tokenul corect matematic. Când ridici temperatura peste 1.0, probabilitățile se aplatizează și crește riscul ca AI-ul să aleagă „procentul din 100” doar pentru că simbolul % seamănă!',
    explanationEn:
      'At low Temperature (0.1–0.3), the LLM reliably picks the highest-probability factual token. Above 1.0, probability spreads out and increases hallucinations (confusing % with percentages!).',
  },
  {
    id: 'arduino',
    topicRo: 'Robotică Arduino',
    topicEn: 'Arduino Robotics',
    promptRo: 'Pentru a aprinde un LED standard pe 5V fără să se ardă, inseriem un...',
    promptEn: 'To power a standard 5V LED safely without burning it out, add a...',
    candidatesRo: [
      { token: 'rezistor de 220 ohmi', logit: 5.0, isFactual: true, tagRo: 'Corect Hardware', tagEn: 'Factual' },
      { token: 'condensator de 1000 V', logit: 1.9, isFactual: false, tagRo: 'Componentă greșită', tagEn: 'Wrong part' },
      { token: 'cablu HDMI direct', logit: 0.7, isFactual: false, tagRo: 'Halucinație Hardware', tagEn: 'Hallucination' },
      { token: 'difuzor ultrasonic', logit: 0.3, isFactual: false, tagRo: 'Halucinație totală', tagEn: 'Hallucination' },
    ],
    candidatesEn: [
      { token: '220-ohm resistor in series', logit: 5.0, isFactual: true, tagRo: 'Corect Hardware', tagEn: 'Factual' },
      { token: '1000V capacitor', logit: 1.9, isFactual: false, tagRo: 'Componentă greșită', tagEn: 'Wrong part' },
      { token: 'direct HDMI splitter', logit: 0.7, isFactual: false, tagRo: 'Halucinație Hardware', tagEn: 'Hallucination' },
      { token: 'ultrasonic buzzer', logit: 0.3, isFactual: false, tagRo: 'Halucinație totală', tagEn: 'Hallucination' },
    ],
    explanationRo:
      'Un LLM nu are laborator de electronică — el doar estimează ce cuvinte apar des împreună. Dacă pui Temperatură mare pentru probleme exacte de robotică, poate recomanda piese greșite!',
    explanationEn:
      'An LLM has no physics engine—it only predicts likely word continuations. High temperature on engineering tasks risks dangerous wiring errors.',
  },
  {
    id: 'story',
    topicRo: 'Scriere Creativă',
    topicEn: 'Creative Writing',
    promptRo: 'Robotul Arky a deschis ușa laboratorului de Informatică și a văzut...',
    promptEn: 'Arky the Robot opened the Computer Science lab door and spotted...',
    candidatesRo: [
      { token: 'un Arduino iluminat neon', logit: 3.4, isFactual: true, tagRo: 'Previziune clasică', tagEn: 'Classic pick' },
      { token: 'o pisică programând în Scratch', logit: 3.1, isFactual: true, tagRo: 'Creativ & coerent', tagEn: 'Creative pick' },
      { token: 'un server cu portal spre Leonida', logit: 2.7, isFactual: true, tagRo: 'Original & amuzant', tagEn: 'Original pick' },
      { token: 'ploaie de pixuri binare', logit: 2.0, isFactual: true, tagRo: 'Poetic', tagEn: 'Poetic pick' },
    ],
    candidatesEn: [
      { token: 'a glowing Arduino workbench', logit: 3.4, isFactual: true, tagRo: 'Previziune clasică', tagEn: 'Classic pick' },
      { token: 'a cat coding in Scratch', logit: 3.1, isFactual: true, tagRo: 'Creativ & coerent', tagEn: 'Creative pick' },
      { token: 'a portal server to Vice Leonida', logit: 2.7, isFactual: true, tagRo: 'Original & amuzant', tagEn: 'Original pick' },
      { token: 'floating binary snowflakes', logit: 2.0, isFactual: true, tagRo: 'Poetic', tagEn: 'Poetic pick' },
    ],
    explanationRo:
      'Aici temperatura mare (0.8–1.2) este UTILĂ! Pentru povești și brainstorming creativ, vrei ca AI-ul să exploreze variante mai rare, nu mereu cel mai previzibil cuvânt.',
    explanationEn:
      'For creative stories, higher Temperature (0.8–1.2) is genuinely helpful—helping the model choose imaginative continuations rather than repetitive clichés.',
  },
];

export function computeSoftmaxProbabilities(
  candidates: NextTokenCandidate[],
  temperature: number
): Array<NextTokenCandidate & { probPct: number }> {
  const safeT = Math.max(0.08, temperature);
  const maxLogit = Math.max(...candidates.map((c) => c.logit));
  const exps = candidates.map((c) => Math.exp((c.logit - maxLogit) / safeT));
  const sumExp = exps.reduce((a, b) => a + b, 0);
  return candidates.map((c, idx) => ({
    ...c,
    probPct: Math.round((exps[idx] / sumExp) * 1000) / 10,
  }));
}

export const HALLUCINATION_STRESS_TESTS: HallucinationTestCase[] = [
  {
    id: 'hal_cpp',
    subjectRo: 'Informatică C++ (Clasa VII–VIII)',
    subjectEn: 'C++ Programming (Grades 7–8)',
    promptRo: '„Cum sortez rapid un vector v[100] în C++ standard de gimnaziu?”',
    promptEn: '"How do I sort a vector v[100] in standard middle-school C++?"',
    statementsRo: [
      'În C++, poți sorta elementele prin algoritmul Bubble Sort cu două bucle for imbricate.',
      'Pentru sortare rapidă din biblioteca standard, poți include <algorithm> și apela sort(v, v + n).',
      'Mai simplu, include biblioteca oficială <magic_autosort_ro> și apelează instant_rank_ro(v).',
    ],
    statementsEn: [
      'In C++, you can sort an array using Bubble Sort with two nested for loops.',
      'For standard library sorting, include <algorithm> and call sort(v, v + n).',
      'Even simpler: include the built-in <magic_autosort_header> and invoke instant_rank(v).',
    ],
    hallucinatedIdx: 2,
    correctionRo:
      'Halucinație clasică de cod! Nu există nicio bibliotecă <magic_autosort_ro> sau funcție instant_rank_ro() în C++. AI-ul inventează uneori librării care sună convingător — testează mereu codul în Sandbox sau compilator!',
    correctionEn:
      'Classic code hallucination! Neither <magic_autosort_header> nor instant_rank() exist in C++. LLMs sometimes invent plausible library names—always verify code inside a real compiler or Sandbox!',
    relatedMissionId: 'g8_algo_d',
  },
  {
    id: 'hal_excel',
    subjectRo: 'Calcul Tabelar Excel (Clasa VIII)',
    subjectEn: 'Excel Spreadsheets (Grade 8)',
    promptRo: '„Cum aflu media doar pentru elevii cu nota peste 7 în Excel?”',
    promptEn: '"How do I calculate the average only for grades above 7 in Excel?"',
    statementsRo: [
      'Folosești funcția =AVERAGEIF(B2:B25, ">7"), disponibilă în toate versiunile moderne Excel.',
      'Ca alternativă fără =AVERAGEIF, împarți =SUMIF(B2:B25, ">7") la =COUNTIF(B2:B25, ">7").',
      'Poți scrie direct funcția nativă =SMART_CLASS_MEAN_ONLY_GOOD(B2:B25; 7; TRUE).',
    ],
    statementsEn: [
      'Use =AVERAGEIF(B2:B25, ">7"), available across modern versions of Excel.',
      'Alternatively without AVERAGEIF, divide =SUMIF(B2:B25, ">7") by =COUNTIF(B2:B25, ">7").',
      'Simply type the native Excel function =SMART_CLASS_MEAN_ONLY_GOOD(B2:B25, 7, TRUE).',
    ],
    hallucinatedIdx: 2,
    correctionRo:
      'Excel returnează eroarea #NAME? pentru că =SMART_CLASS_MEAN_ONLY_GOOD este complet inventată de AI! Verifică întotdeauna numele exact al funcțiilor oficiale (AVERAGEIF, SUMIF, COUNTIF).',
    correctionEn:
      'Excel returns a #NAME? error because =SMART_CLASS_MEAN_ONLY_GOOD is completely fabricated by the AI! Always double-check official spreadsheet syntax.',
    relatedMissionId: 'g8_calc_c',
  },
  {
    id: 'hal_fact',
    subjectRo: 'Hardware & Istoria Tehnologiei',
    subjectEn: 'Hardware & Tech History',
    promptRo: '„Explică pe scurt diferența dintre memoria RAM și SSD.”',
    promptEn: '"Briefly explain the difference between RAM and an SSD."',
    statementsRo: [
      'Memoria RAM este volatilă: păstrează datele aplicațiilor active și se golește când oprești calculatorul.',
      'SSD-ul este memorie nevolatilă pe bază de cipuri flash NAND, păstrând fișierele și fără curent electric.',
      'Un SSD standard de laptop conține un ac magnetic rotativ la 7200 RPM și 16 discuri de sticlă.',
    ],
    statementsEn: [
      'RAM is volatile memory: it holds active app state and clears completely when powered off.',
      'An SSD is non-volatile flash storage that retains your files without electrical power.',
      'A standard laptop SSD spins a magnetic needle at 7200 RPM across 16 glass platters.',
    ],
    hallucinatedIdx: 2,
    correctionRo:
      'AI-ul a amestecat descrierea unui HDD mecanic (discuri rotative la 7200 RPM) cu cea a unui SSD (Solid State Drive — zero piese în mișcare)!',
    correctionEn:
      'The AI blended a mechanical HDD (7200 RPM spinning platters) into the definition of an SSD (Solid-State Drive—zero moving parts)!',
    relatedMissionId: 'hardware',
  },
  {
    id: 'hal_url',
    subjectRo: 'Siguranță Web & Surse Oficiale',
    subjectEn: 'Web Safety & Official Sources',
    promptRo: '„Unde găsesc programa oficială de TIC pentru gimnaziu?”',
    promptEn: '"Where can I verify authentic Romanian ICT curriculum & student security notices?"',
    statementsRo: [
      'Programa oficială OMEN 3393/2017 se publică pe site-urile oficiale ale Ministerului Educației (.edu.ro).',
      'Pe ArkyEdu găsești gratuit toate lecțiile TIC V–VIII aliniate programei naționale pe https://www.arkyedu.com/.',
      'Toate subiectele secrete la Olimpiadă sunt arhivate pe http://free-edu-cheats-2026-vip.xyz/download.exe.',
    ],
    statementsEn: [
      'Official middle-school curriculum guidelines are published on official Ministry portals (.edu.ro).',
      'ArkyEdu offers free Grades 5–8 curriculum-aligned interactive labs at https://www.arkyedu.com/.',
      'Official secret exam keys are archived at http://free-edu-cheats-2026-vip.xyz/download.exe.',
    ],
    hallucinatedIdx: 2,
    correctionRo:
      'Atenție critică: unele modele AI pot genera URL-uri inventate sau pot sugera domenii suspecte (http://, .xyz, .exe)! Nu accesa niciodată linkuri .exe sau domenii neoficiale din răspunsurile unui chatbot.',
    correctionEn:
      'Critical safety habit: chatbots sometimes fabricate broken or risky URLs (http://, .xyz, .exe)! Never download executables from unverified AI-cited links.',
    relatedMissionId: 'g6_malware',
  },
];

export const DEEPFAKE_FORENSIC_CASES: DeepfakeForensicCase[] = [
  {
    id: 'case_fake_fair',
    mediaKind: 'image',
    isDeepfake: true,
    evidenceImageKey: 'fake_campus',
    titleRo: 'Cazul 01 · Fotografie „Concurs Național de Robotică”',
    titleEn: 'Case 01 · Photo: "National Robotics Fair Winner"',
    sourceLabelRo: 'Postare virală pe rețele sociale · Cont creat acum 3 zile',
    sourceLabelEn: 'Viral social post · Account created 3 days ago',
    scenarioRo:
      'O pagină necunoscută distribuie această fotografie pretinzând că este de la un concurs școlar care oferă premii de 5.000 lei dacă dai click pe un link de înscriere. Inspectează imaginea cu lupa digitală și metadatele!',
    scenarioEn:
      'An unknown page shares this photo claiming an upcoming school robotics prize giveaway with a sketchy sign-up link. Inspect the visual hotspots and camera metadata!',
    metadataRows: [
      { keyRo: 'Camera / Senzor', keyEn: 'Camera Sensor', value: 'Necunoscut / Lipsă EXIF aparat', suspicious: true },
      { keyRo: 'Semnătură C2PA', keyEn: 'C2PA Provenance', value: 'Generated-Synthetic-Image-Flag', suspicious: true },
      { keyRo: 'Iluminare & Text', keyEn: 'Lighting & Text', value: 'Text distorsionat pe bannerul din fundal', suspicious: true },
    ],
    hotspots: [
      {
        id: 'banner_text',
        xPct: 73,
        yPct: 19,
        labelRo: '1. Bannerul de pe perete',
        labelEn: '1. Wall Banner Gibberish',
        detailRo: 'Al doilea rând de pe banner conține litere amestecate fără sens („GGRLLB...SDFKJHS”) — semn clasic al generatoarelor de imagini AI.',
        detailEn: 'The second line on the banner shows garbled nonsense letters ("GGRLLB...SDFKJHS")—a classic telltale sign of diffusion AI.',
      },
      {
        id: 'badge_garble',
        xPct: 50,
        yPct: 56,
        labelRo: '2. Ecusonul și emblema',
        labelEn: '2. Lanyard Badge & Crest',
        detailRo: 'Emblema brodată și textul de pe ecuson sunt topite și ilizibile chiar dacă sunt în plan apropiat.',
        detailEn: 'The embroidered shirt crest and ID badge text melt into unreadable shapes despite sharp foreground focus.',
      },
      {
        id: 'table_hand',
        xPct: 76,
        yPct: 86,
        labelRo: '3. Mâna de pe masă & text poster',
        labelEn: '3. Table Hand & Poster Board',
        detailRo: 'Degetele sprijinite pe masă au proporții nenaturale, iar afișul din dreapta-spate conține text ilizibil.',
        detailEn: 'The hand resting on the table shows warped finger geometry while the background poster text fails completely.',
      },
    ],
    checklistCluesRo: [
      'Bannerul din fundal conține text ilizibil generat statistic ("GGRLLB...SDFKJHS").',
      'Lipsesc datele EXIF reale de la un aparat foto/telefon și apare steagul de generare sintetică.',
      'Contul care postează promite premii în bani cerând înscriere pe un link extern.',
    ],
    checklistCluesEn: [
      'Background wall banner contains garbled AI-hallucinated text ("GGRLLB...SDFKJHS").',
      'Authentic optical camera EXIF is stripped and synthetic provenance flags appear.',
      'Posted by a brand-new account using cash prize clickbait.',
    ],
    verdictExplanationRo:
      'Verdict corect: IMAGINE GENERATĂ AI (Deepfake)! Textul corupt de pe banner, ecusonul topit, anatomia imperfectă a mâinii și absența EXIF-ului de cameră confirmă o imagine sintetică.',
    verdictExplanationEn:
      'Correct verdict: AI-GENERATED IMAGE! Corrupted banner text, melted badge details, warped hand anatomy, and missing optical EXIF confirm synthetic creation.',
    rewardCoins: 45,
  },
  {
    id: 'case_real_arduino',
    mediaKind: 'image',
    isDeepfake: false,
    evidenceImageKey: 'real_lab',
    titleRo: 'Cazul 02 · Fotografie „Proiect Arduino în Laboratorul TIC”',
    titleEn: 'Case 02 · Photo: "Arduino Circuit Lab in Class"',
    sourceLabelRo: 'Portal școlar oficial · Arhiva clubului de Robotică',
    sourceLabelEn: 'Official school portal · Robotics Club archive',
    scenarioRo:
      'Profesorul a urcat această fotografie de la ora de Robotică din clasa a VIII-a. Un coleg suspicios crede că ar putea fi generată AI. Verifică detaliile tehnice, textul și metadatele!',
    scenarioEn:
      'Your teacher uploaded this photo from Grade 8 Robotics class. A classmate wonders if it is AI-generated. Inspect the wiring, notebook text, lighting, and EXIF!',
    metadataRows: [
      { keyRo: 'Camera / Senzor', keyEn: 'Camera Sensor', value: '35mm Optical Lens · f/2.8 · ISO 400', suspicious: false },
      { keyRo: 'Semnătură C2PA', keyEn: 'C2PA Provenance', value: 'Verified Hardware Camera Capture', suspicious: false },
      { keyRo: 'Coerență Fizică', keyEn: 'Physical Consistency', value: 'Umbre consistente spre fereastră, fire continue', suspicious: false },
    ],
    hotspots: [
      {
        id: 'breadboard_wires',
        xPct: 40,
        yPct: 72,
        labelRo: '1. Circuitul Arduino & LED-ul',
        labelEn: '1. Arduino Breadboard & LED',
        detailRo: 'Firele jumper conectează coerent placa la breadboard, LED-ul roșu emite o reflexie naturală și rezistorul este plasat corect.',
        detailEn: 'Jumper wires connect coherently from microcontroller pins to the breadboard with realistic red LED glow and resistor placement.',
      },
      {
        id: 'natural_hands',
        xPct: 43,
        yPct: 58,
        labelRo: '2. Anatomia și texturile',
        labelEn: '2. Natural Hands & Fabric',
        detailRo: 'Degetele ambilor elevi au structură anatomică corectă, iar cutele hanoracului și reflexiile ochelarilor respectă lumina ferestrei din stânga.',
        detailEn: 'Both students show natural hand anatomy, realistic hoodie stripes, and window-aligned specular lighting.',
      },
      {
        id: 'multimeter_desk',
        xPct: 68,
        yPct: 80,
        labelRo: '3. Caietul & Multimetrul',
        labelEn: '3. Notebook & Multimeter',
        detailRo: 'Schema electrică din caiet este desenată logic cu creionul, iar obiectele de pe bancă (rigle, creioane, multimetru) au umbre consecvente.',
        detailEn: 'The pencil circuit schematic matches real electronics notation and desk tools cast uniform daylight shadows.',
      },
    ],
    checklistCluesRo: [
      'Lumina ferestrei din stânga produce umbre și reflexii consistente pe toate obiectele.',
      'Toate mâinile, firele breadboard-ului și obiectele (multimetru, riglă) sunt coerente fizic.',
      'Are metadate optice autentice (EXIF + semnătură hardware de cameră).',
    ],
    checklistCluesEn: [
      'Left window daylight produces physically consistent shadows and reflections across every object.',
      'Hands, breadboard jumper wires, ruler, and multimeter maintain complete structural coherence.',
      'Carries authentic optical lens EXIF + verified camera capture metadata.',
    ],
    verdictExplanationRo:
      'Verdict corect: FOTOGRAFIE AUTENTICĂ! Detaliile fizice reale, consistența iluminării și datele EXIF ale camerei arată că este o poză reală din laborator.',
    verdictExplanationEn:
      'Correct verdict: AUTHENTIC PHOTOGRAPH! Consistent window lighting, accurate hands/wires, and real camera EXIF confirm it is a genuine classroom photo.',
    rewardCoins: 45,
  },
  {
    id: 'case_voice_clone',
    mediaKind: 'audio',
    isDeepfake: true,
    titleRo: 'Cazul 03 · Mesaj Vocal WhatsApp „Urgent de la Părinte”',
    titleEn: 'Case 03 · WhatsApp Voice Note: "Urgent from Parent"',
    sourceLabelRo: 'Număr necunoscut (+40 7xx xxx 914) · Mesaj primit ora 19:40',
    sourceLabelEn: 'Unknown number · Received at 19:40',
    scenarioRo:
      'Primești un mesaj vocal de 6 secunde cu o voce care sună identic cu a unui membru al familiei, dar vine de pe un număr nou și cere codul de confirmare primit prin SMS!',
    scenarioEn:
      'You receive a 6-second voice message sounding just like a family member, sent from an unknown number, urgently demanding your SMS 2FA code!',
    audioTranscriptRo:
      '„Alo, sunt eu! Mi s-a descărcat telefonul meu și trebuie să intru urgent în cont, trimite-mi te rog acum codul din 6 cifre care tocmai ți-a venit prin SMS! Hai repede, nu mai suna înapoi!”',
    audioTranscriptEn:
      '"Hey, it’s me! My battery died and I must log in right now—send me that 6-digit SMS verification code right away! Hurry, don’t call back!"',
    metadataRows: [
      { keyRo: 'Spectru Respirație', keyEn: 'Breath & Room Tone', value: 'Tăcere artificială între cuvinte (0 dB noise floor)', suspicious: true },
      { keyRo: 'Canal & Urgență', keyEn: 'Channel & Urgency', value: 'Număr necunoscut + interdicție „nu suna înapoi”', suspicious: true },
      { keyRo: 'Cerere Critică', keyEn: 'Critical Request', value: 'Solicită cod 2FA / PIN bancar prin SMS', suspicious: true },
    ],
    checklistCluesRo: [
      'Clonarea vocală AI are nevoie de doar 3–5 secunde din videoclipurile publice de pe social media.',
      'Îți cere explicit să NU suni înapoi și să trimiți un cod secret 2FA.',
      'Apără-te prin „Regula Cuvântului Parolă de Familie” și apel invers pe numărul salvat deja!',
    ],
    checklistCluesEn: [
      'AI voice cloning only needs 3–5 seconds of public audio from social reels.',
      'Explicitly forbids calling back while pressuring for a 6-digit 2FA code.',
      'Defense: verify using your offline Family Safe-Word & call back the real saved contact!',
    ],
    verdictExplanationRo:
      'Verdict corect: CLONĂ VOCALĂ AI (Deepfake Audio Scam)! Nu trimite NICIODATĂ coduri SMS 2FA la cereri vocale urgente. Sună persoana pe numărul real salvat în agendă și cere cuvântul-parolă stabilit cu familia.',
    verdictExplanationEn:
      'Correct verdict: AI VOICE CLONE SCAM! Never share SMS 2FA codes over urgent voice notes—always call back the real saved number and use a family safe-word.',
    rewardCoins: 50,
  },
  {
    id: 'case_video_lipsync',
    mediaKind: 'video',
    isDeepfake: true,
    titleRo: 'Cazul 04 · Clip Video Viral „Influencerul îți Dublează Robux-ul / ByteCoins”',
    titleEn: 'Case 04 · Viral Short: "Creator Doubles Your Game Coins"',
    sourceLabelRo: 'Reclamă sponsorizată TikTok/Shorts · Link extern bitcoin/gaming',
    sourceLabelEn: 'Sponsored short video · External promo link',
    scenarioRo:
      'Un clip video arată un YouTuber celebru de gaming spunând că o aplicație AI secretă îți dublează moneda din joc dacă îți conectezi contul pe site-ul din descriere.',
    scenarioEn:
      'A sponsored short shows a famous gaming creator claiming a secret AI app doubles your game currency if you log in via the description link.',
    audioTranscriptRo:
      '„Salutare tuturor! Doar azi puteți folosi acest generator AI oficial pe site-ul din bio. Introduceți numele și parola contului ca să primiți bonusul instant!”',
    audioTranscriptEn:
      '"Hey everyone! Only today you can run this secret AI coins multiplier via the bio link. Enter your account login and password for instant drops!"',
    metadataRows: [
      { keyRo: 'Sincronizare Buze', keyEn: 'Lip-Sync Artifacts', value: 'Pătrat ușor blurat în jurul gurii la mișcări rapide', suspicious: true },
      { keyRo: 'Frecvență Clipit', keyEn: 'Blink Cadence', value: 'Clipire rară, neregulată + reflexie fixă în iris', suspicious: true },
      { keyRo: 'Cerere Cont', keyEn: 'Credential Trap', value: 'Solicită parola contului pe domeniu extern .top', suspicious: true },
    ],
    checklistCluesRo: [
      'Zona gurii are rezoluție diferită față de frunte (semn clasic de Lip-Sync Deepfake).',
      'Niciun creator legitim nu cere parola contului tău pe un site extern.',
      'Verifică profilul oficial verificat al creatorului înainte să crezi orice reclamă!',
    ],
    checklistCluesEn: [
      'Mouth region exhibits blur/sharpness mismatch vs forehead (classic lip-sync swap).',
      'No legitimate creator ever asks for your game account password on a third-party domain.',
      'Check the creator’s verified official channel directly instead of clicking sponsored ads.',
    ],
    verdictExplanationRo:
      'Verdict corect: VIDEO DEEPFAKE LIP-SYNC! Atacatorii iau un clip vechi cu un creator real și îi înlocuiesc doar mișcarea buzelor și vocea cu AI ca să fure conturi de gaming.',
    verdictExplanationEn:
      'Correct verdict: LIP-SYNC VIDEO DEEPFAKE! Scammers re-animate the mouth and voice of a real creator on old footage to harvest gaming credentials.',
    rewardCoins: 50,
  },
  {
    id: 'case_news_fake',
    mediaKind: 'news',
    isDeepfake: true,
    titleRo: 'Cazul 05 · Știre Șoc „Fără Vacanță de Vară în 2027 – Decizie AI!”',
    titleEn: 'Case 05 · Shock News: "Summer Break Canceled by AI Law!"',
    sourceLabelRo: 'Site obscur: stiri-soc-azi24.info · Titlu cu majuscule și emoticoane 🚨',
    sourceLabelEn: 'Unknown blog: shock-news-daily24.info · All-caps clickbait 🚨',
    scenarioRo:
      'În grupul clasei circulă o captură de știre generată impecabil ca text, cu grafică oficială copiată, care anunță anularea vacanței de vară printr-un algoritm nou.',
    scenarioEn:
      'A sleekly formatted article circulates in your class chat claiming an automated AI committee canceled summer break starting next year.',
    audioTranscriptRo:
      '„BREAKING NEWS 🚨! Un ordin secret semnat azi noapte elimină 80% din vacanța de vară! Distribuie la 10 colegi în 5 minute ca să semnezi petiția de salvare!”',
    audioTranscriptEn:
      '"BREAKING NEWS 🚨! A secret overnight directive cuts 80% of summer break! Share with 10 classmates within 5 minutes to protect your grades!"',
    metadataRows: [
      { keyRo: 'Domeniu Sursă', keyEn: 'Source Domain', value: 'stiri-soc-azi24.info (nu edu.ro / gov.ro)', suspicious: true },
      { keyRo: 'Autor & Dată', keyEn: 'Author & Date', value: 'Lipsă autor real · „Azi noapte” (fără dată exactă)', suspicious: true },
      { keyRo: 'Manipulare Virală', keyEn: 'Viral Trigger', value: 'Frică + „Distribuie la 10 colegi acum!”', suspicious: true },
    ],
    checklistCluesRo: [
      'Apelează la metoda „Citirii Laterale” (Lateral Reading): deschizi alt tab și cauți pe site-urile oficiale (edu.ro, agenții de presă).',
      'AI-ul generează articole fără greșeli gramaticale, deci aspectul „profesionist” nu mai garantează adevărul!',
      'Lipsesc linkurile către documentul oficial din Monitorul Oficial sau edu.ro.',
    ],
    checklistCluesEn: [
      'Apply Lateral Reading: open a new tab and verify on official portals (.edu.ro / trusted national news).',
      'Modern LLMs write fluent, polished prose—clean grammar no longer guarantees truth!',
      'Zero verifiable citations or official decree numbers.',
    ],
    verdictExplanationRo:
      'Verdict corect: DEZINFORMARE SINTETICĂ AI! Știrile false generate cu AI folosesc furia/frica și cer redistribuirea rapidă fără să citeze nicio sursă oficială verificabilă.',
    verdictExplanationEn:
      'Correct verdict: AI-CRAFTED DISINFORMATION! Synthetic clickbait weaponizes fear and share-chains while omitting verifiable primary sources.',
    rewardCoins: 45,
  },
  {
    id: 'case_news_real',
    mediaKind: 'news',
    isDeepfake: false,
    titleRo: 'Cazul 06 · Anunț „Olimpiada Națională de TIC & Laborator ArkyEdu Gratuit”',
    titleEn: 'Case 06 · Notice: "Free ICT Olympiad Practice Sheets on ArkyEdu"',
    sourceLabelRo: 'https://www.arkyedu.com/fise/ · Conexiune HTTPS verificată',
    sourceLabelEn: 'https://www.arkyedu.com/fise/ · Verified HTTPS connection',
    scenarioRo:
      'Primești un link direct către 16 fișe interactive cu barem 1–10 și subiecte de Olimpiadă TIC, complet gratuite, fără cerere de parolă sau card bancar.',
    scenarioEn:
      'A classmate shares a link to 16 free interactive ICT Olympiad & graded practice sheets on ArkyEdu requiring no credit card or external .exe download.',
    audioTranscriptRo:
      '„Ghidul ArkyEdu oferă 16 fișe A4 imprimabile cu barem pe 100 de puncte pentru clasele V–VIII (Hardware, Scratch, C++ și Arduino), direct în browser la 0 lei.”',
    audioTranscriptEn:
      '"ArkyEdu provides 16 printable A4 worksheets with 100-point rubrics for Grades 5–8 (Hardware, Scratch, C++ & Arduino), directly in browser at 0 cost."',
    metadataRows: [
      { keyRo: 'Protocol & Domeniu', keyEn: 'Protocol & Domain', value: 'https://www.arkyedu.com/fise/ (Certificat TLS valid)', suspicious: false },
      { keyRo: 'Cereri Date Personale', keyEn: 'Data Request', value: 'Nu cere card bancar, cod 2FA sau instalare .exe', suspicious: false },
      { keyRo: 'Verificabilitate', keyEn: 'Fact Check', value: 'Referință exactă la programa OMEN 3393/2017', suspicious: false },
    ],
    checklistCluesRo: [
      'URL curat HTTPS fără substituiri de litere sau terminații dubioase (.xyz, .exe).',
      'Informații transparente, verificabile în același domeniu fără urgențe artificiale.',
      'Zero colectare riscantă de parole sau date financiare.',
    ],
    checklistCluesEn: [
      'Clean HTTPS URL with zero typosquatting or suspicious .exe downloads.',
      'Transparent, verifiable curriculum details with zero artificial urgency.',
      'Never asks for sensitive personal credentials or payment.',
    ],
    verdictExplanationRo:
      'Verdict corect: RESURSĂ AUTENTICĂ ȘI SIGURĂ! Verificarea protocolului HTTPS, a domeniului curat și absența urgenței false confirmă că sursa este legitimă.',
    verdictExplanationEn:
      'Correct verdict: AUTHENTIC & SAFE RESOURCE! Clean HTTPS domain, transparent claims, and zero pressure tactics confirm legitimacy.',
    rewardCoins: 45,
  },
];

export const PROMPT_ARCHITECT_CHALLENGES: PromptArchitectChallenge[] = [
  {
    id: 'prompt_cpp_debug',
    titleRo: 'Misiunea 1 · Debug C++ fără să copiezi tema',
    titleEn: 'Mission 1 · Ethical C++ Loop Debugging',
    goalRo: 'Ai o buclă while în C++ care nu se mai oprește (buclă infinită). Construiește un prompt care să te ajute să ÎNȚELEGI greșeala, nu să copiezi orbește rezolvarea!',
    goalEn: 'Your C++ while loop runs forever (infinite loop). Build a prompt that helps you UNDERSTAND the bug instead of blindly copying homework!',
    relatedMissionId: 'g7_loop_b',
    slots: {
      role: [
        {
          id: 'r_weak',
          textRo: 'Fii un robot care îmi face toate temele.',
          textEn: 'Act as a homework machine.',
          clarityPts: 5,
          contextPts: 5,
          ethicsPts: 0,
          guardrailPts: 5,
          feedbackRo: 'Rol pasiv: încurajează copierea fără să înveți nimic.',
          feedbackEn: 'Passive role that encourages cheating without learning.',
        },
        {
          id: 'r_strong',
          textRo: 'Ești profesor de Informatică pentru Clasa a VII-a, răbdător și clar.',
          textEn: 'Act as a clear, encouraging 7th-grade Computer Science tutor.',
          clarityPts: 25,
          contextPts: 20,
          ethicsPts: 25,
          guardrailPts: 15,
          feedbackRo: 'Rol excelent: calibrează nivelul explicației exact pentru gimnaziu!',
          feedbackEn: 'Great persona: calibrates explanation depth right for middle school!',
        },
      ],
      context: [
        {
          id: 'c_weak',
          textRo: 'Nu îmi merge codul de ieri, fă-l tu.',
          textEn: 'My code broke yesterday, fix it.',
          clarityPts: 5,
          contextPts: 0,
          ethicsPts: 5,
          guardrailPts: 0,
          feedbackRo: 'Context zero: AI-ul nu știe nici limbajul, nici eroarea, nici ce încerci să faci.',
          feedbackEn: 'Zero context: the model has no language, code snippet, or goal.',
        },
        {
          id: 'c_strong',
          textRo: 'Lucrez în C++ la suma cifrelor unui număr n cu bucla while, dar programul se blochează: while (n > 0) { s += n % 10; }.',
          textEn: 'I am coding a C++ while-loop digit sum, but my program freezes: while (n > 0) { s += n % 10; }.',
          clarityPts: 25,
          contextPts: 25,
          ethicsPts: 20,
          guardrailPts: 15,
          feedbackRo: 'Context perfect: include limbajul, obiectivul și linia exactă de cod!',
          feedbackEn: 'Perfect context: states language, goal, and exact code snippet!',
        },
      ],
      instruction: [
        {
          id: 'i_weak',
          textRo: 'Scrie tot programul complet ca să îl predau.',
          textEn: 'Write the full finished assignment so I can submit it.',
          clarityPts: 10,
          contextPts: 5,
          ethicsPts: 0,
          guardrailPts: 0,
          feedbackRo: 'Capcană academică: la testul pe hârtie de la școală nu vei ști de ce s-a blocat!',
          feedbackEn: 'Academic trap: on a paper test, copying leaves you stuck!',
        },
        {
          id: 'i_strong',
          textRo: 'Explică-mi ce instrucțiune lipsește în buclă ca n să scadă la fiecare pas și arată un tabel de valori pentru n = 42.',
          textEn: 'Explain which update step is missing so n decreases each pass, and trace a dry-run table for n = 42.',
          clarityPts: 25,
          contextPts: 25,
          ethicsPts: 25,
          guardrailPts: 20,
          feedbackRo: 'Instrucțiune de top: ceri explicație + tabel de urmărire pe exemplu concret!',
          feedbackEn: 'Top instruction: asks for root-cause insight plus a concrete dry-run table!',
        },
      ],
      guardrail: [
        {
          id: 'g_weak',
          textRo: 'Folosește trucuri avansate cu pointeri ca să pară impresionant.',
          textEn: 'Use complex pointer tricks to look impressive.',
          clarityPts: 5,
          contextPts: 0,
          ethicsPts: 10,
          guardrailPts: 0,
          feedbackRo: 'Constrângere greșită: introduce concepte de liceu/facultate care te încurcă.',
          feedbackEn: 'Poor guardrail: introduces advanced concepts that confuse middle-school work.',
        },
        {
          id: 'g_strong',
          textRo: 'Răspunde în maxim 5 propoziții simple, fără librării avansate, și pune-mi la final o întrebare de verificare.',
          textEn: 'Keep it under 5 simple sentences with zero advanced libraries, and end with 1 quick check question for me.',
          clarityPts: 25,
          contextPts: 20,
          ethicsPts: 25,
          guardrailPts: 25,
          feedbackRo: 'Guardrail ideal: previne răspunsurile lungi și transformă AI-ul în antrenor real!',
          feedbackEn: 'Ideal guardrail: caps length, avoids noise, and turns AI into a real tutor!',
        },
      ],
    },
    goodPreviewRo:
      '„În interiorul buclei lipsește actualizarea variabilei n (`n = n / 10;`), deci `n` rămâne mereu 42 > 0 la infinit. Pas 1: `s = 0 + 2 = 2`, apoi `n` devine `4`. Pas 2: `s = 2 + 4 = 6`, apoi `n` devine `0` și bucla se oprește. Întrebare de test: ce ar afișa programul pentru n = 105?”',
    goodPreviewEn:
      '"Your loop is missing the update step `n /= 10;`, so `n` stays 42 forever! Pass 1: `s = 2`, `n` becomes `4`. Pass 2: `s = 6`, `n` becomes `0` and exits. Quick check: what will it print for `n = 105`?"',
    weakPreviewRo:
      'AI-ul îți scuipă un cod lung cu funcții complicate pe care nu le-ai învățat în clasă, iar la verificare nu poți explica ce face fiecare linie.',
    weakPreviewEn:
      'The AI dumps overly complex boilerplate you haven’t covered in class, leaving you unable to explain how it works.',
  },
  {
    id: 'prompt_excel_if',
    titleRo: 'Misiunea 2 · Audit Formulă Excel (Clasa VIII)',
    titleEn: 'Mission 2 · Excel Formula Troubleshooting',
    goalRo: 'Ai primit #VALUE! sau #NAME? într-un catalog școlar Excel. Construiește promptul perfect pentru a depana formula.',
    goalEn: 'Your Excel class gradebook shows #NAME? or #VALUE!. Assemble the sharpest troubleshooting prompt.',
    relatedMissionId: 'g8_calc_c',
    slots: {
      role: [
        {
          id: 'er_weak',
          textRo: 'Spune-mi ceva despre Excel.',
          textEn: 'Tell me random stuff about Excel.',
          clarityPts: 5,
          contextPts: 5,
          ethicsPts: 10,
          guardrailPts: 5,
          feedbackRo: 'Mult prea vag!',
          feedbackEn: 'Way too vague!',
        },
        {
          id: 'er_strong',
          textRo: 'Ești specialist Excel pentru elevi de clasa a VIII-a.',
          textEn: 'Act as a practical Excel spreadsheet coach for 8th graders.',
          clarityPts: 25,
          contextPts: 20,
          ethicsPts: 25,
          guardrailPts: 20,
          feedbackRo: 'Rol clar și orientat pe practică!',
          feedbackEn: 'Clear, student-friendly expert role!',
        },
      ],
      context: [
        {
          id: 'ec_weak',
          textRo: 'Am scris o formulă și dă eroare.',
          textEn: 'I typed a formula and got an error.',
          clarityPts: 5,
          contextPts: 0,
          ethicsPts: 15,
          guardrailPts: 5,
          feedbackRo: 'Dacă nu lipești formula ta exactă, AI-ul va ghici în orb și va halucina.',
          feedbackEn: 'Without pasting the formula itself, the model can only guess!',
        },
        {
          id: 'ec_strong',
          textRo: 'Am scris =DACĂ(B2>=5; "Admis"; "Respins") în Excel în engleză, dar celula afișează #NAME?.',
          textEn: 'I typed =AVERAGEIF(B2:B20 >7) without quotes around ">7" and got a syntax error.',
          clarityPts: 25,
          contextPts: 25,
          ethicsPts: 25,
          guardrailPts: 20,
          feedbackRo: 'Context exemplar: conține formula exactă și codul de eroare observat!',
          feedbackEn: 'Exemplary context: includes the exact formula and observed error!',
        },
      ],
      instruction: [
        {
          id: 'ei_weak',
          textRo: 'Explică toată istoria Microsoft Office.',
          textEn: 'Explain the entire history of Microsoft Office.',
          clarityPts: 0,
          contextPts: 0,
          ethicsPts: 10,
          guardrailPts: 0,
          feedbackRo: 'Pierdere de tokeni fără legătură cu problema!',
          feedbackEn: 'Irrelevant token waste unrelated to your bug!',
        },
        {
          id: 'ei_strong',
          textRo: 'Identifică greșeala de sintaxă și arată formula corectată în format tabelar, cu un exemplu de rezultat.',
          textEn: 'Pinpoint the exact syntax flaw, show the corrected formula, and give one worked cell example.',
          clarityPts: 25,
          contextPts: 25,
          ethicsPts: 25,
          guardrailPts: 20,
          feedbackRo: 'Cere exact diagnostic + format de rezultat!',
          feedbackEn: 'Asks directly for root cause plus formatted output!',
        },
      ],
      guardrail: [
        {
          id: 'eg_weak',
          textRo: 'Dacă nu ești sigur, inventează o funcție nouă.',
          textEn: 'If unsure, invent a new Excel function name.',
          clarityPts: 0,
          contextPts: 0,
          ethicsPts: 0,
          guardrailPts: 0,
          feedbackRo: 'Încurajezi activ AI-ul să halucineze formule inexistente!',
          feedbackEn: 'Never invite an AI to fabricate syntax!',
        },
        {
          id: 'eg_strong',
          textRo: 'Folosește exclusiv funcții standard Excel (IF, COUNTIF, SUM) și menționează dacă separatorul poate fi virgulă sau punct și virgulă.',
          textEn: 'Only use verified built-in Excel functions (IF, COUNTIF, AVERAGEIF) and note regional comma vs semicolon separators.',
          clarityPts: 25,
          contextPts: 25,
          ethicsPts: 25,
          guardrailPts: 25,
          feedbackRo: 'Constrângere anti-halucinație excelentă!',
          feedbackEn: 'Rock-solid anti-hallucination guardrail!',
        },
      ],
    },
    goodPreviewRo:
      '„Eroarea #NAME? apare deoarece în Excel cu interfață în engleză funcția trebuie scrisă `=IF(B2>=5, "Admis", "Respins")`, nu tradusă `=DACĂ`. Dacă setările regionale sunt pe Română, folosește `;` între argumente. Exemplu: pentru B2 = 8, rezultatul este Admis.”',
    goodPreviewEn:
      '"In Excel, criteria operators inside AVERAGEIF must be wrapped in quotes: `=AVERAGEIF(B2:B20, ">7")`. Note: European locale settings use `;` instead of `,`. For scores [6, 9, 10], the filtered average is 9.5."',
    weakPreviewRo:
      'Modelul îți oferă o poveste generală despre foi de calcul fără să vadă formula ta reală.',
    weakPreviewEn:
      'The model gives generic trivia about spreadsheets without fixing your formula.',
  },
  {
    id: 'prompt_factcheck',
    titleRo: 'Misiunea 3 · Fact-Checking anti-Halucinații',
    titleEn: 'Mission 3 · Fact-Checking & Source Guardrails',
    goalRo: 'Vrei să folosești AI-ul ca să îți rezume o lecție de Hardware fără să inventeze cifre false.',
    goalEn: 'You want an AI summary of a Hardware lesson with zero fabricated specs or numbers.',
    relatedMissionId: 'hardware',
    slots: {
      role: [
        {
          id: 'fr_weak',
          textRo: 'Fii un scenarist de filme SF.',
          textEn: 'Act as a sci-fi movie scriptwriter.',
          clarityPts: 5,
          contextPts: 0,
          ethicsPts: 10,
          guardrailPts: 0,
          feedbackRo: 'Rol creativ — va inventa detalii imaginare în loc de date reale!',
          feedbackEn: 'Creative persona—will invent fictional tech specs!',
        },
        {
          id: 'fr_strong',
          textRo: 'Ești verificator tehnic riguros pentru manualul de TIC Clasa a V-a.',
          textEn: 'Act as a strict technical editor for 5th-grade Computer Science.',
          clarityPts: 25,
          contextPts: 25,
          ethicsPts: 25,
          guardrailPts: 20,
          feedbackRo: 'Stabilește din start tonul factual și audiența!',
          feedbackEn: 'Sets factual precision and grade level right away!',
        },
      ],
      context: [
        {
          id: 'fc_weak',
          textRo: 'Zi ceva despre calculatoare.',
          textEn: 'Say something about computers.',
          clarityPts: 5,
          contextPts: 0,
          ethicsPts: 10,
          guardrailPts: 5,
          feedbackRo: 'Subiect mult prea larg!',
          feedbackEn: 'Far too broad!',
        },
        {
          id: 'fc_strong',
          textRo: 'Compară exclusiv memoria RAM, SSD-ul și CPU-ul pe baza textului lecției noastre lipite mai jos.',
          textEn: 'Compare strictly RAM, SSD, and CPU based solely on the verified study notes pasted below.',
          clarityPts: 25,
          contextPts: 25,
          ethicsPts: 25,
          guardrailPts: 25,
          feedbackRo: 'Grounding excelent: ancorezi AI-ul strict pe materialul tău real!',
          feedbackEn: 'Excellent grounding: anchors the model to your own notes!',
        },
      ],
      instruction: [
        {
          id: 'fi_weak',
          textRo: 'Scrie 10 pagini de text continuu fără titluri.',
          textEn: 'Write 10 pages of dense unbroken prose.',
          clarityPts: 5,
          contextPts: 5,
          ethicsPts: 10,
          guardrailPts: 0,
          feedbackRo: 'Format imposibil de învățat pentru un test!',
          feedbackEn: 'Unreadable wall of text!',
        },
        {
          id: 'fi_strong',
          textRo: 'Organizează comparația într-un tabel cu 3 coloane: Rol principal, Volatilitate și Viteză relativă.',
          textEn: 'Format the comparison as a 3-column table: Main Role, Volatility, and Relative Speed.',
          clarityPts: 25,
          contextPts: 25,
          ethicsPts: 25,
          guardrailPts: 20,
          feedbackRo: 'Structură clară în 3 coloane ușor de verificat și reținut!',
          feedbackEn: 'Clean 3-column layout ideal for study and quick fact-checking!',
        },
      ],
      guardrail: [
        {
          id: 'fg_weak',
          textRo: 'Ghicește cifrele dacă nu le știi.',
          textEn: 'Guess missing stats if needed.',
          clarityPts: 0,
          contextPts: 0,
          ethicsPts: 0,
          guardrailPts: 0,
          feedbackRo: 'Permisiune directă la halucinație!',
          feedbackEn: 'Explicit permission to hallucinate!',
        },
        {
          id: 'fg_strong',
          textRo: 'Dacă o informație lipsește din textul meu, scrie clar „Nedefinit în textul dat” în loc să presupui.',
          textEn: 'If any detail is absent from my notes, write "Not stated in source text" instead of guessing.',
          clarityPts: 25,
          contextPts: 25,
          ethicsPts: 25,
          guardrailPts: 25,
          feedbackRo: 'Regula de aur anti-halucinații în Prompt Engineering!',
          feedbackEn: 'Golden anti-hallucination rule in Prompt Engineering!',
        },
      ],
    },
    goodPreviewRo:
      'Tabel curat cu CPU (Creierul care execută instrucțiuni · Neaplicabil · GHz), RAM (Masă de lucru temporară · Volatilă · Foarte rapidă) și SSD (Arhivă permanentă · Nevolatilă · Rapidă flash), 100% fidel notițelor tale.',
    goodPreviewEn:
      'Clean 3-column table covering CPU (Execution · N/A · GHz), RAM (Active Workspace · Volatile · Ultra-fast), and SSD (Permanent Files · Non-volatile · Flash speed) with zero invented figures.',
    weakPreviewRo:
      'Primești un eseu SF lung cu procesoare cuantice inventate și specificații inexistente.',
    weakPreviewEn:
      'You receive a rambling sci-fi essay full of made-up quantum chip statistics.',
  },
];

export const AI_CURRICULUM_BRIDGES: AiCurriculumBridge[] = [
  {
    id: 'bridge_hardware',
    gradeRo: 'Clasa V · Hardware & Memorie',
    gradeEn: 'Grade 5 · Hardware & Memory',
    titleRo: 'De ce au modelele AI nevoie de GPU și RAM?',
    titleEn: 'Why Do AI Models Need GPUs and High-Speed RAM?',
    descriptionRo: 'Tokenii și matricile de probabilități se calculează simultan pe mii de nuclee GPU și stau în memoria rapidă VRAM/RAM.',
    descriptionEn: 'Tokens and probability matrices compute in parallel across thousands of GPU cores inside fast VRAM/RAM.',
    missionId: 'hardware',
    glossarySlugRo: 'cpu-procesor',
    glossarySlugEn: 'cpu-processor',
  },
  {
    id: 'bridge_safety',
    gradeRo: 'Clasa VI · Securitate & Phishing',
    gradeEn: 'Grade 6 · Cyber Safety & 2FA',
    titleRo: 'Apărarea contra Clonării Vocale & Linkurilor Deepfake',
    titleEn: 'Defending Against AI Voice Clones & Phishing',
    descriptionRo: 'Autentificarea în 2 pași (2FA), verificarea domeniului HTTPS și cuvântul-parolă de familie blochează escrocheriile AI.',
    descriptionEn: 'Two-factor authentication (2FA), HTTPS domain checks, and family safe-words defeat voice-clone scams.',
    missionId: 'g6_malware',
    glossarySlugRo: 'phishing-inginerie-sociala',
    glossarySlugEn: 'phishing-social-engineering',
  },
  {
    id: 'bridge_cpp',
    gradeRo: 'Clasa VII–VIII · Algoritmi C++',
    gradeEn: 'Grades 7–8 · C++ Logic & Testing',
    titleRo: 'Verificarea Codului Generat de AI cu Trace & Teste',
    titleEn: 'Verifying AI Code Suggestions via Dry-Run Traces',
    descriptionRo: 'Nu accepta niciodată cod C++ fără să îl urmărești pas cu pas pe valori de test (inclusiv cazuri limită n = 0).',
    descriptionEn: 'Never trust generated C++ snippets without dry-run tracing edge cases like n = 0 or negative values.',
    missionId: 'g7_decision_a',
    glossarySlugRo: 'structura-if-else-switch',
    glossarySlugEn: 'if-else-switch-statements',
  },
  {
    id: 'bridge_prompt',
    gradeRo: 'Digital Literacy · Prompting C.R.I.F.',
    gradeEn: 'Digital Literacy · C.R.I.F. Prompting',
    titleRo: 'Arhitectura Promptului Responsabil (Context · Rol · Format)',
    titleEn: 'Responsible Prompt Architecture (Context · Role · Format)',
    descriptionRo: 'Un prompt bine structurat previne halucinațiile și transformă AI-ul în meditator pas-cu-pas, nu în mașină de copiat.',
    descriptionEn: 'Structured prompting reduces hallucinations and turns AI into a step-by-step tutor rather than a cheat machine.',
    missionId: 'internet2',
    glossarySlugRo: 'prompt-engineering-rccl',
    glossarySlugEn: 'prompt-engineering-rccl',
  },
];

export const AI_LAB_FAQS: AiLabFaqItem[] = [
  {
    qRo: 'Cum funcționează Laboratorul AI & Deepfake de pe ArkyEdu fără chat nesigur sau cont cu plată?',
    qEn: 'How does the ArkyEdu AI & Deepfake Lab work safely with zero open chat or paid accounts?',
    aRo: 'Laboratorul rulează 100% determinist și sigur direct în browser, fără colectare de date și fără chat liber nesupravegheat: conține un Tokenizator BPE live, simulator matematic de Temperatură/Probabilități (Softmax), 6 cazuri vizuale/audio de detecție Deepfake și un constructor de prompturi pe blocuri (C.R.I.F.).',
    aEn: 'The lab runs 100% deterministically inside your browser with zero open unmoderated chat or paywalls: it includes a live BPE-style Tokenizer, interactive Softmax Temperature simulator, 6 image/audio/video/news deepfake forensic cases, and a block-based Prompt Architect.',
  },
  {
    qRo: 'Ce este un „token” și de ce inventează (halucinează) uneori modelele AI?',
    qEn: 'What is an AI token and why do LLMs sometimes hallucinate?',
    aRo: 'Un LLM nu citește idei, ci sparge textul în bucăți numerice numite tokeni (cuvinte scurte, silabe sau semne) și calculează statistic care este cel mai probabil token următor. Când nu are context precis sau când temperatura este mare, modelul poate lega cuvinte care „sună convingător”, dar sunt false — fenomen numit halucinație.',
    aEn: 'LLMs split text into numeric sub-word chunks called tokens and statistically predict the next token. When context is missing or Temperature is high, they may assemble plausible-sounding falsehoods known as hallucinations.',
  },
  {
    qRo: 'Cum pot elevii și părinții să recunoască o imagine Deepfake sau o clonă vocală AI?',
    qEn: 'How can students and parents spot an AI Deepfake image or cloned voice scam?',
    aRo: 'La imagini: verifică textul de pe fundal (adesea distorsionat), detaliile mâinilor/emblemelor, umbrele și absența metadatelor EXIF/C2PA. La audio/video: atenție la cererile urgente de coduri SMS 2FA sau bani, interdicția de a suna înapoi și stabilește un cuvânt-parolă secret cu familia.',
    aEn: 'In images: inspect background wall text for gibberish, hands/badges, shadow consistency, and camera EXIF/C2PA data. For audio/video: reject urgent requests for 2FA SMS codes, call back on saved contacts, and use an offline family safe-word.',
  },
  {
    qRo: 'Cum trebuie să folosească elevii (10–15 ani) inteligența artificială etic la Informatică și TIC?',
    qEn: 'How should students (ages 10–15) use AI ethically for Computer Science & ICT homework?',
    aRo: 'Folosește metoda C.R.I.F. (Context, Rol, Instrucțiune, Format + Guardrail): cere AI-ului să îți explice o eroare din codul tău pas cu pas cu un tabel de valori și o întrebare de verificare, fără să îți scrie tema gata de copiat, apoi testează întotdeauna codul în Sandbox.',
    aEn: 'Use the C.R.I.F. framework (Context, Role, Instruction, Format + Guardrails): ask AI to explain why your code failed step-by-step with a dry-run trace and check question instead of writing homework for you, then test every snippet in a real compiler.',
  },
  {
    qRo: 'Primește elevul recompense în ArkyEdu pentru finalizarea cazurilor din Laboratorul AI?',
    qEn: 'Do students earn real ArkyEdu rewards for completing AI & Deepfake Lab cases?',
    aRo: 'Da! Rezolvarea cazurilor din Detectivul Deepfake, a testelor de halucinații și a misiunilor Prompt Architect acordă ByteCoins reali în contul elevului și salvează progresul automat în browser.',
    aEn: 'Yes! Cracking Deepfake forensic cases, spotting hallucinations, and assembling high-scoring C.R.I.F. prompts award real ByteCoins directly to your student inventory.',
  },
];
