import { useState, useCallback } from 'react';
import { CartItem } from '@/lib/types';

interface CartResponse {
  success: boolean;
  items?: CartItem[];
  subtotal?: number;
  gst?: number;
  total?: number;
  itemCount?: number;
  error?: string;
  message?: string;
}

export function useCartAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCart = useCallback(async (userId: string): Promise<CartResponse> => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/cart?userId=${userId}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch cart');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch cart';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (
    userId: string,
    productId: string,
    quantity: number = 1
  ): Promise<CartResponse> => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, quantity }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to add to cart');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add to cart';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFromCart = useCallback(async (cartItemId: string): Promise<CartResponse> => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/cart?id=${cartItemId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to remove from cart');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove from cart';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuantity = useCallback(async (
    cartItemId: string,
    quantity: number
  ): Promise<CartResponse> => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cartItemId, quantity }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to update cart');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update cart';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    loading,
    error,
  };
}
