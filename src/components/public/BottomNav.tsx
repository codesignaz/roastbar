'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Home, Coffee, Image as ImageIcon, MapPin, Phone } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { t } = useLanguage();

  // If in admin route, don't show the public bottom nav
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const items = [
    { href: '/', label: t.nav.home, icon: Home },
    { href: '/menu', label: t.nav.menu, icon: Coffee },
    { href: '/gallery', label: t.nav.gallery, icon: ImageIcon },
    { href: '/contact', label: t.nav.contact, icon: MapPin },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-auto">
      {/* Background with frosted warm cream glass & safe area padding */}
      <div className="bg-white/95 border-t border-[#ebdcd0] shadow-[0_-6px_24px_rgba(60,35,15,0.08)] backdrop-blur-xl px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {items.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'text-[#8f5222]'
                    : 'text-[#786455] hover:text-[#221710]'
                }`}
              >
                <div
                  className={`p-1 rounded-lg transition-colors ${
                    isActive ? 'bg-[#fbf2ea] text-[#8f5222]' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] mt-0.5 tracking-tight ${
                    isActive ? 'font-bold text-[#8f5222]' : 'font-medium'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Quick Call Action button */}
          <a
            href="tel:+994554490007"
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-white transition-all duration-200 active:scale-95"
            aria-label="Call RoastBar Baku"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#b87333] to-[#d4955b] flex items-center justify-center shadow-md shadow-[#b87333]/30">
              <Phone className="w-3.5 h-3.5 text-white stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-bold text-[#8f5222] mt-0.5">
              {t.nav.callUs}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};
