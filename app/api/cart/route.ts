import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET user cart
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products:product_id (
          id,
          name,
          category,
          purity,
          weight,
          base_price,
          making_charge,
          images,
          description
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate totals
    let subtotal = 0;
    const items = data?.map((item: any) => {
      const itemTotal = (item.products?.base_price || 0) * (item.quantity || 1);
      subtotal += itemTotal;
      return { ...item, itemTotal };
    }) || [];

    const gst = subtotal * 0.03;
    const total = subtotal + gst;

    return NextResponse.json({
      success: true,
      items,
      subtotal,
      gst,
      total,
      itemCount: items.length,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST add item to cart
export async function POST(request: NextRequest) {
  try {
    const { userId, productId, quantity } = await request.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { success: false, error: 'User ID and Product ID required' },
        { status: 400 }
      );
    }

    // Check if item already exists
    const { data: existing } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (existing) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: (existing.quantity || 1) + (quantity || 1) })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({
        success: true,
        data,
        message: 'Item quantity updated',
      });
    } else {
      // Add new item
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          product_id: productId,
          quantity: quantity || 1,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({
        success: true,
        data,
        message: 'Item added to cart',
      });
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

// DELETE remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cartItemId = searchParams.get('id');

    if (!cartItemId) {
      return NextResponse.json(
        { success: false, error: 'Cart item ID required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart',
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove from cart' },
      { status: 500 }
    );
  }
}

// PATCH update cart item quantity
export async function PATCH(request: NextRequest) {
  try {
    const { id, quantity } = await request.json();

    if (!id || quantity === undefined) {
      return NextResponse.json(
        { success: false, error: 'Cart item ID and quantity required' },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      // Delete if quantity is 0 or less
      await supabase.from('cart_items').delete().eq('id', id);
      return NextResponse.json({
        success: true,
        message: 'Item removed from cart',
      });
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      message: 'Cart updated',
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}
