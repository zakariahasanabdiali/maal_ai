'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({
  className,
  size = 'md',
  href = '/',
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  href?: string | null;
}) {
  const dims = {
    sm: { box: 'h-7 w-7', text: 'text-base', icon: 14 },
    md: { box: 'h-9 w-9', text: 'text-lg', icon: 18 },
    lg: { box: 'h-11 w-11', text: 'text-2xl', icon: 22 },
  }[size];

  const content = (
    <span className={cn('flex items-center gap-2.5', className)}>
      <span
        className={cn(
          'grid place-items-center rounded-xl bg-brand-gradient text-primary-foreground shadow-premium-sm',
          dims.box
        )}
        aria-hidden
      >
        <svg
          width={dims.icon}
          height={dims.icon}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 17.5L8 7l4 6 3-4 5 8.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="8" cy="7" r="1.6" fill="currentColor" />
        </svg>
      </span>
      <span className={cn('font-extrabold tracking-tight', dims.text)}>
        Maal<span className="text-accent">-AI</span>
      </span>
    </span>
  );

  if (href === null) return content;
  return <Link href={href}>{content}</Link>;
}
