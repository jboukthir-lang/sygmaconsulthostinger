'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';
import { FileText, Upload, Eye, Download, Trash2, FileCheck, Loader } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  file_type: string;
  file_size: number;
  category: string;
  status: string;
  created_at: string;
}

export default function ProfileDocumentsPage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  async function fetchDocuments() {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileName = `${user.uid}/${Date.now()}_${file.name}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Save metadata to database
      const { error: dbError } = await supabase.from('documents').insert({
        user_id: user.uid,
        name: file.name,
        file_url: publicUrl,
        file_type: file.type,
        file_size: file.size,
        category: 'other',
        status: 'pending',
      });

      if (dbError) throw dbError;

      fetchDocuments();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  async function deleteDocument(id: string, fileName: string) {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([fileName]);

      if (storageError) console.error('Storage deletion error:', storageError);

      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  function getFileIcon(fileType: string) {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    return '📎';
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#001F3F]">{t('profile.myDocuments', language)}</h1>
          <p className="text-gray-600 mt-1">{t('profile.manageInfo', language)}</p>
        </div>
        <label
          htmlFor="file-upload"
          className={`flex items-center gap-2 px-4 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          {uploading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              {t('common.saving', language)}...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              {language === 'ar' ? 'رفع مستند' : 'Upload Document'}
            </>
          )}
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Supported formats: PDF, DOC, DOCX, JPG, PNG. Maximum file size: 10MB.
          Documents are analyzed using AI for automatic data extraction.
        </p>
      </div>

      {/* Documents Grid */}
      {documents.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No documents uploaded yet</p>
          <label
            htmlFor="file-upload-empty"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors cursor-pointer"
          >
            <Upload className="h-4 w-4" />
            Upload Your First Document
          </label>
          <input
            id="file-upload-empty"
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              {/* File Icon */}
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{getFileIcon(doc.file_type)}</div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${doc.status === 'analyzed'
                    ? 'bg-green-100 text-green-700'
                    : doc.status === 'processing'
                      ? 'bg-blue-100 text-blue-700'
                      : doc.status === 'failed'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                >
                  {doc.status}
                </span>
              </div>

              {/* File Info */}
              <h3 className="font-semibold text-[#001F3F] mb-2 truncate" title={doc.name}>
                {doc.name}
              </h3>
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <p className="flex items-center justify-between">
                  <span>Size:</span>
                  <span className="font-medium">{formatFileSize(doc.file_size)}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Category:</span>
                  <span className="font-medium capitalize">{doc.category}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Uploaded:</span>
                  <span className="font-medium">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="View"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </button>
                {doc.status === 'analyzed' && (
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                    title="View Analysis"
                  >
                    <FileCheck className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteDocument(doc.id, doc.name)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
