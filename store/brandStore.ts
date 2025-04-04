import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";

type Brand = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type BrandStore = {
  brands: Brand[];
  count: number | 0;
  editingBrand: Brand | null;
  setEditingBrand: (brand: Brand | null) => void;
  fetchBrands: () => Promise<void>;
  deleteBrand: (id: string, pathname?: string, router?: any) => Promise<void>;
};

export const useBrandStore = create<BrandStore>((set) => ({
  brands: [],
  editingBrand: null,
  count: 0,
  setEditingBrand: (brand) => set({ editingBrand: brand }),

  fetchBrands: async () => {
    try {
      const response = await axiosInstance.get("/api/brands");
      set({ brands: response.data.brands, count: response.data.count });
    } catch (error) {
      console.error("Failed to fetch brands:", error);
      throw new Error();
    }
  },

  deleteBrand: async (id, pathname, router) => {
    // Optimistic update: Remove the Brand from the state immediately
    set((state) => ({
      brands: state.brands.filter((brand) => brand.id !== id),
    }));
  
    try {
      await axiosInstance.delete(`/api/brands/${id}`);
      // Optionally, re-fetch brands after deletion
      await useBrandStore.getState().fetchBrands();
  
      if (pathname === `/dashboard/brands/${id}/edit`) {
        router.push(`/dashboard/brands`);
      }
    } catch (error) {
      console.error("Failed to delete Brand:", error);
      toast.error("Failed to delete Brand");
    }
  },
}));
