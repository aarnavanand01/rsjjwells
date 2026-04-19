# Documentation Index

Welcome to the RSJ Jewelers full-stack application documentation. This guide will help you navigate all available documentation and resources.

## Start Here

### For First-Time Setup
**Read in this order:**
1. **[QUICKSTART.md](./QUICKSTART.md)** (5 min read)
   - Environment setup
   - Database configuration
   - Testing the application
   - Common tasks

2. **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** (15 min read)
   - Detailed setup instructions
   - System architecture overview
   - Database schema explanation
   - Authentication flow details
   - API endpoint documentation

### For Understanding What Was Built
3. **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** (10 min read)
   - What was implemented
   - File changes summary
   - Security features
   - Architecture decisions

### For Production Deployment
4. **[DEPLOYMENT_NOTES.md](./DEPLOYMENT_NOTES.md)** (20 min read)
   - Pre-deployment checklist
   - Vercel deployment steps
   - Production configuration
   - Monitoring and logging
   - Common issues and solutions

### For Complete Overview
5. **[FULLSTACK_README.md](./FULLSTACK_README.md)** (5 min read)
   - Feature overview
   - Technology stack
   - Quick reference
   - Project structure

---

## Documentation by Use Case

### I want to...

#### Get the app running locally
→ Read **[QUICKSTART.md](./QUICKSTART.md)**
- Quick setup in 5 minutes
- Environment variables
- Database setup
- Testing the flow

#### Understand the system
→ Read **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** Section: "System Architecture"
- Authentication flow diagram
- Role-based access control explanation
- File structure overview
- Route protection mechanism

#### Add a new feature
→ Read **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** and **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)**
- Understand existing patterns
- See how auth context is used
- Review API route structure
- Check validation patterns

#### Deploy to production
→ Read **[DEPLOYMENT_NOTES.md](./DEPLOYMENT_NOTES.md)**
- Pre-deployment checklist
- Vercel deployment guide
- Environment variable setup
- Security hardening
- Monitoring setup

#### Fix an issue
→ Read **[QUICKSTART.md](./QUICKSTART.md)** "Troubleshooting" section
→ Or **[DEPLOYMENT_NOTES.md](./DEPLOYMENT_NOTES.md)** "Common Production Issues"
- Common problems and solutions
- Debugging tips
- Resource links

#### Create an admin user
→ Read **[QUICKSTART.md](./QUICKSTART.md)** "Common Tasks"
- SQL command to make user admin
- How to verify it worked

#### Understand the database
→ Read **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** Section: "Database Schema Setup"
- Complete schema with all fields
- RLS policy explanations
- Index creation

#### Learn about API endpoints
→ Read **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** Section: "API Endpoints"
- Endpoint documentation
- Request/response examples
- Authentication requirements

---

## Quick Reference

### File Locations

**Authentication**
- Routes: `app/auth/` (signup, login pages)
- API: `app/api/auth/` (signup, login, logout endpoints)
- Logic: `lib/auth-context.tsx` (state management)
- Database: `lib/db.ts` (user operations)

**Admin Features**
- Dashboard: `app/admin/dashboard/page.tsx`
- Add Product: `app/admin/add-product/page.tsx`
- API: `app/api/users/` (user management)

**User Features**
- Dashboard: `app/dashboard/page.tsx`
- Profile: `app/profile/page.tsx`
- Orders: `app/orders/page.tsx`
- Wishlist: `app/wishlist/page.tsx`

**Navigation**
- Header: `components/layout/Header.tsx`
- Navigation: `components/layout/Navigation.tsx`
- Auth Dropdown: Part of Navigation.tsx

**Utilities**
- Types: `lib/types.ts`
- Validators: `lib/validators.ts`
- Supabase Client: `lib/supabase.ts`
- Middleware: `middleware.ts`

### Common Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Type check
npm run typecheck

# Lint
npm run lint
```

### Common Routes

| Route | Access | Purpose |
|-------|--------|---------|
| `/` | Public | Home page |
| `/shop` | Public | Shop products |
| `/auth/login` | Public | Login page |
| `/auth/signup` | Public | Signup page |
| `/dashboard` | User | User dashboard |
| `/profile` | User | Profile settings |
| `/orders` | User | Order history |
| `/wishlist` | User | Wishlist |
| `/admin/dashboard` | Admin | Admin panel |
| `/admin/add-product` | Admin | Add products |

### Environment Variables

Required:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxx
```

### API Endpoints

| Endpoint | Method | Access | Purpose |
|----------|--------|--------|---------|
| `/api/auth/signup` | POST | Public | Register user |
| `/api/auth/login` | POST | Public | Login user |
| `/api/auth/logout` | POST | Auth | Logout user |
| `/api/users` | GET | Admin | Get all users |
| `/api/users/[id]` | GET | User/Admin | Get user |
| `/api/users/[id]` | PATCH | Admin | Update role |
| `/api/users/[id]` | DELETE | Admin | Delete user |

