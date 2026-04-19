import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Montserrat } from 'next/font/google';
import Header from '@/components/layout/Header';
import { AuthProvider } from '@/lib/auth-context';
import { CartProvider } from '@/lib/cart-context';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RSJ Jewelers — Timeless Beauty, Crafted for You',
  description: 'Discover our exquisite collection of gold, diamond, and silver jewelry. Handcrafted with the finest materials, embodying generations of artisanal excellence.',
  openGraph: {
    title: 'RSJ Jewelers — Timeless Beauty, Crafted for You',
    description: 'Discover our exquisite collection of gold, diamond, and silver jewelry.',
    images: [{ url: 'https://bolt.new/static/og_default.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: 'https://bolt.new/static/og_default.png' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable}`}>
      <body>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
