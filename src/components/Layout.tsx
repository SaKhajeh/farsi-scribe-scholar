
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import AuthButton from './AuthButton';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '@/context/LanguageContext';

const Layout: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const handleTitleClick = () => {
    navigate('/');
  };
  
  return (
    <div className={`min-h-screen bg-background ${language === 'fa' ? 'farsi font-farsi' : ''}`}>
      <header className="academic-hero border-b border-border sticky top-0 z-50 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4">
          <div className={`flex justify-between items-center ${language === 'fa' ? 'flex-row-reverse' : ''}`}>
            <button 
              onClick={handleTitleClick} 
              className={`text-2xl font-serif font-bold text-primary hover:text-accent transition-colors ${language === 'fa' ? 'farsi font-farsi' : ''}`}
            >
              {language === 'en' 
                ? "Paiper Research Assistant"
                : "پایپر: دستیار پژوهشی"}
            </button>
            <div className={`flex items-center gap-4 ${language === 'fa' ? 'flex-row-reverse' : ''}`}>
              <LanguageToggle />
              <AuthButton />
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8 pb-24">
        <Outlet />
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border">
        <Navigation />
      </footer>
    </div>
  );
};

export default Layout;
