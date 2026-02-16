/* eslint-disable @typescript-eslint/no-explicit-any */
// app/feedback/page.tsx - Casa Privé x Alora Beach Resort
'use client';

import { useState } from 'react';
import { MessageSquare, Star } from 'lucide-react';

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    category: 'GENERAL',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback');
      }

      setMessage('Thank you for your feedback! We truly appreciate your input.');
      setFormData({
        name: '',
        email: '',
        rating: 5,
        category: 'GENERAL',
        message: '',
      });
    } catch (error: any) {
      setMessage(error.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 py-32">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-12">
          <MessageSquare className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-light mb-4 text-white">
            Share Your Feedback
          </h1>
          <p className="text-gray-300 font-light text-sm">
            Your opinion matters. Help us create even better experiences at Casa Privé × Alora Beach Resort.
          </p>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto mt-6" />
        </div>

        <div className="bg-slate-800/50 border border-emerald-700/30 p-8 rounded">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-light">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              <label className="block text-gray-300 mb-2 text-sm font-light">Rating *</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="transition transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={star <= formData.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm font-light">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
              >
                <option value="GENERAL">General Feedback</option>
                <option value="SERVICE">Service Quality</option>
                <option value="FOOD">Food & Beverages</option>
                <option value="AMBIANCE">Ambiance & Atmosphere</option>
                <option value="EVENT">Event Experience</option>
                <option value="MEMBERSHIP">Membership</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm font-light">Your Feedback *</label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                placeholder="Share your experience at Casa Privé × Alora Beach Resort..."
              />
            </div>

            {message && (
              <div className={`p-4 rounded text-sm ${message.includes('Thank you') ? 'bg-emerald-900/50 text-emerald-300' : 'bg-red-900/50 text-red-300'}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-light tracking-wider rounded hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 transition"
            >
              {loading ? 'SUBMITTING...' : 'SUBMIT FEEDBACK'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
