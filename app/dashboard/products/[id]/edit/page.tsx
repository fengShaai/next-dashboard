'use client';

import { notFound, useParams, usePathname, useRouter } from 'next/navigation'; // not found page
import React, { Suspense, useEffect, useState } from 'react'
import ProductForm from './product-form';
import Heading from '@/app/ui/heading';
import Separator from '@/app/ui/separator';
import { Trash2Icon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProductStore } from "@/store/productStore"; // Zustand store
import { fetchCategories } from '@/app/lib/actions';

const Page = () => {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCategories();
      setCategories(data); // Set the resolved data
    };

    fetchData();
  }, []);
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const id = Array.isArray(params.id) ? params.id[0] : params.id; // Ensure id is a string
  if (!id) notFound();
  const { deleteProduct } = useProductStore();
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        setLoading(true);
        await deleteProduct(id, pathname, router);
        toast.success("product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product.");
      }
    }
  };

  if (loading) <div>Loading...</div>

  return (
    <div>
      <div className='flex justify-between items-center'>
      <Heading 
        title='Edit product'
        description='Edit product features here'
      />
      <div>
        <Trash2Icon 
          className='text-red-500 hover:text-red-600' 
          onClick={handleDelete}
        />
      </div>
      </div>
      <Separator className='mb-4'/>
      <Suspense fallback={'Loading...'}>
        <ProductForm categories={categories} />
      </Suspense>
    </div>
  )
}

export default Page