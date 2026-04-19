'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, LogOut, ArrowRight, Sparkles } from 'lucide-react';
import Footer from '@/components/layout/Footer';

export default function UserDashboard() {
  const router = useRouter();
  const { user, profile, loading, signOut, isAuthenticated } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (err) {
      setError('Failed to logout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center space-y-4">
          <Sparkles className="w-8 h-8 text-gold mx-auto animate-spin" />
          <p className="text-richblack-muted">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-6">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="font-playfair text-3xl text-richblack">Profile Not Found</h1>
          <p className="text-richblack-muted">We couldn't load your profile information.</p>
          <Button onClick={handleLogout} className="btn-outline-gold">
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-playfair text-4xl text-richblack mb-2">Welcome, {profile.full_name}</h1>
            <p className="text-richblack-muted">{profile.email}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-richblack-muted mb-1">Full Name</p>
                <p className="text-lg text-richblack font-medium">{profile.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-richblack-muted mb-1">Email</p>
                <p className="text-lg text-richblack font-medium">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm text-richblack-muted mb-1">Member Since</p>
                <p className="text-lg text-richblack font-medium">
                  {new Date(profile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-richblack-muted mb-1">Account Status</p>
                <p className="text-lg text-richblack font-medium text-emerald-600">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Digital Gold Balance */}
        <Card>
          <CardHeader>
            <CardTitle>Digital Gold Account</CardTitle>
            <CardDescription>Manage your digital gold holdings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-richblack-muted mb-2">Current Balance</p>
              <p className="text-4xl font-playfair text-gold">
                {profile.digital_gold_balance.toFixed(2)}g
              </p>
            </div>
            <div className="flex gap-3">
              <Button className="btn-gold">Buy Digital Gold</Button>
              <Button variant="outline">Sell Holdings</Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your account and explore features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/shop"
                className="flex items-center justify-between p-4 border border-cream-deep rounded-lg hover:bg-cream-warm transition-colors"
              >
                <span className="font-medium text-richblack">Browse Collection</span>
                <ArrowRight className="w-4 h-4 text-gold" />
              </Link>
              <Link
                href="/profile"
                className="flex items-center justify-between p-4 border border-cream-deep rounded-lg hover:bg-cream-warm transition-colors"
              >
                <span className="font-medium text-richblack">Edit Profile</span>
                <ArrowRight className="w-4 h-4 text-gold" />
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center justify-between p-4 border border-cream-deep rounded-lg hover:bg-cream-warm transition-colors"
              >
                <span className="font-medium text-richblack">My Wishlist</span>
                <ArrowRight className="w-4 h-4 text-gold" />
              </Link>
              <Link
                href="/orders"
                className="flex items-center justify-between p-4 border border-cream-deep rounded-lg hover:bg-cream-warm transition-colors"
              >
                <span className="font-medium text-richblack">Order History</span>
                <ArrowRight className="w-4 h-4 text-gold" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
