# RSJ Jewelers - Production Setup Guide

## Overview
This guide covers all the setup required to run the RSJ Jewelers e-commerce platform in production.

## Prerequisites
- Node.js 18+
- PostgreSQL database (or Supabase)
- Razorpay account for payments
- Vercel account for deployment

## Step 1: Database Setup

### Option A: Supabase (Recommended)
1. Create a Supabase project at https://supabase.com
2. Copy your project URL and API keys
3. Run the migration script:
   ```bash
   # Copy the SQL from scripts/01-schema.sql
   # Go to SQL Editor in Supabase dashboard
   # Paste and execute the entire script
   ```

### Option B: PostgreSQL
1. Create a new PostgreSQL database
2. Run migrations:
   ```bash
   psql -U postgres -d your_db < scripts/01-schema.sql
   ```

## Step 2: Environment Variables

Create a `.env.local` file with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Razorpay (Optional - for payment processing)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Application
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

## Step 3: Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run locally to test
npm run dev
```

## Step 4: Features Configuration

### Live Metal Rates
- Metal rates are stored in the `metal_rates` table
- Rates update in real-time via Supabase subscriptions
- Admin can manually update rates via `/admin/dashboard`
- Rates are automatically applied to product pricing

### Cart Management
- Uses localStorage for client-side cart
- Syncs with database via `/api/cart` endpoints
- Supports add/remove/update quantity operations

### Digital Gold Wallet
- Users can buy digital gold at `/digital-gold`
- Live rate conversion (₹ to grams)
- Wallet balance stored in `profiles.digital_gold_balance`
- All transactions logged in `gold_transactions` table

### Order Processing
- Checkout at `/checkout`
- Orders saved in `orders` and `order_items` tables
- Payment integration with Razorpay (via `/api/payments`)
- Order status tracking (PENDING → PROCESSING → SHIPPED → DELIVERED)

### Admin Dashboard
- Access at `/admin/dashboard` (requires ADMIN role)
- Features:
  - View all users and their statistics
  - Manage user roles
  - Delete users
  - Update product inventory
  - Manage metal rates

## Step 5: API Endpoints Reference

### Metal Rates
- `GET /api/metal-rates` - Get all active rates
- `POST /api/metal-rates` - Add new rate (admin)

### Products
- `GET /api/products` - List products with filters
- `GET /api/products?id=<id>` - Get single product
- `POST /api/products` - Create product (admin)

### Cart
- `GET /api/cart?userId=<id>` - Get user cart
- `POST /api/cart` - Add item to cart
- `PATCH /api/cart` - Update cart item
- `DELETE /api/cart?id=<id>` - Remove from cart

### Orders
- `GET /api/orders?userId=<id>` - Get user orders
- `GET /api/orders?orderId=<id>` - Get single order
- `POST /api/orders` - Create order
- `PATCH /api/orders` - Update order status

### Digital Gold
- `GET /api/digital-gold?userId=<id>` - Get wallet
- `POST /api/digital-gold` - Buy digital gold

### Payments
- `POST /api/payments` - Create payment order
- `PATCH /api/payments` - Verify payment

## Step 6: Deployment to Vercel

```bash
# Push code to GitHub
git add .
git commit -m "Ready for production"
git push origin main

# Import project in Vercel dashboard
# Add environment variables in Vercel Settings
# Deploy
```

## Step 7: Testing Checklist

- [ ] User registration and login works
- [ ] Products load with live rates
- [ ] Add to cart functionality works
- [ ] Checkout flow completes
- [ ] Digital gold purchase works
- [ ] Orders are saved correctly
- [ ] Admin dashboard accessible and functional
- [ ] Metal rates update in real-time
- [ ] Wishlist works
- [ ] Search and filters work

## Step 8: Production Optimization

### Performance
- Images are optimized with Next.js Image component
- Database queries use indexes
- Real-time subscriptions use RLS for security
- Caching headers configured

### Security
- Row-Level Security (RLS) enabled on all tables
- Authentication required for protected routes
- Environment variables for sensitive data
- CORS properly configured

### Monitoring
- Set up error tracking (Sentry recommended)
- Monitor database performance
- Track API response times
- Set up uptime monitoring

## Step 9: Maintenance

### Regular Tasks
- Monitor database storage usage
- Review user activity logs
- Update metal rates regularly
- Backup database daily

### Admin Operations
- Update product inventory
- Manage returns/refunds
- Monitor payment transactions
- Handle customer support

## Troubleshooting

### Database Connection Issues
```bash
# Test Supabase connection
npx supabase test
```

### Missing Environment Variables
- Double-check all variables are set in `.env.local`
- Restart dev server after adding variables

### Metal Rates Not Updating
- Verify Supabase real-time is enabled
- Check browser console for errors
- Manually refresh rates via admin dashboard

### Payment Integration Not Working
- Verify Razorpay credentials
- Check webhook URLs in Razorpay dashboard
- Test with Razorpay test keys first

## Support

For issues or questions, refer to:
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Razorpay Docs: https://razorpay.com/docs
