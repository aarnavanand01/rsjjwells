-- Complete Database Schema for RSJ Jewellers

-- 1. METAL RATES TABLE
CREATE TABLE IF NOT EXISTS metal_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metal VARCHAR(50) NOT NULL,
  purity VARCHAR(10) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  previous_price DECIMAL(12, 2),
  change_percent DECIMAL(5, 2),
  trend VARCHAR(10) DEFAULT 'neutral',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(metal, purity)
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  purity VARCHAR(10),
  weight DECIMAL(10, 3),
  making_charge DECIMAL(10, 2),
  base_price DECIMAL(12, 2),
  images JSONB,
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255),
  full_name VARCHAR(255),
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'USER',
  digital_gold_balance DECIMAL(15, 3) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INT DEFAULT 1,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. WISHLIST ITEMS TABLE
CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  items JSONB NOT NULL,
  subtotal DECIMAL(12, 2),
  gst DECIMAL(12, 2),
  total DECIMAL(12, 2),
  status VARCHAR(50) DEFAULT 'PROCESSING',
  shipping_address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  phone VARCHAR(20),
  payment_method VARCHAR(50),
  razorpay_order_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. GOLD TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS gold_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount_inr DECIMAL(12, 2) NOT NULL,
  grams_received DECIMAL(15, 3),
  transaction_type VARCHAR(20) DEFAULT 'BUY',
  status VARCHAR(20) DEFAULT 'COMPLETED',
  rate_applied DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. KYC DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_type VARCHAR(50),
  document_url TEXT,
  status VARCHAR(20) DEFAULT 'PENDING',
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. METAL RATE OVERRIDES TABLE
CREATE TABLE IF NOT EXISTS metal_rate_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metal_type VARCHAR(50),
  purity VARCHAR(10),
  custom_rate DECIMAL(10, 2),
  reason TEXT,
  set_by_admin_id UUID REFERENCES profiles(id),
  effective_from TIMESTAMP,
  effective_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE INDEXES
CREATE INDEX idx_metal_rates_metal_purity ON metal_rates(metal, purity);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_gold_transactions_user_id ON gold_transactions(user_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE gold_transactions ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES FOR PROFILES
CREATE POLICY "Profiles are viewable by users who own them"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'ADMIN');

-- RLS POLICIES FOR CART_ITEMS
CREATE POLICY "Users can view their own cart"
  ON cart_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own cart"
  ON cart_items FOR INSERT, UPDATE, DELETE
  USING (auth.uid() = user_id);

-- RLS POLICIES FOR WISHLIST
CREATE POLICY "Users can view their own wishlist"
  ON wishlist_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own wishlist"
  ON wishlist_items FOR INSERT, UPDATE, DELETE
  USING (auth.uid() = user_id);

-- RLS POLICIES FOR ORDERS
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'ADMIN');

-- SAMPLE DATA
INSERT INTO metal_rates (metal, purity, price, previous_price, change_percent, trend) VALUES
('Gold', '24K', 6500.00, 6480.00, 0.31, 'up'),
('Gold', '22K', 5960.00, 5940.00, 0.34, 'up'),
('Gold', '18K', 4870.00, 4855.00, 0.31, 'up'),
('Silver', '999', 850.00, 845.00, 0.59, 'up'),
('Silver', '925', 780.00, 775.00, 0.64, 'up'),
('Diamond', 'VS1', 12000.00, 12000.00, 0.00, 'neutral')
ON CONFLICT (metal, purity) DO UPDATE SET
  price = EXCLUDED.price,
  previous_price = EXCLUDED.previous_price,
  change_percent = EXCLUDED.change_percent,
  trend = EXCLUDED.trend,
  updated_at = CURRENT_TIMESTAMP;
