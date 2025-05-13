import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import { useLanguage } from '@/context/LanguageContext';
const Layout: React.FC = () => {
  const {
    language
  } = useLanguage();
  return <div className={`min-h-screen bg-research-light ${language === 'fa' ? 'farsi' : ''}`}>
      <header className="bg-research-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold">Paiper Research Assistant </h1>
        </div>
      </header>
      <main className="container mx-auto p-4 pb-24">
        <Outlet />
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <Navigation />
      </footer>
    </div>;
};
export default Layout;