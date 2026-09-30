import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatAmount: (amount: number, options?: { showDecimals?: boolean; compact?: boolean }) => string;
  currencySymbol: string;
}

const SYMBOLS: Record<CurrencyCode, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'AED '
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode; initialCurrency?: CurrencyCode }> = ({
  children,
  initialCurrency = 'INR'
}) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finadvisor_currency') as CurrencyCode;
      if (saved && SYMBOLS[saved]) return saved;
    }
    return initialCurrency;
  });

  useEffect(() => {
    localStorage.setItem('finadvisor_currency', currency);
  }, [currency]);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
  };

  const formatAmount = (amount: number, options?: { showDecimals?: boolean; compact?: boolean }): string => {
    const val = Number(amount) || 0;
    const symbol = SYMBOLS[currency] || '₹';

    if (options?.compact) {
      if (currency === 'INR') {
        if (Math.abs(val) >= 10000000) return `${symbol}${(val / 10000000).toFixed(1)}Cr`;
        if (Math.abs(val) >= 100000) return `${symbol}${(val / 100000).toFixed(1)}L`;
        if (Math.abs(val) >= 1000) return `${symbol}${(val / 1000).toFixed(1)}k`;
      } else {
        if (Math.abs(val) >= 1000000) return `${symbol}${(val / 1000000).toFixed(1)}M`;
        if (Math.abs(val) >= 1000) return `${symbol}${(val / 1000).toFixed(1)}k`;
      }
    }

    const formattedNum = val.toLocaleString(currency === 'INR' ? 'en-IN' : 'en-US', {
      minimumFractionDigits: options?.showDecimals ? 2 : 0,
      maximumFractionDigits: options?.showDecimals ? 2 : 0
    });

    return `${symbol}${formattedNum}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatAmount,
        currencySymbol: SYMBOLS[currency] || '₹'
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};
