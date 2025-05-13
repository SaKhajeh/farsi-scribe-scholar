import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import FilterBar, { FilterOptions } from '@/components/FilterBar';
import ResultsFilter from '@/components/ResultsFilter';
import PaperCard from '@/components/PaperCard';
import { useLanguage } from '@/context/LanguageContext';
import { searchPapers } from '@/services/paperService';
import { Paper } from '@/types';

const SearchPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Paper[]>([]);
  const [filteredResults, setFilteredResults] = useState<Paper[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { language } = useLanguage();
  
  const [sortOrder, setSortOrder] = useState('relevance');
  const [yearFilter, setYearFilter] = useState('all');
  
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    yearRange: {
      start: '',
      end: ''
    },
    author: '',
    journal: '',
    hasFullText: false
  });
  
  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    try {
      const results = await searchPapers(query, language);
      setSearchResults(results.papers);
    } catch (error) {
      console.error('Error searching papers:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilterOptions(newFilters);
  };
  
  const handleSortChange = (value: string) => {
    setSortOrder(value);
  };
  
  const handleYearFilterChange = (value: string) => {
    setYearFilter(value);
  };
  
  // Apply filters and sort to search results
  useEffect(() => {
    if (searchResults.length === 0) {
      setFilteredResults([]);
      return;
    }
    
    let results = [...searchResults];
    
    // Apply author filter
    if (filterOptions.author) {
      const authorLower = filterOptions.author.toLowerCase();
      results = results.filter(paper => 
        paper.authors.some(author => author.toLowerCase().includes(authorLower))
      );
    }
    
    // Apply journal filter
    if (filterOptions.journal) {
      const journalLower = filterOptions.journal.toLowerCase();
      results = results.filter(paper => 
        paper.journal?.toLowerCase().includes(journalLower)
      );
    }
    
    // Apply year range filter
    if (filterOptions.yearRange.start && filterOptions.yearRange.end) {
      const startYear = parseInt(filterOptions.yearRange.start);
      const endYear = parseInt(filterOptions.yearRange.end);
      
      results = results.filter(paper => 
        paper.year >= startYear && paper.year <= endYear
      );
    }
    
    // Apply year filter (post-search)
    if (yearFilter !== 'all') {
      const filterYear = parseInt(yearFilter);
      results = results.filter(paper => paper.year === filterYear);
    }
    
    // Apply sorting
    if (sortOrder === 'newest') {
      results.sort((a, b) => b.year - a.year);
    } else if (sortOrder === 'oldest') {
      results.sort((a, b) => a.year - b.year);
    }
    // For 'relevance', keep the order returned by the API
    
    setFilteredResults(results);
  }, [searchResults, filterOptions, sortOrder, yearFilter]);
  
  return (
    <div className="max-w-3xl mx-auto">
      <SearchBar onSearch={handleSearch} />
      <FilterBar options={filterOptions} onChange={handleFilterChange} />
      
      {isSearching ? (
        <div className="text-center py-10">
          <p>{language === 'en' ? 'Searching...' : 'در حال جستجو...'}</p>
        </div>
      ) : (
        <>
          {hasSearched && (
            <>
              {filteredResults.length > 0 ? (
                <>
                  <ResultsFilter 
                    onSortChange={handleSortChange}
                    onYearFilterChange={handleYearFilterChange}
                    totalResults={filteredResults.length}
                  />
                  <div className="grid gap-4">
                    {filteredResults.map((paper) => (
                      <PaperCard key={paper.id} paper={paper} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">
                    {language === 'en' 
                      ? 'No results found. Try different search terms or filters.' 
                      : 'نتیجه‌ای یافت نشد. از عبارات جستجو یا فیلترهای دیگری استفاده کنید.'}
                  </p>
                </div>
              )}
            </>
          )}
          
          {!hasSearched && (
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
