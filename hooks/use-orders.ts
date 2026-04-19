import { useState, useCallback } from 'react';

interface OrdersResponse {
  success: boolean;
  data?: any;
  orders?: any[];
  count?: number;
  message?: string;
  error?: string;
}

export function useOrders() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getOrders = useCallback(async (userId: string): Promise<OrdersResponse> => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/orders?userId=${userId}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch orders');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrder = useCallback(async (orderId: string): Promise<OrdersResponse> => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/orders?orderId=${orderId}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch order');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch order';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (orderData: {
    userId: string;
    items: any[];
    subtotal: number;
    gst: number;
    total: number;
    shippingAddress: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    paymentMethod: string;
  }): Promise<OrdersResponse> => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to create order');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create order';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(async (
    orderId: string,
    status: string
  ): Promise<OrdersResponse> => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to update order');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update order';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getOrders,
    getOrder,
    createOrder,
    updateOrderStatus,
    loading,
    error,
  };
}
