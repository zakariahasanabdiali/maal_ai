import type { AppNotification } from '@/types/domain';

export const mockNotifications: AppNotification[] = [
  { id: 'n1', type: 'contribution', title: 'New contribution received', body: 'Yusuf Ali contributed $500 to Hodan Community Fund.', createdAt: '2026-07-22T09:14:00Z', read: false, href: '/contributions/c01' },
  { id: 'n2', type: 'goal', title: 'Savings milestone reached', body: 'Your Emergency Fund reached 64% of its goal. Keep going!', createdAt: '2026-07-22T07:30:00Z', read: false, href: '/savings' },
  { id: 'n3', type: 'community', title: 'Group payout reminder', body: 'Hodan Community Fund rotates its $12,500 pool on August 1st.', createdAt: '2026-07-21T18:00:00Z', read: false, href: '/community' },
  { id: 'n4', type: 'alert', title: 'Budget warning', body: 'Your Food & Groceries budget is at 70% with 10 days left.', createdAt: '2026-07-21T15:22:00Z', read: true, href: '/budget' },
  { id: 'n5', type: 'contribution', title: 'Payment failed', body: 'Yusuf Ali\'s $1,000 contribution failed — insufficient funds.', createdAt: '2026-07-21T11:10:00Z', read: true, href: '/contributions/c09' },
  { id: 'n6', type: 'system', title: 'Welcome to Maal-AI Pro', body: 'Your account has been upgraded. Enjoy unlimited AI insights!', createdAt: '2026-07-20T10:00:00Z', read: true },
  { id: 'n7', type: 'goal', title: 'New saving goal created', body: 'You created the "Family Hajj Fund" goal with a $20,000 target.', createdAt: '2026-07-19T16:45:00Z', read: true, href: '/savings' },
];

export const notificationTypeMeta: Record<
  AppNotification['type'],
  { icon: string; color: string }
> = {
  contribution: { icon: 'Wallet', color: 'chart-1' },
  goal: { icon: 'Target', color: 'success' },
  community: { icon: 'Users', color: 'chart-4' },
  alert: { icon: 'AlertTriangle', color: 'warning' },
  system: { icon: 'Info', color: 'chart-2' },
};
