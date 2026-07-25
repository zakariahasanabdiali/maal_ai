'use client';

import * as React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  Crown,
  CheckCircle2,
  Clock,
  AlertCircle,
  Wallet,
  Target,
  TrendingUp,
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatCard } from '@/components/dashboard/stat-card';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDate, initials } from '@/lib/format';
import { mockCommunity, communityMembers } from '@/mock/community';
import type { CommunityGroup } from '@/types';
import { toast } from 'sonner';

const memberStatus = {
  paid: { icon: CheckCircle2, tone: 'text-success', label: 'Paid' },
  pending: { icon: Clock, tone: 'text-warning', label: 'Pending' },
  partial: { icon: AlertCircle, tone: 'text-chart-4', label: 'Partial' },
};

export default function CommunityPage() {
  const [groups] = useState<CommunityGroup[]>(mockCommunity);
  const [selected, setSelected] = useState<CommunityGroup>(mockCommunity[0]);
  const [open, setOpen] = useState(false);

  const totalPool = groups.reduce((s, g) => s + g.totalPool, 0);
  const totalMembers = groups.reduce((s, g) => s + g.members, 0);
  const yourMonthly = groups.reduce((s, g) => s + g.yourContribution, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Community Finance"
        description="Manage ayuuto savings groups and track collective contributions."
        actions={
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" /> New group
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          index={0}
          label="Active Groups"
          value={String(groups.length)}
          icon={Users}
          accent="primary"
        />
        <StatCard
          index={1}
          label="Total Members"
          value={String(totalMembers)}
          icon={Users}
          accent="accent"
        />
        <StatCard
          index={2}
          label="Total Pool"
          value={formatCurrency(totalPool)}
          icon={Wallet}
          accent="success"
        />
        <StatCard
          index={3}
          label="Your Monthly"
          value={formatCurrency(yourMonthly)}
          icon={TrendingUp}
          accent="primary"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Group list */}
        <div className="space-y-3 lg:col-span-1">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Your groups
          </h2>
          {groups.map((g, i) => (
            <motion.button
              key={g.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setSelected(g)}
              className={cn(
                'w-full rounded-xl border p-4 text-left transition-all hover:shadow-premium-sm',
                selected.id === g.id
                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                  : 'bg-card hover:border-muted-foreground/30'
              )}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{g.name}</p>
                <Badge variant="secondary" className="text-xs">
                  {g.members} members
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatCurrency(g.totalPool)} pool
              </p>
            </motion.button>
          ))}
        </div>

        {/* Selected group detail */}
        <div className="space-y-5 lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="bg-brand-gradient p-5 text-primary-foreground">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold">{selected.name}</h2>
                  <p className="mt-1 text-sm text-primary-foreground/80">
                    {selected.description}
                  </p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15">
                  <Users className="h-5 w-5 text-accent" />
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-white/10 p-2.5 backdrop-blur">
                  <p className="text-[0.65rem] text-primary-foreground/70">Members</p>
                  <p className="text-sm font-semibold">{selected.members}</p>
                </div>
                <div className="rounded-lg bg-white/10 p-2.5 backdrop-blur">
                  <p className="text-[0.65rem] text-primary-foreground/70">Monthly</p>
                  <p className="text-sm font-semibold">
                    {formatCurrency(selected.monthlyContribution)}
                  </p>
                </div>
                <div className="rounded-lg bg-white/10 p-2.5 backdrop-blur">
                  <p className="text-[0.65rem] text-primary-foreground/70">Pool</p>
                  <p className="text-sm font-semibold">
                    {formatCurrency(selected.totalPool)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-accent" />
                <p className="text-sm font-semibold">Community Goal</p>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {selected.goal}
              </p>

              <div className="mt-4 flex items-center gap-2">
                <Crown className="h-4 w-4 text-accent" />
                <p className="text-sm">
                  Admin: <span className="font-medium">{selected.admin}</span>
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-warning" />
                <p className="text-sm text-muted-foreground">
                  Next payout: <span className="font-medium text-foreground">{formatDate(selected.nextPayout)}</span>
                </p>
              </div>

              <div className="mt-5 rounded-lg bg-muted/50 p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Your contribution this cycle
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {formatCurrency(selected.yourContribution)}
                </p>
                <Progress
                  value={100}
                  className="mt-2 h-2"
                />
                <p className="mt-1.5 text-xs text-success">Fully contributed</p>
              </div>
            </div>
          </Card>

          {/* Members */}
          <Card className="p-5">
            <h3 className="text-base font-semibold">Group Members</h3>
            <p className="text-xs text-muted-foreground">
              Contribution tracking for this cycle
            </p>
            <ul className="mt-4 space-y-2">
              {communityMembers.map((m) => {
                const st = memberStatus[m.status as keyof typeof memberStatus];
                const Icon = st.icon;
                return (
                  <li
                    key={m.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-gradient text-xs font-bold text-primary-foreground">
                      {m.avatar}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(m.contributed)} contributed
                      </p>
                    </div>
                    <span
                      className={cn(
                        'flex items-center gap-1 text-xs font-medium',
                        st.tone
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" /> {st.label}
                    </span>
                  </li>
                );
              })}
            </ul>
            <Button
              className="mt-4 w-full"
              variant="outline"
              onClick={() => toast.success('Contribution reminder sent to pending members')}
            >
              Send reminder to pending members
            </Button>
          </Card>
        </div>
      </div>

      {/* New group modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a community group</DialogTitle>
            <DialogDescription>
              Create a new ayuuto savings group and invite members.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="group-name">Group name</Label>
              <Input id="group-name" placeholder="e.g. Hodan Community Fund" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="group-monthly">Monthly contribution</Label>
                <Input id="group-monthly" type="number" placeholder="500" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="group-goal">Goal</Label>
                <Input id="group-goal" placeholder="e.g. Water well" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="group-payout">Payout frequency</Label>
              <Select defaultValue="monthly">
                <SelectTrigger id="group-payout">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly rotation</SelectItem>
                  <SelectItem value="quarterly">Quarterly rotation</SelectItem>
                  <SelectItem value="goal">Goal-based (no rotation)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success('Group created (demo)');
                setOpen(false);
              }}
            >
              Create group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
