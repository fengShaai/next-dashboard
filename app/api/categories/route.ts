import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from "@/auth"; 


// GET all categories
export async function GET() {
  try {
    // const session = await auth();
    // if(!session) {
    //   return new NextResponse("Unauthorized!", {status: 401});
    // }
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: 'desc', // Use 'asc' for oldest first
      },
    });
    //throw new Error('Failed to Delete Invoice');
    const count = await prisma.category.count();
    return NextResponse.json({ categories, count }, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// Create a new category
export async function POST(req: Request) {
  try {
    const session = await auth();
    if(!session) {
      return new NextResponse("Unauthorized!", {status: 401});
    }
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }
    const category = await prisma.category.create({
      data: { name },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

