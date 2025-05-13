
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ListFilter } from 'lucide-react';

interface ResultsFilterProps {
  onSortChange: (value: string) => void;
  onYearFilterChange: (value: string) => void;
  totalResults: number;
}

const ResultsFilter: React.FC<ResultsFilterProps> = ({
  onSortChange,
  onYearFilterChange,
  totalResults,
}) => {
  const { language } = useLanguage();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center py-3 mb-4">
      <div className="mb-2 sm:mb-0">
        <p className="text-sm text-muted-foreground">
          {language === 'en' 
            ? `${totalResults} result${totalResults !== 1 ? 's' : ''}` 
            : `${totalResults} نتیجه`}
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <ListFilter className="h-4 w-4 mr-1" />
        <Select defaultValue="relevance" onValueChange={onSortChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={language === 'en' ? 'Sort by' : 'مرتب سازی'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">
              {language === 'en' ? 'Relevance' : 'ارتباط'}
            </SelectItem>
            <SelectItem value="newest">
              {language === 'en' ? 'Newest first' : 'جدیدترین'}
            </SelectItem>
            <SelectItem value="oldest">
              {language === 'en' ? 'Oldest first' : 'قدیمی‌ترین'}
            </SelectItem>
          </SelectContent>
        </Select>
        
        <Select defaultValue="all" onValueChange={onYearFilterChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder={language === 'en' ? 'Year' : 'سال'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {language === 'en' ? 'All years' : 'همه سال‌ها'}
            </SelectItem>
            {[0, 1, 2, 3, 4, 5].map(yearOffset => {
              const year = new Date().getFullYear() - yearOffset;
              return (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ResultsFilter;
