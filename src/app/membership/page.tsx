/* eslint-disable @typescript-eslint/no-explicit-any */
// app/membership/page.tsx
'use client';

import { useState } from 'react';
import { Crown, CheckCircle, Users, Shield, Calendar } from 'lucide-react';

export default function MembershipPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    profession: '',
    interest: '',
    reference1: '',
    reference2: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Application failed');
      }

      setMessage('Application submitted successfully! Check your email for your virtual membership card link.');
      // Optionally redirect to member card page
      setTimeout(() => {
        window.location.href = `/member-card/${data.member.membershipCode}`;
      }, 2000);
    } catch (error: any) {
      setMessage(error.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-yellow-500 bg-clip-text text-transparent">
              Join Casa Privé
            </h1>
            <p className="text-xl text-gray-300">
              Become part of an elite community that values sophistication and exceptional experiences
            </p>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <BenefitCard
              icon={<Calendar className="w-8 h-8" />}
              title="Priority Access"
              description="Guaranteed invitations and priority booking for all signature events"
            />
            <BenefitCard
              icon={<Users className="w-8 h-8" />}
              title="Exclusive Network"
              description="Connect with influential peers and thought leaders in a refined environment"
            />
            <BenefitCard
              icon={<Shield className="w-8 h-8" />}
              title="Concierge Service"
              description="Dedicated membership liaison for customized experiences"
            />
          </div>

          {/* Membership Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-slate-800/50 p-8 rounded-lg border border-emerald-700/30">
              <h3 className="text-2xl font-bold text-emerald-400 mb-4">What You Get</h3>
              <ul className="space-y-3">
                {[
                  'Priority access to all signature events',
                  'Exclusive entry to sought-after venues globally',
                  'Unrivalled networking opportunities',
                  'Concierge event personalization',
                  'Discreet privacy at all events',
                  'Guest privileges for select events',
                  'Virtual membership card with QR code',
                  'Access to members-only experiences',
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800/50 p-8 rounded-lg border border-yellow-700/30">
              <h3 className="text-2xl font-bold text-yellow-500 mb-4">Application Process</h3>
              <div className="space-y-4">
                <ProcessStep
                  number="1"
                  title="Submit Application"
                  description="Complete the form with your details and references"
                />
                <ProcessStep
                  number="2"
                  title="Committee Review"
                  description="Your application will be reviewed by our Membership Committee"
                />
                <ProcessStep
                  number="3"
                  title="Welcome Kit"
                  description="Approved members receive a curated welcome kit via courier"
                />
                <ProcessStep
                  number="4"
                  title="Activation"
                  description="Pay initiation fee to activate your membership"
                />
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="bg-slate-800 p-8 rounded-lg border border-emerald-700/30">
            <h2 className="text-3xl font-bold text-center text-yellow-500 mb-8">
              Membership Application
            </h2>

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
                  <label className="block text-gray-300 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Profession/Industry</label>
                  <input
                    type="text"
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Why do you want to join Casa Privé?</label>
                <textarea
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                  placeholder="Tell us about your interests and what you hope to gain from membership..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Reference 1 (Non-family)</label>
                  <input
                    type="text"
                    value={formData.reference1}
                    onChange={(e) => setFormData({ ...formData, reference1: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                    placeholder="Name and contact"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Reference 2 (Non-family)</label>
                  <input
                    type="text"
                    value={formData.reference2}
                    onChange={(e) => setFormData({ ...formData, reference2: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                    placeholder="Name and contact"
                  />
                </div>
              </div>

              {message && (
                <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-emerald-900/50 text-emerald-300' : 'bg-red-900/50 text-red-300'}`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg font-semibold hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 transition transform hover:scale-105"
              >
                {loading ? 'Submitting Application...' : 'Submit Application'}
              </button>

              <p className="text-center text-gray-400 text-sm">
                By submitting this application, you agree to our terms and conditions and privacy policy
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function BenefitCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-emerald-700/30 hover:border-yellow-500/50 transition-all transform hover:scale-105">
      <div className="text-yellow-500 mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-emerald-400 mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

function ProcessStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 text-slate-900 rounded-full flex items-center justify-center font-bold">
        {number}
      </div>
      <div>
        <h4 className="text-white font-bold mb-1">{title}</h4>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );
}