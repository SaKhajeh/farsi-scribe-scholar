
import React from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

export interface FilterOptions {
  yearRange: {
    start: string;
    end: string;
  };
  author: string;
  journal: string;
  hasFullText: boolean;
}

interface FilterBarProps {
  onChange: (filters: FilterOptions) => void;
  options: FilterOptions;
}

const FilterBar: React.FC<FilterBarProps> = ({ onChange, options }) => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleChange = (key: keyof FilterOptions, value: any) => {
    if (key === 'yearRange') {
      onChange({
        ...options,
        yearRange: { ...options.yearRange, ...value },
      });
    } else {
      onChange({
        ...options,
        [key]: value,
      });
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex justify-between items-center mb-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              {language === 'en' ? 'Advanced Search' : 'جستجوی پیشرفته'}
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className={`p-4 border rounded-md bg-card ${language === 'fa' ? 'farsi' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 text-sm">
                  {language === 'en' ? 'Year Range' : 'بازه سال'}
                </label>
                <div className="flex gap-2 items-center">
                  <Select
                    value={options.yearRange.start}
                    onValueChange={(value) => handleChange('yearRange', { start: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'en' ? 'From' : 'از'} />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={`start-${year}`} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span>-</span>
                  <Select
                    value={options.yearRange.end}
                    onValueChange={(value) => handleChange('yearRange', { end: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'en' ? 'To' : 'تا'} />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={`end-${year}`} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm">
                  {language === 'en' ? 'Author' : 'نویسنده'}
                </label>
                <Input
                  value={options.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                  className={language === 'fa' ? 'farsi' : ''}
                  placeholder={language === 'en' ? 'Author name' : 'نام نویسنده'}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 text-sm">
                  {language === 'en' ? 'Journal' : 'مجله'}
                </label>
                <Input
                  value={options.journal}
                  onChange={(e) => handleChange('journal', e.target.value)}
                  className={language === 'fa' ? 'farsi' : ''}
                  placeholder={language === 'en' ? 'Journal name' : 'نام مجله'}
                />
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="hasFullText"
                  checked={options.hasFullText}
                  onCheckedChange={(checked) => handleChange('hasFullText', checked === true)}
                />
                <label htmlFor="hasFullText" className="ml-2 text-sm">
                  {language === 'en' ? 'Has full text access' : 'دسترسی به متن کامل'}
                </label>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default FilterBar;
