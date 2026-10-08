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
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true });
        
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase fetch categories failed, using fallback:', err);
      }
    }
    return getStoredOrInitial(LOCAL_STORAGE_KEYS.CATEGORIES, memoryCategories);
  },

  async saveCategory(category: Partial<Category>): Promise<Category> {
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured && supabase) {
      if (category.id) {
        const { data, error } = await supabase
          .from('categories')
          .update(category)
          .eq('id', category.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('categories')
          .insert(category)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    }

    // Local fallback
    const items = getStoredOrInitial<Category>(LOCAL_STORAGE_KEYS.CATEGORIES, memoryCategories);
    let updated: Category;
    if (category.id) {
      const idx = items.findIndex((i) => i.id === category.id);
      if (idx !== -1) {
        updated = { ...items[idx], ...category } as Category;
        items[idx] = updated;
      } else {
        updated = category as Category;
        items.push(updated);
      }
    } else {
      updated = {
        ...category,
        id: 'cat-' + Date.now(),
        display_order: items.length + 1,
      } as Category;
      items.push(updated);
    }
    memoryCategories = items;
    saveToLocalStorage(LOCAL_STORAGE_KEYS.CATEGORIES, items);
    return updated;
  },

  async deleteCategory(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      return;
    }

    const items = getStoredOrInitial<Category>(LOCAL_STORAGE_KEYS.CATEGORIES, memoryCategories);
    const filtered = items.filter((i) => i.id !== id);
    memoryCategories = filtered;
    saveToLocalStorage(LOCAL_STORAGE_KEYS.CATEGORIES, filtered);
  },

  // ================= PRODUCTS =================
  async getProducts(): Promise<Product[]> {
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, category:categories(*)')
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase fetch products failed, using fallback:', err);
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
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured && supabase) {
      // If product is marked as featured, update others first (though DB trigger also handles this)
      if (product.is_featured && product.id) {
        await supabase
          .from('products')
          .update({ is_featured: false })
          .neq('id', product.id);
      }

      // Avoid payload errors with joined fields
      const { category, ...cleanProduct } = product;

      if (product.id) {
        const { data, error } = await supabase
          .from('products')
          .update(cleanProduct)
          .eq('id', product.id)
          .select('*, category:categories(*)')
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert(cleanProduct)
          .select('*, category:categories(*)')
          .single();
        if (error) throw error;
        return data;
      }
    }

    // Local fallback
    const items = getStoredOrInitial<Product>(LOCAL_STORAGE_KEYS.PRODUCTS, memoryProducts);
    if (product.is_featured) {
      items.forEach((p) => {
        p.is_featured = false;
      });
    }

    let updated: Product;
    if (product.id) {
      const idx = items.findIndex((i) => i.id === product.id);
      if (idx !== -1) {
        updated = { ...items[idx], ...product } as Product;
        items[idx] = updated;
      } else {
        updated = product as Product;
        items.push(updated);
      }
    } else {
      updated = {
        ...product,
        id: 'prod-' + Date.now(),
        display_order: items.length + 1,
        created_at: new Date().toISOString(),
      } as Product;
      items.push(updated);
    }
    memoryProducts = items;
    saveToLocalStorage(LOCAL_STORAGE_KEYS.PRODUCTS, items);
    return updated;
  },

  async deleteProduct(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      return;
    }

    const items = getStoredOrInitial<Product>(LOCAL_STORAGE_KEYS.PRODUCTS, memoryProducts);
    const filtered = items.filter((i) => i.id !== id);
    memoryProducts = filtered;
    saveToLocalStorage(LOCAL_STORAGE_KEYS.PRODUCTS, filtered);
  },

  async setFeaturedProduct(productId: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured && supabase) {
      await supabase.from('products').update({ is_featured: false }).neq('id', productId);
      const { error } = await supabase.from('products').update({ is_featured: true }).eq('id', productId);
      if (error) throw error;
      return;
    }

    const items = getStoredOrInitial<Product>(LOCAL_STORAGE_KEYS.PRODUCTS, memoryProducts);
    items.forEach((p) => {
      p.is_featured = p.id === productId;
    });
    memoryProducts = items;
    saveToLocalStorage(LOCAL_STORAGE_KEYS.PRODUCTS, items);
  },

  // ================= GALLERY =================
  async getGalleryImages(): Promise<GalleryImage[]> {
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('gallery_images')
          .select('*')
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase fetch gallery failed, using fallback:', err);
      }
    }
    return getStoredOrInitial(LOCAL_STORAGE_KEYS.GALLERY, memoryGallery);
  },

  async saveGalleryImage(image: Partial<GalleryImage>): Promise<GalleryImage> {
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured && supabase) {
      if (image.id) {
        const { data, error } = await supabase
          .from('gallery_images')
          .update(image)
          .eq('id', image.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('gallery_images')
          .insert(image)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    }

    const items = getStoredOrInitial<GalleryImage>(LOCAL_STORAGE_KEYS.GALLERY, memoryGallery);
    let updated: GalleryImage;
    if (image.id) {
      const idx = items.findIndex((i) => i.id === image.id);
      if (idx !== -1) {
        updated = { ...items[idx], ...image } as GalleryImage;
        items[idx] = updated;
      } else {
        updated = image as GalleryImage;
        items.push(updated);
      }
    } else {
      updated = {
        ...image,
        id: 'gal-' + Date.now(),
        display_order: items.length + 1,
        created_at: new Date().toISOString(),
      } as GalleryImage;
      items.push(updated);
    }
    memoryGallery = items;
    saveToLocalStorage(LOCAL_STORAGE_KEYS.GALLERY, items);
    return updated;
  },

  async deleteGalleryImage(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('gallery_images').delete().eq('id', id);
      if (error) throw error;
      return;
    }

    const items = getStoredOrInitial<GalleryImage>(LOCAL_STORAGE_KEYS.GALLERY, memoryGallery);
    const filtered = items.filter((i) => i.id !== id);
    memoryGallery = filtered;
    saveToLocalStorage(LOCAL_STORAGE_KEYS.GALLERY, filtered);
  },
};
