/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/tickets/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { paystack } from "@/lib/paystack";
import { emailService } from "@/lib/email";
import { format } from "date-fns";
import { TicketStatus } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tierName,
      description,
      fullName,
      email,
      phone,
      numberOfGuests,
      eventDate,
      paymentMethod,
      proofOfPayment,
      amount,
      adminCreated,
      status: initialStatus,
      paymentStatus: initialPaymentStatus,
    } = body;

    // Validate input
    if (!tierName || !fullName || !email || !phone || !eventDate || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const settings = await prisma.eventSettings.findFirst();

    // Skip availability checks for admin-created tickets
    if (!adminCreated) {
      if (settings && settings.soldTickets >= settings.totalTickets) {
        return NextResponse.json(
          { error: "Tickets are sold out. Please join the waitlist." },
          { status: 400 }
        );
      }

      if (settings && !settings.isTicketSalesOpen) {
        return NextResponse.json(
          { error: "Ticket sales are currently closed." },
          { status: 400 }
        );
      }
    }

    // Create ticket
    const ticket = await prisma.ticket.create({
      data: {
        tierName,
        description: description || null,
        fullName,
        email,
        phone,
        numberOfGuests: parseInt(numberOfGuests) || 1,
        eventDate: new Date(eventDate),
        paymentMethod,
        proofOfPayment: proofOfPayment || null,
        amount: parseFloat(amount),
        status: initialStatus || "PENDING",
        paymentStatus: initialPaymentStatus || "PENDING",
      },
    });

    // Update sold ticket count
    if (settings) {
      await prisma.eventSettings.update({
        where: { id: settings.id },
        data: { soldTickets: settings.soldTickets + (parseInt(numberOfGuests) || 1) },
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
        parseFloat(amount),
        ticket.id,
        {
          ticketId: ticket.id,
          fullName,
          type: "ticket",
          callback_url: callbackUrl,
        }
      );

      // Save the Paystack reference
      const updatedTicket = await prisma.ticket.update({
        where: { id: ticket.id },
        data: { paymentReference: paymentResponse.data.reference },
      });

      // Send admin notification in background
      sendTicketNotification(updatedTicket).catch((err) =>
        console.error("Background ticket notification error:", err)
      );

      return NextResponse.json({
        ticket: updatedTicket,
        paymentUrl: paymentResponse.data.authorization_url,
        reference: paymentResponse.data.reference,
      });
    }

    // For bank transfer or admin-created, return immediately
    const response = NextResponse.json({ ticket });

    // Send notifications in background (skip for admin-created tickets)
    if (!adminCreated) {
      sendTicketNotification(ticket).catch((err) =>
        console.error("Background ticket notification error:", err)
      );
    }

    return response;
  } catch (error) {
    console.error("Ticket purchase error:", error);
    return NextResponse.json(
      { error: "Failed to purchase ticket" },
      { status: 500 }
    );
  }
}

async function sendTicketNotification(ticket: any) {
  const notifications = [];

  // Notify admin
  notifications.push(
    emailService
      .sendAdminNotification(
        "New Ticket Purchase",
        `
        <h2>New Ticket Purchase</h2>
        <p><strong>Ticket ID:</strong> ${ticket.id}</p>
        <p><strong>Ticket Code:</strong> ${ticket.ticketCode}</p>
        <p><strong>Tier:</strong> ${ticket.tierName}</p>
        <p><strong>Customer:</strong> ${ticket.fullName}</p>
        <p><strong>Email:</strong> ${ticket.email}</p>
        <p><strong>Phone:</strong> ${ticket.phone}</p>
        <p><strong>Guests:</strong> ${ticket.numberOfGuests}</p>
        <p><strong>Amount:</strong> GHS ${ticket.amount}</p>
        <p><strong>Payment Method:</strong> ${ticket.paymentMethod}</p>
        <p><strong>Event Date:</strong> ${format(new Date(ticket.eventDate), "MMMM dd, yyyy")}</p>
        ${ticket.paymentMethod === "BANK_TRANSFER" && ticket.proofOfPayment
          ? `<p><strong>Proof:</strong> <a href="${ticket.proofOfPayment}" target="_blank" style="color: #d4af37;">View</a></p>`
          : ""}
      `
      )
      .catch((err) => console.error("Admin email error:", err))
  );

  await Promise.allSettled(notifications);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");

    const validStatuses: TicketStatus[] = [
      "PENDING",
      "CONFIRMED",
      "CANCELLED",
      "USED",
    ];

    let where = {};
    if (statusParam && validStatuses.includes(statusParam as TicketStatus)) {
      where = { status: statusParam as TicketStatus };
    }

    const tickets = await prisma.ticket.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error("Get tickets error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}
