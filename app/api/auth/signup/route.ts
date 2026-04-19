import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createUserProfile } from '@/lib/db';
import { signupSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = signupSchema.parse(body);
    const { email, password, fullName } = validatedData;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    // Create user in auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 400 }
      );
    }

    // Create user profile
    await createUserProfile(authData.user.id, email, fullName, 'USER');

    return NextResponse.json(
      { 
        message: 'User created successfully. Please check your email for confirmation.',
        userId: authData.user.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    
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
