# RSJ Jewelers - Full-Stack Application

A complete production-ready Next.js full-stack application with Supabase authentication, role-based access control, admin dashboard, and user management system.

## What's Included

### Authentication System ✓
- User signup and registration
- Secure login with JWT tokens
- Password hashing via Supabase Auth
- Automatic logout functionality
- Session persistence with HTTP-only cookies

### Role-Based Access Control ✓
- Two user roles: USER and ADMIN
- Route-level protection with middleware
- API-level authorization checks
- Granular permission system

### User Dashboard ✓
- Profile information display
- Digital gold balance management
- Quick action links
- Personal account settings

### Admin Dashboard ✓
- User management interface
- System statistics
- User role management (promote/demote)
- User deletion capabilities
- Search and filter functionality

### Database Integration ✓
- Supabase PostgreSQL with RLS
- User profile management
- Clean database schema
- Optimized queries with indexes

### Security Features ✓
- Input validation with Zod
- Authentication on protected routes
- Authorization checks on sensitive operations
- HTTP-only cookie storage
- Database Row-Level Security (RLS)

## Quick Start

### 1. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 2. Set Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### 3. Setup Database
Run schema from `SETUP_GUIDE.md` in Supabase SQL Editor

### 4. Start Development Server
```bash
npm run dev
```

### 5. Visit Application
Open http://localhost:3000

## Documentation

### Getting Started
- **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute setup guide
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup instructions

### Development
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - What was built
- This file - Overview and features

### Deployment
- **[DEPLOYMENT_NOTES.md](./DEPLOYMENT_NOTES.md)** - Production deployment guide

## Project Structure

```
app/
├── api/                    # API routes
│   ├── auth/              # Authentication endpoints
│   │   ├── signup/
│   │   ├── login/
│   │   └── logout/
│   └── users/             # User management endpoints
│       ├── route.ts
│       └── [id]/route.ts
├── auth/                   # Auth pages
│   ├── login/
│   └── signup/
├── dashboard/              # User dashboard
├── admin/                  # Admin features
│   ├── dashboard/
│   └── add-product/
├── profile/                # Profile settings
├── orders/                 # Order history
├── wishlist/              # Wishlist
└── layout.tsx             # Root layout

lib/
├── auth-context.tsx       # Auth state management
├── db.ts                  # Database utilities
├── supabase.ts           # Supabase client
├── validators.ts         # Zod validation schemas
└── types.ts             # TypeScript interfaces

components/
├── ui/                    # shadcn/ui components
└── layout/               # Layout components
    └── Navigation.tsx    # Header with auth menu
```

## Key Features

### Authentication Flow
```
User → Signup/Login → Supabase Auth → Profile Created → JWT Token → Protected Access
```

### Role-Based Access
```
- USER Role: Can access dashboard, profile, orders, wishlist
- ADMIN Role: All user access + admin dashboard + user management
```

### API Protection
```
Request → Middleware Check → Auth Validation → Role Check → Execute → Response
```

## Database Schema

### Profiles Table
```sql
- id (UUID) - Primary key, FK to auth.users
- email (TEXT) - Unique, required
- full_name (TEXT) - User's full name
- avatar_url (TEXT) - Profile picture URL
- role (TEXT) - 'USER' or 'ADMIN'
- digital_gold_balance (NUMERIC) - Holdings in grams
- created_at (TIMESTAMP) - Account creation date
- updated_at (TIMESTAMP) - Last update timestamp
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### User Management
- `GET /api/users` - Get all users (admin)
- `GET /api/users/[id]` - Get user profile
- `PATCH /api/users/[id]` - Update role (admin)
- `DELETE /api/users/[id]` - Delete user (admin)

## Testing Features

### User Flow
1. Go to `/auth/signup`
2. Create account with email
3. Login at `/auth/login`
4. View dashboard at `/dashboard`
5. Manage profile at `/profile`

### Admin Flow
1. Promote user to admin (via database)
2. Login as admin user
3. Access `/admin/dashboard`
4. Manage users, change roles, delete accounts

## Technology Stack

### Frontend
- **Next.js 13+** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons
- **Framer Motion** - Animations

### Backend
- **Next.js API Routes** - Serverless functions
- **Supabase** - Backend as a Service
- **PostgreSQL** - Database

### Authentication & Validation
- **Supabase Auth** - Authentication service
- **Zod** - Runtime type checking

## Features in Detail

### User Authentication
- Email/password signup
- Secure password hashing
- Email confirmation (configurable)
- JWT-based sessions
- Automatic token refresh (via Supabase)

### User Dashboard
- Profile information
- Digital gold balance display
- Quick navigation links
- Account settings access
- Logout functionality

### Admin Panel
- User statistics (total, admins, regular)
- User management table
- Search users by name/email
- Change user roles
- Delete user accounts
- Confirmation dialogs

### Navigation
- Dynamic auth dropdown
- Role-based menu items
- Mobile responsive
- Quick access to dashboards
- Sign out button

## Security Considerations

### Implemented
- HTTP-only cookies (no XSS attack surface)
- Server-side JWT validation
- Database Row-Level Security
- Input validation with Zod
- HTTPS in production
- Admin-only API endpoints

### Recommended for Production
- Rate limiting on auth endpoints
- Email verification required
- CSRF protection on forms
- Database backups
- Error logging/monitoring
- Audit trails for admin actions

## Performance

### Optimizations
- Middleware-level route protection (fast)
- Auth context caching (no unnecessary re-fetches)
- Database indexes on common queries
- Image optimization
- Code splitting by route

### Expected Metrics
- Home page: < 1s
- Dashboard: < 1.5s (after login)
- Admin panel: < 2s (data-heavy, first load)

## Deployment

### To Vercel
1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy with one click

### To Other Platforms
- Works with any Node.js host
- Database migrations needed
- Environment variables required

## Support & Troubleshooting

### Common Issues
- **"Unauthorized" error**: Check auth token in cookies
- **Database connection**: Verify Supabase credentials
- **Signup fails**: Check database schema is created
- **Admin panel inaccessible**: User role must be 'ADMIN'

### Documentation
- See `SETUP_GUIDE.md` for detailed setup
- See `QUICKSTART.md` for quick reference
- See `DEPLOYMENT_NOTES.md` for production guide

## Roadmap

### Planned Features
- Shopping cart and checkout
- Order management
- Product reviews and ratings
- Email notifications
- Payment processing
- Inventory management
- Search and filtering

### Future Enhancements
- Two-factor authentication
- OAuth integration (Google, Apple)
- Social features (wishlists sharing)
- Analytics dashboard
- Customer support system

## Contributing

When adding features:
1. Follow existing code structure
2. Add TypeScript types
3. Use Zod for validation
4. Add database migrations
5. Update documentation
6. Test thoroughly

## License

Proprietary - RSJ Jewelers

## Support

For issues or questions:
1. Check documentation files
2. Review Supabase docs
3. Check browser console for errors
4. Check server logs via Vercel

---

## Getting Help

### Documentation Files
- `QUICKSTART.md` - Get started in 5 minutes
- `SETUP_GUIDE.md` - Complete setup guide
- `IMPLEMENTATION_SUMMARY.md` - Technical details
- `DEPLOYMENT_NOTES.md` - Production guide

### Resources
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Status**: Production Ready ✓

**Last Updated**: 2024

**Version**: 1.0.0
