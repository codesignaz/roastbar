import { THEME_PRESETS, ThemePreset } from './themePresets';

const STORAGE_KEY = 'roastbar_site_theme';
const STYLE_ELEMENT_ID = 'roastbar-dynamic-theme-style';

export const themeService = {
  getPresets(): ThemePreset[] {
    return THEME_PRESETS;
  },

  getCurrentThemeId(): string {
    if (typeof window === 'undefined') return 'latte';
    try {
      return localStorage.getItem(STORAGE_KEY) || 'latte';
    } catch {
      return 'latte';
    }
  },

  getCurrentTheme(): ThemePreset {
    const id = this.getCurrentThemeId();
    return THEME_PRESETS.find((p) => p.id === id) || THEME_PRESETS[0];
  },

  saveLocalOnly(themeId: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, themeId);
    } catch {
      // ignore
    }
  },

  async fetchServerThemeId(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    try {
      const res = await fetch('/api/theme', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.themeId && THEME_PRESETS.some((p) => p.id === data.themeId)) {
          return data.themeId;
        }
      }
    } catch {
      // offline or silent fallback
    }
    return null;
  },

  async saveTheme(themeId: string): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, themeId);
      this.applyTheme(themeId);
      window.dispatchEvent(new Event('themechange'));

      // Persist to server so ALL devices (phones, tablets, other PCs) adopt this theme as default
      await fetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId }),
      });
    } catch (e) {
      console.warn('Failed to save theme to server:', e);
    }
  },

  applyTheme(themeId: string): void {
    if (typeof window === 'undefined') return;
    const preset = THEME_PRESETS.find((p) => p.id === themeId) || THEME_PRESETS[0];
    const c = preset.css;

    // Apply CSS variables on documentElement
    const root = document.documentElement;
    root.style.setProperty('--background', c.background);
    root.style.setProperty('--foreground', c.foreground);
    root.style.setProperty('--primary', c.primary);
    root.style.setProperty('--primary-hover', c.primaryHover);
    root.style.setProperty('--primary-light', c.primaryLight);
    root.style.setProperty('--border', c.border);
    root.style.setProperty('--muted', c.subtext);
    root.style.setProperty('--accent', c.accent);

    // Dynamic style element for comprehensive class overrides
    let styleEl = document.getElementById(STYLE_ELEMENT_ID) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = STYLE_ELEMENT_ID;
      document.head.appendChild(styleEl);
    }

    styleEl.innerHTML = `
      :root {
        --theme-bg: ${c.background};
        --theme-text: ${c.foreground};
        --theme-primary: ${c.primary};
        --theme-border: ${c.border};
      }

      body {
        background-color: ${c.background} !important;
        color: ${c.foreground} !important;
      }

      /* Background tint adjustments */
      .bg-\\[\\#fdfbf7\\], .bg-\\[\\#f9f6f1\\] {
        background-color: ${c.background} !important;
      }
      .bg-\\[\\#fbf5ee\\], .bg-\\[\\#f6efe7\\] {
        background-color: ${c.primaryLight} !important;
      }

      /* Border adjustments */
      .border-\\[\\#ebdcd0\\] {
        border-color: ${c.border} !important;
      }

      /* Primary Gradients on buttons & banners */
      .bg-gradient-to-r.from-\\[\\#b87333\\].to-\\[\\#9c5c28\\],
      .bg-gradient-to-r.from-\\[\\#c98a58\\].to-\\[\\#995d30\\] {
        background-image: linear-gradient(to right, ${c.primaryGradientFrom}, ${c.primaryGradientTo}) !important;
      }

      /* Badge backgrounds & texts */
      .bg-\\[\\#fbf2ea\\], .bg-\\[\\#faf4ed\\] {
        background-color: ${c.badgeBg} !important;
      }
      .text-\\[\\#8f5222\\], .text-\\[\\#9c5c28\\] {
        color: ${c.badgeText} !important;
      }

      /* Primary text colors & icons */
      .text-\\[\\#b87333\\], .text-\\[\\#c98a58\\] {
        color: ${c.primary} !important;
      }

      /* Primary solid backgrounds (badges, logo icons) */
      .bg-\\[\\#b87333\\], .bg-\\[\\#c98a58\\] {
        background-color: ${c.primary} !important;
      }

      /* Subtle hover tints */
      .hover\\:text-\\[\\#b87333\\]:hover {
        color: ${c.primary} !important;
      }
    `;
  },
};
