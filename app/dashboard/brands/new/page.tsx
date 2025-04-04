import React, { Suspense } from 'react'
import BrandForm from './brand-form'
import Heading from '@/app/ui/heading'
import Separator from '@/app/ui/separator'

const Page = () => {
  return (
    <div>
      <Heading 
        title='Create brand'
        description='Add a new brand'
      />
      <Separator />
      <Suspense fallback={'loading...'}>
        <BrandForm />
      </Suspense>
    </div>
  )
}

export default Page