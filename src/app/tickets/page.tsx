/* eslint-disable @typescript-eslint/no-explicit-any */
// app/tickets/page.tsx - Casa Privé × Alora Beach Resort Ticket Sales
'use client';

import { useState } from 'react';
import { Ticket, Upload, MapPin } from 'lucide-react';
import Image from 'next/image';

const TICKET_TIERS = [
  {
    id: 'general',
    name: 'Ticket Admission',
    price: 200,
    description: 'Access to the event, general seating area, and cash bar.',
    features: ['Event entry', 'General seating area', 'Cash bar access', 'Live entertainment'],
    popular: true,
  },
  // {
  //   id: 'vip',
  //   name: 'VIP',
  //   price: 500,
  //   description: 'Premium access with reserved seating and complimentary welcome drink.',
  //   features: ['Priority event entry', 'Reserved VIP seating', '1 complimentary cocktail', 'Live entertainment', 'VIP lounge access'],
  //   popular: true,
  // },
  // {
  //   id: 'vvip',
  //   name: 'VVIP',
  //   price: 1000,
  //   description: 'The ultimate experience with premium bottle, dedicated server, and exclusive perks.',
  //   features: ['Express event entry', 'Premium reserved seating', '1 bottle of champagne', 'Dedicated server', 'VIP lounge access', 'Exclusive VVIP area', 'Live entertainment'],
  // },
];

