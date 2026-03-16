// app/api/events/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: { tiers: { orderBy: { price: 'asc' } } },
    });
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    return NextResponse.json({ event });
  } catch (error) {
    console.error('Get event error:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, date, venue, fliers, isActive, isSalesOpen, totalTickets, tiers } = body;

    // Update event scalar fields
    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(venue !== undefined && { venue }),
        ...(fliers !== undefined && { fliers }),
        ...(isActive !== undefined && { isActive }),
        ...(isSalesOpen !== undefined && { isSalesOpen }),
        ...(totalTickets !== undefined && { totalTickets: parseInt(totalTickets) }),
      },
    });

    // If tiers provided, replace them
    if (tiers !== undefined) {
      await prisma.eventTier.deleteMany({ where: { eventId: id } });
      if (tiers.length > 0) {
        await prisma.eventTier.createMany({
          data: tiers.map((t: { name: string; description?: string; price: number; capacity?: number; features?: string[]; isActive?: boolean }) => ({
            eventId: id,
            name: t.name,
            description: t.description || null,
            price: parseFloat(String(t.price)),
            capacity: t.capacity ? parseInt(String(t.capacity)) : null,
            features: t.features || [],
            isActive: t.isActive ?? true,
          })),
        });
      }
    }

    const updated = await prisma.event.findUnique({
      where: { id },
      include: { tiers: { orderBy: { price: 'asc' } } },
    });

    return NextResponse.json({ event: updated });
  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
