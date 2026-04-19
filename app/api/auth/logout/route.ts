import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to logout' },
        { status: 400 }
      );
    }

    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    // Clear auth cookie
    response.cookies.delete('sb-access-token');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
