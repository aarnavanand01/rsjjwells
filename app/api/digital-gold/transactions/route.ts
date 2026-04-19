import { NextRequest, NextResponse } from 'next/server';
import { getUserGoldTransactions } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const transactions = await getUserGoldTransactions(userId);
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Transactions GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
