import { useQuery } from '@tanstack/react-query';
import { membersService } from '@/services/members.service';
import type { ListParams } from '@/services/api-client';

export function useMembers(params?: ListParams) {
  return useQuery<import('@/services/api-client').Paginated<import('@/types/domain').Member>>({
    queryKey: ['members', params],
    queryFn: () => membersService.list(params) as Promise<import('@/services/api-client').Paginated<import('@/types/domain').Member>>,
  });
}

export function useMember(id: string) {
  return useQuery<import('@/types/domain').Member>({
    queryKey: ['member', id],
    queryFn: () => membersService.getById(id) as Promise<import('@/types/domain').Member>,
    enabled: !!id,
  });
}
