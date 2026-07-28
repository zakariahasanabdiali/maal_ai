import type { Contribution, Member, AppNotification } from '@/types/domain';
import type { Transaction } from '@/types';

export const categoryMeta: Record<
  Transaction['category'],
  { label: string; color: string; icon: string }
> = {
  food: { label: 'Food & Groceries', color: 'chart-1', icon: 'Utensils' },
  transport: { label: 'Transport', color: 'chart-4', icon: 'Bus' },
  shopping: { label: 'Shopping', color: 'chart-3', icon: 'ShoppingBag' },
  bills: { label: 'Bills & Utilities', color: 'chart-2', icon: 'Receipt' },
  education: { label: 'Education', color: 'chart-5', icon: 'GraduationCap' },
  business: { label: 'Business', color: 'chart-1', icon: 'Briefcase' },
  entertainment: { label: 'Entertainment', color: 'chart-3', icon: 'Clapperboard' },
  health: { label: 'Health', color: 'chart-4', icon: 'HeartPulse' },
  income: { label: 'Income', color: 'success', icon: 'TrendingUp' },
  savings: { label: 'Savings', color: 'chart-2', icon: 'PiggyBank' },
  community: { label: 'Community', color: 'primary', icon: 'Users' },
  other: { label: 'Other', color: 'muted', icon: 'Circle' },
};

export const contributionMethodMeta: Record<
  Contribution['method'],
  { label: string; color: string }
> = {
  cash: { label: 'Cash', color: 'warning' },
  mobile: { label: 'Mobile Money', color: 'chart-4' },
  bank: { label: 'Bank Transfer', color: 'chart-2' },
  evc: { label: 'EVC Plus', color: 'chart-1' },
};

export const contributionStatusMeta: Record<
  Contribution['status'],
  { label: string; color: string }
> = {
  completed: { label: 'Completed', color: 'success' },
  pending: { label: 'Pending', color: 'warning' },
  failed: { label: 'Failed', color: 'destructive' },
};

export const memberRoleMeta: Record<
  Member['role'],
  { label: string; color: string }
> = {
  admin: { label: 'Admin', color: 'primary' },
  treasurer: { label: 'Treasurer', color: 'accent' },
  member: { label: 'Member', color: 'muted' },
};

export const memberStatusMeta: Record<
  Member['status'],
  { label: string; color: string }
> = {
  active: { label: 'Active', color: 'success' },
  inactive: { label: 'Inactive', color: 'muted' },
  invited: { label: 'Invited', color: 'warning' },
};

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
