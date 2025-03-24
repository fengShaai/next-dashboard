"use client"; // Ensures this is treated as a Client Component

import { useEffect, useState } from "react";
import Separator from "@/app/ui/separator";
import CategoryClient from "./components/client";
import { Category, columns } from "./components/colums";
import { DataTable } from "./components/data-table";
import { format } from "date-fns";
import { useCategoryStore } from "@/store/categoryStore";

const Page = () => {
  const { fetchCategories, count, categories } = useCategoryStore();
  const [loading, setLoading] = useState(true); // Default: loading is true

  useEffect(() => {
    const loadData = async () => {
      setLoading(true); // Start loading
      await fetchCategories(); // Fetch categories
      setLoading(false); // Stop loading after fetching
    };
    loadData();
  }, []);

  // Format categories only if data is available
  const formattedCategories: Category[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(new Date(item.createdAt), "MMMM do, yyyy"),
    updatedAt: format(new Date(item.updatedAt), "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 px-8 pt-6">
        <CategoryClient count={count} />
        <Separator />
        <div className="container mx-auto">
          {loading ? (
            <p className="text-center text-gray-500">Loading categories...</p> // Show loading text
          ) : (
            <DataTable columns={columns} data={formattedCategories} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
