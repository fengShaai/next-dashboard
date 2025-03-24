"use client"

import { ColumnDef } from "@tanstack/react-table"
import { toast } from "react-hot-toast";
import { useCategoryStore } from "@/store/categoryStore"; // Zustand store
import { useRouter } from "next/navigation"; // Import useRouter

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Category = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}
import { DeleteIcon, EditIcon, MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "createdAt",
    header: "CreatedAt",
  },
  {
    accessorKey: "updatedAt",
    header: "UpdatedAt",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original;
      const router = useRouter(); // Use router for navigation
      const { setEditingCategory, deleteCategory } = useCategoryStore();

      const handleEdit = () => {
        setEditingCategory(category);
        router.push(`/dashboard/categories/${category.id}/edit`);
      };

      const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this category?")) {
          try {
            await deleteCategory(category.id);
            toast.success("Category deleted successfully!");
            // window.location.reload();
          } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Failed to delete category.");
          }
        }
      };
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {/* <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleEdit}><EditIcon /> Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}><DeleteIcon /> Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
