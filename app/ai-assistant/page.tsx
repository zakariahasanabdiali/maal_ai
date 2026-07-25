'use client';

import * as React from 'react';
import {
  Sparkles,
  Plus,
  MessageSquare,
  Search,
  Pin,
  TrendingUp,
  ShieldCheck,
  Users,
  Paperclip,
} from 'lucide-react';
import { motion } from 'framer-motion';

import { PageHeader } from '@/components/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AIChat } from '@/components/dashboard/ai-chat';
import { useAiStore } from '@/store/ai-store';
import { cn } from '@/lib/utils';
import { relativeDate } from '@/lib/format';

const conversations = [
  { id: 'conv1', title: 'Saving strategy', preview: 'You could save an extra $180/month…', updatedAt: new Date(Date.now() - 3600000).toISOString(), unread: 0, pinned: true },
  { id: 'conv2', title: 'Food budget analysis', preview: 'Your food budget is at 70% used…', updatedAt: new Date(Date.now() - 86400000).toISOString(), unread: 2, pinned: false },
  { id: 'conv3', title: 'Community fund advice', preview: 'You are in 3 active community groups…', updatedAt: new Date(Date.now() - 172800000).toISOString(), unread: 0, pinned: false },
  { id: 'conv4', title: 'Business capital goal', preview: 'Your Business Capital goal is at 40%…', updatedAt: new Date(Date.now() - 432000000).toISOString(), unread: 0, pinned: false },
];

const capabilities = [
  { icon: TrendingUp, title: 'Spending analysis', desc: 'Understand where your money goes and find savings opportunities.' },
  { icon: ShieldCheck, title: 'Budget guardrails', desc: 'Get alerts and suggestions before you overspend.' },
  { icon: Users, title: 'Community advice', desc: 'Manage ayuuto groups and plan contribution rotations.' },
];

const suggestedPrompts = [
  'How can I save more money?',
  'Analyze my food spending',
  'How is my community fund doing?',
  'When will I hit my business goal?',
];

export default function AiAssistantPage() {
  const { clear } = useAiStore();
  const [activeConv, setActiveConv] = React.useState('conv1');
  const [convSearch, setConvSearch] = React.useState('');

  const filteredConvs = conversations.filter((c) =>
    c.title.toLowerCase().includes(convSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Assistant"
        description="Your personal AI financial advisor — ask anything about your money."
      />

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        {/* Conversation list */}
        <div className="space-y-4">
          <Card className="p-3">
            <Button className="w-full justify-start" onClick={clear}>
              <Plus className="mr-2 h-4 w-4" /> New conversation
            </Button>
          </Card>

          <Card className="p-3">
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={convSearch}
                onChange={(e) => setConvSearch(e.target.value)}
                placeholder="Search conversations…"
                aria-label="Search conversations"
                className="w-full rounded-lg bg-muted/60 py-2 pl-9 pr-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <ul className="space-y-1">
              {filteredConvs.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setActiveConv(c.id)}
                    className={cn(
                      'flex w-full items-start gap-2.5 rounded-lg p-2.5 text-left transition-colors',
                      activeConv === c.id
                        ? 'bg-primary/10 ring-1 ring-primary/30'
                        : 'hover:bg-muted'
                    )}
                  >
                    <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        {c.pinned && <Pin className="h-3 w-3 text-accent" />}
                        <p className="truncate text-sm font-medium">{c.title}</p>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{c.preview}</p>
                      <p className="mt-0.5 text-[0.65rem] text-muted-foreground/70">
                        {relativeDate(c.updatedAt)}
                      </p>
                    </div>
                    {c.unread > 0 && (
                      <span className="mt-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[0.6rem] font-bold text-accent-foreground">
                        {c.unread}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Chat window */}
        <div className="space-y-5">
          <div className="h-[65vh] min-h-[480px]">
            <AIChat className="h-full" />
          </div>

          {/* Suggested prompts */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Suggested prompts
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((p) => (
                <PromptChip key={p} prompt={p} />
              ))}
            </div>
          </div>

          {/* Capabilities */}
          <div className="grid gap-3 sm:grid-cols-3">
            {capabilities.map((c) => {
              const Icon = c.icon;
              return (
                <Card key={c.title} className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent-foreground">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{c.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{c.desc}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function PromptChip({ prompt }: { prompt: string }) {
  const { send } = useAiStore();
  return (
    <button
      onClick={() => send(prompt)}
      className="flex items-center gap-1.5 rounded-full border bg-card px-3.5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
    >
      <Sparkles className="h-3 w-3" />
      {prompt}
    </button>
  );
}
