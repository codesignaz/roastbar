export type Locale = 'az' | 'en' | 'ru';

export interface ProductSize {
  name: string; // e.g. "Small", "Medium", "Large", or "Standard"
  volume?: string; // e.g. "200ml", "350ml", "450ml"
  price: number; // in AZN (₼)
}

export interface Category {
  id: string;
  name_az: string;
  name_en: string;
  name_ru: string;
  slug: string;
  display_order: number;
  created_at?: string;
}

export interface Product {
  id: string;
  category_id: string;
  name_az: string;
  name_en: string;
  name_ru: string;
  description_az: string;
  description_en: string;
  description_ru: string;
  base_price: number; // starting price in AZN
  sizes: ProductSize[];
  image_url: string;
  is_featured: boolean;
  is_available: boolean;
  tags?: string[];
  display_order: number;
  created_at?: string;
  updated_at?: string;
  category?: Category;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  caption_az?: string;
  caption_en?: string;
  caption_ru?: string;
  display_order: number;
  created_at?: string;
}

export interface InstagramPost {
  id: string;
  type: 'post' | 'reel';
  permalink: string;
  embed_url?: string;
  shortcode?: string;
  thumbnail_url: string;
  caption: string;
  likes_count?: number;
  comments_count?: number;
}
