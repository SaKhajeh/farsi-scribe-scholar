
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Library, FileText, Settings } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

const Navigation: React.FC = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  
  return (
    <nav className="container mx-auto py-3">
      <ul className="flex justify-around items-center">
        {/* Papers Section */}
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
        
        {/* Libraries Section - Style differently */}
        <li>
          <NavLink 
            to="/libraries" 
            className={({ isActive }) => 
              `flex flex-col items-center text-xs ${
                isActive 
                  ? 'text-research-primary font-medium' 
                  : isAuthenticated 
                    ? 'text-research-dark' 
                    : 'text-gray-400'
              } ${!isAuthenticated ? 'pointer-events-none opacity-60' : ''}`
            }
          >
            <Library size={24} />
            <span className="mt-1">{t('nav.libraries')}</span>
          </NavLink>
        </li>
        
        {/* Literature Review - Protected */}
        <li>
          <NavLink 
            to="/literature" 
            className={({ isActive }) => 
              `flex flex-col items-center text-xs ${
                isActive 
                  ? 'text-research-primary font-medium' 
                  : isAuthenticated 
                    ? 'text-research-dark' 
                    : 'text-gray-400'
              } ${!isAuthenticated ? 'pointer-events-none opacity-60' : ''}`
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
