
import { Paper, SearchResult, Language, Library, LiteratureReview } from '@/types';

// Mock data
const mockPapers: Paper[] = [
  {
    id: '1',
    title: {
      en: 'Advances in Deep Learning for Natural Language Processing',
      fa: 'پیشرفت‌های یادگیری عمیق در پردازش زبان طبیعی'
    },
    authors: ['Sarah Johnson', 'David Lee'],
    abstract: {
      en: 'This paper reviews recent advances in deep learning techniques for natural language processing (NLP), focusing on transformer-based architectures and their applications.',
      fa: 'این مقاله پیشرفت‌های اخیر در تکنیک‌های یادگیری عمیق برای پردازش زبان طبیعی (NLP) را بررسی می‌کند و بر معماری‌های مبتنی بر ترانسفورمر و کاربردهای آنها تمرکز دارد.'
    },
    year: 2023,
    doi: '10.1234/ai.2023.1234',
    journal: 'Journal of Artificial Intelligence Research',
    aiSummary: {
      en: 'This comprehensive review examines transformer architectures that have revolutionized NLP since 2017. Key developments include attention mechanisms, pre-training strategies, and multilingual capabilities. Applications span translation, question answering, and text generation.',
      fa: 'این بررسی جامع به معماری‌های ترانسفورمر که از سال 2017 انقلابی در NLP ایجاد کرده‌اند می‌پردازد. توسعه‌های کلیدی شامل مکانیسم‌های توجه، استراتژی‌های پیش‌آموزش و قابلیت‌های چندزبانه است. کاربردها شامل ترجمه، پاسخ به سوالات و تولید متن می‌شود.'
    },
  },
  {
    id: '2',
    title: {
      en: 'Climate Change Impacts on Global Agriculture',
      fa: 'تأثیرات تغییرات آب و هوا بر کشاورزی جهانی'
    },
    authors: ['Mohammad Ahmadi', 'Elena Rodriguez'],
    abstract: {
      en: 'This study analyzes the potential impacts of climate change on agricultural productivity worldwide, with a focus on developing regions.',
      fa: 'این مطالعه تأثیرات بالقوه تغییرات آب و هوا بر بهره‌وری کشاورزی در سرتاسر جهان را با تمرکز بر مناطق در حال توسعه تحلیل می‌کند.'
    },
    year: 2022,
    doi: '10.5678/env.2022.5678',
    journal: 'Environmental Science & Policy',
    aiSummary: {
      en: 'This paper presents climate modeling data showing significant crop yield reductions in tropical regions by 2050. Adaptation strategies including drought-resistant crops and improved irrigation are analyzed for effectiveness.',
      fa: 'این مقاله داده‌های مدل‌سازی اقلیمی را ارائه می‌دهد که کاهش قابل توجه عملکرد محصول در مناطق گرمسیری تا سال 2050 را نشان می‌دهد. استراتژی‌های سازگاری از جمله محصولات مقاوم به خشکسالی و بهبود آبیاری برای اثربخشی تحلیل شده‌اند.'
    },
  },
  {
    id: '3',
    title: {
      en: 'Quantum Computing: Current State and Future Directions',
      fa: 'محاسبات کوانتومی: وضعیت فعلی و جهت‌های آینده'
    },
    authors: ['Ali Hassani', 'Jennifer Wong'],
    abstract: {
      en: 'This paper provides an overview of recent developments in quantum computing hardware and algorithms, discussing potential applications and remaining challenges.',
      fa: 'این مقاله مروری بر تحولات اخیر در سخت‌افزار و الگوریتم‌های محاسبات کوانتومی ارائه می‌دهد و کاربردهای بالقوه و چالش‌های باقی‌مانده را مورد بحث قرار می‌دهد.'
    },
    year: 2023,
    doi: '10.9012/qc.2023.9012',
    journal: 'Quantum Computing Review',
    aiSummary: {
      en: 'The paper tracks progress in quantum bit stability and error correction since 2020. It highlights breakthroughs in quantum supremacy demonstrations while acknowledging scalability obstacles. Promising applications in cryptography, materials science, and optimization are evaluated.',
      fa: 'این مقاله پیشرفت در پایداری کوبیت‌های کوانتومی و تصحیح خطا از سال 2020 را دنبال می‌کند. پیشرفت‌های چشمگیر در نمایش‌های برتری کوانتومی را برجسته می‌کند و در عین حال موانع مقیاس‌پذیری را می‌پذیرد. کاربردهای امیدوارکننده در رمزنگاری، علم مواد و بهینه‌سازی ارزیابی شده‌اند.'
    },
  },
];

