import { createClient } from '@/lib/supabase/client';
import type { ReceiptUpload } from '@/types/domain';

export const receiptsService = {
  async upload(file: File, onProgress: (progress: number) => void): Promise<ReceiptUpload> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const id = `r_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const filePath = `${user.id}/${id}-${file.name}`;

    onProgress(10);

    const { error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    onProgress(100);

    return {
      id,
      fileName: file.name,
      fileSize: file.size,
      status: 'success',
      progress: 100,
    };
  },

  async retry(id: string): Promise<ReceiptUpload> {
    return {
      id,
      fileName: 'receipt-retry.jpg',
      fileSize: 0,
      status: 'success',
      progress: 100,
    };
  },
};
