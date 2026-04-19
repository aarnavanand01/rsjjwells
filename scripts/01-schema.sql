-- Create Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  digital_gold_balance NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create Metal Rates table
CREATE TABLE IF NOT EXISTS public.metal_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metal TEXT NOT NULL,
  purity TEXT NOT NULL,
  rate NUMERIC NOT NULL,
  source TEXT DEFAULT 'MANUAL',
  active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(metal, purity)
);

-- Create Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  purity TEXT DEFAULT '24K',
  weight NUMERIC NOT NULL,
  base_price NUMERIC DEFAULT 0,
  making_charge NUMERIC DEFAULT 0,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create Cart Items table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, product_id)
);

-- Create Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subtotal NUMERIC NOT NULL,
  gst NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
  shipping_address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  phone TEXT,
  payment_method TEXT,
  razorpay_order_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create Order Items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER DEFAULT 1,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create Gold Transactions table
CREATE TABLE IF NOT EXISTS public.gold_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount_inr NUMERIC NOT NULL,
  grams_received NUMERIC NOT NULL,
  rate_applied NUMERIC NOT NULL,
  transaction_type TEXT CHECK (transaction_type IN ('BUY', 'SELL', 'TRANSFER')),
  status TEXT DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create Wishlist Items table
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, product_id)
);

-- Create KYC Documents table
CREATE TABLE IF NOT EXISTS public.kyc_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_url TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED')),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create Metal Rate Overrides table
CREATE TABLE IF NOT EXISTS public.metal_rate_overrides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metal_type TEXT NOT NULL,
  purity TEXT NOT NULL,
  custom_rate NUMERIC NOT NULL,
  reason TEXT,
  set_by_admin_id UUID NOT NULL REFERENCES public.profiles(id),
  effective_from TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  effective_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create Indexes for better performance
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_metal_rates_active ON public.metal_rates(active);
CREATE INDEX idx_metal_rates_metal_purity ON public.metal_rates(metal, purity);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_featured ON public.products(featured);
CREATE INDEX idx_cart_items_user ON public.cart_items(user_id);
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_gold_transactions_user ON public.gold_transactions(user_id);
CREATE INDEX idx_wishlist_items_user ON public.wishlist_items(user_id);
CREATE INDEX idx_kyc_documents_user ON public.kyc_documents(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gold_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Profiles: Users can read their own profile
CREATE POLICY "Users can read their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Cart Items: Users can manage their own cart
CREATE POLICY "Users can manage their own cart"
  ON public.cart_items FOR ALL
  USING (auth.uid() = user_id);

-- Orders: Users can read their own orders
CREATE POLICY "Users can read their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

-- Order Items: Users can read their own order items
CREATE POLICY "Users can read their own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Gold Transactions: Users can read their own transactions
CREATE POLICY "Users can read their own transactions"
  ON public.gold_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Wishlist: Users can manage their own wishlist
CREATE POLICY "Users can manage their own wishlist"
  ON public.wishlist_items FOR ALL
  USING (auth.uid() = user_id);

-- KYC Documents: Users can manage their own documents
CREATE POLICY "Users can manage their own documents"
  ON public.kyc_documents FOR ALL
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gold_transactions_updated_at BEFORE UPDATE ON public.gold_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kyc_documents_updated_at BEFORE UPDATE ON public.kyc_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to initialize user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample metal rates
INSERT INTO public.metal_rates (metal, purity, rate, source) VALUES
  ('Gold', '24K', 7500, 'LIVE'),
  ('Gold', '22K', 6875, 'LIVE'),
  ('Gold', '18K', 5625, 'LIVE'),
  ('Silver', '999', 95, 'LIVE'),
  ('Silver', '925', 88, 'LIVE'),
  ('Diamond', '', 50000, 'MANUAL')
ON CONFLICT (metal, purity) DO NOTHING;
