'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useSlogans } from '@/hooks/useSlogans';
import { Category, Product } from '@/lib/supabase/types';
import { dataService } from '@/lib/dataService';
import { Coffee, ArrowRight, Sparkles } from 'lucide-react';

export const MenuSection: React.FC = () => {
  const { t, tLocale } = useLanguage();
  const slogans = useSlogans();
  const menuTitle = slogans.menuTitle || t.menu.title;
  const menuSubtitle = slogans.menuSubtitle || t.menu.subtitle;
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, prods] = await Promise.all([
          dataService.getCategories(),
          dataService.getProducts(),
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        console.error('Error loading menu section:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = activeCategoryId === 'all'
    ? products.slice(0, 6)
    : products.filter((p) => p.category_id === activeCategoryId).slice(0, 6);

  return (
    <section className="py-14 sm:py-20 bg-[#f9f6f1] border-t border-b border-[#ebdcd0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8f5222] font-bold mb-2">
              <Coffee className="w-4 h-4 text-[#b87333]" />
              <span>{menuTitle}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#221710]">
              {menuTitle}
            </h2>
            <p className="text-xs sm:text-base text-[#5c4a3e] max-w-xl mt-1">
              {menuSubtitle}
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#8f5222] hover:text-[#b87333] transition-colors group"
          >
            <span>{t.menu.viewFullMenu}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Category Pill Filters (Horizontally scrollable on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveCategoryId('all')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeCategoryId === 'all'
                ? 'bg-[#b87333] text-white shadow-sm'
                : 'bg-white text-[#5c4a3e] hover:bg-[#faf5ee] border border-[#ebdcd0]'
            }`}
          >
            {t.menu.allCategories}
          </button>
          {categories.map((cat) => {
            const isSelected = activeCategoryId === cat.id;
            const catName = tLocale(cat, 'name');
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategoryId(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#b87333] text-white shadow-sm'
                    : 'bg-white text-[#5c4a3e] hover:bg-[#faf5ee] border border-[#ebdcd0]'
                }`}
              >
                {catName}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-[#efe3d5] animate-pulse border border-[#ebdcd0]"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredProducts.map((product) => {
              const name = tLocale(product, 'name');
              const desc = tLocale(product, 'description');

              return (
                <div
                  key={product.id}
                  className="group rounded-2xl bg-white border border-[#ebdcd0] hover:border-[#b87333]/40 overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-[#6e4320]/10"
                >
                  {/* Photo with Overlay */}
                  <div>
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#f4e8dc]">
                      <img
                        src={product.image_url}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Price tag pill */}
                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md border border-[#ebdcd0] px-3 py-1 rounded-xl shadow-md">
                        <span className="text-[#8f5222] font-extrabold text-sm">
                          {product.base_price.toFixed(2)} ₼
                        </span>
                      </div>

                      {/* Featured tag */}
                      {product.is_featured && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-[#b87333] to-[#9c5c28] text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-sm">
                          <Sparkles className="w-3 h-3" />
                          <span>Featured</span>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-4 sm:p-5">
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#221710] group-hover:text-[#b87333] transition-colors leading-snug">
                        {name}
                      </h3>

                      <p className="mt-1 text-xs text-[#5c4a3e] line-clamp-2 leading-relaxed font-normal">
                        {desc}
                      </p>
                    </div>
                  </div>

                  {/* Sizes and Variants footer */}
                  <div className="p-4 sm:p-5 pt-0">
                    <div className="pt-3 border-t border-[#f2e7db] flex items-center justify-between">
                      {product.sizes && product.sizes.length > 0 ? (
                        <div className="flex items-center gap-1 flex-wrap">
                          {product.sizes.map((sz, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-[#faf4ed] text-[#6e5c50] border border-[#ebdcd0] font-medium"
                            >
                              {sz.name}: {sz.price.toFixed(2)}₼
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#8c7768]">Standard</span>
                      )}

                      <Link
                        href="/menu"
                        className="text-xs text-[#8f5222] hover:text-[#b87333] font-bold flex items-center gap-1"
                      >
                        <span>{t.featured.viewDetails}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA to Full Menu */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#b87333] to-[#9c5c28] text-white font-bold text-sm tracking-wide shadow-md shadow-[#b87333]/20 hover:from-[#c78242] hover:to-[#a9662f] transition-all transform active:scale-95"
          >
            <Coffee className="w-4 h-4" />
            <span>{t.menu.viewFullMenu}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
