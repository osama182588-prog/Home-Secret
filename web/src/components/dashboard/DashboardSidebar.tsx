'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

interface Props {
  userRole: string;
}

const menuItems = [
  { href: '/dashboard', label: 'الرئيسية', icon: '🏠', roles: ['REVIEWER', 'SENIOR_REVIEWER', 'SUPERVISOR', 'ADMIN'] },
  { href: '/dashboard/verifications', label: 'طلبات التحقق', icon: '✅', roles: ['REVIEWER', 'SENIOR_REVIEWER', 'SUPERVISOR', 'ADMIN'] },
  { href: '/dashboard/rules', label: 'إدارة القوانين', icon: '📜', roles: ['SUPERVISOR', 'ADMIN'] },
  { href: '/dashboard/questions', label: 'بنك الأسئلة', icon: '❓', roles: ['SUPERVISOR', 'ADMIN'] },
  { href: '/dashboard/blacklist', label: 'القائمة السوداء', icon: '🚫', roles: ['SENIOR_REVIEWER', 'SUPERVISOR', 'ADMIN'] },
  { href: '/dashboard/analytics', label: 'الإحصائيات', icon: '📊', roles: ['SUPERVISOR', 'ADMIN'] },
  { href: '/dashboard/settings', label: 'الإعدادات', icon: '⚙️', roles: ['ADMIN'] },
];

export default function DashboardSidebar({ userRole }: Props) {
  const pathname = usePathname();

  const visibleItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-[var(--background-secondary)] border-l border-[var(--border)] min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[var(--border)]">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <div>
            <span className="font-bold text-lg gradient-text">Secret CFW</span>
            <p className="text-xs text-[var(--foreground-muted)]">لوحة التحكم</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <span className="badge badge-info">{userRole}</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="btn btn-secondary w-full text-sm"
        >
          تسجيل الخروج
        </button>
        <Link href="/" className="block text-center text-sm text-[var(--foreground-muted)] mt-3 hover:text-[var(--primary)]">
          ← العودة للموقع
        </Link>
      </div>
    </aside>
  );
}
