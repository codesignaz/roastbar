import React from 'react';
import { LocationHours } from '@/components/public/LocationHours';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Location & Contact | RoastBar Baku',
  description:
    'Visit RoastBar Baku at Şihali Qurbanov (Fizuli) 2/15. Phone: +994 55 449 00 07. Open 08:00 – 00:30 every day.',
};

export default function ContactPage() {
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

      <LocationHours />
    </div>
  );
}
