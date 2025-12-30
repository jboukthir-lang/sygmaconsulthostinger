'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Users, Mail, Phone, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function TeamPage() {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchTeam();
        }
    }, [user]);

    const fetchTeam = async () => {
        try {
            const res = await fetch('/api/team', {
                headers: {
                    'x-user-id': user!.uid
                }
            });
            if (res.ok) {
                const data = await res.json();
                setMembers(data);
            }
        } catch (error) {
            console.error('Error fetching team:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredMembers = members.filter(member =>
        member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#001F3F]">Équipe</h1>
                    <p className="text-gray-500 mt-1">Gérez les membres de votre équipe et leurs accès.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard/entreprise/team/invite"
                        className="flex items-center gap-2 px-4 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors shadow-lg shadow-blue-900/20"
                    >
                        <Plus className="h-4 w-4" />
                        Inviter un membre
                    </Link>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher un membre..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Always show Current User (Admin) if list is empty or loaded */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center relative group hover:shadow-md transition-all">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-[#001F3F] mb-4">
                        {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{user?.displayName || 'Moi (Admin)'}</h3>
                    <p className="text-sm text-gray-500 mb-4">Propriétaire</p>
                    <div className="w-full border-t border-gray-100 pt-4 flex justify-between text-sm text-gray-600">
                        <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {user?.email}</span>
                    </div>
                </div>

                {loading ? (
                    <div className="col-span-full flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    filteredMembers.map((member) => (
                        <div key={member.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center relative group hover:shadow-md transition-all">
                            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold text-gray-600 mb-4">
                                {member.name.charAt(0).toUpperCase()}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                            <p className="text-sm text-gray-500 mb-4 capitalize">{member.role}</p>
                            <div className="w-full border-t border-gray-100 pt-4 flex justify-between text-sm text-gray-600">
                                <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {member.email}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
