
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Paper } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';

interface PaperCardProps {
  paper: Paper;
}

const PaperCard: React.FC<PaperCardProps> = ({ paper }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <Card 
      className="mb-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/papers/${paper.id}`)}
    >
      <CardContent className="pt-6">
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
      </CardContent>
      <CardFooter className="text-xs text-gray-500 flex justify-between">
        <span>{paper.journal}</span>
        <span>{paper.year}</span>
      </CardFooter>
    </Card>
  );
};

export default PaperCard;
