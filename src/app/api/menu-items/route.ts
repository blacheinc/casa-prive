// app/api/menu-items/route.ts
import { NextRequest as NextReq2, NextResponse as NextRes2 } from 'next/server';
import { prisma as db } from '@/lib/prisma';

export async function POST(request: NextReq2) {
  try {
    const body = await request.json();
    const { name, description, category, price, image, isAvailable } = body;

    if (!name || !category || price === undefined) {
      return NextRes2.json(
        { error: 'Name, category, and price are required' },
        { status: 400 }
      );
    }

    const menuItem = await db.menuItem.create({
      data: {
        name,
        description: description || null,
        category,
        price: parseFloat(price),
        image: image || null,
        isAvailable: isAvailable ?? true,
      },
    });

    return NextRes2.json({ menuItem }, { status: 201 });
  } catch (error) {
    console.error('Create menu item error:', error);
    return NextRes2.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextReq2) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where = category ? { category } : {};

    const menuItems = await db.menuItem.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ],
    });

    return NextRes2.json({ menuItems });
  } catch (error) {
    console.error('Get menu items error:', error);
    return NextRes2.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}