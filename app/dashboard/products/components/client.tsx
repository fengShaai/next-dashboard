'use client';

import { Button } from "@/app/ui/button";
import Heading from "@/app/ui/heading";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const ProductClient = ({count}:{count: number}) => {
  const router = useRouter();
  return (
    <div className="flex justify-between items-center">
        <Heading
          title={`Products(${count})`}
          description="Manange products for your store"
        />
        <Button
          onClick={() => {router.push('/dashboard/products/new')}}
        >
          <PlusIcon className="w-4 h-4 mr-2  text-white" /> 
          Add New
        </Button>
    </div>
  )
}

export default ProductClient;