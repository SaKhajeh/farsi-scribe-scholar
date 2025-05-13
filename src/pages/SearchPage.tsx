
import React, { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import PaperCard from '@/components/PaperCard';
import { useLanguage } from '@/context/LanguageContext';
import { searchPapers } from '@/services/paperService';
import { Paper } from '@/types';

const SearchPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Paper[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { language } = useLanguage();
  
  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchPapers(query, language);
      setSearchResults(results.papers);
    } catch (error) {
      console.error('Error searching papers:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <SearchBar onSearch={handleSearch} />
      
      {isSearching ? (
        <div className="text-center py-10">
          <p>Searching...</p>
        </div>
      ) : (
        <>
          {searchResults.length > 0 ? (
            <div className="grid gap-4">
              {searchResults.map((paper) => (
                <PaperCard key={paper.id} paper={paper} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">
                {language === 'en' 
                  ? 'Search for papers in English or Farsi' 
                  : 'جستجوی مقالات به انگلیسی یا فارسی'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;
