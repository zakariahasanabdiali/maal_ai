import { useQuery } from '@tanstack/react-query';
import { contributionsService } from '@/services/contributions.service';
import type { ListParams } from '@/services/api-client';

export function useContributions(params?: ListParams) {
  return useQuery<import('@/services/api-client').Paginated<import('@/types/domain').Contribution>>({
    queryKey: ['contributions', params],
    queryFn: () => contributionsService.list(params) as Promise<import('@/services/api-client').Paginated<import('@/types/domain').Contribution>>,
  });
}

export function useContribution(id: string) {
  return useQuery<import('@/types/domain').Contribution>({
    queryKey: ['contribution', id],
    queryFn: () => contributionsService.getById(id) as Promise<import('@/types/domain').Contribution>,
    enabled: !!id,
  });
}

export function useContributionSummary() {
  return useQuery<import('@/types/domain').ContributionSummary>({
    queryKey: ['contribution-summary'],
    queryFn: () => contributionsService.summary() as Promise<import('@/types/domain').ContributionSummary>,
  });
}
