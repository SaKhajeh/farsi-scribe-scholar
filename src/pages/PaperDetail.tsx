
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/context/LanguageContext';
import { getPaperById, getLibraries, addPaperToLibrary } from '@/services/paperService';
import { Paper, Library } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const PaperDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [libraries, setLibraries] = useState<Library[]>([]);
  const { language, t } = useLanguage();
  
  useEffect(() => {
    const fetchPaper = async () => {
      if (!id) return;
      
      try {
        const paperData = await getPaperById(id);
        if (paperData) {
          setPaper(paperData);
        }
        const librariesData = await getLibraries();
        setLibraries(librariesData);
      } catch (error) {
        console.error('Error fetching paper:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaper();
  }, [id]);
  
  const handleAddToLibrary = async (libraryId: string) => {
    if (!id) return;
    
    try {
      const success = await addPaperToLibrary(libraryId, id);
      if (success) {
        toast.success(language === 'en' 
          ? "Paper added to library successfully" 
          : "مقاله با موفقیت به کتابخانه اضافه شد");
      }
    } catch (error) {
      console.error('Error adding paper to library:', error);
      toast.error(language === 'en' 
        ? "Failed to add paper to library" 
        : "افزودن مقاله به کتابخانه با مشکل مواجه شد");
    }
  };
  
  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }
  
  if (!paper) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Paper not found</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">{paper.title[language]}</h1>
      {language === 'en' && (
        <p className="text-gray-600 mb-4 farsi">{paper.title.fa}</p>
      )}
      {language === 'fa' && (
        <p className="text-gray-600 mb-4" dir="ltr">{paper.title.en}</p>
      )}
      
      <p className="text-lg mb-6">
        {paper.authors.join(', ')} • {paper.year} • {paper.journal}
      </p>
      
      <div className={`flex gap-2 mb-6 ${language === 'fa' ? 'flex-row-reverse' : ''}`}>
        <Button variant="outline">
          {t('paper.chat')}
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              {t('paper.addToLibrary')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{language === 'en' ? 'Select a Library' : 'کتابخانه را انتخاب کنید'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {libraries.map((library) => (
                <Button 
                  key={library.id} 
                  variant="outline" 
                  onClick={() => handleAddToLibrary(library.id)}
                >
                  {library.name}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="abstract" className="mb-6">
        <TabsList className={language === 'fa' ? 'flex-row-reverse' : ''}>
          <TabsTrigger value="abstract">{t('paper.abstract')}</TabsTrigger>
          <TabsTrigger value="summary">{t('paper.aiSummary')}</TabsTrigger>
        </TabsList>
        <TabsContent value="abstract" className="mt-4">
          <div className={`bg-white p-4 rounded-md shadow ${language === 'fa' ? 'farsi' : ''}`}>
            <p>{paper.abstract[language]}</p>
          </div>
        </TabsContent>
        <TabsContent value="summary" className="mt-4">
          <div className={`bg-white p-4 rounded-md shadow ${language === 'fa' ? 'farsi' : ''}`}>
            <p>{paper.aiSummary?.[language]}</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaperDetail;
