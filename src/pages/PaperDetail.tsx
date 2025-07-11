
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { getPaperById, getLibraries, addPaperToLibrary } from '@/services/paperService';
import { Paper, Library } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Copy, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaperDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [libraries, setLibraries] = useState<Library[]>([]);
  const { language, t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchPaper = async () => {
      if (!id) return;
      
      try {
        const paperData = await getPaperById(id);
        if (paperData) {
          setPaper(paperData);
        }
        
        if (isAuthenticated) {
          const librariesData = await getLibraries();
          setLibraries(librariesData);
        }
      } catch (error) {
        console.error('Error fetching paper:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaper();
  }, [id, isAuthenticated]);
  
  const handleAddToLibrary = async (libraryId: string) => {
    if (!id || !isAuthenticated) return;
    
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
  
  // Format citations in different styles
  const formatCitation = (style: 'apa' | 'mla' | 'ieee') => {
    if (!paper) return '';
    
    const authors = paper.authors.join(', ');
    const title = paper.title.en || paper.title.fa;
    const year = paper.year;
    const journal = paper.journal || '';
    const doi = paper.doi ? `DOI: ${paper.doi}` : '';
    
    switch (style) {
      case 'apa':
        return `${authors}. (${year}). ${title}. ${journal}. ${doi}`;
      case 'mla':
        return `${authors}. "${title}." ${journal}, ${year}. ${doi}`;
      case 'ieee':
        return `${authors}, "${title}," ${journal}, ${year}. ${doi}`;
      default:
        return `${authors}. (${year}). ${title}. ${journal}. ${doi}`;
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
  
  const renderAuthRequiredButton = (children: React.ReactNode, tooltipText: string) => {
    if (isAuthenticated) {
      return children;
    }
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" disabled>
              {tooltipText}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{language === 'en' ? 'Please sign in to access this feature' : 'لطفا برای دسترسی به این امکان وارد شوید'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
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
      <div className="flex justify-between items-start mb-2">
        <h1 className="text-2xl font-semibold">{paper.title[language]}</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Copy size={16} className="mr-2" />
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
        {renderAuthRequiredButton(
          <Button 
            variant="outline"
            onClick={() => navigate(`/chat-pdf?paperId=${paper.id}`)}
          >
            <MessageSquare size={16} className="mr-2" />
            {t('paper.chat')}
          </Button>,
          t('paper.chat')
        )}
        
        {renderAuthRequiredButton(
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                {t('paper.addToLibrary')}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
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
          </Dialog>,
          t('paper.addToLibrary')
        )}
      </div>
      
      <Tabs defaultValue="abstract" className="mb-6">
        <TabsList className={language === 'fa' ? 'flex-row-reverse' : ''}>
          <TabsTrigger value="abstract">{t('paper.abstract')}</TabsTrigger>
          <TabsTrigger value="summary" disabled={!isAuthenticated}>{t('paper.aiSummary')}</TabsTrigger>
        </TabsList>
        <TabsContent value="abstract" className="mt-4">
          <div className={`bg-white p-4 rounded-md shadow ${language === 'fa' ? 'farsi' : ''}`}>
            <p>{paper.abstract[language]}</p>
          </div>
        </TabsContent>
        <TabsContent value="summary" className="mt-4">
          <div className={`bg-white p-4 rounded-md shadow ${language === 'fa' ? 'farsi' : ''}`}>
            {isAuthenticated ? (
              <p>{paper.aiSummary?.[language]}</p>
            ) : (
              <p className="text-center text-gray-500">
                {language === 'en' 
                  ? 'Please sign in to view AI summary' 
                  : 'لطفا برای مشاهده خلاصه هوش مصنوعی وارد شوید'}
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaperDetail;
