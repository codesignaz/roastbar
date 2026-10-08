import { getSupabaseClient, isSupabaseConfigured } from './supabase/client';
import { Category, Product, GalleryImage } from './supabase/types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_GALLERY } from './mockData';

const LOCAL_STORAGE_KEYS = {
  CATEGORIES: 'roastbar_categories',
  PRODUCTS: 'roastbar_products',
  GALLERY: 'roastbar_gallery',
};

// In-memory fallback if localStorage is not accessible
let memoryCategories: Category[] = [...INITIAL_CATEGORIES];
let memoryProducts: Product[] = [...INITIAL_PRODUCTS];
let memoryGallery: GalleryImage[] = [...INITIAL_GALLERY];

function getStoredOrInitial<T>(key: string, initial: T[]): T[] {
  if (typeof window === 'undefined') return initial;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // ignore
  }
  return initial;
}

function saveToLocalStorage<T>(key: string, items: T[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (e) {
    // ignore
  }
}

export const dataService = {
  // ================= CATEGORIES =================
  async getCategories(): Promise<Category[]> {
    // 1. Fetch from centralized backend database
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/categories', {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            memoryCategories = data;
            saveToLocalStorage(LOCAL_STORAGE_KEYS.CATEGORIES, data);
            return data;
          }
        }
      } catch (err) {
        // network fallback
      }
    }

    // 2. Fallback to Supabase if available
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true });
        
        if (!error && data && data.length > 0) {
          memoryCategories = data;
          saveToLocalStorage(LOCAL_STORAGE_KEYS.CATEGORIES, data);
          return data;
        }
      } catch (err) {
        console.warn('Supabase fetch categories fallback:', err);
      }
    }

    return getStoredOrInitial(LOCAL_STORAGE_KEYS.CATEGORIES, memoryCategories);
  },

  async saveCategory(category: Partial<Category>): Promise<Category> {
    // 1. Persist to centralized backend database
    let serverSaved: Category | null = null;
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      });
      if (res.ok) {
        serverSaved = await res.json();
      }
    } catch (e) {
      console.warn('API saveCategory network notice:', e);
    }

    // 2. Also try Supabase if session exists
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured && supabase) {
      try {
        if (category.id) {
          await supabase.from('categories').update(category).eq('id', category.id);
        } else {
          await supabase.from('categories').insert(category);
        }
      } catch (err) {
        // silent fallback
      }
    }

    // 3. Update local cache
    const items = getStoredOrInitial<Category>(LOCAL_STORAGE_KEYS.CATEGORIES, memoryCategories);
    const resultCat: Category = serverSaved || {
      ...category,
      id: category.id || 'cat-' + Date.now(),
      name_az: category.name_az || '',
      name_en: category.name_en || '',
      name_ru: category.name_ru || '',
      slug: category.slug || 'category-' + Date.now(),
      display_order: category.display_order || items.length + 1,
      created_at: category.created_at || new Date().toISOString(),
    } as Category;

    const idx = items.findIndex((i) => i.id === resultCat.id);
    if (idx !== -1) {
      items[idx] = resultCat;
    } else {
      items.push(resultCat);
    }

    memoryCategories = items;
    saveToLocalStorage(LOCAL_STORAGE_KEYS.CATEGORIES, items);
    return resultCat;
  },

  async deleteCategory(id: string): Promise<void> {
    // 1. Delete on central server
    try {
      await fetch(`/api/categories?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('API deleteCategory notice:', e);
    }

    // 2. Delete on Supabase if session exists
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('categories').delete().eq('id', id);
      } catch (err) {
        // silent fallback
      }
    }

    const items = getStoredOrInitial<Category>(LOCAL_STORAGE_KEYS.CATEGORIES, memoryCategories);
    const filtered = items.filter((i) => i.id !== id);
    memoryCategories = filtered;
    saveToLocalStorage(LOCAL_STORAGE_KEYS.CATEGORIES, filtered);
  },

  // ================= PRODUCTS =================
  async getProducts(): Promise<Product[]> {
    // 1. Fetch from centralized backend database
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/products', {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            memoryProducts = data;
            saveToLocalStorage(LOCAL_STORAGE_KEYS.PRODUCTS, data);
            return data;
          }
        }
      } catch (err) {
        // network fallback
      }
    }

    // 2. Fallback to Supabase if available
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, category:categories(*)')
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          memoryProducts = data;
          saveToLocalStorage(LOCAL_STORAGE_KEYS.PRODUCTS, data);
          return data;
        }
      } catch (err) {
        console.warn('Supabase fetch products fallback:', err);
      }
    }

    const categories = await this.getCategories();
    const catMap = new Map(categories.map((c) => [c.id, c]));
    const prods = getStoredOrInitial<Product>(LOCAL_STORAGE_KEYS.PRODUCTS, memoryProducts);
    return prods.map((p) => ({
      ...p,
      category: catMap.get(p.category_id) || p.category,
    }));
  },

  async getFeaturedProduct(): Promise<Product | null> {
    const products = await this.getProducts();
    const featured = products.find((p) => p.is_featured && p.is_available);
    return featured || products[0] || null;
  },

  async saveProduct(product: Partial<Product>): Promise<Product> {
    const { category, ...cleanProduct } = product;

    // 1. Persist to centralized backend database
    let serverSaved: Product | null = null;
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanProduct),
      });
      if (res.ok) {
        serverSaved = await res.json();
      }
    } catch (e) {
      console.warn('API saveProduct notice:', e);
    }

    // 2. Also try Supabase
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured && supabase) {
      try {
        if (cleanProduct.is_featured && cleanProduct.id) {
          await supabase.from('products').update({ is_featured: false }).neq('id', cleanProduct.id);
        }
        if (cleanProduct.id) {
          await supabase.from('products').update(cleanProduct).eq('id', cleanProduct.id);
        } else {
          await supabase.from('products').insert(cleanProduct);
        }
      } catch (err) {
        // silent fallback
      }
    }

    // 3. Update local cache
    const items = getStoredOrInitial<Product>(LOCAL_STORAGE_KEYS.PRODUCTS, memoryProducts);
    if (cleanProduct.is_featured) {
      items.forEach((p) => {
        p.is_featured = false;
      });
    }

    const resultProd: Product = serverSaved || ({
      ...cleanProduct,
      id: cleanProduct.id || 'prod-' + Date.now(),
      name_az: cleanProduct.name_az || '',
      name_en: cleanProduct.name_en || '',
      name_ru: cleanProduct.name_ru || '',
      base_price: cleanProduct.base_price || 0,
      is_available: cleanProduct.is_available ?? true,
      display_order: cleanProduct.display_order || items.length + 1,
      created_at: cleanProduct.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Product);

    const idx = items.findIndex((i) => i.id === resultProd.id);
    if (idx !== -1) {
      items[idx] = resultProd;
    } else {
      items.push(resultProd);
    }

    memoryProducts = items;
    saveToLocalStorage(LOCAL_STORAGE_KEYS.PRODUCTS, items);
    return resultProd;
  },

  async deleteProduct(id: string): Promise<void> {
    // 1. Delete on central server
    try {
      await fetch(`/api/products?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('API deleteProduct notice:', e);
    }

    // 2. Delete on Supabase
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (err) {
        // silent fallback
      }
    }

    const items = getStoredOrInitial<Product>(LOCAL_STORAGE_KEYS.PRODUCTS, memoryProducts);
    const filtered = items.filter((i) => i.id !== id);
    memoryProducts = filtered;
    saveToLocalStorage(LOCAL_STORAGE_KEYS.PRODUCTS, filtered);
  },

  async setFeaturedProduct(productId: string): Promise<void> {
    const prods = await this.getProducts();
    const target = prods.find((p) => p.id === productId);
    if (target) {
      await this.saveProduct({ ...target, is_featured: true });
    }
  },

  // ================= GALLERY =================
  async getGalleryImages(): Promise<GalleryImage[]> {
    // 1. Fetch from centralized backend database
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/gallery', {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            memoryGallery = data;
            saveToLocalStorage(LOCAL_STORAGE_KEYS.GALLERY, data);
            return data;
          }
        }
      } catch (err) {
        // network fallback
      }
    }

    // 2. Fallback to Supabase if available
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('gallery_images')
          .select('*')
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          memoryGallery = data;
          saveToLocalStorage(LOCAL_STORAGE_KEYS.GALLERY, data);
          return data;
        }
      } catch (err) {
        console.warn('Supabase fetch gallery fallback:', err);
      }
    }

    return getStoredOrInitial(LOCAL_STORAGE_KEYS.GALLERY, memoryGallery);
  },

  async saveGalleryImage(image: Partial<GalleryImage>): Promise<GalleryImage> {
    // 1. Persist to centralized backend database
    let serverSaved: GalleryImage | null = null;
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(image),
      });
      if (res.ok) {
        serverSaved = await res.json();
      }
    } catch (e) {
      console.warn('API saveGalleryImage notice:', e);
    }

    // 2. Also try Supabase
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured && supabase) {
      try {
        if (image.id) {
          await supabase.from('gallery_images').update(image).eq('id', image.id);
        } else {
          await supabase.from('gallery_images').insert(image);
        }
      } catch (err) {
        // silent fallback
      }
    }

    // 3. Update local cache
    const items = getStoredOrInitial<GalleryImage>(LOCAL_STORAGE_KEYS.GALLERY, memoryGallery);
    const resultImg: GalleryImage = serverSaved || ({
      ...image,
      id: image.id || 'gal-' + Date.now(),
      image_url: image.image_url || '',
      caption_az: image.caption_az || '',
      caption_en: image.caption_en || '',
      caption_ru: image.caption_ru || '',
      display_order: image.display_order || items.length + 1,
      created_at: image.created_at || new Date().toISOString(),
    } as GalleryImage);

    const idx = items.findIndex((i) => i.id === resultImg.id);
    if (idx !== -1) {
      items[idx] = resultImg;
    } else {
      items.push(resultImg);
    }

    memoryGallery = items;
    saveToLocalStorage(LOCAL_STORAGE_KEYS.GALLERY, items);
    return resultImg;
  },

  async deleteGalleryImage(id: string): Promise<void> {
    // 1. Delete on central server
    try {
      await fetch(`/api/gallery?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('API deleteGalleryImage notice:', e);
    }

    // 2. Delete on Supabase
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('gallery_images').delete().eq('id', id);
      } catch (err) {
        // silent fallback
      }
    }

    const items = getStoredOrInitial<GalleryImage>(LOCAL_STORAGE_KEYS.GALLERY, memoryGallery);
    const filtered = items.filter((i) => i.id !== id);
    memoryGallery = filtered;
    saveToLocalStorage(LOCAL_STORAGE_KEYS.GALLERY, filtered);
  },
};
