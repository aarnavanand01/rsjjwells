'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useLiveRates } from '@/hooks/use-live-rates';
import { calculateJewelryPrice, formatPrice } from '@/lib/pricing';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Truck,
  MapPin,
  Award,
  Lock,
  ZoomIn,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Footer from '@/components/layout/Footer';

interface ProductDetailPageProps {
  params: { id: string };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { rates } = useLiveRates();

  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [message, setMessage] = useState('');
  const [showZoom, setShowZoom] = useState(false);

  // Find matching metal rate
  const getMetalRate = () => {
    return rates.find(
      (r) => r.metal === product?.category && r.purity === product?.purity
    );
  };

  // Calculate price
  const calculatePrice = () => {
    if (!product) return 0;
    const metalRate = getMetalRate();
    if (!metalRate) return product.base_price || 0;

    const pricing = calculateJewelryPrice({
      weight: product.weight,
      makingCharge: product.making_charge,
      metalRate: metalRate.price,
      basePrice: product.base_price || 0,
    });
    return pricing.finalPrice;
  };

  const price = calculatePrice();

  // Load product
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setProduct(data as Product);
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoadingProduct(false);
      }
    };

    loadProduct();
  }, [params.id]);

  // Check if in wishlist
  useEffect(() => {
    if (user?.id && product?.id) {
      checkWishlist();
    }
  }, [user?.id, product?.id]);

  const checkWishlist = async () => {
    try {
      const response = await fetch(`/api/wishlist?userId=${user?.id}`);
      if (response.ok) {
        const wishlistItems = await response.json();
        setIsWishlisted(wishlistItems.some((item: any) => item.product_id === product?.id));
      }
    } catch (error) {
      console.error('Failed to check wishlist:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    setAddingToCart(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          productId: product?.id,
          quantity,
        }),
      });

      if (response.ok) {
        setMessage('Added to cart successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      setMessage('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    setAddingToWishlist(true);
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          productId: product?.id,
        }),
      });

      if (response.ok) {
        setIsWishlisted(!isWishlisted);
        setMessage(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      setMessage('Failed to update wishlist');
    } finally {
      setAddingToWishlist(false);
    }
  };

  const checkDelivery = () => {
    if (!pincode || pincode.length !== 6) {
      setMessage('Please enter a valid 6-digit pincode');
      return;
    }

    // Mock delivery date calculation
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + Math.floor(Math.random() * 5) + 3);
    setDeliveryDate(estimatedDate.toLocaleDateString());
    setMessage('');
  };

  if (loadingProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-richblack-muted">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <p className="text-richblack text-lg mb-4">Product not found</p>
          <Button onClick={() => router.push('/shop')} className="btn-gold">
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  const metalRate = getMetalRate();
  const pricing = metalRate
    ? calculateJewelryPrice({
        weight: product.weight,
        makingCharge: product.making_charge,
        metalRate: metalRate.price,
        basePrice: product.base_price || 0,
      })
    : null;

  return (
    <div className="min-h-screen bg-cream py-8 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-richblack hover:text-gold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="relative bg-white rounded-lg overflow-hidden border border-gray-200">
              {product.images?.[selectedImage] && (
                <>
                  <div className="relative h-96 md:h-[500px]">
                    <img
                      src={product.images[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-cover cursor-zoom-in"
                      onClick={() => setShowZoom(!showZoom)}
                    />
                    <button
                      onClick={() => setShowZoom(!showZoom)}
                      className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50"
                    >
                      <ZoomIn className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Zoom Modal */}
                  {showZoom && (
                    <div
                      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                      onClick={() => setShowZoom(false)}
                    >
                      <div className="relative max-w-4xl w-full h-96">
                        <img
                          src={product.images[selectedImage]}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                        <button
                          onClick={() => setShowZoom(false)}
                          className="absolute top-4 right-4 bg-white p-2 rounded-lg"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-gold' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Product Details */}
            <div>
              <p className="text-sm text-richblack-muted uppercase tracking-widest mb-2">
                {product.category} • {product.purity}
              </p>
              <h1 className="font-playfair text-4xl text-richblack mb-3">{product.name}</h1>
              <p className="text-richblack-muted">{product.description}</p>
            </div>

            {/* Price Section */}
            <div className="bg-gold/10 p-6 rounded-lg border border-gold/20">
              <p className="text-richblack-muted text-sm mb-2">Final Price</p>
              <motion.p
                key={price}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                className="text-5xl font-bold text-gold mb-4"
              >
                {formatPrice(price)}
              </motion.p>

              {product.weight && (
                <p className="text-richblack-muted">
                  Weight: <span className="font-semibold text-richblack">{product.weight}g</span>
                </p>
              )}
            </div>

            {/* Price Breakdown */}
            {pricing && (
              <Accordion type="single" collapsible className="border border-gray-200 rounded-lg">
                <AccordionItem value="pricing" className="border-none">
                  <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
                    <span className="font-semibold text-richblack">View Price Breakdown</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex justify-between pb-2 border-b">
                        <span className="text-richblack-muted">Metal Price</span>
                        <span className="font-semibold">{formatPrice(pricing.metalCost)}</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b">
                        <span className="text-richblack-muted">Making Charge</span>
                        <span className="font-semibold">{formatPrice(pricing.makingCharge)}</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b">
                        <span className="text-richblack-muted">Subtotal</span>
                        <span className="font-semibold">{formatPrice(pricing.subtotal)}</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b">
                        <span className="text-richblack-muted">GST (3%)</span>
                        <span className="font-semibold">{formatPrice(pricing.gst)}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="font-semibold text-richblack">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  −
                </button>
                <Input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="w-16 text-center" />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Messages */}
            {message && (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-blue-700">{message}</AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="btn-gold flex-1 py-6 text-lg flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button
                onClick={handleAddToWishlist}
                disabled={addingToWishlist}
                variant="outline"
                className="flex-shrink-0 px-6 py-6"
              >
                <Heart
                  className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-richblack'}`}
                />
              </Button>
            </div>

            {/* Stock Status */}
            {!product.in_stock && (
              <Alert className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-700">Out of Stock</AlertDescription>
              </Alert>
            )}
          </motion.div>
        </div>

        {/* Trust Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-gray-200">
          {/* Delivery Checker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Check Delivery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Pincode</label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter 6-digit pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.slice(0, 6))}
                      className="flex-1"
                    />
                    <Button onClick={checkDelivery} className="btn-outline-gold">
                      <MapPin className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {deliveryDate && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700 font-semibold">Estimated Delivery</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{deliveryDate}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* BIS Certificate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  BIS Hallmarked
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-richblack">Certified Quality</p>
                      <p className="text-sm text-richblack-muted">
                        All products are BIS hallmarked and come with authenticity certificate
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-richblack">30-Day Return Policy</p>
                      <p className="text-sm text-richblack-muted">
                        Not satisfied? Return within 30 days for full refund
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-richblack">Secure Payment</p>
                      <p className="text-sm text-richblack-muted">
                        All transactions are encrypted and secured
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
