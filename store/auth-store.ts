'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { User } from '@/types';
import type { Currency } from '@/lib/format';
import { createClient } from '@/lib/supabase/client';
import type { Session } from '@supabase/supabase-js';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: { name: string; email: string; password: string; accountType: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<User>) => Promise<void>;
  setCurrency: (currency: Currency) => void;
  currency: Currency;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrencyState] = useState<Currency>('USD');

  const mapUser = useCallback(async (authUser: import('@supabase/supabase-js').User): Promise<User> => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, phone_number, avatar_url')
      .eq('user_id', authUser.id)
      .single();

    const { data: userData } = await supabase
      .from('users')
      .select('email, created_at, email_verified_at')
      .eq('id', authUser.id)
      .single();

    return {
      id: authUser.id,
      name: profile?.full_name ?? authUser.email ?? 'User',
      email: userData?.email ?? authUser.email ?? '',
      phone: profile?.phone_number ?? undefined,
      avatar: profile?.avatar_url ?? undefined,
      accountType: (authUser.user_metadata?.account_type as 'personal' | 'family' | 'business' | 'community') ?? 'personal',
      currency,
      city: authUser.user_metadata?.city as string ?? '',
      joinedAt: userData?.created_at ?? new Date().toISOString(),
      verified: !!userData?.email_verified_at,
    };
  }, [supabase, currency]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data: { session: activeSession } } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(activeSession);
      if (activeSession?.user) {
        const mapped = await mapUser(activeSession.user);
        if (mounted) setUser(mapped);
      }
      if (mounted) setLoading(false);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        const mapped = await mapUser(newSession.user);
        setUser(mapped);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, mapUser]);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, [supabase]);

  const register = useCallback(async (input: { name: string; email: string; password: string; accountType: string }) => {
    const { error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          full_name: input.name,
          account_type: input.accountType,
        },
      },
    });
    if (error) throw error;
  }, [supabase]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, [supabase]);

  const updateProfile = useCallback(async (patch: Partial<User>) => {
    if (!session?.user) return;
    const updates: Record<string, unknown> = {};
    if (patch.name) updates.full_name = patch.name;
    if (patch.phone !== undefined) updates.phone_number = patch.phone;
    if (patch.avatar !== undefined) updates.avatar_url = patch.avatar;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', session.user.id);

    if (error) throw error;
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, [supabase, session]);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    setUser((prev) => (prev ? { ...prev, currency: c } : prev));
  }, []);

  return React.createElement(
    AuthContext.Provider,
    { value: { user, session, loading, login, register, logout, updateProfile, setCurrency, currency } },
    children
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
