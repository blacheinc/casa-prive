/* eslint-disable @typescript-eslint/no-explicit-any */
// app/membership/page.tsx - PRODUCTION: ADMIN ONLY
'use client';

import { useState, useEffect } from 'react';
import { Crown, CheckCircle, Users, Shield, Calendar, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function MembershipPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        profession: '',
        interest: '',
        reference1: '',
        reference2: '',
        membershipType: 'STANDARD' as 'STANDARD' | 'PREMIUM',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/auth/check');
            if (response.ok) {
                setIsAuthenticated(true);
            }
        } catch (error) {
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                setIsAuthenticated(true);
            } else {
                const data = await response.json();
                setLoginError(data.error || 'Invalid credentials');
            }
        } catch (error) {
            setLoginError('Login failed. Please try again.');
        }
    };

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

            setMessage('Member created successfully! Check their email for the membership card link.');

            // Reset form
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                profession: '',
                interest: '',
                reference1: '',
                reference2: '',
                membershipType: 'STANDARD',
            });

            // Optionally open the member card in new tab
            if (data.member?.membershipCode) {
                const cardUrl = `${window.location.origin}/member-card/${data.member.membershipCode}`;
                window.open(cardUrl, '_blank');
            }
        } catch (error: any) {
            setMessage(error.message || 'Failed to create member');
        } finally {
            setLoading(false);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <Image
                        src="/logo.png"
                        alt="Casa Privé Logo"
                        width={40}
                        height={40}
                        className="group-hover:scale-110 transition-transform"
                        style={{ background: 'transparent' }}
                    />
                    <p className="text-gray-300 font-light text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    // Login form if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center py-32">
                <div className="max-w-md w-full mx-auto px-4">
                    <div className="bg-slate-800/50 border border-emerald-700/30 p-8 rounded">
                        <div className="text-center mb-8">
                            <Lock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                            <h1 className="text-3xl font-light text-white mb-2">Admin Access Only</h1>
                            <p className="text-gray-400 font-light text-sm">
                                Please login to access membership management
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-gray-300 mb-2 text-sm font-light">Username</label>
                                <input
                                    type="text"
                                    required
                                    value={loginData.username}
                                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 text-sm font-light">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                                />
                            </div>

                            {loginError && (
                                <div className="p-4 rounded text-sm bg-red-900/50 text-red-300">
                                    {loginError}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-light tracking-wider rounded hover:from-emerald-500 hover:to-emerald-400 transition"
                            >
                                LOGIN
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => router.push('/')}
                                className="text-gray-400 hover:text-emerald-400 text-sm font-light"
                            >
                                ← Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main membership form (only visible to authenticated admin)
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 py-32">
            <div className="max-w-6xl mx-auto px-4">
                {/* Hero */}
                <div className="text-center mb-12">
                    <Image
                        src="/logo.png"
                        alt="Casa Privé Logo"
                        width={40}
                        height={40}
                        className="group-hover:scale-110 transition-transform"
                        style={{ background: 'transparent' }}
                    />
                    <h1 className="text-4xl md:text-5xl font-light mb-4 text-white">
                        Create New Member
                    </h1>
                    <p className="text-gray-300 font-light text-sm">
                        Admin Panel - Add new members to Casa Privé × Alora Beach Resort
                    </p>
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto mt-6" />
                </div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <BenefitCard
                        icon={<Calendar className="w-8 h-8" />}
                        title="Priority Access"
                        description="Guaranteed invitations and priority booking for all signature events"
                    />
                    <BenefitCard
                        icon={<Users className="w-8 h-8" />}
                        title="Exclusive Network"
                        description="Connect with influential peers and thought leaders"
                    />
                    <BenefitCard
                        icon={<Shield className="w-8 h-8" />}
                        title="VIP Service"
                        description="Dedicated service and customized experiences"
                    />
                </div>

                {/* Membership Form */}
                <div className="bg-slate-800/50 border border-emerald-700/30 p-8 rounded">
                    <h2 className="text-2xl font-light text-center text-yellow-500 mb-8">
                        Member Registration
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Membership Type Selector */}
                        <div>
                            <label className="block text-gray-300 mb-3 text-sm font-light">Membership Type *</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, membershipType: 'STANDARD' })}
                                    className={`p-5 rounded border-2 text-left transition-all ${
                                        formData.membershipType === 'STANDARD'
                                            ? 'border-emerald-500 bg-emerald-900/30'
                                            : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <Crown className="w-5 h-5 text-emerald-400" />
                                        <span className="text-white font-light tracking-wider text-sm">STANDARD</span>
                                    </div>
                                    <p className="text-gray-400 text-xs font-light">Priority access, premium drinks, and VIP service at all events</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, membershipType: 'PREMIUM' })}
                                    className={`p-5 rounded border-2 text-left transition-all ${
                                        formData.membershipType === 'PREMIUM'
                                            ? 'border-yellow-500 bg-yellow-900/20'
                                            : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <Crown className="w-5 h-5 text-yellow-400" />
                                        <span className="text-white font-light tracking-wider text-sm">PREMIUM</span>
                                    </div>
                                    <p className="text-gray-400 text-xs font-light">All standard benefits plus exclusive table reservations and concierge service</p>
                                </button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-300 mb-2 text-sm font-light">Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                                <label className="block text-gray-300 mb-2 text-sm font-light">Phone Number *</label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 text-sm font-light">Profession/Industry</label>
                                <input
                                    type="text"
                                    value={formData.profession}
                                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2 text-sm font-light">Notes/Interest</label>
                            <textarea
                                value={formData.interest}
                                onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                                placeholder="Any additional notes about the member..."
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-300 mb-2 text-sm font-light">Reference 1</label>
                                <input
                                    type="text"
                                    value={formData.reference1}
                                    onChange={(e) => setFormData({ ...formData, reference1: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                                    placeholder="Name and contact"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 text-sm font-light">Reference 2</label>
                                <input
                                    type="text"
                                    value={formData.reference2}
                                    onChange={(e) => setFormData({ ...formData, reference2: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                                    placeholder="Name and contact"
                                />
                            </div>
                        </div>

                        {message && (
                            <div className={`p-4 rounded text-sm ${message.includes('success') ? 'bg-emerald-900/50 text-emerald-300' : 'bg-red-900/50 text-red-300'}`}>
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-light tracking-wider rounded hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 transition transform hover:scale-105"
                        >
                            {loading ? 'CREATING MEMBER...' : 'CREATE MEMBER'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

function BenefitCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="bg-slate-900/50 border border-emerald-700/30 p-6 rounded hover:border-yellow-500/50 transition-all">
            <div className="text-yellow-500 mb-4">{icon}</div>
            <h3 className="text-lg font-light text-emerald-400 mb-2">{title}</h3>
            <p className="text-gray-300 text-sm font-light">{description}</p>
        </div>
    );
}