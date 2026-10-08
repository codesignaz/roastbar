import React from 'react';
import { FeaturedBanner } from '@/components/public/FeaturedBanner';
import { HeroSection } from '@/components/public/HeroSection';
import { MenuSection } from '@/components/public/MenuSection';
import { InteriorGallery } from '@/components/public/InteriorGallery';
import { InstagramSection } from '@/components/public/InstagramSection';
import { LocationHours } from '@/components/public/LocationHours';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. Dynamic Featured Product Banner at the VERY TOP of the homepage */}
      <FeaturedBanner />

      {/* 2. Hero Section */}
      <HeroSection />

      {/* 3. Summarized / Highlighted Menu */}
      <MenuSection />

      {/* 4. Interior Gallery Showcase (Dynamic from DB) */}
      <InteriorGallery limit={6} />

      {/* 5. Instagram Integration (@roastbarbaku Posts & Reels) */}
      <InstagramSection />

      {/* 6. Location, Hours & Direct Contact */}
      <LocationHours />
    </div>
  );
}
