'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/logo';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-gradient p-10 text-primary-foreground lg:flex">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <Logo size="md" href="/" className="relative" />

        <div className="relative max-w-md">
          <h2 className="text-3xl font-bold leading-tight text-balance">
            Smart community finance, powered by AI.
          </h2>
          <p className="mt-4 text-primary-foreground/80">
            Join thousands of families and businesses across Somalia managing
            their money with Maal-AI.
          </p>

          <div className="mt-10 space-y-4">
            {[
              'AI insights that actually understand your spending',
              'Ayuuto community savings, finally transparent',
              'Budgets, goals, and reports in one place',
            ].map((t) => (
              <div key={t} className="flex items-center gap-3">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                  ✓
                </span>
                <span className="text-sm text-primary-foreground/90">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-primary-foreground/60">
          “Maal-AI helped my family save $1,800 in three months.” — Aamina, Mogadishu
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center px-4 pb-10 sm:px-6">
          <div className="w-full max-w-sm">
            <div className="mb-8 lg:hidden">
              <Logo size="md" href="/" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-6 text-center">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthSocialButtons() {
  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-11" type="button" disabled>
          <span className="mr-2 text-base">G</span> Google
        </Button>
        <Button variant="outline" className="h-11" type="button" disabled>
          <span className="mr-2 font-bold">f</span> Facebook
        </Button>
      </div>
      <p className="text-center text-[0.7rem] text-muted-foreground">
        Social login is a demo placeholder — use email/password.
      </p>
    </div>
  );
}
