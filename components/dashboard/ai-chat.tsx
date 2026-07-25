'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Send, Sparkles, Mic, Trash2, User, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAiStore } from '@/store/ai-store';
import { Logo } from '@/components/logo';
import { toast } from 'sonner';

const suggestions = [
  'How can I save more money?',
  'Analyze my food spending',
  'How is my community fund doing?',
  'When will I hit my business goal?',
];

export function AIChat({ className }: { className?: string }) {
  const { messages, isTyping, send, clear } = useAiStore();
  const [input, setInput] = React.useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isTyping]);

  const submit = (text: string) => {
    if (!text.trim()) return;
    send(text.trim());
    setInput('');
  };

  return (
    <div
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-xl border bg-card',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-brand-gradient px-4 py-3 text-primary-foreground">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/15">
            <Sparkles className="h-4 w-4 text-accent" />
          </span>
          <div>
            <p className="text-sm font-semibold">Maal-AI Assistant</p>
            <p className="text-[0.7rem] text-primary-foreground/80">
              {isTyping ? 'Typing…' : 'Online · Ready to help'}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:bg-white/10"
          onClick={clear}
          aria-label="Clear conversation"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto p-4 scrollbar-thin"
      >
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'flex gap-2.5',
              m.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {m.role === 'assistant' && (
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-gradient text-primary-foreground">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
            )}
            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm',
                m.role === 'user'
                  ? 'rounded-br-sm bg-primary text-primary-foreground'
                  : 'rounded-bl-sm bg-muted text-foreground'
              )}
            >
              {m.content}
            </div>
            {m.role === 'user' && (
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent/20 text-accent-foreground">
                <User className="h-3.5 w-3.5" />
              </span>
            )}
          </motion.div>
        ))}

        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-2.5"
            >
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-gradient text-primary-foreground">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 px-4 pb-3">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => submit(s)}
              className="rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="flex items-center gap-2 border-t p-3"
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              toast.success(`Attached ${e.target.files[0].name}`, {
                description: 'Receipt will be analyzed in a future update.',
              });
            }
          }}
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="shrink-0 text-muted-foreground"
          aria-label="Attach file"
          onClick={() => fileRef.current?.click()}
        >
          <Paperclip className="h-[1.15rem] w-[1.15rem]" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="shrink-0 text-muted-foreground"
          aria-label="Voice assistant"
          onClick={() => toast.info('Voice assistant — coming soon')}
        >
          <Mic className="h-[1.15rem] w-[1.15rem]" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="shrink-0 text-muted-foreground"
          aria-label="Voice assistant"
          onClick={() => {}}
        >
          <Mic className="h-[1.15rem] w-[1.15rem]" />
        </Button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Maal-AI anything about your money…"
          className="flex-1 rounded-lg bg-muted/60 px-4 py-2.5 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Message"
        />
        <Button type="submit" size="icon" className="shrink-0" aria-label="Send">
          <Send className="h-[1.15rem] w-[1.15rem]" />
        </Button>
      </form>
    </div>
  );
}

export { Logo };
