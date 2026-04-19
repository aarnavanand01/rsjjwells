'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart } from 'lucide-react';
import { useEffect } from 'react';
import Footer from '@/components/layout/Footer';

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-richblack-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 hover:bg-cream-deep rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-richblack" />
          </button>
          <h1 className="font-playfair text-4xl text-richblack">My Wishlist</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Saved Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gold/20 mx-auto mb-4" />
              <p className="text-richblack-muted mb-4">No items in your wishlist</p>
              <p className="text-sm text-richblack-muted mb-6">
                Add items to your wishlist to keep track of favorites
              </p>
              <Button onClick={() => router.push('/shop')} className="btn-gold">
                Browse Collection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
