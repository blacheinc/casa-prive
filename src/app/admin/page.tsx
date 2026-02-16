// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { BarChart, Users, Calendar, DollarSign, ShoppingBag, MessageSquare, Clock, Ticket } from 'lucide-react';

interface Stats {
  bookings: {
    total: number;
    confirmed: number;
    pending: number;
  };
  tickets: {
    total: number;
    confirmed: number;
    pending: number;
    revenue: number;
  };
  orders: {
    total: number;
  };
  revenue: {
    total: number;
  };
  members: {
    active: number;
  };
  waitlist: {
    pending: number;
  };
  feedback: {
    total: number;
  };
  tables: {
    total: number;
    booked: number;
    available: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-yellow-500 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-300">Manage Casa Privé × Alora Beach Resort operations</p>
          </div>

          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
              <StatCard
                icon={<Ticket className="w-8 h-8" />}
                title="Tickets"
                value={stats.tickets?.total || 0}
                subtitle={`${stats.tickets?.confirmed || 0} confirmed, ${stats.tickets?.pending || 0} pending`}
                color="yellow"
              />
              <StatCard
                icon={<Calendar className="w-8 h-8" />}
                title="Table Bookings"
                value={stats.bookings.total}
                subtitle={`${stats.bookings.confirmed} confirmed, ${stats.bookings.pending} pending`}
                color="emerald"
              />
              <StatCard
                icon={<ShoppingBag className="w-8 h-8" />}
                title="Orders"
                value={stats.orders.total}
                subtitle="Total orders placed"
                color="blue"
              />
              <StatCard
                icon={<DollarSign className="w-8 h-8" />}
                title="Revenue"
                value={`GHS ${((stats.revenue.total || 0) + (stats.tickets?.revenue || 0)).toLocaleString()}`}
                subtitle="Tables + Tickets"
                color="yellow"
              />
              <StatCard
                icon={<Users className="w-8 h-8" />}
                title="Members"
                value={stats.members.active}
                subtitle="Active memberships"
                color="purple"
              />
            </div>
          )}

          {/* Secondary Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-slate-800 p-6 rounded-lg border border-emerald-700/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Table Availability</h3>
                  <BarChart className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Tables</span>
                    <span className="text-white font-bold">{stats.tables.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Booked</span>
                    <span className="text-red-400 font-bold">{stats.tables.booked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Available</span>
                    <span className="text-emerald-400 font-bold">{stats.tables.available}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 mt-4">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${(stats.tables.booked / stats.tables.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 p-6 rounded-lg border border-yellow-700/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Waitlist</h3>
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-500 mb-2">
                    {stats.waitlist.pending}
                  </div>
                  <p className="text-gray-400">People waiting</p>
                </div>
              </div>

              <div className="bg-slate-800 p-6 rounded-lg border border-purple-700/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Feedback</h3>
                  <MessageSquare className="w-6 h-6 text-purple-500" />
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-500 mb-2">
                    {stats.feedback.total}
                  </div>
                  <p className="text-gray-400">Total reviews</p>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-slate-800 rounded-lg border border-emerald-700/30 overflow-hidden">
            <div className="flex border-b border-slate-700">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 px-6 py-4 font-semibold transition ${
                  activeTab === 'overview'
                    ? 'bg-emerald-900/50 text-emerald-400 border-b-2 border-emerald-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`flex-1 px-6 py-4 font-semibold transition ${
                  activeTab === 'bookings'
                    ? 'bg-emerald-900/50 text-emerald-400 border-b-2 border-emerald-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 px-6 py-4 font-semibold transition ${
                  activeTab === 'orders'
                    ? 'bg-emerald-900/50 text-emerald-400 border-b-2 border-emerald-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Orders
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="text-center py-12">
                  <BarChart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Dashboard Overview</h3>
                  <p className="text-gray-400">
                    Quick access to all Casa Privé operations and statistics
                  </p>
                </div>
              )}

              {activeTab === 'bookings' && (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Booking Management</h3>
                  <p className="text-gray-400 mb-6">
                    View and manage all table bookings
                  </p>
                  <a
                    href="/api/bookings"
                    target="_blank"
                    className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition"
                  >
                    View All Bookings
                  </a>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Order Management</h3>
                  <p className="text-gray-400 mb-6">
                    View and manage all menu orders
                  </p>
                  <a
                    href="/api/orders"
                    target="_blank"
                    className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition"
                  >
                    View All Orders
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="https://dashboard.paystack.com"
              target="_blank"
              className="bg-slate-800 p-6 rounded-lg border border-emerald-700/30 hover:border-emerald-500/50 transition text-center"
            >
              <DollarSign className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
              <h4 className="text-white font-bold mb-1">Paystack Dashboard</h4>
              <p className="text-gray-400 text-sm">Manage payments</p>
            </a>
            <a
              href={`https://docs.google.com/spreadsheets/d/1K4cxRLZJ4UvdEejBJxzQSy-KKNq_vba1LbR1qyLcdkU`}
              target="_blank"
              className="bg-slate-800 p-6 rounded-lg border border-yellow-700/30 hover:border-yellow-500/50 transition text-center"
            >
              <BarChart className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
              <h4 className="text-white font-bold mb-1">Google Sheets</h4>
              <p className="text-gray-400 text-sm">View logs</p>
            </a>
            <button
              onClick={fetchStats}
              className="bg-slate-800 p-6 rounded-lg border border-purple-700/30 hover:border-purple-500/50 transition text-center"
            >
              <Users className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <h4 className="text-white font-bold mb-1">Refresh Data</h4>
              <p className="text-gray-400 text-sm">Update statistics</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
}) {
  const colorClasses = {
    emerald: 'text-emerald-500 border-emerald-700/30',
    blue: 'text-blue-500 border-blue-700/30',
    yellow: 'text-yellow-500 border-yellow-700/30',
    purple: 'text-purple-500 border-purple-700/30',
  }[color];

  return (
    <div className={`bg-slate-800 p-6 rounded-lg border ${colorClasses}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 font-semibold">{title}</h3>
        <div className={colorClasses}>{icon}</div>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  );
}