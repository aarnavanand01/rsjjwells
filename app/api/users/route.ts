import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAllUsers, getUserStats } from '@/lib/db';

/**
 * GET /api/users - Get all users (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get current user profile to check role
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .maybeSingle();

    if (profileError || !userProfile || userProfile.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Fetch all users
    const users = await getAllUsers();
    const stats = await getUserStats();

    return NextResponse.json(
      { 
        users,
        stats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
