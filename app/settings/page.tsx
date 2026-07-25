'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  User as UserIcon,
  Lock,
  Bell,
  Palette,
  Globe,
  Settings as SettingsIcon,
  Mail,
  Phone,
  MapPin,
  Camera,
  LogOut,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthStore } from '@/store/auth-store';
import { initials } from '@/lib/format';
import { cn } from '@/lib/utils';

const sections = [
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'language', label: 'Language', icon: Globe },
  { id: 'preferences', label: 'Account', icon: SettingsIcon },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const setCurrency = useAuthStore((s) => s.setCurrency);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const [active, setActive] = useState('profile');
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone ?? '');
  const [city, setCity] = useState(user.city);
  const [currency, setCurrencyState] = useState(user.currency);

  const [notif, setNotif] = useState({
    budgetAlerts: true,
    goalMilestones: true,
    weeklyReport: false,
    communityUpdates: true,
    productNews: false,
  });

  const saveProfile = () => {
    updateProfile({ name, email, phone, city });
    toast.success('Profile updated');
  };

  const handleCurrency = (c: 'USD' | 'SOS') => {
    setCurrencyState(c);
    setCurrency(c);
    toast.success(`Currency set to ${c === 'USD' ? 'US Dollar' : 'Somali Shilling'}`);
  };

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    router.push('/');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account, security, and preferences."
      />

      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        {/* Sidebar nav */}
        <nav className="flex gap-1 overflow-x-auto lg:flex-col">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={cn(
                  'flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active === s.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {s.label}
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className="space-y-5">
          {/* Profile */}
          {active === 'profile' && (
            <Card className="p-6">
              <h3 className="text-base font-semibold">Profile</h3>
              <p className="text-sm text-muted-foreground">
                Update your personal information.
              </p>

              <div className="mt-6 flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-brand-gradient text-xl font-bold text-primary-foreground">
                      {initials(name)}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border bg-background shadow-sm"
                    aria-label="Change avatar"
                    onClick={() => toast.info('Avatar upload (demo)')}
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div>
                  <p className="font-semibold">{name}</p>
                  <p className="text-sm text-muted-foreground">{email}</p>
                  <Badge className="mt-1 bg-success/10 text-success">{user.accountType} account</Badge>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full name</Label>
                  <div className="relative">
                    <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="pl-9" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-9" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="city">City</Label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={city} onChange={(e) => setCity(e.target.value)} className="pl-9" />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setName(user.name); setEmail(user.email); setPhone(user.phone ?? ''); setCity(user.city);
                }}>
                  Cancel
                </Button>
                <Button onClick={saveProfile}>Save changes</Button>
              </div>
            </Card>
          )}

          {/* Security */}
          {active === 'security' && (
            <Card className="p-6">
              <h3 className="text-base font-semibold">Security</h3>
              <p className="text-sm text-muted-foreground">
                Keep your account secure.
              </p>
              <Separator className="my-5" />
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="current-pwd">Current password</Label>
                  <Input id="current-pwd" type="password" placeholder="••••••••" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="new-pwd">New password</Label>
                    <Input id="new-pwd" type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirm-pwd">Confirm new password</Label>
                    <Input id="confirm-pwd" type="password" placeholder="••••••••" />
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="text-sm font-medium">Two-factor authentication</p>
                    <p className="text-xs text-muted-foreground">
                      Add an extra layer of security to your account.
                    </p>
                  </div>
                  <Switch
                    onCheckedChange={(v) =>
                      toast.success(v ? '2FA enabled' : '2FA disabled')
                    }
                  />
                </div>
                <Button onClick={() => toast.success('Password updated')}>
                  Update password
                </Button>
              </div>
            </Card>
          )}

          {/* Notifications */}
          {active === 'notifications' && (
            <Card className="p-6">
              <h3 className="text-base font-semibold">Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Choose what you want to be notified about.
              </p>
              <Separator className="my-5" />
              <div className="space-y-1">
                {[
                  { key: 'budgetAlerts', label: 'Budget alerts', desc: 'When you approach or exceed a budget limit.' },
                  { key: 'goalMilestones', label: 'Goal milestones', desc: 'When you reach a savings milestone.' },
                  { key: 'weeklyReport', label: 'Weekly report', desc: 'A summary of your finances every Monday.' },
                  { key: 'communityUpdates', label: 'Community updates', desc: 'Group contributions and payout reminders.' },
                  { key: 'productNews', label: 'Product news', desc: 'New features and announcements.' },
                ].map((n) => (
                  <div
                    key={n.key}
                    className="flex items-center justify-between border-b py-3.5 last:border-0"
                  >
                    <div className="pr-4">
                      <p className="text-sm font-medium">{n.label}</p>
                      <p className="text-xs text-muted-foreground">{n.desc}</p>
                    </div>
                    <Switch
                      checked={notif[n.key as keyof typeof notif]}
                      onCheckedChange={(v) =>
                        setNotif((s) => ({ ...s, [n.key]: v }))
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-end">
                <Button onClick={() => toast.success('Notification preferences saved')}>
                  Save preferences
                </Button>
              </div>
            </Card>
          )}

          {/* Theme */}
          {active === 'theme' && (
            <Card className="p-6">
              <h3 className="text-base font-semibold">Theme</h3>
              <p className="text-sm text-muted-foreground">
                Choose how Maal-AI looks to you.
              </p>
              <Separator className="my-5" />
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'light', label: 'Light', bg: 'bg-background', ring: 'ring-foreground' },
                  { key: 'dark', label: 'Dark', bg: 'bg-brand-dark', ring: 'ring-accent' },
                  { key: 'system', label: 'System', bg: 'bg-gradient-to-br from-background to-brand-dark', ring: 'ring-foreground' },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTheme(t.key)}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
                      theme === t.key
                        ? 'border-primary ring-1 ring-primary'
                        : 'border-border hover:border-muted-foreground/40'
                    )}
                  >
                    <span className={cn('h-12 w-full rounded-lg border', t.bg)} />
                    <span className="text-sm font-medium">{t.label}</span>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Language */}
          {active === 'language' && (
            <Card className="p-6">
              <h3 className="text-base font-semibold">Language & Currency</h3>
              <p className="text-sm text-muted-foreground">
                Set your display language and currency.
              </p>
              <Separator className="my-5" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Display language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="so">Soomaali</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Currency</Label>
                  <Select value={currency} onValueChange={handleCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="SOS">Somali Shilling (So.Sh)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <Button onClick={() => toast.success('Language settings saved')}>
                  Save
                </Button>
              </div>
            </Card>
          )}

          {/* Preferences / Account */}
          {active === 'preferences' && (
            <Card className="p-6">
              <h3 className="text-base font-semibold">Account preferences</h3>
              <p className="text-sm text-muted-foreground">
                Manage your account status and data.
              </p>
              <Separator className="my-5" />
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="text-sm font-medium">Account type</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.accountType} — joined {user.joinedAt}
                    </p>
                  </div>
                  <Badge className="capitalize">{user.accountType}</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="text-sm font-medium">Email verification</p>
                    <p className="text-xs text-muted-foreground">
                      Your email is verified.
                    </p>
                  </div>
                  <Badge className="bg-success/10 text-success">Verified</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-destructive/30 p-4">
                  <div>
                    <p className="text-sm font-medium text-destructive">
                      Sign out
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Sign out of your account on this device.
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="mr-1.5 h-4 w-4" /> Sign out
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-destructive/30 p-4">
                  <div>
                    <p className="text-sm font-medium text-destructive">
                      Delete account
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Permanently remove your account and data.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      toast.error('Account deletion is disabled in demo mode')
                    }
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
