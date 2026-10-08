'use client';

import React, { useState } from 'react';
import { Product, Category, ProductSize } from '@/lib/supabase/types';
import { ImageUploader } from './ImageUploader';
import { X, Plus, Trash2, Sparkles, Check, Coffee } from 'lucide-react';

interface ProductModalProps {
  product?: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (productData: Partial<Product>) => Promise<void>;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  categories,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name_az: product?.name_az || '',
    name_en: product?.name_en || '',
    name_ru: product?.name_ru || '',
    category_id: product?.category_id || categories[0]?.id || '',
    description_az: product?.description_az || '',
    description_en: product?.description_en || '',
    description_ru: product?.description_ru || '',
    base_price: product?.base_price || 5.0,
    sizes: product?.sizes?.length
      ? [...product.sizes]
      : [
          { name: 'Small', volume: '250ml', price: 5.0 },
          { name: 'Medium', volume: '350ml', price: 6.0 },
          { name: 'Large', volume: '450ml', price: 7.0 },
        ],
    image_url: product?.image_url || '',
    is_featured: product?.is_featured || false,
    is_available: product?.is_available ?? true,
    tags: product?.tags || ['Specialty'],
  });

  const [tagInput, setTagInput] = useState((formData.tags || []).join(', '));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSizeChange = (index: number, field: keyof ProductSize, value: any) => {
    const updated = [...(formData.sizes || [])];
    updated[index] = {
      ...updated[index],
      [field]: field === 'price' ? parseFloat(value) || 0 : value,
    };
    setFormData({ ...formData, sizes: updated });
  };

  const addSize = () => {
    setFormData({
      ...formData,
      sizes: [
        ...(formData.sizes || []),
        { name: 'New Size', volume: '300ml', price: formData.base_price || 6.0 },
      ],
    });
  };

  const removeSize = (index: number) => {
    const updated = [...(formData.sizes || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, sizes: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name_az?.trim()) {
      setError('Zəhmət olmasa məhsulun Azərbaycan dilində adını qeyd edin.');
      return;
    }

    if (!formData.image_url) {
      setError('Zəhmət olmasa məhsul üçün şəkil yükləyin və ya URL daxil edin.');
      return;
    }

    setError(null);
    setSaving(true);

    try {
      const cleanTags = tagInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await onSave({
        ...formData,
        tags: cleanTags,
        id: product?.id,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Məhsulu yadda saxlamaq mümkün olmadı.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-[#ebdcd0] rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto text-[#221710]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#ebdcd0] flex items-center justify-between bg-[#fbf5ee]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white border border-[#ebdcd0] text-[#8f5222]">
              <Coffee className="w-5 h-5 text-[#b87333]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#221710]">
                {product ? 'Məhsula Düzəliş Et' : 'Yeni Məhsul Əlavə Et'}
              </h3>
              <p className="text-xs text-[#786455]">
                RoastBar menyusuna yeni məhsul daxil edin və ya mövcudu yeniləyin
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#8c7768] hover:text-[#221710] hover:bg-[#ebdcd0]/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Product Names (Multilingual) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#473425] mb-1">
                Ad (Azərbaycan) *
              </label>
              <input
                type="text"
                required
                value={formData.name_az || ''}
                onChange={(e) => setFormData({ ...formData, name_az: e.target.value })}
                placeholder="məs: Spanish Latte"
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0] text-[#221710] focus:border-[#b87333] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#473425] mb-1">
                Ad (English)
              </label>
              <input
                type="text"
                value={formData.name_en || ''}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                placeholder="e.g. Spanish Latte"
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0] text-[#221710] focus:border-[#b87333] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#473425] mb-1">
                Ad (Русский)
              </label>
              <input
                type="text"
                value={formData.name_ru || ''}
                onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
                placeholder="напр: Испанский Латте"
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0] text-[#221710] focus:border-[#b87333] focus:outline-none"
              />
            </div>
          </div>

          {/* Category & Base Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#473425] mb-1">
                Kateqoriya
              </label>
              <select
                value={formData.category_id || ''}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0] text-[#221710] focus:border-[#b87333] focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_az} ({c.name_en})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#473425] mb-1">
                Əsas Qiymət (AZN ₼) *
              </label>
              <input
                type="number"
                step="0.10"
                min="0"
                required
                value={formData.base_price ?? 0}
                onChange={(e) =>
                  setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })
                }
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0] text-[#221710] focus:border-[#b87333] focus:outline-none"
              />
            </div>
          </div>

          {/* Descriptions (Multilingual) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#473425] mb-1">
                Təsvir (AZ)
              </label>
              <textarea
                rows={2}
                value={formData.description_az || ''}
                onChange={(e) => setFormData({ ...formData, description_az: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0] text-[#221710] focus:border-[#b87333] focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#473425] mb-1">
                Təsvir (EN)
              </label>
              <textarea
                rows={2}
                value={formData.description_en || ''}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0] text-[#221710] focus:border-[#b87333] focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#473425] mb-1">
                Təsvir (RU)
              </label>
              <textarea
                rows={2}
                value={formData.description_ru || ''}
                onChange={(e) => setFormData({ ...formData, description_ru: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0] text-[#221710] focus:border-[#b87333] focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Customizable Sizes (Small, Medium, Large etc.) */}
          <div className="p-3.5 rounded-xl bg-[#fbf5ee] border border-[#ebdcd0] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#8f5222]">
                  Ölçü Seçimləri və Qiymətləri (Customizable Sizes)
                </span>
                <p className="text-[10px] text-[#786455]">
                  Müştərilər üçün müxtəlif həcmlər (məs: Small, Medium, Large) və fərdi qiymətlər
                </p>
              </div>
              <button
                type="button"
                onClick={addSize}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#ebdcd0] text-[#8f5222] text-xs font-bold hover:bg-[#faf4ed] transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ölçü Əlavə Et</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.sizes?.map((size, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={size.name}
                    onChange={(e) => handleSizeChange(index, 'name', e.target.value)}
                    placeholder="Ölçü (məs: S, M, L)"
                    className="flex-1 text-xs px-2.5 py-1.5 rounded-lg bg-white border border-[#ebdcd0] text-[#221710]"
                  />
                  <input
                    type="text"
                    value={size.volume || ''}
                    onChange={(e) => handleSizeChange(index, 'volume', e.target.value)}
                    placeholder="Həcm (məs: 350ml)"
                    className="w-24 text-xs px-2.5 py-1.5 rounded-lg bg-white border border-[#ebdcd0] text-[#221710]"
                  />
                  <div className="flex items-center gap-1 w-24">
                    <input
                      type="number"
                      step="0.10"
                      value={size.price}
                      onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                      placeholder="Qiymət"
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white border border-[#ebdcd0] text-[#221710]"
                    />
                    <span className="text-xs text-[#786455] font-semibold">₼</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSize(index)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Local Device Image Uploader */}
          <ImageUploader
            bucket="products"
            currentImageUrl={formData.image_url || ''}
            onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
            label="Məhsulun Şəkli (Cihazdan birbaşa yükləyin)"
          />

          {/* Featured Toggle (Top of Homepage Banner) */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#fbf2ea] to-[#f4e4d4] border border-[#b87333]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#b87333] text-white">
                <Sparkles className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-[#221710] block">
                  Əsas Səhifənin Seçilmiş Məhsulu (Top Banner)
                </span>
                <span className="text-[11px] text-[#5c4a3e] block">
                  Bu məhsul saytın ən yuxarı hissəsindəki vitrində nümayiş olunacaq.
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured || false}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b87333]" />
            </label>
          </div>

          {/* Available and Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-xs font-bold text-[#473425] mb-1">
                Teqlər (vergüllə ayırın)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="məs: Signature, Best Seller, Single Origin"
                className="w-full text-xs px-3 py-2 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0] text-[#221710] focus:border-[#b87333] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id="isAvailableCheck"
                checked={formData.is_available ?? true}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                className="w-4 h-4 rounded text-[#b87333] bg-[#fdfbf7] border-[#ebdcd0] focus:ring-0"
              />
              <label htmlFor="isAvailableCheck" className="text-xs text-[#473425] font-semibold">
                Məhsul hazırda satışdadır (In Stock)
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#ebdcd0] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#786455] hover:text-[#221710] hover:bg-[#faf4ed] transition-colors cursor-pointer"
            >
              Ləğv Et
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b87333] to-[#9c5c28] text-white font-bold text-xs sm:text-sm hover:from-[#c78242] hover:to-[#a9662f] shadow-md shadow-[#b87333]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{saving ? 'Yadda saxlanılır...' : 'Məhsulu Saxla'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
