'use client';

import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  ScanLine,
} from 'lucide-react';
import Link from 'next/link';

import { PageHeader } from '@/components/page-header';
import { BalanceCard } from '@/components/dashboard/balance-card';
import { StatCard } from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ReceiptUpload } from '@/components/receipt-upload';
import { cn } from '@/lib/utils';
import { formatCurrency, relativeDate } from '@/lib/format';
import { categoryMeta } from '@/mock/transactions';
import { mockTransactions } from '@/mock/transactions';
import { mockSavings } from '@/mock/savings';
import {
  balanceSummary,
  monthlyCashflow,
  categorySpending,
  aiInsights,
} from '@/mock/analytics';

const insightIcon = {
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle2,
};

const insightTone = {
  warning: 'border-warning/30 bg-warning/10 text-warning',
  info: 'border-chart-4/30 bg-chart-4/10 text-chart-4',
  success: 'border-success/30 bg-success/10 text-success',
};

export default function DashboardPage() {
  const recent = mockTransactions.slice(0, 6);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back, Aamina — here's your financial overview."
        actions={
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link href="/dashboard/reports">View reports</Link>
          </Button>
        }
      />

      {/* Balance + stats */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <BalanceCard
            balance={balanceSummary.balance}
            monthlyIncome={balanceSummary.monthlyIncome}
            monthlyExpenses={balanceSummary.monthlyExpenses}
            savings={balanceSummary.savings}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:col-span-2 lg:grid-cols-2 xl:grid-cols-4">
          <StatCard
            index={0}
            label="Monthly Income"
            value={formatCurrency(balanceSummary.monthlyIncome)}
            icon={TrendingUp}
            change={`${balanceSummary.incomeChange}%`}
            trend="up"
            accent="success"
          />
          <StatCard
            index={1}
            label="Monthly Expenses"
            value={formatCurrency(balanceSummary.monthlyExpenses)}
            icon={TrendingDown}
            change={`${balanceSummary.expensesChange}%`}
            trend="down"
            accent="destructive"
          />
          <StatCard
            index={2}
            label="Total Savings"
            value={formatCurrency(balanceSummary.savings)}
            icon={PiggyBank}
            change={`${balanceSummary.savingsChange}%`}
            trend="up"
            accent="accent"
          />
          <StatCard
            index={3}
            label="Active Budgets"
            value="6"
            icon={Wallet}
            change="On track"
            trend="up"
            accent="primary"
          />
        </div>
      </div>

      {/* AI Insights */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-semibold">AI Financial Insights</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {aiInsights.map((ins, i) => {
            const Icon = insightIcon[ins.type];
            return (
              <motion.div
                key={ins.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className={cn('h-full border-l-4 p-4', insightTone[ins.type])}>
                  <div className="flex items-start gap-2.5">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {ins.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {ins.body}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Cash Flow</h3>
              <p className="text-xs text-muted-foreground">
                Income vs expenses over 7 months
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-chart-1" /> Income
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-chart-5" /> Expenses
              </span>
            </div>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyCashflow} margin={{ left: -16, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-5))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--chart-5))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => formatCurrency(v)}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2.5}
                  fill="url(#gIncome)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="hsl(var(--chart-5))"
                  strokeWidth={2.5}
                  fill="url(#gExpense)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-base font-semibold">Spending by Category</h3>
          <p className="text-xs text-muted-foreground">This month</p>
          <div className="mt-2 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySpending}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {categorySpending.map((c) => (
                    <Cell key={c.name} fill={c.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => formatCurrency(v)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 space-y-1.5">
            {categorySpending.slice(0, 4).map((c) => (
              <li key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                  {c.name}
                </span>
                <span className="font-medium">{formatCurrency(c.value, 'USD', { compact: true })}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Recent transactions + savings goals */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Recent Transactions</h3>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/transactions">
                View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          <ul className="mt-4 divide-y">
            {recent.map((t) => {
              const meta = categoryMeta[t.category];
              const positive = t.amount > 0;
              return (
                <li key={t.id} className="flex items-center gap-3 py-3">
                  <span
                    className={cn(
                      'grid h-9 w-9 shrink-0 place-items-center rounded-lg',
                      positive
                        ? 'bg-success/10 text-success'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {meta.label} · {relativeDate(t.date)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 text-sm font-semibold',
                      positive ? 'text-success' : 'text-foreground'
                    )}
                  >
                    {formatCurrency(t.amount, t.currency, { signed: true })}
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Saving Goals</h3>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/savings">
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          <ul className="mt-4 space-y-4">
            {mockSavings.slice(0, 3).map((g) => {
              const pct = Math.round((g.current / g.target) * 100);
              return (
                <li key={g.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span>{g.emoji}</span> {g.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{pct}%</span>
                  </div>
                  <Progress value={pct} className="mt-2 h-2" />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatCurrency(g.current)} of {formatCurrency(g.target)}
                  </p>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      {/* Receipt upload */}
      <Card className="p-5">
        <div className="flex items-center gap-2">
          <ScanLine className="h-4 w-4 text-accent" />
          <h3 className="text-base font-semibold">Scan a Receipt</h3>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Upload a receipt and Maal-AI will extract the amount, merchant, and date automatically.
        </p>
        <div className="mt-4">
          <ReceiptUpload />
        </div>
      </Card>
    </div>
  );
}
