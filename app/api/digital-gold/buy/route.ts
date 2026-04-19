import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createGoldTransaction, updateUserProfile } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amountInr, gramsToReceive, rateApplied } = body;

    if (!userId || !amountInr || !gramsToReceive || !rateApplied) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate amount is positive
    if (amountInr <= 0 || gramsToReceive <= 0) {
      return NextResponse.json(
        { error: 'Amount and grams must be positive' },
        { status: 400 }
      );
    }

    // Get current user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('digital_gold_balance')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create transaction record
    const transaction = await createGoldTransaction(
      userId,
      amountInr,
      gramsToReceive,
      rateApplied
    );

    // Update user's digital gold balance
    const newBalance = (profile.digital_gold_balance || 0) + gramsToReceive;
    await updateUserProfile(userId, {
      digital_gold_balance: newBalance,
    });

    return NextResponse.json({
      success: true,
      transaction,
      newBalance,
    });
  } catch (error) {
    console.error('Digital gold buy error:', error);
    return NextResponse.json(
      { error: 'Failed to process purchase' },
      { status: 500 }
    );
  }
}
