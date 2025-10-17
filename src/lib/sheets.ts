// lib/sheets.ts
import { google } from 'googleapis';

export class GoogleSheetsService {
  private sheets;
  private spreadsheetId: string;

  constructor() {
    const credentials = JSON.parse(
      process.env.GOOGLE_SHEETS_CREDENTIALS || '{}'
    );
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
    this.spreadsheetId = process.env.GOOGLE_SHEET_ID || '';
  }

  async logBooking(booking: {
    id: string;
    date: string;
    fullName: string;
    email: string;
    phone: string;
    packageName: string;
    numberOfGuests: number;
    tableNumber: number | null;
    amount: number;
    paymentMethod: string;
    paymentStatus: string;
  }) {
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Bookings!A:K',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [
            [
              booking.date,
              booking.id,
              booking.fullName,
              booking.email,
              booking.phone,
              booking.packageName,
              booking.numberOfGuests,
              booking.tableNumber || 'Unassigned',
              booking.amount,
              booking.paymentMethod,
              booking.paymentStatus,
            ],
          ],
        },
      });
    } catch (error) {
      console.error('Error logging booking to Google Sheets:', error);
      throw error;
    }
  }

  async logOrder(order: {
    id: string;
    date: string;
    customerName: string;
    tableNumberOrName: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
  }) {
    try {
      const itemsDetails = order.items
        .map((item) => `${item.name} x${item.quantity} (GHS ${item.price})`)
        .join(', ');

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Orders!A:H',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [
            [
              order.date,
              order.id,
              order.customerName,
              order.tableNumberOrName,
              itemsDetails,
              order.totalAmount,
              order.paymentMethod,
              order.paymentStatus,
            ],
          ],
        },
      });
    } catch (error) {
      console.error('Error logging order to Google Sheets:', error);
      throw error;
    }
  }

  async logWaitlist(waitlist: {
    id: string;
    date: string;
    fullName: string;
    email: string;
    phone: string;
    numberOfGuests: number;
    preferredDate: string;
    message: string | null;
  }) {
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Waitlist!A:H',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [
            [
              waitlist.date,
              waitlist.id,
              waitlist.fullName,
              waitlist.email,
              waitlist.phone,
              waitlist.numberOfGuests,
              waitlist.preferredDate,
              waitlist.message || '',
            ],
          ],
        },
      });
    } catch (error) {
      console.error('Error logging waitlist to Google Sheets:', error);
      throw error;
    }
  }

  async logFeedback(feedback: {
    id: string;
    date: string;
    name: string;
    email: string;
    rating: number;
    category: string;
    message: string;
  }) {
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Feedback!A:G',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [
            [
              feedback.date,
              feedback.id,
              feedback.name,
              feedback.email,
              feedback.rating,
              feedback.category,
              feedback.message,
            ],
          ],
        },
      });
    } catch (error) {
      console.error('Error logging feedback to Google Sheets:', error);
      throw error;
    }
  }
}

export const googleSheets = new GoogleSheetsService();