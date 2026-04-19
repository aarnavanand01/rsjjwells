# Product Detail Page (PDP) Guide

## Overview

The Product Detail Page is the primary sales interface where customers view detailed product information, calculate final prices, add items to cart/wishlist, check delivery availability, and verify product authenticity.

## Page Structure

### URL
- Route: `/product/[id]`
- Example: `/product/uuid-123-abc`

### Layout

```
┌─────────────────────────────────────────┐
│  ← Back Button                          │
├───────────────────┬─────────────────────┤
│                   │                     │
│  Image Gallery    │  Product Info       │
│  (with Zoom)      │  Price & Breakdown  │
│                   │  Quantity Selector  │
│  Thumbnails       │  Add to Cart/List   │
│                   │                     │
├─────────────────────────────────────────┤
│  Delivery Check  │  BIS Certificate    │
├─────────────────────────────────────────┤
```

## Features

### 1. Image Gallery (Left Side)
- **Main Image**: Large, high-quality product image
- **Zoom Feature**: Click to open zoom modal with full image
- **Zoom Modal**: Black background, click outside to close
- **Thumbnails**: Multiple product images as thumbnails
- **Navigation**: Click thumbnail to switch main image
- **Responsive**: Adjusts size on mobile/tablet/desktop

### 2. Product Information (Right Side)
- **Category & Purity**: "Gold • 22K" badge
- **Product Name**: Large serif typography
- **Description**: Detailed product description
- **Price Display**: Large, prominent final price
- **Dynamic Updates**: Price recalculates when metal rates change
- **Weight Info**: Shows product weight in grams

### 3. Price Breakdown
- **Accordion Component**: Collapsible section
- **Metal Price**: Weight × Rate = Metal Cost
- **Making Charge**: Fixed per-product charge
- **Subtotal**: Metal + Making Charge
- **GST (3%)**: Tax calculation
- **Final Price**: Subtotal + GST
- **Formula Displayed**: Shows exact calculation method

### 4. Quantity Selector
- **Minus Button**: Decrements quantity (min: 1)
- **Input Field**: Direct quantity entry
- **Plus Button**: Increments quantity
- **Validation**: Prevents negative quantities

### 5. Action Buttons
- **Add to Cart**: 
  - Requires authentication (redirects to login if not)
  - Shows loading state while processing
  - Success message appears for 3 seconds
  - Uses API: `POST /api/cart`

- **Add to Wishlist**: 
  - Heart icon button
  - Toggles filled/unfilled heart
  - Same auth check as cart
  - Uses API: `POST /api/wishlist`

### 6. Stock Status Alert
- Shows "Out of Stock" warning in red if unavailable
- Displayed prominently below action buttons

### 7. Trust Features Section (Bottom)

#### Delivery Checker
- **Input**: 6-digit pincode field
- **Check Button**: Validates pincode format
- **Validation**: Must be exactly 6 digits
- **Mock Data**: Generates random 3-7 day estimate
- **Result Card**: Green background, shows estimated delivery date
- **Error Handling**: Shows message if pincode invalid

#### BIS Certificate Card
- **Badge**: Award icon with BIS Hallmarked title
- **Features Listed**:
  - Certified Quality with authenticity certificate
  - 30-Day Return Policy
  - Secure Payment (encrypted transactions)
- **Visual Design**: Blue background for trust
- **Icons**: Checkmark bullets for each feature

## Database Integration

### Cart Operations
**Add to Cart**: `POST /api/cart`
```typescript
{
  userId: string,
  productId: string,
  quantity: number
}
```

Creates/Updates in `cart_items` table:
- `id`: UUID
- `user_id`: User's UUID
- `product_id`: Product's UUID
- `quantity`: Number of items
- `added_at`: Timestamp

**Get Cart**: `GET /api/cart?userId=UUID`

**Remove from Cart**: `DELETE /api/cart/[id]`

### Wishlist Operations
**Add to Wishlist**: `POST /api/wishlist`
```typescript
{
  userId: string,
  productId: string
}
```

Creates in `wishlist_items` table:
- `id`: UUID
- `user_id`: User's UUID
- `product_id`: Product's UUID
- `added_at`: Timestamp

**Get Wishlist**: `GET /api/wishlist?userId=UUID`

**Remove from Wishlist**: `DELETE /api/wishlist?itemId=UUID`

