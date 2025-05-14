
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
    'review.promptBased': 'Prompt-based Generation',
    'review.addPapers': 'Add Key Papers',
    'review.researchTopic': 'Research Topic or Question',
    'review.enterTopic': 'Enter your research question or topic...',
    'review.paperTitle': 'Enter paper title or DOI...',
    'review.remove': 'Remove',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.signOut': 'Sign Out',
    'auth.needAccount': 'Need an account? Sign Up',
    'auth.haveAccount': 'Already have an account? Sign In',
    'auth.loginSuccess': 'Signed In Successfully',
    'auth.signupSuccess': 'Signed Up Successfully',
    'auth.loginFailed': 'Sign In Failed',
    'auth.signupFailed': 'Sign Up Failed',
    'auth.welcomeBack': 'Welcome back!',
    'auth.accountCreated': 'Your account has been created successfully',
    'auth.tryAgain': 'Please try again',
    'auth.processing': 'Processing...',
    'auth.welcomeMessage': 'Welcome to the Research Assistant',
    'auth.loginToAccess': 'Sign in to access all features',
    'auth.getStarted': 'Get Started',
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
    'review.promptBased': 'ایجاد بر اساس پرامپت',
    'review.addPapers': 'افزودن مقالات کلیدی',
    'review.researchTopic': 'موضوع یا سؤال تحقیق',
    'review.enterTopic': 'موضوع یا سؤال تحقیق خود را وارد کنید...',
    'review.paperTitle': 'عنوان مقاله یا DOI را وارد کنید...',
    'review.remove': 'حذف',
    'auth.signIn': 'ورود',
    'auth.signUp': 'ثبت‌نام',
    'auth.signOut': 'خروج',
    'auth.needAccount': 'حساب کاربری ندارید؟ ثبت‌نام کنید',
    'auth.haveAccount': 'حساب کاربری دارید؟ وارد شوید',
    'auth.loginSuccess': 'ورود موفقیت‌آمیز',
    'auth.signupSuccess': 'ثبت‌نام موفقیت‌آمیز',
    'auth.loginFailed': 'خطا در ورود',
    'auth.signupFailed': 'خطا در ثبت‌نام',
    'auth.welcomeBack': 'خوش آمدید!',
    'auth.accountCreated': 'حساب کاربری شما با موفقیت ایجاد شد',
    'auth.tryAgain': 'لطفا دوباره تلاش کنید',
    'auth.processing': 'در حال پردازش...',
    'auth.welcomeMessage': 'به دستیار پژوهشی خوش آمدید',
    'auth.loginToAccess': 'برای دسترسی به تمام امکانات وارد شوید',
    'auth.getStarted': 'شروع کنید',
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
