import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('metal_rates')
      .select('*')
      .eq('active', true)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data || [],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching metal rates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch metal rates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { metal, purity, rate, source } = await request.json();

    if (!metal || !purity || !rate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('metal_rates')
      .insert({
        metal,
        purity,
        rate,
        source: source || 'MANUAL',
        active: true,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      message: 'Metal rate added successfully',
    });
  } catch (error) {
    console.error('Error adding metal rate:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add metal rate' },
      { status: 500 }
    );
  }
}
