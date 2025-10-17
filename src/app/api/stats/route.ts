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