'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Suspense, useEffect, useState } from "react";
import { PrismaClient } from '@prisma/client'
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
import { useCategoryStore } from "@/store/categoryStore";
import { useRouter } from "next/navigation";

const prisma = new PrismaClient()

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
});

const CategoryForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { editingCategory, setEditingCategory, fetchCategories } = useCategoryStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (editingCategory) {
      form.setValue("name", editingCategory.name);
    }
  }, [editingCategory, form]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    try {
      if (editingCategory) {
        // Update category
        await axiosInstance.put(`/api/categories/${editingCategory.id}`, data);
        toast.success("Category updated successfully!");
      }
      fetchCategories();
      form.reset();
      setEditingCategory(null);
      router.push(`/dashboard/categories`);
    } catch (error) {
      console.error("Error submitting category:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="">Name</FormLabel>
              <FormControl>
                <Input disabled={loading} {...field} placeholder="Category name goes here..." className="w-[350px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          {loading? <Button disabled className="mt-4">Saving...</Button> :
          <Button className="mt-4">Save changes</Button>}
      </form>
    </Form>
  );
};

export default CategoryForm;