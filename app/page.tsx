'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import RoyalCollection from '@/components/home/RoyalCollection';
import TrustGrid from '@/components/home/TrustGrid';
import Footer from '@/components/layout/Footer';

const categories = [
  { name: 'Gold', icon: '✦', color: '#C5A059', description: 'Timeless elegance' },
  { name: 'Diamond', icon: '◇', color: '#E8E8E8', description: 'Brilliant light' },
  { name: 'Silver', icon: '★', color: '#9CA3AF', description: 'Pure radiance' },
];

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('featured', true)
          .limit(6);

        if (error) throw error;
        setFeatured(data || []);
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="w-full bg-cream">
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-gold rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl text-center space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-center gap-2 text-gold"
          >
            <Sparkles className="w-5 h-5" />
            <span className="section-label">Heritage Craftsmanship</span>
            <Sparkles className="w-5 h-5" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-playfair text-5xl md:text-7xl text-richblack leading-tight"
          >
            Timeless Beauty,
            <br />
            <span className="gold-text-animate inline-block mt-2">Crafted for You</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-richblack-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Discover our exquisite collection of handcrafted jewelry. Each piece tells a story of timeless elegance and uncompromising quality.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Link
              href="/shop"
              className="btn-gold px-8 py-4 rounded-sm hover:shadow-2xl inline-flex items-center gap-2"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="btn-outline-gold px-8 py-4 rounded-sm hover:shadow-lg inline-flex items-center justify-center"
            >
              Learn Our Story
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="text-gold opacity-40">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 19l-8-8 1.4-1.4L12 16.2l6.6-6.6L20 11l-8 8z" />
            </svg>
          </div>
        </motion.div>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <span className="section-label">Shop by Collection</span>
          <h2 className="font-playfair text-4xl md:text-5xl text-richblack">Curated Categories</h2>
          <div className="gold-divider w-12 h-px mx-auto" />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.1 },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.name}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <Link
                href={`/${cat.name.toLowerCase()}`}
                className="group card-hover relative block"
              >
                <div className="bg-white rounded-lg p-12 text-center border border-cream-deep">
                  <motion.div
                    className="text-5xl mb-4"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {cat.icon}
                  </motion.div>
                  <h3 className="font-playfair text-2xl text-richblack mb-2">{cat.name}</h3>
                  <p className="text-richblack-muted text-sm mb-4">{cat.description}</p>
                  <span className="inline-flex items-center gap-2 text-gold font-semibold text-sm hover:gap-3 transition-all">
                    Explore <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <RoyalCollection />

      <TrustGrid />

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <span className="section-label">Featured Pieces</span>
          <h2 className="font-playfair text-4xl md:text-5xl text-richblack">Heritage Collections</h2>
          <div className="gold-divider w-12 h-px mx-auto" />
        </motion.div>

        {loading ? (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-cream-deep rounded-lg h-80 animate-pulse" />
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.1 },
              },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featured.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
              >
                <Link
                  href={`/product/${product.id}`}
                  className="card-hover group block"
                >
                  <div className="bg-white rounded-lg overflow-hidden border border-cream-deep">
                    <div className="relative h-64 bg-cream-warm overflow-hidden">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gold opacity-20">
                          <Sparkles className="w-16 h-16" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 space-y-3">
                      <span className="inline-block text-xs font-medium text-gold px-2 py-1 bg-gold/5 rounded">
                        {product.category}
                      </span>
                      <h3 className="font-playfair text-lg text-richblack line-clamp-2 group-hover:text-gold transition-colors">
                        {product.name}
                      </h3>
                      {product.purity && (
                        <p className="text-sm text-richblack-muted">{product.purity} • {product.weight}g</p>
                      )}
                      <div className="flex items-end justify-between pt-2 border-t border-cream-deep">
                        <span className="font-semibold text-richblack">₹{product.base_price.toLocaleString()}</span>
                        <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center pt-12"
        >
          <Link href="/shop" className="btn-outline-gold px-8 py-3 rounded-sm inline-flex items-center gap-2">
            View All Collections
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
