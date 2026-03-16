// app/api/tickets/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emailService } from "@/lib/email";
import { whatsappService } from "@/lib/whatsapp";
import { format } from "date-fns";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error("Get ticket error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ticket" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Fetch the ticket before update to detect status transition
    const before = await prisma.ticket.findUnique({
      where: { id },
      include: { event: true },
    });

    const ticket = await prisma.ticket.update({
      where: { id },
      data: body,
      include: { event: true },
    });

    // Send confirmation email when ticket is newly confirmed (bank/momo flow)
    const justConfirmed =
      before?.status !== 'CONFIRMED' && ticket.status === 'CONFIRMED';

    if (justConfirmed) {
      const ticketPayload = {
        id: ticket.id,
        ticketCode: ticket.ticketCode,
        fullName: ticket.fullName,
        tierName: ticket.tierName,
        numberOfGuests: ticket.numberOfGuests,
        eventDate: format(new Date(ticket.eventDate), 'EEEE, MMMM d, yyyy'),
        eventName: ticket.event?.name,
        venue: ticket.event?.venue ?? undefined,
        amount: ticket.amount,
      };
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';

      emailService.sendTicketConfirmation(ticket.email, ticketPayload)
        .catch(err => console.error('Ticket confirmation email error:', err));
      whatsappService.sendTicketConfirmation(ticket.phone, {
        ...ticketPayload,
        downloadUrl: `${baseUrl}/api/tickets/${ticket.id}/download`,
      }).catch(err => console.error('Ticket WhatsApp error:', err));
    }

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error("Update ticket error:", error);
    return NextResponse.json(
      { error: "Failed to update ticket" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.ticket.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Ticket deleted" });
  } catch (error) {
    console.error("Delete ticket error:", error);
    return NextResponse.json(
      { error: "Failed to delete ticket" },
      { status: 500 }
    );
  }
}
