import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from "@/auth"; 

// Get single brand
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if(!session) {
      return new NextResponse("Unauthorized!", {status: 401});
    }
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'brand ID is required' }, { status: 400 });
    }
    const brand = await prisma.brand.findUnique({where: { id }});
    if (!brand) {
      return NextResponse.json({ error: 'brand not found' }, { status: 404 });
    }
    return NextResponse.json(brand, { status: 200 });
  } catch (error) {
    console.error('Error fetching brand:', error);
    return NextResponse.json({ error: 'Failed to fetch brand' }, { status: 500 });
  }
}

// Update an existing brand
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }

    const { id } = params; // Get ID from URL
    const { name } = await req.json(); // Get name from request body

    if (!id || !name) {
      return NextResponse.json({ error: "brand ID and name are required" }, { status: 400 });
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(brand, { status: 200 });
  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json({ error: "Failed to update brand" }, { status: 500 });
  }
}

// Delete a brand
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
      return NextResponse.json({ error: "brand ID is required" }, { status: 400 });
    }

    await prisma.brand.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "brand deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
  }
}