// app/api/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Wrap each query with .catch to prevent one failure from breaking the whole dashboard
    const safe = <T>(p: Promise<T>, fallback: T): Promise<T> => p.catch(() => fallback);

    const [
      totalBookings,
      confirmedBookings,
      pendingBookings,
      totalTickets,
      confirmedTickets,
      pendingTickets,
      ticketRevenue,
      totalOrders,
      totalRevenue,
      activeMembers,
      standardMembers,
      premiumMembers,
      waitlistCount,
      feedbackCount,
      settings,
    ] = await Promise.all([
      safe(prisma.booking.count(), 0),
      safe(prisma.booking.count({ where: { status: 'CONFIRMED' } }), 0),
      safe(prisma.booking.count({ where: { status: 'PENDING' } }), 0),
      safe(prisma.ticket.count(), 0),
      safe(prisma.ticket.count({ where: { status: 'CONFIRMED' } }), 0),
      safe(prisma.ticket.count({ where: { status: 'PENDING' } }), 0),
      safe(prisma.ticket.aggregate({
        _sum: { amount: true },
        where: { paymentStatus: 'COMPLETED' },
      }), { _sum: { amount: null } }),
      safe(prisma.order.count(), 0),
      safe(prisma.booking.aggregate({
        _sum: { amount: true },
        where: { paymentStatus: 'COMPLETED' },
      }), { _sum: { amount: null } }),
      safe(prisma.member.count({ where: { status: 'ACTIVE' } }), 0),
      safe(prisma.member.count({ where: { status: 'ACTIVE', membershipType: 'STANDARD' } }), 0),
      safe(prisma.member.count({ where: { status: 'ACTIVE', membershipType: 'PREMIUM' } }), 0),
      safe(prisma.waitlist.count({ where: { status: 'PENDING' } }), 0),
      safe(prisma.feedback.count(), 0),
      safe(prisma.eventSettings.findFirst(), null),
    ]);

    const stats = {
      bookings: {
        total: totalBookings,
        confirmed: confirmedBookings,
        pending: pendingBookings,
      },
      tickets: {
        total: totalTickets,
        confirmed: confirmedTickets,
        pending: pendingTickets,
        revenue: ticketRevenue._sum.amount || 0,
      },
      orders: {
        total: totalOrders,
      },
      revenue: {
        total: totalRevenue._sum.amount || 0,
      },
      members: {
        active: activeMembers,
        standard: standardMembers,
        premium: premiumMembers,
      },
      waitlist: {
        pending: waitlistCount,
      },
      feedback: {
        total: feedbackCount,
      },
      tables: {
        total: settings?.totalTables || 0,
        booked: settings?.bookedTables || 0,
        available: (settings?.totalTables || 0) - (settings?.bookedTables || 0),
      },
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}