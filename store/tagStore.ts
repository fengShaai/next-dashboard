import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";

type Tag = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type TagStore = {
  tags: Tag[];
  count: number | 0;
  editingTag: Tag | null;
  setEditingTag: (tag: Tag | null) => void;
  fetchTags: () => Promise<void>;
  deleteTag: (id: string, pathname?: string, router?: any) => Promise<void>;
};

export const useTagStore = create<TagStore>((set) => ({
  tags: [],
  editingTag: null,
  count: 0,
  setEditingTag: (tag) => set({ editingTag: tag }),

  fetchTags: async () => {
    try {
      const response = await axiosInstance.get("/api/tags");
      set({ tags: response.data.tags, count: response.data.count });
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      throw new Error();
    }
  },

  deleteTag: async (id, pathname, router) => {
    // Optimistic update: Remove the Tag from the state immediately
    set((state) => ({
      tags: state.tags.filter((tag) => tag.id !== id),
    }));
  
    try {
      await axiosInstance.delete(`/api/tags/${id}`);
      // Optionally, re-fetch tags after deletion
      await useTagStore.getState().fetchTags();
  
      if (pathname === `/dashboard/tags/${id}/edit`) {
        router.push(`/dashboard/tags`);
      }
    } catch (error) {
      console.error("Failed to delete Tag:", error);
      toast.error("Failed to delete Tag");
    }
  },
}));
