/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/paystack.ts
export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    reference: string;
    amount: number;
    status: string;
    paid_at: string;
    customer: {
      email: string;
      first_name: string;
      last_name: string;
    };
  };
}

export class PaystackService {
  private secretKey: string;
  private baseUrl = 'https://api.paystack.co';

  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY || '';
  }

  async initializeTransaction(
    email: string,
    amount: number,
    reference: string,
    metadata?: Record<string, any>
  ): Promise<PaystackInitializeResponse> {
    const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // Paystack expects amount in kobo/cents
        reference,
        metadata,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to initialize payment');
    }

    return response.json();
  }

  async verifyTransaction(reference: string): Promise<PaystackVerifyResponse> {
    const response = await fetch(
      `${this.baseUrl}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to verify payment');
    }

    return response.json();
  }
}

export const paystack = new PaystackService();