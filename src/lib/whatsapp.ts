/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/whatsapp.ts
import twilio from 'twilio';

/**
 * WhatsApp Service for Casa Privé
 * Handles WhatsApp notifications using Twilio
 */
export class WhatsAppService {
  private client?: ReturnType<typeof twilio>;
  private fromNumber: string;
  private enabled: boolean;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'; // Twilio Sandbox default

    // Check if Twilio is configured
    this.enabled = !!(accountSid && authToken);

    if (this.enabled && accountSid && authToken) {
      this.client = twilio(accountSid, authToken);
    } else {
      console.warn('⚠ WhatsApp service not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN env variables.');
    }
  }

  /**
   * Format phone number for WhatsApp (must include country code)
   */
  private formatPhoneNumber(phone: string): string {
    // Remove any spaces, dashes, or parentheses
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');
    
    // If doesn't start with +, assume Ghana (+233) and add it
    if (!cleaned.startsWith('+')) {
      // Remove leading 0 if present
      if (cleaned.startsWith('0')) {
        cleaned = cleaned.substring(1);
      }
      // Add Ghana country code
      cleaned = '+233' + cleaned;
    }
    
    return `whatsapp:${cleaned}`;
  }

  /**
   * Send member welcome WhatsApp message
   */
  async sendMemberWelcome(phone: string, member: {
    fullName: string;
    membershipCode: string;
    membershipType?: string;
  }): Promise<void> {
    if (!this.enabled || !this.client) {
      console.log('⚠ WhatsApp not configured, skipping message');
      return;
    }

    try {
      const cardUrl = `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL}/member-card/${member.membershipCode}`;
      
      const message = `
🎉 *Welcome to Casa Privé!*

Dear ${member.fullName},

Congratulations! You are now an exclusive member of Casa Privé, Ghana's premier private members club.

*Your Membership Details:*
━━━━━━━━━━━━━━━━━━━━
📇 Member ID: ${member.membershipCode}
✅ Status: Active ${member.membershipType === 'PREMIUM' ? 'Premium' : 'Standard'} Member

*Your Digital Card:*
${cardUrl}

*Member Benefits:*
✨ Priority event access
👥 Guest privileges
🎯 Dedicated concierge
🍷 VIP table booking
🎊 Exclusive experiences

Save this message and your digital card for easy access at all our events!

Need assistance? Reply to this message or contact our concierge team.

_Welcome to a world where luxury meets exclusivity._

— Casa Privé Team
`.trim();

      const formattedPhone = this.formatPhoneNumber(phone);
      
      await this.client.messages.create({
        from: this.fromNumber,
        to: formattedPhone,
        body: message,
      });

      console.log(`✓ WhatsApp welcome message sent to ${phone}`);
    } catch (error: any) {
      console.error('Failed to send WhatsApp message:', error);
      
      // Log specific Twilio errors
      if (error.code) {
        console.error(`Twilio Error ${error.code}: ${error.message}`);
      }
      
      // Don't throw - we don't want WhatsApp failures to break the flow
      // Email is the primary notification method
    }
  }

  /**
   * Send booking confirmation via WhatsApp
   */
  async sendBookingConfirmation(phone: string, booking: {
    fullName: string;
    packageName: string;
    eventDate: string;
    numberOfGuests: number;
    confirmationCode: string;
  }): Promise<void> {
    if (!this.enabled || !this.client) {
      console.log('⚠ WhatsApp not configured, skipping message');
      return;
    }

    try {
      const message = `
🎊 *Booking Confirmed - Casa Privé*

Dear ${booking.fullName},

Your reservation is confirmed! We look forward to hosting you.

*Reservation Details:*
━━━━━━━━━━━━━━━━━━━━
📅 Date: ${booking.eventDate}
📦 Package: ${booking.packageName}
👥 Guests: ${booking.numberOfGuests}
🔢 Confirmation: ${booking.confirmationCode}

*Important Reminders:*
👔 Dress Code: Elegant Evening Attire
⏰ Arrival: 15 minutes before event
📧 Entry: Present your confirmation

See you soon at Casa Privé!

— The Casa Privé Team
`.trim();

      const formattedPhone = this.formatPhoneNumber(phone);
      
      await this.client.messages.create({
        from: this.fromNumber,
        to: formattedPhone,
        body: message,
      });

      console.log(`✓ WhatsApp booking confirmation sent to ${phone}`);
    } catch (error: any) {
      console.error('Failed to send WhatsApp booking confirmation:', error);
      if (error.code) {
        console.error(`Twilio Error ${error.code}: ${error.message}`);
      }
    }
  }

  /**
   * Send ticket confirmation via WhatsApp
   */
  async sendTicketConfirmation(phone: string, ticket: {
    fullName: string;
    ticketCode: string;
    tierName: string;
    eventName?: string;
    eventDate: string;
    venue?: string;
    numberOfGuests: number;
    amount: number;
    downloadUrl: string;
  }): Promise<void> {
    if (!this.enabled || !this.client) {
      console.log('⚠ WhatsApp not configured, skipping message');
      return;
    }

    try {
      const message = `🎟️ *Ticket Confirmed — Casa Privé*

Dear ${ticket.fullName},

Your ticket is confirmed! See you at the event.

*Ticket Details:*
━━━━━━━━━━━━━━━━━━━━
${ticket.eventName ? `🎉 Event: ${ticket.eventName}\n` : ''}📅 Date: ${ticket.eventDate}
${ticket.venue ? `📍 Venue: ${ticket.venue}\n` : ''}🎫 Tier: ${ticket.tierName}
👥 Guests: ${ticket.numberOfGuests}
💰 Amount Paid: GHS ${ticket.amount.toFixed(2)}
🔑 Ticket Code: *${ticket.ticketCode}*

*Download your ticket here:*
${ticket.downloadUrl}

*Before You Arrive:*
👔 Dress Code: Elegant attire — Dress to Impress
⏰ Arrive 15 minutes early
📱 Present this message or your ticket code at the entrance

— Casa Privé Team`.trim();

      await this.client.messages.create({
        from: this.fromNumber,
        to: this.formatPhoneNumber(phone),
        body: message,
      });

      console.log(`✓ WhatsApp ticket confirmation sent to ${phone}`);
    } catch (error: any) {
      console.error('Failed to send WhatsApp ticket confirmation:', error);
      if (error.code) console.error(`Twilio Error ${error.code}: ${error.message}`);
    }
  }

  /**
   * Send waitlist confirmation via WhatsApp
   */
  async sendWaitlistConfirmation(phone: string, details: {
    fullName: string;
    preferredDate: string;
    numberOfGuests: number;
  }): Promise<void> {
    if (!this.enabled || !this.client) {
      console.log('⚠ WhatsApp not configured, skipping message');
      return;
    }

    try {
      const message = `✅ *Waitlist Confirmed — Casa Privé*

Dear ${details.fullName},

You've been added to the Casa Privé waitlist!

*Details:*
━━━━━━━━━━━━━━━━━━━━
📅 Preferred Date: ${details.preferredDate}
👥 Guests: ${details.numberOfGuests}

We'll notify you as soon as a spot becomes available.

— Casa Privé Team`.trim();

      await this.client.messages.create({
        from: this.fromNumber,
        to: this.formatPhoneNumber(phone),
        body: message,
      });

      console.log(`✓ WhatsApp waitlist confirmation sent to ${phone}`);
    } catch (error: any) {
      console.error('Failed to send WhatsApp waitlist confirmation:', error);
      if (error.code) console.error(`Twilio Error ${error.code}: ${error.message}`);
    }
  }

  /**
   * Send general notification via WhatsApp
   */
  async sendNotification(phone: string, message: string): Promise<void> {
    if (!this.enabled || !this.client) {
      console.log('⚠ WhatsApp not configured, skipping message');
      return;
    }

    try {
      const formattedPhone = this.formatPhoneNumber(phone);
      
      await this.client.messages.create({
        from: this.fromNumber,
        to: formattedPhone,
        body: message,
      });

      console.log(`✓ WhatsApp notification sent to ${phone}`);
    } catch (error: any) {
      console.error('Failed to send WhatsApp notification:', error);
      if (error.code) {
        console.error(`Twilio Error ${error.code}: ${error.message}`);
      }
    }
  }
}

// Export singleton instance
export const whatsappService = new WhatsAppService();