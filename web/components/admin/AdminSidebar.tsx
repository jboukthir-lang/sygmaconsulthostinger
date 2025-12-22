'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { LayoutDashboard, Calendar, MessageSquare, Users, BarChart3, FileText, Briefcase, LogOut, Bell, Globe, Settings, Clock, Menu, X, Image as ImageIcon, FileEdit, ShoppingBag } from 'lucide-react';
import { t } from '@/lib/translations';
import { useState } from 'react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      title: t('admin.dashboard', language),
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: t('admin.consultations', language),
      href: '/admin/consultations',
      icon: Briefcase,
    },
    {
      title: t('admin.bookings', language),
      href: '/admin/bookings',
      icon: Calendar,
    },
    {
      title: language === 'ar' ? 'التقويم والمواعيد' : language === 'fr' ? 'Calendrier' : 'Calendar',
      href: '/admin/calendar',
      icon: Clock,
    },
    {
      title: t('admin.messages', language),
      href: '/admin/contacts',
      icon: MessageSquare,
    },
    {
      title: t('admin.users', language),
      href: '/admin/users',
      icon: Users,
    },
    {
      title: t('notifications.title', language),
      href: '/admin/send-notification',
      icon: Bell,
    },
    {
      title: t('admin.documents', language),
      href: '/admin/documents',
      icon: FileText,
    },
    {
      title: language === 'ar' ? 'المنشورات' : language === 'fr' ? 'Articles' : 'Posts',
      href: '/admin/posts',
      icon: FileEdit,
    },
    {
      title: language === 'ar' ? 'الخدمات' : language === 'fr' ? 'Services' : 'Services',
      href: '/admin/services',
      icon: ShoppingBag,
    },
    {
      title: language === 'ar' ? 'صورة الصفحة الرئيسية' : language === 'fr' ? 'Image d\'accueil' : 'Hero Image',
      href: '/admin/hero-image',
      icon: ImageIcon,
    },
    {
      title: t('admin.analytics', language),
      href: '/admin/analytics',
      icon: BarChart3,
    },
    {
      title: t('profile.settings', language),
      href: '/admin/settings',
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

  const toggleLanguage = () => {
    const newLang = language === 'fr' ? 'ar' : language === 'ar' ? 'en' : 'fr';
    setLanguage(newLang);
  };

  const getLanguageLabel = () => {
    switch (language) {
      case 'fr':
        return 'FR';
      case 'ar':
        return 'عربي';
      case 'en':
        return 'EN';
      default:
        return 'FR';
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#001F3F] text-white rounded-lg shadow-lg"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        fixed md:static
        w-64 bg-[#001F3F] text-white min-h-screen flex flex-col
        transition-transform duration-300 ease-in-out
        z-40
      `}>
        {/* Logo */}
        <div className="p-4 sm:p-6 border-b border-white/10">
          <Link href="/admin" className="flex flex-col items-center justify-center gap-2" onClick={() => setIsOpen(false)}>
            <div className="relative w-20 h-20 flex items-center justify-center bg-white rounded-xl p-2">
              <Image
                src="/logo.png"
                alt="Sygma Consult Admin"
                width={80}
                height={80}
                className="object-contain"
                priority
              />
            </div>
            <p className="text-xs text-blue-200 text-center font-medium">Management Portal</p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#D4AF37] text-[#001F3F] font-semibold'
                        : 'text-blue-100 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm">{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-white/10 transition-colors w-full"
            title={t('profile.language', language)}
          >
            <Globe className="h-5 w-5" />
            <span className="font-semibold text-sm">{getLanguageLabel()}</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-white/10 transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm">{t('auth.logout', language)}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
