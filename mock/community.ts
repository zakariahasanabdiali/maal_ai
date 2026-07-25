import type { CommunityGroup } from '@/types';

export const mockCommunity: CommunityGroup[] = [
  {
    id: 'c1',
    name: 'Hodan Community Fund',
    description:
      'Monthly ayuuto savings group for families in Hodan district. Supporting each other through collective savings.',
    members: 25,
    monthlyContribution: 500,
    totalPool: 12500,
    goal: 'Build a community water well',
    color: 'chart-1',
    yourContribution: 500,
    nextPayout: '2026-08-01',
    admin: 'Aamina Hassan',
  },
  {
    id: 'c2',
    name: 'Hargeisa Business Circle',
    description:
      'Entrepreneurs pooling capital to fund small business growth and rotate payouts every quarter.',
    members: 12,
    monthlyContribution: 1000,
    totalPool: 12000,
    goal: 'Rotate $12,000 to next member',
    color: 'chart-4',
    yourContribution: 1000,
    nextPayout: '2026-09-01',
    admin: 'Yusuf Ali',
  },
  {
    id: 'c3',
    name: 'Walaalaha Education Fund',
    description:
      'Community group saving to sponsor university tuition for promising students in Mogadishu.',
    members: 40,
    monthlyContribution: 200,
    totalPool: 8000,
    goal: 'Sponsor 4 students this year',
    color: 'chart-5',
    yourContribution: 200,
    nextPayout: '2026-10-15',
    admin: 'Faadumo Mohamed',
  },
];

export const communityMembers = [
  { id: 'm1', name: 'Aamina Hassan', contributed: 500, status: 'paid', avatar: 'AH' },
  { id: 'm2', name: 'Yusuf Ali', contributed: 500, status: 'paid', avatar: 'YA' },
  { id: 'm3', name: 'Faadumo Mohamed', contributed: 500, status: 'paid', avatar: 'FM' },
  { id: 'm4', name: 'Abdirahman Osman', contributed: 500, status: 'paid', avatar: 'AO' },
  { id: 'm5', name: 'Khadra Yusuf', contributed: 0, status: 'pending', avatar: 'KY' },
  { id: 'm6', name: 'Maxamed Cali', contributed: 500, status: 'paid', avatar: 'MC' },
  { id: 'm7', name: 'Hodan Abdi', contributed: 250, status: 'partial', avatar: 'HA' },
];
