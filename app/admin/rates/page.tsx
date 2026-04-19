'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Loader, TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface MetalRate {
  id: string;
  metal: string;
  purity: string;
  rate: number;
  source: string;
  active: boolean;
  updated_at: string;
}

export default function AdminRatesPage() {
  const router = useRouter();
  const { isAdmin, loading } = useAuth();
  const [rates, setRates] = useState<MetalRate[]>([]);
  const [loadingRates, setLoadingRates] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    metal: 'Gold',
    purity: '24K',
    rate: '',
  });

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [loading, isAdmin, router]);

  useEffect(() => {
    loadRates();
  }, []);

  const loadRates = async () => {
    try {
      setLoadingRates(true);
      const { data, error } = await supabase
        .from('metal_rates')
        .select('*')
        .order('metal', { ascending: true });

      if (error) throw error;
      setRates(data || []);
    } catch (error) {
      console.error('Error loading rates:', error);
    } finally {
      setLoadingRates(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newRate = parseFloat(formData.rate);
      const existing = rates.find(r => r.metal === formData.metal && r.purity === formData.purity);

      if (existing) {
        // Update existing rate
        const { error } = await supabase
          .from('metal_rates')
          .update({ rate: newRate, updated_at: new Date().toISOString() })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Insert new rate
        const { error } = await supabase
          .from('metal_rates')
          .insert({
            metal: formData.metal,
            purity: formData.purity,
            rate: newRate,
            source: 'MANUAL',
            active: true,
          });

        if (error) throw error;
      }

      setFormData({ metal: 'Gold', purity: '24K', rate: '' });
      setShowForm(false);
      loadRates();
    } catch (error) {
      console.error('Error saving rate:', error);
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
          <h1 className="font-playfair text-4xl text-richblack">Metal Rates Management</h1>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="btn-gold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Update Rate
          </Button>
        </div>

        {showForm && (
          <Card className="border-gold/30">
            <CardHeader>
              <CardTitle>Update Metal Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Metal</Label>
                    <select
                      value={formData.metal}
                      onChange={(e) => setFormData({ ...formData, metal: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Gold">Gold</option>
                      <option value="Silver">Silver</option>
                      <option value="Diamond">Diamond</option>
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
                    <Label>Rate (₹)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.rate}
                      onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                      placeholder="7500"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button type="submit" className="btn-gold">
                    Save Rate
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

        {loadingRates ? (
          <div className="text-center py-12">
            <Loader className="w-8 h-8 animate-spin text-gold mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rates.map((rate) => (
              <Card key={rate.id} className="border-gold/20 hover:border-gold/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{rate.metal} - {rate.purity}</span>
                    {rate.updated_at && (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Current Rate</p>
                    <p className="text-3xl font-bold text-gold">₹{rate.rate.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Source: {rate.source}</p>
                    <p className="text-xs text-gray-500">
                      Updated: {new Date(rate.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="w-full btn-outline-gold"
                    onClick={() => {
                      setFormData({
                        metal: rate.metal,
                        purity: rate.purity,
                        rate: rate.rate.toString(),
                      });
                      setShowForm(true);
                    }}
                  >
                    Update
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
