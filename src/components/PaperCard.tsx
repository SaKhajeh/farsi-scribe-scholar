
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Paper } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface PaperCardProps {
  paper: Paper;
}

const PaperCard: React.FC<PaperCardProps> = ({ paper }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  // Format citations in different styles
  const formatCitation = (style: 'apa' | 'mla' | 'ieee') => {
    const authors = paper.authors.join(', ');
    const title = paper.title.en || paper.title.fa;
    const year = paper.year;
    const journal = paper.journal || '';
    
    switch (style) {
      case 'apa':
        return `${authors}. (${year}). ${title}. ${journal}.`;
      case 'mla':
        return `${authors}. "${title}." ${journal}, ${year}.`;
      case 'ieee':
        return `${authors}, "${title}," ${journal}, ${year}.`;
      default:
        return `${authors}. (${year}). ${title}. ${journal}.`;
    }
  };
  
  const copyToClipboard = (style: 'apa' | 'mla' | 'ieee') => {
    const citation = formatCitation(style);
    navigator.clipboard.writeText(citation).then(() => {
      toast.success(language === 'en' 
        ? `${style.toUpperCase()} citation copied` 
        : `نقل قول ${style.toUpperCase()} کپی شد`);
    });
  };
  
  return (
    <Card 
      className="mb-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={(e) => {
        // Prevent navigation when clicking on the citation button
        if ((e.target as HTMLElement).closest('.citation-dropdown')) {
          e.stopPropagation();
          return;
        }
        navigate(`/papers/${paper.id}`);
      }}
    >
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {paper.title[language]}
            </h3>
            {language === 'en' && paper.title.fa && (
              <p className="text-sm text-gray-500 mb-2 farsi">
                {paper.title.fa}
              </p>
            )}
            {language === 'fa' && paper.title.en && (
              <p className="text-sm text-gray-500 mb-2" dir="ltr">
                {paper.title.en}
              </p>
            )}
            <p className="text-sm text-gray-600">
              {paper.authors.join(', ')}
            </p>
          </div>
          <div className="citation-dropdown" onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Copy size={14} className="mr-1" />
                  {language === 'en' ? 'Cite' : 'استناد'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => copyToClipboard('apa')}>
                  APA
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => copyToClipboard('mla')}>
                  MLA
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => copyToClipboard('ieee')}>
                  IEEE
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-gray-500 flex justify-between">
        <span>{paper.journal}</span>
        <span>{paper.year}</span>
      </CardFooter>
    </Card>
  );
};

export default PaperCard;
