// app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: { tiers: { orderBy: { price: 'asc' } } },
      orderBy: { date: 'asc' },
    });
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, date, venue, fliers, isActive, isSalesOpen, totalTickets, tiers } = body;

    if (!name || !date) {
      return NextResponse.json({ error: 'Name and date are required' }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        name,
        description: description || null,
        date: new Date(date),
        venue: venue || null,
        fliers: fliers || [],
        isActive: isActive ?? true,
        isSalesOpen: isSalesOpen ?? true,
        totalTickets: totalTickets ? parseInt(totalTickets) : 200,
        tiers: tiers && tiers.length > 0
          ? {
              create: tiers.map((t: { name: string; description?: string; price: number; capacity?: number; features?: string[]; isActive?: boolean }) => ({
                name: t.name,
                description: t.description || null,
                price: parseFloat(String(t.price)),
                capacity: t.capacity ? parseInt(String(t.capacity)) : null,
                features: t.features || [],
                isActive: t.isActive ?? true,
              })),
            }
          : undefined,
      },
      include: { tiers: true },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
