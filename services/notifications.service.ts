import { createClient } from '@/lib/supabase/client';
import type { AppNotification, NotificationType } from '@/types/domain';

export const notificationsService = {
  async list(): Promise<AppNotification[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('id, type, title, message, read_at, created_at, metadata')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const typeMap: Record<string, NotificationType> = {
      contribution: 'contribution',
      goal: 'goal',
      community: 'community',
      alert: 'alert',
      system: 'system',
    };

    return (data ?? []).map((row: Record<string, unknown>) => ({
      id: row.id as string,
      type: typeMap[String(row.type).toLowerCase()] ?? 'system',
      title: row.title as string,
      body: row.message as string,
      createdAt: row.created_at as string,
      read: !!row.read_at,
      href: undefined,
    }));
  },

  async markRead(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  },

  async markAllRead(): Promise<void> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .is('read_at', null);

    if (error) throw error;
  },
};
