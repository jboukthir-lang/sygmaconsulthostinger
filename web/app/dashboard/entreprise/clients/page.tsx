'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ClientsPage() {
    const { user } = useAuth();
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user) {
            fetchClients();
        }
    }, [user]);

    const fetchClients = async () => {
        try {
            const response = await fetch('/api/clients', {
                headers: {
                    'x-user-id': user?.uid || ''
                }
            });
            if (response.ok) {
                const data = await response.json();
                setClients(data);
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredClients = clients.filter(client =>
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Chargement des clients...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
                    <p className="text-gray-600 mt-1">Gérez vos clients</p>
                </div>
                <Link
                    href="/dashboard/entreprise/clients/new"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Nouveau Client
                </Link>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher un client (nom, email)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
            </div>

            {/* Clients List */}
            {clients.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                    <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="h-8 w-8 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun client</h3>
                        <p className="text-gray-600 mb-6">Commencez par ajouter votre premier client</p>
                        <Link
                            href="/dashboard/entreprise/clients/new"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                            Ajouter un client
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClients.map((client) => (
                        <div key={client.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg uppercase">
                                    {client.name.substring(0, 2)}
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">{client.name}</h3>

                            <div className="space-y-3 text-sm text-gray-600">
                                {client.email && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-gray-50 rounded-md">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <span className="truncate">{client.email}</span>
                                    </div>
                                )}
                                {client.phone && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-gray-50 rounded-md">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <span>{client.phone}</span>
                                    </div>
                                )}
                                {client.city && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-gray-50 rounded-md">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <span>{client.city}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
