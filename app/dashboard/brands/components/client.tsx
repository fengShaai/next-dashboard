'use client';

import { Button } from "@/app/ui/button";
import Heading from "@/app/ui/heading";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const BrandClient = ({count}:{count: number}) => {
  const router = useRouter();
  return (
    <div className="flex justify-between items-center">
        <Heading
          title={`Brands(${count})`}
          description="Manange brands for your store"
        />
        <Button
          onClick={() => {router.push('/dashboard/brands/new')}}
        >
          <PlusIcon className="w-4 h-4 mr-2  text-white" /> 
          Add New
        </Button>
    </div>
  )
}

export default BrandClient;