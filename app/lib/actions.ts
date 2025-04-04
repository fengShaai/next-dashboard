'use server';
 
import { signIn } from '@/auth';
import prisma from '@/lib/prisma';
import { AuthError } from 'next-auth';

export async function getProductCount (): Promise<number> {
  try {
    const count = await prisma.product.count();
    return count;
  } catch (error) {
    console.error("Error fetching product count:", error);
    throw new Error('Failed to fetch product count.');
  }
}
  
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function apiRequest<T>(
  url: string,
  method: "POST" | "GET" | "PUT" | "DELETE",
  data:T
): Promise<void> {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error("API Request Error:", error);
    throw new Error('Something went wrong!');
  }
}

export async function fetchCategories (): Promise<{ id: string; name: string }[]> {
  try {
    const response = await prisma.category.findMany();
    const data = response.map((category) => ({
      id: category.id,
      name: category.name,
    }));
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error('Failed to fetch categories.');
  }
}
