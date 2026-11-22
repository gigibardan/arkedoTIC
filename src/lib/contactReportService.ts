import { collection, addDoc } from 'firebase/firestore';
import { db, isCloudConnected } from './firebase';
import { MISSION_META_BY_ID } from '../data/missionsRegistry';
import { AllMissionId } from '../types';

export type IssueCategory = 'bug' | 'content' | 'loading' | 'suggestion' | 'other';
export type ReporterRole = 'student' | 'teacher' | 'parent' | 'other';
export type SubmissionKind = 'contact' | 'bug_report';

export interface PageDiagnostics {
  url: string;
  originUrl?: string;
  pathname: string;
  pageTitle: string;
  view: string;
  contextLabel: string;
  missionId?: string | null;
  missionTitle?: string | null;
  gradeLabel?: string | null;
  level?: number | null;
  score?: number | null;
  lang: 'ro' | 'en';
  studentName?: string;
  viewport: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  standalonePwa: boolean;
  userAgent: string;
  timestampIso: string;
}

export interface ContactOrReportPayload {
  kind: SubmissionKind;
  name: string;
  email: string;
  role: ReporterRole;
  subject: string;
  message: string;
  category?: IssueCategory;
  includeDiagnostics?: boolean;
  diagnostics?: PageDiagnostics;
}

export interface SubmissionResult {
  ok: boolean;
  emailSent: boolean;
  cloudSaved: boolean;
  localSaved: boolean;
  mailtoUrl: string;
  messageId: string;
}

const LOCAL_CONTACT_STORAGE_KEY = 'arkyedu_local_contact_messages';
export const PRIMARY_CONTACT_EMAIL = 'contact@arkyedu.com';
export const CC_CONTACT_EMAIL = 'gheorghe.bardan@gmail.com';

const CATEGORY_LABELS_RO: Record<IssueCategory, string> = {
  bug: 'Eroare tehnică / Bug vizual',
  content: 'Greșeală în lecție / text / barem',
  loading: 'Nu se încarcă / Se blochează',
  suggestion: 'Sugestie de îmbunătățire',
  other: 'Altă problemă',
};

const CATEGORY_LABELS_EN: Record<IssueCategory, string> = {
  bug: 'Technical bug / Visual glitch',
  content: 'Lesson / Text / Rubric error',
  loading: 'Failed to load / Frozen',
  suggestion: 'Improvement suggestion',
  other: 'Other issue',
};

export function getCategoryLabel(category: IssueCategory, lang: 'ro' | 'en' = 'ro'): string {
  return lang === 'en' ? CATEGORY_LABELS_EN[category] : CATEGORY_LABELS_RO[category];
}

const VIEW_LABELS_RO: Record<string, string> = {
  catalog: 'Catalog Cursuri & Pagina Principală',
  lesson: 'Pagină de Misiune / Lecție Interactivă',
  teacher: 'Portal Profesori & Catalog Digital',
  superadmin: 'Panou SuperAdmin',
  arcade: 'Laborator Jocuri Arcade Retro',
  duel: 'Arena Dueluri 1v1 Live',
  city: 'Arkedo Smart City & IoT',
  blog: 'Blog & Ghiduri TIC',
  glossary: 'Glosar Bilingv Informatică & TIC',
  sandbox: 'Sandbox Cod Live (C++ / Python / HTML5)',
  carnet: 'Carnetul Digital al Elevului',
  evaluare: 'Simulator Evaluare Rapidă TIC',
  livequiz: 'Quiz Live în Clasă (PIN)',
  fise: 'Fișe de Lucru & Teste cu Barem',
  leonida: 'Universul Vice Leonida (GTA 6 Open-World)',
  ailab: 'Laboratorul AI & Detector Deepfake',
  algolab: 'Laborator Algoritmi Vizuali, Binar & CPU',
};

