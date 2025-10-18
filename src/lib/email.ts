// lib/email.ts - LUXURY PREMIUM EMAIL DESIGN
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

    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  }

  private getEmailStyles() {
    return `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { 
        font-family: 'Georgia', 'Times New Roman', serif; 
        line-height: 1.8; 
        color: #1a1a1a;
        background: #0f0f0f;
      }
      .email-wrapper { 
        background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
        padding: 40px 20px; 
      }
      .container { 
        max-width: 650px; 
        margin: 0 auto; 
        background: #ffffff;
        border-radius: 0;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(212, 175, 55, 0.15);
      }
      .header { 
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        padding: 40px;
        border-bottom: 3px solid #d4af37;
        display: flex;
        align-items: center;
      }
      .logo-section {
        display: flex;
        align-items: center;
        gap: 20px;
      }
      .logo { 
        width: 60px; 
        height: 60px;
        object-fit: contain;
      }
      .brand-name {
        font-size: 32px;
        font-weight: 300;
        letter-spacing: 3px;
        color: #d4af37;
        text-transform: uppercase;
        font-family: 'Garamond', 'Georgia', serif;
      }
      .subtitle {
        font-size: 11px;
        letter-spacing: 2px;
        color: #999;
        text-transform: uppercase;
        margin-top: 5px;
        font-family: 'Arial', sans-serif;
      }
      .content { 
        padding: 50px 40px;
        background: #ffffff;
      }
      .greeting {
        font-size: 28px;
        color: #1a1a1a;
        margin-bottom: 20px;
        font-weight: 300;
        letter-spacing: 1px;
      }
      .intro-text {
        font-size: 16px;
        color: #4a4a4a;
        margin-bottom: 35px;
        line-height: 1.8;
      }
      .details-card { 
        background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
        padding: 35px;
        margin: 30px 0;
        border-left: 4px solid #d4af37;
        border-radius: 0;
      }
      .details-title {
        font-size: 20px;
        color: #d4af37;
        margin-bottom: 25px;
        letter-spacing: 1px;
        text-transform: uppercase;
        font-weight: 300;
      }
      .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 15px 0;
        border-bottom: 1px solid #e0e0e0;
      }
      .detail-row:last-child {
        border-bottom: none;
      }
      .detail-label {
        font-size: 13px;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-family: 'Arial', sans-serif;
      }
      .detail-value {
        font-size: 15px;
        color: #1a1a1a;
        font-weight: 500;
      }
      .divider {
        height: 2px;
        background: linear-gradient(to right, transparent, #d4af37, transparent);
        margin: 35px 0;
      }
      .info-box {
        background: linear-gradient(135deg, #fffdf7 0%, #fff9e6 100%);
        border: 1px solid #d4af37;
        padding: 30px;
        margin: 30px 0;
      }
      .info-title {
        font-size: 16px;
        color: #d4af37;
        margin-bottom: 15px;
        letter-spacing: 1px;
        text-transform: uppercase;
        font-family: 'Arial', sans-serif;
      }
      .info-list {
        list-style: none;
        padding: 0;
      }
      .info-list li {
        padding: 10px 0;
        padding-left: 25px;
        position: relative;
        color: #4a4a4a;
        font-size: 14px;
        line-height: 1.6;
      }
      .info-list li:before {
        content: '◆';
        position: absolute;
        left: 0;
        color: #d4af37;
        font-size: 10px;
      }
      .cta-button {
        display: inline-block;
        padding: 18px 50px;
        background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
        color: #1a1a1a;
        text-decoration: none;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-size: 13px;
        font-weight: 600;
        border-radius: 0;
        margin: 25px 0;
        font-family: 'Arial', sans-serif;
        box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
      }
      .footer { 
        background: #1a1a1a;
        color: #999;
        padding: 40px;
        text-align: center;
        border-top: 1px solid #333;
      }
      .footer-brand {
        font-size: 18px;
        color: #d4af37;
        letter-spacing: 2px;
        margin-bottom: 10px;
        text-transform: uppercase;
      }
      .footer-tagline {
        font-size: 11px;
        letter-spacing: 1px;
        color: #666;
        margin: 15px 0;
        text-transform: uppercase;
        font-style: italic;
      }
      .footer-text {
        font-size: 12px;
        color: #666;
        margin: 5px 0;
      }
      .accent-line {
        height: 1px;
        background: linear-gradient(to right, transparent, #d4af37, transparent);
        margin: 20px auto;
        width: 200px;
      }
      .total-amount {
        font-size: 24px;
        color: #d4af37;
        font-weight: 300;
        letter-spacing: 1px;
        text-align: right;
        margin-top: 20px;
      }
      .item-list {
        list-style: none;
        padding: 0;
      }
      .item-list li {
        padding: 15px 0;
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .item-name {
        font-size: 15px;
        color: #1a1a1a;
        font-weight: 500;
      }
      .item-details {
        font-size: 13px;
        color: #666;
        margin-top: 5px;
      }
      .item-price {
        font-size: 15px;
        color: #d4af37;
        font-weight: 500;
      }
    `;
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
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${this.getEmailStyles()}</style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="container">
              <div class="header">
                <div class="logo-section">
                  <img src="cid:logo" alt="Casa Privé" class="logo" />
                  <div>
                    <div class="brand-name">CASA PRIVÉ</div>
                    <div class="subtitle">Exclusive Events</div>
                  </div>
                </div>
              </div>
              
              <div class="content">
                <h1 class="greeting">Booking Confirmed</h1>
                <p class="intro-text">
                  Dear ${booking.fullName},<br><br>
                  Your reservation has been confirmed. We are delighted to welcome you to Casa Privé for an 
                  unforgettable evening of luxury and entertainment.
                </p>

                <div class="divider"></div>

                <div class="details-card">
                  <h2 class="details-title">Reservation Details</h2>
                  
                  <div class="detail-row">
                    <span class="detail-label">Confirmation Number</span>
                    <span class="detail-value">${booking.id}</span>
                  </div>
                  
                  <div class="detail-row">
                    <span class="detail-label">Package</span>
                    <span class="detail-value">${booking.packageName}</span>
                  </div>
                  
                  <div class="detail-row">
                    <span class="detail-label">Event Date</span>
                    <span class="detail-value">${booking.eventDate}</span>
                  </div>
                  
                  <div class="detail-row">
                    <span class="detail-label">Party Size</span>
                    <span class="detail-value">${booking.numberOfGuests} Guests</span>
                  </div>
                  
                  ${booking.tableNumber ? `
                    <div class="detail-row">
                      <span class="detail-label">Table Number</span>
                      <span class="detail-value">Table ${booking.tableNumber}</span>
                    </div>
                  ` : ''}
                  
                  <div class="detail-row">
                    <span class="detail-label">Total Investment</span>
                    <span class="detail-value">GHS ${booking.amount.toFixed(2)}</span>
                  </div>
                </div>

                <div class="info-box">
                  <h3 class="info-title">Essential Information</h3>
                  <ul class="info-list">
                    <li>Dress Code: Elegant Evening Attire - Dress to Impress</li>
                    <li>Arrival Time: 15 minutes prior to event commencement</li>
                    <li>Entry Requirement: Present this confirmation email</li>
                    <li>Table Capacity: Maximum of 6 distinguished guests</li>
                    <li>Complimentary Valet Parking Available</li>
                  </ul>
                </div>

                <div class="divider"></div>

                <p class="intro-text">
                  Should you require any special arrangements or have inquiries, our concierge team 
                  is at your service at <strong>${process.env.ADMIN_EMAIL}</strong>
                </p>

                <p class="intro-text" style="margin-bottom: 0;">
                  We look forward to hosting you.<br>
                  <em>The Casa Privé Team</em>
                </p>
              </div>

              <div class="footer">
                <div class="footer-brand">CASA PRIVÉ</div>
                <div class="accent-line"></div>
                <p class="footer-tagline">The Epitome of Luxury & Bespoke Entertainment</p>
                <p class="footer-text">© ${new Date().getFullYear()} Casa Privé. All Rights Reserved.</p>
                <p class="footer-text">Accra, Ghana</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Casa Privé - Your Exclusive Reservation is Confirmed',
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

  async sendOrderConfirmation(to: string, order: {
    id: string;
    customerName: string;
    tableNumberOrName: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    totalAmount: number;
  }) {
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');

    const itemsList = order.items
      .map((item) => `
        <li>
          <div>
            <div class="item-name">${item.name}</div>
            <div class="item-details">Quantity: ${item.quantity}</div>
          </div>
          <div class="item-price">GHS ${(item.price * item.quantity).toFixed(2)}</div>
        </li>
      `)
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${this.getEmailStyles()}</style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="container">
              <div class="header">
                <div class="logo-section">
                  <img src="cid:logo" alt="Casa Privé" class="logo" />
                  <div>
                    <div class="brand-name">CASA PRIVÉ</div>
                    <div class="subtitle">Culinary Excellence</div>
                  </div>
                </div>
              </div>
              
              <div class="content">
                <h1 class="greeting">Order Confirmed</h1>
                <p class="intro-text">
                  Dear ${order.customerName},<br><br>
                  Your order has been received and our culinary team is preparing your selection 
                  with the utmost care and attention to detail.
                </p>

                <div class="divider"></div>

                <div class="details-card">
                  <h2 class="details-title">Order Summary</h2>
                  
                  <div class="detail-row">
                    <span class="detail-label">Order Number</span>
                    <span class="detail-value">${order.id}</span>
                  </div>
                  
                  <div class="detail-row">
                    <span class="detail-label">Table</span>
                    <span class="detail-value">${order.tableNumberOrName}</span>
                  </div>
                </div>

                <div class="details-card">
                  <h2 class="details-title">Your Selection</h2>
                  <ul class="item-list">
                    ${itemsList}
                  </ul>
                  <div class="total-amount">
                    Total: GHS ${order.totalAmount.toFixed(2)}
                  </div>
                </div>

                <div class="info-box">
                  <h3 class="info-title">Service Details</h3>
                  <ul class="info-list">
                    <li>Your order is being prepared by our expert culinary team</li>
                    <li>Expected service time: 20-30 minutes</li>
                    <li>All ingredients are sourced fresh daily</li>
                    <li>Our sommelier is available for pairing recommendations</li>
                  </ul>
                </div>

                <div class="divider"></div>

                <p class="intro-text" style="margin-bottom: 0;">
                  Enjoy your evening at Casa Privé.<br>
                  <em>The Casa Privé Culinary Team</em>
                </p>
              </div>

              <div class="footer">
                <div class="footer-brand">CASA PRIVÉ</div>
                <div class="accent-line"></div>
                <p class="footer-tagline">The Epitome of Luxury & Bespoke Entertainment</p>
                <p class="footer-text">© ${new Date().getFullYear()} Casa Privé. All Rights Reserved.</p>
                <p class="footer-text">Accra, Ghana</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Casa Privé - Your Order Has Been Received',
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
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${this.getEmailStyles()}</style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="container">
              <div class="header">
                <div class="logo-section">
                  <img src="cid:logo" alt="Casa Privé" class="logo" />
                  <div>
                    <div class="brand-name">CASA PRIVÉ</div>
                    <div class="subtitle">Admin Dashboard</div>
                  </div>
                </div>
              </div>
              
              <div class="content">
                <h1 class="greeting">System Notification</h1>
                <div class="divider"></div>
                ${content}
              </div>

              <div class="footer">
                <div class="footer-brand">CASA PRIVÉ</div>
                <div class="accent-line"></div>
                <p class="footer-text">© ${new Date().getFullYear()} Casa Privé. All Rights Reserved.</p>
              </div>
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
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${this.getEmailStyles()}</style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="container">
              <div class="header">
                <div class="logo-section">
                  <img src="cid:logo" alt="Casa Privé" class="logo" />
                  <div>
                    <div class="brand-name">CASA PRIVÉ</div>
                    <div class="subtitle">Exclusive Waitlist</div>
                  </div>
                </div>
              </div>
              
              <div class="content">
                <h1 class="greeting">Waitlist Confirmation</h1>
                <p class="intro-text">
                  Dear ${waitlist.fullName},<br><br>
                  Thank you for your interest in Casa Privé. You have been added to our exclusive waitlist 
                  and will be notified immediately when a table becomes available.
                </p>

                <div class="divider"></div>

                <div class="details-card">
                  <h2 class="details-title">Waitlist Details</h2>
                  
                  <div class="detail-row">
                    <span class="detail-label">Preferred Date</span>
                    <span class="detail-value">${waitlist.preferredDate}</span>
                  </div>
                  
                  <div class="detail-row">
                    <span class="detail-label">Party Size</span>
                    <span class="detail-value">${waitlist.numberOfGuests} Guests</span>
                  </div>
                </div>

                <div class="info-box">
                  <h3 class="info-title">What Happens Next</h3>
                  <ul class="info-list">
                    <li>We will monitor availability for your preferred date</li>
                    <li>You will receive priority notification when a table opens</li>
                    <li>Confirmation will be required within 24 hours</li>
                    <li>Your patience is greatly appreciated</li>
                  </ul>
                </div>

                <div class="divider"></div>

                <p class="intro-text" style="margin-bottom: 0;">
                  We appreciate your patience and look forward to hosting you soon.<br>
                  <em>The Casa Privé Concierge Team</em>
                </p>
              </div>

              <div class="footer">
                <div class="footer-brand">CASA PRIVÉ</div>
                <div class="accent-line"></div>
                <p class="footer-tagline">The Epitome of Luxury & Bespoke Entertainment</p>
                <p class="footer-text">© ${new Date().getFullYear()} Casa Privé. All Rights Reserved.</p>
                <p class="footer-text">Accra, Ghana</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Casa Privé - Exclusive Waitlist Confirmation',
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
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${this.getEmailStyles()}</style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="container">
              <div class="header">
                <div class="logo-section">
                  <img src="cid:logo" alt="Casa Privé" class="logo" />
                  <div>
                    <div class="brand-name">CASA PRIVÉ</div>
                    <div class="subtitle">Priority Notification</div>
                  </div>
                </div>
              </div>
              
              <div class="content">
                <h1 class="greeting">Table Available</h1>
                <p class="intro-text">
                  Dear ${details.fullName},<br><br>
                  Excellent news! A table has become available for your preferred date. 
                  As a valued waitlist member, you have exclusive priority access to secure this reservation.
                </p>

                <div class="divider"></div>

                <div class="details-card">
                  <h2 class="details-title">Reservation Opportunity</h2>
                  
                  <div class="detail-row">
                    <span class="detail-label">Available Date</span>
                    <span class="detail-value">${details.preferredDate}</span>
                  </div>
                  
                  <div class="detail-row">
                    <span class="detail-label">Party Size</span>
                    <span class="detail-value">${details.numberOfGuests} Guests</span>
                  </div>
                  
                  <div class="detail-row">
                    <span class="detail-label">Response Deadline</span>
                    <span class="detail-value">${details.responseDeadline}</span>
                  </div>
                </div>

                <div style="text-align: center; margin: 40px 0;">
                  <a href="${this.baseUrl}/booking" class="cta-button">
                    SECURE YOUR RESERVATION
                  </a>
                </div>

                <div class="info-box">
                  <h3 class="info-title">Act Quickly</h3>
                  <ul class="info-list">
                    <li>This is a limited-time priority offer</li>
                    <li>Please confirm within 24 hours to secure your table</li>
                    <li>First confirmation receives the reservation</li>
                    <li>Contact our concierge for immediate assistance</li>
                  </ul>
                </div>

                <div class="divider"></div>

                <p class="intro-text" style="margin-bottom: 0;">
                  We look forward to welcoming you to Casa Privé.<br>
                  <em>The Casa Privé Concierge Team</em><br>
                  <strong>${process.env.ADMIN_EMAIL}</strong>
                </p>
              </div>

              <div class="footer">
                <div class="footer-brand">CASA PRIVÉ</div>
                <div class="accent-line"></div>
                <p class="footer-tagline">The Epitome of Luxury & Bespoke Entertainment</p>
                <p class="footer-text">© ${new Date().getFullYear()} Casa Privé. All Rights Reserved.</p>
                <p class="footer-text">Accra, Ghana</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: '🎉 Casa Privé - Exclusive Table Now Available for Your Preferred Date',
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