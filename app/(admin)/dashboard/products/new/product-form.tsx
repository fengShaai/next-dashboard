"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
import { useProductStore } from "@/store/productStore";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FormSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Enter a valid price." }),
  categoryIds: z.array(z.string()).optional(),
  isFeatured: z.boolean().default(false),
  isArchived: z.boolean().default(false),
  images: z.array(z.any()).optional(), // Accept multiple images
});

const ProductForm = ({ categories }: { categories: { id: string; name: string }[] }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { fetchProducts } = useProductStore();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      form.setValue("images", files);
      // Generate image previews
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      price: "",
      categoryIds: [],
      isFeatured: false,
      isArchived: false,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price);
      if (data.categoryIds) {
        data.categoryIds.forEach((categoryId) => {
          formData.append("categoryIds", categoryId); // Append each category ID
        });
      }
      formData.append("isFeatured", data.isFeatured.toString());
      formData.append("isArchived", data.isArchived.toString());
      // Append each image file
      if (data.images) {
        data.images.forEach((image) => formData.append("images", image));
      }
      // Debug: Log FormData keys and values
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      await axiosInstance.post("/api/products", formData);
      toast.success("Product created successfully!");
      fetchProducts();
      form.reset();
      setImagePreviews([]);
      //router.push(`/dashboard/products`);
    } catch (error) {
      console.error("Error submitting Product:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Product Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input disabled={loading} {...field} placeholder="Product name..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input disabled={loading} {...field} placeholder="Enter price" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category Selection */}
        <FormField
          control={form.control}
          name="categoryIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <Select
                disabled={loading}
                onValueChange={(value) => {
                  // Ensure field.value is an array before updating it
                  const updatedCategories = [...(field.value || []), value];
                  field.onChange(updatedCategories);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Display Selected Categories */}
        {(form.watch("categoryIds") || []).length > 0 && (
          <div className="mt-2">
            <FormLabel>Selected Categories</FormLabel>
            <div className="flex flex-wrap gap-2">
              {(form.watch("categoryIds") || []).map((categoryId, index) => {
                const category = categories.find((cat) => cat.id === categoryId);
                return (
                  <div
                    key={index}
                    className="px-2 py-1 bg-gray-200 rounded-md text-sm flex items-center gap-2"
                  >
                    {category?.name || "Unknown"}
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() =>
                        form.setValue(
                          "categoryIds",
                          (form.watch("categoryIds") || []).filter((id) => id !== categoryId)
                        )
                      }
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}


        {/* Featured Checkbox */}
        <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel>Featured</FormLabel>
            </FormItem>
          )}
        />

        {/* Archived Checkbox */}
        <FormField
          control={form.control}
          name="isArchived"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel>Archived</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <FormLabel>Upload Images</FormLabel>
              <FormControl>
                <Input type="file" multiple accept="image/*" onChange={handleImageChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Display Image Previews */}
        <div className="mt-4 flex flex-wrap gap-2">
          {imagePreviews.map((src, index) => (
            <img key={index} src={src} alt={`Preview ${index}`} className="w-20 h-20 object-cover rounded-lg" />
          ))}
        </div>

        {/* Save Button */}
        {loading ? <Button disabled className="mt-4">Saving...</Button> : <Button className="mt-4">Create Product</Button>}
      </form>
    </Form>
  );
};

export default ProductForm;
