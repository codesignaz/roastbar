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

    // Sync with central server database
    sloganService.syncWithServer().then(() => {
      setSlogans(sloganService.getSlogansForLocale(activeLocale));
    });

    const handleUpdate = () => {
      setSlogans(sloganService.getSlogansForLocale(activeLocale));
    };

    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        sloganService.syncWithServer().then(() => {
          setSlogans(sloganService.getSlogansForLocale(activeLocale));
        });
      }
    };

    window.addEventListener('sloganschange', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    const pollInterval = setInterval(() => {
      sloganService.syncWithServer().then(() => {
        setSlogans(sloganService.getSlogansForLocale(activeLocale));
      });
    }, 10000);

    return () => {
      window.removeEventListener('sloganschange', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
      clearInterval(pollInterval);
    };
  }, [activeLocale]);

  return slogans;
}
