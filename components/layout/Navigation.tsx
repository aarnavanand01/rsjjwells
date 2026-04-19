'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, User, ShoppingBag, Menu, X, LogOut, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { CartSheet } from '@/components/cart-sheet';
import { Button } from '@/components/ui/button';

const NAV_LINKS = [
  { label: 'Gold', href: '/gold' },
  { label: 'Diamond', href: '/diamond' },
  { label: 'Silver', href: '/silver' },
  { label: 'Digital Gold', href: '/digital-gold' },
  { label: 'About', href: '/about' },
];

export default function Navigation() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, signOut, loading } = useAuth();
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [showAuthMenu, setShowAuthMenu] = useState(false);

  return (
    <nav
      className="w-full"
      style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #EDE8DC' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.slice(0, 2).map((link) => (
              <Link key={link.href} href={link.href} className="nav-link">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex-1 flex justify-start lg:justify-center">
            <Link href="/" className="flex items-center gap-0 group">
              <div className="relative">
                <span
                  className="font-playfair font-bold tracking-widest"
                  style={{
                    fontSize: '1.6rem',
                    color: '#1A1A1A',
                    letterSpacing: '0.15em',
                    fontStyle: 'italic',
                  }}
                >
                  RSJ
                </span>
                <div
                  className="absolute -bottom-1 left-0 right-0 h-px transition-all duration-300 group-hover:opacity-100 opacity-60"
                  style={{
                    background:
                      'linear-gradient(to right, transparent, #C5A059, transparent)',
                  }}
                />
              </div>
              <div className="hidden sm:flex flex-col ml-2 leading-none">
                <span
                  style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '0.45rem',
                    letterSpacing: '0.3em',
                    color: '#8A7A60',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    lineHeight: 1,
                  }}
                >
                  Jewelers
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '0.38rem',
                    letterSpacing: '0.25em',
                    color: '#C5A059',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                    lineHeight: 1,
                    marginTop: '2px',
                  }}
                >
                  Est. 1985
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.slice(2).map((link) => (
              <Link key={link.href} href={link.href} className="nav-link">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-5 ml-6">
            <button
              className="p-1 text-[#2C2C2C] transition-colors hover:text-[#C5A059]"
              aria-label="Search"
            >
              <Search strokeWidth={1.5} className="w-[18px] h-[18px]" />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="p-1 text-[#2C2C2C] transition-colors hover:text-[#C5A059] relative"
              aria-label="Cart"
            >
              <ShoppingBag strokeWidth={1.5} className="w-[18px] h-[18px]" />
              {itemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white flex items-center justify-center"
                  style={{ backgroundColor: '#C5A059', fontSize: '0.55rem' }}
                >
                  {itemCount}
                </span>
              )}
            </button>

            {/* Auth Menu */}
            <div className="relative">
              <button
                onClick={() => setShowAuthMenu(!showAuthMenu)}
                className="p-1 text-[#2C2C2C] transition-colors hover:text-[#C5A059]"
                aria-label="Account Menu"
              >
                <User strokeWidth={1.5} className="w-[18px] h-[18px]" />
              </button>

              {showAuthMenu && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-lg border border-cream-deep bg-white shadow-lg z-50"
                >
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-3 text-sm text-richblack hover:bg-cream-warm transition-colors border-b border-cream-deep"
                        onClick={() => setShowAuthMenu(false)}
                      >
                        My Dashboard
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin/dashboard"
                          className="block px-4 py-3 text-sm text-richblack hover:bg-cream-warm transition-colors border-b border-cream-deep flex items-center gap-2"
                          onClick={() => setShowAuthMenu(false)}
                        >
                          <Shield className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      )}
                      <Link
                        href="/profile"
                        className="block px-4 py-3 text-sm text-richblack hover:bg-cream-warm transition-colors border-b border-cream-deep"
                        onClick={() => setShowAuthMenu(false)}
                      >
                        Edit Profile
                      </Link>
                      <button
                        onClick={async () => {
                          await signOut();
                          setShowAuthMenu(false);
                          router.push('/');
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-cream-warm transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="block px-4 py-3 text-sm text-richblack hover:bg-cream-warm transition-colors border-b border-cream-deep"
                        onClick={() => setShowAuthMenu(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="block px-4 py-3 text-sm text-gold font-medium hover:bg-cream-warm transition-colors"
                        onClick={() => setShowAuthMenu(false)}
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              className="lg:hidden p-1 text-[#2C2C2C] transition-colors hover:text-[#C5A059]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? (
                <X strokeWidth={1.5} className="w-[18px] h-[18px]" />
              ) : (
                <Menu strokeWidth={1.5} className="w-[18px] h-[18px]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="lg:hidden border-t"
          style={{ backgroundColor: '#FAFAFA', borderColor: '#EDE8DC' }}
        >
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link text-sm"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="border-t border-cream-deep pt-6 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="nav-link text-sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      className="nav-link text-sm text-gold"
                      onClick={() => setMobileOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={async () => {
                      await signOut();
                      setMobileOpen(false);
                      router.push('/');
                    }}
                    className="nav-link text-sm text-red-600 text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="nav-link text-sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="nav-link text-sm text-gold font-semibold"
                    onClick={() => setMobileOpen(false)}
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </nav>
  );
}
