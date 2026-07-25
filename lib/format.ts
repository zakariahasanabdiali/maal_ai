export const USD = 'USD';
export const SOS = 'SOS';

export type Currency = typeof USD | typeof SOS;

const SOS_PER_USD = 571; // approximate Somali Shilling rate

export function convert(amount: number, from: Currency, to: Currency) {
  if (from === to) return amount;
  if (from === USD && to === SOS) return amount * SOS_PER_USD;
  return amount / SOS_PER_USD;
}

export function formatCurrency(
  amount: number,
  currency: Currency = USD,
  opts?: { compact?: boolean; signed?: boolean }
) {
  const { compact = false, signed = false } = opts ?? {};
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : signed ? '+' : '';

  if (currency === SOS) {
    if (compact && abs >= 1_000_000)
      return `${sign}${(abs / 1_000_000).toFixed(1)}M So.Sh`;
    if (compact && abs >= 1_000)
      return `${sign}${(abs / 1_000).toFixed(1)}K So.Sh`;
    return `${sign}${abs.toLocaleString('en-US', {
      maximumFractionDigits: 0,
    })} So.Sh`;
  }

  if (compact && abs >= 1_000_000)
    return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (compact && abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  return `${sign}$${abs.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(date: string | Date, opts?: Intl.DateTimeFormatOptions) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...opts,
  });
}

export function relativeDate(date: string | Date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function percent(value: number, total: number) {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}
