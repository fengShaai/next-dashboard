import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all tags
export async function GET() {
  try {
    const tags = await prisma.tag.findMany();
    return NextResponse.json(tags, { status: 200 });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

// Create a new tag
export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'tag name is required' }, { status: 400 });
    }
    const tag = await prisma.tag.create({
      data: { name },
    });
    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }
}

// Update an existing tag
export async function PUT(req: Request) {
  try {
    const { id, name } = await req.json();
    if (!id || !name) {
      return NextResponse.json({ error: 'tag ID and name are required' }, { status: 400 });
    }
    const tag = await prisma.tag.update({
      where: { id },
      data: { name },
    });
    return NextResponse.json(tag, { status: 200 });
  } catch (error) {
    console.error('Error updating tag:', error);
    return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 });
  }
}

// Delete a tag
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'tag ID is required' }, { status: 400 });
    }
    await prisma.tag.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'tag deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
  }
}
