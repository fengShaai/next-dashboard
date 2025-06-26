'use client';

import { useSearchParams } from 'next/navigation';

export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const searchParams = useSearchParams();

  return (
    <div className="flex gap-2">
      {Array.from({ length: totalPages }).map((_, i) => {
        const p = i + 1;

        // Convert the current URLSearchParams to a real string-based one
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(p));

        return (
          <a
            key={p}
            href={`/?${params.toString()}`}
            className={`px-3 py-1 rounded border ${
              p === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
            }`}
          >
            {p}
          </a>
        );
      })}
    </div>
  );
}
