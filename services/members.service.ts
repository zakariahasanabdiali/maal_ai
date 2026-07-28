import { createClient } from '@/lib/supabase/client';
import type { Member } from '@/types/domain';
import type { Paginated, ListParams } from './api-client';
import { paginate } from './api-client';

interface MembershipRow {
  id: string;
  role: string;
  status: string;
  joined_at: string | null;
  created_at: string;
  group: { id: string; name: string } | { id: string; name: string }[] | null;
  user: { id: string; email: string; created_at: string } | { id: string; email: string; created_at: string }[] | null;
}

function unwrap<T>(val: T | T[] | null): T | null {
  if (Array.isArray(val)) return val[0] ?? null;
  return val;
}

function mapRow(row: MembershipRow): Member {
  const group = unwrap(row.group);
  const u = unwrap(row.user);
  const roleStr = String(row.role).toLowerCase();
  const statusStr = String(row.status).toLowerCase();
  return {
    id: row.id,
    name: u?.email ?? 'Unknown',
    email: u?.email ?? '',
    phone: '',
    avatar: '',
    role: (['admin', 'treasurer', 'member'].includes(roleStr) ? roleStr : 'member') as Member['role'],
    groupId: group?.id ?? '',
    groupName: group?.name ?? '',
    status: (['active', 'inactive', 'invited'].includes(statusStr) ? statusStr : 'invited') as Member['status'],
    totalContributed: 0,
    joinedAt: row.joined_at ?? row.created_at ?? '',
    lastContribution: undefined,
  };
}

export const membersService = {
  async list(params?: ListParams): Promise<Paginated<Member>> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return paginate([], params?.page ?? 1, params?.pageSize ?? 10);

    const { data, error } = await supabase
      .from('memberships')
      .select(`
        id,
        role,
        status,
        joined_at,
        created_at,
        group:groups ( id, name ),
        user:users ( id, email, created_at )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    let items: Member[] = (data as unknown as MembershipRow[] ?? []).map(mapRow);

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

    return paginate(items, params?.page ?? 1, params?.pageSize ?? 10);
  },

  async getById(id: string): Promise<Member> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('memberships')
      .select(`
        id,
        role,
        status,
        joined_at,
        created_at,
        group:groups ( id, name ),
        user:users ( id, email, created_at )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return mapRow(data as unknown as MembershipRow);
  },

  async invite(email: string, groupId: string): Promise<void> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('memberships')
      .insert({
        group_id: groupId,
        user_id: user.id,
        role: 'MEMBER',
        status: 'INVITED',
        invited_by_id: user.id,
      });

    if (error) throw error;
  },
};
