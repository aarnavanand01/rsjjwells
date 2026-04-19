'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, Loader2, AlertCircle, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { createOrder } from '@/lib/db';
import { formatPrice } from '@/lib/pricing';
import Footer from '@/components/layout/Footer';

type CheckoutStep = 'address' | 'review' | 'payment';

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuth();
  const { items, cartSubtotal, cartGST, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>('address');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Address form state
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login?redirect=/checkout');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (items.length === 0) {
      router.push('/shop');
    }
  }, [items, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  const handleAddressSubmit = () => {
    const { phone, address, city, state, pincode } = formData;
    if (!phone || !address || !city || !state || !pincode) {
      setError('Please fill all fields');
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError('Phone must be 10 digits');
      return;
    }
    if (!/^\d{6}$/.test(pincode)) {
      setError('Pincode must be 6 digits');
      return;
    }
    setError('');
    setStep('review');
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setError('');

    try {
      // Create order in database
      const order = await createOrder(
        user!.id,
        items,
        cartSubtotal,
        cartGST,
        cartTotal,
        formData.address,
        formData.city,
        formData.state,
        formData.pincode,
        formData.phone,
        'razorpay'
      );

      setOrderId(order.id);
      setOrderConfirmed(true);
      clearCart();

      // Simulate payment processing
      setTimeout(() => {
        setIsProcessing(false);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setIsProcessing(false);
    }
  };

  // Order Confirmed View
  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-cream-deep py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            >
              <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto" />
            </motion.div>

            <div>
              <h1 className="font-playfair text-4xl text-richblack mb-2">
                Order Confirmed!
              </h1>
              <p className="text-richblack-muted text-lg">
                Your order has been placed successfully
              </p>
            </div>

            <Card className="bg-white border-cream-deep">
              <CardHeader>
                <CardTitle className="text-center">Order ID: {orderId.slice(0, 12).toUpperCase()}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-left">
                    <p className="text-sm text-richblack-muted">Items</p>
                    <p className="text-lg font-semibold text-richblack">{items.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-richblack-muted">Total Amount</p>
                    <p className="text-lg font-bold text-gold">{formatPrice(cartTotal)}</p>
                  </div>
                </div>

                <div className="border-t border-cream-deep pt-4">
                  <p className="text-sm text-richblack-muted mb-2">Shipping Address</p>
                  <p className="text-richblack font-semibold">
                    {formData.address}<br />
                    {formData.city}, {formData.state} - {formData.pincode}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                You will receive an email confirmation shortly. Track your order in &apos;My Orders&apos;
              </p>
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                onClick={() => router.push('/orders')}
                className="flex-1 btn-gold"
              >
                View Order
              </Button>
              <Button
                onClick={() => router.push('/shop')}
                variant="outline"
                className="flex-1 border-gold text-gold hover:bg-gold hover:text-white"
              >
                Continue Shopping
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => router.push('/shop')}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-richblack" />
          </button>
          <h1 className="font-playfair text-4xl text-richblack">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step Indicator */}
            <div className="flex gap-4 mb-10">
              {(['address', 'review', 'payment'] as const).map((s, idx) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      s === step
                        ? 'bg-gold text-white'
                        : ['address', 'review', 'payment'].indexOf(step) > idx
                          ? 'bg-green-500 text-white'
                          : 'bg-cream-deep text-richblack-muted'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="text-xs font-medium text-richblack-muted ml-2 capitalize">
                    {s}
                  </div>
                  {idx < 2 && <div className="w-8 h-0.5 bg-cream-deep ml-4" />}
                </div>
              ))}
            </div>

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </motion.div>
            )}

            {/* Step 1: Address */}
            <AnimatePresence mode="wait">
              {step === 'address' && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="10-digit phone number"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          placeholder="House no, street, landmark"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({ ...formData, address: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={(e) =>
                              setFormData({ ...formData, city: e.target.value })
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            placeholder="State"
                            value={formData.state}
                            onChange={(e) =>
                              setFormData({ ...formData, state: e.target.value })
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          placeholder="6-digit pincode"
                          value={formData.pincode}
                          onChange={(e) =>
                            setFormData({ ...formData, pincode: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    onClick={handleAddressSubmit}
                    className="w-full btn-gold"
                  >
                    Continue to Review
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Review */}
              {step === 'review' && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Review</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Review Address */}
                      <div className="border-b border-cream-deep pb-4">
                        <h3 className="font-semibold text-richblack mb-2">Shipping Address</h3>
                        <p className="text-sm text-richblack-muted">{formData.address}</p>
                        <p className="text-sm text-richblack-muted">
                          {formData.city}, {formData.state} - {formData.pincode}
                        </p>
                        <p className="text-sm text-richblack-muted">Phone: {formData.phone}</p>
                      </div>

                      {/* Review Items */}
                      <div>
                        <h3 className="font-semibold text-richblack mb-3">Items</h3>
                        <div className="space-y-2">
                          {items.map((item) => (
                            <div key={item.product_id} className="flex justify-between text-sm">
                              <span className="text-richblack">
                                {item.product?.name} × {item.quantity}
                              </span>
                              <span className="font-semibold text-richblack">
                                {item.product?.category}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => setStep('address')}
                      variant="outline"
                      className="flex-1 border-gold text-gold"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep('payment')}
                      className="flex-1 btn-gold"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {step === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Payment Method
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="border-2 border-gold rounded-lg p-4 bg-gold/5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">RAZORPAY</span>
                          </div>
                          <div>
                            <p className="font-semibold text-richblack">Razorpay</p>
                            <p className="text-sm text-richblack-muted">
                              Credit/Debit Card, UPI, Wallets
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                          This is a mock payment gateway. In production, this would redirect to Razorpay's secure
                          checkout.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => setStep('review')}
                      variant="outline"
                      className="flex-1 border-gold text-gold"
                      disabled={isProcessing}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="flex-1 btn-gold flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Pay ${formatPrice(cartTotal)}`
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary (Sticky) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-4 bg-white rounded-lg border border-cream-deep p-6 space-y-4">
              <h3 className="font-playfair text-xl text-richblack">Order Summary</h3>

              <div className="border-t border-cream-deep pt-4 space-y-2 max-h-[300px] overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product_id} className="flex justify-between text-sm">
                    <span className="text-richblack-muted">
                      {item.product?.name}
                    </span>
                    <span className="text-richblack font-semibold">×{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-cream-deep pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-richblack-muted">Subtotal</span>
                  <span className="text-richblack">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-richblack-muted">GST (3%)</span>
                  <span className="text-richblack">{formatPrice(cartGST)}</span>
                </div>
                <div className="flex justify-between font-playfair text-lg pt-2 border-t border-cream-deep">
                  <span className="text-richblack">Total</span>
                  <span className="text-gold">{formatPrice(cartTotal)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
