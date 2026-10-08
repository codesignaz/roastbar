'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useSlogans } from '@/hooks/useSlogans';
import { GalleryImage } from '@/lib/supabase/types';
import { dataService } from '@/lib/dataService';
import { Image as ImageIcon, ArrowRight, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export const InteriorGallery: React.FC<{ limit?: number; showHeader?: boolean }> = ({
  limit,
  showHeader = true,
}) => {
  const { t, tLocale } = useLanguage();
  const slogans = useSlogans();
  const galleryTitle = slogans.galleryTitle || t.gallery.title;
  const gallerySubtitle = slogans.gallerySubtitle || t.gallery.subtitle;
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadGallery() {
      try {
        const data = await dataService.getGalleryImages();
        setImages(data);
      } catch (err) {
        console.error('Failed to load gallery images:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  const displayImages = limit ? images.slice(0, limit) : images;

  const openLightbox = (index: number) => {
    setActiveModalIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setActiveModalIndex(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeModalIndex !== null) {
      setActiveModalIndex((activeModalIndex + 1) % displayImages.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeModalIndex !== null) {
      setActiveModalIndex(
        (activeModalIndex - 1 + displayImages.length) % displayImages.length
      );
    }
  };

  return (
    <section className="py-14 sm:py-20 bg-[#fdfbf7] border-t border-[#ebdcd0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        {showHeader && (
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8f5222] font-bold mb-2">
                <ImageIcon className="w-4 h-4 text-[#b87333]" />
                <span>{galleryTitle}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#221710]">
                {galleryTitle}
              </h2>
              <p className="text-xs sm:text-base text-[#5c4a3e] max-w-xl mt-1">
                {gallerySubtitle}
              </p>
            </div>

            {limit && images.length > limit && (
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#8f5222] hover:text-[#b87333] transition-colors group"
              >
                <span>{t.gallery.viewFullGallery}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        )}

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-2xl bg-[#efe3d5] animate-pulse border border-[#ebdcd0]"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
            {displayImages.map((image, idx) => {
              const caption = tLocale(image, 'caption');
              return (
                <div
                  key={image.id}
                  onClick={() => openLightbox(idx)}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-[#ebdcd0] cursor-pointer shadow-sm hover:shadow-xl hover:shadow-[#6e4320]/10 transition-all duration-300"
                >
                  <img
                    src={image.image_url}
                    alt={caption || 'RoastBar Interior'}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    loading="lazy"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                  {/* Caption badge at bottom */}
                  <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between gap-2">
                    <p className="text-xs sm:text-sm font-medium text-white line-clamp-2 leading-snug drop-shadow-md">
                      {caption || 'RoastBar Baku'}
                    </p>
                    <div className="w-7 h-7 rounded-lg bg-black/40 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Fullscreen Modal */}
      {activeModalIndex !== null && displayImages[activeModalIndex] && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close Gallery Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          <button
            type="button"
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-colors z-50 cursor-pointer"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Main Photo container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center"
          >
            <img
              src={displayImages[activeModalIndex].image_url}
              alt="RoastBar Preview"
              className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-white/20"
            />
            <div className="mt-4 text-center">
              <p className="text-sm sm:text-base text-white font-medium max-w-xl mx-auto">
                {tLocale(displayImages[activeModalIndex], 'caption')}
              </p>
              <span className="text-xs text-white/70 mt-1 block">
                {activeModalIndex + 1} / {displayImages.length}
              </span>
            </div>
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-colors z-50 cursor-pointer"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
};
