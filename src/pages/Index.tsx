
import SearchPage from './SearchPage';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { language } = useLanguage();

  return (
    <>
      <SearchPage />
    </>
  );
};

export default Index;
