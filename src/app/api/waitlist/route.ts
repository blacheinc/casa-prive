// app/api/waitlist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { googleSheets } from '@/lib/sheets';
import { emailService } from '@/lib/email';
import { format } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const waitlist = await prisma.waitlist.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ waitlist });
  } catch (error) {
    console.error('Get waitlist error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch waitlist' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, numberOfGuests, preferredDate, message } = body;

    if (!fullName || !email || !phone || !numberOfGuests || !preferredDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const waitlist = await prisma.waitlist.create({
      data: {
        fullName,
        email,
        phone,
        numberOfGuests: parseInt(numberOfGuests),
        preferredDate: new Date(preferredDate),
        message,
        status: 'PENDING',
      },
    });

    try {
      await googleSheets.logWaitlist({
        id: waitlist.id,
        date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        fullName: waitlist.fullName,
        email: waitlist.email,
        phone: waitlist.phone,
        numberOfGuests: waitlist.numberOfGuests,
        preferredDate: format(new Date(preferredDate), 'yyyy-MM-dd'),
        message: waitlist.message,
      });
    } catch (error) {
      console.error('Google Sheets logging failed:', error);
    }

    try {
      await emailService.sendWaitlistConfirmation(email, {
        fullName,
        preferredDate: format(new Date(preferredDate), 'MMMM dd, yyyy'),
        numberOfGuests,
      });
    } catch (error) {
      console.error('Email sending failed:', error);
    }

    return NextResponse.json({ waitlist });
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json(
      { error: 'Failed to add to waitlist' },
      { status: 500 }
    );
  }
}