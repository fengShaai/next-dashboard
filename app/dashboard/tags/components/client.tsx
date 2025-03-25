'use client';

import { Button } from "@/app/ui/button";
import Heading from "@/app/ui/heading";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const TagClient = ({count}:{count: number}) => {
  const router = useRouter();
  return (
    <div className="flex justify-between items-center">
        <Heading
          title={`Tags(${count})`}
          description="Manange tags for your store"
        />
        <Button
          onClick={() => {router.push('/dashboard/tags/new')}}
        >
          <PlusIcon className="w-4 h-4 mr-2  text-white" /> 
          Add New
        </Button>
    </div>
  )
}

export default TagClient;