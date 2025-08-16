import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import i18n from '../i18n';

const supportedLanguages = [
  { code: 'zh', name: '繁體中文', flag: '🇹🇼' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  supportedLanguages: typeof supportedLanguages;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('zh');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 初始化語言
  useEffect(() => {
    const initLanguage = i18n.language || 'zh';
    setCurrentLanguage(initLanguage);
    document.documentElement.lang = initLanguage;
  }, []);

  const changeLanguage = async (lang: string) => {
    if (lang === currentLanguage) return;
    
    setIsLoading(true);
    try {
      await i18n.changeLanguage(lang);
      setCurrentLanguage(lang);
      document.documentElement.lang = lang;
      localStorage.setItem('i18nextLng', lang);
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: LanguageContextType = {
    currentLanguage,
    changeLanguage,
    supportedLanguages,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useCurrentLanguageInfo = () => {
  const { currentLanguage } = useLanguage();
  const languageInfo = supportedLanguages.find(lang => lang.code === currentLanguage);
  return languageInfo || supportedLanguages[0];
};