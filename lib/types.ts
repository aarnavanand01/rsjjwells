export type Category = 'Gold' | 'Diamond' | 'Silver' | 'Digital Gold';
export type UserRole = 'ADMIN' | 'USER';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  role: UserRole;
  digital_gold_balance: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: Category;
  purity: string;
  weight: number;
  making_charge: number;
  base_price: number;
  images: string[];
  in_stock: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface MetalRate {
  label: string;
  value: string;
  unit: string;
  change: 'up' | 'down' | 'neutral';
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  added_at: string;
  product?: Product;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  added_at: string;
  product?: Product;
}

export interface GoldTransaction {
  id: string;
  user_id: string;
  amount_inr: number;
  grams_received: number;
  transaction_type: 'BUY' | 'SELL' | 'TRANSFER';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  rate_applied: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  subtotal: number;
  gst: number;
  total: number;
  status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shipping_address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  payment_method: string;
  razorpay_order_id?: string;
  created_at: string;
  updated_at: string;
}

export interface KYCDocument {
  id: string;
  user_id: string;
  document_type: 'PAN' | 'AADHAR' | 'PASSPORT' | 'DRIVER_LICENSE';
  document_url: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MetalRateOverride {
  id: string;
  metal_type: string;
  purity: string;
  custom_rate: number;
  reason: string;
  set_by_admin_id: string;
  effective_from: string;
  effective_until?: string;
  created_at: string;
}
