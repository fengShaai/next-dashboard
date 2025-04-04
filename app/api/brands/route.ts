import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from "@/auth"; 


// GET all brands
export async function GET() {
  try {
    // const session = await auth();
    // if(!session) {
    //   return new NextResponse("Unauthorized!", {status: 401});
    // }
    const brands = await prisma.brand.findMany({
      orderBy: {
        createdAt: 'desc', // Use 'asc' for oldest first
      },
    });
    //throw new Error('Failed to Delete Invoice');
    const count = await prisma.brand.count();
    return NextResponse.json({ brands, count }, { status: 200 });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}

// Create a new brand
export async function POST(req: Request) {
  try {
    const session = await auth();
    if(!session) {
      return new NextResponse("Unauthorized!", {status: 401});
    }
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'brand name is required' }, { status: 400 });
    }
    const brand = await prisma.brand.create({
      data: { name },
    });
    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    console.error('Error creating brand:', error);
    return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 });
  }
}

