'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
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
      await prisma.category.create({data:data});
    } catch (error) {
      console.log('Error in category-submitform', error);
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
              <FormLabel className="text-black">Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Category name goes here..." className="w-[350px]" />
              </FormControl>
            </FormItem>
          )}
        />
        <Suspense fallback={<Button disabled>Loading...</Button>}>
          <Button className="mt-4">Create</Button>
        </Suspense>
      </form>
    </Form>
  );
};

export default CategoryForm;