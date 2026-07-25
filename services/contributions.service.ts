import { apiClient, type ListParams, type Paginated } from './api-client';
import { simulateLatency, paginate } from './mock-utils';
import type { Contribution, ContributionSummary } from '@/types/domain';
import { mockContributions } from '@/mock/contributions';

const USE_MOCK = true;

export const contributionsService = {
  async list(params?: ListParams): Promise<Paginated<Contribution>> {
    if (USE_MOCK) {
      let items = [...mockContributions];
      if (params?.search) {
        const q = params.search.toLowerCase();
        items = items.filter(
          (c) =>
            c.memberName.toLowerCase().includes(q) ||
            c.groupName.toLowerCase().includes(q) ||
            c.reference.toLowerCase().includes(q)
        );
      }
      if (params?.status && params.status !== 'all') {
        items = items.filter((c) => c.status === params.status);
      }
      return simulateLatency(paginate(items, params?.page ?? 1, params?.pageSize ?? 10));
    }
    const { data } = await apiClient.get<Paginated<Contribution>>('/contributions', { params });
    return data;
  },

  async getById(id: string): Promise<Contribution> {
    if (USE_MOCK) {
      const found = mockContributions.find((c) => c.id === id);
      if (!found) throw new Error('Contribution not found');
      return simulateLatency(found);
    }
    const { data } = await apiClient.get<Contribution>(`/contributions/${id}`);
    return data;
  },

  async summary(): Promise<ContributionSummary> {
    if (USE_MOCK) {
      const completed = mockContributions.filter((c) => c.status === 'completed');
      const pending = mockContributions.filter((c) => c.status === 'pending');
      const totalAllTime = completed.reduce((s, c) => s + c.amount, 0);
      return simulateLatency({
        totalThisMonth: 6100,
        totalAllTime,
        pending: pending.length,
        completed: completed.length,
        avgMonthly: 4914,
        changePercent: 15.6,
      });
    }
    const { data } = await apiClient.get<ContributionSummary>('/contributions/summary');
    return data;
  },
};
