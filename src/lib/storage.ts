import { getSupabaseClient, isSupabaseConfigured } from './supabase/client';

export type BucketName = 'products' | 'gallery';

/**
 * Uploads an image file to Supabase Storage.
 * Falls back to base64 Data URL if Supabase is not configured yet.
 */
export async function uploadImage(file: File, bucket: BucketName): Promise<{ url: string; error: string | null }> {
  try {
    const supabase = getSupabaseClient();

    if (!isSupabaseConfigured || !supabase) {
      // Return a base64 Data URL for local testing/preview
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ url: reader.result as string, error: null });
        };
        reader.onerror = () => {
          resolve({ url: '', error: 'Failed to read file locally' });
        };
        reader.readAsDataURL(file);
      });
    }

    // Clean file name
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase storage upload error:', error);
      return { url: '', error: error.message };
    }

    // Retrieve public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err: any) {
    console.error('Unexpected upload error:', err);
    return { url: '', error: err.message || 'Image upload failed' };
  }
}
