'use client';

import * as React from 'react';
import { useMemo, useState, useEffect } from 'react';
import {
  Search,
  ArrowDownUp,
  TrendingUp,
  TrendingDown,
  Download,
  Inbox,
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EmptyState } from '@/components/empty-state';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDate } from '@/lib/format';
import { categoryMeta } from '@/lib/meta';
import type { Transaction, TransactionStatus } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

type SortKey = 'date' | 'amount';

const statusStyle: Record<TransactionStatus, string> = {
  completed: 'bg-success/10 text-success border-success/20',
  pending: 'bg-warning/10 text-warning border-warning/20',
  failed: 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function TransactionsPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [sort, setSort] = useState<SortKey>('date');
  const [asc, setAsc] = useState(false);
  const [loading, setLoading] = useState(true);

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from('contributions')
        .select(`
          id,
          amount,
          currency,
          status,
          note,
          created_at,
          group:groups ( id, name )
        `)
        .eq('contributor_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row: Record<string, unknown>): Transaction => {
        const group = row.group as Record<string, string> | null;
        const statusStr = String(row.status).toLowerCase();
        return {
          id: row.id as string,
          date: row.created_at as string,
          description: group?.name ?? 'Contribution',
          category: 'community' as const,
          amount: Number(row.amount),
          currency: (row.currency as string) ?? 'USD',
          status: (['completed', 'pending', 'failed'].includes(statusStr) ? statusStr : 'pending') as TransactionStatus,
          merchant: group?.name,
        } as Transaction;
      });
    },
  });

  useEffect(() => {
    if (!isLoading) setLoading(false);
  }, [isLoading]);

  const filtered = useMemo(() => {
    let list = (transactions ?? []).filter((t: Transaction) => {
      const matchesQuery =
        !query ||
        t.description.toLowerCase().includes(query.toLowerCase()) ||
        t.merchant?.toLowerCase().includes(query.toLowerCase());
      const matchesCat = category === 'all' || t.category === category;
      const matchesStatus = status === 'all' || t.status === status;
      return matchesQuery && matchesCat && matchesStatus;
    });
    list = [...list].sort((a, b) => {
      const dir = asc ? 1 : -1;
      if (sort === 'amount') return (a.amount - b.amount) * dir;
      return (
        (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir
      );
    });
    return list;
  }, [query, category, status, sort, asc]);

  const toggleSort = (key: SortKey) => {
    if (sort === key) setAsc((a) => !a);
    else {
      setSort(key);
      setAsc(false);
    }
  };

  const handleExport = () => {
    toast.success('Export started', {
      description: 'Your CSV will download shortly (demo).',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Search, filter, and review all your financial activity."
        actions={
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-1.5 h-4 w-4" /> Export
          </Button>
        }
      />

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search description or merchant…"
              className="pl-9"
              aria-label="Search transactions"
            />
          </div>
          <div className="flex gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[160px]" aria-label="Filter by category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {Object.entries(categoryMeta).map(([key, m]) => (
                  <SelectItem key={key} value={key}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[140px]" aria-label="Filter by status">
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
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {filtered.length} transaction{filtered.length !== 1 && 's'} found
        </p>
      </Card>

      {/* Desktop table */}
      <Card className="hidden overflow-hidden md:block">
        {loading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <LoadingSkeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            className="m-6 border-0"
            icon={Inbox}
            title="No transactions found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>
                  <button
                    onClick={() => toggleSort('date')}
                    className="flex items-center gap-1 font-semibold hover:text-foreground"
                  >
                    Date <ArrowDownUp className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort('amount')}
                    className="flex items-center gap-1 font-semibold hover:text-foreground"
                  >
                    Amount <ArrowDownUp className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t: Transaction) => (
                <TransactionRow key={t.id} t={t} />
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <LoadingSkeleton key={i} className="h-24 w-full rounded-xl" />
          ))
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No transactions found"
            description="Try adjusting your search or filters."
          />
        ) : (
          filtered.map((t: Transaction) => <TransactionCardMobile key={t.id} t={t} />)
        )}
      </div>
    </div>
  );
}

function TransactionRow({ t }: { t: Transaction }) {
  const meta = categoryMeta[t.category];
  const positive = t.amount > 0;
  return (
    <TableRow>
      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
        {formatDate(t.date, { year: undefined })}
      </TableCell>
      <TableCell>
        <p className="text-sm font-medium">{t.description}</p>
        {t.merchant && (
          <p className="text-xs text-muted-foreground">{t.merchant}</p>
        )}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="font-medium">
          {meta.label}
        </Badge>
      </TableCell>
      <TableCell
        className={cn(
          'whitespace-nowrap text-sm font-semibold',
          positive ? 'text-success' : 'text-foreground'
        )}
      >
        {formatCurrency(t.amount, t.currency, { signed: true })}
      </TableCell>
      <TableCell>
        <span
          className={cn(
            'inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
            statusStyle[t.status]
          )}
        >
          {t.status}
        </span>
      </TableCell>
    </TableRow>
  );
}

function TransactionCardMobile({ t }: { t: Transaction }) {
  const meta = categoryMeta[t.category];
  const positive = t.amount > 0;
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'grid h-10 w-10 shrink-0 place-items-center rounded-lg',
            positive ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
          )}
        >
          {positive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{t.description}</p>
          <p className="text-xs text-muted-foreground">
            {meta.label} · {formatDate(t.date, { year: undefined })}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={cn(
                'inline-flex rounded-full border px-2 py-0.5 text-[0.65rem] font-medium capitalize',
                statusStyle[t.status]
              )}
            >
              {t.status}
            </span>
          </div>
        </div>
        <span
          className={cn(
            'shrink-0 text-sm font-semibold',
            positive ? 'text-success' : 'text-foreground'
          )}
        >
          {formatCurrency(t.amount, t.currency, { signed: true })}
        </span>
      </div>
    </Card>
  );
}
