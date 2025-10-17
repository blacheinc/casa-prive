// app/api/menu-items/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where = category ? { category, isAvailable: true } : { isAvailable: true };

    const menuItems = await prisma.menuItem.findMany({
      where,
      orderBy: { category: 'asc' },
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