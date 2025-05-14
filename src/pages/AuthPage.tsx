
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();
  const { login, signup } = useAuth();
  const { toast } = useToast();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast({
          title: t('auth.loginSuccess'),
          description: t('auth.welcomeBack'),
        });
      } else {
        await signup(email, password, name);
        toast({
          title: t('auth.signupSuccess'),
          description: t('auth.accountCreated'),
        });
      }

      // Redirect after successful authentication
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    } catch (error) {
      toast({
        title: isLogin ? t('auth.loginFailed') : t('auth.signupFailed'),
        description: String(error) || t('auth.tryAgain'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`max-w-md mx-auto mt-12 p-8 rounded-lg shadow-md bg-white ${language === 'fa' ? 'farsi' : ''}`}>
      <h1 className={`text-2xl font-bold mb-6 text-center ${language === 'fa' ? 'farsi' : ''}`}>
        {isLogin ? t('auth.signIn') : t('auth.signUp')}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              {t('auth.name')}
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isLogin}
              dir={language === 'fa' ? 'rtl' : 'ltr'}
            />
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            {t('auth.email')}
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            dir={language === 'fa' ? 'rtl' : 'ltr'}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            {t('auth.password')}
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            dir={language === 'fa' ? 'rtl' : 'ltr'}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 
            t('auth.processing') : 
            isLogin ? t('auth.signIn') : t('auth.signUp')
          }
        </Button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-research-accent hover:underline text-sm"
        >
          {isLogin ? t('auth.needAccount') : t('auth.haveAccount')}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
