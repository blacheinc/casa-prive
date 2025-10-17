// app/payment/failed/page.tsx
import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block p-4 bg-red-500/20 rounded-full mb-4">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold text-red-400 mb-4">
            Payment Failed
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            We couldn&apos;t process your payment. Please try again.
          </p>

          <div className="bg-slate-800 p-8 rounded-lg border border-red-700/30 mb-8">
            <h3 className="text-lg font-bold text-white mb-4">What went wrong?</h3>
            <ul className="text-left space-y-2 text-gray-300 text-sm mb-6">
              <li>• Payment was cancelled</li>
              <li>• Insufficient funds</li>
              <li>• Network error during transaction</li>
              <li>• Invalid card details</li>
            </ul>
            <p className="text-gray-400 text-sm">
              If you believe this is an error, please contact our support team.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg font-semibold hover:from-emerald-500 hover:to-emerald-400 transition"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}