// app/admin/orders/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Search } from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  tableNumberOrName: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  items: Array<{
    menuItem: { name: string };
    quantity: number;
    price: number;
  }>;
  createdAt: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const url = filter === 'ALL' 
        ? '/api/orders' 
        : `/api/orders?status=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.customerName.toLowerCase().includes(search.toLowerCase()) ||
    order.tableNumberOrName.toLowerCase().includes(search.toLowerCase()) ||
    order.id.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Orders Management</h1>
          <p className="text-gray-400">Track and manage menu orders</p>
        </div>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            {['ALL', 'PENDING', 'PREPARING', 'READY', 'SERVED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
                  filter === status
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid gap-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">{order.customerName}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'SERVED'
                      ? 'bg-emerald-900/50 text-emerald-400'
                      : order.status === 'READY'
                      ? 'bg-blue-900/50 text-blue-400'
                      : order.status === 'PREPARING'
                      ? 'bg-yellow-900/50 text-yellow-400'
                      : 'bg-slate-700 text-gray-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-gray-400 text-sm">
                  Table: {order.tableNumberOrName} • Order ID: {order.id.slice(0, 8)}
                </div>
                <div className="text-gray-500 text-xs mt-1">
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-400">
                  GHS {order.totalAmount.toFixed(2)}
                </div>
                <div className="text-gray-400 text-sm">{order.paymentMethod}</div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-slate-900 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Order Items</h4>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-white">
                      {item.menuItem.name} <span className="text-gray-500">x{item.quantity}</span>
                    </span>
                    <span className="text-emerald-400">GHS {item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {order.status === 'PENDING' && (
                <button
                  onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                  className="flex-1 px-4 py-2 bg-yellow-900/50 text-yellow-400 rounded-lg hover:bg-yellow-900 transition"
                >
                  Start Preparing
                </button>
              )}
              {order.status === 'PREPARING' && (
                <button
                  onClick={() => updateOrderStatus(order.id, 'READY')}
                  className="flex-1 px-4 py-2 bg-blue-900/50 text-blue-400 rounded-lg hover:bg-blue-900 transition"
                >
                  Mark as Ready
                </button>
              )}
              {order.status === 'READY' && (
                <button
                  onClick={() => updateOrderStatus(order.id, 'SERVED')}
                  className="flex-1 px-4 py-2 bg-emerald-900/50 text-emerald-400 rounded-lg hover:bg-emerald-900 transition"
                >
                  Mark as Served
                </button>
              )}
              {order.status !== 'CANCELLED' && order.status !== 'SERVED' && (
                <button
                  onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                  className="px-4 py-2 bg-red-900/50 text-red-400 rounded-lg hover:bg-red-900 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No orders found</p>
        </div>
      )}
    </div>
  );
}