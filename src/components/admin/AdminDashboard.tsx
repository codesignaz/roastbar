'use client';

import React, { useState, useEffect } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { Product, Category, GalleryImage } from '@/lib/supabase/types';
import { dataService } from '@/lib/dataService';
import { ProductModal } from './ProductModal';
import { CategoryModal } from './CategoryModal';
import { GalleryModal } from './GalleryModal';
import {
  Coffee,
  Layers,
  Image as ImageIcon,
  Plus,
  Edit,
  Trash2,
  Sparkles,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  Search,
  Palette,
  Check,
  Quote,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { BrandLogo } from '@/components/common/BrandLogo';
import { SlogansManager } from './SlogansManager';

export const AdminDashboard: React.FC<{ onSignOut: () => void }> = ({ onSignOut }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'gallery' | 'slogans' | 'theme'>('products');
  const { currentThemeId, presets, setTheme } = useTheme();
  const [themeSuccessMsg, setThemeSuccessMsg] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [editingGalleryImage, setEditingGalleryImage] = useState<GalleryImage | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [prods, cats, gallery] = await Promise.all([
        dataService.getProducts(),
        dataService.getCategories(),
        dataService.getGalleryImages(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setGalleryImages(gallery);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Product CRUD
  const handleSaveProduct = async (productData: Partial<Product>) => {
    await dataService.saveProduct(productData);
    await loadAllData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Bu məhsulu silmək istədiyinizdən əminsiniz?')) {
      await dataService.deleteProduct(id);
      await loadAllData();
    }
  };

  const handleToggleFeatured = async (productId: string) => {
    await dataService.setFeaturedProduct(productId);
    await loadAllData();
  };

  // Category CRUD
  const handleSaveCategory = async (categoryData: Partial<Category>) => {
    await dataService.saveCategory(categoryData);
    await loadAllData();
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Bu kateqoriyanı silmək istədiyinizdən əminsiniz?')) {
      await dataService.deleteCategory(id);
      await loadAllData();
    }
  };

  // Gallery CRUD
  const handleSaveGalleryImage = async (imageData: Partial<GalleryImage>) => {
    await dataService.saveGalleryImage(imageData);
    await loadAllData();
  };

  const handleDeleteGalleryImage = async (id: string) => {
    if (confirm('Bu şəkli qalereyadan silmək istədiyinizdən əminsiniz?')) {
      await dataService.deleteGalleryImage(id);
      await loadAllData();
    }
  };

  const filteredProducts = products.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      (p.name_az || '').toLowerCase().includes(q) ||
      (p.name_en || '').toLowerCase().includes(q) ||
      (p.name_ru || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#221710]">
      {/* Admin Navbar */}
      <header className="bg-white border-b border-[#ebdcd0] sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo variant="compact" size="md" adminBadge asLink={false} />
          </div>

          <div className="flex items-center gap-3">
            {/* Supabase status indicator */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                isSupabaseConfigured
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              {isSupabaseConfigured ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Supabase Live</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Local Preview Mode</span>
                </>
              )}
            </div>

            {/* Sign Out Button */}
            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-red-50 text-[#6e5c50] hover:text-red-600 border border-[#ebdcd0] text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Çıxış</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar border-b border-[#ebdcd0]">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-gradient-to-r from-[#b87333] to-[#9c5c28] text-white shadow-md shadow-[#b87333]/20'
                : 'bg-white text-[#5c4a3e] hover:bg-[#faf5ee] border border-[#ebdcd0]'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>Məhsullar / Menyu ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-gradient-to-r from-[#b87333] to-[#9c5c28] text-white shadow-md shadow-[#b87333]/20'
                : 'bg-white text-[#5c4a3e] hover:bg-[#faf5ee] border border-[#ebdcd0]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Kateqoriyalar ({categories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-gradient-to-r from-[#b87333] to-[#9c5c28] text-white shadow-md shadow-[#b87333]/20'
                : 'bg-white text-[#5c4a3e] hover:bg-[#faf5ee] border border-[#ebdcd0]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>İnteryer Qalereyası ({galleryImages.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('slogans')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'slogans'
                ? 'bg-gradient-to-r from-[#b87333] to-[#9c5c28] text-white shadow-md shadow-[#b87333]/20'
                : 'bg-white text-[#5c4a3e] hover:bg-[#faf5ee] border border-[#ebdcd0]'
            }`}
          >
            <Quote className="w-4 h-4" />
            <span>Şüarlar & Mətnlər</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('theme')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'theme'
                ? 'bg-gradient-to-r from-[#b87333] to-[#9c5c28] text-white shadow-md shadow-[#b87333]/20'
                : 'bg-white text-[#5c4a3e] hover:bg-[#faf5ee] border border-[#ebdcd0]'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Rəng Palitrası</span>
          </button>
        </div>

        {/* ================= TAB 1: PRODUCTS ================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c7768]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Məhsulları axtar..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#ebdcd0] text-xs sm:text-sm text-[#221710] placeholder-[#9c897b] focus:outline-none focus:border-[#b87333] shadow-2xs"
                />
              </div>

              {/* Add Product Button */}
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setProductModalOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#b87333] to-[#9c5c28] text-white font-bold text-xs sm:text-sm shadow-md hover:from-[#c78242] hover:to-[#a9662f] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Məhsul Əlavə Et</span>
              </button>
            </div>

            {/* Products Table / List */}
            <div className="bg-white border border-[#ebdcd0] rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#fbf5ee] border-b border-[#ebdcd0] text-[#786455] font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Şəkil & Məhsul</th>
                      <th className="py-3 px-4">Kateqoriya</th>
                      <th className="py-3 px-4">Ölçülər & Qiymət</th>
                      <th className="py-3 px-4 text-center">Əsas Banner (Featured)</th>
                      <th className="py-3 px-4 text-right">Əməliyyatlar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f2e7db]">
                    {filteredProducts.map((p) => {
                      const categoryObj = categories.find((c) => c.id === p.category_id);
                      return (
                        <tr key={p.id} className="hover:bg-[#faf5ee] transition-colors">
                          {/* Image & Product Info */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image_url}
                                alt={p.name_az}
                                className="w-12 h-12 rounded-xl object-cover bg-[#f4e8dc] border border-[#ebdcd0] flex-shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="font-bold text-[#221710] truncate max-w-xs sm:max-w-sm">
                                  {p.name_az}
                                </div>
                                <div className="text-[11px] text-[#786455] truncate max-w-xs font-normal">
                                  {p.name_en || p.name_ru}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-lg bg-[#fbf2ea] border border-[#ebdcd0] text-[#8f5222] text-xs font-semibold">
                              {categoryObj?.name_az || 'Kateqoriyasız'}
                            </span>
                          </td>

                          {/* Sizes & Price */}
                          <td className="py-3.5 px-4">
                            <div className="font-extrabold text-[#8f5222]">
                              {p.base_price.toFixed(2)} ₼
                            </div>
                            {p.sizes && p.sizes.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {p.sizes.map((s, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[10px] px-1.5 py-0.5 rounded bg-[#fdfbf7] text-[#6e5c50] border border-[#ebdcd0] font-medium"
                                  >
                                    {s.name} ({s.price.toFixed(2)}₼)
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>

                          {/* Featured Product Selector */}
                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleFeatured(p.id)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                p.is_featured
                                  ? 'bg-[#b87333] text-white shadow-md shadow-[#b87333]/30 scale-105'
                                  : 'bg-[#faf4ed] text-[#786455] hover:text-[#b87333] border border-[#ebdcd0]'
                              }`}
                              title={
                                p.is_featured
                                  ? 'Bu məhsul ana səhifənin ən yuxarı bannerində nümayiş olunur'
                                  : 'Bu məhsulu ana səhifənin ən yuxarı banneri et'
                              }
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>{p.is_featured ? 'Günün Seçimi' : 'Seçilmiş Et'}</span>
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProduct(p);
                                  setProductModalOpen(true);
                                }}
                                className="p-2 rounded-lg bg-[#faf4ed] hover:bg-[#f4ebe0] text-[#8f5222] transition-colors border border-[#ebdcd0]"
                                title="Düzəliş et"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors border border-red-200"
                                title="Sil"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: CATEGORIES ================= */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#221710]">
                  Menyu Kateqoriyaları
                </h3>
                <p className="text-xs text-[#786455]">
                  İçkilər və desertləri qruplaşdırmaq üçün kateqoriyalar yaradın
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#b87333] to-[#9c5c28] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Kateqoriya</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const count = products.filter((p) => p.category_id === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    className="p-5 rounded-2xl bg-white border border-[#ebdcd0] shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-base text-[#221710]">
                          {cat.name_az}
                        </h4>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#fbf2ea] text-[#8f5222] border border-[#ebdcd0] font-semibold">
                          {count} məhsul
                        </span>
                      </div>
                      <p className="text-xs text-[#786455] mt-1">
                        EN: {cat.name_en} • RU: {cat.name_ru}
                      </p>
                      <p className="text-[11px] text-[#9c897b] mt-2 font-mono">
                        Slug: {cat.slug}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#f2e7db] flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategory(cat);
                          setCategoryModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-[#faf4ed] hover:bg-[#f4ebe0] text-[#8f5222] border border-[#ebdcd0]"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 3: INTERIOR GALLERY ================= */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#221710]">
                  İnteryer Qalereyası (Supabase Storage)
                </h3>
                <p className="text-xs text-[#786455]">
                  RoastBar-ın daxili ab-havasını əks etdirən fotoşəkilləri idarə edin
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingGalleryImage(null);
                  setGalleryModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#b87333] to-[#9c5c28] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Foto Yüklə</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((img) => (
                <div
                  key={img.id}
                  className="rounded-2xl bg-white border border-[#ebdcd0] overflow-hidden flex flex-col justify-between shadow-sm"
                >
                  <div className="relative aspect-video w-full bg-[#f4e8dc]">
                    <img
                      src={img.image_url}
                      alt={img.caption_az || 'Gallery'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-[#473425] font-medium line-clamp-2">
                      {img.caption_az || 'Başlıqsız şəkil'}
                    </p>

                    <div className="mt-3 pt-2 border-t border-[#f2e7db] flex items-center justify-between">
                      <span className="text-[10px] text-[#9c897b]">
                        Sıra: #{img.display_order}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteGalleryImage(img.id)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: SLOGANS & BRAND TEXTS ================= */}
        {activeTab === 'slogans' && <SlogansManager />}

        {/* ================= TAB 5: THEME PALETTE ================= */}
        {activeTab === 'theme' && (
          <div className="space-y-8">
            {/* Header / Intro Card */}
            <div className="bg-white rounded-2xl border border-[#ebdcd0] p-6 shadow-2xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="p-2 rounded-xl bg-[#fbf2ea] text-[#b87333]">
                      <Palette className="w-5 h-5" />
                    </span>
                    <h2 className="font-serif text-xl font-bold text-[#221710]">
                      Saytın Rəng Palitrası & Brend Atmosferi
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-[#786455] max-w-2xl leading-relaxed">
                    Buradan RoastBar vebsaytının vizual ab-havasını və rəng ahəngini bir kliklə dəyişə bilərsiniz.
                    Seçilmiş palitra bütün səhifələrdə (Menyu, Əsas səhifə, Düymələr, Vurğular) dərhal tətbiq olunur.
                  </p>
                </div>

                {themeSuccessMsg && (
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold animate-fadeIn">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{themeSuccessMsg}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Palette Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {presets.map((preset) => {
                const isActive = currentThemeId === preset.id;
                return (
                  <div
                    key={preset.id}
                    className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                      isActive
                        ? 'border-[#b87333] ring-2 ring-[#b87333]/30 shadow-md shadow-[#b87333]/10'
                        : 'border-[#ebdcd0] hover:border-[#c98a58] hover:shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Top Bar with Badge */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <h3 className="font-serif font-bold text-base text-[#221710] leading-snug">
                            {preset.name_az}
                          </h3>
                          <span className="text-[11px] text-[#8c7464] font-medium tracking-wide">
                            {preset.name_en}
                          </span>
                        </div>
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                            <Check className="w-3 h-3 text-emerald-700" />
                            Aktiv
                          </span>
                        ) : null}
                      </div>

                      {/* Color Swatches */}
                      <div className="mb-4">
                        <div className="text-[11px] font-semibold text-[#8c7464] mb-2 uppercase tracking-wider">
                          Rəng Çalarları
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="text-center">
                            <div
                              className="w-full h-9 rounded-lg border border-black/10 shadow-2xs mb-1"
                              style={{ backgroundColor: preset.previewBg }}
                            />
                            <span className="text-[10px] text-[#786455] block">Fon</span>
                          </div>
                          <div className="text-center">
                            <div
                              className="w-full h-9 rounded-lg border border-black/10 shadow-2xs mb-1"
                              style={{ backgroundColor: preset.previewPrimary }}
                            />
                            <span className="text-[10px] text-[#786455] block">Əsas</span>
                          </div>
                          <div className="text-center">
                            <div
                              className="w-full h-9 rounded-lg border border-black/10 shadow-2xs mb-1"
                              style={{ backgroundColor: preset.previewAccent }}
                            />
                            <span className="text-[10px] text-[#786455] block">Aksent</span>
                          </div>
                          <div className="text-center">
                            <div
                              className="w-full h-9 rounded-lg border border-black/10 shadow-2xs mb-1"
                              style={{ backgroundColor: preset.previewText }}
                            />
                            <span className="text-[10px] text-[#786455] block">Mətn</span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[#5c4a3e] leading-relaxed mb-4">
                        {preset.description_az}
                      </p>

                      {/* Mini Live Preview inside card */}
                      <div
                        className="p-3 rounded-xl border mb-4 text-xs space-y-2 transition-colors"
                        style={{
                          backgroundColor: preset.css.background,
                          borderColor: preset.css.border,
                          color: preset.css.foreground,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                            style={{
                              backgroundColor: preset.css.badgeBg,
                              color: preset.css.badgeText,
                            }}
                          >
                            Ön Baxış
                          </span>
                          <span className="font-bold text-[11px]" style={{ color: preset.css.primary }}>
                            6.50 ₼
                          </span>
                        </div>
                        <div
                          className="py-1 px-2.5 rounded-lg text-center text-[11px] font-bold text-white shadow-2xs"
                          style={{
                            background: `linear-gradient(to right, ${preset.css.primaryGradientFrom}, ${preset.css.primaryGradientTo})`,
                          }}
                        >
                          Nümunə Düymə
                        </div>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setTheme(preset.id);
                        setThemeSuccessMsg(`"${preset.name_az}" palitrası tətbiq edildi!`);
                        setTimeout(() => setThemeSuccessMsg(null), 4000);
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-2xs cursor-default'
                          : 'bg-[#221710] hover:bg-[#b87333] text-white shadow-2xs'
                      }`}
                    >
                      {isActive ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Hazırda Tətbiq Edilib</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Bu Palitranı Seç</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Live Comparison Section */}
            <div className="bg-white rounded-2xl border border-[#ebdcd0] p-6 shadow-2xs">
              <h3 className="font-serif text-lg font-bold text-[#221710] mb-2">
                Hazırkı Seçimin Saytda Görünüşü
              </h3>
              <p className="text-xs text-[#786455] mb-5">
                Aşağıdakı nümunə seçdiyiniz rəng palitrasının ziyarətçilərə necə təqdim olunduğunu canlı əks etdirir:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Sample Card 1: Featured Badge */}
                <div className="p-4 rounded-xl border border-[#ebdcd0] bg-[#fdfbf7] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8f5222] bg-[#fbf2ea] px-2.5 py-1 rounded-full">
                      ★ Həftənin Seçimi
                    </span>
                    <h4 className="font-serif font-bold text-base text-[#221710] mt-3">
                      Spanish Latte
                    </h4>
                    <p className="text-xs text-[#786455] mt-1">
                      Kondensasiya olunmuş şirin süd və xüsusi espresso balansı.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#ebdcd0] flex items-center justify-between">
                    <span className="font-bold text-sm text-[#b87333]">7.50 ₼</span>
                    <span className="text-xs font-semibold text-[#8f5222]">M / L</span>
                  </div>
                </div>

                {/* Sample Card 2: CTA Button */}
                <div className="p-4 rounded-xl border border-[#ebdcd0] bg-white flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#221710]">
                      Əsas Əməliyyat Düyməsi
                    </h4>
                    <p className="text-xs text-[#786455] mt-1">
                      Menyuya baxış və WhatsApp sifariş düymələrində istifadə olunan qradiyent tonları.
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#b87333] to-[#9c5c28] shadow-md shadow-[#b87333]/20"
                    >
                      Menyunu Kəşf Edin
                    </button>
                  </div>
                </div>

                {/* Sample Card 3: Color Info */}
                <div className="p-4 rounded-xl border border-[#ebdcd0] bg-[#fbf2ea] flex flex-col justify-between sm:col-span-2 lg:col-span-1">
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#8f5222]">
                      Aktiv Palitra Məlumatı
                    </h4>
                    <p className="text-xs text-[#5c4a3e] mt-1">
                      Seçim brauzer yaddaşında və sayt mühitində saxlanılır. İstənilən vaxt dəyişdirilə və ya ilkin vəziyyətinə qaytarıla bilər.
                    </p>
                  </div>
                  <div className="mt-4 text-xs font-mono text-[#8f5222] font-semibold">
                    ID: {currentThemeId}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {productModalOpen && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => setProductModalOpen(false)}
          onSave={handleSaveProduct}
        />
      )}

      {categoryModalOpen && (
        <CategoryModal
          category={editingCategory}
          onClose={() => setCategoryModalOpen(false)}
          onSave={handleSaveCategory}
        />
      )}

      {galleryModalOpen && (
        <GalleryModal
          image={editingGalleryImage}
          onClose={() => setGalleryModalOpen(false)}
          onSave={handleSaveGalleryImage}
        />
      )}
    </div>
  );
};
