"use client"; // Ensures this is treated as a Client Component

import { useEffect, useState } from "react";
import Separator from "@/app/ui/separator";
import BrandClient from "./components/client";
import { Brand, columns } from "./components/colums";
import { DataTable } from "./components/data-table";
import { format } from "date-fns";
import { useBrandStore } from "@/store/brandStore";

const Page = () => {
  const { fetchBrands, count, brands } = useBrandStore();
  const [loading, setLoading] = useState(true); // Default: loading is true

  useEffect(() => {
    const loadData = async () => {
      setLoading(true); // Start loading
      await fetchBrands(); // Fetch brands
      setLoading(false); // Stop loading after fetching
    };
    loadData();
  }, []);

  // Format brands only if data is available
  const formattedBrands: Brand[] = brands.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(new Date(item.createdAt), "MMMM do, yyyy"),
    updatedAt: format(new Date(item.updatedAt), "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 px-8 pt-6">
        <BrandClient count={count} />
        <Separator />
        <div className="container mx-auto">
          {loading ? (
            <p className="text-center text-gray-500">Loading brands...</p> // Show loading text
          ) : (
            <DataTable columns={columns} data={formattedBrands} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
