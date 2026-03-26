// app/api/tickets/[id]/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { format } from 'date-fns';

// Helpers
function hexToRgb(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

const W = 400;
const H = 600;

// pdfkit uses top-left origin; pdf-lib uses bottom-left.
// Convert: pdfY(top) + itemHeight → pdf-lib y
function py(pkitY: number, itemH = 0) {
  return H - pkitY - itemH;
}

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

    // ── PDF setup ────────────────────────────────────────────────────────────
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([W, H]);

    const fontReg  = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const qrImage  = await pdfDoc.embedPng(qrBuffer);

    const slate900 = hexToRgb('#0f172a');
    const slate800 = hexToRgb('#1e293b');
    const slate400 = hexToRgb('#94a3b8');
    const slate600 = hexToRgb('#64748b');
    const slate300 = hexToRgb('#334155');
    const emerald  = hexToRgb('#10b981');
    const gold     = hexToRgb('#d4af37');
    const textMain = hexToRgb('#e2e8f0');
    const white    = rgb(1, 1, 1);

    // ── Background ───────────────────────────────────────────────────────────
    page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: slate900 });

    // ── Top accent bar ───────────────────────────────────────────────────────
    page.drawRectangle({ x: 0, y: py(0, 6), width: W, height: 6, color: emerald });

    // ── Header band ──────────────────────────────────────────────────────────
    page.drawRectangle({ x: 0, y: py(6, 90), width: W, height: 90, color: slate800 });

    // "CASA PRIVÉ"
    const title = 'CASA PRIVÉ';
    const titleSize = 22;
    const titleW = fontBold.widthOfTextAtSize(title, titleSize);
    page.drawText(title, {
      x: (W - titleW) / 2,
      y: py(22, titleSize),
      font: fontBold,
      size: titleSize,
      color: gold,
    });

    // "× ALORA BEACH RESORT"
    const sub = '× ALORA BEACH RESORT';
    const subSize = 9;
    const subW = fontReg.widthOfTextAtSize(sub, subSize);
    page.drawText(sub, {
      x: (W - subW) / 2,
      y: py(48, subSize),
      font: fontReg,
      size: subSize,
      color: slate400,
    });

    // Event name
    const eventName = (ticket.event?.name || 'Casa Privé Event').toUpperCase();
    const evtSize = 11;
    const evtW = fontBold.widthOfTextAtSize(eventName, evtSize);
    page.drawText(eventName, {
      x: Math.max(30, (W - evtW) / 2),
      y: py(66, evtSize),
      font: fontBold,
      size: evtSize,
      color: textMain,
    });

    // ── Tear-line ─────────────────────────────────────────────────────────────
    page.drawLine({
      start: { x: 0, y: py(100) },
      end: { x: W, y: py(100) },
      color: slate300,
      thickness: 1,
      dashArray: [4, 4],
    });

    // ── QR Code ───────────────────────────────────────────────────────────────
    const qrSize = 140;
    const qrX = (W - qrSize) / 2;
    page.drawRectangle({ x: qrX - 8, y: py(112, qrSize + 16), width: qrSize + 16, height: qrSize + 16, color: white });
    page.drawImage(qrImage, { x: qrX, y: py(120, qrSize), width: qrSize, height: qrSize });

    const scan = 'Scan at entrance';
    const scanSize = 8;
    const scanW = fontReg.widthOfTextAtSize(scan, scanSize);
    page.drawText(scan, {
      x: (W - scanW) / 2,
      y: py(270, scanSize),
      font: fontReg,
      size: scanSize,
      color: slate600,
    });

    // ── Ticket code box ───────────────────────────────────────────────────────
    page.drawRectangle({
      x: 30, y: py(288, 32), width: W - 60, height: 32,
      color: slate900,
      borderColor: emerald,
      borderWidth: 1,
    });
    const codeSize = 13;
    const codeW = fontBold.widthOfTextAtSize(ticket.ticketCode, codeSize);
    page.drawText(ticket.ticketCode, {
      x: (W - codeW) / 2,
      y: py(296, codeSize),
      font: fontBold,
      size: codeSize,
      color: emerald,
    });

    // ── Divider ───────────────────────────────────────────────────────────────
    page.drawRectangle({ x: 30, y: py(334, 1), width: W - 60, height: 1, color: slate800 });

    // ── Details grid ──────────────────────────────────────────────────────────
    const colW = W / 2 - 50;
    const leftX = 40;
    const rightX = W / 2 + 10;
    const lineH = 42;
    let pkY = 348;

    const field = (label: string, value: string, x: number, colWidth: number, pkitY: number) => {
      page.drawText(label.toUpperCase(), {
        x, y: py(pkitY, 8), font: fontReg, size: 8, color: slate600,
      });
      page.drawText(value, {
        x, y: py(pkitY + 12, 10), font: fontBold, size: 10, color: textMain,
        maxWidth: colWidth,
      });
    };

    field('Name', ticket.fullName, leftX, colW, pkY);
    field('Tier', ticket.tierName, rightX, colW, pkY);
    pkY += lineH;

    const dateStr = format(new Date(ticket.eventDate), 'dd MMM yyyy');
    const timeStr = ticket.event ? format(new Date(ticket.event.date), 'h:mm a') : '';
    field('Date', dateStr + (timeStr ? `  ${timeStr}` : ''), leftX, colW, pkY);
    field('Guests', String(ticket.numberOfGuests), rightX, colW, pkY);
    pkY += lineH;

    if (ticket.event?.venue) {
      field('Venue', ticket.event.venue, leftX, W - 80, pkY);
      pkY += lineH;
    }

    field('Amount Paid', `GHS ${ticket.amount}`, leftX, colW, pkY);
    field('Status', ticket.status, rightX, colW, pkY);

    // ── Bottom accent ─────────────────────────────────────────────────────────
    page.drawRectangle({ x: 0, y: 0, width: W, height: 6, color: emerald });

    const footer = 'This ticket is your entry pass. Please present at the entrance.';
    const footerSize = 7;
    const footerW = fontReg.widthOfTextAtSize(footer, footerSize);
    page.drawText(footer, {
      x: (W - footerW) / 2,
      y: py(H - 22, footerSize),
      font: fontReg,
      size: footerSize,
      color: slate300,
    });

    // ── Serialise ─────────────────────────────────────────────────────────────
    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ticket-${ticket.ticketCode}.pdf"`,
        'Content-Length': String(pdfBytes.byteLength),
      },
    });
  } catch (error) {
    console.error('Ticket download error:', error);
    return NextResponse.json({ error: 'Failed to generate ticket' }, { status: 500 });
  }
}
