"use client"; // Ensures this is treated as a Client Component

import { useEffect, useState } from "react";
import Separator from "@/app/ui/separator";
import TagClient from "./components/client";
import { Tag, columns } from "./components/colums";
import { DataTable } from "./components/data-table";
import { format } from "date-fns";
import { useTagStore } from "@/store/tagStore";

const Page = () => {
  const { fetchTags, count, tags } = useTagStore();
  const [loading, setLoading] = useState(true); // Default: loading is true

  useEffect(() => {
    const loadData = async () => {
      setLoading(true); // Start loading
      await fetchTags(); // Fetch tags
      setLoading(false); // Stop loading after fetching
    };
    loadData();
  }, []);

  // Format tags only if data is available
  const formattedTags: Tag[] = tags.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(new Date(item.createdAt), "MMMM do, yyyy"),
    updatedAt: format(new Date(item.updatedAt), "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 px-8 pt-6">
        <TagClient count={count} />
        <Separator />
        <div className="container mx-auto">
          {loading ? (
            <p className="text-center text-gray-500">Loading tags...</p> // Show loading text
          ) : (
            <DataTable columns={columns} data={formattedTags} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
