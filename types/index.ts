import type { Currency } from '@/lib/format';

export type AccountType = 'personal' | 'family' | 'business' | 'community';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  accountType: AccountType;
  currency: Currency;
  city: string;
  joinedAt: string;
  verified: boolean;
}

export type TransactionCategory =
  | 'food'
  | 'transport'
  | 'shopping'
  | 'bills'
  | 'education'
  | 'business'
  | 'entertainment'
  | 'health'
  | 'income'
  | 'savings'
  | 'community'
  | 'other';

export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  date: string; // ISO
  description: string;
  category: TransactionCategory;
  amount: number; // positive income, negative expense
  currency: Currency;
  status: TransactionStatus;
  merchant?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  limit: number;
  spent: number;
  color: string; // hsl var name e.g. "chart-1"
}

export interface SavingGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  emoji: string;
  color: string;
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  monthlyContribution: number;
  totalPool: number;
  goal: string;
  color: string;
  yourContribution: number;
  nextPayout: string;
  admin: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface AiInsight {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  body: string;
}
