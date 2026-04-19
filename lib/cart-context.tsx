'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from './types';
import { useLiveRates } from '@/hooks/use-live-rates';
import { calculateProductPrice } from './pricing';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartSubtotal: number;
  cartGST: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { rates } = useLiveRates();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const calculateCartTotals = () => {
    let subtotal = 0;

    items.forEach((item) => {
      if (item.product) {
        const price = calculateProductPrice(
          item.product.weight,
          item.product.making_charge,
          rates,
          item.product.category,
          item.product.purity,
          item.product.base_price || 0
        );
        subtotal += price * item.quantity;
      }
    });

    const gst = Math.round(subtotal * 0.03 * 100) / 100; // 3% GST
    const total = subtotal + gst;

    return { subtotal, gst, total };
  };

  const { subtotal: cartSubtotal, gst: cartGST, total: cartTotal } = calculateCartTotals();

  const addItem = (product: Product, quantity: number = 1) => {
    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.product_id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prevItems,
        {
          id: `cart-${product.id}-${Date.now()}`,
          user_id: '',
          product_id: product.id,
          quantity,
          added_at: new Date().toISOString(),
          product,
        } as CartItem,
      ];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product_id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product_id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        cartTotal,
        cartSubtotal,
        cartGST,
        itemCount: items.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
