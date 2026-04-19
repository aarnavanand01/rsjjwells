'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingBag, Loader2, Package, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getUserOrders } from '@/lib/db';
import { formatPrice } from '@/lib/pricing';
import { motion } from 'framer-motion';
import Footer from '@/components/layout/Footer';

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (user && isAuthenticated) {
      fetchOrders();
    }
  }, [user, isAuthenticated]);

  const fetchOrders = async () => {
    if (!user) return;
    try {
      setOrdersLoading(true);
      const data = await getUserOrders(user.id);
      setOrders(data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PROCESSING':
        return <Package className="w-4 h-4" />;
      case 'SHIPPED':
        return <Truck className="w-4 h-4" />;
      case 'DELIVERED':
        return <ShoppingBag className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-cream py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/profile')}
            className="p-2 hover:bg-cream-deep rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-richblack" />
          </button>
          <h1 className="font-playfair text-4xl text-richblack">My Orders</h1>
        </div>

        {ordersLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent>
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gold/20 mx-auto mb-4" />
                <p className="text-richblack-muted mb-4">No orders yet</p>
                <p className="text-sm text-richblack-muted mb-6">
                  Start shopping to see your orders here
                </p>
                <Button onClick={() => router.push('/shop')} className="btn-gold">
                  Browse Collection
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {orders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </CardTitle>
                        <p className="text-sm text-richblack-muted mt-1">
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-richblack-muted mb-1">Items</p>
                        <p className="font-semibold text-richblack">{order.items?.length || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-richblack-muted mb-1">Amount</p>
                        <p className="font-semibold text-gold">{formatPrice(order.total)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-richblack-muted mb-1">City</p>
                        <p className="font-semibold text-richblack">{order.city}</p>
                      </div>
                      <div>
                        <p className="text-xs text-richblack-muted mb-1">Payment</p>
                        <p className="font-semibold text-richblack capitalize">
                          {order.payment_method}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-cream-deep pt-4">
                      <p className="text-sm text-richblack-muted mb-1">Shipping Address</p>
                      <p className="text-sm text-richblack font-semibold">
                        {order.shipping_address}
                        <br />
                        {order.city}, {order.state} - {order.pincode}
                      </p>
                    </div>

                    <Button
                      onClick={() => router.push(`/orders/${order.id}`)}
                      variant="outline"
                      className="w-full border-gold text-gold hover:bg-gold hover:text-white"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
