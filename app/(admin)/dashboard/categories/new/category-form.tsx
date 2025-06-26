'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Suspense } from "react"; // only use inside of server component
import { PrismaClient } from '@prisma/client'
import toast from "react-hot-toast";

const prisma = new PrismaClient()

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
});

const CategoryForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    try {
      const response = await fetch('/api/categories/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }); 
      if (!response.ok) {
        throw new Error('Failed to create category');
      }
      const result = await response.json();
      console.log('Category created:', result);
      toast.success('Category created successfully!')
    } catch (error) {
      console.error('Error in category-submitform:', error);
      toast.error('Something went wrong.')
      throw error;
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
                <Input {...field} placeholder="Category name goes here..." className="w-[350px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
          <Button className="mt-4">Create</Button>
        
      </form>
    </Form>
  );
};

export default CategoryForm;