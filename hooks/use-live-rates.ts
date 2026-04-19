import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface MetalRate {
  id: string;
  metal: string;
  purity: string;
  price: number;
  previous_price: number;
  change_percent: number;
  trend: 'up' | 'down' | 'neutral';
  updated_at: string;
}

export function useLiveRates() {
  const [rates, setRates] = useState<MetalRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('metal_rates')
        .select('*')
        .order('metal', { ascending: true });

      if (fetchError) throw fetchError;
      setRates(data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch metal rates:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch rates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();

    const channel = supabase
      .channel('metal_rates_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'metal_rates' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setRates((prev) =>
              prev.map((rate) =>
                rate.id === payload.new.id
                  ? { ...rate, ...payload.new }
                  : rate
              )
            );
          } else if (payload.eventType === 'INSERT') {
            setRates((prev) => [...prev, payload.new as MetalRate]);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [fetchRates]);

  // Mock Rate Updater: simulate price shifts every 60 seconds
  useEffect(() => {
    if (rates.length === 0) return;

    const intervalId = setInterval(() => {
      setRates((prevRates) =>
        prevRates.map((rate) => {
          // Simulate a small price shift: between -0.5% and +0.5%
          const changePercent = (Math.random() - 0.5) * 1;
          const newPrice = Math.max(0, Math.round(rate.price * (1 + changePercent / 100)));
          
          return {
            ...rate,
            previous_price: rate.price,
            price: newPrice,
            change_percent: Number(changePercent.toFixed(2)),
            trend: changePercent > 0 ? 'up' : changePercent < 0 ? 'down' : 'neutral',
            updated_at: new Date().toISOString(),
          };
        })
      );
    }, 60000); // 60 seconds

    return () => clearInterval(intervalId);
  }, [rates.length > 0]);

  return { rates, loading, error, refetch: fetchRates };
}
