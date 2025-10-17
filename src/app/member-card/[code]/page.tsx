/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
// app/member-card/[code]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Crown, Download, Calendar, Mail, Phone, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface Member {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  membershipCode: string;
  qrCode: string;
  status: string;
  joinedAt: string;
  expiresAt?: string;
}

export default function MemberCardPage() {
  const params = useParams();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMember();
  }, [params.code]);

  const fetchMember = async () => {
    try {
      const response = await fetch(`/api/members?code=${params.code}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Member not found');
      }

      setMember(data.member);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWallet = () => {
    // In production, this would generate and download a .pkpass file
    alert('Apple Wallet integration coming soon! Please take a screenshot of your card for now.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-300">Loading your membership card...</p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-slate-800 p-8 rounded-lg text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Card Not Found</h1>
          <p className="text-gray-300 mb-6">
            {error || 'This membership card could not be found.'}
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Message */}
          <div className="text-center mb-12">
            <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-yellow-500 bg-clip-text text-transparent">
              Welcome to Casa Privé
            </h1>
            <p className="text-xl text-gray-300">
              {member.fullName}
            </p>
          </div>

          {/* About Casa Privé */}
          <div className="bg-slate-800/50 p-8 rounded-lg border border-emerald-700/30 mb-8">
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">Your Exclusive Membership</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              As a valued member of Casa Privé, you are part of an elite community that values 
              sophistication, privacy, and exceptional experiences. Your membership grants you 
              access to the world&apos;s most refined and imaginative social calendar.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm text-gray-300">Priority Event Access</p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm text-gray-300">Exclusive Venues</p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm text-gray-300">Concierge Service</p>
              </div>
            </div>
          </div>

          {/* Virtual Membership Card */}
          <div className="relative">
            <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-yellow-900 p-1 rounded-2xl shadow-2xl">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-3xl font-bold text-transparent bg-gradient-to-r from-emerald-400 to-yellow-500 bg-clip-text">
                      CASA PRIVÉ
                    </h3>
                    <p className="text-gray-400 text-sm">Members&apos; Club</p>
                  </div>
                  <Crown className="w-12 h-12 text-yellow-500" />
                </div>

                {/* Member Info */}
                <div className="mb-8">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Member Name</p>
                  <h2 className="text-2xl font-bold text-white mb-4">{member.fullName}</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Member Since</p>
                      <p className="text-emerald-400 font-semibold">
                        {new Date(member.joinedAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Status</p>
                      <p className={`font-semibold ${
                        member.status === 'ACTIVE' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {member.status}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Membership Code */}
                <div className="mb-8">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Membership Code</p>
                  <p className="text-3xl font-mono font-bold text-yellow-500 tracking-wider">
                    {member.membershipCode}
                  </p>
                </div>

                {/* QR Code */}
                <div className="flex justify-center mb-6">
                  <div className="bg-white p-4 rounded-lg">
                    <img 
                      src={member.qrCode} 
                      alt="Membership QR Code" 
                      className="w-48 h-48"
                    />
                  </div>
                </div>

                {/* Card Footer */}
                <div className="text-center text-gray-500 text-xs">
                  <p>Present this card at all Casa Privé events</p>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
          </div>

          {/* Contact Information */}
          <div className="mt-8 bg-slate-800/50 p-6 rounded-lg border border-emerald-700/30">
            <h3 className="text-xl font-bold text-emerald-400 mb-4">Your Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-5 h-5 text-yellow-500" />
                <span>{member.email}</span>
              </div>
              {member.phone && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone className="w-5 h-5 text-yellow-500" />
                  <span>{member.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <button
              onClick={handleAddToWallet}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg font-semibold hover:from-emerald-500 hover:to-emerald-400 transition flex items-center gap-2"
            >
              <Download size={20} />
              Add to Apple Wallet
            </button>
            <a
              href="/booking"
              className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-400 transition flex items-center gap-2"
            >
              <Calendar size={20} />
              Book an Event
            </a>
          </div>

          {/* Important Notes */}
          <div className="mt-8 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
            <h3 className="text-lg font-bold text-yellow-500 mb-3">Important Notes</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Screenshot or save this page for offline access</li>
              <li>• Present your QR code at event check-in</li>
              <li>• Your membership code is unique and non-transferable</li>
              <li>• Contact us if you need to update your information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}