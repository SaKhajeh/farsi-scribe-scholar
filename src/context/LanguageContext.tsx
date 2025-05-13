
import React, { createContext, useContext, useState } from 'react';
import { Language } from '@/types';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  toggleLanguage: () => {},
  t: (key: string) => key,
});

export const translations = {
  en: {
    'app.title': 'Bilingual Research Assistant',
    'search.placeholder': 'Search for papers...',
    'language.english': 'English',
    'language.farsi': 'Farsi',
    'nav.search': 'Search',
    'nav.libraries': 'My Libraries',
    'nav.literature': 'Literature Review',
    'nav.settings': 'Settings',
    'paper.abstract': 'Abstract',
    'paper.aiSummary': 'AI Summary',
    'paper.chat': 'Chat with PDF',
    'paper.addToLibrary': 'Add to Library',
    'libraries.create': 'Create Library',
    'libraries.delete': 'Delete',
    'libraries.rename': 'Rename',
    'review.prompt': 'What would you like to know about these papers?',
    'review.generate': 'Generate Review',
    'review.fromLibrary': 'Generate from Library',
    'review.regenerate': 'Regenerate',
    'review.refine': 'Refine',
    'review.translate': 'Translate',
  },
  fa: {
    'app.title': 'دستیار تحقیقاتی دو زبانه',
    'search.placeholder': 'جستجوی مقالات...',
    'language.english': 'انگلیسی',
    'language.farsi': 'فارسی',
    'nav.search': 'جستجو',
    'nav.libraries': 'کتابخانه‌های من',
    'nav.literature': 'مرور ادبیات',
    'nav.settings': 'تنظیمات',
    'paper.abstract': 'چکیده',
    'paper.aiSummary': 'خلاصه هوش مصنوعی',
    'paper.chat': 'گفتگو با PDF',
    'paper.addToLibrary': 'افزودن به کتابخانه',
    'libraries.create': 'ایجاد کتابخانه',
    'libraries.delete': 'حذف',
    'libraries.rename': 'تغییر نام',
    'review.prompt': 'مایلید در مورد این مقالات چه چیزی بدانید؟',
    'review.generate': 'ایجاد مرور',
    'review.fromLibrary': 'ایجاد از کتابخانه',
    'review.regenerate': 'ایجاد مجدد',
    'review.refine': 'پالایش',
    'review.translate': 'ترجمه',
  },
};

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'fa' : 'en'));
  };

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
