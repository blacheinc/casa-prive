// lib/email.ts
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

/**
 * Email Service for Casa Privé
 * Handles all transactional emails with luxury emerald & gold design
 * Matching the Casa Privé brand identity
 */
export class EmailService {
  private resend: Resend;
  private baseUrl: string;
  private fromEmail: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured in environment variables');
    }

    this.resend = new Resend(apiKey);
    this.baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    this.fromEmail = process.env.EMAIL_FROM || 'Casa Privé <noreply@casaprive.com>';
  }

  /**
   * Get premium email styles with emerald & gold theme
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
        background: #0f172a;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-weight: 300;
        letter-spacing: 0.015em;
      }

      /* Email Wrapper */
      .email-wrapper {
        background: linear-gradient(135deg, #0f172a 0%, #064e3b 100%);
        padding: 50px 20px;
      }

      /* Main Container */
      .container {
        max-width: 650px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 0;
        overflow: hidden;
        box-shadow: 0 25px 70px rgba(16, 185, 129, 0.3);
      }

      /* Header Section */
      .header {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        padding: 50px 40px;
        border-bottom: 3px solid #10b981;
        position: relative;
      }

      .header::after {
        content: '';
        position: absolute;
        bottom: -3px;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #10b981 0%, #d4af37 100%);
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
        filter: drop-shadow(0 4px 6px rgba(16, 185, 129, 0.3));
      }

      .brand-container {
        flex: 1;
      }

      .brand-name {
        font-size: 34px;
        font-weight: 300;
        letter-spacing: 5px;
        background: linear-gradient(135deg, #10b981 0%, #d4af37 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-transform: uppercase;
        font-family: 'Garamond', 'Georgia', serif;
        margin-bottom: 8px;
      }

      .subtitle {
        font-size: 11px;
        letter-spacing: 2.5px;
        color: #94a3b8;
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
        color: #0f172a;
        margin-bottom: 30px;
        font-weight: 300;
        letter-spacing: 2px;
        line-height: 1.4;
      }

      .intro-text {
        font-size: 16px;
        color: #334155;
        margin-bottom: 35px;
        line-height: 1.9;
        font-weight: 300;
      }

      /* Divider */
      .divider {
        height: 2px;
        background: linear-gradient(to right, transparent, #10b981, #d4af37, transparent);
        margin: 40px 0;
      }

      /* Details Card */
      .details-card {
        background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
        padding: 40px;
        margin: 35px 0;
        border-left: 5px solid #10b981;
        border-radius: 0;
        box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.1);
      }

      .details-title {
        font-size: 22px;
        background: linear-gradient(135deg, #10b981 0%, #d4af37 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 35px;
        letter-spacing: 2px;
        text-transform: uppercase;
        font-weight: 300;
      }

      /* Info Box */
      .info-box {
        background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
        border: 2px solid #d4af37;
        padding: 35px;
        margin: 35px 0;
        border-radius: 0;
        box-shadow: 0 4px 6px -1px rgba(212, 175, 55, 0.1);
      }

      .info-title {
        font-size: 17px;
        color: #b8923b;
        margin-bottom: 25px;
        letter-spacing: 2px;
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
        color: #64748b;
        font-size: 15px;
        line-height: 1.7;
        font-weight: 300;
      }

      .info-list li:before {
        content: '◆';
        position: absolute;
        left: 0;
        color: #10b981;
        font-size: 11px;
        top: 13px;
      }

      /* CTA Button */
      .cta-button {
        display: inline-block;
        padding: 20px 55px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: #ffffff;
        text-decoration: none;
        text-transform: uppercase;
        letter-spacing: 3px;
        font-size: 13px;
        font-weight: 300;
        border-radius: 0;
        margin: 30px 0;
        font-family: 'Arial', sans-serif;
        box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35);
        transition: all 0.3s ease;
        border: 1px solid rgba(212, 175, 55, 0.3);
      }

      /* Item List (for orders) */
      .item-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .item-list li {
        padding: 18px 0;
        border-bottom: 1px solid #e2e8f0;
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
        color: #64748b;
        font-weight: 600;
        margin-bottom: 6px;
        letter-spacing: 0.5px;
      }

      .item-details {
        font-size: 14px;
        color: #64748b;
        margin-top: 6px;
        font-weight: 300;
      }

      .item-price {
        font-size: 16px;
        background: linear-gradient(135deg, #10b981 0%, #d4af37 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 500;
        margin-left: 20px;
      }

      .total-amount {
        font-size: 26px;
        background: linear-gradient(135deg, #10b981 0%, #d4af37 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 300;
        letter-spacing: 2px;
        text-align: right;
        margin-top: 25px;
        padding-top: 25px;
        border-top: 2px solid;
        border-image: linear-gradient(90deg, #10b981, #d4af37) 1;
      }

      /* Footer */
      .footer {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        color: #94a3b8;
        padding: 45px 40px;
        text-align: center;
        border-top: 1px solid #334155;
      }

      .footer-brand {
        font-size: 20px;
        background: linear-gradient(135deg, #10b981 0%, #d4af37 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        letter-spacing: 4px;
        margin-bottom: 15px;
        text-transform: uppercase;
        font-weight: 300;
      }

      .accent-line {
        height: 1px;
        background: linear-gradient(to right, transparent, #10b981, #d4af37, transparent);
        margin: 20px auto;
        width: 220px;
      }

      .footer-tagline {
        font-size: 12px;
        letter-spacing: 2px;
        color: #64748b;
        margin: 18px 0;
        text-transform: uppercase;
        font-style: italic;
        font-weight: 300;
      }

      .footer-text {
        font-size: 13px;
        color: #475569;
        margin: 8px 0;
        line-height: 1.6;
        font-weight: 300;
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
   * Get logo as base64 or URL
   */
  private getLogoBase64(): string {
    try {
      const logoPath = path.join(process.cwd(), 'public', 'logo.png');
      const logoBuffer = fs.readFileSync(logoPath);
      const base64Logo = logoBuffer.toString('base64');
      return `data:image/png;base64,${base64Logo}`;
    } catch (error) {
      console.warn('⚠ Logo file not found, using placeholder');
      // Return a placeholder or your hosted logo URL
      return `${this.baseUrl}/logo.png`;
    }
  }

  /**
   * Send member welcome email with membership card link
   */
  async sendMemberWelcome(to: string, member: {
    fullName: string;
    membershipCode: string;
    email: string;
    phone?: string;
  }): Promise<void> {
    try {
      const logoSrc = this.getLogoBase64();
      const memberCardUrl = `${this.baseUrl}/member-card/${member.membershipCode}`;

      const html = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="color-scheme" content="light">
            <meta name="supported-color-schemes" content="light">
            <title>Welcome to Casa Privé - Your Exclusive Membership</title>
            <style>${this.getEmailStyles()}</style>
          </head>
          <body>
            <div class="email-wrapper">
              <div class="container">
                <!-- Header -->
                <div class="header">
                  <div class="logo-section">
                    <img src="${logoSrc}" alt="Casa Privé Logo" class="logo" />
                    <div class="brand-container">
                      <div class="brand-name">CASA PRIVÉ</div>
                      <div class="subtitle">Exclusive Membership</div>
                    </div>
                  </div>
                </div>
                
                <!-- Content -->
                <div class="content">
                  <h1 class="greeting">Welcome to the Circle</h1>
                  
                  <p class="intro-text">
                    Dear ${member.fullName},
                  </p>
                  
                  <p class="intro-text">
                    Congratulations! You are now a distinguished member of Casa Privé, Ghana's most exclusive 
                    private members club. Your membership grants you access to our world of luxury, sophistication, 
                    and unforgettable experiences.
                  </p>

                  <div class="divider"></div>

                  <!-- Membership Details -->
                  <div class="details-card">
                    <h2 class="details-title">Your Membership</h2>
                    
                    <ul class="item-list">
                      <li>
                        <div class="item-info">
                          <div class="item-name">Member Name</div>
                          <div class="item-details">${member.fullName}</div>
                        </div>
                      </li>
                      
                      <li>
                        <div class="item-info">
                          <div class="item-name">Membership ID</div>
                          <div class="item-details">${member.membershipCode}</div>
                        </div>
                      </li>
                      
                      <li>
                        <div class="item-info">
                          <div class="item-name">Status</div>
                          <div class="item-details">Active - Premium Member</div>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <!-- Digital Card CTA -->
                  <div style="text-align: center; margin: 45px 0;">
                    <p class="intro-text" style="margin-bottom: 20px; font-size: 18px;">
                      Your Digital Membership Card
                    </p>
                    <a href="${memberCardUrl}" class="cta-button">
                      VIEW YOUR MEMBERSHIP CARD
                    </a>
                    <p class="intro-text" style="margin-top: 20px; font-size: 13px; color: #64748b;">
                      Save this link or add to your home screen for quick access
                    </p>
                  </div>

                  <!-- Member Benefits -->
                  <div class="info-box">
                    <h3 class="info-title">Exclusive Member Benefits</h3>
                    <ul class="info-list">
                      <li>Priority access to all Casa Privé signature events</li>
                      <li>Complimentary guest privileges for select occasions</li>
                      <li>Dedicated concierge service for reservations</li>
                      <li>Access to members-only experiences and venues</li>
                      <li>Preferential booking for private dining and VIP tables</li>
                      <li>Invitations to exclusive networking events</li>
                      <li>Special member pricing on premium packages</li>
                    </ul>
                  </div>

                  <div class="divider"></div>

                  <!-- Next Steps -->
                  <div class="details-card">
                    <h2 class="details-title">Getting Started</h2>
                    
                    <p class="intro-text" style="margin-bottom: 25px;">
                      To ensure you make the most of your membership, here's what you need to know:
                    </p>

                    <ul class="item-list">
                      <li>
                        <div class="item-info">
                          <div class="item-name">1. Save Your Digital Card</div>
                          <div class="item-details">Click the button above to access your digital membership card. Save it to your phone for entry to events.</div>
                        </div>
                      </li>
                      
                      <li>
                        <div class="item-info">
                          <div class="item-name">2. Stay Connected</div>
                          <div class="item-details">Follow us on social media and check your email regularly for exclusive event invitations.</div>
                        </div>
                      </li>
                      
                      <li>
                        <div class="item-info">
                          <div class="item-name">3. Make Reservations</div>
                          <div class="item-details">Contact our concierge team to book your first experience with priority member access.</div>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div class="divider"></div>

                  <p class="intro-text">
                    Should you require any assistance or wish to make a reservation, our concierge team is 
                    available at <strong>${process.env.ADMIN_EMAIL || 'concierge@casaprive.com'}</strong>${member.phone ? ` or via WhatsApp at <strong>${member.phone}</strong>` : ''}.
                  </p>

                  <p class="intro-text" style="margin-bottom: 0;">
                    Welcome to a world where luxury meets exclusivity.
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
                  <div style="margin-top: 25px;">
                    <p class="footer-text" style="font-size: 11px;">
                      Your membership card: <a href="${memberCardUrl}" style="color: #10b981; text-decoration: none;">${memberCardUrl}</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;

      await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: '🎉 Welcome to Casa Privé - Your Exclusive Membership Awaits',
        html,
      });

      console.log(`✓ Member welcome email sent to ${to}`);
    } catch (error) {
      console.error('Failed to send member welcome email:', error);
      throw error;
    }
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
      const logoSrc = this.getLogoBase64();

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
                    <img src="${logoSrc}" alt="Casa Privé Logo" class="logo" />
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
                          <div class="item-details">${booking.id.slice(-8).toUpperCase()}</div>
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

      await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: 'Casa Privé - Your Exclusive Reservation is Confirmed',
        html,
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
      const logoSrc = this.getLogoBase64();

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
                    <img src="${logoSrc}" alt="Casa Privé Logo" class="logo" />
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
                          <div class="item-details">${order.id.slice(-8).toUpperCase()}</div>
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

      await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: 'Casa Privé - Your Order Has Been Received',
        html,
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
      const logoSrc = this.getLogoBase64();
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
                    <img src="${logoSrc}" alt="Casa Privé Logo" class="logo" />
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

      await this.resend.emails.send({
        from: this.fromEmail,
        to: adminEmail,
        subject: `[Casa Privé Admin] ${subject}`,
        html,
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
      const logoSrc = this.getLogoBase64();

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
                    <img src="${logoSrc}" alt="Casa Privé Logo" class="logo" />
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

      await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: 'Casa Privé - Exclusive Waitlist Confirmation',
        html,
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
      const logoSrc = this.getLogoBase64();

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
                    <img src="${logoSrc}" alt="Casa Privé Logo" class="logo" />
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

      await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: '🎉 Casa Privé - Exclusive Table Now Available for Your Preferred Date',
        html,
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