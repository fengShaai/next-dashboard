import React, { Suspense } from 'react'
import ProductForm from './product-form'
import Heading from '@/app/ui/heading'
import Separator from '@/app/ui/separator'
import prisma from '@/lib/prisma'

const  Page = async () => {
  const response = await prisma.category.findMany();
    const data = response.map((category) => ({
      id: category.id,
      name: category.name,
    }));
  return (
    <div>
      <Heading
        title='Create product'
        description='Add a new product'
      />
      <Separator />
      <Suspense fallback={'loading...'}>
        <ProductForm categories={data} />
      </Suspense>
    </div>
  )
}

export default Page