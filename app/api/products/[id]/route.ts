import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from "@/auth"; 
import path from "path";
import fs from "fs/promises";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads"); // Define local storage path

// Get single product
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if(!session) {
      return new NextResponse("Unauthorized!", {status: 401});
    }
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'product ID is required' }, { status: 400 });
    }
    const product = await prisma.product.findUnique({where: { id }});
    if (!product) {
      return NextResponse.json({ error: 'product not found' }, { status: 404 });
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// Update an existing product
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const { id } = params;
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const categoryId = formData.get("categoryId") as string | null;
    const isFeatured = formData.get("isFeatured") === "true";
    const isArchived = formData.get("isArchived") === "true";

    if (!id || !name || !price) {
      return NextResponse.json({ error: "Product ID, name, and price are required" }, { status: 400 });
    }

    // Ensure upload directory exists
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // Handle new image uploads
    const images = formData.getAll("images") as File[];
    const imagePaths = await Promise.all(
      images.map(async (file) => {
        const filePath = path.join(UPLOAD_DIR, `${Date.now()}-${file.name}`);
        const bytes = await file.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(bytes));
        return `/uploads/${path.basename(filePath)}`;
      })
    );

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: parseFloat(price),
        categoryId: categoryId || null,
        isFeatured,
        isArchived,
        images: {
          create: imagePaths.map((url) => ({ url })),
        },
      },
      include: { images: true },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// Delete a product
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }

    if (!params || !params.id) {
      return NextResponse.json({ error: "product ID is required" }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}