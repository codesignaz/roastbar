'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Category, Product, ProductSize } from '@/lib/supabase/types';
import { dataService } from '@/lib/dataService';
import { Search, Coffee, Sparkles, X } from 'lucide-react';

export const FullMenu: React.FC = () => {
  const { t, tLocale } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, ProductSize>>({});

  useEffect(() => {
    async function loadFullMenu() {
      try {
        const [cats, prods] = await Promise.all([
          dataService.getCategories(),
          dataService.getProducts(),
        ]);
        setCategories(cats);
        setProducts(prods);

        // Set initial selected sizes
        const initialSizes: Record<string, ProductSize> = {};
        prods.forEach((p) => {
          if (p.sizes && p.sizes.length > 0) {
            initialSizes[p.id] = p.sizes[0];
          }
        });
        setSelectedSizes(initialSizes);
      } catch (err) {
        console.error('Error loading full menu:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFullMenu();
  }, []);

  const handleSizeSelect = (productId: string, size: ProductSize) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  // Filter products by category and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category_id === selectedCategory;

    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    const nameAz = (product.name_az || '').toLowerCase();
    const nameEn = (product.name_en || '').toLowerCase();
    const nameRu = (product.name_ru || '').toLowerCase();
    const descAz = (product.description_az || '').toLowerCase();
    const descEn = (product.description_en || '').toLowerCase();
    const descRu = (product.description_ru || '').toLowerCase();
    const tags = (product.tags || []).join(' ').toLowerCase();

    return (
      nameAz.includes(q) ||
      nameEn.includes(q) ||
      nameRu.includes(q) ||
      descAz.includes(q) ||
      descEn.includes(q) ||
      descRu.includes(q) ||
      tags.includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#221710] pb-24">
      {/* Sticky Top Bar for QR-Code Direct Menu (Category Pills & Search Bar immediately under navbar) */}
      <div className="sticky top-[53px] sm:top-[61px] z-30 bg-[#fdfbf7]/95 backdrop-blur-md border-b border-[#ebdcd0] py-2.5 px-4 sm:px-6 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-2.5">
          {/* Quick Search Input */}
          <div className="relative w-full sm:w-72 flex-shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8c7768]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.menu.searchPlaceholder}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-[#ebdcd0] text-xs sm:text-sm text-[#221710] placeholder-[#9c897b] focus:outline-none focus:border-[#b87333] shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-xs text-[#8c7768] hover:text-[#221710]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Horizontal Scrolling Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-[#b87333] to-[#9c5c28] text-white shadow-sm shadow-[#b87333]/20 scale-102'
                  : 'bg-white text-[#5c4a3e] hover:bg-[#faf5ee] border border-[#ebdcd0]'
              }`}
            >
              {t.menu.allCategories}
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const catName = tLocale(cat, 'name');
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#b87333] to-[#9c5c28] text-white shadow-sm shadow-[#b87333]/20 scale-102'
                      : 'bg-white text-[#5c4a3e] hover:bg-[#faf5ee] border border-[#ebdcd0]'
                  }`}
                >
                  {catName}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Products Grid - Appears IMMEDIATELY at the top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-72 rounded-2xl bg-[#efe3d5] animate-pulse border border-[#ebdcd0]"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#ebdcd0] max-w-md mx-auto shadow-sm">
            <Coffee className="w-12 h-12 text-[#b87333] mx-auto mb-3 opacity-40" />
            <p className="text-sm text-[#6e5c50]">{t.menu.noItemsFound}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProducts.map((product) => {
              const name = tLocale(product, 'name');
              const desc = tLocale(product, 'description');
              const activeSize = selectedSizes[product.id] || product.sizes?.[0];
              const displayPrice = activeSize ? activeSize.price : product.base_price;

              return (
                <div
                  key={product.id}
                  className="rounded-2xl bg-white border border-[#ebdcd0] hover:border-[#b87333]/40 overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-[#6e4320]/10 group"
                >
                  <div>
                    {/* Image Header with Badges */}
                    <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-[#f4e8dc]">
                      <img
                        src={product.image_url}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Featured Star Badge */}
                      {product.is_featured && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-[#b87333] to-[#9c5c28] text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                          <Sparkles className="w-3 h-3 fill-current" />
                          <span>Featured</span>
                        </div>
                      )}

                      {/* Price Pill */}
                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md border border-[#ebdcd0] px-3.5 py-1 rounded-xl shadow-md">
                        <span className="text-[#8f5222] font-extrabold text-base sm:text-lg">
                          {displayPrice.toFixed(2)} ₼
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 sm:p-5">
                      <h2 className="font-serif text-base sm:text-lg font-bold text-[#221710] group-hover:text-[#b87333] transition-colors leading-tight">
                        {name}
                      </h2>

                      <p className="mt-1.5 text-xs sm:text-sm text-[#5c4a3e] font-normal leading-relaxed line-clamp-2">
                        {desc}
                      </p>

                      {/* Product Tags */}
                      {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {product.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-[#fbf2ea] text-[#8f5222] border border-[#ebdcd0] font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Size Customizer & Footer */}
                  <div className="p-4 sm:p-5 pt-0">
                    {product.sizes && product.sizes.length > 1 && (
                      <div className="mt-1 pt-2.5 border-t border-[#f2e7db]">
                        <div className="flex items-center justify-between text-[11px] text-[#6e5c50] mb-1.5 font-medium">
                          <span>{t.menu.sizesAvailable}:</span>
                          {activeSize?.volume && (
                            <span className="text-[#8f5222] font-bold">{activeSize.volume}</span>
                          )}
                        </div>

                        {/* Size Switcher Buttons */}
                        <div className="grid grid-cols-3 gap-1.5">
                          {product.sizes.map((size, sIdx) => {
                            const isCurrent = activeSize?.name === size.name;
                            return (
                              <button
                                key={sIdx}
                                type="button"
                                onClick={() => handleSizeSelect(product.id, size)}
                                className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex flex-col items-center justify-center transition-all cursor-pointer ${
                                  isCurrent
                                    ? 'bg-[#b87333] text-white shadow-sm'
                                    : 'bg-[#faf4ed] text-[#473425] hover:bg-[#f4ebe0] border border-[#ebdcd0]'
                                }`}
                              >
                                <span>{size.name}</span>
                                <span
                                  className={`text-[10px] ${
                                    isCurrent ? 'text-white/90 font-bold' : 'text-[#8f5222] font-semibold'
                                  }`}
                                >
                                  {size.price.toFixed(2)}₼
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
