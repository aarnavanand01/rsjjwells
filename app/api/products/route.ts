import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category');
    const purity = request.nextUrl.searchParams.get('purity');
    const productId = request.nextUrl.searchParams.get('id');

    let query = supabase.from('products').select('*');

    // Get single product
    if (productId) {
      const { data, error } = await query.eq('id', productId).single();
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    // Apply filters
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (purity && purity !== 'all') {
      query = query.eq('purity', purity);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      category,
      purity,
      weight,
      basePrice,
      makingCharge,
      description,
      images,
      featured,
    } = await request.json();

    if (!name || !category || !weight) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        name,
        category,
        purity: purity || '24K',
        weight,
        base_price: basePrice || 0,
        making_charge: makingCharge || 0,
        description,
        images: images || [],
        featured: featured || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      message: 'Product created successfully',
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
