import type { Currency } from '@/lib/format';

export type ContributionStatus = 'completed' | 'pending' | 'failed';
export type ContributionMethod = 'cash' | 'mobile' | 'bank' | 'evc';

export interface Contribution {
  id: string;
  memberName: string;
  memberAvatar: string;
  groupId: string;
  groupName: string;
  amount: number;
  currency: Currency;
  date: string;
  method: ContributionMethod;
  status: ContributionStatus;
  reference: string;
  note?: string;
}

export interface ContributionSummary {
  totalThisMonth: number;
  totalAllTime: number;
  pending: number;
  completed: number;
  avgMonthly: number;
  changePercent: number;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'admin' | 'treasurer' | 'member';
  groupId: string;
  groupName: string;
  status: 'active' | 'inactive' | 'invited';
  totalContributed: number;
  joinedAt: string;
  lastContribution?: string;
}

export type NotificationType =
  | 'contribution'
  | 'goal'
  | 'community'
  | 'alert'
  | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href?: string;
}

export type ReceiptStatus =
  | 'idle'
  | 'uploading'
  | 'processing'
  | 'success'
  | 'failed';

export interface ReceiptUpload {
  id: string;
  fileName: string;
  fileSize: number;
  status: ReceiptStatus;
  progress: number;
  extractedAmount?: number;
  extractedMerchant?: string;
  extractedDate?: string;
  error?: string;
}

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
  unread: number;
  pinned: boolean;
}

export interface AnalyticsPoint {
  label: string;
  contributions: number;
  revenue: number;
  expenses: number;
}

export interface CategoryAnalytics {
  name: string;
  value: number;
  color: string;
}
