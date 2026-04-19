'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/product-card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import Footer from '@/components/layout/Footer';

export default function DiamondPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPurities, setSelectedPurities] = useState<string[]>([]);

  const purities = ['VVS1', 'VVS2', 'VS1', 'VS2'];

  useEffect(() => {
    fetchDiamondProducts();
  }, []);

  const fetchDiamondProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'Diamond')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to fetch diamond products:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePurity = (purity: string) => {
    setSelectedPurities((prev) =>
      prev.includes(purity) ? prev.filter((p) => p !== purity) : [...prev, purity]
    );
  };

  const filteredProducts = products.filter((product) => {
    if (selectedPurities.length > 0 && !selectedPurities.includes(product.purity)) {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 overflow-hidden bg-gradient-to-b from-white to-cream-warm">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
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
            className="flex items-center justify-center gap-2 text-blue-500"
          >
            <Sparkles className="w-5 h-5" />
            <span className="section-label">Exquisite Diamond Collection</span>
            <Sparkles className="w-5 h-5" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-playfair text-5xl md:text-6xl text-richblack leading-tight"
          >
            Brilliant Forever
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-richblack-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Experience the unparalleled brilliance of our premium diamond collection. Each stone is certified and selected for its exceptional cut, clarity, and radiance. Discover timeless elegance that sparkles forever.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/shop"
              className="btn-outline-gold px-6 py-3 rounded-sm hover:shadow-lg inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4 rotate-180" />
              Back to Shop
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-xl border border-cream-deep shadow-sm sticky top-24"
            >
              <h3 className="font-semibold text-lg mb-4 pb-3 border-b border-cream-deep">
                Clarity
              </h3>
              <div className="space-y-3">
                {purities.map((purity) => (
                  <div key={purity} className="flex items-center space-x-3">
                    <Checkbox
                      id={`clarity-${purity}`}
                      checked={selectedPurities.includes(purity)}
                      onCheckedChange={() => togglePurity(purity)}
                    />
                    <Label
                      htmlFor={`clarity-${purity}`}
                      className="text-gray-700 cursor-pointer font-medium"
                    >
                      {purity}
                    </Label>
                  </div>
                ))}
              </div>

              {selectedPurities.length > 0 && (
                <button
                  onClick={() => setSelectedPurities([])}
                  className="w-full mt-6 py-2 text-sm text-blue-500 font-semibold border border-blue-500 rounded-md hover:bg-blue-500/5 transition"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          </div>

          {/* Product Grid */}
          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-8">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-gray-600 font-medium"
              >
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </motion.p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05, delayChildren: 0 },
                  },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                    }}
                  >
                    <ProductCard product={product} showPriceBreakdown />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-cream-deep shadow-sm">
                <p className="text-xl text-gray-500">
                  No diamond products found matching your filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4Cs Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h2 className="font-playfair text-3xl text-richblack mb-4">
                The 4 Cs of Diamonds
              </h2>
              <div className="gold-divider w-12 h-px mb-6" />
              <p className="text-richblack-muted text-lg leading-relaxed mb-8">
                Understanding diamond quality through the universally accepted 4 Cs framework helps you make an informed choice for your perfect diamond.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3 bg-cream-warm p-6 rounded-lg">
                  <h3 className="font-semibold text-richblack text-lg">Cut</h3>
                  <p className="text-richblack-muted">
                    Determines how well a diamond reflects light. A well-cut diamond exhibits maximum brilliance and sparkle.
                  </p>
                </div>
                <div className="space-y-3 bg-cream-warm p-6 rounded-lg">
                  <h3 className="font-semibold text-richblack text-lg">Clarity</h3>
                  <p className="text-richblack-muted">
                    Measures the absence of inclusions. VVS (Very Very Slightly Included) diamonds are nearly flawless to the eye.
                  </p>
                </div>
                <div className="space-y-3 bg-cream-warm p-6 rounded-lg">
                  <h3 className="font-semibold text-richblack text-lg">Color</h3>
                  <p className="text-richblack-muted">
                    The absence of color is most prized. Diamonds are graded from D (colorless) to Z (light color).
                  </p>
                </div>
                <div className="space-y-3 bg-cream-warm p-6 rounded-lg">
                  <h3 className="font-semibold text-richblack text-lg">Carat</h3>
                  <p className="text-richblack-muted">
                    Measures the weight of the diamond. One carat equals 200 milligrams. Weight significantly impacts value.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
