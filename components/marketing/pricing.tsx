'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Personal',
    price: '$0',
    period: '/month',
    desc: 'Perfect for individuals getting started.',
    features: [
      'AI assistant (10 chats/month)',
      'Expense tracking',
      '3 saving goals',
      'Basic reports',
    ],
    cta: 'Start free',
    href: '/register',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    desc: 'For families and power users who want more.',
    features: [
      'Unlimited AI assistant',
      'Unlimited saving goals',
      'Smart budgeting & alerts',
      'Full analytics & exports',
      'Community groups (up to 3)',
    ],
    cta: 'Get Pro',
    href: '/register',
    highlight: true,
  },
  {
    name: 'Business',
    price: '$29',
    period: '/month',
    desc: 'For small businesses and community leaders.',
    features: [
      'Everything in Pro',
      'Unlimited community groups',
      'Multi-currency (USD + So.Sh)',
      'Team access (5 seats)',
      'Priority support',
    ],
    cta: 'Get Business',
    href: '/register',
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-card/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-muted-foreground">
            Start free. Upgrade when you are ready. No hidden fees.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3 lg:items-center">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={cn(
                'relative rounded-2xl border bg-card p-7 shadow-premium-sm',
                p.highlight &&
                  'border-primary shadow-premium lg:scale-105 lg:py-9'
              )}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">
                  {p.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {p.period}
                </span>
              </div>
              <Button
                asChild
                className="mt-6 w-full"
                variant={p.highlight ? 'default' : 'outline'}
              >
                <Link href={p.href}>{p.cta}</Link>
              </Button>
              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
