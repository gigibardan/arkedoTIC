import { CompletedWorksheetRecord, WorksheetGrade, WorksheetItem, WorksheetKind } from './types';
import { GRADE_5_AND_6_WORKSHEETS } from './grade5And6';
import { GRADE_7_AND_8_WORKSHEETS } from './grade7And8';

export * from './types';

export const WORKSHEETS_BANK: WorksheetItem[] = [
  ...GRADE_5_AND_6_WORKSHEETS,
  ...GRADE_7_AND_8_WORKSHEETS,
];

export const WORKSHEET_KIND_LABELS: Record<
  WorksheetKind,
  { ro: string; en: string; shortRo: string; shortEn: string }
> = {
  worksheet: {
    ro: 'Fișă de Lucru',
    en: 'Worksheet',
    shortRo: 'Fișă',
    shortEn: 'Sheet',
  },
  exam: {
    ro: 'Test cu Barem 1–10',
    en: 'Graded Exam (Rubric)',
    shortRo: 'Test',
    shortEn: 'Exam',
  },
  olympiad: {
    ro: 'Subiect OJI / Admitere',
    en: 'Olympiad / Prep',
    shortRo: 'OJI / Teză',
    shortEn: 'Olympiad',
  },
  project: {
    ro: 'Ghid Proiect & Evaluare',
    en: 'Project & Rubric',
    shortRo: 'Proiect',
    shortEn: 'Project',
  },
};

export const WORKSHEET_GRADE_LABELS: Record<WorksheetGrade, { ro: string; en: string }> = {
  5: { ro: 'Clasa a V-a', en: 'Grade 5' },
  6: { ro: 'Clasa a VI-a', en: 'Grade 6' },
  7: { ro: 'Clasa a VII-a', en: 'Grade 7' },
  8: { ro: 'Clasa a VIII-a', en: 'Grade 8' },
};

export function findWorksheetBySlug(slug: string | null | undefined): {
  worksheet: WorksheetItem | null;
  matchedLang: 'ro' | 'en' | null;
} {
  if (!slug) return { worksheet: null, matchedLang: null };
  const normalized = slug.trim().toLowerCase().replace(/\/+$/, '');
  for (const item of WORKSHEETS_BANK) {
    if (item.ro.slug.toLowerCase() === normalized) {
      return { worksheet: item, matchedLang: 'ro' };
    }
    if (item.en.slug.toLowerCase() === normalized) {
      return { worksheet: item, matchedLang: 'en' };
    }
    if (item.id.toLowerCase() === normalized) {
      return { worksheet: item, matchedLang: null };
    }
  }
  return { worksheet: null, matchedLang: null };
}

export function getRelatedWorksheets(currentId: string, limit = 3): WorksheetItem[] {
  const current = WORKSHEETS_BANK.find((w) => w.id === currentId);
  if (!current) return WORKSHEETS_BANK.slice(0, limit);
  const sameGrade = WORKSHEETS_BANK.filter((w) => w.id !== currentId && w.grade === current.grade);
  const others = WORKSHEETS_BANK.filter((w) => w.id !== currentId && w.grade !== current.grade);
  return [...sameGrade, ...others].slice(0, limit);
}

const WORKSHEETS_STORAGE_KEY = 'arkedo_completed_worksheets';

export function getCompletedWorksheetsMap(): Record<string, CompletedWorksheetRecord> {
  try {
    const raw = localStorage.getItem(WORKSHEETS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, CompletedWorksheetRecord>) : {};
  } catch {
    return {};
  }
}

export function getCompletedWorksheetIds(): string[] {
  return Object.keys(getCompletedWorksheetsMap());
}

export function saveCompletedWorksheetResult(
  id: string,
  score: number
): { isFirstSolve: boolean; bestScore: number; bestNota: number } {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const nota = Math.max(1, Math.min(10, Math.round((clamped / 10) * 100) / 100));
  const map = getCompletedWorksheetsMap();
  const prev = map[id];
  const isFirstSolve = !prev;
  const bestScore = prev ? Math.max(prev.bestScore, clamped) : clamped;
  const bestNota = prev ? Math.max(prev.bestNota, nota) : nota;
  map[id] = {
    id,
    bestScore,
    bestNota,
    completedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(WORKSHEETS_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Ignore storage quota errors
  }
  return { isFirstSolve, bestScore, bestNota };
}

export function normalizeShortAnswer(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
