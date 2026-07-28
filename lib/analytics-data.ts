export const monthlyCashflow = [
  { month: 'Jan', income: 3100, expenses: 2400 },
  { month: 'Feb', income: 3200, expenses: 2650 },
  { month: 'Mar', income: 3200, expenses: 2180 },
  { month: 'Apr', income: 3650, expenses: 2900 },
  { month: 'May', income: 3200, expenses: 2750 },
  { month: 'Jun', income: 3650, expenses: 2480 },
  { month: 'Jul', income: 3650, expenses: 2852 },
];

export const categorySpending = [
  { name: 'Food', value: 422, color: 'hsl(var(--chart-1))' },
  { name: 'Business', value: 490, color: 'hsl(var(--chart-2))' },
  { name: 'Education', value: 229, color: 'hsl(var(--chart-5))' },
  { name: 'Bills', value: 92, color: 'hsl(var(--chart-4))' },
  { name: 'Transport', value: 49, color: 'hsl(var(--chart-3))' },
  { name: 'Entertainment', value: 90, color: 'hsl(var(--accent))' },
];

export const savingsTrend = [
  { month: 'Jan', saved: 400 },
  { month: 'Feb', saved: 520 },
  { month: 'Mar', saved: 480 },
  { month: 'Apr', saved: 650 },
  { month: 'May', saved: 700 },
  { month: 'Jun', saved: 820 },
  { month: 'Jul', saved: 910 },
];

export const balanceSummary = {
  balance: 12840.55,
  monthlyIncome: 3650,
  monthlyExpenses: 2852.4,
  savings: 5200,
  savingsChange: 12.4,
  expensesChange: 15.2,
  incomeChange: 14.1,
};

export const aiInsights = [
  {
    id: 'i1',
    type: 'warning' as const,
    title: 'Spending increased 15% this month',
    body: 'Your expenses rose to $2,852 in July, mainly from food (+18%) and business stock. Consider tightening your food budget by ~$80 to stay on track.',
  },
  {
    id: 'i2',
    type: 'success' as const,
    title: 'Great progress on Emergency Fund',
    body: 'You saved $400 this month — 64% of the way to your $5,000 Emergency Fund goal. At this pace you will reach it by November.',
  },
  {
    id: 'i3',
    type: 'info' as const,
    title: 'Community payout coming up',
    body: 'The Hodan Community Fund rotates its $12,500 pool on August 1st. You are eligible to receive this round if selected by the group.',
  },
];
