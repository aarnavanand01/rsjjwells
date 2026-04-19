# Digital Gold Vault Guide

## Overview

The Digital Gold Vault is a premium feature that allows users to buy and hold digital gold backed by real-time market rates. All transactions are logged in the database for transparency and record-keeping.

## Features

### 1. Luxury Vault UI
- **Balance Display**: Shows total grams of digital gold held
- **Current Rate**: Live 24K gold rate from Supabase
- **Market Indicator**: Shows trend (up/down) with percentage change
- **Quick Amount Buttons**: Pre-set amounts (₹10k, ₹25k, ₹50k, ₹100k)

### 2. Live Converter
- **Input**: Amount in rupees (₹)
- **Output**: Calculated grams based on real-time 24K rate
- **Formula**: `Grams = Amount ÷ (Rate per gram)`
- **Real-time**: Updates instantly as user types
- **Disabled State**: Shows message if rate data is loading

### 3. Buy Now Flow
- **Form Validation**: Ensures amount > 0
- **Database Update**: 
  - Creates transaction record in `gold_transactions` table
  - Updates user's `digital_gold_balance` in `profiles` table
- **Transaction Fields**:
  - `user_id`: User making the purchase
  - `amount_inr`: Amount in rupees
  - `grams_received`: Calculated grams
  - `rate_applied`: 24K rate used at purchase time
  - `transaction_type`: 'BUY' | 'SELL' | 'TRANSFER'
  - `status`: 'COMPLETED' | 'PENDING' | 'FAILED'
  - `created_at`: Transaction timestamp

### 4. Transaction History
- Shows all past transactions
- Displays date, grams, and amount for each
- Ordered chronologically (newest first)
- Syncs with Supabase in real-time

## API Endpoints

### POST /api/digital-gold/buy
**Purchase digital gold**

Request:
```json
{
  "userId": "string",
  "amountInr": 25000,
  "gramsToReceive": 4.2,
  "rateApplied": 5950
}
```

Response:
```json
{
  "success": true,
  "transaction": { /* transaction object */ },
  "newBalance": 10.5
}
```

### GET /api/digital-gold/transactions
**Fetch user's transaction history**

Query Parameters:
- `userId`: User ID (required)

Response:
```json
[
  {
    "id": "uuid",
    "user_id": "string",
    "amount_inr": 25000,
    "grams_received": 4.2,
    "rate_applied": 5950,
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

## Database Schema

### gold_transactions Table
```sql
CREATE TABLE gold_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  amount_inr DECIMAL NOT NULL,
  grams_received DECIMAL NOT NULL,
  transaction_type TEXT CHECK (transaction_type IN ('BUY', 'SELL', 'TRANSFER')),
  status TEXT CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
  rate_applied DECIMAL NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Usage Flow

1. **User navigates to `/digital-gold`**
   - Vault UI displays current balance from `profiles.digital_gold_balance`
   - Current 24K rate shown from `useLiveRates` hook

2. **User enters amount**
   - Real-time conversion calculates grams
   - Formula: `grams = amount ÷ rate`

3. **User clicks "Buy Now"**
   - Form validates (amount > 0)
   - API call to `/api/digital-gold/buy`
   - Transaction created in `gold_transactions` table
   - User's balance updated in `profiles` table
   - Success message shown

4. **Page refreshes**
   - New balance displayed
   - Transaction appears in history

## Security Considerations

- ✅ Authentication required (redirects to login if not authenticated)
- ✅ User can only buy for their own account
- ✅ Amount validation on backend
- ✅ Transaction timestamps recorded
- ✅ All transactions logged for audit trail

## Testing

### Mock Data
```typescript
// Test with amount: 25000
// Expected grams: 25000 / 5950 ≈ 4.2g
// Test with amount: 50000
// Expected grams: 50000 / 5950 ≈ 8.4g
```

### Test Cases
1. Buy digital gold with valid amount
2. Check balance updates correctly
3. Verify transaction appears in history
4. Test conversion accuracy
5. Test with different metal rates

## Frontend Components

- **Page**: `/app/digital-gold/page.tsx`
- **Balance Card**: Shows current holdings
- **Converter Section**: Input and calculation
- **Buy Button**: Triggers purchase flow
- **Transaction List**: Shows history

## Real-time Updates

The vault uses:
- `useAuth()` for user profile with digital_gold_balance
- `useLiveRates()` for current 24K rate
- Real-time Supabase subscriptions for transaction updates
- Framer Motion for smooth transitions

## Error Handling

- Network errors show user-friendly messages
- Validation errors display in Alert components
- Failed transactions logged with status='FAILED'
- Auto-refresh on successful purchase

## Future Enhancements

- Sell digital gold
- Transfer to other users
- Portfolio analytics
- Export transaction history
- Digital gold insurance options
