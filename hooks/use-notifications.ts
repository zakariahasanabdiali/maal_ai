import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '@/services/notifications.service';

export function useNotifications() {
  return useQuery<import('@/types/domain').AppNotification[]>({
    queryKey: ['notifications'],
    queryFn: () => notificationsService.list() as Promise<import('@/types/domain').AppNotification[]>,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsService.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsService.markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useUnreadCount() {
  const { data } = useNotifications();
  return data?.filter((n: import('@/types/domain').AppNotification) => !n.read).length ?? 0;
}
