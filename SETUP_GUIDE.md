# RSJ Jewelers - Full-Stack Setup Guide

## Overview

This is a complete full-stack Next.js application with Supabase authentication, role-based access control, and an admin dashboard for managing users and products.

## System Architecture

### Authentication Flow
1. Users sign up/login via Supabase Auth
2. User profiles are created in the `profiles` table with role assignment (USER or ADMIN)
3. JWT tokens are stored in secure HTTP-only cookies
4. Middleware validates authentication for protected routes
5. Auth context provides client-side state management

### Role-Based Access Control
- **USER**: Can access dashboard, profile, orders, wishlist
- **ADMIN**: Can access all user routes + admin dashboard for user management

### File Structure

```
app/
├── api/
│   ├── auth/
│   │   ├── signup/route.ts       # User registration endpoint
│   │   ├── login/route.ts         # User login endpoint
│   │   └── logout/route.ts        # User logout endpoint
│   └── users/
│       ├── route.ts               # Get all users (admin)
│       └── [id]/route.ts          # User operations (get, patch, delete)
├── auth/
│   ├── login/page.tsx             # Login page
│   └── signup/page.tsx            # Signup page
├── dashboard/page.tsx             # User dashboard
├── admin/
│   ├── dashboard/page.tsx         # Admin dashboard
│   └── add-product/page.tsx       # Product management (existing)
├── profile/page.tsx               # User profile
├── orders/page.tsx                # Order history
└── wishlist/page.tsx              # Wishlist

lib/
├── auth-context.tsx               # Auth state management
├── db.ts                          # Database operations
├── supabase.ts                    # Supabase client
├── validators.ts                  # Zod schemas for validation
└── types.ts                       # TypeScript interfaces

components/
└── layout/
    └── Navigation.tsx             # Updated with auth dropdown
```

## Setup Instructions

### 1. Database Schema Setup

Run these SQL commands in Supabase to create the required tables:

```sql
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  digital_gold_balance NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- Create indexes
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);
```

### 2. Environment Variables

Add these to your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Authentication Flow

#### User Registration (Sign Up)
1. User fills form at `/auth/signup`
2. POST request to `/api/auth/signup` with email, password, fullName
3. Supabase creates auth user
4. User profile created in database with role='USER'
5. Email confirmation sent (if enabled in Supabase)

#### User Login
1. User fills form at `/auth/login`
2. POST request to `/api/auth/login` with email, password
3. Supabase verifies credentials
4. User profile fetched with role information
5. Auth token stored in HTTP-only cookie
6. User redirected to `/dashboard`

#### Logout
1. User clicks "Sign Out" button
2. Auth context calls `signOut()`
3. Supabase session cleared
4. User redirected to home page

### 4. Protected Routes

The middleware automatically protects these routes:

**User Routes** (require authentication):
- `/dashboard` - User dashboard
- `/profile` - Profile settings
- `/orders` - Order history
- `/wishlist` - Wishlist

**Admin Routes** (require ADMIN role):
- `/admin/dashboard` - Admin panel
- `/admin/add-product` - Product management

### 5. Using Auth Context

In any client component:

```tsx
import { useAuth } from '@/lib/auth-context';

export default function MyComponent() {
  const { 
    user,           // Supabase user object
    profile,        // User profile with role
    loading,        // Loading state
    isAuthenticated,// Boolean
    isAdmin,        // Boolean - true if role='ADMIN'
    role,           // 'USER' or 'ADMIN'
    signIn,         // Async function
    signUp,         // Async function
    signOut,        // Async function
  } = useAuth();

  // Use these in your component
}
```

### 6. API Endpoints

#### Authentication Endpoints

**POST /api/auth/signup**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**POST /api/auth/login**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**POST /api/auth/logout**
- No body required

#### User Management Endpoints

**GET /api/users** (admin only)
- Returns all users and stats

**GET /api/users/[id]**
- Returns user profile (own profile or admin only)

**PATCH /api/users/[id]** (admin only)
```json
{
  "role": "ADMIN"  // Change user role
}
```

**DELETE /api/users/[id]** (admin only)
- Deletes user account

### 7. Creating Admin Users

To make a user admin, either:

1. **Via Database**:
```sql
UPDATE public.profiles
SET role = 'ADMIN'
WHERE email = 'admin@example.com';
```

2. **Via API**:
```javascript
// Must be called by an existing admin
fetch('/api/users/user-id', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ role: 'ADMIN' })
});
```

### 8. User Navigation

The navigation bar now includes an auth dropdown:

**For Unauthenticated Users**:
- Sign In
- Create Account

**For Authenticated Users**:
- My Dashboard
- Edit Profile
- Sign Out

**For Admin Users**:
- Admin Panel (in addition to user options)

### 9. Security Features

- JWT tokens stored in HTTP-only cookies
- Role-based access control on routes and APIs
- Supabase RLS policies for database protection
- Request validation with Zod schemas
- Middleware route protection
- Admin actions require authentication

### 10. Testing the Complete Flow

1. **Sign Up**:
   - Go to `/auth/signup`
   - Create account with email and password
   - Verify account (if email confirmation enabled)

2. **Login**:
   - Go to `/auth/login`
   - Enter credentials
   - Should redirect to `/dashboard`

3. **User Dashboard**:
   - View profile info
   - See digital gold balance
   - Access quick links

4. **Admin Features** (if admin user):
   - Navigate to admin panel
   - View user stats
   - Manage users (change role, delete)
   - Add products

5. **Logout**:
   - Click "Sign Out" in auth menu
   - Should redirect to home page

## Troubleshooting

### Issue: "Unauthorized" when accessing `/api/users`
**Solution**: Ensure you're logged in and have admin role. Check that auth token is in cookies.

### Issue: Routes not protected properly
**Solution**: Check that middleware.ts is properly configured and Supabase URL/key are set.

### Issue: User profile not created after signup
**Solution**: Check database schema is created correctly. Verify Supabase permissions.

### Issue: Role not updating in UI after admin change
**Solution**: Auth context updates automatically. If not, refresh page or check browser console for errors.

## Next Steps

1. Implement order management
2. Add product reviews and ratings
3. Implement shopping cart and checkout
4. Add email notifications
5. Set up payment integration
6. Create user activity logs for admins
7. Implement search and filtering
8. Add inventory management for admins

## Support

For issues or questions:
1. Check Supabase documentation: https://supabase.com/docs
2. Review console logs for error messages
3. Verify database schema and RLS policies
4. Check environment variables are set correctly
