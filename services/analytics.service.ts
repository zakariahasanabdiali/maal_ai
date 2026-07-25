import { apiClient } from './api-client';
import { simulateLatency } from './mock-utils';
import type { AnalyticsPoint, CategoryAnalytics } from '@/types/domain';
import {
  monthlyAnalytics,
  contributionByCategory,
  analyticsSummary,
  aiAnalyticsInsights,
} from '@/mock/analytics-domain';

const USE_MOCK = true;

export const analyticsService = {
  async monthlyTrends(): Promise<AnalyticsPoint[]> {
    if (USE_MOCK) return simulateLatency(monthlyAnalytics);
    const { data } = await apiClient.get<AnalyticsPoint[]>('/analytics/monthly');
    return data;
  },

  async contributionByCategory(): Promise<CategoryAnalytics[]> {
    if (USE_MOCK) return simulateLatency(contributionByCategory);
    const { data } = await apiClient.get<CategoryAnalytics[]>('/analytics/contributions-by-category');
    return data;
  },

  async summary() {
    if (USE_MOCK) return simulateLatency(analyticsSummary);
    const { data } = await apiClient.get('/analytics/summary');
    return data;
  },

  async insights() {
    if (USE_MOCK) return simulateLatency(aiAnalyticsInsights);
    const { data } = await apiClient.get('/analytics/insights');
    return data;
  },
};
