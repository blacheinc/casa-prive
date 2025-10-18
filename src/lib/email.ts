// lib/email.ts - WITH LOGO SUPPORT
import nodemailer from 'nodemailer';
import path from 'path';

export class EmailService {
  private transporter;
  private baseUrl: string;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Use environment variable for base URL (e.g., https://casaprive.com or http://localhost:3000)
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  }

  async sendBookingConfirmation(to: string, booking: {
    id: string;
    fullName: string;
    packageName: string;
    numberOfGuests: number;
    eventDate: string;
    tableNumber: number | null;
    amount: number;
  }) {
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #d4af37); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .logo { max-width: 150px; height: auto; margin-bottom: 15px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .details { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #10b981; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .btn { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="cid:logo" alt="Casa Privé Logo" class="logo" />
              <h1>CASA PRIVÉ</h1>
              <p>Booking Confirmation</p>
            </div>
            <div class="content">
              <h2>Thank you, ${booking.fullName}!</h2>
              <p>Your exclusive table booking has been confirmed. We look forward to welcoming you to Casa Privé.</p>
              
              <div class="details">
                <h3>Booking Details</h3>
                <p><strong>Booking ID:</strong> ${booking.id}</p>
                <p><strong>Package:</strong> ${booking.packageName}</p>
                <p><strong>Event Date:</strong> ${booking.eventDate}</p>
                <p><strong>Number of Guests:</strong> ${booking.numberOfGuests}</p>
                <p><strong>Table Number:</strong> ${booking.tableNumber || 'To be assigned'}</p>
                <p><strong>Amount Paid:</strong> GHS ${booking.amount.toFixed(2)}</p>
              </div>

              <p><strong>Important Reminders:</strong></p>
              <ul>
                <li>Dress code: Dress to Impress - Elegant attire required</li>
                <li>Maximum 6 guests per table</li>
                <li>Arrive 15 minutes before the event starts</li>
                <li>Present this confirmation email at the entrance</li>
              </ul>

              <p>For any inquiries, please contact us at ${process.env.ADMIN_EMAIL}</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Casa Privé. All rights reserved.</p>
              <p>The epitome of luxury and bespoke entertainment</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Casa Privé - Booking Confirmation',
      html,
      attachments: [
        {
          filename: 'logo.png',
          path: logoPath,
          cid: 'logo', // Content-ID for embedding
        },
      ],
    });
  }

  async sendOrderConfirmation(to: string, order: {
    id: string;
    customerName: string;
    tableNumberOrName: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    totalAmount: number;
  }) {
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');

    const itemsList = order.items
      .map((item) => `<li>${item.name} x${item.quantity} - GHS ${item.price.toFixed(2)}</li>`)
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #d4af37); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .logo { max-width: 150px; height: auto; margin-bottom: 15px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .details { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #10b981; }
            .total { font-size: 20px; font-weight: bold; color: #10b981; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="cid:logo" alt="Casa Privé Logo" class="logo" />
              <h1>CASA PRIVÉ</h1>
              <p>Order Confirmation</p>
            </div>
            <div class="content">
              <h2>Order Received</h2>
              <p>Thank you ${order.customerName}! Your order has been received and is being prepared.</p>
              
              <div class="details">
                <h3>Order Details</h3>
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p><strong>Table:</strong> ${order.tableNumberOrName}</p>
                <h4>Items:</h4>
                <ul>
                  ${itemsList}
                </ul>
                <p class="total">Total: GHS ${order.totalAmount.toFixed(2)}</p>
              </div>

              <p>Your order will be served shortly. Enjoy your evening at Casa Privé!</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Casa Privé - Order Confirmation',
      html,
      attachments: [
        {
          filename: 'logo.png',
          path: logoPath,
          cid: 'logo',
        },
      ],
    });
  }

  async sendAdminNotification(subject: string, content: string) {
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #d4af37); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .logo { max-width: 120px; height: auto; margin-bottom: 10px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="cid:logo" alt="Casa Privé Logo" class="logo" />
              <h2>Admin Notification</h2>
            </div>
            <div class="content">
              ${content}
            </div>
          </div>
        </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `[Casa Privé Admin] ${subject}`,
      html,
      attachments: [
        {
          filename: 'logo.png',
          path: logoPath,
          cid: 'logo',
        },
      ],
    });
  }

  async sendWaitlistConfirmation(to: string, waitlist: {
    fullName: string;
    preferredDate: string;
    numberOfGuests: number;
  }) {
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #d4af37); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .logo { max-width: 150px; height: auto; margin-bottom: 15px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="cid:logo" alt="Casa Privé Logo" class="logo" />
              <h1>CASA PRIVÉ</h1>
              <p>Waitlist Confirmation</p>
            </div>
            <div class="content">
              <h2>Thank you, ${waitlist.fullName}!</h2>
              <p>You've been added to our exclusive waitlist for ${waitlist.preferredDate}.</p>
              <p>Party size: ${waitlist.numberOfGuests} guests</p>
              <p>We'll notify you as soon as a table becomes available.</p>
              <p>Thank you for your patience and interest in Casa Privé.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Casa Privé. All rights reserved.</p>
              <p>The epitome of luxury and bespoke entertainment</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Casa Privé - Waitlist Confirmation',
      html,
      attachments: [
        {
          filename: 'logo.png',
          path: logoPath,
          cid: 'logo',
        },
      ],
    });
  }

  async sendTableAvailableNotification(to: string, details: {
    fullName: string;
    preferredDate: string;
    numberOfGuests: number;
    responseDeadline: string;
  }) {
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #d4af37); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .logo { max-width: 150px; height: auto; margin-bottom: 15px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .cta { text-align: center; margin: 25px 0; }
            .btn { display: inline-block; padding: 15px 40px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .urgent { background: #f59e0b; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="cid:logo" alt="Casa Privé Logo" class="logo" />
              <h1>CASA PRIVÉ</h1>
              <p>🎉 Table Available!</p>
            </div>
            <div class="content">
              <h2>Great News, ${details.fullName}!</h2>
              <p>A table has become available for your preferred date: <strong>${details.preferredDate}</strong></p>
              <p>Party size: ${details.numberOfGuests} guests</p>
              
              <div class="urgent">
                <p style="margin: 0; color: white; font-weight: bold;">⏰ Please respond by ${details.responseDeadline}</p>
              </div>

              <div class="cta">
                <a href="${this.baseUrl}/booking" class="btn">BOOK NOW</a>
              </div>

              <p>This opportunity won't last long. Secure your table now!</p>
              <p>If you have any questions, please contact us at ${process.env.ADMIN_EMAIL}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: '🎉 Casa Privé - Table Available for Your Preferred Date!',
      html,
      attachments: [
        {
          filename: 'logo.png',
          path: logoPath,
          cid: 'logo',
        },
      ],
    });
  }
}

export const emailService = new EmailService();