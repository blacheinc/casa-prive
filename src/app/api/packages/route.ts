// app/api/packages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, features, maxGuests, isActive } = body;

    if (!name || !description || price === undefined) {
      return NextResponse.json(
        { error: 'Name, description, and price are required' },
        { status: 400 }
      );
    }

    const tablePackage = await prisma.tablePackage.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        features: features || [],
        maxGuests: maxGuests ? parseInt(maxGuests) : 6,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ package: tablePackage }, { status: 201 });
  } catch (error) {
    console.error('Create package error:', error);
    return NextResponse.json(
      { error: 'Failed to create package' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    const where = activeOnly ? { isActive: true } : {};

    const packages = await prisma.tablePackage.findMany({
      where,
      orderBy: { price: 'asc' },
    });

    return NextResponse.json({ packages });
  } catch (error) {
    console.error('Get packages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}