export type GlossaryCategoryId =
  | 'hardware-systems'
  | 'algorithms-cpp'
  | 'office-data'
  | 'web-security'
  | 'robotics-iot'
  | 'ai-cloud';

export interface GlossaryComparison {
  title: string;
  summary: string;
}

export interface GlossaryFaq {
  question: string;
  answer: string;
}

export interface GlossaryLangTerm {
  slug: string;
  term: string;
  shortAnswer: string;
  explanation: string[];
  syntaxOrFormula?: {
    title: string;
    code: string;
  };
  example: string;
  commonMistake: string;
  vsComparison: GlossaryComparison;
  faqs: GlossaryFaq[];
  keywords: string;
}

export interface GlossaryTerm {
  id: string;
  category: GlossaryCategoryId;
  grades: ('5' | '6' | '7' | '8')[];
  gradeTagRo: string;
  gradeTagEn: string;
  relatedModuleId: string;
  relatedMissionId: string;
  relatedBlogIds: string[];
  relatedTermIds: string[];
  ro: GlossaryLangTerm;
  en: GlossaryLangTerm;
}
