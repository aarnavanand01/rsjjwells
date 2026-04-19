import { NextRequest, NextResponse } from 'next/server';
import { addToWishlist, getUserWishlist, removeFromWishlist } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const wishlistItems = await getUserWishlist(userId);
    return NextResponse.json(wishlistItems);
  } catch (error) {
    console.error('Wishlist GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId } = body;

    if (!userId || !productId) {
      return NextResponse.json({ error: 'User ID and Product ID required' }, { status: 400 });
    }

    const wishlistItem = await addToWishlist(userId, productId);
    return NextResponse.json(wishlistItem);
  } catch (error) {
    console.error('Wishlist POST error:', error);
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
    }

    await removeFromWishlist(itemId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Wishlist DELETE error:', error);
    return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
  }
}
