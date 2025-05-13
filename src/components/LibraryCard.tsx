
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Library } from '@/types';
import { useNavigate } from 'react-router-dom';

interface LibraryCardProps {
  library: Library;
}

const LibraryCard: React.FC<LibraryCardProps> = ({ library }) => {
  const navigate = useNavigate();
  
  return (
    <Card 
      className="mb-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/libraries/${library.id}`)}
    >
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-2">{library.name}</h3>
        <p className="text-sm text-gray-600">
          {library.paperIds.length} papers
        </p>
      </CardContent>
      <CardFooter className="text-xs text-gray-500">
        <span>Created: {new Date(library.createdAt).toLocaleDateString()}</span>
      </CardFooter>
    </Card>
  );
};

export default LibraryCard;
