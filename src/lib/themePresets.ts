export interface ThemePreset {
  id: string;
  name_az: string;
  name_en: string;
  description_az: string;
  previewBg: string;
  previewPrimary: string;
  previewAccent: string;
  previewText: string;
  css: {
    background: string;
    foreground: string;
    card: string;
    border: string;
    primary: string;
    primaryGradientFrom: string;
    primaryGradientTo: string;
    primaryHover: string;
    primaryLight: string;
    badgeBg: string;
    badgeText: string;
    accent: string;
    subtext: string;
  };
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'latte',
    name_az: 'Klassik Südlü Latte & Karamel',
    name_en: 'Classic Warm Latte',
    description_az: 'İsti və rahat butik qəhvəxana atmosferi: fil sümüyü, südlü latte və bürünc karamel tonları.',
    previewBg: '#FDFBF7',
    previewPrimary: '#B87333',
    previewAccent: '#D4955B',
    previewText: '#221710',
    css: {
      background: '#fdfbf7',
      foreground: '#221710',
      card: '#ffffff',
      border: '#ebdcd0',
      primary: '#b87333',
      primaryGradientFrom: '#b87333',
      primaryGradientTo: '#9c5c28',
      primaryHover: '#c78242',
      primaryLight: '#fbf3eb',
      badgeBg: '#fbf2ea',
      badgeText: '#8f5222',
      accent: '#d4955b',
      subtext: '#5c4a3e',
    },
  },
  {
    id: 'emerald',
    name_az: 'Botanik & Zümrüd Yaşıl Kafe',
    name_en: 'Emerald Botanical Cafe',
    description_az: 'Təbii bitkilər, təravətli orqanik kofe və zərif meşə zümrüdü çalarları.',
    previewBg: '#F6F9F6',
    previewPrimary: '#2D6346',
    previewAccent: '#4C8A66',
    previewText: '#15261C',
    css: {
      background: '#f6f9f6',
      foreground: '#15261c',
      card: '#ffffff',
      border: '#d5e4d8',
      primary: '#2d6346',
      primaryGradientFrom: '#2d6346',
      primaryGradientTo: '#1f4932',
      primaryHover: '#387856',
      primaryLight: '#eef6f0',
      badgeBg: '#eaf2eb',
      badgeText: '#235038',
      accent: '#4c8a66',
      subtext: '#4a6052',
    },
  },
  {
    id: 'caramel',
    name_az: 'Karamel Moka & Qızılı Bal',
    name_en: 'Caramel Mocha & Honey',
    description_az: 'Qızılı bal, karamel şirniyyatı və tünd qovrulmuş şokoladlı moka istiliyi.',
    previewBg: '#FDF9F2',
    previewPrimary: '#B5651D',
    previewAccent: '#E09142',
    previewText: '#2B1A0E',
    css: {
      background: '#fdf9f2',
      foreground: '#2b1a0e',
      card: '#ffffff',
      border: '#eddcc9',
      primary: '#b5651d',
      primaryGradientFrom: '#c4752a',
      primaryGradientTo: '#9e5114',
      primaryHover: '#d18134',
      primaryLight: '#fcf3e8',
      badgeBg: '#fbf1e4',
      badgeText: '#8a4710',
      accent: '#e09142',
      subtext: '#614631',
    },
  },
  {
    id: 'nordic',
    name_az: 'Skandinav Minimalizm & Yulaf',
    name_en: 'Nordic Oat Minimalist',
    description_az: 'Şimali Avropa (Nordic) minimalist dizaynı: təmiz xətlər və yulaf südü zərifliyi.',
    previewBg: '#F9F9F7',
    previewPrimary: '#423A33',
    previewAccent: '#73675C',
    previewText: '#1C1814',
    css: {
      background: '#f9f9f7',
      foreground: '#1c1814',
      card: '#ffffff',
      border: '#e0dcd6',
      primary: '#423a33',
      primaryGradientFrom: '#4d443d',
      primaryGradientTo: '#362e28',
      primaryHover: '#594e45',
      primaryLight: '#f2f0ec',
      badgeBg: '#efece7',
      badgeText: '#3b342e',
      accent: '#73675c',
      subtext: '#544c44',
    },
  },
  {
    id: 'terracotta',
    name_az: 'Terracotta & Şaftalı Qürub',
    name_en: 'Artisan Terracotta & Peach',
    description_az: 'İspaniya və İtaliya qəhvə evlərini xatırladan isti terrakotta və bişmiş gil keramika harmoniyası.',
    previewBg: '#FDF7F5',
    previewPrimary: '#B0543E',
    previewAccent: '#D0705A',
    previewText: '#2C1713',
    css: {
      background: '#fdf7f5',
      foreground: '#2c1713',
      card: '#ffffff',
      border: '#eed7d2',
      primary: '#b0543e',
      primaryGradientFrom: '#b0543e',
      primaryGradientTo: '#913f2c',
      primaryHover: '#c2624a',
      primaryLight: '#fbf0ed',
      badgeBg: '#fbf0ed',
      badgeText: '#873c2a',
      accent: '#d0705a',
      subtext: '#63443e',
    },
  },
];
