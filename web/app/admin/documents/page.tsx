'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FileText, Download, Trash2, Eye, Search, Filter, User, Calendar, File, Loader2 } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';

interface Document {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  uploaded_at: string;
  user_profile?: {
    full_name: string;
    email: string;
  };
}

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'pdf' | 'image' | 'doc'>('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchDocuments();

    // Real-time subscription
    const channel = supabase
      .channel('admin_documents')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents',
        },
        () => {
          fetchDocuments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchDocuments() {
    try {
      const { data: docs, error } = await supabase
        .from('documents')
        .select(`
          *,
          user_profiles!documents_user_id_fkey (
            full_name,
            email
          )
        `)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;

      // Transform data to include user_profile at top level
      const transformedDocs = (docs || []).map(doc => ({
        ...doc,
        user_profile: Array.isArray(doc.user_profiles) ? doc.user_profiles[0] : doc.user_profiles
      }));

      setDocuments(transformedDocs as any);
    } catch (error: any) {
      console.error('Error fetching documents:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        error
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, fileName: string) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${fileName}"?`)) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([fileName]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      fetchDocuments();
      alert('Document supprimé avec succès');
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Erreur lors de la suppression du document');
    }
  }

  async function handleDownload(url: string, fileName: string) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Erreur lors du téléchargement');
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch =
      doc.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.user_profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.user_profile?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesType = true;
    if (filterType !== 'all') {
      if (filterType === 'pdf') {
        matchesType = doc.file_type === 'application/pdf';
      } else if (filterType === 'image') {
        matchesType = doc.file_type.startsWith('image/');
      } else if (filterType === 'doc') {
        matchesType = doc.file_type.includes('document') || doc.file_type.includes('word');
      }
    }

    return matchesSearch && matchesType;
  });

  const stats = {
    total: documents.length,
    pdf: documents.filter(d => d.file_type === 'application/pdf').length,
    images: documents.filter(d => d.file_type.startsWith('image/')).length,
    totalSize: documents.reduce((sum, d) => sum + (d.file_size || 0), 0),
  };

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  function getFileIcon(fileType: string) {
    if (fileType === 'application/pdf') return '📄';
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('sheet') || fileType.includes('excel')) return '📊';
    return '📎';
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#001F3F] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#001F3F]">Documents</h1>
        <p className="text-gray-600 mt-1">Gérer tous les documents uploadés</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total documents"
          value={stats.total.toString()}
          icon={FileText}
        />
        <StatsCard
          title="Fichiers PDF"
          value={stats.pdf.toString()}
          icon={File}
        />
        <StatsCard
          title="Images"
          value={stats.images.toString()}
          icon={File}
        />
        <StatsCard
          title="Taille totale"
          value={formatFileSize(stats.totalSize)}
          icon={FileText}
        />
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom de fichier ou utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
            />
          </div>

          {/* Type Filter */}
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'Tous' },
              { value: 'pdf', label: 'PDF' },
              { value: 'image', label: 'Images' },
              { value: 'doc', label: 'Documents' },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterType(filter.value as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === filter.value
                    ? 'bg-[#001F3F] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taille</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Aucun document trouvé
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getFileIcon(doc.file_type)}</div>
                        <div>
                          <p className="font-semibold text-gray-900 truncate max-w-xs">
                            {doc.file_name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#001F3F] text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {doc.user_profile?.full_name?.[0] || doc.user_profile?.email?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {doc.user_profile?.full_name || 'Inconnu'}
                          </p>
                          <p className="text-xs text-gray-500">{doc.user_profile?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                        {doc.file_type.split('/')[1]?.toUpperCase() || 'FILE'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{formatFileSize(doc.file_size)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(doc.uploaded_at).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedDocument(doc);
                            setShowModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Voir"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(doc.file_url, doc.file_name)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Télécharger"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id, doc.file_name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {showModal && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#001F3F]">Détails du document</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Document Info */}
              <div className="flex items-center gap-4">
                <div className="text-6xl">{getFileIcon(selectedDocument.file_type)}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {selectedDocument.file_name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{formatFileSize(selectedDocument.file_size)}</span>
                    <span>•</span>
                    <span>{selectedDocument.file_type}</span>
                    <span>•</span>
                    <span>{new Date(selectedDocument.uploaded_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Uploadé par</h4>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#001F3F] text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {selectedDocument.user_profile?.full_name?.[0] || selectedDocument.user_profile?.email?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {selectedDocument.user_profile?.full_name || 'Utilisateur inconnu'}
                    </p>
                    <p className="text-sm text-gray-600">{selectedDocument.user_profile?.email}</p>
                  </div>
                </div>
              </div>

              {/* Preview */}
              {selectedDocument.file_type.startsWith('image/') && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Aperçu</h4>
                  <img
                    src={selectedDocument.file_url}
                    alt={selectedDocument.file_name}
                    className="w-full rounded-lg border border-gray-200"
                  />
                </div>
              )}

              {selectedDocument.file_type === 'application/pdf' && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Aperçu PDF</h4>
                  <iframe
                    src={selectedDocument.file_url}
                    className="w-full h-96 rounded-lg border border-gray-200"
                    title="PDF Preview"
                  />
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={() => handleDownload(selectedDocument.file_url, selectedDocument.file_name)}
                className="px-6 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Télécharger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
