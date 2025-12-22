'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';
import { User, Calendar, FileText, Bell, Settings, LogOut } from 'lucide-react';

export default function ProfileSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { language } = useLanguage();

  const menuItems = [
    {
      title: t('profile.myProfile', language),
      href: '/profile',
      icon: User,
    },
    {
      title: t('profile.myBookings', language),
      href: '/profile/bookings',
      icon: Calendar,
    },
    {
      title: t('profile.myDocuments', language),
      href: '/profile/documents',
      icon: FileText,
    },
    {
      title: t('profile.notifications', language),
      href: '/profile/notifications',
      icon: Bell,
    },
    {
      title: t('profile.settings', language),
      href: '/profile/settings',
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      {/* User Info */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-[#001F3F] text-white rounded-full flex items-center justify-center font-bold text-lg">
              {user?.displayName?.[0] || user?.email?.[0] || 'U'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[#001F3F] truncate">
              {user?.displayName || 'User'}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || 'user@email.com'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                    ? 'bg-[#001F3F] text-white font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200 absolute bottom-0 w-64">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>{t('auth.logout', language)}</span>
        </button>
      </div>
    </aside>
  );
}
