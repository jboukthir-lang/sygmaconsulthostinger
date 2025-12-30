'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Briefcase, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function ProjectsPage() {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchProjects();
        }
    }, [user]);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects', {
                headers: {
                    'x-user-id': user!.uid
                }
            });
            if (res.ok) {
                const data = await res.json();
                setProjects(data);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = projects.filter(project =>
        project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#001F3F]">Projets</h1>
                    <p className="text-gray-500 mt-1">Suivez l'avancement de vos projets clients.</p>
                </div>
                <Link
                    href="/dashboard/entreprise/projects/new"
                    className="flex items-center gap-2 px-4 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors shadow-lg shadow-blue-900/20"
                >
                    <Plus className="h-4 w-4" />
                    Nouveau Projet
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher un projet..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 bg-white">
                        <Filter className="h-4 w-4" />
                        Statut
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-500">
                        <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium text-gray-900">Aucun projet trouvé</h3>
                    </div>
                ) : (
                    filteredProjects.map((project) => (
                        <div key={project.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${project.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    project.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {project.status === 'in_progress' ? 'En cours' : project.status === 'completed' ? 'Terminé' : 'En attente'}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{project.name}</h3>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>

                            <div className="flex justify-between items-center text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Pas de date'}
                                </span>
                            </div>
                        </div>
                    ))
                )}

                <Link href="/dashboard/entreprise/projects/new" className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-[#001F3F] hover:text-[#001F3F] transition-all min-h-[250px]">
                    <Plus className="w-8 h-8 mb-2" />
                    <span className="font-medium">Créer un nouveau projet</span>
                </Link>
            </div>
        </div>
    );
}
