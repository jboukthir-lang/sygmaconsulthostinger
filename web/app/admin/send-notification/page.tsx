'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Send,
  Users,
  User,
  Type,
  MessageSquare,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Paperclip,
  X,
  FileText,
  Mail,
  Eye,
  Info
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
}

export default function SendNotificationPage() {
  const { language } = useLanguage();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  // Form State
  const [recipientType, setRecipientType] = useState<'all' | 'specific'>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [notifType, setNotifType] = useState('system');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');

  // File Attachment State
  const [attachments, setAttachments] = useState<{ name: string, url: string, size: number, type: string }[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, user_id, email, full_name')
        .order('full_name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingFile(true);
    const file = files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `notifications/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      setAttachments(prev => [...prev, {
        name: file.name,
        url: publicUrl,
        size: file.size,
        type: file.type
      }]);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(`Erreur lors de l'upload: ${error.message || 'Erreur inconnue'}`);
    } finally {
      setUploadingFile(false);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setResult(null);

    try {
      const selectedUsersList = recipientType === 'all' ? users : users.filter(u => selectedUsers.includes(u.user_id));
      const recipientEmails = selectedUsersList.map(u => u.email);

      if (recipientEmails.length === 0) {
        throw new Error(language === 'ar' ? 'يرجى اختيار مستلم واحد على الأقل' : 'Veuillez sélectionner au moins un destinataire');
      }

      // 1. Send In-App Notifications
      const notifications = selectedUsersList.map(user => ({
        user_id: user.user_id,
        title,
        message,
        type: notifType,
        link: link || null,
        is_read: false,
        created_at: new Date().toISOString()
      }));

      const { error: notifError } = await supabase
        .from('notifications')
        .insert(notifications);

      if (notifError) throw notifError;

      // 2. Send Emails via API
      const response = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: recipientEmails,
          title,
          subject: subject || title,
          message,
          link,
          attachments: attachments.map(a => ({
            filename: a.name,
            path: a.url
          }))
        }),
      });

      if (!response.ok) throw new Error('Failed to send emails');

      setResult({
        success: true,
        message: language === 'ar' ? 'تم إرسال الإشعارات والإيميلات بنجاح' : 'Notifications et e-mails envoyés avec succès'
      });

      // Reset Form
      setTitle('');
      setSubject('');
      setMessage('');
      setLink('');
      setAttachments([]);
      if (recipientType === 'specific') setSelectedUsers([]);
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || 'Error sending notification'
      });
    } finally {
      setSending(false);
    }
  };

  const t = {
    title: language === 'ar' ? 'إرسال إشعار احترافي' : 'Envoyer une Notification Professionnelle',
    subtitle: language === 'ar' ? 'إرسال إشعارات داخل التطبيق وإيميلات مع مرفقات' : 'Envoyez des notifications in-app et des e-mails avec pièces jointes',
    recipients: language === 'ar' ? 'المستلمون' : 'Destinataires',
    allUsers: language === 'ar' ? 'جميع المستخدمين' : 'Tous les utilisateurs',
    specificUsers: language === 'ar' ? 'مستخدمين محددين' : 'Utilisateurs spécifiques',
    type: language === 'ar' ? 'نوع الإشعار' : 'Type de notification',
    notifTitle: language === 'ar' ? 'عنوان الإشعار' : 'Titre de la notification',
    emailSubject: language === 'ar' ? 'موضوع الإيميل (اختياري)' : 'Objet de l\'e-mail (optionnel)',
    messageLabel: language === 'ar' ? 'الرسالة' : 'Message',
    link: language === 'ar' ? 'رابط (اختياري)' : 'Lien (optionnel)',
    attachments: language === 'ar' ? 'المرفقات' : 'Pièces jointes',
    send: language === 'ar' ? 'إرسال الآن' : 'Envoyer maintenant',
    sending: language === 'ar' ? 'جاري الإرسال...' : 'Envoi en cours...',
    preview: language === 'ar' ? 'معاينة' : 'Aperçu'
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        <div>
          <h1 className="text-3xl font-bold text-[#001F3F] flex items-center gap-3">
            <Mail className="h-8 w-8 text-[#D4AF37]" />
            {t.title}
          </h1>
          <p className="text-gray-500 mt-2">{t.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-bold text-[#001F3F] uppercase tracking-wider flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {t.recipients}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRecipientType('all')}
                    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${recipientType === 'all'
                      ? 'border-[#001F3F] bg-[#001F3F]/5 text-[#001F3F]'
                      : 'border-gray-100 hover:border-gray-200 text-gray-500'
                      }`}
                  >
                    <Users className="h-5 w-5" />
                    <span className="font-semibold">{t.allUsers} ({users.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecipientType('specific')}
                    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${recipientType === 'specific'
                      ? 'border-[#001F3F] bg-[#001F3F]/5 text-[#001F3F]'
                      : 'border-gray-100 hover:border-gray-200 text-gray-500'
                      }`}
                  >
                    <User className="h-5 w-5" />
                    <span className="font-semibold">{t.specificUsers}</span>
                  </button>
                </div>

                {recipientType === 'specific' && (
                  <div className="p-4 bg-gray-50 rounded-xl max-h-48 overflow-y-auto border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {users.map(u => (
                      <label key={u.user_id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(u.user_id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedUsers([...selectedUsers, u.user_id]);
                            else setSelectedUsers(selectedUsers.filter(id => id !== u.user_id));
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-[#001F3F] focus:ring-[#001F3F]"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{u.full_name}</p>
                          <p className="text-xs text-gray-500 truncate">{u.email}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#001F3F] uppercase tracking-wider flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    {t.type}
                  </label>
                  <select
                    value={notifType}
                    onChange={(e) => setNotifType(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#001F3F]/20 outline-none transition-all"
                  >
                    <option value="system">🚀 System</option>
                    <option value="booking">📅 Booking</option>
                    <option value="message">💬 Message</option>
                    <option value="success">✅ Success</option>
                    <option value="warning">⚠️ Warning</option>
                    <option value="info">ℹ️ Info</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#001F3F] uppercase tracking-wider flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    {t.link}
                  </label>
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="/profile/bookings"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#001F3F]/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#001F3F] uppercase tracking-wider">
                    {t.notifTitle}
                  </label>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Mise à jour de votre dossier"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#001F3F]/20 outline-none transition-all font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#001F3F] uppercase tracking-wider text-gray-400">
                    {t.emailSubject}
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Sygma Consult : Action requise sur votre compte"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#001F3F]/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#001F3F] uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {t.messageLabel}
                </label>
                <textarea
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#001F3F]/20 outline-none transition-all resize-none"
                  placeholder="Écrivez votre message ici..."
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-[#001F3F] uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Paperclip className="h-4 w-4" />
                    {t.attachments}
                  </span>
                  <span className="text-[10px] text-gray-400">MAX 5MB</span>
                </label>

                <div className="flex flex-wrap gap-3">
                  {attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-[#001F3F]/5 px-3 py-2 rounded-lg border border-[#001F3F]/10">
                      <FileText className="h-4 w-4 text-[#001F3F]" />
                      <span className="text-sm font-medium text-[#001F3F] truncate max-w-[150px]">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(idx)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  <label className={`flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-200 rounded-lg hover:border-[#001F3F] hover:bg-gray-50 cursor-pointer transition-all ${uploadingFile ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input type="file" className="hidden" onChange={handleFileChange} />
                    {uploadingFile ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Paperclip className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-sm font-medium text-gray-500">
                      {uploadingFile ? 'Uploading...' : 'Ajouter un fichier'}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              {result && (
                <div className={`flex items-center gap-2 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                  {result.success ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                  <span className="text-sm font-medium">{result.message}</span>
                </div>
              )}
              <div className="flex-1"></div>
              <button
                type="submit"
                disabled={sending || uploadingFile}
                className="px-10 py-4 bg-[#001F3F] text-white rounded-xl font-bold flex items-center gap-3 hover:bg-[#003366] transition-all shadow-lg shadow-[#001F3F]/20 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {sending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                )}
                {sending ? t.sending : t.send}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-[#001F3F] mb-6 flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {t.preview} In-App
            </h3>

            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
              <div className="flex gap-3">
                <div className="mt-1">
                  <Info className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 truncate">
                    {title || "Titre de l'échantillon"}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-3 mt-1">
                    {message || "Le contenu de votre message apparaîtra ici..."}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-3 font-medium uppercase tracking-wider">
                    Maintenant • Sygma Consult
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#001F3F] rounded-2xl shadow-xl p-6 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-[#D4AF37]" />
              Email Style
            </h3>
            <div className="bg-white rounded-lg p-4 text-[#333]">
              <div className="border-b border-gray-100 pb-3 mb-3">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Objet</p>
                <p className="text-sm font-bold text-[#001F3F] truncate">{subject || title || "Notification Sygma Consult"}</p>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-3/4 bg-gray-100 rounded"></div>
                <div className="h-2 w-full bg-gray-100 rounded"></div>
                <div className="h-2 w-1/2 bg-gray-100 rounded"></div>
              </div>
              <div className="mt-6 flex justify-center">
                <div className="px-4 py-2 bg-[#001F3F] rounded text-[10px] font-bold text-white">BOUTON D'ACTION</div>
              </div>
            </div>
            <p className="text-[10px] text-blue-200 mt-6 text-center italic">
              Design premium Sygma Consult
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
