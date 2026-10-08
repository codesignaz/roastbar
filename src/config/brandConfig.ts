/**
 * ==============================================================================
 * ROASTBAR BREND LOQO VƏ İKON TƏNZİMLƏMƏ FAYLI (BRAND CONFIGURATION)
 * ==============================================================================
 * 
 * Bu fayl vasitəsilə saytın əsas logosunu və ikonunu çox asanlıqla tənzimləyə bilərsiniz.
 * Dəyişikliklər dərhal Navbar, Footer, Admin Panel və bütün səhifələrdə əks olunur.
 * 
 * NECƏ İSTİFADƏ ETMƏK OLAR?
 * -------------------------
 * VARİANT 1: Öz hazır Loqo şəklinizi (PNG / SVG / WEBP) yerləşdirmək:
 *   1. Şəklinizi `public/` qovluğuna atın (məsələn `public/logo.png` və ya `public/logo.svg`).
 *   2. Aşağıda `logoMode: 'custom-image'` təyin edin.
 *   3. `logoImage: '/logo.png'` qeyd edin.
 * 
 * VARİANT 2: İkon + Mətn loqosundan istifadə etmək (Hazırkı rejim):
 *   1. `logoMode: 'icon-text'` saxlayın.
 *   2. `iconType` hissəsindən istədiyiniz ikonu seçin: 'coffee' | 'cup' | 'bean' | 'flame' | 'sparkles'
 *   3. Və ya `iconImage: '/icon.svg'` faylını öz SVG ikonunuzla əvəzləyin.
 *   4. `brandName` hissəsində adı və alt yazını istədiyiniz kimi dəyişin.
 * 
 * VARİANT 3: Tam fərdi SVG kodu daxil etmək:
 *   1. `logoMode: 'custom-svg'` təyin edin.
 *   2. `customSvgCode` sahəsinə öz SVG kodunuzu yapışdırın.
 * ==============================================================================
 */

export type LogoMode = 'icon-text' | 'custom-image' | 'custom-svg';
export type BrandIconType =
  | 'coffee'
  | 'cup'
  | 'bean'
  | 'flame'
  | 'sparkles'
  | 'svg-file'
  | 'png-file'
  | 'custom-file';

export interface BrandConfig {
  /**
   * Loqo nümayiş rejimi:
   * - 'icon-text': İkon və stilizə edilmiş mətn (ROASTBAR + Alt yazı)
   * - 'custom-image': public/ qovluğundakı və ya xarici URL-dən loqo şəkli (PNG, SVG, WEBP)
   * - 'custom-svg': Aşağıda təyin edilmiş xüsusi SVG kodu
   */
  logoMode: LogoMode;

  /**
   * 'custom-image' rejimi üçün loqo faylının yolu (public qovluğunda yerləşən fayl)
   * Məsələn: '/logo.svg', '/logo.png', '/images/brand-logo.png'
   */
  logoImage: string;

  /**
   * Müstəqil ikon faylının yolu (favicon, mobil ekran və kiçik ikonlar üçün)
   * Məsələn: '/icon.svg', '/favicon.ico'
   */
  iconImage: string;

  /**
   * 'icon-text' rejimində istifadə olunacaq daxili ikon tipi:
   * 'coffee' | 'cup' | 'bean' | 'flame' | 'sparkles' | 'svg-file'
   */
  iconType: BrandIconType;

  /**
   * Brend adının parametrləri
   */
  brandName: {
    /** Tam ad */
    full: string;
    /** Mətnin birinci tünd hissəsi (məsələn: 'ROAST') */
    prefix: string;
    /** Mətnin vurğulanmış rəngli hissəsi (məsələn: 'BAR') */
    highlight: string;
    /** Loqonun altındakı kiçik zərif yazı (məsələn: 'Specialty Baku') */
    subtitle: string;
  };

  /**
   * Loqo ölçüləri (Piksellərlə)
   */
  dimensions: {
    header: { width: 160, height: 42 },
    footer: { width: 170, height: 44 },
    admin: { width: 150, height: 38 },
  };

  /**
   * 'custom-svg' rejimi üçün xüsusi inline SVG kodu (əgər logoMode: 'custom-svg' olarsa)
   */
  customSvgCode?: string;
}

export const brandConfig: BrandConfig = {
  // 1. Loqo rejimi: 'custom-image' ilə birbaşa public/icon.png həm çərçivənin, həm də mətnin yerini tutur (böyüdülmüş tək loqo kimi)
  logoMode: 'custom-image',

  // 2. Əsas loqo şəkli (böyüdülmüş ikon/loqo faylı):
  logoImage: '/icon.png',

  // 3. İkon faylı (PNG və ya SVG):
  iconImage: '/icon.png',

  // 4. İkon nümayiş növü:
  iconType: 'png-file',

  // 5. Brend mətnləri:
  brandName: {
    full: 'RoastBar',
    prefix: 'ROAST',
    highlight: 'BAR',
    subtitle: 'Specialty Baku',
  },

  // 6. Ölçülər:
  dimensions: {
    header: { width: 160, height: 42 },
    footer: { width: 170, height: 44 },
    admin: { width: 150, height: 38 },
  },
};
