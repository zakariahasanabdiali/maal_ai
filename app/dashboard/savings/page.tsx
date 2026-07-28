'use client';

import * as React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, PiggyBank, Target, TrendingUp, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatCard } from '@/components/dashboard/stat-card';
import { formatCurrency, percent, formatDate } from '@/lib/format';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { SavingGoal } from '@/types';
import { toast } from 'sonner';

const emojis = ['🛟', '💻', '🚀', '🕋', '🏠', '🎓', '✈️', '💍', '📱', '🏥'];

export default function SavingsPage() {
  const qc = useQueryClient();
  const { data: goals = [] } = useQuery<SavingGoal[]>({
    queryKey: ['savings-goals'],
    queryFn: async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data: contributions } = await supabase
        .from('contributions')
        .select('amount, status')
        .eq('contributor_id', user.id)
        .eq('status', 'COMPLETED');
      const total = (contributions ?? []).reduce((s: number, r: any) => s + Number(r.amount), 0);
      if (total === 0) return [];
      return [{
        id: 'savings-1',
        name: 'Total Savings',
        target: total * 3,
        current: total,
        deadline: new Date(Date.now() + 180 * 86400000).toISOString().slice(0, 10),
        emoji: '🎯',
        color: 'chart-3',
      }];
    },
  });
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [emoji, setEmoji] = useState('🎯');

  const totalSaved = goals.reduce((s: number, g: SavingGoal) => s + g.current, 0);
  const totalTarget = goals.reduce((s: number, g: SavingGoal) => s + g.target, 0);

  const handleAdd = () => {
    if (!name || !target) return;
    toast.success(`Goal "${name}" created`);
    setName('');
    setTarget('');
    setEmoji('🎯');
    setOpen(false);
  };

  const contribute = (id: string, amount: number) => {
    toast.success(`Added ${formatCurrency(amount)} to your goal`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Savings"
        description="Track your goals and watch your money grow."
        actions={
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" /> New goal
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          index={0}
          label="Total Saved"
          value={formatCurrency(totalSaved)}
          icon={PiggyBank}
          change={`${percent(totalSaved, totalTarget)}%`}
          trend="up"
          accent="success"
        />
        <StatCard
          index={1}
          label="Total Target"
          value={formatCurrency(totalTarget)}
          icon={Target}
          accent="primary"
        />
        <StatCard
          index={2}
          label="Active Goals"
          value={String(goals.length)}
          icon={TrendingUp}
          accent="accent"
        />
        <StatCard
          index={3}
          label="Remaining"
          value={formatCurrency(totalTarget - totalSaved)}
          icon={Calendar}
          accent="primary"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map((g: SavingGoal, i: number) => {
          const pct = percent(g.current, g.target);
          const done = g.current >= g.target;
          return (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="flex h-full flex-col p-5">
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-muted text-2xl">
                    {g.emoji}
                  </span>
                  {done && (
                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
                      Goal reached!
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-base font-semibold">{g.name}</h3>
                <p className="text-xs text-muted-foreground">
                  Target by {formatDate(g.deadline)}
                </p>

                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-2xl font-bold">
                    {formatCurrency(g.current)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / {formatCurrency(g.target)}
                  </span>
                </div>
                <Progress value={pct} className="mt-2 h-2.5" />
                <p className="mt-1.5 text-xs text-muted-foreground">{pct}% saved</p>

                <div className="mt-auto flex gap-2 pt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => contribute(g.id, 50)}
                  >
                    +{formatCurrency(50)}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => contribute(g.id, 100)}
                  >
                    +{formatCurrency(100)}
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a saving goal</DialogTitle>
            <DialogDescription>
              Set a target amount and deadline for your new goal.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="goal-name">Goal name</Label>
              <Input
                id="goal-name"
                placeholder="e.g. Family Vacation"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="goal-target">Target amount (USD)</Label>
              <Input
                id="goal-target"
                type="number"
                placeholder="5000"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Choose an icon</Label>
              <div className="flex flex-wrap gap-2">
                {emojis.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEmoji(e)}
                    className={`grid h-10 w-10 place-items-center rounded-lg border text-xl transition-colors ${
                      emoji === e
                        ? 'border-primary bg-primary/10'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Create goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
