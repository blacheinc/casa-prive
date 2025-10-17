// app/admin/feedback/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Star } from 'lucide-react';

interface Feedback {
  id: string;
  name: string;
  email: string;
  rating: number;
  category: string;
  message: string;
  isPublished: boolean;
  createdAt: string;
}

export default function AdminFeedback() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch('/api/feedback');
      const data = await response.json();
      setFeedback(data.feedbacks);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Customer Feedback</h1>

      <div className="grid gap-6">
        {feedback.map((item) => (
          <div key={item.id} className="bg-slate-800 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                <p className="text-gray-400 text-sm">{item.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-slate-700 text-gray-300 rounded text-xs">
                  {item.category}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < item.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-300 mb-4">{item.message}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">
                {new Date(item.createdAt).toLocaleString()}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs ${
                item.isPublished ? 'bg-emerald-900/50 text-emerald-400' : 'bg-gray-700 text-gray-400'
              }`}>
                {item.isPublished ? 'Published' : 'Not Published'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {feedback.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No feedback received</p>
        </div>
      )}
    </div>
  );
}