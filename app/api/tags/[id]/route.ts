import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'tag ID is required' }, { status: 400 });
    }
    const tag = await prisma.tag.findUnique({
      where: { id },
    });
    if (!tag) {
      return NextResponse.json({ error: 'tag not found' }, { status: 404 });
    }
    return NextResponse.json(tag, { status: 200 });
  } catch (error) {
    console.error('Error fetching tag:', error);
    return NextResponse.json({ error: 'Failed to fetch tag' }, { status: 500 });
  }
}