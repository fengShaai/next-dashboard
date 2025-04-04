'use client';

import { notFound, useParams, usePathname, useRouter } from 'next/navigation'; // not found page
import React, { Suspense, useState } from 'react'
import BrandForm from './brand-form';
import Heading from '@/app/ui/heading';
import Separator from '@/app/ui/separator';
import { Trash2Icon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useBrandStore } from "@/store/brandStore"; // Zustand store

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const id = Array.isArray(params.id) ? params.id[0] : params.id; // Ensure id is a string
  if (!id) notFound();
  const { deleteBrand } = useBrandStore();
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this brand?")) {
      try {
        setLoading(true);
        await deleteBrand(id, pathname, router);
        toast.success("Category deleted successfully!");
      } catch (error) {
        console.error("Error deleting brand:", error);
        toast.error("Failed to delete brand.");
      }
    }
  };

  if (loading) <div>Loading...</div>

  return (
    <div>
      <div className='flex justify-between items-center'>
      <Heading 
        title='Edit brand'
        description='Edit brand features here'
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
        <BrandForm />
      </Suspense>
    </div>
  )
}

export default Page