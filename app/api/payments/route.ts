import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// This is a mock Razorpay integration. Replace with actual Razorpay SDK in production.
// For production, install: npm install razorpay

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'test_key';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'test_secret';

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount, customerEmail, customerName } = await request.json();

    if (!orderId || !amount) {
      return NextResponse.json(
        { success: false, error: 'Order ID and amount required' },
        { status: 400 }
      );
    }

    // In production, use actual Razorpay API
    // For now, create a mock order
    const razorpayOrderId = `order_${Date.now()}`;

    // Update order with payment reference
    const { error: updateError } = await supabase
      .from('orders')
      .update({ razorpay_order_id: razorpayOrderId })
      .eq('id', orderId);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      data: {
        id: razorpayOrderId,
        amount: Math.round(amount * 100), // Razorpay expects amount in paise
        currency: 'INR',
        receipt: `receipt_${orderId}`,
        key_id: RAZORPAY_KEY_ID,
      },
      message: 'Payment order created',
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}

// Verify payment signature
export async function PATCH(request: NextRequest) {
  try {
    const { orderId, razorpayPaymentId, razorpaySignature } = await request.json();

    if (!orderId || !razorpayPaymentId) {
      return NextResponse.json(
        { success: false, error: 'Missing payment details' },
        { status: 400 }
      );
    }

    // In production, verify signature using crypto
    // For now, accept any valid payment
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'PROCESSING',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: 'Payment verified and order updated',
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
