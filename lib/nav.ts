import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Sparkles,
  ArrowLeftRight,
  Wallet,
  PiggyBank,
  Users,
  BarChart3,
  Settings,
  HandCoins,
  Bell,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export const dashboardNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'AI Assistant', href: '/dashboard/ai-assistant', icon: Sparkles, badge: 'AI' },
  { label: 'Contributions', href: '/dashboard/contributions', icon: HandCoins },
  { label: 'Transactions', href: '/dashboard/transactions', icon: ArrowLeftRight },
  { label: 'Budget', href: '/dashboard/budget', icon: Wallet },
  { label: 'Savings', href: '/dashboard/savings', icon: PiggyBank },
  { label: 'Community', href: '/dashboard/community', icon: Users },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export const mobileNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'AI', href: '/dashboard/ai-assistant', icon: Sparkles },
  { label: 'Contributions', href: '/dashboard/contributions', icon: HandCoins },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];
