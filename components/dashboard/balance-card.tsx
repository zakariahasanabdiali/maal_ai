'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import type { Currency } from '@/lib/format';

export function BalanceCard({
  balance,
  monthlyIncome,
  monthlyExpenses,
  savings,
  currency = 'USD',
}: {
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savings: number;
  currency?: Currency;
}) {
  const stats = [
    {
      label: 'Income',
      value: monthlyIncome,
      icon: ArrowUpRight,
      tone: 'text-success',
    },
    {
      label: 'Expenses',
      value: monthlyExpenses,
      icon: ArrowDownLeft,
      tone: 'text-destructive',
    },
    { label: 'Savings', value: savings, tone: 'text-accent-foreground' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden border-0 bg-brand-gradient p-6 text-primary-foreground shadow-premium">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

        <div className="relative">
          <p className="text-sm font-medium text-primary-foreground/80">
            Total Balance
          </p>
          <div className="mt-1 flex items-end gap-2">
            <span className="text-4xl font-bold tracking-tight">
              {formatCurrency(balance, currency)}
            </span>
            <span className="mb-1 rounded-full bg-accent/30 px-2 py-0.5 text-xs font-semibold text-accent">
              +12.4%
            </span>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="rounded-xl bg-white/10 p-3 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-1.5 text-xs text-primary-foreground/80">
                    {Icon && <Icon className={cn('h-3.5 w-3.5', s.tone)} />}
                    {s.label}
                  </div>
                  <p className="mt-1.5 text-sm font-semibold">
                    {formatCurrency(s.value, currency, { compact: true })}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
