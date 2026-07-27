'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import {
  HandCoins,
  TrendingUp,
  Clock,
  CheckCircle2,
  Wallet,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchInput } from '@/components/search-input';
import { Pagination } from '@/components/pagination';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { StatCard } from '@/components/dashboard/stat-card';
import { useContributions, useContributionSummary } from '@/hooks/use-contributions';
import { contributionMethodMeta, contributionStatusMeta } from '@/mock/contributions';
import { formatCurrency, formatDate, relativeDate } from '@/lib/format';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 8;

export default function ContributionsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const { data, isLoading, isError, refetch } = useContributions({
    page,
    pageSize: PAGE_SIZE,
    search,
    status,
  });
  const { data: summary } = useContributionSummary();

  React.useEffect(() => {
    setPage(1);
  }, [search, status]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contributions"
        description="Track community contributions across all your savings groups."
        actions={
          <Button asChild size="sm" variant="outline">
            <Link href="/dashboard/analytics">
              View analytics <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          index={0}
          label="This Month"
          value={summary ? formatCurrency(summary.totalThisMonth) : '—'}
          icon={TrendingUp}
          change={summary ? `${summary.changePercent}%` : undefined}
          trend="up"
          accent="success"
        />
        <StatCard
          index={1}
          label="All Time"
          value={summary ? formatCurrency(summary.totalAllTime) : '—'}
          icon={Wallet}
          accent="primary"
        />
        <StatCard
          index={2}
          label="Completed"
          value={summary ? String(summary.completed) : '—'}
          icon={CheckCircle2}
          accent="accent"
        />
        <StatCard
          index={3}
          label="Pending"
          value={summary ? String(summary.pending) : '—'}
          icon={Clock}
          accent="primary"
        />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search member, group, or reference…"
            className="flex-1"
            ariaLabel="Search contributions"
          />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[160px]" aria-label="Filter by status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table / states */}
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
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((c: typeof data.data[number]) => {
                  const sMeta = contributionStatusMeta[c.status as keyof typeof contributionStatusMeta];
                  const mMeta = contributionMethodMeta[c.method as keyof typeof contributionMethodMeta];
                  return (
                    <TableRow key={c.id} className="cursor-pointer">
                      <TableCell>
                        <Link href={`/dashboard/contributions/${c.id}`} className="block">
                          <div className="flex items-center gap-2.5">
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-gradient text-[0.65rem] font-bold text-primary-foreground">
                              {c.memberAvatar}
                            </span>
                            <span className="text-sm font-medium">{c.memberName}</span>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {c.groupName}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {formatDate(c.date, { year: undefined })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {mMeta.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm font-semibold">
                        {formatCurrency(c.amount, c.currency)}
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

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {data.data.map((c: typeof data.data[number], i: number) => {
              const sMeta = contributionStatusMeta[c.status as keyof typeof contributionStatusMeta];
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link href={`/dashboard/contributions/${c.id}`}>
                    <Card className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-gradient text-xs font-bold text-primary-foreground">
                          {c.memberAvatar}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{c.memberName}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {c.groupName} · {relativeDate(c.date)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{formatCurrency(c.amount, c.currency)}</p>
                          <span
                            className={cn(
                              'mt-0.5 inline-flex rounded-full border px-2 py-0.5 text-[0.6rem] font-medium',
                              `border-${sMeta.color}/20 bg-${sMeta.color}/10 text-${sMeta.color}`
                            )}
                          >
                            {sMeta.label}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={data.total}
            onPageChange={setPage}
          />
        </>
      ) : (
        <EmptyState
          icon={HandCoins}
          title="No contributions found"
          description="Try adjusting your search or filters."
        />
      )}
    </div>
  );
}
