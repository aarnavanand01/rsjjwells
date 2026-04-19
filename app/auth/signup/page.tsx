'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Lock, Loader as Loader2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await signUp(email, password, fullName);
      setSuccess('Account created! Redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-8">
            <span className="font-playfair font-bold text-3xl text-richblack italic tracking-widest">
              RSJ
            </span>
          </Link>
          <h1 className="font-playfair text-3xl text-richblack mb-2">Join RSJ Jewelers</h1>
          <p className="text-richblack-muted">Create your exclusive account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-sm text-sm">
              {success}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-richblack">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-gold" />
              <Input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-9 bg-cream-warm border-gold-muted/30 focus:border-gold focus:ring-gold"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-richblack">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-gold" />
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 bg-cream-warm border-gold-muted/30 focus:border-gold focus:ring-gold"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-richblack">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gold" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 bg-cream-warm border-gold-muted/30 focus:border-gold focus:ring-gold"
                required
              />
            </div>
            <p className="text-xs text-richblack-muted mt-1">Min. 8 characters</p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full btn-gold h-11 rounded-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className="mt-8 pt-8 border-t border-cream-deep text-center">
          <p className="text-richblack-muted text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-gold font-semibold hover:text-gold-dark">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-richblack-muted hover:text-gold transition-colors">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
