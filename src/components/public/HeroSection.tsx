'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useSlogans } from '@/hooks/useSlogans';
import { Coffee, MapPin, Clock, ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const slogans = useSlogans();

  const badgeText = slogans.heroBadge || t.hero.badge;
  const titleText = slogans.heroTitle || t.hero.title;
  const subtitleText = slogans.heroSubtitle || t.hero.subtitle;
  const viewMenuText = slogans.heroViewMenuBtn || t.hero.viewMenu;
  const visitUsText = slogans.heroVisitUsBtn || t.hero.visitUs;

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-[#fdfbf7] via-[#f7f1e8] to-[#fdfbf7]">
      {/* Background with soft, warm cafe atmosphere */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=2000&q=85"
          alt="RoastBar Baku Interior Ambiance"
          className="w-full h-full object-cover object-center filter saturate-150"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#fdfbf7] via-transparent to-[#fdfbf7]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center flex flex-col items-center">
        {/* Boutique Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#ebdcd0] shadow-sm mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#b87333] animate-ping" />
          <span className="text-xs font-bold tracking-wider uppercase text-[#8f5222]">
            {badgeText}
          </span>
          <span className="text-[#c4b3a4]">•</span>
          <span className="text-xs text-[#5c4a3e] font-semibold">Baku, Azerbaijan</span>
        </div>

        {/* Main Title */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#221710] leading-[1.15] tracking-tight max-w-4xl text-balance">
          {titleText}
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-lg text-[#5c4a3e] max-w-2xl font-normal leading-relaxed">
          {subtitleText}
        </p>

        {/* Quick Highlights Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-[#473425]">
          <div className="flex items-center gap-2 bg-white/90 border border-[#ebdcd0] px-3.5 py-2 rounded-xl shadow-2xs">
            <Clock className="w-4 h-4 text-[#b87333]" />
            <span className="font-semibold">08:00 – 00:30</span>
          </div>
          <div className="flex items-center gap-2 bg-white/90 border border-[#ebdcd0] px-3.5 py-2 rounded-xl shadow-2xs">
            <MapPin className="w-4 h-4 text-[#b87333]" />
            <span className="font-medium">Şihali Qurbanov (Fizuli) 2/15</span>
          </div>
          <div className="flex items-center gap-2 bg-white/90 border border-[#ebdcd0] px-3.5 py-2 rounded-xl shadow-2xs">
            <Coffee className="w-4 h-4 text-[#b87333]" />
            <span className="font-medium">100% Arabica Specialty</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md">
          <Link
            href="/menu"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#b87333] to-[#9c5c28] text-white font-bold text-sm tracking-wide shadow-md shadow-[#b87333]/25 hover:from-[#c78242] hover:to-[#a9662f] transition-all transform active:scale-95"
          >
            <Coffee className="w-4 h-4" />
            <span>{viewMenuText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/contact"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-white hover:bg-[#faf5ee] text-[#221710] border border-[#ebdcd0] font-bold text-sm transition-all shadow-2xs active:scale-95"
          >
            <MapPin className="w-4 h-4 text-[#b87333]" />
            <span>{visitUsText}</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
