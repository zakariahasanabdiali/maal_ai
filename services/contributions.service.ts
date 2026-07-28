import { createClient } from '@/lib/supabase/client';
import type { Contribution, ContributionSummary } from '@/types/domain';
import type { Currency } from '@/lib/format';
import type { Paginated, ListParams } from './api-client';
import { paginate } from './api-client';

interface ContributionRow {
  id: string;
  amount: number;
  currency: string;
  status: string;
  note: string | null;
  created_at: string;
  group: { id: string; name: string } | { id: string; name: string }[] | null;
  contributor: { id: string; email: string } | { id: string; email: string }[] | null;
}

function unwrap<T>(val: T | T[] | null): T | null {
  if (Array.isArray(val)) return val[0] ?? null;
  return val;
}

function mapRow(row: ContributionRow): Contribution {
  const group = unwrap(row.group);
  const contributor = unwrap(row.contributor);
  const statusStr = String(row.status).toLowerCase();
  return {
    id: row.id,
    memberName: contributor?.email ?? 'Unknown',
    memberAvatar: '',
    groupId: group?.id ?? '',
    groupName: group?.name ?? '',
    amount: Number(row.amount),
    currency: (row.currency as Currency) ?? 'USD',
    date: row.created_at,
    method: 'mobile',
    status: (['completed', 'pending', 'failed'].includes(statusStr) ? statusStr : 'pending') as Contribution['status'],
    reference: row.id,
    note: row.note ?? undefined,
  };
}

export const contributionsService = {
  async list(params?: ListParams): Promise<Paginated<Contribution>> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return paginate([], params?.page ?? 1, params?.pageSize ?? 10);

    const { data, error } = await supabase
      .from('contributions')
      .select(`
        id,
        amount,
        currency,
        status,
        note,
        created_at,
        group:groups ( id, name ),
        contributor:users ( id, email )
      `)
      .eq('contributor_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    let items: Contribution[] = (data as unknown as ContributionRow[] ?? []).map(mapRow);

    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter((c) =>
        c.memberName.toLowerCase().includes(q) ||
        c.groupName.toLowerCase().includes(q) ||
        c.reference.toLowerCase().includes(q)
      );
    }

    if (params?.status && params.status !== 'all') {
      items = items.filter((c) => c.status === params.status);
    }

    return paginate(items, params?.page ?? 1, params?.pageSize ?? 10);
  },

  async getById(id: string): Promise<Contribution> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('contributions')
      .select(`
        id,
        amount,
        currency,
        status,
        note,
        created_at,
        group:groups ( id, name ),
        contributor:users ( id, email )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return mapRow(data as unknown as ContributionRow);
  },

  async summary(): Promise<ContributionSummary> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { totalThisMonth: 0, totalAllTime: 0, pending: 0, completed: 0, avgMonthly: 0, changePercent: 0 };
    }

    const { data, error } = await supabase
      .from('contributions')
      .select('amount, status, created_at')
      .eq('contributor_id', user.id);

    if (error) throw error;

    const rows = (data ?? []) as Array<{ amount: number; status: string; created_at: string }>;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const completed = rows.filter((r) => String(r.status).toLowerCase() === 'completed');
    const pending = rows.filter((r) => String(r.status).toLowerCase() === 'pending');
    const totalAllTime = completed.reduce((s: number, r) => s + Number(r.amount), 0);
    const totalThisMonth = completed
      .filter((r) => new Date(r.created_at) >= monthStart)
      .reduce((s: number, r) => s + Number(r.amount), 0);

    return {
      totalThisMonth,
      totalAllTime,
      pending: pending.length,
      completed: completed.length,
      avgMonthly: totalAllTime > 0 ? Math.round(totalAllTime / 12) : 0,
      changePercent: 0,
    };
  },
};
