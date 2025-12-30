'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  MessageSquare,
  Globe,
  Briefcase,
  LogOut,
  ChevronRight,
  Image as ImageIcon,
  Palette,
  BarChart3,
  Calendar,
  Bell,
  Receipt,
  Building
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const { t, language } = useLanguage(); // Get t function

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  // Move menuItems inside component or use a hook to get translations
  const menuItems = [
    {
      category: t.admin.dashboard || 'Overview',
      items: [
        { name: t.admin.dashboard || 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: t.admin.analytics || 'Analytics', href: '/admin/analytics', icon: BarChart3 },
      ]
    },
    {
      category: 'Travail', // You might want to add a key for 'Work'
      items: [
        { name: t.admin.calendar || 'Calendar', href: '/admin/calendar', icon: Calendar },
        { name: t.admin.documents || 'Documents', href: '/admin/documents', icon: FileText },
        { name: t.notifications.title || 'Notifications', href: '/admin/send-notification', icon: Bell },
      ]
    },
    {
      category: 'Contenu', // Hardcoded 'Content' translation or add key
      items: [
        { name: t.admin.services || 'Services', href: '/admin/services', icon: Briefcase },
        { name: t.admin.posts || 'Posts', href: '/admin/posts', icon: FileText },
        { name: t.admin.partners || 'Partners', href: '/admin/partners', icon: Users },
        { name: t.galleryView?.title || 'Gallery', href: '/admin/gallery', icon: ImageIcon },
      ]
    },
    {
      category: 'Inquiries',
      items: [
        { name: t.admin.consultations || 'Consultations', href: '/admin/consultations', icon: MessageSquare },
        { name: t.admin.contacts || 'Contacts', href: '/admin/contacts', icon: MessageSquare },
        { name: t.admin.invoicesView?.title || 'Invoices', href: '/admin/invoices', icon: Receipt },
        { name: 'Paramètres Facturation', href: '/admin/invoice-settings', icon: Settings },
      ]
    },
    {
      category: t.common.status || 'Configuration', // Using status as placeholder or create proper category key
      items: [
        { name: 'Entreprise', href: '/admin/company', icon: Building },
        { name: t.admin.homePage || 'Home Page', href: '/admin/settings/homepage', icon: ImageIcon },
        { name: t.admin.siteSettings || 'Site Settings', href: '/admin/settings/site', icon: Settings },
        { name: t.admin.branding || 'Branding', href: '/admin/settings/site?tab=branding', icon: Palette },
      ]
    },
  ];

  return (
    <aside className="w-64 bg-[#001F3F] text-white min-h-screen flex flex-col shadow-2xl z-50">
      {/* Brand */}
      <div className="h-20 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#AA8C2C] flex items-center justify-center text-[#001F3F] font-bold text-xl">
            S
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">SYGMA</h1>
            <span className="text-xs text-[#D4AF37] font-medium tracking-wider">ADMIN PANEL</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        {menuItems.map((section, idx) => (
          <div key={idx}>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
              {section.category}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`group flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${active
                        ? 'bg-[#D4AF37] text-[#001F3F] font-semibold shadow-lg shadow-[#D4AF37]/20'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`h-5 w-5 ${active ? 'text-[#001F3F]' : 'text-gray-400 group-hover:text-white'}`} />
                        <span>{item.name}</span>
                      </div>
                      {active && <ChevronRight className="h-4 w-4" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer / User */}
      <div className="p-4 border-t border-white/10 bg-[#001830]">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 text-red-400 hover:text-red-300 w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">{t.nav.signOut}</span>
        </button>
      </div>
    </aside>
  );
}
