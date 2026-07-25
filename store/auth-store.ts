'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, AccountType } from '@/types';
import type { Currency } from '@/lib/format';
import { currentUser } from '@/mock/users';

export interface AuthSession {
  user: User;
  isAuthenticated: boolean;
}

interface AuthState extends AuthSession {
  login: (email: string, password: string) => Promise<void>;
  register: (input: {
    name: string;
    email: string;
    accountType: AccountType;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
  setCurrency: (currency: Currency) => void;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: currentUser,
      isAuthenticated: false,

      login: async (email) => {
        await delay(900);
        set((s) => ({
          isAuthenticated: true,
          user: { ...s.user, email },
        }));
      },

      register: async ({ name, email, accountType }) => {
        await delay(1000);
        set((s) => ({
          isAuthenticated: true,
          user: { ...s.user, name, email, accountType },
        }));
      },

      logout: () => set({ isAuthenticated: false }),

      updateProfile: (patch) =>
        set((s) => ({ user: { ...s.user, ...patch } })),

      setCurrency: (currency) =>
        set((s) => ({ user: { ...s.user, currency } })),
    }),
    {
      name: 'maal-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ isAuthenticated: s.isAuthenticated, user: s.user }),
    }
  )
);
