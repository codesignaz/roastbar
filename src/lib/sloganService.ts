/**
 * ==============================================================================
 * ROASTBAR BREND ŞÜARLARI & MƏTNLƏRİ SERVİSİ (ÇOXDİLLİ / MULTILINGUAL)
 * ==============================================================================
 * Admin panelindən hər dil üçün (AZ, EN, RU) ayrı-ayrılıqda idarə olunan
 * əsas şüarlar, başlıqlar və bölmə təsvirləri.
 */

export interface LanguageSlogans {
  // Hero Bölməsi
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroViewMenuBtn: string;
  heroVisitUsBtn: string;

  // Brend & Footer
  brandTagline: string;
  shortDesc: string;

  // Bölmə Başlıqları & Şüarları
  featuredBannerBadge: string;
  menuTitle: string;
  menuSubtitle: string;
  galleryTitle: string;
  gallerySubtitle: string;
  instagramTitle: string;
  instagramSubtitle: string;
  contactTitle: string;
  contactSubtitle: string;
}

export type SupportedLocale = 'az' | 'en' | 'ru';

export interface MultilingualSlogans {
  az: LanguageSlogans;
  en: LanguageSlogans;
  ru: LanguageSlogans;
}

export const DEFAULT_MULTILINGUAL_SLOGANS: MultilingualSlogans = {
  az: {
    heroBadge: 'Boutique Coffee Bar',
    heroTitle: 'Hər Qurtumda Əsl Qəhvə Həzzini Yaşayın',
    heroSubtitle: 'Təzə qovrulmuş tək mənşəli dənələr, peşəkar baristalar və axşam 00:30-dək rahat atmosfer.',
    heroViewMenuBtn: 'Tam Menyuya Bax',
    heroVisitUsBtn: 'Bizi Ziyarət Edin',
    brandTagline: 'Premium Qəhvə & Desert Evi',
    shortDesc: 'Bakının mərkəzində seçilmiş qəhvə dənələri, sənətkar yanaşması və rahat ab-hava.',
    featuredBannerBadge: 'Günün Seçimi / Featured',
    menuTitle: 'Bizim Menyu',
    menuSubtitle: 'Hər zövqə uyğun seçilmiş qəhvələr, təzə sıxılmış içkilər və xüsusi desertlər.',
    galleryTitle: 'İnteryer & Ab-hava',
    gallerySubtitle: 'İşləmək, söhbət etmək və xoş xatirələr yaratmaq üçün nəzərdə tutulmuş isti guşəmiz.',
    instagramTitle: 'Bizi Instagram-da İzləyin',
    instagramSubtitle: 'Ən son anlar, yeni dadlar və xüsusi təkliflərimiz @roastbarbaku səhifəsində.',
    contactTitle: 'Görüş Yeri: RoastBar',
    contactSubtitle: 'Şəhərin ürəyində sevdiyiniz qəhvə ilə gününüzü unudulmaz edin.',
  },
  en: {
    heroBadge: 'Boutique Coffee Bar',
    heroTitle: 'Crafted Moments in Every Single Sip',
    heroSubtitle: 'Single-origin roast profiles, master baristas, and an inspiring ambiance open until 00:30 daily.',
    heroViewMenuBtn: 'Explore Full Menu',
    heroVisitUsBtn: 'Visit Our Bar',
    brandTagline: 'Artisan Specialty Coffee & Desserts',
    shortDesc: 'Artisanal single-origin beans, precision brewing, and a cozy haven in the heart of Baku.',
    featuredBannerBadge: "Barista's Choice / Featured",
    menuTitle: 'Curated Menu',
    menuSubtitle: 'From delicate pour-overs and creamy signatures to fresh pastries and artisan cheesecakes.',
    galleryTitle: 'Interior & Vibe',
    gallerySubtitle: 'An intimate sanctuary designed for inspiring work, meaningful talks, and pure relaxation.',
    instagramTitle: 'Follow Us on Instagram',
    instagramSubtitle: 'Behind-the-scenes coffee stories, fresh drops, and daily moments @roastbarbaku.',
    contactTitle: 'Where to Find RoastBar',
    contactSubtitle: 'Located on Shihali Gurbanov (Fizuli) 2/15. We are ready to brew your favorite cup.',
  },
  ru: {
    heroBadge: 'Бутик-кофейня в Баку',
    heroTitle: 'Истинное Удовольствие в Каждой Чашке',
    heroSubtitle: 'Моносорта спешелти кофе, опытные бариста и вдохновляющая атмосфера до 00:30 каждый день.',
    heroViewMenuBtn: 'Смотреть Меню',
    heroVisitUsBtn: 'Прийти в Кофейню',
    brandTagline: 'Спешелти Кофе & Авторские Десерты',
    shortDesc: 'Отборное зерно свежей обжарки, мастерство бариста и уютная атмосфера в центре Баку.',
    featuredBannerBadge: 'Выбор Бариста / Рекомендация',
    menuTitle: 'Наше Меню',
    menuSubtitle: 'От классического эспрессо и фильтр-кофе до авторских напитков и свежей выпечки.',
    galleryTitle: 'Интерьер и Атмосфера',
    gallerySubtitle: 'Теплое и эстетичное пространство для продуктивной работы, встреч и душевных бесед.',
    instagramTitle: 'Мы в Instagram',
    instagramSubtitle: 'Кофейная эстетика, закулисье и ежедневные истории на нашей странице @roastbarbaku.',
    contactTitle: 'Встречаемся в RoastBar',
    contactSubtitle: 'Насладитесь любимым кофе и десертами в самом сердце Баку.',
  },
};

