// app/api/tickets/[id]/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { format } from 'date-fns';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Generate QR code as PNG buffer
    const qrBuffer = await QRCode.toBuffer(ticket.ticketCode, {
      errorCorrectionLevel: 'H',
      width: 200,
      margin: 1,
      color: { dark: '#10b981', light: '#ffffff' },
    });

    // Build PDF in memory
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({ size: [400, 600], margin: 0 });
      const chunks: Buffer[] = [];
      doc.on('data', (c: Buffer) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const W = 400;
      const H = 600;

      // ── Background ────────────────────────────────────────────────────────
      doc.rect(0, 0, W, H).fill('#0f172a'); // slate-900

      // ── Top accent bar ─────────────────────────────────────────────────────
      doc.rect(0, 0, W, 6).fill('#10b981'); // emerald-500

      // ── Header band ────────────────────────────────────────────────────────
      doc.rect(0, 6, W, 90).fill('#1e293b'); // slate-800

      doc.font('Helvetica-Bold')
        .fontSize(22)
        .fillColor('#d4af37')        // gold
        .text('CASA PRIVÉ', 0, 22, { align: 'center' });

      doc.font('Helvetica')
        .fontSize(9)
        .fillColor('#94a3b8')        // slate-400
        .text('× ALORA BEACH RESORT', 0, 48, { align: 'center' });

      const eventName = ticket.event?.name || 'Casa Privé Event';
      doc.font('Helvetica-Bold')
        .fontSize(11)
        .fillColor('#e2e8f0')
        .text(eventName.toUpperCase(), 30, 66, { width: W - 60, align: 'center' });

      // ── Tear-line ──────────────────────────────────────────────────────────
      doc.moveTo(0, 100).lineTo(W, 100)
        .dash(4, { space: 4 })
        .strokeColor('#334155')
        .lineWidth(1)
        .stroke()
        .undash();

      // ── QR Code ────────────────────────────────────────────────────────────
      const qrSize = 140;
      const qrX = (W - qrSize) / 2;
      doc.rect(qrX - 8, 112, qrSize + 16, qrSize + 16).fill('#ffffff');
      doc.image(qrBuffer, qrX, 120, { width: qrSize, height: qrSize });

      doc.font('Helvetica')
        .fontSize(8)
        .fillColor('#64748b')
        .text('Scan at entrance', 0, 270, { align: 'center' });

      // ── Ticket code ────────────────────────────────────────────────────────
      doc.rect(30, 288, W - 60, 32).fill('#0f172a').stroke('#10b981');
      doc.font('Helvetica-Bold')
        .fontSize(13)
        .fillColor('#10b981')
        .text(ticket.ticketCode, 0, 296, { align: 'center', characterSpacing: 2 });

      // ── Divider ────────────────────────────────────────────────────────────
      doc.rect(30, 334, W - 60, 1).fill('#1e293b');

      // ── Details grid ───────────────────────────────────────────────────────
      const leftX = 40;
      const rightX = W / 2 + 10;
      let y = 348;
      const lineH = 42;

      const field = (
        label: string,
        value: string,
        x: number,
        colW: number,
        yPos: number
      ) => {
        doc.font('Helvetica')
          .fontSize(8)
          .fillColor('#64748b')
          .text(label.toUpperCase(), x, yPos, { width: colW });
        doc.font('Helvetica-Bold')
          .fontSize(10)
          .fillColor('#e2e8f0')
          .text(value, x, yPos + 12, { width: colW });
      };

      const colW = W / 2 - 50;

      field('Name', ticket.fullName, leftX, colW, y);
      field('Tier', ticket.tierName, rightX, colW, y);
      y += lineH;

      const dateStr = format(new Date(ticket.eventDate), 'dd MMM yyyy');
      const timeStr = ticket.event
        ? format(new Date(ticket.event.date), 'h:mm a')
        : '';
      field('Date', dateStr + (timeStr ? `  ${timeStr}` : ''), leftX, colW, y);
      field('Guests', String(ticket.numberOfGuests), rightX, colW, y);
      y += lineH;

      if (ticket.event?.venue) {
        field('Venue', ticket.event.venue, leftX, W - 80, y);
        y += lineH;
      }

      field('Amount Paid', `GHS ${ticket.amount}`, leftX, colW, y);
      field('Status', ticket.status, rightX, colW, y);

      // ── Bottom accent ──────────────────────────────────────────────────────
      doc.rect(0, H - 6, W, 6).fill('#10b981');
      doc.font('Helvetica')
        .fontSize(7)
        .fillColor('#334155')
        .text('This ticket is your entry pass. Please present at the entrance.', 0, H - 22, { align: 'center' });

      doc.end();
    });

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ticket-${ticket.ticketCode}.pdf"`,
        'Content-Length': String(pdfBuffer.length),
      },
    });
  } catch (error) {
    console.error('Ticket download error:', error);
    return NextResponse.json({ error: 'Failed to generate ticket' }, { status: 500 });
  }
}
