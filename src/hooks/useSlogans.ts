'use client';

import { useState, useEffect } from 'react';
import { sloganService, LanguageSlogans, SupportedLocale, DEFAULT_MULTILINGUAL_SLOGANS } from '@/lib/sloganService';
import { useLanguage } from '@/context/LanguageContext';

export function useSlogans(customLocale?: SupportedLocale): LanguageSlogans {
  const { locale: contextLocale } = useLanguage();
  const activeLocale: SupportedLocale = (customLocale || contextLocale || 'az') as SupportedLocale;

  const [slogans, setSlogans] = useState<LanguageSlogans>(() => 
    DEFAULT_MULTILINGUAL_SLOGANS[activeLocale] || DEFAULT_MULTILINGUAL_SLOGANS.az
  );

  useEffect(() => {
    // Initial read in browser
    setSlogans(sloganService.getSlogansForLocale(activeLocale));

    const handleUpdate = () => {
      setSlogans(sloganService.getSlogansForLocale(activeLocale));
    };

    window.addEventListener('sloganschange', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('sloganschange', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [activeLocale]);

  return slogans;
}
