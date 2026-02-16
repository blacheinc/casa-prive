// app/api/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get various statistics
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
      waitlistCount,
      feedbackCount,
      settings,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.ticket.count(),
      prisma.ticket.count({ where: { status: 'CONFIRMED' } }),
      prisma.ticket.count({ where: { status: 'PENDING' } }),
      prisma.ticket.aggregate({
        _sum: { amount: true },
        where: { paymentStatus: 'COMPLETED' },
      }),
      prisma.order.count(),
      prisma.booking.aggregate({
        _sum: { amount: true },
        where: { paymentStatus: 'COMPLETED' },
      }),
      prisma.member.count({ where: { status: 'ACTIVE' } }),
      prisma.waitlist.count({ where: { status: 'PENDING' } }),
      prisma.feedback.count(),
      prisma.eventSettings.findFirst(),
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