'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Wallet,
  Calendar,
  Hash,
  CreditCard,
  Users,
  FileText,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ErrorState } from '@/components/error-state';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { useContribution } from '@/hooks/use-contributions';
import { contributionMethodMeta, contributionStatusMeta } from '@/mock/contributions';
import { formatCurrency, formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

const statusIcon = {
  completed: CheckCircle2,
  pending: Clock,
  failed: XCircle,
};

export default function ContributionDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: contribution, isLoading, isError, refetch } = useContribution(params.id);

  if (isError) {
    return (
      <div className="space-y-6">
        <BackLink />
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  if (isLoading || !contribution) {
    return (
      <div className="space-y-6">
        <BackLink />
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <LoadingSkeleton className="h-40 w-full rounded-xl" />
            <LoadingSkeleton className="h-64 w-full rounded-xl" />
          </div>
          <LoadingSkeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  const sMeta = contributionStatusMeta[contribution.status as keyof typeof contributionStatusMeta];
  const mMeta = contributionMethodMeta[contribution.method as keyof typeof contributionMethodMeta];
  const StatusIcon = statusIcon[contribution.status as keyof typeof statusIcon];

  const details = [
    { icon: Calendar, label: 'Date', value: formatDate(contribution.date) },
    { icon: CreditCard, label: 'Method', value: mMeta.label },
    { icon: Hash, label: 'Reference', value: contribution.reference },
    { icon: Users, label: 'Group', value: contribution.groupName },
  ];

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Contribution Details"
        description={`Reference ${contribution.reference}`}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <Card className="overflow-hidden">
            {/* Status banner */}
            <div
              className={cn(
                'flex items-center gap-3 px-6 py-5',
                `bg-${sMeta.color}/10`
              )}
            >
              <span
                className={cn(
                  'grid h-12 w-12 place-items-center rounded-xl',
                  `bg-${sMeta.color}/15 text-${sMeta.color}`
                )}
              >
                <StatusIcon className="h-6 w-6" />
              </span>
              <div>
                <p className={cn('text-sm font-semibold', `text-${sMeta.color}`)}>
                  {sMeta.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  Contribution from {contribution.memberName}
                </p>
              </div>
              <Badge
                className={cn('ml-auto', `bg-${sMeta.color}/15 text-${sMeta.color}`)}
              >
                {contribution.status}
              </Badge>
            </div>

            {/* Amount */}
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="mt-1 text-4xl font-bold tracking-tight">
                {formatCurrency(contribution.amount, contribution.currency)}
              </p>
            </div>

            <Separator />

            {/* Detail rows */}
            <div className="divide-y">
              {details.map((d) => {
                const Icon = d.icon;
                return (
                  <div key={d.label} className="flex items-center gap-3 px-6 py-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-muted-foreground">{d.label}</span>
                    <span className="ml-auto text-sm font-medium">{d.value}</span>
                  </div>
                );
              })}
            </div>

            {contribution.note && (
              <>
                <Separator />
                <div className="flex items-start gap-3 px-6 py-4">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Note</p>
                    <p className="mt-0.5 text-sm">{contribution.note}</p>
                  </div>
                </div>
              </>
            )}
          </Card>
        </motion.div>

        {/* Side panel */}
        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-gradient text-sm font-bold text-primary-foreground">
                {contribution.memberAvatar}
              </span>
              <div>
                <p className="text-sm font-semibold">{contribution.memberName}</p>
                <p className="text-xs text-muted-foreground">Contributor</p>
              </div>
            </div>
            <Separator className="my-4" />
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/members">
                <Users className="mr-1.5 h-4 w-4" /> View member profile
              </Link>
            </Button>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <Wallet className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">{contribution.groupName}</p>
                <p className="text-xs text-muted-foreground">Savings group</p>
              </div>
            </div>
            <Separator className="my-4" />
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/community">View group details</Link>
            </Button>
          </Card>

          <Card className="bg-brand-gradient p-5 text-primary-foreground">
            <p className="text-sm font-semibold">Need help?</p>
            <p className="mt-1 text-xs text-primary-foreground/80">
              Dispute this contribution or report an issue to your group admin.
            </p>
            <Button
              size="sm"
              className="mt-3 w-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Report an issue
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Button asChild variant="ghost" size="sm" className="-ml-2">
      <Link href="/dashboard/contributions">
        <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to contributions
      </Link>
    </Button>
  );
}
