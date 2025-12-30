'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Mail, Phone, MapPin } from 'lucide-react';

export default function ClientsPage() {
    const [clients, setClients] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
                    <p className="text-gray-600 mt-1">Gérez vos clients</p>
                </div>
                <Link
                    href="/dashboard/entreprise/clients/new"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus className="h-5 w-5" />
                    Nouveau Client
                </Link>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher un client..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Clients List */}
            {clients.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
                    <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun client</h3>
                        <p className="text-gray-600 mb-6">Commencez par ajouter votre premier client</p>
                        <Link
                            href="/dashboard/entreprise/clients/new"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <Plus className="h-5 w-5" />
                            Ajouter un client
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.map((client) => (
                        <div key={client.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">{client.name}</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                {client.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        <span>{client.email}</span>
                                    </div>
                                )}
                                {client.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        <span>{client.phone}</span>
                                    </div>
                                )}
                                {client.city && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
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
