// app/booking/success/page.tsx - FIXED WITH SUSPENSE
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Calendar, Mail, Download } from 'lucide-react';
import Link from 'next/link';

interface Booking {
  id: string;
  fullName: string;
  email: string;
  eventDate: string;
  tableNumber: number | null;
  numberOfGuests: number;
  amount: number;
  package: {
    name: string;
  };
}

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`);
      const data = await response.json();
      setBooking(data.booking);
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-emerald-500/20 rounded-full mb-4">
              <CheckCircle className="w-16 h-16 text-emerald-500" />
            </div>
            <h1 className="text-4xl font-bold text-emerald-400 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-xl text-gray-300">
              Thank you for choosing Casa Privé
            </p>
          </div>

          {/* Booking Details */}
          {booking && (
            <div className="bg-slate-800 p-8 rounded-lg border border-emerald-700/30 mb-8">
              <h2 className="text-2xl font-bold text-yellow-500 mb-6">
                Booking Details
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-700">
                  <span className="text-gray-400">Booking ID</span>
                  <span className="text-white font-mono">{booking.id}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-700">
                  <span className="text-gray-400">Name</span>
                  <span className="text-white">{booking.fullName}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-700">
                  <span className="text-gray-400">Package</span>
                  <span className="text-white">{booking.package.name}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-700">
                  <span className="text-gray-400">Event Date</span>
                  <span className="text-white">
                    {new Date(booking.eventDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-700">
                  <span className="text-gray-400">Number of Guests</span>
                  <span className="text-white">{booking.numberOfGuests}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-700">
                  <span className="text-gray-400">Table Number</span>
                  <span className="text-white">
                    {booking.tableNumber || 'To be assigned'}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-400">Amount Paid</span>
                  <span className="text-emerald-400 text-xl font-bold">
                    GHS {booking.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Important Information */}
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-yellow-500 mb-3 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              What&apos;s Next?
            </h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">✓</span>
                <span>A confirmation email has been sent to {booking?.email}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">✓</span>
                <span>Present this confirmation or your email at the entrance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">✓</span>
                <span>Arrive 15 minutes before the event starts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">✓</span>
                <span>Remember: Dress to Impress - Elegant attire required</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg font-semibold hover:from-emerald-500 hover:to-emerald-400 transition text-center"
            >
              Return Home
            </Link>
            <Link
              href="/menu"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-400 transition text-center"
            >
              View Menu
            </Link>
          </div>

          {/* Print Button */}
          <div className="mt-4 text-center">
            <button
              onClick={() => window.print()}
              className="text-gray-400 hover:text-emerald-400 transition text-sm flex items-center gap-2 mx-auto"
            >
              <Download size={16} />
              Print Confirmation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <p className="text-gray-300">Loading...</p>
      </div>
    </div>
  );
}

// Main component with Suspense wrapper
export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BookingSuccessContent />
    </Suspense>
  );
}