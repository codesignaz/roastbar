'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale } from '@/lib/supabase/types';
import { translations } from '@/lib/translations';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof translations)['az'];
  tLocale: <T extends Record<string, any>>(obj: T, fieldPrefix: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('az');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('roastbar_locale') as Locale;
      if (saved && (saved === 'az' || saved === 'en' || saved === 'ru')) {
        setLocaleState(saved);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('roastbar_locale', newLocale);
      document.documentElement.lang = newLocale;
    } catch (e) {
      // ignore
    }
  };

  // Helper to extract localized field like name_az, name_en, name_ru with fallback to az
  const tLocale = <T extends Record<string, any>>(obj: T, fieldPrefix: string): string => {
    if (!obj) return '';
    const localized = obj[`${fieldPrefix}_${locale}`];
    if (localized && typeof localized === 'string' && localized.trim()) {
      return localized;
    }
    // Fallback to Azerbaijani
    const azFallback = obj[`${fieldPrefix}_az`];
    if (azFallback && typeof azFallback === 'string') {
      return azFallback;
    }
    // Fallback to English
    const enFallback = obj[`${fieldPrefix}_en`];
    if (enFallback && typeof enFallback === 'string') {
      return enFallback;
    }
    return '';
  };

  const currentTranslations = translations[locale] || translations.az;

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        t: currentTranslations,
        tLocale,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
