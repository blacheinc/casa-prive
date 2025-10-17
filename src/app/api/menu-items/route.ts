// app/api/menu-items/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, category, price, image, isAvailable } = body;

    if (!name || !category || price === undefined) {
      return NextResponse.json(
        { error: 'Name, category, and price are required' },
        { status: 400 }
      );
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description: description || null,
        category,
        price: parseFloat(price),
        image: image || null,
        isAvailable: isAvailable ?? true,
      },
    });

    return NextResponse.json({ menuItem }, { status: 201 });
  } catch (error) {
    console.error('Create menu item error:', error);
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where = category ? { category } : {};

    const menuItems = await prisma.menuItem.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ],
    });

    return NextResponse.json({ menuItems });
  } catch (error) {
    console.error('Get menu items error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}