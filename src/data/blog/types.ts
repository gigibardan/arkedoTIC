export type BlogCategoryId = 'ai-skills' | 'cpp-algorithms' | 'excel-office' | 'cyber-safety' | 'robotics-iot' | 'parents-teachers';

export interface BlogCodeBlock {
  title: string;
  language: string;
  code: string;
  caption?: string;
}

export interface BlogTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface BlogCallout {
  title: string;
  text: string;
  variant: 'tip' | 'warning' | 'example';
}

export interface BlogSection {
  id: string;
  heading: string;
  paragraphs: string[];
  bulletPoints?: string[];
  numberedSteps?: string[];
  codeBlock?: BlogCodeBlock;
  table?: BlogTable;
  callout?: BlogCallout;
}

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogInternalLink {
  label: string;
  url: string;
  missionId?: string;
  targetView?: 'catalog' | 'arcade' | 'duel' | 'city' | 'teacher' | 'sandbox' | 'ailab' | 'algolab' | 'leonida' | 'fise' | 'glossary';
  description: string;
}

export interface BlogLangContent {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  breadcrumbLabel: string;
  categoryLabel: string;
  readTime: string;
  tldrTitle: string;
  tldr: string;
  intro: string;
  sections: BlogSection[];
  checklistTitle: string;
  checklist: string[];
  faqs: BlogFaq[];
  internalLinksTitle: string;
  internalLinks: BlogInternalLink[];
}

export interface BlogArticle {
  id: string;
  category: BlogCategoryId;
  gradeTagRo: string;
  gradeTagEn: string;
  publishedAt: string;
  updatedAt: string;
  featured?: boolean;
  ro: BlogLangContent;
  en: BlogLangContent;
}
