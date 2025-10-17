// app/admin/members/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Crown, Search, Mail, Phone, QrCode } from 'lucide-react';

interface Member {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  membershipCode: string;
  status: string;
  joinedAt: string;
}

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
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
      setMembers(data.members);
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
          onClick={fetchMembers}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition"
        >
          Refresh
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
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-slate-800 rounded-lg p-6 border border-emerald-700/30">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-900 to-yellow-900 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-yellow-500" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                member.status === 'ACTIVE'
                  ? 'bg-emerald-900/50 text-emerald-400'
                  : 'bg-red-900/50 text-red-400'
              }`}>
                {member.status}
              </span>
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
                <QrCode size={14} className="text-yellow-500" />
                <span className="text-yellow-500 font-mono text-xs">{member.membershipCode}</span>
              </div>
            </div>

            <div className="text-xs text-gray-500 mb-4">
              Joined: {new Date(member.joinedAt).toLocaleDateString()}
            </div>

            <button
              onClick={() => viewMemberCard(member)}
              className="w-full px-4 py-2 bg-emerald-900/50 text-emerald-400 rounded-lg hover:bg-emerald-900 transition"
            >
              View Card
            </button>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Crown className="w-16 h-16 text-gray-600 mx-auto mb-4" />
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

            <div className="bg-gradient-to-br from-emerald-900 to-yellow-900 p-6 rounded-lg mb-4">
              <div className="text-center mb-4">
                <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                <h2 className="text-2xl font-bold text-white">{selectedMember.fullName}</h2>
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