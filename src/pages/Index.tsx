
import SearchPage from './SearchPage';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  return (
    <>
      {!isAuthenticated && (
        <div className={`mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200 ${language === 'fa' ? 'farsi text-right' : ''}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {t('auth.welcomeMessage')}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {t('auth.loginToAccess')}
              </p>
            </div>
            <Button 
              onClick={() => navigate('/auth')}
              className="flex items-center gap-2"
            >
              <LogIn size={16} />
              <span>{t('auth.getStarted')}</span>
            </Button>
          </div>
        </div>
      )}
      <SearchPage />
    </>
  );
};

export default Index;