const STORAGE_KEY = 'roastbar_multilingual_slogans';

export const sloganService = {
  getMultilingualSlogans(): MultilingualSlogans {
    if (typeof window === 'undefined') {
      return DEFAULT_MULTILINGUAL_SLOGANS;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          az: { ...DEFAULT_MULTILINGUAL_SLOGANS.az, ...(parsed.az || {}) },
          en: { ...DEFAULT_MULTILINGUAL_SLOGANS.en, ...(parsed.en || {}) },
          ru: { ...DEFAULT_MULTILINGUAL_SLOGANS.ru, ...(parsed.ru || {}) },
        };
      }
    } catch {
      // fallback
    }

    return DEFAULT_MULTILINGUAL_SLOGANS;
  },

  async syncWithServer(): Promise<MultilingualSlogans | null> {
    if (typeof window === 'undefined') return null;
    try {
      const res = await fetch('/api/slogans', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && (data.az || data.en || data.ru)) {
          const merged: MultilingualSlogans = {
            az: { ...DEFAULT_MULTILINGUAL_SLOGANS.az, ...(data.az || {}) },
            en: { ...DEFAULT_MULTILINGUAL_SLOGANS.en, ...(data.en || {}) },
            ru: { ...DEFAULT_MULTILINGUAL_SLOGANS.ru, ...(data.ru || {}) },
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          window.dispatchEvent(new Event('sloganschange'));
          return merged;
        }
      }
    } catch (e) {
      // offline or silent fallback
    }
    return null;
  },

  getSlogansForLocale(locale: SupportedLocale): LanguageSlogans {
    const all = this.getMultilingualSlogans();
    return all[locale] || all.az || DEFAULT_MULTILINGUAL_SLOGANS.az;
  },

  async saveSlogansForLocale(locale: SupportedLocale, slogans: Partial<LanguageSlogans>): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const all = this.getMultilingualSlogans();
      all[locale] = {
        ...all[locale],
        ...slogans,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      window.dispatchEvent(new Event('sloganschange'));

      // Persist to central database server so all devices see the change
      await fetch('/api/slogans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale, slogans }),
      });
    } catch (e) {
      console.warn('Failed to save locale slogans:', e);
    }
  },

  async saveAllSlogans(newAll: MultilingualSlogans): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAll));
      window.dispatchEvent(new Event('sloganschange'));

      // Persist to central database server
      await fetch('/api/slogans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: newAll }),
      });
    } catch (e) {
      console.warn('Failed to save all slogans:', e);
    }
  },

  async resetLocaleSlogans(locale: SupportedLocale): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const all = this.getMultilingualSlogans();
      all[locale] = { ...DEFAULT_MULTILINGUAL_SLOGANS[locale] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      window.dispatchEvent(new Event('sloganschange'));

      await fetch('/api/slogans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetLocale: locale }),
      });
    } catch (e) {
      console.warn('Failed to reset locale slogans:', e);
    }
  },

  async resetAllSlogans(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event('sloganschange'));

      await fetch('/api/slogans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetAll: true }),
      });
    } catch (e) {
      console.warn('Failed to reset all slogans:', e);
    }
  },
};
