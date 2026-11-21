import { AllMissionId } from '../../types';

export type WorksheetGrade = 5 | 6 | 7 | 8;
export type WorksheetKind = 'worksheet' | 'exam' | 'olympiad' | 'project';
export type WorksheetQuestionType = 'mcq' | 'true-false' | 'short-answer' | 'code-output';

export interface WorksheetQuestion {
  id: string;
  partLabelRo: string;
  partLabelEn: string;
  points: number;
  type: WorksheetQuestionType;
  promptRo: string;
  promptEn: string;
  codeSnippet?: string;
  optionsRo?: string[];
  optionsEn?: string[];
  /** For mcq/true-false: 0-based index. For short-answer/code-output: canonical text answer */
  correctAnswer: number | string;
  /** Additional accepted string answers (trimmed, case-insensitive) for short-answer/code-output */
  acceptedAliases?: string[];
  placeholderRo?: string;
  placeholderEn?: string;
  solutionStepRo: string;
  solutionStepEn: string;
}

export interface WorksheetRubricRow {
  itemRo: string;
  itemEn: string;
  competencyRo: string;
  competencyEn: string;
  points: number;
}

export interface WorksheetFaq {
  qRo: string;
  qEn: string;
  aRo: string;
  aEn: string;
}

export interface WorksheetLocalizedMeta {
  slug: string;
  title: string;
  breadcrumbLabel: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  directAnswerSummary: string;
  objectives: string[];
  theorySnapshot: string;
  teacherTips: string;
}

export interface WorksheetItem {
  id: string;
  grade: WorksheetGrade;
  kind: WorksheetKind;
  estimatedMinutes: number;
  maxPoints: number;
  exOfficioPoints: number;
  publishedAt: string;
  curriculumRef: string;
  relatedModuleId: AllMissionId;
  relatedBlogSlugRo?: string;
  relatedBlogSlugEn?: string;
  relatedGlossarySlugRo?: string;
  relatedGlossarySlugEn?: string;
  optionalCppTraceCode?: string;
  optionalCppTraceStdin?: string;
  ro: WorksheetLocalizedMeta;
  en: WorksheetLocalizedMeta;
  questions: WorksheetQuestion[];
  rubricRows: WorksheetRubricRow[];
  faqs: WorksheetFaq[];
}

export interface CompletedWorksheetRecord {
  id: string;
  bestScore: number;
  bestNota: number;
  completedAt: string;
}
