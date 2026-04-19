'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '@/lib/types';
import { useLiveRates } from '@/hooks/use-live-rates';
import { calculateProductPrice, formatPrice } from '@/lib/pricing';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  showPriceBreakdown?: boolean;
}

export function ProductCard({ product, showPriceBreakdown = false }: ProductCardProps) {
  const { rates } = useLiveRates();
  const [currentPrice, setCurrentPrice] = useState<number>(product.base_price || 0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Recalculate price when rates change (reactive pricing with fade animation)
  useEffect(() => {
    const newPrice = calculateProductPrice(
      product.weight,
      product.making_charge,
      rates,
      product.category,
      product.purity,
      product.base_price || 0
    );

    if (newPrice !== currentPrice) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setCurrentPrice(newPrice);
        setIsAnimating(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [rates, product, currentPrice]);

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer bg-white h-full">
      <div className="relative h-64 w-full bg-[#f8f5f0] overflow-hidden">
        {product.images && product.images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground pb-8">
            No Image
          </div>
        )}
        {product.featured && (
          <Badge className="absolute top-3 right-3 bg-[#C5A059] hover:bg-[#b08e4d]">Featured</Badge>
        )}
      </div>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-xs text-[#8A7A60] font-medium tracking-wider uppercase mb-1">
              {product.category} • {product.purity}
            </p>
            <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-[#C5A059] transition-colors">
              {product.name}
            </h3>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-end">
          <div>
            <p className="text-xs text-gray-500 font-medium mb-0.5">
              {showPriceBreakdown ? 'Dynamic Price' : 'Starting from'}
            </p>
            <motion.p
              key={currentPrice}
              initial={isAnimating ? { opacity: 0 } : { opacity: 1 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="font-bold text-[#C5A059] text-xl tracking-tight"
            >
              {currentPrice > 0 ? formatPrice(currentPrice) : 'Price on Request'}
            </motion.p>
          </div>
          {product.weight && (
            <p className="text-sm text-gray-500 font-medium">{product.weight}g</p>
          )}
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}
