import type { Member } from '@/types/domain';

export const mockMembers: Member[] = [
  { id: 'm1', name: 'Aamina Hassan', email: 'aamina.hassan@maal.ai', phone: '+252 61 234 5678', avatar: 'AH', role: 'admin', groupId: 'g1', groupName: 'Hodan Community Fund', status: 'active', totalContributed: 5200, joinedAt: '2025-01-14', lastContribution: '2026-07-22' },
  { id: 'm2', name: 'Yusuf Ali', email: 'yusuf.ali@maal.ai', phone: '+252 63 556 7890', avatar: 'YA', role: 'treasurer', groupId: 'g2', groupName: 'Hargeisa Business Circle', status: 'active', totalContributed: 12000, joinedAt: '2024-11-02', lastContribution: '2026-07-21' },
  { id: 'm3', name: 'Faadumo Mohamed', email: 'faadumo.m@maal.ai', phone: '+252 90 112 3344', avatar: 'FM', role: 'member', groupId: 'g3', groupName: 'Walaalaha Education Fund', status: 'active', totalContributed: 3400, joinedAt: '2025-03-21', lastContribution: '2026-07-20' },
  { id: 'm4', name: 'Abdirahman Osman', email: 'abdi@maal.ai', phone: '+252 61 998 1122', avatar: 'AO', role: 'member', groupId: 'g2', groupName: 'Hargeisa Business Circle', status: 'active', totalContributed: 8000, joinedAt: '2024-08-19', lastContribution: '2026-07-19' },
  { id: 'm5', name: 'Khadra Yusuf', email: 'khadra.y@maal.ai', phone: '+252 63 445 6677', avatar: 'KY', role: 'member', groupId: 'g1', groupName: 'Hodan Community Fund', status: 'active', totalContributed: 2750, joinedAt: '2025-02-10', lastContribution: '2026-07-18' },
  { id: 'm6', name: 'Maxamed Cali', email: 'maxamed@maal.ai', phone: '+252 90 223 4455', avatar: 'MC', role: 'member', groupId: 'g2', groupName: 'Hargeisa Business Circle', status: 'active', totalContributed: 6000, joinedAt: '2025-01-05', lastContribution: '2026-07-17' },
  { id: 'm7', name: 'Hodan Abdi', email: 'hodan.abdi@maal.ai', phone: '+252 61 667 8899', avatar: 'HA', role: 'member', groupId: 'g3', groupName: 'Walaalaha Education Fund', status: 'active', totalContributed: 1800, joinedAt: '2025-04-12', lastContribution: '2026-07-16' },
  { id: 'm8', name: 'Said Ali', email: 'said.ali@maal.ai', phone: '+252 63 778 9900', avatar: 'SA', role: 'member', groupId: 'g1', groupName: 'Hodan Community Fund', status: 'active', totalContributed: 4500, joinedAt: '2025-01-20', lastContribution: '2026-07-12' },
  { id: 'm9', name: 'Maryam Hassan', email: 'maryam.h@maal.ai', phone: '+252 90 334 5566', avatar: 'MH', role: 'member', groupId: 'g3', groupName: 'Walaalaha Education Fund', status: 'active', totalContributed: 2200, joinedAt: '2025-05-01', lastContribution: '2026-07-11' },
  { id: 'm10', name: 'Jamal Ahmed', email: 'jamal.a@maal.ai', phone: '+252 61 556 7788', avatar: 'JA', role: 'member', groupId: 'g1', groupName: 'Hodan Community Fund', status: 'invited', totalContributed: 0, joinedAt: '2026-07-15' },
  { id: 'm11', name: 'Nasra Omar', email: 'nasra.o@maal.ai', phone: '+252 63 889 0011', avatar: 'NO', role: 'member', groupId: 'g2', groupName: 'Hargeisa Business Circle', status: 'inactive', totalContributed: 3000, joinedAt: '2024-09-14', lastContribution: '2026-05-20' },
  { id: 'm12', name: 'Bashir Yusuf', email: 'bashir.y@maal.ai', phone: '+252 90 445 6677', avatar: 'BY', role: 'member', groupId: 'g3', groupName: 'Walaalaha Education Fund', status: 'invited', totalContributed: 0, joinedAt: '2026-07-10' },
];

export const memberRoleMeta: Record<
  Member['role'],
  { label: string; color: string }
> = {
  admin: { label: 'Admin', color: 'primary' },
  treasurer: { label: 'Treasurer', color: 'accent' },
  member: { label: 'Member', color: 'muted' },
};

export const memberStatusMeta: Record<
  Member['status'],
  { label: string; color: string }
> = {
  active: { label: 'Active', color: 'success' },
  inactive: { label: 'Inactive', color: 'muted' },
  invited: { label: 'Invited', color: 'warning' },
};
