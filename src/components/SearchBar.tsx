
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import SearchLanguageSelector from './SearchLanguageSelector';

interface SearchBarProps {
  onSearch: (query: string, searchLanguage?: 'en' | 'fa' | 'both') => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [searchLanguage, setSearchLanguage] = useState<'en' | 'fa' | 'both'>('both');
  const { t, language } = useLanguage();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, searchLanguage);
  };
  
  return (
    <div className={`space-y-4 ${language === 'fa' ? 'farsi' : ''}`}>
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="academic-card p-6">
          <div className={`flex gap-3 ${language === 'fa' ? 'flex-row-reverse' : ''}`}>
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder={t('search.placeholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={`pl-4 pr-12 h-12 text-lg border-0 bg-background/50 backdrop-blur-sm focus:bg-background transition-all ${language === 'fa' ? 'farsi text-right' : ''}`}
              />
              <Sparkles className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground ${language === 'fa' ? 'left-4' : 'right-4'}`} />
            </div>
            <Button 
              type="submit" 
              size="lg"
              className="px-8 h-12 font-medium"
            >
              <Search className={`h-5 w-5 ${language === 'fa' ? 'ml-2' : 'mr-2'}`} />
              {language === 'en' ? 'Search' : 'جستجو'}
            </Button>
          </div>
          
          <div className={`mt-4 flex justify-between items-center ${language === 'fa' ? 'flex-row-reverse' : ''}`}>
            <SearchLanguageSelector
              selectedLanguage={searchLanguage}
              onLanguageChange={setSearchLanguage}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