export default function TicketsPage() {
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    numberOfGuests: 1,
    eventDate: '',
    paymentMethod: 'PAYSTACK',
  });
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const selectedTierData = TICKET_TIERS.find(t => t.id === selectedTier);
  const totalAmount = selectedTierData ? selectedTierData.price * formData.numberOfGuests : 0;

  const uploadProofToCloudinary = async (file: File): Promise<string> => {
    const uploadData = new FormData();
    uploadData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: uploadData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload file');
    }

    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTier || !selectedTierData) {
      setMessage('Please select a ticket tier');
      return;
    }

    setLoading(true);
    setMessage('Processing your ticket purchase...');

    try {
      let proofUrl = '';

      if (formData.paymentMethod === 'BANK_TRANSFER') {
        if (!proofFile) {
          setMessage('Please upload proof of payment');
          setLoading(false);
          return;
        }

        setMessage('Uploading proof of payment...');
        setUploadingProof(true);

        try {
          proofUrl = await uploadProofToCloudinary(proofFile);
        } catch (uploadError: any) {
          setMessage(uploadError.message || 'Failed to upload proof of payment');
          setLoading(false);
          setUploadingProof(false);
          return;
        }

        setUploadingProof(false);
        setMessage('Processing your ticket purchase...');
      }

      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierName: selectedTierData.name,
          description: selectedTierData.description,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          numberOfGuests: formData.numberOfGuests,
          eventDate: formData.eventDate,
          paymentMethod: formData.paymentMethod,
          proofOfPayment: proofUrl,
          amount: totalAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ticket purchase failed');
      }

      if (data.paymentUrl) {
        setMessage('Redirecting to payment...');
        window.location.href = data.paymentUrl;
      } else {
        window.location.href = `/tickets/success?id=${data.ticket.id}&code=${data.ticket.ticketCode}`;
      }
    } catch (error: any) {
      setMessage(error.message || 'Failed to complete ticket purchase');
      setLoading(false);
      setUploadingProof(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 py-32">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="relative h-80 mb-12 overflow-hidden">
          <Image
            src="/gallery/1.png"
            alt="Casa Privé × Alora Beach Resort"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/40" />
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
            <Ticket className="w-12 h-12 text-yellow-500 mb-4" />
            <h1 className="text-4xl md:text-5xl font-light mb-4 text-white">
              Get Your Tickets
            </h1>
            <p className="text-yellow-400 font-light text-sm mb-1">Casa Privé × Alora Beach Resort</p>
            <div className="flex items-center gap-2 text-gray-300 text-xs">
              <MapPin size={14} className="text-yellow-500" />
              <span className="font-light">Alora Beach Resort &bull; Monthly Events</span>
            </div>
          </div>
        </div>

        {/* Ticket Tiers */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {TICKET_TIERS.map((tier) => (
            <div
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={`relative bg-slate-800/50 p-6 rounded border-2 cursor-pointer transition-all transform hover:scale-105 ${selectedTier === tier.id
                  ? 'border-yellow-500 shadow-lg shadow-yellow-500/20'
                  : 'border-emerald-700/30 hover:border-emerald-500/50'
                }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-500 text-emerald-900 text-xs font-medium rounded-full">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-xl font-light text-emerald-400 mb-2">{tier.name}</h3>
              <p className="text-gray-400 text-xs mb-4 font-light">{tier.description}</p>
              <div className="text-3xl font-light text-yellow-500 mb-4">
                GHS {tier.price}
                <span className="text-sm text-gray-400 ml-1">/ person</span>
              </div>
              <ul className="space-y-2">
                {tier.features.map((feature, index) => (
                  <li key={index} className="text-gray-300 text-xs flex items-start font-light">
                    <span className="text-emerald-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Purchase Form */}
        {selectedTier && (
          <div className="bg-slate-800/50 border border-emerald-700/30 p-8 rounded">
            <h2 className="text-2xl font-light text-white mb-2 flex items-center gap-3">
              <Ticket className="w-6 h-6 text-yellow-500" />
              {selectedTierData?.name} — Ticket Purchase
            </h2>
            {selectedTierData && (
              <p className="text-emerald-400 text-sm mb-6 font-light">
                GHS {selectedTierData.price} per person × {formData.numberOfGuests} = <span className="text-yellow-500 font-medium">GHS {totalAmount}</span>
              </p>
            )}

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
                  <label className="block text-gray-300 mb-2 text-sm font-light">Number of Tickets *</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formData.numberOfGuests}
                    onChange={(e) => setFormData({ ...formData, numberOfGuests: parseInt(e.target.value) || 1 })}
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
                    <option value="BANK_TRANSFER">Bank / Momo Transfer</option>
                  </select>
                </div>
              </div>

              {/* Payment Details - Bank Transfer */}
              {formData.paymentMethod === 'BANK_TRANSFER' && (
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-4">
                  <h4 className="text-yellow-500 font-light text-sm mb-3">Payment Details:</h4>

                  <div className="mb-4">
                    <p className="text-gray-200 text-sm mb-2 font-medium">Option 1: Mobile Money</p>
                    <p className="text-gray-300 text-xs mb-1 font-light">Network: MTN Mobile Money</p>
                    <p className="text-gray-300 text-xs mb-1 font-light">Account Name: Casa Privé LTD</p>
                    <p className="text-gray-300 text-xs font-light">Number: 0541476632</p>
                  </div>

                  <div className="mb-4 pt-4 border-t border-yellow-500/20">
                    <p className="text-gray-200 text-sm mb-2 font-medium">Option 2: Bank Transfer</p>
                    <p className="text-gray-300 text-xs mb-1 font-light">Bank: First Atlantic Bank</p>
                    <p className="text-gray-300 text-xs mb-1 font-light">Account Name: Casa Privé Ltd</p>
                    <p className="text-gray-300 text-xs font-light">Account Number: 2705702751017</p>
                  </div>

                  <label className="block text-gray-300 mb-2 text-sm font-light">
                    Upload Proof of Payment * (JPG, PNG, or PDF - Max 5MB)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      required
                      accept="image/jpeg,image/png,image/jpg,.pdf"
                      onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                      className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-light file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 file:cursor-pointer"
                    />
                    {proofFile && (
                      <div className="mt-2 flex items-center gap-2 text-emerald-400 text-xs">
                        <Upload className="w-4 h-4" />
                        <span>{proofFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {message && (
                <div className={`p-4 rounded text-sm ${message.includes('success') || message.includes('Uploading') || message.includes('Processing') || message.includes('Redirecting')
                    ? 'bg-emerald-900/50 text-emerald-300'
                    : 'bg-red-900/50 text-red-300'
                  }`}>
                  {uploadingProof && (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-400 border-t-transparent"></div>
                      <span>{message}</span>
                    </div>
                  )}
                  {!uploadingProof && message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !selectedTier || uploadingProof}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-light tracking-wider rounded hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105"
              >
                {uploadingProof ? 'UPLOADING...' : loading ? 'PROCESSING...' : `PAY GHS ${totalAmount} — CONFIRM TICKET PURCHASE`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
