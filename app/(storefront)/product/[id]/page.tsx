import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  params: { id: string };
};

export default async function ProductDetails({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      images: true,
      categories: { include: { category: true } },
    },
  });

  if (!product) return notFound();

  const whatsappNumber = '+94768290913'; // e.g., 94771234567
  const message = encodeURIComponent(
    `Hi, I'm interested in the product: ${product.name}. Can you tell me more about it?`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">{product.name}</h1>

      {product.images.length > 0 && (
        <Image
          src={product.images[0].url}
          alt={product.name}
          width={500}
          height={300}
          className="rounded"
        />
      )}

      <p className="mt-4 text-lg font-medium">Price: ${product.price.toString()}</p>

      <p className="mt-2 text-gray-600">
        Categories: {product.categories.map((c) => c.category.name).join(', ')}
      </p>

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="w-5 h-5"
          viewBox="0 0 24 24"
        >
          <path d="M20.5 3.5A11.94 11.94 0 0012 0C5.4 0 0 5.4 0 12c0 2.1.6 4.1 1.6 5.9L0 24l6.3-1.6A11.9 11.9 0 0012 24c6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.5-8.5zM12 22c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-3.7 1 1-3.7-.3-.4C2.5 16 2 14 2 12 2 6.5 6.5 2 12 2c2.7 0 5.2 1.1 7.1 2.9C21 6.8 22 9.3 22 12c0 5.5-4.5 10-10 10zm5.2-7.5c-.3-.2-1.7-.9-2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0c-.9-.5-1.7-1.2-2.3-2.1-.2-.3 0-.5.2-.7.2-.2.5-.6.7-1 .1-.3 0-.6 0-.8s-.7-1.7-1-2.3c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5 0-.8.4-.3.3-1 1-.9 2.5s1.3 3 1.5 3.2c.2.3 2.5 4 6 4.5.4.1.7 0 1-.3.4-.5 1.2-1.3 1.4-1.7.2-.4.1-.7 0-.8z" />
        </svg>
        Message on WhatsApp
      </a>
    </div>
  );
}