### Product Data
Fetches from `products` table via Supabase:
```typescript
{
  id: string,
  name: string,
  description: string,
  category: 'Gold' | 'Diamond' | 'Silver' | 'Digital Gold',
  purity: '24K' | '22K' | '18K' | 'Sterling',
  weight: number,
  making_charge: number,
  base_price: number,
  images: string[],
  in_stock: boolean,
  featured: boolean
}
```

## Pricing Logic

### Real-time Price Calculation
1. **Fetch metal rate** from `useLiveRates()` hook
2. **Match by category & purity**
   - Category: Gold, Diamond, Silver, etc.
   - Purity: 24K, 22K, 18K, Sterling
3. **Calculate using `calculateJewelryPrice()`**:
   ```
   metalCost = weight × rate
   subtotal = metalCost + makingCharge
   gst = subtotal × 0.03
   finalPrice = subtotal + gst
   ```
4. **Display with fade animation** when rate changes

### Example Calculation
```
Product: 22K Gold Ring, 10g, ₹500 making charge
Current Rate: ₹5,950/g

Metal Cost: 10g × ₹5,950 = ₹59,500
Making Charge: ₹500
Subtotal: ₹60,000
GST (3%): ₹1,800
Final Price: ₹61,800
```

## API Endpoints Used

### GET /product/[id]
- Queries `products` table
- Returns full product details
- Handles 404 if not found

### POST /api/cart
- Adds item to user's cart
- Checks if already exists (updates quantity)
- Returns cart item object

### POST /api/wishlist
- Adds item to user's wishlist
- Prevents duplicates
- Returns wishlist item object

### GET /api/wishlist?userId=...
- Fetches all user's wishlist items
- Used to check if current product is wishlisted

## Authentication & Authorization

- **Page Access**: Public (no auth required to view)
- **Add to Cart**: Requires authentication
  - Redirects to `/auth/login` if not authenticated
  - Stores redirect URL for return after login
- **Add to Wishlist**: Requires authentication
  - Same behavior as cart

## State Management

Uses React hooks:
- `useState`: Product, loading, image, quantity, messages
- `useEffect`: Load product, check wishlist status
- `useRouter`: Navigation and redirects
- `useAuth()`: User authentication state
- `useLiveRates()`: Metal rates subscription

## Animations

**Framer Motion** for smooth UX:
- Page load: Fade in + slide from sides
- Price updates: Fade animation when rates change
- Section reveals: Staggered reveals on scroll
- Trust features: Slide in from bottom

## Error Handling

- **Product not found**: Shows message with "Back to Shop" button
- **Network errors**: Displays user-friendly error messages
- **Cart errors**: Shows toast notification with error
- **Wishlist errors**: Alert message in red
- **Loading states**: Skeleton or loading indicator

## Performance Optimizations

- **Image optimization**: Uses next/image where possible
- **Lazy loading**: Thumbnail images load on demand
- **Memoization**: useCallback for event handlers
- **Real-time rates**: Debounced subscription updates
- **Responsive design**: CSS media queries for mobile

## Mobile Responsiveness

- **Stack layout**: Vertical on mobile (image top, info bottom)
- **Grid layout**: Horizontal on desktop (2-column)
- **Touch-friendly**: Large buttons and inputs
- **Tap targets**: 48px minimum for accessibility
- **Image scaling**: Responsive gallery on all sizes

## Accessibility

- **Alt text**: All images have descriptive alt text
- **Keyboard navigation**: All buttons keyboard accessible
- **Color contrast**: Sufficient contrast ratios
- **Semantic HTML**: Proper heading hierarchy
- **ARIA labels**: Form labels properly associated

## Testing Scenarios

1. **Load product details**
   - Verify all product info displays
   - Check images load correctly
   - Confirm price calculates accurately

2. **Add to cart**
   - Verify quantity updates correctly
   - Check cart API response
   - Confirm success message shows

3. **Add to wishlist**
   - Heart icon toggles
   - Wishlist status persists
   - Multiple wishlist items work

4. **Delivery check**
   - Valid pincode shows estimate
   - Invalid pincode shows error
   - Format validation works

5. **Price reactivity**
   - Change metal rates in Supabase
   - Verify prices update instantly
   - Check animation plays

6. **Authentication flow**
   - Redirect to login when needed
   - Return to PDP after login
   - Cart/wishlist saved after auth

## Future Enhancements

- Similar products carousel
- Customer reviews section
- Personalized recommendations
- Size/fit guides
- Video product walkthrough
- AR try-on feature (advanced)
- Bulk order pricing
- Gift wrapping options
