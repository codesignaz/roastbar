'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Locale } from '@/lib/supabase/types';
import { ChevronDown, Check, Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  compact?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ compact = false }) => {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Locale; name: string; short: string; flag: string }[] = [
    { code: 'az', name: 'Azərbaycan dili', short: 'AZE', flag: '🇦🇿' },
    { code: 'en', name: 'English', short: 'ENG', flag: '🇬🇧' },
    { code: 'ru', name: 'Русский', short: 'RUS', flag: '🇷🇺' },
  ];

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code: Locale) => {
    setLocale(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#faf5ee] border border-[#ebdcd0] text-[#2c1d11] shadow-sm hover:shadow transition-all duration-200 cursor-pointer ${
          isOpen ? 'ring-2 ring-[#b87333]/30 border-[#b87333]' : ''
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Dil seçimi / Language selector"
      >
        <span className="text-base leading-none">{currentLang.flag}</span>
        <span className="text-xs font-bold tracking-wide text-[#3d291a]">
          {currentLang.short}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#8c7768] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#b87333]' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Modal / Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-[#ebdcd0] shadow-xl shadow-[#784f29]/10 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 mb-1 border-b border-[#f4e9de] text-[10px] font-bold uppercase tracking-wider text-[#9e7d66] flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-[#b87333]" />
            <span>Dil seçimi / Language</span>
          </div>

          <div className="space-y-0.5">
            {languages.map((lang) => {
              const isSelected = locale === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#fbf3eb] text-[#9c5c28] font-bold'
                      : 'text-[#473425] hover:bg-[#f8f2eb] hover:text-[#221710]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-[#b87333] stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
