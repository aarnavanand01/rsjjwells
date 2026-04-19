'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Edit2, Trash2, Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';

export default function AdminProductsPage() {
  const router = useRouter();
  const { isAdmin, user, loading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading_products, setLoadingProducts] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Gold',
    purity: '24K',
    weight: '',
    basePrice: '',
    makingCharge: '',
    description: '',
  });

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [loading, isAdmin, router]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        purity: formData.purity,
        weight: parseFloat(formData.weight),
        base_price: parseFloat(formData.basePrice),
        making_charge: parseFloat(formData.makingCharge),
        description: formData.description,
        images: [],
        featured: false,
      };

      const { error } = await supabase
        .from('products')
        .insert(payload);

      if (error) throw error;

      setFormData({
        name: '',
        category: 'Gold',
        purity: '24K',
        weight: '',
        basePrice: '',
        makingCharge: '',
        description: '',
      });
      setShowForm(false);
      loadProducts();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="p-2 hover:bg-cream-deep rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-richblack" />
          </button>
          <h1 className="font-playfair text-4xl text-richblack">Products Management</h1>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="btn-gold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>

        {showForm && (
          <Card className="border-gold/30">
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Product Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Gold Ring"
                      required
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Gold">Gold</option>
                      <option value="Diamond">Diamond</option>
                      <option value="Silver">Silver</option>
                    </select>
                  </div>
                  <div>
                    <Label>Purity</Label>
                    <Input
                      value={formData.purity}
                      onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
                      placeholder="24K"
                    />
                  </div>
                  <div>
                    <Label>Weight (grams)</Label>
                    <Input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="10"
                      required
                    />
                  </div>
                  <div>
                    <Label>Base Price (₹)</Label>
                    <Input
                      type="number"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <Label>Making Charge (₹)</Label>
                    <Input
                      type="number"
                      value={formData.makingCharge}
                      onChange={(e) => setFormData({ ...formData, makingCharge: e.target.value })}
                      placeholder="5000"
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Product description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={4}
                  />
                </div>
                <div className="flex gap-4">
                  <Button type="submit" className="btn-gold">
                    Save Product
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn-outline-gold"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading_products ? (
          <div className="text-center py-12">
            <Loader className="w-8 h-8 animate-spin text-gold mx-auto" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-cream-deep">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-richblack">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-richblack">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-richblack">Weight</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-richblack">Base Price</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-richblack">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-cream-deep/50">
                    <td className="px-4 py-3 text-sm text-richblack">{product.name}</td>
                    <td className="px-4 py-3 text-sm text-richblack">{product.category}</td>
                    <td className="px-4 py-3 text-sm text-richblack">{product.weight}g</td>
                    <td className="px-4 py-3 text-sm text-richblack">₹{product.base_price}</td>
                    <td className="px-4 py-3 text-sm flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                        disabled
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex items-center gap-1"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
