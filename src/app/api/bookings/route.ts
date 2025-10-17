// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { paystack } from '@/lib/paystack';
import { googleSheets } from '@/lib/sheets';
import { emailService } from '@/lib/email';
import { format } from 'date-fns';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      packageId,
      fullName,
      email,
      phone,
      numberOfGuests,
      specialRequests,
      eventDate,
      paymentMethod,
      proofOfPayment,
    } = body;

    // Validate input
    if (!packageId || !fullName || !email || !phone || !numberOfGuests || !eventDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check table availability
    const settings = await prisma.eventSettings.findFirst();
    if (settings && settings.bookedTables >= settings.totalTables) {
      return NextResponse.json(
        { error: 'No tables available. Please join the waitlist.' },
        { status: 400 }
      );
    }

    // Get package details
    const tablePackage = await prisma.tablePackage.findUnique({
      where: { id: packageId },
    });

    if (!tablePackage) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    // Check max guests
    if (numberOfGuests > tablePackage.maxGuests) {
      return NextResponse.json(
        { error: `Maximum ${tablePackage.maxGuests} guests per table` },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        packageId,
        fullName,
        email,
        phone,
        numberOfGuests: parseInt(numberOfGuests),
        specialRequests,
        eventDate: new Date(eventDate),
        paymentMethod,
        proofOfPayment,
        amount: tablePackage.price,
        status: 'PENDING',
        paymentStatus: paymentMethod === 'BANK_TRANSFER' ? 'PENDING' : 'PENDING',
      },
      include: {
        package: true,
      },
    });

    // Update table count
    if (settings) {
      await prisma.eventSettings.update({
        where: { id: settings.id },
        data: { bookedTables: settings.bookedTables + 1 },
      });
    }

    // If Paystack, initialize payment
    if (paymentMethod === 'PAYSTACK') {
      const paymentResponse = await paystack.initializeTransaction(
        email,
        tablePackage.price,
        booking.id,
        {
          bookingId: booking.id,
          fullName,
          type: 'booking',
        }
      );

      await prisma.booking.update({
        where: { id: booking.id },
        data: { paymentReference: paymentResponse.data.reference },
      });

      return NextResponse.json({
        booking,
        paymentUrl: paymentResponse.data.authorization_url,
      });
    }

    // Log to Google Sheets
    try {
      await googleSheets.logBooking({
        id: booking.id,
        date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        fullName: booking.fullName,
        email: booking.email,
        phone: booking.phone,
        packageName: tablePackage.name,
        numberOfGuests: booking.numberOfGuests,
        tableNumber: booking.tableNumber,
        amount: booking.amount,
        paymentMethod: booking.paymentMethod,
        paymentStatus: booking.paymentStatus,
      });
    } catch (error) {
      console.error('Google Sheets logging failed:', error);
    }

    // Send confirmation email for bank transfer
    if (paymentMethod === 'BANK_TRANSFER') {
      try {
        await emailService.sendBookingConfirmation(email, {
          id: booking.id,
          fullName: booking.fullName,
          packageName: tablePackage.name,
          numberOfGuests: booking.numberOfGuests,
          eventDate: format(new Date(eventDate), 'MMMM dd, yyyy'),
          tableNumber: booking.tableNumber,
          amount: booking.amount,
        });

        // Notify admin
        await emailService.sendAdminNotification(
          'New Booking - Pending Payment Verification',
          `
            <h2>New Booking Received</h2>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Customer:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Package:</strong> ${tablePackage.name}</p>
            <p><strong>Amount:</strong> GHS ${tablePackage.price}</p>
            <p><strong>Payment Method:</strong> Bank Transfer</p>
            <p><strong>Proof of Payment:</strong> ${proofOfPayment || 'Not provided yet'}</p>
            <p>Please verify the payment and confirm the booking.</p>
          `
        );
      } catch (error) {
        console.error('Email sending failed:', error);
      }
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = status ? { status } : {};

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        package: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}