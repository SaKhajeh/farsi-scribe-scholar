
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from '@/context/LanguageContext';
import { getLibraries, generateLiteratureReview } from '@/services/paperService';
import { Library, LiteratureReview } from '@/types';
import { toast } from "sonner";

const LiteratureReviewPage: React.FC = () => {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [selectedLibraryId, setSelectedLibraryId] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [review, setReview] = useState<LiteratureReview | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { language, t } = useLanguage();
  
  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const data = await getLibraries();
        setLibraries(data);
      } catch (error) {
        console.error('Error fetching libraries:', error);
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchLibraries();
  }, []);
  
  const handleGenerateReview = async () => {
    if (!selectedLibraryId) {
      toast.error(language === 'en' 
        ? "Please select a library" 
        : "لطفا یک کتابخانه انتخاب کنید");
      return;
    }
    
    const library = libraries.find(lib => lib.id === selectedLibraryId);
    if (!library || library.paperIds.length === 0) {
      toast.error(language === 'en' 
        ? "Selected library is empty" 
        : "کتابخانه انتخاب شده خالی است");
      return;
    }
    
    setLoading(true);
    try {
      const generatedReview = await generateLiteratureReview(
        library.paperIds,
        prompt,
        language
      );
      setReview(generatedReview);
      toast.success(language === 'en' 
        ? "Literature review generated" 
        : "مرور ادبیات تولید شد");
    } catch (error) {
      console.error('Error generating literature review:', error);
      toast.error(language === 'en' 
        ? "Failed to generate literature review" 
        : "تولید مرور ادبیات با مشکل مواجه شد");
    } finally {
      setLoading(false);
    }
  };
  
  if (initialLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">{t('nav.literature')}</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            {language === 'en' ? 'Select Library' : 'انتخاب کتابخانه'}
          </label>
          <Select
            value={selectedLibraryId}
            onValueChange={setSelectedLibraryId}
          >
            <SelectTrigger>
              <SelectValue placeholder={language === 'en' ? "Select a library" : "کتابخانه را انتخاب کنید"} />
            </SelectTrigger>
            <SelectContent>
              {libraries.map((library) => (
                <SelectItem key={library.id} value={library.id}>
                  {library.name} ({library.paperIds.length} papers)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            {language === 'en' ? 'Prompt (optional)' : 'پرامپت (اختیاری)'}
          </label>
          <Textarea
            placeholder={t('review.prompt')}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className={`min-h-[100px] ${language === 'fa' ? 'farsi' : ''}`}
          />
        </div>
        
        <Button 
          onClick={handleGenerateReview} 
          disabled={!selectedLibraryId || loading}
          className="w-full"
        >
          {loading ? 
            (language === 'en' ? 'Generating...' : 'در حال تولید...') : 
            t('review.generate')
          }
        </Button>
      </div>
      
      {review && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">{review.title}</h2>
          <div className={`bg-white p-6 rounded-lg shadow-sm mb-4 ${language === 'fa' ? 'farsi' : ''}`}>
            <Textarea
              value={review.content}
              onChange={(e) => setReview({...review, content: e.target.value})}
              className={`min-h-[300px] ${language === 'fa' ? 'farsi' : ''}`}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleGenerateReview}>
              {t('review.regenerate')}
            </Button>
            <Button variant="outline">
              {t('review.refine')}
            </Button>
            <Button variant="outline">
              {t('review.translate')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiteratureReviewPage;
