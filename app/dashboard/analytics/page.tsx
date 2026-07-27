'use client';

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Users,
  HandCoins,
  Sparkles,
  AlertTriangle,
  Info,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { motion } from 'framer-motion';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { StatCard } from '@/components/dashboard/stat-card';
import { ErrorState } from '@/components/error-state';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import {
  useMonthlyAnalytics,
  useContributionByCategory,
  useAnalyticsSummary,
  useAnalyticsInsights,
} from '@/hooks/use-analytics';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const tooltipStyle = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 12,
  fontSize: 12,
};

const insightConfig = {
  success: { icon: CheckCircle2, tone: 'border-success/30 bg-success/10 text-success' },
  info: { icon: Info, tone: 'border-chart-4/30 bg-chart-4/10 text-chart-4' },
  warning: { icon: AlertTriangle, tone: 'border-warning/30 bg-warning/10 text-warning' },
};

export default function AnalyticsPage() {
  const { data: monthly, isLoading: monthlyLoading, isError: monthlyError, refetch: refetchMonthly } = useMonthlyAnalytics();
  const { data: categories, isLoading: catLoading } = useContributionByCategory();
  const { data: summary, isLoading: sumLoading } = useAnalyticsSummary();
  const { data: insights, isLoading: insLoading, isError: insError } = useAnalyticsInsights();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Financial analytics across contributions, revenue, and expenses."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success('Report exported', { description: 'PDF download started (demo).' })}
          >
            <Download className="mr-1.5 h-4 w-4" /> Export
          </Button>
        }
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          index={0}
          label="Total Contributions"
          value={sumLoading ? '—' : formatCurrency(summary.totalContributions)}
          icon={HandCoins}
          change={sumLoading ? undefined : `${summary.contributionChange}%`}
          trend="up"
          accent="success"
        />
        <StatCard
          index={1}
          label="Total Revenue"
          value={sumLoading ? '—' : formatCurrency(summary.totalRevenue)}
          icon={TrendingUp}
          change={sumLoading ? undefined : `${summary.revenueChange}%`}
          trend="up"
          accent="primary"
        />
        <StatCard
          index={2}
          label="Total Expenses"
          value={sumLoading ? '—' : formatCurrency(summary.totalExpenses)}
          icon={TrendingDown}
          change={sumLoading ? undefined : `${summary.expenseChange}%`}
          trend="down"
          accent="destructive"
        />
        <StatCard
          index={3}
          label="Active Members"
          value={sumLoading ? '—' : String(summary.activeMembers)}
          icon={Users}
          accent="accent"
        />
      </div>

      <Tabs defaultValue="trends">
        <TabsList>
          <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
          <TabsTrigger value="revenue">Revenue & Expenses</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Trends */}
        <TabsContent value="trends" className="space-y-5">
          {monthlyError ? (
            <ErrorState onRetry={() => refetchMonthly()} />
          ) : monthlyLoading || !monthly ? (
            <Card className="p-5">
              <LoadingSkeleton className="h-72 w-full rounded-xl" />
            </Card>
          ) : (
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold">Monthly Trends</h3>
                  <p className="text-xs text-muted-foreground">
                    Contributions, revenue, and expenses over 7 months
                  </p>
                </div>
                <div className="hidden items-center gap-3 text-xs sm:flex">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-chart-1" /> Contributions
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-chart-4" /> Revenue
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-chart-5" /> Expenses
                  </span>
                </div>
              </div>
              <div className="mt-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthly} margin={{ left: -16, right: 8, top: 8 }}>
                    <defs>
                      <linearGradient id="gContrib" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--chart-4))" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(var(--chart-4))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--chart-5))" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(var(--chart-5))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `$${v / 1000}k`}
                    />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="contributions" name="Contributions" stroke="hsl(var(--chart-1))" strokeWidth={2.5} fill="url(#gContrib)" />
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(var(--chart-4))" strokeWidth={2.5} fill="url(#gRev)" />
                    <Area type="monotone" dataKey="expenses" name="Expenses" stroke="hsl(var(--chart-5))" strokeWidth={2.5} fill="url(#gExp)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Contributions */}
        <TabsContent value="contributions" className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-2">
            {catLoading || !categories ? (
              <Card className="p-5 lg:col-span-2">
                <LoadingSkeleton className="h-72 w-full rounded-xl" />
              </Card>
            ) : (
              <>
                <Card className="p-5">
                  <h3 className="text-base font-semibold">Contributions by Category</h3>
                  <div className="mt-4 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={categories} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3} strokeWidth={0}>
                          {categories.map((c: typeof categories[number]) => (
                            <Cell key={c.name} fill={c.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-5">
                  <h3 className="text-base font-semibold">Category Breakdown</h3>
                  <ul className="mt-4 space-y-3">
                    {categories.map((c: typeof categories[number]) => {
                      const total = categories.reduce((s: number, x: typeof categories[number]) => s + x.value, 0);
                      const pct = Math.round((c.value / total) * 100);
                      return (
                        <li key={c.name}>
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2">
                              <span className="h-3 w-3 rounded-full" style={{ background: c.color }} />
                              {c.name}
                            </span>
                            <span className="font-medium">
                              {formatCurrency(c.value)} · {pct}%
                            </span>
                          </div>
                          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.color }} />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </Card>
              </>
            )}
          </div>

          {!monthlyLoading && monthly && (
            <Card className="p-5">
              <h3 className="text-base font-semibold">Contribution Volume</h3>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthly} margin={{ left: -16, right: 8, top: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
                    <Bar dataKey="contributions" name="Contributions" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Revenue & Expenses */}
        <TabsContent value="revenue">
          {!monthlyLoading && monthly ? (
            <Card className="p-5">
              <h3 className="text-base font-semibold">Revenue vs Expenses</h3>
              <p className="text-xs text-muted-foreground">Monthly comparison</p>
              <div className="mt-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthly} margin={{ left: -16, right: 8, top: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(var(--chart-4))" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="expenses" name="Expenses" stroke="hsl(var(--chart-5))" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          ) : (
            <Card className="p-5">
              <LoadingSkeleton className="h-80 w-full rounded-xl" />
            </Card>
          )}
        </TabsContent>

        {/* AI Insights */}
        <TabsContent value="insights">
          {insError ? (
            <ErrorState />
          ) : insLoading || !insights ? (
            <div className="grid gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <LoadingSkeleton key={i} className="h-36 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {insights.map((ins: typeof insights[number], i: number) => {
                const cfg = insightConfig[ins.type as 'success' | 'info' | 'warning'];
                const Icon = cfg.icon;
                return (
                  <motion.div
                    key={ins.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Card className={cn('h-full border-l-4 p-5', cfg.tone)}>
                      <div className="flex items-start gap-2.5">
                        <Icon className="mt-0.5 h-5 w-5 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{ins.title}</p>
                          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                            {ins.body}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          <Card className="bg-brand-gradient p-5 text-primary-foreground">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15">
                <Sparkles className="h-5 w-5 text-accent" />
              </span>
              <div>
                <p className="text-sm font-semibold">AI-Powered Insights</p>
                <p className="text-xs text-primary-foreground/80">
                  These insights are generated from your financial data patterns.
                </p>
              </div>
              <Button asChild size="sm" className="ml-auto bg-accent text-accent-foreground hover:bg-accent/90">
                <a href="/dashboard/ai-assistant">Ask the AI</a>
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
