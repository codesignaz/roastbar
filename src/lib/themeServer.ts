import fs from 'fs';
import path from 'path';
import { THEME_PRESETS, ThemePreset } from './themePresets';

const THEME_CONFIG_PATH = path.join(process.cwd(), 'src', 'data', 'themeConfig.json');
const PUBLIC_CONFIG_PATH = path.join(process.cwd(), 'public', 'themeConfig.json');

export function getServerThemeId(): string {
  try {
    if (fs.existsSync(THEME_CONFIG_PATH)) {
      const content = fs.readFileSync(THEME_CONFIG_PATH, 'utf-8');
      const data = JSON.parse(content);
      if (data && data.themeId && THEME_PRESETS.some((p) => p.id === data.themeId)) {
        return data.themeId;
      }
    }
  } catch (err) {
    console.warn('Could not read server theme config:', err);
  }

  try {
    if (fs.existsSync(PUBLIC_CONFIG_PATH)) {
      const content = fs.readFileSync(PUBLIC_CONFIG_PATH, 'utf-8');
      const data = JSON.parse(content);
      if (data && data.themeId && THEME_PRESETS.some((p) => p.id === data.themeId)) {
        return data.themeId;
      }
    }
  } catch (err) {
    console.warn('Could not read public theme config fallback:', err);
  }

  return 'latte';
}

export function getServerTheme(): ThemePreset {
  const id = getServerThemeId();
  return THEME_PRESETS.find((p) => p.id === id) || THEME_PRESETS[0];
}

export function saveServerTheme(themeId: string): boolean {
  if (!THEME_PRESETS.some((p) => p.id === themeId)) {
    return false;
  }

  const payload = {
    themeId,
    updatedAt: new Date().toISOString(),
  };

  try {
    const dir = path.dirname(THEME_CONFIG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(THEME_CONFIG_PATH, JSON.stringify(payload, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write src/data/themeConfig.json:', err);
  }

  try {
    const pubDir = path.dirname(PUBLIC_CONFIG_PATH);
    if (!fs.existsSync(pubDir)) {
      fs.mkdirSync(pubDir, { recursive: true });
    }
    fs.writeFileSync(PUBLIC_CONFIG_PATH, JSON.stringify(payload, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write public/themeConfig.json:', err);
  }

  return true;
}
