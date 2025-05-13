
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';

const SettingsPage: React.FC = () => {
  const { language } = useLanguage();
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        {language === 'en' ? 'Settings' : 'تنظیمات'}
      </h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            {language === 'en' ? 'Language' : 'زبان'}
          </label>
          <LanguageToggle />
        </div>
        
        {/* More settings can be added here */}
      </div>
    </div>
  );
};

export default SettingsPage;
