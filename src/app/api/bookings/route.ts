/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { paystack } from "@/lib/paystack";
import { googleSheets } from "@/lib/sheets";
import { emailService } from "@/lib/email";
import { format } from "date-fns";
import { BookingStatus } from "@prisma/client";

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
    if (
      !packageId ||
      !fullName ||
      !email ||
      !phone ||
      !numberOfGuests ||
      !eventDate
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check table availability
    const settings = await prisma.eventSettings.findFirst();
    if (settings && settings.bookedTables >= settings.totalTables) {
      return NextResponse.json(
        { error: "No tables available. Please join the waitlist." },
        { status: 400 }
      );
    }

    // Get package details
    const tablePackage = await prisma.tablePackage.findUnique({
      where: { id: packageId },
    });

    if (!tablePackage) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
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
        status: "PENDING",
        paymentStatus:
          paymentMethod === "BANK_TRANSFER" ? "PENDING" : "PENDING",
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
    if (paymentMethod === "PAYSTACK") {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.NEXT_PUBLIC_BASE_URL ||
        "http://localhost:3000";
      const callbackUrl = `${baseUrl}/api/payment/callback`;

      const paymentResponse = await paystack.initializeTransaction(
        email,
        tablePackage.price,
        booking.id,
        {
          bookingId: booking.id,
          fullName,
          type: "booking",
          callback_url: callbackUrl,
        }
      );

      // Save the Paystack reference immediately
      const updatedBooking = await prisma.booking.update({
        where: { id: booking.id },
        data: { 
          paymentReference: paymentResponse.data.reference 
        },
        include: {
          package: true,
        },
      });

      // Return immediately - send notifications in background
      sendBookingNotifications(updatedBooking, tablePackage).catch((err) =>
        console.error("Background notification error:", err)
      );

      return NextResponse.json({
        booking: updatedBooking,
        paymentUrl: paymentResponse.data.authorization_url,
        reference: paymentResponse.data.reference,
      });
    }

    // For bank transfer, return immediately
    const response = NextResponse.json({ booking });

    // Send notifications in background (non-blocking)
    sendBookingNotifications(booking, tablePackage).catch((err) =>
      console.error("Background notification error:", err)
    );

    return response;
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

// Background function for sending notifications (non-blocking)
async function sendBookingNotifications(booking: any, tablePackage: any) {
  const notifications = [];

  // Send customer confirmation email
  notifications.push(
    emailService
      .sendBookingConfirmation(booking.email, {
        id: booking.id,
        fullName: booking.fullName,
        packageName: tablePackage.name,
        numberOfGuests: booking.numberOfGuests,
        eventDate: format(new Date(booking.eventDate), "MMMM dd, yyyy"),
        tableNumber: booking.tableNumber,
        amount: booking.amount,
      })
      .catch((err) => console.error("Email error:", err))
  );

  // Log to Google Sheets
  notifications.push(
    googleSheets
      .logBooking({
        id: booking.id,
        date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        fullName: booking.fullName,
        email: booking.email,
        phone: booking.phone,
        packageName: tablePackage.name,
        numberOfGuests: booking.numberOfGuests,
        tableNumber: booking.tableNumber,
        amount: booking.amount,
        paymentMethod: booking.paymentMethod,
        paymentStatus: booking.paymentStatus,
        proofOfPayment: booking.proofOfPayment || booking.paymentReference || "",
      })
      .catch((err) => console.error("Sheets error:", err))
  );

  // Notify admin
  notifications.push(
    emailService
      .sendAdminNotification(
        booking.paymentMethod === "BANK_TRANSFER"
          ? "New Booking - Pending Payment Verification"
          : "New Booking Received",
        `
        <h2>New Booking Received</h2>
        <p><strong>Booking ID:</strong> ${booking.id}</p>
        <p><strong>Customer:</strong> ${booking.fullName}</p>
        <p><strong>Email:</strong> ${booking.email}</p>
        <p><strong>Phone:</strong> ${booking.phone}</p>
        <p><strong>Package:</strong> ${tablePackage.name}</p>
        <p><strong>Event Date:</strong> ${format(
          new Date(booking.eventDate),
          "MMMM dd, yyyy"
        )}</p>
        <p><strong>Guests:</strong> ${booking.numberOfGuests}</p>
        <p><strong>Amount:</strong> GHS ${tablePackage.price}</p>
        <p><strong>Payment Method:</strong> ${booking.paymentMethod}</p>
        ${booking.paymentReference ? `<p><strong>Payment Reference:</strong> ${booking.paymentReference}</p>` : ''}
        ${
          booking.paymentMethod === "BANK_TRANSFER"
            ? `
          <p><strong>Proof of Payment:</strong> ${
            booking.proofOfPayment
              ? `<a href="${booking.proofOfPayment}" target="_blank" style="color: #d4af37; text-decoration: underline;">View Proof of Payment</a>`
              : "Not provided yet"
          }</p>
          <p style="color: #d4af37; font-weight: 600;">⚠️ Please verify the payment and confirm the booking.</p>
        `
            : ""
        }
      `
      )
      .catch((err) => console.error("Admin email error:", err))
  );

  // Wait for all notifications (but doesn't block API response)
  await Promise.allSettled(notifications);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");

    const validStatuses: BookingStatus[] = [
      "PENDING",
      "CONFIRMED",
      "CANCELLED",
      "COMPLETED",
    ];

    let where = {};
    if (statusParam && validStatuses.includes(statusParam as BookingStatus)) {
      where = { status: statusParam as BookingStatus };
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        package: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Get bookings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}