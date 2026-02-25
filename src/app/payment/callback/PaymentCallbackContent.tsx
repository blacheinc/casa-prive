// app/payment/callback/PaymentCallbackContent.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [message, setMessage] = useState('Verifying your payment...');
  const reference = searchParams.get('reference');

  useEffect(() => {
    if (!reference) {
      setStatus('failed');
      setMessage('Payment reference not found');
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
      return;
    }

    // The API route handles the verification and redirect
    // This page provides UI feedback during the process
    verifyPayment(reference);
  }, [reference]);

  const verifyPayment = async (ref: string) => {
    try {
      // Simply redirect to the callback API route
      // The API will handle the database update and redirect to success/failure page
      window.location.href = `/api/payment/callback?reference=${ref}`;
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('failed');
      setMessage('An error occurred during verification');
      setTimeout(() => {
        window.location.href = '/payment/failed';
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-slate-800/50 border border-emerald-700/30 rounded-lg p-8 text-center">
          {/* Status Icon */}
          <div className="mb-6 flex justify-center">
            {status === 'verifying' && (
              <Loader2 className="w-16 h-16 text-yellow-500 animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="w-16 h-16 text-emerald-500" />
            )}
            {status === 'failed' && (
              <XCircle className="w-16 h-16 text-red-500" />
            )}
          </div>

          {/* Status Message */}
          <h1 className={`text-2xl font-light mb-4 ${
            status === 'verifying' ? 'text-yellow-500' :
            status === 'success' ? 'text-emerald-400' :
            'text-red-400'
          }`}>
            {status === 'verifying' && 'Processing Payment'}
            {status === 'success' && 'Payment Successful'}
            {status === 'failed' && 'Payment Failed'}
          </h1>

          <p className="text-gray-300 font-light text-sm mb-6">
            {message}
          </p>

          {/* Reference Number */}
          {reference && (
            <div className="bg-slate-700/50 border border-slate-600 rounded p-4 mb-6">
              <p className="text-gray-400 text-xs font-light mb-1">
                Transaction Reference
              </p>
              <p className="text-white text-sm font-mono break-all">
                {reference}
              </p>
            </div>
          )}

          {/* Loading Animation */}
          {status === 'verifying' && (
            <div className="flex justify-center gap-2 mb-6">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          )}

          {/* Action Buttons */}
          {status === 'failed' && (
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/tickets'}
                className="w-full px-6 py-3 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-500 transition font-light tracking-wider"
              >
                RETURN TO TICKETS
              </button>
              <button
                onClick={() => window.location.href = '/booking'}
                className="w-full px-6 py-3 bg-slate-700 text-white text-sm rounded hover:bg-slate-600 transition font-light tracking-wider"
              >
                RETURN TO BOOKING
              </button>
            </div>
          )}

          {/* Help Text */}
          <p className="text-gray-500 text-xs font-light mt-6">
            Please do not close this window or press the back button.
          </p>
        </div>

        {/* Support Section */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-xs font-light">
            Need help? Contact us at{' '}
            <a 
              href="mailto:support@casapriv.com" 
              className="text-emerald-400 hover:text-emerald-300 underline"
            >
              support@casaprivé.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}