const VIEW_LABELS_EN: Record<string, string> = {
  catalog: 'Courses Catalog & Home Page',
  lesson: 'Interactive Mission / Lesson Page',
  teacher: 'Teacher Portal & Gradebook',
  superadmin: 'SuperAdmin Console',
  arcade: 'Retro Arcade Lab',
  duel: '1v1 Live Duel Arena',
  city: 'Arkedo Smart City & IoT',
  blog: 'ICT Blog & Guides',
  glossary: 'Bilingual CS & ICT Glossary',
  sandbox: 'Live Code Sandbox (C++ / Python / HTML5)',
  carnet: 'Student Digital Portfolio',
  evaluare: 'Quick ICT Evaluation Simulator',
  livequiz: 'Live Classroom Quiz (PIN)',
  fise: 'Worksheets & Rubrics Hub',
  leonida: 'Vice Leonida Universe (GTA 6 Open-World)',
  ailab: 'AI & Deepfake Forensics Lab',
  algolab: 'Visual Algorithms, Binary & CPU Lab',
};

export function getViewFriendlyLabel(view: string, lang: 'ro' | 'en' = 'ro'): string {
  const map = lang === 'en' ? VIEW_LABELS_EN : VIEW_LABELS_RO;
  return map[view] || view || (lang === 'en' ? 'ArkyEdu Page' : 'Pagină ArkyEdu');
}

export function capturePageDiagnostics(opts?: {
  view?: string;
  missionId?: string | null;
  level?: number | null;
  score?: number | null;
  studentName?: string;
  lang?: 'ro' | 'en';
  contextLabel?: string;
  overrideUrl?: string;
  originUrl?: string;
}): PageDiagnostics {
  const isBrowser = typeof window !== 'undefined';
  const lang: 'ro' | 'en' = opts?.lang === 'en' ? 'en' : 'ro';
  const view = opts?.view || 'catalog';

  const rawHref = isBrowser ? window.location.href : 'https://www.arkyedu.com/';
  const url = opts?.overrideUrl || rawHref;
  const pathname = isBrowser
    ? `${window.location.pathname}${window.location.search}${window.location.hash}`
    : '/';
  const pageTitle = isBrowser ? document.title || 'ArkyEdu' : 'ArkyEdu';

  const missionId = opts?.missionId || null;
  const meta = missionId ? MISSION_META_BY_ID[missionId as AllMissionId] : undefined;
  const missionTitle = meta ? (lang === 'en' ? meta.titleEn : meta.titleRo) : null;
  const gradeLabel = meta ? (lang === 'en' ? meta.gradeLabelEn : meta.gradeLabelRo) : null;

  let contextLabel = opts?.contextLabel || '';
  if (!contextLabel) {
    if (meta) {
      const lvlTxt =
        typeof opts?.level === 'number' && opts.level > 0
          ? ` (${lang === 'en' ? 'Level' : 'Nivel'} ${opts.level})`
          : '';
      contextLabel = `${meta.emoji} ${gradeLabel} · ${missionTitle}${lvlTxt}`;
    } else {
      contextLabel = getViewFriendlyLabel(view, lang);
    }
  }

  const width = isBrowser ? window.innerWidth : 1280;
  const height = isBrowser ? window.innerHeight : 720;
  const deviceType: 'mobile' | 'tablet' | 'desktop' =
    width < 640 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';

  let standalonePwa = false;
  if (isBrowser) {
    try {
      standalonePwa =
        window.matchMedia('(display-mode: standalone)').matches ||
        Boolean((window.navigator as { standalone?: boolean }).standalone);
    } catch {
      standalonePwa = false;
    }
  }

  const rawUa = isBrowser ? window.navigator.userAgent : 'SSR';
  const compactUa = rawUa.length > 160 ? `${rawUa.slice(0, 157)}...` : rawUa;

  return {
    url,
    originUrl: opts?.originUrl,
    pathname,
    pageTitle,
    view,
    contextLabel,
    missionId,
    missionTitle,
    gradeLabel,
    level: opts?.level ?? null,
    score: opts?.score ?? null,
    lang,
    studentName: opts?.studentName || '',
    viewport: `${width}×${height}`,
    deviceType,
    standalonePwa,
    userAgent: compactUa,
    timestampIso: new Date().toISOString(),
  };
}

