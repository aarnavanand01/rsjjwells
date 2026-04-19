import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET user digital gold wallet
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('digital_gold_balance')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    const { data: transactions, error: transError } = await supabase
      .from('gold_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (transError) throw transError;

    return NextResponse.json({
      success: true,
      balance: profile?.digital_gold_balance || 0,
      transactions: transactions || [],
    });
  } catch (error) {
    console.error('Error fetching digital gold:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wallet' },
      { status: 500 }
    );
  }
}

// POST buy digital gold
export async function POST(request: NextRequest) {
  try {
    const { userId, amountInr, rate } = await request.json();

    if (!userId || !amountInr || !rate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (amountInr < 100) {
      return NextResponse.json(
        { success: false, error: 'Minimum amount is ₹100' },
        { status: 400 }
      );
    }

    const gramsReceived = amountInr / rate;

    // Update user profile with new digital gold balance
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('digital_gold_balance')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    const newBalance = (profile?.digital_gold_balance || 0) + gramsReceived;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ digital_gold_balance: newBalance })
      .eq('id', userId);

    if (updateError) throw updateError;

    // Create transaction record
    const { data: transaction, error: transError } = await supabase
      .from('gold_transactions')
      .insert({
        user_id: userId,
        amount_inr: amountInr,
        grams_received: gramsReceived,
        rate_applied: rate,
        transaction_type: 'BUY',
        status: 'COMPLETED',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (transError) throw transError;

    return NextResponse.json({
      success: true,
      data: {
        transaction,
        newBalance,
        gramsReceived,
      },
      message: `Successfully purchased ${gramsReceived.toFixed(3)}g of digital gold`,
    });
  } catch (error) {
    console.error('Error buying digital gold:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to purchase digital gold' },
      { status: 500 }
    );
  }
}
