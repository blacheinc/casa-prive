/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
// app/member-card/[code]/page.tsx - FIXED WITH DIRECT LINK FOR SAFARI
'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { Download, Calendar, Mail, Phone, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface Member {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  membershipCode: string;
  membershipType?: string;
  qrCode: string;
  status: string;
  joinedAt: string;
  expiresAt?: string;
}

function MemberCardContent() {
  const params = useParams();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingWallet, setDownloadingWallet] = useState(false);
  const qrRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    fetchMember();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const downloadQRCode = () => {
    if (!member || !qrRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = qrRef.current;

    canvas.width = img.naturalWidth || 300;
    canvas.height = img.naturalHeight || 300;

    if (ctx) {
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `casa-prive-${member.membershipCode}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      });
    }
  };

  const addToAppleWallet = async () => {
    if (!member) return;
    
    setDownloadingWallet(true);
    
    try {
      // For iOS Safari, direct navigation works best
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      if (isIOS || isSafari) {
        // Direct navigation for Safari/iOS
        window.location.href = `/api/members/${member.membershipCode}/wallet`;
      } else {
        // Blob download for other browsers
        const response = await fetch(`/api/members/${member.membershipCode}/wallet`);
        
        if (!response.ok) {
          throw new Error('Failed to generate wallet pass');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `casaprive-${member.membershipCode}.pkpass`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
      
      setTimeout(() => setDownloadingWallet(false), 2000);
      
    } catch (error) {
      console.error('Error downloading wallet pass:', error);
      alert('Failed to download Apple Wallet pass. Please try again.');
      setDownloadingWallet(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Casa Privé Logo"
            width={64}
            height={64}
            className="mx-auto mb-4 animate-pulse"
            style={{ background: 'transparent' }}
          />
          <p className="text-gray-300 font-light text-sm">Loading your membership card...</p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center py-32">
        <div className="max-w-md mx-auto bg-slate-800/50 border border-red-700/30 p-8 rounded text-center">
          <h1 className="text-2xl font-light text-red-400 mb-4">Card Not Found</h1>
          <p className="text-gray-300 font-light text-sm mb-6">
            {error || 'This membership card could not be found.'}
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-500 font-light tracking-wider"
          >
            RETURN HOME
          </a>
        </div>
      </div>
    );
  }

  const isPremium = member.membershipType === 'PREMIUM';

  return (
    <div className={`min-h-screen py-32 ${isPremium
      ? 'bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950'
      : 'bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900'
    }`}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Welcome Message */}
        <div className="text-center mb-12">
          <Image
            src="/logo.png"
            alt="Casa Privé Logo"
            width={64}
            height={64}
            className="mx-auto mb-4"
            style={{ background: 'transparent' }}
          />
          <h1 className="text-4xl md:text-5xl font-light mb-4 text-white">
            Welcome to Casa Privé
          </h1>
          {isPremium && (
            <span className="inline-block px-4 py-1 text-xs tracking-[0.3em] uppercase mb-3"
              style={{ background: 'linear-gradient(135deg, #d4af37, #f5d675)', color: '#1a1a1a' }}>
              Premium Member
            </span>
          )}
          <p className="text-xl text-gray-300 font-light">
            {member.fullName}
          </p>
        </div>

        {/* About Membership */}
        <div className={`p-8 rounded mb-8 ${isPremium
          ? 'bg-neutral-900/80 border border-yellow-600/30'
          : 'bg-slate-800/50 border border-emerald-700/30'
        }`}>
          <h2 className={`text-2xl font-light mb-4 ${isPremium ? 'text-yellow-400' : 'text-yellow-500'}`}>
            Your {isPremium ? 'Premium' : 'Exclusive'} Membership
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4 text-sm font-light">
            {isPremium
              ? 'As a Premium member of Casa Privé, you enjoy our highest tier of service — exclusive table reservations, dedicated concierge, priority access to all events, and bespoke experiences tailored to you.'
              : 'As a valued member of Casa Privé, you are part of an elite community that values sophistication, privacy, and exceptional experiences. Your membership grants you access to exclusive Saturday night drinks events and premium networking opportunities.'
            }
          </p>
          <div className={`grid gap-4 mt-6 ${isPremium ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
            <div className="text-center">
              <CheckCircle className={`w-8 h-8 mx-auto mb-2 ${isPremium ? 'text-yellow-500' : 'text-emerald-500'}`} />
              <p className="text-sm text-gray-300 font-light">Priority Event Access</p>
            </div>
            <div className="text-center">
              <CheckCircle className={`w-8 h-8 mx-auto mb-2 ${isPremium ? 'text-yellow-500' : 'text-emerald-500'}`} />
              <p className="text-sm text-gray-300 font-light">Premium Drinks</p>
            </div>
            <div className="text-center">
              <CheckCircle className={`w-8 h-8 mx-auto mb-2 ${isPremium ? 'text-yellow-500' : 'text-emerald-500'}`} />
              <p className="text-sm text-gray-300 font-light">VIP Service</p>
            </div>
            {isPremium && (
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-sm text-gray-300 font-light">Concierge & Table Reservations</p>
              </div>
            )}
          </div>
        </div>

        {/* Virtual Membership Card */}
        <div className="relative mb-8" id="member-card">
          {isPremium ? (
            /* ── PREMIUM CARD ── */
            <div className="p-[2px] rounded-2xl shadow-2xl" style={{
              background: 'linear-gradient(135deg, #d4af37, #f5d675, #d4af37, #b8860b)',
            }}>
              <div className="rounded-2xl p-8" style={{
                background: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 50%, #1a1a1a 100%)',
              }}>
                {/* Card Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-3xl font-light tracking-wider" style={{
                      background: 'linear-gradient(135deg, #d4af37, #f5d675)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      CASA PRIVÉ
                    </h3>
                    <p className="text-yellow-600/60 text-xs tracking-[0.3em] uppercase font-light mt-1">Premium Members&apos; Club</p>
                  </div>
                  <Image
                    src="/logo.png"
                    alt="Casa Privé"
                    width={48}
                    height={48}
                    style={{ background: 'transparent' }}
                  />
                </div>

                {/* Gold divider */}
                <div className="h-px mb-8" style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }} />

                {/* Member Info */}
                <div className="mb-8">
                  <p className="text-yellow-600/50 text-xs uppercase tracking-[0.2em] mb-1 font-light">Member Name</p>
                  <h2 className="text-2xl font-light text-white mb-6">{member.fullName}</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-yellow-600/50 text-xs uppercase tracking-[0.2em] mb-1 font-light">Member Since</p>
                      <p className="font-light" style={{ color: '#d4af37' }}>
                        {new Date(member.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-yellow-600/50 text-xs uppercase tracking-[0.2em] mb-1 font-light">Status</p>
                      <p className={`font-light ${member.status === 'ACTIVE' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {member.status}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Membership Code */}
                <div className="mb-8">
                  <p className="text-yellow-600/50 text-xs uppercase tracking-[0.2em] mb-1 font-light">Membership Code</p>
                  <p className="text-3xl font-mono font-light tracking-wider" style={{ color: '#d4af37' }}>
                    {member.membershipCode}
                  </p>
                </div>

                {/* QR Code */}
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-lg" style={{ background: '#ffffff' }}>
                    <img
                      ref={qrRef}
                      src={member.qrCode}
                      alt="Membership QR Code"
                      className="w-48 h-48"
                      crossOrigin="anonymous"
                    />
                  </div>
                </div>

                {/* Gold divider */}
                <div className="h-px mb-4" style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }} />

                {/* Card Footer */}
                <div className="text-center text-xs font-light" style={{ color: '#d4af3780' }}>
                  <p>Premium membership — present this card at all Casa Privé events</p>
                </div>
              </div>
            </div>
          ) : (
            /* ── STANDARD CARD ── */
            <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-yellow-900 p-1 rounded-2xl shadow-2xl">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-3xl font-light text-transparent bg-gradient-to-r from-emerald-400 to-yellow-500 bg-clip-text">
                      CASA PRIVÉ
                    </h3>
                    <p className="text-gray-400 text-sm font-light">Members&apos; Club</p>
                  </div>
                  <Image
                    src="/logo.png"
                    alt="Casa Privé"
                    width={48}
                    height={48}
                    style={{ background: 'transparent' }}
                  />
                </div>

                {/* Member Info */}
                <div className="mb-8">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-light">Member Name</p>
                  <h2 className="text-2xl font-light text-white mb-4">{member.fullName}</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-light">Member Since</p>
                      <p className="text-emerald-400 font-light">
                        {new Date(member.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-light">Status</p>
                      <p className={`font-light ${member.status === 'ACTIVE' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {member.status}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Membership Code */}
                <div className="mb-8">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-light">Membership Code</p>
                  <p className="text-3xl font-mono font-light text-yellow-500 tracking-wider">
                    {member.membershipCode}
                  </p>
                </div>

                {/* QR Code */}
                <div className="flex justify-center mb-6">
                  <div className="bg-white p-4 rounded-lg">
                    <img
                      ref={qrRef}
                      src={member.qrCode}
                      alt="Membership QR Code"
                      className="w-48 h-48"
                      crossOrigin="anonymous"
                    />
                  </div>
                </div>

                {/* Card Footer */}
                <div className="text-center text-gray-500 text-xs font-light">
                  <p>Present this card at all Casa Privé events</p>
                </div>
              </div>
            </div>
          )}

          {/* Decorative Elements */}
          <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl ${isPremium ? 'bg-yellow-500/15' : 'bg-yellow-500/10'}`}></div>
          <div className={`absolute -bottom-4 -left-4 w-32 h-32 rounded-full blur-2xl ${isPremium ? 'bg-yellow-600/10' : 'bg-emerald-500/10'}`}></div>
        </div>

        {/* Contact Information */}
        <div className={`p-6 rounded mb-8 ${isPremium
          ? 'bg-neutral-900/80 border border-yellow-600/20'
          : 'bg-slate-800/50 border border-emerald-700/30'
        }`}>
          <h3 className={`text-xl font-light mb-4 ${isPremium ? 'text-yellow-400' : 'text-emerald-400'}`}>Your Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-300 text-sm">
              <Mail className={`w-5 h-5 flex-shrink-0 ${isPremium ? 'text-yellow-500' : 'text-yellow-500'}`} />
              <span className="font-light">{member.email}</span>
            </div>
            {member.phone && (
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <Phone className={`w-5 h-5 flex-shrink-0 ${isPremium ? 'text-yellow-500' : 'text-yellow-500'}`} />
                <span className="font-light">{member.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button
            onClick={downloadQRCode}
            className={`px-6 py-3 text-white text-sm rounded transition flex items-center gap-2 font-light tracking-wider ${isPremium
              ? 'bg-gradient-to-r from-yellow-700 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500'
              : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400'
            }`}
          >
            <Download size={18} />
            DOWNLOAD QR CODE
          </button>

          <button
            onClick={addToAppleWallet}
            disabled={downloadingWallet}
            className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white text-sm rounded hover:from-yellow-500 hover:to-yellow-400 transition flex items-center gap-2 font-light tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            {downloadingWallet ? 'GENERATING...' : 'ADD TO APPLE WALLET'}
          </button>

          <a
            href="/booking"
            className={`px-6 py-3 border-2 text-sm rounded transition flex items-center gap-2 font-light tracking-wider ${isPremium
              ? 'border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black'
              : 'border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white'
            }`}
          >
            <Calendar size={18} />
            BOOK EVENT
          </a>
        </div>

        {/* Important Notes */}
        <div className={`rounded p-6 ${isPremium
          ? 'bg-yellow-900/15 border border-yellow-600/25'
          : 'bg-yellow-900/20 border border-yellow-500/30'
        }`}>
          <h3 className="text-base font-light text-yellow-500 mb-3">Important Notes</h3>
          <ul className="space-y-2 text-gray-300 text-xs font-light">
            <li>• Screenshot or save this page for offline access</li>
            <li>• Present your QR code at event check-in</li>
            <li>• Your membership code is unique and non-transferable</li>
            <li>• Click &ldquo;Add to Apple Wallet&rdquo; to save to your iPhone</li>
            <li>• Events are held every Saturday evening</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <Image
          src="/logo.png"
          alt="Casa Privé Logo"
          width={64}
          height={64}
          className="mx-auto mb-4 animate-pulse"
          style={{ background: 'transparent' }}
        />
        <p className="text-gray-300 font-light text-sm">Loading...</p>
      </div>
    </div>
  );
}

// Main component with Suspense wrapper
export default function MemberCardPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MemberCardContent />
    </Suspense>
  );
}