# RSJ Jewelers - Dynamic Pricing Engine Documentation

## Overview

The jewelry pricing engine is a reactive, real-time system that calculates product prices based on live metal market rates. This ensures complete transparency and fair pricing for all customers.

## The Pricing Formula

```
Final Price = (Metal Rate × Weight) + Making Charges + 3% GST
```

### Example Calculation

**Product:** 22K Gold Ring
- **Weight:** 10 grams
- **Current Metal Rate:** ₹5,000/gram
- **Making Charges:** ₹500

**Step-by-step:**
1. Metal Cost = 10g × ₹5,000 = ₹50,000
2. Subtotal = ₹50,000 + ₹500 = ₹50,500
3. GST (3%) = ₹50,500 × 0.03 = ₹1,515
4. **Final Price = ₹50,500 + ₹1,515 = ₹52,015**

## Implementation

### Files Involved

1. **`lib/pricing.ts`** - Core pricing utility functions
   - `calculateJewelryPrice()` - Main calculation engine
   - `calculateProductPrice()` - Product-specific pricing
   - `formatPrice()` - Price formatting with locale support

2. **`components/product-card.tsx`** - Enhanced product card with dynamic pricing
   - Uses `useLiveRates` hook to fetch current metal rates
   - Implements fade animation when prices update
   - Real-time reactive updates

3. **`hooks/use-live-rates.ts`** - Real-time metal rate subscription
   - Fetches rates from Supabase `metal_rates` table
   - Subscribes to real-time updates
   - Simulates market fluctuations (updates every 60 seconds)

### Metal Rates Table Schema

```sql
CREATE TABLE metal_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metal VARCHAR(50),        -- "Gold", "Silver", "Diamond", etc.
  purity VARCHAR(20),       -- "24K", "22K", "18K", "Sterling", etc.
  price DECIMAL(10, 2),     -- Current price per gram
  previous_price DECIMAL(10, 2),
  change_percent DECIMAL(5, 2),
  trend VARCHAR(10),        -- "up", "down", "neutral"
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Key Features

### 1. Real-Time Reactivity
When metal rates update in Supabase, all product prices update instantly across the entire app with a subtle fade animation.

**How it works:**
- `useLiveRates` hook subscribes to real-time changes in the `metal_rates` table
- When a rate is updated, the hook immediately updates state
- `ProductCard` component detects the change and triggers a fade animation
- Prices recalculate and display the new value

### 2. Category-Specific Pricing
Different product categories use different metal types:
- **Gold:** 24K, 22K, or 18K purity
- **Diamond:** Clarity-based pricing (VVS1, VVS2, VS1, VS2)
- **Silver:** Sterling (92.5%), 95%, or other standards

### 3. Fallback Mechanism
If a metal rate is unavailable or invalid:
- System falls back to the product's base price
- Ensures prices are always displayed (no broken displays)
- Transparent communication with customers

## Usage in Components

### Basic Usage
```tsx
import { calculateProductPrice, formatPrice } from '@/lib/pricing';
import { useLiveRates } from '@/hooks/use-live-rates';

function MyComponent() {
  const { rates } = useLiveRates();

  const price = calculateProductPrice(
    weight: 15,              // grams
    makingCharge: 800,       // rupees
    rates,                   // from useLiveRates
    'Gold',                  // category
    '22K',                   // purity
    basePrice: 100000        // fallback
  );

  return <p>{formatPrice(price)}</p>;
}
```

### Detailed Pricing Breakdown
```tsx
import { calculateJewelryPrice } from '@/lib/pricing';

const breakdown = calculateJewelryPrice({
  weight: 10,
  makingCharge: 500,
  metalRate: 5000,
  basePrice: 50000
});

console.log(`Metal Cost: ${breakdown.metalCost}`);     // ₹50,000
console.log(`Making Charge: ${breakdown.makingCharge}`); // ₹500
console.log(`Subtotal: ${breakdown.subtotal}`);       // ₹50,500
console.log(`GST: ${breakdown.gst}`);                 // ₹1,515
console.log(`Final Price: ${breakdown.finalPrice}`);  // ₹52,015
```

## Animation Implementation

When a price changes, a subtle fade animation occurs:

```tsx
<motion.p
  key={currentPrice}
  initial={isAnimating ? { opacity: 0 } : { opacity: 1 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
  className="font-bold text-[#C5A059] text-xl tracking-tight"
>
  {formatPrice(currentPrice)}
</motion.p>
```

This creates a smooth visual transition when prices update, ensuring customers notice the change without jarring displays.

## Testing the Pricing Engine

### Manual Test Scenario
1. Go to `/gold` page
2. Note the displayed prices
3. Update a rate in Supabase:
   ```sql
   UPDATE metal_rates 
   SET price = price + 100 
   WHERE metal = 'Gold' AND purity = '24K';
   ```
4. Observe prices update automatically with fade animation

### Edge Cases Handled
- ✅ Missing metal rates → Falls back to base price
- ✅ Zero or negative rates → Falls back to base price
- ✅ Zero weight products → Price on Request
- ✅ Decimal precision → Rounded to 2 decimals
- ✅ Locale-specific formatting → Indian numbering system

## Performance Optimization

### 1. Subscription Management
- Real-time subscriptions only active when component is mounted
- Unsubscribes when component unmounts to prevent memory leaks
- Single subscription per `useLiveRates` hook instance

### 2. Memoization
- Rates are cached in component state
- Prices only recalculate when rates actually change
- Prevents unnecessary re-renders

### 3. Mock Data Updates
- Simulation of market fluctuations every 60 seconds
- Realistic price changes (-0.5% to +0.5%)
- Helps test reactivity without manual database updates

## Future Enhancements

1. **Historical Price Charts** - Show price trends over time
2. **Price Alerts** - Notify customers when prices reach target levels
3. **Bulk Pricing** - Special rates for wholesale orders
4. **Multiple Currencies** - Support for international customers
5. **Custom Metal Blends** - User-defined alloy combinations

## Troubleshooting

### Prices Not Updating?
- Check if Supabase subscription is active in browser console
- Verify `metal_rates` table has entries
- Ensure component is using `useLiveRates` hook

### Incorrect Calculations?
- Verify weight and making charge values in product database
- Check metal rates are positive numbers
- Ensure GST is always calculated as 3% of subtotal

### Animation Not Working?
- Confirm Framer Motion is installed: `npm list framer-motion`
- Check animation dependencies in `motion.p` component
- Verify duration matches transition timing (0.3s)

## Support

For pricing engine issues or questions, refer to:
- `lib/pricing.ts` - Core logic with detailed comments
- `components/product-card.tsx` - Component implementation
- `hooks/use-live-rates.ts` - Real-time data fetching
