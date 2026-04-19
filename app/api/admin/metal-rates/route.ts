import { NextRequest, NextResponse } from 'next/server';
import { getMetalRateOverrides, setMetalRateOverride } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const overrides = await getMetalRateOverrides();
    return NextResponse.json({ overrides });
  } catch (error) {
    console.error('Metal rates GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { metalType, purity, customRate, reason, adminId } = body;

    if (!metalType || !customRate || !adminId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const override = await setMetalRateOverride(
      metalType,
      purity || '22K',
      customRate,
      reason || 'Manual adjustment',
      adminId
    );

    return NextResponse.json({ override }, { status: 201 });
  } catch (error) {
    console.error('Metal rates POST error:', error);
    return NextResponse.json(
      { error: 'Failed to set rate' },
      { status: 500 }
    );
  }
}
