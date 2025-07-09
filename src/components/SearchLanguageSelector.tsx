import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Languages } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface SearchLanguageSelectorProps {
  selectedLanguage: 'en' | 'fa' | 'both';
  onLanguageChange: (language: 'en' | 'fa' | 'both') => void;
}

const SearchLanguageSelector: React.FC<SearchLanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
}) => {
  const { language: uiLanguage } = useLanguage();

  const options = [
    { 
      value: 'both' as const, 
      label: uiLanguage === 'en' ? 'All Languages' : 'همه زبان‌ها', 
      icon: Globe 
    },
    { 
      value: 'en' as const, 
      label: uiLanguage === 'en' ? 'English Papers' : 'مقالات انگلیسی', 
      icon: Languages 
    },
    { 
      value: 'fa' as const, 
      label: uiLanguage === 'en' ? 'Farsi Papers' : 'مقالات فارسی', 
      icon: Languages 
    },
  ];

  return (
    <div className={`flex items-center gap-2 p-1 bg-muted rounded-lg ${uiLanguage === 'fa' ? 'farsi flex-row-reverse' : ''}`}>
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <Button
            key={option.value}
            variant="ghost"
            size="sm"
            className={`search-language-tab ${
              selectedLanguage === option.value ? 'active' : 'inactive'
            } ${uiLanguage === 'fa' ? 'farsi' : ''}`}
            onClick={() => onLanguageChange(option.value)}
          >
            <Icon className={`h-4 w-4 ${uiLanguage === 'fa' ? 'ml-2' : 'mr-2'}`} />
            {option.label}
          </Button>
        );
      })}
    </div>
  );
};

export default SearchLanguageSelector;