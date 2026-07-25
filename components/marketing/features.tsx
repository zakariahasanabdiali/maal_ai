'use client';

import { motion } from 'framer-motion';
import {
  Sparkles,
  Wallet,
  Users,
  Receipt,
  PiggyBank,
  BarChart3,
} from 'lucide-react';
import { Card } from '@/components/ui/card';

const features = [
  {
    icon: Sparkles,
    title: 'AI Financial Assistant',
    desc: 'Chat with an AI that analyzes your spending, spots patterns, and gives personalized money advice in seconds.',
    color: 'bg-accent/15 text-accent-foreground',
  },
  {
    icon: Wallet,
    title: 'Smart Budgeting',
    desc: 'Set category limits for food, transport, education, and business. Get alerts before you overspend.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Users,
    title: 'Community Finance',
    desc: 'Run ayuuto savings groups with transparent contribution tracking, member management, and rotating payouts.',
    color: 'bg-success/10 text-success',
  },
  {
    icon: Receipt,
    title: 'Expense Tracking',
    desc: 'Auto-categorized transactions with Somali merchant context — from Suuqa Bakaara to Dahabshiil.',
    color: 'bg-chart-4/15 text-chart-4',
  },
  {
    icon: PiggyBank,
    title: 'Saving Goals',
    desc: 'Visual progress bars for emergency funds, business capital, and family goals. Stay motivated and on track.',
    color: 'bg-chart-5/15 text-chart-5',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    desc: 'Beautiful charts for cash flow, category spending, and savings trends. Export-ready monthly reports.',
    color: 'bg-chart-2/15 text-chart-2',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Everything you need to master your money
          </h2>
          <p className="mt-4 text-muted-foreground">
            One platform for personal finance, business accounting, and
            community savings — powered by AI.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Card className="group h-full p-6 transition-all hover:-translate-y-1 hover:shadow-premium">
                  <div
                    className={`grid h-12 w-12 place-items-center rounded-xl ${f.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {f.desc}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
