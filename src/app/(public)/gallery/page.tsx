import React from 'react';
import { InteriorGallery } from '@/components/public/InteriorGallery';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Interior Gallery | RoastBar Baku',
  description:
    'Experience the warm ambiance, artisan espresso workstation, and architectural design of RoastBar Baku.',
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#786455] hover:text-[#b87333] font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Əsas Səhifə / Home</span>
        </Link>
      </div>

      <InteriorGallery showHeader={true} />
    </div>
  );
}
