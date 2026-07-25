import type { BudgetCategory } from '@/types';

export const mockBudget: BudgetCategory[] = [
  { id: 'b1', name: 'Food & Groceries', limit: 600, spent: 422.2, color: 'chart-1' },
  { id: 'b2', name: 'Transport', limit: 150, spent: 49.2, color: 'chart-4' },
  { id: 'b3', name: 'Education', limit: 300, spent: 229, color: 'chart-5' },
  { id: 'b4', name: 'Business', limit: 800, spent: 490, color: 'chart-1' },
  { id: 'b5', name: 'Entertainment', limit: 200, spent: 90, color: 'chart-3' },
  { id: 'b6', name: 'Bills & Utilities', limit: 250, spent: 92, color: 'chart-2' },
];

export const budgetMeta = {
  totalLimit: 2300,
  totalSpent: 1372.4,
};