export function buildFormattedMessageBody(payload: ContactOrReportPayload): string {
  const cleanMessage = payload.message.trim();
  if (payload.kind !== 'bug_report') {
    return cleanMessage;
  }

  const d = payload.diagnostics;
  const lang = d?.lang || 'ro';
  const categoryText = payload.category ? getCategoryLabel(payload.category, 'ro') : 'Problemă generală';
  const lines: string[] = [cleanMessage, '', '--- DETALII PAGINĂ & CONTEXT RAPORT ---'];

  lines.push(`Tip solicitare: Raportare Problemă (${categoryText})`);

  if (d && payload.includeDiagnostics !== false) {
    const linkedUrl = d.originUrl || d.url;
    lines.push(`URL pagină raportată: ${linkedUrl}`);
    if (d.originUrl && d.originUrl !== d.url) {
      lines.push(`URL aplicație curent: ${d.url}`);
    }
    lines.push(`Secțiune / Context: ${d.contextLabel}`);
    lines.push(`Titlu pagină: ${d.pageTitle}`);
    if (d.missionId) {
      lines.push(
        `Misiune: ${d.missionId}${d.missionTitle ? ` (${d.missionTitle})` : ''}${
          typeof d.level === 'number' ? ` | Nivel: ${d.level}` : ''
        }${typeof d.score === 'number' ? ` | Scor: ${d.score}` : ''}`
      );
    }
    lines.push(`Limbă interfață: ${lang.toUpperCase()}`);
    lines.push(
      `Ecran / Dispozitiv: ${d.viewport} (${d.deviceType})${d.standalonePwa ? ' [PWA]' : ''}`
    );
    lines.push(`Browser / Platformă: ${d.userAgent}`);
  } else if (d) {
    const linkedUrl = d.originUrl || d.url;
    lines.push(`URL pagină raportată: ${linkedUrl}`);
  }

  return lines.join('\n');
}

export function buildReportMailtoUrl(payload: ContactOrReportPayload): string {
  const cleanSubject = payload.subject.trim() || 'Raport problemă ArkyEdu';
  const body = buildFormattedMessageBody(payload);
  const params = new URLSearchParams({
    cc: CC_CONTACT_EMAIL,
    subject:
      payload.kind === 'bug_report'
        ? `[ArkyEdu Raport] ${cleanSubject}`
        : `[ArkyEdu Contact] ${cleanSubject}`,
    body,
  });
  return `mailto:${PRIMARY_CONTACT_EMAIL}?${params.toString()}`;
}

