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
import { useTagStore } from "@/store/tagStore";
import { useRouter } from "next/navigation";

const prisma = new PrismaClient()

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "tag name must be at least 2 characters.",
  }),
});

const TagForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { editingTag, setEditingTag, fetchTags } = useTagStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (editingTag) {
      form.setValue("name", editingTag.name);
    }
  }, [editingTag, form]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    try {
      if (editingTag) {
        // Update tag
        await axiosInstance.put(`/api/tags/${editingTag.id}`, data);
        toast.success("tag updated successfully!");
      }
      fetchTags();
      form.reset();
      setEditingTag(null);
      router.push(`/dashboard/tags`);
    } catch (error) {
      console.error("Error submitting tag:", error);
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
                <Input disabled={loading} {...field} placeholder="tag name goes here..." className="w-[350px]" />
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

export default TagForm;