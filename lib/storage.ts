import { supabase } from './supabase';

export async function uploadImage(file: File, bucketPath: string = 'product-images'): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucketPath)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from(bucketPath)
    .getPublicUrl(filePath);

  return data.publicUrl;
}
