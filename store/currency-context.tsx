'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Currency } from '@/lib/format';
import { useAuth } from '@/store/auth-store';

interface CurrencyCtx {
  currency: Currency;
  setCurrency: (c: Currency) => void;
}

const Ctx = createContext<CurrencyCtx | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { currency: userCurrency, setCurrency: setStoreCurrency } = useAuth();
  const [currency, setCurrencyState] = useState<Currency>(userCurrency);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    setStoreCurrency(c);
  };

  return (
    <Ctx.Provider value={{ currency, setCurrency }}>{children}</Ctx.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
