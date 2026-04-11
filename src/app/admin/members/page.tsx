/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Crown, Search, Mail, Phone, QrCode, Pencil, Trash2, ArrowUpDown, X, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Member {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
    profession?: string | null;
    interest?: string | null;
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
    const [editModal, setEditModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<Member | null>(null);
    const [editMember, setEditMember] = useState<Member | null>(null);
    const [editForm, setEditForm] = useState({
        fullName: '', email: '', phone: '', profession: '', interest: '',
        membershipType: 'STANDARD', status: 'ACTIVE'
    });
    const [viewMember, setViewMember] = useState<Member | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState('');

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

    const openEdit = (member: Member) => {
        setEditMember(member);
        setEditForm({
            fullName: member.fullName,
            email: member.email,
            phone: member.phone || '',
            profession: member.profession || '',
            interest: member.interest || '',
            membershipType: member.membershipType || 'STANDARD',
            status: member.status,
        });
        setEditModal(true);
        setActionMessage('');
    };

    const saveEdit = async () => {
        if (!editMember) return;
        setActionLoading(true);
        setActionMessage('');
        try {
            const res = await fetch(`/api/members/${editMember.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm),
            });
            const data = await res.json();
            if (res.ok) {
                setEditModal(false);
                fetchMembers();
            } else {
                setActionMessage(data.error || 'Failed to update');
            }
        } catch {
            setActionMessage('Network error');
        } finally {
            setActionLoading(false);
        }
    };

    const toggleMembershipType = async (member: Member) => {
        const newType = member.membershipType === 'PREMIUM' ? 'STANDARD' : 'PREMIUM';
        try {
            const res = await fetch(`/api/members/${member.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ membershipType: newType }),
            });
            if (res.ok) fetchMembers();
        } catch (error) {
            console.error('Toggle membership error:', error);
        }
    };

    const deleteMember = async (member: Member) => {
        setActionLoading(true);
        try {
            const res = await fetch(`/api/members/${member.id}`, { method: 'DELETE' });
            if (res.ok) {
                setDeleteConfirm(null);
                fetchMembers();
            }
        } catch (error) {
            console.error('Delete error:', error);
        } finally {
            setActionLoading(false);
        }
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
                        <div key={member.id} className={`bg-slate-800 rounded-lg p-6 border ${isPremium ? 'border-yellow-600/40' : 'border-emerald-700/30'}`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isPremium ? 'bg-gradient-to-br from-yellow-800 to-yellow-600' : 'bg-gradient-to-br from-emerald-900 to-yellow-900'}`}>
                                    <Image src="/logo.png" alt="Logo" width={40} height={40} style={{ background: 'transparent' }} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${isPremium ? 'bg-yellow-900/50 text-yellow-400' : 'bg-slate-700/50 text-gray-400'}`}>
                                        {isPremium ? 'PREMIUM' : 'STANDARD'}
                                    </span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${member.status === 'ACTIVE' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-red-900/50 text-red-400'}`}>
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

                            {/* Action buttons */}
                            <div className="flex gap-2 mb-2">
                                <button
                                    onClick={() => setViewMember(member)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition text-sm ${isPremium ? 'bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50' : 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50'}`}
                                >
                                    <Eye size={14} /> View Card
                                </button>
                                <button
                                    onClick={() => openEdit(member)}
                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition text-sm"
                                >
                                    <Pencil size={14} /> Edit
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => toggleMembershipType(member)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition text-sm ${isPremium ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50'}`}
                                    title={isPremium ? 'Downgrade to Standard' : 'Upgrade to Premium'}
                                >
                                    <ArrowUpDown size={14} /> {isPremium ? 'Downgrade' : 'Upgrade'}
                                </button>
                                <button
                                    onClick={() => setDeleteConfirm(member)}
                                    className="px-3 py-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 transition"
                                    title="Delete member"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredMembers.length === 0 && (
                <div className="text-center py-12">
                    <Crown className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No members found</p>
                </div>
            )}

            {/* Edit Modal */}
            {editModal && editMember && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-lg max-w-lg w-full p-6 border border-slate-700 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Edit Member</h3>
                            <button onClick={() => setEditModal(false)} className="text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        {actionMessage && (
                            <div className="mb-4 p-3 bg-red-900/30 text-red-400 rounded-lg text-sm">{actionMessage}</div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                                <input type="text" value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Email</label>
                                <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Phone</label>
                                <input type="text" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Profession</label>
                                <input type="text" value={editForm.profession} onChange={(e) => setEditForm({ ...editForm, profession: e.target.value })} className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Interest / Notes</label>
                                <textarea value={editForm.interest} onChange={(e) => setEditForm({ ...editForm, interest: e.target.value })} rows={3} className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none resize-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Membership Type</label>
                                    <select value={editForm.membershipType} onChange={(e) => setEditForm({ ...editForm, membershipType: e.target.value })} className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none">
                                        <option value="STANDARD">Standard</option>
                                        <option value="PREMIUM">Premium</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Status</label>
                                    <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none">
                                        <option value="ACTIVE">Active</option>
                                        <option value="EXPIRED">Expired</option>
                                        <option value="SUSPENDED">Suspended</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setEditModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition">Cancel</button>
                            <button onClick={saveEdit} disabled={actionLoading} className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition disabled:opacity-50">
                                {actionLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Card Modal */}
            {viewMember && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-lg max-w-md w-full p-6 border border-slate-700">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Member Card</h3>
                            <button onClick={() => setViewMember(null)} className="text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className={`p-6 rounded-lg mb-4 ${viewMember.membershipType === 'PREMIUM'
                            ? 'bg-gradient-to-br from-yellow-900 to-neutral-900 border border-yellow-700/50'
                            : 'bg-gradient-to-br from-emerald-900 to-yellow-900 border border-emerald-700/50'
                        }`}>
                            <div className="text-center mb-4">
                                <Image src="/logo.png" alt="Casa Privé" width={48} height={48} className="mx-auto mb-3" style={{ background: 'transparent' }} />
                                <h2 className="text-2xl font-bold text-white">{viewMember.fullName}</h2>
                                <span className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-medium ${viewMember.membershipType === 'PREMIUM'
                                    ? 'bg-yellow-800/50 text-yellow-300'
                                    : 'bg-emerald-800/50 text-emerald-300'
                                }`}>
                                    {viewMember.membershipType === 'PREMIUM' ? 'PREMIUM MEMBER' : 'STANDARD MEMBER'}
                                </span>
                            </div>
                            <div className="text-center text-yellow-500 font-mono text-xl mb-3">
                                {viewMember.membershipCode}
                            </div>
                            <div className="space-y-1 text-center text-sm text-gray-300">
                                <p>{viewMember.email}</p>
                                {viewMember.phone && <p>{viewMember.phone}</p>}
                            </div>
                            <div className="text-center text-xs text-gray-500 mt-3">
                                Member since {new Date(viewMember.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </div>
                        </div>

                        <a
                            href={`/member-card/${viewMember.membershipCode}`}
                            target="_blank"
                            className={`block w-full px-4 py-3 text-white text-center rounded-lg transition ${viewMember.membershipType === 'PREMIUM'
                                ? 'bg-yellow-700 hover:bg-yellow-600'
                                : 'bg-emerald-600 hover:bg-emerald-500'
                            }`}
                        >
                            Open Full Card Page
                        </a>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-lg max-w-sm w-full p-6 border border-red-900/50">
                        <h3 className="text-xl font-bold text-white mb-2">Delete Member</h3>
                        <p className="text-gray-400 mb-1">Are you sure you want to delete:</p>
                        <p className="text-white font-semibold mb-1">{deleteConfirm.fullName}</p>
                        <p className="text-yellow-500 font-mono text-sm mb-6">{deleteConfirm.membershipCode}</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition">Cancel</button>
                            <button onClick={() => deleteMember(deleteConfirm)} disabled={actionLoading} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition disabled:opacity-50">
                                {actionLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
