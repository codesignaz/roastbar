'use client';

import React, { useState } from 'react';
import { Category } from '@/lib/supabase/types';
import { X, Check, Layers } from 'lucide-react';

interface CategoryModalProps {
  category?: Category | null;
  onClose: () => void;
  onSave: (categoryData: Partial<Category>) => Promise<void>;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  category,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Category>>({
    name_az: category?.name_az || '',
    name_en: category?.name_en || '',
    name_ru: category?.name_ru || '',
    slug: category?.slug || '',
    display_order: category?.display_order || 1,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name_az?.trim()) {
      setError('Kateqoriyanın adını qeyd edin.');
      return;
    }

    const autoSlug =
      formData.slug?.trim() ||
      formData.name_en
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') ||
      'cat-' + Date.now();

    setError(null);
    setSaving(true);

    try {
      await onSave({
        ...formData,
        slug: autoSlug,
        id: category?.id,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Kateqoriyanı yadda saxlamaq mümkün olmadı.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#ebdcd0] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-[#221710]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#ebdcd0] flex items-center justify-between bg-[#fbf5ee]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white border border-[#ebdcd0] text-[#8f5222]">
              <Layers className="w-5 h-5 text-[#b87333]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#221710]">
                {category ? 'Kateqoriyaya Düzəliş' : 'Yeni Kateqoriya'}
              </h3>
              <p className="text-xs text-[#786455]">
                Menyu bölmələrini təyin edin
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8c7768] hover:text-[#221710]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#473425] mb-1">
              Ad (Azərbaycan) *
            </label>
            <input
              type="text"
              required
              value={formData.name_az || ''}
              onChange={(e) => setFormData({ ...formData, name_az: e.target.value })}
              placeholder="məs: İsti İçkilər"
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
              placeholder="e.g. Hot Drinks"
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
              placeholder="напр: Горячие напитки"
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0] text-[#221710] focus:border-[#b87333] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#473425] mb-1">
              Slug (URL identifikasiyası)
            </label>
            <input
              type="text"
              value={formData.slug || ''}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="məs: hot-drinks"
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0] text-[#221710] focus:border-[#b87333] focus:outline-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#ebdcd0] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#786455] hover:text-[#221710] transition-colors"
            >
              Ləğv Et
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#b87333] to-[#9c5c28] text-white font-bold text-xs hover:from-[#c78242] hover:to-[#a9662f] shadow-md shadow-[#b87333]/20 transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{saving ? 'Saxlanılır...' : 'Yadda Saxla'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
