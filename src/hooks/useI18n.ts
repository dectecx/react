import { useState, useEffect } from 'react';
import { i18n } from '../services/i18n';

type Language = 'zh-TW' | 'en-US';

export const useI18n = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(i18n.getCurrentLanguage());

  useEffect(() => {
    const unsubscribe = i18n.subscribe((language) => {
      setCurrentLanguage(language);
    });

    return unsubscribe;
  }, []);

  const t = (key: keyof import('../services/i18n').Translations, params?: Record<string, string | number>) => {
    return i18n.t(key, params);
  };

  const changeLanguage = (language: Language) => {
    i18n.setLanguage(language);
  };

  return {
    t,
    currentLanguage,
    changeLanguage,
  };
};
