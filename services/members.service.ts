import { apiClient, type ListParams, type Paginated } from './api-client';
import { simulateLatency, paginate } from './mock-utils';
import type { Member } from '@/types/domain';
import { mockMembers } from '@/mock/members';

const USE_MOCK = true;

export const membersService = {
  async list(params?: ListParams): Promise<Paginated<Member>> {
    if (USE_MOCK) {
      let items = [...mockMembers];
      if (params?.search) {
        const q = params.search.toLowerCase();
        items = items.filter(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            m.email.toLowerCase().includes(q) ||
            m.groupName.toLowerCase().includes(q)
        );
      }
      if (params?.status && params.status !== 'all') {
        items = items.filter((m) => m.status === params.status);
      }
      return simulateLatency(paginate(items, params?.page ?? 1, params?.pageSize ?? 10));
    }
    const { data } = await apiClient.get<Paginated<Member>>('/members', { params });
    return data;
  },

  async getById(id: string): Promise<Member> {
    if (USE_MOCK) {
      const found = mockMembers.find((m) => m.id === id);
      if (!found) throw new Error('Member not found');
      return simulateLatency(found);
    }
    const { data } = await apiClient.get<Member>(`/members/${id}`);
    return data;
  },

  async invite(email: string, groupId: string): Promise<void> {
    if (USE_MOCK) return simulateLatency(undefined);
    await apiClient.post('/members/invite', { email, groupId });
  },
};
