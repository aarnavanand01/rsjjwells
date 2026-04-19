'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function RoyalCollection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('in_stock', true)
          .limit(8);

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4 mb-16"
      >
        <span className="section-label">Exclusive Selection</span>
        <h2 className="font-playfair text-4xl md:text-5xl text-richblack">
          The Royal Collection
        </h2>
        <div className="gold-divider w-12 h-px mx-auto" />
        <p className="text-richblack-muted max-w-2xl mx-auto">
          Curated pieces from our finest artisans. Each item represents a moment of timeless beauty.
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-cream-deep rounded-lg h-96 animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="group"
            >
              <Link href={`/product/${product.id}`}>
                <div className="relative overflow-hidden rounded-lg bg-cream-warm border border-cream-deep card-hover h-80 mb-4">
                  <div className="relative w-full h-full">
                    {product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gold/20">
                        <Sparkles className="w-20 h-20" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-richblack/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute bottom-0 left-0 right-0 p-4 flex gap-3"
                    >
                      <button className="flex-1 btn-gold py-2 rounded-sm text-sm inline-flex items-center justify-center gap-2">
                        View Details
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </motion.div>
                  </div>

                  {product.featured && (
                    <div className="absolute top-3 right-3 bg-gold text-richblack px-3 py-1 rounded-sm text-xs font-semibold tracking-widest uppercase">
                      Featured
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-playfair text-lg text-richblack group-hover:text-gold transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  {product.purity && (
                    <p className="text-xs text-richblack-muted">
                      {product.purity} • {product.weight}g
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-semibold text-gold">
                      ₹{product.base_price.toLocaleString()}
                    </span>
                    <span className="text-xs bg-gold/10 text-gold px-2 py-1 rounded">
                      {product.category}
                    </span>
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
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center mt-16"
      >
        <Link
          href="/shop"
          className="btn-outline-gold px-8 py-3 rounded-sm inline-flex items-center gap-2"
        >
          Explore Full Catalog
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </section>
  );
}
