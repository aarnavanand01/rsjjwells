'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogOut, User, Wallet, ArrowLeft, Loader as Loader2 } from 'lucide-react';
import Footer from '@/components/layout/Footer';

export default function ProfilePage() {
  const { user, profile, loading, signOut, isAuthenticated } = useAuth();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto mb-4" />
          <p className="text-richblack-muted">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 hover:bg-cream-deep rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-richblack" />
          </button>
          <h1 className="font-playfair text-4xl text-richblack">My Account</h1>
        </div>

        <div className="bg-white rounded-lg border border-cream-deep p-10">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-playfair text-2xl text-richblack">Profile Settings</h2>
            <Button
              onClick={handleSignOut}
              disabled={signingOut}
              className="btn-outline-gold inline-flex items-center gap-2"
            >
              {signingOut ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing Out...
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </>
              )}
            </Button>
          </div>

          <div className="space-y-8">
            <div className="border-b border-cream-deep pb-8">
              <h2 className="font-playfair text-xl text-richblack mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-gold" />
                Profile Information
              </h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-cream-deep cursor-not-allowed"
                  />
                  <p className="text-xs text-richblack-muted">Email cannot be changed</p>
                </div>

                {profile?.full_name && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={profile.full_name}
                      disabled
                      className="bg-cream-deep cursor-not-allowed"
                    />
                  </div>
                )}

                {profile?.created_at && (
                  <div className="space-y-2">
                    <Label htmlFor="memberSince">Member Since</Label>
                    <Input
                      id="memberSince"
                      type="text"
                      value={new Date(profile.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      disabled
                      className="bg-cream-deep cursor-not-allowed"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="border-b border-cream-deep pb-8">
              <h2 className="font-playfair text-xl text-richblack mb-6 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-gold" />
                Digital Gold Balance
              </h2>

              <div className="bg-cream-warm rounded-lg p-6 border border-gold-muted/20">
                <div className="text-center">
                  <p className="text-richblack-muted text-sm mb-2">Your Balance</p>
                  <p className="font-playfair text-4xl text-gold mb-2">
                    {profile?.digital_gold_balance.toFixed(4) || '0.0000'} g
                  </p>
                  <p className="text-richblack-muted text-xs">
                    At ₹7,850 per gram ≈ ₹
                    {(
                      (profile?.digital_gold_balance || 0) * 7850
                    ).toLocaleString('en-IN', {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button className="btn-gold flex-1">Buy Gold</Button>
                <Button className="btn-outline-gold flex-1">Sell Gold</Button>
              </div>
            </div>

            <div>
              <h2 className="font-playfair text-xl text-richblack mb-6">Quick Links</h2>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/orders"
                  className="block p-4 border border-cream-deep rounded-lg text-richblack hover:border-gold hover:bg-cream-warm transition-all"
                >
                  <p className="font-medium">My Orders</p>
                  <p className="text-xs text-richblack-muted">View purchase history</p>
                </Link>
                <Link
                  href="/wishlist"
                  className="block p-4 border border-cream-deep rounded-lg text-richblack hover:border-gold hover:bg-cream-warm transition-all"
                >
                  <p className="font-medium">Wishlist</p>
                  <p className="text-xs text-richblack-muted">Saved items</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
