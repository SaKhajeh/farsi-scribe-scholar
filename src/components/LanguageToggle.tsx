
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  
  return (
    <div className="flex items-center bg-muted p-1 rounded-lg">
      <Button
        type="button"
        variant="ghost"
        className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
          language === 'en' 
            ? 'language-toggle-active' 
            : 'language-toggle-inactive'
        }`}
        onClick={() => language !== 'en' && toggleLanguage()}
        size="sm"
      >
        <span className="mr-2">🇬🇧</span>
        {t('language.english')}
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
          language === 'fa' 
            ? 'language-toggle-active' 
            : 'language-toggle-inactive'
        }`}
        onClick={() => language !== 'fa' && toggleLanguage()}
        size="sm"
      >
        <span className="mr-2">🇮🇷</span>
        {t('language.farsi')}
      </Button>
    </div>
  );
};

export default LanguageToggle;
