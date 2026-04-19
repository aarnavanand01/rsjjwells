import { useState, useCallback } from 'react';

interface PaymentResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentOrder = useCallback(async (
    orderId: string,
    amount: number,
    customerEmail: string,
    customerName: string
  ): Promise<PaymentResponse> => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          amount,
          customerEmail,
          customerName,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to create payment order');

      // In production, initialize Razorpay here
      // The response contains Razorpay order ID and key
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyPayment = useCallback(async (
    orderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<PaymentResponse> => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/payments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          razorpayPaymentId,
          razorpaySignature,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Payment verification failed');

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Verification failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRazorpay = useCallback(async (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  return {
    createPaymentOrder,
    verifyPayment,
    loadRazorpay,
    loading,
    error,
  };
}
