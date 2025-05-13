
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from '@/context/LanguageContext';
import { getLibraries, createLibrary } from '@/services/paperService';
import { Library } from '@/types';
import LibraryCard from '@/components/LibraryCard';
import { toast } from "sonner";

const LibrariesPage: React.FC = () => {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLibraryName, setNewLibraryName] = useState('');
  const [open, setOpen] = useState(false);
  const { language, t } = useLanguage();
  
  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const data = await getLibraries();
        setLibraries(data);
      } catch (error) {
        console.error('Error fetching libraries:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLibraries();
  }, []);
  
  const handleCreateLibrary = async () => {
    if (!newLibraryName.trim()) return;
    
    try {
      const newLibrary = await createLibrary(newLibraryName);
      setLibraries([...libraries, newLibrary]);
      setNewLibraryName('');
      setOpen(false);
      toast.success(language === 'en' 
        ? "Library created successfully" 
        : "کتابخانه با موفقیت ایجاد شد");
    } catch (error) {
      console.error('Error creating library:', error);
      toast.error(language === 'en' 
        ? "Failed to create library" 
        : "ایجاد کتابخانه با مشکل مواجه شد");
    }
  };
  
  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{t('nav.libraries')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>{t('libraries.create')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {language === 'en' ? 'Create New Library' : 'ایجاد کتابخانه جدید'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder={language === 'en' ? 'Library name' : 'نام کتابخانه'}
                value={newLibraryName}
                onChange={(e) => setNewLibraryName(e.target.value)}
                className={language === 'fa' ? 'farsi' : ''}
              />
              <Button onClick={handleCreateLibrary}>
                {language === 'en' ? 'Create' : 'ایجاد'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {libraries.length > 0 ? (
        <div className="grid gap-4">
          {libraries.map((library) => (
            <LibraryCard key={library.id} library={library} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">
            {language === 'en'
              ? 'No libraries yet. Create your first library.'
              : 'هنوز کتابخانه‌ای وجود ندارد. اولین کتابخانه خود را ایجاد کنید.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default LibrariesPage;
