'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product, Category } from '@/lib/types';
import { ProductCard } from '@/components/product-card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import Footer from '@/components/layout/Footer';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters state
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedPurities, setSelectedPurities] = useState<string[]>([]);
  
  const categories: Category[] = ['Gold', 'Diamond', 'Silver', 'Digital Gold'];
  const purities = ['24K', '22K', '18K', 'Sterling'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const toggleCategory = (category: Category) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const togglePurity = (purity: string) => {
    setSelectedPurities(prev => 
      prev.includes(purity) ? prev.filter(p => p !== purity) : [...prev, purity]
    );
  };

  const filteredProducts = products.filter(product => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;
    if (selectedPurities.length > 0 && !selectedPurities.includes(product.purity)) return false;
    return true;
  });

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Our Collection</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Discover our exquisite range of finely crafted jewelry, where prices dynamically update to match the latest live market rates.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 shrink-0 space-y-8">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-lg mb-4 pb-2 border-b">Metal Type</h3>
              <div className="space-y-3">
                {categories.map(category => (
                  <div key={category} className="flex items-center space-x-3">
                    <Checkbox id={`cat-${category}`} checked={selectedCategories.includes(category)} onCheckedChange={() => toggleCategory(category)} />
                    <Label htmlFor={`cat-${category}`} className="text-gray-700 cursor-pointer">{category}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-lg mb-4 pb-2 border-b">Purity</h3>
              <div className="space-y-3">
                {purities.map(purity => (
                  <div key={purity} className="flex items-center space-x-3">
                    <Checkbox id={`pur-${purity}`} checked={selectedPurities.includes(purity)} onCheckedChange={() => togglePurity(purity)} />
                    <Label htmlFor={`pur-${purity}`} className="text-gray-700 cursor-pointer">{purity}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* A simple reset button */}
            {(selectedCategories.length > 0 || selectedPurities.length > 0) && (
              <button 
                onClick={() => { setSelectedCategories([]); setSelectedPurities([]); }}
                className="w-full py-2 text-sm text-[#C5A059] font-semibold border border-[#C5A059] rounded-md hover:bg-[#fbf9f4] transition"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {/* Product Grid */}
          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-500 font-medium">Showing {filteredProducts.length} Results</p>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xl text-gray-500">No products found matching your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
