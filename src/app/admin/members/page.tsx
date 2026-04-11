// app/admin/members/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Crown, Search, Mail, Phone, QrCode } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Member {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
    membershipCode: string;
    membershipType?: string;
    status: string;
    joinedAt: string;
}

export default function AdminMembers() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [showCardModal, setShowCardModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await fetch('/api/members');
            const data = await response.json();
            setMembers(data.members ?? []);
        } catch (error) {
            console.error('Error fetching members:', error);
        } finally {
            setLoading(false);
        }
    };

    const viewMemberCard = (member: Member) => {
        setSelectedMember(member);
        setShowCardModal(true);
    };

    const filteredMembers = members.filter(member =>
        member.fullName.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase()) ||
        member.membershipCode.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Members Management</h1>
                    <p className="text-gray-400">Manage Casa Privé members</p>
                </div>
                <button
                    onClick={() => router.push('/membership')}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition"
                >
                    Add Member
                </button>
            </div>

            {/* Search */}
            <div className="bg-slate-800 rounded-lg p-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Members Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member) => {
                    const isPremium = member.membershipType === 'PREMIUM';
                    return (
                        <div key={member.id} className={`bg-slate-800 rounded-lg p-6 border ${
                            isPremium ? 'border-yellow-600/40' : 'border-emerald-700/30'
                        }`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                    isPremium
                                        ? 'bg-gradient-to-br from-yellow-800 to-yellow-600'
                                        : 'bg-gradient-to-br from-emerald-900 to-yellow-900'
                                }`}>
                                    <Image
                                        src="/logo.png"
                                        alt="Casa Privé Logo"
                                        width={40}
                                        height={40}
                                        className="group-hover:scale-110 transition-transform"
                                        style={{ background: 'transparent' }}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        isPremium
                                            ? 'bg-yellow-900/50 text-yellow-400'
                                            : 'bg-slate-700/50 text-gray-400'
                                    }`}>
                                        {isPremium ? 'PREMIUM' : 'STANDARD'}
                                    </span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        member.status === 'ACTIVE'
                                            ? 'bg-emerald-900/50 text-emerald-400'
                                            : 'bg-red-900/50 text-red-400'
                                    }`}>
                                        {member.status}
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2">{member.fullName}</h3>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Mail size={14} />
                                    <span>{member.email}</span>
                                </div>
                                {member.phone && (
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Phone size={14} />
                                        <span>{member.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-sm">
                                    <QrCode size={14} className={isPremium ? 'text-yellow-400' : 'text-yellow-500'} />
                                    <span className={`font-mono text-xs ${isPremium ? 'text-yellow-400' : 'text-yellow-500'}`}>{member.membershipCode}</span>
                                </div>
                            </div>

                            <div className="text-xs text-gray-500 mb-4">
                                Joined: {new Date(member.joinedAt).toLocaleDateString()}
                            </div>

                            <button
                                onClick={() => viewMemberCard(member)}
                                className={`w-full px-4 py-2 rounded-lg transition ${
                                    isPremium
                                        ? 'bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50'
                                        : 'bg-emerald-900/50 text-emerald-400 hover:bg-emerald-900'
                                }`}
                            >
                                View Card
                            </button>
                        </div>
                    );
                })}
            </div>

            {filteredMembers.length === 0 && (
                <div className="text-center py-12">
                    <Image
                        src="/logo.png"
                        alt="Casa Privé Logo"
                        width={40}
                        height={40}
                        className="group-hover:scale-110 transition-transform"
                        style={{ background: 'transparent' }}
                    />
                    <p className="text-gray-400">No members found</p>
                </div>
            )}

            {/* Member Card Modal */}
            {showCardModal && selectedMember && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Member Card</h3>
                            <button
                                onClick={() => setShowCardModal(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className={`p-6 rounded-lg mb-4 ${
                            selectedMember.membershipType === 'PREMIUM'
                                ? 'bg-gradient-to-br from-yellow-900 to-neutral-900'
                                : 'bg-gradient-to-br from-emerald-900 to-yellow-900'
                        }`}>
                            <div className="text-center mb-4">
                                <Image
                                    src="/logo.png"
                                    alt="Casa Privé Logo"
                                    width={40}
                                    height={40}
                                    className="group-hover:scale-110 transition-transform"
                                    style={{ background: 'transparent' }}
                                />
                                <h2 className="text-2xl font-bold text-white">{selectedMember.fullName}</h2>
                                <span className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-medium ${
                                    selectedMember.membershipType === 'PREMIUM'
                                        ? 'bg-yellow-800/50 text-yellow-300'
                                        : 'bg-emerald-800/50 text-emerald-300'
                                }`}>
                                    {selectedMember.membershipType === 'PREMIUM' ? 'PREMIUM' : 'STANDARD'}
                                </span>
                            </div>
                            <div className="text-center text-yellow-500 font-mono text-xl mb-4">
                                {selectedMember.membershipCode}
                            </div>
                            <div className="text-center text-sm text-gray-300">
                                {selectedMember.email}
                            </div>
                        </div>

                        <a
                            href={`/member-card/${selectedMember.membershipCode}`}
                            target="_blank"
                            className="block w-full px-4 py-3 bg-emerald-600 text-white text-center rounded-lg hover:bg-emerald-500 transition"
                        >
                            View Full Card
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}