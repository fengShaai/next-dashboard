// components/ProductList.tsx
import { format } from "date-fns";
import { Product, columns } from "./colums";
import { DataTable } from "./data-table";
import prisma from '@/lib/prisma';
import { formatLKR } from "@/app/lib/utils";

const ProductList = async () => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      images: true,
      categories: {
        include: {
          category: true,
        }
      }
    }
  });

  const formattedProducts: Product[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: formatLKR(product.price.toNumber()).toString(),
    categoryIds: product.categories.map((category) => category.category.id), // Keep as an array of strings
    images: product.images.map((image) => image.url),
    createdAt: format(new Date(product.createdAt), "MMMM do, yyyy"),
    updatedAt: format(new Date(product.updatedAt), "MMMM do, yyyy"),
    isFeatured: product.isFeatured || false,
    isArchived: product.isArchived || false,
  }));

  return <DataTable columns={columns} data={formattedProducts} />;
};

export default ProductList;