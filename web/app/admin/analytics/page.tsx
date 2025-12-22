'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  TrendingUp, TrendingDown, Users, Calendar,
  MessageSquare, DollarSign, Activity, Target,
  Briefcase, Clock, CheckCircle, XCircle
} from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';

interface AnalyticsData {
  users: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    rejected: number;
    thisMonth: number;
    conversionRate: number;
  };
  consultations: {
    total: number;
    scheduled: number;
    inProgress: number;
    completed: number;
    revenue: number;
  };
  messages: {
    total: number;
    new: number;
    responseRate: number;
    avgResponseTime: number;
  };
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    users: { total: 0, thisMonth: 0, lastMonth: 0, growth: 0 },
    bookings: { total: 0, pending: 0, confirmed: 0, rejected: 0, thisMonth: 0, conversionRate: 0 },
    consultations: { total: 0, scheduled: 0, inProgress: 0, completed: 0, revenue: 0 },
    messages: { total: 0, new: 0, responseRate: 0, avgResponseTime: 0 },
  });
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  async function fetchAnalytics() {
    setLoading(true);
    try {
      // Fetch users data
      const { data: users } = await supabase
        .from('user_profiles')
        .select('created_at');

      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      const usersThisMonth = (users || []).filter(u =>
        new Date(u.created_at) >= thisMonthStart
      ).length;

      const usersLastMonth = (users || []).filter(u =>
        new Date(u.created_at) >= lastMonthStart &&
        new Date(u.created_at) <= lastMonthEnd
      ).length;

      const userGrowth = usersLastMonth > 0
        ? ((usersThisMonth - usersLastMonth) / usersLastMonth) * 100
        : 0;

      // Fetch bookings data
      const { data: bookings } = await supabase
        .from('bookings')
        .select('status, created_at');

      const bookingsThisMonth = (bookings || []).filter(b =>
        new Date(b.created_at) >= thisMonthStart
      ).length;

      const confirmedBookings = (bookings || []).filter(b => b.status === 'confirmed').length;
      const conversionRate = bookings && bookings.length > 0
        ? (confirmedBookings / bookings.length) * 100
        : 0;

      // Fetch consultations data (from bookings as proxy)
      const consultationsRevenue = confirmedBookings * 150; // Using already calculated confirmedBookings

      // Fetch messages data
      const { data: messages } = await supabase
        .from('contacts')
        .select('status, created_at');

      const newMessages = (messages || []).filter(m => m.status === 'new').length;
      const respondedMessages = (messages || []).filter(m => m.status === 'responded').length;
      const responseRate = messages && messages.length > 0
        ? (respondedMessages / messages.length) * 100
        : 0;

      setAnalytics({
        users: {
          total: users?.length || 0,
          thisMonth: usersThisMonth,
          lastMonth: usersLastMonth,
          growth: Math.round(userGrowth),
        },
        bookings: {
          total: bookings?.length || 0,
          pending: bookings?.filter(b => b.status === 'pending').length || 0,
          confirmed: confirmedBookings,
          rejected: bookings?.filter(b => b.status === 'rejected').length || 0,
          thisMonth: bookingsThisMonth,
          conversionRate: Math.round(conversionRate),
        },
        consultations: {
          total: bookings?.filter(b => b.status === 'confirmed').length || 0,
          scheduled: bookings?.filter(b => b.status === 'pending').length || 0,
          inProgress: 0,
          completed: confirmedBookings,
          revenue: consultationsRevenue,
        },
        messages: {
          total: messages?.length || 0,
          new: newMessages,
          responseRate: Math.round(responseRate),
          avgResponseTime: 2.5, // Mock data
        },
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des analyses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#001F3F]">Analytique & Rapports</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble des performances</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {[
            { value: '7d', label: '7 jours' },
            { value: '30d', label: '30 jours' },
            { value: '90d', label: '90 jours' },
            { value: 'all', label: 'Tout' },
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === range.value
                  ? 'bg-[#001F3F] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Utilisateurs totaux"
          value={analytics.users.total.toString()}
          icon={Users}
          trend={{ value: analytics.users.growth, isPositive: analytics.users.growth >= 0 }}
          subtitle={`+${analytics.users.thisMonth} ce mois`}
        />
        <StatsCard
          title="Réservations"
          value={analytics.bookings.total.toString()}
          icon={Calendar}
          subtitle={`${analytics.bookings.pending} en attente`}
        />
        <StatsCard
          title="Taux de conversion"
          value={`${analytics.bookings.conversionRate}%`}
          icon={Target}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Revenu total"
          value={`${analytics.consultations.revenue}€`}
          icon={DollarSign}
          subtitle="Consultations confirmées"
        />
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Analytics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#001F3F]">Utilisateurs</h2>
            <Users className="h-6 w-6 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.users.total}</p>
                </div>
              </div>
              <div className={`flex items-center gap-1 ${analytics.users.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analytics.users.growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="font-semibold">{Math.abs(analytics.users.growth)}%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Ce mois</p>
                <p className="text-2xl font-bold text-green-600">{analytics.users.thisMonth}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Mois dernier</p>
                <p className="text-2xl font-bold text-gray-600">{analytics.users.lastMonth}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Analytics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#001F3F]">Réservations</h2>
            <Calendar className="h-6 w-6 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm text-gray-600">En attente</p>
                </div>
                <p className="text-2xl font-bold text-yellow-600">{analytics.bookings.pending}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-gray-600">Confirmées</p>
                </div>
                <p className="text-2xl font-bold text-green-600">{analytics.bookings.confirmed}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-gray-600">Rejetées</p>
                </div>
                <p className="text-2xl font-bold text-red-600">{analytics.bookings.rejected}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <p className="text-sm text-gray-600">Ce mois</p>
                </div>
                <p className="text-2xl font-bold text-blue-600">{analytics.bookings.thisMonth}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Consultations Analytics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#001F3F]">Consultations</h2>
            <Briefcase className="h-6 w-6 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
              <p className="text-sm opacity-90">Revenu total</p>
              <p className="text-3xl font-bold">{analytics.consultations.revenue}€</p>
              <p className="text-sm opacity-75 mt-1">
                {analytics.consultations.completed} consultations terminées
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-600">Planifiées</p>
                <p className="text-xl font-bold text-gray-900">{analytics.consultations.scheduled}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-600">En cours</p>
                <p className="text-xl font-bold text-gray-900">{analytics.consultations.inProgress}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-600">Terminées</p>
                <p className="text-xl font-bold text-gray-900">{analytics.consultations.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Analytics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#001F3F]">Messages</h2>
            <MessageSquare className="h-6 w-6 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Total messages</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.messages.total}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Nouveaux</p>
                <p className="text-2xl font-bold text-orange-600">{analytics.messages.new}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Taux de réponse</p>
                <p className="text-2xl font-bold text-green-600">{analytics.messages.responseRate}%</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Temps moyen</p>
                <p className="text-2xl font-bold text-blue-600">{analytics.messages.avgResponseTime}h</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-[#001F3F] mb-6">Vue d'ensemble des performances</h2>
        <div className="space-y-4">
          {/* Conversion Rate Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Taux de conversion</span>
              <span className="text-sm font-bold text-[#001F3F]">{analytics.bookings.conversionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#001F3F] h-2 rounded-full transition-all duration-500"
                style={{ width: `${analytics.bookings.conversionRate}%` }}
              ></div>
            </div>
          </div>

          {/* Response Rate Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Taux de réponse aux messages</span>
              <span className="text-sm font-bold text-green-600">{analytics.messages.responseRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analytics.messages.responseRate}%` }}
              ></div>
            </div>
          </div>

          {/* User Growth Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Croissance utilisateurs</span>
              <span className={`text-sm font-bold ${analytics.users.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analytics.users.growth >= 0 ? '+' : ''}{analytics.users.growth}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${analytics.users.growth >= 0 ? 'bg-green-600' : 'bg-red-600'}`}
                style={{ width: `${Math.min(Math.abs(analytics.users.growth), 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-[#001F3F] to-[#003366] rounded-xl shadow-sm p-6 text-white">
        <h2 className="text-xl font-bold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-left">
            <Calendar className="h-6 w-6 mb-2" />
            <p className="font-semibold">Voir les réservations</p>
            <p className="text-sm opacity-75">{analytics.bookings.pending} en attente</p>
          </button>
          <button className="p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-left">
            <MessageSquare className="h-6 w-6 mb-2" />
            <p className="font-semibold">Répondre aux messages</p>
            <p className="text-sm opacity-75">{analytics.messages.new} nouveaux</p>
          </button>
          <button className="p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-left">
            <Users className="h-6 w-6 mb-2" />
            <p className="font-semibold">Gérer les utilisateurs</p>
            <p className="text-sm opacity-75">{analytics.users.total} total</p>
          </button>
        </div>
      </div>
    </div>
  );
}
