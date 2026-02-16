// app/admin/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';

interface Settings {
  id: string;
  totalTables: number;
  bookedTables: number;
  totalTickets: number;
  soldTickets: number;
  currentEventDate: string;
  isBookingOpen: boolean;
  isTicketSalesOpen: boolean;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setSettings(data.settings);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setSaving(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage('Settings saved successfully!');
      } else {
        setMessage('Failed to save settings');
      }
    } catch (error) {
      setMessage('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="w-8 h-8 text-emerald-500" />
        <h1 className="text-3xl font-bold text-white">Settings</h1>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 space-y-6">
        {/* Ticket Settings */}
        <div className="border-b border-slate-700 pb-4 mb-4">
          <h3 className="text-lg font-bold text-yellow-500 mb-4">Ticket Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Total Tickets Available</label>
              <input
                type="number"
                min="1"
                value={settings.totalTickets || 200}
                onChange={(e) => setSettings({ ...settings, totalTickets: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
              />
              <p className="text-gray-400 text-sm mt-2">
                Sold: {settings.soldTickets || 0} / Available: {(settings.totalTickets || 200) - (settings.soldTickets || 0)}
              </p>
            </div>
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.isTicketSalesOpen ?? true}
                  onChange={(e) => setSettings({ ...settings, isTicketSalesOpen: e.target.checked })}
                  className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-gray-300 font-medium">Ticket Sales Open</span>
              </label>
              <p className="text-gray-400 text-sm mt-2">
                {(settings.isTicketSalesOpen ?? true)
                  ? 'Customers can purchase tickets'
                  : 'Ticket sales are closed'}
              </p>
            </div>
          </div>
        </div>

        {/* Total Tables */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">Total Tables</label>
          <input
            type="number"
            min="1"
            value={settings.totalTables}
            onChange={(e) => setSettings({ ...settings, totalTables: parseInt(e.target.value) })}
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
          />
          <p className="text-gray-400 text-sm mt-2">
            Currently booked: {settings.bookedTables} / Available: {settings.totalTables - settings.bookedTables}
          </p>
        </div>

        {/* Current Event Date */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">Current Event Date</label>
          <input
            type="datetime-local"
            value={new Date(settings.currentEventDate).toISOString().slice(0, 16)}
            onChange={(e) => setSettings({ ...settings, currentEventDate: new Date(e.target.value).toISOString() })}
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Booking Status */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.isBookingOpen}
              onChange={(e) => setSettings({ ...settings, isBookingOpen: e.target.checked })}
              className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-gray-300 font-medium">Booking Open</span>
          </label>
          <p className="text-gray-400 text-sm mt-2">
            {settings.isBookingOpen 
              ? 'Customers can book tables' 
              : 'Booking is closed, customers will see waitlist'}
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-lg ${
            message.includes('success') ? 'bg-emerald-900/50 text-emerald-300' : 'bg-red-900/50 text-red-300'
          }`}>
            {message}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-500 disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">Table Utilization</div>
          <div className="text-3xl font-bold text-emerald-400">
            {Math.round((settings.bookedTables / settings.totalTables) * 100)}%
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">Status</div>
          <div className={`text-3xl font-bold ${settings.isBookingOpen ? 'text-emerald-400' : 'text-red-400'}`}>
            {settings.isBookingOpen ? 'Open' : 'Closed'}
          </div>
        </div>
      </div>
    </div>
  );
}