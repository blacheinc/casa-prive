// app/tickets/success/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Ticket } from 'lucide-react';
import Link from 'next/link';

function TicketSuccessContent() {
  const searchParams = useSearchParams();
  const ticketId = searchParams.get('id');
  const ticketCode = searchParams.get('code');
  interface TicketData {
    id: string;
    ticketCode: string;
    tierName: string;
    fullName: string;
    email: string;
    numberOfGuests: number;
    eventDate: string;
    amount: number;
    status: string;
  }

  const [ticket, setTicket] = useState<TicketData | null>(null);

  useEffect(() => {
    if (ticketId) {
      fetch(`/api/tickets/${ticketId}`)
        .then(res => res.json())
        .then(data => setTicket(data.ticket))
        .catch(err => console.error('Error fetching ticket:', err));
    }
  }, [ticketId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-emerald-500/20 rounded-full mb-4">
              <CheckCircle className="w-16 h-16 text-emerald-500" />
            </div>
            <h1 className="text-4xl font-bold text-emerald-400 mb-2">
              Ticket Confirmed!
            </h1>
            <p className="text-xl text-gray-300">
              Thank you for purchasing tickets for Casa Privé × Alora Beach Resort
            </p>
          </div>

          {/* Ticket Details */}
          {ticket && (
            <div className="bg-slate-800 p-8 rounded-lg border border-emerald-700/30 mb-8">
              <h2 className="text-2xl font-bold text-yellow-500 mb-6 flex items-center gap-2">
                <Ticket className="w-6 h-6" />
                Ticket Details
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-700">
                  <span className="text-gray-400">Ticket Code</span>
                  <span className="text-white font-mono">{ticket.ticketCode}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-700">
                  <span className="text-gray-400">Tier</span>
                  <span className="text-emerald-400">{ticket.tierName}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-700">
                  <span className="text-gray-400">Name</span>
                  <span className="text-white">{ticket.fullName}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-700">
                  <span className="text-gray-400">Guests</span>
                  <span className="text-white">{ticket.numberOfGuests}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-700">
                  <span className="text-gray-400">Event Date</span>
                  <span className="text-white">{new Date(ticket.eventDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-700">
                  <span className="text-gray-400">Amount Paid</span>
                  <span className="text-yellow-500 font-bold">GHS {ticket.amount}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-400">Status</span>
                  <span className="text-emerald-400 font-bold">{ticket.status}</span>
                </div>
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="bg-slate-800 p-6 rounded-lg border border-yellow-700/30 mb-8">
            <h3 className="text-lg font-bold text-yellow-500 mb-4">
              What&apos;s Next?
            </h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">✓</span>
                <span>A confirmation email has been sent to {ticket?.email || 'your email'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">✓</span>
                <span>Present your ticket code <strong>{ticketCode || ticket?.ticketCode}</strong> at the entrance to Alora Beach Resort</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">✓</span>
                <span>Arrive 15 minutes before the event starts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">✓</span>
                <span>Remember: Dress to Impress — Elegant attire required</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition text-center text-sm font-light"
            >
              BACK TO HOME
            </Link>
            <Link
              href="/menu"
              className="px-6 py-3 border border-emerald-600 text-emerald-400 rounded-lg hover:bg-emerald-600 hover:text-white transition text-center text-sm font-light"
            >
              VIEW DRINKS MENU
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TicketSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
      </div>
    }>
      <TicketSuccessContent />
    </Suspense>
  );
}