export async function submitContactOrReport(
  payload: ContactOrReportPayload
): Promise<SubmissionResult> {
  const cleanName = payload.name.trim() || 'Anonim';
  const cleanEmail = payload.email.trim() || 'fara-email@arkyedu.com';
  const cleanSubject =
    payload.subject.trim() ||
    (payload.kind === 'bug_report' ? 'Raport problemă platformă ArkyEdu' : 'Mesaj Platformă ArkyEdu');
  const formattedMessage = buildFormattedMessageBody(payload);
  const createdAt = new Date().toISOString();
  const messageId = `${payload.kind === 'bug_report' ? 'rep' : 'msg'}_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 6)}`;

  const linkedUrl = payload.diagnostics?.originUrl || payload.diagnostics?.url || '';
  const pageContext = payload.diagnostics?.contextLabel || '';
  const categoryLabel = payload.category ? getCategoryLabel(payload.category, 'ro') : undefined;

  const newStoredDoc = {
    id: messageId,
    name: cleanName,
    email: cleanEmail,
    role: payload.role,
    subject:
      payload.kind === 'bug_report' && !cleanSubject.toLowerCase().includes('[raport')
        ? `[Raport Problemă] ${cleanSubject}`
        : cleanSubject,
    message: formattedMessage,
    createdAt,
    status: 'unread' as const,
    kind: payload.kind,
    sourceUrl: linkedUrl || undefined,
    pageContext: pageContext || undefined,
    issueCategory: categoryLabel,
  };

  let localSaved = false;
  let cloudSaved = false;
  let emailSent = false;

  // 1. LocalStorage backup (never lose a message/report even offline)
  try {
    const existing = localStorage.getItem(LOCAL_CONTACT_STORAGE_KEY);
    const list = existing ? JSON.parse(existing) : [];
    list.unshift(newStoredDoc);
    localStorage.setItem(LOCAL_CONTACT_STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
    localSaved = true;
  } catch {
    localSaved = false;
  }

  // 2. Firestore contact_messages (visible in SuperAdmin / Teacher Inbox)
  if (isCloudConnected && db) {
    try {
      await addDoc(collection(db, 'contact_messages'), {
        name: newStoredDoc.name,
        email: newStoredDoc.email,
        role: newStoredDoc.role,
        subject: newStoredDoc.subject,
        message: newStoredDoc.message,
        createdAt: newStoredDoc.createdAt,
        status: 'unread',
        kind: newStoredDoc.kind,
        ...(newStoredDoc.sourceUrl ? { sourceUrl: newStoredDoc.sourceUrl } : {}),
        ...(newStoredDoc.pageContext ? { pageContext: newStoredDoc.pageContext } : {}),
        ...(newStoredDoc.issueCategory ? { issueCategory: newStoredDoc.issueCategory } : {}),
      });
      cloudSaved = true;
    } catch (fErr) {
      console.warn('Firestore backup contact/report failed:', fErr);
    }
  }

  // 3. FormSubmit.co email dispatch to contact@arkyedu.com + CC gheorghe.bardan@gmail.com
  try {
    const d = payload.diagnostics;
    const emailPayload: Record<string, string> = {
      name: cleanName,
      email: cleanEmail,
      role: payload.role,
      subject: newStoredDoc.subject,
      message: formattedMessage,
      _subject:
        payload.kind === 'bug_report'
          ? `[ArkyEdu Raport Problemă] ${cleanSubject} — ${pageContext || cleanName}`
          : `[ArkyEdu Contact] ${cleanSubject} - de la ${cleanName} (${payload.role})`,
      _cc: CC_CONTACT_EMAIL,
      _replyto: cleanEmail,
      _captcha: 'false',
      _template: 'table',
    };

    if (payload.kind === 'bug_report') {
      emailPayload.Tip_Solicitare = 'Raportare Problemă';
      if (categoryLabel) emailPayload.Categorie_Problema = categoryLabel;
      if (linkedUrl) emailPayload.URL_Pagina_Raportata = linkedUrl;
      if (pageContext) emailPayload.Context_Pagina = pageContext;
      if (d?.missionId) {
        emailPayload.Misiune_ID = d.missionId;
      }
      if (typeof d?.level === 'number') {
        emailPayload.Nivel_Scor = `Nivel ${d.level}${typeof d.score === 'number' ? ` / Scor ${d.score}` : ''}`;
      }
      if (d?.viewport) {
        emailPayload.Ecran_Dispozitiv = `${d.viewport} (${d.deviceType})`;
      }
    }

    const res = await fetch(`https://formsubmit.co/ajax/${PRIMARY_CONTACT_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    if (res.ok) {
      emailSent = true;
    }
  } catch (e) {
    console.warn('FormSubmit network notice:', e);
  }

  // 4. Netlify Forms fallback
  try {
    const params = new URLSearchParams();
    params.append('form-name', 'contact');
    params.append('name', newStoredDoc.name);
    params.append('email', newStoredDoc.email);
    params.append('role', newStoredDoc.role);
    params.append('subject', newStoredDoc.subject);
    params.append('message', formattedMessage);
    if (linkedUrl) params.append('sourceUrl', linkedUrl);
    params.append('bot-field', '');
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
  } catch {
    // Ignore Netlify fallback errors in non-Netlify environments
  }

  return {
    ok: localSaved || cloudSaved || emailSent,
    emailSent,
    cloudSaved,
    localSaved,
    mailtoUrl: buildReportMailtoUrl(payload),
    messageId,
  };
}
