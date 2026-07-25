import { simulateLatency } from './mock-utils';
import type { ReceiptUpload } from '@/types/domain';

const USE_MOCK = true;

export const receiptsService = {
  async upload(file: File, onProgress: (progress: number) => void): Promise<ReceiptUpload> {
    const id = `r_${Date.now()}`;

    if (USE_MOCK) {
      // Simulate upload progress
      for (let p = 0; p <= 100; p += 10) {
        await new Promise((r) => setTimeout(r, 120));
        onProgress(p);
      }

      // Simulate OCR processing
      await new Promise((r) => setTimeout(r, 1500));

      return simulateLatency({
        id,
        fileName: file.name,
        fileSize: file.size,
        status: 'success',
        progress: 100,
        extractedAmount: 42.5,
        extractedMerchant: 'Suuqa Bakaara',
        extractedDate: '2026-07-22',
      });
    }

    // Real implementation placeholder — swap with axios POST + onUploadProgress
    throw new Error('Receipt upload endpoint not configured');
  },

  async retry(id: string): Promise<ReceiptUpload> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 1200));
      return simulateLatency({
        id,
        fileName: 'receipt-retry.jpg',
        fileSize: 240000,
        status: 'success',
        progress: 100,
        extractedAmount: 38.7,
        extractedMerchant: 'Dayniile Market',
        extractedDate: '2026-07-22',
      });
    }
    throw new Error('Retry endpoint not configured');
  },
};
