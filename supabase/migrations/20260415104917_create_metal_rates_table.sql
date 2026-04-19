/*
  # Create Metal Rates Table

  ## Summary
  Creates the metal_rates table to track live precious metal prices with historical trends.

  ## New Tables
  - `metal_rates`
    - `id` (uuid, PK)
    - `metal` (text) - Metal type: Gold 24K, Gold 22K, Silver, Platinum
    - `purity` (text) - Purity level (e.g., 22K, 24K, 925)
    - `price` (numeric) - Current price per gram in INR
    - `previous_price` (numeric) - Previous price for trend calculation
    - `change_percent` (numeric) - Percentage change
    - `trend` (text) - 'up', 'down', 'neutral'
    - `updated_at` (timestamptz)
    - `created_at` (timestamptz)

  ## Notes
  1. Rates are public data, no RLS needed for reads
  2. Only admins can update via authenticated API
  3. Indexes on metal and updated_at for fast queries

  ## Sample Data
  Initial metal prices seeded for 22K Gold, 24K Gold, and Silver
*/

CREATE TABLE IF NOT EXISTS metal_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metal text NOT NULL,
  purity text DEFAULT '',
  price numeric(12, 2) NOT NULL DEFAULT 0,
  previous_price numeric(12, 2) NOT NULL DEFAULT 0,
  change_percent numeric(5, 2) DEFAULT 0,
  trend text DEFAULT 'neutral' CHECK (trend IN ('up', 'down', 'neutral')),
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS metal_rates_metal_idx ON metal_rates(metal);
CREATE INDEX IF NOT EXISTS metal_rates_updated_at_idx ON metal_rates(updated_at DESC);

INSERT INTO metal_rates (metal, purity, price, previous_price, trend) VALUES
  ('Gold 22K', '22K', 7850.00, 7850.00, 'neutral'),
  ('Gold 24K', '24K', 8450.00, 8450.00, 'neutral'),
  ('Silver', '999', 1025.00, 1025.00, 'neutral'),
  ('Platinum', '950', 4200.00, 4200.00, 'neutral')
ON CONFLICT DO NOTHING;
