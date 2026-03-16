/* eslint-disable @typescript-eslint/no-explicit-any */
// app/tickets/page.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Ticket, Upload, MapPin, CalendarDays, ChevronLeft, Image as ImageIcon } from 'lucide-react';

// ─── Swipeable portrait flier carousel ────────────────────────────────────────
function EventCard({ event, onSelect }: { event: any; onSelect: () => void }) {
  const [idx, setIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const fliers: string[] = event.fliers || [];
  const total = fliers.length;

  const prev = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIdx(i => (i - 1 + total) % total);
  }, [total]);

  const next = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIdx(i => (i + 1) % total);
  }, [total]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) delta < 0 ? next(e) : prev(e);
    touchStartX.current = null;
  };

  const soldOut = event.soldTickets >= event.totalTickets;

  return (
    <div
      onClick={onSelect}
      className="bg-slate-800/60 border border-emerald-700/30 rounded-lg overflow-hidden cursor-pointer hover:border-emerald-500/60 transition-all"
    >
      {/* Portrait flier area */}
      {total > 0 ? (
        <div
          className="relative w-full overflow-hidden bg-slate-900"
          style={{ aspectRatio: '9/16', maxHeight: '520px' }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Slides */}
          <div
            className="flex h-full transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${idx * 100}%)`, width: `${total * 100}%` }}
          >
            {fliers.map((url, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={i}
                src={url}
                alt={event.name}
                className="h-full object-cover object-center flex-shrink-0"
                style={{ width: `${100 / total}%` }}
              />
            ))}
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent pointer-events-none" />

          {/* Badges */}
          {!event.isSalesOpen && (
            <div className="absolute top-3 right-3 bg-red-600/90 text-white text-xs px-3 py-1 rounded-full">Sales Closed</div>
          )}
          {soldOut && (
            <div className="absolute top-3 right-3 bg-orange-600/90 text-white text-xs px-3 py-1 rounded-full">Sold Out</div>
          )}

          {/* Prev / Next arrows (only when >1 flier) */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition text-xs"
                aria-label="Previous"
              >‹</button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition text-xs"
                aria-label="Next"
              >›</button>
              {/* Dot indicators */}
              <div
                className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5"
                onClick={e => e.stopPropagation()}
              >
                {fliers.map((_, i) => (
                  <button
                    key={i}
                    onClick={e => { e.stopPropagation(); setIdx(i); }}
                    className={`w-1.5 h-1.5 rounded-full transition ${i === idx ? 'bg-white' : 'bg-white/40'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center bg-slate-900" style={{ aspectRatio: '9/16', maxHeight: '520px' }}>
          <ImageIcon className="w-10 h-10 text-slate-700" />
        </div>
      )}

      {/* Info */}
      <div className="p-5">
        <h3 className="text-white text-xl font-light mb-2">{event.name}</h3>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <CalendarDays size={12} className="text-emerald-400" />
            {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          {event.venue && (
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-yellow-500" />
              {event.venue}
            </span>
          )}
          {!soldOut && event.isSalesOpen && (
            <span className="text-yellow-500/80">⚡ Limited tickets left</span>
          )}
        </div>
        {event.description && (
          <p className="text-gray-500 text-xs mb-4 line-clamp-2">{event.description}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {event.tiers.filter((t: any) => t.isActive).map((t: any) => (
              <span key={t.id} className="text-xs bg-emerald-900/40 text-emerald-400 px-2 py-0.5 rounded-full">
                {t.name} · GHS {t.price}
              </span>
            ))}
          </div>
          <span className="text-emerald-400 text-xs font-light">Select →</span>
        </div>
      </div>
    </div>
  );
}

interface EventTier {
  id: string;
  name: string;
  description: string | null;
  price: number;
  capacity: number | null;
  sold: number;
  features: string[];
  isActive: boolean;
}

interface EventData {
  id: string;
  name: string;
  description: string | null;
  date: string;
  venue: string | null;
  fliers: string[];
  isSalesOpen: boolean;
  totalTickets: number;
  soldTickets: number;
  tiers: EventTier[];
}

type Step = 'events' | 'tiers' | 'form';

export default function TicketsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [step, setStep] = useState<Step>('events');
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [selectedTier, setSelectedTier] = useState<EventTier | null>(null);
  const [activeFlierIdx, setActiveFlierIdx] = useState(0);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    numberOfGuests: 1,
    paymentMethod: 'PAYSTACK',
  });
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(data => setEvents((data.events || []).filter((e: EventData) => e.tiers && e.tiers.some(t => t.isActive))))
      .catch(() => {})
      .finally(() => setLoadingEvents(false));
  }, []);

  const totalAmount = selectedTier ? selectedTier.price * formData.numberOfGuests : 0;

  const uploadProof = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to upload file');
    }
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !selectedTier) return;

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
        proofUrl = await uploadProof(proofFile);
        setUploadingProof(false);
        setMessage('Processing your ticket purchase...');
      }

      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierName: selectedTier.name,
          description: selectedTier.description,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          numberOfGuests: formData.numberOfGuests,
          eventDate: selectedEvent.date,
          paymentMethod: formData.paymentMethod,
          proofOfPayment: proofUrl,
          amount: totalAmount,
          eventId: selectedEvent.id,
          tierId: selectedTier.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ticket purchase failed');

      if (data.paymentUrl) {
        setMessage('Redirecting to payment...');
        window.location.href = data.paymentUrl;
      } else {
        window.location.href = `/tickets/success?id=${data.ticket.id}&code=${data.ticket.ticketCode}`;
      }
    } catch (err: any) {
      setMessage(err.message || 'Failed to complete ticket purchase');
      setLoading(false);
      setUploadingProof(false);
    }
  };

  // ─── Step: Events ──────────────────────────────────────────────────────────
  if (step === 'events') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 py-32">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <Ticket className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-light mb-3 text-white">Get Your Tickets</h1>
            <p className="text-yellow-400 font-light text-sm">Select an event below to purchase tickets</p>
          </div>

          {loadingEvents ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No upcoming events with tickets available at the moment.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {events.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onSelect={() => {
                    setSelectedEvent(event);
                    setActiveFlierIdx(0);
                    setStep('tiers');
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Step: Tiers ───────────────────────────────────────────────────────────
  if (step === 'tiers' && selectedEvent) {
    const activeTiers = selectedEvent.tiers.filter(t => t.isActive);
    const remaining = selectedEvent.totalTickets - selectedEvent.soldTickets;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 py-32">
        <div className="max-w-5xl mx-auto px-4">
          <button
            onClick={() => { setStep('events'); setSelectedEvent(null); setSelectedTier(null); }}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition"
          >
            <ChevronLeft size={16} /> Back to events
          </button>

          {/* Event header with flier gallery */}
          <div className="mb-10">
            {selectedEvent.fliers.length > 0 && (
              <div className="relative rounded-lg overflow-hidden mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedEvent.fliers[activeFlierIdx]}
                  alt={selectedEvent.name}
                  className="w-full max-h-96 object-cover"
                />
                {selectedEvent.fliers.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {selectedEvent.fliers.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveFlierIdx(i)}
                        className={`w-2 h-2 rounded-full transition ${i === activeFlierIdx ? 'bg-white' : 'bg-white/40'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            <h1 className="text-3xl font-light text-white mb-2">{selectedEvent.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
              <span className="flex items-center gap-1">
                <CalendarDays size={14} className="text-emerald-400" />
                {new Date(selectedEvent.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                {' '}at{' '}
                {new Date(selectedEvent.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </span>
              {selectedEvent.venue && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-yellow-500" />
                  {selectedEvent.venue}
                </span>
              )}
              <span className="flex items-center gap-1 text-yellow-500/80">
                ⚡ Limited tickets left
              </span>
            </div>
            {selectedEvent.description && (
              <p className="text-gray-400 text-sm font-light">{selectedEvent.description}</p>
            )}
          </div>

          {!selectedEvent.isSalesOpen ? (
            <div className="bg-red-900/30 border border-red-500/30 text-red-300 rounded-lg p-6 text-center">
              <p className="font-medium">Ticket sales for this event are currently closed.</p>
            </div>
          ) : remaining <= 0 ? (
            <div className="bg-orange-900/30 border border-orange-500/30 text-orange-300 rounded-lg p-6 text-center">
              <p className="font-medium">This event is sold out.</p>
            </div>
          ) : (
            <>
              <h2 className="text-white text-xl font-light mb-6">Select your ticket tier</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {activeTiers.map(tier => {
                  const tierRemaining = tier.capacity !== null ? tier.capacity - tier.sold : null;
                  const tierSoldOut = tierRemaining !== null && tierRemaining <= 0;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => {
                        if (!tierSoldOut) {
                          setSelectedTier(tier);
                          setFormData(f => ({ ...f, numberOfGuests: 1 }));
                          setStep('form');
                        }
                      }}
                      className={`relative bg-slate-800/50 p-6 rounded border-2 transition-all ${
                        tierSoldOut
                          ? 'border-slate-700 opacity-50 cursor-not-allowed'
                          : 'border-emerald-700/30 hover:border-yellow-500/60 hover:shadow-lg hover:shadow-yellow-500/10 cursor-pointer transform hover:scale-105'
                      }`}
                    >
                      {tierSoldOut && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-slate-600 text-gray-300 text-xs rounded-full">
                          SOLD OUT
                        </div>
                      )}
                      <h3 className="text-xl font-light text-emerald-400 mb-1">{tier.name}</h3>
                      {tier.description && (
                        <p className="text-gray-400 text-xs mb-4 font-light">{tier.description}</p>
                      )}
                      <div className="text-3xl font-light text-yellow-500 mb-4">
                        GHS {tier.price}
                        <span className="text-sm text-gray-400 ml-1">/ person</span>
                      </div>
                      {tier.features.length > 0 && (
                        <ul className="space-y-1.5 mb-4">
                          {tier.features.map((f, i) => (
                            <li key={i} className="text-gray-300 text-xs flex items-start font-light">
                              <span className="text-emerald-500 mr-2 mt-0.5">✓</span>
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}
                      {!tierSoldOut && (
                        <p className="text-yellow-500/70 text-xs mt-2">⚡ Limited tickets left</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ─── Step: Purchase Form ───────────────────────────────────────────────────
  if (step === 'form' && selectedEvent && selectedTier) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 py-32">
        <div className="max-w-2xl mx-auto px-4">
          <button
            onClick={() => { setStep('tiers'); setSelectedTier(null); setMessage(''); }}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition"
          >
            <ChevronLeft size={16} /> Back to tiers
          </button>

          <div className="bg-slate-800/50 border border-emerald-700/30 p-8 rounded">
            <h2 className="text-2xl font-light text-white mb-1 flex items-center gap-3">
              <Ticket className="w-6 h-6 text-yellow-500" />
              {selectedTier.name} — {selectedEvent.name}
            </h2>
            <p className="text-emerald-400 text-sm mb-1 font-light">
              {new Date(selectedEvent.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              {selectedEvent.venue && ` · ${selectedEvent.venue}`}
            </p>
            <p className="text-emerald-400 text-sm mb-6 font-light">
              GHS {selectedTier.price} × {formData.numberOfGuests} = <span className="text-yellow-500 font-medium">GHS {totalAmount}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-light">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData(f => ({ ...f, fullName: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-light">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-light">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-light">Number of Tickets *</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedTier.capacity !== null ? Math.min(10, selectedTier.capacity - selectedTier.sold) : 10}
                    required
                    value={formData.numberOfGuests}
                    onChange={e => setFormData(f => ({ ...f, numberOfGuests: parseInt(e.target.value) || 1 }))}
                    className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2 text-sm font-light">Payment Method *</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={e => setFormData(f => ({ ...f, paymentMethod: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="PAYSTACK">Pay Online (Paystack)</option>
                    <option value="BANK_TRANSFER">Bank / Momo Transfer</option>
                  </select>
                </div>
              </div>

              {formData.paymentMethod === 'BANK_TRANSFER' && (
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-4">
                  <h4 className="text-yellow-500 font-light text-sm mb-3">Payment Details:</h4>
                  <div className="mb-4">
                    <p className="text-gray-200 text-sm mb-2 font-medium">Option 1: Mobile Money</p>
                    <p className="text-gray-300 text-xs font-light">MTN Mobile Money · Casa Privé LTD · 0541476632</p>
                  </div>
                  <div className="mb-4 pt-3 border-t border-yellow-500/20">
                    <p className="text-gray-200 text-sm mb-2 font-medium">Option 2: Bank Transfer</p>
                    <p className="text-gray-300 text-xs font-light">First Atlantic Bank · Casa Privé Ltd · 2705702751017</p>
                  </div>
                  <label className="block text-gray-300 mb-2 text-sm font-light">
                    Upload Proof of Payment * (JPG, PNG, or PDF — Max 5MB)
                  </label>
                  <input
                    type="file"
                    required
                    accept="image/jpeg,image/png,image/jpg,.pdf"
                    onChange={e => setProofFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-light file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 file:cursor-pointer"
                  />
                  {proofFile && (
                    <div className="mt-2 flex items-center gap-2 text-emerald-400 text-xs">
                      <Upload className="w-4 h-4" />
                      <span>{proofFile.name}</span>
                    </div>
                  )}
                </div>
              )}

              {message && (
                <div className={`p-4 rounded text-sm ${message.includes('success') || message.includes('Uploading') || message.includes('Processing') || message.includes('Redirecting')
                  ? 'bg-emerald-900/50 text-emerald-300'
                  : 'bg-red-900/50 text-red-300'
                }`}>
                  {uploadingProof ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-400 border-t-transparent" />
                      <span>{message}</span>
                    </div>
                  ) : message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || uploadingProof}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-light tracking-wider rounded hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105"
              >
                {uploadingProof ? 'UPLOADING...' : loading ? 'PROCESSING...' : `PAY GHS ${totalAmount} — CONFIRM TICKET PURCHASE`}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
