'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemePreset, THEME_PRESETS } from '@/lib/themePresets';
import { themeService } from '@/lib/themeService';

interface ThemeContextType {
  currentThemeId: string;
  currentTheme: ThemePreset;
  presets: ThemePreset[];
  setTheme: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialThemeId?: string;
}

export function ThemeProvider({ children, initialThemeId = 'latte' }: ThemeProviderProps) {
  const [currentThemeId, setCurrentThemeId] = useState<string>(initialThemeId);

  useEffect(() => {
    // 1. Initial check: local storage or initialThemeId from server
    const localId = themeService.getCurrentThemeId();
    const effective = localId || initialThemeId;
    setCurrentThemeId(effective);
    themeService.applyTheme(effective);

    // 2. Fetch the latest server-defined global default theme
    const syncWithServer = async () => {
      const serverTheme = await themeService.fetchServerThemeId();
      if (serverTheme) {
        setCurrentThemeId(serverTheme);
        themeService.saveLocalOnly(serverTheme);
        themeService.applyTheme(serverTheme);
      }
    };

    syncWithServer();

    // 3. Re-sync when tab gains focus or user switches back to browser
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        syncWithServer();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', syncWithServer);

    // 4. Periodic polling every 8s so phones & other computers pick up changes automatically
    const pollInterval = setInterval(syncWithServer, 8000);

    // 5. Handler for updates triggered in the app or other local windows
    const handleThemeChange = () => {
      const updatedId = themeService.getCurrentThemeId();
      setCurrentThemeId(updatedId);
      themeService.applyTheme(updatedId);
    };

    window.addEventListener('themechange', handleThemeChange);
    window.addEventListener('storage', handleThemeChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', syncWithServer);
      clearInterval(pollInterval);
      window.removeEventListener('themechange', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, [initialThemeId]);

  const setTheme = (themeId: string) => {
    setCurrentThemeId(themeId);
    themeService.saveTheme(themeId);
  };

  const currentTheme =
    THEME_PRESETS.find((p) => p.id === currentThemeId) || THEME_PRESETS[0];

  return (
    <ThemeContext.Provider
      value={{
        currentThemeId,
        currentTheme,
        presets: THEME_PRESETS,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
