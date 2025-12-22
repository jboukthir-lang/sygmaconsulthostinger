'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Bell, Search, Loader2, ShieldAlert, X, Calendar, MessageSquare, Info, Filter } from 'lucide-react';
import Link from 'next/link';

interface AdminNotification {
  id: string;
  user_id: string | null;
  title: string;
  message: string;
  type: 'booking' | 'reminder' | 'message' | 'system' | 'success' | 'error' | 'info' | 'warning';
  is_read: boolean;
  link: string | null;
  created_at: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [adminRole, setAdminRole] = useState<string>('');

  // Notification State
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/admin');
    } else if (user) {
      checkAdminStatus();
      fetchNotifications();

      // Realtime subscription for notifications
      const channel = supabase
        .channel('admin_notifications')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications' },
          (payload) => {
            console.log('🔔 New notification received:', payload);
            const newNotif = payload.new as AdminNotification;
            setNotifications(prev => [newNotif, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Show browser notification if permitted
            if (Notification.permission === 'granted') {
              new Notification(newNotif.title, { body: newNotif.message });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, loading, router]);

  async function checkAdminStatus() {
    if (!user) return;

    try {
      console.log('🔐 Checking admin status for user:', user.uid, user.email);

      const { data, error } = await supabase
        .from('admin_users')
        .select('role, permissions')
        .eq('user_id', user.uid)
        .single();

      console.log('🛡️ Admin check result:', { data, error });

      if (error || !data) {
        console.warn('❌ User is NOT admin:', error?.message || 'No data found');
        setIsAdmin(false);
      } else {
        console.log('✅ User IS admin:', data.role);
        setIsAdmin(true);
        setAdminRole(data.role);
      }
    } catch (error) {
      console.error('❌ Error checking admin status:', error);
      setIsAdmin(false);
    }
  }

  async function fetchNotifications() {
    setNotifLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setNotifLoading(false);
    }
  }

  async function markAsRead(id: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  async function markAllAsRead() {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'message': return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'system': return <Filter className="h-4 w-4 text-purple-500" />;
      case 'warning': return <ShieldAlert className="h-4 w-4 text-orange-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-[#001F3F] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Access Denied Screen
  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-[#001F3F] mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              You don't have admin privileges to access this area. Please contact your administrator.
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Search Bar - Hidden on mobile */}
            <div className="relative hidden md:block md:w-64 lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
              />
            </div>

            {/* Mobile: Just show Sygma title */}
            <div className="md:hidden flex-1">
              <h2 className="text-lg font-bold text-[#001F3F]">SYGMA <span className="text-[#D4AF37]">ADMIN</span></h2>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowNotifications(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden">
                      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <h3 className="font-bold text-[#001F3F]">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Tout marquer comme lu
                          </button>
                        )}
                      </div>

                      <div className="max-h-[400px] overflow-y-auto">
                        {notifLoading && notifications.length === 0 ? (
                          <div className="p-8 text-center">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-300 mx-auto" />
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-500 text-sm">
                            Aucune notification
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => {
                                if (n.link) router.push(n.link);
                                markAsRead(n.id);
                                setShowNotifications(false);
                              }}
                              className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors relative ${!n.is_read ? 'bg-blue-50/30' : ''}`}
                            >
                              {!n.is_read && (
                                <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-full"></div>
                              )}
                              <div className="flex gap-3">
                                <div className="mt-1 flex-shrink-0">
                                  {getNotifIcon(n.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm ${!n.is_read ? 'font-bold' : 'font-medium'} text-gray-900 truncate`}>
                                    {n.title}
                                  </p>
                                  <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">
                                    {n.message}
                                  </p>
                                  <p className="text-[10px] text-gray-400 mt-2">
                                    {new Date(n.created_at).toLocaleDateString()} {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                        <button className="text-sm font-medium text-[#001F3F] hover:underline">
                          Voir tout l'historique
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Admin Profile */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Hide text on mobile, show only avatar */}
                <div className="hidden md:block text-right">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-700 truncate max-w-[120px] lg:max-w-none">{user.displayName || 'Admin User'}</p>
                    {adminRole && (
                      <span className="hidden lg:inline px-2 py-0.5 bg-[#D4AF37] text-white text-xs font-semibold rounded-full uppercase whitespace-nowrap">
                        {adminRole === 'super_admin' ? 'Super Admin' : adminRole}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#001F3F] text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {user.displayName?.[0] || user.email?.[0] || 'A'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
