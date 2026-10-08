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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentThemeId, setCurrentThemeId] = useState<string>('latte');

  useEffect(() => {
    // Initial load from storage
    const savedId = themeService.getCurrentThemeId();
    setCurrentThemeId(savedId);
    themeService.applyTheme(savedId);

    // Handler for updates triggered in the app or other windows
    const handleThemeChange = () => {
      const updatedId = themeService.getCurrentThemeId();
      setCurrentThemeId(updatedId);
      themeService.applyTheme(updatedId);
    };

    window.addEventListener('themechange', handleThemeChange);
    window.addEventListener('storage', handleThemeChange);

    return () => {
      window.removeEventListener('themechange', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

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
