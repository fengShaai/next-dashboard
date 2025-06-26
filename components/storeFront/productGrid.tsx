import { Product, ProductCategory, Image } from '@prisma/client';
import Link from 'next/link';

type ProductWithRelations = Product & {
  images: Image[];
  categories: (ProductCategory & {
    category: { name: string };
  })[];
};
export default function ProductGrid({ products }: { products: ProductWithRelations[] }) {
  console.log('Products:', products); // Debugging line
  if (!products.length) {
    return <p>No products found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link key={product.id} href={`/product/${product.id}`}>
          <div key={product.id} className="border p-4 rounded shadow-sm">
            <img
              src={product.images[0]?.url || '/placeholder.png'}
              alt={product.name}
              className="w-full h-48 object-cover rounded mb-2"
            />
            <h3 className="text-lg font-medium">{product.name}</h3>
            <p className="text-gray-700">LKR {product.price.toString()}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
