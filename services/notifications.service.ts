import { apiClient } from './api-client';
import { simulateLatency } from './mock-utils';
import type { AppNotification } from '@/types/domain';
import { mockNotifications } from '@/mock/notifications';

const USE_MOCK = true;

export const notificationsService = {
  async list(): Promise<AppNotification[]> {
    if (USE_MOCK) return simulateLatency([...mockNotifications]);
    const { data } = await apiClient.get<AppNotification[]>('/notifications');
    return data;
  },

  async markRead(id: string): Promise<void> {
    if (USE_MOCK) return simulateLatency(undefined, 'fast');
    await apiClient.patch(`/notifications/${id}/read`);
  },

  async markAllRead(): Promise<void> {
    if (USE_MOCK) return simulateLatency(undefined, 'fast');
    await apiClient.post('/notifications/read-all');
  },
};
