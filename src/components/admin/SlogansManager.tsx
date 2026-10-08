'use client';

import React, { useState, useEffect } from 'react';
import {
  sloganService,
  MultilingualSlogans,
  LanguageSlogans,
  SupportedLocale,
  DEFAULT_MULTILINGUAL_SLOGANS,
} from '@/lib/sloganService';
import {
  Quote,
  Save,
  RotateCcw,
  Check,
  Sparkles,
  Eye,
  Coffee,
  Globe,
  Compass,
  MapPin,
  Image as ImageIcon,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { InstagramIcon } from '@/components/common/InstagramIcon';

interface LanguageTab {
  key: SupportedLocale;
  label: string;
  flag: string;
  nativeName: string;
}

const LANGUAGES: LanguageTab[] = [
  { key: 'az', label: 'Azərbaycan', flag: '🇦🇿', nativeName: 'Azərbaycanca' },
  { key: 'en', label: 'İngilis dili', flag: '🇬🇧', nativeName: 'English' },
  { key: 'ru', label: 'Rus dili', flag: '🇷🇺', nativeName: 'Русский' },
];

export const SlogansManager: React.FC = () => {
  const [multilingualData, setMultilingualData] = useState<MultilingualSlogans>(
    DEFAULT_MULTILINGUAL_SLOGANS
  );
  const [activeLocale, setActiveLocale] = useState<SupportedLocale>('az');
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [activePreviewSection, setActivePreviewSection] = useState<'hero' | 'sections' | 'footer'>('hero');

  useEffect(() => {
    setMultilingualData(sloganService.getMultilingualSlogans());
  }, []);

  const currentSlogans: LanguageSlogans = multilingualData[activeLocale] || DEFAULT_MULTILINGUAL_SLOGANS[activeLocale];

  const handleFieldChange = (field: keyof LanguageSlogans, value: string) => {
    setMultilingualData((prev) => ({
      ...prev,
      [activeLocale]: {
        ...prev[activeLocale],
        [field]: value,
      },
    }));
  };

  const handleSaveActiveLocale = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sloganService.saveSlogansForLocale(activeLocale, currentSlogans);
    const langLabel = LANGUAGES.find((l) => l.key === activeLocale)?.label || activeLocale;
    setSavedSuccess(`${langLabel} şüar və mətnləri yadda saxlanıldı!`);
    setTimeout(() => setSavedSuccess(null), 3500);
  };

  const handleSaveAll = () => {
    sloganService.saveAllSlogans(multilingualData);
    setSavedSuccess('Bütün dillərdə (AZ, EN, RU) mətnlər uğurla yadda saxlanıldı!');
    setTimeout(() => setSavedSuccess(null), 3500);
  };

  const handleResetCurrentLocale = () => {
    const langLabel = LANGUAGES.find((l) => l.key === activeLocale)?.label || activeLocale;
    if (confirm(`${langLabel} üçün bütün şüarları ilkin standart vəziyyətə qaytarmaq istəyirsiniz?`)) {
      sloganService.resetLocaleSlogans(activeLocale);
      setMultilingualData((prev) => ({
        ...prev,
        [activeLocale]: { ...DEFAULT_MULTILINGUAL_SLOGANS[activeLocale] },
      }));
      setSavedSuccess(`${langLabel} standart vəziyyətə qaytarıldı!`);
      setTimeout(() => setSavedSuccess(null), 3500);
    }
  };

  const handleResetAll = () => {
    if (confirm('Bütün dillər üçün şüar və mətnləri standart ilkin vəziyyətə qaytarmaq istəyirsiniz?')) {
      sloganService.resetAllSlogans();
      setMultilingualData(DEFAULT_MULTILINGUAL_SLOGANS);
      setSavedSuccess('Bütün dillər ilkin standart vəziyyətə qaytarıldı!');
      setTimeout(() => setSavedSuccess(null), 3500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl border border-[#ebdcd0] p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-2 rounded-xl bg-[#fbf2ea] text-[#b87333]">
                <Quote className="w-5 h-5" />
              </span>
              <h2 className="font-serif text-xl font-bold text-[#221710]">
                Çoxdilli Şüarlar & Mətnlər İdarəetməsi
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#786455] max-w-3xl leading-relaxed">
              RoastBar saytının əsas şüarlarını, bölmə başlıqlarını, düymə mətnlərini və təsvirlərini hər 3 dildə
              (<strong>Azərbaycan</strong>, <strong>İngilis</strong> və <strong>Rus</strong>) ayrı-ayrılıqda idarə edin.
              Saytda dərhal tətbiq olunur.
            </p>
          </div>

          {savedSuccess && (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{savedSuccess}</span>
            </div>
          )}
        </div>

        {/* Language Tabs */}
        <div className="mt-6 pt-5 border-t border-[#ebdcd0] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#786455] uppercase tracking-wider mr-1 hidden sm:inline-flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#b87333]" />
              Redaktə Dili:
            </span>
            <div className="inline-flex p-1 rounded-xl bg-[#f6efe7] border border-[#ebdcd0]">
              {LANGUAGES.map((lang) => {
                const isActive = activeLocale === lang.key;
                return (
                  <button
                    key={lang.key}
                    type="button"
                    onClick={() => setActiveLocale(lang.key)}
                    className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#b87333] to-[#9c5c28] text-white shadow-sm'
                        : 'text-[#786455] hover:text-[#221710] hover:bg-white/60'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#ebdcd0] text-[#5c4a3e]'
                      }`}
                    >
                      {lang.key.toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-3.5 py-2 rounded-xl bg-[#221710] hover:bg-[#342419] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Bütün dillərdəki dəyişiklikləri yadda saxla"
            >
              <Save className="w-3.5 h-3.5 text-[#b87333]" />
              <span className="hidden sm:inline">Bütün Dilləri</span> Yadda Saxla
            </button>
            <button
              type="button"
              onClick={handleResetAll}
              className="px-3 py-2 rounded-xl bg-[#fdfbf7] hover:bg-[#f6efe7] text-[#786455] hover:text-[#221710] border border-[#ebdcd0] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
              title="Bütün 3 dildə standart mətnləri bərpa et"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Bütün Sıfırla</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT COLUMN: FORM INPUTS ================= */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSaveActiveLocale} className="space-y-6">
            {/* Active Language Notice Banner */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <span className="text-base">{LANGUAGES.find((l) => l.key === activeLocale)?.flag}</span>
                <span>
                  Hazırda redaktə olunan dil: <strong>{LANGUAGES.find((l) => l.key === activeLocale)?.nativeName}</strong> ({activeLocale.toUpperCase()})
                </span>
              </div>
              <span className="text-[11px] text-amber-700 font-medium hidden sm:inline">
                Dəyişib dərhal yadda saxlayın
              </span>
            </div>

            {/* SECTION 1: HERO GİRİŞ BÖLMƏSİ */}
            <div className="bg-white rounded-2xl border border-[#ebdcd0] p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#ebdcd0]">
                <div className="w-7 h-7 rounded-lg bg-[#fbf2ea] flex items-center justify-center text-[#b87333] font-bold text-xs">
                  1
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#221710]">
                    Hero Giriş Bölməsi (Əsas Səhifə)
                  </h3>
                  <p className="text-[11px] text-[#786455]">
                    Sayt açılan kimi ziyarətçini qarşılayan ən böyük giriş bloku.
                  </p>
                </div>
              </div>

              {/* 1.1 Hero Badge */}
              <div>
                <label className="block text-xs font-bold text-[#221710] uppercase tracking-wider mb-1.5">
                  Nişan / Badge Mətni (Hero Badge)
                </label>
                <input
                  type="text"
                  value={currentSlogans.heroBadge}
                  onChange={(e) => handleFieldChange('heroBadge', e.target.value)}
                  placeholder="məs: Boutique Coffee Bar"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0] text-xs sm:text-sm text-[#221710] focus:outline-none focus:border-[#b87333] focus:bg-white transition-colors"
                  required
                />
                <span className="text-[11px] text-[#8c7464] block mt-1">
                  Yuxarıda nöqtə ilə görünən balaca brend nişanı.
                </span>
              </div>

              {/* 1.2 Hero Title */}
              <div>
                <label className="block text-xs font-bold text-[#221710] uppercase tracking-wider mb-1.5">
                  Əsas Baş Şüar (Hero Başlıq)
                </label>
                <textarea
                  rows={2}
                  value={currentSlogans.heroTitle}
                  onChange={(e) => handleFieldChange('heroTitle', e.target.value)}
                  placeholder="məs: Hər Qurtumda Əsl Qəhvə Həzzini Yaşayın"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0] text-xs sm:text-sm text-[#221710] focus:outline-none focus:border-[#b87333] focus:bg-white transition-colors font-serif font-bold"
                  required
                />
                <span className="text-[11px] text-[#8c7464] block mt-1">
                  Böyük şriftli əsas cümlə.
                </span>
              </div>

              {/* 1.3 Hero Subtitle */}
              <div>
                <label className="block text-xs font-bold text-[#221710] uppercase tracking-wider mb-1.5">
                  Alt İzahlı Şüar (Hero Alt Təsvir)
                </label>
                <textarea
                  rows={3}
                  value={currentSlogans.heroSubtitle}
                  onChange={(e) => handleFieldChange('heroSubtitle', e.target.value)}
                  placeholder="məs: Təzə qovrulmuş tək mənşəli dənələr, peşəkar baristalar və axşam 00:30-dək rahat atmosfer."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0] text-xs sm:text-sm text-[#221710] focus:outline-none focus:border-[#b87333] focus:bg-white transition-colors leading-relaxed"
                  required
                />
                <span className="text-[11px] text-[#8c7464] block mt-1">
                  Əsas başlığın altında görünən cəlbedici təsvir cümləsi.
                </span>
              </div>

              {/* 1.4 Hero Buttons Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-[#221710] uppercase tracking-wider mb-1.5">
                    Menyu Düyməsi Mətni
                  </label>
                  <input
                    type="text"
                    value={currentSlogans.heroViewMenuBtn}
                    onChange={(e) => handleFieldChange('heroViewMenuBtn', e.target.value)}
                    placeholder="Tam Menyuya Bax"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0] text-xs sm:text-sm text-[#221710] focus:outline-none focus:border-[#b87333] focus:bg-white transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#221710] uppercase tracking-wider mb-1.5">
                    Ziyarət Düyməsi Mətni
                  </label>
                  <input
                    type="text"
                    value={currentSlogans.heroVisitUsBtn}
                    onChange={(e) => handleFieldChange('heroVisitUsBtn', e.target.value)}
                    placeholder="Bizi Ziyarət Edin"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0] text-xs sm:text-sm text-[#221710] focus:outline-none focus:border-[#b87333] focus:bg-white transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: BREND & FOOTER */}
            <div className="bg-white rounded-2xl border border-[#ebdcd0] p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#ebdcd0]">
                <div className="w-7 h-7 rounded-lg bg-[#fbf2ea] flex items-center justify-center text-[#b87333] font-bold text-xs">
                  2
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#221710]">
                    Brend Şüarı & Footer (Saytın Sonu)
                  </h3>
                  <p className="text-[11px] text-[#786455]">
                    Loqonun yanı və saytın ən aşağı footer hissəsindəki təsvir mətnləri.
                  </p>
                </div>
              </div>

              {/* 2.1 Brand Tagline */}
              <div>
                <label className="block text-xs font-bold text-[#221710] uppercase tracking-wider mb-1.5">
                  Brendin Şüarı / Kateqoriya İzahı
                </label>
                <input
                  type="text"
                  value={currentSlogans.brandTagline}
                  onChange={(e) => handleFieldChange('brandTagline', e.target.value)}
                  placeholder="məs: Premium Qəhvə & Desert Evi"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0] text-xs sm:text-sm text-[#221710] focus:outline-none focus:border-[#b87333] focus:bg-white transition-colors"
                  required
                />
                <span className="text-[11px] text-[#8c7464] block mt-1">
                  Brendin fəaliyyət şüarı (məs: Premium Qəhvə & Desert Evi).
                </span>
              </div>

              {/* 2.2 Short Desc Footer */}
              <div>
                <label className="block text-xs font-bold text-[#221710] uppercase tracking-wider mb-1.5">
                  Qısa Brend Təsviri (Footer Mətni)
                </label>
                <textarea
                  rows={2}
                  value={currentSlogans.shortDesc}
                  onChange={(e) => handleFieldChange('shortDesc', e.target.value)}
                  placeholder="məs: Bakının mərkəzində seçilmiş qəhvə dənələri, sənətkar yanaşması və rahat ab-hava."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0] text-xs sm:text-sm text-[#221710] focus:outline-none focus:border-[#b87333] focus:bg-white transition-colors leading-relaxed"
                  required
                />
                <span className="text-[11px] text-[#8c7464] block mt-1">
                  Saytın aşağısında loqonun altındakı izah mətni.
                </span>
              </div>
            </div>

            {/* SECTION 3: BÖLMƏ BAŞLIQLARI & MƏTNLƏRİ */}
            <div className="bg-white rounded-2xl border border-[#ebdcd0] p-5 sm:p-6 shadow-2xs space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-[#ebdcd0]">
                <div className="w-7 h-7 rounded-lg bg-[#fbf2ea] flex items-center justify-center text-[#b87333] font-bold text-xs">
                  3
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#221710]">
                    Bölmə Başlıqları & Alt İzahları
                  </h3>
                  <p className="text-[11px] text-[#786455]">
                    Günün seçimi, Menyu, Qalereya, Instagram və Əlaqə bölmələrinin başlıqları.
                  </p>
                </div>
              </div>

              {/* 3.1 Featured Banner Badge */}
              <div className="p-3.5 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0]">
                <label className="block text-xs font-bold text-[#221710] uppercase tracking-wider mb-1.5">
                  🌟 Günün Seçimi (Featured Banner) Nişanı
                </label>
                <input
                  type="text"
                  value={currentSlogans.featuredBannerBadge}
                  onChange={(e) => handleFieldChange('featuredBannerBadge', e.target.value)}
                  placeholder="Günün Seçimi / Featured"
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#ebdcd0] text-xs sm:text-sm text-[#221710] focus:outline-none focus:border-[#b87333]"
                  required
                />
              </div>

              {/* 3.2 Menu Section */}
              <div className="p-3.5 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0] space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#8f5222] uppercase tracking-wider">
                  <Coffee className="w-3.5 h-3.5 text-[#b87333]" />
                  <span>Menyu Bölməsi</span>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#5c4a3e] mb-1">
                    Başlıq
                  </label>
                  <input
                    type="text"
                    value={currentSlogans.menuTitle}
                    onChange={(e) => handleFieldChange('menuTitle', e.target.value)}
                    placeholder="Bizim Menyu"
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#ebdcd0] text-xs sm:text-sm text-[#221710] focus:outline-none focus:border-[#b87333]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#5c4a3e] mb-1">
                    Alt Təsvir
                  </label>
                  <textarea
                    rows={2}
                    value={currentSlogans.menuSubtitle}
                    onChange={(e) => handleFieldChange('menuSubtitle', e.target.value)}
                    placeholder="Hər zövqə uyğun seçilmiş qəhvələr..."
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#ebdcd0] text-xs text-[#221710] focus:outline-none focus:border-[#b87333]"
                    required
                  />
                </div>
              </div>

              {/* 3.3 Gallery Section */}
              <div className="p-3.5 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0] space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#8f5222] uppercase tracking-wider">
                  <ImageIcon className="w-3.5 h-3.5 text-[#b87333]" />
                  <span>İnteryer Qalereyası Bölməsi</span>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#5c4a3e] mb-1">
                    Başlıq
                  </label>
                  <input
                    type="text"
                    value={currentSlogans.galleryTitle}
                    onChange={(e) => handleFieldChange('galleryTitle', e.target.value)}
                    placeholder="İnteryer & Ab-hava"
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#ebdcd0] text-xs sm:text-sm text-[#221710] focus:outline-none focus:border-[#b87333]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#5c4a3e] mb-1">
                    Alt Təsvir
                  </label>
                  <textarea
                    rows={2}
                    value={currentSlogans.gallerySubtitle}
                    onChange={(e) => handleFieldChange('gallerySubtitle', e.target.value)}
                    placeholder="İşləmək, söhbət etmək və xoş xatirələr yaratmaq üçün..."
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#ebdcd0] text-xs text-[#221710] focus:outline-none focus:border-[#b87333]"
                    required
                  />
                </div>
              </div>

              {/* 3.4 Instagram Section */}
              <div className="p-3.5 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0] space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#8f5222] uppercase tracking-wider">
                  <InstagramIcon className="w-3.5 h-3.5 text-[#e1306c]" />
                  <span>Instagram Bölməsi</span>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#5c4a3e] mb-1">
                    Başlıq
                  </label>
                  <input
                    type="text"
                    value={currentSlogans.instagramTitle}
                    onChange={(e) => handleFieldChange('instagramTitle', e.target.value)}
                    placeholder="Bizi Instagram-da İzləyin"
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#ebdcd0] text-xs sm:text-sm text-[#221710] focus:outline-none focus:border-[#b87333]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#5c4a3e] mb-1">
                    Alt Təsvir
                  </label>
                  <textarea
                    rows={2}
                    value={currentSlogans.instagramSubtitle}
                    onChange={(e) => handleFieldChange('instagramSubtitle', e.target.value)}
                    placeholder="Ən son anlar, yeni dadlar və xüsusi təkliflərimiz..."
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#ebdcd0] text-xs text-[#221710] focus:outline-none focus:border-[#b87333]"
                    required
                  />
                </div>
              </div>

              {/* 3.5 Contact Section */}
              <div className="p-3.5 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0] space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#8f5222] uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-[#b87333]" />
                  <span>Əlaqə & Ünvan Bölməsi</span>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#5c4a3e] mb-1">
                    Başlıq
                  </label>
                  <input
                    type="text"
                    value={currentSlogans.contactTitle}
                    onChange={(e) => handleFieldChange('contactTitle', e.target.value)}
                    placeholder="Görüş Yeri: RoastBar"
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#ebdcd0] text-xs sm:text-sm text-[#221710] focus:outline-none focus:border-[#b87333]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#5c4a3e] mb-1">
                    Alt Təsvir
                  </label>
                  <textarea
                    rows={2}
                    value={currentSlogans.contactSubtitle}
                    onChange={(e) => handleFieldChange('contactSubtitle', e.target.value)}
                    placeholder="Şəhərin ürəyində sevdiyiniz qəhvə ilə..."
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#ebdcd0] text-xs text-[#221710] focus:outline-none focus:border-[#b87333]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Bottom Form Action Buttons */}
            <div className="p-4 rounded-2xl bg-white border border-[#ebdcd0] shadow-2xs flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-[#b87333] to-[#9c5c28] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#b87333]/20 hover:from-[#c78242] hover:to-[#a9662f] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>
                  {LANGUAGES.find((l) => l.key === activeLocale)?.label} ({activeLocale.toUpperCase()}) Mətnlərini Yadda Saxla
                </span>
              </button>

              <button
                type="button"
                onClick={handleResetCurrentLocale}
                className="py-3 px-4 rounded-xl bg-[#fdfbf7] hover:bg-[#f6efe7] text-[#786455] hover:text-[#221710] border border-[#ebdcd0] font-semibold text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-1.5"
                title={`${activeLocale.toUpperCase()} mətnlərini standart vəziyyətə qaytar`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Bu Dili Sıfırla</span>
              </button>
            </div>
          </form>
        </div>

        {/* ================= RIGHT COLUMN: LIVE REAL-TIME PREVIEW ================= */}
        <div className="lg:col-span-5 space-y-4 sticky top-6">
          <div className="bg-white rounded-2xl border border-[#ebdcd0] p-5 shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-[#ebdcd0]">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#b87333]" />
                <h3 className="font-serif font-bold text-sm text-[#221710]">
                  Canlı Ön Baxış ({activeLocale.toUpperCase()})
                </h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#fbf2ea] text-[#8f5222] font-bold border border-[#ebdcd0]">
                {LANGUAGES.find((l) => l.key === activeLocale)?.flag}{' '}
                {LANGUAGES.find((l) => l.key === activeLocale)?.label}
              </span>
            </div>

            {/* Preview Sub-tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#f6efe7] border border-[#ebdcd0] mb-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActivePreviewSection('hero')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                  activePreviewSection === 'hero'
                    ? 'bg-white text-[#221710] shadow-2xs'
                    : 'text-[#786455] hover:text-[#221710]'
                }`}
              >
                Hero Giriş
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewSection('sections')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                  activePreviewSection === 'sections'
                    ? 'bg-white text-[#221710] shadow-2xs'
                    : 'text-[#786455] hover:text-[#221710]'
                }`}
              >
                Bölmələr
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewSection('footer')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                  activePreviewSection === 'footer'
                    ? 'bg-white text-[#221710] shadow-2xs'
                    : 'text-[#786455] hover:text-[#221710]'
                }`}
              >
                Brend & Footer
              </button>
            </div>

            {/* PREVIEW: HERO */}
            {activePreviewSection === 'hero' && (
              <div className="p-5 rounded-2xl border border-[#ebdcd0] bg-gradient-to-b from-[#fdfbf7] via-[#faf4ed] to-[#f4e8dc] text-center relative overflow-hidden shadow-inner">
                {/* Floating blur ball */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#b87333]/15 rounded-full blur-2xl pointer-events-none" />

                {/* Badge Preview */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#ebdcd0] shadow-2xs mb-3.5">
                  <span className="w-2 h-2 rounded-full bg-[#b87333] animate-pulse" />
                  <span className="text-[10px] font-bold tracking-wider uppercase text-[#8f5222]">
                    {currentSlogans.heroBadge || 'Boutique Coffee Bar'}
                  </span>
                  <span className="text-[#c4b3a4]">•</span>
                  <span className="text-[10px] text-[#5c4a3e] font-semibold">Baku</span>
                </div>

                {/* Title Preview */}
                <h4 className="font-serif text-lg sm:text-xl font-bold text-[#221710] leading-snug">
                  {currentSlogans.heroTitle || 'Hər Qurtumda Əsl Qəhvə Həzzini Yaşayın'}
                </h4>

                {/* Subtitle Preview */}
                <p className="mt-2.5 text-xs text-[#5c4a3e] leading-relaxed line-clamp-3">
                  {currentSlogans.heroSubtitle ||
                    'Təzə qovrulmuş tək mənşəli dənələr, peşəkar baristalar və axşam 00:30-dək rahat atmosfer.'}
                </p>

                {/* Buttons Preview */}
                <div className="mt-4 pt-3.5 border-t border-[#ebdcd0]/70 flex flex-wrap items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-gradient-to-r from-[#b87333] to-[#9c5c28] px-3.5 py-1.5 rounded-xl shadow-2xs">
                    <Coffee className="w-3 h-3" />
                    <span>{currentSlogans.heroViewMenuBtn || 'Menyuya Bax'}</span>
                  </span>

                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8f5222] bg-white/90 border border-[#ebdcd0] px-3 py-1.5 rounded-xl">
                    <Compass className="w-3 h-3" />
                    <span>{currentSlogans.heroVisitUsBtn || 'Bizi Ziyarət Edin'}</span>
                  </span>
                </div>
              </div>
            )}

            {/* PREVIEW: SECTIONS */}
            {activePreviewSection === 'sections' && (
              <div className="space-y-3">
                {/* Featured Banner Preview */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-[#fdf7f0] to-[#f5e7d8] border border-[#ebdcd0]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#8f5222] bg-[#b87333]/15 px-2 py-0.5 rounded-full border border-[#b87333]/20">
                      {currentSlogans.featuredBannerBadge || 'Günün Seçimi'}
                    </span>
                    <Sparkles className="w-3 h-3 text-[#b87333]" />
                  </div>
                  <div className="text-xs font-serif font-bold text-[#221710]">
                    Iced Spanish Latte
                  </div>
                </div>

                {/* Menu Section Preview */}
                <div className="p-3 rounded-xl bg-[#fbf5ee] border border-[#ebdcd0]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8f5222] flex items-center gap-1 mb-0.5">
                    <Coffee className="w-3 h-3 text-[#b87333]" />
                    <span>{currentSlogans.menuTitle || 'Bizim Menyu'}</span>
                  </div>
                  <div className="text-[11px] text-[#5c4a3e] line-clamp-1">
                    {currentSlogans.menuSubtitle}
                  </div>
                </div>

                {/* Gallery Section Preview */}
                <div className="p-3 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8f5222] flex items-center gap-1 mb-0.5">
                    <ImageIcon className="w-3 h-3 text-[#b87333]" />
                    <span>{currentSlogans.galleryTitle || 'İnteryer & Ab-hava'}</span>
                  </div>
                  <div className="text-[11px] text-[#5c4a3e] line-clamp-1">
                    {currentSlogans.gallerySubtitle}
                  </div>
                </div>

                {/* Instagram Section Preview */}
                <div className="p-3 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8f5222] flex items-center gap-1 mb-0.5">
                    <InstagramIcon className="w-3 h-3" />
                    <span>{currentSlogans.instagramTitle || 'Bizi Instagram-da İzləyin'}</span>
                  </div>
                  <div className="text-[11px] text-[#5c4a3e] line-clamp-1">
                    {currentSlogans.instagramSubtitle}
                  </div>
                </div>

                {/* Contact Section Preview */}
                <div className="p-3 rounded-xl bg-[#fdfbf7] border border-[#ebdcd0]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8f5222] flex items-center gap-1 mb-0.5">
                    <MapPin className="w-3 h-3 text-[#b87333]" />
                    <span>{currentSlogans.contactTitle || 'Görüş Yeri: RoastBar'}</span>
                  </div>
                  <div className="text-[11px] text-[#5c4a3e] line-clamp-1">
                    {currentSlogans.contactSubtitle}
                  </div>
                </div>
              </div>
            )}

            {/* PREVIEW: BRAND & FOOTER */}
            {activePreviewSection === 'footer' && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#f6efe7] border border-[#ebdcd0]">
                  <div className="text-xs font-serif font-bold text-[#221710] mb-0.5">
                    RoastBar Baku
                  </div>
                  <div className="text-[11px] font-medium text-[#b87333] mb-2">
                    {currentSlogans.brandTagline || 'Premium Qəhvə & Desert Evi'}
                  </div>
                  <p className="text-[11px] text-[#786455] leading-relaxed">
                    {currentSlogans.shortDesc ||
                      'Bakının mərkəzində seçilmiş qəhvə dənələri, sənətkar yanaşması və rahat ab-hava.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick tips card */}
          <div className="bg-[#fbf5ee] rounded-2xl border border-[#ebdcd0] p-4 text-xs text-[#786455] space-y-1.5">
            <div className="font-bold text-[#221710] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#b87333]" />
              Faydalı Qeyd
            </div>
            <p className="text-[11px] leading-relaxed">
              Ziyarətçi saytda dili dəyişdikdə (məsələn İngilis və ya Rus dilini seçdikdə), həmin dil üçün burada qeyd
              etdiyiniz fərdi şüarlar və bölmə başlıqları avtomatik göstəriləcək.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
