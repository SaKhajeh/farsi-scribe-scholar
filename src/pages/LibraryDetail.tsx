
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { getLibraries, getPaperById } from '@/services/paperService';
import { Library, Paper } from '@/types';
import PaperCard from '@/components/PaperCard';

const LibraryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [library, setLibrary] = useState<Library | null>(null);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  
  useEffect(() => {
    const fetchLibraryDetails = async () => {
      if (!id) return;
      
      try {
        const libraries = await getLibraries();
        const foundLibrary = libraries.find(lib => lib.id === id);
        
        if (foundLibrary) {
          setLibrary(foundLibrary);
          
          // Fetch all papers in this library
          const paperPromises = foundLibrary.paperIds.map(paperId => 
            getPaperById(paperId)
          );
          
          const paperResults = await Promise.all(paperPromises);
          const validPapers = paperResults.filter((p): p is Paper => p !== undefined);
          setPapers(validPapers);
        }
      } catch (error) {
        console.error('Error fetching library details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLibraryDetails();
  }, [id]);
  
  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }
  
  if (!library) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">
          {language === 'en' ? 'Library not found' : 'کتابخانه یافت نشد'}
        </p>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">{library.name}</h1>
      
      {papers.length > 0 ? (
        <div className="grid gap-4">
          {papers.map((paper) => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">
            {language === 'en'
              ? 'This library is empty. Add papers from the search page.'
              : 'این کتابخانه خالی است. از صفحه جستجو، مقالات را اضافه کنید.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default LibraryDetail;
