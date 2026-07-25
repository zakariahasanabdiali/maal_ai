'use client';

import { motion } from 'framer-motion';
import { UserPlus, LayoutDashboard, Sparkles, Users } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Create your account',
    desc: 'Sign up in seconds as an individual, family, business, or community group.',
  },
  {
    icon: LayoutDashboard,
    title: 'Track your money',
    desc: 'Connect your income and expenses. Maal-AI organizes everything into clear categories.',
  },
  {
    icon: Sparkles,
    title: 'Get AI insights',
    desc: 'Ask the AI assistant for advice. Receive personalized tips to save and grow your money.',
  },
  {
    icon: Users,
    title: 'Build community wealth',
    desc: 'Join or start a savings group. Track contributions and rotate payouts transparently.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-card/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            From sign-up to financial clarity in 4 steps
          </h2>
        </div>

        <div className="relative mt-16">
          {/* Connecting line */}
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-border lg:block" />

          <div className="grid gap-10 lg:grid-cols-4">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="relative text-center"
                >
                  <div className="relative z-10 mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient text-primary-foreground shadow-premium">
                    <Icon className="h-6 w-6" />
                    <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-accent text-[0.65rem] font-bold text-accent-foreground">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
