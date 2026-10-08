'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ExternalLink } from 'lucide-react';
import { InstagramIcon } from '@/components/common/InstagramIcon';
import { useSlogans } from '@/hooks/useSlogans';

export const InstagramSection: React.FC = () => {
  const { t } = useLanguage();
  const slogans = useSlogans();
  const title = slogans.instagramTitle || t.instagram.title;
  const subtitle = slogans.instagramSubtitle || t.instagram.subtitle;

  return (
    <section className="py-14 sm:py-20 bg-[#f9f6f1] relative overflow-hidden border-t border-[#ebdcd0]">
      {/* Ambient warm background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#e1306c]/5 via-[#b87333]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Header */}
        <div className="flex flex-col items-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#e1306c] font-bold mb-2">
            <InstagramIcon className="w-4 h-4" />
            <span>@roastbarbaku</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#221710]">
            {title}
          </h2>
          <p className="text-xs sm:text-base text-[#5c4a3e] max-w-lg mt-1 text-center">
            {subtitle}
          </p>
        </div>

        {/* Direct Instagram Embed Frame without scrollbar (instagram.com/roastbarbaku/embed) */}
        <div className="w-full max-w-lg mx-auto bg-white rounded-3xl border border-[#ebdcd0] p-2.5 sm:p-3.5 shadow-md overflow-hidden">
          <iframe
            title="RoastBar Baku Instagram Embed"
            src="https://www.instagram.com/roastbarbaku/embed"
            className="w-full h-[540px] sm:h-[580px] rounded-2xl border-0 bg-[#fdfbf7] overflow-hidden"
            scrolling="no"
            style={{ overflow: 'hidden' }}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            suppressHydrationWarning
          />
        </div>

        {/* Direct Open Action */}
        <div className="mt-6 flex justify-center">
          <a
            href="https://www.instagram.com/roastbarbaku"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#e1306c] via-[#fd1d1d] to-[#f77737] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#e1306c]/20 hover:opacity-95 transition-opacity cursor-pointer"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Instagram-da İzləyin (@roastbarbaku)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
