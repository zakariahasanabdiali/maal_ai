'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Play } from 'lucide-react';
import { BalanceCard } from '@/components/dashboard/balance-card';
import { balanceSummary } from '@/lib/analytics-data';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-grid bg-grid-fade opacity-60" />
      <div className="absolute -top-32 left-1/2 -z-10 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute top-40 right-0 -z-10 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Copy */}
          <div className="text-center lg:text-left">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs font-medium backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              AI-powered community finance, built for Somalia
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-balance sm:text-5xl lg:text-6xl"
            >
              Smart money management for{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                modern communities
              </span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground text-pretty lg:mx-0"
            >
              Maal-AI blends AI financial insights, smart budgeting, and
              community savings groups (ayuuto) into one beautiful platform —
              for individuals, families, and small businesses.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
            >
              <Button asChild size="lg" className="h-12 px-7 text-base">
                <Link href="/register">
                  Start Managing Money
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 px-7 text-base"
              >
                <Link href="/#features">
                  <Play className="mr-1.5 h-4 w-4" />
                  Explore Features
                </Link>
              </Button>
            </motion.div>

            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-10 flex items-center justify-center gap-6 lg:justify-start"
            >
              <div className="flex -space-x-2">
                {['AH', 'YA', 'FM', 'AO'].map((i) => (
                  <span
                    key={i}
                    className="grid h-9 w-9 place-items-center rounded-full border-2 border-background bg-brand-gradient text-[0.6rem] font-bold text-primary-foreground"
                  >
                    {i}
                  </span>
                ))}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">12,000+ users</p>
                <p className="text-xs text-muted-foreground">
                  across Mogadishu, Hargeisa & beyond
                </p>
              </div>
            </motion.div>
          </div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="relative">
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-brand-gradient opacity-20 blur-2xl" />
              <BalanceCard
                balance={balanceSummary.balance}
                monthlyIncome={balanceSummary.monthlyIncome}
                monthlyExpenses={balanceSummary.monthlyExpenses}
                savings={balanceSummary.savings}
              />

              {/* Floating insight card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute -bottom-6 -left-4 w-56 rounded-xl border bg-card p-3 shadow-premium sm:-left-10"
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent/20 text-accent-foreground">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-xs font-semibold">AI Insight</p>
                </div>
                <p className="mt-1.5 text-[0.7rem] text-muted-foreground">
                  Spending up 15%. Consider reducing food expenses by $80.
                </p>
              </motion.div>

              {/* Floating goal card */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 7, repeat: Infinity }}
                className="absolute -right-4 top-4 w-44 rounded-xl border bg-card p-3 shadow-premium sm:-right-8"
              >
                <p className="text-[0.7rem] font-medium text-muted-foreground">
                  New Laptop
                </p>
                <p className="text-sm font-bold">$1,240 / $1,800</p>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[69%] rounded-full bg-accent" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
