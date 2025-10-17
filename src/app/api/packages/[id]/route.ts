// app/api/packages/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const tablePackage = await prisma.tablePackage.findUnique({
      where: { id },
    });

    if (!tablePackage) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ package: tablePackage });
  } catch (error) {
    console.error('Get package error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch package' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, price, features, maxGuests, isActive } = body;

    const tablePackage = await prisma.tablePackage.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(features && { features }),
        ...(maxGuests !== undefined && { maxGuests: parseInt(maxGuests) }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ package: tablePackage });
  } catch (error) {
    console.error('Update package error:', error);
    return NextResponse.json(
      { error: 'Failed to update package' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if package has any bookings
    const bookingsCount = await prisma.booking.count({
      where: { packageId: id },
    });

    if (bookingsCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete package with existing bookings. Consider deactivating it instead.' },
        { status: 400 }
      );
    }

    await prisma.tablePackage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete package error:', error);
    return NextResponse.json(
      { error: 'Failed to delete package' },
      { status: 500 }
    );
  }
}