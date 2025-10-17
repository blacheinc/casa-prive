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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 py-32">
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
          <p className="text-xl text-gray-300 font-light">
            {member.fullName}
          </p>
        </div>

        {/* About Membership */}
        <div className="bg-slate-800/50 border border-emerald-700/30 p-8 rounded mb-8">
          <h2 className="text-2xl font-light text-yellow-500 mb-4">Your Exclusive Membership</h2>
          <p className="text-gray-300 leading-relaxed mb-4 text-sm font-light">
            As a valued member of Casa Privé, you are part of an elite community that values
            sophistication, privacy, and exceptional experiences. Your membership grants you
            access to exclusive Saturday night drinks events and premium networking opportunities.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm text-gray-300 font-light">Priority Event Access</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm text-gray-300 font-light">Premium Drinks</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm text-gray-300 font-light">VIP Service</p>
            </div>
          </div>
        </div>

        {/* Virtual Membership Card */}
        <div className="relative mb-8" id="member-card">
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
                      {new Date(member.joinedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-light">Status</p>
                    <p className={`font-light ${member.status === 'ACTIVE' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
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

          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
        </div>

        {/* Contact Information */}
        <div className="bg-slate-800/50 border border-emerald-700/30 p-6 rounded mb-8">
          <h3 className="text-xl font-light text-emerald-400 mb-4">Your Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-300 text-sm">
              <Mail className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <span className="font-light">{member.email}</span>
            </div>
            {member.phone && (
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <Phone className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <span className="font-light">{member.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button
            onClick={downloadQRCode}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm rounded hover:from-emerald-500 hover:to-emerald-400 transition flex items-center gap-2 font-light tracking-wider"
          >
            <Download size={18} />
            DOWNLOAD QR CODE
          </button>
          
          {/* Direct link to Apple Wallet pass - works better with Safari/iOS */}
          <a
            href={`/api/members/${member.membershipCode}/wallet`}
            download={`casaprive-${member.membershipCode}.pkpass`}
            className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white text-sm rounded hover:from-yellow-500 hover:to-yellow-400 transition flex items-center gap-2 font-light tracking-wider"
          >
            <Download size={18} />
            ADD TO APPLE WALLET
          </a>
          
          <a
            href="/booking"
            className="px-6 py-3 border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white text-sm rounded transition flex items-center gap-2 font-light tracking-wider"
          >
            <Calendar size={18} />
            BOOK EVENT
          </a>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-6">
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