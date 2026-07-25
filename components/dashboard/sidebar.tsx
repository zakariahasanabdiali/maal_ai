'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { dashboardNav } from '@/lib/nav';
import { Logo } from '@/components/logo';
import { Sparkles, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    router.push('/');
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-card/50 backdrop-blur-xl lg:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Logo size="md" href="/dashboard" />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        <p className="px-3 pb-2 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Menu
        </p>
        {dashboardNav.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                active
                  ? 'bg-primary text-primary-foreground shadow-premium-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-[1.15rem] w-[1.15rem] shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-[0.6rem] font-bold',
                    active
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-accent/20 text-accent-foreground'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <div className="mb-2 rounded-xl bg-brand-gradient p-4 text-primary-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <p className="text-xs font-semibold">Maal-AI Pro</p>
          </div>
          <p className="mt-1 text-[0.7rem] text-primary-foreground/80">
            Unlock unlimited AI insights & reports.
          </p>
          <Button
            size="sm"
            className="mt-3 w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Upgrade
          </Button>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}

export function SidebarTrigger() {
  return null;
}
