/**
 * Jewelry Pricing Engine
 * 
 * Formula: Final Price = (Current Metal Rate × Product Weight) + Making Charges + 3% GST
 * 
 * This ensures real-time reactive pricing that updates instantly when metal rates change.
 */

import { MetalRate } from '@/hooks/use-live-rates';

export interface PricingInput {
  weight: number; // in grams
  makingCharge: number; // in rupees
  metalRate: number; // price per gram
  basePrice?: number; // fallback price if rate unavailable
}

export interface PricingOutput {
  metalCost: number; // weight × rate
  makingCharge: number;
  subtotal: number; // metalCost + makingCharge
  gst: number; // 3% of subtotal
  finalPrice: number; // subtotal + gst
}

/**
 * Calculate jewelry price with dynamic metal rates
 * @param input Pricing input containing weight, making charge, and metal rate
 * @returns Detailed pricing breakdown and final price
 */
export function calculateJewelryPrice(input: PricingInput): PricingOutput {
  const { weight, makingCharge, metalRate, basePrice } = input;

  // Validate inputs
  if (weight < 0 || makingCharge < 0 || metalRate < 0) {
    return {
      metalCost: 0,
      makingCharge: 0,
      subtotal: 0,
      gst: 0,
      finalPrice: basePrice || 0,
    };
  }

  // Step 1: Calculate metal cost (weight × rate per gram)
  const metalCost = weight * metalRate;

  // Step 2: Add making charges
  const subtotal = metalCost + makingCharge;

  // Step 3: Calculate 3% GST on subtotal
  const gst = subtotal * 0.03;

  // Step 4: Calculate final price
  const finalPrice = subtotal + gst;

  return {
    metalCost: Math.round(metalCost * 100) / 100,
    makingCharge: Math.round(makingCharge * 100) / 100,
    subtotal: Math.round(subtotal * 100) / 100,
    gst: Math.round(gst * 100) / 100,
    finalPrice: Math.round(finalPrice * 100) / 100,
  };
}

/**
 * Calculate price for a jewelry product based on metal type
 * @param weight Product weight in grams
 * @param makingCharge Making charge in rupees
 * @param rates Array of metal rates from Supabase
 * @param metalType Type of metal (Gold, Diamond, Silver, etc.)
 * @param purity Purity level (24K, 22K, 18K, Sterling)
 * @param basePrice Fallback base price if rate not available
 * @returns Final calculated price
 */
export function calculateProductPrice(
  weight: number,
  makingCharge: number,
  rates: MetalRate[],
  metalType: string,
  purity: string,
  basePrice: number
): number {
  // Find the matching metal rate
  const matchingRate = rates.find(
    (rate) => rate.metal === metalType && rate.purity === purity
  );

  if (!matchingRate || matchingRate.price <= 0) {
    return basePrice;
  }

  const pricing = calculateJewelryPrice({
    weight,
    makingCharge,
    metalRate: matchingRate.price,
    basePrice,
  });

  return pricing.finalPrice;
}

/**
 * Format price with Indian locale formatting
 * @param price Price in rupees
 * @returns Formatted price string with ₹ symbol
 */
export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

/**
 * Format price with decimals for detailed breakdowns
 * @param price Price in rupees
 * @returns Formatted price string with ₹ symbol and decimals
 */
export function formatPriceDetailed(price: number): string {
  return `₹${price.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
