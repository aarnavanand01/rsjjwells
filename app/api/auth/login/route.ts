import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { loginSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = loginSchema.parse(body);
    const { email, password } = validatedData;

    // Sign in with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!authData.session) {
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 401 }
      );
    }

    // Get user profile to include role info
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      );
    }

    // Create response with auth token
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          id: authData.user.id,
          email: authData.user.email,
          role: profile?.role || 'USER',
        },
        session: authData.session,
      },
      { status: 200 }
    );

    // Set auth cookie
    if (authData.session.access_token) {
      response.cookies.set('sb-access-token', authData.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
