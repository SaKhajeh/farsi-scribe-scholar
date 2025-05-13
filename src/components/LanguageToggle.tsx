
import React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { useLanguage } from '@/context/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  
  return (
    <Toggle
      aria-label="Toggle Language"
      pressed={language === 'fa'}
      onPressedChange={toggleLanguage}
      className="flex items-center gap-1 px-3"
    >
      {language === 'en' 
        ? <span>🇬🇧 {t('language.english')}</span> 
        : <span>🇮🇷 {t('language.farsi')}</span>}
    </Toggle>
  );
};

export default LanguageToggle;
