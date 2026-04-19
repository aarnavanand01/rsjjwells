import { supabase } from './supabase';
import { Profile, UserRole, CartItem, WishlistItem, GoldTransaction } from './types';

/**
 * Create a new user profile after registration
 */
export async function createUserProfile(
  userId: string,
  email: string,
  fullName: string,
  role: UserRole = 'USER'
) {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email,
      full_name: fullName,
      role,
      avatar_url: '',
      digital_gold_balance: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data as Profile | null;
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Profile[];
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(userId: string, role: UserRole) {
  return updateUserProfile(userId, { role });
}

/**
 * Delete user (admin only)
 */
export async function deleteUser(userId: string) {
  // Delete profile first
  const { error: profileError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (profileError) throw profileError;

  // Then delete auth user
  const { error: authError } = await supabase.auth.admin.deleteUser(userId);
  if (authError) throw authError;
}

/**
 * Get user activity stats
 */
export async function getUserStats() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id');

  if (error) throw error;

  const totalUsers = data?.length || 0;
  const { data: adminData } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'ADMIN');

  const adminCount = adminData?.length || 0;

  return {
    totalUsers,
    adminCount,
    regularUsers: totalUsers - adminCount,
  };
}

/**
 * Add item to cart
 */
export async function addToCart(userId: string, productId: string, quantity: number = 1) {
  // Check if item already exists
  const { data: existing } = await supabase
    .from('cart_items')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle();

  if (existing) {
    // Update quantity
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: quantity })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data as CartItem;
  }

  // Add new item
  const { data, error } = await supabase
    .from('cart_items')
    .insert({
      user_id: userId,
      product_id: productId,
      quantity,
      added_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data as CartItem;
}

/**
 * Get user's cart
 */
export async function getUserCart(userId: string) {
  const { data, error } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data as CartItem[];
}

/**
 * Remove item from cart
 */
export async function removeFromCart(cartItemId: string) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId);

  if (error) throw error;
}

/**
 * Add item to wishlist
 */
export async function addToWishlist(userId: string, productId: string) {
  const { data: existing } = await supabase
    .from('wishlist_items')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle();

  if (existing) {
    return existing as WishlistItem;
  }

  const { data, error } = await supabase
    .from('wishlist_items')
    .insert({
      user_id: userId,
      product_id: productId,
      added_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data as WishlistItem;
}

/**
 * Get user's wishlist
 */
export async function getUserWishlist(userId: string) {
  const { data, error } = await supabase
    .from('wishlist_items')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data as WishlistItem[];
}

/**
 * Remove item from wishlist
 */
export async function removeFromWishlist(wishlistItemId: string) {
  const { error } = await supabase
    .from('wishlist_items')
    .delete()
    .eq('id', wishlistItemId);

  if (error) throw error;
}

/**
 * Create gold transaction
 */
export async function createGoldTransaction(
  userId: string,
  amountInr: number,
  gramsReceived: number,
  rateApplied: number
) {
  const { data, error } = await supabase
    .from('gold_transactions')
    .insert({
      user_id: userId,
      amount_inr: amountInr,
      grams_received: gramsReceived,
      rate_applied: rateApplied,
      transaction_type: 'BUY',
      status: 'COMPLETED',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data as GoldTransaction;
}

/**
 * Get user's gold transactions
 */
export async function getUserGoldTransactions(userId: string) {
  const { data, error } = await supabase
    .from('gold_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as GoldTransaction[];
}

/**
 * Create an order
 */
export async function createOrder(
  userId: string,
  items: CartItem[],
  subtotal: number,
  gst: number,
  total: number,
  shippingAddress: string,
  city: string,
  state: string,
  pincode: string,
  phone: string,
  paymentMethod: string
) {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      items,
      subtotal,
      gst,
      total,
      status: 'PROCESSING',
      shipping_address: shippingAddress,
      city,
      state,
      pincode,
      phone,
      payment_method: paymentMethod,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get user's orders
 */
export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: string) {
  const { data, error } = await supabase
    .from('orders')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Upload KYC document
 */
export async function uploadKYCDocument(
  userId: string,
  documentType: string,
  documentUrl: string
) {
  const { data, error } = await supabase
    .from('kyc_documents')
    .insert({
      user_id: userId,
      document_type: documentType,
      document_url: documentUrl,
      status: 'PENDING',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get user's KYC documents
 */
export async function getUserKYCDocuments(userId: string) {
  const { data, error } = await supabase
    .from('kyc_documents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get all orders (admin)
 */
export async function getAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*, profiles(full_name, email)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get or create metal rate override
 */
export async function setMetalRateOverride(
  metalType: string,
  purity: string,
  customRate: number,
  reason: string,
  adminId: string
) {
  // Delete any existing override for this metal/purity
  await supabase
    .from('metal_rate_overrides')
    .delete()
    .eq('metal_type', metalType)
    .eq('purity', purity);

  const { data, error } = await supabase
    .from('metal_rate_overrides')
    .insert({
      metal_type: metalType,
      purity: purity,
      custom_rate: customRate,
      reason,
      set_by_admin_id: adminId,
      effective_from: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get active metal rate overrides
 */
export async function getMetalRateOverrides() {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('metal_rate_overrides')
    .select('*')
    .lte('effective_from', now)
    .or(`effective_until.is.null,effective_until.gte.${now}`);

  if (error) throw error;
  return data;
}
