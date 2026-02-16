/* eslint-disable @typescript-eslint/no-explicit-any */
// app/waitlist/page.tsx - Casa Privé x Alora Beach Resort
'use client';

import { useState } from 'react';
import { Clock, Users, Calendar } from 'lucide-react';

export default function WaitlistPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    numberOfGuests: 1,
    preferredDate: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }

      setMessage('Successfully added to waitlist! We\'ll notify you when tickets become available.');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        numberOfGuests: 1,
        preferredDate: '',
        message: '',
      });
    } catch (error: any) {
      setMessage(error.message || 'Failed to join waitlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 py-32">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-12">
          <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-light mb-4 text-white">
            Join the Waitlist
          </h1>
          <p className="text-gray-300 font-light text-sm">
            Tickets are currently sold out for this month&apos;s event at Alora Beach Resort. Join our waitlist to be notified when tickets become available.
          </p>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto mt-6" />
        </div>

        <div className="bg-slate-800/50 border border-emerald-700/30 p-8 rounded">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-light">Full Name *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm font-light">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm font-light">Phone *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm font-light">Number of Guests (Max 6) *</label>
              <input
                type="number"
                min="1"
                max="6"
                required
                value={formData.numberOfGuests}
                onChange={(e) => setFormData({ ...formData, numberOfGuests: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm font-light">Preferred Event Date *</label>
              <input
                type="date"
                required
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm font-light">Additional Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                placeholder="Any special requests or information we should know?"
              />
            </div>

            {message && (
              <div className={`p-4 rounded text-sm ${message.includes('Success') ? 'bg-emerald-900/50 text-emerald-300' : 'bg-red-900/50 text-red-300'}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-light tracking-wider rounded hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 transition"
            >
              {loading ? 'JOINING WAITLIST...' : 'JOIN WAITLIST'}
            </button>
          </form>
        </div>

        <div className="mt-8 bg-yellow-900/20 border border-yellow-500/30 rounded p-6">
          <h3 className="text-base font-light text-yellow-500 mb-3">What Happens Next?</h3>
          <ul className="space-y-2 text-gray-300 text-xs font-light">
            <li className="flex items-start gap-2">
              <span className="text-yellow-500 mt-1">•</span>
              <span>You&apos;ll receive a confirmation email immediately</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500 mt-1">•</span>
              <span>We&apos;ll notify you via email and phone when tickets become available</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500 mt-1">•</span>
              <span>You&apos;ll have 2 hours to confirm your ticket purchase once notified</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500 mt-1">•</span>
              <span>Waitlist positions are filled on a first-come, first-served basis</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
