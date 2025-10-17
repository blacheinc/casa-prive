// app/api/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    let settings = await prisma.eventSettings.findFirst();

    if (!settings) {
      settings = await prisma.eventSettings.create({
        data: {
          totalTables: parseInt(process.env.NEXT_PUBLIC_TOTAL_TABLES || '20'),
          bookedTables: 0,
          currentEventDate: new Date(),
          isBookingOpen: true,
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { totalTables, currentEventDate, isBookingOpen } = body;

    const settings = await prisma.eventSettings.findFirst();

    if (!settings) {
      return NextResponse.json(
        { error: 'Settings not found' },
        { status: 404 }
      );
    }

    const updated = await prisma.eventSettings.update({
      where: { id: settings.id },
      data: {
        ...(totalTables !== undefined && { totalTables: parseInt(totalTables) }),
        ...(currentEventDate && { currentEventDate: new Date(currentEventDate) }),
        ...(isBookingOpen !== undefined && { isBookingOpen }),
      },
    });

    return NextResponse.json({ settings: updated });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}