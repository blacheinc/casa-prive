// app/admin/bookings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Calendar, Search, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Booking {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  numberOfGuests: number;
  tableNumber: number | null;
  eventDate: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  proofOfPayment: string | null;
  package: {
    name: string;
  };
  createdAt: string;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      const url = filter === 'ALL' 
        ? '/api/bookings' 
        : `/api/bookings?status=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setBookings(data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const assignTable = async (id: string, tableNumber: number) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableNumber }),
      });

      if (response.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error('Error assigning table:', error);
    }
  };

  const filteredBookings = bookings.filter(booking =>
    booking.fullName.toLowerCase().includes(search.toLowerCase()) ||
    booking.email.toLowerCase().includes(search.toLowerCase()) ||
    booking.id.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="text-3xl font-bold text-white mb-2">Bookings Management</h1>
          <p className="text-gray-400">Manage table reservations</p>
        </div>
        <button
          onClick={fetchBookings}
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
              placeholder="Search by name, email, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
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

      {/* Bookings Table */}
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Booking Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Event Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Table
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-white font-medium">{booking.fullName}</div>
                      <div className="text-gray-400 text-sm">{booking.email}</div>
                      <div className="text-gray-500 text-xs">{booking.phone}</div>
                      <div className="text-emerald-400 text-xs mt-1">
                        {booking.package.name} • {booking.numberOfGuests} guests
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white">
                      {new Date(booking.eventDate).toLocaleDateString()}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {new Date(booking.eventDate).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {booking.tableNumber ? (
                      <div className="text-emerald-400 font-bold">
                        Table {booking.tableNumber}
                      </div>
                    ) : (
                      <input
                        type="number"
                        min="1"
                        max="20"
                        placeholder="Assign"
                        onBlur={(e) => {
                          const num = parseInt(e.target.value);
                          if (num) assignTable(booking.id, num);
                        }}
                        className="w-20 px-2 py-1 bg-slate-700 text-white rounded border border-slate-600 text-sm"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">
                      GHS {booking.amount.toFixed(2)}
                    </div>
                    <div className="text-gray-400 text-xs">{booking.paymentMethod}</div>
                    <div className={`text-xs mt-1 ${
                      booking.paymentStatus === 'COMPLETED' 
                        ? 'text-emerald-400' 
                        : 'text-yellow-400'
                    }`}>
                      {booking.paymentStatus}
                    </div>
                    {booking.proofOfPayment && (
                      <a
                        href={booking.proofOfPayment}
                        target="_blank"
                        className="text-xs text-blue-400 hover:underline"
                      >
                        View Proof
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      booking.status === 'CONFIRMED'
                        ? 'bg-emerald-900/50 text-emerald-400'
                        : booking.status === 'PENDING'
                        ? 'bg-yellow-900/50 text-yellow-400'
                        : 'bg-red-900/50 text-red-400'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {booking.status === 'PENDING' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                          className="p-2 bg-emerald-900/50 text-emerald-400 rounded hover:bg-emerald-900 transition"
                          title="Confirm"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {booking.status !== 'CANCELLED' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                          className="p-2 bg-red-900/50 text-red-400 rounded hover:bg-red-900 transition"
                          title="Cancel"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No bookings found</p>
        </div>
      )}
    </div>
  );
}