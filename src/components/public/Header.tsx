'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { BrandLogo } from '@/components/common/BrandLogo';
import { WhatsAppIcon } from '@/components/common/WhatsAppIcon';
import { Coffee, MapPin, Phone, Clock, Menu as MenuIcon, X } from 'lucide-react';

export const Header: React.FC = () => {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpenNow, setIsOpenNow] = useState(true);

  // Check if currently open (08:00 - 00:30 Baku Time UTC+4)
  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const bakuDate = new Date(utc + 3600000 * 4);
      const hours = bakuDate.getHours();
      const minutes = bakuDate.getMinutes();
      const timeNum = hours + minutes / 60;
      const isClosed = timeNum >= 0.5 && timeNum < 8.0;
      setIsOpenNow(!isClosed);
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/menu', label: t.nav.menu },
    { href: '/gallery', label: t.nav.gallery },
    { href: '/contact', label: t.nav.contact },
  ];

  return (
    <>
      {/* Top Banner Bar for Operating Hours, Location & Quick Contacts */}
      <div className="bg-[#f6efe7] border-b border-[#ebdcd0] text-[11px] sm:text-xs text-[#5c4738] py-2 px-3 sm:px-4 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Open/Closed Status, Hours, & Address */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex items-center gap-1.5 font-medium">
              <span
                className={`w-2 h-2 rounded-full inline-block animate-pulse shrink-0 ${
                  isOpenNow ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-600'
                }`}
              />
              <span className={`font-semibold shrink-0 ${isOpenNow ? 'text-emerald-700' : 'text-amber-800'}`}>
                {isOpenNow ? t.brand.openNow : t.brand.closedNow}
              </span>
              <span className="text-[#c4b3a4] shrink-0">•</span>
              <span className="inline-flex items-center gap-1 text-[#6a5444] shrink-0">
                <Clock className="w-3 h-3 text-[#b87333] shrink-0" />
                <span>{isOpenNow ? '08:00 – 00:30' : 'Açılış: 08:00 (Hər gün: 08:00 – 00:30)'}</span>
              </span>
              <span className="hidden lg:inline-flex items-center gap-1.5 text-[#6a5444]">
                <span className="text-[#c4b3a4]">•</span>
                <MapPin className="w-3 h-3 text-[#b87333] shrink-0" />
                <span>Şihali Qurbanov 2/15</span>
              </span>
            </div>
          </div>

          {/* Right: Quick WhatsApp & Direct Call */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <a
              href="https://wa.me/994554490007?text=Salam,%20RoastBar-la%20əlaqə%20saxlayıram"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-[#1b7a37] hover:text-[#25D366] font-semibold transition-colors"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
            <span className="hidden sm:inline text-[#ebdcd0]">|</span>
            <a
              href="tel:+994554490007"
              className="flex items-center gap-1.5 text-[#8f5222] hover:text-[#b87333] font-semibold transition-colors"
            >
              <Phone className="w-3 h-3 text-[#b87333]" />
              <span className="tracking-wide">+994 55 449 00 07</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-[#ebdcd0] shadow-sm py-2'
            : 'bg-[#fdfbf7]/90 backdrop-blur-md border-b border-[#ebdcd0]/70 py-2.5 sm:py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Brand Logo (Configurable via src/config/brandConfig.ts) */}
          <BrandLogo variant="full" size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-wide transition-all relative py-1 ${
                    isActive
                      ? 'text-[#b87333] font-bold'
                      : 'text-[#5c4a3e] hover:text-[#221710] font-medium'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b87333] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Language Switcher (Dropdown) & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <LanguageSwitcher />

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white border border-[#ebdcd0] text-[#5c4a3e] hover:text-[#221710] shadow-sm cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/98 border-b border-[#ebdcd0] shadow-xl px-6 py-4 animate-in slide-in-from-top-3 duration-200">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`py-2.5 px-3.5 rounded-xl text-base font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#fbf3eb] text-[#9c5c28]'
                        : 'text-[#473425] hover:bg-[#faf5ee]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="pt-3 mt-1 border-t border-[#f4e9de] flex flex-col gap-2.5">
                <a
                  href="https://maps.google.com/?q=9RGM%2BC6+Baku"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-[#6e5c50] py-1 font-medium"
                >
                  <MapPin className="w-4 h-4 text-[#b87333]" />
                  <span>Şihali Qurbanov (Fizuli) 2/15</span>
                </a>
                <a
                  href="tel:+994554490007"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#b87333] to-[#9c5c28] text-white font-bold text-sm shadow-md"
                >
                  <Phone className="w-4 h-4" />
                  {t.nav.callUs} (+994 55 449 00 07)
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
