import { NextRequest, NextResponse } from 'next/server';
import { getUserOrders, createOrder } from '@/lib/db';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const orders = await getUserOrders(userId);
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      items,
      subtotal,
      gst,
      total,
      shippingAddress,
      city,
      state,
      pincode,
      phone,
      paymentMethod,
    } = body;

    if (
      !userId ||
      !items ||
      !subtotal ||
      !city ||
      !state ||
      !pincode ||
      !phone
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create order
    const order = await createOrder(
      userId,
      items,
      subtotal,
      gst,
      total,
      shippingAddress,
      city,
      state,
      pincode,
      phone,
      paymentMethod
    );

    // Clear user's cart
    const { error: cartError } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (cartError) {
      console.error('Cart clear error:', cartError);
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Orders POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
