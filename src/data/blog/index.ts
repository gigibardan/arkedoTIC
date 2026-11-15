import { BlogArticle, BlogCategoryId } from './types';
import { BLOG_BATCH_1 } from './batch1';
import { BLOG_BATCH_2 } from './batch2';
import { BLOG_BATCH_3 } from './batch3';

export type {
  BlogArticle,
  BlogCategoryId,
  BlogLangContent,
  BlogSection,
  BlogFaq,
  BlogInternalLink,
  BlogTable,
  BlogCodeBlock,
  BlogCallout,
} from './types';

export const BLOG_ARTICLES: BlogArticle[] = [
  ...BLOG_BATCH_1,
  ...BLOG_BATCH_2,
  ...BLOG_BATCH_3,
];

export const BLOG_CATEGORIES: { id: BlogCategoryId | 'all'; labelRo: string; labelEn: string }[] = [
  { id: 'all', labelRo: 'Toate ghidurile', labelEn: 'All Guides' },
  { id: 'ai-skills', labelRo: 'AI & Competențe', labelEn: 'AI & Literacy' },
  { id: 'cpp-algorithms', labelRo: 'C++ & Algoritmi', labelEn: 'C++ & Algorithms' },
  { id: 'excel-office', labelRo: 'Excel & Birotică', labelEn: 'Excel & Office' },
  { id: 'cyber-safety', labelRo: 'Siguranță Online', labelEn: 'Cyber Safety' },
  { id: 'robotics-iot', labelRo: 'Robotică & IoT', labelEn: 'Robotics & IoT' },
  { id: 'parents-teachers', labelRo: 'Părinți & Profesori', labelEn: 'Parents & Teachers' },
];

export function findBlogArticleBySlug(slug: string | null | undefined): BlogArticle | undefined {
  if (!slug) return undefined;
  const clean = slug.replace(/^\/+|\/+$/g, '').toLowerCase();
  return BLOG_ARTICLES.find(
    (a) => a.ro.slug.toLowerCase() === clean || a.en.slug.toLowerCase() === clean || a.id.toLowerCase() === clean
  );
}

export function getRelatedBlogArticles(currentId: string, limit = 3): BlogArticle[] {
  const current = BLOG_ARTICLES.find((a) => a.id === currentId);
  const others = BLOG_ARTICLES.filter((a) => a.id !== currentId);
  if (!current) return others.slice(0, limit);
  const sorted = [...others].sort((a, b) => {
    const aSame = a.category === current.category ? 1 : 0;
    const bSame = b.category === current.category ? 1 : 0;
    return bSame - aSame;
  });
  return sorted.slice(0, limit);
}
