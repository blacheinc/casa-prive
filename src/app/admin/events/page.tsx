/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/events/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { CalendarDays, Plus, Pencil, Trash2, Upload, X, Image as ImageIcon, ToggleLeft, ToggleRight, Ticket } from 'lucide-react';

interface EventTier {
  id?: string;
  name: string;
  description: string;
  price: number;
  capacity: number | null;
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
  isActive: boolean;
  isSalesOpen: boolean;
  totalTickets: number;
  soldTickets: number;
  tiers: (EventTier & { id: string })[];
  createdAt: string;
}

const emptyTier = (): EventTier => ({
  name: '',
  description: '',
  price: 0,
  capacity: null,
  features: [''],
  isActive: true,
});

const emptyForm = () => ({
  name: '',
  description: '',
  date: '',
  venue: '',
  isActive: true,
  isSalesOpen: true,
  totalTickets: 200,
  fliers: [] as string[],
  tiers: [emptyTier()],
});

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [uploadingFlier, setUploadingFlier] = useState(false);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data.events || []);
    } catch {
      console.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingEvent(null);
    setForm(emptyForm());
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (event: EventData) => {
    setEditingEvent(event);
    setForm({
      name: event.name,
      description: event.description || '',
      date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
      venue: event.venue || '',
      isActive: event.isActive,
      isSalesOpen: event.isSalesOpen,
      totalTickets: event.totalTickets,
      fliers: event.fliers || [],
      tiers: event.tiers.length > 0
        ? event.tiers.map(t => ({
            id: t.id,
            name: t.name,
            description: t.description || '',
            price: t.price,
            capacity: t.capacity,
            features: t.features.length > 0 ? t.features : [''],
            isActive: t.isActive,
          }))
        : [emptyTier()],
    });
    setFormError('');
    setShowModal(true);
  };

  const handleUploadFlier = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFlier(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setForm(f => ({ ...f, fliers: [...f.fliers, data.url] }));
    } catch (err: any) {
      setFormError(err.message || 'Failed to upload flier');
    } finally {
      setUploadingFlier(false);
      // Reset input
      e.target.value = '';
    }
  };

  const removeFlier = (idx: number) => {
    setForm(f => ({ ...f, fliers: f.fliers.filter((_, i) => i !== idx) }));
  };

  // Tier helpers
  const updateTier = (idx: number, field: keyof EventTier, value: any) => {
    setForm(f => {
      const tiers = [...f.tiers];
      tiers[idx] = { ...tiers[idx], [field]: value };
      return { ...f, tiers };
    });
  };

  const addTier = () => setForm(f => ({ ...f, tiers: [...f.tiers, emptyTier()] }));

  const removeTier = (idx: number) => {
    setForm(f => ({ ...f, tiers: f.tiers.filter((_, i) => i !== idx) }));
  };

  const updateTierFeature = (tierIdx: number, featIdx: number, value: string) => {
    setForm(f => {
      const tiers = [...f.tiers];
      const features = [...tiers[tierIdx].features];
      features[featIdx] = value;
      tiers[tierIdx] = { ...tiers[tierIdx], features };
      return { ...f, tiers };
    });
  };

  const addTierFeature = (tierIdx: number) => {
    setForm(f => {
      const tiers = [...f.tiers];
      tiers[tierIdx] = { ...tiers[tierIdx], features: [...tiers[tierIdx].features, ''] };
      return { ...f, tiers };
    });
  };

  const removeTierFeature = (tierIdx: number, featIdx: number) => {
    setForm(f => {
      const tiers = [...f.tiers];
      tiers[tierIdx] = { ...tiers[tierIdx], features: tiers[tierIdx].features.filter((_, i) => i !== featIdx) };
      return { ...f, tiers };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.name || !form.date) {
      setFormError('Name and date are required');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        tiers: form.tiers.filter(t => t.name.trim()).map(t => ({
          ...t,
          features: t.features.filter(f => f.trim()),
        })),
      };
      const url = editingEvent ? `/api/events/${editingEvent.id}` : '/api/events';
      const method = editingEvent ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save event');
      await fetchEvents();
      setShowModal(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event? Tickets linked to it will lose their event reference.')) return;
    try {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
      await fetchEvents();
    } catch {
      alert('Failed to delete event');
    }
  };

  const toggleField = async (event: EventData, field: 'isActive' | 'isSalesOpen') => {
    try {
      await fetch(`/api/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !event[field] }),
      });
      await fetchEvents();
    } catch {
      alert('Failed to update event');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-emerald-400" />
            Events
          </h1>
          <p className="text-gray-400 text-sm mt-1">Create and manage events with ticket tiers and fliers</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-500 transition"
        >
          <Plus size={16} /> New Event
        </button>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No events yet. Create your first event.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map(event => (
            <div key={event.id} className="bg-slate-800 rounded-lg border border-emerald-700/30 overflow-hidden">
              {/* Flier preview */}
              {event.fliers.length > 0 ? (
                <div className="relative h-48 bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={event.fliers[0]} alt={event.name} className="w-full h-full object-cover" />
                  {event.fliers.length > 1 && (
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      +{event.fliers.length - 1} more
                    </span>
                  )}
                </div>
              ) : (
                <div className="h-32 bg-slate-900 flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-slate-700" />
                </div>
              )}

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-semibold text-lg leading-tight">{event.name}</h3>
                  <div className="flex gap-1 ml-2 shrink-0">
                    <button onClick={() => openEdit(event)} className="p-1.5 text-gray-400 hover:text-emerald-400 hover:bg-slate-700 rounded transition">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(event.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-slate-700 rounded transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p className="text-gray-400 text-xs mb-3">
                  {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  {event.venue && ` · ${event.venue}`}
                </p>

                {event.description && (
                  <p className="text-gray-500 text-xs mb-3 line-clamp-2">{event.description}</p>
                )}

                {/* Tiers summary */}
                {event.tiers.length > 0 && (
                  <div className="mb-3 space-y-1">
                    {event.tiers.map(tier => (
                      <div key={tier.id} className="flex justify-between text-xs">
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Ticket size={11} /> {tier.name}
                        </span>
                        <span className="text-yellow-500 font-medium">GHS {tier.price}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Stats row */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{event.soldTickets} / {event.totalTickets} sold</span>
                  <span className="h-1.5 w-24 bg-slate-700 rounded-full overflow-hidden">
                    <span
                      className="block h-full bg-emerald-500 rounded-full"
                      style={{ width: `${Math.min(100, (event.soldTickets / event.totalTickets) * 100)}%` }}
                    />
                  </span>
                </div>

                {/* Toggles */}
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleField(event, 'isActive')}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition ${event.isActive ? 'bg-emerald-900/40 text-emerald-400' : 'bg-slate-700 text-gray-500'}`}
                  >
                    {event.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                    {event.isActive ? 'Active' : 'Hidden'}
                  </button>
                  <button
                    onClick={() => toggleField(event, 'isSalesOpen')}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition ${event.isSalesOpen ? 'bg-yellow-900/40 text-yellow-400' : 'bg-slate-700 text-gray-500'}`}
                  >
                    {event.isSalesOpen ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                    {event.isSalesOpen ? 'Sales Open' : 'Sales Closed'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-emerald-700/30 rounded-lg w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-emerald-700/30">
              <h2 className="text-white font-semibold text-lg">
                {editingEvent ? 'Edit Event' : 'New Event'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-emerald-400 text-sm font-medium uppercase tracking-wider">Event Details</h3>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Event Name *</label>
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. Casa Privé × Alora — February Edition"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Date & Time *</label>
                    <input
                      type="datetime-local"
                      required
                      value={form.date}
                      onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-800 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Venue</label>
                    <input
                      value={form.venue}
                      onChange={e => setForm(f => ({ ...f, venue: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-800 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                      placeholder="e.g. Alora Beach Resort"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none resize-none"
                    placeholder="Event description..."
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Total Ticket Capacity</label>
                  <input
                    type="number"
                    min="1"
                    value={form.totalTickets}
                    onChange={e => setForm(f => ({ ...f, totalTickets: parseInt(e.target.value) || 200 }))}
                    className="w-full px-3 py-2 bg-slate-800 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                      className="accent-emerald-500"
                    />
                    <span className="text-gray-300 text-sm">Event is active (visible to public)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isSalesOpen}
                      onChange={e => setForm(f => ({ ...f, isSalesOpen: e.target.checked }))}
                      className="accent-yellow-500"
                    />
                    <span className="text-gray-300 text-sm">Ticket sales open</span>
                  </label>
                </div>
              </div>

              {/* Fliers */}
              <div className="space-y-3">
                <h3 className="text-emerald-400 text-sm font-medium uppercase tracking-wider">Event Fliers</h3>
                <div className="grid grid-cols-3 gap-3">
                  {form.fliers.map((url, idx) => (
                    <div key={idx} className="relative group rounded overflow-hidden bg-slate-800 aspect-[9/16]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeFlier(idx)}
                        className="absolute top-1 right-1 bg-red-600/90 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className={`flex flex-col items-center justify-center border-2 border-dashed border-slate-600 rounded aspect-[9/16] cursor-pointer hover:border-emerald-500 transition ${uploadingFlier ? 'opacity-50 pointer-events-none' : ''}`}>
                    {uploadingFlier ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-400 border-t-transparent" />
                    ) : (
                      <>
                        <Upload size={20} className="text-gray-500 mb-1" />
                        <span className="text-gray-500 text-xs">Upload flier</span>
                      </>
                    )}
                    <input type="file" accept="image/jpeg,image/png,image/jpg" className="hidden" onChange={handleUploadFlier} disabled={uploadingFlier} />
                  </label>
                </div>
                <p className="text-gray-500 text-xs">Upload one or more event fliers (JPG, PNG — Max 5MB each)</p>
              </div>

              {/* Ticket Tiers */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-emerald-400 text-sm font-medium uppercase tracking-wider">Ticket Tiers</h3>
                  <button type="button" onClick={addTier} className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition">
                    <Plus size={14} /> Add Tier
                  </button>
                </div>
                {form.tiers.map((tier, idx) => (
                  <div key={idx} className="bg-slate-800 border border-slate-700 rounded p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm font-medium">Tier {idx + 1}</span>
                      {form.tiers.length > 1 && (
                        <button type="button" onClick={() => removeTier(idx)} className="text-red-400 hover:text-red-300 transition">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-400 text-xs mb-1">Tier Name *</label>
                        <input
                          value={tier.name}
                          onChange={e => updateTier(idx, 'name', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                          placeholder="e.g. General Admission"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-xs mb-1">Price (GHS) *</label>
                        <input
                          type="number"
                          min="0"
                          value={tier.price}
                          onChange={e => updateTier(idx, 'price', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-400 text-xs mb-1">Capacity (leave blank for unlimited)</label>
                        <input
                          type="number"
                          min="0"
                          value={tier.capacity ?? ''}
                          onChange={e => updateTier(idx, 'capacity', e.target.value ? parseInt(e.target.value) : null)}
                          className="w-full px-3 py-2 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                          placeholder="Unlimited"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-xs mb-1">Description</label>
                        <input
                          value={tier.description}
                          onChange={e => updateTier(idx, 'description', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                          placeholder="Short description"
                        />
                      </div>
                    </div>
                    {/* Features */}
                    <div>
                      <label className="block text-gray-400 text-xs mb-2">Features / Inclusions</label>
                      <div className="space-y-2">
                        {tier.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex gap-2">
                            <input
                              value={feat}
                              onChange={e => updateTierFeature(idx, fIdx, e.target.value)}
                              className="flex-1 px-3 py-1.5 bg-slate-700 text-white text-xs rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                              placeholder="e.g. Event entry"
                            />
                            <button
                              type="button"
                              onClick={() => removeTierFeature(idx, fIdx)}
                              className="text-gray-500 hover:text-red-400 transition"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addTierFeature(idx)}
                          className="text-xs text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1"
                        >
                          <Plus size={12} /> Add feature
                        </button>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tier.isActive}
                        onChange={e => updateTier(idx, 'isActive', e.target.checked)}
                        className="accent-emerald-500"
                      />
                      <span className="text-gray-300 text-xs">Tier is active</span>
                    </label>
                  </div>
                ))}
              </div>

              {formError && (
                <div className="bg-red-900/30 border border-red-500/30 text-red-300 text-sm rounded p-3">
                  {formError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-500 disabled:opacity-50 transition"
                >
                  {submitting ? 'Saving...' : editingEvent ? 'Save Changes' : 'Create Event'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 border border-slate-600 text-gray-400 text-sm rounded hover:text-white hover:border-slate-500 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
