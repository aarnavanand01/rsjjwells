import { useState, useCallback } from 'react';
import { GoldTransaction } from '@/lib/types';

interface WalletResponse {
  success: boolean;
  balance?: number;
  transactions?: GoldTransaction[];
  data?: {
    transaction: GoldTransaction;
    newBalance: number;
    gramsReceived: number;
  };
  message?: string;
  error?: string;
}

export function useDigitalGold() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWallet = useCallback(async (userId: string): Promise<WalletResponse> => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/digital-gold?userId=${userId}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch wallet');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch wallet';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const buyGold = useCallback(async (
    userId: string,
    amountInr: number,
    rate: number
  ): Promise<WalletResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      if (amountInr < 100) {
        const message = 'Minimum amount is ₹100';
        setError(message);
        return { success: false, error: message };
      }

      const res = await fetch('/api/digital-gold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amountInr, rate }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to purchase gold');
      setError(null);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to purchase gold';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const convertToGrams = useCallback((amountInr: number, rate: number): number => {
    if (rate === 0) return 0;
    return parseFloat((amountInr / rate).toFixed(3));
  }, []);

  const convertToRupees = useCallback((grams: number, rate: number): number => {
    return Math.round(grams * rate * 100) / 100;
  }, []);

  return {
    getWallet,
    buyGold,
    convertToGrams,
    convertToRupees,
    loading,
    error,
  };
}
