# Quick Start Guide

## Get Started in 5 Minutes

### Step 1: Set Environment Variables
Create `.env.local` in your project root:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 2: Set Up Database
1. Go to your Supabase dashboard
2. Click "SQL Editor"
3. Run the schema setup from SETUP_GUIDE.md (section: Database Schema Setup)

### Step 3: Start Development Server
```bash
npm run dev
# or
pnpm dev
```

Open http://localhost:3000

### Step 4: Test the Flow
1. Click the user icon in header → "Create Account"
2. Sign up with your email
3. Check confirmation email (if enabled)
4. Click user icon → "Sign In"
5. Enter credentials → you'll be on Dashboard
6. Explore features

## User Flows

### User Registration & Login
```
Sign Up Page (/auth/signup)
    ↓
Validation + Create Auth User
    ↓
Create User Profile (role='USER')
    ↓
Auto Login
    ↓
Dashboard (/dashboard)
```

### User Dashboard
```
Dashboard shows:
- Profile information
- Digital gold balance
- Quick action links
- Logout button
```

### Admin Features
1. **Promote User to Admin** (via Supabase SQL):
```sql
UPDATE public.profiles SET role='ADMIN' WHERE email='your@email.com';
```

2. **Access Admin Panel**:
   - Click user icon in header
   - Click "Admin Panel"
   - View and manage users
   - Change roles or delete users

## Common Tasks

### Create Admin User
```sql
-- Via Supabase SQL Editor
UPDATE public.profiles 
SET role = 'ADMIN' 
WHERE email = 'admin@example.com';
```

### Check User Data
```sql
-- View all users
SELECT id, email, full_name, role, created_at FROM public.profiles;

-- View specific user
SELECT * FROM public.profiles WHERE email = 'user@example.com';
```

### Reset User Password
- User clicks "Forgot Password" on login page (if implemented)
- Or admin deletes user and they re-register

### Delete User Account
- Admin dashboard → Find user → Click delete button
- Or via API: `DELETE /api/users/[user-id]`

## Customization

### Change Default User Role
Edit `lib/db.ts`, `createUserProfile()` function:
```typescript
// Change 'USER' to whatever you want
export async function createUserProfile(
  userId: string,
  email: string,
  fullName: string,
  role: UserRole = 'USER'  // Change here
) {
```

### Customize Dashboard
Edit `app/dashboard/page.tsx` to add your own sections

### Add More Roles
1. Update `lib/types.ts`:
```typescript
export type UserRole = 'ADMIN' | 'USER' | 'MODERATOR';  // Add 'MODERATOR'
```

2. Update validation in `lib/validators.ts`:
```typescript
role: z.enum(['ADMIN', 'USER', 'MODERATOR']);
```

3. Add checks in your components:
```typescript
if (role === 'MODERATOR') {
  // Show moderator features
}
```

## Troubleshooting

### "Supabase URL not found"
**Fix**: Check `.env.local` has correct environment variables

### Login redirects to login page
**Fix**: 
1. Check Supabase credentials are correct
2. Verify user exists in database
3. Check browser cookies are enabled

### Admin panel shows "Access Denied"
**Fix**: User must have `role='ADMIN'` in database

### Can't upload images in add-product
**Fix**: Storage buckets must be created in Supabase

### "CORS Error" on API calls
**Fix**: Middleware should handle this, check middleware.ts

## API Reference (Quick)

### Sign Up
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"password123",
    "fullName":"John Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"password123"
  }'
```

### Get All Users (Admin)
```bash
curl http://localhost:3000/api/users \
  -H "Cookie: sb-access-token=your_token"
```

### Change User Role
```bash
curl -X PATCH http://localhost:3000/api/users/user-id \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=your_token" \
  -d '{"role":"ADMIN"}'
```

## Routes Overview

### Public Routes
- `/` - Home page
- `/shop` - Shop page
- `/auth/login` - Login
- `/auth/signup` - Sign up

### Protected Routes (Login Required)
- `/dashboard` - User dashboard
- `/profile` - Profile settings
- `/orders` - Order history
- `/wishlist` - Wishlist

### Admin Routes (Admin Only)
- `/admin/dashboard` - Admin panel
- `/admin/add-product` - Add products

## Next: Deep Dive

For more details, see:
- **Setup**: `SETUP_GUIDE.md` - Complete setup instructions
- **Implementation**: `IMPLEMENTATION_SUMMARY.md` - What was built
- **Code**: Check individual files for inline comments

## Support Resources

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Auth.js Docs](https://authjs.dev)
- [Zod Validation](https://zod.dev)

---

**Ready to go!** Start by creating an account at http://localhost:3000/auth/signup
