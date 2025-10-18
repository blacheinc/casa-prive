// lib/email.ts
import nodemailer from 'nodemailer';
import path from 'path';

/**
 * Email Service for Casa Privé
 * Handles all transactional emails with luxury design
 * Optimized for both light and dark mode email clients
 */
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

    this.baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  }

  /**
   * Get premium email styles optimized for dark mode
   */
  private getEmailStyles(): string {
    return `
      /* Reset & Base Styles */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Georgia', 'Times New Roman', serif;
        line-height: 1.8;
        color: #1a1a1a;
        background: #0f0f0f;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      /* Email Wrapper */
      .email-wrapper {
        background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
        padding: 50px 20px;
      }

      /* Main Container */
      .container {
        max-width: 650px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 0;
        overflow: hidden;
        box-shadow: 0 25px 70px rgba(212, 175, 55, 0.2);
      }

      /* Header Section */
      .header {
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        padding: 50px 40px;
        border-bottom: 3px solid #d4af37;
      }

      .logo-section {
        display: flex;
        align-items: center;
        gap: 30px;
        margin-bottom: 25px;
      }

      .logo {
        width: 65px;
        height: 65px;
        margin-right: 20px;
        object-fit: contain;
      }

      .brand-container {
        flex: 1;
      }

      .brand-name {
        font-size: 34px;
        font-weight: 300;
        letter-spacing: 4px;
        color: #d4af37;
        text-transform: uppercase;
        font-family: 'Garamond', 'Georgia', serif;
        margin-bottom: 8px;
      }

      .subtitle {
        font-size: 11px;
        letter-spacing: 2.5px;
        color: #c0c0c0;
        text-transform: uppercase;
        font-family: 'Arial', sans-serif;
        font-weight: 300;
        margin-bottom: 25px;
      }

      /* Content Section */
      .content {
        padding: 55px 45px;
        background: #ffffff;
      }

      .greeting {
        font-size: 32px;
        color: #2a2a2a;
        margin-bottom: 30px;
        font-weight: 300;
        letter-spacing: 1.5px;
        line-height: 1.4;
      }

      .intro-text {
        font-size: 16px;
        color: #333333;
        margin-bottom: 35px;
        line-height: 1.9;
      }

      /* Divider */
      .divider {
        height: 2px;
        background: linear-gradient(to right, transparent, #d4af37, transparent);
        margin: 40px 0;
      }

      /* Details Card */
      .details-card {
        background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
        padding: 40px;
        margin: 35px 0;
        border-left: 5px solid #d4af37;
        border-radius: 0;
      }

      .details-title {
        font-size: 22px;
        color: #d4af37;
        margin-bottom: 35px;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        font-weight: 300;
      }

      /* Info Box */
      .info-box {
        background: linear-gradient(135deg, #fffdf7 0%, #fff9e6 100%);
        border: 2px solid #d4af37;
        padding: 35px;
        margin: 35px 0;
        border-radius: 0;
      }

      .info-title {
        font-size: 17px;
        color: #d4af37;
        margin-bottom: 25px;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        font-family: 'Arial', sans-serif;
        font-weight: 500;
      }

      .info-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .info-list li {
        padding: 12px 0;
        padding-left: 30px;
        position: relative;
        color: #333333;
        font-size: 15px;
        line-height: 1.7;
        font-weight: 400;
      }

      .info-list li:before {
        content: '◆';
        position: absolute;
        left: 0;
        color: #d4af37;
        font-size: 11px;
        top: 13px;
      }

      /* CTA Button */
      .cta-button {
        display: inline-block;
        padding: 20px 55px;
        background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
        color: #1a1a1a;
        text-decoration: none;
        text-transform: uppercase;
        letter-spacing: 2.5px;
        font-size: 13px;
        font-weight: 700;
        border-radius: 0;
        margin: 30px 0;
        font-family: 'Arial', sans-serif;
        box-shadow: 0 6px 20px rgba(212, 175, 55, 0.35);
        transition: all 0.3s ease;
      }

      /* Item List (for orders) */
      .item-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .item-list li {
        padding: 18px 0;
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 25px;
      }

      .item-list li:last-child {
        border-bottom: none;
      }

      .item-info {
        flex: 1;
      }

      .item-name {
        font-size: 16px;
        color: #2a2a2a;
        font-weight: 600;
        margin-bottom: 6px;
      }

      .item-details {
        font-size: 14px;
        color: #666666;
        margin-top: 6px;
        font-weight: 400;
      }

      .item-price {
        font-size: 16px;
        color: #d4af37;
        font-weight: 600;
        margin-left: 20px;
      }

      .total-amount {
        font-size: 26px;
        color: #d4af37;
        font-weight: 300;
        letter-spacing: 1.5px;
        text-align: right;
        margin-top: 25px;
        padding-top: 25px;
        border-top: 2px solid #d4af37;
      }

      /* Footer */
      .footer {
        background: #1a1a1a;
        color: #c0c0c0;
        padding: 45px 40px;
        text-align: center;
        border-top: 1px solid #333;
      }

      .footer-brand {
        font-size: 20px;
        color: #d4af37;
        letter-spacing: 3px;
        margin-bottom: 15px;
        text-transform: uppercase;
        font-weight: 300;
      }

      .accent-line {
        height: 1px;
        background: linear-gradient(to right, transparent, #d4af37, transparent);
        margin: 20px auto;
        width: 220px;
      }

      .footer-tagline {
        font-size: 12px;
        letter-spacing: 1.5px;
        color: #a8a8a8;
        margin: 18px 0;
        text-transform: uppercase;
        font-style: italic;
        font-weight: 300;
      }

      .footer-text {
        font-size: 13px;
        color: #999;
        margin: 8px 0;
        line-height: 1.6;
      }

      /* Responsive */
      @media only screen and (max-width: 600px) {
        .email-wrapper {
          padding: 30px 15px;
        }

        .header {
          padding: 35px 25px;
        }

        .content {
          padding: 40px 25px;
        }

        .logo-section {
          gap: 20px;
        }

        .logo {
          width: 50px;
          height: 50px;
        }

        .brand-name {
          font-size: 26px;
          letter-spacing: 3px;
        }

        .greeting {
          font-size: 26px;
        }

        .details-card {
          padding: 30px 25px;
        }

        .info-box {
          padding: 25px 20px;
        }

        .detail-row {
          flex-direction: column;
          gap: 8px;
          align-items: flex-start;
        }

        .detail-value {
          text-align: left;
        }
      }
    `;
  }

  /**
   * Get logo path
   */
  private getLogoPath(): string {
    return path.join(process.cwd(), 'public', 'logo.png');
  }

  /**
   * Send booking confirmation email
   */
  async sendBookingConfirmation(to: string, booking: {
    id: string;
    fullName: string;
    packageName: string;
    numberOfGuests: number;
    eventDate: string;
    tableNumber: number | null;
    amount: number;
  }): Promise<void> {
    try {
      const logoPath = this.getLogoPath();

      const html = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="color-scheme" content="light">
            <meta name="supported-color-schemes" content="light">
            <title>Booking Confirmation - Casa Privé</title>
            <style>${this.getEmailStyles()}</style>
          </head>
          <body>
            <div class="email-wrapper">
              <div class="container">
                <!-- Header -->
                <div class="header">
                  <div class="logo-section">
                    <img src="cid:logo" alt="Casa Privé Logo" class="logo" />
                    <div class="brand-container">
                      <div class="brand-name">CASA PRIVÉ</div>
                      <div class="subtitle">Exclusive Events</div>
                    </div>
                  </div>
                </div>
                
                <!-- Content -->
                <div class="content">
                  <h1 class="greeting">Booking Confirmed</h1>
                  
                  <p class="intro-text">
                    Dear ${booking.fullName},
                  </p>
                  
                  <p class="intro-text">
                    Your reservation has been confirmed. We are delighted to welcome you to Casa Privé 
                    for an unforgettable evening of luxury and entertainment.
                  </p>

                  <div class="divider"></div>

                  <!-- Booking Details -->
                  <div class="details-card">
                    <h2 class="details-title">Reservation Details</h2>
                    
                    <ul class="item-list">
                      <li>
                        <div class="item-info">
                          <div class="item-name">Confirmation No.</div>
                          <div class="item-details">${booking.id.slice(-4).toUpperCase()}</div>
                        </div>
                      </li>
                      
                      <li>
                        <div class="item-info">
                          <div class="item-name">Package</div>
                          <div class="item-details">${booking.packageName}</div>
                        </div>
                      </li>
                      
                      <li>
                        <div class="item-info">
                          <div class="item-name">Event Date</div>
                          <div class="item-details">${booking.eventDate}</div>
                        </div>
                      </li>
                      
                      <li>
                        <div class="item-info">
                          <div class="item-name">Party Size</div>
                          <div class="item-details">${booking.numberOfGuests} Guest${booking.numberOfGuests > 1 ? 's' : ''}</div>
                        </div>
                      </li>
                      
                      ${booking.tableNumber ? `
                        <li>
                          <div class="item-info">
                            <div class="item-name">Table Number</div>
                            <div class="item-details">Table ${booking.tableNumber}</div>
                          </div>
                        </li>
                      ` : ''}
                      
                      <li>
                        <div class="item-info">
                          <div class="item-name">Total Investment</div>
                          <div class="item-details">GHS ${booking.amount.toFixed(2)}</div>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <!-- Important Information -->
                  <div class="info-box">
                    <h3 class="info-title">Essential Information</h3>
                    <ul class="info-list">
                      <li>Dress Code: Elegant Evening Attire - Dress to Impress</li>
                      <li>Arrival Time: 15 minutes prior to event commencement</li>
                      <li>Entry Requirement: Present this confirmation email</li>
                      <li>Table Capacity: Maximum of 6 distinguished guests</li>
                      <li>Premium Bar Service & Signature Cocktails Available</li>
                    </ul>
                  </div>

                  <div class="divider"></div>

                  <p class="intro-text">
                    Should you require any special arrangements or have inquiries, our concierge team 
                    is at your service at <strong>${process.env.ADMIN_EMAIL || 'concierge@casaprive.com'}</strong>
                  </p>

                  <p class="intro-text" style="margin-bottom: 0;">
                    We look forward to hosting you.
                  </p>
                  
                  <p class="intro-text" style="margin-top: 10px; margin-bottom: 0;">
                    <em>The Casa Privé Team</em>
                  </p>
                </div>

                <!-- Footer -->
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
        from: process.env.EMAIL_FROM || '"Casa Privé" <noreply@casaprive.com>',
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

      console.log(`✓ Booking confirmation sent to ${to}`);
    } catch (error) {
      console.error('Failed to send booking confirmation:', error);
      throw error;
    }
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(to: string, order: {
    id: string;
    customerName: string;
    tableNumberOrName: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    totalAmount: number;
  }): Promise<void> {
    try {
      const logoPath = this.getLogoPath();

      const itemsList = order.items
        .map((item) => `
          <li>
            <div class="item-info">
              <div class="item-name">${item.name}</div>
              <div class="item-details">Quantity: ${item.quantity}</div>
            </div>
            <div class="item-price">GHS ${(item.price * item.quantity).toFixed(2)}</div>
          </li>
        `)
        .join('');

      const html = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="color-scheme" content="light">
            <meta name="supported-color-schemes" content="light">
            <title>Order Confirmation - Casa Privé</title>
            <style>${this.getEmailStyles()}</style>
          </head>
          <body>
            <div class="email-wrapper">
              <div class="container">
                <!-- Header -->
                <div class="header">
                  <div class="logo-section">
                    <img src="cid:logo" alt="Casa Privé Logo" class="logo" />
                    <div class="brand-container">
                      <div class="brand-name">CASA PRIVÉ</div>
                      <div class="subtitle">Premium Beverages</div>
                    </div>
                  </div>
                </div>
                
                <!-- Content -->
                <div class="content">
                  <h1 class="greeting">Order Confirmed</h1>
                  
                  <p class="intro-text">
                    Dear ${order.customerName},
                  </p>
                  
                  <p class="intro-text">
                    Your order has been received and our expert mixologists are preparing your selection 
                    with the utmost care and attention to detail.
                  </p>

                  <div class="divider"></div>

                  <!-- Order Summary -->
                  <div class="details-card">
                    <h2 class="details-title">Order Summary</h2>
                    
                    <ul class="item-list">
                      <li>
                        <div class="item-info">
                          <div class="item-name">Order No.</div>
                          <div class="item-details">${order.id.slice(-4).toUpperCase()}</div>
                        </div>
                      </li>
                      
                      <li>
                        <div class="item-info">
                          <div class="item-name">Table</div>
                          <div class="item-details">${order.tableNumberOrName}</div>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <!-- Items Ordered -->
                  <div class="details-card">
                    <h2 class="details-title">Your Selection</h2>
                    <ul class="item-list">
                      ${itemsList}
                    </ul>
                    <div class="total-amount">
                      Total: GHS ${order.totalAmount.toFixed(2)}
                    </div>
                  </div>

                  <!-- Service Details -->
                  <div class="info-box">
                    <h3 class="info-title">Service Details</h3>
                    <ul class="info-list">
                      <li>Your order is being prepared by our expert mixologists</li>
                      <li>Expected service time: 15-20 minutes</li>
                      <li>Premium spirits and fresh ingredients used</li>
                      <li>Our bar staff is available for recommendations</li>
                    </ul>
                  </div>

                  <div class="divider"></div>

                  <p class="intro-text" style="margin-bottom: 0;">
                    Enjoy your evening at Casa Privé.
                  </p>
                  
                  <p class="intro-text" style="margin-top: 10px; margin-bottom: 0;">
                    <em>The Casa Privé Bar Team</em>
                  </p>
                </div>

                <!-- Footer -->
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
        from: process.env.EMAIL_FROM || '"Casa Privé" <noreply@casaprive.com>',
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

      console.log(`✓ Order confirmation sent to ${to}`);
    } catch (error) {
      console.error('Failed to send order confirmation:', error);
      throw error;
    }
  }

  /**
   * Send admin notification
   */
  async sendAdminNotification(subject: string, content: string): Promise<void> {
    try {
      const logoPath = this.getLogoPath();
      const adminEmail = process.env.ADMIN_EMAIL;

      if (!adminEmail) {
        console.warn('⚠ ADMIN_EMAIL not configured, skipping admin notification');
        return;
      }

      const html = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="color-scheme" content="light">
            <meta name="supported-color-schemes" content="light">
            <title>Admin Notification - Casa Privé</title>
            <style>${this.getEmailStyles()}</style>
          </head>
          <body>
            <div class="email-wrapper">
              <div class="container">
                <!-- Header -->
                <div class="header">
                  <div class="logo-section">
                    <img src="cid:logo" alt="Casa Privé Logo" class="logo" />
                    <div class="brand-container">
                      <div class="brand-name">CASA PRIVÉ</div>
                      <div class="subtitle">Admin Dashboard</div>
                    </div>
                  </div>
                </div>
                
                <!-- Content -->
                <div class="content">
                  <h1 class="greeting">System Notification</h1>
                  <div class="divider"></div>
                  ${content}
                </div>

                <!-- Footer -->
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
        from: process.env.EMAIL_FROM || '"Casa Privé" <noreply@casaprive.com>',
        to: adminEmail,
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

      console.log(`✓ Admin notification sent: ${subject}`);
    } catch (error) {
      console.error('Failed to send admin notification:', error);
      throw error;
    }
  }

  /**
   * Send waitlist confirmation email
   */
  async sendWaitlistConfirmation(to: string, waitlist: {
    fullName: string;
    preferredDate: string;
    numberOfGuests: number;
  }): Promise<void> {
    try {
      const logoPath = this.getLogoPath();

      const html = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="color-scheme" content="light">
            <meta name="supported-color-schemes" content="light">
            <title>Waitlist Confirmation - Casa Privé</title>
            <style>${this.getEmailStyles()}</style>
          </head>
          <body>
            <div class="email-wrapper">
              <div class="container">
                <!-- Header -->
                <div class="header">
                  <div class="logo-section">
                    <img src="cid:logo" alt="Casa Privé Logo" class="logo" />
                    <div class="brand-container">
                      <div class="brand-name">CASA PRIVÉ</div>
                      <div class="subtitle">Exclusive Waitlist</div>
                    </div>
                  </div>
                </div>
                
                <!-- Content -->
                <div class="content">
                  <h1 class="greeting">Waitlist Confirmation</h1>
                  
                  <p class="intro-text">
                    Dear ${waitlist.fullName},
                  </p>
                  
                  <p class="intro-text">
                    Thank you for your interest in Casa Privé. You have been added to our exclusive waitlist 
                    and will be notified immediately when a table becomes available.
                  </p>

                  <div class="divider"></div>

                  <!-- Waitlist Details -->
                  <div class="details-card">
                    <h2 class="details-title">Waitlist Details</h2>
                    
                    <ul class="item-list">
                      <li>
                        <div class="item-info">
                          <div class="item-name">Preferred Date</div>
                          <div class="item-details">${waitlist.preferredDate}</div>
                        </div>
                      </li>
                      
                      <li>
                        <div class="item-info">
                          <div class="item-name">Party Size</div>
                          <div class="item-details">${waitlist.numberOfGuests} Guest${waitlist.numberOfGuests > 1 ? 's' : ''}</div>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <!-- Next Steps -->
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
                    We appreciate your patience and look forward to hosting you soon.
                  </p>
                  
                  <p class="intro-text" style="margin-top: 10px; margin-bottom: 0;">
                    <em>The Casa Privé Concierge Team</em>
                  </p>
                </div>

                <!-- Footer -->
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
        from: process.env.EMAIL_FROM || '"Casa Privé" <noreply@casaprive.com>',
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

      console.log(`✓ Waitlist confirmation sent to ${to}`);
    } catch (error) {
      console.error('Failed to send waitlist confirmation:', error);
      throw error;
    }
  }

  /**
   * Send table available notification to waitlist member
   */
  async sendTableAvailableNotification(to: string, details: {
    fullName: string;
    preferredDate: string;
    numberOfGuests: number;
    responseDeadline: string;
  }): Promise<void> {
    try {
      const logoPath = this.getLogoPath();

      const html = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="color-scheme" content="light">
            <meta name="supported-color-schemes" content="light">
            <title>Table Available - Casa Privé</title>
            <style>${this.getEmailStyles()}</style>
          </head>
          <body>
            <div class="email-wrapper">
              <div class="container">
                <!-- Header -->
                <div class="header">
                  <div class="logo-section">
                    <img src="cid:logo" alt="Casa Privé Logo" class="logo" />
                    <div class="brand-container">
                      <div class="brand-name">CASA PRIVÉ</div>
                      <div class="subtitle">Priority Notification</div>
                    </div>
                  </div>
                </div>
                
                <!-- Content -->
                <div class="content">
                  <h1 class="greeting">Table Available</h1>
                  
                  <p class="intro-text">
                    Dear ${details.fullName},
                  </p>
                  
                  <p class="intro-text">
                    Excellent news! A table has become available for your preferred date. 
                    As a valued waitlist member, you have exclusive priority access to secure this reservation.
                  </p>

                  <div class="divider"></div>

                  <!-- Reservation Details -->
                  <div class="details-card">
                    <h2 class="details-title">Reservation Opportunity</h2>
                    
                    <ul class="item-list">
                      <li>
                        <div class="item-info">
                          <div class="item-name">Available Date</div>
                          <div class="item-details">${details.preferredDate}</div>
                        </div>
                      </li>
                      
                      <li>
                        <div class="item-info">
                          <div class="item-name">Party Size</div>
                          <div class="item-details">${details.numberOfGuests} Guest${details.numberOfGuests > 1 ? 's' : ''}</div>
                        </div>
                      </li>
                      
                      <li>
                        <div class="item-info">
                          <div class="item-name">Response Deadline</div>
                          <div class="item-details">${details.responseDeadline}</div>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <!-- CTA Button -->
                  <div style="text-align: center; margin: 45px 0;">
                    <a href="${this.baseUrl}/booking" class="cta-button">
                      SECURE YOUR RESERVATION
                    </a>
                  </div>

                  <!-- Urgency Info -->
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
                    We look forward to welcoming you to Casa Privé.
                  </p>
                  
                  <p class="intro-text" style="margin-top: 10px; margin-bottom: 0;">
                    <em>The Casa Privé Concierge Team</em><br>
                    <strong>${process.env.ADMIN_EMAIL || 'concierge@casaprive.com'}</strong>
                  </p>
                </div>

                <!-- Footer -->
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
        from: process.env.EMAIL_FROM || '"Casa Privé" <noreply@casaprive.com>',
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

      console.log(`✓ Table available notification sent to ${to}`);
    } catch (error) {
      console.error('Failed to send table available notification:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();