// app/payment/callback/page.tsx
import { Suspense } from 'react';
import PaymentCallbackContent from './PaymentCallbackContent';
import { Loader2 } from 'lucide-react';

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-slate-800/50 border border-emerald-700/30 rounded-lg p-8 text-center">
          <div className="mb-6 flex justify-center">
            <Loader2 className="w-16 h-16 text-yellow-500 animate-spin" />
          </div>
          <h1 className="text-2xl font-light mb-4 text-yellow-500">
            Loading...
          </h1>
          <p className="text-gray-300 font-light text-sm">
            Please wait while we process your payment
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentCallbackContent />
    </Suspense>
  );
}