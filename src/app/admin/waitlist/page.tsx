// app/admin/waitlist/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Clock, Mail, Phone } from 'lucide-react';

interface Waitlist {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  numberOfGuests: number;
  preferredDate: string;
  message: string | null;
  status: string;
  createdAt: string;
}

export default function AdminWaitlist() {
  const [waitlist, setWaitlist] = useState<Waitlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const fetchWaitlist = async () => {
    try {
      const response = await fetch('/api/waitlist');
      const data = await response.json();
      setWaitlist(data.waitlist);
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
      <h1 className="text-3xl font-bold text-white mb-8">Waitlist Management</h1>

      <div className="grid gap-6">
        {waitlist.map((item) => (
          <div key={item.id} className="bg-slate-800 rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{item.fullName}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail size={14} />
                    {item.email}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Phone size={14} />
                    {item.phone}
                  </div>
                  <div className="text-emerald-400">
                    {item.numberOfGuests} guests • {new Date(item.preferredDate).toLocaleDateString()}
                  </div>
                </div>
                {item.message && (
                  <p className="mt-3 text-gray-400 text-sm italic">&quot;{item.message}&quot;</p>
                )}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                item.status === 'PENDING' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-emerald-900/50 text-emerald-400'
              }`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {waitlist.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No waitlist entries</p>
        </div>
      )}
    </div>
  );
}