'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/hooks/use-notifications';
import { useUnreadCount } from '@/hooks/use-notifications';
import { relativeDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { notificationTypeMeta } from '@/mock/notifications';
import {
  Wallet,
  Target,
  Users,
  AlertTriangle,
  Info,
  Loader2,
} from 'lucide-react';

const iconMap: Record<string, typeof Wallet> = {
  Wallet,
  Target,
  Users,
  AlertTriangle,
  Info,
};

export function NotificationBell() {
  const { data: notifications, isLoading } = useNotifications();
  const unread = useUnreadCount();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const [open, setOpen] = React.useState(false);

  const recent = notifications?.slice(0, 6) ?? [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Notifications${unread ? ` (${unread} unread)` : ''}`}
        >
          <Bell className="h-[1.15rem] w-[1.15rem]" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[0.6rem] font-bold text-accent-foreground ring-2 ring-background">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          {unread > 0 && (
            <button
              onClick={() => markAllRead.mutate()}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : recent.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No notifications yet.
          </p>
        ) : (
          <ul className="max-h-80 overflow-y-auto scrollbar-thin">
            {recent.map((n: typeof recent[number]) => {
              const meta = notificationTypeMeta[n.type as keyof typeof notificationTypeMeta];
              const Icon = iconMap[meta.icon] ?? Info;
              return (
                <li key={n.id}>
                  <Link
                    href={n.href ?? '/notifications'}
                    onClick={() => {
                      markRead.mutate(n.id);
                      setOpen(false);
                    }}
                    className={cn(
                      'flex gap-3 border-b px-4 py-3 transition-colors hover:bg-muted/50',
                      !n.read && 'bg-accent/5'
                    )}
                  >
                    <span
                      className={cn(
                        'mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg',
                        `bg-${meta.color}/15`
                      )}
                    >
                      <Icon className={cn('h-4 w-4', `text-${meta.color}`)} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {n.body}
                      </p>
                      <p className="mt-0.5 text-[0.65rem] text-muted-foreground/70">
                        {relativeDate(n.createdAt)}
                      </p>
                    </div>
                    {!n.read && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <div className="border-t p-2">
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href="/notifications" onClick={() => setOpen(false)}>
              View all notifications
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
