'use client';

import { useEffect, useState } from 'react';
import StatsCard from '@/components/admin/StatsCard';
import { Calendar, MessageSquare, Users, TrendingUp, Clock, CheckCircle, FileText } from 'lucide-react';

import Link from 'next/link';

import { useLanguage } from '@/context/LanguageContext';

interface Stats {
  totalBookings: number;
  pendingBookings: number;
  totalMessages: number;
  newMessages: number;
  totalUsers: number;
  totalPosts: number;
  publishedPosts: number;
  recentActivity: any[];
}

export default function AdminDashboard() {
  const { language, t } = useLanguage();
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    pendingBookings: 0,
    totalMessages: 0,
    newMessages: 0,
    totalUsers: 0,
    totalPosts: 0,
    publishedPosts: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      // Fetch local bookings
      let bookingsCount = 0;
      let pendingCount = 0;
      let recentBookings = [];

      try {
        const res = await fetch('/api/admin/bookings');
        const bookings = await res.json();
        if (Array.isArray(bookings)) {
          bookingsCount = bookings.length;
          pendingCount = bookings.filter((b: any) => b.status === 'pending').length;
          recentBookings = bookings.slice(0, 5);
        }
      } catch (e) {
        console.error('Failed to fetch local bookings stats', e);
      }

      // Fetch local messages
      let totalMessages = 0;
      let newMessages = 0;
      try {
        const res = await fetch('/api/admin/messages');
        const messages = await res.json();
        if (Array.isArray(messages)) {
          totalMessages = messages.length;
          newMessages = messages.filter((m: any) => m.status === 'new').length;
        }
      } catch (e) {
        console.error('Failed to fetch local messages stats', e);
      }

      // Mock other stats as we removed Supabase
      const usersCount = 0;
      const postsCount = 0;
      const publishedCount = 0;

      setStats({
        totalBookings: bookingsCount,
        pendingBookings: pendingCount,
        totalMessages,
        newMessages,
        totalUsers: usersCount,
        totalPosts: postsCount,
        publishedPosts: publishedCount,
        recentActivity: recentBookings,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t.common.status}</p>
        </div>
      </div>
    );
  }

  // Helper to safely get booking status translation
  const getBookingStatus = (status: string) => {
    const key = status as keyof typeof t.admin.bookings;
    return t.admin.bookings[key] || status;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#001F3F]">{t.admin.dashboard} <span className="text-xs font-normal text-gray-400">v1.2.0-final</span></h1>
        <p className="text-gray-600 mt-1">{t.admin.welcomeBack}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatsCard
          title={t.admin.stats.totalBookings}
          value={stats.totalBookings}
          icon={Calendar}
          trend={{ value: 12, isPositive: true }}
          subtitle={`${stats.pendingBookings} ${t.admin.stats.pending}`}
        />
        <StatsCard
          title={t.admin.stats.newMessages}
          value={stats.newMessages}
          icon={MessageSquare}
          subtitle={`${stats.totalMessages} ${t.admin.stats.total}`}
        />
        <StatsCard
          title={t.admin.stats.registeredUsers}
          value={stats.totalUsers}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title={t.admin.stats.blogPosts}
          value={stats.totalPosts}
          icon={FileText}
          subtitle={`${stats.publishedPosts} ${t.admin.stats.published}`}
        />
        <StatsCard
          title={t.admin.stats.conversionRate}
          value="64%"
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-[#001F3F] mb-4">{t.admin.recentBookings}</h2>
          <div className="space-y-4">
            {stats.recentActivity.length === 0 ? (
              <p className="text-gray-400 text-sm">{t.admin.noBookingsYet}</p>
            ) : (
              stats.recentActivity.map((booking: any) => (
                <div key={booking.id} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-[#001F3F]" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{booking.name}</p>
                      <p className="text-xs text-gray-500">{booking.topic}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{new Date(booking.date).toLocaleDateString()}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {getBookingStatus(booking.status)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-[#001F3F] mb-4">{t.admin.quickActions.title}</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-[#001F3F]" />
                <span className="font-medium text-[#001F3F]">{t.admin.quickActions.confirmPending}</span>
              </div>
              <span className="text-sm text-gray-600">{stats.pendingBookings}</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-green-700" />
                <span className="font-medium text-green-700">{t.admin.quickActions.replyMessages}</span>
              </div>
              <span className="text-sm text-gray-600">{stats.newMessages}</span>
            </button>
            <Link href="/admin/posts" className="w-full flex items-center justify-between p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-yellow-700" />
                <span className="font-medium text-yellow-700">{t.admin.quickActions.managePosts}</span>
              </div>
              <span className="text-sm text-gray-600">{stats.totalPosts}</span>
            </Link>
            <button className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-purple-700" />
                <span className="font-medium text-purple-700">{t.admin.quickActions.todaySchedule}</span>
              </div>
              <span className="text-sm text-gray-600">{t.common.view}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-[#001F3F] mb-4">{t.admin.monthlyOverview}</h2>
        <div className="h-64 flex items-center justify-center text-gray-400">
          <p>{t.admin.chartPlaceholder}</p>
        </div>
      </div>
    </div>
  );
}
