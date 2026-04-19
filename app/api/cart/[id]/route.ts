import { NextRequest, NextResponse } from 'next/server';
import { removeFromCart } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Cart item ID required' }, { status: 400 });
    }

    await removeFromCart(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 });
  }
}
