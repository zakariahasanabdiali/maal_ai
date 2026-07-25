import type { User } from '@/types';

export const currentUser: User = {
  id: 'u_001',
  name: 'Aamina Hassan',
  email: 'aamina.hassan@maal.ai',
  phone: '+252 61 234 5678',
  accountType: 'family',
  currency: 'USD',
  city: 'Mogadishu',
  joinedAt: '2025-01-14',
  verified: true,
};

export const mockUsers: User[] = [
  currentUser,
  {
    id: 'u_002',
    name: 'Yusuf Ali',
    email: 'yusuf.ali@maal.ai',
    accountType: 'business',
    currency: 'USD',
    city: 'Hargeisa',
    joinedAt: '2024-11-02',
    verified: true,
  },
  {
    id: 'u_003',
    name: 'Faadumo Mohamed',
    email: 'faadumo.m@maal.ai',
    accountType: 'personal',
    currency: 'USD',
    city: 'Garowe',
    joinedAt: '2025-03-21',
    verified: true,
  },
  {
    id: 'u_004',
    name: 'Abdirahman Osman',
    email: 'abdi@maal.ai',
    accountType: 'community',
    currency: 'USD',
    city: 'Kismayo',
    joinedAt: '2024-08-19',
    verified: true,
  },
];
