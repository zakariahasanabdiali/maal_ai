'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export function StatCard({
  label,
  value,
  icon: Icon,
  change,
  trend = 'up',
  accent,
  index = 0,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  trend?: 'up' | 'down';
  accent?: 'primary' | 'accent' | 'success' | 'destructive';
  index?: number;
}) {
  const accentBg = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/15 text-accent-foreground',
    success: 'bg-success/10 text-success',
    destructive: 'bg-destructive/10 text-destructive',
  }[accent ?? 'primary'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Card className="p-5 transition-shadow hover:shadow-premium">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              'grid h-10 w-10 place-items-center rounded-xl',
              accentBg
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          {change && (
            <span
              className={cn(
                'flex items-center gap-0.5 text-xs font-semibold',
                trend === 'up' ? 'text-success' : 'text-destructive'
              )}
            >
              {trend === 'up' ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {change}
            </span>
          )}
        </div>
        <p className="mt-4 text-2xl font-bold tracking-tight">{value}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
      </Card>
    </motion.div>
  );
}
