'use client';

import React, { useState } from 'react';
import { GalleryImage } from '@/lib/supabase/types';
import { ImageUploader } from './ImageUploader';
import { X, Check, Image as ImageIcon } from 'lucide-react';

interface GalleryModalProps {
  image?: GalleryImage | null;
  onClose: () => void;
  onSave: (imageData: Partial<GalleryImage>) => Promise<void>;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  image,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<GalleryImage>>({
    image_url: image?.image_url || '',
    caption_az: image?.caption_az || '',
    caption_en: image?.caption_en || '',
    caption_ru: image?.caption_ru || '',
    display_order: image?.display_order || 1,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      setError('Zəhmət olmasa şəkil yükləyin və ya URL daxil edin.');
      return;
    }

    setError(null);
    setSaving(true);

    try {
      await onSave({
        ...formData,
        id: image?.id,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Şəkli əlavə etmək mümkün olmadı.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#ebdcd0] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-[#221710]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#ebdcd0] flex items-center justify-between bg-[#fbf5ee]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white border border-[#ebdcd0] text-[#8f5222]">
              <ImageIcon className="w-5 h-5 text-[#b87333]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#221710]">
                {image ? 'Şəkilə Düzəliş' : 'İnteryer Şəkli Yüklə'}
              </h3>
              <p className="text-xs text-[#786455]">
                RoastBar məkanının yeni şəklini qalereyaya əlavə edin
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

          {/* Local Device Image Uploader */}
          <ImageUploader
            bucket="gallery"
            currentImageUrl={formData.image_url || ''}
            onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
            label="İnteryer Şəkli (Cihazınızdan seçin)"
          />

          <div>
            <label className="block text-xs font-bold text-[#473425] mb-1">
              Açıqlama / Başlıq (Azərbaycan)
            </label>
            <input
              type="text"
              value={formData.caption_az || ''}
              onChange={(e) => setFormData({ ...formData, caption_az: e.target.value })}
              placeholder="məs: Espresso barı və barista məkanı"
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0] text-[#221710] focus:border-[#b87333] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#473425] mb-1">
              Açıqlama (English)
            </label>
            <input
              type="text"
              value={formData.caption_en || ''}
              onChange={(e) => setFormData({ ...formData, caption_en: e.target.value })}
              placeholder="e.g. Cozy seating lounge"
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0] text-[#221710] focus:border-[#b87333] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#473425] mb-1">
              Açıqlama (Русский)
            </label>
            <input
              type="text"
              value={formData.caption_ru || ''}
              onChange={(e) => setFormData({ ...formData, caption_ru: e.target.value })}
              placeholder="напр: Уютная зона отдыха"
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
              <span>{saving ? 'Yüklənir...' : 'Qalereyaya Əlavə Et'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
