'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, UserPlus, Shield, Trash2, Search, Eye, Bell, Calendar, MapPin } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';
import Image from 'next/image';

interface User {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  phone: string;
  company: string;
  country: string;
  city: string;
  address: string;
  photo_url: string;
  created_at: string;
  bookings_count?: number;
  notifications_count?: number;
}

interface UserNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  role: string;
  created_at: string;
}

export default function AdminUsersPage() {
  const { language } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userNotifications, setUserNotifications] = useState<UserNotification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchAdminUsers();

    // Real-time subscriptions
    const usersChannel = supabase
      .channel('admin_users_list')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles',
        },
        () => {
          fetchUsers();
        }
      )
      .subscribe();

    const adminChannel = supabase
      .channel('admin_users_admin')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'admin_users',
        },
        () => {
          fetchAdminUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(usersChannel);
      supabase.removeChannel(adminChannel);
    };
  }, []);

  async function fetchUsers() {
    try {
      console.log('🔍 Fetching users from user_profiles...');
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('📊 User profiles data:', data);
      console.log('❌ User profiles error:', error);

      if (error) {
        console.error('❌ RLS Error or Permission Denied:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn('⚠️ No users found in database!');
        setUsers([]);
        return;
      }

      console.log(`✅ Found ${data.length} users, fetching counts...`);

      // Get bookings and notifications count for each user
      const usersWithCounts = await Promise.all(
        (data || []).map(async (user) => {
          const { count: bookingsCount } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.user_id);

          const { count: notificationsCount } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.user_id)
            .eq('is_read', false);

          return {
            ...user,
            bookings_count: bookingsCount || 0,
            notifications_count: notificationsCount || 0,
          };
        })
      );

      console.log('✅ Users with counts:', usersWithCounts);
      setUsers(usersWithCounts);
    } catch (error) {
      console.error('❌❌❌ Error fetching users:', error);
      alert('Error fetching users: ' + (error as any).message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserNotifications(userId: string) {
    setLoadingNotifications(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setUserNotifications(data || []);
    } catch (error) {
      console.error('Error fetching user notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  }

  function openUserModal(user: User) {
    setSelectedUser(user);
    fetchUserNotifications(user.user_id);
  }

  async function fetchAdminUsers() {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdminUsers(data || []);
    } catch (error) {
      console.error('Error fetching admin users:', error);
    }
  }

  async function addAdminUser(userId: string, email: string, role: string) {
    try {
      const { error } = await supabase.from('admin_users').insert({
        user_id: userId,
        email: email,
        role: role,
        permissions: role === 'super_admin' ? { all: true } : { bookings: true, contacts: true },
      });

      if (error) throw error;

      fetchAdminUsers();
      alert('Admin user added successfully!');
    } catch (error) {
      console.error('Error adding admin user:', error);
      alert('Failed to add admin user');
    }
  }

  async function removeAdminUser(id: string) {
    if (!confirm(t('admin.removeAdminPrivileges', language))) return;

    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchAdminUsers();
      alert(t('admin.adminPrivilegesRemoved', language));
    } catch (error) {
      console.error('Error removing admin user:', error);
      alert(t('admin.failedToRemoveAdmin', language));
    }
  }

  const filteredUsers = users.filter((user) =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isUserAdmin = (userId: string) => {
    return adminUsers.some(admin => admin.user_id === userId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('admin.loadingUsers', language)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#001F3F]">{t('admin.userManagement', language)}</h1>
          <p className="text-gray-600 mt-1">{t('admin.manageUsersAndPrivileges', language)}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title={t('admin.totalUsers', language)}
          value={users.length.toString()}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title={t('admin.adminUsers', language)}
          value={adminUsers.length.toString()}
          icon={Shield}
          subtitle={`${adminUsers.filter(a => a.role === 'super_admin').length} ${t('admin.superAdmins', language)}`}
        />
        <StatsCard
          title={t('admin.newThisMonth', language)}
          value={users.filter(u => {
            const created = new Date(u.created_at);
            const now = new Date();
            return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
          }).length.toString()}
          icon={UserPlus}
        />
      </div>

      {/* Admin Users Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-[#001F3F] mb-4">{t('admin.adminUsers', language)}</h2>
        <div className="space-y-3">
          {adminUsers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">{t('admin.noAdminUsersFound', language)}</p>
          ) : (
            adminUsers.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-[#D4AF37]" />
                  <div>
                    <p className="font-semibold text-gray-900">{admin.email}</p>
                    <p className="text-sm text-gray-500">
                      {t('users.role', language)}: <span className="font-medium capitalize">{admin.role.replace('_', ' ')}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeAdminUser(admin.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* All Users Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#001F3F]">{t('admin.allUsers', language)}</h2>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('admin.searchByName', language)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Photo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('users.user', language)}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.contact', language)}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Réservations</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notifications</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('users.role', language)}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    {t('admin.noUsersFound', language)}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {user.photo_url ? (
                        <Image
                          src={user.photo_url}
                          alt={user.full_name || 'User'}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#001F3F] flex items-center justify-center text-white font-semibold">
                          {(user.full_name || user.email)?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{user.full_name || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.phone || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.city || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                        <Calendar className="h-3 w-3" />
                        {user.bookings_count || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-semibold">
                        <Bell className="h-3 w-3" />
                        {user.notifications_count || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {isUserAdmin(user.user_id) ? (
                        <span className="px-2 py-1 bg-[#D4AF37] text-white text-xs font-semibold rounded-full">
                          {t('users.admin', language)}
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full">
                          {t('users.user', language)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openUserModal(user)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-4xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#001F3F]">Détails de l'utilisateur</h2>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setUserNotifications([]);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* User Info Card */}
              <div className="flex items-start gap-6 bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                {selectedUser.photo_url ? (
                  <Image
                    src={selectedUser.photo_url}
                    alt={selectedUser.full_name || 'User'}
                    width={100}
                    height={100}
                    className="rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#001F3F] flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                    {(selectedUser.full_name || selectedUser.email)?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {selectedUser.full_name || 'N/A'}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="p-2 bg-white rounded-lg">
                        <Users className="h-4 w-4 text-[#001F3F]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium">{selectedUser.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="p-2 bg-white rounded-lg">
                        <Shield className="h-4 w-4 text-[#001F3F]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Téléphone</p>
                        <p className="text-sm font-medium">{selectedUser.phone || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="p-2 bg-white rounded-lg">
                        <MapPin className="h-4 w-4 text-[#001F3F]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Ville</p>
                        <p className="text-sm font-medium">{selectedUser.city || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="p-2 bg-white rounded-lg">
                        <Calendar className="h-4 w-4 text-[#001F3F]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Inscrit le</p>
                        <p className="text-sm font-medium">
                          {new Date(selectedUser.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                  {selectedUser.address && (
                    <div className="mt-4 p-3 bg-white rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Adresse complète</p>
                      <p className="text-sm text-gray-700">{selectedUser.address}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-blue-500 rounded-lg">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">Réservations</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {selectedUser.bookings_count || 0}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-blue-700">Total des rendez-vous</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-orange-500 rounded-lg">
                      <Bell className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-orange-900">Notifications</p>
                      <p className="text-3xl font-bold text-orange-600">
                        {userNotifications.filter(n => !n.is_read).length}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-orange-700">Non lues sur {userNotifications.length}</p>
                </div>
              </div>

              {/* Notifications List */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-[#001F3F]" />
                  Notifications de l'utilisateur
                </h3>
                {loadingNotifications ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-500 mt-4">Chargement des notifications...</p>
                  </div>
                ) : userNotifications.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Bell className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Aucune notification</p>
                    <p className="text-gray-400 text-sm mt-1">Cet utilisateur n'a pas encore de notifications</p>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto space-y-3">
                    {userNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border-2 transition-all ${!notification.is_read
                            ? 'bg-blue-50 border-blue-300 shadow-sm'
                            : 'bg-white border-gray-200'
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 ${notification.type === 'success'
                                ? 'bg-green-500'
                                : notification.type === 'error'
                                  ? 'bg-red-500'
                                  : notification.type === 'warning'
                                    ? 'bg-yellow-500'
                                    : 'bg-blue-500'
                              }`}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-gray-900">
                                {notification.title}
                              </span>
                              {!notification.is_read && (
                                <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-medium">
                                  Nouveau
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-4 mt-3">
                              <p className="text-xs text-gray-400 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(notification.created_at).toLocaleDateString('fr-FR')}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(notification.created_at).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
