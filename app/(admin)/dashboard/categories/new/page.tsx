import React, { Suspense } from 'react'
import CategoryForm from './category-form'
import Heading from '@/app/ui/heading'
import Separator from '@/app/ui/separator'

const Page = () => {
  return (
    <div>
      <Heading 
        title='Create category'
        description='Add a new category'
      />
      <Separator />
      <Suspense fallback={'loading...'}>
        <CategoryForm />
      </Suspense>
    </div>
  )
}

export default Page