import { createClient } from '@/lib/supabase/client';
import type { AnalyticsPoint, CategoryAnalytics } from '@/types/domain';

export const analyticsService = {
  async monthlyTrends(): Promise<AnalyticsPoint[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('contributions')
      .select('amount, status, created_at')
      .eq('contributor_id', user.id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const monthly: Record<string, { contributions: number; count: number }> = {};
    (data ?? []).forEach((row: Record<string, unknown>) => {
      const date = new Date(row.created_at as string);
      const key = date.toLocaleString('en', { month: 'short' });
      if (!monthly[key]) monthly[key] = { contributions: 0, count: 0 };
      monthly[key].contributions += Number(row.amount);
      monthly[key].count += 1;
    });

    const last6 = Object.entries(monthly).slice(-6);
    return last6.map(([label, val]) => ({
      label,
      contributions: val.count,
      revenue: val.contributions,
      expenses: 0,
    }));
  },

  async contributionByCategory(): Promise<CategoryAnalytics[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('contributions')
      .select('amount, status, group:groups(name)')
      .eq('contributor_id', user.id);

    if (error) throw error;

    const byGroup: Record<string, number> = {};
    (data ?? []).forEach((row: Record<string, unknown>) => {
      const group = row.group as Record<string, string> | null;
      const name = group?.name ?? 'Other';
      byGroup[name] = (byGroup[name] ?? 0) + Number(row.amount);
    });

    const colors = ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'];
    return Object.entries(byGroup).map(([name, value], i) => ({
      name,
      value,
      color: colors[i % colors.length],
    }));
  },

  async summary() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { totalContributions: 0, totalRevenue: 0, totalExpenses: 0, avgContribution: 0, contributionChange: 0, revenueChange: 0, expenseChange: 0, activeGroups: 0, activeMembers: 0 };
    }

    const [contribRes, groupsRes] = await Promise.all([
      supabase.from('contributions').select('amount, created_at').eq('contributor_id', user.id),
      supabase.from('memberships').select('id, group:groups(id)').eq('user_id', user.id),
    ]);

    const contributions = contribRes.data ?? [];
    const totalContributions = contributions.length;
    const totalRevenue = contributions.reduce((s: number, r: Record<string, unknown>) => s + Number(r.amount), 0);
    const activeGroups = new Set((groupsRes.data ?? []).map((r: Record<string, unknown>) => (r.group as Record<string, string>)?.id).filter(Boolean)).size;

    return {
      totalContributions,
      totalRevenue,
      totalExpenses: 0,
      avgContribution: totalContributions > 0 ? Math.round(totalRevenue / totalContributions) : 0,
      contributionChange: 0,
      revenueChange: 0,
      expenseChange: 0,
      activeGroups,
      activeMembers: 0,
    };
  },

  async insights() {
    return [];
  },
};
