'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Coffee, Phone, MapPin, Clock } from 'lucide-react';
import { InstagramIcon } from '@/components/common/InstagramIcon';
import { WhatsAppIcon } from '@/components/common/WhatsAppIcon';
import { BrandLogo } from '@/components/common/BrandLogo';
import { useSlogans } from '@/hooks/useSlogans';

export const Footer: React.FC = () => {
  const { t, locale } = useLanguage();
  const slogans = useSlogans();
  const shortDesc = slogans.shortDesc || t.brand.shortDesc;

  return (
    <footer className="bg-[#f6efe7] border-t border-[#ebdcd0] text-[#5c4a3e] pt-14 pb-24 md:pb-14 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <BrandLogo variant="compact" size="lg" className="mb-4" />
            <p className="text-xs sm:text-sm text-[#786455] max-w-sm leading-relaxed mb-4">
              {shortDesc}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/roastbarbaku"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white border border-[#ebdcd0] flex items-center justify-center text-[#8f5222] hover:text-[#b87333] hover:border-[#b87333] transition-colors shadow-2xs"
                aria-label="Instagram @roastbarbaku"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="tel:+994554490007"
                className="w-9 h-9 rounded-xl bg-white border border-[#ebdcd0] flex items-center justify-center text-[#8f5222] hover:text-[#b87333] hover:border-[#b87333] transition-colors shadow-2xs"
                aria-label="Phone RoastBar Baku"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/994554490007?text=Salam,%20RoastBar-la%20əlaqə%20saxlayıram"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white border border-[#ebdcd0] flex items-center justify-center hover:border-[#25D366] hover:scale-105 transition-all shadow-2xs"
                aria-label="WhatsApp RoastBar Baku"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#221710] font-bold mb-4">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/" className="hover:text-[#b87333] font-medium transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-[#b87333] font-medium transition-colors">
                  {t.nav.menu}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#b87333] font-medium transition-colors">
                  {t.nav.gallery}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#b87333] font-medium transition-colors">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Visit & Hours */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#221710] font-bold mb-4">
              {t.contact.title}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2 text-[#473425]">
                <MapPin className="w-4 h-4 text-[#b87333] flex-shrink-0 mt-0.5" />
                <span>{t.brand.address}</span>
              </li>
              <li className="flex items-start gap-2 text-[#473425]">
                <Clock className="w-4 h-4 text-[#b87333] flex-shrink-0 mt-0.5" />
                <span>{t.brand.hours}</span>
              </li>
              <li className="flex items-start gap-2 text-[#473425]">
                <Phone className="w-4 h-4 text-[#b87333] flex-shrink-0 mt-0.5" />
                <a href="tel:+994554490007" className="hover:text-[#b87333] font-semibold transition-colors">
                  {t.brand.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-[#ebdcd0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8c7768]">
          <p>{t.footer.copyright}</p>
          <p>
            {locale === 'en' ? (
              <>
                <span>Created by</span>{' '}
                <a
                  href="https://www.instagram.com/codesign.az"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#8f5222] hover:text-[#b87333] transition-colors underline underline-offset-2"
                >
                  codesign.az
                </a>
              </>
            ) : locale === 'ru' ? (
              <>
                <span>Создано</span>{' '}
                <a
                  href="https://www.instagram.com/codesign.az"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#8f5222] hover:text-[#b87333] transition-colors underline underline-offset-2"
                >
                  codesign.az
                </a>
              </>
            ) : (
              <>
                <a
                  href="https://www.instagram.com/codesign.az"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#8f5222] hover:text-[#b87333] transition-colors underline underline-offset-2"
                >
                  codesign.az
                </a>{' '}
                <span>tərəfindən yaradılmışdır</span>
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
};