const mockLibraries: Library[] = [
  {
    id: 'lib1',
    name: 'AI Research',
    paperIds: ['1', '3'],
    createdAt: '2023-05-10T12:00:00Z',
  },
  {
    id: 'lib2',
    name: 'Climate Studies',
    paperIds: ['2'],
    createdAt: '2023-06-15T14:30:00Z',
  },
];

// Service functions
export const searchPapers = async (
  query: string, 
  language: Language,
  page: number = 1
): Promise<SearchResult> => {
  // In a real app, this would call an API
  // For now, we'll filter our mock data based on the query
  
  const results = mockPapers.filter(paper => {
    const searchField = language === 'en' ? paper.title.en : paper.title.fa;
    return searchField.toLowerCase().includes(query.toLowerCase());
  });

  return {
    papers: results,
    total: results.length,
    page: page,
    hasMore: false,
  };
};

export const getPaperById = async (id: string): Promise<Paper | undefined> => {
  return mockPapers.find(paper => paper.id === id);
};

export const getLibraries = async (): Promise<Library[]> => {
  return mockLibraries;
};

export const createLibrary = async (name: string): Promise<Library> => {
  const newLibrary: Library = {
    id: `lib${mockLibraries.length + 1}`,
    name,
    paperIds: [],
    createdAt: new Date().toISOString(),
  };
  mockLibraries.push(newLibrary);
  return newLibrary;
};

export const addPaperToLibrary = async (libraryId: string, paperId: string): Promise<boolean> => {
  const library = mockLibraries.find(lib => lib.id === libraryId);
  if (!library) return false;
  
  if (!library.paperIds.includes(paperId)) {
    library.paperIds.push(paperId);
  }
  return true;
};

export const generateLiteratureReview = async (
  paperIds: string[], 
  prompt: string,
  language: Language
): Promise<LiteratureReview> => {
  // In a real app, this would call an AI service
  return {
    id: `review-${Date.now()}`,
    title: language === 'en' ? 'Literature Review' : 'مرور ادبیات',
    content: language === 'en' 
      ? 'This is a mock literature review generated from the selected papers. In a real application, this would be generated by an AI model based on the content of the papers and the provided prompt.'
      : 'این یک مرور ادبیات نمونه است که از مقالات انتخاب شده تولید شده است. در یک برنامه واقعی، این توسط یک مدل هوش مصنوعی براساس محتوای مقالات و دستور ارائه شده تولید می‌شود.',
    createdAt: new Date().toISOString(),
    language,
    paperIds,
  };
};

export const generatePromptBasedReview = async (
  prompt: string,
  additionalPapers: string[],
  language: Language
): Promise<LiteratureReview> => {
  // In a real app, this would call an AI service to generate a review based on the prompt
  // and would search for relevant papers based on the prompt
  return {
    id: `review-prompt-${Date.now()}`,
    title: language === 'en' 
      ? `Literature Review: ${prompt.slice(0, 30)}...` 
      : `مرور ادبیات: ${prompt.slice(0, 30)}...`,
    content: language === 'en'
      ? `This is a mock literature review generated based on the prompt: "${prompt}". ${
          additionalPapers.length > 0 
            ? `Additional papers considered: ${additionalPapers.join(', ')}. ` 
            : ''
        }In a real application, this would be generated by an AI model that would search for relevant papers based on the prompt and generate a comprehensive review.`
      : `این یک مرور ادبیات نمونه است که بر اساس پرامپت تولید شده است: "${prompt}". ${
          additionalPapers.length > 0 
            ? `مقالات اضافی در نظر گرفته شده: ${additionalPapers.join(', ')}. ` 
            : ''
        }در یک برنامه واقعی، این توسط یک مدل هوش مصنوعی تولید می‌شود که بر اساس پرامپت، مقالات مرتبط را جستجو می‌کند و یک مرور جامع تولید می‌کند.`,
    createdAt: new Date().toISOString(),
    language,
    paperIds: [],
  };
};
