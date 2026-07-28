import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics.service';

export function useMonthlyAnalytics() {
  return useQuery<import('@/types/domain').AnalyticsPoint[]>({
    queryKey: ['analytics-monthly'],
    queryFn: () => analyticsService.monthlyTrends(),
  });
}

export function useContributionByCategory() {
  return useQuery<import('@/types/domain').CategoryAnalytics[]>({
    queryKey: ['analytics-contribution-category'],
    queryFn: () => analyticsService.contributionByCategory(),
  });
}

export function useAnalyticsSummary() {
  return useQuery<{
    totalContributions: number;
    totalRevenue: number;
    totalExpenses: number;
    avgContribution: number;
    contributionChange: number;
    revenueChange: number;
    expenseChange: number;
    activeGroups: number;
    activeMembers: number;
  }>({
    queryKey: ['analytics-summary'],
    queryFn: () => analyticsService.summary(),
  });
}

export function useAnalyticsInsights() {
  return useQuery<{ id: string; type: 'success' | 'info' | 'warning'; title: string; body: string }[]>({
    queryKey: ['analytics-insights'],
    queryFn: () => analyticsService.insights(),
  });
}
