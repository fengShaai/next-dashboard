import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from "@/auth"; 


// GET all tags
export async function GET() {
  try {
    // const session = await auth();
    // if(!session) {
    //   return new NextResponse("Unauthorized!", {status: 401});
    // }
    const tags = await prisma.tag.findMany({
      orderBy: {
        createdAt: 'desc', // Use 'asc' for oldest first
      },
    });
    //throw new Error('Failed to Delete Invoice');
    const count = await prisma.tag.count();
    return NextResponse.json({ tags, count }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

// Create a new tag
export async function POST(req: Request) {
  try {
    const session = await auth();
    if(!session) {
      return new NextResponse("Unauthorized!", {status: 401});
    }
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

