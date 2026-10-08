/**
 * ==============================================================================
 * ROASTBAR INSTAGRAM TƏNZİMLƏMƏLƏRİ (REAL EMBED SİSTEMİ)
 * ==============================================================================
 * 
 * Bu fayl vasitəsilə @roastbarbaku səhifəsinin REAL post və reel linklərini 
 * birbaşa əlavə edə bilərsiniz.
 * 
 * NECƏ İSTİFADƏ EDİLİR?
 * 1. Instagram tətbiqində və ya brauzerdə @roastbarbaku səhifəsinə daxil olun.
 * 2. İstədiyiniz postun və ya reel-in linkini kopyalayın (Paylaş -> Linki kopyala).
 * 3. Aşağıdakı `realPostUrls` massivinə həmin real linkləri əlavə edin.
 * 
 * Məsələn:
 * 'https://www.instagram.com/p/XXXXXXX/',
 * 'https://www.instagram.com/reel/YYYYYYY/',
 * ==============================================================================
 */

export interface RealInstagramEmbed {
  url: string;
  type: 'post' | 'reel';
  shortcode: string;
}

export function parseInstagramUrl(rawUrl: string): RealInstagramEmbed | null {
  if (!rawUrl) return null;
  const clean = rawUrl.trim();

  // /reel/XXXXX/
  const reelMatch = clean.match(/instagram\.com\/(?:[a-zA-Z0-9._-]+\/)?reel\/([A-Za-z0-9_-]+)/);
  if (reelMatch && reelMatch[1]) {
    return {
      url: `https://www.instagram.com/reel/${reelMatch[1]}/`,
      type: 'reel',
      shortcode: reelMatch[1],
    };
  }

  // /p/XXXXX/
  const pMatch = clean.match(/instagram\.com\/(?:[a-zA-Z0-9._-]+\/)?p\/([A-Za-z0-9_-]+)/);
  if (pMatch && pMatch[1]) {
    return {
      url: `https://www.instagram.com/p/${pMatch[1]}/`,
      type: 'post',
      shortcode: pMatch[1],
    };
  }

  return null;
}

export const instagramConfig = {
  // Rəsmi Instagram hesabı:
  accountHandle: 'roastbarbaku',
  accountUrl: 'https://www.instagram.com/roastbarbaku',

  /**
   * @roastbarbaku səhifənizdən birbaşa kopyaladığınız REAL post və reel linkləri:
   * (İstədiyiniz qədər post linki əlavə edə bilərsiniz)
   */
  realPostUrls: [
    // Real linklər buraya daxil edilir:
    // Məsələn: 'https://www.instagram.com/p/...',
  ] as string[],
};

const STORAGE_KEY = 'roastbar_custom_instagram_urls';

export const instagramService = {
  getStoredUrls(): string[] {
    if (typeof window === 'undefined') return instagramConfig.realPostUrls;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return instagramConfig.realPostUrls;
  },

  saveStoredUrls(urls: string[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
      window.dispatchEvent(new Event('instagramchange'));
    } catch (e) {
      console.warn('Failed to save instagram urls:', e);
    }
  },

  getEmbedPosts(): RealInstagramEmbed[] {
    const urls = this.getStoredUrls();
    const result: RealInstagramEmbed[] = [];
    for (const u of urls) {
      const parsed = parseInstagramUrl(u);
      if (parsed) {
        result.push(parsed);
      }
    }
    return result;
  },
};
