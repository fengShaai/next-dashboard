import Separator from "@/app/ui/separator"
import CategoryClient from "./components/client"
import prisma from "@/lib/prisma"
import { Category, columns } from "./components/colums"
import { DataTable } from "./components/data-table"
import {format} from 'date-fns';
 
async function getData() {
  return await prisma.category.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })
}
async function getCount() {
  return await prisma.category.count();
}

const Page = async () => {
  const categories = await getData();
  const count = await getCount();
  const formattedCategories: Category[] = categories.map((item)=>({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    updatedAt: format(item.updatedAt, 'MMMM do, yyyy')
  }))
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 px-8 pt-6">
        <CategoryClient count={count} />
        <Separator />
        <div className="container mx-auto py-10">
      <DataTable columns={columns} data={formattedCategories} />
    </div>
      </div>
    </div>
  )
}

export default Page