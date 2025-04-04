import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";

type Product = {
  id: string;
  name: string;
  price: string; // Ensure this matches the type used in your form
  categoryIds: string[]; // Optional category selection
  isFeatured: boolean;
  isArchived: boolean;
  images: string[];
};

type ProductStore = {
  products: Product[];
  count: number | 0;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  fetchProducts: () => Promise<void>;
  deleteProduct: (id: string, pathname?: string, router?: any) => Promise<void>;
};

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  editingProduct: null,
  count: 0,
  setEditingProduct: (product) => set({ editingProduct: product }),

  fetchProducts: async () => {
    try {
      const response = await axiosInstance.get("/api/products");
      set({ products: response.data.products, count: response.data.count });
    } catch (error) {
      console.error("Failed to fetch products:", error);
      throw new Error();
    }
  },

  deleteProduct: async (id, pathname, router) => {
    // Optimistic update: Remove the product from the state immediately
    set((state) => ({
        products: state.products.filter((product) => product.id !== id),
    }));
  
    try {
      await axiosInstance.delete(`/api/products/${id}`);
      // Optionally, re-fetch products after deletion
      await useProductStore.getState().fetchProducts();
  
      if (pathname === `/dashboard/products/${id}/edit`) {
        router.push(`/dashboard/products`);
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    }
  },
}));
