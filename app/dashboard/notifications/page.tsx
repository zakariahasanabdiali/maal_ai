'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCheck,
  Wallet,
  Target,
  Users,
  AlertTriangle,
  Info,
  Mail,
  Filter,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/hooks/use-notifications';
import { notificationTypeMeta } from '@/lib/meta';
import { relativeDate, formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

const iconMap: Record<string, typeof Wallet> = {
  Wallet,
  Target,
  Users,
  AlertTriangle,
  Info,
};

export default function NotificationsPage() {
  const { data: notifications, isLoading, isError, refetch } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const [filter, setFilter] = useState('all');

  const filtered = (notifications ?? []).filter((n: import('@/types/domain').AppNotification) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications?.filter((n: import('@/types/domain').AppNotification) => !n.read).length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Stay up to date with your contributions, goals, and community activity."
        actions={
          unreadCount > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
            >
              <CheckCheck className="mr-1.5 h-4 w-4" />
              {markAllRead.isPending ? 'Marking…' : 'Mark all read'}
            </Button>
          )
        }
      />

      {/* Filter tabs */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">
            All {notifications && `(${notifications.length})`}
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>
      </Tabs>

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <Card className="space-y-3 p-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-muted/60" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 animate-pulse rounded bg-muted/60" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-muted/60" />
              </div>
            </div>
          ))}
        </Card>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description={filter === 'unread' ? 'You are all caught up!' : 'Notifications will appear here.'}
        />
      ) : (
        <Card className="divide-y p-0">
          <AnimatePresence>
            {filtered.map((n: typeof filtered[number], i: number) => {
              const meta = notificationTypeMeta[n.type as keyof typeof notificationTypeMeta];
              const Icon = iconMap[meta.icon] ?? Info;
              return (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={n.href ?? '#'}
                    onClick={() => !n.read && markRead.mutate(n.id)}
                    className={cn(
                      'flex gap-4 px-5 py-4 transition-colors hover:bg-muted/40',
                      !n.read && 'bg-accent/5'
                    )}
                  >
                    <span
                      className={cn(
                        'mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl',
                        `bg-${meta.color}/15 text-${meta.color}`
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{n.title}</p>
                        {!n.read && (
                          <span className="h-2 w-2 rounded-full bg-accent" aria-label="Unread" />
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                      <p className="mt-1.5 text-xs text-muted-foreground/70">
                        {formatDate(n.createdAt)} · {relativeDate(n.createdAt)}
                      </p>
                    </div>
                    {!n.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="shrink-0 self-center"
                        onClick={(e) => {
                          e.preventDefault();
                          markRead.mutate(n.id);
                        }}
                      >
                        Mark read
                      </Button>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Card>
      )}
    </div>
  );
}
