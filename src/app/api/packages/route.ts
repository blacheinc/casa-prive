// app/api/packages/route.ts
import { NextRequest as NextReq2, NextResponse as NextRes2 } from 'next/server';
import { prisma as db } from '@/lib/prisma';

export async function POST(request: NextReq2) {
  try {
    const body = await request.json();
    const { name, description, price, features, maxGuests, isActive } = body;

    if (!name || !description || price === undefined) {
      return NextRes2.json(
        { error: 'Name, description, and price are required' },
        { status: 400 }
      );
    }

    const tablePackage = await db.tablePackage.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        features: features || [],
        maxGuests: maxGuests ? parseInt(maxGuests) : 6,
        isActive: isActive ?? true,
      },
    });

    return NextRes2.json({ package: tablePackage }, { status: 201 });
  } catch (error) {
    console.error('Create package error:', error);
    return NextRes2.json(
      { error: 'Failed to create package' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextReq2) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    const where = activeOnly ? { isActive: true } : {};

    const packages = await db.tablePackage.findMany({
      where,
      orderBy: { price: 'asc' },
    });

    return NextRes2.json({ packages });
  } catch (error) {
    console.error('Get packages error:', error);
    return NextRes2.json(
      { error: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}