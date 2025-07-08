
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import RichTextEditor from '@/components/RichTextEditor';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from '@/context/LanguageContext';
import { getLibraries, generateLiteratureReview, generatePromptBasedReview } from '@/services/paperService';
import { Library, LiteratureReview } from '@/types';
import { toast } from "sonner";
import { FileText, Plus } from 'lucide-react';

const LiteratureReviewPage: React.FC = () => {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [selectedLibraryId, setSelectedLibraryId] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [promptOnlyMode, setPromptOnlyMode] = useState<string>('');
  const [additionalPapers, setAdditionalPapers] = useState<string[]>([]);
  const [newPaperInput, setNewPaperInput] = useState<string>('');
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
  
  const handleGeneratePromptOnlyReview = async () => {
    if (!promptOnlyMode.trim()) {
      toast.error(language === 'en' 
        ? "Please enter a prompt" 
        : "لطفا یک پرامپت وارد کنید");
      return;
    }
    
    setLoading(true);
    try {
      const generatedReview = await generatePromptBasedReview(
        promptOnlyMode,
        additionalPapers,
        language
      );
      setReview(generatedReview);
      toast.success(language === 'en' 
        ? "Literature review generated" 
        : "مرور ادبیات تولید شد");
    } catch (error) {
      console.error('Error generating prompt-based review:', error);
      toast.error(language === 'en' 
        ? "Failed to generate literature review" 
        : "تولید مرور ادبیات با مشکل مواجه شد");
    } finally {
      setLoading(false);
    }
  };
  
  const addAdditionalPaper = () => {
    if (newPaperInput.trim()) {
      setAdditionalPapers([...additionalPapers, newPaperInput.trim()]);
      setNewPaperInput('');
    }
  };
  
  const removeAdditionalPaper = (index: number) => {
    const updatedPapers = [...additionalPapers];
    updatedPapers.splice(index, 1);
    setAdditionalPapers(updatedPapers);
  };
  
  if (initialLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">{t('nav.literature')}</h1>
      
      <Tabs defaultValue="library" className="mb-6">
        <TabsList className={`w-full ${language === 'fa' ? 'flex-row-reverse' : ''}`}>
          <TabsTrigger value="library" className="flex-1">
            {language === 'en' ? 'Generate from Library' : 'ایجاد از کتابخانه'}
          </TabsTrigger>
          <TabsTrigger value="prompt" className="flex-1">
            {language === 'en' ? 'Prompt-based Generation' : 'ایجاد بر اساس پرامپت'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="library" className="mt-4">
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
        </TabsContent>
        
        <TabsContent value="prompt" className="mt-4">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                {language === 'en' ? 'Research Topic or Question' : 'موضوع یا سؤال تحقیق'}
              </label>
              <Textarea
                placeholder={language === 'en' ? 
                  "Enter your research question or topic..." : 
                  "موضوع یا سؤال تحقیق خود را وارد کنید..."
                }
                value={promptOnlyMode}
                onChange={(e) => setPromptOnlyMode(e.target.value)}
                className={`min-h-[100px] ${language === 'fa' ? 'farsi' : ''}`}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                {language === 'en' ? 'Add Key Papers (optional)' : 'افزودن مقالات کلیدی (اختیاری)'}
              </label>
              
              <div className="flex mb-2">
                <Input
                  placeholder={language === 'en' ? 
                    "Enter paper title or DOI..." : 
                    "عنوان مقاله یا DOI را وارد کنید..."
                  }
                  value={newPaperInput}
                  onChange={(e) => setNewPaperInput(e.target.value)}
                  className={language === 'fa' ? 'farsi' : ''}
                />
                <Button 
                  variant="outline" 
                  onClick={addAdditionalPaper}
                  type="button"
                  className="ml-2"
                >
                  <Plus size={16} />
                </Button>
              </div>
              
              {additionalPapers.length > 0 && (
                <div className="mt-2 space-y-2">
                  {additionalPapers.map((paper, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                      <div className="flex items-center">
                        <FileText size={16} className="mr-2" />
                        <span>{paper}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeAdditionalPaper(index)}
                      >
                        {language === 'en' ? 'Remove' : 'حذف'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleGeneratePromptOnlyReview} 
              disabled={!promptOnlyMode.trim() || loading}
              className="w-full"
            >
              {loading ? 
                (language === 'en' ? 'Generating...' : 'در حال تولید...') : 
                (language === 'en' ? 'Generate Review' : 'ایجاد مرور')
              }
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      {review && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">{review.title}</h2>
          <div className={`bg-white rounded-lg shadow-sm mb-4 ${language === 'fa' ? 'farsi' : ''}`}>
            <RichTextEditor
              content={review.content}
              onChange={(content) => setReview({...review, content})}
              className="min-h-[400px]"
            />
          </div>
          <div className={`flex gap-2 ${language === 'fa' ? 'flex-row-reverse' : ''}`}>
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
