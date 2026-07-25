export type LatencyProfile = 'fast' | 'normal' | 'slow' | 'fail';

const profileMs: Record<LatencyProfile, number> = {
  fast: 200,
  normal: 600,
  slow: 1200,
  fail: 500,
};

export function simulateLatency<T>(
  data: T,
  profile: LatencyProfile = 'normal'
): Promise<T> {
  return new Promise((resolve, reject) => {
    const ms = profileMs[profile];
    setTimeout(() => {
      if (profile === 'fail') {
        reject(new Error('Network error — endpoint unavailable (mock)'));
        return;
      }
      resolve(data);
    }, ms);
  });
}

export function paginate<T>(items: T[], page = 1, pageSize = 10): Paginated<T> {
  const start = (page - 1) * pageSize;
  return {
    data: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
  };
}

import type { Paginated } from './api-client';
