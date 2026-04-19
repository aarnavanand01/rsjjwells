/*
  # Create Products Table

  ## Summary
  Creates the product catalog table for RSJ Jewelers.

  ## New Tables
  - `products`
    - `id` (uuid, PK)
    - `name` (text) - Product display name
    - `description` (text) - Rich product description
    - `category` (text) - One of: Gold, Diamond, Silver, Digital Gold
    - `purity` (text) - e.g. "22K", "18K", "925", "VS1"
    - `weight` (numeric) - Weight in grams or carats
    - `making_charge` (numeric) - Making charge percentage
    - `base_price` (numeric) - Base listed price in INR
    - `images` (text[]) - Array of image URLs
    - `in_stock` (boolean) - Availability flag
    - `featured` (boolean) - Whether to feature on homepage
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ## Security
  - RLS enabled
  - Authenticated users can view all products (public catalog)
  - Only service role can insert/update/delete (admin operations)

  ## Notes
  1. category is constrained to valid values
  2. Sample seed data inserted for demonstration
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  description text DEFAULT '',
  category text NOT NULL DEFAULT 'Gold',
  purity text DEFAULT '',
  weight numeric(10, 3) DEFAULT 0,
  making_charge numeric(5, 2) DEFAULT 0,
  base_price numeric(12, 2) DEFAULT 0,
  images text[] DEFAULT ARRAY[]::text[],
  in_stock boolean DEFAULT true,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT products_category_check CHECK (category IN ('Gold', 'Diamond', 'Silver', 'Digital Gold'))
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view products"
  ON products FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS products_featured_idx ON products(featured);
CREATE INDEX IF NOT EXISTS products_in_stock_idx ON products(in_stock);

INSERT INTO products (name, description, category, purity, weight, making_charge, base_price, images, featured) VALUES
  (
    'Royal Kundan Necklace Set',
    'An exquisite hand-crafted Kundan necklace set adorned with precious uncut diamonds and lustrous pearls. A masterpiece of traditional Indian craftsmanship.',
    'Gold', '22K', 45.200, 12.00, 285000.00,
    ARRAY['https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg'],
    true
  ),
  (
    'Solitaire Diamond Ring',
    'A timeless round brilliant cut diamond solitaire in an elegant 18K white gold prong setting. Certified and conflict-free.',
    'Diamond', 'VS1 F', 4.500, 18.00, 185000.00,
    ARRAY['https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg'],
    true
  ),
  (
    'Heritage Gold Bangles',
    'A stunning pair of traditional gold bangles with intricate filigree work, inspired by Mughal-era jewelry design.',
    'Gold', '22K', 28.000, 10.00, 175000.00,
    ARRAY['https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg'],
    true
  ),
  (
    'Diamond Tennis Bracelet',
    'A breathtaking row of round brilliant cut diamonds set in 18K white gold. The epitome of effortless elegance.',
    'Diamond', 'VS2 G', 12.800, 20.00, 425000.00,
    ARRAY['https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg'],
    true
  ),
  (
    'Silver Filigree Earrings',
    'Delicately crafted 925 sterling silver earrings with traditional filigree work. Light, elegant, and timeless.',
    'Silver', '925', 8.500, 15.00, 4500.00,
    ARRAY['https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg'],
    false
  ),
  (
    'Gold Chain Necklace',
    'A classic 22K gold chain with a sophisticated rope weave pattern, perfect for everyday luxury.',
    'Gold', '22K', 15.000, 8.00, 92000.00,
    ARRAY['https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg'],
    false
  );
