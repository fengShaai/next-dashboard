"use client"

import { ColumnDef } from "@tanstack/react-table"
import { toast } from "react-hot-toast";
import { useTagStore } from "@/store/tagStore"; // Zustand store
import { useRouter } from "next/navigation"; // Import useRouter

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Tag = {
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

export const columns: ColumnDef<Tag>[] = [
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
      const tag = row.original;
      const router = useRouter(); // Use router for navigation
      const { setEditingTag, deleteTag } = useTagStore();

      const handleEdit = () => {
        setEditingTag(tag);
        router.push(`/dashboard/tags/${tag.id}/edit`);
      };

      const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this tag?")) {
          try {
            await deleteTag(tag.id);
            toast.success("tag deleted successfully!");
            // window.location.reload();
          } catch (error) {
            console.error("Error deleting tag:", error);
            toast.error("Failed to delete tag.");
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
