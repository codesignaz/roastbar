import fs from 'fs';
import path from 'path';
import { Category, Product, GalleryImage } from './supabase/types';
import { MultilingualSlogans, LanguageSlogans, SupportedLocale, DEFAULT_MULTILINGUAL_SLOGANS } from './sloganService';

export interface ServerDatabase {
  theme: string;
  slogans: MultilingualSlogans;
  categories: Category[];
  products: Product[];
  gallery: GalleryImage[];
  updatedAt: string;
}

const PRIMARY_DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');
const PUBLIC_DB_PATH = path.join(process.cwd(), 'public', 'data', 'db.json');

function getDefaultDb(): ServerDatabase {
  return {
    theme: 'latte',
    slogans: DEFAULT_MULTILINGUAL_SLOGANS,
    categories: [],
    products: [],
    gallery: [],
    updatedAt: new Date().toISOString(),
  };
}

export const serverDb = {
  getDb(): ServerDatabase {
    try {
      if (fs.existsSync(PRIMARY_DB_PATH)) {
        const raw = fs.readFileSync(PRIMARY_DB_PATH, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Error reading primary db.json:', e);
    }

    try {
      if (fs.existsSync(PUBLIC_DB_PATH)) {
        const raw = fs.readFileSync(PUBLIC_DB_PATH, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Error reading public db.json:', e);
    }

    return getDefaultDb();
  },

  saveDb(db: ServerDatabase): boolean {
    db.updatedAt = new Date().toISOString();
    const jsonStr = JSON.stringify(db, null, 2);

    let ok = false;
    try {
      const dir1 = path.dirname(PRIMARY_DB_PATH);
      if (!fs.existsSync(dir1)) fs.mkdirSync(dir1, { recursive: true });
      fs.writeFileSync(PRIMARY_DB_PATH, jsonStr, 'utf-8');
      ok = true;
    } catch (e) {
      console.error('Error writing to primary db.json:', e);
    }

    try {
      const dir2 = path.dirname(PUBLIC_DB_PATH);
      if (!fs.existsSync(dir2)) fs.mkdirSync(dir2, { recursive: true });
      fs.writeFileSync(PUBLIC_DB_PATH, jsonStr, 'utf-8');
    } catch (e) {
      console.error('Error writing to public db.json:', e);
    }

    return ok;
  },

  // ================= THEME =================
  getThemeId(): string {
    const db = this.getDb();
    return db.theme || 'latte';
  },

  setThemeId(themeId: string): boolean {
    const db = this.getDb();
    db.theme = themeId;
    return this.saveDb(db);
  },

  // ================= SLOGANS =================
  getSlogans(): MultilingualSlogans {
    const db = this.getDb();
    return {
      az: { ...DEFAULT_MULTILINGUAL_SLOGANS.az, ...(db.slogans?.az || {}) },
      en: { ...DEFAULT_MULTILINGUAL_SLOGANS.en, ...(db.slogans?.en || {}) },
      ru: { ...DEFAULT_MULTILINGUAL_SLOGANS.ru, ...(db.slogans?.ru || {}) },
    };
  },

  saveSlogansForLocale(locale: SupportedLocale, slogans: Partial<LanguageSlogans>): boolean {
    const db = this.getDb();
    if (!db.slogans) db.slogans = { ...DEFAULT_MULTILINGUAL_SLOGANS };
    db.slogans[locale] = {
      ...(db.slogans[locale] || DEFAULT_MULTILINGUAL_SLOGANS[locale]),
      ...slogans,
    };
    return this.saveDb(db);
  },

  saveAllSlogans(slogans: MultilingualSlogans): boolean {
    const db = this.getDb();
    db.slogans = slogans;
    return this.saveDb(db);
  },

  resetLocaleSlogans(locale: SupportedLocale): boolean {
    const db = this.getDb();
    if (!db.slogans) db.slogans = { ...DEFAULT_MULTILINGUAL_SLOGANS };
    db.slogans[locale] = { ...DEFAULT_MULTILINGUAL_SLOGANS[locale] };
    return this.saveDb(db);
  },

  resetAllSlogans(): boolean {
    const db = this.getDb();
    db.slogans = { ...DEFAULT_MULTILINGUAL_SLOGANS };
    return this.saveDb(db);
  },

  // ================= CATEGORIES =================
  getCategories(): Category[] {
    const db = this.getDb();
    return [...(db.categories || [])].sort((a, b) => a.display_order - b.display_order);
  },

  saveCategory(cat: Partial<Category>): Category {
    const db = this.getDb();
    const categories = db.categories || [];
    let updated: Category;

    if (cat.id) {
      const idx = categories.findIndex((c) => c.id === cat.id);
      if (idx !== -1) {
        updated = { ...categories[idx], ...cat } as Category;
        categories[idx] = updated;
      } else {
        updated = cat as Category;
        categories.push(updated);
      }
    } else {
      updated = {
        ...cat,
        id: 'cat-' + Date.now(),
        display_order: categories.length + 1,
        created_at: new Date().toISOString(),
      } as Category;
      categories.push(updated);
    }

    db.categories = categories;
    this.saveDb(db);
    return updated;
  },

  deleteCategory(id: string): boolean {
    const db = this.getDb();
    db.categories = (db.categories || []).filter((c) => c.id !== id);
    return this.saveDb(db);
  },

  // ================= PRODUCTS =================
  getProducts(): Product[] {
    const db = this.getDb();
    const categories = db.categories || [];
    const catMap = new Map(categories.map((c) => [c.id, c]));

    return [...(db.products || [])]
      .sort((a, b) => a.display_order - b.display_order)
      .map((p) => ({
        ...p,
        category: catMap.get(p.category_id) || p.category,
      }));
  },

  saveProduct(prod: Partial<Product>): Product {
    const db = this.getDb();
    const products = db.products || [];

    if (prod.is_featured) {
      products.forEach((p) => {
        p.is_featured = false;
      });
    }

    const { category, ...cleanProduct } = prod;
    let updated: Product;

    if (cleanProduct.id) {
      const idx = products.findIndex((p) => p.id === cleanProduct.id);
      if (idx !== -1) {
        updated = {
          ...products[idx],
          ...cleanProduct,
          updated_at: new Date().toISOString(),
        } as Product;
        products[idx] = updated;
      } else {
        updated = cleanProduct as Product;
        products.push(updated);
      }
    } else {
      updated = {
        ...cleanProduct,
        id: 'prod-' + Date.now(),
        display_order: products.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Product;
      products.push(updated);
    }

    db.products = products;
    this.saveDb(db);

    const categories = db.categories || [];
    const catMap = new Map(categories.map((c) => [c.id, c]));
    return {
      ...updated,
      category: catMap.get(updated.category_id) || updated.category,
    };
  },

  deleteProduct(id: string): boolean {
    const db = this.getDb();
    db.products = (db.products || []).filter((p) => p.id !== id);
    return this.saveDb(db);
  },

  // ================= GALLERY =================
  getGalleryImages(): GalleryImage[] {
    const db = this.getDb();
    return [...(db.gallery || [])].sort((a, b) => a.display_order - b.display_order);
  },

  saveGalleryImage(img: Partial<GalleryImage>): GalleryImage {
    const db = this.getDb();
    const gallery = db.gallery || [];
    let updated: GalleryImage;

    if (img.id) {
      const idx = gallery.findIndex((g) => g.id === img.id);
      if (idx !== -1) {
        updated = { ...gallery[idx], ...img } as GalleryImage;
        gallery[idx] = updated;
      } else {
        updated = img as GalleryImage;
        gallery.push(updated);
      }
    } else {
      updated = {
        ...img,
        id: 'gal-' + Date.now(),
        display_order: gallery.length + 1,
        created_at: new Date().toISOString(),
      } as GalleryImage;
      gallery.push(updated);
    }

    db.gallery = gallery;
    this.saveDb(db);
    return updated;
  },

  deleteGalleryImage(id: string): boolean {
    const db = this.getDb();
    db.gallery = (db.gallery || []).filter((g) => g.id !== id);
    return this.saveDb(db);
  },
};
