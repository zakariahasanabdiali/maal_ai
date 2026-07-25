'use client';

import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Twitter, Github, Linkedin, Send } from 'lucide-react';

const sections = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'How it works', href: '/#how-it-works' },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/#' },
      { label: 'Blog', href: '/#' },
      { label: 'Careers', href: '/#' },
      { label: 'Contact', href: '/#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Help center', href: '/#' },
      { label: 'Community', href: '/#' },
      { label: 'Privacy', href: '/#' },
      { label: 'Terms', href: '/#' },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo size="md" href="/" />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Smart community finance for individuals, families, and businesses.
              AI-powered money management built for the Somali community.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[Twitter, Github, Linkedin, Send].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {sections.map((s) => (
            <div key={s.title}>
              <h4 className="text-sm font-semibold">{s.title}</h4>
              <ul className="mt-3 space-y-2.5">
                {s.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Maal-AI. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with care for the Somali community.
          </p>
        </div>
      </div>
    </footer>
  );
}
