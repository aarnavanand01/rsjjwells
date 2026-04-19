'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingBag, Plus, Minus, Lock } from 'lucide-react';
import { formatPrice } from '@/lib/pricing';

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { items, removeItem, updateQuantity, cartSubtotal, cartGST, cartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      // Redirect to login
      window.location.href = '/auth/login?redirect=/checkout';
      return;
    }
    setIsCheckingOut(true);
    // Navigate to checkout
    window.location.href = '/checkout';
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[500px] bg-cream">
        <SheetHeader className="border-b border-cream-deep pb-6">
          <SheetTitle className="font-playfair text-2xl text-richblack flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-gold" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <ShoppingBag className="w-16 h-16 text-gold/20 mb-4" />
            <h3 className="font-playfair text-xl text-richblack mb-2">Cart is Empty</h3>
            <p className="text-richblack-muted mb-6">Add items to get started</p>
            <Button
              onClick={() => onOpenChange(false)}
              asChild
              className="btn-gold"
            >
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="max-h-[50vh] overflow-y-auto py-6 space-y-4 border-b border-cream-deep">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.product_id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 p-4 bg-white rounded-lg border border-cream-deep"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-cream-deep rounded-lg flex-shrink-0 overflow-hidden">
                      {item.product?.images?.[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-richblack truncate text-sm">
                        {item.product?.name}
                      </h4>
                      <p className="text-xs text-richblack-muted mb-2">
                        {item.product?.category} • {item.product?.purity}
                      </p>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-1 w-fit bg-cream-deep rounded-md p-1">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="p-1 hover:bg-white rounded transition-colors"
                        >
                          <Minus className="w-3 h-3 text-richblack" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium text-richblack">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="p-1 hover:bg-white rounded transition-colors"
                        >
                          <Plus className="w-3 h-3 text-richblack" />
                        </button>
                      </div>
                    </div>

                    {/* Price & Delete */}
                    <div className="flex flex-col items-end justify-between">
                      <p className="font-bold text-gold text-sm">
                        {formatPrice((item.product?.making_charge || 0) * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeItem(item.product_id)}
                        className="p-2 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Cart Summary */}
            <div className="py-6 space-y-3 border-b border-cream-deep">
              <div className="flex justify-between text-sm">
                <span className="text-richblack-muted">Subtotal</span>
                <span className="text-richblack font-semibold">{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-richblack-muted">GST (3%)</span>
                <span className="text-richblack font-semibold">{formatPrice(cartGST)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-cream-deep">
                <span className="font-playfair text-lg text-richblack">Total</span>
                <span className="font-playfair text-xl text-gold">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="pt-6 space-y-3">
              <Button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full btn-gold flex items-center justify-center gap-2"
              >
                {!isAuthenticated && <Lock className="w-4 h-4" />}
                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="w-full border-gold text-gold hover:bg-gold hover:text-white"
                asChild
              >
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
