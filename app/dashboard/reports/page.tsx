'use client';

import {
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
  Download,
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import { StatCard } from '@/components/dashboard/stat-card';
import { formatCurrency } from '@/lib/format';
import {
  monthlyCashflow,
  categorySpending,
  savingsTrend,
  balanceSummary,
  aiInsights,
} from '@/lib/analytics-data';
import { toast } from 'sonner';

const tooltipStyle = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 12,
  fontSize: 12,
};

export default function ReportsPage() {
  const netCashflow = balanceSummary.monthlyIncome - balanceSummary.monthlyExpenses;
  const savingsRate = Math.round((netCashflow / balanceSummary.monthlyIncome) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Financial analytics and insights for July 2026."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.success('Report exported', {
                description: 'PDF download started (demo).',
              })
            }
          >
            <Download className="mr-1.5 h-4 w-4" /> Export PDF
          </Button>
        }
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          index={0}
          label="Net Cash Flow"
          value={formatCurrency(netCashflow)}
          icon={Wallet}
          change={`${savingsRate}% rate`}
          trend="up"
          accent="success"
        />
        <StatCard
          index={1}
          label="Income"
          value={formatCurrency(balanceSummary.monthlyIncome)}
          icon={TrendingUp}
          change={`${balanceSummary.incomeChange}%`}
          trend="up"
          accent="primary"
        />
        <StatCard
          index={2}
          label="Expenses"
          value={formatCurrency(balanceSummary.monthlyExpenses)}
          icon={TrendingDown}
          change={`${balanceSummary.expensesChange}%`}
          trend="down"
          accent="destructive"
        />
        <StatCard
          index={3}
          label="Saved This Month"
          value={formatCurrency(910)}
          icon={PiggyBank}
          change="+15%"
          trend="up"
          accent="accent"
        />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="income">Income vs Expenses</TabsTrigger>
          <TabsTrigger value="savings">Savings Trend</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-5">
          <Card className="p-5">
            <h3 className="text-base font-semibold">Monthly Cash Flow</h3>
            <p className="text-xs text-muted-foreground">
              Income vs expenses across 7 months
            </p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyCashflow} margin={{ left: -16, right: 8, top: 8 }}>
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
                    contentStyle={tooltipStyle}
                    formatter={(v: number) => formatCurrency(v)}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: 12 }}
                  />
                  <Bar dataKey="income" name="Income" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid gap-5 lg:grid-cols-2">
            {aiInsights.map((ins) => (
              <Card key={ins.id} className="p-5">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-accent-foreground">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-semibold">{ins.title}</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{ins.body}</p>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Income vs Expenses */}
        <TabsContent value="income">
          <Card className="p-5">
            <h3 className="text-base font-semibold">Income vs Expenses</h3>
            <p className="text-xs text-muted-foreground">
              Track your monthly balance trend
            </p>
            <div className="mt-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyCashflow} margin={{ left: -16, right: 8, top: 8 }}>
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
                    contentStyle={tooltipStyle}
                    formatter={(v: number) => formatCurrency(v)}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="income"
                    name="Income"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    name="Expenses"
                    stroke="hsl(var(--chart-5))"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        {/* Savings */}
        <TabsContent value="savings">
          <Card className="p-5">
            <h3 className="text-base font-semibold">Savings Trend</h3>
            <p className="text-xs text-muted-foreground">
              Amount saved each month
            </p>
            <div className="mt-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={savingsTrend} margin={{ left: -16, right: 8, top: 8 }}>
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
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: number) => formatCurrency(v)}
                  />
                  <Bar
                    dataKey="saved"
                    name="Saved"
                    fill="hsl(var(--chart-3))"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        {/* Categories */}
        <TabsContent value="categories">
          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="p-5">
              <h3 className="text-base font-semibold">Spending Distribution</h3>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categorySpending}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      paddingAngle={2}
                      strokeWidth={0}
                    >
                      {categorySpending.map((c) => (
                        <Cell key={c.name} fill={c.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(v: number) => formatCurrency(v)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-base font-semibold">Category Breakdown</h3>
              <ul className="mt-4 space-y-3">
                {categorySpending.map((c) => {
                  const total = categorySpending.reduce((s, x) => s + x.value, 0);
                  const pct = Math.round((c.value / total) * 100);
                  return (
                    <li key={c.name}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ background: c.color }}
                          />
                          {c.name}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(c.value)} · {pct}%
                        </span>
                      </div>
                      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: c.color }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
