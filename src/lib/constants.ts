// lib/constants.ts
export const PAYMENT_METHODS = {
  PAYSTACK: 'Paystack',
  BANK_TRANSFER: 'Bank Transfer',
  CASH: 'Cash',
} as const;

export const BOOKING_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
} as const;

export const ORDER_STATUS = {
  PENDING: 'Pending',
  PREPARING: 'Preparing',
  READY: 'Ready',
  SERVED: 'Served',
  CANCELLED: 'Cancelled',
} as const;

export const MENU_CATEGORIES = {
  CHAMPAGNE: 'Champagne',
  COCKTAIL: 'Cocktail',
  COGNAC: 'Cognac',
  TEQUILA: 'Tequila',
} as const;

export const FEEDBACK_CATEGORIES = {
  GENERAL: 'General Feedback',
  SERVICE: 'Service Quality',
  FOOD: 'Food & Beverages',
  AMBIANCE: 'Ambiance & Atmosphere',
  EVENT: 'Event Experience',
  MEMBERSHIP: 'Membership',
} as const;