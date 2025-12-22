'use client';

import { useEffect, useState } from 'react';
import StatsCard from '@/components/admin/StatsCard';
import { Calendar, MessageSquare, Users, TrendingUp, Clock, CheckCircle, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

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
      // Fetch bookings count
      const { count: bookingsCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      const { count: pendingCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Fetch contacts count
      const { count: contactsCount } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true });

      const { count: newContactsCount } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new');

      // Fetch user profiles count
      const { count: usersCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch posts count
      const { count: postsCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true });

      const { count: publishedCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('published', true);

      // Fetch recent bookings
      const { data: recentBookings } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalBookings: bookingsCount || 0,
        pendingBookings: pendingCount || 0,
        totalMessages: contactsCount || 0,
        newMessages: newContactsCount || 0,
        totalUsers: usersCount || 0,
        totalPosts: postsCount || 0,
        publishedPosts: publishedCount || 0,
        recentActivity: recentBookings || [],
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
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#001F3F]">Dashboard <span className="text-xs font-normal text-gray-400">v1.2.0-final</span></h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatsCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={Calendar}
          trend={{ value: 12, isPositive: true }}
          subtitle={`${stats.pendingBookings} pending`}
        />
        <StatsCard
          title="New Messages"
          value={stats.newMessages}
          icon={MessageSquare}
          subtitle={`${stats.totalMessages} total`}
        />
        <StatsCard
          title="Registered Users"
          value={stats.totalUsers}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Blog Posts"
          value={stats.totalPosts}
          icon={FileText}
          subtitle={`${stats.publishedPosts} published`}
        />
        <StatsCard
          title="Conversion Rate"
          value="64%"
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-[#001F3F] mb-4">Recent Bookings</h2>
          <div className="space-y-4">
            {stats.recentActivity.length === 0 ? (
              <p className="text-gray-400 text-sm">No bookings yet</p>
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
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-[#001F3F] mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-[#001F3F]" />
                <span className="font-medium text-[#001F3F]">Confirm Pending Bookings</span>
              </div>
              <span className="text-sm text-gray-600">{stats.pendingBookings}</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-green-700" />
                <span className="font-medium text-green-700">Reply to Messages</span>
              </div>
              <span className="text-sm text-gray-600">{stats.newMessages}</span>
            </button>
            <Link href="/admin/posts" className="w-full flex items-center justify-between p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-yellow-700" />
                <span className="font-medium text-yellow-700">Manage Blog Posts</span>
              </div>
              <span className="text-sm text-gray-600">{stats.totalPosts}</span>
            </Link>
            <button className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-purple-700" />
                <span className="font-medium text-purple-700">Today's Schedule</span>
              </div>
              <span className="text-sm text-gray-600">View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-[#001F3F] mb-4">Monthly Overview</h2>
        <div className="h-64 flex items-center justify-center text-gray-400">
          <p>Chart will be integrated here (Recharts)</p>
        </div>
      </div>
    </div>
  );
}
