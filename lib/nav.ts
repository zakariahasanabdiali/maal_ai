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
  { label: 'AI Assistant', href: '/ai-assistant', icon: Sparkles, badge: 'AI' },
  { label: 'Contributions', href: '/contributions', icon: HandCoins },
  { label: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
  { label: 'Budget', href: '/budget', icon: Wallet },
  { label: 'Savings', href: '/savings', icon: PiggyBank },
  { label: 'Community', href: '/community', icon: Users },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
  { label: 'Notifications', href: '/notifications', icon: Bell },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export const mobileNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'AI', href: '/ai-assistant', icon: Sparkles },
  { label: 'Contributions', href: '/contributions', icon: HandCoins },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/settings', icon: Settings },
];
