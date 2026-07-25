import type { AnalyticsPoint, CategoryAnalytics } from '@/types/domain';

export const monthlyAnalytics: AnalyticsPoint[] = [
  { label: 'Jan', contributions: 4200, revenue: 3100, expenses: 2400 },
  { label: 'Feb', contributions: 4500, revenue: 3200, expenses: 2650 },
  { label: 'Mar', contributions: 4100, revenue: 3200, expenses: 2180 },
  { label: 'Apr', contributions: 5200, revenue: 3650, expenses: 2900 },
  { label: 'May', contributions: 4800, revenue: 3200, expenses: 2750 },
  { label: 'Jun', contributions: 5500, revenue: 3650, expenses: 2480 },
  { label: 'Jul', contributions: 6100, revenue: 3650, expenses: 2852 },
];

export const contributionByCategory: CategoryAnalytics[] = [
  { name: 'Monthly dues', value: 4200, color: 'hsl(var(--chart-1))' },
  { name: 'Emergency', value: 850, color: 'hsl(var(--chart-2))' },
  { name: 'Special projects', value: 650, color: 'hsl(var(--chart-3))' },
  { name: 'Payouts', value: 400, color: 'hsl(var(--chart-4))' },
];

export const analyticsSummary = {
  totalContributions: 34400,
  totalRevenue: 23650,
  totalExpenses: 18212,
  avgContribution: 488,
  contributionChange: 15.6,
  revenueChange: 14.1,
  expenseChange: 15.2,
  activeGroups: 3,
  activeMembers: 77,
};

export const aiAnalyticsInsights = [
  {
    id: 'ai1',
    type: 'success' as const,
    title: 'Contributions trending up',
    body: 'Contributions rose 15.6% in July — your highest month. The Hodan Community Fund drove most of the growth with a full contribution cycle.',
  },
  {
    id: 'ai2',
    type: 'info' as const,
    title: 'Revenue stability detected',
    body: 'Your income has held steady at $3,650 for three consecutive months. Consider routing the surplus toward your Business Capital goal.',
  },
  {
    id: 'ai3',
    type: 'warning' as const,
    title: 'Expense spike in food category',
    body: 'Food expenses rose 18% this month. The AI projects you will exceed your food budget by $80 unless spending slows in the final 10 days.',
  },
];
