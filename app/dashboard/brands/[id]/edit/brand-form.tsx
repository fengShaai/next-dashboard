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
import { useBrandStore } from "@/store/brandStore";
import { useRouter } from "next/navigation";

const prisma = new PrismaClient()

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "brand name must be at least 2 characters.",
  }),
});

const BrandForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { editingBrand, setEditingBrand, fetchBrands } = useBrandStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (editingBrand) {
      form.setValue("name", editingBrand.name);
    }
  }, [editingBrand, form]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    try {
      if (editingBrand) {
        // Update brand
        await axiosInstance.put(`/api/brands/${editingBrand.id}`, data);
        toast.success("brand updated successfully!");
      }
      fetchBrands();
      form.reset();
      setEditingBrand(null);
      router.push(`/dashboard/brands`);
    } catch (error) {
      console.error("Error submitting brand:", error);
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
                <Input disabled={loading} {...field} placeholder="brand name goes here..." className="w-[350px]" />
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

export default BrandForm;