/* eslint-disable @typescript-eslint/no-explicit-any */
// app/booking/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Calendar, Crown } from 'lucide-react';

interface TablePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  maxGuests: number;
}

export default function BookingPage() {
  const [packages, setPackages] = useState<TablePackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    numberOfGuests: 1,
    specialRequests: '',
    eventDate: '',
    paymentMethod: 'PAYSTACK',
  });
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingPackages, setFetchingPackages] = useState(true);
  const [message, setMessage] = useState('');
  const [tablesAvailable, setTablesAvailable] = useState(true);

  useEffect(() => {
    fetchTablePackages();
    checkAvailability();
  }, []);

  const fetchTablePackages = async () => {
    try {
      setFetchingPackages(true);
      const response = await fetch('/api/packages?active=true');
      const data = await response.json();

      if (response.ok) {
        setPackages(data.packages || []);
      } else {
        console.error('Failed to fetch table packages:', data.error);
        setMessage('Failed to load booking packages. Please refresh the page.');
      }
    } catch (error) {
      console.error('Error fetching table packages:', error);
      setMessage('Failed to load booking packages. Please refresh the page.');
    } finally {
      setFetchingPackages(false);
    }
  };

  const checkAvailability = async () => {
    setTablesAvailable(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let proofUrl = '';
      
      if (formData.paymentMethod === 'BANK_TRANSFER' && proofFile) {
        proofUrl = 'uploaded-proof-url';
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          packageId: selectedPackage,
          proofOfPayment: proofUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Booking failed');
      }

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        // Redirect to success page (using 'id' param to match your existing page)
        window.location.href = `/booking/success?id=${data.booking.id}`;
      }
    } catch (error: any) {
      setMessage(error.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (!tablesAvailable) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 py-32">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-slate-800/50 border border-yellow-700/30 p-8 rounded-lg text-center">
            <h1 className="text-3xl font-light text-yellow-500 mb-4">All Tables Reserved</h1>
            <p className="text-gray-300 font-light text-sm mb-6">
              We&apos;re currently fully booked. Join our waitlist to be notified when a table becomes available.
            </p>
            <a
              href="/waitlist"
              className="inline-block px-8 py-3 bg-emerald-600 text-white text-sm font-light tracking-wider rounded hover:bg-emerald-500 transition"
            >
              JOIN WAITLIST
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 py-32">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="relative h-80 mb-12 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/40" />
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
            <Crown className="w-12 h-12 text-yellow-500 mb-4" />
            <h1 className="text-4xl md:text-5xl font-light mb-4 text-white">
              Reserve Your Table
            </h1>
            <p className="text-gray-200 font-light text-sm max-w-xl">
              Experience an unforgettable evening at Casa Privé
            </p>
          </div>
        </div>

        {/* Loading State */}
        {fetchingPackages && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
            <p className="text-gray-300 mt-4 font-light">Loading packages...</p>
          </div>
        )}

        {/* Packages */}
        {!fetchingPackages && (
          <>
            {packages.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`bg-slate-800/50 p-6 rounded border-2 cursor-pointer transition-all transform hover:scale-105 ${
                      selectedPackage === pkg.id
                        ? 'border-yellow-500 shadow-lg shadow-yellow-500/20'
                        : 'border-emerald-700/30 hover:border-emerald-500/50'
                    }`}
                  >
                    <h3 className="text-xl font-light text-emerald-400 mb-2">{pkg.name}</h3>
                    <p className="text-gray-400 text-xs mb-4 font-light">{pkg.description}</p>
                    <div className="text-2xl font-light text-yellow-500 mb-4">
                      GHS {pkg.price}
                    </div>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="text-gray-300 text-xs flex items-start font-light">
                          <span className="text-emerald-500 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 font-light">No booking packages available at this time.</p>
              </div>
            )}

            {/* Booking Form */}
            {packages.length > 0 && (
              <div className="bg-slate-800/50 border border-emerald-700/30 p-8 rounded">
                <h2 className="text-2xl font-light text-white mb-6 flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-yellow-500" />
                  Booking Details
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
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
                      <label className="block text-gray-300 mb-2 text-sm font-light">Guests (Max 6) *</label>
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
                      <label className="block text-gray-300 mb-2 text-sm font-light">Event Date *</label>
                      <input
                        type="date"
                        required
                        value={formData.eventDate}
                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2 text-sm font-light">Payment Method *</label>
                      <select
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="PAYSTACK">Pay Online (Paystack)</option>
                        <option value="BANK_TRANSFER">Bank Transfer</option>
                      </select>
                    </div>
                  </div>

                  {formData.paymentMethod === 'BANK_TRANSFER' && (
                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-4">
                      <h4 className="text-yellow-500 font-light text-sm mb-2">Bank Transfer Details:</h4>
                      <p className="text-gray-300 text-xs mb-1 font-light">Bank: ABC Bank</p>
                      <p className="text-gray-300 text-xs mb-1 font-light">Account Name: Casa Privé Ltd</p>
                      <p className="text-gray-300 text-xs mb-4 font-light">Account Number: 1234567890</p>
                      
                      <label className="block text-gray-300 mb-2 text-sm font-light">Upload Proof of Payment</label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                        className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-gray-300 mb-2 text-sm font-light">Special Requests</label>
                    <textarea
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                      placeholder="Dietary restrictions, celebrations, or special arrangements"
                    />
                  </div>

                  {message && (
                    <div className={`p-4 rounded text-sm ${message.includes('success') ? 'bg-emerald-900/50 text-emerald-300' : 'bg-red-900/50 text-red-300'}`}>
                      {message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !selectedPackage}
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-light tracking-wider rounded hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105"
                  >
                    {loading ? 'PROCESSING...' : 'CONFIRM BOOKING'}
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}