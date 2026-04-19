'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/storage';
import { Product, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AddProductPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<Partial<Product>>({
    defaultValues: {
      category: 'Gold',
      purity: '24K',
      in_stock: true,
      featured: false,
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const onSubmit = async (data: Partial<Product>) => {
    setLoading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of images) {
        const url = await uploadImage(file, 'product-images');
        uploadedUrls.push(url);
      }

      const productPayload = {
        name: data.name,
        description: data.description,
        category: data.category,
        purity: data.purity,
        weight: Number(data.weight),
        making_charge: Number(data.making_charge),
        base_price: Number(data.base_price),
        images: uploadedUrls,
        in_stock: data.in_stock,
        featured: data.featured,
      };

      const { error } = await supabase.from('products').insert([productPayload]);

      if (error) throw error;

      toast({
        title: 'Product Added',
        description: 'The product has been successfully added to the catalog.',
      });
      
      reset();
      setImages([]);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to add product.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>Upload a new piece of jewelry to the catalog.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" {...register('name', { required: true })} placeholder="e.g. 24K Gold Pearl Necklace" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(val) => setValue('category', val as Category)} defaultValue="Gold">
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gold">Gold</SelectItem>
                    <SelectItem value="Diamond">Diamond</SelectItem>
                    <SelectItem value="Silver">Silver</SelectItem>
                    <SelectItem value="Digital Gold">Digital Gold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purity">Purity (e.g., 24K, 22K)</Label>
                <Input id="purity" {...register('purity', { required: true })} placeholder="24K" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (grams)</Label>
                <Input id="weight" type="number" step="0.01" {...register('weight', { required: true })} placeholder="15.5" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="making_charge">Making Charge (₹)</Label>
                <Input id="making_charge" type="number" step="0.01" {...register('making_charge', { required: true })} placeholder="1200" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="base_price">Base Price (if applicable)</Label>
                <Input id="base_price" type="number" step="0.01" {...register('base_price')} placeholder="0" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description', { required: true })} placeholder="Beautifully crafted..." rows={4} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">Product Images</Label>
              <Input id="images" type="file" multiple accept="image/*" onChange={handleImageChange} required />
              <p className="text-xs text-muted-foreground">Select one or more images to upload.</p>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Uploading...' : 'Add Product'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
