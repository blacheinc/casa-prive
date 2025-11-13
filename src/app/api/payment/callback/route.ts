// app/api/payment/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');
    const trxref = searchParams.get('trxref'); // Paystack also sends trxref

    const transactionId = reference || trxref;

    if (!transactionId) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed?error=no-reference`
      );
    }

    // Check if it's a booking
    const booking = await prisma.booking.findFirst({
      where: { paymentReference: transactionId },
    });

    if (booking) {
      // Update booking with transaction ID and mark as completed
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          paymentStatus: 'COMPLETED',
          status: 'CONFIRMED',
          paymentReference: transactionId, // Ensure it's saved
        },
      });

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?id=${booking.id}`
      );
    }

    // Check if it's an order
    const order = await prisma.order.findFirst({
      where: { paymentReference: transactionId },
    });

    if (order) {
      // Update order with transaction ID and mark as completed
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'COMPLETED',
          paymentReference: transactionId, // Ensure it's saved
        },
      });

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/order/success?id=${order.id}`
      );
    }

    // If no booking or order found with this reference
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed?error=not-found`
    );
  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed?error=server-error`
    );
  }
}