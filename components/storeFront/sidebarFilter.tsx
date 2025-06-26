'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Category {
  id: string;
  name: string;
}

export default function SidebarFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories))
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  const handleFilter = (key: string, value: string): void => {
    const params = new URLSearchParams(window.location.search);
    if (params.get(key) === value) {
      params.delete(key); // toggle off
    } else {
      params.set(key, value); // apply new filter
    }
    router.push(`/?${params.toString()}`);
  };

  const activeCategory = searchParams.get('category');
  const activeSort = searchParams.get('sort');

  if (!categories.length) return <p>Loading categories...</p>;

  return (
    <aside className="space-y-4 p-4 bg-white rounded shadow-sm">
      <div>
        <h3 className="font-semibold mb-2">Categories</h3>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleFilter('category', cat.name)}
            className={`block text-left text-sm ${
              activeCategory === cat.name ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <div>
        <h3 className="font-semibold mb-2">Sort By</h3>
        <button
          onClick={() => handleFilter('sort', 'price_asc')}
          className={`block text-sm ${activeSort === 'price_asc' ? 'text-blue-600 font-semibold' : ''}`}
        >
          Price: Low to High
        </button>
        <button
          onClick={() => handleFilter('sort', 'price_desc')}
          className={`block text-sm ${activeSort === 'price_desc' ? 'text-blue-600 font-semibold' : ''}`}
        >
          Price: High to Low
        </button>
        <button
          onClick={() => handleFilter('sort', 'newest')}
          className={`block text-sm ${!activeSort || activeSort === 'newest' ? 'text-blue-600 font-semibold' : ''}`}
        >
          Newest First
        </button>
      </div>
    </aside>
  );
}