---

## Documentation Structure

```
Documentation/
├── QUICKSTART.md              ← Start here (5 min)
├── SETUP_GUIDE.md             ← Complete setup (15 min)
├── IMPLEMENTATION_SUMMARY.md  ← What was built (10 min)
├── DEPLOYMENT_NOTES.md        ← Deploy to prod (20 min)
├── FULLSTACK_README.md        ← Overview (5 min)
└── DOCUMENTATION.md           ← This file (navigation)
```

---

## Learning Path

### Beginner (Just want to use it)
1. QUICKSTART.md (5 min)
2. Run locally and test
3. Review FULLSTACK_README.md for features

### Intermediate (Want to understand it)
1. QUICKSTART.md (5 min)
2. SETUP_GUIDE.md (15 min)
3. IMPLEMENTATION_SUMMARY.md (10 min)
4. Review code files

### Advanced (Want to modify/extend)
1. All documents above
2. IMPLEMENTATION_SUMMARY.md Section: "Architecture Decisions"
3. Review source code
4. Check inline code comments

### DevOps/Deployment
1. SETUP_GUIDE.md (understand system)
2. DEPLOYMENT_NOTES.md (deploy guide)
3. Vercel documentation
4. Supabase documentation

---

## Key Concepts

### Authentication
- User signs up → Profile created → Can login → Gets JWT token → Access protected routes
- Token stored in HTTP-only cookie for security
- Auth context provides state to components

### Authorization
- Each user has a `role` (USER or ADMIN)
- Routes check role before allowing access
- API endpoints validate role before executing

### Database
- Supabase PostgreSQL for storage
- RLS (Row Level Security) for protection
- Profiles table for user data
- Indexes for performance

### API Routes
- All API routes validate input with Zod
- All API routes check authentication
- Admin routes check user role
- Responses include error messages

---

## Common Workflows

### Create a New Admin User
```bash
1. Visit Supabase dashboard
2. Open SQL Editor
3. Run: UPDATE public.profiles SET role='ADMIN' WHERE email='user@example.com';
```

### Add a New API Endpoint
```bash
1. Create file in app/api/
2. Import auth context checker (in API route)
3. Validate input with Zod
4. Implement logic
5. Return response with proper status codes
```

### Add a New Protected Page
```bash
1. Create file in app/page-name/page.tsx
2. Use useAuth() hook
3. Check isAuthenticated and redirect if needed
4. Display content based on role
```

### Customize Admin Dashboard
```bash
1. Edit app/admin/dashboard/page.tsx
2. Add new statistics or sections
3. Create new API endpoints if needed
4. Test with admin account
```

---

## Troubleshooting Guide

### Setup Issues
- See QUICKSTART.md "Troubleshooting" section
- Check environment variables are set
- Verify database schema is created

### Deployment Issues
- See DEPLOYMENT_NOTES.md "Common Production Issues"
- Check Vercel logs
- Verify environment variables in Vercel dashboard

### Feature Issues
- Check browser console for errors
- Check Vercel/backend logs
- Review SETUP_GUIDE.md for endpoint documentation

---

## Resources

### Official Documentation
- [Supabase](https://supabase.com/docs) - Backend/Auth
- [Next.js](https://nextjs.org/docs) - Framework
- [Vercel](https://vercel.com/docs) - Deployment
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling
- [Zod](https://zod.dev) - Validation

### Related Tools
- [shadcn/ui](https://ui.shadcn.com) - UI Components
- [Lucide React](https://lucide.dev) - Icons
- [Framer Motion](https://www.framer.com/motion) - Animations

---

## Support

### Getting Help
1. **Check documentation** - Answer might be here
2. **Review code comments** - Implementation details
3. **Check error messages** - Often indicate the issue
4. **Check official docs** - Framework/library docs
5. **Search online** - Common issues are documented

### Resources
- This documentation (5 files)
- Inline code comments
- Official framework documentation
- Community forums

### When to Ask for Help
- After checking documentation
- With specific error messages
- With reproduction steps
- With context about what you're trying to do

---

## Document Maintenance

**Last Updated**: April 2024
**Version**: 1.0
**Maintained By**: Development Team

If you find outdated information, please:
1. Note the section and issue
2. Check if code has changed
3. Report via your team's process

---

## Next Steps

### Ready to start?
→ Go to **[QUICKSTART.md](./QUICKSTART.md)**

### Want complete details?
→ Go to **[SETUP_GUIDE.md](./SETUP_GUIDE.md)**

### Deploying soon?
→ Go to **[DEPLOYMENT_NOTES.md](./DEPLOYMENT_NOTES.md)**

### Want overview?
→ Go to **[FULLSTACK_README.md](./FULLSTACK_README.md)**

---

**Happy coding!** 🚀
