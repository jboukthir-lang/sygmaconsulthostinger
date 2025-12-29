'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import {
  Eye,
  CheckCheck,
  Search,
  LayoutList,
  Kanban,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  Building2,
  DollarSign
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'contacted' | 'proposal' | 'negotiation' | 'won' | 'lost';
  created_at: string;
  company_name?: string;
  phone?: string;
  estimated_value?: number;
  priority?: 'low' | 'medium' | 'high';
}

export default function AdminContactsPage() {
  const { language, t } = useLanguage();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban'); // Default to Kanban for CRM feel
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const CRM_STAGES = [
    { id: 'new', label: t.admin.messagesView.kanban.new, color: 'bg-blue-100 text-blue-800' },
    { id: 'contacted', label: t.admin.messagesView.kanban.contacted, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'proposal', label: t.admin.messagesView.kanban.proposal, color: 'bg-purple-100 text-purple-800' },
    { id: 'negotiation', label: t.admin.messagesView.kanban.negotiation, color: 'bg-orange-100 text-orange-800' },
    { id: 'won', label: t.admin.messagesView.kanban.won, color: 'bg-green-100 text-green-800' },
    { id: 'lost', label: t.admin.messagesView.kanban.lost, color: 'bg-gray-100 text-gray-800' }
  ];

  useEffect(() => {
    fetchContacts();

    const channel = supabase
      .channel('admin_contacts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, () => {
        fetchContacts();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
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

  async function updateStatus(id: string, newStatus: string) {
    try {
      // Optimistic update
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status: newStatus as any } : c));

      const { error } = await supabase
        .from('contacts')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        throw error;
        fetchContacts(); // Revert on error
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStageContacts = (stageId: string) => {
    // Map 'read' and 'replied' to 'contacted' visually if needed, or keep distinct
    if (stageId === 'new') return filteredContacts.filter(c => c.status === 'new');
    if (stageId === 'contacted') return filteredContacts.filter(c => ['contacted', 'read', 'replied'].includes(c.status));
    return filteredContacts.filter(c => c.status === stageId);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-[#001F3F]">{t.admin.messagesView.title}</h1>
          <p className="text-gray-600 mt-1">{t.admin.messagesView.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="bg-gray-100 p-1 rounded-lg flex items-center">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#001F3F]' : 'text-gray-500 hover:text-gray-700'}`}
              title={t.admin.messagesView.view.list}
            >
              <LayoutList className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-md transition-all ${viewMode === 'kanban' ? 'bg-white shadow-sm text-[#001F3F]' : 'text-gray-500 hover:text-gray-700'}`}
              title={t.admin.messagesView.view.kanban}
            >
              <Kanban className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={t.admin.messagesView.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
          />
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{t.admin.messagesView.from}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{t.common.subject}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{t.common.status}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{t.admin.messagesView.received}</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">{t.common.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#001F3F]/10 flex items-center justify-center text-[#001F3F] font-bold text-xs">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                        <p className="text-xs text-gray-500">{contact.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{contact.subject}</td>
                  <td className="px-6 py-4">
                    <select
                      value={contact.status}
                      onChange={(e) => updateStatus(contact.id, e.target.value)}
                      className="px-2 py-1 rounded-full text-xs font-medium border-0 bg-gray-100 cursor-pointer focus:ring-2 focus:ring-[#001F3F]/20"
                    >
                      {CRM_STAGES.map(stage => (
                        <option key={stage.id} value={stage.id}>{stage.label}</option>
                      ))}
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setSelectedContact(contact)} className="text-gray-400 hover:text-[#001F3F]">
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* KANBAN VIEW */
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
          <div className="flex gap-4 h-full min-w-[1200px] px-1">
            {CRM_STAGES.map((stage) => (
              <div key={stage.id} className="w-80 flex flex-col h-full bg-gray-50/50 rounded-xl border border-gray-200/60">
                {/* Column Header */}
                <div className={`p-3 border-b border-gray-200 flex items-center justify-between rounded-t-xl ${stage.color} bg-opacity-20`}>
                  <h3 className="font-semibold text-sm">{stage.label}</h3>
                  <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-medium">
                    {getStageContacts(stage.id).length}
                  </span>
                </div>

                {/* Column Body */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {getStageContacts(stage.id).map((contact) => (
                    <div
                      key={contact.id}
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-move group"
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('contactId', contact.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold text-gray-500 px-2 py-0.5 bg-gray-100 rounded">
                          {new Date(contact.created_at).toLocaleDateString()}
                        </span>
                        <button onClick={() => setSelectedContact(contact)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-[#001F3F]">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>

                      <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">{contact.subject}</h4>

                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                        <UserIcon name={contact.name} />
                        <span className="truncate">{contact.name}</span>
                      </div>

                      {contact.estimated_value && (
                        <div className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded w-fit mb-2">
                          <DollarSign className="h-3 w-3" />
                          {contact.estimated_value.toLocaleString()}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-2">
                        <div className="flex gap-2">
                          {contact.phone && <Phone className="h-3 w-3 text-gray-400" />}
                          <Mail className="h-3 w-3 text-gray-400" />
                        </div>
                        {/* Quick Move Buttons (since no drag-drop lib here) */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {stage.id !== 'won' && (
                            <button onClick={() => updateStatus(contact.id, 'won')} className="p-1 hover:bg-green-100 text-green-600 rounded" title="Mark Won">
                              <CheckCheck className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Drop Zone Overlay (Conceptual for native DnD) */}
                <div
                  className="h-10 border-t border-gray-100 bg-gray-50/50 flex items-center justify-center text-xs text-gray-400 italic"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const contactId = e.dataTransfer.getData('contactId');
                    if (contactId) updateStatus(contactId, stage.id);
                  }}
                >
                  Drop here to move
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-[#001F3F]">{selectedContact.subject}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${CRM_STAGES.find(s => s.id === selectedContact.status)?.color || 'bg-gray-100 text-gray-600'
                    }`}>
                    {selectedContact.status}
                  </span>
                  <span className="text-sm text-gray-500">• {new Date(selectedContact.created_at).toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Info Card */}
              <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#001F3F] text-white flex items-center justify-center font-bold">
                    {selectedContact.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedContact.name}</h3>
                    <p className="text-sm text-gray-500">{selectedContact.email}</p>
                  </div>
                </div>
                {selectedContact.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" /> {selectedContact.phone}
                  </div>
                )}
                {selectedContact.company_name && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="h-4 w-4" /> {selectedContact.company_name}
                  </div>
                )}
              </div>

              {/* Message Body */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{t.admin.messagesView.details}</h4>
                <div className="p-4 bg-white border border-gray-200 rounded-xl text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {selectedContact.message}
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
                >
                  <Mail className="h-4 w-4" />
                  {t.admin.messagesView.replyViaEmail}
                </a>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedContact.status}
                    onChange={(e) => updateStatus(selectedContact.id, e.target.value)}
                    className="flex-1 px-4 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] font-medium"
                  >
                    {CRM_STAGES.map(stage => (
                      <option key={stage.id} value={stage.id} className="text-black">{stage.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UserIcon({ name }: { name: string }) {
  return (
    <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-600">
      {name.charAt(0)}
    </div>
  );
}
