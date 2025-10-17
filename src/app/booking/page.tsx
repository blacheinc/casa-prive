/* eslint-disable @typescript-eslint/no-explicit-any */
// app/booking/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Calendar, Users, CreditCard, Upload } from 'lucide-react';

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
  const [message, setMessage] = useState('');
  const [tablesAvailable, setTablesAvailable] = useState(true);

  useEffect(() => {
    // In production, fetch from API
    setPackages([
      {
        id: '1',
        name: 'Classic Elegance',
        description: 'Perfect for intimate gatherings',
        price: 500,
        features: [
          'Premium table placement',
          'Complimentary welcome drinks',
          'Dedicated server',
          'Up to 6 guests',
        ],
        maxGuests: 6,
      },
      {
        id: '2',
        name: 'VIP Experience',
        description: 'For those who desire the best',
        price: 1000,
        features: [
          'Prime location seating',
          'Champagne on arrival',
          'Personal concierge',
          'Up to 6 guests',
          'Exclusive menu access',
        ],
        maxGuests: 6,
      },
      {
        id: '3',
        name: 'Platinum Reserve',
        description: 'The ultimate luxury experience',
        price: 2000,
        features: [
          'VIP lounge access',
          'Premium champagne',
          'Dedicated host',
          'Up to 6 guests',
          'Complimentary appetizer platter',
          'Priority valet parking',
        ],
        maxGuests: 6,
      },
    ]);

    // Check table availability
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    // In production, fetch from API
    setTablesAvailable(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let proofUrl = '';
      
      // If bank transfer and proof uploaded, handle file upload
      if (formData.paymentMethod === 'BANK_TRANSFER' && proofFile) {
        // In production, upload to cloud storage
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
        // Redirect to Paystack
        window.location.href = data.paymentUrl;
      } else {
        setMessage('Booking submitted successfully! We will confirm once payment is verified.');
      }
    } catch (error: any) {
      setMessage(error.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (!tablesAvailable) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-slate-800 p-8 rounded-lg text-center">
            <h1 className="text-3xl font-bold text-yellow-500 mb-4">All Tables Booked</h1>
            <p className="text-gray-300 mb-6">
              We&apos;re currently fully booked for this Saturday. Join our waitlist to be notified when a table becomes available.
            </p>
            <a
              href="/waitlist"
              className="inline-block px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition"
            >
              Join Waitlist
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-emerald-400 to-yellow-500 bg-clip-text text-transparent">
            Reserve Your Table
          </h1>
          <p className="text-center text-gray-300 mb-12">
            Experience an unforgettable evening at Casa Privé
          </p>

          {/* Packages */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`bg-slate-800 p-6 rounded-lg border-2 cursor-pointer transition-all transform hover:scale-105 ${
                  selectedPackage === pkg.id
                    ? 'border-yellow-500 shadow-lg shadow-yellow-500/20'
                    : 'border-emerald-700/30 hover:border-emerald-500/50'
                }`}
              >
                <h3 className="text-2xl font-bold text-emerald-400 mb-2">{pkg.name}</h3>
                <p className="text-gray-400 mb-4">{pkg.description}</p>
                <div className="text-3xl font-bold text-yellow-500 mb-4">
                  GHS {pkg.price}
                </div>
                <ul className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="text-gray-300 flex items-start">
                      <span className="text-emerald-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Booking Form */}
          <div className="bg-slate-800 p-8 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Number of Guests (Max 6) *</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    required
                    value={formData.numberOfGuests}
                    onChange={(e) => setFormData({ ...formData, numberOfGuests: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Payment Method *</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="PAYSTACK">Pay Online (Paystack)</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                </div>
              </div>

              {formData.paymentMethod === 'BANK_TRANSFER' && (
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className="text-yellow-500 font-bold mb-2">Bank Transfer Details:</h4>
                  <p className="text-gray-300 mb-1">Bank: ABC Bank</p>
                  <p className="text-gray-300 mb-1">Account Name: Casa Privé Ltd</p>
                  <p className="text-gray-300 mb-4">Account Number: 1234567890</p>
                  
                  <label className="block text-gray-300 mb-2">Upload Proof of Payment</label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600"
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-300 mb-2">Special Requests</label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                  placeholder="Any dietary restrictions, celebrations, or special arrangements?"
                />
              </div>

              {message && (
                <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-emerald-900/50 text-emerald-300' : 'bg-red-900/50 text-red-300'}`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !selectedPackage}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg font-semibold hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105"
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}