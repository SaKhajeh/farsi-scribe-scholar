
export interface Paper {
  id: string;
  title: {
    en: string;
    fa: string;
  };
  authors: string[];
  abstract: {
    en: string;
    fa: string;
  };
  year: number;
  url?: string;
  doi?: string;
  journal?: string;
  aiSummary?: {
    en: string;
    fa: string;
  };
  dateAdded?: string;
}

export interface Library {
  id: string;
  name: string;
  paperIds: string[];
  createdAt: string;
}

export type Language = 'en' | 'fa';

export interface SearchResult {
  papers: Paper[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface LiteratureReview {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  language: Language;
  paperIds: string[];
}
