'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { brandConfig, BrandIconType } from '@/config/brandConfig';
import { Coffee, Flame, Sparkles } from 'lucide-react';

export interface BrandLogoProps {
  /**
   * Loqo variantı:
   * - 'full': İkon + Brend Adı + Alt yazı
   * - 'compact': İkon + Brend Adı (alt yazısız)
   * - 'icon-only': Yalnız İkon
   * - 'text-only': Yalnız Mətn
   */
  variant?: 'full' | 'compact' | 'icon-only' | 'text-only';
  /** Ölçü: 'sm' | 'md' | 'lg' | 'xl' */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Əsas səhifəyə keçid linki olsun? (Default: true) */
  asLink?: boolean;
  /** Keçid ünvanı (Default: '/') */
  href?: string;
  /** Əlavə CSS sinfi */
  className?: string;
  /** İkon qutusuna əlavə sinif */
  iconClassName?: string;
  /** Alt yazını göstər/gizlət */
  showSubtitle?: boolean;
  /** Admin paneli üçün xüsusi nişan əlavə et */
  adminBadge?: boolean;
}

/**
 * Fərdi İkon generatoru
 */
const RenderIconEmblem: React.FC<{ type: BrandIconType; sizeClass: string }> = ({
  type,
  sizeClass,
}) => {
  switch (type) {
    case 'svg-file':
    case 'png-file':
    case 'custom-file':
      return (
        <img
          src={brandConfig.iconImage}
          alt={brandConfig.brandName.full}
          className="w-full h-full object-contain p-0.5 rounded-[inherit]"
        />
      );

    case 'cup':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${sizeClass} text-[#b87333]`}
        >
          <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
          <line x1="6" y1="2" x2="6" y2="4" />
          <line x1="10" y1="2" x2="10" y2="4" />
          <line x1="14" y1="2" x2="14" y2="4" />
        </svg>
      );

    case 'bean':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`${sizeClass} text-[#b87333]`}
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79 3.26 1.48 5.62 4.41 6.79 9.72zm5.79-4.14c-1.48-3.26-4.41-5.62-9.72-6.79.49-3.95 3.85-7 7.93-7 .62 0 1.21.08 1.79.21z" />
        </svg>
      );

    case 'flame':
      return <Flame className={`${sizeClass} text-[#b87333]`} />;

    case 'sparkles':
      return <Sparkles className={`${sizeClass} text-[#b87333]`} />;

    case 'coffee':
    default:
      return <Coffee className={`${sizeClass} text-[#b87333]`} />;
  }
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  size = 'md',
  asLink = true,
  href = '/',
  className = '',
  iconClassName = '',
  showSubtitle = true,
  adminBadge = false,
}) => {
  // Ölçü konfiqurasiyası
  const sizeStyles = {
    sm: {
      box: 'w-7 h-7 sm:w-8 sm:h-8 rounded-xl',
      icon: 'w-4 h-4',
      text: 'text-sm sm:text-base',
      subtext: 'text-[8px] tracking-[0.16em]',
      imgHeight: 'h-6 sm:h-7',
    },
    md: {
      box: 'w-10 h-10 sm:w-12 sm:h-12 rounded-2xl',
      icon: 'w-6 h-6',
      text: 'text-lg sm:text-xl',
      subtext: 'text-[9px] tracking-[0.18em]',
      imgHeight: 'h-8 sm:h-9 md:h-10',
    },
    lg: {
      box: 'w-14 h-14 sm:w-16 sm:h-16 rounded-2xl',
      icon: 'w-8 h-8',
      text: 'text-xl sm:text-2xl',
      subtext: 'text-[10px] tracking-[0.2em]',
      imgHeight: 'h-9 sm:h-10 md:h-11',
    },
    xl: {
      box: 'w-20 h-20 sm:w-24 sm:h-24 rounded-3xl',
      icon: 'w-10 h-10',
      text: 'text-3xl sm:text-4xl',
      subtext: 'text-xs tracking-[0.22em]',
      imgHeight: 'h-12 sm:h-14 md:h-16',
    },
  }[size];

  // 1. Əgər rejim 'custom-image' olarsa, birbaşa şəkli göstəririk
  if (brandConfig.logoMode === 'custom-image') {
    const imgContent = (
      <img
        src={brandConfig.logoImage}
        alt={brandConfig.brandName.full}
        className={`${sizeStyles.imgHeight} w-auto object-contain shrink-0 transition-transform group-hover:scale-105 ${className}`}
      />
    );

    if (asLink) {
      return (
        <Link href={href} className={`inline-flex items-center shrink-0 group ${className}`}>
          {imgContent}
          {adminBadge && (
            <span className="ml-2.5 text-[10px] uppercase font-bold tracking-widest bg-[#fbf2ea] text-[#8f5222] px-2 py-0.5 rounded-full border border-[#ebdcd0]">
              Admin
            </span>
          )}
        </Link>
      );
    }
    return <div className={`inline-flex items-center shrink-0 ${className}`}>{imgContent}</div>;
  }

  // 2. Əgər rejim 'custom-svg' olarsa
  if (brandConfig.logoMode === 'custom-svg' && brandConfig.customSvgCode) {
    const svgContent = (
      <div
        className={`${sizeStyles.imgHeight} w-auto flex items-center transition-transform group-hover:scale-105 ${className}`}
        dangerouslySetInnerHTML={{ __html: brandConfig.customSvgCode }}
      />
    );

    if (asLink) {
      return (
        <Link href={href} className={`inline-flex items-center group ${className}`}>
          {svgContent}
        </Link>
      );
    }
    return <div className={`inline-flex items-center ${className}`}>{svgContent}</div>;
  }

  // 3. Standart 'icon-text' rejimi
  const content = (
    <>
      {/* Icon Box */}
      {variant !== 'text-only' && (
        <div
          className={`${sizeStyles.box} bg-gradient-to-br from-[#b87333] to-[#80481b] p-0.5 shadow-xs flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shrink-0 ${iconClassName}`}
        >
          <div className="w-full h-full bg-[#fdfbf7] rounded-[inherit] flex items-center justify-center">
            <RenderIconEmblem type={brandConfig.iconType} sizeClass={sizeStyles.icon} />
          </div>
        </div>
      )}

      {/* Text Block */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span
              className={`font-serif ${sizeStyles.text} font-bold tracking-wider text-[#221710] group-hover:text-[#b87333] transition-colors leading-tight`}
            >
              {brandConfig.brandName.prefix}
              <span className="text-[#b87333]">{brandConfig.brandName.highlight}</span>
            </span>

            {adminBadge && (
              <span className="text-[10px] uppercase font-bold tracking-widest bg-[#fbf2ea] text-[#8f5222] px-2 py-0.5 rounded-full border border-[#ebdcd0]">
                Admin Panel
              </span>
            )}
          </div>

          {variant === 'full' && showSubtitle && (
            <span className={`${sizeStyles.subtext} uppercase text-[#8c7768] font-bold leading-none mt-0.5`}>
              {brandConfig.brandName.subtitle}
            </span>
          )}
        </div>
      )}
    </>
  );

  if (asLink) {
    return (
      <Link href={href} className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
        {content}
      </Link>
    );
  }

  return <div className={`flex items-center gap-2.5 ${className}`}>{content}</div>;
};
