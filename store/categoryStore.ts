import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";

type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type CategoryStore = {
  categories: Category[];
  count: number | 0;
  editingCategory: Category | null;
  setEditingCategory: (category: Category | null) => void;
  fetchCategories: () => Promise<void>;
  deleteCategory: (id: string, pathname?: string, router?: any) => Promise<void>;
};

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  editingCategory: null,
  count: 0,
  setEditingCategory: (category) => set({ editingCategory: category }),

  fetchCategories: async () => {
    try {
      const response = await axiosInstance.get("/api/categories");
      set({ categories: response.data.categories, count: response.data.count });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      throw new Error();
    }
  },

  deleteCategory: async (id, pathname, router) => {
    // Optimistic update: Remove the category from the state immediately
    set((state) => ({
      categories: state.categories.filter((category) => category.id !== id),
    }));
  
    try {
      await axiosInstance.delete(`/api/categories/${id}`);
      // Optionally, re-fetch categories after deletion
      await useCategoryStore.getState().fetchCategories();
  
      if (pathname === `/dashboard/categories/${id}/edit`) {
        router.push(`/dashboard/categories`);
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error("Failed to delete category");
    }
  },
}));
