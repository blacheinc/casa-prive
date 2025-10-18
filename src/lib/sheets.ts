// lib/sheets.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || "";

export class GoogleSheetsService {
  private scriptUrl: string;

  constructor() {
    this.scriptUrl = GOOGLE_SCRIPT_URL;

    if (!this.scriptUrl) {
      console.warn(
        "⚠️  GOOGLE_SCRIPT_URL not configured. Google Sheets logging disabled."
      );
    }
  }

  private async logToSheet(data: any): Promise<void> {
    if (!this.scriptUrl) {
      console.log("Google Sheets logging skipped - no URL configured");
      return;
    }

    try {
      // Use no-cors mode and don't wait for response
      fetch(this.scriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).catch((error) => {
        // Silently log errors - don't break the flow
        console.error("Google Sheets logging failed:", error);
      });

      // Immediately resolve - don't wait for the fetch
      console.log("✅ Logged to Google Sheets:", data.type);
    } catch (error) {
      console.error("❌ Google Sheets logging failed:", error);
      // Don't throw - logging failure shouldn't break the main flow
    }
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
    proofOfPayment?: string;
  }) {
    await this.logToSheet({
      type: "booking",
      ...booking,
    });
  }

  async logOrder(order: {
    id: string;
    date: string;
    customerName: string;
    tableNumberOrName: string;
    items?: Array<{ name: string; quantity: number; price: number }>; // Made optional
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    status?: string; // Added optional status field
  }) {
    // Handle items if provided
    const itemsDetails = order.items
      ? order.items
          .map((item) => `${item.name} x${item.quantity} (GHS ${item.price})`)
          .join(", ")
      : "";

    await this.logToSheet({
      type: "order",
      id: order.id,
      date: order.date,
      customerName: order.customerName,
      tableNumberOrName: order.tableNumberOrName,
      itemsDetails,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      status: order.status || "PENDING", // Include status with default
    });
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
    await this.logToSheet({
      type: "waitlist",
      ...waitlist,
    });
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
    await this.logToSheet({
      type: "feedback",
      ...feedback,
    });
  }
}

export const googleSheets = new GoogleSheetsService();
