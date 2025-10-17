// app/order/success/page.tsx - FIXED WITH SUSPENSE
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  customerName: string;
  tableNumberOrName: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  items: Array<{
    menuItem: {
      name: string;
    };
    quantity: number;
    price: number;
  }>;
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();
      setOrder(data.order);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading order details...</p>
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
              Order Received!
            </h1>
            <p className="text-xl text-gray-300">
              Your order is being prepared
            </p>
          </div>

          {/* Order Details */}
          {order && (
            <>
              <div className="bg-slate-800 p-8 rounded-lg border border-emerald-700/30 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <ShoppingBag className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-2xl font-bold text-yellow-500">
                    Order Details
                  </h2>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between py-3 border-b border-slate-700">
                    <span className="text-gray-400">Order ID</span>
                    <span className="text-white font-mono">{order.id}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-700">
                    <span className="text-gray-400">Customer</span>
                    <span className="text-white">{order.customerName}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-700">
                    <span className="text-gray-400">Table</span>
                    <span className="text-white">{order.tableNumberOrName}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-4">Items Ordered</h3>
                <div className="space-y-3 mb-6">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between py-2">
                      <div>
                        <span className="text-white">{item.menuItem.name}</span>
                        <span className="text-gray-400 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="text-emerald-400">
                        GHS {item.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between py-3 border-t border-slate-700">
                  <span className="text-xl font-bold text-white">Total</span>
                  <span className="text-emerald-400 text-2xl font-bold">
                    GHS {order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Status Info */}
              <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-emerald-500 mb-3">
                  Order Status: {order.status}
                </h3>
                <p className="text-gray-300 text-sm">
                  {order.paymentMethod === 'CASH' 
                    ? 'Please pay at your table when the order is served.'
                    : 'Payment confirmed. Your order will be served shortly.'}
                </p>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/menu"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg font-semibold hover:from-emerald-500 hover:to-emerald-400 transition text-center"
            >
              Order More
            </Link>
            <Link
              href="/"
              className="flex-1 px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition text-center"
            >
              Return Home
            </Link>
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
export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrderSuccessContent />
    </Suspense>
  );
}