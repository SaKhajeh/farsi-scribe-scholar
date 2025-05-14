
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  
  return (
    <div className="flex items-center space-x-2">
      <Button
        type="button"
        variant={language === 'en' ? 'default' : 'outline'}
        className={`px-3 py-1 ${language === 'en' ? 'bg-green-500 hover:bg-green-600' : 'text-gray-600'}`}
        onClick={() => language !== 'en' && toggleLanguage()}
        size="sm"
      >
        🇬🇧 {t('language.english')}
      </Button>
      
      <Button
        type="button"
        variant={language === 'fa' ? 'default' : 'outline'}
        className={`px-3 py-1 ${language === 'fa' ? 'bg-green-500 hover:bg-green-600' : 'text-gray-600'}`}
        onClick={() => language !== 'fa' && toggleLanguage()}
        size="sm"
      >
        🇮🇷 {t('language.farsi')}
      </Button>
    </div>
  );
};

export default LanguageToggle;
