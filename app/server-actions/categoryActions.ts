"use server";

import { PrismaClient } from "@prisma/client";
import Error from "next/error";
import toast from "react-hot-toast";

const prisma = new PrismaClient();

export async function onSubmit<T>(data: T): Promise<void> {
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
      throw new Error({ statusCode: 500, title: 'Failed to create category' });
    }

    const result = await response.json();
    console.log('Category created:', result);
    toast.success('Category created successfully!');
  } catch (error) {
    console.error('Error in category-submitform:', error);
    toast.error('Something went wrong.');
    throw new Error({statusCode: 500});
  }
}

// ✅ Fetch all categories
export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { createdAt: "desc" }, // Sort by creation date
  });
}

// ✅ Update a category
export async function updateCategory(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;

  if (!id || !name || name.length < 2) {
    throw new Error({ statusCode: 500, title: 'Invalid input!' });
  }

  await prisma.category.update({
    where: { id },
    data: { name },
  });

  // ✅ Revalidate page (refresh data)
  return { success: true };
}

// ✅ Delete a category
export async function deleteCategory(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) {
    throw new Error({ statusCode: 500, title: 'Invalid category ID!' });
  }

  await prisma.category.delete({ where: { id } });

  // ✅ Revalidate page (refresh data)
  return { success: true };
}
