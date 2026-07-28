'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Users,
  UserPlus,
  Mail,
  Crown,
  Shield,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { motion } from 'framer-motion';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SearchInput } from '@/components/search-input';
import { Pagination } from '@/components/pagination';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { StatCard } from '@/components/dashboard/stat-card';
import { useMembers } from '@/hooks/use-members';
import { membersService } from '@/services/members.service';
import { memberRoleMeta, memberStatusMeta } from '@/lib/meta';
import { formatCurrency, formatDate, relativeDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { mockCommunity } from '@/mock/community';

const PAGE_SIZE = 8;

const roleIcon = { admin: Crown, treasurer: Shield, member: Users };

export default function MembersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteGroup, setInviteGroup] = useState('');

  const { data, isLoading, isError, refetch } = useMembers({
    page,
    pageSize: PAGE_SIZE,
    search,
    status,
  });

  React.useEffect(() => {
    setPage(1);
  }, [search, status]);

  const activeCount = data?.data.filter((m: typeof data.data[number]) => m.status === 'active').length ?? 0;
  const totalContributed = data?.data.reduce((s: number, m: typeof data.data[number]) => s + m.totalContributed, 0) ?? 0;

  const handleInvite = async () => {
    if (!inviteEmail || !inviteGroup) {
      toast.error('Enter an email and select a group');
      return;
    }
    try {
      await membersService.invite(inviteEmail, inviteGroup);
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setInviteGroup('');
      setInviteOpen(false);
    } catch {
      toast.error('Failed to send invitation');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Members"
        description="Manage members across your community savings groups."
        actions={
          <Button size="sm" onClick={() => setInviteOpen(true)}>
            <UserPlus className="mr-1.5 h-4 w-4" /> Invite member
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard index={0} label="Total Members" value={data ? String(data.total) : '—'} icon={Users} accent="primary" />
        <StatCard index={1} label="Active" value={String(activeCount)} icon={TrendingUp} accent="success" />
        <StatCard index={2} label="Total Contributed" value={formatCurrency(totalContributed)} icon={Mail} accent="accent" />
        <StatCard index={3} label="Groups" value={String(mockCommunity.length)} icon={Users} accent="primary" />
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search name, email, or group…"
            className="flex-1"
            ariaLabel="Search members"
          />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[150px]" aria-label="Filter by status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="invited">Invited</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <Card className="space-y-3 p-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 w-full animate-pulse rounded-md bg-muted/60" />
          ))}
        </Card>
      ) : data && data.data.length > 0 ? (
        <>
          <Card className="hidden overflow-hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Member</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contributed</TableHead>
                  <TableHead>Last Contribution</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((m: typeof data.data[number]) => {
                  const rMeta = memberRoleMeta[m.role as keyof typeof memberRoleMeta];
                  const sMeta = memberStatusMeta[m.status as keyof typeof memberStatusMeta];
                  return (
                    <TableRow key={m.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-brand-gradient text-[0.65rem] font-bold text-primary-foreground">
                              {m.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium">{m.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{m.groupName}</TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
                            `border-${rMeta.color}/20 bg-${rMeta.color}/10 text-${rMeta.color}`
                          )}
                        >
                          {rMeta.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm font-semibold">
                        {formatCurrency(m.totalContributed)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {m.lastContribution ? relativeDate(m.lastContribution) : '—'}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'inline-flex rounded-full border px-2 py-0.5 text-xs font-medium',
                            `border-${sMeta.color}/20 bg-${sMeta.color}/10 text-${sMeta.color}`
                          )}
                        >
                          {sMeta.label}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>

          <div className="space-y-3 md:hidden">
            {data.data.map((m: typeof data.data[number], i: number) => {
              const sMeta = memberStatusMeta[m.status as keyof typeof memberStatusMeta];
              const rMeta = memberRoleMeta[m.role as keyof typeof memberRoleMeta];
              const RoleIcon = roleIcon[m.role as keyof typeof roleIcon];
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="bg-brand-gradient text-xs font-bold text-primary-foreground">
                          {m.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{m.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{m.groupName}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className={cn('inline-flex items-center gap-1 text-[0.65rem] font-medium', `text-${rMeta.color}`)}>
                            <RoleIcon className="h-3 w-3" /> {rMeta.label}
                          </span>
                          <span className={cn('inline-flex rounded-full border px-1.5 py-0.5 text-[0.6rem] font-medium', `border-${sMeta.color}/20 bg-${sMeta.color}/10 text-${sMeta.color}`)}>
                            {sMeta.label}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{formatCurrency(m.totalContributed)}</p>
                        <p className="text-[0.65rem] text-muted-foreground">contributed</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <Pagination page={page} pageSize={PAGE_SIZE} total={data.total} onPageChange={setPage} />
        </>
      ) : (
        <EmptyState icon={Users} title="No members found" description="Try adjusting your search or filters, or invite a new member." />
      )}

      {/* Invite modal */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a member</DialogTitle>
            <DialogDescription>
              Send an invitation to join a community savings group.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="invite-email">Email address</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="member@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Select group</Label>
              <Select value={inviteGroup} onValueChange={setInviteGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a group" />
                </SelectTrigger>
                <SelectContent>
                  {mockCommunity.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite}>Send invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
