'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useSlogans } from '@/hooks/useSlogans';
import { Product } from '@/lib/supabase/types';
import { dataService } from '@/lib/dataService';
import { Sparkles, ArrowRight, Tag, Coffee } from 'lucide-react';

export const FeaturedBanner: React.FC = () => {
  const { t, tLocale } = useLanguage();
  const slogans = useSlogans();
  const featuredBadge = slogans.featuredBannerBadge || t.featured.badge;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const item = await dataService.getFeaturedProduct();
        setProduct(item);
      } catch (err) {
        console.error('Failed to load featured product:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-[#fbf5ee] border-b border-[#ebdcd0] animate-pulse py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-[#eee1d3]" />
          <div className="flex-1 space-y-3 w-full">
            <div className="h-5 w-40 bg-[#eee1d3] rounded" />
            <div className="h-8 w-3/4 bg-[#eee1d3] rounded" />
            <div className="h-4 w-full bg-[#eee1d3] rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const name = tLocale(product, 'name');
  const description = tLocale(product, 'description');

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#fdf7f0] via-[#f8ede0] to-[#f3e5d3] border-b border-[#ebdcd0] shadow-sm">
      {/* Subtle ambient warm blur */}
      <div className="absolute top-0 right-1/4 -mt-10 w-80 h-80 bg-[#b87333]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-60 h-60 bg-[#e0a875]/15 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 md:gap-8">
          {/* Left: Thumbnail & Badges */}
          <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto">
            <div className="relative flex-shrink-0 group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#b87333]/30 shadow-md bg-white relative">
                <img
                  src={product.image_url}
                  alt={name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Sparkle badge */}
              <div className="absolute -top-2 -left-2 bg-gradient-to-r from-[#b87333] to-[#9c5c28] text-white p-1.5 rounded-full shadow-md">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>

            {/* Content Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-[#b87333]/15 text-[#8f5222] border border-[#b87333]/25">
                  <Coffee className="w-3 h-3 text-[#b87333]" />
                  {featuredBadge}
                </span>

                {product.tags && product.tags.slice(0, 2).map((tag, i) => (
                  <span
                    key={i}
                    className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-white/80 text-[#6e5c50] border border-[#ebdcd0]"
                  >
                    <Tag className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
              </div>

              <h2 className="font-serif text-lg sm:text-2xl font-bold text-[#221710] leading-tight truncate">
                {name}
              </h2>

              <p className="text-xs sm:text-sm text-[#5c4a3e] line-clamp-2 mt-1 max-w-2xl font-normal leading-relaxed">
                {description}
              </p>

              {/* Sizes and Price preview */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
                <div className="text-[#9c5c28] font-extrabold text-base sm:text-lg">
                  {product.base_price.toFixed(2)} ₼
                </div>

                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-[#6e5c50]">
                    <span className="text-[#c4b3a4]">•</span>
                    <span className="text-[11px] font-medium">{t.featured.exploreSizes}</span>
                    <div className="flex items-center gap-1 flex-wrap">
                      {product.sizes.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-white border border-[#ebdcd0] text-[#78461f] text-[10px] font-semibold shadow-2xs"
                        >
                          {s.name} {s.volume && `(${s.volume})`}: {s.price.toFixed(2)} ₼
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Action: Button to Menu */}
          <div className="w-full md:w-auto flex items-center justify-end flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#ebdcd0]/60">
            <Link
              href="/menu"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#b87333] to-[#9c5c28] text-white font-bold text-xs sm:text-sm hover:from-[#c78242] hover:to-[#a9662f] transition-all shadow-md shadow-[#b87333]/20 group active:scale-95"
            >
              <span>{t.featured.viewDetails}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
