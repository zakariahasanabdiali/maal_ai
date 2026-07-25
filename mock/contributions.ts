import type { Contribution } from '@/types/domain';

export const mockContributions: Contribution[] = [
  { id: 'c01', memberName: 'Aamina Hassan', memberAvatar: 'AH', groupId: 'g1', groupName: 'Hodan Community Fund', amount: 500, currency: 'USD', date: '2026-07-22', method: 'mobile', status: 'completed', reference: 'EVC-882910', note: 'July contribution' },
  { id: 'c02', memberName: 'Yusuf Ali', memberAvatar: 'YA', groupId: 'g1', groupName: 'Hodan Community Fund', amount: 500, currency: 'USD', date: '2026-07-21', method: 'evc', status: 'completed', reference: 'EVC-882911' },
  { id: 'c03', memberName: 'Faadumo Mohamed', memberAvatar: 'FM', groupId: 'g1', groupName: 'Hodan Community Fund', amount: 500, currency: 'USD', date: '2026-07-20', method: 'bank', status: 'completed', reference: 'BNK-552301' },
  { id: 'c04', memberName: 'Abdirahman Osman', memberAvatar: 'AO', groupId: 'g2', groupName: 'Hargeisa Business Circle', amount: 1000, currency: 'USD', date: '2026-07-19', method: 'mobile', status: 'completed', reference: 'EVC-882912' },
  { id: 'c05', memberName: 'Khadra Yusuf', memberAvatar: 'KY', groupId: 'g1', groupName: 'Hodan Community Fund', amount: 250, currency: 'USD', date: '2026-07-18', method: 'cash', status: 'pending', reference: 'CASH-1029', note: 'Partial payment' },
  { id: 'c06', memberName: 'Maxamed Cali', memberAvatar: 'MC', groupId: 'g2', groupName: 'Hargeisa Business Circle', amount: 1000, currency: 'USD', date: '2026-07-17', method: 'evc', status: 'completed', reference: 'EVC-882913' },
  { id: 'c07', memberName: 'Hodan Abdi', memberAvatar: 'HA', groupId: 'g3', groupName: 'Walaalaha Education Fund', amount: 200, currency: 'USD', date: '2026-07-16', method: 'mobile', status: 'completed', reference: 'EVC-882914' },
  { id: 'c08', memberName: 'Aamina Hassan', memberAvatar: 'AH', groupId: 'g2', groupName: 'Hargeisa Business Circle', amount: 1000, currency: 'USD', date: '2026-07-15', method: 'bank', status: 'completed', reference: 'BNK-552302' },
  { id: 'c09', memberName: 'Yusuf Ali', memberAvatar: 'YA', groupId: 'g2', groupName: 'Hargeisa Business Circle', amount: 1000, currency: 'USD', date: '2026-07-14', method: 'evc', status: 'failed', reference: 'EVC-882915', note: 'Insufficient funds' },
  { id: 'c10', memberName: 'Faadumo Mohamed', memberAvatar: 'FM', groupId: 'g3', groupName: 'Walaalaha Education Fund', amount: 200, currency: 'USD', date: '2026-07-13', method: 'mobile', status: 'completed', reference: 'EVC-882916' },
  { id: 'c11', memberName: 'Said Ali', memberAvatar: 'SA', groupId: 'g1', groupName: 'Hodan Community Fund', amount: 500, currency: 'USD', date: '2026-07-12', method: 'cash', status: 'completed', reference: 'CASH-1030' },
  { id: 'c12', memberName: 'Maryam Hassan', memberAvatar: 'MH', groupId: 'g3', groupName: 'Walaalaha Education Fund', amount: 200, currency: 'USD', date: '2026-07-11', method: 'evc', status: 'completed', reference: 'EVC-882917' },
  { id: 'c13', memberName: 'Abdirahman Osman', memberAvatar: 'AO', groupId: 'g2', groupName: 'Hargeisa Business Circle', amount: 1000, currency: 'USD', date: '2026-07-10', method: 'mobile', status: 'pending', reference: 'EVC-882918' },
  { id: 'c14', memberName: 'Khadra Yusuf', memberAvatar: 'KY', groupId: 'g3', groupName: 'Walaalaha Education Fund', amount: 200, currency: 'USD', date: '2026-07-09', method: 'bank', status: 'completed', reference: 'BNK-552303' },
  { id: 'c15', memberName: 'Maxamed Cali', memberAvatar: 'MC', groupId: 'g1', groupName: 'Hodan Community Fund', amount: 500, currency: 'USD', date: '2026-07-08', method: 'evc', status: 'completed', reference: 'EVC-882919' },
];

export const contributionMethodMeta: Record<
  Contribution['method'],
  { label: string; color: string }
> = {
  cash: { label: 'Cash', color: 'warning' },
  mobile: { label: 'Mobile Money', color: 'chart-4' },
  bank: { label: 'Bank Transfer', color: 'chart-2' },
  evc: { label: 'EVC Plus', color: 'chart-1' },
};

export const contributionStatusMeta: Record<
  Contribution['status'],
  { label: string; color: string }
> = {
  completed: { label: 'Completed', color: 'success' },
  pending: { label: 'Pending', color: 'warning' },
  failed: { label: 'Failed', color: 'destructive' },
};
