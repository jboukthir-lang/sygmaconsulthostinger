'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import { supabase } from '@/lib/supabase';
import { Eye, Mail, CheckCheck } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();

    // Real-time subscription
    const channel = supabase
      .channel('admin_contacts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contacts',
        },
        () => {
          fetchContacts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchContacts() {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id: string) {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ status: 'read' })
        .eq('id', id);

      if (error) throw error;
      fetchContacts();
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  }

  const columns = [
    {
      header: 'Name',
      accessor: 'name' as keyof Contact,
      sortable: true,
    },
    {
      header: 'Email',
      accessor: 'email' as keyof Contact,
      sortable: true,
    },
    {
      header: 'Subject',
      accessor: 'subject' as keyof Contact,
    },
    {
      header: 'Date',
      accessor: (row: Contact) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      header: 'Status',
      accessor: (row: Contact) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.status === 'new'
              ? 'bg-blue-100 text-blue-700'
              : row.status === 'read'
              ? 'bg-gray-100 text-gray-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (row: Contact) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedContact(row);
              if (row.status === 'new') markAsRead(row.id);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="View"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </button>
          {row.status === 'new' && (
            <button
              onClick={() => markAsRead(row.id)}
              className="p-2 hover:bg-green-50 rounded-lg transition-colors"
              title="Mark as Read"
            >
              <CheckCheck className="h-4 w-4 text-green-600" />
            </button>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#001F3F]">Messages</h1>
          <p className="text-gray-600 mt-1">Manage contact form submissions</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
          <Mail className="h-5 w-5 text-[#001F3F]" />
          <span className="font-semibold text-[#001F3F]">
            {contacts.filter((c) => c.status === 'new').length} New
          </span>
        </div>
      </div>

      <DataTable data={contacts} columns={columns} searchable searchPlaceholder="Search messages..." />

      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#001F3F]">Message Details</h2>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">From</p>
                <p className="font-semibold">{selectedContact.name}</p>
                <p className="text-sm text-gray-500">{selectedContact.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Subject</p>
                <p className="font-semibold">{selectedContact.subject}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Message</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Received</p>
                <p className="text-sm">{new Date(selectedContact.created_at).toLocaleString()}</p>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => window.location.href = `mailto:${selectedContact.email}`}
                  className="flex-1 px-4 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors"
                >
                  Reply via Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
