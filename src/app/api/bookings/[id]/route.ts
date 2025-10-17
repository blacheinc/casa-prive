// app/api/bookings/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000,
  maxRequests: 10,
});

export async function POST_WITH_RATE_LIMIT(request: NextRequest) {
  const rateLimitResult = limiter(request);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { 
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
      },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // FIXED: Await params
    
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        package: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // FIXED: Await params
    const body = await request.json();
    const { status, tableNumber } = body;

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(tableNumber && { tableNumber: parseInt(tableNumber) }),
      },
      include: {
        package: true,
      },
    });

    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}