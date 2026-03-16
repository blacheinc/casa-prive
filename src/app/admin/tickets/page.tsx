/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/tickets/page.tsx - Ticket Management
'use client';

import { useState, useEffect } from 'react';
import { Ticket, Search, Eye, CheckCircle, XCircle, Trash2, Plus, Pencil, Download } from 'lucide-react';

interface TicketData {
  id: string;
  tierName: string;
  fullName: string;
  email: string;
  phone: string;
  numberOfGuests: number;
  eventDate: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentReference: string | null;
  proofOfPayment: string | null;
  amount: number;
  status: string;
  ticketCode: string;
  createdAt: string;
}

interface TicketFormData {
  tierName: string;
  fullName: string;
  email: string;
  phone: string;
  numberOfGuests: number;
  eventDate: string;
  paymentMethod: string;
  amount: number;
  status: string;
  paymentStatus: string;
}

const TICKET_TIERS = [
  { name: 'General Admission', price: 200 },
  { name: 'VIP', price: 500 },
  { name: 'VVIP', price: 1000 },
];

const PAYMENT_METHODS = ['CASH', 'BANK_TRANSFER', 'PAYSTACK', 'POS'];
const TICKET_STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED', 'USED'];
const PAYMENT_STATUSES = ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'];

const defaultFormData: TicketFormData = {
  tierName: 'General Admission',
  fullName: '',
  email: '',
  phone: '',
  numberOfGuests: 1,
  eventDate: '',
  paymentMethod: 'CASH',
  amount: 200,
  status: 'CONFIRMED',
  paymentStatus: 'COMPLETED',
};

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketData | null>(null);
  const [formData, setFormData] = useState<TicketFormData>(defaultFormData);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tickets');
      const data = await response.json();
      if (response.ok) {
        setTickets(data.tickets || []);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchTickets();
        setSelectedTicket(null);
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  const updatePaymentStatus = async (ticketId: string, paymentStatus: string) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus, status: paymentStatus === 'COMPLETED' ? 'CONFIRMED' : undefined }),
      });

      if (response.ok) {
        fetchTickets();
        setSelectedTicket(null);
      }
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const deleteTicket = async (ticketId: string) => {
    if (!confirm('Are you sure you want to delete this ticket?')) return;

    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTickets();
        setSelectedTicket(null);
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  const openAddModal = () => {
    setFormData(defaultFormData);
    setFormError('');
    setShowAddModal(true);
  };

  const openEditModal = (ticket: TicketData) => {
    setFormData({
      tierName: ticket.tierName,
      fullName: ticket.fullName,
      email: ticket.email,
      phone: ticket.phone,
      numberOfGuests: ticket.numberOfGuests,
      eventDate: ticket.eventDate.split('T')[0],
      paymentMethod: ticket.paymentMethod,
      amount: ticket.amount,
      status: ticket.status,
      paymentStatus: ticket.paymentStatus,
    });
    setFormError('');
    setEditingTicket(ticket);
  };

  const closeFormModal = () => {
    setShowAddModal(false);
    setEditingTicket(null);
    setFormData(defaultFormData);
    setFormError('');
  };

  const handleTierChange = (tierName: string) => {
    const tier = TICKET_TIERS.find(t => t.name === tierName);
    const price = tier ? tier.price : formData.amount;
    setFormData(prev => ({
      ...prev,
      tierName,
      amount: price * prev.numberOfGuests,
    }));
  };

  const handleGuestsChange = (numberOfGuests: number) => {
    const tier = TICKET_TIERS.find(t => t.name === formData.tierName);
    const pricePerGuest = tier ? tier.price : formData.amount / (formData.numberOfGuests || 1);
    setFormData(prev => ({
      ...prev,
      numberOfGuests,
      amount: pricePerGuest * numberOfGuests,
    }));
  };

  const handleSubmitAdd = async () => {
    setFormError('');

    if (!formData.fullName || !formData.email || !formData.phone || !formData.eventDate) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          adminCreated: true,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setFormError(data.error || 'Failed to create ticket.');
        return;
      }

      closeFormModal();
      fetchTickets();
    } catch (error) {
      console.error('Error creating ticket:', error);
      setFormError('An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!editingTicket) return;
    setFormError('');

    if (!formData.fullName || !formData.email || !formData.phone || !formData.eventDate) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/tickets/${editingTicket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierName: formData.tierName,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          numberOfGuests: formData.numberOfGuests,
          eventDate: new Date(formData.eventDate).toISOString(),
          paymentMethod: formData.paymentMethod,
          amount: formData.amount,
          status: formData.status,
          paymentStatus: formData.paymentStatus,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setFormError(data.error || 'Failed to update ticket.');
        return;
      }

      closeFormModal();
      fetchTickets();
    } catch (error) {
      console.error('Error updating ticket:', error);
      setFormError('An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch =
      ticket.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.phone.includes(searchQuery);

    const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: tickets.length,
    confirmed: tickets.filter(t => t.status === 'CONFIRMED').length,
    pending: tickets.filter(t => t.status === 'PENDING').length,
    revenue: tickets
      .filter(t => t.paymentStatus === 'COMPLETED')
      .reduce((sum, t) => sum + t.amount, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const isFormOpen = showAddModal || !!editingTicket;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Ticket className="w-8 h-8 text-yellow-500" />
            Ticket Management
          </h1>
          <p className="text-gray-400 mt-1">Manage ticket sales for Casa Privé × Alora Beach Resort</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-500 transition flex items-center gap-2"
          >
            <Plus size={16} />
            Add Ticket
          </button>
          <button
            onClick={fetchTickets}
            className="px-4 py-2 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-500 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-4 rounded-lg border border-emerald-700/30">
          <p className="text-gray-400 text-xs">Total Tickets</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-emerald-700/30">
          <p className="text-gray-400 text-xs">Confirmed</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.confirmed}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-yellow-700/30">
          <p className="text-gray-400 text-xs">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-purple-700/30">
          <p className="text-gray-400 text-xs">Revenue</p>
          <p className="text-2xl font-bold text-purple-400">GHS {stats.revenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, phone, or ticket code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 text-white text-sm rounded border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-slate-800 text-white text-sm rounded border border-slate-700 focus:border-emerald-500 focus:outline-none"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="USED">Used</option>
        </select>
      </div>

      {/* Tickets Table */}
      <div className="bg-slate-800 rounded-lg border border-emerald-700/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium">CODE</th>
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium">CUSTOMER</th>
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium">TIER</th>
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium">GUESTS</th>
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium">AMOUNT</th>
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium">PAYMENT</th>
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium">STATUS</th>
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    No tickets found
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="px-4 py-3 text-emerald-400 text-xs font-mono">
                      {ticket.ticketCode.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-white text-sm">{ticket.fullName}</div>
                      <div className="text-gray-400 text-xs">{ticket.email}</div>
                    </td>
                    <td className="px-4 py-3 text-yellow-500 text-sm">{ticket.tierName}</td>
                    <td className="px-4 py-3 text-white text-sm">{ticket.numberOfGuests}</td>
                    <td className="px-4 py-3 text-emerald-400 text-sm">GHS {ticket.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        ticket.paymentStatus === 'COMPLETED'
                          ? 'bg-emerald-900/50 text-emerald-400'
                          : ticket.paymentStatus === 'PENDING'
                          ? 'bg-yellow-900/50 text-yellow-400'
                          : 'bg-red-900/50 text-red-400'
                      }`}>
                        {ticket.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        ticket.status === 'CONFIRMED'
                          ? 'bg-emerald-900/50 text-emerald-400'
                          : ticket.status === 'PENDING'
                          ? 'bg-yellow-900/50 text-yellow-400'
                          : ticket.status === 'USED'
                          ? 'bg-blue-900/50 text-blue-400'
                          : 'bg-red-900/50 text-red-400'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedTicket(ticket)}
                          className="p-1 text-gray-400 hover:text-white transition"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(ticket)}
                          className="p-1 text-gray-400 hover:text-yellow-400 transition"
                          title="Edit ticket"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => updateTicketStatus(ticket.id, 'CONFIRMED')}
                          className="p-1 text-gray-400 hover:text-emerald-400 transition"
                          title="Confirm"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={() => updateTicketStatus(ticket.id, 'CANCELLED')}
                          className="p-1 text-gray-400 hover:text-red-400 transition"
                          title="Cancel"
                        >
                          <XCircle size={16} />
                        </button>
                        <button
                          onClick={() => deleteTicket(ticket.id)}
                          className="p-1 text-gray-400 hover:text-red-400 transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-emerald-700/30 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-yellow-500 flex items-center gap-2">
                <Ticket size={20} />
                Ticket Details
              </h2>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <DetailRow label="Ticket Code" value={selectedTicket.ticketCode} />
              <DetailRow label="Tier" value={selectedTicket.tierName} />
              <DetailRow label="Name" value={selectedTicket.fullName} />
              <DetailRow label="Email" value={selectedTicket.email} />
              <DetailRow label="Phone" value={selectedTicket.phone} />
              <DetailRow label="Guests" value={String(selectedTicket.numberOfGuests)} />
              <DetailRow label="Event Date" value={new Date(selectedTicket.eventDate).toLocaleDateString()} />
              <DetailRow label="Amount" value={`GHS ${selectedTicket.amount}`} />
              <DetailRow label="Payment Method" value={selectedTicket.paymentMethod} />
              <DetailRow label="Payment Status" value={selectedTicket.paymentStatus} />
              <DetailRow label="Ticket Status" value={selectedTicket.status} />
              <DetailRow label="Created" value={new Date(selectedTicket.createdAt).toLocaleString()} />
              {selectedTicket.paymentReference && (
                <DetailRow label="Payment Ref" value={selectedTicket.paymentReference} />
              )}
              {selectedTicket.proofOfPayment && (
                <div className="flex justify-between py-2 border-b border-slate-700">
                  <span className="text-gray-400 text-sm">Proof of Payment</span>
                  <a
                    href={selectedTicket.proofOfPayment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 text-sm hover:underline"
                  >
                    View Proof
                  </a>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => updatePaymentStatus(selectedTicket.id, 'COMPLETED')}
                  className="px-4 py-2 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-500 transition"
                >
                  Confirm Payment
                </button>
                <button
                  onClick={() => updateTicketStatus(selectedTicket.id, 'USED')}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-500 transition"
                >
                  Mark as Used
                </button>
                <button
                  onClick={() => {
                    setSelectedTicket(null);
                    openEditModal(selectedTicket);
                  }}
                  className="px-4 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-500 transition"
                >
                  Edit Ticket
                </button>
                <a
                  href={`/api/tickets/${selectedTicket.id}/download`}
                  download
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 text-gray-200 text-sm rounded hover:bg-slate-600 transition"
                >
                  <Download size={14} /> Download PDF
                </a>
                <button
                  onClick={() => deleteTicket(selectedTicket.id)}
                  className="col-span-2 px-4 py-2 bg-red-900 text-red-300 text-sm rounded hover:bg-red-800 transition"
                >
                  Delete Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Ticket Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-emerald-700/30 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-yellow-500 flex items-center gap-2">
                <Ticket size={20} />
                {editingTicket ? 'Edit Ticket' : 'Add New Ticket'}
              </h2>
              <button
                onClick={closeFormModal}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-300 text-sm">
                {formError}
              </div>
            )}

            <div className="space-y-4">
              {/* Tier */}
              <div>
                <label className="block text-gray-400 text-sm mb-1">Ticket Tier *</label>
                <select
                  value={formData.tierName}
                  onChange={(e) => handleTierChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 text-white text-sm rounded border border-slate-700 focus:border-emerald-500 focus:outline-none"
                >
                  {TICKET_TIERS.map(tier => (
                    <option key={tier.name} value={tier.name}>
                      {tier.name} - GHS {tier.price}/person
                    </option>
                  ))}
                </select>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-gray-400 text-sm mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-900 text-white text-sm rounded border border-slate-700 focus:border-emerald-500 focus:outline-none"
                  placeholder="Enter full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-400 text-sm mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-900 text-white text-sm rounded border border-slate-700 focus:border-emerald-500 focus:outline-none"
                  placeholder="Enter email"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-400 text-sm mb-1">Phone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-900 text-white text-sm rounded border border-slate-700 focus:border-emerald-500 focus:outline-none"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-gray-400 text-sm mb-1">Number of Guests</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.numberOfGuests}
                  onChange={(e) => handleGuestsChange(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-slate-900 text-white text-sm rounded border border-slate-700 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-gray-400 text-sm mb-1">Event Date *</label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-900 text-white text-sm rounded border border-slate-700 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-gray-400 text-sm mb-1">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-900 text-white text-sm rounded border border-slate-700 focus:border-emerald-500 focus:outline-none"
                >
                  {PAYMENT_METHODS.map(method => (
                    <option key={method} value={method}>{method.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-gray-400 text-sm mb-1">Amount (GHS)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 bg-slate-900 text-white text-sm rounded border border-slate-700 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Status row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Ticket Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-900 text-white text-sm rounded border border-slate-700 focus:border-emerald-500 focus:outline-none"
                  >
                    {TICKET_STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Payment Status</label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentStatus: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-900 text-white text-sm rounded border border-slate-700 focus:border-emerald-500 focus:outline-none"
                  >
                    {PAYMENT_STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={editingTicket ? handleSubmitEdit : handleSubmitAdd}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting
                  ? (editingTicket ? 'Updating...' : 'Creating...')
                  : (editingTicket ? 'Update Ticket' : 'Create Ticket')
                }
              </button>
              <button
                onClick={closeFormModal}
                disabled={submitting}
                className="px-4 py-2 bg-slate-700 text-gray-300 text-sm rounded hover:bg-slate-600 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-slate-700">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-white text-sm">{value}</span>
    </div>
  );
}
