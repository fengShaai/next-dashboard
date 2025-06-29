import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from "@/auth"; 
import path from "path";
import fs from "fs/promises";
import crypto from "crypto"; // For secure filenames

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// GET all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        images: true,
        categories: {
          include: {
            category: true,
          }
        }
      }
    });
    const count = await prisma.product.count();
    return NextResponse.json({ products, count }, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST - Create product with secure file name
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type must be multipart/form-data" },
        { status: 400 }
      );
    }
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const categoryIds = formData.getAll("categoryIds") as string[];
    const isFeatured = formData.get("isFeatured") === "true";
    const isArchived = formData.get("isArchived") === "true";
    if (!name || !price) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }
    const images = formData.getAll("images") as File[];
    if (!images.length) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 }
      );
    }
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const imagePaths = await Promise.all(
      images.map(async (file) => {
        const ext = path.extname(file.name); // Keep original extension
        const safeFileName = `${Date.now()}-${crypto.randomUUID()}${ext}`; // Safe, unique
        const filePath = path.join(UPLOAD_DIR, safeFileName);
        const bytes = await file.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(bytes));
        return `/uploads/${safeFileName}`;
      })
    );

    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        isFeatured,
        isArchived,
        images: {
          create: imagePaths.map((url) => ({ url })),
        },
      },
      include: { images: true },
    });
    // Save product-category relationships
    await prisma.productCategory.createMany({
      data: categoryIds.map((categoryId) => ({
        productId: newProduct.id,
        categoryId,
      })),
    });
    const productWithCategories = await prisma.product.findUnique({
      where: { id: newProduct.id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        images: true,
      },
    });
    return NextResponse.json(productWithCategories, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
