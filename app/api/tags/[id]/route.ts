import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from "@/auth"; 

// Get single tag
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if(!session) {
      return new NextResponse("Unauthorized!", {status: 401});
    }
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'tag ID is required' }, { status: 400 });
    }
    const tag = await prisma.tag.findUnique({where: { id }});
    if (!tag) {
      return NextResponse.json({ error: 'tag not found' }, { status: 404 });
    }
    return NextResponse.json(tag, { status: 200 });
  } catch (error) {
    console.error('Error fetching tag:', error);
    return NextResponse.json({ error: 'Failed to fetch tag' }, { status: 500 });
  }
}

// Update an existing tag
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }

    const { id } = params; // Get ID from URL
    const { name } = await req.json(); // Get name from request body

    if (!id || !name) {
      return NextResponse.json({ error: "tag ID and name are required" }, { status: 400 });
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(tag, { status: 200 });
  } catch (error) {
    console.error("Error updating tag:", error);
    return NextResponse.json({ error: "Failed to update tag" }, { status: 500 });
  }
}

// Delete a tag
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
      return NextResponse.json({ error: "tag ID is required" }, { status: 400 });
    }

    await prisma.tag.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "tag deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json({ error: "Failed to delete tag" }, { status: 500 });
  }
}