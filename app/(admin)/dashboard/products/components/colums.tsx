"use client"

import { ColumnDef } from "@tanstack/react-table"
import { toast } from "react-hot-toast";
import { useProductStore } from "@/store/productStore"; // Zustand store
import { useRouter } from "next/navigation"; // Import useRouter


export type Product = {
  id: string
  name: string
  price: string
  categoryIds: string[]
  isFeatured: boolean
  isArchived: boolean
  createdAt: string
  updatedAt: string
  images: string[]
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

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
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
      const product = row.original;
      const router = useRouter(); // Use router for navigation
      const { setEditingProduct, deleteProduct } = useProductStore();

      const handleEdit = () => {
        setEditingProduct(product);
        router.push(`/dashboard/products/${product.id}/edit`);
      };

      const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this product?")) {
          try {
            await deleteProduct(product.id);
            toast.success("product deleted successfully!");
            // window.location.reload();
          } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product.");
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
