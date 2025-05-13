
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Library, FileText, Settings } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const Navigation: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <nav className="container mx-auto py-3">
      <ul className="flex justify-around items-center">
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex flex-col items-center text-xs ${
                isActive ? 'text-research-accent' : 'text-research-dark'
              }`
            }
          >
            <Search size={24} />
            <span className="mt-1">{t('nav.search')}</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/libraries" 
            className={({ isActive }) => 
              `flex flex-col items-center text-xs ${
                isActive ? 'text-research-accent' : 'text-research-dark'
              }`
            }
          >
            <Library size={24} />
            <span className="mt-1">{t('nav.libraries')}</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/literature" 
            className={({ isActive }) => 
              `flex flex-col items-center text-xs ${
                isActive ? 'text-research-accent' : 'text-research-dark'
              }`
            }
          >
            <FileText size={24} />
            <span className="mt-1">{t('nav.literature')}</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              `flex flex-col items-center text-xs ${
                isActive ? 'text-research-accent' : 'text-research-dark'
              }`
            }
          >
            <Settings size={24} />
            <span className="mt-1">{t('nav.settings')}</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
