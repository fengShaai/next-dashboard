'use server'
import SidebarFilters from '@/components/storeFront/sidebarFilter';
import ProductGrid from '@/components/storeFront/productGrid';
import prisma from '@/lib/prisma';
import Pagination from '@/components/storeFront/pagination';

type Props = {
  searchParams: {
    category?: string;
    sort?: string;
    page?: string; // ← pagination
  };
};
export default async function Home({ searchParams }: Props) {
  const { category, sort, page = '1' } = searchParams;
  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = 10; // show 10 products per page

  const where = {
    isArchived: true,
    ...(category && {
      categories: {
        some: {
          category: {
            name: category,
          },
        },
      },
    }),
  };

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    skip: (pageNumber - 1) * pageSize,
    take: pageSize,
    include: {
      images: true,
      categories: { include: { category: true } },
    },
  });

  const total = await prisma.product.count({ where });
  const totalPages = Math.ceil(total / pageSize);

  return (
    <main className="grid grid-cols-1 md:grid-cols-4 max-w-7xl mx-auto gap-6 p-4">
      <div className="md:col-span-1">
        <SidebarFilters />
      </div>
      <div className="md:col-span-3">
        <ProductGrid products={products} />
      </div>

      {/* Pagination */}
      <div className="mt-4 flex gap-2">
      <Pagination currentPage={pageNumber} totalPages={totalPages} />
      </div>
    </main>
  );
}
