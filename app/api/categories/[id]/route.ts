import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from "@/auth"; 

// Get single category
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if(!session) {
      return new NextResponse("Unauthorized!", {status: 401});
    }
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }
    const category = await prisma.category.findUnique({where: { id }});
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

// Update an existing category
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }

    const { id } = params; // Get ID from URL
    const { name } = await req.json(); // Get name from request body

    if (!id || !name) {
      return NextResponse.json({ error: "Category ID and name are required" }, { status: 400 });
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

// Delete a category
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
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    await prisma.category.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}