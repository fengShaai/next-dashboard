"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
import { useProductStore } from "@/store/productStore";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FormSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Enter a valid price." }), // Prisma Decimal
  categoryIds: z.array(z.string()).optional(), // Allow optional category selection
  isFeatured: z.boolean().default(false),
  isArchived: z.boolean().default(false),
  images: z.array(z.any()).optional(),
});

const ProductForm = ({ categories }: { categories: { id: string; name: string }[] }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { editingProduct, setEditingProduct, fetchProducts } = useProductStore();
  console.log(editingProduct);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setNewImages((prev) => [...prev, ...files]);
  
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previews]);
    }
  };
  

  const removeImage = (index: number) => {
    const previewToRemove = imagePreviews[index];
  
    if (previewToRemove.startsWith("blob:")) {
      // It's a new image
      const newIndex = imagePreviews.slice(0, index).filter(p => p.startsWith("blob:")).length;
      setNewImages((prev) => prev.filter((_, i) => i !== newIndex));
    } else {
      // It's an existing image
      setExistingImages((prev) => prev.filter((url) => url !== previewToRemove));
    }
  
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };
  
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      price: "",
      categoryIds: [], // Pre-fill with editing product's categories
      isFeatured: false,
      isArchived: false,
    },
  });

  useEffect(() => {
    if (editingProduct) {
      form.setValue("name", editingProduct.name);
      form.setValue("price", editingProduct.price.replace(/[^\d.]/g, ""));
      form.setValue("categoryIds", editingProduct.categoryIds || []);
      form.setValue("isFeatured", editingProduct.isFeatured);
      form.setValue("isArchived", editingProduct.isArchived);
  
      if (editingProduct.images) {
        setExistingImages(editingProduct.images);
        setImagePreviews(editingProduct.images); // preview starts with existing
      }
    }
  }, [editingProduct, form]);
  

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("isFeatured", String(data.isFeatured));
    formData.append("isArchived", String(data.isArchived));
    (existingImages || []).forEach((url) => formData.append("existingImages[]", url));
    (newImages || []).forEach((file) => formData.append("newImages", file));
    (data.categoryIds || []).forEach((id) => formData.append("categoryIds[]", id));

    try {
      if (editingProduct) {
        await axiosInstance.put(`/api/products/${editingProduct.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        
        toast.success("Product updated successfully!");
      }
      fetchProducts();
      form.reset();
      setEditingProduct(null);
      setImagePreviews([]);
      router.push(`/dashboard/products`);
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
                      // Ensure category is added only if it's not already in the list
                  const updatedCategories = new Set([...(field.value || []), value]);
                  field.onChange(Array.from(updatedCategories));
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
            <div key={index} className="relative w-20 h-20">
              <img
                src={src}
                alt={`Preview ${index}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                className="absolute -top-2 -right-2 bg-gray-300 text-red-500 hover:text-red-700 rounded-full w-5 h-5 text-xs flex justify-center"
                onClick={() => removeImage(index)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>



        {/* Save Button */}
        {loading ? <Button disabled className="mt-4">Saving...</Button> : <Button className="mt-4">Save changes</Button>}
      </form>
    </Form>
  );
};

export default ProductForm;
