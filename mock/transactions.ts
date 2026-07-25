import type { Transaction } from '@/types';

export const mockTransactions: Transaction[] = [
  { id: 't01', date: '2026-07-21', description: 'Suuqa Bakaara — groceries', category: 'food', amount: -42.5, currency: 'USD', status: 'completed', merchant: 'Bakaara Market' },
  { id: 't02', date: '2026-07-21', description: 'Monthly salary — Ganacsi Ltd', category: 'income', amount: 3200, currency: 'USD', status: 'completed', merchant: 'Ganacsi Ltd' },
  { id: 't03', date: '2026-07-20', description: 'Tukituk ride to office', category: 'transport', amount: -3.2, currency: 'USD', status: 'completed', merchant: 'Tukituk' },
  { id: 't04', date: '2026-07-20', description: 'Sahal internet bill', category: 'bills', amount: -35, currency: 'USD', status: 'completed', merchant: 'Sahal Telecom' },
  { id: 't05', date: '2026-07-19', description: 'School fees — Amiin Academy', category: 'education', amount: -180, currency: 'USD', status: 'pending', merchant: 'Amiin Academy' },
  { id: 't06', date: '2026-07-18', description: 'Shopping — Liiban Mall', category: 'shopping', amount: -76.4, currency: 'USD', status: 'completed', merchant: 'Liiban Mall' },
  { id: 't07', date: '2026-07-17', description: 'Hodan community contribution', category: 'community', amount: -50, currency: 'USD', status: 'completed', merchant: 'Hodan Fund' },
  { id: 't08', date: '2026-07-16', description: 'Emergency fund transfer', category: 'savings', amount: -200, currency: 'USD', status: 'completed' },
  { id: 't09', date: '2026-07-15', description: 'Family dinner — Jazeera Beach', category: 'entertainment', amount: -58, currency: 'USD', status: 'completed', merchant: 'Jazeera Beach' },
  { id: 't10', date: '2026-07-14', description: 'Business stock — Suuq wholesale', category: 'business', amount: -340, currency: 'USD', status: 'completed', merchant: 'Suuq Wholesale' },
  { id: 't11', date: '2026-07-13', description: 'Pharmacy — clinic visit', category: 'health', amount: -24, currency: 'USD', status: 'completed' },
  { id: 't12', date: '2026-07-12', description: 'Freelance design payment', category: 'income', amount: 450, currency: 'USD', status: 'completed' },
  { id: 't13', date: '2026-07-11', description: 'Fuel — Dahabshiil station', category: 'transport', amount: -28, currency: 'USD', status: 'completed' },
  { id: 't14', date: '2026-07-10', description: 'Electricity bill — BECO', category: 'bills', amount: -42, currency: 'USD', status: 'failed', merchant: 'BECO' },
  { id: 't15', date: '2026-07-09', description: 'Groceries — Dayniile market', category: 'food', amount: -38.7, currency: 'USD', status: 'completed', merchant: 'Dayniile Market' },
  { id: 't16', date: '2026-07-08', description: 'Online course — Coursera', category: 'education', amount: -49, currency: 'USD', status: 'completed' },
  { id: 't17', date: '2026-07-07', description: 'Mobile data — Hormuud', category: 'bills', amount: -15, currency: 'USD', status: 'completed', merchant: 'Hormuud' },
  { id: 't18', date: '2026-07-06', description: 'Cinema — family night', category: 'entertainment', amount: -32, currency: 'USD', status: 'completed' },
  { id: 't19', date: '2026-07-05', description: 'Savings goal — New Laptop', category: 'savings', amount: -120, currency: 'USD', status: 'completed' },
  { id: 't20', date: '2026-07-04', description: 'Business loan repayment', category: 'business', amount: -150, currency: 'USD', status: 'pending' },
  { id: 't21', date: '2026-07-03', description: 'Restaurant — Makkah Mukalla', category: 'food', amount: -22, currency: 'USD', status: 'completed', merchant: 'Makkah Mukalla' },
  { id: 't22', date: '2026-07-02', description: 'Bus to Hargeisa', category: 'transport', amount: -18, currency: 'USD', status: 'completed' },
];

export const categoryMeta: Record<
  Transaction['category'],
  { label: string; color: string; icon: string }
> = {
  food: { label: 'Food & Groceries', color: 'chart-1', icon: 'Utensils' },
  transport: { label: 'Transport', color: 'chart-4', icon: 'Bus' },
  shopping: { label: 'Shopping', color: 'chart-3', icon: 'ShoppingBag' },
  bills: { label: 'Bills & Utilities', color: 'chart-2', icon: 'Receipt' },
  education: { label: 'Education', color: 'chart-5', icon: 'GraduationCap' },
  business: { label: 'Business', color: 'chart-1', icon: 'Briefcase' },
  entertainment: { label: 'Entertainment', color: 'chart-3', icon: 'Clapperboard' },
  health: { label: 'Health', color: 'chart-4', icon: 'HeartPulse' },
  income: { label: 'Income', color: 'success', icon: 'TrendingUp' },
  savings: { label: 'Savings', color: 'chart-2', icon: 'PiggyBank' },
  community: { label: 'Community', color: 'primary', icon: 'Users' },
  other: { label: 'Other', color: 'muted', icon: 'Circle' },
};
