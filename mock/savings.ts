import type { SavingGoal } from '@/types';

export const mockSavings: SavingGoal[] = [
  { id: 's1', name: 'Emergency Fund', target: 5000, current: 3200, deadline: '2026-12-31', emoji: '🛟', color: 'chart-1' },
  { id: 's2', name: 'New Laptop', target: 1800, current: 1240, deadline: '2026-09-15', emoji: '💻', color: 'chart-4' },
  { id: 's3', name: 'Business Capital', target: 12000, current: 4800, deadline: '2027-06-01', emoji: '🚀', color: 'chart-3' },
  { id: 's4', name: 'Family Hajj Fund', target: 20000, current: 7600, deadline: '2027-12-31', emoji: '🕋', color: 'chart-2' },
];
