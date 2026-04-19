# Complete Checkout, Orders, and Admin Implementation Guide

## What Has Been Implemented

### 1. Core Infrastructure

**Updated Types** (`lib/types.ts`):
- `Order` interface with status tracking
- `KYCDocument` interface for ID verification
- `MetalRateOverride` interface for admin rate management

**Database Functions** (`lib/db.ts`):
- `createOrder()` - Save orders to database
- `getUserOrders()` - Fetch user's order history
- `updateOrderStatus()` - Admin can update order status
- `uploadKYCDocument()` - Upload ID documents for verification
- `getUserKYCDocuments()` - Fetch user's KYC docs
- `getAllOrders()` - Admin view all orders
- `setMetalRateOverride()` - Override metal rates
- `getMetalRateOverrides()` - Get active overrides

### 2. Shopping Cart System

**Cart Context** (`lib/cart-context.tsx`):
- Real-time pricing calculation using live metal rates
- LocalStorage persistence
- Reactive to rate changes
- Functions: `addItem()`, `removeItem()`, `updateQuantity()`, `clearCart()`

**Cart Sheet Component** (`components/cart-sheet.tsx`):
- Slide-out sheet with Framer Motion animations
- Real-time price updates with fade animations
- Quantity adjusters
- Cart summary with subtotal, GST, total
- Quick checkout button

### 3. 3-Step Checkout Flow

**Checkout Page** (`app/checkout/page.tsx`):

**Step 1 - Address Collection**:
- Phone, address, city, state, pincode validation
- 10-digit phone validation
- 6-digit pincode validation
- Error messages with visual feedback

**Step 2 - Order Review**:
- Review shipping address
- Review all items in cart
- Review order total
- Back button to modify

**Step 3 - Payment (Mock Razorpay)**:
- Mock Razorpay UI
- Payment method selection
- Process order button
- "Order Confirmed" gallery view after success

**Order Confirmation**:
- Success animation with checkmark
- Order ID display
- Items count and total amount
- Shipping details
- Links to view order and continue shopping

### 4. Enhanced Orders Page

**My Orders** (`app/orders/page.tsx`):
- Displays user's complete order history
- Status badges (PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- Status icons for visual clarity
- Order date, amount, city, payment method
- Shipping address display
- View Details button for each order

### 5. Updated Navigation

**Cart Integration** (`components/layout/Navigation.tsx`):
- Cart icon now opens sheet instead of linking to page
- Real-time item count badge
- CartSheet component integration
- Mobile and desktop support

### 6. Layout Updates

**Root Layout** (`app/layout.tsx`):
- CartProvider wrapped around entire app
- Enables cart context access everywhere

## SQL Tables Required

```sql
-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  items JSONB NOT NULL,
  subtotal DECIMAL NOT NULL,
  gst DECIMAL NOT NULL,
  total DECIMAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'PROCESSING',
  shipping_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  phone TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  razorpay_order_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- KYC Documents table
CREATE TABLE kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  document_type TEXT NOT NULL,
  document_url TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING',
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Metal Rate Overrides table
CREATE TABLE metal_rate_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metal_type TEXT NOT NULL,
  purity TEXT NOT NULL,
  custom_rate DECIMAL NOT NULL,
  reason TEXT,
  set_by_admin_id UUID NOT NULL,
  effective_from TIMESTAMP NOT NULL,
  effective_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Routes Still to Create

### Checkout/Orders APIs:
- `POST /api/checkout` - Create order from cart
- `GET /api/orders` - Get user's orders
- `PATCH /api/orders/[id]/status` - Admin update status

### KYC APIs:
- `POST /api/kyc/upload` - Upload document
- `GET /api/kyc/documents` - Get documents
- `PATCH /api/kyc/verify` - Admin verify documents

### Admin APIs:
- `GET /api/admin/orders` - Get all orders
- `POST /api/admin/rates/override` - Set rate override
- `GET /api/admin/rates/overrides` - Get overrides

## Remaining Tasks

### 1. Complete Admin Dashboard Enhancement
- Product management (Add/Edit/Delete)
- Product image upload to Supabase Storage
- Order status management UI
- Metal rate override UI with form
- Dashboard stats (total sales, orders, etc.)

### 2. Profile Page Enhancements
- KYC Module integration
- Conditional KYC requirement (orders > ₹200,000)
- Document upload UI
- Wishlist display in profile tabs

### 3. Mobile Bottom Navigation Bar
- Home, Shop, Vault, Profile links
- Fixed at bottom on mobile only
- Conditional display based on screen size

### 4. Page Transitions
- Framer Motion page variants
- Smooth transitions on all pages
- Page exit animations

### 5. SEO Metadata
- Per-page metadata.ts files
- Open Graph tags
- Twitter card tags
- Canonical URLs

## Integration Checklist

- [ ] Create SQL tables in Supabase
- [ ] Create checkout API route
- [ ] Create orders API routes
- [ ] Create KYC API routes
- [ ] Create admin API routes
- [ ] Enhance admin dashboard
- [ ] Add mobile bottom nav
- [ ] Add page transitions
- [ ] Add SEO metadata
- [ ] Test complete checkout flow
- [ ] Test admin functions
- [ ] Test KYC upload

## Testing the Checkout Flow

1. Navigate to any product
2. Click product to open PDP
3. Click "Add to Cart"
4. Click cart icon in header
5. Click "Proceed to Checkout"
6. Fill in address details
7. Click "Continue to Review"
8. Verify order details
9. Click "Continue to Payment"
10. Click "Pay" button
11. See "Order Confirmed" page
12. Click "View Order" to see in My Orders

## Important Notes

- Cart data persists in localStorage between sessions
- Prices update in real-time when metal rates change
- Order status can only be updated by admins
- KYC verification is optional but needed for high-value orders
- Metal rate overrides supersede live rates when active
- All dates use ISO 8601 format for consistency

