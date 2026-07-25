'use client';

import * as React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Wallet,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { formatCurrency, percent } from '@/lib/format';
import { mockBudget, budgetMeta } from '@/mock/budget';
import type { BudgetCategory } from '@/types';
import { toast } from 'sonner';

const presetCategories = [
  'Food & Groceries',
  'Transport',
  'Education',
  'Business',
  'Entertainment',
  'Bills & Utilities',
  'Health',
  'Shopping',
];

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<BudgetCategory[]>(mockBudget);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');

  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);

  const handleAdd = () => {
    if (!name || !limit) return;
    const newBudget: BudgetCategory = {
      id: `b${Date.now()}`,
      name,
      limit: Number(limit),
      spent: 0,
      color: 'chart-4',
    };
    setBudgets((b) => [...b, newBudget]);
    toast.success(`Budget for ${name} created`);
    setName('');
    setLimit('');
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Budget"
        description="Set spending limits and track progress across categories."
        actions={
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" /> Add budget
          </Button>
        }
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          index={0}
          label="Total Budget"
          value={formatCurrency(totalLimit)}
          icon={Wallet}
          accent="primary"
        />
        <StatCard
          index={1}
          label="Total Spent"
          value={formatCurrency(totalSpent)}
          icon={TrendingDown}
          change={`${percent(totalSpent, totalLimit)}%`}
          trend="down"
          accent="destructive"
        />
        <StatCard
          index={2}
          label="Remaining"
          value={formatCurrency(totalLimit - totalSpent)}
          icon={CheckCircle2}
          accent="success"
        />
        <StatCard
          index={3}
          label="Categories"
          value={String(budgets.length)}
          icon={Wallet}
          accent="accent"
        />
      </div>

      {/* Overall progress */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Overall Budget Usage</h3>
          <span className="text-sm font-semibold">
            {percent(totalSpent, totalLimit)}%
          </span>
        </div>
        <Progress
          value={percent(totalSpent, totalLimit)}
          className="mt-3 h-3"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          {formatCurrency(totalSpent)} of {formatCurrency(totalLimit)} used this
          month
        </p>
      </Card>

      {/* Category cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {budgets.map((b, i) => {
          const pct = percent(b.spent, b.limit);
          const over = b.spent > b.limit;
          const near = pct >= 80 && !over;
          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold">{b.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatCurrency(b.limit)} limit
                    </p>
                  </div>
                  {over ? (
                    <span className="flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                      <AlertTriangle className="h-3 w-3" /> Over
                    </span>
                  ) : near ? (
                    <span className="flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
                      <AlertTriangle className="h-3 w-3" /> Near limit
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                      <CheckCircle2 className="h-3 w-3" /> On track
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-2xl font-bold">
                    {formatCurrency(b.spent)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    of {formatCurrency(b.limit)}
                  </span>
                </div>
                <Progress
                  value={Math.min(pct, 100)}
                  className={cn('mt-2 h-2.5', over && '[&>div]:bg-destructive')}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatCurrency(Math.max(b.limit - b.spent, 0))} remaining
                </p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Add budget modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a budget</DialogTitle>
            <DialogDescription>
              Set a monthly spending limit for a category.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="budget-name">Category name</Label>
              <Select value={name} onValueChange={setName}>
                <SelectTrigger id="budget-name">
                  <SelectValue placeholder="Choose or type a category" />
                </SelectTrigger>
                <SelectContent>
                  {presetCategories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="budget-limit">Monthly limit (USD)</Label>
              <Input
                id="budget-limit"
                type="number"
                placeholder="500"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Create budget</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
