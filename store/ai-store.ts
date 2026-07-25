'use client';

import { create } from 'zustand';
import type { ChatMessage } from '@/types';

interface AiState {
  messages: ChatMessage[];
  isTyping: boolean;
  send: (content: string) => void;
  clear: () => void;
}

const assistantReply = (prompt: string): string => {
  const p = prompt.toLowerCase();
  if (p.includes('save') || p.includes('saving'))
    return 'Based on your spending pattern, you could save an extra $180/month by trimming food delivery and entertainment. Moving that to your Emergency Fund would hit your goal 3 months sooner. Want me to set up an automatic monthly transfer?';
  if (p.includes('budget') || p.includes('food'))
    return 'Your food budget is at 70% used with 10 days left this month. Bakaara Market runs are your biggest cost. Buying staples in bulk on weekends and prepping meals could cut this by roughly 18%.';
  if (p.includes('community') || p.includes('ayuuto'))
    return 'You are in 3 active community groups contributing $1,700/month total. The Hodan Community Fund rotates its $12,500 pool on August 1st — you are eligible this round. Shall I remind you 3 days before?';
  if (p.includes('invest') || p.includes('business'))
    return 'Your Business Capital goal is at 40%. With your current $480/month contribution pace, you reach $12,000 by mid-2027. Increasing contributions by $120/month would bring that forward to January 2027.';
  return 'I analyzed your last 30 days. Income is stable at $3,650, but expenses rose 15% — mostly food and business stock. Your savings rate dipped from 32% to 22%. I recommend pausing discretionary spending for the rest of July. Want a detailed breakdown by category?';
};

let id = 0;
const nextId = () => `ai_${++id}`;

export const useAiStore = create<AiState>((set, get) => ({
  messages: [
    {
      id: 'ai_welcome',
      role: 'assistant',
      content:
        "Assalamu alaikum! I'm your Maal-AI assistant. I can analyze your spending, suggest budgets, track savings goals, and help with community finance. What would you like to know?",
      createdAt: new Date().toISOString(),
    },
  ],
  isTyping: false,

  send: (content) => {
    const userMsg: ChatMessage = {
      id: nextId(),
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ messages: [...s.messages, userMsg], isTyping: true }));

    setTimeout(() => {
      const reply: ChatMessage = {
        id: nextId(),
        role: 'assistant',
        content: assistantReply(content),
        createdAt: new Date().toISOString(),
      };
      set((s) => ({ messages: [...s.messages, reply], isTyping: false }));
    }, 1400);
  },

  clear: () =>
    set({
      messages: [
        {
          id: 'ai_welcome',
          role: 'assistant',
          content:
            "Assalamu alaikum! I'm your Maal-AI assistant. How can I help you manage your money today?",
          createdAt: new Date().toISOString(),
        },
      ],
    }),
}));
